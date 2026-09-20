import {
  clearReaderEpisodeCache,
  deleteReaderEpisodeCacheByKey,
} from './readerEpisodeCache'
import {
  clearMangaImageCache,
  getMangaImageCacheStats,
} from './mangaImageCacheControl'

const DB_NAME = 'shadow_reader_episode_cache'
const STORE_NAME = 'episodes'
const MODE_KEY = 'shadow_temporary_cache_mode_v1'
const LIMIT_KEY = 'shadow_temporary_cache_limit_gb_v1'
const AGE_KEY = 'shadow_temporary_cache_max_age_days_v1'
const DAY_MS = 86400000
const GB = 1024 ** 3
const AGE_OPTIONS = [0, 3, 7, 30, 90]
let cleanupPromise = null

function readLocal(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, String(value)) } catch { return }
}

export function getTemporaryCachePreferences() {
  const mode = readLocal(MODE_KEY, 'auto') === 'manual' ? 'manual' : 'auto'
  const rawLimit = Number(readLocal(LIMIT_KEY, '1'))
  const rawAge = Number(readLocal(AGE_KEY, '30'))
  return {
    mode,
    limitGb: Number.isInteger(rawLimit) ? Math.max(1, Math.min(5, rawLimit)) : 1,
    ageDays: AGE_OPTIONS.includes(rawAge) ? rawAge : 30,
  }
}

function estimateEntryBytes(entry) {
  if (Number.isFinite(entry?.cacheBytes) && entry.cacheBytes > 0) return entry.cacheBytes
  try { return new Blob([JSON.stringify(entry)]).size } catch { return 4096 }
}

function readReaderEntries() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { resolve([]); return }
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.transaction.abort()
    request.onerror = () => {
      if (request.error?.name === 'AbortError') resolve([])
      else reject(request.error || new Error('READER_CACHE_UNAVAILABLE'))
    }
    request.onsuccess = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) { db.close(); resolve([]); return }
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const values = transaction.objectStore(STORE_NAME).getAll()
      values.onsuccess = () => resolve(values.result || [])
      values.onerror = () => reject(values.error || new Error('READER_CACHE_READ_FAILED'))
      transaction.oncomplete = () => db.close()
      transaction.onabort = () => db.close()
      transaction.onerror = () => db.close()
    }
  })
}

function readerStats(entries) {
  const sizes = { novel: 0, chat_story: 0, manga: 0 }
  for (const entry of entries) {
    if (Object.prototype.hasOwnProperty.call(sizes, entry?.storyType)) {
      sizes[entry.storyType] += estimateEntryBytes(entry)
    }
  }
  return sizes
}

export async function getTemporaryCacheStats() {
  const [entries, imageStats] = await Promise.all([
    readReaderEntries(),
    getMangaImageCacheStats(),
  ])
  const bytes = readerStats(entries)
  const imageBytes = imageStats?.ok ? Math.max(0, Number(imageStats.cachedBytes) || 0) : null
  return {
    novelBytes: bytes.novel,
    chatStoryBytes: bytes.chat_story,
    mangaTextBytes: bytes.manga,
    mangaImageBytes: imageBytes,
    mangaBytes: imageBytes === null ? null : bytes.manga + imageBytes,
    totalBytes: imageBytes === null ? null : bytes.novel + bytes.chat_story + bytes.manga + imageBytes,
    limitBytes: imageStats?.ok ? await getTotalBudget(bytes.novel + bytes.chat_story + bytes.manga + imageBytes, getTemporaryCachePreferences()) : null,
    imageCacheAvailable: imageStats?.ok === true,
  }
}

async function workerMessage(payload) {
  if (!('serviceWorker' in navigator)) throw new Error('SERVICE_WORKER_UNAVAILABLE')
  const registration = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error('SERVICE_WORKER_TIMEOUT')), 10000)),
  ])
  const worker = navigator.serviceWorker.controller || registration.active
  if (!worker) throw new Error('SERVICE_WORKER_UNAVAILABLE')
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()
    const timer = window.setTimeout(() => {
      channel.port1.close()
      reject(new Error('CACHE_SETTINGS_TIMEOUT'))
    }, 15000)
    channel.port1.onmessage = ({ data }) => {
      window.clearTimeout(timer)
      channel.port1.close()
      if (data?.ok) resolve(data)
      else reject(new Error(data?.code || 'CACHE_SETTINGS_FAILED'))
    }
    try { worker.postMessage(payload, [channel.port2]) }
    catch (error) { window.clearTimeout(timer); channel.port1.close(); reject(error) }
  })
}

export async function applyTemporaryCachePreferences(next) {
  const settings = {
    mode: next.mode === 'manual' ? 'manual' : 'auto',
    limitGb: Math.max(1, Math.min(5, Number(next.limitGb) || 1)),
    ageDays: AGE_OPTIONS.includes(Number(next.ageDays)) ? Number(next.ageDays) : 30,
  }
  await workerMessage({ type: 'SHADOW_TEMP_CACHE_SETTINGS_SET', ...settings })
  writeLocal(MODE_KEY, settings.mode)
  writeLocal(LIMIT_KEY, settings.limitGb)
  writeLocal(AGE_KEY, settings.ageDays)
  window.dispatchEvent(new Event('shadow-temporary-cache-settings-changed'))
  return settings
}

async function getTotalBudget(totalBytes, preferences) {
  const selected = preferences.mode === 'manual' ? preferences.limitGb * GB : 5 * GB
  try {
    const { quota, usage } = await navigator.storage.estimate()
    if (!(quota > 0)) return Math.min(GB, selected)
    const reserve = Math.max(GB, Math.floor(quota * 0.15))
    const available = Math.max(0, quota - usage - reserve)
    const budget = Math.max(0, Math.min(selected, Math.floor(quota * 0.2), totalBytes + available))
    return usage / quota >= 0.85 || available < GB ? Math.min(GB, budget) : budget
  } catch { return Math.min(GB, selected) }
}

async function pruneTemporaryCacheNow() {
  const settings = getTemporaryCachePreferences()
  const entries = await readReaderEntries()
  const image = await getMangaImageCacheStats()
  if (!image?.ok) throw new Error('MANGA_CACHE_STATS_UNAVAILABLE')
  const mangaBytes = Math.max(0, Number(image.cachedBytes) || 0)
  const now = Date.now()
  let remaining = entries.map((entry) => ({
    ...entry,
    cacheBytes: estimateEntryBytes(entry),
  }))
  for (const entry of remaining) {
    const lastUsed = Number(entry.lastAccessedAt || entry.savedAt || now)
    const expiresAt = Number(entry.accessExpiresAt || 0)
    if ((expiresAt > 0 && now >= expiresAt) ||
      (settings.ageDays > 0 && now - lastUsed >= settings.ageDays * DAY_MS)) {
      await deleteReaderEpisodeCacheByKey(entry.key)
    }
  }
  remaining = remaining.filter((entry) => {
    const lastUsed = Number(entry.lastAccessedAt || entry.savedAt || now)
    const expiresAt = Number(entry.accessExpiresAt || 0)
    return !((expiresAt > 0 && now >= expiresAt) ||
      (settings.ageDays > 0 && now - lastUsed >= settings.ageDays * DAY_MS))
  })
  let readerBytes = remaining.reduce((sum, entry) => sum + entry.cacheBytes, 0)
  const budget = await getTotalBudget(readerBytes + mangaBytes, settings)
  for (const entry of remaining.sort((a, b) =>
    Number(a.lastAccessedAt || a.savedAt || 0) - Number(b.lastAccessedAt || b.savedAt || 0))) {
    if (readerBytes + mangaBytes <= budget) break
    await deleteReaderEpisodeCacheByKey(entry.key)
    readerBytes -= entry.cacheBytes
  }
  await workerMessage({ type: 'SHADOW_TEMP_CACHE_SETTINGS_SET', ...settings })
  return true
}

export function pruneTemporaryCache() {
  if (!cleanupPromise) cleanupPromise = pruneTemporaryCacheNow().finally(() => { cleanupPromise = null })
  return cleanupPromise
}

export async function clearTemporaryCacheType(type) {
  if (!['novel', 'chat_story', 'manga', 'all'].includes(type)) throw new Error('INVALID_CACHE_TYPE')
  if (type === 'manga' || type === 'all') {
    const result = await clearMangaImageCache({ all: false, includePublic: true })
    if (!result?.ok) throw new Error(result?.code || 'MANGA_CACHE_CLEAR_FAILED')
  }
  if (type === 'all') await clearReaderEpisodeCache()
  else {
    const entries = await readReaderEntries()
    for (const entry of entries) {
      if (entry.storyType === type) await deleteReaderEpisodeCacheByKey(entry.key)
    }
  }
  const remaining = await readReaderEntries()
  if (remaining.some((entry) => type === 'all' || entry.storyType === type)) {
    throw new Error('READER_CACHE_CLEAR_FAILED')
  }
  return getTemporaryCacheStats()
}

export function installTemporaryCacheManagement() {
  if (window.__shadowTemporaryCacheManagementInstalled) return
  window.__shadowTemporaryCacheManagementInstalled = true
  let lastRunAt = 0
  const run = (force = false) => {
    if (document.visibilityState !== 'visible') return
    const now = Date.now()
    if (force !== true && now - lastRunAt < 30 * 60 * 1000) return
    lastRunAt = now
    pruneTemporaryCache().catch(() => {})
  }
  window.setTimeout(run, 12000)
  window.setInterval(run, 60 * 60 * 1000)
  window.addEventListener('focus', () => run())
  window.addEventListener('shadow-temporary-cache-settings-changed', () => run(true))
}

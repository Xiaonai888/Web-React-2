import { getSmartAdAuthToken, getSmartAdReaderKey } from './smartAdClient'

const API_BASE_URL = (
  import.meta.env?.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
).replace(/\/$/, '')

const COMPLETE_PERCENT = 95
const COOLDOWN_MS = 30 * 86400000
const CACHE_MS = 2 * 60000
const FAILURE_RETRY_MS = 15000
const RECENT_SAVE_KEY = 'shadow_reading_progress_recent_v1'
const MAX_CACHED_ACCOUNTS = 4
const caches = new Map()
const pending = new Map()

function progressRevision() {
  try { return sessionStorage.getItem(RECENT_SAVE_KEY) || '' } catch { return '' }
}

function currentReader() {
  const token = getSmartAdAuthToken()
  if (!token) return null
  const readerKey = getSmartAdReaderKey()
  if (!readerKey.startsWith('reader:') || readerKey === 'reader:pending') return null
  return { token, readerKey }
}

export function smartAdCachedStoryPriority(story, progressRows, now = Date.now()) {
  const storyId = String(story?.story_id || '').toLowerCase()
  const row = progressRows?.get(storyId)
  if (!row) return 0
  const published = Math.floor(Number(story?.episode_count) || 0)
  const readNumber = Math.floor(Number(row.episode_number) || 0)
  const savedTotal = Math.floor(Number(row.total_episodes) || 0)
  const percent = Number(row.reading_percent) || 0
  const lastRead = Date.parse(row.last_read_at || '')
  if (!published || readNumber < published || savedTotal < published ||
    percent < COMPLETE_PERCENT || !Number.isFinite(lastRead) || lastRead > now) return 0
  return now - lastRead < COOLDOWN_MS ? 2 : 1
}

export async function getCachedSmartAdReadingProgress() {
  const reader = currentReader()
  if (!reader) return new Map()
  const revision = progressRevision()
  const key = reader.readerKey
  const now = Date.now()
  const entry = caches.get(key)
  if (entry && entry.expiresAt > now && entry.revision === revision) return entry.rows
  if (pending.has(key)) return pending.get(key)

  const request = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reading-progress?limit=30`, {
        headers: { Authorization: `Bearer ${reader.token}` },
        cache: 'no-store',
        credentials: 'omit',
      })
      if (!response.ok) throw new Error(`Reading progress HTTP ${response.status}`)
      const data = await response.json()
      if (data?.ok !== true || !Array.isArray(data?.items)) throw new Error('Invalid reading progress')
      const rows = new Map()
      for (const item of data.items) {
        const id = String(item?.story_id || '').toLowerCase()
        if (id && !rows.has(id)) rows.set(id, item)
      }
      const currentRevision = progressRevision()
      caches.set(key, { rows, revision: currentRevision, expiresAt: Date.now() + CACHE_MS })
      while (caches.size > MAX_CACHED_ACCOUNTS) caches.delete(caches.keys().next().value)
      return rows
    } catch {
      const rows = entry?.rows || new Map()
      caches.set(key, { rows, revision, expiresAt: Date.now() + FAILURE_RETRY_MS })
      return rows
    }
  })().finally(() => {
    if (pending.get(key) === request) pending.delete(key)
  })
  pending.set(key, request)
  return request
}

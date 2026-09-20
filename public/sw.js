const MANGA_CACHE_PREFIX = 'shadow-manga-images-v1:'
const META_DB_NAME = 'shadow_manga_image_cache_meta'
const META_DB_VERSION = 1
const EPISODE_STORE = 'episodes'

const DAY_MS = 24 * 60 * 60 * 1000
const MANGA_TTL_MS = 365 * DAY_MS
const MAX_MANGA_EPISODES = 10000
const HARD_MAX_BYTES = 5 * 1024 * 1024 * 1024
const FALLBACK_IMAGE_BYTES = 512 * 1024
const QUOTA_BUDGET_RATIO = 0.2
const STORAGE_PRESSURE_RATIO = 0.85

const clientContexts = new Map()
const iosDiagnosticClients = new Set()

const SPLASH_CACHE_NAME = 'shadow-splash-assets-v1'
const SPLASH_ASSETS = [
  '/assets/Icons/Splash%20Screen/Background.webp',
  '/assets/Icons/Splash%20Screen/Moon.webp',
  '/assets/Icons/Splash%20Screen/Purple%20smoke%20flying.webp',
  '/assets/Icons/Splash%20Screen/Reaper.webp',
  '/assets/Icons/Splash%20Screen/Lamp.webp',
  '/assets/Icons/Splash%20Screen/Butterfly.webp',
  '/assets/Icons/Splash%20Screen/Wing.webp',
  '/assets/Icons/Splash%20Screen/Paper1.webp',
  '/assets/Icons/Splash%20Screen/Papper2.webp',
  '/assets/Icons/Splash%20Screen/Papper3.webp',
  '/assets/Icons/Splash%20Screen/Light%20Spark.webp',
]

const SPLASH_ASSET_PATHS = new Set(SPLASH_ASSETS)

async function precacheSplashAssets() {
  const cache = await caches.open(SPLASH_CACHE_NAME)

  await Promise.allSettled(
    SPLASH_ASSETS.map(async (path) => {
      const request = new Request(
        new URL(path, self.location.origin).href,
        { cache: 'reload' }
      )
      const response = await fetch(request)

      if (response.ok) {
        await cache.put(request, response)
      }
    })
  )
}

function isSplashAssetRequest(url) {
  return (
    url.origin === self.location.origin &&
    SPLASH_ASSET_PATHS.has(url.pathname)
  )
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeTime(value) {
  if (!value) return 0

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function normalizeBytes(value) {
  const bytes = Number(value || 0)
  return Number.isFinite(bytes) && bytes > 0
    ? Math.floor(bytes)
    : 0
}

function tokenFingerprint(token) {
  const value = normalizeText(token)
  if (!value) return ''

  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(hash >>> 0).toString(36)}`
}

function requestReaderScope(request) {
  const authorization =
    request.headers.get('Authorization') || ''

  if (!authorization.startsWith('Bearer ')) {
    return ''
  }

  return tokenFingerprint(
    authorization.slice(7).trim()
  )
}

function safeScope(value) {
  const scope = normalizeText(value) || 'public'
  return scope.replace(/[^a-zA-Z0-9_-]/g, '_')
}

function cacheNameForScope(scope) {
  return `${MANGA_CACHE_PREFIX}${safeScope(scope)}`
}

function buildEpisodeKey(scope, storyId, episodeId) {
  const safeStoryId = normalizeText(storyId)
  const safeEpisodeId = normalizeText(episodeId)
  const safeEpisodeScope = normalizeText(scope)

  if (
    !safeEpisodeScope ||
    !safeStoryId ||
    !safeEpisodeId
  ) {
    return ''
  }

  return [
    safeEpisodeScope,
    safeStoryId,
    safeEpisodeId,
  ].join(':')
}

function parseEpisodeApiUrl(url) {
  const match = url.pathname.match(
    /^\/api\/public\/stories\/([^/]+)\/episodes\/([^/]+)\/?$/
  )

  if (!match) return null

  try {
    return {
      storyId: decodeURIComponent(match[1]),
      episodeId: decodeURIComponent(match[2]),
    }
  } catch {
    return {
      storyId: match[1],
      episodeId: match[2],
    }
  }
}

function isMangaImageRequestUrl(url) {
  const pathname = String(url?.pathname || '')

  return /\/episode-content\/[^/]+\/manga(?:-v2)?\//.test(
    pathname
  )
}

function fallbackImageResponse() {
  return new Response(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
    {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store',
      },
    }
  )
}

function parseReaderClientUrl(value) {
  try {
    const url = new URL(value)
    const match = url.pathname.match(
      /^\/story\/([^/]+)\/episode\/([^/]+)/
    )

    if (!match) return null

    try {
      return {
        storyId: decodeURIComponent(match[1]),
        episodeId: decodeURIComponent(match[2]),
      }
    } catch {
      return {
        storyId: match[1],
        episodeId: match[2],
      }
    }
  } catch {
    return null
  }
}

function openMetaDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      META_DB_NAME,
      META_DB_VERSION
    )

    request.onupgradeneeded = () => {
      const database = request.result

      if (
        !database.objectStoreNames.contains(
          EPISODE_STORE
        )
      ) {
        const store = database.createObjectStore(
          EPISODE_STORE,
          {
            keyPath: 'key',
          }
        )

        store.createIndex(
          'storyId',
          'storyId',
          {
            unique: false,
          }
        )

        store.createIndex(
          'lastAccessedAt',
          'lastAccessedAt',
          {
            unique: false,
          }
        )
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(
        request.error ||
          new Error(
            'Could not open manga image cache metadata'
          )
      )
    }
  })
}

function runMetaTransaction(mode, action) {
  return openMetaDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        let requestResult

        const transaction =
          database.transaction(
            EPISODE_STORE,
            mode
          )

        const store =
          transaction.objectStore(
            EPISODE_STORE
          )

        try {
          const request = action(store)

          if (request) {
            request.onsuccess = () => {
              requestResult = request.result
            }

            request.onerror = () => {
              reject(
                request.error ||
                  new Error(
                    'Manga image cache metadata operation failed'
                  )
              )
            }
          }
        } catch (error) {
          database.close()
          reject(error)
          return
        }

        transaction.oncomplete = () => {
          database.close()
          resolve(requestResult)
        }

        transaction.onerror = () => {
          const error =
            transaction.error ||
            new Error(
              'Manga image cache metadata transaction failed'
            )

          database.close()
          reject(error)
        }

        transaction.onabort = () => {
          const error =
            transaction.error ||
            new Error(
              'Manga image cache metadata transaction aborted'
            )

          database.close()
          reject(error)
        }
      })
  )
}

async function getEpisodeRecord(key) {
  if (!key) return null

  try {
    return (
      (await runMetaTransaction(
        'readonly',
        (store) => store.get(key)
      )) || null
    )
  } catch {
    return null
  }
}

async function getAllEpisodeRecords() {
  try {
    return (
      (await runMetaTransaction(
        'readonly',
        (store) => store.getAll()
      )) || []
    )
  } catch {
    return []
  }
}

async function putEpisodeRecord(record) {
  if (!record?.key) return null

  try {
    await runMetaTransaction(
      'readwrite',
      (store) => store.put(record)
    )
    return record
  } catch {
    return null
  }
}

async function deleteEpisodeRecordOnly(key) {
  if (!key) return

  try {
    await runMetaTransaction(
      'readwrite',
      (store) => store.delete(key)
    )
  } catch {
    return
  }
}

function extractMangaImages(episode) {
  const images = []
  const seen = new Set()

  for (const page of episode?.pages || []) {
    const parts =
      Array.isArray(page?.parts) &&
      page.parts.length
        ? page.parts
        : [page]

    for (const item of parts) {
      const url = normalizeText(
        item?.image_url
      )

      if (!url || seen.has(url)) {
        continue
      }

      seen.add(url)

      images.push({
        url,
        bytes:
          normalizeBytes(
            item?.file_size
          ) ||
          FALLBACK_IMAGE_BYTES,
      })
    }
  }

  return images
}

function imageDeclaredBytes(record, url) {
  const image = (
    record?.images || []
  ).find(
    (item) =>
      normalizeText(item?.url) ===
      normalizeText(url)
  )

  return (
    normalizeBytes(image?.bytes) ||
    FALLBACK_IMAGE_BYTES
  )
}

function recordHasImage(record, url) {
  const target = normalizeText(url)

  return Boolean(
    target &&
      (record?.images || []).some(
        (item) =>
          normalizeText(item?.url) ===
          target
      )
  )
}

function isRecordExpired(record, now = Date.now(), ageDays = MANGA_TTL_MS / DAY_MS) {
  if (!record) return true
  const accessExpiresAt = normalizeTime(record.accessExpiresAt)
  if (accessExpiresAt > 0 && now >= accessExpiresAt) return true
  const lastUsed = Number(record.lastAccessedAt || record.savedAt || now)
  return ageDays > 0 && lastUsed > 0 && now - lastUsed >= ageDays * DAY_MS
}

async function deleteCachedEpisode(record) {
  if (!record?.key) return

  const cache = await caches.open(
    cacheNameForScope(record.scope)
  )

  await Promise.all(
    (record.images || []).map(
      (image) =>
        cache
          .delete(image.url)
          .catch(() => false)
    )
  )

  await deleteEpisodeRecordOnly(
    record.key
  )
}

async function getStorageSnapshot() {
  let quota = 0
  let usage = 0
  let persistent = false

  try {
    const estimate =
      await self.navigator.storage.estimate()

    quota = normalizeBytes(
      estimate?.quota
    )

    usage = normalizeBytes(
      estimate?.usage
    )
  } catch {
  }

  try {
    if (
      self.navigator.storage?.persisted
    ) {
      persistent = Boolean(
        await self.navigator.storage.persisted()
      )
    }
  } catch {
    persistent = false
  }

  return {
    quota,
    usage,
    persistent,
  }
}

async function getMangaCacheStats(
  requestedScope = ''
) {
  const scope =
    normalizeText(requestedScope)

  const records =
    await getAllEpisodeRecords()

  const visibleRecords =
    scope && scope !== 'public'
      ? records.filter(
          (record) =>
            record.scope === scope ||
            record.scope === 'public'
        )
      : records.filter(
          (record) =>
            record.scope === 'public'
        )

  const storage =
    await getStorageSnapshot()

  const budget =
    await getStorageBudget(records, storage)

  const cachedBytes =
    visibleRecords.reduce(
      (sum, record) =>
        sum +
        normalizeBytes(
          record.cachedBytes
        ),
      0
    )

  const imageCount =
    visibleRecords.reduce(
      (sum, record) =>
        sum +
        (
          Array.isArray(
            record.cachedUrls
          )
            ? record.cachedUrls.length
            : 0
        ),
      0
    )

  return {
    ok: true,
    scope:
      scope || 'public',
    episodeCount:
      visibleRecords.length,
    imageCount,
    cachedBytes,
    cachedMegabytes:
      Number(
        (
          cachedBytes /
          (1024 * 1024)
        ).toFixed(2)
      ),
    cachedGigabytes:
      Number(
        (
          cachedBytes /
          (1024 * 1024 * 1024)
        ).toFixed(3)
      ),
    maxEpisodes:
      MAX_MANGA_EPISODES,
    hardMaxBytes:
      HARD_MAX_BYTES,
    budgetBytes:
      normalizeBytes(
        budget.budgetBytes
      ),
    quotaBytes:
      storage.quota,
    usageBytes:
      storage.usage,
    persistent:
      storage.persistent,
  }
}

async function clearMangaCache({
  requestedScope = '',
  all = false,
  includePublic = true,
} = {}) {
  const scope =
    normalizeText(requestedScope)

  const records =
    await getAllEpisodeRecords()

  const targets = all
    ? records
    : records.filter(
        (record) => {
          if (
            scope &&
            record.scope === scope
          ) {
            return true
          }

          return Boolean(
            includePublic &&
            record.scope === 'public'
          )
        }
      )

  await Promise.all(
    targets.map((record) =>
      deleteCachedEpisode(record)
    )
  )

  if (all) {
    const names =
      await caches.keys()

    await Promise.all(
      names
        .filter((name) =>
          name.startsWith(
            MANGA_CACHE_PREFIX
          )
        )
        .map((name) =>
          caches.delete(name)
        )
    )
  }

  return {
    ok: true,
    clearedEpisodes:
      targets.length,
  }
}

function replyToMessage(
  event,
  payload
) {
  const port =
    event.ports?.[0]

  if (!port) return
  port.postMessage(payload)
}

const TEMP_CACHE_SETTINGS_NAME = 'shadow-temporary-cache-settings-v1'
const TEMP_CACHE_SETTINGS_URL = new URL('/__shadow_temporary_cache_settings_v1__', self.location.origin).href

async function readTemporaryCacheSettings() {
  try {
    const cache = await caches.open(TEMP_CACHE_SETTINGS_NAME)
    const saved = await cache.match(TEMP_CACHE_SETTINGS_URL)
    const data = saved ? await saved.json() : {}
    return {
      mode: data.mode === 'manual' ? 'manual' : 'auto',
      limitGb: Number.isInteger(data.limitGb) && data.limitGb >= 1 && data.limitGb <= 5 ? data.limitGb : 1,
      ageDays: [0, 3, 7, 30, 90].includes(data.ageDays) ? data.ageDays : 30,
    }
  } catch {
    return { mode: 'auto', limitGb: 1, ageDays: 30 }
  }
}

async function saveTemporaryCacheSettings(data) {
  const mode = data?.mode === 'manual' ? 'manual' : 'auto'
  const input = Number(data?.limitGb)
  const limitGb = Number.isInteger(input) && input >= 1 && input <= 5 ? input : 1
  const ageDays = [0, 3, 7, 30, 90].includes(Number(data?.ageDays)) ? Number(data.ageDays) : 30
  const settings = { mode, limitGb, ageDays }
  const cache = await caches.open(TEMP_CACHE_SETTINGS_NAME)
  await cache.put(TEMP_CACHE_SETTINGS_URL, new Response(JSON.stringify(settings), {
    headers: { 'Content-Type': 'application/json' },
  }))
  readerBytesLastCheckedAt = 0
  await pruneMangaCache()
  return { ok: true, ...settings }
}

let readerBytesSnapshot = 0
let readerBytesLastCheckedAt = 0
let readerBytesPending = null

async function getReaderCacheBytes() {
  if (readerBytesLastCheckedAt && Date.now() - readerBytesLastCheckedAt < 15 * 1000) {
    return readerBytesSnapshot
  }
  if (readerBytesPending) return readerBytesPending
  readerBytesPending = (async () => {
    let database = null
    try {
      database = await new Promise((resolve, reject) => {
        const request = self.indexedDB.open('shadow_reader_episode_cache', 1)
        request.onupgradeneeded = () => request.transaction.abort()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      if (!database.objectStoreNames.contains('episodes')) return 0
      return await new Promise((resolve, reject) => {
        const transaction = database.transaction('episodes', 'readonly')
        const request = transaction.objectStore('episodes').getAll()
        request.onsuccess = () => {
          const bytes = (request.result || []).reduce((sum, entry) => {
            if (Number.isFinite(entry?.cacheBytes) && entry.cacheBytes > 0) return sum + entry.cacheBytes
            try { return sum + new Blob([JSON.stringify(entry)]).size }
            catch { return sum + 4096 }
          }, 0)
          resolve(bytes)
        }
        request.onerror = () => reject(request.error)
        transaction.onabort = () => reject(transaction.error)
        transaction.onerror = () => reject(transaction.error)
      })
    } finally {
      if (database) database.close()
    }
  })().then((bytes) => {
    readerBytesSnapshot = bytes
    readerBytesLastCheckedAt = Date.now()
    return bytes
  }).catch(() => { readerBytesLastCheckedAt = Date.now(); return readerBytesSnapshot }).finally(() => { readerBytesPending = null })
  return readerBytesPending
}

async function getStorageBudget(existingRecords = null, storageSnapshot = null) {
  const GB = 1024 * 1024 * 1024
  const settings = await readTemporaryCacheSettings()
  const readerBytes = await getReaderCacheBytes()
  const selectedLimit = Math.max(0, (settings.mode === 'manual' ? settings.limitGb * GB : HARD_MAX_BYTES) - readerBytes)
  let quota = 0
  let usage = 0
  try {
    const estimate = storageSnapshot || await self.navigator.storage.estimate()
    quota = normalizeBytes(estimate?.quota)
    usage = normalizeBytes(estimate?.usage)
  } catch {
    return { budgetBytes: selectedLimit, pressured: false }
  }
  if (!quota) return { budgetBytes: selectedLimit, pressured: false }

  const records = Array.isArray(existingRecords) ? existingRecords : await getAllEpisodeRecords()
  const cachedBytes = records.reduce(
    (total, record) => total + normalizeBytes(record.cachedBytes), 0
  )
  const reserve = Math.max(GB, Math.floor(quota * 0.15))
  const available = Math.max(0, quota - usage - reserve)
  const budgetBytes = Math.max(0, Math.min(
    selectedLimit,
    HARD_MAX_BYTES,
    Math.max(0, Math.floor(quota * QUOTA_BUDGET_RATIO) - readerBytes),
    cachedBytes + available
  ))
  const pressured = usage / quota >= STORAGE_PRESSURE_RATIO || available < GB
  return {
    budgetBytes: pressured ? Math.min(GB, budgetBytes) : budgetBytes,
    pressured,
  }
}

async function pruneMangaCache({
  aggressive = false,
} = {}) {
  const now = Date.now()
  let records =
    await getAllEpisodeRecords()

  const ageDays = (await readTemporaryCacheSettings()).ageDays
  const expired = records.filter((record) => isRecordExpired(record, now, ageDays))

  await Promise.all(
    expired.map((record) =>
      deleteCachedEpisode(record)
    )
  )

  const expiredKeys = new Set(
    expired.map((record) => record.key)
  )

  records = records
    .filter(
      (record) =>
        !expiredKeys.has(record.key)
    )
    .sort(
      (left, right) =>
        Number(
          right.lastAccessedAt || 0
        ) -
        Number(
          left.lastAccessedAt || 0
        )
    )

  const episodeOverflow =
    records.slice(
      MAX_MANGA_EPISODES
    )

  await Promise.all(
    episodeOverflow.map((record) =>
      deleteCachedEpisode(record)
    )
  )

  const overflowKeys = new Set(
    episodeOverflow.map(
      (record) => record.key
    )
  )

  records = records.filter(
    (record) =>
      !overflowKeys.has(record.key)
  )

  const storage =
    await getStorageBudget(records)

  const budgetBytes =
    aggressive || storage.pressured
      ? Math.max(
          1,
          Math.floor(
            storage.budgetBytes * 0.7
          )
        )
      : storage.budgetBytes

  let totalBytes = records.reduce(
    (sum, record) =>
      sum +
      normalizeBytes(
        record.cachedBytes
      ),
    0
  )

  if (totalBytes <= budgetBytes) {
    return
  }

  const oldestFirst =
    [...records].sort(
      (left, right) =>
        Number(
          left.lastAccessedAt || 0
        ) -
        Number(
          right.lastAccessedAt || 0
        )
    )

  for (const record of oldestFirst) {
    if (totalBytes <= budgetBytes) {
      break
    }

    totalBytes -= normalizeBytes(
      record.cachedBytes
    )

    await deleteCachedEpisode(
      record
    )
  }
}

async function touchEpisodeRecord(key) {
  const record =
    await getEpisodeRecord(key)

  if (!record) return

  await putEpisodeRecord({
    ...record,
    lastAccessedAt: Date.now(),
  })
}

async function markImageCached(
  recordKey,
  imageUrl
) {
  const record =
    await getEpisodeRecord(recordKey)

  if (!record) return

  const cachedUrls = new Set(
    Array.isArray(record.cachedUrls)
      ? record.cachedUrls
      : []
  )

  cachedUrls.add(imageUrl)

  let cachedBytes = 0

  for (const url of cachedUrls) {
    cachedBytes += imageDeclaredBytes(
      record,
      url
    )
  }

  await putEpisodeRecord({
    ...record,
    cachedUrls: [...cachedUrls],
    cachedBytes,
    lastAccessedAt: Date.now(),
  })
}

async function removeStaleEpisodeVariants({
  storyId,
  episodeId,
  scope,
  updatedAt,
}) {
  const records =
    await getAllEpisodeRecords()

  for (const record of records) {
    if (
      normalizeText(record.storyId) !==
        normalizeText(storyId) ||
      normalizeText(record.episodeId) !==
        normalizeText(episodeId)
    ) {
      continue
    }

    const versionChanged =
      normalizeText(record.updatedAt) &&
      normalizeText(updatedAt) &&
      normalizeText(record.updatedAt) !==
        normalizeText(updatedAt)

    const publicBecamePrivate =
      scope !== 'public' &&
      record.scope === 'public'

    const privateBecamePublic =
      scope === 'public' &&
      record.scope !== 'public'

    if (
      versionChanged ||
      publicBecamePrivate ||
      privateBecamePublic
    ) {
      await deleteCachedEpisode(
        record
      )
    }
  }
}

async function registerMangaEpisode({
  scope,
  storyId,
  episodeId,
  episode,
  updatedAt,
  accessExpiresAt,
}) {
  const images =
    extractMangaImages(episode)

  if (!images.length) return

  const key = buildEpisodeKey(
    scope,
    storyId,
    episodeId
  )

  if (!key) return

  await removeStaleEpisodeVariants({
    storyId,
    episodeId,
    scope,
    updatedAt,
  })

  const existing =
    await getEpisodeRecord(key)

  const sameVersion =
    existing &&
    normalizeText(
      existing.updatedAt
    ) === normalizeText(updatedAt)

  const nextUrls = new Set(
    images.map((image) => image.url)
  )

  const cachedUrls = sameVersion
    ? (
        Array.isArray(
          existing.cachedUrls
        )
          ? existing.cachedUrls
          : []
      ).filter((url) =>
        nextUrls.has(url)
      )
    : []

  let cachedBytes = 0

  for (const url of cachedUrls) {
    const image = images.find(
      (item) => item.url === url
    )

    cachedBytes +=
      normalizeBytes(image?.bytes) ||
      FALLBACK_IMAGE_BYTES
  }

  const now = Date.now()

  await putEpisodeRecord({
    key,
    scope,
    storyId: normalizeText(storyId),
    episodeId:
      normalizeText(episodeId),
    updatedAt:
      normalizeText(updatedAt),
    accessExpiresAt:
      normalizeTime(
        accessExpiresAt
      ),
    images,
    cachedUrls,
    cachedBytes,
    savedAt:
      sameVersion &&
      existing?.savedAt
        ? existing.savedAt
        : now,
    lastAccessedAt: now,
  })

  await pruneMangaCache()
}

async function invalidateLockedEpisode(
  request,
  route
) {
  const scope =
    requestReaderScope(request)

  if (!scope) return

  const key = buildEpisodeKey(
    scope,
    route.storyId,
    route.episodeId
  )

  const record =
    await getEpisodeRecord(key)

  if (record) {
    await deleteCachedEpisode(record)
  }
}

async function processEpisodeApiResponse(
  request,
  response,
  clientId,
  route
) {
  if (
    response.status === 423 ||
    response.status === 401 ||
    response.status === 403
  ) {
    await invalidateLockedEpisode(
      request,
      route
    )
    return
  }

  if (!response.ok) return

  let payload

  try {
    payload = await response.json()
  } catch {
    return
  }

  if (
    payload?.ok === false ||
    payload?.locked === true ||
    !payload?.episode
  ) {
    return
  }

  const storyType = normalizeText(
    payload?.story?.story_type ||
      payload?.episode?.story_type
  ).toLowerCase()

  if (storyType !== 'manga') {
    return
  }

  const privateAccess =
    payload?.cache_access
      ?.private_access === true

  const privateScope =
    requestReaderScope(request)

  if (
    privateAccess &&
    !privateScope
  ) {
    return
  }

  const scope = privateAccess
    ? privateScope
    : 'public'

  if (clientId) {
    clientContexts.set(clientId, {
      scope: privateScope || 'public',
      storyId: route.storyId,
      episodeId: route.episodeId,
      updatedAt: Date.now(),
    })
  }

  await registerMangaEpisode({
    scope,
    storyId: route.storyId,
    episodeId: route.episodeId,
    episode: payload.episode,
    updatedAt:
      payload.episode.updated_at ||
      null,
    accessExpiresAt:
      privateAccess
        ? payload?.cache_access
            ?.expires_at || null
        : null,
  })
}

async function resolveClientContext(
  clientId
) {
  if (!clientId) return null

  const memory =
    clientContexts.get(clientId)

  let route = null

  try {
    const client =
      await self.clients.get(
        clientId
      )

    route = parseReaderClientUrl(
      client?.url
    )
  } catch {
    route = null
  }

  if (!route && !memory) {
    return null
  }

  if (
    memory &&
    route &&
    normalizeText(
      memory.storyId
    ) ===
      normalizeText(
        route.storyId
      ) &&
    normalizeText(
      memory.episodeId
    ) ===
      normalizeText(
        route.episodeId
      )
  ) {
    return {
      ...memory,
      ...route,
    }
  }

  if (route) {
    return {
      scope: 'public',
      ...route,
    }
  }

  return memory
}

async function findEpisodeForImage(
  context,
  imageUrl
) {
  if (
    !context?.storyId ||
    !context?.episodeId
  ) {
    return null
  }

  const scopes = [
    normalizeText(context.scope),
    'public',
  ].filter(Boolean)
  const ageDays = (await readTemporaryCacheSettings()).ageDays

  for (const scope of [
    ...new Set(scopes),
  ]) {
    const key = buildEpisodeKey(
      scope,
      context.storyId,
      context.episodeId
    )

    const record =
      await getEpisodeRecord(key)

    if (!record) continue

    if (isRecordExpired(record, Date.now(), ageDays)) {
      await deleteCachedEpisode(
        record
      )
      continue
    }

    if (
      recordHasImage(
        record,
        imageUrl
      )
    ) {
      return record
    }
  }

  return null
}

async function prepareMangaImageResponse(
  event
) {
  const context =
    await resolveClientContext(
      event.clientId
    )

  if (!context) {
    return {
      response:
        await fetch(event.request),
      record: null,
      cache: null,
      cacheResponse: null,
      cacheHit: false,
    }
  }

  const record =
    await findEpisodeForImage(
      context,
      event.request.url
    )

  if (!record) {
    return {
      response:
        await fetch(event.request),
      record: null,
      cache: null,
      cacheResponse: null,
      cacheHit: false,
    }
  }

  const cache = await caches.open(
    cacheNameForScope(record.scope)
  )

  const cached =
    await cache.match(
      event.request
    )

  if (cached) {
    return {
      response: cached,
      record,
      cache,
      cacheResponse: null,
      cacheHit: true,
    }
  }

  const response =
    await fetch(event.request)

  const cacheable =
    response.ok ||
    response.type === 'opaque'

  return {
    response,
    record,
    cache,
    cacheResponse: cacheable
      ? response.clone()
      : null,
    cacheHit: false,
  }
}

let lastMangaImagePruneAt = 0
let mangaImagePrunePending = null

async function pruneMangaCacheAfterImage() {
  if (mangaImagePrunePending) return mangaImagePrunePending
  if (lastMangaImagePruneAt && Date.now() - lastMangaImagePruneAt < 15000) return
  lastMangaImagePruneAt = Date.now()
  mangaImagePrunePending = pruneMangaCache().finally(() => { mangaImagePrunePending = null })
  return mangaImagePrunePending
}

async function finishMangaImageWork(
  event,
  result
) {
  if (!result?.record) return

  if (result.cacheHit) {
    await touchEpisodeRecord(
      result.record.key
    )
    return
  }

  if (
    !result.cache ||
    !result.cacheResponse
  ) {
    return
  }

  const retryResponse =
    result.cacheResponse.clone()

  try {
    await result.cache.put(
      event.request,
      result.cacheResponse
    )
  } catch {
    await pruneMangaCache({
      aggressive: true,
    })

    try {
      await result.cache.put(
        event.request,
        retryResponse
      )
    } catch {
      return
    }
  }

  await markImageCached(
    result.record.key,
    event.request.url
  )

  await pruneMangaCacheAfterImage()
}

async function processClientEpisodePayload(
  data,
  clientId
) {
  const payload = data?.payload

  if (
    payload?.ok === false ||
    payload?.locked === true ||
    !payload?.episode
  ) {
    return
  }

  const storyType = normalizeText(
    payload?.story?.story_type ||
      payload?.episode?.story_type
  ).toLowerCase()

  if (storyType !== 'manga') {
    return
  }

  const storyId =
    normalizeText(data.storyId)

  const episodeId =
    normalizeText(data.episodeId)

  if (!storyId || !episodeId) {
    return
  }

  const privateAccess =
    payload?.cache_access
      ?.private_access === true

  const suppliedScope =
    normalizeText(data.scope)

  if (
    privateAccess &&
    (!suppliedScope ||
      suppliedScope === 'public')
  ) {
    return
  }

  const scope = privateAccess
    ? suppliedScope
    : 'public'

  if (clientId) {
    clientContexts.set(clientId, {
      scope:
        suppliedScope || 'public',
      storyId,
      episodeId,
      updatedAt: Date.now(),
    })
  }

  await registerMangaEpisode({
    scope,
    storyId,
    episodeId,
    episode: payload.episode,
    updatedAt:
      payload.episode.updated_at ||
      null,
    accessExpiresAt:
      privateAccess
        ? payload?.cache_access
            ?.expires_at || null
        : null,
  })
}

self.addEventListener(
  'message',
  (event) => {
    const data = event.data

    if (data?.type === 'SHADOW_TEMP_CACHE_SETTINGS_SET') {
      event.waitUntil(
        saveTemporaryCacheSettings(data)
          .then((result) => replyToMessage(event, result))
          .catch(() => replyToMessage(event, { ok: false, code: 'CACHE_SETTINGS_SAVE_FAILED' }))
      )
      return
    }

    if (
      data?.type ===
      'SHADOW_MANGA_CACHE_STATS'
    ) {
      event.waitUntil(
        getMangaCacheStats(
          data.scope
        )
          .then((result) =>
            replyToMessage(
              event,
              result
            )
          )
          .catch(() =>
            replyToMessage(
              event,
              {
                ok: false,
                code:
                  'MANGA_CACHE_STATS_FAILED',
              }
            )
          )
      )
      return
    }

    if (
      data?.type ===
      'SHADOW_MANGA_CACHE_CLEAR'
    ) {
      event.waitUntil(
        clearMangaCache({
          requestedScope:
            data.scope,
          all:
            data.all === true,
          includePublic:
            data.includePublic !== false,
        })
          .then((result) =>
            replyToMessage(
              event,
              result
            )
          )
          .catch(() =>
            replyToMessage(
              event,
              {
                ok: false,
                code:
                  'MANGA_CACHE_CLEAR_FAILED',
              }
            )
          )
      )
      return
    }

        const clientId =
      event.source?.id

    if (!clientId) return

    if (data?.type === 'SHADOW_READER_CONTEXT' && data.iosDiagnostic === true) {
      iosDiagnosticClients.add(clientId)
    }

    if (
      data?.type ===
      'SHADOW_MANGA_EPISODE_PAYLOAD'
    ) {
      event.waitUntil(
        processClientEpisodePayload(
          data,
          clientId
        )
      )
      return
    }

    if (
      data?.type !==
      'SHADOW_READER_CONTEXT'
    ) {
      return
    }

    const storyId =
      normalizeText(data.storyId)

    const episodeId =
      normalizeText(data.episodeId)

    if (!storyId || !episodeId) {
      clientContexts.delete(clientId)
      return
    }

    clientContexts.set(clientId, {
      scope:
        normalizeText(data.scope) ||
        'public',
      storyId,
      episodeId,
      updatedAt: Date.now(),
    })
  }
)

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
  precacheSplashAssets().catch(() => {})
})

self.addEventListener(
  'activate',
  (event) => {
    event.waitUntil(
      (async () => {
        await self.clients.claim()
        try {
          const names = await caches.keys()
          await Promise.all(
            names
              .filter((name) =>
                name.startsWith('shadow-manga-images-') &&
                !name.startsWith(MANGA_CACHE_PREFIX)
              )
              .map((name) => caches.delete(name))
          )
          await pruneMangaCache()
        } catch (error) {
          console.error('SHADOW_SW_CACHE_CLEANUP_FAILED', error)
        }
      })()
    )
  }
)

self.addEventListener(
  'fetch',
  (event) => {
    const request = event.request

    if (request.method !== 'GET') {
      return
    }

    let url

    try {
      url = new URL(request.url)
    } catch {
      return
    }

    if (request.mode === 'navigate' && url.origin === self.location.origin) {
  event.respondWith((async () => {
    const selected = (request.headers.get('Accept-Language') || self.navigator.language || 'en').toLowerCase()
    const language = ['en', 'km', 'zh', 'ja', 'ko', 'th'].find((item) => selected === item || selected.startsWith(`${item}-`)) || 'en'
    const messages = {
      en: {
        server: ['Shadow is temporarily unavailable', 'Shadow returned a server error (HTTP {status}). This is a Shadow service issue, not a problem with your device.', 'Please try again later. If the problem continues, contact Shadow Support.'],
        offline: ['Your device reports that it is offline', 'Your device currently reports no internet connection. Shadow cannot load the page.', 'Check Wi-Fi or mobile data, then try again.'],
        unknown: ['Shadow could not be reached', 'The page request failed, but we cannot yet tell whether the cause is your connection or Shadow. Your account and age have not been identified as the cause.', 'Try another website to check your connection. If it works, contact Shadow Support with the error code below.'],
        retry: 'Try again', owner: 'Diagnosis', code: 'Error code', serverOwner: 'Shadow service', offlineOwner: 'Device connection reported offline', unknownOwner: 'Not yet determined',
      },
      km: {
        server: ['Shadow មិនអាចដំណើរការបានបណ្តោះអាសន្ន', 'ម៉ាស៊ីនមេ Shadow បានឆ្លើយតបដោយកំហុស (HTTP {status})។ នេះជាបញ្ហាខាងសេវាកម្ម Shadow មិនមែនឧបករណ៍របស់អ្នកទេ។', 'សូមសាកល្បងពេលក្រោយ។ បើនៅមានបញ្ហា សូមទាក់ទងក្រុមជំនួយ Shadow។'],
        offline: ['ឧបករណ៍របស់អ្នកបង្ហាញថាគ្មានអ៊ីនធឺណិត', 'ឧបករណ៍រាយការណ៍ថាមិនមានការតភ្ជាប់អ៊ីនធឺណិត ដូច្នេះមិនអាចផ្ទុកទំព័រ Shadow បាន។', 'សូមពិនិត្យ Wi-Fi ឬទិន្នន័យទូរសព្ទ រួចព្យាយាមម្តងទៀត។'],
        unknown: ['មិនអាចភ្ជាប់ទៅ Shadow បាន', 'ការផ្ទុកទំព័របរាជ័យ ប៉ុន្តែមិនទាន់អាចបញ្ជាក់ថាបញ្ហាមកពីអ៊ីនធឺណិត ឬ Shadow បានទេ។ មិនមានភស្តុតាងថាបណ្តាលពីគណនី ឬអាយុរបស់អ្នកទេ។', 'សូមសាកល្បងបើកគេហទំព័រផ្សេង។ បើអាចបើកបាន សូមផ្ញើលេខកូដខាងក្រោមទៅក្រុមជំនួយ Shadow។'],
        retry: 'ព្យាយាមម្តងទៀត', owner: 'លទ្ធផលពិនិត្យ', code: 'លេខកូដកំហុស', serverOwner: 'សេវាកម្ម Shadow', offlineOwner: 'ឧបករណ៍រាយការណ៍ថាគ្មានអ៊ីនធឺណិត', unknownOwner: 'មិនទាន់អាចកំណត់បាន',
      },
      zh: {
        server: ['Shadow 服务暂时不可用', 'Shadow 服务器返回错误（HTTP {status}）。这是 Shadow 服务端的问题，并非您的设备故障。', '请稍后重试。如果问题持续，请联系 Shadow 客服。'],
        offline: ['您的设备报告处于离线状态', '您的设备当前报告没有互联网连接，因此无法加载 Shadow 页面。', '请检查 Wi-Fi 或移动网络，然后重试。'],
        unknown: ['无法连接 Shadow', '页面请求失败，但目前无法确认问题来自您的网络还是 Shadow。没有证据表明与您的账户或年龄有关。', '请尝试访问其他网站。如果其他网站正常，请将下方错误代码发送给 Shadow 客服。'],
        retry: '重试', owner: '诊断结果', code: '错误代码', serverOwner: 'Shadow 服务端', offlineOwner: '设备报告离线', unknownOwner: '暂时无法确定',
      },
      ja: {
        server: ['Shadow を一時的に利用できません', 'Shadow のサーバーがエラーを返しました（HTTP {status}）。Shadow 側の問題であり、お使いの端末の問題ではありません。', 'しばらくしてから再度お試しください。問題が続く場合は Shadow サポートにご連絡ください。'],
        offline: ['端末がオフラインと報告しています', '端末でインターネット接続がないと報告されているため、Shadow のページを読み込めません。', 'Wi-Fi またはモバイルデータ通信を確認して、再度お試しください。'],
        unknown: ['Shadow に接続できません', 'ページの読み込みに失敗しましたが、通信環境と Shadow のどちらが原因かはまだ特定できません。アカウントや年齢が原因という証拠はありません。', '別のサイトが開けるか確認してください。開ける場合は下記のエラーコードを Shadow サポートへお知らせください。'],
        retry: '再試行', owner: '診断結果', code: 'エラーコード', serverOwner: 'Shadow のサービス', offlineOwner: '端末がオフラインと報告', unknownOwner: '原因未特定',
      },
      ko: {
        server: ['Shadow 서비스를 일시적으로 이용할 수 없습니다', 'Shadow 서버에서 오류를 반환했습니다(HTTP {status}). 기기 문제가 아닌 Shadow 서비스 측 문제입니다.', '잠시 후 다시 시도해 주세요. 문제가 계속되면 Shadow 고객지원에 문의해 주세요.'],
        offline: ['기기가 오프라인 상태라고 보고합니다', '현재 기기에서 인터넷 연결이 없다고 보고하여 Shadow 페이지를 불러올 수 없습니다.', 'Wi-Fi 또는 모바일 데이터를 확인한 후 다시 시도해 주세요.'],
        unknown: ['Shadow에 연결할 수 없습니다', '페이지 요청에 실패했지만 인터넷 연결과 Shadow 중 어느 쪽이 원인인지 아직 확인되지 않았습니다. 계정이나 나이 때문이라는 증거는 없습니다.', '다른 웹사이트가 열리는지 확인해 주세요. 정상이라면 아래 오류 코드를 Shadow 고객지원에 전달해 주세요.'],
        retry: '다시 시도', owner: '진단 결과', code: '오류 코드', serverOwner: 'Shadow 서비스', offlineOwner: '기기가 오프라인이라고 보고', unknownOwner: '원인 미확인',
      },
      th: {
        server: ['Shadow ไม่พร้อมให้บริการชั่วคราว', 'เซิร์ฟเวอร์ Shadow ตอบกลับด้วยข้อผิดพลาด (HTTP {status}) ปัญหานี้เกิดจากบริการ Shadow ไม่ใช่อุปกรณ์ของคุณ', 'โปรดลองใหม่ภายหลัง หากยังมีปัญหา โปรดติดต่อฝ่ายสนับสนุน Shadow'],
        offline: ['อุปกรณ์รายงานว่าไม่ได้เชื่อมต่ออินเทอร์เน็ต', 'อุปกรณ์ของคุณรายงานว่าไม่มีการเชื่อมต่ออินเทอร์เน็ต จึงไม่สามารถโหลดหน้า Shadow ได้', 'โปรดตรวจสอบ Wi-Fi หรือข้อมูลมือถือ แล้วลองอีกครั้ง'],
        unknown: ['ไม่สามารถเชื่อมต่อ Shadow ได้', 'การโหลดหน้าล้มเหลว แต่ยังระบุไม่ได้ว่าเกิดจากการเชื่อมต่อของคุณหรือ Shadow และไม่มีหลักฐานว่าเกิดจากบัญชีหรืออายุของคุณ', 'ลองเปิดเว็บไซต์อื่นเพื่อตรวจสอบการเชื่อมต่อ หากเปิดได้ โปรดส่งรหัสข้อผิดพลาดด้านล่างให้ฝ่ายสนับสนุน Shadow'],
        retry: 'ลองอีกครั้ง', owner: 'ผลการตรวจสอบ', code: 'รหัสข้อผิดพลาด', serverOwner: 'บริการ Shadow', offlineOwner: 'อุปกรณ์รายงานว่าออฟไลน์', unknownOwner: 'ยังไม่ทราบสาเหตุ',
      },
    }
    const copy = messages[language]
    const renderFailure = (type, status = 0) => {
      const [title, description, action] = copy[type]
      const code = type === 'server' ? `SHADOW-HTTP-${status}` : type === 'offline' ? 'DEVICE-OFFLINE' : 'CONNECTION-UNDETERMINED'
      const owner = type === 'server' ? copy.serverOwner : type === 'offline' ? copy.offlineOwner : copy.unknownOwner
      const html = `<!doctype html><html lang="${language}"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shadow · ${title}</title><style>body{font:16px/1.6 system-ui,-apple-system,sans-serif;background:#fff;color:#25212a;margin:0;padding:24px}main{max-width:520px;margin:12vh auto;border:1px solid #e6e1eb;border-radius:20px;padding:24px}h1{font-size:22px;line-height:1.35}p{overflow-wrap:anywhere}small{color:#6b6472}button{background:#6741b8;color:white;border:0;border-radius:12px;padding:12px 20px;font:inherit;cursor:pointer}@media(prefers-color-scheme:dark){body{background:#15131a;color:#f5f3fa}main{border-color:#4d4658}small{color:#c4bccb}}</style><main><h1>${title}</h1><p>${description.replace('{status}', String(status))}</p><p><strong>${copy.owner}:</strong> ${owner}</p><p>${action}</p><p><small>${copy.code}: ${code}</small></p><button onclick="location.reload()">${copy.retry}</button></main></html>`
      return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Shadow-Error-Code': code } })
    }
    try {
      const response = await fetch(request)
      return response.status >= 500 ? renderFailure('server', response.status) : response
    } catch {
      return renderFailure(self.navigator.onLine === false ? 'offline' : 'unknown')
    }
  })())
  return
}


    if (isSplashAssetRequest(url)) {
  const cachePromise = caches.open(SPLASH_CACHE_NAME).catch(() => null)
  const cachedPromise = cachePromise.then((cache) =>
    cache ? cache.match(request, { ignoreSearch: true }).catch(() => null) : null
  )
  const refreshPromise = fetch(request, { cache: 'no-cache' })
    .then(async (response) => {
      if (response.ok) {
        const cache = await cachePromise
        if (cache) await cache.put(request, response.clone()).catch(() => {})
      }
      return response
    })
    .catch(() => null)

  event.waitUntil(refreshPromise)

  event.respondWith(
    cachedPromise.then(async (cached) => {
      if (cached) return cached
      return (await refreshPromise) || fallbackImageResponse()
    })
  )

  return
}

       if (
      (/iPhone|iPad|iPod/.test(self.navigator.userAgent) ||
        iosDiagnosticClients.has(event.clientId)) &&
      url.origin !== self.location.origin &&
      url.pathname.startsWith('/api/')
    ) {
      return
    }

    const episodeRoute =
      parseEpisodeApiUrl(url)

    if (episodeRoute) {
      const networkPromise =
        fetch(request).then(
          (response) => ({
            response,
            backgroundResponse:
              response.clone(),
          })
        )

      event.respondWith(
        networkPromise
          .then(
            (result) => result.response
          )
          .catch(
            () =>
              new Response(
                JSON.stringify({
                  ok: false,
                  code: 'NETWORK_UNAVAILABLE',
                  message:
                    'Network unavailable. Please try again.',
                }),
                {
                  status: 503,
                  headers: {
                    'Content-Type':
                      'application/json',
                    'Cache-Control':
                      'no-store',
                  },
                }
              )
          )
      )

      event.waitUntil(
        networkPromise
          .then((result) =>
            processEpisodeApiResponse(
              request,
              result.backgroundResponse,
              event.clientId,
              episodeRoute
            )
          )
          .catch(() => {})
      )

      return
    }

    if (
      request.destination !== 'image' ||
      !isMangaImageRequestUrl(url)
    ) {
      return
    }

    const work =
      prepareMangaImageResponse(
        event
      )

    event.respondWith(
      work
        .then(
          (result) => result.response
        )
        .catch(async () => {
          try {
            const cached =
              await caches.match(request)

            if (cached) {
              return cached
            }

            return await fetch(request)
          } catch {
            return fallbackImageResponse()
          }
        })
    )

    event.waitUntil(
      work
        .then((result) =>
          finishMangaImageWork(
            event,
            result
          )
        )
        .catch(() => {})
    )
  }
)

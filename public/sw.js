const MANGA_CACHE_PREFIX = 'shadow-manga-images-v1:'
const META_DB_NAME = 'shadow_manga_image_cache_meta'
const META_DB_VERSION = 1
const EPISODE_STORE = 'episodes'

const DAY_MS = 24 * 60 * 60 * 1000
const MANGA_TTL_MS = 365 * DAY_MS
const MAX_MANGA_EPISODES = 30
const HARD_MAX_BYTES = 1024 * 1024 * 1024
const FALLBACK_IMAGE_BYTES = 512 * 1024
const QUOTA_BUDGET_RATIO = 0.2
const STORAGE_PRESSURE_RATIO = 0.85

const clientContexts = new Map()

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

function isRecordExpired(
  record,
  now = Date.now()
) {
  if (!record) return true

  const savedAt = Number(
    record.savedAt || 0
  )

  const accessExpiresAt =
    normalizeTime(
      record.accessExpiresAt
    )

  if (
    accessExpiresAt > 0 &&
    now >= accessExpiresAt
  ) {
    return true
  }

  return (
    savedAt > 0 &&
    now - savedAt > MANGA_TTL_MS
  )
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
    await getStorageBudget()

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

async function getStorageBudget() {
  let quota = 0
  let usage = 0

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
    return {
      budgetBytes: HARD_MAX_BYTES,
      pressured: false,
    }
  }

  if (!quota) {
    return {
      budgetBytes: HARD_MAX_BYTES,
      pressured: false,
    }
  }

  const adaptiveBudget = Math.max(
    1,
    Math.floor(
      quota * QUOTA_BUDGET_RATIO
    )
  )

  return {
    budgetBytes: Math.min(
      HARD_MAX_BYTES,
      adaptiveBudget
    ),
    pressured:
      usage / quota >=
      STORAGE_PRESSURE_RATIO,
  }
}

async function pruneMangaCache({
  aggressive = false,
} = {}) {
  const now = Date.now()
  let records =
    await getAllEpisodeRecords()

  const expired = records.filter(
    (record) =>
      isRecordExpired(record, now)
  )

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
    await getStorageBudget()

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

    if (isRecordExpired(record)) {
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

  await pruneMangaCache()
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

self.addEventListener(
  'install',
  () => {
    self.skipWaiting()
  }
)

self.addEventListener(
  'activate',
  (event) => {
    event.waitUntil(
      (async () => {
        const names =
          await caches.keys()

        await Promise.all(
          names
            .filter(
              (name) =>
                name.startsWith(
                  'shadow-manga-images-'
                ) &&
                !name.startsWith(
                  MANGA_CACHE_PREFIX
                )
            )
            .map((name) =>
              caches.delete(name)
            )
        )

        await pruneMangaCache()
        await self.clients.claim()
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

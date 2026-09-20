const DB_NAME = 'shadow_reader_episode_cache'
const DB_VERSION = 1
const STORE_NAME = 'episodes'

const DAY_MS = 24 * 60 * 60 * 1000

const CACHE_POLICIES = {
  novel: {
    ttlMs: 30 * DAY_MS,
    maxEntries: 10000,
  },
  chat_story: {
    ttlMs: 30 * DAY_MS,
    maxEntries: 10000,
  },
  manga: {
    ttlMs: 365 * DAY_MS,
    maxEntries: 10000,
  },
}

const DEFAULT_POLICY = {
  ttlMs: 30 * DAY_MS,
  maxEntries: 10000,
}

const memoryFallback = new Map()
const MEMORY_FALLBACK_LIMIT = 40

function rememberFallbackEntry(entry) {
  if (!entry?.key) return
  memoryFallback.delete(entry.key)
  memoryFallback.set(entry.key, entry)
  if (memoryFallback.size > MEMORY_FALLBACK_LIMIT) {
    memoryFallback.delete(memoryFallback.keys().next().value)
  }
}
const INDEXED_DB_TIMEOUT_MS = 2000
const PRUNE_CHECK_INTERVAL_MS = 15 * 60 * 1000
const lastPrunedByType = new Map()
let lastCacheAccessMs = 0
let indexedDbUnavailable = false

function nextCacheAccessTime() {
  lastCacheAccessMs = Math.max(Date.now(), lastCacheAccessMs + 1)
  return lastCacheAccessMs
}

function disableIndexedDb(error) {
  if (!indexedDbUnavailable) {
    console.warn('READER_EPISODE_CACHE_IDB_UNAVAILABLE', error?.message || String(error))
  }
  indexedDbUnavailable = true
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeStoryType(value) {
  const type = normalizeText(value).toLowerCase()

  if (type === 'manga') return 'manga'

  if (
    type === 'chat_story' ||
    type === 'chat-story' ||
    type === 'chatstory'
  ) {
    return 'chat_story'
  }

  return 'novel'
}

function normalizeTime(value) {
  if (value === undefined || value === null || value === '') {
    return 0
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function getPolicy(storyType) {
  return CACHE_POLICIES[normalizeStoryType(storyType)] || DEFAULT_POLICY
}

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
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

export function getReaderEpisodeCacheScope({
  privateAccess = false,
} = {}) {
  if (!privateAccess) return 'public'
  return tokenFingerprint(getReaderToken())
}

export function buildReaderEpisodeCacheKey({
  storyType,
  storyId,
  episodeId,
  scope,
  privateAccess = false,
} = {}) {
  const safeStoryId = normalizeText(storyId)
  const safeEpisodeId = normalizeText(episodeId)
  const safeStoryType = normalizeStoryType(storyType)
  const safeScope =
    normalizeText(scope) ||
    getReaderEpisodeCacheScope({ privateAccess })

  if (!safeStoryId || !safeEpisodeId || !safeScope) {
    return ''
  }

  return [
    safeScope,
    safeStoryType,
    safeStoryId,
    safeEpisodeId,
  ].join(':')
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (indexedDbUnavailable || typeof indexedDB === 'undefined') {
      if (!indexedDbUnavailable) disableIndexedDb(new Error('IndexedDB unavailable'))
      reject(new Error('Reader episode IndexedDB unavailable'))
      return
    }

    let settled = false
    const timeout = setTimeout(() => {
      const error = new Error('Reader episode IndexedDB open timed out')
      disableIndexedDb(error)
      finish(error)
    }, INDEXED_DB_TIMEOUT_MS)

    function finish(error, database) {
      if (settled) {
        database?.close()
        return
      }
      settled = true
      clearTimeout(timeout)
      if (error) reject(error)
      else resolve(database)
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const database = request.result
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, {
            keyPath: 'key',
          })
          store.createIndex('storyType', 'storyType', { unique: false })
          store.createIndex('storyId', 'storyId', { unique: false })
          store.createIndex('lastAccessedAt', 'lastAccessedAt', { unique: false })
        }
      }
      request.onsuccess = () => finish(null, request.result)
      request.onerror = () => {
        const error = request.error || new Error('Could not open reader episode cache')
        disableIndexedDb(error)
        finish(error)
      }
      request.onblocked = () => {
        const error = new Error('Reader episode IndexedDB open blocked')
        disableIndexedDb(error)
        finish(error)
      }
    } catch (error) {
      disableIndexedDb(error)
      finish(error)
    }
  })
}

function runTransaction(mode, action) {
  return openDatabase().then((database) =>
    new Promise((resolve, reject) => {
      let settled = false
      let transaction = null
      let requestResult

      const timeout = setTimeout(() => {
        const error = new Error('Reader episode IndexedDB transaction timed out')
        disableIndexedDb(error)
        finish(error)
      }, INDEXED_DB_TIMEOUT_MS)

      function finish(error) {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        if (error) {
          try { transaction?.abort() } catch {}
        }
        database.close()
        if (error) reject(error)
        else resolve(requestResult)
      }

      try {
        transaction = database.transaction(STORE_NAME, mode)
        const store = transaction.objectStore(STORE_NAME)
        const request = action(store)
        if (request) {
          request.onsuccess = () => { requestResult = request.result }
          request.onerror = () => finish(
            request.error || new Error('Reader episode cache operation failed')
          )
        }
        transaction.oncomplete = () => finish()
        transaction.onerror = () => finish(
          transaction.error || new Error('Reader episode cache transaction failed')
        )
        transaction.onabort = () => finish(
          transaction.error || new Error('Reader episode cache transaction aborted')
        )
      } catch (error) {
        finish(error)
      }
    })
  )
}

async function getStoredEntry(key) {
  if (!key) return null

  try {
    const value = await runTransaction(
      'readonly',
      (store) => store.get(key)
    )

    if (value) {
      rememberFallbackEntry(value)
    }

    return value || null
  } catch {
    return memoryFallback.get(key) || null
  }
}

async function putStoredEntry(value) {
  if (!value?.key) return null

  rememberFallbackEntry(value)

  try {
    await runTransaction(
      'readwrite',
      (store) => store.put(value)
    )
  } catch {
    return value
  }

  return value
}

async function getAllStoredEntries(storyType = '') {
  const type = storyType ? normalizeStoryType(storyType) : ''
  try {
    const values =
      (await runTransaction(
        'readonly',
        (store) => type ? store.index('storyType').getAll(type) : store.getAll()
      )) || []

    for (const value of values) {
      if (value?.key) {
        rememberFallbackEntry(value)
      }
    }

    return values
  } catch {
    const values = [...memoryFallback.values()]
    return type ? values.filter((entry) => entry.storyType === type) : values
  }
}

async function getReaderEpisodeCacheCount(storyType) {
  try {
    return await runTransaction(
      'readonly',
      (store) => store.index('storyType').count(storyType)
    )
  } catch {
    return [...memoryFallback.values()].filter((entry) => entry.storyType === storyType).length
  }
}

export async function deleteReaderEpisodeCacheByKey(key) {
  const safeKey = normalizeText(key)
  if (!safeKey) return

  memoryFallback.delete(safeKey)

  try {
    await runTransaction(
      'readwrite',
      (store) => store.delete(safeKey)
    )
  } catch {
    return
  }
}

function isEntryExpired(entry, now = Date.now()) {
  if (!entry) return true

  const ttlMs = Math.max(
    0,
    Number(entry.ttlMs || 0)
  )
  const savedAt = Math.max(
    0,
    Number(entry.savedAt || 0)
  )
  const accessExpiresAt = Math.max(
    0,
    Number(entry.accessExpiresAt || 0)
  )

  if (accessExpiresAt > 0 && now >= accessExpiresAt) {
    return true
  }

  return ttlMs > 0 && savedAt > 0 && now - savedAt > ttlMs
}

export async function saveReaderEpisodeCache({
  storyType,
  storyId,
  episodeId,
  data,
  updatedAt,
  privateAccess = false,
  accessExpiresAt = null,
  isLocked = false,
  scope,
} = {}) {
  if (isLocked || data === undefined || data === null) {
    return null
  }

  const normalizedType = normalizeStoryType(storyType)
  const policy = getPolicy(normalizedType)
  const resolvedScope =
    normalizeText(scope) ||
    getReaderEpisodeCacheScope({ privateAccess })

  if (!resolvedScope) return null

  const key = buildReaderEpisodeCacheKey({
    storyType: normalizedType,
    storyId,
    episodeId,
    scope: resolvedScope,
    privateAccess,
  })

  if (!key) return null

  const now = Date.now()
  const normalizedAccessExpiresAt = normalizeTime(accessExpiresAt)

  if (
    normalizedAccessExpiresAt > 0 &&
    normalizedAccessExpiresAt <= now
  ) {
    await deleteReaderEpisodeCacheByKey(key)
    return null
  }

  const value = {
    key,
    storyType: normalizedType,
    storyId: normalizeText(storyId),
    episodeId: normalizeText(episodeId),
    scope: resolvedScope,
    privateAccess: Boolean(privateAccess),
    data,
    contentUpdatedAt: normalizeTime(updatedAt),
    accessExpiresAt: normalizedAccessExpiresAt,
    ttlMs: policy.ttlMs,
    savedAt: now,
    lastAccessedAt: nextCacheAccessTime(),
  }

  await putStoredEntry(value)
  const entryCount = await getReaderEpisodeCacheCount(normalizedType)
  if (
    entryCount > policy.maxEntries ||
    now - (lastPrunedByType.get(normalizedType) || 0) >= PRUNE_CHECK_INTERVAL_MS
  ) {
    await pruneReaderEpisodeCache({ storyType: normalizedType })
    lastPrunedByType.set(normalizedType, Date.now())
  }

  return value
}

export async function loadReaderEpisodeCache({
  storyType,
  storyId,
  episodeId,
  expectedUpdatedAt,
  privateAccess = false,
  scope,
} = {}) {
  const normalizedType = normalizeStoryType(storyType)
  const resolvedScope =
    normalizeText(scope) ||
    getReaderEpisodeCacheScope({ privateAccess })

  if (!resolvedScope) return null

  const key = buildReaderEpisodeCacheKey({
    storyType: normalizedType,
    storyId,
    episodeId,
    scope: resolvedScope,
    privateAccess,
  })

  if (!key) return null

  const entry = await getStoredEntry(key)
  if (!entry) return null

  if (isEntryExpired(entry)) {
    await deleteReaderEpisodeCacheByKey(key)
    return null
  }

  const expectedVersion = normalizeTime(expectedUpdatedAt)
  const storedVersion = normalizeTime(entry.contentUpdatedAt)

  if (
    expectedVersion > 0 &&
    storedVersion > 0 &&
    expectedVersion !== storedVersion
  ) {
    await deleteReaderEpisodeCacheByKey(key)
    return null
  }

  const touched = {
    ...entry,
    lastAccessedAt: nextCacheAccessTime(),
  }

  await putStoredEntry(touched)

  return touched.data
}

export async function deleteReaderEpisodeCache({
  storyType,
  storyId,
  episodeId,
  privateAccess = false,
  scope,
} = {}) {
  const key = buildReaderEpisodeCacheKey({
    storyType,
    storyId,
    episodeId,
    privateAccess,
    scope,
  })

  if (!key) return
  await deleteReaderEpisodeCacheByKey(key)
}

export async function clearReaderEpisodeCacheForStory(storyId) {
  const safeStoryId = normalizeText(storyId)
  if (!safeStoryId) return

  const entries = await getAllStoredEntries()

  await Promise.all(
    entries
      .filter(
        (entry) =>
          normalizeText(entry?.storyId) === safeStoryId
      )
      .map((entry) =>
        deleteReaderEpisodeCacheByKey(entry.key)
      )
  )
}

export async function clearReaderEpisodeCache() {
  memoryFallback.clear()

  if (typeof indexedDB === 'undefined') return
  await runTransaction(
    'readwrite',
    (store) => store.clear()
  )
}

export async function pruneReaderEpisodeCache({
  storyType,
} = {}) {
  const now = Date.now()
  const requestedType = storyType
    ? normalizeStoryType(storyType)
    : ''
  const entries = await getAllStoredEntries(requestedType)
  const expiredKeys = entries
    .filter((entry) => isEntryExpired(entry, now))
    .map((entry) => entry.key)

  await Promise.all(
    expiredKeys.map((key) =>
      deleteReaderEpisodeCacheByKey(key)
    )
  )

  const activeEntries = entries.filter(
    (entry) =>
      !expiredKeys.includes(entry.key) &&
      (!requestedType || entry.storyType === requestedType)
  )

  const types = requestedType
    ? [requestedType]
    : [...new Set(activeEntries.map((entry) => entry.storyType))]

  for (const type of types) {
    const policy = getPolicy(type)
    const typeEntries = activeEntries
      .filter((entry) => entry.storyType === type)
      .sort(
        (left, right) =>
          Number(right.lastAccessedAt || 0) -
          Number(left.lastAccessedAt || 0)
      )

    const overflow = typeEntries.slice(policy.maxEntries)

    await Promise.all(
      overflow.map((entry) =>
        deleteReaderEpisodeCacheByKey(entry.key)
      )
    )
  }
}

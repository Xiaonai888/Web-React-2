const DB_NAME = 'shadow_home_cache'
const DB_VERSION = 1
const STORE_NAME = 'home_data'
const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000
const CONTENT_VERSION_TTL_MS = 60 * 1000

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CONTENT_VERSION_KEYS = [
  'home',
  'slides',
  'stories',
  'genres',
]

const VERSION_KEY_BY_SECTION = {
  home: 'home',
  slides: 'slides',
  stories: 'stories',
  'daily-picks': 'stories',
  genres: 'genres',
}

const memoryFallback = new Map()
let contentVersions = null
let contentVersionsCheckedAt = 0
let contentVersionsRequest = null

function openHomeCacheDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'key',
        })

        store.createIndex('updatedAt', 'updatedAt', {
          unique: false,
        })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(
        request.error ||
          new Error('Could not open home cache storage')
      )
  })
}

function runHomeCacheTransaction(mode, action) {
  return openHomeCacheDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        let requestResult

        const transaction = database.transaction(
          STORE_NAME,
          mode
        )
        const store =
          transaction.objectStore(STORE_NAME)

        try {
          const request = action(store)

          if (request) {
            request.onsuccess = () => {
              requestResult = request.result
            }

            request.onerror = () => {
              reject(
                request.error ||
                  new Error('Home cache operation failed')
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
            new Error('Home cache transaction failed')

          database.close()
          reject(error)
        }

        transaction.onabort = () => {
          const error =
            transaction.error ||
            new Error('Home cache transaction aborted')

          database.close()
          reject(error)
        }
      })
  )
}

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function stableParams(params = {}) {
  return Object.entries(params || {})
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
    .sort(([left], [right]) =>
      left.localeCompare(right)
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          String(value)
        )}`
    )
    .join('&')
}

function getSectionFromCacheKey(key) {
  return String(key || '').split(':')[2] || ''
}

function getVersionKeyForCacheKey(key) {
  const section = getSectionFromCacheKey(key)
  return VERSION_KEY_BY_SECTION[section] || null
}

async function fetchContentVersions() {
  const now = Date.now()

  if (
    contentVersions &&
    now - contentVersionsCheckedAt < CONTENT_VERSION_TTL_MS
  ) {
    return contentVersions
  }

  if (contentVersionsRequest) {
    return contentVersionsRequest
  }

  contentVersionsRequest = (async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public/content-versions?keys=${CONTENT_VERSION_KEYS.join(',')}`,
        { cache: 'no-store' }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Failed to load content versions'
        )
      }

      const nextVersions = {}

      for (const key of CONTENT_VERSION_KEYS) {
        const version = Number(
          data?.versions?.[key]?.version
        )

        if (Number.isFinite(version)) {
          nextVersions[key] = version
        }
      }

      contentVersions = nextVersions
      contentVersionsCheckedAt = Date.now()

      return nextVersions
    } catch {
      return contentVersions
    } finally {
      contentVersionsRequest = null
    }
  })()

  return contentVersionsRequest
}

async function resolveExpectedVersion(key, explicitVersion) {
  if (
    explicitVersion !== undefined &&
    explicitVersion !== null
  ) {
    const number = Number(explicitVersion)
    return Number.isFinite(number) ? number : null
  }

  const versionKey = getVersionKeyForCacheKey(key)
  if (!versionKey) return null

  const versions = await fetchContentVersions()
  const version = Number(versions?.[versionKey])

  return Number.isFinite(version) ? version : null
}

export function getHomeCacheKey({
  section,
  language = 'all',
  scope = 'public',
  params = {},
} = {}) {
  const safeSection =
    normalizeText(section) || 'home'
  const safeLanguage =
    normalizeText(language) || 'all'
  const safeScope =
    normalizeText(scope) || 'public'
  const query = stableParams(params)

  return [
    safeScope,
    safeLanguage,
    safeSection,
    query,
  ]
    .filter(Boolean)
    .join(':')
}

export async function saveHomeCache(
  key,
  data,
  {
    version,
    maxAgeMs = DEFAULT_MAX_AGE_MS,
  } = {}
) {
  if (!key) return null

  const resolvedVersion =
    await resolveExpectedVersion(key, version)

  const value = {
    key: String(key),
    data,
    version: Number(resolvedVersion || 0),
    updatedAt: Date.now(),
    maxAgeMs: Math.max(
      0,
      Number(maxAgeMs || DEFAULT_MAX_AGE_MS)
    ),
  }

  memoryFallback.set(value.key, value)

  try {
    await runHomeCacheTransaction(
      'readwrite',
      (store) => store.put(value)
    )
  } catch {
    return value
  }

  return value
}

export async function loadHomeCache(
  key,
  {
    version,
    maxAgeMs,
    allowExpired = true,
  } = {}
) {
  if (!key) return null

  let value = null

  try {
    value = await runHomeCacheTransaction(
      'readonly',
      (store) => store.get(String(key))
    )
  } catch {
    value =
      memoryFallback.get(String(key)) || null
  }

  if (!value) return null

  memoryFallback.set(String(key), value)

  const effectiveMaxAge = Math.max(
    0,
    Number(
      maxAgeMs ??
        value.maxAgeMs ??
        DEFAULT_MAX_AGE_MS
    )
  )
  const ageMs = Math.max(
    0,
    Date.now() - Number(value.updatedAt || 0)
  )
  const isExpired =
    effectiveMaxAge > 0 &&
    ageMs > effectiveMaxAge

  const expectedVersion =
    await resolveExpectedVersion(key, version)

  const versionMatches =
    expectedVersion === null ||
    expectedVersion <= 0 ||
    Number(value.version || 0) ===
      expectedVersion

  if (
    !allowExpired &&
    (isExpired || !versionMatches)
  ) {
    return null
  }

  return {
    ...value,
    ageMs,
    isExpired,
    versionMatches,
    isFresh:
      !isExpired && versionMatches,
  }
}

export async function deleteHomeCache(key) {
  if (!key) return

  memoryFallback.delete(String(key))

  try {
    await runHomeCacheTransaction(
      'readwrite',
      (store) => store.delete(String(key))
    )
  } catch {
    return
  }
}

export async function clearHomeCache() {
  memoryFallback.clear()

  try {
    await runHomeCacheTransaction(
      'readwrite',
      (store) => store.clear()
    )
  } catch {
    return
  }
}

export async function pruneHomeCache({
  olderThanMs = 7 * 24 * 60 * 60 * 1000,
} = {}) {
  const cutoff =
    Date.now() -
    Math.max(0, Number(olderThanMs || 0))

  try {
    await runHomeCacheTransaction(
      'readwrite',
      (store) => {
        const index =
          store.index('updatedAt')
        const range =
          IDBKeyRange.upperBound(cutoff)
        const request =
          index.openCursor(range)

        request.onsuccess = () => {
          const cursor = request.result

          if (!cursor) return

          memoryFallback.delete(
            String(cursor.primaryKey)
          )
          cursor.delete()
          cursor.continue()
        }

        return request
      }
    )
  } catch {
    for (const [key, value] of memoryFallback) {
      if (
        Number(value?.updatedAt || 0) <= cutoff
      ) {
        memoryFallback.delete(key)
      }
    }
  }
}

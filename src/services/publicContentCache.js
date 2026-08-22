const DB_NAME = 'shadow-public-content-cache'
const DB_VERSION = 1
const STORE_NAME = 'entries'

let databasePromise = null

function canUseIndexedDB() {
  return typeof window !== 'undefined' && 'indexedDB' in window
}

function openDatabase() {
  if (!canUseIndexedDB()) return Promise.resolve(null)
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('IndexedDB is blocked'))
  }).catch((error) => {
    databasePromise = null
    throw error
  })

  return databasePromise
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function createPublicCacheKey(...parts) {
  return parts
    .flat()
    .map((part) => String(part ?? '').trim().toLowerCase())
    .filter(Boolean)
    .join('::')
}

export async function readPublicContentCache(key) {
  if (!key) return null

  try {
    const database = await openDatabase()
    if (!database) return null

    const transaction = database.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const entry = await requestToPromise(store.get(key))

    if (!entry) return null

    const expiresAt = Number(entry.expires_at || 0)

    return {
      ...entry,
      is_expired: expiresAt > 0 && Date.now() >= expiresAt,
    }
  } catch {
    return null
  }
}

export async function writePublicContentCache({
  key,
  data,
  version,
  ttlMs,
}) {
  if (!key || !Number.isFinite(Number(ttlMs)) || Number(ttlMs) <= 0) {
    return false
  }

  try {
    const database = await openDatabase()
    if (!database) return false

    const now = Date.now()
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    await requestToPromise(
      store.put({
        key,
        data,
        version: version ?? null,
        stored_at: now,
        expires_at: now + Number(ttlMs),
      })
    )

    return true
  } catch {
    return false
  }
}

export async function removePublicContentCache(key) {
  if (!key) return false

  try {
    const database = await openDatabase()
    if (!database) return false

    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await requestToPromise(store.delete(key))

    return true
  } catch {
    return false
  }
}

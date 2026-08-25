const COMMAND_TIMEOUT_MS = 8000
const READER_SCOPE_CHECK_MS = 2000
const READER_SCOPE_STORAGE_KEY =
  'shadow_reader_private_cache_scope_v1'
const READER_DB_NAME =
  'shadow_reader_episode_cache'
const READER_STORE_NAME = 'episodes'
const PRIVATE_SCOPE_PATTERN =
  /^reader-[a-z0-9]+$/i

let activeReaderScope = ''
let readerScopeCheckRunning = false

function normalizeText(value) {
  return String(value ?? '').trim()
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
  if (!value) return 'public'

  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(hash >>> 0).toString(36)}`
}

function isPrivateScope(scope) {
  return PRIVATE_SCOPE_PATTERN.test(
    normalizeText(scope)
  )
}

function getStoredReaderScope() {
  try {
    return normalizeText(
      localStorage.getItem(
        READER_SCOPE_STORAGE_KEY
      )
    )
  } catch {
    return ''
  }
}

function rememberReaderScope(scope) {
  const safeScope = normalizeText(scope)

  try {
    if (isPrivateScope(safeScope)) {
      localStorage.setItem(
        READER_SCOPE_STORAGE_KEY,
        safeScope
      )
    } else {
      localStorage.removeItem(
        READER_SCOPE_STORAGE_KEY
      )
    }
  } catch {
  }
}

async function getActiveWorker() {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  if (navigator.serviceWorker.controller) {
    return navigator.serviceWorker.controller
  }

  try {
    const registration =
      await navigator.serviceWorker.ready

    return (
      registration.active ||
      registration.waiting ||
      registration.installing ||
      null
    )
  } catch {
    return null
  }
}

async function sendMangaCacheCommand(
  type,
  payload = {}
) {
  const worker = await getActiveWorker()

  if (!worker) {
    return {
      ok: false,
      code: 'SERVICE_WORKER_UNAVAILABLE',
    }
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel()

    const timeout = window.setTimeout(() => {
      channel.port1.close()
      resolve({
        ok: false,
        code: 'MANGA_CACHE_COMMAND_TIMEOUT',
      })
    }, COMMAND_TIMEOUT_MS)

    channel.port1.onmessage = (event) => {
      window.clearTimeout(timeout)
      channel.port1.close()
      resolve(
        event.data || {
          ok: false,
          code: 'EMPTY_MANGA_CACHE_RESPONSE',
        }
      )
    }

    worker.postMessage(
      {
        type,
        ...payload,
      },
      [channel.port2]
    )
  })
}

function openReaderEpisodeDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }

    const request =
      indexedDB.open(READER_DB_NAME, 1)

    request.onupgradeneeded = () => {
      const database = request.result

      if (
        !database.objectStoreNames.contains(
          READER_STORE_NAME
        )
      ) {
        const store =
          database.createObjectStore(
            READER_STORE_NAME,
            {
              keyPath: 'key',
            }
          )

        store.createIndex(
          'storyType',
          'storyType',
          {
            unique: false,
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

    request.onsuccess = () =>
      resolve(request.result)

    request.onerror = () =>
      reject(
        request.error ||
          new Error(
            'Could not open reader episode cache'
          )
      )
  })
}

async function clearReaderEpisodeScope(scope) {
  const safeScope = normalizeText(scope)

  if (!isPrivateScope(safeScope)) {
    return true
  }

  let database = null

  try {
    database =
      await openReaderEpisodeDatabase()

    if (!database) return true

    await new Promise((resolve, reject) => {
      const transaction =
        database.transaction(
          READER_STORE_NAME,
          'readwrite'
        )

      const store =
        transaction.objectStore(
          READER_STORE_NAME
        )

      const request = store.getAll()

      request.onsuccess = () => {
        for (
          const entry of request.result || []
        ) {
          if (
            normalizeText(entry?.scope) ===
              safeScope &&
            entry?.key
          ) {
            store.delete(entry.key)
          }
        }
      }

      request.onerror = () =>
        reject(
          request.error ||
            new Error(
              'Could not read reader episode cache'
            )
        )

      transaction.oncomplete = resolve

      transaction.onerror = () =>
        reject(
          transaction.error ||
            new Error(
              'Could not clear reader episode cache'
            )
        )

      transaction.onabort = () =>
        reject(
          transaction.error ||
            new Error(
              'Reader episode cache cleanup aborted'
            )
        )
    })

    return true
  } catch {
    return false
  } finally {
    database?.close()
  }
}

async function clearMangaImageScope(scope) {
  const safeScope = normalizeText(scope)

  if (!isPrivateScope(safeScope)) {
    return true
  }

  if (!('serviceWorker' in navigator)) {
    return true
  }

  const result =
    await sendMangaCacheCommand(
      'SHADOW_MANGA_CACHE_CLEAR',
      {
        scope: safeScope,
        all: false,
        includePublic: false,
      }
    )

  return Boolean(result?.ok)
}

async function clearPrivateReaderScope(scope) {
  const safeScope = normalizeText(scope)

  if (!isPrivateScope(safeScope)) {
    return true
  }

  const [
    episodeCacheCleared,
    mangaCacheCleared,
  ] = await Promise.all([
    clearReaderEpisodeScope(safeScope),
    clearMangaImageScope(safeScope),
  ])

  return (
    episodeCacheCleared &&
    mangaCacheCleared
  )
}

async function syncReaderPrivateCacheScope() {
  if (readerScopeCheckRunning) return

  readerScopeCheckRunning = true

  try {
    const nextScope =
      tokenFingerprint(getReaderToken())

    const previousScope =
      activeReaderScope ||
      getStoredReaderScope() ||
      nextScope

    if (previousScope === nextScope) {
      activeReaderScope = nextScope
      rememberReaderScope(nextScope)
      return
    }

    if (
      isPrivateScope(previousScope)
    ) {
      const cleared =
        await clearPrivateReaderScope(
          previousScope
        )

      if (!cleared) return
    }

    activeReaderScope = nextScope
    rememberReaderScope(nextScope)
  } finally {
    readerScopeCheckRunning = false
  }
}

export async function getMangaImageCacheStats() {
  const scope = tokenFingerprint(
    getReaderToken()
  )

  return sendMangaCacheCommand(
    'SHADOW_MANGA_CACHE_STATS',
    {
      scope,
    }
  )
}

export async function clearMangaImageCache({
  all = false,
  includePublic = true,
} = {}) {
  const scope = tokenFingerprint(
    getReaderToken()
  )

  return sendMangaCacheCommand(
    'SHADOW_MANGA_CACHE_CLEAR',
    {
      scope,
      all: Boolean(all),
      includePublic:
        Boolean(includePublic),
    }
  )
}

function installReaderPrivateCacheCleanup() {
  if (
    window.__shadowReaderPrivateCacheCleanupInstalled
  ) {
    return
  }

  window.__shadowReaderPrivateCacheCleanupInstalled =
    true

  activeReaderScope =
    getStoredReaderScope()

  syncReaderPrivateCacheScope()

  window.setInterval(
    syncReaderPrivateCacheScope,
    READER_SCOPE_CHECK_MS
  )

  window.addEventListener(
    'focus',
    syncReaderPrivateCacheScope
  )

  window.addEventListener(
    'storage',
    (event) => {
      if (
        event.key ===
          'shadow_reader_token' ||
        event.key ===
          READER_SCOPE_STORAGE_KEY
      ) {
        syncReaderPrivateCacheScope()
      }
    }
  )

  document.addEventListener(
    'visibilitychange',
    () => {
      if (
        document.visibilityState ===
        'visible'
      ) {
        syncReaderPrivateCacheScope()
      }
    }
  )
}

export function installMangaImageCacheControl() {
  if (
    window.__shadowMangaImageCacheControlInstalled
  ) {
    return
  }

  window.__shadowMangaImageCacheControlInstalled =
    true

  window.ShadowMangaCache = {
    getStats: getMangaImageCacheStats,
    clear: clearMangaImageCache,
    clearAll: () =>
      clearMangaImageCache({
        all: true,
      }),
  }

  installReaderPrivateCacheCleanup()
}

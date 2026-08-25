const COMMAND_TIMEOUT_MS = 8000

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
}

const CACHE_TTL_MS = 60 * 1000
const MAX_CACHE_ENTRIES = 20

const responseCache = new Map()
const requestsInFlight = new Map()

let activeToken = ''
let cacheGeneration = 0

function ensureActiveToken(token) {
  if (token === activeToken) return
  activeToken = token
  cacheGeneration += 1
  responseCache.clear()
  requestsInFlight.clear()
}

function readCachedResponse(key) {
  const cached = responseCache.get(key)
  if (!cached) return null
  if (cached.expiresAt <= Date.now()) {
    responseCache.delete(key)
    return null
  }
  return cached.value
}

function saveCachedResponse(key, value) {
  responseCache.delete(key)
  responseCache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })
  while (responseCache.size > MAX_CACHE_ENTRIES) {
    responseCache.delete(responseCache.keys().next().value)
  }
}

export function invalidateReaderProfilePostsCache() {
  cacheGeneration += 1
  responseCache.clear()
  requestsInFlight.clear()
}

export async function fetchReaderProfilePosts({ endpoint, token, force = false }) {
  const requestEndpoint = String(endpoint || '').trim()
  const requestToken = String(token || '').trim()
  if (!requestEndpoint || !requestToken) throw new Error('LOGIN_REQUIRED')

  ensureActiveToken(requestToken)

  if (!force) {
    const cached = readCachedResponse(requestEndpoint)
    if (cached) return cached
  }

  const existingRequest = requestsInFlight.get(requestEndpoint)
  if (existingRequest) return existingRequest

  const generation = cacheGeneration
  const request = (async () => {
    const response = await fetch(requestEndpoint, {
      headers: { Authorization: `Bearer ${requestToken}` },
      cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'LOAD_FAILED')
    }
    if (cacheGeneration === generation && activeToken === requestToken) {
      saveCachedResponse(requestEndpoint, data)
    }
    return data
  })()

  requestsInFlight.set(requestEndpoint, request)
  try {
    return await request
  } finally {
    if (requestsInFlight.get(requestEndpoint) === request) {
      requestsInFlight.delete(requestEndpoint)
    }
  }
}

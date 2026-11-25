import { getActiveReaderToken, getReaderSessionIdentity } from './readerActiveAccount'

const TTL_MS = 30_000
const MAX_ENTRIES = 24
const MAX_ENTRY_BYTES = 128 * 1024
const MAX_TOTAL_BYTES = 1024 * 1024
const SKIP_QUERY_KEYS = new Set(['q', 'search', 'keyword', 'cursor', 'offset', 'genre_pagination', 'new_arrivals_pagination', 'genre_filter'])

function tokenIsUsable(token) {
  if (!token) return true
  if (!getReaderSessionIdentity(token)) return false
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(encoded))
    return Number.isFinite(claims.exp) && claims.exp * 1000 > Date.now() + TTL_MS
  } catch {
    return false
  }
}

function cacheableUrl(input, init, apiOrigin) {
  if (typeof input !== 'string' || String(init.method || 'GET').toUpperCase() !== 'GET') return null
  if (init.cache && init.cache !== 'default') return null
  if (init.credentials && init.credentials !== 'same-origin') return null
  if (init.mode && init.mode !== 'cors') return null
  if (init.signal?.aborted || [...new Headers(init.headers || {}).keys()].length) return null
  try {
    const url = new URL(input, window.location.origin)
    if (url.origin !== apiOrigin || url.pathname !== '/api/public/stories' || url.username || url.password) return null
    const keys = [...url.searchParams.keys()]
    if (new Set(keys).size !== keys.length || keys.some((key) => SKIP_QUERY_KEYS.has(key))) return null
    if (!url.searchParams.get('language')) return null
    url.searchParams.sort()
    return `${url.pathname}?${url.searchParams.toString()}`
  } catch {
    return null
  }
}

export function createPublicStoriesNavigationFetch(apiFetch, apiOrigin) {
  const entries = new Map()
  let scope = null
  let totalBytes = 0

  function clear() {
    entries.clear()
    totalBytes = 0
  }

  function remove(key) {
    const entry = entries.get(key)
    if (entry) totalBytes -= entry.bytes
    entries.delete(key)
  }

  function syncScope() {
    const token = getActiveReaderToken()
    if (scope !== token) {
      clear()
      scope = token
    }
    return token
  }

  return async function navigationFetch(input, init = {}) {
    const token = syncScope()
    const key = cacheableUrl(input, init, apiOrigin)
    if (!key || !tokenIsUsable(token)) return apiFetch(input, init)

    const now = Date.now()
    for (const [entryKey, entry] of entries) {
      if (entry.expiresAt <= now) remove(entryKey)
    }
    const cached = entries.get(key)
    if (cached) {
      entries.delete(key)
      entries.set(key, cached)
      return new Response(cached.body, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Shadow-Home-Cache': 'NAVIGATION_HIT' },
      })
    }

    const response = await apiFetch(input, init)
    if (response.status !== 200 || !response.ok || init.signal?.aborted || syncScope() !== token) return response
    try {
      const body = await response.clone().text()
      const bytes = new TextEncoder().encode(body).byteLength
      if (!bytes || bytes > MAX_ENTRY_BYTES) return response
      const data = JSON.parse(body)
      if (data?.ok !== true || !Array.isArray(data.stories) || !data.stories.length || !data.stories.every((story) => story && story.is_adult === false)) return response
      if (init.signal?.aborted || syncScope() !== token || !tokenIsUsable(token)) return response
      remove(key)
      entries.set(key, { body, bytes, expiresAt: Date.now() + TTL_MS })
      totalBytes += bytes
      while (entries.size > MAX_ENTRIES || totalBytes > MAX_TOTAL_BYTES) remove(entries.keys().next().value)
    } catch {}
    return response
  }
}

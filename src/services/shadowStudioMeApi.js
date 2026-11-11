const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)

const SUMMARY_TTL = 3 * 60 * 1000
const VIDEOS_TTL = 10 * 60 * 1000
const MAX_RECORDS = 200
const MAX_PAGE_ENTRIES = 16
const PAGE_SIZE = 12
const cache = new Map()
let session = ''

function authToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function currentSession() {
  const token = authToken()
  if (token !== session) {
    cache.clear()
    session = token
  }
  return token
}

function getCached(key) {
  if (!currentSession()) return null
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() >= entry.until) {
    cache.delete(key)
    return null
  }
  cache.delete(key)
  cache.set(key, entry)
  return entry.value
}

function putCached(key, value, ttl) {
  if (!currentSession()) return
  cache.delete(key)
  cache.set(key, { value, until: Date.now() + ttl })
  const count = () => [...cache.entries()].reduce((n, [k, entry]) =>
    n + (k.startsWith('videos:') ? entry.value.items.length : 0), 0)
  while (cache.size > MAX_PAGE_ENTRIES + 1 || count() > MAX_RECORDS) {
    const oldest = cache.keys().next().value
    if (!oldest) break
    cache.delete(oldest)
  }
}

async function request(path, { signal } = {}) {
  const token = currentSession()
  if (!token) throw new Error('Sign in to use Shadow Studio.')
  const response = await fetch(`${API_BASE}/api/shadow-studio/me${path}`, {
    signal,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.ok !== true) {
    const error = new Error(payload?.message || `Unable to load Studio (${response.status}).`)
    error.status = response.status
    throw error
  }
  if (authToken() !== token) throw new Error('Account changed. Please reload.')
  return payload
}

export function invalidateStudioMeCache() {
  currentSession()
  cache.clear()
}

export async function getStudioMeSummary({ signal, force = false } = {}) {
  const key = 'summary'
  const cached = force ? null : getCached(key)
  if (cached) return cached
  const payload = await request('/summary', { signal })
  const source = payload.totals || {}
  const read = name => {
    const value = Number(source[name])
    return Number.isSafeInteger(value) && value >= 0 ? value : null
  }
  const totals = { total: read('total'), long: read('long'), short: read('short') }
  if (!signal?.aborted) putCached(key, totals, SUMMARY_TTL)
  return totals
}

export async function listStudioMeVideos({ kind = 'all', search = '', offset = 0, limit = PAGE_SIZE, signal, force = false } = {}) {
  const type = ['all', 'long', 'short'].includes(kind) ? kind : 'all'
  const query = String(search || '').trim().slice(0, 100)
  const pageOffset = Number.isSafeInteger(offset) ? Math.max(0, Math.min(5000, offset)) : 0
  const pageLimit = Number.isSafeInteger(limit) ? Math.max(1, Math.min(24, limit)) : PAGE_SIZE
  const key = `videos:${type}:${query.toLowerCase()}:${pageOffset}:${pageLimit}`
  const cached = force ? null : getCached(key)
  if (cached) return { ...cached, items: [...cached.items] }
  const params = new URLSearchParams({ kind: type, search: query, offset: String(pageOffset), limit: String(pageLimit) })
  const payload = await request(`/videos?${params}`, { signal })
  const items = Array.isArray(payload.videos) ? payload.videos.slice(0, pageLimit) : []
  const pagination = payload.pagination || {}
  const next = Number(pagination.next_offset)
  const nextOffset = Number.isSafeInteger(next) && next > pageOffset ? next : pageOffset + items.length
  const result = {
    items,
    nextOffset,
    hasMore: pagination.has_more === true && nextOffset > pageOffset && nextOffset <= 5000,
  }
  if (!signal?.aborted) putCached(key, result, VIDEOS_TTL)
  return { ...result, items: [...items] }
}

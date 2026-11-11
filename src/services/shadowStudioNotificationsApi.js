const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

const ROOT = '/api/shadow-studio/notifications'
const CACHE_TTL = 5 * 60 * 1000
const LIST_TTL = 60 * 1000
const cache = new Map()
let cachedSession = ''

function token() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function prepareCache() {
  const current = token()
  if (current !== cachedSession) {
    cache.clear()
    cachedSession = current
  }
  if (!current) throw new Error('Sign in to view Studio notifications.')
  return current
}

async function request(path, { signal, method = 'GET' } = {}) {
  const accessToken = prepareCache()
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok === false) {
    throw new Error(data?.message || `Unable to load notifications (${response.status}).`)
  }
  return data
}

function getCached(key) {
  const item = cache.get(key)
  if (!item) return null
  if (item.expiresAt <= Date.now()) {
    cache.delete(key)
    return null
  }
  return item.data
}

function remember(key, data, ttl) {
  cache.delete(key)
  cache.set(key, { data, expiresAt: Date.now() + ttl })
  while (cache.size > 24) cache.delete(cache.keys().next().value)
  return data
}

export function invalidateStudioVideoNotifications() {
  cache.clear()
  window.dispatchEvent(new Event('shadow-studio-notifications-changed'))
}

export async function getStudioVideoNotificationUnreadCount({ signal, force = false } = {}) {
  prepareCache()
  if (!force) {
    const cached = getCached('unread')
    if (cached !== null) return cached
  }
  const data = await request(`${ROOT}/unread-count`, { signal })
  const count = Math.max(0, Number(data.unread_count || 0))
  if (!signal?.aborted) remember('unread', count, CACHE_TTL)
  return count
}

export async function listStudioVideoNotifications({ before = '', limit = 10, unreadOnly = false, signal, force = false } = {}) {
  prepareCache()
  const size = Math.max(1, Math.min(30, Math.floor(Number(limit) || 10)))
  const params = new URLSearchParams({ limit: String(size) })
  if (before) params.set('before', before)
  if (unreadOnly) params.set('unread', 'true')
  const key = `list:${params.toString()}`
  if (!force) {
    const cached = getCached(key)
    if (cached !== null) return cached
  }
  const result = await request(`${ROOT}?${params}`, { signal })
  const data = {
    notifications: Array.isArray(result.notifications) ? result.notifications : [],
    hasMore: Boolean(result.has_more),
    nextCursor: result.next_cursor || '',
  }
  if (!signal?.aborted) remember(key, data, LIST_TTL)
  return data
}

export async function markStudioVideoNotificationRead(id, { signal } = {}) {
  if (!/^[0-9a-f-]{36}$/i.test(String(id || ''))) throw new Error('Invalid notification.')
  const data = await request(`/api/authors/me/page-notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    signal,
  })
  invalidateStudioVideoNotifications()
  return data
}

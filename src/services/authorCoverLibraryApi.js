import { invalidateMyAuthorPageClientCache } from './myAuthorPageClientCache'

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const PAGE_SIZE = 9
const CACHE_TTL = 90 * 1000
const pageCache = new Map()
let cachedToken = ''

function currentToken() {
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
  if (token !== cachedToken) {
    pageCache.clear()
    cachedToken = token
  }
  return token
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = currentToken()
  if (!token) throw new Error('Sign in to manage your covers')
  const response = await fetch(`${API_BASE}/api/authors/me/cover-library${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok !== true) {
    const error = new Error(data?.message || `Cover library request failed (${response.status})`)
    error.status = response.status
    error.code = data?.code || ''
    throw error
  }
  if (currentToken() !== token) throw new Error('Account changed. Please reload')
  return data
}

export function invalidateAuthorCoverLibraryCache() {
  currentToken()
  pageCache.clear()
}

export async function listAuthorCovers({ offset = 0, force = false, signal } = {}) {
  const start = Number.isSafeInteger(offset) ? Math.max(0, Math.min(100, offset)) : 0
  const token = currentToken()
  const cacheKey = String(start)
  const cached = pageCache.get(cacheKey)
  if (!force && token && cached && cached.expires > Date.now()) return cached.result
  const payload = await request(`?offset=${start}`, { signal })
  const result = {
    items: (Array.isArray(payload.items) ? payload.items : [])
      .filter(item => item?.id && /^https:\/\//i.test(String(item.public_url || ''))),
    total: Math.max(0, Number(payload.total || 0)),
    limit: PAGE_SIZE,
    maxUploads: Math.max(1, Number(payload.max_uploads || 100)),
    canUpload: Boolean(payload.can_upload),
    activeCoverUrl: String(payload.active_cover_url || ''),
    nextOffset: Math.max(start, Number(payload.next_offset || start)),
    hasMore: Boolean(payload.has_more),
  }
  if (!signal?.aborted && currentToken()) {
    pageCache.delete(cacheKey)
    pageCache.set(cacheKey, { result, expires: Date.now() + CACHE_TTL })
    while (pageCache.size > 12) pageCache.delete(pageCache.keys().next().value)
  }
  return result
}

export async function selectAuthorCover(assetId, { signal } = {}) {
  const data = await request('/active', { method: 'PUT', body: { asset_id: assetId }, signal })
  invalidateAuthorCoverLibraryCache()
  invalidateMyAuthorPageClientCache()
  const coverUrl = String(data.cover_url || '')
  try {
    const stored = JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
    if (stored && typeof stored === 'object' && stored.id) {
      localStorage.setItem('shadow_author_page', JSON.stringify({ ...stored, cover_url: coverUrl }))
    }
  } catch {}
  window.dispatchEvent(new CustomEvent('shadow_author_cover_changed', { detail: { cover_url: coverUrl } }))
  return coverUrl
}

export async function deleteAuthorCover(assetId, { signal } = {}) {
  const data = await request(`/${encodeURIComponent(assetId)}`, { method: 'DELETE', signal })
  invalidateAuthorCoverLibraryCache()
  return data
}

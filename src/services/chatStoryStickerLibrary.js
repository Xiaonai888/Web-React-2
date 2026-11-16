const API_BASE = (import.meta.env.VITE_API_URL || (['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')).replace(/\/+$/, '')

const ROOT = `${API_BASE}/api/chat-story/stickers`
const TTL = 5 * 60 * 1000
const cache = new Map()
let account = ''

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { method = 'GET', body, signal, cacheMs = 0 } = {}) {
  const token = getToken()
  if (!token) throw new Error('Please sign in to use stickers.')
  if (token !== account) {
    account = token
    cache.clear()
  }
  const key = `${method}:${path}`
  const cached = cache.get(key)
  if (method === 'GET' && cacheMs && cached && cached.expires > Date.now()) return cached.data
  const response = await fetch(`${ROOT}${path}`, {
    method,
    signal,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const renewed = response.headers.get('X-Reader-Token')
  if (renewed && getToken() === token) {
    if (localStorage.getItem('shadow_reader_token') === token) localStorage.setItem('shadow_reader_token', renewed)
    else sessionStorage.setItem('shadow_reader_token', renewed)
    account = renewed
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) throw new Error(data.message || `Sticker request failed (${response.status})`)
  if (method === 'GET' && cacheMs) cache.set(key, { data, expires: Date.now() + cacheMs })
  if (method !== 'GET') cache.clear()
  return data
}

export const listStickerPacks = (options = {}) => {
  const params = new URLSearchParams({
    page: String(options.page || 1),
    limit: String(options.limit || 24),
    sort: options.sort === 'trending' ? 'trending' : 'default',
  })
  if (options.search) params.set('search', String(options.search).slice(0, 80))
  return request(`/packs?${params}`, { signal: options.signal, cacheMs: TTL })
}

export const listPackStickerImages = (folderId, options = {}) => request(
  `/packs/${encodeURIComponent(folderId)}/images?page=${options.page || 1}&limit=${options.limit || 36}`,
  { signal: options.signal, cacheMs: TTL }
)

export const getMyStickerCollection = (options = {}) => request('/me', { signal: options.signal, cacheMs: 30 * 1000 })
export const addSavedStickerPack = folderId => request('/me/packs', { method: 'POST', body: { folderId } })
export const removeSavedStickerPack = folderId => request(`/me/packs/${encodeURIComponent(folderId)}`, { method: 'DELETE' })
export const reorderSavedStickerPacks = folderIds => request('/me/packs/order', { method: 'PUT', body: { folderIds } })
export const addFavoriteSticker = imageId => request('/me/favorites', { method: 'POST', body: { imageId } })
export const removeFavoriteSticker = imageId => request(`/me/favorites/${encodeURIComponent(imageId)}`, { method: 'DELETE' })
export const recordChatStoryStickerUse = imageId => request('/me/used', { method: 'POST', body: { imageId } })
export const clearChatStoryStickerCache = () => cache.clear()

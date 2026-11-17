import { getActiveReaderToken, getActiveReaderUser } from '../utils/readerActiveAccount'

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const API_URL = `${API_BASE_URL}/api/authors/me/profile-photo-library`
const TTL = 60_000
const MAX_CACHED_PAGES = 12
const pages = new Map()
const requests = new Map()
let activeAccount = ''

function session() {
  const token = getActiveReaderToken()
  if (!token) throw new Error('LOGIN_REQUIRED')
  const userId = String(getActiveReaderUser()?.id || '')
  const nextAccount = `${userId}:${token}`
  if (activeAccount !== nextAccount) {
    activeAccount = nextAccount
    pages.clear()
    requests.clear()
  }
  return { token, account: nextAccount }
}

async function request(path, { token, method = 'GET', body, signal } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    cache: 'no-store',
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || 'AUTHOR_PROFILE_LIBRARY_REQUEST_FAILED')
    error.code = data.code || ''
    error.status = response.status
    throw error
  }
  return data
}

export function clearAuthorProfilePhotoLibraryCache() {
  pages.clear()
  requests.clear()
}

export async function fetchAuthorProfilePhotoLibraryPage({ offset = 0, limit = 9, force = false } = {}) {
  const { token, account } = session()
  const key = `${offset}:${limit}`
  const cached = pages.get(key)
  if (!force && cached && cached.expiresAt > Date.now()) return cached.result
  if (!force && requests.has(key)) return requests.get(key)
  const pending = request(`?offset=${offset}&limit=${limit}`, { token }).then((result) => {
    if (activeAccount === account) {
      pages.delete(key)
      pages.set(key, { result, expiresAt: Date.now() + TTL })
      while (pages.size > MAX_CACHED_PAGES) pages.delete(pages.keys().next().value)
    }
    return result
  })
  requests.set(key, pending)
  try {
    return await pending
  } finally {
    if (requests.get(key) === pending) requests.delete(key)
  }
}

export async function selectAuthorProfilePhotoFromLibrary(assetId) {
  const { token } = session()
  const result = await request('/active', { token, method: 'PUT', body: { asset_id: assetId } })
  clearAuthorProfilePhotoLibraryCache()
  return result
}

export async function removeAuthorProfilePhotoFromLibrary(assetId) {
  const { token } = session()
  const result = await request(`/${encodeURIComponent(assetId)}`, { token, method: 'DELETE' })
  clearAuthorProfilePhotoLibraryCache()
  return result
}

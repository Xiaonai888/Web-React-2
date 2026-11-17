import { getActiveReaderToken, getActiveReaderUser } from '../utils/readerActiveAccount'

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const API_URL = `${API_BASE_URL}/api/users/me/profile-photos`
const TTL = 60 * 1000
const MAX_PAGES = 12
const pages = new Map()
const requests = new Map()
let activeAccount = ''

function session() {
  const token = getActiveReaderToken()
  if (!token) throw new Error('LOGIN_REQUIRED')
  const userId = String(getActiveReaderUser()?.id || '')
  const next = `${userId}:${token}`
  if (activeAccount !== next) {
    activeAccount = next
    pages.clear()
    requests.clear()
  }
  return { token, account: next }
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
    const error = new Error(data.message || 'PHOTO_LIBRARY_REQUEST_FAILED')
    error.code = data.code || ''
    error.status = response.status
    throw error
  }
  return data
}

export function clearProfilePhotoLibraryCache() {
  pages.clear()
  requests.clear()
}

export async function fetchProfilePhotoLibraryPage({ offset = 0, limit = 9, force = false } = {}) {
  const { token, account } = session()
  const key = `${offset}:${limit}`
  const cached = pages.get(key)
  if (!force && cached && cached.expiresAt > Date.now()) return cached.result
  if (!force && requests.has(key)) return requests.get(key)
  const pending = request(`?offset=${offset}&limit=${limit}`, { token }).then((result) => {
    if (activeAccount === account) {
      pages.delete(key)
      pages.set(key, { result, expiresAt: Date.now() + TTL })
      while (pages.size > MAX_PAGES) pages.delete(pages.keys().next().value)
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

export async function registerProfilePhotoInLibrary(imageUrl) {
  const { token } = session()
  const result = await request('', { token, method: 'POST', body: { image_url: imageUrl } })
  clearProfilePhotoLibraryCache()
  return result
}

export async function deleteProfilePhotoFromLibrary(photoId) {
  const { token } = session()
  const result = await request(`/${encodeURIComponent(photoId)}`, { token, method: 'DELETE' })
  clearProfilePhotoLibraryCache()
  return result
}

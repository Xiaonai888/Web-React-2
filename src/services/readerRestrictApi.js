import { getReaderToken } from './chatApi'

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const BASE_PATH = '/api/users/me/restricted-readers'
const PAGE_SIZE = 10

export class ReaderRestrictApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'ReaderRestrictApiError'
    this.status = status
    this.code = code
  }
}

async function request(path, { method = 'GET', signal } = {}) {
  const token = getReaderToken()
  if (!token) throw new ReaderRestrictApiError(401, 'UNAUTHORIZED', 'Please sign in again.')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true) {
    throw new ReaderRestrictApiError(response.status, data.code || '', data.message || 'Request failed.')
  }
  return data
}

export async function getRestrictedReaders({ page = 1, query = '', signal } = {}) {
  const safePage = Math.max(1, Math.min(1000, Math.floor(Number(page) || 1)))
  const params = new URLSearchParams({
    offset: String((safePage - 1) * PAGE_SIZE),
    limit: String(PAGE_SIZE),
  })
  const search = String(query || '').trim()
  if (search) params.set('q', search)
  const data = await request(`${BASE_PATH}?${params.toString()}`, { signal })
  if (!Array.isArray(data.results) || !Number.isInteger(data.total) || data.total < 0 || typeof data.has_more !== 'boolean') {
    throw new ReaderRestrictApiError(502, 'INVALID_RESPONSE', 'Invalid restricted reader list.')
  }
  return { results: data.results, total: data.total, has_more: data.has_more }
}

export async function searchRestrictReaders({ query, signal } = {}) {
  const search = String(query || '').trim()
  if (search.length < 2) return []
  const params = new URLSearchParams({ q: search })
  const data = await request(`${BASE_PATH}/search?${params.toString()}`, { signal })
  if (!Array.isArray(data.results)) {
    throw new ReaderRestrictApiError(502, 'INVALID_RESPONSE', 'Invalid reader search results.')
  }
  return data.results.slice(0, 8)
}

export async function changeReaderRestriction({ readerId, shouldRestrict }) {
  const id = String(readerId || '').trim()
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new ReaderRestrictApiError(400, 'INVALID_READER_ID', 'Invalid reader ID.')
  }
  return request(`${BASE_PATH}/${encodeURIComponent(id)}`, {
    method: shouldRestrict ? 'POST' : 'DELETE',
  })
}

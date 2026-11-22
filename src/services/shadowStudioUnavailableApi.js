import { invalidateStudioMeCache } from './shadowStudioMeApi'
import { invalidateStudioRecycleCache } from './shadowStudioRecycleApi'
import { invalidateStudioContentCache } from '../components/author/studio/content/ShadowStudioContentCache'
import { invalidateStudioAnalyticsCache } from './shadowStudioAnalyticsApi'

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = getToken()
  if (!token) throw new Error('Sign in to manage your videos.')
  const response = await fetch(`${API_BASE}/api/shadow-studio/me${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok !== true) {
    throw new Error(data?.message || `Unable to complete request (${response.status}).`)
  }
  if (getToken() !== token) throw new Error('Account changed. Please reload.')
  return data
}

function validId(id) {
  if (!UUID.test(String(id || ''))) throw new Error('Invalid video ID.')
  return encodeURIComponent(String(id))
}

function invalidateVideoLists() {
  invalidateStudioMeCache()
  invalidateStudioRecycleCache()
  invalidateStudioContentCache()
  invalidateStudioAnalyticsCache()
}

export async function listStudioUnavailableVideos({ offset = 0, limit = 12, signal } = {}) {
  const start = Number.isSafeInteger(offset) ? Math.min(5000, Math.max(0, offset)) : 0
  const take = Number.isSafeInteger(limit) ? Math.min(24, Math.max(1, limit)) : 12
  const qs = new URLSearchParams({ offset: String(start), limit: String(take) })
  const data = await request(`/unavailable?${qs}`, { signal })
  const items = Array.isArray(data.videos) ? data.videos.slice(0, take) : []
  const nextOffset = Number(data.pagination?.next_offset)
  return {
    items,
    nextOffset: Number.isSafeInteger(nextOffset) && nextOffset > start ? nextOffset : start + items.length,
    hasMore: data.pagination?.has_more === true,
  }
}

export async function recheckStudioUnavailableVideo(id) {
  const result = await request(`/unavailable/${validId(id)}/recheck`, { method: 'POST' })
  invalidateVideoLists()
  return result
}

export async function replaceStudioUnavailableLink(id, videoUrl) {
  const result = await request(`/unavailable/${validId(id)}/link`, {
    method: 'PATCH', body: { video_url: String(videoUrl || '').trim() },
  })
  invalidateVideoLists()
  return result
}

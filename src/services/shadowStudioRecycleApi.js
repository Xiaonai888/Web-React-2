import { invalidateStudioMeCache } from './shadowStudioMeApi'
import { invalidateStudioContentCache } from '../components/author/studio/content/ShadowStudioContentCache'
import { invalidateStudioAnalyticsCache } from './shadowStudioAnalyticsApi'

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const PAGE_SIZE = 12
const MAX_PAGE_SIZE = 24
const MAX_RECORDS = 120
const MAX_ENTRIES = 10
const TTL = { archive: 5 * 60 * 1000, trash: 60 * 1000 }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const cache = new Map()
let session = ''
let revision = 0

function token() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function ensureSession() {
  const value = token()
  if (value !== session) {
    session = value
    cache.clear()
    revision += 1
  }
  return value
}

function validId(id) {
  const value = String(id || '')
  if (!UUID.test(value)) throw new Error('Invalid video ID.')
  return encodeURIComponent(value)
}

function getCached(key) {
  if (!ensureSession()) return null
  const entry = cache.get(key)
  if (!entry) return null
  if (entry.until <= Date.now()) {
    cache.delete(key)
    return null
  }
  cache.delete(key)
  cache.set(key, entry)
  return { ...entry.value, items: [...entry.value.items] }
}

function saveCached(key, value, ttl) {
  if (!ensureSession()) return
  cache.delete(key)
  cache.set(key, { value: { ...value, items: [...value.items] }, until: Date.now() + ttl })
  const recordCount = () => [...cache.values()].reduce((total, entry) => total + entry.value.items.length, 0)
  while (cache.size > MAX_ENTRIES || recordCount() > MAX_RECORDS) cache.delete(cache.keys().next().value)
}

export function invalidateStudioRecycleCache() {
  ensureSession()
  cache.clear()
  revision += 1
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const bearer = ensureSession()
  if (!bearer) throw new Error('Sign in to manage your videos.')
  const response = await fetch(`${API_BASE}/api/shadow-studio/me${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${bearer}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.ok !== true) {
    const error = new Error(result?.message || `Video request failed (${response.status}).`)
    error.status = response.status
    throw error
  }
  if (token() !== bearer) throw new Error('Account changed. Reload Shadow Studio.')
  return result
}

export async function listStudioRecycleVideos(section, { limit = PAGE_SIZE, offset = 0, force = false, signal } = {}) {
  if (!Object.hasOwn(TTL, section)) throw new Error('Invalid video collection.')
  const take = Number.isSafeInteger(limit) ? Math.min(MAX_PAGE_SIZE, Math.max(1, limit)) : PAGE_SIZE
  const start = Number.isSafeInteger(offset) ? Math.min(5000, Math.max(0, offset)) : 0
  const key = `${section}:${start}:${take}`
  const cached = force ? null : getCached(key)
  if (cached) return cached
  const currentSession = ensureSession()
  const currentRevision = revision
  const params = new URLSearchParams({ limit: String(take), offset: String(start) })
  const payload = await request(`/${section}?${params}`, { signal })
  const items = Array.isArray(payload.videos) ? payload.videos.slice(0, take) : []
  const next = Number(payload.pagination?.next_offset)
  const nextOffset = Number.isSafeInteger(next) && next > start ? next : start + items.length
  const result = {
    items,
    nextOffset,
    hasMore: payload.pagination?.has_more === true && nextOffset > start && nextOffset <= 5000,
  }
  if (!signal?.aborted && ensureSession() === currentSession && revision === currentRevision) {
    saveCached(key, result, TTL[section])
  }
  return { ...result, items: [...items] }
}

async function mutate(path, options) {
  const result = await request(path, options)
  invalidateStudioRecycleCache()
  invalidateStudioMeCache()
  invalidateStudioContentCache()
  invalidateStudioAnalyticsCache()
  return result
}

export function restoreStudioArchivedVideo(id) {
  return mutate(`/videos/${validId(id)}/archive`, { method: 'PATCH', body: { archived: false } })
}

export function moveStudioArchivedVideoToTrash(id) {
  return mutate(`/videos/${validId(id)}`, { method: 'DELETE' })
}

export function restoreStudioTrashedVideo(id) {
  return mutate(`/trash/${validId(id)}/restore`, { method: 'POST' })
}

export function permanentlyDeleteStudioTrashedVideo(id) {
  return mutate(`/trash/${validId(id)}`, { method: 'DELETE' })
}

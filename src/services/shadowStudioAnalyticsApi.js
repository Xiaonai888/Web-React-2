import { getActiveReaderToken } from '../utils/readerActiveAccount'
import { API_BASE_URL } from '../config/api'


const API_BASE = API_BASE_URL


const PAGE_SIZE = 30

function bearerToken() {
  return getActiveReaderToken()
}

async function request(path, { signal, authenticated = false } = {}) {
  const token = authenticated ? bearerToken() : ''
  if (authenticated && !token) throw new Error('[STUDIO_TOKEN_MISSING] No active Reader token. Please sign in again.')

  let response
  try {
    response = await fetch(`${API_BASE}${path.startsWith('/api/') ? path : `/api/fast${path}`}`, {
      signal,
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error(`[STUDIO_NETWORK_ERROR] Cannot connect to Studio API. ${error?.message || 'Network unavailable.'}`)
  }

  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok === false) {
    const code = typeof data?.code === 'string' && /^[A-Z0-9_]{1,80}$/.test(data.code)
      ? data.code
      : 'STUDIO_API_ERROR'
    const diagnostic = data?.diagnostic
    const detail = diagnostic && typeof diagnostic === 'object'
      ? ` (reason: ${String(diagnostic.reason || 'unknown')}, claim type: ${String(diagnostic.claim_type || 'unknown')}, length: ${String(diagnostic.claim_length ?? '?')})`
      : ''
    throw new Error(`[${code} | HTTP ${response.status}] ${data?.message || 'Unable to load Studio data.'}${detail}`)
  }
  return data || {}
}

export function isLongVideoCandidate(video) {
  if (video?.status !== 'published' || video?.access_type !== 'free' || !video?.published_at) return false
  if (video?.video_type === 'short' || video?.is_short === true) return false
  if (video?.video_type === 'long' || video?.is_short === false) return true
  if (Number.isFinite(Number(video?.duration_seconds)) && Number(video.duration_seconds) > 0) {
    return Number(video.duration_seconds) > 180
  }
  try {
    const url = new URL(video.video_url)
    if (url.pathname.toLowerCase().startsWith('/shorts/')) return false
    return ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'].includes(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

export async function listRecentStudioLongVideos({ take = 3, maxBatches = 5, signal } = {}) {
  const result = []
  let offset = 0
  let hasMore = false
  const seen = new Set()

  for (let page = 0; page < maxBatches && result.length < take; page += 1) {
    const response = await request(
      `/videos/mine?mode=manager&sort=latest&limit=${PAGE_SIZE}&offset=${offset}`,
      { signal, authenticated: true },
    )
    const rows = Array.isArray(response.videos) ? response.videos : []
    for (const video of rows) {
      if (isLongVideoCandidate(video) && !seen.has(video.id)) {
        seen.add(video.id)
        result.push(video)
        if (result.length === take) break
      }
    }
    hasMore = Boolean(response.pagination?.has_more)
    const next = response.pagination?.next_offset
    if (!hasMore || !Number.isSafeInteger(next) || next <= offset || next > 5000) break
    offset = next
  }

  return { videos: result, hasMore }
}

export async function getStudioPublishedVideo(videoId, { signal } = {}) {
  const data = await request(`/videos/${encodeURIComponent(videoId)}`, { signal })
  return data.video || null
}

export async function getStudioVideoActivity(videoId, { signal } = {}) {
  const [likes, comments] = await Promise.allSettled([
    request(`/videos/${encodeURIComponent(videoId)}/likes`, { signal }),
    request(`/videos/${encodeURIComponent(videoId)}/comments?limit=1&offset=0`, { signal }),
  ])
  return {
    likes: likes.status === 'fulfilled' && likes.value.like_count != null && Number.isFinite(Number(likes.value.like_count))
      ? Number(likes.value.like_count) : null,
    comments: comments.status === 'fulfilled' && comments.value.comment_count != null && Number.isFinite(Number(comments.value.comment_count))
      ? Number(comments.value.comment_count) : null,
  }
}

const STUDIO_ANALYTICS_TTL = { dashboard: 3 * 60 * 1000, video: 2 * 60 * 1000, ranking: 2 * 60 * 1000 }
const STUDIO_ANALYTICS_MAX_ENTRIES = 40
const analyticsCache = new Map()
let analyticsCacheSession = ''
let analyticsCacheRevision = 0

function ensureAnalyticsCacheSession() {
  const session = bearerToken()
  if (session !== analyticsCacheSession) {
    analyticsCache.clear()
    analyticsCacheSession = session
    analyticsCacheRevision += 1
  }
  return Boolean(session)
}

function readAnalyticsCache(key) {
  if (!ensureAnalyticsCacheSession()) return null
  const entry = analyticsCache.get(key)
  if (!entry) return null
  if (Date.now() >= entry.expiresAt) {
    analyticsCache.delete(key)
    return null
  }
  analyticsCache.delete(key)
  analyticsCache.set(key, entry)
  return entry.data
}

export function invalidateStudioAnalyticsCache() {
  ensureAnalyticsCacheSession()
  analyticsCacheRevision += 1
  analyticsCache.clear()
}

async function cachedAnalyticsRequest(kind, path, { signal, force = false } = {}, identifier = '') {
  if (!ensureAnalyticsCacheSession()) throw new Error('[STUDIO_TOKEN_MISSING] Sign in to view your Studio.')
  const owner = analyticsCacheSession
  const revision = analyticsCacheRevision
  const key = `${kind}:${identifier}`
  if (!force) {
    const cached = readAnalyticsCache(key)
    if (cached !== null) return cached
  }
  const result = await request(path, { signal, authenticated: true })
  if (!signal?.aborted && ensureAnalyticsCacheSession() && analyticsCacheSession === owner && analyticsCacheRevision === revision) {
    analyticsCache.delete(key)
    analyticsCache.set(key, { data: result, expiresAt: Date.now() + STUDIO_ANALYTICS_TTL[kind] })
    while (analyticsCache.size > STUDIO_ANALYTICS_MAX_ENTRIES) {
      analyticsCache.delete(analyticsCache.keys().next().value)
    }
  }
  return result
}

export async function getStudioDashboard({ signal, force = false } = {}) {
  return cachedAnalyticsRequest('dashboard', '/api/shadow-studio/analytics/dashboard', { signal, force })
}

export async function getStudioVideoAnalytics(videoId, { signal, force = false } = {}) {
  return cachedAnalyticsRequest('video', `/api/shadow-studio/analytics/videos/${encodeURIComponent(videoId)}`, { signal, force }, String(videoId))
}

export async function getStudioRanking(videoId, { signal, force = false } = {}) {
  return cachedAnalyticsRequest('ranking', `/api/shadow-studio/analytics/ranking?video_id=${encodeURIComponent(videoId)}`, { signal, force }, String(videoId))
}

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

const PAGE_SIZE = 30

function bearerToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { signal, authenticated = false } = {}) {
  const token = authenticated ? bearerToken() : ''
  if (authenticated && !token) throw new Error('Sign in to view your Studio.')
  const response = await fetch(`${API_BASE}${path.startsWith('/api/') ? path : `/api/fast${path}`}`, {
    signal,
    cache: 'no-store',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok === false) {
    throw new Error(data?.message || `Unable to load Studio data (${response.status}).`)
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

export async function getStudioDashboard({ signal } = {}) {
  return request('/api/shadow-studio/analytics/dashboard', { signal, authenticated: true })
}

export async function getStudioVideoAnalytics(videoId, { signal } = {}) {
  return request(`/api/shadow-studio/analytics/videos/${encodeURIComponent(videoId)}`, {
    signal,
    authenticated: true,
  })
}

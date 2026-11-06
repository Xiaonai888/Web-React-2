// NEW: isolated Fast / Reel Like API, separate from Post reactions.
// These endpoints become active AFTER fastLikesRouter is mounted on '/videos'.

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export class FastLikeApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'FastLikeApiError'
    this.status = status
    this.code = code
  }
}

export function getFastReaderToken() {
  try {
    return (
      sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') ||
      ''
    )
  } catch {
    return ''
  }
}

export function hasFastReaderSession() {
  return Boolean(getFastReaderToken())
}

async function fastLikeRequest(videoId, { method = 'GET', body, token = '', signal } = {}) {
  const id = String(videoId || '').trim()
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    throw new FastLikeApiError(400, 'INVALID_REEL_ID', 'Invalid Reel ID')
  }

  const authenticated = Boolean(token)
  const suffix = authenticated ? '/likes/me' : '/likes'
  const response = await fetch(
    `${API_BASE_URL}/api/fast/videos/${encodeURIComponent(id)}${suffix}`,
    {
      method,
      headers: {
        ...(authenticated ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(signal ? { signal } : {}),
      cache: 'no-store',
    },
  )
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.ok !== true) {
    throw new FastLikeApiError(
      response.status,
      payload.code || 'FAST_LIKE_REQUEST_FAILED',
      payload.message || 'Unable to update Reel Like',
    )
  }

  return {
    videoId: String(payload.video_id || id),
    liked: Boolean(payload.liked),
    likeCount: Math.max(0, Number(payload.like_count || 0)),
  }
}

// One read for the active Reel: authenticated request returns BOTH status and count.
// Anonymous visitors receive the public count, without a second request.
export function getFastReelLikeStatus(videoId, { signal } = {}) {
  return fastLikeRequest(videoId, { token: getFastReaderToken(), signal })
}

// Desired-state API is idempotent; retries cannot add extra Likes.
export function setFastReelLiked(videoId, liked, { signal } = {}) {
  const token = getFastReaderToken()
  if (!token) {
    throw new FastLikeApiError(401, 'LOGIN_REQUIRED', 'Please sign in to Like Reels')
  }
  return fastLikeRequest(videoId, {
    method: 'PUT',
    token,
    body: { liked: Boolean(liked) },
    signal,
  })
}

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

const PERIODS = new Set([7, 28, 30])
const FORMATS = new Set(['all', 'videos', 'shorts'])
const KINDS = new Set(['start', 'progress', 'end'])
const SURFACES = new Set(['search', 'discover', 'profile', 'author', 'related'])
const ACTIONS = new Set(['impression', 'click'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function hasStudioViewerSession() {
  return Boolean(localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token'))
}

async function studioRequest(path, { method = 'GET', body, signal, keepalive = false } = {}) {
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
  if (!token) throw new Error('Sign in to use Studio analytics.')

  const response = await fetch(`${API_BASE}/api/shadow-studio/advanced-analytics${path}`, {
    method,
    signal,
    cache: 'no-store',
    keepalive,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.ok !== true) {
    const error = new Error(result?.message || result?.reason || `Studio analytics error (${response.status}).`)
    error.status = response.status
    throw error
  }
  return result
}

export function getStudioAdvancedSummary(days = 30, format = 'all', { signal } = {}) {
  if (!PERIODS.has(days) || !FORMATS.has(format)) {
    throw new RangeError('Invalid Studio analytics period or format.')
  }
  return studioRequest(`/summary?days=${days}&format=${format}`, { signal })
}

export function postStudioPlaybackEvent({ videoId, sessionId, kind, playedSeconds }, { keepalive = false } = {}) {
  if (!UUID.test(String(videoId || '')) || !UUID.test(String(sessionId || '')) || !KINDS.has(kind)) {
    throw new TypeError('Invalid Studio playback event.')
  }
  if (typeof playedSeconds !== 'number' || !Number.isFinite(playedSeconds) || playedSeconds < 0 || playedSeconds > 43200) {
    throw new RangeError('Invalid played seconds.')
  }
  return studioRequest('/watch', {
    method: 'POST',
    keepalive,
    body: { video_id: videoId, session_id: sessionId, kind, played_seconds: kind === 'start' ? 0 : playedSeconds },
  })
}

export function postStudioThumbnailEvent({ videoId, surface, action }, { keepalive = true } = {}) {
  if (!UUID.test(String(videoId || '')) || !SURFACES.has(surface) || !ACTIONS.has(action)) {
    throw new TypeError('Invalid Studio thumbnail event.')
  }
  return studioRequest('/thumbnail', {
    method: 'POST',
    keepalive,
    body: { video_id: videoId, surface, action },
  })
}

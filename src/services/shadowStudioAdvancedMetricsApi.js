import { getActiveReaderToken } from '../utils/readerActiveAccount'

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
const AUTH_COOLDOWN_MS = 60 * 1000
const BAD_EVENT_COOLDOWN_MS = 30 * 1000
const UNAVAILABLE_COOLDOWN_MS = 5 * 60 * 1000
const FAILED_EVENT_LIMIT = 100

let failureSessionToken = ''
let authBlockedUntil = 0
let unavailableUntil = 0
const failedEvents = new Map()

function errorWithStatus(message, status, code = '') {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

function currentSessionToken() {
  const token = getActiveReaderToken()
  if (token !== failureSessionToken) {
    failureSessionToken = token
    authBlockedUntil = 0
    unavailableUntil = 0
    failedEvents.clear()
  }
  return token
}

function rememberFailedEvent(key, error) {
  failedEvents.delete(key)
  failedEvents.set(key, {
    error,
    expiresAt: Date.now() + BAD_EVENT_COOLDOWN_MS,
  })
  while (failedEvents.size > FAILED_EVENT_LIMIT) {
    failedEvents.delete(failedEvents.keys().next().value)
  }
}

export function hasStudioViewerSession() {
  return Boolean(currentSessionToken()) && authBlockedUntil <= Date.now()
}

async function studioRequest(path, { method = 'GET', body, signal, keepalive = false } = {}) {
  const token = currentSessionToken()
  if (!token) throw errorWithStatus('Sign in to use Studio analytics.', 401, 'LOGIN_REQUIRED')

  const now = Date.now()
  if (authBlockedUntil > now) {
    throw errorWithStatus('Studio analytics requires a valid reader session.', 401, 'STUDIO_SESSION_REJECTED')
  }
  if (unavailableUntil > now) {
    throw errorWithStatus('Studio advanced metrics have not been installed.', 503, 'STUDIO_ADVANCED_METRICS_NOT_INSTALLED')
  }

  const eventKey = method === 'POST' && path === '/thumbnail'
    ? JSON.stringify([path, body?.video_id, body?.surface, body?.action])
    : ''
  if (eventKey) {
    const prior = failedEvents.get(eventKey)
    if (prior && prior.expiresAt > now) throw prior.error
    if (prior) failedEvents.delete(eventKey)
  }

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
    const code = String(result?.code || '')
    const error = errorWithStatus(
      result?.message || result?.reason || `Studio analytics error (${response.status}).`,
      response.status,
      code
    )

    if (token === currentSessionToken()) {
      if (response.status === 401 || response.status === 403) {
  const sessionRejected = [
    'READER_SESSION_REVOKED',
    'READER_SESSION_EXPIRED',
    'READER_SESSION_REQUIRED',
    'TOKEN_EXPIRED',
    'TOKEN_INVALID',
    'WRONG_TOKEN_TYPE',
  ].includes(code)

  authBlockedUntil = sessionRejected
    ? Number.POSITIVE_INFINITY
    : Date.now() + AUTH_COOLDOWN_MS
} else if (code === 'STUDIO_ADVANCED_METRICS_NOT_INSTALLED') {
        unavailableUntil = Date.now() + UNAVAILABLE_COOLDOWN_MS
      } else if (eventKey && (response.status === 400 || response.status === 404)) {
        rememberFailedEvent(eventKey, error)
      }
    }
    throw error
  }

  if (eventKey) failedEvents.delete(eventKey)
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

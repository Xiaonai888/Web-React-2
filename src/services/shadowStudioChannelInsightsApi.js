const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

const PERIODS = new Set([7, 28, 30])

function readToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

async function studioRequest(path, { method = 'GET', topic, signal } = {}) {
  const authorization = readToken()
  if (!authorization) throw new Error('Sign in to view your Studio analytics.')

  const response = await fetch(`${API_BASE}/api/shadow-studio/${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${authorization}`,
      ...(topic !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(topic !== undefined ? { body: JSON.stringify({ topic }) } : {}),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.ok !== true) {
    throw new Error(payload?.message || `Studio analytics request failed (${response.status}).`)
  }
  return payload
}

export function isStudioInsightsPeriod(days) {
  return Number.isInteger(days) && PERIODS.has(days)
}

function validateDays(days) {
  if (!isStudioInsightsPeriod(days)) throw new RangeError('Unsupported Studio analytics period.')
  return days
}

function validateTopic(topic) {
  if (typeof topic !== 'string') throw new TypeError('Invalid Studio topic.')
  const text = topic.replace(/\s+/gu, ' ').trim()
  if (text.length < 2 || text.length > 80) throw new RangeError('Topic must contain 2–80 characters.')
  return text
}

export function getStudioChannelAudience(days = 30, { signal } = {}) {
  return studioRequest(`audience-analytics/summary?days=${validateDays(days)}`, { signal })
}

export function getStudioChannelTrends(days = 30, { signal } = {}) {
  return studioRequest(`trends-analytics/summary?days=${validateDays(days)}`, { signal })
}

export function saveStudioChannelTopic(topic, { signal } = {}) {
  return studioRequest('trends-analytics/saved-topics', {
    method: 'POST', topic: validateTopic(topic), signal,
  })
}

export function removeStudioChannelTopic(topic, { signal } = {}) {
  return studioRequest('trends-analytics/saved-topics', {
    method: 'DELETE', topic: validateTopic(topic), signal,
  })
}

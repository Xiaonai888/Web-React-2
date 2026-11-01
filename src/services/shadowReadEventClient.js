const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const API_PATH = '/api/read-event'

export class ReadEventRequestError extends Error {
  constructor(message, code = 'READ_EVENT_REQUEST_FAILED', status = 0) {
    super(message)
    this.name = 'ReadEventRequestError'
    this.code = code
    this.status = status
  }
}

function readerToken() {
  return sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = readerToken()
  if (!token) throw new ReadEventRequestError('Reader login required', 'READER_LOGIN_REQUIRED', 401)

  const response = await fetch(`${API_BASE_URL}${API_PATH}${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result?.ok !== true) {
    throw new ReadEventRequestError(
      String(result?.message || result?.code || 'Read Event request failed').slice(0, 180),
      String(result?.code || 'READ_EVENT_REQUEST_FAILED'),
      response.status,
    )
  }
  return result
}

export function getShadowReadEvent(options) {
  return request('/', options)
}

export function joinShadowReadEvent(options) {
  return request('/join', { ...options, method: 'POST' })
}

export function claimShadowReadEventMilestones(dayNumber, options) {
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 7) {
    throw new TypeError('Invalid Read Event day')
  }
  return request('/milestones/claim', {
    ...options, method: 'POST', body: { day_number: dayNumber },
  })
}

export function getShadowReadEventLeaderboard(type, dayNumber, options) {
  if (type !== 'daily' && type !== 'overall') {
    throw new TypeError('Unknown Read Event leaderboard')
  }
  if (type === 'daily' && (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 7)) {
    throw new TypeError('Invalid Read Event leaderboard day')
  }
  const query = type === 'daily' ? `?day=${dayNumber}` : ''
  return request(`/leaderboard/${type}${query}`, options)
}

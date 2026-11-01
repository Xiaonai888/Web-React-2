const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const API_PATH = '/api/read-event/rewards'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function assertId(value) {
  if (typeof value !== 'string' || !UUID.test(value)) {
    throw new TypeError('Invalid Read Event identifier')
  }
  return value
}

function readerToken() {
  return sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') || ''
}

async function request(eventId, path = '', { method = 'GET', body, signal } = {}) {
  const token = readerToken()
  if (!token) {
    const error = new Error('READER_LOGIN_REQUIRED')
    error.code = 'READER_LOGIN_REQUIRED'
    throw error
  }

  const response = await fetch(`${API_BASE_URL}${API_PATH}/${assertId(eventId)}${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok !== true) {
    const error = new Error(String(data?.code || 'READ_EVENT_REWARDS_UNAVAILABLE'))
    error.code = String(data?.code || 'READ_EVENT_REWARDS_UNAVAILABLE')
    error.status = response.status
    throw error
  }
  return data
}

export function getShadowReadEventRewards(eventId, page = 1, options = {}) {
  if (!Number.isInteger(page) || page < 1 || page > 50) {
    throw new RangeError('Invalid rewards page')
  }
  return request(eventId, `?page=${page}`, options)
}

export function redeemShadowReadEventFeaturedCards(eventId, episodeId, options = {}) {
  return request(eventId, '/redeem', {
    ...options,
    method: 'POST',
    body: { episode_id: assertId(episodeId) },
  })
}

import { getReaderToken } from './chatApi'

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PATH = '/api/users/me/restriction-settings'

export const DEFAULT_READER_RESTRICTION_SETTINGS = Object.freeze({
  hide_comments: false,
  filter_messages: false,
  hide_activity_status: false,
  mute_mentions: false,
})

function parseSettings(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid restriction settings response.')
  return Object.fromEntries(
    Object.keys(DEFAULT_READER_RESTRICTION_SETTINGS).map((key) => {
      if (typeof data[key] !== 'boolean') throw new Error('Invalid restriction settings response.')
      return [key, data[key]]
    }),
  )
}

async function request(method, body, signal) {
  const token = getReaderToken()
  if (!token) {
    const error = new Error('Please sign in again.')
    error.status = 401
    throw error
  }

  const response = await fetch(`${API_BASE_URL}${PATH}`, {
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
  if (!response.ok || result.ok !== true) {
    const error = new Error(result.message || 'Could not update restriction settings.')
    error.status = response.status
    throw error
  }
  return parseSettings(result.settings)
}

export function getReaderRestrictionSettings({ signal } = {}) {
  return request('GET', undefined, signal)
}

export function updateReaderRestrictionSetting(key, enabled) {
  if (!(key in DEFAULT_READER_RESTRICTION_SETTINGS) || typeof enabled !== 'boolean') {
    return Promise.reject(new Error('Invalid restriction setting.'))
  }
  return request('PATCH', { key, enabled })
}

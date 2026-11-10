const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

const FORMATS = new Set(['all', 'videos', 'shorts'])

function token() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

async function readChannelAnalytics(path, { signal } = {}) {
  const authorization = token()
  if (!authorization) throw new Error('Sign in to view Shadow Studio analytics.')

  const response = await fetch(`${API_BASE}/api/shadow-studio/channel-analytics${path}`, {
    method: 'GET',
    signal,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${authorization}` },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.ok !== true) {
    throw new Error(payload?.message || `Could not load channel analytics (${response.status}).`)
  }
  return payload
}

export function isStudioChannelFormat(format) {
  return FORMATS.has(format)
}

export function getStudioChannelOverview({ signal } = {}) {
  return readChannelAnalytics('/overview', { signal })
}

export function getStudioChannelContent(format = 'all', { signal } = {}) {
  if (!FORMATS.has(format)) throw new RangeError('Unsupported channel analytics format.')
  return readChannelAnalytics(`/content?format=${encodeURIComponent(format)}`, { signal })
}

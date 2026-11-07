// NEW: independent Fast Not interested API. A reader token is needed for server sync.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function getFastReaderToken() {
  try {
    return sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

async function request(path, { token, method = 'GET', body, signal } = {}) {
  if (!token) throw new Error('Please sign in to save Reel feedback')
  const response = await fetch(`${API_BASE_URL}/api/fast${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(signal ? { signal } : {}),
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.ok !== true) {
    throw new Error(payload.message || 'Unable to save Reel feedback')
  }
  return payload
}

export async function listMyFastNotInterested({ token = getFastReaderToken(), offset = 0, signal } = {}) {
  const query = new URLSearchParams({ limit: '200', offset: String(offset) })
  return request(`/videos/not-interested/mine?${query}`, { token, signal })
}

export async function setMyFastNotInterested(videoId, notInterested, { token = getFastReaderToken() } = {}) {
  if (!UUID.test(String(videoId || ''))) throw new Error('Invalid Reel ID')
  return request(`/videos/${encodeURIComponent(videoId)}/not-interested/me`, {
    token,
    method: 'PUT',
    body: { not_interested: Boolean(notInterested) },
  })
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_MS = 45000
const ERROR_CACHE_MS = 10000
let cached = null
let pending = null

function getReaderToken() {
  try {
    return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

function getMembershipMarker() {
  try {
    const raw = sessionStorage.getItem('shadow_reader_user') || localStorage.getItem('shadow_reader_user')
    if (!raw) return ''
    const user = JSON.parse(raw)
    return `${Boolean(user?.is_premium)}:${user?.premium_expires_at || ''}`
  } catch {
    return ''
  }
}

export async function hasPremiumAdFree() {
  if (typeof window === 'undefined') return false

  const token = getReaderToken()
  if (!token) return false

  const marker = getMembershipMarker()
  const now = Date.now()

  if (cached?.token === token && cached.marker === marker && cached.until > now) {
    return cached.active && cached.expiresAt > now
  }

  if (pending?.token === token && pending.marker === marker) {
    return pending.promise
  }

  const request = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/purchase/premium/status`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Premium status unavailable')

      const data = await response.json()
      const expiresAt = Date.parse(data?.premium?.premium_expires_at || '')
      const active = data?.ok === true && data?.premium?.is_premium === true &&
        Number.isFinite(expiresAt) && expiresAt > Date.now()

      cached = {
        token,
        marker,
        active,
        expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
        until: Date.now() + CACHE_MS,
      }
      return active
    } catch {
      cached = {
        token,
        marker,
        active: false,
        expiresAt: 0,
        until: Date.now() + ERROR_CACHE_MS,
      }
      return false
    }
  })()

  pending = { token, marker, promise: request }
  try {
    return await request
  } finally {
    if (pending?.promise === request) pending = null
  }
}

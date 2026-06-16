import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const VISITOR_ID_KEY = 'shadow_anonymous_visitor_id'
const SESSION_ID_KEY = 'shadow_anonymous_session_id'
const LAST_TRACK_KEY = 'shadow_anonymous_last_track'

function createTrackingId(prefix) {
  const randomValue =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

  return `${prefix}-${randomValue}`
}

function readOrCreateId(storage, key, prefix) {
  try {
    let value = storage.getItem(key)

    if (!value) {
      value = createTrackingId(prefix)
      storage.setItem(key, value)
    }

    return value
  } catch {
    return createTrackingId(prefix)
  }
}

function hasReaderAccount() {
  try {
    return Boolean(
      sessionStorage.getItem('shadow_reader_token') ||
        localStorage.getItem('shadow_reader_token')
    )
  } catch {
    return false
  }
}

function wasRecentlyTracked(path) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(LAST_TRACK_KEY) || 'null')

    return Boolean(
      saved &&
        saved.path === path &&
        Date.now() - Number(saved.tracked_at || 0) < 30_000
    )
  } catch {
    return false
  }
}

function rememberTrackedPath(path) {
  try {
    sessionStorage.setItem(
      LAST_TRACK_KEY,
      JSON.stringify({
        path,
        tracked_at: Date.now(),
      })
    )
  } catch {
    return
  }
}

export default function VisitorTracker() {
  const location = useLocation()

  useEffect(() => {
    if (hasReaderAccount()) return undefined

    const path = location.pathname || '/'
    if (wasRecentlyTracked(path)) return undefined

    const visitorId = readOrCreateId(localStorage, VISITOR_ID_KEY, 'visitor')
    const sessionId = readOrCreateId(sessionStorage, SESSION_ID_KEY, 'session')
    const controller = new AbortController()

    const timer = window.setTimeout(() => {
      rememberTrackedPath(path)

      fetch(`${API_URL}/api/visitors/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          session_id: sessionId,
          path,
          referrer: document.referrer || '',
        }),
        keepalive: true,
        signal: controller.signal,
      }).catch(() => {})
    }, 800)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [location.pathname])

  return null
}

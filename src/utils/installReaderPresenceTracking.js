const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HEARTBEAT_INTERVAL_MS = 60000
const MIN_HEARTBEAT_GAP_MS = 10000
const IDLE_AFTER_MS = 2 * 60 * 1000
const SESSION_KEY = 'shadow_reader_presence_session_id'

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`
}

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    sessionId = createSessionId()
    localStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}

export function installReaderPresenceTracking() {
  if (window.__shadowReaderPresenceTrackingInstalled) return

  window.__shadowReaderPresenceTrackingInstalled = true

  let lastActivityAt = Date.now()
  let lastPath = window.location.pathname || '/'
  let lastHeartbeatAt = 0
  let sending = false

  const markActive = () => {
    lastActivityAt = Date.now()
  }

  const sendHeartbeat = async ({ forceInactive = false } = {}) => {
    if (sending) return
    if (!getReaderToken()) return
    if (!navigator.onLine) return

    const now = Date.now()

    if (!forceInactive && now - lastHeartbeatAt < MIN_HEARTBEAT_GAP_MS) {
      return
    }

    lastHeartbeatAt = now
    sending = true

    try {
      await fetch(`${API_BASE_URL}/api/reader-presence/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: getSessionId(),
          current_path: window.location.pathname || '/',
          visibility_state: document.visibilityState,
          is_active:
            !forceInactive &&
            document.visibilityState === 'visible' &&
            Date.now() - lastActivityAt < IDLE_AFTER_MS,
        }),
        keepalive: true,
      })
    } catch {
    } finally {
      sending = false
    }
  }

  const checkPath = () => {
    const currentPath = window.location.pathname || '/'

    if (currentPath === lastPath) return

    lastPath = currentPath
    markActive()
    sendHeartbeat()
  }

  const originalPushState = window.history.pushState.bind(window.history)
  const originalReplaceState = window.history.replaceState.bind(window.history)

  window.history.pushState = (...args) => {
    const result = originalPushState(...args)
    window.setTimeout(checkPath, 0)
    return result
  }

  window.history.replaceState = (...args) => {
    const result = originalReplaceState(...args)
    window.setTimeout(checkPath, 0)
    return result
  }

  const activityEvents = [
    'pointerdown',
    'keydown',
    'touchstart',
    'scroll',
  ]

  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, markActive, { passive: true })
  })

  window.addEventListener('popstate', () => {
    markActive()
    checkPath()
  })

  window.addEventListener('focus', () => {
    markActive()
    sendHeartbeat()
  })

  window.addEventListener('online', () => {
    markActive()
    sendHeartbeat()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      markActive()
      sendHeartbeat()
    } else {
      sendHeartbeat({ forceInactive: true })
    }
  })

  window.addEventListener('pagehide', () => {
    sendHeartbeat({ forceInactive: true })
  })

  window.setInterval(() => {
    checkPath()

    if (document.visibilityState === 'visible') {
      sendHeartbeat()
    }
  }, HEARTBEAT_INTERVAL_MS)

  window.setTimeout(() => {
    sendHeartbeat()
  }, 1500)
}

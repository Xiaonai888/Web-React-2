const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HEARTBEAT_INTERVAL_MS = 60 * 1000
const IDLE_AFTER_MS = 2 * 60 * 1000
const MIN_SEND_GAP_MS = 15 * 1000
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
  let lastSentAt = 0
  let lastPayloadKey = ''
  let sending = false

  const markActive = () => {
    lastActivityAt = Date.now()
  }

  const sendHeartbeat = async ({
    forceInactive = false,
    force = false,
  } = {}) => {
    if (sending) return
    if (!getReaderToken()) return
    if (!navigator.onLine) return

    const payload = {
      session_id: getSessionId(),
      current_path: window.location.pathname || '/',
      visibility_state: document.visibilityState,
      is_active:
        !forceInactive &&
        document.visibilityState === 'visible' &&
        Date.now() - lastActivityAt < IDLE_AFTER_MS,
    }

    const now = Date.now()
    const payloadKey = JSON.stringify({
      current_path: payload.current_path,
      visibility_state: payload.visibility_state,
      is_active: payload.is_active,
    })

    if (
      !force &&
      now - lastSentAt < MIN_SEND_GAP_MS
    ) {
      return
    }

    if (
      !force &&
      payloadKey === lastPayloadKey &&
      now - lastSentAt < HEARTBEAT_INTERVAL_MS
    ) {
      return
    }

    sending = true

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reader-presence/heartbeat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        }
      )

      if (response.ok) {
        lastSentAt = Date.now()
        lastPayloadKey = payloadKey
      }
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
    sendHeartbeat({ force: true })
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
    sendHeartbeat({ force: true })
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      markActive()
      sendHeartbeat({ force: true })
    } else {
      sendHeartbeat({
        forceInactive: true,
        force: true,
      })
    }
  })

  window.addEventListener('pagehide', () => {
    sendHeartbeat({
      forceInactive: true,
      force: true,
    })
  })

  window.setInterval(() => {
    checkPath()

    if (document.visibilityState === 'visible') {
      sendHeartbeat()
    }
  }, HEARTBEAT_INTERVAL_MS)

  window.setTimeout(() => {
    sendHeartbeat({ force: true })
  }, 1500)
}

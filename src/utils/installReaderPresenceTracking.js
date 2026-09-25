const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000
const IDLE_AFTER_MS = 2 * 60 * 1000
const MIN_SEND_GAP_MS = 15 * 1000
const FAILURE_RETRY_MS = 30 * 1000
const MAX_FAILURE_RETRY_MS = 5 * 60 * 1000
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
  let sessionId = sessionStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    sessionId = createSessionId()
    sessionStorage.setItem(SESSION_KEY, sessionId)
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
  let lastSentToken = ''
  let nextAttemptAt = 0
  let retryToken = ''
  let blockedToken = ''
  let failureCount = 0
  let sending = false
  let pendingHeartbeat = null
  let deferredTimer = null

  const markActive = () => {
    lastActivityAt = Date.now()
  }

  const scheduleHeartbeat = (delay, options = {}) => {
    pendingHeartbeat = {
      forceInactive: Boolean(options.forceInactive),
    }
    if (deferredTimer !== null) return
    deferredTimer = window.setTimeout(() => {
      deferredTimer = null
      const pending = pendingHeartbeat
      pendingHeartbeat = null
      void sendHeartbeat(pending || {})
    }, Math.max(0, delay))
  }

  const sendHeartbeat = async ({
    forceInactive = false,
  } = {}) => {
    const token = getReaderToken()
    if (!token || !navigator.onLine) return

    if (retryToken !== token) {
      nextAttemptAt = 0
      failureCount = 0
      blockedToken = ''
      retryToken = token
    }

    if (blockedToken === token) return

    if (sending) {
      pendingHeartbeat = { forceInactive }
      return
    }

    const now = Date.now()
    if (now < nextAttemptAt) {
      scheduleHeartbeat(nextAttemptAt - now, { forceInactive })
      return
    }

    const payload = {
      session_id: getSessionId(),
      current_path: window.location.pathname || '/',
      visibility_state: document.visibilityState,
      is_active:
        !forceInactive &&
        document.visibilityState === 'visible' &&
        now - lastActivityAt < IDLE_AFTER_MS,
    }

    const payloadKey = JSON.stringify(payload)
    const sameToken = token === lastSentToken
    const samePayload = payloadKey === lastPayloadKey && sameToken
    const elapsed = now - lastSentAt

    if (samePayload && elapsed < HEARTBEAT_INTERVAL_MS) return

    if (sameToken && lastSentAt && elapsed < MIN_SEND_GAP_MS && !forceInactive) {
      if (!samePayload) scheduleHeartbeat(MIN_SEND_GAP_MS - elapsed)
      return
    }

    sending = true

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reader-presence/heartbeat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        }
      )

      if (response.ok) {
        lastSentAt = Date.now()
        lastPayloadKey = payloadKey
        lastSentToken = token
        failureCount = 0
        nextAttemptAt = 0
      } else if (response.status === 401 || response.status === 403) {
        blockedToken = token
        nextAttemptAt = 0
      } else {
        failureCount = Math.min(5, failureCount + 1)
        nextAttemptAt = Date.now() + Math.min(
          MAX_FAILURE_RETRY_MS,
          FAILURE_RETRY_MS * 2 ** (failureCount - 1)
        )
      }
    } catch {
      failureCount = Math.min(5, failureCount + 1)
      nextAttemptAt = Date.now() + Math.min(
        MAX_FAILURE_RETRY_MS,
        FAILURE_RETRY_MS * 2 ** (failureCount - 1)
      )
    } finally {
      sending = false
      if (pendingHeartbeat) {
        const pending = pendingHeartbeat
        pendingHeartbeat = null
        if (blockedToken !== token) {
          scheduleHeartbeat(Math.max(0, nextAttemptAt - Date.now()), pending)
        }
      }
    }
  }

    const checkPath = () => {
    const currentPath = window.location.pathname || '/'
    if (currentPath === lastPath) return

    lastPath = currentPath
    markActive()
    if (document.visibilityState !== 'visible') return
    scheduleHeartbeat(Math.max(0, 60_000 - (Date.now() - lastSentAt)))
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
        })
    }
  })

  window.addEventListener('pagehide', () => {
    sendHeartbeat({
      forceInactive: true,
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

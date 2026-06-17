import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const VISITOR_ID_KEY = 'shadow_anonymous_visitor_id'
const SESSION_ID_KEY = 'shadow_anonymous_session_id'
const LAST_TRACK_KEY = 'shadow_anonymous_last_track'
const EVENT_HISTORY_KEY = 'shadow_anonymous_event_history'

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

function readEventHistory() {
  try {
    const value = JSON.parse(sessionStorage.getItem(EVENT_HISTORY_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function getBehaviorSnapshot(path) {
  const now = Date.now()
  const history = readEventHistory().filter(
    (item) => now - Number(item?.tracked_at || 0) <= 60_000
  )
  const previous = history.at(-1) || null

  return {
    navigation_count_10s:
      history.filter((item) => now - Number(item?.tracked_at || 0) <= 10_000).length + 1,
    rapid_repeat_count_30s: history.filter(
      (item) =>
        item?.path === path &&
        now - Number(item?.tracked_at || 0) <= 30_000
    ).length,
    seconds_since_previous_event: previous
      ? Math.max(0, Math.round((now - Number(previous.tracked_at || now)) / 1000))
      : null,
    previous_path: previous?.path || '',
  }
}

function rememberNavigationEvent(path) {
  try {
    const now = Date.now()
    const history = readEventHistory()
      .filter((item) => now - Number(item?.tracked_at || 0) <= 60_000)
      .slice(-49)

    history.push({
      path,
      tracked_at: now,
    })

    sessionStorage.setItem(EVENT_HISTORY_KEY, JSON.stringify(history))
  } catch {
    return
  }
}

function getBrowserSignals() {
  const navigationEntry = performance.getEntriesByType?.('navigation')?.[0]

  return {
    webdriver_detected: navigator.webdriver === true,
    language: String(navigator.language || '').slice(0, 40),
    languages_count: Array.isArray(navigator.languages) ? navigator.languages.length : 0,
    timezone: String(Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 80),
    screen_width: Number(window.screen?.width || 0),
    screen_height: Number(window.screen?.height || 0),
    color_depth: Number(window.screen?.colorDepth || 0),
    pixel_ratio: Number(window.devicePixelRatio || 1),
    touch_points: Number(navigator.maxTouchPoints || 0),
    hardware_concurrency: Number(navigator.hardwareConcurrency || 0),
    device_memory: Number(navigator.deviceMemory || 0),
    cookie_enabled: navigator.cookieEnabled === true,
    platform: String(navigator.userAgentData?.platform || navigator.platform || '').slice(0, 80),
    user_agent_mobile: navigator.userAgentData?.mobile === true,
    plugins_count: Number(navigator.plugins?.length || 0),
    navigation_type: String(navigationEntry?.type || '').slice(0, 30),
  }
}

async function readResponse(response) {
  const text = await response.text()

  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

export default function VisitorTracker() {
  const location = useLocation()
  const [debugState, setDebugState] = useState(null)

  useEffect(() => {
    const debugEnabled = new URLSearchParams(window.location.search).get('visitorDebug') === '1'

    if (hasReaderAccount()) {
      if (debugEnabled) {
        setDebugState({
          ok: false,
          title: 'Visitor tracking skipped',
          message: 'A reader account token exists in this browser.',
        })
      }

      return undefined
    }

    const path = location.pathname || '/'
    const behaviorSignals = getBehaviorSnapshot(path)
    rememberNavigationEvent(path)

    if (!debugEnabled && wasRecentlyTracked(path)) return undefined

    const visitorId = readOrCreateId(localStorage, VISITOR_ID_KEY, 'visitor')
    const sessionId = readOrCreateId(sessionStorage, SESSION_ID_KEY, 'session')
    const controller = new AbortController()

    if (debugEnabled) {
      setDebugState({
        ok: null,
        title: 'Sending visitor tracking...',
        message: `${API_URL}/api/visitors/track`,
      })
    }

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/api/visitors/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitor_id: visitorId,
            session_id: sessionId,
            path,
            referrer: document.referrer || '',
            browser_signals: getBrowserSignals(),
            behavior_signals: behaviorSignals,
            debug: debugEnabled,
          }),
          keepalive: true,
          signal: controller.signal,
        })

        const data = await readResponse(response)

        if (!response.ok || data.ok === false) {
          const detailParts = [
            `${response.status} ${response.statusText}`.trim(),
            data.message,
            data.details,
            data.code,
            data.hint,
            data.raw,
          ].filter(Boolean)

          throw new Error(detailParts.join(' | '))
        }

        rememberTrackedPath(path)

        if (debugEnabled) {
          setDebugState({
            ok: true,
            title: 'Visitor tracking succeeded',
            message: `Visitor ID: ${visitorId}`,
          })
        }
      } catch (error) {
        if (error?.name === 'AbortError') return

        console.error('VISITOR TRACKING FAILED:', error)

        if (debugEnabled) {
          setDebugState({
            ok: false,
            title: 'Visitor tracking failed',
            message: error?.message || 'Unknown tracking error',
          })
        }
      }
    }, 800)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [location.pathname, location.search])

  if (!debugState) return null

  const background =
    debugState.ok === true ? '#ECFDF5' : debugState.ok === false ? '#FEF2F2' : '#EFF6FF'
  const border =
    debugState.ok === true ? '#10B981' : debugState.ok === false ? '#EF4444' : '#3B82F6'
  const text =
    debugState.ok === true ? '#065F46' : debugState.ok === false ? '#991B1B' : '#1E3A8A'

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 99999,
        width: 'min(460px, calc(100vw - 32px))',
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${border}`,
        background,
        color: text,
        boxShadow: '0 14px 34px rgba(15, 23, 42, 0.18)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 900 }}>{debugState.title}</div>
      <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, wordBreak: 'break-word' }}>
        {debugState.message}
      </div>
    </div>
  )
}

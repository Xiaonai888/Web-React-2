const API_BASE = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const REPORT_URL = `${API_BASE.replace(/\/+$/, '')}/api/diagnostics/reader-health`
const SAMPLE_RATE = 0.1
const SAMPLE_KEY = 'shadow_reader_health_sample_v1'
const SESSION_KEY = 'shadow_reader_presence_session_id'
const FALLBACK_SESSION_KEY = 'shadow_reader_health_session_v1'
const MAX_REPORTS_PER_TAB = 8
const MIN_SEND_GAP_MS = 120000
const CRITICAL_SEND_GAP_MS = 15000
const MAX_PENDING = 12
const VALID_CRITICAL = new Set(['js_error', 'promise_rejection', 'script_load_failure'])

function randomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 15) | 64
  bytes[8] = (bytes[8] & 63) | 128
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY) || sessionStorage.getItem(FALLBACK_SESSION_KEY)
    if (!id || !/^[\da-f-]{16,64}$/i.test(id)) {
      id = randomId()
      sessionStorage.setItem(FALLBACK_SESSION_KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

function isSampled() {
  try {
    const saved = sessionStorage.getItem(SAMPLE_KEY)
    if (saved === '1' || saved === '0') return saved === '1'
    const result = Math.random() < SAMPLE_RATE
    sessionStorage.setItem(SAMPLE_KEY, result ? '1' : '0')
    return result
  } catch {
    return Math.random() < SAMPLE_RATE
  }
}

function pageGroup() {
  const path = window.location.pathname.toLowerCase()
  if (path === '/' || path === '/home') return 'HOME'
  if (path.includes('/read') || path.includes('/episode')) return 'READ'
  if (path.includes('/discover') || path.includes('/for-you')) return 'DISCOVER'
  if (path.includes('/fast') || path.includes('/reel')) return 'FAST'
  if (path.includes('/manga')) return 'MANGA'
  if (path.includes('/story')) return 'STORY'
  if (path.includes('/shop') || path.includes('/store') || path.includes('/mall')) return 'STORE'
  if (path.includes('/author')) return 'AUTHOR'
  if (path.includes('/chat')) return 'CHAT'
  if (path.includes('/mine') || path.includes('/me')) return 'MINE'
  return 'OTHER'
}

function platform() {
  const agent = navigator.userAgent || ''
  const browser = /Edg\//.test(agent) ? 'EDGE'
    : /SamsungBrowser\//.test(agent) ? 'SAMSUNG'
      : /(?:Chrome|CriOS)\//.test(agent) ? 'CHROME'
        : /(?:Firefox|FxiOS)\//.test(agent) ? 'FIREFOX'
          : /Safari\//.test(agent) ? 'SAFARI' : 'OTHER'
  const os = /Android/i.test(agent) ? 'ANDROID'
    : /iPhone|iPad|iPod/i.test(agent) ? 'IOS'
      : /Windows/i.test(agent) ? 'WINDOWS'
        : /Macintosh|Mac OS X/i.test(agent) ? 'MACOS'
          : /Linux/i.test(agent) ? 'LINUX' : 'OTHER'
  const device = /iPad|Tablet/i.test(agent) ? 'TABLET'
    : /Mobile|iPhone|Android/i.test(agent) ? 'MOBILE' : 'DESKTOP'
  return { browser, os, device }
}

function fingerprint(value) {
  const input = String(value || '').slice(0, 1000)
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `E-${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`
}

export function installReaderHealthMonitor() {
  if (window.__shadowReaderHealthMonitorInstalled) return
  window.__shadowReaderHealthMonitorInstalled = true

  const id = sessionId()
  const sampled = isSampled()
  const details = platform()
  const pending = []
  const recent = new Map()
  let reports = 0
  let lastSent = 0
  let delayedFlush = null
  let lastTimerAt = performance.now()
  let visibleSince = document.visibilityState === 'visible' ? performance.now() : Infinity

  const record = (type, code = '', metricMs = 0) => {
    if (!sampled && !VALID_CRITICAL.has(type)) return
    if (reports >= MAX_REPORTS_PER_TAB) return
    const now = Date.now()
    const page = pageGroup()
    const signature = `${type}:${page}:${code}`
    if (now - (recent.get(signature) || 0) < 5 * 60 * 1000) return
    recent.set(signature, now)
    if (recent.size > 64) {
      const oldest = recent.keys().next().value
      recent.delete(oldest)
    }
    if (pending.length >= MAX_PENDING) pending.shift()
    pending.push({
      type,
      page,
      code: String(code).slice(0, 24),
      metric_ms: Math.round(Math.max(0, Math.min(60000, Number(metricMs) || 0))),
    })
    if (VALID_CRITICAL.has(type) && delayedFlush === null) {
      delayedFlush = window.setTimeout(() => {
        delayedFlush = null
        flush()
      }, 4000)
    }
  }

  const flush = () => {
    if (!pending.length || reports >= MAX_REPORTS_PER_TAB || navigator.onLine === false) return
    const now = Date.now()
    const critical = pending.some((event) => VALID_CRITICAL.has(event.type))
    if (lastSent && now - lastSent < (critical ? CRITICAL_SEND_GAP_MS : MIN_SEND_GAP_MS)) return
    const batch = pending.slice(0, 6)
    const body = JSON.stringify({
      version: 1,
      report_id: randomId(),
      session_id: id,
      sampled,
      ...details,
      events: batch,
    })
    if (body.length > 3800) return
    let queued = false
    try {
      if (typeof navigator.sendBeacon === 'function') {
        queued = navigator.sendBeacon(REPORT_URL, new Blob([body], { type: 'text/plain' }))
      }
    } catch {
      queued = false
    }
    if (!queued) return
    pending.splice(0, batch.length)
    lastSent = now
    reports += 1
  }

  const onError = (event) => {
    if (event instanceof ErrorEvent) {
      const source = String(event.filename || '').split(/[?#]/)[0].split('/').pop() || ''
      const message = String(event.error?.message || event.message || '')
      const type = /chunk|module|script|preload/i.test(message) ? 'script_load_failure' : 'js_error'
      record(type, fingerprint(`${event.error?.name || 'Error'}|${message}|${source}`))
      return
    }
    const element = event.target
    if (element instanceof HTMLScriptElement || (element instanceof HTMLLinkElement && element.rel === 'stylesheet')) {
      record('script_load_failure', fingerprint(`${element.tagName}|${element.getAttribute('src') || element.getAttribute('href') || ''}`))
    }
  }

  window.addEventListener('error', onError, true)
  window.addEventListener('shadow-reader-health-react-error', (event) => {
    const code = String(event.detail?.code || 'UI-UNKNOWN')
    record('js_error', fingerprint(`react:${code}`))
  })
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    record('promise_rejection', fingerprint(`${reason?.name || 'Rejection'}|${reason?.message || typeof reason}`))
  })

  if (sampled) {
    record('session_seen')

    const navigationComplete = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const duration = Number(navigation?.loadEventEnd || performance.now())
      if (duration >= 6000) record('slow_boot', '', duration)
    }
    if (document.readyState === 'complete') navigationComplete()
    else window.addEventListener('load', navigationComplete, { once: true })

    if (typeof PerformanceObserver === 'function') {
      try {
        const observer = new PerformanceObserver((list) => {
          if (document.visibilityState !== 'visible') return
          for (const entry of list.getEntries()) {
            if (entry.duration >= 1500) record('long_task', '', entry.duration)
          }
        })
        observer.observe({ type: 'longtask', buffered: true })
      } catch {}
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!['fetch', 'xmlhttprequest'].includes(entry.initiatorType)) continue
            if (!entry.name.startsWith(`${API_BASE.replace(/\/+$/, '')}/api/`)) continue
            if (entry.duration >= 8000) record('slow_api', '', entry.duration)
          }
        })
        observer.observe({ type: 'resource', buffered: false })
      } catch {}
    }

    window.setInterval(() => {
      const now = performance.now()
      const elapsed = now - lastTimerAt
      lastTimerAt = now
      if (document.visibilityState === 'visible' && now - visibleSince > 7000 && elapsed >= 5000) {
        record('event_loop_delay', '', elapsed)
      }
    }, 1000)
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      visibleSince = performance.now()
      lastTimerAt = visibleSince
    } else {
      visibleSince = Infinity
      flush()
    }
  })
  window.addEventListener('pagehide', flush)
  window.setInterval(flush, 60000)
}

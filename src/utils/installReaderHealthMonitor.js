const API_BASE = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const REPORT_URL = `${API_BASE.replace(/\/+$/, '')}/api/diagnostics/reader-health`
const SAMPLE_RATE = 0.1
const SAMPLE_KEY = 'shadow_reader_health_sample_v1'
const SESSION_KEY = 'shadow_reader_presence_session_id'
const FALLBACK_SESSION_KEY = 'shadow_reader_health_session_v1'
const BUDGET_KEY = 'shadow_reader_health_budget_v2'
const MAX_REPORTS_PER_DAY = 3
const MAX_EVENTS_PER_REPORT = 6
const MAX_PENDING = 8
const MIN_SEND_GAP_MS = 60000
const DEDUP_MS = 30 * 60 * 1000
const CRITICAL = new Set(['js_error', 'promise_rejection', 'script_load_failure'])

function randomId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
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
    const value = Math.random() < SAMPLE_RATE
    sessionStorage.setItem(SAMPLE_KEY, value ? '1' : '0')
    return value
  } catch {
    return Math.random() < SAMPLE_RATE
  }
}

function readBudget() {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const saved = JSON.parse(sessionStorage.getItem(BUDGET_KEY) || 'null')
    if (saved?.day === today) {
      return {
        day: today,
        sent: Math.min(MAX_REPORTS_PER_DAY, Math.max(0, Number(saved.sent) || 0)),
        lastSent: Math.max(0, Number(saved.lastSent) || 0),
        signatures: Object.fromEntries(Object.entries(saved.signatures || {})
          .filter(([, when]) => Number.isFinite(Number(when)) && Date.now() - Number(when) < DEDUP_MS)
          .slice(-24)),
      }
    }
  } catch {}
  return { day: today, sent: 0, lastSent: 0, signatures: {} }
}

function writeBudget(value) {
  try { sessionStorage.setItem(BUDGET_KEY, JSON.stringify(value)) } catch {}
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
  let budget = readBudget()
  let flushTimer = null

  const flush = () => {
    if (flushTimer !== null) {
      clearTimeout(flushTimer)
      flushTimer = null
    }
    if (!pending.length) return
    const now = Date.now()
    const today = new Date(now).toISOString().slice(0, 10)
    if (budget.day !== today) budget = readBudget()
    if (budget.sent >= MAX_REPORTS_PER_DAY ||
        (budget.lastSent && now - budget.lastSent < MIN_SEND_GAP_MS) ||
        navigator.onLine === false) {
      pending.length = 0
      return
    }
    const events = pending.splice(0, MAX_EVENTS_PER_REPORT)
    pending.length = 0
    const body = JSON.stringify({
      version: 1,
      report_id: randomId(),
      session_id: id,
      sampled,
      ...details,
      events,
    })
    if (body.length > 3800 || typeof navigator.sendBeacon !== 'function') return
    try {
      if (!navigator.sendBeacon(REPORT_URL, new Blob([body], { type: 'text/plain' }))) return
      budget.sent += 1
      budget.lastSent = now
      writeBudget(budget)
    } catch {}
  }

  const record = (type, code = '', metricMs = 0) => {
    if (!sampled && !CRITICAL.has(type)) return
    const today = new Date().toISOString().slice(0, 10)
    if (today !== budget.day) budget = readBudget()
    if (budget.sent >= MAX_REPORTS_PER_DAY) return
    const now = Date.now()
    const page = pageGroup()
    const signature = `${type}:${page}:${code}`
    if (now - Number(budget.signatures[signature] || 0) < DEDUP_MS) return
    budget.signatures[signature] = now
    const pairs = Object.entries(budget.signatures).slice(-24)
    budget.signatures = Object.fromEntries(pairs)
    writeBudget(budget)
    if (pending.length >= MAX_PENDING) return
    pending.push({
      type,
      page,
      code: String(code).slice(0, 24),
      metric_ms: Math.round(Math.max(0, Math.min(60000, Number(metricMs) || 0))),
    })
    if (flushTimer === null) {
      flushTimer = window.setTimeout(flush, CRITICAL.has(type) ? 2500 : 6500)
    }
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
    if (element instanceof HTMLScriptElement ||
        (element instanceof HTMLLinkElement && element.rel === 'stylesheet')) {
      record('script_load_failure', fingerprint(`${element.tagName}|${element.getAttribute('src') || element.getAttribute('href') || ''}`))
    }
  }

  window.addEventListener('error', onError, true)
  window.addEventListener('shadow-reader-health-react-error', (event) => {
    record('js_error', fingerprint(`react:${event.detail?.code || 'UI-UNKNOWN'}`))
  })
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    record('promise_rejection', fingerprint(`${reason?.name || 'Rejection'}|${reason?.message || typeof reason}`))
  })

  if (sampled) {
    const checkLoad = () => {
      const nav = performance.getEntriesByType('navigation')[0]
      const duration = Number(nav?.loadEventEnd || performance.now())
      if (duration >= 8000) record('slow_boot', '', duration)
    }
    if (document.readyState === 'complete') checkLoad()
    else window.addEventListener('load', checkLoad, { once: true })

    if (typeof PerformanceObserver === 'function') {
      try {
        const observer = new PerformanceObserver((list) => {
          if (document.visibilityState !== 'visible') return
          for (const entry of list.getEntries()) {
            if (entry.duration >= 2500) record('long_task', '', entry.duration)
          }
        })
        observer.observe({ type: 'longtask', buffered: false })
      } catch {}
      try {
        const observer = new PerformanceObserver((list) => {
          if (document.visibilityState !== 'visible') return
          for (const entry of list.getEntries()) {
            if (entry.duration >= 3500) record('event_loop_delay', '', entry.duration)
          }
        })
        observer.observe({ type: 'long-animation-frame', buffered: false })
      } catch {}
      try {
        const observer = new PerformanceObserver((list) => {
          if (document.visibilityState !== 'visible') return
          for (const entry of list.getEntries()) {
            if (!['fetch', 'xmlhttprequest'].includes(entry.initiatorType)) continue
            if (!entry.name.startsWith(`${API_BASE.replace(/\/+$/, '')}/api/`)) continue
            if (entry.duration >= 10000) record('slow_api', '', entry.duration)
          }
        })
        observer.observe({ type: 'resource', buffered: false })
      } catch {}
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pending.length) flush()
  })
  window.addEventListener('pagehide', () => {
    if (pending.length) flush()
  })
}

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REPORT_URL = `${API_BASE_URL.replace(/\/+$/, '')}/api/diagnostics/images`
const SAMPLE_RATE = 0.2
const SEND_GAP_MS = 5 * 60 * 1000
const MAX_REPORTS_PER_TAB = 12
const MAX_EVENTS_PER_GROUP = 400
const SESSION_KEY = 'shadow_image_diag_v1'
const IMAGE_EXTENSION = /\.(?:png|jpe?g|webp|gif|avif|svg|ico)(?:$|[?#])/i

function sessionState() {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
    if (value && typeof value === 'object') return value
  } catch {}
  return { sampled: Math.random() < SAMPLE_RATE, last_sent_ms: 0, reports: 0 }
}

function storeSession(state) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)) } catch {}
}

function pageGroup() {
  const path = window.location.pathname.toLowerCase()
  if (path === '/' || path === '/home') return 'HOME'
  if (path.startsWith('/manga')) return 'MANGA'
  if (path.includes('/read') || path.includes('/episode')) return 'READ'
  if (path.startsWith('/story')) return 'STORY'
  if (path.startsWith('/author')) return 'AUTHOR'
  if (path.startsWith('/chat')) return 'CHAT'
  if (path.startsWith('/mine')) return 'MINE'
  return 'OTHER'
}

function sourceGroup(rawUrl) {
  try {
    const url = new URL(rawUrl, window.location.href)
    if (!['https:', 'http:'].includes(url.protocol)) return null
    const host = url.hostname.toLowerCase()
    const configuredR2Host = (() => {
      try { return new URL(import.meta.env.VITE_R2_PUBLIC_URL || '').hostname.toLowerCase() } catch { return '' }
    })()
    if (host.endsWith('.r2.dev') || host.endsWith('.r2.cloudflarestorage.com') ||
        (configuredR2Host && host === configuredR2Host)) return 'CLOUDFLARE_R2'
    return url.origin === window.location.origin ? 'SAME_ORIGIN' : 'OTHER_EXTERNAL_UNVERIFIED'
  } catch {
    return null
  }
}

function isImageResource(entry) {
  return entry?.initiatorType === 'img' ||
    (entry?.initiatorType === 'css' && IMAGE_EXTENSION.test(entry.name || ''))
}

export function installImageLoadDiagnostics() {
  if (window.__shadowImageLoadDiagnosticsInstalled) return
  window.__shadowImageLoadDiagnosticsInstalled = true
  if (!navigator.sendBeacon || !window.performance) return

  const state = sessionState()
  storeSession(state)
  if (!state.sampled || state.reports >= MAX_REPORTS_PER_TAB) return

  const groups = new Map()
  let pendingEvents = 0

  const getGroup = (source, page) => {
    const key = `${source}:${page}`
    if (!groups.has(key)) {
      groups.set(key, {
        source, page, timed: 0, unavailable: 0, slow_1500: 0,
        slow_3000: 0, load_errors: 0, sum_ms: 0, max_ms: 0,
      })
    }
    return groups.get(key)
  }

  const observeResource = (entry) => {
    if (!isImageResource(entry)) return
    const source = sourceGroup(entry.name)
    if (!source) return
    const group = getGroup(source, pageGroup())
    if (group.timed + group.unavailable >= MAX_EVENTS_PER_GROUP) return
    const duration = Number(entry.duration)
    if (!Number.isFinite(duration) || duration <= 0) {
      group.unavailable += 1
    } else {
      const ms = Math.round(Math.min(60000, duration))
      group.timed += 1
      group.sum_ms += ms
      group.max_ms = Math.max(group.max_ms, ms)
      if (ms >= 1500) group.slow_1500 += 1
      if (ms >= 3000) group.slow_3000 += 1
    }
    pendingEvents += 1
  }

  const observeImageError = (event) => {
    const image = event.target
    if (image?.tagName !== 'IMG') return
    const source = sourceGroup(image.currentSrc || image.src)
    if (!source) return
    const group = getGroup(source, pageGroup())
    if (group.load_errors >= MAX_EVENTS_PER_GROUP) return
    group.load_errors += 1
    pendingEvents += 1
  }

  const flush = (onPageHide = false) => {
    const now = Date.now()
    if (!navigator.onLine || pendingEvents <= 0 ||
        state.reports >= MAX_REPORTS_PER_TAB ||
        now - state.last_sent_ms < SEND_GAP_MS) return
    const rows = [...groups.values()].filter((g) => g.timed + g.unavailable + g.load_errors > 0)
    if (!rows.length) return
    const hasErrors = rows.some((g) => g.load_errors > 0)
    if (pendingEvents < (onPageHide ? 4 : 8) && !hasErrors) return
    const payload = JSON.stringify({ version: 1, groups: rows.slice(0, 18) })
    if (payload.length > 3800) return
    try {
      if (!navigator.sendBeacon(REPORT_URL, new Blob([payload], { type: 'text/plain' }))) return
      groups.clear()
      pendingEvents = 0
      state.last_sent_ms = now
      state.reports += 1
      storeSession(state)
    } catch {}
  }

  document.addEventListener('error', observeImageError, true)

  if (typeof PerformanceObserver === 'function') {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) observeResource(entry)
      })
      observer.observe({ type: 'resource', buffered: true })
    } catch {
      for (const entry of performance.getEntriesByType('resource')) observeResource(entry)
    }
  } else {
    for (const entry of performance.getEntriesByType('resource')) observeResource(entry)
  }

  window.setInterval(() => flush(false), SEND_GAP_MS)
  window.addEventListener('pagehide', () => flush(true))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })
}

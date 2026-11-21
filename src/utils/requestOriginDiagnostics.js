const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin
const REPORT_URL = `${API_ORIGIN}/api/diagnostics/request-origin`
const SAMPLE_KEY = 'shadow_request_origin_sample_v1'
const SESSION_KEY = 'shadow_request_origin_session_v1'
const BUDGET_KEY = 'shadow_request_origin_budget_v1'
const SAMPLE_RATE = 0.1
const MAX_REPORTS_PER_DAY = 3
const MIN_REPORT_GAP_MS = 60_000
const MAX_TRACKED_KEYS = 120
const MAX_PENDING_EVENTS = 6
const SHORT_WINDOW_MS = 10_000
const LONG_WINDOW_MS = 60_000
const REPORT_DEDUP_MS = 10 * 60_000
const ALLOWED_TRIGGERS = new Set([
  'mount', 'timer', 'focus', 'visibility', 'retry', 'navigation',
  'reload', 'user_action', 'background', 'unknown',
])
const SAFE_SEGMENTS = new Set([
  'api', 'public', 'stories', 'story', 'episodes', 'episode', 'view', 'recommendations',
  'read', 'authors', 'discover', 'posts', 'feed', 'books', 'reader', 'reader-presence',
  'heartbeat', 'reading-progress', 'tasks', 'reading-session', 'progress',
  'comments', 'latest', 'reactions', 'advertisements', 'smart-ads', 'select',
  'content-versions', 'shadow-mall', 'promotions', 'ad-control', 'unlocks',
  'purchase', 'premium', 'status', 'notifications', 'unread-count', 'check-in',
  'offline-control', 'users', 'profile', 'me', 'settings', 'follow', 'following',
  'reader-posts', 'social-statuses', 'boost-engagement', 'genres', 'slides',
  'banners', 'home', 'fast', 'reels', 'search', 'bookmarks', 'saves', 'saved',
  'like', 'likes', 'events', 'health', 'maintenance', 'other',
])

let delegateFetch = null
let sampled = false
let reportTimer = null
let pendingEvents = []
const tracked = new Map()

function randomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()
  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 15) | 64
  bytes[8] = (bytes[8] & 63) | 128
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function sessionId() {
  try {
    const value = window.sessionStorage.getItem(SESSION_KEY)
    if (value && /^[a-f\d-]{36}$/i.test(value)) return value
    const created = randomId()
    window.sessionStorage.setItem(SESSION_KEY, created)
    return created
  } catch {
    return randomId()
  }
}

function isSampled() {
  try {
    const value = window.sessionStorage.getItem(SAMPLE_KEY)
    if (value === '1' || value === '0') return value === '1'
    const result = Math.random() < SAMPLE_RATE
    window.sessionStorage.setItem(SAMPLE_KEY, result ? '1' : '0')
    return result
  } catch {
    return Math.random() < SAMPLE_RATE
  }
}

function dayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readBudget() {
  const day = dayKey()
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(BUDGET_KEY) || 'null')
    if (stored?.day === day) {
      return {
        day,
        sent: Math.min(MAX_REPORTS_PER_DAY, Math.max(0, Number(stored.sent) || 0)),
        last_sent_at: Math.max(0, Number(stored.last_sent_at) || 0),
      }
    }
  } catch {}
  return { day, sent: 0, last_sent_at: 0 }
}

function writeBudget(value) {
  try {
    window.sessionStorage.setItem(BUDGET_KEY, JSON.stringify(value))
  } catch {}
}

function currentPage() {
  const path = window.location.pathname.toLowerCase()
  if (path === '/discover' || path.startsWith('/discover/')) return 'DISCOVER'
  if (/^\/story\/[^/]+\/episode\/[^/]+(?:\/|$)/.test(path)) return 'READER'
  return null
}

function normalizeRoute(path) {
  const parts = String(path || '').toLowerCase().split('/').filter(Boolean).slice(0, 8)
  if (parts[0] !== 'api') return '/api/other'
  return '/' + parts.map((part) => SAFE_SEGMENTS.has(part) ? part : ':id').join('/')
}

function sourceLabel(value) {
  const text = String(value || '')
  if (text.length <= 140 && /^src\/(?:pages|hooks|components|services|providers|utils)\/(?!.*\.\.)[a-zA-Z\d_./-]+\.[cm]?[jt]sx?$/.test(text)) {
    return text
  }
  return 'UNATTRIBUTED'
}

function triggerLabel(value) {
  const text = String(value || '').toLowerCase()
  return ALLOWED_TRIGGERS.has(text) ? text : 'unknown'
}

function takeEvent(event) {
  if (pendingEvents.length >= MAX_PENDING_EVENTS) return
  pendingEvents.push(event)
  if (reportTimer !== null) return
  reportTimer = window.setTimeout(flushEvents, 2500)
}

function flushEvents() {
  if (reportTimer !== null) {
    window.clearTimeout(reportTimer)
    reportTimer = null
  }
  if (!pendingEvents.length || typeof navigator.sendBeacon !== 'function') {
    pendingEvents = []
    return
  }
  const budget = readBudget()
  const now = Date.now()
  if (budget.sent >= MAX_REPORTS_PER_DAY || now - budget.last_sent_at < MIN_REPORT_GAP_MS || navigator.onLine === false) {
    pendingEvents = []
    return
  }
  const payload = {
    version: 1,
    report_id: randomId(),
    session_id: sessionId(),
    sampled: true,
    sample_rate: SAMPLE_RATE,
    build: String(import.meta.env.VITE_GIT_SHA || import.meta.env.VITE_APP_VERSION || 'unknown').replace(/[^a-zA-Z\d_.-]/g, '').slice(0,32),
    events: pendingEvents.splice(0, MAX_PENDING_EVENTS),
  }
  const body = JSON.stringify(payload)
  pendingEvents = []
  if (body.length > 3600) return
  try {
    if (navigator.sendBeacon(REPORT_URL, new Blob([body], { type: 'text/plain' }))) {
      budget.sent += 1
      budget.last_sent_at = now
      writeBudget(budget)
    }
  } catch {}
}

function pruneTracked(now) {
  for (const [key, entry] of tracked) {
    if (now - entry.last_seen_at > REPORT_DEDUP_MS) tracked.delete(key)
  }
  while (tracked.size > MAX_TRACKED_KEYS) {
    tracked.delete(tracked.keys().next().value)
  }
}

function reportAttempt(input, init, meta) {
  const page = currentPage()
  if (!page) return null
  let url
  try {
    url = new URL(input instanceof Request ? input.url : String(input), window.location.origin)
  } catch {
    return null
  }
  if (url.origin !== API_ORIGIN || !url.pathname.startsWith('/api/') || url.pathname === '/api/diagnostics/request-origin') return null
  const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return null
  const source = sourceLabel(meta?.source_file)
  const trigger = triggerLabel(meta?.trigger)
  const key = `${page}|${method}|${url.pathname}|${url.search}|${source}|${trigger}`
  const now = Date.now()
  const old = tracked.get(key)
  const entry = old || {
    short_start: now,
    short_count: 0,
    minute_start: now,
    minute_count: 0,
    error_count: 0,
    hidden_count: 0,
    last_reported_at: 0,
    last_seen_at: now,
  }
  if (now - entry.short_start >= SHORT_WINDOW_MS) {
    entry.short_start = now
    entry.short_count = 0
  }
  if (now - entry.minute_start >= LONG_WINDOW_MS) {
    entry.minute_start = now
    entry.minute_count = 0
    entry.error_count = 0
    entry.hidden_count = 0
  }
  entry.short_count += 1
  entry.minute_count += 1
  entry.last_seen_at = now
  if (document.visibilityState === 'hidden') entry.hidden_count += 1
  tracked.delete(key)
  tracked.set(key, entry)
  pruneTracked(now)
  if ((entry.short_count >= 4 || entry.minute_count >= 12) && now - entry.last_reported_at >= REPORT_DEDUP_MS) {
    entry.last_reported_at = now
    const observedCount = Math.min(120, entry.short_count >= 4 ? entry.short_count : entry.minute_count)
    takeEvent({
      page,
      route: normalizeRoute(url.pathname),
      method,
      source_file: source,
      trigger,
      observed_count: observedCount,
      window_ms: entry.short_count >= 4 ? SHORT_WINDOW_MS : LONG_WINDOW_MS,
      hidden_count: Math.min(observedCount, entry.hidden_count),
      error_count: Math.min(observedCount, entry.error_count),
      observed_at: new Date(now).toISOString(),
    })
  }
  return entry
}

function perform(input, init, meta) {
  const entry = reportAttempt(input, init, meta)
  const fetcher = delegateFetch || window.fetch.bind(window)
  const promise = fetcher(input, init)
  if (entry) {
    Promise.resolve(promise).then(
      (response) => {
        if (response?.status >= 400) entry.error_count = Math.min(120, entry.error_count + 1)
      },
      () => {
        entry.error_count = Math.min(120, entry.error_count + 1)
      },
    )
  }
  return promise
}

export function traceRequestOrigin(meta, input, init) {
  if (!delegateFetch) return window.fetch(input, init)
  return perform(input, init, meta)
}

export function installRequestOriginDiagnostics() {
  if (window.__shadowRequestOriginDiagnosticsInstalled) return
  window.__shadowRequestOriginDiagnosticsInstalled = true
  sampled = isSampled()
  if (!sampled) return
  delegateFetch = window.fetch.bind(window)
  window.fetch = (input, init) => perform(input, init, null)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pendingEvents.length) flushEvents()
  })
  window.addEventListener('pagehide', () => {
    if (pendingEvents.length) flushEvents()
  })
}

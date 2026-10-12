const API = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const CACHE_PREFIX = 'shadow_reader_offline_control_v1:'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const POLL_INTERVAL_MS = 2 * 60 * 1000
const MIN_REQUEST_GAP_MS = 45 * 1000

let activeKey = ''
let control = { globalPaused: false, pauseUntil: null, mode: 'inherit' }
let lastRequestedAt = 0
let requestInFlight = null
let initialized = false
let pauseTimer = null

function policyForcesOnline(value) {
  const until = Date.parse(value.pauseUntil || '')
  const globalActive = value.globalPaused && (!Number.isFinite(until) || until > Date.now())
  return Boolean(globalActive || value.mode === 'force_online')
}

function readerToken() {
  try {
    return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

function readerIdentity() {
  const token = readerToken()
  if (!token) return null
  try {
    const chunk = token.split('.')[1]
    if (!chunk) return null
    const normalized = chunk.replace(/-/g, '+').replace(/_/g, '/')
    const data = JSON.parse(atob(normalized))
    if (!data.user_id || !data.device_id) return null
    return {
      token,
      key: `${CACHE_PREFIX}${String(data.user_id)}:${String(data.device_id)}`,
    }
  } catch {
    return null
  }
}

function notifyWorker() {
  const worker = navigator.serviceWorker?.controller
  if (!worker) return
  try {
    worker.postMessage({
      type: 'SHADOW_READER_OFFLINE_CONTROL',
      force_online: policyForcesOnline(control),
    })
  } catch {}
}

function updateControl(next) {
  const changed = policyForcesOnline(control) !== policyForcesOnline(next) ||
    control.globalPaused !== next.globalPaused || control.mode !== next.mode ||
    control.pauseUntil !== next.pauseUntil
  control = next
  if (pauseTimer) clearTimeout(pauseTimer)
  pauseTimer = null
  const expires = Date.parse(next.pauseUntil || '')
  if (next.globalPaused && Number.isFinite(expires) && expires > Date.now()) {
    pauseTimer = setTimeout(() => {
      notifyWorker()
      window.dispatchEvent(new Event('shadow-offline-control-change'))
    }, expires - Date.now() + 50)
  }
  notifyWorker()
  if (changed) window.dispatchEvent(new Event('shadow-offline-control-change'))
}

function ensureIdentity() {
  const identity = readerIdentity()
  const nextKey = identity?.key || ''
  if (nextKey === activeKey) return identity
  activeKey = nextKey
  lastRequestedAt = 0
  let saved = null
  if (nextKey) {
    try {
      saved = JSON.parse(localStorage.getItem(nextKey) || 'null')
    } catch {}
  }
  const valid = saved && Date.now() - Number(saved.savedAt || 0) < CACHE_TTL_MS
  updateControl(valid && saved.control ? saved.control : {
    globalPaused: false,
    pauseUntil: null,
    mode: 'inherit',
  })
  return identity
}

export function isReaderForceOnline() {
  ensureIdentity()
  return policyForcesOnline(control)
}

export function isReaderOffline() {
  return navigator.onLine === false && !isReaderForceOnline()
}

export async function refreshReaderOfflineControl({ force = false } = {}) {
  const identity = ensureIdentity()
  if (!identity) return null
  if (requestInFlight) return requestInFlight
  if (!force && Date.now() - lastRequestedAt < MIN_REQUEST_GAP_MS) return control
  lastRequestedAt = Date.now()
  const requestedKey = identity.key
  const requestedToken = identity.token
  requestInFlight = (async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 9000)
    try {
      const response = await fetch(`${API}/api/reader/offline-control`, {
        headers: { Authorization: `Bearer ${requestedToken}` },
        cache: 'no-store',
        signal: controller.signal,
      })
      if (!response.ok) return null
      const data = await response.json()
      if (data.ok !== true || !data.control) return null
      if (readerIdentity()?.key !== requestedKey) return null
      const next = {
        globalPaused: data.control.global_paused === true,
        pauseUntil: data.control.pause_until || null,
        mode: String(data.control.mode || 'inherit'),
      }
      try {
        localStorage.setItem(requestedKey, JSON.stringify({
          savedAt: Date.now(),
          control: next,
        }))
      } catch {}
      updateControl(next)
      return next
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  })()
  try {
    return await requestInFlight
  } finally {
    requestInFlight = null
  }
}

export function initializeReaderOfflineControl() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  ensureIdentity()
  void refreshReaderOfflineControl({ force: true })
  window.addEventListener('online', () => {
    void refreshReaderOfflineControl({ force: true })
  })
  window.addEventListener('focus', () => {
    void refreshReaderOfflineControl()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void refreshReaderOfflineControl()
  })
  window.addEventListener('storage', (event) => {
    if (event.key === 'shadow_reader_token' || event.key?.startsWith(CACHE_PREFIX)) {
      activeKey = ''
      ensureIdentity()
      void refreshReaderOfflineControl({ force: true })
    }
  })
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', notifyWorker)
    navigator.serviceWorker.ready.then(notifyWorker).catch(() => {})
  }
  window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void refreshReaderOfflineControl()
    }
  }, POLL_INTERVAL_MS)
}

initializeReaderOfflineControl()

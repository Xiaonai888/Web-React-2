const API = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const CACHE_PREFIX = 'shadow_reader_offline_control_v1:'
const SYNC_PREFIX = 'shadow_reader_offline_sync_v1:'
const LEASE_PREFIX = 'shadow_reader_offline_lease_v1:'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const POLL_INTERVAL_MS = 2 * 60 * 1000
const MIN_REQUEST_GAP_MS = 60 * 1000
const LEASE_MS = 12 * 1000
const RETRY_DELAY_MS = 60 * 1000
const MAX_RETRY_DELAY_MS = 10 * 60 * 1000
const tabId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`

let activeKey = ''
let control = { globalPaused: false, pauseUntil: null, mode: 'inherit' }
let cacheSavedAt = 0
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

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function readCachedControl(key) {
  if (!key) return null
  const stored = readStorage(key)
  const savedAt = Number(stored?.savedAt || 0)
  if (!stored?.control || !Number.isFinite(savedAt) || savedAt <= 0) return null
  if (Date.now() - savedAt < 0 || Date.now() - savedAt >= CACHE_TTL_MS) return null
  const value = stored.control
  if (typeof value !== 'object' || !['inherit', 'force_online', 'auto_offline'].includes(value.mode)) return null
  return { savedAt, control: value }
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
    }, Math.min(expires - Date.now() + 50, 2147483647))
  }
  notifyWorker()
  if (changed) window.dispatchEvent(new Event('shadow-offline-control-change'))
}

function applyCachedControl(key) {
  const saved = readCachedControl(key)
  if (!saved || saved.savedAt < cacheSavedAt) return false
  cacheSavedAt = saved.savedAt
  updateControl(saved.control)
  return true
}

function ensureIdentity() {
  const identity = readerIdentity()
  const nextKey = identity?.key || ''
  if (nextKey === activeKey) return identity
  activeKey = nextKey
  cacheSavedAt = 0
  lastRequestedAt = 0
  if (!applyCachedControl(nextKey)) {
    updateControl({ globalPaused: false, pauseUntil: null, mode: 'inherit' })
  }
  return identity
}

function syncKey(key) {
  return `${SYNC_PREFIX}${key.slice(CACHE_PREFIX.length)}`
}

function leaseKey(key) {
  return `${LEASE_PREFIX}${key.slice(CACHE_PREFIX.length)}`
}

function readSharedSync(key) {
  const state = readStorage(syncKey(key))
  return {
    requestedAt: Number(state?.requestedAt || 0),
    retryUntil: Number(state?.retryUntil || 0),
  }
}

function claimLease(key) {
  const storageKey = leaseKey(key)
  const now = Date.now()
  const current = readStorage(storageKey)
  if (Number(current?.until || 0) > now && current?.owner !== tabId) return false
  if (!writeStorage(storageKey, { owner: tabId, until: now + LEASE_MS })) return true
  return readStorage(storageKey)?.owner === tabId
}

function releaseLease(key) {
  const storageKey = leaseKey(key)
  try {
    if (readStorage(storageKey)?.owner === tabId) localStorage.removeItem(storageKey)
  } catch {}
}

function markRequest(key, retryUntil = 0) {
  const now = Date.now()
  writeStorage(syncKey(key), { requestedAt: now, retryUntil })
  if (key === activeKey) lastRequestedAt = now
}

function retryAfterMilliseconds(response) {
  const raw = String(response.headers.get('Retry-After') || '').trim()
  const seconds = Number(raw)
  const parsed = Number.isFinite(seconds) && raw
    ? seconds * 1000
    : Date.parse(raw) - Date.now()
  if (!Number.isFinite(parsed) || parsed <= 0) return RETRY_DELAY_MS
  return Math.min(MAX_RETRY_DELAY_MS, Math.max(RETRY_DELAY_MS, parsed))
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
  const key = identity.key
  if (requestInFlight?.key === key) return requestInFlight.promise
  applyCachedControl(key)
  const now = Date.now()
  if (navigator.onLine === false) return control
  if (!force && cacheSavedAt > 0 && now - cacheSavedAt < POLL_INTERVAL_MS) return control
  if (now - lastRequestedAt < MIN_REQUEST_GAP_MS) return control
  const shared = readSharedSync(key)
  if (shared.retryUntil > now || now - shared.requestedAt < MIN_REQUEST_GAP_MS) return control
  if (!claimLease(key)) return control
  markRequest(key)

  const requestedToken = identity.token
  const promise = (async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 9000)
    try {
      const response = await fetch(`${API}/api/reader/offline-control`, {
        headers: { Authorization: `Bearer ${requestedToken}` },
        cache: 'no-store',
        signal: controller.signal,
      })
      if (response.status === 429) {
        markRequest(key, Date.now() + retryAfterMilliseconds(response))
        return null
      }
      if (!response.ok) {
        if (response.status >= 500) markRequest(key, Date.now() + RETRY_DELAY_MS)
        return null
      }
      const data = await response.json()
      if (data.ok !== true || !data.control) return null
      const current = readerIdentity()
      if (current?.key !== key || current.token !== requestedToken) return null
      const next = {
        globalPaused: data.control.global_paused === true,
        pauseUntil: data.control.pause_until || null,
        mode: String(data.control.mode || 'inherit'),
      }
      if (!['inherit', 'force_online', 'auto_offline'].includes(next.mode)) return null
      const newer = readCachedControl(key)
      if (newer && newer.savedAt > lastRequestedAt) {
        applyCachedControl(key)
        return control
      }
      const savedAt = Date.now()
      writeStorage(key, { savedAt, control: next })
      cacheSavedAt = savedAt
      updateControl(next)
      return next
    } catch {
      markRequest(key, Date.now() + RETRY_DELAY_MS)
      return null
    } finally {
      clearTimeout(timer)
      releaseLease(key)
    }
  })()

  const currentRequest = { key, promise }
  requestInFlight = currentRequest
  try {
    return await promise
  } finally {
    if (requestInFlight === currentRequest) requestInFlight = null
  }
}

export function initializeReaderOfflineControl() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  ensureIdentity()
  void refreshReaderOfflineControl()
  window.addEventListener('online', () => {
    notifyWorker()
    void refreshReaderOfflineControl({ force: true })
  })
  window.addEventListener('focus', () => {
    notifyWorker()
    void refreshReaderOfflineControl()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      notifyWorker()
      void refreshReaderOfflineControl()
    }
  })
  window.addEventListener('storage', (event) => {
    if (event.key === 'shadow_reader_token') {
      ensureIdentity()
      void refreshReaderOfflineControl()
    } else if (event.key && event.key === activeKey) {
      applyCachedControl(activeKey)
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

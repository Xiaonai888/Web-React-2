const API_BASE_URL = (
  import.meta.env?.VITE_API_URL ||
  (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
).replace(/\/$/, '')

const VERSION_CACHE_MS = 20_000
const PLACEMENTS = new Set(['discover', 'opening', 'freeUnlock', 'me'])
const VISITOR_KEY = 'shadow_smart_ad_visitor_v1'
const versionListeners = new Set()
let versionCache = null
let versionExpiresAt = 0
let versionRequest = null
let fallbackVisitorId = ''

function browserStorage() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null } catch { return null }
}

export function getSmartAdAuthToken() {
  try {
    return localStorage.getItem('shadow_reader_token') ||
      sessionStorage.getItem('shadow_reader_token') || ''
  } catch { return '' }
}

function generateVisitorId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `smart-${crypto.randomUUID()}`
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return `smart-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
  }
  throw new Error('Secure browser randomness is unavailable')
}

export function getSmartAdVisitorId() {
  const storage = browserStorage()
  let previous = ''
  try { previous = storage?.getItem(VISITOR_KEY) || '' } catch {}
  if (/^[a-zA-Z0-9._:-]{8,128}$/.test(previous)) return previous
  if (fallbackVisitorId) return fallbackVisitorId
  const next = generateVisitorId()
  fallbackVisitorId = next
  try { storage?.setItem(VISITOR_KEY, next) } catch {}
  return next
}

export function getSmartAdReaderKey() {
  const token = getSmartAdAuthToken()
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload?.type === 'reader' && payload.user_id) return `reader:${String(payload.user_id)}`
    } catch {}
    return 'reader:pending'
  }
  return `visitor:${getSmartAdVisitorId()}`
}

function validatePlacement(placement) {
  if (!PLACEMENTS.has(placement)) throw new TypeError('Invalid Smart Ad placement')
  return placement
}

async function requestSmartAd(path, { body, signal, keepalive = false } = {}) {
  const token = getSmartAdAuthToken()
  const headers = { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }
  if (token) headers.Authorization = `Bearer ${token}`
  else headers['X-Shadow-Visitor-Id'] = getSmartAdVisitorId()
  const response = await fetch(`${API_BASE_URL}/api/smart-ads${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
    credentials: 'omit',
    keepalive,
    signal,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data || data.ok !== true) {
    const error = new Error(data?.message || 'Smart Ad API unavailable')
    error.status = response.status
    throw error
  }
  return data
}

export async function getSmartAdVersion({ force = false, signal } = {}) {
  if (!force && versionCache && versionExpiresAt > Date.now()) return versionCache
  if (versionRequest) return versionRequest
  const pending = requestSmartAd('/version', { signal }).then((next) => {
    const previous = versionCache
    versionCache = next
    versionExpiresAt = Date.now() + VERSION_CACHE_MS
    if (previous && (previous.catalog_version !== next.catalog_version || previous.slot_key !== next.slot_key)) {
      for (const listener of versionListeners) {
        try { listener(next, previous) } catch (error) { console.error('SMART_AD_VERSION_LISTENER:', error) }
      }
    }
    return next
  }).finally(() => { if (versionRequest === pending) versionRequest = null })
  versionRequest = pending
  return pending
}

export function subscribeSmartAdVersion(listener) {
  if (typeof listener !== 'function') return () => {}
  versionListeners.add(listener)
  return () => versionListeners.delete(listener)
}

export function watchSmartAdVersion(onChange, { intervalMs = 60_000 } = {}) {
  const unsubscribe = subscribeSmartAdVersion(onChange)
  if (typeof window === 'undefined' || typeof document === 'undefined') return unsubscribe
  const poll = () => {
    if (!document.hidden) void getSmartAdVersion({ force: true }).catch(() => {})
  }
  document.addEventListener('visibilitychange', poll)
  window.addEventListener('focus', poll)
  const intervalId = window.setInterval(poll, Math.max(30_000, Number(intervalMs) || 60_000))
  poll()
  return () => {
    unsubscribe()
    document.removeEventListener('visibilitychange', poll)
    window.removeEventListener('focus', poll)
    window.clearInterval(intervalId)
  }
}

export async function selectSmartAds({
  placement, cursor = '0', queueIndex = 0, interests = {}, excludeStoryIds = [], cooldownStoryIds = [], signal,
} = {}) {
  validatePlacement(placement)
  return requestSmartAd('/select', {
    body: {
      placement,
      cursor: String(cursor),
      queue_index: queueIndex,
      interests,
      exclude_story_ids: excludeStoryIds,
      cooldown_story_ids: cooldownStoryIds,
    },
    signal,
  })
}

export async function recordSmartAdImpressions({ placement, slotKey, storyIds, signal } = {}) {
  validatePlacement(placement)
  const ids = [...new Set((storyIds || []).filter(Boolean).map(String))]
  if (!ids.length || ids.length > 10) throw new RangeError('Expected 1–10 Smart Ad story IDs')
  return requestSmartAd('/impressions', {
    body: { placement, slot_key: slotKey, story_ids: ids }, signal, keepalive: true,
  })
}

export async function openSmartAdEpisodeOne({ placement, slotKey, storyId, signal } = {}) {
  validatePlacement(placement)
  if (!storyId) throw new TypeError('Story ID is required')
  return requestSmartAd('/open', {
    body: { placement, slot_key: slotKey, story_id: String(storyId) }, signal,
  })
}

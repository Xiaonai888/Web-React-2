import { getStoryLanguageId } from '../utils/storyLanguage'
import { getSmartAdAuthToken, getSmartAdReaderKey, getSmartAdVisitorId } from './smartAdClient'

const API_URL = (import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com').replace(/\/$/, '')
const PLACEMENTS = new Set(['stories', 'manga', 'discover'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const LANGUAGES = new Set(['km', 'en', 'zh', 'ja', 'ko'])

function placementOf(value) {
  const placement = String(value || '')
  if (!PLACEMENTS.has(placement)) throw new TypeError('Invalid PDF promotion placement')
  return placement
}

function idsOf(values, max) {
  if (!Array.isArray(values) || values.length > max) throw new RangeError('Invalid PDF product list')
  const ids = [...new Set(values.map((value) => String(value || '').trim().toLowerCase()))]
  if (ids.some((id) => !UUID.test(id))) throw new TypeError('Invalid PDF product ID')
  return ids
}

function scopeOf() {
  const token = getSmartAdAuthToken()
  const readerKey = getSmartAdReaderKey()
  if (token && readerKey === 'reader:pending') {
    throw new Error('Valid reader session required for personalized PDF recommendations')
  }
  return { token, readerKey, visitorId: token ? '' : getSmartAdVisitorId() }
}

async function request(path, { body, signal, keepalive = false } = {}) {
  const scope = scopeOf()
  const headers = {
    Accept: 'application/json',
    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    ...(scope.token ? { Authorization: `Bearer ${scope.token}` } : { 'X-Shadow-Visitor-Id': scope.visitorId }),
  }
  const response = await fetch(`${API_URL}/api/smart-pdf${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
    credentials: 'omit',
    signal,
    keepalive,
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.ok !== true) {
    const error = new Error(result?.message || 'Smart PDF Promotion is unavailable')
    error.status = response.status
    throw error
  }
  if (scope.readerKey !== getSmartAdReaderKey() || scope.token !== getSmartAdAuthToken()) {
    throw new Error('Reader account changed during PDF recommendation request')
  }
  return result
}

function validateWindow(data) {
  const start = Date.parse(String(data?.slot_start_at || ''))
  const end = Date.parse(String(data?.expires_at || ''))
  const key = String(data?.rotation_key || '')
  if (!/^\d{9,12}$/.test(key) || !Number.isFinite(start) || !Number.isFinite(end) ||
      end - start !== 6 * 3600000 || end <= Date.now() || key !== String(Math.floor(start / 1000))) {
    throw new Error('Invalid PDF promotion window')
  }
  return { start, end, key }
}

export function getSmartPdfPromotionReaderKey() {
  return scopeOf().readerKey
}

export async function fetchSmartPdfPromotionVersion({ signal } = {}) {
  const data = await request('/version', { signal })
  validateWindow(data)
  return data
}

export async function fetchSmartPdfPromotion({ placement, interests = {}, excludeProductIds = [], signal } = {}) {
  const selectedPlacement = placementOf(placement)
  const language = getStoryLanguageId()
  if (!LANGUAGES.has(language)) throw new TypeError('Invalid PDF Story Language')
  if (!interests || typeof interests !== 'object' || Array.isArray(interests) || Object.keys(interests).length > 24) {
    throw new TypeError('Invalid PDF interests')
  }
  const excludes = idsOf(excludeProductIds, 90)
  const data = await request('/select', {
    body: { placement: selectedPlacement, story_language: language, interests, exclude_product_ids: excludes },
    signal,
  })
  validateWindow(data)
  if (getStoryLanguageId() !== language || data.language !== language || data.placement !== selectedPlacement) {
    throw new Error('PDF promotion scope changed during request')
  }
  if (!Array.isArray(data.promotions) || data.promotions.length > 3) {
    throw new Error('Invalid PDF promotion selection')
  }
  const seen = new Set()
  for (const item of data.promotions) {
    const id = String(item?.product_id || '').toLowerCase()
    if (!UUID.test(id) || seen.has(id) || item.product_type !== 'pdf' || item.story_language !== language ||
      Number(item.promotion_price_usd) <= 0 || item.expires_at !== data.expires_at) {
      throw new Error('Invalid PDF promotion item')
    }
    seen.add(id)
  }
  return data
}

export async function recordSmartPdfPromotionEvents({ placement, rotationKey, eventType, productIds, signal } = {}) {
  const selectedPlacement = placementOf(placement)
  if (eventType !== 'impression' && eventType !== 'click') throw new TypeError('Invalid PDF event type')
  const ids = idsOf(productIds, 10)
  if (!ids.length || !/^\d{9,12}$/.test(String(rotationKey || ''))) {
    throw new TypeError('Invalid PDF promotion event')
  }
  return request('/events', {
    body: { placement: selectedPlacement, rotation_key: String(rotationKey), event_type: eventType, product_ids: ids },
    signal,
    keepalive: true,
  })
}

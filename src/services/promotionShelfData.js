import { getStoryLanguageId } from '../utils/storyLanguage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const CONFIG = {
  story: {
    endpoint: '/api/public/discover-special-promotion/active',
    storageKey: 'shadow_discover_special_promotion_rotation_v2',
  },
  store: {
    endpoint: '/api/public/discover-author-store-promotion/active',
    storageKey: 'shadow_discover_author_store_rotation_v1',
  },
}

const VALID_LANGUAGES = new Set(['km', 'en', 'zh', 'ja', 'ko'])
const memory = new Map()
const pending = new Map()
const retryAfter = new Map()
const RETRY_MS = 30000

function scopedKey(kind, language) {
  return `${kind}:${language}`
}

function storageKey(kind, language) {
  return `${CONFIG[kind].storageKey}:language_v2:${language}`
}

function normalize(kind, data, language) {
  if (!CONFIG[kind] || !VALID_LANGUAGES.has(language) || !data || data.ok === false) return null
  if (kind === 'store' && language !== 'km') return null
  if (String(data.language || '').trim().toLowerCase() !== language) return null
  const expiresAt = new Date(data.expires_at || 0).getTime()
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null
  const source = Array.isArray(data.promotions)
    ? data.promotions
    : kind === 'story' && data.promotion
      ? [data.promotion]
      : []
  const seen = new Set()
  const offers = source.filter((item) => {
    const id = String((kind === 'story' ? item?.story_id : item?.product_id) || '').trim()
    if (!id || seen.has(id) || !String(item?.cover_url || '').trim()) return false
    if (String(item?.story_language || '').trim().toLowerCase() !== language) return false
    if (kind === 'story') {
      if (!String(item?.story_title || '').trim()) return false
      if (!Number.isInteger(Number(item?.locked_episode_count)) || Number(item.locked_episode_count) < 5) return false
      if (!Number.isSafeInteger(Number(item?.discounted_price_diamonds)) || Number(item.discounted_price_diamonds) < 1) return false
    } else {
      if (String(item?.product_type || '').toLowerCase() !== 'pdf') return false
      if (!String(item?.title || '').trim()) return false
      if (!String(item?.author_page_id || '').trim() || !String(item?.page_username || '').trim()) return false
      if (!Number.isFinite(Number(item?.promotion_price_usd)) || Number(item.promotion_price_usd) <= 0) return false
    }
    seen.add(id)
    return true
  }).slice(0, 3)
  if (source.length !== offers.length) return null
  return {
    promotions: offers,
    rotationKey: String(data.rotation_key || data.slot_start_at || data.expires_at),
    expiresAt,
    expires_at: new Date(expiresAt).toISOString(),
    language,
  }
}

export function getPromotionShelfCache(kind, language = getStoryLanguageId()) {
  if (!CONFIG[kind] || !VALID_LANGUAGES.has(language) || (kind === 'store' && language !== 'km')) return null
  const key = scopedKey(kind, language)
  const current = memory.get(key)
  if (current?.expiresAt > Date.now()) return current
  memory.delete(key)
  try {
    const serialized = localStorage.getItem(storageKey(kind, language))
    if (!serialized) return null
    const cached = normalize(kind, JSON.parse(serialized), language)
    if (!cached) {
      localStorage.removeItem(storageKey(kind, language))
      return null
    }
    memory.set(key, cached)
    return cached
  } catch {
    return null
  }
}

export async function loadPromotionShelf(kind, { force = false, language = getStoryLanguageId() } = {}) {
  const config = CONFIG[kind]
  if (!config || !VALID_LANGUAGES.has(language) || (kind === 'store' && language !== 'km')) return null
  const key = scopedKey(kind, language)
  const cached = getPromotionShelfCache(kind, language)
  if (!force && cached) return cached
  if (pending.has(key)) return pending.get(key)
  if (Date.now() < (retryAfter.get(key) || 0)) return cached

  const request = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${config.endpoint}?language=${encodeURIComponent(language)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (!response.ok) throw new Error('Promotion unavailable')
      const rotation = normalize(kind, await response.json(), language)
      if (!rotation) throw new Error('Invalid promotion rotation')
      memory.set(key, rotation)
      retryAfter.delete(key)
      try {
        localStorage.setItem(storageKey(kind, language), JSON.stringify({
          ok: true,
          language,
          promotions: rotation.promotions,
          rotation_key: rotation.rotationKey,
          expires_at: rotation.expires_at,
        }))
      } catch {}
      return rotation
    } catch {
      retryAfter.set(key, Date.now() + RETRY_MS)
      return getPromotionShelfCache(kind, language)
    }
  })()
  pending.set(key, request)
  try {
    return await request
  } finally {
    if (pending.get(key) === request) pending.delete(key)
  }
}

import { getStoryLanguageId } from '../utils/storyLanguage'
import { getSmartAdAuthToken, getSmartAdReaderKey, getSmartAdVisitorId } from './smartAdClient'
import { getSmartFreeUnlockInterests } from './advertisements/smartFreeUnlockPresentation'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com').replace(/\/$/, '')
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const LANGUAGES = new Set(['km', 'en', 'zh', 'ko', 'ja'])
const PREFIX = 'shadow_smart_special_promotion_v2'
const RETRY_MS = 30000
const memory = new Map()
const pending = new Map()
const retryAfter = new Map()

function scope(language, placement = 'stories') {
  return `${PREFIX}:${getSmartAdReaderKey()}:${language}:${placement}`
}

function validOffer(item, language, expiresAt) {
  const id = String(item?.story_id || '').toLowerCase()
  const firstId = String(item?.first_episode_id || '').toLowerCase()
  const remaining = Number(item?.locked_episode_count)
  const total = Number(item?.total_locked_episode_count ?? item?.locked_episode_count)
  const original = Number(item?.original_price_diamonds)
  const price = Number(item?.discounted_price_diamonds)
  const offerExpiry = Date.parse(String(item?.expires_at || ''))
  return Boolean(
    UUID.test(id) && UUID.test(firstId) &&
    item?.promotion_eligible === true && item?.story_language === language &&
    String(item?.story_title || '').trim() &&
    /^(https?:\/\/|\/(?!\/))/i.test(String(item?.cover_url || '')) &&
    typeof item?.offer_token === 'string' && item.offer_token.startsWith('sp1.') &&
    Number.isSafeInteger(remaining) && remaining > 0 &&
    Number.isSafeInteger(total) && total >= 5 && remaining <= total &&
    Number.isSafeInteger(original) && original >= remaining * 2 &&
    Number.isSafeInteger(price) && price === Math.ceil(original / 2) &&
    Number(item?.discount_percent) === 50 &&
    offerExpiry === expiresAt
  )
}

function normalize(data, language) {
  if (data?.ok !== true || data?.personalized !== true ||
      data?.story_language !== language || data?.language !== language) return null
  const expiresAt = Date.parse(String(data.expires_at || ''))
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null
  const values = data.promotions
  if (!Array.isArray(values) || values.length > 3 || !values.every((value) => validOffer(value, language, expiresAt))) return null
  const ids = values.map((value) => String(value.story_id).toLowerCase())
  if (new Set(ids).size !== ids.length) return null
  const slotKey = String(data.slot_key || '')
  if (!/^\d{4}-\d{2}-\d{2}T(?:00|06|12|18):00$/.test(slotKey)) return null
  return {
    personalized: true,
    language,
    story_language: language,
    slot_key: slotKey,
    rotationKey: String(data.rotation_key || slotKey),
    expiresAt,
    expires_at: new Date(expiresAt).toISOString(),
    promotions: values,
    promotion: values[0] || null,
  }
}

function readCache(key, language) {
  const stored = memory.get(key)
  if (stored?.expiresAt > Date.now()) return stored
  memory.delete(key)
  try {
    const parsed = normalize(JSON.parse(sessionStorage.getItem(key) || 'null'), language)
    if (parsed) {
      memory.set(key, parsed)
      return parsed
    }
    sessionStorage.removeItem(key)
  } catch {}
  return null
}

export function getSmartPromotionCache(language = getStoryLanguageId(), placement = 'stories') {
  if (!LANGUAGES.has(language)) return null
  return readCache(scope(language, placement), language)
}

export function clearSmartPromotionCache(language = getStoryLanguageId()) {
  if (!LANGUAGES.has(language)) return
  for (const placement of ['stories', 'discover']) {
    const key = scope(language, placement)
    memory.delete(key)
    retryAfter.delete(key)
    try { sessionStorage.removeItem(key) } catch {}
  }
}
export async function loadSmartPromotionShelf({ force = false, language = getStoryLanguageId(), signal, placement = 'stories' } = {}) {
  if (!LANGUAGES.has(language) || !['stories', 'discover'].includes(placement)) return null
  const key = scope(language, placement)
  const cached = getSmartPromotionCache(language, placement)
  if (!force && cached) return cached
  if (pending.has(key)) return pending.get(key)
  if (!force && Date.now() < (retryAfter.get(key) || 0)) return cached
  const token = getSmartAdAuthToken()
  const request = (async () => {
      try {
      const homeRotation = placement === 'discover'
        ? await loadSmartPromotionShelf({ force, language, signal, placement: 'stories' })
        : null
      const excludedIds = (homeRotation?.promotions || []).map((offer) => String(offer.story_id))

      const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`
      else headers['X-Shadow-Visitor-Id'] = getSmartAdVisitorId()
      const response = await fetch(`${API_BASE_URL}/api/smart-promotions/active`, {
        method: 'POST',
        cache: 'no-store',
        credentials: 'omit',
        headers,
                body: JSON.stringify({
          story_language: language,
          interests: getSmartFreeUnlockInterests(),
          exclude_story_ids: excludedIds,
        }),
        signal,
      })
      if (!response.ok) throw new Error(`Smart Promotion API returned ${response.status}`)
      let result = normalize(await response.json(), language)
      if (!result) throw new Error('Invalid Smart Promotion response')

      if (placement === 'discover' && homeRotation?.slot_key === result.slot_key) {
        const combined = [...result.promotions]
        const seen = new Set(combined.map((offer) => String(offer.story_id).toLowerCase()))

        for (const offer of homeRotation.promotions || []) {
          if (combined.length >= 3) break
          const id = String(offer.story_id).toLowerCase()
          if (seen.has(id)) continue
          if (Date.parse(String(offer.expires_at || '')) !== result.expiresAt) continue
          combined.push(offer)
          seen.add(id)
        }

        result = {
          ...result,
          promotions: combined,
          promotion: combined[0] || null,
        }
      }
      if (scope(language, placement) !== key || getStoryLanguageId() !== language) {
        const error = new Error('Special Promotion reader or language changed')
        error.code = 'SMART_PROMOTION_SCOPE_CHANGED'
        throw error
      }
      memory.set(key, result)
      retryAfter.delete(key)
      try { sessionStorage.setItem(key, JSON.stringify({
        ...result,
        ok: true,
      })) } catch {}
      return result
    } catch (error) {
      if (error?.code === 'SMART_PROMOTION_SCOPE_CHANGED') throw error
      retryAfter.set(key, Date.now() + RETRY_MS)
      return force ? null : getSmartPromotionCache(language, placement)
    }
  })()
  pending.set(key, request)
  try {
    return await request
  } finally {
    if (pending.get(key) === request) pending.delete(key)
  }
}

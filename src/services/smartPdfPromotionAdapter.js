import { getStoryLanguageId } from '../utils/storyLanguage'
import { fetchAuthorStorePdfOwnership, hasAuthorStoreReaderSession } from './authorStorePdfOwnershipApi'
import {
  fetchSmartPdfPromotion, fetchSmartPdfPromotionVersion, getSmartPdfPromotionReaderKey,
} from './smartPdfPromotionApi'
import {
  getSmartPdfReservedIds, readSmartPdfPromotionQueue, saveSmartPdfPromotionQueue,
} from './smartPdfPromotionQueue'
import { queueSmartPdfPromotionEvent } from './smartPdfPromotionTracking'

const VALID_PLACEMENTS = new Set(['stories', 'manga', 'discover'])
const inFlight = new Map()
const RETRY_MS = 10000
const retryAfter = new Map()

function validatePlacement(placement) {
  if (!VALID_PLACEMENTS.has(placement)) throw new TypeError('Invalid PDF placement')
}

async function remainingOwnedSafe(promotions) {
  if (!hasAuthorStoreReaderSession() || !promotions.length) return promotions
  const result = await fetchAuthorStorePdfOwnership(promotions.map((offer) => offer.product_id))
  if (result.authenticated !== true) throw new Error('PDF purchase status could not be verified')
  const allowed = new Set(result.products.filter((entry) => entry.product_type === 'pdf' && entry.state === 'available')
    .map((entry) => String(entry.product_id)))
  return promotions.filter((offer) => allowed.has(String(offer.product_id)))
}

function identityScope(placement) {
  validatePlacement(placement)
  return { placement, language: getStoryLanguageId(), readerKey: getSmartPdfPromotionReaderKey() }
}

export async function getPersonalizedSmartPdfPromotion({
  placement, interests = {}, force = false, signal,
} = {}) {
  const scope = identityScope(placement)
  const scopeKey = `${scope.readerKey}:${scope.language}:${placement}`
  if (inFlight.has(scopeKey)) return inFlight.get(scopeKey)
  const request = (async () => {
    const version = await fetchSmartPdfPromotionVersion({ signal })
    if (scope.readerKey !== getSmartPdfPromotionReaderKey() || scope.language !== getStoryLanguageId()) {
      throw new Error('PDF reader identity changed during loading')
    }
    const cached = readSmartPdfPromotionQueue({ ...scope, rotationKey: version.rotation_key })
    const survivors = cached ? await remainingOwnedSafe(cached.promotions) : []
    const retained = survivors
    if (cached && survivors.length === cached.promotions.length) {
      return { ok: true, ...cached, promotion: cached.promotions[0] || null }
    }
    const reserve = getSmartPdfReservedIds({
      language: scope.language, rotationKey: version.rotation_key,
      readerKey: scope.readerKey, excludePlacement: placement,
    })
    const excluded = [...new Set([...survivors.map((offer) => offer.product_id),
      ...(cached ? cached.promotions.map((offer) => offer.product_id) : []), ...reserve])].slice(0, 90)
    if (Date.now() < (retryAfter.get(scopeKey) || 0)) {
      if (survivors.length) return { ok: true, ...cached, promotions: survivors, promotion: survivors[0] }
      throw new Error('PDF recommendation is temporarily unavailable')
    }
    let fresh
    try {
      fresh = await fetchSmartPdfPromotion({ placement, interests, excludeProductIds: excluded, signal })
      retryAfter.delete(scopeKey)
    } catch (error) {
      retryAfter.set(scopeKey, Date.now() + RETRY_MS)
      throw error
    }
    if (scope.readerKey !== getSmartPdfPromotionReaderKey() || scope.language !== getStoryLanguageId() ||
      fresh.rotation_key !== version.rotation_key || fresh.expires_at !== version.expires_at) {
      throw new Error('PDF promotion scope or rotation changed during loading')
    }
    const seen = new Set()
    const combined = []
    for (const offer of [...retained, ...fresh.promotions]) {
      if (seen.has(offer.product_id)) continue
      seen.add(offer.product_id)
      combined.push({ ...offer, slot_position: combined.length + 1 })
      if (combined.length === 3) break
    }
    const selection = { ...fresh, promotions: combined, promotion: combined[0] || null }
    saveSmartPdfPromotionQueue({ ...scope, selection })
    return selection
  })().finally(() => { if (inFlight.get(scopeKey) === request) inFlight.delete(scopeKey) })
  inFlight.set(scopeKey, request)
  return request
}

export function queueSmartPdfVisibleOffers({ placement, rotationKey, productIds = [] } = {}) {
  validatePlacement(placement)
  for (const id of [...new Set(productIds)]) {
    queueSmartPdfPromotionEvent({ placement, rotationKey, eventType: 'impression', productId: id })
  }
}

export function queueSmartPdfOfferClick({ placement, rotationKey, productId } = {}) {
  validatePlacement(placement)
  return queueSmartPdfPromotionEvent({ placement, rotationKey, eventType: 'click', productId })
}

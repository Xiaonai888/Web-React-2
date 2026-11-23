import { getStoryLanguageId } from '../utils/storyLanguage'
import { getSmartFreeUnlockInterests } from './advertisements/smartFreeUnlockPresentation'
import { fetchAuthorStorePdfOwnership, hasAuthorStoreReaderSession } from './authorStorePdfOwnershipApi'
import {
  fetchSmartPdfPromotion, fetchSmartPdfPromotionVersion, getSmartPdfPromotionReaderKey,
} from './smartPdfPromotionApi'
import {
  getSmartPdfReservedIds, readSmartPdfPromotionQueue, saveSmartPdfPromotionQueue,
} from './smartPdfPromotionQueue'
import { queueSmartPdfPromotionEvent } from './smartPdfPromotionTracking'

const VALID_PLACEMENTS = new Set(['stories', 'manga', 'discover'])
const PROOF = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
const inFlight = new Map()
const RETRY_MS = 10000
const PARTIAL_RETRY_MS = 5 * 60 * 1000
const retryAfter = new Map()
const partialRetryAfter = new Map()
const issuedProofs = new Map()

function validatePlacement(placement) {
  if (!VALID_PLACEMENTS.has(placement)) throw new TypeError('Invalid PDF placement')
}

function hasTrackingProofs(promotions) {
  return Array.isArray(promotions) && promotions.every((offer) => {
    const value = offer?.smart_pdf_event_proof
    return typeof value === 'string' && value.length >= 70 && value.length <= 1024 && PROOF.test(value)
  })
}

function storeIssuedProofs(scope, selection) {
  if (!hasTrackingProofs(selection.promotions)) throw new Error('PDF tracking proofs are missing')
  const key = `${scope.readerKey}:${scope.language}:${scope.placement}`
  if (issuedProofs.size >= 15) issuedProofs.delete(issuedProofs.keys().next().value)
  issuedProofs.set(key, {
    rotationKey: String(selection.rotation_key),
    proofs: new Map(selection.promotions.map((offer) => [String(offer.product_id), offer.smart_pdf_event_proof])),
  })
}

function eventProofFor(placement, rotationKey, productId) {
  const readerKey = getSmartPdfPromotionReaderKey()
  const language = getStoryLanguageId()
  const key = `${readerKey}:${language}:${placement}`
  const record = issuedProofs.get(key)
  if (!record || record.rotationKey !== String(rotationKey)) return ''
  return record.proofs.get(String(productId)) || ''
}

async function remainingOwnedSafe(promotions) {
  if (!hasAuthorStoreReaderSession() || !promotions.length) return promotions
  const result = await fetchAuthorStorePdfOwnership(promotions.map((offer) => offer.product_id))
  if (result.authenticated !== true) throw new Error('PDF purchase status could not be verified')
  const visible = new Set(result.products.filter((entry) =>
    entry.product_type === 'pdf' && entry.state !== 'purchased'
  ).map((entry) => String(entry.product_id)))
  return promotions.filter((offer) => visible.has(String(offer.product_id)))
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
    const loaded = readSmartPdfPromotionQueue({ ...scope, rotationKey: version.rotation_key })
    const cached = loaded && hasTrackingProofs(loaded.promotions) ? loaded : null
    const survivors = cached ? await remainingOwnedSafe(cached.promotions) : []
    const fullyCached = cached && cached.promotions.length === 3 && survivors.length === 3
    const recentlyCheckedPartial = cached && cached.promotions.length > 0 &&
      survivors.length === cached.promotions.length && Date.now() < (partialRetryAfter.get(scopeKey) || 0)
    if (fullyCached || recentlyCheckedPartial) {
      storeIssuedProofs(scope, cached)
      return { ok: true, ...cached, promotion: cached.promotions[0] || null }
    }
    const reserve = getSmartPdfReservedIds({
      language: scope.language, rotationKey: version.rotation_key,
      readerKey: scope.readerKey, excludePlacement: placement,
    })
    const excluded = [...new Set([...survivors.map((offer) => offer.product_id),
      ...(cached ? cached.promotions.map((offer) => offer.product_id) : []), ...reserve])].slice(0, 90)
    if (Date.now() < (retryAfter.get(scopeKey) || 0)) {
      if (survivors.length) {
        const result = { ok: true, ...cached, promotions: survivors, promotion: survivors[0] }
        storeIssuedProofs(scope, result)
        return result
      }
      throw new Error('PDF recommendation is temporarily unavailable')
    }
    let fresh
    try {
      const selectedInterests = interests && typeof interests === 'object' && !Array.isArray(interests) && Object.keys(interests).length
  ? interests
  : getSmartFreeUnlockInterests()
fresh = await fetchSmartPdfPromotion({ placement, interests: selectedInterests, excludeProductIds: excluded, signal })
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
    for (const offer of [...fresh.promotions, ...survivors]) {
      if (seen.has(offer.product_id)) continue
      seen.add(offer.product_id)
      combined.push({ ...offer, slot_position: combined.length + 1 })
      if (combined.length === 3) break
    }
    const selection = { ...fresh, promotions: combined, promotion: combined[0] || null }
    storeIssuedProofs(scope, selection)
    if (combined.length) saveSmartPdfPromotionQueue({ ...scope, selection })
    partialRetryAfter.set(scopeKey, combined.length < 3 ? Date.now() + PARTIAL_RETRY_MS : 0)
    return selection
  })().finally(() => { if (inFlight.get(scopeKey) === request) inFlight.delete(scopeKey) })
  inFlight.set(scopeKey, request)
  return request
}

export function queueSmartPdfVisibleOffers({ placement, rotationKey, productIds = [] } = {}) {
  validatePlacement(placement)
  for (const id of [...new Set(productIds)]) {
    const eventProof = eventProofFor(placement, rotationKey, id)
    if (!eventProof) continue
    queueSmartPdfPromotionEvent({ placement, rotationKey, eventType: 'impression', productId: id, eventProof })
  }
}

export function queueSmartPdfOfferClick({ placement, rotationKey, productId } = {}) {
  validatePlacement(placement)
  const eventProof = eventProofFor(placement, rotationKey, productId)
  if (!eventProof) return false
  return queueSmartPdfPromotionEvent({ placement, rotationKey, eventType: 'click', productId, eventProof })
}

import { getSmartPdfPromotionReaderKey, recordSmartPdfPromotionEvents } from './smartPdfPromotionApi'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PROOF = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
const PLACEMENTS = new Set(['stories', 'manga', 'discover'])
const EVENTS = new Set(['impression', 'click'])
const BUFFER_DELAY_MS = 1200
const MAX_TRACKED = 3000
const tracked = new Set()
const pending = new Map()
let scope = ''
let timer = null

function refreshScope(next) {
  if (scope === next) return
  scope = next
  tracked.clear()
  pending.clear()
  if (timer !== null) clearTimeout(timer)
  timer = null
}

export function queueSmartPdfPromotionEvent({ placement, rotationKey, eventType, productId, eventProof } = {}) {
  const id = String(productId || '').trim().toLowerCase()
  const slot = String(rotationKey || '')
  if (!PLACEMENTS.has(placement) || !EVENTS.has(eventType) || !UUID.test(id) || !/^\d{9,12}$/.test(slot) ||
      typeof eventProof !== 'string' || eventProof.length < 70 || eventProof.length > 1024 || !PROOF.test(eventProof)) return false
  const reader = getSmartPdfPromotionReaderKey()
  refreshScope(`${reader}:${slot}`)
  const uniqueKey = `${placement}:${eventType}:${id}`
  if (tracked.has(uniqueKey)) return false
  if (tracked.size >= MAX_TRACKED) tracked.clear()
  tracked.add(uniqueKey)
  const key = `${placement}:${eventType}`
  const bucket = pending.get(key) || { reader, placement, rotationKey: slot, eventType, proofsById: new Map() }
  bucket.proofsById.set(id, eventProof)
  pending.set(key, bucket)
  if (bucket.proofsById.size >= 10) {
    void flushSmartPdfPromotionEvents()
  } else if (timer === null) {
    timer = setTimeout(() => { void flushSmartPdfPromotionEvents() }, BUFFER_DELAY_MS)
  }
  return true
}

export async function flushSmartPdfPromotionEvents() {
  if (timer !== null) clearTimeout(timer)
  timer = null
  const buckets = [...pending.values()]
  pending.clear()
  const requests = []
  for (const bucket of buckets) {
    if (bucket.reader !== getSmartPdfPromotionReaderKey()) continue
    const entries = [...bucket.proofsById.entries()]
    for (let offset = 0; offset < entries.length; offset += 10) {
      const slice = entries.slice(offset, offset + 10)
      requests.push(recordSmartPdfPromotionEvents({
        placement: bucket.placement,
        rotationKey: bucket.rotationKey,
        eventType: bucket.eventType,
        productIds: slice.map(([id]) => id),
        eventProofs: slice.map(([, proof]) => proof),
      }))
    }
  }
  const results = await Promise.allSettled(requests)
  return { batches: results.length, failed: results.filter((item) => item.status === 'rejected').length }
}

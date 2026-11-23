import { getSmartPdfPromotionReaderKey, recordSmartPdfPromotionEvents } from './smartPdfPromotionApi'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
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

export function queueSmartPdfPromotionEvent({ placement, rotationKey, eventType, productId } = {}) {
  const id = String(productId || '').trim().toLowerCase()
  const slot = String(rotationKey || '')
  if (!PLACEMENTS.has(placement) || !EVENTS.has(eventType) || !UUID.test(id) || !/^\d{9,12}$/.test(slot)) return false
  const reader = getSmartPdfPromotionReaderKey()
  refreshScope(`${reader}:${slot}`)
  const uniqueKey = `${placement}:${eventType}:${id}`
  if (tracked.has(uniqueKey)) return false
  if (tracked.size >= MAX_TRACKED) tracked.clear()
  tracked.add(uniqueKey)
  const key = `${placement}:${eventType}`
  const bucket = pending.get(key) || { reader, placement, rotationKey: slot, eventType, ids: new Set() }
  bucket.ids.add(id)
  pending.set(key, bucket)
  if (bucket.ids.size >= 10) {
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
    const ids = [...bucket.ids]
    for (let offset = 0; offset < ids.length; offset += 10) {
      requests.push(recordSmartPdfPromotionEvents({
        placement: bucket.placement,
        rotationKey: bucket.rotationKey,
        eventType: bucket.eventType,
        productIds: ids.slice(offset, offset + 10),
      }))
    }
  }
  const results = await Promise.allSettled(requests)
  return { batches: results.length, failed: results.filter((item) => item.status === 'rejected').length }
}

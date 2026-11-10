import { getSmartAdReaderKey, recordSmartAdImpressions } from './smartAdClient'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SLOT = /^\d{4}-\d{2}-\d{2}T(?:00|06|12|18):00$/
const FLUSH_DELAY_MS = 1200
const MAX_TRACKED_IDS = 3000
const MAX_BUFFERED_IDS = 100
const seen = new Set()
const buffered = new Map()
let timeoutId = null
let latestScope = ''

function resetScopeIfNeeded(reader, slot) {
  const scope = `${reader}:${slot}`
  if (latestScope === scope) return
  latestScope = scope
  seen.clear()
  buffered.clear()
  if (timeoutId !== null) clearTimeout(timeoutId)
  timeoutId = null
}

export function queueDiscoverSmartAdImpression(slotKey, storyId) {
  const slot = String(slotKey || '')
  const id = String(storyId || '').toLowerCase()
  if (!SLOT.test(slot) || !UUID.test(id)) return false
  const reader = getSmartAdReaderKey()
  resetScopeIfNeeded(reader, slot)
  if (seen.has(id)) return false
  if (seen.size >= MAX_TRACKED_IDS) seen.clear()
  seen.add(id)
  const bucket = buffered.get(slot) || { reader, slot, ids: new Set() }
  bucket.ids.add(id)
  buffered.set(slot, bucket)
  if (bucket.ids.size >= 10 || seen.size >= MAX_BUFFERED_IDS) {
    void flushDiscoverSmartAdImpressions()
  } else if (timeoutId === null) {
    timeoutId = setTimeout(() => { void flushDiscoverSmartAdImpressions() }, FLUSH_DELAY_MS)
  }
  return true
}

export async function flushDiscoverSmartAdImpressions() {
  if (timeoutId !== null) clearTimeout(timeoutId)
  timeoutId = null
  const items = [...buffered.values()]
  buffered.clear()
  const requests = []
  for (const bucket of items) {
    if (getSmartAdReaderKey() !== bucket.reader) continue
    const ids = [...bucket.ids]
    for (let start = 0; start < ids.length; start += 10) {
      requests.push(recordSmartAdImpressions({
        placement: 'discover',
        slotKey: bucket.slot,
        storyIds: ids.slice(start, start + 10),
      }))
    }
  }
  const results = await Promise.allSettled(requests)
  return { batches: results.length, failed: results.filter((row) => row.status === 'rejected').length }
}

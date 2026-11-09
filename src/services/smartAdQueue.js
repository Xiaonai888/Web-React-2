const PLACEMENTS = ['discover', 'opening', 'freeUnlock', 'me']
const PREFIX = 'shadow_smart_ad_shared_queue_v1:'
const MAX_BATCHES = 8
const MAX_STORIES_PER_BATCH = 10
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function validatePlacement(value) {
  if (!PLACEMENTS.includes(value)) throw new TypeError('Invalid Smart Ad placement')
  return value
}

function hash(value) {
  let number = 2166136261
  for (const character of String(value)) {
    number ^= character.charCodeAt(0)
    number = Math.imul(number, 16777619)
  }
  return (number >>> 0).toString(36)
}

function getStorage(storage) {
  if (storage) return storage
  try { return typeof sessionStorage !== 'undefined' ? sessionStorage : null } catch { return null }
}

function keyFor(readerKey, placement) {
  if (!readerKey) throw new TypeError('Smart Ad reader key is required')
  return `${PREFIX}${hash(readerKey)}:${validatePlacement(placement)}`
}

function parse(value) {
  try {
    const result = JSON.parse(value || 'null')
    if (!result || result.version !== 1 || !Array.isArray(result.batches)) return null
    if (!PLACEMENTS.includes(result.placement)) return null
    return result
  } catch { return null }
}

function sameVersion(queue, { placement, slotKey, catalogVersion }) {
  return queue && queue.placement === placement &&
    String(queue.slot_key) === String(slotKey) &&
    Number(queue.catalog_version) === Number(catalogVersion)
}

export function readSmartAdQueue({
  readerKey, placement, slotKey, catalogVersion, visitKey = '', keepCurrentVisit = false, storage,
} = {}) {
  const store = getStorage(storage)
  if (!store) return null
  let saved
  try { saved = parse(store.getItem(keyFor(readerKey, placement))) } catch { return null }
  if (!saved) return null
  if (Number(saved.catalog_version) !== Number(catalogVersion)) return null
  if (sameVersion(saved, { placement, slotKey, catalogVersion })) return saved
  if (keepCurrentVisit && visitKey && saved.visit_key === visitKey) return saved
  return null
}

export function saveSmartAdQueue({ readerKey, placement, queue, storage } = {}) {
  const store = getStorage(storage)
  if (!store) return false
  validatePlacement(placement)
  if (!queue || queue.placement !== placement || !Array.isArray(queue.batches)) {
    throw new TypeError('Invalid Smart Ad queue')
  }
  try {
    store.setItem(keyFor(readerKey, placement), JSON.stringify(queue))
    return true
  } catch { return false }
}

export function appendSmartAdSelection({
  readerKey, placement, response, visitKey = '', storage,
} = {}) {
  validatePlacement(placement)
  if (!response || response.ok !== true || response.placement !== placement) {
    throw new TypeError('Invalid Smart Ad selection response')
  }
  const existing = readSmartAdQueue({
    readerKey, placement, slotKey: response.slot_key,
    catalogVersion: response.catalog_version, storage,
  })
  const next = existing || {
    version: 1,
    placement,
    slot_key: response.slot_key,
    catalog_version: response.catalog_version,
    visit_key: visitKey,
    batches: [],
    batch_offset: 0,
    position: 0,
    queue_index: 0,
  }
  const already = new Set(next.batches.flat().map((item) => String(item.story_id)))
  const ids = new Set()
  const incoming = (Array.isArray(response.ads) ? response.ads : []).filter((item) => {
    const id = String(item?.story_id || '')
    if (!UUID.test(id) || already.has(id) || ids.has(id)) return false
    ids.add(id)
    return true
  }).slice(0, MAX_STORIES_PER_BATCH)
  const batches = incoming.length ? [...next.batches, incoming] : [...next.batches]
  const removed = Math.max(0, batches.length - MAX_BATCHES)
  const removedCount = batches.slice(0, removed).reduce((total, batch) => total + batch.length, 0)
  const saved = {
    ...next,
    visit_key: next.visit_key || visitKey,
    batches: removed ? batches.slice(removed) : batches,
    batch_offset: (next.batch_offset || 0) + removed,
    next_cursor: response.next_cursor,
    exhausted: Boolean(response.exhausted),
    position: Math.max(0, (next.position || 0) - removedCount),
    queue_index: (next.queue_index || 0) + (incoming.length ? 1 : 0),
  }
  saveSmartAdQueue({ readerKey, placement, queue: saved, storage })
  return saved
}

export function getSmartAdReservedIds({
  readerKey, slotKey, catalogVersion, excludePlacement = '', storage,
} = {}) {
  const store = getStorage(storage)
  if (!store) return []
  const ids = new Set()
  for (const placement of PLACEMENTS) {
    if (placement === excludePlacement) continue
    const queue = readSmartAdQueue({ readerKey, placement, slotKey, catalogVersion, storage: store })
    if (!queue) continue
    for (const ad of queue.batches.flat()) {
      const id = String(ad?.story_id || '')
      if (UUID.test(id)) ids.add(id)
    }
  }
  return [...ids].slice(0, 3000)
}

export function nextSmartAdFromQueue({ readerKey, placement, slotKey, catalogVersion, storage } = {}) {
  const queue = readSmartAdQueue({ readerKey, placement, slotKey, catalogVersion, storage })
  if (!queue) return null
  const ads = queue.batches.flat()
  if (!ads.length) return null
  let index = Number.isSafeInteger(queue.position) ? queue.position : 0
  if (index >= ads.length && placement !== 'freeUnlock') return null
  if (index >= ads.length) index = 0
  const ad = ads[index]
  saveSmartAdQueue({ readerKey, placement, queue: { ...queue, position: index + 1 }, storage })
  return ad
}

export function clearSmartAdQueue({ readerKey, placement, storage } = {}) {
  const store = getStorage(storage)
  if (!store) return
  try { store.removeItem(keyFor(readerKey, placement)) } catch {}
}

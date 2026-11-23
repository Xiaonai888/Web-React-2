import { getSmartPdfPromotionReaderKey } from './smartPdfPromotionApi'

const PLACEMENTS = ['stories', 'manga', 'discover']
const LANGUAGES = new Set(['km', 'en', 'zh', 'ja', 'ko'])
const PREFIX = 'shadow_smart_pdf_queue_v1:'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function hash(value) {
  let result = 2166136261
  for (const character of String(value)) result = Math.imul(result ^ character.charCodeAt(0), 16777619)
  return (result >>> 0).toString(36)
}

function storageOf(override) {
  if (override) return override
  try { return typeof sessionStorage !== 'undefined' ? sessionStorage : null } catch { return null }
}

function identity(value) {
  const readerKey = value || getSmartPdfPromotionReaderKey()
  if (!/^(visitor|reader):[a-zA-Z0-9._:-]{4,128}$/.test(readerKey)) {
    throw new TypeError('Invalid PDF reader scope')
  }
  return readerKey
}

function queueKey(readerKey, language, placement) {
  if (!LANGUAGES.has(language) || !PLACEMENTS.includes(placement)) throw new TypeError('Invalid PDF queue scope')
  return `${PREFIX}${hash(readerKey)}:${language}:${placement}`
}

function validRotation(rotationKey) {
  if (!/^\d{9,12}$/.test(String(rotationKey || ''))) throw new TypeError('Invalid PDF rotation key')
  return String(rotationKey)
}

function read({ readerKey, language, placement, rotationKey, storage }) {
  const store = storageOf(storage)
  if (!store) return null
  const key = queueKey(readerKey, language, placement)
  try {
    const raw = store.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    const expiresAt = Date.parse(String(data?.expires_at || ''))
    if (data?.version !== 1 || data.rotation_key !== rotationKey || data.language !== language ||
      data.placement !== placement || !Array.isArray(data.promotions) || data.promotions.length > 3 ||
      !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      store.removeItem(key)
      return null
    }
    const ids = data.promotions.map((item) => String(item?.product_id || ''))
    if (ids.some((id) => !UUID.test(id)) || new Set(ids).size !== ids.length) {
      store.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function readSmartPdfPromotionQueue({ placement, language, rotationKey, readerKey, storage } = {}) {
  return read({
    placement,
    language,
    rotationKey: validRotation(rotationKey),
    readerKey: identity(readerKey),
    storage,
  })
}

export function saveSmartPdfPromotionQueue({ placement, language, selection, readerKey, storage } = {}) {
  const store = storageOf(storage)
  if (!store || selection?.ok !== true || selection.language !== language ||
    selection.placement !== placement || !Array.isArray(selection.promotions) || selection.promotions.length > 3) return false
  const key = validRotation(selection.rotation_key)
  const end = Date.parse(String(selection.expires_at || ''))
  if (!Number.isFinite(end) || end <= Date.now()) return false
  const ids = selection.promotions.map((item) => String(item?.product_id || ''))
  if (ids.some((id) => !UUID.test(id)) || new Set(ids).size !== ids.length) return false
  try {
    store.setItem(queueKey(identity(readerKey), language, placement), JSON.stringify({
      version: 1,
      placement,
      language,
      rotation_key: key,
      expires_at: selection.expires_at,
      promotions: selection.promotions,
    }))
    return true
  } catch {
    return false
  }
}

export function getSmartPdfReservedIds({ language, rotationKey, readerKey, excludePlacement = '', storage } = {}) {
  const reader = identity(readerKey)
  const key = validRotation(rotationKey)
  const selected = new Set()
  for (const placement of PLACEMENTS) {
    if (placement === excludePlacement) continue
    const queue = read({ readerKey: reader, language, placement, rotationKey: key, storage })
    for (const item of queue?.promotions || []) selected.add(String(item.product_id))
  }
  return [...selected]
}

export function clearSmartPdfPromotionQueue({ language, readerKey, placement = '', storage } = {}) {
  const store = storageOf(storage)
  if (!store) return
  const reader = identity(readerKey)
  for (const candidate of PLACEMENTS) {
    if (placement && candidate !== placement) continue
    try { store.removeItem(queueKey(reader, language, candidate)) } catch {}
  }
}

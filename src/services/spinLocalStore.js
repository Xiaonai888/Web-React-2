const DB_NAME = 'shadow_spin_local_v1'
const DB_VERSION = 1
const WHEEL_STORE = 'wheels'
const RESULT_STORE = 'results'
const MEDIA_STORE = 'media'
const MAX_SAVED_WHEELS = 10
const MAX_HISTORY = 50
const HISTORY_DAYS = 30
const MAX_ENTRIES = 10000
const MAX_CUSTOM_GIFTS = 10
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

let dbPromise = null
const objectUrlCache = new Map()

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed'))
  })
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed'))
    transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted'))
  })
}

function openSpinDb() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'))
      return
    }

    const request = globalThis.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(WHEEL_STORE)) {
        const wheels = db.createObjectStore(WHEEL_STORE, { keyPath: 'id' })
        wheels.createIndex('updated_at', 'updated_at', { unique: false })
      }

      if (!db.objectStoreNames.contains(RESULT_STORE)) {
        const results = db.createObjectStore(RESULT_STORE, { keyPath: 'id' })
        results.createIndex('created_at', 'created_at', { unique: false })
      }

      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => {
      dbPromise = null
      reject(request.error || new Error('Could not open local Spin storage'))
    }

    request.onblocked = () => {
      dbPromise = null
      reject(new Error('Spin storage upgrade is blocked'))
    }
  })

  return dbPromise
}

async function getAll(storeName) {
  const db = await openSpinDb()
  const transaction = db.transaction(storeName, 'readonly')
  const done = transactionDone(transaction)
  const items = await requestResult(transaction.objectStore(storeName).getAll())
  await done
  return Array.isArray(items) ? items : []
}

async function getOne(storeName, id) {
  if (!id) return null
  const db = await openSpinDb()
  const transaction = db.transaction(storeName, 'readonly')
  const done = transactionDone(transaction)
  const item = await requestResult(transaction.objectStore(storeName).get(id))
  await done
  return item || null
}

async function putOne(storeName, item) {
  const db = await openSpinDb()
  const transaction = db.transaction(storeName, 'readwrite')
  const done = transactionDone(transaction)
  transaction.objectStore(storeName).put(item)
  await done
  return item
}

async function deleteOne(storeName, id) {
  if (!id) return
  const db = await openSpinDb()
  const transaction = db.transaction(storeName, 'readwrite')
  const done = transactionDone(transaction)
  transaction.objectStore(storeName).delete(id)
  await done
}

function revokeMediaUrl(mediaKey) {
  const url = objectUrlCache.get(mediaKey)
  if (!url) return
  URL.revokeObjectURL(url)
  objectUrlCache.delete(mediaKey)
}

function stripLocalObjectUrl(value) {
  const text = String(value || '')
  return text.startsWith('blob:') ? null : value || null
}

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function serializeEntry(entry, index) {
  if (!entry || typeof entry !== 'object') return null

  const name = cleanText(entry.name, 120)
  if (!name) return null

  const sourceType = ['manual', 'reader', 'author', 'book'].includes(entry.source_type)
    ? entry.source_type
    : 'manual'

  return {
    id: cleanText(entry.id, 180) || `${sourceType}-${index + 1}`,
    source_type: sourceType,
    source_id: cleanText(entry.source_id, 180) || null,
    name,
    secondary: cleanText(entry.secondary, 160),
    image_url: stripLocalObjectUrl(entry.image_url),
  }
}

function serializeEntries(value) {
  if (!Array.isArray(value)) return []

  return value
    .slice(0, MAX_ENTRIES)
    .map(serializeEntry)
    .filter(Boolean)
}

function serializePrize(prize) {
  if (!prize || typeof prize !== 'object') return prize || null

  return {
    id: cleanText(prize.id, 180) || createId('prize'),
    type: ['diamond', 'coin', 'voucher', 'custom'].includes(prize.type)
      ? prize.type
      : 'custom',
    name: cleanText(prize.name, 120),
    amount: Math.max(0, Math.round(Number(prize.amount || 0))),
    media_key: cleanText(prize.media_key, 220) || null,
    image_url: prize.media_key ? null : stripLocalObjectUrl(prize.image_url),
  }
}

function serializePrizes(value) {
  if (!Array.isArray(value)) return []

  const custom = []
  const builtIns = []
  const seenBuiltIns = new Set()

  for (const raw of value) {
    const prize = serializePrize(raw)
    if (!prize) continue

    if (prize.type === 'custom') {
      if (custom.length < MAX_CUSTOM_GIFTS) custom.push(prize)
      continue
    }

    if (seenBuiltIns.has(prize.type)) continue
    seenBuiltIns.add(prize.type)
    builtIns.push(prize)
  }

  return [...builtIns, ...custom]
}

function serializeWheel(payload, id) {
  const now = new Date().toISOString()

  return {
    id: id || createId('wheel'),
    title: cleanText(payload?.title || 'Shadow Spin', 80),
    mode: payload?.mode === 'shadow' ? 'shadow' : 'normal',
    entries: serializeEntries(payload?.entries),
    prizes: serializePrizes(payload?.prizes),
    background_media_key: cleanText(payload?.background_media_key, 220) || null,
    background_url: payload?.background_media_key
      ? null
      : stripLocalObjectUrl(payload?.background_url),
    options:
      payload?.options && typeof payload.options === 'object'
        ? { no_repeat: Boolean(payload.options.no_repeat) }
        : { no_repeat: false },
    created_at: payload?.created_at || now,
    updated_at: now,
  }
}

function serializeResult(payload) {
  return {
    id: payload?.id || createId('result'),
    wheel_id: cleanText(payload?.wheel_id, 220) || null,
    wheel_title: cleanText(payload?.wheel_title || 'Shadow Spin', 80),
    mode: payload?.mode === 'shadow' ? 'shadow' : 'normal',
    winner: serializeEntry(payload?.winner, 0),
    prize: serializePrize(payload?.prize),
    created_at: payload?.created_at || new Date().toISOString(),
  }
}

async function mediaUrl(mediaKey) {
  if (!mediaKey) return ''

  const cached = objectUrlCache.get(mediaKey)
  if (cached) return cached

  const item = await getOne(MEDIA_STORE, mediaKey)
  if (!item?.blob) return ''

  const url = URL.createObjectURL(item.blob)
  objectUrlCache.set(mediaKey, url)
  return url
}

async function hydratePrize(prize) {
  if (!prize || typeof prize !== 'object') return prize || null

  return {
    ...prize,
    image_url: prize.media_key
      ? await mediaUrl(prize.media_key)
      : prize.image_url || null,
  }
}

async function hydrateWheel(wheel) {
  if (!wheel) return null

  return {
    ...wheel,
    background_url: wheel.background_media_key
      ? await mediaUrl(wheel.background_media_key)
      : wheel.background_url || '',
    prizes: await Promise.all(
      (Array.isArray(wheel.prizes) ? wheel.prizes : []).map(hydratePrize)
    ),
  }
}

async function hydrateResult(result) {
  if (!result) return null

  return {
    ...result,
    prize: await hydratePrize(result.prize),
  }
}

function collectMediaKeysFromPrize(prize, output) {
  if (prize?.media_key) output.add(prize.media_key)
}

function collectMediaKeys(wheels, results) {
  const keys = new Set()

  for (const wheel of wheels) {
    if (wheel?.background_media_key) keys.add(wheel.background_media_key)

    for (const prize of Array.isArray(wheel?.prizes) ? wheel.prizes : []) {
      collectMediaKeysFromPrize(prize, keys)
    }
  }

  for (const result of results) {
    collectMediaKeysFromPrize(result?.prize, keys)
  }

  return keys
}

async function deleteMany(storeName, ids) {
  if (!ids.length) return

  const db = await openSpinDb()
  const transaction = db.transaction(storeName, 'readwrite')
  const done = transactionDone(transaction)
  const store = transaction.objectStore(storeName)

  for (const id of ids) {
    store.delete(id)
  }

  await done
}

async function pruneResults() {
  const results = await getAll(RESULT_STORE)
  const cutoff = Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000
  const sorted = [...results].sort(
    (left, right) =>
      new Date(right.created_at || 0).getTime() -
      new Date(left.created_at || 0).getTime()
  )
  const keepIds = new Set(
    sorted
      .filter((item) => new Date(item.created_at || 0).getTime() >= cutoff)
      .slice(0, MAX_HISTORY)
      .map((item) => item.id)
  )

  await deleteMany(
    RESULT_STORE,
    results.filter((item) => !keepIds.has(item.id)).map((item) => item.id)
  )
}

async function pruneWheels() {
  const wheels = await getAll(WHEEL_STORE)

  if (wheels.length <= MAX_SAVED_WHEELS) return

  const sorted = [...wheels].sort(
    (left, right) =>
      new Date(right.updated_at || 0).getTime() -
      new Date(left.updated_at || 0).getTime()
  )

  await deleteMany(
    WHEEL_STORE,
    sorted.slice(MAX_SAVED_WHEELS).map((item) => item.id)
  )
}

async function cleanupMedia() {
  const [wheels, results, media] = await Promise.all([
    getAll(WHEEL_STORE),
    getAll(RESULT_STORE),
    getAll(MEDIA_STORE),
  ])
  const referenced = collectMediaKeys(wheels, results)
  const staleIds = media
    .filter((item) => !referenced.has(item.id))
    .map((item) => item.id)

  if (!staleIds.length) return

  await deleteMany(MEDIA_STORE, staleIds)

  for (const id of staleIds) {
    revokeMediaUrl(id)
  }
}

export async function cleanupSpinLocalStorage() {
  await pruneResults()
  await pruneWheels()
  await cleanupMedia()
}

export async function listSpinWheels(limit = MAX_SAVED_WHEELS) {
  await pruneWheels()

  const wheels = await getAll(WHEEL_STORE)
  const sorted = wheels
    .sort(
      (left, right) =>
        new Date(right.updated_at || 0).getTime() -
        new Date(left.updated_at || 0).getTime()
    )
    .slice(
      0,
      Math.min(
        MAX_SAVED_WHEELS,
        Math.max(1, Number(limit) || MAX_SAVED_WHEELS)
      )
    )

  return Promise.all(sorted.map(hydrateWheel))
}

export async function saveSpinWheel(payload, currentId = null) {
  const existing = currentId ? await getOne(WHEEL_STORE, currentId) : null

  if (!existing) {
    const wheels = await getAll(WHEEL_STORE)

    if (wheels.length >= MAX_SAVED_WHEELS) {
      const error = new Error(`You can save up to ${MAX_SAVED_WHEELS} wheels`)
      error.code = 'SPIN_WHEEL_LIMIT'
      throw error
    }
  }

  const item = serializeWheel(
    {
      ...payload,
      created_at: existing?.created_at,
    },
    existing?.id || null
  )

  if (item.entries.length < 2) {
    const error = new Error('At least 2 entries are required')
    error.code = 'SPIN_ENTRIES_REQUIRED'
    throw error
  }

  await putOne(WHEEL_STORE, item)
  await cleanupSpinLocalStorage()
  return hydrateWheel(item)
}

export async function deleteSpinWheel(wheelId) {
  await deleteOne(WHEEL_STORE, wheelId)
  await cleanupSpinLocalStorage()
}

export async function listSpinResults(limit = MAX_HISTORY) {
  await pruneResults()

  const results = await getAll(RESULT_STORE)
  const sorted = results
    .sort(
      (left, right) =>
        new Date(right.created_at || 0).getTime() -
        new Date(left.created_at || 0).getTime()
    )
    .slice(
      0,
      Math.min(MAX_HISTORY, Math.max(1, Number(limit) || MAX_HISTORY))
    )

  return Promise.all(sorted.map(hydrateResult))
}

export async function saveSpinResult(payload) {
  const item = serializeResult(payload)

  if (!item.winner) {
    const error = new Error('Winner is required')
    error.code = 'SPIN_WINNER_REQUIRED'
    throw error
  }

  await putOne(RESULT_STORE, item)
  await cleanupSpinLocalStorage()
  return hydrateResult(item)
}

export async function deleteSpinResult(resultId) {
  await deleteOne(RESULT_STORE, resultId)
  await cleanupSpinLocalStorage()
}

export async function clearSpinResults() {
  const db = await openSpinDb()
  const transaction = db.transaction(RESULT_STORE, 'readwrite')
  const done = transactionDone(transaction)
  transaction.objectStore(RESULT_STORE).clear()
  await done
  await cleanupSpinLocalStorage()
}

export async function saveSpinMedia(file) {
  if (!file) throw new Error('Image file is required')

  if (Number(file.size || 0) > MAX_IMAGE_BYTES) {
    const error = new Error('Image must be 2 MB or smaller')
    error.code = 'SPIN_IMAGE_TOO_LARGE'
    throw error
  }

  if (!ALLOWED_IMAGE_TYPES.has(String(file.type || '').toLowerCase())) {
    const error = new Error('Use JPG, PNG or WebP')
    error.code = 'SPIN_IMAGE_TYPE_INVALID'
    throw error
  }

  const id = createId('media')
  const item = {
    id,
    blob: file,
    name: cleanText(file.name || 'spin-image', 240),
    type: String(file.type || ''),
    size: Number(file.size || 0),
    created_at: new Date().toISOString(),
  }

  await putOne(MEDIA_STORE, item)

  const url = URL.createObjectURL(file)
  objectUrlCache.set(id, url)

  return {
    key: id,
    url,
  }
}

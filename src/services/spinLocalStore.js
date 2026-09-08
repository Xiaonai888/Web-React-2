const DB_NAME = 'shadow_spin_local_v1'
const DB_VERSION = 1
const WHEEL_STORE = 'wheels'
const RESULT_STORE = 'results'
const MEDIA_STORE = 'media'
const MAX_SAVED_WHEELS = 10
const MAX_HISTORY = 50
const HISTORY_DAYS = 30

let dbPromise = null

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

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open local Spin storage'))
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

function stripLocalObjectUrl(value) {
  const text = String(value || '')
  return text.startsWith('blob:') ? null : value || null
}

function serializePrize(prize) {
  if (!prize || typeof prize !== 'object') return prize || null

  return {
    ...prize,
    image_url: prize.media_key ? null : stripLocalObjectUrl(prize.image_url),
  }
}

function serializeWheel(payload, id) {
  const now = new Date().toISOString()

  return {
    id: id || createId('wheel'),
    title: String(payload?.title || 'Shadow Spin').slice(0, 80),
    mode: payload?.mode === 'shadow' ? 'shadow' : 'normal',
    entries: Array.isArray(payload?.entries) ? payload.entries : [],
    prizes: Array.isArray(payload?.prizes) ? payload.prizes.map(serializePrize) : [],
    background_media_key: payload?.background_media_key || null,
    background_url: payload?.background_media_key
      ? null
      : stripLocalObjectUrl(payload?.background_url),
    options:
      payload?.options && typeof payload.options === 'object'
        ? payload.options
        : { no_repeat: false },
    created_at: payload?.created_at || now,
    updated_at: now,
  }
}

function serializeResult(payload) {
  return {
    id: payload?.id || createId('result'),
    wheel_id: payload?.wheel_id || null,
    wheel_title: String(payload?.wheel_title || 'Shadow Spin').slice(0, 80),
    mode: payload?.mode === 'shadow' ? 'shadow' : 'normal',
    winner: payload?.winner || null,
    prize: serializePrize(payload?.prize),
    created_at: payload?.created_at || new Date().toISOString(),
  }
}

async function mediaUrl(mediaKey) {
  if (!mediaKey) return ''
  const item = await getOne(MEDIA_STORE, mediaKey)
  if (!item?.blob) return ''
  return URL.createObjectURL(item.blob)
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
  const stale = results.filter((item) => !keepIds.has(item.id))

  if (!stale.length) return

  const db = await openSpinDb()
  const transaction = db.transaction(RESULT_STORE, 'readwrite')
  const done = transactionDone(transaction)
  const store = transaction.objectStore(RESULT_STORE)

  for (const item of stale) {
    store.delete(item.id)
  }

  await done
}

export async function cleanupSpinLocalStorage() {
  await pruneResults()

  const [wheels, results, media] = await Promise.all([
    getAll(WHEEL_STORE),
    getAll(RESULT_STORE),
    getAll(MEDIA_STORE),
  ])
  const referenced = collectMediaKeys(wheels, results)
  const staleMedia = media.filter((item) => !referenced.has(item.id))

  if (!staleMedia.length) return

  const db = await openSpinDb()
  const transaction = db.transaction(MEDIA_STORE, 'readwrite')
  const done = transactionDone(transaction)
  const store = transaction.objectStore(MEDIA_STORE)

  for (const item of staleMedia) {
    store.delete(item.id)
  }

  await done
}

export async function listSpinWheels(limit = MAX_SAVED_WHEELS) {
  const wheels = await getAll(WHEEL_STORE)
  const sorted = wheels
    .sort(
      (left, right) =>
        new Date(right.updated_at || 0).getTime() -
        new Date(left.updated_at || 0).getTime()
    )
    .slice(0, Math.min(MAX_SAVED_WHEELS, Math.max(1, Number(limit) || MAX_SAVED_WHEELS)))

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

  await putOne(WHEEL_STORE, item)
  await cleanupSpinLocalStorage()
  return hydrateWheel(item)
}

export async function deleteSpinWheel(wheelId) {
  await deleteOne(WHEEL_STORE, wheelId)
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
    .slice(0, Math.min(MAX_HISTORY, Math.max(1, Number(limit) || MAX_HISTORY)))

  return Promise.all(sorted.map(hydrateResult))
}

export async function saveSpinResult(payload) {
  const item = serializeResult(payload)
  await putOne(RESULT_STORE, item)
  await pruneResults()
  return hydrateResult(item)
}

export async function deleteSpinResult(resultId) {
  await deleteOne(RESULT_STORE, resultId)
}

export async function clearSpinResults() {
  const db = await openSpinDb()
  const transaction = db.transaction(RESULT_STORE, 'readwrite')
  const done = transactionDone(transaction)
  transaction.objectStore(RESULT_STORE).clear()
  await done
}

export async function saveSpinMedia(file) {
  if (!file) throw new Error('Image file is required')

  const id = createId('media')
  const item = {
    id,
    blob: file,
    name: String(file.name || 'spin-image').slice(0, 240),
    type: String(file.type || ''),
    size: Number(file.size || 0),
    created_at: new Date().toISOString(),
  }

  await putOne(MEDIA_STORE, item)

  return {
    key: id,
    url: URL.createObjectURL(file),
  }
}

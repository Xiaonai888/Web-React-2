const DATABASE_NAME = 'shadow_story_media_drafts'
const DATABASE_VERSION = 1
const STORE_NAME = 'drafts'
let databasePromise = null
let activeDatabase = null
let preferBinaryStorage = false

function openDatabase() {
  if (databasePromise) return databasePromise
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('This browser cannot save story media locally'))
  }
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    let blocked = false
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => {
      const database = request.result
      if (blocked) {
        database.close()
        return
      }
      activeDatabase = database
      const reset = () => {
        if (activeDatabase !== database) return
        activeDatabase = null
        databasePromise = null
      }
      database.onversionchange = () => {
        database.close()
        reset()
      }
      database.onclose = reset
      resolve(database)
    }
    request.onerror = () => reject(request.error || new Error('Local media database is unavailable'))
    request.onblocked = () => {
      blocked = true
      reject(new Error('Close other Shadow tabs before updating local media storage'))
    }
  }).catch((error) => {
    databasePromise = null
    throw error
  })
  return databasePromise
}

async function execute(mode, operation, attempt = 0) {
  const database = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode)
      const store = transaction.objectStore(STORE_NAME)
      let value = null
      transaction.oncomplete = () => resolve(value)
      transaction.onabort = () => reject(transaction.error || new Error('Local story media save failed'))
      transaction.onerror = () => {}
      try {
        operation(store, (result) => { value = result })
      } catch (error) {
        transaction.abort()
        reject(error)
      }
    })
  } catch (error) {
    if (attempt !== 0 || error?.name !== 'InvalidStateError') throw error
    if (activeDatabase === database) {
      database.close()
      activeDatabase = null
      databasePromise = null
    }
    return execute(mode, operation, 1)
  }
}

function isInvalidBlobError(error) {
  return /InvalidBlob|failed to write blobs|DataCloneError/i.test(`${error?.name || ''} ${error?.message || ''}`)
}

function readableStorageError(error) {
  if (error?.name === 'QuotaExceededError') {
    return new Error('Not enough device storage to save this story media')
  }
  return error
}

async function encodeAsset(asset, cache) {
  if (!asset || asset.kind !== 'blob' || !(asset.value instanceof Blob)) return asset
  let bytes = cache.get(asset.value)
  if (!bytes) {
    bytes = new Uint8Array(await asset.value.arrayBuffer())
    cache.set(asset.value, bytes)
  }
  return { kind: 'blob-bytes', bytes, type: asset.value.type }
}

async function encodePayload(payload) {
  const cache = new WeakMap()
  const encodePair = async (pair) => ({
    ...pair,
    original: await encodeAsset(pair?.original, cache),
    preview: await encodeAsset(pair?.preview, cache),
  })
  return {
    ...payload,
    cover: await encodePair(payload?.cover),
    landscape: await encodePair(payload?.landscape),
    slides: await Promise.all((Array.isArray(payload?.slides) ? payload.slides : []).map(async (slide) => ({
      ...slide,
      original: await encodeAsset(slide?.original, cache),
      cropped: await encodeAsset(slide?.cropped, cache),
    }))),
  }
}

function decodeAsset(asset) {
  if (!asset || asset.kind !== 'blob-bytes') return asset
  const bytes = asset.bytes
  if (!(bytes instanceof Uint8Array) && !(bytes instanceof ArrayBuffer)) {
    throw new Error('The locally saved image is unreadable')
  }
  return { kind: 'blob', value: new Blob([bytes], { type: asset.type || 'application/octet-stream' }) }
}

function decodePayload(payload) {
  if (!payload) return null
  const decodePair = (pair) => pair ? {
    ...pair,
    original: decodeAsset(pair.original),
    preview: decodeAsset(pair.preview),
  } : pair
  return {
    ...payload,
    cover: decodePair(payload.cover),
    landscape: decodePair(payload.landscape),
    slides: Array.isArray(payload.slides) ? payload.slides.map((slide) => ({
      ...slide,
      original: decodeAsset(slide?.original),
      cropped: decodeAsset(slide?.cropped),
    })) : payload.slides,
  }
}

export async function saveStoryMediaDraftRecord(key, payload) {
  const id = String(key || '').trim()
  if (!id) throw new Error('Story media draft key is required')
  const record = { ...payload, key: id, updatedAt: Date.now() }
  try {
    if (preferBinaryStorage) {
      const safeRecord = await encodePayload(record)
      await execute('readwrite', (store) => { store.put(safeRecord) })
    } else {
      await execute('readwrite', (store) => { store.put(record) })
    }
    return true
  } catch (error) {
    if (!isInvalidBlobError(error)) throw readableStorageError(error)
    preferBinaryStorage = true
    try {
      const safeRecord = await encodePayload(record)
      await execute('readwrite', (store) => { store.put(safeRecord) })
      return true
    } catch (retryError) {
      throw readableStorageError(retryError)
    }
  }
}

export async function loadStoryMediaDraftRecord(key) {
  const id = String(key || '').trim()
  if (!id) return null
  const result = await execute('readonly', (store, setResult) => {
    const request = store.get(id)
    request.onsuccess = () => setResult(request.result || null)
  })
  return decodePayload(result)
}

export async function deleteStoryMediaDraftRecord(key) {
  const id = String(key || '').trim()
  if (!id) return false
  await execute('readwrite', (store) => { store.delete(id) })
  return true
}

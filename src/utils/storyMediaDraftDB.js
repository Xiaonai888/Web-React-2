const DATABASE_NAME = 'shadow_story_media_drafts'
const DATABASE_VERSION = 1
const STORE_NAME = 'drafts'
let databasePromise = null

function openDatabase() {
  if (databasePromise) return databasePromise
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('This browser cannot save story media locally'))
  }
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => {
        database.close()
        databasePromise = null
      }
      resolve(database)
    }
    request.onerror = () => reject(request.error || new Error('Local media database is unavailable'))
    request.onblocked = () => reject(new Error('Close other Shadow tabs before updating local media storage'))
  }).catch((error) => {
    databasePromise = null
    throw error
  })
  return databasePromise
}

async function execute(mode, operation) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
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
}

export async function saveStoryMediaDraftRecord(key, payload) {
  const id = String(key || '').trim()
  if (!id) throw new Error('Story media draft key is required')
  try {
    await execute('readwrite', (store) => {
      store.put({ key: id, ...payload, updatedAt: Date.now() })
    })
    return true
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Not enough device storage to save this story media')
    }
    throw error
  }
}

export async function loadStoryMediaDraftRecord(key) {
  const id = String(key || '').trim()
  if (!id) return null
  return execute('readonly', (store, setResult) => {
    const request = store.get(id)
    request.onsuccess = () => setResult(request.result || null)
  })
}

export async function deleteStoryMediaDraftRecord(key) {
  const id = String(key || '').trim()
  if (!id) return false
  await execute('readwrite', (store) => { store.delete(id) })
  return true
}

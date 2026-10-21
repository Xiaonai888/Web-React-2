const DATABASE_NAME = 'shadow_story_media_drafts'
const DATABASE_VERSION = 1
const STORE_NAME = 'drafts'
let databasePromise = null
let activeDatabase = null

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

export async function saveStoryMediaDraftRecord(key, payload) {
  const id = String(key || '').trim()
  if (!id) throw new Error('Story media draft key is required')
  try {
    await execute('readwrite', (store) => {
      store.put({ ...payload, key: id, updatedAt: Date.now() })
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

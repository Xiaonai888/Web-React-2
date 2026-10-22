const DB_NAME = 'shadow_author_drafts'
const DB_VERSION = 1
const STORE_NAME = 'episode_drafts'
const FALLBACK_PREFIX = 'shadow_episode_draft:'

function openDraftDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)
    let blocked = false

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => {
      const database = request.result
      if (blocked) {
        database.close()
        return
      }
      database.onversionchange = () => database.close()
      resolve(database)
    }
    request.onerror = () => reject(request.error || new Error('Could not open local draft storage'))
    request.onblocked = () => {
      blocked = true
      reject(new Error('Close other Shadow tabs and retry local draft storage'))
    }
  })
}

async function runDraftTransaction(mode, action) {
  const database = await openDraftDatabase()
  return new Promise((resolve, reject) => {
    let settled = false
    let result
    const finish = (error) => {
      if (settled) return
      settled = true
      database.close()
      if (error) reject(error)
      else resolve(result)
    }

    try {
      const transaction = database.transaction(STORE_NAME, mode)
      transaction.oncomplete = () => finish(null)
      transaction.onabort = () => finish(transaction.error || new Error('Local draft operation failed'))
      transaction.onerror = () => {}
      const request = action(transaction.objectStore(STORE_NAME))
      request.onsuccess = () => { result = request.result }
    } catch (error) {
      finish(error)
    }
  })
}

function fallbackKey(key) {
  return `${FALLBACK_PREFIX}${key}`
}

function saveFallbackDraft(key, value) {
  localStorage.setItem(fallbackKey(key), JSON.stringify(value))
  return value
}

function loadFallbackDraft(key) {
  const raw = localStorage.getItem(fallbackKey(key))
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(fallbackKey(key))
    return null
  }
}

function deleteFallbackDraft(key) {
  localStorage.removeItem(fallbackKey(key))
}

export function getEpisodeLocalDraftKey(storyId, episodeId = '') {
  const safeStoryId = String(storyId || '').trim()
  const safeEpisodeId = String(episodeId || '').trim() || 'new'
  return `${safeStoryId}:${safeEpisodeId}`
}

export async function saveEpisodeLocalDraft(key, draft) {
  const value = {
    ...draft,
    key,
    updatedAt: Date.now(),
  }

  try {
    await runDraftTransaction('readwrite', (store) => store.put(value))
    deleteFallbackDraft(key)
    return value
  } catch {
    return saveFallbackDraft(key, value)
  }
}

export async function loadEpisodeLocalDraft(key) {
  try {
    const value = await runDraftTransaction('readonly', (store) => store.get(key))
    const fallback = loadFallbackDraft(key)
    return fallback && Number(fallback.updatedAt || 0) > Number(value?.updatedAt || 0)
      ? fallback
      : value || fallback
  } catch {
    return loadFallbackDraft(key)
  }
}

export async function deleteEpisodeLocalDraft(key) {
  try {
    await runDraftTransaction('readwrite', (store) => store.delete(key))
  } catch {
  }

  deleteFallbackDraft(key)
}

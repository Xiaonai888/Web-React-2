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

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open local draft storage'))
  })
}

function runDraftTransaction(mode, action) {
  return openDraftDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode)
        const store = transaction.objectStore(STORE_NAME)
        const request = action(store)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error || new Error('Local draft operation failed'))
        transaction.oncomplete = () => database.close()
        transaction.onerror = () => database.close()
        transaction.onabort = () => database.close()
      })
  )
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
    return value || loadFallbackDraft(key)
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

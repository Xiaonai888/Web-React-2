const DB_NAME = 'shadow_offline_downloads_v1'
const DB_VERSION = 1
const EPISODES = 'episodes'
const METADATA = 'metadata'
const STORY_TYPES = new Set(['novel', 'chat_story', 'manga'])
const ACCESS_TYPES = new Set(['free', 'permanent', 'temporary'])

let databasePromise = null

function requiredId(value, field) {
  const id = String(value ?? '').trim()
  if (!id) throw new Error(`${field} is required`)
  return id
}

function episodeKey(accountId, storyId, episodeId) {
  return JSON.stringify([accountId, storyId, episodeId])
}

function parseExpiry(value, access) {
  if (access !== 'temporary') return null
  const expiresAt = typeof value === 'number' ? value : Date.parse(value)
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw new Error('A future expiry is required for temporary offline access')
  }
  return expiresAt
}

function isExpired(metadata) {
  return metadata?.expiresAt != null && Date.now() >= metadata.expiresAt
}

function buildSummary(payload = {}) {
  const story = payload?.story || {}
  const episode = payload?.episode || {}

  return {
    storyTitle: String(story.title || ''),
    storyCover: String(
      story.cover_url ||
      story.image_url ||
      story.thumbnail_url ||
      ''
    ),
    storyGenre: String(story.main_genre || ''),
    storyStatus: String(story.status || ''),
    episodeTitle: String(episode.title || ''),
    episodeNumber: Number(episode.episode_number || 0),
  }
}

function needsSummary(metadata) {
  return !(
    metadata &&
    Object.prototype.hasOwnProperty.call(metadata, 'storyTitle') &&
    Object.prototype.hasOwnProperty.call(metadata, 'episodeTitle')
  )
}

async function requestPersistentStorage() {
  try {
    if (!navigator.storage?.persist) return false
    if (navigator.storage.persisted && await navigator.storage.persisted()) return true
    return Boolean(await navigator.storage.persist())
  } catch {
    return false
  }
}

function openDatabase() {
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      databasePromise = null
      reject(new Error('Offline storage is unavailable in this browser'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(EPISODES)) {
        db.createObjectStore(EPISODES, { keyPath: 'key' })
      }

      if (!db.objectStoreNames.contains(METADATA)) {
        const store = db.createObjectStore(METADATA, { keyPath: 'key' })
        store.createIndex('accountId', 'accountId', { unique: false })
        store.createIndex('accountStory', ['accountId', 'storyId'], { unique: false })
      }
    }

    request.onsuccess = () => {
      const db = request.result

      db.onversionchange = () => {
        db.close()
        databasePromise = null
      }

      resolve(db)
    }

    request.onerror = () => {
      databasePromise = null
      reject(request.error || new Error('Unable to open offline storage'))
    }

    request.onblocked = () => {
      databasePromise = null
      reject(new Error('Offline storage is blocked by another open tab'))
    }
  })

  return databasePromise
}

async function transaction(storeNames, mode, operation) {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    let result
    let settled = false
    let tx

    const finish = (error) => {
      if (settled) return
      settled = true

      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }

    try {
      tx = db.transaction(storeNames, mode)
      const request = operation(tx)

      if (request) {
        request.onsuccess = () => {
          result = request.result
        }

        request.onerror = () => {
          finish(
            request.error ||
            new Error('Offline storage request failed')
          )
        }
      }

      tx.oncomplete = () => finish()
      tx.onerror = () => finish(
        tx.error ||
        new Error('Offline storage transaction failed')
      )
      tx.onabort = () => finish(
        tx.error ||
        new Error('Offline storage transaction was aborted')
      )
    } catch (error) {
      try {
        tx?.abort()
      } catch {
      }

      finish(error)
    }
  })
}

async function updateMetadataSummary(metadata, payload) {
  if (!metadata || !payload || !needsSummary(metadata)) {
    return metadata
  }

  const updated = {
    ...metadata,
    ...buildSummary(payload),
  }

  await transaction(
    [METADATA],
    'readwrite',
    (tx) => tx.objectStore(METADATA).put(updated)
  )

  return updated
}

export async function saveOfflineEpisode({
  accountId,
  storyId,
  episodeId,
  storyType,
  payload,
  access,
  expiresAt,
  assets = [],
}) {
  accountId = requiredId(accountId, 'accountId')
  storyId = requiredId(storyId, 'storyId')
  episodeId = requiredId(episodeId, 'episodeId')

  if (!STORY_TYPES.has(storyType)) {
    throw new Error('Unsupported story type')
  }

  if (!ACCESS_TYPES.has(access)) {
    throw new Error('Offline access must be explicitly authorized')
  }

  if (
    payload?.ok !== true ||
    payload?.locked === true ||
    !payload?.episode ||
    String(payload.episode.id) !== episodeId
  ) {
    throw new Error('A complete, unlocked episode response is required')
  }

  if (
    payload.story?.id != null &&
    String(payload.story.id) !== storyId
  ) {
    throw new Error('Story ID mismatch')
  }

  if (
    !Array.isArray(assets) ||
    assets.some(
      (asset) =>
        !asset?.url ||
        !(asset.blob instanceof Blob) ||
        !asset.blob.size
    )
  ) {
    throw new Error(
      'Offline media assets must contain a URL and a nonempty Blob'
    )
  }

  await requestPersistentStorage()

  const expiry = parseExpiry(expiresAt, access)
  const key = episodeKey(accountId, storyId, episodeId)
  const metadata = {
    key,
    accountId,
    storyId,
    episodeId,
    storyType,
    access,
    expiresAt: expiry,
    savedAt: Date.now(),
    assetCount: assets.length,
    ...buildSummary(payload),
  }

  await transaction(
    [EPISODES, METADATA],
    'readwrite',
    (tx) => {
      tx.objectStore(EPISODES).put({
        key,
        payload,
        assets,
      })
      tx.objectStore(METADATA).put(metadata)
    }
  )

  return metadata
}

export async function loadOfflineEpisode({
  accountId,
  storyId,
  episodeId,
}) {
  accountId = requiredId(accountId, 'accountId')
  storyId = requiredId(storyId, 'storyId')
  episodeId = requiredId(episodeId, 'episodeId')

  const key = episodeKey(accountId, storyId, episodeId)
  let metadata = await transaction(
    [METADATA],
    'readonly',
    (tx) => tx.objectStore(METADATA).get(key)
  )

  if (!metadata) return null

  if (isExpired(metadata)) {
    await deleteOfflineEpisode({
      accountId,
      storyId,
      episodeId,
    })
    return null
  }

  const entry = await transaction(
    [EPISODES],
    'readonly',
    (tx) => tx.objectStore(EPISODES).get(key)
  )

  if (!entry) return null
  if (isExpired(metadata)) return null

  if (needsSummary(metadata)) {
    metadata = await updateMetadataSummary(
      metadata,
      entry.payload
    ).catch(() => ({
      ...metadata,
      ...buildSummary(entry.payload),
    }))
  }

  return {
    ...metadata,
    payload: entry.payload,
    assets: entry.assets,
  }
}

export async function listOfflineEpisodes({
  accountId,
  storyId,
} = {}) {
  accountId = requiredId(accountId, 'accountId')

  const all =
    storyId == null
      ? await transaction(
          [METADATA],
          'readonly',
          (tx) =>
            tx
              .objectStore(METADATA)
              .index('accountId')
              .getAll(accountId)
        )
      : await transaction(
          [METADATA],
          'readonly',
          (tx) =>
            tx
              .objectStore(METADATA)
              .index('accountStory')
              .getAll([
                accountId,
                requiredId(storyId, 'storyId'),
              ])
        )

  const expired = all.filter(isExpired)

  if (expired.length) {
    await Promise.all(
      expired.map(
        ({ storyId: id, episodeId }) =>
          deleteOfflineEpisode({
            accountId,
            storyId: id,
            episodeId,
          })
      )
    )
  }

  return all
    .filter((item) => !isExpired(item))
    .sort(
      (first, second) =>
        Number(second.savedAt || 0) -
        Number(first.savedAt || 0)
    )
}

export async function deleteOfflineEpisode({
  accountId,
  storyId,
  episodeId,
}) {
  const key = episodeKey(
    requiredId(accountId, 'accountId'),
    requiredId(storyId, 'storyId'),
    requiredId(episodeId, 'episodeId')
  )

  await transaction(
    [EPISODES, METADATA],
    'readwrite',
    (tx) => {
      tx.objectStore(EPISODES).delete(key)
      tx.objectStore(METADATA).delete(key)
    }
  )
}

export async function deleteOfflineStory({
  accountId,
  storyId,
}) {
  const episodes = await listOfflineEpisodes({
    accountId,
    storyId,
  })

  await Promise.all(
    episodes.map(
      ({ episodeId }) =>
        deleteOfflineEpisode({
          accountId,
          storyId,
          episodeId,
        })
    )
  )
}

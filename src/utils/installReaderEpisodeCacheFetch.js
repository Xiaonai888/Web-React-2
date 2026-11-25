import { getActiveReaderToken, getReaderSessionIdentity } from './readerActiveAccount'
import {
  deleteReaderEpisodeCache,
  loadReaderEpisodeCache,
  saveReaderEpisodeCache,
} from './readerEpisodeCache'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const API_ORIGIN = new URL(
  API_BASE_URL,
  window.location.origin
).origin

const MANIFEST_TTL_MS = 10 * 60 * 1000
const MANIFEST_MAX_STORIES = 10
const MANIFEST_PREFIX =
  'shadow_reader_episode_manifest_v4:'

const STORY_TYPES = [
  'novel',
  'chat_story',
  'manga',
]

const manifestMemory = new Map()
const manifestRequests = new Map()
const detailRequests = new Map()

function normalizeText(value) {
  return String(value ?? '').trim()
}

function isReaderSurface() {
  return /^\/story\/[^/]+(?:\/episode\/[^/]+)?\/?$/.test(
    window.location.pathname
  )
}

function requestMethod(input, init = {}) {
  return String(
    init.method ||
      (input instanceof Request
        ? input.method
        : 'GET') ||
      'GET'
  ).toUpperCase()
}

function requestUrl(input) {
  return input instanceof Request
    ? input.url
    : String(input)
}

function decodePathPart(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function parseReaderApiUrl(url) {
  if (url.origin !== API_ORIGIN) {
    return null
  }

  const manifestMatch =
    url.pathname.match(
      /^\/api\/public\/stories\/([^/]+)\/episodes\/?$/
    )

  if (manifestMatch) {
    return {
      type: 'manifest',
      storyId: decodePathPart(
        manifestMatch[1]
      ),
      episodeId: '',
    }
  }

  const detailMatch =
    url.pathname.match(
      /^\/api\/public\/stories\/([^/]+)\/episodes\/([^/]+)\/?$/
    )

  if (!detailMatch) {
    return null
  }

  return {
    type: 'detail',
    storyId: decodePathPart(detailMatch[1]),
    episodeId: decodePathPart(detailMatch[2]),
  }
}

function getRequestHeaders(input, init = {}) {
  const headers = new Headers(
    input instanceof Request
      ? input.headers
      : undefined
  )

  new Headers(init.headers || {}).forEach(
    (value, key) => {
      headers.set(key, value)
    }
  )

  return headers
}

function getRequestReaderToken(input, init = {}) {
  const authorization =
    getRequestHeaders(input, init).get(
      'Authorization'
    ) || ''

  if (authorization.startsWith('Bearer ')) {
    return authorization.slice(7).trim()
  }

    return getActiveReaderToken()

function tokenFingerprint(token) {
  const value = normalizeText(token)
  if (!value) return ''

  let hash = 2166136261

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(
    hash >>> 0
  ).toString(36)}`
}

function getPrivateScope(input, init = {}) {
  return tokenFingerprint(
    getRequestReaderToken(input, init)
  )
}

function manifestStorageKey(manifestKey) {
  return `${MANIFEST_PREFIX}${encodeURIComponent(manifestKey)}`
}

function getManifestKey(storyId, token) {
  return JSON.stringify([getReaderSessionIdentity(token) || 'anon', normalizeText(storyId)])
}

export function isReaderEpisodeManifestFresh(data, savedAt, now = Date.now()) {
  const age = now - Number(savedAt || 0)
  if (!Number.isFinite(age) || age < 0 || age > MANIFEST_TTL_MS || !savedAt || data?.ok !== true || data.story_is_adult !== false || !Array.isArray(data.episodes)) return false
  if (data.episodes.some((item) => !item || item.is_adult)) return false
  const scheduledAt = data.upcoming_episode?.scheduled_at
  if (scheduledAt && (!Number.isFinite(Date.parse(scheduledAt)) || Date.parse(scheduledAt) <= now)) return false
  return !data.episodes.some((item) => {
    if (!item.unlock_expires_at) return false
    const expiresAt = Date.parse(item.unlock_expires_at)
    return !Number.isFinite(expiresAt) || expiresAt <= now
  })
}

function isFreshManifest(entry) {
  return isReaderEpisodeManifestFresh(entry?.data, entry?.savedAt)
}

function rememberManifest(manifestKey, entry) {
  manifestMemory.delete(manifestKey)
  manifestMemory.set(manifestKey, entry)
  while (manifestMemory.size > MANIFEST_MAX_STORIES) {
    manifestMemory.delete(manifestMemory.keys().next().value)
  }
}

function readSessionManifest(manifestKey) {
  const key = manifestStorageKey(manifestKey)
  try {
    const entry = JSON.parse(sessionStorage.getItem(key) || 'null')
    if (!isFreshManifest(entry)) {
      sessionStorage.removeItem(key)
      return null
    }
    rememberManifest(manifestKey, entry)
    return entry
  } catch {
    return null
  }
}

function pruneSessionManifests() {
  try {
    const entries = []
    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index)
      if (!key) continue
      if (key.startsWith('shadow_reader_episode_manifest_v2:')) {
        sessionStorage.removeItem(key)
        continue
      }
      if (!key.startsWith(MANIFEST_PREFIX)) continue
      try {
        const entry = JSON.parse(sessionStorage.getItem(key) || 'null')
        if (isFreshManifest(entry)) entries.push({ key, savedAt: entry.savedAt })
        else sessionStorage.removeItem(key)
      } catch {
        sessionStorage.removeItem(key)
      }
    }
    entries.sort((a, b) => b.savedAt - a.savedAt)
      .slice(MANIFEST_MAX_STORIES)
      .forEach(({ key }) => sessionStorage.removeItem(key))
  } catch {}
}

function saveManifest(manifestKey, data) {
  const entry = { data, savedAt: Date.now() }
  if (!isFreshManifest(entry)) return
  rememberManifest(manifestKey, entry)
  try {
    sessionStorage.setItem(manifestStorageKey(manifestKey), JSON.stringify(entry))
    pruneSessionManifests()
  } catch {}
}

function loadCachedManifest(manifestKey) {
  const entry = manifestMemory.get(manifestKey)
  if (isFreshManifest(entry)) {
    rememberManifest(manifestKey, entry)
    return entry
  }
  manifestMemory.delete(manifestKey)
  return readSessionManifest(manifestKey)
}

export function invalidateReaderEpisodeManifest(storyId) {
  const target = normalizeText(storyId)
  if (!target) return
  const matches = (key) => {
    try { return JSON.parse(key)?.[1] === target } catch { return false }
  }
  for (const key of manifestMemory.keys()) {
    if (matches(key)) manifestMemory.delete(key)
  }
  for (const key of manifestRequests.keys()) {
    if (matches(key)) manifestRequests.delete(key)
  }
  try {
    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index)
      if (key?.startsWith(MANIFEST_PREFIX) && matches(decodeURIComponent(key.slice(MANIFEST_PREFIX.length)))) {
        sessionStorage.removeItem(key)
      }
    }
  } catch {}
}

function jsonResponse(data, { status = 200, cacheState = 'HIT' } = {}) {
  return new Response(JSON.stringify(data ?? {}), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Shadow-Reader-Cache': cacheState,
    },
  })
}

async function fetchManifest(apiFetch, storyId, input = null, init = {}) {
  const safeStoryId = normalizeText(storyId)
  const token = getRequestReaderToken(input, init)
  const manifestKey = getManifestKey(safeStoryId, token)
  const cached = loadCachedManifest(manifestKey)
  if (cached) return { ok: true, data: cached.data, status: 200, source: 'HIT' }
  const existing = manifestRequests.get(manifestKey)
  if (existing) return existing

  const request = (async () => {
    try {
      const response = await apiFetch(
        `${API_BASE_URL}/api/public/stories/${encodeURIComponent(safeStoryId)}/episodes`,
        { headers: getRequestHeaders(input, init), cache: 'no-store' }
      )
      const data = await response.clone().json().catch(() => ({}))
      if (!response.ok || data.ok !== true) {
        return { ok: false, data, status: response.status, source: 'NETWORK' }
      }
      if (manifestRequests.get(manifestKey) === request && getManifestKey(safeStoryId, getActiveReaderToken()) === manifestKey) {
        saveManifest(manifestKey, data)
      }
      return { ok: true, data, status: response.status, source: 'NETWORK' }
    } catch (error) {
      return { ok: false, data: { ok: false, message: error?.message || 'Failed to load episodes' }, status: 503, source: 'ERROR' }
    }
  })()

  manifestRequests.set(manifestKey, request)
  try {
    return await request
  } finally {
    if (manifestRequests.get(manifestKey) === request) manifestRequests.delete(manifestKey)
  }
}



function findManifestEpisode(
  manifest,
  episodeId
) {
  const targetId =
    normalizeText(episodeId)

  return (
    (Array.isArray(
      manifest?.episodes
    )
      ? manifest.episodes
      : []
    ).find(
      (episode) =>
        normalizeText(episode?.id) ===
        targetId
    ) || null
  )
}

async function loadEpisodeFromCache({
  storyId,
  episodeId,
  expectedUpdatedAt,
  privateAccess,
  scope,
}) {
  if (
    privateAccess &&
    !normalizeText(scope)
  ) {
    return null
  }

  for (const storyType of STORY_TYPES) {
    const data =
      await loadReaderEpisodeCache({
        storyType,
        storyId,
        episodeId,
        expectedUpdatedAt,
        privateAccess,
        scope:
          privateAccess
            ? scope
            : 'public',
      })

    if (!data) continue

    const cachedPrivate =
      data?.cache_access
        ?.private_access === true

    if (
      privateAccess !==
      cachedPrivate
    ) {
      continue
    }

    return data
  }

  return null
}

async function deleteEpisodeVariants({
  storyId,
  episodeId,
  privateScope,
  includePublic = false,
}) {
  const jobs = []

  for (const storyType of STORY_TYPES) {
    if (privateScope) {
      jobs.push(
        deleteReaderEpisodeCache({
          storyType,
          storyId,
          episodeId,
          privateAccess: true,
          scope: privateScope,
        })
      )
    }

    if (includePublic) {
      jobs.push(
        deleteReaderEpisodeCache({
          storyType,
          storyId,
          episodeId,
          privateAccess: false,
          scope: 'public',
        })
      )
    }
  }

  await Promise.all(jobs)
}

async function fetchAndCacheDetail({
  apiFetch,
  input,
  init,
  storyId,
  episodeId,
  manifestEpisode,
  privateScope,
}) {
  const response = await apiFetch(
    input,
    init
  )

  const data = await response
    .clone()
    .json()
    .catch(() => ({}))

  if (
    response.status === 423 ||
    data.code === 'EPISODE_LOCKED'
  ) {
    await deleteEpisodeVariants({
      storyId,
      episodeId,
      privateScope,
    })

    return response
  }

  if (
    response.status === 404
  ) {
    await deleteEpisodeVariants({
      storyId,
      episodeId,
      privateScope,
      includePublic: true,
    })

    return response
  }

  if (
    !response.ok ||
    data.ok === false ||
    data.locked === true ||
    !data.episode
  ) {
    return response
  }

  if (data.story?.is_adult || data.episode?.is_adult) {
    return response
  }

  const cacheAccess =
    data.cache_access

  if (
    !cacheAccess ||
    typeof cacheAccess.private_access !==
      'boolean'
  ) {
    return response
  }

  const privateAccess =
    cacheAccess.private_access === true

  if (
    privateAccess &&
    !privateScope
  ) {
    return response
  }

  await saveReaderEpisodeCache({
    storyType:
      data.story?.story_type ||
      'novel',
    storyId,
    episodeId,
    data,
    updatedAt:
      data.episode?.updated_at ||
      manifestEpisode?.updated_at ||
      null,
    privateAccess,
    accessExpiresAt:
      cacheAccess.expires_at || null,
    isLocked: false,
    scope:
      privateAccess
        ? privateScope
        : 'public',
  })

  return response
}

export function installReaderEpisodeCacheFetch() {
  if (
    window
      .__shadowReaderEpisodeCacheFetchInstalled
  ) {
    return
  }

  window
    .__shadowReaderEpisodeCacheFetchInstalled =
    true

  const apiFetch =
    window.fetch.bind(window)

  window.fetch = async (
    input,
    init = {}
  ) => {
    if (
      !isReaderSurface() ||
      requestMethod(input, init) !==
        'GET'
    ) {
      return apiFetch(input, init)
    }

    let url

    try {
      url = new URL(
        requestUrl(input),
        window.location.origin
      )
    } catch {
      return apiFetch(input, init)
    }

    const route =
      parseReaderApiUrl(url)

    if (!route) {
      return apiFetch(input, init)
    }

        const token = getRequestReaderToken(input, init)
    if (token !== getActiveReaderToken()) return apiFetch(input, init)
    if (token) {
      try {
        const claims = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
        if (!getReaderSessionIdentity(token) || !Number.isFinite(claims.exp) || claims.exp * 1000 <= Date.now()) return apiFetch(input, init)
      } catch {
        return apiFetch(input, init)
      }
    }

    if (route.type === 'manifest') {
      const result =
        await fetchManifest(
          apiFetch,
          route.storyId,
          input,
          init
        )

      return jsonResponse(
        result.data,
        {
          status: result.status,
          cacheState:
            result.source === 'HIT'
              ? 'MANIFEST-HIT'
              : 'MANIFEST-NETWORK',
        }
      )
    }

    const manifestResult =
      await fetchManifest(
        apiFetch,
        route.storyId,
        input,
        init
      )

    const manifestEpisode =
      manifestResult.ok
        ? findManifestEpisode(
            manifestResult.data,
            route.episodeId
          )
        : null

    if (
      manifestResult.ok &&
      !manifestEpisode
    ) {
      await deleteEpisodeVariants({
        storyId: route.storyId,
        episodeId:
          route.episodeId,
        privateScope:
          getPrivateScope(
            input,
            init
          ),
        includePublic: true,
      })

      return apiFetch(input, init)
    }

    if (
      manifestResult.data?.story_is_adult !== false ||
      manifestEpisode?.is_adult === true
    ) {
      return apiFetch(input, init)
    }

    const privateScope =
      getPrivateScope(input, init)

    if (manifestEpisode) {
      const isPublic =
        manifestEpisode.is_locked === false &&
        manifestEpisode.is_free_published === true

      const cached =
        await loadEpisodeFromCache({
          storyId: route.storyId,
          episodeId:
            route.episodeId,
          expectedUpdatedAt:
            manifestEpisode.updated_at,
          privateAccess: !isPublic,
          scope:
            isPublic
              ? 'public'
              : privateScope,
        })

      if (cached && manifestEpisode.is_locked === false) {
        return jsonResponse(
          cached,
          {
            cacheState:
              isPublic
                ? 'EPISODE-PUBLIC-HIT'
                : 'EPISODE-PRIVATE-HIT',
          }
        )
      }
    }

    const requestKey = [
      privateScope || 'anon',
      route.storyId,
      route.episodeId,
    ].join(':')

    if (
      detailRequests.has(
        requestKey
      )
    ) {
      const response =
        await detailRequests.get(
          requestKey
        )

      return response.clone()
    }

    const request =
      fetchAndCacheDetail({
        apiFetch,
        input,
        init,
        storyId: route.storyId,
        episodeId:
          route.episodeId,
        manifestEpisode,
        privateScope,
      })

    detailRequests.set(
      requestKey,
      request
    )

    try {
      const response =
        await request

      return response.clone()
    } finally {
      detailRequests.delete(
        requestKey
      )
    }
  }
}

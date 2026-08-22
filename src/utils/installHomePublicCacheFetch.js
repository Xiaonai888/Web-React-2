import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from './homeDataCache'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const API_ORIGIN = new URL(
  API_BASE_URL,
  window.location.origin
).origin

const SIX_HOURS_MS = 6 * 60 * 60 * 1000
const TWO_HOURS_MS = 2 * 60 * 60 * 1000
const ONE_HOUR_MS = 60 * 60 * 1000
const THIRTY_MINUTES_MS = 30 * 60 * 1000
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000

const inflightRequests = new Map()

function isHomeSurface() {
  return window.location.pathname === '/'
}

function requestMethod(input, init = {}) {
  return String(
    init.method ||
      (input instanceof Request ? input.method : 'GET') ||
      'GET'
  ).toUpperCase()
}

function requestUrl(input) {
  return input instanceof Request
    ? input.url
    : String(input)
}

function tokenFingerprint() {
  const token =
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''

  if (!token) return 'anon'

  let hash = 2166136261

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(hash >>> 0).toString(36)}`
}

function stableSearchParams(url) {
  return Object.fromEntries(
    [...url.searchParams.entries()].sort(
      ([left], [right]) => left.localeCompare(right)
    )
  )
}

function storyCacheAge(url) {
  const sort = String(
    url.searchParams.get('sort') || 'latest'
  )
    .trim()
    .toLowerCase()

  if (
    [
      'popular',
      'trending',
      'weekly_top',
      'weekly',
      'views',
      'likes',
      'comments',
    ].includes(sort)
  ) {
    return FIFTEEN_MINUTES_MS
  }

  if (
    ['episode_updated', 'weekly_updates'].includes(sort)
  ) {
    return THIRTY_MINUTES_MS
  }

  if (
    [
      'discover_more',
      'discover-more',
      'discover',
      'hidden_gems',
      'hidden-gems',
    ].includes(sort)
  ) {
    return TWO_HOURS_MS
  }

  return ONE_HOUR_MS
}

function getCacheRule(url) {
  if (url.origin !== API_ORIGIN) return null

  if (url.pathname === '/api/slides') {
    if (
      url.searchParams.get('include_inactive') === 'true' ||
      url.searchParams.get('includeInactive') === 'true'
    ) {
      return null
    }

    const sectionKey =
      url.searchParams.get('section_key') ||
      'home_top_slider'

    if (sectionKey === 'home_top_slider') {
      return null
    }

    return {
      section: 'slides',
      language: 'all',
      scope: 'public',
      maxAgeMs: SIX_HOURS_MS,
    }
  }

  if (url.pathname === '/api/genres/featured-tabs') {
    if (
      url.searchParams.get('include_inactive') === 'true' ||
      url.searchParams.get('includeInactive') === 'true'
    ) {
      return null
    }

    return {
      section: 'genres',
      language: 'all',
      scope: 'public',
      maxAgeMs: SIX_HOURS_MS,
    }
  }

  if (url.pathname === '/api/public/stories') {
    return {
      section: 'stories',
      language:
        url.searchParams.get('language') || 'all',
      scope: tokenFingerprint(),
      maxAgeMs: storyCacheAge(url),
    }
  }

  return null
}

function cachedJsonResponse(data, state = 'HIT') {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Shadow-Home-Cache': state,
    },
  })
}

function hasCachedData(cached) {
  return Boolean(
    cached &&
      Object.prototype.hasOwnProperty.call(cached, 'data')
  )
}

function deleteLegacyCacheDatabase() {
  try {
    if (typeof indexedDB === 'undefined') return
    indexedDB.deleteDatabase('shadow-public-content-cache')
  } catch {
    return
  }
}

export function installHomePublicCacheFetch() {
  if (window.__shadowHomePublicCacheFetchInstalled) return

  window.__shadowHomePublicCacheFetchInstalled = true
  deleteLegacyCacheDatabase()

  const apiFetch = window.fetch.bind(window)

  window.fetch = async (input, init = {}) => {
    if (!isHomeSurface()) {
      return apiFetch(input, init)
    }

    if (requestMethod(input, init) !== 'GET') {
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

    const rule = getCacheRule(url)

    if (!rule) {
      return apiFetch(input, init)
    }

    const cacheKey = getHomeCacheKey({
      section: rule.section,
      language: rule.language,
      scope: rule.scope,
      params: {
        path: url.pathname,
        ...stableSearchParams(url),
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: rule.maxAgeMs,
      allowExpired: true,
    })

    if (cached?.isFresh && hasCachedData(cached)) {
      return cachedJsonResponse(cached.data)
    }

    if (inflightRequests.has(cacheKey)) {
      try {
        const response = await inflightRequests.get(cacheKey)
        return response.clone()
      } catch (error) {
        if (hasCachedData(cached)) {
          return cachedJsonResponse(cached.data, 'STALE')
        }
        throw error
      }
    }

    const requestPromise = (async () => {
      const response = await apiFetch(input, init)

      if (!response.ok) {
        if (hasCachedData(cached)) {
          return cachedJsonResponse(cached.data, 'STALE')
        }

        return response
      }

      const data = await response
        .clone()
        .json()
        .catch(() => null)

      if (
        data !== null &&
        data?.ok !== false
      ) {
        await saveHomeCache(cacheKey, data, {
          maxAgeMs: rule.maxAgeMs,
        })
      }

      return response
    })()

    inflightRequests.set(cacheKey, requestPromise)

    try {
      const response = await requestPromise
      return response.clone()
    } catch (error) {
      if (hasCachedData(cached)) {
        return cachedJsonResponse(cached.data, 'STALE')
      }

      throw error
    } finally {
      inflightRequests.delete(cacheKey)
    }
  }
}

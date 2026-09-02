const CACHE_KEY = 'shadow_my_author_page_cache_v1'
const CACHE_TTL_MS = 30 * 60 * 1000

function getUserKey(token) {
  const value = String(token || '').trim()

  if (!value) return ''

  try {
    const payloadPart = value.split('.')[1] || ''
    const normalized = payloadPart
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    )
    const payload = JSON.parse(atob(padded))

    return String(
      payload.user_id ||
      payload.sub ||
      ''
    ).trim()
  } catch {
    let hash = 2166136261

    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index)
      hash = Math.imul(hash, 16777619)
    }

    return `token-${(hash >>> 0).toString(16)}`
  }
}

function readCache(token) {
  const userKey = getUserKey(token)
  if (!userKey) return null

  try {
    const stored = JSON.parse(
      localStorage.getItem(CACHE_KEY) || 'null'
    )

    if (
      !stored ||
      stored.userKey !== userKey ||
      !stored.cachedAt ||
      !stored.data
    ) {
      return null
    }

    if (
      Date.now() - Number(stored.cachedAt) >=
      CACHE_TTL_MS
    ) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return stored.data
  } catch {
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

function writeCache(token, data) {
  const userKey = getUserKey(token)
  if (!userKey || !data) return

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        userKey,
        cachedAt: Date.now(),
        data,
      })
    )
  } catch {
    localStorage.removeItem(CACHE_KEY)
  }
}

export function invalidateMyAuthorPageClientCache() {
  localStorage.removeItem(CACHE_KEY)
}

export async function fetchMyAuthorPageCached({
  apiBaseUrl,
  token,
  signal,
  force = false,
}) {
  if (!token) {
    throw new Error('Authentication required')
  }

  if (!force) {
    const cached = readCache(token)

    if (cached) {
      return cached
    }
  }

  const response = await fetch(
    `${apiBaseUrl}/api/authors/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
      signal,
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok || data.ok === false) {
    const error = new Error(
      data.message || 'Failed to load author page'
    )
    error.statusCode = response.status
    throw error
  }

  writeCache(token, data)

  if (data.author_page) {
    localStorage.setItem(
      'shadow_author_page',
      JSON.stringify(data.author_page)
    )
  }

  return data
}

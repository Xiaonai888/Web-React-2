const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CACHE_TTL_MS = 60 * 1000
const entries = new Map()

function getEntry(token) {
  const key = String(token || '').trim()

  if (!key) {
    return null
  }

  let entry = entries.get(key)

  if (!entry) {
    entry = {
      data: null,
      fetchedAt: 0,
      request: null,
      controller: null,
      consumers: 0,
    }

    entries.set(key, entry)
  }

  return entry
}

function startRequest(token, entry) {
  const controller = new AbortController()

  const request = fetch(
    `${API_BASE_URL}/api/authors/me/49-day-event`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
      cache: 'no-store',
    }
  )
    .then(async (response) => {
      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Failed to load event'
        )
      }

      entry.data = data.event || null
      entry.fetchedAt = Date.now()

      return entry.data
    })
    .finally(() => {
      if (entry.request === request) {
        entry.request = null
        entry.controller = null
      }
    })

  entry.request = request
  entry.controller = controller

  return request
}

export function requestAuthor49DayEvent(
  token,
  { force = false } = {}
) {
  const normalizedToken = String(token || '').trim()
  const entry = getEntry(normalizedToken)

  if (!entry) {
    return {
      promise: Promise.resolve(null),
      release() {},
    }
  }

  entry.consumers += 1

  const fresh =
    entry.fetchedAt &&
    Date.now() - entry.fetchedAt < CACHE_TTL_MS

  const promise =
    !force && fresh
      ? Promise.resolve(entry.data)
      : entry.request ||
        startRequest(normalizedToken, entry)

  let released = false

  return {
    promise,
    release() {
      if (released) return
      released = true

      entry.consumers = Math.max(
        0,
        entry.consumers - 1
      )

      if (
        entry.consumers === 0 &&
        entry.request &&
        entry.controller
      ) {
        const pendingRequest = entry.request
        entry.controller.abort()

        if (entry.request === pendingRequest) {
          entry.request = null
          entry.controller = null
        }
      }
    },
  }
}

export function clearAuthor49DayEventCache(token) {
  const key = String(token || '').trim()
  if (!key) return

  const entry = entries.get(key)

  if (entry?.controller) {
    entry.controller.abort()
  }

  entries.delete(key)
}

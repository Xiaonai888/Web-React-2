const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CACHE_TTL_MS = 5 * 60 * 1000

const entry = {
  data: null,
  fetchedAt: 0,
  request: null,
  controller: null,
  consumers: 0,
}

function startRequest() {
  const controller = new AbortController()

  const request = fetch(
    `${API_BASE_URL}/api/unlocks/events/writer-wednesday`,
    {
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

export function requestWriterWednesdayEvent({
  force = false,
} = {}) {
  entry.consumers += 1

  const fresh =
    entry.fetchedAt &&
    Date.now() - entry.fetchedAt < CACHE_TTL_MS

  const promise =
    !force && fresh
      ? Promise.resolve(entry.data)
      : entry.request || startRequest()

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

export function clearWriterWednesdayEventCache() {
  if (entry.controller) {
    entry.controller.abort()
  }

  entry.data = null
  entry.fetchedAt = 0
  entry.request = null
  entry.controller = null
  entry.consumers = 0
}

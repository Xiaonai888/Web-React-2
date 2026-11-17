const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SUGGESTION_CACHE_TTL_MS = 30 * 1000
const SUGGESTION_CACHE_LIMIT = 32
const suggestionCache = new Map()
const pendingSuggestions = new Map()
let activeSessionToken = ''

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function prepareSession(token) {
  if (activeSessionToken === token) return
  for (const entry of pendingSuggestions.values()) {
    entry.controller.abort()
  }
  pendingSuggestions.clear()
  suggestionCache.clear()
  activeSessionToken = token
}

function getCachedSuggestions(key) {
  const entry = suggestionCache.get(key)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    suggestionCache.delete(key)
    return null
  }
  suggestionCache.delete(key)
  suggestionCache.set(key, entry)
  return entry.items
}

function cacheSuggestions(key, items) {
  suggestionCache.delete(key)
  suggestionCache.set(key, {
    items,
    expiresAt: Date.now() + SUGGESTION_CACHE_TTL_MS,
  })
  while (suggestionCache.size > SUGGESTION_CACHE_LIMIT) {
    suggestionCache.delete(suggestionCache.keys().next().value)
  }
}

function waitForSuggestions(entry, signal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Request aborted', 'AbortError'))
  }

  entry.waiters += 1

  return new Promise((resolve, reject) => {
    let finished = false

    const complete = (error, result) => {
      if (finished) return
      finished = true
      signal?.removeEventListener('abort', onAbort)
      entry.waiters -= 1
      if (error) reject(error)
      else resolve(result)
    }

    const onAbort = () => {
      complete(new DOMException('Request aborted', 'AbortError'))
      if (!entry.settled && entry.waiters === 0) {
        if (pendingSuggestions.get(entry.key) === entry) {
          pendingSuggestions.delete(entry.key)
        }
        entry.controller.abort()
      }
    }

    signal?.addEventListener('abort', onAbort, { once: true })
    if (signal?.aborted) {
      onAbort()
      return
    }

    entry.promise.then(
      (items) => complete(null, items),
      (error) => complete(error)
    )
  })
}

export async function fetchAuthorHashtagSuggestions(
  prefix = '',
  { limit = 8, signal } = {}
) {
  const token = getReaderToken()
  prepareSession(token)
  if (!token) return []
  if (signal?.aborted) {
    throw new DOMException('Request aborted', 'AbortError')
  }

  const params = new URLSearchParams({
    q: String(prefix || '')
      .replace(/^#+/, '')
      .trim()
      .normalize('NFC')
      .toLowerCase(),
    limit: String(Math.min(10, Math.max(1, Number(limit) || 8))),
  })
  const key = params.toString()
  const cached = getCachedSuggestions(key)
  if (cached !== null) return cached

  let entry = pendingSuggestions.get(key)
  if (!entry) {
    const controller = new AbortController()
    entry = {
      key,
      controller,
      waiters: 0,
      settled: false,
      promise: null,
    }
    const currentEntry = entry
    entry.promise = (async () => {
      const response = await fetch(
        `${API_BASE_URL}/api/authors/hashtags/suggest?${key}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load hashtag suggestions')
      }
      const items = Array.isArray(data.suggestions) ? data.suggestions : []
      if (!controller.signal.aborted && token === activeSessionToken) {
        cacheSuggestions(key, items)
      }
      return items
    })().finally(() => {
      currentEntry.settled = true
      if (pendingSuggestions.get(key) === currentEntry) {
        pendingSuggestions.delete(key)
      }
    })
    pendingSuggestions.set(key, entry)
  }

  return waitForSuggestions(entry, signal)
}

export async function recordAuthorHashtagInterest(
  tag,
  signal = 'hashtag_click'
) {
  const token = getReaderToken()
  if (!token) return false

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/hashtags/interest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tag: String(tag || '').trim(),
          signal,
        }),
        keepalive: true,
      }
    )
    if (!response.ok) return false
    const data = await response.json().catch(() => ({}))
    return data.ok !== false
  } catch {
    return false
  }
}

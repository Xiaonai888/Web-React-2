const SEARCH_CACHE_KEY = 'shadow_discover_search_analytics_v2'
const CLICK_CACHE_KEY = 'shadow_discover_search_click_v2'
const STABLE_DELAY_MS = 1500
const DEDUPE_MS = 30 * 60 * 1000

let pendingTimer = null
let pendingSnapshot = null
let immediateSignature = ''
let activeSignature = ''
let activeSearchPromise = null

function normalizeQuery(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase()
    .replace(/^@+/, '')
    .replace(/\s+/g, ' ')
    .slice(0, 120)
}

function normalizeType(value) {
  return String(value || 'all').trim().toLowerCase()
}

function getSignature(query, type) {
  return `${normalizeType(type)}:${normalizeQuery(query)}`
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : {}

    if (!parsed || typeof parsed !== 'object') return {}

    return parsed
  } catch {
    return {}
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
  }
}

function pruneCache(cache) {
  const now = Date.now()
  const next = {}

  for (const [key, timestamp] of Object.entries(cache || {})) {
    const time = Number(timestamp || 0)

    if (time > 0 && now - time < DEDUPE_MS) {
      next[key] = time
    }
  }

  return next
}

function hasRecent(key, signature) {
  const cache = pruneCache(readCache(key))
  writeCache(key, cache)

  return (
    Number(cache[signature] || 0) > 0 &&
    Date.now() - Number(cache[signature]) < DEDUPE_MS
  )
}

function markRecent(key, signature) {
  const cache = pruneCache(readCache(key))
  cache[signature] = Date.now()
  writeCache(key, cache)
}

function clearRecent(key, signature) {
  const cache = pruneCache(readCache(key))

  if (Object.prototype.hasOwnProperty.call(cache, signature)) {
    delete cache[signature]
    writeCache(key, cache)
  }
}

function clearPendingTimer() {
  if (pendingTimer) {
    window.clearTimeout(pendingTimer)
    pendingTimer = null
  }
}

async function sendSearchAnalytics(snapshot) {
  const signature = getSignature(
    snapshot.query,
    snapshot.type
  )

  clearPendingTimer()
  pendingSnapshot = null
  immediateSignature = ''

  if (
    normalizeQuery(snapshot.query).length < 2 ||
    !snapshot.apiBaseUrl
  ) {
    return false
  }

  activeSignature = signature

  if (hasRecent(SEARCH_CACHE_KEY, signature)) {
    activeSearchPromise = Promise.resolve(true)
    return true
  }

  activeSearchPromise = fetch(
    `${snapshot.apiBaseUrl}/api/discover-search/analytics`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(snapshot.token
          ? {
              Authorization: `Bearer ${snapshot.token}`,
            }
          : {}),
      },
      body: JSON.stringify({
        query: snapshot.query,
        type: snapshot.type,
        result_count: Math.max(
          0,
          Number.parseInt(snapshot.resultCount, 10) || 0
        ),
      }),
      keepalive: true,
    }
  )
    .then(async (response) => {
      if (!response.ok) return false

      const data = await response.json().catch(() => ({}))

      if (data.ok === false) return false

      markRecent(SEARCH_CACHE_KEY, signature)

      if (data.counted === true) {
        clearRecent(CLICK_CACHE_KEY, signature)
      }

      return true
    })
    .catch(() => false)

  return activeSearchPromise
}

export function cancelDiscoverSearchAnalytics() {
  clearPendingTimer()
  pendingSnapshot = null
  immediateSignature = ''
}

export function scheduleDiscoverSearchAnalytics({
  apiBaseUrl,
  query,
  type,
  resultCount,
  token,
}) {
  const normalized = normalizeQuery(query)

  if (normalized.length < 2) {
    cancelDiscoverSearchAnalytics()
    return
  }

  const snapshot = {
    apiBaseUrl,
    query: String(query || '').trim(),
    type: normalizeType(type),
    resultCount,
    token: token || '',
  }
  const signature = getSignature(
    snapshot.query,
    snapshot.type
  )

  clearPendingTimer()
  pendingSnapshot = snapshot

  if (immediateSignature === signature) {
    void sendSearchAnalytics(snapshot)
    return
  }

  pendingTimer = window.setTimeout(() => {
    if (
      pendingSnapshot &&
      getSignature(
        pendingSnapshot.query,
        pendingSnapshot.type
      ) === signature
    ) {
      void sendSearchAnalytics(pendingSnapshot)
    }
  }, STABLE_DELAY_MS)
}

export function requestImmediateDiscoverSearchAnalytics(
  query,
  type
) {
  const signature = getSignature(query, type)

  if (normalizeQuery(query).length < 2) return

  immediateSignature = signature

  if (
    pendingSnapshot &&
    getSignature(
      pendingSnapshot.query,
      pendingSnapshot.type
    ) === signature
  ) {
    void sendSearchAnalytics(pendingSnapshot)
  }
}

export function trackDiscoverSearchResultClick({
  apiBaseUrl,
  query,
  type,
  resultType,
  resultId,
  token,
}) {
  const signature = getSignature(query, type)

  if (
    normalizeQuery(query).length < 2 ||
    !apiBaseUrl ||
    !resultType ||
    !resultId ||
    hasRecent(CLICK_CACHE_KEY, signature)
  ) {
    return
  }

  const sendClick = () => {
    if (hasRecent(CLICK_CACHE_KEY, signature)) return

    markRecent(CLICK_CACHE_KEY, signature)

    void fetch(
      `${apiBaseUrl}/api/discover-search/click`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          query,
          type,
          result_type: resultType,
          result_id: String(resultId),
        }),
        keepalive: true,
      }
    ).catch(() => {})
  }

  if (
    pendingSnapshot &&
    getSignature(
      pendingSnapshot.query,
      pendingSnapshot.type
    ) === signature
  ) {
    const snapshot = pendingSnapshot

    void sendSearchAnalytics(snapshot).then((ok) => {
      if (ok) sendClick()
    })
    return
  }

  if (
    activeSignature === signature &&
    activeSearchPromise
  ) {
    void activeSearchPromise.then((ok) => {
      if (ok) sendClick()
    })
    return
  }

  if (hasRecent(SEARCH_CACHE_KEY, signature)) {
    sendClick()
  }
}

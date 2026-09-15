const STORAGE_KEY = 'shadow_google_ads_traffic_guard_v1'
const WINDOW_MS = 30 * 1000
const MAX_REQUESTS = 6
const SUPPRESS_MS = 10 * 60 * 1000

function readState() {
  if (typeof window === 'undefined') {
    return {
      requests: [],
      suppressUntil: 0,
    }
  }

  try {
    const value = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY) || '{}'
    )

    return {
      requests: Array.isArray(value.requests)
        ? value.requests
            .map(Number)
            .filter(Number.isFinite)
        : [],
      suppressUntil: Math.max(
        0,
        Number(value.suppressUntil || 0)
      ),
    }
  } catch {
    return {
      requests: [],
      suppressUntil: 0,
    }
  }
}

function writeState(state) {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    )
  } catch {}
}

function pruneRequests(
  requests,
  now = Date.now()
) {
  return requests.filter(
    (timestamp) =>
      now - timestamp <= WINDOW_MS
  )
}

export function canRequestDisplayAd(
  now = Date.now()
) {
  const state = readState()

  if (state.suppressUntil > now) {
    return false
  }

  const requests = pruneRequests(
    state.requests,
    now
  )

  if (requests.length >= MAX_REQUESTS) {
    writeState({
      requests: [],
      suppressUntil: now + SUPPRESS_MS,
    })

    return false
  }

  writeState({
    requests,
    suppressUntil: 0,
  })

  return true
}

export function markDisplayAdRequest(
  now = Date.now()
) {
  const state = readState()

  if (state.suppressUntil > now) {
    return false
  }

  const requests = [
    ...pruneRequests(state.requests, now),
    now,
  ]

  writeState({
    requests,
    suppressUntil: 0,
  })

  return true
}

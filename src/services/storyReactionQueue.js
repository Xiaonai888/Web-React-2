const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const QUEUE_PREFIX = 'shadow_story_reaction_queue_v1:'
const CLOCK_KEY = 'shadow_server_clock_v1'
const CLOCK_MAX_AGE_MS = 6 * 60 * 60 * 1000
const FLUSH_DELAY_MS = 2000
const MAX_BATCH_SIZE = 200
const RETRY_DELAYS_MS = [5000, 15000, 30000, 60000, 120000]

let flushTimer = null
let flushPromise = null
let retryAttempt = 0
let clockSyncPromise = null
let serverAnchorMs = 0
let performanceAnchorMs = 0
let listenersStarted = false

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getReaderId() {
  try {
    const raw =
      localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') ||
      ''

    if (!raw) return ''

    const user = JSON.parse(raw)

    return String(
      user?.id ||
      user?.user_id ||
      ''
    ).trim()
  } catch {
    return ''
  }
}

function getQueueKey() {
  const readerId = getReaderId()
  return readerId
    ? `${QUEUE_PREFIX}${readerId}`
    : ''
}

function readQueue() {
  const key = getQueueKey()

  if (!key) return {}

  try {
    const value = JSON.parse(
      localStorage.getItem(key) || '{}'
    )

    return value && typeof value === 'object'
      ? value
      : {}
  } catch {
    return {}
  }
}

function writeQueue(queue) {
  const key = getQueueKey()

  if (!key) return

  if (!Object.keys(queue).length) {
    localStorage.removeItem(key)
    return
  }

  localStorage.setItem(
    key,
    JSON.stringify(queue)
  )
}

function setClockAnchor(serverMs) {
  serverAnchorMs = Number(serverMs || 0)
  performanceAnchorMs = performance.now()
}

function readCachedClock() {
  try {
    const cached = JSON.parse(
      sessionStorage.getItem(CLOCK_KEY) || 'null'
    )

    if (
      !cached?.server_ms ||
      !cached?.saved_at ||
      Date.now() - Number(cached.saved_at) >
        CLOCK_MAX_AGE_MS
    ) {
      return false
    }

    const estimatedServerMs =
      Number(cached.server_ms) +
      Math.max(
        0,
        Date.now() -
          Number(cached.saved_at)
      )

    setClockAnchor(estimatedServerMs)
    return true
  } catch {
    return false
  }
}

async function syncServerClock(force = false) {
  if (
    !force &&
    serverAnchorMs > 0
  ) {
    return serverAnchorMs
  }

  if (
    !force &&
    readCachedClock()
  ) {
    return serverAnchorMs
  }

  if (clockSyncPromise) {
    return clockSyncPromise
  }

  clockSyncPromise = (async () => {
    const startedAt = Date.now()

    try {
      const response = await fetch(
        `${API_BASE_URL}/health`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      const data =
        await response
          .json()
          .catch(() => ({}))

      const finishedAt = Date.now()
      const serverMs = Date.parse(
        String(data?.time || '')
      )

      if (
        !response.ok ||
        !Number.isFinite(serverMs)
      ) {
        throw new Error(
          'Server clock sync failed'
        )
      }

      const midpoint =
        startedAt +
        (finishedAt - startedAt) / 2

      const estimatedServerNow =
        serverMs +
        (finishedAt - midpoint)

      setClockAnchor(
        estimatedServerNow
      )

      sessionStorage.setItem(
        CLOCK_KEY,
        JSON.stringify({
          server_ms:
            estimatedServerNow,
          saved_at: finishedAt,
        })
      )

      return serverAnchorMs
    } catch {
      setClockAnchor(Date.now())
      return serverAnchorMs
    } finally {
      clockSyncPromise = null
    }
  })()

  return clockSyncPromise
}

function getServerNowIso() {
  if (!serverAnchorMs) {
    readCachedClock()
  }

  const nowMs = serverAnchorMs
    ? serverAnchorMs +
      (
        performance.now() -
        performanceAnchorMs
      )
    : Date.now()

  return new Date(
    nowMs
  ).toISOString()
}

function clearFlushTimer() {
  if (flushTimer) {
    window.clearTimeout(
      flushTimer
    )
    flushTimer = null
  }
}

function scheduleFlush(
  delay = FLUSH_DELAY_MS
) {
  clearFlushTimer()

  flushTimer =
    window.setTimeout(() => {
      flushTimer = null
      void flushStoryReactionQueue()
    }, Math.max(0, delay))
}

function scheduleRetry() {
  if (!navigator.onLine) return

  if (
    retryAttempt >=
    RETRY_DELAYS_MS.length
  ) {
    return
  }

  const delay =
    RETRY_DELAYS_MS[
      retryAttempt
    ]

  retryAttempt += 1
  scheduleFlush(delay)
}

function sameQueuedEvent(
  current,
  sent
) {
  return (
    current?.story_id ===
      sent?.story_id &&
    current?.liked ===
      sent?.liked &&
    current?.reaction_type ===
      sent?.reaction_type &&
    current?.occurred_at ===
      sent?.occurred_at
  )
}

async function flushQueueInternal(
  keepalive = false
) {
  const token = getReaderToken()

  if (!token) return null

  const queue = readQueue()
  const events =
    Object.values(queue)
      .slice(
        0,
        MAX_BATCH_SIZE
      )

  if (!events.length) {
    retryAttempt = 0
    return null
  }

  if (!navigator.onLine) {
    return null
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reactions/story/batch/toggle`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          events,
        }),
        keepalive,
      }
    )

    const data =
      await response
        .json()
        .catch(() => ({}))

    if (
      !response.ok ||
      data?.ok === false
    ) {
      throw new Error(
        data?.message ||
        'Reaction batch failed'
      )
    }

    const latestQueue =
      readQueue()

    for (const sent of events) {
      const current =
        latestQueue[
          sent.story_id
        ]

      if (
        sameQueuedEvent(
          current,
          sent
        )
      ) {
        delete latestQueue[
          sent.story_id
        ]
      }
    }

    writeQueue(latestQueue)
    retryAttempt = 0

    if (
      Object.keys(
        latestQueue
      ).length
    ) {
      scheduleFlush(0)
    }

    return data
  } catch {
    scheduleRetry()
    return null
  }
}

export async function flushStoryReactionQueue(
  options = {}
) {
  if (flushPromise) {
    return flushPromise
  }

  flushPromise =
    flushQueueInternal(
      Boolean(
        options?.keepalive
      )
    ).finally(() => {
      flushPromise = null
    })

  return flushPromise
}

export async function queueStoryReaction({
  storyId,
  liked,
  reactionType = 'love',
}) {
  const safeStoryId =
    String(storyId || '').trim()
  const token = getReaderToken()
  const readerId = getReaderId()

  if (
    !safeStoryId ||
    !token ||
    !readerId
  ) {
    return {
      ok: false,
      reason: 'login_required',
    }
  }

  await syncServerClock()

  const queue = readQueue()

  queue[safeStoryId] = {
    story_id: safeStoryId,
    liked:
      liked === true,
    reaction_type:
      String(
        reactionType ||
        'love'
      )
        .trim()
        .toLowerCase(),
    occurred_at:
      getServerNowIso(),
  }

  writeQueue(queue)
  retryAttempt = 0

  if (
    Object.keys(queue).length >=
    MAX_BATCH_SIZE
  ) {
    scheduleFlush(0)
  } else {
    scheduleFlush()
  }

  return {
    ok: true,
    pending: true,
    event:
      queue[safeStoryId],
  }
}

export function getPendingStoryReaction(
  storyId
) {
  const safeStoryId =
    String(storyId || '').trim()

  if (!safeStoryId) {
    return null
  }

  return (
    readQueue()[
      safeStoryId
    ] || null
  )
}

export function hasPendingStoryReactions() {
  return (
    Object.keys(
      readQueue()
    ).length > 0
  )
}

export async function initializeStoryReactionQueue() {
  startStoryReactionQueueListeners()

  await syncServerClock()

  if (
    hasPendingStoryReactions() &&
    navigator.onLine
  ) {
    scheduleFlush(500)
  }

  return {
    server_time:
      getServerNowIso(),
  }
}

export function startStoryReactionQueueListeners() {
  if (listenersStarted) return

  listenersStarted = true

  window.addEventListener(
    'online',
    () => {
      retryAttempt = 0

      if (
        hasPendingStoryReactions()
      ) {
        scheduleFlush(0)
      }
    }
  )

  window.addEventListener(
    'visibilitychange',
    () => {
      if (
        document.visibilityState ===
          'visible' &&
        hasPendingStoryReactions()
      ) {
        retryAttempt = 0
        scheduleFlush(250)
      }
    }
  )

  window.addEventListener(
    'pagehide',
    () => {
      if (
        hasPendingStoryReactions()
      ) {
        void flushStoryReactionQueue({
          keepalive: true,
        })
      }
    }
  )
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const QUEUE_PREFIX = 'shadow_comment_queue_v1:'
const CLOCK_KEY = 'shadow_server_clock_v1'
const CLOCK_MAX_AGE_MS = 6 * 60 * 60 * 1000
const FLUSH_DELAY_MS = 350
const MAX_QUEUE_SIZE = 100
const MAX_FLUSH_COUNT = 12
const RETRY_DELAYS_MS = [3000, 8000, 15000, 30000, 60000]

let flushTimer = null
let flushPromise = null
let retryAttempt = 0
let listenersStarted = false
let clockSyncPromise = null
let serverAnchorMs = 0
let performanceAnchorMs = 0

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
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

  if (!key) return []

  try {
    const value = JSON.parse(
      localStorage.getItem(key) || '[]'
    )

    return Array.isArray(value)
      ? value
      : []
  } catch {
    return []
  }
}

function writeQueue(queue) {
  const key = getQueueKey()

  if (!key) return

  if (!queue.length) {
    localStorage.removeItem(key)
    return
  }

  localStorage.setItem(
    key,
    JSON.stringify(queue)
  )
}

function createEventId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (character) => {
      const random =
        Math.floor(
          Math.random() * 16
        )
      const value =
        character === 'x'
          ? random
          : (random & 0x3) | 0x8

      return value.toString(16)
    })
}

function setClockAnchor(serverMs) {
  serverAnchorMs =
    Number(serverMs || 0)

  performanceAnchorMs =
    performance.now()
}

function readCachedClock() {
  try {
    const cached = JSON.parse(
      sessionStorage.getItem(CLOCK_KEY) ||
      'null'
    )

    if (
      !cached?.server_ms ||
      !cached?.saved_at ||
      Date.now() -
        Number(cached.saved_at) >
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

    setClockAnchor(
      estimatedServerMs
    )

    return true
  } catch {
    return false
  }
}

async function syncServerClock() {
  if (serverAnchorMs > 0) {
    return serverAnchorMs
  }

  if (readCachedClock()) {
    return serverAnchorMs
  }

  if (clockSyncPromise) {
    return clockSyncPromise
  }

  clockSyncPromise = (async () => {
    const startedAt =
      Date.now()

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

      const finishedAt =
        Date.now()

      const serverMs =
        Date.parse(
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
        (
          finishedAt -
          startedAt
        ) / 2

      const estimatedServerNow =
        serverMs +
        (
          finishedAt -
          midpoint
        )

      setClockAnchor(
        estimatedServerNow
      )

      sessionStorage.setItem(
        CLOCK_KEY,
        JSON.stringify({
          server_ms:
            estimatedServerNow,
          saved_at:
            finishedAt,
        })
      )

      return serverAnchorMs
    } catch {
      setClockAnchor(
        Date.now()
      )

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

  const timestamp =
    serverAnchorMs
      ? serverAnchorMs +
        (
          performance.now() -
          performanceAnchorMs
        )
      : Date.now()

  return new Date(
    timestamp
  ).toISOString()
}

function buildCreateUrl(
  targetType,
  targetId
) {
  if (targetType === 'episode') {
    return `${API_BASE_URL}/api/comments/episode/${encodeURIComponent(
      targetId
    )}`
  }

  return `${API_BASE_URL}/api/comments/story/${encodeURIComponent(
    targetId
  )}`
}

function clearFlushTimer() {
  if (!flushTimer) return

  window.clearTimeout(
    flushTimer
  )

  flushTimer = null
}

function scheduleFlush(
  delay = FLUSH_DELAY_MS
) {
  clearFlushTimer()

  flushTimer =
    window.setTimeout(() => {
      flushTimer = null
      void flushCommentQueue()
    }, Math.max(0, delay))
}

function isRetryableStatus(status) {
  return (
    status === 408 ||
    status === 425 ||
    status === 429 ||
    status >= 500
  )
}

function scheduleRetry() {
  if (!navigator.onLine) {
    return
  }

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

function removeEvent(
  queue,
  clientEventId
) {
  return queue.filter(
    (item) =>
      item.client_event_id !==
      clientEventId
  )
}

async function sendEvent(
  event,
  token,
  keepalive = false
) {
  try {
    const response = await fetch(
      buildCreateUrl(
        event.target_type,
        event.target_id
      ),
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          text:
            event.text,
          parent_id:
            event.parent_id ||
            null,
          client_event_id:
            event.client_event_id,
          occurred_at:
            event.occurred_at,
        }),
        keepalive,
      }
    )

    const data =
      await response
        .json()
        .catch(() => ({}))

    if (response.ok) {
      return {
        outcome: 'sent',
        data,
      }
    }

    if (
      isRetryableStatus(
        response.status
      )
    ) {
      return {
        outcome: 'retry',
        data,
      }
    }

    return {
      outcome: 'rejected',
      data: {
        ...data,
        status:
          response.status,
      },
    }
  } catch {
    return {
      outcome:
        navigator.onLine
          ? 'retry'
          : 'offline',
      data: null,
    }
  }
}

async function flushQueueInternal(
  keepalive = false
) {
  const token =
    getReaderToken()

  if (!token) {
    return {
      ok: false,
      reason:
        'login_required',
      sent: [],
      rejected: [],
    }
  }

  if (!navigator.onLine) {
    return {
      ok: false,
      reason:
        'offline',
      sent: [],
      rejected: [],
    }
  }

  const queue =
    readQueue()

  if (!queue.length) {
    retryAttempt = 0

    return {
      ok: true,
      sent: [],
      rejected: [],
    }
  }

  const batch =
    queue.slice(
      0,
      MAX_FLUSH_COUNT
    )

  const results =
    await Promise.all(
      batch.map(
        async (event) => ({
          event,
          result:
            await sendEvent(
              event,
              token,
              keepalive
            ),
        })
      )
    )

  const sent = []
  const rejected = []
  let shouldRetry = false

  for (
    const {
      event,
      result,
    } of results
  ) {
    if (
      result.outcome ===
      'sent'
    ) {
      sent.push({
        event,
        data:
          result.data,
      })

      continue
    }

    if (
      result.outcome ===
      'rejected'
    ) {
      rejected.push({
        event,
        data:
          result.data,
      })

      continue
    }

    shouldRetry = true
  }

  let latestQueue =
    readQueue()

  const completedIds =
    new Set(
      [
        ...sent,
        ...rejected,
      ].map(
        (item) =>
          item.event
            .client_event_id
      )
    )

  latestQueue =
    latestQueue.filter(
      (item) =>
        !completedIds.has(
          item.client_event_id
        )
    )

  writeQueue(
    latestQueue
  )

  if (
    sent.length ||
    rejected.length
  ) {
    window.dispatchEvent(
      new CustomEvent(
        'shadow-comment-queue-result',
        {
          detail: {
            sent,
            rejected,
          },
        }
      )
    )
  }

  if (shouldRetry) {
    scheduleRetry()
  } else {
    retryAttempt = 0

    if (
      latestQueue.length
    ) {
      scheduleFlush(0)
    }
  }

  return {
    ok:
      !shouldRetry,
    sent,
    rejected,
  }
}

export async function flushCommentQueue(
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

export async function queueCommentEvent({
  targetType,
  targetId,
  text,
  parentId = null,
}) {
  const safeTargetType =
    targetType === 'episode'
      ? 'episode'
      : 'story'

  const safeTargetId =
    String(
      targetId || ''
    ).trim()

  const safeText =
    String(
      text || ''
    ).trim()

  const token =
    getReaderToken()

  const readerId =
    getReaderId()

  if (
    !safeTargetId ||
    !safeText ||
    !token ||
    !readerId
  ) {
    return {
      ok: false,
      reason:
        !token || !readerId
          ? 'login_required'
          : 'invalid_comment',
    }
  }

  await syncServerClock()

  const queue =
    readQueue()

  if (
    queue.length >=
    MAX_QUEUE_SIZE
  ) {
    return {
      ok: false,
      reason:
        'queue_full',
    }
  }

  const event = {
    client_event_id:
      createEventId(),
    target_type:
      safeTargetType,
    target_id:
      safeTargetId,
    parent_id:
      parentId
        ? String(
            parentId
          ).trim()
        : null,
    text:
      safeText,
    occurred_at:
      getServerNowIso(),
    queued_at:
      Date.now(),
  }

  queue.push(event)
  writeQueue(queue)
  retryAttempt = 0
  scheduleFlush()

  return {
    ok: true,
    pending: true,
    event,
  }
}

export function getPendingCommentEvents({
  targetType = '',
  targetId = '',
} = {}) {
  const queue =
    readQueue()

  const safeTargetType =
    String(
      targetType || ''
    ).trim()

  const safeTargetId =
    String(
      targetId || ''
    ).trim()

  return queue.filter(
    (item) =>
      (
        !safeTargetType ||
        item.target_type ===
          safeTargetType
      ) &&
      (
        !safeTargetId ||
        item.target_id ===
          safeTargetId
      )
  )
}

export function hasPendingComments() {
  return (
    readQueue().length > 0
  )
}

export async function initializeCommentQueue() {
  startCommentQueueListeners()

  if (!hasPendingComments()) {
    return {
      ok: true,
      pending: 0,
    }
  }

  await syncServerClock()

  if (navigator.onLine) {
    scheduleFlush(250)
  }

  return {
    ok: true,
    pending:
      readQueue().length,
  }
}

export function startCommentQueueListeners() {
  if (listenersStarted) return

  listenersStarted = true

  window.addEventListener(
    'online',
    () => {
      retryAttempt = 0

      if (
        hasPendingComments()
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
        hasPendingComments()
      ) {
        retryAttempt = 0
        scheduleFlush(150)
      }
    }
  )

  window.addEventListener(
    'pagehide',
    () => {
      if (
        hasPendingComments()
      ) {
        void flushCommentQueue({
          keepalive: true,
        })
      }
    }
  )
}

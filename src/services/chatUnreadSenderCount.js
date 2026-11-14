import { useCallback, useEffect, useState } from 'react'
import { getReaderToken } from './chatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CACHE_TTL_MS = 20000
const REQUEST_SPACING_MS = 2000
const FAILURE_RETRY_MS = 30000
const snapshots = new Map()
const listeners = new Set()

function getSnapshot(token) {
  if (!snapshots.has(token)) {
    snapshots.set(token, {
      count: null,
      updatedAt: 0,
      requestedAt: 0,
      pending: null,
      retryAfter: 0,
    })
  }
  return snapshots.get(token)
}

function notifyCachedCount() {
  listeners.forEach((listener) => listener())
}

export function getCachedUnreadSenderCount() {
  const token = getReaderToken()
  if (!token) return 0
  return getSnapshot(token).count ?? 0
}

export function invalidateUnreadSenderCount() {
  const token = getReaderToken()
  if (!token) return
  getSnapshot(token).updatedAt = 0
}

export async function getUnreadSenderCount({ force = false } = {}) {
  const token = getReaderToken()
  if (!token) return 0

  const snapshot = getSnapshot(token)
  const now = Date.now()

  if (snapshot.pending) return snapshot.pending
  if (now < snapshot.retryAfter) return snapshot.count ?? 0
  if (
    snapshot.count !== null &&
    now - snapshot.updatedAt < CACHE_TTL_MS &&
    !force
  ) {
    return snapshot.count
  }
  if (
    snapshot.count !== null &&
    now - snapshot.requestedAt < REQUEST_SPACING_MS
  ) {
    return snapshot.count
  }

  snapshot.requestedAt = now
  const request = fetch(
    `${API_BASE_URL}/api/chat/conversations/unread-sender-count?role=reader`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )
    .then(async (response) => {
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to fetch unread sender count')
      }
      const count = Number(data.unread_sender_count)
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error('Invalid unread sender count')
      }
      snapshot.retryAfter = 0
      snapshot.count = count
      snapshot.updatedAt = Date.now()
      if (getReaderToken() === token) notifyCachedCount()
      return count
    })
    .catch((error) => {
      snapshot.retryAfter = Date.now() + FAILURE_RETRY_MS
      throw error
    })
    .finally(() => {
      if (snapshot.pending === request) snapshot.pending = null
    })

  snapshot.pending = request
  return request
}

export function useUnreadSenderCount({ enabled = false } = {}) {
  const [count, setCount] = useState(getCachedUnreadSenderCount)

  const refresh = useCallback(async (force = false) => {
    if (!enabled) return getCachedUnreadSenderCount()

    const token = getReaderToken()
    if (!token) {
      setCount(0)
      return 0
    }

    try {
      const nextCount = await getUnreadSenderCount({ force })
      if (getReaderToken() === token) setCount(nextCount)
      return nextCount
    } catch {
      return getCachedUnreadSenderCount()
    }
  }, [enabled])

  useEffect(() => {
    const syncCached = () => setCount(getCachedUnreadSenderCount())
    const onChatUpdate = () => {
      invalidateUnreadSenderCount()
      if (enabled && document.visibilityState === 'visible') {
        void refresh(true)
      }
    }
    const onFocus = () => {
      if (enabled) void refresh()
    }
    const onVisible = () => {
      if (enabled && document.visibilityState === 'visible') {
        void refresh()
      }
    }
    const onAuthChange = (event) => {
      if (
        event?.type === 'storage' &&
        event.key &&
        event.key !== 'shadow_reader_token' &&
        event.key !== 'shadow_reader_user'
      ) {
        return
      }
      syncCached()
      if (enabled) void refresh(true)
    }

    listeners.add(syncCached)
    syncCached()
    if (enabled) void refresh()

    window.addEventListener('shadow-chat-updated', onChatUpdate)
    window.addEventListener('focus', onFocus)
    window.addEventListener('storage', onAuthChange)
    window.addEventListener('shadow:auth-changed', onAuthChange)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      listeners.delete(syncCached)
      window.removeEventListener('shadow-chat-updated', onChatUpdate)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('storage', onAuthChange)
      window.removeEventListener('shadow:auth-changed', onAuthChange)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [enabled, refresh])

  return { count, refresh }
}

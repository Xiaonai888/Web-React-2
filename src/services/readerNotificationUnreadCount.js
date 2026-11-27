const CACHE_TTL_MS = 20_000
const MAX_ACCOUNTS = 4
const snapshots = new Map()

export function invalidateReaderNotificationUnreadCount(token) {
  if (token) snapshots.delete(token)
}

export async function getReaderNotificationUnreadCount(apiBaseUrl, token) {
  if (!token) return 0

  const key = token
  const existing = snapshots.get(key)
  if (existing?.pending) return existing.pending
  if (existing && existing.expiresAt > Date.now()) return existing.count

  const entry = { count: null, expiresAt: 0, pending: null }
  snapshots.delete(key)
  snapshots.set(key, entry)
  while (snapshots.size > MAX_ACCOUNTS) {
    snapshots.delete(snapshots.keys().next().value)
  }

  const request = (async () => {
    const response = await fetch(`${apiBaseUrl}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data?.ok !== true || !Number.isSafeInteger(data.unread_count) || data.unread_count < 0) {
      throw new Error('Failed to load notification count')
    }
    if (snapshots.get(key) === entry) {
      entry.count = data.unread_count
      entry.expiresAt = Date.now() + CACHE_TTL_MS
    }
    return data.unread_count
  })()

  entry.pending = request
  try {
    return await request
  } finally {
    if (snapshots.get(key) === entry) {
      entry.pending = null
      if (entry.count === null) snapshots.delete(key)
    }
  }
}

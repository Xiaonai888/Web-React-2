const PREFIX = 'shadow_reader_library_feed_v3'
const MAX_ENTRIES = 20
const MAX_PERSISTED_ITEMS = 108
const MAX_STALE_MS = 24 * 60 * 60 * 1000
const FRESH_MS = {
  recents: 10 * 60 * 1000,
  subscribed: 2 * 60 * 1000,
}

const memory = new Map()

function cacheKey({ accountId, tab, type = 'all' }) {
  if (!accountId || !['recents', 'subscribed'].includes(tab)) return ''
  if (!['all', 'novel', 'manga', 'chat_story', 'completed'].includes(type)) return ''
  return `${PREFIX}:${encodeURIComponent(String(accountId))}:${tab}:${type}`
}

function validSnapshot(value) {
  return Boolean(
    value && typeof value === 'object' &&
    Array.isArray(value.items) &&
    typeof value.savedAt === 'number' &&
    typeof value.hasMore === 'boolean' &&
    (value.nextCursor === null || typeof value.nextCursor === 'string')
  )
}

function pruneStoredEntries() {
  try {
    const entries = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key?.startsWith(`${PREFIX}:`)) continue
      let savedAt = 0
      try {
        savedAt = Number(JSON.parse(localStorage.getItem(key) || '{}').savedAt || 0)
      } catch {}
      entries.push({ key, savedAt })
    }
    entries.sort((a, b) => b.savedAt - a.savedAt)
    for (const entry of entries.slice(MAX_ENTRIES)) localStorage.removeItem(entry.key)
  } catch {}
}

export function loadReaderLibraryFeedCache(params) {
  const key = cacheKey(params)
  if (!key) return null
  let value = memory.get(key)
  if (!value) {
    try {
      value = JSON.parse(localStorage.getItem(key) || 'null')
    } catch {
      value = null
    }
  }
  if (!validSnapshot(value)) return null
  const age = Date.now() - value.savedAt
  if (age < 0 || age > MAX_STALE_MS) {
    memory.delete(key)
    try { localStorage.removeItem(key) } catch {}
    return null
  }
  memory.set(key, value)
  return {
    ...value,
    isFresh: age <= (FRESH_MS[params.tab] || FRESH_MS.recents),
  }
}

export function saveReaderLibraryFeedCache(params, snapshot) {
  const key = cacheKey(params)
  if (!key || !Array.isArray(snapshot?.items)) return
  const value = {
    items: snapshot.items,
    hasMore: Boolean(snapshot.hasMore),
    nextCursor: snapshot.nextCursor || null,
    unreadStoryCounts: snapshot.unreadStoryCounts || null,
    ongoingSubscriptionCount: Number(snapshot.ongoingSubscriptionCount || 0),
    savedAt: Date.now(),
  }
  memory.delete(key)
  memory.set(key, value)
  while (memory.size > MAX_ENTRIES) memory.delete(memory.keys().next().value)
  try {
    if (value.items.length > MAX_PERSISTED_ITEMS) {
      localStorage.removeItem(key)
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
    pruneStoredEntries()
  } catch {}
}

export function invalidateReaderLibraryFeedCache({ accountId, tab = null } = {}) {
  if (!accountId) return
  const prefix = `${PREFIX}:${encodeURIComponent(String(accountId))}:`
  const match = (key) => key.startsWith(prefix) && (!tab || key.startsWith(`${prefix}${tab}:`))
  for (const key of [...memory.keys()]) if (match(key)) memory.delete(key)
  try {
    const keys = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && match(key)) keys.push(key)
    }
    for (const key of keys) localStorage.removeItem(key)
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shadow-reader-library-feed-invalidated', {
      detail: { accountId: String(accountId), tab },
    }))
  }
}

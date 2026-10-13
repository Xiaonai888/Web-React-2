import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useGenreAutoLoad from './useGenreAutoLoad'
import {
  loadReaderLibraryFeedCache,
  saveReaderLibraryFeedCache,
} from '../utils/readerLibraryFeedCache'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const EMPTY = {
  items: [],
  hasMore: false,
  nextCursor: null,
  unreadStoryCounts: null,
  loading: false,
  loadingMore: false,
  error: '',
}

function getToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function typeKey(value) {
  const normalized = String(value || 'all').trim().toLowerCase().replace(/[\s-]+/g, '_')
  return ['all', 'novel', 'manga', 'chat_story'].includes(normalized) ? normalized : 'all'
}

function mergeUnique(previous, added) {
  const found = new Set()
  return [...previous, ...added].filter((item) => {
    const id = String(item?.story_id || item?.story?.id || '')
    if (!id || found.has(id)) return false
    found.add(id)
    return true
  })
}

export default function useReaderLibraryFeed({
  accountId,
  tab = 'subscribed',
  type = 'all',
  enabled = true,
} = {}) {
  const normalizedTab = tab === 'recents' ? 'recents' : 'subscribed'
  const normalizedType = typeKey(type)
  const params = useMemo(() => ({
    accountId: String(accountId || ''),
    tab: normalizedTab,
    type: normalizedType,
  }), [accountId, normalizedTab, normalizedType])
  const key = `${params.accountId}:${normalizedTab}:${normalizedType}`
  const [feed, setFeed] = useState(EMPTY)
  const feedRef = useRef(EMPTY)
  const activeKeyRef = useRef(key)
  const requestRef = useRef(null)

  const publish = useCallback((next) => {
    feedRef.current = next
    setFeed(next)
  }, [])

  const loadPage = useCallback(async ({ append = false, background = false } = {}) => {
    if (!enabled || !params.accountId || requestRef.current) return false
    const token = getToken()
    if (!token || (typeof navigator !== 'undefined' && !navigator.onLine)) return false
    const current = feedRef.current
    const cursor = append ? current.nextCursor : null
    if (append && (!current.hasMore || !cursor)) return false

    const controller = new AbortController()
    const requestKey = key
    requestRef.current = controller
    publish({
      ...current,
      loading: !append && !background,
      loadingMore: append,
      error: '',
    })

    try {
      const query = new URLSearchParams({ tab: normalizedTab, type: normalizedType })
      if (cursor) query.set('cursor', cursor)
      if (!append && normalizedTab === 'subscribed' && normalizedType === 'all') {
        query.set('include_counts', '1')
      }
      const response = await fetch(`${API_BASE_URL}/api/reader/library-feed?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load library')
      }
      if (controller.signal.aborted || activeKeyRef.current !== requestKey) return false

      const newItems = Array.isArray(data.items) ? data.items : []
      const last = feedRef.current
      const next = {
        items: append ? mergeUnique(last.items, newItems) : newItems,
        hasMore: Boolean(data.pagination?.has_more),
        nextCursor: data.pagination?.next_cursor || null,
        unreadStoryCounts: data.unread_story_counts || last.unreadStoryCounts || null,
        loading: false,
        loadingMore: false,
        error: '',
      }
      publish(next)
      saveReaderLibraryFeedCache(params, next)
      return true
    } catch (error) {
      if (controller.signal.aborted || activeKeyRef.current !== requestKey) return false
      publish({
        ...feedRef.current,
        loading: false,
        loadingMore: false,
        error: error?.message || 'Failed to load library',
      })
      return false
    } finally {
      if (requestRef.current === controller) requestRef.current = null
    }
  }, [enabled, key, normalizedTab, normalizedType, params, publish])

  useEffect(() => {
    activeKeyRef.current = key
    requestRef.current?.abort()
    requestRef.current = null
    if (!enabled || !params.accountId) {
      publish(EMPTY)
      return undefined
    }

    const cached = loadReaderLibraryFeedCache(params)
    const next = cached ? {
      items: cached.items,
      hasMore: cached.hasMore,
      nextCursor: cached.nextCursor,
      unreadStoryCounts: cached.unreadStoryCounts || null,
      loading: false,
      loadingMore: false,
      error: '',
    } : EMPTY
    publish(next)
    if (!cached?.isFresh) void loadPage({ background: Boolean(cached) })

    return () => {
      requestRef.current?.abort()
      requestRef.current = null
    }
  }, [enabled, key, loadPage, params, publish])

  const loadMore = useCallback(() => loadPage({ append: true }), [loadPage])
  const refresh = useCallback(() => {
    requestRef.current?.abort()
    requestRef.current = null
    return loadPage({ background: feedRef.current.items.length > 0 })
  }, [loadPage])

  useEffect(() => {
    const onInvalidated = (event) => {
      if (String(event.detail?.accountId || '') !== params.accountId) return
      if (event.detail?.tab && event.detail.tab !== normalizedTab) return
      void refresh()
    }
    window.addEventListener('shadow-reader-library-feed-invalidated', onInvalidated)
    return () => window.removeEventListener('shadow-reader-library-feed-invalidated', onInvalidated)
  }, [params.accountId, normalizedTab, refresh])

  const { sentinelRef, showManualLoad } = useGenreAutoLoad({
    resetKey: key,
    hasMore: feed.hasMore,
    loading: feed.loading,
    loadingMore: feed.loadingMore,
    loadMore,
    loadedCount: feed.items.length,
    maxAutoLoads: 2,
  })

  return { ...feed, loadMore, refresh, sentinelRef, showManualLoad }
}

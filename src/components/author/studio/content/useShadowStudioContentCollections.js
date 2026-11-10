import { useCallback, useEffect, useRef, useState } from 'react'
import { listStudioContentSection } from './ShadowStudioContentApi'

const KEYS = ['videos', 'shorts', 'playlists']

function blank() {
  return { items: [], nextOffset: 0, hasMore: true, initialized: false, loading: false, error: '' }
}

function initialState() {
  return { videos: blank(), shorts: blank(), playlists: blank() }
}

export default function useShadowStudioContentCollections({ pageSize = 12 } = {}) {
  const limit = Number.isSafeInteger(pageSize) ? Math.max(1, Math.min(24, pageSize)) : 12
  const [pages, setPages] = useState(initialState)
  const pagesRef = useRef(pages)
  const runningRef = useRef({})

  const commit = useCallback((key, value) => {
    pagesRef.current = { ...pagesRef.current, [key]: value }
    setPages(pagesRef.current)
  }, [])

  const load = useCallback(async (key, { reset = false } = {}) => {
    if (!KEYS.includes(key)) return
    const previousRequest = runningRef.current[key]
    if (previousRequest && !reset) return
    if (previousRequest) previousRequest.abort()
    const previous = pagesRef.current[key]
    if (!reset && previous.initialized && !previous.hasMore) return

    const controller = new AbortController()
    runningRef.current[key] = controller
    const offset = reset ? 0 : previous.nextOffset
    commit(key, {
      ...(reset ? blank() : previous),
      loading: true,
      error: '',
    })
    try {
      const result = await listStudioContentSection(key, { limit, offset, signal: controller.signal })
      if (runningRef.current[key] !== controller || controller.signal.aborted) return
      const oldItems = reset ? [] : pagesRef.current[key].items
      const seen = new Set(oldItems.map(item => item.id))
      const additions = result.items.filter(item => item?.id && !seen.has(item.id))
      commit(key, {
        items: [...oldItems, ...additions],
        nextOffset: result.nextOffset,
        hasMore: result.hasMore,
        initialized: true,
        loading: false,
        error: '',
      })
    } catch (error) {
      if (runningRef.current[key] !== controller || controller.signal.aborted) return
      commit(key, {
        ...pagesRef.current[key],
        loading: false,
        error: error?.message || 'Unable to load content.',
      })
    } finally {
      if (runningRef.current[key] === controller) runningRef.current[key] = null
    }
  }, [commit, limit])

  useEffect(() => {
    for (const key of KEYS) load(key)
    return () => {
      for (const key of KEYS) {
        runningRef.current[key]?.abort()
        runningRef.current[key] = null
      }
    }
  }, [load])

  const refresh = useCallback((key) => {
    if (KEYS.includes(key)) return load(key, { reset: true })
    return Promise.all(KEYS.map(item => load(item, { reset: true })))
  }, [load])

  const items = {
    videos: pages.videos.items,
    shorts: pages.shorts.items,
    playlists: pages.playlists.items,
  }
  const loading = {
    videos: pages.videos.loading,
    shorts: pages.shorts.loading,
    playlists: pages.playlists.loading,
  }
  const errors = {
    videos: pages.videos.error,
    shorts: pages.shorts.error,
    playlists: pages.playlists.error,
  }
  const pagination = Object.fromEntries(KEYS.map(key => [key, {
    next_offset: pages[key].nextOffset,
    has_more: pages[key].hasMore,
  }]))

  return {
    ...items,
    loading,
    errors,
    pagination,
    loadMore: load,
    retry: key => refresh(key),
    refresh,
  }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { listStudioContentSection } from './ShadowStudioContentApi'
import {
  readStudioSectionCache,
  studioContentSession,
  writeStudioSectionCache,
} from './ShadowStudioContentCache'

const KEYS = ['videos', 'shorts', 'playlists']
const REVALIDATE_AFTER_MS = 5 * 60 * 1000
const REFRESH_PAGE_SIZE = 24
const VIEW_COUNTED_EVENT = 'shadow:reel-view-counted'

function blank() {
  return {
    items: [],
    nextOffset: 0,
    hasMore: true,
    initialized: false,
    loading: false,
    error: '',
    validatedAt: 0,
  }
}

function initialState(useCache) {
  return Object.fromEntries(KEYS.map(key => [
    key,
    useCache ? readStudioSectionCache(key) || blank() : blank(),
  ]))
}

export default function useShadowStudioContentCollections({ pageSize = 12, overviewSize = 6, freshOnMount = false } = {}) {
  const batchSize = Number.isSafeInteger(pageSize) ? Math.max(1, Math.min(24, pageSize)) : 12
  const previewSize = Number.isSafeInteger(overviewSize) ? Math.max(1, Math.min(batchSize, overviewSize)) : 6
  const [pages, setPages] = useState(() => initialState(!freshOnMount))
  const pagesRef = useRef(pages)
  const runningRef = useRef({})
  const pendingRef = useRef({})
  const observedCountsRef = useRef(new Map())

  const commit = useCallback((key, value) => {
    pagesRef.current = { ...pagesRef.current, [key]: value }
    setPages(pagesRef.current)
  }, [])

  const withObservedCounts = useCallback(items => items.map(item => {
    const known = observedCountsRef.current.get(String(item?.id || ''))
    const supplied = Number(item?.view_count)
    if (known == null || (Number.isSafeInteger(supplied) && supplied >= known)) return item
    return { ...item, view_count: known }
  }), [])

  const load = useCallback(async (key, { reset = false, minimum = 0 } = {}) => {
    if (!KEYS.includes(key)) return

    const ongoing = runningRef.current[key]
    if (ongoing && !reset) {
      pendingRef.current[key] = Math.max(pendingRef.current[key] || 0, minimum)
      return
    }
    if (ongoing) ongoing.abort()
    if (reset) pendingRef.current[key] = 0

    const previous = pagesRef.current[key]
    if (!reset && previous.initialized && (!previous.hasMore || (minimum > 0 && previous.items.length >= minimum))) return

    const limit = minimum > 0 ? Math.min(batchSize, minimum - previous.items.length) : batchSize
    if (!reset && limit <= 0) return

    const controller = new AbortController()
    const ownerAtStart = studioContentSession()
    const isCurrent = () => !controller.signal.aborted && runningRef.current[key] === controller && studioContentSession() === ownerAtStart
    runningRef.current[key] = controller
    commit(key, { ...previous, loading: true, error: '' })

    try {
      let next
      if (reset) {
        const target = Math.max(previewSize, minimum, previous.items.length)
        const items = []
        const seen = new Set()
        let offset = 0
        let hasMore = true
        let attempts = 0
        const maxAttempts = Math.max(1, Math.ceil(target / REFRESH_PAGE_SIZE) + 2)

        while (items.length < target && hasMore && attempts < maxAttempts) {
          const page = await listStudioContentSection(key, {
            limit: Math.min(REFRESH_PAGE_SIZE, target - items.length),
            offset,
            signal: controller.signal,
          })
          if (!isCurrent()) return
          for (const item of page.items) {
            if (item?.id && !seen.has(item.id)) {
              seen.add(item.id)
              items.push(item)
            }
          }
          const nextOffset = page.nextOffset
          hasMore = page.hasMore && nextOffset > offset
          offset = nextOffset
          attempts += 1
        }
        next = {
          items: withObservedCounts(items),
          nextOffset: offset,
          hasMore,
          initialized: true,
          loading: false,
          error: '',
          validatedAt: Date.now(),
        }
      } else {
        const offset = previous.nextOffset
        const page = await listStudioContentSection(key, { limit, offset, signal: controller.signal })
        if (!isCurrent()) return
        const seen = new Set(previous.items.map(item => item.id))
        const additions = page.items.filter(item => item?.id && !seen.has(item.id))
        next = {
          items: withObservedCounts([...previous.items, ...additions]),
          nextOffset: page.nextOffset,
          hasMore: page.hasMore && page.nextOffset > offset,
          initialized: true,
          loading: false,
          error: '',
          validatedAt: offset === 0 ? Date.now() : (previous.validatedAt || 0),
        }
      }

      if (!isCurrent()) return
      commit(key, next)
      writeStudioSectionCache(key, next)
    } catch (error) {
      if (!isCurrent()) return
      commit(key, { ...pagesRef.current[key], loading: false, error: error?.message || 'Unable to load content.' })
    } finally {
      if (runningRef.current[key] === controller) {
        runningRef.current[key] = null
        const target = pendingRef.current[key] || 0
        pendingRef.current[key] = 0
        const current = pagesRef.current[key]
        if (target > current.items.length && current.initialized && current.hasMore && !current.error) {
          void load(key, { minimum: target })
        }
      }
    }
  }, [batchSize, commit, previewSize, withObservedCounts])

  useEffect(() => {
    for (const key of KEYS) {
      const current = pagesRef.current[key]
      if (!current.initialized) {
        void load(key, { minimum: previewSize })
      } else if (!current.validatedAt || Date.now() - current.validatedAt >= REVALIDATE_AFTER_MS) {
        void load(key, { reset: true, minimum: previewSize })
      }
    }
    return () => {
      for (const key of KEYS) {
        runningRef.current[key]?.abort()
        runningRef.current[key] = null
        pendingRef.current[key] = 0
      }
    }
  }, [load, previewSize])

  useEffect(() => {
    const applyView = event => {
      const videoId = String(event?.detail?.videoId || '')
      const total = Number(event?.detail?.total)
      if (!videoId || !Number.isSafeInteger(total) || total < 0) return
      const known = observedCountsRef.current.get(videoId)
      const floor = known == null ? total : Math.max(known, total)
      observedCountsRef.current.set(videoId, floor)
      if (observedCountsRef.current.size > 200) {
        observedCountsRef.current.delete(observedCountsRef.current.keys().next().value)
      }
      let updated = false
      const next = { ...pagesRef.current }
      for (const key of ['videos', 'shorts']) {
        const page = pagesRef.current[key]
        if (!page?.items?.some(item => String(item?.id) === videoId)) continue
        const items = page.items.map(item => {
          if (String(item?.id) !== videoId) return item
          const displayed = Number(item.view_count)
          if (Number.isSafeInteger(displayed) && displayed >= floor) return item
          return { ...item, view_count: floor }
        })
        const latest = { ...page, items, validatedAt: 0 }
        next[key] = latest
        writeStudioSectionCache(key, latest)
        updated = true
      }
      if (updated) {
        pagesRef.current = next
        setPages(next)
      }
    }
    window.addEventListener(VIEW_COUNTED_EVENT, applyView)
    return () => window.removeEventListener(VIEW_COUNTED_EVENT, applyView)
  }, [])

  useEffect(() => {
    const revalidateOnReturn = () => {
      if (document.visibilityState !== 'visible') return
      for (const key of ['videos', 'shorts']) {
        const page = pagesRef.current[key]
        if (runningRef.current[key] || !page?.initialized) continue
        if (!page.validatedAt || Date.now() - page.validatedAt >= REVALIDATE_AFTER_MS) {
          void load(key, { reset: true, minimum: previewSize })
        }
      }
    }
    window.addEventListener('focus', revalidateOnReturn)
    document.addEventListener('visibilitychange', revalidateOnReturn)
    return () => {
      window.removeEventListener('focus', revalidateOnReturn)
      document.removeEventListener('visibilitychange', revalidateOnReturn)
    }
  }, [load, previewSize])

  const ensureFirstPage = useCallback(key => {
    if (!KEYS.includes(key)) return
    return load(key, { minimum: batchSize })
  }, [batchSize, load])

  const refresh = useCallback(key => {
    if (KEYS.includes(key)) return load(key, { reset: true, minimum: previewSize })
    return Promise.all(KEYS.map(section => load(section, { reset: true, minimum: previewSize })))
  }, [load, previewSize])

  return {
    videos: pages.videos.items,
    shorts: pages.shorts.items,
    playlists: pages.playlists.items,
    loading: Object.fromEntries(KEYS.map(key => [key, pages[key].loading])),
    errors: Object.fromEntries(KEYS.map(key => [key, pages[key].error])),
    pagination: Object.fromEntries(KEYS.map(key => [key, {
      next_offset: pages[key].nextOffset,
      has_more: pages[key].hasMore,
    }])),
    loadMore: key => load(key),
    ensureFirstPage,
    retry: key => refresh(key),
    refresh,
  }
}

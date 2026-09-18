import { useCallback, useEffect, useRef, useState } from 'react'

const CACHE_LIMIT = 5

function getEpisodeId(value) {
  return String(value?.id || value?.episode_id || value || '').trim()
}

function getEpisodeNumber(entry) {
  return Number(entry?.episode?.episode_number || entry?.episode_number || 0)
}

export default function useContinuousEpisodeReader({
  enabled,
  storyId,
  activeEpisodeId,
  episodes,
  loadEpisode,
  onActiveEntry,
}) {
  const [entries, setEntries] = useState([])
  const entriesRef = useRef([])
  const nodesRef = useRef(new Map())
  const loadingRef = useRef(new Map())
  const activeIdRef = useRef(String(activeEpisodeId || ''))
  const pendingScrollAdjustmentRef = useRef(0)
  const loadEpisodeRef = useRef(loadEpisode)
  const onActiveEntryRef = useRef(onActiveEntry)

  useEffect(() => {
    loadEpisodeRef.current = loadEpisode
  }, [loadEpisode])

  useEffect(() => {
    onActiveEntryRef.current = onActiveEntry
  }, [onActiveEntry])

  useEffect(() => {
    activeIdRef.current = String(activeEpisodeId || '')
  }, [activeEpisodeId])

  const commitEntries = useCallback((nextEntries) => {
    entriesRef.current = nextEntries
    setEntries(nextEntries)
  }, [])

  const setInitialEntry = useCallback(
    (entry) => {
      if (!entry?.id || !entry?.episode) return

      loadingRef.current.clear()
      nodesRef.current.clear()
      pendingScrollAdjustmentRef.current = 0
      activeIdRef.current = String(entry.id)
      commitEntries([entry])
      onActiveEntryRef.current?.(entry)
    },
    [commitEntries]
  )

  const insertEntry = useCallback(
    (entry) => {
      if (!entry?.id || !entry?.episode) return entry

      const currentEntries = entriesRef.current
      const existingIndex = currentEntries.findIndex(
        (item) => String(item.id) === String(entry.id)
      )

      let nextEntries =
        existingIndex >= 0
          ? currentEntries.map((item, index) =>
              index === existingIndex ? { ...item, ...entry } : item
            )
          : [...currentEntries, entry]

      nextEntries.sort((first, second) => {
        const numberDifference =
          getEpisodeNumber(first) - getEpisodeNumber(second)

        if (numberDifference !== 0) return numberDifference

        return String(first.id).localeCompare(String(second.id))
      })

      if (nextEntries.length > CACHE_LIMIT) {
        const activeIndex = Math.max(
          0,
          nextEntries.findIndex(
            (item) => String(item.id) === String(activeIdRef.current)
          )
        )
        const maxStart = Math.max(0, nextEntries.length - CACHE_LIMIT)
        const startIndex = Math.max(
          0,
          Math.min(activeIndex - 3, maxStart)
        )
        const removedAbove = nextEntries.slice(0, startIndex)

        if (removedAbove.length) {
          pendingScrollAdjustmentRef.current += removedAbove.reduce(
            (total, item) => {
              const node = nodesRef.current.get(String(item.id))
              return total + Number(node?.getBoundingClientRect().height || 0)
            },
            0
          )
        }

        nextEntries = nextEntries.slice(
          startIndex,
          startIndex + CACHE_LIMIT
        )
      }

      commitEntries(nextEntries)
      return entry
    },
    [commitEntries]
  )

  useEffect(() => {
    const adjustment = pendingScrollAdjustmentRef.current

    if (!adjustment) return

    pendingScrollAdjustmentRef.current = 0

    const frame = window.requestAnimationFrame(() => {
      window.scrollBy({
        top: -adjustment,
        behavior: 'auto',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [entries])

  const loadTarget = useCallback(
    async (targetEpisode) => {
      const targetId = getEpisodeId(targetEpisode)

      if (!targetId) return null

      const cached = entriesRef.current.find(
        (item) => String(item.id) === targetId
      )

      if (cached) return cached

      if (loadingRef.current.has(targetId)) {
        return loadingRef.current.get(targetId)
      }

      const promise = Promise.resolve(
        loadEpisodeRef.current?.(targetEpisode)
      )
        .then((entry) => {
          if (!entry) return null
          insertEntry(entry)
          return entry
        })
        .finally(() => {
          loadingRef.current.delete(targetId)
        })

      loadingRef.current.set(targetId, promise)
      return promise
    },
    [insertEntry]
  )

  const getNextEpisode = useCallback(
    (episodeId) => {
      const sorted = [...(episodes || [])].sort(
        (first, second) =>
          Number(first?.episode_number || 0) -
          Number(second?.episode_number || 0)
      )
      const currentIndex = sorted.findIndex(
        (item) => getEpisodeId(item) === String(episodeId || '')
      )

      if (currentIndex < 0 || currentIndex >= sorted.length - 1) {
        return null
      }

      return sorted[currentIndex + 1]
    },
    [episodes]
  )

  useEffect(() => {
    if (!enabled || !activeEpisodeId) return undefined

    const activeEntry = entriesRef.current.find(
      (item) => String(item.id) === String(activeEpisodeId)
    )

    if (!activeEntry || activeEntry.locked) return undefined

    const nextEpisode = getNextEpisode(activeEpisodeId)

    if (!nextEpisode) return undefined

    let frameId = 0
    let cancelled = false

    const maybeLoadNext = () => {
      frameId = 0

      if (cancelled || document.visibilityState !== 'visible') return

      const activeNode = nodesRef.current.get(
        String(activeEpisodeId)
      )

      if (!activeNode) return

      const rect = activeNode.getBoundingClientRect()
      const preloadDistance = Math.max(
        320,
        window.innerHeight * 0.75
      )

      if (rect.bottom - window.innerHeight > preloadDistance) return

      loadTarget(nextEpisode).catch(() => null)
    }

    const scheduleCheck = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(maybeLoadNext)
    }

    scheduleCheck()
    window.addEventListener('scroll', scheduleCheck, {
      passive: true,
    })
    window.addEventListener('resize', scheduleCheck)

    return () => {
      cancelled = true
      window.removeEventListener('scroll', scheduleCheck)
      window.removeEventListener('resize', scheduleCheck)

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [
    activeEpisodeId,
    enabled,
    getNextEpisode,
    loadTarget,
  ])

  const activateEntry = useCallback(
    (entryId) => {
      const nextEntry = entriesRef.current.find(
        (item) => String(item.id) === String(entryId)
      )

      if (!nextEntry) return

      activeIdRef.current = String(nextEntry.id)

      const nextPath = `/story/${storyId}/episode/${nextEntry.id}`

      if (window.location.pathname !== nextPath) {
        window.history.replaceState(
          window.history.state,
          '',
          nextPath
        )
      }

      onActiveEntryRef.current?.(nextEntry)
    },
    [storyId]
  )

  useEffect(() => {
    if (!enabled || entries.length <= 1) return

    let frameId = 0

    const updateActiveEpisode = () => {
      frameId = 0

      const anchor = Math.min(window.innerHeight * 0.38, 320)
      let containingEntry = null
      let nearestEntry = null
      let nearestDistance = Number.POSITIVE_INFINITY

      entriesRef.current.forEach((entry) => {
        const node = nodesRef.current.get(String(entry.id))

        if (!node) return

        const rect = node.getBoundingClientRect()

        if (rect.top <= anchor && rect.bottom >= anchor) {
          containingEntry = entry
          return
        }

        const distance = Math.min(
          Math.abs(rect.top - anchor),
          Math.abs(rect.bottom - anchor)
        )

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestEntry = entry
        }
      })

      const selectedEntry = containingEntry || nearestEntry

      if (
        selectedEntry &&
        String(selectedEntry.id) !== String(activeIdRef.current)
      ) {
        activateEntry(selectedEntry.id)
      }
    }

    const handleScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateActiveEpisode)
    }

    updateActiveEpisode()
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [activateEntry, enabled, entries])

  const registerSection = useCallback((entryId, node) => {
    const key = String(entryId || '')

    if (!key) return

    if (node) {
      nodesRef.current.set(key, node)
    } else {
      nodesRef.current.delete(key)
    }
  }, [])

  const scrollToEpisode = useCallback(
    async (targetEpisode) => {
      if (!targetEpisode) return null

      const targetId = getEpisodeId(targetEpisode)
      const entry = await loadTarget(targetEpisode)

      if (!entry) return null

      await new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(resolve)
        })
      })

      const node = nodesRef.current.get(targetId)

      if (node) {
        node.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }

      activateEntry(targetId)
      return entry
    },
    [activateEntry, loadTarget]
  )

  const markAdFinished = useCallback(
    (entryId) => {
      const key = String(entryId || '')
      const currentEntries = entriesRef.current
      const nextEntries = currentEntries.map((entry) =>
        String(entry.id) === key
          ? { ...entry, adFinished: true }
          : entry
      )

      commitEntries(nextEntries)

      if (String(activeIdRef.current) === key) {
        const activeEntry = nextEntries.find(
          (entry) => String(entry.id) === key
        )

        if (activeEntry) {
          onActiveEntryRef.current?.(activeEntry)
        }
      }
    },
    [commitEntries]
  )

  const getSectionNode = useCallback((entryId) => {
    return nodesRef.current.get(String(entryId || '')) || null
  }, [])

  return {
    entries,
    setInitialEntry,
    registerSection,
    scrollToEpisode,
    markAdFinished,
    getSectionNode,
  }
}

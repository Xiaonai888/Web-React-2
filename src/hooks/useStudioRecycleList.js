import { useCallback, useEffect, useRef, useState } from 'react'
import { listStudioRecycleVideos } from '../services/shadowStudioRecycleApi'

const PAGE_SIZE = 12

function initial() {
  return { items: [], nextOffset: 0, hasMore: false, loading: false, error: '', ready: false }
}

export default function useStudioRecycleList(section) {
  const [state, setState] = useState(initial)
  const snapshot = useRef(state)
  const active = useRef(null)
  const sequence = useRef(0)

  const commit = useCallback(value => {
    snapshot.current = value
    setState(value)
  }, [])

  const load = useCallback(async ({ append = false, force = false } = {}) => {
    const previous = snapshot.current
    if (previous.loading && !force) return
    if (append && (!previous.ready || !previous.hasMore)) return
    if (active.current) active.current.abort()
    const controller = new AbortController()
    const id = ++sequence.current
    active.current = controller
    const offset = append ? previous.nextOffset : 0
    commit({ ...previous, loading: true, error: '' })
    try {
      const page = await listStudioRecycleVideos(section, {
        offset, limit: PAGE_SIZE, signal: controller.signal, force,
      })
      if (controller.signal.aborted || id !== sequence.current) return
      const old = append ? snapshot.current.items : []
      const seen = new Set(old.map(video => video.id))
      const additions = page.items.filter(video => video?.id && !seen.has(video.id))
      commit({ items: [...old, ...additions], nextOffset: page.nextOffset,
        hasMore: page.hasMore, ready: true, loading: false, error: '' })
    } catch (error) {
      if (!controller.signal.aborted && id === sequence.current) {
        commit({ ...snapshot.current, loading: false, error: error?.message || 'Could not load videos.' })
      }
    } finally {
      if (active.current === controller) active.current = null
    }
  }, [commit, section])

  useEffect(() => {
    void load()
    return () => {
      active.current?.abort()
      active.current = null
      sequence.current += 1
    }
  }, [load])

  return {
    ...state,
    loadMore: () => load({ append: true }),
    refresh: () => load({ force: true }),
  }
}

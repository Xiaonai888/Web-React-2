import { useCallback, useEffect, useRef, useState } from 'react'
import { getStudioPlaylistDetailPage } from './ShadowStudioPlaylistDetailApi'
import {
  readStudioPlaylistCache,
  writeStudioPlaylistCache,
  invalidateStudioPlaylistCache,
  studioContentSession,
} from './ShadowStudioContentCache'

const PAGE_SIZE = 12

function emptyState() {
  return { playlist: null, videos: [], nextOffset: 0, hasMore: false, total: null, ready: false, loading: false, error: '' }
}

export default function useShadowStudioPlaylistDetail(playlistId) {
  const [state, setState] = useState(() => playlistId ? readStudioPlaylistCache(playlistId) || emptyState() : emptyState())
  const stateRef = useRef(state)
  const activeRef = useRef(null)

  const commit = useCallback(next => {
    stateRef.current = next
    setState(next)
  }, [])

  const load = useCallback(async (reset = false) => {
    if (!playlistId || (!reset && (activeRef.current || !stateRef.current.hasMore))) return
    if (activeRef.current) activeRef.current.abort()
    if (reset) invalidateStudioPlaylistCache(playlistId)
    const controller = new AbortController()
    const ownerAtStart = studioContentSession()
    activeRef.current = controller
    const previous = stateRef.current
    const offset = reset ? 0 : previous.nextOffset
    commit({ ...(reset ? emptyState() : previous), loading: true, error: '' })
    try {
      const result = await getStudioPlaylistDetailPage(playlistId, { limit: PAGE_SIZE, offset, signal: controller.signal })
      if (controller.signal.aborted || activeRef.current !== controller || studioContentSession() !== ownerAtStart) return
      const seen = new Set(reset ? [] : previous.videos.map(video => video.id))
      const videos = reset ? result.videos : [...previous.videos, ...result.videos.filter(video => !seen.has(video.id))]
      const next = {
        playlist: result.playlist || previous.playlist,
        videos,
        nextOffset: result.pagination.nextOffset,
        hasMore: result.pagination.hasMore && result.pagination.nextOffset > offset,
        total: result.pagination.total,
        ready: true,
        loading: false,
        error: '',
      }
      commit(next)
      writeStudioPlaylistCache(playlistId, next)
    } catch (error) {
      if (!controller.signal.aborted && activeRef.current === controller) {
        commit({ ...stateRef.current, loading: false, error: error?.message || 'Unable to load Playlist videos.' })
      }
    } finally {
      if (activeRef.current === controller) activeRef.current = null
    }
  }, [playlistId, commit])

  useEffect(() => {
    const cached = playlistId ? readStudioPlaylistCache(playlistId) : null
    if (cached) commit(cached)
    else {
      commit(emptyState())
      if (playlistId) void load(true)
    }
    return () => {
      activeRef.current?.abort()
      activeRef.current = null
    }
  }, [playlistId, load, commit])

  return {
    ...state,
    refresh: () => load(true),
    loadMore: () => load(false),
  }
}

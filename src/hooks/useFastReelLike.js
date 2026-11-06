import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getFastReelLikeStatus,
  hasFastReaderSession,
  setFastReelLiked,
} from '../services/fastLikesApi'

// NEW: isolated hook for one Reel. It reads only when this Reel is active,
// not once for every video in the feed.
export default function useFastReelLike(
  videoId,
  { active = false, initialCount = null, onAuthRequired, onError } = {},
) {
  const [state, setState] = useState({
    liked: false,
    likeCount: Number.isFinite(Number(initialCount)) && initialCount !== null
      ? Math.max(0, Number(initialCount))
      : null,
    loaded: false,
    pending: false,
  })
  const stateRef = useRef(state)
  const busyRef = useRef(false)
  const onErrorRef = useRef(onError)
  const onAuthRequiredRef = useRef(onAuthRequired)
  onErrorRef.current = onError
  onAuthRequiredRef.current = onAuthRequired
  const versionRef = useRef(0)
  const readControllerRef = useRef(null)
  const mountedRef = useRef(true)

  const updateState = useCallback(next => {
    stateRef.current = typeof next === 'function' ? next(stateRef.current) : next
    if (mountedRef.current) setState(stateRef.current)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      versionRef.current += 1
      readControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (!active || !videoId || stateRef.current.loaded || busyRef.current) return undefined

    const controller = new AbortController()
    readControllerRef.current = controller
    const version = ++versionRef.current

    getFastReelLikeStatus(videoId, { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted || version !== versionRef.current) return
        updateState(previous => ({
          ...previous,
          liked: result.liked,
          likeCount: result.likeCount,
          loaded: true,
        }))
      })
      .catch(error => {
        if (controller.signal.aborted || version !== versionRef.current) return
        // The button can retry the status load on its next activation.
        onErrorRef.current?.(error)
      })

    return () => controller.abort()
  }, [active, videoId, updateState])

  const toggleLike = useCallback(async () => {
    if (!videoId || busyRef.current) return false
    if (!hasFastReaderSession()) {
      onAuthRequiredRef.current?.()
      return false
    }

    busyRef.current = true
    try {
      // Load the real status before a first click to handle already-liked Reels.
      // Also lock concurrent first taps to avoid sending duplicate requests.
      if (!stateRef.current.loaded) {
        const fresh = await getFastReelLikeStatus(videoId)
        updateState(previous => ({
          ...previous,
          liked: fresh.liked,
          likeCount: fresh.likeCount,
          loaded: true,
        }))
      }

      const previous = stateRef.current
      const nextLiked = !previous.liked
      versionRef.current += 1
      readControllerRef.current?.abort()

      updateState({
        ...previous,
        liked: nextLiked,
        likeCount: Math.max(0, Number(previous.likeCount || 0) + (nextLiked ? 1 : -1)),
        loaded: true,
        pending: true,
      })

      try {
        const result = await setFastReelLiked(videoId, nextLiked)
        updateState({
          liked: result.liked,
          likeCount: result.likeCount,
          loaded: true,
          pending: false,
        })
        return true
      } catch (error) {
        updateState({ ...previous, pending: false })
        onErrorRef.current?.(error)
        return false
      }
    } catch (error) {
      onErrorRef.current?.(error)
      return false
    } finally {
      busyRef.current = false
    }
  }, [videoId, updateState])

  return {
    liked: state.liked,
    likeCount: state.likeCount,
    loaded: state.loaded,
    pending: state.pending,
    toggleLike,
  }
}

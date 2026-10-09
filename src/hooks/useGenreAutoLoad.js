import { useEffect, useRef, useState } from 'react'

export default function useGenreAutoLoad({
  resetKey,
  hasMore,
  loading,
  loadingMore,
  loadMore,
  maxAutoLoads = 3,
}) {
  const sentinelRef = useRef(null)
  const loadMoreRef = useRef(loadMore)
  const resetKeyRef = useRef(resetKey)
  const pendingRef = useRef(false)
  const gestureRef = useRef(0)
  const handledGestureRef = useRef(0)
  const touchYRef = useRef(null)
  const [autoLoads, setAutoLoads] = useState(0)

  loadMoreRef.current = loadMore
  resetKeyRef.current = resetKey

  useEffect(() => {
    gestureRef.current = 0
    handledGestureRef.current = 0
    pendingRef.current = false
    setAutoLoads(0)
  }, [resetKey])

  useEffect(() => {
    if (!hasMore || loading || loadingMore || autoLoads >= maxAutoLoads) return undefined

    const expectedResetKey = resetKey

    const check = () => {
      if (resetKeyRef.current !== expectedResetKey) return
      if (pendingRef.current || gestureRef.current === handledGestureRef.current) return

      const sentinel = sentinelRef.current
      if (!sentinel) return

      const bounds = sentinel.getBoundingClientRect()
      if (bounds.top > window.innerHeight - 80 || bounds.bottom < 0) return

      handledGestureRef.current = gestureRef.current
      pendingRef.current = true

      Promise.resolve()
        .then(() => loadMoreRef.current?.())
        .then((succeeded) => {
          if (resetKeyRef.current === expectedResetKey && succeeded === true) {
            setAutoLoads((count) => Math.min(maxAutoLoads, count + 1))
          }
        })
        .finally(() => {
          pendingRef.current = false
        })
    }

    const onWheel = (event) => {
      if (event.deltaY <= 0) return
      gestureRef.current += 1
      requestAnimationFrame(check)
    }

    const onTouchStart = (event) => {
      touchYRef.current = event.touches?.[0]?.clientY ?? null
    }

    const onTouchMove = (event) => {
      const y = event.touches?.[0]?.clientY
      if (typeof y !== 'number') return
      if (touchYRef.current !== null && touchYRef.current - y > 8) {
        gestureRef.current += 1
      }
      touchYRef.current = y
      requestAnimationFrame(check)
    }

    const onKeyDown = (event) => {
      if (!['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) return
      gestureRef.current += 1
      requestAnimationFrame(check)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('scroll', check, true)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('scroll', check, true)
    }
  }, [hasMore, loading, loadingMore, autoLoads, maxAutoLoads, resetKey])

  return { sentinelRef, autoLoads, showManualLoad: autoLoads >= maxAutoLoads }
}

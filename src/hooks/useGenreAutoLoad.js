import { useEffect, useRef, useState } from 'react'

function hasReaderAccount() {
  try {
    for (const storage of [sessionStorage, localStorage]) {
      const token = storage.getItem('shadow_reader_token')
      if (!token) continue
      const part = token.split('.')[1]
      if (!part) continue
      const value = part.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(value.padEnd(Math.ceil(value.length / 4) * 4, '=')))
      if (
        payload.type === 'reader' &&
        payload.session_id &&
        payload.device_id &&
        payload.jwt_id &&
        Number(payload.exp) * 1000 > Date.now()
      ) return true
    }
  } catch {
    return false
  }
  return false
}

export default function useGenreAutoLoad({
  resetKey,
  hasMore,
  loading,
  loadingMore,
  loadMore,
  loadedCount = 0,
  maxAutoLoads = 2,
}) {
  const sentinelRef = useRef(null)
  const loadMoreRef = useRef(loadMore)
  const resetKeyRef = useRef(resetKey)
  const pendingRef = useRef(false)
  const gestureRef = useRef(0)
  const handledGestureRef = useRef(0)
  const touchYRef = useRef(null)
  const [autoLoads, setAutoLoads] = useState(0)
  const [hasAccount, setHasAccount] = useState(hasReaderAccount)

  useEffect(() => {
    const updateAccount = () => setHasAccount(hasReaderAccount())
    window.addEventListener('storage', updateAccount)
    window.addEventListener('focus', updateAccount)
    window.addEventListener('pageshow', updateAccount)
    document.addEventListener('visibilitychange', updateAccount)
    return () => {
      window.removeEventListener('storage', updateAccount)
      window.removeEventListener('focus', updateAccount)
      window.removeEventListener('pageshow', updateAccount)
      document.removeEventListener('visibilitychange', updateAccount)
    }
  }, [])

  loadMoreRef.current = loadMore
  resetKeyRef.current = resetKey

  useEffect(() => {
    gestureRef.current = 0
    handledGestureRef.current = 0
    pendingRef.current = false
    setAutoLoads(0)
  }, [resetKey])

  useEffect(() => {
    if (!hasAccount || !hasMore || loading || loadingMore || autoLoads >= maxAutoLoads || loadedCount >= 27) return undefined

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
  }, [hasAccount, hasMore, loading, loadingMore, autoLoads, maxAutoLoads, loadedCount, resetKey])

  return { sentinelRef, autoLoads, hasAccount, showManualLoad: hasAccount && (autoLoads >= maxAutoLoads || loadedCount >= 27) }
}

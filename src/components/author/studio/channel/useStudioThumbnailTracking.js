import { useCallback, useEffect, useRef } from 'react'
import { hasStudioViewerSession, postStudioThumbnailEvent } from '../../../../services/shadowStudioAdvancedMetricsApi'

const IMPRESSION_HOLD_MS = 800
const MAX_LOCAL_KEYS = 1500
const seenImpressions = new Set()
const inflightImpressions = new Map()

function dedupeKey(videoId, surface) {
  return `${new Date().toISOString().slice(0, 10)}:${videoId}:${surface}`
}

function markSeen(key) {
  seenImpressions.add(key)
  while (seenImpressions.size > MAX_LOCAL_KEYS) seenImpressions.delete(seenImpressions.values().next().value)
}

export default function useStudioThumbnailTracking({ videoId, surface = 'discover', enabled = true } = {}) {
  const element = useRef(null)
  const heldTimer = useRef(null)

  const reportImpression = useCallback(() => {
    if (!enabled || !videoId || !hasStudioViewerSession()) return Promise.resolve(null)
    const key = dedupeKey(videoId, surface)
    if (seenImpressions.has(key)) return Promise.resolve({ ok: true })
    if (inflightImpressions.has(key)) return inflightImpressions.get(key)
    const job = postStudioThumbnailEvent({ videoId, surface, action: 'impression' })
      .then(result => {
        markSeen(key)
        return result
      })
      .catch(() => null)
      .finally(() => inflightImpressions.delete(key))
    inflightImpressions.set(key, job)
    return job
  }, [videoId, surface, enabled])

  const onClick = useCallback(() => {
    if (!enabled || !videoId || !hasStudioViewerSession()) return
    void reportImpression().then(result => {
      if (result?.ok === true) {
        return postStudioThumbnailEvent({ videoId, surface, action: 'click' }).catch(() => {})
      }
      return undefined
    })
  }, [videoId, surface, enabled, reportImpression])

  const setThumbnailRef = useCallback(node => {
    element.current = node
  }, [])

  useEffect(() => {
    if (!enabled || !videoId || !element.current || typeof IntersectionObserver === 'undefined') return undefined
    const cancel = () => {
      if (heldTimer.current !== null) {
        clearTimeout(heldTimer.current)
        heldTimer.current = null
      }
    }
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0]
      if (!entry?.isIntersecting || entry.intersectionRatio < 0.5 || document.visibilityState === 'hidden') {
        cancel()
        return
      }
      if (heldTimer.current === null) {
        heldTimer.current = setTimeout(() => {
          heldTimer.current = null
          if (document.visibilityState !== 'hidden') void reportImpression()
        }, IMPRESSION_HOLD_MS)
      }
    }, { threshold: [0, 0.5, 1] })
    observer.observe(element.current)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') cancel()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancel()
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
    }
  }, [videoId, surface, enabled, reportImpression])

  return { setThumbnailRef, onClick, reportImpression }
}

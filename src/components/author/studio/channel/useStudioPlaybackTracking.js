import { useCallback, useEffect, useRef } from 'react'
import { hasStudioViewerSession, postStudioPlaybackEvent } from '../../../../services/shadowStudioAdvancedMetricsApi'

const INTERVAL_MS = 45000
const MAX_SECONDS = 43200

function createSessionId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : null
}

export default function useStudioPlaybackTracking(videoId) {
  const state = useRef({ videoId, sessionId: null, playing: false, since: null, seconds: 0, chain: Promise.resolve(), timer: null })
  const blockedSession = useRef(null)

  const enqueue = useCallback((kind, value, keepalive = false) => {
    const session = state.current
    if (!session.sessionId || !hasStudioViewerSession()) return
    const event = { videoId: session.videoId, sessionId: session.sessionId, kind, playedSeconds: value }
    session.chain = session.chain.catch(() => {}).then(async () => {
      if (blockedSession.current === event.sessionId) return
      try {
        await postStudioPlaybackEvent(event, { keepalive })
      } catch {
        if (kind === 'start') blockedSession.current = event.sessionId
      }
    })
  }, [])

  const accrue = useCallback(() => {
    const session = state.current
    if (!session.playing || session.since === null) return session.seconds
    const now = performance.now()
    session.seconds = Math.min(MAX_SECONDS, session.seconds + Math.max(0, (now - session.since) / 1000))
    session.since = now
    return session.seconds
  }, [])

  const stopTimer = useCallback(() => {
    if (state.current.timer !== null) {
      clearInterval(state.current.timer)
      state.current.timer = null
    }
  }, [])

  const onPause = useCallback(() => {
    const session = state.current
    if (!session.playing) return
    accrue()
    session.playing = false
    session.since = null
    stopTimer()
    if (session.seconds > 0) enqueue('progress', session.seconds, true)
  }, [accrue, enqueue, stopTimer])

  const onPlay = useCallback(() => {
    const session = state.current
    if (session.playing || !hasStudioViewerSession() || document.visibilityState === 'hidden') return
    if (session.sessionId && blockedSession.current === session.sessionId) {
      session.sessionId = null
      session.seconds = 0
    }
    if (!session.sessionId) {
      session.sessionId = createSessionId()
      if (!session.sessionId) return
      session.seconds = 0
      enqueue('start', 0)
    }
    session.playing = true
    session.since = performance.now()
    stopTimer()
    session.timer = setInterval(() => {
      if (document.visibilityState === 'hidden') return
      const played = accrue()
      if (played > 0) enqueue('progress', played)
    }, INTERVAL_MS)
  }, [accrue, enqueue, stopTimer])

  const onEnded = useCallback(() => {
    const session = state.current
    if (!session.sessionId) return
    if (session.playing) accrue()
    session.playing = false
    session.since = null
    stopTimer()
    enqueue('end', session.seconds, true)
    session.sessionId = null
    session.seconds = 0
  }, [accrue, enqueue, stopTimer])

  useEffect(() => {
    const session = state.current
    if (session.videoId !== videoId) {
      if (session.sessionId) {
        if (session.playing) accrue()
        enqueue('end', session.seconds, true)
      }
      stopTimer()
      session.videoId = videoId
      session.sessionId = null
      session.playing = false
      session.since = null
      session.seconds = 0
    }
  }, [videoId, accrue, enqueue, stopTimer])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onPause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      const session = state.current
      if (session.sessionId) {
        if (session.playing) accrue()
        enqueue('end', session.seconds, true)
      }
      stopTimer()
      session.sessionId = null
      session.playing = false
      session.since = null
      session.seconds = 0
    }
  }, [onPause, accrue, enqueue, stopTimer])

  return { onPlay, onPause, onEnded }
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { recordFastReelViewV2 } from '../../../../services/fastReelViewsApi'

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const YOUTUBE_ORIGINS = new Set(['https://www.youtube-nocookie.com', 'https://www.youtube.com'])
const VIEW_COUNTED_EVENT = 'shadow:reel-view-counted'
const KHMER_OFFSET_MS = 7 * 60 * 60 * 1000

function currentKhmerDay() {
  return new Date(Date.now() + KHMER_OFFSET_MS).toISOString().slice(0, 10)
}

function addWatchedSegment(session, position, now) {
  if (!session.playing || document.visibilityState !== 'visible' ||
      !Number.isFinite(position) || !(session.duration > 0) || position < 0) {
    session.lastPosition = null
    session.lastAt = now
    return
  }
  const previous = session.lastPosition
  const elapsed = session.lastAt ? Math.max(0, (now - session.lastAt) / 1000) : 0
  session.lastPosition = position
  session.lastAt = now
  if (!Number.isFinite(previous)) return
  const advance = position - previous
  if (advance <= 0 || advance > Math.max(1, Math.min(3, elapsed * 2 + 0.75))) return
  let start = Math.max(0, previous)
  let end = Math.min(session.duration, position)
  if (end <= start) return
  const segments = []
  for (const [a, b] of session.coverage) {
    if (b < start || a > end) segments.push([a, b])
    else {
      start = Math.min(start, a)
      end = Math.max(end, b)
    }
  }
  segments.push([start, end])
  segments.sort((a, b) => a[0] - b[0])
  session.coverage = segments
  session.watched = Math.min(session.duration, segments.reduce((sum, [a, b]) => sum + b - a, 0))
}

function requiredWatchSeconds(duration) {
  return duration < 30 ? Math.max(3, duration * 0.6) : Math.max(20, duration * 0.2)
}

export default function useStudioReelViewTracking(video, youtubeId) {
  const videoId = String(video?.id || '')
  const eligible = video?.status === 'published' && video?.access_type === 'free' && Boolean(youtubeId)
  const debugEnabled = useMemo(() => {
    try { return new URLSearchParams(window.location.search).get('viewDebug') === '1' }
    catch { return false }
  }, [])
  const frameRef = useRef(null)
  const sessionRef = useRef(null)
  const [latestViewCount, setLatestViewCount] = useState(null)
  const [diagnostic, setDiagnostic] = useState({ phase: 'WAITING', code: '', detail: '', http: 0, at: '' })
  const timelineRef = useRef([])

  const trace = useCallback((phase, code, detail = '', http = 0) => {
    if (!debugEnabled) return
    const item = {
      phase: String(phase).slice(0, 48),
      code: String(code).slice(0, 64),
      detail: String(detail).slice(0, 180),
      http: Number(http) || 0,
      at: new Date().toISOString(),
      videoId,
    }
    timelineRef.current = [...timelineRef.current.slice(-19), item]
    setDiagnostic(item)
    if (phase === 'ERROR') console.warn('[SHADOW_STUDIO_REEL_VIEW_ERROR]', item)
  }, [debugEnabled, videoId])

  const sendCommand = useCallback((func) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      'https://www.youtube-nocookie.com'
    )
  }, [])

  const onIframeLoad = useCallback(() => {
    const session = sessionRef.current
    if (session) session.iframeLoaded = true
    if (!eligible) {
      trace('SKIPPED', 'REEL_PREVIEW_NOT_PUBLIC_FREE', 'Playback preview does not count public Reel views')
      return
    }
    trace('IFRAME', 'YOUTUBE_IFRAME_LOADED', 'Iframe loaded; attaching YouTube state listener')
    if (!youtubeId) return
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: youtubeId }),
      'https://www.youtube-nocookie.com'
    )
    sendCommand('getDuration')
  }, [eligible, youtubeId, sendCommand, trace])

  useEffect(() => {
    setLatestViewCount(null)
    timelineRef.current = []
    if (!eligible) {
      trace('SKIPPED', 'REEL_PREVIEW_NOT_PUBLIC_FREE', 'Only published free YouTube Reels count public views')
      return undefined
    }

    const session = {
      active: true,
      videoId,
      day: currentKhmerDay(),
      playing: false,
      ended: false,
      iframeLoaded: false,
      sawMessage: false,
      sawPlaying: false,
      startedAt: Date.now(),
      nextFastAt: 0,
      nextQualifiedAt: 0,
      fastInFlight: false,
      qualifiedInFlight: false,
      needsQualified: false,
      duration: 0,
      watched: 0,
      coverage: [],
      lastPosition: null,
      lastAt: 0,
    }
    sessionRef.current = session
    trace('READY', 'WAITING_FOR_YOUTUBE_PLAY', 'A View is only recorded after confirmed playback')
    const current = () => session.active && sessionRef.current === session

    const verifyReadback = async expected => {
      if (!debugEnabled || !current()) return
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/fast/videos/${encodeURIComponent(videoId)}?view_readback=${Date.now()}`,
          { cache: 'no-store' }
        )
        const body = await response.json().catch(() => null)
        if (!current()) return
        if (!response.ok || body?.ok !== true) {
          trace('ERROR', 'VIEW_READBACK_HTTP_FAILED', 'Readback of the public Reel counter failed', response.status)
          return
        }
        const actual = Number(body?.video?.view_count)
        if (!Number.isSafeInteger(actual) || actual < 0) {
          trace('ERROR', 'VIEW_READBACK_INVALID', 'The public Reel API returned an invalid counter', response.status)
        } else if (actual < expected) {
          trace('ERROR', 'VIEW_READBACK_BEHIND', `RPC total=${expected}; public API total=${actual}`, response.status)
        } else {
          trace('VERIFIED', 'VIEW_WRITE_READ_MATCH', `RPC total=${expected}; public API total=${actual}`, response.status)
        }
      } catch (error) {
        if (current()) trace('ERROR', 'VIEW_READBACK_NETWORK_FAILED', error?.message || 'Readback network error')
      }
    }

    const countedView = result => {
      const total = Number(result.view_count)
      setLatestViewCount(value => value == null ? total : Math.max(value, total))
      window.dispatchEvent(new CustomEvent(VIEW_COUNTED_EVENT, {
        detail: { videoId, total },
      }))
      trace('COUNTED', String(result.reason || 'view_counted').toUpperCase(), `SQL reported total=${total}`, 200)
      void verifyReadback(total)
    }

    const sendFastView = async () => {
      const now = Date.now()
      if (!current() || !session.playing || document.visibilityState !== 'visible' ||
          session.fastInFlight || session.qualifiedInFlight || session.needsQualified || now < session.nextFastAt) return
      session.fastInFlight = true
      session.nextFastAt = now + 60_000
      trace('API', 'FAST_VIEW_REQUEST_SENT', 'POST /api/fast/videos/:id/view/v2')
      try {
        const result = await recordFastReelViewV2(videoId, { mode: 'fast' })
        if (!current()) return
        const reason = String(result?.reason || '')
        if (result?.counted === true) {
          countedView(result)
        } else if (result?.requires_qualified_view === true || reason === 'qualified_view_required') {
          session.needsQualified = true
          session.coverage = []
          session.watched = 0
          session.lastPosition = null
          session.nextQualifiedAt = 0
          trace('SQL', 'QUALIFIED_VIEW_REQUIRED', `fast_used=${result?.fast_used ?? 'unknown'}`, 200)
        } else if (reason === 'fast_cooldown') {
          session.nextFastAt = Date.now() + 61_000
          trace('SQL', 'FAST_COOLDOWN', 'Server requires at least 1 minute between Fast Views', 200)
        } else if (reason === 'qualified_cooldown') {
          session.nextFastAt = Date.now() + 10 * 60_000
          trace('SQL', 'QUALIFIED_COOLDOWN', 'Server qualified-view cooldown is active', 200)
        } else if (reason === 'reel_unavailable') {
          session.nextFastAt = Infinity
          trace('ERROR', 'REEL_UNAVAILABLE', 'SQL did not find an eligible published free YouTube Reel', 200)
        } else {
          session.nextFastAt = Date.now() + 60_000
          trace('ERROR', reason.toUpperCase() || 'VIEW_NOT_COUNTED', 'SQL did not count Fast View', 200)
        }
      } catch (error) {
        if (!current()) return
        session.nextFastAt = Date.now() + ([401, 403].includes(Number(error?.status)) ? 5 * 60_000 : 60_000)
        trace('ERROR', error?.code || 'FAST_VIEW_API_FAILED', error?.reason || error?.message || 'Fast View API failed', error?.status)
      } finally {
        if (current()) session.fastInFlight = false
      }
    }

    const sendQualifiedView = async () => {
      if (!current() || !session.needsQualified || session.qualifiedInFlight ||
          Date.now() < session.nextQualifiedAt || !(session.duration > 0) ||
          session.watched < requiredWatchSeconds(session.duration)) return
      session.qualifiedInFlight = true
      session.nextQualifiedAt = Date.now() + 15_000
      trace('API', 'QUALIFIED_VIEW_REQUEST_SENT', `watched=${session.watched.toFixed(1)}s; duration=${session.duration.toFixed(1)}s`)
      try {
        const result = await recordFastReelViewV2(videoId, {
          mode: 'qualified',
          watchedSeconds: Math.min(session.duration, session.watched),
          durationSeconds: session.duration,
        })
        if (!current()) return
        const reason = String(result?.reason || '')
        if (result?.counted === true) {
          session.needsQualified = false
          session.nextFastAt = Date.now() + 10 * 60_000
          countedView(result)
        } else if (reason === 'watch_time_pending') {
          trace('SQL', 'WATCH_TIME_PENDING', 'Server requires additional confirmed viewing time', 200)
        } else if (reason === 'qualification_session_required' || reason === 'fast_view_available') {
          session.needsQualified = false
          session.nextFastAt = Date.now() + 2_000
          trace('SQL', reason.toUpperCase(), 'Server requests a new Fast View session', 200)
        } else if (reason === 'qualified_cooldown') {
          session.needsQualified = false
          session.nextFastAt = Date.now() + 10 * 60_000
          trace('SQL', 'QUALIFIED_COOLDOWN', 'Server qualified-view cooldown is active', 200)
        } else {
          session.needsQualified = false
          session.nextFastAt = Date.now() + 60_000
          trace('ERROR', reason.toUpperCase() || 'QUALIFIED_NOT_COUNTED', 'SQL did not count Qualified View', 200)
        }
      } catch (error) {
        if (current()) {
          session.nextQualifiedAt = Date.now() + 60_000
          trace('ERROR', error?.code || 'QUALIFIED_VIEW_API_FAILED', error?.reason || error?.message || 'Qualified View API failed', error?.status)
        }
      } finally {
        if (current()) session.qualifiedInFlight = false
      }
    }

    const handleMessage = event => {
      if (event.source !== frameRef.current?.contentWindow) return
      if (!YOUTUBE_ORIGINS.has(event.origin)) {
        if (debugEnabled) trace('ERROR', 'YOUTUBE_ORIGIN_MISMATCH', String(event.origin).slice(0, 90))
        return
      }
      let data = event.data
      try { if (typeof data === 'string') data = JSON.parse(data) } catch { return }
      if (!data || typeof data !== 'object' || !current()) return
      if (['onReady', 'onStateChange', 'infoDelivery', 'onError'].includes(data.event)) {
        if (!session.sawMessage) trace('PLAYER', 'YOUTUBE_EVENTS_RECEIVED', String(data.event))
        session.sawMessage = true
      }
      if (data.event === 'onError') {
        session.playing = false
        trace('ERROR', 'YOUTUBE_PLAYER_ERROR', `YouTube error code=${String(data.info ?? 'unknown').slice(0, 20)}`)
        return
      }
      if (data.event === 'onReady') {
        trace('PLAYER', 'YOUTUBE_READY', 'YouTube player reported ready')
        sendCommand('getDuration')
      }
      if (data.event === 'infoDelivery') {
        const duration = data.info?.duration
        if (typeof duration === 'number' && Number.isFinite(duration) && duration > 0 && duration <= 43200) {
          session.duration = duration
        }
        const position = data.info?.currentTime
        if (typeof position === 'number' && Number.isFinite(position)) {
          addWatchedSegment(session, position, Date.now())
        }
      }
      const state = data.event === 'onStateChange' ? data.info :
        data.event === 'infoDelivery' ? data.info?.playerState : null
      if (state === 1) {
        if (!session.playing) {
          session.lastPosition = null
          session.lastAt = 0
        }
        session.playing = true
        session.ended = false
        if (!session.sawPlaying) trace('PLAYING', 'YOUTUBE_STATE_1', 'Real playback confirmed')
        session.sawPlaying = true
        void sendFastView()
      } else if ([0, 2, 5].includes(state)) {
        session.playing = false
        if (state === 0) {
          session.ended = true
          void sendQualifiedView()
        }
      }
    }

    const timer = window.setInterval(() => {
      if (!current()) return
      const today = currentKhmerDay()
      if (session.day !== today) {
        session.day = today
        session.needsQualified = false
        session.coverage = []
        session.watched = 0
        session.lastPosition = null
        session.nextFastAt = 0
        session.nextQualifiedAt = 0
      }
      if (session.playing) void sendFastView()
      if (session.playing || session.ended) void sendQualifiedView()
      if (debugEnabled && !session.iframeLoaded && Date.now() - session.startedAt > 12_000) {
        session.iframeLoaded = true
        trace('ERROR', 'YOUTUBE_IFRAME_TIMEOUT', 'YouTube iframe did not load in 12 seconds')
      }
      if (debugEnabled && session.iframeLoaded && !session.sawMessage &&
          Date.now() - session.startedAt > 18_000 && !session.messageTimeoutNoted) {
        session.messageTimeoutNoted = true
        trace('ERROR', 'YOUTUBE_PLAYER_EVENTS_MISSING', 'YouTube iframe loaded but no player events arrived')
      }
    }, 1000)
    window.addEventListener('message', handleMessage)
    return () => {
      session.active = false
      if (sessionRef.current === session) sessionRef.current = null
      window.clearInterval(timer)
      window.removeEventListener('message', handleMessage)
    }
  }, [videoId, eligible, debugEnabled, sendCommand, trace])

  const copyDiagnostic = useCallback(() => {
    const report = JSON.stringify({ videoId, timeline: timelineRef.current }, null, 2)
    return navigator.clipboard?.writeText(report)
  }, [videoId])

  return { frameRef, onIframeLoad, debugEnabled, diagnostic, copyDiagnostic, latestViewCount }
}

import { useCallback, useEffect, useRef, useState } from 'react'

const PLAYER_ORIGINS = new Set([
  'https://www.youtube-nocookie.com',
  'https://www.youtube.com',
])
const POLL_INTERVAL_MS = 750

function formatTime(rawSeconds) {
  const seconds = Math.floor(Math.max(0, Number(rawSeconds) || 0))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  const two = value => String(value).padStart(2, '0')
  return hours ? `${hours}:${two(minutes)}:${two(remaining)}` : `${two(minutes)}:${two(remaining)}`
}

function validSeconds(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

/**
 * The current Fast player already uses enablejsapi=1 and postMessage.
 * Only listens to the active iframe and does not call Shadow's API.
 * A full YouTube player replacement is NOT needed.
 */
export default function FastReelSeekBar({ active, videoId, frameRef, visible = true, t }) {
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [previewTime, setPreviewTime] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const draggingRef = useRef(false)

  const send = useCallback((name, args = []) => {
    const frame = frameRef?.current
    if (!frame?.contentWindow) return
    frame.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: name, args }),
      'https://www.youtube-nocookie.com'
    )
  }, [frameRef])

  useEffect(() => {
    setDuration(0)
    setCurrentTime(0)
    setPreviewTime(null)
    setIsLive(false)
    draggingRef.current = false
  }, [active, videoId])

  useEffect(() => {
    if (!active || !videoId) return undefined

    const receive = event => {
      if (event.source !== frameRef?.current?.contentWindow || !PLAYER_ORIGINS.has(event.origin)) return
      let data = event.data
      try { if (typeof data === 'string') data = JSON.parse(data) } catch { return }
      if (!data || typeof data !== 'object') return

      const info = data.event === 'infoDelivery' ? data.info : null
      if (!info || typeof info !== 'object') return

      const videoInfo = info.videoData
      if (videoInfo && typeof videoInfo === 'object' &&
        (videoInfo.isLive === true || videoInfo.isLiveContent === true)) {
        setIsLive(true)
        return
      }

      if (validSeconds(info.duration) && info.duration > 0) {
        setDuration(old => Math.abs(old - info.duration) >= 0.4 ? info.duration : old)
      }
      if (!draggingRef.current && validSeconds(info.currentTime)) {
        setCurrentTime(old => Math.abs(old - info.currentTime) >= 0.2 ? info.currentTime : old)
      }
    }

    window.addEventListener('message', receive)
    // The iframe API sends infoDelivery while playing. Periodic getter commands
    // also cover paused/buffering states without making backend requests.
    const poll = () => {
      send('getDuration')
      if (!draggingRef.current) send('getCurrentTime')
    }
    poll()
    const interval = window.setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      window.removeEventListener('message', receive)
      window.clearInterval(interval)
    }
  }, [active, videoId, frameRef, send])

  if (!active || !visible) return null

  const canSeek = !isLive && Number.isFinite(duration) && duration > 0
  const clamp = seconds => Math.min(canSeek ? duration : 0, Math.max(0, Number(seconds) || 0))
  const shownTime = clamp(previewTime === null ? currentTime : previewTime)
  const fraction = canSeek ? Math.min(100, Math.max(0, (shownTime / duration) * 100)) : 0

  const commit = rawValue => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const next = clamp(rawValue)
    setCurrentTime(next)
    setPreviewTime(null)
    // allowSeekAhead=true: jump to a segment not yet buffered.
    send('seekTo', [next, true])
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-[45] px-3 pb-1 text-white"
      onPointerDown={event => event.stopPropagation()}
      onPointerMove={event => event.stopPropagation()}
      onPointerUp={event => event.stopPropagation()}
      onClick={event => event.stopPropagation()}
      onDoubleClick={event => event.stopPropagation()}
    >
      <div className="px-0.5 text-[13px] font-medium leading-5 tabular-nums drop-shadow-md">
        <span>{formatTime(shownTime)} / {isLive ? 'LIVE' : canSeek ? formatTime(duration) : '--:--'}</span>
      </div>
      <div className="relative flex h-10 w-full items-center touch-none">
        <div aria-hidden="true" className="pointer-events-none relative h-1 w-full rounded-full bg-white/45">
          <div className="h-full rounded-full bg-white" style={{ width: `${fraction}%` }} />
          <span
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
            style={{ left: `clamp(5px, ${fraction}%, calc(100% - 5px))` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max={canSeek ? duration : 1}
          step="0.1"
          value={shownTime}
          disabled={!canSeek}
          aria-label={t('fastReels.seek')}
          aria-valuetext={`${formatTime(shownTime)} / ${formatTime(duration)}`}
          className="absolute inset-0 z-10 h-10 w-full cursor-pointer touch-none opacity-0"
          onPointerDown={event => {
            event.stopPropagation()
            draggingRef.current = true
            try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* optional on older browsers */ }
          }}
          onChange={event => {
            draggingRef.current = true
            setPreviewTime(clamp(event.target.value))
          }}
          onPointerUp={event => {
            event.stopPropagation()
            commit(event.currentTarget.value)
          }}
          onTouchEnd={event => {
            event.stopPropagation()
            commit(event.currentTarget.value)
          }}
          onPointerCancel={() => {
            draggingRef.current = false
            setPreviewTime(null)
          }}
          onKeyUp={event => {
            if (['ArrowRight', 'ArrowLeft', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
              draggingRef.current = true
              commit(event.currentTarget.value)
            }
          }}
          onBlur={event => commit(event.currentTarget.value)}
        />
      </div>
    </div>
  )
}

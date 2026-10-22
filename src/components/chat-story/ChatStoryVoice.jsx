import { useEffect, useRef, useState } from 'react'

export function getChatVoiceUrl(message) {
  const value = message?.audio_url || message?.audioUrl || message?.voice_url || message?.voiceUrl || ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''
  } catch {
    return ''
  }
}

export function isChatVoiceMessage(message) {
  return ['audio', 'voice'].includes(message?.type) && Boolean(getChatVoiceUrl(message))
}

export function getChatVoiceDuration(message) {
  const duration = Number(message?.audio_duration ?? message?.audioDuration ?? message?.duration_seconds ?? message?.duration)
  return Number.isFinite(duration) && duration > 0 ? Math.min(60, duration) : 0
}

export function getChatRecordingDelay(message) {
  return Math.min(8000, Math.max(1200, (getChatVoiceDuration(message) || 4) * 350))
}

function clock(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function ChatStoryRecording({ elapsed = 0, label = 'Recording voice…' }) {
  return (
    <div role="status" aria-label={label} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, color: 'var(--cs-accent, #8054aa)' }}>
      <i className="fa-solid fa-microphone" aria-hidden="true" />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{label}</span>
      <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24 }}>
        {[8, 16, 23, 12, 20, 9].map((height, index) => (
          <span key={index} style={{ width: 3, height, borderRadius: 3, background: 'currentColor', animation: `cs-voice-wave 700ms ${index * 90}ms infinite alternate ease-in-out` }} />
        ))}
      </span>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>{clock(elapsed / 1000)}</span>
      <style>{'@keyframes cs-voice-wave{from{transform:scaleY(.35)}to{transform:scaleY(1)}}@media(prefers-reduced-motion:reduce){[aria-label] span[style*="cs-voice-wave"]{animation:none!important}}'}</style>
    </div>
  )
}

export default function ChatStoryVoice({ message, autoPlay = false, paused = false, onEnded, onBlocked, onError, label = 'Voice message', retryLabel = 'Tap Play to listen', errorLabel = 'Voice could not be loaded' }) {
  const audioRef = useRef(null)
  const callbacks = useRef({ onEnded, onBlocked, onError })
  callbacks.current = { onEnded, onBlocked, onError }
  const [blocked, setBlocked] = useState(false)
  const [failed, setFailed] = useState(false)
  const source = getChatVoiceUrl(message)
  const attemptRef = useRef(0)

  useEffect(() => {
    setBlocked(false)
    setFailed(false)
  }, [source])

  useEffect(() => {
    const audio = audioRef.current
    const attempt = ++attemptRef.current
    if (!audio) return undefined
    if (paused || !autoPlay) {
      audio.pause()
      return undefined
    }
    const play = async () => {
      try {
        await audio.play()
        if (attempt !== attemptRef.current) return
        setBlocked(false)
      } catch (error) {
        if (attempt !== attemptRef.current || error.name === 'AbortError') return
        if (error.name === 'NotAllowedError') {
          setBlocked(true)
          callbacks.current.onBlocked?.()
        } else {
          setFailed(true)
          callbacks.current.onError?.(error)
        }
      }
    }
    play()
    return () => {
      attemptRef.current += 1
      audio.pause()
    }
  }, [source, autoPlay, paused])

  if (!source) return null

  return (
    <div style={{ width: 'min(280px, 65vw)', maxWidth: '100%', padding: '9px 12px', borderRadius: 18, background: 'var(--cs-soft, #f1eef8)', color: 'var(--cs-text, #24201b)' }} onClick={(event) => event.stopPropagation()}>
      <audio ref={audioRef} src={source} controls preload="metadata" aria-label={label} style={{ display: 'block', width: '100%', height: 40 }} onPlay={() => setBlocked(false)} onEnded={() => callbacks.current.onEnded?.()} onError={() => {
        setFailed(true)
        callbacks.current.onError?.(new Error('VOICE_LOAD_FAILED'))
      }} />
      {blocked || failed ? <p role="status" style={{ margin: '6px 0 0', fontSize: 12 }}>{failed ? errorLabel : retryLabel}</p> : null}
    </div>
  )
}

import { useEffect, useRef } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function normalizePercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(100, Math.max(0, Math.round(number)))
}

export default function useReadingProgressSync({
  storyId,
  episodeId,
  readingPercent,
  enabled,
}) {
  const lastSavedRef = useRef('')
  const latestRef = useRef(null)

  useEffect(() => {
    lastSavedRef.current = ''
  }, [storyId, episodeId])

  useEffect(() => {
    const token = getReaderToken()

    if (!enabled || !token || !storyId || !episodeId) {
      latestRef.current = null
      return undefined
    }

    const percent = normalizePercent(readingPercent)
    const signature = `${storyId}:${episodeId}:${percent}`

    latestRef.current = {
      token,
      storyId,
      episodeId,
      percent,
      signature,
    }

    if (lastSavedRef.current === signature) return undefined

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reading-progress`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            story_id: storyId,
            episode_id: episodeId,
            reading_percent: percent,
          }),
        })

        const data = await response.json().catch(() => ({}))

        if (response.ok && data.ok !== false) {
          lastSavedRef.current = signature
        }
      } catch {
      }
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [enabled, episodeId, readingPercent, storyId])

  useEffect(() => {
    const saveLatest = () => {
      const current = latestRef.current

      if (!current || lastSavedRef.current === current.signature) return

      fetch(`${API_BASE_URL}/api/reading-progress`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${current.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story_id: current.storyId,
          episode_id: current.episodeId,
          reading_percent: current.percent,
        }),
        keepalive: true,
      }).catch(() => {})
    }

    window.addEventListener('pagehide', saveLatest)
    document.addEventListener('visibilitychange', saveLatest)

    return () => {
      window.removeEventListener('pagehide', saveLatest)
      document.removeEventListener('visibilitychange', saveLatest)
    }
  }, [])
}

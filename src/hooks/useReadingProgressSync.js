import { useCallback, useEffect, useRef } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SAVE_PERCENT_STEP = 5
const SAVE_MAX_DELAY_MS = 30 * 1000
const SAVE_CHECK_INTERVAL_MS = 5 * 1000

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
  const latestRef = useRef(null)
  const baselineKeyRef = useRef('')
  const lastSavedRef = useRef('')
  const lastSavedPercentRef = useRef(null)
  const lastSavedAtRef = useRef(0)
  const pendingRef = useRef('')
  const inFlightRef = useRef(false)

  const saveCurrent = useCallback(async (current) => {
    if (!current) return false
    if (lastSavedRef.current === current.signature) return false
    if (pendingRef.current === current.signature) return false
    if (inFlightRef.current) return false

    inFlightRef.current = true
    pendingRef.current = current.signature

    try {
      const response = await fetch(`${API_BASE_URL}/api/reading-progress`, {
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
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        return false
      }

      if (baselineKeyRef.current === current.key) {
        lastSavedRef.current = current.signature
        lastSavedPercentRef.current = current.percent
        lastSavedAtRef.current = Date.now()
      }

      return true
    } catch {
      return false
    } finally {
      if (pendingRef.current === current.signature) {
        pendingRef.current = ''
      }
      inFlightRef.current = false
    }
  }, [])

  useEffect(() => {
    const token = getReaderToken()

    if (!enabled || !token || !storyId || !episodeId) {
      latestRef.current = null
      return
    }

    const percent = normalizePercent(readingPercent)
    const key = `${storyId}:${episodeId}`
    const signature = `${key}:${percent}`

    const current = {
      token,
      storyId,
      episodeId,
      percent,
      key,
      signature,
    }

    const previous = latestRef.current

if (
  previous &&
  previous.key !== key &&
  lastSavedRef.current !== previous.signature &&
  pendingRef.current !== previous.signature
) {
  void saveCurrent(previous)
}

    latestRef.current = current

    if (baselineKeyRef.current !== key) {
      baselineKeyRef.current = key
      lastSavedRef.current = signature
      lastSavedPercentRef.current = percent
      lastSavedAtRef.current = Date.now()
      pendingRef.current = ''
      return
    }

    if (lastSavedRef.current === signature) return

    const lastPercent = lastSavedPercentRef.current

    if (
      Number.isFinite(lastPercent) &&
      Math.abs(percent - lastPercent) >= SAVE_PERCENT_STEP
    ) {
      void saveCurrent(current)
    }
  }, [
    enabled,
    episodeId,
    readingPercent,
    saveCurrent,
    storyId,
  ])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = latestRef.current

      if (!current) return
      if (lastSavedRef.current === current.signature) return
      if (pendingRef.current === current.signature) return

      const elapsed =
        Date.now() - Number(lastSavedAtRef.current || 0)

      if (elapsed < SAVE_MAX_DELAY_MS) return

      void saveCurrent(current)
    }, SAVE_CHECK_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [saveCurrent])

  useEffect(() => {
    const saveLatest = () => {
      const current = latestRef.current

      if (!current) return
      if (lastSavedRef.current === current.signature) return
      if (pendingRef.current === current.signature) return

      void saveCurrent(current)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveLatest()
      }
    }

    window.addEventListener('pagehide', saveLatest)
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      window.removeEventListener('pagehide', saveLatest)
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [saveCurrent])
}

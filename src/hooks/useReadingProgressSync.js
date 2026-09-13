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
  const savedStateByKeyRef = useRef(new Map())
  const inFlightByStoryRef = useRef(new Map())
  const queuedByStoryRef = useRef(new Map())

  const saveCurrent = useCallback(async (current) => {
    if (!current) return false

    const state = savedStateByKeyRef.current.get(current.key)

    if (state?.lastSavedSignature === current.signature) {
      return false
    }

    const storyKey = String(current.storyId)

    if (inFlightByStoryRef.current.has(storyKey)) {
      queuedByStoryRef.current.set(storyKey, current)
      return false
    }

    inFlightByStoryRef.current.set(
      storyKey,
      current.signature
    )

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

      savedStateByKeyRef.current.set(current.key, {
        lastSavedSignature: current.signature,
        lastSavedPercent: current.percent,
        lastSavedAt: Date.now(),
      })

      return true
    } catch {
      return false
    } finally {
      if (
        inFlightByStoryRef.current.get(storyKey) ===
        current.signature
      ) {
        inFlightByStoryRef.current.delete(storyKey)
      }

      const queued =
        queuedByStoryRef.current.get(storyKey)

      if (queued) {
        queuedByStoryRef.current.delete(storyKey)

        const queuedState =
          savedStateByKeyRef.current.get(queued.key)

        if (
          queuedState?.lastSavedSignature !==
          queued.signature
        ) {
          void saveCurrent(queued)
        }
      }
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
      previous.key !== key
    ) {
      const previousState =
        savedStateByKeyRef.current.get(previous.key)

      if (
        previousState?.lastSavedSignature !==
        previous.signature
      ) {
        void saveCurrent(previous)
      }
    }

    latestRef.current = current

    let state =
      savedStateByKeyRef.current.get(key)

    if (!state) {
      state = {
        lastSavedSignature: signature,
        lastSavedPercent: percent,
        lastSavedAt: Date.now(),
      }

      savedStateByKeyRef.current.set(key, state)
      return
    }

    if (state.lastSavedSignature === signature) {
      return
    }

    if (
      Math.abs(
        percent -
        Number(state.lastSavedPercent || 0)
      ) >= SAVE_PERCENT_STEP
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

      const state =
        savedStateByKeyRef.current.get(current.key)

      if (!state) return
      if (
        state.lastSavedSignature ===
        current.signature
      ) {
        return
      }

      if (
        Date.now() -
          Number(state.lastSavedAt || 0) <
        SAVE_MAX_DELAY_MS
      ) {
        return
      }

      void saveCurrent(current)
    }, SAVE_CHECK_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [saveCurrent])

  useEffect(() => {
    const saveLatest = () => {
      const current = latestRef.current

      if (!current) return

      const state =
        savedStateByKeyRef.current.get(current.key)

      if (
        state?.lastSavedSignature ===
        current.signature
      ) {
        return
      }

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

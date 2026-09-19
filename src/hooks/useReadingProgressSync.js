import { useCallback, useEffect, useRef } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SAVE_PERCENT_STEP = 10
const SAVE_MAX_DELAY_MS = 60 * 1000
const SAVE_CHECK_INTERVAL_MS = 10 * 1000
const RETRY_BASE_MS = 20 * 1000
const RETRY_MAX_MS = 5 * 60 * 1000
const MAX_TRACKED_KEYS = 150

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function normalizePercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(100, Math.max(0, Math.round(number)))
}

function enqueueProgress(pendingByStory, storyKey, current, priority = false) {
  const pending = pendingByStory.get(storyKey) || []
  const existingIndex = pending.findIndex((item) => item.key === current.key)
  if (existingIndex >= 0) {
    if (!priority) pending[existingIndex] = current
  } else if (priority) {
    pending.unshift(current)
  } else {
    pending.push(current)
  }
  pendingByStory.set(storyKey, pending)
}

function dequeueProgress(pendingByStory, storyKey) {
  const pending = pendingByStory.get(storyKey)
  if (!pending?.length) return null
  const next = pending.shift()
  if (!pending.length) pendingByStory.delete(storyKey)
  return next
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
  const retryByStoryRef = useRef(new Map())
  const rejectedEpisodeKeysRef = useRef(new Set())
  const rejectedStoryKeysRef = useRef(new Set())

  const saveCurrent = useCallback(async (current) => {
    if (!current || current.percent <= 0) return false

    const storyKey = `${current.token}:${current.storyId}`
    if (rejectedStoryKeysRef.current.has(storyKey) || rejectedEpisodeKeysRef.current.has(current.key)) return false

    const state = savedStateByKeyRef.current.get(current.key)
    if (state?.lastSavedSignature === current.signature) return false

    const inFlight = inFlightByStoryRef.current.get(storyKey)
    if (inFlight) {
      if (inFlight !== current.signature) enqueueProgress(queuedByStoryRef.current, storyKey, current)
      return false
    }

    const retry = retryByStoryRef.current.get(storyKey)
    if (retry && Date.now() < retry.nextAttemptAt) {
      enqueueProgress(queuedByStoryRef.current, storyKey, current)
      return false
    }

    inFlightByStoryRef.current.set(storyKey, current.signature)
    let saved = false
    let permanentFailure = false

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
        permanentFailure = response.status >= 400 && response.status < 500 && ![408, 409, 429].includes(response.status)
        if (permanentFailure) {
          if (response.status === 401 || response.status === 403) {
            rejectedStoryKeysRef.current.add(storyKey)
            queuedByStoryRef.current.delete(storyKey)
          } else {
            rejectedEpisodeKeysRef.current.add(current.key)
            if (rejectedEpisodeKeysRef.current.size > MAX_TRACKED_KEYS) {
              rejectedEpisodeKeysRef.current.delete(rejectedEpisodeKeysRef.current.values().next().value)
            }
          }
        }
        return false
      }

      const now = Date.now()
      savedStateByKeyRef.current.set(current.key, {
        lastSavedSignature: current.signature,
        lastSavedPercent: current.percent,
        lastSavedAt: now,
      })
      retryByStoryRef.current.delete(storyKey)
      saved = true
      return true
    } catch {
      return false
    } finally {
      if (!saved && !permanentFailure) {
        const failures = Math.min(5, Number(retryByStoryRef.current.get(storyKey)?.failures || 0) + 1)
        retryByStoryRef.current.set(storyKey, {
          failures,
          nextAttemptAt: Date.now() + Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** (failures - 1)),
        })
      }
      if (permanentFailure) retryByStoryRef.current.delete(storyKey)

      if (inFlightByStoryRef.current.get(storyKey) === current.signature) {
        inFlightByStoryRef.current.delete(storyKey)
      }

      if (!saved && !permanentFailure) {
        enqueueProgress(queuedByStoryRef.current, storyKey, current, true)
      } else {
        let queued = dequeueProgress(queuedByStoryRef.current, storyKey)
        while (queued && (
          rejectedStoryKeysRef.current.has(storyKey) ||
          rejectedEpisodeKeysRef.current.has(queued.key) ||
          queued.signature === savedStateByKeyRef.current.get(queued.key)?.lastSavedSignature
        )) {
          queued = dequeueProgress(queuedByStoryRef.current, storyKey)
        }
        if (queued) void saveCurrent(queued)
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
    const key = `${token}:${storyId}:${episodeId}`
    const current = {
      token,
      storyId,
      episodeId,
      percent,
      key,
      signature: `${key}:${percent}`,
    }

    const previous = latestRef.current
    if (previous && previous.key !== key && previous.percent > 0) {
      const previousState = savedStateByKeyRef.current.get(previous.key)
      if (previousState?.lastSavedSignature !== previous.signature) {
        void saveCurrent(previous)
      }
    }

    latestRef.current = current

    let state = savedStateByKeyRef.current.get(key)
    if (!state) {
      state = {
        lastSavedSignature: null,
        lastSavedPercent: 0,
        lastSavedAt: Date.now(),
      }
      if (savedStateByKeyRef.current.size >= MAX_TRACKED_KEYS) {
        savedStateByKeyRef.current.delete(savedStateByKeyRef.current.keys().next().value)
      }
      savedStateByKeyRef.current.set(key, state)
    }

    if (
      percent > 0 &&
      state.lastSavedSignature !== current.signature &&
      (percent >= 100 || Math.abs(percent - Number(state.lastSavedPercent || 0)) >= SAVE_PERCENT_STEP)
    ) {
      void saveCurrent(current)
    }
  }, [enabled, episodeId, readingPercent, saveCurrent, storyId])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      const current = latestRef.current
      if (current && current.percent > 0) {
        const state = savedStateByKeyRef.current.get(current.key)
        if (
          state?.lastSavedSignature !== current.signature &&
          Date.now() - Number(state?.lastSavedAt || 0) >= SAVE_MAX_DELAY_MS
        ) {
          void saveCurrent(current)
        }
      }

      for (const [storyKey] of [...queuedByStoryRef.current]) {
        if (inFlightByStoryRef.current.has(storyKey)) continue
        const retry = retryByStoryRef.current.get(storyKey)
        if (retry && Date.now() < retry.nextAttemptAt) continue
        const pending = dequeueProgress(queuedByStoryRef.current, storyKey)
        if (pending) void saveCurrent(pending)
      }
    }, SAVE_CHECK_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [saveCurrent])

  useEffect(() => {
    const saveLatest = () => {
      const current = latestRef.current
      if (!current || current.percent <= 0) return
      if (savedStateByKeyRef.current.get(current.key)?.lastSavedSignature !== current.signature) {
        void saveCurrent(current)
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveLatest()
    }

    window.addEventListener('pagehide', saveLatest)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('pagehide', saveLatest)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [saveCurrent])
}

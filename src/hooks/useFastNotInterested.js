import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getFastReaderToken,
  listMyFastNotInterested,
  setMyFastNotInterested,
} from '../services/fastNotInterestedApi'

// Guest feedback stays in this browser. Signed-in feedback is user-specific in Supabase.
const GUEST_KEY = 'shadow_fast_hidden_reels_v1'
const UNDO_WINDOW_MS = 4200
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const requestChains = new Map()

function readGuestHiddenIds() {
  try {
    const data = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]')
    return new Set(Array.isArray(data) ? data.filter(id => UUID.test(String(id))) : [])
  } catch {
    return new Set()
  }
}

// Serializes changes to the same Reel so a fast Undo cannot be overtaken by a slow Hide.
function queueUpdate(videoId, desired, token) {
  const previous = requestChains.get(videoId) || Promise.resolve()
  const next = previous.catch(() => {}).then(() =>
    setMyFastNotInterested(videoId, desired, { token }),
  )
  requestChains.set(videoId, next)
  void next.finally(() => {
    if (requestChains.get(videoId) === next) requestChains.delete(videoId)
  }).catch(() => {})
  return next
}

export default function useFastNotInterested(onError) {
  const tokenRef = useRef(getFastReaderToken())
  const token = tokenRef.current
  const signedIn = Boolean(token)
  const [hiddenIds, setHiddenIds] = useState(() =>
    token ? new Set() : readGuestHiddenIds(),
  )
  // Do not render/play the Fast feed until all server-hidden IDs are loaded.
  // Guests have their feedback synchronously from localStorage.
  const [feedbackReady, setFeedbackReady] = useState(!signedIn)
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackAttempt, setFeedbackAttempt] = useState(0)
  const [undoItem, setUndoItem] = useState(null)
  const undoRef = useRef(null)
  const overridesRef = useRef(new Map())
  const undoTimerRef = useRef(null)
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      window.clearTimeout(undoTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (signedIn) return undefined
    try { localStorage.setItem(GUEST_KEY, JSON.stringify([...hiddenIds])) } catch {}
    return undefined
  }, [hiddenIds, signedIn])

  useEffect(() => {
    if (!signedIn) return undefined
    const controller = new AbortController()
    let cancelled = false
    setFeedbackReady(false)
    setFeedbackError('')

    async function loadHiddenReels() {
      try {
        let offset = 0
        for (let page = 0; page < 50; page += 1) {
          const result = await listMyFastNotInterested({ token, offset, signal: controller.signal })
          if (cancelled) return
          if (!Array.isArray(result.video_ids)) {
            throw new Error('Invalid Fast feedback response')
          }
          setHiddenIds(previous => {
            const next = new Set(previous)
            for (const id of result.video_ids) {
              if (overridesRef.current.get(String(id)) === false) next.delete(String(id))
              else next.add(String(id))
            }
            return next
          })
          if (!result.pagination?.has_more) {
            // Not a single hidden Reel can flash before this completes.
            if (!cancelled) setFeedbackReady(true)
            return
          }
          const nextOffset = Number(result.pagination.next_offset)
          if (!Number.isSafeInteger(nextOffset) || nextOffset <= offset) {
            throw new Error('Invalid Fast feedback pagination')
          }
          offset = nextOffset
        }
        throw new Error('Too many hidden Reels to load safely')
      } catch (error) {
        if (!cancelled && error?.name !== 'AbortError') {
          // Fail closed: do NOT show an unfiltered feed on error.
          setFeedbackError(error?.message || 'Unable to load Fast feedback')
          onErrorRef.current?.(error)
        }
      }
    }
    void loadHiddenReels()
    return () => { cancelled = true; controller.abort() }
  }, [signedIn, token, feedbackAttempt])

  const retryFeedback = useCallback(() => {
    if (!signedIn) return
    setFeedbackReady(false)
    setFeedbackError('')
    setFeedbackAttempt(attempt => attempt + 1)
  }, [signedIn])

  const hide = useCallback((videoId, index) => {
    const id = String(videoId || '')
    if (!UUID.test(id)) return false
    window.clearTimeout(undoTimerRef.current)
    const entry = { id, index }
    undoRef.current = entry
    overridesRef.current.set(id, true)
    setHiddenIds(previous => new Set([...previous, id]))
    setUndoItem(entry)

    undoTimerRef.current = window.setTimeout(() => {
      if (undoRef.current === entry) {
        undoRef.current = null
        setUndoItem(null)
      }
    }, UNDO_WINDOW_MS)

    if (signedIn) {
      void queueUpdate(id, true, token).catch(error => {
        // Do not claim feedback was saved if the API failed.
        if (overridesRef.current.get(id) === true) {
          overridesRef.current.set(id, false)
          if (mountedRef.current) {
            setHiddenIds(previous => {
              const next = new Set(previous)
              next.delete(id)
              return next
            })
            if (undoRef.current === entry) {
              window.clearTimeout(undoTimerRef.current)
              undoRef.current = null
              setUndoItem(null)
            }
            onErrorRef.current?.(error)
          }
        }
      })
    }
    return true
  }, [signedIn, token])

  const undo = useCallback(() => {
    const entry = undoRef.current
    if (!entry) return null
    window.clearTimeout(undoTimerRef.current)
    undoRef.current = null
    setUndoItem(null)
    overridesRef.current.set(entry.id, false)
    setHiddenIds(previous => {
      const next = new Set(previous)
      next.delete(entry.id)
      return next
    })

    if (signedIn) {
      void queueUpdate(entry.id, false, token).catch(error => {
        // On failed Undo, restore the server's hidden state to prevent false success.
        overridesRef.current.set(entry.id, true)
        if (mountedRef.current) {
          setHiddenIds(previous => new Set([...previous, entry.id]))
          onErrorRef.current?.(error)
        }
      })
    }
    return entry
  }, [signedIn, token])

  return {
    hiddenIds,
    hide,
    undo,
    undoItem,
    feedbackReady,
    feedbackError,
    retryFeedback,
  }
}

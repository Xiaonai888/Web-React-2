import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, Plus } from 'lucide-react'
import SavedPostCollectionEditor from '../SavedPosts/SavedPostCollectionEditor'
import {
  createSavedPostCollection,
  deleteSavedPostBySource,
  fetchSavedPostStatus,
  getReaderToken,
  replaceSavedPostCollections,
  saveSavedPost,
} from '../../services/savedPostsApi'

// Short press: Save / Unsave immediately (account-backed).
// Long press: show only TikTok-style "New collection" floating action.
// Save counter is the public aggregate from GET /api/fast/videos/:id/saves.
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const SOURCE_TYPE = 'fast_video'
const HOLD_MS = 520

function displayCount(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en', {
    notation: 'compact', maximumFractionDigits: 1,
  }).format(Math.max(0, Number(value) || 0))
}

export default function FastReelSaveButton({ video, active, onAuthRequired, onError, onSuccess }) {
  const videoId = String(video?.id || '')
  const buttonRef = useRef(null)
  const holdTimerRef = useRef(null)
  const downRef = useRef(null)
  const suppressClickRef = useRef(false)
  const writeLockRef = useRef(false)
  const statusSeqRef = useRef(0)
  const countSeqRef = useRef(0)

  const [saved, setSaved] = useState(false)
  const [savedItem, setSavedItem] = useState(null)
  const [saveCount, setSaveCount] = useState(null)
  const [checking, setChecking] = useState(false)
  const [busy, setBusy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ right: 12, bottom: 100 })
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorSubmitting, setEditorSubmitting] = useState(false)
  const [editorError, setEditorError] = useState('')

  const notifyError = useCallback(error => {
    if (error?.status === 401 || error?.status === 403) onAuthRequired?.()
    else onError?.(new Error(error?.message || 'Unable to save Reel'))
  }, [onAuthRequired, onError])
  const notifyErrorRef = useRef(notifyError)
  notifyErrorRef.current = notifyError

  const refreshCount = useCallback(async signal => {
    if (!videoId) return
    const seq = ++countSeqRef.current
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/fast/videos/${encodeURIComponent(videoId)}/saves`,
        { signal, cache: 'no-store' },
      )
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.ok !== true || !Number.isFinite(Number(result.save_count))) {
        throw new Error(result.message || 'Unable to fetch save count')
      }
      if (!signal?.aborted && seq === countSeqRef.current) {
        setSaveCount(Math.max(0, Number(result.save_count)))
      }
    } catch (error) {
      // The count may be temporarily unavailable while the Backend is deploying.
      // Do not block Save or display an invented number.
      if (error?.name !== 'AbortError') {
        console.warn('[FAST_SAVE_COUNT]', error?.message || error)
      }
    }
  }, [videoId])

  useEffect(() => {
    if (!active || !videoId) return undefined
    const controller = new AbortController()
    void refreshCount(controller.signal)
    if (!getReaderToken()) {
      setSaved(false)
      setSavedItem(null)
      setChecking(false)
      return () => controller.abort()
    }

    const seq = ++statusSeqRef.current
    setChecking(true)
    fetchSavedPostStatus(SOURCE_TYPE, videoId, controller.signal)
      .then(data => {
        if (controller.signal.aborted || seq !== statusSeqRef.current || writeLockRef.current) return
        setSaved(Boolean(data.saved))
        setSavedItem(data.item || null)
      })
      .catch(error => {
        if (error?.name !== 'AbortError' && seq === statusSeqRef.current) {
          notifyErrorRef.current(error)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted && seq === statusSeqRef.current) setChecking(false)
      })
    return () => { ++statusSeqRef.current; controller.abort() }
  }, [active, videoId, refreshCount])

  useEffect(() => {
    if (!active) setMenuOpen(false)
  }, [active])

  useEffect(() => () => window.clearTimeout(holdTimerRef.current), [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = event => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const requireLogin = () => {
    if (getReaderToken()) return true
    onAuthRequired?.()
    return false
  }

  const payload = () => ({
    source_type: SOURCE_TYPE,
    source_id: videoId,
    source_url: `/fast?reel=${encodeURIComponent(videoId)}`,
    // The Backend verifies the Reel and generates a trusted snapshot.
    snapshot_data: {},
  })

  const toggleSaved = async () => {
    if (!videoId || checking || writeLockRef.current || !requireLogin()) return
    const wasSaved = saved
    writeLockRef.current = true
    ++statusSeqRef.current
    setBusy(true)
    setSaved(!wasSaved)
    setSaveCount(n => n === null ? null : Math.max(0, n + (wasSaved ? -1 : 1)))

    try {
      if (wasSaved) {
        await deleteSavedPostBySource(SOURCE_TYPE, videoId)
        setSavedItem(null)
        onSuccess?.('Removed from Saved Posts')
      } else {
        const result = await saveSavedPost(payload())
        if (!result?.item?.id) throw new Error('Reel was not saved')
        setSavedItem(result.item)
        onSuccess?.('Reel saved')
      }
      void refreshCount()
    } catch (error) {
      setSaved(wasSaved)
      setSaveCount(n => n === null ? null : Math.max(0, n + (wasSaved ? 1 : -1)))
      notifyError(error)
      void refreshCount()
    } finally {
      writeLockRef.current = false
      setBusy(false)
    }
  }

  const openHoldMenu = () => {
    if (!videoId) return
    const rect = buttonRef.current?.getBoundingClientRect()
    setMenuPosition({
      right: rect ? Math.max(10, window.innerWidth - rect.right) : 12,
      bottom: rect ? Math.max(16, window.innerHeight - rect.top + 12) : 100,
    })
    setMenuOpen(true)
  }

  const beginHold = event => {
    if (event.button !== undefined && event.button !== 0) return
    if (busy) return
    suppressClickRef.current = false
    downRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
    window.clearTimeout(holdTimerRef.current)
    holdTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = true
      downRef.current = null
      openHoldMenu()
    }, HOLD_MS)
  }

  const moveHold = event => {
    const down = downRef.current
    if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 12) {
      cancelHold()
      suppressClickRef.current = true
    }
  }

  function cancelHold() {
    window.clearTimeout(holdTimerRef.current)
    holdTimerRef.current = null
    downRef.current = null
  }

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    if (menuOpen) { setMenuOpen(false); return }
    void toggleSaved()
  }

  const createCollection = async data => {
    if (writeLockRef.current || !videoId || !requireLogin()) return
    writeLockRef.current = true
    setEditorSubmitting(true)
    setEditorError('')
    try {
      // Save only after the reader explicitly chooses New collection.
      let item = savedItem
      if (!item?.id) {
        const result = await saveSavedPost(payload())
        if (!result?.item?.id) throw new Error('Unable to save Reel for collection')
        item = result.item
        setSaved(true)
        setSavedItem(item)
        void refreshCount()
      }

      const response = await createSavedPostCollection(data)
      const collection = response?.collection
      if (!collection?.id) throw new Error('Unable to create collection')
      const ids = [...new Set([...(item.collections || []).map(x => x.id), collection.id])]
      const assignment = await replaceSavedPostCollections(item.id, ids)
      if (!assignment?.item) throw new Error('Collection created but Reel was not assigned')
      setSavedItem(assignment.item)
      setEditorOpen(false)
      onSuccess?.('Collection created and Reel added')
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        setEditorOpen(false)
        onAuthRequired?.()
      } else setEditorError(error?.message || 'Unable to create collection')
    } finally {
      writeLockRef.current = false
      setEditorSubmitting(false)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={saved ? 'Saved Reel; hold for New collection' : 'Save Reel; hold for New collection'}
        aria-pressed={saved}
        disabled={busy}
        onPointerDown={beginHold}
        onPointerMove={moveHold}
        onPointerUp={cancelHold}
        onPointerCancel={() => { cancelHold(); suppressClickRef.current = true }}
        onPointerLeave={cancelHold}
        onContextMenu={event => {
          event.preventDefault()
          cancelHold()
          suppressClickRef.current = true
          openHoldMenu()
        }}
        onClick={handleClick}
        className="flex min-h-10 w-12 touch-pan-y flex-col items-center justify-center gap-0.5 text-white drop-shadow-lg disabled:opacity-65"
      >
        <Bookmark size={25} fill={saved ? 'white' : 'none'} strokeWidth={2} />
        <span className="text-[10px] font-bold tabular-nums">{displayCount(saveCount)}</span>
      </button>

      {typeof document !== 'undefined' ? createPortal(
        <>
          {menuOpen && (
            <div className="fixed inset-0 z-[200001]" role="presentation">
              <button type="button" className="absolute inset-0 cursor-default" aria-label="Close collection menu" onClick={() => setMenuOpen(false)} />
              <div className="absolute z-10 rounded-[16px] bg-white p-1.5 text-[#111827] shadow-2xl" style={{ right: menuPosition.right, bottom: menuPosition.bottom, minWidth: 196 }}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    if (!requireLogin()) return
                    setEditorError('')
                    setEditorOpen(true)
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[15px] font-bold hover:bg-gray-100 active:bg-gray-100"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f1f1f1]"><Plus size={21} strokeWidth={2.5} /></span>
                  New collection
                </button>
              </div>
            </div>
          )}
          <SavedPostCollectionEditor
            open={editorOpen}
            collection={null}
            submitting={editorSubmitting}
            error={editorError}
            onClose={() => setEditorOpen(false)}
            onSubmit={createCollection}
          />
        </>, document.body,
      ) : null}
    </>
  )
}

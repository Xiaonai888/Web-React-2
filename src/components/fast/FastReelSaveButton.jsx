import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, Loader2 } from 'lucide-react'
import SavedPostCollectionSheet from '../SavedPosts/SavedPostCollectionSheet'
import SavedPostCollectionEditor from '../SavedPosts/SavedPostCollectionEditor'
import {
  createSavedPostCollection,
  deleteSavedPostBySource,
  fetchSavedPostCollections,
  fetchSavedPostStatus,
  getReaderToken,
  replaceSavedPostCollections,
  saveSavedPost,
} from '../../services/savedPostsApi'

// NEW: src/components/fast/FastReelSaveButton.jsx
// The account's existing Saved Posts API is the single source of truth.
// Short press: Save/Unsave. Long press/right click: Add to Collections.
const SOURCE_TYPE = 'fast_video'
const HOLD_MS = 520

export default function FastReelSaveButton({ video, active, onAuthRequired, onError, onSuccess }) {
  const reelId = String(video?.id || '')
  const [saved, setSaved] = useState(false)
  const [savedItem, setSavedItem] = useState(null)
  const [checking, setChecking] = useState(false)
  const [busy, setBusy] = useState(false)
  const [collections, setCollections] = useState([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorSubmitting, setEditorSubmitting] = useState(false)
  const [editorError, setEditorError] = useState('')
  const timerRef = useRef(null)
  const downPointRef = useRef(null)
  const heldRef = useRef(false)
  const writeLockRef = useRef(false)
  const statusSeqRef = useRef(0)

  const notifyError = useCallback((error) => {
    const message = error?.message || 'Unable to save Reel'
    if (error?.status === 401 || error?.status === 403) {
      onAuthRequired?.()
    } else {
      onError?.(new Error(message))
    }
  }, [onAuthRequired, onError])
  const notifyErrorRef = useRef(notifyError)
  notifyErrorRef.current = notifyError

  useEffect(() => {
    if (!active || !reelId || !getReaderToken()) return undefined
    const seq = ++statusSeqRef.current
    const controller = new AbortController()
    setChecking(true)
    fetchSavedPostStatus(SOURCE_TYPE, reelId, controller.signal)
      .then((data) => {
        if (seq !== statusSeqRef.current || writeLockRef.current) return
        setSaved(Boolean(data.saved))
        setSavedItem(data.item || null)
      })
      .catch((error) => {
        if (error?.name !== 'AbortError' && seq === statusSeqRef.current) {
          notifyErrorRef.current(error)
        }
      })
      .finally(() => {
        if (seq === statusSeqRef.current) setChecking(false)
      })
    return () => {
      ++statusSeqRef.current
      controller.abort()
    }
  }, [active, reelId])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const ensureAuthenticated = () => {
    if (getReaderToken()) return true
    onAuthRequired?.()
    return false
  }

  const savePayload = () => ({
    source_type: SOURCE_TYPE,
    source_id: reelId,
    source_url: `/fast?reel=${encodeURIComponent(reelId)}`,
    snapshot_data: {
      title: video?.title || 'Fast Reel',
      description: video?.description || '',
      thumbnail_url: video?.thumbnail_url || '',
    },
  })

  const toggleSaved = async () => {
    if (!reelId || writeLockRef.current || checking || !ensureAuthenticated()) return
    writeLockRef.current = true
    setBusy(true)
    try {
      if (saved) {
        await deleteSavedPostBySource(SOURCE_TYPE, reelId)
        setSaved(false)
        setSavedItem(null)
        onSuccess?.('Removed from Saved Posts')
      } else {
        const result = await saveSavedPost(savePayload())
        if (!result?.item?.id) throw new Error('Save completed without an item')
        setSaved(true)
        setSavedItem(result.item)
        onSuccess?.('Reel saved')
      }
    } catch (error) {
      notifyError(error)
    } finally {
      writeLockRef.current = false
      setBusy(false)
    }
  }

  const openCollections = async () => {
    if (!reelId || writeLockRef.current || checking || !ensureAuthenticated()) return
    writeLockRef.current = true
    setBusy(true)
    try {
      // A long press also saves an unsaved Reel before organizing it.
      const [status, collectionResult] = await Promise.all([
        savedItem?.id ? Promise.resolve({ item: savedItem }) : saveSavedPost(savePayload()),
        fetchSavedPostCollections(),
      ])
      if (!status?.item?.id) throw new Error('Unable to prepare Reel for collections')
      setSaved(true)
      setSavedItem(status.item)
      setCollections(Array.isArray(collectionResult.collections) ? collectionResult.collections : [])
      setPickerOpen(true)
    } catch (error) {
      notifyError(error)
    } finally {
      writeLockRef.current = false
      setBusy(false)
    }
  }

  const saveCollections = async (ids) => {
    if (writeLockRef.current || !savedItem?.id) return
    writeLockRef.current = true
    setBusy(true)
    try {
      const result = await replaceSavedPostCollections(savedItem.id, ids)
      if (!result?.item) throw new Error('Unable to update collections')
      setSavedItem(result.item)
      setPickerOpen(false)
      onSuccess?.('Reel collections updated')
    } catch (error) {
      notifyError(error)
    } finally {
      writeLockRef.current = false
      setBusy(false)
    }
  }

  const createCollection = async (payload) => {
    if (writeLockRef.current || !savedItem?.id) return
    writeLockRef.current = true
    setEditorSubmitting(true)
    setEditorError('')
    try {
      const result = await createSavedPostCollection(payload)
      const collection = result?.collection
      if (!collection?.id) throw new Error('Unable to create collection')
      setCollections((previous) => [...previous, collection])
      const existingIds = (savedItem.collections || []).map((item) => item.id)
      const ids = [...new Set([...existingIds, collection.id])]
      const assigned = await replaceSavedPostCollections(savedItem.id, ids)
      if (!assigned?.item) throw new Error('Collection was created, but Reel was not added')
      setSavedItem(assigned.item)
      setEditorOpen(false)
      setPickerOpen(false)
      onSuccess?.('Collection created and Reel added')
    } catch (error) {
      setEditorError(error?.message || 'Unable to create collection')
    } finally {
      writeLockRef.current = false
      setEditorSubmitting(false)
    }
  }

  const cancelLongPress = () => {
    window.clearTimeout(timerRef.current)
    timerRef.current = null
  }
  const handleDown = (event) => {
    if (event.button !== 0 || busy || checking) return
    heldRef.current = false
    downPointRef.current = { x: event.clientX, y: event.clientY }
    cancelLongPress()
    timerRef.current = window.setTimeout(() => {
      heldRef.current = true
      downPointRef.current = null
      void openCollections()
    }, HOLD_MS)
  }
  const handleMove = (event) => {
    const down = downPointRef.current
    if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 12) {
      cancelLongPress()
      downPointRef.current = null
    }
  }
  const handleEnd = () => {
    cancelLongPress()
    downPointRef.current = null
  }
  const handleClick = () => {
    if (heldRef.current) {
      heldRef.current = false
      return
    }
    void toggleSaved()
  }

  return (
    <>
      <button
        type="button"
        aria-label={saved ? 'Saved Reel — long press for collections' : 'Save Reel — long press for collections'}
        aria-pressed={saved}
        disabled={busy || checking}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        onPointerLeave={cancelLongPress}
        onContextMenu={(event) => {
          event.preventDefault()
          cancelLongPress()
          if (heldRef.current) return
          if (event.button !== 2) heldRef.current = true
          void openCollections()
        }}
        onClick={handleClick}
        className="flex h-9 w-9 touch-pan-y items-center justify-center drop-shadow-lg disabled:opacity-60"
      >
        {busy || checking ? <Loader2 size={22} className="animate-spin" /> : (
          <Bookmark size={25} fill={saved ? 'white' : 'none'} />
        )}
      </button>
      {typeof document !== 'undefined' ? createPortal(
        <>
          <SavedPostCollectionSheet
            open={pickerOpen}
            item={savedItem}
            collections={collections}
            saving={busy}
            onClose={() => setPickerOpen(false)}
            onSave={saveCollections}
            onCreateCollection={() => { setPickerOpen(false); setEditorError(''); setEditorOpen(true) }}
          />
          <SavedPostCollectionEditor
            open={editorOpen}
            collection={null}
            submitting={editorSubmitting}
            error={editorError}
            onClose={() => { setEditorOpen(false); setPickerOpen(true) }}
            onSubmit={createCollection}
          />
        </>, document.body
      ) : null}
    </>
  )
}

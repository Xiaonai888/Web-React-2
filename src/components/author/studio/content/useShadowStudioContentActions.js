import { useCallback, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { studioVideoKind } from './ShadowStudioContentData'
import {
  removeStudioPlaylist,
  removeStudioVideo,
  renameStudioPlaylist,
  setStudioVideoKind,
  setStudioVideoPublishStatus,
} from './ShadowStudioContentApi'

export default function useShadowStudioContentActions({ onEdit, onChanged } = {}) {
  const { t } = useDisplayTranslation()
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const lockedRef = useRef(false)

  const run = useCallback(async (item, action, kind) => {
    if (!item?.id || lockedRef.current) return false
    if (kind === 'videos' && action === 'edit') {
      onEdit?.(item)
      return true
    }
    const isPlaylist = kind === 'playlists'
    const isDelete = action === 'delete'
    let nextName = ''
    if (isDelete && !window.confirm(`${t('shadowStudioNext.delete')}?`)) return false
    if (isPlaylist && action === 'rename') {
      const provided = window.prompt(t('shadowStudioNext.rename'), item.name || '')
      if (provided === null || provided.trim() === item.name) return false
      nextName = provided.trim()
      if (!nextName || nextName.length > 80) {
        setError('Playlist name must contain 1–80 characters.')
        return false
      }
    }
    if (isPlaylist && !['rename', 'delete'].includes(action)) return false
    if (!isPlaylist && !['toggle-status', 'move', 'delete'].includes(action)) return false

    lockedRef.current = true
    setBusyId(item.id)
    setError('')
    setNotice('')
    try {
      if (isPlaylist && action === 'rename') await renameStudioPlaylist(item.id, nextName)
      if (isPlaylist && action === 'delete') await removeStudioPlaylist(item.id)
      if (!isPlaylist && action === 'toggle-status') await setStudioVideoPublishStatus(item)
      if (!isPlaylist && action === 'move') {
        const next = studioVideoKind(item) === 'short' ? 'long' : 'short'
        await setStudioVideoKind(item.id, next)
      }
      if (!isPlaylist && action === 'delete') await removeStudioVideo(item.id)
      setNotice(t(action === 'delete' ? 'shadowStudioNext.delete' : 'shadowStudioNext.apply'))
      await onChanged?.({ kind, action, id: item.id })
      return true
    } catch (cause) {
      setError(cause?.message || 'Unable to save changes.')
      return false
    } finally {
      setBusyId('')
      lockedRef.current = false
    }
  }, [onChanged, onEdit, t])

  return {
    busyId,
    error,
    notice,
    clearFeedback: () => { setError(''); setNotice('') },
    videoAction: (video, action) => run(video, action, 'videos'),
    playlistAction: (playlist, action) => run(playlist, action, 'playlists'),
  }
}

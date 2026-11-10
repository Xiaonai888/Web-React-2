import { useCallback, useState } from 'react'

export default function useShadowStudioContentSelection() {
  const [playlist, setPlaylist] = useState(null)
  const [video, setVideo] = useState(null)
  const [editing, setEditing] = useState(null)

  const openPlaylist = useCallback(item => {
    if (!item?.id) return
    setVideo(null)
    setEditing(null)
    setPlaylist(item)
  }, [])

  const closePlaylist = useCallback(() => {
    setVideo(null)
    setEditing(null)
    setPlaylist(null)
  }, [])

  const openVideo = useCallback(item => {
    if (!item?.id) return
    setEditing(null)
    setVideo(item)
  }, [])

  const closeVideo = useCallback(() => setVideo(null), [])

  const editVideo = useCallback(item => {
    if (!item?.id) return
    setVideo(null)
    setEditing(item)
  }, [])

  const closeEditor = useCallback(() => setEditing(null), [])

  const afterMutation = useCallback(({ kind, action, id } = {}) => {
    if (kind === 'playlists' && action === 'delete') {
      setPlaylist(current => current?.id === id ? null : current)
    }
    if (kind === 'videos' && action === 'delete') {
      setVideo(current => current?.id === id ? null : current)
      setEditing(current => current?.id === id ? null : current)
    }
    if (kind === 'videos' && (action === 'move' || action === 'toggle-status')) {
      setVideo(current => current?.id === id ? null : current)
    }
  }, [])

  return {
    playlist, video, editing,
    openPlaylist, closePlaylist, openVideo, closeVideo,
    editVideo, closeEditor, afterMutation,
  }
}

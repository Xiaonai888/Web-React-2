import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommentSection from '../comments/CommentSection'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getPointerY(event) {
  if (event.touches?.length) return event.touches[0].clientY
  return event.clientY
}

export default function CommentsModal({
  open,
  story,
  targetType = 'story',
  targetId,
  episodes = [],
  title,
  onClose,
  onCommentChanged,
}) {
  const navigate = useNavigate()
  const sheetRef = useRef(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const draggingRef = useRef(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [episodeEchoTotal, setEpisodeEchoTotal] = useState(0)
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('')

useEffect(() => {
  if (open && targetType === 'episode') setSelectedEpisodeId(String(targetId || ''))
}, [open, targetId, targetType])

const activeEpisodeId = selectedEpisodeId || String(targetId || '')

  useEffect(() => {
    if (!open) return undefined

    setDragOffset(0)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open || targetType !== 'episode' || !targetId) {
      setEpisodeEchoTotal(0)
      return undefined
    }

    let ignore = false

    async function loadEpisodeEchoTotal() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/echoes/episode/${targetId}?page=1&limit=1`
        )

        const data = await response.json().catch(() => ({}))

        if (!ignore && response.ok && data.ok !== false) {
          setEpisodeEchoTotal(Number(data.total || 0))
        }
      } catch {
        if (!ignore) setEpisodeEchoTotal(0)
      }
    }

    loadEpisodeEchoTotal()

    return () => {
      ignore = true
    }
  }, [open, targetId, targetType])

  if (!open) return null

  const totalLikes = Number(
    story?.total_likes ||
      story?.like_count ||
      story?.likes_count ||
      0
  )

  const totalComments = Number(
    story?.total_comments ||
      story?.comment_count ||
      story?.comments_count ||
      0
  )

  const totalEcho =
    targetType === 'episode'
      ? episodeEchoTotal
      : Number(
          story?.total_echoes ||
            story?.echo_count ||
            story?.echoes_count ||
            story?.total_shares ||
            story?.share_count ||
            story?.shares_count ||
            0
        )

  const handleOpenEpisodeReactions = () => {
    if (targetType !== 'episode' || !story?.id || !targetId) return

    sessionStorage.setItem(
      'shadow_reopen_episode_comments',
      `${story.id}:${targetId}`
    )

    onClose()
    navigate(`/story/${story.id}/episode/${targetId}/reactions`)
  }

  const handleOpenEpisodeEchoes = () => {
    if (targetType !== 'episode' || !story?.id || !targetId) return

    sessionStorage.setItem(
      'shadow_reopen_episode_comments',
      `${story.id}:${targetId}`
    )

    onClose()
    navigate(`/story/${story.id}/episode/${targetId}/echoes`)
  }

  const handleDragStart = (event) => {
    draggingRef.current = true
    startYRef.current = getPointerY(event)
    currentYRef.current = getPointerY(event)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = (event) => {
    if (!draggingRef.current) return

    currentYRef.current = getPointerY(event)
    const nextOffset = Math.max(
      0,
      currentYRef.current - startYRef.current
    )

    setDragOffset(nextOffset)
  }

  const handleDragEnd = () => {
    if (!draggingRef.current) return

    const distance = Math.max(
      0,
      currentYRef.current - startYRef.current
    )

    draggingRef.current = false

    if (distance > 70) {
      onClose()
      return
    }

    setDragOffset(0)
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/45 px-0 sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close comments"
      />

      <section
        ref={sheetRef}
        className="relative flex h-[calc(100vh-12px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:h-[calc(100vh-24px)] sm:rounded-[28px]"
        style={{ transform: `translateY(${dragOffset}px)` }}
      >
        <div
          role="presentation"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          className={`shrink-0 cursor-grab bg-white px-4 ${
            targetType === 'story' ? 'h-6' : 'pt-2.5 pb-0'
          }`}
          style={{ touchAction: 'none' }}
        />

        {targetType !== 'story' ? (
          <header className="shrink-0 bg-white px-4 pb-4">
            <div className="grid grid-cols-3 items-center gap-2 text-center">
              <button
                type="button"
                onClick={handleOpenEpisodeReactions}
                className="flex items-center justify-center gap-1 text-[14px] font-normal text-[#111827] active:scale-95"
                aria-label="View people who reacted"
              >
                <i className="fa-solid fa-heart text-[14px] text-[#ff3b5f]" />
                <span>{totalLikes.toLocaleString()}</span>
              </button>

              <div className="rounded-full bg-[#f5f3fa] px-3 py-2 text-[14px] font-normal text-[#111827]">
                {totalComments.toLocaleString()} comments
              </div>

              <button
                type="button"
                onClick={handleOpenEpisodeEchoes}
                className="text-[14px] font-normal text-[#111827] active:scale-95"
                aria-label="View people who echoed"
              >
                {totalEcho.toLocaleString()} echo
              </button>
            </div>
          </header>
        ) : null}

        <div className="min-h-0 flex-1 overflow-hidden">
          <CommentSection
            targetType={targetType}
            targetId={activeEpisodeId || story?.id}
story={story}
variant="modal"
onCommentsChange={onCommentChanged}
episodeOptions={episodes}
selectedEpisodeId={activeEpisodeId}
onEpisodeChange={setSelectedEpisodeId}
          />
        </div>
      </section>
    </div>
  )
}

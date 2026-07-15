import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [episodeLikeTotal, setEpisodeLikeTotal] = useState(0)
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('')
  const [episodeCommentTotals, setEpisodeCommentTotals] = useState({})

  const episodeList = useMemo(
    () =>
      [...episodes]
        .filter((item) => item?.id || item?.episode_id)
        .sort((first, second) => Number(first.episode_number || 0) - Number(second.episode_number || 0)),
    [episodes]
  )

  const activeEpisodeId =
    targetType === 'episode'
      ? selectedEpisodeId || String(targetId || '')
      : targetId

  const activeEpisode = episodeList.find(
    (item) => String(item.id || item.episode_id) === String(activeEpisodeId)
  )

  useEffect(() => {
    if (!open) return undefined

    setDragOffset(0)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open || targetType !== 'episode') return

    setSelectedEpisodeId(String(targetId || ''))
  }, [open, targetId, targetType])

  useEffect(() => {
    if (!open || targetType !== 'episode' || !episodeList.length) {
      setEpisodeCommentTotals({})
      return undefined
    }

    let ignore = false
    const initialTotals = Object.fromEntries(
      episodeList.map((item) => [
        String(item.id || item.episode_id),
        Math.max(0, Number(item.total_comments || item.comment_count || item.comments_count || 0)),
      ])
    )

    setEpisodeCommentTotals(initialTotals)

    async function loadEpisodeCommentTotals() {
      const pendingEpisodes = [...episodeList]

      async function loadNext() {
        while (pendingEpisodes.length) {
          const item = pendingEpisodes.shift()
          const itemId = item?.id || item?.episode_id

          if (!itemId) continue

          try {
            const response = await fetch(
              `${API_BASE_URL}/api/comments/episode/${itemId}?page=1&limit=1&sort=top`,
              { cache: 'no-store' }
            )
            const data = await response.json().catch(() => ({}))

            if (!response.ok || data.ok === false || ignore) continue

            const total = Math.max(
              0,
              Number(data.total ?? data.total_comments ?? data.count ?? 0)
            )

            setEpisodeCommentTotals((current) =>
              current[String(itemId)] === total
                ? current
                : { ...current, [String(itemId)]: total }
            )
          } catch {
          }
        }
      }

      await Promise.all(
        Array.from({ length: Math.min(4, pendingEpisodes.length) }, loadNext)
      )
    }

    loadEpisodeCommentTotals()

    return () => {
      ignore = true
    }
  }, [episodeList, open, targetType])

  useEffect(() => {
    if (!open || targetType !== 'episode' || !activeEpisodeId) {
      setEpisodeEchoTotal(0)
      return undefined
    }

    let ignore = false

    async function loadEpisodeEchoTotal() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/echoes/episode/${activeEpisodeId}?page=1&limit=1`
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
  }, [activeEpisodeId, open, targetType])

  useEffect(() => {
    if (!open || targetType !== 'episode' || !activeEpisodeId) {
      setEpisodeLikeTotal(0)
      return undefined
    }

    let ignore = false

    async function loadEpisodeLikeTotal() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reactions/episode/${activeEpisodeId}/status`,
          { cache: 'no-store' }
        )
        const data = await response.json().catch(() => ({}))

        if (!ignore && response.ok && data.ok !== false) {
          setEpisodeLikeTotal(Math.max(0, Number(data.total_likes || 0)))
        }
      } catch {
        if (!ignore) setEpisodeLikeTotal(0)
      }
    }

    loadEpisodeLikeTotal()

    return () => {
      ignore = true
    }
  }, [activeEpisodeId, open, targetType])

  if (!open) return null

  const totalLikes =
    targetType === 'episode'
      ? episodeLikeTotal
      : Number(
          story?.total_likes ||
            story?.like_count ||
            story?.likes_count ||
            0
        )

  const totalComments =
    targetType === 'episode'
      ? Math.max(
          0,
          Number(
            episodeCommentTotals[String(activeEpisodeId)] ??
              activeEpisode?.total_comments ??
              activeEpisode?.comment_count ??
              activeEpisode?.comments_count ??
              0
          )
        )
      : Number(
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
    if (targetType !== 'episode' || !story?.id || !activeEpisodeId) return

    sessionStorage.setItem(
      'shadow_reopen_episode_comments',
      `${story.id}:${activeEpisodeId}`
    )

    onClose()
    navigate(`/story/${story.id}/episode/${activeEpisodeId}/reactions`)
  }

  const handleOpenEpisodeEchoes = () => {
    if (targetType !== 'episode' || !story?.id || !activeEpisodeId) return

    sessionStorage.setItem(
      'shadow_reopen_episode_comments',
      `${story.id}:${activeEpisodeId}`
    )

    onClose()
    navigate(`/story/${story.id}/episode/${activeEpisodeId}/echoes`)
  }

  const handleEpisodeCommentTotalChange = (total) => {
    if (targetType !== 'episode' || !activeEpisodeId) return

    const nextTotal = Math.max(0, Number(total || 0))

    setEpisodeCommentTotals((current) =>
      current[String(activeEpisodeId)] === nextTotal
        ? current
        : { ...current, [String(activeEpisodeId)]: nextTotal }
    )
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

        {targetType === 'story' ? (
  <header className="shrink-0 bg-white px-4 pb-4">
    <div className="flex justify-center">
      <div className="rounded-full bg-[#f5f3fa] px-5 py-2 text-[14px] font-normal text-[#111827]">
        {totalComments.toLocaleString()} comments
      </div>
    </div>
  </header>
) : (
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
)}

        <div className="min-h-0 flex-1 overflow-hidden">
          <CommentSection
            targetType={targetType}
            targetId={activeEpisodeId || story?.id}
            story={story}
            variant="modal"
            onCommentsChange={onCommentChanged}
            episodeOptions={episodeList.map((item) => ({
              id: item.id || item.episode_id,
              episode_number: item.episode_number,
              total_comments: episodeCommentTotals[String(item.id || item.episode_id)] || 0,
            }))}
            selectedEpisodeId={activeEpisodeId}
            onEpisodeChange={setSelectedEpisodeId}
            onCommentTotalChange={handleEpisodeCommentTotalChange}
          />
        </div>
      </section>
    </div>
  )
}

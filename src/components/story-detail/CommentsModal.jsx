import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CommentSection from '../comments/CommentSection'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('commentsModal', {
  en: {
    closeComments: 'Close comments',
    commentsCount: '{{count}} comments',
    viewReacted: 'View people who reacted',
    viewEchoed: 'View people who echoed',
    echoCount: '{{count}} echo',
    post: 'Post',
  },
  km: {
    closeComments: 'បិទមតិយោបល់',
    commentsCount: '{{count}} មតិយោបល់',
    viewReacted: 'មើលអ្នកដែលបាន Reaction',
    viewEchoed: 'មើលអ្នកដែលបាន Echo',
    echoCount: '{{count}} Echo',
    post: 'Post',
  },
  zh: {
    closeComments: '关闭评论',
    commentsCount: '{{count}} 条评论',
    viewReacted: '查看作出反应的人',
    viewEchoed: '查看 Echo 的人',
    echoCount: '{{count}} 个 Echo',
    post: '帖子',
  },
  ja: {
    closeComments: 'コメントを閉じる',
    commentsCount: '{{count}} 件のコメント',
    viewReacted: 'リアクションした人を見る',
    viewEchoed: 'Echo した人を見る',
    echoCount: '{{count}} Echo',
    post: '投稿',
  },
  ko: {
    closeComments: '댓글 닫기',
    commentsCount: '댓글 {{count}}개',
    viewReacted: '반응한 사람 보기',
    viewEchoed: 'Echo한 사람 보기',
    echoCount: 'Echo {{count}}개',
    post: '게시물',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const EMPTY_EPISODES = Object.freeze([])

function getPointerY(event) {
  if (event.touches?.length) return event.touches[0].clientY
  return event.clientY
}

export default function CommentsModal({
  open,
  story,
  targetType = 'story',
  targetId,
  episodes = EMPTY_EPISODES,
  title,
  onClose,
  onCommentChanged,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const sheetRef = useRef(null)
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [episodeEchoTotal, setEpisodeEchoTotal] = useState(0)
  const [episodeLikeTotal, setEpisodeLikeTotal] = useState(0)
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('')
  const [episodeCommentTotals, setEpisodeCommentTotals] = useState({})
  const [storyCommentTotal, setStoryCommentTotal] = useState(0)

  const episodeList = useMemo(() => {
    const sourceEpisodes = Array.isArray(episodes)
      ? episodes
      : EMPTY_EPISODES

    return [...sourceEpisodes]
      .filter((item) => item?.id || item?.episode_id)
      .sort(
        (first, second) =>
          Number(first.episode_number || 0) -
          Number(second.episode_number || 0)
      )
  }, [episodes])

  const activeEpisodeId =
    targetType === 'episode'
      ? selectedEpisodeId || String(targetId || '')
      : targetId

  const activeEpisode = episodeList.find(
    (item) => String(item.id || item.episode_id) === String(activeEpisodeId)
  )

  const commentEpisodeOptions = useMemo(
    () =>
      episodeList.map((item) => ({
        id: item.id || item.episode_id,
        episode_number: item.episode_number,
        total_comments:
          episodeCommentTotals[
            String(item.id || item.episode_id)
          ] || 0,
      })),
    [episodeCommentTotals, episodeList]
  )

  useEffect(() => {
    if (!open) return undefined

    setDragOffset(0)
    setDragging(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open || targetType !== 'episode') return

    setSelectedEpisodeId(String(targetId || ''))
  }, [open, targetId, targetType])

  useEffect(() => {
    if (!open || targetType !== 'episode' || !episodeList.length) {
      setEpisodeCommentTotals((current) =>
        Object.keys(current).length
          ? {}
          : current
      )
      return undefined
    }

    let ignore = false

    const initialTotals = Object.fromEntries(
      episodeList.map((item) => [
        String(item.id || item.episode_id),
        Math.max(
          0,
          Number(
            item.total_comments ||
              item.comment_count ||
              item.comments_count ||
              0
          )
        ),
      ])
    )

    const episodeIds = episodeList
      .map((item) =>
        String(item.id || item.episode_id || '').trim()
      )
      .filter(Boolean)

    setEpisodeCommentTotals(initialTotals)

    async function loadEpisodeCommentTotals() {
      const batches = []

      for (
        let index = 0;
        index < episodeIds.length;
        index += 100
      ) {
        batches.push(
          episodeIds.slice(index, index + 100)
        )
      }

      const batchTotals = await Promise.all(
        batches.map(async (ids) => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/comments/episode-totals?ids=${encodeURIComponent(
                ids.join(',')
              )}`,
              { cache: 'no-store' }
            )

            const data = await response
              .json()
              .catch(() => ({}))

            if (
              !response.ok ||
              data.ok === false ||
              !data.totals ||
              typeof data.totals !== 'object'
            ) {
              return {}
            }

            return data.totals
          } catch {
            return {}
          }
        })
      )

      if (ignore) return

      const serverTotals =
        Object.assign({}, ...batchTotals)

      setEpisodeCommentTotals((current) => {
        const next = { ...current }

        for (const episodeId of episodeIds) {
          if (
            !Object.prototype.hasOwnProperty.call(
              serverTotals,
              episodeId
            )
          ) {
            continue
          }

          const initialTotal = Math.max(
            0,
            Number(initialTotals[episodeId] || 0)
          )
          const currentTotal = Math.max(
            0,
            Number(
              current[episodeId] ??
                initialTotal
            )
          )

          if (currentTotal !== initialTotal) {
            continue
          }

          next[episodeId] = Math.max(
            0,
            Number(
              serverTotals[episodeId] || 0
            )
          )
        }

        return next
      })
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
          `${API_BASE_URL}/api/echo-v2/source/episode/${activeEpisodeId}?page=1&limit=1`,
          { cache: 'no-store' }
        )

        const data = await response.json().catch(() => ({}))

        if (!ignore && response.ok && data.ok !== false) {
          setEpisodeEchoTotal(
            Math.max(
              0,
              Number(
                data.echo_count ??
                  data.total ??
                  0
              )
            )
          )
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
      : storyCommentTotal

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

  const handleOpenReactions = () => {
  if (!activeEpisodeId) return

  if (targetType === 'episode') {
    if (!story?.id) return

    sessionStorage.setItem(
      'shadow_reopen_episode_comments',
      `${story.id}:${activeEpisodeId}`
    )

    onClose()
    navigate(`/story/${story.id}/episode/${activeEpisodeId}/reactions`)
    return
  }

  if (targetType === 'author_post' || targetType === 'reader_post') {
    onClose()
    navigate(`/interactions/${targetType}/${activeEpisodeId}/likes`, {
      state: { sourceName: title || t('commentsModal.post') },
    })
  }
}

  const handleOpenEchoes = () => {
  if (!activeEpisodeId) return

  if (targetType === 'episode') {
    if (!story?.id) return

    sessionStorage.setItem(
      'shadow_reopen_episode_comments',
      `${story.id}:${activeEpisodeId}`
    )

    onClose()
    navigate(`/story/${story.id}/episode/${activeEpisodeId}/echoes`)
    return
  }

  if (targetType === 'author_post' || targetType === 'reader_post') {
    onClose()
    navigate(`/interactions/${targetType}/${activeEpisodeId}/echoes`, {
      state: { sourceName: title || t('commentsModal.post') },
    })
  }
}

  const handleCommentTotalChange = (total) => {
  const nextTotal = Math.max(0, Number(total || 0))

  if (targetType === 'story') {
    setStoryCommentTotal(nextTotal)
    return
  }

  if (targetType !== 'episode' || !activeEpisodeId) return

  setEpisodeCommentTotals((current) =>
    current[String(activeEpisodeId)] === nextTotal
      ? current
      : { ...current, [String(activeEpisodeId)]: nextTotal }
  )
}

  const handleDragStart = (event) => {
    if (!event.isPrimary) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    draggingRef.current = true
    setDragging(true)
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
    setDragging(false)

    if (distance > 70) {
      onClose()
      return
    }

    setDragOffset(0)
  }

  return (
    <div className="fixed inset-0 z-[200000] flex items-end justify-center sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        aria-label={t('commentsModal.closeComments')}
      />

      <section
        ref={sheetRef}
        className="relative flex h-[calc(100dvh-12px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-2xl sm:h-[calc(100dvh-24px)] sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {targetType === 'story' ? (
  <header
    role="presentation"
    onPointerDown={handleDragStart}
    onPointerMove={handleDragMove}
    onPointerUp={handleDragEnd}
    onPointerCancel={handleDragEnd}
    onLostPointerCapture={handleDragEnd}
    className="shrink-0 cursor-grab touch-none bg-[var(--shadow-bg-elevated)] px-4 pb-3 pt-2.5 active:cursor-grabbing"
    style={{ touchAction: 'none' }}
  >
    <div className="flex justify-center">
      <div className="rounded-full bg-[var(--shadow-bg-soft)] px-5 py-2 text-[14px] font-normal text-[var(--shadow-text-primary)]">
        {t('commentsModal.commentsCount', {
          count: totalComments.toLocaleString(),
        })}
      </div>
    </div>
  </header>
) : (
  <header
    role="presentation"
    onPointerDown={handleDragStart}
    onPointerMove={handleDragMove}
    onPointerUp={handleDragEnd}
    onPointerCancel={handleDragEnd}
    onLostPointerCapture={handleDragEnd}
    className="shrink-0 cursor-grab touch-none bg-[var(--shadow-bg-elevated)] px-4 pb-3 pt-2.5 active:cursor-grabbing"
    style={{ touchAction: 'none' }}
  >
    <div className="grid grid-cols-3 items-center gap-2 text-center">
      <button
  type="button"
  onPointerDown={(event) =>
    event.stopPropagation()
  }
  onClick={handleOpenReactions}
        className="flex items-center justify-center gap-1 text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
        aria-label={t('commentsModal.viewReacted')}
      >
        <i className="fa-solid fa-heart text-[14px] text-[#ff3b5f]" />
        <span>{totalLikes.toLocaleString()}</span>
      </button>

      <div className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-[14px] font-normal text-[var(--shadow-text-primary)]">
        {t('commentsModal.commentsCount', {
          count: totalComments.toLocaleString(),
        })}
      </div>

      <button
  type="button"
  onPointerDown={(event) =>
    event.stopPropagation()
  }
  onClick={handleOpenEchoes}
        className="text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
        aria-label={t('commentsModal.viewEchoed')}
      >
        {t('commentsModal.echoCount', {
          count: totalEcho.toLocaleString(),
        })}
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
            episodeOptions={commentEpisodeOptions}
            selectedEpisodeId={activeEpisodeId}
            onEpisodeChange={setSelectedEpisodeId}
            onCommentTotalChange={handleCommentTotalChange}
          />
        </div>
      </section>
    </div>
  )
}

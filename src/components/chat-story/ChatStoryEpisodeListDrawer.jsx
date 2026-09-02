import { useEffect, useMemo, useRef, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatStoryEpisodeListDrawer', {
  en: {
    episodeCount: 'Up to {{count}} Episodes',
    positive: 'Positive',
    reverse: 'Reverse',
    untitledEpisode: 'Untitled Episode',
  },
  km: {
    episodeCount: 'មានរហូតដល់ {{count}} ភាគ',
    positive: 'លំដាប់ដើម',
    reverse: 'លំដាប់បញ្ច្រាស',
    untitledEpisode: 'ភាគគ្មានចំណងជើង',
  },
  zh: {
    episodeCount: '最多 {{count}} 集',
    positive: '正序',
    reverse: '倒序',
    untitledEpisode: '未命名章节',
  },
  ja: {
    episodeCount: '最大 {{count}} エピソード',
    positive: '昇順',
    reverse: '降順',
    untitledEpisode: '無題のエピソード',
  },
  ko: {
    episodeCount: '최대 {{count}}개 에피소드',
    positive: '정순',
    reverse: '역순',
    untitledEpisode: '제목 없는 에피소드',
  },
})

function formatEpisodeDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(getDisplayLanguageId() || 'en')
}

function getEpisodeDate(episode) {
  return formatEpisodeDate(
    episode?.published_at ||
      episode?.scheduled_at ||
      episode?.updated_at ||
      episode?.created_at
  )
}

function getLikeCount(episode) {
  return Number(
    episode?.like_count ??
      episode?.likes_count ??
      episode?.reaction_count ??
      episode?.reactions_count ??
      0
  )
}

function getCommentCount(episode) {
  return Number(
    episode?.comment_count ??
      episode?.comments_count ??
      episode?.total_comments ??
      0
  )
}

function isEpisodeLocked(episode) {
  return Boolean(
    episode?.is_locked ||
      episode?.locked ||
      episode?.access_locked ||
      episode?.requires_unlock ||
      episode?.is_premium ||
      episode?.lock_type
  )
}



export default function ChatStoryEpisodeListDrawer({
  open,
  onClose,
  story,
  episodes = [],
  currentEpisodeId,
  storyId,
  navigate,
}) {
  const [newestFirst, setNewestFirst] = useState(false)
  const { t } = useDisplayTranslation()
const [dragY, setDragY] = useState(0)

const activeEpisodeRef = useRef(null)
const dragStartYRef = useRef(0)
const dragYRef = useRef(0)
const draggingRef = useRef(false)

  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((first, second) => {
      const firstNumber = Number(first?.episode_number || 0)
      const secondNumber = Number(second?.episode_number || 0)

      return newestFirst
        ? secondNumber - firstNumber
        : firstNumber - secondNumber
    })
  }, [episodes, newestFirst])

  useEffect(() => {
  if (!open) return undefined

  const scrollY = window.scrollY
  const body = document.body
  const html = document.documentElement

  const previousBodyOverflow =
    body.style.overflow
  const previousBodyPosition =
    body.style.position
  const previousBodyTop =
    body.style.top
  const previousBodyWidth =
    body.style.width
  const previousHtmlOverflow =
    html.style.overflow

  body.style.overflow = 'hidden'
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.width = '100%'
  html.style.overflow = 'hidden'

  setDragY(0)
  dragYRef.current = 0
  draggingRef.current = false

  return () => {
    body.style.overflow =
      previousBodyOverflow
    body.style.position =
      previousBodyPosition
    body.style.top =
      previousBodyTop
    body.style.width =
      previousBodyWidth
    html.style.overflow =
      previousHtmlOverflow

    window.scrollTo(0, scrollY)
  }
}, [open])

useEffect(() => {
  if (!open) return undefined

  const frame =
    window.requestAnimationFrame(() => {
      activeEpisodeRef.current?.scrollIntoView({
        block: 'center',
      })
    })

  return () => {
    window.cancelAnimationFrame(frame)
  }
}, [open, newestFirst])

const startDrag = (event) => {
  draggingRef.current = true
  dragStartYRef.current = event.clientY
  dragYRef.current = 0
  setDragY(0)

  event.currentTarget.setPointerCapture?.(
    event.pointerId
  )
}

const moveDrag = (event) => {
  if (!draggingRef.current) return

  const nextY = Math.max(
    0,
    event.clientY -
      dragStartYRef.current
  )

  dragYRef.current = nextY
  setDragY(nextY)
}

const endDrag = () => {
  if (!draggingRef.current) return

  draggingRef.current = false

  const shouldClose =
    dragYRef.current >= 90

  dragYRef.current = 0

  if (shouldClose) {
    onClose()
    return
  }

  setDragY(0)
}

  if (!open) return null

  

  const openEpisode = (episode) => {
    onClose()

    if (String(episode.id) === String(currentEpisodeId)) return

    navigate(`/story/${storyId}/episode/${episode.id}`, {
      replace: true,
      state: {
        storyPreview: story,
        episodePreview: episode,
        returnSource: 'chatStoryEpisodeList',
      },
    })
  }

  return (
    <div className="fixed inset-0 z-[180]" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close episode list"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section
  className="absolute bottom-0 left-0 right-0 flex max-h-[82dvh] min-h-[58dvh] flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] shadow-2xl"
  style={{
    transform: `translateY(${dragY}px)`,
    transition: draggingRef.current
      ? 'none'
      : 'transform 220ms ease',
  }}
>
  <div className="shrink-0 bg-[var(--shadow-bg-surface)] px-4 pb-3 pt-1">
    <div
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="h-5 w-full touch-none"
      aria-label="Drag down to close episode list"
      role="button"
      tabIndex={0}
    />

    <div className="flex items-center justify-between pt-1">
      <span className="text-[11px] font-medium text-[var(--shadow-text-tertiary)]">
        {t('chatStoryEpisodeListDrawer.episodeCount', { count: episodes.length })}
      </span>

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() =>
            setNewestFirst(false)
          }
          className={`text-[12px] font-bold ${
            !newestFirst
              ? 'text-[#8b5cf6]'
              : 'text-[var(--shadow-text-primary)]'
          }`}
        >
          {t('chatStoryEpisodeListDrawer.positive')}
        </button>

        <button
          type="button"
          onClick={() =>
            setNewestFirst(true)
          }
          className={`text-[12px] font-bold ${
            newestFirst
              ? 'text-[#8b5cf6]'
              : 'text-[var(--shadow-text-primary)]'
          }`}
        >
          {t('chatStoryEpisodeListDrawer.reverse')}
        </button>
      </div>
    </div>
  </div>

  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(18px,env(safe-area-inset-bottom))]">
          {sortedEpisodes.map((episode) => {
            const active =
              String(episode.id) === String(currentEpisodeId)
            const locked = isEpisodeLocked(episode)
            const episodeDate = getEpisodeDate(episode)
            const likeCount = getLikeCount(episode)
            const commentCount = getCommentCount(episode)

            return (
              <button
                key={episode.id}
                ref={active ? activeEpisodeRef : null}
                type="button"
                onClick={() => openEpisode(episode)}
                className={`flex min-h-[82px] w-full items-center gap-3 border-t border-[var(--shadow-border)] px-5 py-3 text-left transition active:bg-[var(--shadow-bg-hover)] ${
                  active ? 'bg-[var(--shadow-bg-soft)]' : 'bg-[var(--shadow-bg-surface)]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={`line-clamp-2 text-[14px] font-medium leading-6 ${
                      active ? 'text-[#8b5cf6]' : 'text-[var(--shadow-text-primary)]'
                    }`}
                  >
                    {episode.episode_number
                      ? `${episode.episode_number}. `
                      : ''}
                    {episode.title || t('chatStoryEpisodeListDrawer.untitledEpisode')}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
                    {episodeDate ? <span>{episodeDate}</span> : null}

                    {likeCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-thumbs-up text-[10px]" />
                        {likeCount.toLocaleString(getDisplayLanguageId() || 'en')}
                      </span>
                    ) : null}

                    {commentCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-comment-dots text-[10px]" />
                        {commentCount.toLocaleString(getDisplayLanguageId() || 'en')}
                      </span>
                    ) : null}
                  </div>
                </div>

                {locked ? (
                  <i className="fa-solid fa-lock shrink-0 text-[11px] text-[var(--shadow-text-disabled)]" />
                ) : null}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

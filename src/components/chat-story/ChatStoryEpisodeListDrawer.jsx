import { useEffect, useMemo, useRef, useState } from 'react'

function formatEpisodeDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB')
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

function getStoryStatus(story) {
  const status = String(
    story?.story_status ||
      story?.status ||
      story?.publication_status ||
      ''
  )
    .trim()
    .toLowerCase()

  return ['completed', 'complete', 'finished'].includes(status)
    ? 'Completed'
    : 'Ongoing'
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
  const activeEpisodeRef = useRef(null)

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

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = window.requestAnimationFrame(() => {
      activeEpisodeRef.current?.scrollIntoView({
        block: 'center',
      })
    })

    return () => {
      document.body.style.overflow = previousOverflow
      window.cancelAnimationFrame(frame)
    }
  }, [open, newestFirst])

  if (!open) return null

  const cover =
    story?.cover_url ||
    story?.thumbnail_url ||
    story?.image_url ||
    ''

  const title = story?.title || story?.name || 'Untitled Story'
  const statusText = getStoryStatus(story)

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

      <section className="absolute bottom-0 left-0 right-0 flex max-h-[82dvh] min-h-[58dvh] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
        <div className="shrink-0 bg-white px-4 pb-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close episode list"
            className="mx-auto flex h-7 w-20 items-center justify-center"
          >
            <span className="h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
          </button>

          <div className="flex items-center gap-3 pb-3">
            {cover ? (
              <img
                src={cover}
                alt={title}
                loading="lazy"
                decoding="async"
                className="h-[60px] w-[45px] shrink-0 rounded-[7px] object-cover ring-1 ring-black/5"
              />
            ) : (
              <div className="h-[60px] w-[45px] shrink-0 rounded-[7px] bg-[#f1f2f4]" />
            )}

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-[15px] font-bold leading-6 text-[#111827]">
                {title}
              </h2>

              <p className="mt-1 text-[11px] font-medium text-[#98a2b3]">
                {episodes.length} Episodes · {statusText}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#f0f1f3] pt-3">
            <span className="text-[11px] font-medium text-[#98a2b3]">
              Up to {episodes.length} Episodes
            </span>

            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => setNewestFirst(false)}
                className={`text-[12px] font-bold ${
                  !newestFirst ? 'text-[#8b5cf6]' : 'text-[#344054]'
                }`}
              >
                Positive
              </button>

              <button
                type="button"
                onClick={() => setNewestFirst(true)}
                className={`text-[12px] font-bold ${
                  newestFirst ? 'text-[#8b5cf6]' : 'text-[#344054]'
                }`}
              >
                Reverse
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
                className={`flex min-h-[82px] w-full items-center gap-3 border-t border-[#f2f3f5] px-5 py-3 text-left transition active:bg-[#f7f4ff] ${
                  active ? 'bg-[#faf7ff]' : 'bg-white'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={`line-clamp-2 text-[14px] font-medium leading-6 ${
                      active ? 'text-[#8b5cf6]' : 'text-[#20242b]'
                    }`}
                  >
                    {episode.episode_number
                      ? `${episode.episode_number}. `
                      : ''}
                    {episode.title || 'Untitled Episode'}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-medium text-[#98a2b3]">
                    {episodeDate ? <span>{episodeDate}</span> : null}

                    {likeCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-thumbs-up text-[10px]" />
                        {likeCount.toLocaleString('en-US')}
                      </span>
                    ) : null}

                    {commentCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-comment-dots text-[10px]" />
                        {commentCount.toLocaleString('en-US')}
                      </span>
                    ) : null}
                  </div>
                </div>

                {locked ? (
                  <i className="fa-solid fa-lock shrink-0 text-[11px] text-[#b6bcc6]" />
                ) : null}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

import { useMemo, useState } from 'react'

function formatShortNumber(value) {
  const number = Number(value || 0)
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return number.toLocaleString()
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function formatStatus(value) {
  const status = String(value || 'ongoing').toLowerCase()

  if (status === 'completed') return 'Completed'
  if (status === 'new') return 'New'
  return 'Ongoing'
}

function formatUpdateDays(days) {
  if (!Array.isArray(days) || !days.length) return 'All Episodes'

  const shortDays = days
    .map((day) => String(day || '').trim())
    .filter(Boolean)
    .map((day) => day.slice(0, 3))
    .join(' & ')

  return shortDays ? `Updates ${shortDays}` : 'All Episodes'
}

function EpisodeListItem({ episode, story, onOpenEpisode }) {
  const cover = episode.cover_url || story?.cover_url || ''
  const locked = Boolean(episode.is_locked) && Number(episode.episode_number || 0) > 1
  const date = formatDate(episode.published_at || episode.created_at || episode.updated_at)
  const comments = formatShortNumber(episode.total_comments || episode.comments_count || episode.comments || 0)

  return (
    <button
      type="button"
      onClick={() => onOpenEpisode(episode)}
      className="flex w-full gap-4 border-b border-white/10 px-4 py-4 text-left active:scale-[0.995]"
    >
      <div className="relative h-[74px] w-[114px] shrink-0 overflow-hidden rounded-[10px] bg-[#2a2a2d]">
        {cover ? (
          <img src={cover} alt={episode.title || 'Episode cover'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-white/35">
            Cover
          </div>
        )}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
            <i className="fa-solid fa-lock text-[18px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pt-1">
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-1 text-[17px] font-extrabold text-white">
            Ep. {episode.episode_number || 1}
          </h3>

          {locked ? (
            <span className="rounded-full bg-[#fff7ed] px-2 py-0.5 text-[9.5px] font-black text-[#f97316]">
              Locked
            </span>
          ) : null}
        </div>

        <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-white/80">
          {episode.title || 'Untitled Episode'}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] font-semibold text-white/45">
          {date ? <span>{date}</span> : null}

          <span className="inline-flex items-center gap-1.5">
            <i className="fa-solid fa-comment-dots text-[13px]" />
            {comments}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function EpisodeListModal({ open, story, episodes = [], onClose, onOpenEpisode }) {
  const [newestFirst, setNewestFirst] = useState(true)

  const visibleEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => {
      const first = Number(a.episode_number || 0)
      const second = Number(b.episode_number || 0)
      return newestFirst ? second - first : first - second
    })
  }, [episodes, newestFirst])

  if (!open) return null

  const status = formatStatus(story?.status)
  const updateText = formatUpdateDays(story?.update_days)

  return (
    <div className="fixed inset-0 z-[140] bg-black/60 sm:flex sm:items-end sm:justify-center">
      <section className="h-full w-full overflow-hidden bg-[#1f1f22] text-white shadow-2xl sm:h-[88vh] sm:max-w-[560px] sm:rounded-t-[26px]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1f1f22]/95 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 active:scale-95"
              aria-label="Close"
            >
              <i className="fa-solid fa-chevron-left text-[18px]" />
            </button>

            <div className="min-w-0 flex-1 text-center">
              <h2 className="line-clamp-1 text-[20px] font-black text-white">
                {story?.title || 'Episodes'}
              </h2>
              <div className="mt-1 text-[11px] font-bold text-white/40">
                All Episodes · {episodes.length} total
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 active:scale-95"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-[24px]" />
            </button>
          </div>

          <button
            type="button"
            className="mt-5 flex items-center gap-2 text-[15px] font-extrabold text-white/75 active:scale-[0.99]"
          >
            <span className="rounded-[4px] bg-[#3a3426] px-1.5 py-0.5 text-[9px] font-black text-[#ffd66b]">
              <i className="fa-solid fa-crown mr-1" />
              Premium
            </span>
            <span>Early Access</span>
            <i className="fa-solid fa-caret-right text-[12px]" />
          </button>
        </header>

        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4">
          <div>
            <div className="text-[17px] font-black text-white">
              {status} · {updateText}
            </div>
            <div className="mt-1 text-[11px] font-bold text-white/35">
              Showing {newestFirst ? 'newest first' : 'oldest first'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNewestFirst((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white active:scale-95"
            aria-label="Reverse episodes"
          >
            <i className="fa-solid fa-arrow-down-wide-short text-[20px]" />
          </button>
        </div>

        <main className="h-[calc(100%-174px)] overflow-y-auto pb-8">
          {visibleEpisodes.length ? (
            visibleEpisodes.map((episode) => (
              <EpisodeListItem
                key={episode.id}
                episode={episode}
                story={story}
                onOpenEpisode={onOpenEpisode}
              />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <i className="fa-regular fa-file-lines text-[34px] text-white/30" />
              <div className="mt-4 text-[16px] font-black text-white">No episodes yet</div>
              <div className="mt-1 text-[12px] font-semibold text-white/40">
                Published episodes will appear here.
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  )
}

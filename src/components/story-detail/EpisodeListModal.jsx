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

function ReverseIcon() {
  return (
    <span className="relative block h-6 w-6 text-current">
      <span className="absolute left-[6px] top-[4px] h-[15px] w-[3px] rounded-full bg-current" />
      <span className="absolute left-[3px] top-[3px] h-[8px] w-[3px] rotate-45 rounded-full bg-current" />
      <span className="absolute left-[8px] top-[3px] h-[8px] w-[3px] -rotate-45 rounded-full bg-current" />
      <span className="absolute right-[6px] bottom-[4px] h-[15px] w-[3px] rounded-full bg-current" />
      <span className="absolute right-[3px] bottom-[3px] h-[8px] w-[3px] -rotate-45 rounded-full bg-current" />
      <span className="absolute right-[8px] bottom-[3px] h-[8px] w-[3px] rotate-45 rounded-full bg-current" />
    </span>
  )
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
      className="flex w-full gap-3 border-b border-[#eef0f4] px-4 py-3.5 text-left transition active:scale-[0.995] sm:gap-4 sm:px-5"
    >
      <div className="relative h-[76px] w-[108px] shrink-0 overflow-hidden rounded-[14px] bg-[#f0f2f5] sm:h-[86px] sm:w-[128px]">
        {cover ? (
          <img src={cover} alt={episode.title || 'Episode cover'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-[#98a2b3]">
            Cover
          </div>
        )}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/32 text-white">
            <i className="fa-solid fa-lock text-[18px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#111827] sm:text-[15px]">
          {episode.title || 'Untitled Episode'}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11.5px] font-medium text-[#8d94a1]">
          {date ? <span>{date}</span> : null}

          <span className="inline-flex items-center gap-1.5">
            <i className="fa-solid fa-comment-dots text-[12px]" />
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

  const status = formatStatus(story?.story_status || story?.status)
  const updateText = formatUpdateDays(story?.update_days)

  return (
    <div className="fixed inset-0 z-[140] bg-black/35 sm:flex sm:items-center sm:justify-center sm:px-6">
      <section className="absolute bottom-0 left-0 right-0 top-[64px] overflow-hidden rounded-t-[28px] bg-white text-[#111827] shadow-2xl sm:relative sm:left-auto sm:right-auto sm:top-auto sm:h-[82vh] sm:w-full sm:max-w-[720px] sm:rounded-[30px]">
        <header className="sticky top-0 z-20 border-b border-[#eef0f4] bg-white/95 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="h-10 w-10" />

            <h2 className="line-clamp-1 text-center text-[18px] font-black text-[#111827]">
              Episodes
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:scale-95"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-[24px]" />
            </button>
          </div>

          <button
  type="button"
  className="mt-4 flex items-center gap-2 font-['Roboto'] text-[17px] font-medium text-[#8d94a1] active:scale-[0.99]"
>
  <span className="rounded-[4px] bg-[#111827] px-2 py-1 text-[10px] font-black text-white">
    <i className="fa-solid fa-crown mr-1 text-[#f5c542]" />
    Premium
  </span>
  <span>Early Access</span>
  <i className="fa-solid fa-caret-right text-[10px] text-[#8d94a1]" />
</button>
        </header>

        <div className="flex items-center justify-between gap-4 border-b border-[#eef0f4] px-4 py-4 sm:px-5">
          <div className="font-['Roboto'] text-[17px] font-medium text-[#111827]">
  {status}, {updateText}
</div>

          <button
            type="button"
            onClick={() => setNewestFirst((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent active:scale-95"
            aria-label="Reverse episodes"
          >
            <img
  src="/assets/Icons/Revers.svg"
  alt="Reverse episodes"
  className="h-4 w-4"
/>
          </button>
        </div>

        <main className="h-[calc(100%-142px)] overflow-y-auto pb-8">
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
              <i className="fa-regular fa-file-lines text-[34px] text-[#98a2b3]" />
              <div className="mt-4 text-[16px] font-black text-[#111827]">No episodes yet</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                Published episodes will appear here.
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  )
}

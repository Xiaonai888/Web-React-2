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

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

function EpisodeRow({ episode, story, onOpenEpisode }) {
  const cover = episode.cover_url || story?.cover_url || ''
  const locked = episode.is_locked && Number(episode.episode_number || 0) > 1
  const date = formatDate(episode.created_at || episode.published_at || episode.updated_at)
  const likes = formatShortNumber(episode.total_likes || episode.likes_count || episode.likes || 0)
  const comments = formatShortNumber(episode.total_comments || episode.comments_count || episode.comments || 0)

  return (
    <button
      type="button"
      onClick={() => onOpenEpisode(episode)}
      className="flex w-full items-center gap-3 bg-white px-0 py-3 text-left active:scale-[0.995]"
    >
      <div className="relative flex h-[76px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#e5e7eb]">
        {cover ? (
          <img src={cover} alt={episode.title || 'Episode cover'} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] font-bold text-[#98a2b3]">Cover</span>
        )}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
            <i className="fa-solid fa-lock text-[17px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-5 text-[#111827]">
          {episode.title || 'Untitled Episode'}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-medium text-[#98a2b3]">
          {date ? <span>{date}</span> : null}

          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-heart text-[11px]" />
            {likes}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-comment text-[11px]" />
            {comments}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function EpisodePreviewSection({ story, episodes, totalEpisodes, onOpenEpisode, onOpenAll }) {
  return (
    <section className="mt-0 bg-white px-4 py-4 sm:mt-4 sm:rounded-[18px] sm:px-5 sm:py-5 sm:shadow-sm">
      <div className="mb-3">
        <h2 className="text-[18px] font-black text-[#111827]">Episodes</h2>
      </div>

      {episodes.length ? (
        <div className="divide-y divide-[#eef1f5]">
          {episodes.map((episode) => (
            <EpisodeRow
              key={episode.id}
              episode={episode}
              story={story}
              onOpenEpisode={onOpenEpisode}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#f8fafc] px-5 py-8 text-center">
          <i className="fa-regular fa-file-lines text-[28px] text-[#98a2b3]" />
          <div className="mt-3 text-[14px] font-black text-[#111827]">No episodes yet</div>
          <div className="mt-1 text-[12px] font-semibold text-[#98a2b3]">Published episodes will appear here.</div>
        </div>
      )}

      {totalEpisodes ? (
        <button
          type="button"
          onClick={onOpenAll}
          className="mt-4 flex h-12 w-full items-center justify-center gap-3 border-t border-[#eef1f5] pt-4 text-[13px] font-semibold text-[#98a2b3] active:scale-[0.99]"
        >
          <i className="fa-solid fa-sort text-[12px]" />
          <span>Up to Ep. {totalEpisodes}</span>
        </button>
      ) : null}
    </section>
  )
}

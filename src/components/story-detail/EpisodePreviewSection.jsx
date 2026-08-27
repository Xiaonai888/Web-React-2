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
  const locked = episode.is_locked && Number(episode.episode_number || 0) > 5
  const date = formatDate(episode.created_at || episode.published_at || episode.updated_at)
  const likes = formatShortNumber(episode.total_likes || episode.likes_count || episode.likes || 0)
  const comments = formatShortNumber(episode.total_comments || episode.comments_count || episode.comments || 0)

  return (
    <button
      type="button"
      onClick={() => onOpenEpisode(episode)}
      className="flex w-full items-center gap-3 bg-[var(--shadow-bg-surface)] px-0 py-3 text-left active:scale-[0.995]"
    >
      <div className="relative flex h-[76px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[var(--shadow-bg-soft)]">
        {cover ? (
          <img src={cover} alt={episode.title || 'Episode cover'} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] font-bold text-[var(--shadow-text-secondary)]">Cover</span>
        )}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
            <i className="fa-solid fa-lock text-[17px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-5 text-[var(--shadow-text-primary)]">
          {episode.title || 'Untitled Episode'}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
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

function EpisodeSkeletonList() {
  return (
    <div className="divide-y divide-[var(--shadow-border)]">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex w-full items-center gap-3 bg-[var(--shadow-bg-surface)] px-0 py-3">
          <div className="h-[76px] w-[104px] shrink-0 animate-pulse rounded-[12px] bg-[var(--shadow-bg-soft)]" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function EpisodePreviewSection({
  story,
  episodes = [],
  totalEpisodes = 0,
  loading = false,
  onOpenEpisode,
  onOpenAll,
}) {
  return (
    <section className="mt-0 bg-[var(--shadow-bg-surface)] px-4 py-4 sm:mt-4 sm:rounded-[18px] sm:px-5 sm:py-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
      <div className="mb-3">
        <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">Episodes</h2>
      </div>

      {loading ? (
        <EpisodeSkeletonList />
      ) : episodes.length ? (
        <div className="divide-y divide-[var(--shadow-border)]">
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
        <div className="bg-[var(--shadow-bg-soft)] px-5 py-8 text-center">
          <i className="fa-regular fa-file-lines text-[28px] text-[var(--shadow-text-secondary)]" />
          <div className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">No episodes yet</div>
          <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">Published episodes will appear here.</div>
        </div>
      )}

      {!loading && totalEpisodes ? (
        <button
          type="button"
          onClick={onOpenAll}
          className="mt-4 flex h-12 w-full items-center justify-center gap-3 border-t border-[var(--shadow-border)] pt-4 text-[13px] font-semibold text-[var(--shadow-text-secondary)] active:scale-[0.99]"
        >
          <i className="fa-solid fa-sort text-[12px]" />
          <span>Up to Ep. {totalEpisodes}</span>
        </button>
      ) : null}
    </section>
  )
}

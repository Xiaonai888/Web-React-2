function EpisodeRow({ episode, story, onOpenEpisode }) {
  const cover = episode.cover_url || story?.cover_url || ''
  const locked = episode.is_locked && Number(episode.episode_number || 0) > 1

  return (
    <button
      type="button"
      onClick={() => onOpenEpisode(episode)}
      className="flex w-full items-center gap-3 rounded-[20px] bg-[#f8fafc] p-3 text-left active:scale-[0.995]"
    >
      <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#111827]">
        {cover ? <img src={cover} alt={episode.title} className="h-full w-full object-cover" /> : null}
        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
            <i className="fa-solid fa-lock text-[18px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-black text-[#667085] shadow-sm">
            EP {episode.episode_number || 1}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-black ${
            locked ? 'bg-[#fff7ed] text-[#f97316]' : 'bg-[#ecfdf3] text-[#16803c]'
          }`}>
            {locked ? 'Locked' : 'Free'}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[#111827]">
          {episode.title || 'Untitled Episode'}
        </h3>

        <div className="mt-2 text-[11px] font-semibold text-[#98a2b3]">
          {Number(episode.character_count || 0).toLocaleString()} chars
        </div>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#98a2b3]" />
    </button>
  )
}

export default function EpisodePreviewSection({ story, episodes, totalEpisodes, onOpenEpisode, onOpenAll }) {
  return (
    <section className="mt-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-black text-[#111827]">Episodes</h2>
          <p className="mt-1 text-[12px] font-semibold text-[#98a2b3]">
            {totalEpisodes ? `Up to Ep. ${totalEpisodes}` : 'No episode yet'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAll}
          className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
        >
          View All
        </button>
      </div>

      {episodes.length ? (
        <div className="space-y-2.5">
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
        <div className="rounded-[22px] bg-[#f8fafc] px-5 py-8 text-center">
          <i className="fa-regular fa-file-lines text-[28px] text-[#98a2b3]" />
          <div className="mt-3 text-[14px] font-black text-[#111827]">No episodes yet</div>
          <div className="mt-1 text-[12px] font-semibold text-[#98a2b3]">Published episodes will appear here.</div>
        </div>
      )}
    </section>
  )
}

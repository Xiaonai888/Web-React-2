import { useMemo, useState } from 'react'

export default function EpisodeListModal({ open, story, episodes, onClose, onOpenEpisode }) {
  const [reverse, setReverse] = useState(true)

  const visibleEpisodes = useMemo(() => {
    const sorted = [...episodes].sort((a, b) =>
      reverse
        ? Number(b.episode_number || 0) - Number(a.episode_number || 0)
        : Number(a.episode_number || 0) - Number(b.episode_number || 0)
    )

    return sorted
  }, [episodes, reverse])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[140] bg-[#f5f3fa]">
      <header className="sticky top-0 z-10 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Close"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h2 className="line-clamp-1 text-[16px] font-black text-[#111827]">Episodes</h2>
            <div className="mt-0.5 text-[11px] font-semibold text-[#98a2b3]">
              {story?.title || 'Story'} · {episodes.length} total
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReverse((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
            aria-label="Reverse episodes"
          >
            <i className="fa-solid fa-arrow-down-wide-short text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-4 pb-10">
        <div className="mb-4 rounded-[20px] bg-white px-4 py-3 text-[12px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
          Showing {reverse ? 'newest first' : 'oldest first'}
        </div>

        <div className="space-y-3">
          {visibleEpisodes.map((episode) => {
            const locked = episode.is_locked && Number(episode.episode_number || 0) > 1

            return (
              <button
                key={episode.id}
                type="button"
                onClick={() => onOpenEpisode(episode)}
                className="flex w-full items-center gap-3 rounded-[22px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.995]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[12px] font-black text-white">
                  EP {episode.episode_number || 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-[14px] font-black text-[#111827]">
                    {episode.title || 'Untitled Episode'}
                  </h3>
                  <div className="mt-1 text-[11px] font-semibold text-[#98a2b3]">
                    {Number(episode.character_count || 0).toLocaleString()} chars
                  </div>
                </div>

                <span className={`rounded-full px-3 py-1.5 text-[10.5px] font-black ${
                  locked ? 'bg-[#fff7ed] text-[#f97316]' : 'bg-[#ecfdf3] text-[#16803c]'
                }`}>
                  {locked ? 'Locked' : 'Free'}
                </span>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}

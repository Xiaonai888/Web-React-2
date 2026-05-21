import { useMemo, useState } from 'react'

function formatEpisodeDate(value) {
  if (!value) return 'New'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'New'

  return date.toLocaleDateString('en-GB').replaceAll('/', '-')
}

function normalizeStatus(value) {
  const status = String(value || 'ongoing').toLowerCase()

  if (status === 'completed') return 'Completed'
  if (status === 'new') return 'New'

  return 'Ongoing'
}

function normalizeUpdateDays(days) {
  if (!Array.isArray(days) || !days.length) return 'Updates weekly'

  const map = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  }

  const labels = days
    .map((day) => map[String(day).toLowerCase()] || String(day))
    .filter(Boolean)

  if (!labels.length) return 'Updates weekly'

  return `Updates ${labels.join(' & ')}`
}

export default function EpisodeSheetDrawer({
  open,
  onClose,
  episodes,
  currentEpisodeId,
  storyId,
  story,
  navigate,
  theme,
}) {
  const [newestFirst, setNewestFirst] = useState(false)
  const [touchStartY, setTouchStartY] = useState(null)

  const sortedEpisodes = useMemo(() => {
    const list = [...episodes]

    list.sort((a, b) => {
      const first = Number(a.episode_number || 0)
      const second = Number(b.episode_number || 0)
      return newestFirst ? second - first : first - second
    })

    return list
  }, [episodes, newestFirst])

  if (!open) return null

  const title = story?.title || 'Episodes'
  const totalEpisodes = story?.total_episodes || episodes.length
  const status = normalizeStatus(story?.status)
  const updateDays = normalizeUpdateDays(story?.update_days)

  return (
    <div className="fixed inset-0 z-[140] bg-black/45 md:flex md:items-center md:justify-center md:px-4">
      <button
        type="button"
        aria-label="Close episode list"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section
        onTouchStart={(event) => setTouchStartY(event.touches[0].clientY)}
        onTouchEnd={(event) => {
          if (touchStartY === null) return

          const diff = event.changedTouches[0].clientY - touchStartY
          setTouchStartY(null)

          if (diff > 80) onClose()
        }}
        className={`absolute bottom-0 left-0 right-0 z-10 max-h-[88vh] overflow-hidden rounded-t-[28px] ${theme.card} shadow-2xl md:relative md:max-h-[82vh] md:w-full md:max-w-[560px] md:rounded-[28px]`}
      >
        <div className={`sticky top-0 z-20 border-b ${theme.border} ${theme.card}`}>
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-black/15 md:hidden" />

          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.ghost}`}
              aria-label="Back"
            >
              <i className="fa-solid fa-chevron-left text-[14px]" />
            </button>

            <div className="min-w-0 flex-1 text-center">
              <h3 className={`line-clamp-1 text-[17px] font-extrabold ${theme.text}`}>{title}</h3>
              <p className={`mt-0.5 text-[11px] font-bold ${theme.muted}`}>
                All Episodes · {totalEpisodes} total
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.ghost}`}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-[18px]" />
            </button>
          </div>

          <button
            type="button"
            className={`flex w-full items-center gap-2 border-t ${theme.border} px-5 py-3 text-left ${theme.text}`}
          >
            <span className="rounded-[6px] bg-[#3b331d] px-2 py-1 text-[10px] font-black text-[#ffd166]">
              <i className="fa-solid fa-crown mr-1 text-[9px]" />
              Premium
            </span>
            <span className="text-[13px] font-extrabold">Early Access</span>
            <i className="fa-solid fa-chevron-right text-[10px] opacity-60" />
          </button>
        </div>

        <div className="max-h-[64vh] overflow-y-auto md:max-h-[58vh]">
          <div className={`flex items-center justify-between gap-4 border-b ${theme.border} px-5 py-4`}>
            <div>
              <h4 className={`text-[15px] font-black ${theme.text}`}>{status}</h4>
              <p className={`mt-1 text-[12px] font-bold ${theme.muted}`}>{updateDays}</p>
            </div>

            <button
              type="button"
              onClick={() => setNewestFirst((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.ghost}`}
              aria-label="Reverse episode order"
            >
              <i className="fa-solid fa-arrow-down-wide-short text-[16px]" />
            </button>
          </div>

          {sortedEpisodes.map((item) => {
            const active = String(item.id) === String(currentEpisodeId)
            const cover = item.cover_url || story?.cover_url || ''
            const comments = item.total_comments || item.comments_count || item.comment_count || 0

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose()
                  navigate(`/story/${storyId}/episode/${item.id}`)
                }}
                className={`flex w-full items-center gap-4 border-b ${theme.border} px-5 py-4 text-left transition active:scale-[0.99] ${
                  active ? theme.soft : ''
                }`}
              >
                <div className="relative h-[72px] w-[114px] shrink-0 overflow-hidden rounded-[10px] bg-[#111827]">
                  {cover ? (
                    <img src={cover} alt={item.title || 'Episode'} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#e5e7eb] text-[#98a2b3]">
                      <i className="fa-solid fa-book-open text-[20px]" />
                    </div>
                  )}

                  {item.is_locked ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                      <i className="fa-solid fa-lock text-[17px] drop-shadow" />
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`line-clamp-1 text-[15px] font-extrabold ${theme.text}`}>
                      {item.title || `Ep. ${item.episode_number || 1}`}
                    </h4>

                    {item.is_locked ? (
                      <span className="shrink-0 rounded-full bg-[#fff4e8] px-2.5 py-1 text-[10px] font-black text-[#ff6b00]">
                        Locked
                      </span>
                    ) : null}
                  </div>

                  <div className={`mt-2 flex flex-wrap items-center gap-4 text-[12px] font-bold ${theme.muted}`}>
                    <span>{formatEpisodeDate(item.published_at || item.created_at)}</span>
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-comment-dots text-[12px]" />
                      {comments}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

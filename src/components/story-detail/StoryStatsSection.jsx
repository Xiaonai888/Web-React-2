function formatShortNumber(value) {
  const number = Number(value || 0)
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return number.toLocaleString()
}

function getRankByViews(views) {
  const number = Number(views || 0)
  if (number >= 1000000) return 1
  if (number >= 500000) return 3
  if (number >= 100000) return 10
  if (number >= 50000) return 25
  if (number >= 10000) return 50
  return 99
}

function StatItem({ label, value, icon, highlight, onClick }) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="min-w-0 text-center active:scale-[0.99]"
    >
      <div className={`text-[20px] font-black ${highlight ? 'text-[#ff8a3d]' : 'text-[#111827]'}`}>
        {value}
        {onClick ? <i className="fa-solid fa-chevron-right ml-1 text-[10px] text-[#ff8a3d]" /> : null}
      </div>
      <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-[#98a2b3]">
        <i className={`${icon} text-[11px]`} />
        {label}
      </div>
    </Component>
  )
}

export default function StoryStatsSection({ story, episodes, onOpenRating }) {
  const rank = getRankByViews(story?.total_views)
  const rating = story?.rating_average || story?.rating || '4.8'
  const reviewCount = story?.rating_count || story?.review_count || story?.total_reviews || ''

  return (
    <section className="relative z-20 -mt-10">
      <div className="mx-auto overflow-hidden rounded-t-[24px] bg-white shadow-[0_-10px_28px_rgba(17,24,39,0.08)] ring-1 ring-black/5">
        <div className="px-4 pt-4">
          <div className="flex h-12 items-center justify-between rounded-full bg-[#fff7df] px-5 text-[#111827]">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-trophy text-[15px] text-[#f6a800]" />
              <span className="text-[14px] font-black">No.{rank}</span>
            </div>
            <i className="fa-solid fa-chevron-right text-[12px] text-[#f6a800]" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-5 py-5">
          <StatItem label="Total Likes" value={formatShortNumber(story?.total_likes)} icon="fa-regular fa-heart" />
          <StatItem label="Total Views" value={formatShortNumber(story?.total_views)} icon="fa-regular fa-eye" />
          <StatItem
            label={reviewCount ? `${formatShortNumber(reviewCount)} Reviews` : 'Total Rate'}
            value={rating}
            icon="fa-solid fa-star"
            highlight
            onClick={onOpenRating}
          />
        </div>
      </div>
    </section>
  )
}

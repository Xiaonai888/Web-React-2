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

function StatCard({ label, value, icon, onClick }) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="min-w-0 rounded-[22px] bg-white px-3 py-4 text-center shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
    >
      <i className={`${icon} mb-2 text-[18px] text-[#111827]`} />
      <div className="text-[17px] font-black text-[#111827]">{value}</div>
      <div className="mt-1 text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-[#98a2b3]">{label}</div>
    </Component>
  )
}

export default function StoryStatsSection({ story, episodes, onOpenRating }) {
  const rank = getRankByViews(story?.total_views)
  const rating = story?.rating_average || story?.rating || '4.8'

  return (
    <section className="-mt-8 relative z-10 grid grid-cols-4 gap-2 sm:gap-3">
      <StatCard label="Rank" value={`No.${rank}`} icon="fa-solid fa-ranking-star" />
      <StatCard label="Likes" value={formatShortNumber(story?.total_likes)} icon="fa-regular fa-heart" />
      <StatCard label="Views" value={formatShortNumber(story?.total_views)} icon="fa-regular fa-eye" />
      <StatCard
        label="Rate"
        value={rating}
        icon="fa-solid fa-star"
        onClick={onOpenRating}
      />
    </section>
  )
}

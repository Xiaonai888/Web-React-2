function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function formatDate(value) {
  if (!value) return 'Just now'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Just now'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getPostTitle(post) {
  const text = String(post?.content || '').replace(/\s+/g, ' ').trim()

  if (!text) return 'Author post'
  return text.length > 70 ? `${text.slice(0, 70)}…` : text
}

function OverviewMetric({ label, value, note }) {
  return (
    <div className="rounded-[14px] bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
      <div className="text-[9px] font-semibold text-white/75 sm:text-[10px]">{label}</div>
      <div className="mt-1 text-[20px] font-black leading-none text-white sm:text-[24px]">
        {formatCompactNumber(value)}
      </div>
      <div className="mt-2 text-[8px] font-semibold text-white/70 sm:text-[9px]">{note}</div>
    </div>
  )
}

function RecentContentRow({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[17px] bg-white p-3 text-left shadow-sm ring-1 ring-[#ece7f5] transition active:scale-[0.99]"
    >
      <span className="flex h-[66px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[#f0ebfa] text-[#8b5cf6]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className={`${item.type === 'story' ? 'fa-solid fa-book-open' : 'fa-regular fa-image'} text-[22px]`} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[12px] font-bold leading-4 text-[#282238]">
          {item.title}
        </span>
        <span className="mt-1 block text-[9.5px] font-medium text-[#9891a5]">
          {formatDate(item.date)}
        </span>
        <span className="mt-1.5 inline-flex rounded-full bg-[#dcfce7] px-2 py-1 text-[8.5px] font-bold text-[#16a34a]">
          Published
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-[13px] font-black text-[#282238]">
          {formatCompactNumber(item.metric)}
        </span>
        <span className="mt-1 block text-[8.5px] font-semibold text-[#9b95aa]">
          {item.metricLabel}
        </span>
      </span>
    </button>
  )
}

export default function AuthorDashboardContentTab({
  overview = {},
  periodMetrics = {},
  topStories = [],
  latestPost = null,
  analyticsPeriod = '28 Days',
  onPeriodChange,
  onOpenStory,
  onOpenPost,
  onViewAll,
  onCreateContent,
}) {
  const recentItems = [
    ...(latestPost
      ? [
          {
            id: `post-${latestPost.id}`,
            type: 'post',
            title: getPostTitle(latestPost),
            imageUrl: Array.isArray(latestPost.image_urls) ? latestPost.image_urls[0] : '',
            date: latestPost.created_at,
            metric:
              Number(latestPost.like_count || 0) +
              Number(latestPost.comment_count || 0) +
              Number(latestPost.echo_count || 0),
            metricLabel: 'Engagement',
            raw: latestPost,
          },
        ]
      : []),
    ...(Array.isArray(topStories) ? topStories : []).map((story) => ({
      id: `story-${story.id}`,
      type: 'story',
      title: story.title || 'Untitled story',
      imageUrl: story.cover_url || '',
      date: story.updated_at || story.created_at,
      metric: Number(story.total_views || 0),
      metricLabel: 'Views',
      raw: story,
    })),
  ]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 3)

  const likes =
    Number(overview.postLikes || 0) +
    Number(overview.storyLikes || 0)
  const comments =
    Number(overview.postComments || 0) +
    Number(overview.storyComments || 0)
  const shares = Number(overview.postEchoes || 0)
  const interactionTotal = likes + comments + shares
  const likesPercent = interactionTotal ? Math.round((likes / interactionTotal) * 100) : 0
  const commentsPercent = interactionTotal
    ? Math.round((comments / interactionTotal) * 100)
    : 0
  const sharesPercent = interactionTotal
    ? Math.max(0, 100 - likesPercent - commentsPercent)
    : 0
  const secondStop = likesPercent + commentsPercent
  const donutBackground = interactionTotal
    ? `conic-gradient(#6d28d9 0 ${likesPercent}%, #8b5cf6 ${likesPercent}% ${secondStop}%, #c4b5fd ${secondStop}% 100%)`
    : '#ede9fe'
  const periodLabel =
    analyticsPeriod === '7 Days'
      ? 'Last 7 days'
      : analyticsPeriod === '28 Days'
        ? 'Last 28 days'
        : 'Today'

  return (
    <div className="mx-auto max-w-[720px] space-y-4">
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] p-4 text-white shadow-[0_16px_38px_rgba(109,40,217,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[14px] font-black sm:text-[16px]">Content Overview</h1>
          <select
            value={analyticsPeriod}
            onChange={(event) => onPeriodChange?.(event.target.value)}
            className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-bold text-white outline-none ring-1 ring-white/15"
          >
            <option value="Today" className="text-[#282238]">Today</option>
            <option value="7 Days" className="text-[#282238]">Last 7 days</option>
            <option value="28 Days" className="text-[#282238]">Last 28 days</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <OverviewMetric label="Posts" value={overview.posts} note="Total" />
          <OverviewMetric
            label="Views"
            value={Number(periodMetrics.views || 0) + Number(periodMetrics.storyReads || 0)}
            note={periodLabel}
          />
          <OverviewMetric
            label="Engagement"
            value={periodMetrics.interactions}
            note={periodLabel}
          />
          <OverviewMetric label="Followers" value={overview.followers} note="Total" />
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[#282238] sm:text-[16px]">Recent Content</h2>
          <button
            type="button"
            onClick={onViewAll}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            View All
          </button>
        </div>

        <div className="mt-3 space-y-2.5">
          {recentItems.length ? (
            recentItems.map((item) => (
              <RecentContentRow
                key={item.id}
                item={item}
                onOpen={() =>
                  item.type === 'story'
                    ? onOpenStory?.(item.raw)
                    : onOpenPost?.(item.raw)
                }
              />
            ))
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
                <i className="fa-regular fa-file-lines text-[18px]" />
              </span>
              <div className="mt-3 text-[13px] font-bold text-[#302a43]">No content yet</div>
              <div className="mt-1 max-w-[260px] text-[10px] font-medium leading-5 text-[#918a9e]">
                Published stories and author posts will appear here.
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
        <h2 className="text-[14px] font-black text-[#282238] sm:text-[16px]">
          Engagement Breakdown
        </h2>

        <div className="mt-4 flex items-center gap-6">
          <div
            className="relative flex h-[126px] w-[126px] shrink-0 items-center justify-center rounded-full"
            style={{ background: donutBackground }}
          >
            <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-white">
              <span className="text-[16px] font-black text-[#282238]">
                {formatCompactNumber(interactionTotal)}
              </span>
              <span className="text-[8px] font-bold text-[#9b95aa]">Total</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {[
              ['#6d28d9', 'Likes', likesPercent],
              ['#8b5cf6', 'Comments', commentsPercent],
              ['#c4b5fd', 'Shares', sharesPercent],
            ].map(([color, label, percent]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="min-w-0 flex-1 text-[10px] font-semibold text-[#625b70]">
                  {label}
                </span>
                <span className="text-[10px] font-black text-[#282238]">{percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onCreateContent}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)] active:scale-[0.99]"
      >
        <i className="fa-solid fa-plus text-[12px]" />
        Create New Content
      </button>
    </div>
  )
}

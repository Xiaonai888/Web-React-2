import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function formatTimeAgo(value) {
  if (!value) return 'Just now'

  const date = new Date(value)
  const time = date.getTime()

  if (Number.isNaN(time)) return 'Just now'

  const seconds = Math.max(1, Math.floor((Date.now() - time) / 1000))

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getPeriodText(value) {
  if (value === 'Today') return 'Today'
  if (value === '7 Days') return 'Last 7 days'
  return 'Last 28 days'
}

async function fetchAuthorReviews(pageUsername) {
  if (!pageUsername) {
    return {
      reviews: [],
      summary: {
        total_count: 0,
        recommend_count: 0,
        recommend_percent: 0,
      },
    }
  }

  const token = getAuthToken()
  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/reviews`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load reviews')
  }

  return {
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    summary: data.summary || {
      total_count: 0,
      recommend_count: 0,
      recommend_percent: 0,
    },
  }
}

function CommunityMetric({ icon, label, value, note }) {
  return (
    <div className="rounded-[16px] bg-white/10 p-3 ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-white/85">
        <i className={`${icon} text-[15px]`} />
        <span className="text-[9px] font-semibold sm:text-[10px]">{label}</span>
      </div>
      <div className="mt-2 text-[24px] font-black leading-none text-white sm:text-[28px]">
        {value}
      </div>
      <div className="mt-2 text-[8.5px] font-semibold text-white/70">{note}</div>
    </div>
  )
}

function ReviewCard({ review, onOpen }) {
  const recommended = review?.is_recommended !== false
  const avatarUrl = review?.reviewer_avatar_url || ''
  const name = review?.reviewer_name || review?.reviewer_username || 'Reader'
  const text = review?.review_text || (recommended ? 'Recommended this Author Page.' : 'Shared feedback about this Author Page.')

  return (
    <button
      type="button"
      onClick={() => onOpen?.(review)}
      className="w-[172px] shrink-0 rounded-[17px] bg-white p-3 text-left shadow-sm ring-1 ring-[#ece7f5] transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1eafe] text-[#8b5cf6]">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[12px]" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[10.5px] font-black text-[#2b253b]">{name}</span>
          <span className="mt-1 flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((item) => (
              <i
                key={item}
                className={`fa-${recommended ? 'solid' : 'regular'} fa-star text-[8px] ${
                  recommended ? 'text-[#f59e0b]' : 'text-[#c8c1d2]'
                }`}
              />
            ))}
          </span>
        </span>
      </div>

      <div className="mt-3 line-clamp-3 min-h-[48px] text-[9.5px] font-medium leading-4 text-[#696174]">
        {text}
      </div>

      <div className="mt-2 text-right text-[8px] font-semibold text-[#a19aaa]">
        {formatTimeAgo(review?.created_at)}
      </div>
    </button>
  )
}

function DiscussionRow({ item, onOpen }) {
  const comment = item?.comment || {}
  const post = item?.post || {}
  const count = Number(post?.comment_count || 0)

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className="flex w-full items-center gap-3 border-b border-[#eee9f7] px-3 py-3 text-left last:border-b-0 active:bg-[#faf8ff]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
        <i className="fa-regular fa-comments text-[12px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[10px] font-bold leading-4 text-[#352e46]">
          {comment.text || 'New community discussion'}
        </span>
        <span className="mt-1 block text-[8.5px] font-semibold text-[#9a93a5]">
          {formatCompactNumber(count)} comments
        </span>
      </span>

      <span className="shrink-0 text-[8px] font-semibold text-[#a19aaa]">
        {formatTimeAgo(comment.created_at)}
      </span>
    </button>
  )
}

export default function AuthorDashboardCommunityTab({
  pageUsername = '',
  overview = {},
  periodMetrics = {},
  recentComments = [],
  analyticsPeriod = '28 Days',
  onPeriodChange,
  onOpenReview,
  onOpenDiscussion,
  onViewAllReviews,
  onViewAllDiscussions,
}) {
  const [reviews, setReviews] = useState([])
  const [reviewSummary, setReviewSummary] = useState({
    total_count: 0,
    recommend_count: 0,
    recommend_percent: 0,
  })
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadReviews() {
      if (!pageUsername) {
        setReviews([])
        setReviewSummary({
          total_count: 0,
          recommend_count: 0,
          recommend_percent: 0,
        })
        return
      }

      try {
        setLoadingReviews(true)
        setReviewError('')
        const data = await fetchAuthorReviews(pageUsername)

        if (ignore) return

        setReviews(data.reviews)
        setReviewSummary(data.summary)
      } catch (error) {
        if (!ignore) {
          setReviewError(error.message || 'Failed to load reviews')
        }
      } finally {
        if (!ignore) setLoadingReviews(false)
      }
    }

    loadReviews()

    return () => {
      ignore = true
    }
  }, [pageUsername])

  const periodText = getPeriodText(analyticsPeriod)
  const views = Number(periodMetrics.views || 0) + Number(periodMetrics.storyReads || 0)
  const interactions = Number(periodMetrics.interactions || 0)
  const engagementRate = views > 0 ? (interactions / views) * 100 : 0
  const recentReviewItems = reviews.slice(0, 3)
  const discussionItems = Array.isArray(recentComments) ? recentComments.slice(0, 3) : []

  const breakdown = useMemo(() => {
    const values = [
      {
        label: 'Comments',
        value: Math.max(Number(periodMetrics.comments || 0), discussionItems.length),
        color: '#6d28d9',
      },
      {
        label: 'Reviews',
        value: Number(reviewSummary.total_count || 0),
        color: '#8b5cf6',
      },
      {
        label: 'Discussions',
        value: discussionItems.length,
        color: '#a78bfa',
      },
      {
        label: 'Followers',
        value: Number(periodMetrics.followers || 0),
        color: '#c4b5fd',
      },
    ]
    const total = values.reduce((sum, item) => sum + item.value, 0)
    let current = 0
    const stops = values.map((item) => {
      const percent = total ? Math.round((item.value / total) * 100) : 0
      const start = current
      current += percent

      return {
        ...item,
        percent,
        start,
        end: current,
      }
    })
    const background = total
      ? `conic-gradient(${stops
          .map((item) => `${item.color} ${item.start}% ${item.end}%`)
          .join(', ')})`
      : '#ede9fe'

    return {
      total,
      stops,
      background,
    }
  }, [discussionItems.length, periodMetrics.comments, periodMetrics.followers, reviewSummary.total_count])

  return (
    <div className="mx-auto max-w-[760px] space-y-4">
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] p-4 text-white shadow-[0_16px_38px_rgba(109,40,217,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[15px] font-black sm:text-[17px]">Community Overview</h1>
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

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <CommunityMetric
            icon="fa-solid fa-user-plus"
            label="New Followers"
            value={formatCompactNumber(periodMetrics.followers)}
            note={periodText}
          />
          <CommunityMetric
            icon="fa-regular fa-comments"
            label="Comments"
            value={formatCompactNumber(periodMetrics.comments)}
            note={periodText}
          />
          <CommunityMetric
            icon="fa-regular fa-star"
            label="Reviews"
            value={formatCompactNumber(reviewSummary.total_count)}
            note={`${formatCompactNumber(reviewSummary.recommend_percent)}% recommend`}
          />
          <CommunityMetric
            icon="fa-solid fa-arrow-trend-up"
            label="Engagement Rate"
            value={`${engagementRate.toFixed(engagementRate >= 10 ? 0 : 1)}%`}
            note={`${formatCompactNumber(interactions)} interactions`}
          />
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[#2b253b] sm:text-[16px]">Recent Reviews</h2>
          <button
            type="button"
            onClick={onViewAllReviews}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            View all
          </button>
        </div>

        {loadingReviews ? (
          <div className="flex h-[150px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ede9fe] border-t-[#8b5cf6]" />
          </div>
        ) : reviewError ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center px-5 text-center">
            <i className="fa-solid fa-circle-exclamation text-[20px] text-[#8b5cf6]" />
            <div className="mt-3 text-[11px] font-bold text-[#302a43]">{reviewError}</div>
          </div>
        ) : recentReviewItems.length ? (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {recentReviewItems.map((review) => (
              <ReviewCard key={review.id} review={review} onOpen={onOpenReview} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[150px] flex-col items-center justify-center px-5 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
              <i className="fa-regular fa-star text-[18px]" />
            </span>
            <div className="mt-3 text-[12px] font-bold text-[#302a43]">No reviews yet</div>
            <div className="mt-1 text-[10px] font-medium text-[#918a9e]">
              Reader reviews will appear here.
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[#2b253b] sm:text-[16px]">Top Discussions</h2>
          <button
            type="button"
            onClick={onViewAllDiscussions}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            View all
          </button>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-center">
          <div className="overflow-hidden rounded-[17px] ring-1 ring-[#eee9f7]">
            {discussionItems.length ? (
              discussionItems.map((item) => (
                <DiscussionRow
                  key={item.comment?.id || item.post?.id}
                  item={item}
                  onOpen={onOpenDiscussion}
                />
              ))
            ) : (
              <div className="flex min-h-[160px] flex-col items-center justify-center px-5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
                  <i className="fa-regular fa-comments text-[16px]" />
                </span>
                <div className="mt-3 text-[11px] font-bold text-[#302a43]">No discussions yet</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 sm:block">
            <div
              className="flex h-[126px] w-[126px] shrink-0 items-center justify-center rounded-full sm:mx-auto"
              style={{ background: breakdown.background }}
            >
              <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full bg-white text-center">
                <span className="text-[8px] font-bold leading-3 text-[#4d465c]">Engagement</span>
                <span className="text-[8px] font-bold leading-3 text-[#4d465c]">Breakdown</span>
              </div>
            </div>

            <div className="min-w-[130px] space-y-2.5 sm:mt-4">
              {breakdown.stops.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="min-w-0 flex-1 text-[9px] font-semibold text-[#655e70]">{item.label}</span>
                  <span className="text-[9px] font-black text-[#2b253b]">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

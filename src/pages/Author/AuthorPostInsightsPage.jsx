import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US')
}

function formatDateTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const SOURCE_LABELS = {
  feed: 'Feed',
  suggested: 'Suggested',
  follower_feed: 'Follower feed',
  author_page: 'Author page',
  discover: 'Discover',
  search: 'Search',
  share: 'Shared link',
  notification: 'Notification',
  direct: 'Direct',
  other: 'Other',
}

const REACTION_LABELS = {
  love: 'Love',
  haha: 'Haha',
  wow: 'Wow',
  sad: 'Sad',
  angry: 'Angry',
  support: 'Support',
  touched: 'Touched',
}

const REACTION_ICONS = {
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
  support: '💜',
  touched: '🥹',
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[#eceef2] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-[#7b8190]">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f1ff] text-[#6d4aff]">
          <i className={`${icon} text-[12px]`} />
        </span>
      </div>
      <div className="mt-4 text-[25px] font-bold tracking-[-0.02em] text-[#111827]">
        {formatNumber(value)}
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[#eceef2] bg-white">
      <div className="px-4 pb-3 pt-4 sm:px-5">
        <h2 className="text-[15px] font-bold text-[#111827]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-[11px] leading-5 text-[#8d94a1]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function ViewsChart({ timeline = [] }) {
  const chart = useMemo(() => {
    const items = Array.isArray(timeline)
      ? timeline.filter((item) => item?.time)
      : []

    if (!items.length) {
      return {
        path: '',
        points: [],
        max: 0,
      }
    }

    const width = 600
    const height = 190
    const paddingX = 12
    const paddingY = 18
    const max = Math.max(
      1,
      ...items.map((item) => Number(item.cumulative_views || 0))
    )
    const usableWidth = width - paddingX * 2
    const usableHeight = height - paddingY * 2
    const divisor = Math.max(1, items.length - 1)

    const points = items.map((item, index) => {
      const x = paddingX + (index / divisor) * usableWidth
      const y =
        height -
        paddingY -
        (Number(item.cumulative_views || 0) / max) * usableHeight

      return {
        x,
        y,
        value: Number(item.cumulative_views || 0),
        time: item.time,
      }
    })

    return {
      path: points
        .map((point, index) =>
          `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        )
        .join(' '),
      points,
      max,
    }
  }, [timeline])

  if (!chart.points.length) {
    return (
      <div className="flex h-[220px] items-center justify-center px-6 text-center">
        <div>
          <div className="text-[14px] font-semibold text-[#111827]">
            No views yet
          </div>
          <div className="mt-1 text-[11px] text-[#8d94a1]">
            Views will appear after readers open this post.
          </div>
        </div>
      </div>
    )
  }

  const first = chart.points[0]
  const last = chart.points[chart.points.length - 1]

  return (
    <div className="px-4 pb-4 sm:px-5">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="text-[26px] font-bold tracking-[-0.02em] text-[#111827]">
            {formatNumber(last?.value)}
          </div>
          <div className="text-[11px] text-[#8d94a1]">
            Total post views
          </div>
        </div>
        <div className="text-right text-[10px] text-[#9ca3af]">
          Lifetime
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] bg-[#fafafe] px-2 py-3">
        <svg
          viewBox="0 0 600 190"
          className="h-[190px] w-full"
          role="img"
          aria-label="Post views chart"
        >
          <line x1="12" y1="172" x2="588" y2="172" stroke="#e8e8ef" strokeWidth="1" />
          <line x1="12" y1="95" x2="588" y2="95" stroke="#efeff5" strokeWidth="1" />
          <line x1="12" y1="18" x2="588" y2="18" stroke="#efeff5" strokeWidth="1" />
          <path
            d={chart.path}
            fill="none"
            stroke="#6d4aff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chart.points.map((point, index) => (
            <circle
              key={`${point.time}-${index}`}
              cx={point.x}
              cy={point.y}
              r={index === chart.points.length - 1 ? 5 : 3}
              fill="#ffffff"
              stroke="#6d4aff"
              strokeWidth="3"
            />
          ))}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-[#9ca3af]">
        <span>{formatDateTime(first?.time)}</span>
        <span>{formatDateTime(last?.time)}</span>
      </div>
    </div>
  )
}

function AudienceBar({ audience }) {
  const followerPercentage = Math.max(
    0,
    Math.min(100, Number(audience?.follower_percentage || 0))
  )
  const nonFollowerPercentage = Math.max(
    0,
    Math.min(100, Number(audience?.non_follower_percentage || 0))
  )

  return (
    <div className="px-4 pb-5 sm:px-5">
      <div className="flex h-3 overflow-hidden rounded-full bg-[#eceef2]">
        <div
          className="h-full bg-[#6d4aff]"
          style={{ width: `${followerPercentage}%` }}
        />
        <div
          className="h-full bg-[#b7a9ff]"
          style={{ width: `${nonFollowerPercentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[14px] bg-[#f8f7ff] p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#6d4aff]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#6d4aff]" />
            Followers
          </div>
          <div className="mt-2 text-[20px] font-bold text-[#111827]">
            {followerPercentage.toFixed(1)}%
          </div>
          <div className="mt-1 text-[10px] text-[#8d94a1]">
            {formatNumber(audience?.followers)} viewers
          </div>
        </div>

        <div className="rounded-[14px] bg-[#faf9ff] p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium text-[#7b6bc7]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#b7a9ff]" />
            Non-followers
          </div>
          <div className="mt-2 text-[20px] font-bold text-[#111827]">
            {nonFollowerPercentage.toFixed(1)}%
          </div>
          <div className="mt-1 text-[10px] text-[#8d94a1]">
            {formatNumber(audience?.non_followers)} viewers
          </div>
        </div>
      </div>
    </div>
  )
}

function TrafficList({ traffic = [] }) {
  if (!traffic.length) {
    return (
      <div className="px-5 pb-6 pt-2 text-[12px] text-[#8d94a1]">
        No traffic source data yet.
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#f0f1f4] px-4 pb-2 sm:px-5">
      {traffic.map((item) => {
        const percentage = Math.max(
          0,
          Math.min(100, Number(item.percentage || 0))
        )

        return (
          <div key={item.source} className="py-3.5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 text-[12px] font-medium text-[#262b35]">
                {SOURCE_LABELS[item.source] || item.source || 'Other'}
              </div>
              <div className="shrink-0 text-[11px] text-[#717784]">
                {formatNumber(item.views)} · {percentage.toFixed(1)}%
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eef0f3]">
              <div
                className="h-full rounded-full bg-[#6d4aff]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ReactionBreakdown({ reactions = {} }) {
  const items = Object.entries(reactions)
    .filter(([, count]) => Number(count || 0) > 0)
    .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))

  if (!items.length) return null

  return (
    <div className="border-t border-[#f0f1f4] px-4 py-3 sm:px-5">
      <div className="mb-2 text-[11px] font-medium text-[#8d94a1]">
        Reaction breakdown
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(([type, count]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 rounded-full bg-[#f7f7fa] px-3 py-1.5 text-[11px] text-[#505562]"
          >
            <span>{REACTION_ICONS[type] || '•'}</span>
            <span>{REACTION_LABELS[type] || type}</span>
            <strong className="font-semibold text-[#111827]">
              {formatNumber(count)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AuthorPostInsightsPage() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    async function loadInsights() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
            postId || ''
          )}/insights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load post insights')
        }

        if (!ignore) {
          setData(result)
        }
      } catch (loadError) {
        if (!ignore && loadError?.name !== 'AbortError') {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Cannot connect to backend.'
              : loadError.message || 'Failed to load post insights'
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadInsights()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, postId])

  const post = data?.post || {}
  const overview = data?.overview || {}
  const engagement = data?.engagement || {}
  const audience = data?.audience || {}
  const firstImage = Array.isArray(post.image_urls)
    ? post.image_urls.find(Boolean)
    : ''

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#e9eaf0] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid h-[58px] max-w-3xl grid-cols-[44px_1fr_44px] items-center px-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[15px] font-bold">
            Post insights
          </h1>
          <div />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 pb-12 pt-3 sm:px-5">
        {loading ? (
          <div className="rounded-[18px] border border-[#eceef2] bg-white px-5 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e7e7ed] border-t-[#6d4aff]" />
            <div className="mt-3 text-[12px] text-[#8d94a1]">
              Loading post insights...
            </div>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-[18px] border border-[#ffd8dc] bg-white px-5 py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1f2] text-[#e5484d]">
              <i className="fa-solid fa-circle-exclamation text-[16px]" />
            </div>
            <div className="mt-3 text-[14px] font-semibold text-[#111827]">
              Could not load insights
            </div>
            <div className="mt-1 text-[11px] leading-5 text-[#8d94a1]">
              {error}
            </div>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <div className="space-y-3">
            <section className="rounded-[18px] border border-[#eceef2] bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt="Post"
                    className="h-[68px] w-[68px] shrink-0 rounded-[12px] bg-[#f1f2f4] object-cover"
                  />
                ) : (
                  <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[12px] bg-[#f4f1ff] text-[#6d4aff]">
                    <i className="fa-regular fa-file-lines text-[20px]" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 whitespace-pre-wrap text-[13px] font-medium leading-5 text-[#262b35]">
                    {post.content || 'Photo post'}
                  </div>
                  <div className="mt-1.5 text-[10.5px] text-[#969ca8]">
                    Posted {formatDateTime(post.created_at)}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-3 gap-2 sm:gap-3">
              <MetricCard
                icon="fa-regular fa-eye"
                label="Views"
                value={overview.views}
              />
              <MetricCard
                icon="fa-regular fa-user"
                label="Viewers"
                value={overview.viewers}
              />
              <MetricCard
                icon="fa-solid fa-chart-simple"
                label="Engagement"
                value={overview.engagement}
              />
            </section>

            <Section
              title="Views over time"
              subtitle="Cumulative views recorded for this post."
            >
              <ViewsChart timeline={data.views_timeline} />
            </Section>

            <Section
              title="Engagement"
              subtitle="Actions readers took on this post."
            >
              <div className="grid grid-cols-3 divide-x divide-[#f0f1f4] border-t border-[#f0f1f4]">
                <div className="px-3 py-4 text-center">
                  <div className="text-[20px] font-bold text-[#111827]">
                    {formatNumber(engagement.reactions)}
                  </div>
                  <div className="mt-1 text-[10.5px] text-[#8d94a1]">
                    Reactions
                  </div>
                </div>
                <div className="px-3 py-4 text-center">
                  <div className="text-[20px] font-bold text-[#111827]">
                    {formatNumber(engagement.comments)}
                  </div>
                  <div className="mt-1 text-[10.5px] text-[#8d94a1]">
                    Comments
                  </div>
                </div>
                <div className="px-3 py-4 text-center">
                  <div className="text-[20px] font-bold text-[#111827]">
                    {formatNumber(engagement.shares)}
                  </div>
                  <div className="mt-1 text-[10.5px] text-[#8d94a1]">
                    Shares
                  </div>
                </div>
              </div>
              <ReactionBreakdown reactions={engagement.reaction_by_type} />
            </Section>

            <Section
              title="Audience"
              subtitle="Unique viewers grouped by whether they followed your Author Page when the view was recorded."
            >
              <AudienceBar audience={audience} />
            </Section>

            <Section
              title="How people found this post"
              subtitle="Traffic sources recorded when readers opened the post."
            >
              <TrafficList traffic={data.traffic} />
            </Section>
          </div>
        ) : null}
      </main>
    </div>
  )
}

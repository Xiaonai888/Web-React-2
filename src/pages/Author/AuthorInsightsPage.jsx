import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PERIODS = [
  { label: '7 Days', value: '7d' },
  { label: '28 Days', value: '28d' },
  { label: '30 Days', value: '30d' },
]

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
  if (number >= 1000000000) return `${(number / 1000000000).toFixed(number >= 10000000000 ? 0 : 1)}B`
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(Math.round(number))
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

async function requestJson(path, token) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load insights')
  }

  return data
}

function InsightsChart({ series }) {
  const values = useMemo(
    () => (Array.isArray(series) ? series : []).map((item) => Number(item?.story_reads || 0)),
    [series]
  )
  const chartValues = values.length ? values : [0]
  const maxValue = Math.max(...chartValues, 1)
  const points = chartValues
    .map((value, index) => {
      const x = 12 + (index / Math.max(chartValues.length - 1, 1)) * 296
      const y = 126 - (value / maxValue) * 92
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="relative mt-4 h-[178px] overflow-hidden rounded-[12px] bg-white">
      <svg viewBox="0 0 320 150" className="h-[150px] w-full" aria-label="Story reads chart" role="img">
        {[34, 65, 96, 126].map((y) => (
          <line key={y} x1="12" y1={y} x2="308" y2={y} stroke="#eeeafd" strokeWidth="1" />
        ))}
        <polyline
          points={points}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {chartValues.map((value, index) => {
          const [x, y] = points.split(' ')[index].split(',')

          return <circle key={`${index}-${value}`} cx={x} cy={y} r="2.6" fill="#fff" stroke="#8b5cf6" strokeWidth="1.6" />
        })}
      </svg>

      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[9px] font-medium text-[#aaa4b6]">
        <span>Start</span>
        <span>Mid</span>
        <span>Now</span>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-[14px] border border-[#eeeaf7] bg-white p-4 shadow-[0_8px_24px_rgba(87,72,124,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-[#8e879b]">{label}</div>
          <div className="mt-1.5 text-[22px] font-bold leading-none text-[#17131f]">{formatCompactNumber(value)}</div>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2edff] text-[#7c4dff]">
          <i className={`${icon} text-[13px]`} />
        </span>
      </div>
    </div>
  )
}

function StoryRow({ story, maxViews, onOpen }) {
  const views = Number(story?.total_views || 0)
  const likes = Number(story?.total_likes || 0)
  const progress = maxViews > 0 ? Math.max(5, Math.round((views / maxViews) * 100)) : 0

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 border-b border-[#f0edf7] py-3 text-left last:border-b-0 active:bg-[#faf9fe]"
    >
      <div className="flex h-[76px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-[#f1edff] text-[#7c4dff]">
        {story?.cover_url ? (
          <img src={story.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-book-open text-[18px]" />
        )}
      </div>

      <div className="min-w-0 flex-1 self-center">
        <div className="truncate text-[13px] font-bold text-[#1c1726]">{story?.title || 'Untitled story'}</div>
        <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-[#827b8f]">
          <span>{formatCompactNumber(views)} views</span>
          <span className="h-3 w-px bg-[#ddd8e8]" />
          <span>{formatCompactNumber(likes)} likes</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ece9f2]">
          <div className="h-full rounded-full bg-[#9b7cff]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <i className="fa-solid fa-chevron-right self-center text-[10px] text-[#b2acbd]" />
    </button>
  )
}

function EngagementItem({ icon, value, label }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <i className={`${icon} text-[18px] text-[#7c4dff]`} />
      <div className="mt-2 text-[17px] font-bold text-[#17131f]">{formatCompactNumber(value)}</div>
      <div className="mt-0.5 truncate text-[9px] font-medium text-[#8e879b]">{label}</div>
    </div>
  )
}

function LoadingInsights() {
  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-[92px]">
      <header className="h-14 border-b border-[#ece9f2] bg-white" />
      <main className="mx-auto max-w-[720px] px-4 py-5">
        <div className="rounded-[14px] bg-white p-10 text-center shadow-sm ring-1 ring-[#eeeaf7]">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#eee9ff] border-t-[#8b5cf6]" />
          <div className="mt-4 text-[12px] font-semibold text-[#5f586b]">Loading insights...</div>
        </div>
      </main>
      <AuthorStudioBottomNav />
    </div>
  )
}

export default function AuthorInsightsPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('28d')
  const [dashboard, setDashboard] = useState(null)
  const [giftTotal, setGiftTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadInsights = useCallback(async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setError('')

      const [dashboardData, incomeData] = await Promise.all([
        requestJson(`/api/authors/me/dashboard?period=${encodeURIComponent(period)}`, token),
        requestJson('/api/authors/me/income', token).catch(() => null),
      ])

      setDashboard(dashboardData)
      setGiftTotal(Number(incomeData?.gifts?.total_received || 0))
    } catch (loadError) {
      setError(loadError.message || 'Failed to load insights')
    } finally {
      setLoading(false)
    }
  }, [navigate, period])

  useEffect(() => {
    loadInsights()
  }, [loadInsights])

  const totals = dashboard?.period_totals || {}
  const overview = dashboard?.overview || {}
  const series = Array.isArray(dashboard?.analytics) ? dashboard.analytics : []
  const topStories = Array.isArray(dashboard?.top_stories) ? dashboard.top_stories : []
  const maxViews = Math.max(...topStories.map((story) => Number(story?.total_views || 0)), 0)
  const activePeriod = PERIODS.find((item) => item.value === period)?.label || '28 Days'

  if (loading && !dashboard) {
    return <LoadingInsights />
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc] pb-[94px] text-[#17131f]">
      <header className="sticky top-0 z-50 border-b border-[#ece9f2] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid h-14 max-w-[720px] grid-cols-[44px_1fr_44px] items-center px-2">
          <button
            type="button"
            onClick={() => navigate('/author/dashboard')}
            className="flex h-10 w-10 items-center justify-center text-black active:opacity-60"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <h1 className="text-center text-[15px] font-semibold text-black">Insights</h1>
          <div />
        </div>
      </header>

      {error ? (
        <div className="mx-auto max-w-[720px] px-4 pt-4">
          <button
            type="button"
            onClick={loadInsights}
            className="w-full rounded-[16px] bg-white px-4 py-3 text-left text-[11px] font-semibold text-[#ef4444] shadow-sm ring-1 ring-[#f4dede]"
          >
            {error} · Tap to retry
          </button>
        </div>
      ) : null}

      <main className="mx-auto max-w-[720px] space-y-4 px-4 py-5">
        <section>
          <div className="text-[10px] font-bold tracking-[0.12em] text-[#8061e8]">STORY PERFORMANCE</div>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.03em] text-[#17131f]">See what readers love</h2>

          <div className="mt-4 flex gap-2">
            {PERIODS.map((item) => {
              const active = item.value === period

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`h-10 flex-1 rounded-[12px] text-[11px] font-normal transition active:scale-[0.98] ${
  active
    ? 'bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white shadow-[0_7px_16px_rgba(124,58,237,0.22)]'
    : 'bg-[#f8f7fb] text-[#716b7d] ring-1 ring-[#e7e3ed]'
}`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-[14px] border border-[#ece8f5] bg-white p-4 shadow-[0_10px_30px_rgba(87,72,124,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold text-[#8e879b]">Total Reads</div>
              <div className="mt-1 text-[36px] font-bold leading-none tracking-[-0.04em] text-[#17131f]">
                {formatCompactNumber(totals.story_reads)}
              </div>
            </div>
            <div className="rounded-full bg-[#f1ecff] px-3 py-1.5 text-[9px] font-semibold text-[#7250dc]">
              {activePeriod}
            </div>
          </div>

          <div className="mt-2 text-[9.5px] font-medium text-[#9a94a4]">
            {formatDate(dashboard?.date_from)} – {formatDate(dashboard?.date_to)}
          </div>

          <InsightsChart series={series} />
        </section>

        <section className="grid grid-cols-2 gap-3">
          <MetricCard icon="fa-regular fa-eye" label="Page Views" value={totals.page_views} />
          <MetricCard icon="fa-regular fa-heart" label="Interactions" value={totals.interactions} />
          <MetricCard icon="fa-solid fa-user-plus" label="New Followers" value={totals.new_followers} />
          <MetricCard icon="fa-regular fa-comment" label="Comments" value={totals.comments} />
        </section>

        <section className="rounded-[14px] border border-[#ece8f5] bg-white p-4 shadow-[0_10px_30px_rgba(87,72,124,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-[#17131f]">Top Stories</h2>
            <button
              type="button"
              onClick={() => navigate('/author/dashboard#author-stories')}
              className="text-[10px] font-semibold text-[#7652e8] active:opacity-60"
            >
              View all
            </button>
          </div>

          <div className="mt-2">
            {topStories.length ? (
              topStories.slice(0, 3).map((story) => (
                <StoryRow
                  key={story.id}
                  story={story}
                  maxViews={maxViews}
                  onOpen={() => navigate(`/author/story/${story.id}/manage`)}
                />
              ))
            ) : (
              <div className="py-10 text-center">
                <i className="fa-solid fa-book-open text-[24px] text-[#b8a8ef]" />
                <div className="mt-3 text-[11px] font-semibold text-[#7e7789]">No published stories yet</div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[14px] border border-[#ece8f5] bg-white p-4 shadow-[0_10px_30px_rgba(87,72,124,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-[#17131f]">Reader Engagement</h2>
            <span className="text-[9px] font-medium text-[#a09aa9]">All time</span>
          </div>

          <div className="mt-5 flex divide-x divide-[#ece8f2]">
            <EngagementItem icon="fa-regular fa-heart" value={overview.story_likes} label="Likes" />
            <EngagementItem icon="fa-regular fa-comment" value={overview.story_comments} label="Comments" />
            <EngagementItem icon="fa-solid fa-gift" value={giftTotal} label="Gifts" />
          </div>
        </section>
      </main>

      <AuthorStudioBottomNav />
    </div>
  )
}

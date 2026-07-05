import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DASHBOARD_TABS = [
  { label: 'Overview', icon: 'fa-regular fa-window-maximize' },
  { label: 'Content', icon: 'fa-regular fa-pen-to-square' },
  { label: 'Community', icon: 'fa-regular fa-comment-dots' },
  { label: 'Page Tools', icon: 'fa-regular fa-square-check' },
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
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function sumBy(items, key) {
  return (Array.isArray(items) ? items : []).reduce(
    (total, item) => total + Number(item?.[key] || 0),
    0
  )
}

function getNextGoal(value, step, minimum) {
  const number = Math.max(0, Number(value || 0))
  return Math.max(minimum, Math.ceil(Math.max(number, 1) / step) * step)
}

function getProfileCompletion(page) {
  const details = page?.profile_details || {}
  const fields = [
    page?.page_name,
    page?.page_username,
    page?.bio,
    page?.avatar_url,
    page?.cover_url,
    details?.email || details?.phone || details?.website,
  ]
  const completed = fields.filter((value) => String(value || '').trim()).length

  return Math.round((completed / fields.length) * 100)
}

const PERIOD_QUERY = {
  '28 Days': '28d',
  '7 Days': '7d',
  Today: 'today',
}

async function fetchMyAuthorDashboard(periodLabel = '28 Days') {
  const token = getAuthToken()

  if (!token) return null

  const period = PERIOD_QUERY[periodLabel] || '28d'
  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/dashboard?period=${encodeURIComponent(period)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load author dashboard')
  }

  return data
}

function DashboardTab({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-semibold transition active:scale-[0.98] sm:h-11 sm:px-6 ${
        active
          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_8px_22px_rgba(139,92,246,0.24)]'
          : 'bg-white text-[#6f6b80] ring-1 ring-[#e8e2f4]'
      }`}
    >
      <i className={`${icon} text-[12px]`} />
      <span>{label}</span>
    </button>
  )
}

function ProgressStat({ label, value, goal, icon, color, softColor, helper }) {
  const safeValue = Math.max(0, Number(value || 0))
  const safeGoal = Math.max(1, Number(goal || 1))
  const percent = Math.min(100, Math.round((safeValue / safeGoal) * 100))

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
      <div className="flex items-center gap-3">
        <div
          className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${color} ${percent}%, #f1edfa ${percent}% 100%)`,
          }}
        >
          <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: softColor || '#f5f0ff', color }}
            >
              <i className={`${icon} text-[14px]`} />
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[24px] font-black leading-none text-[#241f39]">
            {formatCompactNumber(safeValue)}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-[#4d4760]">{label}</div>
          <div className="mt-1 text-[10px] font-medium text-[#9b95aa]">{helper || `Goal ${formatCompactNumber(safeGoal)}`}</div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, note, tone = 'purple' }) {
  const toneClass = {
    purple: 'bg-[#f1eafe] text-[#8b5cf6]',
    pink: 'bg-[#fff0f7] text-[#ec4899]',
    blue: 'bg-[#eef5ff] text-[#3b82f6]',
    green: 'bg-[#ecfdf5] text-[#10b981]',
  }[tone]

  return (
    <div className="rounded-[16px] bg-white p-3 shadow-sm ring-1 ring-[#eee9f7]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[10px] font-semibold text-[#90899e]">{label}</div>
          <div className="mt-1 text-[18px] font-black text-[#241f39]">{formatCompactNumber(value)}</div>
        </div>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
          <i className={`${icon} text-[12px]`} />
        </span>
      </div>
      <div className="mt-2 text-[10px] font-semibold text-[#7c748d]">{note}</div>
    </div>
  )
}

function AnalyticsChart({ series = [], total = 0, periodLabel = '28 Days' }) {
  const values = (Array.isArray(series) ? series : []).map(
    (item) =>
      Number(item?.page_views || 0) +
      Number(item?.story_reads || 0) +
      Number(item?.interactions || 0)
  )
  const chartValues = values.length ? values : [0]
  const max = Math.max(...chartValues, 1)
  const points = chartValues
    .map((value, index) => {
      const x = (index / Math.max(chartValues.length - 1, 1)) * 100
      const y = 48 - (value / max) * 40
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="mt-4 rounded-[18px] bg-gradient-to-b from-white to-[#faf8ff] px-3 pb-3 pt-4 ring-1 ring-[#eee9f7]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-[#8e879d]">Content performance</div>
          <div className="mt-0.5 text-[20px] font-black text-[#241f39]">
            {formatCompactNumber(total)}
          </div>
        </div>
        <div className="rounded-full bg-[#f1eafe] px-3 py-1.5 text-[10px] font-semibold text-[#7c3aed]">
          {periodLabel}
        </div>
      </div>

      <div className="relative h-[180px] overflow-hidden rounded-[14px] bg-white">
        <div className="absolute inset-0 grid grid-rows-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="border-b border-[#f0edf6]" />
          ))}
        </div>

        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="absolute bottom-7 left-3 right-3 top-4 h-[135px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,50 ${points} 100,50`} fill="url(#dashboardArea)" />
          <polyline
            points={points}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[9px] font-medium text-[#aaa3b6]">
          <span>Start</span>
          <span>Mid</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center px-5 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
        <i className={`${icon} text-[18px]`} />
      </span>
      <div className="mt-3 text-[13px] font-bold text-[#302a43]">{title}</div>
      <div className="mt-1 max-w-[260px] text-[11px] font-medium leading-5 text-[#918a9e]">{text}</div>
    </div>
  )
}

function SectionHeader({ title, icon, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
            <i className={`${icon} text-[11px]`} />
          </span>
        ) : null}
        <h2 className="text-[16px] font-black text-[#241f39] sm:text-[18px]">{title}</h2>
      </div>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="text-[11px] font-semibold text-[#8b5cf6] active:opacity-70"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

function LatestPostCard({ post, onOpen }) {
  if (!post) {
    return (
      <EmptyState
        icon="fa-regular fa-pen-to-square"
        title="No post yet"
        text="Your newest author post will appear here after you publish it."
      />
    )
  }

  const imageUrl = Array.isArray(post.image_urls) ? post.image_urls[0] : ''

  return (
    <button type="button" onClick={onOpen} className="mt-4 block w-full text-left active:opacity-90">
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-[#f2ecff] sm:aspect-square">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#8b5cf6]">
              <i className="fa-regular fa-image text-[28px]" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-[#8b5cf6]">Latest Post</div>
          <div className="mt-1 line-clamp-3 text-[13px] font-bold leading-5 text-[#302a43]">
            {post.content || 'Photo update'}
          </div>
          <div className="mt-1.5 text-[10px] font-medium text-[#9891a5]">
            {formatTimeAgo(post.created_at)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#eee9f7] pt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6f687d]">
              <i className="fa-regular fa-heart text-[#8b5cf6]" />
              {formatCompactNumber(post.like_count)}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6f687d]">
              <i className="fa-regular fa-comment text-[#8b5cf6]" />
              {formatCompactNumber(post.comment_count)}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6f687d]">
              <i className="fa-solid fa-retweet text-[#8b5cf6]" />
              {formatCompactNumber(post.echo_count)}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

function RecentCommentRow({ item, onOpen }) {
  const comment = item?.comment || {}
  const post = item?.post || {}
  const user = comment.user || {}
  const avatarUrl = user.avatar_url || ''
  const imageUrl = Array.isArray(post.image_urls) ? post.image_urls[0] : ''
  const name = user.name || user.username || 'Reader'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 border-b border-[#f0edf6] py-3 text-left last:border-b-0 active:bg-[#faf8ff]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f2ecff] text-[#8b5cf6]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-user text-[12px]" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#302a43]">
          <span className="truncate">{name}</span>
          <span className="font-medium text-[#a09aaa]">· {formatTimeAgo(comment.created_at)}</span>
        </span>
        <span className="mt-1 line-clamp-2 block text-[10.5px] font-medium leading-4 text-[#716a7f]">
          {comment.text || 'New comment'}
        </span>
      </span>

      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f2ecff] text-[#8b5cf6]">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-regular fa-file-lines text-[12px]" />
        )}
      </span>
    </button>
  )
}

function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] bg-[#faf8ff] p-3 ring-1 ring-[#eee9f7]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#8b5cf6] shadow-sm">
        <i className={`${icon} text-[14px]`} />
      </span>
      <span className="min-w-0">
        <span className="block text-[18px] font-black text-[#241f39]">{formatCompactNumber(value)}</span>
        <span className="mt-0.5 block text-[10px] font-semibold text-[#918a9e]">{label}</span>
      </span>
    </div>
  )
}

function QuickAction({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[16px] bg-[#faf8ff] p-3 text-left ring-1 ring-[#eee9f7] transition active:scale-[0.99]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] text-white shadow-sm">
        <i className={`${icon} text-[14px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold text-[#302a43]">{title}</span>
        <span className="mt-0.5 block text-[9.5px] font-medium leading-4 text-[#918a9e]">{text}</span>
      </span>
      <i className="fa-solid fa-chevron-right text-[9px] text-[#c4bdce]" />
    </button>
  )
}

function ToolCard({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[16px] bg-white p-3 text-left shadow-sm ring-1 ring-[#ebe5f5] transition active:scale-[0.99]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] text-white">
        <i className={`${icon} text-[14px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold text-[#302a43]">{title}</span>
        <span className="mt-0.5 block text-[9.5px] font-medium leading-4 text-[#918a9e]">{text}</span>
      </span>
      <i className="fa-solid fa-chevron-right text-[9px] text-[#c4bdce]" />
    </button>
  )
}

function DashboardFooter({ navigate }) {
  const items = [
    { label: 'Page', icon: 'fa-regular fa-flag', path: '/author/page' },
    { label: 'Dashboard', icon: 'fa-solid fa-chart-simple', path: '/author/page/dashboard' },
    { label: 'Store', icon: 'fa-solid fa-bag-shopping', path: '/author/page/store' },
    { label: 'Notifications', icon: 'fa-regular fa-bell', path: '/author/page/notifications' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-[#eee9f7] bg-white/95 shadow-[0_-10px_30px_rgba(91,72,140,0.08)] backdrop-blur">
      <div className="mx-auto grid h-[68px] max-w-[980px] grid-cols-4">
        {items.map((item) => {
          const active = item.label === 'Dashboard'

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition active:scale-95 ${
                active ? 'text-[#8b5cf6]' : 'text-[#9f99aa]'
              }`}
            >
              <i className={`${item.icon} text-[18px]`} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function LoadingDashboard({ navigate }) {
  return (
    <div className="min-h-screen bg-[#f8f7ff] pb-[92px]">
      <header className="sticky top-0 z-50 border-b border-[#eee9f7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#302a43] active:bg-[#f4f0fb]"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <div className="text-[16px] font-black text-[#241f39]">Page Dashboard</div>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-5">
        <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-[#eee9f7]">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#ede9fe] border-t-[#8b5cf6]" />
          <div className="mt-4 text-[13px] font-bold text-[#302a43]">Loading dashboard...</div>
        </div>
      </main>

      <DashboardFooter navigate={navigate} />
    </div>
  )
}

export default function AuthorPageDashboardPage() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [authorPage, setAuthorPage] = useState(null)
  const [posts, setPosts] = useState([])
  const [recentComments, setRecentComments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [analyticsPeriod, setAnalyticsPeriod] = useState('28 Days')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      if (!silent) setLoading(true)
      setMessage('')

      const data = await fetchMyAuthorDashboard(analyticsPeriod)

      if (!data?.author_page) {
        throw new Error('Author page not found')
      }

      setDashboardData(data)
      setAuthorPage(data.author_page)
      setPosts(data.latest_post ? [data.latest_post] : [])
      setRecentComments(Array.isArray(data.recent_comments) ? data.recent_comments : [])
      setNotifications(Array.isArray(data.notifications) ? data.notifications : [])
      setUnreadCount(Number(data.unread_updates || 0))
    } catch (error) {
      setMessage(error.message || 'Failed to load Page Dashboard')
    } finally {
      setLoading(false)
    }
  }, [analyticsPeriod, navigate])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    function refreshDashboard() {
      if (document.visibilityState === 'visible') {
        loadDashboard({ silent: true })
      }
    }

    window.addEventListener('focus', refreshDashboard)
    document.addEventListener('visibilitychange', refreshDashboard)

    return () => {
      window.removeEventListener('focus', refreshDashboard)
      document.removeEventListener('visibilitychange', refreshDashboard)
    }
  }, [loadDashboard])

  const overview = useMemo(() => {
    const data = dashboardData?.overview || {}

    return {
      posts: Number(data.posts || 0),
      stories: Number(data.stories || 0),
      followers: Number(data.followers || 0),
      comments: Number(data.comments || 0),
      episodes: Number(data.episodes || 0),
      postLikes: Number(data.post_likes || 0),
      postComments: Number(data.post_comments || 0),
      postEchoes: Number(data.post_echoes || 0),
      storyViews: Number(data.story_views || 0),
      storyLikes: Number(data.story_likes || 0),
      storyComments: Number(data.story_comments || 0),
      interactions: Number(data.lifetime_interactions || 0),
    }
  }, [dashboardData])

  const periodMetrics = useMemo(() => {
    const totals = dashboardData?.period_totals || {}

    return {
      views: Number(totals.page_views || 0),
      interactions: Number(totals.interactions || 0),
      followers: Number(totals.new_followers || 0),
      storyReads: Number(totals.story_reads || 0),
      comments: Number(totals.comments || 0),
    }
  }, [dashboardData])

  const analyticsSeries = useMemo(
    () => (Array.isArray(dashboardData?.analytics) ? dashboardData.analytics : []),
    [dashboardData]
  )

  const performanceTotal =
    periodMetrics.views + periodMetrics.storyReads + periodMetrics.interactions

  const profileCompletion = useMemo(() => getProfileCompletion(authorPage), [authorPage])
  const pageName = authorPage?.page_name || 'Author Page'
  const avatarUrl = authorPage?.avatar_url || ''
  const authorInitial = pageName.trim().charAt(0).toUpperCase() || 'A'
  const latestPost = dashboardData?.latest_post || posts[0] || null
  const updateSummary = notifications
    .filter((item) => !item.is_read)
    .slice(0, 3)
    .map((item) => item.title || item.message)
    .filter(Boolean)
    .join(' • ')

  if (loading && !authorPage) {
    return <LoadingDashboard navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] pb-[92px]">
      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="fixed left-1/2 top-[74px] z-[120] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[16px] bg-[#302a43] px-4 py-3 text-left text-[11px] font-semibold text-white shadow-2xl"
        >
          {message}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[#eee9f7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#302a43] active:bg-[#f4f0fb]"
            aria-label="Back to page"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[#241f39]">Page Dashboard</div>

          <button
            type="button"
            onClick={() => navigate('/author/page-settings')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#302a43] active:bg-[#f4f0fb]"
            aria-label="Page settings"
          >
            <i className="fa-solid fa-sliders text-[15px]" />
          </button>
        </div>

        <div className="mx-auto max-w-[1180px] overflow-x-auto px-4 pb-3">
          <div className="flex min-w-max gap-2">
            {DASHBOARD_TABS.map((tab) => (
              <DashboardTab
                key={tab.label}
                label={tab.label}
                icon={tab.icon}
                active={tab.label === 'Overview'}
                onClick={() => {
                  if (tab.label !== 'Overview') {
                    setMessage(`${tab.label} will be created in the next stage.`)
                  }
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] space-y-4 px-4 py-4 sm:space-y-5 sm:py-5">
        <section className="relative overflow-hidden rounded-[24px] bg-[#ddd6fe] p-4 shadow-[0_14px_38px_rgba(106,76,180,0.14)] sm:p-5">
  <img
    src="/assets/Author%20Page/Dashboard%20Banner.png"
    alt=""
    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
  />

          <div className="relative z-10 flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-[24px] font-black text-[#8b5cf6] shadow-lg sm:h-[82px] sm:w-[82px]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
                ) : (
                  authorInitial
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#8b5cf6] text-white">
                <i className="fa-solid fa-check text-[10px]" />
              </span>
            </div>

            <div className="min-w-0 flex-1 sm:max-w-[620px]">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[20px] font-black text-[#241f39] sm:text-[24px]">{pageName}</h1>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b5cf6] text-white">
                  <i className="fa-solid fa-check text-[8px]" />
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#5f5872]">
                <span>Author Page</span>
                <button
                  type="button"
                 onClick={() =>
  navigate('/author/edit-page', {
    state: { returnTo: '/author/page/dashboard' },
  })
}
                  className="rounded-full bg-white/65 px-3 py-1 text-[#7c3aed] active:scale-95"
                >
                  Set up your page
                </button>
              </div>

              <p className="mt-2 line-clamp-2 max-w-[540px] text-[10.5px] font-medium leading-5 text-[#5f5872]">
                {authorPage?.bio || 'Share stories that inspire and connect readers.'}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="text-[11px] font-bold text-[#7c3aed]">{profileCompletion}% profile setup</div>
                <button
                  type="button"
                  onClick={() => navigate('/author/page')}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[10px] font-semibold text-[#7c3aed] shadow-sm active:scale-95 sm:absolute sm:right-4 sm:top-4"
                >
                  View Public Page
                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/page/notifications')}
          className="flex w-full items-center gap-3 rounded-[20px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7] active:scale-[0.995]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eafe] text-[#8b5cf6]">
            <i className="fa-solid fa-bell text-[15px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-bold text-[#302a43]">
              {unreadCount > 0 ? `You have ${unreadCount} updates` : 'You are all caught up'}
            </span>
            <span className="mt-1 line-clamp-1 block text-[10px] font-medium text-[#918a9e]">
              {updateSummary || 'New comments, story activity, and followers will appear here.'}
            </span>
          </span>
          <i className="fa-solid fa-chevron-right text-[11px] text-[#b9b2c4]" />
        </button>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ProgressStat
            label="Posts"
            value={overview.posts}
            goal={getNextGoal(overview.posts, 10, 20)}
            icon="fa-regular fa-file-lines"
            color="#9b7cf8"
            softColor="#f3efff"
          />
          <ProgressStat
            label="Stories"
            value={overview.stories}
            goal={getNextGoal(overview.stories, 5, 10)}
            icon="fa-solid fa-book-open"
            color="#f4b74a"
            softColor="#fff6e6"
          />
          <ProgressStat
            label="Followers"
            value={periodMetrics.followers}
            goal={getNextGoal(overview.followers, 100, 100)}
            icon="fa-solid fa-user-group"
            color="#58c995"
            softColor="#ecfbf4"
          />
          <ProgressStat
            label="Comments"
            value={overview.comments}
            goal={getNextGoal(overview.comments, 100, 100)}
            icon="fa-solid fa-comment-dots"
            color="#ee7d90"
            softColor="#fff0f3"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7] sm:p-5">
            <SectionHeader title="Analytics" icon="fa-solid fa-chart-line" />

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {['28 Days', '7 Days', 'Today'].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setAnalyticsPeriod(period)}
                  className={`h-8 shrink-0 rounded-full px-4 text-[10px] font-semibold transition active:scale-95 ${
                    analyticsPeriod === period
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-sm'
                      : 'bg-[#f6f3fb] text-[#7b7488]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MetricCard
                label="Views"
                value={periodMetrics.views}
                icon="fa-regular fa-eye"
                note="Page visits in this period"
                tone="purple"
              />
              <MetricCard
                label="Interactions"
                value={periodMetrics.interactions}
                icon="fa-regular fa-heart"
                note="Reader actions in this period"
                tone="pink"
              />
              <MetricCard
                label="Followers"
                value={overview.followers}
                icon="fa-solid fa-user-plus"
                note="New followers in this period"
                tone="blue"
              />
              <MetricCard
                label="Story Reads"
                value={periodMetrics.storyReads}
                icon="fa-solid fa-book-open-reader"
                note="Qualified reads in this period"
                tone="green"
              />
            </div>

            <AnalyticsChart
              series={analyticsSeries}
              total={performanceTotal}
              periodLabel={analyticsPeriod}
            />
          </div>

          <div className="space-y-4">
            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
              <SectionHeader
                title="Latest Post"
                icon="fa-regular fa-pen-to-square"
                actionLabel="View all"
                onAction={() => navigate('/author/page')}
              />
              <LatestPostCard
                post={latestPost}
                onOpen={() =>
                  navigate(latestPost?.id ? `/author/page?post=${latestPost.id}` : '/author/page')
                }
              />
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
              <SectionHeader
                title="Recent Comments"
                icon="fa-regular fa-comments"
                actionLabel="View all"
                onAction={() => navigate('/author/page/notifications')}
              />

              <div className="mt-2">
                {recentComments.length ? (
                  recentComments.map((item) => (
                    <RecentCommentRow
                      key={item.comment?.id}
                      item={item}
                      onOpen={() =>
                        navigate(
                          item.post?.id ? `/author/page?post=${item.post.id}` : '/author/page'
                        )
                      }
                    />
                  ))
                ) : (
                  <EmptyState
                    icon="fa-regular fa-comment-dots"
                    title="No recent comments"
                    text="Reader comments on your author posts will appear here."
                  />
                )}
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7] sm:p-5">
            <SectionHeader
              title="Content Overview"
              icon="fa-solid fa-book"
              actionLabel="View all"
              onAction={() => navigate('/author/page')}
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <OverviewItem icon="fa-solid fa-book-open" label="Published stories" value={overview.stories} />
              <OverviewItem icon="fa-solid fa-list-ol" label="Total episodes" value={overview.episodes} />
              <OverviewItem icon="fa-regular fa-heart" label="Story likes" value={overview.storyLikes} />
              <OverviewItem icon="fa-regular fa-comment" label="Story comments" value={overview.storyComments} />
            </div>
          </div>

          <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7] sm:p-5">
            <SectionHeader title="Quick Actions" icon="fa-solid fa-bolt" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <QuickAction
                icon="fa-regular fa-pen-to-square"
                title="Create Post"
                text="Share a new update with readers."
                onClick={() => navigate('/author/page')}
              />
              <QuickAction
                icon="fa-solid fa-plus"
                title="Add Story"
                text="Create and publish a new story."
                onClick={() => navigate('/author/create-story')}
              />
              <QuickAction
                icon="fa-solid fa-bag-shopping"
                title="Open Store"
                text="Manage books, PDFs, and orders."
                onClick={() => navigate('/author/page/store')}
              />
              <QuickAction
                icon="fa-solid fa-user-pen"
                title="Edit Page"
                text="Update page details and profile."
                onClick={() => navigate('/author/edit-page')}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7] sm:p-5">
          <SectionHeader title="Other Tools" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              icon="fa-solid fa-pen-to-square"
              title="Edit Page"
              text="Update your page details"
              onClick={() =>
  navigate('/author/edit-page', {
    state: { returnTo: '/author/page/dashboard' },
  })
}
            />
            <ToolCard
              icon="fa-solid fa-book-open"
              title="Story Manager"
              text="Manage your stories and drafts"
              onClick={() => navigate('/author/dashboard')}
            />
            <ToolCard
              icon="fa-solid fa-gear"
              title="Settings"
              text="Page settings and preferences"
              onClick={() => navigate('/author/page-settings')}
            />
            <ToolCard
              icon="fa-solid fa-headset"
              title="Reader Support"
              text="Help and support for readers"
              onClick={() => setMessage('Reader Support will be added later.')}
            />
          </div>
        </section>
      </main>

      <DashboardFooter navigate={navigate} />
    </div>
  )
}

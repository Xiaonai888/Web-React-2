import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

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

function countCustomLinks(details = {}) {
  const values = [
    details.website_url,
    details.facebook_page_url,
    details.social_media,
    details.messenger,
    details.telegram,
  ]

  return values.filter((value) => String(value || '').trim()).length
}

async function fetchPinnedPostCount(pageUsername) {
  if (!pageUsername) return 0

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts?limit=30`
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load pinned posts')
  }

  const posts = Array.isArray(data.posts) ? data.posts : []
  return posts.filter((post) => post?.is_pinned).length
}

function ToolMetric({ icon, value, label }) {
  return (
    <div className="rounded-[16px] bg-white/10 p-3 ring-1 ring-white/15">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#6d28d9]">
          <i className={`${icon} text-[16px]`} />
        </span>
        <span className="min-w-0">
          <span className="block text-[24px] font-black leading-none text-white">{value}</span>
          <span className="mt-1.5 block text-[8.5px] font-semibold text-white/75">{label}</span>
        </span>
      </div>
    </div>
  )
}

function QuickTool({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[102px] flex-col items-center justify-center rounded-[17px] bg-white p-3 text-center shadow-sm ring-1 ring-[#ebe5f5] transition active:scale-[0.98]"
    >
      <i className={`${icon} text-[24px] text-[#6d28d9]`} />
      <span className="mt-3 text-[10px] font-black text-[#2d263e]">{label}</span>
    </button>
  )
}

function getNotificationIcon(item) {
  const text = `${item?.type || ''} ${item?.title || ''} ${item?.message || ''}`.toLowerCase()

  if (text.includes('link')) return 'fa-solid fa-link'
  if (text.includes('comment')) return 'fa-regular fa-comment-dots'
  if (text.includes('follow')) return 'fa-solid fa-user-plus'
  if (text.includes('story') || text.includes('episode')) return 'fa-solid fa-book-open'
  if (text.includes('review')) return 'fa-regular fa-star'
  if (text.includes('image') || text.includes('cover') || text.includes('theme')) return 'fa-solid fa-paint-roller'

  return 'fa-regular fa-pen-to-square'
}

function RecentChangeRow({ item }) {
  const title = item?.title || item?.message || 'Page activity updated'
  const text = item?.title && item?.message ? item.message : 'Your Author Page received a new update.'

  return (
    <div className="flex items-center gap-3 border-b border-[#eee9f7] px-3 py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white">
        <i className={`${getNotificationIcon(item)} text-[12px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 block text-[10.5px] font-black text-[#302a43]">{title}</span>
        <span className="mt-1 line-clamp-1 block text-[8.5px] font-medium text-[#918a9e]">{text}</span>
      </span>
      <span className="shrink-0 text-[8px] font-semibold text-[#a19aaa]">
        {formatTimeAgo(item?.created_at)}
      </span>
    </div>
  )
}

export default function AuthorDashboardPageToolsTab({
  authorPage = null,
  profileCompletion = 0,
  notifications = [],
  onEditInfo,
  onTheme,
  onLinks,
  onPinnedPosts,
  onManageTools,
}) {
  const [pinnedPostCount, setPinnedPostCount] = useState(0)
  const [loadingPinnedPosts, setLoadingPinnedPosts] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadPinnedPosts() {
      const pageUsername = authorPage?.page_username || ''

      if (!pageUsername) {
        setPinnedPostCount(0)
        return
      }

      try {
        setLoadingPinnedPosts(true)
        const count = await fetchPinnedPostCount(pageUsername)

        if (!ignore) setPinnedPostCount(count)
      } catch {
        if (!ignore) setPinnedPostCount(0)
      } finally {
        if (!ignore) setLoadingPinnedPosts(false)
      }
    }

    loadPinnedPosts()

    return () => {
      ignore = true
    }
  }, [authorPage?.page_username])

  const profileDetails = authorPage?.profile_details || {}
  const customLinkCount = useMemo(() => countCustomLinks(profileDetails), [profileDetails])
  const recentChanges = Array.isArray(notifications) ? notifications.slice(0, 3) : []

  return (
    <div className="mx-auto max-w-[760px] space-y-4">
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] p-4 text-white shadow-[0_16px_38px_rgba(109,40,217,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[15px] font-black sm:text-[17px]">Page Tools Overview</h1>
          <span className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-bold text-white ring-1 ring-white/15">
            Live data
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <ToolMetric icon="fa-solid fa-wrench" value="4" label="Active Tools" />
          <ToolMetric icon="fa-solid fa-link" value={formatCompactNumber(customLinkCount)} label="Custom Links" />
          <ToolMetric
            icon="fa-solid fa-thumbtack"
            value={loadingPinnedPosts ? '…' : formatCompactNumber(pinnedPostCount)}
            label="Pinned Items"
          />
          <ToolMetric
            icon="fa-solid fa-circle-check"
            value={`${Math.max(0, Math.min(100, Number(profileCompletion || 0)))}%`}
            label="Profile Completion"
          />
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[#2b253b] sm:text-[16px]">Quick Access</h2>
          <button
            type="button"
            onClick={onManageTools}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            View All
          </button>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2.5">
          <QuickTool icon="fa-solid fa-pencil" label="Edit Info" onClick={onEditInfo} />
          <QuickTool icon="fa-solid fa-paint-roller" label="Theme" onClick={onTheme} />
          <QuickTool icon="fa-solid fa-link" label="Links" onClick={onLinks} />
          <QuickTool icon="fa-solid fa-thumbtack" label="Pinned Posts" onClick={onPinnedPosts} />
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[#eee9f7]">
        <h2 className="text-[14px] font-black text-[#2b253b] sm:text-[16px]">Recent Changes</h2>

        <div className="mt-3 overflow-hidden rounded-[17px] ring-1 ring-[#eee9f7]">
          {recentChanges.length ? (
            recentChanges.map((item) => <RecentChangeRow key={item.id} item={item} />)
          ) : (
            <div className="flex min-h-[170px] flex-col items-center justify-center px-5 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
                <i className="fa-regular fa-clock text-[18px]" />
              </span>
              <div className="mt-3 text-[12px] font-bold text-[#302a43]">No recent changes</div>
              <div className="mt-1 text-[10px] font-medium text-[#918a9e]">
                Page updates will appear here.
              </div>
            </div>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={onManageTools}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)] active:scale-[0.99]"
      >
        <i className="fa-solid fa-screwdriver-wrench text-[13px]" />
        Manage Page Tools
      </button>
    </div>
  )
}

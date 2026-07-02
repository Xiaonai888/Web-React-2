import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'

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

function formatMoney(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return `$${number.toFixed(2)}`
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

async function fetchMyAuthorPage() {
  const token = getAuthToken()

  if (!token) return null

  const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load author page')
  }

  return data.author_page || null
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.05em] text-[#9ca3af]">{label}</div>
          <div className="mt-2 text-[22px] font-black text-[#111827]">{value}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
          <i className={`${icon} text-[17px]`} />
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title, text, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[22px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
          <i className={`${icon} text-[15px]`} />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-black text-[#111827]">{title}</div>
          <div className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">{text}</div>
        </div>
      </div>
    </button>
  )
}

function SectionCard({ title, children, right }) {
  return (
    <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-black text-[#111827]">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

function RowLink({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition active:bg-[#f3f4f6]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className={`${icon} text-[14px]`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-black text-[#111827]">{title}</div>
        <div className="mt-0.5 text-[11.5px] font-semibold leading-5 text-[#8b93a1]">{text}</div>
      </div>
      <i className="fa-solid fa-chevron-right text-[12px] text-[#c2c7d0]" />
    </button>
  )
}

export default function AuthorPageDashboardPage() {
  const navigate = useNavigate()
  const [authorPage, setAuthorPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadPage = useCallback(async ({ silent = false } = {}) => {
  const token = getAuthToken()

  if (!token) {
    setLoading(false)
    navigate('/login')
    return
  }

  try {
    if (!silent) setLoading(true)
    setMessage('')

    const page = await fetchMyAuthorPage()

    if (!page) {
      throw new Error('Author page not found')
    }

    setAuthorPage(page)
  } catch (error) {
    setMessage(error.message || 'Failed to load Page Dashboard')
  } finally {
    setLoading(false)
  }
}, [navigate])

useEffect(() => {
  let active = true

  async function load() {
    if (!active) return
    await loadPage()
  }

  load()

  return () => {
    active = false
  }
}, [loadPage])

useEffect(() => {
  function refreshDashboard() {
    if (document.visibilityState === 'visible') {
      loadPage({ silent: true })
    }
  }

  window.addEventListener('focus', refreshDashboard)
  document.addEventListener('visibilitychange', refreshDashboard)

  return () => {
    window.removeEventListener('focus', refreshDashboard)
    document.removeEventListener('visibilitychange', refreshDashboard)
  }
}, [loadPage])

  const pageStats = useMemo(() => {
    return {
      works: Number(authorPage?.total_stories || authorPage?.works_count || 0),
      followers: Number(authorPage?.total_followers || authorPage?.followers_count || 0),
      posts: Number(authorPage?.posts_count || 0),
      storeItems: Number(authorPage?.store_items_count || 0),
    }
  }, [authorPage])

  const income = {
  available: 0,
  pending: 0,
  thisMonth: 0,
}

if (loading && !authorPage) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-[92px]">
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back to page"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[#111827]">Page Dashboard</div>

          <div className="h-10 w-10" />
        </div>
      </div>

      <div className="mx-auto max-w-[980px] px-4 py-4">
        <div className="rounded-[28px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
          <div className="text-[14px] font-black text-[#111827]">Loading dashboard...</div>
          <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">Please wait a moment.</div>
        </div>
      </div>

      <AuthorPageFooter active="Dashboard" />
    </div>
  )
}

return (
    <div className="min-h-screen bg-[#f3f4f6] pb-[92px]">
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back to page"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[#111827]">Page Dashboard</div>

          <button
            type="button"
            onClick={() => navigate('/author/edit-page')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] active:scale-95"
            aria-label="Edit page"
          >
            <i className="fa-solid fa-pen text-[13px]" />
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[980px] space-y-4 px-4 py-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
          >
            {message}
          </button>
        ) : null}

        <section className="overflow-hidden rounded-[28px] bg-[#111827] text-white shadow-sm">
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[12px] font-black uppercase tracking-[0.08em] text-white/55">Author Page</div>
                <h1 className="mt-1 line-clamp-1 text-[24px] font-black tracking-tight sm:text-[30px]">
                  {loading ? 'Loading...' : authorPage?.page_name || 'Page Dashboard'}
                </h1>
                <p className="mt-1 text-[12px] font-bold text-white/60">
                  Manage income, posts, orders, and public page settings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/author/page')}
                className="shrink-0 rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#111827] active:scale-95"
              >
                View Page
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Works</div>
              <div className="mt-1 text-[20px] font-black">{formatCompactNumber(pageStats.works)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Followers</div>
              <div className="mt-1 text-[20px] font-black">{formatCompactNumber(pageStats.followers)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Posts</div>
              <div className="mt-1 text-[20px] font-black">{formatCompactNumber(pageStats.posts)}</div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-bold text-white/45">Store Items</div>
              <div className="mt-1 text-[20px] font-black">{formatCompactNumber(pageStats.storeItems)}</div>
            </div>
          </div>
        </section>

        <SectionCard
          title="Income & Withdrawal"
          right={<span className="rounded-full bg-[#fff7ed] px-3 py-1.5 text-[11px] font-black text-[#9a3412]">Opens monthly</span>}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Available" value={formatMoney(income.available)} icon="fa-solid fa-wallet" />
            <StatCard label="Pending" value={formatMoney(income.pending)} icon="fa-regular fa-clock" />
            <StatCard label="This Month" value={formatMoney(income.thisMonth)} icon="fa-solid fa-chart-line" />
          </div>

          <div className="mt-4 rounded-[22px] bg-[#f8fafc] p-4 ring-1 ring-black/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[13px] font-black text-[#111827]">Next payout date</div>
                <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
                  Withdrawal opens on the 15th of the new month after admin review.
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMessage('Withdrawal will be connected later.')}
                  className="h-10 rounded-full bg-[#111827] px-4 text-[12px] font-black text-white active:scale-95"
                >
                  Withdraw
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/author/payment-method')}
                  className="h-10 rounded-full bg-white px-4 text-[12px] font-black text-[#111827] ring-1 ring-black/10 active:scale-95"
                >
                  Payment
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            title="Create Post"
            text="Write a text-only article or update."
            icon="fa-regular fa-pen-to-square"
            onClick={() => navigate('/author/page')}
          />
          <ActionCard
            title="Add Product"
            text="Add paper book or PDF later."
            icon="fa-solid fa-bag-shopping"
            onClick={() => navigate('/author/page/store')}
          />
          <ActionCard
            title="Add Story"
            text="Create a new story from author tools."
            icon="fa-solid fa-plus"
            onClick={() => navigate('/author/create-story')}
          />
          <ActionCard
            title="Edit Page"
            text="Change name, bio, username, and details."
            icon="fa-solid fa-gear"
            onClick={() => navigate('/author/edit-page')}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Sales Overview">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Orders" value="0" icon="fa-solid fa-receipt" />
              <StatCard label="Book Orders" value="0" icon="fa-solid fa-book" />
              <StatCard label="PDF Orders" value="0" icon="fa-regular fa-file-pdf" />
              <StatCard label="Completed" value="0" icon="fa-solid fa-circle-check" />
            </div>
          </SectionCard>

          <SectionCard title="Manage Posts">
            <div className="space-y-1">
              <RowLink
                icon="fa-regular fa-pen-to-square"
                title="Create Article"
                text="Post a text-only update for readers."
                onClick={() => navigate('/author/page')}
              />
              <RowLink
                icon="fa-regular fa-file-lines"
                title="All Posts"
                text="Manage published articles and updates."
                onClick={() => navigate('/author/page')}
              />
              <RowLink
                icon="fa-regular fa-eye-slash"
                title="Hidden Posts"
                text="Hidden and restricted posts will appear here later."
                onClick={() => setMessage('Hidden posts will be connected later.')}
              />
            </div>
          </SectionCard>
        </section>

        <SectionCard title="Page Settings">
          <div className="grid gap-1 sm:grid-cols-2">
            <RowLink
              icon="fa-solid fa-id-card"
              title="Page Info"
              text="Edit page name, username, and bio."
              onClick={() => navigate('/author/edit-page')}
            />
            <RowLink
              icon="fa-regular fa-image"
              title="Avatar & Cover"
              text="Change public page profile photos."
              onClick={() => navigate('/author/page')}
            />
            <RowLink
              icon="fa-solid fa-money-check-dollar"
              title="Payment Method"
              text="Set payout information for withdrawal."
              onClick={() => navigate('/author/payment-method')}
            />
            <RowLink
              icon="fa-solid fa-shield-halved"
              title="Visibility & Safety"
              text="Page visibility and protection settings later."
              onClick={() => setMessage('Visibility settings will be connected later.')}
            />
          </div>
        </SectionCard>
      </main>

      <AuthorPageFooter active="Dashboard" />
    </div>
  )
}

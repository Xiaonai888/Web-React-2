import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_PREVIEW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_AUTHOR_PREVIEW === 'true'

const PREVIEW_PROFILE = {
  page_name: 'Dara',
  page_username: 'dara-preview',
  avatar_url: '/assets/Icons/shadow-icon-192.png',
}

const PREVIEW_SUMMARY = {
  income: {
    today_diamonds: 24,
    this_month_usd: 18.5,
  },
  gifts: {
    total_received: 12,
  },
}

const MENU_ITEMS = [
  {
    icon: 'fa-solid fa-chart-line',
    title: 'My Income',
    subtitle: 'Earnings and payout details',
    path: '/author/income',
  },
  {
    icon: 'fa-solid fa-gift',
    title: 'Quest',
    subtitle: 'Tasks and creator rewards',
    path: '/author/quest',
  },
  {
    icon: 'fa-solid fa-crown',
    title: 'Author Benefits',
    subtitle: 'Creator programs and support',
    path: '/author/benefits',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Comment Protection',
    subtitle: 'Blocked words and hidden comments',
    path: '/author/comment-protection',
  },
  {
    icon: 'fa-regular fa-trash-can',
    title: 'Trash',
    subtitle: 'Restore deleted stories within 30 days',
    path: '/author/trash',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function HeaderIcon({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center text-[#1f2430] active:scale-95"
    >
      <i className={`${icon} text-[18px]`} />
    </button>
  )
}

function SummaryItem({ value, label }) {
  return (
    <div className="min-w-0 px-2 text-center">
      <div className="truncate text-[15px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-1 truncate text-[10.5px] font-normal text-[#8d94a1]">{label}</div>
    </div>
  )
}

function MenuRow({ item, divider, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
          <i className={`${item.icon} text-[14px]`} />
        </div>

        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-normal text-[#111827]">{item.title}</div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">{item.subtitle}</div>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />

      {divider ? (
        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[#f1f1f1]" />
      ) : null}
    </button>
  )
}

function LoadingProfile() {
  return (
    <div className="animate-pulse px-3 pb-4 pt-1">
      <div className="flex justify-end gap-2">
        <div className="h-9 w-9 rounded-full bg-[#eef0f4]" />
        <div className="h-9 w-9 rounded-full bg-[#eef0f4]" />
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="h-[72px] w-[72px] rounded-full bg-[#eef0f4]" />
        <div className="flex-1">
          <div className="h-5 w-28 rounded-full bg-[#eef0f4]" />
          <div className="mt-2 h-3 w-20 rounded-full bg-[#eef0f4]" />
        </div>
      </div>

      <div className="mt-5 h-12 rounded-[12px] bg-[#eef0f4]" />
    </div>
  )
}

export default function AuthorProfilePage() {
  const navigate = useNavigate()
  const storedAuthorPage = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
    } catch {
      return null
    }
  }, [])
  const [authorPage, setAuthorPage] = useState(
    AUTHOR_PREVIEW_ENABLED ? PREVIEW_PROFILE : storedAuthorPage
  )
  const [summary, setSummary] = useState(
    AUTHOR_PREVIEW_ENABLED ? PREVIEW_SUMMARY : null
  )
  const [loading, setLoading] = useState(!AUTHOR_PREVIEW_ENABLED)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      if (AUTHOR_PREVIEW_ENABLED) return

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const headers = {
          Authorization: `Bearer ${token}`,
        }
        const [profileResponse, incomeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/authors/me`, { headers }),
          fetch(`${API_BASE_URL}/api/authors/me/income`, { headers }),
        ])
        const [profileData, incomeData] = await Promise.all([
          profileResponse.json().catch(() => ({})),
          incomeResponse.json().catch(() => ({})),
        ])

        if (!profileResponse.ok || profileData.ok === false || !profileData.author_page) {
          throw new Error(profileData.message || 'Failed to load author profile')
        }

        if (!incomeResponse.ok || incomeData.ok === false) {
          throw new Error(incomeData.message || 'Failed to load author summary')
        }

        if (!ignore) {
          localStorage.setItem('shadow_author_page', JSON.stringify(profileData.author_page))
          setAuthorPage(profileData.author_page)
          setSummary(incomeData)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Cannot connect to backend.'
              : loadError.message || 'Failed to load author profile'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      ignore = true
    }
  }, [navigate])

  const authorName = authorPage?.page_name || 'Author'
  const avatarUrl = authorPage?.avatar_url || ''
  const avatarLetter = authorName.charAt(0).toUpperCase()
  const pageUsername = authorPage?.page_username || ''
  const publicPagePath = pageUsername
    ? `/author/page/${encodeURIComponent(pageUsername)}`
    : '/author/page'

  return (
    <div className="min-h-screen bg-[#fafafa] pb-[100px]">
      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="px-3 pb-4 pt-1">
          {loading ? <LoadingProfile /> : null}

          {!loading ? (
            <>
              <div className="flex justify-end gap-2">
                <HeaderIcon
                  label="Notifications"
                  icon="fa-regular fa-envelope"
                  onClick={() => navigate('/author/page/notifications')}
                />
                <HeaderIcon
                  label="Settings"
                  icon="fa-solid fa-gear"
                  onClick={() => navigate('/author/page-settings')}
                />
              </div>

              <div className="mt-3 flex w-full items-center gap-4 text-left">
                <button
                  type="button"
                  onClick={() => navigate(publicPagePath)}
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white active:scale-[0.99]"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={authorName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[26px] font-extrabold">{avatarLetter}</span>
                  )}
                </button>

                <div className="min-w-0 flex-1 pt-1.5">
                  <button
                    type="button"
                    onClick={() => navigate(publicPagePath)}
                    className="block max-w-full text-left active:scale-[0.99]"
                  >
                    <h1 className="line-clamp-1 text-[21px] font-extrabold tracking-tight text-[#111827]">
                      {authorName}
                    </h1>
                  </button>

                  
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 divide-x divide-[#f3f3f3] px-2 py-1">
                <SummaryItem value={formatNumber(summary?.income?.today_diamonds)} label="Diamond" />
                <SummaryItem value={formatMoney(summary?.income?.this_month_usd)} label="Earned" />
                <SummaryItem value={formatNumber(summary?.gifts?.total_received)} label="Gift" />
              </div>
            </>
          ) : null}
        </section>

        {error ? (
          <div className="mb-3 rounded-[14px] bg-[#fff1f2] px-4 py-3 text-[12px] text-[#e5484d]">
            {error}
          </div>
        ) : null}

        <section className="mt-2 overflow-hidden rounded-[14px] bg-white">
          {MENU_ITEMS.map((item, index) => (
            <MenuRow
              key={item.path}
              item={item}
              divider={index < MENU_ITEMS.length - 1}
              onClick={() => navigate(item.path)}
            />
          ))}
        </section>
      </main>

      <AuthorStudioBottomNav />
    </div>
  )
}

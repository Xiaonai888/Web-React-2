import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'
import { fetchMyAuthorPageCached } from '../../services/myAuthorPageClientCache.js'

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

function getStoredReaderUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
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

function ProfileSwitcherSheet({
  open,
  onClose,
  displayName,
  avatarUrl,
  avatarLetter,
  authorPage,
  authorNotificationCount,
  onOwnAccount,
  onAuthorPage,
  onManageAccount,
}) {
  if (!open) return null

  const pageName = authorPage?.page_name || authorPage?.name || 'Author Page'
  const pageLogo = authorPage?.avatar_url || authorPage?.profile_image_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'

  return (
    <div className="fixed inset-0 z-[130]">
      <button
        type="button"
        aria-label="Close profile switcher"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[28px] bg-white px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-1/2 md:right-auto md:top-20 md:w-[380px] md:-translate-x-1/2 md:rounded-[24px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="overflow-hidden rounded-[24px] border border-[#eceaf2] bg-white shadow-sm">
          <button
            type="button"
            onClick={onOwnAccount}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{avatarLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[#111827]">{displayName}</div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#c6c9d1]" />
          </button>

          <button
            type="button"
            onClick={onAuthorPage}
            className="flex w-full items-center justify-between gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#111827] ring-1 ring-black/10">
                {pageLogo ? (
                  <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{pageLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[#111827]">{pageName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8d94a1]">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span>{`${authorNotificationCount} notification${Number(authorNotificationCount) === 1 ? '' : 's'}`}</span>
                </div>
              </div>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
              <i className="fa-solid fa-check text-[10px]" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onManageAccount}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[#d9dce4] bg-white text-[14px] font-normal text-[#111827] active:scale-[0.99]"
        >
          Manage Account
        </button>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img
            src="/assets/Icons/Logo Shadow 2.svg"
            alt=""
            className="h-10 w-auto object-contain opacity-90"
          />
        </div>
      </div>
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
  const storedReaderUser = useMemo(() => getStoredReaderUser(), [])
  const [authorPage, setAuthorPage] = useState(
    AUTHOR_PREVIEW_ENABLED ? PREVIEW_PROFILE : storedAuthorPage
  )
  const [summary, setSummary] = useState(
    AUTHOR_PREVIEW_ENABLED ? PREVIEW_SUMMARY : null
  )
  const [loading, setLoading] = useState(!AUTHOR_PREVIEW_ENABLED)
  const [error, setError] = useState('')
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('settings-popup-open', profileSwitcherOpen)

    return () => {
      document.body.classList.remove('settings-popup-open')
    }
  }, [profileSwitcherOpen])

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

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

        const [profileData, incomeResponse] =
          await Promise.all([
            fetchMyAuthorPageCached({
              apiBaseUrl: API_BASE_URL,
              token,
              signal: controller.signal,
            }),
            fetch(
              `${API_BASE_URL}/api/authors/me/income`,
              {
                headers,
                cache: 'no-store',
                signal: controller.signal,
              }
            ),
          ])

        const incomeData = await incomeResponse
          .json()
          .catch(() => ({}))

        if (!profileData.author_page) {
          throw new Error(
            profileData.message ||
              'Failed to load author profile'
          )
        }

        if (!incomeResponse.ok || incomeData.ok === false) {
          throw new Error(
            incomeData.message ||
              'Failed to load author summary'
          )
        }

        if (!ignore) {
          setAuthorPage(profileData.author_page)
          setSummary(incomeData)
        }
      } catch (loadError) {
        if (
          loadError?.name !== 'AbortError' &&
          !ignore
        ) {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Cannot connect to backend.'
              : loadError.message ||
                  'Failed to load author profile'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate])

  const authorName = authorPage?.page_name || 'Author'
  const avatarUrl = authorPage?.avatar_url || ''
  const avatarLetter = authorName.charAt(0).toUpperCase()
  const pageUsername = authorPage?.page_username || ''
  const publicPagePath = pageUsername
    ? `/author/page/${encodeURIComponent(pageUsername)}`
    : '/author/page'
  const readerName = storedReaderUser?.name || storedReaderUser?.username || 'Reader'
  const readerAvatarUrl = storedReaderUser?.avatar_url || storedReaderUser?.avatarUrl || ''
  const readerAvatarLetter = readerName.charAt(0).toUpperCase() || 'R'
  const authorNotificationCount = Number(
    authorPage?.notification_count || authorPage?.unread_count || 0
  )

  return (
    <div className="min-h-screen bg-[#fafafa] pb-[100px]">
      <ProfileSwitcherSheet
        open={profileSwitcherOpen}
        onClose={() => setProfileSwitcherOpen(false)}
        displayName={readerName}
        avatarUrl={readerAvatarUrl}
        avatarLetter={readerAvatarLetter}
        authorPage={authorPage}
        authorNotificationCount={authorNotificationCount}
        onOwnAccount={() => {
          setProfileSwitcherOpen(false)
          navigate('/profile')
        }}
        onAuthorPage={() => setProfileSwitcherOpen(false)}
        onManageAccount={() => {
          setProfileSwitcherOpen(false)
          navigate('/settings')
        }}
      />

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

                  <button
                    type="button"
                    onClick={() => setProfileSwitcherOpen(true)}
                    className="mt-1 flex items-center gap-1.5 text-[12px] font-normal text-[#8d94a1] active:scale-[0.99]"
                  >
                    <span>Switch Profile</span>
                    <i className="fa-solid fa-chevron-down text-[9px]" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 divide-x divide-[#f3f3f3] px-2 py-1">
                <button
  type="button"
  onClick={() => navigate('/author/diamonds')}
  className="min-w-0 active:scale-[0.98]"
  aria-label="Open Diamond history"
>
  <SummaryItem value={formatNumber(summary?.income?.today_diamonds)} label="Diamond" />
</button>

                <button
                  type="button"
                  onClick={() => navigate('/author/earnings')}
                  className="min-w-0 active:scale-[0.98]"
                  aria-label="Open income records"
                >
                  <SummaryItem value={formatMoney(summary?.income?.this_month_usd)} label="Earned" />
                </button>

                <button
  type="button"
  onClick={() => navigate('/author/gifts')}
  className="min-w-0 active:scale-[0.98]"
  aria-label="Open Gift history"
>
  <SummaryItem value={formatNumber(summary?.gifts?.total_received)} label="Gift" />
</button>
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
              onClick={() =>
                navigate(`${item.path}?from=profile`, {
                  state: { returnTo: '/author/profile' },
                })
              }
            />
          ))}
        </section>
      </main>

      <AuthorStudioBottomNav />
    </div>
  )
}

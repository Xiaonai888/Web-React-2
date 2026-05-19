import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
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

function saveReaderUser(user) {
  if (!user) return

  const userText = JSON.stringify(user)
  sessionStorage.setItem('shadow_reader_user', userText)

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', userText)
  }
}

function syncReaderToken() {
  const localToken = localStorage.getItem('shadow_reader_token') || ''
  const sessionToken = sessionStorage.getItem('shadow_reader_token') || ''
  const token = localToken || sessionToken

  if (token && localToken) {
    sessionStorage.setItem('shadow_reader_token', token)
  }

  return token
}

function clearReaderSession() {
  localStorage.removeItem('shadow_reader_token')
  localStorage.removeItem('shadow_reader_user')
  sessionStorage.removeItem('shadow_reader_token')
  sessionStorage.removeItem('shadow_reader_user')
}

const iconBox = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827]'

function HeaderIcon({ icon, label, to, onClick }) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1f2430] shadow-sm ring-1 ring-black/5 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )

  return to ? <Link to={to}>{content}</Link> : content
}

function BalanceItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[15px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-1 text-[10.5px] font-semibold text-[#8d94a1]">{label}</div>
    </div>
  )
}

function QuickAction({ icon, title, subtitle, to, onClick }) {
  const body = (
    <div className="flex min-w-0 items-center gap-3">
      <div className={iconBox}>
        <i className={`${icon} text-[14px]`} />
      </div>
      <div className="min-w-0">
        <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827]">{title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">{subtitle}</div>
      </div>
    </div>
  )

  const className = 'min-w-0 flex-1 px-3.5 py-3.5 text-left active:scale-[0.99]'

  return to ? (
    <Link to={to} className={className}>{body}</Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>{body}</button>
  )
}

function MenuRow({ icon, title, subtitle, to, onClick, danger = false, dark = false }) {
  const body = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={
            dark
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f6b800]'
              : danger
                ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#e5484d]'
                : iconBox
          }
        >
          <i className={`${icon} text-[14px]`} />
        </div>
        <div className="min-w-0">
          <div
            className={`line-clamp-1 text-[13.5px] font-extrabold ${
              dark ? 'text-white' : danger ? 'text-[#e5484d]' : 'text-[#111827]'
            }`}
          >
            {title}
          </div>
          {subtitle ? (
            <div className={`mt-0.5 line-clamp-1 text-[11.5px] ${dark ? 'text-white/55' : 'text-[#8d94a1]'}`}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <i className={`fa-solid fa-chevron-right text-[11px] ${dark ? 'text-white/45' : 'text-[#c6c9d1]'}`} />
    </>
  )

  const className = `flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99] ${
    dark ? 'bg-[#171923]' : ''
  }`

  return to ? <Link to={to} className={className}>{body}</Link> : <button type="button" onClick={onClick} className={className}>{body}</button>
}

function SettingsSheet({ open, onClose, isLoggedIn }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Close settings" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-[74px] left-0 right-0 max-h-[72vh] overflow-hidden rounded-t-[26px] bg-white px-4 pb-5 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[320px] md:rounded-[22px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827]">Settings</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1]">Account and app options</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7]">
            <i className="fa-solid fa-times text-[13px] text-[#555]" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto pb-2">
          <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white">
            <div className="divide-y divide-[#f0eef6]">
              <MenuRow to={isLoggedIn ? '/profile' : '/login'} icon="far fa-user" title="Edit Profile" subtitle="Name, avatar, bio" />
              <MenuRow to="/settings" icon="fa-solid fa-shield-alt" title="Account Settings" subtitle="Password, privacy, security" />
              <MenuRow to="/settings" icon="far fa-moon" title="Appearance" subtitle="Theme and reading display" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Me() {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [authorLoading, setAuthorLoading] = useState(false)
  const [storedUser, setStoredUser] = useState(() => getStoredReaderUser())
  const [checkingUser, setCheckingUser] = useState(Boolean(getReaderToken() && !getStoredReaderUser()))

  const token = getReaderToken()
  const isLoggedIn = Boolean(token)
  const isPremium = false

  const displayName = storedUser?.name || (isLoggedIn ? 'Reader' : 'Click to Login')
  const avatarUrl = storedUser?.avatar_url || storedUser?.avatarUrl || ''
  const avatarLetter = storedUser?.name?.charAt(0)?.toUpperCase() || 'S'

  useEffect(() => {
    let ignore = false

    async function restoreUser() {
      const currentToken = syncReaderToken()
      const currentUser = getStoredReaderUser()

      if (!currentToken) {
        if (!ignore) {
          setStoredUser(null)
          setCheckingUser(false)
        }
        return
      }

      if (currentUser) {
        if (!ignore) {
          setStoredUser(currentUser)
          setCheckingUser(false)
        }
        return
      }

      try {
        setCheckingUser(true)

        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (response.status === 401 || response.status === 403) {
          clearReaderSession()
          if (!ignore) {
            setStoredUser(null)
          }
          return
        }

        if (!response.ok || data.ok === false || !data.user) {
          return
        }

        saveReaderUser(data.user)

        if (!ignore) {
          setStoredUser(data.user)
        }
      } catch {
        if (!ignore) {
          setStoredUser(currentUser || null)
        }
      } finally {
        if (!ignore) setCheckingUser(false)
      }
    }

    restoreUser()

    return () => {
      ignore = true
    }
  }, [])

  const handleLogout = () => {
    clearReaderSession()
    navigate('/login', { replace: true })
  }

  const handleAuthorDashboard = async () => {
    if (authorLoading) return

    const currentToken = getReaderToken()

    if (!currentToken) {
      navigate('/login')
      return
    }

    try {
      setAuthorLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        clearReaderSession()
        navigate('/login', { replace: true })
        return
      }

      if (response.ok && data.has_author_page) {
        navigate('/author/dashboard')
        return
      }

      navigate('/event')
    } catch {
      navigate('/event')
    } finally {
      setAuthorLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex justify-end gap-2">
            <HeaderIcon to="/inbox" icon="far fa-envelope" label="Inbox" />
            <HeaderIcon icon="fa-solid fa-cog" label="Settings" onClick={() => setSettingsOpen(true)} />
          </div>

          <div className="mt-3 flex items-start gap-4">
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white"
            >
              {isLoggedIn && avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
              ) : isLoggedIn ? (
                <span className="text-[26px] font-extrabold">{avatarLetter}</span>
              ) : (
                <i className="far fa-user text-[26px]" />
              )}
            </Link>

            <div className="min-w-0 flex-1 pt-1.5">
              <Link to={isLoggedIn ? '/profile' : '/login'} className="block">
                <h1 className="line-clamp-1 text-[21px] font-extrabold tracking-tight text-[#111827]">
                  {isLoggedIn ? (
                    <>
                      {checkingUser ? 'Loading account...' : displayName}
                      {isPremium ? (
                        <span className="ml-2 inline-flex translate-y-[-1px] items-center justify-center text-[#f6b800]">
                          <i className="fa-solid fa-crown text-[15px]" />
                        </span>
                      ) : null}
                    </>
                  ) : (
                    'Click to Login'
                  )}
                </h1>
              </Link>

              {!isLoggedIn ? (
                <p className="mt-1 line-clamp-1 text-[12px] text-[#8d94a1]">
                  Login to save reading and author tools
                </p>
              ) : (
                <Link
                  to="/profile"
                  className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#8d94a1]"
                >
                  <span>View Profile</span>
                  <i className="fa-solid fa-chevron-right text-[9px]" />
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-[#eef0f4] rounded-[18px] bg-[#fafafe] px-2 py-3">
            <BalanceItem value="120" label="Diamond" />
            <BalanceItem value="480" label="Gem" />
            <BalanceItem value="3" label="Voucher" />
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-[#f0eef6]">
            <QuickAction to="/wallet" icon="fa-solid fa-wallet" title="Wallet" subtitle="Balance & purchases" />
            <QuickAction to="/check-in" icon="far fa-calendar-check" title="Check-in" subtitle="Daily rewards" />
          </div>
        </section>

        <section className="mt-3 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
          <button type="button" onClick={handleAuthorDashboard} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff4cc] text-[#111827]">
                <i className="fa-solid fa-pen-nib text-[14px]" />
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827]">Author Dashboard</div>
                <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">Manage stories, episodes, and your author page</div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />
          </button>
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
          <div className="divide-y divide-[#f0eef6]">
            <MenuRow to="/premium" icon="fa-solid fa-crown" title="Premium" subtitle="Ad-free reading and exclusive stories" dark />
            <MenuRow to="/inbox" icon="far fa-envelope" title="Inbox" subtitle="Messages and notifications" />
            <MenuRow to="/comments" icon="far fa-comment-dots" title="My Comments" subtitle="Replies and comment activity" />
            <MenuRow to="/feedback" icon="far fa-pen-to-square" title="Feedback" subtitle="Report issues or suggestions" />
            <MenuRow to="/help" icon="far fa-circle-question" title="Help Center" subtitle="Support and common questions" />
            <MenuRow to="/about" icon="fa-solid fa-circle-info" title="About Us" subtitle="About Shadowera and policies" />
          </div>
        </section>

        {isLoggedIn ? (
          <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
            <MenuRow onClick={handleLogout} icon="fa-solid fa-right-from-bracket" title="Logout" danger />
          </section>
        ) : null}
      </main>

      <button
        type="button"
        onClick={handleAuthorDashboard}
        aria-label="Author Dashboard shortcut"
        className="fixed bottom-[92px] right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#f6b800] text-[17px] text-[#111827] shadow-[0_14px_30px_rgba(246,184,0,0.34)] active:scale-95"
      >
        <i className="fa-solid fa-pen-nib" />
      </button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDisplayText, setDisplayLanguageId } from '../../utils/displayLanguage'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'
const THEME_STORAGE_KEY = 'shadow_theme'
const STORY_LANGUAGE_STORAGE_KEY = 'shadow_story_language'
const DISPLAY_LANGUAGE_STORAGE_KEY = 'shadow_display_language'

const LANGUAGES = [
  { id: 'km', label: 'Khmer', flagCode: 'kh' },
  { id: 'en', label: 'English', flagCode: 'us' },
  { id: 'zh', label: 'Chinese', flagCode: 'cn' },
  { id: 'ja', label: 'Japanese', flagCode: 'jp' },
  { id: 'ko', label: 'Korean', flagCode: 'kr' },
]

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

function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

function getStoredStoryLanguage() {
  return localStorage.getItem(STORY_LANGUAGE_STORAGE_KEY) || 'km'
}

function getStoredDisplayLanguage() {
  return localStorage.getItem(DISPLAY_LANGUAGE_STORAGE_KEY) || 'en'
}

function getLanguageLabel(languageId) {
  return LANGUAGES.find((language) => language.id === languageId)?.label || 'Khmer'
}

function applyTheme(theme) {
  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
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

const iconBox = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827] dark:bg-white/10 dark:text-white'

function HeaderIcon({ icon, label, to, onClick, badgeCount = 0 }) {
  const showBadge = Number(badgeCount) > 0
  const content = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1f2430] shadow-sm ring-1 ring-black/5 active:scale-95 dark:bg-[#202331] dark:text-white dark:ring-white/10"
    >
      <i className={`${icon} text-[15px]`} />
      {showBadge ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-white dark:ring-[#202331]">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </button>
  )

  return to ? <Link to={to}>{content}</Link> : content
}

function BalanceItem({ value, label, to, state }) {
  const content = (
    <div className="text-center">
      <div className="text-[15px] font-extrabold text-[#111827] dark:text-white">{value}</div>
      <div className="mt-1 text-[10.5px] font-semibold text-[#8d94a1] dark:text-white/50">{label}</div>
    </div>
  )

  return to ? (
    <Link to={to} state={state} className="block active:scale-[0.98]">
      {content}
    </Link>
  ) : content
}

function QuickAction({ icon, title, subtitle, to, onClick }) {
  const body = (
    <div className="flex min-w-0 items-center gap-3">
      <div className={iconBox}>
        <i className={`${icon} text-[14px]`} />
      </div>
      <div className="min-w-0">
        <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">{title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1] dark:text-white/50">{subtitle}</div>
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
                ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#e5484d] dark:bg-[#3a1f25]'
                : iconBox
          }
        >
          <i className={`${icon} text-[14px]`} />
        </div>
        <div className="min-w-0">
          <div
            className={`line-clamp-1 text-[13.5px] font-extrabold ${
              dark ? 'text-white' : danger ? 'text-[#e5484d]' : 'text-[#111827] dark:text-white'
            }`}
          >
            {title}
          </div>
          {subtitle ? (
            <div className={`mt-0.5 line-clamp-1 text-[11.5px] ${dark ? 'text-white/55' : 'text-[#8d94a1] dark:text-white/50'}`}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <i className={`fa-solid fa-chevron-right text-[11px] ${dark ? 'text-white/45' : 'text-[#c6c9d1] dark:text-white/35'}`} />
    </>
  )

  const className = `flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99] ${
    dark ? 'bg-[#171923]' : 'dark:bg-[#171923]'
  }`

  return to ? <Link to={to} className={className}>{body}</Link> : <button type="button" onClick={onClick} className={className}>{body}</button>
}

function ThemeSwitchRow({ darkMode, onChange, tx }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${darkMode ? 'bg-[#2b2f42] text-[#f6b800]' : 'bg-[#fff7d8] text-[#d99a00]'}`}>
          <i className={`${darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} text-[14px]`} />
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">
            {darkMode ? tx('darkMode') : tx('lightMode')}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1] dark:text-white/50">
            {tx('themeSub')}
          </div>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={darkMode}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${darkMode ? 'bg-[#f6b800]' : 'bg-[#d9dce4]'}`}
      >
        <span
          className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] shadow transition ${
            darkMode ? 'left-6 text-[#d99a00]' : 'left-1 text-[#9aa1ad]'
          }`}
        >
          <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'}`} />
        </span>
      </button>
    </div>
  )
}

function LanguageSummaryRow({ storyLanguage, displayLanguage, onClick, tx }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2563eb] dark:bg-[#22304d] dark:text-[#8bb6ff]">
          <i className="fa-solid fa-globe text-[14px]" />
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">{tx('language')}</div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1] dark:text-white/50">
            {tx('storyLanguage')}: {getLanguageLabel(storyLanguage)} • {tx('displayLanguage')}: {getLanguageLabel(displayLanguage)}
          </div>
        </div>
      </div>
      <i className="fa-solid fa-chevron-right text-[11px] text-[#c6c9d1] dark:text-white/35" />
    </button>
  )
}

function LanguageOption({
  language,
  selected,
  onClick,
  isDisplayLanguage = false,
  selectedLabel = 'Selected',
  selectedClassName = 'bg-[#fff7d8] ring-1 ring-[#f6b800]/45 dark:bg-[#2a2414] dark:ring-[#f6b800]/35',
  selectedTextClassName = 'text-[#d99a00]',
  selectedIconClassName = 'text-[#d99a00]',
}) {
  const countryCode = language.flagCode?.toUpperCase() || ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition active:scale-[0.99] ${
        selected
          ? selectedClassName
          : 'bg-[#f8f8fb] ring-1 ring-transparent dark:bg-white/5'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[13px] font-bold text-[#111827] shadow-sm ring-1 ring-black/5 dark:bg-white dark:text-[#111827]">
          {isDisplayLanguage ? (
            <>
              <img
                src={`https://flagcdn.com/w40/${language.flagCode}.png`}
                alt={`${language.label} flag`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                  event.currentTarget.nextElementSibling.style.display = 'inline'
                }}
              />
              <span className="hidden">{countryCode}</span>
            </>
          ) : (
            countryCode
          )}
        </span>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">{language.label}</div>
          {selected ? (
            <div className={`mt-0.5 text-[11px] font-semibold ${selectedTextClassName}`}>{selectedLabel}</div>
          ) : null}
        </div>
      </div>
      {selected ? <i className={`fa-solid fa-check text-[13px] ${selectedIconClassName}`} /> : null}
    </button>
  )
}

function LanguageSheet({
  open,
  onClose,
  storyLanguage,
  displayLanguage,
  onStoryLanguageChange,
  onDisplayLanguageChange,
  tx,
}) {
  const [activeTab, setActiveTab] = useState('story')

  if (!open) return null

  const isStoryTab = activeTab === 'story'
  const selectedLanguage = isStoryTab ? storyLanguage : displayLanguage
 const description = isStoryTab
  ? tx('storyLanguageHelp')
  : tx('displayLanguageHelp')

  return (
    <div className="fixed inset-0 z-[140]">
      <button type="button" aria-label="Close language" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[26px] bg-white px-4 pb-5 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[340px] md:rounded-[22px] md:pb-4 dark:bg-[#12141d]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827] dark:text-white">{tx('language')}</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">{tx('languageSub')}</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-white/10">
            <i className="fa-solid fa-times text-[13px] text-[#555] dark:text-white/70" />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 rounded-2xl bg-[#f4f5f7] p-1 dark:bg-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`rounded-xl px-3 py-2 text-[12px] font-extrabold transition ${
              isStoryTab ? 'bg-white text-[#111827] shadow-sm dark:bg-[#f6b800] dark:text-[#111827]' : 'text-[#8d94a1] dark:text-white/55'
            }`}
          >
            {tx('storyLanguage')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('display')}
            className={`rounded-xl px-3 py-2 text-[12px] font-extrabold transition ${
              !isStoryTab ? 'bg-white text-[#111827] shadow-sm dark:bg-[#f6b800] dark:text-[#111827]' : 'text-[#8d94a1] dark:text-white/55'
            }`}
          >
            {tx('displayLanguage')}
          </button>
        </div>

        <div className="mb-3 rounded-[18px] bg-[#f8f8fb] px-3.5 py-3 text-[12px] leading-5 text-[#6b7280] dark:bg-white/5 dark:text-white/60">
          {description}
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pb-1">
          {LANGUAGES.map((language) => (
            <LanguageOption
  key={language.id}
  language={language}
  selected={selectedLanguage === language.id}
  isDisplayLanguage={!isStoryTab}
  selectedLabel={tx('selected')}
              
  onClick={() => {
    if (isStoryTab) {
      onStoryLanguageChange(language.id)
    } else {
      onDisplayLanguageChange(language.id)
    }
  }}
  {...(!isStoryTab
    ? {
        selectedClassName: 'bg-[#eef4ff] ring-1 ring-[#2563eb]/35 dark:bg-[#17233d] dark:ring-[#8bb6ff]/35',
        selectedTextClassName: 'text-[#2563eb]',
        selectedIconClassName: 'text-[#2563eb]',
      }
    : {})}
/>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsSheet({ open, onClose, isLoggedIn }) {
  const [darkMode, setDarkMode] = useState(() => getStoredTheme() === 'dark')
  const [languageOpen, setLanguageOpen] = useState(false)
  const [storyLanguage, setStoryLanguage] = useState(() => getStoredStoryLanguage())
  const [displayLanguage, setDisplayLanguage] = useState(() => getStoredDisplayLanguage())
  const [displayTextVersion, setDisplayTextVersion] = useState(0)
const tx = (key) => getDisplayText(key)

  useEffect(() => {
    applyTheme(darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
  const handleDisplayLanguageChange = () => {
    setDisplayTextVersion((value) => value + 1)
  }

  window.addEventListener('shadow-display-language-change', handleDisplayLanguageChange)

  return () => {
    window.removeEventListener('shadow-display-language-change', handleDisplayLanguageChange)
  }
}, [])

  const handleStoryLanguageChange = (languageId) => {
    localStorage.setItem(STORY_LANGUAGE_STORAGE_KEY, languageId)
    setStoryLanguage(languageId)
  }

  const handleDisplayLanguageChange = (languageId) => {
  setDisplayLanguageId(languageId)
  setDisplayLanguage(languageId)
}

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Close settings" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <LanguageSheet
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
        storyLanguage={storyLanguage}
        displayLanguage={displayLanguage}
        onStoryLanguageChange={handleStoryLanguageChange}
        onDisplayLanguageChange={handleDisplayLanguageChange}
        tx={tx}
      />
      

      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[26px] bg-white px-4 pb-5 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[320px] md:rounded-[22px] md:pb-4 dark:bg-[#12141d]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827] dark:text-white">{tx('settings')}</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">{tx('accountAndAppOptions')}</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-white/10">
            <i className="fa-solid fa-times text-[13px] text-[#555] dark:text-white/70" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto pb-2">
          <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white dark:border-white/10 dark:bg-[#171923]">
            <div className="divide-y divide-[#f0eef6] dark:divide-white/10">
              <MenuRow to={isLoggedIn ? '/profile' : '/login'} icon="far fa-user" title={tx('editProfile')} subtitle={tx('editProfileSub')} />
<MenuRow to="/settings" icon="fa-solid fa-shield-alt" title={tx('accountSettings')} subtitle={tx('accountSettingsSub')} />
              <ThemeSwitchRow darkMode={darkMode} onChange={() => setDarkMode((value) => !value)} tx={tx} />
              <LanguageSummaryRow
                storyLanguage={storyLanguage}
                displayLanguage={displayLanguage}
                onClick={() => setLanguageOpen(true)}
                tx={tx}
              />
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
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0)
  const [storedUser, setStoredUser] = useState(() => getStoredReaderUser())
  const [checkingUser, setCheckingUser] = useState(Boolean(getReaderToken() && !getStoredReaderUser()))
  const [walletBalance, setWalletBalance] = useState({
  diamonds: 0,
  gems: 0,
  vouchers: 0,
})

  const token = getReaderToken()
  const isLoggedIn = Boolean(token)
  const isPremium = false
  const tx = (key) => getDisplayText(key)


  const displayName = storedUser?.name || (isLoggedIn ? 'Reader' : tx('clickToLogin'))
  const avatarUrl = storedUser?.avatar_url || storedUser?.avatarUrl || ''
  const avatarLetter = storedUser?.name?.charAt(0)?.toUpperCase() || 'S'

  useEffect(() => {
    document.body.classList.toggle('settings-popup-open', settingsOpen)

    return () => {
      document.body.classList.remove('settings-popup-open')
    }
  }, [settingsOpen])

useEffect(() => {
  applyTheme(getStoredTheme())
}, [])

  useEffect(() => {
  let ignore = false

  async function loadInboxUnreadCount() {
    const currentToken = getReaderToken()

    if (!currentToken) {
      setInboxUnreadCount(0)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/mails/unread-count`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!ignore && response.ok && data.ok) {
        setInboxUnreadCount(Number(data.unread_count || 0))
      }
    } catch {
      if (!ignore) setInboxUnreadCount(0)
    }
  }

  loadInboxUnreadCount()

  return () => {
    ignore = true
  }
}, [])

  
useEffect(() => {
  let ignore = false

  async function loadWalletBalance() {
    const currentToken = getReaderToken()

    if (!currentToken) {
      setWalletBalance({ diamonds: 0, gems: 0, vouchers: 0 })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/purchase/wallet`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!ignore && response.ok && data.ok && data.wallet) {
        setWalletBalance({
          diamonds: Number(data.wallet.diamond_balance || 0),
          gems: Number(data.wallet.gem_balance || 0),
          vouchers: 0,
        })
      }
    } catch {
      if (!ignore) {
        setWalletBalance({ diamonds: 0, gems: 0, vouchers: 0 })
      }
    }
  }

  loadWalletBalance()

  return () => {
    ignore = true
  }
}, [])

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
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px] dark:bg-[#0d0f16]">
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
          <div className="flex justify-end gap-2">
            <HeaderIcon to="/inbox" icon="far fa-envelope" label="Inbox" badgeCount={inboxUnreadCount} />
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
                <h1 className="line-clamp-1 text-[21px] font-extrabold tracking-tight text-[#111827] dark:text-white">
                  {isLoggedIn ? (
                    <>
                      {checkingUser ? tx('loadingAccount') : displayName}
                      {isPremium ? (
                        <span className="ml-2 inline-flex translate-y-[-1px] items-center justify-center text-[#f6b800]">
                          <i className="fa-solid fa-crown text-[15px]" />
                        </span>
                      ) : null}
                    </>
                  ) : (
                    tx('clickToLogin')
                  )}
                </h1>
              </Link>

              {!isLoggedIn ? (
                <p className="mt-1 line-clamp-1 text-[12px] text-[#8d94a1] dark:text-white/50">
                  {tx('loginToSave')}
                </p>
              ) : (
                <Link
                  to="/profile"
                  className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#8d94a1] dark:text-white/50"
                >
                  <span>{tx('viewProfile')}</span>
                  <i className="fa-solid fa-chevron-right text-[9px]" />
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-[#eef0f4] rounded-[18px] bg-[#fafafe] px-2 py-3 dark:divide-white/10 dark:bg-white/5">
            <BalanceItem value={walletBalance.diamonds} label={tx('diamond')} to="/shop" state={{ activeTab: 'Purchase', from: '/me' }} />
            <BalanceItem value={walletBalance.gems} label="Coins" to="/tasks" />
            <BalanceItem value={walletBalance.vouchers} label={tx('voucher')} />
          </div>
          
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm dark:border-white/10 dark:bg-[#171923]">
          <div className="grid grid-cols-2 divide-x divide-[#f0eef6] dark:divide-white/10">
            <QuickAction to="/wallet" icon="fa-solid fa-wallet" title={tx('wallet')} subtitle={tx('walletSub')} />
            <QuickAction to="/tasks" icon="far fa-calendar-check" title={tx('checkIn')} subtitle={tx('checkInSub')} />
          </div>
        </section>

        <section className="mt-3 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm dark:border-white/10 dark:bg-[#171923]">
          <button type="button" onClick={handleAuthorDashboard} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff4cc] text-[#111827] dark:bg-[#FFE9A6] dark:text-[#111827]">
                <i className="fa-solid fa-pen-nib text-[14px]" />
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827] dark:text-white">{tx('authorDashboard')}</div>
                <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1] dark:text-white/50">{tx('authorDashboardSub')}</div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1] dark:text-white/35" />
          </button>
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm dark:border-white/10 dark:bg-[#171923]">
          <div className="divide-y divide-[#f0eef6] dark:divide-white/10">
            <MenuRow to="/premium" icon="fa-solid fa-crown" title={tx('premium')} subtitle={tx('premiumSub')} dark />
            <MenuRow to="/comments" icon="far fa-comment-dots" title={tx('myComments')} subtitle={tx('myCommentsSub')} />
            <MenuRow to="/feedback" icon="far fa-pen-to-square" title={tx('feedback')} subtitle={tx('feedbackSub')} />
            <MenuRow to="/help" icon="far fa-circle-question" title={tx('helpCenter')} subtitle={tx('helpCenterSub')} />
            <MenuRow to="/about" icon="fa-solid fa-circle-info" title={tx('aboutUs')} subtitle={tx('aboutUsSub')} />
          </div>
        </section>

        {isLoggedIn ? (
          <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm dark:border-white/10 dark:bg-[#171923]">
            <MenuRow onClick={handleLogout} icon="fa-solid fa-right-from-bracket" title={tx('logout')} danger />
          </section>
        ) : null}
      </main>

      <button
        type="button"
        onClick={handleAuthorDashboard}
        aria-label="Author Dashboard shortcut"
        className="fixed bottom-[92px] right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#f6b800] text-[17px] text-[#111827] shadow-[0_14px_30px_rgba(246,184,0,0.34)] active:scale-95 dark:text-[#111827]"
      >
        <i className="fa-solid fa-pen-nib" />
      </button>
    </div>
  )
}

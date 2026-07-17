import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function DashboardIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" aria-hidden="true">
      <path
        d="M3.5 10.4 12 3.7l8.5 6.7v9.1a1 1 0 0 1-1 1h-5.2v-6.2H9.7v6.2H4.5a1 1 0 0 1-1-1v-9.1Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StoriesIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" aria-hidden="true">
      <path
        d="M4 5.5c2.8-.9 5.3-.4 8 1.6v12c-2.7-2-5.2-2.5-8-1.6v-12Zm16 0c-2.8-.9-5.3-.4-8 1.6v12c2.7-2 5.2-2.5 8-1.6v-12Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InsightsIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" aria-hidden="true">
      <path
        d="M5 20V10.5h3V20H5Zm5.5 0V4h3v16h-3Zm5.5 0v-6.5h3V20h-3Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProfileIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" aria-hidden="true">
      <circle
        cx="12"
        cy="8"
        r="3.5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5.5 20c.4-4 2.6-6 6.5-6s6.1 2 6.5 6h-13Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FeatherIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path
        d="M19.8 3.4c-4.7.2-8.7 2.1-11.5 5.5-2.3 2.8-3.2 5.9-3.5 8.8l4.8-4.8m-4.8 4.8L3 19.5m1.8-1.8c3.5.1 6.4-.8 8.8-2.8 3.3-2.8 5.3-6.6 6.2-11.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NavButton({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[9.5px] font-bold transition active:scale-95 ${
        active ? 'text-[#6d4aff]' : 'text-[#646b80]'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
      <span className="max-w-full truncate">{label}</span>
    </button>
  )
}

export default function AuthorStudioBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const storiesActive = location.pathname === '/author/dashboard' && location.hash === '#author-stories'
  const dashboardActive = location.pathname === '/author/dashboard' && !storiesActive
  const insightsActive = location.pathname === '/author/insights'
  const profileActive = location.pathname === '/author/profile'

  useEffect(() => {
    if (location.pathname !== '/author/dashboard' || location.hash !== '#author-stories') return

    window.requestAnimationFrame(() => {
      document.getElementById('author-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash, location.pathname])

  const openStories = () => {
    navigate('/author/dashboard#author-stories')
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[90] w-full"
      aria-label="Author Studio navigation"
    >
      <div className="relative flex min-h-[62px] w-full items-center rounded-none border-t border-[#ebe7ff] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(77,63,132,0.12)] backdrop-blur-xl">
        <NavButton label="Dashboard" active={dashboardActive} onClick={() => navigate('/author/dashboard')}>
          <DashboardIcon active={dashboardActive} />
        </NavButton>

        <NavButton label="Stories" active={storiesActive} onClick={openStories}>
          <StoriesIcon active={storiesActive} />
        </NavButton>

        <div className="flex min-w-0 flex-1 justify-center">
          <button
            type="button"
            onClick={() => navigate('/author/create-story')}
            className="flex h-[58px] w-[58px] -translate-y-[13px] items-center justify-center rounded-full bg-gradient-to-br from-[#8468ff] to-[#5c3df2] text-white shadow-[0_10px_24px_rgba(100,72,246,0.42)] ring-[5px] ring-[#f5f3fa] transition active:scale-95"
            aria-label="Create story"
          >
            <FeatherIcon />
          </button>
        </div>

        <NavButton label="Insights" active={insightsActive} onClick={() => navigate('/author/insights')}>
          <InsightsIcon active={insightsActive} />
        </NavButton>

        <NavButton label="Profile" active={profileActive} onClick={() => navigate('/author/profile')}>
          <ProfileIcon active={profileActive} />
        </NavButton>
      </div>
    </nav>
  )
}

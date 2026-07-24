import { useEffect, useRef, useState } from 'react'
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

const createOptions = [
  {
    type: 'novel',
    title: 'Novel',
    subtitle: 'Text episodes',
    icon: 'fa-solid fa-book-open',
    iconClass: 'bg-[#f0e7ff] text-[#7c3aed]',
  },
  {
    type: 'manga',
    title: 'Manga',
    subtitle: 'Image chapters',
    icon: 'fa-regular fa-image',
    iconClass: 'bg-[#ffe7e9] text-[#ff4d5e]',
  },
  {
    type: 'chat_story',
    title: 'Chat Story',
    subtitle: 'Message style',
    icon: 'fa-regular fa-comments',
    iconClass: 'bg-[#fff0da] text-[#ff7900]',
  },
]

export default function AuthorStudioBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [createOpen, setCreateOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragStartRef = useRef(0)
  const dragYRef = useRef(0)
  const storiesActive = location.pathname === '/author/stories'
  const dashboardActive = location.pathname === '/author/dashboard'
  const insightsActive = location.pathname === '/author/insights'
  const profileActive = location.pathname === '/author/profile'

  useEffect(() => {
    if (!createOpen) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      html.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [createOpen])

  const closeCreateMenu = () => {
    dragYRef.current = 0
    setDragY(0)
    setDragging(false)
    setCreateOpen(false)
  }

  const openCreatePage = (type) => {
    closeCreateMenu()
    navigate(`/author/create-story?type=${type}`)
  }

  const handleDragStart = (event) => {
    dragStartRef.current = event.clientY
    dragYRef.current = 0
    setDragY(0)
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleDragMove = (event) => {
    if (!dragging) return
    const nextDragY = Math.max(0, event.clientY - dragStartRef.current)
    dragYRef.current = nextDragY
    setDragY(nextDragY)
  }

  const handleDragEnd = () => {
    if (!dragging) return
    setDragging(false)

    if (dragYRef.current >= 80) {
      closeCreateMenu()
      return
    }

    dragYRef.current = 0
    setDragY(0)
  }

  return (
    <>
      {createOpen ? (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Create story">
          <button
            type="button"
            aria-label="Close create story menu"
            onClick={closeCreateMenu}
            className="absolute inset-0 bg-black/45"
          />

          <div
            className={`absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[22px] bg-white px-4 pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(17,24,39,0.2)] ${
              dragging ? '' : 'transition-transform duration-200 ease-out'
            }`}
            style={{ transform: `translateY(${dragY}px)` }}
          >
            <div
              className="touch-none pb-3 pt-2"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              <div className="mx-auto h-1.5 w-11 rounded-full bg-[#d9d5e2]" />
              <div className="mt-3 px-1">
                <h2 className="text-[16px] font-bold text-[#21143f]">Create Story</h2>
                <p className="mt-0.5 text-[11px] text-[#8a86a3]">Choose your story format</p>
              </div>
            </div>

            <div className="space-y-2">
              {createOptions.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => openCreatePage(item.type)}
                  className="flex w-full items-center gap-3 rounded-[14px] bg-[#faf9fd] px-3 py-3 text-left transition active:scale-[0.99] active:bg-[#f3effb]"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}>
                    <i className={`${item.icon} text-[18px]`} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-[#21143f]">{item.title}</span>
                    <span className="mt-0.5 block text-[11px] text-[#8a86a3]">{item.subtitle}</span>
                  </span>

                  <i className="fa-solid fa-chevron-right text-[10px] text-[#b8b1c8]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-[90] w-full"
        aria-label="Author Studio navigation"
      >
        <div className="relative flex min-h-[62px] w-full items-center rounded-none border-t border-[#ebe7ff] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
          <NavButton label="Dashboard" active={dashboardActive} onClick={() => navigate('/author/dashboard')}>
            <DashboardIcon active={dashboardActive} />
          </NavButton>

          <NavButton label="Stories" active={storiesActive} onClick={() => navigate('/author/stories')}>
            <StoriesIcon active={storiesActive} />
          </NavButton>

          <div className="flex min-w-0 flex-1 justify-center">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex h-[58px] w-[58px] -translate-y-[13px] items-center justify-center rounded-full bg-gradient-to-br from-[#8468ff] to-[#5c3df2] text-white ring-[5px] ring-[#f5f3fa] transition active:scale-95"
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
    </>
  )
}

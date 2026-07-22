import { useEffect, useRef, useState } from 'react'
import { Bell, Grid2X2, Search } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MangaFeedSections from '../components/MangaFeedSections'
import StoriesDailyCheckIn from '../components/StoriesDailyCheckIn'
import NotificationPage from './NotificationPage'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const fallbackGenreTabs = [
  { label: 'Today', slug: 'today' },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
]

const badgeClasses = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#F6B800] text-[#111827]',
}

function getSlideBadge(slide) {
  const directBadge = String(slide.badge || slide.badge_label || slide.tag || '').trim().toUpperCase()
  const titleBadge = String(slide.title || '').match(/^\s*\[(HOT|NEW|TOP)\]\s*/i)?.[1]?.toUpperCase() || ''
  const badge = directBadge || titleBadge

  return ['HOT', 'NEW', 'TOP'].includes(badge) ? badge : ''
}

function getSlideTitle(slide) {
  return String(slide.title || '').replace(/^\s*\[(HOT|NEW|TOP)\]\s*/i, '').trim()
}

export default function MangaPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sliderRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const [activeGenre, setActiveGenre] = useState('today')
  const [pressedGenre, setPressedGenre] = useState('')
  const [genreTabs, setGenreTabs] = useState(fallbackGenreTabs)
  const [slides, setSlides] = useState([])
  const [slidesLoading, setSlidesLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)
  const [barsHidden, setBarsHidden] = useState(false)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)

  async function refreshNotificationUnreadCount() {
    const token =
      sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') ||
      ''

    if (!token) {
      setNotificationUnreadCount(0)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))

      setNotificationUnreadCount(data?.ok ? Number(data.unread_count || 0) : 0)
    } catch {
      setNotificationUnreadCount(0)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadGenres() {
      try {
        const response = await fetch(`${API_URL}/api/genres/featured-tabs`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) throw new Error('Failed to load genres')

        const tabs = (data.tabs || [])
          .map((tab) => ({
            label: tab.label || tab.genre?.name || 'Genre',
            slug: tab.slug || tab.genre?.slug || String(tab.label || '').toLowerCase(),
          }))
          .filter((tab) => tab.label && tab.slug)
          .slice(0, 12)

        if (!cancelled && tabs.length) {
          const today = tabs.find((tab) => tab.slug === 'today')
          const otherTabs = tabs.filter((tab) => tab.slug !== 'today')
          setGenreTabs(
            today
              ? [today, ...otherTabs]
              : [{ label: 'Today', slug: 'today' }, ...otherTabs].slice(0, 12)
          )
        }
      } catch {
        if (!cancelled) setGenreTabs(fallbackGenreTabs)
      }
    }

    loadGenres()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const requestedGenre = String(searchParams.get('genre') || '').trim().toLowerCase()

    if (requestedGenre && genreTabs.some((tab) => tab.slug === requestedGenre)) {
      setActiveGenre(requestedGenre)
    }
  }, [genreTabs, searchParams])

  useEffect(() => {
    let cancelled = false

    async function loadSlides() {
      try {
        setSlidesLoading(true)
        const response = await fetch(`${API_URL}/api/slides?section_key=manga_top_slider`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) throw new Error('Failed to load slides')
        if (!cancelled) setSlides(data.slides || [])
      } catch {
        if (!cancelled) setSlides([])
      } finally {
        if (!cancelled) setSlidesLoading(false)
      }
    }

    loadSlides()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    refreshNotificationUnreadCount()

    const refresh = () => refreshNotificationUnreadCount()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const difference = currentScrollY - lastScrollYRef.current

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('manga-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('manga-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('manga-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('manga-bars-hidden')
    }
  }, [])

  function handleGenreChange(tab) {
    setPressedGenre(tab.slug)
    setActiveGenre(tab.slug)
    window.setTimeout(() => setPressedGenre(''), 220)
  }

  function handleSliderScroll() {
    const slider = sliderRef.current
    if (!slider || !slider.clientWidth) return

    setActiveSlide(Math.round(slider.scrollLeft / slider.clientWidth))
  }

  return (
    <div className="min-h-screen bg-white pb-[82px]">
      <style>{`
        body.manga-bars-hidden footer { transform: translateY(110%); }
        .manga-no-scrollbar::-webkit-scrollbar { display: none; }
        .manga-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="fixed left-0 right-0 top-0 z-[100000] bg-white transition-transform duration-200"
        style={{ transform: barsHidden ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <header className="flex items-center justify-between px-4 py-3">
          <div className="flex h-9 w-[92px] items-center">
            <img
              src="/assets/Icons/Logo Shadow 2.svg"
              alt="Shadow"
              className="h-full w-full object-contain object-left"
            />
          </div>

          <div className="flex items-center gap-5">
            <Link to="/genres" className="flex h-6 w-6 items-center justify-center" aria-label="Genres">
              <Grid2X2 size={20} strokeWidth={1.8} />
            </Link>
            <Link to="/search" className="flex h-6 w-6 items-center justify-center" aria-label="Search">
              <Search size={20} strokeWidth={1.8} />
            </Link>
            <button
              type="button"
              onClick={() => setShowNotificationPopup(true)}
              className="relative flex h-6 w-6 items-center justify-center"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.8} />
              {notificationUnreadCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-medium leading-none text-[#111827] shadow-sm">
                  {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
                </span>
              ) : null}
            </button>
          </div>
        </header>

        <nav className="manga-no-scrollbar flex gap-1.5 overflow-x-auto border-t border-[#f3f4f6] px-4 pb-2">
          {genreTabs.map((tab) => {
            const active = activeGenre === tab.slug
            const pressed = pressedGenre === tab.slug

            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => handleGenreChange(tab)}
                className={`relative shrink-0 rounded-full px-3 py-2 text-[12px] transition-colors ${
                  active ? 'font-semibold text-[#111827]' : 'font-normal text-[#9ca3af]'
                } ${pressed ? 'bg-[#f1f2f4]' : 'bg-transparent'}`}
              >
                {tab.label}
                <span
                  className={`absolute bottom-[3px] left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#F6B800] transition-all ${
                    active ? 'w-[62%] opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            )
          })}
        </nav>
      </div>

      <div className="h-[104px]" />

      <section className="relative overflow-hidden bg-[#f3f4f6]">
        <div
          ref={sliderRef}
          onScroll={handleSliderScroll}
          className="manga-no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {slidesLoading ? (
            <div className="flex aspect-[16/9] w-full shrink-0 items-center justify-center bg-[#f1f2f4] text-[13px] font-semibold text-[#98a2b3]">
              Loading Manga slides...
            </div>
          ) : null}

          {!slidesLoading && !slides.length ? (
            <div className="flex aspect-[16/9] w-full shrink-0 items-center justify-center bg-[#f1f2f4] text-[13px] font-semibold text-[#98a2b3]">
              No Manga slides yet
            </div>
          ) : null}

          {!slidesLoading
            ? slides.map((slide) => {
                const badge = getSlideBadge(slide)
                const title = getSlideTitle(slide)

                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => slide.link_url && navigate(slide.link_url)}
                    className="relative aspect-[16/9] w-full shrink-0 snap-center overflow-hidden text-left"
                  >
                    <img
                      src={slide.image_url}
                      alt={title || 'Manga slide'}
                      className="h-full w-full object-cover"
                    />
                    {badge || title || slide.subtitle || slide.description ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-14 text-white">
                        {title ? <h2 className="truncate text-[17px] font-black">{title}</h2> : null}
                        {slide.subtitle || slide.description ? (
                          <p className="mt-1 truncate text-[11px] font-semibold text-white/90">
                            {slide.subtitle || slide.description}
                          </p>
                        ) : null}
                        {badge ? (
                          <span className={`mt-2 inline-flex rounded-[5px] px-2 py-1 text-[9px] font-black ${badgeClasses[badge]}`}>
                            {badge}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </button>
                )
              })
            : null}
        </div>

        {slides.length > 1 ? (
          <div className="absolute bottom-2 right-3 flex gap-1.5">
            {slides.map((slide, index) => (
              <span
                key={slide.id}
                className={`h-1.5 rounded-full bg-white transition-all ${
                  activeSlide === index ? 'w-4 opacity-100' : 'w-1.5 opacity-60'
                }`}
              />
            ))}
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-4 gap-4 px-4 py-4 text-center">
        {[
          { icon: '/assets/Shortcut/Store.svg', label: 'Shop', path: '/shop' },
          { icon: '/assets/Shortcut/Task.svg', label: 'Tasks', path: '/tasks' },
          { icon: '/assets/Shortcut/Ranking.svg', label: 'Ranking', path: '/ranking' },
          { icon: '/assets/Shortcut/Event.svg', label: 'Event', path: '/event' },
        ].map((item) => (
          <button key={item.label} type="button" onClick={() => navigate(item.path)}>
            <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center">
              <img src={item.icon} alt={item.label} className="h-7 w-7 object-contain" />
            </div>
            <span className="text-[10px] font-semibold text-[#111827]">{item.label}</span>
          </button>
        ))}
      </div>

      <MangaFeedSections genre={activeGenre} />

      {showNotificationPopup ? (
        <NotificationPage
          isOpen={showNotificationPopup}
          onClose={() => {
            setShowNotificationPopup(false)
            refreshNotificationUnreadCount()
          }}
        />
      ) : null}

      {!showNotificationPopup ? <StoriesDailyCheckIn /> : null}
    </div>
  )
}

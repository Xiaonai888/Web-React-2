import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ShadowSpotlight from '../components/ShadowSpotlight'
import ShadowExclusiveSection from '../components/ShadowExclusiveSection'
import TrendingNowSection from '../components/TrendingNowSection'
import UpdateTodaySection from '../components/UpdateTodaySection'
import EditorWeeklyPicksSection from '../components/EditorWeeklyPicksSection'
import TopNovelSection from '../components/TopNovelSection'
import YouMightLikeSection from '../components/YouMightLikeSection'
import EventPerksHubSection from '../components/EventPerksHubSection'
import NewArrivalsSection from '../components/NewArrivalsSection'
import CompletedSection from '../components/CompletedSection'
import FanPicksSection from '../components/FanPicksSection'
import NotificationPage from './NotificationPage'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const fallbackGenreTabs = [
  { label: 'Today', slug: 'today', is_locked: true },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
]

const slideBadgeColors = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#f6b800] text-[#111827]',
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

function getSlideSubtitle(slide) {
  return String(slide.subtitle || slide.sub_title || slide.description || '').trim()
}

function getSlideBadgeClass(badge) {
  return slideBadgeColors[badge] || 'bg-[#ff2f55] text-white'
}

function GridHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function SearchHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

function BellHeaderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="#111827"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 9a5.5 5.5 0 0 1 11 0v3.2c0 1.4.5 2.7 1.5 3.8H5c1-1.1 1.5-2.4 1.5-3.8V9Z" />
      <path d="M10 19h4" />
    </svg>
  )
}

function ComingSoonPanel({ title }) {
  return (
    <div className="px-4 py-8">
      <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <i className="fa-solid fa-clock text-xl" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
          This section is coming soon. Novel is available now.
        </p>
      </div>
    </div>
  )
}

export default function ForYou() {
  const [activeTab, setActiveTab] = useState('novel')
  const [activeGenre, setActiveGenre] = useState('today')
  const [genreTabs, setGenreTabs] = useState(fallbackGenreTabs)
  const [slides, setSlides] = useState([])
  const [slidesLoading, setSlidesLoading] = useState(true)
  const [barsHidden, setBarsHidden] = useState(false)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  async function refreshNotificationUnreadCount() {
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''

  if (!token) {
    setNotificationUnreadCount(0)
    return
  }

  try {
    const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (data?.ok) {
      setNotificationUnreadCount(Number(data.unread_count || 0))
    }
  } catch {
    setNotificationUnreadCount(0)
  }
}

  const navigate = useNavigate()
  const swiperRef = useRef(null)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
  refreshNotificationUnreadCount()

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      refreshNotificationUnreadCount()
    }
  }

  function handleFocus() {
    refreshNotificationUnreadCount()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleFocus)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('focus', handleFocus)
  }
}, [])
  
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollYRef.current
      const difference = currentScrollY - previousScrollY

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('for-you-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('for-you-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('for-you-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('for-you-bars-hidden')
    }
  }, [])

  useEffect(() => {
    async function fetchGenreTabs() {
      try {
        const res = await fetch(`${API_URL}/api/genres/featured-tabs`)
        const data = await res.json()

        if (!res.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch genre tabs')
        }

        const tabs = (data.tabs || [])
          .map((tab) => ({
            label: tab.label || tab.genre?.name || 'Genre',
            slug: tab.slug || tab.genre?.slug || String(tab.label || '').toLowerCase(),
            is_locked: Boolean(tab.is_locked),
          }))
          .filter((tab) => tab.label && tab.slug)
          .slice(0, 12)

        if (tabs.length) {
          const today = tabs.find((tab) => tab.slug === 'today')
          const others = tabs.filter((tab) => tab.slug !== 'today')
          const finalTabs = today
            ? [today, ...others]
            : [{ label: 'Today', slug: 'today', is_locked: true }, ...others].slice(0, 12)

          setGenreTabs(finalTabs)
          setActiveGenre((current) => (finalTabs.some((tab) => tab.slug === current) ? current : 'today'))
        }
      } catch (error) {
        console.error('Fetch genre tabs error:', error)
        setGenreTabs(fallbackGenreTabs)
      }
    }

    fetchGenreTabs()
  }, [])

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch(`${API_URL}/api/slides?section_key=home_top_slider`)
        const data = await res.json()

        if (!res.ok || !data.ok) {
          throw new Error(data.message || 'Failed to fetch slides')
        }

        setSlides(data.slides || [])
      } catch (error) {
        console.error('Fetch home slides error:', error)
        setSlides([])
      } finally {
        setSlidesLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (!window.Swiper || slides.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.mySwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 2,
        slideShadows: false,
      },
      loop: slides.length > 1,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    })

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [slides])

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #fff;
          font-family: 'Roboto', Arial, sans-serif;
          overflow-x: hidden;
        }

        .for-you-top-bars {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100000;
          background: #fff;
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        body.for-you-bars-hidden footer {
          transform: translateY(110%);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .swiper-container {
          width: 100%;
          padding-top: 10px;
          padding-bottom: 30px;
        }

        .swiper-slide {
          width: 85%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .swiper-slide-next,
        .swiper-slide-prev {
          opacity: 0.4;
          transform: scale(0.9);
        }

        .swiper-pagination-bullet-active {
          background: #111827;
          width: 20px;
          border-radius: 5px;
        }

        @media (min-width: 768px) {
          .swiper-slide { width: 58%; }
        }

        .tab-item {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          padding-bottom: 8px;
        }

        .tab-item.active {
          color: #111827;
          font-weight: 700;
        }

        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #F6B800;
          border-radius: 10px;
        }
      `}</style>

      <div style={{ paddingBottom: '80px', overflowX: 'hidden', width: '100%' }}>
        <div
          className="for-you-top-bars"
          style={{ transform: barsHidden ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          <header className="flex justify-between items-center px-4 py-4 bg-white shadow-sm">
            <div className="flex items-center space-x-2">
             <div className="flex h-9 w-[92px] items-center overflow-visible">
  <img
    src="/assets/Icons/Logo Shadow 2.svg"
    alt="Shadow"
    className="h-full w-full object-contain object-left"
    loading="eager"
    decoding="async"
  />
</div>
            </div>

            <div className="flex items-center gap-5">
  <Link
    to="/genres"
    className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
    aria-label="Genres"
  >
    <GridHeaderIcon />
  </Link>

  <Link
    to="/search"
    className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
    aria-label="Search"
  >
    <SearchHeaderIcon />
  </Link>

  <button
    type="button"
    onClick={() => setShowNotificationPopup(true)}
    className="relative flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
    aria-label="Notifications"
  >
    <BellHeaderIcon />

    {notificationUnreadCount > 0 ? (
      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F6B800] px-1.5 text-[10px] font-medium leading-none text-[#111827] shadow-sm">
        {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
      </span>
    ) : null}
  </button>
</div>
          </header>

          <nav className="flex px-4 space-x-8 border-b border-gray-100 bg-white pt-2">
            {['novel', 'chat', 'manga'].map((tab) => (
              <div
                key={tab}
                className={`tab-item text-sm capitalize ${activeTab === tab ? 'active' : 'text-gray-400 font-semibold'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'novel' ? 'Novel' : tab === 'chat' ? 'Chat Story' : 'Manga'}
              </div>
            ))}
          </nav>
        </div>

        <div style={{ height: '110px' }} />

        {activeTab !== 'novel' ? (
          <ComingSoonPanel title={activeTab === 'chat' ? 'Chat Story' : 'Manga'} />
        ) : (
          <div id="tab-content-root">
            <div className="flex space-x-3 px-4 py-5 overflow-x-auto no-scrollbar bg-white">
              {genreTabs.map((tab) => {
                const active = activeGenre === tab.slug

                return (
                  <button
                    key={tab.slug}
                    type="button"
                    onClick={() => {
  if (tab.slug === 'today') {
    setActiveGenre(tab.slug)
    return
  }

  if (tab.slug === 'romance') {
    navigate('/genre/romance')
    return
  }

  if (tab.slug === 'fantasy') {
    navigate('/genre/fantasy')
    return
  }
                      
  if (tab.slug === 'action') {
  navigate('/genre/action')
  return
}

  if (tab.slug === 'comedy') {
  navigate('/genre/comedy')
  return
}

  if (tab.slug === 'adventure') {
  navigate('/genre/adventure')
  return
}


if (tab.slug === 'school-life') {
  navigate('/genre/school-life')
  return
}       

if (tab.slug === 'historical') {
  navigate('/genre/historical')
  return
}    

if (tab.slug === 'mystery') {
  navigate('/genre/mystery')
  return
}        

if (tab.slug === 'horror') {
  navigate('/genre/horror')
  return
}                      

if (tab.slug === 'lgbtq' || tab.slug === 'lgbtq+') {
  navigate('/genre/lgbtq')
  return
}       

if (tab.slug === 'sci-fi' || tab.slug === 'scifi') {
  navigate('/genre/sci-fi')
  return
}        

if (tab.slug === 'drama') {
  navigate('/genre/drama')
  return
}       

if (tab.slug === 'thriller') {
  navigate('/genre/thriller')
  return
}          

if (tab.slug === 'system') {
  navigate('/genre/system')
  return
}       

if (tab.slug === 'isekai') {
  navigate('/genre/isekai')
  return
}                   

if (tab.slug === 'supernatural') {
  navigate('/genre/supernatural')
  return
}

if (tab.slug === 'martial-arts') {
  navigate('/genre/martial-arts')
  return
}           

if (tab.slug === 'revenge') {
  navigate('/genre/revenge')
  return
}


if (tab.slug === 'ceo') {
  navigate('/genre/ceo')
  return
}       


if (tab.slug === 'slow-burn') {
  navigate('/genre/slow-burn')
  return
}         

if (tab.slug === 'enemies-to-lovers') {
  navigate('/genre/enemies-to-lovers')
  return
}    

if (tab.slug === 'time-travel') {
  navigate('/genre/time-travel')
  return
}      
                      
if (tab.slug === 'strong-female-lead') {
  navigate('/genre/strong-female-lead')
  return
}      

if (tab.slug === 'hidden-identity') {
  navigate('/genre/hidden-identity')
  return
}                      

if (tab.slug === 'royalty') {
  navigate('/genre/royalty')
  return
}              

if (tab.slug === 'magic') {
  navigate('/genre/magic')
  return
}                


if (tab.slug === 'second-chance') {
  navigate('/genre/second-chance')
  return
}    

if (tab.slug === 'cold-male-lead') {
  navigate('/genre/cold-male-lead')
  return
}

if (tab.slug === 'bl') {
  navigate('/genre/bl')
  return
} 


if (tab.slug === 'gl') {
  navigate('/genre/gl')
  return
}                      
                      
                      
  setActiveGenre(tab.slug)
}}
                    className={
                      active
                        ? 'bg-[#111827] text-white px-6 py-1.5 rounded-full text-xs shrink-0 font-bold'
                        : 'border border-gray-200 px-5 py-1.5 rounded-full text-xs shrink-0 text-gray-600 font-semibold bg-white'
                    }
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="swiper-container mySwiper">
              <div className="swiper-wrapper">
                {slidesLoading && (
                  <div className="swiper-slide aspect-[16/9] bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-400">Loading slides...</span>
                  </div>
                )}

                {!slidesLoading && slides.length === 0 && (
                  <div className="swiper-slide aspect-[16/9] bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-400">No slides yet</span>
                  </div>
                )}

                {!slidesLoading && slides.map((slide) => {
                  const slideBadge = getSlideBadge(slide)
                  const slideTitle = getSlideTitle(slide)
                  const slideSubtitle = getSlideSubtitle(slide)

                  return (
                    <div
                      key={slide.id}
                      className="swiper-slide relative aspect-[16/9] cursor-pointer"
                      onClick={() => {
                        if (slide.link_url) navigate(slide.link_url)
                      }}
                    >
                      <img
                        src={slide.image_url}
                        className="h-full w-full object-cover"
                        alt={slideTitle || `Slide ${slide.order_index}`}
                        loading="lazy"
                        decoding="async"
                      />

                      {(slideBadge || slideTitle || slideSubtitle) ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-12">
                          <div className="flex min-w-0 items-center gap-2">
                            {slideBadge ? (
                              <span className={`shrink-0 rounded-[5px] px-2 py-1 text-[8px] font-black uppercase leading-none ${getSlideBadgeClass(slideBadge)}`}>
                                {slideBadge}
                              </span>
                            ) : null}

                            {slideTitle ? (
                              <h2 className="min-w-0 truncate text-[16px] font-black leading-tight text-white drop-shadow sm:text-[24px]">
                                {slideTitle}
                              </h2>
                            ) : null}
                          </div>

                          {slideSubtitle ? (
                            <p className="mt-1 truncate text-[10px] font-semibold leading-4 text-white/90 sm:text-[12px]">
                              {slideSubtitle}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              <div className="swiper-pagination" />
            </div>

            <div className="grid grid-cols-4 gap-4 py-4 px-4 text-center">
  {[
    { icon: 'fa-shopping-bag', label: 'Shop', path: '/shop' },
    { icon: 'fa-tasks', label: 'Tasks', path: '/tasks' },
    { icon: 'fa-trophy', label: 'Ranking', path: '/ranking' },
    { icon: 'fa-calendar', label: 'Event', path: '/event' },
  ].map((item) => (
    <div
      key={item.label}
      className="group cursor-pointer"
      onClick={() => item.path && navigate(item.path)}
    >
      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center transition-all">
        <i className={`fas ${item.icon} text-[#6b7280]`} />
      </div>
      <span className="text-[10px] font-semibold text-[#111827]">{item.label}</span>
    </div>
  ))}
</div>

            <div className="my-6">
              <ShadowSpotlight />
            </div>

            <div className="my-6">
              <ShadowExclusiveSection />
            </div>

            <div className="my-6">
              <TrendingNowSection />
            </div>

            <div className="my-6">
              <UpdateTodaySection />
            </div>

            <div className="my-6">
              <EditorWeeklyPicksSection />
            </div>

            <div className="my-6">
              <TopNovelSection />
            </div>

            <div className="my-6">
              <YouMightLikeSection />
            </div>

            <div className="my-6">
              <EventPerksHubSection />
            </div>

            <div className="my-6">
              <NewArrivalsSection />
            </div>

            <div className="my-6">
              <CompletedSection />
            </div>

            <div className="my-6">
              <FanPicksSection />
            </div>
          </div>
        )}
      </div>

      {showNotificationPopup ? (
  <NotificationPage
    isOpen={showNotificationPopup}
    onClose={() => {
      setShowNotificationPopup(false)
      refreshNotificationUnreadCount()
    }}
  />
) : null}
    </>
  )
}

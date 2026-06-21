import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'
const EVENT_SLIDE_SECTION_KEY = 'event_top_slider'
const AUTHOR_CENTER_SECTION_KEY = 'author_center'

const shortcutItems = [
  { label: 'Write', icon: 'fa-pen-nib', type: 'primary' },
  { label: 'Group', icon: 'fa-users' },
  { label: 'Ranking', icon: 'fa-trophy' },
  { label: 'Reward', icon: 'fa-gift' },
  { label: 'Guide', icon: 'fa-book-open' },
]

const benefitItems = [
  { icon: 'fa-sack-dollar', title: 'Earn More', text: 'Grow income from your stories.' },
  { icon: 'fa-users', title: 'Grow Fans', text: 'Build your own reader base.' },
  { icon: 'fa-star', title: 'Get Featured', text: 'Join events and get promoted.' },
]

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function parseBannerTitle(value = '') {
  const match = String(value).match(/^\[(NEW|HOT|TOP)\]\s*(.*)$/i)

  if (!match) {
    return {
      badge: '',
      title: value || '',
    }
  }

  return {
    badge: match[1].toUpperCase(),
    title: match[2] || '',
  }
}

const eventSlideBadgeColors = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#f6b800] text-[#111827]',
}

function getEventSlideBadge(slide) {
  const directBadge = String(slide.badge || slide.badge_label || slide.tag || '').trim().toUpperCase()
  const titleBadge = String(slide.title || '').match(/^\s*\[(HOT|NEW|TOP)\]\s*/i)?.[1]?.toUpperCase() || ''
  const badge = directBadge || titleBadge

  return ['HOT', 'NEW', 'TOP'].includes(badge) ? badge : ''
}

function getEventSlideTitle(slide) {
  return String(slide.title || '').replace(/^\s*\[(HOT|NEW|TOP)\]\s*/i, '').trim()
}

function getEventSlideSubtitle(slide) {
  return String(slide.subtitle || slide.sub_title || slide.description || '').trim()
}

function getEventSlideBadgeClass(badge) {
  return eventSlideBadgeColors[badge] || 'bg-[#ff2f55] text-white'
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function TopAuthorCard({ rank, author, onOpen, onFollow, loading }) {
  const name = author?.page_name || 'Author'
  const username = author?.page_username || 'author'
  const avatarUrl = author?.avatar_url || ''
  const followers = formatCompactNumber(author?.total_followers)
  const worksCount = Number(author?.total_stories || 0)
  const worksLabel = worksCount === 0 ? 'No works yet' : worksCount === 1 ? '1 work' : `${formatCompactNumber(worksCount)} works`
  const buttonLabel = author?.is_owner ? 'View' : author?.is_following ? 'Following' : 'Follow'
  const rankBadgeClasses = {
    1: 'bg-[#FF3B30] text-white shadow-[0_8px_18px_rgba(255,59,48,0.28)]',
    2: 'bg-[#FF8C00] text-white shadow-[0_8px_18px_rgba(255,140,0,0.25)]',
    3: 'bg-[#FFD400] text-[#111827] shadow-[0_8px_18px_rgba(255,212,0,0.25)]',
    4: 'bg-[#8A2BE2] text-white shadow-[0_8px_18px_rgba(138,43,226,0.24)]',
    5: 'bg-[#A0A7B4] text-white shadow-[0_8px_18px_rgba(160,167,180,0.22)]',
    6: 'bg-[#A0A7B4] text-white shadow-[0_8px_18px_rgba(160,167,180,0.22)]',
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(author)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpen(author)
      }}
      className="relative min-w-[132px] overflow-hidden rounded-[18px] border border-[#e9edf3] bg-white px-3 pb-4 pt-5 text-center shadow-sm active:scale-[0.98]"
    >
      <div
        className={`absolute left-0 top-0 z-10 flex h-[48px] w-[30px] flex-col items-center justify-start pt-2 ${rankBadgeClasses[rank] || 'bg-[#A0A7B4] text-white'}`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' }}
      >
        <span className="text-[8px] font-black uppercase leading-none tracking-wide">Top</span>
        <span className="mt-1 text-[15px] font-bold leading-none">{rank}</span>
      </div>

      <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f4f5f7] text-[18px] font-black text-[#111827] ring-1 ring-[#e5e7eb]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            String(name || 'A').slice(0, 1).toUpperCase()
          )}
        </div>
      </div>

      <div className="line-clamp-1 text-[12px] font-black text-[#111827]">{name}</div>
      <div className="mt-1 line-clamp-1 text-[10px] font-bold text-[#8b93a1]">@{username}</div>
      <div className="mt-2 text-[10px] font-extrabold text-[#111827]">{followers} followers</div>
      <div className="mt-1 text-[10px] font-semibold text-[#6b7280]">{worksLabel}</div>

      <button
        type="button"
        disabled={loading}
        onClick={(event) => {
          event.stopPropagation()

          if (author?.is_owner || author?.is_following) {
            onOpen(author)
            return
          }

          onFollow(author)
        }}
        className={`mt-3 w-full rounded-full py-2 text-[10px] font-black active:scale-95 disabled:opacity-60 ${
          author?.is_following ? 'bg-[#f3f4f6] text-[#111827]' : 'bg-black text-white'
        }`}
      >
        {loading ? '...' : buttonLabel}
      </button>
    </div>
  )
}

const fallbackMostReadStories = Array.from({ length: 6 }, (_, index) => ({
  id: `most-read-${index + 1}`,
  title: 'Most Read Story',
  image: `/assets/New Arrival/New Arrival ${index + 1}.jpg`,
  likes: [18000, 4299, 3494, 2800, 2200, 1900][index],
}))

function normalizeMostReadStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image:
      story.cover_url ||
      story.landscape_thumbnail_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    likes: Number(story.total_likes || story.likes || 0),
  }
}

function FireSolidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 22c4.4 0 8-3.1 8-8 0-2.3-.9-4.3-2.4-5.9-.2 2.2-1.5 3.7-3.1 4.4.8-4.5-1.8-8.1-5.5-10.5.2 3.6-1.7 5.2-3.1 6.8C4.6 10.3 4 12 4 14c0 4.9 3.6 8 8 8Z" />
      <path d="M9.2 17.6c0 1.7 1.2 2.9 2.8 2.9s2.8-1.2 2.8-2.9c0-1.1-.5-2-1.4-2.8-.1 1-.7 1.7-1.5 2 .2-1.7-.7-3.1-2.1-4.1.1 1.8-.6 2.7-.6 4.9Z" />
    </svg>
  )
}

function MostReadBookCard({ book, rank, onOpen }) {
  const rankBadgeClasses = {
    1: 'bg-[#FF3B30] text-white',
    2: 'bg-[#FF8C00] text-white',
    3: 'bg-[#FFD400] text-[#111827]',
    4: 'bg-[#8A2BE2] text-white',
    5: 'bg-[#A0A7B4] text-white',
    6: 'bg-[#A0A7B4] text-white',
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-[calc((100%-24px)/2.5)] shrink-0 bg-transparent p-0 text-left active:scale-[0.98] sm:w-[130px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] bg-[#202124] shadow-sm">
        <img
  src={book.image}
  alt={book.title}
  className="pointer-events-none h-full w-full select-none object-cover"
  loading="lazy"
  decoding="async"
  draggable="false"
  onDragStart={(event) => event.preventDefault()}
  onError={(event) => {
    event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
  }}
/>

        <div
          className={`absolute right-2 top-0 flex h-[34px] w-[28px] items-center justify-center text-[14px] font-bold shadow-[0_6px_12px_rgba(0,0,0,0.16)] ${rankBadgeClasses[rank] || rankBadgeClasses[6]}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' }}
        >
          {rank}
        </div>
      </div>

      <h3 className="mt-2 block w-full overflow-hidden whitespace-nowrap text-ellipsis text-[13px] font-extrabold leading-[19px] text-[#111827]">
        {book.title}
      </h3>

      <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[#111827]">
        <span className="text-[#EF4444]">
          <FireSolidIcon />
        </span>
        <span>{formatCompactNumber(book.likes)}</span>
      </div>
    </button>
  )
}

function MostReadThisWeekSection() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchMostReadStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=6&sort=popular`)
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load most read stories')
        }

        if (!ignore) {
          setBooks((data.stories || []).map(normalizeMostReadStory).slice(0, 6))
        }
      } catch {
        if (!ignore) setBooks([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchMostReadStories()

    return () => {
      ignore = true
    }
  }, [])

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container || window.innerWidth < 768) return

    isDraggingRef.current = true
    dragMovedRef.current = false
    startXRef.current = event.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
  }

  const handleMouseMove = (event) => {
    const container = scrollRef.current
    if (!container || !isDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - startXRef.current

    if (Math.abs(walk) > 4) {
      dragMovedRef.current = true
    }

    container.scrollLeft = scrollLeftRef.current - walk * 1.4
  }

  const stopMouseDrag = () => {
    isDraggingRef.current = false
  }

  const handleBookOpen = (bookId) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }

    navigate(`/story/${bookId}`)
  }

  const visibleBooks = books.length ? books : fallbackMostReadStories

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[19px] font-extrabold text-[#111827]">Most Read This Week</h3>

        <button
          type="button"
          onClick={() => navigate('/most-read-this-week')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#9ca3af] active:scale-95"
        >
          <i className="fas fa-chevron-right text-[15px]" />
        </button>
      </div>

      {loading ? (
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[116px] shrink-0 sm:w-[130px]">
              <div className="aspect-[2/3] animate-pulse rounded-[10px] bg-[#f3f4f6]" />
              <div className="mt-2 h-4 animate-pulse rounded-full bg-[#f3f4f6]" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded-full bg-[#f3f4f6]" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopMouseDrag}
          onMouseLeave={stopMouseDrag}
          className="no-scrollbar mt-4 flex cursor-grab gap-3 overflow-x-auto pb-2 select-none active:cursor-grabbing"
        >
          {visibleBooks.slice(0, 6).map((book, index) => (
            <MostReadBookCard
              key={book.id}
              book={book}
              rank={index + 1}
              onOpen={() => handleBookOpen(book.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}


function SectionHeader({ title, onMore }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <h3 className="text-[19px] font-extrabold text-[#111827]">{title}</h3>
      <button type="button" onClick={onMore} className="flex h-7 w-7 items-center justify-center rounded-full text-[#9ca3af] active:scale-95">
        <i className="fas fa-chevron-right text-[15px]" />
      </button>
    </div>
  )
}

function EventSlideBanner() {
  const navigate = useNavigate()
  const swiperRef = useRef(null)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchSlides() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/slides?section_key=${EVENT_SLIDE_SECTION_KEY}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch Event slides')
        }

        if (!ignore) setSlides(data.slides || [])
      } catch {
        if (!ignore) setSlides([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchSlides()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!window.Swiper || slides.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.eventSwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: false,
      slidesPerView: 1,
      spaceBetween: 0,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 2,
        slideShadows: false,
      },
      breakpoints: {
        768: {
          centeredSlides: true,
          slidesPerView: 'auto',
          spaceBetween: 0,
        },
      },
      loop: slides.length > 1,
      speed: 650,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.event-swiper-pagination',
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

  if (loading) {
    return (
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-[#f4f5f7] text-[14px] font-bold text-[#8d94a1] md:rounded-[20px]">
          Loading slides...
        </div>
      </div>
    )
  }

  if (!slides.length) {
    return (
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-black text-[20px] font-extrabold text-white/80 md:rounded-[20px]">
          No slides yet
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
      <div className="swiper eventSwiper">
        <div className="swiper-wrapper">
          {slides.map((slide) => {
            const slideBadge = getEventSlideBadge(slide)
            const slideTitle = getEventSlideTitle(slide)
            const slideSubtitle = getEventSlideSubtitle(slide)

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
                  alt={slideTitle || 'Event slide'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                {(slideBadge || slideTitle || slideSubtitle) ? (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-12">
                    <div className="flex min-w-0 items-center gap-2">
                      {slideBadge ? (
                        <span className={`shrink-0 rounded-[5px] px-2 py-1 text-[8px] font-black uppercase leading-none ${getEventSlideBadgeClass(slideBadge)}`}>
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
        <div className="event-swiper-pagination swiper-pagination" />
      </div>
    </div>
  )
}

function AuthorCenterBannerSlider() {
  const navigate = useNavigate()
  const swiperRef = useRef(null)
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchBanners() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/slides?section_key=${AUTHOR_CENTER_SECTION_KEY}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch Author Center banners')
        }

        if (!ignore) setBanners(data.slides || [])
      } catch {
        if (!ignore) setBanners([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchBanners()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!window.Swiper || banners.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.authorCenterSwiper', {
  slidesPerView: 1.08,
  spaceBetween: 12,
  centeredSlides: false,
  speed: 650,
  loop: banners.length > 1,
  pagination: {
    el: '.author-center-pagination',
    clickable: true,
  },
})

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [banners])

  if (loading) {
    return (
      <div className="mt-4 flex aspect-[3/1] w-full items-center justify-center rounded-[16px] bg-[#f4f5f7] text-[13px] font-bold text-[#8d94a1]">
        Loading banners...
      </div>
    )
  }

  if (!banners.length) {
    return (
      <div className="mt-4 flex aspect-[3/1] w-full items-center justify-center rounded-[16px] bg-black text-[14px] font-extrabold text-white/70">
        No Author Center banner yet
      </div>
    )
  }

  return (
    <div className="mt-4 w-full overflow-hidden">
  <div className="swiper authorCenterSwiper !pr-10">
    <div className="swiper-wrapper">
      {banners.map((banner) => {
        const parsedTitle = parseBannerTitle(banner.title)

        return (
          <div
            key={banner.id}
            className="swiper-slide relative aspect-[3/1] cursor-pointer overflow-hidden rounded-[12px] border border-gray-100 bg-black text-white shadow-sm"
                onClick={() => {
                  if (banner.link_url) navigate(banner.link_url)
                }}
              >
                <img
                  src={banner.image_url}
                  alt={parsedTitle.title || 'Author Center banner'}
                  className="h-full w-full object-cover"
                />

                {(parsedTitle.title || banner.subtitle) ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
                    {parsedTitle.title ? (
                      <div className="flex items-center gap-2">
                        {parsedTitle.badge ? (
                          <span className="rounded-full bg-[#ff3b6b] px-2 py-0.5 text-[8px] font-black uppercase text-white">
                            {parsedTitle.badge}
                          </span>
                        ) : null}

                        <span className="line-clamp-1 text-[12px] font-extrabold">
                          {parsedTitle.title}
                        </span>
                      </div>
                    ) : null}

                    {banner.subtitle ? (
                      <p className="mt-1 line-clamp-1 text-[10px] font-medium text-white/70">
                        {banner.subtitle}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
        <div className="author-center-pagination mt-3 text-center" />
      </div>
    </div>
  )
}

export default function EventPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('author')
  const [loading, setLoading] = useState(false)
  const [topAuthorsLoading, setTopAuthorsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [topAuthors, setTopAuthors] = useState([])
  const [followLoadingId, setFollowLoadingId] = useState('')
  const topAuthorsScrollRef = useRef(null)
  const topAuthorsDraggingRef = useRef(false)
  const topAuthorsDragMovedRef = useRef(false)
  const topAuthorsStartXRef = useRef(0)
  const topAuthorsScrollLeftRef = useRef(0)

  useEffect(() => {
    let ignore = false

    async function fetchTopAuthors() {
      try {
        setTopAuthorsLoading(true)

        const token = getReaderToken()

const response = await fetch(`${API_BASE_URL}/api/authors/top?limit=6`, {
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
})
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load top authors')
        }

        if (!ignore) {
          setTopAuthors(Array.isArray(data.author_pages) ? data.author_pages : [])
        }
      } catch {
        if (!ignore) setTopAuthors([])
      } finally {
        if (!ignore) setTopAuthorsLoading(false)
      }
    }

    fetchTopAuthors()

    return () => {
      ignore = true
    }
  }, [])

  const handleStartYourWork = async () => {
    if (loading) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to check author page')
      }

      if (data.has_author_page) {
        navigate('/author/dashboard')
        return
      }

      navigate('/author/create')
    } catch (error) {
      setMessage(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleShortcut = (label) => {
    if (label === 'Write') {
      handleStartYourWork()
    }
  }

  const handleOpenAuthor = (author) => {
    if (!author?.page_username) return
    navigate(`/author/page/${author.page_username}`)
  }

  const handleTopAuthorsMouseDown = (event) => {
    const container = topAuthorsScrollRef.current
    if (!container || window.innerWidth < 768) return

    topAuthorsDraggingRef.current = true
    topAuthorsDragMovedRef.current = false
    topAuthorsStartXRef.current = event.pageX - container.offsetLeft
    topAuthorsScrollLeftRef.current = container.scrollLeft
  }

  const handleTopAuthorsMouseMove = (event) => {
    const container = topAuthorsScrollRef.current
    if (!container || !topAuthorsDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - topAuthorsStartXRef.current

    if (Math.abs(walk) > 4) {
      topAuthorsDragMovedRef.current = true
    }

    container.scrollLeft = topAuthorsScrollLeftRef.current - walk * 1.4
  }

  const stopTopAuthorsMouseDrag = () => {
    topAuthorsDraggingRef.current = false
  }

  const handleOpenTopAuthor = (author) => {
    if (topAuthorsDragMovedRef.current) {
      topAuthorsDragMovedRef.current = false
      return
    }

    handleOpenAuthor(author)
  }

  const handleFollowTopAuthor = async (author) => {
  const token = getReaderToken()

  if (!token) {
    navigate('/login')
    return
  }

  if (!author?.page_username || author?.is_owner || author?.is_following || followLoadingId) return

  try {
    setFollowLoadingId(author.id)

    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(author.page_username)}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) return

    setTopAuthors((current) =>
      current.map((item) =>
        item.id === author.id
          ? {
              ...item,
              is_following: true,
              total_followers: Number(data.total_followers ?? item.total_followers ?? 0),
            }
          : item
      )
    )
  } catch {
  } finally {
    setFollowLoadingId('')
  }
}
  
  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .eventSwiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding-top: 0;
          padding-bottom: 0;
        }

        .eventSwiper .swiper-slide {
          width: 100%;
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          transition: all 0.3s ease;
        }

        .eventSwiper .swiper-slide-next,
        .eventSwiper .swiper-slide-prev {
          opacity: 1;
          transform: none;
        }

        .event-swiper-pagination {
          left: auto !important;
          right: 10px !important;
          bottom: 8px !important;
          width: auto !important;
          text-align: right;
        }

        .event-swiper-pagination .swiper-pagination-bullet {
          width: 5px;
          height: 5px;
          margin: 0 2px !important;
          background: rgba(255, 255, 255, 0.65);
          opacity: 1;
        }

        .event-swiper-pagination .swiper-pagination-bullet-active {
          width: 5px;
          background: #ffffff;
          border-radius: 50%;
        }

        @media (min-width: 768px) {
          .eventSwiper {
            padding-top: 10px;
            padding-bottom: 30px;
          }

          .eventSwiper .swiper-slide {
            width: 58%;
            border-radius: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }

          .eventSwiper .swiper-slide-next,
          .eventSwiper .swiper-slide-prev {
            opacity: 0.4;
            transform: scale(0.9);
          }

          .event-swiper-pagination {
            left: 0 !important;
            right: 0 !important;
            bottom: 10px !important;
            width: 100% !important;
            text-align: center;
          }

          .event-swiper-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px !important;
            background: #111827;
            opacity: 0.2;
          }

          .event-swiper-pagination .swiper-pagination-bullet-active {
            width: 20px;
            background: #111827;
            border-radius: 5px;
            opacity: 1;
          }
        }

        .authorCenterSwiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding-top: 4px;
          padding-bottom: 26px;
        }

        .author-center-pagination .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          opacity: 1;
          background: #d1d5db;
        }

        .author-center-pagination .swiper-pagination-bullet-active {
          background: #111827;
          width: 22px;
          border-radius: 999px;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[#f0f0f0] bg-white px-4 py-3 text-[#111827]">
        <div className="mx-auto flex max-w-[760px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[16px]" />
          </button>
          <h1 className="text-[18px] font-extrabold">Event</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="flex gap-7 border-b border-[#f1f1f1]">
          <button
            type="button"
            onClick={() => setActiveTab('author')}
            className={`relative pb-3 text-[13px] font-extrabold ${
              activeTab === 'author' ? 'text-[#111827]' : 'text-[#9ca3af]'
            }`}
          >
            Author
            {activeTab === 'author' ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#F6B800]" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`relative pb-3 text-[13px] font-extrabold ${
              activeTab === 'event' ? 'text-[#111827]' : 'text-[#9ca3af]'
            }`}
          >
            Event
            {activeTab === 'event' ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#F6B800]" />
            ) : null}
          </button>
        </section>

        {activeTab === 'author' ? (
          <>
            <section className="mt-6">
              <EventSlideBanner />

              <div className="no-scrollbar mt-4 md:mt-2 flex gap-2 overflow-x-auto pb-1">
                {shortcutItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleShortcut(item.label)}
                    disabled={item.label !== 'Write'}
                    className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-extrabold active:scale-95 ${
                      item.type === 'primary'
                        ? 'bg-black text-white'
                        : 'border border-[#d8dbe3] bg-white text-[#9ca3af]'
                    } ${item.label !== 'Write' ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <i className={`fas ${item.icon} text-[10px]`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="py-8 text-center">
              <h2 className="text-[28px] font-extrabold text-[#111827]">Become A Writer</h2>

              <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-7 text-[#4b5563]">
                Share your stories, build your readers, and grow with Shadow.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                {benefitItems.map((item) => (
                  <div key={item.title} className="rounded-[16px] border border-[#eceaf2] bg-white p-3 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f5f7] text-[#111827]">
                      <i className={`fas ${item.icon} text-[12px]`} />
                    </div>
                    <div className="mt-3 text-[12px] font-extrabold text-[#111827]">{item.title}</div>
                    <div className="mt-1 text-[10px] leading-4 text-[#8d94a1]">{item.text}</div>
                  </div>
                ))}
              </div>

              {message ? (
                <div className="mx-auto mt-6 max-w-[520px] rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[13px] font-bold text-[#e5484d]">
                  {message}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleStartYourWork}
                aria-busy={loading}
                className="mx-auto mt-7 flex h-11 w-[78%] max-w-[360px] items-center justify-center rounded-full bg-black text-[16px] font-bold text-white shadow-[0_12px_26px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:bg-[#1b1b1b] active:scale-[0.99]"
              >
                Start your work
              </button>

              <div className="mt-4 text-[14px] text-[#111827]">
                Need help?
                <button type="button" onClick={() => navigate('/help')} className="ml-1 text-[#0b5cff]">
                  Help Center
                </button>
              </div>
            </section>

            <section className="pb-8">
              <h2 className="text-[19px] font-extrabold text-[#111827]">Author Center</h2>

              <AuthorCenterBannerSlider />

              <SectionHeader title="Top Authors This Week" onMore={() => navigate('/authors/top')} />

              <p className="mt-2 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                Discover popular authors readers are following now.
              </p>

              {topAuthorsLoading ? (
                <div className="mt-5 flex gap-3 overflow-hidden pb-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="min-w-[132px] rounded-[18px] border border-[#f3df9a] bg-[#fffdf7] px-3 py-4 text-center"
                    >
                      <div className="mx-auto mb-3 h-16 w-16 animate-pulse rounded-full bg-[#f3f4f6]" />
                      <div className="mx-auto h-3 w-20 animate-pulse rounded-full bg-[#f3f4f6]" />
                      <div className="mx-auto mt-2 h-3 w-16 animate-pulse rounded-full bg-[#f3f4f6]" />
                      <div className="mt-3 h-8 animate-pulse rounded-full bg-[#f3f4f6]" />
                    </div>
                  ))}
                </div>
              ) : topAuthors.length ? (
                <div
  ref={topAuthorsScrollRef}
  onMouseDown={handleTopAuthorsMouseDown}
  onMouseMove={handleTopAuthorsMouseMove}
  onMouseUp={stopTopAuthorsMouseDrag}
  onMouseLeave={stopTopAuthorsMouseDrag}
  className="no-scrollbar mt-5 flex cursor-grab gap-3 overflow-x-auto pb-2 select-none active:cursor-grabbing"
>
                  {topAuthors.slice(0, 6).map((author, index) => (
                    <TopAuthorCard
  key={author.id}
  rank={index + 1}
  author={author}
  onOpen={handleOpenTopAuthor}
  onFollow={handleFollowTopAuthor}
  loading={followLoadingId === author.id}
/>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[18px] border border-[#f3df9a] bg-[#fffdf7] px-4 py-6 text-center">
                  <div className="text-[14px] font-black text-[#111827]">No top authors yet</div>
                  <p className="mt-2 text-[12px] font-semibold text-[#8b93a1]">
                    Authors will appear here when ranking data is available.
                  </p>
                </div>
              )}

             
              <MostReadThisWeekSection />
            </section>
          </>
        ) : (
          <section className="mt-10 rounded-[22px] border border-[#eceaf2] bg-[#fafafa] px-5 py-10 text-center">
            <h2 className="text-[24px] font-extrabold text-[#111827]">Events Coming Soon</h2>
            <p className="mt-3 text-[14px] text-[#8d94a1]">
              More reader and author events will appear here later.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

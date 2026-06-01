import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function TopAuthorCard({ rank, author, onOpen, onFollow }) {
  const isFirst = rank === 1
  const name = author?.page_name || 'Author'
  const username = author?.page_username || 'author'
  const avatarUrl = author?.avatar_url || ''
  const followers = formatCompactNumber(author?.total_followers)
  const works = formatCompactNumber(author?.total_stories)

  return (
    <button
      type="button"
      onClick={() => onOpen(author)}
      className={`relative min-w-[132px] overflow-hidden rounded-[18px] border px-3 py-4 text-center shadow-sm active:scale-[0.98] ${
        isFirst
          ? 'border-[#f6b800] bg-gradient-to-b from-[#fff8df] to-white shadow-[0_10px_24px_rgba(246,184,0,0.18)]'
          : 'border-[#f3df9a] bg-[#fffdf7]'
      }`}
    >
      <div className="absolute left-2 top-2 rounded-full bg-[#111827] px-2 py-0.5 text-[10px] font-black text-[#f6b800]">
        #{rank}
      </div>

      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[18px] font-black text-white ring-2 ring-[#f6b800]/70">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          String(name || 'A').slice(0, 1).toUpperCase()
        )}
      </div>

      <div className="line-clamp-1 text-[12px] font-black text-[#111827]">{name}</div>
      <div className="mt-1 line-clamp-1 text-[10px] font-bold text-[#8b93a1]">@{username}</div>
      <div className="mt-2 text-[10px] font-extrabold text-[#111827]">{followers} followers</div>
      <div className="mt-1 text-[10px] font-semibold text-[#6b7280]">{works} works</div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onFollow(author)
        }}
        className="mt-3 w-full rounded-full bg-black py-2 text-[10px] font-black text-white active:scale-95"
      >
        Follow
      </button>
    </button>
  )
}

function SectionHeader({ title, onMore }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <h3 className="text-[19px] font-extrabold text-[#111827]">{title}</h3>
      <button
        type="button"
        onClick={onMore}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#9ca3af] active:scale-95"
      >
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
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-[20px] bg-[#f4f5f7] text-[14px] font-bold text-[#8d94a1]">
        Loading slides...
      </div>
    )
  }

  if (!slides.length) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-[20px] bg-black text-[34px] font-extrabold text-white/80">
        Cover
      </div>
    )
  }

  return (
    <div className="event-swiper-wrap">
      <div className="swiper-container eventSwiper">
        <div className="swiper-wrapper">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="swiper-slide aspect-[16/9] cursor-pointer"
              onClick={() => {
                if (slide.link_url) navigate(slide.link_url)
              }}
            >
              <img
                src={slide.image_url}
                alt={slide.title || 'Event slide'}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="event-swiper-pagination mt-3 text-center" />
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
      slidesPerView: 'auto',
      spaceBetween: 12,
      speed: 650,
      loop: banners.length > 2,
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
    <div className="mt-4">
      <div className="swiper-container authorCenterSwiper">
        <div className="swiper-wrapper">
          {banners.map((banner) => {
            const parsedTitle = parseBannerTitle(banner.title)

            return (
              <div
                key={banner.id}
                className="swiper-slide relative aspect-[3/1] w-[82%] cursor-pointer overflow-hidden rounded-[16px] bg-black text-white shadow-sm"
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

  useEffect(() => {
    let ignore = false

    async function fetchTopAuthors() {
      try {
        setTopAuthorsLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/authors/top?limit=5`)
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

  const handleFollowTopAuthor = async (author) => {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!author?.page_username) return

    try {
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
                total_followers: Number(item.total_followers || 0) + 1,
              }
            : item
        )
      )
    } catch {
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
          padding-top: 10px;
          padding-bottom: 30px;
        }

        .eventSwiper .swiper-slide {
          width: 85%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .eventSwiper .swiper-slide-next,
        .eventSwiper .swiper-slide-prev {
          opacity: 0.4;
          transform: scale(0.9);
        }

        @media (min-width: 768px) {
          .eventSwiper .swiper-slide {
            width: 58%;
          }
        }

        .authorCenterSwiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding-top: 4px;
          padding-bottom: 26px;
        }

        .event-swiper-pagination .swiper-pagination-bullet,
        .author-center-pagination .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          opacity: 1;
          background: #d1d5db;
        }

        .event-swiper-pagination .swiper-pagination-bullet-active,
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

              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
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
              <h2 className="text-[24px] font-extrabold text-[#111827]">Author Center</h2>

              <AuthorCenterBannerSlider />

              <SectionHeader title="Top Authors This Week" onMore={() => navigate('/authors/top')} />

              <p className="mt-2 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                Popular authors readers are following now.
              </p>

              {topAuthorsLoading ? (
                <div className="mt-5 flex gap-3 overflow-hidden pb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
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
                <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
                  {topAuthors.slice(0, 5).map((author, index) => (
                    <TopAuthorCard
                      key={author.id}
                      rank={index + 1}
                      author={author}
                      onOpen={handleOpenAuthor}
                      onFollow={handleFollowTopAuthor}
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

              <p className="mt-6 text-center text-[12px] font-semibold text-[#a0a6b2]">
                More author programs are coming soon.
              </p>
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

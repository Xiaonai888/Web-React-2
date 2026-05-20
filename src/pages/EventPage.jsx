import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'
const EVENT_SLIDE_SECTION_KEY = 'event_top_slider'

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

const benefitSlides = [
  { title: 'Author Rewards', text: 'Write, grow, and unlock more chances to be featured.' },
  { title: 'Weekly Ranking', text: 'Top authors can appear in special ranking areas.' },
  { title: 'Writer Events', text: 'Join future writing challenges and author campaigns.' },
]

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function AuthorCard({ name, fans, work, time, mode = 'recent' }) {
  return (
    <div className="min-w-[132px] rounded-[18px] border border-[#e5e7eb] bg-white px-3 py-4 text-center shadow-sm">
      <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-[#1f1f1f]" />
      <div className="line-clamp-1 text-[12px] font-bold text-[#111827]">{name}</div>
      <div className="mt-1 text-[13px] font-extrabold text-[#111827]">{fans}</div>
      <div className="mt-1 text-[12px] text-[#444]">{work}</div>

      {mode === 'top' ? (
        <button type="button" className="mt-3 h-8 w-full rounded-full bg-black text-[12px] font-bold text-white active:scale-95">
          Follow
        </button>
      ) : (
        <div className="mt-4 text-[10px] font-semibold text-[#a0a6b2]">
          <i className="far fa-clock mr-1" />
          {time}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ title, onMore }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <h3 className="text-[20px] font-extrabold text-[#111827]">{title}</h3>
      <button type="button" onClick={onMore} className="flex h-9 w-9 items-center justify-center active:scale-95">
        <i className="fas fa-chevron-right text-[24px]" />
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
      loop: slides.length > 2,
      rewind: slides.length <= 2,
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
      <div className="flex aspect-[2.6/1] w-full items-center justify-center rounded-[20px] bg-[#f4f5f7] text-[14px] font-bold text-[#8d94a1]">
        Loading slides...
      </div>
    )
  }

  if (!slides.length) {
    return (
      <div className="flex aspect-[2.6/1] w-full items-center justify-center rounded-[20px] bg-black text-[34px] font-extrabold text-white/80">
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
              className="swiper-slide aspect-[2.6/1] cursor-pointer overflow-hidden rounded-[20px]"
              onClick={() => {
                if (slide.link_url) navigate(slide.link_url)
              }}
            >
              <img src={slide.image_url} alt={slide.title || 'Event slide'} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="event-swiper-pagination mt-3 text-center" />
      </div>
    </div>
  )
}

function AuthorBenefitsSlider() {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (!window.Swiper) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.authorBenefitSwiper', {
      slidesPerView: 'auto',
      spaceBetween: 14,
      loop: benefitSlides.length > 2,
      rewind: benefitSlides.length <= 2,
      speed: 650,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.author-benefit-pagination',
        clickable: true,
      },
    })

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [])

  return (
    <div className="mt-5">
      <div className="swiper-container authorBenefitSwiper">
        <div className="swiper-wrapper">
          {benefitSlides.map((slide) => (
            <div
              key={slide.title}
              className="swiper-slide flex aspect-[2.9/1] w-[86%] flex-col justify-center rounded-[18px] bg-black px-6 text-white shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
            >
              <div className="text-[20px] font-extrabold">{slide.title}</div>
              <div className="mt-2 max-w-[340px] text-[13px] font-medium leading-5 text-white/70">{slide.text}</div>
            </div>
          ))}
        </div>
        <div className="author-benefit-pagination mt-3 text-center" />
      </div>
    </div>
  )
}

export default function EventPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('author')
  const [followingFilter, setFollowingFilter] = useState('recent')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
      return
    }

    if (label === 'Ranking') {
      navigate('/ranking')
      return
    }

    if (label === 'Reward') {
      navigate('/check-in')
      return
    }

    if (label === 'Guide') {
      navigate('/help')
    }
  }

  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .eventSwiper {
          width: 100%;
          padding-top: 4px;
          padding-bottom: 26px;
        }
        .eventSwiper .swiper-slide {
          width: 86%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .event-swiper-pagination .swiper-pagination-bullet,
        .author-benefit-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          opacity: 1;
          background: #d1d5db;
        }
        .event-swiper-pagination .swiper-pagination-bullet-active,
        .author-benefit-pagination .swiper-pagination-bullet-active {
          background: #111827;
          width: 22px;
          border-radius: 999px;
        }
      `}</style>

      <header className="sticky top-0 z-40 bg-black px-4 py-4 text-center text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
          aria-label="Go back"
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>
        <h1 className="text-[22px] font-medium">Event</h1>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-6">
        <section className="grid grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('author')}
            className={`relative pb-4 text-[20px] font-extrabold ${
              activeTab === 'author' ? 'text-[#111827]' : 'text-[#c7c7c7]'
            }`}
          >
            Author
            {activeTab === 'author' ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-[#111827]" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`relative pb-4 text-[20px] font-extrabold ${
              activeTab === 'event' ? 'text-[#111827]' : 'text-[#c7c7c7]'
            }`}
          >
            Event
            {activeTab === 'event' ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-[#111827]" />
            ) : null}
          </button>
        </section>

        {activeTab === 'author' ? (
          <>
            <section className="mt-8">
              <EventSlideBanner />

              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {shortcutItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleShortcut(item.label)}
                    className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-extrabold active:scale-95 ${
                      item.type === 'primary'
                        ? 'bg-black text-white'
                        : 'border border-[#d8dbe3] bg-white text-[#111827]'
                    }`}
                  >
                    <i className={`fas ${item.icon} text-[12px]`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="py-9 text-center">
              <h2 className="text-[30px] font-extrabold text-[#111827]">Become A Writer</h2>

              <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-7 text-[#4b5563]">
                Share your stories, build your readers, and grow with Shadow.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                {benefitItems.map((item) => (
                  <div key={item.title} className="rounded-[18px] border border-[#eceaf2] bg-white p-3 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] text-[#111827]">
                      <i className={`fas ${item.icon} text-[13px]`} />
                    </div>
                    <div className="mt-3 text-[13px] font-extrabold text-[#111827]">{item.title}</div>
                    <div className="mt-1 text-[11px] leading-4 text-[#8d94a1]">{item.text}</div>
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
                className="mx-auto mt-7 flex h-12 w-[82%] max-w-[380px] items-center justify-center rounded-full bg-black text-[18px] font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#1b1b1b] active:scale-[0.99]"
              >
                Start your work
              </button>

              <div className="mt-4 text-[15px] text-[#111827]">
                Need help?
                <button type="button" onClick={() => navigate('/help')} className="ml-1 text-[#0b5cff]">
                  Help Center
                </button>
              </div>
            </section>

            <section className="pb-8">
              <h2 className="text-[28px] font-extrabold text-[#111827]">Author Center</h2>

              <AuthorBenefitsSlider />

              <SectionHeader title="My Following" onMore={() => navigate('/authors/following')} />

              <div className="mt-4 flex gap-3">
                {['recent', 'popular', 'updated'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFollowingFilter(item)}
                    className={`rounded-full px-5 py-2 text-[14px] font-bold ${
                      followingFilter === item
                        ? 'bg-black text-white'
                        : 'border border-[#d8dbe3] bg-white text-[#111827]'
                    }`}
                  >
                    {item === 'recent' ? 'Recent' : item === 'popular' ? 'Popular' : 'Most Updated'}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="1 days ago" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="2 days ago" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="3 days ago" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="5 days ago" />
              </div>

              <SectionHeader title="Top Author" onMore={() => navigate('/authors/top')} />

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" mode="top" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" mode="top" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" mode="top" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" mode="top" />
              </div>
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

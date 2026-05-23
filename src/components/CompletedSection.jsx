import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const completedTabs = ['All Completed', 'Romance', 'Fantasy']

const completedQuotes = {
  'All Completed': 'Finished stories ready for binge reading.',
  Romance: 'Complete romance stories for readers who want the full ending.',
  Fantasy: 'Complete fantasy worlds you can read from beginning to end.',
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author: story.author_name || 'Shadow Author',
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    rating: '5.0',
    ratingCount: formatCompactNumber(Number(story.total_likes || 0) + Number(story.total_comments || 0)),
    genres: [story.main_genre, ...(story.tags || [])].filter(Boolean).slice(0, 4),
    description: story.description || 'No description yet.',
    cover: story.cover_url || `/assets/Completed/Completed ${Math.min(index + 1, 27)}.jpg`,
    link: `/story/${story.id}`,
    isAdult: Boolean(story.is_adult),
    isReal: true,
  }
}

const fallbackBooks = Array.from({ length: 9 }).map((_, index) => ({
  id: 500 + index,
  title: 'Name Book',
  author: 'Author Name',
  views: '100k',
  likes: '1000',
  episodes: 'Ep 17',
  rating: '5.0',
  ratingCount: '1k',
  genres: index % 2 === 0 ? ['Romance', 'Drama', 'Comedy'] : ['Fantasy', 'Action', 'Adventure'],
  description: 'A completed Shadow story. Real published completed stories will appear here after admin/author data is connected.',
  cover: `/assets/Completed/Completed ${index + 1}.jpg`,
  link: `/story/${500 + index}`,
  isAdult: false,
  isReal: false,
}))

function QuoteLine({ activeTab }) {
  return (
    <div className="mb-4 px-1">
      <p className="text-[12px] font-medium text-gray-500 sm:text-[13px]">
        {completedQuotes[activeTab] || completedQuotes['All Completed']}
      </p>
    </div>
  )
}

function Dots({ count, activeIndex, onDotClick }) {
  if (count <= 1) return null

  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex

        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              isActive ? 'bg-blue-600' : 'bg-black'
            }`}
          />
        )
      })}
    </div>
  )
}

function InfoRow({ book }) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold sm:text-[11px] lg:text-[12px]">
      <div className="flex items-center gap-1 text-blue-700">
        <i className="fas fa-eye text-[10px] text-black sm:text-[11px]" />
        <span>{book.views}</span>
      </div>

      <div className="flex items-center gap-1 text-red-500">
        <i className="fas fa-heart text-[10px] sm:text-[11px]" />
        <span className="text-black">{book.likes}</span>
      </div>

      <div className="flex items-center gap-1 text-blue-700">
        <i className="fas fa-list text-[10px] text-black sm:text-[11px]" />
        <span>{book.episodes}</span>
      </div>

      <div className="flex items-center gap-1 text-blue-700">
        <i className="fas fa-star text-[10px] text-yellow-400 sm:text-[11px]" />
        <span>{book.rating}</span>
        <span className="text-neutral-700">({book.ratingCount})</span>
      </div>
    </div>
  )
}

function SlideCards({ books, onBookClick }) {
  return (
    <div className="space-y-5">
      {books.map((book) => (
        <button
          key={book.id}
          type="button"
          onClick={() => onBookClick(book.link)}
          className="group w-full text-left"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:bg-gray-50 sm:gap-4 sm:p-4">
            <div className="relative w-[82px] shrink-0 overflow-hidden rounded-xl bg-neutral-200 shadow-sm sm:w-[96px]">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/Completed/Completed 1.jpg'
                  }}
                />
              </div>

              {book.isAdult ? (
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-extrabold text-[#e5484d]">
                  18+
                </div>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="line-clamp-1 text-[15px] font-extrabold leading-tight tracking-tight text-[#0646c8] sm:text-[17px]">
                {book.title}
              </h3>

              <p className="mt-0.5 line-clamp-1 text-[11px] font-bold text-neutral-700 sm:text-[13px]">
                {book.author}
              </p>

              <InfoRow book={book} />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {book.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-[#efefef] px-2 py-0.5 text-[9px] font-medium text-neutral-500 sm:text-[10px]"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-neutral-800 sm:text-[12px] sm:leading-5">
                {book.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function LoadingCompleted() {
  return (
    <section className="px-4 pb-8 pt-8 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-7 w-40 animate-pulse rounded-full bg-gray-100" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
        </div>

        <div className="mb-4 flex gap-2">
          <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="h-[123px] w-[82px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function CompletedSection() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(completedTabs[0])
  const [activeSlide, setActiveSlide] = useState(0)
  const [realBooks, setRealBooks] = useState({
    'All Completed': [],
    Romance: [],
    Fantasy: [],
  })
  const [loading, setLoading] = useState(true)

  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    let ignore = false

    async function fetchCompletedStories() {
      try {
        setLoading(true)

       const [allResponse, romanceResponse, fantasyResponse] = await Promise.all([
  fetch(addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=9&sort=updated`)),
  fetch(addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=9&sort=updated&genre=Romance`)),
  fetch(addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=9&sort=updated&genre=Fantasy`)),
])

        const allData = await allResponse.json().catch(() => ({}))
        const romanceData = await romanceResponse.json().catch(() => ({}))
        const fantasyData = await fantasyResponse.json().catch(() => ({}))

        if (!allResponse.ok || allData.ok === false) {
          throw new Error(allData.message || 'Failed to load completed stories')
        }

        if (!romanceResponse.ok || romanceData.ok === false) {
          throw new Error(romanceData.message || 'Failed to load romance stories')
        }

        if (!fantasyResponse.ok || fantasyData.ok === false) {
          throw new Error(fantasyData.message || 'Failed to load fantasy stories')
        }

        if (ignore) return

        setRealBooks({
          'All Completed': (allData.stories || []).map(normalizeStory),
          Romance: (romanceData.stories || []).map(normalizeStory),
          Fantasy: (fantasyData.stories || []).map(normalizeStory),
        })
      } catch (error) {
        console.error('CompletedSection fetch error:', error)

        if (!ignore) {
          setRealBooks({
            'All Completed': [],
            Romance: [],
            Fantasy: [],
          })
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchCompletedStories()

    return () => {
      ignore = true
    }
  }, [])

  const books = useMemo(() => {
    const realList = realBooks[activeTab]
    return realList?.length ? realList : fallbackBooks
  }, [activeTab, realBooks])

  const slides = useMemo(() => {
    const chunks = []

    for (let index = 0; index < books.length; index += 3) {
      chunks.push(books.slice(index, index + 3))
    }

    return chunks
  }, [books])

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth = container.offsetWidth
    const currentIndex = Math.round(container.scrollLeft / slideWidth)
    setActiveSlide(currentIndex)
  }

  const scrollToIndex = (index) => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth = container.offsetWidth

    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    })

    setActiveSlide(index)
  }

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container) return

    isDraggingRef.current = true
    startXRef.current = event.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
  }

  const handleMouseMove = (event) => {
    const container = scrollRef.current
    if (!container || !isDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - startXRef.current
    container.scrollLeft = scrollLeftRef.current - walk
  }

  const stopDragging = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    setActiveSlide(0)

    const container = scrollRef.current
    if (container) {
      container.scrollTo({ left: 0, behavior: 'auto' })
    }
  }, [activeTab])

  if (loading) {
    return <LoadingCompleted />
  }

  return (
    <section className="px-4 pb-8 pt-8 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">😁</span>
            <h2 className="text-[20px] font-extrabold tracking-tight text-neutral-950 sm:text-[24px]">
              Completed
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/completed')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition hover:bg-black/5 sm:h-10 sm:w-10"
            aria-label="Go to Completed page"
          >
            <i className="fas fa-chevron-right text-[18px] sm:text-[20px]" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {completedTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-medium transition sm:text-[15px] ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <QuoteLine activeTab={activeTab} />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth cursor-grab select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((group, index) => (
            <div key={index} className="w-full shrink-0 snap-start">
              <SlideCards books={group} onBookClick={(link) => navigate(link)} />
            </div>
          ))}
        </div>

        <Dots count={slides.length} activeIndex={activeSlide} onDotClick={scrollToIndex} />
      </div>
    </section>
  )
}

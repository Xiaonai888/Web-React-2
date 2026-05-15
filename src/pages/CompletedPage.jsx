import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const completedTabs = ['Hot', 'Romance', 'Fantasy', 'Latest']

const completedQuotes = {
  Hot: 'Finished stories readers are opening now.',
  Romance: 'Complete romance stories with full endings.',
  Fantasy: 'Complete fantasy stories ready for a long reading session.',
  Latest: 'Recently updated published stories from Shadow authors.',
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
    freePreview: Number(story.total_episodes || 0) > 0,
    isAdult: Boolean(story.is_adult),
    isReal: true,
  }
}

const fallbackBooks = Array.from({ length: 9 }).map((_, index) => ({
  id: 700 + index,
  title: 'Name Book',
  author: 'Author Name',
  views: '100k',
  likes: '1000',
  episodes: 'Ep 17',
  rating: '5.0',
  ratingCount: '1k',
  genres: index % 2 === 0 ? ['Romance', 'Drama', 'Comedy'] : ['Fantasy', 'Action', 'Adventure'],
  description: 'A completed Shadow story. Real published stories will appear here after author publishing data is available.',
  cover: `/assets/Completed/Completed ${index + 1}.jpg`,
  link: `/story/${700 + index}`,
  freePreview: true,
  isAdult: false,
  isReal: false,
}))

function QuoteLine({ activeTab }) {
  return (
    <div className="mb-4 px-1">
      <p className="text-[13px] font-medium text-gray-500">
        {completedQuotes[activeTab] || completedQuotes.Hot}
      </p>
    </div>
  )
}

function Dots({ count, activeIndex, onDotClick }) {
  if (count <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex
        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              isActive
                ? 'h-2.5 w-6 bg-black'
                : 'h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        )
      })}
    </div>
  )
}

function SlideCards({ books }) {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Link key={book.id} to={book.link}>
          <div className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-gray-50">
            <div className="relative h-[112px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = '/assets/Completed/Completed 1.jpg'
                }}
              />

              {book.freePreview ? (
                <div className="absolute left-1.5 top-1.5 rounded-full bg-white/92 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-neutral-900 shadow-sm">
                  FREE PREVIEW
                </div>
              ) : null}

              {book.isAdult ? (
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-extrabold text-[#e5484d]">
                  18+
                </div>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 py-1">
              <h3 className="line-clamp-2 text-[16px] font-extrabold tracking-tight text-[#1f4f8c]">
                {book.title}
              </h3>

              <p className="mt-0.5 text-[13px] font-medium text-gray-500">
                {book.author}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px]">
                <div className="flex items-center gap-1 text-gray-600">
                  <i className="fas fa-eye text-[13px]" />
                  <span>{book.views}</span>
                </div>

                <div className="flex items-center gap-1">
                  <i className="fas fa-heart text-[13px] text-red-500" />
                  <span className="text-gray-600">{book.likes}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600">
                  <i className="fas fa-list text-[13px]" />
                  <span>{book.episodes}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[13px] text-gray-600">
                <i className="fas fa-star text-[13px] text-yellow-400" />
                <span>{book.rating}</span>
                <span>({book.ratingCount})</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {book.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-gray-600">
                {book.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function LoadingCompletedPage() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="h-[112px] w-[80px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
          <div className="min-w-0 flex-1 py-1">
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onRefresh }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <i className="fa-regular fa-file-lines text-[22px]" />
      </div>

      <h2 className="mt-4 text-[17px] font-extrabold text-neutral-900">
        No completed stories yet
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-gray-500">
        Published stories will appear here after author data is available.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
      >
        Refresh
      </button>
    </div>
  )
}

export default function CompletedPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Hot')
  const [activeSlide, setActiveSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [realBooks, setRealBooks] = useState({
    Hot: [],
    Romance: [],
    Fantasy: [],
    Latest: [],
  })

  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  async function fetchCompletedPageData() {
    try {
      setLoading(true)
      setMessage('')

      const [hotResponse, romanceResponse, fantasyResponse, latestResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/public/stories?limit=27&sort=popular`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=27&sort=updated&genre=Romance`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=27&sort=updated&genre=Fantasy`),
        fetch(`${API_BASE_URL}/api/public/stories?limit=27&sort=latest`),
      ])

      const hotData = await hotResponse.json().catch(() => ({}))
      const romanceData = await romanceResponse.json().catch(() => ({}))
      const fantasyData = await fantasyResponse.json().catch(() => ({}))
      const latestData = await latestResponse.json().catch(() => ({}))

      if (!hotResponse.ok || hotData.ok === false) {
        throw new Error(hotData.message || 'Failed to load hot stories')
      }

      if (!romanceResponse.ok || romanceData.ok === false) {
        throw new Error(romanceData.message || 'Failed to load romance stories')
      }

      if (!fantasyResponse.ok || fantasyData.ok === false) {
        throw new Error(fantasyData.message || 'Failed to load fantasy stories')
      }

      if (!latestResponse.ok || latestData.ok === false) {
        throw new Error(latestData.message || 'Failed to load latest stories')
      }

      setRealBooks({
        Hot: (hotData.stories || []).map(normalizeStory),
        Romance: (romanceData.stories || []).map(normalizeStory),
        Fantasy: (fantasyData.stories || []).map(normalizeStory),
        Latest: (latestData.stories || []).map(normalizeStory),
      })
    } catch (error) {
      console.error('CompletedPage fetch error:', error)

      setRealBooks({
        Hot: [],
        Romance: [],
        Fantasy: [],
        Latest: [],
      })

      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please try again later.'
          : error.message || 'Failed to load completed stories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletedPageData()
  }, [])

  const books = useMemo(() => {
    const realList = realBooks[activeTab]
    return realList?.length ? realList : message ? [] : fallbackBooks
  }, [activeTab, realBooks, message])

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

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[20px]">😁</span>
            <h1 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-900">
              Completed
            </h1>
          </div>

          <button
            type="button"
            onClick={fetchCompletedPageData}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right text-[15px]" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {completedTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <QuoteLine activeTab={activeTab} />

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <LoadingCompletedPage />
        ) : slides.length ? (
          <>
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
                  <SlideCards books={group} />
                </div>
              ))}
            </div>

            <Dots count={slides.length} activeIndex={activeSlide} onDotClick={scrollToIndex} />
          </>
        ) : (
          <EmptyState onRefresh={fetchCompletedPageData} />
        )}
      </main>
    </div>
  )
}

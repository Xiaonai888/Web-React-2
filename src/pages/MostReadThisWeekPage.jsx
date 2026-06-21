import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const LOAD_STEP = 20
const MAX_BOOKS = 100

const fallbackBooks = Array.from({ length: 20 }, (_, index) => ({
  id: `most-read-fallback-${index + 1}`,
  title: 'Most Read Story',
  image: `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
  likes: [18000, 4299, 3494, 2800, 2200, 1900][index % 6],
}))

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
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

function normalizeBook(story, index = 0) {
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

function RankBadge({ rank }) {
  const rankBadgeClasses = {
    1: 'bg-[#FF3B30] text-white',
    2: 'bg-[#FF8C00] text-white',
    3: 'bg-[#FFD400] text-[#111827]',
    4: 'bg-[#8A2BE2] text-white',
    5: 'bg-[#A0A7B4] text-white',
  }

  return (
    <div
      className={`absolute right-2 top-0 flex h-[36px] w-[30px] items-center justify-center text-[14px] font-bold shadow-[0_6px_12px_rgba(0,0,0,0.16)] ${rankBadgeClasses[rank] || rankBadgeClasses[5]}`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' }}
    >
      {rank}
    </div>
  )
}

function BookCard({ book, rank, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block min-w-0 bg-transparent p-0 text-left active:scale-[0.98]"
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

        <RankBadge rank={rank} />
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

export default function MostReadThisWeekPage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(LOAD_STEP)

  useEffect(() => {
    let ignore = false

    async function fetchMostReadBooks() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=${MAX_BOOKS}&sort=popular`)
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load most read stories')
        }

        if (!ignore) {
          setBooks((data.stories || []).map(normalizeBook).slice(0, MAX_BOOKS))
        }
      } catch {
        if (!ignore) setBooks([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchMostReadBooks()

    return () => {
      ignore = true
    }
  }, [])

  const sourceBooks = useMemo(() => (books.length ? books : fallbackBooks), [books])
  const visibleBooks = sourceBooks.slice(0, visibleCount)
  const canLoadMore = visibleCount < Math.min(sourceBooks.length, MAX_BOOKS)

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 border-b border-[#f0f0f0] bg-white px-4 py-3 text-[#111827]">
        <div className="mx-auto flex max-w-[960px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[16px]" />
          </button>
          <h1 className="text-[18px] font-extrabold">Most Read This Week</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-4 py-5">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-[19px] font-extrabold text-[#111827]">Top 100 Books</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
              The most liked stories readers are following now.
            </p>
          </div>

          <div className="text-[12px] font-bold text-[#9ca3af]">
            {loading ? 'Loading' : `${visibleBooks.length}/${Math.min(sourceBooks.length, MAX_BOOKS)}`}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-6 md:gap-x-3 md:gap-y-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="min-w-0">
                <div className="aspect-[2/3] animate-pulse rounded-[10px] bg-[#f3f4f6]" />
                <div className="mt-2 h-4 animate-pulse rounded-full bg-[#f3f4f6]" />
                <div className="mt-2 h-3 w-14 animate-pulse rounded-full bg-[#f3f4f6]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-6 md:gap-x-3 md:gap-y-6">
            {visibleBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                rank={index + 1}
                onOpen={() => navigate(`/story/${book.id}`)}
              />
            ))}
          </div>
        )}

        {!loading && !visibleBooks.length ? (
          <div className="mt-8 rounded-[20px] bg-[#f8fafc] p-8 text-center text-[13px] font-bold text-[#9ca3af]">
            No books found.
          </div>
        ) : null}

        {!loading && canLoadMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_STEP, MAX_BOOKS))}
            className="mx-auto mt-8 flex h-10 min-w-[150px] items-center justify-center rounded-full bg-[#111827] px-6 text-[13px] font-black text-white active:scale-95"
          >
            Load More
          </button>
        ) : null}

        {!loading && sourceBooks.length >= MAX_BOOKS && !canLoadMore ? (
          <div className="mt-6 text-center text-[12px] font-bold text-[#a0a6b2]">
            You’ve reached the first 100 books.
          </div>
        ) : null}
      </main>
    </div>
  )
}

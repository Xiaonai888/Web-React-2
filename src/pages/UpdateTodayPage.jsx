import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackBooks = [
  {
    id: 201,
    title: 'Name book',
    author: 'Shadow Author',
    cover: '/assets/Update Today/Update Today 1.jpg',
    badge: 'red',
    views: '100k',
    likes: '1000',
    episodes: 'Ep 17',
    genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
    description: 'A featured Shadow story waiting for real published updates.',
  },
  {
    id: 202,
    title: 'Name Novel',
    author: 'Shadow Author',
    cover: '/assets/Update Today/Update Today 2.jpg',
    badge: 'green',
    views: '100k',
    likes: '2.5k',
    episodes: 'Ep 17',
    genres: ['Romance', 'Fantasy'],
    description: 'A published story will appear here after authors publish episodes.',
  },
  {
    id: 203,
    title: 'Name Novel',
    author: 'Shadow Author',
    cover: '/assets/Update Today/Update Today 3.jpg',
    badge: 'yellow',
    views: '80k',
    likes: '1.8k',
    episodes: 'Ep 17',
    genres: ['Action', 'Drama'],
    description: 'Real stories from Supabase will replace this fallback list.',
  },
]

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
}

const badgeText = {
  red: 'HOT',
  yellow: 'UP',
  green: 'NEW',
}

const sortTabs = [
  { key: 'updated', label: 'Updated' },
  { key: 'latest', label: 'Latest' },
  { key: 'popular', label: 'Popular' },
  { key: 'likes', label: 'Likes' },
]

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
    cover: story.cover_url || `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    badge: index === 0 ? 'green' : index % 3 === 0 ? 'red' : index % 3 === 1 ? 'yellow' : 'green',
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    genres: [story.main_genre, ...(story.tags || [])].filter(Boolean).slice(0, 4),
    description: story.description || 'No description yet.',
    isAdult: Boolean(story.is_adult),
    language: story.story_language || 'Khmer',
    updatedAt: story.updated_at || story.created_at,
    isReal: true,
  }
}

function LoadingSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex gap-4 p-4">
          <div className="h-[112px] w-[80px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
          <div className="min-w-0 flex-1 py-1">
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            </div>
            <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onRetry }) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <i className="fa-regular fa-file-lines text-[24px]" />
      </div>

      <h2 className="mt-4 text-[18px] font-extrabold text-neutral-900">
        No published stories yet
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-gray-500">
        Published stories will appear here after authors publish their episodes.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
      >
        Refresh
      </button>
    </div>
  )
}

function BookCard({ book }) {
  const updatedText = book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : ''

  return (
    <Link to={`/story/${book.id}`} className="group block">
      <div className="flex gap-4 rounded-2xl p-4 transition-colors hover:bg-gray-50">
        <div className="relative h-[112px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.src = '/assets/Update Today/Update Today 1.jpg'
            }}
          />

          <div className={`absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-[9px] font-extrabold ${badgeStyles[book.badge] || badgeStyles.green}`}>
            {badgeText[book.badge] || 'NEW'}
          </div>

          {book.isAdult ? (
            <div className="absolute bottom-1.5 left-1.5 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-extrabold text-[#e5484d]">
              18+
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 py-1">
          <h3 className="line-clamp-2 text-[16px] font-extrabold tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <p className="mt-0.5 text-[13px] font-medium text-gray-500">{book.author}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {book.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                {genre}
              </span>
            ))}

            {book.language ? (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                {book.language}
              </span>
            ) : null}
          </div>

          <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-gray-500">
            {book.description}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-eye text-[12px]" />
              <span>{book.views}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-[12px] text-red-500" />
              <span className="text-gray-600">{book.likes}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-list text-[12px]" />
              <span>{book.episodes}</span>
            </div>

            {updatedText ? (
              <div className="flex items-center gap-1 text-gray-400">
                <i className="fa-regular fa-clock text-[12px]" />
                <span>{updatedText}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function UpdateTodayPage() {
  const [books, setBooks] = useState([])
  const [sort, setSort] = useState('updated')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const realBooksCount = useMemo(() => books.filter((book) => book.isReal).length, [books])

  async function fetchStories(selectedSort = sort) {
    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/public/stories?limit=48&sort=${selectedSort}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load stories')
      }

      const normalized = (data.stories || []).map(normalizeStory)

      setBooks(normalized.length ? normalized : [])
    } catch (error) {
      console.error('UpdateTodayPage fetch error:', error)
      setBooks([])
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please try again later.'
          : error.message || 'Failed to load stories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories(sort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  const displayBooks = books.length ? books : message ? [] : fallbackBooks

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[22px]">🎉</span>
            <h1 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-900">
              UPDATE TODAY
            </h1>
          </div>

          <button
            type="button"
            onClick={() => fetchStories(sort)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right text-[15px]" />
          </button>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
          {sortTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSort(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition active:scale-95 ${
                sort === tab.key
                  ? 'bg-neutral-950 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-2 pt-3">
        <div className="px-4 pb-2">
          <p className="text-[13px] font-medium text-gray-400">
            {realBooksCount || displayBooks.length} stories updated today
          </p>

          {message ? (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="mt-3 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
            >
              {message}
            </button>
          ) : null}
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : displayBooks.length ? (
          <div className="divide-y divide-gray-100">
            {displayBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState onRetry={() => fetchStories(sort)} />
        )}
      </main>
    </div>
  )
}

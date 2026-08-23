import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const YOU_MIGHT_LIKE_PAGE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

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
    cover: story.cover_url || `/assets/YouMightLike/YouMightLike ${Math.min(index + 1, 6)}.jpg`,
    likes: formatCompactNumber(story.total_likes),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    isAdult: Boolean(story.is_adult),
  }
}

function BookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = '/assets/YouMightLike/YouMightLike 1.jpg'
          }}
        />
        {book.isAdult ? (
          <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
            18+
          </div>
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 min-h-[42px] text-[15px] font-bold leading-[21px] tracking-tight text-neutral-900">
        {book.title}
      </h3>

      <div className="mt-2 flex items-center gap-3 text-[13px] text-gray-600">
        <div className="flex items-center gap-1">
          <i className="fas fa-heart text-[12px] text-red-500" />
          <span className="font-medium">{book.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="fas fa-list text-[12px]" />
          <span className="font-medium">{book.episodes}</span>
        </div>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-2xl bg-gray-100" />
          <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

export default function YouMightLikePage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function fetchBooks({
  force = false,
  signal,
} = {}) {
  const cacheKey = getHomeCacheKey({
    section: 'stories',
    language: getStoryLanguageId(),
    params: {
      page: 'you-might-like',
      sort: 'popular',
      limit: 48,
      schema: 1,
    },
  })

  let hasCachedBooks = false

  if (!force) {
    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: YOU_MIGHT_LIKE_PAGE_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    if (signal?.aborted) return

    hasCachedBooks = Array.isArray(cached?.data)

    if (hasCachedBooks) {
      setBooks(cached.data)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedBooks) {
      return
    }
  }

  try {
    if (!hasCachedBooks) {
      setLoading(true)
    }

    setMessage('')

    const response = await fetch(
      addStoryLanguageParam(
        `${API_BASE_URL}/api/public/stories?limit=48&sort=popular`
      ),
      { signal }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message || 'Failed to load recommendations'
      )
    }

    const nextBooks = (
      Array.isArray(data.stories) ? data.stories : []
    ).map(normalizeStory)

    if (signal?.aborted) return

    setBooks(nextBooks)

    await saveHomeCache(cacheKey, nextBooks, {
      maxAgeMs: YOU_MIGHT_LIKE_PAGE_CACHE_MAX_AGE_MS,
    })
  } catch (error) {
    if (error?.name === 'AbortError') return

    console.error('YouMightLikePage fetch error:', error)

    if (!hasCachedBooks) {
      setBooks([])
    }

    setMessage(
      error.message || 'Failed to load recommendations'
    )
  } finally {
    if (!signal?.aborted) {
      setLoading(false)
    }
  }
}

useEffect(() => {
  const controller = new AbortController()

  fetchBooks({
    signal: controller.signal,
  })

  return () => {
    controller.abort()
  }
}, [])


  return (
    <div className="min-h-screen bg-white pb-24">
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
            <span className="text-[20px] lg:text-[21px]">🙂</span>
            <h1 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              You Might Like
            </h1>
          </div>

          <button
            type="button"
            onClick={() => fetchBooks({ force: true })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right text-[15px]" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-4 sm:px-5 lg:px-6">
        {message ? (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {message}
          </div>
        ) : null}

        {loading ? (
          <LoadingGrid />
        ) : books.length ? (
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 px-5 py-12 text-center">
            <div className="text-[16px] font-bold text-neutral-900">
              No recommendations yet
            </div>
            <button
              type="button"
              onClick={() => fetchBooks({ force: true })}
              className="mt-4 rounded-full bg-neutral-950 px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Refresh
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

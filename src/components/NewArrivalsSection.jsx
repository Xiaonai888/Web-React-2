import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addStoryLanguageParam,
  getStoryLanguageId,
  getStoryLanguageLabel,
} from '../utils/storyLanguage'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'
import { getStoryBadge } from '../utils/storyBadge'
import { trackSectionQualifiedView } from '../services/storySectionRankTracking'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
const NEW_ARRIVALS_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

const badgeStyles = {
  new: 'bg-[#FF4D6D] text-white',
  up: 'bg-[#F6B800] text-[#111827]',
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`
  }

  return String(number)
}

function normalizeStory(story, index = 0) {
  const badge = getStoryBadge(story)

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author:
      story.author_page?.page_name ||
      story.author_page?.page_username ||
      story.author_name ||
      'Shadow Author',
    badge: badge ? badge.toUpperCase() : '',
    badgeColor: badge,
    likes: formatCompactNumber(story.total_likes),
    views: formatCompactNumber(story.total_views),
    cover:
      story.cover_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
  }
}

function BookCard({ book, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block h-full w-full shrink-0 text-left"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-gray-100 shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
          }}
        />

        {book.badge ? (
          <div
            className={`absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${
              badgeStyles[book.badgeColor] || badgeStyles.new
            }`}
          >
            {book.badge}
          </div>
        ) : null}

        {book.isAdult ? (
          <div className="absolute bottom-2 left-2 rounded-full bg-[#e5484d] px-2.5 py-1 text-[10px] font-extrabold text-white">
            18+
          </div>
        ) : null}
      </div>

      <h3 className="mt-2 block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
        {book.title}
      </h3>

      <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-gray-500">
        {book.genre || 'New Arrival'}
      </p>
    </button>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-44 animate-pulse rounded-full bg-gray-100" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-6 lg:grid-cols-5 lg:gap-x-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-2xl bg-gray-100" />
            <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function NewArrivalsSection({
  storyType = '',
}) {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const storyLanguage = getStoryLanguageLabel()

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
  let ignore = false

  async function loadNewArrivals() {
    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        home_section: 'new-arrivals',
        sort: 'latest',
        limit: 24,
        story_type: normalizedStoryType || 'all',
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    const hasCachedBooks = Array.isArray(cached?.data)

    if (hasCachedBooks && !ignore) {
      setBooks(cached.data)
      setLoadFailed(false)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedBooks) {
      return
    }

    try {
      if (!hasCachedBooks && !ignore) {
        setLoading(true)
      }

      if (!ignore) {
        setLoadFailed(false)
      }

      const storyTypeQuery = normalizedStoryType
        ? `&story_type=${encodeURIComponent(
            normalizedStoryType
          )}`
        : ''

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=24&sort=latest${storyTypeQuery}`
        )
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to load new arrivals'
        )
      }

      const newestBooks = (data.stories || [])
        .filter(
          (story) =>
            !normalizedStoryType ||
            String(story?.story_type || '')
              .trim()
              .toLowerCase() === normalizedStoryType
        )
        .filter(
          (story) =>
            Number(story.total_episodes || 0) >= 1
        )
        .filter(
          (story) => getStoryBadge(story) !== 'end'
        )
        .map(normalizeStory)
        .slice(0, 12)

      if (ignore) return

      setBooks(newestBooks)
      setLoadFailed(false)

      await saveHomeCache(cacheKey, newestBooks, {
        maxAgeMs: NEW_ARRIVALS_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      console.error(
        'NewArrivalsSection fetch error:',
        error
      )

      if (!ignore && !hasCachedBooks) {
        setLoadFailed(true)
        setBooks([])
      }
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadNewArrivals()

  return () => {
    ignore = true
  }
}, [normalizedStoryType])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px] lg:text-[21px]">
            🚀
          </span>

          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
            New Arrivals
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/new-arrivals')}
          className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
          aria-label="Go to New Arrivals page"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
        </button>
      </div>

      {books.length ? (
        <div className="-mr-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x_pan-y] sm:-mr-5 sm:pr-5 lg:mr-0 lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible lg:pb-0 lg:pr-0 [&::-webkit-scrollbar]:hidden">
          {books.map((book) => (
            <div
              key={book.id}
              className="w-[calc((100vw-56px)/2.5)] min-w-[calc((100vw-56px)/2.5)] lg:w-auto lg:min-w-0"
            >
              <BookCard
                book={book}
                onClick={() => {
  void trackSectionQualifiedView('new_arrivals', book.id)
  navigate(book.link)
}}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[#f8f8fb] px-4 py-6 text-center">
          <div className="text-[14px] font-extrabold text-[#111827]">
            {loadFailed
              ? 'Could not load new arrivals'
              : normalizedStoryType === 'manga'
                ? 'No Manga new arrivals yet'
                : `No ${storyLanguage} new stories yet`}
          </div>

          <div className="mt-1 text-[12px] text-[#8d94a1]">
            Only published stories with at least one episode are shown.
          </div>
        </div>
      )}
    </section>
  )
}

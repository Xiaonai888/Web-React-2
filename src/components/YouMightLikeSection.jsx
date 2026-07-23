import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getFallbackCover(index = 0) {
  return `/assets/YouMightLike/YouMightLike ${(index % 6) + 1}.jpg`
}

function getFirstDifferentTag(mainGenre, tags = []) {
  const genre = String(mainGenre || '').trim().toLowerCase()
  const normalizedTags = Array.isArray(tags) ? tags : []

  return (
    normalizedTags
      .map((tag) => String(tag || '').trim())
      .find((tag) => tag && tag.toLowerCase() !== genre) || ''
  )
}

const fallbackBooks = Array.from({ length: 30 }).map((_, index) => ({
  id: 900 + index,
  title: 'Name Book',
  cover: getFallbackCover(index),
  genre: 'Recommended',
  firstTag: '',
}))

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || getFallbackCover(index),
    genre: String(story.main_genre || '').trim(),
    firstTag: getFirstDifferentTag(story.main_genre, story.tags),
  }
}

function BookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="overflow-hidden rounded-[8px] bg-[#1e1e22] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[8px]">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = '/assets/YouMightLike/YouMightLike 1.jpg'
            }}
          />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="block w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-neutral-900">
          {book.title}
        </h3>

        <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-gray-400">
          {[book.genre, book.firstTag].filter(Boolean).join(' / ') || 'Recommended'}
        </p>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🙂</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              You Might Like
            </h2>
          </div>

          <Link
            to="/you-might-like"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="View all You Might Like"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
              <div className="mt-3 h-4 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function YouMightLikeSection({
  storyType = '',
}) {
  const [realBooks, setRealBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
    let ignore = false

    async function fetchYouMightLike() {
      try {
        setLoading(true)

        const storyTypeQuery = normalizedStoryType
          ? `&story_type=${encodeURIComponent(
              normalizedStoryType
            )}`
          : ''

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=30&sort=popular${storyTypeQuery}`
          )
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
            'Failed to load You Might Like'
          )
        }

        if (ignore) return

        const visibleStories = (
          data.stories || []
        )
          .filter(
            (story) =>
              !normalizedStoryType ||
              String(story?.story_type || '')
                .trim()
                .toLowerCase() ===
                normalizedStoryType
          )
          .filter(
            (story) =>
              !normalizedStoryType ||
              Boolean(
                String(story?.cover_url || '').trim()
              )
          )

        setRealBooks(
          visibleStories.map(normalizeStory)
        )
      } catch (error) {
        console.error(
          'YouMightLikeSection fetch error:',
          error
        )

        if (!ignore) {
          setRealBooks([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchYouMightLike()

    return () => {
      ignore = true
    }
  }, [normalizedStoryType])

  const books = useMemo(() => {
    if (realBooks.length) {
      return realBooks
    }

    if (normalizedStoryType) {
      return []
    }

    return fallbackBooks
  }, [normalizedStoryType, realBooks])

  if (loading) {
    return <LoadingGrid />
  }

  if (!books.length) {
    return null
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">
              🙂
            </span>

            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              You Might Like
            </h2>
          </div>

          <Link
            to="/you-might-like"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="View all You Might Like"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

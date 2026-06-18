import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const badgeConfig = {
  new: {
    text: 'NEW',
    className: 'bg-[#FF4D6D] text-white',
  },
  up: {
    text: 'UP',
    className: 'bg-[#F6B800] text-[#111827]',
  },
  end: {
    text: 'END',
    className: 'bg-[#16A34A] text-white',
  },
}

function getRealBadgeFromStoryStatus(status) {
  const value = String(status || '').trim().toLowerCase()

  if (value === 'completed') return 'end'
  if (value === 'ongoing') return 'up'

  return 'new'
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

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover:
      story.cover_url ||
      `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    genre: String(story.main_genre || '').trim(),
    firstTag: getFirstDifferentTag(story.main_genre, story.tags),
    badge: getRealBadgeFromStoryStatus(story.story_status),
  }
}

function StatusBadge({ type }) {
  const badge = badgeConfig[type] || badgeConfig.new

  return (
    <div
      className={`absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${badge.className}`}
    >
      {badge.text}
    </div>
  )
}

function SmallBookCard({ book }) {
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
              event.currentTarget.src = '/assets/Update Today/Update Today 2.jpg'
            }}
          />
          <StatusBadge type={book.badge} />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="block w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-neutral-900">
          {book.title}
        </h3>

        <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-gray-400">
          {[book.genre, book.firstTag].filter(Boolean).join(' / ')}
        </p>
      </div>
    </Link>
  )
}

function LoadingSkeleton() {
  return (
    <section className="px-4 pb-8 pt-0 sm:px-5 lg:px-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🎉</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              Update Today
            </h2>
          </div>

          <Link
            to="/update-today"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="View all update today"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-6 md:gap-x-3 md:gap-y-5">
          {Array.from({ length: 6 }).map((_, index) => (
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

export default function UpdateTodaySection() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchPublishedStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=7&sort=updated`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load published stories')
        }

        if (ignore) return

        setStories((data.stories || []).map(normalizeStory))
      } catch (error) {
        console.error('UpdateTodaySection fetch error:', error)

        if (!ignore) {
          setStories([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchPublishedStories()

    return () => {
      ignore = true
    }
  }, [])

  const updateBooks = useMemo(() => stories.slice(0, 6), [stories])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🎉</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              Update Today
            </h2>
          </div>

          <Link
            to="/update-today"
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="View all update today"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-6 md:gap-x-3 md:gap-y-5">
          {updateBooks.map((book) => (
            <SmallBookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}

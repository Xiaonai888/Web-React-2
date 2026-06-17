import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageLabel } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

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

function isCompletedStory(story) {
  return String(story.story_status || '')
    .trim()
    .toLowerCase() === 'completed'
}

function normalizeStory(story, index = 0) {
  const totalEpisodes = Number(story.total_episodes || 0)
  const isNew = totalEpisodes === 1

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author:
      story.author_page?.page_name ||
      story.author_page?.page_username ||
      story.author_name ||
      'Shadow Author',
    badge: isNew ? 'NEW' : 'UP',
    badgeColor: isNew ? 'new' : 'up',
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
      className="group block h-full w-full text-left"
    >
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] bg-gray-100 shadow-sm">
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
            <div className="absolute bottom-2 left-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
              18+
            </div>
          ) : null}
        </div>

        <div className="mt-3 w-full">
  <h3 className="truncate text-[14px] font-medium leading-[20px] text-neutral-900 sm:line-clamp-2 sm:min-h-[44px] sm:whitespace-normal">
  {book.title}
</h3>

  <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-gray-500">
    {book.author}
  </p>
</div>
      </div>
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

export default function NewArrivalsSection() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const storyLanguage = getStoryLanguageLabel()

  useEffect(() => {
    let ignore = false

    async function fetchNewArrivals() {
      try {
        setLoading(true)
        setLoadFailed(false)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=48&sort=latest`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load new arrivals')
        }

        if (ignore) return

        const newestBooks = (data.stories || [])
          .filter((story) => Number(story.total_episodes || 0) >= 1)
          .filter((story) => !isCompletedStory(story))
          .map(normalizeStory)
          .slice(0, 5)

        setBooks(newestBooks)
      } catch (error) {
        console.error('NewArrivalsSection fetch error:', error)

        if (!ignore) {
          setLoadFailed(true)
          setBooks([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchNewArrivals()

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return <LoadingGrid />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px] lg:text-[21px]">🚀</span>
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
        <div className="grid grid-cols-3 gap-x-2 gap-y-6 lg:grid-cols-5 lg:gap-x-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(book.link)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[#f8f8fb] px-4 py-6 text-center">
          <div className="text-[14px] font-extrabold text-[#111827]">
            {loadFailed
              ? 'Could not load new arrivals'
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

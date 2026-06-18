import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'



const fallbackUpdateBooks = [
  { id: 202, title: 'Name Novel', cover: '/assets/Update Today/Update Today 2.jpg', badge: 'new', views: '100k', episodes: 'Ep 17' },
  { id: 203, title: 'Name Novel', cover: '/assets/Update Today/Update Today 3.jpg', badge: 'up', views: '100k', episodes: 'Ep 17' },
  { id: 204, title: 'Name Novel', cover: '/assets/Update Today/Update Today 4.jpg', badge: 'end', views: '100k', episodes: 'Ep 17' },
  { id: 205, title: 'Name Novel', cover: '/assets/Update Today/Update Today 5.jpg', badge: 'new', views: '100k', episodes: 'Ep 17' },
  { id: 206, title: 'Name Novel', cover: '/assets/Update Today/Update Today 6.jpg', badge: 'up', views: '100k', episodes: 'Ep 17' },
  { id: 207, title: 'Name Novel', cover: '/assets/Update Today/Update Today 7.jpg', badge: 'end', views: '100k', episodes: 'Ep 17' },
]

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

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function getRealBadgeFromStoryStatus(status) {
  const value = String(status || '').trim().toLowerCase()

  if (value === 'completed') return 'end'
  if (value === 'ongoing') return 'up'

  return 'new'
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author:
  story.author_page?.page_name ||
  story.author_page?.page_username ||
  'Shadow Author',
    cover: story.cover_url || `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    episodes: `Ep ${Number(story.total_episodes || 0)}`,
    genres: [story.main_genre, ...(story.tags || [])].filter(Boolean).slice(0, 4),
    description: story.description || 'No description yet.',
    badge: getRealBadgeFromStoryStatus(story.story_status),
    isReal: true,
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
            onError={(event) => {
              event.currentTarget.src = '/assets/Update Today/Update Today 2.jpg'
            }}
          />
          <StatusBadge type={book.badge} />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="line-clamp-1 text-[13px] font-extrabold tracking-tight text-neutral-950 sm:text-[15px] lg:text-[16px]">
          {book.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-neutral-800 sm:mt-2 sm:gap-3 sm:text-[11px] lg:text-[12px]">
          <div className="flex min-w-0 items-center gap-1">
            <i className="fas fa-eye text-[10px] text-black sm:text-[11px]" />
            <span className="leading-none">{book.views}</span>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <i className="fas fa-list text-[10px] text-black sm:text-[11px]" />
            <span className="leading-none">{book.episodes}</span>
          </div>
        </div>
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
  addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=7&sort=updated`)
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

  const updateBooks = useMemo(() => {
  if (stories.length) {
    return stories.slice(0, 6)
  }

  return fallbackUpdateBooks
}, [stories])

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



        <div className="grid grid-cols-3 gap-x-2 gap-y-6 md:grid-cols-6 md:gap-x-3 md:gap-y-8">
          {updateBooks.map((book) => (
            <SmallBookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}

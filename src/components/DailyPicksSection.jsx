import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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

function createDailySeed() {
  const today = new Date()

  return (
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate()
  )
}

function createSeededRandom(seed) {
  let value = seed % 2147483647

  if (value <= 0) {
    value += 2147483646
  }

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function selectDailyStories(stories, limit = 6) {
  const eligibleStories = stories.filter(
    (story) => Number(story.total_episodes || 0) >= 1
  )

  const selectedStories = [...eligibleStories]
  const random = createSeededRandom(createDailySeed())

  for (let index = selectedStories.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))

    ;[selectedStories[index], selectedStories[randomIndex]] = [
      selectedStories[randomIndex],
      selectedStories[index],
    ]
  }

  return selectedStories.slice(0, limit)
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image:
      story.landscape_thumbnail_url ||
      story.cover_url ||
      `/assets/Trending%20Now/Trending%20${Math.min(index + 1, 18)}.jpg`,
    genre: story.main_genre || '',
    heat: formatCompactNumber(story.total_likes),
    isAdult: Boolean(story.is_adult),
  }
}

function FireOutlineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22c4.4 0 8-3.1 8-8 0-2.1-.8-4.1-2-5.5 0 2.5-1.5 4-3 4.5.5-4-2-8-6-11 0 3.5-2 5.5-3.5 7C4 10.5 4 12.5 4 14c0 4.9 3.6 8 8 8Z" />
      <path d="M9.5 17.5c0 1.5 1.1 2.5 2.5 2.5s2.5-1 2.5-2.5c0-1-.5-1.9-1.3-2.6 0 1-.6 1.6-1.2 1.8.1-1.5-.8-2.8-2.1-3.8.1 1.5-.4 2.4-.4 4.6Z" />
    </svg>
  )
}

function DailyPickCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative aspect-[1.42/1] overflow-hidden rounded-[8px] bg-[#202124] shadow-sm">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />

        {book.isAdult ? (
          <div className="absolute left-2 top-2 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
            18+
          </div>
        ) : null}
      </div>

      <div className="mt-2 min-w-0">
        <h3 className="block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
          {book.title}
        </h3>

        <div className="mt-1.5 flex min-h-[22px] items-center gap-2">
  {book.genre ? (
    <span className="inline-flex max-w-full truncate rounded-[4px] bg-[#FFF4BF] px-2 py-1 text-[10px] font-medium leading-none text-[#9A6700]">
      {book.genre}
    </span>
  ) : null}

  <div className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#4B5563]">
    <span className="text-[#EF4444]">
      <FireOutlineIcon />
    </span>

    <span>{book.heat}</span>
  </div>
</div>
              </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <section className="px-3 pb-2 md:px-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded-full bg-gray-100" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-6 md:gap-x-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[1.42/1] animate-pulse rounded-[8px] bg-gray-100" />
            <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded-[4px] bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DailyPicksSection() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchDailyPicks() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=24&sort=likes`
          )
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load daily picks')
        }

        if (!ignore) {
          const dailyStories = selectDailyStories(data.stories || [], 6)
          setStories(dailyStories.map(normalizeStory))
        }
      } catch (error) {
        console.error('DailyPicksSection fetch error:', error)

        if (!ignore) {
          setStories([])
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchDailyPicks()

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return <LoadingGrid />
  }

  if (!stories.length) {
    return null
  }

  return (
    <section className="px-3 pb-2 md:px-4">
      <div className="mb-4 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <span className="text-[20px] lg:text-[21px]">📚</span>

    <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
      Daily Picks
    </h2>
  </div>

        <Link
          to="/discover"
          className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
          aria-label="View more recommendations"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-6 md:gap-x-3">
        {stories.map((book) => (
          <DailyPickCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}

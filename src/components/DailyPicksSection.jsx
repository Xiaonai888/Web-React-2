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

function seededShuffle(items, seed = createDailySeed()) {
  const selectedItems = [...items]
  const random = createSeededRandom(seed)

  for (let index = selectedItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    ;[selectedItems[index], selectedItems[randomIndex]] = [
      selectedItems[randomIndex],
      selectedItems[index],
    ]
  }

  return selectedItems
}

function getStoryViews(story) {
  return Number(story.total_views || 0)
}

function getStoryLikes(story) {
  return Number(story.total_likes || 0)
}

function getStoryEpisodes(story) {
  return Number(story.total_episodes || 0)
}

function hasStoryCover(story) {
  return Boolean(story.cover_url || story.landscape_thumbnail_url)
}

function isEligibleStory(story) {
  return getStoryEpisodes(story) >= 1 && hasStoryCover(story)
}

function uniqueStories(stories) {
  const seenIds = new Set()

  return stories.filter((story) => {
    if (!story?.id || seenIds.has(story.id)) return false
    seenIds.add(story.id)
    return true
  })
}

function pickUnique(source, count, usedIds) {
  const picked = []

  for (const story of source) {
    if (!story?.id || usedIds.has(story.id)) continue

    usedIds.add(story.id)
    picked.push(story)

    if (picked.length >= count) break
  }

  return picked
}

function selectDailyStories(allStories, limit = 6) {
  const eligibleStories = uniqueStories(allStories).filter(isEligibleStory)
  const usedIds = new Set()

  const popularStories = seededShuffle(
    [...eligibleStories].sort((a, b) => getStoryLikes(b) - getStoryLikes(a)),
    createDailySeed() + 11
  )

  const hiddenGemStories = seededShuffle(
    [...eligibleStories]
      .filter((story) => getStoryViews(story) <= 250 || getStoryLikes(story) <= 5)
      .sort((a, b) => {
        const viewDiff = getStoryViews(a) - getStoryViews(b)
        if (viewDiff !== 0) return viewDiff
        return getStoryLikes(b) - getStoryLikes(a)
      }),
    createDailySeed() + 22
  )

  const freshStories = seededShuffle(
    [...eligibleStories].sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0).getTime()
      const dateB = new Date(b.updated_at || b.created_at || 0).getTime()
      return dateB - dateA
    }),
    createDailySeed() + 33
  )

  const pickedStories = [
    ...pickUnique(popularStories, 3, usedIds),
    ...pickUnique(hiddenGemStories, 2, usedIds),
    ...pickUnique(freshStories, 1, usedIds),
  ]

  if (pickedStories.length < limit) {
    pickedStories.push(
      ...pickUnique(
        seededShuffle(eligibleStories, createDailySeed() + 44),
        limit - pickedStories.length,
        usedIds
      )
    )
  }

  return pickedStories.slice(0, limit)
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

function FireSolidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
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
              <FireSolidIcon />
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

      <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-6 md:gap-x-3 md:gap-y-5">
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

        const [popularResponse, updatedResponse] = await Promise.all([
          fetch(
            addStoryLanguageParam(
              `${API_BASE_URL}/api/public/stories?limit=36&sort=likes`
            )
          ),
          fetch(
            addStoryLanguageParam(
              `${API_BASE_URL}/api/public/stories?limit=60&sort=updated`
            )
          ),
        ])

        const [popularData, updatedData] = await Promise.all([
          popularResponse.json().catch(() => ({})),
          updatedResponse.json().catch(() => ({})),
        ])

        if (!popularResponse.ok || popularData.ok === false) {
          throw new Error(popularData.message || 'Failed to load popular daily picks')
        }

        if (!updatedResponse.ok || updatedData.ok === false) {
          throw new Error(updatedData.message || 'Failed to load updated daily picks')
        }

        if (!ignore) {
          const dailyStories = selectDailyStories(
            [...(popularData.stories || []), ...(updatedData.stories || [])],
            6
          )

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
          <span className="text-[20px] lg:text-[21px]">📖</span>

          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
            Daily Picks
          </h2>
        </div>

        <Link
          to="/daily-picks"
          className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
          aria-label="View all Daily Picks"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-6 md:gap-x-3 md:gap-y-5">
        {stories.map((book) => (
          <DailyPickCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}

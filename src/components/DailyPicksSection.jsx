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

const FOUR_HOUR_MS = 4 * 60 * 60 * 1000
const SEVEN_DAY_MS = 7 * 24 * 60 * 60 * 1000

function createRotationSeed() {
  const now = new Date()
  const localTime =
    now.getTime() - now.getTimezoneOffset() * 60 * 1000

  return Math.floor(localTime / FOUR_HOUR_MS)
}

function createSeededRandom(seed) {
  let value = seed % 2147483647

  if (value <= 0) value += 2147483646

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function seededShuffle(items, seed) {
  const selectedItems = [...items]
  const random = createSeededRandom(seed)

  for (
    let index = selectedItems.length - 1;
    index > 0;
    index -= 1
  ) {
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

function getStoryEpisodes(story) {
  return Number(story.total_episodes || 0)
}

function getStoryActivityTime(story) {
  const value =
    story.last_episode_published_at ||
    story.updated_at ||
    story.created_at

  const time = value ? new Date(value).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

function getStoryCreatedTime(story) {
  const time = new Date(story.created_at || 0).getTime()
  return Number.isFinite(time) ? time : 0
}

function hasStoryCover(story) {
  return Boolean(
    story.cover_url || story.landscape_thumbnail_url
  )
}

function isCompletedStory(story) {
  const status = String(story.story_status || '')
    .trim()
    .toLowerCase()

  return (
    story.is_completed === true ||
    ['completed', 'complete', 'end', 'ended', 'finished'].includes(
      status
    )
  )
}

function isRecentlyUpdatedStory(story) {
  const time = getStoryActivityTime(story)
  const now = Date.now()

  return (
    time > 0 &&
    time <= now &&
    now - time <= SEVEN_DAY_MS
  )
}

function isEligibleStory(story) {
  return (
    getStoryEpisodes(story) >= 1 &&
    hasStoryCover(story) &&
    (
      isCompletedStory(story) ||
      isRecentlyUpdatedStory(story)
    )
  )
}

function uniqueStories(stories) {
  const seenIds = new Set()

  return stories.filter((story) => {
    const id = String(story?.id || '')

    if (!id || seenIds.has(id)) return false

    seenIds.add(id)
    return true
  })
}

function pickUnique(source, count, usedIds) {
  const picked = []

  for (const story of source) {
    const id = String(story?.id || '')

    if (!id || usedIds.has(id)) continue

    usedIds.add(id)
    picked.push(story)

    if (picked.length >= count) break
  }

  return picked
}

function buildSelection(
  allStories,
  limit,
  seed,
  blockedIds = new Set()
) {
  const eligibleStories = uniqueStories(allStories)
    .filter(isEligibleStory)
    .filter(
      (story) =>
        !blockedIds.has(String(story.id))
    )

  const scale = Math.max(1, Math.ceil(limit / 6))
  const usedIds = new Set()

  const freshStories = seededShuffle(
    [...eligibleStories]
      .sort(
        (a, b) =>
          getStoryCreatedTime(b) -
          getStoryCreatedTime(a)
      )
      .slice(0, 24),
    seed + 11
  )

  const hiddenGemStories = seededShuffle(
    [...eligibleStories]
      .filter((story) => getStoryViews(story) <= 250)
      .sort(
        (a, b) =>
          getStoryViews(a) - getStoryViews(b) ||
          getStoryActivityTime(b) -
            getStoryActivityTime(a)
      )
      .slice(0, 24),
    seed + 22
  )

  const recentStories = seededShuffle(
    [...eligibleStories]
      .filter((story) => !isCompletedStory(story))
      .sort(
        (a, b) =>
          getStoryActivityTime(b) -
          getStoryActivityTime(a)
      )
      .slice(0, 24),
    seed + 33
  )

  const completedStories = seededShuffle(
    [...eligibleStories]
      .filter(isCompletedStory)
      .sort(
        (a, b) =>
          getStoryViews(a) - getStoryViews(b)
      )
      .slice(0, 24),
    seed + 44
  )

  const pickedStories = [
    ...pickUnique(freshStories, 2 * scale, usedIds),
    ...pickUnique(hiddenGemStories, 2 * scale, usedIds),
    ...pickUnique(recentStories, scale, usedIds),
    ...pickUnique(completedStories, scale, usedIds),
  ]

  if (pickedStories.length < limit) {
    pickedStories.push(
      ...pickUnique(
        seededShuffle(eligibleStories, seed + 55),
        limit - pickedStories.length,
        usedIds
      )
    )
  }

  return pickedStories.slice(0, limit)
}

function selectDailyStories(
  allStories,
  limit = 6,
  seed = createRotationSeed()
) {
  const previousStories = buildSelection(
    allStories,
    limit,
    seed - 1
  )

  const previousIds = new Set(
    previousStories.map((story) => String(story.id))
  )

  const selectedStories = buildSelection(
    allStories,
    limit,
    seed,
    previousIds
  )

  const usedIds = new Set(
    selectedStories.map((story) => String(story.id))
  )

  if (selectedStories.length < limit) {
    const fallbackStories = buildSelection(
      allStories,
      limit,
      seed
    )

    selectedStories.push(
      ...pickUnique(
        fallbackStories,
        limit - selectedStories.length,
        usedIds
      )
    )
  }

  if (selectedStories.length > 1) {
    const shift = Math.abs(seed) % selectedStories.length

    return [
      ...selectedStories.slice(shift),
      ...selectedStories.slice(0, shift),
    ].slice(0, limit)
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
          <div className="absolute left-2 top-2 rounded-full bg-[#e5484d] px-2.5 py-1 text-[10px] font-extrabold text-white">
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

export default function DailyPicksSection({
  storyType = '',
}) {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [rotationSeed, setRotationSeed] =
  useState(createRotationSeed())

  const normalizedStoryType = String(storyType || '')
    .trim()
    .toLowerCase()

  useEffect(() => {
    let ignore = false

    async function fetchDailyPicks() {
      try {
        setLoading(true)

        const storyTypeQuery = normalizedStoryType
          ? `&story_type=${encodeURIComponent(
              normalizedStoryType
            )}`
          : ''

        const [popularResponse, updatedResponse] =
          await Promise.all([
            fetch(
              addStoryLanguageParam(
                `${API_BASE_URL}/api/public/stories?limit=36&sort=likes${storyTypeQuery}`
              )
            ),
            fetch(
              addStoryLanguageParam(
                `${API_BASE_URL}/api/public/stories?limit=60&sort=updated${storyTypeQuery}`
              )
            ),
          ])

        const [popularData, updatedData] =
          await Promise.all([
            popularResponse.json().catch(() => ({})),
            updatedResponse.json().catch(() => ({})),
          ])

        if (
          !popularResponse.ok ||
          popularData.ok === false
        ) {
          throw new Error(
            popularData.message ||
            'Failed to load popular daily picks'
          )
        }

        if (
          !updatedResponse.ok ||
          updatedData.ok === false
        ) {
          throw new Error(
            updatedData.message ||
            'Failed to load updated daily picks'
          )
        }

        if (!ignore) {
          const sourceStories = [
            ...(popularData.stories || []),
            ...(updatedData.stories || []),
          ].filter(
            (story) =>
              !normalizedStoryType ||
              String(story?.story_type || '')
                .trim()
                .toLowerCase() ===
                normalizedStoryType
          )

          const dailyStories = selectDailyStories(
            sourceStories,
            6
          )

          setStories(
            dailyStories.map(normalizeStory)
          )
        }
      } catch (error) {
        console.error(
          'DailyPicksSection fetch error:',
          error
        )

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
  }, [normalizedStoryType])

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
          <span className="text-[20px] lg:text-[21px]">
            📖
          </span>

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
          <DailyPickCard
            key={book.id}
            book={book}
          />
        ))}
      </div>
    </section>
  )
}

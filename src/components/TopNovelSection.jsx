import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const lockedTopNovelCategories = ['Completed', 'Recently Completed']

const fallbackTopNovelCategories = [
  'Romance',
  'Fantasy',
  'Investigation',
  ...lockedTopNovelCategories,
]

function getWeekSeed() {
  const now = new Date()
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
  const pastDaysOfYear = Math.floor((now - firstDayOfYear) / 86400000)
  return `${now.getFullYear()}-${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`
}

function seededRandom(seed) {
  let hash = 0

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }

  return () => {
    hash = (hash * 1664525 + 1013904223) | 0
    return Math.abs(hash / 2147483647)
  }
}

function getWeeklyRandomGenres(genres) {
  const genreNames = (genres || [])
    .map((genre) => genre.name)
    .filter(Boolean)
    .filter((name) => !lockedTopNovelCategories.includes(name))

  const random = seededRandom(getWeekSeed())
  const shuffled = [...genreNames].sort(() => random() - 0.5)
  const selectedGenres = shuffled.slice(0, 3)

  return [
    ...(selectedGenres.length ? selectedGenres : fallbackTopNovelCategories.slice(0, 3)),
    ...lockedTopNovelCategories,
  ]
}

function getTopNovelEndpoint(category) {
  if (category === 'Completed') {
    return '/api/public/stories?limit=3&sort=popular'
  }

  if (category === 'Recently Completed') {
    return '/api/public/stories?limit=3&sort=updated'
  }

  return `/api/public/stories?limit=3&sort=likes&genre=${encodeURIComponent(category)}`
}

function getTopNovelBadge(rank) {
  return `/assets/Top%20Novel%20Badge/Top%20Novel%20Badge%20${rank}.svg?v=3`
}

function createFallbackBooks(category) {
  return [1, 2, 3].map((rank) => ({
    id: `fallback-${category}-${rank}`,
    rank,
    title: `${category} Top ${rank}`,
    author: 'Shadow Author',
    views: rank === 1 ? '100k' : rank === 2 ? '88k' : '72k',
    likes: rank === 1 ? '1000' : rank === 2 ? '860' : '740',
    description: `Top weekly ${category} story preview.`,
    image: '',
    link: '/',
    isAdult: false,
    genre: category,
    isFallback: true,
  }))
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0) {
  const rank = index + 1

  return {
    id: story.id,
    rank,
    title: story.title || 'Untitled Story',
    author: story.author_name || 'Shadow Author',
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    description: story.description || 'No description yet.',
    image: story.cover_url || '',
    link: `/story/${story.id}`,
    isAdult: Boolean(story.is_adult),
    genre: story.main_genre || '',
    isFallback: false,
  }
}

function RankBadge({ rank }) {
  const [imageError, setImageError] = useState(false)

  if (!imageError) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
        <img
          src={getTopNovelBadge(rank)}
          alt={`Rank ${rank}`}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#111827] text-2xl font-black text-white">
      {rank}
    </div>
  )
}

function SafeBookCover({ src, title, rank }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = typeof src === 'string' && src.trim() !== '' && !imageFailed

  if (hasImage) {
    return (
      <img
        src={src}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#111827] to-[#4c1d95] px-3 text-center text-white">
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/60">Top {rank}</div>
      <div className="mt-1 line-clamp-3 text-[13px] font-black leading-tight">{title}</div>
    </div>
  )
}

function LoadingTopNovel() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-7 w-40 animate-pulse rounded-full bg-gray-100" />
        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mb-5 flex gap-3 overflow-hidden">
        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-32 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex w-full items-start gap-4">
            <div className="mt-5 h-14 w-14 shrink-0 animate-pulse rounded-full bg-gray-100" />
            <div className="h-[128px] w-[88px] shrink-0 animate-pulse rounded-xl bg-gray-100" />
            <div className="min-w-0 flex-1 pt-1">
              <div className="h-6 w-3/4 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-gray-100" />
              <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function TopNovelSection() {
  const navigate = useNavigate()
  const [categoryTabs, setCategoryTabs] = useState(fallbackTopNovelCategories)
  const [activeCategory, setActiveCategory] = useState(fallbackTopNovelCategories[0])
  const [realDataByCategory, setRealDataByCategory] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchWeeklyGenres() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/genres`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load genres')
        }

        const nextTabs = getWeeklyRandomGenres(data.genres)

        if (!ignore && nextTabs.length) {
          setCategoryTabs(nextTabs)
          setActiveCategory((current) => (nextTabs.includes(current) ? current : nextTabs[0]))
        }
      } catch (error) {
        console.error('TopNovelSection genres fetch error:', error)
      }
    }

    fetchWeeklyGenres()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchTopNovelCategory() {
      try {
        if (realDataByCategory[activeCategory]) return

        setLoading(true)

        const endpoint = getTopNovelEndpoint(activeCategory)
        const response = await fetch(addStoryLanguageParam(`${API_BASE_URL}${endpoint}`))
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || `Failed to load ${activeCategory}`)
        }

        const stories = (data.stories || []).map(normalizeStory)
        const nextStories = stories.length ? stories : createFallbackBooks(activeCategory)

        if (!ignore) {
          setRealDataByCategory((current) => ({
            ...current,
            [activeCategory]: nextStories,
          }))
        }
      } catch (error) {
        console.error('TopNovelSection fetch error:', error)

        if (!ignore) {
          setRealDataByCategory((current) => ({
            ...current,
            [activeCategory]: createFallbackBooks(activeCategory),
          }))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchTopNovelCategory()

    return () => {
      ignore = true
    }
  }, [activeCategory, realDataByCategory])

  const filteredData = useMemo(() => {
    return realDataByCategory[activeCategory] || createFallbackBooks(activeCategory)
  }, [activeCategory, realDataByCategory])

  if (loading && !realDataByCategory[activeCategory]) {
    return <LoadingTopNovel />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[22px]">🏆</span>
          <h2 className="text-[22px] font-extrabold tracking-tight text-neutral-900">
            Top Novel
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/top-novel')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100"
          aria-label="Go to Top Novel page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categoryTabs.map((category) => {
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'border-[#111827] bg-[#111827] text-white'
                  : 'border-neutral-300 bg-white text-[#111827] hover:border-[#111827] hover:bg-[#111827] hover:text-white'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="space-y-5">
        {filteredData.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (!item.isFallback) {
                navigate(item.link)
              }
            }}
            className="flex w-full items-start gap-4 text-left"
          >
            <div className="pt-5">
              <RankBadge rank={item.rank} />
            </div>

            <div className="relative h-[128px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
              <SafeBookCover src={item.image} title={item.title} rank={item.rank} />

              {item.isAdult ? (
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-extrabold text-[#e5484d]">
                  18+
                </div>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h3 className="line-clamp-1 text-[20px] font-extrabold leading-tight text-[#6b1028]">
                {item.title}
              </h3>

              <p className="mt-1 line-clamp-1 text-[15px] font-bold text-neutral-900">
                {item.author}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-blue-700">
                  <span>👁️</span>
                  <span className="font-semibold">{item.views}</span>
                </div>

                <div className="flex items-center gap-1.5 text-red-600">
                  <span>❤️</span>
                  <span className="font-semibold">{item.likes}</span>
                </div>

                {item.genre ? (
                  <div className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">
                    {item.genre}
                  </div>
                ) : null}
              </div>

              <p className="mt-2 line-clamp-3 text-[14px] leading-7 text-neutral-800">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const rankingTabs = [
  {
    label: 'Best Sellers',
    endpoint: '/api/public/stories?limit=6&sort=popular',
  },
  {
    label: 'Most Reads',
    endpoint: '/api/public/stories?limit=6&sort=trending',
  },
  {
    label: 'Rising Stars',
    endpoint: '/api/public/stories?limit=6&sort=updated',
  },
  {
    label: 'Romance',
    endpoint: '/api/public/stories?limit=6&sort=popular&genre=Romance',
  },
  {
    label: 'LGBTQ+',
    endpoint: '/api/public/stories?limit=48&sort=popular',
    filter: isLgbtqStory,
  },
  {
    label: 'Completed',
    endpoint: '/api/public/stories?limit=48&sort=popular',
    filter: isCompletedStory,
  },
]

function isCompletedStory(story) {
  return String(story?.story_status || '').trim().toLowerCase() === 'completed'
}

function isLgbtqStory(story) {
  const tags = Array.isArray(story?.tags) ? story.tags : []
  const text = [story?.main_genre, story?.description, ...tags].filter(Boolean).join(' ').toLowerCase()

  return ['lgbtq', 'lgbt', 'bl', 'gl', 'boys love', 'girls love', 'boy love', 'girl love', 'queer', 'yaoi', 'yuri'].some((keyword) =>
    text.includes(keyword)
  )
}

function getActiveTabConfig(label) {
  return rankingTabs.find((tab) => tab.label === label) || rankingTabs[0]
}

function getRankLabel(rank) {
  return String(rank).padStart(2, '0')
}

function getRankBadgeClass(rank) {
  if (rank === 1) return 'bg-[#facc15] text-[#111827]'
  if (rank === 2) return 'bg-[#ef4444] text-white'
  if (rank === 3) return 'bg-[#f97316] text-white'

  return 'bg-[#6b7280] text-white'
}

function createFallbackBooks(category) {
  return Array.from({ length: 6 }).map((_, index) => ({
    id: `fallback-${category}-${index + 1}`,
    rank: index + 1,
    title: `${category} ${index + 1}`,
    image: '',
    link: '/',
    genre: category,
    isFallback: true,
  }))
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    rank: index + 1,
    title: story.title || 'Untitled Story',
    image: story.cover_url || '',
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isFallback: false,
  }
}

function RankBadge({ rank }) {
  return (
    <div className={`absolute -left-px -top-px z-10 flex h-[26px] min-w-[28px] items-center justify-center rounded-tl-[8px] rounded-br-[10px] px-1.5 text-[10px] font-extrabold leading-none shadow-sm ${getRankBadgeClass(rank)}`}>
      {getRankLabel(rank)}
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
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f3f4f6] to-[#d1d5db] text-[11px] font-extrabold text-gray-500">
      #{rank}
    </div>
  )
}

function RankingBookCard({ item, onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="group flex h-[104px] w-full items-center gap-3 text-left">
  <div className="relative h-[104px] w-[72px] shrink-0 overflow-hidden rounded-[8px] bg-gray-100 shadow-sm">
        <SafeBookCover src={item.image} title={item.title} rank={item.rank} />
        <RankBadge rank={item.rank} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 whitespace-normal break-words text-[14px] font-[640] leading-[18px] text-neutral-900">
          {item.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-gray-500">
          {item.genre || 'Ranking'}
        </p>
      </div>
    </button>
  )
}

function CompactRankingCover({ item, onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="group relative block h-[104px] w-[72px] overflow-hidden rounded-[8px] bg-gray-100 shadow-sm active:scale-[0.98]">
      <SafeBookCover src={item.image} title={item.title} rank={item.rank} />
      <RankBadge rank={item.rank} />
    </button>
  )
}

function LoadingRanking() {
  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🏆</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              Ranking
            </h2>
          </div>

          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
        </div>

        <div className="mb-5 flex gap-2 overflow-hidden">
          {rankingTabs.slice(0, 4).map((tab) => (
            <div key={tab.label} className="h-[34px] w-24 animate-pulse rounded-full bg-gray-100" />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-5 md:grid-cols-6 md:gap-x-3">
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

export default function TopNovelSection() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(rankingTabs[0].label)
  const [realDataByCategory, setRealDataByCategory] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchRankingCategory() {
      try {
        if (realDataByCategory[activeCategory]) return

        setLoading(true)

        const tab = getActiveTabConfig(activeCategory)
        const response = await fetch(addStoryLanguageParam(`${API_BASE_URL}${tab.endpoint}`))
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || `Failed to load ${activeCategory}`)
        }

        const rows = Array.isArray(data.stories) ? data.stories : []
        const filteredRows = tab.filter ? rows.filter(tab.filter) : rows
        const stories = filteredRows.slice(0, 6).map(normalizeStory)
        const nextStories = stories.length ? stories : createFallbackBooks(activeCategory)

        if (!ignore) {
          setRealDataByCategory((current) => ({
            ...current,
            [activeCategory]: nextStories,
          }))
        }
      } catch (error) {
        console.error('Ranking section fetch error:', error)

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

    fetchRankingCategory()

    return () => {
      ignore = true
    }
  }, [activeCategory, realDataByCategory])

  const filteredData = useMemo(() => {
    return realDataByCategory[activeCategory] || createFallbackBooks(activeCategory)
  }, [activeCategory, realDataByCategory])

  const topThreeStories = useMemo(() => filteredData.slice(0, 3), [filteredData])
const sideStories = useMemo(() => filteredData.slice(3, 6), [filteredData])

  if (loading && !realDataByCategory[activeCategory]) {
    return <LoadingRanking />
  }

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] lg:text-[21px]">🏆</span>
            <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
              Ranking
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ranking')}
            className="flex h-8 w-8 items-center justify-end rounded-full transition-colors hover:bg-gray-100"
            aria-label="Go to Ranking page"
          >
            <i className="fas fa-chevron-right text-[15px] text-gray-700 lg:text-[16px]" />
          </button>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-y_pan-x] [&::-webkit-scrollbar]:hidden">
          {rankingTabs.map((tab) => {
            const isActive = activeCategory === tab.label

            return (
              <button
  key={tab.label}
  type="button"
  onClick={() => setActiveCategory(tab.label)}
  className={`relative inline-flex h-[34px] shrink-0 items-center px-1.5 text-[13px] leading-none transition-colors active:scale-[0.98] ${
    isActive
      ? 'font-extrabold text-[#111827]'
      : 'font-[560] text-[#6b7280]'
  }`}
>
  {tab.label}
  <span
    className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#facc15] transition-all duration-200 ${
      isActive ? 'w-[70%] opacity-100' : 'w-0 opacity-0'
    }`}
  />
</button>
            )
          })}
        </div>

       <div className="-mr-4 grid grid-cols-[minmax(0,1fr)_72px] gap-2 sm:-mr-5 lg:-mr-6">
  <div className="grid grid-rows-3 gap-1.5">
    {topThreeStories.map((item) => (
      <RankingBookCard key={item.id} item={item} onOpen={() => {
        if (!item.isFallback) navigate(item.link)
      }} />
    ))}
  </div>

  <div className="grid grid-rows-3 gap-1.5">
    {sideStories.map((item) => (
      <CompactRankingCover key={item.id} item={item} onOpen={() => {
        if (!item.isFallback) navigate(item.link)
      }} />
    ))}
  </div>
        </div>
      </div>
    </section>
  )
}

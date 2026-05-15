import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const topNovelCategories = [
  'Romance',
  'Fantasy',
  'Investigation',
  'Completed',
  'Recently Completed',
]

const queryByCategory = {
  Romance: '/api/public/stories?limit=30&sort=likes&genre=Romance',
  Fantasy: '/api/public/stories?limit=30&sort=likes&genre=Fantasy',
  Investigation: '/api/public/stories?limit=30&sort=popular&genre=Mystery',
  Completed: '/api/public/stories?limit=30&sort=popular',
  'Recently Completed': '/api/public/stories?limit=30&sort=updated',
}

const fallbackTopNovelData = [
  {
    id: 1,
    rank: 1,
    title: 'Name book',
    author: 'Author Name',
    views: '100k',
    likes: '1000',
    description:
      "After looking around, I saw that there were monsters moving towards me. This time, it wasn't just humans anymore, but all kinds of monsters and zombie plants.",
    image: '/assets/top-novel/top-1.jpg',
    category: 'Romance',
    link: '/story/1',
    genre: 'Romance',
    isAdult: false,
  },
  {
    id: 2,
    rank: 2,
    title: 'Name book',
    author: 'Author Name',
    views: '100k',
    likes: '1000',
    description:
      "After looking around, I saw that there were monsters moving towards me. This time, it wasn't just humans anymore, but all kinds of monsters and zombie plants.",
    image: '/assets/top-novel/top-2.jpg',
    category: 'Romance',
    link: '/story/2',
    genre: 'Romance',
    isAdult: false,
  },
  {
    id: 3,
    rank: 3,
    title: 'Name book',
    author: 'Author Name',
    views: '100k',
    likes: '1000',
    description:
      "After looking around, I saw that there were monsters moving towards me. This time, it wasn't just humans anymore, but all kinds of monsters and zombie plants.",
    image: '/assets/top-novel/top-3.jpg',
    category: 'Romance',
    link: '/story/3',
    genre: 'Romance',
    isAdult: false,
  },
]

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0, category = 'Romance') {
  return {
    id: story.id,
    rank: index + 1,
    title: story.title || 'Untitled Story',
    author: story.author_name || 'Shadow Author',
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    description: story.description || 'No description yet.',
    image: story.cover_url || `/assets/top-novel/top-${((index % 3) + 1)}.jpg`,
    category,
    link: `/story/${story.id}`,
    genre: story.main_genre || '',
    isAdult: Boolean(story.is_adult),
  }
}

function RankBadge({ rank }) {
  const styles = {
    1: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 text-white shadow-[0_6px_16px_rgba(217,119,6,0.35)]',
    2: 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 text-white shadow-[0_6px_16px_rgba(100,116,139,0.30)]',
    3: 'bg-gradient-to-br from-amber-200 via-orange-400 to-amber-700 text-white shadow-[0_6px_16px_rgba(180,83,9,0.30)]',
  }

  return (
    <div
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[28px] font-black ${styles[rank] || 'bg-neutral-900 text-white shadow-[0_6px_16px_rgba(17,24,39,0.18)]'}`}
    >
      {rank}
    </div>
  )
}

function LoadingList() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex w-full items-start gap-4">
          <div className="mt-5 h-16 w-16 shrink-0 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-[132px] w-[92px] shrink-0 animate-pulse rounded-xl bg-neutral-200" />
          <div className="min-w-0 flex-1 pt-1">
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
            <div className="mt-3 h-16 w-full animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onRefresh }) {
  return (
    <div className="rounded-[24px] bg-white px-5 py-12 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <i className="fa-solid fa-trophy text-[24px]" />
      </div>

      <h2 className="mt-4 text-[18px] font-extrabold text-neutral-900">
        No top novels yet
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6 text-neutral-500">
        Published stories will appear here after authors publish episodes.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
      >
        Refresh
      </button>
    </div>
  )
}

export default function TopNovelPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('Romance')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [dataByCategory, setDataByCategory] = useState({})

  async function fetchTopNovelPageData() {
    try {
      setLoading(true)
      setMessage('')

      const results = await Promise.all(
        topNovelCategories.map(async (category) => {
          const endpoint = queryByCategory[category] || '/api/public/stories?limit=30&sort=popular'
          const response = await fetch(`${API_BASE_URL}${endpoint}`)
          const data = await response.json().catch(() => ({}))

          if (!response.ok || data.ok === false) {
            throw new Error(data.message || `Failed to load ${category}`)
          }

          return [category, (data.stories || []).map((story, index) => normalizeStory(story, index, category))]
        })
      )

      setDataByCategory(Object.fromEntries(results))
    } catch (error) {
      console.error('TopNovelPage fetch error:', error)
      setDataByCategory({})
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please try again later.'
          : error.message || 'Failed to load top novels'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopNovelPageData()
  }, [])

  const filteredData = useMemo(() => {
    const realList = dataByCategory[activeCategory]
    if (realList?.length) return realList
    if (message) return []
    return fallbackTopNovelData.filter((item) => item.category === activeCategory)
  }, [activeCategory, dataByCategory, message])

  return (
    <main className="min-h-screen bg-[#f7f7f8] pb-24">
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-4 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800"
            aria-label="Go back"
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-[22px]">🏆</span>
            <h1 className="line-clamp-1 text-[22px] font-extrabold tracking-tight text-neutral-900">
              Top Novel
            </h1>
          </div>

          <button
            type="button"
            onClick={fetchTopNovelPageData}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800"
            aria-label="Refresh"
          >
            <i className="fa-solid fa-rotate-right text-[15px]" />
          </button>
        </div>
      </div>

      <section className="px-4 py-5 sm:px-5 lg:px-6">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {topNovelCategories.map((category) => {
            const isActive = activeCategory === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <LoadingList />
        ) : filteredData.length ? (
          <div className="space-y-6">
            {filteredData.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.link)}
                className="flex w-full items-start gap-4 text-left"
              >
                <div className="pt-5">
                  <RankBadge rank={item.rank} />
                </div>

                <div className="relative h-[132px] w-[92px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = '/assets/top-novel/top-1.jpg'
                    }}
                  />

                  {item.isAdult ? (
                    <div className="absolute bottom-1.5 left-1.5 rounded-full bg-[#fff1f1] px-2 py-0.5 text-[9px] font-extrabold text-[#e5484d]">
                      18+
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <h2 className="line-clamp-1 text-[22px] font-extrabold leading-tight text-[#6b1028]">
                    {item.title}
                  </h2>

                  <p className="mt-1 line-clamp-1 text-[16px] font-bold text-neutral-900">
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
                      <div className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-neutral-500">
                        {item.genre}
                      </div>
                    ) : null}
                  </div>

                  <p className="mt-2 line-clamp-4 text-[14px] leading-7 text-neutral-800">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState onRefresh={fetchTopNovelPageData} />
        )}
      </section>
    </main>
  )
}

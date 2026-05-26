import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

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
  Romance: '/api/public/stories?limit=3&sort=likes&genre=Romance',
  Fantasy: '/api/public/stories?limit=3&sort=likes&genre=Fantasy',
  Investigation: '/api/public/stories?limit=3&sort=popular&genre=Mystery',
  Completed: '/api/public/stories?limit=3&sort=popular',
  'Recently Completed': '/api/public/stories?limit=3&sort=updated',
}

const fallbackDataByCategory = {
  Romance: [
    {
      id: 1,
      rank: 1,
      title: 'Love Beyond Fate',
      author: 'Aria Moon',
      views: '100k',
      likes: '1000',
      description:
        'A romance story about two people tied together by fate, secrets, and impossible choices.',
      image: '/assets/top-novel/top-1.jpg',
      link: '/story/1',
      rankIcon: '',
    },
    {
      id: 2,
      rank: 2,
      title: 'My Hidden Heart',
      author: 'Elin Hart',
      views: '88k',
      likes: '860',
      description:
        'She kept her feelings hidden for years until one moment changed everything.',
      image: '/assets/top-novel/top-2.jpg',
      link: '/story/2',
      rankIcon: '',
    },
    {
      id: 3,
      rank: 3,
      title: 'Falling for You Again',
      author: 'Nora Bell',
      views: '72k',
      likes: '740',
      description:
        'A second-chance romance where old love returns in the most unexpected way.',
      image: '/assets/top-novel/top-3.jpg',
      link: '/story/3',
      rankIcon: '',
    },
  ],

  Fantasy: [
    {
      id: 4,
      rank: 1,
      title: 'Dragon Crown',
      author: 'Rin Sol',
      views: '120k',
      likes: '1300',
      description:
        'A fantasy adventure filled with dragons, hidden powers, and a lost kingdom.',
      image: '/assets/top-novel/top-1.jpg',
      link: '/story/4',
      rankIcon: '',
    },
    {
      id: 5,
      rank: 2,
      title: 'Moonblade Mage',
      author: 'Luna Vale',
      views: '95k',
      likes: '920',
      description:
        'A young mage must survive ancient enemies while uncovering the truth of her bloodline.',
      image: '/assets/top-novel/top-2.jpg',
      link: '/story/5',
      rankIcon: '',
    },
    {
      id: 6,
      rank: 3,
      title: 'Kingdom of Ash',
      author: 'Eren Sky',
      views: '80k',
      likes: '810',
      description:
        'Magic, war, and betrayal collide in a kingdom that refuses to stay buried.',
      image: '/assets/top-novel/top-3.jpg',
      link: '/story/6',
      rankIcon: '',
    },
  ],

  Investigation: [
    {
      id: 7,
      rank: 1,
      title: 'Silent Evidence',
      author: 'Kai Rowan',
      views: '90k',
      likes: '980',
      description:
        'A gripping investigation story where every clue uncovers a darker truth.',
      image: '/assets/top-novel/top-1.jpg',
      link: '/story/7',
      rankIcon: '',
    },
    {
      id: 8,
      rank: 2,
      title: 'The Last Witness',
      author: 'Mira Stone',
      views: '78k',
      likes: '730',
      description:
        'A detective follows a missing witness into a case that changes everything.',
      image: '/assets/top-novel/top-2.jpg',
      link: '/story/8',
      rankIcon: '',
    },
    {
      id: 9,
      rank: 3,
      title: 'Case Zero',
      author: 'Noah West',
      views: '69k',
      likes: '650',
      description:
        'An old unresolved case returns, pulling everyone back into the shadows.',
      image: '/assets/top-novel/top-3.jpg',
      link: '/story/9',
      rankIcon: '',
    },
  ],

  Completed: [
    {
      id: 10,
      rank: 1,
      title: 'Until the End',
      author: 'Sky Harper',
      views: '150k',
      likes: '1800',
      description:
        'A finished emotional story with a full journey from heartbreak to healing.',
      image: '/assets/top-novel/top-1.jpg',
      link: '/story/10',
      rankIcon: '',
    },
    {
      id: 11,
      rank: 2,
      title: 'The Final Promise',
      author: 'Ella Dawn',
      views: '111k',
      likes: '1200',
      description:
        'Completed and unforgettable, this story delivers romance, pain, and closure.',
      image: '/assets/top-novel/top-2.jpg',
      link: '/story/11',
      rankIcon: '',
    },
    {
      id: 12,
      rank: 3,
      title: 'After Goodbye',
      author: 'Ash River',
      views: '94k',
      likes: '970',
      description:
        'A finished series that captures the quiet weight of love after loss.',
      image: '/assets/top-novel/top-3.jpg',
      link: '/story/12',
      rankIcon: '',
    },
  ],

  'Recently Completed': [
    {
      id: 13,
      rank: 1,
      title: 'Last Chapter of Us',
      author: 'Mia Cross',
      views: '84k',
      likes: '860',
      description:
        'Recently completed and already beloved by readers who enjoy emotional endings.',
      image: '/assets/top-novel/top-1.jpg',
      link: '/story/13',
      rankIcon: '',
    },
    {
      id: 14,
      rank: 2,
      title: 'No More Winter',
      author: 'Leo Hart',
      views: '71k',
      likes: '690',
      description:
        'A newly completed story about warmth, distance, and finding your way back.',
      image: '/assets/top-novel/top-2.jpg',
      link: '/story/14',
      rankIcon: '',
    },
    {
      id: 15,
      rank: 3,
      title: 'The Day We Ended',
      author: 'Nina Vale',
      views: '66k',
      likes: '610',
      description:
        'Freshly completed, with a bittersweet ending and strong emotional payoff.',
      image: '/assets/top-novel/top-3.jpg',
      link: '/story/15',
      rankIcon: '',
    },
  ],
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    rank: index + 1,
    title: story.title || 'Untitled Story',
    author: story.author_name || 'Shadow Author',
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    description: story.description || 'No description yet.',
    image: story.cover_url || `/assets/top-novel/top-${Math.min(index + 1, 3)}.jpg`,
    link: `/story/${story.id}`,
    rankIcon: '',
    isAdult: Boolean(story.is_adult),
    genre: story.main_genre || '',
  }
}

function RankBadge({ rank, rankIcon }) {
  const fallbackStyles = {
    1: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 text-white shadow-[0_6px_16px_rgba(217,119,6,0.35)]',
    2: 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 text-white shadow-[0_6px_16px_rgba(100,116,139,0.30)]',
    3: 'bg-gradient-to-br from-amber-200 via-orange-400 to-amber-700 text-white shadow-[0_6px_16px_rgba(180,83,9,0.30)]',
  }

  if (rankIcon) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
        <img
          src={rankIcon}
          alt={`Rank ${rank}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-black ${fallbackStyles[rank] || fallbackStyles[3]}`}
    >
      {rank}
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
  const [activeCategory, setActiveCategory] = useState('Romance')
  const [realDataByCategory, setRealDataByCategory] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchTopNovels() {
      try {
        setLoading(true)

        const results = await Promise.all(
          topNovelCategories.map(async (category) => {
            const endpoint = queryByCategory[category] || '/api/public/stories?limit=3&sort=popular'
            const response = await fetch(addStoryLanguageParam(`${API_BASE_URL}${endpoint}`))
            const data = await response.json().catch(() => ({}))

            if (!response.ok || data.ok === false) {
              throw new Error(data.message || `Failed to load ${category}`)
            }

            return [category, (data.stories || []).map(normalizeStory)]
          })
        )

        if (ignore) return

        setRealDataByCategory(Object.fromEntries(results))
      } catch (error) {
        console.error('TopNovelSection fetch error:', error)

        if (!ignore) {
          setRealDataByCategory({})
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchTopNovels()

    return () => {
      ignore = true
    }
  }, [])

  const filteredData = useMemo(() => {
    const realList = realDataByCategory[activeCategory]
    return realList?.length ? realList : fallbackDataByCategory[activeCategory] || []
  }, [activeCategory, realDataByCategory])

  if (loading) {
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

      <div
        className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {topNovelCategories.map((category) => {
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
            onClick={() => navigate(item.link)}
            className="flex w-full items-start gap-4 text-left"
          >
            <div className="pt-5">
              <RankBadge rank={item.rank} rankIcon={item.rankIcon} />
            </div>

            <div className="relative h-[128px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
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

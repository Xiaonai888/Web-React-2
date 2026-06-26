import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const quickButtons = [
  { label: 'Latest', icon: 'fa-regular fa-calendar-plus' },
  { label: 'Updates', icon: 'fa-regular fa-star' },
  { label: 'Completed', icon: 'fa-regular fa-circle-check' },
]

function normalizeStory(item) {
  const status = item.story_status || item.status || ''
  const totalEpisodes = Number(item.total_episodes || item.episodes_count || item.episode_count || 0)

  return {
    id: item.id || item.story_id,
    title: item.title || 'Untitled Story',
    description: item.description || item.summary || item.synopsis || '',
    cover: item.cover_url || item.coverUrl || item.image_url || '',
    landscape: item.landscape_thumbnail_url || item.banner_url || item.thumbnail_url || item.cover_url || '',
    genre: item.genre || item.category || item.main_genre || 'Romance',
    status,
    tags: Array.isArray(item.tags) ? item.tags : [],
    views: Number(item.views || item.total_views || item.view_count || 0),
    likes: Number(item.likes || item.total_likes || item.like_count || 0),
    rating: Number(item.rating || item.average_rating || item.avg_rating || 0),
    totalEpisodes,
    isCompleted: Boolean(item.is_completed) || String(status).trim().toLowerCase().includes('complete'),
    createdAt: item.created_at || '',
    updatedAt: item.updated_at || item.published_at || item.created_at || '',
  }
}

function isRomanceStory(item) {
  const values = [
    item.genre,
    item.category,
    item.main_genre,
    item.genre_slug,
    item.category_slug,
    ...(Array.isArray(item.genres) ? item.genres : []),
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]

  return values.some((value) => String(value || '').toLowerCase().includes('romance'))
}

function getTime(value) {
  const time = new Date(value || 0).getTime()
  return Number.isFinite(time) ? time : 0
}

function getStoryScore(story) {
  return story.views + story.likes * 4 + story.rating * 25 + story.totalEpisodes
}

function getTrendingScore(story) {
  const ageDays = Math.max(1, (Date.now() - getTime(story.updatedAt)) / 86400000)
  const recencyBoost = Math.max(0, 30 - ageDays) * 12
  return story.views + story.likes * 5 + recencyBoost
}

function sortByLatest(list) {
  return [...list].sort((a, b) => getTime(b.updatedAt) - getTime(a.updatedAt))
}

function sortByTop(list) {
  return [...list].sort((a, b) => getStoryScore(b) - getStoryScore(a))
}

function sortByTrending(list) {
  return [...list].sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}m`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function getEpisodeLabel(story) {
  const count = Number(story.totalEpisodes || 0)

  if (!count) return story.isCompleted ? 'Completed' : 'Updating'
  if (story.isCompleted) return `${count} Episodes`

  return `Up to Ep ${count}`
}

function getTagLine(story) {
  const tags = story.tags
    .map((tag) => String(tag || '').trim())
    .filter((tag) => tag && tag.toLowerCase() !== 'romance')
    .slice(0, 2)

  return tags.join(' / ')
}

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-3 flex items-center justify-between px-4">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[18px] leading-none">{icon}</span>
        <h2 className="min-w-0 truncate text-[18px] font-bold leading-6 text-[#111827]">{title}</h2>
      </div>

      <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-end text-[#111827] active:scale-95">
        <i className="fa-solid fa-chevron-right text-[13px]" />
      </button>
    </div>
  )
}

function ImageFrame({ src, title, className, fallbackClassName = 'text-[#d6336c]' }) {
  return (
    <div className={`overflow-hidden bg-[#f3f4f6] ${className}`}>
      {src ? (
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${fallbackClassName}`}>
          <i className="fa-solid fa-heart text-[24px]" />
        </div>
      )}
    </div>
  )
}

function TopRomanceCard({ story, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(story)} className="min-w-0 text-left active:scale-[0.99]">
      <ImageFrame src={story.landscape || story.cover} title={story.title} className="aspect-[1.42/1] rounded-[9px]" />
      <h3 className="mt-2 line-clamp-1 text-[14px] font-[640] leading-[20px] text-neutral-900">{story.title}</h3>
      <p className="mt-1 text-[11.5px] font-normal leading-[17px] text-gray-400">{getEpisodeLabel(story)}</p>
    </button>
  )
}

function TrendingRomanceCard({ story, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(story)} className="min-w-0 text-left active:scale-[0.99]">
      <ImageFrame src={story.cover} title={story.title} className="aspect-[2/3] rounded-[8px]" />
      <h3 className="mt-2 line-clamp-2 text-[13px] font-[640] leading-[17px] text-neutral-900">{story.title}</h3>
      <p className="mt-1 text-[11.5px] font-normal leading-[17px] text-gray-400">
        <span className="text-[#ef4444]">🔥</span> {formatNumber(story.likes)}
      </p>
    </button>
  )
}

function LatestRomanceCard({ story, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(story)} className="w-[42vw] max-w-[170px] shrink-0 text-left active:scale-[0.99] sm:w-[170px] lg:w-auto lg:max-w-none lg:shrink">
      <ImageFrame src={story.cover} title={story.title} className="aspect-[2/3] rounded-[8px]" />
      <h3 className="mt-2 line-clamp-2 text-[14px] font-[640] leading-[19px] text-neutral-900">{story.title}</h3>
    </button>
  )
}

function AllRomanceCard({ story, onOpen }) {
  const tagLine = getTagLine(story)

  return (
    <button type="button" onClick={() => onOpen(story)} className="min-w-0 text-left active:scale-[0.99]">
      <ImageFrame src={story.cover} title={story.title} className="aspect-[2/3] rounded-[8px]" />
      <h3 className="mt-2 line-clamp-1 text-[14px] font-[640] leading-[20px] text-neutral-900">{story.title}</h3>
      <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-gray-400">{tagLine || 'Romance'}</p>
    </button>
  )
}

function LoadingGrid() {
  return (
    <div className="space-y-7 px-4 pt-5">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex}>
          <div className="mb-3 h-6 w-44 animate-pulse rounded-full bg-gray-100" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {Array.from({ length: 4 }).map((__, index) => (
              <div key={index}>
                <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
                <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function RomanceGenrePage({ embedded = false }) {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadRomanceStories() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(`${API_URL}/api/public/stories?genre=Romance&limit=48`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load romance stories')
        }

        const rawStories = data.stories || data.items || data.results || []
        const filtered = rawStories.filter(isRomanceStory).map(normalizeStory)

        if (!ignore) {
          setStories(filtered.length ? filtered : rawStories.map(normalizeStory))
        }
      } catch (error) {
        if (!ignore) {
          setStories([])
          setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to server.' : error.message || 'Failed to load romance stories')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadRomanceStories()

    return () => {
      ignore = true
    }
  }, [])

  const topStories = useMemo(() => sortByTop(stories).slice(0, 6), [stories])
  const trendingStories = useMemo(() => sortByTrending(stories).slice(0, 6), [stories])
  const latestStories = useMemo(() => sortByLatest(stories).slice(0, 6), [stories])
  const allStories = useMemo(() => stories.slice(0, 20), [stories])
  const heroImage = useMemo(() => {
    const found = topStories.find((story) => story.landscape || story.cover)
    return found?.landscape || found?.cover || ''
  }, [topStories])

  const openStory = (story) => {
    if (story?.id) navigate(`/story/${story.id}`)
  }

  return (
    <div className={embedded ? 'bg-white pb-6' : 'min-h-screen bg-white pb-[110px]'}>
      {!embedded ? (
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#111827] active:scale-95"
              aria-label="Back"
            >
              <i className="fa-solid fa-chevron-left text-[13px]" />
            </button>

            <div className="min-w-0 text-center">
              <h1 className="text-[17px] font-black text-[#111827]">Romance</h1>
              <p className="text-[11px] font-semibold text-gray-400">Love stories and emotional journeys</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/search')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#111827] active:scale-95"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass text-[13px]" />
            </button>
          </div>
        </header>
      ) : null}

      <main className={`mx-auto max-w-5xl ${embedded ? 'pt-0' : 'pt-4'}`}>
        <section className="px-4">
          <div className="relative aspect-[4.25/1] overflow-hidden rounded-[14px] bg-gradient-to-r from-[#ff5eb8] to-[#ffb1d5]">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Romance"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-between px-5">
                <div className="text-[26px] font-black uppercase italic tracking-wide text-white drop-shadow">Romance</div>
                <i className="fa-solid fa-heart text-[42px] text-white/85" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ec4899]/45 via-transparent to-transparent" />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[26px] font-black uppercase italic tracking-wide text-white drop-shadow">Romance</div>
          </div>
        </section>

        <section className="mt-4 px-4">
          <div className="grid grid-cols-3 gap-2">
            {quickButtons.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex h-12 items-center justify-center gap-2 rounded-[11px] bg-white text-[13px] font-[640] text-[#111827] shadow-sm ring-1 ring-gray-100 active:scale-[0.98]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#facc15] text-[12px] text-[#111827]">
                  <i className={item.icon} />
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {loading ? <LoadingGrid /> : null}

        {!loading && message ? (
          <section className="mx-4 mt-5 rounded-[18px] bg-gray-50 p-6 text-center">
            <div className="text-[13px] font-[640] text-[#e5484d]">{message}</div>
          </section>
        ) : null}

        {!loading && !message ? (
          <div className="pt-7">
            <section>
              <SectionTitle icon="🏆" title="Top Romance" />
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4 sm:grid-cols-3 lg:grid-cols-6">
                {topStories.map((story) => (
                  <TopRomanceCard key={`top-${story.id}`} story={story} onOpen={openStory} />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionTitle icon="🔥" title="Trending Romance" />
              <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 px-4 lg:grid-cols-6 lg:gap-x-3">
                {trendingStories.map((story) => (
                  <TrendingRomanceCard key={`trending-${story.id}`} story={story} onOpen={openStory} />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionTitle icon="🆕" title="Latest Romance" />
              <div className="flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
                {latestStories.map((story) => (
                  <LatestRomanceCard key={`latest-${story.id}`} story={story} onOpen={openStory} />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionTitle icon="📖" title="All Romance" />
              {allStories.length ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 sm:grid-cols-3 lg:grid-cols-6">
                  {allStories.map((story) => (
                    <AllRomanceCard key={`all-${story.id}`} story={story} onOpen={openStory} />
                  ))}
                </div>
              ) : (
                <div className="mx-4 rounded-[18px] bg-gray-50 p-8 text-center">
                  <h3 className="text-[16px] font-black text-[#111827]">No stories found</h3>
                  <p className="mt-2 text-[13px] font-normal text-gray-400">Romance stories will appear here after publishing.</p>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </main>
    </div>
  )
}

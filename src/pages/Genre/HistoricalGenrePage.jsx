import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const filters = [
  { label: 'All Historical', value: 'all' },
  { label: 'Latest', value: 'latest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Royal', value: 'royal' },
  { label: 'Completed', value: 'completed' },
]

function normalizeStory(item) {
  return {
    id: item.id || item.story_id,
    title: item.title || 'Untitled Story',
    description: item.description || item.summary || item.synopsis || '',
    cover: item.cover_url || item.coverUrl || item.image_url || '',
    genre: item.genre || item.category || item.main_genre || 'Historical',
    status: item.story_status || item.status || '',
    views: Number(item.views || item.total_views || item.view_count || 0),
    likes: Number(item.likes || item.total_likes || item.like_count || 0),
    rating: Number(item.rating || item.average_rating || item.avg_rating || 0),
    updatedAt: item.updated_at || item.published_at || item.created_at || '',
    createdAt: item.created_at || '',
  }
}

function isHistoricalStory(item) {
  const values = [
    item.genre,
    item.category,
    item.main_genre,
    item.genre_slug,
    item.category_slug,
    ...(Array.isArray(item.genres) ? item.genres : []),
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]

  return values.some((value) => String(value || '').toLowerCase().includes('historical'))
}

function getStoryScore(story) {
  return story.views + story.likes * 3 + story.rating * 20
}

function isCompletedStory(story) {
  return String(story.status || '').toLowerCase().includes('complete')
}

function isRoyalStory(story) {
  const text = `${story.title} ${story.description} ${story.status}`.toLowerCase()

  return ['royal', 'king', 'queen', 'prince', 'princess', 'palace', 'dynasty', 'emperor', 'empress', 'crown', 'noble', 'ancient'].some((word) =>
    text.includes(word)
  )
}

function StoryCard({ story, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="group flex gap-3 rounded-[22px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
    >
      <div className="h-[116px] w-[86px] shrink-0 overflow-hidden rounded-[16px] bg-[#fef3c7]">
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#92400e]">
            <i className="fa-solid fa-scroll text-[28px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="line-clamp-2 text-[15px] font-black leading-5 text-[#111827]">{story.title}</div>
        <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-[#8d94a1]">
          {story.description || 'A historical story filled with ancient eras, royal secrets, past love, and classic drama.'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10.5px] font-black text-[#98a2b3]">
          <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-[#92400e]">Historical</span>
          {story.status ? <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1">{story.status}</span> : null}
        </div>

        <div className="mt-3 flex items-center gap-4 text-[11px] font-bold text-[#98a2b3]">
          <span><i className="fa-regular fa-eye mr-1" />{story.views}</span>
          <span><i className="fa-regular fa-heart mr-1" />{story.likes}</span>
          <span><i className="fa-solid fa-star mr-1" />{story.rating.toFixed(1)}</span>
        </div>
      </div>
    </button>
  )
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-1">
      <div>
        <h2 className="text-[18px] font-black text-[#111827]">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[12px] font-semibold text-[#98a2b3]">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default function HistoricalGenrePage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    let ignore = false

    async function loadHistoricalStories() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(`${API_URL}/api/public/stories?genre=Historical&limit=80`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load historical stories')
        }

        const rawStories = data.stories || data.items || data.results || []
        const filtered = rawStories.filter(isHistoricalStory).map(normalizeStory)

        if (!ignore) setStories(filtered.length ? filtered : rawStories.map(normalizeStory))
      } catch (error) {
        if (!ignore) {
          setStories([])
          setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to server.' : error.message || 'Failed to load historical stories')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadHistoricalStories()

    return () => {
      ignore = true
    }
  }, [])

  const latestStories = useMemo(() => {
    return [...stories]
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
      .slice(0, 6)
  }, [stories])

  const popularStories = useMemo(() => {
    return [...stories]
      .sort((a, b) => getStoryScore(b) - getStoryScore(a))
      .slice(0, 6)
  }, [stories])

  const filteredStories = useMemo(() => {
    if (activeFilter === 'latest') {
      return [...stories].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    }

    if (activeFilter === 'popular') {
      return [...stories].sort((a, b) => getStoryScore(b) - getStoryScore(a))
    }

    if (activeFilter === 'royal') {
      return stories.filter(isRoyalStory)
    }

    if (activeFilter === 'completed') {
      return stories.filter(isCompletedStory)
    }

    return stories
  }, [activeFilter, stories])

  const activeFilterLabel = filters.find((item) => item.value === activeFilter)?.label || 'All Historical'

  const openStory = (story) => {
    if (story?.id) navigate(`/story/${story.id}`)
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] pb-[110px]">
      <header className="sticky top-0 z-40 border-b border-[#fde68a] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7] text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="text-[17px] font-black text-[#111827]">Historical</h1>
            <p className="text-[11px] font-bold text-[#92400e]">Ancient eras, royal secrets, and classic love</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7] text-[#111827] active:scale-95"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#fef3c7] p-5 text-white shadow-sm ring-1 ring-[#fde68a]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-white text-[#92400e] shadow-sm">
              <i className="fa-solid fa-scroll text-[30px]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-black uppercase tracking-[0.12em] text-[#fde68a]">Genre</div>
              <h2 className="mt-1 text-[28px] font-black leading-8">Historical</h2>
              <p className="mt-2 max-w-[520px] text-[13px] font-semibold leading-6 text-white/85">
                Stories from past eras, royal courts, ancient secrets, dynasties, classic romance, and forgotten memories.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = activeFilter === item.value

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveFilter(item.value)}
                  className={`rounded-full px-4 py-2 text-[12px] font-black active:scale-95 ${
                    active ? 'bg-white text-[#78350f]' : 'bg-white/15 text-white ring-1 ring-white/25'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </section>

        {loading ? (
          <section className="mt-5 rounded-[26px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#fde68a] border-t-[#111827]" />
            <div className="text-[13px] font-black text-[#667085]">Opening historical...</div>
          </section>
        ) : null}

        {!loading && message ? (
          <section className="mt-5 rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-[13px] font-black text-[#e5484d]">{message}</div>
          </section>
        ) : null}

        {!loading && !message ? (
          <>
            <section className="mt-6">
              <SectionTitle title="Latest Historical" subtitle="Recently updated historical stories" />
              <div className="grid gap-3 sm:grid-cols-2">
                {latestStories.map((story) => (
                  <StoryCard key={`latest-${story.id}`} story={story} onOpen={openStory} />
                ))}
              </div>
            </section>

            <section className="mt-7">
              <SectionTitle title="Popular Historical" subtitle="Stories readers are watching now" />
              <div className="grid gap-3 sm:grid-cols-2">
                {popularStories.map((story) => (
                  <StoryCard key={`popular-${story.id}`} story={story} onOpen={openStory} />
                ))}
              </div>
            </section>

            <section className="mt-7">
              <SectionTitle title={activeFilterLabel} subtitle={`${filteredStories.length} stories`} />
              {filteredStories.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredStories.map((story) => (
                    <StoryCard key={`${activeFilter}-${story.id}`} story={story} onOpen={openStory} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fef3c7] text-[#92400e]">
                    <i className="fa-solid fa-scroll text-[24px]" />
                  </div>
                  <h3 className="mt-4 text-[17px] font-black text-[#111827]">No historical stories yet</h3>
                  <p className="mt-2 text-[13px] font-semibold text-[#98a2b3]">Historical stories will appear here when available.</p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

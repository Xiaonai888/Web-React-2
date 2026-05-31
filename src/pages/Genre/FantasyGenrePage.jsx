import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const filterItems = [
  { key: 'all', label: 'All Fantasy' },
  { key: 'latest', label: 'Latest' },
  { key: 'popular', label: 'Popular' },
  { key: 'magic', label: 'Magic' },
  { key: 'completed', label: 'Completed' },
]

function normalizeStory(item) {
  return {
    id: item.id || item.story_id,
    title: item.title || 'Untitled Story',
    description: item.description || item.summary || item.synopsis || '',
    cover: item.cover_url || item.coverUrl || item.image_url || '',
    genre: item.genre || item.category || item.main_genre || 'Fantasy',
    status: item.story_status || item.status || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    views: Number(item.views || item.total_views || item.view_count || 0),
    likes: Number(item.likes || item.total_likes || item.like_count || 0),
    rating: Number(item.rating || item.average_rating || item.avg_rating || 0),
    updatedAt: item.updated_at || item.published_at || item.created_at || '',
  }
}

function isFantasyStory(item) {
  const values = [
    item.genre,
    item.category,
    item.main_genre,
    item.genre_slug,
    item.category_slug,
    ...(Array.isArray(item.genres) ? item.genres : []),
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]

  return values.some((value) => String(value || '').toLowerCase().includes('fantasy'))
}

function getStoryScore(story) {
  return story.views + story.likes * 3 + story.rating * 20
}

function getLatestStories(list, limit = 6) {
  return [...list]
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    .slice(0, limit)
}

function getPopularStories(list, limit = 6) {
  return [...list]
    .sort((a, b) => getStoryScore(b) - getStoryScore(a))
    .slice(0, limit)
}

function hasMagicWords(story) {
  const text = `${story.title} ${story.description} ${story.tags.join(' ')}`.toLowerCase()
  return ['magic', 'mage', 'wizard', 'witch', 'dragon', 'kingdom', 'curse', 'spell', 'sword', 'academy'].some((word) => text.includes(word))
}

function isCompleted(story) {
  return String(story.status || '').toLowerCase().includes('complete')
}

function StoryCard({ story, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="group flex gap-3 rounded-[22px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
    >
      <div className="h-[116px] w-[86px] shrink-0 overflow-hidden rounded-[16px] bg-[#f3f4f6]">
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#6d5dfc]">
            <i className="fa-solid fa-wand-magic-sparkles text-[24px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="line-clamp-2 text-[15px] font-black leading-5 text-[#111827]">{story.title}</div>
        <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-[#8d94a1]">
          {story.description || 'A fantasy story filled with magic, mystery, and unforgettable adventure.'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10.5px] font-black text-[#98a2b3]">
          <span className="rounded-full bg-[#f1efff] px-2.5 py-1 text-[#5b4bdb]">Fantasy</span>
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

export default function FantasyGenrePage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    let ignore = false

    async function loadFantasyStories() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(`${API_URL}/api/public/stories?genre=Fantasy&limit=80`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load fantasy stories')
        }

        const rawStories = data.stories || data.items || data.results || []
        const filtered = rawStories.filter(isFantasyStory).map(normalizeStory)

        if (!ignore) setStories(filtered.length ? filtered : rawStories.map(normalizeStory))
      } catch (error) {
        if (!ignore) {
          setStories([])
          setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to server.' : error.message || 'Failed to load fantasy stories')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadFantasyStories()

    return () => {
      ignore = true
    }
  }, [])

  const latestStories = useMemo(() => getLatestStories(stories), [stories])
  const popularStories = useMemo(() => getPopularStories(stories), [stories])

  const filteredStories = useMemo(() => {
    if (activeFilter === 'latest') return getLatestStories(stories, stories.length)
    if (activeFilter === 'popular') return getPopularStories(stories, stories.length)
    if (activeFilter === 'magic') return stories.filter(hasMagicWords)
    if (activeFilter === 'completed') return stories.filter(isCompleted)
    return stories
  }, [activeFilter, stories])

  const activeFilterLabel = filterItems.find((item) => item.key === activeFilter)?.label || 'All Fantasy'

  const openStory = (story) => {
    if (story?.id) navigate(`/story/${story.id}`)
  }

  return (
    <div className="min-h-screen bg-[#f7f5ff] pb-[110px]">
      <header className="sticky top-0 z-40 border-b border-[#e4ddff] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1efff] text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="text-[17px] font-black text-[#111827]">Fantasy</h1>
            <p className="text-[11px] font-bold text-[#6d5dfc]">Magic worlds and epic adventures</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1efff] text-[#111827] active:scale-95"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#ede7ff] via-white to-[#fff4d6] p-5 shadow-sm ring-1 ring-[#e4ddff]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-white text-[#6d5dfc] shadow-sm">
              <i className="fa-solid fa-wand-magic-sparkles text-[27px]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-black uppercase tracking-[0.12em] text-[#6d5dfc]">Genre</div>
              <h2 className="mt-1 text-[28px] font-black leading-8 text-[#111827]">Fantasy</h2>
              <p className="mt-2 max-w-[520px] text-[13px] font-semibold leading-6 text-[#667085]">
                Magic, kingdoms, adventure, mystery, and impossible worlds for readers who love fantasy.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {filterItems.map((item) => {
              const active = activeFilter === item.key

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveFilter(item.key)}
                  className={`rounded-full px-4 py-2 text-[12px] font-black active:scale-95 ${
                    active ? 'bg-[#111827] text-white' : 'bg-white text-[#5b4bdb] ring-1 ring-[#e4ddff]'
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
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e4ddff] border-t-[#111827]" />
            <div className="text-[13px] font-black text-[#667085]">Opening fantasy...</div>
          </section>
        ) : null}

        {!loading && message ? (
          <section className="mt-5 rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-[13px] font-black text-[#e5484d]">{message}</div>
          </section>
        ) : null}

        {!loading && !message ? (
          <>
            {activeFilter === 'all' ? (
              <>
                <section className="mt-6">
                  <SectionTitle title="Latest Fantasy" subtitle="Recently updated fantasy stories" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {latestStories.map((story) => (
                      <StoryCard key={`latest-${story.id}`} story={story} onOpen={openStory} />
                    ))}
                  </div>
                </section>

                <section className="mt-7">
                  <SectionTitle title="Popular Fantasy" subtitle="Stories readers are watching now" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {popularStories.map((story) => (
                      <StoryCard key={`popular-${story.id}`} story={story} onOpen={openStory} />
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            <section className="mt-7">
              <SectionTitle title={activeFilter === 'all' ? 'All Fantasy Stories' : activeFilterLabel} subtitle={`${filteredStories.length} stories`} />
              {filteredStories.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredStories.map((story) => (
                    <StoryCard key={story.id} story={story} onOpen={openStory} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1efff] text-[#6d5dfc]">
                    <i className="fa-solid fa-wand-magic-sparkles text-[22px]" />
                  </div>
                  <h3 className="mt-4 text-[17px] font-black text-[#111827]">No fantasy stories yet</h3>
                  <p className="mt-2 text-[13px] font-semibold text-[#98a2b3]">Fantasy stories will appear here when available.</p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

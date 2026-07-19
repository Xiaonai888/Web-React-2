import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'

function getTime(value) {
  const time = new Date(value || 0).getTime()
  return Number.isFinite(time) ? time : 0
}

function isRomanceStory(story) {
  return String(story?.main_genre || '').trim().toLowerCase() === 'romance'
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || '',
    totalEpisodes: Number(story.total_episodes || 0),
    createdAt: story.created_at || '',
  }
}

function StoryCover({ story }) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-[#f3f4f6]">
      {story.cover ? (
        <img
          src={story.cover}
          alt={story.title}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="h-full w-full select-none object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#d6336c]">
          <i className="fa-solid fa-heart text-[30px]" />
        </div>
      )}
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-4 pt-5 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
          <div className="mt-2 h-4 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

export default function RomanceLatestPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadStories() {
    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_URL}/api/public/stories?genre=Romance&limit=48&sort=latest`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load romance stories')
      }

      const list = (data.stories || [])
        .filter(isRomanceStory)
        .map(normalizeStory)

      setStories(list)
    } catch (error) {
      setStories([])
      setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to server.' : error.message || 'Failed to load romance stories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  const latestStories = useMemo(
    () => [...stories].sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt)),
    [stories]
  )

  return (
    <div className="min-h-screen bg-white pb-8">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-[58px] max-w-5xl items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-start text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left text-[21px]" />
          </button>

          <h1 className="ml-1 text-[20px] font-[650] text-[#111827]">Romance Latest</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl">
        {loading ? <LoadingGrid /> : null}

        {!loading && message ? (
          <div className="mx-4 mt-5 rounded-[16px] bg-gray-50 px-5 py-9 text-center">
            <p className="text-[13px] font-medium text-[#e5484d]">{message}</p>
            <button
              type="button"
              onClick={loadStories}
              className="mt-4 rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-bold text-white active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !message && latestStories.length === 0 ? (
          <div className="px-5 py-16 text-center text-[14px] text-gray-400">No romance stories yet.</div>
        ) : null}

        {!loading && !message && latestStories.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-5 px-4 pt-5 md:grid-cols-4 lg:grid-cols-6">
            {latestStories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => navigate(`/story/${story.id}`, { state: { returnTo: '/genre/romance/latest' } })}
                className="min-w-0 text-left active:scale-[0.99]"
              >
                <StoryCover story={story} />
                <h2 className="mt-2 line-clamp-2 text-[14px] font-[600] leading-[19px] text-[#222222]">
                  {story.title}
                </h2>
                <p className="mt-2 text-[12px] font-normal text-gray-400">Up to Ep. {story.totalEpisodes}</p>
              </button>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}

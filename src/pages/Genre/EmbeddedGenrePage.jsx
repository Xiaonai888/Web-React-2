import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function normalizeStory(item, genreLabel) {
  return {
    id: item.id || item.story_id,
    title: item.title || 'Untitled Story',
    description:
      item.description ||
      item.summary ||
      item.synopsis ||
      '',
    cover:
      item.cover_url ||
      item.coverUrl ||
      item.image_url ||
      '',
    genre:
      item.genre ||
      item.category ||
      item.main_genre ||
      genreLabel,
    status: item.status || item.story_status || '',
    views: Number(
      item.views ||
      item.total_views ||
      item.view_count ||
      0
    ),
    likes: Number(
      item.likes ||
      item.total_likes ||
      item.like_count ||
      0
    ),
    rating: Number(
      item.rating ||
      item.average_rating ||
      item.avg_rating ||
      0
    ),
    updatedAt:
      item.updated_at ||
      item.published_at ||
      item.created_at ||
      '',
  }
}

function isCompletedStory(story) {
  const status = String(story.status || '').toLowerCase()

  return (
    status.includes('complete') ||
    status.includes('completed') ||
    status.includes('finished') ||
    status.includes('end')
  )
}

function StoryCard({ story, genreLabel, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="group flex w-full gap-3 rounded-[22px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
    >
      <div className="h-[116px] w-[86px] shrink-0 overflow-hidden rounded-[16px] bg-[#f3f4f6]">
        {story.cover ? (
          <img
            src={story.cover}
            alt={story.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#F6B800]">
            <i className="fa-regular fa-bookmark text-[23px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="line-clamp-2 text-[15px] font-black leading-5 text-[#111827]">
          {story.title}
        </div>

        <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-5 text-[#8d94a1]">
          {story.description ||
            `Explore this ${genreLabel} story on Shadow.`}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="rounded-full bg-[#fff8dc] px-2.5 py-1 font-semibold text-[#9a7100]">
            {genreLabel}
          </span>

          {story.status ? (
            <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 font-medium text-[#7c8491]">
              {story.status}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-4 text-[11px] font-medium text-[#98a2b3]">
          <span>
            <i className="fa-regular fa-eye mr-1" />
            {story.views}
          </span>

          <span>
            <i className="fa-regular fa-heart mr-1" />
            {story.likes}
          </span>

          <span>
            <i className="fa-solid fa-star mr-1 text-[#F6B800]" />
            {story.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </button>
  )
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Latest', value: 'latest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Completed', value: 'completed' },
]

export default function EmbeddedGenrePage({
  genreSlug,
  genreLabel,
}) {
  const navigate = useNavigate()

  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    let ignore = false

    async function loadStories() {
      setLoading(true)
      setMessage('')
      setActiveFilter('all')

      try {
        const response = await fetch(
          `${API_URL}/api/public/stories?genre=${encodeURIComponent(
            genreLabel
          )}&limit=80`
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || `Failed to load ${genreLabel} stories`
          )
        }

        const rawStories =
          data.stories ||
          data.items ||
          data.results ||
          []

        const normalized = rawStories.map((story) =>
          normalizeStory(story, genreLabel)
        )

        if (!ignore) {
          setStories(normalized)
        }
      } catch (error) {
        if (!ignore) {
          setStories([])
          setMessage(
            error.message === 'Failed to fetch'
              ? 'Cannot connect to server.'
              : error.message ||
                `Failed to load ${genreLabel} stories`
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadStories()

    return () => {
      ignore = true
    }
  }, [genreSlug, genreLabel])

  const latestStories = useMemo(() => {
    return [...stories]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
      )
      .slice(0, 20)
  }, [stories])

  const popularStories = useMemo(() => {
    return [...stories]
      .sort(
        (a, b) =>
          b.views +
          b.likes * 3 +
          b.rating * 20 -
          (a.views + a.likes * 3 + a.rating * 20)
      )
      .slice(0, 20)
  }, [stories])

  const visibleStories = useMemo(() => {
    if (activeFilter === 'latest') {
      return latestStories
    }

    if (activeFilter === 'popular') {
      return popularStories
    }

    if (activeFilter === 'completed') {
      return stories.filter(isCompletedStory)
    }

    return stories
  }, [
    activeFilter,
    latestStories,
    popularStories,
    stories,
  ])

  function openStory(story) {
    if (story?.id) {
      navigate(`/story/${story.id}`)
    }
  }

  return (
    <section className="min-h-[500px] bg-[#f7f7f8] pb-8">
      <div className="bg-white px-4 pb-5 pt-4">
        <div className="rounded-[26px] bg-gradient-to-br from-[#fff7d6] via-white to-[#f3f4f6] p-5 ring-1 ring-black/5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#F6B800] text-[#111827] shadow-sm">
              <i className="fa-solid fa-book-open text-[20px]" />
            </div>

            <div className="min-w-0">
              <h1 className="text-[22px] font-black leading-tight text-[#111827]">
                {genreLabel}
              </h1>

              <p className="mt-1 text-[12px] font-medium text-[#8d94a1]">
                Discover stories from the {genreLabel} genre
              </p>

              <p className="mt-2 text-[11px] font-semibold text-[#a27800]">
                {stories.length} stories
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => {
            const active =
              activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value)
                }
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors active:bg-[#e5e7eb] ${
                  active
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#f3f4f6] text-[#8d94a1]'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-5">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-[#e5e7eb] border-t-[#F6B800]" />

              <p className="mt-3 text-[12px] font-medium text-[#98a2b3]">
                Loading {genreLabel}...
              </p>
            </div>
          </div>
        ) : message ? (
          <div className="rounded-[22px] bg-white p-6 text-center text-[13px] font-medium text-[#8d94a1] ring-1 ring-black/5">
            {message}
          </div>
        ) : visibleStories.length === 0 ? (
          <div className="rounded-[22px] bg-white p-8 text-center ring-1 ring-black/5">
            <i className="fa-regular fa-folder-open text-[28px] text-[#d1d5db]" />

            <p className="mt-3 text-[13px] font-medium text-[#8d94a1]">
              No {genreLabel} stories yet
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-end justify-between px-1">
              <div>
                <h2 className="text-[18px] font-black text-[#111827]">
                  {activeFilter === 'all'
                    ? `All ${genreLabel}`
                    : `${filters.find(
                        (filter) =>
                          filter.value === activeFilter
                      )?.label} ${genreLabel}`}
                </h2>

                <p className="mt-0.5 text-[11px] font-medium text-[#98a2b3]">
                  {visibleStories.length} stories
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {visibleStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  genreLabel={genreLabel}
                  onOpen={openStory}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

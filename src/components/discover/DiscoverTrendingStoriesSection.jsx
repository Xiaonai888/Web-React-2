import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function formatReads(value) {
  const number = Number(value || 0)

  if (number < 1000) return `${number} reads`

  return `${new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)} reads`
}

function getRankClass(rank) {
  if (rank === 1) {
    return 'bg-[#f6c744] text-[#111827]'
  }

  if (rank === 2) {
    return 'bg-[#d9dde5] text-[#111827]'
  }

  if (rank === 3) {
    return 'bg-[#a97142] text-white'
  }

  return 'bg-black/65 text-white'
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    coverUrl: story.cover_url || '',
    genre: story.main_genre || '',
    totalViews: Number(story.total_views || 0),
    isAdult: Boolean(story.is_adult),
  }
}

function TrendingStorySkeleton() {
  return (
    <div className="w-[106px] shrink-0 sm:w-[112px]">
      <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
      <div className="mt-2 h-3.5 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
    </div>
  )
}

export default function DiscoverTrendingStoriesSection() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function loadTrendingStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=10&sort=trending`
          )
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || 'Failed to load trending stories'
          )
        }

        if (alive) {
          setStories(
            (Array.isArray(data.stories) ? data.stories : [])
              .map(normalizeStory)
              .filter((story) => story.id)
              .slice(0, 10)
          )
        }
      } catch {
        if (alive) {
          setStories([])
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadTrendingStories()

    return () => {
      alive = false
    }
  }, [])

  if (!loading && !stories.length) return null

  return (
    <article className="bg-white py-4 ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold text-[#111827]">
            Trending Stories
          </div>
          <div className="mt-1 text-[11px] font-normal text-gray-400">
            Most read stories on Shadow now
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/most-read-this-week')}
          className="shrink-0 text-[12px] font-semibold text-gray-500 active:scale-95"
        >
          More
        </button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <TrendingStorySkeleton key={index} />
            ))
          : stories.map((story, index) => {
              const rank = index + 1

              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="w-[106px] shrink-0 text-left active:scale-[0.98] sm:w-[112px]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#7c3aed]">
                    {story.coverUrl ? (
                      <img
                        src={story.coverUrl}
                        alt={story.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/70">
                        <i className="fa-solid fa-book-open text-[24px]" />
                      </div>
                    )}

                    <div
                      className={`absolute right-0 top-0 flex h-7 min-w-7 items-center justify-center rounded-bl-[6px] px-2 text-[11px] font-black ${getRankClass(rank)}`}
                    >
                      {rank}
                    </div>

                    {story.isAdult ? (
                      <div className="absolute bottom-2 left-2 rounded-[5px] bg-white/90 px-1.5 py-1 text-[9px] font-bold text-red-500">
                        18+
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-2 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-[16px] text-[#111827]">
                    {story.title}
                  </div>

                  <div className="mt-1 truncate text-[10px] font-normal text-gray-400">
                    {formatReads(story.totalViews)}
                  </div>

                  {story.genre ? (
                    <div className="mt-1 truncate text-[10px] font-normal text-gray-400">
                      {story.genre}
                    </div>
                  ) : null}
                </button>
              )
            })}
      </div>
    </article>
  )
}

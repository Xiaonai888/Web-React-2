import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../../utils/storyLanguage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    coverUrl: story.cover_url || '',
    genre: story.main_genre || '',
    totalLikes: Number(story.total_likes || 0),
    totalEpisodes: Number(story.total_episodes || 0),
    isAdult: Boolean(story.is_adult),
  }
}

function StorySkeleton() {
  return (
    <div className="w-[106px] shrink-0 sm:w-[112px]">
      <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-gray-100" />
      <div className="mt-2 h-3.5 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-100" />
    </div>
  )
}

export default function DiscoverYouMightLikeSection() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })
  const suppressClickRef = useRef(false)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    const controller = new AbortController()

    async function loadStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/stories?limit=12&sort=popular`
          ),
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || 'Failed to load recommendations'
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
      } catch (error) {
        if (alive && error.name !== 'AbortError') {
          setStories([])
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadStories()

    return () => {
      alive = false
      controller.abort()
    }
  }, [])

  function startDrag(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return
    }

    const element = scrollRef.current

    if (!element) return

    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
      moved: false,
    }

    element.setPointerCapture?.(event.pointerId)
  }

  function moveDrag(event) {
    const element = scrollRef.current
    const state = dragRef.current

    if (!element || !state.active) return

    const distance = event.clientX - state.startX

    if (Math.abs(distance) > 4) {
      state.moved = true
    }

    element.scrollLeft = state.scrollLeft - distance
  }

  function endDrag(event) {
    const element = scrollRef.current
    const wasMoved = dragRef.current.moved

    dragRef.current.active = false

    if (element?.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }

    if (wasMoved) {
      suppressClickRef.current = true

      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
  }

  function openStory(storyId) {
    if (suppressClickRef.current) return

    navigate(`/story/${storyId}`)
  }

  if (!loading && !stories.length) return null

  return (
    <article className="bg-white py-4 ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold text-[#111827]">
            You Might Like
          </div>

          <div className="mt-1 text-[11px] font-normal text-gray-400">
            Popular stories selected for your next read
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/you-might-like')}
          className="shrink-0 text-[12px] font-semibold text-gray-500 active:scale-95"
        >
          More
        </button>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="no-scrollbar flex cursor-grab select-none gap-3 overflow-x-auto px-4 pb-1 active:cursor-grabbing"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <StorySkeleton key={index} />
            ))
          : stories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => openStory(story.id)}
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
                      draggable="false"
                      onDragStart={(event) =>
                        event.preventDefault()
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/70">
                      <i className="fa-solid fa-book-open text-[24px]" />
                    </div>
                  )}

                  {story.isAdult ? (
                    <div className="absolute bottom-2 left-2 rounded-[5px] bg-white/90 px-1.5 py-1 text-[9px] font-semibold text-red-500">
                      18+
                    </div>
                  ) : null}
                </div>

                <div className="mt-2 line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-[16px] text-[#111827]">
                  {story.title}
                </div>

                <div className="mt-1 truncate text-[10px] font-normal text-gray-400">
                  <i className="fa-solid fa-heart mr-1 text-[9px] text-red-400" />
                  {formatCompactNumber(story.totalLikes)}
                  {story.totalEpisodes > 0
                    ? ` · Ep ${story.totalEpisodes}`
                    : ''}
                </div>

                {story.genre ? (
                  <div className="mt-1 truncate text-[10px] font-normal text-gray-400">
                    {story.genre}
                  </div>
                ) : null}
              </button>
            ))}
      </div>
    </article>
  )
}

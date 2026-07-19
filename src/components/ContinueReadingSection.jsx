import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function ContinueReadingCard({ item }) {
  const story = item.story || {}
  const episode = item.episode || {}
  const image = story.landscape_thumbnail_url || story.cover_url || ''
  const episodeNumber = Number(episode.episode_number || item.episode_number || 1)
  const totalEpisodes = Math.max(episodeNumber, Number(item.total_episodes || story.total_episodes || 1))

  return (
    <Link
      to={`/story/${item.story_id}/episode/${item.episode_id}`}
      className="group block w-[112px] shrink-0 md:w-[150px]"
    >
      <div className="relative aspect-[1.28/1] overflow-hidden rounded-[8px] bg-[#eef1f5]">
        {image ? (
          <img
            src={image}
            alt={story.title || 'Continue reading'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <p className="mt-2 truncate text-[11px] font-medium text-[#8d94a1]">
        Read Ch. {episodeNumber} / {totalEpisodes}
      </p>

      <h3 className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-[18px] text-[#111827]">
        {story.title || 'Untitled Story'}
      </h3>
    </Link>
  )
}

export default function ContinueReadingSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProgress = useCallback(async () => {
    const token = getReaderToken()

    if (!token) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reading-progress?limit=6`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load reading progress')
      }

      setItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProgress()

    function refreshWhenVisible() {
      if (document.visibilityState === 'visible') loadProgress()
    }

    window.addEventListener('focus', loadProgress)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      window.removeEventListener('focus', loadProgress)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [loadProgress])

  if (loading || !items.length) return null

  return (
    <section className="px-3 pb-2 md:px-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center text-[#ff7a00]">
          <i className="fa-solid fa-book-open text-[17px]" />
        </span>

        <h2 className="text-[18px] font-extrabold tracking-tight text-[#111827] lg:text-[19px]">
          Continue Reading
        </h2>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <ContinueReadingCard
            key={`${item.story_id}-${item.episode_id}`}
            item={item}
          />
        ))}
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getStorageKey(storyId) {
  return `shadow_story_basic_reaction_${storyId}`
}

function readReaction(storyId) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(storyId)) || 'null')
  } catch {
    return null
  }
}

function saveReaction(storyId, data) {
  localStorage.setItem(getStorageKey(storyId), JSON.stringify(data))
}

function removeReaction(storyId) {
  localStorage.removeItem(getStorageKey(storyId))
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, '')}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`

  return String(number)
}

export default function ReactionPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [liked, setLiked] = useState(false)
  const [localCount, setLocalCount] = useState(0)

  const baseCount = useMemo(() => {
    return Number(story?.like_count || story?.likes_count || story?.reaction_count || 0)
  }, [story])

  const totalLikes = baseCount + localCount

  useEffect(() => {
    const saved = readReaction(storyId)

    if (saved?.reaction_type === 'love') {
      setLiked(true)
      setLocalCount(1)
    } else {
      setLiked(false)
      setLocalCount(0)
    }
  }, [storyId])

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${storyId}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load story')
        }

        if (!ignore) setStory(data.story || null)
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load story')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [storyId])

  const handleToggleLike = () => {
    if (liked) {
      removeReaction(storyId)
      setLiked(false)
      setLocalCount(0)
      return
    }

    saveReaction(storyId, {
      reaction_type: 'love',
      story_id: storyId,
      created_at: new Date().toISOString(),
    })

    setLiked(true)
    setLocalCount(1)
  }

  return (
    <main className="min-h-screen bg-[#f5f3fa] pb-10 text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-black">Reaction</h1>
            <p className="text-[11.5px] font-semibold text-[#8d94a1]">Basic heart like</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[560px] px-4 pt-5">
        {message ? (
          <div className="mb-4 rounded-[20px] bg-white px-4 py-3 text-[12px] font-bold text-[#667085] shadow-sm ring-1 ring-black/5">
            {message}
          </div>
        ) : null}

        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex gap-3">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[#eef1f5]">
              {story?.cover_url ? (
                <img src={story.cover_url} alt={story.title || 'Story cover'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
                  <i className="fa-regular fa-bookmark text-[22px]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-black uppercase tracking-[0.08em] text-[#f6a800]">Story</div>
              <h2 className="mt-1 line-clamp-2 text-[18px] font-black leading-6">
                {loading ? 'Loading story...' : story?.title || 'Untitled Story'}
              </h2>
              <p className="mt-2 line-clamp-1 text-[12px] font-bold text-[#8d94a1]">
                {story?.author_page?.page_name ||
                  story?.authorPage?.page_name ||
                  story?.author?.page_name ||
                  story?.author_name ||
                  'Author'}
              </p>
              <p className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#98a2b3]">
                {story?.main_genre || 'Story'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-[#f8f8fb] p-5 text-center">
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={loading}
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-[34px] shadow-sm transition active:scale-95 ${
                liked ? 'bg-[#ffe8ef] text-[#ff2f5f]' : 'bg-white text-[#111827]'
              } disabled:opacity-60`}
              aria-label={liked ? 'Unlike story' : 'Like story'}
            >
              <i className={liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
            </button>

            <div className="mt-4 text-[24px] font-black">{formatNumber(totalLikes)}</div>
            <div className="mt-1 text-[12px] font-bold text-[#8d94a1]">{liked ? 'You liked this story' : 'Tap heart to like'}</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate(`/story/${storyId}`)}
              className="flex h-12 items-center justify-center rounded-full border border-[#eceaf2] bg-white text-[13px] font-black text-[#111827] active:scale-95"
            >
              Story Page
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 items-center justify-center rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, '')}m`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`

  return String(number)
}

export default function ReaderBottomActionBar({ visible, story, episode, onOpenComments, onOpenEcho }) {
  const navigate = useNavigate()
  const storyId = story?.id || story?.story_id || ''
  const episodeId = episode?.id || episode?.episode_id || ''
  const [liked, setLiked] = useState(false)
  const [likeTotal, setLikeTotal] = useState(
    Number(story?.total_likes || story?.like_count || story?.likes_count || 0)
  )
  const [savingLike, setSavingLike] = useState(false)

  const commentCount = formatCompactNumber(episode?.comment_count || episode?.comments_count || story?.total_comments || story?.comment_count || story?.comments_count || 0)
  const echoCount = formatCompactNumber(episode?.echo_count || episode?.echoes_count || story?.echo_count || story?.echoes_count || 0)

  useEffect(() => {
    setLikeTotal(Number(story?.total_likes || story?.like_count || story?.likes_count || 0))
  }, [story?.total_likes, story?.like_count, story?.likes_count])

  useEffect(() => {
    let ignore = false

    async function loadReactionStatus() {
      if (!storyId) return

      try {
        const token = getReaderToken()
        const response = await fetch(`${API_BASE_URL}/api/reactions/story/${storyId}`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) return
        if (ignore) return

        setLiked(Boolean(data.liked))
        setLikeTotal(Number(data.total_likes || 0))
      } catch {
        if (!ignore) {
          setLiked(false)
        }
      }
    }

    loadReactionStatus()

    return () => {
      ignore = true
    }
  }, [storyId])

  const handleLike = async () => {
    if (!storyId || savingLike) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    const previousLiked = liked
    const previousTotal = likeTotal

    setSavingLike(true)
    setLiked(!previousLiked)
    setLikeTotal(Math.max(0, previousTotal + (previousLiked ? -1 : 1)))

    try {
      const response = await fetch(`${API_BASE_URL}/api/reactions/story/${storyId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reaction_type: 'love',
          episode_id: episodeId || null,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update like')
      }

      setLiked(Boolean(data.liked))
      setLikeTotal(Number(data.total_likes || 0))
    } catch {
      setLiked(previousLiked)
      setLikeTotal(previousTotal)
    } finally {
      setSavingLike(false)
    }
  }

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-[95] px-0 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out md:bottom-4 md:px-4 ${
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+16px)]'
      }`}
    >
      <div className="pointer-events-auto mx-auto max-w-3xl border-t border-[#e5e7eb] bg-white/95 shadow-[0_-10px_28px_rgba(17,24,39,0.06)] backdrop-blur md:rounded-[18px] md:border md:shadow-[0_14px_34px_rgba(17,24,39,0.10)]">
        <div className="flex items-center justify-between border-b border-[#eef0f4] px-4 py-2 text-[11px] font-semibold text-[#65676b]">
          <div className={`flex items-center gap-1.5 ${liked ? 'text-[#ff2f5f]' : ''}`}>
            <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`} />
            <span>{formatCompactNumber(likeTotal)}</span>
          </div>

          <div className="flex items-center gap-4 text-[10.5px] text-[#65676b]">
            <span>{commentCount} comments</span>
            <span>{echoCount} echo</span>
          </div>
        </div>

        <div className="grid grid-cols-3 px-2 py-1.5 text-[12px] font-bold text-[#65676b]">
          <button
            type="button"
            onClick={handleLike}
            disabled={savingLike}
            className={`flex h-9 items-center justify-center gap-2 rounded-[12px] active:scale-95 active:bg-[#f2f3f5] disabled:opacity-60 ${
              liked ? 'text-[#ff2f5f]' : ''
            }`}
          >
            <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart text-[15px]`} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button type="button" onClick={onOpenComments} className="flex h-9 items-center justify-center gap-2 rounded-[12px] active:scale-95 active:bg-[#f2f3f5]">
            <i className="fa-regular fa-comment text-[15px]" />
            <span>Comments</span>
          </button>

          <button type="button" onClick={onOpenEcho} className="flex h-9 items-center justify-center gap-2 rounded-[12px] active:scale-95 active:bg-[#f2f3f5]">
            <i className="fa-solid fa-rotate text-[14px]" />
            <span>Echo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

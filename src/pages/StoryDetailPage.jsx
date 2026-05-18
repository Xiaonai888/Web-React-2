import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StoryHeroSection from '../components/story-detail/StoryHeroSection'
import StoryStatsSection from '../components/story-detail/StoryStatsSection'
import StoryInfoSection from '../components/story-detail/StoryInfoSection'
import EpisodePreviewSection from '../components/story-detail/EpisodePreviewSection'
import EpisodeListModal from '../components/story-detail/EpisodeListModal'
import LockedEpisodeModal from '../components/story-detail/LockedEpisodeModal'
import LatestCommentSection from '../components/story-detail/LatestCommentSection'
import CommentsModal from '../components/story-detail/CommentsModal'
import RecommendationSection from '../components/story-detail/RecommendationSection'
import StoryBottomBar from '../components/story-detail/StoryBottomBar'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function LoadingBlock() {
  return (
    <div className="mx-auto mt-5 max-w-4xl rounded-[26px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
      <div className="text-[14px] font-extrabold text-[#667085]">Loading story...</div>
    </div>
  )
}

function ErrorBlock({ message, onBack }) {
  return (
    <div className="mx-auto mt-5 max-w-4xl rounded-[26px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
        <i className="fa-solid fa-triangle-exclamation text-[22px]" />
      </div>
      <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">Cannot load story</h2>
      <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-semibold leading-6 text-[#667085]">
        {message || 'Please try again later.'}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-5 h-12 rounded-full bg-[#111827] px-6 text-[13px] font-extrabold text-white active:scale-95"
      >
        Go Back
      </button>
    </div>
  )
}

function getStoredProgress(storyId, episodes) {
  try {
    const raw = localStorage.getItem(`shadow_story_progress_${storyId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.episodeId) return null
    const found = episodes.find((episode) => episode.id === parsed.episodeId)
    return found || null
  } catch {
    return null
  }
}

export default function StoryDetailPage() {
  const navigate = useNavigate()
  const { id, storyId } = useParams()
  const realStoryId = storyId || id

  const [story, setStory] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [episodeListOpen, setEpisodeListOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [lockedEpisode, setLockedEpisode] = useState(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)
      setMessage('')

      try {
        const [storyResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/stories/${realStoryId}`),
          fetch(`${API_BASE_URL}/api/public/stories/${realStoryId}/episodes`),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Story not found')
        }

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Episodes not found')
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisodes(episodesData.episodes || [])
      } catch (error) {
        if (ignore) return
        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to server. Please check API settings.'
            : error.message || 'Failed to load story'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [realStoryId])

  useEffect(() => {
    try {
      setBookmarked(localStorage.getItem(`shadow_library_${realStoryId}`) === 'true')
      setSubscribed(localStorage.getItem(`shadow_subscribe_${realStoryId}`) === 'true')
    } catch {
      setBookmarked(false)
      setSubscribed(false)
    }
  }, [realStoryId])

  const newestEpisodes = useMemo(() => {
    return [...episodes]
      .sort((a, b) => Number(b.episode_number || 0) - Number(a.episode_number || 0))
      .slice(0, 3)
  }, [episodes])

  const firstEpisode = useMemo(() => {
    return [...episodes].sort((a, b) => Number(a.episode_number || 0) - Number(b.episode_number || 0))[0] || null
  }, [episodes])

  const continueEpisode = useMemo(() => {
    return getStoredProgress(realStoryId, episodes) || firstEpisode
  }, [episodes, firstEpisode, realStoryId])

  const handleOpenEpisode = (episode) => {
    if (!episode) return

    if (episode.is_locked && Number(episode.episode_number || 0) > 1) {
      setLockedEpisode(episode)
      return
    }

    navigate(`/story/${realStoryId}/episode/${episode.id}`)
  }

  const handleToggleBookmark = () => {
    setBookmarked((current) => {
      const next = !current
      localStorage.setItem(`shadow_library_${realStoryId}`, String(next))
      return next
    })
  }

  const handleToggleSubscribe = () => {
    setSubscribed((current) => {
      const next = !current
      localStorage.setItem(`shadow_subscribe_${realStoryId}`, String(next))
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-4">
        <LoadingBlock />
      </div>
    )
  }

  if (message || !story) {
    return (
      <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-4">
        <ErrorBlock message={message} onBack={() => navigate(-1)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[120px]">
      <StoryHeroSection
        story={story}
        onBack={() => navigate(-1)}
        bookmarked={bookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      <main className="mx-auto max-w-5xl px-0 sm:px-4">
        <StoryStatsSection
          story={story}
          episodes={episodes}
          onOpenRating={() => navigate(`/story/${realStoryId}/rating`)}
        />

        <StoryInfoSection story={story} />

        <EpisodePreviewSection
          story={story}
          episodes={newestEpisodes}
          totalEpisodes={episodes.length}
          onOpenEpisode={handleOpenEpisode}
          onOpenAll={() => setEpisodeListOpen(true)}
        />

        <LatestCommentSection
          story={story}
          onOpenComments={() => setCommentsOpen(true)}
        />

        <RecommendationSection story={story} />
      </main>

      <StoryBottomBar
        subscribed={subscribed}
        onToggleSubscribe={handleToggleSubscribe}
        episode={continueEpisode}
        onRead={() => handleOpenEpisode(continueEpisode)}
      />

      <EpisodeListModal
        open={episodeListOpen}
        story={story}
        episodes={episodes}
        onClose={() => setEpisodeListOpen(false)}
        onOpenEpisode={handleOpenEpisode}
      />

      <LockedEpisodeModal
        episode={lockedEpisode}
        onClose={() => setLockedEpisode(null)}
      />

      <CommentsModal
        open={commentsOpen}
        story={story}
        onClose={() => setCommentsOpen(false)}
      />
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
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
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function authHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

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

function StoryAuthorMiniCard({ authorPage, onViewPage }) {
  if (!authorPage) return null

  const followerCount = Number(authorPage.total_followers || 0)
  const followerText =
    followerCount >= 1000
      ? `${(followerCount / 1000).toFixed(followerCount >= 10000 ? 0 : 1).replace(/\.0$/, '')}k followers`
      : `${followerCount} followers`

  const handleOpenPage = () => {
    if (typeof onViewPage === 'function') onViewPage()
  }

  const handleFollowClick = (event) => {
  event.stopPropagation()
}

  return (
    <section className="mt-2 bg-white p-4 shadow-sm sm:mt-4 sm:rounded-[28px] sm:p-5 sm:ring-1 sm:ring-black/5">
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenPage}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleOpenPage()
          }
        }}
        className="flex w-full cursor-pointer items-center gap-3 text-left active:scale-[0.995]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f3fa] text-[18px] font-black text-[#111827] ring-1 ring-black/10 sm:h-14 sm:w-14 sm:text-[20px]">
          {authorPage.avatar_url ? (
            <img src={authorPage.avatar_url} alt={authorPage.page_name} className="h-full w-full object-cover" />
          ) : (
            String(authorPage.page_name || 'A').slice(0, 1).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[15px] font-black text-[#111827]">
            {authorPage.page_name || 'Author Page'}
          </div>

          <div className="mt-0.5 line-clamp-1 text-[12px] font-bold text-[#8d94a1]">
            @{authorPage.page_username || 'author'} · {followerText}
          </div>

          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={handleFollowClick}
              className="h-8 rounded-full bg-[#111827] px-5 text-[12px] font-black text-white active:scale-95"
            >
              Follow
            </button>

            <span className="text-[12px] font-black text-[#8d94a1]">
              View Page
            </span>
          </div>
        </div>
      </div>
    </section>
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
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)
  const [lockedEpisode, setLockedEpisode] = useState(null)
  const [unlockedEpisodeIds, setUnlockedEpisodeIds] = useState([])
  const [bookmarked, setBookmarked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [savingCollection, setSavingCollection] = useState(false)
  const location = useLocation()

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
    let ignore = false

    async function loadCollectionStatus() {
      const token = getReaderToken()

      if (!token || !realStoryId) {
        setBookmarked(false)
        setSubscribed(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/reader/status/${realStoryId}`, {
          headers: authHeaders(),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load collection status')
        }

        if (ignore) return

        setBookmarked(Boolean(data.bookmarked))
        setSubscribed(Boolean(data.subscribed))
      } catch {
        if (ignore) return
        setBookmarked(false)
        setSubscribed(false)
      }
    }

    loadCollectionStatus()

    return () => {
      ignore = true
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
    if (!getReaderToken()) {
  navigate('/login')
  return
}

   const alreadyUnlocked = unlockedEpisodeIds.includes(episode.id)

if (episode.is_locked && Number(episode.episode_number || 0) > 1 && !alreadyUnlocked) {
  setLockedEpisode(episode)
  return
}

    navigate(`/story/${realStoryId}/episode/${episode.id}`)
  }

  const handleToggleBookmark = async () => {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (savingCollection) return

    const next = !bookmarked
    setBookmarked(next)
    setSavingCollection(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/reader/library/${realStoryId}`, {
        method: next ? 'POST' : 'DELETE',
        headers: authHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update library')
      }
    } catch {
      setBookmarked(!next)
    } finally {
      setSavingCollection(false)
    }
  }

  const handleToggleSubscribe = async () => {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (savingCollection) return

    const next = !subscribed
    setSubscribed(next)
    setSavingCollection(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/reader/subscriptions/${realStoryId}`, {
        method: next ? 'POST' : 'DELETE',
        headers: authHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update subscription')
      }
    } catch {
      setSubscribed(!next)
    } finally {
      setSavingCollection(false)
    }
  }

  const handleCommentChanged = () => {
    setCommentRefreshKey((value) => value + 1)
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
  onBack={() => navigate(location.state?.returnTo || '/', { replace: true })}
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

        <StoryAuthorMiniCard
  authorPage={story.author_page}
  onViewPage={() => navigate(`/author/page/${story.author_page?.page_username}`)}
/>

        <LatestCommentSection
          story={story}
          refreshKey={commentRefreshKey}
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
  storyId={realStoryId}
  onClose={() => setLockedEpisode(null)}
  onLogin={() => navigate('/login')}
  onTopUp={() => navigate('/shop')}
  onUnlocked={(episode) => {
    setUnlockedEpisodeIds((current) => [...new Set([...current, episode.id])])
    setLockedEpisode(null)
    navigate(`/story/${realStoryId}/episode/${episode.id}`)
  }}
/>

      <CommentsModal
        open={commentsOpen}
        story={story}
        onClose={() => setCommentsOpen(false)}
        onCommentChanged={handleCommentChanged}
      />
    </div>
  )
}

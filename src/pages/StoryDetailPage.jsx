import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
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

function getCurrentReaderId() {
  try {
    const raw =
      localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') ||
      ''

    if (!raw) return null

    const user = JSON.parse(raw)

    return user.id || user.user_id || null
  } catch {
    return null
  }
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
    <div className="min-h-screen bg-white pb-[130px] sm:bg-[#f5f3fa]">
      <section className="relative bg-[#f5f3fa]">
        <div className="fixed left-0 right-0 top-0 z-50 px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="h-10 w-10 rounded-full bg-white/55" />
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-full bg-white/55" />
              <div className="h-10 w-10 rounded-full bg-white/55" />
            </div>
          </div>
        </div>

        <div className="relative h-[56.25vw] min-h-[200px] max-h-[520px] w-full animate-pulse overflow-hidden bg-[#dfe5ec]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f5f3fa] to-transparent" />

          <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14">
            <div className="h-7 w-3/4 rounded-full bg-white/75" />
            <div className="mt-3 h-4 w-36 rounded-full bg-white/65" />
            <div className="mt-5 flex justify-end gap-1.5">
              <div className="h-2.5 w-7 rounded-full bg-white/75" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/55" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/55" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/55" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-0 sm:px-4">
        <section className="-mt-8 px-4">
          <div className="h-14 animate-pulse rounded-full bg-[#fff4cf]" />
        </section>

        <section className="bg-white px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="mx-auto h-6 w-10 animate-pulse rounded-full bg-[#eef1f5]" />
              <div className="mx-auto mt-2 h-3 w-14 animate-pulse rounded-full bg-[#eef1f5]" />
            </div>
            <div className="text-center">
              <div className="mx-auto h-6 w-10 animate-pulse rounded-full bg-[#eef1f5]" />
              <div className="mx-auto mt-2 h-3 w-14 animate-pulse rounded-full bg-[#eef1f5]" />
            </div>
            <div className="text-center">
              <div className="mx-auto h-6 w-10 animate-pulse rounded-full bg-[#eef1f5]" />
              <div className="mx-auto mt-2 h-3 w-14 animate-pulse rounded-full bg-[#eef1f5]" />
            </div>
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-5">
          <div className="mb-4 h-4 w-20 animate-pulse rounded-full bg-[#eef1f5]" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-full bg-[#eef1f5]" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-[#eef1f5]" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-[#eef1f5]" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#eef1f5]" />
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-5">
          <div className="mb-4 h-5 w-24 animate-pulse rounded-full bg-[#eef1f5]" />

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-[58px] w-[76px] shrink-0 animate-pulse rounded-[10px] bg-[#eef1f5]" />
              <div className="flex-1 pt-1">
                <div className="h-4 w-28 animate-pulse rounded-full bg-[#eef1f5]" />
                <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-[#eef1f5]" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-[58px] w-[76px] shrink-0 animate-pulse rounded-[10px] bg-[#eef1f5]" />
              <div className="flex-1 pt-1">
                <div className="h-4 w-28 animate-pulse rounded-full bg-[#eef1f5]" />
                <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-[#eef1f5]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 pb-4 pt-3">
        <div className="mx-auto grid max-w-5xl grid-cols-[48px_1fr] gap-2">
          <div className="h-12 animate-pulse rounded-full bg-[#eef1f5]" />
          <div className="h-12 animate-pulse rounded-full bg-[#111827]/20" />
        </div>
      </div>
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

function StoryAuthorMiniCard({
  authorPage,
  giftTopFans = [],
  following,
  followerCount,
  followLoading,
  isOwnerPage = false,
  onManagePage,
  onViewPage,
  onFollow,
}) {
  if (!authorPage) return null

  const followers = Number(followerCount || authorPage.total_followers || 0)
  const followerText =
    followers >= 1000
      ? `${(followers / 1000).toFixed(followers >= 10000 ? 0 : 1).replace(/\.0$/, '')}k followers`
      : `${followers} followers`

  const displayTopFans = Array.isArray(giftTopFans)
    ? giftTopFans.slice(0, 3)
    : []

  const topFanCount = Array.isArray(giftTopFans)
    ? giftTopFans.length
    : 0

  const handleOpenPage = () => {
    if (typeof onViewPage === 'function') onViewPage()
  }

  const handleFollowClick = (event) => {
    event.stopPropagation()
    if (typeof onFollow === 'function') onFollow()
  }

  return (
    <section className="mt-2 bg-white px-4 py-5 shadow-sm sm:mt-4 sm:rounded-[22px] sm:px-5 sm:py-6 sm:ring-1 sm:ring-black/5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleOpenPage}
          className="flex min-w-0 flex-1 items-center gap-3 text-left active:scale-[0.995]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f3fa] text-[14px] font-bold text-[#111827] ring-1 ring-black/5">
            {authorPage.avatar_url ? (
              <img src={authorPage.avatar_url} alt={authorPage.page_name} className="h-full w-full object-cover" />
            ) : (
              String(authorPage.page_name || 'A').slice(0, 1).toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[14px] font-bold leading-5 text-[#111827]">
              {authorPage.page_name || 'Author Page'}
            </div>
            <div className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#98a2b3]">
              {followerText}
            </div>
          </div>
        </button>

        <button
  type="button"
  onClick={(event) => {
    event.stopPropagation()

    if (isOwnerPage) {
      onManagePage?.()
      return
    }

    handleOpenPage()
  }}
  className="shrink-0 pt-0 text-[12px] font-semibold text-[#98a2b3] active:scale-95"
>
  {isOwnerPage ? 'Manage Page' : 'View Page'}{' '}
  <i className="fa-solid fa-chevron-right ml-1 text-[9px]" />
</button>
      </div>

     {displayTopFans.length ? (
  <div className="mt-5 -mx-1 flex min-h-[112px] items-start gap-3 rounded-[13px] bg-[#f8fafc] px-4 py-4">
    <div className="min-w-0 flex-1 pt-1">
      <div className="flex items-center gap-1.5 text-[14px] font-normal text-[#111827]">
        <span>Top Fans</span>
        <span className="text-[#d99a00]">
          {`${topFanCount} people in total`}
        </span>
        <i className="fa-solid fa-chevron-right text-[9px] text-[#d99a00]" />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {displayTopFans.map((fan, index) => {
          const avatar = fan.avatar_url || fan.avatar || fan.photo_url || ''
          const name = fan.name || fan.username || 'Fan'

          return (
            <div
              key={fan.id || fan.user_id || name || index}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#f2f3f6] text-[#aeb5c2] ring-1 ring-[#dfe3ea]"
            >
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                <i className="fa-regular fa-user text-[13px]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  </div>
) : null}
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
  const location = useLocation()
  const { id, storyId } = useParams()
  const realStoryId = storyId || id

  const [story, setStory] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [episodesLoading, setEpisodesLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [episodeListOpen, setEpisodeListOpen] = useState(
    () => Boolean(location.state?.reopenEpisodeList)
  )
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)
  const [lockedEpisode, setLockedEpisode] = useState(null)
  const [unlockedEpisodeIds, setUnlockedEpisodeIds] = useState([])
  const [bookmarked, setBookmarked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [savingCollection, setSavingCollection] = useState(false)
  const [authorFollowing, setAuthorFollowing] = useState(false)
  const [authorFollowerCount, setAuthorFollowerCount] = useState(0)
  const [authorFollowLoading, setAuthorFollowLoading] = useState(false)
  const [authorIsOwnerPage, setAuthorIsOwnerPage] = useState(false)
  const [giftTopFans, setGiftTopFans] = useState([])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [realStoryId])

  useLayoutEffect(() => {
    if (!episodeListOpen) return undefined

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [episodeListOpen])

  useEffect(() => {
    let ignore = false

    async function loadGiftTopFans() {
      if (!realStoryId) {
        setGiftTopFans([])
        return
      }

      setGiftTopFans([])

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/gifts/stories/${realStoryId}/top-fans?period=all_time&limit=100`
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load top fans')
        }

        if (!ignore) {
          setGiftTopFans(Array.isArray(data.fans) ? data.fans : [])
        }
      } catch {
        if (!ignore) setGiftTopFans([])
      }
    }

    loadGiftTopFans()

    return () => {
      ignore = true
    }
  }, [realStoryId])

  useLayoutEffect(() => {
    if (!location.state?.reopenEpisodeList) return

    setEpisodeListOpen(true)

    navigate(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        reopenEpisodeList: false,
      },
    })
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)
      setEpisodesLoading(true)
      setMessage('')
      setStory(null)
      setEpisodes([])
      setAuthorFollowing(false)
      setAuthorFollowerCount(0)
      setAuthorIsOwnerPage(false)
      const episodesPromise = fetch(`${API_BASE_URL}/api/public/stories/${realStoryId}/episodes`)
        .then(async (response) => {
          const data = await response.json().catch(() => ({}))

          if (!response.ok || data.ok === false) {
            throw new Error(data.message || 'Episodes not found')
          }

          return data
        })
        .catch((error) => ({ error }))

      try {
        const storyResponse = await fetch(`${API_BASE_URL}/api/public/stories/${realStoryId}`)
        const storyData = await storyResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Story not found')
        }

        if (ignore) return

        const loadedStory = storyData.story || null
        const loadedAuthorPage = loadedStory?.author_page || null
        const currentReaderId = getCurrentReaderId()
        const authorOwnerId =
          loadedAuthorPage?.user_id ||
          loadedAuthorPage?.owner_id ||
          loadedAuthorPage?.created_by ||
          loadedStory?.author_user_id ||
          loadedStory?.user_id ||
          null

        setAuthorIsOwnerPage(Boolean(
          loadedAuthorPage?.is_owner ||
          loadedAuthorPage?.is_owner_page ||
          (currentReaderId && authorOwnerId && String(currentReaderId) === String(authorOwnerId))
        ))

        setStory(loadedStory)
        setAuthorFollowing(Boolean(loadedAuthorPage?.is_following))
        setAuthorFollowerCount(Number(loadedAuthorPage?.total_followers || 0))
        setLoading(false)

        const episodesData = await episodesPromise

        if (ignore) return

        if (episodesData?.error) {
          setEpisodes([])
        } else {
          setEpisodes(episodesData.episodes || [])
        }

        setEpisodesLoading(false)

        const token = getReaderToken()

        if (loadedAuthorPage?.page_username && token) {
          try {
            const authorResponse = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(loadedAuthorPage.page_username)}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            const authorData = await authorResponse.json().catch(() => ({}))

            if (!ignore && authorResponse.ok && authorData.ok !== false) {
              setAuthorFollowing(Boolean(authorData.is_following))
              setAuthorFollowerCount(Number(authorData.total_followers ?? authorData.author_page?.total_followers ?? loadedAuthorPage.total_followers ?? 0))

              const detailAuthorPage = authorData.author_page || {}
              const detailOwnerId =
                detailAuthorPage.user_id ||
                detailAuthorPage.owner_id ||
                detailAuthorPage.created_by ||
                authorData.user_id ||
                null

              setAuthorIsOwnerPage(Boolean(
                authorData.is_owner ||
                detailAuthorPage.is_owner ||
                detailAuthorPage.is_owner_page ||
                (currentReaderId && detailOwnerId && String(currentReaderId) === String(detailOwnerId))
              ))
            }
          } catch {
          }
        }
      } catch (error) {
        if (ignore) return

        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to server. Please check API settings.'
            : error.message || 'Failed to load story'
        )
        setLoading(false)
        setEpisodesLoading(false)
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

  const handleOpenEpisode = (episode, source = 'preview') => {
    if (!episode) return

    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    const alreadyUnlocked = unlockedEpisodeIds.includes(episode.id)

    if (episode.is_locked && Number(episode.episode_number || 0) > 1 && !alreadyUnlocked) {
      navigate(`/story/${realStoryId}/episode/${episode.id}`, {
        state: {
          expectedLocked: true,
          storyPreview: story,
          episodePreview: episode,
          returnSource: source,
        },
      })
      return
    }

    navigate(`/story/${realStoryId}/episode/${episode.id}`, {
      state: {
        storyPreview: story,
        episodePreview: episode,
        returnSource: source,
      },
    })
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

  const handleToggleAuthorFollow = async () => {
    const token = getReaderToken()
    const pageUsername = story?.author_page?.page_username

    if (!token) {
      navigate('/login')
      return
    }

    if (!pageUsername || authorFollowLoading) return

    const nextFollowing = !authorFollowing
    const previousFollowing = authorFollowing
    const previousCount = authorFollowerCount

    setAuthorFollowLoading(true)
    setAuthorFollowing(nextFollowing)
    setAuthorFollowerCount(Math.max(0, previousCount + (nextFollowing ? 1 : -1)))

    try {
      const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/follow`, {
        method: nextFollowing ? 'POST' : 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update follow')
      }

      setAuthorFollowing(Boolean(data.is_following))
      setAuthorFollowerCount(Number(data.total_followers || 0))
    } catch {
      setAuthorFollowing(previousFollowing)
      setAuthorFollowerCount(previousCount)
    } finally {
      setAuthorFollowLoading(false)
    }
  }

  const handleCommentChanged = () => {
    setCommentRefreshKey((value) => value + 1)
  }

  if (loading) {
    return <LoadingBlock />
  }

  if (message || !story) {
    return (
      <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-4">
        <ErrorBlock message={message} onBack={() => navigate(-1)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-[95px] sm:bg-[#f5f3fa] sm:pb-[120px]">
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
          onOpenRanking={() => {
  setCommentsOpen(false)
  setEpisodeListOpen(false)
  setLockedEpisode(null)
  navigate('/ranking')
}}
        />

        <StoryInfoSection story={story} />

        <EpisodePreviewSection
          story={story}
          episodes={newestEpisodes}
          totalEpisodes={episodes.length}
          loading={episodesLoading}
          onOpenEpisode={handleOpenEpisode}
          onOpenAll={() => setEpisodeListOpen(true)}
        />

        <StoryAuthorMiniCard
          authorPage={story.author_page}
          giftTopFans={giftTopFans}
          following={authorFollowing}
          followerCount={authorFollowerCount}
          followLoading={authorFollowLoading}
          isOwnerPage={authorIsOwnerPage}
          onManagePage={() => navigate('/author/dashboard')}
          onViewPage={() => navigate(`/author/page/${story.author_page?.page_username}`)}
          onFollow={handleToggleAuthorFollow}
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
        onTopUp={() => navigate('/shop/mall/purchase', { state: { returnTo: location.pathname } })}
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

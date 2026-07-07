import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const STATIC_START_ITEMS = [
  {
    id: 'music',
    name: 'Music',
    label: 'Music',
    avatar: '♪',
    type: 'feature',
    image: 'linear-gradient(160deg, #4ec7a5 0%, #45b4df 100%)',
  },
  {
    id: 'create',
    name: 'Create story',
    label: 'Create story',
    avatar: '+',
    type: 'create',
    image: 'linear-gradient(160deg, #1f2937 0%, #93c5fd 100%)',
  },
]

const STATIC_END_ITEMS = [
  {
    id: 'new-episode',
    name: 'Luna Hart',
    label: 'New episode',
    avatar: 'LH',
    badge: 'LIVE',
    type: 'feature',
    image: 'linear-gradient(160deg, #111827 0%, #4f46e5 100%)',
  },
  {
    id: 'new-book',
    name: 'Mika Rose',
    label: 'New book',
    avatar: 'MR',
    badge: 'NEW',
    type: 'feature',
    image: 'linear-gradient(160deg, #3b0764 0%, #f472b6 100%)',
  },
  {
    id: 'trending',
    name: 'Nora Vale',
    label: 'Trending',
    avatar: 'NV',
    badge: 'HOT',
    type: 'feature',
    image: 'linear-gradient(160deg, #7f1d1d 0%, #f59e0b 100%)',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getInitial(value) {
  return String(value || 'S').trim().slice(0, 1).toUpperCase()
}

function formatStoryTime(value) {
  const timestamp = new Date(value || 0).getTime()

  if (!timestamp) return 'Just now'

  const difference = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`

  return 'Today'
}

function StaticStoryCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[178px] w-[108px] shrink-0 overflow-hidden rounded-[18px] bg-white text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.98] sm:h-[184px] sm:w-[112px]"
      aria-label={item.name}
    >
      <div className="absolute inset-0" style={{ background: item.image }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/65" />

      <div className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-[14px] font-black text-white shadow-md">
        {item.avatar}
      </div>

      {item.badge ? (
        <div className="absolute right-2 top-3 rounded-full bg-[#f6b800] px-2 py-0.5 text-[9px] font-black text-[#111827] shadow-sm">
          {item.badge}
        </div>
      ) : null}

      {item.type === 'create' ? (
        <div className="absolute left-1/2 top-[68px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white bg-[#1677ff] text-[24px] font-black leading-none text-white shadow-lg sm:top-[72px]">
          +
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 right-3">
        <div className="line-clamp-2 text-[13px] font-black leading-[16px] text-white drop-shadow">
          {item.label}
        </div>
        {item.type === 'feature' && item.name !== item.label ? (
          <div className="mt-1 truncate text-[10px] font-bold text-white/80">{item.name}</div>
        ) : null}
      </div>
    </button>
  )
}

function AuthorStoryCard({ group, onClick }) {
  const author = group.author_page || {}
  const latestStory = group.stories?.[group.stories.length - 1] || null
  const isVideo = latestStory?.media_type === 'video'

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[178px] w-[108px] shrink-0 overflow-hidden rounded-[18px] bg-[#111827] text-left shadow-sm ring-2 ring-[#8b5cf6] ring-offset-2 ring-offset-white transition-transform active:scale-[0.98] sm:h-[184px] sm:w-[112px]"
      aria-label={`View ${author.page_name || 'author'} story`}
    >
      {latestStory?.media_url ? (
        isVideo ? (
          <video
            src={latestStory.media_url}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={latestStory.media_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#db2777]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/80" />

      <div className="absolute left-2 top-2 h-9 w-9 overflow-hidden rounded-full border-[3px] border-white bg-[#111827] shadow-md">
        {author.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={author.page_name || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[13px] font-black text-white">
            {getInitial(author.page_name)}
          </span>
        )}
      </div>

      {group.stories?.length > 1 ? (
        <div className="absolute right-2 top-3 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-black text-white backdrop-blur">
          {group.stories.length}
        </div>
      ) : null}

      {isVideo ? (
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
          <i className="fa-solid fa-play ml-0.5 text-[13px]" />
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 right-3">
        <div className="line-clamp-2 text-[13px] font-black leading-[16px] text-white drop-shadow">
          {group.is_owner ? 'Your story' : author.page_name || 'Author story'}
        </div>
        <div className="mt-1 truncate text-[10px] font-bold text-white/75">
          {formatStoryTime(latestStory?.created_at)}
        </div>
      </div>
    </button>
  )
}

function ViewerAvatar({ author }) {
  return (
    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/80 bg-[#111827]">
      {author?.avatar_url ? (
        <img
          src={author.avatar_url}
          alt={author.page_name || ''}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[13px] font-black text-white">
          {getInitial(author?.page_name)}
        </span>
      )}
    </div>
  )
}

function StoryViewer({ group, onClose }) {
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)
  const stories = group?.stories || []
  const story = stories[storyIndex] || null
  const author = group?.author_page || {}

  useEffect(() => {
    setStoryIndex(0)
    setProgress(0)
  }, [group?.author_page?.id])

  useEffect(() => {
    if (!story || story.media_type === 'video') {
      setProgress(0)
      return undefined
    }

    const startedAt = Date.now()
    const duration = 5000

    const timer = window.setInterval(() => {
      const nextProgress = Math.min(100, ((Date.now() - startedAt) / duration) * 100)
      setProgress(nextProgress)

      if (nextProgress >= 100) {
        window.clearInterval(timer)

        if (storyIndex < stories.length - 1) {
          setStoryIndex((current) => current + 1)
          setProgress(0)
        } else {
          onClose()
        }
      }
    }, 80)

    return () => window.clearInterval(timer)
  }, [story?.id, storyIndex, stories.length, onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function goNext() {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((current) => current + 1)
      setProgress(0)
      return
    }

    onClose()
  }

  function goPrevious() {
    if (storyIndex > 0) {
      setStoryIndex((current) => current - 1)
      setProgress(0)
      return
    }

    setProgress(0)

    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  if (!story) return null

  return (
    <div className="fixed inset-0 z-[200000] bg-black">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[520px] overflow-hidden bg-[#050712]">
        {story.media_type === 'video' ? (
          <video
            key={story.id}
            ref={videoRef}
            src={story.media_url}
            autoPlay
            playsInline
            onTimeUpdate={(event) => {
              const duration = Number(event.currentTarget.duration || 0)
              const currentTime = Number(event.currentTarget.currentTime || 0)

              if (duration > 0) {
                setProgress(Math.min(100, (currentTime / duration) * 100))
              }
            }}
            onEnded={goNext}
            className="h-full w-full object-contain"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-3xl"
              style={{ backgroundImage: `url(${story.media_url})` }}
            />
            <img
              key={story.id}
              src={story.media_url}
              alt=""
              className="relative h-full w-full object-contain"
            />
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75" />

        <div className="absolute inset-x-0 top-0 z-20 px-3 pt-[max(12px,env(safe-area-inset-top))]">
          <div className="flex gap-1">
            {stories.map((item, index) => {
              const width =
                index < storyIndex
                  ? 100
                  : index === storyIndex
                    ? progress
                    : 0

              return (
                <div key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-75"
                    style={{ width: `${width}%` }}
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <ViewerAvatar author={author} />

            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-black text-white">
                {author.page_name || 'Author'}
              </div>
              <div className="mt-0.5 text-[10px] font-bold text-white/65">
                {formatStoryTime(story.created_at)}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur active:scale-95"
              aria-label="Close story"
            >
              <i className="fa-solid fa-xmark text-[20px]" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={goPrevious}
          className="absolute bottom-24 left-0 top-24 z-10 w-1/2"
          aria-label="Previous story"
        />

        <button
          type="button"
          onClick={goNext}
          className="absolute bottom-24 right-0 top-24 z-10 w-1/2"
          aria-label="Next story"
        />

        {story.caption ? (
          <div className="absolute inset-x-5 bottom-[max(32px,env(safe-area-inset-bottom))] z-20">
            <div className="rounded-[18px] bg-black/40 px-4 py-3 text-center text-[14px] font-semibold leading-6 text-white backdrop-blur-xl">
              {story.caption}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function DiscoverStorySection() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGroup, setActiveGroup] = useState(null)

  const requestHeaders = useMemo(() => {
    const token = getAuthToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  useEffect(() => {
    let alive = true

    async function loadStories() {
      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/author-stories/feed?limit=20`, {
          headers: requestHeaders,
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load stories')
        }

        if (alive) {
          setGroups(Array.isArray(data.groups) ? data.groups : [])
        }
      } catch {
        if (alive) setGroups([])
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadStories()

    return () => {
      alive = false
    }
  }, [requestHeaders])

  return (
    <>
      <section className="border-b border-gray-100 bg-white py-3 sm:rounded-b-[22px] sm:border sm:shadow-sm sm:ring-1 sm:ring-gray-100">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 sm:px-4">
          {STATIC_START_ITEMS.map((item) => (
            <StaticStoryCard
              key={item.id}
              item={item}
              onClick={
                item.type === 'create'
                  ? () => navigate('/author/page/story/create')
                  : undefined
              }
            />
          ))}

          {groups.map((group) => (
            <AuthorStoryCard
              key={group.author_page?.id}
              group={group}
              onClick={() => setActiveGroup(group)}
            />
          ))}

          {loading ? (
            <div className="h-[178px] w-[108px] shrink-0 animate-pulse rounded-[18px] bg-gradient-to-br from-gray-200 to-gray-100 sm:h-[184px] sm:w-[112px]" />
          ) : null}

          {STATIC_END_ITEMS.map((item) => (
            <StaticStoryCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {activeGroup ? (
        <StoryViewer
          group={activeGroup}
          onClose={() => setActiveGroup(null)}
        />
      ) : null}
    </>
  )
}

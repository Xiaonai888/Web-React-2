import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_PREVIEW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_AUTHOR_PREVIEW === 'true'

const MOCK_AUTHOR_PAGE = {
  page_name: 'Dara',
  page_username: 'dara-preview',
  avatar_url: '/assets/Icons/shadow-icon-192.png',
}

const MOCK_STORIES = [
  {
    id: 'preview-story-1',
    title: 'Falling Petals',
    story_type: 'Novel',
    status: 'published',
    total_views: 8,
    total_likes: 2,
    total_comments: 1,
    total_episodes: 12,
    cover_url: '/assets/New Arrival/New Arrival 1.jpg',
    main_genre: 'Romance',
    story_language: 'Khmer',
    created_at: '2026-07-01T08:00:00.000Z',
    updated_at: '2026-07-14T08:00:00.000Z',
  },
  {
    id: 'preview-story-2',
    title: 'Moonlit Promise',
    story_type: 'Novel',
    status: 'draft',
    total_views: 7,
    total_likes: 1,
    total_comments: 0,
    total_episodes: 1,
    cover_url: '/assets/New Arrival/New Arrival 2.jpg',
    main_genre: 'Fantasy',
    story_language: 'Khmer',
    created_at: '2026-07-05T08:00:00.000Z',
    updated_at: '2026-07-16T08:00:00.000Z',
  },
  {
    id: 'preview-story-3',
    title: 'Dear Soul, My Light',
    story_type: 'Novel',
    status: 'published',
    total_views: 8,
    total_likes: 3,
    total_comments: 2,
    total_episodes: 6,
    cover_url: '/assets/New Arrival/New Arrival 3.jpg',
    main_genre: 'Drama',
    story_language: 'Khmer',
    created_at: '2026-06-20T08:00:00.000Z',
    updated_at: '2026-07-12T08:00:00.000Z',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function formatDate(value) {
  if (!value) return 'Recently'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Recently'

  return date.toLocaleDateString('en-GB')
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function normalizeStory(story) {
  const status = story.status === 'published'
    ? 'Published'
    : story.status === 'reviewing'
      ? 'Reviewing'
      : 'Draft'

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    type: story.story_type || 'Novel',
    status,
    rawStatus: story.status || 'draft',
    updated: formatDate(story.updated_at || story.created_at),
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    comments: formatCompactNumber(story.total_comments),
    episodes: Number(story.total_episodes || 0),
    cover: story.cover_url || '',
    genre: story.main_genre || 'Novel',
    language: story.story_language || 'Khmer',
    lastEdited: Number(story.total_episodes || 0) > 0
      ? `Episode ${Number(story.total_episodes || 0)}`
      : 'Story Info',
    createdAt: story.created_at,
    updatedAt: story.updated_at || story.created_at,
  }
}

function StatItem({ icon, value, label, iconClass }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center px-1 text-center">
      <i className={`${icon} ${iconClass} text-[17px]`} />
      <div className="mt-1.5 text-[17px] font-black text-[#21143f]">{value}</div>
      <div className="mt-0.5 max-w-full truncate text-[9px] font-bold uppercase tracking-[0.04em] text-[#958ba8]">{label}</div>
    </div>
  )
}

function StoryTypeButton({ icon, title, subtitle, onClick, disabled = false, badge = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-w-0 items-center gap-3 rounded-[20px] border p-3.5 text-left shadow-sm transition active:scale-[0.99] ${
        disabled
          ? 'border-[#eceaf2] bg-[#fafafe] opacity-80'
          : 'border-[#eceaf2] bg-white md:hover:-translate-y-0.5 md:hover:shadow-md'
      }`}
    >
      {badge ? (
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[9.5px] font-black uppercase tracking-[0.04em] ${
            disabled ? 'bg-[#fff7ed] text-[#f97316]' : 'bg-[#ecfdf3] text-[#16803c]'
          }`}
        >
          {badge}
        </span>
      ) : null}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] transition ${
          disabled
            ? 'bg-white text-[#98a2b3] ring-1 ring-[#eceaf2]'
            : 'bg-[#f5f3fa] text-[#111827] group-hover:bg-[#111827] group-hover:text-white'
        }`}
      >
        <i className={`${icon} text-[16px]`} />
      </div>

      <div className="min-w-0 flex-1 pr-14">
        <div className={`line-clamp-1 text-[14px] font-extrabold ${disabled ? 'text-[#667085]' : 'text-[#111827]'}`}>
          {title}
        </div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] font-medium text-[#8d94a1]">
          {subtitle}
        </div>
      </div>

      {disabled ? (
        <i className="fa-solid fa-lock shrink-0 text-[12px] text-[#c0c4cc]" />
      ) : (
        <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />
      )}
    </button>
  )
}

function ToolRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-2 py-2.5 text-left active:bg-[#f4f5f7]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className={`${icon} text-[13px]`} />
      </div>

      <div className="min-w-0">
        <div className="line-clamp-1 text-[13px] font-semibold text-[#111827]">{title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11px] font-normal text-[#8d94a1]">{subtitle}</div>
      </div>
    </button>
  )
}
function PageMenu({ open, onClose, onSelect }) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[330px] md:rounded-[24px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[#111827]">Author Tools</div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7]"
            aria-label="Close author tools"
          >
            <i className="fa-solid fa-times text-[13px] text-[#555]" />
          </button>
        </div>

        <div className="space-y-1">
          
          <ToolRow icon="fa-solid fa-chart-line" title="My Income" subtitle="Earnings and payout details" onClick={() => onSelect('/author/income')} />
          <ToolRow icon="fa-solid fa-gift" title="Quest" subtitle="Tasks and creator rewards" onClick={() => onSelect('/author/quest')} />
          <ToolRow icon="fa-solid fa-crown" title="Author Benefits" subtitle="Creator programs and support" onClick={() => onSelect('/author/benefits')} />
          <ToolRow icon="fa-solid fa-shield-halved" title="Comment Protection" subtitle="Blocked words and hidden comments" onClick={() => onSelect('/author/comment-protection')} />
          <ToolRow icon="fa-regular fa-trash-can" title="Trash" subtitle="Restore deleted stories within 30 days" onClick={() => onSelect('/author/trash')} />
        </div>
      </div>
    </div>
  )
}

function StoriesLoadingState() {
  return (
    <div className="mt-3">
      <div className="flex gap-3 overflow-hidden pb-4">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="shrink-0"
            style={{ width: 'clamp(82px, calc((100vw - 56px) / 3), 126px)' }}
          >
            <div className="aspect-[3/4] animate-pulse rounded-[18px] bg-[#e9e2f8]" />
            <div className="mx-auto mt-2 h-1.5 w-1.5 rounded-full bg-[#d6c7f4]" />
          </div>
        ))}
      </div>

      <div className="animate-pulse rounded-[22px] border border-[#e8def8] bg-white p-4 shadow-sm">
        <div className="h-5 w-1/2 rounded-full bg-[#e9e2f8]" />
        <div className="mt-3 h-4 w-2/3 rounded-full bg-[#f0ebf9]" />
        <div className="mt-5 h-12 rounded-[14px] bg-[#f0ebf9]" />
        <div className="mt-4 h-11 rounded-[14px] bg-[#e9e2f8]" />
      </div>
    </div>
  )
}

function EmptyCover({ title }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#111827] to-[#374151] px-2 text-center">
      <span className="line-clamp-3 text-[10px] font-extrabold leading-4 text-white/80">{title}</span>
    </div>
  )
}

function StoryCoverButton({ story, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="shrink-0 text-left"
      style={{ width: 'clamp(82px, calc((100vw - 56px) / 3), 126px)' }}
      aria-pressed={active}
      aria-label={`Select ${story.title}`}
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-[18px] bg-[#2b174f] transition active:scale-[0.98] ${
          active
            ? 'ring-2 ring-[#8050e8] ring-offset-2 ring-offset-[#f7f4ff] shadow-[0_10px_24px_rgba(109,66,219,0.35)]'
            : 'shadow-[0_8px_20px_rgba(50,27,91,0.14)]'
        }`}
      >
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="h-full w-full object-cover" />
        ) : (
          <EmptyCover title={story.title} />
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f103d]/95 to-transparent px-2 pb-2 pt-7 text-center">
          <span className="line-clamp-1 text-[9.5px] font-bold text-white/90">
            {story.episodes > 0 ? `Episode ${story.episodes}` : 'Story Info'}
          </span>
        </div>
      </div>

      <div
        className={`mx-auto mt-2 h-1.5 rounded-full transition-all ${
          active ? 'w-5 bg-[#7c4dea]' : 'w-1.5 bg-[#d7cbed]'
        }`}
      />
    </button>
  )
}

function StoryDetailPanel({ story, onEdit, onAddEpisode }) {
  const statusClass =
    story.status === 'Published'
      ? 'bg-[#eafaf0] text-[#16803c]'
      : story.status === 'Reviewing'
        ? 'bg-[#fff7df] text-[#a56a00]'
        : 'bg-[#f0eaff] text-[#7040d8]'

  return (
    <div className="rounded-[22px] border border-[#e7ddf8] bg-white p-4 shadow-[0_12px_30px_rgba(67,35,120,0.1)]">
      <h3 className="line-clamp-1 text-[19px] font-black tracking-[-0.02em] text-[#21143f]">{story.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-[#f0eaff] px-2.5 py-1 text-[9.5px] font-extrabold text-[#7040d8]">{story.type}</span>
        <span className="rounded-full bg-[#f5f1ff] px-2.5 py-1 text-[9.5px] font-extrabold text-[#8a5ce6]">{story.genre}</span>
        <span className={`rounded-full px-2.5 py-1 text-[9.5px] font-extrabold ${statusClass}`}>
          {story.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 divide-x divide-[#eee8f7]">
        <div className="flex flex-col items-center gap-1 text-[#665c76]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#35264f]">
            <i className="fa-regular fa-eye text-[10px] text-[#8a5ce6]" />
            {story.views}
          </span>
          <span className="text-[9px] font-semibold">Views</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#665c76]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#35264f]">
            <i className="fa-solid fa-heart text-[10px] text-[#a86cf2]" />
            {story.likes}
          </span>
          <span className="text-[9px] font-semibold">Likes</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#665c76]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#35264f]">
            <i className="fa-regular fa-comment text-[10px] text-[#8a5ce6]" />
            {story.comments}
          </span>
          <span className="text-[9px] font-semibold">Comments</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[#665c76]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#35264f]">
            <i className="fa-solid fa-list text-[9px] text-[#8a5ce6]" />
            {story.episodes}
          </span>
          <span className="text-[9px] font-semibold">Episodes</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onAddEpisode(story)}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-3 py-3 text-[11.5px] font-extrabold text-white shadow-[0_8px_18px_rgba(109,66,219,0.28)] active:scale-[0.98]"
        >
          <i className="fa-solid fa-plus text-[11px]" />
          Add Episode
        </button>

        <button
          type="button"
          onClick={() => onEdit(story)}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#d8c9f3] bg-white px-3 py-3 text-[11.5px] font-extrabold text-[#5c3cb2] active:scale-[0.98]"
        >
          <i className="fa-solid fa-gear text-[11px]" />
          Manage
        </button>
      </div>
    </div>
  )
}

export default function AuthorDashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.returnTo || '/me'
  const [menuOpen, setMenuOpen] = useState(false)
  const [stories, setStories] = useState([])
  const [selectedStoryId, setSelectedStoryId] = useState(null)
  const [loading, setLoading] = useState(!AUTHOR_PREVIEW_ENABLED)
  const [message, setMessage] = useState('')

  const storedUser = JSON.parse(localStorage.getItem('shadow_reader_user') || 'null')
  const storedAuthorPage = JSON.parse(localStorage.getItem('shadow_author_page') || 'null')

  const [authorPage, setAuthorPage] = useState(
    AUTHOR_PREVIEW_ENABLED ? MOCK_AUTHOR_PAGE : storedAuthorPage
  )

  const author = {
  name: authorPage?.page_name || storedUser?.name || storedUser?.username || 'Author Page Name',
  username: authorPage?.page_username || '',
  avatarUrl: authorPage?.avatar_url || '',
  avatarLetter: (authorPage?.page_name || storedUser?.name || storedUser?.username || 'A').charAt(0).toUpperCase(),
}

  const authorPagePath = author.username
    ? `/author/page/${encodeURIComponent(author.username)}`
    : '/author/page'

  async function fetchMyAuthorPage() {
    if (AUTHOR_PREVIEW_ENABLED) {
      setAuthorPage(MOCK_AUTHOR_PAGE)
      return MOCK_AUTHOR_PAGE
    }

    const token = getAuthToken()

    if (!token) {
      return null
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false || !data.author_page) {
        return null
      }

      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      setAuthorPage(data.author_page)

      return data.author_page
    } catch {
      return null
    }
  }

  async function fetchMyStories() {
    if (AUTHOR_PREVIEW_ENABLED) {
      setMessage('')
      setStories(MOCK_STORIES.map(normalizeStory))
      setLoading(false)
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/stories/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load stories')
      }

      setStories((data.stories || []).map(normalizeStory))
    } catch (error) {
      setStories([])
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Please check backend deployment.'
          : error.message || 'Failed to load stories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyAuthorPage()
    fetchMyStories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const published = stories.filter((story) => story.rawStatus === 'published').length
    const drafts = stories.filter((story) => story.rawStatus !== 'published').length
    const views = stories.reduce((sum, story) => sum + Number(String(story.views).replace(/[^\d.]/g, '') || 0), 0)

    return {
      published: String(published).padStart(2, '0'),
      drafts: String(drafts).padStart(2, '0'),
      views: formatCompactNumber(views),
    }
  }, [stories])

  const latestStory = useMemo(() => {
    return [...stories].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0] || null
  }, [stories])

  const selectedStory = useMemo(() => {
    if (stories.length === 0) return null

    return stories.find((story) => String(story.id) === String(selectedStoryId)) || stories[0]
  }, [selectedStoryId, stories])

  const handleMenuSelect = async (path) => {
    setMenuOpen(false)

    if (path === '/author/page') {
      const latestAuthorPage = await fetchMyAuthorPage()

      if (!latestAuthorPage?.page_username) {
        setMessage('Author page data is missing. Please refresh and try again.')
        return
      }

      navigate(`/author/page/${encodeURIComponent(latestAuthorPage.page_username)}`)
      return
    }

    navigate(path)
  }

  const handleCreateStory = (type) => {
    navigate(`/author/create-story?type=${encodeURIComponent(type)}`)
  }
  const handleComingSoon = (type) => {
    setMessage(`${type} is coming soon. Novel publishing is available now.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditStory = (story) => {
  navigate(`/author/story/${story.id}/manage`)
}

  const handleAddEpisode = (story) => {
    navigate(`/author/story/${story.id}/episode/create?first=0`)
  }

  return (
    <div className="min-h-screen bg-[#f7f4ff] pb-[120px]">
      <PageMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={handleMenuSelect} />

      <header className="sticky top-0 z-50 border-b border-[#ede9f4] bg-white px-4 py-3">
        <div className="mx-auto grid max-w-5xl grid-cols-[72px_1fr_72px] items-center">
          <button
            type="button"
            onClick={() => navigate(returnTo)}
            className="flex h-9 w-9 items-center justify-center justify-self-start bg-transparent text-[#111827] active:opacity-60"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-center text-[17px] font-normal text-[#111827]">Author Dashboard</h1>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate('/author/notifications')}
              className="flex h-9 w-9 items-center justify-center bg-transparent text-[#111827] active:opacity-60"
              aria-label="Notifications"
            >
              <i className="fa-regular fa-bell text-[16px]" />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center bg-transparent text-[#111827] active:opacity-60"
              aria-label="Author tools"
            >
              <i className="fa-solid fa-ellipsis text-[16px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <section className="relative -mx-4 overflow-hidden bg-gradient-to-br from-[#6d42db] via-[#8251e9] to-[#a476f4] px-5 pb-5 pt-6 shadow-[0_14px_35px_rgba(96,55,177,0.2)]">
          <div className="absolute -left-12 top-5 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#d9c6ff]/25 blur-2xl" />
          <i className="fa-solid fa-sparkles absolute right-[18%] top-7 text-[13px] text-white/40" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white/20 p-1 shadow-lg ring-1 ring-white/40">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#2b174f] text-[24px] font-extrabold text-white">
  {author.avatarUrl ? (
    <img
      src={author.avatarUrl}
      alt={author.name}
      className="h-full w-full object-cover"
    />
  ) : (
    author.avatarLetter
  )}
              </div>
              <button
                type="button"
                onClick={() => navigate(authorPagePath)}
                className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#7444df] shadow-md ring-2 ring-[#8352e9] active:scale-95"
                aria-label="Open author profile"
              >
                <i className="fa-solid fa-pen text-[9px]" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-white/75">{getGreeting()},</div>
              <div className="mt-0.5 line-clamp-1 text-[23px] font-black tracking-[-0.02em] text-white">{author.name}</div>
              <div className="mt-1 text-[11.5px] font-medium text-white/75">Keep writing. Your story is waiting.</div>
            </div>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-4 divide-x divide-[#eee8f7] rounded-[22px] bg-white px-1 py-3.5 shadow-[0_12px_28px_rgba(53,25,104,0.18)]">
            <StatItem icon="fa-solid fa-book-open" iconClass="text-[#7c4dea]" value={stats.published} label="Published" />
            <StatItem icon="fa-solid fa-file-lines" iconClass="text-[#a368f4]" value={stats.drafts} label="Drafts" />
            <StatItem icon="fa-regular fa-eye" iconClass="text-[#8b74ea]" value={stats.views} label="Views" />
            <button
              type="button"
              onClick={() => handleCreateStory('Novel')}
              className="flex min-w-0 flex-col items-center justify-center px-1 text-center active:scale-95"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#9b6af5] to-[#6d42db] text-white shadow-[0_6px_14px_rgba(109,66,219,0.35)]">
                <i className="fa-solid fa-plus text-[12px]" />
              </span>
              <span className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#6d42db]">New Story</span>
            </button>
          </div>
        </section>

        {latestStory ? (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eee7ff] text-[#7c4dea]">
                  <i className="fa-solid fa-sparkles text-[11px]" />
                </span>
                <h2 className="text-[16px] font-extrabold text-[#21143f]">Continue Writing</h2>
              </div>

              <button
                type="button"
                onClick={() => handleEditStory(latestStory)}
                className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#7c4dea] active:scale-95"
              >
                View
                <i className="fa-solid fa-chevron-right text-[9px]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleEditStory(latestStory)}
              className="group relative mt-3 h-[220px] w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4d278f] via-[#7544d1] to-[#aa7bf5] text-left shadow-[0_16px_34px_rgba(86,46,155,0.24)] active:scale-[0.995] sm:h-[260px] md:h-[310px]"
              aria-label={`Continue writing ${latestStory.title}`}
            >
              {latestStory.cover ? (
                <img
                  src={latestStory.cover}
                  alt={latestStory.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#4d278f] via-[#7544d1] to-[#b184f7]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#1f103d] via-[#3a1d66]/55 to-[#6d42db]/10" />
              <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/20 blur-3xl" />

              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-[#6d42db] shadow-sm backdrop-blur">
                <i className="fa-solid fa-pen-nib text-[9px]" />
                Latest draft
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1 text-white">
                  <div className="line-clamp-1 text-[19px] font-black tracking-[-0.02em] sm:text-[22px]">{latestStory.title}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-semibold text-white/75">
                    <span>{latestStory.lastEdited}</span>
                    <span className="h-1 w-1 rounded-full bg-[#d8c7ff]" />
                    <span>Updated {latestStory.updated}</span>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#9a6af5] to-[#6d42db] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-[0_8px_18px_rgba(36,15,77,0.3)] ring-1 ring-white/25">
                  Continue
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </span>
              </div>
            </button>
          </section>
        ) : null}

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#111827]">Create Story</h2>
            <p className="mt-0.5 text-[11.5px] font-medium text-[#8d94a1]">Start a new story format</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <StoryTypeButton
  icon="fa-solid fa-book-open"
  title="Novel"
  subtitle="Text episodes"
  onClick={() => handleCreateStory('Novel')}
/>

<StoryTypeButton
  icon="fa-solid fa-image"
  title="Manga"
  subtitle="Image chapters"
  badge="Soon"
  disabled
  onClick={() => handleComingSoon('Manga')}
/>

<StoryTypeButton
  icon="fa-solid fa-comments"
  title="Chat Story"
  subtitle="Message style"
  badge="Soon"
  disabled
  onClick={() => handleComingSoon('Chat Story')}
/>
          </div>
        </section>

        <section id="author-stories" className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#21143f]">Stories</h2>
            <div className="text-[11px] font-bold text-[#958ba8]">
              {loading ? 'Loading...' : `${stories.length} stories`}
            </div>
          </div>

          {loading ? (
            <StoriesLoadingState />
          ) : stories.length > 0 && selectedStory ? (
            <>
              <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-4 pt-1">
                {stories.map((story) => (
                  <StoryCoverButton
                    key={story.id}
                    story={story}
                    active={String(story.id) === String(selectedStory.id)}
                    onSelect={() => setSelectedStoryId(story.id)}
                  />
                ))}
              </div>

              <StoryDetailPanel
                story={selectedStory}
                onEdit={handleEditStory}
                onAddEpisode={handleAddEpisode}
              />
            </>
          ) : (
            <div className="mt-3 rounded-[22px] border border-dashed border-[#d8c9f3] bg-white px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f0eaff] text-[#7040d8]">
                <i className="fa-solid fa-pen-nib text-[17px]" />
              </div>

              <div className="mt-3 text-[14px] font-extrabold text-[#21143f]">No stories yet</div>
              <div className="mt-1 text-[12px] text-[#958ba8]">Create your first story to see it here.</div>

              <button
                type="button"
                onClick={() => handleCreateStory('Novel')}
                className="mt-4 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-5 py-2.5 text-[12px] font-extrabold text-white active:scale-95"
              >
                Create Story
              </button>
            </div>
          )}
        </section>
      </main>
      <AuthorStudioBottomNav />
    </div>
  )
}


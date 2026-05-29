import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

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

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[16px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.05em] text-[#9aa1ad]">{label}</div>
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
      className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827]">
          <i className={`${icon} text-[14px]`} />
        </div>

        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827]">{title}</div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">{subtitle}</div>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />
    </button>
  )
}

function PageMenu({ open, onClose, onSelect }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[330px] md:rounded-[24px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827]">Author Tools</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1]">Page, income, and settings</div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7]">
            <i className="fa-solid fa-times text-[13px] text-[#555]" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white">
          <div className="divide-y divide-[#f0eef6]">
            <ToolRow icon="fa-regular fa-user" title="View Page" subtitle="Open your public author page" onClick={() => onSelect('/author/page')} />
            <ToolRow icon="fa-regular fa-pen-to-square" title="Edit Page" subtitle="Avatar, name, and page details" onClick={() => onSelect('/author/edit-page')} />
            <ToolRow icon="fa-solid fa-chart-line" title="My Income" subtitle="Earnings and payout details" onClick={() => onSelect('/author/income')} />
            <ToolRow icon="fa-solid fa-gift" title="Quest" subtitle="Tasks and creator rewards" onClick={() => onSelect('/author/quest')} />
            <ToolRow icon="fa-solid fa-crown" title="Author Benefits" subtitle="Creator programs and support" onClick={() => onSelect('/author/benefits')} />
            <ToolRow icon="fa-solid fa-gear" title="Settings" subtitle="Privacy and author options" onClick={() => onSelect('/author/settings')} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TipBubble({ open }) {
  if (!open) return null

  return (
    <div className="absolute right-0 top-9 z-20 w-[230px] rounded-[16px] bg-[#111827] px-3.5 py-3 text-[12px] font-semibold leading-5 text-white shadow-xl">
      Tap any cover to manage your story and add episodes.
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="flex gap-3 rounded-[20px] border border-[#eceaf2] bg-white p-3 shadow-sm">
      <div className="h-[112px] w-[78px] shrink-0 animate-pulse rounded-[14px] bg-[#eef0f4]" />
      <div className="min-w-0 flex-1 py-1">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#eef0f4]" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-[#eef0f4]" />
        <div className="mt-5 h-3 w-3/4 animate-pulse rounded-full bg-[#eef0f4]" />
        <div className="mt-4 h-3 w-1/2 animate-pulse rounded-full bg-[#eef0f4]" />
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

function StoryCard({ story, onEdit, onAddEpisode }) {
  const statusClass =
    story.status === 'Published'
      ? 'bg-[#ecfdf3] text-[#16803c]'
      : story.status === 'Reviewing'
        ? 'bg-[#fff7df] text-[#a56a00]'
        : 'bg-[#f2f4f7] text-[#667085]'

  return (
    <div className="flex gap-3 rounded-[20px] border border-[#eceaf2] bg-white p-3 shadow-sm">
      <button
        type="button"
        onClick={() => onEdit(story)}
        className="h-[112px] w-[78px] shrink-0 overflow-hidden rounded-[14px] bg-[#111827] shadow-sm active:scale-[0.98]"
        aria-label={`Manage ${story.title}`}
      >
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="h-full w-full object-cover" />
        ) : (
          <EmptyCover title={story.title} />
        )}
      </button>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onEdit(story)}
              className="block max-w-full text-left"
            >
              <div className="line-clamp-1 text-[14.5px] font-extrabold text-[#111827]">{story.title}</div>
            </button>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10px] font-bold text-[#555b66]">{story.type}</span>
              <span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-[10px] font-bold text-[#0b5cff]">{story.genre}</span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass}`}>
                {story.status}
              </span>
            </div>
          </div>

          <button type="button" onClick={() => onEdit(story)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-pen text-[12px]" />
          </button>
        </div>

        <div className="mt-3 text-[11.5px] text-[#8d94a1]">
          Last updated <span className="font-bold text-[#555b66]">{story.updated}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-[#555b66]">
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-eye text-[11px]" />
            {story.views}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-heart text-[10px] text-[#e5484d]" />
            {story.likes}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-comment text-[11px]" />
            {story.comments}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-list text-[10px]" />
            {story.episodes} EP
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(story)}
            className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-extrabold text-white active:scale-95"
          >
            Manage
          </button>

          <button
            type="button"
            onClick={() => onAddEpisode(story)}
            className="rounded-full bg-[#0b5cff] px-3 py-1.5 text-[11px] font-extrabold text-white active:scale-95"
          >
            Add Episode
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorDashboardPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tipOpen, setTipOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Novel')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const storedUser = JSON.parse(localStorage.getItem('shadow_reader_user') || 'null')
const storedAuthorPage = JSON.parse(localStorage.getItem('shadow_author_page') || 'null')

const [authorPage, setAuthorPage] = useState(storedAuthorPage)

const author = {
  name: authorPage?.page_name || storedUser?.name || storedUser?.username || 'Author Page Name',
  username: authorPage?.page_username || '',
  avatarLetter: (authorPage?.page_name || storedUser?.name || storedUser?.username || 'A').charAt(0).toUpperCase(),
}

const authorPagePath = author.username
  ? `/author/page/${encodeURIComponent(author.username)}`
  : '/author/page'

  async function fetchMyStories() {
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

  const filteredStories = useMemo(() => {
    return stories.filter((story) => story.type === activeTab)
  }, [stories, activeTab])

  const latestStory = useMemo(() => {
    return [...stories].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0] || null
  }, [stories])

  const handleMenuSelect = (path) => {
  setMenuOpen(false)

  if (path === '/author/page') {
    navigate(authorPagePath)
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
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <PageMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={handleMenuSelect} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/me')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Author Dashboard</h1>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
            aria-label="Author tools"
          >
            <i className="fa-solid fa-ellipsis text-[15px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-[#111827] text-[24px] font-extrabold text-white shadow-sm">
              {author.avatarLetter}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">{author.name}</div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate(authorPagePath)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11.5px] font-extrabold text-[#111827] active:scale-95"
                >
                  View Page
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-[#eef0f4] rounded-[20px] bg-[#fafafe] px-2 py-3.5">
            <StatItem value={stats.published} label="Published" />
            <StatItem value={stats.drafts} label="Unpublished" />
            <StatItem value={stats.views} label="Views" />
          </div>
        </section>

        {latestStory ? (
          <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#111827]">Continue Writing</h2>
                <p className="mt-0.5 text-[11.5px] font-medium text-[#8d94a1]">Continue your latest story</p>
              </div>

              <button
                type="button"
                onClick={() => handleEditStory(latestStory)}
                className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
              >
                Continue
              </button>
            </div>

            <div className="mt-4 flex gap-3 rounded-[20px] bg-[#fafafe] p-3">
              <button
                type="button"
                onClick={() => handleEditStory(latestStory)}
                className="h-[98px] w-[70px] shrink-0 overflow-hidden rounded-[14px] bg-[#111827] active:scale-[0.98]"
                aria-label="Continue latest story"
              >
                {latestStory.cover ? (
                  <img src={latestStory.cover} alt={latestStory.title} className="h-full w-full object-cover" />
                ) : (
                  <EmptyCover title={latestStory.title} />
                )}
              </button>

              <div className="min-w-0 flex-1 py-1">
                <div className="line-clamp-1 text-[14.5px] font-extrabold text-[#111827]">{latestStory.title}</div>
                <div className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#555b66] ring-1 ring-[#eceaf2]">
                  {latestStory.type}
                </div>
                <div className="mt-3 text-[12px] text-[#8d94a1]">
                  Last edited <span className="ml-1 font-extrabold text-[#111827]">{latestStory.lastEdited}</span>
                </div>
                <div className="mt-1 text-[11.5px] text-[#8d94a1]">Updated {latestStory.updated}</div>
              </div>
            </div>
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

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="relative">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-extrabold text-[#111827]">My Stories</h2>
                <button
                  type="button"
                  onClick={() => setTipOpen((value) => !value)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-[#555b66] shadow-sm ring-1 ring-[#eceaf2]"
                  aria-label="Show edit tip"
                >
                  ?
                </button>
              </div>
              <TipBubble open={tipOpen} />
            </div>

            <div className="text-[12px] font-bold text-[#8d94a1]">
              {loading ? 'Loading...' : `${filteredStories.length} stories`}
            </div>
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3">
            {['Novel', 'Manga', 'Chat Story'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold ${
                  activeTab === tab ? 'bg-[#111827] text-white' : 'bg-white text-[#555b66] ring-1 ring-[#eceaf2]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {loading ? (
              <>
                <LoadingCard />
                <LoadingCard />
              </>
            ) : filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onEdit={handleEditStory}
                  onAddEpisode={handleAddEpisode}
                />
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#d8dbe3] bg-white px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                  <i className="fa-solid fa-pen-nib text-[17px]" />
                </div>

                <div className="mt-3 text-[14px] font-extrabold text-[#111827]">
                  No {activeTab} stories yet
                </div>

                <div className="mt-1 text-[12px] text-[#8d94a1]">
                  Create your first {activeTab} story or refresh after uploading.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'Novel') {
                      handleCreateStory(activeTab)
                    } else {
                      handleComingSoon(activeTab)
                    }
                  }}
                  className="mt-4 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-extrabold text-white active:scale-95"
                >
                  {activeTab === 'Novel' ? `Create ${activeTab}` : `${activeTab} Coming Soon`}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

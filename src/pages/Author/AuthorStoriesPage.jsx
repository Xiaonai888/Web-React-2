import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_PREVIEW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_AUTHOR_PREVIEW === 'true'

const MOCK_STORIES = [
  {
    id: 'preview-story-1',
    title: 'Falling Petals',
    status: 'published',
    total_views: 12400,
    total_episodes: 12,
    cover_url: '/assets/New Arrival/New Arrival 1.jpg',
    updated_at: '2026-07-16T08:00:00.000Z',
  },
  {
    id: 'preview-story-2',
    title: 'CLONE',
    status: 'published',
    total_views: 9300,
    total_episodes: 10,
    cover_url: '/assets/New Arrival/New Arrival 2.jpg',
    updated_at: '2026-07-15T08:00:00.000Z',
  },
  {
    id: 'preview-story-3',
    title: 'Dear Soul, My Light',
    status: 'draft',
    total_views: 2100,
    total_episodes: 8,
    cover_url: '/assets/New Arrival/New Arrival 3.jpg',
    updated_at: '2026-07-13T08:00:00.000Z',
  },
  {
    id: 'preview-story-4',
    title: 'Moonlit Promise',
    status: 'scheduled',
    total_views: 1800,
    total_episodes: 6,
    cover_url: '/assets/Must Read pic/Must Read 3.jpg',
    updated_at: '2026-07-11T08:00:00.000Z',
  },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Draft' },
  { id: 'scheduled', label: 'Scheduled' },
]

const SORT_OPTIONS = [
  { id: 'updated', label: 'Recently updated' },
  { id: 'views', label: 'Most viewed' },
  { id: 'episodes', label: 'Most episodes' },
  { id: 'title', label: 'A–Z' },
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
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace('.0', '')}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace('.0', '')}K`
  }

  return String(number)
}

function normalizeStatus(value) {
  const status = String(value || 'draft').toLowerCase()

  if (status === 'published') return 'published'
  if (status === 'scheduled') return 'scheduled'
  return 'draft'
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    status: normalizeStatus(story.status),
    views: Number(story.total_views || 0),
    episodes: Number(story.total_episodes || 0),
    cover: story.cover_url || '',
    updatedAt: story.updated_at || story.created_at || '',
  }
}

function StatItem({ icon, label, value }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-center px-1 py-1 text-center after:absolute after:-right-px after:top-2 after:h-[54px] after:w-px after:bg-[#eeeaf7] last:after:hidden">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2edff] text-[#7248f5]">
        <i className={`${icon} text-[16px]`} />
      </span>
      <span className="mt-2 text-[11px] font-semibold text-[#6f687c]">{label}</span>
      <strong className="mt-0.5 max-w-full truncate text-[18px] font-black text-[#6840ef]">{value}</strong>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    published: 'bg-[#7951f4] text-white',
    draft: 'bg-white text-[#4f475d]',
    scheduled: 'bg-[#6f687c]/85 text-white',
  }

  return (
    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold capitalize shadow-sm ${styles[status]}`}>
      {status}
    </span>
  )
}

function StoryCover({ story, className = '' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#eee8ff] to-[#d9cdfd] ${className}`}>
      {story.cover && !failed ? (
        <img
          src={story.cover}
          alt={story.title}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center px-3 text-center text-[#7651e9]">
          <i className="fa-solid fa-book-open text-[30px]" />
          <span className="mt-3 line-clamp-2 text-[12px] font-extrabold">{story.title}</span>
        </div>
      )}
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ece8f4] bg-white shadow-sm">
      <div className="aspect-[3/4] animate-pulse bg-[#eeeaf6]" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#eeeaf6]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#f3f0f8]" />
      </div>
    </div>
  )
}

function EmptyState({ searching, onCreate }) {
  return (
    <div className="col-span-full rounded-[10px] border border-dashed border-[#d9cff6] bg-white px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0eaff] text-[#744af3]">
        <i className={`fa-solid ${searching ? 'fa-magnifying-glass' : 'fa-feather-pointed'} text-[20px]`} />
      </span>
      <h3 className="mt-4 text-[16px] font-black text-[#1c1725]">
        {searching ? 'No matching stories' : 'Create your first story'}
      </h3>
      <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-5 text-[#81798f]">
        {searching
          ? 'Try another title or choose a different status.'
          : 'Your published stories and drafts will appear here.'}
      </p>
      {!searching ? (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 rounded-full bg-[#7047f3] px-5 py-2.5 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(112,71,243,0.24)] active:scale-95"
        >
          Create Story
        </button>
      ) : null}
    </div>
  )
}

export default function AuthorStoriesPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('updated')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [menuStoryId, setMenuStoryId] = useState(null)

  async function fetchStories() {
    if (AUTHOR_PREVIEW_ENABLED) {
      setStories(MOCK_STORIES.map(normalizeStory))
      setError('')
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
      setError('')

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
    } catch (fetchError) {
      setStories([])
      setError(
        fetchError.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Please check the backend server.'
          : fetchError.message || 'Failed to load stories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  useEffect(() => {
    if (!menuStoryId) return undefined

    const closeMenu = () => setMenuStoryId(null)
    window.addEventListener('resize', closeMenu)
    window.addEventListener('scroll', closeMenu, true)

    return () => {
      window.removeEventListener('resize', closeMenu)
      window.removeEventListener('scroll', closeMenu, true)
    }
  }, [menuStoryId])

  const stats = useMemo(() => {
    return {
      all: stories.length,
      published: stories.filter((story) => story.status === 'published').length,
      drafts: stories.filter((story) => story.status === 'draft').length,
      views: stories.reduce((total, story) => total + story.views, 0),
    }
  }, [stories])

  const latestStory = useMemo(() => {
    return [...stories].sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    )[0] || null
  }, [stories])

  const visibleStories = useMemo(() => {
    const query = search.trim().toLowerCase()
    const nextStories = stories.filter((story) => {
      const matchesFilter = filter === 'all' || story.status === filter
      const matchesSearch = !query || story.title.toLowerCase().includes(query)
      return matchesFilter && matchesSearch
    })

    return nextStories.sort((a, b) => {
      if (sort === 'views') return b.views - a.views
      if (sort === 'episodes') return b.episodes - a.episodes
      if (sort === 'title') return a.title.localeCompare(b.title)
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    })
  }, [filter, search, sort, stories])

  const selectedStory = stories.find((story) => String(story.id) === String(menuStoryId)) || null

  const closeSearch = () => {
    setSearch('')
    setSearchOpen(false)
  }

  const openStory = (story) => {
    navigate(`/author/story/${story.id}/manage`)
  }

  const runStoryAction = (path) => {
    setMenuStoryId(null)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#f8f6fc] pb-[100px] text-[#1c1725]">
      <header className="sticky top-0 z-40 border-b border-[#ece8f3] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-5xl items-center px-4">
          {searchOpen ? (
            <div className="flex w-full items-center gap-3 rounded-full border border-[#dfd7f2] bg-[#faf8ff] px-4 py-2.5 focus-within:border-[#9479ec]">
              <i className="fa-solid fa-magnifying-glass text-[14px] text-[#7351dc]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stories..."
                autoFocus
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#1c1725] outline-none placeholder:font-medium placeholder:text-[#9b94a6]"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-7 w-7 items-center justify-center text-[#403849] active:opacity-60"
                aria-label="Close search"
              >
                <i className="fa-solid fa-xmark text-[15px]" />
              </button>
            </div>
          ) : (
            <div className="grid w-full grid-cols-[42px_1fr_42px] items-center">
              <span />
              <h1 className="text-center text-[19px] font-black tracking-[-0.02em] text-[#15121a]">My Stories</h1>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center justify-self-end text-[#17131d] active:opacity-60"
                aria-label="Search stories"
              >
                <i className="fa-solid fa-magnifying-glass text-[19px]" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-3.5 pb-6 pt-4 sm:px-5">
        {error ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600">
            <span>{error}</span>
            <button type="button" onClick={fetchStories} className="shrink-0 font-black text-red-700">
              Retry
            </button>
          </div>
        ) : null}

        <section className="flex rounded-[14px] border border-[#e8e3f1] bg-white px-1.5 py-3 shadow-[0_8px_26px_rgba(71,55,110,0.07)]">
          <StatItem icon="fa-solid fa-book-open" label="All" value={formatCompactNumber(stats.all)} />
          <StatItem icon="fa-regular fa-circle-check" label="Published" value={formatCompactNumber(stats.published)} />
          <StatItem icon="fa-regular fa-file-lines" label="Drafts" value={formatCompactNumber(stats.drafts)} />
          <StatItem icon="fa-regular fa-eye" label="Views" value={formatCompactNumber(stats.views)} />
        </section>

        {!loading && latestStory ? (
          <section className="mt-4 overflow-hidden rounded-[14px] border border-[#e8e3f1] bg-white p-3 shadow-[0_7px_22px_rgba(71,55,110,0.06)]">
            <div className="flex items-center gap-3">
              <StoryCover story={latestStory} className="h-[82px] w-[64px] shrink-0 rounded-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#7951f4]">Continue Writing</div>
                <h2 className="mt-1 line-clamp-1 text-[15px] font-black text-[#1c1725]">{latestStory.title}</h2>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#81798f]">
                  <span>Episode {latestStory.episodes}</span>
                  <span className="h-1 w-1 rounded-full bg-[#825af5]" />
                  <span>Recently edited</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openStory(latestStory)}
                className="shrink-0 rounded-full bg-[#f0ebff] px-4 py-2.5 text-[12px] font-extrabold text-[#6d43ee] active:scale-95"
              >
                Continue
              </button>
            </div>
          </section>
        ) : null}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`min-w-[76px] flex-1 whitespace-nowrap rounded-full border px-4 py-2.5 text-[12px] font-extrabold transition active:scale-95 sm:flex-none sm:px-6 ${
                filter === item.id
                  ? 'border-[#e1d7ff] bg-[#eee8ff] text-[#7046ef]'
                  : 'border-[#e6e1ed] bg-white text-[#403949]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-3 mt-5 flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#19151f]">Your Library</h2>
          <label className="relative flex min-w-0 items-center text-[#6f687c]">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="max-w-[155px] appearance-none bg-transparent py-2 pl-2 pr-7 text-right text-[12px] font-semibold outline-none"
              aria-label="Sort stories"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-1 text-[10px] text-[#494152]" />
          </label>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : visibleStories.length > 0 ? (
            visibleStories.map((story) => (
              <article
                key={story.id}
                className="group overflow-visible rounded-[14px] border border-[#e8e3f0] bg-white shadow-[0_7px_20px_rgba(71,55,110,0.06)]"
              >
                <button
                  type="button"
                  onClick={() => openStory(story)}
                  className="relative block aspect-[3/4] w-full overflow-hidden rounded-t-[13px] text-left"
                >
                  <StoryCover story={story} className="h-full w-full transition duration-300 group-hover:scale-[1.02]" />
                  <span className="absolute left-2.5 top-2.5">
                    <StatusBadge status={story.status} />
                  </span>
                </button>

                <div className="relative p-3">
                  <h3 className="line-clamp-1 pr-7 text-[14px] font-black text-[#18141e]">{story.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#7d7589]">
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-eye text-[10px]" />
                      {formatCompactNumber(story.views)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#8d8499]" />
                    <span>{story.episodes} EP</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuStoryId((current) => current === story.id ? null : story.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f6fb] text-[#292331] active:scale-95"
                    aria-label={`Actions for ${story.title}`}
                  >
                    <i className="fa-solid fa-ellipsis-vertical text-[13px]" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState searching={Boolean(search.trim()) || filter !== 'all'} onCreate={() => navigate('/author/create-story')} />
          )}
        </section>
      </main>

      {selectedStory ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/25 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center" onClick={() => setMenuStoryId(null)}>
          <div
            className="w-full max-w-md rounded-[24px] bg-white p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#eeeaf3] px-1 pb-3">
              <StoryCover story={selectedStory} className="h-14 w-11 shrink-0 rounded-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-[14px] font-black text-[#1a1620]">{selectedStory.title}</div>
                <div className="mt-1 text-[11px] font-semibold capitalize text-[#81798f]">{selectedStory.status}</div>
              </div>
              <button
                type="button"
                onClick={() => setMenuStoryId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f4fb] text-[#39323f]"
                aria-label="Close story actions"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3">
              <button
                type="button"
                onClick={() => runStoryAction(`/author/story/${selectedStory.id}/manage`)}
                className="flex items-center gap-3 rounded-[16px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
              >
                <i className="fa-solid fa-sliders text-[#744af2]" />
                Manage Story
              </button>
              <button
                type="button"
                onClick={() => runStoryAction(`/author/story/${selectedStory.id}/episode/create?first=0`)}
                className="flex items-center gap-3 rounded-[16px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
              >
                <i className="fa-solid fa-plus text-[#744af2]" />
                Add Episode
              </button>
              <button
                type="button"
                onClick={() => runStoryAction(`/author/create-story?editStoryId=${selectedStory.id}`)}
                className="flex items-center gap-3 rounded-[16px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
              >
                <i className="fa-regular fa-pen-to-square text-[#744af2]" />
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => runStoryAction(`/story/${selectedStory.id}`)}
                className="flex items-center gap-3 rounded-[16px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
              >
                <i className="fa-regular fa-eye text-[#744af2]" />
                View Story
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AuthorStudioBottomNav />
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const TABS = [
  { label: 'Trending Now', sort: 'weekly_top' },
  { label: 'Popular', sort: 'popular' },
  { label: 'New Releases', sort: 'new' },
]

const SEARCH_HISTORY_KEY = 'shadow_search_history'

const RANK_STYLE = {
  1: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
  2: 'linear-gradient(135deg,#94a3b8,#64748b)',
  3: 'linear-gradient(135deg,#d97706,#b45309)',
}

function loadSearchHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed.slice(0, 10) : []
  } catch {
    return []
  }
}

function saveSearchHistory(items) {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items.slice(0, 10)))
}

function formatCount(value) {
  const number = Number(value || 0)

  if (number >= 1000000) {
    const formatted = (number / 1000000).toFixed(number >= 10000000 ? 0 : 1)
    return `${formatted.replace(/\.0$/, '')}M`
  }

  if (number >= 1000) {
    const formatted = (number / 1000).toFixed(number >= 10000 ? 0 : 1)
    return `${formatted.replace(/\.0$/, '')}K`
  }

  return String(number)
}

function getAuthorName(story) {
  return (
    story?.author_page?.page_name ||
    story?.authorPage?.page_name ||
    story?.author?.page_name ||
    story?.author_name ||
    'Author Name'
  )
}

export default function Search() {
  const [activeTab, setActiveTab] = useState(TABS[0].label)
  const [searchText, setSearchText] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const activeTabConfig = useMemo(() => {
    return TABS.find((tab) => tab.label === activeTab) || TABS[0]
  }, [activeTab])

  useEffect(() => {
    setSearchHistory(loadSearchHistory())
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadStories() {
      setLoading(true)
      setMessage('')

      try {
        const params = new URLSearchParams({
          limit: '10',
          sort: activeTabConfig.sort,
        })

        if (activeSearch.trim()) {
          params.set('search', activeSearch.trim())
        }

        const response = await fetch(`${API_BASE_URL}/api/public/stories?${params.toString()}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load stories')
        }

        if (ignore) return

        setStories(Array.isArray(data.stories) ? data.stories.slice(0, 10) : [])
      } catch (error) {
        if (ignore) return

        setStories([])
        setMessage(error.message || 'Failed to load stories')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStories()

    return () => {
      ignore = true
    }
  }, [activeTabConfig.sort, activeSearch])

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const keyword = searchText.trim()

    if (!keyword) return

    const nextHistory = [
      keyword,
      ...searchHistory.filter((item) => item.toLowerCase() !== keyword.toLowerCase()),
    ].slice(0, 10)

    setSearchHistory(nextHistory)
    saveSearchHistory(nextHistory)
    setActiveSearch(keyword)
    setIsSearchMode(false)
  }

  const handleUseHistory = (keyword) => {
    setSearchText(keyword)
    setActiveSearch(keyword)
    setIsSearchMode(false)
  }

  const handleRemoveHistory = (keyword) => {
    const nextHistory = searchHistory.filter((item) => item !== keyword)
    setSearchHistory(nextHistory)
    saveSearchHistory(nextHistory)
  }

  const handleClearHistory = () => {
    setSearchHistory([])
    saveSearchHistory([])
  }

  const handleCancelSearch = () => {
    setIsSearchMode(false)
    setSearchText(activeSearch)
  }

  const handleClearActiveSearch = () => {
    setSearchText('')
    setActiveSearch('')
  }

  return (
    <>
      <style>{`
        body { background:#f8fafc; font-family:'Plus Jakarta Sans','Kantumruy Pro',sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .book-card { transition:all 0.3s ease; border:1px solid #f1f5f9; }
        .book-card:hover { transform:translateY(-4px); box-shadow:0 12px 24px -8px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ paddingBottom: '80px' }}>
        <header className="sticky top-0 z-[100] border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-lg">
          <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-3xl items-center space-x-3">
            {!isSearchMode ? (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <i className="fa-solid fa-chevron-left text-lg" />
              </button>
            ) : null}

            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onFocus={() => setIsSearchMode(true)}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search Shadow..."
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-10 shadow-sm outline-none focus:border-[#111827]"
              />
              {searchText ? (
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#111827]"
                >
                  <i className="fa-solid fa-xmark text-[13px]" />
                </button>
              ) : null}
            </div>

            {isSearchMode ? (
              <button
                type="button"
                onClick={handleCancelSearch}
                className="shrink-0 text-[13px] font-extrabold text-[#111827]"
              >
                Cancel
              </button>
            ) : null}
          </form>
        </header>

        {isSearchMode ? (
          <main className="mx-auto max-w-3xl px-4 pt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[#111827]">Recent Searches</h2>

              {searchHistory.length ? (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-gray-100 active:scale-95"
                  aria-label="Clear all search history"
                >
                  <i className="fa-regular fa-trash-can text-[14px]" />
                </button>
              ) : null}
            </div>

            {searchHistory.length ? (
              <div className="mt-4 flex flex-col gap-3">
                {searchHistory.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100"
                  >
                    <button
                      type="button"
                      onClick={() => handleUseHistory(keyword)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <i className="fa-solid fa-clock-rotate-left shrink-0 text-[14px] text-gray-400" />
                      <span className="truncate text-[13px] font-bold text-[#111827]">{keyword}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveHistory(keyword)}
                      className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#111827]"
                      aria-label={`Remove ${keyword}`}
                    >
                      <i className="fa-solid fa-xmark text-[14px]" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl bg-white p-8 text-center text-sm font-bold text-gray-400 ring-1 ring-gray-100">
                No recent searches yet.
              </div>
            )}
          </main>
        ) : (
          <main className="mx-auto mt-6 max-w-3xl px-4">
            <nav className="no-scrollbar mb-8 flex space-x-8 overflow-x-auto border-b border-gray-100">
              {TABS.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.label)
                    setActiveSearch('')
                    setSearchText('')
                  }}
                  className={`whitespace-nowrap pb-3 text-sm font-semibold text-gray-400 transition-all ${
                    activeTab === tab.label ? 'border-b-[3px] border-[#111827] font-black text-[#111827]' : ''
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div>
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center space-x-3">
                  <div className="h-6 w-1.5 shrink-0 rounded-full bg-[#111827]" />
                  <h2 className="truncate text-xl font-extrabold">
                    {activeSearch ? `Search: ${activeSearch}` : activeTab}
                  </h2>
                </div>

                {activeSearch ? (
                  <button
                    type="button"
                    onClick={handleClearActiveSearch}
                    className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#111827] shadow-sm ring-1 ring-gray-100"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="h-28 w-20 rounded-xl bg-gray-100" />
                        <div className="flex-1">
                          <div className="h-4 w-2/3 rounded-full bg-gray-100" />
                          <div className="mt-3 h-3 w-1/3 rounded-full bg-gray-100" />
                          <div className="mt-6 h-3 w-1/2 rounded-full bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : stories.length ? (
                  stories.map((story, index) => {
                    const rank = index + 1

                    return (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() => navigate(`/story/${story.id}`)}
                        className="book-card relative flex w-full items-center space-x-4 overflow-hidden rounded-3xl bg-white p-4 text-left"
                      >
                        {rank <= 3 ? (
                          <div
                            className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center font-black italic text-white shadow-sm"
                            style={{ background: RANK_STYLE[rank] }}
                          >
                            {rank}
                          </div>
                        ) : (
                          <div className="w-10 text-center text-xl font-black italic text-gray-300">
                            {rank}
                          </div>
                        )}

                        <div className={`h-28 w-20 overflow-hidden rounded-xl bg-gray-100 shadow-inner ${rank <= 3 ? 'ml-4' : ''}`}>
                          {story.cover_url ? (
                            <img
                              src={story.cover_url}
                              className="h-full w-full object-cover"
                              alt={story.title || 'Story cover'}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className={`${rank <= 3 ? 'font-extrabold' : 'font-bold'} truncate text-gray-900`}>
                            {story.title || 'Untitled Story'}
                          </h3>
                          <p className="text-sm text-gray-400">by {getAuthorName(story)}</p>
                          <div className="mt-4 flex items-center space-x-4 text-[12px] font-bold">
                            <span className="inline-flex items-center text-[#111827]">
                              <i className="fa-solid fa-heart mr-1 text-[#ef4444]" />
                              {formatCount(story.total_likes)}
                            </span>
                            <span className="inline-flex items-center text-[#111827]">
                              <i className="fa-solid fa-eye mr-1 text-[#111827]" />
                              {formatCount(story.total_views)}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="rounded-3xl bg-white p-8 text-center text-sm font-bold text-gray-400 ring-1 ring-gray-100">
                    {message || 'No stories found.'}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
    </>
  )
}

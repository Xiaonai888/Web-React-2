import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SubscriptionsSection from '../components/library/SubscriptionsSection'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const topTabs = ['Recents', 'Subscribed', 'Downloads']
const typeTabs = ['All', 'Novel', 'Chat Story', 'Manga']

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function getStoryType(story) {
  const genre = String(story?.main_genre || '').toLowerCase()

  if (genre.includes('chat')) return 'Chat Story'
  if (genre.includes('manga') || genre.includes('comic') || genre.includes('manhwa')) return 'Manga'

  return 'Novel'
}

function getActionText(tab) {
  if (tab === 'Recents') return 'Clear'
  if (tab === 'Subscribed') return 'Manage'
  return 'Edit'
}

function getSubtitle(tab) {
  if (tab === 'Recents') return 'Stories you added to your library.'
  if (tab === 'Subscribed') return 'Follow the latest updates from stories you love.'
  return 'Available offline anytime.'
}

function formatInfo(tab, story) {
  if (tab === 'Subscribed') {
    return `New Ep. ${story?.total_episodes || 0}`
  }

  if (tab === 'Downloads') {
    return 'Downloaded'
  }

  return `Saved • Ep. ${story?.total_episodes || 0}`
}

function EmptyState({ title, text, actionText, onAction }) {
  return (
    <div className="rounded-3xl border border-[#ececec] bg-[#fafafa] px-5 py-10 text-center">
      <h3 className="text-[16px] font-extrabold text-[#111]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-5 text-[#7a7a7a]">{text}</p>

      {actionText ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-extrabold text-white active:scale-95"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  )
}

function EndBadge() {
  return (
    <div className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#ff9a44] to-[#fc6076] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm">
      END
    </div>
  )
}

function StoryCover({ story, className = '' }) {
  return (
    <div className={`overflow-hidden bg-[#efefef] ${className}`}>
      {story?.cover_url ? (
        <img
          src={story.cover_url}
          alt={story.title || 'Story cover'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
    </div>
  )
}

function LibraryBookCard({ item, tab }) {
  const story = item.story
  if (!story) return null

  return (
    <Link to={`/story/${story.id}`} className="group block min-w-0">
      <div className="relative overflow-hidden rounded-2xl bg-[#efefef] shadow-sm">
        <div className="aspect-[2/3] overflow-hidden">
          <StoryCover story={story} className="h-full w-full" />
        </div>

        {story.status === 'completed' ? <EndBadge /> : null}
      </div>

      <div className="pt-2.5">
        <h4 className="line-clamp-1 text-[12px] font-extrabold tracking-tight text-[#111] sm:text-[13px]">
          {story.title || 'Untitled Story'}
        </h4>
        <p className="mt-1 text-[10px] font-medium text-[#8d8d8d] sm:text-[11px]">
          {formatInfo(tab, story)}
        </p>
      </div>
    </Link>
  )
}

function ContextCard({ item, tab }) {
  const story = item?.story
  if (!story) return null

  return (
    <section className="pt-5">
      <Link
        to={`/story/${story.id}`}
        className="group block rounded-[24px] border border-[#efefef] bg-[#fafafa] p-4 transition hover:bg-[#f7f7f7]"
      >
        <div className="flex items-center gap-4">
          <div className="w-[82px] shrink-0 overflow-hidden rounded-2xl bg-[#ececec] shadow-sm sm:w-[90px]">
            <div className="aspect-[2/3] overflow-hidden">
              <StoryCover story={story} className="h-full w-full" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#111827] shadow-sm">
              {tab === 'Subscribed' ? 'Latest Update' : tab === 'Downloads' ? 'Downloaded' : 'In Library'}
            </div>

            <h3 className="line-clamp-1 text-[15px] font-extrabold tracking-tight text-[#111] sm:text-[17px]">
              {story.title || 'Untitled Story'}
            </h3>

            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#6f6f78] sm:text-[13px]">
              {story.description || `${story.main_genre || 'Story'} • ${story.total_episodes || 0} episodes`}
            </p>

            <p className="mt-2 text-[11px] font-extrabold text-[#111827] sm:text-[12px]">
              {formatInfo(tab, story)}
            </p>
          </div>

          <i className="fa-solid fa-chevron-right text-[#c0c0ca] transition group-hover:translate-x-1 group-hover:text-[#111]" />
        </div>
      </Link>
    </section>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Subscribed')
  const [activeType, setActiveType] = useState('All')
  const [libraryItems, setLibraryItems] = useState([])
  const [subscriptionItems, setSubscriptionItems] = useState([])
  const [downloadItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const isLoggedIn = Boolean(getReaderToken())

  const loadLibrary = async () => {
    if (!isLoggedIn) {
      setLibraryItems([])
      setSubscriptionItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const [libraryResponse, subscriptionsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/reader/library`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/reader/subscriptions`, { headers: getHeaders() }),
      ])

      const libraryData = await libraryResponse.json().catch(() => ({}))
      const subscriptionsData = await subscriptionsResponse.json().catch(() => ({}))

      if (!libraryResponse.ok || libraryData.ok === false) {
        throw new Error(libraryData.message || 'Failed to load library')
      }

      if (!subscriptionsResponse.ok || subscriptionsData.ok === false) {
        throw new Error(subscriptionsData.message || 'Failed to load subscriptions')
      }

      setLibraryItems(Array.isArray(libraryData.items) ? libraryData.items : [])
      setSubscriptionItems(Array.isArray(subscriptionsData.items) ? subscriptionsData.items : [])
    } catch (error) {
      setLibraryItems([])
      setSubscriptionItems([])
      setMessage(error.message || 'Failed to load library')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLibrary()
  }, [isLoggedIn])

  const currentItems = useMemo(() => {
    if (activeTab === 'Subscribed') return subscriptionItems
    if (activeTab === 'Downloads') return downloadItems
    return libraryItems
  }, [activeTab, libraryItems, subscriptionItems, downloadItems])

  const filteredItems = useMemo(() => {
    if (activeType === 'All') return currentItems
    return currentItems.filter((item) => getStoryType(item.story) === activeType)
  }, [currentItems, activeType])

  const actionText = getActionText(activeTab)
  const subtitle = getSubtitle(activeTab)
  const firstItem = filteredItems[0] || null

  const handleAction = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (activeTab !== 'Recents' || !libraryItems.length) return

    const confirmed = window.confirm('Clear all saved stories from your library?')
    if (!confirmed) return

    try {
      await Promise.all(
        libraryItems.map((item) =>
          fetch(`${API_BASE_URL}/api/reader/library/${item.story_id}`, {
            method: 'DELETE',
            headers: getHeaders(),
          })
        )
      )

      await loadLibrary()
    } catch {
      setMessage('Failed to clear library')
    }
  }

  return (
    <>
      <style>{`
        body {
          background: #ffffff;
          font-family: 'Inter', 'Kantumruy Pro', sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tab-active-lib::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -10px;
          width: 22px;
          height: 4px;
          border-radius: 9999px;
          background: #111827;
        }
      `}</style>

      <div className="pb-[88px]">
        <header className="sticky top-0 z-[60] border-b border-[#f3f3f3] bg-white/95 backdrop-blur-sm">
          <div className="px-4 pt-5 sm:px-5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex min-w-0 items-end gap-5 overflow-x-auto no-scrollbar">
                {topTabs.map((tab) => {
                  const active = tab === activeTab

                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab)
                        setActiveType('All')
                      }}
                      className={`relative shrink-0 pb-3 text-[13px] font-bold transition-colors sm:text-[14px] ${
                        active ? 'tab-active-lib text-[#111]' : 'text-[#a1a1aa]'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={handleAction}
                className="shrink-0 pb-3 text-[13px] font-semibold text-[#5f5f68] transition hover:text-[#111]"
              >
                {actionText}
              </button>
            </div>

            <p className="pb-4 pt-2 text-[12px] text-[#8b8b95] sm:text-[13px]">
              {subtitle}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {typeTabs.map((type) => {
                const active = type === activeType

                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${
                      active
                        ? 'bg-[#111827] text-white shadow-[0_8px_18px_rgba(17,24,39,0.18)]'
                        : 'bg-[#f3f3f5] text-[#7b7b85] hover:bg-[#ececef]'
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-5">
          {message ? (
            <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          {loading ? (
            <div className="pt-5">
              <div className="rounded-[24px] border border-[#efefef] bg-[#fafafa] px-5 py-10 text-center text-[13px] font-bold text-[#8b8b95]">
                Loading library...
              </div>
            </div>
          ) : !isLoggedIn ? (
            <div className="pt-5">
              <EmptyState
                title="Login to use your library"
                text="Save stories, subscribe to updates, and keep your reading list synced."
                actionText="Login"
                onAction={() => navigate('/login')}
              />
            </div>
          ) : filteredItems.length ? (
            <>
              <ContextCard item={firstItem} tab={activeTab} />

              <section className="pt-7">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[20px] font-extrabold tracking-tight text-[#111]">
                    {activeTab === 'Subscribed'
                      ? 'Your Subscriptions'
                      : activeTab === 'Downloads'
                        ? 'Your Downloads'
                        : 'Your Library'}
                  </h2>

                  {activeTab === 'Subscribed' ? (
                    <button className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#111827]">
                      See All
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {filteredItems.map((item) => (
                    <LibraryBookCard key={item.id || item.story_id} item={item} tab={activeTab} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="pt-5">
              <EmptyState
                title={
                  activeTab === 'Subscribed'
                    ? 'No subscriptions yet'
                    : activeTab === 'Downloads'
                      ? 'No downloads yet'
                      : 'No saved stories yet'
                }
                text={
                  activeTab === 'Subscribed'
                    ? 'Tap the heart button on a story to follow its updates.'
                    : activeTab === 'Downloads'
                      ? 'Downloaded stories will appear here when offline reading is ready.'
                      : 'Tap the bookmark button on a story to add it to your library.'
                }
                actionText="Browse Stories"
                onAction={() => navigate('/')}
              />
            </div>
          )}
        </main>

        {activeTab === 'Subscribed' && subscriptionItems.length ? (
          <SubscriptionsSection items={subscriptionItems} />
        ) : null}
      </div>
    </>
  )
}

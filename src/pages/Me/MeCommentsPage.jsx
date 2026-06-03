import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'mine', label: 'My Comments' },
  { key: 'replies', label: 'Replies' },
  { key: 'mentions', label: 'Mentions' },
]

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatTime(value) {
  if (!value) return ''

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActivityTitle(item) {
  if (item.activity_type === 'mine') return 'You commented'
  if (item.activity_type === 'reply') return 'Someone replied'
  if (item.activity_type === 'mention') return 'You were mentioned'

  return item.title || 'Comment activity'
}

function getActivityText(item) {
  return item.text || item.message || ''
}

function getActivityStoryTitle(item) {
  return item.story?.title || item.story_title || ''
}

export default function MeCommentsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [items, setItems] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = getReaderToken()

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate, token])

  useEffect(() => {
    let ignore = false

    async function loadItems() {
      if (!token) return

      try {
        setLoading(true)
        setError('')

        const endpoint =
          activeTab === 'all'
            ? `${API_BASE_URL}/api/notifications?type=community`
            : `${API_BASE_URL}/api/comments/me/activities?filter=${activeTab}`

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load comments')
        }

        if (ignore) return

        if (activeTab === 'all') {
          setItems(data.notifications || [])
          setCounts(data.counts || {})
        } else {
          setItems(data.activities || [])
          setCounts(data.counts || {})
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load comments')
          setItems([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadItems()

    return () => {
      ignore = true
    }
  }, [activeTab, token])

  const tabCounts = useMemo(() => {
    return {
      all: activeTab === 'all' ? items.length : Number(counts.all || 0),
      mine: Number(counts.mine || 0),
      replies: Number(counts.replies || 0),
      mentions: Number(counts.mentions || 0),
    }
  }, [activeTab, counts, items.length])

  async function openItem(item) {
    if (activeTab === 'all' && item.id && !item.is_read) {
      try {
        await fetch(`${API_BASE_URL}/api/notifications/${item.id}/read`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setItems((current) => current.map((row) => (row.id === item.id ? { ...row, is_read: true } : row)))
      } catch {}
    }

    const link = item.link || (item.story_id ? `/story/${item.story_id}` : '')
    if (link) navigate(link)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[96px] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-30 border-b border-[#eceaf2] bg-white px-4 pb-3 pt-4 shadow-sm dark:border-white/10 dark:bg-[#171923]">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] ring-1 ring-black/5 active:scale-95 dark:bg-white/10 dark:text-white dark:ring-white/10"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <h1 className="text-[22px] font-black leading-tight text-[#111827] dark:text-white">Comments</h1>
        </div>

        <div className="mx-auto mt-4 flex max-w-3xl gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const active = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] transition ${
                  active
                    ? 'bg-[#111827] font-extrabold text-white dark:bg-[#f6b800] dark:text-[#111827]'
                    : 'bg-[#f8f8fb] font-semibold text-[#6b7280] ring-1 ring-black/5 dark:bg-white/10 dark:text-white/65 dark:ring-white/10'
                }`}
              >
                {tab.label}
                {tabCounts[tab.key] ? <span className="ml-1.5 opacity-70">{tabCounts[tab.key]}</span> : null}
              </button>
            )
          })}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {error ? (
          <div className="mb-3 rounded-2xl bg-[#fff1f1] px-4 py-3 text-[13px] font-bold text-[#e5484d]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[22px] bg-white dark:bg-[#171923]" />
            ))}
          </div>
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className={`w-full rounded-[22px] bg-white p-4 text-left shadow-sm ring-1 transition active:scale-[0.99] dark:bg-[#171923] ${
                  activeTab === 'all' && !item.is_read
                    ? 'ring-[#f6b800]/55'
                    : 'ring-black/5 dark:ring-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827] dark:bg-white/10 dark:text-white">
                    <i className="far fa-comment-dots text-[15px]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="line-clamp-1 text-[14px] font-black text-[#111827] dark:text-white">
                        {getActivityTitle(item)}
                      </div>
                      <div className="shrink-0 text-[10.5px] font-semibold text-[#9aa1ad]">
                        {formatTime(item.created_at)}
                      </div>
                    </div>

                    {getActivityStoryTitle(item) ? (
                      <div className="mt-1 line-clamp-1 text-[12px] font-bold text-[#6b7280] dark:text-white/55">
                        {getActivityStoryTitle(item)}
                      </div>
                    ) : null}

                    <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-[#4b5563] dark:text-white/70">
                      {getActivityText(item)}
                    </p>
                  </div>

                  {activeTab === 'all' && !item.is_read ? (
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#f6b800]" />
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[24px] bg-white px-6 py-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] dark:bg-white/10 dark:text-white">
              <i className="far fa-comment-dots text-[22px]" />
            </div>
            <h2 className="mt-4 text-[17px] font-black text-[#111827] dark:text-white">No comments yet</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8d94a1] dark:text-white/50">No comment activity found.</p>
          </div>
        )}
      </main>
    </div>
  )
}

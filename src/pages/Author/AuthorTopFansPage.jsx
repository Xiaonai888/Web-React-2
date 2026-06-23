import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAGE_LIMIT = 30

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getFanName(user) {
  return user?.name || user?.display_name || user?.username || 'Reader'
}

function getFanId(user) {
  return String(user?.id || user?.user_id || user?.username || user?.reader_username || '')
}

function Avatar({ user }) {
  const name = getFanName(user)
  const avatar = user?.avatar_url || user?.profile_image || ''

  if (avatar) {
    return <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e5e7eb] text-[16px] font-black text-[#6b7280]">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export default function AuthorTopFansPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()

  const [topFans, setTopFans] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [message, setMessage] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [selectedTopFan, setSelectedTopFan] = useState(null)

  async function fetchTopFans(offset = 0) {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/followers?section=top&limit=${PAGE_LIMIT}&offset=${offset}`,
      { headers: getHeaders() }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to load top fans')
    }

    return data
  }

  async function loadTopFans() {
    try {
      setLoading(true)
      setMessage('')

      const data = await fetchTopFans(0)

      setTopFans(data.followers || [])
      setHasMore(Boolean(data.has_more))
      setIsOwner(Boolean(data.is_owner))
    } catch (error) {
      setMessage(error.message || 'Failed to load top fans')
    } finally {
      setLoading(false)
    }
  }

  async function loadMoreTopFans() {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)

      const data = await fetchTopFans(topFans.length)

      setTopFans((current) => [...current, ...(data.followers || [])])
      setHasMore(Boolean(data.has_more))
    } catch (error) {
      setMessage(error.message || 'Failed to load more top fans')
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (!pageUsername) return
    loadTopFans()
  }, [pageUsername])

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827]">Top fans</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[14px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]"
        >
          {message}
        </button>
      ) : null}

      <main className="mx-auto max-w-[720px] pt-3">
        {loading ? (
          <div className="space-y-5 px-6 pt-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-[#eef0f4]" />
                <div className="h-5 flex-1 animate-pulse rounded-full bg-[#eef0f4]" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && topFans.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6ff] text-[28px]">
              💎
            </div>
            <div className="mt-4 text-[18px] font-black text-[#111827]">No Top Fan yet</div>
            <div className="mx-auto mt-2 max-w-[280px] text-[13px] font-medium leading-6 text-[#8b93a1]">
              Top fans will appear here after readers become more active on this page.
            </div>
          </div>
        ) : null}

        {!loading && topFans.length > 0 ? (
          <div className="px-4">
            {topFans.map((fan) => (
  <div
    key={getFanId(fan)}
    className="flex min-h-[66px] items-center gap-4 px-1 py-2"
  >
    <Avatar user={fan} />

    <div className="min-w-0 flex-1">
      <div className="truncate text-[16px] font-normal text-[#111827]">
        {getFanName(fan)}
      </div>
    </div>

    {isOwner ? (
      <button
        type="button"
        onClick={() => setSelectedTopFan(fan)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
        aria-label={`Open ${getFanName(fan)} actions`}
      >
        <i className="fa-solid fa-ellipsis text-[16px]" />
      </button>
    ) : null}
  </div>
))}

            {hasMore ? (
              <div className="py-4">
                <button
                  type="button"
                  onClick={loadMoreTopFans}
                  disabled={loadingMore}
                  className="h-11 w-full rounded-[12px] bg-[#f3f4f6] text-[14px] font-bold text-[#111827] disabled:opacity-60"
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
           </main>

      {isOwner && selectedTopFan ? (
        <div className="fixed inset-0 z-[300] bg-black/35" onClick={() => setSelectedTopFan(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white px-5 pb-7 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#c7ccd5]" />

            <div className="mb-4 truncate text-[18px] font-semibold text-[#111827]">
              {getFanName(selectedTopFan)}
            </div>

            <button
              type="button"
              onClick={() => {
                const name = getFanName(selectedTopFan)
                setSelectedTopFan(null)
                setMessage(`Remove Top Fan Badge for ${name} is coming soon.`)
              }}
              className="flex h-12 w-full items-center gap-4 rounded-[14px] text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#111827] text-white">
                <i className="fa-solid fa-xmark text-[15px]" />
              </span>
              <span className="text-[15px] font-medium text-[#111827]">
                Remove Top Fan Badge
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTopFan(null)}
              className="mt-2 h-11 text-[15px] font-normal text-[#111827] active:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

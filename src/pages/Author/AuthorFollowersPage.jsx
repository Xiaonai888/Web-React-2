import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

function Avatar({ user }) {
  const name = user?.name || user?.username || 'Reader'
  const avatar = user?.avatar_url || user?.profile_image || ''

  if (avatar) {
    return <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[16px] font-black text-white">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB')
}

export default function AuthorFollowersPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadFollowers() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load followers')
        }

        if (ignore) return

        setFollowers(data.followers || data.items || [])
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load followers')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadFollowers()

    return () => {
      ignore = true
    }
  }, [pageUsername, navigate])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <h1 className="truncate text-[17px] font-black text-[#111827]">Followers</h1>
            <p className="truncate text-[11px] font-semibold text-[#8b93a1]">@{pageUsername}</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <section className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-[#eef0f4] px-4 py-4">
            <div className="text-[15px] font-black text-[#111827]">
              {loading ? 'Loading followers...' : `${followers.length} followers`}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              <div className="h-16 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[#f3f4f6]" />
            </div>
          ) : null}

          {!loading && followers.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                <i className="fa-regular fa-user text-[22px]" />
              </div>
              <div className="mt-4 text-[15px] font-black text-[#111827]">No followers yet</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
                Readers who follow your page will appear here.
              </div>
            </div>
          ) : null}

          {!loading && followers.length > 0 ? (
            <div className="divide-y divide-[#eef0f4]">
              {followers.map((user) => (
                <button
                  key={user.id || user.user_id || user.username}
                  type="button"
                  onClick={() => {
                    const username = user.username || user.reader_username
                    if (username) navigate(`/profile/${username}`)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f8fafc]"
                >
                  <Avatar user={user} />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-black text-[#111827]">
                      {user.name || user.display_name || user.username || 'Reader'}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8b93a1]">
                      @{user.username || user.reader_username || 'reader'}
                      {user.followed_at ? ` · Followed ${formatDate(user.followed_at)}` : ''}
                    </div>
                  </div>

                  <i className="fa-solid fa-chevron-right text-[11px] text-[#c6c9d1]" />
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}

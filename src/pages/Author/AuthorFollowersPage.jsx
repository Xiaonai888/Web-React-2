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

function getFollowerName(user) {
  return user?.name || user?.display_name || user?.username || 'Reader'
}

function Avatar({ user }) {
  const name = getFollowerName(user)
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
  const [selectedFollower, setSelectedFollower] = useState(null)

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

  const selectedName = selectedFollower ? getFollowerName(selectedFollower) : ''

  return (
    <div className="min-h-screen bg-white pb-10 sm:bg-[#f5f3fa]">
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
            <h1 className="truncate text-[17px] font-bold text-[#111827]">Followers</h1>
            <p className="truncate text-[11px] font-semibold text-[#8b93a1]">@{pageUsername}</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-0 pt-0 sm:px-4 sm:pt-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mb-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d] sm:mx-0 sm:w-full"
          >
            {message}
          </button>
        ) : null}

        <section className="bg-white sm:overflow-hidden sm:rounded-[24px] sm:shadow-sm sm:ring-1 sm:ring-black/5">
          <button
            type="button"
            onClick={() => navigate(`/author/page/${pageUsername}/top-fans`)}
            className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[22px]">
              💎
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-black text-[#111827]">Top fans</div>
              <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8b93a1]">
                Most active readers on this page
              </div>
            </div>

            <i className="fa-solid fa-chevron-right text-[14px] text-[#6b7280]" />
          </button>

          <div className="px-4 pb-2 pt-3">
            <div className="text-[17px] font-bold tracking-[-0.01em] text-[#111827]">
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
            <div className="pb-2">
              {followers.map((user) => (
                <div
                  key={user.id || user.user_id || user.username}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <Avatar user={user} />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-black text-[#111827]">
                      {getFollowerName(user)}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8b93a1]">
                      @{user.username || user.reader_username || 'reader'}
                      {user.followed_at ? ` · Followed ${formatDate(user.followed_at)}` : ''}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFollower(user)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
                    aria-label={`Open ${getFollowerName(user)} actions`}
                  >
                    <i className="fa-solid fa-ellipsis text-[16px]" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      {selectedFollower ? (
        <div className="fixed inset-0 z-[300] bg-black/35" onClick={() => setSelectedFollower(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[22px] bg-white px-4 pb-6 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#c7ccd5]" />

            <button
              type="button"
              onClick={() => {
                setSelectedFollower(null)
                setMessage(`Message ${selectedName} is coming soon.`)
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-2 py-3 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
                <i className="fa-solid fa-comment-dots text-[16px]" />
              </span>
              <span className="text-[15px] font-medium text-[#111827]">Message {selectedName}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedFollower(null)
                setMessage(`Block ${selectedName} is coming soon.`)
              }}
              className="flex w-full items-center gap-3 rounded-[14px] px-2 py-3 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
                <i className="fa-solid fa-user-slash text-[16px]" />
              </span>
              <span>
                <span className="block text-[15px] font-medium text-[#111827]">Block {selectedName}</span>
                <span className="mt-0.5 block text-[12px] font-normal leading-4 text-[#8b93a1]">
                  {selectedName} won't be able to contact you from this page.
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

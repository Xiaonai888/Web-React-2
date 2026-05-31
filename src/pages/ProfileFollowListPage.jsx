import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function Avatar({ user }) {
  const letter = String(user?.name || user?.username || 'U').slice(0, 1).toUpperCase()

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[16px] font-black text-white">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={user.name || user.username} className="h-full w-full object-cover" />
      ) : (
        letter
      )}
    </div>
  )
}

function EmptyState({ type }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#8b93a1]">
        <i className="fa-regular fa-user text-[24px]" />
      </div>
      <h2 className="mt-4 text-[16px] font-black text-[#111827]">
        No {type === 'followers' ? 'followers' : 'following'} yet
      </h2>
      <p className="mx-auto mt-2 max-w-[260px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        People will appear here when this account has {type === 'followers' ? 'followers' : 'followed accounts'}.
      </p>
    </div>
  )
}

export default function ProfileFollowListPage() {
  const navigate = useNavigate()
  const { username, listType } = useParams()
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const safeType = listType === 'following' ? 'following' : 'followers'
  const title = safeType === 'followers' ? 'Followers' : 'Following'

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return users

    return users.filter((user) => {
      return (
        String(user.name || '').toLowerCase().includes(keyword) ||
        String(user.username || '').toLowerCase().includes(keyword)
      )
    })
  }, [query, users])

  useEffect(() => {
    let ignore = false

    async function loadUsers() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username || '')}/${safeType}?page=1&limit=50`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || `Failed to load ${safeType}`)
        }

        if (!ignore) {
          setUsers(Array.isArray(data.users) ? data.users : [])
        }
      } catch (error) {
        if (!ignore) {
          setUsers([])
          setMessage(error.message || `Failed to load ${safeType}`)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [navigate, safeType, username])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[92px]">
      <main className="mx-auto min-h-screen w-full bg-white md:max-w-[560px] md:border-x md:border-[#eceaf2]">
        <header className="sticky top-0 z-30 border-b border-[#f0eef6] bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:scale-95"
              aria-label="Go back"
            >
              <i className="fas fa-chevron-left text-[16px]" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-[17px] font-black text-[#111827]">{title}</h1>
              <p className="text-[12px] font-bold text-[#8b93a1]">@{username}</p>
            </div>
          </div>

          <div className="mt-3 flex h-11 items-center gap-2 rounded-full bg-[#f5f3fa] px-4">
            <i className="fas fa-search text-[13px] text-[#8b93a1]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
            />
          </div>
        </header>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="space-y-3 px-4 py-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-full bg-[#f3f4f6]" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 animate-pulse rounded-full bg-[#f3f4f6]" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-[#f3f4f6]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length ? (
          <div className="divide-y divide-[#f0eef6]">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => navigate(`/profile/${user.username}`)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f7f7fb]"
              >
                <Avatar user={user} />

                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-[14px] font-black text-[#111827]">
                    {user.name || user.username}
                  </div>
                  <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">
                    @{user.username}
                  </div>
                  {user.bio ? (
                    <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#6b7280]">
                      {user.bio}
                    </div>
                  ) : null}
                </div>

                <i className="fas fa-chevron-right text-[12px] text-[#c0c4ce]" />
              </button>
            ))}
          </div>
        ) : (
          <EmptyState type={safeType} />
        )}
      </main>
    </div>
  )
}

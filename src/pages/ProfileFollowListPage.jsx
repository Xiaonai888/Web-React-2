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

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function Avatar({ user, size = 'h-12 w-12' }) {
  const letter = String(user?.name || user?.username || 'U').slice(0, 1).toUpperCase()

  return (
    <div className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[16px] font-black text-white`}>
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={user.name || user.username} className="h-full w-full object-cover" />
      ) : (
        letter
      )}
    </div>
  )
}

function EmptyState({ type }) {
  const isFollowers = type === 'followers'

  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#8b93a1]">
        <i className="fa-regular fa-user text-[24px]" />
      </div>
      <h2 className="mt-4 text-[16px] font-black text-[#111827]">
        {isFollowers ? 'No followers yet' : 'Not following anyone yet'}
      </h2>
      <p className="mx-auto mt-2 max-w-[280px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        {isFollowers
          ? 'When people follow this account, they’ll appear here.'
          : 'Accounts this user follows will appear here.'}
      </p>
    </div>
  )
}

function FollowButton({ label, active, loading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`h-9 min-w-[94px] shrink-0 rounded-[12px] px-4 text-[12px] font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? 'bg-[#f3f4f6] text-[#111827]'
          : 'bg-[#111827] text-white'
      }`}
    >
      {loading ? '...' : label}
    </button>
  )
}

function UserRow({ user, type, isOwnList, onOpen, onToggleFollow }) {
  const [loading, setLoading] = useState(false)
  const isFollowing = Boolean(user.is_following)
  const isFollowBack = isOwnList && type === 'followers' && !isFollowing
  const buttonLabel = isFollowing ? 'Following' : isFollowBack ? 'Follow back' : 'Follow'

  const handleToggle = async (event) => {
    event.stopPropagation()

    if (loading) return

    try {
      setLoading(true)
      await onToggleFollow(user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(user)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-[#f7f7fb]"
    >
      <Avatar user={user} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[#111827]">
          {user.name || user.username}
        </div>
        <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">
          @{user.username}
        </div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#6b7280]">
          {user.bio || (user.is_author ? 'Author account' : 'Reader account')}
        </div>
      </div>

      <FollowButton
        label={buttonLabel}
        active={isFollowing}
        loading={loading}
        onClick={handleToggle}
      />
    </button>
  )
}

function SuggestedRow({ user, onHide, onOpen, onToggleFollow }) {
  const [loading, setLoading] = useState(false)

  const handleFollow = async (event) => {
    event.stopPropagation()

    if (loading) return

    try {
      setLoading(true)
      await onToggleFollow(user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(user)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-[#f7f7fb]"
    >
      <Avatar user={user} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[#111827]">
          {user.name || user.username}
        </div>
        <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">
          @{user.username}
        </div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#6b7280]">
          Suggested account
        </div>
      </div>

      <FollowButton label="Follow" active={false} loading={loading} onClick={handleFollow} />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onHide(user.id)
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#9ca3af] active:bg-[#f3f4f6]"
        aria-label="Hide suggestion"
      >
        <i className="fa-solid fa-xmark text-[13px]" />
      </button>
    </button>
  )
}

export default function ProfileFollowListPage() {
  const navigate = useNavigate()
  const { username, listType } = useParams()
  const storedUser = getStoredUser()
  const [users, setUsers] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [hiddenSuggestionIds, setHiddenSuggestionIds] = useState([])
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState('desc')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const safeType = listType === 'following' ? 'following' : 'followers'
  const isOwnList = String(storedUser?.username || '').toLowerCase() === String(username || '').toLowerCase()

  const tabs = [
    { key: 'followers', label: 'Followers' },
    { key: 'following', label: 'Following' },
  ]

  const visibleUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const list = keyword
      ? users.filter((user) => {
          return (
            String(user.name || '').toLowerCase().includes(keyword) ||
            String(user.username || '').toLowerCase().includes(keyword)
          )
        })
      : users

    return order === 'asc' ? [...list].reverse() : list
  }, [order, query, users])

  const visibleSuggestions = useMemo(() => {
    const hidden = new Set(hiddenSuggestionIds)

    return suggestedUsers.filter((user) => !hidden.has(user.id)).slice(0, 5)
  }, [hiddenSuggestionIds, suggestedUsers])

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

  useEffect(() => {
    let ignore = false

    async function loadSuggestions() {
      const token = getAuthToken()

      if (!token) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username || '')}/followers?page=1&limit=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) return

        if (!ignore) {
          const alreadyShown = new Set(users.map((user) => user.id))
          const suggestions = (Array.isArray(data.users) ? data.users : [])
            .filter((user) => user.id !== storedUser?.id)
            .filter((user) => !alreadyShown.has(user.id))
            .filter((user) => !user.is_following)

          setSuggestedUsers(suggestions)
        }
      } catch {
        if (!ignore) {
          setSuggestedUsers([])
        }
      }
    }

    loadSuggestions()

    return () => {
      ignore = true
    }
  }, [storedUser?.id, username, users])

  const handleOpenUser = (user) => {
    if (!user?.username) return
    navigate(`/profile/${user.username}`)
  }

  const handleTabChange = (nextType) => {
    if (nextType === safeType) return
    navigate(`/profile/${username}/${nextType}`, { replace: true })
  }

  const handleBackToProfile = () => {
    navigate(`/profile/${username}`, { replace: true })
  }

  const handleToggleOrder = () => {
    setOrder((current) => (current === 'desc' ? 'asc' : 'desc'))
  }

  const handleToggleFollow = async (targetUser) => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    const currentlyFollowing = Boolean(targetUser.is_following)
    const method = currentlyFollowing ? 'DELETE' : 'POST'

    const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(targetUser.username)}/follow`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to update follow')
    }

    const updateUser = (user) =>
      user.id === targetUser.id
        ? {
            ...user,
            is_following: !currentlyFollowing,
          }
        : user

    setUsers((current) => current.map(updateUser))
    setSuggestedUsers((current) => current.map(updateUser))
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[92px]">
      <main className="mx-auto min-h-screen w-full bg-white md:max-w-[560px] md:border-x md:border-[#eceaf2]">
        <header className="sticky top-0 z-30 border-b border-[#f0eef6] bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={handleBackToProfile}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:scale-95"
              aria-label="Go back"
            >
              <i className="fas fa-chevron-left text-[16px]" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="line-clamp-1 text-[17px] font-black text-[#111827]">@{username}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-[#f7f7fb] text-center text-[13px] font-black text-[#111827]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className="relative py-3"
              >
                {tab.label}
                {safeType === tab.key ? (
                  <span className="absolute bottom-0 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-[#f6b800]" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="px-4 py-3">
            <div className="flex h-11 items-center gap-2 rounded-full bg-[#f5f3fa] px-4">
              <i className="fas fa-search text-[13px] text-[#8b93a1]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search accounts"
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between border-b border-[#f0eef6] px-4 py-3">
          <div>
            <div className="text-[13px] font-black text-[#111827]">
              {order === 'desc' ? 'Recent' : 'Oldest'}
            </div>
            <div className="text-[11px] font-bold text-[#9ca3af]">
              {visibleUsers.length} accounts
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleOrder}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Reverse order"
          >
            <i className="fa-solid fa-arrow-down-wide-short text-[14px]" />
          </button>
        </div>

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
        ) : (
          <>
            {visibleUsers.length ? (
              <div className="divide-y divide-[#f0eef6]">
                {visibleUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    type={safeType}
                    isOwnList={isOwnList}
                    onOpen={handleOpenUser}
                    onToggleFollow={handleToggleFollow}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type={safeType} />
            )}

            {visibleSuggestions.length ? (
              <section className="border-t border-[#f0eef6] py-3">
                <div className="px-4 pb-2 text-[15px] font-black text-[#111827]">
                  Suggested accounts
                </div>

                <div className="divide-y divide-[#f0eef6]">
                  {visibleSuggestions.map((user) => (
                    <SuggestedRow
                      key={user.id}
                      user={user}
                      onOpen={handleOpenUser}
                      onToggleFollow={handleToggleFollow}
                      onHide={(id) => setHiddenSuggestionIds((current) => [...current, id])}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>
    </div>
  )
}

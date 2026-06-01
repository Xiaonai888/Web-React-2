import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function Avatar({ item }) {
  const name = item?.name || item?.username || item?.page_name || item?.page_username || 'U'
  const imageUrl = item?.avatar_url || ''

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[16px] font-black text-white ring-1 ring-black/5">
      {imageUrl ? <img src={imageUrl} alt={name} className="h-full w-full object-cover" /> : String(name).slice(0, 1).toUpperCase()}
    </div>
  )
}

function EmptyState({ type }) {
  const isFollowers = type === 'followers'

  return (
    <section className="px-4 py-6">
      <div className="rounded-[24px] bg-white px-5 py-8 text-center ring-1 ring-[#f0eef6]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff8df] text-[#d49a00] ring-1 ring-[#f6d56b]/50">
          <i className="fa-regular fa-user text-[24px]" />
        </div>
        <h2 className="mt-4 text-[17px] font-black text-[#111827]">
          {isFollowers ? 'No followers yet' : 'Not following anyone yet'}
        </h2>
        <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
          {isFollowers ? 'When people follow this reader, they will appear here.' : 'Accounts this reader follows will appear here.'}
        </p>
      </div>
    </section>
  )
}

function UserRow({ user, type, isOwnList, onOpen, onToggleFollow }) {
  const [loading, setLoading] = useState(false)
  const isFollowing = Boolean(user.is_following)
  const isFollowBack = isOwnList && type === 'followers' && Boolean(user.is_followed_by) && !isFollowing
  const label = isFollowing ? 'Following' : isFollowBack ? 'Follow back' : 'Follow'

  const handleClick = async (event) => {
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
    <button type="button" onClick={() => onOpen(user)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f7f7fb]">
      <Avatar item={user} />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{user.name || user.username}</div>
        <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">@{user.username}</div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#6b7280]">
          {user.bio || (user.is_author ? 'Author account' : 'Reader account')}
        </div>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`h-9 min-w-[96px] rounded-full px-4 text-[12px] font-black active:scale-[0.98] disabled:opacity-60 ${
          isFollowing ? 'bg-[#f3f4f6] text-[#111827]' : isFollowBack ? 'bg-[#fff8df] text-[#9a6b00] ring-1 ring-[#f6b800]/45' : 'bg-[#111827] text-white'
        }`}
      >
        {loading ? '...' : label}
      </button>
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
    <button type="button" onClick={() => onOpen(user)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f7f7fb]">
      <Avatar item={user} />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{user.name || user.username}</div>
        <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">@{user.username}</div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#6b7280]">{user.is_author ? 'Suggested author' : 'Suggested reader'}</div>
      </div>
      <button
        type="button"
        onClick={handleFollow}
        disabled={loading}
        className="h-9 min-w-[86px] rounded-full bg-[#111827] px-4 text-[12px] font-black text-white active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? '...' : 'Follow'}
      </button>
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

function AuthorActionSheet({ author, loading, onClose, onMessage, onMute, onUnfollow, onReport }) {
  if (!author) return null

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/35">
      <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close author menu" />
      <div className="relative w-full overflow-hidden rounded-t-[24px] bg-white pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-2xl md:max-w-[560px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#d1d5db]" />
        <div className="flex items-center gap-3 px-5 py-4">
          <Avatar item={author} />
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[15px] font-black text-[#111827]">{author.page_name}</div>
            <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">@{author.page_username}</div>
          </div>
        </div>
        <div className="border-t border-[#f0eef6]">
          <button type="button" onClick={onMessage} className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#f7f7fb]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]"><i className="fa-regular fa-comment text-[15px]" /></span>
            <span className="text-[15px] font-bold text-[#111827]">Message Author</span>
          </button>
          <button type="button" onClick={onMute} className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#f7f7fb]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]"><i className="fa-regular fa-bell-slash text-[15px]" /></span>
            <span className="text-[15px] font-bold text-[#111827]">Mute updates</span>
          </button>
          <button type="button" onClick={onUnfollow} disabled={loading} className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#fff1f1] disabled:opacity-60">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]"><i className="fa-solid fa-user-minus text-[14px]" /></span>
            <span className="text-[15px] font-bold text-[#e5484d]">{loading ? 'Unfollowing...' : `Unfollow ${author.page_name}`}</span>
          </button>
          <button type="button" onClick={onReport} className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#fff8df]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8df] text-[#9a6b00]"><i className="fa-regular fa-flag text-[15px]" /></span>
            <span className="text-[15px] font-bold text-[#9a6b00]">Report Page</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function FollowedAuthorsEmpty() {
  return (
    <section className="px-4 py-8">
      <div className="rounded-[24px] bg-white px-5 py-10 text-center ring-1 ring-[#f0eef6]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff8df] text-[#d49a00] ring-1 ring-[#f6d56b]/50">
          <i className="fa-solid fa-feather-pointed text-[23px]" />
        </div>
        <h2 className="mt-4 text-[17px] font-black text-[#111827]">No followed authors yet</h2>
        <p className="mx-auto mt-2 max-w-[290px] text-[13px] font-semibold leading-6 text-[#8b93a1]">Author pages you follow will appear here.</p>
      </div>
    </section>
  )
}

function FollowedAuthorRow({ author, onOpen, onMenu }) {
  return (
    <button type="button" onClick={() => onOpen(author)} className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f7f7fb]">
      <Avatar item={author} />
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-black text-[#111827]">{author.page_name}</div>
        <div className="line-clamp-1 text-[12px] font-bold text-[#8b93a1]">
          @{author.page_username} · {Number(author.total_followers || 0).toLocaleString()} {Number(author.total_followers || 0) === 1 ? 'follower' : 'followers'}
        </div>
        <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#6b7280]">{Number(author.total_stories || 0).toLocaleString()} works</div>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onMenu(author)
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
        aria-label="Author actions"
      >
        <i className="fa-solid fa-ellipsis text-[16px]" />
      </button>
    </button>
  )
}

function FollowedAuthorsTab({ authors, total, sort, loading, message, selectedAuthor, actionLoading, onSortChange, onOpenAuthor, onOpenMenu, onCloseMenu, onMessage, onMute, onUnfollow, onReport }) {
  return (
    <section>
      <div className="flex items-center justify-between border-b border-[#f0eef6] px-4 py-3">
        <div>
          <div className="text-[13px] font-black text-[#111827]">{sort === 'popular' ? 'Popular' : sort === 'updated' ? 'Most Updated' : 'Recent'}</div>
          <div className="text-[11px] font-bold text-[#9ca3af]">{Number(total || 0).toLocaleString()} followed authors</div>
        </div>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="h-9 rounded-full bg-[#f5f3fa] px-3 text-[12px] font-black text-[#111827] outline-none">
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
          <option value="updated">Most Updated</option>
        </select>
      </div>
      {message ? <div className="mx-4 mt-4 rounded-[16px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">{message}</div> : null}
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
      ) : authors.length ? (
        <div className="divide-y divide-[#f0eef6]">
          {authors.map((author) => (
            <FollowedAuthorRow key={author.id} author={author} onOpen={onOpenAuthor} onMenu={onOpenMenu} />
          ))}
        </div>
      ) : (
        <FollowedAuthorsEmpty />
      )}
      <AuthorActionSheet author={selectedAuthor} loading={actionLoading} onClose={onCloseMenu} onMessage={onMessage} onMute={onMute} onUnfollow={onUnfollow} onReport={onReport} />
    </section>
  )
}

export default function ProfileFollowListPage() {
  const navigate = useNavigate()
  const { username, listType } = useParams()
  const storedUser = getStoredUser()
  const [users, setUsers] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [hiddenSuggestionIds, setHiddenSuggestionIds] = useState([])
  const [followedAuthors, setFollowedAuthors] = useState([])
  const [followedAuthorsTotal, setFollowedAuthorsTotal] = useState(0)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState('desc')
  const [authorSort, setAuthorSort] = useState('recent')
  const [loading, setLoading] = useState(true)
  const [authorsLoading, setAuthorsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [authorMessage, setAuthorMessage] = useState('')

  const safeType = listType === 'following' ? 'following' : listType === 'followed-authors' ? 'followed-authors' : 'followers'
  const isAuthorTab = safeType === 'followed-authors'
  const isOwnList = String(storedUser?.username || '').toLowerCase() === String(username || '').toLowerCase()

  const tabs = [
    { key: 'followers', label: 'Followers' },
    { key: 'following', label: 'Following' },
    { key: 'followed-authors', label: 'Followed Authors' },
  ]

  const visibleUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const list = keyword
      ? users.filter((user) => {
          return String(user.name || '').toLowerCase().includes(keyword) || String(user.username || '').toLowerCase().includes(keyword) || String(user.bio || '').toLowerCase().includes(keyword)
        })
      : users

    return order === 'asc' ? [...list].reverse() : list
  }, [order, query, users])

  const visibleSuggestions = useMemo(() => {
    const hidden = new Set(hiddenSuggestionIds)
    return suggestedUsers.filter((user) => !hidden.has(user.id)).slice(0, 8)
  }, [hiddenSuggestionIds, suggestedUsers])

  useEffect(() => {
    let ignore = false

    async function loadUsers() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      if (safeType === 'followed-authors') {
        setUsers([])
        setMessage('')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setMessage('')
        const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username || '')}/${safeType}?page=1&limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) throw new Error(data.message || `Failed to load ${safeType}`)
        if (!ignore) setUsers(Array.isArray(data.users) ? data.users : [])
      } catch (error) {
        if (!ignore) {
          setUsers([])
          setMessage(error.message || `Failed to load ${safeType}`)
        }
      } finally {
        if (!ignore) setLoading(false)
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
      if (!token || safeType === 'followed-authors') return

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/suggestions?page=1&limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) return
        if (!ignore) {
          const alreadyShown = new Set(users.map((user) => user.id))
          const suggestions = (Array.isArray(data.users) ? data.users : []).filter((user) => user.id !== storedUser?.id).filter((user) => !alreadyShown.has(user.id))
          setSuggestedUsers(suggestions)
        }
      } catch {
        if (!ignore) setSuggestedUsers([])
      }
    }

    loadSuggestions()

    return () => {
      ignore = true
    }
  }, [safeType, storedUser?.id, users])

  useEffect(() => {
    let ignore = false

    async function loadFollowedAuthors() {
      const token = getAuthToken()
      if (!token || safeType !== 'followed-authors') return

      try {
        setAuthorsLoading(true)
        setAuthorMessage('')
        const params = new URLSearchParams({ page: '1', limit: '50', sort: authorSort })
        if (query.trim()) params.set('q', query.trim())
        const response = await fetch(`${API_BASE_URL}/api/authors/following?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load followed authors')
        if (!ignore) {
          setFollowedAuthors(Array.isArray(data.author_pages) ? data.author_pages : [])
          setFollowedAuthorsTotal(Number(data.total || 0))
        }
      } catch (error) {
        if (!ignore) {
          setFollowedAuthors([])
          setFollowedAuthorsTotal(0)
          setAuthorMessage(error.message || 'Failed to load followed authors')
        }
      } finally {
        if (!ignore) setAuthorsLoading(false)
      }
    }

    loadFollowedAuthors()

    return () => {
      ignore = true
    }
  }, [authorSort, query, safeType])

  const handleBackToProfile = () => {
    navigate('/profile', { replace: true })
  }

  const handleOpenUser = (user) => {
    if (!user?.username) return
    if (String(user.username).toLowerCase() === String(storedUser?.username || '').toLowerCase()) {
      navigate('/profile')
      return
    }
    navigate(`/profile/${user.username}/followers`)
  }

  const handleOpenAuthor = (author) => {
    if (!author?.page_username) return
    navigate(`/author/page/${author.page_username}`)
  }

  const handleTabChange = (nextType) => {
    if (nextType === safeType) return
    setQuery('')
    navigate(`/profile/${username}/${nextType}`, { replace: true })
  }

  const handleToggleFollow = async (targetUser) => {
    const token = getAuthToken()
    if (!token) {
      navigate('/login')
      return
    }
    const currentlyFollowing = Boolean(targetUser.is_following)
    const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(targetUser.username)}/follow`, {
      method: currentlyFollowing ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to update follow')
    const updateUser = (user) => user.id === targetUser.id ? { ...user, is_following: !currentlyFollowing, can_follow_back: false } : user
    setUsers((current) => current.map(updateUser))
    setSuggestedUsers((current) => current.map(updateUser))
  }

  const handleUnfollowAuthor = async () => {
    const token = getAuthToken()
    if (!token || !selectedAuthor?.page_username) return

    try {
      setActionLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(selectedAuthor.page_username)}/follow`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to unfollow author')
      setFollowedAuthors((current) => current.filter((author) => author.id !== selectedAuthor.id))
      setFollowedAuthorsTotal((current) => Math.max(0, Number(current || 0) - 1))
      setSelectedAuthor(null)
    } catch (error) {
      setAuthorMessage(error.message || 'Failed to unfollow author')
    } finally {
      setActionLoading(false)
    }
  }

  const handleComingSoon = (text) => {
    setSelectedAuthor(null)
    setAuthorMessage(text)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[92px]">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <main className="mx-auto min-h-screen w-full bg-white md:max-w-[560px] md:border-x md:border-[#eceaf2]">
        <header className="sticky top-0 z-30 border-b border-[#f0eef6] bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <button type="button" onClick={handleBackToProfile} className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:scale-95" aria-label="Go back">
              <i className="fas fa-chevron-left text-[16px]" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="line-clamp-1 text-[17px] font-black text-[#111827]">@{username}</h1>
              <p className="mt-0.5 text-[11px] font-bold text-[#9ca3af]">Reader connections</p>
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-[#f7f7fb] text-center text-[12px] font-black text-[#111827]">
  {tabs.map((tab) => (
    <button
      key={tab.key}
      type="button"
      onClick={() => handleTabChange(tab.key)}
      className={`relative py-3 transition ${
        safeType === tab.key ? 'text-[#111827]' : 'text-[#9ca3af]'
      }`}
    >
      <span className="line-clamp-1">{tab.label}</span>
      {safeType === tab.key ? (
        <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-[#f6b800]" />
      ) : null}
    </button>
  ))}
</div>
          <div className="px-4 pb-3">
            <div className="flex h-11 items-center gap-2 rounded-full bg-[#f5f3fa] px-4">
              <i className="fas fa-search text-[13px] text-[#8b93a1]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={isAuthorTab ? 'Search authors' : 'Search readers'}
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
          </div>
        </header>

        {isAuthorTab ? (
          <FollowedAuthorsTab
            authors={followedAuthors}
            total={followedAuthorsTotal}
            sort={authorSort}
            loading={authorsLoading}
            message={authorMessage}
            selectedAuthor={selectedAuthor}
            actionLoading={actionLoading}
            onSortChange={setAuthorSort}
            onOpenAuthor={handleOpenAuthor}
            onOpenMenu={setSelectedAuthor}
            onCloseMenu={() => setSelectedAuthor(null)}
            onMessage={() => handleComingSoon('Message Author is not available yet.')}
            onMute={() => handleComingSoon('Mute updates is not available yet.')}
            onUnfollow={handleUnfollowAuthor}
            onReport={() => handleComingSoon('Report Page is not available yet.')}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[#f0eef6] px-4 py-3">
              <div>
                <div className="text-[13px] font-black text-[#111827]">{order === 'desc' ? 'Recent' : 'Oldest'}</div>
                <div className="text-[11px] font-bold text-[#9ca3af]">{visibleUsers.length} readers</div>
              </div>
              <button type="button" onClick={() => setOrder((current) => (current === 'desc' ? 'asc' : 'desc'))} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95" aria-label="Reverse order">
                <img
  src="/assets/Icons/Revers.svg"
  alt="Reverse"
  className="h-4 w-4"
/>
              </button>
            </div>
            {message ? <button type="button" onClick={() => setMessage('')} className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]">{message}</button> : null}
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
                      <UserRow key={user.id} user={user} type={safeType} isOwnList={isOwnList} onOpen={handleOpenUser} onToggleFollow={handleToggleFollow} />
                    ))}
                  </div>
                ) : (
                  <EmptyState type={safeType} />
                )}
                <section className="border-t border-[#f0eef6] py-5">
                  <div className="px-4 pb-3">
                    <div className="text-[15px] font-black text-[#111827]">Readers you may know</div>
                    <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">Discover readers and authors from the Shadow community.</p>
                  </div>
                  {visibleSuggestions.length ? (
                    <div className="divide-y divide-[#f0eef6]">
                      {visibleSuggestions.map((user) => (
                        <SuggestedRow key={user.id} user={user} onOpen={handleOpenUser} onToggleFollow={handleToggleFollow} onHide={(id) => setHiddenSuggestionIds((current) => [...current, id])} />
                      ))}
                    </div>
                  ) : null}
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

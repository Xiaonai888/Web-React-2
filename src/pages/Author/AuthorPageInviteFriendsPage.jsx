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

function Avatar({ user }) {
  const name = user?.name || user?.username || 'Reader'

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eceef2] text-[15px] font-bold text-[#111827]">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="h-full w-full object-cover" />
      ) : (
        String(name).slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function AuthorPageInviteFriendsPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [authorPage, setAuthorPage] = useState(null)
  const [friends, setFriends] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [inviteState, setInviteState] = useState({})

  const pageName = authorPage?.page_name || 'Author Page'

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return undefined
    }

    let ignore = false
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setMessage('')

        const [authorResponse, meResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }),
        ])

        const authorData = await authorResponse.json().catch(() => ({}))
        const meData = await meResponse.json().catch(() => ({}))

        if (!authorResponse.ok || authorData.ok === false) {
          throw new Error(authorData.message || 'Author Page not found')
        }

        if (!meResponse.ok || meData.ok === false || !meData.user?.username) {
          throw new Error(meData.message || 'Failed to load your account')
        }

        const allFriends = []
        let currentPage = 1
        let hasNext = true

        while (hasNext && currentPage <= 20) {
          const response = await fetch(
            `${API_BASE_URL}/api/users/${encodeURIComponent(meData.user.username)}/following?page=${currentPage}&limit=50`,
            {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            }
          )
          const data = await response.json().catch(() => ({}))

          if (!response.ok || data.ok === false) {
            throw new Error(data.message || 'Failed to load friends')
          }

          allFriends.push(...(Array.isArray(data.users) ? data.users : []))
          hasNext = Boolean(data.has_next)
          currentPage += 1
        }

        if (!ignore) {
          setAuthorPage(authorData.author_page || authorData.page || null)
          setFriends(allFriends)
        }
      } catch (error) {
        if (!ignore && error?.name !== 'AbortError') {
          setMessage(error.message || 'Failed to load friends')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, pageUsername])

  const filteredFriends = useMemo(() => {
    const text = query.trim().toLowerCase()

    if (!text) return friends

    return friends.filter((user) =>
      [user?.name, user?.username, user?.bio]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text))
    )
  }, [friends, query])

  async function inviteFriend(user) {
    const token = getAuthToken()
    const userId = String(user?.id || '')

    if (!token) {
      navigate('/login')
      return
    }

    if (!userId || inviteState[userId] === 'loading') return

    try {
      setInviteState((current) => ({ ...current, [userId]: 'loading' }))
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}/invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ target_user_id: userId }),
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to send invite')
      }

      setInviteState((current) => ({
        ...current,
        [userId]: data.status === 'following' ? 'following' : 'invited',
      }))
    } catch (error) {
      setInviteState((current) => ({ ...current, [userId]: 'idle' }))
      setMessage(error.message || 'Failed to send invite')
    }
  }

  function getButtonState(userId) {
    return inviteState[String(userId)] || 'idle'
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <h1 className="ml-2 text-[18px] font-bold text-[#111827]">Invite friends</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] pb-10">
        <section className="bg-white px-4 pb-4 pt-2">
          <p className="text-[14px] font-normal leading-5 text-[#6b7280]">
            Invite friends you follow to follow {pageName}.
          </p>

          <div className="mt-4 flex h-10 items-center rounded-full bg-[#f0f2f5] px-3">
            <i className="fa-solid fa-magnifying-glass mr-2 text-[14px] text-[#6b7280]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search friends"
              className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[#111827] outline-none placeholder:text-[#8b93a1]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="ml-2 flex h-7 w-7 items-center justify-center text-[#6b7280]"
                aria-label="Clear"
              >
                <i className="fa-solid fa-xmark text-[13px]" />
              </button>
            ) : null}
          </div>
        </section>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mt-2 w-full bg-[#fff7d6] px-4 py-3 text-left text-[13px] font-normal text-[#111827]"
          >
            {message}
          </button>
        ) : null}

        <div className="mt-2 bg-white">
          <div className="px-4 pb-2 pt-4 text-[14px] font-bold text-[#111827]">
            Friends you follow
          </div>

          {loading ? (
            <div className="px-4 py-10 text-center text-[13px] font-normal text-[#6b7280]">
              Loading...
            </div>
          ) : filteredFriends.length ? (
            filteredFriends.map((user) => {
              const state = getButtonState(user.id)
              const disabled = state === 'loading' || state === 'invited' || state === 'following'
              const label =
                state === 'loading'
                  ? '...'
                  : state === 'invited'
                    ? 'Invited'
                    : state === 'following'
                      ? 'Following'
                      : 'Invite'

              return (
                <div key={user.id} className="flex min-h-[68px] items-center gap-3 px-4 py-3">
                  <Avatar user={user} />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-[#111827]">
                      {user.name || user.username || 'Reader'}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] font-normal text-[#8b93a1]">
                      @{user.username || 'reader'}
                      {user.is_followed_by ? ' · Follows you' : ''}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => inviteFriend(user)}
                    disabled={disabled}
                    className={`h-9 min-w-[78px] rounded-full px-4 text-[13px] font-bold active:scale-[0.98] disabled:active:scale-100 ${
                      state === 'idle'
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-[#ede9fe] text-[#6d28d9]'
                    }`}
                  >
                    {label}
                  </button>
                </div>
              )
            })
          ) : (
            <div className="px-5 py-12 text-center">
              <i className="fa-regular fa-address-book text-[28px] text-[#9ca3af]" />
              <p className="mt-3 text-[14px] font-normal text-[#6b7280]">
                {query ? 'No friends found.' : 'You are not following anyone yet.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

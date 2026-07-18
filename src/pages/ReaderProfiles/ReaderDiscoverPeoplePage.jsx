import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HIDDEN_SUGGESTIONS_KEY = 'shadow_reader_hidden_suggestions_v1'
const HIDDEN_DURATION_MS = 30 * 24 * 60 * 60 * 1000
const MAX_VISIBLE_PEOPLE = 50

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

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function readHiddenSuggestions() {
  try {
    const now = Date.now()
    const stored = JSON.parse(localStorage.getItem(HIDDEN_SUGGESTIONS_KEY) || '{}')
    const active = Object.fromEntries(
      Object.entries(stored).filter(([, expiresAt]) => Number(expiresAt) > now)
    )
    localStorage.setItem(HIDDEN_SUGGESTIONS_KEY, JSON.stringify(active))
    return active
  } catch {
    return {}
  }
}

function ReaderAvatar({ user }) {
  const name = user?.name || user?.username || 'Reader'

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[20px] font-bold text-[#6b7280] ring-1 ring-black/10">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="h-full w-full object-cover" />
      ) : (
        String(name).slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

function PersonRow({ user, followBack, busy, onFollow, onHide }) {
  const following = Boolean(user.is_following)

  return (
    <article className="flex items-center gap-3 px-4 py-3">
      <ReaderAvatar user={user} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[15px] font-semibold text-[#111827]">
          {user.name || user.username}
        </div>

        <div className="mt-0.5 line-clamp-1 text-[12px] font-normal text-[#6b7280]">
          {followBack ? 'Follows you' : 'Suggested for you'}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onFollow(user)}
        disabled={following || busy}
        className={`h-10 min-w-[116px] rounded-[10px] px-4 text-[13px] font-semibold transition active:scale-[0.98] disabled:cursor-default ${
          following
            ? 'bg-[#f3f4f6] text-[#111827]'
            : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-sm'
        }`}
      >
        {busy ? 'Following...' : following ? 'Following' : followBack ? 'Follow back' : 'Follow'}
      </button>

      <button
        type="button"
        onClick={() => onHide(user.id)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] active:bg-[#f3f4f6]"
        aria-label={`Hide ${user.name || user.username}`}
      >
        <i className="fa-solid fa-xmark text-[16px]" />
      </button>
    </article>
  )
}

function PeopleSection({ title, users, followBack, actionId, onFollow, onHide }) {
  if (!users.length) return null

  return (
    <section>
      <h2 className="px-4 pb-2 pt-5 text-[17px] font-semibold text-[#111827]">
        {title}
      </h2>

      <div>
        {users.map((user) => (
          <PersonRow
            key={user.id}
            user={user}
            followBack={followBack}
            busy={actionId === user.id}
            onFollow={onFollow}
            onHide={onHide}
          />
        ))}
      </div>
    </section>
  )
}

export default function ReaderDiscoverPeoplePage() {
  const navigate = useNavigate()
  const storedUser = getStoredUser()
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [followBackUsers, setFollowBackUsers] = useState([])
  const [hiddenSuggestions, setHiddenSuggestions] = useState(readHiddenSuggestions)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPeople() {
      const token = getAuthToken()
      const username = storedUser?.username || ''

      if (!token || !username) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const [suggestionsResponse, followersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/suggestions?page=1&limit=50`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(
            `${API_BASE_URL}/api/users/${encodeURIComponent(username)}/followers?page=1&limit=50`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ])

        const suggestionsData = await suggestionsResponse.json().catch(() => ({}))
        const followersData = await followersResponse.json().catch(() => ({}))

        if (!suggestionsResponse.ok || suggestionsData.ok === false) {
          throw new Error(suggestionsData.message || 'Failed to load people')
        }

        if (!ignore) {
          const suggestions = Array.isArray(suggestionsData.users)
            ? suggestionsData.users
            : []
          const followers =
            followersResponse.ok && followersData.ok !== false && Array.isArray(followersData.users)
              ? followersData.users.filter((user) => !user.is_following)
              : []

          setSuggestedUsers(suggestions)
          setFollowBackUsers(followers)
          setHiddenSuggestions(readHiddenSuggestions())
        }
      } catch (error) {
        if (!ignore) {
          setSuggestedUsers([])
          setFollowBackUsers([])
          setMessage(error.message || 'Failed to load people')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPeople()

    return () => {
      ignore = true
    }
  }, [navigate, storedUser?.username])

  const sections = useMemo(() => {
    const hiddenIds = new Set(Object.keys(hiddenSuggestions))
    const visibleFollowBack = followBackUsers.filter(
      (user) => !hiddenIds.has(String(user.id))
    )
    const followBackIds = new Set(visibleFollowBack.map((user) => user.id))
    const visibleSuggestions = suggestedUsers.filter(
      (user) =>
        !hiddenIds.has(String(user.id)) &&
        !followBackIds.has(user.id)
    )

    const suggestedForYou = visibleSuggestions.slice(0, 12)
    const followBack = visibleFollowBack.slice(
      0,
      Math.min(10, MAX_VISIBLE_PEOPLE - suggestedForYou.length)
    )
    const usedCount = suggestedForYou.length + followBack.length
    const moreSuggestions = visibleSuggestions.slice(
      suggestedForYou.length,
      suggestedForYou.length + Math.max(0, MAX_VISIBLE_PEOPLE - usedCount)
    )

    return {
      suggestedForYou,
      followBack,
      moreSuggestions,
      total: suggestedForYou.length + followBack.length + moreSuggestions.length,
    }
  }, [followBackUsers, hiddenSuggestions, suggestedUsers])

  function hideSuggestion(userId) {
    const next = {
      ...readHiddenSuggestions(),
      [String(userId)]: Date.now() + HIDDEN_DURATION_MS,
    }

    localStorage.setItem(HIDDEN_SUGGESTIONS_KEY, JSON.stringify(next))
    setHiddenSuggestions(next)
  }

  function incrementStoredFollowingCount() {
    const current = getStoredUser()
    if (!current) return

    saveStoredUser({
      ...current,
      following_count: Number(current.following_count || 0) + 1,
    })
  }

  async function handleFollow(user) {
    if (!user?.username || user.is_following || actionId) return

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setActionId(user.id)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(user.username)}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to follow reader')
      }

      const markFollowing = (items) =>
        items.map((item) =>
          item.id === user.id ? { ...item, is_following: true } : item
        )

      setSuggestedUsers(markFollowing)
      setFollowBackUsers(markFollowing)
      incrementStoredFollowingCount()
    } catch (error) {
      setMessage(error.message || 'Failed to follow reader')
    } finally {
      setActionId('')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto min-h-screen w-full bg-white md:max-w-[560px] md:border-x md:border-[#eceaf2]">
        <header className="sticky top-0 z-30 flex h-[58px] items-center border-b border-[#f0eef6] bg-white/95 px-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <h1 className="ml-2 text-[20px] font-semibold text-[#111827]">
            Discover people
          </h1>
        </header>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%_-_2rem)] rounded-[14px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-semibold text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="space-y-4 px-4 py-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-16 w-16 animate-pulse rounded-full bg-[#f3f4f6]" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-36 animate-pulse rounded-full bg-[#f3f4f6]" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-[#f3f4f6]" />
                </div>
                <div className="h-10 w-[116px] animate-pulse rounded-[10px] bg-[#f3f4f6]" />
              </div>
            ))}
          </div>
        ) : sections.total ? (
          <div className="pb-8">
            <PeopleSection
              title="Suggested for you"
              users={sections.suggestedForYou}
              actionId={actionId}
              onFollow={handleFollow}
              onHide={hideSuggestion}
            />

            <PeopleSection
              title="Follow back"
              users={sections.followBack}
              followBack
              actionId={actionId}
              onFollow={handleFollow}
              onHide={hideSuggestion}
            />

            <PeopleSection
              title="More suggestions"
              users={sections.moreSuggestions}
              actionId={actionId}
              onFollow={handleFollow}
              onHide={hideSuggestion}
            />

            <div className="px-4 pt-5 text-center text-[11px] font-normal text-[#9ca3af]">
              Showing up to {MAX_VISIBLE_PEOPLE} people
            </div>
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280]">
              <i className="fa-solid fa-user-group text-[22px]" />
            </div>

            <h2 className="mt-4 text-[17px] font-semibold text-[#111827]">
              No suggestions right now
            </h2>

            <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-normal leading-5 text-[#6b7280]">
              New people may appear later as the Shadow community grows.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

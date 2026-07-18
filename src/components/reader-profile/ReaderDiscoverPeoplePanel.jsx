import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HIDDEN_SUGGESTIONS_KEY = 'shadow_reader_hidden_suggestions_v1'
const HIDDEN_DURATION_MS = 30 * 24 * 60 * 60 * 1000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
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
    <div className="mx-auto flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[24px] font-bold text-[#6b7280] ring-1 ring-black/10">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={name} className="h-full w-full object-cover" />
      ) : (
        String(name).slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function ReaderDiscoverPeoplePanel({ open, onFollowed }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [hiddenSuggestions, setHiddenSuggestions] = useState(readHiddenSuggestions)
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open) return undefined

    let ignore = false

    async function loadSuggestions() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/users/suggestions?page=1&limit=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load people')
        }

        if (!ignore) {
          setUsers(Array.isArray(data.users) ? data.users : [])
          setHiddenSuggestions(readHiddenSuggestions())
        }
      } catch (error) {
        if (!ignore) {
          setUsers([])
          setMessage(error.message || 'Failed to load people')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadSuggestions()

    return () => {
      ignore = true
    }
  }, [navigate, open])

  const visibleUsers = useMemo(() => {
    const hiddenIds = new Set(Object.keys(hiddenSuggestions))
    return users.filter((user) => !hiddenIds.has(String(user.id)))
  }, [hiddenSuggestions, users])

  function hideSuggestion(userId) {
    const next = {
      ...readHiddenSuggestions(),
      [String(userId)]: Date.now() + HIDDEN_DURATION_MS,
    }

    localStorage.setItem(HIDDEN_SUGGESTIONS_KEY, JSON.stringify(next))
    setHiddenSuggestions(next)
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

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, is_following: true } : item
        )
      )
      onFollowed?.(user)
    } catch (error) {
      setMessage(error.message || 'Failed to follow reader')
    } finally {
      setActionId('')
    }
  }

  if (!open) return null

  return (
    <>
      <style>{`.reader-discover-scroll::-webkit-scrollbar{display:none}.reader-discover-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      <section className="mt-5 border-t border-[#f0eef6] pt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-[#111827]">Discover people</h2>

          <button
            type="button"
            onClick={() => navigate('/profile/discover-people')}
            className="text-[13px] font-semibold text-[#7c3aed] active:opacity-70"
          >
            See all
          </button>
        </div>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-3 w-full rounded-[12px] bg-[#fff1f1] px-3 py-2 text-left text-[11px] font-semibold text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="reader-discover-scroll flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[220px] w-[166px] shrink-0 animate-pulse rounded-[16px] border border-[#e5e7eb] bg-[#f8fafc]"
              />
            ))}
          </div>
        ) : visibleUsers.length ? (
          <div className="reader-discover-scroll flex gap-2 overflow-x-auto pb-1">
            {visibleUsers.map((user) => {
              const following = Boolean(user.is_following)
              const busy = actionId === user.id

              return (
                <article
                  key={user.id}
                  className="relative w-[166px] shrink-0 rounded-[16px] border border-[#e5e7eb] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                >
                  <ReaderAvatar user={user} />

                  <div className="mt-3 line-clamp-1 text-center text-[14px] font-semibold text-[#111827]">
                    {user.name || user.username}
                  </div>

                  <div className="mt-0.5 line-clamp-1 text-center text-[11px] font-normal text-[#6b7280]">
                    @{user.username}
                  </div>

                  <button
                    type="button"
                    onClick={() => hideSuggestion(user.id)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#6b7280] shadow-sm ring-1 ring-black/5 active:scale-95"
                    aria-label={`Hide ${user.name || user.username}`}
                  >
                    <i className="fa-solid fa-xmark text-[12px]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFollow(user)}
                    disabled={following || busy}
                    className={`mt-3 h-8 w-full rounded-[8px] text-[12px] font-semibold transition active:scale-[0.98] disabled:cursor-default ${
                      following
                        ? 'bg-[#f3f4f6] text-[#111827]'
                        : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-sm'
                    }`}
                  >
                    {busy ? 'Following...' : following ? 'Following' : 'Follow'}
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[14px] bg-[#f8fafc] px-4 py-5 text-center text-[12px] font-normal text-[#6b7280]">
            No new people to discover.
          </div>
        )}
      </section>
    </>
  )
}

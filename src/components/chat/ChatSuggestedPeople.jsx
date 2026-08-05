import {
  LoaderCircle,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HIDDEN_SUGGESTIONS_KEY =
  'shadow_reader_hidden_suggestions_v1'
const HIDDEN_DURATION_MS =
  30 * 24 * 60 * 60 * 1000

function getToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readHiddenSuggestions() {
  try {
    const now = Date.now()
    const stored = JSON.parse(
      localStorage.getItem(
        HIDDEN_SUGGESTIONS_KEY
      ) || '{}'
    )

    const active = Object.fromEntries(
      Object.entries(stored).filter(
        ([, expiresAt]) =>
          Number(expiresAt) > now
      )
    )

    localStorage.setItem(
      HIDDEN_SUGGESTIONS_KEY,
      JSON.stringify(active)
    )

    return active
  } catch {
    return {}
  }
}

function formatFollowers(value) {
  const count = Number(value || 0)

  if (count >= 1000000) {
    return `${(count / 1000000)
      .toFixed(count >= 10000000 ? 0 : 1)
      .replace('.0', '')}M`
  }

  if (count >= 1000) {
    return `${(count / 1000)
      .toFixed(count >= 10000 ? 0 : 1)
      .replace('.0', '')}K`
  }

  return String(count)
}

function SuggestedAvatar({ user }) {
  const [failed, setFailed] = useState(false)
  const name =
    user?.name ||
    user?.username ||
    'Reader'
  const letter =
    String(name).trim().charAt(0).toUpperCase() ||
    'R'

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-extrabold text-white">
      {user?.avatar_url && !failed ? (
        <img
          src={user.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

export default function ChatSuggestedPeople() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [hiddenSuggestions, setHiddenSuggestions] =
    useState(readHiddenSuggestions)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadSuggestions() {
      const token = getToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const response = await fetch(
          `${API_BASE_URL}/api/users/suggestions?page=1&limit=12`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              'Failed to load suggestions'
          )
        }

        if (!ignore) {
          setUsers(
            Array.isArray(data.users)
              ? data.users
              : []
          )
          setHiddenSuggestions(
            readHiddenSuggestions()
          )
          setMessage('')
        }
      } catch (error) {
        if (!ignore) {
          setUsers([])
          setMessage(
            error.message ||
              'Failed to load suggestions'
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      ignore = true
    }
  }, [])

  const visibleUsers = useMemo(() => {
    const hiddenIds = new Set(
      Object.keys(hiddenSuggestions)
    )

    return users
      .filter(
        (user) =>
          !hiddenIds.has(String(user.id))
      )
      .slice(0, 3)
  }, [hiddenSuggestions, users])

  const hideSuggestion = (userId) => {
    const next = {
      ...readHiddenSuggestions(),
      [String(userId)]:
        Date.now() + HIDDEN_DURATION_MS,
    }

    localStorage.setItem(
      HIDDEN_SUGGESTIONS_KEY,
      JSON.stringify(next)
    )
    setHiddenSuggestions(next)
  }

  const handleFollow = async (user) => {
    if (
      !user?.username ||
      user.is_following ||
      actionId
    ) {
      return
    }

    const token = getToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setActionId(user.id)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(
          user.username
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to follow account'
        )
      }

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                is_following: true,
              }
            : item
        )
      )
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to follow account'
      )
    } finally {
      setActionId('')
    }
  }

  if (
    !loading &&
    !visibleUsers.length &&
    !message
  ) {
    return null
  }

  return (
    <section className="border-t border-[#eeeeF2] px-4 pb-5 pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-extrabold text-[#111827]">
          Accounts to follow
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate('/profile/discover-people')
          }
          className="text-[13px] font-extrabold text-[#7c3aed] active:opacity-70"
        >
          See all
        </button>
      </div>

      {message ? (
        <div className="mb-3 rounded-[14px] bg-[#fff1f1] px-3 py-2 text-[11px] font-semibold text-[#d13a42]">
          {message}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3"
              >
                <div className="h-12 w-12 rounded-full bg-[#eeeeF2]" />
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-28 rounded-full bg-[#eeeeF2]" />
                  <div className="mt-2 h-3 w-36 rounded-full bg-[#f3f3f6]" />
                </div>
                <div className="h-9 w-24 rounded-[10px] bg-[#eeeeF2]" />
              </div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleUsers.map((user) => {
            const following = Boolean(
              user.is_following
            )
            const busy =
              actionId === user.id

            return (
              <article
                key={user.id}
                className="flex items-center gap-3"
              >
                <SuggestedAvatar user={user} />

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-extrabold text-[#111827]">
                    {user.name ||
                      user.username}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] font-medium text-[#8a8a95]">
                    {user.is_author
                      ? 'Author'
                      : 'Reader'}
                    {' · '}
                    {formatFollowers(
                      user.followers_count
                    )}{' '}
                    followers
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleFollow(user)
                  }
                  disabled={
                    following || busy
                  }
                  className={`flex h-9 min-w-[96px] items-center justify-center rounded-[10px] px-4 text-[12px] font-extrabold transition active:scale-[0.98] disabled:cursor-default ${
                    following
                      ? 'bg-[#f0eef5] text-[#5d5868]'
                      : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_6px_16px_rgba(124,58,237,0.22)]'
                  }`}
                >
                  {busy ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  ) : following ? (
                    'Following'
                  ) : (
                    'Follow'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    hideSuggestion(user.id)
                  }
                  aria-label={`Hide ${
                    user.name ||
                    user.username
                  }`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#a0a0aa] transition active:scale-90"
                >
                  <X size={17} />
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

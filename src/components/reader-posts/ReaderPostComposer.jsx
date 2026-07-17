import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function ReaderAvatar({ user }) {
  const name = user?.name || 'Reader'
  const avatarUrl =
    user?.avatar_url || ''

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-semibold text-white">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function ReaderPostComposer() {
  const navigate = useNavigate()
  const user = useMemo(
    () => getStoredUser(),
    []
  )
  const [
    comingSoonVisible,
    setComingSoonVisible,
  ] = useState(false)

  useEffect(() => {
    if (!comingSoonVisible) {
      return undefined
    }

    const timer = window.setTimeout(
      () => {
        setComingSoonVisible(false)
      },
      2400
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [comingSoonVisible])

  function openComposer() {
    if (!getAuthToken()) {
      navigate('/login')
      return
    }

    navigate('/reader/post/create')
  }

  return (
    <section className="relative bg-white px-3 py-3 sm:rounded-[12px]">
      <div className="flex items-center gap-3">
        <ReaderAvatar user={user} />

        <button
          type="button"
          onClick={openComposer}
          className="h-10 min-w-0 flex-1 rounded-full border border-[#d7dbe2] bg-white px-4 text-left text-[14px] font-normal text-[#4b5563] active:bg-gray-50"
        >
          Share your thoughts...
        </button>

        <button
          type="button"
          onClick={() =>
            setComingSoonVisible(true)
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4b5563] active:bg-gray-100"
          aria-label="Add an image"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect
              x="3.5"
              y="4"
              width="17"
              height="16"
              rx="2.5"
            />
            <circle
              cx="9"
              cy="9"
              r="1.5"
            />
            <path d="m5.5 17 4.2-4.2 3.1 3.1 2.1-2.1 3.6 3.2" />
          </svg>
        </button>
      </div>

      {comingSoonVisible ? (
        <div
          role="status"
          className="absolute right-3 top-[58px] z-30 max-w-[250px] rounded-[12px] bg-[#111827] px-3 py-2 text-[11px] font-normal leading-4 text-white shadow-lg"
        >
          Image posting is coming soon.
          Text posts are available now.
        </div>
      ) : null}
    </section>
  )
}

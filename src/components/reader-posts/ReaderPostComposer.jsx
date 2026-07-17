import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

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
  const avatarUrl = user?.avatar_url || ''

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

export default function ReaderPostComposer({
  onCreated,
}) {
  const navigate = useNavigate()
  const user = useMemo(
    () => getStoredUser(),
    []
  )
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [comingSoonVisible, setComingSoonVisible] =
    useState(false)

  useEffect(() => {
    if (!comingSoonVisible) return undefined

    const timer = window.setTimeout(() => {
      setComingSoonVisible(false)
    }, 2400)

    return () => {
      window.clearTimeout(timer)
    }
  }, [comingSoonVisible])

  function openComposer() {
    if (!getAuthToken()) {
      navigate('/login')
      return
    }

    setMessage('')
    setOpen(true)
  }

  function showImageComingSoon() {
    setComingSoonVisible(true)
  }

  function closeComposer() {
    if (saving) return

    setOpen(false)
    setMessage('')
  }

  async function createPost() {
    const text = content.trim()

    if (!text) {
      setMessage('Write something first.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            content: text,
          }),
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
            'Failed to create post'
        )
      }

      if (data.post) {
        onCreated?.(data.post)
      }

      setContent('')
      setOpen(false)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to create post'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <section className="relative bg-white px-3 py-3 sm:rounded-[12px]">
        <div className="flex items-center gap-3">
          <ReaderAvatar user={user} />

          <button
            type="button"
            onClick={openComposer}
            className="h-10 min-w-0 flex-1 rounded-full border border-[#d7dbe2] bg-white px-4 text-left text-[14px] font-normal text-[#4b5563] active:bg-gray-50"
          >
            What's on your mind?
          </button>

          <button
            type="button"
            onClick={showImageComingSoon}
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
          <div className="absolute right-3 top-[58px] z-30 rounded-[12px] bg-[#111827] px-3 py-2 text-[11px] font-normal text-white shadow-lg">
            Image posts are coming soon. Text posts are available now.
          </div>
        ) : null}
      </section>

      {open ? (
        <div className="fixed inset-0 z-[200000] flex items-end justify-center bg-black/45 sm:items-center sm:p-4">
          <button
            type="button"
            onClick={closeComposer}
            className="absolute inset-0"
            aria-label="Close post composer"
          />

          <section className="relative w-full max-w-[520px] rounded-t-[24px] bg-white p-4 shadow-2xl sm:rounded-[24px]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-[17px] font-semibold text-[#111827]">
                Create post
              </div>

              <button
                type="button"
                onClick={closeComposer}
                className="flex h-9 w-9 items-center justify-center text-[#111827]"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark text-[18px]" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <ReaderAvatar user={user} />

              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-[#111827]">
                  {user?.name || 'Reader'}
                </div>
                <div className="mt-0.5 text-[11px] font-normal text-gray-400">
                  Public · 🌐
                </div>
              </div>
            </div>

            <textarea
              autoFocus
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value.slice(
                    0,
                    1000
                  )
                )
              }
              placeholder="What's on your mind?"
              className="mt-4 min-h-[180px] w-full resize-none border-0 bg-white text-[18px] font-normal leading-7 text-[#111827] outline-none placeholder:text-gray-400"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] font-normal text-gray-400">
                Text only
              </span>
              <span className="text-[11px] font-normal text-gray-400">
                {content.length}/1000
              </span>
            </div>

            {message ? (
              <div className="mt-3 rounded-[12px] bg-red-50 px-3 py-2 text-[12px] font-normal text-red-600">
                {message}
              </div>
            ) : null}

            <button
              type="button"
              onClick={createPost}
              disabled={
                saving ||
                !content.trim()
              }
              className="mt-4 h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white disabled:bg-gray-300"
            >
              {saving
                ? 'Posting...'
                : 'Post'}
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}

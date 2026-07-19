import { useEffect, useRef, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTIONS = [
  { type: 'love', label: 'Love', src: '/assets/React/Love.svg', text: '#ff2f5f' },
  { type: 'haha', label: 'Haha', src: '/assets/React/Haha.svg', text: '#f59e0b' },
  { type: 'wow', label: 'Wow', src: '/assets/React/Wow.svg', text: '#f59e0b' },
  { type: 'sad', label: 'Sad', src: '/assets/React/Sad.svg', text: '#3b82f6' },
  { type: 'angry', label: 'Angry', src: '/assets/React/Angry.svg', text: '#ef4444' },
  { type: 'support', label: 'Support', src: '/assets/React/Support.svg', text: '#16a34a' },
  { type: 'touched', label: 'Touched', src: '/assets/React/Touched.svg', text: '#8b5cf6' },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

export default function ReaderPostReactionButton({
  postId,
  initialCount = 0,
  initialReaction = null,
  onChanged,
}) {
  const pressTimerRef = useRef(null)
  const longPressOpenedRef = useRef(false)
  const [reactionType, setReactionType] = useState(initialReaction || null)
  const [reactionCount, setReactionCount] = useState(Number(initialCount || 0))
  const [pickerOpen, setPickerOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const activeReaction =
    REACTIONS.find((reaction) => reaction.type === reactionType) || null

  useEffect(() => {
    setReactionCount(Number(initialCount || 0))
  }, [initialCount])

  useEffect(() => {
    setReactionType(initialReaction || null)
  }, [initialReaction])

  useEffect(() => {
    let cancelled = false
    const token = getAuthToken()

    if (!postId || !token) return undefined

    fetch(`${API_BASE_URL}/api/reader-posts/${encodeURIComponent(postId)}/reaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (cancelled || !response.ok || data.ok === false) return
        setReactionType(data.my_reaction || null)
        setReactionCount(Number(data.like_count || 0))
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [postId])

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        window.clearTimeout(pressTimerRef.current)
      }
    }
  }, [])

  function showMessage(text) {
    setMessage(text)
    window.clearTimeout(showMessage.timer)
    showMessage.timer = window.setTimeout(() => setMessage(''), 1800)
  }

  async function setReaction(nextReactionType) {
    if (!postId || busy) return

    const token = getAuthToken()

    if (!token) {
      showMessage('Please login first.')
      return
    }

    try {
      setBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(postId)}/reaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reaction_type: nextReactionType,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update reaction')
      }

      const nextType = data.reacted ? data.reaction_type || nextReactionType : null
      const nextCount = Number(data.like_count || 0)

      setReactionType(nextType)
      setReactionCount(nextCount)
      setPickerOpen(false)

      onChanged?.({
        reacted: Boolean(data.reacted),
        reaction_type: nextType,
        like_count: nextCount,
        reaction_summary: Array.isArray(data.reaction_summary)
          ? data.reaction_summary
          : [],
      })
    } catch (error) {
      showMessage(error.message || 'Failed to update reaction.')
    } finally {
      setBusy(false)
    }
  }

  function startReactionPress() {
    if (busy) return

    longPressOpenedRef.current = false
    pressTimerRef.current = window.setTimeout(() => {
      longPressOpenedRef.current = true
      pressTimerRef.current = null
      setPickerOpen(true)
    }, 420)
  }

  function endReactionPress() {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }

    if (longPressOpenedRef.current) {
      longPressOpenedRef.current = false
      return
    }

    setReaction('love')
  }

  function cancelReactionPress() {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }

    longPressOpenedRef.current = false
  }

  return (
    <div className="relative">
      {pickerOpen ? (
        <div className="absolute bottom-8 left-0 z-40 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-2xl ring-1 ring-black/10">
          {REACTIONS.map((reaction) => (
            <button
              key={reaction.type}
              type="button"
              disabled={busy}
              onClick={() => setReaction(reaction.type)}
              className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90 disabled:opacity-60"
              aria-label={reaction.label}
            >
              <img
                src={reaction.src}
                alt={reaction.label}
                className="h-8 w-8 object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onPointerDown={startReactionPress}
        onPointerUp={endReactionPress}
        onPointerLeave={cancelReactionPress}
        onPointerCancel={cancelReactionPress}
        onContextMenu={(event) => event.preventDefault()}
        className="inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60"
        style={{ color: activeReaction?.text || undefined }}
        aria-label={activeReaction ? activeReaction.label : 'React'}
      >
        {activeReaction ? (
          <img
            src={activeReaction.src}
            alt=""
            aria-hidden="true"
            className="h-[17px] w-[17px] object-contain"
          />
        ) : (
          <i className="fa-regular fa-heart text-[15px]" />
        )}
        {formatCompactNumber(reactionCount)}
      </button>

      {message ? (
        <div className="fixed left-1/2 top-20 z-[300] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
          {message}
        </div>
      ) : null}
    </div>
  )
}

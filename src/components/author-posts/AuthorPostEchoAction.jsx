import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import EchoShareSheetV2Connected from '../social/EchoShareSheetV2Connected'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}

export default function AuthorPostEchoAction({
  post,
  author,
  className = '',
  onCountChange,
}) {
  const [open, setOpen] = useState(false)
  const [echoCount, setEchoCount] =
    useState(Number(post?.echo_count || 0))
  const onCountChangeRef =
    useRef(onCountChange)

  onCountChangeRef.current =
    onCountChange

  const echoStateLoaded =
    Boolean(post?.echo_state_loaded)

  useEffect(() => {
    setEchoCount(Number(post?.echo_count || 0))
  }, [post?.echo_count, post?.id])

  useEffect(() => {
    const postId = String(post?.id || '').trim()

    if (!postId) return undefined

    const controller = new AbortController()
    const token = getReaderToken()
    let ignore = false

    async function loadEchoCount() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/echo-v2/source/author_post/${encodeURIComponent(
            postId
          )}?page=1&limit=1`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          ignore ||
          !response.ok ||
          data.ok === false
        ) {
          return
        }

        const total = Math.max(
          0,
          Number(data.echo_count || 0)
        )

        setEchoCount(total)
        onCountChangeRef.current?.(
          post?.id,
          total,
          null
        )
      } catch (error) {
        if (error?.name !== 'AbortError') {
          return
        }
      }
    }

    function handleEchoUpdated(event) {
      const detail = event?.detail || {}

      if (
        String(detail.sourceType || '') !==
          'author_post' ||
        String(detail.sourceId || '') !== postId
      ) {
        return
      }

      const total = Math.max(
        0,
        Number(detail.echoCount || 0)
      )

      setEchoCount(total)
      onCountChangeRef.current?.(
        post?.id,
        total,
        null
      )
    }

    window.addEventListener(
      'shadow:echo-v2-updated',
      handleEchoUpdated
    )

    if (!echoStateLoaded) {
      loadEchoCount()
    }

    return () => {
      ignore = true
      controller.abort()
      window.removeEventListener(
        'shadow:echo-v2-updated',
        handleEchoUpdated
      )
    }
  }, [
    echoStateLoaded,
    post?.id,
  ])

  const shareUrl = useMemo(() => {
  const postId = String(post?.id || '').trim()

  if (!postId) return window.location.origin

  return `${window.location.origin}/author/post/${encodeURIComponent(
    postId
  )}?source=share`
}, [post?.id])

  const handleEchoed = (
    echo,
    nextTotal
  ) => {
    const total = Math.max(
      0,
      Number(nextTotal || 0)
    )

    setEchoCount(total)
    onCountChange?.(
      post?.id,
      total,
      echo
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 active:scale-95 ${className}`}
        aria-label="Echo author post"
      >
        <img
          src="/assets/Icons/echo.svg"
          alt=""
          aria-hidden="true"
          className="h-[15px] w-[15px] object-contain opacity-70"
        />

        <span>
          {formatCompactNumber(echoCount)}
        </span>
      </button>

      <EchoShareSheetV2Connected
        open={open}
        sourceType="author_post"
        sourceId={post?.id}
        sourceName={
          author?.page_name ||
          'Author'
        }
        sourceAvatarUrl={
          author?.avatar_url ||
          author?.profile_image_url ||
          author?.profile_picture_url ||
          ''
        }
        sourceContent={
          post?.content ||
          'Author post'
        }
        sourceImageUrl={
          post?.image_urls?.[0] || ''
        }
        sourceLabel="author post"
        shareUrl={shareUrl}
        onClose={() => setOpen(false)}
        onEchoed={handleEchoed}
      />
    </>
  )
}

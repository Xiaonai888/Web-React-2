import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import SocialEchoShareSheet from '../social/SocialEchoShareSheet'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(
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
    useState(
      Number(post?.echo_count || 0)
    )

  useEffect(() => {
    setEchoCount(
      Number(post?.echo_count || 0)
    )
  }, [post?.echo_count])

  const shareUrl = useMemo(() => {
    const username = String(
      author?.page_username || ''
    ).trim()
    const path = username
      ? `/author/page/${encodeURIComponent(
          username
        )}?post=${encodeURIComponent(
          post?.id || ''
        )}`
      : `/author/page?post=${encodeURIComponent(
          post?.id || ''
        )}`

    return `${window.location.origin}${path}`
  }, [author?.page_username, post?.id])

  const handleEchoed = (
    echo,
    nextTotal
  ) => {
    const total = Number(nextTotal || 0)
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
          {formatCompactNumber(
            echoCount
          )}
        </span>
      </button>

      <SocialEchoShareSheet
        open={open}
        sourceType="author_post"
        sourceId={post?.id}
        sourceName={
          author?.page_name ||
          'Author'
        }
        sourceAvatarUrl={
          author?.avatar_url || ''
        }
        sourceContent={
          post?.content ||
          'Author post'
        }
        sourceImageUrl={
          post?.image_urls?.[0] || ''
        }
        sourceLabel="author post"
        endpoint={
          post?.id
            ? `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
                post.id
              )}/echoes`
            : ''
        }
        shareUrl={shareUrl}
        onClose={() => setOpen(false)}
        onEchoed={handleEchoed}
      />
    </>
  )
}

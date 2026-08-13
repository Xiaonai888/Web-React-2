import {
  Globe2,
  LoaderCircle,
  MessageCircle,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAuthorChatToken } from '../../services/authorChatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function Avatar({ src, name, size = 'h-10 w-10' }) {
  const [failed, setFailed] = useState(false)
  const letter =
    String(name || 'S').trim().charAt(0).toUpperCase() || 'S'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eceef1] font-bold text-[#111827] ring-1 ring-black/5`}
    >
      {src && !failed ? (
        <img
          src={src}
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

function PostImages({ images }) {
  const safeImages = Array.isArray(images)
    ? images.filter(Boolean).slice(0, 5)
    : []

  if (!safeImages.length) return null

  if (safeImages.length === 1) {
    return (
      <img
        src={safeImages[0]}
        alt=""
        className="mt-3 max-h-[560px] w-full bg-[#f3f4f6] object-contain"
      />
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-1">
      {safeImages.slice(0, 4).map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          className="relative aspect-square overflow-hidden bg-[#f3f4f6]"
        >
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          {index === 3 && safeImages.length > 4 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[22px] font-bold text-white">
              +{safeImages.length - 4}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function FocusComment({ comment, label }) {
  if (!comment) return null

  const user = comment.user || {}

  return (
    <article
      id={`comment-${comment.id}`}
      className="flex gap-3 px-4 py-4"
    >
      <Avatar
        src={user.avatar_url}
        name={user.name || user.username}
        size="h-11 w-11"
      />

      <div className="min-w-0 flex-1">
        {label ? (
          <div className="mb-1 text-[11px] font-semibold text-[#7c3aed]">
            {label}
          </div>
        ) : null}

        <div className="inline-block max-w-full rounded-[18px] bg-[#f0f2f5] px-3.5 py-2.5">
          <div className="text-[14px] font-semibold text-[#111827]">
            {user.name || user.username || 'Shadow Reader'}
          </div>

          <div className="mt-0.5 whitespace-pre-wrap break-words text-[14px] leading-5 text-[#111827]">
            {comment.text || ''}
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-3 pl-2 text-[11px] font-medium text-[#65676b]">
          <span>{formatDate(comment.created_at)}</span>
          {Number(comment.likes || 0) > 0 ? (
            <span>{Number(comment.likes || 0)} likes</span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function AuthorPostCommentFocusPage() {
  const navigate = useNavigate()
  const { postId, commentId } = useParams()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState(null)
  const [parentComment, setParentComment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!postId || !commentId) {
        setError('Post or comment is missing.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const token = getAuthorChatToken()
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {}

        const [postResponse, commentResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}`,
              { headers }
            ),
            fetch(
              `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`,
              { headers }
            ),
          ])

        const [postData, commentData] =
          await Promise.all([
            postResponse.json().catch(() => ({})),
            commentResponse.json().catch(() => ({})),
          ])

        if (!postResponse.ok || postData.ok === false) {
          throw new Error(
            postData.message || 'Failed to load post'
          )
        }

        if (
          !commentResponse.ok ||
          commentData.ok === false
        ) {
          throw new Error(
            commentData.message || 'Failed to load comment'
          )
        }

        if (ignore) return

        setPost(postData.post || null)
        setComment(commentData.comment || null)
        setParentComment(commentData.parent_comment || null)

        window.requestAnimationFrame(() => {
          document
            .getElementById(`comment-${commentId}`)
            ?.scrollIntoView({
              block: 'center',
              behavior: 'auto',
            })
        })
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message ||
              'Failed to open this comment'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [commentId, postId])

  const page = post?.author_page || {}
  const pageName =
    page.page_name ||
    page.page_username ||
    'Author Page'
  const pageUsername = page.page_username || ''

  const profilePath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(pageUsername)}`
        : '/author/page',
    [pageUsername]
  )

  const searchPath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(pageUsername)}/search`
        : '/author/page',
    [pageUsername]
  )

  return (
    <div className="min-h-[100dvh] bg-[#f0f2f5] text-[#111827]">
      <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-[56px] max-w-[680px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f2f2f3]"
            aria-label="Close"
          >
            <X size={27} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => navigate(profilePath)}
            className="min-w-0 flex-1 truncate text-center text-[17px] font-bold"
          >
            {pageName}
          </button>

          <button
            type="button"
            onClick={() => navigate(searchPath)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f2f2f3]"
            aria-label="Search page"
          >
            <Search size={25} strokeWidth={2.1} />
          </button>

          <button
            type="button"
            onClick={() => navigate(profilePath)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            aria-label="Profile page"
          >
            <Avatar
              src={page.avatar_url}
              name={pageName}
              size="h-8 w-8"
            />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[680px]">
        {loading ? (
          <div className="flex min-h-[60dvh] items-center justify-center bg-white text-[#7c3aed]">
            <LoaderCircle
              size={30}
              className="animate-spin"
            />
          </div>
        ) : error ? (
          <div className="bg-white px-5 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e8ff] text-[#7c3aed]">
              <MessageCircle size={26} />
            </div>
            <h1 className="mt-4 text-[16px] font-bold">
              Comment unavailable
            </h1>
            <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-5 text-[#73767c]">
              {error}
            </p>
          </div>
        ) : post && comment ? (
          <>
            <article className="bg-white py-4">
              <div className="flex items-start gap-3 px-4">
                <button
                  type="button"
                  onClick={() => navigate(profilePath)}
                >
                  <Avatar
                    src={page.avatar_url}
                    name={pageName}
                    size="h-11 w-11"
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => navigate(profilePath)}
                    className="block max-w-full truncate text-left text-[15px] font-bold"
                  >
                    {pageName}
                  </button>

                  <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#65676b]">
                    <span>{formatDate(post.created_at)}</span>
                    <span>·</span>
                    <Globe2 size={13} />
                  </div>
                </div>
              </div>

              {post.content ? (
                <div className="whitespace-pre-wrap break-words px-4 pt-3 text-[16px] leading-7">
                  {post.content}
                </div>
              ) : null}

              <PostImages images={post.image_urls} />

              <div className="mt-3 flex items-center gap-5 border-t border-[#eef0f2] px-4 pt-3 text-[13px] text-[#65676b]">
                <span>
                  {Number(post.like_count || 0)} reactions
                </span>
                <span>
                  {Number(post.comment_count || 0)} comments
                </span>
                <span>
                  {Number(post.echo_count || 0)} echoes
                </span>
              </div>
            </article>

            <section className="mt-2 bg-white">
              <div className="border-b border-[#eef0f2] px-4 py-3">
                <h2 className="text-[15px] font-bold">
                  Comment
                </h2>
              </div>

              {parentComment ? (
                <FocusComment
                  comment={parentComment}
                  label="Original comment"
                />
              ) : null}

              <FocusComment
                comment={comment}
                label={
                  parentComment
                    ? 'Selected reply'
                    : 'Selected comment'
                }
              />
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

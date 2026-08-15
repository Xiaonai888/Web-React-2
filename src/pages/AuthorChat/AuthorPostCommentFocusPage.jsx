import {
  LoaderCircle,
  MessageCircle,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAuthorChatToken } from '../../services/authorChatApi'
import CommentSection from '../../components/comments/CommentSection'
import AuthorPostDetail from '../../components/author-posts/AuthorPostDetail'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
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

export default function AuthorPostCommentFocusPage() {
  const navigate = useNavigate()
  const { postId, commentId } = useParams()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState(null)
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

  useEffect(() => {
    if (!comment?.id) return

    document
      .getElementById(`comment-${comment.id}`)
      ?.scrollIntoView({ block: 'center', behavior: 'auto' })
  }, [comment?.id])

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
      <header className="sticky top-0 z-50 bg-white">
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
            <AuthorPostDetail
              post={post}
              commentId={comment.id}
            />

            <section className="bg-white pt-3">
              <CommentSection
                targetType="author_post"
                targetId={post.id}
                variant="page"
                story={{ ...post, author_page: page }}
                onCommentsChange={() => {
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById(`comment-${comment.id}`)
                      ?.scrollIntoView({
                        block: 'center',
                        behavior: 'auto',
                      })
                  })
                }}
              />
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

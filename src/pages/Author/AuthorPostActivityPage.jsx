import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import CommentSection from '../../components/comments/CommentSection'
import PublicPostDetailView from '../../components/social/posts/PublicPostDetailView'
import { getAuthorChatToken } from '../../services/authorChatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function PostImages({
  images,
  authorName,
}) {
  const urls = Array.isArray(images)
    ? images.filter(Boolean).slice(0, 5)
    : []

  if (!urls.length) return null

  const alt = `${authorName || 'Author'} post`

  if (urls.length === 1) {
    return (
      <img
        src={urls[0]}
        alt={alt}
        className="mt-3 max-h-[560px] w-full bg-[#f3f4f6] object-contain"
      />
    )
  }

  const visible = urls.slice(0, 4)
  const hiddenCount = Math.max(
    0,
    urls.length - 4
  )

  return (
    <div className="mt-3 grid grid-cols-2 gap-[2px] bg-[#f3f4f6]">
      {visible.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative aspect-square overflow-hidden"
        >
          <img
            src={url}
            alt={alt}
            className="h-full w-full object-cover"
          />

          {index === 3 &&
          hiddenCount > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[24px] font-bold text-white">
              +{hiddenCount}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default function AuthorPostActivityPage() {
  const navigate = useNavigate()
  const {
    postId,
    commentId: routeCommentId,
  } = useParams()
  const [searchParams] = useSearchParams()

  const focusCommentId =
    searchParams.get('commentId') ||
    routeCommentId ||
    ''

  const activityType =
    searchParams.get('type') ||
    (focusCommentId
      ? 'comment'
      : 'post')

  const [post, setPost] =
    useState(null)
  const [comment, setComment] =
    useState(null)
  const [
    parentComment,
    setParentComment,
  ] = useState(null)
  const [loading, setLoading] =
    useState(true)
  const [error, setError] =
    useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!postId) {
        setError('Post is missing.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        setComment(null)
        setParentComment(null)

        const token =
          getAuthorChatToken()
        const headers = token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}

        const requests = [
          fetch(
            `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
              postId
            )}`,
            { headers }
          ),
        ]

        if (focusCommentId) {
          requests.push(
            fetch(
              `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
                postId
              )}/comments/${encodeURIComponent(
                focusCommentId
              )}`,
              { headers }
            )
          )
        }

        const [
          postResponse,
          commentResponse,
        ] = await Promise.all(
          requests
        )

        const postData =
          await postResponse
            .json()
            .catch(() => ({}))

        const commentData =
          commentResponse
            ? await commentResponse
                .json()
                .catch(() => ({}))
            : null

        if (
          !postResponse.ok ||
          postData.ok === false
        ) {
          throw new Error(
            postData.message ||
              'Failed to load post'
          )
        }

        if (
          commentResponse &&
          (!commentResponse.ok ||
            commentData?.ok === false)
        ) {
          throw new Error(
            commentData?.message ||
              'Failed to load comment'
          )
        }

        if (ignore) return

        setPost(
          postData.post || null
        )
        setComment(
          commentData?.comment ||
            null
        )
        setParentComment(
          commentData?.parent_comment ||
            null
        )
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message ||
              'Failed to open this post'
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [focusCommentId, postId])

  useEffect(() => {
    if (!comment?.id) return

    document
      .getElementById(
        `comment-${comment.id}`
      )
      ?.scrollIntoView({
        block: 'center',
        behavior: 'auto',
      })
  }, [comment?.id])

  const page =
    post?.author_page || {}

  const pageName =
    page.page_name ||
    page.page_username ||
    'Author Page'

  const pageUsername =
    page.page_username || ''

  const profilePath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(
            pageUsername
          )}`
        : '/author/page',
    [pageUsername]
  )

  const searchPath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(
            pageUsername
          )}/search`
        : '/author/page',
    [pageUsername]
  )

  const scrollToCommentArea = () => {
    const focusTarget =
      focusCommentId
        ? document.getElementById(
            `comment-${focusCommentId}`
          )
        : null

    if (focusTarget) {
      focusTarget.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
      return
    }

    document
      .getElementById(
        'shadow-comment-input'
      )
      ?.focus()
  }

  return (
    <div
      data-activity-type={
        activityType
      }
    >
      <PublicPostDetailView
        pageName={pageName}
        pageAvatarUrl={
          page.avatar_url || ''
        }
        authorName={pageName}
        authorAvatarUrl={
          page.avatar_url || ''
        }
        createdAt={
          post?.created_at || ''
        }
        visibility="public"
        isPinned={Boolean(
          post?.is_pinned
        )}
        isEdited={Boolean(
          post?.is_edited
        )}
        loading={loading}
        error={error}
        content={
          post?.content || null
        }
        media={
          post ? (
            <PostImages
              images={
                post.image_urls
              }
              authorName={
                pageName
              }
            />
          ) : null
        }
        reactionSummary={
          Array.isArray(
            post?.reaction_summary
          )
            ? post.reaction_summary
            : []
        }
        likeCount={Number(
          post?.like_count || 0
        )}
        commentCount={Number(
          post?.comment_count || 0
        )}
        echoCount={Number(
          post?.echo_count || 0
        )}
        comments={
          post ? (
            <CommentSection
              targetType="author_post"
              targetId={post.id}
              variant="page"
              story={{
                ...post,
                author_page: page,
              }}
              focusComment={
                comment
              }
              focusParentComment={
                parentComment
              }
              focusCommentId={
                focusCommentId
              }
              onCommentsChange={() => {
                if (
                  !focusCommentId
                ) {
                  return
                }

                window.requestAnimationFrame(
                  () => {
                    document
                      .getElementById(
                        `comment-${
                          comment?.id ||
                          focusCommentId
                        }`
                      )
                      ?.scrollIntoView({
                        block:
                          'center',
                        behavior:
                          'auto',
                      })
                  }
                )
              }}
            />
          ) : null
        }
        onClose={() =>
          navigate(-1)
        }
        onSearch={() =>
          navigate(searchPath)
        }
        onOpenProfile={() =>
          navigate(profilePath)
        }
        onComment={
          scrollToCommentArea
        }
        onOpenComments={
          scrollToCommentArea
        }
        onErrorBack={() =>
          navigate(-1)
        }
      />
    </div>
  )
}

import {
  useCallback,
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
import AuthorPostEchoAction from '../../components/author-posts/AuthorPostEchoAction'
import ReactionAction from '../../components/social/reactions/ReactionAction'
import PublicPostDetailView from '../../components/social/posts/PublicPostDetailView'
import { getAuthorChatToken } from '../../services/authorChatApi'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

async function setAuthorPostReaction(
  token,
  postId,
  reactionType
) {
  if (!token) {
    throw new Error('Please login first')
  }

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
      postId
    )}/react`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify({
        reaction_type:
          reactionType,
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
        'Failed to update reaction'
    )
  }

  return data
}

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
  const [
    reactionBusy,
    setReactionBusy,
  ] = useState(false)
  const [
    actionError,
    setActionError,
  ] = useState('')

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

  async function chooseReaction(
    reactionType
  ) {
    if (
      reactionBusy ||
      !post?.id
    ) {
      return
    }

    const token =
      getAuthorChatToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setReactionBusy(true)
      setActionError('')

      const data =
        await setAuthorPostReaction(
          token,
          post.id,
          reactionType
        )

      setPost((current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          ...(data.post || {}),
          author_page:
            current.author_page,
          is_following:
            current.is_following,
          is_owner:
            current.is_owner,
          my_reaction:
            data.reaction_type ||
            null,
          like_count: Number(
            data.like_count ??
              data.post?.like_count ??
              current.like_count ??
              0
          ),
          reaction_summary:
            Array.isArray(
              data.reaction_summary
            )
              ? data.reaction_summary
              : current.reaction_summary,
        }
      })
    } catch (reactionError) {
      setActionError(
        reactionError.message ||
          'Failed to update reaction'
      )
    } finally {
      setReactionBusy(false)
    }
  }

  const handleEchoCountChange =
    useCallback(
      (_postId, total) => {
        setPost((current) =>
          current
            ? {
                ...current,
                echo_count: Number(
                  total || 0
                ),
              }
            : current
        )
      },
      []
    )

  const handleCommentTotalChange = (
    nextTotal
  ) => {
    setPost((current) =>
      current
        ? {
            ...current,
            comment_count:
              Math.max(
                0,
                Number(
                  nextTotal || 0
                )
              ),
          }
        : current
    )
  }

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
        reactionControl={
          post ? (
            <div className="inline-flex items-center gap-2">
              <ReactionAction
                reactionType={
                  post.my_reaction
                }
                count={
                  post.like_count
                }
                busy={
                  reactionBusy
                }
                showBusySpinner
                showCount={false}
                onReact={
                  chooseReaction
                }
                idleLabel="Like"
                buttonClassName="text-[#65676b]"
              />

              <button
                type="button"
                onClick={() =>
                  chooseReaction(
                    post.my_reaction ||
                      'love'
                  )
                }
                disabled={
                  reactionBusy
                }
                className="text-[14px] font-normal text-[#65676b] disabled:opacity-60"
              >
                Like
              </button>
            </div>
          ) : null
        }
        echoControl={
          post ? (
            <AuthorPostEchoAction
              post={post}
              author={page}
              className="[&>span]:hidden after:content-['Echo'] after:text-[14px] after:font-normal after:text-[#65676b]"
              onCountChange={
                handleEchoCountChange
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
              onCommentTotalChange={
                handleCommentTotalChange
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
        onOpenReactions={() =>
          post?.id
            ? navigate(
                `/interactions/author_post/${encodeURIComponent(
                  post.id
                )}/likes`,
                {
                  state: {
                    sourceName:
                      pageName,
                  },
                }
              )
            : null
        }
        onOpenEchoes={() =>
          post?.id
            ? navigate(
                `/interactions/author_post/${encodeURIComponent(
                  post.id
                )}/echoes`,
                {
                  state: {
                    sourceName:
                      pageName,
                  },
                }
              )
            : null
        }
        onErrorBack={() =>
          navigate(-1)
        }
      />

      {actionError ? (
        <div className="fixed left-1/2 top-20 z-[300] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
          {actionError}
        </div>
      ) : null}
    </div>
  )
}

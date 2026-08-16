import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import CommentsModal from '../../components/story-detail/CommentsModal'
import AuthorPostEchoAction from '../../components/author-posts/AuthorPostEchoAction'
import { ProfessionalSinglePostImage } from '../../components/common/ProfessionalPostContent'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const AUTHOR_POST_REACTIONS = [
  {
    type: 'love',
    label: 'Love',
    src: '/assets/React/Love.svg',
    text: '#ff2f5f',
  },
  {
    type: 'haha',
    label: 'Haha',
    src: '/assets/React/Haha.svg',
    text: '#f59e0b',
  },
  {
    type: 'wow',
    label: 'Wow',
    src: '/assets/React/Wow.svg',
    text: '#f59e0b',
  },
  {
    type: 'sad',
    label: 'Sad',
    src: '/assets/React/Sad.svg',
    text: '#3b82f6',
  },
  {
    type: 'angry',
    label: 'Angry',
    src: '/assets/React/Angry.svg',
    text: '#ef4444',
  },
  {
    type: 'support',
    label: 'Support',
    src: '/assets/React/Support.svg',
    text: '#16a34a',
  },
  {
    type: 'touched',
    label: 'Touched',
    src: '/assets/React/Touched.svg',
    text: '#8b5cf6',
  },
]

const POST_TOKEN_PATTERN =
  /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN =
  /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN =
  /^#[\p{L}\p{N}\p{M}_]+$/u

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

function formatPostTime(value) {
  const timestamp = new Date(
    value || 0
  ).getTime()

  if (!timestamp) return 'Just now'

  const difference = Math.max(
    0,
    Date.now() - timestamp
  )
  const minutes = Math.floor(
    difference / 60000
  )
  const hours = Math.floor(
    minutes / 60
  )
  const days = Math.floor(
    hours / 24
  )

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: 'short',
      day: 'numeric',
    }
  ).format(new Date(timestamp))
}

function renderPostTextWithLinks(text) {
  return String(text || '')
    .split(POST_TOKEN_PATTERN)
    .map((part, index) => {
      if (
        POST_URL_ONLY_PATTERN.test(part)
      ) {
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[#1877f2]"
          >
            {part}
          </a>
        )
      }

      if (
        POST_HASHTAG_ONLY_PATTERN.test(
          part
        )
      ) {
        return (
          <Link
            key={`${part}-${index}`}
            to={`/discover/search?q=${encodeURIComponent(
              part
            )}&type=posts`}
            className="text-[#1877f2]"
          >
            {part}
          </Link>
        )
      }

      return part
    })
}

function countAuthorPostComments(
  comments = []
) {
  return comments.reduce(
    (total, comment) =>
      total +
      1 +
      countAuthorPostComments(
        Array.isArray(comment?.replies)
          ? comment.replies
          : []
      ),
    0
  )
}

function AuthorPostImages({
  images,
  authorName,
  onImageClick,
  photoPostView = false,
  selectedPhotoIndex = 0,
}) {
  const urls = Array.isArray(images)
    ? images
        .filter(Boolean)
        .slice(0, 5)
    : []

  if (!urls.length) return null

  const alt =
    `${authorName || 'Author'} post`

  const safeSelectedIndex =
    Math.min(
      urls.length - 1,
      Math.max(
        0,
        Number.isFinite(
          Number(selectedPhotoIndex)
        )
          ? Math.floor(
              Number(
                selectedPhotoIndex
              )
            )
          : 0
      )
    )

  if (photoPostView) {
    return (
      <ProfessionalSinglePostImage
        src={
          urls[
            safeSelectedIndex
          ]
        }
        alt={alt}
        onClick={() =>
          onImageClick?.(
            safeSelectedIndex
          )
        }
      />
    )
  }

  if (urls.length === 1) {
    return (
      <ProfessionalSinglePostImage
        src={urls[0]}
        alt={alt}
        onClick={() =>
          onImageClick?.(0)
        }
      />
    )
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
        {urls.map(
          (url, index) => (
            <button
              key={url}
              type="button"
              onClick={() =>
                onImageClick?.(
                  index
                )
              }
              className="block w-full"
            >
              <img
                src={url}
                alt={alt}
                loading="eager"
                decoding="async"
                className="h-[280px] w-full object-cover sm:h-[330px]"
              />
            </button>
          )
        )}
      </div>
    )
  }

  if (urls.length === 3) {
    return (
      <div className="grid h-[360px] grid-cols-2 gap-[2px] bg-gray-100 sm:h-[420px]">
        <button
          type="button"
          onClick={() =>
            onImageClick?.(0)
          }
          className="h-full w-full"
        >
          <img
            src={urls[0]}
            alt={alt}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </button>

        <div className="grid min-h-0 grid-rows-2 gap-[2px]">
          {urls
            .slice(1)
            .map(
              (
                url,
                index
              ) => (
                <button
                  key={url}
                  type="button"
                  onClick={() =>
                    onImageClick?.(
                      index + 1
                    )
                  }
                  className="h-full min-h-0 w-full"
                >
                  <img
                    src={url}
                    alt={alt}
                    loading="eager"
                    decoding="async"
                    className="h-full min-h-0 w-full object-cover"
                  />
                </button>
              )
            )}
        </div>
      </div>
    )
  }

  const visibleUrls =
    urls.slice(0, 4)

  const hiddenCount =
    Math.max(
      0,
      urls.length - 4
    )

  return (
    <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
      {visibleUrls.map(
        (url, index) => (
          <button
            key={url}
            type="button"
            onClick={() =>
              onImageClick?.(
                index
              )
            }
            className="relative block w-full"
          >
            <img
              src={url}
              alt={alt}
              loading="eager"
              decoding="async"
              className="h-[220px] w-full object-cover sm:h-[270px]"
            />

            {index === 3 &&
            hiddenCount > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[28px] font-black text-white">
                +{hiddenCount}
              </div>
            ) : null}
          </button>
        )
      )}
    </div>
  )
}
async function setAuthorPostReaction(
  token,
  postId,
  reactionType
) {
  if (!token) {
    throw new Error(
      'Please login first'
    )
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

export default function AuthorPostDetailPage() {
const navigate = useNavigate()
const { postId } = useParams()
const [searchParams] = useSearchParams()

const rawPhotoIndex =
  searchParams.get('photo')

const photoPostView =
  rawPhotoIndex !== null

const selectedPhotoIndex = Math.max(
  0,
  Number.isFinite(
    Number(rawPhotoIndex)
  )
    ? Math.floor(
        Number(rawPhotoIndex)
      )
    : 0
)
  const [post, setPost] =
    useState(null)
  const [loading, setLoading] =
    useState(true)
  const [error, setError] =
    useState('')
  const [
    reactionPickerOpen,
    setReactionPickerOpen,
  ] = useState(false)
  const [
    reactionBusy,
    setReactionBusy,
  ] = useState(false)
  const [
    actionError,
    setActionError,
  ] = useState('')
  const [
    followBusy,
    setFollowBusy,
  ] = useState(false)
  const [
    commentsOpen,
    setCommentsOpen,
  ] = useState(false)

  const [
  fullscreenPhotoOpen,
  setFullscreenPhotoOpen,
] = useState(false)

  const [
  fullscreenControlsVisible,
  setFullscreenControlsVisible,
] = useState(true)

  const [
  fullscreenPhotoMenuOpen,
  setFullscreenPhotoMenuOpen,
] = useState(false)

const [
  photoActionMessage,
  setPhotoActionMessage,
] = useState('')

  const [
  photoDeleteConfirmOpen,
  setPhotoDeleteConfirmOpen,
] = useState(false)

const [
  photoDeleteBusy,
  setPhotoDeleteBusy,
] = useState(false)

  const pressTimerRef =
    useRef(null)
  const commentCountBaseRef =
    useRef({
      loadedCount: null,
      serverCount: 0,
    })

  useEffect(() => {
    const controller =
      new AbortController()
    let ignore = false

    async function loadPost() {
      try {
        setLoading(true)
        setError('')

        const token =
          getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
            postId || ''
          )}`,
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
            cache: 'no-store',
            signal:
              controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false ||
          !data.post
        ) {
          throw new Error(
            data.message ||
              'Post not found'
          )
        }

        if (!ignore) {
          setPost(data.post)
        }
      } catch (loadError) {
        if (
          !ignore &&
          loadError?.name !==
            'AbortError'
        ) {
          setError(
            loadError.message ||
              'Failed to load post'
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      ignore = true
      controller.abort()

      if (
        pressTimerRef.current
      ) {
        window.clearTimeout(
          pressTimerRef.current
        )
      }
    }
  }, [postId])
  useEffect(() => {
  if (!fullscreenPhotoOpen) {
    return undefined
  }

  const previousOverflow =
    document.body.style.overflow

  document.body.style.overflow =
    'hidden'

  function handleKeyDown(event) {
  if (event.key !== 'Escape') {
    return
  }

    if (photoDeleteConfirmOpen) {
  if (!photoDeleteBusy) {
    setPhotoDeleteConfirmOpen(false)
  }
  return
}

  if (fullscreenPhotoMenuOpen) {
    setFullscreenPhotoMenuOpen(false)
    return
  }

  setFullscreenPhotoOpen(false)
  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoActionMessage('')
}

  window.addEventListener(
    'keydown',
    handleKeyDown
  )

  return () => {
    document.body.style.overflow =
      previousOverflow

    window.removeEventListener(
      'keydown',
      handleKeyDown
    )
  }
}, [
  fullscreenPhotoOpen,
  fullscreenPhotoMenuOpen,
  photoDeleteConfirmOpen,
  photoDeleteBusy,
])
  useEffect(() => {
  if (!photoActionMessage) {
    return undefined
  }

  const timer = window.setTimeout(
    () => setPhotoActionMessage(''),
    1800
  )

  return () =>
    window.clearTimeout(timer)
}, [photoActionMessage])

  function goBack() {
    if (
      window.history.length > 1
    ) {
      navigate(-1)
      return
    }

    navigate('/discover', {
      replace: true,
    })
  }

  function openPhotoPost(index) {
  if (!post?.id) return

  navigate(
    `/author/post/${encodeURIComponent(
      post.id
    )}?photo=${index}`
  )
}

function handlePostImageClick(index) {
if (photoPostView) {
  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoDeleteConfirmOpen(false)
  setPhotoActionMessage('')
  setFullscreenPhotoOpen(true)
  return
}

  openPhotoPost(index)
}

  async function deleteSelectedPhoto(event) {
  event?.stopPropagation()

  if (
    !isOwner ||
    !selectedPhotoUrl ||
    photoDeleteBusy
  ) {
    return
  }

  const remainingPhotoUrls =
    photoUrls.filter(
      (_, index) =>
        index !==
        safeSelectedPhotoIndex
    )

  const currentContent = String(
    post?.content || ''
  ).trim()

  if (
    !remainingPhotoUrls.length &&
    !currentContent
  ) {
    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)
    setPhotoActionMessage(
      'This post needs text or a photo. Delete the post instead.'
    )
    return
  }

  const token = getAuthToken()

  if (!token) {
    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)
    setFullscreenPhotoOpen(false)
    navigate('/login')
    return
  }

  try {
    setPhotoDeleteBusy(true)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
        post.id
      )}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_urls:
            remainingPhotoUrls,
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
          'Failed to delete photo'
      )
    }

    const updatedPost =
      data.post || {
        ...post,
        image_urls:
          remainingPhotoUrls,
      }

    setPost((current) =>
      current
        ? {
            ...current,
            ...updatedPost,
            author_page:
              current.author_page,
            is_owner:
              current.is_owner,
            is_following:
              current.is_following,
            my_reaction:
              current.my_reaction,
          }
        : current
    )

    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)

    if (!remainingPhotoUrls.length) {
      setFullscreenPhotoOpen(false)
      setFullscreenControlsVisible(true)
      setPhotoActionMessage('')

      navigate(
        `/author/post/${encodeURIComponent(
          post.id
        )}`,
        {
          replace: true,
        }
      )
      return
    }

    const nextPhotoIndex =
      Math.min(
        safeSelectedPhotoIndex,
        remainingPhotoUrls.length - 1
      )

    setPhotoActionMessage(
      'Photo deleted.'
    )

    navigate(
      `/author/post/${encodeURIComponent(
        post.id
      )}?photo=${nextPhotoIndex}`,
      {
        replace: true,
      }
    )
  } catch (error) {
    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)

    setPhotoActionMessage(
      error.message ||
        'Failed to delete photo.'
    )
  } finally {
    setPhotoDeleteBusy(false)
  }
}

  async function saveSelectedPhoto(event) {
  event?.stopPropagation()

  if (!selectedPhotoUrl) {
    return
  }

  try {
    const response = await fetch(
      selectedPhotoUrl,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(
        'Could not download photo'
      )
    }

    const blob = await response.blob()
    const objectUrl =
      URL.createObjectURL(blob)

    const extension =
      String(blob.type || '')
        .split('/')[1]
        ?.split(';')[0]
        ?.replace('jpeg', 'jpg') ||
      'jpg'

    const link =
      document.createElement('a')

    link.href = objectUrl
    link.download =
      `shadow-author-photo-${post.id}-${safeSelectedPhotoIndex + 1}.${extension}`

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(
      () =>
        URL.revokeObjectURL(
          objectUrl
        ),
      1000
    )

    setFullscreenPhotoMenuOpen(false)
    setPhotoActionMessage(
      'Photo saved.'
    )
  } catch {
    const link =
      document.createElement('a')

    link.href = selectedPhotoUrl
    link.target = '_blank'
    link.rel =
      'noopener noreferrer'
    link.download =
      `shadow-author-photo-${post.id}-${safeSelectedPhotoIndex + 1}`

    document.body.appendChild(link)
    link.click()
    link.remove()

    setFullscreenPhotoMenuOpen(false)
    setPhotoActionMessage(
      'Photo opened for saving.'
    )
  }
}

async function shareSelectedPhoto(event) {
  event?.stopPropagation()

  if (!selectedPhotoUrl) {
    return
  }

  const shareData = {
    title: `${authorName} photo`,
    url: selectedPhotoUrl,
  }

  if (navigator.share) {
    try {
      await navigator.share(
        shareData
      )

      setFullscreenPhotoMenuOpen(false)
      return
    } catch (error) {
      if (
        error?.name === 'AbortError'
      ) {
        return
      }
    }
  }

  if (
    navigator.clipboard?.writeText
  ) {
    try {
      await navigator.clipboard.writeText(
        selectedPhotoUrl
      )

      setFullscreenPhotoMenuOpen(false)
      setPhotoActionMessage(
        'Photo link copied.'
      )
      return
    } catch {
      return
    }
  }

  window.open(
    selectedPhotoUrl,
    '_blank',
    'noopener,noreferrer'
  )

  setFullscreenPhotoMenuOpen(false)
}

  async function followAuthor() {
    const token = getAuthToken()
    const author =
      post?.author_page || {}
    const pageUsername =
      author.page_username || ''
    const isFollowing = Boolean(
      post?.is_following ??
        author.is_following
    )
    const isOwner = Boolean(
      post?.is_owner ??
        author.is_owner
    )

    if (!token) {
      navigate('/login')
      return
    }

    if (
      followBusy ||
      isFollowing ||
      isOwner ||
      !pageUsername
    ) {
      return
    }

    try {
      setFollowBusy(true)
      setActionError('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
          pageUsername
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
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
            'Failed to follow author'
        )
      }

      setPost((current) => {
        if (!current) return current

        const currentAuthor =
          current.author_page || {}

        return {
          ...current,
          is_following: true,
          author_page: {
            ...currentAuthor,
            is_following: true,
            total_followers:
              Number(
                currentAuthor
                  .total_followers ||
                  0
              ) + 1,
          },
        }
      })
    } catch (followError) {
      setActionError(
        followError.message ||
          'Failed to follow author'
      )
    } finally {
      setFollowBusy(false)
    }
  }

  async function chooseReaction(
    reactionType
  ) {
    if (
      reactionBusy ||
      !post?.id
    ) {
      return
    }

    const token = getAuthToken()

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

  function startReactionPress() {
    if (reactionBusy) return

    if (
      pressTimerRef.current
    ) {
      window.clearTimeout(
        pressTimerRef.current
      )
    }

    pressTimerRef.current =
      window.setTimeout(() => {
        setReactionPickerOpen(true)
        pressTimerRef.current =
          null
      }, 420)
  }

  function endReactionPress() {
    if (
      !pressTimerRef.current
    ) {
      return
    }

    window.clearTimeout(
      pressTimerRef.current
    )
    pressTimerRef.current = null
    chooseReaction('love')
  }

  function cancelReactionPress() {
    if (
      !pressTimerRef.current
    ) {
      return
    }

    window.clearTimeout(
      pressTimerRef.current
    )
    pressTimerRef.current = null
  }

  function openComments() {
    if (!post?.id) return

    commentCountBaseRef.current = {
      loadedCount: null,
      serverCount: Number(
        post.comment_count || 0
      ),
    }
    setCommentsOpen(true)
  }

  function handleCommentsChanged(
    nextComments = []
  ) {
    const loadedCount =
      countAuthorPostComments(
        nextComments
      )
    const base =
      commentCountBaseRef.current

    if (
      base.loadedCount === null
    ) {
      commentCountBaseRef.current = {
        ...base,
        loadedCount,
      }
      return
    }

    const nextCount = Math.max(
      0,
      base.serverCount +
        loadedCount -
        base.loadedCount
    )

    commentCountBaseRef.current = {
      loadedCount,
      serverCount: nextCount,
    }

    setPost((current) =>
      current
        ? {
            ...current,
            comment_count:
              nextCount,
          }
        : current
    )
  }

  const author =
    post?.author_page || {}
  const authorName =
    author.page_name || 'Author'
  const pageUsername =
    author.page_username || ''
  const pageUrl = pageUsername
    ? `/author/page/${encodeURIComponent(
        pageUsername
      )}`
    : '#'
  const firstLetter =
    authorName
      .trim()
      .slice(0, 1)
      .toUpperCase() || 'A'
  const isFollowing = Boolean(
    post?.is_following ??
      author.is_following
  )
  const isOwner = Boolean(
    post?.is_owner ??
      author.is_owner
  )
  const activeReaction =
    AUTHOR_POST_REACTIONS.find(
      (item) =>
        item.type ===
        post?.my_reaction
    ) || null

  const photoUrls = Array.isArray(
  post?.image_urls
)
  ? post.image_urls
      .filter(Boolean)
      .slice(0, 5)
  : []

const safeSelectedPhotoIndex =
  photoUrls.length
    ? Math.min(
        photoUrls.length - 1,
        Math.max(
          0,
          selectedPhotoIndex
        )
      )
    : 0

const selectedPhotoUrl =
  photoUrls[
    safeSelectedPhotoIndex
  ] || ''

  return (
    <div className="min-h-screen bg-[#f5f3fa]">
      <header className="sticky top-0 z-50 border-b border-[#eef0f4] bg-white">
        <div className="mx-auto flex h-14 w-full max-w-[620px] items-center px-2">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:opacity-60"
            aria-label="Back"
          >
            <i className="fa-solid fa-arrow-left text-[18px]" />
          </button>

          <div className="ml-1 text-[17px] font-semibold text-[#111827]">
  {photoPostView
    ? 'Photo'
    : 'Post'}
</div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[620px] py-1 sm:px-3 sm:py-3">
        {loading ? (
          <div className="bg-white px-4 py-8 text-center text-[13px] text-[#8b93a1] sm:rounded-[12px]">
            Loading...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="bg-white px-4 py-8 text-center sm:rounded-[12px]">
            <div className="text-[14px] font-semibold text-[#111827]">
              {error}
            </div>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 text-[13px] font-semibold text-[#0866ff]"
            >
              Go back
            </button>
          </div>
        ) : null}

        {!loading &&
        !error &&
        post ? (
          <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
            <div className="flex items-start gap-2 px-4 pb-3 pt-4">
              <Link
                to={pageUrl}
                className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-black text-white"
                aria-label={`Open ${authorName}`}
              >
                {author.avatar_url ? (
                  <img
                    src={
                      author.avatar_url
                    }
                    alt={authorName}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  firstLetter
                )}
              </Link>

              <div className="-ml-1 min-w-0 flex-1">
                <div className="min-w-0 text-[14px] leading-5">
                  <Link
                    to={pageUrl}
                    className="break-words font-semibold text-[#111827]"
                  >
                    {authorName}
                  </Link>

                  {!isFollowing &&
                  !isOwner ? (
                    <>
                      <span className="px-1 text-[#65676b]">
                        ·
                      </span>

                      <button
                        type="button"
                        disabled={
                          followBusy
                        }
                        onClick={
                          followAuthor
                        }
                        className="font-semibold text-[#1877f2] active:opacity-60 disabled:opacity-60"
                      >
                        {followBusy
                          ? 'Following...'
                          : 'Follow'}
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400">
                  <span>
                    {formatPostTime(
                      post.created_at
                    )}
                  </span>
                  <span>·</span>
                  <i className="fa-solid fa-earth-americas text-[10px]" />
                </div>
              </div>
            </div>

            {post.content ? (
              <div className="px-4 pb-3">
                <p className="whitespace-pre-wrap break-words text-[14px] font-normal leading-6 text-[#111827]">
                  {renderPostTextWithLinks(
                    post.content
                  )}
                </p>
              </div>
            ) : null}

            <AuthorPostImages
  images={
    post.image_urls
  }
  authorName={
    authorName
  }
  photoPostView={
    photoPostView
  }
  selectedPhotoIndex={
    selectedPhotoIndex
  }
  onImageClick={
    handlePostImageClick
  }
/>

            <div className="flex items-center gap-6 border-t border-gray-100 px-4 py-2 text-[13px] font-normal text-gray-500">
              <div className="relative">
                {reactionPickerOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label="Close reactions"
                      onClick={() =>
                        setReactionPickerOpen(
                          false
                        )
                      }
                      className="fixed inset-0 z-20 cursor-default"
                    />

                    <div className="absolute bottom-8 left-0 z-30 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-2 shadow-2xl ring-1 ring-black/10">
                      {AUTHOR_POST_REACTIONS.map(
                        (
                          reaction
                        ) => (
                          <button
                            key={
                              reaction.type
                            }
                            type="button"
                            disabled={
                              reactionBusy
                            }
                            onClick={() => {
                              setReactionPickerOpen(
                                false
                              )
                              chooseReaction(
                                reaction.type
                              )
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:-translate-y-1 hover:scale-110 active:scale-90 disabled:opacity-60"
                            aria-label={
                              reaction.label
                            }
                            title={
                              reaction.label
                            }
                          >
                            <img
                              src={
                                reaction.src
                              }
                              alt={
                                reaction.label
                              }
                              className="h-8 w-8 object-contain"
                            />
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : null}

                <div
                  className="inline-flex items-center gap-1.5"
                  style={{
                    color:
                      activeReaction
                        ?.text ||
                      undefined,
                  }}
                >
                  <button
                    type="button"
                    disabled={
                      reactionBusy
                    }
                    onPointerDown={
                      startReactionPress
                    }
                    onPointerUp={
                      endReactionPress
                    }
                    onPointerLeave={
                      cancelReactionPress
                    }
                    onPointerCancel={
                      cancelReactionPress
                    }
                    onContextMenu={(
                      event
                    ) =>
                      event.preventDefault()
                    }
                    className="active:scale-95 disabled:opacity-60"
                    aria-label={
                      activeReaction
                        ? `${activeReaction.label} reaction`
                        : 'Like'
                    }
                  >
                    {reactionBusy ? (
                      <i className="fa-solid fa-circle-notch animate-spin" />
                    ) : activeReaction ? (
                      <img
                        src={
                          activeReaction.src
                        }
                        alt={
                          activeReaction.label
                        }
                        className="h-[17px] w-[17px] object-contain"
                      />
                    ) : (
                      <i className="fa-regular fa-heart text-[15px]" />
                    )}
                  </button>

                  <Link
                    to={`/interactions/author_post/${post.id}/likes`}
                    state={{
                      sourceName:
                        authorName,
                    }}
                    onClick={() =>
                      setReactionPickerOpen(
                        false
                      )
                    }
                    className="active:scale-95"
                    aria-label="View people who reacted"
                  >
                    {Number(
                      post.like_count ||
                        0
                    )}
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  openComments
                }
                className="inline-flex items-center gap-1.5 active:scale-95"
                aria-label="Comments"
              >
                <i className="fa-regular fa-comment text-[15px]" />
                <span>
                  {Number(
                    post.comment_count ||
                      0
                  )}
                </span>
              </button>

              <AuthorPostEchoAction
                post={post}
                author={author}
              />
            </div>

            {actionError ? (
              <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-[11px] font-bold text-red-600">
                {actionError}
              </div>
            ) : null}
          </article>
        ) : null}
      </main>

      {fullscreenPhotoOpen &&
selectedPhotoUrl ? (
  <div
    className="fixed inset-0 z-[1000000] bg-black"
    onClick={() => {

      if (photoDeleteConfirmOpen) {
  if (!photoDeleteBusy) {
    setPhotoDeleteConfirmOpen(false)
  }
  return
}
      if (fullscreenPhotoMenuOpen) {
        setFullscreenPhotoMenuOpen(false)
        return
      }

      setFullscreenControlsVisible(
        (current) => !current
      )
    }}
  >
    {fullscreenControlsVisible ? (
      <>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setFullscreenPhotoOpen(false)
            setFullscreenControlsVisible(true)
            setFullscreenPhotoMenuOpen(false)
            setPhotoDeleteConfirmOpen(false)
            setPhotoActionMessage('')
          }}
          className="absolute left-4 top-[max(16px,env(safe-area-inset-top))] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white active:bg-black/75"
          aria-label="Close fullscreen photo"
        >
          <i className="fa-solid fa-xmark text-[20px]" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setFullscreenPhotoMenuOpen(true)
          }}
          className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white active:bg-black/75"
          aria-label="Photo options"
        >
          <i className="fa-solid fa-ellipsis text-[18px]" />
        </button>
      </>
    ) : null}

    <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden">
      <img
        src={selectedPhotoUrl}
        alt={`${authorName} photo`}
        loading="eager"
        decoding="async"
        draggable="false"
        className="max-h-[100dvh] max-w-full select-none object-contain"
      />
    </div>

    {photoActionMessage ? (
      <div className="absolute bottom-[max(24px,env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-[12px] font-medium text-[#111827] shadow-xl">
        {photoActionMessage}
      </div>
    ) : null}

    {fullscreenPhotoMenuOpen ? (
      <div
        className="absolute inset-0 z-40 flex items-end bg-black/35"
        onClick={(event) => {
          event.stopPropagation()
          setFullscreenPhotoMenuOpen(false)
        }}
      >
        <div
          className="w-full rounded-t-[22px] bg-white px-3 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#d1d5db]" />

          
          {isOwner ? (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      setFullscreenPhotoMenuOpen(false)
      setPhotoDeleteConfirmOpen(true)
    }}
    className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3.5 text-left active:bg-[#fff1f2]"
  >
    <span className="flex h-9 w-9 items-center justify-center text-[#e5484d]">
      <i className="fa-regular fa-trash-can text-[17px]" />
    </span>

    <span className="text-[14px] font-medium text-[#e5484d]">
      Delete photo
    </span>
  </button>
) : null}

          {photoDeleteConfirmOpen ? (
  <div
    className="absolute inset-0 z-50 flex items-end bg-black/45"
    onClick={(event) => {
      event.stopPropagation()

      if (!photoDeleteBusy) {
        setPhotoDeleteConfirmOpen(false)
      }
    }}
  >
    <div
      className="w-full rounded-t-[22px] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-2xl"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d5db]" />

      <div className="text-[16px] font-semibold text-[#111827]">
        Delete photo?
      </div>

      <p className="mt-1 text-[13px] font-normal leading-5 text-[#667085]">
        This photo will be permanently removed from this post.
      </p>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          disabled={photoDeleteBusy}
          onClick={() =>
            setPhotoDeleteConfirmOpen(false)
          }
          className="flex-1 rounded-[12px] bg-[#f3f4f6] px-4 py-3 text-[14px] font-semibold text-[#111827] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={photoDeleteBusy}
          onClick={deleteSelectedPhoto}
          className="flex-1 rounded-[12px] bg-[#e5484d] px-4 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
        >
          {photoDeleteBusy
            ? 'Deleting...'
            : 'Delete photo'}
        </button>
      </div>
    </div>
  </div>
) : null}
          
          <button
            type="button"
            onClick={saveSelectedPhoto}
            className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3.5 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[#111827]">
              <i className="fa-solid fa-download text-[17px]" />
            </span>

            <span className="text-[14px] font-medium text-[#111827]">
              Save photo
            </span>
          </button>

          <button
            type="button"
            onClick={shareSelectedPhoto}
            className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3.5 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[#111827]">
              <i className="fa-solid fa-share-nodes text-[17px]" />
            </span>

            <span className="text-[14px] font-medium text-[#111827]">
              Share photo
            </span>
          </button>
        </div>
      </div>
    ) : null}
  </div>
) : null}

      <CommentsModal
        open={
          commentsOpen &&
          Boolean(post?.id)
        }
        targetType="author_post"
        targetId={post?.id}
        title="Author post comments"
        story={
          post
            ? {
                ...post,
                author_page: {
                  ...(post.author_page ||
                    {}),
                  user_id:
                    post.author_page
                      ?.user_id ||
                    post.user_id ||
                    null,
                },
              }
            : null
        }
        onClose={() =>
          setCommentsOpen(false)
        }
        onCommentChanged={
          handleCommentsChanged
        }
      />
    </div>
  )
}

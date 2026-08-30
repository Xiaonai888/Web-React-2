import { recordAuthorPostClick } from '../../services/authorPostInsightsApi'
import CommentSection from '../../components/comments/CommentSection'
import PublicPostDetailView from '../../components/social/posts/PublicPostDetailView'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import CommentsModal from '../../components/story-detail/CommentsModal'
import AuthorPostEchoAction from '../../components/author-posts/AuthorPostEchoAction'
import AuthorPageShareSheet from '../../components/AuthorPageShareSheet'
import ReactionAction from '../../components/social/reactions/ReactionAction'
import ReactionSummary from '../../components/social/reactions/ReactionSummary'
import { ProfessionalSinglePostImage } from '../../components/common/ProfessionalPostContent'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')



const POST_TOKEN_PATTERN =
  /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN =
  /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN =
  /^#[\p{L}\p{N}\p{M}_]+$/u
const MAX_PHOTO_CAPTION_LENGTH = 2000
const MAX_PHOTO_ALT_TEXT_LENGTH = 500

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


function formatPhotoViewerDateTime(value) {
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

function renderPostTextWithLinks(text, postId) {
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
const location = useLocation()
const { postId } = useParams()
const [searchParams] = useSearchParams()
const postSource =
  searchParams.get('source') || 'direct'

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

  const [photoShareOpen, setPhotoShareOpen] =
  useState(false)

  const [
  photoDeleteConfirmOpen,
  setPhotoDeleteConfirmOpen,
] = useState(false)

const [
  photoDeleteBusy,
  setPhotoDeleteBusy,
] = useState(false)

const [photoCaptionEditorOpen, setPhotoCaptionEditorOpen] = useState(false)
const [photoCaption, setPhotoCaption] = useState('')
const [photoCaptionSaving, setPhotoCaptionSaving] = useState(false)

const [photoAltEditorOpen, setPhotoAltEditorOpen] = useState(false)
const [photoAltText, setPhotoAltText] = useState('')
const [photoAltSaving, setPhotoAltSaving] = useState(false)
  
  const commentCountBaseRef =
    useRef({
      loadedCount: null,
      serverCount: 0,
    })

  useEffect(() => {
  if (!post?.id) return
  commentCountBaseRef.current = {
    loadedCount: null,
    serverCount: Number(post.comment_count || 0),
  }
}, [post?.id])

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
)}?source=${encodeURIComponent(postSource)}`,
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
}
  }, [postId, postSource])
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
    )}?photo=${index}&source=${encodeURIComponent(postSource)}`
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

  function openPhotoCaptionEditor(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl) return

  setPhotoCaption(selectedPhotoCaption)
  setFullscreenPhotoMenuOpen(false)
  setPhotoCaptionEditorOpen(true)
}

async function savePhotoCaption(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl || photoCaptionSaving) return

  const token = getAuthToken()
  if (!token) {
    navigate('/login')
    return
  }

  const nextCaption = photoCaption
    .slice(0, MAX_PHOTO_CAPTION_LENGTH)
    .trim()

  const metadataByUrl = new Map(
    photoMetadata
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String(item.url || ''), item])
  )

  const nextPhotoMetadata = photoUrls.map((url, index) => {
    const existing =
      metadataByUrl.get(String(url)) ||
      photoMetadata[index] ||
      {}

    return {
      url,
      caption:
        index === safeSelectedPhotoIndex
          ? nextCaption
          : String(existing.caption || ''),
      alt_text: String(
        existing.alt_text ??
          existing.alt ??
          ''
      ),
    }
  })

  try {
    setPhotoCaptionSaving(true)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(post.id)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo_metadata: nextPhotoMetadata,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.error ||
          data.message ||
          'Failed to save caption'
      )
    }

    setPost((current) =>
      current
        ? {
            ...current,
            ...(data.post || {}),
            photo_metadata:
              data.post?.photo_metadata ||
              nextPhotoMetadata,
            author_page: current.author_page,
            is_owner: current.is_owner,
            is_following: current.is_following,
            my_reaction: current.my_reaction,
          }
        : current
    )

    setPhotoCaptionEditorOpen(false)
    setPhotoActionMessage(
      nextCaption
        ? 'Caption saved.'
        : 'Caption removed.'
    )
  } catch (error) {
    setPhotoActionMessage(
      error.message || 'Failed to save caption.'
    )
  } finally {
    setPhotoCaptionSaving(false)
  }
}

function openPhotoAltEditor(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl) return

  setPhotoAltText(selectedPhotoAltText)
  setFullscreenPhotoMenuOpen(false)
  setPhotoAltEditorOpen(true)
}

async function savePhotoAltText(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl || photoAltSaving) return

  const token = getAuthToken()
  if (!token) {
    navigate('/login')
    return
  }

  const nextAltText = photoAltText
    .slice(0, MAX_PHOTO_ALT_TEXT_LENGTH)
    .trim()

  const metadataByUrl = new Map(
    photoMetadata
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String(item.url || ''), item])
  )

  const nextPhotoMetadata = photoUrls.map((url, index) => {
    const existing =
      metadataByUrl.get(String(url)) ||
      photoMetadata[index] ||
      {}

    return {
      url,
      caption: String(existing.caption || ''),
      alt_text:
        index === safeSelectedPhotoIndex
          ? nextAltText
          : String(
              existing.alt_text ??
                existing.alt ??
                ''
            ),
    }
  })

  try {
    setPhotoAltSaving(true)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(post.id)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo_metadata: nextPhotoMetadata,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.error ||
          data.message ||
          'Failed to save alt text'
      )
    }

    setPost((current) =>
      current
        ? {
            ...current,
            ...(data.post || {}),
            photo_metadata:
              data.post?.photo_metadata ||
              nextPhotoMetadata,
            author_page: current.author_page,
            is_owner: current.is_owner,
            is_following: current.is_following,
            my_reaction: current.my_reaction,
          }
        : current
    )

    setPhotoAltEditorOpen(false)
    setPhotoActionMessage(
      nextAltText
        ? 'Alt text saved.'
        : 'Alt text removed.'
    )
  } catch (error) {
    setPhotoActionMessage(
      error.message ||
        'Failed to save alt text.'
    )
  } finally {
    setPhotoAltSaving(false)
  }
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
        )}?source=${encodeURIComponent(postSource)}`,
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
      )}?photo=${nextPhotoIndex}&source=${encodeURIComponent(postSource)}`,
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

function shareSelectedPhoto(event) {
  event?.stopPropagation()

  if (!selectedPhotoUrl) return

  setFullscreenPhotoMenuOpen(false)
  setPhotoShareOpen(true)
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
    'Content-Type': 'application/json',
    Authorization:
      `Bearer ${token}`,
  },
  body: JSON.stringify({
    source_post_id: post.id,
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

  const handleEchoCountChange = useCallback(
    (_postId, total) => {
      setPost((current) =>
        current
          ? {
              ...current,
              echo_count: Number(total || 0),
            }
          : current
      )
    },
    []
  )

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

  const photoMetadata = Array.isArray(
  post?.photo_metadata
)
  ? post.photo_metadata
  : []

const selectedPhotoMetadata =
  photoMetadata.find(
    (item) =>
      String(item?.url || '') ===
      String(selectedPhotoUrl || '')
  ) ||
  photoMetadata[safeSelectedPhotoIndex] ||
  {}

const selectedPhotoCaption = String(
  selectedPhotoMetadata?.caption || ''
)

const selectedPhotoAltText = String(
  selectedPhotoMetadata?.alt_text ??
    selectedPhotoMetadata?.alt ??
    ''
)

  useEffect(() => {
  if (!photoPostView || !selectedPhotoUrl) return

  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoDeleteConfirmOpen(false)
  setPhotoActionMessage('')
  setFullscreenPhotoOpen(true)
}, [photoPostView, selectedPhotoUrl])

  return (
    <div className="min-h-screen bg-[#f5f3fa]">
      <PublicPostDetailView
  pageName={authorName}
  pageAvatarUrl={
    author.avatar_url ||
    author.profile_image_url ||
    author.profile_picture_url ||
    ''
  }
  authorName={authorName}
  authorAvatarUrl={
    author.avatar_url ||
    author.profile_image_url ||
    author.profile_picture_url ||
    ''
  }
  createdAt={post?.created_at}
  visibility="public"
  isPinned={Boolean(post?.is_pinned)}
  isEdited={Boolean(post?.is_edited)}
  loading={loading}
  error={error}
  content={
    post?.content ? (
      <span>
        {renderPostTextWithLinks(
  post.content
)}
      </span>
    ) : null
  }
  media={
    post ? (
      <AuthorPostImages
        images={post.image_urls}
        authorName={authorName}
        photoPostView={photoPostView}
        selectedPhotoIndex={
          selectedPhotoIndex
        }
        onImageClick={
          handlePostImageClick
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
          count={post.like_count}
          busy={reactionBusy}
          showBusySpinner
          showCount={false}
          onReact={chooseReaction}
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
          disabled={reactionBusy}
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
        author={author}
        className="[&>span]:hidden after:content-['Echo'] after:text-[14px] after:font-normal after:text-[#65676b]"
        onCountChange={handleEchoCountChange}
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
myReaction={post?.my_reaction || null}
likeCount={
  Number(post?.like_count || 0)
}
  commentCount={
    Number(
      post?.comment_count || 0
    )
  }
  echoCount={
    Number(post?.echo_count || 0)
  }
  comments={
    post ? (
      <CommentSection
        targetType="author_post"
        targetId={post.id}
        variant="page"
        story={{
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
        }}
        onCommentsChange={
          handleCommentsChanged
        }
      />
    ) : null
  }
  onClose={goBack}
  onErrorBack={goBack}
  onSearch={() =>
    navigate(
      pageUsername
        ? `/author/page/${encodeURIComponent(
            pageUsername
          )}/search`
        : '/author/page'
    )
  }
  onOpenProfile={() =>
    navigate(
      pageUsername
        ? `/author/page/${encodeURIComponent(
            pageUsername
          )}`
        : '/author/page'
    )
  }
  onComment={() => {
    document
      .getElementById(
        'shadow-comment-input'
      )
      ?.focus()
  }}
  onOpenReactions={() =>
    post?.id
      ? navigate(
          `/interactions/author_post/${encodeURIComponent(
            post.id
          )}/likes`,
          {
            state: {
              sourceName:
                authorName,
            },
          }
        )
      : null
  }
  onOpenComments={() => {
    document
      .getElementById(
        'shadow-comment-input'
      )
      ?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
  }}
  onOpenEchoes={() =>
    post?.id
      ? navigate(
          `/interactions/author_post/${encodeURIComponent(
            post.id
          )}/echoes`,
          {
            state: {
              sourceName:
                authorName,
            },
          }
        )
      : null
  }
/>

{actionError ? (
  <div className="fixed left-1/2 top-20 z-[300] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
    {actionError}
  </div>
) : null}

      {fullscreenPhotoOpen && selectedPhotoUrl ? (
  <div
    className="fixed inset-0 z-[150000] bg-black"
    onClick={() => {
      if (
        photoCaptionEditorOpen ||
        photoAltEditorOpen
      ) {
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

      setFullscreenControlsVisible(
        (current) => !current
      )
    }}
  >
    {fullscreenControlsVisible ? (
  <div
    className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/90 via-black/65 to-transparent pb-10 pt-[max(8px,env(safe-area-inset-top))]"
    onClick={(event) => event.stopPropagation()}
  >
    <div className="relative flex h-12 items-center justify-between px-3">
      <button
        type="button"
        onClick={() => {
          if (
  location.state?.backgroundLocation?.pathname === '/discover' ||
  location.state?.fromAuthorPage
) {
  navigate(-1)
  return
}

          setFullscreenPhotoOpen(false)
          setFullscreenControlsVisible(true)
          setFullscreenPhotoMenuOpen(false)
          setPhotoDeleteConfirmOpen(false)
          setPhotoCaptionEditorOpen(false)
          setPhotoAltEditorOpen(false)
          setPhotoActionMessage('')
        }}
        className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
        aria-label="Close fullscreen photo"
      >
        <i className="fa-solid fa-xmark text-[22px]" />
      </button>

      {photoUrls.length > 1 ? (
        <div className="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-white">
          {safeSelectedPhotoIndex + 1} of {photoUrls.length}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() =>
          setFullscreenPhotoMenuOpen(true)
        }
        className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
        aria-label="Photo options"
      >
        <i className="fa-solid fa-ellipsis text-[19px]" />
      </button>
    </div>
  </div>
) : null}

    <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden">
      <img
        src={selectedPhotoUrl}
        alt={selectedPhotoAltText}
        loading="eager"
        decoding="async"
        draggable="false"
        className="max-h-[100dvh] max-w-full select-none object-contain"
      />
    </div>

    {fullscreenControlsVisible &&
!fullscreenPhotoMenuOpen &&
!photoCaptionEditorOpen &&
!photoAltEditorOpen &&
!photoDeleteConfirmOpen ? (
  <div
    className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-14"
    onClick={(event) => event.stopPropagation()}
  >
    <div className="mx-auto max-w-[620px]">
      <button
        type="button"
        onClick={() =>
          navigate(
            pageUsername
              ? `/author/page/${encodeURIComponent(
                  pageUsername
                )}`
              : '/author/page'
          )
        }
        className="flex w-full items-center gap-3 px-4 pb-3 text-left active:opacity-70"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-[15px] font-semibold text-white ring-1 ring-white/20">
          {author.avatar_url ||
          author.profile_image_url ||
          author.profile_picture_url ? (
            <img
              src={
                author.avatar_url ||
                author.profile_image_url ||
                author.profile_picture_url
              }
              alt={authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </span>

        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-white">
            {authorName}
          </div>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
            <span>
              {formatPhotoViewerDateTime(
                post?.created_at
              )}
            </span>

            <span>·</span>

            <i className="fa-solid fa-earth-americas text-[10px]" />
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between border-b border-white/15 px-4 pb-2 text-[11px] text-white/75">
        <ReactionSummary
  summary={post?.reaction_summary}
  likeCount={post?.like_count}
  myReaction={post?.my_reaction}
/>
        <div className="flex items-center gap-4">
          <span>
            {Number(post?.comment_count || 0)} comments
          </span>

          <span>
            {Number(post?.echo_count || 0)} shares
          </span>
        </div>
      </div>

      {isOwner ? (
  <div className="px-4 pt-3">
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        setPhotoActionMessage('Boost Post is coming soon.')
      }}
      className="h-10 w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(139,92,246,0.28)] active:scale-[0.99]"
    >
      Boost Post
    </button>
  </div>
) : null}

      <div className="flex items-center px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1">
        <ReactionAction
          reactionType={post?.my_reaction}
          count={post?.like_count}
          busy={reactionBusy}
          onReact={chooseReaction}
          showCount={false}
          idleLabel="Like"
          className="flex-1 justify-center"
          buttonClassName="h-12 min-w-[88px] justify-center gap-2 text-white after:content-['Like'] after:text-[14px] after:font-medium [&>i]:!text-[20px] [&>img]:!h-5 [&>img]:!w-5"
        />

        <button
          type="button"
          onClick={() => {
            setFullscreenPhotoOpen(false)
            setFullscreenControlsVisible(true)
            openComments()
          }}
          className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
        >
          <i className="fa-regular fa-comment text-[20px]" />
          <span>Comment</span>
        </button>

        <AuthorPostEchoAction
          post={post}
          author={author}
          onCountChange={handleEchoCountChange}
          className="h-12 flex-1 justify-center gap-2 text-white [&>img]:!h-5 [&>img]:!w-5 [&>img]:brightness-0 [&>img]:invert [&>span]:hidden after:content-['Share'] after:text-[14px] after:font-medium"
        />
      </div>
    </div>
  </div>
) : null}

    {fullscreenControlsVisible &&
    selectedPhotoCaption &&
    !fullscreenPhotoMenuOpen &&
    !photoCaptionEditorOpen &&
    !photoAltEditorOpen &&
    !photoDeleteConfirmOpen ? (
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+92px)] left-0 right-0 z-20 px-5 text-center">
        <p className="mx-auto max-w-[720px] whitespace-pre-wrap break-words text-[13px] leading-5 text-white">
          {selectedPhotoCaption}
        </p>
      </div>
    ) : null}

    {photoActionMessage ? (
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+94px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-[12px] font-medium text-[#111827] shadow-xl">
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
          className="w-full bg-white px-2 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
        

          {isOwner ? (
            <button
              type="button"
              onClick={openPhotoCaptionEditor}
              className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
                <i className="fa-solid fa-pencil text-[19px]" />
              </span>
              <span className="text-[15px] font-normal text-[#111827]">
                Edit caption
              </span>
            </button>
          ) : null}

          {isOwner ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setFullscreenPhotoMenuOpen(false)
                setPhotoDeleteConfirmOpen(true)
              }}
              className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
                <i className="fa-regular fa-trash-can text-[20px]" />
              </span>
              <span className="text-[15px] font-normal text-[#111827]">
                Delete photo
              </span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={saveSelectedPhoto}
            className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
</svg>
            </span>
            <span className="text-[15px] font-normal text-[#111827]">
              Save to phone
            </span>
          </button>

          <button
            type="button"
            onClick={shareSelectedPhoto}
            className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
              <i
  className="fa-solid fa-share text-[19px] text-transparent"
  style={{ WebkitTextStroke: '1.1px #4b5563' }}
/>
            </span>
            <span className="text-[15px] font-normal text-[#111827]">
              Share external
            </span>
          </button>

          {!isOwner ? (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      setFullscreenPhotoMenuOpen(false)

      navigate(
        `/report/author_post/${encodeURIComponent(post.id)}`,
        {
          state: {
            reportContext: 'photo',
            targetTitle: `${authorName} photo`,
            sourceUrl: selectedPhotoUrl,
            returnTo: `/author/post/${encodeURIComponent(
  post.id
)}?photo=${safeSelectedPhotoIndex}&source=${encodeURIComponent(
  postSource
)}`,
          },
        }
      )
    }}
    className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
  >
    <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-current">
  <i className="fa-solid fa-question text-[10px]" />
</span>
    </span>

    <span className="text-[15px] font-normal text-[#111827]">
      Report photo
    </span>
  </button>
) : null}

          {isOwner ? (
            <button
              type="button"
              onClick={openPhotoAltEditor}
              className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-9 w-9 items-center justify-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-[5px] border-2 border-[#6b7280] text-[14px] font-semibold text-[#4b5563]">
                  A
                </span>
              </span>
              <span className="text-[15px] font-normal text-[#111827]">
                Edit alt text
              </span>
            </button>
          ) : null}
        </div>
      </div>
    ) : null}

    {photoCaptionEditorOpen ? (
      <div
        className="absolute inset-0 z-50 flex items-end bg-black/45"
        onClick={(event) => {
          event.stopPropagation()
          if (!photoCaptionSaving) {
            setPhotoCaptionEditorOpen(false)
          }
        }}
      >
        <div
          className="w-full rounded-t-[22px] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d5db]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-semibold text-[#111827]">
                Edit caption
              </div>
              <div className="mt-1 text-[12px] text-[#98a2b3]">
                Photo {safeSelectedPhotoIndex + 1}
              </div>
            </div>

            <span className="text-[11px] text-[#98a2b3]">
              {photoCaption.length} / {MAX_PHOTO_CAPTION_LENGTH}
            </span>
          </div>

          <textarea
            autoFocus
            value={photoCaption}
            maxLength={MAX_PHOTO_CAPTION_LENGTH}
            onChange={(event) =>
              setPhotoCaption(
                event.target.value.slice(
                  0,
                  MAX_PHOTO_CAPTION_LENGTH
                )
              )
            }
            placeholder="Write a caption for this photo..."
            className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-3 text-[14px] leading-5 text-[#111827] outline-none"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={photoCaptionSaving}
              onClick={() =>
                setPhotoCaptionEditorOpen(false)
              }
              className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[#111827]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={photoCaptionSaving}
              onClick={savePhotoCaption}
              className="h-11 flex-1 rounded-full bg-[#111827] text-[14px] font-semibold text-white"
            >
              {photoCaptionSaving
                ? 'Saving...'
                : 'Save'}
            </button>
          </div>
        </div>
      </div>
    ) : null}

    {photoAltEditorOpen ? (
      <div
        className="absolute inset-0 z-50 flex items-end bg-black/45"
        onClick={(event) => {
          event.stopPropagation()
          if (!photoAltSaving) {
            setPhotoAltEditorOpen(false)
          }
        }}
      >
        <div
          className="w-full rounded-t-[22px] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d1d5db]" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-semibold text-[#111827]">
                Edit alt text
              </div>
              <p className="mt-1 text-[12px] leading-5 text-[#667085]">
                Describe what is shown in this photo for accessibility.
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-[#98a2b3]">
              {photoAltText.length} / {MAX_PHOTO_ALT_TEXT_LENGTH}
            </span>
          </div>

          <textarea
            autoFocus
            value={photoAltText}
            maxLength={MAX_PHOTO_ALT_TEXT_LENGTH}
            onChange={(event) =>
              setPhotoAltText(
                event.target.value.slice(
                  0,
                  MAX_PHOTO_ALT_TEXT_LENGTH
                )
              )
            }
            placeholder="Describe this photo..."
            className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-3 text-[14px] leading-5 text-[#111827] outline-none"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={photoAltSaving}
              onClick={() =>
                setPhotoAltEditorOpen(false)
              }
              className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[#111827]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={photoAltSaving}
              onClick={savePhotoAltText}
              className="h-11 flex-1 rounded-full bg-[#111827] text-[14px] font-semibold text-white"
            >
              {photoAltSaving
                ? 'Saving...'
                : 'Save'}
            </button>
          </div>
        </div>
      </div>
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

          <p className="mt-1 text-[13px] leading-5 text-[#667085]">
            This photo will be permanently removed from this post.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              disabled={photoDeleteBusy}
              onClick={() =>
                setPhotoDeleteConfirmOpen(false)
              }
              className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[#111827]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={photoDeleteBusy}
              onClick={deleteSelectedPhoto}
              className="h-11 flex-1 rounded-full bg-[#e5484d] text-[14px] font-semibold text-white"
            >
              {photoDeleteBusy
                ? 'Deleting...'
                : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    ) : null}
  </div>
) : null}

<AuthorPageShareSheet
  open={photoShareOpen}
  pageName={`${authorName} photo`}
  pageLink={
  post?.id
    ? `${window.location.origin}/author/post/${encodeURIComponent(
        post.id
      )}?photo=${safeSelectedPhotoIndex}&source=share`
    : selectedPhotoUrl
}
  sheetTitle="Share Photo"
  shareText={`View this photo from ${authorName} on Shadow.`}
  zClassName="z-[200000]"
  onClose={() => setPhotoShareOpen(false)}
  onCopied={() =>
    setPhotoActionMessage('Photo link copied.')
  }
/>

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

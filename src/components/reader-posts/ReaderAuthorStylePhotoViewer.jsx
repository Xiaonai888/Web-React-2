import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorPageShareSheet from '../AuthorPageShareSheet'
import EchoShareSheetV2Connected from '../social/EchoShareSheetV2Connected'
import ReactionAction from '../social/reactions/ReactionAction'
import ReactionSummary from '../social/reactions/ReactionSummary'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MAX_PHOTO_CAPTION_LENGTH = 2000
const MAX_PHOTO_ALT_TEXT_LENGTH = 500

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatPhotoViewerDateTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getVisibilityIcon(value) {
  if (value === 'only_me' || value === 'private') {
    return 'fa-solid fa-lock'
  }

  if (value === 'friends') {
    return 'fa-solid fa-user-group'
  }

  if (value === 'followers') {
    return 'fa-solid fa-users'
  }

  if (value === 'friends_and_followers') {
    return 'fa-solid fa-user-group'
  }

  return 'fa-solid fa-earth-americas'
}

function buildPhotoMetadata(photos, metadata, selectedIndex, field, value) {
  const byUrl = new Map(
    metadata
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String(item.url || ''), item])
  )

  return photos.map((url, index) => {
    const existing =
      byUrl.get(String(url)) ||
      metadata[index] ||
      {}

    return {
      url,
      caption:
        field === 'caption' && index === selectedIndex
          ? value
          : String(existing.caption || ''),
      alt_text:
        field === 'alt_text' && index === selectedIndex
          ? value
          : String(existing.alt_text ?? existing.alt ?? ''),
    }
  })
}

export default function ReaderAuthorStylePhotoViewer({
  open,
  post,
  imageUrls,
  selectedPhotoIndex = 0,
  isOwner = false,
  reactionType = null,
  reactionCount = 0,
  reactionSummary = [],
  reactionBusy = false,
  commentCount = 0,
  shareCount = 0,
  routePhotoMode = false,
  onReact,
  onComment,
  onUpdated,
  onShareCountChange,
  onClose,
}) {
  const navigate = useNavigate()
  const [controlsVisible, setControlsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [captionEditorOpen, setCaptionEditorOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [captionSaving, setCaptionSaving] = useState(false)
  const [altEditorOpen, setAltEditorOpen] = useState(false)
  const [altText, setAltText] = useState('')
  const [altSaving, setAltSaving] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [externalShareOpen, setExternalShareOpen] = useState(false)
  const [echoOpen, setEchoOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const user = post?.user || {}

  const photos = useMemo(
    () =>
      (Array.isArray(imageUrls) ? imageUrls : post?.image_urls || [])
        .filter((url) => typeof url === 'string' && url.trim())
        .slice(0, 5),
    [imageUrls, post?.image_urls]
  )

  const safeIndex = photos.length
    ? Math.min(
        photos.length - 1,
        Math.max(
          0,
          Number.isFinite(Number(activeIndex))
            ? Math.floor(Number(activeIndex))
            : 0
        )
      )
    : 0

  const selectedPhotoUrl = photos[safeIndex] || ''

  const photoMetadata = Array.isArray(post?.photo_metadata)
    ? post.photo_metadata
    : []

  const selectedMetadata =
    photoMetadata.find(
      (item) =>
        String(item?.url || '') ===
        String(selectedPhotoUrl || '')
    ) ||
    photoMetadata[safeIndex] ||
    {}

  const selectedCaption = String(
    selectedMetadata?.caption || ''
  )

  const selectedAltText = String(
    selectedMetadata?.alt_text ??
      selectedMetadata?.alt ??
      ''
  )

  const readerName =
    user?.name ||
    user?.username ||
    'Reader'

  const readerUsername = String(
    user?.username || ''
  ).trim()

  const readerAvatarUrl =
    user?.avatar_url || ''

  const firstLetter =
    readerName
      .trim()
      .slice(0, 1)
      .toUpperCase() || 'R'

  const viewerDate = formatPhotoViewerDateTime(
    post?.created_at
  )

  const visibilityIcon = getVisibilityIcon(
    post?.visibility || 'public'
  )

  const readerPostShareUrl =
    `${window.location.origin}/reader/post/${encodeURIComponent(
      post?.id || ''
    )}`

  useEffect(() => {
    if (!open) return

    setActiveIndex(
      Math.max(
        0,
        Number.isFinite(Number(selectedPhotoIndex))
          ? Math.floor(Number(selectedPhotoIndex))
          : 0
      )
    )
    setControlsVisible(true)
    setMenuOpen(false)
    setCaptionEditorOpen(false)
    setAltEditorOpen(false)
    setDeleteConfirmOpen(false)
    setActionMessage('')
    setExternalShareOpen(false)
    setEchoOpen(false)
  }, [open, selectedPhotoIndex, post?.id])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key !== 'Escape') {
        return
      }

      if (externalShareOpen || echoOpen) {
        return
      }

      if (altEditorOpen) {
        if (!altSaving) {
          setAltEditorOpen(false)
        }
        return
      }

      if (captionEditorOpen) {
        if (!captionSaving) {
          setCaptionEditorOpen(false)
        }
        return
      }

      if (deleteConfirmOpen) {
        if (!deleteBusy) {
          setDeleteConfirmOpen(false)
        }
        return
      }

      if (menuOpen) {
        setMenuOpen(false)
        return
      }

      onClose?.()
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
    altEditorOpen,
    altSaving,
    captionEditorOpen,
    captionSaving,
    deleteBusy,
    deleteConfirmOpen,
    echoOpen,
    externalShareOpen,
    menuOpen,
    onClose,
    open,
  ])

  useEffect(() => {
    if (!actionMessage) {
      return undefined
    }

    const timer = window.setTimeout(
      () => setActionMessage(''),
      1800
    )

    return () =>
      window.clearTimeout(timer)
  }, [actionMessage])

  if (!open || !selectedPhotoUrl) {
    return null
  }

  function openReaderProfile() {
    if (!readerUsername) {
      return
    }

    navigate(
      `/profile?username=${encodeURIComponent(
        readerUsername
      )}`
    )
  }

  function openCaptionEditor(event) {
    event?.stopPropagation()

    if (!isOwner) {
      return
    }

    setCaption(selectedCaption)
    setMenuOpen(false)
    setCaptionEditorOpen(true)
  }

  function openAltEditor(event) {
    event?.stopPropagation()

    if (!isOwner) {
      return
    }

    setAltText(selectedAltText)
    setMenuOpen(false)
    setAltEditorOpen(true)
  }

  async function updatePhotoMetadata(
    field,
    value
  ) {
    if (
      !isOwner ||
      !post?.id ||
      !selectedPhotoUrl
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    const nextMetadata =
      buildPhotoMetadata(
        photos,
        photoMetadata,
        safeIndex,
        field,
        value
      )

    const response = await fetch(
      `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(
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
          photo_metadata: nextMetadata,
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
          'Failed to update photo'
      )
    }

    onUpdated?.(
      data.post || {
        ...post,
        photo_metadata: nextMetadata,
      }
    )
  }

  async function saveCaption(event) {
    event?.stopPropagation()

    if (
      captionSaving ||
      !isOwner
    ) {
      return
    }

    const nextCaption =
      caption
        .slice(
          0,
          MAX_PHOTO_CAPTION_LENGTH
        )
        .trim()

    try {
      setCaptionSaving(true)

      await updatePhotoMetadata(
        'caption',
        nextCaption
      )

      setCaptionEditorOpen(false)
      setActionMessage(
        nextCaption
          ? 'Caption saved.'
          : 'Caption removed.'
      )
    } catch (error) {
      setActionMessage(
        error.message ||
          'Failed to save caption.'
      )
    } finally {
      setCaptionSaving(false)
    }
  }

  async function saveAltText(event) {
    event?.stopPropagation()

    if (
      altSaving ||
      !isOwner
    ) {
      return
    }

    const nextAltText =
      altText
        .slice(
          0,
          MAX_PHOTO_ALT_TEXT_LENGTH
        )
        .trim()

    try {
      setAltSaving(true)

      await updatePhotoMetadata(
        'alt_text',
        nextAltText
      )

      setAltEditorOpen(false)
      setActionMessage(
        nextAltText
          ? 'Alt text saved.'
          : 'Alt text removed.'
      )
    } catch (error) {
      setActionMessage(
        error.message ||
          'Failed to save alt text.'
      )
    } finally {
      setAltSaving(false)
    }
  }

  async function deleteSelectedPhoto(
    event
  ) {
    event?.stopPropagation()

    if (
      !isOwner ||
      deleteBusy ||
      !post?.id
    ) {
      return
    }

    const remainingPhotos =
      photos.filter(
        (_, index) =>
          index !== safeIndex
      )

    const currentContent =
      String(post?.content || '').trim()

    if (
      !remainingPhotos.length &&
      !currentContent
    ) {
      setDeleteConfirmOpen(false)
      setActionMessage(
        'This post needs text or a photo. Delete the post instead.'
      )
      return
    }

    const token = getAuthToken()

    if (!token) {
      setDeleteConfirmOpen(false)
      onClose?.()
      navigate('/login')
      return
    }

    try {
      setDeleteBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(
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
            content: currentContent,
            image_urls:
              remainingPhotos,
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
          content: currentContent,
          image_urls:
            remainingPhotos,
        }

      onUpdated?.(updatedPost)
      setDeleteConfirmOpen(false)
      setMenuOpen(false)

      if (!remainingPhotos.length) {
        if (routePhotoMode) {
          navigate(
            `/reader/post/${encodeURIComponent(
              post.id
            )}`,
            {
              replace: true,
            }
          )
        }

        onClose?.()
        return
      }

      const nextIndex =
        Math.min(
          safeIndex,
          remainingPhotos.length - 1
        )

      setActiveIndex(nextIndex)
      setActionMessage(
        'Photo deleted.'
      )

      if (routePhotoMode) {
        navigate(
          `/reader/post/${encodeURIComponent(
            post.id
          )}?photo=${nextIndex}`,
          {
            replace: true,
          }
        )
      }
    } catch (error) {
      setDeleteConfirmOpen(false)
      setActionMessage(
        error.message ||
          'Failed to delete photo.'
      )
    } finally {
      setDeleteBusy(false)
    }
  }

  async function saveSelectedPhoto(
    event
  ) {
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

      const blob =
        await response.blob()

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
        `shadow-reader-photo-${post.id}-${safeIndex + 1}.${extension}`

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

      setMenuOpen(false)
      setActionMessage(
        'Photo saved.'
      )
    } catch {
      const link =
        document.createElement('a')

      link.href =
        selectedPhotoUrl
      link.target = '_blank'
      link.rel =
        'noopener noreferrer'
      link.download =
        `shadow-reader-photo-${post.id}-${safeIndex + 1}`

      document.body.appendChild(link)
      link.click()
      link.remove()

      setMenuOpen(false)
      setActionMessage(
        'Photo opened for saving.'
      )
    }
  }

  function reportSelectedPhoto(
    event
  ) {
    event?.stopPropagation()

    if (
      isOwner ||
      !post?.id
    ) {
      return
    }

    setMenuOpen(false)

    navigate(
      `/report/reader_post/${encodeURIComponent(
        post.id
      )}`,
      {
        state: {
          reportContext: 'photo',
          targetTitle:
            `${readerName} photo`,
          sourceUrl:
            selectedPhotoUrl,
          returnTo:
            `/reader/post/${encodeURIComponent(
              post.id
            )}?photo=${safeIndex}`,
        },
      }
    )
  }

  function openEchoShare(event) {
    event?.stopPropagation()
    setEchoOpen(true)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[150000] bg-black"
        onClick={() => {
          if (
            captionEditorOpen ||
            altEditorOpen
          ) {
            return
          }

          if (deleteConfirmOpen) {
            if (!deleteBusy) {
              setDeleteConfirmOpen(false)
            }
            return
          }

          if (menuOpen) {
            setMenuOpen(false)
            return
          }

          setControlsVisible(
            (current) => !current
          )
        }}
      >
        {controlsVisible ? (
          <div
            className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/90 via-black/65 to-transparent pb-10 pt-[max(8px,env(safe-area-inset-top))]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="relative flex h-12 items-center justify-between px-3">
              <button
                type="button"
                onClick={() =>
                  onClose?.()
                }
                className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
                aria-label="Close fullscreen photo"
              >
                <i className="fa-solid fa-xmark text-[22px]" />
              </button>

              {photos.length > 1 ? (
                <div className="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-white">
                  {safeIndex + 1} of{' '}
                  {photos.length}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(true)
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
            alt={selectedAltText}
            loading="eager"
            decoding="async"
            draggable="false"
            className="max-h-[100dvh] max-w-full select-none object-contain"
          />
        </div>

        {controlsVisible &&
        !menuOpen &&
        !captionEditorOpen &&
        !altEditorOpen &&
        !deleteConfirmOpen ? (
          <div
            className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-14"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mx-auto max-w-[620px]">
              <button
                type="button"
                onClick={
                  openReaderProfile
                }
                className="flex w-full items-center gap-3 px-4 pb-3 text-left active:opacity-70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-[15px] font-semibold text-white ring-1 ring-white/20">
                  {readerAvatarUrl ? (
                    <img
                      src={
                        readerAvatarUrl
                      }
                      alt={readerName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    firstLetter
                  )}
                </span>

                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-white">
                    {readerName}
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
                    <span>
                      {viewerDate}
                    </span>

                    <span>·</span>

                    <i
                      className={`${visibilityIcon} text-[10px]`}
                    />
                  </div>
                </div>
              </button>

              <div className="flex items-center justify-between border-b border-white/15 px-4 pb-2 text-[11px] text-white/75">
                <ReactionSummary
                  summary={
                    reactionSummary
                  }
                  likeCount={
                    reactionCount
                  }
                  myReaction={
                    reactionType
                  }
                />

                <div className="flex items-center gap-4">
                  <span>
                    {Number(
                      commentCount || 0
                    )}{' '}
                    comments
                  </span>

                  <span>
                    {Number(
                      shareCount || 0
                    )}{' '}
                    shares
                  </span>
                </div>
              </div>

              {isOwner ? (
                <div className="px-4 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActionMessage(
                        'Boost Post is coming soon.'
                      )
                    }
                    className="h-10 w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(139,92,246,0.28)] active:scale-[0.99]"
                  >
                    Boost Post
                  </button>
                </div>
              ) : null}

              <div className="flex items-center px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1">
                <ReactionAction
                  reactionType={
                    reactionType
                  }
                  count={
                    reactionCount
                  }
                  busy={
                    reactionBusy
                  }
                  onReact={
                    onReact
                  }
                  showCount={false}
                  idleLabel="Like"
                  className="flex-1 justify-center"
                  buttonClassName="h-12 min-w-[88px] justify-center gap-2 text-white after:content-['Like'] after:text-[14px] after:font-medium [&>i]:!text-[20px] [&>img]:!h-5 [&>img]:!w-5"
                />

                <button
                  type="button"
                  onClick={() =>
                    onComment?.()
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
                >
                  <i className="fa-regular fa-comment text-[20px]" />
                  <span>
                    Comment
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    openEchoShare
                  }
                  className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
                >
                  <img
                    src="/assets/Icons/echo.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain brightness-0 invert"
                  />
                  <span>
                    Share
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {controlsVisible &&
        selectedCaption &&
        !menuOpen &&
        !captionEditorOpen &&
        !altEditorOpen &&
        !deleteConfirmOpen ? (
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+92px)] left-0 right-0 z-20 px-5 text-center">
            <p className="mx-auto max-w-[720px] whitespace-pre-wrap break-words text-[13px] leading-5 text-white">
              {selectedCaption}
            </p>
          </div>
        ) : null}

        {actionMessage ? (
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+94px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-[12px] font-medium text-[#111827] shadow-xl">
            {actionMessage}
          </div>
        ) : null}

        {menuOpen ? (
          <div
            className="absolute inset-0 z-40 flex items-end bg-black/35"
            onClick={(event) => {
              event.stopPropagation()
              setMenuOpen(false)
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
                  onClick={
                    openCaptionEditor
                  }
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
                    setMenuOpen(false)
                    setDeleteConfirmOpen(
                      true
                    )
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
                onClick={
                  saveSelectedPhoto
                }
                className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
              >
                <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3v11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-[15px] font-normal text-[#111827]">
                  Save to phone
                </span>
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setMenuOpen(false)
                  setExternalShareOpen(
                    true
                  )
                }}
                className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[#f3f4f6]"
              >
                <span className="flex h-9 w-9 items-center justify-center text-[#4b5563]">
                  <i
                    className="fa-solid fa-share text-[19px] text-transparent"
                    style={{
                      WebkitTextStroke:
                        '1.1px #4b5563',
                    }}
                  />
                </span>
                <span className="text-[15px] font-normal text-[#111827]">
                  Share external
                </span>
              </button>

              {!isOwner ? (
                <button
                  type="button"
                  onClick={
                    reportSelectedPhoto
                  }
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
                  onClick={
                    openAltEditor
                  }
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

        {captionEditorOpen ? (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/45"
            onClick={(event) => {
              event.stopPropagation()

              if (!captionSaving) {
                setCaptionEditorOpen(
                  false
                )
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
                  <div className="mt-1 text-[12px] font-normal text-[#98a2b3]">
                    Photo{' '}
                    {safeIndex + 1}
                  </div>
                </div>

                <span className="text-[11px] font-normal text-[#98a2b3]">
                  {caption.length} /{' '}
                  {
                    MAX_PHOTO_CAPTION_LENGTH
                  }
                </span>
              </div>

              <textarea
                autoFocus
                value={caption}
                maxLength={
                  MAX_PHOTO_CAPTION_LENGTH
                }
                onChange={(event) =>
                  setCaption(
                    event.target.value.slice(
                      0,
                      MAX_PHOTO_CAPTION_LENGTH
                    )
                  )
                }
                placeholder="Write a caption for this photo..."
                className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-3 text-[14px] font-normal leading-5 text-[#111827] outline-none focus:border-[#111827]"
              />

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={
                    captionSaving
                  }
                  onClick={() =>
                    setCaptionEditorOpen(
                      false
                    )
                  }
                  className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[#111827] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    captionSaving
                  }
                  onClick={
                    saveCaption
                  }
                  className="h-11 flex-1 rounded-full bg-[#111827] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {captionSaving
                    ? 'Saving...'
                    : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {altEditorOpen ? (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/45"
            onClick={(event) => {
              event.stopPropagation()

              if (!altSaving) {
                setAltEditorOpen(false)
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
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold text-[#111827]">
                    Edit alt text
                  </div>
                  <p className="mt-1 text-[12px] font-normal leading-5 text-[#667085]">
                    Describe what is
                    shown in this photo
                    for accessibility.
                  </p>
                </div>

                <span className="shrink-0 text-[11px] font-normal text-[#98a2b3]">
                  {altText.length} /{' '}
                  {
                    MAX_PHOTO_ALT_TEXT_LENGTH
                  }
                </span>
              </div>

              <textarea
                autoFocus
                value={altText}
                maxLength={
                  MAX_PHOTO_ALT_TEXT_LENGTH
                }
                onChange={(event) =>
                  setAltText(
                    event.target.value.slice(
                      0,
                      MAX_PHOTO_ALT_TEXT_LENGTH
                    )
                  )
                }
                placeholder="Describe this photo..."
                className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-3 text-[14px] font-normal leading-5 text-[#111827] outline-none focus:border-[#111827]"
              />

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={altSaving}
                  onClick={() =>
                    setAltEditorOpen(
                      false
                    )
                  }
                  className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[#111827] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={altSaving}
                  onClick={
                    saveAltText
                  }
                  className="h-11 flex-1 rounded-full bg-[#111827] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {altSaving
                    ? 'Saving...'
                    : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {deleteConfirmOpen ? (
          <div
            className="absolute inset-0 z-50 flex items-end bg-black/45"
            onClick={(event) => {
              event.stopPropagation()

              if (!deleteBusy) {
                setDeleteConfirmOpen(
                  false
                )
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

              <div className="text-[16px] font-semibold text-[#111827]">
                Delete this photo?
              </div>

              <p className="mt-1.5 text-[13px] font-normal leading-5 text-[#667085]">
                This photo will be
                removed from this
                Reader post.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() =>
                    setDeleteConfirmOpen(
                      false
                    )
                  }
                  className="h-11 flex-1 rounded-full bg-[#eef0f4] text-[14px] font-semibold text-[#111827] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={
                    deleteSelectedPhoto
                  }
                  className="h-11 flex-1 rounded-full bg-[#e5484d] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {deleteBusy
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <AuthorPageShareSheet
        open={externalShareOpen}
        pageName={`${readerName} photo`}
        pageLink={selectedPhotoUrl}
        sheetTitle="Share Photo"
        shareText={`View ${readerName}'s photo on Shadow.`}
        zClassName="z-[150100]"
        onClose={() =>
          setExternalShareOpen(false)
        }
        onCopied={() =>
          setActionMessage(
            'Photo link copied.'
          )
        }
      />

      <EchoShareSheetV2Connected
        open={echoOpen}
        sourceType="reader_post"
        sourceId={post?.id}
        sourceName={readerName}
        sourceAvatarUrl={
          readerAvatarUrl
        }
        sourceContent={
          post?.content ||
          'Reader post'
        }
        sourceImageUrl={
          selectedPhotoUrl ||
          photos[0] ||
          ''
        }
        sourceLabel="reader post"
        shareUrl={
          readerPostShareUrl
        }
        onClose={() =>
          setEchoOpen(false)
        }
        onEchoed={(
          nextEcho,
          nextTotal
        ) => {
          const total = Math.max(
            0,
            Number(
              nextTotal ??
                (nextEcho
                  ? Number(
                      shareCount || 0
                    ) + 1
                  : shareCount)
            )
          )

          onShareCountChange?.(
            total,
            nextEcho
          )
        }}
      />
    </>
  )
}

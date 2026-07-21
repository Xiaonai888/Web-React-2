import { createPortal } from 'react-dom'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const DESTINATIONS = [
  {
    key: 'feed',
    title: 'Echo to Feed',
    subtitle:
      'Show this echo in your Shadow feed and profile.',
    icon: 'fa-solid fa-newspaper',
  },
  {
    key: 'shadow',
    title: 'Add to My Shadow',
    subtitle:
      'Keep this echo on your own Shadow space.',
    icon: 'fa-regular fa-circle-user',
  },
  {
    key: 'reader',
    title: 'Send to Reader',
    subtitle:
      'Share this reader post with selected readers.',
    icon: 'fa-solid fa-user-group',
  },
  {
    key: 'circle',
    title: 'Echo to Circle',
    subtitle:
      'Share this echo with your reading circle.',
    icon: 'fa-solid fa-users',
  },
]

const AUDIENCES = [
  {
    key: 'public',
    title: 'Public',
    subtitle:
      'Anyone on Shadow can view this echo.',
    icon: 'fa-solid fa-earth-americas',
  },
  {
    key: 'followers',
    title: 'Followers',
    subtitle:
      'Only people who follow you can view this echo.',
    icon: 'fa-solid fa-user-check',
  },
  {
    key: 'close-readers',
    title: 'Close readers',
    subtitle:
      'Only your selected close readers can view it.',
    icon: 'fa-solid fa-star',
  },
  {
    key: 'only-me',
    title: 'Only me',
    subtitle: 'Keep this echo private.',
    icon: 'fa-solid fa-lock',
  },
]

function getReaderToken() {
  return (
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function getEchoPosts() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(
        'shadow_profile_echo_posts'
      ) || '[]'
    )

    return Array.isArray(parsed)
      ? parsed
      : []
  } catch {
    return []
  }
}

function saveEchoPost(post) {
  localStorage.setItem(
    'shadow_profile_echo_posts',
    JSON.stringify([
      post,
      ...getEchoPosts(),
    ])
  )
}

function getId() {
  if (
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
}

function getPostLink(post) {
  const username = String(
    post?.user?.username || ''
  ).trim()
  const path = username
    ? `/profile?username=${encodeURIComponent(username)}`
    : '/profile'

  return `${window.location.origin}${path}#reader-post-${post?.id || ''}`
}

function ShareCircle({
  icon,
  iconNode,
  label,
  bg = 'bg-white',
  color = 'text-[#111827]',
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[82px] shrink-0 text-center active:scale-95"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 ${bg} ${color}`}
      >
        {iconNode || (
  <i className={`${icon} text-[22px]`} />
)}
      </div>
      <div className="mt-2 text-[12px] font-normal leading-4 text-[#111827]">
        {label}
      </div>
    </button>
  )
}

function ReaderCircle({
  reader,
  active,
  onClick,
}) {
  const name =
    reader?.name ||
    reader?.username ||
    'Reader'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[76px] shrink-0 text-center active:scale-95"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#e5e7eb] text-[17px] font-semibold text-white ring-2 ${
          active
            ? 'ring-[#8b5cf6]'
            : 'ring-transparent'
        }`}
      >
        {reader?.avatar_url ? (
          <img
            src={reader.avatar_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          name.slice(0, 1).toUpperCase()
        )}
      </div>
      <div
        className={`mt-2 line-clamp-2 text-[11.5px] font-semibold leading-4 ${
          active
            ? 'text-[#6d28d9]'
            : 'text-[#667085]'
        }`}
      >
        {name}
      </div>
    </button>
  )
}

function ChoiceSheet({
  title,
  subtitle,
  options,
  value,
  onChoose,
  onBack,
}) {
  return (
    <div className="fixed inset-0 z-[200010] bg-white text-[#111827]">
      <div className="flex items-center gap-3 border-b border-[#eceaf2] px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f5f3fa]"
        >
          <i className="fa-solid fa-chevron-left text-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-[20px] font-normal leading-7">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[12px] font-normal leading-5 text-[#8d94a1]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-3">
        {options.map((item) => {
          const active = item.key === value

          return (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                onChoose(item.key)
              }
              className="flex w-full items-center gap-4 rounded-[20px] px-2 py-4 text-left active:bg-[#f5f3fa]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                <i
                  className={`${item.icon} text-[18px]`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-normal text-[#111827]">
                  {item.title}
                </div>
                <div className="mt-0.5 text-[12.5px] font-normal leading-5 text-[#8d94a1]">
                  {item.subtitle}
                </div>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active
                    ? 'border-[#111827] bg-[#111827]'
                    : 'border-[#98a2b3]'
                }`}
              >
                {active ? (
                  <i className="fa-solid fa-check text-[10px] text-white" />
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ReaderPostEchoShareSheet({
  open,
  post,
  onClose,
  onEchoed,
}) {
  const sheetRef = useRef(null)
  const dragStartYRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const draggingRef = useRef(false)

  const [postText, setPostText] =
    useState('')
  const [message, setMessage] =
    useState('')
  const [destination, setDestination] =
    useState('feed')
  const [audience, setAudience] =
    useState('public')
  const [activePanel, setActivePanel] =
    useState('')
  const [selectedReaders, setSelectedReaders] =
    useState([])
  const [sending, setSending] =
    useState(false)
  const [followers, setFollowers] =
    useState([])
  const [followersLoading, setFollowersLoading] =
    useState(false)
  const [followersError, setFollowersError] =
    useState('')
  const [dragOffset, setDragOffset] =
    useState(0)
  const user = useMemo(
    () => getStoredUser(),
    []
  )
  const postLink = useMemo(
    () => getPostLink(post),
    [post]
  )

  useEffect(() => {
    if (!open) return undefined

    document.body.style.overflow = 'hidden'
    dragOffsetRef.current = 0
    setDragOffset(0)

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const token = getReaderToken()
    const username = String(
      user?.username || ''
    ).trim()

    if (!token || !username) {
      setFollowers([])
      setFollowersError('')
      return undefined
    }

    let ignore = false

    async function loadFollowers() {
      try {
        setFollowersLoading(true)
        setFollowersError('')

        const response = await fetch(
          `${API_BASE_URL}/api/users/${encodeURIComponent(username)}/followers?page=1&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
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
              'Failed to load followers'
          )
        }

        if (!ignore) {
          setFollowers(
            Array.isArray(data.users)
              ? data.users
              : []
          )
        }
      } catch (error) {
        if (!ignore) {
          setFollowers([])
          setFollowersError(
            error.message ||
              'Failed to load followers.'
          )
        }
      } finally {
        if (!ignore) {
          setFollowersLoading(false)
        }
      }
    }

    loadFollowers()

    return () => {
      ignore = true
    }
  }, [open, user?.username])

  if (!open) return null

  const displayName =
    user?.name ||
    user?.username ||
    'Reader'
  const avatarLetter = displayName
    .slice(0, 1)
    .toUpperCase()
  const sourceName =
    post?.user?.name ||
    post?.user?.username ||
    'Reader'
  const destinationItem =
    DESTINATIONS.find(
      (item) => item.key === destination
    ) || DESTINATIONS[0]
  const audienceItem =
    AUDIENCES.find(
      (item) => item.key === audience
    ) || AUDIENCES[0]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        postLink
      )
      setMessage('Link copied.')
    } catch {
      setMessage(postLink)
    }
  }

  const handleTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        postLink
      )}&text=${encodeURIComponent(
        `${sourceName}'s reader post`
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postLink
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleReaderToggle = (readerId) => {
    const value = String(readerId || '')

    if (!value) return

    setSelectedReaders((current) =>
      current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value]
    )
  }

  const handleTagClick = () => {
    setMessage(
      'Tag reader is selected for the next update.'
    )
  }

  const startDrag = (event) => {
    draggingRef.current = true
    dragStartYRef.current = event.clientY
    dragOffsetRef.current = 0
    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextOffset = Math.max(
      0,
      event.clientY -
        dragStartYRef.current
    )

    dragOffsetRef.current = nextOffset
    setDragOffset(nextOffset)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    if (dragOffsetRef.current > 80) {
      onClose()
      return
    }

    dragOffsetRef.current = 0
    setDragOffset(0)
  }

  const handleEchoNow = async () => {
    if (!post?.id) {
      setMessage(
        'Reader post is not ready yet.'
      )
      return
    }

    const token = getReaderToken()

    if (!token) {
      setMessage(
        'Please log in before echoing.'
      )
      return
    }

    try {
      setSending(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(
          post.id
        )}/echoes`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            echo_text: postText.trim(),
            destination,
            audience,
            selected_reader_ids:
              selectedReaders,
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
            'Failed to echo reader post'
        )
      }

      const savedPost = {
        id: data.echo?.id || getId(),
        type: 'reader_post_echo',
        reader_post_id: post.id,
        source_user_id: post.user_id,
        source_user_name: sourceName,
        source_username:
          post?.user?.username || '',
        source_avatar_url:
          post?.user?.avatar_url || '',
        source_content:
          post?.content || '',
        story_title:
          `${sourceName}'s reader post`,
        story_author_name: sourceName,
        story_genre: 'Reader Post',
        story_cover_url:
          post?.user?.avatar_url || '',
        echo_text: postText.trim(),
        destination,
        destination_label:
          destinationItem.title,
        audience,
        audience_label:
          audienceItem.title,
        selected_readers:
          followers
            .filter((reader) =>
              selectedReaders.includes(
                String(reader.id)
              )
            )
            .map((reader) => ({
              id: reader.id,
              name:
                reader.name ||
                reader.username ||
                'Reader',
              username:
                reader.username || '',
              avatar_url:
                reader.avatar_url || '',
            })),
        user_name: displayName,
        created_at:
          data.echo?.created_at ||
          new Date().toISOString(),
      }

      saveEchoPost(savedPost)
      setPostText('')
      setMessage('')
      setSelectedReaders([])
      onEchoed?.(
        data.echo || savedPost,
        Number(data.echo_count || 0)
      )
      onClose()
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to echo reader post.'
      )
    } finally {
      setSending(false)
    }
  }

  return createPortal(
  <div className="fixed inset-0 z-[200000] flex items-end justify-center">
    <button
      type="button"
      aria-label="Close echo share"
      onClick={onClose}
      className="absolute inset-0 bg-black/60"
    />

      <section
        ref={sheetRef}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-[#f5f3fa] px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 shadow-2xl md:mb-5 md:max-w-[520px] md:rounded-[30px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: draggingRef.current
            ? 'none'
            : 'transform 220ms ease',
        }}
      >
        <div
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="sticky top-0 z-20 mx-auto mb-4 flex h-5 w-20 cursor-grab items-start justify-center bg-[#f5f3fa]"
          style={{ touchAction: 'none' }}
        >
          <div className="h-1.5 w-14 rounded-full bg-[#9ca3af]" />
        </div>

        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[18px] font-semibold text-white">
              {user?.avatarUrl ||
              user?.avatar_url ? (
                <img
                  src={
                    user.avatarUrl ||
                    user.avatar_url
                  }
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-semibold text-[#111827]">
                {displayName}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      'destination'
                    )
                  }
                  className="flex h-8 items-center gap-2 rounded-full bg-[#eef0f4] px-3 text-[12px] font-normal text-[#111827] active:scale-95"
                >
                  <span>
                    {destinationItem.title}
                  </span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      'audience'
                    )
                  }
                  className="flex h-8 items-center gap-2 rounded-full bg-[#eef0f4] px-3 text-[12px] font-normal text-[#111827] active:scale-95"
                >
                  <i
                    className={`${audienceItem.icon} text-[12px]`}
                  />
                  <span>
                    {audienceItem.title}
                  </span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>
              </div>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(event) =>
              setPostText(
                event.target.value
              )
            }
            rows={2}
            maxLength={280}
            placeholder="Say something..."
            className="mt-3 w-full resize-none bg-transparent text-[14px] font-normal leading-6 text-[#111827] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
          />

          <div className="mt-3 rounded-[16px] bg-[#f7f7fa] px-3 py-3 ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[13px] font-semibold text-white">
                {post?.user?.avatar_url ? (
                  <img
                    src={
                      post.user.avatar_url
                    }
                    alt={sourceName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  sourceName
                    .slice(0, 1)
                    .toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-[13px] font-semibold text-[#111827]">
                  {sourceName}
                </div>
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap break-words text-[12px] font-normal leading-5 text-[#667085]">
                  {post?.content ||
                    'Reader post'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTagClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#667085] active:scale-95 active:bg-[#f2f3f5]"
            >
              <i className="fa-solid fa-user-tag text-[18px]" />
            </button>

            <button
              type="button"
              onClick={handleEchoNow}
              disabled={sending}
              className="h-9 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] px-5 text-[13px] font-normal text-white shadow-[0_6px_16px_rgba(139,92,246,0.24)] active:scale-95 disabled:opacity-60"
            >
              {sending
                ? 'Echoing...'
                : 'Echo now'}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-3 rounded-[16px] bg-white px-4 py-3 text-[12px] font-normal text-[#667085] ring-1 ring-black/5">
            {message}
          </div>
        ) : null}

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-normal uppercase tracking-[0.08em] text-[#98a2b3]">
            Readers
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {followersLoading ? (
              Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="w-[76px] shrink-0"
                  >
                    <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-[#e5e7eb]" />
                    <div className="mx-auto mt-2 h-3 w-12 animate-pulse rounded-full bg-[#e5e7eb]" />
                  </div>
                )
              )
            ) : followers.length ? (
              followers.map((reader) => (
                <ReaderCircle
                  key={reader.id}
                  reader={reader}
                  active={selectedReaders.includes(
                    String(reader.id)
                  )}
                  onClick={() =>
                    handleReaderToggle(
                      reader.id
                    )
                  }
                />
              ))
            ) : (
              <div className="py-3 text-[12px] font-normal text-[#98a2b3]">
                {followersError ||
                  'No followers yet.'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-normal uppercase tracking-[0.08em] text-[#98a2b3]">
            Share outside Shadow
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <ShareCircle
  label="Copy link"
  iconNode={
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[23px] w-[23px]"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 20.07l1.15-1.15" />
    </svg>
  }
  onClick={handleCopyLink}
/>
            <ShareCircle
              icon="fa-brands fa-telegram"
              label="Telegram"
              bg="bg-[#2aabee]"
              color="text-white"
              onClick={handleTelegram}
            />
            <ShareCircle
              icon="fa-brands fa-facebook-f"
              label="Facebook"
              bg="bg-[#1877f2]"
              color="text-white"
              onClick={handleFacebook}
            />
          </div>
        </div>
      </section>

      {activePanel === 'destination' ? (
        <ChoiceSheet
          title="Echo destination"
          subtitle="Choose where this echo should appear on Shadow."
          options={DESTINATIONS}
          value={destination}
          onBack={() =>
            setActivePanel('')
          }
          onChoose={(value) => {
            setDestination(value)
            setActivePanel('')
          }}
        />
      ) : null}

      {activePanel === 'audience' ? (
        <ChoiceSheet
          title="Who can view this echo?"
          subtitle="Choose who can see your echo on Shadow."
          options={AUDIENCES}
          value={audience}
          onBack={() =>
            setActivePanel('')
          }
          onChoose={(value) => {
            setAudience(value)
            setActivePanel('')
          }}
        />
      ) : null}
        </div>,
    document.body
  )
}

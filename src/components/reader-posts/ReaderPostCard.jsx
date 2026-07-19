import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderPostOptionsSheet, {
  ReaderPostDeleteConfirmSheet,
} from './ReaderPostOptionsSheet'
import ReaderPostCommentsModal from './ReaderPostCommentsModal'
import ReaderPostEchoShareSheet from './ReaderPostEchoShareSheet'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const MAX_POST_LENGTH = 10000

const READER_POST_REACTIONS = [
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

function formatPostTime(value) {
  const timestamp =
    new Date(value || 0).getTime()

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
      year:
        new Date().getFullYear() !==
        new Date(timestamp).getFullYear()
          ? 'numeric'
          : undefined,
    }
  ).format(new Date(timestamp))
}

function getVisibilityIcon(value) {
  if (
    value === 'only_me' ||
    value === 'private'
  ) {
    return 'fa-solid fa-lock'
  }

  if (value === 'friends') {
    return 'fa-solid fa-user-group'
  }

  if (value === 'followers') {
    return 'fa-solid fa-users'
  }

  return 'fa-solid fa-earth-americas'
}

function ReaderAvatar({ user }) {
  const name = user?.name || 'Reader'

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-semibold text-white">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  )
}

export default function ReaderPostCard({
  post,
  onUpdated,
  onDeleted,
  onHidden,
}) {
  const navigate = useNavigate()
  const reactionPressTimerRef =
    useRef(null)
  const reactionMessageTimerRef =
    useRef(null)
  const longPressOpenedRef =
    useRef(false)
  const reactionPickerRef =
    useRef(null)

  const storedUser = useMemo(
    () => getStoredUser(),
    []
  )

  const [menuOpen, setMenuOpen] =
    useState(false)
  const [deleteOpen, setDeleteOpen] =
    useState(false)
  const [editorOpen, setEditorOpen] =
    useState(false)
  const [commentOpen, setCommentOpen] =
    useState(false)
  const [echoOpen, setEchoOpen] =
    useState(false)
  const [content, setContent] =
    useState(post?.content || '')
  const [saving, setSaving] =
    useState(false)
  const [deleting, setDeleting] =
    useState(false)
  const [message, setMessage] =
    useState('')
  const [expanded, setExpanded] =
    useState(false)
  const [
    reactionPickerOpen,
    setReactionPickerOpen,
  ] = useState(false)
  const [
    reactionBusy,
    setReactionBusy,
  ] = useState(false)
  const [
    reactionType,
    setReactionType,
  ] = useState(
    post?.my_reaction || null
  )
  const [
    reactionCount,
    setReactionCount,
  ] = useState(
    Number(post?.like_count || 0)
  )
  const [
    reactionMessage,
    setReactionMessage,
  ] = useState('')
  const [commentCount, setCommentCount] =
    useState(Number(post?.comment_count || 0))
  const [echoCount, setEchoCount] =
    useState(Number(post?.echo_count || 0))

  const user = post?.user || {}
  const isOwner =
    Boolean(post?.is_owner) ||
    String(storedUser?.id || '') ===
      String(post?.user_id || '')

  const postText = String(
    post?.content || ''
  )
  const canCollapse =
    postText.length > 520 ||
    postText.split('\n').length > 8

  const activeReaction =
    READER_POST_REACTIONS.find(
      (reaction) =>
        reaction.type === reactionType
    ) || null

  useEffect(() => {
    setReactionCount(
      Number(post?.like_count || 0)
    )
  }, [post?.like_count])

  useEffect(() => {
    setReactionType(
      post?.my_reaction || null
    )
  }, [post?.my_reaction])

  useEffect(() => {
    setCommentCount(
      Number(post?.comment_count || 0)
    )
  }, [post?.comment_count])

  useEffect(() => {
    setEchoCount(
      Number(post?.echo_count || 0)
    )
  }, [post?.echo_count])

  useEffect(() => {
    if (!reactionPickerOpen) {
      return undefined
    }

    function closeReactionPicker(event) {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(
          event.target
        )
      ) {
        setReactionPickerOpen(false)
      }
    }

    document.addEventListener(
      'pointerdown',
      closeReactionPicker
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        closeReactionPicker
      )
    }
  }, [reactionPickerOpen])

  useEffect(() => {
    let ignore = false
    const token = getAuthToken()

    if (!post?.id || !token) {
      return undefined
    }

    async function loadReactionStatus() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(post.id)}/reaction`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: 'no-store',
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

        setReactionType(
          data.my_reaction || null
        )
        setReactionCount(
          Number(data.like_count || 0)
        )
      } catch {
        return
      }
    }

    loadReactionStatus()

    return () => {
      ignore = true
    }
  }, [post?.id])

  useEffect(() => {
    return () => {
      if (
        reactionPressTimerRef.current
      ) {
        window.clearTimeout(
          reactionPressTimerRef.current
        )
      }

      if (
        reactionMessageTimerRef.current
      ) {
        window.clearTimeout(
          reactionMessageTimerRef.current
        )
      }
    }
  }, [])

  function showReactionMessage(text) {
    setReactionMessage(text)

    if (
      reactionMessageTimerRef.current
    ) {
      window.clearTimeout(
        reactionMessageTimerRef.current
      )
    }

    reactionMessageTimerRef.current =
      window.setTimeout(() => {
        setReactionMessage('')
      }, 1800)
  }

  async function updateReaction(
    nextReactionType
  ) {
    if (!post?.id || reactionBusy) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      showReactionMessage(
        'Please login first.'
      )
      return
    }

    try {
      setReactionBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(post.id)}/reaction`,
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
              nextReactionType,
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

      const nextType = data.reacted
        ? data.reaction_type ||
          nextReactionType
        : null
      const nextCount = Number(
        data.like_count || 0
      )

      setReactionType(nextType)
      setReactionCount(nextCount)
      setReactionPickerOpen(false)

      onUpdated?.({
        ...post,
        like_count: nextCount,
        my_reaction: nextType,
        reaction_summary:
          Array.isArray(
            data.reaction_summary
          )
            ? data.reaction_summary
            : [],
      })
    } catch (error) {
      showReactionMessage(
        error.message ||
          'Failed to update reaction.'
      )
    } finally {
      setReactionBusy(false)
    }
  }

  function startReactionPress() {
    if (reactionBusy) return

    longPressOpenedRef.current = false

    reactionPressTimerRef.current =
      window.setTimeout(() => {
        longPressOpenedRef.current =
          true
        reactionPressTimerRef.current =
          null
        setReactionPickerOpen(true)
      }, 420)
  }

  function endReactionPress() {
    if (
      reactionPressTimerRef.current
    ) {
      window.clearTimeout(
        reactionPressTimerRef.current
      )
      reactionPressTimerRef.current =
        null
    }

    if (longPressOpenedRef.current) {
      longPressOpenedRef.current = false
      return
    }

    updateReaction('love')
  }

  function cancelReactionPress() {
    if (
      reactionPressTimerRef.current
    ) {
      window.clearTimeout(
        reactionPressTimerRef.current
      )
      reactionPressTimerRef.current =
        null
    }

    longPressOpenedRef.current = false
  }

  async function updatePost() {
    const text = content.trim()

    if (!text) {
      setMessage(
        'Post text is required.'
      )
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(post.id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            content: text,
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
            'Failed to update post'
        )
      }

      if (data.post) {
        onUpdated?.(data.post)
      }

      setEditorOpen(false)
      setMenuOpen(false)
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to update post'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deletePost() {
    try {
      setDeleting(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me/${encodeURIComponent(post.id)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${getAuthToken()}`,
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
            'Failed to delete post'
        )
      }

      onDeleted?.(post.id)
      setDeleteOpen(false)
    } catch (error) {
      window.alert(
        error.message ||
          'Failed to delete post'
      )
    } finally {
      setDeleting(false)
      setMenuOpen(false)
    }
  }

  function openEditor() {
    setContent(post.content || '')
    setMessage('')
    setMenuOpen(false)
    setEditorOpen(true)
  }

  function hidePost() {
    onHidden?.(post.id)
    setMenuOpen(false)
  }

  function viewReaderProfile() {
    const username = String(
      user?.username || ''
    ).trim()

    setMenuOpen(false)

    if (username) {
      navigate(
        `/profile?username=${encodeURIComponent(username)}`
      )
    }
  }

  return (
    <>
      <article
        id={`reader-post-${post.id}`}
        className="bg-white sm:rounded-[12px]"
      >
        <div className="flex items-start gap-2 px-4 pb-3 pt-4">
          <button type="button" onClick={viewReaderProfile} className="shrink-0 rounded-full active:opacity-70">
  <ReaderAvatar user={user} />
</button>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <button type="button" onClick={viewReaderProfile} className="block max-w-full truncate text-left text-[14px] font-semibold text-[#111827] active:opacity-70">
  {user.name || 'Reader'}
</button>
                </div>

                <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400">
                  <span>
                    {formatPostTime(
                      post.created_at
                    )}
                  </span>

                  {post.is_edited ? (
                    <>
                      <span>·</span>
                      <span>Edited</span>
                    </>
                  ) : null}

                  <span>·</span>

                  <i
                    className={`${getVisibilityIcon(post.visibility)} text-[10px]`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(true)
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
                aria-label="Post options"
              >
                <i className="fa-solid fa-ellipsis text-[14px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <p
            className="whitespace-pre-wrap break-words text-[14px] font-normal leading-6 text-[#111827]"
            style={
              !expanded && canCollapse
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 8,
                    WebkitBoxOrient:
                      'vertical',
                    overflow: 'hidden',
                  }
                : undefined
            }
          >
            {post.content}
          </p>

          {canCollapse ? (
            <button
              type="button"
              onClick={() =>
                setExpanded(
                  (current) => !current
                )
              }
              className="mt-1 text-[13px] font-semibold text-[#475569] active:opacity-70"
            >
              {expanded
                ? 'See less'
                : 'See more'}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-5 border-t border-gray-100 px-4 py-3 text-[11px] font-normal text-gray-500">
          <div
            ref={reactionPickerRef}
            className="relative"
          >
            {reactionPickerOpen ? (
              <div className="absolute bottom-8 left-0 z-40 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-2xl ring-1 ring-black/10">
                {READER_POST_REACTIONS.map(
                  (reaction) => (
                    <button
                      key={
                        reaction.type
                      }
                      type="button"
                      disabled={
                        reactionBusy
                      }
                      onClick={() =>
                        updateReaction(
                          reaction.type
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90 disabled:opacity-60"
                      aria-label={
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
            ) : null}

            <button
              type="button"
              disabled={reactionBusy}
              onPointerDown={
                startReactionPress
              }
              onPointerUp={
                endReactionPress
              }
              onPointerLeave={
                cancelReactionPress
              }
              onPointerCancel={() => {
                cancelReactionPress()
                setReactionPickerOpen(false)
              }}
              onContextMenu={(event) =>
                event.preventDefault()
              }
              className="inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60"
              style={{
                color:
                  activeReaction?.text ||
                  undefined,
              }}
              aria-label={
                activeReaction
                  ? activeReaction.label
                  : 'React'
              }
            >
              {activeReaction ? (
                <img
                  src={
                    activeReaction.src
                  }
                  alt=""
                  aria-hidden="true"
                  className="h-[17px] w-[17px] object-contain"
                />
              ) : (
                <i className="fa-regular fa-heart text-[15px]" />
              )}

              {formatCompactNumber(
                reactionCount
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCommentOpen(true)}
            className="inline-flex items-center gap-1.5 active:scale-95"
            aria-label="Open comments"
          >
            <i className="fa-regular fa-comment text-[15px]" />
            {formatCompactNumber(commentCount)}
          </button>

          <button
            type="button"
            onClick={() => setEchoOpen(true)}
            className="inline-flex items-center gap-1.5 active:scale-95"
            aria-label="Echo this reader post"
          >
            <img
              src="/assets/Icons/echo.svg"
              alt=""
              aria-hidden="true"
              className="h-[15px] w-[15px] object-contain opacity-70"
            />
            {formatCompactNumber(echoCount)}
          </button>
        </div>
      </article>

      {reactionMessage ? (
        <div className="fixed left-1/2 top-20 z-[300] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
          {reactionMessage}
        </div>
      ) : null}

      <ReaderPostCommentsModal
        open={commentOpen}
        postId={post.id}
        postOwnerId={post.user_id}
        commentsPermission={
          post.comments_permission
        }
        reactionCount={reactionCount}
        commentCount={commentCount}
        echoCount={echoCount}
        onClose={() => setCommentOpen(false)}
        onTotalChange={(nextTotal) => {
          setCommentCount(nextTotal)
          onUpdated?.({
            ...post,
            comment_count: nextTotal,
          })
        }}
      />

      <ReaderPostEchoShareSheet
        open={echoOpen}
        post={post}
        onClose={() => setEchoOpen(false)}
        onEchoed={(nextEcho, nextTotal) => {
          const total = Number(
            nextTotal ??
              (nextEcho
                ? echoCount + 1
                : echoCount)
          )

          setEchoCount(total)
          onUpdated?.({
            ...post,
            echo_count: total,
          })
        }}
      />

      <ReaderPostOptionsSheet
        open={menuOpen}
        post={post}
        isOwner={isOwner}
        onClose={() =>
          setMenuOpen(false)
        }
        onEdit={openEditor}
        onDelete={() => {
          setMenuOpen(false)
          setDeleteOpen(true)
        }}
        onHide={hidePost}
        onViewProfile={
          viewReaderProfile
        }
        onMessage={(text) =>
          window.alert(text)
        }
      />

      <ReaderPostDeleteConfirmSheet
        open={deleteOpen}
        deleting={deleting}
        onCancel={() =>
          setDeleteOpen(false)
        }
        onConfirm={deletePost}
      />

      {editorOpen ? (
        <div className="fixed inset-0 z-[200000] flex items-end justify-center bg-black/45 sm:items-center sm:p-4">
          <button
            type="button"
            onClick={() => {
              if (!saving) {
                setEditorOpen(false)
              }
            }}
            className="absolute inset-0"
            aria-label="Close editor"
          />

          <section className="relative w-full max-w-[520px] rounded-t-[24px] bg-white p-4 shadow-2xl sm:rounded-[24px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[17px] font-semibold text-[#111827]">
                Edit post
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditorOpen(false)
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center text-[#111827] disabled:opacity-50"
              >
                <i className="fa-solid fa-xmark text-[18px]" />
              </button>
            </div>

            <textarea
              autoFocus
              value={content}
              maxLength={
                MAX_POST_LENGTH
              }
              onChange={(event) =>
                setContent(
                  event.target.value.slice(
                    0,
                    MAX_POST_LENGTH
                  )
                )
              }
              className="min-h-[180px] w-full resize-none rounded-[16px] border border-gray-200 px-4 py-3 text-[15px] font-normal leading-6 text-[#111827] outline-none focus:border-[#111827]"
            />

            <div className="mt-2 text-right text-[11px] font-normal text-gray-400">
              {content.length.toLocaleString()}{' '}
              /{' '}
              {MAX_POST_LENGTH.toLocaleString()}
            </div>

            {message ? (
              <div className="mt-3 rounded-[12px] bg-red-50 px-3 py-2 text-[12px] font-normal text-red-600">
                {message}
              </div>
            ) : null}

            <button
              type="button"
              onClick={updatePost}
              disabled={
                saving ||
                !content.trim()
              }
              className="mt-4 h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white disabled:bg-gray-300"
            >
              {saving
                ? 'Saving...'
                : 'Save changes'}
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}

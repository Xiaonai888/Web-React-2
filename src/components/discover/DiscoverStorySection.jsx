import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useNavigate,
} from 'react-router-dom'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../../utils/homeDataCache'
import ReactionPicker from '../social/reactions/ReactionPicker'
import useReactionInteraction from '../social/reactions/useReactionInteraction'
import {
  REACTIONS,
  getReactionMeta,
} from '../social/reactions/reactionConfig'

const API_BASE_URL =
  window.location.hostname ===
    'localhost' ||
  window.location.hostname ===
    '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DISCOVER_STORY_CACHE_MAX_AGE_MS =
  5 * 60 * 1000

const discoverStoryInflightRequests =
  new Map()

function getDiscoverStoryCacheScope(token) {
  if (!token) return 'anon'

  let hash = 2166136261

  for (
    let index = 0;
    index < token.length;
    index += 1
  ) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(hash >>> 0).toString(36)}`
}

function getDiscoverStoryCacheKey(token) {
  return getHomeCacheKey({
    section: 'discover-story-feed',
    scope:
      getDiscoverStoryCacheScope(token),
    params: {
      limit: 20,
      schema: 1,
    },
  })
}

function removeExpiredStoryGroups(
  groups
) {
  const now = Date.now()

  return (Array.isArray(groups)
    ? groups
    : []
  )
    .map((group) => {
      const stories = (
        Array.isArray(group?.stories)
          ? group.stories
          : []
      ).filter((story) => {
        const expiresAt = new Date(
          story?.expires_at || 0
        ).getTime()

        return (
          !expiresAt ||
          !Number.isFinite(expiresAt) ||
          expiresAt > now
        )
      })

      if (!stories.length) {
        return null
      }

      return {
        ...group,
        stories,
        has_unseen: stories.some(
          (story) => !story.has_viewed
        ),
      }
    })
    .filter(Boolean)
}

async function runDiscoverStoryRequest(
  key,
  request
) {
  if (
    discoverStoryInflightRequests.has(key)
  ) {
    return discoverStoryInflightRequests.get(
      key
    )
  }

  const promise =
    Promise.resolve().then(request)

  discoverStoryInflightRequests.set(
    key,
    promise
  )

  try {
    return await promise
  } finally {
    if (
      discoverStoryInflightRequests.get(
        key
      ) === promise
    ) {
      discoverStoryInflightRequests.delete(
        key
      )
    }
  }
}

const CREATE_STORY_ITEM = {
  id: 'create',
  name: 'Create story',
  label: 'Create story',
  avatar: '+',
  type: 'create',
  image:
    'linear-gradient(160deg, #1f2937 0%, #93c5fd 100%)',
}

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

function getInitial(value) {
  return String(value || 'S')
    .trim()
    .slice(0, 1)
    .toUpperCase()
}

function formatStoryTime(value) {
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

  if (minutes < 1) return 'Just now'
  if (minutes < 60) {
    return `${minutes}m`
  }
  if (hours < 24) {
    return `${hours}h`
  }

  return 'Today'
}

function getLatestStory(group) {
  return [...(group?.stories || [])]
    .sort(
      (left, right) =>
        new Date(
          right.created_at || 0
        ).getTime() -
        new Date(
          left.created_at || 0
        ).getTime()
    )[0] || null
}

function StaticStoryCard({
  item,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[168px] w-[102px] shrink-0 overflow-hidden rounded-[8px] bg-white text-left transition-transform active:scale-[0.98] sm:h-[170px] sm:w-[104px]"
      aria-label={item.name}
    >
      <div
        className="absolute inset-0"
        style={{
          background: item.image,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/65" />

      <div className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-[14px] font-black text-white">
        {item.avatar}
      </div>

      <div className="absolute left-1/2 top-[63px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white bg-[#1677ff] text-[24px] font-black leading-none text-white sm:top-[64px]">
        +
      </div>

      <div className="absolute bottom-3 left-3 right-3">
        <div className="line-clamp-2 text-[13px] font-normal leading-[16px] text-white drop-shadow">
          {item.label}
        </div>
      </div>
    </button>
  )
}

function StoryCard({
  group,
  onClick,
}) {
  const creator =
    group.creator || {}
  const latestStory =
    getLatestStory(group)
  const isVideo =
    latestStory?.media_type ===
    'video'

  const ringClass =
    group.has_unseen
      ? 'ring-2 ring-inset ring-[#8b5cf6]'
      : 'ring-1 ring-inset ring-[#cbd5e1]'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[168px] w-[102px] shrink-0 overflow-hidden rounded-[8px] bg-[#111827] text-left transition-transform active:scale-[0.98] sm:h-[170px] sm:w-[104px] ${ringClass}`}
      aria-label={`View ${creator.name || 'creator'} story`}
    >
      {latestStory?.media_url ? (
        isVideo ? (
          <video
            src={
              latestStory.media_url
            }
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={
              latestStory.media_url
            }
            alt={latestStory?.alt_text || ''}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#db2777]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/80" />

      <div className="absolute left-2 top-2 h-9 w-9 overflow-hidden rounded-full border-[3px] border-white bg-[#111827]">
        {creator.avatar_url ? (
          <img
            src={creator.avatar_url}
            alt={creator.name || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[13px] font-black text-white">
            {getInitial(
              creator.name
            )}
          </span>
        )}
      </div>

      {creator.type === 'author' ? (
        <div className="absolute right-2 top-3 rounded-full bg-[#f6b800] px-2 py-0.5 text-[8px] font-black text-[#111827] shadow-sm">
          AUTHOR
        </div>
      ) : null}

      {group.stories?.length > 1 ? (
        <div className="absolute right-2 top-8 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-black text-white backdrop-blur">
          {group.stories.length}
        </div>
      ) : null}

      {isVideo ? (
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
          <i className="fa-solid fa-play ml-0.5 text-[13px]" />
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 right-3">
        <div className="line-clamp-2 text-[13px] font-normal leading-[16px] text-white drop-shadow">
          {group.is_owner
            ? 'Your story'
            : creator.name ||
              'Story'}
        </div>

        <div className="mt-1 truncate text-[10px] font-normal text-white/75">
          {formatStoryTime(
            latestStory?.created_at
          )}
        </div>
      </div>
    </button>
  )
}

function ViewerAvatar({ creator }) {
  return (
    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/80 bg-[#111827]">
      {creator?.avatar_url ? (
        <img
          src={creator.avatar_url}
          alt={creator.name || ''}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[13px] font-black text-white">
          {getInitial(
            creator?.name
          )}
        </span>
      )}
    </div>
  )
}

function StoryReactionIcon({
  reaction,
  reactionType,
  count,
  busy,
  onReact,
}) {
  const anchorRef = useRef(null)
  const interaction = useReactionInteraction({
    busy,
    onReact,
    defaultReactionType: reaction.type,
  })

  return (
    <div className="flex min-w-0 flex-1 items-center justify-center">
      <ReactionPicker
        anchorRef={anchorRef}
        open={interaction.reactionPickerOpen}
        activeType={reactionType || ''}
        previewType={interaction.previewReactionType}
        isSliding={interaction.isSlidingReaction}
        busy={busy}
        onSelect={interaction.selectReaction}
        onClose={interaction.closeReactionPicker}
        className="!h-[68px] !w-[min(440px,calc(100vw-16px))] !max-w-[calc(100vw-16px)] !gap-[1px] !bg-[#080808] !px-[5px] [&>div:last-child]:!hidden"
      />

      <button
        ref={anchorRef}
        type="button"
        disabled={busy}
        aria-label={`${reaction.label}, ${count} reactions`}
        aria-pressed={reactionType === reaction.type}
        onPointerDown={(event) => {
          event.stopPropagation()
          interaction.startReactionPress(event)
        }}
        onPointerUp={(event) => {
          event.stopPropagation()
          interaction.endReactionPress()
        }}
        onPointerLeave={interaction.cancelReactionPress}
        onPointerCancel={(event) => {
          event.stopPropagation()
          interaction.cancelReactionPress()
        }}
        onContextMenu={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          event.stopPropagation()
          interaction.quickReact()
        }}
        className={`flex min-w-0 flex-1 touch-none items-center justify-center rounded-full py-1 transition active:scale-95 disabled:opacity-50 ${
          reactionType === reaction.type
            ? 'bg-white/20 ring-1 ring-white/55'
            : 'hover:bg-white/10'
        }`}
      >
        <img
          src={reaction.src}
          alt=""
          draggable="false"
          className="h-[clamp(37px,11vw,54px)] w-[clamp(37px,11vw,54px)] select-none object-contain"
        />
      </button>
    </div>
  )
}

function OwnerStoryMenu({
  open,
  isAuthor,
  onClose,
  onCopyLink,
  onDelete,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200090]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close story options"
      />

      <section className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[520px] rounded-t-[24px] bg-white px-3 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#9ca3af]" />

        {isAuthor ? (
          <button
            type="button"
            disabled
            className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[#111827] opacity-55"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4cc] text-[#a36b00]">
              <i className="fa-solid fa-bolt text-[14px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">
                Boost Story
              </span>
              <span className="block text-[10px] text-[#667085]">
                Coming soon
              </span>
            </span>
          </button>
        ) : null}

        <button
          type="button"
          disabled
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[#111827] opacity-55"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f4f7] text-[#344054]">
            <i className="fa-solid fa-lock text-[13px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold">
              Edit Story Privacy
            </span>
            <span className="block text-[10px] text-[#667085]">
              Coming soon
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onCopyLink}
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[#111827] active:bg-[#f2f4f7]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4ff] text-[#155eef]">
            <i className="fa-solid fa-link text-[13px]" />
          </span>
          <span className="text-[13px] font-semibold">
            Copy Story Link
          </span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[#d92d20] active:bg-[#fff1f1]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#d92d20]">
            <i className="fa-regular fa-trash-can text-[14px]" />
          </span>
          <span className="text-[13px] font-semibold">
            Delete Story
          </span>
        </button>
      </section>
    </div>
  )
}


function ViewerStoryMenu({
  open,
  onClose,
  onCopyLink,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200090]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close story options"
      />

      <section className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[520px] rounded-t-[24px] bg-white px-3 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#9ca3af]" />

        <button
          type="button"
          onClick={onCopyLink}
          className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-[#111827] active:bg-[#f2f4f7]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4ff] text-[#155eef]">
            <i className="fa-solid fa-link text-[13px]" />
          </span>
          <span className="text-[13px] font-semibold">
            Copy Story Link
          </span>
        </button>
      </section>
    </div>
  )
}

function DeleteStorySheet({
  open,
  deleting,
  onClose,
  onDelete,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200100]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Cancel delete"
      />

      <section className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[520px] rounded-t-[24px] bg-white px-4 pb-[max(22px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#9ca3af]" />

        <h2 className="text-[16px] font-semibold text-[#111827]">
          Delete this story?
        </h2>

        <p className="mt-2 text-[12px] font-normal leading-5 text-[#667085]">
          This Story will be removed from Discover.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-11 rounded-full border border-[#d0d5dd] bg-white text-[13px] font-normal text-[#111827] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="h-11 rounded-full bg-[#e5484d] text-[13px] font-normal text-white disabled:opacity-60"
          >
            {deleting
              ? 'Deleting...'
              : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}

function StoryViewer({
  group,
  allGroups,
  onSelectGroup,
  onClose,
  onViewed,
  onDeleted,
}) {
  const navigate = useNavigate()
  const [storyIndex, setStoryIndex] =
    useState(0)
  const [progress, setProgress] =
    useState(0)
  const [trayOpen, setTrayOpen] =
    useState(false)
  const [
    ownerMenuOpen,
    setOwnerMenuOpen,
  ] = useState(false)
  const [
    viewerMenuOpen,
    setViewerMenuOpen,
  ] = useState(false)
  const [
    reactionType,
    setReactionType,
  ] = useState(null)
  const [
    reactionCounts,
    setReactionCounts,
  ] = useState({})
  const [
    reactionLoading,
    setReactionLoading,
  ] = useState(false)
  const [
    reactionSaving,
    setReactionSaving,
  ] = useState(false)
  const [
    reactionBurst,
    setReactionBurst,
  ] = useState(null)
  const [
    deleteSheetOpen,
    setDeleteSheetOpen,
  ] = useState(false)
  const [deleting, setDeleting] =
    useState(false)
  const videoRef = useRef(null)
  const swipeStartRef = useRef(null)

  const stories =
    group?.stories || []
  const story =
    stories[storyIndex] || null
  const creator =
    group?.creator || {}

  useEffect(() => {
    setStoryIndex(0)
    setProgress(0)
    setTrayOpen(false)
    setOwnerMenuOpen(false)
    setViewerMenuOpen(false)
  }, [group?.key])

  useEffect(() => {
    if (
      !story ||
      story.media_type === 'video'
    ) {
      setProgress(0)
      return undefined
    }

    const startedAt = Date.now()
    const duration = 5000

    const timer =
      window.setInterval(() => {
        const nextProgress = Math.min(
          100,
          (
            (Date.now() -
              startedAt) /
            duration
          ) * 100
        )

        setProgress(nextProgress)

        if (nextProgress >= 100) {
          window.clearInterval(timer)

          if (
            storyIndex <
            stories.length - 1
          ) {
            setStoryIndex(
              (current) =>
                current + 1
            )
            setProgress(0)
          } else {
            onClose()
          }
        }
      }, 80)

    return () =>
      window.clearInterval(timer)
  }, [
    story?.id,
    story?.media_type,
    storyIndex,
    stories.length,
    onClose,
  ])

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [])

  useEffect(() => {
    const token = getAuthToken()

    if (
      !story?.id ||
      story.has_viewed ||
      group.is_owner ||
      !token
    ) {
      return undefined
    }

    let active = true

    const timer =
      window.setTimeout(
        async () => {
          try {
            const endpoint =
              story.source_type ===
              'reader'
                ? `/api/reader-stories/${encodeURIComponent(story.id)}/view`
                : `/api/author-stories/${encodeURIComponent(story.id)}/view`

            const response =
              await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                  method: 'POST',
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              )

            const data =
              await response
                .json()
                .catch(() => ({}))

            if (
              !response.ok ||
              data.ok === false
            ) {
              return
            }

            if (active) {
              onViewed(
                story.id,
                story.source_type,
                Number(
                  data.view_count ||
                    story.view_count ||
                    0
                )
              )
            }
          } catch {}
        },
        500
      )

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [
    group.is_owner,
    onViewed,
    story?.has_viewed,
    story?.id,
    story?.source_type,
    story?.view_count,
  ])


  useEffect(() => {
    if (!reactionBurst) {
      return undefined
    }

    const timer = window.setTimeout(
      () => setReactionBurst(null),
      900
    )

    return () =>
      window.clearTimeout(timer)
  }, [reactionBurst])

  useEffect(() => {
    const token = getAuthToken()

    if (
      group.is_owner ||
      !story?.id ||
      !story?.source_type ||
      !token
    ) {
      setReactionType(null)
      setReactionCounts({})
      setReactionLoading(false)
      return undefined
    }

    let active = true

    async function loadReaction() {
      try {
        setReactionLoading(true)

        const response = await fetch(
          `${API_BASE_URL}/api/discover-stories/${encodeURIComponent(story.source_type)}/${encodeURIComponent(story.id)}/reaction`,
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
          !active ||
          !response.ok ||
          data.ok === false
        ) {
          return
        }

        setReactionType(
          data.reaction_type || null
        )
        setReactionCounts(
          data.counts || {}
        )
      } catch {
      } finally {
        if (active) {
          setReactionLoading(false)
        }
      }
    }

    loadReaction()

    return () => {
      active = false
    }
  }, [
    group.is_owner,
    story?.id,
    story?.source_type,
  ])

  function openCreatorPage(event) {
    event?.stopPropagation?.()

    const username = String(
      creator?.username || ''
    )
      .trim()
      .replace(/^@+/, '')

    if (!username) {
      return
    }

    onClose()

    if (creator.type === 'author') {
      navigate(
        `/author/page/${encodeURIComponent(username)}`
      )
      return
    }

    navigate(
      `/profile?username=${encodeURIComponent(username)}`
    )
  }

  function goNext() {
    if (
      storyIndex <
      stories.length - 1
    ) {
      setStoryIndex(
        (current) => current + 1
      )
      setProgress(0)
      return
    }

    onClose()
  }

  function goPrevious() {
    if (storyIndex > 0) {
      setStoryIndex(
        (current) => current - 1
      )
      setProgress(0)
      return
    }

    setProgress(0)

    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current
        .play()
        .catch(() => {})
    }
  }


  async function toggleReaction(
    nextReactionType
  ) {
    const token = getAuthToken()

    if (
      group.is_owner ||
      !story?.id ||
      !story?.source_type ||
      !token ||
      reactionSaving
    ) {
      return
    }

    try {
      setReactionSaving(true)

      const response = await fetch(
        `${API_BASE_URL}/api/discover-stories/${encodeURIComponent(story.source_type)}/${encodeURIComponent(story.id)}/reaction`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
            'Content-Type':
              'application/json',
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

      setReactionType(
        data.reaction_type || null
      )
      setReactionCounts(
        data.counts || {}
      )

      if (data.reaction_type) {
        const meta = getReactionMeta(
          data.reaction_type
        )

        if (meta?.src) {
          setReactionBurst({
            type: data.reaction_type,
            src: meta.src,
            key: `${Date.now()}-${data.reaction_type}`,
          })
        }
      }
    } catch (error) {
      window.alert(
        error.message ||
          'Failed to update reaction'
      )
    } finally {
      setReactionSaving(false)
    }
  }

  async function deleteStory() {
    if (
      !story?.id ||
      !['reader', 'author'].includes(
        story.source_type
      )
    ) {
      return
    }

    try {
      setDeleting(true)

      const endpoint =
        story.source_type === 'author'
          ? `/api/author-stories/me/${encodeURIComponent(story.id)}`
          : `/api/reader-stories/me/${encodeURIComponent(story.id)}`

      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
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
            'Failed to delete story'
        )
      }

      setDeleteSheetOpen(false)
      onDeleted(
        story.id,
        group.key
      )
    } catch (error) {
      window.alert(
        error.message ||
          'Failed to delete story'
      )
    } finally {
      setDeleting(false)
    }
  }

  async function copyStoryLink() {
    const url = new URL(
      '/discover',
      window.location.origin
    )

    url.searchParams.set(
      'story',
      String(story.id)
    )
    url.searchParams.set(
      'source',
      String(story.source_type || '')
    )

    try {
      await navigator.clipboard.writeText(
        url.toString()
      )
      setOwnerMenuOpen(false)
      setViewerMenuOpen(false)
      window.alert('Story link copied')
    } catch {
      window.prompt(
        'Copy Story Link',
        url.toString()
      )
    }
  }

  function handleSwipeStart(event) {
    if (
      !group.is_owner ||
      event.touches.length !== 1
    ) {
      return
    }

    const touch = event.touches[0]

    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  function handleSwipeEnd(event) {
    if (
      !group.is_owner ||
      !swipeStartRef.current
    ) {
      return
    }

    const touch =
      event.changedTouches?.[0]

    if (!touch) {
      swipeStartRef.current = null
      return
    }

    const deltaX =
      touch.clientX -
      swipeStartRef.current.x
    const deltaY =
      touch.clientY -
      swipeStartRef.current.y

    swipeStartRef.current = null

    if (
      deltaY >= 90 &&
      deltaY >
        Math.abs(deltaX) * 1.25
    ) {
      onClose()
    }
  }

  function handleSwipeCancel() {
    swipeStartRef.current = null
  }

  if (!story) return null

  return (
    <>
      <div className="fixed inset-0 z-[200000] bg-black">
        <div
          className="relative mx-auto h-[100dvh] w-full max-w-[520px] overflow-hidden bg-[#050712]"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          onTouchCancel={handleSwipeCancel}
        >
          {story.media_type ===
          'video' ? (
            <video
              key={story.id}
              ref={videoRef}
              src={story.media_url}
              autoPlay
              playsInline
              onTimeUpdate={(
                event
              ) => {
                const duration =
                  Number(
                    event
                      .currentTarget
                      .duration || 0
                  )
                const currentTime =
                  Number(
                    event
                      .currentTarget
                      .currentTime || 0
                  )

                if (duration > 0) {
                  setProgress(
                    Math.min(
                      100,
                      (
                        currentTime /
                        duration
                      ) * 100
                    )
                  )
                }
              }}
              onEnded={goNext}
              className="h-full w-full object-contain"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-3xl"
                style={{
                  backgroundImage:
                    `url(${story.media_url})`,
                }}
              />

              <img
                key={story.id}
                src={story.media_url}
                alt={story?.alt_text || ''}
                className="relative h-full w-full object-contain"
              />
            </>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75" />

          <div className="absolute inset-x-0 top-0 z-20 px-3 pt-[max(12px,env(safe-area-inset-top))]">
            <div className="flex gap-1">
              {stories.map(
                (item, index) => {
                  const width =
                    index <
                    storyIndex
                      ? 100
                      : index ===
                          storyIndex
                        ? progress
                        : 0

                  return (
                    <div
                      key={item.id}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                    >
                      <div
                        className="h-full rounded-full bg-white transition-[width] duration-75"
                        style={{
                          width:
                            `${width}%`,
                        }}
                      />
                    </div>
                  )
                }
              )}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={openCreatorPage}
                className="flex min-w-0 flex-1 items-center gap-3 text-left active:opacity-80"
                aria-label={`Open ${creator.name || 'creator'} page`}
              >
                <ViewerAvatar
                  creator={creator}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-[13px] font-black text-white">
                      {creator.name ||
                        'Story'}
                    </div>

                    {creator.type ===
                    'author' ? (
                      <span className="rounded-full bg-[#f6b800] px-2 py-0.5 text-[8px] font-black text-[#111827]">
                        AUTHOR
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-0.5 text-[10px] font-bold text-white/65">
                    {formatStoryTime(
                      story.created_at
                    )}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setTrayOpen(
                    (current) => !current
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur active:scale-95"
                aria-label={
                  trayOpen
                    ? 'Hide stories'
                    : 'Show stories'
                }
              >
                <i
                  className={`fa-solid ${
                    trayOpen
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down'
                  } text-[14px]`}
                />
              </button>

              {group.is_owner ? (
                <button
                  type="button"
                  onClick={() =>
                    setOwnerMenuOpen(true)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur active:scale-95"
                  aria-label="Story options"
                >
                  <i className="fa-solid fa-ellipsis text-[16px]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setViewerMenuOpen(true)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur active:scale-95"
                  aria-label="Story options"
                >
                  <i className="fa-solid fa-ellipsis text-[16px]" />
                </button>
              )}

              {!group.is_owner ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur active:scale-95"
                  aria-label="Close story"
                >
                  <i className="fa-solid fa-xmark text-[20px]" />
                </button>
              ) : null}
            </div>
          </div>

          {trayOpen ? (
            <div
              data-story-tray
              className="absolute inset-x-0 z-30 border-y border-white/10 bg-black/65 py-3 backdrop-blur-xl"
              style={{
                top:
                  'calc(max(12px, env(safe-area-inset-top)) + 64px)',
              }}
              onTouchStart={(event) =>
                event.stopPropagation()
              }
              onTouchEnd={(event) =>
                event.stopPropagation()
              }
            >
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
                {(allGroups || []).map(
                  (trayGroup) => {
                    const trayCreator =
                      trayGroup.creator || {}
                    const isActive =
                      trayGroup.key === group.key
                    const ringClass =
                      isActive
                        ? 'ring-2 ring-white'
                        : trayGroup.has_unseen
                          ? 'ring-2 ring-[#8b5cf6]'
                          : 'ring-1 ring-white/35'

                    return (
                      <button
                        key={trayGroup.key}
                        type="button"
                        onClick={() => {
                          setTrayOpen(false)
                          onSelectGroup(
                            trayGroup
                          )
                        }}
                        className="w-[58px] shrink-0 text-center active:scale-95"
                        aria-label={`Open ${trayCreator.name || 'Story'}`}
                      >
                        <div
                          className={`mx-auto h-11 w-11 overflow-hidden rounded-full bg-[#111827] ${ringClass}`}
                        >
                          {trayCreator.avatar_url ? (
                            <img
                              src={
                                trayCreator.avatar_url
                              }
                              alt={
                                trayCreator.name || ''
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[12px] font-black text-white">
                              {getInitial(
                                trayCreator.name
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 truncate text-[9px] font-bold text-white">
                          {trayGroup.is_owner
                            ? 'Your story'
                            : trayCreator.name ||
                              'Story'}
                        </div>

                        {trayCreator.type ===
                        'author' ? (
                          <div className="mx-auto mt-0.5 w-fit rounded-full bg-[#f6b800] px-1.5 py-0.5 text-[6px] font-black text-[#111827]">
                            AUTHOR
                          </div>
                        ) : null}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={goPrevious}
            className="absolute bottom-24 left-0 top-24 z-10 w-1/2"
            aria-label="Previous story"
          />

          <button
            type="button"
            onClick={goNext}
            className="absolute bottom-24 right-0 top-24 z-10 w-1/2"
            aria-label="Next story"
          />

          {group.is_owner ? (
            <div
              className={`absolute inset-x-5 z-20 ${
                story.text_overlay || story.caption || story.mention_username || story.link_url
  ? 'bottom-[164px]'
  : 'bottom-[max(32px,env(safe-area-inset-bottom))]'
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 text-[12px] font-black text-white backdrop-blur-xl">
                <i className="fa-solid fa-eye text-[11px]" />
                {Number(
                  story.view_count || 0
                )}{' '}
                {Number(
                  story.view_count || 0
                ) === 1
                  ? 'view'
                  : 'views'}
              </div>
            </div>
          ) : null}


          {!group.is_owner ? (
            <>
              <style>{`
                @keyframes storyReactionBurstA {
                  0% { opacity: 0; transform: translate3d(0, 12px, 0) scale(.72) rotate(-6deg); }
                  18% { opacity: .95; }
                  100% { opacity: 0; transform: translate3d(-34px, -92px, 0) scale(1.08) rotate(-14deg); }
                }
                @keyframes storyReactionBurstB {
                  0% { opacity: 0; transform: translate3d(0, 14px, 0) scale(.68) rotate(5deg); }
                  22% { opacity: .9; }
                  100% { opacity: 0; transform: translate3d(8px, -108px, 0) scale(.98) rotate(10deg); }
                }
                @keyframes storyReactionBurstC {
                  0% { opacity: 0; transform: translate3d(0, 10px, 0) scale(.7) rotate(8deg); }
                  20% { opacity: .88; }
                  100% { opacity: 0; transform: translate3d(38px, -82px, 0) scale(.92) rotate(16deg); }
                }
              `}</style>

              {reactionBurst ? (
                <div
                  key={reactionBurst.key}
                  className="pointer-events-none absolute bottom-[74px] left-1/2 z-30 h-[120px] w-[170px] -translate-x-1/2"
                  aria-hidden="true"
                >
                  <img
                    src={reactionBurst.src}
                    alt=""
                    className="absolute bottom-0 left-[58px] h-10 w-10 object-contain"
                    style={{
                      animation:
                        'storyReactionBurstA 820ms ease-out forwards',
                    }}
                  />
                  <img
                    src={reactionBurst.src}
                    alt=""
                    className="absolute bottom-0 left-[66px] h-9 w-9 object-contain"
                    style={{
                      animation:
                        'storyReactionBurstB 880ms ease-out 40ms forwards',
                    }}
                  />
                  <img
                    src={reactionBurst.src}
                    alt=""
                    className="absolute bottom-0 left-[72px] h-8 w-8 object-contain"
                    style={{
                      animation:
                        'storyReactionBurstC 780ms ease-out 90ms forwards',
                    }}
                  />
                </div>
              ) : null}

              <div className="absolute inset-x-0 bottom-[max(10px,env(safe-area-inset-bottom))] z-40 flex justify-center px-2">
                <article className="relative flex w-full max-w-[480px] items-center justify-between gap-0.5 rounded-full bg-black/95 px-1.5 py-2 shadow-2xl backdrop-blur-xl">
                  {REACTIONS.map((reaction) => (
                    <StoryReactionIcon
                      key={reaction.type}
                      reaction={reaction}
                      reactionType={reactionType}
                      count={Number(reactionCounts?.[reaction.type] || 0)}
                      busy={reactionLoading || reactionSaving}
                      onReact={toggleReaction}
                    />
                  ))}
                </article>
              </div>
            </>
          ) : null}

          {story.text_overlay || story.caption ? (
  <div className="pointer-events-none absolute inset-x-6 top-[40%] z-20 text-center">
    <span className="inline-block max-w-full break-words rounded-[14px] bg-black/35 px-4 py-2 text-[28px] font-black leading-tight text-white shadow-lg backdrop-blur-sm">
      {story.text_overlay || story.caption}
    </span>
  </div>
) : null}

{story.mention_username ? (
  <div
    className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center px-5 ${
      group.is_owner
        ? 'bottom-[112px]'
        : 'bottom-[178px]'
    }`}
  >
    <span className="max-w-full truncate rounded-full bg-white px-4 py-2 text-[15px] font-black text-[#111827] shadow-lg">
      @{story.mention_username}
    </span>
  </div>
) : null}

{story.link_url ? (
  <div
    className={`absolute inset-x-0 z-30 flex justify-center px-5 ${
      group.is_owner
        ? 'bottom-[60px]'
        : 'bottom-[122px]'
    }`}
  >
    <a
      href={story.link_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="max-w-[85%] truncate rounded-full bg-white/95 px-4 py-2 text-[13px] font-black text-[#111827] shadow-lg"
    >
      <i className="fa-solid fa-link mr-2" />
      {story.link_url.replace(/^https?:\/\//i, '')}
    </a>
  </div>
) : null}
        </div>
      </div>


      <ViewerStoryMenu
        open={viewerMenuOpen}
        onClose={() =>
          setViewerMenuOpen(false)
        }
        onCopyLink={copyStoryLink}
      />

      <OwnerStoryMenu
        open={ownerMenuOpen}
        isAuthor={
          story.source_type === 'author'
        }
        onClose={() =>
          setOwnerMenuOpen(false)
        }
        onCopyLink={copyStoryLink}
        onDelete={() => {
          setOwnerMenuOpen(false)
          setDeleteSheetOpen(true)
        }}
      />

      <DeleteStorySheet
        open={deleteSheetOpen}
        deleting={deleting}
        onClose={() =>
          setDeleteSheetOpen(false)
        }
        onDelete={deleteStory}
      />
    </>
  )
}

export default function DiscoverStorySection() {
  const navigate = useNavigate()
  const [groups, setGroups] =
    useState([])
  const [loading, setLoading] =
    useState(true)
  const [
    activeGroup,
    setActiveGroup,
  ] = useState(null)
  const deepLinkHandledRef =
    useRef(false)

    const token = useMemo(
    () => getAuthToken(),
    []
  )

  const requestHeaders = useMemo(
    () =>
      token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {},
    [token]
  )

  const storyCacheKey = useMemo(
    () =>
      getDiscoverStoryCacheKey(token),
    [token]
  )

  useEffect(() => {
    if (
      deepLinkHandledRef.current ||
      !groups.length
    ) {
      return
    }

    const params = new URLSearchParams(
      window.location.search
    )
    const storyId =
      params.get('story') || ''
    const sourceType =
      params.get('source') || ''

    if (!storyId) {
      deepLinkHandledRef.current = true
      return
    }

    const matchedGroup = groups.find(
      (group) =>
        (group.stories || []).some(
          (item) =>
            String(item.id) ===
              String(storyId) &&
            (!sourceType ||
              item.source_type ===
                sourceType)
        )
    )

    if (matchedGroup) {
      setActiveGroup(matchedGroup)
    }

    deepLinkHandledRef.current = true
  }, [groups])

  useEffect(() => {
    let alive = true

    async function loadStories() {
      let hasCachedGroups = false

      try {
        const cached =
          await loadHomeCache(
            storyCacheKey,
            {
              maxAgeMs:
                DISCOVER_STORY_CACHE_MAX_AGE_MS,
              allowExpired: true,
            }
          )

        if (!alive) return

        if (
          Array.isArray(
            cached?.data?.groups
          )
        ) {
          hasCachedGroups = true

          const cachedGroups =
            removeExpiredStoryGroups(
              cached.data.groups
            )

          setGroups(cachedGroups)
          setLoading(false)

          if (cached.isFresh) {
            return
          }
        }

        if (!hasCachedGroups) {
          setLoading(true)
        }

        const data =
          await runDiscoverStoryRequest(
            storyCacheKey,
            async () => {
              const response =
                await fetch(
                  `${API_BASE_URL}/api/discover-stories/feed?limit=20`,
                  {
                    headers:
                      requestHeaders,
                    cache: 'no-store',
                  }
                )

              const payload =
                await response
                  .json()
                  .catch(() => ({}))

              if (
                !response.ok ||
                payload.ok === false
              ) {
                throw new Error(
                  payload.message ||
                    'Failed to load stories'
                )
              }

              return payload
            }
          )

        if (!alive) return

        const nextGroups =
          removeExpiredStoryGroups(
            data.groups
          )

        setGroups(nextGroups)

        setActiveGroup((current) => {
          if (!current) return current

          return (
            nextGroups.find(
              (group) =>
                group.key ===
                current.key
            ) || current
          )
        })

        await saveHomeCache(
          storyCacheKey,
          {
            groups: nextGroups,
          },
          {
            maxAgeMs:
              DISCOVER_STORY_CACHE_MAX_AGE_MS,
          }
        )
      } catch {
        if (
          alive &&
          !hasCachedGroups
        ) {
          setGroups([])
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadStories()

    return () => {
      alive = false
    }
  }, [
    requestHeaders,
    storyCacheKey,
  ])

  const handleViewed = useCallback(
    (
      storyId,
      sourceType,
      viewCount
    ) => {
      function updateGroup(group) {
        if (!group) return group

        const nextStories =
          (group.stories || []).map(
            (story) =>
              story.id === storyId &&
              story.source_type ===
                sourceType
                ? {
                    ...story,
                    has_viewed: true,
                    view_count:
                      viewCount,
                  }
                : story
          )

        return {
          ...group,
          stories: nextStories,
          has_unseen:
            nextStories.some(
              (story) =>
                !story.has_viewed
            ),
        }
      }

      setGroups((current) => {
        const next =
          current.map(updateGroup)

        void saveHomeCache(
          storyCacheKey,
          {
            groups: next,
          },
          {
            maxAgeMs:
              DISCOVER_STORY_CACHE_MAX_AGE_MS,
          }
        )

        return next
      })

      setActiveGroup(
        (current) =>
          updateGroup(current)
      )
    },
    [storyCacheKey]
  )

  const handleDeleted =
    useCallback(
      (storyId, groupKey) => {
        setGroups((current) => {
          const next = current
            .map((group) => {
              if (
                group.key !== groupKey
              ) {
                return group
              }

              const stories = (
                group.stories || []
              ).filter(
                (story) =>
                  story.id !== storyId
              )

              if (!stories.length) {
                return null
              }

              return {
                ...group,
                stories,
                has_unseen:
                  stories.some(
                    (story) =>
                      !story.has_viewed
                  ),
              }
            })
            .filter(Boolean)

          void saveHomeCache(
            storyCacheKey,
            {
              groups: next,
            },
            {
              maxAgeMs:
                DISCOVER_STORY_CACHE_MAX_AGE_MS,
            }
          )

          return next
        })

        setActiveGroup(
          (current) => {
            if (
              !current ||
              current.key !== groupKey
            ) {
              return current
            }

            const stories = (
              current.stories || []
            ).filter(
              (story) =>
                story.id !== storyId
            )

            if (!stories.length) {
              return null
            }

            return {
              ...current,
              stories,
              has_unseen:
                stories.some(
                  (story) =>
                    !story.has_viewed
                ),
            }
          }
        )
      },
      [storyCacheKey]
    )

  return (
    <>
      <section className="bg-white py-[6px] sm:rounded-[12px]">
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 sm:px-3">
          <StaticStoryCard
            item={CREATE_STORY_ITEM}
            onClick={() =>
              navigate(
                '/reader/story/create'
              )
            }
          />

          {groups.map((group) => (
            <StoryCard
              key={group.key}
              group={group}
              onClick={() =>
                setActiveGroup(group)
              }
            />
          ))}

          {loading ? (
            <div className="h-[168px] w-[102px] shrink-0 animate-pulse rounded-[8px] bg-gradient-to-br from-gray-200 to-gray-100 sm:h-[170px] sm:w-[104px]" />
          ) : null}
        </div>
      </section>

      {activeGroup ? (
        <StoryViewer
          group={activeGroup}
          allGroups={groups}
          onSelectGroup={(nextGroup) =>
            setActiveGroup(nextGroup)
          }
          onClose={() =>
            setActiveGroup(null)
          }
          onViewed={handleViewed}
          onDeleted={handleDeleted}
        />
      ) : null}
    </>
  )
}

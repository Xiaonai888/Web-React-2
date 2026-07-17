import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DiscoverStorySection from '../components/discover/DiscoverStorySection'
import CommentsModal from '../components/story-detail/CommentsModal'
import DiscoverTrendingStoriesSection from '../components/discover/DiscoverTrendingStoriesSection'
import DiscoverAuthorsYouMayLikeSection from '../components/discover/DiscoverAuthorsYouMayLikeSection'
import DiscoverNewUpdatedStoriesSection from '../components/discover/DiscoverNewUpdatedStoriesSection'
import DiscoverYouMightLikeSection from '../components/discover/DiscoverYouMightLikeSection'
import DiscoverCompletedStoriesSection from '../components/discover/DiscoverCompletedStoriesSection'
import AuthorPostOptionsSheet, {
  filterAuthorPostsByLocalPreferences,
} from '../components/discover/AuthorPostOptionsSheet'
import ShadowMallAdOptionsSheet, {
  hideShadowMallAdLocally,
  isShadowMallAdHidden,
} from '../components/discover/ShadowMallAdOptionsSheet'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'


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

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatPostTime(value) {
  const timestamp = new Date(value || 0).getTime()

  if (!timestamp) return 'Just now'

  const difference = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}

function mergeUniquePosts(current, incoming) {
  const seen = new Set()
  const merged = []

  for (const post of [...current, ...incoming]) {
    if (!post?.id || seen.has(post.id)) continue

    seen.add(post.id)
    merged.push(post)
  }

  return merged
}

async function fetchFollowedPosts(token, cursor = '') {
  const params = new URLSearchParams({ limit: '10' })

  if (cursor) {
    params.set('cursor', cursor)
  }

  const response = await fetch(
    `${API_BASE_URL}/api/authors/following/posts/feed?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load followed posts')
  }

  return data
}


async function fetchShadowMallPromotions() {
  const response = await fetch(
    `${API_BASE_URL}/api/shadow-mall/promotions?limit=100`,
    {
      cache: 'no-store',
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || 'Failed to load Shadow Mall promotions'
    )
  }

  return Array.isArray(data.promotions)
    ? data.promotions
    : []
}


async function setFollowedPostReaction(
  token,
  postId,
  reactionType = 'love'
) {
  if (!token) {
    throw new Error('Please login first')
  }

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/react`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reaction_type: reactionType,
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to update reaction')
  }

  return data
}



function GridHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function SearchHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

function BellHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 9a5.5 5.5 0 0 1 11 0v3.2c0 1.4.5 2.7 1.5 3.8H5c1-1.1 1.5-2.4 1.5-3.8V9Z" />
      <path d="M10 19h4" />
    </svg>
  )
}

function Header({ hidden }) {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-[100000] border-b border-gray-50 bg-white transition-transform duration-200 ease-out"
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      <div className="mx-auto flex h-[58px] w-full max-w-[620px] items-center justify-between px-4">
        <Link to="/" className="flex h-9 w-[92px] items-center overflow-visible">
          <img
            src="/assets/Icons/Logo Shadow 2.svg"
            alt="Shadow"
            className="h-full w-full object-contain object-left"
            loading="eager"
            decoding="async"
          />
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/genres"
            className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
            aria-label="Genres"
          >
            <GridHeaderIcon />
          </Link>

          <Link
            to="/search"
            className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
            aria-label="Search"
          >
            <SearchHeaderIcon />
          </Link>

          <Link
            to="/notifications"
            className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
            aria-label="Notifications"
          >
            <BellHeaderIcon />
          </Link>
        </div>
      </div>
    </header>
  )
}

function RealPostImageGrid({ images, authorName }) {
  const urls = Array.isArray(images)
    ? images.filter(Boolean).slice(0, 5)
    : []

  if (!urls.length) return null

  const alt = `${authorName || 'Author'} post`

  if (urls.length === 1) {
    return (
      <div className="bg-gray-100">
        <img
          src={urls[0]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="max-h-[620px] w-full object-cover"
        />
      </div>
    )
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
        {urls.map((url) => (
          <img
            key={url}
            src={url}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-[260px] w-full object-cover sm:h-[310px]"
          />
        ))}
      </div>
    )
  }

  if (urls.length === 3) {
    return (
      <div className="grid h-[340px] grid-cols-2 gap-[2px] bg-gray-100 sm:h-[400px]">
        <img
          src={urls[0]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />

        <div className="grid min-h-0 grid-rows-2 gap-[2px]">
          {urls.slice(1).map((url) => (
            <img
              key={url}
              src={url}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-full min-h-0 w-full object-cover"
            />
          ))}
        </div>
      </div>
    )
  }

  const visibleUrls = urls.slice(0, 4)
  const hiddenCount = Math.max(0, urls.length - 4)

  return (
    <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
      {visibleUrls.map((url, index) => (
        <div key={url} className="relative">
          <img
            src={url}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-[210px] w-full object-cover sm:h-[250px]"
          />

          {index === 3 && hiddenCount > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[28px] font-black text-white">
              +{hiddenCount}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function RealReactionSummary({ summary, likeCount }) {
  const icons = {
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡',
    support: '👏',
    touched: '🥹',
  }

  const items = Array.isArray(summary) ? summary.slice(0, 3) : []

  return (
    <div className="flex items-center gap-1">
      {items.length ? (
        <div className="flex -space-x-1">
          {items.map((item) => (
            <span
              key={item.type}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#f5f3fa] text-[11px]"
            >
              {icons[item.type] || '❤️'}
            </span>
          ))}
        </div>
      ) : null}

      <span>{Number(likeCount || 0)}</span>
    </div>
  )
}

function RealFollowedPostCard({
  post,
  token,
  onReactionUpdated,
  onComment,
  onMore,
}) {

  const author = post.author_page || {}
  const authorName = author.page_name || 'Author'
  const pageUsername = author.page_username || ''
  const pageUrl = pageUsername
    ? `/author/page/${encodeURIComponent(pageUsername)}`
    : '#'
  const firstLetter =
    authorName.trim().slice(0, 1).toUpperCase() || 'A'

  const [reactionPickerOpen, setReactionPickerOpen] =
    useState(false)
  const [reactionBusy, setReactionBusy] = useState(false)
  const [reactionError, setReactionError] = useState('')
  const pressTimerRef = useRef(null)

  const activeReaction =
    AUTHOR_POST_REACTIONS.find(
      (item) => item.type === post.my_reaction
    ) || null

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        window.clearTimeout(pressTimerRef.current)
      }
    }
  }, [])

  async function chooseReaction(reactionType) {
    if (reactionBusy) return

    try {
      setReactionBusy(true)
      setReactionError('')

      const data = await setFollowedPostReaction(
        token,
        post.id,
        reactionType
      )

      onReactionUpdated?.(post.id, data)
    } catch (error) {
      setReactionError(
        error.message || 'Failed to update reaction'
      )
    } finally {
      setReactionBusy(false)
    }
  }

  function startReactionPress() {
    if (reactionBusy) return

    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
    }

    pressTimerRef.current = window.setTimeout(() => {
      setReactionPickerOpen(true)
      pressTimerRef.current = null
    }, 420)
  }

  function endReactionPress() {
    if (!pressTimerRef.current) return

    window.clearTimeout(pressTimerRef.current)
    pressTimerRef.current = null
    chooseReaction('love')
  }

  function cancelReactionPress() {
    if (!pressTimerRef.current) return

    window.clearTimeout(pressTimerRef.current)
    pressTimerRef.current = null
  }

  return (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="flex items-start gap-2 px-4 pb-3 pt-4">
        <Link
          to={pageUrl}
          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-black text-white"
          aria-label={`Open ${authorName}`}
        >
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={authorName}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </Link>

        <div className="-ml-1 min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={pageUrl}
                className="block truncate text-[14px] font-semibold text-[#111827]"
              >
                {authorName}
              </Link>

              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400">
                <span>{formatPostTime(post.created_at)}</span>
                <span>·</span>
                <i className="fa-solid fa-earth-americas text-[10px]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onMore?.(post)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
              aria-label="More"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>
          </div>
        </div>
      </div>

      {post.content ? (
        <p className="whitespace-pre-wrap break-words px-4 pb-3 text-[13px] font-normal leading-5 text-[#111827]">
          {post.content}
        </p>
      ) : null}

      <RealPostImageGrid
        images={post.image_urls}
        authorName={authorName}
      />

      <div className="flex items-center gap-6 border-t border-gray-100 px-4 py-2 text-[13px] font-normal text-gray-500">
        <div className="relative">
          {reactionPickerOpen ? (
            <>
              <button
                type="button"
                aria-label="Close reactions"
                onClick={() => setReactionPickerOpen(false)}
                className="fixed inset-0 z-20 cursor-default"
              />

              <div className="absolute bottom-8 left-0 z-30 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-2 shadow-2xl ring-1 ring-black/10">
                {AUTHOR_POST_REACTIONS.map((reaction) => (
                  <button
                    key={reaction.type}
                    type="button"
                    disabled={reactionBusy}
                    onClick={() => {
                      setReactionPickerOpen(false)
                      chooseReaction(reaction.type)
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:-translate-y-1 hover:scale-110 active:scale-90 disabled:opacity-60"
                    aria-label={reaction.label}
                    title={reaction.label}
                  >
                    <img
                      src={reaction.src}
                      alt={reaction.label}
                      className="h-8 w-8 object-contain"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <button
            type="button"
            disabled={reactionBusy}
            onPointerDown={startReactionPress}
            onPointerUp={endReactionPress}
            onPointerLeave={cancelReactionPress}
            onPointerCancel={cancelReactionPress}
            onContextMenu={(event) => event.preventDefault()}
            className="inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60"
            style={{
              color: activeReaction?.text || undefined,
            }}
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
                src={activeReaction.src}
                alt={activeReaction.label}
                className="h-[17px] w-[17px] object-contain"
              />
            ) : (
              <i className="fa-regular fa-heart text-[15px]" />
            )}

            <span>{Number(post.like_count || 0)}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onComment?.(post)}
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Comments"
        >
          <i className="fa-regular fa-comment text-[15px]" />
          <span>{Number(post.comment_count || 0)}</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Echo"
        >
          <img
            src="/assets/Icons/echo.svg"
            alt=""
            className="h-[15px] w-[15px] opacity-60"
          />
          <span>{Number(post.echo_count || 0)}</span>
        </button>
      </div>

      {reactionError ? (
        <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-[11px] font-bold text-red-600">
          {reactionError}
        </div>
      ) : null}
    </article>
  )
}

function RealPostSkeleton() {
  return (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="flex animate-pulse items-start gap-3 p-4">
        <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
          <div className="mt-5 h-3 w-full rounded bg-gray-100" />
          <div className="mt-2 h-3 w-4/5 rounded bg-gray-100" />
        </div>
      </div>

      <div className="h-[230px] animate-pulse bg-gray-100" />
    </article>
  )
}

function RealFeedEmptyState() {
  return (
    <article className="bg-white p-7 text-center shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edfb] text-[#7c3aed]">
        <i className="fa-solid fa-user-plus text-xl" />
      </div>

      <div className="mt-4 text-[17px] font-black text-[#111827]">
        No posts yet
      </div>

      <div className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-gray-500">
        Follow authors to see their latest posts here.
      </div>

      <Link
        to="/authors/top"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        Find authors
      </Link>
    </article>
  )
}

function RealFeedErrorState({ onRetry }) {
  return (
    <article className="bg-white p-7 text-center shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <i className="fa-solid fa-triangle-exclamation text-xl" />
      </div>

      <div className="mt-4 text-[17px] font-black text-[#111827]">
        Could not load posts
      </div>

      <div className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-gray-500">
        Check your connection and try again.
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        Retry
      </button>
    </article>
  )
}

function PromotionLink({ to, className, children }) {
  const destination = String(to || '/shop').trim() || '/shop'

  if (/^https?:\/\//i.test(destination)) {
    return (
      <a
        href={destination}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={destination} className={className}>
      {children}
    </Link>
  )
}

function AdsCard({ item, onMore, onHide }) {
  const destination = item.link_url || '/shop'
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const description = String(item.description || '')
  const hasMoreDescription = description.length > 110

  return (
    <article className="overflow-hidden bg-white ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-white">
          {item.profile_image_url ? (
            <img
              src={item.profile_image_url}
              alt={item.sponsor || 'Shadow Mall'}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <i className="fa-solid fa-store text-[14px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold text-[#111827]">
            {item.sponsor || 'Shadow Mall'}
          </div>

          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400">
            <span>Ad</span>
            <span>·</span>
            <i className="fa-solid fa-earth-americas text-[10px]" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onMore?.(item)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          aria-label="More sponsored options"
        >
          <i className="fa-solid fa-ellipsis text-[13px]" />
        </button>

        <button
          type="button"
          onClick={() => onHide?.(item)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          aria-label="Hide sponsored promotion"
        >
          <i className="fa-solid fa-xmark text-[16px]" />
        </button>
      </div>

      {item.title || description ? (
        <div className="px-4 pb-3 text-[13px] font-normal leading-5 text-[#111827]">
          {item.title ? (
            <span className="font-semibold">{item.title}</span>
          ) : null}

          {description ? (
            <>
              {item.title ? <span> · </span> : null}
              <span>
                {captionExpanded || !hasMoreDescription
                  ? description
                  : `${description.slice(0, 110).trim()}...`}
              </span>

              {hasMoreDescription ? (
                <button
                  type="button"
                  onClick={() => setCaptionExpanded((current) => !current)}
                  className="ml-1 font-semibold text-gray-500"
                >
                  {captionExpanded ? 'less' : 'more'}
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      <PromotionLink to={destination} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-[#111827]">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title || item.sponsor || 'Shadow Mall promotion'}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#f59e0b]" />
              <div className="absolute -right-16 -top-14 h-48 w-48 rounded-full bg-white/10" />
              <div className="absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-black/20" />
              <div className="absolute inset-x-5 bottom-6">
                <div className="max-w-[360px] text-[25px] font-black leading-[1.16] text-white">
                  {item.title}
                </div>
                <div className="mt-3 max-w-[390px] text-[13px] font-medium leading-5 text-white/80">
                  {item.description}
                </div>
              </div>
            </>
          )}
        </div>
      </PromotionLink>

      <div className="flex min-h-[58px] items-center justify-between gap-4 border-b border-gray-100 px-4 py-2.5">
        <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111827]">
          {item.sponsor || 'Shadow Mall'}
        </div>

        <PromotionLink
          to={destination}
          className="flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eef0f4] px-4 text-[12px] font-semibold text-[#111827] active:bg-[#e5e7eb]"
        >
          {item.button_text || item.cta || 'Shop now'}
        </PromotionLink>
      </div>

      <div className="flex items-center gap-6 px-4 py-2 text-[13px] font-normal text-gray-500">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Like promotion"
        >
          <i className="fa-regular fa-heart text-[15px]" />
          <span>{Number(item.like_count || 0)}</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Comment on promotion"
        >
          <i className="fa-regular fa-comment text-[15px]" />
          <span>{Number(item.comment_count || 0)}</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 active:scale-95"
          aria-label="Echo promotion"
        >
          <img
            src="/assets/Icons/echo.svg"
            alt=""
            className="h-[15px] w-[15px] opacity-60"
          />
          <span>{Number(item.echo_count || 0)}</span>
        </button>
      </div>
    </article>
  )
}

function TrendingCard({ item }) {
  const coverColors = [
    'from-[#111827] via-[#4f46e5] to-[#a78bfa]',
    'from-[#7f1d1d] via-[#dc2626] to-[#f59e0b]',
    'from-[#064e3b] via-[#0f766e] to-[#5eead4]',
    'from-[#3b0764] via-[#9333ea] to-[#f0abfc]',
    'from-[#7c2d12] via-[#ea580c] to-[#fed7aa]',
  ]

  return (
    <article className="bg-white py-4 shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <div className="text-[18px] font-black text-[#111827]">{item.title}</div>
          <div className="mt-1 text-[12px] font-bold text-gray-400">Popular books on Shadow now</div>
        </div>
        <button type="button" className="text-[12px] font-black text-[#1677ff]">See all</button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {item.items.map((novel, index) => (
          <button key={novel.rank} type="button" className="w-[104px] shrink-0 text-left active:scale-[0.98]">
            <div className={`relative h-[148px] overflow-hidden rounded-[14px] bg-gradient-to-br ${coverColors[index % coverColors.length]} shadow-sm`}>
              <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[12px] font-black text-[#111827]">
                {novel.rank}
              </div>

              <div className="absolute inset-x-3 bottom-3">
                <div className="rounded-[10px] bg-white/15 p-2 backdrop-blur">
                  <div className="line-clamp-2 text-[11px] font-black leading-[14px] text-white">
                    {novel.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 line-clamp-2 text-[12px] font-black leading-[15px] text-[#111827]">
              {novel.title}
            </div>
            <div className="mt-1 truncate text-[10px] font-bold text-gray-400">
              {novel.meta}
            </div>
          </button>
        ))}
      </div>
    </article>
  )
}


function RecommendedAuthorsCard({ item }) {
  return (
    <article className="bg-white py-4 shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <div className="text-[18px] font-black text-[#111827]">{item.title}</div>
          <div className="mt-1 text-[12px] font-bold text-gray-400">Swipe to discover new authors</div>
        </div>
        <button type="button" className="text-[12px] font-black text-[#1677ff]">More</button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {item.authors.map((author) => (
          <div
            key={author.name}
            className="h-[190px] w-[132px] shrink-0 rounded-[20px] bg-[#f8fafc] p-3 text-center ring-1 ring-gray-100"
          >
            <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-gradient-to-br from-[#111827] to-[#4f46e5] text-[16px] font-black text-white shadow-sm">
              {author.avatar}
            </div>

            <div className="mt-3 truncate text-[14px] font-black text-[#111827]">{author.name}</div>
            <div className="mt-1 line-clamp-2 h-[28px] text-[10px] font-bold leading-[14px] text-gray-400">
              {author.meta}
            </div>

            <button
              type="button"
              className="mt-2 h-[32px] w-full rounded-full bg-[#111827] text-[12px] font-black text-white active:scale-[0.98]"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </article>
  )
}

function EmptyStateCard() {
  return (
    <article className="bg-white p-5 text-center shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className="fa-solid fa-user-plus text-lg" />
      </div>
      <div className="text-[16px] font-black text-[#111827]">Follow authors to improve Discover</div>
      <div className="mx-auto mt-2 max-w-[260px] text-[13px] font-semibold leading-6 text-gray-500">
        Real followed-page updates will replace this demo feed later.
      </div>
    </article>
  )
}

function FeedRenderer({ item }) {
  if (item.kind === 'followed_post') return <FollowedPostCard post={item} />
  if (item.kind === 'ad') return <AdsCard item={item} />
  if (item.kind === 'trending') return <TrendingCard item={item} />
  if (item.kind === 'recommended_authors') return <RecommendedAuthorsCard item={item} />
  return null
}

function countAuthorPostComments(comments = []) {
  return comments.reduce(
    (total, comment) =>
      total +
      1 +
      countAuthorPostComments(
        Array.isArray(comment?.replies) ? comment.replies : []
      ),
    0
  )
}

export default function DiscoverPage() {
  const [barsHidden, setBarsHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const token = useMemo(() => getAuthToken(), [])

  const [realPosts, setRealPosts] = useState([])
  const [realPostsCursor, setRealPostsCursor] = useState(null)
  const [realPostsHasMore, setRealPostsHasMore] = useState(false)
  const [realPostsLoading, setRealPostsLoading] = useState(true)
  const [realPostsLoadingMore, setRealPostsLoadingMore] = useState(false)
  const [realPostsError, setRealPostsError] = useState('')
  const [shadowMallPromotions, setShadowMallPromotions] = useState([])
  const [commentPost, setCommentPost] = useState(null)
  const [optionsPost, setOptionsPost] = useState(null)
  const [adOptionsItem, setAdOptionsItem] = useState(null)
  const commentCountBaseRef = useRef({
    postId: '',
    loadedCount: null,
    serverCount: 0,
  })

  useEffect(() => {
    let alive = true

    async function loadShadowMallPromotions() {
      try {
        const promotions =
          await fetchShadowMallPromotions()

        if (alive) {
          setShadowMallPromotions(
            promotions.filter(
              (promotion) =>
                promotion?.is_active !== false &&
                !isShadowMallAdHidden(promotion)
            )
          )
        }
      } catch {
        if (alive) {
          setShadowMallPromotions([])
        }
      }
    }

    loadShadowMallPromotions()

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true

    async function loadInitialPosts() {
      if (!token) {
        if (alive) {
          setRealPosts([])
          setRealPostsCursor(null)
          setRealPostsHasMore(false)
          setRealPostsLoading(false)
          setRealPostsError('')
        }

        return
      }

      try {
        setRealPostsLoading(true)
        setRealPostsError('')

        const data = await fetchFollowedPosts(token)

        if (!alive) return

        setRealPosts(
          filterAuthorPostsByLocalPreferences(
            Array.isArray(data.posts) ? data.posts : []
          )
        )
        setRealPostsCursor(data.next_cursor || null)
        setRealPostsHasMore(
          Boolean(data.has_more && data.next_cursor)
        )
      } catch (error) {
        if (!alive) return

        setRealPosts([])
        setRealPostsCursor(null)
        setRealPostsHasMore(false)
        setRealPostsError(
          error.message || 'Failed to load followed posts'
        )
      } finally {
        if (alive) {
          setRealPostsLoading(false)
        }
      }
    }

    loadInitialPosts()

    return () => {
      alive = false
    }
  }, [token])

  async function loadMoreRealPosts() {
    if (
      !token ||
      !realPostsCursor ||
      realPostsLoadingMore
    ) {
      return
    }

    try {
      setRealPostsLoadingMore(true)
      setRealPostsError('')

      const data = await fetchFollowedPosts(
        token,
        realPostsCursor
      )
      const incomingPosts =
        filterAuthorPostsByLocalPreferences(
          Array.isArray(data.posts) ? data.posts : []
        )

      setRealPosts((current) =>
        mergeUniquePosts(current, incomingPosts)
      )
      setRealPostsCursor(data.next_cursor || null)
      setRealPostsHasMore(
        Boolean(data.has_more && data.next_cursor)
      )
    } catch (error) {
      setRealPostsError(
        error.message || 'Failed to load more posts'
      )
    } finally {
      setRealPostsLoadingMore(false)
    }
  }

  async function retryRealPosts() {
    if (!token) return

    try {
      setRealPostsLoading(true)
      setRealPostsError('')

      const data = await fetchFollowedPosts(token)

      setRealPosts(
        filterAuthorPostsByLocalPreferences(
          Array.isArray(data.posts) ? data.posts : []
        )
      )
      setRealPostsCursor(data.next_cursor || null)
      setRealPostsHasMore(
        Boolean(data.has_more && data.next_cursor)
      )
    } catch (error) {
      setRealPosts([])
      setRealPostsCursor(null)
      setRealPostsHasMore(false)
      setRealPostsError(
        error.message || 'Failed to load followed posts'
      )
    } finally {
      setRealPostsLoading(false)
    }
  }


  function openPostComments(post) {
    if (!post?.id) return

    commentCountBaseRef.current = {
      postId: post.id,
      loadedCount: null,
      serverCount: Number(post.comment_count || 0),
    }
    setCommentPost(post)
  }

  function closePostComments() {
    setCommentPost(null)
    commentCountBaseRef.current = {
      postId: '',
      loadedCount: null,
      serverCount: 0,
    }
  }

  function handlePostCommentsChanged(nextComments = []) {
    const activePostId = commentPost?.id
    const base = commentCountBaseRef.current

    if (!activePostId || base.postId !== activePostId) return

    const loadedCount = countAuthorPostComments(nextComments)

    if (base.loadedCount === null) {
      commentCountBaseRef.current = {
        ...base,
        loadedCount,
      }
      return
    }

    const nextCount = Math.max(
      0,
      base.serverCount + loadedCount - base.loadedCount
    )

    setRealPosts((current) =>
      current.map((post) =>
        post.id === activePostId
          ? {
              ...post,
              comment_count: nextCount,
            }
          : post
      )
    )

    setCommentPost((current) =>
      current?.id === activePostId
        ? {
            ...current,
            comment_count: nextCount,
          }
        : current
    )
  }

  function handleRealPostReactionUpdated(postId, data) {
    setRealPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post

        const updatedPost = data.post || {}

        return {
          ...post,
          ...updatedPost,
          author_page: post.author_page,
          my_reaction: data.reaction_type || null,
          like_count: Number(
            data.like_count ??
              updatedPost.like_count ??
              post.like_count ??
              0
          ),
          reaction_summary: Array.isArray(
            data.reaction_summary
          )
            ? data.reaction_summary
            : post.reaction_summary,
        }
      })
    )
  }

  function hideShadowMallPromotion(item) {
    if (item) {
      hideShadowMallAdLocally(item)
    }

    setShadowMallPromotions((current) =>
      current.filter(
        (promotion) =>
          String(promotion?.id || '') !==
          String(item?.id || '')
      )
    )
    setAdOptionsItem(null)
  }

  function hidePostFromDiscover(postId) {
    setRealPosts((current) =>
      current.filter((post) => post.id !== postId)
    )
    setOptionsPost(null)
  }

  function hideAuthorFromDiscover(authorId) {
    setRealPosts((current) =>
      current.filter(
        (post) => post.author_page?.id !== authorId
      )
    )
    setOptionsPost(null)
  }

  function updateAuthorFollowState(authorId, isFollowing) {
    setRealPosts((current) =>
      current.map((post) =>
        post.author_page?.id === authorId
          ? {
              ...post,
              author_page: {
                ...post.author_page,
                is_following: isFollowing,
              },
            }
          : post
      )
    )
  }

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollYRef.current
      const difference = currentScrollY - previousScrollY

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('discover-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('discover-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('discover-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('discover-bars-hidden')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <style>{`
        body.discover-bars-hidden footer {
          transform: translateY(110%);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Header hidden={barsHidden} />

      <main className="pt-[58px]">
        <div className="mx-auto w-full max-w-[620px]">
          <div className="sm:px-3 sm:pt-1.5">
            <DiscoverStorySection />
          </div>

          <section className="space-y-1 py-1 sm:space-y-1.5 sm:px-3 sm:py-1.5">
            {realPostsLoading ? (
              <>
                <RealPostSkeleton />
                <RealPostSkeleton />
              </>
            ) : null}

            {!realPostsLoading && realPostsError && !realPosts.length ? (
              <RealFeedErrorState onRetry={retryRealPosts} />
            ) : null}

            {!realPostsLoading && !realPostsError && !realPosts.length ? (
              <>
                <RealFeedEmptyState />

                {shadowMallPromotions.map((promotion) => (
                  <AdsCard
                    key={`empty-feed-ad-${promotion.id}`}
                    item={promotion}
                    onMore={setAdOptionsItem}
                    onHide={hideShadowMallPromotion}
                  />
                ))}
              </>
            ) : null}

            {realPosts.map((post, index) => (
              <Fragment key={post.id}>
                <RealFollowedPostCard
                  post={post}
                  token={token}
                  onReactionUpdated={handleRealPostReactionUpdated}
                  onComment={openPostComments}
                  onMore={setOptionsPost}
                />

                {index === 0 && shadowMallPromotions[0] ? (
                  <AdsCard
                    item={shadowMallPromotions[0]}
                    onMore={setAdOptionsItem}
                    onHide={hideShadowMallPromotion}
                  />
                ) : null}

                {index === 0 ? (
                  <DiscoverTrendingStoriesSection />
                ) : null}

                {index === 1 ? (
                  <DiscoverAuthorsYouMayLikeSection />
                ) : null}

                {index === 2 ? (
                  <DiscoverNewUpdatedStoriesSection />
                ) : null}

                {index === 3 ? (
                  <DiscoverYouMightLikeSection />
                ) : null}

                {index === 4 ? (
                  <DiscoverCompletedStoriesSection />
                ) : null}
                
              </Fragment>
            ))}

            {realPostsError && realPosts.length ? (
              <div className="rounded-[18px] bg-red-50 px-4 py-3 text-center text-[12px] font-bold text-red-600 ring-1 ring-red-100">
                {realPostsError}
              </div>
            ) : null}

            {realPostsHasMore ? (
              <button
                type="button"
                onClick={loadMoreRealPosts}
                disabled={realPostsLoadingMore}
                className="w-full rounded-[16px] bg-white py-3.5 text-[13px] font-black text-[#111827] shadow-sm ring-1 ring-gray-100 active:scale-[0.99] disabled:opacity-60"
              >
                {realPostsLoadingMore ? (
                  <>
                    <i className="fa-solid fa-circle-notch mr-2 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Load more posts'
                )}
              </button>
            ) : null}
          </section>
        </div>
      </main>

      <ShadowMallAdOptionsSheet
        open={Boolean(adOptionsItem)}
        item={adOptionsItem}
        onClose={() => setAdOptionsItem(null)}
        onHide={hideShadowMallPromotion}
      />

      <AuthorPostOptionsSheet
        open={Boolean(optionsPost)}
        post={optionsPost}
        onClose={() => setOptionsPost(null)}
        onHidePost={hidePostFromDiscover}
        onHideAuthorPosts={hideAuthorFromDiscover}
        onFollowChanged={updateAuthorFollowState}
      />

      <CommentsModal
        open={Boolean(commentPost)}
        targetType="author_post"
        targetId={commentPost?.id}
        title="Author post comments"
        story={
          commentPost
            ? {
                ...commentPost,
                author_page: {
                  ...(commentPost.author_page || {}),
                  user_id:
                    commentPost.author_page?.user_id ||
                    commentPost.user_id ||
                    null,
                },
              }
            : null
        }
        onClose={closePostComments}
        onCommentChanged={handlePostCommentsChanged}
      />
    </div>
  )
}

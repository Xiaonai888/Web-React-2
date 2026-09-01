import { recordAuthorPostClick } from '../services/authorPostInsightsApi'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../utils/homeDataCache'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import DiscoverStorySection from '../components/discover/DiscoverStorySection'
import CommentsModal from '../components/story-detail/CommentsModal'
import DiscoverTrendingStoriesSection from '../components/discover/DiscoverTrendingStoriesSection'
import DiscoverAuthorsYouMayLikeSection from '../components/discover/DiscoverAuthorsYouMayLikeSection'
import DiscoverReadersYouMayLikeSection from '../components/discover/DiscoverReadersYouMayLikeSection'
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
import ReaderPostComposer from '../components/reader-posts/ReaderPostComposer'
import ReaderPostCard from '../components/reader-posts/ReaderPostCard'
import ShadowMallPromotionSocial from '../components/discover/ShadowMallPromotionSocial'
import AuthorPostEchoAction from '../components/author-posts/AuthorPostEchoAction'
import ReactionAction from '../components/social/reactions/ReactionAction'
import ReactionSummary from '../components/social/reactions/ReactionSummary'
import AuthorDiscoverPostText from '../components/author-posts/AuthorDiscoverPostText'
import {
  CollapsiblePostText,
  ProfessionalSinglePostImage,
} from '../components/common/ProfessionalPostContent'
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'
const DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS =
  5 * 60 * 1000
const DISCOVER_SHADOW_MALL_CACHE_MAX_AGE_MS =
  15 * 60 * 1000
const DISCOVER_CACHE_WRITE_DELAY_MS = 120

const discoverFeedInflightRequests =
  new Map()

function getDiscoverFeedScope(token) {
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

function getDiscoverFeedCacheKey(
  token,
  section,
  limit
) {
  return getHomeCacheKey({
    section,
    scope: getDiscoverFeedScope(token),
    params: {
      limit,
      schema: 1,
    },
  })
}

function getShadowMallPromotionsCacheKey() {
  return getHomeCacheKey({
    section: 'discover-promotions',
    scope: 'public',
    params: {
      limit: 100,
      schema: 1,
    },
  })
}

function createDiscoverCacheSignature(value) {
  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

async function runDiscoverFeedRequest(
  key,
  request
) {
  if (
    discoverFeedInflightRequests.has(key)
  ) {
    return discoverFeedInflightRequests.get(
      key
    )
  }

  const promise = Promise.resolve().then(
    request
  )

  discoverFeedInflightRequests.set(
    key,
    promise
  )

  try {
    return await promise
  } finally {
    if (
      discoverFeedInflightRequests.get(
        key
      ) === promise
    ) {
      discoverFeedInflightRequests.delete(
        key
      )
    }
  }
}


function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

const POST_TOKEN_PATTERN = /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN = /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN = /^#[\p{L}\p{N}\p{M}_]+$/u
function renderPostTextWithLinks(text, postId) {
  return String(text || '').split(POST_TOKEN_PATTERN).map((part, index) => {
    if (POST_URL_ONLY_PATTERN.test(part)) return <a key={`${part}-${index}`} href={part} target="_blank" rel="noopener noreferrer" onClick={(event) => { event.stopPropagation(); void recordAuthorPostClick(postId, part) }} className="break-all text-[#1877f2]">{part}</a>
    if (POST_HASHTAG_ONLY_PATTERN.test(part)) return <a key={`${part}-${index}`} href={`/discover/search?q=${encodeURIComponent(part)}&type=posts`} onClick={(e) => e.stopPropagation()} className="text-[#1877f2]">{part}</a>
    return part
  })
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
    `${API_BASE_URL}/api/authors/discover/posts/feed?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || 'Failed to load author posts'
    )
  }

  return data
}

async function fetchReaderPosts(token) {
  if (!token) {
    return {
      posts: [],
    }
  }

  const response = await fetch(
    `${API_BASE_URL}/api/reader-posts/feed?limit=20`,
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

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message ||
        'Failed to load reader posts'
    )
  }

  return data
}

function getDiscoverRecommendationScore(
  entry,
  snapshotTime
) {
  const post = entry?.post || {}

  const postTime = new Date(
    entry?.kind === 'reader_post'
      ? post.publish_at ||
          post.updated_at ||
          post.created_at ||
          0
      : post.created_at ||
          post.updated_at ||
          0
  ).getTime()

  const ageMs =
    Number.isFinite(postTime)
      ? Math.max(
          0,
          snapshotTime - postTime
        )
      : 30 *
        24 *
        60 *
        60 *
        1000

  const ageDays =
    ageMs /
    (24 * 60 * 60 * 1000)

  const likes = Math.max(
    0,
    Number(post.like_count || 0)
  )

  const comments = Math.max(
    0,
    Number(post.comment_count || 0)
  )

  const echoes = Math.max(
    0,
    Number(post.echo_count || 0)
  )

  const engagement =
    likes +
    comments * 2 +
    echoes * 3

  const engagementScore =
    Math.log1p(engagement) * 12

  const recencyScore =
    Math.max(
      0,
      18 - ageDays * 0.6
    )

  const isFollowing =
    entry?.kind === 'author_post'
      ? Boolean(
          post.is_following ??
            post.author_page
              ?.is_following
        )
      : Boolean(
          post.user?.is_following
        )

  const discoveryBoost =
    isFollowing ? 0 : 2

  const ownerBoost =
    post.is_owner ? 1 : 0

  return (
  engagementScore +
  recencyScore +
  discoveryBoost +
  ownerBoost
)
}

function buildDiscoverTimeline(
  authorPosts,
  readerPosts
) {
  const snapshotTime = Date.now()
  const newestPostId = [authorPosts?.[0], readerPosts?.[0]]
  .filter(Boolean)
  .sort((a, b) =>
    new Date(b.publish_at || b.created_at || 0) -
    new Date(a.publish_at || a.created_at || 0)
  )[0]?.id

  const items = [
    ...(Array.isArray(authorPosts)
      ? authorPosts.map((post) => ({
          kind: 'author_post',
          post,
        }))
      : []),
    ...(Array.isArray(readerPosts)
      ? readerPosts.map((post) => ({
          kind: 'reader_post',
          post,
        }))
      : []),
  ].sort((left, right) => {
    if (left.post?.id === newestPostId) return -1
if (right.post?.id === newestPostId) return 1
    const leftScore =
      getDiscoverRecommendationScore(
        left,
        snapshotTime
      )

    const rightScore =
      getDiscoverRecommendationScore(
        right,
        snapshotTime
      )

    const scoreDifference =
      rightScore - leftScore

    if (
      Math.abs(scoreDifference) >
      0.000001
    ) {
      return scoreDifference
    }

    const rightTime = new Date(
      right.kind === 'reader_post'
        ? right.post?.publish_at ||
            right.post?.updated_at ||
            right.post?.created_at ||
            0
        : right.post?.created_at ||
            right.post?.updated_at ||
            0
    ).getTime()

    const leftTime = new Date(
      left.kind === 'reader_post'
        ? left.post?.publish_at ||
            left.post?.updated_at ||
            left.post?.created_at ||
            0
        : left.post?.created_at ||
            left.post?.updated_at ||
            0
    ).getTime()

    if (rightTime !== leftTime) {
      return rightTime - leftTime
    }

    return String(
      right.post?.id || ''
    ).localeCompare(
      String(left.post?.id || '')
    )
  })

  let authorIndex = -1

  return items.map((item, index) => {
    if (item.kind === 'author_post') {
      authorIndex += 1

      return {
        ...item,
        timelineIndex: index,
        authorIndex,
      }
    }

    return {
      ...item,
      timelineIndex: index,
      authorIndex: null,
    }
  })
}

async function fetchShadowMallPromotions(
  limit = 100
) {
  const response = await fetch(
    `${API_BASE_URL}/api/shadow-mall/promotions?limit=${encodeURIComponent(limit)}`,
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

async function fetchShadowMallStorySaleStatuses(
  token,
  promotions
) {
  const ids = [
    ...new Set(
      (promotions || [])
        .filter(
          (item) =>
            item?.promotion_type ===
              'story_sale' &&
            item?.story_id &&
            item?.id
        )
        .map((item) =>
          String(item.id)
        )
    ),
  ].slice(0, 100)

  if (!token || !ids.length) {
    return null
  }

  const params = new URLSearchParams({
    ids: ids.join(','),
  })

  const response = await fetch(
    `${API_BASE_URL}/api/shadow-mall/promotions/story-sale/statuses?${params.toString()}`,
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

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message ||
        'Failed to load story sale statuses'
    )
  }

  return data.statuses || {}
}

async function fetchShadowMallPromotionSocialStatuses(
  token,
  promotions
) {
  const ids = [
    ...new Set(
      (promotions || [])
        .map((item) => item?.id)
        .filter(Boolean)
        .map(String)
    ),
  ].slice(0, 100)

  if (!token || !ids.length) {
    return null
  }

  const params = new URLSearchParams({
    ids: ids.join(','),
  })

  const response = await fetch(
    `${API_BASE_URL}/api/shadow-mall/promotions/social-statuses?${params.toString()}`,
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

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message ||
        'Failed to load promotion social statuses'
    )
  }

  return data.statuses || {}
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



function MusicHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" />
    </svg>
  )
}

function SearchHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

function ChatHeaderIcon() {
  return (
    <Send size={20} strokeWidth={2.1} aria-hidden="true" />
  )
}

function Header({ hidden }) {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-[100000] border-b border-gray-50 bg-white transition-transform duration-200 ease-out dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]"
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      <div className="mx-auto flex h-[58px] w-full max-w-[620px] items-center justify-between px-4">
        <Link to="/" className="flex h-9 w-[92px] items-center overflow-visible">
          <img
            src="/assets/Icons/Logo Shadow 2.svg"
            alt="Shadow"
            className="h-full w-full object-contain object-left dark:brightness-0 dark:invert"
            loading="eager"
            decoding="async"
          />
        </Link>

        <div className="flex items-center gap-5">
          <Link
  to="/music"
  className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
  aria-label="Music"
>
  <MusicHeaderIcon />
</Link>

          <Link
            to="/discover/search"
            className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
            aria-label="Search"
          >
            <SearchHeaderIcon />
          </Link>

          <Link
  to="/chat"
  state={{ hideReaderFooter: true, fromDiscover: true }}
  className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
  aria-label="Chat"
>
  <ChatHeaderIcon />
</Link>
        </div>
      </div>
    </header>
  )
}

function RealPostImageGrid({
  images,
  authorName,
  onImageClick,
}) {
  const urls = Array.isArray(images)
    ? images.filter(Boolean).slice(0, 5)
    : []

  if (!urls.length) return null

  const alt = `${authorName || 'Author'} post`

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
        onImageClick?.(index)
      }
      className="block w-full"
    >
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-[260px] w-full object-cover sm:h-[310px]"
      />
    </button>
  )
)}
      </div>
    )
  }

  if (urls.length === 3) {
    return (
      <div className="grid h-[340px] grid-cols-2 gap-[2px] bg-gray-100 sm:h-[400px]">
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
    loading="lazy"
    decoding="async"
    className="h-full w-full object-cover"
  />
</button>

        <div className="grid min-h-0 grid-rows-2 gap-[2px]">
          {urls
  .slice(1)
  .map(
    (url, index) => (
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
          loading="lazy"
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

  const visibleUrls = urls.slice(0, 4)
  const hiddenCount = Math.max(0, urls.length - 4)

  return (
    <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
      {visibleUrls.map((url, index) => (
  <button
    key={url}
    type="button"
    onClick={() =>
      onImageClick?.(index)
    }
    className="relative block w-full"
  >
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-[210px] w-full object-cover sm:h-[250px]"
    />

    {index === 3 &&
    hiddenCount > 0 ? (
      <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[28px] font-black text-white">
        +{hiddenCount}
      </div>
    ) : null}
    </button>
))}
    </div>
  )
}



function RealFollowedPostCard({
  post,
  token,
  onReactionUpdated,
  onFollowChanged,
  onComment,
  onMore,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const author = post.author_page || {}
  const authorName = author.page_name || 'Author'
  const pageUsername = author.page_username || ''
  const pageUrl = pageUsername
    ? `/author/page/${encodeURIComponent(pageUsername)}`
    : '#'
  const firstLetter =
    authorName.trim().slice(0, 1).toUpperCase() || 'A'

  function openFullPost() {
  if (!post?.id) return

  navigate(
    `/author/post/${encodeURIComponent(
      post.id
    )}?source=${postSource}`,
    {
      state: {
        backgroundLocation: location,
      },
    }
  )
}

function openPhotoPost(index) {
  if (!post?.id) return

  navigate(
    `/author/post/${encodeURIComponent(
      post.id
    )}?photo=${index}&source=${postSource}`,
    {
      state: {
        backgroundLocation: location,
      },
    }
  )
}

  const [reactionBusy, setReactionBusy] = useState(false)
const [reactionError, setReactionError] = useState('')
const [followBusy, setFollowBusy] = useState(false)
const [followError, setFollowError] = useState('')

const isFollowing = Boolean(
  post.is_following ??
    author.is_following
)

const postSource =
  isFollowing ? 'follower_feed' : 'suggested'

const isOwner = Boolean(
  post.is_owner ??
    author.is_owner
)

  


  async function followAuthor(event) {
  event?.stopPropagation()

  if (
    followBusy ||
    isFollowing ||
    isOwner ||
    !pageUsername ||
    !author.id
  ) {
    return
  }

  try {
    setFollowBusy(true)
    setFollowError('')

    const response = await fetch(
      `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
        pageUsername
      )}/follow`,
    {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ source_post_id: post.id }),
}
    )

    const data = await response
      .json()
      .catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message ||
          'Failed to follow author'
      )
    }

    onFollowChanged?.(
      author.id,
      true
    )
  } catch (error) {
    setFollowError(
      error.message ||
        'Failed to follow author'
    )
  } finally {
    setFollowBusy(false)
  }
}
  
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

  return (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-[22px]">
      <div
  onClick={openFullPost}
  className="flex cursor-pointer items-start gap-2 px-4 pb-3 pt-4"
>
        <Link
  to={pageUrl}
  onClick={(event) =>
    event.stopPropagation()
  }
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
  <div className="min-w-0 text-[14px] leading-5">
    <Link
  to={pageUrl}
  onClick={(event) =>
    event.stopPropagation()
  }
  className="break-words font-semibold text-[#111827]"
>
      {authorName}
    </Link>

    {!isFollowing && !isOwner ? (
      <>
        <span className="px-1 text-[#65676b]">
          ·
        </span>

        <button
          type="button"
          disabled={followBusy}
          onClick={followAuthor}
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
    <span>{formatPostTime(post.created_at)}</span>
    <span>·</span>
    <i className="fa-solid fa-earth-americas text-[10px]" />
  </div>
</div>

            <button
  type="button"
  onClick={(event) => {
    event.stopPropagation()
    onMore?.(post)
  }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
              aria-label="More"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>
          </div>
        </div>
      </div>

      {post.content ? (
  <div className="px-4 pb-3">
    <AuthorDiscoverPostText
      text={post.content}
      renderText={(value) =>
  renderPostTextWithLinks(value, post.id)
}
      className="text-[14px] font-normal leading-6 text-[#111827]"
    />
  </div>
) : null}

      <RealPostImageGrid
  images={post.image_urls}
  authorName={authorName}
  onImageClick={openPhotoPost}
/>

      <div className="border-t border-gray-100 bg-white px-4 pb-1">
  <div className="flex items-center justify-between py-2 text-[12px] text-[#65676b]">
    <button
      type="button"
      onClick={() =>
        navigate(
          `/interactions/author_post/${post.id}/likes`,
          {
            state: {
              sourceName: authorName,
            },
          }
        )
      }
      className="active:opacity-60"
    >
      <ReactionSummary
  summary={post.reaction_summary}
  likeCount={post.like_count}
  myReaction={post.my_reaction}
/>
    </button>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onComment?.(post)}
        className="active:opacity-60"
      >
        {Number(post.comment_count || 0)} comments
      </button>

      <span>
        {Number(post.echo_count || 0)} echoes
      </span>
    </div>
  </div>

  <div className="grid h-11 grid-cols-3 items-stretch text-[14px] font-normal text-[#65676b]">
    <ReactionAction
      reactionType={post.my_reaction}
      count={post.like_count}
      busy={reactionBusy}
      showBusySpinner
      showCount={false}
      onReact={chooseReaction}
      idleLabel="Like"
      className="h-full w-full"
      buttonClassName="h-full w-full justify-center gap-2 text-[#65676b] active:bg-[#f2f2f2] dark:text-[var(--shadow-text-secondary)] dark:active:bg-[var(--shadow-bg-hover)] after:content-['Like']"
    />

    <button
      type="button"
      onClick={() => onComment?.(post)}
      className="flex h-full w-full items-center justify-center gap-2 active:bg-[#f2f2f2] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <i className="fa-regular fa-comment text-[18px]" />
      <span>Comment</span>
    </button>

    <AuthorPostEchoAction
      post={post}
      author={author}
      className="h-full w-full justify-center gap-2 active:bg-[#f2f2f2] dark:active:bg-[var(--shadow-bg-hover)] [&>span]:hidden after:content-['Echo'] after:text-[14px] after:font-normal after:text-[#65676b] dark:after:text-[var(--shadow-text-secondary)]"
    />
  </div>
</div>

      {followError || reactionError ? (
  <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-[11px] font-bold text-red-600">
    {followError || reactionError}
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
  const url = new URL(destination, window.location.origin)
  const internalHosts = new Set([
    window.location.hostname,
    'shadowerabook.site',
    'www.shadowerabook.site',
  ])

  if (internalHosts.has(url.hostname)) {
    return (
      <Link
        to={`${url.pathname}${url.search}${url.hash}`}
        className={className}
      >
        {children}
      </Link>
    )
  }

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

function DiamondPrice({
  value,
  oldPrice = false,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap ${
        oldPrice
          ? 'text-[11px] font-semibold text-gray-400 line-through'
          : 'text-[15px] font-black text-[#111827]'
      }`}
    >
      <span>{Number(value || 0)}</span>
      <img
        src="/assets/Icons/Diamond.svg"
        alt="Diamond"
        className={
          oldPrice
            ? 'h-[13px] w-[13px] object-contain opacity-70'
            : 'h-[16px] w-[16px] object-contain'
        }
      />
    </span>
  )
}

function AdsCard({ item, onMore, onHide }) {
  const token = getAuthToken()
  const isStorySale =
    item?.promotion_type === 'story_sale' &&
    Boolean(item?.story_id)
  const storyUrl = `/story/${item?.story_id || ''}`
  const destination = isStorySale
    ? storyUrl
    : item.link_url || '/shop'

  const [captionExpanded, setCaptionExpanded] =
    useState(false)
  const saleStatusLoaded = Boolean(
  item?.story_sale_status_loaded
)

const [saleStatus, setSaleStatus] =
  useState(
    item?.story_sale_status || null
  )
  const [statusLoading, setStatusLoading] =
    useState(false)
  const [purchaseBusy, setPurchaseBusy] =
    useState(false)
  const [confirmOpen, setConfirmOpen] =
    useState(false)
  const [message, setMessage] =
    useState('')
  const [errorMessage, setErrorMessage] =
    useState('')

  const description = String(item.description || '')
  const hasMoreDescription =
    description.length > 110

  const originalPrice = Number(
    saleStatus?.price?.original ??
      item?.original_price_diamonds ??
      0
  )
  const salePrice = Number(
    saleStatus?.price?.sale ??
      item?.sale_price_diamonds ??
      0
  )
  const walletBalance = Number(
    saleStatus?.wallet?.diamond_balance ?? 0
  )
  const owned = Boolean(saleStatus?.owned)
  const insufficientDiamonds = Boolean(
    token &&
      saleStatus &&
      walletBalance < salePrice
  )

  const discountPercent =
    originalPrice > 0 &&
    salePrice > 0 &&
    salePrice <= originalPrice
      ? Math.round(
          ((originalPrice - salePrice) /
            originalPrice) *
            100
        )
      : 0

  useEffect(() => {
    if (saleStatusLoaded) {
  setSaleStatus(
    item?.story_sale_status || null
  )
  setStatusLoading(false)
  return undefined
}
    if (!isStorySale || !token || !item?.id) {
      setSaleStatus(null)
      setStatusLoading(false)
      return undefined
    }

    let active = true
    const controller = new AbortController()

    async function loadSaleStatus() {
      try {
        setStatusLoading(true)
        setErrorMessage('')

        const response = await fetch(
          `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
            item.id
          )}/story-sale/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              'Failed to check purchase status'
          )
        }

        if (active) {
          setSaleStatus(data)
        }
      } catch (error) {
        if (
          active &&
          error.name !== 'AbortError'
        ) {
          setErrorMessage(
            error.message ||
              'Failed to check purchase status'
          )
        }
      } finally {
        if (active) {
          setStatusLoading(false)
        }
      }
    }

    loadSaleStatus()

    return () => {
      active = false
      controller.abort()
    }
  }, [
  isStorySale,
  item?.id,
  item?.story_sale_status,
  saleStatusLoaded,
  token,
])

  useEffect(() => {
    if (!confirmOpen) return undefined

    const previousOverflow =
      document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [confirmOpen])

  function openLogin() {
    window.location.assign('/login')
  }

  function openTopUp() {
    window.location.assign(
      '/shop/mall/purchase'
    )
  }

  function handleStoryAction() {
    setMessage('')
    setErrorMessage('')

    if (!token) {
      openLogin()
      return
    }

    if (owned) {
      window.location.assign(
        saleStatus?.story_url || storyUrl
      )
      return
    }

    if (insufficientDiamonds) {
      openTopUp()
      return
    }

    setConfirmOpen(true)
  }

  async function confirmPurchase() {
    if (
      purchaseBusy ||
      !token ||
      !item?.id
    ) {
      return
    }

    try {
      setPurchaseBusy(true)
      setMessage('')
      setErrorMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/shadow-mall/promotions/${encodeURIComponent(
          item.id
        )}/story-sale/purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      )
      const data = await response
        .json()
        .catch(() => ({}))

      if (
        response.status === 401 ||
        data.code === 'LOGIN_REQUIRED'
      ) {
        setConfirmOpen(false)
        openLogin()
        return
      }

      if (
        response.status === 402 ||
        data.code ===
          'INSUFFICIENT_DIAMONDS'
      ) {
        setConfirmOpen(false)
        setSaleStatus((current) => ({
          ...(current || {}),
          wallet:
            data.wallet ||
            current?.wallet ||
            null,
        }))
        setErrorMessage(
          `You need ${Number(
            data.need || 0
          )} more Diamonds.`
        )
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to purchase story'
        )
      }

      setConfirmOpen(false)
      setSaleStatus((current) => ({
        ...(current || {}),
        owned: true,
        purchased: !data.already_owned,
        button_state: 'read',
        story_url:
          data.story_url ||
          current?.story_url ||
          storyUrl,
        purchase: {
          id: data.purchase_id || null,
          paid_price_diamonds:
            data.paid_price_diamonds ||
            salePrice,
        },
        wallet:
          data.wallet ||
          current?.wallet ||
          null,
      }))
      setMessage(
        data.already_owned
          ? 'You already own this story.'
          : 'Story purchased successfully.'
      )

      window.dispatchEvent(
        new CustomEvent(
          'shadow-wallet-updated',
          {
            detail: data.wallet || null,
          }
        )
      )
    } catch (error) {
      setErrorMessage(
        error.message ||
          'Failed to purchase story'
      )
    } finally {
      setPurchaseBusy(false)
    }
  }

  return (
    <>
      <article
        id={`shadow-mall-promotion-${item.id}`}
        className="overflow-hidden bg-white ring-1 ring-gray-100 sm:rounded-[12px]"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-white">
            {item.profile_image_url ? (
              <img
                src={item.profile_image_url}
                alt={
                  item.sponsor ||
                  'Shadow Mall'
                }
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
              <span className="font-semibold">
                {item.title}
              </span>
            ) : null}

            {description ? (
              <>
                {item.title ? (
                  <span> · </span>
                ) : null}

                <span
  onClick={() => hasMoreDescription && setCaptionExpanded((v) => !v)}
  className={hasMoreDescription ? 'cursor-pointer' : ''}
>
                  {captionExpanded ||
                  !hasMoreDescription
                    ? description
                    : `${description
                        .slice(0, 110)
                        .trim()}...`}
                </span>

                {hasMoreDescription && !captionExpanded ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCaptionExpanded(
                        (current) => !current
                      )
                    }
                    className="ml-1 font-semibold text-gray-500"
                  >
                    more
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}

        <PromotionLink
          to={destination}
          className="block"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-[#111827]">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={
                  item.title ||
                  item.sponsor ||
                  'Shadow Mall promotion'
                }
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

        {isStorySale ? (
          <div className="border-b border-gray-100 bg-white px-4 py-3">
            <div className="flex min-h-[48px] items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[14px] font-semibold text-[#111827]">
                    {item.sponsor ||
                      'Shadow Mall'}
                  </span>

                  {discountPercent > 0 ? (
                    <span className="shrink-0 text-[10px] font-black text-[#dc2626]">
                      -{discountPercent}% OFF
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  {originalPrice >
                  salePrice ? (
                    <DiamondPrice
                      value={originalPrice}
                      oldPrice
                    />
                  ) : null}

                  <DiamondPrice
                    value={salePrice}
                  />
                </div>

                <button
                  type="button"
                  disabled={
                    statusLoading ||
                    purchaseBusy
                  }
                  onClick={handleStoryAction}
                  className="flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#111827] px-3.5 text-[12px] font-bold text-white active:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {statusLoading
                    ? 'Checking...'
                    : owned
                      ? 'Read Story'
                      : insufficientDiamonds
                        ? 'Top up'
                        : 'Buy now'}
                </button>
              </div>
            </div>

            {message ? (
              <div className="mt-2 text-[11px] font-semibold text-[#15803d]">
                {message}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-semibold text-[#dc2626]">
                <span>{errorMessage}</span>

                {insufficientDiamonds ? (
                  <button
                    type="button"
                    onClick={openTopUp}
                    className="shrink-0 font-black text-[#111827]"
                  >
                    Top up
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[58px] items-center justify-between gap-4 px-4 py-2.5">
            <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111827]">
              {item.sponsor || 'Shadow Mall'}
            </div>

            <PromotionLink
              to={destination}
              className="flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eef0f4] px-4 text-[12px] font-semibold text-[#111827] active:bg-[#e5e7eb]"
            >
              {item.button_text ||
                item.cta ||
                'Shop now'}
            </PromotionLink>
          </div>
        )}

        <ShadowMallPromotionSocial
          promotion={item}
        />
      </article>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/45 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm story purchase"
        >
          <button
            type="button"
            aria-label="Close purchase confirmation"
            className="absolute inset-0"
            onClick={() =>
              !purchaseBusy &&
              setConfirmOpen(false)
            }
          />

          <section className="relative z-10 w-full max-w-[420px] rounded-t-[22px] bg-white p-5 shadow-2xl sm:rounded-[22px]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

            <h2 className="m-0 text-[18px] font-black text-[#111827]">
              Confirm purchase
            </h2>

            <p className="mt-2 text-[13px] font-medium leading-5 text-gray-500">
              Purchase{' '}
              <span className="font-bold text-[#111827]">
                {item.title || 'this story'}
              </span>{' '}
              and permanently unlock all current
              and future episodes.
            </p>

            <div className="mt-4 rounded-[16px] bg-[#f8fafc] p-4 ring-1 ring-gray-100">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-semibold text-gray-500">
                  Price
                </span>

                <DiamondPrice
                  value={salePrice}
                />
              </div>

              {saleStatus ? (
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                  <span className="text-[12px] font-semibold text-gray-500">
                    Your balance
                  </span>

                  <DiamondPrice
                    value={walletBalance}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={purchaseBusy}
                onClick={() =>
                  setConfirmOpen(false)
                }
                className="h-11 rounded-[12px] border border-gray-200 bg-white text-[13px] font-bold text-[#111827] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={purchaseBusy}
                onClick={confirmPurchase}
                className="h-11 rounded-[12px] bg-[#111827] text-[13px] font-bold text-white active:bg-black disabled:opacity-60"
              >
                {purchaseBusy
                  ? 'Purchasing...'
                  : 'Confirm'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
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
  const [readerPosts, setReaderPosts] = useState([])
  const [readerPostsLoading, setReaderPostsLoading] = useState(true)
  const [readerPostsError, setReaderPostsError] = useState('')
  const [shadowMallPromotions, setShadowMallPromotions] = useState([])
  const authorFeedCacheReadyRef = useRef(false)
  const readerFeedCacheReadyRef = useRef(false)
  const authorFeedCacheSignatureRef = useRef('')
  const readerFeedCacheSignatureRef = useRef('')

  const uniqueShadowMallPromotions = useMemo(() => {
    const seenIds = new Set()

    return shadowMallPromotions.filter((promotion) => {
      const promotionId = String(
        promotion?.id ?? ''
      ).trim()

      if (!promotionId || seenIds.has(promotionId)) {
        return false
      }

      seenIds.add(promotionId)
      return true
    })
  }, [shadowMallPromotions])

  const firstShadowMallPromotion =
    uniqueShadowMallPromotions[0] || null

  const remainingShadowMallPromotions =
    uniqueShadowMallPromotions.filter(
      (promotion) =>
        String(promotion.id) !==
        String(firstShadowMallPromotion?.id)
    )

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
      const cacheKey =
        getShadowMallPromotionsCacheKey()

      try {
        const cached = await loadHomeCache(
          cacheKey,
          {
            maxAgeMs:
              DISCOVER_SHADOW_MALL_CACHE_MAX_AGE_MS,
            allowExpired: true,
          }
        )

        let promotions = Array.isArray(
          cached?.data
        )
          ? cached.data
          : null

        if (
          !cached?.isFresh ||
          !Array.isArray(promotions)
        ) {
          try {
            promotions =
              await fetchShadowMallPromotions(100)

            await saveHomeCache(
              cacheKey,
              promotions,
              {
                maxAgeMs:
                  DISCOVER_SHADOW_MALL_CACHE_MAX_AGE_MS,
              }
            )
          } catch (error) {
            if (!Array.isArray(promotions)) {
              throw error
            }
          }
        }

        const visiblePromotions =
          (promotions || []).filter(
            (promotion) =>
              promotion?.is_active !== false &&
              !isShadowMallAdHidden(
                promotion
              )
          )

        let statuses = null
        let socialStatuses = null

        if (token) {
          const [
            storyResult,
            socialResult,
          ] = await Promise.allSettled([
            fetchShadowMallStorySaleStatuses(
              token,
              visiblePromotions
            ),
            fetchShadowMallPromotionSocialStatuses(
              token,
              visiblePromotions
            ),
          ])

          statuses =
            storyResult.status === 'fulfilled'
              ? storyResult.value
              : null

          socialStatuses =
            socialResult.status === 'fulfilled'
              ? socialResult.value
              : null
        }

        if (!alive) return

        setShadowMallPromotions(
          visiblePromotions.map(
            (promotion) => {
              const key = String(
                promotion?.id || ''
              )

              const hasStatus =
                statuses &&
                Object.prototype.hasOwnProperty.call(
                  statuses,
                  key
                )

              const hasSocialStatus =
                socialStatuses &&
                Object.prototype.hasOwnProperty.call(
                  socialStatuses,
                  key
                )

              return {
                ...promotion,
                ...(hasStatus
                  ? {
                      story_sale_status:
                        statuses[key],
                      story_sale_status_loaded:
                        true,
                    }
                  : {}),
                ...(hasSocialStatus
                  ? socialStatuses[key]
                  : {}),
              }
            }
          )
        )
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
  }, [token])

    useEffect(() => {
    let alive = true

    async function loadReaderPosts() {
      if (!token) {
        if (alive) {
          setReaderPosts([])
          setReaderPostsLoading(false)
          setReaderPostsError('')
        }

        return
      }

      const cacheKey =
        getDiscoverFeedCacheKey(
          token,
          'discover-reader-feed',
          20
        )

      let hasCachedPayload = false

      try {
        const cached =
          await loadHomeCache(cacheKey, {
            maxAgeMs:
              DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
            allowExpired: true,
          })

        if (!alive) return

        if (
          Array.isArray(
            cached?.data?.posts
          )
        ) {
          hasCachedPayload = true
          const cachedPayload = {
            posts: cached.data.posts,
          }
          readerFeedCacheReadyRef.current =
            true
          readerFeedCacheSignatureRef.current =
            createDiscoverCacheSignature(
              cachedPayload
            )

          setReaderPosts(
            cached.data.posts
          )
          setReaderPostsLoading(false)
          setReaderPostsError('')

          if (cached.isFresh) {
            return
          }
        }

        if (!hasCachedPayload) {
          setReaderPostsLoading(true)
        }

        const data =
          await runDiscoverFeedRequest(
            `reader:${cacheKey}`,
            () => fetchReaderPosts(token)
          )

        if (!alive) return

        const nextPosts =
          Array.isArray(data.posts)
            ? data.posts
            : []

        setReaderPosts(nextPosts)
        setReaderPostsError('')

        const nextPayload = {
          posts: nextPosts,
        }

        await saveHomeCache(
          cacheKey,
          nextPayload,
          {
            maxAgeMs:
              DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
          }
        )

        readerFeedCacheReadyRef.current =
          true
        readerFeedCacheSignatureRef.current =
          createDiscoverCacheSignature(
            nextPayload
          )
      } catch (error) {
        if (!alive) return

        if (!hasCachedPayload) {
          setReaderPosts([])
          setReaderPostsError(
            error.message ||
              'Failed to load reader posts'
          )
        }
      } finally {
        if (alive) {
          setReaderPostsLoading(false)
        }
      }
    }

    loadReaderPosts()

    return () => {
      alive = false
    }
  }, [token])

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

      const cacheKey =
        getDiscoverFeedCacheKey(
          token,
          'discover-author-feed',
          10
        )

      let hasCachedPayload = false

      try {
        const cached =
          await loadHomeCache(cacheKey, {
            maxAgeMs:
              DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
            allowExpired: true,
          })

        if (!alive) return

        if (
          Array.isArray(
            cached?.data?.posts
          )
        ) {
          hasCachedPayload = true
          const cachedPosts =
            filterAuthorPostsByLocalPreferences(
              cached.data.posts
            )
          const cachedPayload = {
            posts: cachedPosts,
            next_cursor:
              cached.data.next_cursor || null,
            has_more: Boolean(
              cached.data.has_more &&
                cached.data.next_cursor
            ),
          }
          authorFeedCacheReadyRef.current =
            true
          authorFeedCacheSignatureRef.current =
            createDiscoverCacheSignature(
              cachedPayload
            )

          setRealPosts(cachedPosts)

          setRealPostsCursor(
            cached.data.next_cursor ||
              null
          )

          setRealPostsHasMore(
            Boolean(
              cached.data.has_more &&
                cached.data.next_cursor
            )
          )

          setRealPostsLoading(false)
          setRealPostsError('')

          if (cached.isFresh) {
            return
          }
        }

        if (!hasCachedPayload) {
          setRealPostsLoading(true)
        }

        const data =
          await runDiscoverFeedRequest(
            `author:${cacheKey}`,
            () =>
              fetchFollowedPosts(token)
          )

        if (!alive) return

        const nextPosts =
          Array.isArray(data.posts)
            ? data.posts
            : []

        const nextCursor =
          data.next_cursor || null

        const nextHasMore = Boolean(
          data.has_more &&
            data.next_cursor
        )

        setRealPosts(
          filterAuthorPostsByLocalPreferences(
            nextPosts
          )
        )

        setRealPostsCursor(
          nextCursor
        )

        setRealPostsHasMore(
          nextHasMore
        )

        setRealPostsError('')

        const nextPayload = {
          posts:
            filterAuthorPostsByLocalPreferences(
              nextPosts
            ),
          next_cursor: nextCursor,
          has_more: nextHasMore,
        }

        await saveHomeCache(
          cacheKey,
          nextPayload,
          {
            maxAgeMs:
              DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
          }
        )

        authorFeedCacheReadyRef.current =
          true
        authorFeedCacheSignatureRef.current =
          createDiscoverCacheSignature(
            nextPayload
          )
      } catch (error) {
        if (!alive) return

        if (!hasCachedPayload) {
          setRealPosts([])
          setRealPostsCursor(null)
          setRealPostsHasMore(false)
          setRealPostsError(
            error.message ||
              'Failed to load followed posts'
          )
        }
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

  useEffect(() => {
    if (
      !token ||
      !readerFeedCacheReadyRef.current
    ) {
      return undefined
    }

    const payload = {
      posts: readerPosts,
    }
    const signature =
      createDiscoverCacheSignature(payload)

    if (
      !signature ||
      signature ===
        readerFeedCacheSignatureRef.current
    ) {
      return undefined
    }

    const timer = window.setTimeout(
      () => {
        const cacheKey =
          getDiscoverFeedCacheKey(
            token,
            'discover-reader-feed',
            20
          )

        saveHomeCache(
          cacheKey,
          payload,
          {
            maxAgeMs:
              DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
          }
        ).then(() => {
          readerFeedCacheSignatureRef.current =
            signature
        })
      },
      DISCOVER_CACHE_WRITE_DELAY_MS
    )

    return () =>
      window.clearTimeout(timer)
  }, [token, readerPosts])

  useEffect(() => {
    if (
      !token ||
      !authorFeedCacheReadyRef.current
    ) {
      return undefined
    }

    const payload = {
      posts: realPosts,
      next_cursor: realPostsCursor,
      has_more: Boolean(
        realPostsHasMore &&
          realPostsCursor
      ),
    }
    const signature =
      createDiscoverCacheSignature(payload)

    if (
      !signature ||
      signature ===
        authorFeedCacheSignatureRef.current
    ) {
      return undefined
    }

    const timer = window.setTimeout(
      () => {
        const cacheKey =
          getDiscoverFeedCacheKey(
            token,
            'discover-author-feed',
            10
          )

        saveHomeCache(
          cacheKey,
          payload,
          {
            maxAgeMs:
              DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
          }
        ).then(() => {
          authorFeedCacheSignatureRef.current =
            signature
        })
      },
      DISCOVER_CACHE_WRITE_DELAY_MS
    )

    return () =>
      window.clearTimeout(timer)
  }, [
    token,
    realPosts,
    realPostsCursor,
    realPostsHasMore,
  ])

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

      const data = await fetchFollowedPosts(
        token
      )
      const nextPosts =
        filterAuthorPostsByLocalPreferences(
          Array.isArray(data.posts)
            ? data.posts
            : []
        )
      const nextCursor =
        data.next_cursor || null
      const nextHasMore = Boolean(
        data.has_more &&
          data.next_cursor
      )
      const payload = {
        posts: nextPosts,
        next_cursor: nextCursor,
        has_more: nextHasMore,
      }

      setRealPosts(nextPosts)
      setRealPostsCursor(nextCursor)
      setRealPostsHasMore(nextHasMore)

      await saveHomeCache(
        getDiscoverFeedCacheKey(
          token,
          'discover-author-feed',
          10
        ),
        payload,
        {
          maxAgeMs:
            DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
        }
      )

      authorFeedCacheReadyRef.current =
        true
      authorFeedCacheSignatureRef.current =
        createDiscoverCacheSignature(
          payload
        )
    } catch (error) {
      setRealPostsError(
        error.message ||
          'Failed to load followed posts'
      )
    } finally {
      setRealPostsLoading(false)
    }
  }

  async function retryReaderPosts() {
    if (!token) return

    try {
      setReaderPostsLoading(true)
      setReaderPostsError('')

      const data = await fetchReaderPosts(token)
      const nextPosts =
        Array.isArray(data.posts)
          ? data.posts
          : []
      const payload = {
        posts: nextPosts,
      }

      setReaderPosts(nextPosts)

      await saveHomeCache(
        getDiscoverFeedCacheKey(
          token,
          'discover-reader-feed',
          20
        ),
        payload,
        {
          maxAgeMs:
            DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS,
        }
      )

      readerFeedCacheReadyRef.current =
        true
      readerFeedCacheSignatureRef.current =
        createDiscoverCacheSignature(
          payload
        )
    } catch (error) {
      setReaderPostsError(
        error.message ||
          'Failed to load reader posts'
      )
    } finally {
      setReaderPostsLoading(false)
    }
  }

  async function retryDiscoverFeed() {
    await Promise.allSettled([
      retryRealPosts(),
      retryReaderPosts(),
    ])
  }



  const discoverTimeline = useMemo(
    () =>
      buildDiscoverTimeline(
        realPosts,
        readerPosts
      ),
    [realPosts, readerPosts]
  )

  const firstReaderPostIndex =
  discoverTimeline.findIndex(
    (entry) =>
      entry.kind === 'reader_post'
  )

  function handleReaderPostCreated(post) {
    if (!post?.id) return

    setReaderPosts((current) => [
      post,
      ...current.filter(
        (item) => item.id !== post.id
      ),
    ])
  }

  function handleReaderPostUpdated(post) {
  if (!post?.id) return

  setReaderPosts((current) =>
    current.map((item) =>
      item.id === post.id
        ? post
        : item
    )
  )
}

function handleReaderFollowChanged(
  userId,
  isFollowing
) {
  if (!userId) return

  setReaderPosts((current) =>
    current.map((post) =>
      String(post?.user_id || '') ===
      String(userId)
        ? {
            ...post,
            user: {
              ...(post.user || {}),
              is_following:
                Boolean(isFollowing),
            },
          }
        : post
    )
  )
}


  function removeReaderPost(postId) {
    setReaderPosts((current) =>
      current.filter(
        (post) => post.id !== postId
      )
    )
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
      String(post.author_page?.id || '') ===
      String(authorId)
        ? {
            ...post,
            is_following:
              Boolean(isFollowing),
            author_page: {
              ...post.author_page,
              is_following:
                Boolean(isFollowing),
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
    <div className="app-page min-h-screen bg-[#f5f3fa] pb-[100px] dark:bg-[var(--shadow-bg-page)]">
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
            <ReaderPostComposer
              onCreated={handleReaderPostCreated}
            />

            <div className="mt-1">
              <DiscoverStorySection />
            </div>
          </div>

          <section className="space-y-1 py-1 sm:space-y-1.5 sm:px-3 sm:py-1.5">
            {realPostsLoading ||
            readerPostsLoading ? (
              <>
                <RealPostSkeleton />
                <RealPostSkeleton />
              </>
            ) : null}

            {!realPostsLoading &&
            !readerPostsLoading &&
            !discoverTimeline.length &&
            (realPostsError ||
              readerPostsError) ? (
              <RealFeedErrorState
                onRetry={retryDiscoverFeed}
              />
            ) : null}

            {!realPostsLoading &&
            !readerPostsLoading &&
            !realPostsError &&
            !readerPostsError &&
            !discoverTimeline.length ? (
             <>
  <RealFeedEmptyState />

  <DiscoverYouMightLikeSection />

  {uniqueShadowMallPromotions.map(
    (promotion) => (
      <AdsCard
        key={`empty-feed-ad-${promotion.id}`}
        item={promotion}
        onMore={setAdOptionsItem}
        onHide={hideShadowMallPromotion}
      />
    )
  )}

</>
            ) : null}

            {discoverTimeline.map((entry) => (
              <Fragment
                key={`${entry.kind}-${entry.post.id}`}
              >
                {entry.kind === 'reader_post' ? (
                  <ReaderPostCard
  post={entry.post}
  onUpdated={handleReaderPostUpdated}
  onFollowChanged={handleReaderFollowChanged}
  onDeleted={removeReaderPost}
  onHidden={removeReaderPost}
/>
                ) : (
                  <RealFollowedPostCard
  post={entry.post}
  token={token}
  onReactionUpdated={
    handleRealPostReactionUpdated
  }
  onFollowChanged={
    updateAuthorFollowState
  }
  onComment={openPostComments}
  onMore={setOptionsPost}
/>
                )}

                {entry.kind === 'author_post' &&
                entry.authorIndex === 0 ? (
                  <DiscoverAuthorsYouMayLikeSection />
                ) : null}

                {entry.kind === 'reader_post' &&
                entry.timelineIndex ===
                  firstReaderPostIndex ? (
                  <DiscoverReadersYouMayLikeSection />
                ) : null}

                {entry.kind === 'author_post' &&
                entry.authorIndex === 0 ? (
                  <DiscoverTrendingStoriesSection />
                ) : null}

                

                {entry.kind === 'author_post' &&
                entry.authorIndex === 2 ? (
                  <DiscoverNewUpdatedStoriesSection />
                ) : null}

                {entry.timelineIndex === 3 ? (
  <>
    <DiscoverYouMightLikeSection />

    {firstShadowMallPromotion ? (
      <AdsCard
        item={firstShadowMallPromotion}
        onMore={setAdOptionsItem}
        onHide={hideShadowMallPromotion}
      />
    ) : null}

  </>
) : null}

                {entry.kind === 'author_post' &&
                entry.authorIndex === 4 ? (
                  <DiscoverCompletedStoriesSection />
                ) : null}
              </Fragment>
            ))}

            {discoverTimeline.length > 0 &&
discoverTimeline.length < 4 ? (
  <>
    <DiscoverYouMightLikeSection />

    {firstShadowMallPromotion ? (
      <AdsCard
        item={firstShadowMallPromotion}
        onMore={setAdOptionsItem}
        onHide={hideShadowMallPromotion}
      />
    ) : null}

  </>
) : null}

            {discoverTimeline.length &&
            !realPostsHasMore
              ? remainingShadowMallPromotions.map(
                  (promotion) => (
                    <AdsCard
                      key={`remaining-feed-ad-${promotion.id}`}
                      item={promotion}
                      onMore={setAdOptionsItem}
                      onHide={hideShadowMallPromotion}
                    />
                  )
                )
              : null}

            {readerPostsError &&
            discoverTimeline.length ? (
              <div className="rounded-[18px] bg-red-50 px-4 py-3 text-center text-[12px] font-normal text-red-600 ring-1 ring-red-100">
                {readerPostsError}
              </div>
            ) : null}

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

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
  ProfessionalSinglePostImage,
} from '../components/common/ProfessionalPostContent'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('discoverPage', {
  en: { justNow: 'Just now', minutesAgo: '{{count}}m', hoursAgo: '{{count}}h', daysAgo: '{{count}}d', author: 'Author', authorPost: '{{author}} post', music: 'Music', search: 'Search', chat: 'Chat', openAuthor: 'Open {{name}}', failedAuthorPosts: 'Failed to load author posts', failedReaderPosts: 'Failed to load reader posts', loginFirst: 'Please login first', failedReaction: 'Failed to update reaction', failedFollow: 'Failed to follow author', following: 'Following...', follow: 'Follow', more: 'More', comments: '{{count}} comments', echoes: '{{count}} echoes', like: 'Like', comment: 'Comment', noPosts: 'No posts yet', noPostsText: 'Follow authors to see their latest posts here.', findAuthors: 'Find authors', couldNotLoad: 'Could not load posts', connectionRetry: 'Check your connection and try again.', retry: 'Retry', failedPromotions: 'Failed to load Shadow Mall promotions', failedSaleStatus: 'Failed to load story sale statuses', failedSocialStatus: 'Failed to load promotion social statuses', failedPurchaseStatus: 'Failed to check purchase status', failedPurchase: 'Failed to purchase story', alreadyOwned: 'You already own this story.', purchaseSuccess: 'Story purchased successfully.', ad: 'Ad', sponsoredOptions: 'More sponsored options', hidePromotion: 'Hide sponsored promotion', promotionAlt: 'Shadow Mall promotion', moreCaption: 'more', off: 'OFF', checking: 'Checking...', readStory: 'Read Story', topUp: 'Top up', buyNow: 'Buy now', shopNow: 'Shop now', confirmStoryPurchase: 'Confirm story purchase', closePurchase: 'Close purchase confirmation', confirmPurchase: 'Confirm purchase', thisStory: 'this story', purchasePrefix: 'Purchase', purchaseSuffix: 'and permanently unlock all current and future episodes.', price: 'Price', balance: 'Your balance', cancel: 'Cancel', purchasing: 'Purchasing...', confirm: 'Confirm', loading: 'Loading', loadMorePosts: 'Load more posts', authorPostComments: 'Author post comments' },
  km: { justNow: 'ទើបតែឥឡូវនេះ', minutesAgo: '{{count}}នាទី', hoursAgo: '{{count}}ម៉ោង', daysAgo: '{{count}}ថ្ងៃ', author: 'អ្នកនិពន្ធ', authorPost: 'Post របស់ {{author}}', music: 'តន្ត្រី', search: 'ស្វែងរក', chat: 'Chat', openAuthor: 'បើក {{name}}', failedAuthorPosts: 'មិនអាចផ្ទុក Post អ្នកនិពន្ធបានទេ', failedReaderPosts: 'មិនអាចផ្ទុក Post អ្នកអានបានទេ', loginFirst: 'សូម Login ជាមុន', failedReaction: 'មិនអាច Update Reaction បានទេ', failedFollow: 'មិនអាច Follow អ្នកនិពន្ធបានទេ', following: 'កំពុង Follow...', follow: 'Follow', more: 'បន្ថែម', comments: '{{count}} មតិ', echoes: '{{count}} Echo', like: 'ចូលចិត្ត', comment: 'មតិ', noPosts: 'មិនទាន់មាន Post', noPostsText: 'Follow អ្នកនិពន្ធដើម្បីមើល Post ថ្មីៗនៅទីនេះ។', findAuthors: 'រកអ្នកនិពន្ធ', couldNotLoad: 'មិនអាចផ្ទុក Post បានទេ', connectionRetry: 'ពិនិត្យអ៊ីនធឺណិត ហើយសាកម្តងទៀត។', retry: 'សាកម្តងទៀត', failedPromotions: 'មិនអាចផ្ទុក Promotion របស់ Shadow Mall បានទេ', failedSaleStatus: 'មិនអាចពិនិត្យស្ថានភាពលក់រឿងបានទេ', failedSocialStatus: 'មិនអាចផ្ទុកស្ថានភាព Promotion បានទេ', failedPurchaseStatus: 'មិនអាចពិនិត្យស្ថានភាពការទិញបានទេ', failedPurchase: 'មិនអាចទិញរឿងបានទេ', alreadyOwned: 'អ្នកមានរឿងនេះរួចហើយ។', purchaseSuccess: 'បានទិញរឿងដោយជោគជ័យ។', ad: 'ពាណិជ្ជកម្ម', sponsoredOptions: 'ជម្រើសពាណិជ្ជកម្មបន្ថែម', hidePromotion: 'លាក់ Promotion នេះ', promotionAlt: 'Promotion របស់ Shadow Mall', moreCaption: 'បន្ថែម', off: 'បញ្ចុះ', checking: 'កំពុងពិនិត្យ...', readStory: 'អានរឿង', topUp: 'បញ្ចូល Diamond', buyNow: 'ទិញឥឡូវនេះ', shopNow: 'ទៅហាង', confirmStoryPurchase: 'បញ្ជាក់ការទិញរឿង', closePurchase: 'បិទការបញ្ជាក់ទិញ', confirmPurchase: 'បញ្ជាក់ការទិញ', thisStory: 'រឿងនេះ', purchasePrefix: 'ទិញ', purchaseSuffix: 'និងដោះសោជាអចិន្ត្រៃយ៍គ្រប់ភាគបច្ចុប្បន្ន និងភាគថ្មីនាពេលអនាគត។', price: 'តម្លៃ', balance: 'Diamond របស់អ្នក', cancel: 'បោះបង់', purchasing: 'កំពុងទិញ...', confirm: 'បញ្ជាក់', loading: 'កំពុងផ្ទុក', loadMorePosts: 'ផ្ទុក Post បន្ថែម', authorPostComments: 'មតិលើ Post អ្នកនិពន្ធ' },
  zh: { justNow: '刚刚', minutesAgo: '{{count}}分钟前', hoursAgo: '{{count}}小时前', daysAgo: '{{count}}天前', author: '作者', authorPost: '{{author}} 的帖子', music: '音乐', search: '搜索', chat: '聊天', openAuthor: '打开 {{name}}', failedAuthorPosts: '无法加载作者帖子', failedReaderPosts: '无法加载读者帖子', loginFirst: '请先登录', failedReaction: '无法更新反应', failedFollow: '无法关注作者', following: '关注中...', follow: '关注', more: '更多', comments: '{{count}} 条评论', echoes: '{{count}} 次 Echo', like: '赞', comment: '评论', noPosts: '暂无帖子', noPostsText: '关注作者后可在这里看到他们的最新帖子。', findAuthors: '发现作者', couldNotLoad: '无法加载帖子', connectionRetry: '请检查网络后重试。', retry: '重试', failedPromotions: '无法加载 Shadow Mall 推广', failedSaleStatus: '无法加载故事销售状态', failedSocialStatus: '无法加载推广互动状态', failedPurchaseStatus: '无法检查购买状态', failedPurchase: '无法购买故事', alreadyOwned: '你已经拥有这个故事。', purchaseSuccess: '故事购买成功。', ad: '广告', sponsoredOptions: '更多推广选项', hidePromotion: '隐藏推广', promotionAlt: 'Shadow Mall 推广', moreCaption: '更多', off: '优惠', checking: '检查中...', readStory: '阅读故事', topUp: '充值', buyNow: '立即购买', shopNow: '去购买', confirmStoryPurchase: '确认购买故事', closePurchase: '关闭购买确认', confirmPurchase: '确认购买', thisStory: '这个故事', purchasePrefix: '购买', purchaseSuffix: '并永久解锁当前和未来的所有章节。', price: '价格', balance: '你的余额', cancel: '取消', purchasing: '购买中...', confirm: '确认', loading: '加载中', loadMorePosts: '加载更多帖子', authorPostComments: '作者帖子评论' },
  ja: { justNow: 'たった今', minutesAgo: '{{count}}分前', hoursAgo: '{{count}}時間前', daysAgo: '{{count}}日前', author: '作者', authorPost: '{{author}} の投稿', music: '音楽', search: '検索', chat: 'チャット', openAuthor: '{{name}} を開く', failedAuthorPosts: '作者の投稿を読み込めませんでした', failedReaderPosts: '読者の投稿を読み込めませんでした', loginFirst: '先にログインしてください', failedReaction: 'リアクションを更新できませんでした', failedFollow: '作者をフォローできませんでした', following: 'フォロー中...', follow: 'フォロー', more: 'その他', comments: 'コメント {{count}}件', echoes: 'Echo {{count}}件', like: 'いいね', comment: 'コメント', noPosts: '投稿はまだありません', noPostsText: '作者をフォローすると最新投稿がここに表示されます。', findAuthors: '作者を探す', couldNotLoad: '投稿を読み込めませんでした', connectionRetry: '接続を確認してもう一度お試しください。', retry: '再試行', failedPromotions: 'Shadow Mall のプロモーションを読み込めませんでした', failedSaleStatus: 'ストーリー販売状態を読み込めませんでした', failedSocialStatus: 'プロモーションの状態を読み込めませんでした', failedPurchaseStatus: '購入状態を確認できませんでした', failedPurchase: 'ストーリーを購入できませんでした', alreadyOwned: 'このストーリーはすでに所有しています。', purchaseSuccess: 'ストーリーを購入しました。', ad: '広告', sponsoredOptions: 'スポンサーオプション', hidePromotion: 'プロモーションを非表示', promotionAlt: 'Shadow Mall プロモーション', moreCaption: 'もっと見る', off: 'OFF', checking: '確認中...', readStory: 'ストーリーを読む', topUp: 'チャージ', buyNow: '今すぐ購入', shopNow: 'ショップへ', confirmStoryPurchase: 'ストーリー購入を確認', closePurchase: '購入確認を閉じる', confirmPurchase: '購入を確認', thisStory: 'このストーリー', purchasePrefix: '購入:', purchaseSuffix: '現在および今後のすべてのエピソードを永久にアンロックします。', price: '価格', balance: '残高', cancel: 'キャンセル', purchasing: '購入中...', confirm: '確認', loading: '読み込み中', loadMorePosts: 'さらに投稿を読み込む', authorPostComments: '作者投稿のコメント' },
  ko: { justNow: '방금', minutesAgo: '{{count}}분 전', hoursAgo: '{{count}}시간 전', daysAgo: '{{count}}일 전', author: '작가', authorPost: '{{author}}의 게시물', music: '음악', search: '검색', chat: '채팅', openAuthor: '{{name}} 열기', failedAuthorPosts: '작가 게시물을 불러오지 못했습니다', failedReaderPosts: '독자 게시물을 불러오지 못했습니다', loginFirst: '먼저 로그인해 주세요', failedReaction: '리액션을 업데이트하지 못했습니다', failedFollow: '작가를 팔로우하지 못했습니다', following: '팔로우 중...', follow: '팔로우', more: '더 보기', comments: '댓글 {{count}}개', echoes: 'Echo {{count}}개', like: '좋아요', comment: '댓글', noPosts: '아직 게시물이 없습니다', noPostsText: '작가를 팔로우하면 최신 게시물이 여기에 표시됩니다.', findAuthors: '작가 찾기', couldNotLoad: '게시물을 불러오지 못했습니다', connectionRetry: '연결 상태를 확인하고 다시 시도해 주세요.', retry: '다시 시도', failedPromotions: 'Shadow Mall 프로모션을 불러오지 못했습니다', failedSaleStatus: '스토리 판매 상태를 불러오지 못했습니다', failedSocialStatus: '프로모션 상태를 불러오지 못했습니다', failedPurchaseStatus: '구매 상태를 확인하지 못했습니다', failedPurchase: '스토리를 구매하지 못했습니다', alreadyOwned: '이미 이 스토리를 보유하고 있습니다.', purchaseSuccess: '스토리를 구매했습니다.', ad: '광고', sponsoredOptions: '광고 옵션 더 보기', hidePromotion: '프로모션 숨기기', promotionAlt: 'Shadow Mall 프로모션', moreCaption: '더 보기', off: '할인', checking: '확인 중...', readStory: '스토리 읽기', topUp: '충전', buyNow: '지금 구매', shopNow: '쇼핑하기', confirmStoryPurchase: '스토리 구매 확인', closePurchase: '구매 확인 닫기', confirmPurchase: '구매 확인', thisStory: '이 스토리', purchasePrefix: '구매:', purchaseSuffix: '현재 및 앞으로 공개될 모든 에피소드를 영구적으로 잠금 해제합니다.', price: '가격', balance: '내 잔액', cancel: '취소', purchasing: '구매 중...', confirm: '확인', loading: '불러오는 중', loadMorePosts: '게시물 더 불러오기', authorPostComments: '작가 게시물 댓글' },
})

const DISPLAY_LOCALES = { en: 'en-US', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

function discoverText(key, options) {
  return getDisplayText(`discoverPage.${key}`, options)
}
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'
const DISCOVER_MAIN_FEED_CACHE_MAX_AGE_MS =
  5 * 60 * 1000
const DISCOVER_SHADOW_MALL_CACHE_MAX_AGE_MS =
  15 * 60 * 1000
const DISCOVER_SHADOW_MALL_SALE_STATUS_CACHE_MAX_AGE_MS =
  60 * 1000
const DISCOVER_SHADOW_MALL_SOCIAL_STATUS_CACHE_MAX_AGE_MS =
  2 * 60 * 1000
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

function getShadowMallPrivateStatusCacheKey(
  token,
  promotions,
  section
) {
  if (!token) return ''

  const promotionSignature = [
    ...new Set(
      (promotions || [])
        .map((promotion) => {
          const id = String(
            promotion?.id || ''
          ).trim()

          if (!id) return ''

          return `${id}:${Number(
            promotion?.visibility_version || 1
          )}`
        })
        .filter(Boolean)
    ),
  ]
    .sort()
    .join(',')

  if (!promotionSignature) return ''

  return getHomeCacheKey({
    section,
    scope: getDiscoverFeedScope(token),
    params: {
      promotions: promotionSignature,
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
  if (!timestamp) return discoverText('justNow')

  const difference = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return discoverText('justNow')
  if (minutes < 60) return discoverText('minutesAgo', { count: minutes })
  if (hours < 24) return discoverText('hoursAgo', { count: hours })
  if (days < 7) return discoverText('daysAgo', { count: days })

  const locale = DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(timestamp))
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
      data.message || discoverText('failedAuthorPosts')
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
        discoverText('failedReaderPosts')
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
  const newestPostId = [
    ...(Array.isArray(authorPosts)
      ? authorPosts
      : []),
    ...(Array.isArray(readerPosts)
      ? readerPosts
      : []),
  ]
    .filter(Boolean)
    .sort(
      (left, right) =>
        new Date(
          right.publish_at ||
            right.updated_at ||
            right.created_at ||
            0
        ).getTime() -
        new Date(
          left.publish_at ||
            left.updated_at ||
            left.created_at ||
            0
        ).getTime()
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
      data.message || discoverText('failedPromotions')
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
        discoverText('failedSaleStatus')
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
        discoverText('failedSocialStatus')
    )
  }

  return data.statuses || {}
}

async function loadShadowMallPrivateStatuses({
  token,
  promotions,
  section,
  maxAgeMs,
  fetcher,
}) {
  const cacheKey =
    getShadowMallPrivateStatusCacheKey(
      token,
      promotions,
      section
    )

  if (!cacheKey) {
    return {
      statuses: null,
      loaded: false,
    }
  }

  const cached = await loadHomeCache(
    cacheKey,
    {
      maxAgeMs,
      allowExpired: true,
    }
  )

  const cachedStatuses =
    cached?.data &&
    typeof cached.data === 'object' &&
    !Array.isArray(cached.data)
      ? cached.data
      : null

  if (
    cached?.isFresh &&
    cachedStatuses
  ) {
    return {
      statuses: cachedStatuses,
      loaded: true,
    }
  }

  try {
    const statuses =
      await runDiscoverFeedRequest(
        `shadow-mall-private:${cacheKey}`,
        () =>
          fetcher(
            token,
            promotions
          )
      )

    if (
      statuses &&
      typeof statuses === 'object' &&
      !Array.isArray(statuses)
    ) {
      await saveHomeCache(
        cacheKey,
        statuses,
        {
          maxAgeMs,
        }
      )

      return {
        statuses,
        loaded: true,
      }
    }
  } catch {
    return {
      statuses: cachedStatuses,
      loaded: Boolean(cachedStatuses),
    }
  }

  return {
    statuses: cachedStatuses,
    loaded: Boolean(cachedStatuses),
  }
}

async function patchShadowMallPrivateStatusCache({
  token,
  promotions,
  section,
  maxAgeMs,
  promotionId,
  changes,
}) {
  const cacheKey =
    getShadowMallPrivateStatusCacheKey(
      token,
      promotions,
      section
    )

  const id = String(
    promotionId || ''
  ).trim()

  if (!cacheKey || !id) return

  const cached = await loadHomeCache(
    cacheKey,
    {
      maxAgeMs,
      allowExpired: true,
    }
  )

  if (
    !cached?.isFresh ||
    !cached?.data ||
    typeof cached.data !== 'object' ||
    Array.isArray(cached.data)
  ) {
    return
  }

  const statuses = {
    ...cached.data,
  }

  statuses[id] = {
    ...(statuses[id] || {}),
    ...(changes || {}),
  }

  await saveHomeCache(
    cacheKey,
    statuses,
    {
      maxAgeMs,
    }
  )
}

async function setFollowedPostReaction(
  token,
  postId,
  reactionType = 'love'
) {
  if (!token) {
    throw new Error(discoverText('loginFirst'))
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
    throw new Error(data.message || discoverText('failedReaction'))
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
  aria-label={discoverText('music')}
>
  <MusicHeaderIcon />
</Link>

          <Link
            to="/discover/search"
            className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
            aria-label={discoverText('search')}
          >
            <SearchHeaderIcon />
          </Link>

          <Link
  to="/chat"
  state={{ hideReaderFooter: true, fromDiscover: true }}
  className="flex h-6 w-6 items-center justify-center text-[#111827] transition-transform active:scale-95 dark:text-[var(--shadow-text-primary)]"
  aria-label={discoverText('chat')}
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

  const alt = discoverText('authorPost', { author: authorName || discoverText('author') })

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
      <div className="grid grid-cols-2 gap-[2px] bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]">
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
      <div className="grid h-[340px] grid-cols-2 gap-[2px] bg-gray-100 dark:bg-[var(--shadow-bg-elevated)] sm:h-[400px]">
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
    <div className="grid grid-cols-2 gap-[2px] bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]">
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
  const authorName = author.page_name || discoverText('author')
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
          discoverText('failedFollow')
      )
    }

    onFollowChanged?.(
      author.id,
      true
    )
  } catch (error) {
    setFollowError(
      error.message ||
        discoverText('failedFollow')
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
        error.message || discoverText('failedReaction')
      )
    } finally {
      setReactionBusy(false)
    }
  }

  return (
    <article className="overflow-hidden bg-white dark:bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-gray-100 dark:ring-[var(--shadow-border)] sm:rounded-[22px]">
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
          aria-label={discoverText('openAuthor', { name: authorName })}
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
  className="break-words font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]"
>
      {authorName}
    </Link>

    {!isFollowing && !isOwner ? (
      <>
        <span className="px-1 text-[#65676b] dark:text-[var(--shadow-text-secondary)]">
          ·
        </span>

        <button
          type="button"
          disabled={followBusy}
          onClick={followAuthor}
          className="font-semibold text-[#1877f2] active:opacity-60 disabled:opacity-60"
        >
          {followBusy
            ? discoverText('following')
            : discoverText('follow')}
        </button>
      </>
    ) : null}
  </div>

  <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400 dark:text-[var(--shadow-text-tertiary)]">
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
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 dark:text-[var(--shadow-text-tertiary)] active:bg-gray-100"
              aria-label={discoverText('more')}
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
      className="text-[14px] font-normal leading-6 text-[#111827] dark:text-[var(--shadow-text-primary)]"
    />
  </div>
) : null}

      <RealPostImageGrid
  images={post.image_urls}
  authorName={authorName}
  onImageClick={openPhotoPost}
/>

      <div className="border-t border-gray-100 dark:border-[var(--shadow-border)] bg-white dark:bg-[var(--shadow-bg-surface)] px-4 pb-1">
  <div className="flex items-center justify-between py-2 text-[12px] text-[#65676b] dark:text-[var(--shadow-text-secondary)]">
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
        {discoverText('comments', { count: Number(post.comment_count || 0) })}
      </button>

      <span>
        {discoverText('echoes', { count: Number(post.echo_count || 0) })}
      </span>
    </div>
  </div>

  <div className="grid h-11 grid-cols-3 items-stretch text-[14px] font-normal text-[#65676b] dark:text-[var(--shadow-text-secondary)]">
    <ReactionAction
      reactionType={post.my_reaction}
      count={post.like_count}
      busy={reactionBusy}
      showBusySpinner
      showCount={false}
      onReact={chooseReaction}
      idleLabel={discoverText('like')}
      className="h-full w-full"
      buttonClassName="h-full w-full justify-center gap-2 text-[#65676b] dark:text-[var(--shadow-text-secondary)] active:bg-[#f2f2f2] dark:text-[var(--shadow-text-secondary)] dark:active:bg-[var(--shadow-bg-hover)]"
    />

    <button
      type="button"
      onClick={() => onComment?.(post)}
      className="flex h-full w-full items-center justify-center gap-2 active:bg-[#f2f2f2] dark:active:bg-[var(--shadow-bg-hover)]"
    >
      <i className="fa-regular fa-comment text-[18px]" />
      <span>{discoverText('comment')}</span>
    </button>

    <AuthorPostEchoAction
      post={post}
      author={author}
      className="h-full w-full justify-center gap-2 active:bg-[#f2f2f2] dark:active:bg-[var(--shadow-bg-hover)] [&>span]:inline"
    />
  </div>
</div>

      {followError || reactionError ? (
  <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-center text-[11px] font-bold text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
    {followError || reactionError}
  </div>
) : null}
    </article>
  )
}

function RealPostSkeleton() {
  return (
    <article className="overflow-hidden bg-white dark:bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-gray-100 dark:ring-[var(--shadow-border)] sm:rounded-[22px]">
      <div className="flex animate-pulse items-start gap-3 p-4">
        <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200 dark:bg-[var(--shadow-bg-elevated)]" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[var(--shadow-bg-elevated)]" />
          <div className="mt-2 h-3 w-24 rounded bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
          <div className="mt-5 h-3 w-full rounded bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
          <div className="mt-2 h-3 w-4/5 rounded bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
        </div>
      </div>

      <div className="h-[230px] animate-pulse bg-gray-100 dark:bg-[var(--shadow-bg-elevated)]" />
    </article>
  )
}

function RealFeedEmptyState() {
  return (
    <article className="bg-white dark:bg-[var(--shadow-bg-surface)] p-7 text-center shadow-sm ring-1 ring-gray-100 dark:ring-[var(--shadow-border)] sm:rounded-[22px]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edfb] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#b8a2ff]">
        <i className="fa-solid fa-user-plus text-xl" />
      </div>

      <div className="mt-4 text-[17px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
        {discoverText('noPosts')}
      </div>

      <div className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-gray-500 dark:text-[var(--shadow-text-secondary)]">
        {discoverText('noPostsText')}
      </div>

      <Link
        to="/authors/top"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        {discoverText('findAuthors')}
      </Link>
    </article>
  )
}

function RealFeedErrorState({ onRetry }) {
  return (
    <article className="bg-white dark:bg-[var(--shadow-bg-surface)] p-7 text-center shadow-sm ring-1 ring-gray-100 dark:ring-[var(--shadow-border)] sm:rounded-[22px]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-400/10 dark:text-red-300">
        <i className="fa-solid fa-triangle-exclamation text-xl" />
      </div>

      <div className="mt-4 text-[17px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
        {discoverText('couldNotLoad')}
      </div>

      <div className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-gray-500 dark:text-[var(--shadow-text-secondary)]">
        {discoverText('connectionRetry')}
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        {discoverText('retry')}
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
          ? 'text-[11px] font-semibold text-gray-400 dark:text-[var(--shadow-text-tertiary)] line-through'
          : 'text-[15px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]'
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

function AdsCard({
  item,
  onMore,
  onHide,
  onStorySaleStatusChanged,
}) {
  const navigate = useNavigate()
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
              discoverText('failedPurchaseStatus')
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
              discoverText('failedPurchaseStatus')
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
    navigate('/login')
  }

  function openTopUp() {
    navigate('/shop/mall/purchase')
  }

  function handleStoryAction() {
    setMessage('')
    setErrorMessage('')

    if (!token) {
      openLogin()
      return
    }

    if (owned) {
      navigate(
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
            discoverText('failedPurchase')
        )
      }

      setConfirmOpen(false)

      const nextSaleStatus = {
        ...(saleStatus || {}),
        owned: true,
        purchased: !data.already_owned,
        button_state: 'read',
        story_url:
          data.story_url ||
          saleStatus?.story_url ||
          storyUrl,
        purchase: {
          id: data.purchase_id || null,
          paid_price_diamonds:
            data.paid_price_diamonds ||
            salePrice,
        },
        wallet:
          data.wallet ||
          saleStatus?.wallet ||
          null,
      }

      setSaleStatus(nextSaleStatus)
      onStorySaleStatusChanged?.(
        item.id,
        nextSaleStatus
      )
      setMessage(
        data.already_owned
          ? discoverText('alreadyOwned')
          : discoverText('purchaseSuccess')
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
          discoverText('failedPurchase')
      )
    } finally {
      setPurchaseBusy(false)
    }
  }

  return (
    <>
      <article
        id={`shadow-mall-promotion-${item.id}`}
        className="overflow-hidden bg-white dark:bg-[var(--shadow-bg-surface)] ring-1 ring-gray-100 dark:ring-[var(--shadow-border)] sm:rounded-[12px]"
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
            <div className="truncate text-[14px] font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {item.sponsor || 'Shadow Mall'}
            </div>

            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-gray-400 dark:text-[var(--shadow-text-tertiary)]">
              <span>{discoverText('ad')}</span>
              <span>·</span>
              <i className="fa-solid fa-earth-americas text-[10px]" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onMore?.(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 dark:text-[var(--shadow-text-tertiary)] active:bg-gray-100"
            aria-label={discoverText('sponsoredOptions')}
          >
            <i className="fa-solid fa-ellipsis text-[13px]" />
          </button>

          <button
            type="button"
            onClick={() => onHide?.(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 dark:text-[var(--shadow-text-tertiary)] active:bg-gray-100"
            aria-label={discoverText('hidePromotion')}
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </div>

        {item.title || description ? (
          <div className="px-4 pb-3 text-[13px] font-normal leading-5 text-[#111827] dark:text-[var(--shadow-text-primary)]">
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
                    className="ml-1 font-semibold text-gray-500 dark:text-[var(--shadow-text-secondary)]"
                  >
                    {discoverText('moreCaption')}
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
                  discoverText('promotionAlt')
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
          <div className="border-b border-gray-100 dark:border-[var(--shadow-border)] bg-white dark:bg-[var(--shadow-bg-surface)] px-4 py-3">
            <div className="flex min-h-[48px] items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[14px] font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                    {item.sponsor ||
                      'Shadow Mall'}
                  </span>

                  {discountPercent > 0 ? (
                    <span className="shrink-0 text-[10px] font-black text-[#dc2626]">
                      -{discountPercent}% {discoverText('off')}
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
                    ? discoverText('checking')
                    : owned
                      ? discoverText('readStory')
                      : insufficientDiamonds
                        ? discoverText('topUp')
                        : discoverText('buyNow')}
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
                    className="shrink-0 font-black text-[#111827] dark:text-[var(--shadow-text-primary)]"
                  >
                    {discoverText('topUp')}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[58px] items-center justify-between gap-4 px-4 py-2.5">
            <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {item.sponsor || 'Shadow Mall'}
            </div>

            <PromotionLink
              to={destination}
              className="flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#eef0f4] px-4 text-[12px] font-semibold text-[#111827] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)] active:bg-[#e5e7eb]"
            >
              {item.button_text ||
                item.cta ||
                discoverText('shopNow')}
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
          aria-label={discoverText('confirmStoryPurchase')}
        >
          <button
            type="button"
            aria-label={discoverText('closePurchase')}
            className="absolute inset-0"
            onClick={() =>
              !purchaseBusy &&
              setConfirmOpen(false)
            }
          />

          <section className="relative z-10 w-full max-w-[420px] rounded-t-[22px] bg-white dark:bg-[var(--shadow-bg-surface)] p-5 shadow-2xl sm:rounded-[22px]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 dark:bg-[var(--shadow-bg-elevated)] sm:hidden" />

            <h2 className="m-0 text-[18px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {discoverText('confirmPurchase')}
            </h2>

            <p className="mt-2 text-[13px] font-medium leading-5 text-gray-500 dark:text-[var(--shadow-text-secondary)]">
              {discoverText('purchasePrefix')}{' '}
              <span className="font-bold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                {item.title || discoverText('thisStory')}
              </span>{' '}
              {discoverText('purchaseSuffix')}
            </p>

            <div className="mt-4 rounded-[16px] bg-[#f8fafc] p-4 dark:bg-[var(--shadow-bg-elevated)] ring-1 ring-gray-100 dark:ring-[var(--shadow-border)]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-semibold text-gray-500 dark:text-[var(--shadow-text-secondary)]">
                  {discoverText('price')}
                </span>

                <DiamondPrice
                  value={salePrice}
                />
              </div>

              {saleStatus ? (
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-200 dark:border-[var(--shadow-border)] pt-3">
                  <span className="text-[12px] font-semibold text-gray-500 dark:text-[var(--shadow-text-secondary)]">
                    {discoverText('balance')}
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
                className="h-11 rounded-[12px] border border-gray-200 dark:border-[var(--shadow-border)] bg-white dark:bg-[var(--shadow-bg-surface)] text-[13px] font-bold text-[#111827] dark:text-[var(--shadow-text-primary)] disabled:opacity-60"
              >
                {discoverText('cancel')}
              </button>

              <button
                type="button"
                disabled={purchaseBusy}
                onClick={confirmPurchase}
                className="h-11 rounded-[12px] bg-[#111827] text-[13px] font-bold text-white active:bg-black disabled:opacity-60"
              >
                {purchaseBusy
                  ? discoverText('purchasing')
                  : discoverText('confirm')}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}



function applyAuthorPostLocalState(
  posts,
  postOverrides,
  followOverrides
) {
  return filterAuthorPostsByLocalPreferences(
    Array.isArray(posts) ? posts : []
  ).map((post) => {
    const postId = String(
      post?.id || ''
    )

    const override =
      postOverrides.get(postId) || null

    let nextPost = override
      ? {
          ...post,
          ...override,
          author_page: {
            ...(post.author_page || {}),
            ...(override.author_page || {}),
          },
        }
      : post

    const authorId = String(
      nextPost?.author_page?.id || ''
    )

    if (
      authorId &&
      followOverrides.has(authorId)
    ) {
      const isFollowing = Boolean(
        followOverrides.get(authorId)
      )

      nextPost = {
        ...nextPost,
        is_following: isFollowing,
        author_page: {
          ...(nextPost.author_page || {}),
          is_following: isFollowing,
        },
      }
    }

    return nextPost
  })
}

function mergeReaderPostOverride(
  post,
  override
) {
  if (!override) return post

  return {
    ...(post || {}),
    ...override,
    user: {
      ...(post?.user || {}),
      ...(override?.user || {}),
    },
  }
}

function applyReaderPostLocalState(
  posts,
  postOverrides,
  hiddenIds,
  localOrder
) {
  const result = []
  const seen = new Set()

  function append(post) {
    const id = String(
      post?.id || ''
    )

    if (
      !id ||
      seen.has(id) ||
      hiddenIds.has(id)
    ) {
      return
    }

    const override =
      postOverrides.get(id) || null

    result.push(
      mergeReaderPostOverride(
        post,
        override
      )
    )
    seen.add(id)
  }

  for (const id of localOrder) {
    const override =
      postOverrides.get(String(id))

    if (override) {
      append(override)
    }
  }

  for (
    const post of
      Array.isArray(posts) ? posts : []
  ) {
    append(post)
  }

  return result
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

function DeferredDiscoverSection({
  children,
}) {
  const markerRef = useRef(null)
  const [ready, setReady] =
    useState(false)

  useEffect(() => {
    if (ready) return undefined

    const element = markerRef.current

    if (!element) return undefined

    if (
      typeof IntersectionObserver ===
      'undefined'
    ) {
      setReady(true)
      return undefined
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries.some(
              (entry) =>
                entry.isIntersecting
            )
          ) {
            setReady(true)
            observer.disconnect()
          }
        },
        {
          rootMargin: '500px 0px',
          threshold: 0.01,
        }
      )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ready])

  return (
    <div
      ref={markerRef}
      className="min-h-px"
    >
      {ready ? children : null}
    </div>
  )
}

export default function DiscoverPage() {
  useDisplayTranslation()
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
  const shadowMallPromotionsRef =
    useRef([])
  const authorFeedCacheReadyRef = useRef(false)
  const readerFeedCacheReadyRef = useRef(false)
  const authorFeedCacheSignatureRef = useRef('')
  const readerFeedCacheSignatureRef = useRef('')
  const authorPostOverridesRef =
    useRef(new Map())
  const authorFollowOverridesRef =
    useRef(new Map())
  const readerPostOverridesRef =
    useRef(new Map())
  const hiddenReaderPostIdsRef =
    useRef(new Set())
  const localReaderPostOrderRef =
    useRef([])

  useEffect(() => {
    shadowMallPromotionsRef.current =
      shadowMallPromotions
  }, [shadowMallPromotions])

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
  await runDiscoverFeedRequest(
    `shadow-mall-public:${cacheKey}`,
    () => fetchShadowMallPromotions(100)
  )

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

        let storyStatusState = {
          statuses: null,
          loaded: false,
        }
        let socialStatusState = {
          statuses: null,
          loaded: false,
        }

        if (token) {
          const [
            storyResult,
            socialResult,
          ] = await Promise.allSettled([
            loadShadowMallPrivateStatuses({
              token,
              promotions:
                visiblePromotions,
              section:
                'discover-promotion-story-sale-statuses',
              maxAgeMs:
                DISCOVER_SHADOW_MALL_SALE_STATUS_CACHE_MAX_AGE_MS,
              fetcher:
                fetchShadowMallStorySaleStatuses,
            }),
            loadShadowMallPrivateStatuses({
              token,
              promotions:
                visiblePromotions,
              section:
                'discover-promotion-social-statuses',
              maxAgeMs:
                DISCOVER_SHADOW_MALL_SOCIAL_STATUS_CACHE_MAX_AGE_MS,
              fetcher:
                fetchShadowMallPromotionSocialStatuses,
            }),
          ])

          if (
            storyResult.status ===
            'fulfilled'
          ) {
            storyStatusState =
              storyResult.value
          }

          if (
            socialResult.status ===
            'fulfilled'
          ) {
            socialStatusState =
              socialResult.value
          }
        }

        if (!alive) return

        const statuses =
          storyStatusState.statuses
        const socialStatuses =
          socialStatusState.statuses

        const nextPromotions =
          visiblePromotions.map(
            (promotion) => {
              const key = String(
                promotion?.id || ''
              )

              const isStorySale =
                promotion?.promotion_type ===
                  'story_sale' &&
                Boolean(
                  promotion?.story_id
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
                    }
                  : {}),
                ...(token &&
                isStorySale &&
                storyStatusState.loaded
                  ? {
                      story_sale_status_loaded:
                        true,
                    }
                  : {}),
                ...(hasSocialStatus
                  ? socialStatuses[key]
                  : {}),
                ...(token &&
                socialStatusState.loaded
                  ? {
                      reaction_state_loaded:
                        true,
                      echo_state_loaded:
                        true,
                    }
                  : {}),
              }
            }
          )

        shadowMallPromotionsRef.current =
          nextPromotions
        setShadowMallPromotions(
          nextPromotions
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
          const cachedPosts =
            applyReaderPostLocalState(
              cached.data.posts,
              readerPostOverridesRef.current,
              hiddenReaderPostIdsRef.current,
              localReaderPostOrderRef.current
            )

          const cachedPayload = {
            posts: cachedPosts,
          }
          readerFeedCacheReadyRef.current =
            true
          readerFeedCacheSignatureRef.current =
            createDiscoverCacheSignature(
              cachedPayload
            )

          setReaderPosts(
            cachedPosts
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
          applyReaderPostLocalState(
            Array.isArray(data.posts)
              ? data.posts
              : [],
            readerPostOverridesRef.current,
            hiddenReaderPostIdsRef.current,
            localReaderPostOrderRef.current
          )

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
              discoverText('failedReaderPosts')
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
            applyAuthorPostLocalState(
              cached.data.posts,
              authorPostOverridesRef.current,
              authorFollowOverridesRef.current
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
          applyAuthorPostLocalState(
            Array.isArray(data.posts)
              ? data.posts
              : [],
            authorPostOverridesRef.current,
            authorFollowOverridesRef.current
          )

        const nextCursor =
          data.next_cursor || null

        const nextHasMore = Boolean(
          data.has_more &&
            data.next_cursor
        )

        setRealPosts(nextPosts)

        setRealPostsCursor(
          nextCursor
        )

        setRealPostsHasMore(
          nextHasMore
        )

        setRealPostsError('')

        const nextPayload = {
          posts: nextPosts,
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

      const cacheKey =
        getDiscoverFeedCacheKey(
          token,
          'discover-author-feed',
          10
        )

      const data =
        await runDiscoverFeedRequest(
          `author-more:${cacheKey}:${realPostsCursor}`,
          () =>
            fetchFollowedPosts(
              token,
              realPostsCursor
            )
        )

      const incomingPosts =
        applyAuthorPostLocalState(
          Array.isArray(data.posts)
            ? data.posts
            : [],
          authorPostOverridesRef.current,
          authorFollowOverridesRef.current
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

    const cacheKey =
      getDiscoverFeedCacheKey(
        token,
        'discover-author-feed',
        10
      )

    try {
      setRealPostsLoading(true)
      setRealPostsError('')

      const data =
        await runDiscoverFeedRequest(
          `author:${cacheKey}`,
          () => fetchFollowedPosts(token)
        )

      const nextPosts =
        applyAuthorPostLocalState(
          Array.isArray(data.posts)
            ? data.posts
            : [],
          authorPostOverridesRef.current,
          authorFollowOverridesRef.current
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
        cacheKey,
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

    const cacheKey =
      getDiscoverFeedCacheKey(
        token,
        'discover-reader-feed',
        20
      )

    try {
      setReaderPostsLoading(true)
      setReaderPostsError('')

      const data =
        await runDiscoverFeedRequest(
          `reader:${cacheKey}`,
          () => fetchReaderPosts(token)
        )

      const nextPosts =
        applyReaderPostLocalState(
          Array.isArray(data.posts)
            ? data.posts
            : [],
          readerPostOverridesRef.current,
          hiddenReaderPostIdsRef.current,
          localReaderPostOrderRef.current
        )

      const payload = {
        posts: nextPosts,
      }

      setReaderPosts(nextPosts)

      await saveHomeCache(
        cacheKey,
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
          discoverText('failedReaderPosts')
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

    const id = String(post.id)

    hiddenReaderPostIdsRef.current.delete(
      id
    )
    readerPostOverridesRef.current.set(
      id,
      post
    )
    localReaderPostOrderRef.current = [
      id,
      ...localReaderPostOrderRef.current.filter(
        (itemId) =>
          String(itemId) !== id
      ),
    ]

    setReaderPosts((current) => [
      post,
      ...current.filter(
        (item) =>
          String(item.id) !== id
      ),
    ])
  }

  function handleReaderPostUpdated(post) {
    if (!post?.id) return

    const id = String(post.id)

    hiddenReaderPostIdsRef.current.delete(
      id
    )
    readerPostOverridesRef.current.set(
      id,
      post
    )

    setReaderPosts((current) =>
      current.map((item) =>
        String(item.id) === id
          ? mergeReaderPostOverride(
              item,
              post
            )
          : item
      )
    )
  }

  function handleReaderFollowChanged(
    userId,
    isFollowing
  ) {
    const ownerId = String(
      userId || ''
    )

    if (!ownerId) return

    setReaderPosts((current) =>
      current.map((post) => {
        if (
          String(
            post?.user_id || ''
          ) !== ownerId
        ) {
          return post
        }

        const nextPost = {
          ...post,
          user: {
            ...(post.user || {}),
            is_following:
              Boolean(isFollowing),
          },
        }

        if (post?.id) {
          readerPostOverridesRef.current.set(
            String(post.id),
            nextPost
          )
        }

        return nextPost
      })
    )
  }

  function removeReaderPost(postId) {
    const id = String(
      postId || ''
    )

    if (!id) return

    hiddenReaderPostIdsRef.current.add(
      id
    )
    readerPostOverridesRef.current.delete(
      id
    )
    localReaderPostOrderRef.current =
      localReaderPostOrderRef.current.filter(
        (itemId) =>
          String(itemId) !== id
      )

    setReaderPosts((current) =>
      current.filter(
        (post) =>
          String(post.id) !== id
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

    const existingOverride =
      authorPostOverridesRef.current.get(
        String(activePostId)
      ) || {}

    authorPostOverridesRef.current.set(
      String(activePostId),
      {
        ...existingOverride,
        comment_count: nextCount,
      }
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

  function handleRealPostReactionUpdated(
    postId,
    data
  ) {
    const id = String(
      postId || ''
    )

    if (!id) return

    setRealPosts((current) =>
      current.map((post) => {
        if (
          String(post.id) !== id
        ) {
          return post
        }

        const updatedPost =
          data.post || {}

        const nextPost = {
          ...post,
          ...updatedPost,
          author_page: {
            ...(post.author_page || {}),
            ...(updatedPost.author_page ||
              {}),
          },
          my_reaction:
            data.reaction_type || null,
          like_count: Number(
            data.like_count ??
              updatedPost.like_count ??
              post.like_count ??
              0
          ),
          reaction_summary:
            Array.isArray(
              data.reaction_summary
            )
              ? data.reaction_summary
              : post.reaction_summary,
        }

        const existingOverride =
          authorPostOverridesRef.current.get(
            id
          ) || {}

        authorPostOverridesRef.current.set(
          id,
          {
            ...existingOverride,
            ...nextPost,
          }
        )

        return nextPost
      })
    )
  }

  function handleShadowMallStorySaleStatusChanged(
    promotionId,
    status
  ) {
    const id = String(
      promotionId || ''
    )

    if (!id || !status) return

    const next =
      shadowMallPromotionsRef.current.map(
        (promotion) =>
          String(
            promotion?.id || ''
          ) === id
            ? {
                ...promotion,
                story_sale_status:
                  status,
                story_sale_status_loaded:
                  true,
              }
            : promotion
      )

    shadowMallPromotionsRef.current =
      next
    setShadowMallPromotions(next)

    if (token) {
      void patchShadowMallPrivateStatusCache({
        token,
        promotions: next,
        section:
          'discover-promotion-story-sale-statuses',
        maxAgeMs:
          DISCOVER_SHADOW_MALL_SALE_STATUS_CACHE_MAX_AGE_MS,
        promotionId: id,
        changes: status,
      })
    }
  }

  function hideShadowMallPromotion(item) {
    if (item) {
      hideShadowMallAdLocally(item)
    }

    const hiddenId = String(
      item?.id || ''
    )

    const next =
      shadowMallPromotionsRef.current.filter(
        (promotion) =>
          String(
            promotion?.id || ''
          ) !== hiddenId
      )

    shadowMallPromotionsRef.current =
      next
    setShadowMallPromotions(next)
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

  function updateAuthorFollowState(
    authorId,
    isFollowing
  ) {
    const id = String(
      authorId || ''
    )

    if (!id) return

    authorFollowOverridesRef.current.set(
      id,
      Boolean(isFollowing)
    )

    setRealPosts((current) =>
      current.map((post) =>
        String(
          post.author_page?.id || ''
        ) === id
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
    function handleShadowMallEchoUpdated(
      event
    ) {
      const detail =
        event?.detail || {}

      if (
        String(
          detail.sourceType || ''
        ) !==
        'shadow_mall_promotion'
      ) {
        return
      }

      const id = String(
        detail.sourceId || ''
      )

      if (!id) return

      const echoCount = Math.max(
        0,
        Number(
          detail.echoCount || 0
        )
      )

      const next =
        shadowMallPromotionsRef.current.map(
          (promotion) =>
            String(
              promotion?.id || ''
            ) === id
              ? {
                  ...promotion,
                  echo_count:
                    echoCount,
                  echo_state_loaded:
                    true,
                }
              : promotion
        )

      shadowMallPromotionsRef.current =
        next
      setShadowMallPromotions(next)

      if (token) {
        void patchShadowMallPrivateStatusCache({
          token,
          promotions: next,
          section:
            'discover-promotion-social-statuses',
          maxAgeMs:
            DISCOVER_SHADOW_MALL_SOCIAL_STATUS_CACHE_MAX_AGE_MS,
          promotionId: id,
          changes: {
            echo_count:
              echoCount,
            echo_state_loaded:
              true,
          },
        })
      }
    }

    window.addEventListener(
      'shadow:echo-v2-updated',
      handleShadowMallEchoUpdated
    )

    return () => {
      window.removeEventListener(
        'shadow:echo-v2-updated',
        handleShadowMallEchoUpdated
      )
    }
  }, [token])

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
    <div className="app-page discover-page min-h-screen bg-[#f5f3fa] pb-[100px] dark:bg-[var(--shadow-bg-page)]">
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

  <DeferredDiscoverSection>
  <DiscoverYouMightLikeSection />
</DeferredDiscoverSection>

  {uniqueShadowMallPromotions.map(
    (promotion) => (
      <AdsCard
        key={`empty-feed-ad-${promotion.id}`}
        item={promotion}
        onMore={setAdOptionsItem}
        onHide={hideShadowMallPromotion}
        onStorySaleStatusChanged={
          handleShadowMallStorySaleStatusChanged
        }
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
                  <DeferredDiscoverSection>
  <DiscoverAuthorsYouMayLikeSection />
</DeferredDiscoverSection>
                ) : null}

                {entry.kind === 'reader_post' &&
                entry.timelineIndex ===
                  firstReaderPostIndex ? (
                  <DeferredDiscoverSection>
  <DiscoverReadersYouMayLikeSection />
</DeferredDiscoverSection>
                ) : null}

                {entry.kind === 'author_post' &&
                entry.authorIndex === 0 ? (
                  <DeferredDiscoverSection>
  <DiscoverTrendingStoriesSection />
</DeferredDiscoverSection>
                ) : null}

                

                {entry.kind === 'author_post' &&
                entry.authorIndex === 2 ? (
                  <DeferredDiscoverSection>
  <DiscoverNewUpdatedStoriesSection />
</DeferredDiscoverSection>
                ) : null}

                {entry.timelineIndex === 3 ? (
  <>
    <DeferredDiscoverSection>
  <DiscoverYouMightLikeSection />
</DeferredDiscoverSection>
    {firstShadowMallPromotion ? (
      <AdsCard
        item={firstShadowMallPromotion}
        onMore={setAdOptionsItem}
        onHide={hideShadowMallPromotion}
        onStorySaleStatusChanged={
          handleShadowMallStorySaleStatusChanged
        }
      />
    ) : null}

  </>
) : null}

                {entry.kind === 'author_post' &&
                entry.authorIndex === 4 ? (
                  <DeferredDiscoverSection>
  <DiscoverCompletedStoriesSection />
</DeferredDiscoverSection>
                ) : null}
              </Fragment>
            ))}

            {discoverTimeline.length > 0 &&
discoverTimeline.length < 4 ? (
  <>
   <DeferredDiscoverSection>
  <DiscoverYouMightLikeSection />
</DeferredDiscoverSection>

    {firstShadowMallPromotion ? (
      <AdsCard
        item={firstShadowMallPromotion}
        onMore={setAdOptionsItem}
        onHide={hideShadowMallPromotion}
        onStorySaleStatusChanged={
          handleShadowMallStorySaleStatusChanged
        }
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
                      onStorySaleStatusChanged={
                        handleShadowMallStorySaleStatusChanged
                      }
                    />
                  )
                )
              : null}

            {readerPostsError &&
            discoverTimeline.length ? (
              <div className="rounded-[18px] bg-red-50 px-4 py-3 dark:bg-red-500/10 text-center text-[12px] font-normal text-red-600 ring-1 ring-red-100">
                {readerPostsError}
              </div>
            ) : null}

            {realPostsError && realPosts.length ? (
              <div className="rounded-[18px] bg-red-50 px-4 py-3 dark:bg-red-500/10 text-center text-[12px] font-bold text-red-600 ring-1 ring-red-100">
                {realPostsError}
              </div>
            ) : null}

            {realPostsHasMore ? (
              <button
                type="button"
                onClick={loadMoreRealPosts}
                disabled={realPostsLoadingMore}
                className="w-full rounded-[16px] bg-white dark:bg-[var(--shadow-bg-surface)] py-3.5 text-[13px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-gray-100 dark:ring-[var(--shadow-border)] active:scale-[0.99] disabled:opacity-60"
              >
                {realPostsLoadingMore ? (
                  <>
                    <i className="fa-solid fa-circle-notch mr-2 animate-spin" />
                    {discoverText('loading')}
                  </>
                ) : (
                  discoverText('loadMorePosts')
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
        title={discoverText('authorPostComments')}
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

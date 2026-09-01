import { useEffect, useMemo, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDashboardCommunity', {
  "en": {
    "justNow": "Just now",
    "minutesAgo": "{{count}}m ago",
    "hoursAgo": "{{count}}h ago",
    "daysAgo": "{{count}}d ago",
    "today": "Today",
    "last7Days": "Last 7 days",
    "last28Days": "Last 28 days",
    "loadReviewsFailed": "Failed to load reviews",
    "reader": "Reader",
    "recommendedAuthorPage": "Recommended this Author Page.",
    "sharedFeedbackAuthorPage": "Shared feedback about this Author Page.",
    "newCommunityDiscussion": "New community discussion",
    "commentsCount": "{{count}} comments",
    "communityOverview": "Community Overview",
    "newFollowers": "New Followers",
    "comments": "Comments",
    "reviews": "Reviews",
    "recommendPercent": "{{percent}}% recommend",
    "engagementRate": "Engagement Rate",
    "interactions": "{{count}} interactions",
    "recentReviews": "Recent Reviews",
    "viewAll": "View all",
    "noReviews": "No reviews yet",
    "reviewsEmptyDescription": "Reader reviews will appear here.",
    "topDiscussions": "Top Discussions",
    "noDiscussions": "No discussions yet",
    "engagement": "Engagement",
    "breakdown": "Breakdown",
    "discussions": "Discussions",
    "followers": "Followers"
  },
  "km": {
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}} នាទីមុន",
    "hoursAgo": "{{count}} ម៉ោងមុន",
    "daysAgo": "{{count}} ថ្ងៃមុន",
    "today": "ថ្ងៃនេះ",
    "last7Days": "7 ថ្ងៃចុងក្រោយ",
    "last28Days": "28 ថ្ងៃចុងក្រោយ",
    "loadReviewsFailed": "មិនអាចផ្ទុកការវាយតម្លៃបានទេ",
    "reader": "អ្នកអាន",
    "recommendedAuthorPage": "បានណែនាំទំព័រអ្នកនិពន្ធនេះ។",
    "sharedFeedbackAuthorPage": "បានចែករំលែកមតិយោបល់អំពីទំព័រអ្នកនិពន្ធនេះ។",
    "newCommunityDiscussion": "ការពិភាក្សាថ្មីក្នុងសហគមន៍",
    "commentsCount": "{{count}} មតិយោបល់",
    "communityOverview": "ទិដ្ឋភាពសហគមន៍",
    "newFollowers": "អ្នកតាមថ្មី",
    "comments": "មតិយោបល់",
    "reviews": "ការវាយតម្លៃ",
    "recommendPercent": "{{percent}}% ណែនាំ",
    "engagementRate": "អត្រាអន្តរកម្ម",
    "interactions": "{{count}} អន្តរកម្ម",
    "recentReviews": "ការវាយតម្លៃថ្មីៗ",
    "viewAll": "មើលទាំងអស់",
    "noReviews": "មិនទាន់មានការវាយតម្លៃ",
    "reviewsEmptyDescription": "ការវាយតម្លៃពីអ្នកអាននឹងបង្ហាញនៅទីនេះ។",
    "topDiscussions": "ការពិភាក្សាកំពូល",
    "noDiscussions": "មិនទាន់មានការពិភាក្សា",
    "engagement": "អន្តរកម្ម",
    "breakdown": "ការបែងចែក",
    "discussions": "ការពិភាក្សា",
    "followers": "អ្នកតាម"
  },
  "zh": {
    "justNow": "刚刚",
    "minutesAgo": "{{count}}分钟前",
    "hoursAgo": "{{count}}小时前",
    "daysAgo": "{{count}}天前",
    "today": "今天",
    "last7Days": "最近 7 天",
    "last28Days": "最近 28 天",
    "loadReviewsFailed": "无法加载评价",
    "reader": "读者",
    "recommendedAuthorPage": "推荐了此作者主页。",
    "sharedFeedbackAuthorPage": "分享了对此作者主页的反馈。",
    "newCommunityDiscussion": "新的社区讨论",
    "commentsCount": "{{count}} 条评论",
    "communityOverview": "社区概览",
    "newFollowers": "新增关注者",
    "comments": "评论",
    "reviews": "评价",
    "recommendPercent": "{{percent}}% 推荐",
    "engagementRate": "互动率",
    "interactions": "{{count}} 次互动",
    "recentReviews": "最新评价",
    "viewAll": "查看全部",
    "noReviews": "暂无评价",
    "reviewsEmptyDescription": "读者评价会显示在这里。",
    "topDiscussions": "热门讨论",
    "noDiscussions": "暂无讨论",
    "engagement": "互动",
    "breakdown": "构成",
    "discussions": "讨论",
    "followers": "关注者"
  },
  "ja": {
    "justNow": "たった今",
    "minutesAgo": "{{count}}分前",
    "hoursAgo": "{{count}}時間前",
    "daysAgo": "{{count}}日前",
    "today": "今日",
    "last7Days": "過去7日間",
    "last28Days": "過去28日間",
    "loadReviewsFailed": "レビューを読み込めませんでした",
    "reader": "読者",
    "recommendedAuthorPage": "この作者ページをおすすめしました。",
    "sharedFeedbackAuthorPage": "この作者ページへの感想を共有しました。",
    "newCommunityDiscussion": "新しいコミュニティの話題",
    "commentsCount": "コメント {{count}}件",
    "communityOverview": "コミュニティ概要",
    "newFollowers": "新しいフォロワー",
    "comments": "コメント",
    "reviews": "レビュー",
    "recommendPercent": "おすすめ {{percent}}%",
    "engagementRate": "エンゲージメント率",
    "interactions": "反応 {{count}}件",
    "recentReviews": "最近のレビュー",
    "viewAll": "すべて見る",
    "noReviews": "レビューはまだありません",
    "reviewsEmptyDescription": "読者レビューがここに表示されます。",
    "topDiscussions": "注目のディスカッション",
    "noDiscussions": "ディスカッションはまだありません",
    "engagement": "エンゲージメント",
    "breakdown": "内訳",
    "discussions": "ディスカッション",
    "followers": "フォロワー"
  },
  "ko": {
    "justNow": "방금",
    "minutesAgo": "{{count}}분 전",
    "hoursAgo": "{{count}}시간 전",
    "daysAgo": "{{count}}일 전",
    "today": "오늘",
    "last7Days": "최근 7일",
    "last28Days": "최근 28일",
    "loadReviewsFailed": "리뷰를 불러오지 못했습니다",
    "reader": "독자",
    "recommendedAuthorPage": "이 작가 페이지를 추천했습니다.",
    "sharedFeedbackAuthorPage": "이 작가 페이지에 대한 의견을 남겼습니다.",
    "newCommunityDiscussion": "새 커뮤니티 토론",
    "commentsCount": "댓글 {{count}}개",
    "communityOverview": "커뮤니티 개요",
    "newFollowers": "새 팔로워",
    "comments": "댓글",
    "reviews": "리뷰",
    "recommendPercent": "{{percent}}% 추천",
    "engagementRate": "참여율",
    "interactions": "상호작용 {{count}}회",
    "recentReviews": "최근 리뷰",
    "viewAll": "모두 보기",
    "noReviews": "아직 리뷰가 없습니다",
    "reviewsEmptyDescription": "독자 리뷰가 여기에 표시됩니다.",
    "topDiscussions": "인기 토론",
    "noDiscussions": "아직 토론이 없습니다",
    "engagement": "참여",
    "breakdown": "분석",
    "discussions": "토론",
    "followers": "팔로워"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function formatTimeAgo(value, t) {
  if (!value) return t('authorDashboardCommunity.justNow')

  const date = new Date(value)
  const time = date.getTime()

  if (Number.isNaN(time)) return t('authorDashboardCommunity.justNow')

  const seconds = Math.max(1, Math.floor((Date.now() - time) / 1000))

  if (seconds < 60) return t('authorDashboardCommunity.justNow')
  if (seconds < 3600) {
    return t('authorDashboardCommunity.minutesAgo', {
      count: Math.floor(seconds / 60),
    })
  }
  if (seconds < 86400) {
    return t('authorDashboardCommunity.hoursAgo', {
      count: Math.floor(seconds / 3600),
    })
  }
  if (seconds < 604800) {
    return t('authorDashboardCommunity.daysAgo', {
      count: Math.floor(seconds / 86400),
    })
  }

  return date.toLocaleDateString(getDisplayLanguageId() || 'en', {
    month: 'short',
    day: 'numeric',
  })
}

function getPeriodText(value, t) {
  if (value === 'Today') return t('authorDashboardCommunity.today')
  if (value === '7 Days') return t('authorDashboardCommunity.last7Days')
  return t('authorDashboardCommunity.last28Days')
}

async function fetchAuthorReviews(pageUsername, fallbackError) {
  if (!pageUsername) {
    return {
      reviews: [],
      summary: {
        total_count: 0,
        recommend_count: 0,
        recommend_percent: 0,
      },
    }
  }

  const token = getAuthToken()
  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/reviews`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || fallbackError)
  }

  return {
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    summary: data.summary || {
      total_count: 0,
      recommend_count: 0,
      recommend_percent: 0,
    },
  }
}

function CommunityMetric({ icon, label, value, note }) {
  return (
    <div className="rounded-[16px] bg-white/10 p-3 ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-white/85">
        <i className={`${icon} text-[15px]`} />
        <span className="text-[9px] font-semibold sm:text-[10px]">{label}</span>
      </div>
      <div className="mt-2 text-[24px] font-black leading-none text-white sm:text-[28px]">
        {value}
      </div>
      <div className="mt-2 text-[8.5px] font-semibold text-white/70">{note}</div>
    </div>
  )
}

function ReviewCard({ review, onOpen }) {
  const { t } = useDisplayTranslation()
  const recommended = review?.is_recommended !== false
  const avatarUrl = review?.reviewer_avatar_url || ''
  const name =
    review?.reviewer_name ||
    review?.reviewer_username ||
    t('authorDashboardCommunity.reader')
  const text =
    review?.review_text ||
    (recommended
      ? t('authorDashboardCommunity.recommendedAuthorPage')
      : t('authorDashboardCommunity.sharedFeedbackAuthorPage'))

  return (
    <button
      type="button"
      onClick={() => onOpen?.(review)}
      className="w-[172px] shrink-0 rounded-[17px] bg-[var(--shadow-bg-surface)] p-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] transition active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1eafe] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[12px]" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[10.5px] font-black text-[var(--shadow-text-primary)]">{name}</span>
          <span className="mt-1 flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((item) => (
              <i
                key={item}
                className={`fa-${recommended ? 'solid' : 'regular'} fa-star text-[8px] ${
                  recommended ? 'text-[#f59e0b]' : 'text-[var(--shadow-text-disabled)]'
                }`}
              />
            ))}
          </span>
        </span>
      </div>

      <div className="mt-3 line-clamp-3 min-h-[48px] text-[9.5px] font-medium leading-4 text-[var(--shadow-text-secondary)]">
        {text}
      </div>

      <div className="mt-2 text-right text-[8px] font-semibold text-[var(--shadow-text-tertiary)]">
        {formatTimeAgo(review?.created_at, t)}
      </div>
    </button>
  )
}

function DiscussionRow({ item, onOpen }) {
  const { t } = useDisplayTranslation()
  const comment = item?.comment || {}
  const post = item?.post || {}
  const count = Number(post?.comment_count || 0)

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className="flex w-full items-center gap-3 border-b border-[var(--shadow-border)] px-3 py-3 text-left last:border-b-0 active:bg-[var(--shadow-bg-hover)]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
        <i className="fa-regular fa-comments text-[12px]" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[10px] font-bold leading-4 text-[var(--shadow-text-primary)]">
          {comment.text || t('authorDashboardCommunity.newCommunityDiscussion')}
        </span>
        <span className="mt-1 block text-[8.5px] font-semibold text-[var(--shadow-text-secondary)]">
          {t('authorDashboardCommunity.commentsCount', { count: formatCompactNumber(count) })}
        </span>
      </span>

      <span className="shrink-0 text-[8px] font-semibold text-[var(--shadow-text-tertiary)]">
        {formatTimeAgo(comment.created_at, t)}
      </span>
    </button>
  )
}

export default function AuthorDashboardCommunityTab({
  pageUsername = '',
  overview = {},
  periodMetrics = {},
  recentComments = [],
  analyticsPeriod = '28 Days',
  onPeriodChange,
  onOpenReview,
  onOpenDiscussion,
  onViewAllReviews,
  onViewAllDiscussions,
}) {
  const { t } = useDisplayTranslation()
  const [reviews, setReviews] = useState([])
  const [reviewSummary, setReviewSummary] = useState({
    total_count: 0,
    recommend_count: 0,
    recommend_percent: 0,
  })
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadReviews() {
      if (!pageUsername) {
        setReviews([])
        setReviewSummary({
          total_count: 0,
          recommend_count: 0,
          recommend_percent: 0,
        })
        return
      }

      try {
        setLoadingReviews(true)
        setReviewError('')
        const data = await fetchAuthorReviews(pageUsername, t('authorDashboardCommunity.loadReviewsFailed'))

        if (ignore) return

        setReviews(data.reviews)
        setReviewSummary(data.summary)
      } catch (error) {
        if (!ignore) {
          setReviewError(error.message || t('authorDashboardCommunity.loadReviewsFailed'))
        }
      } finally {
        if (!ignore) setLoadingReviews(false)
      }
    }

    loadReviews()

    return () => {
      ignore = true
    }
  }, [pageUsername, t])

  const periodText = getPeriodText(analyticsPeriod, t)
  const views = Number(periodMetrics.views || 0) + Number(periodMetrics.storyReads || 0)
  const interactions = Number(periodMetrics.interactions || 0)
  const engagementRate = views > 0 ? (interactions / views) * 100 : 0
  const recentReviewItems = reviews.slice(0, 3)
  const discussionItems = Array.isArray(recentComments) ? recentComments.slice(0, 3) : []

  const breakdown = useMemo(() => {
    const values = [
      {
        label: t('authorDashboardCommunity.comments'),
        value: Math.max(Number(periodMetrics.comments || 0), discussionItems.length),
        color: '#6d28d9',
      },
      {
        label: t('authorDashboardCommunity.reviews'),
        value: Number(reviewSummary.total_count || 0),
        color: '#8b5cf6',
      },
      {
        label: t('authorDashboardCommunity.discussions'),
        value: discussionItems.length,
        color: '#a78bfa',
      },
      {
        label: t('authorDashboardCommunity.followers'),
        value: Number(periodMetrics.followers || 0),
        color: '#c4b5fd',
      },
    ]
    const total = values.reduce((sum, item) => sum + item.value, 0)
    let current = 0
    const stops = values.map((item) => {
      const percent = total ? Math.round((item.value / total) * 100) : 0
      const start = current
      current += percent

      return {
        ...item,
        percent,
        start,
        end: current,
      }
    })
    const background = total
      ? `conic-gradient(${stops
          .map((item) => `${item.color} ${item.start}% ${item.end}%`)
          .join(', ')})`
      : 'var(--shadow-bg-soft)'

    return {
      total,
      stops,
      background,
    }
  }, [discussionItems.length, periodMetrics.comments, periodMetrics.followers, reviewSummary.total_count, t])

  return (
    <div className="mx-auto max-w-[760px] space-y-4">
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] p-4 text-white shadow-[0_16px_38px_rgba(109,40,217,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[15px] font-black sm:text-[17px]">{t('authorDashboardCommunity.communityOverview')}</h1>
          <select
            value={analyticsPeriod}
            onChange={(event) => onPeriodChange?.(event.target.value)}
            className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-bold text-white outline-none ring-1 ring-white/15"
          >
            <option value="Today" className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">{t('authorDashboardCommunity.today')}</option>
            <option value="7 Days" className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">{t('authorDashboardCommunity.last7Days')}</option>
            <option value="28 Days" className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">{t('authorDashboardCommunity.last28Days')}</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <CommunityMetric
            icon="fa-solid fa-user-plus"
            label={t('authorDashboardCommunity.newFollowers')}
            value={formatCompactNumber(periodMetrics.followers)}
            note={periodText}
          />
          <CommunityMetric
            icon="fa-regular fa-comments"
            label={t('authorDashboardCommunity.comments')}
            value={formatCompactNumber(periodMetrics.comments)}
            note={periodText}
          />
          <CommunityMetric
            icon="fa-regular fa-star"
            label={t('authorDashboardCommunity.reviews')}
            value={formatCompactNumber(reviewSummary.total_count)}
            note={t('authorDashboardCommunity.recommendPercent', { percent: formatCompactNumber(reviewSummary.recommend_percent) })}
          />
          <CommunityMetric
            icon="fa-solid fa-arrow-trend-up"
            label={t('authorDashboardCommunity.engagementRate')}
            value={`${engagementRate.toFixed(engagementRate >= 10 ? 0 : 1)}%`}
            note={t('authorDashboardCommunity.interactions', { count: formatCompactNumber(interactions) })}
          />
        </div>
      </section>

      <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)] sm:text-[16px]">{t('authorDashboardCommunity.recentReviews')}</h2>
          <button
            type="button"
            onClick={onViewAllReviews}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            {t('authorDashboardCommunity.viewAll')}
          </button>
        </div>

        {loadingReviews ? (
          <div className="flex h-[150px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-bg-soft)] border-t-[#8b5cf6]" />
          </div>
        ) : reviewError ? (
          <div className="flex min-h-[150px] flex-col items-center justify-center px-5 text-center">
            <i className="fa-solid fa-circle-exclamation text-[20px] text-[#8b5cf6]" />
            <div className="mt-3 text-[11px] font-bold text-[var(--shadow-text-primary)]">{reviewError}</div>
          </div>
        ) : recentReviewItems.length ? (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {recentReviewItems.map((review) => (
              <ReviewCard key={review.id} review={review} onOpen={onOpenReview} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[150px] flex-col items-center justify-center px-5 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
              <i className="fa-regular fa-star text-[18px]" />
            </span>
            <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-primary)]">{t('authorDashboardCommunity.noReviews')}</div>
            <div className="mt-1 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
              {t('authorDashboardCommunity.reviewsEmptyDescription')}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)] sm:text-[16px]">{t('authorDashboardCommunity.topDiscussions')}</h2>
          <button
            type="button"
            onClick={onViewAllDiscussions}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            {t('authorDashboardCommunity.viewAll')}
          </button>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-center">
          <div className="overflow-hidden rounded-[17px] ring-1 ring-[var(--shadow-border)]">
            {discussionItems.length ? (
              discussionItems.map((item) => (
                <DiscussionRow
                  key={item.comment?.id || item.post?.id}
                  item={item}
                  onOpen={onOpenDiscussion}
                />
              ))
            ) : (
              <div className="flex min-h-[160px] flex-col items-center justify-center px-5 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
                  <i className="fa-regular fa-comments text-[16px]" />
                </span>
                <div className="mt-3 text-[11px] font-bold text-[var(--shadow-text-primary)]">{t('authorDashboardCommunity.noDiscussions')}</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 sm:block">
            <div
              className="flex h-[126px] w-[126px] shrink-0 items-center justify-center rounded-full sm:mx-auto"
              style={{ background: breakdown.background }}
            >
              <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-center">
                <span className="text-[8px] font-bold leading-3 text-[var(--shadow-text-secondary)]">{t('authorDashboardCommunity.engagement')}</span>
                <span className="text-[8px] font-bold leading-3 text-[var(--shadow-text-secondary)]">{t('authorDashboardCommunity.breakdown')}</span>
              </div>
            </div>

            <div className="min-w-[130px] space-y-2.5 sm:mt-4">
              {breakdown.stops.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="min-w-0 flex-1 text-[9px] font-semibold text-[var(--shadow-text-secondary)]">{item.label}</span>
                  <span className="text-[9px] font-black text-[var(--shadow-text-primary)]">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

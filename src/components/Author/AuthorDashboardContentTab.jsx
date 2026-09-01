import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDashboardContent', {
  "en": {
    "justNow": "Just now",
    "authorPost": "Author post",
    "published": "Published",
    "engagement": "Engagement",
    "views": "Views",
    "untitledStory": "Untitled story",
    "today": "Today",
    "last7Days": "Last 7 days",
    "last28Days": "Last 28 days",
    "contentOverview": "Content Overview",
    "posts": "Posts",
    "total": "Total",
    "followers": "Followers",
    "recentContent": "Recent Content",
    "viewAll": "View All",
    "noContent": "No content yet",
    "noContentDescription": "Published stories and author posts will appear here.",
    "engagementBreakdown": "Engagement Breakdown",
    "likes": "Likes",
    "comments": "Comments",
    "shares": "Shares",
    "createNewContent": "Create New Content"
  },
  "km": {
    "justNow": "ឥឡូវនេះ",
    "authorPost": "ប្រកាសអ្នកនិពន្ធ",
    "published": "បានបោះពុម្ព",
    "engagement": "អន្តរកម្ម",
    "views": "ការមើល",
    "untitledStory": "រឿងគ្មានចំណងជើង",
    "today": "ថ្ងៃនេះ",
    "last7Days": "7 ថ្ងៃចុងក្រោយ",
    "last28Days": "28 ថ្ងៃចុងក្រោយ",
    "contentOverview": "ទិដ្ឋភាពមាតិកា",
    "posts": "ប្រកាស",
    "total": "សរុប",
    "followers": "អ្នកតាម",
    "recentContent": "មាតិកាថ្មីៗ",
    "viewAll": "មើលទាំងអស់",
    "noContent": "មិនទាន់មានមាតិកា",
    "noContentDescription": "រឿងដែលបានបោះពុម្ព និងប្រកាសអ្នកនិពន្ធនឹងបង្ហាញនៅទីនេះ។",
    "engagementBreakdown": "ការបែងចែកអន្តរកម្ម",
    "likes": "ចូលចិត្ត",
    "comments": "មតិយោបល់",
    "shares": "ចែករំលែក",
    "createNewContent": "បង្កើតមាតិកាថ្មី"
  },
  "zh": {
    "justNow": "刚刚",
    "authorPost": "作者动态",
    "published": "已发布",
    "engagement": "互动",
    "views": "浏览量",
    "untitledStory": "未命名故事",
    "today": "今天",
    "last7Days": "最近 7 天",
    "last28Days": "最近 28 天",
    "contentOverview": "内容概览",
    "posts": "动态",
    "total": "总计",
    "followers": "关注者",
    "recentContent": "最新内容",
    "viewAll": "查看全部",
    "noContent": "暂无内容",
    "noContentDescription": "已发布的故事和作者动态会显示在这里。",
    "engagementBreakdown": "互动构成",
    "likes": "点赞",
    "comments": "评论",
    "shares": "分享",
    "createNewContent": "创建新内容"
  },
  "ja": {
    "justNow": "たった今",
    "authorPost": "作者投稿",
    "published": "公開済み",
    "engagement": "エンゲージメント",
    "views": "閲覧数",
    "untitledStory": "無題のストーリー",
    "today": "今日",
    "last7Days": "過去7日間",
    "last28Days": "過去28日間",
    "contentOverview": "コンテンツ概要",
    "posts": "投稿",
    "total": "合計",
    "followers": "フォロワー",
    "recentContent": "最近のコンテンツ",
    "viewAll": "すべて見る",
    "noContent": "コンテンツはまだありません",
    "noContentDescription": "公開されたストーリーと作者投稿がここに表示されます。",
    "engagementBreakdown": "エンゲージメント内訳",
    "likes": "いいね",
    "comments": "コメント",
    "shares": "シェア",
    "createNewContent": "新しいコンテンツを作成"
  },
  "ko": {
    "justNow": "방금",
    "authorPost": "작가 게시물",
    "published": "게시됨",
    "engagement": "참여",
    "views": "조회수",
    "untitledStory": "제목 없는 작품",
    "today": "오늘",
    "last7Days": "최근 7일",
    "last28Days": "최근 28일",
    "contentOverview": "콘텐츠 개요",
    "posts": "게시물",
    "total": "합계",
    "followers": "팔로워",
    "recentContent": "최근 콘텐츠",
    "viewAll": "모두 보기",
    "noContent": "아직 콘텐츠가 없습니다",
    "noContentDescription": "게시된 작품과 작가 게시물이 여기에 표시됩니다.",
    "engagementBreakdown": "참여 분석",
    "likes": "좋아요",
    "comments": "댓글",
    "shares": "공유",
    "createNewContent": "새 콘텐츠 만들기"
  }
})

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function formatDate(value, t) {
  if (!value) return t('authorDashboardContent.justNow')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return t('authorDashboardContent.justNow')

  return date.toLocaleDateString(getDisplayLanguageId() || 'en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getPostTitle(post, t) {
  const text = String(post?.content || '').replace(/\s+/g, ' ').trim()

  if (!text) return t('authorDashboardContent.authorPost')
  return text.length > 70 ? `${text.slice(0, 70)}…` : text
}

function OverviewMetric({ label, value, note }) {
  return (
    <div className="rounded-[14px] bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
      <div className="text-[9px] font-semibold text-white/75 sm:text-[10px]">{label}</div>
      <div className="mt-1 text-[20px] font-black leading-none text-white sm:text-[24px]">
        {formatCompactNumber(value)}
      </div>
      <div className="mt-2 text-[8px] font-semibold text-white/70 sm:text-[9px]">{note}</div>
    </div>
  )
}

function RecentContentRow({ item, onOpen }) {
  const { t } = useDisplayTranslation()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[17px] bg-[var(--shadow-bg-surface)] p-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] transition active:scale-[0.99]"
    >
      <span className="flex h-[66px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[#f0ebfa] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className={`${item.type === 'story' ? 'fa-solid fa-book-open' : 'fa-regular fa-image'} text-[22px]`} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[12px] font-bold leading-4 text-[var(--shadow-text-primary)]">
          {item.title}
        </span>
        <span className="mt-1 block text-[9.5px] font-medium text-[var(--shadow-text-secondary)]">
          {formatDate(item.date, t)}
        </span>
        <span className="mt-1.5 inline-flex rounded-full bg-[#dcfce7] px-2 py-1 text-[8.5px] font-bold text-[#16a34a]">
          {t('authorDashboardContent.published')}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-[13px] font-black text-[var(--shadow-text-primary)]">
          {formatCompactNumber(item.metric)}
        </span>
        <span className="mt-1 block text-[8.5px] font-semibold text-[var(--shadow-text-tertiary)]">
          {item.metricLabel}
        </span>
      </span>
    </button>
  )
}

export default function AuthorDashboardContentTab({
  overview = {},
  periodMetrics = {},
  topStories = [],
  latestPost = null,
  analyticsPeriod = '28 Days',
  onPeriodChange,
  onOpenStory,
  onOpenPost,
  onViewAll,
  onCreateContent,
}) {
  const { t } = useDisplayTranslation()
  const recentItems = [
    ...(latestPost
      ? [
          {
            id: `post-${latestPost.id}`,
            type: 'post',
            title: getPostTitle(latestPost, t),
            imageUrl: Array.isArray(latestPost.image_urls) ? latestPost.image_urls[0] : '',
            date: latestPost.created_at,
            metric:
              Number(latestPost.like_count || 0) +
              Number(latestPost.comment_count || 0) +
              Number(latestPost.echo_count || 0),
            metricLabel: t('authorDashboardContent.engagement'),
            raw: latestPost,
          },
        ]
      : []),
    ...(Array.isArray(topStories) ? topStories : []).map((story) => ({
      id: `story-${story.id}`,
      type: 'story',
      title: story.title || t('authorDashboardContent.untitledStory'),
      imageUrl: story.cover_url || '',
      date: story.updated_at || story.created_at,
      metric: Number(story.total_views || 0),
      metricLabel: t('authorDashboardContent.views'),
      raw: story,
    })),
  ]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 3)

  const likes =
    Number(overview.postLikes || 0) +
    Number(overview.storyLikes || 0)
  const comments =
    Number(overview.postComments || 0) +
    Number(overview.storyComments || 0)
  const shares = Number(overview.postEchoes || 0)
  const interactionTotal = likes + comments + shares
  const likesPercent = interactionTotal ? Math.round((likes / interactionTotal) * 100) : 0
  const commentsPercent = interactionTotal
    ? Math.round((comments / interactionTotal) * 100)
    : 0
  const sharesPercent = interactionTotal
    ? Math.max(0, 100 - likesPercent - commentsPercent)
    : 0
  const secondStop = likesPercent + commentsPercent
  const donutBackground = interactionTotal
    ? `conic-gradient(#6d28d9 0 ${likesPercent}%, #8b5cf6 ${likesPercent}% ${secondStop}%, #c4b5fd ${secondStop}% 100%)`
    : 'var(--shadow-bg-soft)'
  const periodLabel =
    analyticsPeriod === '7 Days'
      ? t('authorDashboardContent.last7Days')
      : analyticsPeriod === '28 Days'
        ? t('authorDashboardContent.last28Days')
        : t('authorDashboardContent.today')

  return (
    <div className="mx-auto max-w-[720px] space-y-4">
      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] p-4 text-white shadow-[0_16px_38px_rgba(109,40,217,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[14px] font-black sm:text-[16px]">{t('authorDashboardContent.contentOverview')}</h1>
          <select
            value={analyticsPeriod}
            onChange={(event) => onPeriodChange?.(event.target.value)}
            className="rounded-full bg-white/10 px-3 py-2 text-[9px] font-bold text-white outline-none ring-1 ring-white/15"
          >
            <option value="Today" className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">{t('authorDashboardContent.today')}</option>
            <option value="7 Days" className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">{t('authorDashboardContent.last7Days')}</option>
            <option value="28 Days" className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">{t('authorDashboardContent.last28Days')}</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <OverviewMetric label={t('authorDashboardContent.posts')} value={overview.posts} note={t('authorDashboardContent.total')} />
          <OverviewMetric
            label={t('authorDashboardContent.views')}
            value={Number(periodMetrics.views || 0) + Number(periodMetrics.storyReads || 0)}
            note={periodLabel}
          />
          <OverviewMetric
            label={t('authorDashboardContent.engagement')}
            value={periodMetrics.interactions}
            note={periodLabel}
          />
          <OverviewMetric label={t('authorDashboardContent.followers')} value={overview.followers} note={t('authorDashboardContent.total')} />
        </div>
      </section>

      <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)] sm:text-[16px]">{t('authorDashboardContent.recentContent')}</h2>
          <button
            type="button"
            onClick={onViewAll}
            className="text-[10px] font-bold text-[#8b5cf6] active:opacity-70"
          >
            {t('authorDashboardContent.viewAll')}
          </button>
        </div>

        <div className="mt-3 space-y-2.5">
          {recentItems.length ? (
            recentItems.map((item) => (
              <RecentContentRow
                key={item.id}
                item={item}
                onOpen={() =>
                  item.type === 'story'
                    ? onOpenStory?.(item.raw)
                    : onOpenPost?.(item.raw)
                }
              />
            ))
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
                <i className="fa-regular fa-file-lines text-[18px]" />
              </span>
              <div className="mt-3 text-[13px] font-bold text-[var(--shadow-text-primary)]">{t('authorDashboardContent.noContent')}</div>
              <div className="mt-1 max-w-[260px] text-[10px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorDashboardContent.noContentDescription')}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
        <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)] sm:text-[16px]">
          {t('authorDashboardContent.engagementBreakdown')}
        </h2>

        <div className="mt-4 flex items-center gap-6">
          <div
            className="relative flex h-[126px] w-[126px] shrink-0 items-center justify-center rounded-full"
            style={{ background: donutBackground }}
          >
            <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-[var(--shadow-bg-surface)]">
              <span className="text-[16px] font-black text-[var(--shadow-text-primary)]">
                {formatCompactNumber(interactionTotal)}
              </span>
              <span className="text-[8px] font-bold text-[var(--shadow-text-tertiary)]">{t('authorDashboardContent.total')}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {[
              ['likes', '#6d28d9', t('authorDashboardContent.likes'), likesPercent],
              ['comments', '#8b5cf6', t('authorDashboardContent.comments'), commentsPercent],
              ['shares', '#c4b5fd', t('authorDashboardContent.shares'), sharesPercent],
            ].map(([id, color, label, percent]) => (
              <div key={id} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="min-w-0 flex-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
                  {label}
                </span>
                <span className="text-[10px] font-black text-[var(--shadow-text-primary)]">{percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={onCreateContent}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.25)] active:scale-[0.99]"
      >
        <i className="fa-solid fa-plus text-[12px]" />
        {t('authorDashboardContent.createNewContent')}
      </button>
    </div>
  )
}

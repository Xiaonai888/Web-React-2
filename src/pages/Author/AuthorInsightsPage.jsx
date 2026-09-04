import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorInsights', {
  en: {
    period7: '7 Days',
    period28: '28 Days',
    period30: '30 Days',
    failedLoad: 'Failed to load insights',
    storyReadsChart: 'Story reads chart',
    start: 'Start',
    mid: 'Mid',
    now: 'Now',
    untitledStory: 'Untitled story',
    viewsCount: '{{count}} views',
    likesCount: '{{count}} likes',
    loading: 'Loading insights...',
    back: 'Back',
    title: 'Insights',
    tapRetry: 'Tap to retry',
    storyPerformance: 'STORY PERFORMANCE',
    readerLove: 'See what readers love',
    totalReads: 'Total Reads',
    pageViews: 'Page Views',
    interactions: 'Interactions',
    newFollowers: 'New Followers',
    comments: 'Comments',
    topStories: 'Top Stories',
    viewAll: 'View all',
    noPublishedStories: 'No published stories yet',
    readerEngagement: 'Reader Engagement',
    allTime: 'All time',
    likes: 'Likes',
    gifts: 'Gifts',
  },
  km: {
    period7: '7 ថ្ងៃ',
    period28: '28 ថ្ងៃ',
    period30: '30 ថ្ងៃ',
    failedLoad: 'មិនអាចផ្ទុក Insights បានទេ',
    storyReadsChart: 'ក្រាហ្វការអានរឿង',
    start: 'ចាប់ផ្តើម',
    mid: 'កណ្តាល',
    now: 'ឥឡូវ',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    viewsCount: '{{count}} ទស្សនា',
    likesCount: '{{count}} ចូលចិត្ត',
    loading: 'កំពុងផ្ទុក Insights...',
    back: 'ត្រឡប់ក្រោយ',
    title: 'Insights',
    tapRetry: 'ចុចដើម្បីសាកម្តងទៀត',
    storyPerformance: 'ប្រសិទ្ធភាពរឿង',
    readerLove: 'មើលអ្វីដែលអ្នកអានចូលចិត្ត',
    totalReads: 'ការអានសរុប',
    pageViews: 'ទស្សនាទំព័រ',
    interactions: 'អន្តរកម្ម',
    newFollowers: 'អ្នក Follow ថ្មី',
    comments: 'មតិយោបល់',
    topStories: 'រឿងកំពូល',
    viewAll: 'មើលទាំងអស់',
    noPublishedStories: 'មិនទាន់មានរឿងដែលបានបោះពុម្ព',
    readerEngagement: 'ការចូលរួមរបស់អ្នកអាន',
    allTime: 'សរុបទាំងអស់',
    likes: 'ចូលចិត្ត',
    gifts: 'Gifts',
  },
  zh: {
    period7: '7天',
    period28: '28天',
    period30: '30天',
    failedLoad: '无法加载数据分析',
    storyReadsChart: '故事阅读图表',
    start: '开始',
    mid: '中间',
    now: '现在',
    untitledStory: '未命名故事',
    viewsCount: '{{count}} 次浏览',
    likesCount: '{{count}} 个赞',
    loading: '正在加载数据分析...',
    back: '返回',
    title: '数据分析',
    tapRetry: '点击重试',
    storyPerformance: '故事表现',
    readerLove: '看看读者喜欢什么',
    totalReads: '总阅读量',
    pageViews: '页面浏览',
    interactions: '互动',
    newFollowers: '新关注者',
    comments: '评论',
    topStories: '热门故事',
    viewAll: '查看全部',
    noPublishedStories: '暂无已发布故事',
    readerEngagement: '读者互动',
    allTime: '全部时间',
    likes: '点赞',
    gifts: '礼物',
  },
  ja: {
    period7: '7日間',
    period28: '28日間',
    period30: '30日間',
    failedLoad: 'インサイトを読み込めませんでした',
    storyReadsChart: 'ストーリー閲覧チャート',
    start: '開始',
    mid: '中間',
    now: '現在',
    untitledStory: '無題のストーリー',
    viewsCount: '{{count}} 閲覧',
    likesCount: '{{count}} いいね',
    loading: 'インサイトを読み込み中...',
    back: '戻る',
    title: 'インサイト',
    tapRetry: 'タップして再試行',
    storyPerformance: 'ストーリー実績',
    readerLove: '読者に人気の内容を確認',
    totalReads: '総閲覧数',
    pageViews: 'ページ閲覧',
    interactions: 'インタラクション',
    newFollowers: '新規フォロワー',
    comments: 'コメント',
    topStories: '人気ストーリー',
    viewAll: 'すべて表示',
    noPublishedStories: '公開済みストーリーはまだありません',
    readerEngagement: '読者エンゲージメント',
    allTime: '全期間',
    likes: 'いいね',
    gifts: 'ギフト',
  },
  ko: {
    period7: '7일',
    period28: '28일',
    period30: '30일',
    failedLoad: '인사이트를 불러오지 못했습니다',
    storyReadsChart: '스토리 읽기 차트',
    start: '시작',
    mid: '중간',
    now: '현재',
    untitledStory: '제목 없는 스토리',
    viewsCount: '{{count}} 조회',
    likesCount: '{{count}} 좋아요',
    loading: '인사이트 불러오는 중...',
    back: '뒤로',
    title: '인사이트',
    tapRetry: '탭하여 다시 시도',
    storyPerformance: '스토리 성과',
    readerLove: '독자가 좋아하는 내용을 확인하세요',
    totalReads: '총 읽기',
    pageViews: '페이지 조회',
    interactions: '상호작용',
    newFollowers: '새 팔로워',
    comments: '댓글',
    topStories: '인기 스토리',
    viewAll: '모두 보기',
    noPublishedStories: '아직 공개된 스토리가 없습니다',
    readerEngagement: '독자 참여',
    allTime: '전체 기간',
    likes: '좋아요',
    gifts: '선물',
  },
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PERIODS = [
  { labelKey: 'period7', value: '7d' },
  { labelKey: 'period28', value: '28d' },
  { labelKey: 'period30', value: '30d' },
]

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

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(getDisplayLanguageId(), {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

async function requestJson(path, token, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorInsights.failedLoad'))
  }

  return data
}

function InsightsChart({ series }) {
  const { t } = useDisplayTranslation()
  const values = useMemo(
    () => (Array.isArray(series) ? series : []).map((item) => Number(item?.story_reads || 0)),
    [series]
  )
  const chartValues = values.length ? values : [0]
  const maxValue = Math.max(...chartValues, 1)
  const points = chartValues
    .map((value, index) => {
      const x = 12 + (index / Math.max(chartValues.length - 1, 1)) * 296
      const y = 126 - (value / maxValue) * 92
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="relative mt-4 h-[178px] overflow-hidden rounded-[12px] bg-[var(--shadow-bg-surface)]">
      <svg viewBox="0 0 320 150" className="h-[150px] w-full" aria-label={t('authorInsights.storyReadsChart')} role="img">
        {[34, 65, 96, 126].map((y) => (
          <line key={y} x1="12" y1={y} x2="308" y2={y} stroke="var(--shadow-border)" strokeWidth="1" />
        ))}
        <polyline
          points={points}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {chartValues.map((value, index) => {
          const [x, y] = points.split(' ')[index].split(',')

          return <circle key={`${index}-${value}`} cx={x} cy={y} r="2.6" fill="var(--shadow-bg-surface)" stroke="#8b5cf6" strokeWidth="1.6" />
        })}
      </svg>

      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[9px] font-medium text-[var(--shadow-text-tertiary)]">
        <span>{t('authorInsights.start')}</span>
        <span>{t('authorInsights.mid')}</span>
        <span>{t('authorInsights.now')}</span>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_8px_24px_rgba(87,72,124,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">{label}</div>
          <div className="mt-1.5 text-[22px] font-bold leading-none text-[var(--shadow-text-primary)]">{formatCompactNumber(value)}</div>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2edff] text-[#7c4dff]">
          <i className={`${icon} text-[13px]`} />
        </span>
      </div>
    </div>
  )
}

function StoryRow({ story, maxViews, onOpen }) {
  const { t } = useDisplayTranslation()
  const views = Number(story?.total_views || 0)
  const likes = Number(story?.total_likes || 0)
  const progress = maxViews > 0 ? Math.max(5, Math.round((views / maxViews) * 100)) : 0

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 border-b border-[var(--shadow-border)] py-3 text-left last:border-b-0 active:bg-[var(--shadow-bg-hover)]"
    >
      <div className="flex h-[76px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-[#f1edff] text-[#7c4dff]">
        {story?.cover_url ? (
          <img src={story.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-book-open text-[18px]" />
        )}
      </div>

      <div className="min-w-0 flex-1 self-center">
        <div className="truncate text-[13px] font-bold text-[var(--shadow-text-primary)]">{story?.title || t('authorInsights.untitledStory')}</div>
        <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
          <span>{t('authorInsights.viewsCount', { count: formatCompactNumber(views) })}</span>
          <span className="h-3 w-px bg-[var(--shadow-border)]" />
          <span>{t('authorInsights.likesCount', { count: formatCompactNumber(likes) })}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
          <div className="h-full rounded-full bg-[#9b7cff]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <i className="fa-solid fa-chevron-right self-center text-[10px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function EngagementItem({ icon, value, label }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <i className={`${icon} text-[18px] text-[#7c4dff]`} />
      <div className="mt-2 text-[17px] font-bold text-[var(--shadow-text-primary)]">{formatCompactNumber(value)}</div>
      <div className="mt-0.5 truncate text-[9px] font-medium text-[var(--shadow-text-tertiary)]">{label}</div>
    </div>
  )
}

function LoadingInsights() {
  const { t } = useDisplayTranslation()
  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px]">
      <header className="h-14 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]" />
      <main className="mx-auto max-w-[720px] px-4 py-5">
        <div className="rounded-[14px] bg-[var(--shadow-bg-surface)] p-10 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#eee9ff] border-t-[#8b5cf6]" />
          <div className="mt-4 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorInsights.loading')}</div>
        </div>
      </main>
      <AuthorStudioBottomNav />
    </div>
  )
}

export default function AuthorInsightsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [period, setPeriod] = useState('28d')
  const [dashboard, setDashboard] = useState(null)
  const [giftTotal, setGiftTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestControllerRef = useRef(null)

  const loadInsights = useCallback(async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    requestControllerRef.current?.abort()

    const controller = new AbortController()
    requestControllerRef.current = controller

    try {
      setLoading(true)
      setError('')

      const dashboardData = await requestJson(
        `/api/authors/me/dashboard?period=${encodeURIComponent(period)}`,
        token,
        controller.signal
      )

      if (controller.signal.aborted) return

      setDashboard(dashboardData)
      setGiftTotal(
        Number(
          dashboardData?.overview?.monthly_gifts ||
            0
        )
      )
    } catch (loadError) {
      if (loadError?.name === 'AbortError') return

      setError(
        loadError.message || t('authorInsights.failedLoad')
      )
    } finally {
      if (
        requestControllerRef.current === controller
      ) {
        requestControllerRef.current = null

        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
  }, [navigate, period, t])

  useEffect(() => {
    loadInsights()

    return () => {
      requestControllerRef.current?.abort()
      requestControllerRef.current = null
    }
  }, [loadInsights])

  const totals = dashboard?.period_totals || {}
  const overview = dashboard?.overview || {}
  const series = Array.isArray(dashboard?.analytics) ? dashboard.analytics : []
  const topStories = Array.isArray(dashboard?.top_stories) ? dashboard.top_stories : []
  const maxViews = Math.max(...topStories.map((story) => Number(story?.total_views || 0)), 0)
  const activePeriodKey = PERIODS.find((item) => item.value === period)?.labelKey || 'period28'
  const activePeriod = t(`authorInsights.${activePeriodKey}`)

  if (loading && !dashboard) {
    return <LoadingInsights />
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[94px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto grid h-14 max-w-[720px] grid-cols-[44px_1fr_44px] items-center px-2">
          <button
            type="button"
            onClick={() => navigate('/author/dashboard')}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-60"
            aria-label={t('authorInsights.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <h1 className="text-center text-[15px] font-semibold text-[var(--shadow-text-primary)]">{t('authorInsights.title')}</h1>
          <div />
        </div>
      </header>

      {error ? (
        <div className="mx-auto max-w-[720px] px-4 pt-4">
          <button
            type="button"
            onClick={loadInsights}
            className="w-full rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-left text-[11px] font-semibold text-[#ef4444] shadow-sm ring-1 ring-[var(--shadow-border)]"
          >
            {error} · {t('authorInsights.tapRetry')}
          </button>
        </div>
      ) : null}

      <main className="mx-auto max-w-[720px] space-y-4 px-4 py-5">
        <section>
          <div className="text-[10px] font-bold tracking-[0.12em] text-[#8061e8]">{t('authorInsights.storyPerformance')}</div>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.03em] text-[var(--shadow-text-primary)]">{t('authorInsights.readerLove')}</h2>

          <div className="mt-4 flex gap-2">
            {PERIODS.map((item) => {
              const active = item.value === period

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPeriod(item.value)}
                  className={`h-10 flex-1 rounded-[12px] text-[11px] font-normal transition active:scale-[0.98] ${
  active
    ? 'bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white'
    : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
}`}
                >
                  {t(`authorInsights.${item.labelKey}`)}
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(87,72,124,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorInsights.totalReads')}</div>
              <div className="mt-1 text-[36px] font-bold leading-none tracking-[-0.04em] text-[var(--shadow-text-primary)]">
                {formatCompactNumber(totals.story_reads)}
              </div>
            </div>
            <div className="rounded-full bg-[#f1ecff] px-3 py-1.5 text-[9px] font-semibold text-[#7250dc]">
              {activePeriod}
            </div>
          </div>

          <div className="mt-2 text-[9.5px] font-medium text-[var(--shadow-text-tertiary)]">
            {formatDate(dashboard?.date_from)} – {formatDate(dashboard?.date_to)}
          </div>

          <InsightsChart series={series} />
        </section>

        <section className="grid grid-cols-2 gap-3">
          <MetricCard icon="fa-regular fa-eye" label={t('authorInsights.pageViews')} value={totals.page_views} />
          <MetricCard icon="fa-regular fa-heart" label={t('authorInsights.interactions')} value={totals.interactions} />
          <MetricCard icon="fa-solid fa-user-plus" label={t('authorInsights.newFollowers')} value={totals.new_followers} />
          <MetricCard icon="fa-regular fa-comment" label={t('authorInsights.comments')} value={totals.comments} />
        </section>

        <section className="rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(87,72,124,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">{t('authorInsights.topStories')}</h2>
            <button
              type="button"
              onClick={() => navigate('/author/dashboard#author-stories')}
              className="text-[10px] font-semibold text-[#7652e8] active:opacity-60"
            >
              {t('authorInsights.viewAll')}
            </button>
          </div>

          <div className="mt-2">
            {topStories.length ? (
              topStories.slice(0, 3).map((story) => (
                <StoryRow
                  key={story.id}
                  story={story}
                  maxViews={maxViews}
                  onOpen={() => navigate(`/author/story/${story.id}/manage`)}
                />
              ))
            ) : (
              <div className="py-10 text-center">
                <i className="fa-solid fa-book-open text-[24px] text-[#b8a8ef]" />
                <div className="mt-3 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorInsights.noPublishedStories')}</div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(87,72,124,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">{t('authorInsights.readerEngagement')}</h2>
            <span className="text-[9px] font-medium text-[var(--shadow-text-tertiary)]">{t('authorInsights.allTime')}</span>
          </div>

          <div className="mt-5 flex divide-x divide-[var(--shadow-border)]">
            <EngagementItem icon="fa-regular fa-heart" value={overview.story_likes} label={t('authorInsights.likes')} />
            <EngagementItem icon="fa-regular fa-comment" value={overview.story_comments} label={t('authorInsights.comments')} />
            <EngagementItem icon="fa-solid fa-gift" value={giftTotal} label={t('authorInsights.gifts')} />
          </div>
        </section>
      </main>

      <AuthorStudioBottomNav />
    </div>
  )
}

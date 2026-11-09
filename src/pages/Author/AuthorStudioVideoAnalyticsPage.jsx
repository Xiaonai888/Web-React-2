import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BarChart3, Clock3, Eye, Heart, MessageCircle, MousePointerClick, UsersRound } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import { getStudioVideoAnalytics } from '../../services/shadowStudioAnalyticsApi'
import {
  StudioBackHeader, StudioCard, StudioEmptyGraph, StudioFrame, StudioMetric,
  StudioMissing, StudioRetry, StudioThumbnail, formatStudioCount,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

registerTranslationNamespace('shadowStudioVideoDetails', {
  en: {
    views30: 'Views · last 30 days', views48: 'Views · last 48 hours',
    measured: 'Measured Shadow views', notReady: 'Complete tracking history is not available for this period yet.',
    unavailable: 'This metric is not being measured yet.', tracked: 'Analytics tracking started',
    publishDate: 'Published', interactions: 'Interactions', impressions: 'Thumbnail impressions',
    unique: 'Unique viewers', recentViews: 'Recent video views', graph: 'Counted views over time',
    overviewHelp: 'View counts are recorded by Shadow. They may differ from YouTube views.',
    last30: 'Last 30 days', last48: 'Last 48 hours', viewUnit: 'views',
  },
  km: {
    views30: 'Views · ៣០ ថ្ងៃចុងក្រោយ', views48: 'Views · ៤៨ ម៉ោងចុងក្រោយ',
    measured: 'Views ពិតដែល Shadow បានកត់', notReady: 'មិនទាន់មានប្រវត្តិរាប់ Views ពេញរយៈពេលនេះទេ។',
    unavailable: 'ស្ថិតិនេះមិនទាន់ត្រូវបានវាស់វែងទេ។', tracked: 'ចាប់ផ្ដើមកត់ Analytics',
    publishDate: 'បានផ្សាយ', interactions: 'ការចូលរួម', impressions: 'ចំនួនបង្ហាញ Thumbnail',
    unique: 'អ្នកមើលមិនស្ទួន', recentViews: 'Views វីដេអូថ្មីៗ', graph: 'Views តាមពេលវេលា',
    overviewHelp: 'Shadow កត់ Views ផ្ទាល់ខ្លួន ដែលអាចខុសពី Views នៅ YouTube។',
    last30: '៣០ ថ្ងៃចុងក្រោយ', last48: '៤៨ ម៉ោងចុងក្រោយ', viewUnit: 'Views',
  },
  zh: {
    views30: '观看量 · 最近30天', views48: '观看量 · 最近48小时',
    measured: 'Shadow 已记录的观看量', notReady: '该时间段的完整历史记录尚不可用。',
    unavailable: '此指标尚未采集。', tracked: '分析记录开始于',
    publishDate: '发布日期', interactions: '互动', impressions: '缩略图曝光量',
    unique: '独立观众', recentViews: '近期视频观看量', graph: '观看量趋势',
    overviewHelp: '数据来自 Shadow 记录，可能与 YouTube 不同。',
    last30: '最近30天', last48: '最近48小时', viewUnit: '次观看',
  },
  ja: {
    views30: '視聴回数 · 過去30日', views48: '視聴回数 · 過去48時間',
    measured: 'Shadowで計測した再生回数', notReady: 'この期間の完全な計測履歴はまだありません。',
    unavailable: 'この指標は現在計測されていません。', tracked: '計測開始日',
    publishDate: '公開日', interactions: 'エンゲージメント', impressions: 'サムネイル表示回数',
    unique: 'ユニーク視聴者', recentViews: '最近の再生回数', graph: '再生回数の推移',
    overviewHelp: 'Shadow独自の集計であり、YouTubeの再生回数とは異なる場合があります。',
    last30: '過去30日間', last48: '過去48時間', viewUnit: '回',
  },
  ko: {
    views30: '조회수 · 최근 30일', views48: '조회수 · 최근 48시간',
    measured: 'Shadow에서 집계한 조회수', notReady: '이 기간의 전체 집계 기록이 아직 없습니다.',
    unavailable: '이 지표는 아직 측정되지 않습니다.', tracked: '분석 기록 시작',
    publishDate: '게시일', interactions: '상호작용', impressions: '썸네일 노출수',
    unique: '순 시청자', recentViews: '최근 동영상 조회수', graph: '조회수 추이',
    overviewHelp: 'Shadow에서 집계한 조회수는 YouTube와 다를 수 있습니다.',
    last30: '최근 30일', last48: '최근 48시간', viewUnit: '회',
  },
})

const SECTIONS = ['overview', 'reach', 'engagement', 'audience']

function safeCount(value) {
  if (value == null || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

function availableValue(metric) {
  return metric?.available === true ? safeCount(metric.value) : null
}

function displayDate(value, locale) {
  const date = value ? new Date(value) : null
  if (!date || !Number.isFinite(date.getTime())) return '—'
  return date.toLocaleDateString(locale || undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function normalizeSeries(data, dateKey) {
  if (!Array.isArray(data) || !data.length) return null
  const result = []
  for (const row of data) {
    const count = safeCount(row?.counted_views)
    const instant = new Date(row?.[dateKey]).getTime()
    if (count === null || !Number.isFinite(instant)) return null
    result.push({ count, timestamp: instant })
  }
  return result
}

function ViewsChart({ title, series, subtitle, language, t }) {
  if (!series?.length) {
    return <StudioEmptyGraph title={title} subtitle={subtitle} />
  }
  const maximum = Math.max(...series.map(point => point.count), 1)
  const sum = series.reduce((total, point) => total + point.count, 0)
  return <StudioCard className="space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoDetails.graph')}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-xl font-bold tabular-nums">{formatStudioCount(sum)}</div>
        <div className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoDetails.viewUnit')}</div>
      </div>
    </div>
    <div role="img" aria-label={`${title}: ${formatStudioCount(sum)}`} className="flex h-40 items-end gap-[2px] rounded-lg border-b border-[var(--shadow-border)] pt-3">
      {series.map((point, index) => (
        <div key={`${point.timestamp}-${index}`} className="group flex h-full min-w-0 flex-1 items-end" title={`${displayDate(point.timestamp, language)} · ${formatStudioCount(point.count)}`}>
          <span className="block w-full rounded-t-sm bg-[var(--shadow-text-primary)] opacity-70 transition-opacity group-hover:opacity-100" style={{ height: point.count > 0 ? `${Math.max(2, (point.count / maximum) * 100)}%` : '0%' }} />
        </div>
      ))}
    </div>
    <div className="flex justify-between gap-3 text-xs text-[var(--shadow-text-secondary)]">
      <span>{displayDate(series[0].timestamp, language)}</span>
      <span>{displayDate(series[series.length - 1].timestamp, language)}</span>
    </div>
  </StudioCard>
}

function MissingMetric({ title, t }) {
  return <StudioCard className="space-y-3">
    <h2 className="text-sm font-semibold">{title}</h2>
    <div className="text-xl font-bold">—</div>
    <StudioMissing>{t('shadowStudioVideoDetails.unavailable')}</StudioMissing>
  </StudioCard>
}

export default function AuthorStudioVideoAnalyticsPage() {
  const { t, language } = useDisplayTranslation()
  const navigate = useNavigate()
  const { videoId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const selected = searchParams.get('section')
  const section = SECTIONS.includes(selected) ? selected : 'overview'

  useEffect(() => {
    const controller = new AbortController()
    setData(null)
    setLoading(true)
    setError('')
    getStudioVideoAnalytics(videoId, { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted) return
        setData(result)
        setLoading(false)
      })
      .catch(cause => {
        if (controller.signal.aborted) return
        setError(cause?.message || t('shadowStudioStats.unable'))
        setLoading(false)
      })
    return () => controller.abort()
  }, [videoId, reload, t])

  const video = data?.video
  const coverage = data?.coverage
  const views = safeCount(video?.view_count)
  const recentViews = coverage?.video_30d_complete === true ? safeCount(data?.measured_views_30d) : null
  const watchSeconds = availableValue(data?.watch_seconds)
  const watchHours = watchSeconds === null ? null : watchSeconds / 3600
  const averageSeconds = availableValue(data?.average_view_seconds)
  const ctr = availableValue(data?.thumbnail_ctr)
  const daily = useMemo(() => coverage?.video_30d_complete === true ? normalizeSeries(data?.daily_views_utc, 'day_utc') : null, [coverage?.video_30d_complete, data?.daily_views_utc])
  const hours = useMemo(() => coverage?.video_48h_complete === true ? normalizeSeries(data?.realtime_48h, 'hour_utc') : null, [coverage?.video_48h_complete, data?.realtime_48h])
  const last48Total = hours?.reduce((total, point) => total + point.count, 0) ?? null
  const pickSection = next => setSearchParams({ section: next }, { replace: true })
  const footerNavigate = tab => {
    if (tab === 'dashboard') navigate('/author/reel/studio/dashboard')
    if (tab === 'content') navigate('/author/reel/studio')
  }

  return <>
    <StudioFrame>
      <StudioBackHeader video={video} title={video?.title || t('shadowStudioStats.analytics')} onBack={() => navigate('/author/reel/studio/dashboard')} />

      {video ? <StudioCard className="space-y-3">
        <div className="flex items-center gap-3">
          <StudioThumbnail video={video} className="h-[68px] w-[120px]" />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold">{video.title}</p>
            <p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">
              {t('shadowStudioVideoDetails.publishDate')}: {displayDate(video.published_at, language)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--shadow-border)] pt-3 text-xs">
          <span className="inline-flex items-center gap-1.5"><Eye size={15} />{formatStudioCount(views)}</span>
          <span className="inline-flex items-center gap-1.5"><Heart size={15} />{formatStudioCount(safeCount(video.likes))}</span>
          <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} />{formatStudioCount(safeCount(video.comments))}</span>
        </div>
      </StudioCard> : null}

      <nav className="-mx-4 flex gap-5 overflow-x-auto border-b border-[var(--shadow-border)] px-4 sm:mx-0 sm:px-0" aria-label={t('shadowStudioStats.analytics')}>
        {SECTIONS.map(item => <button type="button" key={item} onClick={() => pickSection(item)} aria-current={section === item ? 'page' : undefined}
          className={`shrink-0 border-b-2 pb-3 text-sm transition-colors ${section === item ? 'border-[var(--shadow-text-primary)] font-semibold text-[var(--shadow-text-primary)]' : 'border-transparent text-[var(--shadow-text-secondary)]'}`}>
          {t(`shadowStudioStats.${item}`)}
        </button>)}
      </nav>

      {loading ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]" role="status">{t('shadowStudioStats.loading')}</p></StudioCard> : null}
      {!loading && error ? <StudioRetry message={error} label={t('shadowStudioStats.retry')} onRetry={() => setReload(current => current + 1)} /> : null}
      {!loading && !error && !video ? <StudioMissing>{t('shadowStudioStats.videoMissing')}</StudioMissing> : null}

      {!loading && !error && video ? <div className="space-y-5">
        {section === 'overview' ? <>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <StudioMetric label={t('shadowStudioStats.sincePublished')} value={views} icon={Eye} subtitle={t('shadowStudioStats.lifetime')} />
            <StudioMetric label={t('shadowStudioStats.watchTime')} value={watchHours} icon={Clock3} />
            <StudioMetric label={t('shadowStudioVideoDetails.views30')} value={recentViews} icon={BarChart3} />
            <StudioMetric label={t('shadowStudioVideoDetails.views48')} value={last48Total} icon={BarChart3} />
          </div>
          <ViewsChart title={t('shadowStudioVideoDetails.views30')} series={daily} subtitle={t('shadowStudioVideoDetails.notReady')} language={language} t={t}/>
          <ViewsChart title={t('shadowStudioVideoDetails.views48')} series={hours} subtitle={t('shadowStudioVideoDetails.notReady')} language={language} t={t}/>
          <MissingMetric title={t('shadowStudioStats.traffic')} t={t}/>
          <StudioEmptyGraph title={t('shadowStudioStats.retention')} subtitle={t('shadowStudioVideoDetails.unavailable')}/>
        </> : null}

        {section === 'reach' ? <>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <StudioMetric label={t('shadowStudioVideoDetails.views30')} value={recentViews} icon={Eye}/>
            <StudioMetric label={t('shadowStudioStats.ctr')} value={ctr} icon={MousePointerClick}/>
            <StudioMetric label={t('shadowStudioVideoDetails.impressions')} value={availableValue(data?.thumbnail_impressions)} icon={BarChart3}/>
            <StudioMetric label={t('shadowStudioStats.sincePublished')} value={views} icon={Eye}/>
          </div>
          <ViewsChart title={t('shadowStudioVideoDetails.views30')} series={daily} subtitle={t('shadowStudioVideoDetails.notReady')} language={language} t={t}/>
          <MissingMetric title={t('shadowStudioStats.topSources')} t={t}/>
        </> : null}

        {section === 'engagement' ? <>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <StudioMetric label={t('shadowStudioStats.watchTime')} value={watchHours} icon={Clock3}/>
            <StudioMetric label={t('shadowStudioStats.average')} value={averageSeconds} icon={BarChart3}/>
            <StudioMetric label={t('shadowStudioStats.likes')} value={safeCount(video.likes)} icon={Heart}/>
            <StudioMetric label={t('shadowStudioStats.comments')} value={safeCount(video.comments)} icon={MessageCircle}/>
          </div>
          <StudioEmptyGraph title={t('shadowStudioStats.retention')} subtitle={t('shadowStudioVideoDetails.unavailable')}/>
        </> : null}

        {section === 'audience' ? <>
          <StudioMetric label={t('shadowStudioVideoDetails.unique')} value={availableValue(data?.unique_viewers)} icon={UsersRound}/>
          <StudioEmptyGraph title={t('shadowStudioStats.audience')} subtitle={t('shadowStudioVideoDetails.unavailable')}/>
        </> : null}

        <StudioMissing>{t('shadowStudioVideoDetails.overviewHelp')}</StudioMissing>
        {coverage?.started_at ? <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoDetails.tracked')}: {displayDate(coverage.started_at, language)}</p> : null}
      </div> : null}
    </StudioFrame>

    <ShadowStudioFooter activeTab="dashboard" enabledTabs={['dashboard', 'content']} onTabChange={footerNavigate}/>
  </>
}

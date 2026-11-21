import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, ChevronDown, ChevronRight, ChevronUp, Eye, MessageSquare, Heart } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getStudioDashboard } from '../../services/shadowStudioAnalyticsApi'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import {
  StudioCard, StudioFrame, StudioMetric, StudioMissing,
  StudioRetry, StudioThumbnail, StudioTimeLabel, formatStudioCount, studioVideoAge,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

registerTranslationNamespace('shadowStudioDashboardCoverage', {
  en: {
    partial: 'Views recorded during part of the last 30 days.',
    unavailable: '30-day view history is not available yet.',
    watchUnavailable: 'Watch time is shown when tracked playback data is available.',
  },
  km: {
    partial: 'Views ដែលបានកត់ត្រាក្នុងផ្នែកមួយនៃ ៣០ ថ្ងៃចុងក្រោយ។',
    unavailable: 'មិនទាន់មានប្រវត្តិ Views ក្នុង ៣០ ថ្ងៃចុងក្រោយ។',
    watchUnavailable: 'Watch time បង្ហាញនៅពេលមានទិន្នន័យរយៈពេលមើលដែលបានកត់ត្រា។',
  },
  zh: {
    partial: '显示最近30天内已记录的部分观看量。',
    unavailable: '最近30天的观看记录暂不可用。',
    watchUnavailable: '有已记录的播放时长后才显示观看时长。',
  },
  ja: {
    partial: '過去30日間のうち記録済みの再生回数です。',
    unavailable: '過去30日間の再生履歴はまだありません。',
    watchUnavailable: '記録された視聴時間が利用可能になると表示されます。',
  },
  ko: {
    partial: '최근 30일 중 기록된 일부 조회수입니다.',
    unavailable: '최근 30일 조회 기록이 아직 없습니다.',
    watchUnavailable: '기록된 시청 시간 데이터가 있을 때 표시됩니다.',
  },
})

export default function AuthorStudioDashboardPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [videos, setVideos] = useState([])
  const [channel, setChannel] = useState(null)
  const [coverage, setCoverage] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const refreshAfterSave = location.state?.reelSaved === true

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') setReload(value => value + 1)
    }, 3 * 60 * 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setExpanded({})
    getStudioDashboard({ signal: controller.signal, force: refreshAfterSave || reload > 0 })
      .then(data => {
        if (controller.signal.aborted) return
        const items = (Array.isArray(data.latest_long_videos) ? data.latest_long_videos : [])
          .filter(video => video?.video_type === 'long' && !/\/shorts\//i.test(video?.video_url || ''))
          .slice(0, 3)
        setVideos(items)
        setChannel(data.channel || null)
        setCoverage(data.coverage || null)
        setLoading(false)
      })
      .catch(cause => {
        if (controller.signal.aborted) return
        setError(cause.message || t('shadowStudioStats.unable'))
        setLoading(false)
      })
    return () => controller.abort()
  }, [reload, t, refreshAfterSave])

  const goAnalytics = (video, section = 'overview') => {
    navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics?section=${section}`)
  }

  const hasViews = channel?.views !== null && channel?.views !== undefined && Number.isFinite(Number(channel.views))
  const watchValue = channel?.watch_seconds?.available === true && Number.isFinite(Number(channel.watch_seconds.value)) && channel.watch_seconds.value !== null
    ? Number(channel.watch_seconds.value) / 3600 : null

  return <StudioFrame>
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold">{t('shadowStudioStats.channel')}</h2>
        <span className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.last30')}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <StudioMetric label={t('shadowStudioStats.views')} value={hasViews ? Number(channel.views) : null} icon={Eye} />
        <StudioMetric label={t('shadowStudioStats.watchTime')} value={watchValue} icon={BarChart3} />
      </div>
      {!loading && !error && coverage?.complete === false ? (
        <StudioMissing>
          {t(hasViews ? 'shadowStudioDashboardCoverage.partial' : 'shadowStudioDashboardCoverage.unavailable')}
        </StudioMissing>
      ) : null}
      {!loading && !error && watchValue === null ? (
        <StudioMissing>{t('shadowStudioDashboardCoverage.watchUnavailable')}</StudioMissing>
      ) : null}
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-bold">{t('shadowStudioStats.latest')}</h2>
      {loading && !videos.length ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.loading')}</p></StudioCard> : null}
      {!loading && error ? <StudioRetry message={error} label={t('shadowStudioStats.retry')} onRetry={() => setReload(value => value + 1)} /> : null}
      {!loading && !error && !videos.length ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.noVideos')}</p></StudioCard> : null}
      {videos.map(video => {
        const isOpen = Boolean(expanded[video.id])
        return <StudioCard key={video.id} className="space-y-3">
          <button type="button" className="flex w-full items-center gap-3 text-left" onClick={() => goAnalytics(video)} aria-label={t('shadowStudioStats.viewDetails')}>
            <StudioThumbnail video={video} className="h-[58px] w-[104px] sm:h-[73px] sm:w-[130px]" />
            <span className="min-w-0 flex-1 space-y-1">
              <span className="block truncate text-sm font-semibold">{video.title}</span>
              <StudioTimeLabel>{t('shadowStudioStats.published', { age: studioVideoAge(video.published_at) })}</StudioTimeLabel>
            </span>
          </button>
          <div className="border-t border-[var(--shadow-border)] pt-3">
            <div className="flex items-center gap-5 text-xs">
              <span className="inline-flex items-center gap-1.5"><BarChart3 size={17} />{formatStudioCount(video.view_count != null && Number.isFinite(Number(video.view_count)) ? Number(video.view_count) : null)}</span>
              <span className="inline-flex items-center gap-1.5"><Heart size={17} />{formatStudioCount(video.likes)}</span>
              <span className="inline-flex items-center gap-1.5"><MessageSquare size={17} />{formatStudioCount(video.comments)}</span>
              <button type="button" aria-expanded={isOpen} aria-label={isOpen ? 'Collapse' : 'Expand'} onClick={() => setExpanded(current => ({ ...current, [video.id]: !current[video.id] }))} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]">
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>
          {isOpen ? <div className="space-y-1 border-t border-[var(--shadow-border)] pt-2 text-sm">
            <button type="button" onClick={() => navigate(`/author/reel/studio/ranking?videoId=${encodeURIComponent(video.id)}`)} className="flex w-full items-center justify-between py-2 text-left">
              <span>{t('shadowStudioStats.rankByViews')}</span><span className="flex items-center gap-2 text-[var(--shadow-text-secondary)]">— <ChevronRight size={17}/></span>
            </button>
            {[
              ['views', formatStudioCount(video.view_count != null && Number.isFinite(Number(video.view_count)) ? Number(video.view_count) : null), 'overview'],
              ['ctr', '—', 'reach'],
              ['average', '—', 'engagement'],
            ].map(([key, value, section]) => <button key={key} type="button" onClick={() => goAnalytics(video, section)} className="flex w-full items-center justify-between gap-2 py-2 text-left hover:opacity-75">
              <span className="min-w-0 text-[13px]">{t(`shadowStudioStats.${key}`)}</span>
              <span className="shrink-0 font-medium tabular-nums">{value}</span>
            </button>)}
          </div> : null}
        </StudioCard>
      })}
    </section>
    <ShadowStudioFooter
      activeTab="dashboard"
      enabledTabs={['dashboard', 'content']}
      onTabChange={tab => navigate(tab === 'content' ? '/author/reel/studio' : '/author/reel/studio/dashboard')}
    />
  </StudioFrame>
}

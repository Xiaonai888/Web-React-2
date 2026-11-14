import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, ChevronDown, ChevronRight, ChevronUp, Eye, MessageSquare, RefreshCw, ThumbsUp } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getStudioDashboard } from '../../services/shadowStudioAnalyticsApi'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import {
  StudioCard, StudioFrame, StudioMetric, StudioMissing,
  StudioRetry, StudioThumbnail, StudioTimeLabel, formatStudioCount, studioVideoAge,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

registerTranslationNamespace('shadowStudioDashboardRefresh', {
  en: { refresh: 'Refresh dashboard' },
  km: { refresh: 'ទាញទិន្នន័យ Dashboard ថ្មី' },
  zh: { refresh: '刷新数据概览' },
  ja: { refresh: 'ダッシュボードを更新' },
  ko: { refresh: '대시보드 새로고침' },
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
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getStudioDashboard({ signal: controller.signal, force: refreshAfterSave || reload > 0 })
      .then(data => {
        if (controller.signal.aborted) return
        const items = Array.isArray(data.latest_long_videos) ? data.latest_long_videos : []
        setVideos(items)
        setChannel(data.channel || null)
        setCoverage(data.coverage || null)
        setExpanded(items[0] ? { [items[0].id]: true } : {})
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

  return <StudioFrame>
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold">{t('shadowStudioStats.channel')}</h2>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.last30')}</span>
          <button
            type="button"
            onClick={() => setReload(value => value + 1)}
            disabled={loading}
            aria-label={t('shadowStudioDashboardRefresh.refresh')}
            title={t('shadowStudioDashboardRefresh.refresh')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-soft)] disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <StudioMetric label={t('shadowStudioStats.views')} value={channel?.views ?? null} icon={Eye} />
        <StudioMetric label={t('shadowStudioStats.watchTime')} value={channel?.watch_seconds?.available && channel.watch_seconds.value != null && Number.isFinite(Number(channel.watch_seconds.value)) ? Number(channel.watch_seconds.value) / 3600 : null} icon={BarChart3} />
      </div>
      {!loading && !error && !coverage?.complete ? <StudioMissing>{t('shadowStudioStats.insufficient')}</StudioMissing> : null}
      {!loading && !error && !channel?.watch_seconds?.available ? <StudioMissing>{t('shadowStudioStats.notMeasured')}</StudioMissing> : null}
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
              <span className="inline-flex items-center gap-1.5"><ThumbsUp size={17} />{formatStudioCount(video.likes)}</span>
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

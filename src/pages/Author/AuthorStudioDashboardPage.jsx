import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, ChevronDown, ChevronRight, ChevronUp, Eye, MessageSquare, ThumbsUp } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { getStudioVideoActivity, listRecentStudioLongVideos } from '../../services/shadowStudioAnalyticsApi'
import {
  StudioBackHeader, StudioCard, StudioFrame, StudioMetric, StudioMissing,
  StudioRetry, StudioThumbnail, StudioTimeLabel, formatStudioCount, studioVideoAge,
} from '../../components/author/studio/ShadowStudioAnalyticsShared'

export default function AuthorStudioDashboardPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [activity, setActivity] = useState({})
  const [expanded, setExpanded] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [partial, setPartial] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setActivity({})
    listRecentStudioLongVideos({ take: 3, maxBatches: 5, signal: controller.signal })
      .then(({ videos: items, hasMore }) => {
        if (controller.signal.aborted) return
        setVideos(items)
        setPartial(hasMore && items.length < 3)
        setExpanded(items[0] ? { [items[0].id]: true } : {})
        setLoading(false)
        for (const item of items) {
          getStudioVideoActivity(item.id, { signal: controller.signal })
            .then(value => {
              if (!controller.signal.aborted) {
                setActivity(current => ({ ...current, [item.id]: value }))
              }
            })
            .catch(() => {})
        }
      })
      .catch(cause => {
        if (!controller.signal.aborted) {
          setError(cause.message || t('shadowStudioStats.unable'))
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [reload, t])

  const goAnalytics = (video, section = 'overview') => {
    navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics?section=${section}`)
  }

  return <StudioFrame>
    <StudioBackHeader title={t('shadowStudioStats.dashboard')} onBack={() => navigate('/author/reel/studio')} />
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold">{t('shadowStudioStats.channel')}</h2>
        <span className="shrink-0 text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.last30')}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <StudioMetric label={t('shadowStudioStats.views')} value={null} icon={Eye} />
        <StudioMetric label={t('shadowStudioStats.watchTime')} value={null} icon={BarChart3} />
      </div>
      <StudioMissing>{t('shadowStudioStats.sourceMissing')}</StudioMissing>
    </section>

    <section className="space-y-3">
      <h2 className="text-lg font-bold">{t('shadowStudioStats.latest')}</h2>
      {loading ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.loading')}</p></StudioCard> : null}
      {!loading && error ? <StudioRetry message={error} label={t('shadowStudioStats.retry')} onRetry={() => setReload(value => value + 1)} /> : null}
      {!loading && !error && !videos.length ? <StudioCard><p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioStats.noVideos')}</p></StudioCard> : null}
      {!loading && !error ? videos.map(video => {
        const isOpen = Boolean(expanded[video.id])
        const counts = activity[video.id] || {}
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
              <span className="inline-flex items-center gap-1.5"><ThumbsUp size={17} />{formatStudioCount(counts.likes)}</span>
              <span className="inline-flex items-center gap-1.5"><MessageSquare size={17} />{formatStudioCount(counts.comments)}</span>
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
      }) : null}
      {!loading && !error && partial ? <StudioMissing>{t('shadowStudioStats.partial')}</StudioMissing> : null}
      {!loading && !error && videos.length ? <StudioMissing>{t('shadowStudioStats.longNotice')}</StudioMissing> : null}
    </section>
  </StudioFrame>
}

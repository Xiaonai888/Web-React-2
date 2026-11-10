import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { StudioCard, StudioMissing, formatStudioCount } from '../ShadowStudioAnalyticsShared'
import './ShadowStudioChannelCopy'
import StudioChannelMetricCarousel from './StudioChannelMetricCarousel'
import { StudioChannelTopContent } from './StudioChannelOverview'

const FORMATS = ['all', 'videos', 'shorts', 'posts', 'playlists']

function readableMetric(metric) {
  const value = metric?.available === true ? Number(metric.value) : NaN
  return Number.isFinite(value) && value >= 0 ? formatStudioCount(value) : '—'
}

export default function StudioChannelContent({ format = 'all', data, onFormatChange, onOpenVideo, loading = false }) {
  const { t } = useDisplayTranslation()
  const label = key => t(`shadowStudioChannel.${key}`)
  const isSupported = ['all', 'videos', 'shorts'].includes(format)
  const title = format === 'videos' ? label('topVideos') : format === 'shorts' ? label('topShorts') : label('topContent')
  const metrics = [
    { key: 'views', label: label('views'), metric: data?.views_30d, subtitle: label('last30') },
    { key: 'impressions', label: label('impressions'), metric: data?.impressions_30d, subtitle: label('last30') },
    { key: format === 'shorts' ? 'engaged' : 'ctr', label: label(format === 'shorts' ? 'engaged' : 'ctr'),
      metric: format === 'shorts' ? data?.engaged_views_30d : data?.thumbnail_ctr_30d, subtitle: label('last30') },
  ]

  return <div className="space-y-5">
    <nav aria-label={label('content')} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      {FORMATS.map(item => <button type="button" key={item} onClick={() => onFormatChange?.(item)}
        aria-current={format === item ? 'true' : undefined}
        className={`shrink-0 rounded-xl border px-4 py-2 text-sm ${format === item ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'}`}>
        {label(item)}
      </button>)}
    </nav>
    {!isSupported ? <StudioCard><p className="py-10 text-center text-sm text-[var(--shadow-text-secondary)]">{label('noFormat')}</p></StudioCard>
      : loading && !data ? <StudioCard><p role="status" className="text-sm text-[var(--shadow-text-secondary)]">{label('loading')}</p></StudioCard>
        : data ? <>
          <StudioChannelMetricCarousel slides={metrics} label={label('content')}
            unavailableLabel={label('notAvailable')} timelineLabel={label('timelineUnavailable')} />
          <StudioCard>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[var(--shadow-text-secondary)]">{label('countPublished')}</p>
              <span className="font-semibold tabular-nums">{data.top_content?.total_published == null ? '—' : readableMetric({ available: true, value: data.top_content.total_published })}</span>
            </div>
          </StudioCard>
          <StudioChannelTopContent content={data.top_content} title={title}
            note={label('lifetimeNote')} emptyLabel={label('topNotReady')} onOpenVideo={onOpenVideo} />
          <StudioMissing>{label('noMetrics')}</StudioMissing>
        </> : null}
  </div>
}

import { StudioCard, StudioMissing, StudioThumbnail, formatStudioCount } from '../ShadowStudioAnalyticsShared'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import './ShadowStudioChannelCopy'
import StudioChannelMetricCarousel from './StudioChannelMetricCarousel'

export function StudioChannelTopContent({ content, title, onOpenVideo, note, emptyLabel }) {
  const items = Array.isArray(content?.items) ? content.items.slice(0, 5) : []
  return <StudioCard className="space-y-4">
    <div className="space-y-1">
      <h2 className="font-semibold">{title}</h2>
      {note ? <p className="text-xs text-[var(--shadow-text-secondary)]">{note}</p> : null}
    </div>
    {items.length ? <div className="space-y-3">
      {items.map(video => {
        const inner = <>
          <StudioThumbnail video={video} className="h-[56px] w-[96px]" />
          <span className="min-w-0 flex-1 truncate text-sm">{video.title || '—'}</span>
          <span className="shrink-0 text-sm tabular-nums">{formatStudioCount(video.lifetime_views)}</span>
        </>
        return typeof onOpenVideo === 'function'
          ? <button type="button" key={video.id} onClick={() => onOpenVideo(video)} className="flex w-full items-center gap-3 text-left">{inner}</button>
          : <div key={video.id} className="flex items-center gap-3">{inner}</div>
      })}
    </div> : <p className="py-4 text-sm text-[var(--shadow-text-secondary)]">{emptyLabel}</p>}
  </StudioCard>
}

export default function StudioChannelOverview({ data, onOpenVideo }) {
  const { t } = useDisplayTranslation()
  const label = key => t(`shadowStudioChannel.${key}`)
  if (!data) return null

  const metrics = [
    { key: 'views', label: label('views'), metric: data.views, subtitle: label('last30') },
    { key: 'watchTime', label: label('watchTime'), metric: data.watch_time_hours, subtitle: label('last30') },
    { key: 'followers', label: label('followers'), metric: data.net_followers, subtitle: label('last30') },
  ]
  const realtime = data.realtime_48h || {}
  const last48 = realtime.available === true ? { available: true, value: realtime.total_views } : { available: false, value: null }

  return <div className="space-y-6">
    <StudioChannelMetricCarousel slides={metrics} label={label('overview')}
      unavailableLabel={label('notAvailable')} timelineLabel={label('timelineUnavailable')} />
    {data.coverage?.complete === false ? <StudioMissing>{label('incomplete')}</StudioMissing> : null}
    <StudioChannelTopContent content={data.top_content} title={label('topContent')}
      note={label('lifetimeNote')} emptyLabel={label('topNotReady')} onOpenVideo={onOpenVideo} />
    <StudioCard className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-semibold">{label('realtime')}</h2>
        <p className="text-xs text-[var(--shadow-text-secondary)]">{label('last48')}</p>
      </div>
      <div className="text-3xl font-bold tabular-nums">{last48.available && last48.value != null && Number.isFinite(Number(last48.value)) ? formatStudioCount(Number(last48.value)) : '—'}</div>
      {last48.available !== true ? <p className="text-xs text-[var(--shadow-text-secondary)]">{label('notAvailable')}</p> : null}
    </StudioCard>
    <StudioMissing>{label('onlyShadow')}</StudioMissing>
  </div>
}

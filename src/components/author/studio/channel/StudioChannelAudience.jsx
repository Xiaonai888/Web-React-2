import { BarChart3, Clock3, Globe2, MonitorSmartphone, Subtitles, UsersRound } from 'lucide-react'
import { StudioCard, StudioMissing, formatStudioCount } from '../ShadowStudioAnalyticsShared'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import './ShadowStudioChannelExtraCopy'

function availableValue(metric) {
  const value = metric?.available === true ? Number(metric.value) : NaN
  return Number.isFinite(value) && value >= 0 ? formatStudioCount(value) : '—'
}

function SummaryMetric({ title, metric }) {
  return <StudioCard className="min-w-0 space-y-2">
    <p className="text-xs text-[var(--shadow-text-secondary)]">{title}</p>
    <p className="text-2xl font-bold tabular-nums">{availableValue(metric)}</p>
  </StudioCard>
}

function DetailCard({ title, icon: Icon, items, empty }) {
  const rows = Array.isArray(items) ? items.filter(item => item && typeof item.label === 'string' && item.label.trim() && Number.isFinite(Number(item.value)) && Number(item.value) >= 0).slice(0, 8) : []
  return <StudioCard className="space-y-4">
    <h3 className="flex items-center gap-2 text-sm font-semibold"><Icon size={18} />{title}</h3>
    {rows.length ? <div className="space-y-3">
      {rows.map((item, index) => <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <span className="shrink-0 tabular-nums font-semibold">{formatStudioCount(Number(item.value))}{item.unit === 'percent' ? '%' : ''}</span>
      </div>)}
    </div> : <p className="py-5 text-sm text-[var(--shadow-text-secondary)]">{empty}</p>}
  </StudioCard>
}

export default function StudioChannelAudience({ data = null }) {
  const { t } = useDisplayTranslation()
  const l = key => t(`shadowStudioChannelExtra.${key}`)
  const summaries = [
    ['monthlyAudience', data?.monthly_audience],
    ['newViewers', data?.new_viewers],
    ['casualViewers', data?.casual_viewers],
    ['regularViewers', data?.regular_viewers],
  ]
  const groups = [
    ['audienceMix', UsersRound, data?.viewer_groups],
    ['audienceOnline', Clock3, data?.online_hours],
    ['devices', MonitorSmartphone, data?.device_types],
    ['geography', Globe2, data?.geographies],
    ['age', UsersRound, data?.ages],
    ['gender', UsersRound, data?.genders],
    ['subtitleLanguages', Subtitles, data?.subtitle_languages],
    ['followerWatch', BarChart3, data?.follower_watch_time],
    ['formats', BarChart3, data?.format_mix],
    ['otherContent', BarChart3, data?.other_content],
    ['otherCreators', UsersRound, data?.other_creators],
  ]

  return <section className="space-y-5" aria-label={t('shadowStudioChannel.audience')}>
    <StudioMissing>{l('audienceIntro')}</StudioMissing>
    <div className="grid grid-cols-2 gap-3">
      {summaries.map(([key, metric]) => <SummaryMetric key={key} title={l(key)} metric={metric} />)}
    </div>
    <div className="grid grid-cols-2 gap-3">
      <SummaryMetric title={l('returningViewers')} metric={data?.returning_viewers} />
      <SummaryMetric title={l('followers')} metric={data?.followers} />
    </div>
    {groups.map(([key, Icon, items]) => <DetailCard key={key} title={l(key)} icon={Icon} items={items} empty={key === 'audienceOnline' ? l('noHeatmap') : l('noBreakdown')} />)}
    <StudioMissing>{l('sourceNote')}</StudioMissing>
  </section>
}

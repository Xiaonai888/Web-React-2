import { BarChart3, CalendarDays, Clock3, Globe2, MonitorSmartphone, Subtitles, UsersRound } from 'lucide-react'
import { StudioCard, StudioMissing, formatStudioCount } from '../ShadowStudioAnalyticsShared'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../../../i18n/registerTranslations'
import './ShadowStudioChannelExtraCopy'

registerTranslationNamespace('shadowStudioAudienceObserved', {
  en: {
    observedOnly: 'Shadow observations only. This does not include playback on YouTube or activity before tracking began.',
    partial: 'Partial coverage: values represent tracked, qualified playback in Shadow, not your complete audience.',
    unique: 'Observed unique viewers', repeat: 'Viewed on 2+ days', sessions: 'Observed playback sessions',
    daily: 'Observed viewers by day', dailyHelp: 'Unique viewers recorded on each shown day; the daily totals must not be added together.',
    dailyMissing: 'Daily audience data is not available yet.',
    formatHelp: 'Unique viewers observed by video format. Available when at least 10 viewers were measured.',
    longOnly: 'Long videos only', shortsOnly: 'Shorts only', both: 'Both formats', unclassified: 'Unclassified',
    additional: 'More audience insights', moreInfo: 'Open measurements that are not yet collected by Shadow.',
    observedNote: 'Monthly audience below represents observed qualified viewers in the last 30 days.',
  },
  km: {
    observedOnly: 'នេះជាទិន្នន័យដែល Shadow កត់ត្រាប៉ុណ្ណោះ។ មិនរួមបញ្ចូលការមើលនៅ YouTube ឬមុនចាប់ផ្តើម Tracking ទេ។',
    partial: 'ទិន្នន័យមិនទាន់ពេញលេញ៖ រាប់តែការមើលដែល Shadow បានកត់ត្រា និងមានលក្ខណៈគ្រប់គ្រាន់។',
    unique: 'អ្នកទស្សនាមិនស្ទួនដែលបានកត់ត្រា', repeat: 'មើលយ៉ាងតិច ២ ថ្ងៃ', sessions: 'ចំនួនវគ្គមើលដែលបានកត់ត្រា',
    daily: 'អ្នកទស្សនាដែលបានកត់ត្រាតាមថ្ងៃ', dailyHelp: 'រាប់អ្នកទស្សនាមិនស្ទួនក្នុងមួយថ្ងៃ។ មិនត្រូវបូកចំនួនរាល់ថ្ងៃជាចំនួនអ្នកសរុបទេ។',
    dailyMissing: 'មិនទាន់មានទិន្នន័យអ្នកទស្សនាតាមថ្ងៃ។',
    formatHelp: 'អ្នកទស្សនាមិនស្ទួនតាមប្រភេទវីដេអូ។ បង្ហាញនៅពេលវាស់បានយ៉ាងតិច ១០ នាក់។',
    longOnly: 'វីដេអូវែងប៉ុណ្ណោះ', shortsOnly: 'វីដេអូខ្លីប៉ុណ្ណោះ', both: 'ទាំងពីរប្រភេទ', unclassified: 'មិនទាន់ចាត់ប្រភេទ',
    additional: 'ស្ថិតិអ្នកទស្សនាបន្ថែម', moreInfo: 'បើកមើលស្ថិតិដែល Shadow មិនទាន់មានប្រភពទិន្នន័យ។',
    observedNote: 'អ្នកទស្សនាប្រចាំខែខាងក្រោមរាប់តែអ្នកមើលដែលបានកត់ត្រាគ្រប់លក្ខខណ្ឌក្នុង ៣០ ថ្ងៃចុងក្រោយ។',
  },
  zh: {
    observedOnly: '仅统计 Shadow 内已记录的观看，不包括 YouTube 站内观看或启用统计前的数据。',
    partial: '数据覆盖不完整：仅包括 Shadow 内已记录且符合条件的观看。',
    unique: '已记录去重观众', repeat: '观看至少 2 天', sessions: '已记录播放会话', daily: '每日已记录观众',
    dailyHelp: '按日期显示去重观众，不能将每日数字相加作为总人数。', dailyMissing: '尚无每日观众数据。',
    formatHelp: '按视频形式统计去重观众，至少记录 10 位观众后显示。',
    longOnly: '仅长视频', shortsOnly: '仅 Shorts', both: '两种形式', unclassified: '未分类',
    additional: '更多观众洞察', moreInfo: '展开查看 Shadow 尚未收集的指标。',
    observedNote: '此月度观众数仅反映最近 30 天内符合条件的已记录观众。',
  },
  ja: {
    observedOnly: 'Shadow 内で記録された再生のみです。YouTube 上の再生や記録開始以前の視聴は含みません。',
    partial: '計測範囲は限定的です。Shadow 内の記録済み・対象となる視聴のみを集計しています。',
    unique: '計測済みユニーク視聴者', repeat: '2日以上視聴', sessions: '計測された再生セッション', daily: '日別の計測視聴者',
    dailyHelp: '各日のユニーク視聴者数です。日別人数を合計して総人数にはできません。', dailyMissing: '日別視聴者データはありません。',
    formatHelp: '動画形式別のユニーク視聴者。計測視聴者が10人以上の場合に表示します。',
    longOnly: '長編動画のみ', shortsOnly: 'Shortsのみ', both: '両方', unclassified: '未分類',
    additional: 'その他の視聴者分析', moreInfo: 'Shadow でまだ計測されていない項目を見る。',
    observedNote: '月間視聴者は過去30日間に記録された対象視聴者のみを示します。',
  },
  ko: {
    observedOnly: 'Shadow에서 기록한 재생만 포함합니다. YouTube 시청 및 추적 시작 이전 활동은 제외됩니다.',
    partial: '일부 데이터만 포함: Shadow에서 기록한 유효 재생을 기준으로 집계합니다.',
    unique: '기록된 순 시청자', repeat: '2일 이상 시청', sessions: '기록된 재생 세션', daily: '일별 기록 시청자',
    dailyHelp: '일별 중복 없는 시청자 수입니다. 일별 값을 더해 전체 시청자를 계산하지 마세요.', dailyMissing: '일별 시청자 데이터가 아직 없습니다.',
    formatHelp: '동영상 유형별 중복 없는 시청자 수로, 최소 10명을 기록한 경우 표시됩니다.',
    longOnly: '긴 동영상만', shortsOnly: 'Shorts만', both: '두 유형 모두', unclassified: '미분류',
    additional: '추가 시청자 분석', moreInfo: 'Shadow에서 아직 기록하지 않는 항목을 펼쳐 봅니다.',
    observedNote: '월간 시청자는 최근 30일에 기록된 유효 시청자만 나타냅니다.',
  },
})

function measuredNumber(metric) {
  if (metric?.available !== true || metric.value === null || metric.value === undefined) return null
  const number = Number(metric.value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

function SummaryMetric({ title, metric }) {
  const value = measuredNumber(metric)
  return <StudioCard className="min-w-0 space-y-2">
    <p className="text-xs text-[var(--shadow-text-secondary)]">{title}</p>
    <p className="text-2xl font-bold tabular-nums">{value === null ? '—' : formatStudioCount(value)}</p>
  </StudioCard>
}

function DetailCard({ title, icon: Icon, items, empty }) {
  const rows = Array.isArray(items)
    ? items.filter(item => item && typeof item.label === 'string' && item.label.trim()
      && item.value !== null && item.value !== undefined
      && Number.isFinite(Number(item.value)) && Number(item.value) >= 0).slice(0, 8)
    : []
  return <StudioCard className="space-y-3">
    <h3 className="flex items-center gap-2 text-sm font-semibold"><Icon size={18} />{title}</h3>
    {rows.length ? <div className="space-y-3">
      {rows.map((item, index) => <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <span className="shrink-0 tabular-nums font-semibold">{formatStudioCount(Number(item.value))}{item.unit === 'percent' ? '%' : ''}</span>
      </div>)}
    </div> : <p className="py-4 text-sm text-[var(--shadow-text-secondary)]">{empty}</p>}
  </StudioCard>
}

function DailyObserved({ rows, title, help, empty }) {
  const days = Array.isArray(rows) ? rows.filter(row => {
    const value = Number(row?.unique_viewers)
    return /^\d{4}-\d{2}-\d{2}$/.test(String(row?.day_utc || ''))
      && row?.unique_viewers !== null && Number.isSafeInteger(value) && value >= 0
  }).sort((a, b) => a.day_utc.localeCompare(b.day_utc)).slice(-30) : []
  const max = Math.max(1, ...days.map(day => Number(day.unique_viewers)))
  const dateText = day => new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', timeZone: 'UTC',
  })

  return <StudioCard className="space-y-4">
    <h3 className="flex items-center gap-2 text-sm font-semibold"><CalendarDays size={18} />{title}</h3>
    {days.length ? <>
      <div className="flex h-36 items-end gap-1.5 overflow-x-auto rounded-xl bg-[var(--shadow-bg-soft)] px-3 pt-3 pb-2" role="img" aria-label={title}>
        {days.map(day => {
          const value = Number(day.unique_viewers)
          return <div key={day.day_utc} className="flex h-full min-w-[8px] max-w-[30px] flex-1 items-end" title={`${dateText(day.day_utc)}: ${formatStudioCount(value)}`}>
            <div className="w-full rounded-t-md bg-[var(--shadow-accent)]" style={{ height: `${value === 0 ? 2 : Math.max(4, 100 * value / max)}%` }} />
          </div>
        })}
      </div>
      <div className="flex justify-between gap-3 text-xs text-[var(--shadow-text-secondary)]">
        <span>{dateText(days[0].day_utc)}</span>
        {days.length > 1 ? <span>{dateText(days[days.length - 1].day_utc)}</span> : null}
      </div>
      <p className="text-xs text-[var(--shadow-text-secondary)]">{help}</p>
    </> : <p className="py-6 text-sm text-[var(--shadow-text-secondary)]">{empty}</p>}
  </StudioCard>
}

function FormatSummary({ rows, title, help, empty, translate }) {
  const items = Array.isArray(rows)
    ? rows.filter(item => item && typeof item.key === 'string' && item.value !== null
      && item.value !== undefined && Number.isSafeInteger(Number(item.value)) && Number(item.value) >= 0)
      .slice(0, 4)
    : []
  const total = items.reduce((sum, item) => sum + Number(item.value), 0)
  const names = { long_only: 'longOnly', shorts_only: 'shortsOnly', both_formats: 'both', unclassified: 'unclassified' }
  return <StudioCard className="space-y-4">
    <h3 className="flex items-center gap-2 text-sm font-semibold"><BarChart3 size={18} />{title}</h3>
    {items.length && total > 0 ? <div className="space-y-4">
      {items.map(item => {
        const count = Number(item.value)
        const label = names[item.key] ? translate(names[item.key]) : String(item.label || item.key)
        return <div key={item.key} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{label}</span>
            <span className="shrink-0 font-semibold tabular-nums">{formatStudioCount(count)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
            <div className="h-full rounded-full bg-[var(--shadow-accent)]" style={{ width: `${100 * count / total}%` }} />
          </div>
        </div>
      })}
    </div> : <p className="py-4 text-sm text-[var(--shadow-text-secondary)]">{empty}</p>}
    <p className="text-xs text-[var(--shadow-text-secondary)]">{help}</p>
  </StudioCard>
}

export default function StudioChannelAudience({ data = null }) {
  const { t } = useDisplayTranslation()
  const l = key => t(`shadowStudioChannelExtra.${key}`)
  const observed = key => t(`shadowStudioAudienceObserved.${key}`)
  const currentDays = Number(data?.period_days) || 30
  const audienceMetric = currentDays === 30 ? data?.monthly_audience : data?.unique_viewers_in_period
  const observedMetrics = [
    [currentDays === 30 ? l('monthlyAudience') : observed('unique'), audienceMetric],
    [observed('repeat'), data?.repeat_viewers_in_period],
    [observed('sessions'), data?.observed_sessions],
  ]
  const otherMetrics = [
    ['newViewers', data?.new_viewers],
    ['casualViewers', data?.casual_viewers],
    ['regularViewers', data?.regular_viewers],
    ['returningViewers', data?.returning_viewers],
    ['followers', data?.followers],
  ]
  const details = [
    ['audienceMix', UsersRound, data?.viewer_groups],
    ['audienceOnline', Clock3, data?.online_hours],
    ['devices', MonitorSmartphone, data?.device_types],
    ['geography', Globe2, data?.geographies],
    ['age', UsersRound, data?.ages],
    ['gender', UsersRound, data?.genders],
    ['subtitleLanguages', Subtitles, data?.subtitle_languages],
    ['followerWatch', BarChart3, data?.follower_watch_time],
    ['otherContent', BarChart3, data?.other_content],
    ['otherCreators', UsersRound, data?.other_creators],
  ]
  const availableDetails = details.filter(([, , items]) => Array.isArray(items) && items.length > 0)
  const emptyDetails = details.filter(([, , items]) => !Array.isArray(items) || !items.length)

  return <section className="space-y-5" aria-label={t('shadowStudioChannel.audience')}>
    <StudioMissing>{l('audienceIntro')}</StudioMissing>
    {data?.coverage?.complete !== true ? <StudioMissing>{observed('partial')}</StudioMissing> : null}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {observedMetrics.map(([title, metric]) => <SummaryMetric key={title} title={title} metric={metric} />)}
    </div>
    <p className="text-xs text-[var(--shadow-text-secondary)]">{currentDays === 30 ? observed('observedNote') : observed('partial')}</p>
    <DailyObserved rows={data?.daily_observed_unique} title={observed('daily')} help={observed('dailyHelp')} empty={observed('dailyMissing')} />
    <FormatSummary rows={data?.format_mix} title={l('formats')} help={observed('formatHelp')} empty={l('noBreakdown')} translate={observed} />
    {availableDetails.map(([key, Icon, items]) => <DetailCard key={key} title={l(key)} icon={Icon} items={items} empty={l('noBreakdown')} />)}
    <details className="group rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
      <summary className="cursor-pointer font-semibold text-sm">{observed('additional')}</summary>
      <p className="mt-2 text-xs text-[var(--shadow-text-secondary)]">{observed('moreInfo')}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {otherMetrics.map(([key, metric]) => <SummaryMetric key={key} title={l(key)} metric={metric} />)}
      </div>
      <div className="mt-4 space-y-3">
        {emptyDetails.map(([key, Icon, items]) => <DetailCard key={key} title={l(key)} icon={Icon} items={items} empty={key === 'audienceOnline' ? l('noHeatmap') : l('noBreakdown')} />)}
      </div>
    </details>
    <StudioMissing>{observed('observedOnly')}</StudioMissing>
  </section>
}

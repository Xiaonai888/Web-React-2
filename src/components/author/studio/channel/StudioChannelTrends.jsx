import { useMemo, useState } from 'react'
import { Bookmark, Compass, Search, Sparkles, Video } from 'lucide-react'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { StudioCard, StudioMissing, formatStudioCount } from '../ShadowStudioAnalyticsShared'
import './ShadowStudioChannelExtraCopy'

function TrendList({ title, icon: Icon, rows, empty }) {
  const values = Array.isArray(rows) ? rows.filter(row => row && typeof row.title === 'string' && row.title.trim()).slice(0, 10) : []
  return <StudioCard className="space-y-3">
    <h3 className="flex items-center gap-2 font-semibold"><Icon size={18} />{title}</h3>
    {values.length ? <div className="divide-y divide-[var(--shadow-border)]">
      {values.map((row, index) => <div key={`${row.id || row.title}-${index}`} className="flex items-center justify-between gap-3 py-3 text-sm">
        <span className="min-w-0 flex-1 break-words">{row.title}</span>
        {Number.isFinite(Number(row.count)) && Number(row.count) >= 0 && row.count != null
          ? <span className="shrink-0 tabular-nums text-[var(--shadow-text-secondary)]">{formatStudioCount(Number(row.count))}</span> : null}
      </div>)}
    </div> : <p className="py-5 text-sm text-[var(--shadow-text-secondary)]">{empty}</p>}
  </StudioCard>
}

export default function StudioChannelTrends({ data = null }) {
  const { t } = useDisplayTranslation()
  const l = key => t(`shadowStudioChannelExtra.${key}`)
  const [query, setQuery] = useState('')
  const topics = Array.isArray(data?.topics) ? data.topics : []
  const filtered = useMemo(() => topics.filter(row => typeof row?.title === 'string' && row.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [topics, query])
  const sections = [
    ['trendsTopSearches', Search, data?.top_searches],
    ['trendsRecent', Video, data?.recent_videos],
    ['trendsGaps', Sparkles, data?.shorts_content_gaps],
    ['trendsSaved', Bookmark, data?.saved_topics],
  ]
  return <section className="space-y-5" aria-label={t('shadowStudioChannel.trends')}>
    <StudioMissing>{l('trendsIntro')}</StudioMissing>
    <StudioCard className="space-y-4">
      <h2 className="flex items-center gap-2 font-semibold"><Compass size={19} />{l('trendsExplore')}</h2>
      <label className="flex items-center gap-2 rounded-xl border border-[var(--shadow-border)] px-3 py-2">
        <Search size={18} className="shrink-0 text-[var(--shadow-text-secondary)]" />
        <span className="sr-only">{l('trendsSearch')}</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)}
          placeholder={l('trendsSearchHint')} className="w-full min-w-0 bg-transparent text-sm outline-none" />
      </label>
      <div className="space-y-2">
        {filtered.length ? filtered.slice(0, 12).map((topic, index) => <p key={`${topic.id || topic.title}-${index}`} className="rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-sm">{topic.title}</p>)
          : <p className="py-4 text-sm text-[var(--shadow-text-secondary)]">{query.trim() ? l('trendsNoMatches') : l('noTrends')}</p>}
      </div>
    </StudioCard>
    {sections.map(([key, Icon, rows]) => <TrendList key={key} title={l(key)} icon={Icon} rows={rows} empty={l('noTrends')} />)}
    <StudioMissing>{l('trendsNotYoutube')}</StudioMissing>
  </section>
}

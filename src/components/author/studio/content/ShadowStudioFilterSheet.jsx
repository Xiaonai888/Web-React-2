import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ListFilter, X } from 'lucide-react'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { NEW_STUDIO_FILTERS, studioFilterCopy, studioFiltersActive } from './ShadowStudioContentData'

const TYPE_OPTIONS = [
  { value: 'videos', key: 'videos' },
  { value: 'shorts', key: 'shorts' },
  { value: 'live', key: 'live' },
  { value: 'playlists', key: 'playlists' },
]
const VISIBILITY_OPTIONS = [
  { value: 'published', key: 'public' },
  { value: 'private', key: 'private' },
  { value: 'unlisted', key: 'unlisted' },
  { value: 'scheduled', key: 'scheduled' },
  { value: 'draft', key: 'draft' },
]
const RESTRICTION_OPTIONS = ['madeForKidsAuthor', 'madeForKidsYouTube', 'notMadeForKids', 'notSet']
const SORT_OPTIONS = ['latest', 'oldest', 'popular']

/** No network calls; capabilities prevent selecting filters not represented by the existing API. */
export default function ShadowStudioFilterSheet({
  value = NEW_STUDIO_FILTERS,
  onChange,
  section = 'home',
  disabled = false,
  visibilityOptions,
}) {
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState('all')
  const [draft, setDraft] = useState(() => studioFilterCopy(value))
  const allowedVisibility = useMemo(() => visibilityOptions ||
    (section === 'playlists' ? ['published', 'private'] : ['published', 'draft']),
  [section, visibilityOptions])
  const groups = ['type', 'visibility', 'views', 'sortBy', 'restrictions', 'clips']
  const showGroup = key => panel === 'all' || panel === key

  useEffect(() => {
    if (!open) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function openSheet(nextPanel) {
    if (disabled) return
    setDraft(studioFilterCopy(value))
    setPanel(nextPanel)
    setOpen(true)
  }

  function toggle(group, item) {
    setDraft(current => {
      const list = current[group]
      return { ...current, [group]: list.includes(item) ? list.filter(v => v !== item) : [...list, item] }
    })
  }

  const filtered = studioFiltersActive(value)
  const canFilterViews = section !== 'playlists'
  const hasUnsupported = showGroup('restrictions') || showGroup('clips') || showGroup('visibility')
  const chips = [
    { key: 'all', label: t('shadowStudioNext.filters'), Icon: ListFilter, selected: filtered },
    ...groups.map(key => ({
      key,
      label: t(`shadowStudioNext.${key}`),
      Icon: ChevronDown,
      selected: key === 'type' ? Boolean(value.types?.length) :
        key === 'visibility' ? Boolean(value.visibility?.length) :
        key === 'views' ? value.views?.count !== '' && value.views?.count != null :
        key === 'sortBy' ? value.sort !== 'latest' : false,
    })),
  ]

  const checkList = (options, group, allowed) => <div className="space-y-1">
    {options.map(option => {
      const supported = allowed.includes(option.value)
      return <label key={option.value} className={`flex min-h-12 items-center gap-3 rounded-lg px-1 text-sm ${supported ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'}`} title={!supported ? t('shadowStudioNext.unavailable') : undefined}>
        <input type="checkbox" className="h-5 w-5 shrink-0 accent-[var(--shadow-accent)]"
          disabled={!supported}
          checked={supported && draft[group].includes(option.value)}
          onChange={() => toggle(group, option.value)} />
        <span>{t(`shadowStudioNext.${option.key}`)}</span>
      </label>
    })}
  </div>

  return <>
    <div className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label={t('shadowStudioNext.filters')}>
      {chips.map(({ key, label, Icon, selected }) => <button key={key} type="button"
        disabled={disabled}
        onClick={() => openSheet(key)}
        className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${selected ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-bg-soft)]' : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'}`}>
        {key === 'all' ? <Icon size={17} /> : null}{label}{key !== 'all' ? <Icon size={14} /> : null}
      </button>)}
    </div>
    {open ? <div className="fixed inset-0 z-[100500] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={t('shadowStudioNext.filters')}>
      <button type="button" aria-label={t('shadowStudioNext.cancel')} onClick={() => setOpen(false)} className="absolute inset-0 w-full cursor-default bg-black/75" />
      <div className="relative flex max-h-[85dvh] w-full max-w-[650px] flex-col overflow-hidden rounded-t-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated,var(--shadow-bg-surface))] text-[var(--shadow-text-primary)] shadow-2xl sm:mb-4 sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-5 py-4">
          <h2 className="text-lg font-bold">{t(panel === 'all' ? 'shadowStudioNext.filters' : `shadowStudioNext.${panel}`)}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={t('shadowStudioNext.cancel')} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]"><X size={21}/></button>
        </div>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {showGroup('type') ? <section className="space-y-3">
            {panel === 'all' ? <h3 className="text-base font-semibold">{t('shadowStudioNext.type')}</h3> : null}
            {checkList(TYPE_OPTIONS, 'types', ['videos', 'shorts', 'playlists'])}
          </section> : null}
          {showGroup('visibility') ? <section className="space-y-3 border-t border-[var(--shadow-border)] pt-5 first:border-0 first:pt-0">
            {panel === 'all' ? <h3 className="text-base font-semibold">{t('shadowStudioNext.visibility')}</h3> : null}
            {checkList(VISIBILITY_OPTIONS, 'visibility', allowedVisibility)}
          </section> : null}
          {showGroup('views') ? <section className="space-y-4 border-t border-[var(--shadow-border)] pt-5 first:border-0 first:pt-0">
            {panel === 'all' ? <h3 className="text-base font-semibold">{t('shadowStudioNext.views')}</h3> : null}
            <div className={canFilterViews ? '' : 'pointer-events-none opacity-45'}>
              {['more', 'less'].map(key => <label key={key} className="mb-3 flex min-h-10 cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name="shadow-studio-view-filter" value={key} disabled={!canFilterViews}
                  checked={draft.views.comparison === key}
                  onChange={() => setDraft(current => ({ ...current, views: { ...current.views, comparison: key } }))}
                  className="h-5 w-5 accent-[var(--shadow-accent)]" />
                {t(key === 'more' ? 'shadowStudioNext.moreThan' : 'shadowStudioNext.lessThan')}
              </label>)}
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={12}
                disabled={!canFilterViews}
                value={draft.views.count}
                onChange={event => {
                  const next = event.target.value
                  if (/^\d{0,12}$/.test(next)) setDraft(current => ({ ...current, views: { ...current.views, count: next } }))
                }}
                placeholder={t('shadowStudioNext.enterViews')}
                aria-label={t('shadowStudioNext.enterViews')}
                className="min-h-12 w-full rounded-xl border border-[var(--shadow-border-strong,var(--shadow-border))] bg-[var(--shadow-input-bg,var(--shadow-bg-surface))] px-4 text-sm outline-none focus:border-[var(--shadow-text-primary)]" />
            </div>
          </section> : null}
          {showGroup('sortBy') ? <section className="space-y-3 border-t border-[var(--shadow-border)] pt-5 first:border-0 first:pt-0">
            {panel === 'all' ? <h3 className="text-base font-semibold">{t('shadowStudioNext.sortBy')}</h3> : null}
            {SORT_OPTIONS.map(option => <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input type="radio" name="shadow-studio-sort" value={option} checked={draft.sort === option}
                onChange={() => setDraft(current => ({ ...current, sort: option }))}
                className="h-5 w-5 accent-[var(--shadow-accent)]" />
              {t(`shadowStudioNext.${option}`)}
            </label>)}
          </section> : null}
          {showGroup('restrictions') ? <section className="space-y-3 border-t border-[var(--shadow-border)] pt-5 first:border-0 first:pt-0">
            {panel === 'all' ? <h3 className="text-base font-semibold">{t('shadowStudioNext.restrictions')}</h3> : null}
            {RESTRICTION_OPTIONS.map(key => <label key={key} className="flex min-h-11 items-center gap-3 text-sm opacity-45" title={t('shadowStudioNext.unavailable')}>
              <input type="checkbox" disabled className="h-5 w-5" />{t(`shadowStudioNext.${key}`)}
            </label>)}
          </section> : null}
          {showGroup('clips') ? <section className="space-y-3 border-t border-[var(--shadow-border)] pt-5 first:border-0 first:pt-0">
            {panel === 'all' ? <h3 className="text-base font-semibold">{t('shadowStudioNext.clips')}</h3> : null}
            <label className="flex min-h-11 items-center gap-3 text-sm opacity-45" title={t('shadowStudioNext.unavailable')}>
              <input type="checkbox" disabled className="h-5 w-5" />{t('shadowStudioNext.containsClips')}
            </label>
          </section> : null}
          {hasUnsupported ? <p className="pb-2 text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioNext.unavailable')}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-3 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated,var(--shadow-bg-surface))] px-5 py-4">
          <button type="button" onClick={() => setDraft(studioFilterCopy(NEW_STUDIO_FILTERS))}
            className="min-h-11 rounded-full border border-[var(--shadow-border)] px-5 text-xs font-semibold">{t('shadowStudioNext.reset')}</button>
          <button type="button" onClick={() => { onChange?.(studioFilterCopy(draft)); setOpen(false) }}
            className="min-h-11 flex-1 rounded-full bg-[var(--shadow-text-primary)] px-5 text-sm font-semibold text-[var(--shadow-bg-surface)]">
            {t('shadowStudioNext.apply')}
          </button>
        </div>
      </div>
    </div> : null}
  </>
}

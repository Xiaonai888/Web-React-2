import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import ShadowStudioFilterSheet from './ShadowStudioFilterSheet'
import ShadowStudioPlaylistCard from './ShadowStudioPlaylistCard'
import ShadowStudioVideoCard from './ShadowStudioVideoCard'
import {
  NEW_STUDIO_FILTERS, studioFilterCopy, studioFilterItems, studioFiltersActive,
} from './ShadowStudioContentData'

const SECTION_KEYS = ['videos', 'shorts', 'playlists']

/**
 * Standalone, presentational Shadow Studio content UI.
 * No fetch, navigation, mutation, or integration with the existing Content Manager.
 * A future parent passes paginated API results and handles all actions via callbacks.
 */
export default function ShadowStudioContentSections({
  videos = [],
  shorts = [],
  playlists = [],
  initialSection = 'home',
  previewCount = 5,
  loading = {},
  errors = {},
  pagination = {},
  onLoadMore,
  onRetry,
  onOpenVideo,
  onOpenPlaylist,
  onVideoAction,
  onPlaylistAction,
  onSelectSection,
  onBack,
  applyLocalFilters = true,
}) {
  const { t } = useDisplayTranslation()
  const [section, setSection] = useState(SECTION_KEYS.includes(initialSection) ? initialSection : 'home')
  const [filters, setFilters] = useState(() => studioFilterCopy(NEW_STUDIO_FILTERS))

  useEffect(() => {
    setSection(SECTION_KEYS.includes(initialSection) ? initialSection : 'home')
  }, [initialSection])

  const collections = useMemo(() => ({
    videos: Array.isArray(videos) ? videos : [],
    shorts: Array.isArray(shorts) ? shorts : [],
    playlists: Array.isArray(playlists) ? playlists : [],
  }), [videos, shorts, playlists])

  const visible = useMemo(() => Object.fromEntries(SECTION_KEYS.map(key => [
    key, applyLocalFilters ? studioFilterItems(collections[key], filters, key) : collections[key],
  ])), [collections, filters, applyLocalFilters])

  function select(nextSection) {
    setSection(nextSection)
    setFilters(studioFilterCopy(NEW_STUDIO_FILTERS))
    onSelectSection?.(nextSection)
  }

  function goBack() {
    if (typeof onBack === 'function') onBack(section)
    select('home')
  }

  function renderCard(item, key, display) {
    if (key === 'playlists') {
      return <ShadowStudioPlaylistCard playlist={item} onOpen={onOpenPlaylist} onAction={onPlaylistAction} />
    }
    return <ShadowStudioVideoCard video={item} display={display}
      onOpen={onOpenVideo} onAction={onVideoAction} />
  }

  function renderEmpty(key) {
    if (loading[key] && !collections[key].length) {
      return <p className="py-7 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioNext.loading')}</p>
    }
    if (errors[key]) {
      return <div className="space-y-2 py-5 text-center text-sm text-[var(--shadow-danger)]">
        <p role="alert">{String(errors[key])}</p>
        {typeof onRetry === 'function' ? <button type="button" onClick={() => onRetry(key)} className="inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-3 py-2 text-xs"><RefreshCw size={15}/>{t('shadowStudioNext.retry')}</button> : null}
      </div>
    }
    return <p className="py-7 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioNext.empty')}</p>
  }

  function renderSection(key, isHome) {
    const items = visible[key] || []
    const shown = isHome ? items.slice(0, Math.max(1, previewCount)) : items
    const isShort = key === 'shorts'
    const display = isHome ? (isShort ? 'shorts' : 'grid') : isShort ? 'shorts' : 'list'

    return <section key={key} className="min-w-0 space-y-3" aria-label={t(`shadowStudioNext.${key}`)}>
      {isHome ? <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{t(`shadowStudioNext.${key}`)}</h2>
        <button type="button" onClick={() => select(key)}
          className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full border border-[var(--shadow-border)] px-3 text-xs font-semibold">
          {t('shadowStudioNext.viewAll')}<ChevronRight size={14} aria-hidden="true" />
        </button>
      </div> : null}
      {shown.length ? <div className={isHome
        ? 'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none]'
        : isShort ? 'grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4'
          : 'divide-y divide-[var(--shadow-border)]'}>
        {shown.map(item => <div key={item.id} className={isHome
          ? `min-w-0 shrink-0 snap-start ${isShort ? 'w-[42%] max-w-[200px] sm:w-[190px]' : 'w-[66%] max-w-[275px] sm:w-[235px]'}`
          : 'min-w-0'}>
          {renderCard(item, key, display)}
        </div>)}
      </div> : renderEmpty(key)}
      {!isHome && pagination[key]?.has_more && typeof onLoadMore === 'function' ? <div className="pt-4 text-center">
        <button type="button" disabled={Boolean(loading[key])} onClick={() => onLoadMore(key)}
          className="min-h-10 rounded-full border border-[var(--shadow-border)] px-5 text-xs font-semibold disabled:opacity-50">
          {loading[key] ? t('shadowStudioNext.loading') : t('shadowStudioNext.loadMore')}
        </button>
      </div> : null}
      {!isHome && applyLocalFilters && studioFiltersActive(filters) && Boolean(pagination[key]?.has_more) ? <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioNext.loadedOnly')}</p> : null}
    </section>
  }

  const isHome = section === 'home'
  return <section className="mx-auto w-full max-w-[980px] space-y-5 text-[var(--shadow-text-primary)]">
    {isHome ? null : <header className="flex min-w-0 items-center gap-3">
      <button type="button" onClick={goBack} aria-label={t('shadowStudioNext.back')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]">
        <ArrowLeft size={22}/>
      </button>
      <h1 className="truncate text-xl font-bold">{t(`shadowStudioNext.${section}`)}</h1>
    </header>}
    <ShadowStudioFilterSheet
      value={filters} onChange={setFilters} section={section}
      visibilityOptions={section === 'playlists' ? ['published', 'private'] : ['published', 'draft']}
    />
    {isHome ? SECTION_KEYS.filter(key => !filters.types.length || filters.types.includes(key)).map(key => renderSection(key, true))
      : renderSection(section, false)}
  </section>
}

import { Plus, RefreshCw } from 'lucide-react'
import { registerTranslationNamespace } from '../../../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'

registerTranslationNamespace('shadowStudioContentHeader', {
  en: { content: 'Content', add: 'Add Reel', refresh: 'Refresh content' },
  km: { content: 'មាតិកា', add: 'បន្ថែម Reel', refresh: 'ធ្វើបច្ចុប្បន្នភាពមាតិកា' },
  zh: { content: '内容', add: '添加 Reel', refresh: '刷新内容' },
  ja: { content: 'コンテンツ', add: 'Reelを追加', refresh: 'コンテンツを更新' },
  ko: { content: '콘텐츠', add: 'Reel 추가', refresh: '콘텐츠 새로고침' },
})

export default function ShadowStudioContentHeader({ onExitStudio, onAddVideo, onRefresh, refreshing = false, busy = false }) {
  const { t } = useDisplayTranslation()
  return <header className="mx-auto flex w-full max-w-[980px] flex-wrap items-center justify-between gap-3">
    <div className="min-w-0">
      {typeof onExitStudio === 'function' ? <button type="button" onClick={onExitStudio}
        className="text-left text-sm font-semibold text-[var(--shadow-text-secondary)] hover:text-[var(--shadow-text-primary)]">
        Shadow Studio
      </button> : <p className="text-sm font-semibold text-[var(--shadow-text-secondary)]">Shadow Studio</p>}
      <h1 className="mt-1 text-xl font-bold text-[var(--shadow-text-primary)]">{t('shadowStudioContentHeader.content')}</h1>
    </div>
    <div className="flex items-center gap-2">
      {typeof onRefresh === 'function' ? <button type="button" onClick={onRefresh}
        disabled={busy || refreshing}
        aria-label={t('shadowStudioContentHeader.refresh')}
        title={t('shadowStudioContentHeader.refresh')}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--shadow-border)] text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-soft)] disabled:cursor-not-allowed disabled:opacity-50">
        <RefreshCw size={18} aria-hidden="true" className={refreshing ? 'animate-spin' : ''} />
      </button> : null}
      {typeof onAddVideo === 'function' ? <button type="button" disabled={busy} onClick={onAddVideo}
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--shadow-accent)] px-4 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50">
        <Plus size={16} aria-hidden="true" />{t('shadowStudioContentHeader.add')}
      </button> : null}
    </div>
  </header>
}

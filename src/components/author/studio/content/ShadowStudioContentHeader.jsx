import { Plus } from 'lucide-react'
import { registerTranslationNamespace } from '../../../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'

registerTranslationNamespace('shadowStudioContentHeader', {
  en: { content: 'Content', add: 'Add Reel' },
  km: { content: 'មាតិកា', add: 'បន្ថែម Reel' },
  zh: { content: '内容', add: '添加 Reel' },
  ja: { content: 'コンテンツ', add: 'Reelを追加' },
  ko: { content: '콘텐츠', add: 'Reel 추가' },
})

export default function ShadowStudioContentHeader({ onExitStudio, onAddVideo, busy = false }) {
  const { t } = useDisplayTranslation()
  return <header className="mx-auto flex w-full max-w-[980px] flex-wrap items-center justify-between gap-3">
    <div className="min-w-0">
      {typeof onExitStudio === 'function' ? <button type="button" onClick={onExitStudio}
        className="text-left text-sm font-semibold text-[var(--shadow-text-secondary)] hover:text-[var(--shadow-text-primary)]">
        Shadow Studio
      </button> : <p className="text-sm font-semibold text-[var(--shadow-text-secondary)]">Shadow Studio</p>}
      <h1 className="mt-1 text-xl font-bold text-[var(--shadow-text-primary)]">{t('shadowStudioContentHeader.content')}</h1>
    </div>
    {typeof onAddVideo === 'function' ? <button type="button" disabled={busy} onClick={onAddVideo}
      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--shadow-accent)] px-4 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50">
      <Plus size={16} aria-hidden="true" />{t('shadowStudioContentHeader.add')}
    </button> : null}
  </header>
}

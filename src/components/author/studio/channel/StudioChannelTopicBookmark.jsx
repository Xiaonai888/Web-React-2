import { Bookmark, BookmarkCheck, LoaderCircle } from 'lucide-react'
import { registerTranslationNamespace } from '../../../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'

registerTranslationNamespace('shadowStudioTopicBookmark', {
  en: { save: 'Save topic', remove: 'Remove saved topic', working: 'Updating saved topic' },
  km: { save: 'រក្សាទុកប្រធានបទ', remove: 'ដកប្រធានបទដែលបានរក្សាទុក', working: 'កំពុងធ្វើបច្ចុប្បន្នភាព' },
  zh: { save: '保存主题', remove: '移除已保存主题', working: '正在更新主题' },
  ja: { save: 'トピックを保存', remove: '保存済みトピックを削除', working: 'トピックを更新中' },
  ko: { save: '주제 저장', remove: '저장된 주제 삭제', working: '주제 업데이트 중' },
})

export default function StudioChannelTopicBookmark({
  topic,
  saved = false,
  busy = false,
  disabled = false,
  onSave,
  onRemove,
}) {
  const { t } = useDisplayTranslation()
  const normalized = typeof topic === 'string' ? topic.replace(/\s+/gu, ' ').trim() : ''
  if (!normalized || normalized.length < 2 || normalized.length > 80) return null
  const label = busy ? t('shadowStudioTopicBookmark.working')
    : t(saved ? 'shadowStudioTopicBookmark.remove' : 'shadowStudioTopicBookmark.save')
  return <button
    type="button"
    aria-label={`${label}: ${normalized}`}
    aria-pressed={saved}
    title={label}
    disabled={disabled || busy || typeof (saved ? onRemove : onSave) !== 'function'}
    onClick={() => (saved ? onRemove : onSave)?.(normalized)}
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] transition-opacity active:opacity-60 disabled:opacity-40"
  >
    {busy ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
      : saved ? <BookmarkCheck size={17} aria-hidden="true" />
        : <Bookmark size={17} aria-hidden="true" />}
  </button>
}

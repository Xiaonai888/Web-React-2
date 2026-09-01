import { useEffect, useMemo, useState } from 'react'
import { Check, Folder, Plus, X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('savedPostCollectionSheet', {
  "en": {
    "title": "Add to Collections",
    "intro": "A saved post can belong to more than one collection.",
    "savedPost": "saved post",
    "savedPosts": "saved posts",
    "createNew": "Create New Collection",
    "cancel": "Cancel",
    "saving": "Saving...",
    "saveChanges": "Save Changes"
  },
  "km": {
    "title": "បន្ថែមទៅបណ្ដុំ",
    "intro": "ប្រកាសដែលបានរក្សាទុកមួយ អាចស្ថិតក្នុងបណ្ដុំច្រើនជាងមួយ។",
    "savedPost": "ប្រកាសបានរក្សាទុក",
    "savedPosts": "ប្រកាសបានរក្សាទុក",
    "createNew": "បង្កើតបណ្ដុំថ្មី",
    "cancel": "បោះបង់",
    "saving": "កំពុងរក្សាទុក...",
    "saveChanges": "រក្សាទុកការផ្លាស់ប្ដូរ"
  },
  "zh": {
    "title": "添加到收藏夹",
    "intro": "一个已保存的帖子可以属于多个收藏夹。",
    "savedPost": "个已保存帖子",
    "savedPosts": "个已保存帖子",
    "createNew": "新建收藏夹",
    "cancel": "取消",
    "saving": "保存中...",
    "saveChanges": "保存更改"
  },
  "ja": {
    "title": "コレクションに追加",
    "intro": "保存済み投稿は複数のコレクションに追加できます。",
    "savedPost": "件の保存済み投稿",
    "savedPosts": "件の保存済み投稿",
    "createNew": "新しいコレクションを作成",
    "cancel": "キャンセル",
    "saving": "保存中...",
    "saveChanges": "変更を保存"
  },
  "ko": {
    "title": "컬렉션에 추가",
    "intro": "저장한 게시물은 여러 컬렉션에 포함될 수 있습니다.",
    "savedPost": "개의 저장 게시물",
    "savedPosts": "개의 저장 게시물",
    "createNew": "새 컬렉션 만들기",
    "cancel": "취소",
    "saving": "저장 중...",
    "saveChanges": "변경사항 저장"
  }
})


export default function SavedPostCollectionSheet({
  open,
  item,
  collections,
  saving,
  onClose,
  onSave,
  onCreateCollection,
}) {
  const { t } = useDisplayTranslation()
  const initialIds = useMemo(
    () => new Set((item?.collections || []).map((collection) => collection.id)),
    [item]
  )
  const [selectedIds, setSelectedIds] = useState(initialIds)

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set((item?.collections || []).map((collection) => collection.id)))
    }
  }, [item, open])

  if (!open || !item) return null

  function toggleCollection(collectionId) {
    setSelectedIds((current) => {
      const next = new Set(current)

      if (next.has(collectionId)) {
        next.delete(collectionId)
      } else {
        next.add(collectionId)
      }

      return next
    })
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center">
      <button
        type="button"
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label="Close collection picker"
      />

      <section className="relative z-10 w-full max-w-[560px] rounded-t-[28px] bg-white px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-[#171923]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d9dce4] dark:bg-white/15" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827] dark:text-white">{t('savedPostCollectionSheet.title')}</h2>
            <p className="mt-1 text-[12px] leading-5 text-[#8d94a1] dark:text-white/45">
              {t('savedPostCollectionSheet.intro')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 disabled:opacity-50 dark:bg-white/10 dark:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 max-h-[48vh] space-y-2 overflow-y-auto pr-1">
          {collections.map((collection) => {
            const selected = selectedIds.has(collection.id)

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => toggleCollection(collection.id)}
                disabled={saving}
                className={`flex w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-left transition active:scale-[0.99] disabled:opacity-60 ${
                  selected
                    ? 'bg-[#f3f0ff] ring-1 ring-[#6d4aff]/30 dark:bg-[#6d4aff]/12 dark:ring-[#8d72ff]/30'
                    : 'bg-[#f8f8fb] ring-1 ring-transparent dark:bg-white/5'
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-white"
                  style={{ backgroundColor: collection.cover_color || '#6D4AFF' }}
                >
                  <Folder className="h-[18px] w-[18px]" fill="currentColor" strokeWidth={1.6} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">
                    {collection.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#8d94a1] dark:text-white/40">
                    {Number(collection.item_count || 0)}{' '}
                    {t(
                      Number(collection.item_count || 0) === 1
                        ? 'savedPostCollectionSheet.savedPost'
                        : 'savedPostCollectionSheet.savedPosts'
                    )}
                  </span>
                </span>

                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    selected
                      ? 'border-[#6d4aff] bg-[#6d4aff] text-white'
                      : 'border-[#d7d9e0] bg-white text-transparent dark:border-white/20 dark:bg-white/5'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={onCreateCollection}
            disabled={saving}
            className="flex w-full items-center gap-3 rounded-[18px] border border-dashed border-[#cfc8ff] px-3.5 py-3 text-left text-[#6d4aff] active:scale-[0.99] disabled:opacity-60 dark:border-[#8d72ff]/35 dark:text-[#b9a8ff]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f3f0ff] dark:bg-[#6d4aff]/12">
              <Plus className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="text-[13.5px] font-extrabold">{t('savedPostCollectionSheet.createNew')}</span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-12 rounded-[16px] bg-[#f5f3fa] text-[13px] font-extrabold text-[#4b5563] active:scale-[0.99] disabled:opacity-50 dark:bg-white/10 dark:text-white/70"
          >
            {t('savedPostCollectionSheet.cancel')}
          </button>

          <button
            type="button"
            onClick={() => onSave([...selectedIds])}
            disabled={saving}
            className="h-12 rounded-[16px] bg-[#6d4aff] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? t('savedPostCollectionSheet.saving') : t('savedPostCollectionSheet.saveChanges')}
          </button>
        </div>
      </section>
    </div>
  )
}

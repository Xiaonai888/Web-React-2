import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('savedPostCollectionEditor', {
  "en": {
    "editCollection": "Edit Collection",
    "newCollection": "New Collection",
    "intro": "Organize saved posts without changing the original post.",
    "collectionName": "Collection Name",
    "namePlaceholder": "Example: Inspiration",
    "description": "Description",
    "descriptionPlaceholder": "Optional note about this collection",
    "collectionColor": "Collection Color",
    "saving": "Saving...",
    "saveCollection": "Save Collection",
    "createCollection": "Create Collection"
  },
  "km": {
    "editCollection": "កែសម្រួលបណ្ដុំ",
    "newCollection": "បណ្ដុំថ្មី",
    "intro": "រៀបចំប្រកាសដែលបានរក្សាទុក ដោយមិនប្ដូរប្រកាសដើម។",
    "collectionName": "ឈ្មោះបណ្ដុំ",
    "namePlaceholder": "ឧទាហរណ៍៖ គំនិតបំផុស",
    "description": "ការពិពណ៌នា",
    "descriptionPlaceholder": "កំណត់ចំណាំបន្ថែមអំពីបណ្ដុំនេះ",
    "collectionColor": "ពណ៌បណ្ដុំ",
    "saving": "កំពុងរក្សាទុក...",
    "saveCollection": "រក្សាទុកបណ្ដុំ",
    "createCollection": "បង្កើតបណ្ដុំ"
  },
  "zh": {
    "editCollection": "编辑收藏夹",
    "newCollection": "新建收藏夹",
    "intro": "整理已保存的帖子，不会更改原帖。",
    "collectionName": "收藏夹名称",
    "namePlaceholder": "例如：灵感",
    "description": "说明",
    "descriptionPlaceholder": "关于此收藏夹的可选备注",
    "collectionColor": "收藏夹颜色",
    "saving": "保存中...",
    "saveCollection": "保存收藏夹",
    "createCollection": "创建收藏夹"
  },
  "ja": {
    "editCollection": "コレクションを編集",
    "newCollection": "新しいコレクション",
    "intro": "元の投稿を変更せずに保存済み投稿を整理できます。",
    "collectionName": "コレクション名",
    "namePlaceholder": "例：インスピレーション",
    "description": "説明",
    "descriptionPlaceholder": "このコレクションについての任意メモ",
    "collectionColor": "コレクションの色",
    "saving": "保存中...",
    "saveCollection": "コレクションを保存",
    "createCollection": "コレクションを作成"
  },
  "ko": {
    "editCollection": "컬렉션 수정",
    "newCollection": "새 컬렉션",
    "intro": "원본 게시물을 변경하지 않고 저장한 게시물을 정리하세요.",
    "collectionName": "컬렉션 이름",
    "namePlaceholder": "예: 영감",
    "description": "설명",
    "descriptionPlaceholder": "이 컬렉션에 대한 선택 메모",
    "collectionColor": "컬렉션 색상",
    "saving": "저장 중...",
    "saveCollection": "컬렉션 저장",
    "createCollection": "컬렉션 만들기"
  }
})


const COLORS = ['#6D4AFF', '#F6B800', '#E5484D', '#2563EB', '#16A34A', '#111827']

export default function SavedPostCollectionEditor({
  open,
  collection,
  submitting,
  error,
  onClose,
  onSubmit,
}) {
  const { t } = useDisplayTranslation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverColor, setCoverColor] = useState('#6D4AFF')

  useEffect(() => {
    if (!open) return

    setName(collection?.name || '')
    setDescription(collection?.description || '')
    setCoverColor(collection?.cover_color || '#6D4AFF')
  }, [collection, open])

  if (!open) return null

  const editing = Boolean(collection)

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      cover_color: coverColor,
    })
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center">
      <button
        type="button"
        onClick={submitting ? undefined : onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label="Close collection editor"
      />

      <section className="relative z-10 w-full max-w-[560px] rounded-t-[28px] bg-white px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-[#171923]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d9dce4] dark:bg-white/15" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827] dark:text-white">
              {editing ? t('savedPostCollectionEditor.editCollection') : t('savedPostCollectionEditor.newCollection')}
            </h2>
            <p className="mt-1 text-[12px] leading-5 text-[#8d94a1] dark:text-white/45">
              {t('savedPostCollectionEditor.intro')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 disabled:opacity-50 dark:bg-white/10 dark:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block">
            <span className="text-[11.5px] font-extrabold text-[#4b5563] dark:text-white/65">{t('savedPostCollectionEditor.collectionName')}</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, 80))}
              disabled={submitting}
              placeholder={t('savedPostCollectionEditor.namePlaceholder')}
              className="mt-2 h-12 w-full rounded-[16px] bg-[#f8f8fb] px-4 text-[13.5px] font-semibold text-[#111827] outline-none ring-1 ring-transparent transition placeholder:text-[#a5aab4] focus:ring-[#6d4aff]/35 disabled:opacity-60 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
              autoFocus
            />
          </label>

          <label className="mt-4 block">
            <span className="text-[11.5px] font-extrabold text-[#4b5563] dark:text-white/65">{t('savedPostCollectionEditor.description')}</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value.slice(0, 300))}
              disabled={submitting}
              placeholder={t('savedPostCollectionEditor.descriptionPlaceholder')}
              rows={3}
              className="mt-2 w-full resize-none rounded-[16px] bg-[#f8f8fb] px-4 py-3 text-[13px] leading-6 text-[#111827] outline-none ring-1 ring-transparent transition placeholder:text-[#a5aab4] focus:ring-[#6d4aff]/35 disabled:opacity-60 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
            />
          </label>

          <div className="mt-4">
            <div className="text-[11.5px] font-extrabold text-[#4b5563] dark:text-white/65">{t('savedPostCollectionEditor.collectionColor')}</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {COLORS.map((color) => {
                const selected = coverColor === color

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCoverColor(color)}
                    disabled={submitting}
                    className={`h-9 w-9 rounded-full border-[3px] transition active:scale-95 disabled:opacity-60 ${
                      selected
                        ? 'border-white shadow-[0_0_0_2px_#6d4aff] dark:border-[#171923]'
                        : 'border-white shadow-sm ring-1 ring-black/10 dark:border-[#171923] dark:ring-white/10'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Choose ${color}`}
                  />
                )
              })}
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-[14px] bg-[#fff1f1] px-3.5 py-3 text-[12px] font-semibold text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="mt-5 h-12 w-full rounded-[16px] bg-[#6d4aff] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? t('savedPostCollectionEditor.saving')
              : editing
                ? t('savedPostCollectionEditor.saveCollection')
                : t('savedPostCollectionEditor.createCollection')}
          </button>
        </form>
      </section>
    </div>
  )
}

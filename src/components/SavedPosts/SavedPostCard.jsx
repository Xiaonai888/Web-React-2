import { Bookmark, Image as ImageIcon, MoreHorizontal } from 'lucide-react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('savedPostCard', {
  "en": {
    "reader": "Reader",
    "author": "Author",
    "promoted": "Promoted",
    "savedPost": "Saved Post",
    "savedAt": "Saved {{date}}",
    "savedPostLower": "Saved post",
    "previewUnavailable": "Preview is not available for this saved post.",
    "originalUnavailable": "{t('savedPostCard.originalUnavailable')}"
  },
  "km": {
    "reader": "អ្នកអាន",
    "author": "អ្នកនិពន្ធ",
    "promoted": "បានផ្សព្វផ្សាយ",
    "savedPost": "ប្រកាសដែលបានរក្សាទុក",
    "savedAt": "បានរក្សាទុក {{date}}",
    "savedPostLower": "ប្រកាសដែលបានរក្សាទុក",
    "previewUnavailable": "មិនមានការមើលជាមុនសម្រាប់ប្រកាសដែលបានរក្សាទុកនេះទេ។",
    "originalUnavailable": "ប្រកាសដើមមិនអាចមើលបានទេ ប៉ុន្តែការមើលជាមុនដែលអ្នកបានរក្សាទុកនៅតែមាន។"
  },
  "zh": {
    "reader": "读者",
    "author": "作者",
    "promoted": "推广",
    "savedPost": "已保存帖子",
    "savedAt": "保存于 {{date}}",
    "savedPostLower": "已保存帖子",
    "previewUnavailable": "此已保存帖子暂无预览。",
    "originalUnavailable": "原帖已不可用，但你保存的预览仍然保留。"
  },
  "ja": {
    "reader": "読者",
    "author": "作者",
    "promoted": "プロモーション",
    "savedPost": "保存済み投稿",
    "savedAt": "{{date}}に保存",
    "savedPostLower": "保存済み投稿",
    "previewUnavailable": "この保存済み投稿のプレビューは利用できません。",
    "originalUnavailable": "元の投稿は利用できませんが、保存したプレビューは残っています。"
  },
  "ko": {
    "reader": "독자",
    "author": "작가",
    "promoted": "프로모션",
    "savedPost": "저장한 게시물",
    "savedAt": "{{date}}에 저장",
    "savedPostLower": "저장한 게시물",
    "previewUnavailable": "이 저장 게시물의 미리보기를 사용할 수 없습니다.",
    "originalUnavailable": "원본 게시물을 사용할 수 없지만 저장한 미리보기는 남아 있습니다."
  }
})


const SOURCE_META = {
  reader_post: {
    labelKey: 'reader',
    className: 'bg-[#f3f0ff] text-[#6d4aff] dark:bg-[#6d4aff]/15 dark:text-[#b9a8ff]',
  },
  author_post: {
    labelKey: 'author',
    className: 'bg-[#ede9fe] text-[#5b21b6] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]',
  },
  promotion: {
    labelKey: 'promoted',
    className: 'bg-[#fff7d8] text-[#b77900] dark:bg-[#f6b800]/15 dark:text-[#ffd65a]',
  },
}

function normalizeImages(snapshot) {
  const possible = [
    snapshot.image_urls,
    snapshot.images,
    snapshot.media_urls,
    snapshot.photos,
  ]

  for (const value of possible) {
    if (Array.isArray(value)) {
      const images = value
        .map((item) => (typeof item === 'string' ? item : item?.url || item?.image_url || ''))
        .filter(Boolean)

      if (images.length) return images.slice(0, 4)
    }
  }

  return [
    snapshot.image_url,
    snapshot.cover_url,
    snapshot.thumbnail_url,
    snapshot.banner_url,
  ].filter(Boolean).slice(0, 1)
}

function getSnapshotText(snapshot, keys, fallback = '') {
  for (const key of keys) {
    const value = snapshot?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  return fallback
}

function formatSavedTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(getDisplayLanguageId() || 'en', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })
}

function PreviewGrid({ images, title }) {
  if (!images.length) return null

  if (images.length === 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-[18px] bg-[#f3f3f6] dark:bg-white/5">
        <img
          src={images[0]}
          alt={title || 'Saved post preview'}
          className="max-h-[360px] w-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-[18px]">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="aspect-[4/3] bg-[#f3f3f6] dark:bg-white/5">
          <img
            src={image}
            alt={`${title || 'Saved post'} ${index + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}

export default function SavedPostCard({ item, onOpen, onMenu }) {
  const { t } = useDisplayTranslation()
  const snapshot = item?.snapshot_data || {}
  const sourceMeta = SOURCE_META[item?.source_type] || SOURCE_META.reader_post
  const title = getSnapshotText(snapshot, [
    'title',
    'post_title',
    'headline',
    'page_name',
    'author_name',
  ], t('savedPostCard.savedPost'))
  const authorName = getSnapshotText(snapshot, [
    'author_name',
    'page_name',
    'reader_name',
    'user_name',
    'name',
  ], 'Shadow')
  const avatarUrl = getSnapshotText(snapshot, [
    'avatar_url',
    'author_avatar_url',
    'page_avatar_url',
    'profile_image_url',
  ])
  const content = getSnapshotText(snapshot, [
    'content',
    'description',
    'caption',
    'text',
    'message',
  ])
  const images = normalizeImages(snapshot)
  const unavailable = item?.status === 'unavailable'
  const savedTime = formatSavedTime(item?.saved_at)
  const avatarLetter = authorName.charAt(0).toUpperCase() || 'S'

  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left active:scale-[0.995]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f0ff] text-[15px] font-extrabold text-[#6d4aff] dark:bg-white/10 dark:text-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt={authorName} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="line-clamp-1 text-[14px] font-extrabold text-[#111827] dark:text-white">
                  {authorName}
                </h2>
                <span className={`rounded-full px-2 py-1 text-[9.5px] font-extrabold ${sourceMeta.className}`}>
                  {t(`savedPostCard.${sourceMeta.labelKey}`)}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-[10.5px] font-medium text-[#9aa1ad] dark:text-white/35">
                <span>{savedTime ? t('savedPostCard.savedAt', { date: savedTime }) : t('savedPostCard.savedPostLower')}</span>
                {item?.collections?.length ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-current" />
                    <span className="line-clamp-1">{item.collections.map((collection) => collection.name).join(', ')}</span>
                  </>
                ) : null}
              </div>
            </div>
          </button>

          <div className="flex shrink-0 items-center gap-1">
            <Bookmark className="h-[18px] w-[18px] fill-[#f6b800] text-[#f6b800]" strokeWidth={1.8} />
            <button
              type="button"
              onClick={() => onMenu(item)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] active:scale-95 dark:text-white/60"
              aria-label="Saved post options"
            >
              <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-3 block w-full text-left active:scale-[0.995]"
        >
          {title && title !== authorName ? (
            <h3 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-[#111827] dark:text-white">
              {title}
            </h3>
          ) : null}

          {content ? (
            <p className="mt-1.5 line-clamp-4 whitespace-pre-line text-[13px] leading-6 text-[#4b5563] dark:text-white/70">
              {content}
            </p>
          ) : null}

          {!content && !images.length ? (
            <div className="mt-3 flex items-center gap-2 rounded-[16px] bg-[#f8f8fb] px-3.5 py-3 text-[12px] text-[#8d94a1] dark:bg-white/5 dark:text-white/45">
              <ImageIcon className="h-4 w-4" strokeWidth={1.7} />
              <span>{t('savedPostCard.previewUnavailable')}</span>
            </div>
          ) : null}

          <PreviewGrid images={images} title={title} />
        </button>

        {unavailable ? (
          <div className="mt-3 rounded-[14px] bg-[#fff1f1] px-3.5 py-2.5 text-[11.5px] font-semibold text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]">
            {t('savedPostCard.originalUnavailable')}
          </div>
        ) : null}
      </div>
    </article>
  )
}

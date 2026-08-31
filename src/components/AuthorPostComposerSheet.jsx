import { useEffect, useRef, useState } from 'react'
import ImageDropZone from './common/ImageDropZone'
import AuthorHashtagSuggestions from './author-posts/AuthorHashtagSuggestions'
import AuthorHashtagSuggestions from './author-posts/AuthorHashtagSuggestions'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
registerTranslationNamespace('authorPostComposerSheet', {
  en: {
    author: 'Author',
    failedLoadImage: 'Failed to load image',
    photoStillTooLarge: 'Photo is still too large after compression. Selected: {{selected}} / Limit: {{limit}}.',
    loginFirst: 'Please login first',
    missingEnv: ' Missing: {{value}}',
    failedUploadPhoto: 'Failed to upload photo',
    removePhoto: 'Remove photo',
    closeLeaveOptions: 'Close leave post options',
    leavePost: 'Leave this post?',
    saveForLater: 'Save for later',
    discardChanges: 'Discard changes',
    discard: 'Discard',
    continueEditing: 'Continue editing',
    continueWriting: 'Continue writing',
    draftSaved: 'Draft saved for later.',
    maxPhotos: 'You can add up to {{count}} photos per post.',
    preparingPhotos: 'Preparing photos...',
    photosTooLarge: 'Photos are too large. Selected: {{selected}} / Limit: {{limit}}. You can add up to {{count}} photos per post.',
    couldNotPreparePhotos: 'Could not prepare these photos. Please choose different images.',
    uploadMissingUrl: 'Upload completed without an image URL',
    failedUpdatePost: 'Failed to update post',
    failedPublishPost: 'Failed to publish post',
    imageFilesOnly: 'Only image files can be dropped here.',
    dropPhotos: 'Drop photos here',
    closeComposer: 'Close composer',
    editPagePost: 'Edit Page Post',
    newPagePost: 'New Page Post',
    next: 'Next',
    public: 'Public',
    shareUpdate: 'Share an update...',
    openGallery: 'Open Gallery',
    gallery: 'Gallery',
    backToComposer: 'Back to composer',
    reviewChanges: 'Review Changes',
    reviewPost: 'Review Post',
    saving: 'Saving',
    publishing: 'Publishing',
    save: 'Save',
    publish: 'Publish',
    whoCanSee: 'Who can see this',
    readerComments: 'Reader comments',
    everyone: 'Everyone',
    publishTime: 'Publish time',
    now: 'Now',
    storySharing: 'Story sharing',
    off: 'Off',
  },
  km: {
    author: 'អ្នកនិពន្ធ',
    failedLoadImage: 'មិនអាចផ្ទុករូបភាពបានទេ',
    photoStillTooLarge: 'រូបភាពនៅតែធំពេកក្រោយបង្រួម។ បានជ្រើស: {{selected}} / កំណត់: {{limit}}។',
    loginFirst: 'សូមចូលគណនីជាមុន',
    missingEnv: ' ខ្វះ: {{value}}',
    failedUploadPhoto: 'មិនអាចផ្ទុករូបភាពឡើងបានទេ',
    removePhoto: 'ដករូបភាពចេញ',
    closeLeaveOptions: 'បិទជម្រើសចាកចេញពីប្រកាស',
    leavePost: 'ចាកចេញពីប្រកាសនេះ?',
    saveForLater: 'រក្សាទុកសម្រាប់ពេលក្រោយ',
    discardChanges: 'បោះបង់ការកែប្រែ',
    discard: 'បោះបង់',
    continueEditing: 'បន្តកែប្រែ',
    continueWriting: 'បន្តសរសេរ',
    draftSaved: 'បានរក្សាទុកសេចក្តីព្រាងសម្រាប់ពេលក្រោយ។',
    maxPhotos: 'អ្នកអាចបន្ថែមរូបបានរហូតដល់ {{count}} រូបក្នុងមួយប្រកាស។',
    preparingPhotos: 'កំពុងរៀបចំរូបភាព...',
    photosTooLarge: 'រូបភាពធំពេក។ បានជ្រើស: {{selected}} / កំណត់: {{limit}}។ អ្នកអាចបន្ថែមរូបបានរហូតដល់ {{count}} រូបក្នុងមួយប្រកាស។',
    couldNotPreparePhotos: 'មិនអាចរៀបចំរូបទាំងនេះបានទេ។ សូមជ្រើសរូបផ្សេង។',
    uploadMissingUrl: 'បានផ្ទុកឡើងរួច ប៉ុន្តែមិនទទួលបាន URL រូបភាព',
    failedUpdatePost: 'មិនអាចកែប្រែប្រកាសបានទេ',
    failedPublishPost: 'មិនអាចបោះពុម្ពប្រកាសបានទេ',
    imageFilesOnly: 'អាចទម្លាក់បានតែឯកសាររូបភាពប៉ុណ្ណោះ។',
    dropPhotos: 'ទម្លាក់រូបភាពនៅទីនេះ',
    closeComposer: 'បិទការសរសេរប្រកាស',
    editPagePost: 'កែប្រកាសទំព័រ',
    newPagePost: 'ប្រកាសទំព័រថ្មី',
    next: 'បន្ទាប់',
    public: 'សាធារណៈ',
    shareUpdate: 'ចែករំលែកអ្វីថ្មី...',
    openGallery: 'បើកវិចិត្រសាល',
    gallery: 'វិចិត្រសាល',
    backToComposer: 'ត្រឡប់ទៅការសរសេរ',
    reviewChanges: 'ពិនិត្យការកែប្រែ',
    reviewPost: 'ពិនិត្យប្រកាស',
    saving: 'កំពុងរក្សាទុក',
    publishing: 'កំពុងបោះពុម្ព',
    save: 'រក្សាទុក',
    publish: 'បោះពុម្ព',
    whoCanSee: 'អ្នកណាអាចមើលបាន',
    readerComments: 'មតិអ្នកអាន',
    everyone: 'គ្រប់គ្នា',
    publishTime: 'ពេលបោះពុម្ព',
    now: 'ឥឡូវនេះ',
    storySharing: 'ការចែករំលែករឿង',
    off: 'បិទ',
  },
  zh: {
    author: '作者',
    failedLoadImage: '无法加载图片',
    photoStillTooLarge: '压缩后图片仍然过大。已选择：{{selected}} / 限制：{{limit}}。',
    loginFirst: '请先登录',
    missingEnv: ' 缺少：{{value}}',
    failedUploadPhoto: '图片上传失败',
    removePhoto: '移除图片',
    closeLeaveOptions: '关闭离开帖子选项',
    leavePost: '离开这个帖子？',
    saveForLater: '稍后保存',
    discardChanges: '放弃更改',
    discard: '放弃',
    continueEditing: '继续编辑',
    continueWriting: '继续撰写',
    draftSaved: '草稿已保存，稍后可继续。',
    maxPhotos: '每个帖子最多可添加 {{count}} 张图片。',
    preparingPhotos: '正在处理图片...',
    photosTooLarge: '图片过大。已选择：{{selected}} / 限制：{{limit}}。每个帖子最多可添加 {{count}} 张图片。',
    couldNotPreparePhotos: '无法处理这些图片，请选择其他图片。',
    uploadMissingUrl: '上传完成，但未返回图片 URL',
    failedUpdatePost: '帖子更新失败',
    failedPublishPost: '帖子发布失败',
    imageFilesOnly: '这里只能拖放图片文件。',
    dropPhotos: '将图片拖放到这里',
    closeComposer: '关闭帖子编辑器',
    editPagePost: '编辑主页帖子',
    newPagePost: '新建主页帖子',
    next: '下一步',
    public: '公开',
    shareUpdate: '分享最新动态...',
    openGallery: '打开相册',
    gallery: '相册',
    backToComposer: '返回编辑',
    reviewChanges: '检查更改',
    reviewPost: '检查帖子',
    saving: '正在保存',
    publishing: '正在发布',
    save: '保存',
    publish: '发布',
    whoCanSee: '谁可以看到',
    readerComments: '读者评论',
    everyone: '所有人',
    publishTime: '发布时间',
    now: '现在',
    storySharing: '故事分享',
    off: '关闭',
  },
  ja: {
    author: '作者',
    failedLoadImage: '画像を読み込めませんでした',
    photoStillTooLarge: '圧縮後も画像サイズが大きすぎます。選択済み: {{selected}} / 上限: {{limit}}。',
    loginFirst: '先にログインしてください',
    missingEnv: ' 不足: {{value}}',
    failedUploadPhoto: '画像をアップロードできませんでした',
    removePhoto: '画像を削除',
    closeLeaveOptions: '投稿を離れるオプションを閉じる',
    leavePost: 'この投稿から離れますか？',
    saveForLater: '後で使うために保存',
    discardChanges: '変更を破棄',
    discard: '破棄',
    continueEditing: '編集を続ける',
    continueWriting: '執筆を続ける',
    draftSaved: '下書きを後で使うために保存しました。',
    maxPhotos: '1件の投稿に最大 {{count}} 枚の画像を追加できます。',
    preparingPhotos: '画像を準備しています...',
    photosTooLarge: '画像サイズが大きすぎます。選択済み: {{selected}} / 上限: {{limit}}。1件の投稿に最大 {{count}} 枚追加できます。',
    couldNotPreparePhotos: '画像を準備できませんでした。別の画像を選択してください。',
    uploadMissingUrl: 'アップロードは完了しましたが、画像 URL がありません',
    failedUpdatePost: '投稿を更新できませんでした',
    failedPublishPost: '投稿を公開できませんでした',
    imageFilesOnly: '画像ファイルのみドロップできます。',
    dropPhotos: 'ここに画像をドロップ',
    closeComposer: '投稿作成画面を閉じる',
    editPagePost: 'ページ投稿を編集',
    newPagePost: '新しいページ投稿',
    next: '次へ',
    public: '公開',
    shareUpdate: '近況をシェア...',
    openGallery: 'ギャラリーを開く',
    gallery: 'ギャラリー',
    backToComposer: '作成画面に戻る',
    reviewChanges: '変更を確認',
    reviewPost: '投稿を確認',
    saving: '保存中',
    publishing: '公開中',
    save: '保存',
    publish: '公開',
    whoCanSee: '公開範囲',
    readerComments: '読者コメント',
    everyone: '全員',
    publishTime: '公開時間',
    now: '今',
    storySharing: 'ストーリー共有',
    off: 'オフ',
  },
  ko: {
    author: '작가',
    failedLoadImage: '이미지를 불러오지 못했습니다',
    photoStillTooLarge: '압축 후에도 이미지가 너무 큽니다. 선택됨: {{selected}} / 제한: {{limit}}.',
    loginFirst: '먼저 로그인해 주세요',
    missingEnv: ' 누락: {{value}}',
    failedUploadPhoto: '이미지를 업로드하지 못했습니다',
    removePhoto: '이미지 삭제',
    closeLeaveOptions: '게시물 나가기 옵션 닫기',
    leavePost: '이 게시물에서 나가시겠어요?',
    saveForLater: '나중을 위해 저장',
    discardChanges: '변경사항 버리기',
    discard: '버리기',
    continueEditing: '계속 편집',
    continueWriting: '계속 작성',
    draftSaved: '초안을 나중을 위해 저장했습니다.',
    maxPhotos: '게시물당 최대 {{count}}장의 이미지를 추가할 수 있습니다.',
    preparingPhotos: '이미지를 준비하는 중...',
    photosTooLarge: '이미지가 너무 큽니다. 선택됨: {{selected}} / 제한: {{limit}}. 게시물당 최대 {{count}}장까지 추가할 수 있습니다.',
    couldNotPreparePhotos: '이미지를 준비하지 못했습니다. 다른 이미지를 선택해 주세요.',
    uploadMissingUrl: '업로드는 완료됐지만 이미지 URL이 없습니다',
    failedUpdatePost: '게시물을 업데이트하지 못했습니다',
    failedPublishPost: '게시물을 게시하지 못했습니다',
    imageFilesOnly: '이미지 파일만 드롭할 수 있습니다.',
    dropPhotos: '여기에 이미지를 드롭하세요',
    closeComposer: '게시물 작성기 닫기',
    editPagePost: '페이지 게시물 편집',
    newPagePost: '새 페이지 게시물',
    next: '다음',
    public: '전체 공개',
    shareUpdate: '새 소식을 공유하세요...',
    openGallery: '갤러리 열기',
    gallery: '갤러리',
    backToComposer: '작성 화면으로 돌아가기',
    reviewChanges: '변경사항 검토',
    reviewPost: '게시물 검토',
    saving: '저장 중',
    publishing: '게시 중',
    save: '저장',
    publish: '게시',
    whoCanSee: '볼 수 있는 사람',
    readerComments: '독자 댓글',
    everyone: '모두',
    publishTime: '게시 시간',
    now: '지금',
    storySharing: '스토리 공유',
    off: '끔',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const MAX_POST_PHOTOS = 5
const MAX_POST_LENGTH = 10000
const MAX_POST_IMAGE_BYTES = 800 * 1024
const HARD_MAX_IMAGE_BYTES = 220 * 1024
const MAX_IMAGE_WIDTH = 1080
const MAX_IMAGE_HEIGHT = 1350
const TARGET_IMAGE_BYTES = 150 * 1024

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatBytes(bytes) {
  const value = Number(bytes || 0)

  if (!Number.isFinite(value) || value <= 0) return '0KB'
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)}MB`

  return `${Math.max(1, Math.round(value / 1024))}KB`
}

function loadImageFromFile(file, t) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(t('authorPostComposerSheet.failedLoadImage')))
    }

    image.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

async function compressImageFile(file, t) {
  if (!file?.type?.startsWith('image/')) return null

  const image = await loadImageFromFile(file, t)
  let scale = Math.min(1, MAX_IMAGE_WIDTH / image.width, MAX_IMAGE_HEIGHT / image.height)
  let width = Math.max(1, Math.round(image.width * scale))
  let height = Math.max(1, Math.round(image.height * scale))
  let quality = 0.82
  let blob = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, width, height)

    blob = await canvasToBlob(canvas, 'image/webp', quality)

    if (blob && blob.size <= TARGET_IMAGE_BYTES) break
    if (blob && blob.size <= HARD_MAX_IMAGE_BYTES && quality <= 0.68) break

    if (quality > 0.62) {
      quality = Math.max(0.62, quality - 0.07)
    } else {
      width = Math.max(1, Math.round(width * 0.9))
      height = Math.max(1, Math.round(height * 0.9))
    }
  }

  if (!blob) return file

  if (blob.size > HARD_MAX_IMAGE_BYTES) {
    throw new Error(t('authorPostComposerSheet.photoStillTooLarge', { selected: formatBytes(blob.size), limit: formatBytes(HARD_MAX_IMAGE_BYTES) }))
  }

  return new File(
    [blob],
    file.name.replace(/\.[^.]+$/, '.webp'),
    {
      type: 'image/webp',
      lastModified: Date.now(),
    }
  )
}

function getSelectedImageSize(images) {
  return images.reduce((sum, image) => sum + Number(image.file?.size || 0), 0)
}

function revokeImagePreview(image) {
  if (image?.file && String(image.url || '').startsWith('blob:')) {
    URL.revokeObjectURL(image.url)
  }
}

function buildExistingImages(imageUrls) {
  return (Array.isArray(imageUrls) ? imageUrls : [])
    .map((url) => String(url || '').trim())
    .filter(Boolean)
    .slice(0, MAX_POST_PHOTOS)
    .map((url, index) => ({
      id: `existing-${index}-${url}`,
      file: null,
      url,
    }))
}

function getImageUrls(images) {
  return images
    .map((image) => String(image?.url || '').trim())
    .filter(Boolean)
}

function reconcileSelectedHashtags(previousText, nextText, ranges) {
  if (!Array.isArray(ranges) || !ranges.length) return []

  let prefix = 0
  const prefixLimit = Math.min(previousText.length, nextText.length)

  while (
    prefix < prefixLimit &&
    previousText[prefix] === nextText[prefix]
  ) {
    prefix += 1
  }

  let oldSuffix = previousText.length
  let newSuffix = nextText.length

  while (
    oldSuffix > prefix &&
    newSuffix > prefix &&
    previousText[oldSuffix - 1] === nextText[newSuffix - 1]
  ) {
    oldSuffix -= 1
    newSuffix -= 1
  }

  const delta = newSuffix - oldSuffix

  return ranges
    .map((range) => {
      if (range.end <= prefix) {
        return range
      }

      if (range.start >= oldSuffix) {
        return {
          ...range,
          start: range.start + delta,
          end: range.end + delta,
        }
      }

      return null
    })
    .filter(Boolean)
}

function renderComposerDraft(text, ranges) {
  if (!ranges.length) return text

  const validRanges = [...ranges]
    .filter(
      (range) =>
        Number.isInteger(range.start) &&
        Number.isInteger(range.end) &&
        range.start >= 0 &&
        range.end > range.start &&
        range.end <= text.length &&
        text.slice(range.start, range.end) === range.tag
    )
    .sort((a, b) => a.start - b.start)

  if (!validRanges.length) return text

  const parts = []
  let cursor = 0

  validRanges.forEach((range, index) => {
    if (range.start < cursor) return

    if (range.start > cursor) {
      parts.push(
        <span key={`text-${index}-${cursor}`}>
          {text.slice(cursor, range.start)}
        </span>
      )
    }

    parts.push(
      <span
        key={`tag-${range.start}-${range.end}-${range.tag}`}
        className="rounded-[3px] bg-[var(--shadow-bg-soft)]"
      >
        {text.slice(range.start, range.end)}
      </span>
    )

    cursor = range.end
  })

  if (cursor < text.length) {
    parts.push(
      <span key={`text-end-${cursor}`}>
        {text.slice(cursor)}
      </span>
    )
  }

  return parts
}

async function uploadAuthorPostImage(file, t) {
  const token = getAuthToken()

  if (!token) {
    throw new Error(t('authorPostComposerSheet.loginFirst'))
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', 'author_post_image')

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

 if (!response.ok || data.ok === false) {
  const missingEnvText = Array.isArray(data.missing_env) && data.missing_env.length
    ? t('authorPostComposerSheet.missingEnv', { value: data.missing_env.join(', ') })
    : ''

  throw new Error(`${data.message || t('authorPostComposerSheet.failedUploadPhoto')}${missingEnvText}`)
}

  return data.image_url || data.imageUrl
}

function SelectedImagePreview({ images, onRemove, removable = true, t }) {
  if (!images.length) return null

  if (images.length === 1) {
  return (
    <div className="mx-[-16px] mt-4 bg-[var(--shadow-bg-surface)]">
      <div className="relative flex min-h-[260px] items-center justify-center bg-[var(--shadow-bg-surface)]">
        <img src={images[0].url} alt="" className="max-h-[560px] w-full object-contain" />

        {removable ? (
          <button
            type="button"
            onClick={() => onRemove(images[0].id)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white"
            aria-label={t('authorPostComposerSheet.removePhoto')}
          >
            <i className="fa-solid fa-xmark text-[12px]" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
  return (
    <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden rounded-[16px]">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square bg-[var(--shadow-bg-soft)]">
          <img src={image.url} alt="" className="h-full w-full object-cover" />

          {removable ? (
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white"
              aria-label={t('authorPostComposerSheet.removePhoto')}
            >
              <i className="fa-solid fa-xmark text-[11px]" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function LeavePostSheet({
  open,
  editing = false,
  onSave,
  onDiscard,
  onContinue,
  t,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[280]">
      <button
        type="button"
        aria-label={t('authorPostComposerSheet.closeLeaveOptions')}
        onClick={onContinue}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[26px] bg-[var(--shadow-bg-elevated)] px-4 pb-7 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[var(--shadow-border)]" />

        <h3 className="mb-3 text-[15px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPostComposerSheet.leavePost')}</h3>

        <div className="space-y-1">
          {!editing ? (
            <button
              type="button"
              onClick={onSave}
              className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className="fa-regular fa-bookmark text-[15px]" />
              </span>
              <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{t('authorPostComposerSheet.saveForLater')}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDiscard}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-regular fa-trash-can text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{editing ? t('authorPostComposerSheet.discardChanges') : t('authorPostComposerSheet.discard')}</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <i className="fa-solid fa-pen text-[14px]" />
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">{editing ? t('authorPostComposerSheet.continueEditing') : t('authorPostComposerSheet.continueWriting')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewOption({ icon, imageSrc, title, value, onClick }) {
  return (
    <button
  type="button"
  onClick={onClick}
  className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        {imageSrc ? (
          <img src={imageSrc} alt="" className="h-5 w-5 object-contain" />
        ) : (
          <i className={`${icon} text-[15px]`} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[var(--shadow-text-primary)]">{title}</span>
        <span className="mt-0.5 block text-[12px] font-normal text-[var(--shadow-text-tertiary)]">{value}</span>
      </span>

      <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function PublishTimeSheet({
  open,
  mode,
  onClose,
  onNow,
  onSchedule,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[310]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white px-4 pb-7 pt-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-11 rounded-full bg-[#9ca3af]" />

        <h2 className="mb-2 text-center text-[16px] font-bold text-[#111827]">
          Publish time
        </h2>

        {[
          ['now', 'Now', onNow],
          ['schedule', 'Schedule', onSchedule],
        ].map(([value, label, action]) => (
          <button
            key={value}
            type="button"
            onClick={action}
            className="flex w-full items-center px-2 py-4 text-left"
          >
            <span className="flex-1 text-[16px] font-medium text-[#111827]">
              {label}
            </span>

            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                mode === value
                  ? 'border-[#111827]'
                  : 'border-[#6b7280]'
              }`}
            >
              {mode === value ? (
                <span className="h-3 w-3 rounded-full bg-[#111827]" />
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AuthorPostComposerSheet({
  open,
  author,
  saving,
  editingPost = null,
  onClose,
  onPublishText,
  onUpdatePost,
  onMessage,
}) {
  const { t } = useDisplayTranslation()
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)


  const selectedImagesRef = useRef([])
  const initialDraftRef = useRef('')
  const initialImageUrlsRef = useRef([])
  const editorKeyRef = useRef('')
  const [screen, setScreen] = useState('compose')
  const [draft, setDraft] = useState('')
  const [selectedHashtags, setSelectedHashtags] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [imageError, setImageError] = useState('')
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [publishMode, setPublishMode] = useState('now')
  const [publishTimeOpen, setPublishTimeOpen] = useState(false)
  const [schedulePickerOpen, setSchedulePickerOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  useEffect(() => {
  const element = textareaRef.current
  if (!element || screen !== 'compose') return
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight}px`
}, [draft, screen, open])

  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || t('authorPostComposerSheet.author')
  const isEditing = Boolean(editingPost?.id)
  const editorKey = isEditing ? `edit:${editingPost.id}` : 'create'
  const currentImageUrls = getImageUrls(selectedImages)
  const hasContent = Boolean(draft.trim() || selectedImages.length)
  const hasChanges =
    draft !== initialDraftRef.current ||
    currentImageUrls.join('\n') !== initialImageUrlsRef.current.join('\n')
  const canReview = hasContent && !uploading && (!isEditing || hasChanges)
  const canPublish = hasContent && !saving && !uploading && (!isEditing || hasChanges)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setScreen('compose')
      setLeaveSheetOpen(false)
      setImageError('')
      setUploading(false)
      return
    }

    if (editorKeyRef.current === editorKey) return

    selectedImagesRef.current.forEach(revokeImagePreview)

    const initialDraft = isEditing
      ? String(editingPost?.content || '').slice(0, MAX_POST_LENGTH)
      : ''
    const initialImages = isEditing
      ? buildExistingImages(editingPost?.image_urls)
      : []

    setDraft(initialDraft)
    setSelectedHashtags([])
    setSelectedImages(initialImages)
    setScreen('compose')
    setLeaveSheetOpen(false)
    setImageError('')
    setUploading(false)

    initialDraftRef.current = initialDraft
    initialImageUrlsRef.current = getImageUrls(initialImages)
    editorKeyRef.current = editorKey
  }, [editorKey, editingPost, isEditing, open])

  useEffect(() => {
    selectedImagesRef.current = selectedImages
  }, [selectedImages])

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach(revokeImagePreview)
    }
  }, [])

  if (!open) return null

  function clearImages() {
    selectedImages.forEach(revokeImagePreview)
    setSelectedImages([])
  }

  function discardPost() {
    clearImages()
    setDraft('')
    setSelectedHashtags([])
    setImageError('')
    setLeaveSheetOpen(false)
    setScreen('compose')
    setUploading(false)
    initialDraftRef.current = ''
    initialImageUrlsRef.current = []
    editorKeyRef.current = ''
    onClose?.()
  }

  function saveForLater() {
    if (isEditing) return

    setLeaveSheetOpen(false)
    setScreen('compose')
    onClose?.()
    onMessage?.(t('authorPostComposerSheet.draftSaved'))
  }

  function requestClose() {
    if (hasChanges) {
      setLeaveSheetOpen(true)
      return
    }

    if (isEditing) {
      editorKeyRef.current = ''
    }

    onClose?.()
  }

  function updateDraft(nextValue) {
    const nextDraft = String(nextValue || '').slice(
      0,
      MAX_POST_LENGTH
    )

    setSelectedHashtags((current) =>
      reconcileSelectedHashtags(
        draft,
        nextDraft,
        current
      )
    )
    setDraft(nextDraft)
  }

  function markSelectedHashtag(range) {
    if (
      !range?.tag ||
      !Number.isInteger(range.start) ||
      !Number.isInteger(range.end)
    ) {
      return
    }

    setSelectedHashtags((current) => [
      ...current.filter(
        (item) =>
          item.end <= range.start ||
          item.start >= range.end
      ),
      {
        tag: range.tag,
        start: range.start,
        end: range.end,
      },
    ])
  }

  async function handlePickImages(fileList) {
    const files = Array.from(fileList || [])
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

    if (!imageFiles.length) return

    if (selectedImages.length + imageFiles.length > MAX_POST_PHOTOS) {
      setImageError(t('authorPostComposerSheet.maxPhotos', { count: MAX_POST_PHOTOS }))
      return
    }

    try {
      setImageError(t('authorPostComposerSheet.preparingPhotos'))

      const compressedFiles = await Promise.all(imageFiles.map((file) => compressImageFile(file, t)))

      const nextImages = compressedFiles
        .filter(Boolean)
        .map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          url: URL.createObjectURL(file),
        }))

      const nextSelectedImages = [...selectedImages, ...nextImages]
      const totalSize = getSelectedImageSize(nextSelectedImages)

      if (totalSize > MAX_POST_IMAGE_BYTES) {
        nextImages.forEach((image) => URL.revokeObjectURL(image.url))
        setImageError(t('authorPostComposerSheet.photosTooLarge', { selected: formatBytes(totalSize), limit: formatBytes(MAX_POST_IMAGE_BYTES), count: MAX_POST_PHOTOS }))
        return
      }

      setSelectedImages(nextSelectedImages)
      setImageError('')
    } catch (error) {
      setImageError(error.message || t('authorPostComposerSheet.couldNotPreparePhotos'))
    }
  }

  function removeImage(imageId) {
    setSelectedImages((current) => {
      const imageToRemove = current.find((image) => image.id === imageId)

      if (imageToRemove) URL.revokeObjectURL(imageToRemove.url)

      return current.filter((image) => image.id !== imageId)
    })
    setImageError('')
  }

  async function publishPost() {
    if (!canPublish) return

    try {
      setUploading(true)
      setImageError('')

      const imageUrls = []

      for (const image of selectedImages) {
        const imageUrl = image.file
          ? await uploadAuthorPostImage(image.file, t)
          : String(image.url || '').trim()

        if (!imageUrl) {
          throw new Error(t('authorPostComposerSheet.uploadMissingUrl'))
        }

        imageUrls.push(imageUrl)
      }

      const ok = isEditing
        ? await onUpdatePost?.(
            editingPost.id,
            draft.trim(),
            imageUrls
          )
        : await onPublishText?.(
    draft.trim(),
    imageUrls,
    publishMode === 'schedule'
      ? {
          status: 'scheduled',
          scheduled_at: new Date(
            `${scheduleDate}T${scheduleTime}:00`
          ).toISOString(),
        }
      : {
          status: 'active',
        }
  )

      if (ok) {
        clearImages()
        setDraft('')
        setSelectedHashtags([])
        setImageError('')
        setScreen('compose')
        initialDraftRef.current = ''
        initialImageUrlsRef.current = []
        editorKeyRef.current = ''
        onClose?.()
      }
    } catch (error) {
      const message = error.message || (isEditing ? t('authorPostComposerSheet.failedUpdatePost') : t('authorPostComposerSheet.failedPublishPost'))
      setImageError(message)
      onMessage?.(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[240] overflow-y-auto bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            handlePickImages(event.target.files)
            event.target.value = ''
          }}
        />

        <ImageDropZone
          onFiles={handlePickImages}
          onRejectedFiles={() => setImageError(t('authorPostComposerSheet.imageFilesOnly'))}
          disabled={screen !== 'compose' || uploading || selectedImages.length >= MAX_POST_PHOTOS}
          multiple
          accept="image/*"
          className="min-h-screen"
          label={t('authorPostComposerSheet.dropPhotos')}
        >
        {screen === 'compose' ? (
          <>
            <header className="sticky top-0 z-10 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)]">
              <div className="flex h-14 items-center justify-between px-4">
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
                  aria-label={t('authorPostComposerSheet.closeComposer')}
                >
                  <i className="fa-solid fa-xmark text-[22px]" />
                </button>

                <div className="line-clamp-1 px-2 text-center text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                  {isEditing ? t('authorPostComposerSheet.editPagePost') : t('authorPostComposerSheet.newPagePost')}
                </div>

                <button
                  type="button"
                  disabled={!canReview}
                  onClick={() => setScreen('review')}
                  className="h-9 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[13px] font-semibold text-[var(--shadow-bg-page)] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-tertiary)]"
                >
                  {t('authorPostComposerSheet.next')}
                </button>
              </div>
            </header>

            <main className="flex min-h-[calc(100vh-56px)] flex-col bg-[var(--shadow-bg-page)]">
              <div className="flex-1 px-4 pt-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user text-[16px] text-[var(--shadow-text-tertiary)]" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-semibold text-[var(--shadow-text-primary)]">{pageName}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                      <i className="fa-solid fa-earth-asia text-[10px]" />
                      {t('authorPostComposerSheet.public')}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  {selectedHashtags.length ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-0 min-h-[calc(100dvh-270px)] whitespace-pre-wrap break-words text-[16px] font-normal leading-6 text-[var(--shadow-text-primary)]"
                    >
                      {renderComposerDraft(
                        draft,
                        selectedHashtags
                      )}
                    </div>
                  ) : null}

                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(event) =>
                      updateDraft(event.target.value)
                    }
                    placeholder={t('authorPostComposerSheet.shareUpdate')}
                    maxLength={MAX_POST_LENGTH}
                    className={`relative z-10 min-h-[calc(100dvh-270px)] w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-[16px] font-normal leading-6 outline-none placeholder:text-[var(--shadow-placeholder)] ${
                      selectedHashtags.length
                        ? 'text-transparent caret-[var(--shadow-text-primary)]'
                        : 'text-[var(--shadow-text-primary)]'
                    }`}
                  />
                </div>

                <AuthorHashtagSuggestions
                  textareaRef={textareaRef}
                  draft={draft}
                  onDraftChange={updateDraft}
                  onHashtagSelected={markSelectedHashtag}
                  maxLength={MAX_POST_LENGTH}
                />

                <SelectedImagePreview images={selectedImages} onRemove={removeImage} t={t} />

                {imageError ? (
                  <div className="mt-3 rounded-[12px] bg-[#fff7ed] px-3 py-2 text-[12px] font-normal leading-5 text-[#9a3412] dark:bg-orange-400/10 dark:text-orange-300">
                    {imageError}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4">
  <div
    className={`mb-3 text-right text-[11px] font-normal ${
      draft.length >= MAX_POST_LENGTH
        ? 'text-[#dc2626]'
        : draft.length >= MAX_POST_LENGTH - 500
          ? 'text-[#d97706]'
          : 'text-[#9ca3af]'
    }`}
  >
    {draft.length.toLocaleString()} / {MAX_POST_LENGTH.toLocaleString()}
  </div>

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="flex h-[82px] w-[112px] flex-col items-center justify-center gap-2 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:scale-[0.98]"
    aria-label={t('authorPostComposerSheet.openGallery')}
  >
    <svg
      className="h-[27px] w-[27px]"
      viewBox="0 0 22 26"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="16"
        height="20"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="7.5" cy="8.8" r="1.45" fill="currentColor" />
      <path
        d="M5 18.8l4-4.3 3 3.2 2.2-2.4 3 3.5H5z"
        fill="currentColor"
      />
    </svg>

    <span className="text-[14px] font-normal">{t('authorPostComposerSheet.gallery')}</span>
  </button>
</div>
            </main>
          </>
        ) : (
          <>
            <header className="sticky top-0 z-10 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)]">
              <div className="flex h-14 items-center justify-between px-4">
                <button
                  type="button"
                  onClick={() => setScreen('compose')}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
                  aria-label={t('authorPostComposerSheet.backToComposer')}
                >
                  <i className="fa-solid fa-chevron-left text-[18px]" />
                </button>

                <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                  {isEditing ? t('authorPostComposerSheet.reviewChanges') : t('authorPostComposerSheet.reviewPost')}
                </div>

                <button
                  type="button"
                  disabled={!canPublish}
                  onClick={publishPost}
                  className="h-9 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[13px] font-semibold text-[var(--shadow-bg-page)] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-tertiary)]"
                >
                  {uploading || saving
                    ? isEditing
                      ? t('authorPostComposerSheet.saving')
                      : t('authorPostComposerSheet.publishing')
                    : isEditing
                      ? t('authorPostComposerSheet.save')
                      : t('authorPostComposerSheet.publish')}
                </button>
              </div>
            </header>

            <main className="px-4 py-4">

              {imageError ? (
                <div className="mb-4 rounded-[14px] bg-[#fff7ed] px-3 py-2 text-[12px] font-normal leading-5 text-[#9a3412] dark:bg-orange-400/10 dark:text-orange-300">
                  {imageError}
                </div>
              ) : null}

              <div className="space-y-1">
                <ReviewOption icon="fa-solid fa-earth-asia" title={t('authorPostComposerSheet.whoCanSee')} value={t('authorPostComposerSheet.public')} />
                <ReviewOption icon="fa-regular fa-comment" title={t('authorPostComposerSheet.readerComments')} value={t('authorPostComposerSheet.everyone')} />
                <ReviewOption
  icon="fa-regular fa-clock"
  title={t('authorPostComposerSheet.publishTime')}
  value={
    publishMode === 'schedule'
      ? `${scheduleDate} · ${scheduleTime}`
      : t('authorPostComposerSheet.now')
  }
  onClick={
    isEditing
      ? undefined
      : () => setPublishTimeOpen(true)
  }
/>
                <ReviewOption imageSrc="/assets/Icons/Add Story.svg" title={t('authorPostComposerSheet.storySharing')} value={t('authorPostComposerSheet.off')} />
              </div>
            </main>
          </>
                )}
        </ImageDropZone>
      </div>

      <LeavePostSheet
        open={leaveSheetOpen}
        editing={isEditing}
        onSave={saveForLater}
        onDiscard={discardPost}
        onContinue={() => setLeaveSheetOpen(false)}
        t={t}
      />
      <PublishTimeSheet
  open={publishTimeOpen}
  mode={publishMode}
  onClose={() => setPublishTimeOpen(false)}
  onNow={() => {
    setPublishMode('now')
    setScheduleDate('')
    setScheduleTime('')
    setPublishTimeOpen(false)
  }}
  onSchedule={() => {
    setPublishTimeOpen(false)
    setSchedulePickerOpen(true)
  }}
/>

<AuthorPostSchedulePicker
  open={schedulePickerOpen}
  date={scheduleDate}
  time={scheduleTime}
  onClose={() => setSchedulePickerOpen(false)}
  onSave={(date, time) => {
    setScheduleDate(date)
    setScheduleTime(time)
    setPublishMode('schedule')
    setSchedulePickerOpen(false)
  }}
/>
    </>
  )
}

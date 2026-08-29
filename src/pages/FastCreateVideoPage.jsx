import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFastThumbnailUpload from '../hooks/useFastThumbnailUpload'
import useFastVideoCreate from '../hooks/useFastVideoCreate'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Gem,
  ImagePlus,
  Link2,
  LockKeyhole,
  Play,
  Save,
  Send,
  Tag,
  UploadCloud,
  X,
} from 'lucide-react'

registerTranslationNamespace('fastCreateVideoPage', {
  en: {
    thumbnailFormatError: 'Thumbnail must be JPG, PNG, or WEBP.',
    thumbnailSizeError: 'Thumbnail must be 5 MB or smaller.',
    requiredVideoTitle: 'Video link and title are required.',
    thumbnailRequired: 'Add a thumbnail or use a valid YouTube link.',
    unlockMinError: 'Unlock price must be at least 1 Diamond.',
    publishSuccess: 'Video published successfully.',
    draftSuccess: 'Draft saved successfully.',
    saveFailed: 'Failed to save video.',
    backToStudio: 'Back to Fast Studio',
    createVideo: 'Create video',
    createSubtitle: 'Add a linked video to Fast',
    viewFast: 'View Fast',
    videoLink: 'Video link',
    videoLinkPlaceholder: 'Paste YouTube or external video URL',
    videoTitle: 'Video title',
    videoTitlePlaceholder: 'Enter video title',
    description: 'Description',
    descriptionPlaceholder: 'Write a short description',
    thumbnail: 'Thumbnail',
    uploadThumbnail: 'Upload thumbnail',
    thumbnailHelp: 'JPG, PNG or WEBP · Maximum 5 MB · Recommended 16:9',
    removeThumbnail: 'Remove thumbnail',
    youtubeThumbnailAuto: 'A YouTube thumbnail is used automatically until you upload your own.',
    tags: 'Tags',
    removeTag: 'Remove {{tag}}',
    addAnotherTag: 'Add another tag',
    tagPlaceholder: 'Type a tag and press Enter',
    tagsHelp: 'Up to 10 tags. Press Enter or comma to add.',
    access: 'Access',
    free: 'Free',
    anyoneWatch: 'Anyone can watch.',
    paidUnlock: 'Paid unlock',
    unlockWithDiamonds: 'Unlock with Diamonds.',
    unlockPrice: 'Unlock price',
    diamonds: 'Diamonds',
    saving: 'Saving...',
    saveDraft: 'Save draft',
    uploading: 'Uploading...',
    publishing: t('fastCreateVideoPage.publishing'),
    publish: 'Publish',
    previewInFast: 'Preview in Fast',
    previewHelp: 'How your video will appear.',
    previewAlt: 'Video thumbnail preview',
    linkVideo: 'Link Video',
    previewTitle: 'Your video title',
    previewDescription: 'Your video description will appear here.',
    diamondsAmount: '{{count}} Diamonds',
    watch: 'Watch',
    thumbnailStorage: 'Thumbnail storage',
    thumbnailStorageHelp: 'Uploaded thumbnails are stored securely in Cloudflare R2.',
  },
  km: {
    thumbnailFormatError: 'រូប Thumbnail ត្រូវតែជា JPG, PNG ឬ WEBP។',
    thumbnailSizeError: 'រូប Thumbnail ត្រូវមានទំហំ 5 MB ឬតូចជាងនេះ។',
    requiredVideoTitle: 'ត្រូវបញ្ចូល Link វីដេអូ និងចំណងជើង។',
    thumbnailRequired: 'សូមបន្ថែម Thumbnail ឬប្រើ YouTube link ដែលត្រឹមត្រូវ។',
    unlockMinError: 'តម្លៃដោះសោត្រូវយ៉ាងតិច 1 Diamond។',
    publishSuccess: 'បាន Publish វីដេអូដោយជោគជ័យ។',
    draftSuccess: 'បានរក្សាទុក Draft ដោយជោគជ័យ។',
    saveFailed: 'មិនអាចរក្សាទុកវីដេអូបានទេ។',
    backToStudio: 'ត្រឡប់ទៅ Fast Studio',
    createVideo: 'បង្កើតវីដេអូ',
    createSubtitle: 'បន្ថែមវីដេអូដែលមាន Link ទៅ Fast',
    viewFast: 'មើល Fast',
    videoLink: 'Link វីដេអូ',
    videoLinkPlaceholder: 'បិទភ្ជាប់ YouTube ឬ Link វីដេអូខាងក្រៅ',
    videoTitle: 'ចំណងជើងវីដេអូ',
    videoTitlePlaceholder: 'បញ្ចូលចំណងជើងវីដេអូ',
    description: 'ការពិពណ៌នា',
    descriptionPlaceholder: 'សរសេរការពិពណ៌នាខ្លី',
    thumbnail: 'Thumbnail',
    uploadThumbnail: 'Upload Thumbnail',
    thumbnailHelp: 'JPG, PNG ឬ WEBP · អតិបរមា 5 MB · ណែនាំ 16:9',
    removeThumbnail: 'លុប Thumbnail',
    youtubeThumbnailAuto: 'Thumbnail របស់ YouTube នឹងប្រើដោយស្វ័យប្រវត្តិ រហូតដល់អ្នក Upload រូបផ្ទាល់ខ្លួន។',
    tags: 'Tags',
    removeTag: 'លុប {{tag}}',
    addAnotherTag: 'បន្ថែម Tag មួយទៀត',
    tagPlaceholder: 'វាយ Tag ហើយចុច Enter',
    tagsHelp: 'អាចបន្ថែមបានរហូតដល់ 10 Tags។ ចុច Enter ឬ comma ដើម្បីបន្ថែម។',
    access: 'សិទ្ធិមើល',
    free: 'ឥតគិតថ្លៃ',
    anyoneWatch: 'អ្នកគ្រប់គ្នាអាចមើលបាន។',
    paidUnlock: 'បង់ប្រាក់ដើម្បីដោះសោ',
    unlockWithDiamonds: 'ដោះសោដោយ Diamonds។',
    unlockPrice: 'តម្លៃដោះសោ',
    diamonds: 'Diamonds',
    saving: 'កំពុងរក្សាទុក...',
    saveDraft: 'រក្សាទុក Draft',
    uploading: 'កំពុង Upload...',
    publishing: 'កំពុង Publish...',
    publish: 'Publish',
    previewInFast: 'មើលជាមុនក្នុង Fast',
    previewHelp: 'របៀបដែលវីដេអូរបស់អ្នកនឹងបង្ហាញ។',
    previewAlt: 'រូប Thumbnail មើលជាមុន',
    linkVideo: 'Link វីដេអូ',
    previewTitle: 'ចំណងជើងវីដេអូរបស់អ្នក',
    previewDescription: 'ការពិពណ៌នាវីដេអូរបស់អ្នកនឹងបង្ហាញនៅទីនេះ។',
    diamondsAmount: '{{count}} Diamonds',
    watch: 'មើល',
    thumbnailStorage: 'កន្លែងរក្សាទុក Thumbnail',
    thumbnailStorageHelp: 'Thumbnail ដែលបាន Upload ត្រូវបានរក្សាទុកដោយសុវត្ថិភាពក្នុង Cloudflare R2។',
  },
  zh: {
    thumbnailFormatError: '缩略图必须为 JPG、PNG 或 WEBP 格式。',
    thumbnailSizeError: '缩略图大小必须为 5 MB 或更小。',
    requiredVideoTitle: '视频链接和标题为必填项。',
    thumbnailRequired: '请添加缩略图或使用有效的 YouTube 链接。',
    unlockMinError: '解锁价格至少为 1 Diamond。',
    publishSuccess: '视频发布成功。',
    draftSuccess: '草稿保存成功。',
    saveFailed: '无法保存视频。',
    backToStudio: '返回 Fast Studio',
    createVideo: '创建视频',
    createSubtitle: '将链接视频添加到 Fast',
    viewFast: '查看 Fast',
    videoLink: '视频链接',
    videoLinkPlaceholder: '粘贴 YouTube 或外部视频链接',
    videoTitle: '视频标题',
    videoTitlePlaceholder: '输入视频标题',
    description: '描述',
    descriptionPlaceholder: '写一段简短描述',
    thumbnail: '缩略图',
    uploadThumbnail: '上传缩略图',
    thumbnailHelp: 'JPG、PNG 或 WEBP · 最大 5 MB · 推荐 16:9',
    removeThumbnail: '移除缩略图',
    youtubeThumbnailAuto: '在你上传自己的缩略图前，将自动使用 YouTube 缩略图。',
    tags: '标签',
    removeTag: '移除 {{tag}}',
    addAnotherTag: '添加其他标签',
    tagPlaceholder: '输入标签并按 Enter',
    tagsHelp: '最多 10 个标签。按 Enter 或逗号添加。',
    access: '访问权限',
    free: '免费',
    anyoneWatch: '任何人都可以观看。',
    paidUnlock: '付费解锁',
    unlockWithDiamonds: '使用 Diamonds 解锁。',
    unlockPrice: '解锁价格',
    diamonds: 'Diamonds',
    saving: '保存中...',
    saveDraft: '保存草稿',
    uploading: '上传中...',
    publishing: '发布中...',
    publish: '发布',
    previewInFast: '在 Fast 中预览',
    previewHelp: '查看视频显示效果。',
    previewAlt: '视频缩略图预览',
    linkVideo: '链接视频',
    previewTitle: '你的视频标题',
    previewDescription: '你的视频描述会显示在这里。',
    diamondsAmount: '{{count}} Diamonds',
    watch: '观看',
    thumbnailStorage: '缩略图存储',
    thumbnailStorageHelp: '上传的缩略图会安全存储在 Cloudflare R2 中。',
  },
  ja: {
    thumbnailFormatError: 'サムネイルは JPG、PNG、WEBP のいずれかにしてください。',
    thumbnailSizeError: 'サムネイルは 5 MB 以下にしてください。',
    requiredVideoTitle: '動画リンクとタイトルは必須です。',
    thumbnailRequired: 'サムネイルを追加するか、有効な YouTube リンクを使用してください。',
    unlockMinError: 'アンロック価格は最低 1 Diamond です。',
    publishSuccess: '動画を公開しました。',
    draftSuccess: '下書きを保存しました。',
    saveFailed: '動画を保存できませんでした。',
    backToStudio: 'Fast Studio に戻る',
    createVideo: '動画を作成',
    createSubtitle: 'リンク動画を Fast に追加',
    viewFast: 'Fast を見る',
    videoLink: '動画リンク',
    videoLinkPlaceholder: 'YouTube または外部動画 URL を貼り付け',
    videoTitle: '動画タイトル',
    videoTitlePlaceholder: '動画タイトルを入力',
    description: '説明',
    descriptionPlaceholder: '短い説明を入力',
    thumbnail: 'サムネイル',
    uploadThumbnail: 'サムネイルをアップロード',
    thumbnailHelp: 'JPG、PNG、WEBP · 最大 5 MB · 推奨 16:9',
    removeThumbnail: 'サムネイルを削除',
    youtubeThumbnailAuto: '自分の画像をアップロードするまでは YouTube のサムネイルが自動的に使用されます。',
    tags: 'タグ',
    removeTag: '{{tag}} を削除',
    addAnotherTag: 'タグを追加',
    tagPlaceholder: 'タグを入力して Enter',
    tagsHelp: '最大 10 個。Enter またはカンマで追加できます。',
    access: 'アクセス',
    free: '無料',
    anyoneWatch: '誰でも視聴できます。',
    paidUnlock: '有料アンロック',
    unlockWithDiamonds: 'Diamonds でアンロック。',
    unlockPrice: 'アンロック価格',
    diamonds: 'Diamonds',
    saving: '保存中...',
    saveDraft: '下書きを保存',
    uploading: 'アップロード中...',
    publishing: '公開中...',
    publish: '公開',
    previewInFast: 'Fast でプレビュー',
    previewHelp: '動画の表示イメージです。',
    previewAlt: '動画サムネイルのプレビュー',
    linkVideo: 'リンク動画',
    previewTitle: '動画タイトル',
    previewDescription: '動画の説明がここに表示されます。',
    diamondsAmount: '{{count}} Diamonds',
    watch: '見る',
    thumbnailStorage: 'サムネイル保存',
    thumbnailStorageHelp: 'アップロードしたサムネイルは Cloudflare R2 に安全に保存されます。',
  },
  ko: {
    thumbnailFormatError: '썸네일은 JPG, PNG 또는 WEBP 형식이어야 합니다.',
    thumbnailSizeError: '썸네일 크기는 5 MB 이하여야 합니다.',
    requiredVideoTitle: '동영상 링크와 제목을 입력하세요.',
    thumbnailRequired: '썸네일을 추가하거나 올바른 YouTube 링크를 사용하세요.',
    unlockMinError: '잠금 해제 가격은 최소 1 Diamond입니다.',
    publishSuccess: '동영상이 게시되었습니다.',
    draftSuccess: '초안이 저장되었습니다.',
    saveFailed: '동영상을 저장하지 못했습니다.',
    backToStudio: 'Fast Studio로 돌아가기',
    createVideo: '동영상 만들기',
    createSubtitle: '링크 동영상을 Fast에 추가',
    viewFast: 'Fast 보기',
    videoLink: '동영상 링크',
    videoLinkPlaceholder: 'YouTube 또는 외부 동영상 URL 붙여넣기',
    videoTitle: '동영상 제목',
    videoTitlePlaceholder: '동영상 제목 입력',
    description: '설명',
    descriptionPlaceholder: '짧은 설명 작성',
    thumbnail: '썸네일',
    uploadThumbnail: '썸네일 업로드',
    thumbnailHelp: 'JPG, PNG 또는 WEBP · 최대 5 MB · 권장 16:9',
    removeThumbnail: '썸네일 삭제',
    youtubeThumbnailAuto: '직접 업로드하기 전까지 YouTube 썸네일이 자동으로 사용됩니다.',
    tags: '태그',
    removeTag: '{{tag}} 삭제',
    addAnotherTag: '태그 추가',
    tagPlaceholder: '태그를 입력하고 Enter',
    tagsHelp: '최대 10개 태그. Enter 또는 쉼표로 추가하세요.',
    access: '공개 설정',
    free: '무료',
    anyoneWatch: '누구나 볼 수 있습니다.',
    paidUnlock: '유료 잠금 해제',
    unlockWithDiamonds: 'Diamonds로 잠금 해제합니다.',
    unlockPrice: '잠금 해제 가격',
    diamonds: 'Diamonds',
    saving: '저장 중...',
    saveDraft: '초안 저장',
    uploading: '업로드 중...',
    publishing: '게시 중...',
    publish: '게시',
    previewInFast: 'Fast에서 미리보기',
    previewHelp: '동영상이 표시되는 모습입니다.',
    previewAlt: '동영상 썸네일 미리보기',
    linkVideo: '링크 동영상',
    previewTitle: '동영상 제목',
    previewDescription: '동영상 설명이 여기에 표시됩니다.',
    diamondsAmount: '{{count}} Diamonds',
    watch: '보기',
    thumbnailStorage: '썸네일 저장소',
    thumbnailStorageHelp: '업로드한 썸네일은 Cloudflare R2에 안전하게 저장됩니다.',
  },
})

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024
const ALLOWED_THUMBNAIL_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function extractYouTubeId(value) {
  const input = String(value || '').trim()

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match?.[1]) return match[1]
  }

  return ''
}

export default function FastCreateVideoPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const thumbnailInputRef = useRef(null)
  const { uploadThumbnail, uploadingThumbnail } = useFastThumbnailUpload()
  const { createFastVideo, creatingVideo } = useFastVideoCreate()
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [access, setAccess] = useState('free')
  const [diamonds, setDiamonds] = useState('10')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [message, setMessage] = useState('')
  const [savingStatus, setSavingStatus] = useState('')

  const youtubeThumbnail = useMemo(() => {
    const videoId = extractYouTubeId(link)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
  }, [link])

  const previewThumbnail = thumbnailPreview || youtubeThumbnail

  useEffect(() => {
    return () => {
      if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview)
    }
  }, [thumbnailPreview])

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0]
    setMessage('')

    if (!file) return

    if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type)) {
      setMessage(t('fastCreateVideoPage.thumbnailFormatError'))
      event.target.value = ''
      return
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      setMessage(t('fastCreateVideoPage.thumbnailSizeError'))
      event.target.value = ''
      return
    }

    if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview)

    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
    setUploadedThumbnailUrl('')
  }

  const removeThumbnail = () => {
    if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview)
    setThumbnailFile(null)
    setThumbnailPreview('')
    setUploadedThumbnailUrl('')
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
  }

  const addTag = (rawValue = tagInput) => {
    const nextTag = String(rawValue || '')
      .trim()
      .replace(/^#+/, '')
      .replace(/\s+/g, '-')
      .slice(0, 24)

    if (!nextTag || tags.includes(nextTag) || tags.length >= 10) {
      setTagInput('')
      return
    }

    setTags((current) => [...current, nextTag])
    setTagInput('')
  }

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }

    if (event.key === 'Backspace' && !tagInput && tags.length) {
      setTags((current) => current.slice(0, -1))
    }
  }

  const saveVideo = async (status) => {
    setMessage('')

    if (!link.trim() || !title.trim()) {
      setMessage(t('fastCreateVideoPage.requiredVideoTitle'))
      return
    }

    if (!previewThumbnail) {
      setMessage(t('fastCreateVideoPage.thumbnailRequired'))
      return
    }

    if (access === 'paid' && (!diamonds || Number(diamonds) < 1)) {
      setMessage(t('fastCreateVideoPage.unlockMinError'))
      return
    }

    try {
      setSavingStatus(status)

      let thumbnailUrl = uploadedThumbnailUrl || youtubeThumbnail

      if (thumbnailFile && !uploadedThumbnailUrl) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile)
        setUploadedThumbnailUrl(thumbnailUrl)
      }

      const result = await createFastVideo({
        video_url: link.trim(),
        title: title.trim(),
        description: description.trim(),
        thumbnail_url: thumbnailUrl,
        tags,
        access_type: access,
        unlock_price_diamonds: access === 'paid' ? Number(diamonds) : 0,
        status,
      })

      setMessage(
        result.message ||
          (status === 'published'
            ? t('fastCreateVideoPage.publishSuccess')
            : t('fastCreateVideoPage.draftSuccess'))
      )
    } catch (error) {
      setMessage(error.message || t('fastCreateVideoPage.saveFailed'))
    } finally {
      setSavingStatus('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    saveVideo('published')
  }

  const isSaving = uploadingThumbnail || creatingVideo

  return (
    <div className="app-page min-h-screen bg-[#f7f5fb] pb-10 text-[#171329] dark:bg-[var(--shadow-bg-page)] dark:text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[#ece8f5] bg-white/95 backdrop-blur-xl dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="mx-auto flex w-full max-w-[1040px] items-center gap-3 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/fast/studio')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e1ef] bg-white text-[#302943] transition hover:bg-[#f8f5ff] active:scale-95 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-primary)] dark:hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('fastCreateVideoPage.backToStudio')}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-black tracking-[-0.03em] text-[#171329] dark:text-[var(--shadow-text-primary)]">
              {t('fastCreateVideoPage.createVideo')}
            </h1>
            <p className="text-[11px] font-medium text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
              {t('fastCreateVideoPage.createSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/fast')}
            className="flex h-10 items-center gap-2 rounded-full bg-[#7443e5] px-4 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(116,67,229,0.23)] transition hover:bg-[#6538d2] active:scale-95"
          >
            <Eye size={16} />
            {t('fastCreateVideoPage.viewFast')}
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1040px] gap-5 px-3 py-5 sm:px-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)]"
        >
          <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
            {t('fastCreateVideoPage.videoLink')}
          </label>
          <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-3 transition focus-within:border-[#7b48e7] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(123,72,231,0.09)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:focus-within:bg-[var(--shadow-input-bg)]">
            <Link2 size={17} className="shrink-0 text-[#7d6e98] dark:text-[var(--shadow-text-tertiary)]" />
            <input
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder={t('fastCreateVideoPage.videoLinkPlaceholder')}
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] text-[#171329] outline-none placeholder:text-[#aaa3b4] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)]"
            />
          </div>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
            {t('fastCreateVideoPage.videoTitle')}
          </label>
          <input
            type="text"
            maxLength={100}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t('fastCreateVideoPage.videoTitlePlaceholder')}
            className="h-12 w-full rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 text-[13px] text-[#171329] outline-none transition placeholder:text-[#aaa3b4] focus:border-[#7b48e7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,72,231,0.09)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:bg-[var(--shadow-input-bg)]"
          />
          <div className="mb-4 mt-1 text-right text-[10px] font-semibold text-[#aaa3b4] dark:text-[var(--shadow-text-tertiary)]">
            {title.length}/100
          </div>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
            {t('fastCreateVideoPage.description')}
          </label>
          <textarea
            value={description}
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t('fastCreateVideoPage.descriptionPlaceholder')}
            rows={4}
            className="w-full resize-none rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 py-3 text-[13px] leading-5 text-[#171329] outline-none transition placeholder:text-[#aaa3b4] focus:border-[#7b48e7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,72,231,0.09)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:bg-[var(--shadow-input-bg)]"
          />
          <div className="mb-4 mt-1 text-right text-[10px] font-semibold text-[#aaa3b4] dark:text-[var(--shadow-text-tertiary)]">
            {description.length}/500
          </div>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
            {t('fastCreateVideoPage.thumbnail')}
          </label>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbnailChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="mb-2 flex w-full items-center gap-3 rounded-[18px] border border-dashed border-[#bda9eb] bg-[#faf7ff] p-4 text-left transition hover:bg-[#f4eeff] dark:border-violet-400/40 dark:bg-violet-500/10 dark:hover:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eee5ff] text-[#7041de]">
              <ImagePlus size={21} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
                {t('fastCreateVideoPage.uploadThumbnail')}
              </span>
              <span className="mt-1 block text-[10px] leading-4 text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
                {t('fastCreateVideoPage.thumbnailHelp')}
              </span>
            </span>
          </button>

          {thumbnailFile ? (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-[14px] bg-[#f3edff] px-3 py-2 dark:bg-violet-500/10">
              <span className="min-w-0 truncate text-[11px] font-bold text-[#6538d2]">
                {thumbnailFile.name}
              </span>
              <button
                type="button"
                onClick={removeThumbnail}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#7443e5] hover:bg-white dark:text-violet-300 dark:hover:bg-[var(--shadow-bg-hover)]"
                aria-label={t('fastCreateVideoPage.removeThumbnail')}
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="mb-4 text-[10px] font-medium text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
              {t('fastCreateVideoPage.youtubeThumbnailAuto')}
            </div>
          )}

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
            {t('fastCreateVideoPage.tags')}
          </label>
          <div className="mb-2 flex min-h-12 flex-wrap items-center gap-2 rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-3 py-2 focus-within:border-[#7b48e7] focus-within:bg-white dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:focus-within:bg-[var(--shadow-input-bg)]">
            <Tag size={16} className="shrink-0 text-[#7d6e98] dark:text-[var(--shadow-text-tertiary)]" />

            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#eee5ff] px-2.5 py-1.5 text-[10px] font-extrabold text-[#6538d2] dark:bg-violet-500/15 dark:text-violet-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  aria-label={t('fastCreateVideoPage.removeTag', { tag })}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            <input
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => addTag()}
              placeholder={tags.length ? t('fastCreateVideoPage.addAnotherTag') : t('fastCreateVideoPage.tagPlaceholder')}
              className="h-8 min-w-[150px] flex-1 bg-transparent text-[12px] text-[#171329] outline-none placeholder:text-[#aaa3b4] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)]"
            />
          </div>
          <p className="mb-4 text-[10px] font-medium text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
            {t('fastCreateVideoPage.tagsHelp')}
          </p>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
            {t('fastCreateVideoPage.access')}
          </label>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccess('free')}
              className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                access === 'free'
                  ? 'border-[#7443e5] bg-[#f3edff] shadow-[0_0_0_3px_rgba(116,67,229,0.08)] dark:bg-violet-500/15'
                  : 'border-[#e4dfea] bg-white hover:bg-[#faf8fd] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:hover:bg-[var(--shadow-bg-hover)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play size={17} className="text-[#7041de]" />
                <span className="text-[13px] font-extrabold text-[#241d32] dark:text-[var(--shadow-text-primary)]">{t('fastCreateVideoPage.free')}</span>
              </div>
              <p className="mt-1 text-[10px] leading-4 text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
                {t('fastCreateVideoPage.anyoneWatch')}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAccess('paid')}
              className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                access === 'paid'
                  ? 'border-[#7443e5] bg-[#f3edff] shadow-[0_0_0_3px_rgba(116,67,229,0.08)] dark:bg-violet-500/15'
                  : 'border-[#e4dfea] bg-white hover:bg-[#faf8fd] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:hover:bg-[var(--shadow-bg-hover)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <LockKeyhole size={17} className="text-[#7041de]" />
                <span className="text-[13px] font-extrabold text-[#241d32] dark:text-[var(--shadow-text-primary)]">{t('fastCreateVideoPage.paidUnlock')}</span>
              </div>
              <p className="mt-1 text-[10px] leading-4 text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
                {t('fastCreateVideoPage.unlockWithDiamonds')}
              </p>
            </button>
          </div>

          {access === 'paid' ? (
            <div className="mb-4">
              <label className="mb-2 block text-[12px] font-extrabold text-[#302943] dark:text-[var(--shadow-text-primary)]">
                {t('fastCreateVideoPage.unlockPrice')}
              </label>
              <div className="flex h-12 items-center rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 transition focus-within:border-[#7b48e7] focus-within:bg-white dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:focus-within:bg-[var(--shadow-input-bg)]">
                <Gem size={17} fill="currentColor" className="shrink-0 text-[#7041de]" />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={diamonds}
                  onChange={(event) => setDiamonds(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] font-bold text-[#171329] outline-none dark:text-[var(--shadow-text-primary)]"
                />
                <span className="text-[11px] font-extrabold text-[#7041de]">{t('fastCreateVideoPage.diamonds')}</span>
              </div>
            </div>
          ) : null}

          {message ? (
            <div className="mb-4 rounded-[15px] bg-[#f3edff] px-4 py-3 text-[11px] font-bold leading-5 text-[#6538d2] dark:bg-violet-500/10 dark:text-violet-300">
              {message}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveVideo('draft')}
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] border border-[#cdbcf2] bg-white text-[12px] font-extrabold text-[#6738d9] transition hover:bg-[#f8f5ff] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-400/40 dark:bg-[var(--shadow-bg-surface)] dark:text-violet-300 dark:hover:bg-[var(--shadow-bg-hover)]"
            >
              <Save size={16} />
              {isSaving && savingStatus === 'draft' ? t('fastCreateVideoPage.saving') : t('fastCreateVideoPage.saveDraft')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#7443e5] text-[12px] font-extrabold text-white shadow-[0_12px_26px_rgba(116,67,229,0.25)] transition hover:bg-[#6538d2] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {isSaving && savingStatus === 'published'
                ? uploadingThumbnail
                  ? t('fastCreateVideoPage.uploading')
                  : 'Publishing...'
                : t('fastCreateVideoPage.publish')}
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5 lg:sticky lg:top-[82px] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#171329] dark:text-[var(--shadow-text-primary)]">
                {t('fastCreateVideoPage.previewInFast')}
              </h2>
              <p className="mt-1 text-[12px] text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">{t('fastCreateVideoPage.previewHelp')}</p>
            </div>
            <CheckCircle2 size={21} className="text-[#7041de]" />
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#e8e2f1] bg-white dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)]">
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#3d246f] via-[#7443e5] to-[#e887a5]">
              {previewThumbnail ? (
                <img
                  src={previewThumbnail}
                  alt={t('fastCreateVideoPage.previewAlt')}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-[#7041de] shadow-xl">
                  <Play size={27} fill="currentColor" className="ml-1" />
                </span>
              </div>

              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#21152f]/75 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                <Link2 size={12} />
                {t('fastCreateVideoPage.linkVideo')}
              </span>

              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#7041de]/90 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                {access === 'paid' ? <Gem size={12} fill="currentColor" /> : <Play size={12} />}
                {access === 'paid' ? t('fastCreateVideoPage.paidUnlock') : t('fastCreateVideoPage.free')}
              </span>
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-[#171329] dark:text-[var(--shadow-text-primary)]">
                {title.trim() || t('fastCreateVideoPage.previewTitle')}
              </h3>
              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
                {description.trim() || t('fastCreateVideoPage.previewDescription')}
              </p>

              {tags.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f3edff] px-2 py-1 text-[9px] font-bold text-[#7041de] dark:bg-violet-500/15 dark:text-violet-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                    access === 'paid'
                      ? 'bg-[#f3edff] text-[#7041de] dark:bg-violet-500/15 dark:text-violet-300'
                      : 'bg-[#eafaf1] text-[#168653] dark:bg-emerald-500/10 dark:text-emerald-300'
                  }`}
                >
                  {access === 'paid' ? <Gem size={12} fill="currentColor" /> : null}
                  {access === 'paid' ? t('fastCreateVideoPage.diamondsAmount', { count: diamonds || 0 }) : t('fastCreateVideoPage.free')}
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-[12px] border border-[#7443e5] px-3 py-2 text-[11px] font-extrabold text-[#7041de] dark:text-violet-300"
                >
                  <Play size={13} fill="currentColor" />
                  {t('fastCreateVideoPage.watch')}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[16px] bg-[#faf7ff] p-3 dark:bg-violet-500/10">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#6538d2] dark:text-violet-300">
              <UploadCloud size={16} />
              {t('fastCreateVideoPage.thumbnailStorage')}
            </div>
            <p className="mt-1 text-[10px] leading-4 text-[#918a9e] dark:text-[var(--shadow-text-secondary)]">
              {t('fastCreateVideoPage.thumbnailStorageHelp')}
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}

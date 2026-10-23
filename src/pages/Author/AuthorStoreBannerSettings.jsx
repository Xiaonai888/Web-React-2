import { useEffect, useRef, useState } from 'react'
import { optimizeImageForUpload } from '../../utils/imageUploadOptimizer'
import { uploadMediaWithFallback } from '../../utils/uploadMediaWithFallback'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoreBannerSettings', {
  en: {
    heading: 'Store Banner', help: 'Upload a 16:9 banner for the top of your Author Store.',
    loading: 'Loading banner...', preview: 'Store banner preview', empty: 'No Store Banner',
    bannerTitle: 'Banner title', description: 'Description', buttonText: 'Button text',
    change: 'Change Banner', upload: 'Upload Banner', remove: 'Remove Banner',
    save: 'Save', saving: 'Saving...', optimizing: 'Optimizing image...',
    uploading: 'Uploading image... {{percent}}%', login: 'Please login first.',
    loginAgain: 'Please login again.', loadFailed: 'Failed to load Store Banner',
    imageRequired: 'Please select a supported image file.', tooLarge: 'Banner image must be 5 MB or smaller.',
    uploadFailed: 'Failed to upload banner', saveFailed: 'Failed to save Store Banner',
    saved: 'Store Banner saved.', removed: 'Store Banner removed.',
    removeHint: 'Press Save to remove this banner.',
  },
  km: {
    heading: 'រូបផ្ទាំងហាង', help: 'បញ្ចូលរូបផ្ទាំង 16:9 សម្រាប់ផ្នែកខាងលើហាងអ្នកនិពន្ធ។',
    loading: 'កំពុងផ្ទុករូបផ្ទាំង...', preview: 'មើលរូបផ្ទាំងហាងជាមុន', empty: 'មិនទាន់មានរូបផ្ទាំងហាង',
    bannerTitle: 'ចំណងជើងរូបផ្ទាំង', description: 'ការពិពណ៌នា', buttonText: 'អក្សរលើប៊ូតុង',
    change: 'ប្ដូររូបផ្ទាំង', upload: 'បញ្ចូលរូបផ្ទាំង', remove: 'លុបរូបផ្ទាំង',
    save: 'រក្សាទុក', saving: 'កំពុងរក្សាទុក...', optimizing: 'កំពុងបង្រួមរូបភាព...',
    uploading: 'កំពុងបញ្ចូលរូបភាព... {{percent}}%', login: 'សូមចូលគណនីជាមុន។',
    loginAgain: 'សូមចូលគណនីម្ដងទៀត។', loadFailed: 'មិនអាចផ្ទុករូបផ្ទាំងហាងបានទេ',
    imageRequired: 'សូមជ្រើសរូបភាពដែលអាចប្រើបាន។', tooLarge: 'រូបផ្ទាំងត្រូវមានទំហំមិនលើស 5 MB។',
    uploadFailed: 'មិនអាចបញ្ចូលរូបផ្ទាំងបានទេ', saveFailed: 'មិនអាចរក្សាទុករូបផ្ទាំងហាងបានទេ',
    saved: 'បានរក្សាទុករូបផ្ទាំងហាង។', removed: 'បានលុបរូបផ្ទាំងហាង។',
    removeHint: 'ចុច រក្សាទុក ដើម្បីលុបរូបផ្ទាំងនេះ។',
  },
  zh: {
    heading: '商店横幅', help: '上传 16:9 横幅显示在作者商店顶部。',
    loading: '正在加载横幅...', preview: '商店横幅预览', empty: '暂无商店横幅',
    bannerTitle: '横幅标题', description: '描述', buttonText: '按钮文字',
    change: '更换横幅', upload: '上传横幅', remove: '移除横幅',
    save: '保存', saving: '正在保存...', optimizing: '正在压缩图片...',
    uploading: '正在上传图片... {{percent}}%', login: '请先登录。',
    loginAgain: '请重新登录。', loadFailed: '无法加载商店横幅',
    imageRequired: '请选择支持的图片文件。', tooLarge: '横幅图片不能超过 5 MB。',
    uploadFailed: '横幅上传失败', saveFailed: '商店横幅保存失败',
    saved: '商店横幅已保存。', removed: '商店横幅已移除。',
    removeHint: '点击保存以移除此横幅。',
  },
  ja: {
    heading: 'ストアバナー', help: '作者ストア上部用の16:9バナーをアップロードしてください。',
    loading: 'バナーを読み込み中...', preview: 'ストアバナーのプレビュー', empty: 'ストアバナーがありません',
    bannerTitle: 'バナーのタイトル', description: '説明', buttonText: 'ボタンのテキスト',
    change: 'バナーを変更', upload: 'バナーをアップロード', remove: 'バナーを削除',
    save: '保存', saving: '保存中...', optimizing: '画像を圧縮中...',
    uploading: '画像をアップロード中... {{percent}}%', login: '先にログインしてください。',
    loginAgain: 'もう一度ログインしてください。', loadFailed: 'ストアバナーを読み込めませんでした',
    imageRequired: '対応する画像ファイルを選択してください。', tooLarge: 'バナー画像は5 MB以下にしてください。',
    uploadFailed: 'バナーのアップロードに失敗しました', saveFailed: 'ストアバナーを保存できませんでした',
    saved: 'ストアバナーを保存しました。', removed: 'ストアバナーを削除しました。',
    removeHint: '削除するには保存を押してください。',
  },
  ko: {
    heading: '스토어 배너', help: '작가 스토어 상단에 표시할 16:9 배너를 업로드하세요.',
    loading: '배너 불러오는 중...', preview: '스토어 배너 미리보기', empty: '스토어 배너가 없습니다',
    bannerTitle: '배너 제목', description: '설명', buttonText: '버튼 문구',
    change: '배너 변경', upload: '배너 업로드', remove: '배너 삭제',
    save: '저장', saving: '저장 중...', optimizing: '이미지 압축 중...',
    uploading: '이미지 업로드 중... {{percent}}%', login: '먼저 로그인하세요.',
    loginAgain: '다시 로그인하세요.', loadFailed: '스토어 배너를 불러오지 못했습니다',
    imageRequired: '지원되는 이미지 파일을 선택하세요.', tooLarge: '배너 이미지는 5 MB 이하여야 합니다.',
    uploadFailed: '배너 업로드에 실패했습니다', saveFailed: '스토어 배너를 저장하지 못했습니다',
    saved: '스토어 배너를 저장했습니다.', removed: '스토어 배너를 삭제했습니다.',
    removeHint: '이 배너를 삭제하려면 저장을 누르세요.',
  },
})

const API_BASE_URL = import.meta.env?.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const MAX_BYTES = 5 * 1024 * 1024
const DEFAULT_TITLE = 'Author Store'
const DEFAULT_SUBTITLE = 'Books, PDFs & Special Releases'
const DEFAULT_BUTTON = 'Shop Now →'

function getAuthToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function safeBannerSrc(value, objectUrl) {
  if (typeof value !== 'string') return ''
  if (value === objectUrl && value.startsWith('blob:')) return value
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

export default function AuthorStoreBannerSettings({ onBack }) {
  const { t } = useDisplayTranslation()
  const fileInputRef = useRef(null)
  const previewObjectRef = useRef('')
  const optimizeControllerRef = useRef(null)
  const savingRef = useRef(false)
  const [authorPage, setAuthorPage] = useState(null)
  const [bannerUrl, setBannerUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE)
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function loadAuthorPage() {
      const token = getAuthToken()
      if (!token) {
        setMessage(t('authorStoreBannerSettings.login'))
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setMessage('')
        const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false || !data.author_page) {
          throw new Error(data.message || t('authorStoreBannerSettings.loadFailed'))
        }
        if (!active) return
        const page = data.author_page
        const details = page.profile_details || {}
        const currentBanner = details.store_banner_url || ''
        setAuthorPage(page)
        setBannerUrl(currentBanner)
        setPreviewUrl(currentBanner)
        setTitle(details.store_banner_title || DEFAULT_TITLE)
        setSubtitle(details.store_banner_subtitle || DEFAULT_SUBTITLE)
        setButtonText(details.store_banner_button_text || DEFAULT_BUTTON)
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setMessage(error.message || t('authorStoreBannerSettings.loadFailed'))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadAuthorPage()
    return () => {
      active = false
      controller.abort()
      optimizeControllerRef.current?.abort()
      if (previewObjectRef.current) URL.revokeObjectURL(previewObjectRef.current)
      previewObjectRef.current = ''
    }
  }, [])

  function updatePreview(url, temporary = false) {
    if (previewObjectRef.current) URL.revokeObjectURL(previewObjectRef.current)
    previewObjectRef.current = temporary ? url : ''
    setPreviewUrl(url)
  }

  async function handleSelectFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || loading || savingRef.current) return

    optimizeControllerRef.current?.abort()
    const controller = new AbortController()
    optimizeControllerRef.current = controller
    setOptimizing(true)
    setMessage('')

    try {
      if (file.size > MAX_BYTES) throw new Error(t('authorStoreBannerSettings.tooLarge'))
      const optimized = await optimizeImageForUpload(file, {
        preset: 'banner', force: true, maxSourceBytes: MAX_BYTES, signal: controller.signal,
      })
      if (controller.signal.aborted) return
      const readyFile = optimized.file
      if (!readyFile || !readyFile.type.startsWith('image/') || readyFile.size > MAX_BYTES || readyFile.size <= 0) {
        throw new Error(t('authorStoreBannerSettings.imageRequired'))
      }
      updatePreview(URL.createObjectURL(readyFile), true)
      setSelectedFile(readyFile)
    } catch (error) {
      if (!controller.signal.aborted) {
        setMessage(error.message || t('authorStoreBannerSettings.imageRequired'))
      }
    } finally {
      if (optimizeControllerRef.current === controller) {
        optimizeControllerRef.current = null
        setOptimizing(false)
      }
    }
  }

  async function saveBanner() {
    if (savingRef.current || loading || optimizing || !authorPage) return
    const token = getAuthToken()
    if (!token) {
      setMessage(t('authorStoreBannerSettings.loginAgain'))
      return
    }

    savingRef.current = true
    setSaving(true)
    setMessage('')
    setUploadProgress(0)
    try {
      let nextBannerUrl = previewUrl
      if (selectedFile) {
        const result = await uploadMediaWithFallback({
          file: selectedFile,
          category: 'author_store_cover',
          token,
          apiBaseUrl: API_BASE_URL,
          onProgress: (percent) => setUploadProgress(percent),
        })
        nextBannerUrl = String(result.image_url || result.imageUrl || '').trim()
        if (!/^https:\/\//i.test(nextBannerUrl)) {
          throw new Error(t('authorStoreBannerSettings.uploadFailed'))
        }
        updatePreview(nextBannerUrl)
        setSelectedFile(null)
      }

      const storeFields = {
        store_banner_url: nextBannerUrl || '',
        store_banner_title: title.trim(),
        store_banner_subtitle: subtitle.trim(),
        store_banner_button_text: buttonText.trim(),
      }
      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: authorPage.page_name || '',
          page_username: authorPage.page_username || '',
          bio: authorPage.bio || '',
          profile_details: storeFields,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('authorStoreBannerSettings.saveFailed'))
      }
      const updatedPage = data.author_page || {
        ...authorPage,
        profile_details: { ...(authorPage.profile_details || {}), ...storeFields },
      }
      setAuthorPage(updatedPage)
      setBannerUrl(nextBannerUrl || '')
      updatePreview(nextBannerUrl || '')
      setSelectedFile(null)
      try {
        localStorage.setItem('shadow_author_page', JSON.stringify(updatedPage))
      } catch {}
      window.dispatchEvent(new Event('shadow_author_store_banner_updated'))
      setMessage(t(nextBannerUrl ? 'authorStoreBannerSettings.saved' : 'authorStoreBannerSettings.removed'))
    } catch (error) {
      setMessage(error.message || t('authorStoreBannerSettings.saveFailed'))
    } finally {
      savingRef.current = false
      setSaving(false)
      setUploadProgress(0)
    }
  }

  function removeBanner() {
    if (savingRef.current) return
    optimizeControllerRef.current?.abort()
    optimizeControllerRef.current = null
    setOptimizing(false)
    setSelectedFile(null)
    updatePreview('')
    setMessage(t('authorStoreBannerSettings.removeHint'))
  }

  const savedDetails = authorPage?.profile_details || {}
  const changed = Boolean(selectedFile) ||
    String(previewUrl || '') !== String(bannerUrl || '') ||
    title.trim() !== String(savedDetails.store_banner_title || DEFAULT_TITLE).trim() ||
    subtitle.trim() !== String(savedDetails.store_banner_subtitle || DEFAULT_SUBTITLE).trim() ||
    buttonText.trim() !== String(savedDetails.store_banner_button_text || DEFAULT_BUTTON).trim()

  return (
    <section className="space-y-4">
      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold text-[#111827] ring-1 ring-black/5"
        >
          {message}
        </button>
      ) : null}

      <section className="overflow-hidden rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h2 className="text-[16px] font-black text-[#111827]">{t('authorStoreBannerSettings.heading')}</h2>
        <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
          {t('authorStoreBannerSettings.help')}
        </p>

        <div className="relative mt-4 aspect-video overflow-hidden rounded-[18px] bg-[#f3f4f6] ring-1 ring-black/5">
  {loading || optimizing ? (
    <div className="flex h-full items-center justify-center text-[12px] font-bold text-[#8b93a1]">
      {t(optimizing ? 'authorStoreBannerSettings.optimizing' : 'authorStoreBannerSettings.loading')}
    </div>
  ) : previewUrl ? (
    <>
      <img
        src={safeBannerSrc(previewUrl, previewObjectRef.current)}
        alt={t('authorStoreBannerSettings.preview')}
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-white/80 via-white/30 to-transparent" />

      <div className="absolute left-4 top-1/2 w-[46%] sm:left-6">
        <h2 className="line-clamp-1 text-[18px] font-black leading-tight text-[#6d28d9] sm:text-[23px]">
          {title || 'Author Store'}
        </h2>

        <p className="mt-1 line-clamp-2 whitespace-pre-line text-[10px] font-semibold leading-[15px] text-[#111827] sm:text-[12px]">
          {subtitle || 'Books, PDFs & Special Releases'}
        </p>

        <button
          type="button"
          tabIndex={-1}
          className="mt-2.5 h-8 rounded-[9px] bg-black px-4 text-[10px] font-bold text-white shadow-sm sm:h-9 sm:text-[11px]"
        >
          {buttonText || 'Shop Now →'}
        </button>
      </div>
    </>
  ) : (
    <div className="flex h-full flex-col items-center justify-center text-[#9ca3af]">
      <i className="fa-regular fa-image text-[28px]" />
      <span className="mt-2 text-[12px] font-bold">{t('authorStoreBannerSettings.empty')}</span>
    </div>

  )}
</div>

<div className="mt-4 space-y-3">
  <div>
    <label className="mb-1.5 block text-[12px] font-bold text-[#374151]" >{t('authorStoreBannerSettings.bannerTitle')}
    </label>
    <input
      type="text"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      maxLength={40}
      disabled={saving || loading}
      placeholder="Author Store"
      className="h-11 w-full rounded-[14px] border border-[#d9e1ec] bg-white px-3 text-[13px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-[12px] font-bold text-[#374151]" >{t('authorStoreBannerSettings.description')}
    </label>
    <textarea
      value={subtitle}
      onChange={(event) => setSubtitle(event.target.value)}
      maxLength={100}
      disabled={saving || loading}
      rows={3}
      placeholder="Books, PDFs & Special Releases"
      className="w-full resize-none rounded-[14px] border border-[#d9e1ec] bg-white px-3 py-3 text-[13px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
    />
  </div>

  <div>
    <label className="mb-1.5 block text-[12px] font-bold text-[#374151]" >{t('authorStoreBannerSettings.buttonText')}
    </label>
    <input
      type="text"
      value={buttonText}
      onChange={(event) => setButtonText(event.target.value)}
      maxLength={24}
      disabled={saving || loading}
      placeholder="Shop Now →"
      className="h-11 w-full rounded-[14px] border border-[#d9e1ec] bg-white px-3 text-[13px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
    />
  </div>
</div>

<input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
          className="hidden"
          onChange={handleSelectFile}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || saving || optimizing}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#111827] text-[13px] font-normal text-white active:scale-[0.98] disabled:opacity-50"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-[13px]" />
          {optimizing ? t('authorStoreBannerSettings.optimizing') : t(previewUrl ? 'authorStoreBannerSettings.change' : 'authorStoreBannerSettings.upload')}
        </button>

        {previewUrl ? (
          <button
            type="button"
            onClick={removeBanner}
            disabled={saving || optimizing}
            className="mt-3 h-11 w-full rounded-[14px] bg-[#fff1f2] text-[13px] font-normal text-[#b91c1c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-50"
           >
            {t('authorStoreBannerSettings.remove')}
          </button>
        ) : null}
      </section>

      <button
        type="button"
        onClick={saveBanner}
        disabled={loading || saving || optimizing || !changed}
        className="h-12 w-full rounded-[16px] bg-[#111827] text-[13px] font-normal text-white active:scale-[0.98] disabled:bg-[#d1d5db]"
      >
        {optimizing ? t('authorStoreBannerSettings.optimizing') : saving ? (uploadProgress > 0 && uploadProgress < 100 ? t('authorStoreBannerSettings.uploading', { percent: uploadProgress }) : t('authorStoreBannerSettings.saving')) : t('authorStoreBannerSettings.save')}
      </button>


    </section>
  )
}

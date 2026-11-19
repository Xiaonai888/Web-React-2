import { useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('sharedProfilePhotoEditor', {
  en: {
    preview: 'Preview',
    details: 'Profile photo',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    saving: 'Saving...',
    public: 'Public',
    zoom: 'Zoom',
    caption: 'Say something about your profile picture...',
    shareToFeed: 'Share your update to Feed',
    photo: 'Profile photo preview',
    noPhoto: 'No photo selected',
    cropFailed: 'Could not crop this photo. Please choose another image.',
    saveFailed: 'Could not save the profile photo.',
  },
  km: {
    preview: 'មើលរូបជាមុន',
    details: 'រូបប្រវត្តិរូប',
    back: 'ត្រឡប់ក្រោយ',
    next: 'បន្ទាប់',
    save: 'រក្សាទុក',
    saving: 'កំពុងរក្សាទុក...',
    public: 'សាធារណៈ',
    zoom: 'ពង្រីក',
    caption: 'សរសេរអ្វីមួយអំពីរូបប្រវត្តិរូបរបស់អ្នក...',
    shareToFeed: 'ចែករំលែកការផ្លាស់ប្តូរនេះទៅ Feed',
    photo: 'មើលរូបប្រវត្តិរូបជាមុន',
    noPhoto: 'មិនទាន់បានជ្រើសរូប',
    cropFailed: 'មិនអាចកាត់រូបនេះបានទេ។ សូមជ្រើសរូបផ្សេង។',
    saveFailed: 'មិនអាចរក្សាទុករូបប្រវត្តិរូបបានទេ។',
  },
  zh: {
    preview: '预览',
    details: '头像',
    back: '返回',
    next: '下一步',
    save: '保存',
    saving: '保存中...',
    public: '公开',
    zoom: '缩放',
    caption: '说说你的头像...',
    shareToFeed: '将更新分享到动态',
    photo: '头像预览',
    noPhoto: '尚未选择照片',
    cropFailed: '无法裁剪此照片，请选择其他图片。',
    saveFailed: '无法保存头像。',
  },
  ja: {
    preview: 'プレビュー',
    details: 'プロフィール写真',
    back: '戻る',
    next: '次へ',
    save: '保存',
    saving: '保存中...',
    public: '公開',
    zoom: 'ズーム',
    caption: 'プロフィール写真について一言...',
    shareToFeed: 'フィードに更新をシェア',
    photo: 'プロフィール写真のプレビュー',
    noPhoto: '写真が選択されていません',
    cropFailed: '写真を切り抜けませんでした。別の写真を選んでください。',
    saveFailed: 'プロフィール写真を保存できませんでした。',
  },
  ko: {
    preview: '미리보기',
    details: '프로필 사진',
    back: '뒤로',
    next: '다음',
    save: '저장',
    saving: '저장 중...',
    public: '전체 공개',
    zoom: '확대/축소',
    caption: '프로필 사진에 대해 이야기해 보세요...',
    shareToFeed: '피드에 업데이트 공유',
    photo: '프로필 사진 미리보기',
    noPhoto: '선택한 사진이 없습니다',
    cropFailed: '사진을 자를 수 없습니다. 다른 이미지를 선택하세요.',
    saveFailed: '프로필 사진을 저장할 수 없습니다.',
  },
})

function getSafeImageUrl(value) {
  if (typeof value !== 'string') return ''
  const input = value.trim()
  if (!input || /[\u0000-\u001F\u007F<>]/.test(input)) return ''
  try {
    const url = new URL(input, window.location.origin)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    if (url.username || url.password) return ''
    return url.href
  } catch {
    return ''
  }
}

async function createCroppedFile(imageUrl, area) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
    image.src = imageUrl
  })

  const targetSize = Math.min(1024, Math.max(1, Math.round(Math.min(area.width, area.height))))
  const canvas = document.createElement('canvas')
  canvas.width = targetSize
  canvas.height = targetSize
  const context = canvas.getContext('2d')
  if (!context) throw new Error('CANVAS_UNAVAILABLE')
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    targetSize,
    targetSize
  )
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('CROP_FAILED')), 'image/webp', 0.86)
  })
  return new File([blob], `profile-${Date.now()}.webp`, { type: 'image/webp', lastModified: Date.now() })
}

export default function SharedProfilePhotoEditor({
  image,
  onBack,
  onSave,
  saving = false,
  shareToFeedDefault = true,
}) {
  const { t } = useDisplayTranslation()
  const detailsImageRef = useRef(null)
  const [imageUrl, setImageUrl] = useState('')
  const [step, setStep] = useState('crop')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropPixels, setCropPixels] = useState(null)
  const [croppedFile, setCroppedFile] = useState(null)
  const [usingOriginal, setUsingOriginal] = useState(false)
  const [croppedUrl, setCroppedUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [shareToFeed, setShareToFeed] = useState(shareToFeedDefault)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!image) {
      setImageUrl('')
      return undefined
    }
    const isBlob = typeof Blob !== 'undefined' && image instanceof Blob
    const url = isBlob ? URL.createObjectURL(image) : getSafeImageUrl(image)
    setImageUrl(url)
    setStep('crop')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCropPixels(null)
    setCroppedFile(null)
    setUsingOriginal(false)
    setCaption('')
    setShareToFeed(shareToFeedDefault)
    setError('')
    return () => {
      if (isBlob) URL.revokeObjectURL(url)
    }
  }, [image, shareToFeedDefault])

  useEffect(() => {
    if (!croppedFile) {
      setCroppedUrl('')
      return undefined
    }
    const url = URL.createObjectURL(croppedFile)
    setCroppedUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [croppedFile])

  const detailsImageUrl = usingOriginal ? imageUrl : croppedUrl

  useEffect(() => {
    const element = detailsImageRef.current
    if (step !== 'details' || !element) return undefined
    if (detailsImageUrl) {
      element.src = detailsImageUrl
    } else {
      element.removeAttribute('src')
    }
    return () => element.removeAttribute('src')
  }, [step, detailsImageUrl])

  async function continueToDetails() {
    if (!imageUrl || !cropPixels || busy) return
    setBusy(true)
    setError('')
    try {
      if (typeof image === 'string' && zoom === 1 && crop.x === 0 && crop.y === 0) {
        setCroppedFile(null)
        setUsingOriginal(true)
        setStep('details')
        return
      }
      const file = await createCroppedFile(imageUrl, cropPixels)
      setUsingOriginal(false)
      setCroppedFile(file)
      setStep('details')
    } catch {
      setError(t('sharedProfilePhotoEditor.cropFailed'))
    } finally {
      setBusy(false)
    }
  }

  async function savePhoto() {
    if ((!croppedFile && !usingOriginal) || !onSave || busy || saving) return
    setBusy(true)
    setError('')
    try {
      await onSave({ file: croppedFile, caption: caption.trim(), privacy: 'public', shareToFeed, unchanged: usingOriginal })
    } catch (saveError) {
      setError(saveError?.message || t('sharedProfilePhotoEditor.saveFailed'))
    } finally {
      setBusy(false)
    }
  }

  function goBack() {
    if (busy || saving) return
    if (step === 'details') {
      setStep('crop')
      setError('')
    } else {
      onBack?.()
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[620px] items-center justify-between gap-3 px-4">
          <button type="button" onClick={goBack} disabled={busy || saving} aria-label={t('sharedProfilePhotoEditor.back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)] disabled:opacity-50">
            <i className="fa-solid fa-arrow-left text-[19px]" />
          </button>
          <h1 className="min-w-0 flex-1 text-[17px] font-bold">{t(`sharedProfilePhotoEditor.${step === 'crop' ? 'preview' : 'details'}`)}</h1>
          <button type="button" onClick={step === 'crop' ? continueToDetails : savePhoto} disabled={busy || saving || (step === 'crop' ? !imageUrl || !cropPixels : (!croppedFile && !usingOriginal) || !onSave)} className="min-w-16 rounded-lg bg-[#1877f2] px-4 py-2 text-[14px] font-bold text-white disabled:opacity-40">
            {busy || saving ? t('sharedProfilePhotoEditor.saving') : t(`sharedProfilePhotoEditor.${step === 'crop' ? 'next' : 'save'}`)}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[620px]">
        <div className="border-b border-[var(--shadow-border)] px-4 py-3 text-[13px] text-[var(--shadow-text-secondary)]">
          <i className="fa-solid fa-earth-americas mr-2" />{t('sharedProfilePhotoEditor.public')}
        </div>

        {step === 'crop' ? (
          <>
            <div className="relative aspect-square w-full overflow-hidden bg-[#111827]">
              {imageUrl ? (
                <Cropper image={imageUrl} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} objectFit="contain" onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setCropPixels(pixels)} />
              ) : (
                <div className="flex h-full items-center justify-center text-white">{t('sharedProfilePhotoEditor.noPhoto')}</div>
              )}
            </div>
            <div className="px-4 py-5">
              <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                <span>{t('sharedProfilePhotoEditor.zoom')}</span><span>{zoom.toFixed(1)}x</span>
              </div>
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-[var(--shadow-accent)]" />
            </div>
          </>
        ) : (
          <>
            <div className="flex aspect-square w-full items-center justify-center bg-[#111827]">
              {detailsImageUrl ? <img ref={detailsImageRef} alt={t('sharedProfilePhotoEditor.photo')} className="aspect-square h-full w-full rounded-full object-contain" /> : null}
            </div>
            <div className="space-y-5 px-4 py-5">
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={3} maxLength={2000} placeholder={t('sharedProfilePhotoEditor.caption')} className="min-h-24 w-full resize-none rounded-2xl border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] p-4 text-[15px] outline-none focus:border-[var(--shadow-accent)]" />
              <label className="flex cursor-pointer items-center justify-between gap-4 text-[15px]">
                <span>{t('sharedProfilePhotoEditor.shareToFeed')}</span>
                <input type="checkbox" checked={shareToFeed} onChange={(event) => setShareToFeed(event.target.checked)} className="h-5 w-5 accent-[#1877f2]" />
              </label>
            </div>
          </>
        )}
        {error ? <p role="alert" className="mx-4 mt-2 rounded-xl bg-red-500/10 px-4 py-3 text-[13px] text-red-600 dark:text-red-300">{error}</p> : null}
      </div>
    </main>
  )
}

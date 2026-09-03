import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('createAuthor', {
  en: {
    cropProfilePhoto: 'Crop Profile Photo', cropHelp: 'Drag and zoom to fit your author avatar.', closeCropEditor: 'Close crop editor', zoom: 'Zoom', cropTip: 'Tip: Drag inside the image to move. Use the Zoom slider if pinch does not work well on your phone browser.', cancel: 'Cancel', saveCrop: 'Save Crop', goBack: 'Go back', createAuthorPage: 'Create Author Page', createAuthorDescription: 'Build your public writing page. Your display name can use any language.', pageName: 'Page Name', pageNamePlaceholder: 'Enter your public author name', pageUsername: 'Page Username', usernameHelp: 'English only. Use letters, numbers, and underscore. Same page name is allowed, but page username must be unique.', bioOptional: 'Bio (Optional)', bioPlaceholder: 'Tell readers about your writing', motto: 'Step into greatness — unleash your potential', creating: 'Creating...', createPage: 'Create Page', addProfilePhoto: 'Add Profile Photo', addProfileDescription: 'Make your author page look more trustworthy. You can skip this and add it later.', authorProfilePreview: 'Author profile preview', uploadPhoto: 'Upload Photo', saving: 'Saving...', savePhoto: 'Save Photo', skipForNow: 'Skip for now', failedUploadImage: 'Failed to upload image', failedCreate: 'Failed to create author page', selectImage: 'Please select an image file', adjustPhoto: 'Please adjust the photo first', failedCrop: 'Failed to crop image', uploadOrSkip: 'Please upload a profile photo or skip for now', failedSave: 'Failed to save profile photo'
  },
  km: {
    cropProfilePhoto: 'កាត់រូបប្រវត្តិរូប', cropHelp: 'អូស និងពង្រីកដើម្បីឱ្យសមនឹងរូបអ្នកនិពន្ធរបស់អ្នក។', closeCropEditor: 'បិទកម្មវិធីកាត់រូប', zoom: 'ពង្រីក', cropTip: 'គន្លឹះ៖ អូសក្នុងរូបដើម្បីផ្លាស់ទី។ ប្រើប៊ូតុងពង្រីក ប្រសិនបើ pinch មិនដំណើរការល្អលើទូរស័ព្ទ។', cancel: 'បោះបង់', saveCrop: 'រក្សាទុកការកាត់', goBack: 'ត្រឡប់ក្រោយ', createAuthorPage: 'បង្កើតទំព័រអ្នកនិពន្ធ', createAuthorDescription: 'បង្កើតទំព័រសាធារណៈសម្រាប់ការសរសេររបស់អ្នក។ ឈ្មោះបង្ហាញអាចប្រើភាសាណាក៏បាន។', pageName: 'ឈ្មោះទំព័រ', pageNamePlaceholder: 'បញ្ចូលឈ្មោះអ្នកនិពន្ធសាធារណៈ', pageUsername: 'ឈ្មោះអ្នកប្រើទំព័រ', usernameHelp: 'ប្រើអង់គ្លេសប៉ុណ្ណោះ។ ប្រើអក្សរ លេខ និងសញ្ញា underscore។ ឈ្មោះទំព័រអាចដូចគ្នា ប៉ុន្តែ username ត្រូវតែមិនស្ទួន។', bioOptional: 'ជីវប្រវត្តិ (ស្រេចចិត្ត)', bioPlaceholder: 'ប្រាប់អ្នកអានអំពីការសរសេររបស់អ្នក', motto: 'ឈានទៅរកភាពអស្ចារ្យ — បញ្ចេញសក្ដានុពលរបស់អ្នក', creating: 'កំពុងបង្កើត...', createPage: 'បង្កើតទំព័រ', addProfilePhoto: 'បន្ថែមរូបប្រវត្តិរូប', addProfileDescription: 'ធ្វើឱ្យទំព័រអ្នកនិពន្ធរបស់អ្នកមើលទៅគួរឱ្យទុកចិត្តជាងមុន។ អ្នកអាចរំលង ហើយបន្ថែមពេលក្រោយ។', authorProfilePreview: 'មើលជាមុនរូបអ្នកនិពន្ធ', uploadPhoto: 'បញ្ចូលរូប', saving: 'កំពុងរក្សាទុក...', savePhoto: 'រក្សាទុករូប', skipForNow: 'រំលងសិន', failedUploadImage: 'បញ្ចូលរូបមិនបាន', failedCreate: 'បង្កើតទំព័រអ្នកនិពន្ធមិនបាន', selectImage: 'សូមជ្រើសរើសឯកសាររូបភាព', adjustPhoto: 'សូមកែសម្រួលរូបជាមុន', failedCrop: 'កាត់រូបមិនបាន', uploadOrSkip: 'សូមបញ្ចូលរូបប្រវត្តិរូប ឬរំលងសិន', failedSave: 'រក្សាទុករូបប្រវត្តិរូបមិនបាន'
  },
  zh: {
    cropProfilePhoto: '裁剪头像', cropHelp: '拖动并缩放以适配作者头像。', closeCropEditor: '关闭裁剪编辑器', zoom: '缩放', cropTip: '提示：在图片内拖动可移动。若手机浏览器双指缩放不顺畅，请使用缩放滑块。', cancel: '取消', saveCrop: '保存裁剪', goBack: '返回', createAuthorPage: '创建作者主页', createAuthorDescription: '创建你的公开写作主页。显示名称可以使用任何语言。', pageName: '主页名称', pageNamePlaceholder: '输入公开作者名称', pageUsername: '主页用户名', usernameHelp: '仅限英文。可使用字母、数字和下划线。主页名称可以重复，但用户名必须唯一。', bioOptional: '简介（可选）', bioPlaceholder: '向读者介绍你的创作', motto: '迈向更好的自己 — 释放你的潜力', creating: '正在创建...', createPage: '创建主页', addProfilePhoto: '添加头像', addProfileDescription: '让你的作者主页更值得信赖。你可以暂时跳过，稍后再添加。', authorProfilePreview: '作者头像预览', uploadPhoto: '上传照片', saving: '正在保存...', savePhoto: '保存照片', skipForNow: '暂时跳过', failedUploadImage: '图片上传失败', failedCreate: '创建作者主页失败', selectImage: '请选择图片文件', adjustPhoto: '请先调整照片', failedCrop: '裁剪图片失败', uploadOrSkip: '请上传头像或暂时跳过', failedSave: '保存头像失败'
  },
  ja: {
    cropProfilePhoto: 'プロフィール写真を切り抜く', cropHelp: 'ドラッグとズームで作者アバターに合わせてください。', closeCropEditor: '切り抜きエディターを閉じる', zoom: 'ズーム', cropTip: 'ヒント：画像内をドラッグして移動できます。スマートフォンでピンチ操作がうまく動かない場合はズームスライダーを使ってください。', cancel: 'キャンセル', saveCrop: '切り抜きを保存', goBack: '戻る', createAuthorPage: '作者ページを作成', createAuthorDescription: '公開用の執筆ページを作成します。表示名はどの言語でも使えます。', pageName: 'ページ名', pageNamePlaceholder: '公開する作者名を入力', pageUsername: 'ページユーザー名', usernameHelp: '英語のみ。文字、数字、アンダースコアを使用できます。ページ名は同じでも構いませんが、ユーザー名は一意である必要があります。', bioOptional: '自己紹介（任意）', bioPlaceholder: 'あなたの執筆について読者に伝えましょう', motto: '大きな一歩を踏み出し、可能性を解き放とう', creating: '作成中...', createPage: 'ページを作成', addProfilePhoto: 'プロフィール写真を追加', addProfileDescription: '作者ページをより信頼感のある見た目にします。今はスキップして後から追加できます。', authorProfilePreview: '作者プロフィールのプレビュー', uploadPhoto: '写真をアップロード', saving: '保存中...', savePhoto: '写真を保存', skipForNow: '今はスキップ', failedUploadImage: '画像のアップロードに失敗しました', failedCreate: '作者ページの作成に失敗しました', selectImage: '画像ファイルを選択してください', adjustPhoto: '先に写真を調整してください', failedCrop: '画像の切り抜きに失敗しました', uploadOrSkip: 'プロフィール写真をアップロードするか、今はスキップしてください', failedSave: 'プロフィール写真の保存に失敗しました'
  },
  ko: {
    cropProfilePhoto: '프로필 사진 자르기', cropHelp: '드래그하고 확대해 작가 아바타에 맞춰 주세요.', closeCropEditor: '자르기 편집기 닫기', zoom: '확대', cropTip: '팁: 이미지 안을 드래그해 이동하세요. 휴대폰에서 핀치가 잘 작동하지 않으면 확대 슬라이더를 사용하세요.', cancel: '취소', saveCrop: '자르기 저장', goBack: '뒤로', createAuthorPage: '작가 페이지 만들기', createAuthorDescription: '공개 작가 페이지를 만들어 보세요. 표시 이름은 어떤 언어든 사용할 수 있습니다.', pageName: '페이지 이름', pageNamePlaceholder: '공개 작가 이름 입력', pageUsername: '페이지 사용자 이름', usernameHelp: '영어만 사용할 수 있습니다. 문자, 숫자, 밑줄을 사용하세요. 페이지 이름은 같아도 되지만 사용자 이름은 고유해야 합니다.', bioOptional: '소개 (선택)', bioPlaceholder: '독자에게 당신의 글쓰기를 소개하세요', motto: '더 큰 가능성을 향해 나아가세요', creating: '만드는 중...', createPage: '페이지 만들기', addProfilePhoto: '프로필 사진 추가', addProfileDescription: '작가 페이지를 더 신뢰감 있게 보여 주세요. 지금 건너뛰고 나중에 추가할 수 있습니다.', authorProfilePreview: '작가 프로필 미리보기', uploadPhoto: '사진 업로드', saving: '저장 중...', savePhoto: '사진 저장', skipForNow: '지금은 건너뛰기', failedUploadImage: '이미지 업로드에 실패했습니다', failedCreate: '작가 페이지 만들기에 실패했습니다', selectImage: '이미지 파일을 선택해 주세요', adjustPhoto: '먼저 사진을 조정해 주세요', failedCrop: '이미지 자르기에 실패했습니다', uploadOrSkip: '프로필 사진을 업로드하거나 지금은 건너뛰어 주세요', failedSave: '프로필 사진 저장에 실패했습니다'
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function cleanUsername(value) {
  return String(value || '').replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    array[index] = binary.charCodeAt(index)
  }

  return new File([array], fileName, { type: mime })
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return imageSrc

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return canvas.toDataURL('image/jpeg', 0.92)
}

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('createAuthor.failedUploadImage'))
  }

  return data.image_url || data.imageUrl
}

function CropImageModal({
  open,
  image,
  crop,
  zoom,
  croppedAreaPixels,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] overflow-y-auto bg-black/50 px-4 pb-[150px] pt-4">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] items-start justify-center">
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{t('createAuthor.cropProfilePhoto')}</h2>
              <p className="mt-1 text-[11.5px] leading-4 text-[var(--shadow-text-tertiary)]">
                {t('createAuthor.cropHelp')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
              aria-label={t('createAuthor.closeCropEditor')}
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          <div className="relative mx-auto h-[min(78vw,360px)] max-h-[360px] min-h-[260px] w-full overflow-hidden rounded-[22px] bg-[#111827]">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              restrictPosition={false}
              objectFit="contain"
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[var(--shadow-text-secondary)]">
              <span>{t('createAuthor.zoom')}</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-full accent-[var(--shadow-text-primary)]"
            />
          </div>

          <div className="mt-3 rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            {t('createAuthor.cropTip')}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99]"
            >
              {t('createAuthor.cancel')}
            </button>
            <button
              type="button"
              onClick={() => onSave(croppedAreaPixels)}
              className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-surface)] active:scale-[0.99]"
            >
              {t('createAuthor.saveCrop')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateAuthorPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
  const [bio, setBio] = useState('')
  const [authorPage, setAuthorPage] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarCropped, setAvatarCropped] = useState('')
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [rawImage, setRawImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/authors/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page_name: pageName, page_username: pageUsername, bio }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('createAuthor.failedCreate'))
      }

      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      setAuthorPage(data.author_page)
      setStep(2)
    } catch (error) {
      setMessage(error.message || t('createAuthor.failedCreate'))
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage(t('createAuthor.selectImage'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      setRawImage(result)
      setAvatarPreview('')
      setAvatarCropped('')
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
      setCropModalOpen(true)
      setMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleSaveCrop = async (pixels) => {
    if (!rawImage || !pixels) {
      setMessage(t('createAuthor.adjustPhoto'))
      return
    }

    try {
      const cropped = await getCroppedImage(rawImage, pixels)
      setAvatarCropped(cropped)
      setAvatarPreview(cropped)
      setCropModalOpen(false)
    } catch {
      setMessage(t('createAuthor.failedCrop'))
    }
  }

  const handleSaveAvatar = async () => {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!avatarCropped) {
      setMessage(t('createAuthor.uploadOrSkip'))
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: avatarCropped,
        folder: 'author-profiles',
        fileName: `author-profile-${Date.now()}.jpg`,
      })

      const response = await fetch(`${API_BASE_URL}/api/authors/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_url: imageUrl }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('createAuthor.failedSave'))
      }

      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      navigate('/author/dashboard')
    } catch (error) {
      setMessage(error.message || t('createAuthor.failedSave'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] px-4 py-6 pb-[110px]">
      <CropImageModal
        open={cropModalOpen}
        image={rawImage}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onClose={() => setCropModalOpen(false)}
        onSave={handleSaveCrop}
      />

      <div className="mx-auto max-w-[520px]">
        <button
          type="button"
          onClick={() => (step === 2 ? setStep(1) : navigate('/event'))}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-95"
          aria-label={t('createAuthor.goBack')}
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] px-5 py-7 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className={`h-2.5 w-10 rounded-full ${step === 1 ? 'bg-[var(--shadow-text-primary)]' : 'bg-[var(--shadow-bg-soft)]'}`} />
            <div className={`h-2.5 w-10 rounded-full ${step === 2 ? 'bg-[var(--shadow-text-primary)]' : 'bg-[var(--shadow-bg-soft)]'}`} />
          </div>

          {step === 1 ? (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]">
                  <i className="fas fa-pen-nib text-[24px]" />
                </div>
                <h1 className="text-[24px] font-extrabold text-[var(--shadow-text-primary)]">{t('createAuthor.createAuthorPage')}</h1>
                <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[var(--shadow-text-tertiary)]">
                  {t('createAuthor.createAuthorDescription')}
                </p>
              </div>

              {message ? (
                <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
                  {message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6">
                <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('createAuthor.pageName')}</label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(event) => setPageName(event.target.value)}
                  placeholder={t('createAuthor.pageNamePlaceholder')}
                  className="mb-4 h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none transition focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)]"
                />

                <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('createAuthor.pageUsername')}</label>
                <div className="mb-2 flex h-12 w-full items-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 transition focus-within:border-[var(--shadow-border-strong)] focus-within:bg-[var(--shadow-bg-surface)]">
                  <span className="mr-1 text-[14px] font-bold text-[var(--shadow-text-tertiary)]">@</span>
                  <input
                    type="text"
                    value={pageUsername}
                    onChange={(event) => setPageUsername(cleanUsername(event.target.value))}
                    placeholder="your_author_username"
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--shadow-text-primary)] outline-none"
                  />
                </div>

                <p className="mb-4 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">
                  {t('createAuthor.usernameHelp')}
                </p>

                <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{t('createAuthor.bioOptional')}</label>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder={t('createAuthor.bioPlaceholder')}
                  rows={3}
                  className="mb-5 w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[14px] text-[var(--shadow-text-primary)] outline-none transition focus:border-[var(--shadow-border-strong)] focus:bg-[var(--shadow-bg-surface)]"
                />

                <p className="mb-5 text-center text-[12px] font-medium text-[var(--shadow-text-secondary)]">
                  {t('createAuthor.motto')}
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="mx-auto flex h-12 w-full items-center justify-center rounded-[14px] bg-[var(--shadow-text-primary)] px-6 text-[14px] font-bold text-[var(--shadow-bg-surface)] shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? t('createAuthor.creating') : t('createAuthor.createPage')}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={t('createAuthor.authorProfilePreview')} className="h-full w-full object-cover" />
                  ) : (
                    <i className="fa-solid fa-user-pen text-[26px]" />
                  )}
                </div>
                <h1 className="text-[24px] font-extrabold text-[var(--shadow-text-primary)]">{t('createAuthor.addProfilePhoto')}</h1>
                <p className="mx-auto mt-2 max-w-[330px] text-[12px] leading-5 text-[var(--shadow-text-tertiary)]">
                  {t('createAuthor.addProfileDescription')}
                </p>
                {authorPage?.page_username ? (
                  <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-secondary)]">@{authorPage.page_username}</div>
                ) : null}
              </div>

              {message ? (
                <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
                  {message}
                </div>
              ) : null}

              <div className="mt-6">
                <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      handleFileChange(event)
                      event.target.value = ''
                    }}
                    className="hidden"
                  />
                  <i className="fa-solid fa-image mr-2 text-[14px]" />
                  {t('createAuthor.uploadPhoto')}
                </label>

                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={loading || !avatarCropped}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-[14px] bg-[var(--shadow-text-primary)] px-6 text-[14px] font-bold text-[var(--shadow-bg-surface)] shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? t('createAuthor.saving') : t('createAuthor.savePhoto')}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/author/dashboard')}
                  disabled={loading}
                  className="mt-3 flex h-12 w-full items-center justify-center rounded-[14px] bg-[var(--shadow-bg-surface)] px-6 text-[14px] font-extrabold text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] transition active:scale-[0.99] disabled:opacity-60"
                >
                  {t('createAuthor.skipForNow')}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

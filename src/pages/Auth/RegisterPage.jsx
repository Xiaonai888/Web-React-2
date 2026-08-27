import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TurnstileBox from '../../components/TurnstileBox'
import Cropper from 'react-easy-crop'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('registerPage', {
  en: {
    uploadImageFailed: 'Failed to upload image',
    profilePreview: 'Profile preview',
    addProfilePhoto: 'Add Profile Photo',
    profilePhotoSubtitle: 'Make your reader profile feel real. You can skip this and add it later.',
    zoom: 'Zoom',
    saveCrop: 'Save Crop',
    uploadPhoto: 'Upload Photo',
    saving: 'Saving...',
    savePhoto: 'Save Photo',
    skipNow: 'Skip for now',
    selectImageFile: 'Please select an image file',
    adjustPhotoFirst: 'Please adjust the photo first',
    cropPhotoFailed: 'Failed to crop photo',
    agreeTermsRequired: 'Please agree to the Terms & Policies.',
    securityRequired: 'Please complete the security check.',
    createAccountFailed: 'Failed to create account',
    uploadCropFirst: 'Please upload and crop a profile photo first',
    saveProfilePhotoFailed: 'Failed to save profile photo',
    goBack: 'Go back',
    createAccount: 'Create Account',
    createSubtitle: 'Sign up to save reading progress, comments, and author tools.',
    name: 'Name',
    yourName: 'Your name',
    username: 'Username',
    dateOfBirth: 'Date of Birth',
    day: 'Day',
    month: 'Month',
    year: 'Year',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    gender: 'Gender',
    female: 'Female',
    male: 'Male',
    custom: 'Custom',
    selectCustomGender: 'Select custom gender',
    nonBinary: 'Non-binary',
    preferNotToSay: 'Prefer not to say',
    other: 'Other',
    email: 'Email',
    emailAddress: 'Email address',
    password: 'Password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm password',
    agreeTo: 'I agree to the',
    termsPolicies: 'Terms & Policies',
    creating: 'Creating...',
    signUp: 'Sign Up',
    alreadyAccount: 'Already have an account?',
    login: 'Login',
  },
  km: {
    uploadImageFailed: 'មិនអាច Upload រូបភាពបានទេ',
    profilePreview: 'មើលរូបប្រវត្តិរូបជាមុន',
    addProfilePhoto: 'បន្ថែមរូបប្រវត្តិរូប',
    profilePhotoSubtitle: 'បន្ថែមរូបដើម្បីឱ្យប្រវត្តិរូបអ្នកអានរបស់អ្នកកាន់តែពេញលេញ។ អ្នកអាចរំលង ហើយបន្ថែមពេលក្រោយបាន។',
    zoom: 'ពង្រីក',
    saveCrop: 'រក្សាទុកការកាត់រូប',
    uploadPhoto: 'Upload រូប',
    saving: 'កំពុងរក្សាទុក...',
    savePhoto: 'រក្សាទុករូប',
    skipNow: 'រំលងសិន',
    selectImageFile: 'សូមជ្រើសឯកសាររូបភាព',
    adjustPhotoFirst: 'សូមកែតម្រូវរូបជាមុនសិន',
    cropPhotoFailed: 'មិនអាចកាត់រូបបានទេ',
    agreeTermsRequired: 'សូមយល់ព្រមនឹងលក្ខខណ្ឌ និងគោលការណ៍។',
    securityRequired: 'សូមបំពេញការត្រួតពិនិត្យសុវត្ថិភាព។',
    createAccountFailed: 'មិនអាចបង្កើតគណនីបានទេ',
    uploadCropFirst: 'សូម Upload និងកាត់រូបប្រវត្តិរូបជាមុនសិន',
    saveProfilePhotoFailed: 'មិនអាចរក្សាទុករូបប្រវត្តិរូបបានទេ',
    goBack: 'ត្រឡប់ក្រោយ',
    createAccount: 'បង្កើតគណនី',
    createSubtitle: 'ចុះឈ្មោះដើម្បីរក្សាទុកវឌ្ឍនភាពអាន Comment និងឧបករណ៍អ្នកនិពន្ធ។',
    name: 'ឈ្មោះ',
    yourName: 'ឈ្មោះរបស់អ្នក',
    username: 'Username',
    dateOfBirth: 'ថ្ងៃខែឆ្នាំកំណើត',
    day: 'ថ្ងៃ',
    month: 'ខែ',
    year: 'ឆ្នាំ',
    january: 'មករា',
    february: 'កុម្ភៈ',
    march: 'មីនា',
    april: 'មេសា',
    may: 'ឧសភា',
    june: 'មិថុនា',
    july: 'កក្កដា',
    august: 'សីហា',
    september: 'កញ្ញា',
    october: 'តុលា',
    november: 'វិច្ឆិកា',
    december: 'ធ្នូ',
    gender: 'ភេទ',
    female: 'ស្រី',
    male: 'ប្រុស',
    custom: 'ផ្សេងទៀត',
    selectCustomGender: 'ជ្រើសភេទ',
    nonBinary: 'Non-binary',
    preferNotToSay: 'មិនចង់បញ្ជាក់',
    other: 'ផ្សេងទៀត',
    email: 'អ៊ីមែល',
    emailAddress: 'អាសយដ្ឋានអ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    hidePassword: 'លាក់ពាក្យសម្ងាត់',
    showPassword: 'បង្ហាញពាក្យសម្ងាត់',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
    confirmPasswordPlaceholder: 'បញ្ជាក់ពាក្យសម្ងាត់',
    agreeTo: 'ខ្ញុំយល់ព្រមនឹង',
    termsPolicies: 'លក្ខខណ្ឌ និងគោលការណ៍',
    creating: 'កំពុងបង្កើត...',
    signUp: 'ចុះឈ្មោះ',
    alreadyAccount: 'មានគណនីរួចហើយ?',
    login: 'ចូលគណនី',
  },
  zh: {
    uploadImageFailed: '无法上传图片',
    profilePreview: '个人头像预览',
    addProfilePhoto: '添加个人头像',
    profilePhotoSubtitle: '让你的读者资料更完整。你可以跳过此步骤，稍后再添加。',
    zoom: '缩放',
    saveCrop: '保存裁剪',
    uploadPhoto: '上传照片',
    saving: '保存中...',
    savePhoto: '保存照片',
    skipNow: '暂时跳过',
    selectImageFile: '请选择图片文件',
    adjustPhotoFirst: '请先调整照片',
    cropPhotoFailed: '无法裁剪照片',
    agreeTermsRequired: '请同意条款与政策。',
    securityRequired: '请完成安全验证。',
    createAccountFailed: '无法创建账号',
    uploadCropFirst: '请先上传并裁剪个人头像',
    saveProfilePhotoFailed: '无法保存个人头像',
    goBack: '返回',
    createAccount: '创建账号',
    createSubtitle: '注册以保存阅读进度、评论并使用作者工具。',
    name: '姓名',
    yourName: '你的姓名',
    username: '用户名',
    dateOfBirth: '出生日期',
    day: '日',
    month: '月',
    year: '年',
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    may: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月',
    gender: '性别',
    female: '女',
    male: '男',
    custom: '自定义',
    selectCustomGender: '选择自定义性别',
    nonBinary: '非二元性别',
    preferNotToSay: '不愿透露',
    other: '其他',
    email: '邮箱',
    emailAddress: '邮箱地址',
    password: '密码',
    hidePassword: '隐藏密码',
    showPassword: '显示密码',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '确认密码',
    agreeTo: '我同意',
    termsPolicies: '条款与政策',
    creating: '创建中...',
    signUp: '注册',
    alreadyAccount: '已经有账号？',
    login: '登录',
  },
  ja: {
    uploadImageFailed: '画像をアップロードできませんでした',
    profilePreview: 'プロフィール画像のプレビュー',
    addProfilePhoto: 'プロフィール写真を追加',
    profilePhotoSubtitle: '読者プロフィールをより充実させましょう。この手順はスキップして後から追加できます。',
    zoom: 'ズーム',
    saveCrop: '切り抜きを保存',
    uploadPhoto: '写真をアップロード',
    saving: '保存中...',
    savePhoto: '写真を保存',
    skipNow: '今はスキップ',
    selectImageFile: '画像ファイルを選択してください',
    adjustPhotoFirst: '先に写真を調整してください',
    cropPhotoFailed: '写真を切り抜けませんでした',
    agreeTermsRequired: '利用規約とポリシーに同意してください。',
    securityRequired: 'セキュリティ確認を完了してください。',
    createAccountFailed: 'アカウントを作成できませんでした',
    uploadCropFirst: '先にプロフィール写真をアップロードして切り抜いてください',
    saveProfilePhotoFailed: 'プロフィール写真を保存できませんでした',
    goBack: '戻る',
    createAccount: 'アカウント作成',
    createSubtitle: '登録して読書の進捗、コメント、作者向けツールを利用しましょう。',
    name: '名前',
    yourName: 'あなたの名前',
    username: 'ユーザー名',
    dateOfBirth: '生年月日',
    day: '日',
    month: '月',
    year: '年',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月',
    gender: '性別',
    female: '女性',
    male: '男性',
    custom: 'カスタム',
    selectCustomGender: '性別を選択',
    nonBinary: 'ノンバイナリー',
    preferNotToSay: '回答しない',
    other: 'その他',
    email: 'メールアドレス',
    emailAddress: 'メールアドレス',
    password: 'パスワード',
    hidePassword: 'パスワードを隠す',
    showPassword: 'パスワードを表示',
    confirmPassword: 'パスワード確認',
    confirmPasswordPlaceholder: 'パスワードを確認',
    agreeTo: '以下に同意します：',
    termsPolicies: '利用規約とポリシー',
    creating: '作成中...',
    signUp: '登録',
    alreadyAccount: 'すでにアカウントをお持ちですか？',
    login: 'ログイン',
  },
  ko: {
    uploadImageFailed: '이미지를 업로드하지 못했습니다',
    profilePreview: '프로필 사진 미리보기',
    addProfilePhoto: '프로필 사진 추가',
    profilePhotoSubtitle: '독자 프로필을 더 완성해 보세요. 지금 건너뛰고 나중에 추가할 수 있습니다.',
    zoom: '확대',
    saveCrop: '자르기 저장',
    uploadPhoto: '사진 업로드',
    saving: '저장 중...',
    savePhoto: '사진 저장',
    skipNow: '지금은 건너뛰기',
    selectImageFile: '이미지 파일을 선택해 주세요',
    adjustPhotoFirst: '먼저 사진을 조정해 주세요',
    cropPhotoFailed: '사진을 자르지 못했습니다',
    agreeTermsRequired: '이용약관 및 정책에 동의해 주세요.',
    securityRequired: '보안 확인을 완료해 주세요.',
    createAccountFailed: '계정을 만들지 못했습니다',
    uploadCropFirst: '먼저 프로필 사진을 업로드하고 잘라 주세요',
    saveProfilePhotoFailed: '프로필 사진을 저장하지 못했습니다',
    goBack: '뒤로 가기',
    createAccount: '계정 만들기',
    createSubtitle: '가입하여 읽기 진행 상황, 댓글 및 작가 도구를 저장하세요.',
    name: '이름',
    yourName: '이름',
    username: '사용자 이름',
    dateOfBirth: '생년월일',
    day: '일',
    month: '월',
    year: '년',
    january: '1월',
    february: '2월',
    march: '3월',
    april: '4월',
    may: '5월',
    june: '6월',
    july: '7월',
    august: '8월',
    september: '9월',
    october: '10월',
    november: '11월',
    december: '12월',
    gender: '성별',
    female: '여성',
    male: '남성',
    custom: '직접 선택',
    selectCustomGender: '성별 선택',
    nonBinary: '논바이너리',
    preferNotToSay: '밝히지 않음',
    other: '기타',
    email: '이메일',
    emailAddress: '이메일 주소',
    password: '비밀번호',
    hidePassword: '비밀번호 숨기기',
    showPassword: '비밀번호 표시',
    confirmPassword: '비밀번호 확인',
    confirmPasswordPlaceholder: '비밀번호 확인',
    agreeTo: '다음에 동의합니다:',
    termsPolicies: '이용약관 및 정책',
    creating: '생성 중...',
    signUp: '회원가입',
    alreadyAccount: '이미 계정이 있으신가요?',
    login: '로그인',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

const days = Array.from({ length: 31 }, (_, index) => index + 1)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, index) => currentYear - index)

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

async function uploadImageToStorage({
  token,
  imageDataUrl,
  folder,
  fileName,
  fallbackError,
}) {
  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || fallbackError || 'Failed to upload image'
    )
  }

  return data.image_url || data.imageUrl
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

function AddProfileStep({
  name,
  avatarPreview,
  rawAvatarImage,
  crop,
  zoom,
  croppedAreaPixels,
  loading,
  message,
  onFileChange,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onSaveCrop,
  onSavePhoto,
  onSkip,
}) {
  const { t } = useDisplayTranslation()
  const avatarLetter = (name || 'R').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 py-6 pb-[120px]">
      <div className="mx-auto max-w-[430px]">
        <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="h-2.5 w-10 rounded-full bg-[#d0d5dd]" />
            <div className="h-2.5 w-10 rounded-full bg-[#111827]" />
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-[106px] w-[106px] items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[40px] font-extrabold text-white ring-2 ring-[#f6b800]">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={t('registerPage.profilePreview')}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <h1 className="text-[24px] font-extrabold tracking-tight text-[#111827]">
              {t('registerPage.addProfilePhoto')}
            </h1>

            <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-5 text-[#8d94a1]">
              {t('registerPage.profilePhotoSubtitle')}
            </p>
          </div>

          {message ? (
            <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          {rawAvatarImage ? (
            <div className="mt-6">
              <div className="relative mx-auto h-[min(78vw,360px)] max-h-[360px] min-h-[260px] w-full overflow-hidden rounded-[22px] bg-[#111827]">
                <Cropper
                  image={rawAvatarImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  restrictPosition={false}
                  objectFit="contain"
                />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[#555b66]">
                  <span>{t('registerPage.zoom')}</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(event) => onZoomChange(Number(event.target.value))}
                  className="w-full accent-[#111827]"
                />
              </div>

              <button
                type="button"
                onClick={() => onSaveCrop(croppedAreaPixels)}
                className="mt-4 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]"
              >
                {t('registerPage.saveCrop')}
              </button>
            </div>
          ) : null}

          <label className="mt-5 flex h-12 cursor-pointer items-center justify-center rounded-full border border-[#d0d5dd] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]">
            <i className="fa-regular fa-image mr-2 text-[14px]" />
            {t('registerPage.uploadPhoto')}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                onFileChange(event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>

          <button
            type="button"
            onClick={onSavePhoto}
            disabled={loading || !avatarPreview}
            className="mt-4 h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
          >
            {loading
              ? t('registerPage.saving')
              : t('registerPage.savePhoto')}
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="mt-3 h-12 w-full rounded-[16px] border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] active:scale-[0.99] disabled:opacity-60"
          >
            {t('registerPage.skipNow')}
          </button>
        </section>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  const [step, setStep] = useState(1)
  const [createdToken, setCreatedToken] = useState('')
  const [createdUser, setCreatedUser] = useState(null)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [customGender, setCustomGender] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [rawAvatarImage, setRawAvatarImage] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarMessage, setAvatarMessage] = useState('')

  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileRefreshKey, setTurnstileRefreshKey] = useState(0)

  const getDateOfBirth = () => {
    if (!birthDay || !birthMonth || !birthYear) return ''

    const monthIndex = months.indexOf(birthMonth) + 1
    const month = String(monthIndex).padStart(2, '0')
    const day = String(birthDay).padStart(2, '0')

    return `${birthYear}-${month}-${day}`
  }

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleAvatarFileChange = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarMessage(t('registerPage.selectImageFile'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setRawAvatarImage(String(reader.result || ''))
      setAvatarPreview('')
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
      setAvatarMessage('')
    }

    reader.readAsDataURL(file)
  }

  const handleSaveAvatarCrop = async (pixels) => {
    if (!rawAvatarImage || !pixels) {
      setAvatarMessage(t('registerPage.adjustPhotoFirst'))
      return
    }

    try {
      const cropped = await getCroppedImage(rawAvatarImage, pixels)
      setAvatarPreview(cropped)
      setRawAvatarImage('')
      setAvatarMessage('')
    } catch {
      setAvatarMessage(t('registerPage.cropPhotoFailed'))
    }
  }

  const saveLogin = (token, user) => {
    localStorage.setItem('shadow_reader_token', token)
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!acceptedTerms) {
      setMessage(t('registerPage.agreeTermsRequired'))
      return
    }

    if (!turnstileToken) {
      setMessage(t('registerPage.securityRequired'))
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          confirmPassword,
          date_of_birth: getDateOfBirth(),
          gender,
          custom_gender: gender === 'custom' ? customGender : null,
          turnstileToken,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('registerPage.createAccountFailed')
        )
      }

      saveLogin(data.token, data.user)
      setCreatedToken(data.token)
      setCreatedUser(data.user)
      setStep(2)
    } catch (error) {
      setTurnstileToken('')
      setTurnstileRefreshKey((value) => value + 1)
      setMessage(
        error.message || t('registerPage.createAccountFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSavePhoto = async () => {
    const token =
      createdToken || localStorage.getItem('shadow_reader_token')
    const user = createdUser

    if (!token) {
      navigate('/login')
      return
    }

    if (!avatarPreview) {
      setAvatarMessage(t('registerPage.uploadCropFirst'))
      return
    }

    try {
      setLoading(true)
      setAvatarMessage('')

      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: avatarPreview,
        folder: 'reader-profiles',
        fileName: `reader-profile-${Date.now()}.jpg`,
        fallbackError: t('registerPage.uploadImageFailed'),
      })

      const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar_url: imageUrl,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('registerPage.saveProfilePhotoFailed')
        )
      }

      saveLogin(token, data.user)
      navigate('/me')
    } catch (error) {
      setAvatarMessage(
        error.message || t('registerPage.saveProfilePhotoFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSkipPhoto = () => {
    navigate('/me')
  }

  if (step === 2) {
    return (
      <AddProfileStep
        name={createdUser?.name || name}
        avatarPreview={avatarPreview}
        rawAvatarImage={rawAvatarImage}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        loading={loading}
        message={avatarMessage}
        onFileChange={handleAvatarFileChange}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onSaveCrop={handleSaveAvatarCrop}
        onSavePhoto={handleSavePhoto}
        onSkip={handleSkipPhoto}
      />
    )
  }

  const genderOptions = [
    { value: 'female', label: t('registerPage.female') },
    { value: 'male', label: t('registerPage.male') },
    { value: 'custom', label: t('registerPage.custom') },
  ]

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 py-6">
      <div className="mx-auto max-w-[430px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 transition hover:-translate-x-0.5 hover:bg-[#f7f7fb] active:scale-95"
          aria-label={t('registerPage.goBack')}
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="h-2.5 w-10 rounded-full bg-[#111827]" />
            <div className="h-2.5 w-10 rounded-full bg-[#d0d5dd]" />
          </div>

          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-white shadow-[0_14px_28px_rgba(17,24,39,0.18)]">
              <i className="fas fa-book-open text-[24px]" />
            </div>

            <h1 className="text-[26px] font-extrabold tracking-tight text-[#111827]">
              {t('registerPage.createAccount')}
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#8d94a1]">
              {t('registerPage.createSubtitle')}
            </p>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.name')}
            </label>
            <input
              type="text"
              placeholder={t('registerPage.yourName')}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.username')}
            </label>
            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.dateOfBirth')}
            </label>
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  value={birthDay}
                  onChange={(event) => setBirthDay(event.target.value)}
                  className={
                    'h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ' +
                    (birthDay ? 'text-[#111827]' : 'text-transparent')
                  }
                >
                  <option value="" disabled></option>
                  {days.map((day) => (
                    <option key={day} value={day} className="text-[#111827]">
                      {day}
                    </option>
                  ))}
                </select>

                <span
                  className={
                    'pointer-events-none absolute left-3 text-[#8d94a1] transition-all ' +
                    (birthDay ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]')
                  }
                >
                  {t('registerPage.day')}
                </span>

                <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
              </div>

              <div className="relative">
                <select
                  value={birthMonth}
                  onChange={(event) => setBirthMonth(event.target.value)}
                  className={
                    'h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ' +
                    (birthMonth ? 'text-[#111827]' : 'text-transparent')
                  }
                >
                  <option value="" disabled></option>
                  {months.map((month) => (
                    <option key={month} value={month} className="text-[#111827]">
                      {t(`registerPage.${month.toLowerCase()}`)}
                    </option>
                  ))}
                </select>

                <span
                  className={
                    'pointer-events-none absolute left-3 text-[#8d94a1] transition-all ' +
                    (birthMonth ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]')
                  }
                >
                  {t('registerPage.month')}
                </span>

                <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
              </div>

              <div className="relative">
                <select
                  value={birthYear}
                  onChange={(event) => setBirthYear(event.target.value)}
                  className={
                    'h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ' +
                    (birthYear ? 'text-[#111827]' : 'text-transparent')
                  }
                >
                  <option value="" disabled></option>
                  {years.map((year) => (
                    <option key={year} value={year} className="text-[#111827]">
                      {year}
                    </option>
                  ))}
                </select>

                <span
                  className={
                    'pointer-events-none absolute left-3 text-[#8d94a1] transition-all ' +
                    (birthYear ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]')
                  }
                >
                  {t('registerPage.year')}
                </span>

                <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
              </div>
            </div>

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.gender')}
            </label>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {genderOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setGender(item.value)
                    if (item.value !== 'custom') setCustomGender('')
                  }}
                  className={`flex h-11 items-center justify-between rounded-[14px] border px-3 text-left text-[13px] font-semibold transition active:scale-[0.99] ${
                    gender === item.value
                      ? 'border-[#111827] bg-[#111827] text-white'
                      : 'border-[#e5e7eb] bg-[#fafafe] text-[#111827]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      gender === item.value
                        ? 'border-white'
                        : 'border-[#b9bec8]'
                    }`}
                  >
                    {gender === item.value ? (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>

            {gender === 'custom' ? (
              <select
                value={customGender}
                onChange={(event) => setCustomGender(event.target.value)}
                className="mb-4 h-11 w-full rounded-[14px] border border-[#e5e7eb] bg-[#fafefe] px-3 text-[13px] font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white"
              >
                <option value="">
                  {t('registerPage.selectCustomGender')}
                </option>
                <option value="non_binary">
                  {t('registerPage.nonBinary')}
                </option>
                <option value="prefer_not_to_say">
                  {t('registerPage.preferNotToSay')}
                </option>
                <option value="other">
                  {t('registerPage.other')}
                </option>
              </select>
            ) : (
              <div className="mb-4" />
            )}

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.email')}
            </label>
            <input
              type="email"
              placeholder={t('registerPage.emailAddress')}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.password')}
            </label>
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('registerPage.password')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1] transition hover:bg-[#f0f1f5] hover:text-[#111827] active:scale-95"
                aria-label={
                  showPassword
                    ? t('registerPage.hidePassword')
                    : t('registerPage.showPassword')
                }
              >
                <i
                  className={`${
                    showPassword ? 'far fa-eye-slash' : 'far fa-eye'
                  } text-[15px]`}
                />
              </button>
            </div>

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              {t('registerPage.confirmPassword')}
            </label>
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('registerPage.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1] transition hover:bg-[#f0f1f5] hover:text-[#111827] active:scale-95"
                aria-label={
                  showConfirmPassword
                    ? t('registerPage.hidePassword')
                    : t('registerPage.showPassword')
                }
              >
                <i
                  className={`${
                    showConfirmPassword ? 'far fa-eye-slash' : 'far fa-eye'
                  } text-[15px]`}
                />
              </button>
            </div>

            <div className="mb-4">
              <TurnstileBox
                siteKey={TURNSTILE_SITE_KEY}
                refreshKey={turnstileRefreshKey}
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken('')}
                onError={() => setTurnstileToken('')}
              />
            </div>

            <label className="mb-5 flex items-start gap-2 text-[12px] leading-5 text-[#8d94a1]">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#d1d5db] accent-[#111827]"
              />
              <span>
                {t('registerPage.agreeTo')}{' '}
                <Link
                  to="/terms"
                  className="font-extrabold text-[#111827] transition hover:text-[#f6b800]"
                >
                  {t('registerPage.termsPolicies')}
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b2233] hover:shadow-[0_18px_34px_rgba(17,24,39,0.24)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? t('registerPage.creating')
                : t('registerPage.signUp')}
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#8d94a1]">
            {t('registerPage.alreadyAccount')}{' '}
            <Link
              to="/login"
              className="font-extrabold text-[#111827] transition hover:text-[#f6b800]"
            >
              {t('registerPage.login')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

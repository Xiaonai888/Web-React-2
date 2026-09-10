import { useEffect, useRef, useState } from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatStoryCharacterProfile', {
  "en": {
    "mainCharacters": "Main Characters",
    "majorSupportingCharacters": "Major Supporting Characters",
    "minorSupportingCharacters": "Minor Supporting Characters",
    "backgroundCharacters": "Background Characters",
    "female": "Female",
    "male": "Male",
    "nonBinary": "Non-binary",
    "unknown": "Unknown",
    "notSpecified": "Not specified",
    "failedUploadProfileImage": "Failed to upload profile image",
    "dragDownToClose": "Drag down to close",
    "chooseCharacterGroup": "Choose character group",
    "chooseGender": "Choose gender",
    "failedLoadCharacterProfile": "Failed to load character profile",
    "chooseImageFile": "Please choose an image file.",
    "profileImageTooLarge": "Profile image must be 2 MB or smaller.",
    "enterCharacterNameRequired": "Please enter a character name.",
    "failedSaveCharacterProfile": "Failed to save character profile",
    "goBack": "Go back",
    "characterProfile": "Character Profile",
    "saving": "Saving...",
    "save": "Save",
    "loadingProfile": "Loading profile...",
    "replaceProfileImage": "Replace profile image",
    "name": "Name",
    "characterGroup": "Character Group",
    "gender": "Gender",
    "birthday": "Birthday",
    "height": "Height",
    "roleOccupation": "Role / Occupation",
    "enterCharacterName": "Enter character name",
    "enterHeight": "Enter height",
    "occupationExample": "Example: CEO, Student, Doctor",
    "personality": "Personality",
    "personalityExample": "Example: Calm, jealous, loyal, shy",
    "relationship": "Relationship",
    "relationshipExample": "Example: Love interest, rival, sister, best friend",
    "bio": "Bio",
    "bioPlaceholder": "Write the character background, goals, secrets or important details..."
  },
  "km": {
    "mainCharacters": "តួអង្គសំខាន់",
    "majorSupportingCharacters": "តួអង្គរងសំខាន់",
    "minorSupportingCharacters": "តួអង្គរង",
    "backgroundCharacters": "តួអង្គផ្ទៃខាងក្រោយ",
    "female": "ស្រី",
    "male": "ប្រុស",
    "nonBinary": "មិនកំណត់ជាប្រុសឬស្រី",
    "unknown": "មិនស្គាល់",
    "notSpecified": "មិនបានកំណត់",
    "failedUploadProfileImage": "មិនអាច Upload រូប Profile បានទេ",
    "dragDownToClose": "អូសចុះក្រោមដើម្បីបិទ",
    "chooseCharacterGroup": "ជ្រើសក្រុមតួអង្គ",
    "chooseGender": "ជ្រើសភេទ",
    "failedLoadCharacterProfile": "មិនអាចផ្ទុក Profile តួអង្គបានទេ",
    "chooseImageFile": "សូមជ្រើសឯកសាររូបភាព។",
    "profileImageTooLarge": "រូប Profile ត្រូវមានទំហំ 2 MB ឬតូចជាងនេះ។",
    "enterCharacterNameRequired": "សូមបញ្ចូលឈ្មោះតួអង្គ។",
    "failedSaveCharacterProfile": "មិនអាចរក្សាទុក Profile តួអង្គបានទេ",
    "goBack": "ត្រឡប់ក្រោយ",
    "characterProfile": "Profile តួអង្គ",
    "saving": "កំពុងរក្សាទុក...",
    "save": "រក្សាទុក",
    "loadingProfile": "កំពុងផ្ទុក Profile...",
    "replaceProfileImage": "ប្តូររូប Profile",
    "name": "ឈ្មោះ",
    "characterGroup": "ក្រុមតួអង្គ",
    "gender": "ភេទ",
    "birthday": "ថ្ងៃកំណើត",
    "height": "កម្ពស់",
    "roleOccupation": "តួនាទី / មុខរបរ",
    "enterCharacterName": "បញ្ចូលឈ្មោះតួអង្គ",
    "enterHeight": "បញ្ចូលកម្ពស់",
    "occupationExample": "ឧទាហរណ៍៖ CEO, សិស្ស, ពេទ្យ",
    "personality": "បុគ្គលិកលក្ខណៈ",
    "personalityExample": "ឧទាហរណ៍៖ ស្ងប់ស្ងាត់, ប្រច័ណ្ឌ, ស្មោះត្រង់, អៀន",
    "relationship": "ទំនាក់ទំនង",
    "relationshipExample": "ឧទាហរណ៍៖ គូស្នេហ៍, គូប្រជែង, បងប្អូនស្រី, មិត្តជិតស្និទ្ធ",
    "bio": "ប្រវត្តិរូប",
    "bioPlaceholder": "សរសេរប្រវត្តិ គោលដៅ អាថ៌កំបាំង ឬព័ត៌មានសំខាន់របស់តួអង្គ..."
  },
  "zh": {
    "mainCharacters": "主要角色",
    "majorSupportingCharacters": "重要配角",
    "minorSupportingCharacters": "次要配角",
    "backgroundCharacters": "背景角色",
    "female": "女性",
    "male": "男性",
    "nonBinary": "非二元性别",
    "unknown": "未知",
    "notSpecified": "未指定",
    "failedUploadProfileImage": "无法上传角色头像",
    "dragDownToClose": "向下拖动以关闭",
    "chooseCharacterGroup": "选择角色分组",
    "chooseGender": "选择性别",
    "failedLoadCharacterProfile": "无法加载角色资料",
    "chooseImageFile": "请选择图片文件。",
    "profileImageTooLarge": "头像必须小于或等于 2 MB。",
    "enterCharacterNameRequired": "请输入角色名称。",
    "failedSaveCharacterProfile": "无法保存角色资料",
    "goBack": "返回",
    "characterProfile": "角色资料",
    "saving": "保存中...",
    "save": "保存",
    "loadingProfile": "正在加载资料...",
    "replaceProfileImage": "更换头像",
    "name": "名称",
    "characterGroup": "角色分组",
    "gender": "性别",
    "birthday": "生日",
    "height": "身高",
    "roleOccupation": "角色 / 职业",
    "enterCharacterName": "输入角色名称",
    "enterHeight": "输入身高",
    "occupationExample": "例如：CEO、学生、医生",
    "personality": "性格",
    "personalityExample": "例如：冷静、嫉妒、忠诚、害羞",
    "relationship": "关系",
    "relationshipExample": "例如：恋人、对手、姐妹、好友",
    "bio": "简介",
    "bioPlaceholder": "填写角色背景、目标、秘密或重要信息..."
  },
  "ja": {
    "mainCharacters": "メインキャラクター",
    "majorSupportingCharacters": "主要サポートキャラクター",
    "minorSupportingCharacters": "サポートキャラクター",
    "backgroundCharacters": "背景キャラクター",
    "female": "女性",
    "male": "男性",
    "nonBinary": "ノンバイナリー",
    "unknown": "不明",
    "notSpecified": "未指定",
    "failedUploadProfileImage": "プロフィール画像をアップロードできませんでした",
    "dragDownToClose": "下にドラッグして閉じる",
    "chooseCharacterGroup": "キャラクターグループを選択",
    "chooseGender": "性別を選択",
    "failedLoadCharacterProfile": "キャラクタープロフィールを読み込めませんでした",
    "chooseImageFile": "画像ファイルを選択してください。",
    "profileImageTooLarge": "プロフィール画像は 2 MB 以下にしてください。",
    "enterCharacterNameRequired": "キャラクター名を入力してください。",
    "failedSaveCharacterProfile": "キャラクタープロフィールを保存できませんでした",
    "goBack": "戻る",
    "characterProfile": "キャラクタープロフィール",
    "saving": "保存中...",
    "save": "保存",
    "loadingProfile": "プロフィールを読み込み中...",
    "replaceProfileImage": "プロフィール画像を変更",
    "name": "名前",
    "characterGroup": "キャラクターグループ",
    "gender": "性別",
    "birthday": "誕生日",
    "height": "身長",
    "roleOccupation": "役割 / 職業",
    "enterCharacterName": "キャラクター名を入力",
    "enterHeight": "身長を入力",
    "occupationExample": "例：CEO、学生、医師",
    "personality": "性格",
    "personalityExample": "例：冷静、嫉妬深い、忠実、内気",
    "relationship": "関係",
    "relationshipExample": "例：恋愛相手、ライバル、姉妹、親友",
    "bio": "プロフィール",
    "bioPlaceholder": "キャラクターの背景、目標、秘密、重要な情報を入力..."
  },
  "ko": {
    "mainCharacters": "주요 캐릭터",
    "majorSupportingCharacters": "주요 조연 캐릭터",
    "minorSupportingCharacters": "조연 캐릭터",
    "backgroundCharacters": "배경 캐릭터",
    "female": "여성",
    "male": "남성",
    "nonBinary": "논바이너리",
    "unknown": "알 수 없음",
    "notSpecified": "지정 안 함",
    "failedUploadProfileImage": "프로필 이미지를 업로드하지 못했습니다",
    "dragDownToClose": "아래로 드래그하여 닫기",
    "chooseCharacterGroup": "캐릭터 그룹 선택",
    "chooseGender": "성별 선택",
    "failedLoadCharacterProfile": "캐릭터 프로필을 불러오지 못했습니다",
    "chooseImageFile": "이미지 파일을 선택해 주세요.",
    "profileImageTooLarge": "프로필 이미지는 2 MB 이하여야 합니다.",
    "enterCharacterNameRequired": "캐릭터 이름을 입력해 주세요.",
    "failedSaveCharacterProfile": "캐릭터 프로필을 저장하지 못했습니다",
    "goBack": "뒤로 가기",
    "characterProfile": "캐릭터 프로필",
    "saving": "저장 중...",
    "save": "저장",
    "loadingProfile": "프로필 불러오는 중...",
    "replaceProfileImage": "프로필 이미지 변경",
    "name": "이름",
    "characterGroup": "캐릭터 그룹",
    "gender": "성별",
    "birthday": "생일",
    "height": "키",
    "roleOccupation": "역할 / 직업",
    "enterCharacterName": "캐릭터 이름 입력",
    "enterHeight": "키 입력",
    "occupationExample": "예: CEO, 학생, 의사",
    "personality": "성격",
    "personalityExample": "예: 차분함, 질투가 많음, 충성스러움, 수줍음",
    "relationship": "관계",
    "relationshipExample": "예: 연인, 라이벌, 자매, 절친",
    "bio": "소개",
    "bioPlaceholder": "캐릭터의 배경, 목표, 비밀 또는 중요한 정보를 작성하세요..."
  }
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const ROLE_GROUPS = [
  {
    value: 'main',
    label: 'Main Characters',
    accent: '#7C3AED',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #7C3AED 12%)',
    icon: 'fa-solid fa-crown',
  },
  {
    value: 'major',
    label: 'Major Supporting Characters',
    accent: '#F97316',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #F97316 12%)',
    icon: 'fa-solid fa-star',
  },
  {
    value: 'minor',
    label: 'Minor Supporting Characters',
    accent: '#0F9F7A',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #0F9F7A 12%)',
    icon: 'fa-solid fa-user-group',
  },
  {
    value: 'background',
    label: 'Background Characters',
    accent: '#64748B',
    soft: 'color-mix(in srgb, var(--shadow-bg-surface) 88%, #64748B 12%)',
    icon: 'fa-solid fa-users',
  },
]

const GENDERS = ['', 'Female', 'Male', 'Non-binary', 'Unknown']


function getRoleGroupDisplayLabel(value) {
  if (value === 'major') return getDisplayText('chatStoryCharacterProfile.majorSupportingCharacters')
  if (value === 'minor') return getDisplayText('chatStoryCharacterProfile.minorSupportingCharacters')
  if (value === 'background') return getDisplayText('chatStoryCharacterProfile.backgroundCharacters')
  return getDisplayText('chatStoryCharacterProfile.mainCharacters')
}

function getGenderDisplayLabel(value) {
  if (value === 'Female') return getDisplayText('chatStoryCharacterProfile.female')
  if (value === 'Male') return getDisplayText('chatStoryCharacterProfile.male')
  if (value === 'Non-binary') return getDisplayText('chatStoryCharacterProfile.nonBinary')
  if (value === 'Unknown') return getDisplayText('chatStoryCharacterProfile.unknown')
  return getDisplayText('chatStoryCharacterProfile.notSpecified')
}

function formatDisplayNumber(value) {
  return new Intl.NumberFormat(getDisplayLanguageId()).format(Number(value || 0))
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = String(dataUrl).split(',')
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], fileName, { type: mime })
}

async function uploadProfileImage(token, imageDataUrl, storyId, characterId) {
  if (!String(imageDataUrl || '').startsWith('data:image/')) return imageDataUrl || null

  const formData = new FormData()
  formData.append(
    'image',
    dataUrlToFile(imageDataUrl, `chat-profile-${storyId}-${characterId}-${Date.now()}.jpg`)
  )
  formData.append('folder', 'chat_story_character')

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('chatStoryCharacterProfile.failedUploadProfileImage'))
  }

  return data.image_url || data.imageUrl || null
}


function CharacterGroupSheet({ open, value, onChange, onClose }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    dragYRef.current = 0
    draggingRef.current = false

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const startDrag = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    dragYRef.current = 0
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextY = Math.max(0, event.clientY - startYRef.current)
    dragYRef.current = nextY
    setDragY(nextY)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false
    const shouldClose = dragYRef.current >= 90
    dragYRef.current = 0
    setDragY(0)

    if (shouldClose) onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="mx-auto w-full max-w-[520px] rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? 'none' : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label={getDisplayText('chatStoryCharacterProfile.dragDownToClose')}
        >
          <span className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </button>

        <h2 className="mt-2 text-[17px] font-bold text-[var(--shadow-text-primary)]">
          {getDisplayText('chatStoryCharacterProfile.chooseCharacterGroup')}
        </h2>

        <div className="mt-4 space-y-2">
          {ROLE_GROUPS.map((item) => {
            const selected = value === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange(item.value)
                  onClose()
                }}
                className={`flex w-full items-center justify-between rounded-[16px] px-3.5 py-3 text-left ${
                  selected
                    ? 'bg-[var(--shadow-bg-soft)]'
                    : 'bg-[var(--shadow-bg-soft)] active:bg-[var(--shadow-bg-hover)]'
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: item.soft,
                      color: item.accent,
                    }}
                  >
                    <i className={`${item.icon} text-[12px]`} />
                  </span>

                  <span
                    className={`line-clamp-1 text-[13px] font-medium ${
                      selected ? 'text-[#6d42db]' : 'text-[var(--shadow-text-primary)]'
                    }`}
                  >
                    {getRoleGroupDisplayLabel(item.value)}
                  </span>
                </span>

                {selected ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white">
                    <i className="fa-solid fa-check text-[10px]" />
                  </span>
                ) : (
                  <span className="h-6 w-6 shrink-0 rounded-full border border-[var(--shadow-border-strong)]" />
                )}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function GenderSheet({ open, value, onChange, onClose }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    dragYRef.current = 0
    draggingRef.current = false

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const startDrag = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    dragYRef.current = 0
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextY = Math.max(0, event.clientY - startYRef.current)
    dragYRef.current = nextY
    setDragY(nextY)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false
    const shouldClose = dragYRef.current >= 90
    dragYRef.current = 0
    setDragY(0)

    if (shouldClose) onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[220] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="mx-auto w-full max-w-[520px] rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current
            ? 'none'
            : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label={getDisplayText('chatStoryCharacterProfile.dragDownToClose')}
        >
          <span className="h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />
        </button>

        <h2 className="mt-2 text-[17px] font-bold text-[var(--shadow-text-primary)]">
          {getDisplayText('chatStoryCharacterProfile.chooseGender')}
        </h2>

        <div className="mt-3">
          {GENDERS.map((item) => {
            const selected = value === item
            const label = getGenderDisplayLabel(item)

            return (
              <button
                key={item || 'not-specified'}
                type="button"
                onClick={() => {
                  onChange(item)
                  onClose()
                }}
                className="flex w-full items-center justify-between border-b border-[var(--shadow-border)] py-3.5 text-left last:border-b-0 active:opacity-60"
              >
                <span
                  className={`text-[13px] ${
                    selected
                      ? 'font-medium text-[var(--shadow-text-primary)]'
                      : 'font-normal text-[var(--shadow-text-secondary)]'
                  }`}
                >
                  {label}
                </span>

                {selected ? (
                  <i className="fa-solid fa-check text-[12px] text-[#7c3aed]" />
                ) : (
                  <span className="h-3 w-3" />
                )}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default function ChatStoryCharacterProfilePage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { storyId, characterId } = useParams()
  const [searchParams] = useSearchParams()
  const startNewEpisode =
  searchParams.get('new') === '1'

const requestedReturnPath =
  searchParams.get('returnTo') || ''

const editorPath =
  `/author/story/${storyId}/chat/editor`

const safeReturnPath =
  requestedReturnPath === editorPath ||
  requestedReturnPath.startsWith(
    `${editorPath}?`
  ) ||
  requestedReturnPath.startsWith(
    `${editorPath}#`
  )
    ? requestedReturnPath
    : ''

const fileInputRef = useRef(null)

  const handleBack = () => {
    if (safeReturnPath) {
      navigate(safeReturnPath, { replace: true })
      return
    }

    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    const charactersPath =
      `/author/story/${storyId}/chat/characters`

    navigate(
      startNewEpisode
        ? `${charactersPath}?new=1`
        : charactersPath,
      { replace: true }
    )
  }

  const [nickname, setNickname] = useState('')
  const [roleGroup, setRoleGroup] = useState('main')
  const [groupSheetOpen, setGroupSheetOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarSource, setAvatarSource] = useState('device')
  const [gender, setGender] = useState('')
  const [genderSheetOpen, setGenderSheetOpen] = useState(false)
  const [birthday, setBirthday] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [occupation, setOccupation] = useState('')
  const [personality, setPersonality] = useState('')
  const [relationship, setRelationship] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/chat/characters/${characterId}/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || getDisplayText('chatStoryCharacterProfile.failedLoadCharacterProfile'))
        }

        const character = data.character || {}
        setNickname(character.nickname || '')
        setRoleGroup(character.role_group || 'main')
        setAvatarUrl(character.avatar_url || '')
        setAvatarSource(character.avatar_source || 'device')
        setGender(character.gender || '')
        setBirthday(character.birthday || '')
        setHeightCm(character.height_cm || '')
        setOccupation(character.occupation || '')
        setPersonality(character.personality || '')
        setRelationship(character.relationship || '')
        setBio(character.bio || '')
      } catch (error) {
        setMessage(error.message || getDisplayText('chatStoryCharacterProfile.failedLoadCharacterProfile'))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [characterId, navigate, storyId])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage(getDisplayText('chatStoryCharacterProfile.chooseImageFile'))
      return
    }

    if (file.size > 2 * 1024 * 1024) {
  setMessage(
    getDisplayText('chatStoryCharacterProfile.profileImageTooLarge')
  )
  return
}

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarUrl(String(reader.result || ''))
      setAvatarSource('device')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (roleGroup !== 'background' && !nickname.trim()) {
      setMessage(getDisplayText('chatStoryCharacterProfile.enterCharacterNameRequired'))
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const uploadedAvatar = await uploadProfileImage(
        token,
        avatarUrl,
        storyId,
        characterId
      )

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/chat/characters/${characterId}/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: nickname.trim(),
            role_group: roleGroup,
            avatar_url: uploadedAvatar,
            avatar_source: avatarSource,
            gender: gender || null,
            birthday: birthday || null,
            height_cm: heightCm === '' ? null : Number(heightCm),
            occupation: occupation.trim() || null,
            personality: personality.trim() || null,
            relationship: relationship.trim() || null,
            bio: bio.trim() || null,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('chatStoryCharacterProfile.failedSaveCharacterProfile'))
      }

      handleBack()
    } catch (error) {
      setMessage(error.message || getDisplayText('chatStoryCharacterProfile.failedSaveCharacterProfile'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-surface)] pb-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <CharacterGroupSheet
        open={groupSheetOpen}
        value={roleGroup}
        onChange={setRoleGroup}
        onClose={() => setGroupSheetOpen(false)}
      />

      <GenderSheet
  open={genderSheetOpen}
  value={gender}
  onChange={setGender}
  onClose={() => setGenderSheetOpen(false)}
/>

      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label={getDisplayText('chatStoryCharacterProfile.goBack')}
            className="flex h-10 w-10 items-center justify-center bg-transparent text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('chatStoryCharacterProfile.characterProfile')}
          </h1>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="h-10 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-5 text-[12px] font-medium text-white shadow-sm disabled:opacity-60"
          >
            {saving ? getDisplayText('chatStoryCharacterProfile.saving') : getDisplayText('chatStoryCharacterProfile.save')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-6">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-5 w-full rounded-[14px] bg-[var(--shadow-text-primary)] px-4 py-3 text-center text-[12px] font-medium text-[var(--shadow-bg-surface)]"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="py-20 text-center text-[13px] font-medium text-[var(--shadow-text-secondary)]">
            {getDisplayText('chatStoryCharacterProfile.loadingProfile')}
          </div>
        ) : (
          <>
            <section className="flex justify-center">
              <div className="relative">
                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <i className="fa-solid fa-user text-[48px] text-white" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[var(--shadow-bg-surface)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] shadow-md"
                  aria-label={getDisplayText('chatStoryCharacterProfile.replaceProfileImage')}
                >
                  <i className="fa-solid fa-camera text-[14px]" />
                </button>
              </div>
            </section>

            <section className="mt-8 divide-y divide-[var(--shadow-border)]">
              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.name')}
                </span>
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  maxLength={40}
                  placeholder={getDisplayText('chatStoryCharacterProfile.enterCharacterName')}
                  className="h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#7c3aed] focus:bg-[var(--shadow-input-bg)]"
                />
              </label>

              <div className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.characterGroup')}
                </span>

                <button
                  type="button"
                  onClick={() => setGroupSheetOpen(true)}
                  className="flex h-12 w-full items-center justify-between rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-left text-[14px] font-normal text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="line-clamp-1">
                    {getRoleGroupDisplayLabel(roleGroup)}
                  </span>

                  <i className="fa-solid fa-chevron-down text-[11px] text-[var(--shadow-text-secondary)]" />
                </button>
              </div>

              <div className="block py-4">
  <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
    {getDisplayText('chatStoryCharacterProfile.gender')}
  </span>

  <button
    type="button"
    onClick={() => setGenderSheetOpen(true)}
    className="flex h-12 w-full items-center justify-between rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-left text-[14px] font-normal text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
  >
    <span>{getGenderDisplayLabel(gender)}</span>

    <i className="fa-solid fa-chevron-down text-[11px] text-[var(--shadow-text-secondary)]" />
  </button>
</div>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.birthday')}
                </span>
                <input
                  type="date"
                  value={birthday}
                  onChange={(event) => setBirthday(event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.height')}
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={heightCm}
                    onChange={(event) => setHeightCm(event.target.value)}
                    placeholder={getDisplayText('chatStoryCharacterProfile.enterHeight')}
                    className="h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 pr-14 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[var(--shadow-text-tertiary)]">
                    cm
                  </span>
                </div>
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.roleOccupation')}
                </span>
                <input
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                  maxLength={120}
                  placeholder={getDisplayText('chatStoryCharacterProfile.occupationExample')}
                  className="h-12 w-full rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.personality')}
                </span>
                <textarea
                  value={personality}
                  onChange={(event) => setPersonality(event.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder={getDisplayText('chatStoryCharacterProfile.personalityExample')}
                  className="w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.relationship')}
                </span>
                <textarea
                  value={relationship}
                  onChange={(event) => setRelationship(event.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder={getDisplayText('chatStoryCharacterProfile.relationshipExample')}
                  className="w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {getDisplayText('chatStoryCharacterProfile.bio')}
                </span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={5000}
                  rows={8}
                  placeholder={getDisplayText('chatStoryCharacterProfile.bioPlaceholder')}
                  className="w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none"
                />
                <div className="mt-1 text-right text-[10px] text-[var(--shadow-text-tertiary)]">
                  {formatDisplayNumber(bio.length)}/{formatDisplayNumber(5000)}
                </div>
              </label>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

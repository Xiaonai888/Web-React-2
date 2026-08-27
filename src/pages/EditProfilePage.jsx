import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('editProfilePage', {
  en: {
    website: 'Website',
    otherLink: 'Other Link',
    loadFailed: 'Failed to load profile',
    updateFailed: 'Failed to update profile',
    usernameRequired: 'Username is required.',
    usernameLength: 'Username must be 3–30 characters.',
    usernameSpaces: 'Spaces are not allowed. Use English letters, numbers, or underscores.',
    usernameInvalidCharacter: '"{{character}}" is not allowed. Use only English letters, numbers, and underscores.',
    noLinksAdded: 'No links added',
    displayNameRequired: 'Display name is required',
    backToProfile: 'Back to profile',
    editProfile: 'Edit Profile',
    saving: 'Saving...',
    save: 'Save',
    profile: 'Profile',
    profileInformation: 'Profile information',
    profileInformationHelper: 'Edit name, bio, location, and profile links.',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Your display name',
    displayNameLimit: 'You can change display name once every 2 weeks.',
    username: 'Username',
    usernameHelper: 'Use 3–30 English letters, numbers, or underscores. No spaces.',
    usernameLimit: 'You can change your username once every 1 week.',
    work: 'Work / Job',
    workPlaceholder: 'Author and accountant',
    bio: 'Bio',
    bioPlaceholder: 'Turn the impossible into reality.',
    location: 'Location',
    locationPlaceholder: 'Based in KPS',
    addLink: 'Add link',
  },
  km: {
    website: 'គេហទំព័រ',
    otherLink: 'Link ផ្សេងទៀត',
    loadFailed: 'មិនអាចផ្ទុកប្រវត្តិរូបបានទេ',
    updateFailed: 'មិនអាចកែប្រែប្រវត្តិរូបបានទេ',
    usernameRequired: 'ត្រូវបញ្ចូល Username។',
    usernameLength: 'Username ត្រូវមានពី 3–30 តួអក្សរ។',
    usernameSpaces: 'មិនអនុញ្ញាតឱ្យមានដកឃ្លាទេ។ ប្រើតែអក្សរអង់គ្លេស លេខ ឬសញ្ញា underscore។',
    usernameInvalidCharacter: 'មិនអនុញ្ញាតឱ្យប្រើ "{{character}}" ទេ។ ប្រើតែអក្សរអង់គ្លេស លេខ និងសញ្ញា underscore។',
    noLinksAdded: 'មិនទាន់មាន Link',
    displayNameRequired: 'ត្រូវបញ្ចូលឈ្មោះបង្ហាញ',
    backToProfile: 'ត្រឡប់ទៅប្រវត្តិរូប',
    editProfile: 'កែប្រវត្តិរូប',
    saving: 'កំពុងរក្សាទុក...',
    save: 'រក្សាទុក',
    profile: 'ប្រវត្តិរូប',
    profileInformation: 'ព័ត៌មានប្រវត្តិរូប',
    profileInformationHelper: 'កែឈ្មោះ Bio ទីតាំង និង Link ប្រវត្តិរូប។',
    displayName: 'ឈ្មោះបង្ហាញ',
    displayNamePlaceholder: 'ឈ្មោះបង្ហាញរបស់អ្នក',
    displayNameLimit: 'អ្នកអាចប្តូរឈ្មោះបង្ហាញបានម្តងរៀងរាល់ 2 សប្តាហ៍។',
    username: 'Username',
    usernameHelper: 'ប្រើអក្សរអង់គ្លេស លេខ ឬសញ្ញា underscore ពី 3–30 តួអក្សរ។ ហាមដកឃ្លា។',
    usernameLimit: 'អ្នកអាចប្តូរ Username បានម្តងរៀងរាល់ 1 សប្តាហ៍។',
    work: 'ការងារ / មុខរបរ',
    workPlaceholder: 'អ្នកនិពន្ធ និងគណនេយ្យករ',
    bio: 'Bio',
    bioPlaceholder: 'ប្រែក្លាយអ្វីដែលមិនអាចទៅរួច ឱ្យក្លាយជាការពិត។',
    location: 'ទីតាំង',
    locationPlaceholder: 'រស់នៅ KPS',
    addLink: 'បន្ថែម Link',
  },
  zh: {
    website: '网站',
    otherLink: '其他链接',
    loadFailed: '无法加载个人资料',
    updateFailed: '无法更新个人资料',
    usernameRequired: '必须填写用户名。',
    usernameLength: '用户名必须为 3–30 个字符。',
    usernameSpaces: '用户名不能包含空格。请使用英文字母、数字或下划线。',
    usernameInvalidCharacter: '不允许使用“{{character}}”。请仅使用英文字母、数字和下划线。',
    noLinksAdded: '尚未添加链接',
    displayNameRequired: '必须填写显示名称',
    backToProfile: '返回个人资料',
    editProfile: '编辑个人资料',
    saving: '保存中...',
    save: '保存',
    profile: '个人资料',
    profileInformation: '个人资料信息',
    profileInformationHelper: '编辑名称、简介、位置和个人资料链接。',
    displayName: '显示名称',
    displayNamePlaceholder: '你的显示名称',
    displayNameLimit: '显示名称每 2 周可更改一次。',
    username: '用户名',
    usernameHelper: '使用 3–30 个英文字母、数字或下划线，不能包含空格。',
    usernameLimit: '用户名每 1 周可更改一次。',
    work: '工作 / 职业',
    workPlaceholder: '作者和会计',
    bio: '简介',
    bioPlaceholder: '把不可能变成现实。',
    location: '位置',
    locationPlaceholder: '居住在 KPS',
    addLink: '添加链接',
  },
  ja: {
    website: 'ウェブサイト',
    otherLink: 'その他のリンク',
    loadFailed: 'プロフィールを読み込めませんでした',
    updateFailed: 'プロフィールを更新できませんでした',
    usernameRequired: 'ユーザー名は必須です。',
    usernameLength: 'ユーザー名は3～30文字にしてください。',
    usernameSpaces: 'スペースは使用できません。英字、数字、アンダースコアを使用してください。',
    usernameInvalidCharacter: '「{{character}}」は使用できません。英字、数字、アンダースコアのみ使用してください。',
    noLinksAdded: 'リンクはまだありません',
    displayNameRequired: '表示名は必須です',
    backToProfile: 'プロフィールに戻る',
    editProfile: 'プロフィールを編集',
    saving: '保存中...',
    save: '保存',
    profile: 'プロフィール',
    profileInformation: 'プロフィール情報',
    profileInformationHelper: '名前、自己紹介、場所、プロフィールリンクを編集します。',
    displayName: '表示名',
    displayNamePlaceholder: '表示名',
    displayNameLimit: '表示名は2週間に1回変更できます。',
    username: 'ユーザー名',
    usernameHelper: '3～30文字の英字、数字、アンダースコアを使用してください。スペースは使用できません。',
    usernameLimit: 'ユーザー名は1週間に1回変更できます。',
    work: '仕事 / 職業',
    workPlaceholder: '作者・会計担当',
    bio: '自己紹介',
    bioPlaceholder: '不可能を現実に変える。',
    location: '場所',
    locationPlaceholder: 'KPS 在住',
    addLink: 'リンクを追加',
  },
  ko: {
    website: '웹사이트',
    otherLink: '기타 링크',
    loadFailed: '프로필을 불러오지 못했습니다',
    updateFailed: '프로필을 업데이트하지 못했습니다',
    usernameRequired: '사용자 이름을 입력해야 합니다.',
    usernameLength: '사용자 이름은 3–30자여야 합니다.',
    usernameSpaces: '공백은 사용할 수 없습니다. 영문자, 숫자 또는 밑줄을 사용하세요.',
    usernameInvalidCharacter: '"{{character}}" 문자는 사용할 수 없습니다. 영문자, 숫자, 밑줄만 사용하세요.',
    noLinksAdded: '추가된 링크 없음',
    displayNameRequired: '표시 이름을 입력해야 합니다',
    backToProfile: '프로필로 돌아가기',
    editProfile: '프로필 편집',
    saving: '저장 중...',
    save: '저장',
    profile: '프로필',
    profileInformation: '프로필 정보',
    profileInformationHelper: '이름, 소개, 위치 및 프로필 링크를 편집하세요.',
    displayName: '표시 이름',
    displayNamePlaceholder: '표시 이름',
    displayNameLimit: '표시 이름은 2주에 한 번 변경할 수 있습니다.',
    username: '사용자 이름',
    usernameHelper: '영문자, 숫자 또는 밑줄을 사용해 3–30자로 입력하세요. 공백은 사용할 수 없습니다.',
    usernameLimit: '사용자 이름은 1주에 한 번 변경할 수 있습니다.',
    work: '직업 / 업무',
    workPlaceholder: '작가 및 회계 담당',
    bio: '소개',
    bioPlaceholder: '불가능을 현실로 바꾸세요.',
    location: '위치',
    locationPlaceholder: 'KPS 거주',
    addLink: '링크 추가',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PROFILE_LINK_OPTIONS = [
  { type: 'website', labelKey: 'website', icon: 'fas fa-globe' },
  { type: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { type: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
  { type: 'telegram', label: 'Telegram', icon: 'fab fa-telegram-plane' },
  { type: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok' },
  { type: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
  { type: 'x', label: 'X', icon: 'fab fa-twitter' },
  { type: 'link', labelKey: 'otherLink', icon: 'fas fa-link' },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function saveAuthToken(token) {
  if (!token) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_token', token)
    return
  }

  sessionStorage.setItem('shadow_reader_token', token)
}

function getProfileLinkOption(type) {
  return PROFILE_LINK_OPTIONS.find((item) => item.type === type) || PROFILE_LINK_OPTIONS[0]
}

function getProfileLinkLabel(option, t) {
  if (option.labelKey) {
    return t(`editProfilePage.${option.labelKey}`)
  }

  return option.label
}

function normalizeProfileLinkUrl(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function normalizeSocialLinks(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => ({
      type: String(item?.type || 'website').trim().toLowerCase(),
      url: String(item?.url || '').trim(),
    }))
    .slice(0, 5)
}

function emptyForm(user) {
  return {
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    work: user?.work || '',
    location: user?.location || '',
    social_links: normalizeSocialLinks(user?.social_links),
  }
}

async function fetchCurrentUser(token, fallbackError) {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || fallbackError)
  }

  return data.user || null
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
      {children}
    </label>
  )
}

function getUsernameError(value, t) {
  const username = String(value || '').trim()

  if (!username) {
    return t('editProfilePage.usernameRequired')
  }

  if (username.length < 3 || username.length > 30) {
    return t('editProfilePage.usernameLength')
  }

  if (/\s/.test(username)) {
    return t('editProfilePage.usernameSpaces')
  }

  const invalidCharacter = username.match(/[^A-Za-z0-9_]/)?.[0]

  return invalidCharacter
    ? t('editProfilePage.usernameInvalidCharacter', {
        character: invalidCharacter,
      })
    : ''
}

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [user, setUser] = useState(getStoredUser())
  const [form, setForm] = useState(() => emptyForm(getStoredUser()))
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [usernameTouched, setUsernameTouched] = useState(false)

  const usernameError = useMemo(
    () => getUsernameError(form.username, t),
    [form.username, t]
  )

  const avatarLetter = useMemo(
    () => (form.name || user?.name || 'R').charAt(0).toUpperCase(),
    [form.name, user?.name]
  )

  const activeLinks = useMemo(
    () =>
      form.social_links
        .filter((item) => String(item?.url || '').trim())
        .slice(0, 5),
    [form.social_links]
  )

  const linkSummary = useMemo(() => {
    if (!activeLinks.length) {
      return t('editProfilePage.noLinksAdded')
    }

    return activeLinks
      .map((item) =>
        getProfileLinkLabel(getProfileLinkOption(item.type), t)
      )
      .join(', ')
  }, [activeLinks, t])

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        const freshUser = await fetchCurrentUser(
          token,
          t('editProfilePage.loadFailed')
        )

        if (!ignore && freshUser) {
          saveStoredUser(freshUser)
          setUser(freshUser)
          setForm(emptyForm(freshUser))
        }
      } catch (error) {
        if (!ignore) {
          setMessage(
            error.message || t('editProfilePage.loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      ignore = true
    }
  }, [navigate, t])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!form.name.trim()) {
      setMessage(t('editProfilePage.displayNameRequired'))
      return
    }

    setUsernameTouched(true)

    if (usernameError) {
      setMessage(usernameError)
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          bio: form.bio,
          work: form.work,
          location: form.location,
          social_links: form.social_links
            .map((item) => ({
              type: item.type,
              url: normalizeProfileLinkUrl(item.url),
            }))
            .filter((item) => item.url)
            .slice(0, 5),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('editProfilePage.updateFailed')
        )
      }

      saveStoredUser(data.user)
      if (data.token) saveAuthToken(data.token)
      navigate('/profile')
    } catch (error) {
      setMessage(
        error.message || t('editProfilePage.updateFailed')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-page min-h-screen md:px-4 md:py-6">
      <main className="mx-auto min-h-screen w-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] md:min-h-0 md:max-w-[560px] md:overflow-hidden md:rounded-[26px] md:border md:border-[var(--shadow-border)] md:shadow-sm">
        <header className="sticky top-0 z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur md:rounded-t-[26px]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  new URLSearchParams(window.location.search).get('from') ===
                    'me-settings'
                    ? '/me?settings=1'
                    : '/profile'
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition active:scale-95 active:bg-[var(--shadow-bg-hover)]"
              aria-label={t('editProfilePage.backToProfile')}
            >
              <i className="fa-solid fa-chevron-left text-[15px]" />
            </button>

            <div className="min-w-0 flex-1 text-center text-[16px] font-extrabold text-[var(--shadow-text-primary)]">
              {t('editProfilePage.editProfile')}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white transition active:scale-[0.98] disabled:bg-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
            >
              {saving
                ? t('editProfilePage.saving')
                : t('editProfilePage.save')}
            </button>
          </div>
        </header>

        <section className="px-4 pb-8 pt-5">
          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d] dark:bg-[#e5484d]/10">
              {message}
            </div>
          ) : null}

          <div className="mb-5 flex items-center gap-4 rounded-[22px] bg-[var(--shadow-bg-elevated)] p-4 ring-1 ring-[var(--shadow-border)]">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[28px] font-extrabold text-white ring-2 ring-[#f6b800]">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={form.name || t('editProfilePage.profile')}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
                {t('editProfilePage.profileInformation')}
              </div>
              <div className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">
                {t('editProfilePage.profileInformationHelper')}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <FieldLabel>
                {t('editProfilePage.displayName')}
              </FieldLabel>
              <input
                value={form.name}
                onChange={(event) =>
                  updateField('name', event.target.value)
                }
                className="app-input h-12 w-full rounded-[16px] border px-4 text-[14px] outline-none transition focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('editProfilePage.displayNamePlaceholder')}
              />
              <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
                {t('editProfilePage.displayNameLimit')}
              </div>
            </div>

            <div>
              <FieldLabel>
                {t('editProfilePage.username')}
              </FieldLabel>
              <input
                value={form.username}
                onChange={(event) => {
                  setUsernameTouched(true)
                  setMessage('')
                  updateField('username', event.target.value)
                }}
                onBlur={() => setUsernameTouched(true)}
                maxLength={30}
                spellCheck={false}
                className={`app-input h-12 w-full rounded-[16px] border px-4 text-[14px] outline-none transition focus:bg-[var(--shadow-bg-surface)] ${
                  usernameTouched && usernameError
                    ? 'border-[#e5484d] focus:border-[#e5484d]'
                    : 'border-[var(--shadow-border)] focus:border-[var(--shadow-text-primary)]'
                }`}
                placeholder="Dara_123"
              />
              <div
                className={`mt-1 text-[11px] font-bold ${
                  usernameTouched && usernameError
                    ? 'text-[#e5484d]'
                    : 'text-[var(--shadow-text-tertiary)]'
                }`}
              >
                {usernameTouched && usernameError
                  ? usernameError
                  : t('editProfilePage.usernameHelper')}
              </div>
              <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
                {t('editProfilePage.usernameLimit')}
              </div>
            </div>

            <div>
              <FieldLabel>
                {t('editProfilePage.work')}
              </FieldLabel>
              <input
                value={form.work}
                onChange={(event) =>
                  updateField('work', event.target.value)
                }
                className="app-input h-12 w-full rounded-[16px] border px-4 text-[14px] outline-none transition focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('editProfilePage.workPlaceholder')}
              />
            </div>

            <div>
              <FieldLabel>
                {t('editProfilePage.bio')}
              </FieldLabel>
              <textarea
                value={form.bio}
                onChange={(event) =>
                  updateField('bio', event.target.value)
                }
                className="app-input min-h-[96px] w-full resize-none rounded-[16px] border px-4 py-3 text-[14px] leading-6 outline-none transition focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('editProfilePage.bioPlaceholder')}
                maxLength={180}
              />
              <div className="mt-1 text-right text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
                {form.bio.length}/180
              </div>
            </div>

            <div>
              <FieldLabel>
                {t('editProfilePage.location')}
              </FieldLabel>
              <input
                value={form.location}
                onChange={(event) =>
                  updateField('location', event.target.value)
                }
                className="app-input h-12 w-full rounded-[16px] border px-4 text-[14px] outline-none transition focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder={t('editProfilePage.locationPlaceholder')}
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/profile/edit/links')}
              className="flex w-full items-center gap-3 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-left transition active:scale-[0.99] active:bg-[var(--shadow-bg-hover)]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
                  <i className="fas fa-link text-[14px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
                      {t('editProfilePage.addLink')}
                    </div>
                    <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
                      {activeLinks.length}/5
                    </div>
                  </div>
                  <div className="mt-1 truncate text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                    {linkSummary}
                  </div>
                </div>
              </div>

              {activeLinks.length ? (
                <div className="hidden shrink-0 items-center -space-x-2 sm:flex">
                  {activeLinks.slice(0, 3).map((link, index) => (
                    <div
                      key={`${link.type}-${index}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[12px] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]"
                    >
                      <i className={getProfileLinkOption(link.type).icon} />
                    </div>
                  ))}
                </div>
              ) : null}

              <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-tertiary)]" />
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

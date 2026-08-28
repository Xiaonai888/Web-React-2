import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerAccountSecurityPage', {
  en: {
    notSet: 'Not set',
    age: 'Age {{age}}',
    changeNow: 'You can change your date of birth now.',
    changeAgainOneDay: 'You can change it again in {{days}} day.',
    changeAgainDays: 'You can change it again in {{days}} days.',
    loadFailed: 'Failed to load account',
    selectBirthDateError: 'Please select your date of birth.',
    updateFailed: 'Failed to update date of birth',
    updateSuccess: 'Date of birth updated.',
    backToSettings: 'Back to settings',
    title: 'Account & security',
    subtitle: 'Personal information and account protection',
    personalInformation: 'Personal information',
    loading: 'Loading...',
    dateOfBirth: 'Date of birth',
    birthdayPrivacy: 'Your birthday is private and is used to determine access to age-restricted content.',
    selectDateOfBirth: 'Select date of birth',
    cancel: 'Cancel',
    saving: 'Saving...',
    save: 'Save',
    security: 'Security',
    changePassword: 'Change password',
    currentPasswordRequired: 'Current password required',
    email: 'Email',
    manageLoginEmail: 'Manage login email',
  },
  km: {
    notSet: 'មិនទាន់កំណត់',
    age: 'អាយុ {{age}}',
    changeNow: 'អ្នកអាចប្តូរថ្ងៃខែឆ្នាំកំណើតរបស់អ្នកបានឥឡូវនេះ។',
    changeAgainOneDay: 'អ្នកអាចប្តូរម្តងទៀតក្នុងរយៈពេល {{days}} ថ្ងៃ។',
    changeAgainDays: 'អ្នកអាចប្តូរម្តងទៀតក្នុងរយៈពេល {{days}} ថ្ងៃ។',
    loadFailed: 'មិនអាចផ្ទុកគណនីបានទេ',
    selectBirthDateError: 'សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើតរបស់អ្នក។',
    updateFailed: 'មិនអាចកែប្រែថ្ងៃខែឆ្នាំកំណើតបានទេ',
    updateSuccess: 'បានកែប្រែថ្ងៃខែឆ្នាំកំណើត។',
    backToSettings: 'ត្រឡប់ទៅការកំណត់',
    title: 'គណនី និងសុវត្ថិភាព',
    subtitle: 'ព័ត៌មានផ្ទាល់ខ្លួន និងការការពារគណនី',
    personalInformation: 'ព័ត៌មានផ្ទាល់ខ្លួន',
    loading: 'កំពុងផ្ទុក...',
    dateOfBirth: 'ថ្ងៃខែឆ្នាំកំណើត',
    birthdayPrivacy: 'ថ្ងៃខែឆ្នាំកំណើតរបស់អ្នកគឺឯកជន ហើយត្រូវបានប្រើដើម្បីកំណត់សិទ្ធិចូលមើលមាតិកាដែលមានកម្រិតអាយុ។',
    selectDateOfBirth: 'ជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត',
    cancel: 'បោះបង់',
    saving: 'កំពុងរក្សាទុក...',
    save: 'រក្សាទុក',
    security: 'សុវត្ថិភាព',
    changePassword: 'ប្តូរពាក្យសម្ងាត់',
    currentPasswordRequired: 'ត្រូវការពាក្យសម្ងាត់បច្ចុប្បន្ន',
    email: 'អ៊ីមែល',
    manageLoginEmail: 'គ្រប់គ្រងអ៊ីមែលចូលគណនី',
  },
  zh: {
    notSet: '未设置',
    age: '{{age}} 岁',
    changeNow: '你现在可以更改出生日期。',
    changeAgainOneDay: '{{days}} 天后可以再次更改。',
    changeAgainDays: '{{days}} 天后可以再次更改。',
    loadFailed: '无法加载账户',
    selectBirthDateError: '请选择你的出生日期。',
    updateFailed: '无法更新出生日期',
    updateSuccess: '出生日期已更新。',
    backToSettings: '返回设置',
    title: '账户与安全',
    subtitle: '个人信息与账户保护',
    personalInformation: '个人信息',
    loading: '加载中...',
    dateOfBirth: '出生日期',
    birthdayPrivacy: '你的生日信息为私密信息，用于判断是否可以访问有年龄限制的内容。',
    selectDateOfBirth: '选择出生日期',
    cancel: '取消',
    saving: '保存中...',
    save: '保存',
    security: '安全',
    changePassword: '更改密码',
    currentPasswordRequired: '需要当前密码',
    email: '邮箱',
    manageLoginEmail: '管理登录邮箱',
  },
  ja: {
    notSet: '未設定',
    age: '{{age}}歳',
    changeNow: '生年月日は今すぐ変更できます。',
    changeAgainOneDay: '{{days}}日後に再度変更できます。',
    changeAgainDays: '{{days}}日後に再度変更できます。',
    loadFailed: 'アカウントを読み込めませんでした',
    selectBirthDateError: '生年月日を選択してください。',
    updateFailed: '生年月日を更新できませんでした',
    updateSuccess: '生年月日を更新しました。',
    backToSettings: '設定に戻る',
    title: 'アカウントとセキュリティ',
    subtitle: '個人情報とアカウント保護',
    personalInformation: '個人情報',
    loading: '読み込み中...',
    dateOfBirth: '生年月日',
    birthdayPrivacy: '生年月日は非公開で、年齢制限のあるコンテンツへのアクセス判定に使用されます。',
    selectDateOfBirth: '生年月日を選択',
    cancel: 'キャンセル',
    saving: '保存中...',
    save: '保存',
    security: 'セキュリティ',
    changePassword: 'パスワードを変更',
    currentPasswordRequired: '現在のパスワードが必要です',
    email: 'メール',
    manageLoginEmail: 'ログイン用メールを管理',
  },
  ko: {
    notSet: '설정되지 않음',
    age: '{{age}}세',
    changeNow: '지금 생년월일을 변경할 수 있습니다.',
    changeAgainOneDay: '{{days}}일 후 다시 변경할 수 있습니다.',
    changeAgainDays: '{{days}}일 후 다시 변경할 수 있습니다.',
    loadFailed: '계정을 불러오지 못했습니다',
    selectBirthDateError: '생년월일을 선택해 주세요.',
    updateFailed: '생년월일을 업데이트하지 못했습니다',
    updateSuccess: '생년월일이 업데이트되었습니다.',
    backToSettings: '설정으로 돌아가기',
    title: '계정 및 보안',
    subtitle: '개인 정보 및 계정 보호',
    personalInformation: '개인 정보',
    loading: '불러오는 중...',
    dateOfBirth: '생년월일',
    birthdayPrivacy: '생일은 비공개이며 연령 제한 콘텐츠에 대한 접근 권한을 판단하는 데 사용됩니다.',
    selectDateOfBirth: '생년월일 선택',
    cancel: '취소',
    saving: '저장 중...',
    save: '저장',
    security: '보안',
    changePassword: '비밀번호 변경',
    currentPasswordRequired: '현재 비밀번호 필요',
    email: '이메일',
    manageLoginEmail: '로그인 이메일 관리',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function formatDate(dateString, language, t) {
  if (!dateString) return t('readerAccountSecurityPage.notSet')

  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat(
    DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(date)
}

function calculateAge(dateString) {
  if (!dateString) return null

  const birthDate = new Date(`${dateString}T00:00:00`)
  const today = new Date()

  if (Number.isNaN(birthDate.getTime())) return null

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1
  }

  return age
}

function getCooldownInfo(updatedAt) {
  if (!updatedAt) {
    return {
      locked: false,
      days: 0,
    }
  }

  const changedAt = new Date(updatedAt).getTime()
  const nextChangeAt = changedAt + 7 * 24 * 60 * 60 * 1000
  const remaining = nextChangeAt - Date.now()

  if (!Number.isFinite(changedAt) || remaining <= 0) {
    return {
      locked: false,
      days: 0,
    }
  }

  return {
    locked: true,
    days: Math.ceil(remaining / (24 * 60 * 60 * 1000)),
  }
}

export default function ReaderAccountSecurityPage() {
  const navigate = useNavigate()
  const { language, t } = useDisplayTranslation()
  const [user, setUser] = useState(null)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [editingBirthDate, setEditingBirthDate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const cooldown = useMemo(
    () => getCooldownInfo(user?.date_of_birth_updated_at),
    [user?.date_of_birth_updated_at]
  )

  const age = useMemo(
    () => calculateAge(user?.date_of_birth),
    [user?.date_of_birth]
  )

  const cooldownText = cooldown.locked
    ? t(
        cooldown.days === 1
          ? 'readerAccountSecurityPage.changeAgainOneDay'
          : 'readerAccountSecurityPage.changeAgainDays',
        { days: cooldown.days }
      )
    : t('readerAccountSecurityPage.changeNow')

  useEffect(() => {
    let ignore = false

    async function loadUser() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || t('readerAccountSecurityPage.loadFailed')
          )
        }

        if (!ignore) {
          setUser(data.user || null)
          setDateOfBirth(data.user?.date_of_birth || '')
          saveStoredUser(data.user)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(
            error.message || t('readerAccountSecurityPage.loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUser()

    return () => {
      ignore = true
    }
  }, [navigate])

  async function handleSaveBirthDate() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    if (!dateOfBirth) {
      setMessage(t('readerAccountSecurityPage.selectBirthDateError'))
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/users/date-of-birth`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date_of_birth: dateOfBirth,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('readerAccountSecurityPage.updateFailed')
        )
      }

      setUser(data.user || user)
      saveStoredUser(data.user)
      setEditingBirthDate(false)
      setMessage(t('readerAccountSecurityPage.updateSuccess'))
    } catch (error) {
      setMessage(
        error.message || t('readerAccountSecurityPage.updateFailed')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-page min-h-screen pb-10 text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate('/profile/settings')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('readerAccountSecurityPage.backToSettings')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div>
            <h1 className="text-[18px] font-extrabold">
              {t('readerAccountSecurityPage.title')}
            </h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">
              {t('readerAccountSecurityPage.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 py-5">
        {message ? (
          <div className="mb-4 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-medium text-[var(--shadow-text-secondary)]">
            {message}
          </div>
        ) : null}

        <section>
          <h2 className="mb-2 px-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
            {t('readerAccountSecurityPage.personalInformation')}
          </h2>

          <div className="overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
            {loading ? (
              <div className="px-4 py-6 text-[13px] text-[var(--shadow-text-secondary)]">
                {t('readerAccountSecurityPage.loading')}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!cooldown.locked) {
                      setEditingBirthDate((current) => !current)
                      setMessage('')
                    }
                  }}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left transition active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed] dark:text-[#a78bfa]">
                    <i className="fa-regular fa-calendar text-[17px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">
                      {t('readerAccountSecurityPage.dateOfBirth')}
                    </span>
                    <span className="mt-1 block text-[12px] text-[var(--shadow-text-secondary)]">
                      {formatDate(user?.date_of_birth, language, t)}
                      {age !== null
                        ? ` · ${t('readerAccountSecurityPage.age', { age })}`
                        : ''}
                    </span>
                  </span>

                  <i
                    className={`fa-solid ${
                      cooldown.locked ? 'fa-lock' : 'fa-chevron-right'
                    } text-[12px] text-[var(--shadow-text-tertiary)]`}
                  />
                </button>

                <div className="border-t border-[var(--shadow-border)] px-4 py-3">
                  <p className="text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
                    {t('readerAccountSecurityPage.birthdayPrivacy')}
                  </p>
                  <p
                    className={`mt-1 text-[11px] font-semibold ${
                      cooldown.locked
                        ? 'text-[#b26a28]'
                        : 'text-[#5b8a61]'
                    }`}
                  >
                    {cooldownText}
                  </p>
                </div>

                {editingBirthDate && !cooldown.locked ? (
                  <div className="border-t border-[var(--shadow-border)] px-4 py-4">
                    <label className="mb-2 block text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                      {t('readerAccountSecurityPage.selectDateOfBirth')}
                    </label>

                    <input
                      type="date"
                      value={dateOfBirth}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(event) =>
                        setDateOfBirth(event.target.value)
                      }
                      className="app-input h-12 w-full rounded-[12px] border px-3 text-[14px] outline-none transition focus:border-[#8a70b5]"
                    />

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBirthDate(false)
                          setDateOfBirth(user?.date_of_birth || '')
                          setMessage('')
                        }}
                        className="h-11 flex-1 rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-bold text-[var(--shadow-text-primary)] transition active:bg-[var(--shadow-bg-hover)]"
                      >
                        {t('readerAccountSecurityPage.cancel')}
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveBirthDate}
                        disabled={saving}
                        className="h-11 flex-1 rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]"
                      >
                        {saving
                          ? t('readerAccountSecurityPage.saving')
                          : t('readerAccountSecurityPage.save')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 px-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
            {t('readerAccountSecurityPage.security')}
          </h2>

          <div className="overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/profile/settings/account-security/change-password'
                )
              }
              className="flex w-full items-center gap-4 px-4 py-4 text-left transition active:bg-[var(--shadow-bg-hover)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed] dark:text-[#a78bfa]">
                <i className="fa-solid fa-key text-[16px]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">
                  {t('readerAccountSecurityPage.changePassword')}
                </span>
                <span className="mt-1 block text-[12px] text-[var(--shadow-text-secondary)]">
                  {t('readerAccountSecurityPage.currentPasswordRequired')}
                </span>
              </span>

              <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/profile/settings/account-security/change-email')
              }
              className="flex w-full items-center gap-4 border-t border-[var(--shadow-border)] px-4 py-4 text-left transition active:bg-[var(--shadow-bg-hover)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed] dark:text-[#a78bfa]">
                <i className="fa-solid fa-envelope text-[16px]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">
                  {t('readerAccountSecurityPage.email')}
                </span>
                <span className="mt-1 block truncate text-[12px] text-[var(--shadow-text-secondary)]">
                  {user?.email ||
                    t('readerAccountSecurityPage.manageLoginEmail')}
                </span>
              </span>

              <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

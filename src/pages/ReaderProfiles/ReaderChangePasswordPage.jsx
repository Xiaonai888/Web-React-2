import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerChangePasswordPage', {
  en: {
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    fillAllFields: 'Please fill in all password fields.',
    minimumLength: 'New password must be at least 6 characters.',
    passwordsDoNotMatch: 'New password and confirm password do not match.',
    mustBeDifferent: 'New password must be different from current password.',
    changeFailed: 'Failed to change password',
    changeSuccess: 'Password changed successfully.',
    backToSecurity: 'Back to account security',
    title: 'Change password',
    subtitle: 'Confirm your current password first',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    helper: 'Your new password must contain at least 6 characters.',
    changing: 'Changing...',
    changePassword: 'Change password',
  },
  km: {
    hidePassword: 'លាក់ពាក្យសម្ងាត់',
    showPassword: 'បង្ហាញពាក្យសម្ងាត់',
    fillAllFields: 'សូមបំពេញប្រអប់ពាក្យសម្ងាត់ទាំងអស់។',
    minimumLength: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។',
    passwordsDoNotMatch: 'ពាក្យសម្ងាត់ថ្មី និងពាក្យសម្ងាត់បញ្ជាក់មិនដូចគ្នាទេ។',
    mustBeDifferent: 'ពាក្យសម្ងាត់ថ្មីត្រូវខុសពីពាក្យសម្ងាត់បច្ចុប្បន្ន។',
    changeFailed: 'មិនអាចប្តូរពាក្យសម្ងាត់បានទេ',
    changeSuccess: 'បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ។',
    backToSecurity: 'ត្រឡប់ទៅសុវត្ថិភាពគណនី',
    title: 'ប្តូរពាក្យសម្ងាត់',
    subtitle: 'សូមបញ្ជាក់ពាក្យសម្ងាត់បច្ចុប្បន្នជាមុន',
    currentPassword: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
    newPassword: 'ពាក្យសម្ងាត់ថ្មី',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី',
    helper: 'ពាក្យសម្ងាត់ថ្មីរបស់អ្នកត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។',
    changing: 'កំពុងប្តូរ...',
    changePassword: 'ប្តូរពាក្យសម្ងាត់',
  },
  zh: {
    hidePassword: '隐藏密码',
    showPassword: '显示密码',
    fillAllFields: '请填写所有密码字段。',
    minimumLength: '新密码至少需要 6 个字符。',
    passwordsDoNotMatch: '新密码与确认密码不一致。',
    mustBeDifferent: '新密码必须与当前密码不同。',
    changeFailed: '无法更改密码',
    changeSuccess: '密码更改成功。',
    backToSecurity: '返回账户安全',
    title: '更改密码',
    subtitle: '请先确认当前密码',
    currentPassword: '当前密码',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    helper: '新密码必须至少包含 6 个字符。',
    changing: '正在更改...',
    changePassword: '更改密码',
  },
  ja: {
    hidePassword: 'パスワードを隠す',
    showPassword: 'パスワードを表示',
    fillAllFields: 'すべてのパスワード欄を入力してください。',
    minimumLength: '新しいパスワードは6文字以上で入力してください。',
    passwordsDoNotMatch: '新しいパスワードと確認用パスワードが一致しません。',
    mustBeDifferent: '新しいパスワードは現在のパスワードと異なるものにしてください。',
    changeFailed: 'パスワードを変更できませんでした',
    changeSuccess: 'パスワードを変更しました。',
    backToSecurity: 'アカウントのセキュリティに戻る',
    title: 'パスワードを変更',
    subtitle: '最初に現在のパスワードを確認してください',
    currentPassword: '現在のパスワード',
    newPassword: '新しいパスワード',
    confirmPassword: '新しいパスワードを確認',
    helper: '新しいパスワードは6文字以上である必要があります。',
    changing: '変更中...',
    changePassword: 'パスワードを変更',
  },
  ko: {
    hidePassword: '비밀번호 숨기기',
    showPassword: '비밀번호 표시',
    fillAllFields: '모든 비밀번호 항목을 입력해 주세요.',
    minimumLength: '새 비밀번호는 최소 6자 이상이어야 합니다.',
    passwordsDoNotMatch: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
    mustBeDifferent: '새 비밀번호는 현재 비밀번호와 달라야 합니다.',
    changeFailed: '비밀번호를 변경하지 못했습니다',
    changeSuccess: '비밀번호가 변경되었습니다.',
    backToSecurity: '계정 보안으로 돌아가기',
    title: '비밀번호 변경',
    subtitle: '먼저 현재 비밀번호를 확인하세요',
    currentPassword: '현재 비밀번호',
    newPassword: '새 비밀번호',
    confirmPassword: '새 비밀번호 확인',
    helper: '새 비밀번호는 최소 6자 이상이어야 합니다.',
    changing: '변경 중...',
    changePassword: '비밀번호 변경',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}) {
  const { t } = useDisplayTranslation()

  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-bold text-[var(--shadow-text-secondary)]">
        {label}
      </span>

      <span className="relative block">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="app-input h-12 w-full rounded-[12px] border px-3 pr-12 text-[14px] outline-none transition focus:border-[#8a70b5]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[var(--shadow-text-secondary)] transition active:bg-[var(--shadow-bg-hover)]"
          aria-label={
            visible
              ? t('readerChangePasswordPage.hidePassword')
              : t('readerChangePasswordPage.showPassword')
          }
        >
          <i
            className={`fa-regular ${
              visible ? 'fa-eye-slash' : 'fa-eye'
            } text-[15px]`}
          />
        </button>
      </span>
    </label>
  )
}

export default function ReaderChangePasswordPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSuccess(false)
      setMessage(t('readerChangePasswordPage.fillAllFields'))
      return
    }

    if (newPassword.length < 6) {
      setSuccess(false)
      setMessage(t('readerChangePasswordPage.minimumLength'))
      return
    }

    if (newPassword !== confirmPassword) {
      setSuccess(false)
      setMessage(t('readerChangePasswordPage.passwordsDoNotMatch'))
      return
    }

    if (currentPassword === newPassword) {
      setSuccess(false)
      setMessage(t('readerChangePasswordPage.mustBeDifferent'))
      return
    }

    try {
      setSaving(true)
      setMessage('')
      setSuccess(false)

      const response = await fetch(
        `${API_BASE_URL}/api/users/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('readerChangePasswordPage.changeFailed')
        )
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
      setMessage(t('readerChangePasswordPage.changeSuccess'))
    } catch (error) {
      setSuccess(false)
      setMessage(
        error.message || t('readerChangePasswordPage.changeFailed')
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
            onClick={() =>
              navigate('/profile/settings/account-security')
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:bg-[var(--shadow-bg-hover)]"
            aria-label={t(
              'readerChangePasswordPage.backToSecurity'
            )}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div>
            <h1 className="text-[18px] font-extrabold">
              {t('readerChangePasswordPage.title')}
            </h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">
              {t('readerChangePasswordPage.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 py-5">
        {message ? (
          <div
            className={`mb-4 rounded-[14px] border px-4 py-3 text-[12px] font-medium ${
              success
                ? 'border-[#d9eadc] bg-[#f4faf5] text-[#4e7d56] dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-[#f0d8d8] bg-[#fff7f7] text-[#a94c4c] dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300'
            }`}
          >
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4"
        >
          <div className="space-y-4">
            <PasswordField
              label={t('readerChangePasswordPage.currentPassword')}
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrent}
              onToggle={() =>
                setShowCurrent((value) => !value)
              }
              autoComplete="current-password"
            />

            <PasswordField
              label={t('readerChangePasswordPage.newPassword')}
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              onToggle={() =>
                setShowNew((value) => !value)
              }
              autoComplete="new-password"
            />

            <PasswordField
              label={t('readerChangePasswordPage.confirmPassword')}
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              onToggle={() =>
                setShowConfirm((value) => !value)
              }
              autoComplete="new-password"
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('readerChangePasswordPage.helper')}
          </p>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]"
          >
            {saving
              ? t('readerChangePasswordPage.changing')
              : t('readerChangePasswordPage.changePassword')}
          </button>
        </form>
      </div>
    </main>
  )
}

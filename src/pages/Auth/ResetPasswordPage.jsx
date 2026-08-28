import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('resetPasswordPage', {
  en: {
    tokenMissing: 'Reset token is missing.',
    passwordTooShort: 'Password must be at least 6 characters.',
    passwordsMismatch: 'Password and confirm password do not match.',
    resetFailed: 'Failed to reset password.',
    resetSuccess: 'Password reset successfully.',
    backendUnavailable: 'Cannot connect to backend.',
    title: 'Reset Password',
    subtitle: 'Create a new password for your reader account.',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'New password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm new password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    resetting: 'Resetting...',
    resetPassword: 'Reset Password',
    backTo: 'Back to',
    login: 'Login',
  },
  km: {
    tokenMissing: 'បាត់ Reset token។',
    passwordTooShort: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួអក្សរ។',
    passwordsMismatch: 'ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។',
    resetFailed: 'មិនអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញបានទេ។',
    resetSuccess: 'បានកំណត់ពាក្យសម្ងាត់ឡើងវិញដោយជោគជ័យ។',
    backendUnavailable: 'មិនអាចភ្ជាប់ទៅ Server បានទេ។',
    title: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    subtitle: 'បង្កើតពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីអ្នកអានរបស់អ្នក។',
    newPassword: 'ពាក្យសម្ងាត់ថ្មី',
    newPasswordPlaceholder: 'ពាក្យសម្ងាត់ថ្មី',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
    confirmPasswordPlaceholder: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី',
    showPassword: 'បង្ហាញពាក្យសម្ងាត់',
    hidePassword: 'លាក់ពាក្យសម្ងាត់',
    resetting: 'កំពុងកំណត់ឡើងវិញ...',
    resetPassword: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    backTo: 'ត្រឡប់ទៅ',
    login: 'ចូលគណនី',
  },
  zh: {
    tokenMissing: '缺少重置令牌。',
    passwordTooShort: '密码至少需要 6 个字符。',
    passwordsMismatch: '密码与确认密码不一致。',
    resetFailed: '无法重置密码。',
    resetSuccess: '密码重置成功。',
    backendUnavailable: '无法连接到服务器。',
    title: '重置密码',
    subtitle: '为你的读者账号创建一个新密码。',
    newPassword: '新密码',
    newPasswordPlaceholder: '新密码',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '确认新密码',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
    resetting: '重置中...',
    resetPassword: '重置密码',
    backTo: '返回',
    login: '登录',
  },
  ja: {
    tokenMissing: 'リセットトークンがありません。',
    passwordTooShort: 'パスワードは6文字以上にしてください。',
    passwordsMismatch: 'パスワードと確認用パスワードが一致しません。',
    resetFailed: 'パスワードをリセットできませんでした。',
    resetSuccess: 'パスワードをリセットしました。',
    backendUnavailable: 'サーバーに接続できません。',
    title: 'パスワードをリセット',
    subtitle: '読者アカウントの新しいパスワードを作成します。',
    newPassword: '新しいパスワード',
    newPasswordPlaceholder: '新しいパスワード',
    confirmPassword: 'パスワード確認',
    confirmPasswordPlaceholder: '新しいパスワードを確認',
    showPassword: 'パスワードを表示',
    hidePassword: 'パスワードを隠す',
    resetting: 'リセット中...',
    resetPassword: 'パスワードをリセット',
    backTo: '戻る',
    login: 'ログイン',
  },
  ko: {
    tokenMissing: '재설정 토큰이 없습니다.',
    passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다.',
    passwordsMismatch: '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
    resetFailed: '비밀번호를 재설정하지 못했습니다.',
    resetSuccess: '비밀번호를 성공적으로 재설정했습니다.',
    backendUnavailable: '서버에 연결할 수 없습니다.',
    title: '비밀번호 재설정',
    subtitle: '독자 계정에 사용할 새 비밀번호를 만드세요.',
    newPassword: '새 비밀번호',
    newPasswordPlaceholder: '새 비밀번호',
    confirmPassword: '비밀번호 확인',
    confirmPasswordPlaceholder: '새 비밀번호 확인',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
    resetting: '재설정 중...',
    resetPassword: '비밀번호 재설정',
    backTo: '돌아가기',
    login: '로그인',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useDisplayTranslation()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!token) {
      setError(t('resetPasswordPage.tokenMissing'))
      return
    }

    if (password.length < 6) {
      setError(t('resetPasswordPage.passwordTooShort'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('resetPasswordPage.passwordsMismatch'))
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        setError(
          data.message || t('resetPasswordPage.resetFailed')
        )
        return
      }

      setMessage(
        data.message || t('resetPasswordPage.resetSuccess')
      )
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch {
      setError(t('resetPasswordPage.backendUnavailable'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-page min-h-screen bg-[#f5f3fa] px-4 py-8 dark:bg-[var(--shadow-bg-page)]">
      <section className="mx-auto max-w-[430px] rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] dark:ring-white/10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-white dark:bg-[#7c3aed]">
            <i className="fa-solid fa-lock text-[20px]" />
          </div>
          <h1 className="text-[25px] font-extrabold tracking-tight text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {t('resetPasswordPage.title')}
          </h1>
          <p className="mx-auto mt-2 max-w-[310px] text-[13px] leading-5 text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
            {t('resetPasswordPage.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {t('resetPasswordPage.newPassword')}
            </span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('resetPasswordPage.newPasswordPlaceholder')}
                autoComplete="new-password"
                className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 pr-12 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:border-[#a78bfa]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword
                    ? t('resetPasswordPage.hidePassword')
                    : t('resetPasswordPage.showPassword')
                }
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5f3fa] text-[13px] text-[#111827] dark:bg-[var(--shadow-bg-hover)] dark:text-[var(--shadow-text-primary)]"
              >
                <i
                  className={
                    showPassword
                      ? 'fa-regular fa-eye-slash'
                      : 'fa-regular fa-eye'
                  }
                />
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {t('resetPasswordPage.confirmPassword')}
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t('resetPasswordPage.confirmPasswordPlaceholder')}
              autoComplete="new-password"
              className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:border-[#a78bfa]"
            />
          </label>

          {error ? (
            <div className="rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-[14px] bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold text-[#067647] dark:bg-emerald-500/10 dark:text-emerald-300">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af] dark:bg-gradient-to-r dark:from-[#7c3aed] dark:to-[#a78bfa] dark:disabled:from-[#5b5567] dark:disabled:to-[#5b5567]"
          >
            {loading
              ? t('resetPasswordPage.resetting')
              : t('resetPasswordPage.resetPassword')}
          </button>
        </form>

        <div className="mt-5 text-center text-[13px] font-bold text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
          {t('resetPasswordPage.backTo')}{' '}
          <Link
            to="/login"
            className="text-[#111827] dark:text-[var(--shadow-text-primary)]"
          >
            {t('resetPasswordPage.login')}
          </Link>
        </div>
      </section>
    </main>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerChangeEmailPage', {
  en: {
    changeNow: 'You can change your email now.',
    changeAgainOneDay: 'You can change your email again in {{days}} day.',
    changeAgainDays: 'You can change your email again in {{days}} days.',
    loadFailed: 'Failed to load account',
    enterEmailPassword: 'Please enter your new email and current password.',
    sendCodeFailed: 'Failed to send verification code',
    codeSent: 'Verification code sent to your new email.',
    enterSixDigitCode: 'Please enter the 6-digit verification code.',
    changeFailed: 'Failed to change email',
    changeSuccess: 'Email changed successfully.',
    backToSecurity: 'Back to account security',
    email: 'Email',
    subtitle: 'Change and verify your login email',
    currentEmail: 'Current email',
    loading: 'Loading...',
    notAvailable: 'Not available',
    newEmail: 'New email',
    currentPassword: 'Current password',
    codeHelper: 'A 6-digit verification code will be sent to your new email.',
    sending: 'Sending...',
    sendCode: 'Send verification code',
    enterCodeSentTo: 'Enter the code sent to {{email}}.',
    verificationCode: 'Verification code',
    verifying: 'Verifying...',
    verifyAndChange: 'Verify & change email',
    differentEmail: 'Use a different email',
    backToAccountSecurity: 'Back to account & security',
  },
  km: {
    changeNow: 'អ្នកអាចប្តូរអ៊ីមែលរបស់អ្នកបានឥឡូវនេះ។',
    changeAgainOneDay: 'អ្នកអាចប្តូរអ៊ីមែលម្តងទៀតក្នុងរយៈពេល {{days}} ថ្ងៃ។',
    changeAgainDays: 'អ្នកអាចប្តូរអ៊ីមែលម្តងទៀតក្នុងរយៈពេល {{days}} ថ្ងៃ។',
    loadFailed: 'មិនអាចផ្ទុកគណនីបានទេ',
    enterEmailPassword: 'សូមបញ្ចូលអ៊ីមែលថ្មី និងពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក។',
    sendCodeFailed: 'មិនអាចផ្ញើលេខកូដផ្ទៀងផ្ទាត់បានទេ',
    codeSent: 'បានផ្ញើលេខកូដផ្ទៀងផ្ទាត់ទៅអ៊ីមែលថ្មីរបស់អ្នក។',
    enterSixDigitCode: 'សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់ 6 ខ្ទង់។',
    changeFailed: 'មិនអាចប្តូរអ៊ីមែលបានទេ',
    changeSuccess: 'បានប្តូរអ៊ីមែលដោយជោគជ័យ។',
    backToSecurity: 'ត្រឡប់ទៅសុវត្ថិភាពគណនី',
    email: 'អ៊ីមែល',
    subtitle: 'ប្តូរ និងផ្ទៀងផ្ទាត់អ៊ីមែលសម្រាប់ចូលគណនី',
    currentEmail: 'អ៊ីមែលបច្ចុប្បន្ន',
    loading: 'កំពុងផ្ទុក...',
    notAvailable: 'មិនមាន',
    newEmail: 'អ៊ីមែលថ្មី',
    currentPassword: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
    codeHelper: 'លេខកូដផ្ទៀងផ្ទាត់ 6 ខ្ទង់ នឹងត្រូវផ្ញើទៅអ៊ីមែលថ្មីរបស់អ្នក។',
    sending: 'កំពុងផ្ញើ...',
    sendCode: 'ផ្ញើលេខកូដផ្ទៀងផ្ទាត់',
    enterCodeSentTo: 'បញ្ចូលលេខកូដដែលបានផ្ញើទៅ {{email}}។',
    verificationCode: 'លេខកូដផ្ទៀងផ្ទាត់',
    verifying: 'កំពុងផ្ទៀងផ្ទាត់...',
    verifyAndChange: 'ផ្ទៀងផ្ទាត់ និងប្តូរអ៊ីមែល',
    differentEmail: 'ប្រើអ៊ីមែលផ្សេង',
    backToAccountSecurity: 'ត្រឡប់ទៅគណនី និងសុវត្ថិភាព',
  },
  zh: {
    changeNow: '你现在可以更改邮箱。',
    changeAgainOneDay: '{{days}} 天后可以再次更改邮箱。',
    changeAgainDays: '{{days}} 天后可以再次更改邮箱。',
    loadFailed: '无法加载账户',
    enterEmailPassword: '请输入新邮箱和当前密码。',
    sendCodeFailed: '无法发送验证码',
    codeSent: '验证码已发送到你的新邮箱。',
    enterSixDigitCode: '请输入 6 位验证码。',
    changeFailed: '无法更改邮箱',
    changeSuccess: '邮箱更改成功。',
    backToSecurity: '返回账户安全',
    email: '邮箱',
    subtitle: '更改并验证登录邮箱',
    currentEmail: '当前邮箱',
    loading: '加载中...',
    notAvailable: '不可用',
    newEmail: '新邮箱',
    currentPassword: '当前密码',
    codeHelper: '6 位验证码将发送到你的新邮箱。',
    sending: '发送中...',
    sendCode: '发送验证码',
    enterCodeSentTo: '请输入发送到 {{email}} 的验证码。',
    verificationCode: '验证码',
    verifying: '验证中...',
    verifyAndChange: '验证并更改邮箱',
    differentEmail: '使用其他邮箱',
    backToAccountSecurity: '返回账户与安全',
  },
  ja: {
    changeNow: 'メールアドレスは今すぐ変更できます。',
    changeAgainOneDay: '{{days}}日後にメールアドレスを再度変更できます。',
    changeAgainDays: '{{days}}日後にメールアドレスを再度変更できます。',
    loadFailed: 'アカウントを読み込めませんでした',
    enterEmailPassword: '新しいメールアドレスと現在のパスワードを入力してください。',
    sendCodeFailed: '確認コードを送信できませんでした',
    codeSent: '確認コードを新しいメールアドレスへ送信しました。',
    enterSixDigitCode: '6桁の確認コードを入力してください。',
    changeFailed: 'メールアドレスを変更できませんでした',
    changeSuccess: 'メールアドレスを変更しました。',
    backToSecurity: 'アカウントのセキュリティに戻る',
    email: 'メール',
    subtitle: 'ログイン用メールを変更して確認',
    currentEmail: '現在のメール',
    loading: '読み込み中...',
    notAvailable: '利用できません',
    newEmail: '新しいメール',
    currentPassword: '現在のパスワード',
    codeHelper: '6桁の確認コードが新しいメールアドレスに送信されます。',
    sending: '送信中...',
    sendCode: '確認コードを送信',
    enterCodeSentTo: '{{email}} に送信されたコードを入力してください。',
    verificationCode: '確認コード',
    verifying: '確認中...',
    verifyAndChange: '確認してメールを変更',
    differentEmail: '別のメールを使用',
    backToAccountSecurity: 'アカウントとセキュリティに戻る',
  },
  ko: {
    changeNow: '지금 이메일을 변경할 수 있습니다.',
    changeAgainOneDay: '{{days}}일 후 이메일을 다시 변경할 수 있습니다.',
    changeAgainDays: '{{days}}일 후 이메일을 다시 변경할 수 있습니다.',
    loadFailed: '계정을 불러오지 못했습니다',
    enterEmailPassword: '새 이메일과 현재 비밀번호를 입력해 주세요.',
    sendCodeFailed: '인증 코드를 보내지 못했습니다',
    codeSent: '인증 코드를 새 이메일로 보냈습니다.',
    enterSixDigitCode: '6자리 인증 코드를 입력해 주세요.',
    changeFailed: '이메일을 변경하지 못했습니다',
    changeSuccess: '이메일이 변경되었습니다.',
    backToSecurity: '계정 보안으로 돌아가기',
    email: '이메일',
    subtitle: '로그인 이메일 변경 및 인증',
    currentEmail: '현재 이메일',
    loading: '불러오는 중...',
    notAvailable: '사용할 수 없음',
    newEmail: '새 이메일',
    currentPassword: '현재 비밀번호',
    codeHelper: '6자리 인증 코드가 새 이메일로 전송됩니다.',
    sending: '전송 중...',
    sendCode: '인증 코드 보내기',
    enterCodeSentTo: '{{email}}로 전송된 코드를 입력하세요.',
    verificationCode: '인증 코드',
    verifying: '인증 중...',
    verifyAndChange: '인증 후 이메일 변경',
    differentEmail: '다른 이메일 사용',
    backToAccountSecurity: '계정 및 보안으로 돌아가기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const EMAIL_CHANGE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function saveAuthSession(token, user) {
  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_token', token)
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_token', token)
  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function getCooldownInfo(updatedAt) {
  if (!updatedAt) {
    return {
      locked: false,
      days: 0,
    }
  }

  const changedAt = new Date(updatedAt).getTime()
  const nextChangeAt = changedAt + EMAIL_CHANGE_COOLDOWN_MS
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

export default function ReaderChangeEmailPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [user, setUser] = useState(null)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('request')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const cooldown = useMemo(
    () => getCooldownInfo(user?.email_changed_at),
    [user?.email_changed_at]
  )

  const cooldownText = cooldown.locked
    ? t(
        cooldown.days === 1
          ? 'readerChangeEmailPage.changeAgainOneDay'
          : 'readerChangeEmailPage.changeAgainDays',
        { days: cooldown.days }
      )
    : t('readerChangeEmailPage.changeNow')

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
            data.message || t('readerChangeEmailPage.loadFailed')
          )
        }

        if (!ignore) {
          setUser(data.user || null)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(
            error.message || t('readerChangeEmailPage.loadFailed')
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

  async function handleRequestCode(event) {
    event.preventDefault()

    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    if (cooldown.locked) {
      setSuccess(false)
      setMessage(cooldownText)
      return
    }

    if (!newEmail || !currentPassword) {
      setSuccess(false)
      setMessage(t('readerChangeEmailPage.enterEmailPassword'))
      return
    }

    try {
      setSaving(true)
      setMessage('')
      setSuccess(false)

      const response = await fetch(
        `${API_BASE_URL}/api/users/email-change/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_email: newEmail,
            current_password: currentPassword,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('readerChangeEmailPage.sendCodeFailed')
        )
      }

      setNewEmail(data.new_email || newEmail.trim().toLowerCase())
      setCurrentPassword('')
      setOtp('')
      setStep('confirm')
      setSuccess(true)
      setMessage(t('readerChangeEmailPage.codeSent'))
    } catch (error) {
      setSuccess(false)
      setMessage(
        error.message || t('readerChangeEmailPage.sendCodeFailed')
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirmCode(event) {
    event.preventDefault()

    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setSuccess(false)
      setMessage(t('readerChangeEmailPage.enterSixDigitCode'))
      return
    }

    try {
      setSaving(true)
      setMessage('')
      setSuccess(false)

      const response = await fetch(
        `${API_BASE_URL}/api/users/email-change/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_email: newEmail,
            otp,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('readerChangeEmailPage.changeFailed')
        )
      }

      if (data.token && data.user) {
        saveAuthSession(data.token, data.user)
      }

      setUser(data.user || user)
      setOtp('')
      setStep('done')
      setSuccess(true)
      setMessage(t('readerChangeEmailPage.changeSuccess'))
    } catch (error) {
      setSuccess(false)
      setMessage(
        error.message || t('readerChangeEmailPage.changeFailed')
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
            onClick={() => navigate('/profile/settings/account-security')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('readerChangeEmailPage.backToSecurity')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div>
            <h1 className="text-[18px] font-extrabold">
              {t('readerChangeEmailPage.email')}
            </h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">
              {t('readerChangeEmailPage.subtitle')}
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

        <section className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
            {t('readerChangeEmailPage.currentEmail')}
          </span>

          <p className="mt-2 break-all text-[15px] font-semibold">
            {loading
              ? t('readerChangeEmailPage.loading')
              : user?.email || t('readerChangeEmailPage.notAvailable')}
          </p>

          {!loading ? (
            <p
              className={`mt-2 text-[11px] font-semibold ${
                cooldown.locked
                  ? 'text-[#b26a28] dark:text-amber-300'
                  : 'text-[#5b8a61] dark:text-emerald-300'
              }`}
            >
              {cooldownText}
            </p>
          ) : null}
        </section>

        {!loading && !cooldown.locked && step === 'request' ? (
          <form
            onSubmit={handleRequestCode}
            className="mt-4 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4"
          >
            <label className="block">
              <span className="mb-2 block text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                {t('readerChangeEmailPage.newEmail')}
              </span>
              <input
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                autoComplete="email"
                className="app-input h-12 w-full rounded-[12px] border px-3 text-[14px] outline-none transition focus:border-[#8a70b5]"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                {t('readerChangeEmailPage.currentPassword')}
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                autoComplete="current-password"
                className="app-input h-12 w-full rounded-[12px] border px-3 text-[14px] outline-none transition focus:border-[#8a70b5]"
              />
            </label>

            <p className="mt-3 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
              {t('readerChangeEmailPage.codeHelper')}
            </p>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]"
            >
              {saving
                ? t('readerChangeEmailPage.sending')
                : t('readerChangeEmailPage.sendCode')}
            </button>
          </form>
        ) : null}

        {!loading && step === 'confirm' ? (
          <form
            onSubmit={handleConfirmCode}
            className="mt-4 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4"
          >
            <p className="text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
              {t('readerChangeEmailPage.enterCodeSentTo', {
                email: newEmail,
              })}
            </p>

            <label className="mt-4 block">
              <span className="mb-2 block text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                {t('readerChangeEmailPage.verificationCode')}
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6)
                  )
                }
                autoComplete="one-time-code"
                className="app-input h-12 w-full rounded-[12px] border px-3 text-center text-[18px] font-bold tracking-[0.25em] outline-none transition focus:border-[#8a70b5]"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]"
            >
              {saving
                ? t('readerChangeEmailPage.verifying')
                : t('readerChangeEmailPage.verifyAndChange')}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setStep('request')
                setOtp('')
                setMessage('')
                setSuccess(false)
              }}
              className="mt-2 h-11 w-full rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-bold text-[var(--shadow-text-primary)] transition active:bg-[var(--shadow-bg-hover)] disabled:opacity-50"
            >
              {t('readerChangeEmailPage.differentEmail')}
            </button>
          </form>
        ) : null}

        {!loading && step === 'done' ? (
          <button
            type="button"
            onClick={() =>
              navigate('/profile/settings/account-security')
            }
            className="mt-4 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white dark:bg-white dark:text-[#111827]"
          >
            {t('readerChangeEmailPage.backToAccountSecurity')}
          </button>
        ) : null}
      </div>
    </main>
  )
}

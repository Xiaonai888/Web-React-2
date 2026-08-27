import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('forgotPasswordPage', {
  en: {
    enterGmail: 'Please enter your Gmail.',
    sendFailed: 'Failed to send reset code.',
    emailNotConfigured: 'Email sending is not configured yet. Please ask the admin to enable email service.',
    checkEmail: 'Please check your email. We sent a 6-digit reset code if this account exists.',
    backendUnavailable: 'Cannot connect to backend.',
    enterCode: 'Please enter the 6-digit code.',
    passwordTooShort: 'Password must be at least 6 characters.',
    passwordsMismatch: 'Password and confirm password do not match.',
    resetFailed: 'Failed to reset password.',
    forgotPassword: 'Forgot Password',
    enterResetCode: 'Enter Reset Code',
    emailSubtitle: 'Enter your Gmail and we will send you a 6-digit reset code.',
    resetSubtitle: 'Enter the 6-digit code from your email and create a new password.',
    gmail: 'Gmail',
    sending: 'Sending...',
    sendOtp: 'Send OTP Code',
    otpCode: 'OTP Code',
    otpDigit: 'OTP digit {{number}}',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'New password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm password',
    changing: 'Changing...',
    changePassword: 'Change Password',
    resendCode: 'Resend Code',
    rememberPassword: 'Remember your password?',
    login: 'Login',
  },
  km: {
    enterGmail: 'សូមបញ្ចូល Gmail របស់អ្នក។',
    sendFailed: 'មិនអាចផ្ញើកូដកំណត់ពាក្យសម្ងាត់ឡើងវិញបានទេ។',
    emailNotConfigured: 'ប្រព័ន្ធផ្ញើអ៊ីមែលមិនទាន់បានកំណត់ទេ។ សូមទាក់ទង Admin ដើម្បីបើកសេវាអ៊ីមែល។',
    checkEmail: 'សូមពិនិត្យអ៊ីមែលរបស់អ្នក។ យើងបានផ្ញើកូដ 6 ខ្ទង់ ប្រសិនបើគណនីនេះមាន។',
    backendUnavailable: 'មិនអាចភ្ជាប់ទៅ Server បានទេ។',
    enterCode: 'សូមបញ្ចូលកូដ 6 ខ្ទង់។',
    passwordTooShort: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួអក្សរ។',
    passwordsMismatch: 'ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។',
    resetFailed: 'មិនអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញបានទេ។',
    forgotPassword: 'ភ្លេចពាក្យសម្ងាត់',
    enterResetCode: 'បញ្ចូលកូដកំណត់ឡើងវិញ',
    emailSubtitle: 'បញ្ចូល Gmail របស់អ្នក ហើយយើងនឹងផ្ញើកូដ 6 ខ្ទង់ទៅអ្នក។',
    resetSubtitle: 'បញ្ចូលកូដ 6 ខ្ទង់ពីអ៊ីមែល ហើយបង្កើតពាក្យសម្ងាត់ថ្មី។',
    gmail: 'Gmail',
    sending: 'កំពុងផ្ញើ...',
    sendOtp: 'ផ្ញើកូដ OTP',
    otpCode: 'កូដ OTP',
    otpDigit: 'ខ្ទង់ OTP ទី {{number}}',
    newPassword: 'ពាក្យសម្ងាត់ថ្មី',
    newPasswordPlaceholder: 'ពាក្យសម្ងាត់ថ្មី',
    showPassword: 'បង្ហាញពាក្យសម្ងាត់',
    hidePassword: 'លាក់ពាក្យសម្ងាត់',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
    confirmPasswordPlaceholder: 'បញ្ជាក់ពាក្យសម្ងាត់',
    changing: 'កំពុងផ្លាស់ប្តូរ...',
    changePassword: 'ផ្លាស់ប្តូរពាក្យសម្ងាត់',
    resendCode: 'ផ្ញើកូដម្តងទៀត',
    rememberPassword: 'ចងចាំពាក្យសម្ងាត់របស់អ្នកវិញហើយ?',
    login: 'ចូលគណនី',
  },
  zh: {
    enterGmail: '请输入你的 Gmail。',
    sendFailed: '无法发送重置验证码。',
    emailNotConfigured: '邮件发送服务尚未配置。请联系管理员启用邮件服务。',
    checkEmail: '请检查你的邮箱。如果该账号存在，我们已发送一个 6 位重置验证码。',
    backendUnavailable: '无法连接到服务器。',
    enterCode: '请输入 6 位验证码。',
    passwordTooShort: '密码至少需要 6 个字符。',
    passwordsMismatch: '密码与确认密码不一致。',
    resetFailed: '无法重置密码。',
    forgotPassword: '忘记密码',
    enterResetCode: '输入重置验证码',
    emailSubtitle: '输入你的 Gmail，我们会发送一个 6 位重置验证码。',
    resetSubtitle: '输入邮件中的 6 位验证码并创建新密码。',
    gmail: 'Gmail',
    sending: '发送中...',
    sendOtp: '发送 OTP 验证码',
    otpCode: 'OTP 验证码',
    otpDigit: 'OTP 第 {{number}} 位',
    newPassword: '新密码',
    newPasswordPlaceholder: '新密码',
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '确认密码',
    changing: '更改中...',
    changePassword: '更改密码',
    resendCode: '重新发送验证码',
    rememberPassword: '想起密码了？',
    login: '登录',
  },
  ja: {
    enterGmail: 'Gmail を入力してください。',
    sendFailed: 'リセットコードを送信できませんでした。',
    emailNotConfigured: 'メール送信がまだ設定されていません。管理者にメールサービスの有効化を依頼してください。',
    checkEmail: 'メールを確認してください。このアカウントが存在する場合、6桁のリセットコードを送信しました。',
    backendUnavailable: 'サーバーに接続できません。',
    enterCode: '6桁のコードを入力してください。',
    passwordTooShort: 'パスワードは6文字以上にしてください。',
    passwordsMismatch: 'パスワードと確認用パスワードが一致しません。',
    resetFailed: 'パスワードをリセットできませんでした。',
    forgotPassword: 'パスワードを忘れた場合',
    enterResetCode: 'リセットコードを入力',
    emailSubtitle: 'Gmail を入力すると、6桁のリセットコードを送信します。',
    resetSubtitle: 'メールの6桁コードを入力して、新しいパスワードを作成してください。',
    gmail: 'Gmail',
    sending: '送信中...',
    sendOtp: 'OTPコードを送信',
    otpCode: 'OTPコード',
    otpDigit: 'OTP {{number}} 桁目',
    newPassword: '新しいパスワード',
    newPasswordPlaceholder: '新しいパスワード',
    showPassword: 'パスワードを表示',
    hidePassword: 'パスワードを隠す',
    confirmPassword: 'パスワード確認',
    confirmPasswordPlaceholder: 'パスワードを確認',
    changing: '変更中...',
    changePassword: 'パスワードを変更',
    resendCode: 'コードを再送信',
    rememberPassword: 'パスワードを思い出しましたか？',
    login: 'ログイン',
  },
  ko: {
    enterGmail: 'Gmail을 입력해 주세요.',
    sendFailed: '재설정 코드를 보내지 못했습니다.',
    emailNotConfigured: '이메일 전송 서비스가 아직 설정되지 않았습니다. 관리자에게 이메일 서비스를 활성화해 달라고 요청해 주세요.',
    checkEmail: '이메일을 확인해 주세요. 계정이 존재하는 경우 6자리 재설정 코드를 보냈습니다.',
    backendUnavailable: '서버에 연결할 수 없습니다.',
    enterCode: '6자리 코드를 입력해 주세요.',
    passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다.',
    passwordsMismatch: '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
    resetFailed: '비밀번호를 재설정하지 못했습니다.',
    forgotPassword: '비밀번호 찾기',
    enterResetCode: '재설정 코드 입력',
    emailSubtitle: 'Gmail을 입력하면 6자리 재설정 코드를 보내드립니다.',
    resetSubtitle: '이메일의 6자리 코드를 입력하고 새 비밀번호를 만드세요.',
    gmail: 'Gmail',
    sending: '전송 중...',
    sendOtp: 'OTP 코드 보내기',
    otpCode: 'OTP 코드',
    otpDigit: 'OTP {{number}}번째 자리',
    newPassword: '새 비밀번호',
    newPasswordPlaceholder: '새 비밀번호',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기',
    confirmPassword: '비밀번호 확인',
    confirmPasswordPlaceholder: '비밀번호 확인',
    changing: '변경 중...',
    changePassword: '비밀번호 변경',
    resendCode: '코드 다시 보내기',
    rememberPassword: '비밀번호가 기억나셨나요?',
    login: '로그인',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const otpRefs = useRef([])

  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const otp = otpDigits.join('')

  function updateOtpDigit(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const nextDigits = [...otpDigits]

    nextDigits[index] = digit
    setOtpDigits(nextDigits)

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(event) {
    event.preventDefault()

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (!pasted) return

    const nextDigits = ['', '', '', '', '', '']

    pasted.split('').forEach((digit, index) => {
      nextDigits[index] = digit
    })

    setOtpDigits(nextDigits)

    const focusIndex = Math.min(pasted.length, 6) - 1
    otpRefs.current[focusIndex]?.focus()
  }

  async function handleSendOtp(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError(t('forgotPasswordPage.enterGmail'))
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        setError(
          data.message || t('forgotPasswordPage.sendFailed')
        )
        return
      }

      if (data.email_sent === false) {
        setError(t('forgotPasswordPage.emailNotConfigured'))
        return
      }

      setEmail(cleanEmail)
      setOtpDigits(['', '', '', '', '', ''])
      setStep('reset')
      setMessage(t('forgotPasswordPage.checkEmail'))

      setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 80)
    } catch {
      setError(t('forgotPasswordPage.backendUnavailable'))
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError(t('forgotPasswordPage.enterGmail'))
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(t('forgotPasswordPage.enterCode'))
      return
    }

    if (password.length < 6) {
      setError(t('forgotPasswordPage.passwordTooShort'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('forgotPasswordPage.passwordsMismatch'))
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
          email: cleanEmail,
          otp,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        setError(
          data.message || t('forgotPasswordPage.resetFailed')
        )
        return
      }

      localStorage.setItem('shadow_reader_token', data.token)
      localStorage.setItem('shadow_reader_user', JSON.stringify(data.user))
      sessionStorage.setItem('shadow_reader_token', data.token)
      sessionStorage.setItem('shadow_reader_user', JSON.stringify(data.user))

      navigate('/me', { replace: true })
    } catch {
      setError(t('forgotPasswordPage.backendUnavailable'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3fa] px-4 py-8">
      <section className="mx-auto max-w-[430px] rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-white">
            <i className="fa-solid fa-key text-[20px]" />
          </div>

          <h1 className="text-[25px] font-extrabold tracking-tight text-[#111827]">
            {step === 'email'
              ? t('forgotPasswordPage.forgotPassword')
              : t('forgotPasswordPage.enterResetCode')}
          </h1>

          <p className="mx-auto mt-2 max-w-[310px] text-[13px] leading-5 text-[#8d94a1]">
            {step === 'email'
              ? t('forgotPasswordPage.emailSubtitle')
              : t('forgotPasswordPage.resetSubtitle')}
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mb-4 rounded-[14px] bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold leading-5 text-[#067647]">
            {message}
          </div>
        ) : null}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">
                {t('forgotPasswordPage.gmail')}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="yourname@gmail.com"
                autoComplete="email"
                className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
            >
              {loading
                ? t('forgotPasswordPage.sending')
                : t('forgotPasswordPage.sendOtp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">
                {t('forgotPasswordPage.gmail')}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="yourname@gmail.com"
                autoComplete="email"
                className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">
                {t('forgotPasswordPage.otpCode')}
              </span>
              <div className="grid grid-cols-6 gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] = element
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      updateOtpDigit(index, event.target.value)
                    }
                    onKeyDown={(event) =>
                      handleOtpKeyDown(index, event)
                    }
                    onPaste={handleOtpPaste}
                    aria-label={t(
                      'forgotPasswordPage.otpDigit',
                      { number: index + 1 }
                    )}
                    className="h-12 rounded-[14px] border border-[#d9dce3] bg-white text-center text-[20px] font-extrabold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-[#fafafe] focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
                  />
                ))}
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">
                {t('forgotPasswordPage.newPassword')}
              </span>
              <div className="flex h-12 items-center rounded-[16px] border border-[#d9dce3] bg-white px-4 focus-within:border-[#111827]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t(
                    'forgotPasswordPage.newPasswordPlaceholder'
                  )}
                  autoComplete="new-password"
                  className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1]"
                  aria-label={
                    showPassword
                      ? t('forgotPasswordPage.hidePassword')
                      : t('forgotPasswordPage.showPassword')
                  }
                >
                  <i
                    className={`${
                      showPassword ? 'far fa-eye-slash' : 'far fa-eye'
                    } text-[15px]`}
                  />
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">
                {t('forgotPasswordPage.confirmPassword')}
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={t(
                  'forgotPasswordPage.confirmPasswordPlaceholder'
                )}
                autoComplete="new-password"
                className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
            >
              {loading
                ? t('forgotPasswordPage.changing')
                : t('forgotPasswordPage.changePassword')}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="h-11 w-full rounded-[16px] border border-[#d9dce3] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('forgotPasswordPage.resendCode')}
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-[13px] font-bold text-[#8d94a1]">
          {t('forgotPasswordPage.rememberPassword')}{' '}
          <Link to="/login" className="text-[#111827]">
            {t('forgotPasswordPage.login')}
          </Link>
        </div>
      </section>
    </main>
  )
}

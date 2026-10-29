import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
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
    resetSubtitle: 'Enter the 6-digit code sent to your email.',
    otpStepSubtitle: 'Enter the 6-digit code sent to your email.',
    passwordStepTitle: 'Create New Password',
    passwordStepSubtitle: 'Choose a strong password to secure your account.',
    continue: 'Continue',
    back: 'Back',
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
    didntReceive: "Don't receive the code?",
    verifying: 'Verifying code...',
    invalidCode: 'Incorrect or expired code. Please try again.',
    verified: 'Verified and secure',
    verifyUnavailable: 'Unable to verify the code right now. Check your connection and try again.',
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
    resetSubtitle: 'បញ្ចូលកូដ 6 ខ្ទង់ដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នក។',
    otpStepSubtitle: 'បញ្ចូលកូដ ៦ ខ្ទង់ដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នក។',
    passwordStepTitle: 'បង្កើតពាក្យសម្ងាត់ថ្មី',
    passwordStepSubtitle: 'កំណត់ពាក្យសម្ងាត់រឹងមាំសម្រាប់គណនីរបស់អ្នក។',
    continue: 'បន្ត',
    back: 'ត្រឡប់ក្រោយ',
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
    didntReceive: 'មិនបានទទួលកូដមែនទេ?',
    verifying: 'កំពុងផ្ទៀងផ្ទាត់កូដ...',
    invalidCode: 'កូដមិនត្រឹមត្រូវ ឬផុតកំណត់។ សូមព្យាយាមម្តងទៀត។',
    verified: 'បានផ្ទៀងផ្ទាត់ដោយសុវត្ថិភាព',
    verifyUnavailable: 'មិនអាចផ្ទៀងផ្ទាត់កូដបានឥឡូវនេះ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។',
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
    resetSubtitle: '输入发送到邮箱的 6 位验证码。',
    otpStepSubtitle: '输入发送到邮箱的 6 位验证码。',
    passwordStepTitle: '创建新密码',
    passwordStepSubtitle: '设置安全的新密码以保护账户。',
    continue: '继续',
    back: '返回',
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
    didntReceive: '没有收到验证码？',
    verifying: '正在验证...',
    invalidCode: '验证码错误或已过期，请重试。',
    verified: '验证成功，安全可靠',
    verifyUnavailable: '暂时无法验证，请检查网络后重试。',
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
    resetSubtitle: 'メールで届いた6桁のコードを入力してください。',
    otpStepSubtitle: 'メールに届いた6桁のコードを入力してください。',
    passwordStepTitle: '新しいパスワードを作成',
    passwordStepSubtitle: '安全な新しいパスワードを設定してください。',
    continue: '続ける',
    back: '戻る',
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
    didntReceive: 'コードが届きませんか？',
    verifying: '確認中...',
    invalidCode: 'コードが間違っているか期限切れです。再入力してください。',
    verified: '安全に認証されました',
    verifyUnavailable: '確認できませんでした。接続を確認して再試行してください。',
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
    resetSubtitle: '이메일로 받은 6자리 코드를 입력하세요.',
    otpStepSubtitle: '이메일로 전송된 6자리 코드를 입력하세요.',
    passwordStepTitle: '새 비밀번호 만들기',
    passwordStepSubtitle: '계정을 보호할 새 비밀번호를 설정하세요.',
    continue: '계속',
    back: '뒤로',
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
    didntReceive: '코드를 받지 못하셨나요?',
    verifying: '코드를 확인하는 중...',
    invalidCode: '코드가 잘못되었거나 만료되었습니다. 다시 시도해 주세요.',
    verified: '안전하게 인증되었습니다',
    verifyUnavailable: '지금 코드를 확인할 수 없습니다. 연결 확인 후 다시 시도해 주세요.',
    rememberPassword: '비밀번호가 기억나셨나요?',
    login: '로그인',
  },
})

const EMPTY_OTP = ['', '', '', '', '', '']
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const otpRefs = useRef([])
  const verifyControllerRef = useRef(null)
  const translateRef = useRef(t)
  translateRef.current = t
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otpDigits, setOtpDigits] = useState([...EMPTY_OTP])
  const [phase, setPhase] = useState('entry')
  const [activeIndex, setActiveIndex] = useState(0)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resendBusy, setResendBusy] = useState(false)
  const [error, setError] = useState('')
  const otp = otpDigits.join('')
  const locked = phase !== 'entry' || busy || resendBusy

  useEffect(() => {
    if (step === 'otp' && phase === 'entry' && otp.length === 0) {
      otpRefs.current[0]?.focus()
    }
  }, [step, phase])

  useEffect(() => {
    if (step !== 'otp' || !/^\d{6}$/.test(otp)) return undefined
    const controller = new AbortController()
    verifyControllerRef.current = controller
    let live = true
    setPhase('checking')
    setError('')

    async function verify() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/verify-reset-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
          signal: controller.signal,
        })
        const data = await response.json().catch(() => ({}))
        if (!live) return
        if (response.ok && data.ok === true && data.verified === true) {
          setPhase('success')
          return
        }
        if (response.status === 400 &&
            ['INVALID_RESET_OTP', 'RESET_OTP_TOO_MANY_ATTEMPTS'].includes(data.code)) {
          setError(data.code === 'RESET_OTP_TOO_MANY_ATTEMPTS'
            ? data.message || translateRef.current('forgotPasswordPage.invalidCode')
            : translateRef.current('forgotPasswordPage.invalidCode'))
          setPhase('invalid')
          return
        }
        setError(data.message || translateRef.current('forgotPasswordPage.verifyUnavailable'))
        setOtpDigits([...EMPTY_OTP])
        setPhase('entry')
      } catch (fetchError) {
        if (!live || fetchError.name === 'AbortError') return
        setError(translateRef.current('forgotPasswordPage.verifyUnavailable'))
        setOtpDigits([...EMPTY_OTP])
        setPhase('entry')
      }
    }
    verify()
    return () => {
      live = false
      controller.abort()
      if (verifyControllerRef.current === controller) verifyControllerRef.current = null
    }
  }, [otp, email, step])

  useEffect(() => {
    if (phase !== 'invalid') return undefined
    const timer = window.setTimeout(() => {
      setOtpDigits([...EMPTY_OTP])
      setActiveIndex(0)
      setPhase('entry')
    }, 950)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'success') return undefined
    const timer = window.setTimeout(() => {
      setPhase('entry')
      setStep('password')
      setError('')
    }, 1280)
    return () => window.clearTimeout(timer)
  }, [phase])

  function enterDigits(index, value) {
    if (locked) return
    const raw = String(value || '').replace(/\D/g, '')
    setError('')
    if (!raw) {
      setOtpDigits((old) => old.map((item, i) => (i === index ? '' : item)))
      return
    }
    if (raw.length > 1) {
      const next = [...EMPTY_OTP]
      raw.slice(0, 6 - index).split('').forEach((digit, i) => { next[index + i] = digit })
      setOtpDigits(next)
      otpRefs.current[Math.min(index + raw.length, 5)]?.focus()
      return
    }
    setOtpDigits((old) => old.map((item, i) => (i === index ? raw : item)))
    if (index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index, event) {
    if (locked) return
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      event.preventDefault()
      setOtpDigits((old) => old.map((item, i) => (i === index - 1 ? '' : item)))
      otpRefs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpPaste(event) {
    if (locked) return
    const raw = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!raw) return
    event.preventDefault()
    const next = [...EMPTY_OTP]
    raw.split('').forEach((digit, index) => { next[index] = digit })
    setOtpDigits(next)
    setError('')
    otpRefs.current[Math.min(raw.length, 5)]?.focus()
  }

  async function sendOtp(event) {
    event?.preventDefault()
    if (busy || resendBusy) return
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setError(t('forgotPasswordPage.enterGmail'))
      return
    }
    setError('')
    const resending = step === 'otp'
    if (resending) setResendBusy(true)
    else setBusy(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        setError(data.message || t('forgotPasswordPage.sendFailed'))
        return
      }
      if (data.email_sent === false) {
        setError(t('forgotPasswordPage.emailNotConfigured'))
        return
      }
      verifyControllerRef.current?.abort()
      setEmail(cleanEmail)
      setOtpDigits([...EMPTY_OTP])
      setActiveIndex(0)
      setPhase('entry')
      setPassword('')
      setConfirmPassword('')
      setStep('otp')
    } catch {
      setError(t('forgotPasswordPage.backendUnavailable'))
    } finally {
      setBusy(false)
      setResendBusy(false)
    }
  }

  async function resetPassword(event) {
    event.preventDefault()
    if (busy || step !== 'password') return
    setError('')
    if (password.length < 6) {
      setError(t('forgotPasswordPage.passwordTooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('forgotPasswordPage.passwordsMismatch'))
      return
    }
    setBusy(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp, password, confirmPassword }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        if (response.status === 400 && /code|attempt|expired/i.test(String(data.message || ''))) {
          setOtpDigits([...EMPTY_OTP])
          setPhase('entry')
          setStep('otp')
        }
        setError(data.message || t('forgotPasswordPage.resetFailed'))
        return
      }
      if (data.token && data.user) {
        localStorage.setItem('shadow_reader_token', data.token)
        localStorage.setItem('shadow_reader_user', JSON.stringify(data.user))
        sessionStorage.setItem('shadow_reader_token', data.token)
        sessionStorage.setItem('shadow_reader_user', JSON.stringify(data.user))
      }
      navigate(data.token && data.user ? '/me' : '/login', { replace: true })
    } catch {
      setError(t('forgotPasswordPage.backendUnavailable'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="app-page min-h-screen bg-[#f5f3fa] px-4 py-9 dark:bg-[var(--shadow-bg-page)]">
      <style>{`
        @keyframes shLockFloat {0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes shLiquidRise {from{transform:translateY(110%)}to{transform:translateY(0)}}
        @keyframes shLiquidRipple {0%,100%{transform:translateX(0) rotate(0)}50%{transform:translateX(2px) rotate(-2deg)}}
        @keyframes shWrong {0%,100%{transform:translateY(0) translateX(0)}20%{transform:translateY(-5px) translateX(-3px)}40%{transform:translateY(1px) translateX(4px)}60%{transform:translateY(-4px) translateX(-2px)}80%{transform:translateY(0) translateX(2px)}}
        @keyframes shMerge {0%{opacity:1;transform:translateX(0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateX(var(--shMove)) scale(.18)}}
        @keyframes shSuccess {0%,35%{opacity:0;transform:scale(.65)}60%{opacity:1;transform:scale(1.07)}100%{opacity:1;transform:scale(1)}}
        @keyframes shFadeIn {from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        .sh-step{animation:shFadeIn .28s ease-out both}
        .sh-lock-float{animation:shLockFloat 2.8s ease-in-out infinite}
        .sh-otp-cell{position:relative;z-index:1;min-width:0;flex:1;height:56px;overflow:hidden;border:1px solid #dbe1eb;border-radius:12px;background:#fff;transition:border-color .18s}
        .sh-otp-cell.sh-current{border-color:#4797e9;box-shadow:0 0 0 2px rgba(58,134,226,.07)}
        .sh-otp-liquid{position:absolute;bottom:0;left:0;right:0;height:76%;background:linear-gradient(180deg,#62b6f9 0%,#348bf3 38%,#2079e8 100%);animation:shLiquidRise .42s cubic-bezier(.16,.7,.25,1) both;will-change:transform}
        .sh-otp-liquid:before{content:'';position:absolute;top:-4px;left:-8%;width:116%;height:8px;border-radius:50%;background:#73befb;animation:shLiquidRipple .55s ease-in-out 1}
        .sh-otp-digit{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:800;color:#fff;text-shadow:0 1px 1px rgba(19,70,160,.18)}
        .sh-otp-cell.sh-invalid{border-color:#e97171;animation:shWrong .48s ease-in-out both}
        .sh-otp-cell.sh-invalid .sh-otp-liquid{background:linear-gradient(180deg,#fecaca,#f87171)}
        .sh-otp-cell.sh-invalid .sh-otp-digit{color:#991b1b;text-shadow:none}
        .sh-otp-cell.sh-invalid .sh-otp-liquid:before{background:#f6a7a5}
        .sh-otp-row.sh-merge .sh-otp-cell{animation:shMerge .61s cubic-bezier(.3,.05,.65,1) both}
        .sh-otp-tick{animation:shSuccess 1.2s ease-out both}
        @media(prefers-reduced-motion:reduce){.sh-step,.sh-lock-float,.sh-otp-liquid,.sh-otp-liquid:before,.sh-otp-cell.sh-invalid,.sh-otp-row.sh-merge .sh-otp-cell,.sh-otp-tick{animation:none!important}.sh-otp-row.sh-merge .sh-otp-cell{opacity:0}.sh-otp-tick{opacity:1}}
      `}</style>
      <section className="mx-auto w-full max-w-[430px] rounded-[26px] bg-white px-5 pb-6 pt-7 shadow-[0_14px_38px_rgba(17,24,39,.055)] ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:ring-white/10">
        <div className="mb-8 text-center">
          <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-white ${step === 'otp' && phase === 'entry' && otp.length === 0 ? 'sh-lock-float' : ''}`}>
            <i className={`fa-solid ${step === 'otp' ? 'fa-lock-open' : 'fa-key'} text-[21px]`} aria-hidden="true" />
          </div>
          <h1 className="text-[24px] font-extrabold tracking-tight text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {step === 'email' ? t('forgotPasswordPage.forgotPassword') : step === 'password' ? t('forgotPasswordPage.passwordStepTitle') : t('forgotPasswordPage.enterResetCode')}
          </h1>
          <p className="mx-auto mt-2 max-w-[315px] text-[13px] leading-5 text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
            {step === 'email' ? t('forgotPasswordPage.emailSubtitle') : step === 'password' ? t('forgotPasswordPage.passwordStepSubtitle') : t('forgotPasswordPage.otpStepSubtitle')}
          </p>
        </div>
        {error && phase !== 'invalid' && (
          <div role="alert" className="mb-4 rounded-xl bg-red-50 px-3 py-2.5 text-center text-[12px] font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">{error}</div>
        )}
        {step === 'email' && (
          <form onSubmit={sendOtp} className="space-y-4 sh-step">
            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">{t('forgotPasswordPage.gmail')}</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" autoComplete="email" className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)]" />
            </label>
            <button disabled={busy} type="submit" className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white disabled:opacity-60">{busy ? t('forgotPasswordPage.sending') : t('forgotPasswordPage.sendOtp')}</button>
            <p className="pt-2 text-center text-[13px] font-semibold text-[#8d94a1]">{t('forgotPasswordPage.rememberPassword')} <Link to="/login" className="text-[#111827] dark:text-white">{t('forgotPasswordPage.login')}</Link></p>
          </form>
        )}
        {step === 'otp' && (
          <div className="sh-step">
            <div className="relative mx-auto mt-6 mb-8 max-w-[366px]" role="group" aria-label={t('forgotPasswordPage.otpCode')}>
              <div className="pointer-events-none absolute left-5 right-5 top-[27px] h-[3px] rounded-full bg-[#d8e1ee] dark:bg-[#344052]" />
              <div className={`sh-otp-row relative flex gap-[7px] ${phase === 'success' ? 'sh-merge' : ''}`}>
                {otpDigits.map((digit, index) => (
                  <div key={index} className={`sh-otp-cell ${phase === 'invalid' ? 'sh-invalid' : ''} ${activeIndex === index && phase === 'entry' ? 'sh-current' : ''} dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)]`} style={{ '--shMove': `${(2.5 - index) * 116}%` }}>
                    {digit && <span className="sh-otp-liquid" aria-hidden="true" />}
                    {digit && <span className="sh-otp-digit" aria-hidden="true">{digit}</span>}
                    <input
                      ref={(el) => { otpRefs.current[index] = el }}
                      type="text" inputMode="numeric" pattern="[0-9]*"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={index === 0 ? 6 : 1}
                      value={digit}
                      onChange={(e) => enterDigits(index, e.target.value)}
                      onFocus={() => setActiveIndex(index)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      disabled={locked}
                      aria-label={t('forgotPasswordPage.otpDigit', { number: index + 1 })}
                      className="absolute inset-0 z-10 h-full w-full cursor-text border-0 bg-transparent text-center text-[21px] text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-default"
                    />
                  </div>
                ))}
              </div>
              {phase === 'success' && (
                <div className="sh-otp-tick pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center" role="status" aria-label={t('forgotPasswordPage.verified')}>
                  <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#16c784] text-white shadow-[0_4px_12px_rgba(22,199,132,.12)]"><i className="fa-solid fa-check text-[24px]" aria-hidden="true" /></div>
                </div>
              )}
            </div>
            <div className="min-h-[18px] text-center" aria-live="polite">
              {phase === 'invalid' ? <span className="text-[12px] font-semibold text-[#d83c42]">{error || translateRef.current('forgotPasswordPage.invalidCode')}</span> : phase === 'checking' ? <span className="text-[12px] text-[#8d94a1]">{t('forgotPasswordPage.verifying')}</span> : phase === 'success' ? <span className="text-[12px] font-semibold text-[#18a56a]">{t('forgotPasswordPage.verified')}</span> : null}
            </div>
            {phase !== 'success' && <p className="mt-5 text-center text-[13px] font-medium text-[#7d8798] dark:text-[var(--shadow-text-secondary)]">{t('forgotPasswordPage.didntReceive')}{' '}<button type="button" disabled={resendBusy || busy || phase === 'checking' || phase === 'invalid'} onClick={sendOtp} className="font-bold text-[#2679e6] no-underline disabled:opacity-50">{t('forgotPasswordPage.resendCode')}</button></p>}
          </div>
        )}
        {step === 'password' && (
          <form onSubmit={resetPassword} className="space-y-4 sh-step">
            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">{t('forgotPasswordPage.newPassword')}</span>
              <div className="flex h-12 items-center rounded-[16px] border border-[#d9dce3] bg-white px-4 focus-within:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)]">
                <input type={showPassword ? 'text' : 'password'} minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('forgotPasswordPage.newPasswordPlaceholder')} className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af] dark:text-[var(--shadow-text-primary)]" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="ml-3 text-[#8d94a1]" aria-label={showPassword ? t('forgotPasswordPage.hidePassword') : t('forgotPasswordPage.showPassword')}><i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /></button>
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">{t('forgotPasswordPage.confirmPassword')}</span>
              <input type={showPassword ? 'text' : 'password'} minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('forgotPasswordPage.confirmPasswordPlaceholder')} className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)]" />
            </label>
            <button type="submit" disabled={busy} className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white disabled:opacity-60">{busy ? t('forgotPasswordPage.changing') : t('forgotPasswordPage.changePassword')}</button>
          </form>
        )}
      </section>
    </main>
  )
}

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('loginPage', {
  en: {
    loginFailed: 'Login failed',
    serverStarting: 'The server is starting up. This may take 30–60 seconds. Please try again shortly.',
    goBack: 'Go back',
    welcomeBack: 'Welcome Back',
    subtitle: 'Login to continue reading and save your progress.',
    email: 'Email or Username',
    emailPlaceholder: 'Email, username, or @username',
    password: 'Password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loggingIn: 'Logging in...',
    login: 'Login',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    verificationTitle: 'Verify your login',
    verificationSubtitle: 'Complete the required security checks to sign in.',
    emailCode: '6-digit email code',
    pin: '6-digit PIN',
    verify: 'Verify and log in',
    verifying: 'Verifying...',
    cancelVerification: 'Return to login',
    emailCodeRequired: 'Please enter the 6-digit email code.',
    pinRequired: 'Please enter your 6-digit PIN.',
    verificationFailed: 'Login verification failed.',
  },
  km: {
    loginFailed: 'ចូលគណនីមិនបានទេ',
    serverStarting: 'Server កំពុងចាប់ផ្តើម។ វាអាចចំណាយពេល 30–60 វិនាទី។ សូមសាកម្តងទៀតបន្តិចក្រោយ។',
    goBack: 'ត្រឡប់ក្រោយ',
    welcomeBack: 'ស្វាគមន៍ការត្រឡប់មកវិញ',
    subtitle: 'ចូលគណនីដើម្បីបន្តអាន និងរក្សាទុកវឌ្ឍនភាពរបស់អ្នក។',
    email: 'អ៊ីមែល ឬ Username',
    emailPlaceholder: 'អ៊ីមែល, username ឬ @username',
    password: 'ពាក្យសម្ងាត់',
    hidePassword: 'លាក់ពាក្យសម្ងាត់',
    showPassword: 'បង្ហាញពាក្យសម្ងាត់',
    rememberMe: 'ចងចាំខ្ញុំ',
    forgotPassword: 'ភ្លេចពាក្យសម្ងាត់?',
    loggingIn: 'កំពុងចូលគណនី...',
    login: 'ចូលគណនី',
    noAccount: 'មិនទាន់មានគណនី?',
    signUp: 'ចុះឈ្មោះ',
    verificationTitle: 'ផ្ទៀងផ្ទាត់ការចូលគណនី',
    verificationSubtitle: 'សូមបំពេញការផ្ទៀងផ្ទាត់សុវត្ថិភាព ដើម្បីចូលគណនី។',
    emailCode: 'លេខកូដអ៊ីមែល ៦ ខ្ទង់',
    pin: 'PIN ៦ ខ្ទង់',
    verify: 'ផ្ទៀងផ្ទាត់ និងចូលគណនី',
    verifying: 'កំពុងផ្ទៀងផ្ទាត់...',
    cancelVerification: 'ត្រឡប់ទៅ Login',
    emailCodeRequired: 'សូមបញ្ចូលលេខកូដអ៊ីមែល ៦ ខ្ទង់។',
    pinRequired: 'សូមបញ្ចូល PIN ៦ ខ្ទង់។',
    verificationFailed: 'ផ្ទៀងផ្ទាត់ការចូលគណនីមិនបានទេ។',
  },
  zh: {
    loginFailed: '登录失败',
    serverStarting: '服务器正在启动，可能需要 30–60 秒。请稍后再试。',
    goBack: '返回',
    welcomeBack: '欢迎回来',
    subtitle: '登录以继续阅读并保存你的进度。',
    email: '邮箱或用户名',
    emailPlaceholder: '邮箱、用户名或 @用户名',
    password: '密码',
    hidePassword: '隐藏密码',
    showPassword: '显示密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    loggingIn: '登录中...',
    login: '登录',
    noAccount: '还没有账号？',
    signUp: '注册',
    verificationTitle: '验证登录',
    verificationSubtitle: '请完成安全验证以登录。',
    emailCode: '6位邮箱验证码',
    pin: '6位 PIN',
    verify: '验证并登录',
    verifying: '验证中...',
    cancelVerification: '返回登录',
    emailCodeRequired: '请输入6位邮箱验证码。',
    pinRequired: '请输入6位 PIN。',
    verificationFailed: '登录验证失败。',
  },
  ja: {
    loginFailed: 'ログインできませんでした',
    serverStarting: 'サーバーを起動しています。30～60秒ほどかかる場合があります。しばらくしてからもう一度お試しください。',
    goBack: '戻る',
    welcomeBack: 'おかえりなさい',
    subtitle: 'ログインして読書を続け、進捗を保存しましょう。',
    email: 'メールアドレスまたはユーザー名',
    emailPlaceholder: 'メール、ユーザー名、または @ユーザー名',
    password: 'パスワード',
    hidePassword: 'パスワードを隠す',
    showPassword: 'パスワードを表示',
    rememberMe: 'ログイン状態を保持',
    forgotPassword: 'パスワードを忘れた場合',
    loggingIn: 'ログイン中...',
    login: 'ログイン',
    noAccount: 'アカウントをお持ちでないですか？',
    signUp: '新規登録',
    verificationTitle: 'ログイン認証',
    verificationSubtitle: 'セキュリティ認証を完了してください。',
    emailCode: 'メールの6桁認証コード',
    pin: '6桁のPIN',
    verify: '認証してログイン',
    verifying: '認証中...',
    cancelVerification: 'ログイン画面へ戻る',
    emailCodeRequired: '6桁の認証コードを入力してください。',
    pinRequired: '6桁のPINを入力してください。',
    verificationFailed: 'ログイン認証に失敗しました。',
  },
  ko: {
    loginFailed: '로그인하지 못했습니다',
    serverStarting: '서버가 시작 중입니다. 30–60초 정도 걸릴 수 있습니다. 잠시 후 다시 시도해 주세요.',
    goBack: '뒤로 가기',
    welcomeBack: '다시 오신 것을 환영합니다',
    subtitle: '로그인하여 계속 읽고 진행 상황을 저장하세요.',
    email: '이메일 또는 사용자 이름',
    emailPlaceholder: '이메일, 사용자 이름 또는 @사용자이름',
    password: '비밀번호',
    hidePassword: '비밀번호 숨기기',
    showPassword: '비밀번호 표시',
    rememberMe: '로그인 상태 유지',
    forgotPassword: '비밀번호를 잊으셨나요?',
    loggingIn: '로그인 중...',
    login: '로그인',
    noAccount: '계정이 없으신가요?',
    signUp: '회원가입',
    verificationTitle: '로그인 인증',
    verificationSubtitle: '로그인을 위해 보안 인증을 완료해 주세요.',
    emailCode: '이메일 인증번호 6자리',
    pin: 'PIN 6자리',
    verify: '인증 후 로그인',
    verifying: '인증 중...',
    cancelVerification: '로그인으로 돌아가기',
    emailCodeRequired: '이메일 인증번호 6자리를 입력해 주세요.',
    pinRequired: 'PIN 6자리를 입력해 주세요.',
    verificationFailed: '로그인 인증에 실패했습니다.',
  },
})

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [emailCode, setEmailCode] = useState('')
  const [pin, setPin] = useState('')

  const finishLogin = (data) => {
    if (!data?.token || !data?.user) throw new Error(t('loginPage.loginFailed'))
    if (data.deviceKey) localStorage.setItem('shadow_reader_device_key', data.deviceKey)
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('shadow_reader_token', data.token)
    storage.setItem('shadow_reader_user', JSON.stringify(data.user))
    const otherStorage = rememberMe ? sessionStorage : localStorage
    otherStorage.removeItem('shadow_reader_token')
    otherStorage.removeItem('shadow_reader_user')
    navigate(location.state?.returnTo || '/me', {
      replace: true,
      state: location.state?.returnState,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          password,
          deviceKey: localStorage.getItem('shadow_reader_device_key') || '',
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || t('loginPage.loginFailed'))
      if (data.verification_required) {
        if (!data.challenge_id || !data.deviceKey) throw new Error(t('loginPage.loginFailed'))
        setChallenge({
          challengeId: data.challenge_id,
          deviceKey: data.deviceKey,
          emailRequired: Boolean(data.email_required),
          pinRequired: Boolean(data.pin_required),
        })
        setEmailCode('')
        setPin('')
        setPassword('')
        return
      }
      finishLogin(data)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? t('loginPage.serverStarting') : error.message || t('loginPage.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()
    setMessage('')
    if (challenge.emailRequired && !/^\d{6}$/.test(emailCode)) {
      setMessage(t('loginPage.emailCodeRequired'))
      return
    }
    if (challenge.pinRequired && !/^(?:\d{4}|\d{6})$/.test(pin)) {
      setMessage(t('loginPage.pinRequired'))
      return
    }
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/users/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: challenge.challengeId,
          deviceKey: challenge.deviceKey,
          code: challenge.emailRequired ? emailCode : '',
          pin: challenge.pinRequired ? pin : '',
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        if (['READER_LOGIN_CHALLENGE_EXPIRED', 'READER_LOGIN_RESTART_REQUIRED', 'READER_SECURITY_CODE_EXPIRED', 'READER_SESSION_LIMIT_REACHED'].includes(data.code)) {
          setChallenge(null)
          setPin('')
          setEmailCode('')
        }
        throw new Error(data.message || t('loginPage.verificationFailed'))
      }
      finishLogin(data)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? t('loginPage.serverStarting') : error.message || t('loginPage.verificationFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-page min-h-screen bg-[#f5f3fa] px-4 py-6 dark:bg-[var(--shadow-bg-page)]">
      <div className="mx-auto max-w-[430px]">
        <button type="button" onClick={() => challenge ? (setChallenge(null), setMessage(''), setPin(''), setEmailCode('')) : navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 transition hover:-translate-x-0.5 hover:bg-[#f7f7fb] active:scale-95 dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-primary)] dark:ring-white/10 dark:hover:bg-[var(--shadow-bg-hover)]"
          aria-label={t('loginPage.goBack')}>
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] ring-1 ring-black/5 dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] dark:ring-white/10">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <img src="/assets/Icons/Shadow%20Logo.svg" alt="Shadow" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {t(challenge ? 'loginPage.verificationTitle' : 'loginPage.welcomeBack')}
            </h1>
            <p className="mt-2 text-[13px] leading-5 text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
              {t(challenge ? 'loginPage.verificationSubtitle' : 'loginPage.subtitle')}
            </p>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300" role="alert">
              {message}
            </div>
          ) : null}

          {challenge ? (
            <form onSubmit={handleVerify}>
              {challenge.emailRequired ? (
                <>
                  <label htmlFor="reader-email-code" className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                    {t('loginPage.emailCode')}
                  </label>
                  <input id="reader-email-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                    value={emailCode} onChange={(event) => setEmailCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[16px] tracking-[0.2em] text-[#111827] outline-none focus:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)]" />
                </>
              ) : null}
              {challenge.pinRequired ? (
                <>
                  <label htmlFor="reader-login-pin" className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                    {t('loginPage.pin')}
                  </label>
                  <input id="reader-login-pin" type="password" inputMode="numeric" autoComplete="off" maxLength={6}
                  value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[16px] tracking-[0.2em] text-[#111827] outline-none focus:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)]" />
                </>
              ) : null}
              <button type="submit" disabled={loading}
                className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-60 dark:bg-gradient-to-r dark:from-[#7c3aed] dark:to-[#a78bfa]">
                {t(loading ? 'loginPage.verifying' : 'loginPage.verify')}
              </button>
              <button type="button" disabled={loading}
                onClick={() => { setChallenge(null); setMessage(''); setEmailCode(''); setPin('') }}
                className="mt-3 h-11 w-full rounded-[14px] border border-[#e5e7eb] text-[13px] font-bold text-[#111827] dark:border-[var(--shadow-border)] dark:text-[var(--shadow-text-primary)] disabled:opacity-60">
                {t('loginPage.cancelVerification')}
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <label className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                  {t('loginPage.email')}
                </label>
                <input type="text" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  placeholder={t('loginPage.emailPlaceholder')} value={identifier} onChange={(event) => setIdentifier(event.target.value)}
                  className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)]" />
                <label className="mb-2 block text-[13px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
                  {t('loginPage.password')}
                </label>
                <div className="mb-3 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)]">
                  <input type={showPassword ? 'text' : 'password'} placeholder={t('loginPage.password')}
                    value={password} onChange={(event) => setPassword(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af] dark:text-[var(--shadow-text-primary)]" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)}
                    className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1] transition hover:bg-[#f0f1f5] hover:text-[#111827] active:scale-95 dark:text-[var(--shadow-text-secondary)]"
                    aria-label={t(showPassword ? 'loginPage.hidePassword' : 'loginPage.showPassword')}>
                    <i className={`${showPassword ? 'far fa-eye-slash' : 'far fa-eye'} text-[15px]`} />
                  </button>
                </div>
                <div className="mb-5 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[12px] font-semibold text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-[#d1d5db] accent-[#111827] dark:border-[var(--shadow-border-strong)] dark:accent-[#a78bfa]" />
                    {t('loginPage.rememberMe')}
                  </label>
                  <Link to="/forgot-password" className="text-[12px] font-extrabold text-[#111827] transition hover:text-[#f6b800] dark:text-[var(--shadow-text-primary)]">
                    {t('loginPage.forgotPassword')}
                  </Link>
                </div>
                <button type="submit" disabled={loading}
                  className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b2233] active:scale-[0.99] disabled:opacity-60 dark:bg-gradient-to-r dark:from-[#7c3aed] dark:to-[#a78bfa]">
                  {t(loading ? 'loginPage.loggingIn' : 'loginPage.login')}
                </button>
              </form>
              <div className="mt-6 text-center text-[13px] text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
                {t('loginPage.noAccount')}{' '}
                <Link to="/register" className="font-extrabold text-[#111827] transition hover:text-[#f6b800] dark:text-[var(--shadow-text-primary)]">
                  {t('loginPage.signUp')}
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

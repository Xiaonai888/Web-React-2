import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerSecuritySettingsPage', {
  en: {
    title: 'Login security', back: 'Back to account & security', subtitle: 'Protect your Shadow account',
    loading: 'Loading security settings...', emailTitle: 'Email verification (2FA)',
    emailDescription: 'Require a 6-digit email code when you sign in.', pinTitle: '4-digit login PIN',
    pinDescription: 'Require your PIN when you sign in. Changes require an email code.',
    enabled: 'Enabled', disabled: 'Disabled', enable: 'Enable', disable: 'Disable',
    setupPin: 'Set up PIN', changePin: 'Change PIN', resetPin: 'Reset PIN',
    requestTitle: 'Verify your email', requestDescription: 'We sent a 6-digit code to your account email. It expires in 10 minutes.',
    code: 'Email code', pin: 'New 4-digit PIN', confirmPin: 'Confirm new PIN',
    confirm: 'Confirm', cancel: 'Cancel', sending: 'Sending...', saving: 'Saving...',
    codeRequired: 'Enter the 6-digit code.', pinRequired: 'Enter a 4-digit PIN.',
    pinsMismatch: 'The PINs do not match.', requestFailed: 'Could not send the verification email.',
    saveFailed: 'Could not update login security.', loadFailed: 'Could not load login security.',
    updated: 'Login security updated.', emailUnavailable: 'You need access to your account email to make this change.',
  },
  km: {
    title: 'សុវត្ថិភាពការចូលគណនី', back: 'ត្រឡប់ទៅគណនី និងសុវត្ថិភាព', subtitle: 'ការពារគណនី Shadow របស់អ្នក',
    loading: 'កំពុងផ្ទុកការកំណត់សុវត្ថិភាព...', emailTitle: 'ផ្ទៀងផ្ទាត់តាមអ៊ីមែល (2FA)',
    emailDescription: 'តម្រូវឱ្យបញ្ចូលកូដ ៦ ខ្ទង់ពីអ៊ីមែលពេលចូលគណនី។', pinTitle: 'PIN ចូលគណនី ៤ ខ្ទង់',
    pinDescription: 'តម្រូវឱ្យបញ្ចូល PIN ពេលចូលគណនី។ ការកែ PIN ត្រូវផ្ទៀងផ្ទាត់អ៊ីមែល។',
    enabled: 'បានបើក', disabled: 'បានបិទ', enable: 'បើក', disable: 'បិទ',
    setupPin: 'កំណត់ PIN', changePin: 'ប្តូរ PIN', resetPin: 'កំណត់ PIN ថ្មី',
    requestTitle: 'ផ្ទៀងផ្ទាត់អ៊ីមែល', requestDescription: 'យើងបានផ្ញើកូដ ៦ ខ្ទង់ទៅអ៊ីមែលគណនីរបស់អ្នក។ កូដផុតកំណត់ក្នុង ១០ នាទី។',
    code: 'កូដអ៊ីមែល', pin: 'PIN ថ្មី ៤ ខ្ទង់', confirmPin: 'បញ្ជាក់ PIN ថ្មី',
    confirm: 'បញ្ជាក់', cancel: 'បោះបង់', sending: 'កំពុងផ្ញើ...', saving: 'កំពុងរក្សាទុក...',
    codeRequired: 'សូមបញ្ចូលកូដ ៦ ខ្ទង់។', pinRequired: 'សូមបញ្ចូល PIN ៤ ខ្ទង់។',
    pinsMismatch: 'លេខ PIN ទាំងពីរមិនដូចគ្នា។', requestFailed: 'មិនអាចផ្ញើកូដផ្ទៀងផ្ទាត់បានទេ។',
    saveFailed: 'មិនអាចកែការកំណត់សុវត្ថិភាពបានទេ។', loadFailed: 'មិនអាចផ្ទុកការកំណត់សុវត្ថិភាពបានទេ។',
    updated: 'បានកែការកំណត់សុវត្ថិភាព។', emailUnavailable: 'អ្នកត្រូវចូលប្រើអ៊ីមែលគណនី ដើម្បីធ្វើការកែប្រែនេះ។',
  },
  zh: {
    title: '登录安全', back: '返回账户与安全', subtitle: '保护您的 Shadow 账户',
    loading: '正在加载安全设置...', emailTitle: '邮箱验证 (2FA)',
    emailDescription: '登录时需要输入邮箱收到的6位验证码。', pinTitle: '4位登录 PIN',
    pinDescription: '登录时需要输入 PIN。修改 PIN 需验证邮箱。',
    enabled: '已开启', disabled: '已关闭', enable: '开启', disable: '关闭',
    setupPin: '设置 PIN', changePin: '更改 PIN', resetPin: '重置 PIN',
    requestTitle: '验证邮箱', requestDescription: '我们已向您的账户邮箱发送6位验证码，10分钟内有效。',
    code: '邮箱验证码', pin: '新的4位 PIN', confirmPin: '确认新 PIN',
    confirm: '确认', cancel: '取消', sending: '发送中...', saving: '保存中...',
    codeRequired: '请输入6位验证码。', pinRequired: '请输入4位 PIN。',
    pinsMismatch: '两次输入的 PIN 不一致。', requestFailed: '无法发送验证邮件。',
    saveFailed: '无法更新登录安全设置。', loadFailed: '无法加载登录安全设置。',
    updated: '登录安全设置已更新。', emailUnavailable: '更改此设置需要访问账户邮箱。',
  },
  ja: {
    title: 'ログインセキュリティ', back: 'アカウントとセキュリティに戻る', subtitle: 'Shadow アカウントを保護',
    loading: 'セキュリティ設定を読み込み中...', emailTitle: 'メール認証（2FA）',
    emailDescription: 'ログイン時にメールの6桁コードを要求します。', pinTitle: '4桁のログインPIN',
    pinDescription: 'ログイン時にPINを要求します。PINの変更にはメール認証が必要です。',
    enabled: '有効', disabled: '無効', enable: '有効にする', disable: '無効にする',
    setupPin: 'PINを設定', changePin: 'PINを変更', resetPin: 'PINをリセット',
    requestTitle: 'メールを認証', requestDescription: 'アカウントのメールに6桁のコードを送信しました。有効期限は10分です。',
    code: 'メールコード', pin: '新しい4桁のPIN', confirmPin: '新しいPINを再入力',
    confirm: '確認', cancel: 'キャンセル', sending: '送信中...', saving: '保存中...',
    codeRequired: '6桁のコードを入力してください。', pinRequired: '4桁のPINを入力してください。',
    pinsMismatch: 'PINが一致しません。', requestFailed: '認証メールを送信できませんでした。',
    saveFailed: 'ログインセキュリティを更新できませんでした。', loadFailed: 'セキュリティ設定を読み込めませんでした。',
    updated: 'ログインセキュリティを更新しました。', emailUnavailable: 'この変更にはアカウントのメールにアクセスする必要があります。',
  },
  ko: {
    title: '로그인 보안', back: '계정 및 보안으로 돌아가기', subtitle: 'Shadow 계정을 보호하세요',
    loading: '보안 설정을 불러오는 중...', emailTitle: '이메일 인증 (2FA)',
    emailDescription: '로그인할 때 이메일로 받은 6자리 코드를 입력합니다.', pinTitle: '4자리 로그인 PIN',
    pinDescription: '로그인할 때 PIN을 입력합니다. PIN 변경 시 이메일 인증이 필요합니다.',
    enabled: '켜짐', disabled: '꺼짐', enable: '켜기', disable: '끄기',
    setupPin: 'PIN 설정', changePin: 'PIN 변경', resetPin: 'PIN 재설정',
    requestTitle: '이메일 인증', requestDescription: '계정 이메일로 6자리 코드를 보냈습니다. 10분 후 만료됩니다.',
    code: '이메일 코드', pin: '새 4자리 PIN', confirmPin: '새 PIN 확인',
    confirm: '확인', cancel: '취소', sending: '전송 중...', saving: '저장 중...',
    codeRequired: '6자리 코드를 입력해 주세요.', pinRequired: '4자리 PIN을 입력해 주세요.',
    pinsMismatch: 'PIN이 일치하지 않습니다.', requestFailed: '인증 이메일을 보낼 수 없습니다.',
    saveFailed: '로그인 보안을 변경할 수 없습니다.', loadFailed: '보안 설정을 불러올 수 없습니다.',
    updated: '로그인 보안이 변경되었습니다.', emailUnavailable: '이 설정을 변경하려면 계정 이메일에 접근할 수 있어야 합니다.',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const PIN_PURPOSES = new Set(['setup_pin', 'change_pin', 'reset_pin'])

function authToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

export default function ReaderSecuritySettingsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [settings, setSettings] = useState(null)
  const [pending, setPending] = useState(null)
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true
    async function loadSettings() {
      const token = authToken()
      if (!token) {
        navigate('/login', { replace: true })
        return
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/security`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
        })
        const data = await response.json().catch(() => ({}))
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        if (!response.ok || data.ok === false) throw new Error(data.message || 'Unable to load security settings.')
        if (active) setSettings({ email: Boolean(data.email_2fa_enabled), pin: Boolean(data.pin_enabled) })
      } catch (error) {
        if (active) setErrorMessage(error.message || 'Unable to load security settings.')
      }
    }
    loadSettings()
    return () => { active = false }
  }, [navigate])

  async function requestAction(purpose) {
    if (busy || pending) return
    const token = authToken()
    if (!token) return navigate('/login', { replace: true })
    setBusy(true)
    setErrorMessage('')
    setMessage('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/security/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ purpose }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false || !data.challenge_id) {
        throw new Error(data.message || t('readerSecuritySettingsPage.requestFailed'))
      }
      setPending({ purpose, challengeId: data.challenge_id })
      setCode('')
      setPin('')
      setPinConfirm('')
    } catch (error) {
      setErrorMessage(error.message || t('readerSecuritySettingsPage.requestFailed'))
    } finally {
      setBusy(false)
    }
  }

  async function confirmAction(event) {
    event.preventDefault()
    if (busy || !pending) return
    if (!/^\d{6}$/.test(code)) {
      setErrorMessage(t('readerSecuritySettingsPage.codeRequired'))
      return
    }
    if (PIN_PURPOSES.has(pending.purpose)) {
      if (!/^\d{4}$/.test(pin)) {
        setErrorMessage(t('readerSecuritySettingsPage.pinRequired'))
        return
      }
      if (pin !== pinConfirm) {
        setErrorMessage(t('readerSecuritySettingsPage.pinsMismatch'))
        return
      }
    }
    const token = authToken()
    if (!token) return navigate('/login', { replace: true })
    setBusy(true)
    setErrorMessage('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/security/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          purpose: pending.purpose,
          challenge_id: pending.challengeId,
          code,
          ...(PIN_PURPOSES.has(pending.purpose) ? { pin } : {}),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || t('readerSecuritySettingsPage.saveFailed'))
      setSettings({ email: Boolean(data.email_2fa_enabled), pin: Boolean(data.pin_enabled) })
      setPending(null)
      setCode('')
      setPin('')
      setPinConfirm('')
      setMessage(t('readerSecuritySettingsPage.updated'))
    } catch (error) {
      setErrorMessage(error.message || t('readerSecuritySettingsPage.saveFailed'))
    } finally {
      setBusy(false)
    }
  }

  function cancelAction() {
    if (busy) return
    setPending(null)
    setCode('')
    setPin('')
    setPinConfirm('')
    setErrorMessage('')
  }

  const locked = busy || Boolean(pending)
  const actionClass = 'rounded-xl border border-[var(--shadow-border)] px-4 py-2.5 text-[13px] font-semibold transition active:bg-[var(--shadow-bg-hover)] disabled:opacity-50'

  return (
    <main className="app-page min-h-screen pb-10 text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate('/profile/settings/account-security')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('readerSecuritySettingsPage.back')}>
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>
          <div>
            <h1 className="text-[18px] font-extrabold">{t('readerSecuritySettingsPage.title')}</h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">{t('readerSecuritySettingsPage.subtitle')}</p>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] space-y-4 px-4 py-5">
        {errorMessage ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">{errorMessage}</div> : null}
        {message ? <div role="status" className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px]">{message}</div> : null}
        {!settings ? (
          <div className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-[13px]">{t('readerSecuritySettingsPage.loading')}</div>
        ) : (
          <>
            <section className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold">{t('readerSecuritySettingsPage.emailTitle')}</h2>
                <span className="text-[12px] text-[var(--shadow-text-secondary)]">{t(`readerSecuritySettingsPage.${settings.email ? 'enabled' : 'disabled'}`)}</span>
              </div>
              <p className="my-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerSecuritySettingsPage.emailDescription')}</p>
              <button type="button" disabled={locked} className={actionClass}
                onClick={() => requestAction(settings.email ? 'disable_email_2fa' : 'enable_email_2fa')}>
                {t(`readerSecuritySettingsPage.${settings.email ? 'disable' : 'enable'}`)}
              </button>
            </section>
            <section className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold">{t('readerSecuritySettingsPage.pinTitle')}</h2>
                <span className="text-[12px] text-[var(--shadow-text-secondary)]">{t(`readerSecuritySettingsPage.${settings.pin ? 'enabled' : 'disabled'}`)}</span>
              </div>
              <p className="my-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerSecuritySettingsPage.pinDescription')}</p>
              <div className="flex flex-wrap gap-2">
                {!settings.pin ? (
                  <button type="button" disabled={locked} className={actionClass} onClick={() => requestAction('setup_pin')}>{t('readerSecuritySettingsPage.setupPin')}</button>
                ) : (
                  <>
                    <button type="button" disabled={locked} className={actionClass} onClick={() => requestAction('change_pin')}>{t('readerSecuritySettingsPage.changePin')}</button>
                    <button type="button" disabled={locked} className={actionClass} onClick={() => requestAction('reset_pin')}>{t('readerSecuritySettingsPage.resetPin')}</button>
                    <button type="button" disabled={locked} className={actionClass} onClick={() => requestAction('disable_pin')}>{t('readerSecuritySettingsPage.disable')}</button>
                  </>
                )}
              </div>
            </section>
          </>
        )}
        {pending ? (
          <form onSubmit={confirmAction} className="space-y-3 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
            <h2 className="text-[15px] font-bold">{t('readerSecuritySettingsPage.requestTitle')}</h2>
            <p className="text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerSecuritySettingsPage.requestDescription')}</p>
            <label className="block text-[13px] font-semibold" htmlFor="reader-security-code">{t('readerSecuritySettingsPage.code')}</label>
            <input id="reader-security-code" inputMode="numeric" autoComplete="one-time-code" type="text" maxLength={6}
              value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              className="app-input h-12 w-full rounded-xl border px-3 text-[16px] tracking-widest" />
            {PIN_PURPOSES.has(pending.purpose) ? (
              <>
                <label className="block text-[13px] font-semibold" htmlFor="reader-security-pin">{t('readerSecuritySettingsPage.pin')}</label>
                <input id="reader-security-pin" inputMode="numeric" autoComplete="new-password" type="password" maxLength={4}
                  value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="app-input h-12 w-full rounded-xl border px-3 text-[16px] tracking-widest" />
                <label className="block text-[13px] font-semibold" htmlFor="reader-security-pin-confirm">{t('readerSecuritySettingsPage.confirmPin')}</label>
                <input id="reader-security-pin-confirm" inputMode="numeric" autoComplete="new-password" type="password" maxLength={4}
                  value={pinConfirm} onChange={(event) => setPinConfirm(event.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="app-input h-12 w-full rounded-xl border px-3 text-[16px] tracking-widest" />
              </>
            ) : null}
            <div className="flex gap-2 pt-2">
              <button type="button" disabled={busy} onClick={cancelAction} className={`flex-1 ${actionClass}`}>{t('readerSecuritySettingsPage.cancel')}</button>
              <button type="submit" disabled={busy} className="h-11 flex-1 rounded-xl bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]">
                {t(`readerSecuritySettingsPage.${busy ? 'saving' : 'confirm'}`)}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  )
}

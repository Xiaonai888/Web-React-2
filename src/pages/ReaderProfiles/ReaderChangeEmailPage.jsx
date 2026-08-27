import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
      text: 'You can change your email now.',
    }
  }

  const changedAt = new Date(updatedAt).getTime()
  const nextChangeAt = changedAt + EMAIL_CHANGE_COOLDOWN_MS
  const remaining = nextChangeAt - Date.now()

  if (!Number.isFinite(changedAt) || remaining <= 0) {
    return {
      locked: false,
      text: 'You can change your email now.',
    }
  }

  const days = Math.ceil(remaining / (24 * 60 * 60 * 1000))

  return {
    locked: true,
    text: `You can change your email again in ${days} day${days === 1 ? '' : 's'}.`,
  }
}

export default function ReaderChangeEmailPage() {
  const navigate = useNavigate()
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
          throw new Error(data.message || 'Failed to load account')
        }

        if (!ignore) {
          setUser(data.user || null)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error.message || 'Failed to load account')
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
      setMessage(cooldown.text)
      return
    }

    if (!newEmail || !currentPassword) {
      setSuccess(false)
      setMessage('Please enter your new email and current password.')
      return
    }

    try {
      setSaving(true)
      setMessage('')
      setSuccess(false)

      const response = await fetch(`${API_BASE_URL}/api/users/email-change/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
          current_password: currentPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to send verification code')
      }

      setNewEmail(data.new_email || newEmail.trim().toLowerCase())
      setCurrentPassword('')
      setOtp('')
      setStep('confirm')
      setSuccess(true)
      setMessage('Verification code sent to your new email.')
    } catch (error) {
      setSuccess(false)
      setMessage(error.message || 'Failed to send verification code')
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
      setMessage('Please enter the 6-digit verification code.')
      return
    }

    try {
      setSaving(true)
      setMessage('')
      setSuccess(false)

      const response = await fetch(`${API_BASE_URL}/api/users/email-change/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_email: newEmail,
          otp,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to change email')
      }

      if (data.token && data.user) {
        saveAuthSession(data.token, data.user)
      }

      setUser(data.user || user)
      setOtp('')
      setStep('done')
      setSuccess(true)
      setMessage('Email changed successfully.')
    } catch (error) {
      setSuccess(false)
      setMessage(error.message || 'Failed to change email')
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
            aria-label="Back to account security"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div>
            <h1 className="text-[18px] font-extrabold">Email</h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">
              Change and verify your login email
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
            Current email
          </span>

          <p className="mt-2 break-all text-[15px] font-semibold">
            {loading ? 'Loading...' : user?.email || 'Not available'}
          </p>

          {!loading ? (
            <p
              className={`mt-2 text-[11px] font-semibold ${
                cooldown.locked
                  ? 'text-[#b26a28] dark:text-amber-300'
                  : 'text-[#5b8a61] dark:text-emerald-300'
              }`}
            >
              {cooldown.text}
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
                New email
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
                Current password
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                className="app-input h-12 w-full rounded-[12px] border px-3 text-[14px] outline-none transition focus:border-[#8a70b5]"
              />
            </label>

            <p className="mt-3 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
              A 6-digit verification code will be sent to your new email.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]"
            >
              {saving ? 'Sending...' : 'Send verification code'}
            </button>
          </form>
        ) : null}

        {!loading && step === 'confirm' ? (
          <form
            onSubmit={handleConfirmCode}
            className="mt-4 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4"
          >
            <p className="text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
              Enter the code sent to <strong>{newEmail}</strong>.
            </p>

            <label className="mt-4 block">
              <span className="mb-2 block text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                Verification code
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
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
              {saving ? 'Verifying...' : 'Verify & change email'}
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
              Use a different email
            </button>
          </form>
        ) : null}

        {!loading && step === 'done' ? (
          <button
            type="button"
            onClick={() => navigate('/profile/settings/account-security')}
            className="mt-4 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white dark:bg-white dark:text-[#111827]"
          >
            Back to account & security
          </button>
        ) : null}
      </div>
    </main>
  )
}

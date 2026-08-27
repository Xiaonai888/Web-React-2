import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <i className={`fa-regular ${visible ? 'fa-eye-slash' : 'fa-eye'} text-[15px]`} />
        </button>
      </span>
    </label>
  )
}

export default function ReaderChangePasswordPage() {
  const navigate = useNavigate()
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
      setMessage('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setSuccess(false)
      setMessage('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setSuccess(false)
      setMessage('New password and confirm password do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setSuccess(false)
      setMessage('New password must be different from current password.')
      return
    }

    try {
      setSaving(true)
      setMessage('')
      setSuccess(false)

      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
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
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to change password')
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
      setMessage('Password changed successfully.')
    } catch (error) {
      setSuccess(false)
      setMessage(error.message || 'Failed to change password')
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
            <h1 className="text-[18px] font-extrabold">Change password</h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">
              Confirm your current password first
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
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
              autoComplete="current-password"
            />

            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              onToggle={() => setShowNew((value) => !value)}
              autoComplete="new-password"
            />

            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
              autoComplete="new-password"
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
            Your new password must contain at least 6 characters.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 h-12 w-full rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50 dark:bg-white dark:text-[#111827]"
          >
            {saving ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </div>
    </main>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
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

    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

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
      setError('Please enter your Gmail.')
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
        setError(data.message || 'Failed to send reset code.')
        return
      }

      if (data.email_sent === false) {
        setError('Email sending is not configured yet. Please ask the admin to enable email service.')
        return
      }

      setEmail(cleanEmail)
      setOtpDigits(['', '', '', '', '', ''])
      setStep('reset')
      setMessage('Please check your email. We sent a 6-digit reset code if this account exists.')

      setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 80)
    } catch {
      setError('Cannot connect to backend.')
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
      setError('Please enter your Gmail.')
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit code.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.')
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
        setError(data.message || 'Failed to reset password.')
        return
      }

      localStorage.setItem('shadow_reader_token', data.token)
      localStorage.setItem('shadow_reader_user', JSON.stringify(data.user))
      sessionStorage.setItem('shadow_reader_token', data.token)
      sessionStorage.setItem('shadow_reader_user', JSON.stringify(data.user))

      navigate('/me', { replace: true })
    } catch {
      setError('Cannot connect to backend.')
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
            {step === 'email' ? 'Forgot Password' : 'Enter Reset Code'}
          </h1>

          <p className="mx-auto mt-2 max-w-[310px] text-[13px] leading-5 text-[#8d94a1]">
            {step === 'email'
              ? 'Enter your Gmail and we will send you a 6-digit reset code.'
              : 'Enter the 6-digit code from your email and create a new password.'}
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
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">Gmail</span>
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
              {loading ? 'Sending...' : 'Send OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">Gmail</span>
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
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">OTP Code</span>
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
                    onChange={(event) => updateOtpDigit(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    aria-label={`OTP digit ${index + 1}`}
                    className="h-12 rounded-[14px] border border-[#d9dce3] bg-white text-center text-[20px] font-extrabold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-[#fafafe] focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
                  />
                ))}
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">New Password</span>
              <div className="flex h-12 items-center rounded-[16px] border border-[#d9dce3] bg-white px-4 focus-within:border-[#111827]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`${showPassword ? 'far fa-eye-slash' : 'far fa-eye'} text-[15px]`} />
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#111827]">Confirm Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="h-12 w-full rounded-[16px] border border-[#d9dce3] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#111827]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="h-11 w-full rounded-[16px] border border-[#d9dce3] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend Code
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-[13px] font-bold text-[#8d94a1]">
          Remember your password?{' '}
          <Link to="/login" className="text-[#111827]">
            Login
          </Link>
        </div>
      </section>
    </main>
  )
}

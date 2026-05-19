import { Link } from 'react-router-dom'
import { useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetUrl, setResetUrl] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setResetUrl('')

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
        setError(data.message || 'Failed to request reset link.')
        return
      }

      setMessage(data.message || 'If this email exists, a reset link has been sent.')
      setResetUrl(data.reset_url || '')
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
          <h1 className="text-[25px] font-extrabold tracking-tight text-[#111827]">Forgot Password</h1>
          <p className="mx-auto mt-2 max-w-[310px] text-[13px] leading-5 text-[#8d94a1]">
            Enter your Gmail and we will send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error ? (
            <div className="rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-[14px] bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold leading-5 text-[#067647]">
              {message}
            </div>
          ) : null}

          {resetUrl ? (
            <a
              href={resetUrl}
              className="block break-words rounded-[14px] bg-[#f5f3fa] px-4 py-3 text-[12px] font-bold leading-5 text-[#111827]"
            >
              {resetUrl}
            </a>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

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

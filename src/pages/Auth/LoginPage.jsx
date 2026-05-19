import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Login failed')
      }

      const storage = rememberMe ? localStorage : sessionStorage

      storage.setItem('shadow_reader_token', data.token)
      storage.setItem('shadow_reader_user', JSON.stringify(data.user))

      if (!rememberMe) {
        localStorage.removeItem('shadow_reader_token')
        localStorage.removeItem('shadow_reader_user')
      }

      navigate('/me')
    } catch (error) {
      setMessage(
  error.message === 'Failed to fetch'
    ? 'The server is starting up. This may take 30–60 seconds. Please try again shortly.'
    : error.message || 'Login failed'
)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 py-6">
      <div className="mx-auto max-w-[430px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 transition hover:-translate-x-0.5 hover:bg-[#f7f7fb] active:scale-95"
          aria-label="Go back"
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_14px_28px_rgba(17,24,39,0.18)] ring-1 ring-black/5">
  <img
    src="/assets/Icons/Shadow%20Logo.svg"
    alt="Shadow"
    className="h-full w-full object-cover"
  />
</div>

            <h1 className="text-[26px] font-extrabold tracking-tight text-[#111827]">
              Welcome Back
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#8d94a1]">
              Login to continue reading and save your progress.
            </p>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Email
            </label>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Password
            </label>
            <div className="mb-3 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1] transition hover:bg-[#f0f1f5] hover:text-[#111827] active:scale-95"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`${showPassword ? 'far fa-eye-slash' : 'far fa-eye'} text-[15px]`} />
              </button>
            </div>

            <div className="mb-5 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] font-semibold text-[#8d94a1]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-[#d1d5db] accent-[#111827]"
                />
                Remember me
              </label>

              <Link
  to="/forgot-password"
  className="text-[12px] font-extrabold text-[#111827] transition hover:text-[#f6b800]"
>
  Forgot password?
</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b2233] hover:shadow-[0_18px_34px_rgba(17,24,39,0.24)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#8d94a1]">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-extrabold text-[#111827] transition hover:text-[#f6b800]"
            >
              Sign Up
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

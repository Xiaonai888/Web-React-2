import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Register backend will be connected in the next step.')
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-white shadow-[0_14px_28px_rgba(17,24,39,0.18)]">
              <i className="fas fa-book-open text-[24px]" />
            </div>

            <h1 className="text-[26px] font-extrabold tracking-tight text-[#111827]">
              Create Account
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#8d94a1]">
              Sign up to save reading progress, comments, and author tools.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Username
            </label>
            <input
              type="text"
              placeholder="@username"
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Email
            </label>
            <input
              type="email"
              placeholder="Email address"
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Password
            </label>
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Confirm Password
            </label>
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8d94a1] transition hover:bg-[#f0f1f5] hover:text-[#111827] active:scale-95"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`${showConfirmPassword ? 'far fa-eye-slash' : 'far fa-eye'} text-[15px]`} />
              </button>
            </div>

            <label className="mb-5 flex items-start gap-2 text-[12px] leading-5 text-[#8d94a1]">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#d1d5db] accent-[#111827]"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="font-extrabold text-[#111827] transition hover:text-[#f6b800]">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/terms" className="font-extrabold text-[#111827] transition hover:text-[#f6b800]">
                  Privacy Policy
                </Link>.
              </span>
            </label>

            <button
              type="submit"
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b2233] hover:shadow-[0_18px_34px_rgba(17,24,39,0.24)] active:translate-y-0 active:scale-[0.99]"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#8d94a1]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-extrabold text-[#111827] transition hover:text-[#f6b800]"
            >
              Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

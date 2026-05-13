import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

const days = Array.from({ length: 31 }, (_, index) => index + 1)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, index) => currentYear - index)

export default function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [customGender, setCustomGender] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const getDateOfBirth = () => {
    if (!birthDay || !birthMonth || !birthYear) return ''

    const monthIndex = months.indexOf(birthMonth) + 1
    const month = String(monthIndex).padStart(2, '0')
    const day = String(birthDay).padStart(2, '0')

    return `${birthYear}-${month}-${day}`
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!acceptedTerms) {
      setMessage('Please agree to the Terms & Policies.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          confirmPassword,
          date_of_birth: getDateOfBirth(),
          gender,
          custom_gender: gender === 'custom' ? customGender : null,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create account')
      }

      localStorage.setItem('shadow_reader_token', data.token)
      localStorage.setItem('shadow_reader_user', JSON.stringify(data.user))

      navigate('/me')
    } catch (error) {
      setMessage(error.message || 'Failed to create account')
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

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Username
            </label>
            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Date of Birth
            </label>
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  value={birthDay}
                  onChange={(event) => setBirthDay(event.target.value)}
                  className={
                    'h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ' +
                    (birthDay ? 'text-[#111827]' : 'text-transparent')
                  }
                >
                  <option value="" disabled></option>
                  {days.map((day) => (
                    <option key={day} value={day} className="text-[#111827]">
                      {day}
                    </option>
                  ))}
                </select>

                <span
                  className={
                    'pointer-events-none absolute left-3 text-[#8d94a1] transition-all ' +
                    (birthDay ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]')
                  }
                >
                  Day
                </span>

                <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
              </div>

              <div className="relative">
                <select
                  value={birthMonth}
                  onChange={(event) => setBirthMonth(event.target.value)}
                  className={
                    'h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ' +
                    (birthMonth ? 'text-[#111827]' : 'text-transparent')
                  }
                >
                  <option value="" disabled></option>
                  {months.map((month) => (
                    <option key={month} value={month} className="text-[#111827]">
                      {month}
                    </option>
                  ))}
                </select>

                <span
                  className={
                    'pointer-events-none absolute left-3 text-[#8d94a1] transition-all ' +
                    (birthMonth ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]')
                  }
                >
                  Month
                </span>

                <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
              </div>

              <div className="relative">
                <select
                  value={birthYear}
                  onChange={(event) => setBirthYear(event.target.value)}
                  className={
                    'h-14 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-3 pb-2 pt-5 text-[14px] font-semibold outline-none transition focus:border-[#111827] focus:bg-white ' +
                    (birthYear ? 'text-[#111827]' : 'text-transparent')
                  }
                >
                  <option value="" disabled></option>
                  {years.map((year) => (
                    <option key={year} value={year} className="text-[#111827]">
                      {year}
                    </option>
                  ))}
                </select>

                <span
                  className={
                    'pointer-events-none absolute left-3 text-[#8d94a1] transition-all ' +
                    (birthYear ? 'top-2 text-[10px]' : 'top-[18px] text-[13px]')
                  }
                >
                  Year
                </span>

                <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#111827]" />
              </div>
            </div>

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Gender
            </label>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'custom', label: 'Custom' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setGender(item.value)
                    if (item.value !== 'custom') setCustomGender('')
                  }}
                  className={`flex h-11 items-center justify-between rounded-[14px] border px-3 text-left text-[13px] font-semibold transition active:scale-[0.99] ${
                    gender === item.value
                      ? 'border-[#111827] bg-[#111827] text-white'
                      : 'border-[#e5e7eb] bg-[#fafafe] text-[#111827]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      gender === item.value ? 'border-white' : 'border-[#b9bec8]'
                    }`}
                  >
                    {gender === item.value ? (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>

            {gender === 'custom' ? (
              <select
                value={customGender}
                onChange={(event) => setCustomGender(event.target.value)}
                className="mb-4 h-11 w-full rounded-[14px] border border-[#e5e7eb] bg-[#fafafe] px-3 text-[13px] font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white"
              >
                <option value="">Select custom gender</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="mb-4" />
            )}

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
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
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

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Confirm Password
            </label>
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 transition focus-within:border-[#111827] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#d1d5db] accent-[#111827]"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="font-extrabold text-[#111827] transition hover:text-[#f6b800]">
                  Terms & Policies
                </Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_12px_26px_rgba(17,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b2233] hover:shadow-[0_18px_34px_rgba(17,24,39,0.24)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Sign Up'}
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

import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Login backend will be connected in the next step.')
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 py-6">
      <div className="mx-auto max-w-[430px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5"
          aria-label="Go back"
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-white">
              <i className="far fa-user text-[26px]" />
            </div>

            <h1 className="text-[26px] font-extrabold tracking-tight text-[#111827]">
              Welcome Back
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#8d94a1]">
              Login to continue reading and save your progress.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Email
            </label>
            <input
              type="email"
              placeholder="Email address"
              className="mb-4 h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] outline-none transition focus:border-[#111827] focus:bg-white"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Password
            </label>
            <div className="mb-3 flex h-12 items-center rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 focus-within:border-[#111827] focus-within:bg-white">
              <input
                type="password"
                placeholder="Password"
                className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
              />
              <i className="far fa-eye text-[15px] text-[#8d94a1]" />
            </div>

            <div className="mb-5 flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] font-semibold text-[#8d94a1]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#d1d5db]" />
                Remember me
              </label>

              <button
                type="button"
                className="text-[12px] font-bold text-[#7c3aed]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-[16px] bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)] active:scale-[0.99]"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#8d94a1]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-extrabold text-[#7c3aed]">
              Sign Up
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

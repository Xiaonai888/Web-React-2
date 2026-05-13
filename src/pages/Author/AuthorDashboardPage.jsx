import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function CreateAuthorPage() {
  const navigate = useNavigate()
  const [pageName, setPageName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/authors/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: pageName,
          bio,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create author page')
      }

      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))

      navigate('/author/dashboard')
    } catch (error) {
      setMessage(error.message || 'Failed to create author page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-6">
      <div className="mx-auto max-w-[520px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
          aria-label="Go back"
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[18px] bg-white px-5 py-7 shadow-sm">
          <h1 className="text-center text-[24px] font-extrabold text-[#111827]">
            Author Page
          </h1>

          {message ? (
            <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Author Name
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(event) => setPageName(event.target.value)}
              placeholder="Username"
              className="mb-4 h-12 w-full rounded-[10px] border border-[#e5e7eb] bg-[#f1f1f1] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Bio(Optional)
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="A space for your thoughts"
              rows={3}
              className="mb-5 w-full resize-none rounded-[10px] border border-[#e5e7eb] bg-[#f1f1f1] px-4 py-3 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white"
            />

            <p className="mb-5 text-center text-[12px] font-medium text-[#555]">
              Step into greatness—Unleash your potential
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mx-auto flex h-11 min-w-[130px] items-center justify-center rounded-[8px] bg-black px-6 text-[13px] font-bold text-white transition hover:bg-[#1b1b1b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Start Now'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

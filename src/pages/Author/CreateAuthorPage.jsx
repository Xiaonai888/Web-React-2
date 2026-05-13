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

function cleanUsername(value) {
  return String(value || '')
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
}

export default function CreateAuthorPage() {
  const navigate = useNavigate()
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
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
          page_username: pageUsername,
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
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-6 pb-[110px]">
      <div className="mx-auto max-w-[520px]">
        <button
          type="button"
          onClick={() => navigate('/event')}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
          aria-label="Go back"
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[22px] bg-white px-5 py-7 shadow-sm ring-1 ring-black/5">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
              <i className="fas fa-pen-nib text-[24px]" />
            </div>

            <h1 className="text-[24px] font-extrabold text-[#111827]">
              Create Author Page
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#8d94a1]">
              Build your public writing page. Your display name can use any language.
            </p>
          </div>

          {message ? (
            <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Page Name
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(event) => setPageName(event.target.value)}
              placeholder="Enter your public author name"
              className="mb-4 h-12 w-full rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white"
            />

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Page Username
            </label>
            <div className="mb-2 flex h-12 w-full items-center rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] px-4 transition focus-within:border-[#111827] focus-within:bg-white">
              <span className="mr-1 text-[14px] font-bold text-[#8d94a1]">@</span>
              <input
                type="text"
                value={pageUsername}
                onChange={(event) => setPageUsername(cleanUsername(event.target.value))}
                placeholder="your_author_username"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none"
              />
            </div>

            <p className="mb-4 text-[11px] leading-5 text-[#8d94a1]">
              English only. Use letters, numbers, and underscore. Same page name is allowed,
              but page username must be unique.
            </p>

            <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
              Bio (Optional)
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell readers about your writing"
              rows={3}
              className="mb-5 w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] px-4 py-3 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white"
            />

            <p className="mb-5 text-center text-[12px] font-medium text-[#555]">
              Step into greatness — unleash your potential
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mx-auto flex h-12 w-full items-center justify-center rounded-[14px] bg-black px-6 text-[14px] font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:bg-[#1b1b1b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Start Now'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

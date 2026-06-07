import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function normalizeUsername(value) {
  return String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
}

export default function AuthorEditPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadAuthorPage() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false || !data.has_author_page || !data.author_page) {
          throw new Error(data.message || 'Author page not found')
        }

        if (ignore) return

        setPageName(data.author_page.page_name || '')
        setPageUsername(data.author_page.page_username || '')
        setBio(data.author_page.bio || '')
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load author page')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAuthorPage()

    return () => {
      ignore = true
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()

    const token = getAuthToken()
    const nextPageName = pageName.trim()
    const nextPageUsername = normalizeUsername(pageUsername)
    const nextBio = bio.trim()

    if (!token) {
      navigate('/login')
      return
    }

    if (nextPageName.length < 2) {
      setMessage('Page name must be at least 2 characters.')
      return
    }

    if (nextPageUsername.length < 3) {
      setMessage('Page username must be at least 3 characters.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: nextPageName,
          page_username: nextPageUsername,
          bio: nextBio,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update author page')
      }

      if (data.author_page) {
        localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      }

      setMessage('Author page updated.')
      window.setTimeout(() => {
        navigate('/author/dashboard', { replace: true })
      }, 700)
    } catch (error) {
      setMessage(error.message || 'Failed to update author page')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-10">
      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[680px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/dashboard')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f5f7] text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="text-[16px] font-black text-[#111827]">Basic Page Info</div>

          <div className="h-10 w-10" />
        </div>
      </div>

      <main className="mx-auto max-w-[680px] px-4 py-5">
        <form onSubmit={handleSubmit} className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div>
            <h1 className="text-[22px] font-black text-[#111827]">Basic Page Info</h1>
            <p className="mt-1 text-[13px] font-semibold leading-6 text-[#8b93a1]">
              Update your page name, username, and short bio.
            </p>
          </div>

          {message ? (
            <div className="mt-4 rounded-[16px] bg-[#fff7ed] px-4 py-3 text-[12px] font-bold leading-5 text-[#9a3412]">
              {message}
            </div>
          ) : null}

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-black text-[#374151]">Page name</label>
              <input
                value={pageName}
                onChange={(event) => setPageName(event.target.value)}
                disabled={loading || saving}
                placeholder="Your public page name"
                className="h-12 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 text-[14px] font-bold text-[#111827] outline-none focus:border-[#111827] disabled:bg-[#f8fafc]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-black text-[#374151]">Page username</label>
              <div className="flex h-12 items-center rounded-2xl border border-[#e5e7eb] bg-white px-4 focus-within:border-[#111827]">
                <span className="shrink-0 text-[14px] font-black text-[#9ca3af]">@</span>
                <input
                  value={pageUsername}
                  onChange={(event) => setPageUsername(normalizeUsername(event.target.value))}
                  disabled={loading || saving}
                  placeholder="page_username"
                  className="h-full min-w-0 flex-1 bg-transparent pl-1 text-[14px] font-bold text-[#111827] outline-none disabled:bg-transparent"
                />
              </div>
              <p className="mt-1.5 text-[11.5px] font-semibold text-[#9ca3af]">
                Use lowercase English letters, numbers, and underscore only.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-black text-[#374151]">Bio</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                disabled={loading || saving}
                maxLength={240}
                placeholder="Tell readers about your author page."
                className="min-h-[120px] w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-bold leading-6 text-[#111827] outline-none focus:border-[#111827] disabled:bg-[#f8fafc]"
              />
              <div className="mt-1.5 text-right text-[11px] font-bold text-[#9ca3af]">{bio.length}/240</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || saving}
            className="mt-6 h-12 w-full rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : loading ? 'Loading...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function AuthorDashboardPage() {
  const navigate = useNavigate()
  const [authorPage, setAuthorPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthorPage() {
      const token = getReaderToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch author page')
        }

        if (!data.has_author_page) {
          navigate('/author-event')
          return
        }

        setAuthorPage(data.author_page)
        localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      } catch (error) {
        console.error('Fetch author page error:', error)
        navigate('/event')
      } finally {
        setLoading(false)
      }
    }

    fetchAuthorPage()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3fa] text-[14px] font-bold text-[#8d94a1]">
        Loading author dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 py-6">
      <div className="mx-auto max-w-[760px]">
        <header className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/me')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
            aria-label="Back to me"
          >
            <i className="fas fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[20px] font-extrabold text-[#111827]">Author Dashboard</h1>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5"
          >
            <i className="fas fa-cog text-[14px]" />
          </button>
        </header>

        <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-[24px] font-extrabold text-white">
              {authorPage?.page_name?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">
                {authorPage?.page_name || 'Author Page'}
              </h2>
              <p className="mt-1 line-clamp-2 text-[13px] text-[#8d94a1]">
                {authorPage?.bio || 'No bio yet'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-[#fafafe] px-4 py-4 text-center">
              <div className="text-[18px] font-extrabold text-[#111827]">
                {authorPage?.total_stories || 0}
              </div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">Stories</div>
            </div>

            <div className="rounded-[18px] bg-[#fafafe] px-4 py-4 text-center">
              <div className="text-[18px] font-extrabold text-[#111827]">
                {authorPage?.total_followers || 0}
              </div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">Followers</div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3">
          <button className="flex items-center justify-between rounded-[22px] bg-[#111827] px-5 py-4 text-left text-white shadow-sm">
            <div>
              <div className="text-[15px] font-extrabold">Create Story</div>
              <div className="mt-1 text-[12px] text-white/60">Start publishing your novel</div>
            </div>
            <i className="fas fa-pen-nib text-[#f6b800]" />
          </button>

          <button className="flex items-center justify-between rounded-[22px] bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5">
            <div>
              <div className="text-[15px] font-extrabold text-[#111827]">My Stories</div>
              <div className="mt-1 text-[12px] text-[#8d94a1]">Manage stories and episodes</div>
            </div>
            <i className="fas fa-chevron-right text-[12px] text-[#c6c9d1]" />
          </button>

          <button className="flex items-center justify-between rounded-[22px] bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5">
            <div>
              <div className="text-[15px] font-extrabold text-[#111827]">Author Profile</div>
              <div className="mt-1 text-[12px] text-[#8d94a1]">Edit page name, bio, and cover later</div>
            </div>
            <i className="fas fa-chevron-right text-[12px] text-[#c6c9d1]" />
          </button>
        </section>
      </div>
    </div>
  )
}

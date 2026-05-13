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

function AuthorCard({ name, fans, work, time }) {
  return (
    <div className="min-w-[132px] rounded-[18px] border border-[#e5e7eb] bg-white px-3 py-4 text-center shadow-sm">
      <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-[#1f1f1f]" />
      <div className="line-clamp-1 text-[12px] font-bold text-[#111827]">{name}</div>
      <div className="mt-1 text-[13px] font-extrabold text-[#111827]">{fans}</div>
      <div className="mt-1 text-[12px] text-[#444]">{work}</div>
      <div className="mt-4 text-[10px] font-semibold text-[#a0a6b2]">
        <i className="far fa-clock mr-1" />
        {time}
      </div>
    </div>
  )
}

export default function EventPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('author')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleStartYourWork = async () => {
    if (loading) return

    const token = getReaderToken()

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

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to check author page')
      }

      if (data.has_author_page) {
        navigate('/author/dashboard')
        return
      }

      navigate('/author/create')
    } catch (error) {
      setMessage(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-[92px]">
      <header className="sticky top-0 z-40 bg-black px-4 py-4 text-center text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
          aria-label="Go back"
        >
          <i className="fas fa-chevron-left text-[14px]" />
        </button>
        <h1 className="text-[22px] font-medium">Event</h1>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-6">
        <section className="grid grid-cols-2 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('author')}
            className={`relative pb-4 text-[20px] font-extrabold ${
              activeTab === 'author' ? 'text-[#111827]' : 'text-[#c7c7c7]'
            }`}
          >
            Author
            {activeTab === 'author' ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-[#1f4cff]" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`relative pb-4 text-[20px] font-extrabold ${
              activeTab === 'event' ? 'text-[#111827]' : 'text-[#c7c7c7]'
            }`}
          >
            Event
            {activeTab === 'event' ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-[#1f4cff]" />
            ) : null}
          </button>
        </section>

        {activeTab === 'author' ? (
          <>
            <section className="mt-10">
              <div className="flex aspect-[2.6/1] w-full items-center justify-center rounded-[20px] bg-black text-[34px] font-extrabold text-white/80">
                Cover
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <button className="h-14 rounded-[16px] bg-black text-[20px] font-extrabold text-white">
                  Write
                </button>
                <button className="h-14 rounded-[16px] border border-black bg-white text-[20px] font-extrabold text-[#111827]">
                  Group
                </button>
              </div>
            </section>

            <section className="py-10 text-center">
              <h2 className="text-[34px] font-extrabold text-[#111827]">Become A Writer</h2>

              <p className="mx-auto mt-8 max-w-[520px] text-[20px] leading-8 text-[#111827]">
                &quot;Your amazing creations will be appreciated by many users.&quot;
              </p>

              <div className="mt-8 space-y-6 text-[21px] font-extrabold text-[#111827]">
                <p>High earnings and great incentives</p>
                <p>Breaking into the local market</p>
                <p>Top-tier platform with massive viewership</p>
              </div>

              {message ? (
                <div className="mx-auto mt-6 max-w-[520px] rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[13px] font-bold text-[#e5484d]">
                  {message}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleStartYourWork}
                aria-busy={loading}
                className="mx-auto mt-10 flex h-14 w-full max-w-[440px] items-center justify-center rounded-full bg-black text-[22px] font-bold text-white shadow-[0_16px_34px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1b1b1b] active:scale-[0.99]"
              >
                Start your work
              </button>

              <div className="mt-5 text-[17px] text-[#111827]">
                Need help?
                <button type="button" className="ml-1 text-[#0b5cff]">
                  Help Center
                </button>
              </div>
            </section>

            <section className="pb-8">
              <h2 className="mb-8 text-[28px] font-extrabold text-[#111827]">Author Center</h2>

              <div className="flex aspect-[2.9/1] w-full items-center justify-center rounded-[18px] bg-black text-[22px] font-extrabold text-white">
                Author Benefits Banner
              </div>

              <div className="mt-8 flex items-center justify-between">
                <h3 className="text-[20px] font-extrabold text-[#111827]">My Following</h3>
                <button type="button" className="flex h-9 w-9 items-center justify-center">
                  <i className="fas fa-chevron-right text-[24px]" />
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="rounded-full bg-black px-5 py-2 text-[14px] font-bold text-white">
                  Recent
                </button>
                <button className="rounded-full border border-[#d8dbe3] px-5 py-2 text-[14px] font-semibold text-[#111827]">
                  Popular
                </button>
                <button className="rounded-full border border-[#d8dbe3] px-5 py-2 text-[14px] font-semibold text-[#111827]">
                  Most Updated
                </button>
              </div>

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="1 days ago" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="2 days ago" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="3 days ago" />
                <AuthorCard name="Author Name" fans="2.1k Fans" work="work 03" time="5 days ago" />
              </div>
            </section>
          </>
        ) : (
          <section className="mt-10 rounded-[22px] border border-[#eceaf2] bg-[#fafafa] px-5 py-10 text-center">
            <h2 className="text-[24px] font-extrabold text-[#111827]">Events Coming Soon</h2>
            <p className="mt-3 text-[14px] text-[#8d94a1]">
              More reader and author events will appear here later.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

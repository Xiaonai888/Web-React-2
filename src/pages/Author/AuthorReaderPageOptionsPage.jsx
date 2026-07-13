import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const BLOCKED_PAGES_KEY = 'shadow_blocked_author_pages'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readBlockedPages() {
  try {
    const value = JSON.parse(localStorage.getItem(BLOCKED_PAGES_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function ActionRow({ icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[66px] w-full items-center gap-4 border-b border-[#e5e7eb] px-4 text-left active:bg-[#f3f4f6]"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${danger ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
        <i className={`${icon} text-[21px]`} />
      </span>
      <span className={`text-[16px] font-normal ${danger ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
        {label}
      </span>
    </button>
  )
}

export default function AuthorReaderPageOptionsPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [authorPage, setAuthorPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [blocked, setBlocked] = useState(false)

  const pageName = authorPage?.page_name || authorPage?.name || 'Author Page'
  const pageId = authorPage?.id || ''
  const publicPath = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
  const pageLink = useMemo(() => `${window.location.origin}${publicPath}`, [publicPath])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadPage() {
      try {
        setLoading(true)
        setMessage('')

        const token = getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Author page not found')
        }

        const page = data.author_page || data.author || data.page || null

        if (!page) {
          throw new Error('Author page not found')
        }

        if (!ignore) {
          setAuthorPage(page)
          setBlocked(readBlockedPages().includes(page.page_username || pageUsername))
        }
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load Author Page')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
    }
  }, [pageUsername])

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(pageLink)
      setMessage('Page link copied.')
    } catch {
      setMessage(pageLink)
    }
  }

  async function sharePage() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageName,
          text: `View ${pageName} on Shadow.`,
          url: pageLink,
        })
      } catch {
        return
      }
      return
    }

    copyPageLink()
  }

  function toggleBlock() {
    const key = authorPage?.page_username || pageUsername

    if (!key) return

    const current = readBlockedPages()
    const next = blocked
      ? current.filter((item) => item !== key)
      : [...new Set([...current, key])]

    localStorage.setItem(BLOCKED_PAGES_KEY, JSON.stringify(next))
    setBlocked(!blocked)
    setMessage(blocked ? `${pageName} unblocked.` : `${pageName} blocked.`)
  }

  function openReportPage() {
    if (!pageId) {
      setMessage('Unable to open Report Page.')
      return
    }

    navigate(`/report/author_page/${pageId}`)
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] pb-8">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center justify-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-2 flex h-11 w-11 items-center justify-center text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[22px]" />
          </button>

          <h1 className="max-w-[72%] truncate text-[17px] font-bold text-[#111827]">
            {loading ? 'Loading...' : pageName}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[720px]">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="w-full border-b border-[#e5e7eb] bg-[#fff7d6] px-4 py-3 text-left text-[13px] text-[#111827]"
          >
            {message}
          </button>
        ) : null}

        <section className="bg-white">
          <ActionRow
            icon="fa-regular fa-flag"
            label="Report Page"
            onClick={openReportPage}
          />

          <div className="h-[58px] border-b border-[#e5e7eb]" />

          <ActionRow
            icon="fa-solid fa-user-slash"
            label={blocked ? 'Unblock' : 'Block'}
            onClick={toggleBlock}
            danger={blocked}
          />

          <div className="h-[58px] border-b border-[#e5e7eb]" />

          <ActionRow
            icon="fa-regular fa-address-card"
            label="Invite friends"
            onClick={sharePage}
          />

          <ActionRow
            icon="fa-solid fa-share"
            label="Share profile"
            onClick={sharePage}
          />
        </section>

        <section className="mt-3 bg-white px-4 pb-5 pt-5">
          <h2 className="text-[18px] font-bold text-[#111827]">
            {pageName}&apos;s Page link
          </h2>

          <p className="mt-1 text-[15px] leading-5 text-[#6b7280]">
            {pageName}&apos;s personalized link on Shadow.
          </p>

          <div className="mt-5 border-t border-[#e5e7eb] pt-4">
            <p className="break-all text-[15px] text-[#111827]">{pageLink}</p>

            <button
              type="button"
              onClick={copyPageLink}
              className="mt-4 h-11 w-full rounded-[10px] bg-[#e5e7eb] text-[15px] font-medium text-[#111827] active:bg-[#d8dde5]"
            >
              Copy link
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

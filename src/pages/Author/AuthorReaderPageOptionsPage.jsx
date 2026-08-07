import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthorPageShareSheet from '../../components/AuthorPageShareSheet'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function ActionRow({ icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[58px] w-full items-center gap-3 px-4 text-left active:bg-[#f3f4f6] disabled:opacity-55"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[18px]`} />
      </span>
      <span className="min-w-0 flex-1 text-[14px] font-normal text-[#111827]">
        {label}
      </span>
      <i className="fa-solid fa-chevron-right text-[11px] text-[#9ca3af]" />
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
  const [blockStatusLoading, setBlockStatusLoading] = useState(false)
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false)
  const [blockLoading, setBlockLoading] = useState(false)
  const [blockError, setBlockError] = useState('')
  const [shareOpen, setShareOpen] = useState(false)

  const pageName = authorPage?.page_name || authorPage?.name || 'Author Page'
  const pageId = authorPage?.id || ''
  const publicPath = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
  const pageLink = useMemo(() => `${window.location.origin}${publicPath}`, [publicPath])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setMessage('')

        const token = getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername || '')}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Author page not found')
        }

        const page = data.author_page || data.author || data.page || null

        if (!page) throw new Error('Author page not found')
        if (!ignore) setAuthorPage(page)

        if (token) {
          try {
            if (!ignore) setBlockStatusLoading(true)

            const statusResponse = await fetch(
              `${API_BASE_URL}/api/authors/page/${encodeURIComponent(page.page_username || pageUsername || '')}/block-status`,
              {
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal,
              }
            )
            const statusData = await statusResponse.json().catch(() => ({}))

            if (statusResponse.ok && statusData.ok !== false && !ignore) {
              setBlocked(Boolean(statusData.block_status?.is_blocked))
            }
          } finally {
            if (!ignore) setBlockStatusLoading(false)
          }
        }
      } catch (error) {
        if (!ignore && error?.name !== 'AbortError') {
          setMessage(error.message || 'Failed to load Author Page')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
      controller.abort()
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

  function searchThisPage() {
    navigate(`/author/page/${pageUsername}/search`)
  }

  function openReportPage() {
    if (!pageId) {
      setMessage('Unable to open Report Page.')
      return
    }

    navigate(`/report/author_page/${pageId}`, {
      state: {
        targetTitle: pageName,
        sourceUrl: pageLink,
        returnTo: `/author/page/${pageUsername}/options`,
      },
    })
  }

  function openBlockConfirmation() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    setBlockError('')
    setBlockConfirmOpen(true)
  }

  async function handleBlockAction() {
    const token = getAuthToken()
    const username = authorPage?.page_username || pageUsername

    if (!token) {
      setBlockConfirmOpen(false)
      navigate('/login')
      return
    }

    if (!username || blockLoading) return

    try {
      setBlockLoading(true)
      setBlockError('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/block`,
        {
          method: blocked ? 'DELETE' : 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            (blocked ? 'Failed to unblock Author Page' : 'Failed to block Author Page')
        )
      }

      const nextBlocked = Boolean(data.block_status?.is_blocked)
      setBlocked(nextBlocked)
      setBlockConfirmOpen(false)
      setMessage(
        data.message || (nextBlocked ? `${pageName} blocked.` : `${pageName} unblocked.`)
      )

      if (nextBlocked) {
        window.setTimeout(() => navigate('/discover'), 350)
      }
    } catch (error) {
      setBlockError(
        error.message ||
          (blocked ? 'Failed to unblock Author Page' : 'Failed to block Author Page')
      )
    } finally {
      setBlockLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef0f3] pb-8">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex min-h-[66px] max-w-[720px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <div className="min-w-0 flex-1 px-1">
            <h1 className="truncate text-[17px] font-bold text-[#111827]">
              {loading ? 'Loading...' : pageName}
            </h1>
            <p className="mt-0.5 text-[12px] font-normal text-[#6b7280]">Page options</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[720px]">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="w-full border-b border-[#e5e7eb] bg-[#fff7d6] px-4 py-3 text-left text-[13px] font-normal text-[#111827]"
          >
            {message}
          </button>
        ) : null}

        <section className="mt-2 bg-white">
          <ActionRow icon="fa-regular fa-flag" label="Report Page" onClick={openReportPage} />
          <ActionRow
            icon="fa-regular fa-heart"
            label={`Help ${pageName}`}
            onClick={() => navigate('/help')}
          />
          <ActionRow
            icon={blocked ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'}
            label={blockStatusLoading ? 'Checking...' : blocked ? 'Unblock' : 'Block'}
            onClick={openBlockConfirmation}
            disabled={blockStatusLoading}
          />
          <ActionRow
            icon="fa-solid fa-magnifying-glass"
            label="Search this Page"
            onClick={searchThisPage}
          />
          <ActionRow
            icon="fa-regular fa-address-book"
            label="Invite friends"
            onClick={() => navigate(`/author/page/${pageUsername}/invite`)}
          />
          <ActionRow
            icon="fa-solid fa-share"
            label="Share Page"
            onClick={() => setShareOpen(true)}
          />
        </section>

        <section className="mt-3 bg-white px-4 pb-5 pt-5">
          <h2 className="truncate text-[17px] font-bold text-[#111827]">
            {pageName}&apos;s Page link
          </h2>
          <p className="mt-1 text-[13px] font-normal leading-5 text-[#6b7280]">
            Share this personalized Shadow Page link.
          </p>

          <p className="mt-4 break-all text-[14px] font-normal leading-5 text-[#111827]">
            {pageLink}
          </p>

          <button
            type="button"
            onClick={copyPageLink}
            className="mt-4 h-11 w-full rounded-[10px] bg-[#e5e7eb] text-[15px] font-medium text-[#111827] active:bg-[#d8dde5]"
          >
            Copy link
          </button>
        </section>
      </main>

      <AuthorPageShareSheet
        open={shareOpen}
        pageName={pageName}
        pageLink={pageLink}
        onClose={() => setShareOpen(false)}
        onCopied={(value) => setMessage(value || 'Page link copied.')}
      />

      {blockConfirmOpen ? (
        <div className="fixed inset-0 z-[270] flex items-end justify-center bg-black/45 md:items-center md:px-4">
          <button
            type="button"
            aria-label="Close block confirmation"
            onClick={() => {
              if (!blockLoading) setBlockConfirmOpen(false)
            }}
            className="absolute inset-0"
          />

          <section className="relative w-full rounded-t-[24px] bg-white px-5 pb-6 pt-5 shadow-2xl md:max-w-[420px] md:rounded-[24px]">
            <h2 className="text-center text-[18px] font-bold text-[#111827]">
              {blocked ? `Unblock ${pageName}?` : `Block ${pageName}?`}
            </h2>
            <p className="mt-2 text-center text-[13px] font-normal leading-5 text-[#6b7280]">
              {blocked
                ? 'This will unblock both the Author Page and its Reader account.'
                : 'This will block both the Author Page and its Reader account, including direct messages between both accounts.'}
            </p>

            {blockError ? (
              <div className="mt-4 rounded-[10px] bg-[#f3f4f6] px-4 py-3 text-[12px] font-normal leading-5 text-[#111827]">
                {blockError}
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBlockConfirmOpen(false)}
                disabled={blockLoading}
                className="h-11 rounded-[10px] bg-[#eef0f3] text-[14px] font-medium text-[#111827] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockAction}
                disabled={blockLoading}
                className="h-11 rounded-[10px] bg-[#111827] text-[14px] font-medium text-white disabled:opacity-60"
              >
                {blockLoading ? 'Please wait...' : blocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

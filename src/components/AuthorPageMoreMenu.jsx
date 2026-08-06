import { useEffect, useState } from 'react'

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

function MenuRow({ icon, label, onClick, disabled = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-4 border-b border-[#eceff3] px-5 py-4 text-left active:bg-[#f5f6f8] disabled:cursor-not-allowed disabled:opacity-55"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center ${
          danger ? 'text-[#e5484d]' : 'text-[#111827]'
        }`}
      >
        <i className={`${icon} text-[20px]`} />
      </span>
      <span
        className={`min-w-0 flex-1 text-[16px] font-normal ${
          danger ? 'text-[#e5484d]' : 'text-[#111827]'
        }`}
      >
        {label}
      </span>
      <i className="fa-solid fa-chevron-right text-[12px] text-[#8b93a1]" />
    </button>
  )
}

export default function AuthorPageMoreMenu({
  open,
  author,
  onClose,
  onReport,
  onHelp,
  onMessage,
}) {
  const [blockStatusLoading, setBlockStatusLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false)
  const [blockLoading, setBlockLoading] = useState(false)
  const [blockError, setBlockError] = useState('')

  const pageName = author?.page_name || 'Author Page'
  const pageUsername = author?.page_username || ''
  const pageUrl = `${window.location.origin}${window.location.pathname}`

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (!open || !pageUsername || author?.is_owner) return undefined

    const token = getAuthToken()

    if (!token) {
      setBlocked(false)
      setBlockStatusLoading(false)
      return undefined
    }

    const controller = new AbortController()

    async function loadBlockStatus() {
      try {
        setBlockStatusLoading(true)

        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/block-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load block status')
        }

        setBlocked(Boolean(data.block_status?.is_blocked))
      } catch (error) {
        if (error?.name !== 'AbortError') {
          setBlocked(false)
        }
      } finally {
        if (!controller.signal.aborted) {
          setBlockStatusLoading(false)
        }
      }
    }

    loadBlockStatus()

    return () => controller.abort()
  }, [open, pageUsername, author?.is_owner])

  if (!open || author?.is_owner) return null

  const showMessage = (text) => {
    onMessage?.(text)
  }

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      showMessage('Page link copied.')
    } catch {
      showMessage(pageUrl)
    }

    onClose()
  }

  const sharePage = async (invite = false) => {
    const shareData = {
      title: invite ? `Follow ${pageName} on Shadow` : pageName,
      text: invite
        ? `Come follow ${pageName} on Shadow.`
        : `View ${pageName} on Shadow.`,
      url: pageUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        onClose()
        return
      }

      await navigator.clipboard.writeText(pageUrl)
      showMessage('Page link copied.')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showMessage('Unable to share this page.')
      }
    }

    onClose()
  }

  const searchThisPage = () => {
    const query = window.prompt(`Search ${pageName}`)

    if (!query?.trim()) return

    const normalizedQuery = query.trim().toLowerCase()
    onClose()

    window.setTimeout(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      )
      let matchedElement = null

      while (walker.nextNode()) {
        const node = walker.currentNode
        const parent = node.parentElement

        if (
          !parent ||
          parent.closest('[data-author-page-more-menu]') ||
          ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)
        ) {
          continue
        }

        if (String(node.nodeValue || '').toLowerCase().includes(normalizedQuery)) {
          matchedElement = parent
          break
        }
      }

      if (matchedElement) {
        matchedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        showMessage(`Found "${query.trim()}".`)
        return
      }

      showMessage(`No result found for "${query.trim()}".`)
    }, 120)
  }

  const openBlockConfirmation = () => {
    const token = getAuthToken()

    if (!token) {
      onClose()
      window.location.assign('/login')
      return
    }

    setBlockError('')
    setBlockConfirmOpen(true)
  }

  const handleBlockAction = async () => {
    const token = getAuthToken()

    if (!token) {
      setBlockConfirmOpen(false)
      onClose()
      window.location.assign('/login')
      return
    }

    if (!pageUsername || blockLoading) return

    try {
      setBlockLoading(true)
      setBlockError('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/block`,
        {
          method: blocked ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            (blocked
              ? 'Failed to unblock Author Page'
              : 'Failed to block Author Page')
        )
      }

      const nextBlocked = Boolean(data.block_status?.is_blocked)
      setBlocked(nextBlocked)
      setBlockConfirmOpen(false)
      showMessage(
        data.message ||
          (nextBlocked
            ? `${pageName} blocked.`
            : `${pageName} unblocked.`)
      )
      onClose()

      if (nextBlocked) {
        window.setTimeout(() => {
          window.location.assign('/discover')
        }, 350)
      }
    } catch (error) {
      setBlockError(
        error.message ||
          (blocked
            ? 'Failed to unblock Author Page'
            : 'Failed to block Author Page')
      )
    } finally {
      setBlockLoading(false)
    }
  }

  return (
    <div
      data-author-page-more-menu
      className="fixed inset-0 z-[245] flex items-end justify-center bg-black/40 md:items-center md:px-4"
    >
      <button
        type="button"
        aria-label="Close Author Page options"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[26px] bg-[#f0f2f5] pb-6 shadow-2xl md:max-w-[520px] md:rounded-[26px]">
        <div className="sticky top-0 z-10 bg-white px-5 pb-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#9ca3af]" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[20px] font-bold text-[#111827]">
                {pageName}
              </h2>
              <p className="mt-1 text-[12px] text-[#6b7280]">Page options</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111827] active:scale-95"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-[15px]" />
            </button>
          </div>
        </div>

        <div className="mt-2 bg-white">
          <MenuRow
            icon="fa-regular fa-flag"
            label="Report Page"
            onClick={() => {
              onClose()
              onReport()
            }}
          />
          <MenuRow
            icon="fa-regular fa-heart"
            label={`Help ${pageName}`}
            onClick={() => {
              onClose()
              onHelp()
            }}
          />
          {!author?.is_owner ? (
            <MenuRow
              icon={blocked ? 'fa-solid fa-user-check' : 'fa-solid fa-user-slash'}
              label={
                blockStatusLoading
                  ? 'Checking...'
                  : blocked
                    ? 'Unblock'
                    : 'Block'
              }
              onClick={openBlockConfirmation}
              disabled={blockStatusLoading}
              danger={!blocked}
            />
          ) : null}
          <MenuRow
            icon="fa-solid fa-magnifying-glass"
            label="Search this Page"
            onClick={searchThisPage}
          />
          <MenuRow
            icon="fa-regular fa-address-book"
            label="Invite friends"
            onClick={() => sharePage(true)}
          />
          <MenuRow
            icon="fa-solid fa-share"
            label="Share Page"
            onClick={() => sharePage(false)}
          />
        </div>

        <div className="mt-3 bg-white px-5 py-5">
          <h3 className="line-clamp-1 text-[18px] font-bold text-[#111827]">
            {pageName}&apos;s Page link
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-[#6b7280]">
            Share this personalized Shadow Page link.
          </p>

          <div className="mt-4 break-all text-[14px] font-medium leading-5 text-[#111827]">
            {pageUrl}
          </div>

          <button
            type="button"
            onClick={copyPageLink}
            className="mt-4 h-12 w-full rounded-[12px] bg-[#e4e7eb] text-[16px] font-medium text-[#111827] active:scale-[0.99]"
          >
            Copy link
          </button>
        </div>
      </section>

      {blockConfirmOpen ? (
        <div className="fixed inset-0 z-[270] flex items-end justify-center bg-black/45 px-0 md:items-center md:px-4">
          <button
            type="button"
            aria-label="Close block confirmation"
            onClick={() => {
              if (!blockLoading) setBlockConfirmOpen(false)
            }}
            className="absolute inset-0"
          />

          <section className="relative w-full rounded-t-[26px] bg-white px-5 pb-6 pt-4 shadow-2xl md:max-w-[420px] md:rounded-[26px]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#9ca3af]" />

            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                blocked
                  ? 'bg-[#eef7f0] text-[#229a45]'
                  : 'bg-[#fff1f1] text-[#e5484d]'
              }`}
            >
              <i
                className={`fa-solid ${
                  blocked ? 'fa-user-check' : 'fa-user-slash'
                } text-[22px]`}
              />
            </div>

            <h2 className="mt-4 text-center text-[19px] font-bold text-[#111827]">
              {blocked ? `Unblock ${pageName}?` : `Block ${pageName}?`}
            </h2>

            <p className="mt-2 text-center text-[13px] leading-5 text-[#6b7280]">
              {blocked
                ? 'This will unblock both the Author Page and its Reader account.'
                : 'This will block both the Author Page and its Reader account, including direct messages between both accounts.'}
            </p>

            {blockError ? (
              <div className="mt-4 rounded-[12px] bg-[#fff1f1] px-4 py-3 text-[12px] font-semibold leading-5 text-[#e5484d]">
                {blockError}
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBlockConfirmOpen(false)}
                disabled={blockLoading}
                className="h-12 rounded-[12px] bg-[#eef0f3] text-[14px] font-semibold text-[#111827] active:scale-[0.99] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBlockAction}
                disabled={blockLoading}
                className={`h-12 rounded-[12px] text-[14px] font-semibold text-white active:scale-[0.99] disabled:opacity-60 ${
                  blocked ? 'bg-[#229a45]' : 'bg-[#e5484d]'
                }`}
              >
                {blockLoading
                  ? 'Please wait...'
                  : blocked
                    ? 'Unblock'
                    : 'Block'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

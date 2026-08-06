import { useEffect } from 'react'

function MenuRow({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-[#eceff3] px-5 py-4 text-left active:bg-[#f5f6f8]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[20px]`} />
      </span>
      <span className="min-w-0 flex-1 text-[16px] font-normal text-[#111827]">
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

  if (!open) return null

  const pageName = author?.page_name || 'Author Page'
  const pageUrl = `${window.location.origin}${window.location.pathname}`

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
          <MenuRow
            icon="fa-solid fa-user-slash"
            label="Block"
            onClick={() => {
              onClose()
              showMessage('Block Author Page needs backend support.')
            }}
          />
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
    </div>
  )
}

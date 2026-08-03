import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getStoredAuthorPage() {
  try {
    return JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
  } catch {
    return null
  }
}

function ToolRow({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-2.5 text-left active:bg-[#f3f4f6]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[15px] font-normal`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[#111827]">{label}</span>
      </span>
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 className="px-1 pt-5 text-[17px] font-semibold text-[#111827]">{children}</h2>
}

export default function AuthorPageOptionsPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const authorPage = useMemo(() => getStoredAuthorPage(), [])
const pageUsername = authorPage?.page_username || ''

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}, [])

function copyPageLink() {
    const path = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
    const link = `${window.location.origin}${path}`

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link)
      setMessage('Page link copied.')
      return
    }

    setMessage(link)
  }

  async function sharePage() {
    const path = pageUsername ? `/author/page/${pageUsername}` : '/author/page'
    const link = `${window.location.origin}${path}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: authorPage?.page_name || 'Author Page',
          url: link,
        })
      } catch {
        setMessage('Share cancelled.')
      }
      return
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link)
      setMessage('Page link copied.')
      return
    }

    setMessage(link)
  }

  function viewAsReader() {
    if (pageUsername) {
      navigate(`/author/page/${pageUsername}`)
      return
    }

    navigate('/author/page')
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[22px]" />
          </button>

          <h1 className="text-[16px] font-semibold text-[#111827]">Page Settings</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-8">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mt-4 w-full rounded-[16px] bg-[#f3f4f6] px-4 py-3 text-left text-[13px] font-normal text-[#111827]"
          >
            {message}
          </button>
        ) : null}

        <SectionTitle>Manage</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-pen-to-square" label="Basic Page Info" onClick={() => navigate('/author/edit-page?from=settings')} />
          <ToolRow icon="fa-regular fa-circle-check" label="Page status" onClick={() => setMessage('Page status is coming soon.')} />
          <ToolRow icon="fa-regular fa-rectangle-list" label="Activity log" onClick={() => setMessage('Activity log is coming soon.')} />
        </div>

        <SectionTitle>Share</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-paper-plane" label="Share Page" onClick={sharePage} />
          <ToolRow icon="fa-regular fa-copy" label="Copy Page link" onClick={copyPageLink} />
        </div>

        <SectionTitle>View</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-eye" label="View as reader" onClick={viewAsReader} />
        </div>

        <SectionTitle>Trash</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow
            icon="fa-regular fa-trash-can"
            label="Trash"
            onClick={() => navigate('/author/trash')}
          />
        </div>
      </main>
    </div>
  )
}

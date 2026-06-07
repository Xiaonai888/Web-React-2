import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getStoredAuthorPage() {
  try {
    return JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
  } catch {
    return null
  }
}

function ToolRow({ icon, label, subtext, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[24px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-normal text-[#111827]">{label}</span>
        {subtext ? <span className="mt-0.5 block text-[12px] font-normal text-[#8b93a1]">{subtext}</span> : null}
      </span>
      <i className="fa-solid fa-chevron-right text-[11px] text-[#c7cbd3]" />
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 className="px-1 pt-5 text-[24px] font-bold text-[#111827]">{children}</h2>
}

export default function AuthorPageSettingsPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const authorPage = useMemo(() => getStoredAuthorPage(), [])
  const pageUsername = authorPage?.page_username || ''

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

          <h1 className="text-[20px] font-bold text-[#111827]">Page Settings</h1>

          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-1 ring-black/5"
            aria-label="Author page"
          >
            {authorPage?.avatar_url ? (
              <img src={authorPage.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-[15px] text-[#9ca3af]" />
            )}
          </button>
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
          <ToolRow icon="fa-solid fa-pen" label="Edit Author Page" subtext="Edit cover, intro, details, links, and contact info" onClick={() => navigate('/author/page/edit?section=intro&from=settings')} />
          <ToolRow icon="fa-solid fa-shield-halved" label="Page status" subtext="Active, review, or restriction status" onClick={() => setMessage('Page status is coming soon.')} />
          <ToolRow icon="fa-solid fa-list" label="Activity log" subtext="Review important page actions" onClick={() => setMessage('Activity log is coming soon.')} />
        </div>

        <SectionTitle>Share</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-solid fa-share" label="Share Page" subtext="Share this author page" onClick={sharePage} />
          <ToolRow icon="fa-solid fa-link" label="Copy Page link" subtext="Copy public author page URL" onClick={copyPageLink} />
        </div>

        <SectionTitle>View</SectionTitle>
        <div className="mt-3 space-y-1">
          <ToolRow icon="fa-regular fa-eye" label="View as reader" subtext="Open the public author page view" onClick={viewAsReader} />
        </div>
      </main>
    </div>
  )
}

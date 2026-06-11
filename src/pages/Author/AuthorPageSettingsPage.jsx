import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getStoredAuthorPage() {
  try {
    return JSON.parse(localStorage.getItem('shadow_author_page') || 'null')
  } catch {
    return null
  }
}

function ToolRow({ icon, label, subtext, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-2.5 text-left active:bg-[#f3f4f6]"
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center ${danger ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
        <i className={`${icon} text-[18px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[14px] font-normal ${danger ? 'text-[#dc2626]' : 'text-[#111827]'}`}>{label}</span>
        {subtext ? <span className="mt-0.5 block text-[11px] font-normal text-[#8b93a1]">{subtext}</span> : null}
      </span>
    </button>
  )
}

function SectionTitle({ children }) {
  return <h2 className="px-1 pt-5 text-[17px] font-semibold text-[#111827]">{children}</h2>
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

          <h1 className="text-[16px] font-semibold text-[#111827]">Page Settings</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

   <main className="mx-auto max-w-[720px] px-4 py-4">
  {message ? (
    <button
      type="button"
      onClick={() => setMessage('')}
      className="mb-4 w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
    >
      {message}
    </button>
  ) : null}

  <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
    <ToolRow
      icon="fa-solid fa-layer-group"
      label="Category Management"
      subtext="Categories, hidden sections, and order."
      onClick={() => setMessage('Coming soon.')}
    />

    <ToolRow
      icon="fa-solid fa-truck-fast"
      label="Delivery Company"
      subtext="J&T fee, VET fee, and checkout delivery."
      onClick={() => setMessage('Coming soon.')}
    />
  </section>

  <div className="mt-6 px-1 text-[18px] font-semibold text-[#b6b6bd]">
    Payment Alerts
  </div>

  <section className="mt-3 overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-black/5">
    <ToolRow
      icon="fa-regular fa-paper-plane"
      label="Telegram Bot"
      subtext=""
      onClick={() => setMessage('Coming soon.')}
    />
  </section>
</main>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

const TABS = [
  { key: 'all', label: 'All', apiType: 'all' },
  { key: 'rewards', label: 'Rewards', apiType: 'rewards' },
  { key: 'admin', label: 'Admin Mail', apiType: 'admin' },
  { key: 'system', label: 'System', apiType: 'system' },
]

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getMailTypeLabel(type) {
  const value = String(type || '').toLowerCase()

  if (value === 'reward') return 'Rewards'
  if (value === 'system') return 'System'
  if (value === 'coupon') return 'Coupon'
  if (value === 'event') return 'Event'
  if (value === 'payment') return 'Payment'

  return 'Admin Mail'
}

function getMailIcon(mail) {
  const type = String(mail.mail_type || '').toLowerCase()

  if (type === 'reward') return 'fa-solid fa-gift'
  if (type === 'coupon') return 'fa-solid fa-ticket'
  if (type === 'payment') return 'fa-solid fa-wallet'
  if (type === 'event') return 'fa-solid fa-bullhorn'
  if (type === 'system') return 'fa-solid fa-gear'

  return mail.sender_type === 'admin' ? 'fa-solid fa-user-shield' : 'fa-solid fa-envelope'
}

function getSenderLabel(senderType) {
  return senderType === 'admin' ? 'Admin' : 'System Auto'
}

function formatMailTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

function normalizeMail(mail) {
  return {
    id: mail.id,
    type: getMailTypeLabel(mail.mail_type),
    title: mail.title || '',
    message: mail.message || '',
    detail: mail.detail || mail.message || '',
    time: formatMailTime(mail.created_at),
    icon: getMailIcon(mail),
    unread: !mail.is_read,
    sender: getSenderLabel(mail.sender_type),
    action: mail.action_type === 'claim' ? 'Claim' : '',
    claimed: Boolean(mail.claimed_at),
    raw: mail,
  }
}

function MailCard({ mail, onOpen, onClaim }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(mail.id)}
      className="flex w-full gap-3 rounded-[20px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99] dark:bg-[#171923] dark:ring-white/10"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff7d8] text-[#d99a00] dark:bg-[#2a2414]">
        <i className={`${mail.icon} text-[15px]`} />
        {mail.unread ? (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white dark:ring-[#171923]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827] dark:text-white">{mail.title}</div>
            <div className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7b8190] dark:text-white/55">{mail.message}</div>
          </div>
          <span className="shrink-0 text-[10.5px] font-semibold text-[#9aa1ad] dark:text-white/40">{mail.time}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10.5px] font-bold text-[#6b7280] dark:bg-white/10 dark:text-white/55">
              {mail.type}
            </span>
            <span className="line-clamp-1 text-[10.5px] font-semibold text-[#9aa1ad] dark:text-white/40">{mail.sender}</span>
          </div>
          {mail.action ? (
            <span
              onClick={(event) => {
                event.stopPropagation()
                onClaim(mail.id)
              }}
              className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                mail.claimed
                  ? 'bg-[#eef0f4] text-[#8d94a1] dark:bg-white/10 dark:text-white/45'
                  : 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
              }`}
            >
              {mail.claimed ? 'Claimed' : mail.action}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function MailDetailSheet({ mail, onClose, onClaim }) {
  if (!mail) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Close mail detail" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-y-auto rounded-t-[26px] bg-white px-4 pb-6 pt-4 shadow-2xl dark:bg-[#12141d] md:bottom-auto md:left-1/2 md:top-20 md:w-[420px] md:-translate-x-1/2 md:rounded-[24px]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff7d8] text-[#d99a00] dark:bg-[#2a2414]">
              <i className={`${mail.icon} text-[15px]`} />
            </div>
            <div className="min-w-0">
              <div className="line-clamp-1 text-[12px] font-bold text-[#8d94a1] dark:text-white/45">{mail.type} · {mail.sender}</div>
              <h2 className="mt-0.5 text-[17px] font-extrabold leading-6 text-[#111827] dark:text-white">{mail.title}</h2>
            </div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555] dark:bg-white/10 dark:text-white/70">
            <i className="fa-solid fa-times text-[13px]" />
          </button>
        </div>

        <div className="rounded-[20px] bg-[#f8f8fb] p-4 text-[13px] leading-6 text-[#606776] dark:bg-white/5 dark:text-white/65">
          {mail.detail}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[18px] bg-[#fafafe] px-4 py-3 dark:bg-white/5">
          <span className="text-[12px] font-bold text-[#8d94a1] dark:text-white/45">Received</span>
          <span className="text-[12px] font-extrabold text-[#111827] dark:text-white">{mail.time}</span>
        </div>

        {mail.action ? (
          <button
            type="button"
            onClick={() => onClaim(mail.id)}
            disabled={mail.claimed}
            className={`mt-4 flex h-12 w-full items-center justify-center rounded-2xl text-[14px] font-extrabold active:scale-[0.99] ${
              mail.claimed
                ? 'bg-[#eef0f4] text-[#8d94a1] dark:bg-white/10 dark:text-white/45'
                : 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
            }`}
          >
            {mail.claimed ? 'Claimed' : mail.action}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default function InboxPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [mails, setMails] = useState([])
  const [selectedMailId, setSelectedMailId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorText, setErrorText] = useState('')

  const selectedMail = mails.find((mail) => mail.id === selectedMailId) || null

  const activeApiType = useMemo(() => {
    return TABS.find((tab) => tab.key === activeTab)?.apiType || 'all'
  }, [activeTab])

  useEffect(() => {
    let ignore = false

    async function loadMails() {
      const token = getReaderToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        setErrorText('')

        const response = await fetch(`${API_BASE_URL}/api/mails?type=${activeApiType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (response.status === 401 || response.status === 403) {
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Failed to load mails')
        }

        if (!ignore) {
          setMails((data.mails || []).map(normalizeMail))
        }
      } catch (error) {
        if (!ignore) {
          setErrorText(error.message || 'Failed to load mails')
          setMails([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadMails()

    return () => {
      ignore = true
    }
  }, [activeApiType, navigate])

  const updateMail = (mailId, nextRawMail) => {
    setMails((items) => items.map((mail) => (mail.id === mailId ? normalizeMail(nextRawMail) : mail)))
  }

  const handleOpenMail = async (mailId) => {
    setSelectedMailId(mailId)

    const currentMail = mails.find((mail) => mail.id === mailId)

    if (!currentMail || !currentMail.unread) return

    const token = getReaderToken()

    if (!token) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/mails/${mailId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.ok && data.mail) {
        updateMail(mailId, data.mail)
      }
    } catch {
      setMails((items) => items.map((mail) => (mail.id === mailId ? { ...mail, unread: false } : mail)))
    }
  }

  const handleClaim = async (mailId) => {
    const currentMail = mails.find((mail) => mail.id === mailId)

    if (!currentMail || currentMail.claimed) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/mails/${mailId}/claim`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to claim reward')
      }

      if (data.mail) {
        updateMail(mailId, data.mail)
      }
    } catch (error) {
      setErrorText(error.message || 'Failed to claim reward')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-4 dark:bg-[#0d0f16]">
      <MailDetailSheet mail={selectedMail} onClose={() => setSelectedMailId(null)} onClaim={handleClaim} />

      <main className="mx-auto max-w-[680px]">
        <header className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95 dark:bg-[#171923] dark:text-white dark:ring-white/10"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <div className="min-w-0 flex-1 pr-10 text-center">
            <h1 className="text-[20px] font-extrabold text-[#111827] dark:text-white">Inbox</h1>
            <p className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">Messages, rewards, and admin mail</p>
          </div>
        </header>

        <section className="mb-4 overflow-x-auto">
          <div className="flex w-max min-w-full gap-2 rounded-[18px] bg-white p-1.5 shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-[14px] px-4 py-2 text-[12px] font-extrabold ${
                  tab.key === activeTab
                    ? 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
                    : 'text-[#8d94a1] dark:text-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {errorText ? (
          <div className="mb-3 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-semibold text-[#e5484d] dark:bg-[#3a1f25]">
            {errorText}
          </div>
        ) : null}

        {loading ? (
          <section className="rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827] dark:border-white/10 dark:border-t-[#f6b800]" />
            <div className="text-[14px] font-extrabold text-[#111827] dark:text-white">Loading mails...</div>
          </section>
        ) : mails.length ? (
          <section className="space-y-3">
            {mails.map((mail) => (
              <MailCard key={mail.id} mail={mail} onOpen={handleOpenMail} onClaim={handleClaim} />
            ))}
          </section>
        ) : (
          <section className="rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1] dark:bg-white/10 dark:text-white/50">
              <i className="far fa-envelope-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[16px] font-extrabold text-[#111827] dark:text-white">No mail yet</h2>
            <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-5 text-[#8d94a1] dark:text-white/50">
              Admin messages, rewards, and important account mail will appear here.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

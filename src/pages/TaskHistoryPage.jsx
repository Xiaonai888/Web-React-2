import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function CrystalShardIcon({ className = 'h-5 w-5' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
        <path d="M12 2.6 19.2 7 17.4 17.2 12 21.4 6.6 17.2 4.8 7 12 2.6Z" fill="#F59E0B" />
        <path d="M12 2.6 9.1 8.2 12 21.4 14.9 8.2 12 2.6Z" fill="#FDBA74" />
        <path d="M4.8 7 9.1 8.2 6.6 17.2 4.8 7Z" fill="#D97706" />
        <path d="M19.2 7 14.9 8.2 17.4 17.2 19.2 7Z" fill="#B45309" />
        <path d="M9.1 8.2h5.8L12 21.4 9.1 8.2Z" fill="#FDE68A" opacity=".8" />
      </svg>
    </span>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-[20px] bg-white p-4 text-center shadow-sm ring-1 ring-black/5">
      <div className="text-[12px] font-bold text-[#8b93a1]">{label}</div>
      <div className="mt-2 flex items-center justify-center gap-1 text-[20px] font-black text-[#111827]">
        <CrystalShardIcon className="h-5 w-5" />
        {formatNumber(value)}
      </div>
    </div>
  )
}

export default function TaskHistoryPage() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState({
    today: 0,
    this_week: 0,
    this_month: 0,
    this_year: 0,
    total: 0,
  })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadHistory() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/tasks/history`, {
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load history')
      }

      setSummary(data.summary || {})
      setHistory(data.history || [])
    } catch (error) {
      setMessage(error.message || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[760px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[18px] font-black text-[#111827]">Reward History</h1>

          <button type="button" onClick={loadHistory} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-rotate-right text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pt-4">
        
      <section className="relative overflow-hidden rounded-[30px] bg-[#111827] p-5 text-white shadow-[0_18px_45px_rgba(17,24,39,0.22)]">
  <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#F6B800]/30 blur-2xl" />
  <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#ef4444]/15 blur-2xl" />
  <div className="absolute right-6 top-6 text-[62px] opacity-20">🏆</div>

  <div className="relative">
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-[#F6B800] ring-1 ring-white/10">
      <i className="fa-solid fa-clock-rotate-left" />
      Reward Records
    </div>

    <div className="mt-4 text-[12px] font-semibold text-white/60">Total Earned</div>

    <div className="mt-1 flex items-center gap-2 text-[36px] font-black leading-none tracking-[-0.04em]">
      <CrystalShardIcon className="h-7 w-7" />
      <span>{formatNumber(summary.total)}</span>
    </div>

    <p className="mt-2 max-w-[360px] text-[12px] font-semibold leading-5 text-white/65">
      Coins collected from daily rewards and missions.
    </p>
  </div>
</section>

<section className="mt-4 grid grid-cols-3 gap-3">
  <SummaryItem label="Today" value={summary.today} />
  <SummaryItem label="This Week" value={summary.this_week} />
  <SummaryItem label="This Month" value={summary.this_month} />
</section>

        <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="text-[20px] font-black text-[#111827]">Earned Center</h2>
          <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">Your real reward history.</p>

          {message ? (
            <button type="button" onClick={() => setMessage('')} className="mt-4 w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#111827]">
              {message}
            </button>
          ) : null}

          {loading ? (
            <div className="mt-5 space-y-3">
              <div className="h-16 animate-pulse rounded-[18px] bg-[#eef0f4]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[#eef0f4]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[#eef0f4]" />
            </div>
          ) : null}

          {!loading && history.length === 0 ? (
            <div className="mt-5 rounded-[22px] bg-[#f8fafc] p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <CrystalShardIcon className="h-7 w-7" />
              </div>
              <div className="text-[15px] font-black text-[#111827]">No history yet</div>
              <div className="mt-1 text-[12px] font-bold text-[#8b93a1]">Claim Daily Bonus to create your first record.</div>
            </div>
          ) : null}

          {!loading && history.length > 0 ? (
            <div className="mt-5 divide-y divide-[#eef0f4]">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7ed]">
                      <CrystalShardIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-black text-[#111827]">{item.source_title}</div>
                      <div className="mt-0.5 text-[11px] font-bold text-[#8b93a1]">{formatDate(item.created_at)}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[15px] font-black text-[#111827]">+{formatNumber(item.amount_gems)}</div>
                    {item.story_cards ? (
                      <div className="mt-0.5 text-[10px] font-black text-[#d97706]">+{item.story_cards} Story Card</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}

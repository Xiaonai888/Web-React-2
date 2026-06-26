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

function formatDateTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function CoinIcon({ className = 'h-5 w-5' }) {
  return (
    <img
      src="/assets/Icons/Shadow%20Coin.svg"
      alt="Coin"
      className={`inline-flex shrink-0 object-contain ${className}`}
    />
  )
}

function getHistoryTitle(item) {
  const raw = String(item.source_title || item.source || item.type || '').trim().toLowerCase()

  if (raw.includes('read')) return 'Reading Time Rewards'
  if (raw.includes('chest')) return 'Reward Chests'
  if (raw.includes('check')) return 'Check-in'
  if (raw.includes('wheel')) return 'Lucky Wheel'
  if (raw.includes('redeem')) return 'Redeemed for Gems'
  if (raw.includes('task')) return 'Task Rewards'
  if (raw.includes('bonus')) return 'Daily Check-in'

  return item.source_title || 'Coin Reward'
}

function getSignedAmount(value) {
  const amount = Number(value || 0)
  const sign = amount < 0 ? '-' : '+'

  return `${sign}${formatNumber(Math.abs(amount))}`
}

function SummaryItem({ label, value }) {
  return (
    <div className="min-w-0 px-2 py-4 text-center sm:px-4">
      <div className="text-[11px] font-bold text-[#8b93a1] sm:text-[12px]">{label}</div>
      <div className="mt-2 flex items-center justify-center gap-1 text-[18px] font-black text-[#111827] sm:text-[20px]">
        <CoinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="truncate">{formatNumber(value)}</span>
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
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-black text-[#111827]">Reward History</h1>

          <button
            type="button"
            onClick={() => setMessage('Reward details and coin rules will be added later.')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Hint"
          >
            <i className="fa-solid fa-circle-info text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-2 pt-3 sm:px-4 sm:pt-4">
        <section className="grid grid-cols-3 overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5 sm:rounded-[26px]">
          <SummaryItem label="Today" value={summary.today} />
          <SummaryItem label="This Week" value={summary.this_week} />
          <SummaryItem label="This Month" value={summary.this_month} />
        </section>

        <section className="mt-3 rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:mt-4 sm:p-5 sm:rounded-[28px]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-[#111827] sm:text-[20px]">History</h2>
              <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
                Your latest coin activity.
              </p>
            </div>

            <span className="rounded-full bg-[#fff7d6] px-3 py-1 text-[11px] font-black text-[#d97706]">
              All
            </span>
          </div>

          {message ? (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="mt-4 w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#111827]"
            >
              {message}
            </button>
          ) : null}

          {loading ? (
            <div className="mt-5 space-y-1">
              <div className="h-16 animate-pulse rounded-[18px] bg-[#f8fafc]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[#f8fafc]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[#f8fafc]" />
            </div>
          ) : null}

          {!loading && history.length === 0 ? (
            <div className="mt-5 rounded-[22px] bg-[#f8fafc] p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <CoinIcon className="h-8 w-8" />
              </div>
              <div className="text-[15px] font-black text-[#111827]">No history yet</div>
              <div className="mt-1 text-[12px] font-bold text-[#8b93a1]">
                Claim rewards to create your first coin record.
              </div>
            </div>
          ) : null}

          {!loading && history.length > 0 ? (
            <div className="mt-5 divide-y divide-[#f1f2f6]">
              {history.map((item) => {
                const amount = Number(item.amount_gems || 0)
                const isNegative = amount < 0

                return (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold text-[#333843]">
                        {getHistoryTitle(item)}
                      </div>
                      <div className="mt-1 text-[12px] font-medium text-[#9aa1ad]">
                        {formatDateTime(item.created_at)}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-right">
                      <CoinIcon className={`h-5 w-5 ${isNegative ? 'grayscale opacity-70' : ''}`} />
                      <span className={`text-[15px] font-black ${isNegative ? 'text-[#333843]' : 'text-[#111827]'}`}>
                        {getSignedAmount(amount)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}

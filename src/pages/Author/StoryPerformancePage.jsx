import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

function currentMonth() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function money(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function number(value) {
  return Number(value || 0).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function monthLabel(value) {
  const [year, month] = String(value || '').split('-').map(Number)

  if (!year || !month) return 'Selected month'

  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-[14px] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-normal text-[#8d94a1]">{label}</div>
        <i className={`${icon} text-[13px] text-[#e85b73]`} />
      </div>
      <div className="mt-3 text-[22px] font-normal text-[#111827]">{value}</div>
    </div>
  )
}

function EpisodeIncomeRow({ item, last }) {
  return (
    <div className="relative flex items-center gap-3 bg-white px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f4] text-[12px] font-normal text-[#e85b73]">
        {item.episode_number ? `EP ${item.episode_number}` : 'EP'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-normal text-[#111827]">
          {item.title || 'Untitled Episode'}
        </div>
        <div className="mt-1 text-[10.5px] font-normal text-[#8d94a1]">
          {number(item.unlocks)} unlocks • {number(item.diamonds)} Diamonds
        </div>
      </div>

      <div className="shrink-0 text-[13px] font-normal text-[#111827]">
        {money(item.income_usd)}
      </div>

      {!last ? <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[#eceef2]" /> : null}
    </div>
  )
}

export default function StoryPerformancePage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [month, setMonth] = useState(currentMonth())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPerformance() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/performance?month=${encodeURIComponent(month)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load performance')
        }

        if (!ignore) setData(result)
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Cannot connect to backend.'
              : loadError.message || 'Failed to load performance'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPerformance()

    return () => {
      ignore = true
    }
  }, [month, navigate, storyId])

  const episodes = useMemo(() => data?.episodes || [], [data])

  return (
    <div className="min-h-screen bg-[#f7f7f9] text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eceef2] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid h-[58px] max-w-4xl grid-cols-[44px_1fr_44px] items-center px-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center active:opacity-60"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[15px] font-normal">Performance</h1>
          <div />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-4 sm:px-5">
        <section className="rounded-[14px] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="aspect-[2/3] w-[58px] shrink-0 overflow-hidden rounded-[8px] bg-[#eef0f3]">
              {data?.story?.cover_url ? (
                <img
                  src={data.story.cover_url}
                  alt={data.story.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#8d94a1]">
                  <i className="fa-regular fa-image text-[16px]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-2 text-[17px] font-normal">
                {data?.story?.title || 'Story Performance'}
              </div>
              <div className="mt-1 text-[11px] font-normal text-[#8d94a1]">
                Episode unlock income only
              </div>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-[11px] font-normal text-[#8d94a1]">Month</span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value || currentMonth())}
              className="mt-1 h-11 w-full rounded-[12px] border border-[#e3e5e9] bg-white px-3 text-[13px] font-normal text-[#111827] outline-none focus:border-[#e85b73]"
            />
          </label>
        </section>

        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mt-3 w-full rounded-[12px] bg-[#fff1f2] px-4 py-3 text-left text-[12px] font-normal text-[#e5484d]"
          >
            {error}
          </button>
        ) : null}

        {loading ? (
          <div className="mt-3 rounded-[14px] bg-white px-4 py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#e85b73]" />
            <div className="mt-3 text-[12px] font-normal text-[#8d94a1]">
              Loading performance...
            </div>
          </div>
        ) : null}

        {!loading && data ? (
          <>
            <div className="mt-3 flex items-center justify-between px-1">
              <div className="text-[14px] font-normal">{monthLabel(data.month)}</div>
              <div className="text-[11px] font-normal text-[#8d94a1]">
                Diamond unlocks
              </div>
            </div>

            <section className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard
                label="Monthly Income"
                value={money(data.summary?.income_usd)}
                icon="fa-solid fa-dollar-sign"
              />
              <SummaryCard
                label="Unlocks"
                value={number(data.summary?.unlocks)}
                icon="fa-solid fa-unlock-keyhole"
              />
              <SummaryCard
                label="Diamonds"
                value={number(data.summary?.diamonds)}
                icon="fa-solid fa-gem"
              />
            </section>

            <section className="mt-3 overflow-hidden rounded-[14px] bg-white">
              <div className="px-4 pb-3 pt-4 text-[14px] font-normal">
                Income by Episode
              </div>

              {episodes.length ? (
                episodes.map((item, index) => (
                  <EpisodeIncomeRow
                    key={item.episode_id || `${item.title}-${index}`}
                    item={item}
                    last={index === episodes.length - 1}
                  />
                ))
              ) : (
                <div className="px-6 py-14 text-center">
                  <div className="text-[14px] font-normal text-[#111827]">
                    No unlock income this month.
                  </div>
                  <div className="mt-2 text-[11px] font-normal text-[#8d94a1]">
                    Episode unlock earnings will appear here.
                  </div>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

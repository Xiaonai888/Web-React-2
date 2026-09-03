import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatMoney(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}

function cambodiaDateValue(date = new Date()) {
  const cambodiaDate = new Date(date.getTime() + CAMBODIA_OFFSET_MS)
  const year = cambodiaDate.getUTCFullYear()
  const month = String(cambodiaDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(cambodiaDate.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function timeText(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getInitial(value) {
  return String(value || 'R').slice(0, 1).toUpperCase()
}

function ReaderAvatar({ record }) {
  if (record.reader_avatar_url) {
    return (
      <img
        src={record.reader_avatar_url}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff1f5] text-[15px] font-black text-[#ff3b5f]">
      {getInitial(record.reader_name)}
    </div>
  )
}

function PeriodTab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 min-w-0 items-center justify-center whitespace-nowrap rounded-full px-1 text-[10.5px] font-semibold text-[#111827] transition active:scale-[0.98] ${
        active ? 'bg-[#ff3b5f] text-white' : 'bg-white text-[#111827]'
      }`}
    >
      {label}
    </button>
  )
}

function TransactionRow({ record }) {
  const isGift =
    record.earning_type === 'gift' ||
    record.source_type === 'diamond_gift'
  const quantity = Math.max(1, Number(record.gift_quantity || 1))
  const episodeText =
    Number(record.episode_number || 0) > 0
      ? `Episode ${record.episode_number}`
      : record.episode_title || 'Episode unlock'
  const actionText = isGift
    ? quantity > 1
      ? `sent ${quantity} × ${record.gift_name || 'Diamond Gift'}`
      : `sent ${record.gift_name || 'Diamond Gift'}`
    : `unlocked ${episodeText}`

  return (
    <div className="flex items-center gap-3 border-b border-[#f1f1f2] px-4 py-3.5 last:border-b-0">
      <ReaderAvatar record={record} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-semibold text-[#111827]">
          <span className="font-black">{record.reader_name || 'Reader'}</span>
          <span className="font-medium text-[#667085]"> {actionText}</span>
        </div>

        <div className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[#ff3b5f]">
          {isGift ? 'Diamond Gift' : 'Paid Unlock'} · {record.story_title || 'Story'}
        </div>

        <div className="mt-1 text-[10.5px] font-medium text-[#98a2b3]">
          {timeText(record.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[13.5px] font-black text-[#111827]">
          +{formatMoney(record.author_net_payout_usd)}
        </div>

        <div className="mt-1 flex items-center justify-end gap-1 text-[10.5px] font-semibold text-[#98a2b3]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{formatNumber(record.author_earned_diamonds)}</span>
        </div>
      </div>
    </div>
  )
}

function CalendarSheet({
  open,
  period,
  selectedDate,
  onClose,
  onApply,
}) {
  const [draftValue, setDraftValue] = useState(selectedDate)
  const [dragStartY, setDragStartY] = useState(null)
  const [dragY, setDragY] = useState(0)

  useEffect(() => {
    if (!open) return

    setDragStartY(null)
    setDragY(0)

    if (period === 'month') {
      setDraftValue(selectedDate.slice(0, 7))
      return
    }

    if (period === 'year') {
      setDraftValue(selectedDate.slice(0, 4))
      return
    }

    setDraftValue(selectedDate)
  }, [open, period, selectedDate])

  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const root = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousRootOverflow = root.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    root.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      root.style.overflow = previousRootOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const currentYear = Number(cambodiaDateValue().slice(0, 4))
  const years = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  )

  function applySelection() {
    if (!draftValue) return

    if (period === 'month') {
      onApply(`${draftValue}-01`)
      return
    }

    if (period === 'year') {
      onApply(`${draftValue}-01-01`)
      return
    }

    onApply(draftValue)
  }

  function handleTouchStart(event) {
    setDragStartY(event.touches[0].clientY)
    setDragY(0)
  }

  function handleTouchMove(event) {
    if (dragStartY === null) return

    const distance = Math.max(
      0,
      event.touches[0].clientY - dragStartY
    )

    setDragY(distance)
  }

  function handleTouchEnd(event) {
    const endY =
      event.changedTouches[0]?.clientY ?? dragStartY ?? 0
    const distance =
      dragStartY === null ? 0 : endY - dragStartY

    setDragStartY(null)
    setDragY(0)

    if (distance >= 90) {
      onClose()
    }
  }

  function handleTouchCancel() {
    setDragStartY(null)
    setDragY(0)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end bg-black/35">
      <button
        type="button"
        aria-label="Close calendar"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div
        className="relative w-full rounded-t-[26px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-2 shadow-[0_-16px_50px_rgba(15,23,42,0.18)]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition:
            dragStartY === null
              ? 'transform 220ms ease'
              : 'none',
        }}
      >
        <div
          className="select-none pb-1 pt-1"
          style={{ touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d0d5dd]" />

          <div className="mt-5">
            <h2 className="text-[18px] font-bold text-[#111827]">
              Choose record date
            </h2>

            <p className="mt-1 text-[12px] font-normal text-[#98a2b3]">
              Select the{' '}
              {period === 'week' ? 'week date' : period}{' '}
              you want to view.
            </p>
          </div>
        </div>

        <div className="mt-5">
          {period === 'year' ? (
            <select
              value={draftValue}
              onChange={(event) =>
                setDraftValue(event.target.value)
              }
              className="h-[52px] w-full rounded-[15px] border border-[#e4e7ec] bg-white pl-4 pr-8 text-[15px] font-normal text-[#111827] outline-none focus:border-[#ff3b5f] [&::-webkit-calendar-picker-indicator]:mr-1"
            >
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={period === 'month' ? 'month' : 'date'}
              value={draftValue}
              onChange={(event) =>
                setDraftValue(event.target.value)
              }
              className="h-[52px] w-full rounded-[15px] border border-[#e4e7ec] bg-white pl-4 pr-8 text-[15px] font-normal text-[#111827] outline-none focus:border-[#ff3b5f] [&::-webkit-calendar-picker-indicator]:mr-1"
            />
          )}
        </div>

        <button
          type="button"
          onClick={applySelection}
          className="mt-5 h-12 w-full rounded-full bg-[#ff3b5f] text-[14px] font-normal text-white active:scale-[0.99]"
        >
          View Income
        </button>
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-9 animate-pulse rounded-full bg-white" />
        ))}
      </div>
      <div className="h-[150px] animate-pulse rounded-[20px] bg-white" />
      <div className="h-[320px] animate-pulse rounded-[20px] bg-white" />
    </div>
  )
}

export default function AuthorIncomePage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('day')
  const [selectedDate, setSelectedDate] = useState(cambodiaDateValue())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadIncome() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const search = new URLSearchParams({
          record_period: period,
          record_date: selectedDate,
        })

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/income?${search.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load income records')
        }

        if (!ignore) {
          setData(result)
        }
      } catch (loadError) {
        if (
          loadError?.name !== 'AbortError' &&
          !ignore
        ) {
          setError(
            loadError.message === 'Failed to fetch'
              ? 'Cannot connect to backend.'
              : loadError.message || 'Failed to load income records'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadIncome()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, period, selectedDate])

  const record = data?.income_record || {}
  const records = useMemo(
    () => Array.isArray(record.records) ? record.records : [],
    [record.records]
  )

  const periods = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ]

  function selectCurrentPeriod(nextPeriod) {
    setPeriod(nextPeriod)
    setSelectedDate(cambodiaDateValue())
  }

  return (
    <div
  className="min-h-screen pb-10"
  style={{
    backgroundColor: '#FAFAFA',
    backgroundImage: 'linear-gradient(180deg, rgba(250,250,250,0) 0%, rgba(250,250,250,0.18) 38%, rgba(250,250,250,0.72) 76%, #FAFAFA 100%), linear-gradient(90deg, #FFF1F5 0%, #FFF8E8 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 270px, 100% 270px',
  }}
>
      <header className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827]">Income Records</h1>

          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            aria-label="Choose date"
            className="flex h-10 w-10 items-center justify-center text-black active:scale-95"
          >
            <i className="fa-regular fa-calendar text-[16px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        {loading && !data ? <LoadingPage /> : null}

        {error ? (
          <div className="rounded-[18px] bg-[#fff1f1] px-4 py-4 text-center text-[12.5px] font-semibold text-[#e5484d]">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="grid grid-cols-4 gap-2">
              {periods.map((item) => (
                <PeriodTab
                  key={item.key}
                  label={item.label}
                  active={period === item.key}
                  onClick={() => selectCurrentPeriod(item.key)}
                />
              ))}
            </section>

            <section className="overflow-hidden">
              <div className="px-4 pb-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                      {record.label || 'Selected income'}
                    </div>

                    <div className="mt-2 text-[32px] font-bold leading-none tracking-[-0.04em] text-[#ff3b5f]">
                      {formatMoney(record.total_usd)}
                    </div>

                    <div className="mt-2 text-[11px] font-semibold text-[#667085]">
                      Net author income (USD)
                    </div>
                  </div>

                  
                </div>

                <div className="mt-5 grid grid-cols-2 divide-x divide-[#edf0f4] py-3">
                  <div className="px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/Icons/Diamond.svg"
                        alt=""
                        className="h-[19px] w-[19px] object-contain"
                      />
                      <span className="text-[18px] font-black text-[#111827]">
                        {formatNumber(record.total_diamonds)}
                      </span>
                    </div>
                    <div className="mt-1 text-[10.5px] font-semibold text-[#98a2b3]">
                      Diamonds earned
                    </div>
                  </div>

                  <div className="px-4">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-lock-open text-[16px] text-[#ff3b5f]" />
                      <span className="text-[18px] font-black text-[#111827]">
                        {formatNumber(record.unlock_count)}
                      </span>
                    </div>
                    <div className="mt-1 text-[10.5px] font-semibold text-[#98a2b3]">
                      Paid unlocks
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] border border-[#eeeeef] bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-[#f1f1f2] px-4 py-4">
                <div>
                  <h2 className="text-[14px] font-black text-[#111827]">Income Sources</h2>
                  <p className="mt-1 text-[10.5px] font-medium text-[#98a2b3]">
                    Readers who unlocked your episodes
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[12px] font-black text-[#111827]">
                    {formatNumber(record.unlock_count)} unlocks
                  </div>
                  <div className="mt-1 text-[10px] font-semibold text-[#98a2b3]">
                    {record.has_more ? 'Latest 100 shown' : 'All shown'}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-3 px-4 py-5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded-[14px] bg-[#f5f5f6]" />
                  ))}
                </div>
              ) : records.length ? (
                records.map((item) => <TransactionRow key={item.id} record={item} />)
              ) : (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center">
                    <img
                      src="/assets/Icons/Diamond.svg"
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div className="mt-4 text-[14px] font-black text-[#111827]">
                    No paid income found
                  </div>
                  <div className="mx-auto mt-2 max-w-[260px] text-[11.5px] font-medium leading-5 text-[#98a2b3]">
                    Paid episode unlocks for this selected period will appear here.
                  </div>
                </div>
              )}
            </section>

            <div className="rounded-[17px] bg-[#fff6d8] px-4 py-3 text-[11px] font-normal leading-5 text-[#9a5b00]">
  <i className="fa-solid fa-circle-info mr-2 text-[#9a5b00]" />
  Income shown here is the author’s net USD amount from paid Diamond unlocks.
</div>
          </>
        ) : null}
      </main>

      <CalendarSheet
        open={calendarOpen}
        period={period}
        selectedDate={selectedDate}
        onClose={() => setCalendarOpen(false)}
        onApply={(value) => {
          setSelectedDate(value)
          setCalendarOpen(false)
        }}
      />
    </div>
  )
}

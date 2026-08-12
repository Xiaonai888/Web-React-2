import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'
const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000
function getCambodiaDate(value = new Date()) {
  return new Date(
    new Date(value).getTime() +
      CAMBODIA_OFFSET_MS
  )
}

function getNextWednesday(now, skipToday = false) {
  const cambodiaDate = getCambodiaDate(now)
  let daysUntilWednesday =
    (3 - cambodiaDate.getUTCDay() + 7) % 7

  if (
    daysUntilWednesday === 0 &&
    skipToday
  ) {
    daysUntilWednesday = 7
  }

  const wednesdayMidnightUtc = Date.UTC(
    cambodiaDate.getUTCFullYear(),
    cambodiaDate.getUTCMonth(),
    cambodiaDate.getUTCDate() +
      daysUntilWednesday
  )

  return new Date(
    wednesdayMidnightUtc -
      CAMBODIA_OFFSET_MS
  )
}

function getTimeParts(target, now) {
  const difference = Math.max(
    0,
    target.getTime() - now.getTime()
  )
  const totalSeconds = Math.floor(
    difference / 1000
  )

 return {
  days: Math.floor(totalSeconds / 86400),
  hours: Math.floor(
    (totalSeconds % 86400) / 3600
  ),
  minutes: Math.floor(
    (totalSeconds % 3600) / 60
  ),
  seconds: totalSeconds % 60,
}

function formatEventDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function WriterWednesdayEventCard() {
  const navigate = useNavigate()
  const [now, setNow] = useState(
  () => new Date()
)
const [serverEvent, setServerEvent] =
  useState(null)

  useEffect(() => {
  let ignore = false

  async function syncEvent() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/unlocks/events/writer-wednesday`
      )
      const data = await response.json()

      if (!response.ok || data.ok === false) {
        throw new Error('Failed')
      }

      if (!ignore) setServerEvent(data.event)
    } catch {
      if (!ignore) setServerEvent(null)
    }
  }

  syncEvent()
  const timer = window.setInterval(
    syncEvent,
    60000
  )

  return () => {
    ignore = true
    window.clearInterval(timer)
  }
}, [])
  useEffect(() => {
  const timer = window.setInterval(() => {
    setNow(new Date())
  }, 1000)

  return () => window.clearInterval(timer)
}, [])

  const isLive = serverEvent
  ? Boolean(serverEvent.active)
  : getCambodiaDate(now).getUTCDay() === 3

  const eventDate = useMemo(() => {
  if (isLive) {
    if (serverEvent?.ends_at) {
      return new Date(serverEvent.ends_at)
    }

    const cambodiaNow = getCambodiaDate(now)
    const localSeconds =
      cambodiaNow.getUTCHours() * 3600 +
      cambodiaNow.getUTCMinutes() * 60 +
      cambodiaNow.getUTCSeconds()

    return new Date(
      now.getTime() +
        Math.max(0, 86400 - localSeconds) * 1000
    )
  }

  return serverEvent?.starts_at
    ? new Date(serverEvent.starts_at)
    : getNextWednesday(now)
}, [serverEvent, isLive, now])

  const countdown = getTimeParts(
    eventDate,
    now
  )

  return (
    <button
      type="button"
      onClick={() =>
        navigate('/event/writer-wednesday')
      }
      className="mt-4 block w-full overflow-hidden rounded-[24px] border border-[#E9E2F5] bg-white text-left shadow-[0_14px_36px_rgba(124,58,237,0.10)] active:scale-[0.99]"
    >
      <div className="bg-[linear-gradient(135deg,#FAF7FF_0%,#FFFFFF_100%)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EAFE] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#7C3AED]">
            <i className="fa-regular fa-calendar" />
            {isLive
              ? 'Happening Now'
              : 'Weekly Event'}
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EDFF] text-[#7C3AED]">
            <i className="fa-solid fa-chevron-right text-[11px]" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[112px_1fr] gap-4">
          <div className="flex h-[140px] items-center justify-center rounded-[22px] border-2 border-dashed border-[#C4B5FD] bg-[#F8F5FF] text-center text-[10px] font-bold leading-4 text-[#8B5CF6]">
            Image
            <br />
            placeholder
          </div>

          <div className="min-w-0 py-1">
            <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8B5CF6]">
              Writer
            </div>

            <h3 className="mt-1 text-[25px] font-black leading-[1.05] tracking-[-0.04em] text-[#17182A]">
              Wednesday
            </h3>

            <p className="mt-3 text-[12px] font-semibold leading-5 text-[#6B7280]">
              Authors earn 70% from eligible
              Diamond episode unlocks.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#F5F3FF] px-3 py-2 text-[11px] font-black text-[#6D28D9]">
              <i className="fa-solid fa-gem" />
              70% for authors
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-[16px] border border-[#EDE9FE] bg-white px-3 py-3 text-center">
            <i className="fa-solid fa-percent text-[15px] text-[#7C3AED]" />
            <div className="mt-2 text-[13px] font-black text-[#17182A]">
              70%
            </div>
            <div className="mt-1 text-[9px] font-semibold text-[#8B909B]">
              Author share
            </div>
          </div>

          <div className="rounded-[16px] border border-[#EDE9FE] bg-white px-3 py-3 text-center">
            <i className="fa-regular fa-calendar-days text-[15px] text-[#7C3AED]" />
            <div className="mt-2 text-[13px] font-black text-[#17182A]">
              Wednesday
            </div>
            <div className="mt-1 text-[9px] font-semibold text-[#8B909B]">
              Every week
            </div>
          </div>

          <div className="rounded-[16px] border border-[#EDE9FE] bg-white px-3 py-3 text-center">
            <i className="fa-solid fa-gem text-[15px] text-[#7C3AED]" />
            <div className="mt-2 text-[13px] font-black text-[#17182A]">
              Diamond
            </div>
            <div className="mt-1 text-[9px] font-semibold text-[#8B909B]">
              Unlock only
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] border border-[#EDE9FE] bg-white px-4 py-4">
          <div className="text-[10px] font-black uppercase tracking-[0.13em] text-[#8B5CF6]">
            {isLive
              ? 'Ends Today'
              : 'Next Writer Wednesday'}
          </div>

          <div className="mt-1 text-[15px] font-black text-[#17182A]">
            {isLive
              ? 'Today, 11:59 PM'
              : formatEventDate(eventDate)}
          </div>

          {!isLive ? (
            <div className="mt-2 flex items-center gap-2 text-[11px] font-black text-[#7C3AED]">
              <i className="fa-regular fa-clock" />
              Starts in {countdown.days}d{' '}
              {countdown.hours}h{' '}
              {countdown.minutes}m
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 text-[11px] font-black text-[#16A34A]">
              <i className="fa-solid fa-circle-check" />
              Active now
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { requestAuthor49DayEvent } from '../../services/author49DayEventClientCache'

function getAuthToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getCountdown(milliseconds) {
  const totalSeconds = Math.max(
    0,
    Math.floor(Number(milliseconds || 0) / 1000)
  )

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isLastDay: totalSeconds < 86400,
  }
}

export default function Author49DayDashboardCard({ onStartWriting }) {
  const [event, setEvent] = useState(null)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let ignore = false
    let releaseRequest = () => {}

    async function loadEvent() {
      const token = getAuthToken()
      if (!token) return

      releaseRequest()

      const request =
        requestAuthor49DayEvent(token)

      releaseRequest = request.release

      try {
        const nextEvent = await request.promise

        if (!ignore) {
          setEvent(nextEvent)

          const serverNow = new Date(
            nextEvent?.server_now || ''
          ).getTime()

          setServerOffsetMs(
            Number.isFinite(serverNow)
              ? serverNow - Date.now()
              : 0
          )
        }
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !ignore
        ) {
          setEvent(null)
        }
      } finally {
        releaseRequest()
        releaseRequest = () => {}
      }
    }

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        loadEvent()
      }
    }

    loadEvent()
    window.addEventListener('focus', refreshOnFocus)

    return () => {
      ignore = true
      releaseRequest()
      window.removeEventListener(
        'focus',
        refreshOnFocus
      )
    }
  }, [])

  useEffect(() => {
    const timerId = window.setInterval(
      () => setNow(Date.now()),
      1000
    )

    return () => window.clearInterval(timerId)
  }, [])

  const remainingMs = useMemo(() => {
    if (event?.status !== 'active' || !event?.ends_at) {
      return 0
    }

    const endsAt = new Date(event.ends_at).getTime()
    if (!Number.isFinite(endsAt)) return 0

    return Math.max(
      0,
      endsAt - (now + serverOffsetMs)
    )
  }, [event, now, serverOffsetMs])

  const countdown = useMemo(
    () => getCountdown(remainingMs),
    [remainingMs]
  )

  if (
    !event ||
    !event.visible ||
    event.status === 'finished' ||
    (event.status === 'active' && remainingMs <= 0)
  ) {
    return null
  }

  const isActive = event.status === 'active'

  return (
    <section className="mt-5 overflow-hidden rounded-[16px] border border-[#F2C230] bg-black shadow-[0_10px_26px_rgba(216,164,0,0.12)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src="/assets/Icons/Event/Event 1.webp"
          alt="80% for 49 Days Event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-4 pb-4 pt-14">
          {isActive ? (
            <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-black bg-[#FFC400] px-3 text-black shadow-[0_4px_0_#111111]">
              <i className="fa-regular fa-clock text-[11px]" />
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {String(countdown.days).padStart(2, '0')}D
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartWriting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-black bg-[#FFC400] text-[12px] font-black text-black shadow-[0_4px_0_#111111] transition active:translate-y-[2px] active:shadow-[0_2px_0_#111111]"
            >
              <i className="fa-solid fa-pen-nib text-[10px]" />
              Start Writing
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

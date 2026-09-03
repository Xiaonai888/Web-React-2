import { useEffect, useMemo, useState } from 'react'
import { requestAuthor49DayEvent } from '../../services/author49DayEventClientCache'

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
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
  }
}

export default function Author49DayEventCard({
  onStartWriting,
  startWritingLoading = false,
}) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let ignore = false
    let releaseRequest = () => {}

    async function loadEvent() {
      const token = getReaderToken()

      if (!token) {
        if (!ignore) {
          setEvent({
            visible: true,
            enabled: true,
            status: 'not_started',
          })
          setServerOffsetMs(0)
          setLoading(false)
        }
        return
      }

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
          setServerOffsetMs(0)
        }
      } finally {
        releaseRequest()
        releaseRequest = () => {}

        if (!ignore) {
          setLoading(false)
        }
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
    if (
      event?.status !== 'active' ||
      !event?.ends_at
    ) {
      return 0
    }

    const endsAt = new Date(
      event.ends_at
    ).getTime()

    if (!Number.isFinite(endsAt)) {
      return 0
    }

    return Math.max(
      0,
      endsAt - (now + serverOffsetMs)
    )
  }, [event, now, serverOffsetMs])

  const countdown = useMemo(
    () => getCountdown(remainingMs),
    [remainingMs]
  )

  if (loading) {
    return (
      <div className="mt-4 aspect-square w-full animate-pulse rounded-[24px] bg-[#FFF5D8] dark:bg-amber-500/10" />
    )
  }

  if (
    !event ||
    !event.visible ||
    event.status === 'finished' ||
    (event.status === 'active' && remainingMs <= 0)
  ) {
    return null
  }

  const isActive =
    event.status === 'active'

  return (
    <section className="mt-4 overflow-hidden rounded-[24px] border border-[#F2B705] bg-black shadow-[0_16px_38px_rgba(246,184,0,0.16)]">
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src="/assets/Icons/Event/Event 2.webp"
          alt="80% for 49 Days Event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-4 pb-4 pt-16">
          {isActive ? (
            <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border-2 border-black bg-[#FFC400] px-3 text-black shadow-[0_5px_0_#111111]">
              <i className="fa-regular fa-clock text-[13px]" />
              <span className="text-[15px] font-black tabular-nums tracking-[0.02em]">
                {String(countdown.days).padStart(2, '0')}D
              </span>
              <span className="text-[14px] font-black">:</span>
              <span className="text-[15px] font-black tabular-nums tracking-[0.02em]">
                {String(countdown.hours).padStart(2, '0')}H
              </span>
              <span className="text-[14px] font-black">:</span>
              <span className="text-[15px] font-black tabular-nums tracking-[0.02em]">
                {String(countdown.minutes).padStart(2, '0')}M
              </span>
              <span className="text-[14px] font-black">:</span>
              <span className="text-[15px] font-black tabular-nums tracking-[0.02em]">
                {String(countdown.seconds).padStart(2, '0')}S
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartWriting}
              disabled={startWritingLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border-2 border-black bg-[#FFC400] text-[14px] font-black text-black shadow-[0_5px_0_#111111] transition active:translate-y-[3px] active:shadow-[0_2px_0_#111111] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className="fa-solid fa-pen-nib text-[13px]" />
              {startWritingLoading
                ? 'Opening...'
                : 'Start Writing'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

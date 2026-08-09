import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function clampRemaining(value) {
  return Math.max(0, Number(value || 0))
}

function getCountdownParts(milliseconds) {
  const totalSeconds = Math.floor(
    clampRemaining(milliseconds) / 1000
  )
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  )
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  )
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    isLastDay: totalSeconds < 86400,
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function CountdownBlock({
  value,
  label,
}) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[18px] font-black leading-none text-[#111111] sm:text-[22px]">
        {pad(value)}
      </div>
      <div className="mt-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#787878] sm:text-[9px]">
        {label}
      </div>
    </div>
  )
}

export default function Author49DayEventCard({
  onStartWriting,
  startWritingLoading = false,
}) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serverOffsetMs, setServerOffsetMs] =
    useState(0)
  const [nowTick, setNowTick] = useState(
    Date.now()
  )

  useEffect(() => {
    let ignore = false

    async function loadEvent() {
      const token = getReaderToken()

      if (!token) {
        if (!ignore) {
          setEvent({
            visible: true,
            enabled: true,
            status: 'not_started',
            share_percent: 80,
            duration_days: 49,
            started_at: null,
            ends_at: null,
          })
          setLoading(false)
        }
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/49-day-event`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              'Failed to load event'
          )
        }

        if (!ignore) {
          const nextEvent = data.event || null
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
      } catch {
        if (!ignore) setEvent(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadEvent()

    const refreshTimer =
      window.setInterval(
        loadEvent,
        60000
      )

    return () => {
      ignore = true
      window.clearInterval(refreshTimer)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
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
    const correctedNow =
      nowTick + serverOffsetMs

    if (!Number.isFinite(endsAt)) {
      return 0
    }

    return Math.max(
      0,
      endsAt - correctedNow
    )
  }, [
    event,
    nowTick,
    serverOffsetMs,
  ])

  const countdown = useMemo(
    () =>
      getCountdownParts(
        remainingMs
      ),
    [remainingMs]
  )

  if (loading) {
    return (
      <div className="mt-4 aspect-square w-full animate-pulse rounded-[24px] bg-[#FFF5D8]" />
    )
  }

  if (
    !event ||
    !event.visible ||
    event.status === 'finished' ||
    (
      event.status === 'active' &&
      remainingMs <= 0
    )
  ) {
    return null
  }

  const isActive =
    event.status === 'active'

  return (
    <section className="mt-4 overflow-hidden rounded-[24px] border border-[#F2B705] bg-[#FFFDF7] shadow-[0_16px_38px_rgba(246,184,0,0.16)]">
      <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_72%_28%,rgba(255,214,70,0.30),transparent_34%),linear-gradient(145deg,#FFFDF7_0%,#FFFFFF_58%,#FFF3BF_100%)] p-4 sm:p-5">
        <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#FFC400]" />
        <div className="absolute -right-10 -bottom-12 h-40 w-40 rounded-full bg-[#FFC400]" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white sm:text-[10px]">
            Author Event
          </div>

          <div className="rounded-[14px] border-2 border-black bg-[#FFC400] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-black sm:text-[10px]">
            Limited Event
          </div>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-[1.04fr_0.96fr] gap-3">
          <div className="min-w-0">
            <div className="flex items-end gap-2 leading-none">
              <span className="text-[48px] font-black tracking-[-0.08em] text-black sm:text-[58px]">
                80%
              </span>
              <span className="mb-2 text-[18px] font-black text-[#F6B800] sm:text-[21px]">
                for
              </span>
            </div>

            <div className="-mt-1 flex items-end gap-2 leading-none">
              <span className="text-[43px] font-black tracking-[-0.07em] text-[#F6B800] sm:text-[52px]">
                49
              </span>
              <span className="mb-1 text-[24px] font-black tracking-[-0.04em] text-black sm:text-[29px]">
                Days
              </span>
            </div>

            <div className="mt-2 inline-flex rounded-[10px] bg-black px-3 py-2 text-[10px] font-black text-white sm:text-[11px]">
              Write. Publish.
              <span className="ml-1 text-[#FFC400]">
                Earn More.
              </span>
            </div>
          </div>

          <div className="relative flex min-h-[126px] items-center justify-center sm:min-h-[150px]">
            <div className="absolute inset-0 rotate-3 rounded-[24px] border-2 border-dashed border-[#DFA900] bg-[#FFF7D6]" />
            <div className="relative z-10 flex h-[86%] w-[86%] flex-col items-center justify-center rounded-[20px] border border-[#E9C85B] bg-white/85 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC400] text-black">
                <i className="fa-solid fa-image text-[18px]" />
              </div>
              <div className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#5A4B16]">
                Author Image
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-3 divide-x divide-[#E8CF71] rounded-[16px] border border-[#E8CF71] bg-white/90 px-2 py-2">
          <div className="text-center">
            <i className="fa-solid fa-percent text-[14px] text-[#E3AB00]" />
            <div className="mt-1 text-[13px] font-black text-black">
              80%
            </div>
            <div className="text-[8px] font-bold text-[#7D7460]">
              Share
            </div>
          </div>

          <div className="text-center">
            <i className="fa-regular fa-calendar-days text-[14px] text-[#E3AB00]" />
            <div className="mt-1 text-[13px] font-black text-black">
              49
            </div>
            <div className="text-[8px] font-bold text-[#7D7460]">
              Days
            </div>
          </div>

          <div className="text-center">
            <i className="fa-regular fa-file-lines text-[14px] text-[#E3AB00]" />
            <div className="mt-1 text-[13px] font-black text-black">
              1
            </div>
            <div className="text-[8px] font-bold text-[#7D7460]">
              Episode
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-3">
          {isActive ? (
            <div className="rounded-[16px] border border-[#E5C95A] bg-white/95 px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.10em] text-[#166534]">
                    Active
                  </span>
                </div>
                <span className="text-[9px] font-black text-[#7D7460]">
                  Time Left
                </span>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[#EDE1B4]">
                {countdown.isLastDay ? (
                  <>
                    <CountdownBlock
                      value={countdown.hours}
                      label="Hours"
                    />
                    <CountdownBlock
                      value={countdown.minutes}
                      label="Minutes"
                    />
                    <CountdownBlock
                      value={countdown.seconds}
                      label="Seconds"
                    />
                  </>
                ) : (
                  <>
                    <CountdownBlock
                      value={countdown.days}
                      label="Days"
                    />
                    <CountdownBlock
                      value={countdown.hours}
                      label="Hours"
                    />
                    <CountdownBlock
                      value={countdown.minutes}
                      label="Minutes"
                    />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[#DDD5C4] bg-white/95 px-4 py-2.5">
              <div className="flex items-center gap-2 text-[#7D7460]">
                <i className="fa-regular fa-clock text-[13px]" />
                <span className="text-[12px] font-black">
                  Not Started
                </span>
              </div>
              <span className="text-right text-[9px] font-bold leading-4 text-[#8A806A]">
                Publish 1 episode
                <br />
                to activate
              </span>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-2.5">
          <button
            type="button"
            onClick={onStartWriting}
            disabled={startWritingLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border-2 border-black bg-[#FFC400] text-[14px] font-black text-black shadow-[0_5px_0_#111111] transition active:translate-y-[3px] active:shadow-[0_2px_0_#111111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className="fa-solid fa-pen-nib text-[13px]" />
            {startWritingLoading
              ? 'Opening...'
              : 'Start Writing'}
          </button>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

function getCambodiaNow() {
  const now = new Date()
  const localTime =
    now.getTime() +
    now.getTimezoneOffset() * 60000

  return new Date(
    localTime +
      7 * 60 * 60 * 1000
  )
}

function getWriterWednesdayState() {
  const now = getCambodiaNow()
  const weekday = now.getDay()
  const localSeconds =
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    now.getSeconds()

  const active = weekday === 3
  const daysUntilWednesday =
    (3 - weekday + 7) % 7

  const startsInSeconds = active
    ? 0
    : daysUntilWednesday * 86400 -
      localSeconds

  const endsInSeconds = active
    ? 86400 - localSeconds
    : 0

  const nextStartSeconds = active
    ? 7 * 86400 - localSeconds
    : startsInSeconds

  return {
    active,
    countdownSeconds: active
      ? endsInSeconds
      : startsInSeconds,
    nextStart: new Date(
      Date.now() +
        Math.max(
          0,
          nextStartSeconds
        ) *
          1000
    ),
  }
}

function getCountdownParts(totalSeconds) {
  const seconds = Math.max(
    0,
    Number(totalSeconds || 0)
  )

  return {
    days: Math.floor(
      seconds / 86400
    ),
    hours: Math.floor(
      (seconds % 86400) / 3600
    ),
    minutes: Math.floor(
      (seconds % 3600) / 60
    ),
    seconds: Math.floor(
      seconds % 60
    ),
  }
}

function normalizeEvent(event) {
  const fallback =
    getWriterWednesdayState()

  if (!event) {
    return fallback
  }

  return {
    active: Boolean(event.active),
    countdownSeconds: Number(
      event.active
        ? event.ends_in_seconds
        : event.starts_in_seconds
    ),
    nextStart: new Date(
      event.next_starts_at ||
        event.starts_at ||
        fallback.nextStart
    ),
  }
}

function formatNextWednesdayLabel(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    {
      timeZone: 'Asia/Phnom_Penh',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(date)
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function InfoCard({
  icon,
  value,
  label,
}) {
  return (
    <div className="rounded-[18px] border border-[#EDE9FE] bg-white px-3 py-4 text-center shadow-[0_8px_22px_rgba(124,58,237,0.05)]">
      <i
        className={`fa-solid ${icon} text-[16px] text-[#7C3AED]`}
      />
      <div className="mt-2 text-[15px] font-black text-[#17182A]">
        {value}
      </div>
      <div className="mt-1 text-[9px] font-semibold text-[#8B909B]">
        {label}
      </div>
    </div>
  )
}

export default function WriterWednesdayEventPage() {
  const navigate = useNavigate()
  const [eventState, setEventState] =
    useState(
      getWriterWednesdayState
    )

  useEffect(() => {
    let ignore = false

    async function syncEvent() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/unlocks/events/writer-wednesday`
        )

        const data =
          await response.json()

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error('Failed')
        }

        if (!ignore) {
          setEventState(
            normalizeEvent(data.event)
          )
        }
      } catch {
        if (!ignore) {
          setEventState(
            getWriterWednesdayState()
          )
        }
      }
    }

    syncEvent()

    const syncTimer =
      window.setInterval(
        syncEvent,
        60000
      )

    const countdownTimer =
      window.setInterval(() => {
        setEventState(
          (current) => ({
            ...current,
            countdownSeconds:
              Math.max(
                0,
                Number(
                  current.countdownSeconds ||
                    0
                ) - 1
              ),
          })
        )
      }, 1000)

    return () => {
      ignore = true
      window.clearInterval(syncTimer)
      window.clearInterval(
        countdownTimer
      )
    }
  }, [])

  const countdown =
    getCountdownParts(
      eventState.countdownSeconds
    )

  const nextWednesdayLabel =
    useMemo(
      () =>
        formatNextWednesdayLabel(
          eventState.nextStart
        ),
      [eventState.nextStart]
    )

  const displayHours =
    countdown.days * 24 +
    countdown.hours

  return (
    <div className="min-h-screen bg-[#F8F7FB] pb-10">
      <header className="sticky top-0 z-30 border-b border-[#ECEAF2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[560px] items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#17182A] transition active:bg-[#F3F4F6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="flex-1 text-center text-[16px] font-black text-[#17182A]">
            Writer Wednesday
          </div>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-4 pt-4">
        <div className="mb-4 flex border-b border-[#ECEAF2]">
          <button
            type="button"
            onClick={() =>
              navigate('/event')
            }
            className="px-3 pb-3 text-[12px] font-bold text-[#9CA3AF]"
          >
            Author
          </button>

          <button
            type="button"
            className="border-b-2 border-[#7C3AED] px-3 pb-3 text-[12px] font-black text-[#17182A]"
          >
            Event
          </button>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-[#E9E2F5] bg-white shadow-[0_14px_36px_rgba(124,58,237,0.08)]">
          <img
            src="/assets/Icons/Event/Event 3.webp"
            alt="Writer Wednesday 70% Event"
            className="block h-auto w-full"
          />

          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EAFE] px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#7C3AED]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    eventState.active
                      ? 'bg-[#22C55E]'
                      : 'bg-[#A78BFA]'
                  }`}
                />
                {eventState.active
                  ? 'Happening Now'
                  : 'Weekly Event'}
              </div>

              <div className="text-[10px] font-bold text-[#8B909B]">
                Cambodia Time
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-[20px] border border-[#E9E2F5] bg-[#FAF7FF] px-3 py-4">
              <span className="min-w-[58px] text-center text-[36px] font-black tabular-nums tracking-[-0.05em] text-[#17182A]">
                {pad(displayHours)}
              </span>

              <span className="pb-1 text-[27px] font-black text-[#A78BFA]">
                :
              </span>

              <span className="min-w-[58px] text-center text-[36px] font-black tabular-nums tracking-[-0.05em] text-[#17182A]">
                {pad(
                  countdown.minutes
                )}
              </span>

              <span className="pb-1 text-[27px] font-black text-[#A78BFA]">
                :
              </span>

              <span className="min-w-[58px] text-center text-[36px] font-black tabular-nums tracking-[-0.05em] text-[#17182A]">
                {pad(
                  countdown.seconds
                )}
              </span>
            </div>

            {!eventState.active ? (
              <div className="mt-3 text-center text-[11px] font-semibold leading-5 text-[#7D8290]">
                {nextWednesdayLabel}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[#ECE8F3] bg-white p-4 shadow-[0_10px_28px_rgba(31,24,55,0.06)]">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8B5CF6]">
            Writer Wednesday
          </div>

          <h1 className="mt-2 text-[24px] font-black leading-[1.15] tracking-[-0.03em] text-[#17182A]">
            Create more. Earn more.
          </h1>

          <p className="mt-3 text-[13px] font-medium leading-6 text-[#6B7280]">
            Every Wednesday, authors earn 70% from eligible Diamond episode unlocks automatically.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <InfoCard
              icon="fa-percent"
              value="70%"
              label="Author share"
            />
            <InfoCard
              icon="fa-calendar-days"
              value="Wednesday"
              label="Every week"
            />
            <InfoCard
              icon="fa-gem"
              value="Diamond"
              label="Unlock only"
            />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[#ECE8F3] bg-white p-4 shadow-[0_10px_28px_rgba(31,24,55,0.06)]">
          <h2 className="text-[17px] font-black text-[#17182A]">
            How it works
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[12px] font-black text-[#7C3AED]">
                1
              </div>
              <div>
                <div className="text-[13px] font-black text-[#17182A]">
                  Publish and keep writing
                </div>
                <div className="mt-1 text-[11px] font-medium leading-5 text-[#7D8290]">
                  The event runs every Wednesday in Cambodia time.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[12px] font-black text-[#7C3AED]">
                2
              </div>
              <div>
                <div className="text-[13px] font-black text-[#17182A]">
                  Readers unlock with Diamonds
                </div>
                <div className="mt-1 text-[11px] font-medium leading-5 text-[#7D8290]">
                  Eligible Diamond episode unlocks are included automatically.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[12px] font-black text-[#7C3AED]">
                3
              </div>
              <div>
                <div className="text-[13px] font-black text-[#17182A]">
                  Authors receive 70%
                </div>
                <div className="mt-1 text-[11px] font-medium leading-5 text-[#7D8290]">
                  No event code or manual activation is required.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 rounded-[18px] bg-[#F3EDFF] px-4 py-3 text-center text-[11px] font-bold leading-5 text-[#6D28D9]">
          Automatically applied to eligible Diamond episode unlocks.
        </div>
      </main>
    </div>
  )
}

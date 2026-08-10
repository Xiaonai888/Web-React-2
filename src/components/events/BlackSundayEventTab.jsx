import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CAMBODIA_TIME_ZONE = 'Asia/Phnom_Penh'
const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000

function getCambodiaDate(value = new Date()) {
  return new Date(
    new Date(value).getTime() +
      CAMBODIA_OFFSET_MS
  )
}

const BENEFITS = [
  { icon: 'fa-gem', label: 'Diamonds', color: 'text-[#7C3AED]', bg: 'bg-[#F1EAFE]' },
  { icon: 'fa-coins', label: 'Coins', color: 'text-[#E9A400]', bg: 'bg-[#FFF6D8]' },
  { icon: 'fa-tag', label: '10% Off', color: 'text-[#F05275]', bg: 'bg-[#FFE8EF]' },
  { icon: 'fa-calendar-days', label: 'Every Sunday', color: 'text-[#4F86F7]', bg: 'bg-[#EAF1FF]' },
]

const RULES = [
  'Discount applies to episode unlocks',
  'Available every Sunday',
  'Limited to the event time',
]

function getNextSunday(
  now,
  skipToday = false
) {
  const cambodiaDate =
    getCambodiaDate(now)

  let daysUntilSunday =
    (7 - cambodiaDate.getUTCDay()) % 7

  if (
    daysUntilSunday === 0 &&
    skipToday
  ) {
    daysUntilSunday = 7
  }

  const sundayMidnightUtc = Date.UTC(
    cambodiaDate.getUTCFullYear(),
    cambodiaDate.getUTCMonth(),
    cambodiaDate.getUTCDate() +
      daysUntilSunday
  )

  return new Date(
    sundayMidnightUtc -
      CAMBODIA_OFFSET_MS
  )
}

function getEndOfToday(now) {
  const cambodiaDate =
    getCambodiaDate(now)

  const nextMidnightUtc = Date.UTC(
    cambodiaDate.getUTCFullYear(),
    cambodiaDate.getUTCMonth(),
    cambodiaDate.getUTCDate() + 1
  )

  return new Date(
    nextMidnightUtc -
      CAMBODIA_OFFSET_MS -
      1
  )
}

function getTimeParts(target, now) {
  const difference = Math.max(0, target.getTime() - now.getTime())
  const totalSeconds = Math.floor(difference / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatEventDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: CAMBODIA_TIME_ZONE,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function CountdownBox({ value, label }) {
  return (
    <div className="text-center">
      <div className="flex h-12 min-w-[54px] items-center justify-center rounded-[10px] bg-white/10 px-3 text-[22px] font-black text-white ring-1 ring-white/10 backdrop-blur-sm">
        {pad(value)}
      </div>
      <div className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
        {label}
      </div>
    </div>
  )
}

function BenefitItem({ item }) {
  return (
    <div className="min-w-0 text-center">
      <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] ${item.bg} ${item.color}`}>
        <i className={`fa-solid ${item.icon} text-[18px]`} />
      </span>
      <div className="mt-2 truncate text-[11px] font-semibold text-[#222536]">
        {item.label}
      </div>
    </div>
  )
}

function LiveEventCard({ now, onExplore }) {
  const countdown = getTimeParts(getEndOfToday(now), now)

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#DAD6E7] bg-white shadow-[0_18px_45px_rgba(41,29,76,0.12)]">
      <div className="relative min-h-[350px] overflow-hidden bg-[linear-gradient(135deg,#19172E_0%,#22163E_58%,#060608_100%)] px-5 pb-6 pt-5 text-white">
        <div
          className="absolute right-0 top-0 h-full w-[45%] bg-black"
          aria-label="Coin artwork placeholder"
        />
        <div className="absolute -right-12 top-16 h-48 w-48 rounded-full bg-[#7C3AED]/35 blur-3xl" />
        <div className="absolute right-[8%] top-[43%] h-28 w-28 rounded-full border border-white/10 bg-white/[0.03]" />
        <div className="absolute right-[14%] top-[49%] h-16 w-16 rounded-full border border-[#A855F7]/30 bg-black" />

        <div className="absolute right-4 top-5 z-20 flex h-[76px] w-[76px] rotate-6 items-center justify-center rounded-full bg-[linear-gradient(145deg,#A855F7,#6D28D9)] text-center shadow-[0_12px_30px_rgba(124,58,237,0.42)] ring-2 ring-white/55">
          <span className="text-[20px] font-black leading-[20px]">
            10%
            <span className="block text-[13px]">OFF</span>
          </span>
        </div>

        <div className="relative z-10 max-w-[68%]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E7FF] px-3 py-2 text-[11px] font-black text-[#7C3AED]">
            <i className="fa-solid fa-bolt text-[10px]" />
            Happening Now
          </div>

          <h2 className="mt-6 text-[34px] font-black leading-[1.04] tracking-[-0.04em]">
            Black Sunday
          </h2>

          <p className="mt-5 text-[18px] font-bold leading-7 text-white">
            <span className="text-[#B56CFF]">10%</span> discount on
            <span className="block">Diamond &amp; Coin unlocks</span>
          </p>

          <div className="mt-7">
            <div className="mb-3 text-[13px] font-semibold text-white/65">Ends in</div>

            <div className="flex items-start gap-2">
              <CountdownBox value={countdown.hours} label="Hrs" />
              <span className="pt-3 text-[20px] font-black text-white/45">:</span>
              <CountdownBox value={countdown.minutes} label="Min" />
              <span className="pt-3 text-[20px] font-black text-white/45">:</span>
              <CountdownBox value={countdown.seconds} label="Sec" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 pb-4 pt-4">
        <div className="grid grid-cols-4 gap-2">
          {BENEFITS.map((item) => (
            <BenefitItem key={item.label} item={item} />
          ))}
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#6D3DF1_0%,#D865DD_100%)] px-5 text-[15px] font-black text-white shadow-[0_12px_26px_rgba(124,58,237,0.24)] active:scale-[0.99]"
        >
          See Eligible Stories
          <i className="fa-solid fa-chevron-right text-[12px]" />
        </button>
      </div>
    </section>
  )
}

function NoEventTodayCard({ nextEvent, countdown }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E5E1EF] bg-[linear-gradient(135deg,#1A1730,#09090B)] px-5 py-6 text-white shadow-[0_18px_45px_rgba(41,29,76,0.12)]">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-black text-[#C89BFF] ring-1 ring-white/10">
        <i className="fa-regular fa-calendar" />
        Weekly Event
      </div>

      <h2 className="mt-5 text-[27px] font-black tracking-[-0.03em]">
        No Event Today
      </h2>

      <p className="mt-2 max-w-[410px] text-[13px] font-medium leading-6 text-white/65">
        Black Sunday returns with 10% off Diamond and Coin episode unlocks.
      </p>

      <div className="mt-5 rounded-[18px] bg-black/45 px-4 py-4 ring-1 ring-white/10">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
          Next Black Sunday
        </div>
        <div className="mt-1 text-[16px] font-black">{formatEventDate(nextEvent)}</div>
        <div className="mt-3 flex items-center gap-2 text-[13px] font-bold text-[#B56CFF]">
          <i className="fa-regular fa-clock" />
          Starts in {countdown.days}d {countdown.hours}h {countdown.minutes}m
        </div>
      </div>
    </section>
  )
}

function UpcomingEventCard({ eventDate, countdown }) {
  return (
    <section className="rounded-[22px] border border-[#ECE8F3] bg-white p-4 shadow-[0_10px_26px_rgba(31,24,55,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#F5EFFF,#FFF8F0)]">
          <div className="relative flex h-[78px] w-[70px] flex-col items-center rounded-[17px] bg-white pt-5 shadow-[0_10px_22px_rgba(124,58,237,0.16)] ring-1 ring-[#E7D9FF]">
            <span className="absolute -top-2 left-3 h-4 w-2 rounded-full bg-[#7C3AED]" />
            <span className="absolute -top-2 right-3 h-4 w-2 rounded-full bg-[#7C3AED]" />
            <i className="fa-solid fa-star text-[27px] text-[#8B5CF6]" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex rounded-full bg-[#F1EAFE] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#7C3AED]">
            Next Event
          </div>

          <h3 className="mt-3 text-[18px] font-black text-[#17182A]">
            Next Black Sunday
          </h3>

          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#7D8290]">
            <i className="fa-regular fa-calendar text-[#8B5CF6]" />
            <span>{formatEventDate(eventDate)}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12px] font-black text-[#7C3AED]">
            <i className="fa-regular fa-clock" />
            Starts in {countdown.days}d {countdown.hours}h {countdown.minutes}m
          </div>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[#7C3AED]">
          <i className="fa-solid fa-chevron-right text-[12px]" />
        </span>
      </div>
    </section>
  )
}

function HowItWorksCard() {
  return (
    <section className="mt-4 rounded-[22px] border border-[#ECE8F3] bg-white p-4 shadow-[0_10px_26px_rgba(31,24,55,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#FFF4EC,#F5EFFF)]">
          <span className="flex h-[70px] w-[70px] items-center justify-center rounded-[20px] bg-[#7C3AED] text-[30px] text-[#FFD85C] shadow-[0_12px_26px_rgba(124,58,237,0.22)]">
            <i className="fa-solid fa-gift" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-black text-[#17182A]">How it works</h3>

          <div className="mt-3 space-y-2">
            {RULES.map((rule) => (
              <div key={rule} className="flex items-start gap-2 text-[11px] font-semibold leading-5 text-[#696F7C]">
                <i className="fa-regular fa-circle-check mt-1 text-[12px] text-[#7C3AED]" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[#7C3AED]">
          <i className="fa-solid fa-question text-[14px]" />
        </span>
      </div>
    </section>
  )
}

export default function BlackSundayEventTab({
  mode = 'full',
  showNoEventToday = true,
}) {
  const navigate = useNavigate()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const isLive =
    getCambodiaDate(now).getUTCDay() === 0

  const upcomingEvent = useMemo(
    () => getNextSunday(now, isLive),
    [isLive, now]
  )

  const upcomingCountdown = getTimeParts(
    upcomingEvent,
    now
  )

  if (mode === 'active-only' && !isLive) {
    return null
  }

  const showHero = mode !== 'upcoming-only'
  const showUpcoming = mode !== 'active-only'

  const shouldShowNoEventToday =
    !isLive &&
    (
      mode === 'full' ||
      (
        mode === 'upcoming-only' &&
        showNoEventToday
      )
    )

  const hasTopCard =
    (showHero && isLive) ||
    shouldShowNoEventToday

  return (
    <div
      className={
        mode === 'active-only'
          ? 'pt-4'
          : 'pb-8 pt-6'
      }
    >
      {showHero && isLive ? (
        <LiveEventCard
          now={now}
          onExplore={() => navigate('/discover')}
        />
      ) : null}

      {shouldShowNoEventToday ? (
        <NoEventTodayCard
          nextEvent={upcomingEvent}
          countdown={upcomingCountdown}
        />
      ) : null}

      {showUpcoming ? (
        <>
          <div
            className={`flex items-center gap-2 ${
              hasTopCard ? 'mt-7' : ''
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#F1EAFE] text-[#7C3AED]">
              <i className="fa-regular fa-calendar-days text-[14px]" />
            </span>

            <h2 className="text-[21px] font-black text-[#17182A]">
              Upcoming
            </h2>

            <span className="text-[14px] text-[#F6B800]">
              ✦
            </span>
          </div>

          <div className="mt-4">
            <UpcomingEventCard
              eventDate={upcomingEvent}
              countdown={upcomingCountdown}
            />

            <HowItWorksCard />
          </div>

          <div className="mt-4 flex items-center gap-2 px-2 text-[10px] font-semibold text-[#8B909B]">
            <i className="fa-solid fa-shield-halved text-[#22C55E]" />
            Discount is applied automatically when an eligible episode is unlocked.
          </div>
        </>
      ) : null}
    </div>
  )
}

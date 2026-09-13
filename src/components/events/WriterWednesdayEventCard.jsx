import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestWriterWednesdayEvent } from '../../services/writerWednesdayEventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('writerWednesdayEventCard', {
  en: {
    imageAlt: 'Writer Wednesday 70% Event',
    nextWriterWednesday: 'Next Writer Wednesday',
  },
  km: {
    imageAlt: 'ព្រឹត្តិការណ៍ Writer Wednesday 70%',
    nextWriterWednesday: 'Writer Wednesday បន្ទាប់',
  },
  zh: {
    imageAlt: 'Writer Wednesday 70% 活动',
    nextWriterWednesday: '下一个 Writer Wednesday',
  },
  ja: {
    imageAlt: 'Writer Wednesday 70% イベント',
    nextWriterWednesday: '次の Writer Wednesday',
  },
  ko: {
    imageAlt: 'Writer Wednesday 70% 이벤트',
    nextWriterWednesday: '다음 Writer Wednesday',
  },
})

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
}

function formatEventDate(date) {
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function WriterWednesdayEventCard() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [now, setNow] = useState(
    () => new Date()
  )
  const [serverEvent, setServerEvent] =
    useState(null)

  useEffect(() => {
    let ignore = false
    let releaseRequest = () => {}
    let requestInFlight = false

    async function syncEvent() {
      if (requestInFlight) return

      requestInFlight = true
      releaseRequest()

      const request =
        requestWriterWednesdayEvent()

      releaseRequest = request.release

      try {
        const event = await request.promise

        if (!ignore) {
          setServerEvent(event)
        }
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          !ignore
        ) {
          setServerEvent(null)
        }
      } finally {
        releaseRequest()
        releaseRequest = () => {}
        requestInFlight = false
      }
    }

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        syncEvent()
      }
    }

    syncEvent()
    window.addEventListener('focus', handleFocus)

    return () => {
      ignore = true
      releaseRequest()
      window.removeEventListener(
        'focus',
        handleFocus
      )
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
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
          Math.max(
            0,
            86400 - localSeconds
          ) *
            1000
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
      className="mt-4 block w-full overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-left shadow-[0_14px_36px_rgba(124,58,237,0.10)] transition active:scale-[0.99]"
    >
      <img
        src="/assets/Icons/Event/Event 3.webp"
        alt={t('writerWednesdayEventCard.imageAlt')}
        className="block h-auto w-full"
      />

      {isLive ? (
        <div className="px-4 pb-5 pt-4">
          <div className="flex items-center justify-center gap-2 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-4">
            <span className="min-w-[52px] text-center text-[34px] font-black tabular-nums tracking-[-0.04em] text-[var(--shadow-text-primary)]">
              {String(countdown.hours).padStart(2, '0')}
            </span>

            <span className="pb-1 text-[26px] font-black text-[#A78BFA]">
              :
            </span>

            <span className="min-w-[52px] text-center text-[34px] font-black tabular-nums tracking-[-0.04em] text-[var(--shadow-text-primary)]">
              {String(countdown.minutes).padStart(2, '0')}
            </span>

            <span className="pb-1 text-[26px] font-black text-[#A78BFA]">
              :
            </span>

            <span className="min-w-[52px] text-center text-[34px] font-black tabular-nums tracking-[-0.04em] text-[var(--shadow-text-primary)]">
              {String(countdown.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-5 pt-4">
          <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-4 py-3 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8B5CF6]">
              {t('writerWednesdayEventCard.nextWriterWednesday')}
            </div>
            <div className="mt-1 text-[13px] font-bold text-[var(--shadow-text-primary)]">
              {formatEventDate(eventDate)}
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

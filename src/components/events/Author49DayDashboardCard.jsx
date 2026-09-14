import { useEffect, useMemo, useState } from 'react'
import { requestAuthor49DayEvent } from '../../services/author49DayEventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('author49DayDashboardCard', {
  en: { eventAlt: '80% for 49 Days Event', startWriting: 'Start Writing', dayShort: 'D' },
  km: { eventAlt: 'ព្រឹត្តិការណ៍ 80% រយៈពេល 49 ថ្ងៃ', startWriting: 'ចាប់ផ្តើមសរសេរ', dayShort: 'ថ្ងៃ' },
  zh: { eventAlt: '49天 80% 活动', startWriting: '开始写作', dayShort: '天' },
  ja: { eventAlt: '49日間 80% イベント', startWriting: '執筆を開始', dayShort: '日' },
  ko: { eventAlt: '49일간 80% 이벤트', startWriting: '글쓰기 시작', dayShort: '일' },
})

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

function formatCountdownNumber(value) {
  return new Intl.NumberFormat(getDisplayLanguageId(), {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(Number(value || 0))
}

export default function Author49DayDashboardCard({ onStartWriting }) {
  const { t } = useDisplayTranslation()
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
          alt={t('author49DayDashboardCard.eventAlt')}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-4 pb-4 pt-14">
          {isActive ? (
            <div className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-black bg-[#FFC400] px-3 text-black shadow-[0_4px_0_#111111]">
              <i className="fa-regular fa-clock text-[11px]" />
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {formatCountdownNumber(countdown.days)}{t('author49DayDashboardCard.dayShort')}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {formatCountdownNumber(countdown.hours)}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {formatCountdownNumber(countdown.minutes)}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.03em]">
                {formatCountdownNumber(countdown.seconds)}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartWriting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-black bg-[#FFC400] text-[12px] font-black text-black shadow-[0_4px_0_#111111] transition active:translate-y-[2px] active:shadow-[0_2px_0_#111111]"
            >
              <i className="fa-solid fa-pen-nib text-[10px]" />
              {t('author49DayDashboardCard.startWriting')}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

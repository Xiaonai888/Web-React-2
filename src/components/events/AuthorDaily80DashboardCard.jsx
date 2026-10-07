import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestAuthorDaily80Event } from '../../services/authorDaily80EventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily80DashboardCard', {
  en: {
    available: 'Publish 1 new EP to activate +24h at 80%',
    newOnly: 'New EP only • Maximum 180 days',
  },
  km: {
    available: 'បង្ហោះភាគថ្មី 1 ភាគ ដើម្បីបើក +24h នៅ 80%',
    newOnly: 'រាប់តែភាគថ្មី • អតិបរមា 180 ថ្ងៃ',
  },
  zh: {
    available: '发布 1 个新章节以激活 80% 的 +24h',
    newOnly: '仅限新章节 • 最多 180 天',
  },
  ja: {
    available: '新しい話を1話公開して 80% の +24h を有効化',
    newOnly: '新規エピソードのみ • 最大180日',
  },
  ko: {
    available: '새 에피소드 1개를 게시해 80% +24h 활성화',
    newOnly: '새 에피소드만 적용 • 최대 180일',
  },
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
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat(getDisplayLanguageId(), {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(Number(value || 0))
}

export default function AuthorDaily80DashboardCard() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [event, setEvent] = useState(null)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let ignore = false
    let releaseRequest = () => {}
    let lastRefreshAt = 0

    async function loadEvent(force = false) {
      const token = getAuthToken()
      if (!token) return

      lastRefreshAt = Date.now()
      releaseRequest()

      const request = requestAuthorDaily80Event(
        token,
        { force }
      )

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
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastRefreshAt >= 5 * 60 * 1000
      ) {
        void loadEvent(true)
      }
    }

    loadEvent()
    window.addEventListener('focus', refreshOnFocus)
    document.addEventListener('visibilitychange', refreshOnFocus)

    const refreshId = window.setInterval(
      refreshOnFocus,
      5 * 60 * 1000
    )

    return () => {
      ignore = true
      releaseRequest()
      window.removeEventListener('focus', refreshOnFocus)
      document.removeEventListener('visibilitychange', refreshOnFocus)
      window.clearInterval(refreshId)
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
    event.status === 'finished'
  ) {
    return null
  }

  const isActive =
    event.status === 'active' && remainingMs > 0

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={() => navigate('/event/daily-author-80-boost')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate('/event/daily-author-80-boost')
        }
      }}
      className="mt-5 cursor-pointer overflow-hidden rounded-[16px] border border-violet-300 bg-white shadow-[0_10px_26px_rgba(139,92,246,0.14)] transition active:scale-[0.99] dark:border-violet-700 dark:bg-[#15101B]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-violet-50 dark:bg-[#120A1D]">
        <img
          src="/assets/Icons/Event/Event80%_One_Year.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />

        <div className="absolute bottom-3 right-3 z-10 w-[48%] max-w-[250px] sm:bottom-4 sm:right-4">
          {isActive ? (
            <div className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[12px] border-2 border-black bg-white/95 px-2 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm dark:bg-violet-100/95">
              <i className="fa-regular fa-clock text-[10px]" />
              <span className="text-[12px] font-black tabular-nums">
                {formatNumber(countdown.hours)}
              </span>
              <span className="text-[11px] font-black">:</span>
              <span className="text-[12px] font-black tabular-nums">
                {formatNumber(countdown.minutes)}
              </span>
              <span className="text-[11px] font-black">:</span>
              <span className="text-[12px] font-black tabular-nums">
                {formatNumber(countdown.seconds)}
              </span>
            </div>
          ) : (
            <div className="rounded-[12px] border-2 border-black bg-white/95 px-3 py-2 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm dark:bg-violet-100/95">
              <div className="text-[10px] font-black leading-4 sm:text-[11px]">
                {t('authorDaily80DashboardCard.available')}
              </div>
              <div className="mt-0.5 text-[8px] font-bold leading-3 text-black/65 sm:text-[9px]">
                {t('authorDaily80DashboardCard.newOnly')}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

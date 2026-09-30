import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestAuthorDaily50Event } from '../../services/authorDaily50EventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily50DashboardCard', {
  en: {
    available: 'Publish 1 new EP to activate +24h',
    newOnly: 'New EP only • Old EP edits don’t count',
  },
  km: {
    available: 'បង្ហោះភាគថ្មី 1 ភាគ ដើម្បីបើក +24h',
    newOnly: 'រាប់តែភាគថ្មី • កែភាគចាស់មិនរាប់ទេ',
  },
  zh: {
    available: '发布 1 个新章节以激活 +24h',
    newOnly: '仅限新章节 • 编辑旧章节不计入',
  },
  ja: {
    available: '新しい話を1話公開して +24h を有効化',
    newOnly: '新規エピソードのみ • 旧話の編集は対象外',
  },
  ko: {
    available: '새 에피소드 1개를 게시해 +24h 활성화',
    newOnly: '새 에피소드만 적용 • 기존 에피소드 수정은 제외',
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

export default function AuthorDaily50DashboardCard() {
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

      const request = requestAuthorDaily50Event(
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
      onClick={() => navigate('/event/daily-author-boost')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate('/event/daily-author-boost')
        }
      }}
      className="mt-5 cursor-pointer overflow-hidden rounded-[16px] border border-emerald-300 bg-white shadow-[0_10px_26px_rgba(16,185,129,0.12)] transition active:scale-[0.99] dark:border-emerald-700 dark:bg-[#111713]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-emerald-50 dark:bg-[#0B1510]">
        <img
          src="/assets/Icons/Event/Event50%25.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />

        <div className="absolute bottom-3 right-3 z-10 w-[48%] max-w-[250px] sm:bottom-4 sm:right-4">
          {isActive ? (
            <div className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[12px] border-2 border-black bg-white/95 px-2 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm dark:bg-emerald-100/95">
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
            <div className="rounded-[12px] border-2 border-black bg-white/95 px-3 py-2 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm dark:bg-emerald-100/95">
              <div className="text-[10px] font-black leading-4 sm:text-[11px]">
                {t('authorDaily50DashboardCard.available')}
              </div>
              <div className="mt-0.5 text-[8px] font-bold leading-3 text-black/65 sm:text-[9px]">
                {t('authorDaily50DashboardCard.newOnly')}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

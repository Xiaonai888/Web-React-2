import { useEffect, useMemo, useState } from 'react'
import { requestAuthorDaily50Event } from '../../services/authorDaily50EventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily50DashboardCard', {
  en: {
    title: 'Daily Author Boost',
    subtitle: '50% earning',
    active: 'Active now',
    available: 'Publish 1 new episode today',
    addToday: 'Publish today to add +24h',
    claimedToday: 'Today’s +24h claimed',
    startWriting: 'Start Writing',
    used: 'Boost days used',
  },
  km: {
    title: 'Daily Author Boost',
    subtitle: 'ចំណូល 50%',
    active: 'កំពុងដំណើរការ',
    available: 'បង្ហោះភាគថ្មី 1 ភាគថ្ងៃនេះ',
    addToday: 'បង្ហោះថ្ងៃនេះដើម្បីបូក +24h',
    claimedToday: 'ថ្ងៃនេះបាន +24h រួចហើយ',
    startWriting: 'ចាប់ផ្តើមសរសេរ',
    used: 'ថ្ងៃ Boost ដែលបានប្រើ',
  },
  zh: {
    title: '每日作者加成',
    subtitle: '50% 收益',
    active: '正在生效',
    available: '今天发布 1 个新章节',
    addToday: '今天发布可增加 +24 小时',
    claimedToday: '今天的 +24 小时已领取',
    startWriting: '开始写作',
    used: '已使用加成天数',
  },
  ja: {
    title: 'デイリー作者ブースト',
    subtitle: '収益 50%',
    active: '有効中',
    available: '今日、新しい話を1話公開',
    addToday: '今日公開すると +24時間',
    claimedToday: '本日の +24時間は獲得済み',
    startWriting: '執筆を開始',
    used: '使用済みブースト日数',
  },
  ko: {
    title: '데일리 작가 부스트',
    subtitle: '수익 50%',
    active: '활성 중',
    available: '오늘 새 에피소드 1개 게시',
    addToday: '오늘 게시하면 +24시간',
    claimedToday: '오늘의 +24시간 획득 완료',
    startWriting: '글쓰기 시작',
    used: '사용한 부스트 일수',
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

export default function AuthorDaily50DashboardCard({
  onStartWriting,
}) {
  const { t } = useDisplayTranslation()
  const [event, setEvent] = useState(null)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let ignore = false
    let releaseRequest = () => {}

    async function loadEvent(force = false) {
      const token = getAuthToken()
      if (!token) return

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
      if (document.visibilityState === 'visible') {
        loadEvent(true)
      }
    }

    loadEvent()
    window.addEventListener('focus', refreshOnFocus)

    const refreshId = window.setInterval(
      () => loadEvent(true),
      30000
    )

    return () => {
      ignore = true
      releaseRequest()
      window.removeEventListener(
        'focus',
        refreshOnFocus
      )
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

  const used = Number(event.activation_count || 0)
  const max = Number(event.max_activations || 365)

  return (
    <section className="mt-5 overflow-hidden rounded-[16px] border border-emerald-300 bg-white shadow-[0_10px_26px_rgba(16,185,129,0.12)] dark:border-emerald-700 dark:bg-[#111713]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[linear-gradient(135deg,#ECFDF5_0%,#D1FAE5_45%,#A7F3D0_100%)] dark:bg-[linear-gradient(135deg,#0B1510_0%,#10251A_45%,#153824_100%)]">
        <div className="absolute -left-10 -top-12 h-36 w-36 rounded-full border-[18px] border-emerald-400/35" />
        <div className="absolute right-6 top-5 h-16 w-16 rotate-12 rounded-[22px] bg-white/45 shadow-sm dark:bg-white/10" />
        <div className="absolute right-16 top-16 h-5 w-5 rounded-full bg-emerald-500/45" />
        <div className="absolute left-[43%] top-8 h-8 w-8 rotate-45 rounded-[8px] border-4 border-white/65 dark:border-white/15" />

        <div className="absolute inset-x-0 top-0 z-10 px-4 pt-4">
          <div className="inline-flex rounded-full bg-black px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white dark:bg-white dark:text-black">
            {t('authorDaily50DashboardCard.title')}
          </div>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-[42px] font-black leading-none tracking-[-0.07em] text-emerald-950 dark:text-emerald-100">
              50%
            </span>
            <span className="pb-1 text-[13px] font-black text-emerald-700 dark:text-emerald-300">
              {t('authorDaily50DashboardCard.subtitle')}
            </span>
          </div>

          <div className="mt-2 text-[10px] font-extrabold text-emerald-900/75 dark:text-emerald-100/75">
            {isActive
              ? event.can_activate_today
                ? t('authorDaily50DashboardCard.addToday')
                : t('authorDaily50DashboardCard.claimedToday')
              : t('authorDaily50DashboardCard.available')}
          </div>

          <div className="mt-2 text-[9px] font-bold text-emerald-900/60 dark:text-emerald-100/60">
            {t('authorDaily50DashboardCard.used')}: {used}/{max}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-emerald-950/35 via-emerald-900/5 to-transparent px-4 pb-4 pt-12">
          {isActive ? (
            <button
              type="button"
              onClick={
                event.can_activate_today
                  ? onStartWriting
                  : undefined
              }
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-black bg-white px-3 text-black shadow-[0_4px_0_#111111] dark:bg-emerald-100"
            >
              <i className="fa-regular fa-clock text-[11px]" />
              <span className="text-[13px] font-black tabular-nums tracking-[0.04em]">
                {formatNumber(countdown.hours)}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.04em]">
                {formatNumber(countdown.minutes)}
              </span>
              <span className="text-[12px] font-black">:</span>
              <span className="text-[13px] font-black tabular-nums tracking-[0.04em]">
                {formatNumber(countdown.seconds)}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartWriting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] border-2 border-black bg-emerald-400 text-[12px] font-black text-black shadow-[0_4px_0_#111111] transition active:translate-y-[2px] active:shadow-[0_2px_0_#111111]"
            >
              <i className="fa-solid fa-pen-nib text-[10px]" />
              {t('authorDaily50DashboardCard.startWriting')}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

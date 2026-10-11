import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily80CoverCard', {
  en: {
    title: 'Author Boost',
    duration: '180 Qualifying Days',
    subtitle: 'Earn 80% from eligible Diamond unlocks',
    details: 'View Event Details',
    dayShort: 'D',
    hourShort: 'H',
    minuteShort: 'M',
    secondShort: 'S',
  },
  km: {
    title: 'Boost សម្រាប់អ្នកនិពន្ធ',
    duration: '180 ថ្ងៃដែលមានសិទ្ធិ',
    subtitle: 'ទទួល 80% ពី Diamond Unlock ដែលមានសិទ្ធិ',
    details: 'មើលព័ត៌មាន Event',
    dayShort: 'ថ្ងៃ',
    hourShort: 'ម៉',
    minuteShort: 'ន',
    secondShort: 'វិ',
  },
  zh: {
    title: '作者加成',
    duration: '180 个有效天数',
    subtitle: '符合条件的钻石解锁收入分成 80%',
    details: '查看活动详情',
    dayShort: '天',
    hourShort: '时',
    minuteShort: '分',
    secondShort: '秒',
  },
  ja: {
    title: '作者ブースト',
    duration: '最大180対象日',
    subtitle: '対象のダイヤ解放収益の80%',
    details: 'イベント詳細を見る',
    dayShort: '日',
    hourShort: '時',
    minuteShort: '分',
    secondShort: '秒',
  },
  ko: {
    title: '작가 부스트',
    duration: '최대 180일 인정',
    subtitle: '대상 다이아 해제 수익의 80%',
    details: '이벤트 자세히 보기',
    dayShort: '일',
    hourShort: '시',
    minuteShort: '분',
    secondShort: '초',
  },
})

function getCountdown(endsAt, now) {
  const end = new Date(endsAt || '').getTime()
  const seconds = Number.isFinite(end)
    ? Math.max(0, Math.floor((end - now) / 1000))
    : 0

  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    remaining: seconds,
  }
}

export default function AuthorDaily80CoverCard({ event }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (event?.status !== 'active' || !event?.ends_at) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [event?.status, event?.ends_at])

  const countdown = useMemo(
    () => getCountdown(event?.ends_at, now),
    [event?.ends_at, now]
  )
  const isActive = event?.status === 'active' && countdown.remaining > 0
  const number = (value) => String(value).padStart(2, '0')

  return (
    <section className="mt-4 overflow-hidden rounded-[24px] border border-violet-400 bg-[#180C32] shadow-[0_16px_38px_rgba(124,58,237,0.17)] dark:border-violet-600">
      <div className="relative aspect-square w-full overflow-hidden text-white">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#30145C_0%,#16112D_52%,#070710_100%)]" />
        <div className="absolute -right-14 -top-10 h-[65%] w-[65%] rounded-full bg-violet-500/25 blur-[45px]" />
        <div className="absolute right-[8%] top-[17%] h-[45%] w-[45%] rounded-full border-[13px] border-violet-400/20" />
        <div className="absolute -left-[20%] bottom-[3%] h-[56%] w-[56%] rounded-full border-[30px] border-white/[0.035]" />

        <div className="absolute inset-x-0 top-0 p-5 sm:p-7">
          <div className="inline-flex rounded-full border border-violet-300/40 bg-violet-500/25 px-3 py-1.5 text-[10px] font-black tracking-wide text-violet-100">
            {t('authorDaily80CoverCard.title')}
          </div>
          <div className="mt-6 text-[clamp(76px,18vw,126px)] font-black leading-none tracking-[-0.08em] text-white">
            80%
          </div>
          <div className="mt-2 text-[clamp(18px,5vw,27px)] font-black leading-tight text-violet-200">
            {t('authorDaily80CoverCard.duration')}
          </div>
          <p className="mt-3 max-w-[78%] text-[11px] font-semibold leading-5 text-violet-100/80 sm:text-[13px]">
            {t('authorDaily80CoverCard.subtitle')}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent px-4 pb-4 pt-20">
          <button
            type="button"
            onClick={() => navigate('/event/daily-author-80-boost')}
            className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-[16px] border-2 border-black bg-[#C4A3FF] px-2 text-[12px] font-black text-[#180C32] shadow-[0_5px_0_#111111] transition active:translate-y-[3px] active:shadow-[0_2px_0_#111111] sm:gap-2 sm:text-[14px]"
          >
            <i className={`fa-solid ${isActive ? 'fa-clock' : 'fa-circle-info'} text-[12px]`} />
            {isActive ? (
              <span className="flex items-center gap-1.5 tabular-nums sm:gap-2">
                <span>{number(countdown.days)}{t('authorDaily80CoverCard.dayShort')}</span>
                <span>:</span>
                <span>{number(countdown.hours)}{t('authorDaily80CoverCard.hourShort')}</span>
                <span>:</span>
                <span>{number(countdown.minutes)}{t('authorDaily80CoverCard.minuteShort')}</span>
                <span>:</span>
                <span>{number(countdown.seconds)}{t('authorDaily80CoverCard.secondShort')}</span>
              </span>
            ) : (
              t('authorDaily80CoverCard.details')
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

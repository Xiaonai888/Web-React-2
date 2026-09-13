import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('blackSundayEventTab', {
  en: {
    diamonds: 'Diamonds',
    coins: 'Coins',
    tenPercentOff: '10% Off',
    everySunday: 'Every Sunday',
    ruleDiscount: 'Discount applies to episode unlocks',
    ruleSunday: 'Available every Sunday',
    ruleLimited: 'Limited to the event time',
    coinArtworkPlaceholder: 'Coin artwork placeholder',
    off: 'OFF',
    happeningNow: 'Happening Now',
    blackSunday: 'Black Sunday',
    discountOn: 'discount on',
    diamondCoinUnlocks: 'Diamond & Coin unlocks',
    endsIn: 'Ends in',
    hoursShort: 'Hrs',
    minutesShort: 'Min',
    secondsShort: 'Sec',
    seeEligibleStories: 'See Eligible Stories',
    weeklyEvent: 'Weekly Event',
    noEventToday: 'No Event Today',
    returnDescription: 'Black Sunday returns with 10% off Diamond and Coin episode unlocks.',
    nextBlackSunday: 'Next Black Sunday',
    startsIn: 'Starts in {{days}}d {{hours}}h {{minutes}}m',
    nextEvent: 'Next Event',
    howItWorks: 'How it works',
    upcoming: 'Upcoming',
    automaticDiscount: 'Discount is applied automatically when an eligible episode is unlocked.',
  },
  km: {
    diamonds: 'Diamonds',
    coins: 'Coins',
    tenPercentOff: 'បញ្ចុះ 10%',
    everySunday: 'រៀងរាល់ថ្ងៃអាទិត្យ',
    ruleDiscount: 'ការបញ្ចុះតម្លៃអនុវត្តលើការដោះសោ Episode',
    ruleSunday: 'មានរៀងរាល់ថ្ងៃអាទិត្យ',
    ruleLimited: 'មានតែក្នុងពេលព្រឹត្តិការណ៍',
    coinArtworkPlaceholder: 'រូប Coins',
    off: 'OFF',
    happeningNow: 'កំពុងដំណើរការ',
    blackSunday: 'Black Sunday',
    discountOn: 'បញ្ចុះតម្លៃលើ',
    diamondCoinUnlocks: 'ការដោះសោដោយ Diamond និង Coin',
    endsIn: 'បញ្ចប់ក្នុង',
    hoursShort: 'ម៉ោង',
    minutesShort: 'នាទី',
    secondsShort: 'វិនាទី',
    seeEligibleStories: 'មើលរឿងដែលមានសិទ្ធិ',
    weeklyEvent: 'ព្រឹត្តិការណ៍ប្រចាំសប្តាហ៍',
    noEventToday: 'ថ្ងៃនេះមិនមានព្រឹត្តិការណ៍',
    returnDescription: 'Black Sunday នឹងត្រឡប់មកជាមួយការបញ្ចុះ 10% លើការដោះសោ Episode ដោយ Diamond និង Coin។',
    nextBlackSunday: 'Black Sunday បន្ទាប់',
    startsIn: 'ចាប់ផ្តើមក្នុង {{days}}ថ្ងៃ {{hours}}ម៉ោង {{minutes}}នាទី',
    nextEvent: 'ព្រឹត្តិការណ៍បន្ទាប់',
    howItWorks: 'របៀបដំណើរការ',
    upcoming: 'ព្រឹត្តិការណ៍បន្ទាប់',
    automaticDiscount: 'ការបញ្ចុះតម្លៃត្រូវបានអនុវត្តដោយស្វ័យប្រវត្តិ ពេលដោះសោ Episode ដែលមានសិទ្ធិ។',
  },
  zh: {
    diamonds: '钻石',
    coins: '金币',
    tenPercentOff: '9折优惠',
    everySunday: '每周日',
    ruleDiscount: '优惠适用于章节解锁',
    ruleSunday: '每周日开放',
    ruleLimited: '仅限活动时间',
    coinArtworkPlaceholder: '金币插图',
    off: '优惠',
    happeningNow: '正在进行',
    blackSunday: 'Black Sunday',
    discountOn: '优惠适用于',
    diamondCoinUnlocks: '钻石和金币解锁',
    endsIn: '结束倒计时',
    hoursShort: '时',
    minutesShort: '分',
    secondsShort: '秒',
    seeEligibleStories: '查看符合条件的故事',
    weeklyEvent: '每周活动',
    noEventToday: '今天没有活动',
    returnDescription: 'Black Sunday 将带来钻石和金币章节解锁 9 折优惠。',
    nextBlackSunday: '下一次 Black Sunday',
    startsIn: '{{days}}天 {{hours}}小时 {{minutes}}分钟后开始',
    nextEvent: '下一个活动',
    howItWorks: '活动方式',
    upcoming: '即将开始',
    automaticDiscount: '符合条件的章节解锁时会自动应用优惠。',
  },
  ja: {
    diamonds: 'ダイヤモンド',
    coins: 'コイン',
    tenPercentOff: '10%オフ',
    everySunday: '毎週日曜日',
    ruleDiscount: '割引はエピソードのアンロックに適用されます',
    ruleSunday: '毎週日曜日に利用できます',
    ruleLimited: 'イベント時間内のみ有効です',
    coinArtworkPlaceholder: 'コイン画像',
    off: 'OFF',
    happeningNow: '開催中',
    blackSunday: 'Black Sunday',
    discountOn: '割引対象',
    diamondCoinUnlocks: 'ダイヤモンド・コインでのアンロック',
    endsIn: '終了まで',
    hoursShort: '時',
    minutesShort: '分',
    secondsShort: '秒',
    seeEligibleStories: '対象ストーリーを見る',
    weeklyEvent: '毎週のイベント',
    noEventToday: '本日はイベントなし',
    returnDescription: 'Black Sunday では、ダイヤモンドとコインのエピソードアンロックが10%オフになります。',
    nextBlackSunday: '次の Black Sunday',
    startsIn: '開始まで {{days}}日 {{hours}}時間 {{minutes}}分',
    nextEvent: '次のイベント',
    howItWorks: '仕組み',
    upcoming: '近日開催',
    automaticDiscount: '対象エピソードをアンロックすると割引が自動適用されます。',
  },
  ko: {
    diamonds: '다이아몬드',
    coins: '코인',
    tenPercentOff: '10% 할인',
    everySunday: '매주 일요일',
    ruleDiscount: '에피소드 잠금 해제에 할인이 적용됩니다',
    ruleSunday: '매주 일요일 이용할 수 있습니다',
    ruleLimited: '이벤트 시간 동안만 적용됩니다',
    coinArtworkPlaceholder: '코인 이미지',
    off: '할인',
    happeningNow: '진행 중',
    blackSunday: 'Black Sunday',
    discountOn: '할인 대상',
    diamondCoinUnlocks: '다이아몬드 및 코인 잠금 해제',
    endsIn: '종료까지',
    hoursShort: '시',
    minutesShort: '분',
    secondsShort: '초',
    seeEligibleStories: '대상 스토리 보기',
    weeklyEvent: '주간 이벤트',
    noEventToday: '오늘은 이벤트가 없습니다',
    returnDescription: 'Black Sunday에는 다이아몬드와 코인 에피소드 잠금 해제가 10% 할인됩니다.',
    nextBlackSunday: '다음 Black Sunday',
    startsIn: '{{days}}일 {{hours}}시간 {{minutes}}분 후 시작',
    nextEvent: '다음 이벤트',
    howItWorks: '이용 방법',
    upcoming: '예정된 이벤트',
    automaticDiscount: '대상 에피소드를 잠금 해제하면 할인이 자동으로 적용됩니다.',
  },
})

const CAMBODIA_TIME_ZONE = 'Asia/Phnom_Penh'
const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000

function getCambodiaDate(value = new Date()) {
  return new Date(
    new Date(value).getTime() +
      CAMBODIA_OFFSET_MS
  )
}

const BENEFITS = [
  { icon: 'fa-gem', labelKey: 'diamonds', color: 'text-[#7C3AED] dark:text-violet-300', bg: 'bg-[#F1EAFE] dark:bg-violet-500/15' },
  { icon: 'fa-coins', labelKey: 'coins', color: 'text-[#E9A400] dark:text-amber-300', bg: 'bg-[#FFF6D8] dark:bg-amber-500/15' },
  { icon: 'fa-tag', labelKey: 'tenPercentOff', color: 'text-[#F05275] dark:text-rose-300', bg: 'bg-[#FFE8EF] dark:bg-rose-500/15' },
  { icon: 'fa-calendar-days', labelKey: 'everySunday', color: 'text-[#4F86F7] dark:text-blue-300', bg: 'bg-[#EAF1FF] dark:bg-blue-500/15' },
]

const RULES = ['ruleDiscount', 'ruleSunday', 'ruleLimited']

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
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
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
  const { t } = useDisplayTranslation()

  return (
    <div className="min-w-0 text-center">
      <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] ${item.bg} ${item.color}`}>
        <i className={`fa-solid ${item.icon} text-[18px]`} />
      </span>
      <div className="mt-2 truncate text-[11px] font-semibold text-[var(--shadow-text-primary)]">
        {t(`blackSundayEventTab.${item.labelKey}`)}
      </div>
    </div>
  )
}

function LiveEventCard({ now, onExplore }) {
  const { t } = useDisplayTranslation()
  const countdown = getTimeParts(getEndOfToday(now), now)

  return (
    <section className="overflow-hidden rounded-[26px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_18px_45px_rgba(41,29,76,0.12)]">
      <div className="relative min-h-[350px] overflow-hidden bg-[linear-gradient(135deg,#19172E_0%,#22163E_58%,#060608_100%)] px-5 pb-6 pt-5 text-white">
        <div
          className="absolute right-0 top-0 h-full w-[45%] bg-black"
          aria-label={t('blackSundayEventTab.coinArtworkPlaceholder')}
        />
        <div className="absolute -right-12 top-16 h-48 w-48 rounded-full bg-[#7C3AED]/35 blur-3xl" />
        <div className="absolute right-[8%] top-[43%] h-28 w-28 rounded-full border border-white/10 bg-white/[0.03]" />
        <div className="absolute right-[14%] top-[49%] h-16 w-16 rounded-full border border-[#A855F7]/30 bg-black" />

        <div className="absolute right-4 top-5 z-20 flex h-[76px] w-[76px] rotate-6 items-center justify-center rounded-full bg-[linear-gradient(145deg,#A855F7,#6D28D9)] text-center shadow-[0_12px_30px_rgba(124,58,237,0.42)] ring-2 ring-white/55">
          <span className="text-[20px] font-black leading-[20px]">
            10%
            <span className="block text-[13px]">{t('blackSundayEventTab.off')}</span>
          </span>
        </div>

        <div className="relative z-10 max-w-[68%]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E7FF] px-3 py-2 text-[11px] font-black text-[#7C3AED]">
            <i className="fa-solid fa-bolt text-[10px]" />
            {t('blackSundayEventTab.happeningNow')}
          </div>

          <h2 className="mt-6 text-[34px] font-black leading-[1.04] tracking-[-0.04em]">
            {t('blackSundayEventTab.blackSunday')}
          </h2>

          <p className="mt-5 text-[18px] font-bold leading-7 text-white">
            <span className="text-[#B56CFF]">10%</span> {t('blackSundayEventTab.discountOn')}
            <span className="block">{t('blackSundayEventTab.diamondCoinUnlocks')}</span>
          </p>

          <div className="mt-7">
            <div className="mb-3 text-[13px] font-semibold text-white/65">{t('blackSundayEventTab.endsIn')}</div>

            <div className="flex items-start gap-2">
              <CountdownBox value={countdown.hours} label={t('blackSundayEventTab.hoursShort')} />
              <span className="pt-3 text-[20px] font-black text-white/45">:</span>
              <CountdownBox value={countdown.minutes} label={t('blackSundayEventTab.minutesShort')} />
              <span className="pt-3 text-[20px] font-black text-white/45">:</span>
              <CountdownBox value={countdown.seconds} label={t('blackSundayEventTab.secondsShort')} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-4">
        <div className="grid grid-cols-4 gap-2">
          {BENEFITS.map((item) => (
            <BenefitItem key={item.labelKey} item={item} />
          ))}
        </div>

        <button
          type="button"
          onClick={onExplore}
          className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(90deg,#6D3DF1_0%,#D865DD_100%)] px-5 text-[15px] font-black text-white shadow-[0_12px_26px_rgba(124,58,237,0.24)] active:scale-[0.99]"
        >
          {t('blackSundayEventTab.seeEligibleStories')}
          <i className="fa-solid fa-chevron-right text-[12px]" />
        </button>
      </div>
    </section>
  )
}

function NoEventTodayCard({ nextEvent, countdown }) {
  const { t } = useDisplayTranslation()

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E5E1EF] bg-[linear-gradient(135deg,#1A1730,#09090B)] px-5 py-6 text-white shadow-[0_18px_45px_rgba(41,29,76,0.12)]">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-black text-[#C89BFF] ring-1 ring-white/10">
        <i className="fa-regular fa-calendar" />
        {t('blackSundayEventTab.weeklyEvent')}
      </div>

      <h2 className="mt-5 text-[27px] font-black tracking-[-0.03em]">
        {t('blackSundayEventTab.noEventToday')}
      </h2>

      <p className="mt-2 max-w-[410px] text-[13px] font-medium leading-6 text-white/65">
        {t('blackSundayEventTab.returnDescription')}
      </p>

      <div className="mt-5 rounded-[18px] bg-black/45 px-4 py-4 ring-1 ring-white/10">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
          {t('blackSundayEventTab.nextBlackSunday')}
        </div>
        <div className="mt-1 text-[16px] font-black">{formatEventDate(nextEvent)}</div>
        <div className="mt-3 flex items-center gap-2 text-[13px] font-bold text-[#B56CFF]">
          <i className="fa-regular fa-clock" />
          {t('blackSundayEventTab.startsIn', countdown)}
        </div>
      </div>
    </section>
  )
}

function UpcomingEventCard({ eventDate, countdown }) {
  const { t } = useDisplayTranslation()

  return (
    <section className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_26px_rgba(31,24,55,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#F5EFFF,#FFF8F0)]">
          <div className="relative flex h-[78px] w-[70px] flex-col items-center rounded-[17px] bg-[var(--shadow-bg-surface)] pt-5 shadow-[0_10px_22px_rgba(124,58,237,0.16)] ring-1 ring-[var(--shadow-border)]">
            <span className="absolute -top-2 left-3 h-4 w-2 rounded-full bg-[#7C3AED]" />
            <span className="absolute -top-2 right-3 h-4 w-2 rounded-full bg-[#7C3AED]" />
            <i className="fa-solid fa-star text-[27px] text-[#8B5CF6]" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex rounded-full bg-[#F1EAFE] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
            {t('blackSundayEventTab.nextEvent')}
          </div>

          <h3 className="mt-3 text-[18px] font-black text-[var(--shadow-text-primary)]">
            {t('blackSundayEventTab.nextBlackSunday')}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
            <i className="fa-regular fa-calendar text-[#8B5CF6]" />
            <span>{formatEventDate(eventDate)}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12px] font-black text-[#7C3AED]">
            <i className="fa-regular fa-clock" />
            {t('blackSundayEventTab.startsIn', countdown)}
          </div>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
          <i className="fa-solid fa-chevron-right text-[12px]" />
        </span>
      </div>
    </section>
  )
}

function HowItWorksCard() {
  const { t } = useDisplayTranslation()

  return (
    <section className="mt-4 rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_26px_rgba(31,24,55,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-[112px] w-[112px] shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#FFF4EC,#F5EFFF)]">
          <span className="flex h-[70px] w-[70px] items-center justify-center rounded-[20px] bg-[#7C3AED] text-[30px] text-[#FFD85C] shadow-[0_12px_26px_rgba(124,58,237,0.22)]">
            <i className="fa-solid fa-gift" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('blackSundayEventTab.howItWorks')}</h3>

          <div className="mt-3 space-y-2">
            {RULES.map((rule) => (
              <div key={rule} className="flex items-start gap-2 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                <i className="fa-regular fa-circle-check mt-1 text-[12px] text-[#7C3AED]" />
                <span>{t(`blackSundayEventTab.${rule}`)}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
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
  const { t } = useDisplayTranslation()
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
            <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#F1EAFE] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
              <i className="fa-regular fa-calendar-days text-[14px]" />
            </span>

            <h2 className="text-[21px] font-black text-[var(--shadow-text-primary)]">
              {t('blackSundayEventTab.upcoming')}
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

          <div className="mt-4 flex items-center gap-2 px-2 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
            <i className="fa-solid fa-shield-halved text-[#22C55E]" />
            {t('blackSundayEventTab.automaticDiscount')}
          </div>
        </>
      ) : null}
    </div>
  )
}

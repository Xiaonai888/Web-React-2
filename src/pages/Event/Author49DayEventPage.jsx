import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestAuthor49DayEvent } from '../../services/author49DayEventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('author49DayEventPage', {
  en: {
    title: '80% for 49 Days',
    authorEvent: 'Author Event',
    heroSubtitle: 'New Author Boost',
    heading: 'Publish your first episode. Earn 80% for 49 days.',
    description: 'When a new author publishes the first episode, the 49-day boost starts automatically and gives an 80% author share on eligible Diamond Unlock revenue.',
    activeBoost: 'Active Boost',
    waitingFirstEpisode: 'Waiting for First Episode',
    revenueShare: 'Revenue Share',
    duration: 'Duration',
    howItWorks: 'How It Works',
    step1Title: 'Publish your first episode',
    step1Text: 'Publish the first episode of your story to qualify for the new-author boost.',
    step2Title: 'The boost starts automatically',
    step2Text: 'No application is needed. The 49-day countdown starts automatically after the qualifying first episode is published.',
    step3Title: 'Earn 80% from Diamond Unlocks',
    step3Text: 'During the active 49-day period, your eligible Diamond Unlock revenue uses an 80% author share.',
    step4Title: 'The countdown runs continuously',
    step4Text: 'Once activated, the 49-day period continues until its scheduled end time.',
    step5Title: 'Continue with Daily Author Boost',
    step5Text: 'After the 49-day event finishes, publishing a genuinely new episode can activate the Daily Author Boost.',
    shareRules: 'Revenue Share Rules',
    shareDescription: 'Percentages do not stack. Shadow uses the highest eligible author share.',
    example1: 'Stage 60% + 49-Day Event 80% = 80%',
    example2: 'Stage 30% + 49-Day Event 80% = 80%',
    example3: 'Creator Boost 100% takes priority over 80%',
    dashboard: 'Author Dashboard',
    back: 'Back',
    dayShort: 'D',
    hourShort: 'H',
    minuteShort: 'M',
    secondShort: 'S',
  },
  km: {
    title: '80% រយៈពេល 49 ថ្ងៃ',
    authorEvent: 'Event សម្រាប់អ្នកនិពន្ធ',
    heroSubtitle: 'Boost សម្រាប់អ្នកនិពន្ធថ្មី',
    heading: 'បង្ហោះភាគដំបូង ទទួលចំណែក 80% រយៈពេល 49 ថ្ងៃ',
    description: 'នៅពេលអ្នកនិពន្ធថ្មីបង្ហោះភាគដំបូង Boost 49 ថ្ងៃនឹងចាប់ផ្តើមដោយស្វ័យប្រវត្តិ ហើយផ្តល់ចំណែកអ្នកនិពន្ធ 80% លើចំណូល Diamond Unlock ដែលមានសិទ្ធិ។',
    activeBoost: 'Boost កំពុងដំណើរការ',
    waitingFirstEpisode: 'កំពុងរង់ចាំភាគដំបូង',
    revenueShare: 'ចំណែកចំណូល',
    duration: 'រយៈពេល',
    howItWorks: 'របៀបដំណើរការ',
    step1Title: 'បង្ហោះភាគដំបូង',
    step1Text: 'បង្ហោះភាគដំបូងនៃរឿងរបស់អ្នក ដើម្បីទទួលបាន Boost សម្រាប់អ្នកនិពន្ធថ្មី។',
    step2Title: 'Boost ចាប់ផ្តើមដោយស្វ័យប្រវត្តិ',
    step2Text: 'មិនចាំបាច់ដាក់ពាក្យទេ។ Countdown 49 ថ្ងៃនឹងចាប់ផ្តើមដោយស្វ័យប្រវត្តិបន្ទាប់ពីភាគដំបូងដែលមានសិទ្ធិត្រូវបានបង្ហោះ។',
    step3Title: 'ទទួល 80% ពី Diamond Unlock',
    step3Text: 'ក្នុងរយៈពេល 49 ថ្ងៃដែល Event កំពុងដំណើរការ ចំណូល Diamond Unlock ដែលមានសិទ្ធិរបស់អ្នកនឹងប្រើចំណែកអ្នកនិពន្ធ 80%។',
    step4Title: 'Countdown ដំណើរការបន្តរហូត',
    step4Text: 'ពេល Event ចាប់ផ្តើមហើយ រយៈពេល 49 ថ្ងៃនឹងបន្តរហូតដល់ពេលវេលាបញ្ចប់ដែលបានកំណត់។',
    step5Title: 'បន្តជាមួយ Daily Author Boost',
    step5Text: 'បន្ទាប់ពី Event 49 ថ្ងៃចប់ ការបង្ហោះភាគថ្មីពិតប្រាកដអាច Activate Daily Author Boost បាន។',
    shareRules: 'ច្បាប់ចំណែកចំណូល',
    shareDescription: 'ភាគរយមិនបូកបញ្ចូលគ្នាទេ។ Shadow ប្រើចំណែកអ្នកនិពន្ធដែលខ្ពស់បំផុតដែលមានសិទ្ធិ។',
    example1: 'Stage 60% + Event 49 ថ្ងៃ 80% = 80%',
    example2: 'Stage 30% + Event 49 ថ្ងៃ 80% = 80%',
    example3: 'Creator Boost 100% មានអាទិភាពលើ 80%',
    dashboard: 'Author Dashboard',
    back: 'ត្រឡប់ក្រោយ',
    dayShort: 'ថ្ងៃ',
    hourShort: 'ម៉',
    minuteShort: 'ន',
    secondShort: 'វិ',
  },
  zh: {
    title: '49 天 80%',
    authorEvent: '作者活动',
    heroSubtitle: '新作者加成',
    heading: '发布第一章，连续 49 天获得 80% 分成',
    description: '新作者发布第一章后，49 天加成会自动开始，符合条件的钻石解锁收入将采用 80% 作者分成。',
    activeBoost: '加成生效中',
    waitingFirstEpisode: '等待发布第一章',
    revenueShare: '收入分成',
    duration: '持续时间',
    howItWorks: '活动规则',
    step1Title: '发布第一章',
    step1Text: '发布故事的第一章，即可获得新作者加成资格。',
    step2Title: '自动开始加成',
    step2Text: '无需申请。符合条件的第一章发布后，49 天倒计时会自动开始。',
    step3Title: '钻石解锁获得 80%',
    step3Text: '49 天活动期间，符合条件的钻石解锁收入采用 80% 作者分成。',
    step4Title: '倒计时持续运行',
    step4Text: '活动一旦开始，49 天周期会持续到预定结束时间。',
    step5Title: '继续每日作者加成',
    step5Text: '49 天活动结束后，发布真正的新章节即可激活每日作者加成。',
    shareRules: '分成规则',
    shareDescription: '分成比例不会叠加，Shadow 使用当前最高的有效作者分成。',
    example1: '阶段 60% + 49 天活动 80% = 80%',
    example2: '阶段 30% + 49 天活动 80% = 80%',
    example3: '100% Creator Boost 优先于 80%',
    dashboard: '作者面板',
    back: '返回',
    dayShort: '天',
    hourShort: '时',
    minuteShort: '分',
    secondShort: '秒',
  },
  ja: {
    title: '49日間 80%',
    authorEvent: '作者イベント',
    heroSubtitle: '新規作者ブースト',
    heading: '最初のエピソードを公開して、49日間80%の分配率',
    description: '新しい作者が最初のエピソードを公開すると49日間のブーストが自動で開始され、対象のダイヤ解放収益に80%の作者分配率が適用されます。',
    activeBoost: 'ブースト有効',
    waitingFirstEpisode: '最初のエピソードを待っています',
    revenueShare: '収益分配',
    duration: '期間',
    howItWorks: '仕組み',
    step1Title: '最初のエピソードを公開',
    step1Text: '作品の最初のエピソードを公開すると、新規作者ブーストの対象になります。',
    step2Title: '自動でブースト開始',
    step2Text: '申請は不要です。対象となる最初のエピソード公開後、49日間のカウントダウンが自動で開始されます。',
    step3Title: 'ダイヤ解放から80%',
    step3Text: '49日間のイベント中、対象のダイヤ解放収益には80%の作者分配率が適用されます。',
    step4Title: 'カウントダウンは継続',
    step4Text: '一度開始すると、49日間は予定された終了時刻まで継続します。',
    step5Title: 'Daily Author Boostへ',
    step5Text: '49日間のイベント終了後、本当に新しいエピソードを公開するとDaily Author Boostを有効化できます。',
    shareRules: '収益分配ルール',
    shareDescription: '割合は加算されません。Shadowは有効な作者分配率のうち最も高いものを使用します。',
    example1: 'Stage 60% + 49日イベント 80% = 80%',
    example2: 'Stage 30% + 49日イベント 80% = 80%',
    example3: 'Creator Boost 100% は 80% より優先',
    dashboard: '作者ダッシュボード',
    back: '戻る',
    dayShort: '日',
    hourShort: '時',
    minuteShort: '分',
    secondShort: '秒',
  },
  ko: {
    title: '49일간 80%',
    authorEvent: '작가 이벤트',
    heroSubtitle: '신규 작가 부스트',
    heading: '첫 에피소드를 게시하고 49일간 80% 수익 배분',
    description: '신규 작가가 첫 에피소드를 게시하면 49일 부스트가 자동으로 시작되며, 대상 다이아몬드 잠금 해제 수익에 80% 작가 수익 배분이 적용됩니다.',
    activeBoost: '부스트 활성',
    waitingFirstEpisode: '첫 에피소드 게시 대기 중',
    revenueShare: '수익 배분',
    duration: '기간',
    howItWorks: '작동 방식',
    step1Title: '첫 에피소드 게시',
    step1Text: '스토리의 첫 에피소드를 게시하면 신규 작가 부스트 대상이 됩니다.',
    step2Title: '부스트 자동 시작',
    step2Text: '신청할 필요가 없습니다. 대상 첫 에피소드가 게시되면 49일 카운트다운이 자동으로 시작됩니다.',
    step3Title: '다이아몬드 잠금 해제 80%',
    step3Text: '49일 이벤트가 활성화된 동안 대상 다이아몬드 잠금 해제 수익에 80% 작가 수익 배분이 적용됩니다.',
    step4Title: '카운트다운 계속 진행',
    step4Text: '한 번 시작되면 49일 기간은 예정된 종료 시각까지 계속됩니다.',
    step5Title: 'Daily Author Boost로 계속',
    step5Text: '49일 이벤트 종료 후 실제 새 에피소드를 게시하면 Daily Author Boost를 활성화할 수 있습니다.',
    shareRules: '수익 배분 규칙',
    shareDescription: '수익 배분 비율은 합산되지 않습니다. Shadow는 현재 적용 가능한 가장 높은 작가 수익 배분을 사용합니다.',
    example1: 'Stage 60% + 49일 이벤트 80% = 80%',
    example2: 'Stage 30% + 49일 이벤트 80% = 80%',
    example3: 'Creator Boost 100%가 80%보다 우선',
    dashboard: '작가 대시보드',
    back: '뒤로',
    dayShort: '일',
    hourShort: '시',
    minuteShort: '분',
    secondShort: '초',
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
  const totalSeconds = Math.max(0, Math.floor(Number(milliseconds || 0) / 1000))

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
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

export default function Author49DayEventPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [event, setEvent] = useState(null)
  const [serverOffsetMs, setServerOffsetMs] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return undefined
    }

    let ignore = false
    let releaseRequest = () => {}

    async function loadEvent() {
      releaseRequest()

      const request = requestAuthor49DayEvent(token, { force: false })
      releaseRequest = request.release

      try {
        const nextEvent = await request.promise

        if (!ignore) {
          if (!nextEvent?.visible) {
            navigate('/author/dashboard', { replace: true })
            return
          }

          setEvent(nextEvent)

          const serverNow = new Date(nextEvent?.server_now || '').getTime()

          setServerOffsetMs(
            Number.isFinite(serverNow)
              ? serverNow - Date.now()
              : 0
          )
        }
      } catch {
        if (!ignore) {
          navigate('/author/dashboard', { replace: true })
        }
      } finally {
        releaseRequest()
        releaseRequest = () => {}

        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadEvent()

    return () => {
      ignore = true
      releaseRequest()
    }
  }, [navigate])

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  const remainingMs = useMemo(() => {
    if (event?.status !== 'active' || !event?.ends_at) return 0

    const endsAt = new Date(event.ends_at).getTime()
    if (!Number.isFinite(endsAt)) return 0

    return Math.max(0, endsAt - (now + serverOffsetMs))
  }, [event, now, serverOffsetMs])

  const countdown = useMemo(
    () => getCountdown(remainingMs),
    [remainingMs]
  )

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-[var(--shadow-bg-page)] p-4">
        <div className="mx-auto h-[360px] max-w-[760px] animate-pulse rounded-[24px] bg-[var(--shadow-bg-soft)]" />
      </div>
    )
  }

  const isActive = event.status === 'active' && remainingMs > 0
  const sharePercent = Math.round(Number(event.share_percent || 80))
  const durationDays = Math.round(Number(event.duration_days || 49))

  const steps = [
    ['1', 'step1Title', 'step1Text'],
    ['2', 'step2Title', 'step2Text'],
    ['3', 'step3Title', 'step3Text'],
    ['4', 'step4Title', 'step4Text'],
    ['5', 'step5Title', 'step5Text'],
  ]

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10 text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3">
        <div className="mx-auto flex max-w-[760px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full active:scale-95"
            aria-label={t('author49DayEventPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <h1 className="text-[18px] font-bold">
            {t('author49DayEventPage.title')}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="overflow-hidden rounded-[24px] border border-amber-300 bg-black shadow-[0_14px_36px_rgba(245,158,11,0.12)] dark:border-amber-700">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src="/assets/Icons/Event/Event 1.webp"
              alt={t('author49DayEventPage.title')}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute bottom-3 right-3 z-10 w-[58%] max-w-[280px] sm:bottom-4 sm:right-4">
              {isActive ? (
                <div className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[12px] border-2 border-black bg-[#FFC400]/95 px-2 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm">
                  <i className="fa-regular fa-clock text-[10px]" />
                  <span className="text-[12px] font-black tabular-nums">
                    {formatNumber(countdown.days)}{t('author49DayEventPage.dayShort')}
                  </span>
                  <span className="text-[11px] font-black">:</span>
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
                <div className="flex h-10 w-full items-center justify-center rounded-[12px] border-2 border-black bg-[#FFC400]/95 px-2 text-[11px] font-bold text-black shadow-[0_4px_0_#111111] backdrop-blur-sm">
                  {t('author49DayEventPage.waitingFirstEpisode')}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[21px] font-bold">
            {t('author49DayEventPage.heading')}
          </h2>

          <p className="mt-3 text-[13px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
            {t('author49DayEventPage.description')}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-amber-50 p-4 text-center dark:bg-amber-500/10">
              <div className="text-[24px] font-bold text-amber-700 dark:text-amber-300">
                {sharePercent}%
              </div>
              <div className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('author49DayEventPage.revenueShare')}
              </div>
            </div>

            <div className="rounded-[18px] bg-amber-50 p-4 text-center dark:bg-amber-500/10">
              <div className="text-[24px] font-bold text-amber-700 dark:text-amber-300">
                {durationDays}
              </div>
              <div className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('author49DayEventPage.duration')}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[19px] font-bold">
            {t('author49DayEventPage.howItWorks')}
          </h2>

          <div className="mt-4 space-y-4">
            {steps.map(([number, titleKey, textKey]) => (
              <div key={number} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[12px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  {number}
                </div>

                <div>
                  <div className="text-[13px] font-semibold">
                    {t(`author49DayEventPage.${titleKey}`)}
                  </div>
                  <div className="mt-1 text-[11px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                    {t(`author49DayEventPage.${textKey}`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[19px] font-bold">
            {t('author49DayEventPage.shareRules')}
          </h2>

          <p className="mt-2 text-[12px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
            {t('author49DayEventPage.shareDescription')}
          </p>

          <div className="mt-4 space-y-2">
            {['example1', 'example2', 'example3'].map((key) => (
              <div
                key={key}
                className="rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[11px] font-semibold"
              >
                {t(`author49DayEventPage.${key}`)}
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/dashboard')}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-[14px] font-bold text-white active:scale-[0.99] dark:bg-white dark:text-black"
        >
          <i className="fa-solid fa-arrow-right text-[11px]" />
          {t('author49DayEventPage.dashboard')}
        </button>
      </main>
    </div>
  )
}

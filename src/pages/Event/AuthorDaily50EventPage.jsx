import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestAuthorDaily50Event } from '../../services/authorDaily50EventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily50EventPage', {
  en: {
    title: 'Daily Author Boost',
    authorEvent: 'Author Event',
    heading: 'Keep publishing. Keep at least 50%.',
    description: 'After your 80% for 49 Days event ends, publish a genuinely new episode to activate or extend this boost.',
    activeBoost: 'Active Boost',
    available: 'Available',
    used: 'Used',
    maximum: 'Maximum',
    howItWorks: 'How It Works',
    step1Title: 'Publish a new episode',
    step1Text: 'Publish at least 1 genuinely new episode during a Cambodia calendar day.',
    step2Title: 'Get +24 hours',
    step2Text: 'The first qualifying publish on a new Cambodia day activates or extends the boost by 24 hours.',
    step3Title: 'One extension per day',
    step3Text: 'Publishing multiple new episodes on the same Cambodia day still counts only once.',
    step4Title: 'Old episodes do not count',
    step4Text: 'Drafting, unpublishing, or republishing an old episode cannot create another activation.',
    step5Title: 'Maximum 365 days',
    step5Text: 'The boost can activate or extend on up to 365 qualifying days.',
    shareRules: 'Revenue Share Rules',
    shareDescription: 'Percentages do not stack. Shadow uses the highest eligible author share.',
    example1: 'Stage 60% + Daily Boost 50% = 60%',
    example2: 'Weekly Event 70% + Daily Boost 50% = 70%',
    example3: 'Stage 30% + Daily Boost 50% = 50%',
    example4: 'Creator Boost 100% + Daily Boost 50% = 100%',
    cambodiaTime: 'Cambodia time (UTC+7)',
    dashboard: 'Author Dashboard',
    back: 'Back',
  },
  km: {
    title: 'Daily Author Boost',
    authorEvent: 'Event សម្រាប់អ្នកនិពន្ធ',
    heading: 'បន្ត Update ទទួលចំណែកយ៉ាងតិច 50%',
    description: 'បន្ទាប់ពី Event 80% រយៈពេល 49 ថ្ងៃរបស់អ្នកចប់ សូមបង្ហោះភាគថ្មីពិតប្រាកដ ដើម្បីបើក ឬបន្ថែមពេលវេលា Boost នេះ។',
    activeBoost: 'Active Boost',
    available: 'អាចប្រើបាន',
    used: 'បានប្រើ',
    maximum: 'អតិបរមា',
    howItWorks: 'របៀបដំណើរការ',
    step1Title: 'បង្ហោះភាគថ្មី',
    step1Text: 'បង្ហោះយ៉ាងតិច 1 ភាគថ្មីពិតប្រាកដ ក្នុងមួយថ្ងៃតាមម៉ោងកម្ពុជា។',
    step2Title: 'ទទួល +24 ម៉ោង',
    step2Text: 'ការបង្ហោះដែលមានសិទ្ធិលើកដំបូងនៃថ្ងៃថ្មីតាមម៉ោងកម្ពុជា នឹងបើក ឬបន្ថែម Boost +24 ម៉ោង។',
    step3Title: 'មួយដងក្នុងមួយថ្ងៃ',
    step3Text: 'ទោះបង្ហោះភាគថ្មីច្រើនក្នុងថ្ងៃតែមួយ ក៏រាប់តែមួយដងប៉ុណ្ណោះ។',
    step4Title: 'ភាគចាស់មិនរាប់',
    step4Text: 'Draft, Unpublish ឬ Publish ភាគចាស់ឡើងវិញ មិនអាចបង្កើត Activation ថ្មីបានទេ។',
    step5Title: 'អតិបរមា 365 ថ្ងៃ',
    step5Text: 'Boost អាច Activate ឬបន្ថែមបានអតិបរមា 365 ថ្ងៃដែលមានសិទ្ធិ។',
    shareRules: 'ច្បាប់ចំណែកចំណូល',
    shareDescription: 'ភាគរយមិនបូកបញ្ចូលគ្នាទេ។ Shadow ប្រើចំណែកអ្នកនិពន្ធដែលខ្ពស់បំផុត។',
    example1: 'Stage 60% + Daily Boost 50% = 60%',
    example2: 'Weekly Event 70% + Daily Boost 50% = 70%',
    example3: 'Stage 30% + Daily Boost 50% = 50%',
    example4: 'Creator Boost 100% + Daily Boost 50% = 100%',
    cambodiaTime: 'ម៉ោងកម្ពុជា (UTC+7)',
    dashboard: 'Author Dashboard',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    title: '每日作者加成',
    authorEvent: '作者活动',
    heading: '持续更新，至少获得 50% 分成',
    description: '49 天 80% 活动结束后，发布真正的新章节即可激活或延长此加成。',
    activeBoost: '加成生效中',
    available: '可用',
    used: '已使用',
    maximum: '上限',
    howItWorks: '活动规则',
    step1Title: '发布新章节',
    step1Text: '按柬埔寨日期，每天至少发布 1 个真正的新章节。',
    step2Title: '获得 +24 小时',
    step2Text: '柬埔寨新日期的第一次有效发布会激活或延长 24 小时。',
    step3Title: '每天只计算一次',
    step3Text: '同一天发布多个新章节也只计算一次。',
    step4Title: '旧章节不计算',
    step4Text: '旧章节的草稿、取消发布或重新发布不会产生新的激活。',
    step5Title: '最多 365 天',
    step5Text: '最多可在 365 个有效日期激活或延长加成。',
    shareRules: '分成规则',
    shareDescription: '分成比例不会叠加，Shadow 始终使用当前最高的作者分成。',
    example1: 'Stage 60% + Daily Boost 50% = 60%',
    example2: 'Weekly Event 70% + Daily Boost 50% = 70%',
    example3: 'Stage 30% + Daily Boost 50% = 50%',
    example4: 'Creator Boost 100% + Daily Boost 50% = 100%',
    cambodiaTime: '柬埔寨时间 (UTC+7)',
    dashboard: '作者面板',
    back: '返回',
  },
  ja: {
    title: 'デイリー作者ブースト',
    authorEvent: '作者イベント',
    heading: '更新を続けて、最低 50% の分配率',
    description: '49日間 80% イベント終了後、本当に新しいエピソードを公開するとこのブーストを有効化または延長できます。',
    activeBoost: 'ブースト有効',
    available: '利用可能',
    used: '使用済み',
    maximum: '最大',
    howItWorks: '仕組み',
    step1Title: '新しいエピソードを公開',
    step1Text: 'カンボジアの日付ごとに、本当に新しいエピソードを最低1話公開します。',
    step2Title: '+24時間',
    step2Text: 'カンボジアの新しい日の最初の有効な公開で24時間有効化または延長されます。',
    step3Title: '1日1回',
    step3Text: '同じ日に複数の新しいエピソードを公開しても1回だけカウントされます。',
    step4Title: '古いエピソードは対象外',
    step4Text: '古いエピソードの下書き、非公開、再公開では新しい有効化は発生しません。',
    step5Title: '最大365日',
    step5Text: '最大365日の有効な公開日でブーストを有効化または延長できます。',
    shareRules: '収益分配ルール',
    shareDescription: '割合は加算されません。Shadow は常に最も高い有効な作者分配率を使用します。',
    example1: 'Stage 60% + Daily Boost 50% = 60%',
    example2: 'Weekly Event 70% + Daily Boost 50% = 70%',
    example3: 'Stage 30% + Daily Boost 50% = 50%',
    example4: 'Creator Boost 100% + Daily Boost 50% = 100%',
    cambodiaTime: 'カンボジア時間 (UTC+7)',
    dashboard: '作者ダッシュボード',
    back: '戻る',
  },
  ko: {
    title: '데일리 작가 부스트',
    authorEvent: '작가 이벤트',
    heading: '꾸준히 업데이트하고 최소 50% 수익 배분',
    description: '49일간 80% 이벤트가 끝난 뒤 실제 새 에피소드를 게시하면 이 부스트를 활성화하거나 연장할 수 있습니다.',
    activeBoost: '부스트 활성',
    available: '사용 가능',
    used: '사용',
    maximum: '최대',
    howItWorks: '작동 방식',
    step1Title: '새 에피소드 게시',
    step1Text: '캄보디아 날짜 기준 하루에 실제 새 에피소드 1개 이상을 게시합니다.',
    step2Title: '+24시간',
    step2Text: '캄보디아의 새로운 날짜에 첫 유효 게시를 하면 24시간 활성화 또는 연장됩니다.',
    step3Title: '하루 한 번',
    step3Text: '같은 날 여러 새 에피소드를 게시해도 한 번만 계산됩니다.',
    step4Title: '기존 에피소드 제외',
    step4Text: '기존 에피소드를 초안, 게시 취소 또는 재게시해도 새 활성화가 발생하지 않습니다.',
    step5Title: '최대 365일',
    step5Text: '최대 365개의 유효한 날짜에 부스트를 활성화하거나 연장할 수 있습니다.',
    shareRules: '수익 배분 규칙',
    shareDescription: '수익 배분 비율은 합산되지 않습니다. Shadow는 항상 가장 높은 유효 작가 수익 배분을 사용합니다.',
    example1: 'Stage 60% + Daily Boost 50% = 60%',
    example2: 'Weekly Event 70% + Daily Boost 50% = 70%',
    example3: 'Stage 30% + Daily Boost 50% = 50%',
    example4: 'Creator Boost 100% + Daily Boost 50% = 100%',
    cambodiaTime: '캄보디아 시간 (UTC+7)',
    dashboard: '작가 대시보드',
    back: '뒤로',
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

export default function AuthorDaily50EventPage() {
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

      const request = requestAuthorDaily50Event(
        token,
        { force: true }
      )
      releaseRequest = request.release

      try {
        const nextEvent = await request.promise

        if (!ignore) {
          if (!nextEvent?.visible) {
            navigate('/author/dashboard', {
              replace: true,
            })
            return
          }

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
      } catch {
        if (!ignore) {
          navigate('/author/dashboard', {
            replace: true,
          })
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
    const timerId = window.setInterval(
      () => setNow(Date.now()),
      1000
    )

    return () => window.clearInterval(timerId)
  }, [])

  const remainingMs = useMemo(() => {
    if (
      event?.status !== 'active' ||
      !event?.ends_at
    ) {
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

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-[var(--shadow-bg-page)] p-4">
        <div className="mx-auto h-[360px] max-w-[760px] animate-pulse rounded-[24px] bg-[var(--shadow-bg-soft)]" />
      </div>
    )
  }

  const isActive =
    event.status === 'active' && remainingMs > 0
  const used = Number(event.activation_count || 0)
  const max = Number(event.max_activations || 365)

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
            aria-label={t('authorDaily50EventPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <h1 className="text-[18px] font-black">
            {t('authorDaily50EventPage.title')}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="overflow-hidden rounded-[24px] border border-emerald-300 bg-[var(--shadow-bg-surface)] shadow-[0_14px_36px_rgba(16,185,129,0.10)] dark:border-emerald-700">
          <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(145deg,#ECFDF5_0%,#D1FAE5_48%,#A7F3D0_100%)] dark:bg-[linear-gradient(145deg,#07120C_0%,#10251A_48%,#163824_100%)]">
            <div className="absolute -left-14 -top-16 h-52 w-52 rounded-full border-[28px] border-emerald-400/30" />
            <div className="absolute right-8 top-7 h-24 w-24 rotate-12 rounded-[28px] bg-white/45 dark:bg-white/10" />
            <div className="absolute left-[45%] top-12 h-12 w-12 rotate-45 rounded-[12px] border-[6px] border-white/60 dark:border-white/15" />

            <div className="relative z-10 p-5">
              <div className="inline-flex rounded-full bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-white dark:bg-white dark:text-black">
                {t('authorDaily50EventPage.authorEvent')}
              </div>

              <div className="mt-4 text-[64px] font-black leading-none tracking-[-0.08em] text-emerald-950 dark:text-emerald-100">
                50%
              </div>

              <div className="mt-2 text-[18px] font-black text-emerald-900 dark:text-emerald-200">
                {t('authorDaily50EventPage.title')}
              </div>

              <div className="mt-3 text-[11px] font-bold text-emerald-900/70 dark:text-emerald-100/70">
                {t('authorDaily50EventPage.cambodiaTime')}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-5">
              {isActive ? (
                <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border-2 border-black bg-white text-black shadow-[0_5px_0_#111111] dark:bg-emerald-100">
                  <span className="text-[10px] font-black uppercase">
                    {t('authorDaily50EventPage.activeBoost')}
                  </span>
                  <span className="text-[15px] font-black tabular-nums">
                    {formatNumber(countdown.hours)}
                  </span>
                  <span className="font-black">:</span>
                  <span className="text-[15px] font-black tabular-nums">
                    {formatNumber(countdown.minutes)}
                  </span>
                  <span className="font-black">:</span>
                  <span className="text-[15px] font-black tabular-nums">
                    {formatNumber(countdown.seconds)}
                  </span>
                </div>
              ) : (
                <div className="flex h-12 w-full items-center justify-center rounded-[16px] border-2 border-black bg-emerald-400 text-[13px] font-black text-black shadow-[0_5px_0_#111111]">
                  {t('authorDaily50EventPage.available')}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[21px] font-black">
            {t('authorDaily50EventPage.heading')}
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
            {t('authorDaily50EventPage.description')}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-emerald-50 p-4 text-center dark:bg-emerald-500/10">
              <div className="text-[24px] font-black text-emerald-700 dark:text-emerald-300">
                {used}
              </div>
              <div className="mt-1 text-[10px] font-black text-[var(--shadow-text-secondary)]">
                {t('authorDaily50EventPage.used')}
              </div>
            </div>

            <div className="rounded-[18px] bg-emerald-50 p-4 text-center dark:bg-emerald-500/10">
              <div className="text-[24px] font-black text-emerald-700 dark:text-emerald-300">
                {max}
              </div>
              <div className="mt-1 text-[10px] font-black text-[var(--shadow-text-secondary)]">
                {t('authorDaily50EventPage.maximum')}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[19px] font-black">
            {t('authorDaily50EventPage.howItWorks')}
          </h2>

          <div className="mt-4 space-y-4">
            {steps.map(([number, titleKey, textKey]) => (
              <div
                key={number}
                className="flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[12px] font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {number}
                </div>

                <div>
                  <div className="text-[13px] font-black">
                    {t(`authorDaily50EventPage.${titleKey}`)}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {t(`authorDaily50EventPage.${textKey}`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[19px] font-black">
            {t('authorDaily50EventPage.shareRules')}
          </h2>

          <p className="mt-2 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorDaily50EventPage.shareDescription')}
          </p>

          <div className="mt-4 space-y-2">
            {['example1', 'example2', 'example3', 'example4'].map(
              (key) => (
                <div
                  key={key}
                  className="rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[11px] font-black"
                >
                  {t(`authorDaily50EventPage.${key}`)}
                </div>
              )
            )}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/dashboard')}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-[14px] font-black text-white active:scale-[0.99] dark:bg-white dark:text-black"
        >
          <i className="fa-solid fa-arrow-right text-[11px]" />
          {t('authorDaily50EventPage.dashboard')}
        </button>
      </main>
    </div>
  )
}

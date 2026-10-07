import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestAuthorDaily80Event } from '../../services/authorDaily80EventClientCache'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily80EventPage', {
  en: {
    title: '80% Author Boost',
    heading: 'Keep publishing. Keep 80% for up to 180 days.',
    description: 'After your 80% for 49 Days event ends, publish a genuinely new episode to activate or extend this 80% boost. When all 180 qualifying days are completed, your 50% Daily Author Boost can continue.',
    activeBoost: '80% Boost Active',
    available: 'Ready to activate',
    startToday: 'Publish 1 new EP to activate +24h',
    addToday: 'Publish 1 new EP today to add +24h',
    claimedToday: 'Today’s +24h claimed',
    authorShare: 'Author share',
    used: 'Boost days used',
    maximum: 'Maximum',
    newOnly: 'New EP only',
    newOnlyText: 'Editing, unpublishing, or republishing an old episode does not activate or extend this boost.',
    howItWorks: 'How It Works',
    step1Title: 'Finish the 49-day event',
    step1Text: 'This boost becomes available only after your 80% for 49 Days event is completed.',
    step2Title: 'Publish a new episode',
    step2Text: 'Publish at least 1 genuinely new episode during a Cambodia calendar day.',
    step3Title: 'Get +24 hours at 80%',
    step3Text: 'The first qualifying publish on a new Cambodia day activates or extends this boost by 24 hours.',
    step4Title: 'One extension per day',
    step4Text: 'Publishing multiple new episodes on the same Cambodia day still counts only once.',
    step5Title: 'Maximum 180 days',
    step5Text: 'The 80% boost can activate or extend on up to 180 qualifying days. After it is completed, your 50% Daily Author Boost can continue.',
    shareRules: 'Revenue Share Rules',
    shareDescription: 'Percentages do not stack. Shadow uses the highest eligible author share.',
    example1: 'Stage 60% + 180-Day Boost 80% = 80%',
    example2: 'Weekly Event 70% + 180-Day Boost 80% = 80%',
    example3: 'Daily Boost 50% + 180-Day Boost 80% = 80%',
    example4: 'Creator Boost 100% + 180-Day Boost 80% = 100%',
    cambodiaTime: 'Cambodia time (UTC+7)',
    dashboard: 'Author Dashboard',
    back: 'Back',
  },
  km: {
    title: 'Event 80% សម្រាប់អ្នកនិពន្ធ',
    heading: 'បន្ត Update និងរក្សាចំណែក 80% រហូតដល់ 180 ថ្ងៃ',
    description: 'បន្ទាប់ពី Event 80% រយៈពេល 49 ថ្ងៃរបស់អ្នកចប់ សូមបង្ហោះភាគថ្មីពិតប្រាកដ ដើម្បីបើក ឬបន្ថែម Event 80% នេះ។ ពេលប្រើបានគ្រប់ 180 ថ្ងៃ Event 50% Daily Author Boost របស់អ្នកអាចបន្តវិញ។',
    activeBoost: 'Event 80% កំពុងដំណើរការ',
    available: 'ត្រៀមបើក Event 80%',
    startToday: 'បង្ហោះភាគថ្មី 1 ភាគ ដើម្បីបើក +24h',
    addToday: 'បង្ហោះភាគថ្មី 1 ភាគថ្ងៃនេះ ដើម្បីបន្ថែម +24h',
    claimedToday: 'ថ្ងៃនេះបាន +24h រួចហើយ',
    authorShare: 'ចំណែកអ្នកនិពន្ធ',
    used: 'ថ្ងៃដែលបានប្រើ',
    maximum: 'អតិបរមា',
    newOnly: 'រាប់តែភាគថ្មី',
    newOnlyText: 'ការកែ Edit, Unpublish ឬ Publish ភាគចាស់ឡើងវិញ មិនអាចបើក ឬបន្ថែម Event នេះបានទេ។',
    howItWorks: 'របៀបដំណើរការ',
    step1Title: 'បញ្ចប់ Event 49 ថ្ងៃ',
    step1Text: 'Event នេះអាចចាប់ផ្តើមបានតែបន្ទាប់ពី Event 80% រយៈពេល 49 ថ្ងៃរបស់អ្នកបានបញ្ចប់។',
    step2Title: 'បង្ហោះភាគថ្មី',
    step2Text: 'បង្ហោះយ៉ាងតិច 1 ភាគថ្មីពិតប្រាកដ ក្នុងមួយថ្ងៃតាមម៉ោងកម្ពុជា។',
    step3Title: 'ទទួល +24 ម៉ោង ជាមួយចំណែក 80%',
    step3Text: 'ការបង្ហោះដែលមានសិទ្ធិលើកដំបូងនៃថ្ងៃថ្មីតាមម៉ោងកម្ពុជា នឹងបើក ឬបន្ថែម Event +24 ម៉ោង។',
    step4Title: 'មួយដងក្នុងមួយថ្ងៃ',
    step4Text: 'ទោះបង្ហោះភាគថ្មីច្រើនក្នុងថ្ងៃតែមួយ ក៏រាប់តែមួយដងប៉ុណ្ណោះ។',
    step5Title: 'អតិបរមា 180 ថ្ងៃ',
    step5Text: 'Event 80% អាច Activate ឬបន្ថែមបានអតិបរមា 180 ថ្ងៃដែលមានសិទ្ធិ។ បន្ទាប់ពីចប់ Event 50% Daily Author Boost អាចបន្តវិញ។',
    shareRules: 'ច្បាប់ចំណែកចំណូល',
    shareDescription: 'ភាគរយមិនបូកបញ្ចូលគ្នាទេ។ Shadow ប្រើចំណែកអ្នកនិពន្ធដែលខ្ពស់បំផុត។',
    example1: 'Stage 60% + Event 180 ថ្ងៃ 80% = 80%',
    example2: 'Weekly Event 70% + Event 180 ថ្ងៃ 80% = 80%',
    example3: 'Daily Boost 50% + Event 180 ថ្ងៃ 80% = 80%',
    example4: 'Creator Boost 100% + Event 180 ថ្ងៃ 80% = 100%',
    cambodiaTime: 'ម៉ោងកម្ពុជា (UTC+7)',
    dashboard: 'Author Dashboard',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    title: '80% 作者加成',
    heading: '持续更新，最多 180 天保持 80% 分成',
    description: '49 天 80% 活动结束后，发布真正的新章节即可激活或延长此 80% 加成。完成全部 180 个有效日期后，可继续 50% 每日作者加成。',
    activeBoost: '80% 加成生效中',
    available: '可激活',
    startToday: '发布 1 个新章节以激活 +24h',
    addToday: '今天发布 1 个新章节增加 +24h',
    claimedToday: '今天的 +24h 已领取',
    authorShare: '作者分成',
    used: '已使用加成天数',
    maximum: '上限',
    newOnly: '仅限新章节',
    newOnlyText: '编辑、取消发布或重新发布旧章节不会激活或延长此加成。',
    howItWorks: '活动规则',
    step1Title: '完成 49 天活动',
    step1Text: '只有完成 49 天 80% 活动后，此加成才会开放。',
    step2Title: '发布新章节',
    step2Text: '按柬埔寨日期，每天至少发布 1 个真正的新章节。',
    step3Title: '获得 80% 的 +24 小时',
    step3Text: '柬埔寨新日期的第一次有效发布会激活或延长 24 小时。',
    step4Title: '每天只计算一次',
    step4Text: '同一天发布多个新章节也只计算一次。',
    step5Title: '最多 180 天',
    step5Text: '最多可在 180 个有效日期激活或延长 80% 加成。完成后可继续 50% 每日作者加成。',
    shareRules: '分成规则',
    shareDescription: '分成比例不会叠加，Shadow 始终使用当前最高的作者分成。',
    example1: 'Stage 60% + 180 天 80% = 80%',
    example2: 'Weekly Event 70% + 180 天 80% = 80%',
    example3: 'Daily Boost 50% + 180 天 80% = 80%',
    example4: 'Creator Boost 100% + 180 天 80% = 100%',
    cambodiaTime: '柬埔寨时间 (UTC+7)',
    dashboard: '作者面板',
    back: '返回',
  },
  ja: {
    title: '80% 作者ブースト',
    heading: '更新を続けて、最大180日間 80% の分配率',
    description: '49日間 80% イベント終了後、本当に新しいエピソードを公開するとこの80%ブーストを有効化または延長できます。180日の対象日を完了すると、50% Daily Author Boostを続けられます。',
    activeBoost: '80% ブースト有効',
    available: '有効化可能',
    startToday: '新しい話を1話公開して +24h を有効化',
    addToday: '今日、新しい話を1話公開して +24h を追加',
    claimedToday: '本日の +24h は獲得済み',
    authorShare: '作者分配',
    used: '使用済みブースト日数',
    maximum: '最大',
    newOnly: '新規エピソードのみ',
    newOnlyText: '旧話の編集、非公開、再公開ではこのブーストを有効化または延長できません。',
    howItWorks: '仕組み',
    step1Title: '49日イベントを完了',
    step1Text: 'このブーストは49日間 80% イベントの完了後にのみ利用できます。',
    step2Title: '新しいエピソードを公開',
    step2Text: 'カンボジアの日付ごとに、本当に新しいエピソードを最低1話公開します。',
    step3Title: '80%で +24時間',
    step3Text: 'カンボジアの新しい日の最初の有効な公開で24時間有効化または延長されます。',
    step4Title: '1日1回',
    step4Text: '同じ日に複数の新しいエピソードを公開しても1回だけカウントされます。',
    step5Title: '最大180日',
    step5Text: '最大180日の有効な公開日で80%ブーストを有効化または延長できます。完了後は50% Daily Author Boostを続けられます。',
    shareRules: '収益分配ルール',
    shareDescription: '割合は加算されません。Shadow は常に最も高い有効な作者分配率を使用します。',
    example1: 'Stage 60% + 180日 80% = 80%',
    example2: 'Weekly Event 70% + 180日 80% = 80%',
    example3: 'Daily Boost 50% + 180日 80% = 80%',
    example4: 'Creator Boost 100% + 180日 80% = 100%',
    cambodiaTime: 'カンボジア時間 (UTC+7)',
    dashboard: '作者ダッシュボード',
    back: '戻る',
  },
  ko: {
    title: '80% 작가 부스트',
    heading: '꾸준히 업데이트하고 최대 180일간 80% 수익 배분',
    description: '49일간 80% 이벤트가 끝난 뒤 실제 새 에피소드를 게시하면 이 80% 부스트를 활성화하거나 연장할 수 있습니다. 180개의 유효 날짜를 모두 완료하면 50% Daily Author Boost를 계속할 수 있습니다.',
    activeBoost: '80% 부스트 활성',
    available: '활성화 가능',
    startToday: '새 에피소드 1개를 게시해 +24h 활성화',
    addToday: '오늘 새 에피소드 1개를 게시해 +24h 추가',
    claimedToday: '오늘의 +24h 획득 완료',
    authorShare: '작가 수익 배분',
    used: '사용한 부스트 일수',
    maximum: '최대',
    newOnly: '새 에피소드만 적용',
    newOnlyText: '기존 에피소드 수정, 게시 취소 또는 재게시는 이 부스트를 활성화하거나 연장하지 않습니다.',
    howItWorks: '작동 방식',
    step1Title: '49일 이벤트 완료',
    step1Text: '이 부스트는 49일간 80% 이벤트가 완료된 뒤에만 사용할 수 있습니다.',
    step2Title: '새 에피소드 게시',
    step2Text: '캄보디아 날짜 기준 하루에 실제 새 에피소드 1개 이상을 게시합니다.',
    step3Title: '80%로 +24시간',
    step3Text: '캄보디아의 새로운 날짜에 첫 유효 게시를 하면 24시간 활성화 또는 연장됩니다.',
    step4Title: '하루 한 번',
    step4Text: '같은 날 여러 새 에피소드를 게시해도 한 번만 계산됩니다.',
    step5Title: '최대 180일',
    step5Text: '최대 180개의 유효 날짜에 80% 부스트를 활성화하거나 연장할 수 있습니다. 완료 후 50% Daily Author Boost를 계속할 수 있습니다.',
    shareRules: '수익 배분 규칙',
    shareDescription: '수익 배분 비율은 합산되지 않습니다. Shadow는 항상 가장 높은 유효 작가 수익 배분을 사용합니다.',
    example1: 'Stage 60% + 180일 80% = 80%',
    example2: 'Weekly Event 70% + 180일 80% = 80%',
    example3: 'Daily Boost 50% + 180일 80% = 80%',
    example4: 'Creator Boost 100% + 180일 80% = 100%',
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

export default function AuthorDaily80EventPage() {
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

      const request = requestAuthorDaily80Event(
        token,
        { force: false }
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
  const max = Number(event.max_activations || 180)
  const statusMessage = isActive
    ? event.can_activate_today
      ? t('authorDaily80EventPage.addToday')
      : t('authorDaily80EventPage.claimedToday')
    : t('authorDaily80EventPage.startToday')

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
            aria-label={t('authorDaily80EventPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <h1 className="text-[18px] font-bold">
            {t('authorDaily80EventPage.title')}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="overflow-hidden rounded-[24px] border border-violet-300 bg-[var(--shadow-bg-surface)] shadow-[0_14px_36px_rgba(139,92,246,0.14)] dark:border-violet-700">
          <div className="relative aspect-[16/9] overflow-hidden bg-violet-50 dark:bg-[#120A1D]">
            <img
              src="/assets/Icons/Event/Event80%25_One_Year.webp"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable="false"
            />

            <div className="absolute bottom-3 right-3 z-10 w-[48%] max-w-[320px] sm:bottom-5 sm:right-5">
              {isActive ? (
                <div className="flex h-11 w-full items-center justify-center gap-1.5 rounded-[13px] border-2 border-black bg-white/95 px-2 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm dark:bg-violet-100/95 sm:h-12 sm:gap-2">
                  <i className="fa-regular fa-clock text-[10px] sm:text-[11px]" />
                  <span className="text-[12px] font-black tabular-nums sm:text-[14px]">
                    {formatNumber(countdown.hours)}
                  </span>
                  <span className="text-[11px] font-black sm:text-[13px]">:</span>
                  <span className="text-[12px] font-black tabular-nums sm:text-[14px]">
                    {formatNumber(countdown.minutes)}
                  </span>
                  <span className="text-[11px] font-black sm:text-[13px]">:</span>
                  <span className="text-[12px] font-black tabular-nums sm:text-[14px]">
                    {formatNumber(countdown.seconds)}
                  </span>
                </div>
              ) : (
                <div className="rounded-[13px] border-2 border-black bg-white/95 px-3 py-2 text-center text-[9px] font-black leading-4 text-black shadow-[0_4px_0_#111111] backdrop-blur-sm dark:bg-violet-100/95 sm:px-4 sm:py-3 sm:text-[11px]">
                  {t('authorDaily80EventPage.startToday')}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-[0.08em] text-violet-700 dark:text-violet-300">
                {isActive
                  ? t('authorDaily80EventPage.activeBoost')
                  : t('authorDaily80EventPage.available')}
              </div>
              <div className="mt-1 text-[15px] font-black leading-6">
                {statusMessage}
              </div>
              <div className="mt-1 text-[10px] font-bold text-[var(--shadow-text-secondary)]">
                {t('authorDaily80EventPage.cambodiaTime')}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-[16px] bg-violet-50 p-3 text-center dark:bg-violet-500/10">
              <div className="text-[22px] font-black text-violet-700 dark:text-violet-300">
                80%
              </div>
              <div className="mt-1 text-[9px] font-black leading-3 text-[var(--shadow-text-secondary)]">
                {t('authorDaily80EventPage.authorShare')}
              </div>
            </div>

            <div className="rounded-[16px] bg-violet-50 p-3 text-center dark:bg-violet-500/10">
              <div className="text-[22px] font-black text-violet-700 dark:text-violet-300">
                {used}
              </div>
              <div className="mt-1 text-[9px] font-black leading-3 text-[var(--shadow-text-secondary)]">
                {t('authorDaily80EventPage.used')}
              </div>
            </div>

            <div className="rounded-[16px] bg-violet-50 p-3 text-center dark:bg-violet-500/10">
              <div className="text-[22px] font-black text-violet-700 dark:text-violet-300">
                {max}
              </div>
              <div className="mt-1 text-[9px] font-black leading-3 text-[var(--shadow-text-secondary)]">
                {t('authorDaily80EventPage.maximum')}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 rounded-[16px] bg-[var(--shadow-bg-soft)] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <i className="fa-solid fa-circle-info text-[11px]" />
            </div>
            <div>
              <div className="text-[12px] font-black">
                {t('authorDaily80EventPage.newOnly')}
              </div>
              <div className="mt-1 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorDaily80EventPage.newOnlyText')}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[21px] font-bold">
            {t('authorDaily80EventPage.heading')}
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
            {t('authorDaily80EventPage.description')}
          </p>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[19px] font-bold">
            {t('authorDaily80EventPage.howItWorks')}
          </h2>

          <div className="mt-4 space-y-4">
            {steps.map(([number, titleKey, textKey]) => (
              <div
                key={number}
                className="flex gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[12px] font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  {number}
                </div>

                <div>
                  <div className="text-[13px] font-black">
                    {t(`authorDaily80EventPage.${titleKey}`)}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {t(`authorDaily80EventPage.${textKey}`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[19px] font-bold">
            {t('authorDaily80EventPage.shareRules')}
          </h2>

          <p className="mt-2 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorDaily80EventPage.shareDescription')}
          </p>

          <div className="mt-4 space-y-2">
            {['example1', 'example2', 'example3', 'example4'].map(
              (key) => (
                <div
                  key={key}
                  className="rounded-[14px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[11px] font-black"
                >
                  {t(`authorDaily80EventPage.${key}`)}
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
          {t('authorDaily80EventPage.dashboard')}
        </button>
      </main>
    </div>
  )
}

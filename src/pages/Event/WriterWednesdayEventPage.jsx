import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

registerTranslationNamespace('writerWednesdayEventPage', {
  en: {
    goBack: 'Go back',
    title: 'Writer Wednesday',
    author: 'Author',
    event: 'Event',
    imageAlt: 'Writer Wednesday 70% Event',
    happeningNow: 'Happening Now',
    weeklyEvent: 'Weekly Event',
    cambodiaTime: 'Cambodia Time',
    heroTitle: 'Create more. Earn more.',
    heroDescription:
      'Every Wednesday, authors earn 70% from eligible Diamond episode unlocks automatically.',
    authorShare: 'Author share',
    wednesday: 'Wednesday',
    everyWeek: 'Every week',
    diamond: 'Diamond',
    unlockOnly: 'Unlock only',
    howItWorks: 'How it works',
    step1Title: 'Publish and keep writing',
    step1Text: 'The event runs every Wednesday in Cambodia time.',
    step2Title: 'Readers unlock with Diamonds',
    step2Text: 'Eligible Diamond episode unlocks are included automatically.',
    step3Title: 'Authors receive 70%',
    step3Text: 'No event code or manual activation is required.',
    footerNote: 'Automatically applied to eligible Diamond episode unlocks.',
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'Writer Wednesday',
    author: 'អ្នកនិពន្ធ',
    event: 'ព្រឹត្តិការណ៍',
    imageAlt: 'ព្រឹត្តិការណ៍ Writer Wednesday 70%',
    happeningNow: 'កំពុងដំណើរការ',
    weeklyEvent: 'ព្រឹត្តិការណ៍ប្រចាំសប្តាហ៍',
    cambodiaTime: 'ម៉ោងកម្ពុជា',
    heroTitle: 'បង្កើតឱ្យបានច្រើន។ រកចំណូលឱ្យបានច្រើន។',
    heroDescription:
      'រៀងរាល់ថ្ងៃពុធ អ្នកនិពន្ធទទួលបាន 70% ពីការដោះសោ Episode ដោយ Diamond ដែលមានសិទ្ធិដោយស្វ័យប្រវត្តិ។',
    authorShare: 'ចំណែកអ្នកនិពន្ធ',
    wednesday: 'ថ្ងៃពុធ',
    everyWeek: 'រៀងរាល់សប្តាហ៍',
    diamond: 'Diamond',
    unlockOnly: 'សម្រាប់ដោះសោប៉ុណ្ណោះ',
    howItWorks: 'របៀបដំណើរការ',
    step1Title: 'បោះពុម្ព និងបន្តសរសេរ',
    step1Text: 'ព្រឹត្តិការណ៍នេះដំណើរការរៀងរាល់ថ្ងៃពុធ តាមម៉ោងកម្ពុជា។',
    step2Title: 'អ្នកអានដោះសោដោយ Diamond',
    step2Text: 'ការដោះសោ Episode ដោយ Diamond ដែលមានសិទ្ធិ នឹងត្រូវរាប់បញ្ចូលដោយស្វ័យប្រវត្តិ។',
    step3Title: 'អ្នកនិពន្ធទទួលបាន 70%',
    step3Text: 'មិនត្រូវការកូដព្រឹត្តិការណ៍ ឬការបើកដំណើរការដោយដៃទេ។',
    footerNote: 'អនុវត្តដោយស្វ័យប្រវត្តិចំពោះការដោះសោ Episode ដោយ Diamond ដែលមានសិទ្ធិ។',
  },
  zh: {
    goBack: '返回',
    title: 'Writer Wednesday',
    author: '作者',
    event: '活动',
    imageAlt: 'Writer Wednesday 70% 活动',
    happeningNow: '正在进行',
    weeklyEvent: '每周活动',
    cambodiaTime: '柬埔寨时间',
    heroTitle: '创作更多，赚取更多。',
    heroDescription:
      '每周三，作者会自动从符合条件的钻石章节解锁中获得 70% 收益。',
    authorShare: '作者分成',
    wednesday: '星期三',
    everyWeek: '每周',
    diamond: '钻石',
    unlockOnly: '仅限解锁',
    howItWorks: '活动方式',
    step1Title: '发布并持续创作',
    step1Text: '活动按柬埔寨时间每周三进行。',
    step2Title: '读者使用钻石解锁',
    step2Text: '符合条件的钻石章节解锁会自动计入活动。',
    step3Title: '作者获得 70%',
    step3Text: '无需活动代码，也无需手动启用。',
    footerNote: '符合条件的钻石章节解锁会自动应用此活动。',
  },
  ja: {
    goBack: '戻る',
    title: 'Writer Wednesday',
    author: '作者',
    event: 'イベント',
    imageAlt: 'Writer Wednesday 70% イベント',
    happeningNow: '開催中',
    weeklyEvent: '毎週のイベント',
    cambodiaTime: 'カンボジア時間',
    heroTitle: 'もっと創作して、もっと稼ごう。',
    heroDescription:
      '毎週水曜日、対象となるダイヤモンドでのエピソード解放から作者に 70% が自動的に還元されます。',
    authorShare: '作者の取り分',
    wednesday: '水曜日',
    everyWeek: '毎週',
    diamond: 'ダイヤモンド',
    unlockOnly: '解放のみ',
    howItWorks: '仕組み',
    step1Title: '公開して書き続ける',
    step1Text: 'イベントはカンボジア時間で毎週水曜日に開催されます。',
    step2Title: '読者がダイヤモンドで解放',
    step2Text: '対象となるダイヤモンドでのエピソード解放は自動的に含まれます。',
    step3Title: '作者は 70% を受け取る',
    step3Text: 'イベントコードや手動での有効化は必要ありません。',
    footerNote: '対象となるダイヤモンドでのエピソード解放に自動適用されます。',
  },
  ko: {
    goBack: '뒤로',
    title: 'Writer Wednesday',
    author: '작가',
    event: '이벤트',
    imageAlt: 'Writer Wednesday 70% 이벤트',
    happeningNow: '진행 중',
    weeklyEvent: '주간 이벤트',
    cambodiaTime: '캄보디아 시간',
    heroTitle: '더 많이 창작하고, 더 많이 수익을 올리세요.',
    heroDescription:
      '매주 수요일, 작가는 대상 다이아몬드 에피소드 잠금 해제 수익의 70%를 자동으로 받습니다.',
    authorShare: '작가 수익 배분',
    wednesday: '수요일',
    everyWeek: '매주',
    diamond: '다이아몬드',
    unlockOnly: '잠금 해제 전용',
    howItWorks: '이용 방법',
    step1Title: '게시하고 계속 작성하기',
    step1Text: '이 이벤트는 캄보디아 시간 기준 매주 수요일에 진행됩니다.',
    step2Title: '독자가 다이아몬드로 잠금 해제',
    step2Text: '대상 다이아몬드 에피소드 잠금 해제는 자동으로 포함됩니다.',
    step3Title: '작가는 70%를 받습니다',
    step3Text: '이벤트 코드나 수동 활성화가 필요하지 않습니다.',
    footerNote: '대상 다이아몬드 에피소드 잠금 해제에 자동으로 적용됩니다.',
  },
})

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getCambodiaNow() {
  const now = new Date()
  const localTime =
    now.getTime() +
    now.getTimezoneOffset() * 60000

  return new Date(
    localTime +
      7 * 60 * 60 * 1000
  )
}

function getWriterWednesdayState() {
  const now = getCambodiaNow()
  const weekday = now.getDay()
  const localSeconds =
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    now.getSeconds()

  const active = weekday === 3
  const daysUntilWednesday =
    (3 - weekday + 7) % 7

  const startsInSeconds = active
    ? 0
    : daysUntilWednesday * 86400 -
      localSeconds

  const endsInSeconds = active
    ? 86400 - localSeconds
    : 0

  const nextStartSeconds = active
    ? 7 * 86400 - localSeconds
    : startsInSeconds

  return {
    active,
    countdownSeconds: active
      ? endsInSeconds
      : startsInSeconds,
    nextStart: new Date(
      Date.now() +
        Math.max(
          0,
          nextStartSeconds
        ) *
          1000
    ),
  }
}

function getCountdownParts(totalSeconds) {
  const seconds = Math.max(
    0,
    Number(totalSeconds || 0)
  )

  return {
    days: Math.floor(
      seconds / 86400
    ),
    hours: Math.floor(
      (seconds % 86400) / 3600
    ),
    minutes: Math.floor(
      (seconds % 3600) / 60
    ),
    seconds: Math.floor(
      seconds % 60
    ),
  }
}

function normalizeEvent(event) {
  const fallback =
    getWriterWednesdayState()

  if (!event) {
    return fallback
  }

  return {
    active: Boolean(event.active),
    countdownSeconds: Number(
      event.active
        ? event.ends_in_seconds
        : event.starts_in_seconds
    ),
    nextStart: new Date(
      event.next_starts_at ||
        event.starts_at ||
        fallback.nextStart
    ),
  }
}

function formatNextWednesdayLabel(date, language) {
  return new Intl.DateTimeFormat(
    DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en,
    {
      timeZone: 'Asia/Phnom_Penh',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(date)
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function InfoCard({
  icon,
  value,
  label,
}) {
  return (
    <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-4 text-center shadow-[0_8px_22px_rgba(124,58,237,0.05)]">
      <i
        className={`fa-solid ${icon} text-[16px] text-[#7C3AED]`}
      />
      <div className="mt-2 text-[15px] font-black text-[var(--shadow-text-primary)]">
        {value}
      </div>
      <div className="mt-1 text-[9px] font-semibold text-[var(--shadow-text-secondary)]">
        {label}
      </div>
    </div>
  )
}

export default function WriterWednesdayEventPage() {
  const navigate = useNavigate()
  const { language, t } = useDisplayTranslation()
  const [eventState, setEventState] =
    useState(
      getWriterWednesdayState
    )

  useEffect(() => {
    let ignore = false

    async function syncEvent() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/unlocks/events/writer-wednesday`
        )

        const data =
          await response.json()

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error('Failed')
        }

        if (!ignore) {
          setEventState(
            normalizeEvent(data.event)
          )
        }
      } catch {
        if (!ignore) {
          setEventState(
            getWriterWednesdayState()
          )
        }
      }
    }

    syncEvent()

    const syncTimer =
      window.setInterval(
        syncEvent,
        60000
      )

    const countdownTimer =
      window.setInterval(() => {
        setEventState(
          (current) => ({
            ...current,
            countdownSeconds:
              Math.max(
                0,
                Number(
                  current.countdownSeconds ||
                    0
                ) - 1
              ),
          })
        )
      }, 1000)

    return () => {
      ignore = true
      window.clearInterval(syncTimer)
      window.clearInterval(
        countdownTimer
      )
    }
  }, [])

  const countdown =
    getCountdownParts(
      eventState.countdownSeconds
    )

  const nextWednesdayLabel =
    useMemo(
      () =>
        formatNextWednesdayLabel(
          eventState.nextStart,
          language
        ),
      [eventState.nextStart, language]
    )

  const displayHours =
    countdown.days * 24 +
    countdown.hours

  return (
    <div className="app-page min-h-screen pb-10">
      <header className="sticky top-0 z-30 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[560px] items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('writerWednesdayEventPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="flex-1 text-center text-[16px] font-black text-[var(--shadow-text-primary)]">
            {t('writerWednesdayEventPage.title')}
          </div>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-4 pt-4">
        <div className="mb-4 flex border-b border-[var(--shadow-border)]">
          <button
            type="button"
            onClick={() =>
              navigate('/event')
            }
            className="px-3 pb-3 text-[12px] font-bold text-[var(--shadow-text-tertiary)]"
          >
            {t('writerWednesdayEventPage.author')}
          </button>

          <button
            type="button"
            className="border-b-2 border-[#7C3AED] px-3 pb-3 text-[12px] font-black text-[var(--shadow-text-primary)]"
          >
            {t('writerWednesdayEventPage.event')}
          </button>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_14px_36px_rgba(124,58,237,0.08)]">
          <img
            src="/assets/Icons/Event/Event 3.webp"
            alt={t('writerWednesdayEventPage.imageAlt')}
            className="block h-auto w-full"
          />

          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EAFE] px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
                <span
                  className={`h-2 w-2 rounded-full ${
                    eventState.active
                      ? 'bg-[#22C55E]'
                      : 'bg-[#A78BFA]'
                  }`}
                />
                {eventState.active
                  ? t('writerWednesdayEventPage.happeningNow')
                  : t('writerWednesdayEventPage.weeklyEvent')}
              </div>

              <div className="text-[10px] font-bold text-[var(--shadow-text-secondary)]">
                {t('writerWednesdayEventPage.cambodiaTime')}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-4">
              <span className="min-w-[58px] text-center text-[36px] font-black tabular-nums tracking-[-0.05em] text-[var(--shadow-text-primary)]">
                {pad(displayHours)}
              </span>

              <span className="pb-1 text-[27px] font-black text-[#A78BFA]">
                :
              </span>

              <span className="min-w-[58px] text-center text-[36px] font-black tabular-nums tracking-[-0.05em] text-[var(--shadow-text-primary)]">
                {pad(
                  countdown.minutes
                )}
              </span>

              <span className="pb-1 text-[27px] font-black text-[#A78BFA]">
                :
              </span>

              <span className="min-w-[58px] text-center text-[36px] font-black tabular-nums tracking-[-0.05em] text-[var(--shadow-text-primary)]">
                {pad(
                  countdown.seconds
                )}
              </span>
            </div>

            {!eventState.active ? (
              <div className="mt-3 text-center text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {nextWednesdayLabel}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_28px_rgba(31,24,55,0.06)]">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8B5CF6]">
            {t('writerWednesdayEventPage.title')}
          </div>

          <h1 className="mt-2 text-[24px] font-black leading-[1.15] tracking-[-0.03em] text-[var(--shadow-text-primary)]">
            {t('writerWednesdayEventPage.heroTitle')}
          </h1>

          <p className="mt-3 text-[13px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
            {t('writerWednesdayEventPage.heroDescription')}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <InfoCard
              icon="fa-percent"
              value="70%"
              label={t('writerWednesdayEventPage.authorShare')}
            />
            <InfoCard
              icon="fa-calendar-days"
              value={t('writerWednesdayEventPage.wednesday')}
              label={t('writerWednesdayEventPage.everyWeek')}
            />
            <InfoCard
              icon="fa-gem"
              value={t('writerWednesdayEventPage.diamond')}
              label={t('writerWednesdayEventPage.unlockOnly')}
            />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_28px_rgba(31,24,55,0.06)]">
          <h2 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
            {t('writerWednesdayEventPage.howItWorks')}
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[12px] font-black text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
                1
              </div>
              <div>
                <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">
                  {t('writerWednesdayEventPage.step1Title')}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                  {t('writerWednesdayEventPage.step1Text')}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[12px] font-black text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
                2
              </div>
              <div>
                <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">
                  {t('writerWednesdayEventPage.step2Title')}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                  {t('writerWednesdayEventPage.step2Text')}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDFF] text-[12px] font-black text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
                3
              </div>
              <div>
                <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">
                  {t('writerWednesdayEventPage.step3Title')}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                  {t('writerWednesdayEventPage.step3Text')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 rounded-[18px] bg-[#F3EDFF] px-4 py-3 text-center text-[11px] font-bold leading-5 text-[#6D28D9] dark:bg-violet-500/15 dark:text-violet-300">
          {t('writerWednesdayEventPage.footerNote')}
        </div>
      </main>
    </div>
  )
}

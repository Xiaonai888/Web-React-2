import { SurfaceCard } from './PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('maintenancePage', {
  en: {
    title: 'Temporarily unavailable',
    body: 'This part of Shadow is under maintenance right now. Please try again shortly.',
    retry: 'Try again',
    home: 'Go to Home',
    status: 'Maintenance in progress',
    retryAfter: 'Please try again in about {{time}}.',
    seconds: '{{count}} seconds',
    minutes: '{{count}} minutes',
    hours: '{{count}} hours',
  },
  km: {
    title: 'មិនអាចប្រើបានជាបណ្ដោះអាសន្ន',
    body: 'ផ្នែកនេះរបស់ Shadow កំពុងស្ថិតក្រោមការថែទាំ។ សូមព្យាយាមម្ដងទៀតបន្តិចទៀត។',
    retry: 'ព្យាយាមម្ដងទៀត',
    home: 'ទៅទំព័រដើម',
    status: 'កំពុងថែទាំប្រព័ន្ធ',
    retryAfter: 'សូមព្យាយាមម្ដងទៀតក្នុងប្រហែល {{time}}។',
    seconds: '{{count}} វិនាទី',
    minutes: '{{count}} នាទី',
    hours: '{{count}} ម៉ោង',
  },
  zh: {
    title: '暂时无法使用',
    body: 'Shadow 的此部分正在维护中，请稍后再试。',
    retry: '重试',
    home: '返回首页',
    status: '正在维护',
    retryAfter: '请大约在 {{time}} 后重试。',
    seconds: '{{count}} 秒',
    minutes: '{{count}} 分钟',
    hours: '{{count}} 小时',
  },
  ja: {
    title: '一時的に利用できません',
    body: 'Shadow のこの機能は現在メンテナンス中です。しばらくしてからもう一度お試しください。',
    retry: 'もう一度試す',
    home: 'ホームへ',
    status: 'メンテナンス中',
    retryAfter: '約 {{time}} 後にもう一度お試しください。',
    seconds: '{{count}} 秒',
    minutes: '{{count}} 分',
    hours: '{{count}} 時間',
  },
  ko: {
    title: '일시적으로 사용할 수 없습니다',
    body: '현재 Shadow의 이 기능을 점검 중입니다. 잠시 후 다시 시도해 주세요.',
    retry: '다시 시도',
    home: '홈으로',
    status: '점검 중',
    retryAfter: '약 {{time}} 후 다시 시도해 주세요.',
    seconds: '{{count}}초',
    minutes: '{{count}}분',
    hours: '{{count}}시간',
  },
})

function formatRetryTime(seconds, t) {
  const value = Math.max(0, Number(seconds) || 0)

  if (!value) return ''

  if (value < 60) {
    return t('maintenancePage.seconds', {
      count: Math.max(1, Math.ceil(value)),
    })
  }

  if (value < 3600) {
    return t('maintenancePage.minutes', {
      count: Math.max(1, Math.ceil(value / 60)),
    })
  }

  return t('maintenancePage.hours', {
    count: Math.max(1, Math.ceil(value / 3600)),
  })
}

export function isWorkCircuitOpenPayload(payload) {
  return Boolean(
    payload &&
    typeof payload === 'object' &&
    (
      payload.code === 'WORK_CIRCUIT_OPEN' ||
      payload.maintenance === true
    )
  )
}

export default function MaintenancePage({
  retryAfterSeconds = 0,
  onRetry,
  onHome,
  embedded = false,
}) {
  const { t } = useDisplayTranslation()
  const retryTime = formatRetryTime(retryAfterSeconds, t)

  const handleRetry = () => {
    if (typeof onRetry === 'function') {
      onRetry()
      return
    }

    window.location.reload()
  }

  const handleHome = () => {
    if (typeof onHome === 'function') {
      onHome()
      return
    }

    window.location.assign('/')
  }

  const content = (
    <SurfaceCard className="w-full max-w-[560px] overflow-hidden p-0 shadow-[0_20px_60px_var(--shadow-shadow)]">
      <div className="px-6 pb-7 pt-8 text-center sm:px-9 sm:pb-9 sm:pt-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-1.5 text-[11px] font-extrabold text-[var(--shadow-text-secondary)]">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          {t('maintenancePage.status')}
        </div>

        <h1 className="app-title mt-5 text-[24px] font-black leading-tight sm:text-[28px]">
          {t('maintenancePage.title')}
        </h1>

        <p className="app-muted mx-auto mt-3 max-w-[430px] text-[13px] leading-6 sm:text-[14px]">
          {t('maintenancePage.body')}
        </p>

        {retryTime ? (
          <p className="mt-3 text-[12px] font-bold text-amber-600 dark:text-amber-300">
            {t('maintenancePage.retryAfter', {
              time: retryTime,
            })}
          </p>
        ) : null}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleRetry}
            className="min-h-12 rounded-[14px] bg-[var(--shadow-text-primary)] px-5 text-[13px] font-extrabold text-[var(--shadow-bg-surface)] transition active:scale-[.98]"
          >
            {t('maintenancePage.retry')}
          </button>

          <button
            type="button"
            onClick={handleHome}
            className="min-h-12 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 text-[13px] font-extrabold text-[var(--shadow-text-primary)] transition active:scale-[.98]"
          >
            {t('maintenancePage.home')}
          </button>
        </div>
      </div>
    </SurfaceCard>
  )

  if (embedded) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        {content}
      </div>
    )
  }

  return (
    <main className="app-page flex min-h-screen items-center justify-center px-4 py-8">
      {content}
    </main>
  )
}

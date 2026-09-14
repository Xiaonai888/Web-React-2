import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorMonthlyEarningsPage', {
  en: {
    back: 'Back',
    incomeHistory: 'Income history',
    monthlyEarnings: 'Monthly Earnings',
    monthlyPaidUnlockSummary: 'Monthly paid unlock summary',
    month: 'Month',
    unlocksCount: '{{count}} unlocks',
    supportersCount: '{{count}} supporters',
    storiesCount: '{{count}} stories',
    months: 'Months',
    earned: 'Earned',
    unlocks: 'Unlocks',
    monthlyHistory: 'Monthly History',
    newestMonthFirst: 'Newest month first',
    monthsCount: '{{count}} months',
    noMonthlyEarnings: 'No monthly earnings yet',
    noMonthlyEarningsText: 'Monthly summaries will appear after readers use paid Diamonds to unlock your stories.',
    previous: 'Previous',
    pageOf: 'Page {{page}} of {{total}}',
    next: 'Next',
    loadFailed: 'Failed to load monthly earnings',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    incomeHistory: 'ប្រវត្តិចំណូល',
    monthlyEarnings: 'ចំណូលប្រចាំខែ',
    monthlyPaidUnlockSummary: 'សរុបការដោះសោបង់ប្រាក់ប្រចាំខែ',
    month: 'ខែ',
    unlocksCount: '{{count}} ការដោះសោ',
    supportersCount: '{{count}} អ្នកគាំទ្រ',
    storiesCount: '{{count}} រឿង',
    months: 'ខែ',
    earned: 'ចំណូល',
    unlocks: 'ការដោះសោ',
    monthlyHistory: 'ប្រវត្តិប្រចាំខែ',
    newestMonthFirst: 'ខែថ្មីបំផុតមុន',
    monthsCount: '{{count}} ខែ',
    noMonthlyEarnings: 'មិនទាន់មានចំណូលប្រចាំខែ',
    noMonthlyEarningsText: 'សរុបប្រចាំខែនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីអ្នកអានប្រើ Diamond បង់ប្រាក់ដើម្បីដោះសោរឿងរបស់អ្នក។',
    previous: 'មុន',
    pageOf: 'ទំព័រ {{page}} នៃ {{total}}',
    next: 'បន្ទាប់',
    loadFailed: 'មិនអាចផ្ទុកចំណូលប្រចាំខែបាន',
  },
  zh: {
    back: '返回',
    incomeHistory: '收入记录',
    monthlyEarnings: '月度收入',
    monthlyPaidUnlockSummary: '每月付费解锁汇总',
    month: '月份',
    unlocksCount: '{{count}} 次解锁',
    supportersCount: '{{count}} 位支持者',
    storiesCount: '{{count}} 个故事',
    months: '月份',
    earned: '收入',
    unlocks: '解锁',
    monthlyHistory: '月度记录',
    newestMonthFirst: '最新月份优先',
    monthsCount: '{{count}} 个月',
    noMonthlyEarnings: '暂无月度收入',
    noMonthlyEarningsText: '当读者使用付费 Diamond 解锁你的故事后，月度汇总会显示在这里。',
    previous: '上一页',
    pageOf: '第 {{page}} 页，共 {{total}} 页',
    next: '下一页',
    loadFailed: '无法加载月度收入',
  },
  ja: {
    back: '戻る',
    incomeHistory: '収益履歴',
    monthlyEarnings: '月間収益',
    monthlyPaidUnlockSummary: '月間の有料アンロック概要',
    month: '月',
    unlocksCount: '{{count}} 回のアンロック',
    supportersCount: '{{count}} 人のサポーター',
    storiesCount: '{{count}} 作品',
    months: '月数',
    earned: '収益',
    unlocks: 'アンロック',
    monthlyHistory: '月間履歴',
    newestMonthFirst: '新しい月から表示',
    monthsCount: '{{count}} か月',
    noMonthlyEarnings: '月間収益はまだありません',
    noMonthlyEarningsText: '読者が有料 Diamond で作品をアンロックすると、月間概要がここに表示されます。',
    previous: '前へ',
    pageOf: '{{page}} / {{total}} ページ',
    next: '次へ',
    loadFailed: '月間収益を読み込めませんでした',
  },
  ko: {
    back: '뒤로',
    incomeHistory: '수입 기록',
    monthlyEarnings: '월간 수입',
    monthlyPaidUnlockSummary: '월간 유료 잠금 해제 요약',
    month: '월',
    unlocksCount: '{{count}}회 잠금 해제',
    supportersCount: '후원자 {{count}}명',
    storiesCount: '스토리 {{count}}개',
    months: '개월',
    earned: '수입',
    unlocks: '잠금 해제',
    monthlyHistory: '월간 기록',
    newestMonthFirst: '최신 월부터 표시',
    monthsCount: '{{count}}개월',
    noMonthlyEarnings: '아직 월간 수입이 없습니다',
    noMonthlyEarningsText: '독자가 유료 Diamond로 스토리를 잠금 해제하면 월간 요약이 여기에 표시됩니다.',
    previous: '이전',
    pageOf: '{{page}} / {{total}} 페이지',
    next: '다음',
    loadFailed: '월간 수입을 불러오지 못했습니다',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAGE_SIZE = 20

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function numberText(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  })
}

function money(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function monthText(value) {
  const match = String(value || '').match(
    /^(\d{4})-(\d{2})$/
  )

  if (!match) return value || getDisplayText('authorMonthlyEarningsPage.month')

  const date = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      1
    )
  )

  return date.toLocaleDateString(getDisplayLanguageId(), {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  })
}

function MonthlyRow({ item }) {
  const { t } = useDisplayTranslation()

  return (
    <article className="border-b border-[var(--shadow-border)] px-4 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#b98215]">
          <i className="fa-solid fa-calendar-days text-[16px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-black text-[var(--shadow-text-primary)]">
            {monthText(item.earning_month)}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f4eef9] px-2.5 py-1 text-[9px] font-black text-[#7651ad]">
              {t('authorMonthlyEarningsPage.unlocksCount', { count: numberText(item.unlock_count) })}
            </span>
            <span className="rounded-full bg-[#fff0f5] px-2.5 py-1 text-[9px] font-black text-[#bd557e]">
              {t('authorMonthlyEarningsPage.supportersCount', { count: numberText(item.supporter_count) })}
            </span>
            <span className="rounded-full bg-[#fff7df] px-2.5 py-1 text-[9px] font-black text-[#a97818]">
              {t('authorMonthlyEarningsPage.storiesCount', { count: numberText(item.story_count) })}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[15px] font-black text-[#b9517b]">
            {money(item.total_author_usd)}
          </div>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[var(--shadow-text-secondary)]">
            <img
              src="/assets/Icons/Diamond.svg"
              alt=""
              className="h-3.5 w-3.5 object-contain"
            />
            <span>
              {numberText(item.total_author_diamonds)}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[82px] animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]"
        />
      ))}
    </div>
  )
}

export default function AuthorMonthlyEarningsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const items = Array.isArray(data?.items) ? data.items : []
  const summary = data?.summary || {}
  const pagination = data?.pagination || {}

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setMessage('')

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        })

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/monthly-earnings?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(
            result.message || getDisplayText('authorMonthlyEarningsPage.loadFailed')
          )
        }

        setData(result)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setMessage(
            error.message || getDisplayText('authorMonthlyEarningsPage.loadFailed')
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [navigate, page])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[62px] max-w-[720px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate('/author/income')}
            aria-label={t('authorMonthlyEarningsPage.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              {t('authorMonthlyEarningsPage.monthlyEarnings')}
            </h1>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.09em] text-[var(--shadow-text-tertiary)]">
              {t('authorMonthlyEarningsPage.monthlyPaidUnlockSummary')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/earnings')}
            aria-label={t('authorMonthlyEarningsPage.incomeHistory')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-clock-rotate-left text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorMonthlyEarningsPage.months')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[var(--shadow-text-primary)]">
              {numberText(summary.total_months)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorMonthlyEarningsPage.earned')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[#b9517b]">
              {money(summary.total_author_usd)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorMonthlyEarningsPage.unlocks')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[#7651ad]">
              {numberText(summary.total_unlocks)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-4 py-4">
            <div>
              <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">
                {t('authorMonthlyEarningsPage.monthlyHistory')}
              </h2>
              <p className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                {t('authorMonthlyEarningsPage.newestMonthFirst')}
              </p>
            </div>

            <span className="rounded-full bg-[#fff7df] px-3 py-1.5 text-[9px] font-black text-[#a97818]">
              {t('authorMonthlyEarningsPage.monthsCount', { count: numberText(pagination.total) })}
            </span>
          </div>

          {message ? (
            <div className="m-4 rounded-[16px] border border-[#efccd8] bg-[#fff4f7] px-4 py-3 text-[11px] font-semibold text-[#b44d76]">
              {message}
            </div>
          ) : null}

          {loading ? (
            <LoadingRows />
          ) : items.length ? (
            items.map((item) => (
              <MonthlyRow
                key={item.earning_month}
                item={item}
              />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1cb] text-[#bd8614]">
                <i className="fa-solid fa-calendar-days" />
              </div>

              <div className="mt-4 text-[14px] font-black text-[var(--shadow-text-primary)]">
                {t('authorMonthlyEarningsPage.noMonthlyEarnings')}
              </div>

              <div className="mx-auto mt-2 max-w-[290px] text-[11px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                {t('authorMonthlyEarningsPage.noMonthlyEarningsText')}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-[var(--shadow-border)] px-4 py-3">
            <button
              type="button"
              disabled={loading || !pagination.has_prev}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              {t('authorMonthlyEarningsPage.previous')}
            </button>

            <span className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">
              {t('authorMonthlyEarningsPage.pageOf', { page: numberText(pagination.page || 1), total: numberText(pagination.total_pages || 0) })}
            </span>

            <button
              type="button"
              disabled={loading || !pagination.has_next}
              onClick={() => setPage((current) => current + 1)}
              className="h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              {t('authorMonthlyEarningsPage.next')}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

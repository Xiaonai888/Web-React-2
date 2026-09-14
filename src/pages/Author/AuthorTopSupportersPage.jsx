import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorTopSupportersPage', {
  en: {
    back: 'Back',
    topSupporters: 'Top Supporters',
    monthlyRanking: 'Monthly supporter ranking',
    monthlyRankingText: 'Ranked by total paid Diamonds used to unlock your stories this month.',
    supporters: 'Supporters',
    paidDiamonds: 'Paid Diamonds',
    unlocks: 'Unlocks',
    allSupporters: 'All Supporters',
    highestPaidFirst: 'Highest paid Diamonds first',
    readersCount: '{{count}} readers',
    reader: 'Reader',
    paidUnlocks: '{{count}} paid unlocks',
    latest: 'Latest {{date}}',
    authorAmount: 'Author {{amount}}',
    noSupporters: 'No supporters this month',
    noSupportersText: 'Readers will appear here after they use paid Diamonds to unlock your stories.',
    previous: 'Previous',
    pageOf: 'Page {{page}} of {{total}}',
    next: 'Next',
    loadFailed: 'Failed to load top supporters',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    topSupporters: 'អ្នកគាំទ្រកំពូល',
    monthlyRanking: 'ចំណាត់ថ្នាក់អ្នកគាំទ្រប្រចាំខែ',
    monthlyRankingText: 'ចំណាត់ថ្នាក់ផ្អែកលើ Diamond បង់ប្រាក់សរុបដែលប្រើដើម្បីដោះសោរឿងរបស់អ្នកក្នុងខែនេះ។',
    supporters: 'អ្នកគាំទ្រ',
    paidDiamonds: 'Diamond បង់ប្រាក់',
    unlocks: 'ការដោះសោ',
    allSupporters: 'អ្នកគាំទ្រទាំងអស់',
    highestPaidFirst: 'Diamond បង់ប្រាក់ខ្ពស់បំផុតមុន',
    readersCount: '{{count}} អ្នកអាន',
    reader: 'អ្នកអាន',
    paidUnlocks: '{{count}} ការដោះសោបង់ប្រាក់',
    latest: 'ចុងក្រោយ {{date}}',
    authorAmount: 'អ្នកនិពន្ធ {{amount}}',
    noSupporters: 'មិនទាន់មានអ្នកគាំទ្រក្នុងខែនេះ',
    noSupportersText: 'អ្នកអាននឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីពួកគេប្រើ Diamond បង់ប្រាក់ដើម្បីដោះសោរឿងរបស់អ្នក។',
    previous: 'មុន',
    pageOf: 'ទំព័រ {{page}} នៃ {{total}}',
    next: 'បន្ទាប់',
    loadFailed: 'មិនអាចផ្ទុកអ្នកគាំទ្រកំពូលបាន',
  },
  zh: {
    back: '返回',
    topSupporters: '顶级支持者',
    monthlyRanking: '月度支持者排行',
    monthlyRankingText: '按本月用于解锁你故事的付费 Diamond 总数排名。',
    supporters: '支持者',
    paidDiamonds: '付费 Diamond',
    unlocks: '解锁',
    allSupporters: '所有支持者',
    highestPaidFirst: '付费 Diamond 最高优先',
    readersCount: '{{count}} 位读者',
    reader: '读者',
    paidUnlocks: '{{count}} 次付费解锁',
    latest: '最近 {{date}}',
    authorAmount: '作者 {{amount}}',
    noSupporters: '本月暂无支持者',
    noSupportersText: '当读者使用付费 Diamond 解锁你的故事后，他们会显示在这里。',
    previous: '上一页',
    pageOf: '第 {{page}} 页，共 {{total}} 页',
    next: '下一页',
    loadFailed: '无法加载顶级支持者',
  },
  ja: {
    back: '戻る',
    topSupporters: 'トップサポーター',
    monthlyRanking: '月間サポーターランキング',
    monthlyRankingText: '今月、作品のアンロックに使われた有料 Diamond の合計で順位付けします。',
    supporters: 'サポーター',
    paidDiamonds: '有料 Diamond',
    unlocks: 'アンロック',
    allSupporters: 'すべてのサポーター',
    highestPaidFirst: '有料 Diamond が多い順',
    readersCount: '{{count}} 人の読者',
    reader: '読者',
    paidUnlocks: '{{count}} 回の有料アンロック',
    latest: '最新 {{date}}',
    authorAmount: '作者 {{amount}}',
    noSupporters: '今月のサポーターはまだいません',
    noSupportersText: '読者が有料 Diamond で作品をアンロックすると、ここに表示されます。',
    previous: '前へ',
    pageOf: '{{page}} / {{total}} ページ',
    next: '次へ',
    loadFailed: 'トップサポーターを読み込めませんでした',
  },
  ko: {
    back: '뒤로',
    topSupporters: '최고 후원자',
    monthlyRanking: '월간 후원자 순위',
    monthlyRankingText: '이번 달 스토리 잠금 해제에 사용된 유료 Diamond 총액으로 순위를 정합니다.',
    supporters: '후원자',
    paidDiamonds: '유료 Diamond',
    unlocks: '잠금 해제',
    allSupporters: '모든 후원자',
    highestPaidFirst: '유료 Diamond가 많은 순',
    readersCount: '독자 {{count}}명',
    reader: '독자',
    paidUnlocks: '유료 잠금 해제 {{count}}회',
    latest: '최근 {{date}}',
    authorAmount: '작가 {{amount}}',
    noSupporters: '이번 달 후원자가 아직 없습니다',
    noSupportersText: '독자가 유료 Diamond로 스토리를 잠금 해제하면 여기에 표시됩니다.',
    previous: '이전',
    pageOf: '{{page}} / {{total}} 페이지',
    next: '다음',
    loadFailed: '최고 후원자를 불러오지 못했습니다',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000
const PAGE_SIZE = 20

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function monthLabel() {
  const date = new Date(Date.now() + CAMBODIA_OFFSET_MS)

  return date.toLocaleDateString(getDisplayLanguageId(), {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  })
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

function dateText(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function initial(value) {
  return String(value || 'R')
    .trim()
    .slice(0, 1)
    .toUpperCase() || 'R'
}

function SupporterAvatar({ item }) {
  if (item.reader_avatar_url) {
    return (
      <img
        src={item.reader_avatar_url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffe8f1] text-[15px] font-black text-[#bd557e]">
      {initial(item.reader_name)}
    </div>
  )
}

function SupporterRow({ item }) {
  const { t } = useDisplayTranslation()

  return (
    <article className="flex gap-3 border-b border-[var(--shadow-border)] px-4 py-4 last:border-b-0">
      <div className="flex w-8 shrink-0 items-start justify-center pt-2">
        <span className="text-[13px] font-black text-[#7651ad]">
          #{item.rank}
        </span>
      </div>

      <SupporterAvatar item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
          {item.reader_name || t('authorTopSupportersPage.reader')}
        </div>

        {item.reader_username ? (
          <div className="mt-1 line-clamp-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
            @{item.reader_username}
          </div>
        ) : null}

        <div className="mt-1.5 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
          {t('authorTopSupportersPage.paidUnlocks', { count: numberText(item.unlock_count) })}
        </div>

        <div className="mt-1 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
          {t('authorTopSupportersPage.latest', { date: dateText(item.latest_support_at) })}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1 text-[14px] font-black text-[#7651ad]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-4 w-4 object-contain"
          />
          <span>{numberText(item.total_paid_diamonds)}</span>
        </div>

        <div className="mt-1 text-[10px] font-bold text-[#b9517b]">
          {t('authorTopSupportersPage.authorAmount', { amount: money(item.total_author_usd) })}
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
          className="h-[78px] animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]"
        />
      ))}
    </div>
  )
}

export default function AuthorTopSupportersPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const currentMonth = useMemo(() => monthLabel(), [])

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
          `${API_BASE_URL}/api/authors/me/top-supporters?${params.toString()}`,
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
            result.message || getDisplayText('authorTopSupportersPage.loadFailed')
          )
        }

        setData(result)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setMessage(
            error.message || getDisplayText('authorTopSupportersPage.loadFailed')
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
            aria-label={t('authorTopSupportersPage.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              {t('authorTopSupportersPage.topSupporters')}
            </h1>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.09em] text-[var(--shadow-text-tertiary)]">
              {currentMonth}
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        <section className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#ffe4ef] text-[#d56894]">
              <i className="fa-solid fa-heart text-[15px]" />
            </span>

            <div>
              <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">
                {t('authorTopSupportersPage.monthlyRanking')}
              </h2>
              <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorTopSupportersPage.monthlyRankingText')}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorTopSupportersPage.supporters')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[var(--shadow-text-primary)]">
              {numberText(summary.total_supporters)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorTopSupportersPage.paidDiamonds')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[#7651ad]">
              {numberText(summary.total_paid_diamonds)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorTopSupportersPage.unlocks')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[#b9517b]">
              {numberText(summary.total_unlocks)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-4 py-4">
            <div>
              <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">
                {t('authorTopSupportersPage.allSupporters')}
              </h2>
              <p className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                {t('authorTopSupportersPage.highestPaidFirst')}
              </p>
            </div>

            <span className="rounded-full bg-[#fff0f5] px-3 py-1.5 text-[9px] font-black text-[#bd557e]">
              {t('authorTopSupportersPage.readersCount', { count: numberText(pagination.total) })}
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
              <SupporterRow key={item.reader_id} item={item} />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe8f1] text-[#d56894]">
                <i className="fa-solid fa-users" />
              </div>
              <div className="mt-4 text-[14px] font-black text-[var(--shadow-text-primary)]">
                {t('authorTopSupportersPage.noSupporters')}
              </div>
              <div className="mx-auto mt-2 max-w-[290px] text-[11px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                {t('authorTopSupportersPage.noSupportersText')}
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
              {t('authorTopSupportersPage.previous')}
            </button>

            <span className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">
              {t('authorTopSupportersPage.pageOf', { page: numberText(pagination.page || 1), total: numberText(pagination.total_pages || 0) })}
            </span>

            <button
              type="button"
              disabled={loading || !pagination.has_next}
              onClick={() => setPage((current) => current + 1)}
              className="h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              {t('authorTopSupportersPage.next')}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

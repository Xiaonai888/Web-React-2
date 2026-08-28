import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('walletOrderHistoryPage', {
  en: {
    all: 'All',
    success: 'Success',
    waiting: 'Waiting',
    review: 'Review',
    rejected: 'Rejected',
    expired: 'Expired',
    cancelled: 'Cancelled',
    unknown: 'Unknown',
    diamonds: '{{count}} Diamonds',
    bonusGems: 'Bonus {{count}} Gems',
    orderId: 'Order ID',
    trxId: 'Trx ID',
    created: 'Created',
    loadFailed: 'Failed to load order history.',
    goBack: 'Go back',
    title: 'Order History',
    subtitle: 'View your past purchases and their current status.',
    searchPlaceholder: 'Search by Order ID or Trx ID',
    clearSearch: 'Clear search',
    searchOrders: 'Search orders',
    loading: 'Loading order history...',
    empty: 'No order history found.',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pageOf: 'Page {{page}} of {{totalPages}}',
    total: '{{count}} total',
    retention: 'History is kept for 1 year.',
  },
  km: {
    all: 'ទាំងអស់',
    success: 'ជោគជ័យ',
    waiting: 'កំពុងរង់ចាំ',
    review: 'កំពុងពិនិត្យ',
    rejected: 'បានបដិសេធ',
    expired: 'ផុតកំណត់',
    cancelled: 'បានបោះបង់',
    unknown: 'មិនស្គាល់',
    diamonds: '{{count}} Diamonds',
    bonusGems: 'Bonus {{count}} Gems',
    orderId: 'លេខ Order',
    trxId: 'លេខប្រតិបត្តិការ',
    created: 'បានបង្កើត',
    loadFailed: 'មិនអាចផ្ទុកប្រវត្តិការបញ្ជាទិញបានទេ។',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'ប្រវត្តិការបញ្ជាទិញ',
    subtitle: 'មើលការទិញពីមុន និងស្ថានភាពបច្ចុប្បន្នរបស់វា។',
    searchPlaceholder: 'ស្វែងរកតាម Order ID ឬ Trx ID',
    clearSearch: 'សម្អាតការស្វែងរក',
    searchOrders: 'ស្វែងរកការបញ្ជាទិញ',
    loading: 'កំពុងផ្ទុកប្រវត្តិការបញ្ជាទិញ...',
    empty: 'រកមិនឃើញប្រវត្តិការបញ្ជាទិញ។',
    previousPage: 'ទំព័រមុន',
    nextPage: 'ទំព័របន្ទាប់',
    pageOf: 'ទំព័រ {{page}} នៃ {{totalPages}}',
    total: 'សរុប {{count}}',
    retention: 'ប្រវត្តិត្រូវបានរក្សាទុករយៈពេល 1 ឆ្នាំ។',
  },
  zh: {
    all: '全部',
    success: '成功',
    waiting: '等待中',
    review: '审核中',
    rejected: '已拒绝',
    expired: '已过期',
    cancelled: '已取消',
    unknown: '未知',
    diamonds: '{{count}} Diamonds',
    bonusGems: 'Bonus {{count}} Gems',
    orderId: '订单 ID',
    trxId: '交易 ID',
    created: '创建时间',
    loadFailed: '无法加载订单历史。',
    goBack: '返回',
    title: '订单历史',
    subtitle: '查看过去的购买记录及其当前状态。',
    searchPlaceholder: '按订单 ID 或交易 ID 搜索',
    clearSearch: '清除搜索',
    searchOrders: '搜索订单',
    loading: '正在加载订单历史...',
    empty: '未找到订单历史。',
    previousPage: '上一页',
    nextPage: '下一页',
    pageOf: '第 {{page}} 页，共 {{totalPages}} 页',
    total: '共 {{count}} 条',
    retention: '历史记录保留 1 年。',
  },
  ja: {
    all: 'すべて',
    success: '成功',
    waiting: '待機中',
    review: '審査中',
    rejected: '拒否',
    expired: '期限切れ',
    cancelled: 'キャンセル済み',
    unknown: '不明',
    diamonds: '{{count}} Diamonds',
    bonusGems: 'Bonus {{count}} Gems',
    orderId: '注文 ID',
    trxId: '取引 ID',
    created: '作成日時',
    loadFailed: '注文履歴を読み込めませんでした。',
    goBack: '戻る',
    title: '注文履歴',
    subtitle: '過去の購入と現在のステータスを確認できます。',
    searchPlaceholder: '注文 ID または取引 ID で検索',
    clearSearch: '検索をクリア',
    searchOrders: '注文を検索',
    loading: '注文履歴を読み込み中...',
    empty: '注文履歴が見つかりません。',
    previousPage: '前のページ',
    nextPage: '次のページ',
    pageOf: '{{page}} / {{totalPages}} ページ',
    total: '合計 {{count}} 件',
    retention: '履歴は1年間保存されます。',
  },
  ko: {
    all: '전체',
    success: '성공',
    waiting: '대기 중',
    review: '검토 중',
    rejected: '거절됨',
    expired: '만료됨',
    cancelled: '취소됨',
    unknown: '알 수 없음',
    diamonds: '{{count}} Diamonds',
    bonusGems: 'Bonus {{count}} Gems',
    orderId: '주문 ID',
    trxId: '거래 ID',
    created: '생성일',
    loadFailed: '주문 내역을 불러오지 못했습니다.',
    goBack: '뒤로 가기',
    title: '주문 내역',
    subtitle: '이전 구매 내역과 현재 상태를 확인하세요.',
    searchPlaceholder: '주문 ID 또는 거래 ID로 검색',
    clearSearch: '검색 지우기',
    searchOrders: '주문 검색',
    loading: '주문 내역을 불러오는 중...',
    empty: '주문 내역을 찾을 수 없습니다.',
    previousPage: '이전 페이지',
    nextPage: '다음 페이지',
    pageOf: '{{page}} / {{totalPages}} 페이지',
    total: '총 {{count}}건',
    retention: '내역은 1년간 보관됩니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PAGE_SIZE = 20

const FILTER_TABS = [
  ['all', 'All'],
  ['success', 'Success'],
  ['waiting_payment', 'Waiting'],
  ['pending_review', 'Review'],
  ['rejected', 'Rejected'],
]

const FILTER_LABEL_KEYS = {
  all: 'all',
  success: 'success',
  waiting_payment: 'waiting',
  pending_review: 'review',
  rejected: 'rejected',
}

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function formatDateParts(value, language) {
  if (!value) return { date: '-', time: '' }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return { date: '-', time: '' }

  const locale = DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en

  return {
    date: date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }),
  }
}

function FilterIcon({ type }) {
  if (type === 'success') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'waiting_payment') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'pending_review') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <path d="M3.5 12s3.1-5 8.5-5 8.5 5 8.5 5-3.1 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (type === 'rejected') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m9 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <path d="m5 8 7-3.5L19 8l-7 3.5L5 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m5 12 7 3.5 7-3.5M5 16l7 3.5 7-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusBadge({ status }) {
  const { t } = useDisplayTranslation()
  const value = String(status || '').toLowerCase()

  const config = {
    success: {
      label: t('walletOrderHistoryPage.success'),
      tone: 'bg-[#ECFDF3] text-[#16A34A] ring-[#BBF7D0] dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
      icon: 'success',
    },
    waiting_payment: {
      label: t('walletOrderHistoryPage.waiting'),
      tone: 'bg-[#FFF8EB] text-[#E98200] ring-[#FED7AA] dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
      icon: 'waiting_payment',
    },
    pending_review: {
      label: t('walletOrderHistoryPage.review'),
      tone: 'bg-[#EFF6FF] text-[#2563EB] ring-[#BFDBFE] dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20',
      icon: 'pending_review',
    },
    expired: {
      label: t('walletOrderHistoryPage.expired'),
      tone: 'bg-[#FFF1F2] text-[#EF4444] ring-[#FECACA] dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
      icon: 'rejected',
    },
    cancelled: {
      label: t('walletOrderHistoryPage.cancelled'),
      tone: 'bg-[#FFF1F2] text-[#EF4444] ring-[#FECACA] dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
      icon: 'rejected',
    },
    rejected: {
      label: t('walletOrderHistoryPage.rejected'),
      tone: 'bg-[#FFF1F2] text-[#EF4444] ring-[#FECACA] dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
      icon: 'rejected',
    },
  }

  const current = config[value] || {
    label: value || t('walletOrderHistoryPage.unknown'),
    tone: 'bg-[#F8FAFC] text-[#64748B] ring-[#E2E8F0] dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20',
    icon: 'pending_review',
  }

  return (
    <span className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold ring-1 ${current.tone}`}>
      <FilterIcon type={current.icon} />
      {current.label}
    </span>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SubmitFilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <path d="M4 5h16l-6.2 7.1v5.4l-3.6 1.8v-7.2L4 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none" aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5V8M16 3.5V8M4 10h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
      <path d="M12 3.5 19 6v5.3c0 4.3-2.7 7.7-7 9.2-4.3-1.5-7-4.9-7-9.2V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9.2 12 1.8 1.8 3.8-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrderCard({ item }) {
  const { language, t } = useDisplayTranslation()
  const created = formatDateParts(item.created_at, language)
  const transactionId = item.aba_trx_id || item.aba_transaction_id || '-'

  return (
    <article className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EAF5FF] dark:bg-blue-500/10">
          <img src="/assets/Icons/Diamond.svg" alt="" className="h-9 w-9 object-contain" />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold leading-6 text-[var(--shadow-text-primary)]">
                {t('walletOrderHistoryPage.diamonds', {
                  count: formatNumber(item.diamonds),
                })}
              </h2>
              <p className="mt-0.5 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
                {formatMoney(item.amount_usd)} <span className="px-1">·</span>{' '}
                {t('walletOrderHistoryPage.bonusGems', {
                  count: formatNumber(item.bonus_gems),
                })}
              </p>
            </div>

            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-[var(--shadow-border)]" />

      <div className="grid grid-cols-[1.25fr_0.85fr_1fr] divide-x divide-[var(--shadow-border)]">
        <div className="min-w-0 pr-3">
          <p className="text-[11px] font-normal text-[var(--shadow-text-secondary)]">
            {t('walletOrderHistoryPage.orderId')}
          </p>
          <p className="mt-1 break-all text-[10px] font-medium leading-4 text-[var(--shadow-text-primary)]">
            {item.order_id || '-'}
          </p>
        </div>

        <div className="min-w-0 px-3">
          <p className="text-[11px] font-normal text-[var(--shadow-text-secondary)]">
            {t('walletOrderHistoryPage.trxId')}
          </p>
          <p className="mt-1 break-all text-[10px] font-medium leading-4 text-[var(--shadow-text-primary)]">
            {transactionId}
          </p>
        </div>

        <div className="min-w-0 pl-3">
          <p className="flex items-center gap-1 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
            <CalendarIcon />
            {t('walletOrderHistoryPage.created')}
          </p>
          <p className="mt-1 text-[10px] font-medium leading-4 text-[var(--shadow-text-secondary)]">
            {created.date}
          </p>
          {created.time ? (
            <p className="text-[10px] font-medium leading-4 text-[var(--shadow-text-secondary)]">
              {created.time}
            </p>
          ) : null}
        </div>
      </div>

      {item.match_reason ? (
        <p className="mt-4 rounded-[12px] bg-[var(--shadow-bg-soft)] px-3 py-2 text-[11px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
          {item.match_reason}
        </p>
      ) : null}
    </article>
  )
}

export default function WalletOrderHistoryPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  async function loadOrders(nextPage = page, nextStatus = status, nextSearch = search) {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
        status: nextStatus,
        q: nextSearch,
      })

      const response = await fetch(`${API_BASE_URL}/api/purchase/requests?${params.toString()}`, {
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('walletOrderHistoryPage.loadFailed'))
      }

      setOrders(Array.isArray(data.purchases) ? data.purchases : [])
      setPage(Number(data.page || nextPage))
      setTotal(Number(data.total || 0))
      setTotalPages(Number(data.total_pages || 1))
      setHasNext(Boolean(data.has_next))
      setHasPrev(Boolean(data.has_prev))
    } catch (error) {
      setMessage(error.message || t('walletOrderHistoryPage.loadFailed'))
      setOrders([])
      setTotal(0)
      setTotalPages(1)
      setHasNext(false)
      setHasPrev(false)
    } finally {
      setLoading(false)
    }
  }

  function changeStatus(nextStatus) {
    setStatus(nextStatus)
    setPage(1)
    loadOrders(1, nextStatus, search)
  }

  function submitSearch(event) {
    event.preventDefault()
    const nextSearch = searchInput.trim()
    setSearch(nextSearch)
    setPage(1)
    loadOrders(1, status, nextSearch)
  }

  function clearSearch() {
    setSearchInput('')
    setSearch('')
    setPage(1)
    loadOrders(1, status, '')
  }

  function goPage(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages)
    setPage(safePage)
    loadOrders(safePage, status, search)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    loadOrders(1, 'all', '')
  }, [])

  return (
    <div className="app-page min-h-screen pb-8">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)]">
        <div className="mx-auto flex h-14 max-w-[760px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('walletOrderHistoryPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px] text-[var(--shadow-text-primary)]" />
          </button>

          <h1 className="text-[18px] font-bold tracking-tight text-[var(--shadow-text-primary)]">
            {t('walletOrderHistoryPage.title')}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pb-4 pt-5">
        <div className="mb-5 flex items-center gap-3 text-[var(--shadow-text-secondary)]">
          <span className="text-[#6366F1]">
            <ShieldIcon />
          </span>
          <p className="text-[13px] font-normal">
            {t('walletOrderHistoryPage.subtitle')}
          </p>
        </div>

        <section className="mb-5 grid grid-cols-5 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-2">
          {FILTER_TABS.map(([key, label]) => {
            const active = status === key
            const tone =
              key === 'success'
                ? 'text-[#22C55E]'
                : key === 'waiting_payment'
                  ? 'text-[#F59E0B]'
                  : key === 'pending_review'
                    ? 'text-[#3B82F6]'
                    : key === 'rejected'
                      ? 'text-[#EF4444]'
                      : 'text-[#6366F1]'

            return (
              <button
                key={key}
                type="button"
                onClick={() => changeStatus(key)}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[15px] px-1 py-2.5 active:scale-[0.98] ${
                  active ? 'bg-[#F0EEFF] dark:bg-violet-500/15' : 'bg-transparent'
                }`}
              >
                <span className={tone}>
                  <FilterIcon type={key} />
                </span>
                <span className={`text-[11px] font-medium ${active ? 'text-[#5B4FD8] dark:text-violet-300' : 'text-[var(--shadow-text-secondary)]'}`}>
                  {t(`walletOrderHistoryPage.${FILTER_LABEL_KEYS[key]}`)}
                </span>
              </button>
            )
          })}
        </section>

        <form onSubmit={submitSearch} className="mb-5 flex gap-2">
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[var(--shadow-text-tertiary)]">
            <SearchIcon />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('walletOrderHistoryPage.searchPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-[13px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={clearSearch}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]"
                aria-label={t('walletOrderHistoryPage.clearSearch')}
              >
                <i className="fas fa-times text-[11px]" />
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] active:scale-[0.98]"
            aria-label={t('walletOrderHistoryPage.searchOrders')}
          >
            <SubmitFilterIcon />
          </button>
        </form>

        {message ? (
          <p className="mb-4 rounded-[16px] bg-[#FFF1F2] p-3 text-center text-[12px] font-medium text-[#DC2626] dark:bg-red-500/10 dark:text-red-300">
            {message}
          </p>
        ) : null}

        <div className="space-y-3">
          {loading ? (
            <p className="rounded-[20px] bg-[var(--shadow-bg-soft)] p-5 text-center text-[12px] font-medium text-[var(--shadow-text-secondary)]">
              {t('walletOrderHistoryPage.loading')}
            </p>
          ) : orders.length ? (
            orders.map((item) => (
              <OrderCard key={item.id || item.order_id} item={item} />
            ))
          ) : (
            <p className="rounded-[20px] bg-[var(--shadow-bg-soft)] p-5 text-center text-[12px] font-medium text-[var(--shadow-text-secondary)]">
              {t('walletOrderHistoryPage.empty')}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!hasPrev || loading}
            onClick={() => goPage(page - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F5F3FF] text-[#6D28D9] disabled:opacity-35 dark:bg-violet-500/15 dark:text-violet-300"
            aria-label={t('walletOrderHistoryPage.previousPage')}
          >
            <i className="fas fa-chevron-left text-[13px]" />
          </button>

          <p className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">
            {t('walletOrderHistoryPage.pageOf', {
              page,
              totalPages,
            })}
            {total
              ? ` · ${t('walletOrderHistoryPage.total', {
                  count: total,
                })}`
              : ''}
          </p>

          <button
            type="button"
            disabled={!hasNext || loading}
            onClick={() => goPage(page + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F5F3FF] text-[#6D28D9] disabled:opacity-35 dark:bg-violet-500/15 dark:text-violet-300"
            aria-label={t('walletOrderHistoryPage.nextPage')}
          >
            <i className="fas fa-chevron-right text-[13px]" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[var(--shadow-text-tertiary)]">
          <i className="fas fa-lock text-[10px]" />
          <p className="text-[11px] font-normal">
            {t('walletOrderHistoryPage.retention')}
          </p>
        </div>
      </main>
    </div>
  )
}

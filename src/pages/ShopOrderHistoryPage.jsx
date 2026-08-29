import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shopOrderHistoryPage', {
  en: {
    success: 'Success',
    waiting: 'Waiting',
    review: 'Review',
    expired: 'Expired',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    unknown: 'Unknown',
    loadFailed: 'Failed to load order history.',
    goBack: 'Go back',
    orderHistory: 'Order History',
    purchaseRecords: 'Purchase Records',
    supportHelper: 'Use Order ID or Trx ID when contacting support.',
    searchPlaceholder: 'Search Order ID or Trx ID...',
    all: 'All',
    loading: 'Loading order history...',
    diamonds: '{{count}} Diamonds',
    amountBonus: '{{amount}} · Bonus {{count}} Gems',
    orderId: 'Order ID: {{value}}',
    trxId: 'Trx ID: {{value}}',
    created: 'Created: {{value}}',
    empty: 'No order history found.',
  },
  km: {
    success: 'ជោគជ័យ',
    waiting: 'កំពុងរង់ចាំ',
    review: 'កំពុងពិនិត្យ',
    expired: 'ផុតកំណត់',
    cancelled: 'បានបោះបង់',
    rejected: 'បានបដិសេធ',
    unknown: 'មិនស្គាល់',
    loadFailed: 'មិនអាចផ្ទុកប្រវត្តិការបញ្ជាទិញបានទេ។',
    goBack: 'ត្រឡប់ក្រោយ',
    orderHistory: 'ប្រវត្តិការបញ្ជាទិញ',
    purchaseRecords: 'កំណត់ត្រាការទិញ',
    supportHelper: 'ប្រើ Order ID ឬ Trx ID នៅពេលទាក់ទងផ្នែកជំនួយ។',
    searchPlaceholder: 'ស្វែងរក Order ID ឬ Trx ID...',
    all: 'ទាំងអស់',
    loading: 'កំពុងផ្ទុកប្រវត្តិការបញ្ជាទិញ...',
    diamonds: '{{count}} Diamonds',
    amountBonus: '{{amount}} · បន្ថែម {{count}} Gems',
    orderId: 'Order ID៖ {{value}}',
    trxId: 'Trx ID៖ {{value}}',
    created: 'បានបង្កើត៖ {{value}}',
    empty: 'រកមិនឃើញប្រវត្តិការបញ្ជាទិញទេ។',
  },
  zh: {
    success: '成功',
    waiting: '等待中',
    review: '审核中',
    expired: '已过期',
    cancelled: '已取消',
    rejected: '已拒绝',
    unknown: '未知',
    loadFailed: '无法加载订单历史。',
    goBack: '返回',
    orderHistory: '订单历史',
    purchaseRecords: '购买记录',
    supportHelper: '联系支持时请使用 Order ID 或 Trx ID。',
    searchPlaceholder: '搜索 Order ID 或 Trx ID...',
    all: '全部',
    loading: '正在加载订单历史...',
    diamonds: '{{count}} Diamonds',
    amountBonus: '{{amount}} · 赠送 {{count}} Gems',
    orderId: 'Order ID：{{value}}',
    trxId: 'Trx ID：{{value}}',
    created: '创建时间：{{value}}',
    empty: '未找到订单历史。',
  },
  ja: {
    success: '成功',
    waiting: '支払い待ち',
    review: '確認中',
    expired: '期限切れ',
    cancelled: 'キャンセル済み',
    rejected: '却下',
    unknown: '不明',
    loadFailed: '注文履歴を読み込めませんでした。',
    goBack: '戻る',
    orderHistory: '注文履歴',
    purchaseRecords: '購入記録',
    supportHelper: 'サポートへ連絡する際は Order ID または Trx ID を使用してください。',
    searchPlaceholder: 'Order ID または Trx ID を検索...',
    all: 'すべて',
    loading: '注文履歴を読み込み中...',
    diamonds: '{{count}} Diamonds',
    amountBonus: '{{amount}} · ボーナス {{count}} Gems',
    orderId: 'Order ID：{{value}}',
    trxId: 'Trx ID：{{value}}',
    created: '作成日時：{{value}}',
    empty: '注文履歴が見つかりません。',
  },
  ko: {
    success: '성공',
    waiting: '대기 중',
    review: '검토 중',
    expired: '만료됨',
    cancelled: '취소됨',
    rejected: '거부됨',
    unknown: '알 수 없음',
    loadFailed: '주문 내역을 불러오지 못했습니다.',
    goBack: '뒤로 가기',
    orderHistory: '주문 내역',
    purchaseRecords: '구매 기록',
    supportHelper: '지원팀에 문의할 때 Order ID 또는 Trx ID를 사용하세요.',
    searchPlaceholder: 'Order ID 또는 Trx ID 검색...',
    all: '전체',
    loading: '주문 내역을 불러오는 중...',
    diamonds: '{{count}} Diamonds',
    amountBonus: '{{amount}} · 보너스 {{count}} Gems',
    orderId: 'Order ID: {{value}}',
    trxId: 'Trx ID: {{value}}',
    created: '생성일: {{value}}',
    empty: '주문 내역이 없습니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

const STATUS_FILTERS = [
  ['all', 'all'],
  ['success', 'success'],
  ['waiting_payment', 'waiting'],
  ['pending_review', 'review'],
  ['rejected', 'rejected'],
  ['expired', 'expired'],
]

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function formatNumber(value, language) {
  return Number(value || 0).toLocaleString(DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en)
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function formatDate(value, language) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString(DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en)
}

function StatusBadge({ status }) {
  const { t } = useDisplayTranslation()
  const value = String(status || '').toLowerCase()

  const labelKeyMap = {
    success: 'success',
    waiting_payment: 'waiting',
    pending_review: 'review',
    expired: 'expired',
    cancelled: 'cancelled',
    rejected: 'rejected',
  }

  const tone = value === 'success'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
    : value === 'pending_review'
      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20'
      : value === 'waiting_payment'
        ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-[var(--shadow-text-secondary)] dark:border-[var(--shadow-border)]'
        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20'

  const labelKey = labelKeyMap[value]

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${tone}`}>
      {labelKey
        ? t(`shopOrderHistoryPage.${labelKey}`)
        : value || t('shopOrderHistoryPage.unknown')}
    </span>
  )
}

export default function ShopOrderHistoryPage() {
  const navigate = useNavigate()
  const { language, t } = useDisplayTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return orders.filter((item) => {
      const currentStatus = String(item.status || '').toLowerCase()
      const matchesStatus = status === 'all' || currentStatus === status
      const matchesSearch = !keyword || [
        item.order_id,
        item.aba_trx_id,
        item.amount_usd,
        item.diamonds,
        item.status,
        item.match_reason,
      ].filter(Boolean).join(' ').toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
  }, [orders, status, search])

  async function loadOrders() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/purchase/requests`, {
        headers: getHeaders(),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('shopOrderHistoryPage.loadFailed'))
      }

      setOrders(Array.isArray(data.purchases) ? data.purchases : [])
    } catch (error) {
      setMessage(error.message || t('shopOrderHistoryPage.loadFailed'))
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div className="app-page min-h-screen bg-white pb-8 dark:bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[var(--shadow-bg-hover)]"
            aria-label={t('shopOrderHistoryPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700 dark:text-[var(--shadow-text-primary)]" />
          </button>

          <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900 dark:text-[var(--shadow-text-primary)]">
            {t('shopOrderHistoryPage.orderHistory')}
          </h1>
        </div>
      </header>

      <main className="px-4 pt-4">
        <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_6px_16px_rgba(17,17,17,0.035)] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-surface)]">
          <div className="mb-4">
            <h2 className="text-[20px] font-black text-[#111111] dark:text-[var(--shadow-text-primary)]">
              {t('shopOrderHistoryPage.purchaseRecords')}
            </h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6B7280] dark:text-[var(--shadow-text-secondary)]">
              {t('shopOrderHistoryPage.supportHelper')}
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('shopOrderHistoryPage.searchPlaceholder')}
            className="mb-3 h-11 w-full rounded-[16px] border border-[#E5E7EB] bg-[#F8F8F8] px-4 text-[13px] font-bold text-[#111111] outline-none focus:border-[#111111] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:border-[var(--shadow-border-strong)]"
          />

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STATUS_FILTERS.map(([key, labelKey]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatus(key)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-black ${
                  status === key
                    ? 'border-[#111111] bg-[#111111] text-white dark:border-[var(--shadow-text-primary)] dark:bg-[var(--shadow-text-primary)] dark:text-[var(--shadow-bg-page)]'
                    : 'border-[#E5E7EB] bg-white text-[#6B7280] dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]'
                }`}
              >
                {t(`shopOrderHistoryPage.${labelKey}`)}
              </button>
            ))}
          </div>

          {message ? (
            <p className="mb-3 rounded-[16px] bg-red-50 p-3 text-center text-[12px] font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {message}
            </p>
          ) : null}

          <div className="space-y-3">
            {loading ? (
              <p className="rounded-[18px] bg-[#F8F8F8] p-4 text-center text-[12px] font-bold text-[#6B7280] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
                {t('shopOrderHistoryPage.loading')}
              </p>
            ) : filteredOrders.length ? (
              filteredOrders.map((item) => (
                <div
                  key={item.id || item.order_id}
                  className="rounded-[18px] border border-[#E5E7EB] bg-[#F8F8F8] p-4 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-black text-[#111111] dark:text-[var(--shadow-text-primary)]">
                        {t('shopOrderHistoryPage.diamonds', {
                          count: formatNumber(item.diamonds, language),
                        })}
                      </p>
                      <p className="mt-1 text-[12px] font-bold text-[#6B7280] dark:text-[var(--shadow-text-secondary)]">
                        {t('shopOrderHistoryPage.amountBonus', {
                          amount: formatMoney(item.amount_usd),
                          count: formatNumber(item.bonus_gems, language),
                        })}
                      </p>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] font-bold leading-5 text-[#6B7280] dark:text-[var(--shadow-text-secondary)]">
                    <p className="break-all">
                      {t('shopOrderHistoryPage.orderId', {
                        value: item.order_id || '-',
                      })}
                    </p>
                    <p className="break-all">
                      {t('shopOrderHistoryPage.trxId', {
                        value: item.aba_trx_id || '-',
                      })}
                    </p>
                    <p>
                      {t('shopOrderHistoryPage.created', {
                        value: formatDate(item.created_at, language),
                      })}
                    </p>
                    {item.match_reason ? <p>{item.match_reason}</p> : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-[18px] bg-[#F8F8F8] p-4 text-center text-[12px] font-bold text-[#6B7280] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]">
                {t('shopOrderHistoryPage.empty')}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

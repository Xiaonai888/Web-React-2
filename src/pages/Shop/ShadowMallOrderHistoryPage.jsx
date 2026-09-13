import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallOrderHistoryPage', {
  en: { "all": "All", "waiting": "Waiting", "review": "Review", "confirmed": "Confirmed", "preparing": "Preparing", "shipped": "Shipped", "completed": "Completed", "cancelled": "Cancelled", "rejected": "Rejected", "amountMismatch": "Amount mismatch", "book": "Book", "mallBooks": "Shadow Mall books", "orderId": "Order ID", "total": "Total", "delivery": "Delivery", "transaction": "Transaction", "itemsQty": "{{items}} item(s) · Qty {{qty}}", "loginRequired": "Please login to view your order history.", "failedLoad": "Failed to load order history", "noOrders": "No orders", "oneOrder": "1 order", "manyOrders": "{{count}} orders", "goBack": "Go back", "title": "Order History", "recent90": "Recent orders from the last 90 days.", "refresh": "Refresh orders", "searchPlaceholder": "Search Order ID or Transaction ID", "clearSearch": "Clear search", "noOrdersYet": "No orders yet", "noOrdersBody": "{t('shadowMallOrderHistoryPage.noOrdersBody')}", "backShop": "Back to Shop", "previous": "Previous", "pageOf": "Page {{page}} / {{total}}", "next": "Next" },
  km: { "all": "ទាំងអស់", "waiting": "កំពុងរង់ចាំ", "review": "កំពុងពិនិត្យ", "confirmed": "បានបញ្ជាក់", "preparing": "កំពុងរៀបចំ", "shipped": "បានដឹកចេញ", "completed": "បានបញ្ចប់", "cancelled": "បានបោះបង់", "rejected": "បានបដិសេធ", "amountMismatch": "ចំនួនទឹកប្រាក់មិនត្រូវ", "book": "សៀវភៅ", "mallBooks": "សៀវភៅ Shadow Mall", "orderId": "លេខបញ្ជាទិញ", "total": "សរុប", "delivery": "ការដឹកជញ្ជូន", "transaction": "ប្រតិបត្តិការ", "itemsQty": "{{items}} មុខ · ចំនួន {{qty}}", "loginRequired": "សូមចូលគណនីដើម្បីមើលប្រវត្តិការបញ្ជាទិញ។", "failedLoad": "មិនអាចផ្ទុកប្រវត្តិការបញ្ជាទិញបានទេ", "noOrders": "គ្មានការបញ្ជាទិញ", "oneOrder": "1 ការបញ្ជាទិញ", "manyOrders": "{{count}} ការបញ្ជាទិញ", "goBack": "ត្រឡប់ក្រោយ", "title": "ប្រវត្តិការបញ្ជាទិញ", "recent90": "ការបញ្ជាទិញថ្មីៗក្នុងរយៈពេល 90 ថ្ងៃចុងក្រោយ។", "refresh": "ផ្ទុកការបញ្ជាទិញឡើងវិញ", "searchPlaceholder": "ស្វែងរកលេខបញ្ជាទិញ ឬលេខប្រតិបត្តិការ", "clearSearch": "សម្អាតការស្វែងរក", "noOrdersYet": "មិនទាន់មានការបញ្ជាទិញ", "noOrdersBody": "ការបញ្ជាទិញ Shadow Mall របស់អ្នកនឹងបង្ហាញនៅទីនេះបន្ទាប់ពី Checkout។", "backShop": "ត្រឡប់ទៅហាង", "previous": "មុន", "pageOf": "ទំព័រ {{page}} / {{total}}", "next": "បន្ទាប់" },
  zh: { "all": "全部", "waiting": "等待中", "review": "审核中", "confirmed": "已确认", "preparing": "准备中", "shipped": "已发货", "completed": "已完成", "cancelled": "已取消", "rejected": "已拒绝", "amountMismatch": "金额不匹配", "book": "图书", "mallBooks": "Shadow Mall 图书", "orderId": "订单号", "total": "合计", "delivery": "配送", "transaction": "交易", "itemsQty": "{{items}} 件 · 数量 {{qty}}", "loginRequired": "请登录后查看订单历史。", "failedLoad": "无法加载订单历史", "noOrders": "没有订单", "oneOrder": "1 个订单", "manyOrders": "{{count}} 个订单", "goBack": "返回", "title": "订单历史", "recent90": "最近 90 天的订单。", "refresh": "刷新订单", "searchPlaceholder": "搜索订单号或交易号", "clearSearch": "清除搜索", "noOrdersYet": "还没有订单", "noOrdersBody": "结账后，你的 Shadow Mall 订单会显示在这里。", "backShop": "返回商店", "previous": "上一页", "pageOf": "第 {{page}} / {{total}} 页", "next": "下一页" },
  ja: { "all": "すべて", "waiting": "待機中", "review": "確認中", "confirmed": "確認済み", "preparing": "準備中", "shipped": "発送済み", "completed": "完了", "cancelled": "キャンセル", "rejected": "拒否済み", "amountMismatch": "金額不一致", "book": "本", "mallBooks": "Shadow Mall の本", "orderId": "注文ID", "total": "合計", "delivery": "配送", "transaction": "取引", "itemsQty": "{{items}}点 · 数量 {{qty}}", "loginRequired": "注文履歴を見るにはログインしてください。", "failedLoad": "注文履歴を読み込めませんでした", "noOrders": "注文なし", "oneOrder": "1件の注文", "manyOrders": "{{count}}件の注文", "goBack": "戻る", "title": "注文履歴", "recent90": "過去90日間の最近の注文。", "refresh": "注文を更新", "searchPlaceholder": "注文IDまたは取引IDを検索", "clearSearch": "検索をクリア", "noOrdersYet": "注文はまだありません", "noOrdersBody": "チェックアウト後、Shadow Mall の注文がここに表示されます。", "backShop": "ショップに戻る", "previous": "前へ", "pageOf": "{{page}} / {{total}} ページ", "next": "次へ" },
  ko: { "all": "전체", "waiting": "대기 중", "review": "검토 중", "confirmed": "확인됨", "preparing": "준비 중", "shipped": "배송됨", "completed": "완료", "cancelled": "취소됨", "rejected": "거부됨", "amountMismatch": "금액 불일치", "book": "도서", "mallBooks": "Shadow Mall 도서", "orderId": "주문 ID", "total": "합계", "delivery": "배송", "transaction": "거래", "itemsQty": "{{items}}개 · 수량 {{qty}}", "loginRequired": "주문 내역을 보려면 로그인하세요.", "failedLoad": "주문 내역을 불러오지 못했습니다", "noOrders": "주문 없음", "oneOrder": "주문 1건", "manyOrders": "주문 {{count}}건", "goBack": "뒤로", "title": "주문 내역", "recent90": "최근 90일 주문입니다.", "refresh": "주문 새로고침", "searchPlaceholder": "주문 ID 또는 거래 ID 검색", "clearSearch": "검색 지우기", "noOrdersYet": "아직 주문이 없습니다", "noOrdersBody": "결제 후 Shadow Mall 주문이 여기에 표시됩니다.", "backShop": "스토어로 돌아가기", "previous": "이전", "pageOf": "{{page}} / {{total}} 페이지", "next": "다음" },
})


const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const statusTabs = [
  { key: 'all', labelKey: 'all' },
  { key: 'waiting_payment', labelKey: 'waiting' },
  { key: 'under_review', labelKey: 'review' },
  { key: 'confirmed', labelKey: 'confirmed' },
  { key: 'preparing', labelKey: 'preparing' },
  { key: 'shipped', labelKey: 'shipped' },
  { key: 'completed', labelKey: 'completed' },
  { key: 'cancelled', labelKey: 'cancelled' },
]

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatUsd(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(number) ? number : 0)
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString(getDisplayLanguageId())
}

function statusText(status) {
  const keyMap = {
    waiting_payment: 'waiting',
    under_review: 'review',
    confirmed: 'confirmed',
    preparing: 'preparing',
    shipped: 'shipped',
    completed: 'completed',
    cancelled: 'cancelled',
    rejected: 'rejected',
    amount_mismatch: 'amountMismatch',
  }
  const key = keyMap[String(status || '')]
  return key ? getDisplayText(`shadowMallOrderHistoryPage.${key}`) : String(status || '').replace(/_/g, ' ')
}

function statusClass(status) {
  if (status === 'completed') return 'bg-[#dcfce7] text-[#166534] dark:bg-emerald-500/15 dark:text-emerald-300'
  if (status === 'shipped') return 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-blue-500/15 dark:text-blue-300'
  if (status === 'confirmed') return 'bg-[#eef2ff] text-[#4f46e5] dark:bg-indigo-500/15 dark:text-indigo-300'
  if (status === 'preparing') return 'bg-[#f3e8ff] text-[#7e22ce] dark:bg-purple-500/15 dark:text-purple-300'
  if (status === 'under_review') return 'bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300'
  if (status === 'waiting_payment') return 'bg-[#f1f5f9] text-[#475569] dark:bg-slate-500/15 dark:text-slate-300'
  if (status === 'cancelled' || status === 'rejected' || status === 'amount_mismatch') return 'bg-[#fee2e2] text-[#b91c1c] dark:bg-red-500/15 dark:text-red-300'
  return 'bg-[#f1f5f9] text-[#475569] dark:bg-slate-500/15 dark:text-slate-300'
}

function OrderBookThumbs({ items }) {
  const safeItems = Array.isArray(items) ? items : []
  const visibleItems = safeItems.slice(0, 3)
  const extraCount = Math.max(safeItems.length - visibleItems.length, 0)

  return (
    <div className="flex items-center">
      {visibleItems.map((item, index) => (
        <div
          key={`${item.product_id || index}`}
          className="-ml-2 first:ml-0 h-12 w-9 overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)] ring-2 ring-[var(--shadow-bg-surface)]"
        >
          {item.cover_url ? (
            <img
              src={item.cover_url}
              alt={item.title || getDisplayText('shadowMallOrderHistoryPage.book')}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[11px]" />
            </div>
          )}
        </div>
      ))}

      {extraCount > 0 ? (
        <div className="-ml-2 flex h-12 w-9 items-center justify-center rounded-[10px] bg-[#111827] text-[10px] font-extrabold text-white ring-2 ring-[var(--shadow-bg-surface)] dark:bg-white dark:text-[#111827]">
          +{extraCount}
        </div>
      ) : null}
    </div>
  )
}

function OrderCard({ order }) {
  const { t } = useDisplayTranslation()
  const items = Array.isArray(order.items) ? order.items : []
  const firstItem = items[0]
  const totalQty = items.reduce((total, item) => total + Number(item.quantity || 0), 0)

  return (
    <article className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{t('shadowMallOrderHistoryPage.orderId')}</div>
          <div className="mt-1 line-clamp-1 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
            {order.order_id}
          </div>
          <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
            {formatDate(order.created_at)}
          </div>
        </div>

        <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${statusClass(order.status)}`}>
          {statusText(order.status)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <OrderBookThumbs items={items} />

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
            {firstItem?.title || t('shadowMallOrderHistoryPage.mallBooks')}
          </div>
          <div className="mt-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
            {t('shadowMallOrderHistoryPage.itemsQty', { items: Number(items.length).toLocaleString(getDisplayLanguageId()), qty: Number(totalQty || 0).toLocaleString(getDisplayLanguageId()) })}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{t('shadowMallOrderHistoryPage.total')}</div>
          <div className="mt-1 text-[15px] font-extrabold text-[#e5484d]">
            {formatUsd(order.total_usd)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
          <span>{t('shadowMallOrderHistoryPage.delivery')}</span>
          <span className="font-extrabold text-[var(--shadow-text-primary)]">
            {order.delivery_company?.shortName || order.delivery_company?.name || '-'}
          </span>
        </div>

        {order.aba_transaction_id ? (
          <div className="mt-2 flex items-center justify-between gap-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
            <span>{t('shadowMallOrderHistoryPage.transaction')}</span>
            <span className="line-clamp-1 font-extrabold text-[var(--shadow-text-primary)]">
              {order.aba_transaction_id}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default function ShadowMallOrderHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const token = getReaderToken()

  async function loadOrders(options = {}) {
    const nextPage = options.page || page
    const nextStatus = options.status || status
    const nextSearch = options.search ?? search

    if (!token) {
      setOrders([])
      setLoading(false)
      setMessage(t('shadowMallOrderHistoryPage.loginRequired'))
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        page: String(nextPage),
        limit: '20',
        status: nextStatus,
        q: nextSearch.trim(),
      })

      const response = await fetch(`${API_URL}/api/shadow-mall/orders/my?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('shadowMallOrderHistoryPage.failedLoad'))
      }

      setOrders(data.orders || [])
      setMeta({
        total: data.total || 0,
        total_pages: data.total_pages || 1,
        has_next: Boolean(data.has_next),
        has_prev: Boolean(data.has_prev),
      })
    } catch (error) {
      setOrders([])
      setMessage(error.message || t('shadowMallOrderHistoryPage.failedLoad'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders({ page, status, search })

    const interval = window.setInterval(() => {
      loadOrders({ page, status, search })
    }, 15000)

    const refreshOnFocus = () => {
      loadOrders({ page, status, search })
    }

    window.addEventListener('focus', refreshOnFocus)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshOnFocus)
    }
  }, [page, status])

  function handleStatusChange(nextStatus) {
    setStatus(nextStatus)
    setPage(1)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    setPage(1)
    loadOrders({ page: 1, status, search })
  }

  const orderCountText = useMemo(() => {
    if (!meta.total) return t('shadowMallOrderHistoryPage.noOrders')
    if (meta.total === 1) return t('shadowMallOrderHistoryPage.oneOrder')
    return t('shadowMallOrderHistoryPage.manyOrders', {
      count: Number(meta.total).toLocaleString(getDisplayLanguageId()),
    })
  }, [meta.total, t])

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/shop/mall/cart', { replace: true })
}}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallOrderHistoryPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-left text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallOrderHistoryPage.title')}</h1>
            <div className="mt-0.5 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
              {orderCountText} · {t('shadowMallOrderHistoryPage.recent90')}
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadOrders({ page, status, search })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            aria-label={t('shadowMallOrderHistoryPage.refresh')}
          >
            <i className={`fa-solid fa-rotate-right text-[13px] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <form onSubmit={handleSearchSubmit} className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-[14px] text-[var(--shadow-text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('shadowMallOrderHistoryPage.searchPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
            />
            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                  loadOrders({ page: 1, status, search: '' })
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]"
                aria-label={t('shadowMallOrderHistoryPage.clearSearch')}
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleStatusChange(item.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold active:scale-95 ${
                status === item.key
                  ? 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
                  : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
              }`}
            >
              {t(`shadowMallOrderHistoryPage.${item.labelKey}`)}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        {loading && !orders.length ? (
          <section className="mt-4 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[170px] animate-pulse rounded-[24px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]" />
            ))}
          </section>
        ) : orders.length ? (
          <section className="mt-4 space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
              <i className="fa-solid fa-clock-rotate-left text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallOrderHistoryPage.noOrdersYet')}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t('shadowMallOrderHistoryPage.noOrdersBody')}
            </p>
            <button
              type="button"
              onClick={() => {
  if (location.state?.from) return navigate(-1)
  navigate('/shop', { replace: true })
}}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallOrderHistoryPage.backShop')}
            </button>
          </section>
        )}

        {orders.length ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
            <button
              type="button"
              disabled={!meta.has_prev}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-extrabold text-[var(--shadow-text-primary)] disabled:text-[var(--shadow-text-disabled)]"
            >
              {t('shadowMallOrderHistoryPage.previous')}
            </button>

            <div className="text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              {t('shadowMallOrderHistoryPage.pageOf', { page: Number(page).toLocaleString(getDisplayLanguageId()), total: Number(meta.total_pages).toLocaleString(getDisplayLanguageId()) })}
            </div>

            <button
              type="button"
              disabled={!meta.has_next}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallOrderHistoryPage.next')}
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}

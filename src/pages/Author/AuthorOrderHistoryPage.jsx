import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorOrderHistory', {
  "en": {
    "all": "All",
    "waiting": "Waiting",
    "review": "Review",
    "confirmed": "Confirmed",
    "preparing": "Preparing",
    "shipped": "Shipped",
    "completed": "Completed",
    "cancelled": "Cancelled",
    "waitingPayment": "WAITING PAYMENT",
    "underReview": "UNDER REVIEW",
    "confirmedStatus": "CONFIRMED",
    "preparingStatus": "PREPARING",
    "shippedStatus": "SHIPPED",
    "completedStatus": "COMPLETED",
    "cancelledStatus": "CANCELLED",
    "title": "Order History",
    "ordersRecent": "{{count}} orders · Recent orders from the last 90 days.",
    "searchPlaceholder": "Search Order ID or Transaction ID",
    "orderId": "Order ID",
    "authorStore": "Author Store",
    "authorStoreOrder": "Author store order",
    "itemsQty": "{{items}} items · Qty {{qty}}",
    "total": "Total",
    "delivery": "Delivery",
    "calculateLater": "Calculate later",
    "emptyTitle": "No order history yet",
    "emptyHelp": "Author store orders will appear here after checkout.",
    "refresh": "Refresh orders",
    "goBack": "Go back"
  },
  "km": {
    "all": "ទាំងអស់",
    "waiting": "កំពុងរង់ចាំ",
    "review": "កំពុងពិនិត្យ",
    "confirmed": "បានបញ្ជាក់",
    "preparing": "កំពុងរៀបចំ",
    "shipped": "បានដឹកចេញ",
    "completed": "បានបញ្ចប់",
    "cancelled": "បានលុបចោល",
    "waitingPayment": "កំពុងរង់ចាំការទូទាត់",
    "underReview": "កំពុងពិនិត្យ",
    "confirmedStatus": "បានបញ្ជាក់",
    "preparingStatus": "កំពុងរៀបចំ",
    "shippedStatus": "បានដឹកចេញ",
    "completedStatus": "បានបញ្ចប់",
    "cancelledStatus": "បានលុបចោល",
    "title": "ប្រវត្តិការបញ្ជាទិញ",
    "ordersRecent": "{{count}} ការបញ្ជាទិញ · ការបញ្ជាទិញថ្មីៗក្នុង 90 ថ្ងៃចុងក្រោយ។",
    "searchPlaceholder": "ស្វែងរក Order ID ឬ Transaction ID",
    "orderId": "Order ID",
    "authorStore": "ហាងអ្នកនិពន្ធ",
    "authorStoreOrder": "ការបញ្ជាទិញពីហាងអ្នកនិពន្ធ",
    "itemsQty": "{{items}} ទំនិញ · ចំនួន {{qty}}",
    "total": "សរុប",
    "delivery": "ការដឹកជញ្ជូន",
    "calculateLater": "គណនាពេលក្រោយ",
    "emptyTitle": "មិនទាន់មានប្រវត្តិការបញ្ជាទិញ",
    "emptyHelp": "ការបញ្ជាទិញពីហាងអ្នកនិពន្ធនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីទូទាត់។",
    "refresh": "ផ្ទុកការបញ្ជាទិញឡើងវិញ",
    "goBack": "ត្រឡប់ក្រោយ"
  },
  "zh": {
    "all": "全部",
    "waiting": "待付款",
    "review": "审核中",
    "confirmed": "已确认",
    "preparing": "准备中",
    "shipped": "已发货",
    "completed": "已完成",
    "cancelled": "已取消",
    "waitingPayment": "等待付款",
    "underReview": "审核中",
    "confirmedStatus": "已确认",
    "preparingStatus": "准备中",
    "shippedStatus": "已发货",
    "completedStatus": "已完成",
    "cancelledStatus": "已取消",
    "title": "订单记录",
    "ordersRecent": "{{count}} 个订单 · 最近 90 天的订单。",
    "searchPlaceholder": "搜索订单 ID 或交易 ID",
    "orderId": "订单 ID",
    "authorStore": "作者商店",
    "authorStoreOrder": "作者商店订单",
    "itemsQty": "{{items}} 件商品 · 数量 {{qty}}",
    "total": "总计",
    "delivery": "配送",
    "calculateLater": "稍后计算",
    "emptyTitle": "暂无订单记录",
    "emptyHelp": "结账后，作者商店订单会显示在这里。",
    "refresh": "刷新订单",
    "goBack": "返回"
  },
  "ja": {
    "all": "すべて",
    "waiting": "支払い待ち",
    "review": "確認中",
    "confirmed": "確認済み",
    "preparing": "準備中",
    "shipped": "発送済み",
    "completed": "完了",
    "cancelled": "キャンセル",
    "waitingPayment": "支払い待ち",
    "underReview": "確認中",
    "confirmedStatus": "確認済み",
    "preparingStatus": "準備中",
    "shippedStatus": "発送済み",
    "completedStatus": "完了",
    "cancelledStatus": "キャンセル",
    "title": "注文履歴",
    "ordersRecent": "{{count}} 件の注文 · 過去90日間の最近の注文。",
    "searchPlaceholder": "注文IDまたは取引IDを検索",
    "orderId": "注文 ID",
    "authorStore": "著者ストア",
    "authorStoreOrder": "著者ストアの注文",
    "itemsQty": "{{items}} 点 · 数量 {{qty}}",
    "total": "合計",
    "delivery": "配送",
    "calculateLater": "後で計算",
    "emptyTitle": "注文履歴はまだありません",
    "emptyHelp": "購入手続き後、著者ストアの注文がここに表示されます。",
    "refresh": "注文を更新",
    "goBack": "戻る"
  },
  "ko": {
    "all": "전체",
    "waiting": "결제 대기",
    "review": "검토 중",
    "confirmed": "확인됨",
    "preparing": "준비 중",
    "shipped": "배송됨",
    "completed": "완료",
    "cancelled": "취소됨",
    "waitingPayment": "결제 대기",
    "underReview": "검토 중",
    "confirmedStatus": "확인됨",
    "preparingStatus": "준비 중",
    "shippedStatus": "배송됨",
    "completedStatus": "완료",
    "cancelledStatus": "취소됨",
    "title": "주문 내역",
    "ordersRecent": "{{count}}개 주문 · 최근 90일 주문.",
    "searchPlaceholder": "주문 ID 또는 거래 ID 검색",
    "orderId": "주문 ID",
    "authorStore": "작가 스토어",
    "authorStoreOrder": "작가 스토어 주문",
    "itemsQty": "{{items}}개 상품 · 수량 {{qty}}",
    "total": "합계",
    "delivery": "배송",
    "calculateLater": "나중에 계산",
    "emptyTitle": "아직 주문 내역이 없습니다",
    "emptyHelp": "결제 후 작가 스토어 주문이 여기에 표시됩니다.",
    "refresh": "주문 새로고침",
    "goBack": "뒤로"
  }
})


const FILTERS = ['All', 'Waiting', 'Review', 'Confirmed', 'Preparing', 'Shipped', 'Completed', 'Cancelled']

function filterLabel(filter) {
  const keyMap = {
    All: 'all',
    Waiting: 'waiting',
    Review: 'review',
    Confirmed: 'confirmed',
    Preparing: 'preparing',
    Shipped: 'shipped',
    Completed: 'completed',
    Cancelled: 'cancelled',
  }

  return getDisplayText(`authorOrderHistory.${keyMap[filter] || 'all'}`)
}

function getAuthorOrders() {
  try {
    const raw = localStorage.getItem('shadow_author_order_history') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function money(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function number(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId())
}

function statusLabel(status) {
  const value = String(status || 'waiting').toLowerCase()
  if (value === 'waiting') return getDisplayText('authorOrderHistory.waitingPayment')
  if (value === 'review') return getDisplayText('authorOrderHistory.underReview')
  if (value === 'confirmed') return getDisplayText('authorOrderHistory.confirmedStatus')
  if (value === 'preparing') return getDisplayText('authorOrderHistory.preparingStatus')
  if (value === 'shipped') return getDisplayText('authorOrderHistory.shippedStatus')
  if (value === 'completed') return getDisplayText('authorOrderHistory.completedStatus')
  if (value === 'cancelled') return getDisplayText('authorOrderHistory.cancelledStatus')
  return getDisplayText('authorOrderHistory.waitingPayment')
}

function statusMatches(filter, status) {
  if (filter === 'All') return true
  return String(status || 'waiting').toLowerCase() === filter.toLowerCase()
}

function formatDate(value) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString(getDisplayLanguageId())
  } catch {
    return value
  }
}

export default function AuthorOrderHistoryPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [orders] = useState(getAuthorOrders)

  const visibleOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return orders.filter((order) => {
      const filterOk = statusMatches(activeFilter, order.status)
      const queryOk = !keyword || String(order.order_id || '').toLowerCase().includes(keyword) || String(order.transaction_id || '').toLowerCase().includes(keyword)
      return filterOk && queryOk
    })
  }, [orders, query, activeFilter])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" aria-label={t('authorOrderHistory.goBack')} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1 px-3">
            <h1 className="text-[18px] font-black leading-5 text-[var(--shadow-text-primary)]">{t('authorOrderHistory.title')}</h1>
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.ordersRecent', { count: number(orders.length) })}</p>
          </div>

          <button type="button" aria-label={t('authorOrderHistory.refresh')} onClick={() => window.location.reload()} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95">
            <i className="fa-solid fa-rotate-right text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[var(--shadow-text-tertiary)]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('authorOrderHistory.searchPlaceholder')}
              className="h-12 w-full rounded-full bg-[var(--shadow-input-bg)] pl-11 pr-4 text-[13px] font-bold text-[var(--shadow-text-primary)] outline-none"
            />
          </div>
        </section>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-9 shrink-0 rounded-full px-4 text-[12px] font-black ${
                  active ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]' : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
                }`}
              >
                {filterLabel(filter)}
              </button>
            )
          })}
        </div>

        <section className="mt-3 space-y-3">
          {visibleOrders.length ? visibleOrders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : []
            const firstItem = items[0] || {}
            const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)

            return (
              <article key={order.order_id} className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.orderId')}</div>
<div className="mt-1 text-[13px] font-black text-[var(--shadow-text-primary)]">{order.order_id}</div>
{order.author_page_name || order.author_page_username ? (
  <div className="mt-1 text-[11px] font-black text-[var(--shadow-text-primary)]">
    {order.author_page_name || t('authorOrderHistory.authorStore')}
    {order.author_page_username ? (
      <span className="font-semibold text-[var(--shadow-text-tertiary)]"> @{order.author_page_username}</span>
    ) : null}
  </div>
) : null}
<div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{formatDate(order.created_at)}</div>
                  </div>

                  <span className="shrink-0 rounded-full bg-[var(--shadow-bg-soft)] px-3 py-1 text-[9px] font-black uppercase text-[var(--shadow-text-secondary)]">
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex -space-x-2">
                      {items.slice(0, 2).map((item, index) => (
                        <div key={`${item.id}-${index}`} className="h-11 w-9 overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)] ring-2 ring-[var(--shadow-bg-surface)]">
                          {item.cover_url ? (
                            <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="min-w-0">
                      <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">{firstItem.title || t('authorOrderHistory.authorStoreOrder')}</div>
                      <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.itemsQty', { items: number(items.length), qty: number(totalQty) })}</div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.total')}</div>
                    <div className="mt-1 text-[14px] font-black text-[#e5484d]">{money(order.total)}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[var(--shadow-bg-soft)] px-3 py-3">
                  <span className="text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorOrderHistory.delivery')}</span>
                  <span className="text-[12px] font-black text-[var(--shadow-text-primary)]">{order.delivery || t('authorOrderHistory.calculateLater')}</span>
                </div>
              </article>
            )
          }) : (
            <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-8 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className="fa-solid fa-clock-rotate-left text-[20px]" />
              </div>
              <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorOrderHistory.emptyTitle')}</h2>
              <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.emptyHelp')}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

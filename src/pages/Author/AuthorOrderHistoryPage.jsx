import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
    "goBack": "Go back",
    "loadMore": "Load 20 more",
    "loading": "Loading orders...",
    "loadFailed": "Could not refresh orders. Tap to retry.",
    "localOnly": "Saved on this device only. Order status may be outdated.",
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
    "goBack": "ត្រឡប់ក្រោយ",
    "loadMore": "បង្ហាញ ២០ បន្ថែម",
    "loading": "កំពុងផ្ទុកការបញ្ជាទិញ...",
    "loadFailed": "មិនអាចទាញប្រវត្តិថ្មីបានទេ។ ចុចដើម្បីសាកល្បងម្តងទៀត។",
    "localOnly": "ប្រវត្តិដែលរក្សាទុកលើឧបករណ៍នេះប៉ុណ្ណោះ។ ស្ថានភាពអាចមិនទាន់ថ្មី។",
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
    "goBack": "返回",
    "loadMore": "再加载 20 条",
    "loading": "正在加载订单...",
    "loadFailed": "无法更新订单，请点击重试。",
    "localOnly": "仅保存在此设备，订单状态可能已过时。",
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
    "goBack": "戻る",
    "loadMore": "さらに20件読み込む",
    "loading": "注文を読み込み中...",
    "loadFailed": "注文を更新できません。タップして再試行。",
    "localOnly": "この端末に保存された記録です。注文状態は最新でない場合があります。",
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
    "goBack": "뒤로",
    "loadMore": "20개 더 보기",
    "loading": "주문 내역을 불러오는 중...",
    "loadFailed": "주문을 업데이트하지 못했습니다. 탭하여 다시 시도하세요.",
    "localOnly": "이 기기에 저장된 기록입니다. 주문 상태가 최신이 아닐 수 있습니다.",
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

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)
const PAGE_SIZE = 20
const HISTORY_DAYS = 90

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getAuthorOrders() {
  try {
    const raw = localStorage.getItem('shadow_author_order_history') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : []
  } catch {
    return []
  }
}

function normalizeStatus(order) {
  const value = String(order.order_status || order.status || 'waiting_payment').toLowerCase()
  if (['waiting', 'waiting_payment', 'pending'].includes(value)) return 'waiting'
  if (['review', 'under_review', 'amount_mismatch'].includes(value)) return 'review'
  if (['cancelled', 'canceled', 'rejected', 'expired', 'refunded'].includes(value)) return 'cancelled'
  if (['confirmed', 'preparing', 'shipped', 'completed'].includes(value)) return value
  return 'review'
}

function normalizeOrder(order) {
  const items = Array.isArray(order.items) ? order.items.filter((item) => item && typeof item === 'object').map((item) => ({
    ...item,
    id: item.id || item.product_id || '',
    title: item.product_title || item.title || '',
    cover_url: item.cover_url || '',
    quantity: Math.max(1, Number(item.quantity) || 1),
  })) : []
  const deliveryCompany = order.delivery_company && typeof order.delivery_company === 'object'
    ? order.delivery_company
    : {}
  return {
    id: String(order.id || order.order_id || ''),
    order_id: String(order.order_id || order.order_number || order.id || ''),
    transaction_id: String(order.aba_transaction_id || order.transaction_id || ''),
    status: normalizeStatus(order),
    payment_status: String(order.payment_status || '').toLowerCase(),
    created_at: order.created_at || order.paid_at || '',
    author_page_name: order.author_page_name || '',
    author_page_username: order.author_page_username || '',
    total: Number(order.total_usd ?? order.total_amount ?? order.total ?? 0) || 0,
    delivery: order.delivery || deliveryCompany.name || deliveryCompany.shortName || deliveryCompany.short_name || '',
    delivery_fee: Number(order.delivery_fee_usd ?? order.delivery_fee ?? 0) || 0,
    items,
  }
}

function getLocalOrders(filter, search) {
  const cutoff = Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000
  const keyword = String(search || '').toLowerCase()
  return getAuthorOrders()
    .map(normalizeOrder)
    .filter((order) => {
      const date = Date.parse(order.created_at)
      return Number.isFinite(date) && date >= cutoff &&
        (filter === 'All' || statusMatches(filter, order.status)) &&
        (!keyword || order.order_id.toLowerCase().includes(keyword) || order.transaction_id.toLowerCase().includes(keyword))
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
}

function safeImageUrl(value) {
  const source = String(value || '').trim()
  if (!source) return ''
  if (/^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(source)) return source
  try {
    const url = new URL(source, window.location.origin)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
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

registerTranslationNamespace('authorOrderConfirmReceived', {
  en: { button: 'Confirm Received', title: 'Confirm book received?', warning: 'Only confirm after you have physically received the book. This will release the book payment to the author.', cancel: 'Not yet', submit: 'Yes, I received it', saving: 'Confirming...', confirmed: 'Receipt confirmed · Payment released', failed: 'Could not confirm receipt. Please retry.', unavailable: 'This order is not eligible for receipt confirmation yet.', missing: 'This order does not have a pending book payment hold.' },
  km: { button: 'បញ្ជាក់បានទទួល', title: 'បញ្ជាក់ថាបានទទួលសៀវភៅ?', warning: 'សូមបញ្ជាក់តែក្រោយពេលអ្នកបានទទួលសៀវភៅពិតប្រាកដ។ ការបញ្ជាក់នេះនឹងដោះលែងប្រាក់ឱ្យអ្នកនិពន្ធ។', cancel: 'មិនទាន់ទទួល', submit: 'បាទ/ចាស បានទទួលហើយ', saving: 'កំពុងបញ្ជាក់...', confirmed: 'បានបញ្ជាក់ទទួល · បានដោះលែងប្រាក់', failed: 'មិនអាចបញ្ជាក់បានទេ។ សូមសាកល្បងម្តងទៀត។', unavailable: 'Order នេះមិនទាន់អាចបញ្ជាក់ទទួលបានទេ។', missing: 'Order នេះមិនមានប្រាក់បង្កកសៀវភៅកំពុងរង់ចាំទេ។' },
  zh: { button: '确认收货', title: '确认已收到纸质书？', warning: '请仅在实际收到纸质书后确认。确认后将向作者释放这笔书款。', cancel: '尚未收到', submit: '是的，我已收到', saving: '正在确认...', confirmed: '已确认收货 · 款项已释放', failed: '确认失败，请重试。', unavailable: '此订单暂不能确认收货。', missing: '此订单没有待释放的书款。' },
  ja: { button: '受取を確認', title: '書籍を受け取りましたか？', warning: '紙の書籍を実際に受け取った場合のみ確認してください。確認すると著者への支払いが解放されます。', cancel: 'まだ受け取っていない', submit: 'はい、受け取りました', saving: '確認中...', confirmed: '受取確認済み · 支払い解放済み', failed: '確認できませんでした。再度お試しください。', unavailable: 'この注文はまだ受取確認できません。', missing: 'この注文には保留中の書籍代金がありません。' },
  ko: { button: '수령 확인', title: '책을 받으셨나요?', warning: '실물 책을 받은 후에만 확인하세요. 확인하면 저자에게 책 판매금이 지급 가능 상태로 전환됩니다.', cancel: '아직 받지 못함', submit: '네, 받았습니다', saving: '확인 중...', confirmed: '수령 확인 완료 · 결제금 해제', failed: '수령 확인에 실패했습니다. 다시 시도해 주세요.', unavailable: '이 주문은 아직 수령 확인할 수 없습니다.', missing: '이 주문에는 보류 중인 책 판매금이 없습니다.' },
})

function ReaderConfirmReceived({ order, localOnly }) {
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`authorOrderConfirmReceived.${key}`)
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)
  const uuidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
  const isPhysicalBook = (order.items || []).some((item) => String(item.product_type || '').toLowerCase() === 'book')
  const eligible = !localOnly && uuidPattern.test(order.id) && order.payment_status === 'paid' && ['shipped', 'completed'].includes(order.status) && isPhysicalBook

  if (!eligible) return null

  async function submit() {
    if (busyRef.current || confirmed) return
    busyRef.current = true
    setSending(true)
    setError('')
    try {
      const token = getReaderToken()
      if (!token) throw new Error('AUTH')
      const response = await fetch(`${API_BASE_URL}/api/author-store/orders/${encodeURIComponent(order.id)}/confirm-received`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || data.status !== 'released') {
        const code = response.status === 404 ? 'missing' : response.status === 409 ? 'unavailable' : 'failed'
        throw new Error(code)
      }
      setConfirmed(true)
      setOpen(false)
    } catch (cause) {
      const key = ['missing', 'unavailable'].includes(cause.message) ? cause.message : 'failed'
      setError(tr(key))
    } finally {
      busyRef.current = false
      setSending(false)
    }
  }

  if (confirmed) return <p role="status" className="mt-3 rounded-[14px] bg-emerald-500/10 px-3 py-3 text-center text-[12px] font-bold text-emerald-600">{tr('confirmed')}</p>

  return (
    <>
      <button type="button" onClick={() => { setError(''); setOpen(true) }} className="mt-3 w-full rounded-[14px] bg-violet-600 px-4 py-3 text-[12px] font-bold text-white">
        {tr('button')}
      </button>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-book-received-title" className="w-full max-w-sm rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 text-[var(--shadow-text-primary)] shadow-2xl">
            <h2 id="confirm-book-received-title" className="text-[17px] font-black">{tr('title')}</h2>
            <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{tr('warning')}</p>
            {error && <p role="alert" className="mt-3 text-[12px] font-semibold text-red-600">{error}</p>}
            <div className="mt-5 flex gap-2">
              <button type="button" disabled={sending} onClick={() => setOpen(false)} className="flex-1 rounded-[14px] border border-[var(--shadow-border)] px-3 py-3 text-[12px] font-bold disabled:opacity-50">{tr('cancel')}</button>
              <button type="button" disabled={sending} onClick={() => void submit()} className="flex-1 rounded-[14px] bg-violet-600 px-3 py-3 text-[12px] font-bold text-white disabled:opacity-50">{sending ? tr('saving') : tr('submit')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default function AuthorOrderHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [query, setQuery] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [localOnly, setLocalOnly] = useState(false)
  const controllerRef = useRef(null)
  const requestIdRef = useRef(0)
  const pagingRef = useRef({ page: 0, hasNext: true })
  const busyRef = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchTerm(query.trim()), 350)
    return () => window.clearTimeout(timer)
  }, [query])

  const loadOrders = useCallback(async (reset = true) => {
    if (!reset && (!pagingRef.current.hasNext || busyRef.current)) return
    const requestId = ++requestIdRef.current
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    busyRef.current = true
    const nextPage = reset ? 1 : pagingRef.current.page + 1

    if (reset) {
      setOrders([])
      setTotal(0)
      setHasNext(false)
      setLoading(true)
      setLocalOnly(false)
    } else {
      setLoadingMore(true)
    }
    setLoadError('')

    try {
      const token = getReaderToken()
      if (!token) throw new Error('LOGIN_REQUIRED')
      const params = new URLSearchParams({ page: String(nextPage), limit: String(PAGE_SIZE) })
      if (activeFilter !== 'All') params.set('status', activeFilter.toLowerCase())
      if (searchTerm) params.set('q', searchTerm)
      const response = await fetch(`${API_BASE_URL}/api/author-store/orders/my?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false || !Array.isArray(data.orders)) {
        throw new Error(data.message || 'LOAD_FAILED')
      }
      if (requestId !== requestIdRef.current || controller.signal.aborted) return

      const incoming = data.orders.map(normalizeOrder)
      const count = Math.max(0, Number(data.total) || 0)
      const more = typeof data.has_next === 'boolean'
        ? data.has_next
        : nextPage * PAGE_SIZE < count
      setOrders((previous) => {
        const unique = new Map((reset ? [] : previous).map((order) => [order.id || order.order_id, order]))
        incoming.forEach((order) => unique.set(order.id || order.order_id, order))
        return [...unique.values()]
      })
      setTotal(count)
      setHasNext(more)
      pagingRef.current = { page: nextPage, hasNext: more }
      setLocalOnly(false)
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) return
      if (reset) {
        const saved = getLocalOrders(activeFilter, searchTerm)
        setOrders(saved)
        setTotal(saved.length)
        setLocalOnly(saved.length > 0)
        pagingRef.current = { page: 0, hasNext: false }
        setHasNext(false)
      }
      setLoadError('fetch_failed')
    } finally {
      if (requestId === requestIdRef.current) {
        busyRef.current = false
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [activeFilter, searchTerm])

  useEffect(() => {
    void loadOrders(true)
    return () => {
      ++requestIdRef.current
      controllerRef.current?.abort()
      busyRef.current = false
    }
  }, [loadOrders])

  const visibleOrders = orders

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" aria-label={t('authorOrderHistory.goBack')} onClick={() => {
  if (location.state?.from) return navigate(-1)
  navigate('/author/cart', { replace: true })
}} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1 px-3">
            <h1 className="text-[18px] font-black leading-5 text-[var(--shadow-text-primary)]">{t('authorOrderHistory.title')}</h1>
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.ordersRecent', { count: number(total) })}</p>
          </div>

          <button type="button" aria-label={t('authorOrderHistory.refresh')} onClick={() => void loadOrders(true)} disabled={loading || loadingMore} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95 disabled:opacity-50">
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

        {loadError ? (
          <button type="button" onClick={() => void loadOrders(true)} className="mt-3 w-full rounded-[16px] bg-[#fff7ed] p-3 text-left text-[12px] font-semibold text-[#9a3412]">
            {t('authorOrderHistory.loadFailed')}
          </button>
        ) : null}
        {localOnly ? (
          <p className="mt-3 rounded-[16px] bg-[var(--shadow-bg-soft)] p-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorOrderHistory.localOnly')}</p>
        ) : null}
        <section className="mt-3 space-y-3">
          {loading ? (
            <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-8 text-center text-[13px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorOrderHistory.loading')}</div>
          ) : visibleOrders.length ? visibleOrders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : []
            const firstItem = items[0] || {}
            const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)

            return (
              <article key={order.id || order.order_id} className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
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
                          {safeImageUrl(item.cover_url) ? (
                            <img src={safeImageUrl(item.cover_url)} alt={item.title} className="h-full w-full object-cover" />
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
                  <span className="text-[12px] font-black text-[var(--shadow-text-primary)]">{order.delivery || (order.delivery_fee > 0 ? money(order.delivery_fee) : t('authorOrderHistory.calculateLater'))}</span>
                </div>
              <ReaderConfirmReceived order={order} localOnly={localOnly} />
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
        {hasNext && !localOnly ? (
          <button type="button" onClick={() => void loadOrders(false)} disabled={loading || loadingMore} className="mt-4 h-11 w-full rounded-full bg-[var(--shadow-bg-surface)] text-[13px] font-black text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] disabled:opacity-50">
            {loadingMore ? t('authorOrderHistory.loading') : t('authorOrderHistory.loadMore')}
          </button>
        ) : null}
      </main>
    </div>
  )
}

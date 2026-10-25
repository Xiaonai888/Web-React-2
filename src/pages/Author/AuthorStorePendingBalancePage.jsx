import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorBookEvidencePanel from './AuthorBookEvidencePanel'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStorePendingBalance', {
  en: {
    title: 'Pending Balance', totalPending: 'Total Pending', orders: 'Orders', bookOnly: 'Book only',
    frozenNote: 'Book earnings are intended to stay pending until the reader confirms receipt or an admin approves.', preview: 'Live order records · Withdrawal protection is not active yet',
    all: 'All', awaitingReader: 'Awaiting Reader', underReview: 'Under Review', pendingOrders: 'Pending Orders',
    book: 'Book', buyer: 'Buyer', frozenAmount: 'Amount frozen', deliveryCompany: 'Delivery company',
    status: 'Status', order: 'Order', chatReader: 'Chat Reader', viewDetails: 'View Details', proofSent: 'Proof Sent',
    adminApproval: 'Admin Approval', adminNote: 'If a reader cannot confirm, the admin may review evidence and release the payment using a passkey.',
    adminHelp: 'Request Admin Help', comingSoon: 'Coming soon', comingSoonMessage: 'This feature is not available yet.',
    details: 'Order Details', close: 'Close', back: 'Back', noOrders: 'No orders in this category.',
    deliveryProof: 'Delivery proof', notAvailable: 'No proof uploaded', example: 'Book',
    securityNote: 'This page shows real payment-hold records. Blocking withdrawals requires a separate backend update.',
    loading: 'Loading pending orders...', loadFailed: 'Could not load pending book payments.', retry: 'Retry', loadMore: 'Load 10 more', trackingNumber: 'Tracking number'
  },
  km: {
    title: 'ប្រាក់កំពុងរង់ចាំ', totalPending: 'ប្រាក់កំពុងបង្កកសរុប', orders: 'ការបញ្ជាទិញ', bookOnly: 'សៀវភៅប៉ុណ្ណោះ',
    frozenNote: 'ប្រាក់លក់សៀវភៅគ្រោងរក្សាទុករហូតដល់អ្នកអានបញ្ជាក់ទទួល ឬ Admin អនុម័ត។', preview: 'ទិន្នន័យពិត · ប្រព័ន្ធការពារការដកប្រាក់មិនទាន់ដំណើរការ',
    all: 'ទាំងអស់', awaitingReader: 'រង់ចាំអ្នកអាន', underReview: 'កំពុងពិនិត្យ', pendingOrders: 'ការបញ្ជាទិញកំពុងរង់ចាំ',
    book: 'សៀវភៅ', buyer: 'អ្នកទិញ', frozenAmount: 'ប្រាក់បង្កក', deliveryCompany: 'ក្រុមហ៊ុនដឹកជញ្ជូន',
    status: 'ស្ថានភាព', order: 'ការបញ្ជាទិញ', chatReader: 'ឆាតទៅអ្នកអាន', viewDetails: 'មើលលម្អិត', proofSent: 'បានផ្ញើភស្តុតាង',
    adminApproval: 'ការអនុម័តរបស់ Admin', adminNote: 'បើអ្នកអានមិនអាចបញ្ជាក់បាន Admin អាចពិនិត្យភស្តុតាង ហើយដោះលែងប្រាក់ដោយប្រើ Passkey។',
    adminHelp: 'សុំជំនួយពី Admin', comingSoon: 'មកដល់ឆាប់ៗ', comingSoonMessage: 'មុខងារនេះមិនទាន់បើកឱ្យប្រើទេ។',
    details: 'ព័ត៌មានលម្អិតការបញ្ជាទិញ', close: 'បិទ', back: 'ត្រឡប់ក្រោយ', noOrders: 'មិនមានការបញ្ជាទិញក្នុងផ្នែកនេះទេ។',
    deliveryProof: 'ភស្តុតាងដឹកជញ្ជូន', notAvailable: 'មិនទាន់មានភស្តុតាង', example: 'សៀវភៅ',
    securityNote: 'ទំព័រនេះបង្ហាញកំណត់ត្រាប្រាក់រង់ចាំពិត។ ការហាមដកប្រាក់ត្រូវភ្ជាប់ Backend ដាច់ដោយឡែក។',
    loading: 'កំពុងផ្ទុកការបញ្ជាទិញ...', loadFailed: 'មិនអាចទាញប្រាក់រង់ចាំបានទេ។', retry: 'សាកល្បងម្តងទៀត', loadMore: 'ផ្ទុកបន្ថែម ១០', trackingNumber: 'លេខតាមដាន'
  },
  zh: {
    title: '待结算余额', totalPending: '待结算总额', orders: '订单', bookOnly: '仅纸质书',
    frozenNote: '纸质书收入计划在读者确认收货或管理员批准后才能解除保留。', preview: '真实订单记录 · 提现保护尚未启用',
    all: '全部', awaitingReader: '等待读者确认', underReview: '审核中', pendingOrders: '待处理订单',
    book: '纸质书', buyer: '买家', frozenAmount: '冻结金额', deliveryCompany: '配送公司',
    status: '状态', order: '订单', chatReader: '联系读者', viewDetails: '查看详情', proofSent: '已提交凭证',
    adminApproval: '管理员审批', adminNote: '如果读者无法确认，管理员可审核证据并使用密钥解冻款项。',
    adminHelp: '请求管理员协助', comingSoon: '即将推出', comingSoonMessage: '此功能尚未开放。',
    details: '订单详情', close: '关闭', back: '返回', noOrders: '此分类下暂无订单。',
    deliveryProof: '配送凭证', notAvailable: '尚未上传凭证', example: '纸质书',
    securityNote: '本页面显示真实的待结算记录。禁止提现的保护仍需另行更新后端。',
    loading: '正在加载待结算订单...', loadFailed: '无法加载待结算订单。', retry: '重试', loadMore: '再加载10条', trackingNumber: '物流单号'
  },
  ja: {
    title: '保留残高', totalPending: '保留中の合計', orders: '注文', bookOnly: '紙の書籍のみ',
    frozenNote: '書籍売上は読者の受取確認または管理者の承認まで保留する予定です。', preview: '実データ · 出金保護はまだ有効ではありません',
    all: 'すべて', awaitingReader: '読者の確認待ち', underReview: '審査中', pendingOrders: '保留中の注文',
    book: '書籍', buyer: '購入者', frozenAmount: '保留金額', deliveryCompany: '配送会社',
    status: '状態', order: '注文', chatReader: '読者に連絡', viewDetails: '詳細を見る', proofSent: '証拠提出済み',
    adminApproval: '管理者の承認', adminNote: '読者が確認できない場合、管理者は証拠を審査し、パスキーで支払いを解除できます。',
    adminHelp: '管理者に相談', comingSoon: '近日公開', comingSoonMessage: 'この機能はまだ利用できません。',
    details: '注文詳細', close: '閉じる', back: '戻る', noOrders: 'このカテゴリーの注文はありません。',
    deliveryProof: '配送証明', notAvailable: '証明書未提出', example: '書籍',
    securityNote: 'この画面には実際の保留レコードが表示されます。出金のブロックには別途バックエンドの更新が必要です。',
    loading: '保留中の注文を読み込み中...', loadFailed: '保留中の注文を読み込めません。', retry: '再試行', loadMore: 'さらに10件読み込む', trackingNumber: '追跡番号'
  },
  ko: {
    title: '보류 잔액', totalPending: '총 보류 금액', orders: '주문', bookOnly: '종이책만',
    frozenNote: '도서 판매 수익은 독자의 수령 확인 또는 관리자 승인까지 보류하도록 계획되었습니다.', preview: '실제 주문 기록 · 출금 보호 아직 미적용',
    all: '전체', awaitingReader: '독자 확인 대기', underReview: '검토 중', pendingOrders: '보류 주문',
    book: '도서', buyer: '구매자', frozenAmount: '보류 금액', deliveryCompany: '배송 업체',
    status: '상태', order: '주문', chatReader: '독자에게 채팅', viewDetails: '상세 보기', proofSent: '증빙 제출됨',
    adminApproval: '관리자 승인', adminNote: '독자가 확인할 수 없다면 관리자가 증빙을 검토하고 패스키로 결제를 해제할 수 있습니다.',
    adminHelp: '관리자 도움 요청', comingSoon: '출시 예정', comingSoonMessage: '아직 이용할 수 없는 기능입니다.',
    details: '주문 상세', close: '닫기', back: '뒤로', noOrders: '이 카테고리에 주문이 없습니다.',
    deliveryProof: '배송 증빙', notAvailable: '제출된 증빙 없음', example: '도서',
    securityNote: '이 페이지는 실제 보류 기록을 표시합니다. 출금 차단에는 별도의 백엔드 업데이트가 필요합니다.',
    loading: '보류 주문을 불러오는 중...', loadFailed: '보류 주문을 불러오지 못했습니다.', retry: '다시 시도', loadMore: '10건 더 보기', trackingNumber: '운송장 번호'
  }
})

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com'

const STATUS_FILTERS = { all: 'all', awaitingReader: 'awaiting_reader', underReview: 'under_review' }
const DATE_LOCALES = { km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

function displayDate(value, language) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(DATE_LOCALES[language] || 'en-US')
}

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function InfoLine({ label, value, accent = false }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 text-[13px]">
      <span className="shrink-0 text-[var(--shadow-text-secondary)]">{label}</span>
      <span className={`min-w-0 break-words text-right font-semibold ${accent ? 'text-violet-600' : 'text-[var(--shadow-text-primary)]'}`}>{value}</span>
    </div>
  )
}

export default function AuthorStorePendingBalancePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`authorStorePendingBalance.${key}`)
  const [filter, setFilter] = useState('all')
  const [activeOrder, setActiveOrder] = useState(null)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [orders, setOrders] = useState([])
  const [summary, setSummary] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const language = getDisplayLanguageId()
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const controller = new AbortController()
    async function loadPending() {
      setLoading(true)
      setLoadError(false)
      if (page === 1) {
        setOrders([])
        setSummary(null)
        setHasMore(false)
      }
      try {
        const params = new URLSearchParams({ status: STATUS_FILTERS[filter], page: String(page), limit: '10' })
        const response = await fetch(`${API_BASE_URL}/api/author-store/me/book-pending?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store',
        })
        const data = await response.json().catch(() => null)
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        if (!response.ok || data?.ok !== true || !Array.isArray(data.orders) ||
            !data.summary || !Number.isFinite(Number(data.summary.total_pending)) ||
            !Number.isSafeInteger(Number(data.summary.total_orders))) {
          throw new Error('Invalid pending balance response')
        }
        if (controller.signal.aborted) return
        setSummary(data.summary)
        setOrders((previous) => {
          if (page === 1) return data.orders
          const seen = new Set(previous.map((item) => String(item.id)))
          return [...previous, ...data.orders.filter((item) => !seen.has(String(item.id)))]
        })
        setHasMore(data.has_next === true)
      } catch {
        if (!controller.signal.aborted) setLoadError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void loadPending()
    return () => controller.abort()
  }, [filter, page, retry, token, navigate])

  const chooseFilter = (key) => {
    if (key === filter) return
    setFilter(key)
    setPage(1)
    setOrders([])
    setHasMore(false)
    setLoadError(false)
    setActiveOrder(null)
  }

  const visibleOrders = orders
  const pendingTotal = summary?.total_pending
  const filters = [
    { key: 'all', label: tr('all') },
    { key: 'awaitingReader', label: tr('awaitingReader') },
    { key: 'underReview', label: tr('underReview') }
  ]
  const closeModal = () => { setActiveOrder(null); setShowComingSoon(false) }

  return (
    <main className="min-h-screen bg-[var(--shadow-bg-soft)] px-4 pb-28 pt-4 text-[var(--shadow-text-primary)]">
      <div className="mx-auto max-w-xl">
        <header className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/author/page/store/withdrawal-details')}
            aria-label={tr('back')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]"
          >
            <i className="fa-solid fa-arrow-left text-[16px]" aria-hidden="true" />
          </button>
          <h1 className="min-w-0 flex-1 pr-11 text-center text-[19px] font-bold">{tr('title')}</h1>
        </header>

        <section
          className="relative overflow-hidden rounded-[25px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-6 shadow-sm"
          style={{ backgroundImage: 'linear-gradient(115deg, var(--shadow-bg-surface) 22%, rgba(139, 92, 246, 0.16) 100%)' }}
        >
          <div className="relative z-10 max-w-[85%]">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[var(--shadow-text-secondary)]">{tr('totalPending')}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5 text-[11px] font-bold text-violet-600">
                <i className="fa-solid fa-book-open" aria-hidden="true" /> {tr('bookOnly')}
              </span>
            </div>
            <p className="mt-2 text-[38px] font-extrabold leading-tight tracking-tight text-violet-600">{pendingTotal === undefined ? '—' : CURRENCY.format(Number(pendingTotal))}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--shadow-text-secondary)]">{summary ? summary.total_orders : '—'} {tr('orders')}</p>
          </div>
          <i className="fa-solid fa-file-invoice-dollar pointer-events-none absolute right-5 top-12 text-[76px] text-violet-500/20" aria-hidden="true" />
          <p className="relative z-10 mt-5 max-w-[95%] text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('frozenNote')}</p>
        </section>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
          <i className="fa-solid fa-circle-info" aria-hidden="true" /> {tr('preview')}
        </p>

        <div className="mt-5 flex gap-1 rounded-[20px] bg-[var(--shadow-bg-surface)] p-1 shadow-sm ring-1 ring-[var(--shadow-border)]" role="group" aria-label={tr('pendingOrders')}>
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => chooseFilter(key)}
              className={`min-w-0 flex-1 rounded-[15px] px-2 py-3 text-[12px] font-semibold transition-colors ${filter === key ? 'bg-violet-600 text-white' : 'text-[var(--shadow-text-secondary)] hover:bg-violet-500/10'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-[17px] font-bold">{tr('pendingOrders')}</h2>
        {loading && page === 1 ? (
          <div role="status" className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-8 text-center text-sm text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]">{tr('loading')}</div>
        ) : loadError && page === 1 ? null : visibleOrders.length === 0 ? (
          <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-8 text-center text-sm text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]">{tr('noOrders')}</div>
        ) : (
          <div className="space-y-4">
            {visibleOrders.map((order) => (
              <article key={order.id} className="rounded-[23px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-[11px] font-bold text-violet-600">{tr('book')}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${order.status === 'under_review' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    <i className={`fa-solid ${order.status === 'under_review' ? 'fa-hourglass-half' : 'fa-clock'}`} aria-hidden="true" />
                    {tr(order.status === 'under_review' ? 'underReview' : 'awaitingReader')}
                  </span>
                </div>
                <h3 className="mt-3 break-words text-[15px] font-bold">{order.title}</h3>
                <p className="mt-1 break-all text-[11px] text-[var(--shadow-text-secondary)]">{tr('order')} #{order.orderId || order.id} · {displayDate(order.date, language)}</p>
                <div className="mt-3 border-t border-[var(--shadow-border)] pt-2">
                  <InfoLine label={tr('buyer')} value={order.buyer} />
                  <InfoLine label={tr('frozenAmount')} value={CURRENCY.format(order.amount)} accent />
                  <InfoLine label={tr('deliveryCompany')} value={order.deliveryCompany} />
                  <InfoLine label={tr('status')} value={tr(order.status === 'under_review' ? 'underReview' : 'awaitingReader')} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setShowComingSoon(true)} className="flex min-w-0 items-center justify-center gap-2 rounded-[15px] border border-violet-500 px-2 py-3 text-[12px] font-bold text-violet-600">
                    <i className="fa-solid fa-comments" aria-hidden="true" /> {tr('chatReader')}
                  </button>
                  <button type="button" onClick={() => setActiveOrder(order)} className="flex min-w-0 items-center justify-center gap-2 rounded-[15px] bg-violet-600 px-2 py-3 text-[12px] font-bold text-white">
                    <i className={`fa-solid ${order.proofSent ? 'fa-shield-halved' : 'fa-clipboard-list'}`} aria-hidden="true" />
                    {tr(order.proofSent ? 'proofSent' : 'viewDetails')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {loading && page > 1 && <p role="status" className="mt-3 text-center text-xs text-[var(--shadow-text-secondary)]">{tr('loading')}</p>}
        {loadError && (
          <div role="alert" className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-sm text-red-600">
            <span>{tr('loadFailed')}</span>
            <button type="button" onClick={() => setRetry((value) => value + 1)} className="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white">{tr('retry')}</button>
          </div>
        )}
        {!loading && !loadError && hasMore && (
          <button type="button" onClick={() => setPage((value) => value + 1)} className="mt-4 w-full rounded-[15px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-sm font-semibold text-violet-600">{tr('loadMore')}</button>
        )}

        <section className="mt-5 rounded-[23px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xl text-violet-600">
              <i className="fa-solid fa-lock" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">{tr('adminApproval')}</h2>
              <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('adminNote')}</p>
              <button type="button" onClick={() => setShowComingSoon(true)} className="mt-3 rounded-full bg-violet-500/10 px-4 py-2.5 text-[12px] font-bold text-violet-600">
                <i className="fa-solid fa-headset mr-1.5" aria-hidden="true" /> {tr('adminHelp')} · {tr('comingSoon')}
              </button>
            </div>
          </div>
        </section>
        <p className="mt-4 text-center text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">{tr('securityNote')}</p>
      </div>

      {(showComingSoon || activeOrder) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal() }}>
          <div role="dialog" aria-modal="true" aria-labelledby="pending-balance-dialog-title" className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 text-[var(--shadow-text-primary)] shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 id="pending-balance-dialog-title" className="text-[17px] font-bold">{showComingSoon ? tr('comingSoon') : tr('details')}</h2>
              <button type="button" aria-label={tr('close')} onClick={closeModal} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>
            {showComingSoon ? (
              <p className="mt-5 text-sm leading-6 text-[var(--shadow-text-secondary)]">{tr('comingSoonMessage')}</p>
            ) : activeOrder ? (
              <div className="mt-4 border-t border-[var(--shadow-border)] pt-3">
                <InfoLine label={tr('book')} value={activeOrder.title} />
                <InfoLine label={tr('order')} value={activeOrder.orderId || activeOrder.id} />
                <InfoLine label={tr('buyer')} value={activeOrder.buyer} />
                <InfoLine label={tr('frozenAmount')} value={CURRENCY.format(activeOrder.amount)} accent />
                <InfoLine label={tr('deliveryCompany')} value={activeOrder.deliveryCompany} />
                <InfoLine label={tr('status')} value={tr(activeOrder.status === 'under_review' ? 'underReview' : 'awaitingReader')} />
                <InfoLine label={tr('trackingNumber')} value={activeOrder.trackingNumber || '—'} />
                <InfoLine label={tr('deliveryProof')} value={activeOrder.proofSent ? tr('proofSent') : tr('notAvailable')} />
                {!activeOrder.proofSent &&
  ['awaiting_reader', 'under_review'].includes(activeOrder.status) &&
  ['shipped', 'completed'].includes(String(activeOrder.orderStatus || '').toLowerCase()) && (
    <AuthorBookEvidencePanel
      key={activeOrder.id}
      order={activeOrder}
      onSaved={() => { setActiveOrder(null); setPage(1); setRetry((n) => n + 1) }}
    />
)}
              </div>
            ) : null}
            <button type="button" onClick={closeModal} className="mt-5 w-full rounded-[15px] bg-violet-600 px-4 py-3 text-sm font-bold text-white">{tr('close')}</button>
          </div>
        </div>
      )}
    </main>
  )
}

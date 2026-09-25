import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoreWithdrawalDetails', {
  en: { title: 'Withdrawal Details', available: 'Available for Withdrawal', minimum: 'Minimum withdrawal: $10.00', request: 'Request Withdrawal', all: 'All', book: 'Book', pdf: 'PDF', history: 'Earnings history', empty: 'No earnings to display yet.', pending: 'Loading verified balance...', failed: 'Could not load your balance. Please try again.', price: 'Product price', shipping: 'Delivery fee', company: 'Delivery company', fee: 'Service fee', amount: 'Amount credited', order: 'Order', back: 'Back' },
  km: { title: 'ព័ត៌មានលម្អិតប្រាក់ដក', available: 'ប្រាក់ដែលអាចដកបាន', minimum: 'ចំនួនដកអប្បបរមា៖ $10.00', request: 'ស្នើសុំដកប្រាក់', all: 'ទាំងអស់', book: 'សៀវភៅ', pdf: 'PDF', history: 'ប្រវត្តិចំណូល', empty: 'មិនទាន់មានចំណូលត្រូវបង្ហាញ', pending: 'កំពុងផ្ទុកសមតុល្យប្រាក់ដែលបានផ្ទៀងផ្ទាត់...', failed: 'មិនអាចផ្ទុកសមតុល្យប្រាក់បានទេ។ សូមសាកល្បងម្តងទៀត។', price: 'តម្លៃផលិតផល', shipping: 'ថ្លៃដឹកជញ្ជូន', company: 'ក្រុមហ៊ុនដឹកជញ្ជូន', fee: 'ថ្លៃសេវា', amount: 'ប្រាក់ដែលបានបញ្ចូល', order: 'ការបញ្ជាទិញ', back: 'ត្រឡប់ក្រោយ' },
  zh: { title: '提现详情', available: '可提现金额', minimum: '最低提现金额：$10.00', request: '申请提现', all: '全部', book: '纸质书', pdf: 'PDF', history: '收入记录', empty: '暂无收入记录', pending: '正在加载已核实的余额...', failed: '无法加载余额，请重试。', price: '商品价格', shipping: '配送费', company: '配送公司', fee: '服务费', amount: '入账金额', order: '订单', back: '返回' },
  ja: { title: '出金明細', available: '出金可能額', minimum: '最低出金額：$10.00', request: '出金を申請', all: 'すべて', book: '書籍', pdf: 'PDF', history: '収益履歴', empty: '収益履歴はありません', pending: '確認済みの残高を読み込み中...', failed: '残高を読み込めませんでした。もう一度お試しください。', price: '商品価格', shipping: '配送料', company: '配送会社', fee: 'サービス手数料', amount: '計上額', order: '注文', back: '戻る' },
  ko: { title: '출금 상세', available: '출금 가능 금액', minimum: '최소 출금액: $10.00', request: '출금 신청', all: '전체', book: '책', pdf: 'PDF', history: '수익 내역', empty: '표시할 수익이 없습니다', pending: '확인된 잔액을 불러오는 중...', failed: '잔액을 불러오지 못했습니다. 다시 시도해 주세요.', price: '상품 가격', shipping: '배송비', company: '배송 업체', fee: '서비스 수수료', amount: '적립 금액', order: '주문', back: '뒤로' },
})

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com'

function money(value) {
  const number = Number(value)
  return Number.isFinite(number) ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number) : '—'
}

function DetailRow({ label, value }) {
  return <div className="flex items-center justify-between gap-3 py-1 text-[12px]"><span className="text-[var(--shadow-text-secondary)]">{label}</span><span className="text-right font-semibold text-[var(--shadow-text-primary)]">{value}</span></div>
}

export default function AuthorStoreWithdrawalDetailsPage({ earnings = [] }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [filter, setFilter] = useState('all')
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
    if (!token) {
      navigate('/login', { replace: true })
      return () => controller.abort()
    }
    async function loadBalance() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/author-store/me/income`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        const data = await response.json()
        if (!response.ok || data.ok === false || !Number.isFinite(Number(data.summary?.available_balance))) {
          throw new Error('Invalid withdrawal balance')
        }
        if (!controller.signal.aborted) setBalance(Number(data.summary.available_balance))
      } catch {
        if (!controller.signal.aborted) setLoadError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadBalance()
    return () => controller.abort()
  }, [navigate])

  const translate = (key) => t(`authorStoreWithdrawalDetails.${key}`)
  const list = useMemo(() => Array.isArray(earnings) ? earnings.filter((item) => (filter === 'all' || item.type === filter) && (item.type === 'book' || item.type === 'pdf')) : [], [earnings, filter])
  const canRequest = !loading && !loadError && Number.isFinite(balance) && balance >= 10
  const language = getDisplayLanguageId()

  return (
    <main className="min-h-screen bg-[var(--shadow-bg-soft)] px-4 pb-24 pt-4 text-[var(--shadow-text-primary)]">
      <div className="mx-auto max-w-xl">
        <header className="mb-5 flex items-center gap-4">
          <button type="button" aria-label={translate('back')} onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]"><span aria-hidden="true">←</span></button>
          <h1 className="text-lg font-black">{translate('title')}</h1>
        </header>
        <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <p className="text-xs font-semibold text-[var(--shadow-text-secondary)]">{translate('available')}</p>
          <p className="mt-2 text-[30px] font-black text-emerald-600">{balance !== null && !loadError ? money(balance) : '—'}</p>
          <p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{translate('minimum')}</p>
          {loading && <p className="mt-2 text-xs text-[var(--shadow-text-secondary)]">{translate('pending')}</p>}
          {loadError && <p role="alert" className="mt-2 text-xs text-red-600">{translate('failed')}</p>}
          <button type="button" disabled={!canRequest} onClick={() => navigate('/author/page/finance/withdrawal')} className="mt-5 w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{translate('request')}</button>
        </section>
        <section className="mt-5">
          <div className="flex gap-2 rounded-2xl bg-[var(--shadow-bg-surface)] p-1 ring-1 ring-[var(--shadow-border)]">
            {['all', 'book', 'pdf'].map((type) => <button key={type} type="button" aria-pressed={filter === type} onClick={() => setFilter(type)} className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-sm font-bold ${filter === type ? 'bg-violet-600 text-white' : 'text-[var(--shadow-text-secondary)]'}`}>{translate(type)}</button>)}
          </div>
          <h2 className="mb-3 mt-6 text-sm font-black">{translate('history')}</h2>
          {list.length === 0 && <div className="rounded-2xl bg-[var(--shadow-bg-surface)] p-8 text-center text-sm text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]">{translate('empty')}</div>}
          <div className="space-y-3">
            {list.map((item, index) => <article key={item.id || `${item.type}-${index}`} className="rounded-2xl bg-[var(--shadow-bg-surface)] p-4 ring-1 ring-[var(--shadow-border)]">
              <div className="flex items-start justify-between gap-2"><div className="min-w-0"><span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-700">{translate(item.type)}</span><h3 className="mt-2 break-words text-sm font-bold">{item.title || '—'}</h3><p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{translate('order')} #{item.orderId || '—'}{item.date ? ` · ${new Date(item.date).toLocaleDateString(language)}` : ''}</p></div><span className="shrink-0 text-sm font-black text-emerald-600">{money(item.creditedAmount)}</span></div>
              <div className="mt-3 border-t border-[var(--shadow-border)] pt-2"><DetailRow label={translate('price')} value={money(item.price)} />{item.type === 'book' && <><DetailRow label={translate('shipping')} value={money(item.shippingFee)} /><DetailRow label={translate('company')} value={item.shippingCompany || '—'} /></>}<DetailRow label={translate('fee')} value={money(item.serviceFee)} /><DetailRow label={translate('amount')} value={money(item.creditedAmount)} /></div>
            </article>)}
          </div>
        </section>
      </div>
    </main>
  )
}

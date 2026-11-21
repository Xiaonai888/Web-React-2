import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Download, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { fetchAuthorPreOrder, verifyAuthorPreOrderAccess } from '../../services/authorPreOrder.service'
import { downloadAuthorPreOrderPaidOrdersExcel, fetchAuthorPreOrderPaidOrders } from '../../services/authorPreOrderReportsApi'
import AuthorPreOrderPaidOrderCard from '../../components/author/preorder/AuthorPreOrderPaidOrderCard'

const TEXT = {
  en: { title: 'Pre-order Orders', all: 'All records', paid: 'Paid Orders', export: 'Excel', exporting: 'Exporting...', campaign: 'Master Record', book: 'Book', allBooks: 'All books', edition: 'Edition', allEditions: 'All editions', standard: 'Standard', limited: 'Limited', period: 'Paid Date', from: 'From', to: 'To', today: 'Today', week: '7 days', month: '30 days', clear: 'All dates', sort: 'Sort', newest: 'Newest paid', oldest: 'Oldest paid', highest: 'Highest amount', details: 'Successful payments only', summary: 'Current loaded page', standardUnits: 'Standard copies', limitedUnits: 'Limited copies', noOrders: 'No paid orders match these filters.', loadMore: 'Load more', loading: 'Loading...', retry: 'Retry', access: 'You do not have access to this page.', missing: 'Could not load record details.', dateError: 'Start date must not exceed end date.' },
  km: { title: 'ការកក់សៀវភៅ', all: 'គ្រប់រឿង', paid: 'ការទូទាត់ជោគជ័យ', export: 'Excel', exporting: 'កំពុងទាញ...', campaign: 'រឿង', book: 'សៀវភៅ', allBooks: 'គ្រប់សៀវភៅ', edition: 'ប្រភេទ', allEditions: 'គ្រប់ប្រភេទ', standard: 'ធម្មតា', limited: 'មានកំណត់', period: 'ថ្ងៃបង់ប្រាក់', from: 'ចាប់ពី', to: 'ដល់', today: 'ថ្ងៃនេះ', week: '៧ថ្ងៃ', month: '៣០ថ្ងៃ', clear: 'គ្រប់ថ្ងៃ', sort: 'រៀបតាម', newest: 'ថ្មីបំផុត', oldest: 'ចាស់បំផុត', highest: 'ប្រាក់ច្រើនបំផុត', details: 'រាប់តែអ្នកបង់ប្រាក់ជោគជ័យ', summary: 'ទិន្នន័យដែលបានផ្ទុក', standardUnits: 'ចំនួនធម្មតា', limitedUnits: 'ចំនួនមានកំណត់', noOrders: 'គ្មានការកក់បានបង់ប្រាក់តាម Filter នេះទេ។', loadMore: 'មើលបន្ថែម', loading: 'កំពុងផ្ទុក...', retry: 'សាកម្ដងទៀត', access: 'គណនីនេះមិនមានសិទ្ធិចូលទេ។', missing: 'មិនអាចទាញព័ត៌មានរឿង។', dateError: 'ថ្ងៃចាប់ផ្ដើមមិនអាចក្រោយថ្ងៃបញ្ចប់។' },
  zh: { title: '预订订单', all: '所有记录', paid: '已付款订单', export: 'Excel', exporting: '导出中...', campaign: '主要记录', book: '书籍', allBooks: '所有书籍', edition: '版本', allEditions: '全部版本', standard: '普通版', limited: '限量版', period: '付款日期', from: '开始', to: '结束', today: '今天', week: '7天', month: '30天', clear: '全部日期', sort: '排序', newest: '最新付款', oldest: '最早付款', highest: '最高金额', details: '仅统计付款成功订单', summary: '当前已加载页面', standardUnits: '普通版数量', limitedUnits: '限量版数量', noOrders: '没有符合条件的付款订单。', loadMore: '加载更多', loading: '加载中...', retry: '重试', access: '无法访问该页面。', missing: '无法加载记录详情。', dateError: '开始日期不得晚于结束日期。' },
  ja: { title: '予約注文', all: 'すべての記録', paid: '支払済み注文', export: 'Excel', exporting: '書き出し中...', campaign: '記録', book: '書籍', allBooks: '全書籍', edition: 'エディション', allEditions: 'すべて', standard: '通常版', limited: '限定版', period: '支払日', from: '開始', to: '終了', today: '今日', week: '7日間', month: '30日間', clear: '全期間', sort: '並び順', newest: '新しい順', oldest: '古い順', highest: '金額順', details: '支払成功分のみ', summary: '読み込み済みページ', standardUnits: '通常版の冊数', limitedUnits: '限定版の冊数', noOrders: '該当する支払済み注文はありません。', loadMore: 'もっと見る', loading: '読み込み中...', retry: '再試行', access: 'アクセスできません。', missing: '詳細を読み込めません。', dateError: '開始日は終了日以前にしてください。' },
  ko: { title: '예약 주문', all: '모든 기록', paid: '결제 완료 주문', export: 'Excel', exporting: '내보내는 중...', campaign: '기록', book: '도서', allBooks: '모든 도서', edition: '에디션', allEditions: '전체', standard: '일반판', limited: '한정판', period: '결제일', from: '시작', to: '종료', today: '오늘', week: '7일', month: '30일', clear: '전체 기간', sort: '정렬', newest: '최신 결제', oldest: '오래된 결제', highest: '금액순', details: '결제 성공 주문만 집계', summary: '현재 로드된 페이지', standardUnits: '일반판 수량', limitedUnits: '한정판 수량', noOrders: '조건에 맞는 결제 완료 주문이 없습니다.', loadMore: '더 보기', loading: '불러오는 중...', retry: '다시 시도', access: '접근 권한이 없습니다.', missing: '기록을 불러올 수 없습니다.', dateError: '시작일은 종료일보다 늦을 수 없습니다.' },
}

const INPUT = 'w-full min-w-0 rounded-[11px] border border-[#e3e3e3] bg-white px-3 py-2.5 text-[12px] text-[#292929] outline-none focus:border-[#999]'

function khDate(offsetDays) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const item = type => Number(parts.find(p => p.type === type)?.value || 0)
  return new Date(Date.UTC(item('year'), item('month') - 1, item('day') + offsetDays)).toISOString().slice(0, 10)
}

export default function AuthorPreOrderOrdersPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { language } = useDisplayTranslation()
  const t = TEXT[language] || TEXT.en
  const [params] = useSearchParams()
  const campaignId = params.get('campaign_id') || ''
  const [access, setAccess] = useState('checking')
  const [accessError, setAccessError] = useState('')
  const [campaign, setCampaign] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [bookId, setBookId] = useState('')
  const [edition, setEdition] = useState('all')
  const [sort, setSort] = useState('newest')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [reload, setReload] = useState(0)
  const [showFilters, setShowFilters] = useState(true)

  const updateSelection = useCallback((setter, value) => {
    setter(value)
    setPage(1)
    setOrders([])
    setError('')
    setExportError('')
  }, [])

  useEffect(() => {
    let mounted = true
    setAccess('checking')
    verifyAuthorPreOrderAccess().then(() => { if (mounted) setAccess('allowed') }).catch(e => {
      if (mounted) { setAccessError(e.message || t.access); setAccess('denied') }
    })
    return () => { mounted = false }
  }, [reload])

  useEffect(() => {
    const controller = new AbortController()
    setCampaign(null)
    setBookId('')
    setPage(1)
    setOrders([])
    setDetailError('')
    if (access === 'allowed' && campaignId) {
      fetchAuthorPreOrder(campaignId, { signal: controller.signal })
        .then(data => { if (!controller.signal.aborted) setCampaign(data) })
        .catch(e => { if (!controller.signal.aborted) setDetailError(e.message || t.missing) })
    }
    return () => controller.abort()
  }, [campaignId, access, reload])

  const filters = useMemo(() => ({ campaignId, bookId, edition, sort, from, to }), [campaignId, bookId, edition, sort, from, to])
  const dateInvalid = Boolean(from && to && from > to)

  useEffect(() => {
    if (access !== 'allowed' || dateInvalid || (campaignId && detailError)) return undefined
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetchAuthorPreOrderPaidOrders({ ...filters, page, limit: 20 }, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return
        setOrders(current => page === 1 ? data.orders : [...current, ...data.orders.filter(item => !current.some(old => old.id === item.id))])
        setTotal(Number(data.total_paid_orders || 0))
        setHasMore(data.has_more === true)
      }).catch(e => { if (!controller.signal.aborted) setError(e.message || t.noOrders) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [access, dateInvalid, campaignId, detailError, filters, page, reload])

  const visibleStandard = orders.reduce((sum, order) => sum + Number(order.standard_units || 0), 0)
  const visibleLimited = orders.reduce((sum, order) => sum + Number(order.limited_units || 0), 0)

  async function exportExcel() {
    if (exporting || loading || dateInvalid || error || detailError || access !== 'allowed') return
    setExporting(true)
    setExportError('')
    try {
      await downloadAuthorPreOrderPaidOrdersExcel(filters)
    } catch (e) {
      setExportError(e.message || 'Excel export failed.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(28px+env(safe-area-inset-bottom))] text-[#191919]">
      <div className="mx-auto max-w-[720px] px-4 pt-3 sm:px-6">
        <header className="flex min-h-12 items-center gap-3">
          <button type="button" onClick={() => navigate('/author/page/pre-order')} aria-label="Back" className="flex h-10 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#f6f6f6]"><ArrowLeft size={21} /></button>
          <h1 className="min-w-0 flex-1 truncate text-[18px] font-bold">{t.title}</h1>
          <button type="button" disabled={exporting || access !== 'allowed' || dateInvalid || !orders.length || Boolean(detailError)} onClick={exportExcel} className="flex shrink-0 items-center gap-1.5 rounded-[11px] border border-[#dadada] px-3 py-2.5 text-[12px] font-semibold disabled:opacity-40"><Download size={16} />{exporting ? t.exporting : t.export}</button>
        </header>
        {access === 'checking' ? <p className="py-16 text-center text-[13px] text-[#777]">{t.loading}</p> : access === 'denied' ? (
          <div className="mt-12 rounded-xl bg-[#f7f7f7] p-5 text-center text-[13px] text-[#555]"><p>{accessError || t.access}</p><button type="button" onClick={() => setReload(v => v + 1)} className="mt-3 rounded-xl border border-[#ddd] px-4 py-2">{t.retry}</button></div>
        ) : (
          <>
            <div className="mt-4 rounded-[15px] border border-[#e9e9e9] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0"><p className="text-[11px] text-[#777]">{t.campaign}</p><p className="mt-1 truncate text-[14px] font-bold">{campaignId ? campaign?.title || t.loading : t.all}</p></div>
                {campaignId ? <button type="button" onClick={() => navigate('/author/page/pre-order/orders')} className="shrink-0 rounded-full border border-[#dedede] px-3 py-1.5 text-[11px] font-semibold">{t.all}</button> : null}
              </div>
              <p className="mt-2 text-[11px] text-[#777]">{t.details}</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div><p className="text-[11px] text-[#777]">{t.paid}</p><p className="text-[25px] font-bold tabular-nums">{total.toLocaleString()}</p></div>
              <button type="button" onClick={() => setShowFilters(value => !value)} aria-expanded={showFilters} className="flex items-center gap-2 rounded-[11px] border border-[#dedede] px-3 py-2 text-[12px] font-semibold"><SlidersHorizontal size={15} />{t.sort}</button>
            </div>
            {showFilters ? (
              <section className="mt-3 space-y-3 rounded-[15px] border border-[#ececec] p-3.5">
                {campaign && Array.isArray(campaign.books) ? (
                  <label className="block space-y-1.5"><span className="text-[11px] font-semibold text-[#555]">{t.book}</span><select value={bookId} onChange={e => updateSelection(setBookId, e.target.value)} className={INPUT}><option value="">{t.allBooks}</option>{campaign.books.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}</select></label>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5"><span className="text-[11px] font-semibold text-[#555]">{t.edition}</span><select value={edition} onChange={e => updateSelection(setEdition, e.target.value)} className={INPUT}><option value="all">{t.allEditions}</option><option value="standard">{t.standard}</option><option value="limited">{t.limited}</option></select></label>
                  <label className="block space-y-1.5"><span className="text-[11px] font-semibold text-[#555]">{t.sort}</span><select value={sort} onChange={e => updateSelection(setSort, e.target.value)} className={INPUT}><option value="newest">{t.newest}</option><option value="oldest">{t.oldest}</option><option value="highest">{t.highest}</option></select></label>
                </div>
                <p className="text-[11px] font-semibold text-[#555]">{t.period}</p>
                <div className="grid grid-cols-4 gap-1.5">{[['today',0],['week',6],['month',29],['clear',null]].map(([label,days]) => <button type="button" key={label} onClick={() => { setFrom(days === null ? '' : khDate(-days)); setTo(days === null ? '' : khDate(0)); setOrders([]); setPage(1); setExportError('') }} className="rounded-[9px] border border-[#e5e5e5] px-1.5 py-2 text-[10px] font-medium text-[#555]">{t[label]}</button>)}</div>
                <div className="grid grid-cols-2 gap-3"><label className="block space-y-1.5"><span className="text-[11px] font-semibold text-[#555]">{t.from}</span><input type="date" value={from} onChange={e => updateSelection(setFrom, e.target.value)} className={INPUT} /></label><label className="block space-y-1.5"><span className="text-[11px] font-semibold text-[#555]">{t.to}</span><input type="date" value={to} onChange={e => updateSelection(setTo, e.target.value)} className={INPUT} /></label></div>
                {dateInvalid ? <p role="alert" className="text-[12px] text-[#9f3c2c]">{t.dateError}</p> : null}
              </section>
            ) : null}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f7f7f7] px-3 py-3"><p className="text-[10px] text-[#777]">{t.standardUnits} · {t.summary}</p><p className="mt-1 text-[18px] font-bold">{visibleStandard}</p></div>
              <div className="rounded-xl bg-[#f7f7f7] px-3 py-3"><p className="text-[10px] text-[#777]">{t.limitedUnits} · {t.summary}</p><p className="mt-1 text-[18px] font-bold">{visibleLimited}</p></div>
            </div>
            {detailError ? <p role="alert" className="mt-4 rounded-xl bg-[#faf7f6] p-3 text-[12px] text-[#8d463c]">{detailError}</p> : null}
            {error ? <div className="mt-4 rounded-xl border border-[#eee] p-4 text-[12px] text-[#5c5c5c]"><p role="alert">{error}</p><button type="button" onClick={() => setReload(v => v + 1)} className="mt-2 flex items-center gap-1 font-semibold"><RefreshCw size={14} />{t.retry}</button></div> : null}
            {exportError ? <p role="alert" className="mt-3 rounded-xl bg-[#faf7f6] p-3 text-[12px] text-[#8d463c]">{exportError}</p> : null}
            <div className="mt-4 space-y-3">{orders.map(order => <AuthorPreOrderPaidOrderCard key={order.id} order={order} language={language} />)}</div>
            {!loading && !error && !detailError && !orders.length && !dateInvalid ? <p className="py-14 text-center text-[13px] text-[#777]">{t.noOrders}</p> : null}
            {loading ? <p role="status" className="py-8 text-center text-[12px] text-[#777]">{t.loading}</p> : null}
            {!loading && hasMore && !error ? <button type="button" onClick={() => setPage(p => p + 1)} className="mt-4 w-full rounded-xl border border-[#ddd] py-3 text-[13px] font-semibold">{t.loadMore}</button> : null}
          </>
        )}
      </div>
    </main>
  )
}

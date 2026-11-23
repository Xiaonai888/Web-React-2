import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Search, AlertCircle, RefreshCw, PackageOpen, FileSpreadsheet, ChevronRight } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { authorPreOrderText } from '../../utils/authorPreOrderRules'
import { fetchAuthorPreOrders, verifyAuthorPreOrderAccess } from '../../services/authorPreOrder.service'
import AuthorPreOrderCampaignCard from '../../components/author/preorder/AuthorPreOrderCampaignCard'

const FILTERS = ['all', 'active', 'scheduled', 'closed', 'completed', 'draft']

function AccessMessage({ icon: Icon, title, onRetry, retryText }) {
  return (
    <div className="mx-auto mt-20 flex max-w-[330px] flex-col items-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f5f5] text-[#777]"><Icon size={24} /></div>
      <p className="mt-4 text-[14px] font-medium leading-6 text-[#424242]">{title}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="mt-4 rounded-full border border-[#ddd] px-5 py-2.5 text-[12px] font-semibold text-[#333]">{retryText}</button> : null}
    </div>
  )
}

export default function AuthorPreOrderPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { language: lang } = useDisplayTranslation()
  const text = key => authorPreOrderText(lang, key)
  const [access, setAccess] = useState('checking')
  const [accessError, setAccessError] = useState('')
  const [accessRetry, setAccessRetry] = useState(0)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [delayedSearch, setDelayedSearch] = useState('')
  const [reload, setReload] = useState(0)
  const [items, setItems] = useState([])
  const [summary, setSummary] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setAccess('checking')
    setAccessError('')
    verifyAuthorPreOrderAccess().then(() => {
      if (active) setAccess('allowed')
    }).catch(err => {
      if (!active) return
      setAccessError(err.code || 'COUNTRY_VERIFICATION_FAILED')
      setAccess('denied')
    })
    return () => { active = false }
  }, [accessRetry])

  useEffect(() => {
    const timer = setTimeout(() => setDelayedSearch(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (access !== 'allowed') return undefined
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setPage(1)
    fetchAuthorPreOrders({ status: filter, search: delayedSearch, page: 1, signal: controller.signal }).then(result => {
      if (controller.signal.aborted) return
      setItems(result.items)
      setSummary(result.summary)
      setHasMore(result.hasMore)
    }).catch(err => {
      if (controller.signal.aborted) return
      setItems([])
      setError(err.code === 'PRE_ORDER_NOT_READY' ? text('noBackend') : err.message || text('error'))
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [access, filter, delayedSearch, reload])

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const result = await fetchAuthorPreOrders({ status: filter, search: delayedSearch, page: nextPage })
      setItems(current => [...current, ...result.items.filter(item => !current.some(existing => String(existing.id) === String(item.id)))])
      setPage(nextPage)
      setHasMore(result.hasMore)
    } catch (err) {
      setError(err.message || text('error'))
    } finally {
      setLoadingMore(false)
    }
  }, [page, filter, delayedSearch, hasMore, loading, loadingMore])

  const accessText = accessError === 'LOGIN_REQUIRED' ? text('loginRequired') : accessError === 'PRE_ORDER_ACCESS_DENIED' ? text('accessDenied') : text('verifyFailed')

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(24px+env(safe-area-inset-bottom))] text-[#171717]">
      <div className="mx-auto max-w-[720px] px-4 pt-3 sm:px-6">
        <header className="flex h-12 items-center gap-3">
          <button type="button" onClick={() => navigate('/author/page')} aria-label={text('back')} className="flex h-10 w-9 items-center justify-center rounded-full hover:bg-[#f5f5f5]"><ArrowLeft size={21} /></button>
          <h1 className="flex-1 text-[20px] font-bold">{text('pageTitle')}</h1>
          
        </header>
        {access === 'checking' ? <div className="py-20 text-center text-[13px] text-[#757575]">{text('loading')}</div> : access === 'denied' ? <AccessMessage icon={AlertCircle} title={accessText} retryText={text('retry')} onRetry={() => setAccessRetry(n => n + 1)} /> : (
          <>
            <div className="mt-5 space-y-2.5">
  <button
    type="button"
    onClick={() => navigate('/author/page/pre-order/create')}
    className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#ffcc28] px-4 py-3.5 text-[14px] font-bold text-black active:scale-[0.99]"
  >
    <Plus size={19} />
    {text('create')}
  </button>

  <button
    type="button"
    onClick={() => navigate('/author/page/pre-order/orders')}
    className="flex w-full items-center gap-3 rounded-[14px] border border-[#e5e5e5] bg-white px-4 py-3.5 text-left active:bg-[#fafafa]"
  >
    <FileSpreadsheet size={20} className="shrink-0 text-[#555]" />

    <span className="min-w-0 flex-1 text-[13px] font-semibold text-[#272727]">
      {text('orders')} · Excel
    </span>

    <ChevronRight size={17} className="shrink-0 text-[#888]" />
  </button>
</div>
            {summary ? (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {['all', 'active', 'scheduled', 'completed'].map(key => (
                  <div key={key} className="min-w-0 rounded-[12px] border border-[#ebebeb] bg-white px-1 py-3 text-center">
                    <div className="text-[18px] font-bold">{Number(summary[key] ?? (key === 'all' ? summary.total : 0) ?? 0).toLocaleString()}</div>
                    <div className="mt-1 truncate text-[10px] text-[#757575]">{text(key)}</div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label={text('pageTitle')}>
              {FILTERS.map(key => (
                <button type="button" role="tab" aria-selected={filter === key} key={key} onClick={() => setFilter(key)} className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold ${filter === key ? 'bg-[#ffcc28] text-black' : 'bg-[#f4f4f4] text-[#555]'}`}>{text(key)}</button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-[12px] border border-[#e2e2e2] px-3.5">
              <Search size={18} className="text-[#8b8b8b]" />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder={text('search')} aria-label={text('search')} className="h-11 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#999]" />
            </div>
            {loading ? <div className="py-16 text-center text-[13px] text-[#757575]">{text('loading')}</div> : error ? <AccessMessage icon={AlertCircle} title={error} retryText={text('retry')} onRetry={() => setReload(v => v + 1)} /> : items.length ? (
              <div className="mt-4 space-y-3">
                {items.map(item => (
  <AuthorPreOrderCampaignCard
    key={item.id}
    campaign={item}
    language={lang}
    onOpen={() =>
      navigate(`/author/page/pre-order/${encodeURIComponent(item.id)}`)
    }
  />
))}
                {hasMore ? <button type="button" onClick={loadMore} disabled={loadingMore} className="w-full rounded-[12px] border border-[#dedede] py-3 text-[13px] font-semibold disabled:opacity-50">{loadingMore ? text('loading') : text('loadMore')}</button> : null}
              </div>
            ) : <AccessMessage icon={PackageOpen} title={delayedSearch ? text('noResults') : text('noCampaignsHint')} />}
          </>
        )}
      </div>
    </main>
  )
}

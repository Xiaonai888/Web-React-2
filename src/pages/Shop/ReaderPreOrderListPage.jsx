import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, RefreshCw, Search } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { fetchReaderPreOrderList } from '../../services/readerPreOrderApi'
import { readerPreOrderDate, readerPreOrderMinPrice, readerPreOrderMoney, readerPreOrderRoute, readerPreOrderText } from '../../utils/readerPreOrderUi'

const FILTERS = ['all', 'active', 'scheduled']

function RecordCard({ record, language, onOpen }) {
  const t = key => readerPreOrderText(language, key)
  const cover = record.book?.cover_url || record.banner_url || ''
  const price = readerPreOrderMinPrice(record)
  const authorName = record.author?.page_name || t('unknownAuthor')
  return (
    <button type="button" onClick={onOpen} className="min-w-0 overflow-hidden rounded-[15px] border border-[#e9e9e9] bg-white text-left active:bg-[#fafafa]">
      <div className="relative aspect-[3/4] bg-[#f6f6f6]">
        {cover ? <img src={cover} alt="" loading="lazy" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center text-[#aaa]"><BookOpen size={26} /></div>}
        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#333]">{t(record.status === 'active' ? 'active' : 'scheduled')}</span>
      </div>
      <div className="space-y-1.5 p-3">
        <h2 className="line-clamp-2 min-h-[36px] text-[13px] font-bold leading-5 text-[#232323]">{record.book?.title || record.title || '—'}</h2>
        <p className="truncate text-[11px] text-[#777]">{authorName}</p>
        <p className="text-[13px] font-bold text-[#262626]">{price === null ? t('noPrice') : `${t('from')} ${readerPreOrderMoney(price)}`}</p>
        <p className="truncate text-[10px] text-[#888]">{t('opening')}: {readerPreOrderDate(record.open_at, language)}</p>
      </div>
    </button>
  )
}

export default function ReaderPreOrderListPage() {
  const navigate = useNavigate()
  const { language } = useDisplayTranslation()
  const t = key => readerPreOrderText(language, key)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [delayedSearch, setDelayedSearch] = useState('')
  const [records, setRecords] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const moreController = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setDelayedSearch(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    moreController.current?.abort()
    const controller = new AbortController()
    setPage(1)
    setHasMore(false)
    setRecords([])
    setLoadingMore(false)
    setLoading(true)
    setError('')
    fetchReaderPreOrderList({ status: filter, search: delayedSearch, signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return
        setRecords(data.records)
        setHasMore(data.hasMore)
      })
      .catch(cause => { if (!controller.signal.aborted) setError(cause.message || t('recordNotFound')) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [filter, delayedSearch, reload])

  useEffect(() => () => moreController.current?.abort(), [])

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore) return
    const controller = new AbortController()
    moreController.current?.abort()
    moreController.current = controller
    setLoadingMore(true)
    setError('')
    try {
      const data = await fetchReaderPreOrderList({ page: page + 1, status: filter, search: delayedSearch, signal: controller.signal })
      if (controller.signal.aborted) return
      setRecords(current => [...current, ...data.records.filter(item => !current.some(old => old.id === item.id))])
      setPage(page + 1)
      setHasMore(data.hasMore)
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause.message || t('recordNotFound'))
    } finally {
      if (!controller.signal.aborted) setLoadingMore(false)
    }
  }, [hasMore, loading, loadingMore, page, filter, delayedSearch, language])

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(30px+env(safe-area-inset-bottom))] text-[#202020]">
      <div className="mx-auto max-w-[760px] px-4 pt-3 sm:px-6">
        <header className="flex h-12 items-center gap-3">
          <button type="button" onClick={() => navigate('/store')} aria-label={t('back')} className="flex h-10 w-9 items-center justify-center rounded-full hover:bg-[#f6f6f6]"><ArrowLeft size={21} /></button>
          <h1 className="min-w-0 flex-1 truncate text-[19px] font-bold">{t('title')}</h1>
          <button type="button" onClick={() => setReload(i => i + 1)} aria-label={t('retry')} className="flex h-9 w-9 items-center justify-center text-[#777]"><RefreshCw size={17} /></button>
        </header>
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#e4e4e4] px-3">
          <Search size={18} className="text-[#9a9a9a]" />
          <input value={search} onChange={event => setSearch(event.target.value)} maxLength={100} placeholder={t('search')} aria-label={t('search')} className="h-11 min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
        </div>
        <div className="mt-4 flex gap-2" role="tablist" aria-label={t('title')}>
          {FILTERS.map(key => <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)} className={`rounded-full px-4 py-2 text-[12px] font-semibold ${filter === key ? 'bg-[#ffcc28] text-black' : 'bg-[#f4f4f4] text-[#555]'}`}>{t(key)}</button>)}
        </div>
        {error ? <div role="alert" className="mt-5 rounded-xl border border-[#eededb] bg-[#fffafa] p-3 text-[12px] text-[#874b44]">{error}<button type="button" onClick={() => setReload(i => i + 1)} className="ml-2 font-semibold underline">{t('retry')}</button></div> : null}
        {loading ? <p role="status" className="py-16 text-center text-[13px] text-[#777]">{t('loading')}</p> : records.length ? (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {records.map(record => <RecordCard key={record.id} record={record} language={language} onOpen={() => navigate(readerPreOrderRoute(record.id))} />)}
            </div>
            {hasMore ? <button type="button" onClick={loadMore} disabled={loadingMore} className="mt-5 w-full rounded-xl border border-[#dedede] py-3 text-[12px] font-semibold disabled:opacity-50">{loadingMore ? t('loading') : t('more')}</button> : null}
          </>
        ) : !error ? <p className="py-16 text-center text-[13px] text-[#888]">{t('empty')}</p> : null}
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, RefreshCw } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { fetchReaderPreOrderDetail } from '../../services/readerPreOrderApi'
import { readerPreOrderDate, readerPreOrderEditions, readerPreOrderIsOpen, readerPreOrderMoney, readerPreOrderRoute, readerPreOrderText } from '../../utils/readerPreOrderUi'

function LabelValue({ label, children }) {
  return <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f0] py-3 last:border-0"><span className="text-[12px] text-[#777]">{label}</span><span className="text-right text-[12px] font-semibold text-[#333]">{children}</span></div>
}

export default function ReaderPreOrderDetailPage() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { language } = useDisplayTranslation()
  const t = key => readerPreOrderText(language, key)
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [edition, setEdition] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setRecord(null)
    setEdition('')
    setError('')
    setLoading(true)
    fetchReaderPreOrderDetail(campaignId, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return
        setRecord(data)
        const first = readerPreOrderEditions(data).find(item => Number(item.available) > 0)
        setEdition(first?.key || '')
      })
      .catch(cause => { if (!controller.signal.aborted) setError(cause.message || t('recordNotFound')) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [campaignId, reload])

  const editions = readerPreOrderEditions(record)
  const open = readerPreOrderIsOpen(record)
  const selected = editions.find(item => item.key === edition)
  const available = open && selected && Number(selected.available) >= 1 && (record?.delivery_companies?.length || 0) > 0
  const cover = record?.book?.cover_url || record?.banner_url || ''

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(110px+env(safe-area-inset-bottom))] text-[#222]">
      <div className="mx-auto max-w-[720px] px-4 pt-3 sm:px-6">
        <header className="flex h-12 items-center gap-3">
          <button type="button" onClick={() => navigate('/store/pre-orders')} aria-label={t('back')} className="flex h-10 w-9 items-center justify-center rounded-full"><ArrowLeft size={21} /></button>
          <h1 className="min-w-0 flex-1 truncate text-[18px] font-bold">{t('details')}</h1>
          <button type="button" onClick={() => setReload(i => i + 1)} aria-label={t('retry')} className="flex h-9 w-9 items-center justify-center text-[#777]"><RefreshCw size={17} /></button>
        </header>
        {loading ? <p role="status" className="py-20 text-center text-[13px] text-[#777]">{t('loadingDetails')}</p> : error ? <p role="alert" className="mt-12 rounded-xl bg-[#faf7f6] p-4 text-[13px] text-[#804d44]">{error}</p> : record ? (
          <div className="mt-5 space-y-5">
            <div className="overflow-hidden rounded-[16px] border border-[#e8e8e8]">
              <div className="flex min-h-[240px] items-center justify-center bg-[#f7f7f7] p-4">
                {cover ? <img src={cover} alt="" className="max-h-[340px] max-w-full object-contain" /> : <BookOpen size={36} className="text-[#aaa]" />}
              </div>
              <div className="p-4">
                <span className="rounded-full bg-[#f7f4eb] px-2.5 py-1 text-[10px] font-semibold text-[#66501d]">{t(record.status === 'active' ? 'active' : 'scheduled')}</span>
                <h2 className="mt-3 break-words text-[20px] font-bold">{record.book?.title || record.title}</h2>
                <p className="mt-1 text-[12px] text-[#777]">{t('by')} {record.author?.page_name || t('unknownAuthor')}</p>
                {record.description ? <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-[#555]">{record.description}</p> : null}
              </div>
            </div>
            <section className="rounded-[16px] border border-[#e8e8e8] p-4">
              <h3 className="text-[14px] font-bold">{t('overview')}</h3>
              <div className="mt-2"><LabelValue label={t('opening')}>{readerPreOrderDate(record.open_at, language)}</LabelValue><LabelValue label={t('closing')}>{readerPreOrderDate(record.close_at, language)}</LabelValue><LabelValue label={t('ship')}>{readerPreOrderDate(record.expected_ship_at, language)}</LabelValue></div>
            </section>
            <section className="rounded-[16px] border border-[#e8e8e8] p-4">
              <h3 className="mb-3 text-[14px] font-bold">{t('selectEdition')}</h3>
              <div className="space-y-2">{editions.map(item => (
                <label key={item.key} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 ${edition === item.key ? 'border-[#e5b624] bg-[#fffaf0]' : 'border-[#e8e8e8]'}`}>
                  <div className="flex min-w-0 items-center gap-3"><input type="radio" name="reader-preorder-edition" disabled={Number(item.available) < 1} checked={edition === item.key} onChange={() => setEdition(item.key)} className="accent-[#cfa200]" /><span className="text-[13px] font-semibold">{t(item.key)}</span></div>
                  <div className="text-right"><p className="text-[13px] font-bold">{readerPreOrderMoney(item.price_usd)}</p><p className="text-[10px] text-[#777]">{t('available')}: {Math.max(0, Number(item.available) || 0)}</p></div>
                </label>
              ))}</div>
            </section>
            {record.signature_enabled ? <section className="rounded-[16px] border border-[#e8e8e8] p-4"><p className="text-[14px] font-bold">{t('signature')}</p><p className="mt-2 text-[12px] text-[#777]">{t('signatureFee')}: {readerPreOrderMoney(record.signature_fee_usd)}</p>{record.signature_note ? <p className="mt-2 text-[12px] leading-5 text-[#555]">{record.signature_note}</p> : null}</section> : null}
            {record.delivery_note ? <section className="rounded-[16px] border border-[#e8e8e8] p-4"><p className="text-[14px] font-bold">{t('deliveryNote')}</p><p className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-[#555]">{record.delivery_note}</p></section> : null}
            {record.buyer_note_instruction ? <section className="rounded-[16px] border border-[#e8e8e8] p-4"><p className="text-[14px] font-bold">{t('buyerNote')}</p><p className="mt-2 whitespace-pre-wrap text-[12px] leading-5 text-[#555]">{record.buyer_note_instruction}</p></section> : null}
          </div>
        ) : null}
      </div>
      {record && !loading && !error ? <div className="fixed inset-x-0 bottom-0 border-t border-[#ececec] bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]"><div className="mx-auto max-w-[688px]"><button type="button" disabled={!available} onClick={() => navigate(`${readerPreOrderRoute(record.id, true)}?edition=${encodeURIComponent(edition)}`)} className="w-full rounded-xl bg-[#ffcc28] py-3 text-[13px] font-bold text-[#171717] disabled:bg-[#efefef] disabled:text-[#999]">{available ? t('continue') : !open ? t('notOpen') : !selected || Number(selected.available) < 1 ? t('soldOut') : t('noDelivery')}</button></div></div> : null}
    </main>
  )
}

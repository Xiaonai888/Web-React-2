import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { fetchReaderPreOrderDetail, fetchReaderPreOrderQuote } from '../../services/readerPreOrderApi'
import { readerPreOrderDate, readerPreOrderEditions, readerPreOrderIsOpen, readerPreOrderMoney, readerPreOrderRoute, readerPreOrderText } from '../../utils/readerPreOrderUi'

function PriceRow({ label, amount, strong = false }) {
  return <div className={`flex items-center justify-between gap-4 text-[12px] ${strong ? 'border-t border-[#eaeaea] pt-3 text-[15px] font-bold' : ''}`}><span className="text-[#666]">{label}</span><span className="font-semibold text-[#202020]">{readerPreOrderMoney(amount)}</span></div>
}

export default function ReaderPreOrderCheckoutPage() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [params] = useSearchParams()
  const initialEdition = params.get('edition')
  const { language } = useDisplayTranslation()
  const t = key => readerPreOrderText(language, key)
  const [record, setRecord] = useState(null)
  const [edition, setEdition] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [deliveryKey, setDeliveryKey] = useState('')
  const [signed, setSigned] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [quote, setQuote] = useState(null)
  const [quoteError, setQuoteError] = useState('')
  const [quoting, setQuoting] = useState(false)
  const quoteController = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    quoteController.current?.abort()
    setRecord(null)
    setQuote(null)
    setQuoteError('')
    setQuoting(false)
    setLoading(true)
    setError('')
    fetchReaderPreOrderDetail(campaignId, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return
        setRecord(data)
        const options = readerPreOrderEditions(data).filter(item => Number(item.available) > 0)
        setEdition(options.some(item => item.key === initialEdition) ? initialEdition : options[0]?.key || '')
        setDeliveryKey('')
        setQuantity('1')
        setSigned(false)
      })
      .catch(cause => { if (!controller.signal.aborted) setError(cause.message || t('recordNotFound')) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [campaignId, initialEdition, reload])

  useEffect(() => () => quoteController.current?.abort(), [])

  function clearQuote() {
    quoteController.current?.abort()
    setQuoting(false)
    setQuote(null)
    setQuoteError('')
  }

  const options = readerPreOrderEditions(record)
  const chosen = options.find(item => item.key === edition)
  const count = Number(quantity)
  const countValid = Number.isSafeInteger(count) && count >= 1 && count <= 99 && count <= Number(chosen?.available || 0)
  const delivery = record?.delivery_companies?.find(company => company.company_key === deliveryKey)
  const isOpen = readerPreOrderIsOpen(record)
  const canQuote = Boolean(record && isOpen && chosen && delivery && countValid && !quoting)

  async function checkPrice() {
    if (!canQuote) return
    const controller = new AbortController()
    quoteController.current?.abort()
    quoteController.current = controller
    setQuote(null)
    setQuoteError('')
    setQuoting(true)
    try {
      const data = await fetchReaderPreOrderQuote(record.id, {
        edition,
        quantity: count,
        deliveryCompanyKey: deliveryKey,
        signatureRequested: signed,
      }, { signal: controller.signal })
      if (!controller.signal.aborted) setQuote(data)
    } catch (cause) {
      if (!controller.signal.aborted) setQuoteError(cause.message || t('quoteError'))
    } finally {
      if (!controller.signal.aborted) setQuoting(false)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(40px+env(safe-area-inset-bottom))] text-[#202020]">
      <div className="mx-auto max-w-[700px] px-4 pt-3 sm:px-6">
        <header className="flex h-12 items-center gap-3">
          <button type="button" onClick={() => navigate(readerPreOrderRoute(campaignId))} aria-label={t('back')} className="flex h-10 w-9 items-center justify-center rounded-full"><ArrowLeft size={21} /></button>
          <h1 className="min-w-0 flex-1 truncate text-[18px] font-bold">{t('checkoutTitle')}</h1>
          <button type="button" onClick={() => setReload(i => i + 1)} aria-label={t('retry')} className="flex h-9 w-9 items-center justify-center text-[#777]"><RefreshCw size={17} /></button>
        </header>
        {loading ? <p role="status" className="py-20 text-center text-[13px] text-[#777]">{t('loading')}</p> : error ? <p role="alert" className="mt-12 rounded-xl bg-[#fbf8f8] p-4 text-[12px] text-[#8b4840]">{error}</p> : record ? (
          <div className="mt-5 space-y-4">
            <section className="rounded-[16px] border border-[#e8e8e8] p-4">
              <h2 className="text-[16px] font-bold">{record.book?.title || record.title}</h2>
              <p className="mt-1 text-[11px] text-[#777]">{record.author?.page_name || t('unknownAuthor')}</p>
              <p className="mt-2 text-[11px] text-[#777]">{t('closing')}: {readerPreOrderDate(record.close_at, language)}</p>
            </section>
            <section className="space-y-4 rounded-[16px] border border-[#e8e8e8] p-4">
              <h2 className="text-[14px] font-bold">{t('edition')}</h2>
              <div className="space-y-2">{options.map(item => (
                <label key={item.key} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-3 ${edition === item.key ? 'border-[#e5b624] bg-[#fffaf0]' : 'border-[#e7e7e7]'}`}>
                  <span className="flex items-center gap-2 text-[12px] font-semibold"><input type="radio" name="reader-pre-order-edition" checked={edition === item.key} disabled={Number(item.available) < 1} onChange={() => { clearQuote(); setEdition(item.key) }} className="accent-[#cfa200]" />{t(item.key)}</span>
                  <span className="text-right"><span className="block text-[12px] font-bold">{readerPreOrderMoney(item.price_usd)}</span><span className="block text-[10px] text-[#777]">{t('available')}: {item.available}</span></span>
                </label>
              ))}</div>
              <label className="block space-y-1.5"><span className="text-[12px] font-semibold">{t('quantity')}</span><input type="number" min="1" max={Math.min(99, Math.max(1, Number(chosen?.available || 1)))} step="1" value={quantity} onChange={e => { clearQuote(); setQuantity(e.target.value) }} className="w-full rounded-xl border border-[#dedede] bg-white px-3 py-3 text-[13px] outline-none" /></label>
              {!countValid ? <p role="alert" className="text-[11px] text-[#a15c39]">{t('invalidQuantity')}</p> : null}
            </section>
            <section className="space-y-3 rounded-[16px] border border-[#e8e8e8] p-4">
              <h2 className="text-[14px] font-bold">{t('delivery')}</h2>
              {(record.delivery_companies || []).map(company => (
                <label key={company.company_key} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 ${deliveryKey === company.company_key ? 'border-[#e5b624] bg-[#fffaf0]' : 'border-[#e7e7e7]'}`}>
                  <input type="radio" name="reader-pre-order-delivery" checked={deliveryKey === company.company_key} onChange={() => { clearQuote(); setDeliveryKey(company.company_key) }} className="accent-[#cfa200]" />
                  {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 shrink-0 rounded-lg object-contain" /> : null}
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">{company.company_name}</span>
                  <span className="text-[12px] font-bold">{readerPreOrderMoney(company.fee_usd)}</span>
                </label>
              ))}
              {!record.delivery_companies?.length ? <p className="text-[12px] text-[#8c5b51]">{t('noDelivery')}</p> : null}
              {record.signature_enabled ? <label className="flex items-center justify-between gap-3 border-t border-[#ededed] pt-3"><span className="text-[12px] font-semibold">{t('signedCopy')} · {readerPreOrderMoney(record.signature_fee_usd)}</span><input type="checkbox" checked={signed} onChange={event => { clearQuote(); setSigned(event.target.checked) }} className="h-4 w-4 accent-[#cfa200]" /></label> : null}
            </section>
            <button type="button" disabled={!canQuote} onClick={checkPrice} className="w-full rounded-xl bg-[#ffcc28] py-3.5 text-[13px] font-bold text-[#222] disabled:bg-[#eee] disabled:text-[#aaa]">{quoting ? t('checkingPrice') : t('refreshPrice')}</button>
            {!isOpen ? <p className="text-center text-[12px] text-[#996044]">{t('closed')}</p> : !deliveryKey ? <p className="text-center text-[11px] text-[#888]">{t('chooseDelivery')}</p> : null}
            {quoteError ? <p role="alert" className="rounded-xl bg-[#fbf7f6] p-3 text-[12px] text-[#93463c]">{quoteError}</p> : null}
            {quote ? <section className="space-y-3 rounded-[16px] border border-[#e8e8e8] p-4"><h2 className="text-[14px] font-bold">{t('orderSummary')}</h2><PriceRow label={`${t(quote.edition)} × ${quote.quantity}`} amount={quote.subtotal_usd} /><PriceRow label={t('signatureCost')} amount={quote.signature_fee_usd} /><PriceRow label={t('deliveryCost')} amount={quote.delivery_fee_usd} /><PriceRow label={t('total')} amount={quote.total_usd} strong /><p className="text-[10px] text-[#777]">{t('quoteTime')}: {readerPreOrderDate(quote.quoted_at, language)}</p><p className="text-[11px] leading-5 text-[#777]">{t('quoteNotice')}</p></section> : null}
            <section className="rounded-[16px] border border-[#ededed] bg-[#f9f9f9] p-4 text-center"><ShieldCheck size={20} className="mx-auto text-[#888]" /><p className="mt-2 text-[12px] font-semibold text-[#555]">{t('paymentUnavailable')}</p><p className="mt-1 text-[11px] text-[#888]">{t('noPayment')}</p></section>
          </div>
        ) : null}
      </div>
    </main>
  )
}

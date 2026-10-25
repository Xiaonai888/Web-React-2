import { useState } from 'react'
import { ImagePlus, Truck, X } from 'lucide-react'
import { useBookOrderChatText } from './bookOrderChatText'

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxBytes = 5 * 1024 * 1024

export default function BookOrderShippingForm({ open, order, onClose, onSubmit }) {
  const tr = useBookOrderChatText()
  const [company, setCompany] = useState('')
  const [tracking, setTracking] = useState('')
  const [photo, setPhoto] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!open || !order?.id) return null

  async function submit(event) {
    event.preventDefault()
    if (busy || typeof onSubmit !== 'function') return
    if (company.trim().length < 2 || company.trim().length > 120) return setError(tr('invalidCompany'))
    if (!photo || !allowed.has(photo.type) || photo.size < 1 || photo.size > maxBytes) return setError(tr('invalidPhoto'))
    setBusy(true)
    setError('')
    try {
      await onSubmit({ order, delivery_company: company.trim(), tracking_number: tracking.trim(), proof_file: photo })
      onClose?.()
    } catch (failure) {
      setError(failure?.message || tr('submitFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[181] flex items-center justify-center bg-[#151024]/55 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="shadow-book-shipping-title" className="max-h-[90dvh] w-full max-w-[430px] overflow-y-auto rounded-[23px] bg-white p-5 text-[#201a32] shadow-2xl">
        <div className="flex items-center justify-between gap-2"><h2 id="shadow-book-shipping-title" className="flex items-center gap-2 text-[16px] font-extrabold"><Truck size={20} className="text-violet-600" />{tr('markShipped')}</h2><button type="button" disabled={busy} onClick={onClose} aria-label={tr('close')} className="rounded-full p-2"><X size={20} /></button></div>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <label className="block text-[12px] font-semibold">{tr('deliveryCompany')}<input type="text" autoComplete="organization" required minLength={2} maxLength={120} value={company} onChange={(event) => setCompany(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#ddd7e9] bg-white p-3 text-[13px] outline-violet-600" /></label>
          <label className="block text-[12px] font-semibold">{tr('trackingNumber')}<input type="text" maxLength={120} value={tracking} onChange={(event) => setTracking(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#ddd7e9] bg-white p-3 text-[13px] outline-violet-600" /></label>
          <label className="block text-[12px] font-semibold">{tr('proofPhoto')}<span className="mt-1.5 flex min-h-[90px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-violet-300 bg-[#f8f5ff] p-3 text-center text-[12px] text-violet-700"><ImagePlus size={23} />{photo ? photo.name : tr('selectImage')}</span><input type="file" required accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0] || null; setPhoto(file); setError(file && (!allowed.has(file.type) || file.size > maxBytes || file.size < 1) ? tr('invalidPhoto') : '') }} className="sr-only" /></label>
          <p className="text-[11px] text-[#726b80]">{tr('proofHint')}</p>
          <p className="rounded-xl bg-[#f6f2ff] p-3 text-[12px] leading-5 text-[#4d3e69]">{tr('authorWarning')}</p>
          {error && <p role="alert" className="text-[12px] text-red-700">{error}</p>}
          <div className="grid grid-cols-2 gap-2"><button type="button" disabled={busy} onClick={onClose} className="rounded-xl bg-[#f1edf7] px-3 py-3 text-[12px] font-bold">{tr('cancel')}</button><button type="submit" disabled={busy || typeof onSubmit !== 'function'} className="rounded-xl bg-violet-600 px-3 py-3 text-[12px] font-bold text-white disabled:opacity-50">{busy ? tr('saving') : tr('submitShipping')}</button></div>
        </form>
      </div>
    </div>
  )
}

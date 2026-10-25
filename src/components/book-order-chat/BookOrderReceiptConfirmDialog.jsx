import { useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'
import { useBookOrderChatText } from './bookOrderChatText'

export default function BookOrderReceiptConfirmDialog({ open, order, onClose, onConfirm }) {
  const tr = useBookOrderChatText()
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!open || !order?.id) return null

  async function confirm(event) {
    event.preventDefault()
    if (!accepted || busy || typeof onConfirm !== 'function') return
    setBusy(true)
    setError('')
    try {
      await onConfirm(order)
      setAccepted(false)
      onClose?.()
    } catch (failure) {
      setError(failure?.message || tr('confirmFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[181] flex items-center justify-center bg-[#151024]/55 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="shadow-book-receipt-title" className="w-full max-w-[390px] rounded-[23px] bg-white p-5 text-[#201a32] shadow-2xl">
        <div className="flex justify-end"><button type="button" disabled={busy} onClick={onClose} aria-label={tr('close')} className="rounded-full p-2"><X size={20} /></button></div>
        <ShieldAlert size={37} className="mx-auto text-amber-600" />
        <h2 id="shadow-book-receipt-title" className="mt-3 text-center text-[17px] font-extrabold">{tr('confirmTitle')}</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#655c76]">{tr('confirmExplanation')}</p>
        <p className="mt-2 rounded-xl bg-[#fff5df] p-3 text-[12px] leading-5 text-[#76531c]">{tr('irreversible')}</p>
        <form onSubmit={confirm} className="mt-4 space-y-4">
          <label className="flex items-start gap-3 rounded-xl border border-[#e5def2] p-3 text-[12px] font-medium"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-violet-600" />{tr('confirmCheckbox')}</label>
          {error && <p role="alert" className="text-[12px] text-red-700">{error}</p>}
          <button type="submit" disabled={!accepted || busy || typeof onConfirm !== 'function'} className="w-full rounded-xl bg-[#ffcf38] px-4 py-3 text-[13px] font-bold text-[#241a36] disabled:opacity-45">{busy ? tr('saving') : tr('confirmFinal')}</button>
          <button type="button" disabled={busy} onClick={onClose} className="w-full text-[12px] font-medium text-[#736b7f]">{tr('notReceived')}</button>
        </form>
      </div>
    </div>
  )
}

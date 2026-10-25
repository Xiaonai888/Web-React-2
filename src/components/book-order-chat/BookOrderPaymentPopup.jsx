import { BookOpenCheck, CheckCircle2, PackageCheck, ShieldCheck, X } from 'lucide-react'
import { useBookOrderChatText } from './bookOrderChatText'

export default function BookOrderPaymentPopup({ open, role = 'reader', order, onClose }) {
  const tr = useBookOrderChatText()
  if (!open || !order?.id || order.paymentVerified !== true || order.isPhysicalBook !== true) return null
  const author = role === 'author'

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-[#151024]/50 px-4 py-5" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="shadow-book-paid-dialog-title" className="w-full max-w-[390px] rounded-[25px] bg-white p-5 text-[#201a32] shadow-2xl">
        <div className="flex justify-end"><button type="button" onClick={onClose} aria-label={tr('close')} className="rounded-full p-2 text-[#6b637c]"><X size={20} /></button></div>
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">{author ? <PackageCheck size={34} /> : <BookOpenCheck size={34} />}</div>
        <h2 id="shadow-book-paid-dialog-title" className="text-center text-[19px] font-extrabold">{author ? tr('authorTitle') : tr('readerTitle')}</h2>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] font-medium text-emerald-700"><CheckCircle2 size={15} />{tr('paymentVerified')}</div>
        <div className="mt-4 space-y-3 rounded-2xl bg-[#f6f2ff] p-4">
          <p className="text-[13px] leading-6">{author ? tr('authorNotice') : tr('readerNotice')}</p>
          <div className="flex items-center gap-2 border-t border-[#e7dcff] pt-3 text-[12px] font-semibold text-violet-700"><ShieldCheck size={18} />{tr('held')}</div>
        </div>
        <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl bg-[#ffcf38] px-4 py-3 font-bold text-[#21153a]">{tr('understood')}</button>
      </div>
    </div>
  )
}

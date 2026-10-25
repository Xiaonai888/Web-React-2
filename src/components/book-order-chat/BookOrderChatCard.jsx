import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock3, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { useBookOrderChatText } from './bookOrderChatText'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const activeStatuses = new Set(['awaiting_reader', 'under_review'])

function elapsedDays(from, to) {
  const start = Date.parse(from || '')
  const finish = to ? Date.parse(to) : Date.now()
  if (!Number.isFinite(start) || !Number.isFinite(finish)) return null
  return Math.max(0, Math.floor((finish - start) / 86400000))
}

export default function BookOrderChatCard({ order, role = 'reader', onShipping, onConfirm, defaultExpanded = false }) {
  const tr = useBookOrderChatText()
  const [expanded, setExpanded] = useState(defaultExpanded)
  if (!order?.id || order.paymentVerified !== true || order.isPhysicalBook !== true || !order.holdStatus) return null

  const author = role === 'author'
  const status = String(order.holdStatus)
  const state = String(order.orderStatus || '').toLowerCase()
  const delivered = status === 'released' && order.releaseSource === 'reader'
  const ownerReleased = status === 'released' && !delivered
  const shipped = ['shipped', 'completed'].includes(state)
  const days = delivered && !order.readerConfirmedAt ? null : elapsedDays(order.paidAt, delivered ? order.readerConfirmedAt : null)
  const showElapsed = !ownerReleased && status !== 'refunded' && days !== null
  const label = status === 'refunded' ? tr('refunded')
    : delivered ? tr('received')
    : ownerReleased ? tr('ownerReleased')
    : status === 'under_review' ? tr('review')
    : shipped ? tr('shipped') : tr('waitingShipment')
  const canConfirm = !author && shipped && activeStatuses.has(status) && typeof onConfirm === 'function'
  const canShip = author && activeStatuses.has(status) && typeof onShipping === 'function'
  const heldCents = Number(order.holdAmountCents)
  const heldAmount = Number.isSafeInteger(heldCents) && heldCents >= 0 ? usd.format(heldCents / 100) : '—'

  return (
    <section aria-label={tr('order')} className="mx-auto w-full max-w-[720px] px-3 py-2 text-[var(--shadow-text-primary)]">
      <div className="overflow-hidden rounded-[19px] border border-[#e9e2fa] bg-[var(--shadow-bg-surface)] shadow-[0_7px_24px_rgba(87,48,146,0.07)]">
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="flex w-full items-center gap-3 p-3 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700"><ShieldCheck size={21} /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-bold">{tr('order')} · {tr('paid')}</span>
            <span className="mt-0.5 block truncate text-[11px] text-violet-600">{label}{showElapsed ? ` · ${tr('waitingDays')} ${days} ${days === 1 ? tr('day') : tr('days')}` : ''}</span>
          </span>
          {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </button>
        {expanded && (
          <div className="space-y-3 border-t border-[#eee8fa] px-3 pb-3 pt-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700"><PackageCheck size={16} />{tr('paymentVerified')}</div>
            <p className="text-[12px] leading-[1.7] text-[var(--shadow-text-secondary)]">{author ? tr('authorWarning') : tr('readerWarning')}</p>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-[var(--shadow-bg-page)] p-3 text-[12px]">
              <div><span className="block text-[11px] text-[var(--shadow-text-secondary)]">{tr('heldAmount')}</span><strong className="mt-1 block">{heldAmount}</strong></div>
              <div><span className="block text-[11px] text-[var(--shadow-text-secondary)]">{tr('shippingDetails')}</span><strong className="mt-1 block break-words">{label}</strong></div>
            </div>
            {delivered && showElapsed && <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-700"><Clock3 size={15} />{tr('actualDelivery')}: {days} {days === 1 ? tr('day') : tr('days')}</div>}
            {order.deliveryCompany && <div className="flex items-center gap-2 text-[12px]"><Truck size={15} /><span>{order.deliveryCompany}</span>{order.trackingNumber ? <span className="break-all text-[var(--shadow-text-secondary)]">· {order.trackingNumber}</span> : null}</div>}
            {canShip && <button type="button" onClick={() => onShipping(order)} className="w-full rounded-xl bg-violet-600 px-3 py-3 text-[12px] font-bold text-white">{order.deliveryCompany ? tr('shippingDetails') : tr('markShipped')}</button>}
            {!author && activeStatuses.has(status) && <button type="button" disabled={!canConfirm} onClick={() => onConfirm(order)} className="w-full rounded-xl bg-[#ffce37] px-3 py-3 text-[12px] font-bold text-[#231744] disabled:cursor-not-allowed disabled:opacity-45">{tr('confirmReceived')}</button>}
            {author && !canShip && activeStatuses.has(status) && <p className="text-center text-[11px] text-[var(--shadow-text-secondary)]">{tr('waitingConfirmation')}</p>}
            {order.orderNumber && <p className="text-center text-[10px] text-[var(--shadow-text-secondary)]">{tr('orderNumber')}: {order.orderNumber}</p>}
          </div>
        )}
      </div>
    </section>
  )
}

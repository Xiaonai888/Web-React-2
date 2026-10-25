import { useState } from 'react'
import useBookOrderChat from '../../hooks/useBookOrderChat'
import { confirmBookReceived, submitBookShippingEvidence } from '../../services/bookOrderChatApi'
import BookOrderChatCard from './BookOrderChatCard'
import BookOrderPaymentPopup from './BookOrderPaymentPopup'
import BookOrderShippingForm from './BookOrderShippingForm'
import BookOrderReceiptConfirmDialog from './BookOrderReceiptConfirmDialog'

export default function BookOrderChatBridge({ conversationId, onUploadShippingProof, onMarkOrderShipped }) {
  const { orders, popupOrder, role, error, refresh, markPopupSeen } = useBookOrderChat(conversationId)
  const [shippingOrder, setShippingOrder] = useState(null)
  const [receiptOrder, setReceiptOrder] = useState(null)
  const [popupError, setPopupError] = useState('')

  async function shippingSubmit({ order, delivery_company, tracking_number, proof_file }) {
    if (role !== 'author' || typeof onUploadShippingProof !== 'function' || typeof onMarkOrderShipped !== 'function') {
      throw new Error('Shipping verification is not connected')
    }
    const uploaded = await onUploadShippingProof(proof_file, order)
    const proofUrl = typeof uploaded === 'string' ? uploaded : uploaded?.url
    if (!/^https:\/\/[^\s<>]+$/i.test(String(proofUrl || ''))) throw new Error('Valid HTTPS shipping proof is required')
    await onMarkOrderShipped(order)
    await submitBookShippingEvidence(order.holdId, { delivery_company, tracking_number, proof_url: proofUrl })
    await refresh()
  }

  async function confirm(order) {
    if (role !== 'reader') throw new Error('Only the reader may confirm receipt')
    await confirmBookReceived(order.id)
    await refresh()
  }

  async function closePaymentPopup() {
    if (!popupOrder) return
    setPopupError('')
    try {
      await markPopupSeen(popupOrder.id)
    } catch (failure) {
      setPopupError(String(failure?.message || 'Unable to close payment notice'))
    }
  }

  if (!conversationId) return null

  return (
    <>
      {orders.map((order) => (
        <BookOrderChatCard
          key={order.id}
          order={order}
          role={role}
          onShipping={role === 'author' && onUploadShippingProof && onMarkOrderShipped ? setShippingOrder : undefined}
          onConfirm={role === 'reader' ? setReceiptOrder : undefined}
        />
      ))}
      {error && <div role="alert" className="mx-auto max-w-[720px] px-4 py-2 text-[12px] text-red-600">{error} <button type="button" onClick={() => void refresh()} className="font-bold underline">Retry</button></div>}
      {popupError && <div role="alert" className="mx-auto max-w-[720px] px-4 py-2 text-[12px] text-red-600">{popupError}</div>}
      <BookOrderPaymentPopup open={Boolean(popupOrder)} order={popupOrder} role={role} onClose={() => void closePaymentPopup()} />
      <BookOrderShippingForm key={shippingOrder?.id || 'none'} open={Boolean(shippingOrder)} order={shippingOrder} onClose={() => setShippingOrder(null)} onSubmit={shippingSubmit} />
      <BookOrderReceiptConfirmDialog key={receiptOrder?.id || 'none'} open={Boolean(receiptOrder)} order={receiptOrder} onClose={() => setReceiptOrder(null)} onConfirm={confirm} />
    </>
  )
}

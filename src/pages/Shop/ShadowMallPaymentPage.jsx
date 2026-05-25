import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CHECKOUT_DRAFT_KEY = 'shadow_mall_checkout_draft'
const CURRENT_ORDER_KEY = 'shadow_mall_current_order_payment'
const CART_KEY = 'shadow_mall_cart'
const FALLBACK_PAYWAY_LINK = 'https://link.payway.com.kh/ABAPAYnw446278Y'

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || 'null')
    return value || fallback
  } catch {
    return fallback
  }
}

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function getDraftKey(draft) {
  const items = Array.isArray(draft?.items)
    ? draft.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }))
    : []

  return JSON.stringify({
    items,
    delivery_company: draft?.delivery_company?.key || '',
    total: Number(draft?.grand_total || 0),
  })
}

function getRedirectFlag(orderId) {
  return `shadow_mall_payway_opened_${orderId}`
}

function getPayWayUrl(order) {
  return order?.checkout_url || order?.deeplink || FALLBACK_PAYWAY_LINK
}

function getStatusText(status) {
  if (status === 'paid') return 'Payment Successful'
  if (status === 'amount_mismatch') return 'Payment Needs Review'
  if (status === 'expired') return 'Payment Expired'
  if (status === 'cancelled') return 'Payment Cancelled'
  return 'Waiting Payment'
}

function getStatusClass(status) {
  if (status === 'paid') return 'bg-[#dcfce7] text-[#166534]'
  if (status === 'amount_mismatch') return 'bg-[#fff7d8] text-[#7a5600]'
  if (status === 'expired' || status === 'cancelled') return 'bg-[#fff1f1] text-[#e5484d]'
  return 'bg-[#fff7d8] text-[#7a5600]'
}

function PaymentItem({ item }) {
  return (
    <div className="flex gap-3 border-b border-[#f0eef6] py-3 last:border-b-0">
      <div className="h-[74px] w-[50px] shrink-0 overflow-hidden rounded-[12px] bg-[#eef0f4]">
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
            <i className="fa-solid fa-book-open text-[15px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#111827]">
          {item.title}
        </div>
        <div className="mt-1 text-[11px] font-semibold text-[#8d94a1]">
          Qty: {item.quantity}
        </div>
        <div className="mt-2 text-[13px] font-extrabold text-[#e5484d]">
          {formatUsd(Number(item.price || item.unit_price_usd || 0) * Number(item.quantity || 1))}
        </div>
      </div>
    </div>
  )
}

export default function ShadowMallPaymentPage() {
  const navigate = useNavigate()
  const hasCreatedRef = useRef(false)
  const redirectedRef = useRef(false)
  const [draft, setDraft] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState('')

  const status = order?.status || 'waiting_payment'
  const isPaid = status === 'paid'
  const isWaiting = status === 'waiting_payment'

  const subtotal = Number(order?.subtotal_usd ?? draft?.subtotal ?? 0)
  const deliveryFee = Number(order?.delivery_fee_usd ?? draft?.delivery_fee ?? 0)
  const total = Number(order?.total_usd ?? draft?.grand_total ?? 0)

  const deliveryCompany = useMemo(() => {
    return order?.delivery_company || draft?.delivery_company || {}
  }, [order, draft])

  function redirectToPayWay(targetOrder) {
    if (!targetOrder?.order_id || redirectedRef.current) return

    const flag = getRedirectFlag(targetOrder.order_id)

    if (sessionStorage.getItem(flag) === '1') return

    redirectedRef.current = true
    sessionStorage.setItem(flag, '1')

    window.location.href = getPayWayUrl(targetOrder)
  }

  async function checkOrderStatus(targetOrderId) {
    const token = getReaderToken()
    if (!token || !targetOrderId) return null

    try {
      setChecking(true)

      const response = await fetch(`${API_URL}/api/shadow-mall/orders/status/${targetOrderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to check order status')
      }

      if (data.order) {
        setOrder(data.order)

        const currentPayment = readJson(CURRENT_ORDER_KEY, null)
        if (currentPayment) {
          localStorage.setItem(
            CURRENT_ORDER_KEY,
            JSON.stringify({
              ...currentPayment,
              order: data.order,
            })
          )
        }

        if (data.order.status === 'paid') {
          localStorage.removeItem(CART_KEY)
          localStorage.removeItem(CURRENT_ORDER_KEY)
          window.dispatchEvent(new Event('shadow-mall-cart-change'))
          window.dispatchEvent(new Event('shadow-mall-cart-updated'))
        }

        return data.order
      }
    } catch (error) {
      setMessage(error.message || 'Failed to check order status')
    } finally {
      setChecking(false)
    }

    return null
  }

  async function createPayment(currentDraft) {
    const token = getReaderToken()

    if (!token) {
      setMessage('Please login before payment.')
      setLoading(false)
      return
    }

    if (!currentDraft?.items?.length) {
      setMessage('Your cart is empty. Please add books before payment.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const draftKey = getDraftKey(currentDraft)
      const savedPayment = readJson(CURRENT_ORDER_KEY, null)

      if (savedPayment?.draft_key === draftKey && savedPayment?.order?.order_id) {
        setOrder(savedPayment.order)
        const checkedOrder = await checkOrderStatus(savedPayment.order.order_id)
        const latestOrder = checkedOrder || savedPayment.order

        if (latestOrder.status !== 'paid') {
          window.setTimeout(() => redirectToPayWay(latestOrder), 500)
        }

        return
      }

      const response = await fetch(`${API_URL}/api/shadow-mall/orders/create-payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: currentDraft.items,
          delivery_company: currentDraft.delivery_company,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create Shadow Mall payment')
      }

      if (!data.order) {
        throw new Error('Payment order was not created')
      }

      setOrder(data.order)
      localStorage.setItem(
        CURRENT_ORDER_KEY,
        JSON.stringify({
          draft_key: draftKey,
          order: data.order,
          created_at: new Date().toISOString(),
        })
      )

      window.setTimeout(() => redirectToPayWay(data.order), 500)
    } catch (error) {
      setMessage(error.message || 'Failed to create Shadow Mall payment')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const currentDraft = readJson(CHECKOUT_DRAFT_KEY, null)
    setDraft(currentDraft)

    if (!currentDraft) {
      setMessage('Checkout information was not found. Please go back to checkout.')
      setLoading(false)
      return
    }

    if (!hasCreatedRef.current) {
      hasCreatedRef.current = true
      createPayment(currentDraft)
    }
  }, [])

  useEffect(() => {
    if (!order?.order_id || !isWaiting) return undefined

    const timer = window.setInterval(() => {
      checkOrderStatus(order.order_id)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [order?.order_id, isWaiting])

  function createNewPayment() {
    if (order?.order_id) {
      sessionStorage.removeItem(getRedirectFlag(order.order_id))
    }

    localStorage.removeItem(CURRENT_ORDER_KEY)
    setOrder(null)

    if (draft) {
      redirectedRef.current = false
      createPayment(draft)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[40px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop/mall/checkout')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back to checkout"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-left text-[18px] font-extrabold text-[#111827]">
            Payment
          </h1>

          <button
            type="button"
            onClick={() => order?.order_id && checkOrderStatus(order.order_id)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Refresh payment status"
          >
            <i className={`fa-solid fa-rotate-right text-[14px] ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {message ? (
          <div className="mb-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d]">
            {message}
          </div>
        ) : null}

        <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[16px] font-extrabold text-[#111827]">Shadow Mall Order</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                Order ID: {order?.order_id || 'Creating...'}
              </div>
            </div>

            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${getStatusClass(status)}`}>
              {getStatusText(status)}
            </span>
          </div>

          <div className="mt-5 rounded-[22px] bg-[#fafafe] p-4">
            <div className="text-center text-[12px] font-bold text-[#8d94a1]">Grand Total</div>
            <div className="mt-1 text-center text-[32px] font-extrabold text-[#e5484d]">
              {formatUsd(total)}
            </div>
            <div className="mt-1 text-center text-[12px] font-semibold text-[#8d94a1]">
              Pay with ABA PayWay / KHQR
            </div>
          </div>

          {loading ? (
            <div className="mt-5 rounded-[22px] bg-[#fafafe] px-4 py-8 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
              <div className="text-[13px] font-extrabold text-[#111827]">Creating payment...</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                Redirecting to ABA PayWay...
              </div>
            </div>
          ) : isPaid ? (
            <div className="mt-5 rounded-[22px] bg-[#f0fdf4] px-4 py-6 text-center ring-1 ring-[#bbf7d0]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7] text-[#166534]">
                <i className="fa-solid fa-check text-[26px]" />
              </div>
              <div className="mt-4 text-[18px] font-extrabold text-[#166534]">Payment Successful</div>
              <p className="mt-2 text-[12.5px] font-semibold leading-6 text-[#3f7b4f]">
                Your book order has been received. Admin will prepare and deliver your books after checking the order.
              </p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]"
              >
                Back to Shop
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] bg-[#fff7d8] px-4 py-5 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#f6df9a] border-t-[#7a5600]" />
              <div className="text-[14px] font-extrabold text-[#7a5600]">Redirecting to ABA PayWay...</div>
              <p className="mt-2 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
                After payment, return to this page and tap refresh if the status does not update automatically.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => order && redirectToPayWay(order)}
                  className="h-11 flex-1 rounded-full bg-[#111827] text-[12px] font-extrabold text-white active:scale-[0.99]"
                >
                  Open PayWay Again
                </button>

                <button
                  type="button"
                  disabled={!order?.order_id || checking}
                  onClick={() => checkOrderStatus(order.order_id)}
                  className="h-11 flex-1 rounded-full border border-[#111827] bg-white text-[12px] font-extrabold text-[#111827] active:scale-[0.99] disabled:border-[#cbd5e1] disabled:text-[#94a3b8]"
                >
                  {checking ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-[16px] font-extrabold text-[#111827]">Payment Summary</div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Subtotal</span>
              <span className="font-extrabold text-[#111827]">{formatUsd(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Delivery fee</span>
              <span className="font-extrabold text-[#111827]">{formatUsd(deliveryFee)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Delivery company</span>
              <span className="font-extrabold text-[#111827]">
                {deliveryCompany.shortName || deliveryCompany.name || '-'}
              </span>
            </div>

            <div className="border-t border-[#f0eef6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[#111827]">Grand total</span>
                <span className="text-[20px] font-extrabold text-[#e5484d]">{formatUsd(total)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-extrabold text-[#111827]">Order Items</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                {draft?.items?.length || order?.items?.length || 0} items
              </div>
            </div>
          </div>

          <div className="mt-3">
            {(draft?.items || order?.items || []).length ? (
              (draft?.items || order?.items || []).map((item) => (
                <PaymentItem key={item.id || item.product_id} item={item} />
              ))
            ) : (
              <div className="py-8 text-center text-[13px] font-extrabold text-[#98a2b3]">
                No books found.
              </div>
            )}
          </div>
        </section>

        {!isPaid && !loading ? (
          <button
            type="button"
            onClick={createNewPayment}
            className="mt-4 h-11 w-full rounded-full bg-white text-[12px] font-extrabold text-[#667085] ring-1 ring-black/5 active:scale-[0.99]"
          >
            Create New Payment
          </button>
        ) : null}
      </main>
    </div>
  )
}

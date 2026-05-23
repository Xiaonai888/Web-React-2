import React from 'react'
import { useNavigate } from 'react-router-dom'

function formatRiel(value) {
  return `${Number(value || 0).toLocaleString('en-US')}៛`
}

export default function ShadowMallPaymentPage() {
  const navigate = useNavigate()

  const order = {
    orderId: 'MALL-DEMO-0001',
    subtotal: 68000,
    deliveryFee: 5000,
    discount: 0,
    grandTotal: 73000,
    paymentMethod: 'ABA KHQR',
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Payment</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[16px] font-extrabold text-[#111827]">Order Payment</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                Order ID: {order.orderId}
              </div>
            </div>

            <span className="rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600]">
              WAITING PAYMENT
            </span>
          </div>

          <div className="mt-5 rounded-[22px] bg-[#fafafe] p-4">
            <div className="text-center text-[12px] font-bold text-[#8d94a1]">Grand Total</div>
            <div className="mt-1 text-center text-[30px] font-extrabold text-[#e5484d]">
              {formatRiel(order.grandTotal)}
            </div>
            <div className="mt-1 text-center text-[12px] font-semibold text-[#8d94a1]">
              Pay with {order.paymentMethod}
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="flex h-[230px] w-[230px] items-center justify-center rounded-[28px] bg-white shadow-sm ring-1 ring-[#eceaf2]">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
                  <i className="fa-solid fa-qrcode text-[28px]" />
                </div>
                <div className="mt-4 text-[14px] font-extrabold text-[#111827]">QR Preview</div>
                <div className="mt-1 max-w-[170px] text-[11px] font-semibold leading-5 text-[#8d94a1]">
                  Real ABA QR will connect in backend payment stage.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
            This page is UI only. After backend payment is connected, ABA KHQR will show here and payment success will create a paid mall order.
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-[16px] font-extrabold text-[#111827]">Payment Summary</div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Subtotal</span>
              <span className="font-extrabold text-[#111827]">{formatRiel(order.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Delivery fee</span>
              <span className="font-extrabold text-[#111827]">{formatRiel(order.deliveryFee)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
              <span>Discount</span>
              <span className="font-extrabold text-[#111827]">{formatRiel(order.discount)}</span>
            </div>

            <div className="border-t border-[#f0eef6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[#111827]">Grand total</span>
                <span className="text-[20px] font-extrabold text-[#e5484d]">{formatRiel(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_1.2fr] gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop/mall/checkout')}
            className="flex h-[52px] items-center justify-center rounded-full border border-[#111827] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
          >
            Edit Info
          </button>

          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex h-[52px] items-center justify-center rounded-full bg-[#111827] text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99]"
          >
            Back to Shop
          </button>
        </div>
      </div>
    </div>
  )
}

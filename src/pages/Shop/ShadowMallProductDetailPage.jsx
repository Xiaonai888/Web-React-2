import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatMallPrice, getShadowMallProductById } from '../../data/shadowMallProducts'

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-[#f0eef6] py-3 last:border-b-0">
      <div className="text-[12px] font-bold text-[#8d94a1]">{label}</div>
      <div className="text-[12.5px] font-extrabold leading-5 text-[#111827]">{value}</div>
    </div>
  )
}

function FullDetailsSheet({ open, product, onClose }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-[140]">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[480px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">Full Details</div>
            <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#8d94a1]">{product.title}</div>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#555b66]">
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 pb-5">
          <div className="rounded-[20px] bg-[#fafafe] px-4">
            {product.fullDetails.map(([label, value]) => (
              <DetailRow key={label} label={label} value={value} />
            ))}
          </div>

          <div className="mt-4 rounded-[18px] bg-[#fff7d8] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#7a5600]">
            Please check title, price, condition, and delivery information before placing your order.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShadowMallProductDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const product = getShadowMallProductById(productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f3fa] px-4 pt-10">
        <div className="mx-auto max-w-[420px] rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
            <i className="fa-solid fa-book-open text-[18px]" />
          </div>
          <h1 className="mt-4 text-[18px] font-extrabold text-[#111827]">Book not found</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">This Shadow Mall product is not available.</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.salePrice
  const increaseQuantity = () => setQuantity((value) => Math.min(value + 1, 99))
  const decreaseQuantity = () => setQuantity((value) => Math.max(value - 1, 1))

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <FullDetailsSheet open={detailsOpen} product={product} onClose={() => setDetailsOpen(false)} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Book Detail</h1>

          <button type="button" onClick={() => navigate('/shop/mall/cart')} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
            <i className="fa-solid fa-cart-shopping text-[14px]" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">0</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
            <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[22px] bg-[#eef0f4] shadow-sm">
              <div className="relative aspect-[2/3]">
                <img
                  src={product.cover}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                {product.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-[#111827] shadow-sm">
                    {product.badge}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="min-w-0">
              <div className="inline-flex rounded-full bg-[#fff7d8] px-3 py-1 text-[10px] font-extrabold text-[#7a5600]">
                {product.category}
              </div>

              <h2 className="mt-3 text-[22px] font-extrabold leading-8 text-[#111827]">
                {product.title}
              </h2>

              <p className="mt-1 text-[13px] font-semibold text-[#8d94a1]">
                by {product.author}
              </p>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="flex items-end gap-2">
                  <div className="text-[22px] font-extrabold text-[#e5484d]">
                    {formatMallPrice(product.salePrice, product.currency)}
                  </div>
                  {hasDiscount ? (
                    <div className="pb-1 text-[13px] font-semibold text-[#a0a5b1] line-through">
                      {formatMallPrice(product.originalPrice, product.currency)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-[12px] font-semibold text-[#555b66]">
                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Pages</div>
                    <div className="mt-1 font-extrabold text-[#111827]">{product.pages}</div>
                  </div>
                  <div className="rounded-[14px] bg-white px-3 py-2">
                    <div className="text-[#98a2b3]">Condition</div>
                    <div className="mt-1 font-extrabold text-[#111827]">{product.condition}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[#fafafe] p-4">
                <div className="text-[13px] font-extrabold text-[#111827]">Short Info</div>
                <p className="mt-2 line-clamp-3 text-[12.5px] font-medium leading-6 text-[#667085]">
                  {product.shortInfo}
                </p>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#111827] ring-1 ring-[#eceaf2] active:scale-95"
                >
                  View Full Details
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-[20px] bg-[#fafafe] p-4">
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">Quantity</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#8d94a1]">Choose how many books you want</div>
                </div>

                <div className="flex items-center rounded-full bg-white p-1 ring-1 ring-[#eceaf2]">
                  <button type="button" onClick={decreaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
                    <i className="fa-solid fa-minus text-[11px]" />
                  </button>
                  <div className="w-11 text-center text-[14px] font-extrabold text-[#111827]">{quantity}</div>
                  <button type="button" onClick={increaseQuantity} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95">
                    <i className="fa-solid fa-plus text-[11px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_1.3fr] gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop/mall/cart')}
            className="flex h-13 min-h-[52px] items-center justify-center rounded-full border border-[#111827] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => navigate('/shop/mall/checkout')}
            className="flex h-13 min-h-[52px] items-center justify-center rounded-full bg-[#111827] text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CART_KEY = 'shadow_mall_cart'

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-mall-cart-updated'))
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title || 'Untitled book',
    author: item.author || item.author_name || 'Unknown author',
    cover: item.cover || item.cover_url || '',
    price: Number(item.price || item.price_usd || 0),
    oldPrice: item.oldPrice || item.old_price_usd ? Number(item.oldPrice || item.old_price_usd || 0) : 0,
    quantity: Math.max(Number(item.quantity || 1), 1),
  }
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[#eef0f4]">
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
              <i className="fa-solid fa-book-open text-[18px]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#111827]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[#8d94a1]">
                {item.author}
              </p>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95"
              aria-label={`Remove ${item.title}`}
            >
              <i className="fa-solid fa-trash text-[11px]" />
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <div className="text-[14px] font-extrabold text-[#e5484d]">{formatUsd(item.price)}</div>
              {item.oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1] line-through">
                  {formatUsd(item.oldPrice)}
                </div>
              ) : null}
            </div>

            <div className="flex items-center rounded-full bg-[#f5f3fa] p-1">
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111827] active:scale-95"
                aria-label={`Decrease ${item.title}`}
              >
                <i className="fa-solid fa-minus text-[10px]" />
              </button>
              <div className="w-9 text-center text-[13px] font-extrabold text-[#111827]">{item.quantity}</div>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
                aria-label={`Increase ${item.title}`}
              >
                <i className="fa-solid fa-plus text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallCartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(readCart().map(normalizeItem))
  }, [])

  function updateItems(nextItems) {
    setItems(nextItems)
    saveCart(nextItems)
  }

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const increaseItem = (id) => {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    )
  }

  const decreaseItem = (id) => {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    )
  }

  const removeItem = (id) => {
    updateItems(items.filter((item) => String(item.id) !== String(id)))
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[120px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-left text-[18px] font-extrabold text-[#111827]">
            My Cart
          </h1>

          <button
            type="button"
            onClick={() => navigate('/shop/mall/cart')}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[#111827] active:scale-95"
            aria-label="Cart items"
          >
            <i className="fa-solid fa-cart-shopping text-[20px]" />
            {itemCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {items.length ? (
          <>
            <section className="rounded-[22px] bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
              <div className="text-[14px] font-extrabold text-[#111827]">Selected Books</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                Check your books and quantity before checkout.
              </div>
            </section>

            <button
              type="button"
              onClick={() => navigate('/shop/mall/orders')}
              className="mt-3 flex w-full items-center gap-3 rounded-[22px] bg-white px-4 py-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600]">
                <i className="fa-solid fa-clock-rotate-left text-[15px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-extrabold text-[#111827]">Order History</div>
                <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#8d94a1]">
                  View your previous Shadow Mall orders.
                </div>
              </div>

              <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#98a2b3]" />
            </button>

            <section className="mt-3 space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={() => increaseItem(item.id)}
                  onDecrease={() => decreaseItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </section>

            <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="text-[15px] font-extrabold text-[#111827]">Order Summary</div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-[#111827]">{formatUsd(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
                  <span>Delivery fee</span>
                  <span className="font-extrabold text-[#111827]">Calculate later</span>
                </div>

                <div className="border-t border-[#f0eef6] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-[#111827]">Total</span>
                    <span className="text-[18px] font-extrabold text-[#e5484d]">{formatUsd(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#8d94a1]">
                    Delivery fee will be added after address information.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate('/shop/mall/orders')}
              className="mb-4 flex w-full items-center gap-3 rounded-[22px] bg-white px-4 py-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600]">
                <i className="fa-solid fa-clock-rotate-left text-[15px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-extrabold text-[#111827]">Order History</div>
                <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#8d94a1]">
                  View your previous Shadow Mall orders.
                </div>
              </div>

              <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#98a2b3]" />
            </button>

            <section className="rounded-[26px] bg-white px-5 py-12 text-center shadow-sm ring-1 ring-black/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
                <i className="fa-solid fa-cart-shopping text-[22px]" />
              </div>
              <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">Your cart is empty</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
                Add real books from Shadow Mall before checkout.
              </p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
              >
                Back to Shop
              </button>
            </section>
          </>
        )}
      </main>

      {items.length ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-[#8d94a1]">Total</div>
              <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatUsd(subtotal)}</div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/shop/mall/checkout')}
              className="flex h-[52px] min-w-[160px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99]"
            >
              Checkout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

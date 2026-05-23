import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialCartItems = [
  {
    id: '1',
    title: 'គ្រោះព្រោះនិស្ស័យ',
    author: 'ពេជ្រ ជិន្នា',
    cover: '/assets/ShadowMall/books/book-1.jpg',
    price: 36000,
    oldPrice: 44000,
    quantity: 1,
  },
  {
    id: '2',
    title: 'Silent Moon',
    author: 'Shadow Author',
    cover: '/assets/ShadowMall/books/book-2.jpg',
    price: 32000,
    oldPrice: 0,
    quantity: 1,
  },
]

function formatRiel(value) {
  return `${Number(value || 0).toLocaleString('en-US')}៛`
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[#eef0f4]">
          <img
            src={item.cover}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
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
              <div className="text-[14px] font-extrabold text-[#e5484d]">{formatRiel(item.price)}</div>
              {item.oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1] line-through">
                  {formatRiel(item.oldPrice)}
                </div>
              ) : null}
            </div>

            <div className="flex items-center rounded-full bg-[#f5f3fa] p-1">
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#111827] active:scale-95"
              >
                <i className="fa-solid fa-minus text-[10px]" />
              </button>
              <div className="w-9 text-center text-[13px] font-extrabold text-[#111827]">{item.quantity}</div>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
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
  const [items, setItems] = useState(initialCartItems)

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const increaseItem = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    )
  }

  const decreaseItem = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    )
  }

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[120px]">
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

          <h1 className="text-[17px] font-extrabold text-[#111827]">My Cart</h1>

          <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#111827] px-3 text-[12px] font-extrabold text-white">
            {itemCount}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {items.length ? (
          <>
            <section className="mb-4 rounded-[22px] bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
              <div className="text-[14px] font-extrabold text-[#111827]">Selected Books</div>
              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                Check your books and quantity before checkout.
              </div>
            </section>

            <section className="space-y-3">
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
                  <span className="font-extrabold text-[#111827]">{formatRiel(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[13px] font-semibold text-[#667085]">
                  <span>Delivery fee</span>
                  <span className="font-extrabold text-[#111827]">Calculate later</span>
                </div>

                <div className="border-t border-[#f0eef6] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-[#111827]">Total</span>
                    <span className="text-[18px] font-extrabold text-[#e5484d]">{formatRiel(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#8d94a1]">
                    Delivery fee will be added after address information.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-[26px] bg-white px-5 py-12 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i className="fa-solid fa-cart-shopping text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">Your cart is empty</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
              Add books from Shadow Mall before checkout.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
            >
              Back to Shop
            </button>
          </section>
        )}
      </main>

      {items.length ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-[#8d94a1]">Total</div>
              <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatRiel(subtotal)}</div>
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

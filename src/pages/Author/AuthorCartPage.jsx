import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getCartItems() {
  try {
    const raw = localStorage.getItem('shadow_author_cart_items') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartItems(items) {
  localStorage.setItem('shadow_author_cart_items', JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

function money(value) {
  const number = Number(value || 0)
  return `$${number.toFixed(2)}`
}

export default function AuthorCartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(getCartItems)

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price_value || 0) * Number(item.quantity || 1), 0)
  }, [items])

  function updateQuantity(id, nextQuantity) {
    const nextItems = items.map((item) => (
      item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item
    ))
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  function removeItem(id) {
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-[92px]">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <div className="min-w-0 flex-1 px-3 text-[18px] font-black text-[#111827]">My Cart</div>
          <div className="relative flex h-10 w-10 items-center justify-center text-[#111827]">
            <i className="fa-solid fa-cart-shopping text-[17px]" />
            {items.length ? (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f6c400] px-1 text-[10px] font-black text-[#111827]">
                {items.length > 99 ? '99+' : items.length}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        <section className="rounded-[24px] bg-white px-4 py-4 shadow-sm ring-1 ring-black/5">
          <h1 className="text-[15px] font-black text-[#111827]">Selected Books</h1>
          <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">Check your books and quantity before checkout.</p>
        </section>

        <button type="button" onClick={() => navigate('/author/orders')} className="mt-3 flex w-full items-center justify-between rounded-[24px] bg-white px-4 py-4 text-left shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4cc] text-[#9a6a00]">
              <i className="fa-solid fa-clock-rotate-left text-[15px]" />
            </span>
            <span>
              <span className="block text-[14px] font-black text-[#111827]">Order History</span>
              <span className="mt-0.5 block text-[11px] font-semibold text-[#8b93a1]">View your previous author store orders.</span>
            </span>
          </div>
          <i className="fa-solid fa-chevron-right text-[12px] text-[#b7bdc8]" />
        </button>

        <section className="mt-3 space-y-3">
          {items.length ? items.map((item) => (
            <article key={item.id} className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5">
              <div className="flex gap-3">
                <div className="h-[96px] w-[70px] shrink-0 overflow-hidden rounded-[14px] bg-[#f3f4f6] ring-1 ring-black/5">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
                      <i className="fa-regular fa-image text-[18px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="line-clamp-1 text-[14px] font-black text-[#111827]">{item.title}</h2>
                      <p className="mt-1 text-[11px] font-semibold text-[#8b93a1]">{item.type || 'Book'}</p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95">
                      <i className="fa-solid fa-trash text-[11px]" />
                    </button>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="text-[14px] font-black text-[#e5484d]">{money(Number(item.price_value || 0) * Number(item.quantity || 1))}</div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827]">
                        <i className="fa-solid fa-minus text-[11px]" />
                      </button>
                      <span className="w-5 text-center text-[13px] font-black text-[#111827]">{item.quantity || 1}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white">
                        <i className="fa-solid fa-plus text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )) : (
            <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827]">
                <i className="fa-solid fa-cart-shopping text-[20px]" />
              </div>
              <h2 className="text-[16px] font-black text-[#111827]">Your cart is empty</h2>
              <p className="mx-auto mt-2 max-w-[260px] text-[12px] font-semibold leading-5 text-[#8b93a1]">Add books from an author store to see them here.</p>
            </div>
          )}
        </section>

        <section className="mt-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="text-[15px] font-black text-[#111827]">Order Summary</h2>
          <div className="mt-4 space-y-3 text-[12px] font-semibold">
            <div className="flex justify-between text-[#42526b]">
              <span>Subtotal</span>
              <span className="font-black text-[#111827]">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#42526b]">
              <span>Delivery fee</span>
              <span className="font-black text-[#111827]">Calculate later</span>
            </div>
            <div className="border-t border-[#eef0f4] pt-3">
              <div className="flex justify-between text-[14px] font-black text-[#111827]">
                <span>Total</span>
                <span className="text-[#e5484d]">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-[#8b93a1]">Delivery fee will be added after address information.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[980px] items-center justify-between px-4">
          <div>
            <div className="text-[11px] font-semibold text-[#8b93a1]">Total</div>
            <div className="mt-1 text-[17px] font-black text-[#e5484d]">{money(subtotal)}</div>
          </div>
          <button type="button" onClick={() => alert('Checkout is next stage.')} className="h-12 rounded-full bg-[#111827] px-10 text-[13px] font-black text-white shadow-xl active:scale-95">
            Checkout
          </button>
        </div>
      </footer>
    </div>
  )
}

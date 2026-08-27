import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getShadowMallWishlist,
  removeShadowMallWishlist,
  saveShadowMallWishlist,
} from '../../utils/shadowMallWishlist'

const CART_KEY = 'shadow_mall_cart'

function formatUsd(value) {
  const number = Number(String(value || '').replace('$', ''))
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function normalizePrice(value) {
  return Number(String(value || '').replace('$', '')) || 0
}

function addToCart(product) {
  const current = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  const existingIndex = current.findIndex((item) => String(item.id) === String(product.id))

  const cartItem = {
    id: product.id,
    title: product.title,
    author: product.author,
    cover: product.cover,
    price: normalizePrice(product.price),
    oldPrice: normalizePrice(product.oldPrice),
    quantity: 1,
  }

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      quantity: Number(current[existingIndex].quantity || 0) + 1,
    }
  } else {
    current.push(cartItem)
  }

  localStorage.setItem(CART_KEY, JSON.stringify(current))
  window.dispatchEvent(new Event('shadow-mall-cart-updated'))
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function WishlistItem({ item, onRemove, onAddToCart, onOpen }) {
  const price = normalizePrice(item.price)
  const oldPrice = normalizePrice(item.oldPrice)

  return (
    <article className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[var(--shadow-bg-soft)]"
        >
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
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[18px]" />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[var(--shadow-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
                {item.author}
              </p>
            </button>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95 dark:bg-red-500/10 dark:text-red-300"
              aria-label={`Remove ${item.title}`}
            >
              <i className="fa-solid fa-trash text-[11px]" />
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <button type="button" onClick={onOpen} className="text-left">
              <div className="text-[14px] font-extrabold text-[#e5484d]">{formatUsd(price)}</div>
              {oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                  {formatUsd(oldPrice)}
                </div>
              ) : null}
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallWishlistPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getShadowMallWishlist())
  }, [])

  function handleRemove(id) {
    const next = removeShadowMallWishlist(id)
    setItems(next)
  }

  function handleAddToCart(item) {
    addToCart(item)
    navigate('/shop/mall/cart')
  }

  function handleClearAll() {
    saveShadowMallWishlist([])
    setItems([])
  }

  const itemCount = useMemo(() => items.length, [items])

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">My Wishlist</h1>

          {itemCount > 0 ? (
            <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#111827] px-3 text-[12px] font-extrabold text-white dark:bg-white dark:text-[#111827]">
              {itemCount}
            </div>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {items.length ? (
          <>
            <section className="mb-4 flex items-center justify-between gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div>
                <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">Saved Books</div>
                <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  Books you saved for later.
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-full bg-[#fff1f1] px-4 py-2 text-[12px] font-extrabold text-[#e5484d] active:scale-95 dark:bg-red-500/10 dark:text-red-300"
              >
                Clear
              </button>
            </section>

            <section className="space-y-3">
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemove(item.id)}
                  onAddToCart={() => handleAddToCart(item)}
                  onOpen={() => navigate(`/shop/mall/product/${item.id}`)}
                />
              ))}
            </section>
          </>
        ) : (
          <section className="rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
              <i className="fa-regular fa-heart text-[24px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">No saved books yet</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              Tap the heart icon on any Shadow Mall book to save it here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              Back to Shop
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

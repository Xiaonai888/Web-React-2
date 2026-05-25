import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addShadowMallCartItem } from '../../utils/shadowMallCart'
import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || 'Untitled book',
    author: product.author_name || 'Unknown author',
    cover: product.cover_url || '',
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'in_stock',
  }
}

function isSoldOut(product) {
  return String(product.status || '').toLowerCase() === 'sold_out'
}

function SearchResultItem({ product, onOpen }) {
  const soldOut = isSoldOut(product)
  const [wishlisted, setWishlisted] = useState(() => isShadowMallWishlisted(product.id))

  useEffect(() => {
    const refreshWishlist = () => {
      setWishlisted(isShadowMallWishlisted(product.id))
    }

    window.addEventListener('shadow-mall-wishlist-change', refreshWishlist)
    window.addEventListener('storage', refreshWishlist)
    window.addEventListener('focus', refreshWishlist)

    return () => {
      window.removeEventListener('shadow-mall-wishlist-change', refreshWishlist)
      window.removeEventListener('storage', refreshWishlist)
      window.removeEventListener('focus', refreshWishlist)
    }
  }, [product.id])

  function handleWishlistClick(event) {
    event.stopPropagation()
    const result = toggleShadowMallWishlist(product)
    setWishlisted(result.wishlisted)
  }

  return (
    <article className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[#eef0f4]"
        >
          {product.cover ? (
            <img
              src={product.cover}
              alt={product.title}
              className={`h-full w-full object-cover ${soldOut ? 'opacity-60' : ''}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
              <i className="fa-solid fa-book-open text-[18px]" />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#111827]">
                {product.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[#8d94a1]">
                {product.author}
              </p>
            </button>

            <button
              type="button"
              onClick={handleWishlistClick}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] active:scale-95 ${
                wishlisted ? 'text-[#e5484d]' : 'text-[#111827]'
              }`}
              aria-label={`${wishlisted ? 'Remove saved' : 'Save'} ${product.title}`}
            >
              <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[12px]`} />
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <button type="button" onClick={onOpen} className="text-left">
              <div className="text-[14px] font-extrabold text-[#e5484d]">{product.price}</div>
              {product.oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1] line-through">
                  {product.oldPrice}
                </div>
              ) : null}
            </button>

            <button
              type="button"
              disabled={soldOut}
              onClick={() => {
                if (soldOut) return
                addShadowMallCartItem(product, 1)
              }}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95 ${
                soldOut ? 'bg-[#eef2f7] text-[#98a2b3]' : 'bg-[#111827] text-white'
              }`}
              aria-label={`Add ${product.title} to cart`}
            >
              <i className="fa-solid fa-cart-shopping text-[12px]" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallSearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function searchProducts(keyword) {
    const cleanKeyword = keyword.trim()

    if (!cleanKeyword) {
      setProducts([])
      setMessage('')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        section: 'all',
        page: '1',
        limit: '30',
        search: cleanKeyword,
      })

      const response = await fetch(`${API_URL}/api/shadow-mall/products?${params.toString()}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to search books')
      }

      setProducts((data.products || []).map(normalizeProduct))
    } catch (error) {
      setProducts([])
      setMessage(error.message || 'Failed to search books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchProducts(query)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query])

  const hasQuery = query.trim().length > 0

  const helperText = useMemo(() => {
    if (!hasQuery) return 'Search all Shadow Mall books by title or author.'
    if (loading) return 'Searching...'
    if (products.length) return `${products.length} result${products.length > 1 ? 's' : ''} found`
    return 'No results found'
  }, [hasQuery, loading, products.length])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">
              Search Books
            </h1>
            <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[#8d94a1]">
              {helperText}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-4">
        <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-2 rounded-full bg-[#f4f5f7] px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-[14px] text-[#8d94a1]" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search books or authors"
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8d94a1]"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </section>

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d]">
            {message}
          </div>
        ) : null}

        {!hasQuery ? (
          <section className="mt-4 rounded-[26px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600]">
              <i className="fa-solid fa-magnifying-glass text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">Find books faster</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
              Type a book title or author name to see results here.
            </p>
          </section>
        ) : loading ? (
          <section className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[140px] animate-pulse rounded-[22px] bg-white shadow-sm ring-1 ring-black/5" />
            ))}
          </section>
        ) : products.length ? (
          <section className="mt-4 space-y-3">
            {products.map((product) => (
              <SearchResultItem
                key={product.id}
                product={product}
                onOpen={() => navigate(`/shop/mall/product/${product.id}`)}
              />
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-[26px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i className="fa-solid fa-book-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">No books found</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
              Try another title or author name.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

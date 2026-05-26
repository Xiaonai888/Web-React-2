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
    publisher: product.publisher || '',
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
              {product.publisher ? (
                <p className="mt-1 line-clamp-1 text-[10.5px] font-extrabold text-[#7a5600]">
                  {product.publisher}
                </p>
              ) : null}
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

function PublisherCard({ publisher, selected, onClick }) {
  const bookCount = Number(publisher.book_count || 0)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] px-4 py-4 text-left shadow-sm ring-1 active:scale-[0.99] ${
        selected
          ? 'bg-[#111827] text-white ring-[#111827]'
          : 'bg-white text-[#111827] ring-black/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${
            selected ? 'bg-white/15 text-white' : 'bg-[#fff7d8] text-[#7a5600]'
          }`}
        >
          {publisher.logo_url ? (
            <img
              src={publisher.logo_url}
              alt={publisher.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <i className="fa-solid fa-building text-[15px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[14px] font-extrabold">
            {publisher.name}
          </div>

          <div
            className={`mt-1 text-[11.5px] font-semibold ${
              selected ? 'text-white/65' : 'text-[#8d94a1]'
            }`}
          >
            {bookCount} {bookCount === 1 ? 'book' : 'books'}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function ShadowMallSearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [publishers, setPublishers] = useState([])
  const [selectedPublisher, setSelectedPublisher] = useState('')
  const [loading, setLoading] = useState(false)
  const [publishersLoading, setPublishersLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadPublishers() {
    try {
      setPublishersLoading(true)

      const response = await fetch(`${API_URL}/api/shadow-mall/publishers`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load publishers')
      }

      setPublishers(data.publishers || [])
    } catch {
      setPublishers([])
    } finally {
      setPublishersLoading(false)
    }
  }

  async function searchProducts({ keyword = query, publisher = selectedPublisher } = {}) {
    const cleanKeyword = keyword.trim()
    const cleanPublisher = publisher.trim()

    if (!cleanKeyword && !cleanPublisher) {
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
        limit: '50',
      })

      if (cleanKeyword) params.set('search', cleanKeyword)
      if (cleanPublisher) params.set('publisher', cleanPublisher)

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
    loadPublishers()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchProducts({ keyword: query, publisher: selectedPublisher })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query, selectedPublisher])

  const hasQuery = query.trim().length > 0
  const hasPublisher = selectedPublisher.trim().length > 0
  const showPublishers = !hasQuery && !hasPublisher

  const helperText = useMemo(() => {
    if (hasPublisher) return `${selectedPublisher} books`
    if (!hasQuery) return 'Search by title, author, or browse by publisher.'
    if (loading) return 'Searching...'
    if (products.length) return `${products.length} result${products.length > 1 ? 's' : ''} found`
    return 'No results found'
  }, [hasQuery, hasPublisher, selectedPublisher, loading, products.length])

  function clearAll() {
    setQuery('')
    setSelectedPublisher('')
    setProducts([])
    setMessage('')
  }

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
              onFocus={() => {
                if (selectedPublisher) setSelectedPublisher('')
              }}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search books or authors"
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
            />
            {query || selectedPublisher ? (
              <button
                type="button"
                onClick={clearAll}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8d94a1]"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </section>

        {showPublishers ? (
          <section className="mt-4">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-extrabold text-[#111827]">Browse by Publisher</h2>
                <p className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                  Choose a publisher to view their books.
                </p>
              </div>
            </div>

            {publishersLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[112px] animate-pulse rounded-[22px] bg-white shadow-sm ring-1 ring-black/5" />
                ))}
              </div>
            ) : publishers.length ? (
              <div className="grid grid-cols-2 gap-3">
                {publishers.map((publisher) => (
                  <PublisherCard
                    key={publisher.id}
                    publisher={publisher}
                    selected={selectedPublisher === publisher.name}
                    onClick={() => {
                      setQuery('')
                      setSelectedPublisher(publisher.name)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600]">
                  <i className="fa-solid fa-building text-[22px]" />
                </div>
                <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">No publishers yet</h2>
                <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
                  Publishers will appear here after admin creates them.
                </p>
              </div>
            )}
          </section>
        ) : null}

        {selectedPublisher ? (
          <section className="mt-4 flex items-center justify-between gap-3 rounded-[20px] bg-[#111827] px-4 py-3 text-white shadow-sm">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white/60">Selected publisher</div>
              <div className="line-clamp-1 text-[14px] font-extrabold">{selectedPublisher}</div>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full bg-white/12 px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
            >
              Clear
            </button>
          </section>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d]">
            {message}
          </div>
        ) : null}

        {(hasQuery || hasPublisher) && loading ? (
          <section className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[140px] animate-pulse rounded-[22px] bg-white shadow-sm ring-1 ring-black/5" />
            ))}
          </section>
        ) : (hasQuery || hasPublisher) && products.length ? (
          <section className="mt-4 space-y-3">
            {products.map((product) => (
              <SearchResultItem
                key={product.id}
                product={product}
                onOpen={() => navigate(`/shop/mall/product/${product.id}`)}
              />
            ))}
          </section>
        ) : (hasQuery || hasPublisher) ? (
          <section className="mt-4 rounded-[26px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i className="fa-solid fa-book-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">No books found</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
              Try another title, author, or publisher.
            </p>
          </section>
        ) : null}
      </main>
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const sortOptions = [
  { key: 'latest', label: 'Latest Sold Out' },
  { key: 'price_low', label: 'Price Low' },
  { key: 'price_high', label: 'Price High' },
]

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
    category: product.category || 'sold_out',
    priceValue: Number(product.price_usd || 0),
    oldPriceValue: product.old_price_usd === null ? 0 : Number(product.old_price_usd || 0),
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'sold_out',
    createdAt: product.created_at || '',
  }
}

function ProductCard({ product, onOpen }) {
  const hasOldPrice = Boolean(String(product.oldPrice || '').trim())
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
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f3f4f6]">
          {product.cover ? (
            <img
              src={product.cover}
              alt={product.title}
              className="h-full w-full object-cover opacity-60 grayscale-[20%] transition duration-300 hover:scale-[1.03]"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
              <i className="fa-solid fa-book-open text-[22px]" />
            </div>
          )}

          <div className="absolute inset-0 bg-white/10" />

          <span className="absolute left-2 top-2 rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[9px] font-extrabold text-[#64748b] shadow-sm">
            SOLD OUT
          </span>

          <span className="absolute bottom-2 left-2 rounded-full bg-[#111827] px-2.5 py-1 text-[9px] font-extrabold text-white shadow-sm">
            RECENTLY SOLD
          </span>

          <button
            type="button"
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm active:scale-95 ${
              wishlisted ? 'text-[#e5484d]' : 'text-[#111827]'
            }`}
            aria-label={`${wishlisted ? 'Remove saved' : 'Save'} ${product.title}`}
            onClick={handleWishlistClick}
          >
            <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`} />
          </button>
        </div>
      </button>

      <div className="p-3">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[#111827]">
            {product.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8d94a1]">
            {product.author}
          </p>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <button type="button" onClick={onOpen} className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#64748b]">
              {product.price}
            </div>

            {hasOldPrice ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[#a0a5b1] line-through">
                {product.oldPrice}
              </div>
            ) : null}
          </button>

          <button
            type="button"
            disabled
            className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[#eef2f7] text-[#98a2b3]"
            aria-label={`${product.title} is sold out`}
          >
            <i className="fa-solid fa-cart-shopping text-[12px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallRecentlySoldOutPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  async function loadProducts(options = {}) {
    const nextPage = options.page || page
    const nextSearch = options.search ?? search

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        section: 'sold_out',
        page: String(nextPage),
        limit: '24',
        search: nextSearch.trim(),
      })

      const response = await fetch(`${API_URL}/api/shadow-mall/products?${params.toString()}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load Recently Sold Out books')
      }

      setProducts((data.products || []).map(normalizeProduct))
      setMeta({
        total: data.total || 0,
        total_pages: data.total_pages || 1,
        has_next: nextPage < (data.total_pages || 1),
        has_prev: nextPage > 1,
      })
    } catch (error) {
      setProducts([])
      setMessage(error.message || 'Failed to load Recently Sold Out books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts({ page, search })
  }, [page])

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products]

    if (sort === 'price_low') {
      nextProducts.sort((a, b) => a.priceValue - b.priceValue)
    }

    if (sort === 'price_high') {
      nextProducts.sort((a, b) => b.priceValue - a.priceValue)
    }

    if (sort === 'latest') {
      nextProducts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    }

    return nextProducts
  }, [products, sort])

  function handleSearchSubmit(event) {
    event.preventDefault()
    setPage(1)
    loadProducts({ page: 1, search })
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">Recently Sold Out</h1>
            <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[#8d94a1]">
              {meta.total} books · Popular books that sold out recently.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Search Recently Sold Out books"
          >
            <i className="fa-solid fa-magnifying-glass text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-4">
        <section className="mb-3 overflow-hidden rounded-[24px] bg-[#f1f5f9] px-4 py-4 shadow-sm ring-1 ring-[#e2e8f0]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white text-[#64748b]">
              <i className="fa-solid fa-box-open text-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-extrabold text-[#111827]">
                Popular books that disappeared fast
              </h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#64748b]">
                These books are currently sold out. Save them to your wishlist and check again when stock returns.
              </p>
            </div>
          </div>
        </section>

        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-2 rounded-full bg-[#f4f5f7] px-4 py-3">
              <i className="fa-solid fa-magnifying-glass text-[14px] text-[#8d94a1]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sold out books or authors"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPage(1)
                    loadProducts({ page: 1, search: '' })
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8d94a1]"
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark text-[12px]" />
                </button>
              ) : null}
            </div>
          </form>
        ) : null}

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sortOptions.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSort(item.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold active:scale-95 ${
                sort === item.key
                  ? 'bg-[#111827] text-white'
                  : 'bg-white text-[#667085] ring-1 ring-black/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d]">
            {message}
          </div>
        ) : null}

        {loading && !products.length ? (
          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] animate-pulse rounded-[22px] bg-white shadow-sm ring-1 ring-black/5" />
            ))}
          </section>
        ) : sortedProducts.length ? (
          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() => navigate(`/shop/mall/product/${product.id}`)}
              />
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-[26px] bg-white px-5 py-12 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i className="fa-solid fa-box-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">No sold out books found</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#8d94a1]">
              Try another search or check Recently Sold Out again later.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
            >
              Back to Shadow Mall
            </button>
          </section>
        )}

        {sortedProducts.length ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
            <button
              type="button"
              disabled={!meta.has_prev}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="rounded-full bg-[#f5f3fa] px-4 py-2 text-[12px] font-extrabold text-[#111827] disabled:text-[#a0a5b1]"
            >
              Previous
            </button>

            <div className="text-[12px] font-extrabold text-[#667085]">
              Page {page} / {meta.total_pages}
            </div>

            <button
              type="button"
              disabled={!meta.has_next}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[#d1d5db]"
            >
              Next
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const STORE_TYPE_FILTERS = ['All', 'Book', 'PDF']

function formatPrice(product) {
  const sale = Number(product.sale_price || 0)
  const original = Number(product.original_price || 0)
  const price = sale || original

  return `$${price.toFixed(2)}`
}

function EmptyStore() {
  return (
    <div className="rounded-[24px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-solid fa-bag-shopping text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[#111827]">No store items yet</h3>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Paper books, PDFs, bundles, and pre-orders from this author will appear here.
      </p>
    </div>
  )
}

function PublicProductCard({ product }) {
  const hasDiscount = Number(product.sale_price || 0) > 0 && Number(product.original_price || 0) > Number(product.sale_price || 0)

  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[3/4] bg-[#f3f4f6]">
        {product.cover_url ? (
          <img src={product.cover_url} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-regular fa-image text-[28px]" />
          </div>
        )}

        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-[#111827] shadow-sm">
          {product.type}
        </span>

        <button
          type="button"
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-lg ring-1 ring-black/5 active:scale-95"
        >
          <i className="fa-solid fa-bag-shopping text-[13px]" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[14px] font-black leading-5 text-[#111827]">
          {product.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/5">
            {product.category}
          </span>
          {product.pre_order ? (
            <span className="rounded-full bg-[#fff4cc] px-2 py-1 text-[10px] font-black text-[#111827]">
              Pre-order
            </span>
          ) : null}
        </div>

        <div className="mt-2 text-[15px] font-black text-[#111827]">
          {formatPrice(product)}
          {hasDiscount ? (
            <span className="ml-2 text-[11px] font-bold text-[#9ca3af] line-through">
              ${Number(product.original_price || 0).toFixed(2)}
            </span>
          ) : null}
        </div>

        <div className="mt-1 text-[11px] font-bold text-[#8b93a1]">
          {product.product_type === 'book'
            ? `${product.stock_quantity || 0} stock • ${product.book_condition || 'New'}`
            : `${product.page_count || 0} pages • PDF`}
        </div>
      </div>
    </div>
  )
}

export default function AuthorPublicStoreSection({ author, activeType, activeCategory, onTypeChange, onCategoryChange }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const categories = useMemo(() => {
    const values = products.map((product) => product.category).filter(Boolean)
    return ['All', ...Array.from(new Set(values))]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const typeOk = activeType === 'All' || product.type === activeType
      const categoryOk = !activeCategory || activeCategory === 'All' || product.category === activeCategory
      return typeOk && categoryOk
    })
  }, [activeCategory, activeType, products])

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      if (!author?.page_username) {
        setProducts([])
        return
      }

      try {
        setLoading(true)
        setLocalError('')

        const response = await fetch(`${API_BASE_URL}/api/author-store/page/${encodeURIComponent(author.page_username)}/products`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load store products')
        }

        if (!ignore) {
          setProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch (error) {
        if (!ignore) {
          setProducts([])
          setLocalError(error.message || 'Failed to load store products')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [author?.page_username])

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-black text-[#111827]">Store</h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b93a1]">
              Books and PDFs from this author.
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {STORE_TYPE_FILTERS.map((type) => {
            const active = activeType === type

            return (
              <button
                key={type}
                type="button"
                onClick={() => onTypeChange(type)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
                  active
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-3 text-[15px] font-black text-[#111827]">Categories</h3>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const active = (activeCategory || 'All') === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
                  active
                    ? 'bg-[#fff4cc] text-[#111827] ring-1 ring-[#f6b800]/40'
                    : 'bg-[#f8fafc] text-[#6b7280] ring-1 ring-black/5'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {localError ? (
        <div className="rounded-[18px] bg-[#fff7ed] px-4 py-3 text-[12px] font-bold text-[#9a3412]">
          {localError}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[24px] bg-white p-7 text-center text-[13px] font-bold text-[#8b93a1] shadow-sm ring-1 ring-black/5">
          Loading store products...
        </div>
      ) : filteredProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredProducts.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyStore />
      )}
    </div>
  )
}

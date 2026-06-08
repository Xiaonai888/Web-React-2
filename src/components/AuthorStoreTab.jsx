import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const STORE_TYPE_FILTERS = ['All', 'Books', 'PDF']

const STORE_SECTIONS = [
  {
    key: 'new-books',
    title: 'New Books',
    subtitle: 'Fresh copies and latest arrivals.',
    types: ['Book'],
    categories: ['New Release', 'Special Edition', 'Author Picks'],
  },
  {
    key: 'second-hand',
    title: 'Second Hand',
    subtitle: 'Checked condition, lower price, limited stock.',
    types: ['Book'],
    conditions: ['Second Hand'],
  },
  {
    key: 'best-seller',
    title: 'Best Seller',
    subtitle: 'Books readers are choosing most.',
    types: ['Book'],
    categories: ['Best Seller'],
  },
  {
    key: 'pdf-books',
    title: 'PDF Books',
    subtitle: 'Digital books from this author.',
    types: ['PDF'],
  },
  {
    key: 'pre-order',
    title: 'Pre-order',
    subtitle: 'Reserve upcoming books before release.',
    types: ['Book'],
    preOrder: true,
  },
]

function formatMoney(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function normalizeProduct(product) {
  const type = product.type || (product.product_type === 'pdf' ? 'PDF' : 'Book')
  const salePrice = Number(product.sale_price || 0)
  const originalPrice = Number(product.original_price || 0)
  const price = salePrice || originalPrice

  return {
    id: product.id,
    author_page_id: product.author_page_id,
    title: product.title || 'Untitled book',
    type,
    category: product.category || 'New Release',
    description: product.description || '',
    cover_url: product.cover_url || '',
    price: formatMoney(price),
    old_price: salePrice && originalPrice && salePrice !== originalPrice ? formatMoney(originalPrice) : '',
    stock_label: product.pre_order ? 'PRE-ORDER' : product.stock_quantity > 0 || type === 'PDF' ? 'IN STOCK' : 'OUT OF STOCK',
    stock_quantity: Number(product.stock_quantity || 0),
    condition: product.book_condition || 'New',
    pre_order: Boolean(product.pre_order),
    created_at: product.created_at || '',
  }
}

async function fetchPublicAuthorStoreProducts(pageUsername) {
  const response = await fetch(`${API_BASE_URL}/api/author-store/page/${encodeURIComponent(pageUsername)}/products`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load store products')
  }

  return Array.isArray(data.products) ? data.products.map(normalizeProduct) : []
}

function sectionMatchesProduct(section, product) {
  if (section.types?.length && !section.types.includes(product.type)) return false
  if (section.preOrder && !product.pre_order) return false
  if (section.conditions?.length && !section.conditions.includes(product.condition)) return false
  if (section.categories?.length && !section.categories.includes(product.category)) return false
  return true
}

function AuthorStoreProductCard({ item, onOpen, onAddToCart }) {
  const isOutOfStock = item.stock_label === 'OUT OF STOCK'

  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[#f3f4f6] text-left"
      >
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-regular fa-bookmark text-[26px]" />
          </div>
        )}

        {item.stock_label ? (
          <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
            isOutOfStock ? 'bg-[#f3f4f6] text-[#6b7280]' : 'bg-[#ecfdf3] text-[#027a48]'
          }`}>
            {item.stock_label}
          </span>
        ) : null}
      </button>

      <div className="p-3">
        <button type="button" onClick={() => onOpen?.(item)} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-black leading-[18px] text-[#111827]">
            {item.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8b93a1]">
            {item.type}
          </p>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-[13px] font-black text-[#e5484d]">
              {item.price}
            </div>
            {item.old_price ? (
              <div className="text-[11px] font-semibold text-[#9ca3af] line-through">
                {item.old_price}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(item)}
            disabled={isOutOfStock}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 disabled:bg-[#d1d5db]"
            aria-label="Add to cart"
          >
            <i className="fa-solid fa-cart-shopping text-[13px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

function AuthorStoreShelf({ section, items, onMore, onOpenItem, onAddToCart }) {
  if (!items.length) return null

  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[17px] font-black leading-5 text-[#111827]">{section.title}</h2>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[#8b93a1]">
            {section.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onMore?.(section)}
          className="shrink-0 pt-0.5 text-[12px] font-black text-[#8b93a1] active:opacity-70"
        >
          More &gt;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <AuthorStoreProductCard
            key={item.id}
            item={item}
            onOpen={onOpenItem}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  )
}

export default function AuthorStoreTab({ author, onMessage }) {
  const [activeType, setActiveType] = useState('All')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      if (!author?.page_username) return

      try {
        setLoading(true)
        setLoadError('')
        const nextProducts = await fetchPublicAuthorStoreProducts(author.page_username)

        if (!ignore) setProducts(nextProducts)
      } catch (error) {
        if (!ignore) {
          setProducts([])
          setLoadError(error.message || 'Failed to load store products')
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

  const visibleSections = useMemo(() => {
    return STORE_SECTIONS.map((section) => {
      const sectionItems = products.filter((product) => {
        const typeMatches = activeType === 'All' || product.type === activeType.slice(0, -1) || product.type === activeType
        return typeMatches && sectionMatchesProduct(section, product)
      })

      return {
        ...section,
        items: sectionItems,
      }
    }).filter((section) => section.items.length)
  }, [activeType, products])

  const isOwner = Boolean(author?.is_owner)

  return (
    <div className="space-y-5">
      <section className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[18px] font-black text-[#111827]">Store</h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
              Books, PDFs, bundles, and pre-orders from this author.
            </p>
          </div>

          {isOwner ? (
            <button
              type="button"
              onClick={() => onMessage?.('Manage store is coming soon.')}
              className="shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[11px] font-black text-[#111827] active:scale-95"
            >
              Manage
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {STORE_TYPE_FILTERS.map((type) => {
            const active = activeType === type

            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`h-8 shrink-0 rounded-full px-4 text-[12px] font-black transition active:scale-95 ${
                  active ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </section>

      {loading ? (
        <div className="rounded-[22px] bg-white px-4 py-10 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
          <div className="text-[13px] font-black text-[#111827]">Loading store...</div>
        </div>
      ) : null}

      {!loading && loadError ? (
        <div className="rounded-[22px] bg-white px-4 py-8 text-center shadow-sm ring-1 ring-black/5">
          <h3 className="text-[15px] font-black text-[#111827]">Could not load store</h3>
          <p className="mx-auto mt-1.5 max-w-[280px] text-[12px] font-semibold leading-5 text-[#8b93a1]">
            {loadError}
          </p>
        </div>
      ) : null}

      {!loading && !loadError && visibleSections.length ? (
        visibleSections.map((section) => (
          <AuthorStoreShelf
            key={section.key}
            section={section}
            items={section.items}
            onMore={() => onMessage?.(`${section.title} page is next stage.`)}
            onOpenItem={() => onMessage?.('Book detail page is next stage.')}
            onAddToCart={() => onMessage?.('Author Store cart is next stage.')}
          />
        ))
      ) : null}

      {!loading && !loadError && !visibleSections.length ? (
        <div className="rounded-[22px] bg-white px-4 py-10 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
            <i className="fa-regular fa-file-lines text-[17px]" />
          </div>
          <h3 className="text-[15px] font-black text-[#111827]">No store items yet</h3>
          <p className="mx-auto mt-1.5 max-w-[260px] text-[12px] font-semibold leading-5 text-[#8b93a1]">
            Active books and PDFs from this author will appear here.
          </p>
        </div>
      ) : null}
    </div>
  )
}

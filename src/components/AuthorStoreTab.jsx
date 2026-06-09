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
    emptyText: 'No new books yet.',
  },
  {
    key: 'second-hand',
    title: 'Second Hand',
    subtitle: 'Checked condition, lower price, limited stock.',
    types: ['Book'],
    conditions: ['Second Hand'],
    emptyText: 'No second hand books yet.',
  },
  {
    key: 'best-seller',
    title: 'Best Seller',
    subtitle: 'Books readers are choosing most.',
    types: ['Book'],
    categories: ['Best Seller'],
    emptyText: 'No best sellers yet.',
  },
  {
    key: 'pdf-books',
    title: 'PDF Books',
    subtitle: 'Digital books from this author.',
    types: ['PDF'],
    emptyText: 'No PDF books yet.',
  },
  {
    key: 'pre-order',
    title: 'Pre-order',
    subtitle: 'Reserve upcoming books before release.',
    types: ['Book'],
    preOrder: true,
    emptyText: 'No pre-orders yet.',
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
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
              isOutOfStock ? 'bg-[#f3f4f6] text-[#6b7280]' : 'bg-[#ecfdf3] text-[#027a48]'
            }`}
          >
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
            {item.category || item.type}
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

function SectionEmptyCard({ text }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#e5e7eb] bg-[#fbfbfd] px-4 py-7 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9ca3af] shadow-sm ring-1 ring-black/5">
        <i className="fa-regular fa-file-lines text-[15px]" />
      </div>
      <p className="text-[12px] font-semibold leading-5 text-[#8b93a1]">{text}</p>
    </div>
  )
}

function AuthorStoreShelf({ section, items, onMore, onOpenItem, onAddToCart }) {
  return (
    <section className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
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

      {items.length ? (
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
      ) : (
        <SectionEmptyCard text={section.emptyText} />
      )}
    </section>
  )
}

export default function AuthorStoreTab({ author, cartCount = 0, onCartCountChange, onMessage }) {
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
    return STORE_SECTIONS.filter((section) => {
      if (activeType === 'All') return true
      return section.types.includes(activeType.slice(0, -1)) || section.types.includes(activeType)
    }).map((section) => {
      const sectionItems = products.filter((product) => {
        const typeMatches = activeType === 'All' || product.type === activeType.slice(0, -1) || product.type === activeType
        return typeMatches && sectionMatchesProduct(section, product)
      })

      return {
        ...section,
        items: sectionItems,
      }
    })
  }, [activeType, products])

  const isOwner = Boolean(author?.is_owner)

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
        <div className="bg-gradient-to-br from-[#fffaf0] via-white to-[#f7f5ff] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-black leading-6 text-[#111827]">Store</h2>
                {loading ? (
                  <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-black text-[#8b93a1] ring-1 ring-black/5">
                    Loading
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
                Books, PDFs, bundles, and pre-orders from this author.
              </p>
            </div>

            {isOwner ? (
              <button
                type="button"
                onClick={() => onMessage?.('Manage store is coming soon.')}
                className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
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
                    active ? 'bg-[#111827] text-white' : 'bg-white text-[#6b7280] ring-1 ring-black/5'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {loadError ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="block w-full border-t border-[#f0eef6] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412]"
          >
            {loadError}
          </button>
        ) : null}
      </section>

      {visibleSections.map((section) => (
        <AuthorStoreShelf
          key={section.key}
          section={section}
          items={section.items}
          onMore={() => onMessage?.(`${section.title} page is next stage.`)}
          onOpenItem={() => onMessage?.('Book detail page is next stage.')}
          onAddToCart={(item) => {
  const rawCart = localStorage.getItem('shadow_author_cart_items') || '[]'
  const cartItems = JSON.parse(rawCart)
  const safeCartItems = Array.isArray(cartItems) ? cartItems : []
  const existingItem = safeCartItems.find((cartItem) => cartItem.id === item.id)

  const nextCartItems = existingItem
    ? safeCartItems.map((cartItem) => (
        cartItem.id === item.id ? { ...cartItem, quantity: Number(cartItem.quantity || 1) + 1 } : cartItem
      ))
    : [
        ...safeCartItems,
        {
          id: item.id,
          title: item.title,
          type: item.type,
          cover_url: item.cover_url,
          price_value: Number(String(item.price || '0').replace('$', '')) || 0,
          quantity: 1,
        },
      ]

  localStorage.setItem('shadow_author_cart_items', JSON.stringify(nextCartItems))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
  onCartCountChange?.(nextCartItems.reduce((total, cartItem) => total + Number(cartItem.quantity || 1), 0))
  onMessage?.(`${item.title} added to cart.`)
}}
        />
      ))}
    </div>
  )
}

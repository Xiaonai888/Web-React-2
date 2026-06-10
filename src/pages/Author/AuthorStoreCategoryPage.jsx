import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CATEGORY_CONFIG = {
  'new-books': {
    title: 'New Books',
    subtitle: 'Fresh copies and latest arrivals.',
    types: ['Book'],
    categories: ['New Books', 'New Release', 'Special Edition'],
  },
  'pdf-books': {
    title: 'PDF Books',
    subtitle: 'Digital books from this author.',
    types: ['PDF'],
  },
  'pre-order': {
    title: 'Pre-order',
    subtitle: 'Reserve upcoming books before release.',
    types: ['Book'],
    preOrder: true,
  },
  'best-seller': {
    title: 'Best Seller',
    subtitle: 'Books readers are choosing most.',
    types: ['Book'],
    categories: ['Best Seller'],
  },
  'second-hand': {
    title: 'Second Hand',
    subtitle: 'Checked condition, lower price, limited stock.',
    types: ['Book'],
    conditions: ['Second Hand'],
  },
  'author-picks': {
    title: 'Author Picks',
    subtitle: 'Selected books recommended by this author.',
    types: ['Book', 'PDF'],
    categories: ['Author Picks'],
  },
  'sold-out': {
    title: 'Sold out',
    subtitle: 'Books that readers already bought out.',
    types: ['Book'],
    soldOut: true,
  },
}

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
  const stockQuantity = Number(product.stock_quantity || product.stock_count || 0)

  return {
    id: product.id,
    author_page_id: product.author_page_id,
    title: product.title || 'Untitled book',
    type,
    category: product.category || 'New Books',
    description: product.description || '',
    cover_url: product.cover_url || '',
    price: formatMoney(price),
    old_price: salePrice && originalPrice && salePrice !== originalPrice ? formatMoney(originalPrice) : '',
    stock_label: product.pre_order ? 'PRE-ORDER' : stockQuantity > 0 || type === 'PDF' ? 'IN STOCK' : 'OUT OF STOCK',
    stock_quantity: stockQuantity,
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

function categoryMatchesProduct(category, product) {
  if (category.types?.length && !category.types.includes(product.type)) return false
  if (category.preOrder && !product.pre_order) return false
  if (category.soldOut && product.stock_label !== 'OUT OF STOCK') return false
  if (category.conditions?.length && !category.conditions.includes(product.condition)) return false
  if (category.categories?.length && !category.categories.includes(product.category)) return false
  return true
}

function ProductCard({ item, onOpen, onAddToCart }) {
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
            <div className="text-[13px] font-black text-[#e5484d]">{item.price}</div>
            {item.old_price ? (
              <div className="text-[11px] font-semibold text-[#9ca3af] line-through">{item.old_price}</div>
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

export default function AuthorStoreCategoryPage() {
  const navigate = useNavigate()
  const { pageUsername, categoryKey } = useParams()
  const category = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG['new-books']
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      if (!pageUsername) return

      try {
        setLoading(true)
        setLoadError('')
        const nextProducts = await fetchPublicAuthorStoreProducts(pageUsername)

        if (!ignore) setProducts(nextProducts)
      } catch (error) {
        if (!ignore) {
          setProducts([])
          setLoadError(error.message || 'Failed to load products')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [pageUsername])

  const visibleProducts = useMemo(() => {
    return products.filter((product) => categoryMatchesProduct(category, product))
  }, [category, products])

  function addToCart(item) {
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
            author_page_id: item.author_page_id || '',
            author_page_name: '',
            author_page_username: pageUsername || '',
          },
        ]

    localStorage.setItem('shadow_author_cart_items', JSON.stringify(nextCartItems))
    window.dispatchEvent(new Event('shadow-author-cart-updated'))
  }

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-24">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-black leading-5 text-[#111827]">{category.title}</h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#8b93a1]">
              {category.subtitle}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 pt-4">
        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-center text-[13px] font-bold text-[#8b93a1] shadow-sm ring-1 ring-black/5">
            Loading products...
          </div>
        ) : null}

        {loadError ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold text-[#9a3412]"
          >
            {loadError}
          </button>
        ) : null}

        {!loading && !loadError && visibleProducts.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleProducts.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onOpen={() => navigate(`/author/page/${pageUsername}/store/product/${item.id}`)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : null}

        {!loading && !loadError && !visibleProducts.length ? (
          <section className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af]">
              <i className="fa-regular fa-folder-open text-[18px]" />
            </div>
            <h2 className="text-[16px] font-black text-[#111827]">No products here yet</h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
              This category does not have public products right now.
            </p>
          </section>
        ) : null}
      </main>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorPublicStoreSection', {
  en: {
    all: 'All',
    book: 'Book',
    pdf: 'PDF',
    noItems: 'No store items yet',
    noItemsBody: 'Paper books, PDFs, bundles, and pre-orders from this author will appear here.',
    addToCart: 'Add to cart',
    preOrder: 'Pre-order',
    newCondition: 'New',
    stock: '{{count}} stock • {{condition}}',
    pages: '{{count}} pages • PDF',
    failedLoad: 'Failed to load store products',
    manage: 'Manage',
    categories: 'Categories',
    loading: 'Loading store products...',
  },
  km: {
    all: 'ទាំងអស់',
    book: 'សៀវភៅ',
    pdf: 'PDF',
    noItems: 'មិនទាន់មានទំនិញក្នុងហាងទេ',
    noItemsBody: 'សៀវភៅក្រដាស PDF កញ្ចប់ និងការកុម្ម៉ង់ទុកមុនពីអ្នកនិពន្ធនេះនឹងបង្ហាញនៅទីនេះ។',
    addToCart: 'បន្ថែមទៅកន្ត្រក',
    preOrder: 'កុម្ម៉ង់ទុកមុន',
    newCondition: 'ថ្មី',
    stock: 'ស្តុក {{count}} • {{condition}}',
    pages: '{{count}} ទំព័រ • PDF',
    failedLoad: 'មិនអាចផ្ទុកទំនិញក្នុងហាងបានទេ',
    manage: 'គ្រប់គ្រង',
    categories: 'ប្រភេទ',
    loading: 'កំពុងផ្ទុកទំនិញក្នុងហាង...',
  },
  zh: {
    all: '全部',
    book: '纸质书',
    pdf: 'PDF',
    noItems: '商店暂无商品',
    noItemsBody: '这位作者的纸质书、PDF、套装和预售商品会显示在这里。',
    addToCart: '加入购物车',
    preOrder: '预售',
    newCondition: '全新',
    stock: '库存 {{count}} • {{condition}}',
    pages: '{{count}} 页 • PDF',
    failedLoad: '无法加载商店商品',
    manage: '管理',
    categories: '分类',
    loading: '正在加载商店商品...',
  },
  ja: {
    all: 'すべて',
    book: '書籍',
    pdf: 'PDF',
    noItems: 'ストア商品はまだありません',
    noItemsBody: 'この作者の紙の本、PDF、セット商品、予約商品がここに表示されます。',
    addToCart: 'カートに追加',
    preOrder: '予約注文',
    newCondition: '新品',
    stock: '在庫 {{count}} • {{condition}}',
    pages: '{{count}} ページ • PDF',
    failedLoad: 'ストア商品を読み込めませんでした',
    manage: '管理',
    categories: 'カテゴリー',
    loading: 'ストア商品を読み込み中...',
  },
  ko: {
    all: '전체',
    book: '도서',
    pdf: 'PDF',
    noItems: '아직 스토어 상품이 없습니다',
    noItemsBody: '이 작가의 종이책, PDF, 묶음 상품과 예약 판매 상품이 여기에 표시됩니다.',
    addToCart: '장바구니에 추가',
    preOrder: '예약 판매',
    newCondition: '새 상품',
    stock: '재고 {{count}} • {{condition}}',
    pages: '{{count}}페이지 • PDF',
    failedLoad: '스토어 상품을 불러오지 못했습니다',
    manage: '관리',
    categories: '카테고리',
    loading: '스토어 상품을 불러오는 중...',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const STORE_TYPE_FILTERS = ['All', 'Book', 'PDF']
function getFilterLabel(type, t) {
  if (type === 'All') return t('authorPublicStoreSection.all')
  if (type === 'Book') return t('authorPublicStoreSection.book')
  if (type === 'PDF') return t('authorPublicStoreSection.pdf')
  return type
}

function formatPrice(product) {
  const sale = Number(product.sale_price || 0)
  const original = Number(product.original_price || 0)
  const price = sale || original

  return `$${price.toFixed(2)}`
}

function EmptyStore({ t }) {
  return (
    <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-7 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className="fa-solid fa-bag-shopping text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorPublicStoreSection.noItems')}</h3>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-[var(--shadow-text-tertiary)]">
        {t('authorPublicStoreSection.noItemsBody')}
      </p>
    </div>
  )
}

function PublicProductCard({ product, onAddToCart, t }) {
  const hasDiscount = Number(product.sale_price || 0) > 0 && Number(product.original_price || 0) > Number(product.sale_price || 0)
  const buttonRef = useRef(null)

  function handleAddToCart() {
    if (!buttonRef.current) {
      onAddToCart?.(product, null)
      return
    }

    const rect = buttonRef.current.getBoundingClientRect()

    onAddToCart?.(product, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  return (
    <div className="overflow-hidden rounded-[22px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="relative aspect-[3/4] bg-[var(--shadow-bg-soft)]">
        {product.cover_url ? (
          <img src={product.cover_url} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-image text-[28px]" />
          </div>
        )}

        <span className="absolute left-2 top-2 rounded-full bg-[var(--shadow-bg-elevated)] px-2.5 py-1 text-[10px] font-black text-[var(--shadow-text-primary)] shadow-sm">
          {getFilterLabel(product.type, t)}
        </span>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-lg ring-1 ring-[var(--shadow-border)] active:scale-95"
          aria-label={t('authorPublicStoreSection.addToCart')}
        >
          <i className="fa-solid fa-bag-shopping text-[13px]" />
        </button>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[38px] text-[14px] font-black leading-5 text-[var(--shadow-text-primary)]">
          {product.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[10px] font-black text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]">
            {product.category}
          </span>
          {product.pre_order ? (
            <span className="rounded-full bg-[#fff4cc] px-2 py-1 text-[10px] font-black text-[#111827]">
              {t('authorPublicStoreSection.preOrder')}
            </span>
          ) : null}
        </div>

        <div className="mt-2 text-[15px] font-black text-[var(--shadow-text-primary)]">
          {formatPrice(product)}
          {hasDiscount ? (
            <span className="ml-2 text-[11px] font-bold text-[var(--shadow-text-tertiary)] line-through">
              ${Number(product.original_price || 0).toFixed(2)}
            </span>
          ) : null}
        </div>

        <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
          {product.product_type === 'book'
            ? t('authorPublicStoreSection.stock', {
                count: product.stock_quantity || 0,
                condition:
                  product.book_condition ||
                  t('authorPublicStoreSection.newCondition'),
              })
            : t('authorPublicStoreSection.pages', {
                count: product.page_count || 0,
              })}
        </div>
      </div>
    </div>
  )
}

export default function AuthorPublicStoreSection({ author, activeType, activeCategory, onTypeChange, onCategoryChange, isOwner = false }) {
  const { t } = useDisplayTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [cartFly, setCartFly] = useState(null)

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


  function handleAddToCart(product, fromPoint) {
  if (!fromPoint) return

  setCartFly({
    id: `${product.id}-${Date.now()}`,
    x: fromPoint.x,
    y: fromPoint.y,
  })

  window.setTimeout(() => setCartFly(null), 700)
}

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
          throw new Error(data.message || t('authorPublicStoreSection.failedLoad'))
        }

        if (!ignore) {
          setProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch (error) {
        if (!ignore) {
          setProducts([])
          setLocalError(error.message || t('authorPublicStoreSection.failedLoad'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [author?.page_username, t])

 return (
  <div className="relative space-y-4">
    {cartFly ? (
      <span
        key={cartFly.id}
        className="pointer-events-none fixed z-[300] flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-page)] shadow-2xl transition-all duration-700 ease-out"
        style={{
          left: cartFly.x,
          top: cartFly.y,
          transform: 'translate(-50%, -50%) translate(90px, -360px) scale(0.35)',
          opacity: 0,
        }}
      >
        <i className="fa-solid fa-bag-shopping text-[13px]" />
      </span>
    ) : null}
      <div className="flex items-center justify-between gap-3 px-1">
  <div className="flex gap-2 overflow-x-auto pb-1">
    {STORE_TYPE_FILTERS.map((type) => {
      const active = activeType === type

      return (
        <button
          key={type}
          type="button"
          onClick={() => onTypeChange(type)}
          className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
            active
              ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-page)]'
              : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
          }`}
        >
          {getFilterLabel(type, t)}
        </button>
      )
    })}
  </div>

  {isOwner ? (
    <button
      type="button"
      onClick={() => window.location.assign('/author/page/store')}
      className="shrink-0 rounded-full bg-[var(--shadow-bg-surface)] px-4 py-2 text-[12px] font-black text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] active:scale-95"
    >
      {t('authorPublicStoreSection.manage')}
    </button>
  ) : null}
</div>

      <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
        <h3 className="mb-3 text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorPublicStoreSection.categories')}</h3>

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
                    : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
                }`}
              >
                {category === 'All' ? t('authorPublicStoreSection.all') : category}
              </button>
            )
          })}
        </div>
      </div>

      {localError ? (
        <div className="rounded-[18px] bg-[#fff7ed] px-4 py-3 text-[12px] font-bold text-[#9a3412] dark:bg-orange-400/10 dark:text-orange-300">
          {localError}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-7 text-center text-[13px] font-bold text-[var(--shadow-text-tertiary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
          {t('authorPublicStoreSection.loading')}
        </div>
      ) : filteredProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredProducts.map((product) => (
            <PublicProductCard key={product.id} product={product} onAddToCart={handleAddToCart} t={t} />
          ))}
        </div>
      ) : (
        <EmptyStore t={t} />
      )}
    </div>
  )
}

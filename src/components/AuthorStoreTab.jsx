import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorStoreTab', {
  en: {
    all: 'All',
    books: 'Books',
    pdf: 'PDF',
    untitledBook: 'Untitled book',
    newBooks: 'New Books',
    newCondition: 'New',
    preOrder: 'PRE-ORDER',
    inStock: 'IN STOCK',
    outOfStock: 'OUT OF STOCK',
    failedLoad: 'Failed to load store products',
    addToCart: 'Add to cart',
    seeMore: 'See more >',
    categorySubtitle: 'Books and PDFs in this category.',
    addedToCart: '{{title}} added to cart.',
    author: 'Author',
    storeBannerAlt: '{{author}} Store banner',
    authorStore: 'Author Store',
    bannerSubtitle: 'Books, PDFs & Special Releases',
    shopNow: 'Shop Now →',
    manage: 'Manage',
    noProducts: 'No products yet',
    emptyStore: 'This author store is empty right now.',
  },
  km: {
    all: 'ទាំងអស់',
    books: 'សៀវភៅ',
    pdf: 'PDF',
    untitledBook: 'សៀវភៅគ្មានចំណងជើង',
    newBooks: 'សៀវភៅថ្មី',
    newCondition: 'ថ្មី',
    preOrder: 'កុម្ម៉ង់ទុកមុន',
    inStock: 'មានក្នុងស្តុក',
    outOfStock: 'អស់ពីស្តុក',
    failedLoad: 'មិនអាចផ្ទុកទំនិញក្នុងហាងបានទេ',
    addToCart: 'បន្ថែមទៅកន្ត្រក',
    seeMore: 'មើលបន្ថែម >',
    categorySubtitle: 'សៀវភៅ និង PDF ក្នុងប្រភេទនេះ។',
    addedToCart: 'បានបន្ថែម {{title}} ទៅកន្ត្រក។',
    author: 'អ្នកនិពន្ធ',
    storeBannerAlt: 'បដាហាងរបស់ {{author}}',
    authorStore: 'ហាងអ្នកនិពន្ធ',
    bannerSubtitle: 'សៀវភៅ PDF និងការចេញផ្សាយពិសេស',
    shopNow: 'ទិញឥឡូវ →',
    manage: 'គ្រប់គ្រង',
    noProducts: 'មិនទាន់មានទំនិញទេ',
    emptyStore: 'ហាងអ្នកនិពន្ធនេះនៅទទេឥឡូវនេះ។',
  },
  zh: {
    all: '全部',
    books: '书籍',
    pdf: 'PDF',
    untitledBook: '无标题书籍',
    newBooks: '新书',
    newCondition: '全新',
    preOrder: '预售',
    inStock: '有库存',
    outOfStock: '缺货',
    failedLoad: '无法加载商店商品',
    addToCart: '加入购物车',
    seeMore: '查看更多 >',
    categorySubtitle: '此分类中的书籍和 PDF。',
    addedToCart: '{{title}} 已加入购物车。',
    author: '作者',
    storeBannerAlt: '{{author}} 的商店横幅',
    authorStore: '作者商店',
    bannerSubtitle: '书籍、PDF 与特别发行',
    shopNow: '立即购买 →',
    manage: '管理',
    noProducts: '暂无商品',
    emptyStore: '此作者商店目前为空。',
  },
  ja: {
    all: 'すべて',
    books: '書籍',
    pdf: 'PDF',
    untitledBook: '無題の本',
    newBooks: '新刊',
    newCondition: '新品',
    preOrder: '予約注文',
    inStock: '在庫あり',
    outOfStock: '在庫切れ',
    failedLoad: 'ストア商品を読み込めませんでした',
    addToCart: 'カートに追加',
    seeMore: 'もっと見る >',
    categorySubtitle: 'このカテゴリーの書籍と PDF。',
    addedToCart: '{{title}} をカートに追加しました。',
    author: '作者',
    storeBannerAlt: '{{author}} のストアバナー',
    authorStore: '作者ストア',
    bannerSubtitle: '書籍、PDF、特別リリース',
    shopNow: '今すぐ購入 →',
    manage: '管理',
    noProducts: '商品はまだありません',
    emptyStore: 'この作者のストアには現在商品がありません。',
  },
  ko: {
    all: '전체',
    books: '도서',
    pdf: 'PDF',
    untitledBook: '제목 없는 책',
    newBooks: '신간',
    newCondition: '새 상품',
    preOrder: '예약 판매',
    inStock: '재고 있음',
    outOfStock: '품절',
    failedLoad: '스토어 상품을 불러오지 못했습니다',
    addToCart: '장바구니에 추가',
    seeMore: '더 보기 >',
    categorySubtitle: '이 카테고리의 도서와 PDF입니다.',
    addedToCart: '{{title}}을(를) 장바구니에 추가했습니다.',
    author: '작가',
    storeBannerAlt: '{{author}} 스토어 배너',
    authorStore: '작가 스토어',
    bannerSubtitle: '도서, PDF 및 특별 출시',
    shopNow: '지금 구매 →',
    manage: '관리',
    noProducts: '아직 상품이 없습니다',
    emptyStore: '현재 이 작가의 스토어가 비어 있습니다.',
  },
})

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
    categories: ['New Books', 'New Release', 'Special Edition'],
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
  {
    key: 'best-seller',
    title: 'Best Seller',
    subtitle: 'Books readers are choosing most.',
    types: ['Book'],
    categories: ['Best Seller'],
  },
  {
    key: 'second-hand',
    title: 'Second Hand',
    subtitle: 'Checked condition, lower price, limited stock.',
    types: ['Book'],
    conditions: ['Second Hand'],
  },
  {
    key: 'author-picks',
    title: 'Author Picks',
    subtitle: 'Selected books recommended by this author.',
    types: ['Book', 'PDF'],
    categories: ['Author Picks'],
  },
  {
    key: 'sold-out',
    title: 'Sold out',
    subtitle: 'Books that readers already bought out.',
    types: ['Book'],
    soldOut: true,
  },
]

function getStoreTypeLabel(type, t) {
  if (type === 'All') return t('authorStoreTab.all')
  if (type === 'Books') return t('authorStoreTab.books')
  if (type === 'PDF') return t('authorStoreTab.pdf')
  return type
}

function getStockLabel(stockLabel, t) {
  if (stockLabel === 'PRE-ORDER') return t('authorStoreTab.preOrder')
  if (stockLabel === 'IN STOCK') return t('authorStoreTab.inStock')
  if (stockLabel === 'OUT OF STOCK') return t('authorStoreTab.outOfStock')
  return stockLabel
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
    title: product.title || '',
    titleFallback: !product.title,
    type,
    category: product.category || 'New Books',
    categoryFallback: !product.category,
    description: product.description || '',
    cover_url: product.cover_url || '',
    price: formatMoney(price),
    old_price: salePrice && originalPrice && salePrice !== originalPrice ? formatMoney(originalPrice) : '',
    stock_label: product.pre_order ? 'PRE-ORDER' : stockQuantity > 0 || type === 'PDF' ? 'IN STOCK' : 'OUT OF STOCK',
    stock_quantity: stockQuantity,
    condition: product.book_condition || 'New',
    conditionFallback: !product.book_condition,
    pre_order: Boolean(product.pre_order),
    created_at: product.created_at || '',
  }
}

async function fetchPublicAuthorStoreProducts(pageUsername) {
  const response = await fetch(`${API_BASE_URL}/api/author-store/page/${encodeURIComponent(pageUsername)}/products`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorStoreTab.failedLoad'))
  }

  return Array.isArray(data.products) ? data.products.map(normalizeProduct) : []
}

function sectionMatchesProduct(section, product) {
  if (section.types?.length && !section.types.includes(product.type)) return false
  if (section.preOrder && !product.pre_order) return false
  if (section.soldOut && product.stock_label !== 'OUT OF STOCK') return false
  if (section.conditions?.length && !section.conditions.includes(product.condition)) return false
  if (section.categories?.length && !section.categories.includes(product.category)) return false
  return true
}

function AuthorStoreProductCard({ item, onOpen, onAddToCart, t }) {
  const isOutOfStock = item.stock_label === 'OUT OF STOCK'
  const displayTitle = item.title || t('authorStoreTab.untitledBook')
  const displayCategory = item.categoryFallback
    ? t('authorStoreTab.newBooks')
    : item.category || item.type

  return (
    <article className="overflow-hidden rounded-[18px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[var(--shadow-bg-soft)] text-left"
      >
        {item.cover_url ? (
          <img src={item.cover_url} alt={displayTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-bookmark text-[26px]" />
          </div>
        )}

        {item.stock_label ? (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
              isOutOfStock
                ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                : 'bg-[#ecfdf3] text-[#027a48] dark:bg-emerald-400/10 dark:text-emerald-300'
            }`}
          >
            {getStockLabel(item.stock_label, t)}
          </span>
        ) : null}
      </button>

      <div className="p-3">
        <button type="button" onClick={() => onOpen?.(item)} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-black leading-[18px] text-[var(--shadow-text-primary)]">
            {displayTitle}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
            {displayCategory}
          </p>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-[13px] font-black text-[#e5484d]">{item.price}</div>
            {item.old_price ? (
              <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)] line-through">{item.old_price}</div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(item)}
            disabled={isOutOfStock}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-page)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-tertiary)]"
            aria-label={t('authorStoreTab.addToCart')}
          >
            <i className="fa-solid fa-cart-shopping text-[13px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

function AuthorStoreShelf({ section, items, onMore, onOpenItem, onAddToCart, t }) {
  const previewItems = items.slice(0, 6)

  return (
    <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[17px] font-black leading-5 text-[var(--shadow-text-primary)]">{section.title}</h2>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[var(--shadow-text-tertiary)]">{section.subtitle}</p>
        </div>

        {items.length ? (
          <button
            type="button"
            onClick={() => onMore?.(section)}
            className="shrink-0 pt-0.5 text-[12px] font-black text-[var(--shadow-text-tertiary)] active:opacity-70"
          >
            {t('authorStoreTab.seeMore')}
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {previewItems.map((item) => (
          <AuthorStoreProductCard
            key={item.id}
            item={item}
            onOpen={onOpenItem}
            onAddToCart={onAddToCart}
            t={t}
          />
        ))}
      </div>
    </section>
  )
}

export default function AuthorStoreTab({ author, cartCount = 0, onCartCountChange, onMessage }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
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
          setLoadError(error.message || t('authorStoreTab.failedLoad'))
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

  const visibleSections = useMemo(() => {
    const typeFilteredProducts = products.filter((product) => {
      return activeType === 'All' || product.type === activeType.slice(0, -1) || product.type === activeType
    })

    const customCategories = Array.from(
      new Set(typeFilteredProducts.map((product) => product.category).filter(Boolean))
    )

    return customCategories
      .map((category) => {
        const items = typeFilteredProducts.filter((product) => product.category === category)

        return {
          key: category.toLowerCase().replace(/\s+/g, '-'),
          title: category,
          subtitle: t('authorStoreTab.categorySubtitle'),
          items,
        }
      })
      .filter((section) => section.items.length > 0)
  }, [activeType, products, t])

  const isOwner = Boolean(author?.is_owner)

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
            author_page_id: author?.id || item.author_page_id || '',
            author_page_name: author?.page_name || '',
            author_page_username: author?.page_username || '',
          },
        ]

    localStorage.setItem('shadow_author_cart_items', JSON.stringify(nextCartItems))
    window.dispatchEvent(new Event('shadow-author-cart-updated'))
    onCartCountChange?.(nextCartItems.reduce((total, cartItem) => total + Number(cartItem.quantity || 1), 0))
    onMessage?.(t('authorStoreTab.addedToCart', { title: item.title || t('authorStoreTab.untitledBook') }))
  }

  return (
  <div className="space-y-4">
    {author?.profile_details?.store_banner_url ? (
  <div className="relative aspect-video overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)]">
    <img
      src={author.profile_details.store_banner_url}
      alt={t('authorStoreTab.storeBannerAlt', { author: author.page_name || t('authorStoreTab.author') })}
      className="h-full w-full object-cover"
    />

    <div className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-white/80 via-white/30 to-transparent" />

    <div className="absolute left-4 top-1/2 w-[46%] sm:left-6">
      <h2 className="line-clamp-1 text-[18px] font-black leading-tight text-[#6d28d9] sm:text-[23px]">
        {author.profile_details.store_banner_title || t('authorStoreTab.authorStore')}
      </h2>

      <p className="mt-1 line-clamp-2 whitespace-pre-line text-[10px] font-semibold leading-[15px] text-[#111827] sm:text-[12px]">
        {author.profile_details.store_banner_subtitle || t('authorStoreTab.bannerSubtitle')}
      </p>

      <button
        type="button"
        onClick={() =>
          document
            .getElementById('author-store-products')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        className="mt-2.5 h-8 rounded-[9px] bg-black px-4 text-[10px] font-bold text-white shadow-sm active:scale-95 sm:h-9 sm:text-[11px]"
      >
        {author.profile_details.store_banner_button_text || t('authorStoreTab.shopNow')}
      </button>
    </div>
  </div>
) : null}

    <div id="author-store-products" className="scroll-mt-16 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {STORE_TYPE_FILTERS.map((type) => {
            const active = activeType === type

            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`h-8 shrink-0 rounded-full px-4 text-[12px] font-black transition active:scale-95 ${
                  active
                    ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-page)]'
                    : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
                }`}
              >
                {getStoreTypeLabel(type, t)}
              </button>
            )
          })}
        </div>

        {isOwner ? (
          <button
            type="button"
            onClick={() => navigate('/author/page/store')}
            className="h-8 shrink-0 rounded-full bg-[var(--shadow-bg-surface)] px-4 text-[12px] font-black text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)] active:scale-95"
          >
            {t('authorStoreTab.manage')}
          </button>
        ) : null}
      </div>

      {loadError ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="block w-full rounded-[18px] bg-[#fff7ed] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#9a3412] ring-1 ring-[#fed7aa] dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-300/20"
        >
          {loadError}
        </button>
      ) : null}

      {!loading && !loadError && !visibleSections.length ? (
        <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-6 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-store text-[18px]" />
          </div>
          <h3 className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreTab.noProducts')}</h3>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
            {t('authorStoreTab.emptyStore')}
          </p>
        </section>
      ) : null}

      {visibleSections.map((section) => (
        <AuthorStoreShelf
          key={section.key}
          section={section}
          items={section.items}
          onMore={() => navigate(`/author/page/${author.page_username}/store/category/${section.key}`)}
          onOpenItem={(item) => navigate(`/author/page/${author.page_username}/store/product/${item.id}`)}
          onAddToCart={addToCart}
          t={t}
        />
      ))}
    </div>
  )
}

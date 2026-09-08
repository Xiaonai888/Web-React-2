import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoreCategory', {
  "en": {
    "newBooks": "New Books",
    "newBooksSub": "Fresh copies and latest arrivals.",
    "pdfBooks": "PDF Books",
    "pdfBooksSub": "Digital books from this author.",
    "preOrder": "Pre-order",
    "preOrderSub": "Reserve upcoming books before release.",
    "bestSeller": "Best Seller",
    "bestSellerSub": "Books readers are choosing most.",
    "secondHand": "Second Hand",
    "secondHandSub": "Checked condition, lower price, limited stock.",
    "authorPicks": "Author Picks",
    "authorPicksSub": "Selected books recommended by this author.",
    "soldOut": "Sold out",
    "soldOutSub": "Books that readers already bought out.",
    "untitledBook": "Untitled book",
    "book": "Book",
    "pdf": "PDF",
    "new": "New",
    "preOrderStatus": "PRE-ORDER",
    "inStock": "IN STOCK",
    "outOfStock": "OUT OF STOCK",
    "failedLoad": "Failed to load store products",
    "addToCart": "Add to cart",
    "loading": "Loading products...",
    "emptyTitle": "No products here yet",
    "emptyHelp": "This category does not have public products right now.",
    "goBack": "Go back",
    "specialEdition": "Special Edition",
    "newRelease": "New Release"
  },
  "km": {
    "newBooks": "សៀវភៅថ្មី",
    "newBooksSub": "សៀវភៅថ្មីៗ និងទំនិញចូលថ្មីបំផុត។",
    "pdfBooks": "សៀវភៅ PDF",
    "pdfBooksSub": "សៀវភៅឌីជីថលពីអ្នកនិពន្ធនេះ។",
    "preOrder": "បញ្ជាទិញមុន",
    "preOrderSub": "កក់សៀវភៅដែលនឹងចេញ មុនថ្ងៃចេញលក់។",
    "bestSeller": "លក់ដាច់បំផុត",
    "bestSellerSub": "សៀវភៅដែលអ្នកអានជ្រើសរើសច្រើនបំផុត។",
    "secondHand": "សៀវភៅមួយទឹក",
    "secondHandSub": "បានពិនិត្យសភាព តម្លៃទាបជាង និងស្តុកមានកំណត់។",
    "authorPicks": "ជម្រើសអ្នកនិពន្ធ",
    "authorPicksSub": "សៀវភៅដែលអ្នកនិពន្ធនេះណែនាំ។",
    "soldOut": "អស់ពីស្តុក",
    "soldOutSub": "សៀវភៅដែលអ្នកអានបានទិញអស់ពីស្តុក។",
    "untitledBook": "សៀវភៅគ្មានចំណងជើង",
    "book": "សៀវភៅ",
    "pdf": "PDF",
    "new": "ថ្មី",
    "preOrderStatus": "បញ្ជាទិញមុន",
    "inStock": "មានក្នុងស្តុក",
    "outOfStock": "អស់ពីស្តុក",
    "failedLoad": "មិនអាចផ្ទុកទំនិញក្នុងហាងបានទេ",
    "addToCart": "បន្ថែមទៅរទេះ",
    "loading": "កំពុងផ្ទុកទំនិញ...",
    "emptyTitle": "មិនទាន់មានទំនិញនៅទីនេះ",
    "emptyHelp": "ប្រភេទនេះមិនមានទំនិញសាធារណៈនៅពេលនេះទេ។",
    "goBack": "ត្រឡប់ក្រោយ",
    "specialEdition": "បោះពុម្ពពិសេស",
    "newRelease": "ចេញថ្មី"
  },
  "zh": {
    "newBooks": "新书",
    "newBooksSub": "全新书籍与最新上架。",
    "pdfBooks": "PDF 书籍",
    "pdfBooksSub": "该作者的数字书籍。",
    "preOrder": "预购",
    "preOrderSub": "在发行前预订即将推出的书籍。",
    "bestSeller": "畅销书",
    "bestSellerSub": "读者选择最多的书籍。",
    "secondHand": "二手书",
    "secondHandSub": "已检查品相，价格更低，库存有限。",
    "authorPicks": "作者精选",
    "authorPicksSub": "该作者推荐的精选书籍。",
    "soldOut": "售罄",
    "soldOutSub": "已被读者购买完的书籍。",
    "untitledBook": "未命名书籍",
    "book": "书籍",
    "pdf": "PDF",
    "new": "全新",
    "preOrderStatus": "预购",
    "inStock": "有库存",
    "outOfStock": "缺货",
    "failedLoad": "无法加载商店商品",
    "addToCart": "加入购物车",
    "loading": "正在加载商品...",
    "emptyTitle": "这里还没有商品",
    "emptyHelp": "此分类目前没有公开商品。",
    "goBack": "返回",
    "specialEdition": "特别版",
    "newRelease": "最新发行"
  },
  "ja": {
    "newBooks": "新刊",
    "newBooksSub": "新品と最新入荷の本です。",
    "pdfBooks": "PDF ブック",
    "pdfBooksSub": "この著者のデジタル書籍です。",
    "preOrder": "予約注文",
    "preOrderSub": "発売前の本を予約できます。",
    "bestSeller": "ベストセラー",
    "bestSellerSub": "読者に最も選ばれている本です。",
    "secondHand": "中古",
    "secondHandSub": "状態確認済み、低価格、在庫限定です。",
    "authorPicks": "著者のおすすめ",
    "authorPicksSub": "この著者が選んだおすすめの本です。",
    "soldOut": "売り切れ",
    "soldOutSub": "読者が購入し在庫切れになった本です。",
    "untitledBook": "無題の本",
    "book": "本",
    "pdf": "PDF",
    "new": "新品",
    "preOrderStatus": "予約注文",
    "inStock": "在庫あり",
    "outOfStock": "在庫切れ",
    "failedLoad": "ストア商品を読み込めませんでした",
    "addToCart": "カートに追加",
    "loading": "商品を読み込み中...",
    "emptyTitle": "まだ商品がありません",
    "emptyHelp": "このカテゴリには現在公開商品がありません。",
    "goBack": "戻る",
    "specialEdition": "特別版",
    "newRelease": "新刊"
  },
  "ko": {
    "newBooks": "새 책",
    "newBooksSub": "새 상품과 최신 입고 도서입니다.",
    "pdfBooks": "PDF 도서",
    "pdfBooksSub": "이 작가의 디지털 도서입니다.",
    "preOrder": "예약 주문",
    "preOrderSub": "출시 전 도서를 미리 예약하세요.",
    "bestSeller": "베스트셀러",
    "bestSellerSub": "독자들이 가장 많이 선택한 책입니다.",
    "secondHand": "중고",
    "secondHandSub": "상태 확인 완료, 더 낮은 가격, 한정 재고입니다.",
    "authorPicks": "작가 추천",
    "authorPicksSub": "이 작가가 추천하는 선별 도서입니다.",
    "soldOut": "품절",
    "soldOutSub": "독자들이 구매해 재고가 모두 소진된 책입니다.",
    "untitledBook": "제목 없는 책",
    "book": "책",
    "pdf": "PDF",
    "new": "새 책",
    "preOrderStatus": "예약 주문",
    "inStock": "재고 있음",
    "outOfStock": "품절",
    "failedLoad": "스토어 상품을 불러오지 못했습니다",
    "addToCart": "장바구니에 추가",
    "loading": "상품 불러오는 중...",
    "emptyTitle": "아직 상품이 없습니다",
    "emptyHelp": "이 카테고리에는 현재 공개 상품이 없습니다.",
    "goBack": "뒤로",
    "specialEdition": "특별판",
    "newRelease": "신간"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CATEGORY_CONFIG = {
  'new-books': {
    title: 'New Books',
    subtitle: 'Fresh copies and latest arrivals.',
    titleKey: 'newBooks',
    subtitleKey: 'newBooksSub',
    types: ['Book'],
    categories: ['New Books', 'New Release', 'Special Edition'],
  },
  'pdf-books': {
    title: 'PDF Books',
    subtitle: 'Digital books from this author.',
    titleKey: 'pdfBooks',
    subtitleKey: 'pdfBooksSub',
    types: ['PDF'],
  },
  'pre-order': {
    title: 'Pre-order',
    subtitle: 'Reserve upcoming books before release.',
    titleKey: 'preOrder',
    subtitleKey: 'preOrderSub',
    types: ['Book'],
    preOrder: true,
  },
  'best-seller': {
    title: 'Best Seller',
    subtitle: 'Books readers are choosing most.',
    titleKey: 'bestSeller',
    subtitleKey: 'bestSellerSub',
    types: ['Book'],
    categories: ['Best Seller'],
  },
  'second-hand': {
    title: 'Second Hand',
    subtitle: 'Checked condition, lower price, limited stock.',
    titleKey: 'secondHand',
    subtitleKey: 'secondHandSub',
    types: ['Book'],
    conditions: ['Second Hand'],
  },
  'author-picks': {
    title: 'Author Picks',
    subtitle: 'Selected books recommended by this author.',
    titleKey: 'authorPicks',
    subtitleKey: 'authorPicksSub',
    types: ['Book', 'PDF'],
    categories: ['Author Picks'],
  },
  'sold-out': {
    title: 'Sold out',
    subtitle: 'Books that readers already bought out.',
    titleKey: 'soldOut',
    subtitleKey: 'soldOutSub',
    types: ['Book'],
    soldOut: true,
  },
}

function formatMoney(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return Number(0).toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return number.toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function displayStoreValue(value) {
  const keyMap = {
    'Untitled book': 'untitledBook',
    Book: 'book',
    PDF: 'pdf',
    'New Books': 'newBooks',
    'New Release': 'newRelease',
    'Special Edition': 'specialEdition',
    'Best Seller': 'bestSeller',
    'Second Hand': 'secondHand',
    'Author Picks': 'authorPicks',
    'Sold out': 'soldOut',
    New: 'new',
    'PRE-ORDER': 'preOrderStatus',
    'IN STOCK': 'inStock',
    'OUT OF STOCK': 'outOfStock',
  }

  const key = keyMap[String(value || '')]
  return key ? getDisplayText(`authorStoreCategory.${key}`) : value
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
    price_value: price,
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
    throw new Error(data.message || getDisplayText('authorStoreCategory.failedLoad'))
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
    <article className="overflow-hidden rounded-[18px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[var(--shadow-bg-soft)] text-left"
      >
        {item.cover_url ? (
          <img src={item.cover_url} alt={displayStoreValue(item.title)} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-bookmark text-[26px]" />
          </div>
        )}

        {item.stock_label ? (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
              isOutOfStock ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]' : 'bg-[#ecfdf3] text-[#027a48]'
            }`}
          >
            {displayStoreValue(item.stock_label)}
          </span>
        ) : null}
      </button>

      <div className="p-3">
        <button type="button" onClick={() => onOpen?.(item)} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-black leading-[18px] text-[var(--shadow-text-primary)]">
            {displayStoreValue(item.title)}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
            {displayStoreValue(item.category || item.type)}
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-text-disabled)]"
            aria-label={getDisplayText('authorStoreCategory.addToCart')}
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
  const { t } = useDisplayTranslation()
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
          setLoadError(error.message || t('authorStoreCategory.failedLoad'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [pageUsername, t])

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
            price_value: Number(item.price_value || 0),
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
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-24">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            aria-label={t('authorStoreCategory.goBack')}
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-black leading-5 text-[var(--shadow-text-primary)]">{t(`authorStoreCategory.${category.titleKey}`)}</h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
              {t(`authorStoreCategory.${category.subtitleKey}`)}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 pt-4">
        {loading ? (
          <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-8 text-center text-[13px] font-bold text-[var(--shadow-text-tertiary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
            {t('authorStoreCategory.loading')}
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
          <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-8 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
              <i className="fa-regular fa-folder-open text-[18px]" />
            </div>
            <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorStoreCategory.emptyTitle')}</h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
              {t('authorStoreCategory.emptyHelp')}
            </p>
          </section>
        ) : null}
      </main>
    </div>
  )
}

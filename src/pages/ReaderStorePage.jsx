import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ShadowMallSection from '../components/Shop/ShadowMallSection'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const AUTHOR_CART_KEY = 'shadow_author_cart_items'
const AUTHOR_WISHLIST_KEY = 'shadow_reader_store_wishlist'
const FILTERS = ['all', 'romance', 'bl', 'fantasy', 'pdf']

registerTranslationNamespace('readerStore', {
  en: {
    store: 'Store',
    goBack: 'Go back',
    searchBooks: 'Search books',
    searchPlaceholder: 'Search books or authors',
    openWishlist: 'Saved books',
    openCart: 'Open cart',
    shadowMall: 'Shadow Mall',
    seeMore: 'See more',
    seeLess: 'See less',
    featuredAuthors: 'Featured Author Stores',
    featuredAuthorsSubtitle: 'Discover writers with books for sale.',
    books: 'Books',
    fromAuthors: 'From Author Stores',
    fromAuthorsSubtitle: 'Books and PDFs from different authors.',
    editorsPicks: "Editors' Picks",
    editorsPicksSubtitle: 'Recommended books from author stores.',
    all: 'All',
    romance: 'Romance',
    bl: 'BL',
    fantasy: 'Fantasy',
    pdf: 'PDF',
    book: 'Book',
    newLabel: 'NEW',
    trendingLabel: 'TRENDING',
    addToCart: 'Add to cart',
    saveBook: 'Save book',
    removeSaved: 'Remove saved book',
    loading: 'Loading author stores...',
    loadFailed: 'Could not load author stores.',
    retry: 'Retry',
    noProducts: 'No books found.',
    savedOnly: 'Showing saved books',
  },
  km: {
    store: 'ហាង',
    goBack: 'ត្រឡប់ក្រោយ',
    searchBooks: 'ស្វែងរកសៀវភៅ',
    searchPlaceholder: 'ស្វែងរកសៀវភៅ ឬអ្នកនិពន្ធ',
    openWishlist: 'សៀវភៅដែលបានរក្សាទុក',
    openCart: 'បើកកន្ត្រក',
    shadowMall: 'Shadow Mall',
    seeMore: 'មើលបន្ថែម',
    seeLess: 'បង្ហាញតិច',
    featuredAuthors: 'ហាងអ្នកនិពន្ធពិសេស',
    featuredAuthorsSubtitle: 'ស្វែងរកអ្នកនិពន្ធដែលមានស្នាដៃសម្រាប់លក់។',
    books: 'សៀវភៅ',
    fromAuthors: 'ពីហាងអ្នកនិពន្ធ',
    fromAuthorsSubtitle: 'សៀវភៅ និង PDF ពីអ្នកនិពន្ធផ្សេងៗ។',
    editorsPicks: 'ជម្រើសណែនាំ',
    editorsPicksSubtitle: 'សៀវភៅណែនាំពីហាងអ្នកនិពន្ធ។',
    all: 'ទាំងអស់',
    romance: 'មនោសញ្ចេតនា',
    bl: 'BL',
    fantasy: 'Fantasy',
    pdf: 'PDF',
    book: 'សៀវភៅ',
    newLabel: 'ថ្មី',
    trendingLabel: 'កំពុងពេញនិយម',
    addToCart: 'ដាក់ក្នុងកន្ត្រក',
    saveBook: 'រក្សាទុកសៀវភៅ',
    removeSaved: 'ដកចេញពីបញ្ជីរក្សាទុក',
    loading: 'កំពុងទាញហាងអ្នកនិពន្ធ...',
    loadFailed: 'មិនអាចទាញហាងអ្នកនិពន្ធបាន។',
    retry: 'សាកម្តងទៀត',
    noProducts: 'មិនមានសៀវភៅ។',
    savedOnly: 'កំពុងបង្ហាញសៀវភៅដែលបានរក្សាទុក',
  },
  zh: {
    store: '商店',
    goBack: '返回',
    searchBooks: '搜索书籍',
    searchPlaceholder: '搜索书籍或作者',
    openWishlist: '已收藏书籍',
    openCart: '打开购物车',
    shadowMall: 'Shadow Mall',
    seeMore: '查看更多',
    seeLess: '收起',
    featuredAuthors: '精选作者商店',
    featuredAuthorsSubtitle: '发现正在出售作品的作者。',
    books: '本书',
    fromAuthors: '来自作者商店',
    fromAuthorsSubtitle: '来自不同作者的书籍和 PDF。',
    editorsPicks: '编辑推荐',
    editorsPicksSubtitle: '来自作者商店的推荐书籍。',
    all: '全部',
    romance: '浪漫',
    bl: 'BL',
    fantasy: '奇幻',
    pdf: 'PDF',
    book: '书籍',
    newLabel: '新品',
    trendingLabel: '热门',
    addToCart: '加入购物车',
    saveBook: '收藏书籍',
    removeSaved: '取消收藏',
    loading: '正在加载作者商店...',
    loadFailed: '无法加载作者商店。',
    retry: '重试',
    noProducts: '没有找到书籍。',
    savedOnly: '正在显示已收藏书籍',
  },
  ja: {
    store: 'ストア',
    goBack: '戻る',
    searchBooks: '本を検索',
    searchPlaceholder: '本または作家を検索',
    openWishlist: '保存した本',
    openCart: 'カートを開く',
    shadowMall: 'Shadow Mall',
    seeMore: 'もっと見る',
    seeLess: '閉じる',
    featuredAuthors: '注目の作家ストア',
    featuredAuthorsSubtitle: '販売作品のある作家を見つけよう。',
    books: '冊',
    fromAuthors: '作家ストアから',
    fromAuthorsSubtitle: 'さまざまな作家の本と PDF。',
    editorsPicks: '編集部おすすめ',
    editorsPicksSubtitle: '作家ストアからのおすすめ。',
    all: 'すべて',
    romance: 'ロマンス',
    bl: 'BL',
    fantasy: 'ファンタジー',
    pdf: 'PDF',
    book: '本',
    newLabel: 'NEW',
    trendingLabel: 'トレンド',
    addToCart: 'カートに追加',
    saveBook: '本を保存',
    removeSaved: '保存を解除',
    loading: '作家ストアを読み込み中...',
    loadFailed: '作家ストアを読み込めませんでした。',
    retry: '再試行',
    noProducts: '本が見つかりません。',
    savedOnly: '保存した本を表示中',
  },
  ko: {
    store: '스토어',
    goBack: '뒤로 가기',
    searchBooks: '도서 검색',
    searchPlaceholder: '도서 또는 작가 검색',
    openWishlist: '저장한 도서',
    openCart: '장바구니 열기',
    shadowMall: 'Shadow Mall',
    seeMore: '더 보기',
    seeLess: '접기',
    featuredAuthors: '추천 작가 스토어',
    featuredAuthorsSubtitle: '판매 작품이 있는 작가를 만나보세요.',
    books: '권',
    fromAuthors: '작가 스토어',
    fromAuthorsSubtitle: '여러 작가의 도서와 PDF입니다.',
    editorsPicks: '에디터 추천',
    editorsPicksSubtitle: '작가 스토어 추천 도서입니다.',
    all: '전체',
    romance: '로맨스',
    bl: 'BL',
    fantasy: '판타지',
    pdf: 'PDF',
    book: '도서',
    newLabel: 'NEW',
    trendingLabel: '인기',
    addToCart: '장바구니에 추가',
    saveBook: '도서 저장',
    removeSaved: '저장 취소',
    loading: '작가 스토어 불러오는 중...',
    loadFailed: '작가 스토어를 불러오지 못했습니다.',
    retry: '다시 시도',
    noProducts: '도서를 찾을 수 없습니다.',
    savedOnly: '저장한 도서만 표시 중',
  },
})

function formatMoney(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return `$${number.toFixed(2)}`
}

function normalizeProduct(product) {
  const salePrice = Number(product.sale_price || 0)
  const originalPrice = Number(product.original_price || 0)
  const priceValue = salePrice > 0 ? salePrice : originalPrice
  const type = product.product_type === 'pdf' ? 'pdf' : 'book'

  return {
    id: product.id,
    authorPageId: product.author_page_id || '',
    pageName: product.page_name || '',
    pageUsername: product.page_username || '',
    authorAvatar: product.author_avatar_url || '',
    title: product.title || 'Untitled book',
    author: product.author_name || product.page_name || 'Unknown author',
    publisher: product.publisher || '',
    category: product.category || '',
    genre: product.genre || '',
    cover: product.cover_url || '',
    price: formatMoney(priceValue),
    priceValue,
    oldPrice:
      salePrice > 0 && originalPrice > 0 && salePrice !== originalPrice
        ? formatMoney(originalPrice)
        : '',
    type,
    badge: product.best_seller ? 'trending' : 'new',
    stockStatus: product.stock_status || (type === 'pdf' ? 'digital' : 'in_stock'),
    preOrder: Boolean(product.pre_order),
  }
}

function getAuthorCartItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUTHOR_CART_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getAuthorCartCount() {
  return getAuthorCartItems().reduce(
    (total, item) => total + Math.max(1, Number(item.quantity || 1)),
    0
  )
}

function addAuthorCartItem(book) {
  const items = getAuthorCartItems()
  const existingIndex = items.findIndex((item) => String(item.id) === String(book.id))

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: Math.min(99, Number(items[existingIndex].quantity || 1) + 1),
    }
  } else {
    items.push({
      id: book.id,
      title: book.title,
      type: book.type === 'pdf' ? 'PDF' : 'Book',
      cover_url: book.cover,
      price_value: book.priceValue,
      quantity: 1,
      author_page_id: book.authorPageId,
      author_page_name: book.pageName,
      author_page_username: book.pageUsername,
    })
  }

  localStorage.setItem(AUTHOR_CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

function getSavedIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUTHOR_WISHLIST_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function saveSavedIds(ids) {
  localStorage.setItem(AUTHOR_WISHLIST_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event('shadow-reader-store-wishlist-change'))
}

async function fetchReaderStoreHome() {
  const response = await fetch(`${API_BASE_URL}/api/author-store/store/home?limit=24`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load Reader Store')
  }

  return {
    products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : [],
    featuredAuthors: Array.isArray(data.featured_authors) ? data.featured_authors : [],
    editorsPicks: Array.isArray(data.editors_picks)
      ? data.editors_picks.map(normalizeProduct)
      : [],
  }
}

function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[12px] font-extrabold text-[#7c3aed] active:opacity-70"
        >
          {action} <span aria-hidden="true">›</span>
        </button>
      ) : null}
    </div>
  )
}

function StoreBookCard({ book, t, saved, onSave, onOpen, onAddToCart }) {
  const badgeLabel =
    book.badge === 'trending'
      ? t('readerStore.trendingLabel')
      : t('readerStore.newLabel')
  const typeLabel =
    book.type === 'pdf' ? t('readerStore.pdf') : t('readerStore.book')
  const soldOut = book.stockStatus === 'sold_out'

  return (
    <article className="overflow-hidden rounded-[20px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 block h-full w-full text-left"
        >
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className={`h-full w-full object-cover ${soldOut ? 'opacity-60' : ''}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-regular fa-image text-[22px]" />
            </span>
          )}

          <span
            className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-extrabold shadow-sm ${
              soldOut
                ? 'bg-[#f1f5f9] text-[#64748b]'
                : book.badge === 'trending'
                  ? 'bg-[#dff7f3] text-[#0f766e]'
                  : 'bg-[#ede9fe] text-[#6d28d9]'
            }`}
          >
            {soldOut ? 'SOLD OUT' : badgeLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={onSave}
          aria-label={
            saved ? t('readerStore.removeSaved') : t('readerStore.saveBook')
          }
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm active:scale-95 ${
            saved ? 'text-[#e5484d]' : 'text-[#111827]'
          }`}
        >
          <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`} />
        </button>
      </div>

      <div className="p-3">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ede9fe] text-[9px] font-black text-[#6d28d9]">
              {book.authorAvatar ? (
                <img
                  src={book.authorAvatar}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                book.author.charAt(0).toUpperCase()
              )}
            </span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] font-bold text-[var(--shadow-text-secondary)]">
              {book.author}
            </span>
            <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[9px] font-extrabold text-[var(--shadow-text-secondary)]">
              {typeLabel}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[var(--shadow-text-primary)]">
            {book.title}
          </h3>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <button type="button" onClick={onOpen} className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#7c3aed]">
              {book.price}
            </div>
            {book.oldPrice ? (
              <div className="mt-0.5 text-[10px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                {book.oldPrice}
              </div>
            ) : null}
          </button>

          <button
            type="button"
            disabled={soldOut}
            onClick={onAddToCart}
            aria-label={t('readerStore.addToCart')}
            className={`flex h-8 w-8 items-center justify-center rounded-full active:scale-95 ${
              soldOut
                ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'
                : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
            }`}
          >
            <i className="fa-solid fa-bag-shopping text-[11px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ReaderStorePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [products, setProducts] = useState([])
  const [featuredAuthors, setFeaturedAuthors] = useState([])
  const [editorsPicks, setEditorsPicks] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [savedOnly, setSavedOnly] = useState(false)
  const [savedIds, setSavedIds] = useState(getSavedIds)
  const [cartCount, setCartCount] = useState(getAuthorCartCount)
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadStore() {
      try {
        setLoading(true)
        setLoadError('')
        const data = await fetchReaderStoreHome()

        if (!ignore) {
          setProducts(data.products)
          setFeaturedAuthors(data.featuredAuthors)
          setEditorsPicks(data.editorsPicks)
        }
      } catch (error) {
        if (!ignore) {
          setProducts([])
          setFeaturedAuthors([])
          setEditorsPicks([])
          setLoadError(error.message || t('readerStore.loadFailed'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStore()

    return () => {
      ignore = true
    }
  }, [retryKey])

  useEffect(() => {
    const refreshCart = () => setCartCount(getAuthorCartCount())
    const refreshSaved = () => setSavedIds(getSavedIds())

    window.addEventListener('shadow-author-cart-updated', refreshCart)
    window.addEventListener('shadow-reader-store-wishlist-change', refreshSaved)
    window.addEventListener('storage', refreshCart)
    window.addEventListener('storage', refreshSaved)

    return () => {
      window.removeEventListener('shadow-author-cart-updated', refreshCart)
      window.removeEventListener('shadow-reader-store-wishlist-change', refreshSaved)
      window.removeEventListener('storage', refreshCart)
      window.removeEventListener('storage', refreshSaved)
    }
  }, [])

  const savedSet = useMemo(() => new Set(savedIds.map(String)), [savedIds])
  const keyword = searchQuery.trim().toLowerCase()

  const matchesFilter = (book) => {
    if (savedOnly && !savedSet.has(String(book.id))) return false
    if (activeFilter === 'pdf' && book.type !== 'pdf') return false

    const categoryText = `${book.category} ${book.genre}`.toLowerCase()

    if (activeFilter === 'romance' && !categoryText.includes('romance')) return false
    if (
      activeFilter === 'bl' &&
      !categoryText.includes('bl') &&
      !categoryText.includes('boys love')
    ) {
      return false
    }
    if (activeFilter === 'fantasy' && !categoryText.includes('fantasy')) return false

    if (!keyword) return true

    const searchText = [
      book.title,
      book.author,
      book.pageName,
      book.category,
      book.genre,
      book.publisher,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchText.includes(keyword)
  }

  const filteredProducts = useMemo(
    () => products.filter(matchesFilter),
    [products, activeFilter, savedOnly, savedSet, keyword]
  )

  const filteredEditorsPicks = useMemo(
    () => editorsPicks.filter(matchesFilter).slice(0, 4),
    [editorsPicks, activeFilter, savedOnly, savedSet, keyword]
  )

  const visibleAuthors = useMemo(() => {
    if (!keyword) return featuredAuthors

    return featuredAuthors.filter((author) =>
      `${author.page_name || ''} ${author.page_username || ''}`
        .toLowerCase()
        .includes(keyword)
    )
  }, [featuredAuthors, keyword])

  const visibleProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, 4)

  const toggleSaved = (bookId) => {
    const id = String(bookId)
    const nextIds = savedSet.has(id)
      ? savedIds.filter((item) => String(item) !== id)
      : [id, ...savedIds]

    setSavedIds(nextIds)
    saveSavedIds(nextIds)
  }

  const openProduct = (book) => {
    if (!book.pageUsername) return
    navigate(
      `/author/page/${encodeURIComponent(book.pageUsername)}/store/product/${book.id}`
    )
  }

  const addToCart = (book) => {
    if (book.stockStatus === 'sold_out') return
    addAuthorCartItem(book)
    setCartCount(getAuthorCartCount())
  }

  const filterLabel = (filter) => t(`readerStore.${filter}`)

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[560px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('readerStore.goBack')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[19px] font-extrabold tracking-tight">
            {t('readerStore.store')}
          </h1>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              aria-label={t('readerStore.searchBooks')}
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            >
              <i className="fa-solid fa-magnifying-glass text-[17px]" />
            </button>

            <button
              type="button"
              onClick={() => setSavedOnly((value) => !value)}
              aria-label={t('readerStore.openWishlist')}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)] ${
                savedOnly ? 'text-[#e5484d]' : ''
              }`}
            >
              <i
                className={`${savedOnly ? 'fa-solid' : 'fa-regular'} fa-heart text-[20px]`}
              />
              {savedIds.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[8px] font-extrabold text-white">
                  {savedIds.length > 99 ? '99+' : savedIds.length}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => navigate('/author/cart')}
              aria-label={t('readerStore.openCart')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            >
              <i className="fa-solid fa-cart-shopping text-[19px]" />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[8px] font-extrabold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="mx-auto w-full max-w-[560px] px-4 pb-3">
            <div className="flex items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2.5 ring-1 ring-[var(--shadow-border)]">
              <i className="fa-solid fa-magnifying-glass text-[12px] text-[var(--shadow-text-tertiary)]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('readerStore.searchPlaceholder')}
                className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)]"
                >
                  <i className="fa-solid fa-xmark text-[12px]" />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 pt-4">
        <section className="space-y-3">
          <SectionHeader
            title={t('readerStore.shadowMall')}
            action={t('readerStore.seeMore')}
            onAction={() => navigate('/shop')}
          />
          <ShadowMallSection sliderOnly />
        </section>

        <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold transition active:scale-95 ${
                  active
                    ? 'bg-[#7c3aed] text-white shadow-sm'
                    : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
                }`}
              >
                {filterLabel(filter)}
              </button>
            )
          })}
        </div>

        {savedOnly ? (
          <div className="mt-2 rounded-full bg-[#fff1f1] px-3 py-2 text-center text-[10.5px] font-extrabold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {t('readerStore.savedOnly')}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-5 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-8 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--shadow-border)] border-t-[#7c3aed]" />
            <div className="mt-3 text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              {t('readerStore.loading')}
            </div>
          </div>
        ) : null}

        {!loading && loadError ? (
          <section className="mt-5 rounded-[22px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="text-[13px] font-extrabold text-[#e5484d]">
              {t('readerStore.loadFailed')}
            </div>
            <button
              type="button"
              onClick={() => setRetryKey((value) => value + 1)}
              className="mt-3 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              {t('readerStore.retry')}
            </button>
          </section>
        ) : null}

        {!loading && !loadError ? (
          <>
            {visibleAuthors.length ? (
              <section className="mt-5 space-y-3">
                <SectionHeader
                  title={t('readerStore.featuredAuthors')}
                  subtitle={t('readerStore.featuredAuthorsSubtitle')}
                />

                <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {visibleAuthors.map((author) => (
                    <button
                      key={author.author_page_id}
                      type="button"
                      onClick={() =>
                        author.page_username
                          ? navigate(
                              `/author/page/${encodeURIComponent(author.page_username)}`
                            )
                          : null
                      }
                      className="w-[72px] shrink-0 text-center active:scale-95"
                    >
                      <span className="relative mx-auto block h-[58px] w-[58px] rounded-full bg-gradient-to-br from-[#7c3aed] via-[#c084fc] to-[#22d3ee] p-[2px]">
                        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-surface)] p-[2px] text-[16px] font-extrabold text-[#7c3aed]">
                          {author.avatar_url ? (
                            <img
                              src={author.avatar_url}
                              alt={author.page_name || ''}
                              className="h-full w-full rounded-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            String(author.page_name || 'A')
                              .charAt(0)
                              .toUpperCase()
                          )}
                        </span>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#7c3aed] text-white ring-2 ring-[var(--shadow-bg-page)]">
                          <i className="fa-solid fa-check text-[8px]" />
                        </span>
                      </span>
                      <span className="mt-2 block truncate text-[10.5px] font-extrabold text-[var(--shadow-text-primary)]">
                        {author.page_name || author.page_username}
                      </span>
                      <span className="mt-0.5 block text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                        {author.product_count || 0} {t('readerStore.books')}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-6 space-y-3">
              <SectionHeader
                title={t('readerStore.fromAuthors')}
                subtitle={t('readerStore.fromAuthorsSubtitle')}
                action={
                  filteredProducts.length > 4
                    ? showAllProducts
                      ? t('readerStore.seeLess')
                      : t('readerStore.seeMore')
                    : ''
                }
                onAction={() => setShowAllProducts((value) => !value)}
              />

              {visibleProducts.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {visibleProducts.map((book) => (
                    <StoreBookCard
                      key={`author-${book.id}`}
                      book={book}
                      t={t}
                      saved={savedSet.has(String(book.id))}
                      onSave={() => toggleSaved(book.id)}
                      onOpen={() => openProduct(book)}
                      onAddToCart={() => addToCart(book)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-7 text-center text-[12px] font-extrabold text-[var(--shadow-text-tertiary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
                  {t('readerStore.noProducts')}
                </div>
              )}
            </section>

            {filteredEditorsPicks.length ? (
              <section className="mt-6 space-y-3 pb-5">
                <SectionHeader
                  title={t('readerStore.editorsPicks')}
                  subtitle={t('readerStore.editorsPicksSubtitle')}
                />

                <div className="grid grid-cols-2 gap-3">
                  {filteredEditorsPicks.map((book) => (
                    <StoreBookCard
                      key={`editor-${book.id}`}
                      book={book}
                      t={t}
                      saved={savedSet.has(String(book.id))}
                      onSave={() => toggleSaved(book.id)}
                      onOpen={() => openProduct(book)}
                      onAddToCart={() => addToCart(book)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </main>

      <ReaderProfileFooter />
    </div>
  )
}

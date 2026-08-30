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

const FILTERS = ['all', 'romance', 'bl', 'fantasy', 'pdf']

registerTranslationNamespace('readerStore', {
  en: {
    store: 'Store',
    goBack: 'Go back',
    searchBooks: 'Search books',
    searchPlaceholder: 'Search books or authors',
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
    soldOut: 'SOLD OUT',
    untitledBook: 'Untitled book',
    unknownAuthor: 'Unknown author',
    loading: 'Loading author stores...',
    loadFailed: 'Could not load author stores.',
    retry: 'Retry',
    noProducts: 'No books found.',
  },
  km: {
    store: 'ហាង',
    goBack: 'ត្រឡប់ក្រោយ',
    searchBooks: 'ស្វែងរកសៀវភៅ',
    searchPlaceholder: 'ស្វែងរកសៀវភៅ ឬអ្នកនិពន្ធ',
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
    soldOut: 'លក់អស់',
    untitledBook: 'សៀវភៅគ្មានចំណងជើង',
    unknownAuthor: 'មិនស្គាល់អ្នកនិពន្ធ',
    loading: 'កំពុងទាញហាងអ្នកនិពន្ធ...',
    loadFailed: 'មិនអាចទាញហាងអ្នកនិពន្ធបាន។',
    retry: 'សាកម្តងទៀត',
    noProducts: 'មិនមានសៀវភៅ។',
  },
  zh: {
    store: '商店',
    goBack: '返回',
    searchBooks: '搜索书籍',
    searchPlaceholder: '搜索书籍或作者',
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
    soldOut: '已售罄',
    untitledBook: '未命名书籍',
    unknownAuthor: '未知作者',
    loading: '正在加载作者商店...',
    loadFailed: '无法加载作者商店。',
    retry: '重试',
    noProducts: '没有找到书籍。',
  },
  ja: {
    store: 'ストア',
    goBack: '戻る',
    searchBooks: '本を検索',
    searchPlaceholder: '本または作家を検索',
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
    soldOut: '売り切れ',
    untitledBook: '無題の本',
    unknownAuthor: '不明な作家',
    loading: '作家ストアを読み込み中...',
    loadFailed: '作家ストアを読み込めませんでした。',
    retry: '再試行',
    noProducts: '本が見つかりません。',
  },
  ko: {
    store: '스토어',
    goBack: '뒤로 가기',
    searchBooks: '도서 검색',
    searchPlaceholder: '도서 또는 작가 검색',
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
    soldOut: '품절',
    untitledBook: '제목 없는 도서',
    unknownAuthor: '알 수 없는 작가',
    loading: '작가 스토어 불러오는 중...',
    loadFailed: '작가 스토어를 불러오지 못했습니다.',
    retry: '다시 시도',
    noProducts: '도서를 찾을 수 없습니다.',
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
    title: product.title || '',
    author: product.author_name || product.page_name || '',
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

async function fetchReaderStoreHome(fallbackMessage) {
  const response = await fetch(`${API_BASE_URL}/api/author-store/store/home?limit=24`)
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || fallbackMessage)
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

function StoreBookCard({ book, t, onOpen }) {
  const badgeLabel =
    book.badge === 'trending'
      ? t('readerStore.trendingLabel')
      : t('readerStore.newLabel')
  const typeLabel =
    book.type === 'pdf' ? t('readerStore.pdf') : t('readerStore.book')
  const soldOut = book.stockStatus === 'sold_out'
  const displayTitle = book.title || t('readerStore.untitledBook')
  const displayAuthor = book.author || t('readerStore.unknownAuthor')

  return (
    <article className="overflow-hidden rounded-[20px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
          {book.cover ? (
            <img
              src={book.cover}
              alt={displayTitle}
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
            {soldOut ? t('readerStore.soldOut') : badgeLabel}
          </span>
        </div>

        <div className="p-3">
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
                displayAuthor.charAt(0).toUpperCase()
              )}
            </span>

            <span className="min-w-0 flex-1 truncate text-[10.5px] font-bold text-[var(--shadow-text-secondary)]">
              {displayAuthor}
            </span>

            <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[9px] font-extrabold text-[var(--shadow-text-secondary)]">
              {typeLabel}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[var(--shadow-text-primary)]">
            {displayTitle}
          </h3>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold text-[#7c3aed]">
                {book.price}
              </div>
              {book.oldPrice ? (
                <div className="mt-0.5 text-[10px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                  {book.oldPrice}
                </div>
              ) : null}
            </div>

            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                soldOut
                  ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]'
                  : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
              }`}
            >
              <i className="fa-solid fa-bag-shopping text-[11px]" />
            </span>
          </div>
        </div>
      </button>
    </article>
  )
}

function EditorPickCard({ book, t, onOpen }) {
  const soldOut = book.stockStatus === 'sold_out'
  const displayTitle = book.title || t('readerStore.untitledBook')
  const badgeLabel =
    soldOut
      ? t('readerStore.soldOut')
      : book.badge === 'trending'
        ? t('readerStore.trendingLabel')
        : t('readerStore.newLabel')

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-[118px] shrink-0 text-left transition active:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-[var(--shadow-bg-soft)] shadow-sm ring-1 ring-[var(--shadow-border)]">
        {book.cover ? (
          <img
            src={book.cover}
            alt={displayTitle}
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
          className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[8px] font-extrabold shadow-sm ${
            soldOut
              ? 'bg-[#f1f5f9] text-[#64748b]'
              : book.badge === 'trending'
                ? 'bg-[#dff7f3] text-[#0f766e]'
                : 'bg-[#ede9fe] text-[#6d28d9]'
          }`}
        >
          {badgeLabel}
        </span>
      </div>

      <h3 className="mt-2 line-clamp-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">
        {displayTitle}
      </h3>
      <div className="mt-0.5 text-[10.5px] font-extrabold text-[#7c3aed]">
        {book.price}
      </div>
    </button>
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
        const data = await fetchReaderStoreHome(t('readerStore.loadFailed'))

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

  const keyword = searchQuery.trim().toLowerCase()

  const matchesFilter = (book) => {
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
    [products, activeFilter, keyword]
  )

  const filteredEditorsPicks = useMemo(
    () => editorsPicks.filter(matchesFilter).slice(0, 8),
    [editorsPicks, activeFilter, keyword]
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

  const openProduct = (book) => {
    if (!book.pageUsername) return
    navigate(
      `/author/page/${encodeURIComponent(book.pageUsername)}/store/product/${book.id}`
    )
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
              onClick={() => navigate('/author/cart')}
              aria-label={t('readerStore.openCart')}
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            >
              <i className="fa-solid fa-cart-shopping text-[19px]" />
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
          <SectionHeader title={t('readerStore.shadowMall')} />
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
                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {visibleProducts.map((book) => (
                    <div key={`author-${book.id}`} className="w-[155px] shrink-0">
                      <StoreBookCard
                        book={book}
                        t={t}
                        onOpen={() => openProduct(book)}
                      />
                    </div>
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

                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {filteredEditorsPicks.map((book) => (
                    <EditorPickCard
                      key={`editor-${book.id}`}
                      book={book}
                      t={t}
                      onOpen={() => openProduct(book)}
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

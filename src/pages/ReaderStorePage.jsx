import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ShadowMallSection from '../components/Shop/ShadowMallSection'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import ReaderMallWishlistPage from './ReaderMallWishlistPage'
import {
  isReaderMallWishlisted,
  toggleReaderMallWishlist,
} from '../utils/readerMallWishlist'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const FILTERS = ['all', 'book', 'pdf', 'under3']
const EMPTY_SECTIONS = {
  from_author_stores: [],
  editors_picks: [],
  best_sellers: [],
  discount_books: [],
  new_books: [],
  sold_out: [],
  you_might_like: [],
}
const BROWSE_KEYS = new Set(['from_author_stores', 'best_sellers', 'discount_books', 'new_books'])

registerTranslationNamespace('readerStore', {
  en: {
    store: 'Store',
    goBack: 'Go back',
    searchBooks: 'Search books',
    searchPlaceholder: 'Search books or authors',
    openCart: 'Open cart',
    openWaitlist: 'Open waitlist',
    addToWaitlist: 'Add to waitlist',
    removeFromWaitlist: 'Remove from waitlist',
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
    openWaitlist: 'បើក Waitlist',
    addToWaitlist: 'បន្ថែមទៅ Waitlist',
    removeFromWaitlist: 'ដកចេញពី Waitlist',
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
    openWaitlist: '打开心愿单',
    addToWaitlist: '加入心愿单',
    removeFromWaitlist: '从心愿单移除',
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
    openWaitlist: 'ウェイトリストを開く',
    addToWaitlist: 'ウェイトリストに追加',
    removeFromWaitlist: 'ウェイトリストから削除',
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
    openWaitlist: '위시리스트 열기',
    addToWaitlist: '위시리스트에 추가',
    removeFromWaitlist: '위시리스트에서 삭제',
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

const DISPLAY_LOCALES = { km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

function displayLocale() {
  return DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
}

function formatDisplayNumber(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(displayLocale()).format(Number.isFinite(number) ? number : 0)
}

registerTranslationNamespace('readerStoreShelves', {
  en: { under3: 'Under $3', bestSellers: 'Best Seller', discounts: 'Discount Books', newBooks: 'New Books', soldOut: 'Sold Out', discover: 'Explore More Books', loadMore: 'Load 9 more', loadingMore: 'Loading...', fromAuthors: 'From Author Stores', backStore: 'Back to Store', empty: 'No books found', retry: 'Try again' },
  km: { under3: 'ក្រោម $3', bestSellers: 'លក់ដាច់បំផុត', discounts: 'សៀវភៅបញ្ចុះតម្លៃ', newBooks: 'សៀវភៅថ្មី', soldOut: 'អស់ស្តុក', discover: 'ស្វែងរកសៀវភៅបន្ថែម', loadMore: 'បង្ហាញ ៩ ក្បាលទៀត', loadingMore: 'កំពុងទាញយក...', fromAuthors: 'ពីហាងអ្នកនិពន្ធ', backStore: 'ត្រឡប់ទៅហាង', empty: 'មិនមានសៀវភៅ', retry: 'សាកម្ដងទៀត' },
  zh: { under3: '低于 $3', bestSellers: '畅销书', discounts: '折扣图书', newBooks: '新书', soldOut: '售罄', discover: '探索更多图书', loadMore: '再加载9本', loadingMore: '加载中...', fromAuthors: '作者商店', backStore: '返回商店', empty: '未找到图书', retry: '重试' },
  ja: { under3: '$3未満', bestSellers: 'ベストセラー', discounts: '割引本', newBooks: '新刊', soldOut: '売り切れ', discover: 'もっと本を探す', loadMore: 'さらに9冊', loadingMore: '読み込み中...', fromAuthors: '作家ストア', backStore: 'ストアに戻る', empty: '本がありません', retry: '再試行' },
  ko: { under3: '$3 미만', bestSellers: '베스트셀러', discounts: '할인 도서', newBooks: '신간', soldOut: '품절', discover: '더 많은 도서', loadMore: '9권 더 보기', loadingMore: '불러오는 중...', fromAuthors: '작가 스토어', backStore: '스토어로 돌아가기', empty: '도서가 없습니다', retry: '다시 시도' },
})

function formatMoney(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(displayLocale(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(number) ? number : 0)
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
    oldPriceValue:
      salePrice > 0 && originalPrice > 0 && salePrice !== originalPrice
        ? originalPrice
        : 0,
    type,
    badge: product.best_seller ? 'trending' : 'new',
    soldQuantity: Math.max(0, Number(product.sold_quantity || 0)),
    bestSellerRank: Math.max(0, Number(product.best_seller_rank || 0)),
    discountPercent: salePrice > 0 && originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0,
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

  const sections = data.sections || {}
  const mapped = Object.fromEntries(
    Object.keys(EMPTY_SECTIONS).map((key) => [
      key,
      (Array.isArray(sections[key]) ? sections[key] : []).map(normalizeProduct),
    ])
  )
  return {
    products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : [],
    featuredAuthors: Array.isArray(data.featured_authors) ? data.featured_authors : [],
    editorsPicks: Array.isArray(data.editors_picks)
      ? data.editors_picks.map(normalizeProduct)
      : [],
    sections: mapped,
    exploreHasMore: typeof data.sections_has_more?.you_might_like === 'boolean'
      ? data.sections_has_more.you_might_like
      : mapped.you_might_like.length === 9,
  }
}

async function fetchReaderShelf(section, page, filter = 'all', search = '') {
  const params = new URLSearchParams({ browse: '1', section, page: String(page), limit: '9', filter })
  if (search.trim()) params.set('search', search.trim().slice(0, 100))
  const response = await fetch(`${API_BASE_URL}/api/author-store/store/home?${params.toString()}`)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load books')
  return {
    products: (Array.isArray(data.products) ? data.products : []).map(normalizeProduct),
    hasMore: Boolean(data.has_more),
  }
}

function ResilientImage({ src, alt, className, fallback }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) return fallback

  return (
    <img
      src={src}
      alt={alt}
      draggable="false"
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

function HorizontalScrollRow({ children, className = '' }) {
  const rowRef = useRef(null)
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    dragging: false,
    cancelled: false,
    suppressClick: false,
  })

  const finishPointer = (event) => {
    const row = rowRef.current
    const drag = dragRef.current

    if (drag.pointerId !== event.pointerId) return

    if (drag.dragging) {
      drag.suppressClick = true
      window.setTimeout(() => {
        drag.suppressClick = false
      }, 120)
    }

    if (row?.hasPointerCapture?.(event.pointerId)) {
      row.releasePointerCapture(event.pointerId)
    }

    drag.pointerId = null
    drag.dragging = false
    drag.cancelled = false
  }

  return (
    <div
      ref={rowRef}
      className={`select-none overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      style={{ touchAction: 'pan-x pan-y pinch-zoom', WebkitOverflowScrolling: 'touch' }}
      onPointerDown={(event) => {
  if (event.pointerType === 'touch') return
  if (event.button !== undefined && event.button !== 0) return

  const row = rowRef.current
        if (!row) return

        dragRef.current.pointerId = event.pointerId
        dragRef.current.startX = event.clientX
        dragRef.current.startY = event.clientY
        dragRef.current.startLeft = row.scrollLeft
        dragRef.current.dragging = false
        dragRef.current.cancelled = false
      }}
      onPointerMove={(event) => {
        const row = rowRef.current
        const drag = dragRef.current

        if (!row || drag.pointerId !== event.pointerId || drag.cancelled) return

        const deltaX = event.clientX - drag.startX
        const deltaY = event.clientY - drag.startY

        if (!drag.dragging) {
          if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return

          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            drag.cancelled = true
            return
          }

          drag.dragging = true

          if (!row.hasPointerCapture?.(event.pointerId)) {
            row.setPointerCapture?.(event.pointerId)
          }
        }

        row.scrollLeft = drag.startLeft - deltaX
        event.preventDefault()
      }}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onLostPointerCapture={(event) => {
        if (dragRef.current.pointerId === event.pointerId) {
          dragRef.current.pointerId = null
          dragRef.current.dragging = false
          dragRef.current.cancelled = false
        }
      }}
      onClickCapture={(event) => {
        if (!dragRef.current.suppressClick) return
        event.preventDefault()
        event.stopPropagation()
      }}
      onDragStart={(event) => event.preventDefault()}
    >
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          aria-label={action}
          onClick={onAction}
          className="-mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-70"
        >
          <i className="fa-solid fa-chevron-right text-[19px]" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

function toReaderMallWaitlistItem(book) {
  return {
    source: 'author',
    sellerId: book.authorPageId,
    productId: book.id,
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    price: book.priceValue,
    oldPrice: book.oldPriceValue,
    type: book.type,
    status: book.stockStatus,
    pageName: book.pageName,
    pageUsername: book.pageUsername,
    authorAvatar: book.authorAvatar,
  }
}

function WaitlistHeartButton({ book, t, compact = false }) {
  const item = useMemo(() => toReaderMallWaitlistItem(book), [book])
  const [wishlisted, setWishlisted] = useState(() => isReaderMallWishlisted(item))

  useEffect(() => {
    const refresh = () => setWishlisted(isReaderMallWishlisted(item))

    window.addEventListener('reader-mall-wishlist-change', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)

    return () => {
      window.removeEventListener('reader-mall-wishlist-change', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [item])

  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const result = toggleReaderMallWishlist(item)
    setWishlisted(result.wishlisted)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        wishlisted
          ? t('readerStore.removeFromWaitlist')
          : t('readerStore.addToWaitlist')
      }
      className={`absolute right-2 top-2 z-10 flex items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] shadow-sm active:scale-95 ${
        compact ? 'h-7 w-7' : 'h-8 w-8'
      } ${wishlisted ? 'text-[#e5484d]' : 'text-[var(--shadow-text-primary)]'}`}
    >
      <i
        className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart ${
          compact ? 'text-[11px]' : 'text-[13px]'
        }`}
      />
    </button>
  )
}

function StoreBookCard({ book, t, onOpen }) {
  const typeLabel =
    book.type === 'pdf' ? t('readerStore.pdf') : t('readerStore.book')
  const soldOut = book.stockStatus === 'sold_out'
  const displayTitle = book.title || t('readerStore.untitledBook')
  const displayAuthor = book.author || t('readerStore.unknownAuthor')
  const authorInitial = displayAuthor.charAt(0).toUpperCase() || 'A'

  return (
    <article className="overflow-hidden rounded-[14px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
        <button
          type="button"
          onClick={onOpen}
          className="block h-full w-full text-left"
        >
          <ResilientImage
            src={book.cover}
            alt={displayTitle}
            className={`h-full w-full object-cover ${soldOut ? 'opacity-60' : ''}`}
            fallback={
              <span className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
                <i className="fa-regular fa-image text-[22px]" />
              </span>
            }
          />
        </button>

        {soldOut ? (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-[#f1f5f9] px-2 py-1 text-[9px] font-extrabold text-[#64748b]">
            {t('readerStore.soldOut')}
          </span>
        ) : null}

        <WaitlistHeartButton book={book} t={t} />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="block w-full p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ede9fe] text-[9px] font-black text-[#6d28d9]">
            <ResilientImage
              src={book.authorAvatar}
              alt=""
              className="h-full w-full object-cover"
              fallback={authorInitial}
            />
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
              {formatMoney(book.priceValue)}
            </div>
            {book.oldPrice ? (
              <div className="mt-0.5 text-[10px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                {formatMoney(book.oldPriceValue)}
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
      </button>
    </article>
  )
}

function EditorPickCard({ book, t, onOpen, badgeType = '', rank = 0, className = 'w-[118px] shrink-0' }) {
  const soldOut = book.stockStatus === 'sold_out'
  const displayTitle = book.title || t('readerStore.untitledBook')
  const badgeLabel =
    badgeType === 'best' && rank > 0 && rank <= 3
      ? `TOP ${rank}`
      : badgeType === 'discount' && book.discountPercent > 0
        ? `−${Math.round(book.discountPercent)}%`
        : badgeType === 'new'
          ? t('readerStore.newLabel')
          : badgeType === 'sold'
            ? t('readerStore.soldOut')
            : ''
  const badgeColor = badgeType === 'best'
    ? 'bg-[#fef3c7] text-[#92400e]'
    : badgeType === 'discount'
      ? 'bg-[#fee2e2] text-[#b91c1c]'
      : badgeType === 'new'
        ? 'bg-[#dbeafe] text-[#1d4ed8]'
        : 'bg-[#f1f5f9] text-[#64748b]'

  return (
    <article className={className}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)] shadow-sm ring-1 ring-[var(--shadow-border)]">
        <button type="button" onClick={onOpen} className="block h-full w-full text-left transition active:scale-[0.98]">
          <ResilientImage
            src={book.cover}
            alt={displayTitle}
            className={`h-full w-full object-cover ${soldOut ? 'opacity-60' : ''}`}
            fallback={
              <span className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
                <i className="fa-regular fa-image text-[22px]" />
              </span>
            }
          />
        </button>
        {badgeLabel ? (
          <span className={`pointer-events-none absolute left-1.5 top-1.5 rounded-full px-2 py-1 text-[9px] font-extrabold shadow-sm ${badgeColor}`}>
            {badgeLabel}
          </span>
        ) : null}
        <WaitlistHeartButton book={book} t={t} compact />
      </div>
      <button type="button" onClick={onOpen} className="block w-full text-left transition active:scale-[0.98]">
        <h3 className="mt-2 line-clamp-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">{displayTitle}</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10.5px] font-extrabold text-[#7c3aed]">
          <span>{formatMoney(book.priceValue)}</span>
          {badgeType === 'discount' && book.oldPriceValue > book.priceValue ? (
            <span className="text-[9px] font-medium text-[var(--shadow-text-tertiary)] line-through">{formatMoney(book.oldPriceValue)}</span>
          ) : null}
        </div>
      </button>
    </article>
  )
}

function ReaderStoreShelf({ title, subtitle, books, t, layout = 'row', badgeType = '', onOpen, onMore, large = false }) {
  if (!books.length) return null
  const cards = books.map((book, index) => (
    <EditorPickCard
      key={book.id}
      book={book}
      t={t}
      onOpen={() => onOpen(book)}
      badgeType={badgeType}
      rank={badgeType === 'best' ? book.bestSellerRank : 0}
      className={layout === 'grid' ? 'min-w-0' : large ? 'w-[155px] shrink-0' : 'w-[118px] shrink-0'}
    />
  ))
  return (
    <section className="mt-6 space-y-3">
      <SectionHeader title={title} subtitle={subtitle} action={onMore ? t('readerStore.seeMore') : ''} onAction={onMore} />
      {layout === 'grid' ? (
        <div className="grid grid-cols-3 gap-x-3 gap-y-5">{cards}</div>
      ) : (
        <HorizontalScrollRow className="-mx-1 flex gap-3 px-1 pb-2">{cards}</HorizontalScrollRow>
      )}
    </section>
  )
}

function useStoreBooksPager(section, seed, enabled, fromHome, filter = 'all', search = '', seedHasMore = false) {
  const [state, setState] = useState({ items: [], page: 0, hasMore: false, loading: false, error: '' })
  const pending = useRef(false)
  const generation = useRef(0)
  const autoCount = useRef(0)
  const sentinel = useRef(null)

  useEffect(() => {
    generation.current += 1
    const id = generation.current
    pending.current = false
    autoCount.current = 0
    if (!enabled || !section) {
      setState({ items: [], page: 0, hasMore: false, loading: false, error: '' })
      return
    }
    if (fromHome && filter === 'all' && !search) {
      setState({ items: seed, page: seed.length ? 1 : 0, hasMore: seedHasMore, loading: false, error: '' })
      return
    }
    pending.current = true
    setState({ items: [], page: 0, hasMore: true, loading: true, error: '' })
    fetchReaderShelf(section, 1, filter, search)
      .then((result) => {
        if (generation.current !== id) return
        setState({ items: result.products, page: 1, hasMore: result.hasMore, loading: false, error: '' })
      })
      .catch((error) => {
        if (generation.current !== id) return
        setState({ items: [], page: 0, hasMore: true, loading: false, error: error.message })
      })
      .finally(() => {
        if (generation.current === id) pending.current = false
      })
    return () => { generation.current += 1 }
  }, [section, enabled, fromHome, seed, filter, search, seedHasMore])

  const loadNext = async (automatic = false) => {
    if (!enabled || pending.current || !state.hasMore || (automatic && autoCount.current >= 2)) return
    const id = generation.current
    const next = state.page + 1
    pending.current = true
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const result = await fetchReaderShelf(section, next, filter, search)
      if (generation.current !== id) return
      setState((current) => {
        const seen = new Set(current.items.map((item) => String(item.id)))
        const appended = result.products.filter((item) => !seen.has(String(item.id)))
        return { items: [...current.items, ...appended], page: next, hasMore: result.hasMore, loading: false, error: '' }
      })
      if (automatic) autoCount.current += 1
    } catch (error) {
      if (generation.current === id) setState((current) => ({ ...current, loading: false, error: error.message }))
    } finally {
      if (generation.current === id) pending.current = false
    }
  }

  useEffect(() => {
    if (!enabled || state.page < 1 || !state.hasMore || state.loading || autoCount.current >= 2) return
    const target = sentinel.current
    if (!target || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadNext(true)
    }, { rootMargin: '220px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled, state.page, state.hasMore, state.loading, section, filter, search])

  return { ...state, sentinel, loadNext, manualReady: autoCount.current >= 2 || typeof IntersectionObserver === 'undefined' }
}

function StorePaginationFooter({ pager, t }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-3 pb-5">
      {pager.error ? <div className="text-[12px] text-[#e5484d]">{pager.error}</div> : null}
      {pager.loading ? <div className="text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{t('readerStoreShelves.loadingMore')}</div> : null}
      {pager.hasMore && !pager.loading && (pager.manualReady || pager.error) ? (
        <button type="button" onClick={() => pager.loadNext(false)} className="rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-2.5 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
          {pager.error ? t('readerStoreShelves.retry') : t('readerStoreShelves.loadMore')}
        </button>
      ) : null}
      <div ref={pager.sentinel} className="h-px w-full" aria-hidden="true" />
    </div>
  )
}

export default function ReaderStorePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const requestedBrowseKey = new URLSearchParams(location.search).get('browse') || ''
  const browseKey = BROWSE_KEYS.has(requestedBrowseKey) ? requestedBrowseKey : ''
    const [featuredAuthors, setFeaturedAuthors] = useState([])
    const [activeFilter, setActiveFilter] = useState('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sections, setSections] = useState(EMPTY_SECTIONS)
  const [exploreHasMore, setExploreHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  useEffect(() => {
    const nextSearch = searchQuery.trim().slice(0, 100)
    if (!nextSearch) {
      setDebouncedSearch('')
      return
    }
    const timer = window.setTimeout(() => setDebouncedSearch(nextSearch), 350)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (browseKey) {
      setLoading(false)
      setLoadError('')
      return
    }
    let ignore = false

    async function loadStore() {
      try {
        setLoading(true)
        setLoadError('')
        const data = await fetchReaderStoreHome(t('readerStore.loadFailed'))

        if (!ignore) {
          setFeaturedAuthors(data.featuredAuthors)
          setSections(data.sections)
          setExploreHasMore(data.exploreHasMore)
        }
      } catch (error) {
        if (!ignore) {
          setFeaturedAuthors([])
          setSections(EMPTY_SECTIONS)
          setExploreHasMore(false)
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
  }, [retryKey, browseKey])

  const keyword = searchQuery.trim().slice(0, 100).toLowerCase()

  const matchesFilter = (book) => {
    if (activeFilter === 'book' && book.type !== 'book') return false
    if (activeFilter === 'pdf' && book.type !== 'pdf') return false
    if (activeFilter === 'under3' && book.priceValue >= 3) return false

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

  const visibleAuthors = useMemo(() => {
    if (!keyword) return featuredAuthors

    return featuredAuthors.filter((author) =>
      `${author.page_name || ''} ${author.page_username || ''}`
        .toLowerCase()
        .includes(keyword)
    )
  }, [featuredAuthors, keyword])

  const searchReady = searchQuery.trim().slice(0, 100) === debouncedSearch
  const explorePager = useStoreBooksPager('you_might_like', sections.you_might_like, !browseKey && !loading && !loadError && searchReady, true, activeFilter, debouncedSearch, exploreHasMore)
  const browsePager = useStoreBooksPager(browseKey, EMPTY_SECTIONS.you_might_like, Boolean(browseKey) && searchReady, false, activeFilter, debouncedSearch)
  const visibleSection = (key) => (sections[key] || [])
  .map((book, index) => key === 'best_sellers' ? { ...book, bestSellerRank: book.bestSellerRank || index + 1 } : book)
  .filter((book) => matchesFilter(book) && (key !== 'discount_books' || book.discountPercent > 0))
  const openBrowse = (key) => navigate(`/store?browse=${key}`)
  const browseTitles = {
    from_author_stores: t('readerStore.fromAuthors'),
    best_sellers: t('readerStoreShelves.bestSellers'),
    discount_books: t('readerStoreShelves.discounts'),
    new_books: t('readerStoreShelves.newBooks'),
  }

  const openProduct = (book) => {
  if (!book.pageUsername) return

  navigate(`/author/page/${encodeURIComponent(book.pageUsername)}/store/product/${book.id}`, {
    state: { from: location.pathname + location.search + location.hash },
  })
}

  const filterLabel = (filter) => filter === 'under3' ? t('readerStoreShelves.under3') : t(`readerStore.${filter}`)

  if (waitlistOpen) {
    return <ReaderMallWishlistPage onBack={() => setWaitlistOpen(false)} />
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[560px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => browseKey ? navigate('/store') : navigate(-1)}
            aria-label={t('readerStore.goBack')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[19px] font-extrabold tracking-tight">
            {browseKey ? browseTitles[browseKey] : t('readerStore.store')}
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
              onClick={() => setWaitlistOpen(true)}
              aria-label={t('readerStore.openWaitlist')}
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            >
              <i className="fa-regular fa-heart text-[18px]" />
            </button>
            <button
              type="button"
              onClick={() =>
  navigate('/reader-mall/cart', {
    state: { from: location.pathname + location.search + location.hash },
  })
}
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
  {!browseKey ? <ShadowMallSection sliderOnly /> : null}

  <HorizontalScrollRow className="-mx-1 mt-5 flex gap-2 px-1 pb-2">
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
        </HorizontalScrollRow>

        {!browseKey && loading ? (
          <div className="mt-5 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-8 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--shadow-border)] border-t-[#7c3aed]" />
            <div className="mt-3 text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              {t('readerStore.loading')}
            </div>
          </div>
        ) : null}

        {!browseKey && !loading && loadError ? (
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

        {browseKey ? (
          <section className="mt-5">
            {browsePager.items.filter(matchesFilter).length ? (
              <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                {browsePager.items.filter(matchesFilter).map((book, index) => (
                  <EditorPickCard
                    key={book.id}
                    book={book}
                    t={t}
                    onOpen={() => openProduct(book)}
                    badgeType={browseKey === 'best_sellers' ? 'best' : browseKey === 'discount_books' ? 'discount' : browseKey === 'new_books' ? 'new' : ''}
                    rank={browseKey === 'best_sellers' ? book.bestSellerRank || browsePager.items.findIndex((item) => item.id === book.id) + 1 : 0}
                    className="min-w-0"
                  />
                ))}
              </div>
            ) : !browsePager.loading && !browsePager.error && searchReady ? (
              <div className="py-8 text-center text-[12px] text-[var(--shadow-text-tertiary)]">{t('readerStoreShelves.empty')}</div>
            ) : null}
            {!searchReady ? <div className="py-6 text-center text-[12px] text-[var(--shadow-text-secondary)]">{t('readerStoreShelves.loadingMore')}</div> : null}
            <StorePaginationFooter pager={browsePager} t={t} />
          </section>
        ) : !loading && !loadError ? (
          <>
            {visibleAuthors.length ? (
              <section className="mt-5 space-y-3">
                <SectionHeader
                  title={t('readerStore.featuredAuthors')}
                  subtitle={t('readerStore.featuredAuthorsSubtitle')}
                />

                <HorizontalScrollRow className="-mx-1 flex gap-4 px-1 pb-2">
                  {visibleAuthors.map((author) => {
                    const authorName = author.page_name || author.page_username || 'A'
                    const authorInitial = String(authorName).charAt(0).toUpperCase()

                    return (
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
                            <ResilientImage
                              src={author.avatar_url}
                              alt={author.page_name || ''}
                              className="h-full w-full rounded-full object-cover"
                              fallback={authorInitial}
                            />
                          </span>
                        </span>
                        <span className="mt-2 block truncate text-[10.5px] font-extrabold text-[var(--shadow-text-primary)]">
                          {author.page_name || author.page_username}
                        </span>
                        <span className="mt-0.5 block text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                          {formatDisplayNumber(author.product_count)} {t('readerStore.books')}
                        </span>
                      </button>
                    )
                  })}
                </HorizontalScrollRow>
              </section>
            ) : null}

            {visibleSection('from_author_stores').length ? (
              <section className="mt-6 space-y-3">
                <SectionHeader
                  title={t('readerStore.fromAuthors')}
                  subtitle={t('readerStore.fromAuthorsSubtitle')}
                  action={t('readerStore.seeMore')}
                  onAction={() => openBrowse('from_author_stores')}
                />
                <HorizontalScrollRow className="-mx-1 flex gap-3 px-1 pb-2">
                  {visibleSection('from_author_stores').map((book) => (
                    <div key={book.id} className="w-[155px] shrink-0">
                      <StoreBookCard book={book} t={t} onOpen={() => openProduct(book)} />
                    </div>
                  ))}
                </HorizontalScrollRow>
              </section>
            ) : null}
            <ReaderStoreShelf title={t('readerStore.editorsPicks')} subtitle={t('readerStore.editorsPicksSubtitle')} books={visibleSection('editors_picks')} t={t} layout="grid" onOpen={openProduct} />
            <ReaderStoreShelf title={t('readerStoreShelves.bestSellers')} books={visibleSection('best_sellers')} t={t} layout="grid" badgeType="best" onOpen={openProduct} onMore={() => openBrowse('best_sellers')} />
            <ReaderStoreShelf title={t('readerStoreShelves.discounts')} books={visibleSection('discount_books')} t={t} badgeType="discount" onOpen={openProduct} onMore={() => openBrowse('discount_books')} />
            <ReaderStoreShelf title={t('readerStoreShelves.newBooks')} books={visibleSection('new_books')} t={t} badgeType="new" onOpen={openProduct} onMore={() => openBrowse('new_books')} />
            <ReaderStoreShelf title={t('readerStoreShelves.soldOut')} books={visibleSection('sold_out')} t={t} badgeType="sold" onOpen={openProduct} />
            <section className="mt-6 space-y-3 pb-5">
              <SectionHeader title={t('readerStoreShelves.discover')} />
              {explorePager.items.filter(matchesFilter).length ? (
                <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                  {explorePager.items.filter(matchesFilter).map((book) => (
                    <EditorPickCard key={book.id} book={book} t={t} onOpen={() => openProduct(book)} className="min-w-0" />
                  ))}
                </div>
              ) : !explorePager.loading && !explorePager.error && searchReady ? (
                <div className="py-8 text-center text-[12px] text-[var(--shadow-text-tertiary)]">{t('readerStoreShelves.empty')}</div>
              ) : null}
              {!searchReady ? <div className="py-6 text-center text-[12px] text-[var(--shadow-text-secondary)]">{t('readerStoreShelves.loadingMore')}</div> : null}
              <StorePaginationFooter pager={explorePager} t={t} />
            </section>
          </>
        ) : null}
      </main>

      <ReaderProfileFooter />
    </div>
  )
}

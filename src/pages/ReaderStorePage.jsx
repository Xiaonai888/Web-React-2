import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ShadowMallSection from '../components/Shop/ShadowMallSection'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('readerStore', {
  en: {
    store: 'Store',
    goBack: 'Go back',
    searchBooks: 'Search books',
    openWishlist: 'Open wishlist',
    openCart: 'Open cart',
    shadowMall: 'Shadow Mall',
    seeMore: 'See more',
    featuredAuthors: 'Featured Author Stores',
    featuredAuthorsSubtitle: 'Discover writers with books for sale.',
    books: 'Books',
    fromAuthors: 'From Author Stores',
    fromAuthorsSubtitle: 'Books and PDFs from different authors.',
    editorsPicks: "Editors' Picks",
    editorsPicksSubtitle: 'A mixed showcase for the Store demo.',
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
  },
  km: {
    store: 'ហាង',
    goBack: 'ត្រឡប់ក្រោយ',
    searchBooks: 'ស្វែងរកសៀវភៅ',
    openWishlist: 'បើកបញ្ជីចង់បាន',
    openCart: 'បើកកន្ត្រក',
    shadowMall: 'Shadow Mall',
    seeMore: 'មើលបន្ថែម',
    featuredAuthors: 'ហាងអ្នកនិពន្ធពិសេស',
    featuredAuthorsSubtitle: 'ស្វែងរកអ្នកនិពន្ធដែលមានស្នាដៃសម្រាប់លក់។',
    books: 'សៀវភៅ',
    fromAuthors: 'ពីហាងអ្នកនិពន្ធ',
    fromAuthorsSubtitle: 'សៀវភៅ និង PDF ពីអ្នកនិពន្ធផ្សេងៗ។',
    editorsPicks: 'ជម្រើសណែនាំ',
    editorsPicksSubtitle: 'ស្នាដៃចម្រុះសម្រាប់ Demo Store។',
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
  },
  zh: {
    store: '商店',
    goBack: '返回',
    searchBooks: '搜索书籍',
    openWishlist: '打开愿望清单',
    openCart: '打开购物车',
    shadowMall: 'Shadow Mall',
    seeMore: '查看更多',
    featuredAuthors: '精选作者商店',
    featuredAuthorsSubtitle: '发现正在出售作品的作者。',
    books: '本书',
    fromAuthors: '来自作者商店',
    fromAuthorsSubtitle: '来自不同作者的书籍和 PDF。',
    editorsPicks: '编辑推荐',
    editorsPicksSubtitle: 'Store 演示的混合展示。',
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
  },
  ja: {
    store: 'ストア',
    goBack: '戻る',
    searchBooks: '本を検索',
    openWishlist: 'ほしい物リストを開く',
    openCart: 'カートを開く',
    shadowMall: 'Shadow Mall',
    seeMore: 'もっと見る',
    featuredAuthors: '注目の作家ストア',
    featuredAuthorsSubtitle: '販売作品のある作家を見つけよう。',
    books: '冊',
    fromAuthors: '作家ストアから',
    fromAuthorsSubtitle: 'さまざまな作家の本と PDF。',
    editorsPicks: '編集部おすすめ',
    editorsPicksSubtitle: 'Store デモ用のミックス展示。',
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
  },
  ko: {
    store: '스토어',
    goBack: '뒤로 가기',
    searchBooks: '도서 검색',
    openWishlist: '위시리스트 열기',
    openCart: '장바구니 열기',
    shadowMall: 'Shadow Mall',
    seeMore: '더 보기',
    featuredAuthors: '추천 작가 스토어',
    featuredAuthorsSubtitle: '판매 작품이 있는 작가를 만나보세요.',
    books: '권',
    fromAuthors: '작가 스토어',
    fromAuthorsSubtitle: '여러 작가의 도서와 PDF입니다.',
    editorsPicks: '에디터 추천',
    editorsPicksSubtitle: 'Store 데모용 혼합 쇼케이스입니다.',
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
  },
})

const DEMO_AUTHORS = [
  { id: 1, name: 'Luna Writes', books: 24, image: '/assets/New%20Arrival/New%20Arrival%201.jpg' },
  { id: 2, name: 'InkbyJ', books: 18, image: '/assets/New%20Arrival/New%20Arrival%202.jpg' },
  { id: 3, name: 'Daydreamer', books: 31, image: '/assets/New%20Arrival/New%20Arrival%203.jpg' },
  { id: 4, name: 'PaperHearts', books: 16, image: '/assets/New%20Arrival/New%20Arrival%204.jpg' },
  { id: 5, name: 'Northwind', books: 22, image: '/assets/New%20Arrival/New%20Arrival%205.jpg' },
  { id: 6, name: 'Mellow Ink', books: 19, image: '/assets/New%20Arrival/New%20Arrival%206.jpg' },
]

const DEMO_BOOKS = [
  { id: 1, title: 'After the Rain', author: 'Luna Writes', price: '$6.50', category: 'romance', type: 'book', badge: 'new', cover: '/assets/New%20Arrival/New%20Arrival%207.jpg' },
  { id: 2, title: 'Midnight Letters', author: 'InkbyJ', price: '$6.25', category: 'bl', type: 'pdf', badge: 'trending', cover: '/assets/New%20Arrival/New%20Arrival%208.jpg' },
  { id: 3, title: 'The Quiet Playground', author: 'PaperHearts', price: '$5.75', category: 'romance', type: 'book', badge: 'new', cover: '/assets/New%20Arrival/New%20Arrival%209.jpg' },
  { id: 4, title: 'Crown Without a King', author: 'Northwind', price: '$7.20', category: 'fantasy', type: 'book', badge: 'trending', cover: '/assets/New%20Arrival/New%20Arrival%2010.jpg' },
  { id: 5, title: 'Blue Hour', author: 'Daydreamer', price: '$4.90', category: 'romance', type: 'pdf', badge: 'new', cover: '/assets/New%20Arrival/New%20Arrival%2011.jpg' },
  { id: 6, title: 'Between Two Names', author: 'Mellow Ink', price: '$6.80', category: 'bl', type: 'book', badge: 'trending', cover: '/assets/New%20Arrival/New%20Arrival%2012.jpg' },
  { id: 7, title: 'The Last Moon Garden', author: 'Luna Writes', price: '$7.45', category: 'fantasy', type: 'pdf', badge: 'new', cover: '/assets/New%20Arrival/New%20Arrival%2013.jpg' },
  { id: 8, title: 'A Place We Almost Stayed', author: 'InkbyJ', price: '$6.10', category: 'romance', type: 'book', badge: 'trending', cover: '/assets/New%20Arrival/New%20Arrival%2014.jpg' },
]

const FILTERS = ['all', 'romance', 'bl', 'fantasy', 'pdf']

function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <button type="button" onClick={onAction} className="shrink-0 text-[12px] font-extrabold text-[#7c3aed] active:opacity-70">
          {action} <span aria-hidden="true">›</span>
        </button>
      ) : null}
    </div>
  )
}

function DemoBookCard({ book, t }) {
  const badgeLabel = book.badge === 'trending' ? t('readerStore.trendingLabel') : t('readerStore.newLabel')
  const typeLabel = book.type === 'pdf' ? t('readerStore.pdf') : t('readerStore.book')

  return (
    <article className="overflow-hidden rounded-[20px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
        <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-extrabold shadow-sm ${book.badge === 'trending' ? 'bg-[#dff7f3] text-[#0f766e]' : 'bg-[#ede9fe] text-[#6d28d9]'}`}>
          {badgeLabel}
        </span>
        <button type="button" aria-label={t('readerStore.saveBook')} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-sm active:scale-95">
          <i className="fa-regular fa-heart text-[13px]" />
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-[9px] font-black text-[#6d28d9]">
            {book.author.charAt(0)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[10.5px] font-bold text-[var(--shadow-text-secondary)]">{book.author}</span>
          <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[9px] font-extrabold text-[var(--shadow-text-secondary)]">{typeLabel}</span>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[var(--shadow-text-primary)]">{book.title}</h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[13px] font-extrabold text-[#7c3aed]">{book.price}</span>
          <button type="button" aria-label={t('readerStore.addToCart')} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]">
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
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredBooks = useMemo(() => {
    if (activeFilter === 'all') return DEMO_BOOKS
    if (activeFilter === 'pdf') return DEMO_BOOKS.filter((book) => book.type === 'pdf')
    return DEMO_BOOKS.filter((book) => book.category === activeFilter)
  }, [activeFilter])

  const filterLabel = (filter) => {
    const key = filter === 'all' ? 'all' : filter
    return t(`readerStore.${key}`)
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[560px] items-center gap-2 px-3">
          <button type="button" onClick={() => navigate(-1)} aria-label={t('readerStore.goBack')} className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]">
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[19px] font-extrabold tracking-tight">{t('readerStore.store')}</h1>

          <div className="ml-auto flex items-center gap-1">
            <button type="button" onClick={() => navigate('/shop/mall/search')} aria-label={t('readerStore.searchBooks')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
              <i className="fa-solid fa-magnifying-glass text-[17px]" />
            </button>
            <button type="button" onClick={() => navigate('/shop/mall/wishlist')} aria-label={t('readerStore.openWishlist')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
              <i className="fa-regular fa-heart text-[20px]" />
            </button>
            <button type="button" onClick={() => navigate('/shop/mall/cart')} aria-label={t('readerStore.openCart')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
              <i className="fa-solid fa-cart-shopping text-[19px]" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 pt-4">
        <section className="space-y-3">
          <SectionHeader title={t('readerStore.shadowMall')} action={t('readerStore.seeMore')} onAction={() => navigate('/shop')} />
          <ShadowMallSection sliderOnly />
        </section>

        <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter
            return (
              <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold transition active:scale-95 ${active ? 'bg-[#7c3aed] text-white shadow-sm' : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'}`}>
                {filterLabel(filter)}
              </button>
            )
          })}
        </div>

        <section className="mt-5 space-y-3">
          <SectionHeader title={t('readerStore.featuredAuthors')} subtitle={t('readerStore.featuredAuthorsSubtitle')} action={t('readerStore.seeMore')} />
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {DEMO_AUTHORS.map((author) => (
              <button key={author.id} type="button" className="w-[72px] shrink-0 text-center active:scale-95">
                <span className="relative mx-auto block h-[58px] w-[58px] rounded-full bg-gradient-to-br from-[#7c3aed] via-[#c084fc] to-[#22d3ee] p-[2px]">
                  <span className="block h-full w-full overflow-hidden rounded-full bg-[var(--shadow-bg-surface)] p-[2px]">
                    <img src={author.image} alt={author.name} className="h-full w-full rounded-full object-cover" />
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#7c3aed] text-white ring-2 ring-[var(--shadow-bg-page)]">
                    <i className="fa-solid fa-check text-[8px]" />
                  </span>
                </span>
                <span className="mt-2 block truncate text-[10.5px] font-extrabold text-[var(--shadow-text-primary)]">{author.name}</span>
                <span className="mt-0.5 block text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">{author.books} {t('readerStore.books')}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-3">
          <SectionHeader title={t('readerStore.fromAuthors')} subtitle={t('readerStore.fromAuthorsSubtitle')} action={t('readerStore.seeMore')} />
          <div className="grid grid-cols-2 gap-3">
            {filteredBooks.slice(0, 4).map((book) => (
              <DemoBookCard key={`author-${book.id}`} book={book} t={t} />
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-3 pb-5">
          <SectionHeader title={t('readerStore.editorsPicks')} subtitle={t('readerStore.editorsPicksSubtitle')} action={t('readerStore.seeMore')} />
          <div className="grid grid-cols-2 gap-3">
            {(filteredBooks.length > 4 ? filteredBooks.slice(4, 8) : DEMO_BOOKS.slice(4, 8)).map((book) => (
              <DemoBookCard key={`editor-${book.id}`} book={book} t={t} />
            ))}
          </div>
        </section>
      </main>

      <ReaderProfileFooter />
    </div>
  )
}

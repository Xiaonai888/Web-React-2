import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { addShadowMallCartItem } from '../../utils/shadowMallCart'
import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallPreOrderPage', {
  en: { latest: 'Latest', releaseSoon: 'Release Soon', priceLow: 'Price Low', priceHigh: 'Price High', soldOut: 'SOLD OUT', preOrder: 'PRE-ORDER', untitledBook: 'Untitled book', unknownAuthor: 'Unknown author', removeSaved: 'Remove saved', save: 'Save', reserveBook: 'Reserve {{title}}', featured: 'FEATURED', preOrderOpen: 'PRE-ORDER OPEN', featuredBody: 'Reserve this upcoming book before release. Pre-order stock can be limited and may close early.', reserveNow: 'Reserve Now', view: 'View', failedLoad: 'Failed to load Pre-order books', goBack: 'Go back', title: 'Pre-order', booksSummary: '{{count}} books · Reserve upcoming books before release.', searchBooks: 'Search Pre-order books', heroTitle: 'Reserve before release', heroBody: 'Pre-order books may have limited stock. Reserve early and check payment details before confirming.', searchPlaceholder: 'Search pre-order books or authors', clearSearch: 'Clear search', type: 'TYPE', reserve: 'Reserve', status: 'STATUS', open: 'Open', stock: 'STOCK', limited: 'Limited', noBooks: 'No pre-order books found', noBooksBody: 'Try another search or check Pre-order again later.', backMall: 'Back to Shadow Mall', previous: 'Previous', pageOf: 'Page {{page}} / {{total}}', next: 'Next' },
  km: { latest: 'ថ្មីបំផុត', releaseSoon: 'ចេញឆាប់ៗ', priceLow: 'តម្លៃទាប', priceHigh: 'តម្លៃខ្ពស់', soldOut: 'អស់ស្តុក', preOrder: 'កក់មុន', untitledBook: 'សៀវភៅគ្មានចំណងជើង', unknownAuthor: 'មិនស្គាល់អ្នកនិពន្ធ', removeSaved: 'ដកចេញពីការរក្សាទុក', save: 'រក្សាទុក', reserveBook: 'កក់ {{title}}', featured: 'ពិសេស', preOrderOpen: 'កំពុងទទួលកក់មុន', featuredBody: 'កក់សៀវភៅដែលនឹងចេញនេះមុនថ្ងៃចេញ។ ស្តុកកក់មុនអាចមានកំណត់ និងអាចបិទមុន។', reserveNow: 'កក់ឥឡូវនេះ', view: 'មើល', failedLoad: 'មិនអាចផ្ទុកសៀវភៅកក់មុនបានទេ', goBack: 'ត្រឡប់ក្រោយ', title: 'កក់មុន', booksSummary: '{{count}} សៀវភៅ · កក់សៀវភៅដែលនឹងចេញមុនស្តុកបិទ។', searchBooks: 'ស្វែងរកសៀវភៅកក់មុន', heroTitle: 'កក់មុនថ្ងៃចេញ', heroBody: 'សៀវភៅកក់មុនអាចមានស្តុកកំណត់។ កក់ឱ្យបានមុន និងពិនិត្យព័ត៌មានទូទាត់មុនបញ្ជាក់។', searchPlaceholder: 'ស្វែងរកសៀវភៅកក់មុន ឬអ្នកនិពន្ធ', clearSearch: 'សម្អាតការស្វែងរក', type: 'ប្រភេទ', reserve: 'កក់', status: 'ស្ថានភាព', open: 'បើក', stock: 'ស្តុក', limited: 'មានកំណត់', noBooks: 'រកមិនឃើញសៀវភៅកក់មុន', noBooksBody: 'សាកស្វែងរកផ្សេង ឬត្រឡប់មកមើលសៀវភៅកក់មុនពេលក្រោយ។', backMall: 'ត្រឡប់ទៅ Shadow Mall', previous: 'មុន', pageOf: 'ទំព័រ {{page}} / {{total}}', next: 'បន្ទាប់' },
  zh: { latest: '最新', releaseSoon: '即将发售', priceLow: '价格从低到高', priceHigh: '价格从高到低', soldOut: '售罄', preOrder: '预购', untitledBook: '无标题图书', unknownAuthor: '未知作者', removeSaved: '取消收藏', save: '收藏', reserveBook: '预订 {{title}}', featured: '精选', preOrderOpen: '预购开放中', featuredBody: '在发售前预订这本即将上市的书。预购库存可能有限，并可能提前关闭。', reserveNow: '立即预订', view: '查看', failedLoad: '无法加载预购图书', goBack: '返回', title: '预购', booksSummary: '{{count}} 本书 · 在库存关闭前预订即将发售的图书。', searchBooks: '搜索预购图书', heroTitle: '发售前预订', heroBody: '预购图书库存可能有限，请尽早预订并在确认前检查付款详情。', searchPlaceholder: '搜索预购图书或作者', clearSearch: '清除搜索', type: '类型', reserve: '预订', status: '状态', open: '开放', stock: '库存', limited: '有限', noBooks: '未找到预购图书', noBooksBody: '请尝试其他搜索，或稍后再查看预购图书。', backMall: '返回 Shadow Mall', previous: '上一页', pageOf: '第 {{page}} / {{total}} 页', next: '下一页' },
  ja: { latest: '最新', releaseSoon: '発売間近', priceLow: '価格の安い順', priceHigh: '価格の高い順', soldOut: '売り切れ', preOrder: '予約注文', untitledBook: '無題の本', unknownAuthor: '不明な作者', removeSaved: '保存を解除', save: '保存', reserveBook: '{{title}}を予約', featured: '注目', preOrderOpen: '予約受付中', featuredBody: '発売前にこの本を予約できます。予約在庫には限りがあり、早期終了する場合があります。', reserveNow: '今すぐ予約', view: '見る', failedLoad: '予約本を読み込めませんでした', goBack: '戻る', title: '予約注文', booksSummary: '{{count}}冊 · 在庫受付終了前に発売予定の本を予約できます。', searchBooks: '予約本を検索', heroTitle: '発売前に予約', heroBody: '予約本は在庫に限りがあります。早めに予約し、確定前に支払い情報を確認してください。', searchPlaceholder: '予約本または作者を検索', clearSearch: '検索をクリア', type: 'タイプ', reserve: '予約', status: '状態', open: '受付中', stock: '在庫', limited: '限定', noBooks: '予約本が見つかりません', noBooksBody: '別の検索を試すか、後でもう一度予約本を確認してください。', backMall: 'Shadow Mall に戻る', previous: '前へ', pageOf: '{{page}} / {{total}} ページ', next: '次へ' },
  ko: { latest: '최신순', releaseSoon: '출시 임박', priceLow: '낮은 가격순', priceHigh: '높은 가격순', soldOut: '품절', preOrder: '예약 주문', untitledBook: '제목 없는 도서', unknownAuthor: '알 수 없는 작가', removeSaved: '저장 취소', save: '저장', reserveBook: '{{title}} 예약', featured: '추천', preOrderOpen: '예약 주문 가능', featuredBody: '출시 전에 이 도서를 예약하세요. 예약 재고는 한정될 수 있으며 조기 마감될 수 있습니다.', reserveNow: '지금 예약', view: '보기', failedLoad: '예약 도서를 불러오지 못했습니다', goBack: '뒤로', title: '예약 주문', booksSummary: '{{count}}권 · 재고 마감 전에 출시 예정 도서를 예약하세요.', searchBooks: '예약 도서 검색', heroTitle: '출시 전에 예약', heroBody: '예약 도서는 재고가 한정될 수 있습니다. 일찍 예약하고 확인 전에 결제 정보를 확인하세요.', searchPlaceholder: '예약 도서 또는 작가 검색', clearSearch: '검색 지우기', type: '유형', reserve: '예약', status: '상태', open: '예약 가능', stock: '재고', limited: '한정', noBooks: '예약 도서를 찾을 수 없습니다', noBooksBody: '다른 검색을 시도하거나 나중에 예약 도서를 다시 확인하세요.', backMall: 'Shadow Mall로 돌아가기', previous: '이전', pageOf: '{{page}} / {{total}} 페이지', next: '다음' },
})

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const sortOptions = [
  { key: 'latest', labelKey: 'latest' },
  { key: 'release_soon', labelKey: 'releaseSoon' },
  { key: 'price_low', labelKey: 'priceLow' },
  { key: 'price_high', labelKey: 'priceHigh' },
]

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return new Intl.NumberFormat(getDisplayLanguageId(), { style: 'currency', currency: 'USD' }).format(0)
  return new Intl.NumberFormat(getDisplayLanguageId(), { style: 'currency', currency: 'USD' }).format(number)
}

function getProductStatus(product) {
  const status = String(product.status || 'pre_order').toLowerCase()

  if (status === 'sold_out') {
    return {
      label: getDisplayText('shadowMallPreOrderPage.soldOut'),
      className: 'bg-[#f1f5f9] text-[#64748b] dark:bg-slate-500/15 dark:text-slate-300',
      disabled: true,
      coverClass: 'opacity-60',
    }
  }

  return {
    label: getDisplayText('shadowMallPreOrderPage.preOrder'),
    className: 'bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300',
    disabled: false,
    coverClass: '',
  }
}

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || getDisplayText('shadowMallPreOrderPage.untitledBook'),
    author: product.author_name || getDisplayText('shadowMallPreOrderPage.unknownAuthor'),
    cover: product.cover_url || '',
    category: product.category || 'pre_order',
    priceValue: Number(product.price_usd || 0),
    oldPriceValue: product.old_price_usd === null ? 0 : Number(product.old_price_usd || 0),
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'pre_order',
    createdAt: product.created_at || '',
    releaseText: product.release_date || product.release_at || product.available_at || '',
  }
}

function ProductCard({ product, onOpen }) {
  const { t } = useDisplayTranslation()
  const status = getProductStatus(product)
  const hasOldPrice = Boolean(String(product.oldPrice || '').trim())
  const [wishlisted, setWishlisted] = useState(() => isShadowMallWishlisted(product.id))

  useEffect(() => {
    const refreshWishlist = () => {
      setWishlisted(isShadowMallWishlisted(product.id))
    }

    window.addEventListener('shadow-mall-wishlist-change', refreshWishlist)
    window.addEventListener('storage', refreshWishlist)
    window.addEventListener('focus', refreshWishlist)

    return () => {
      window.removeEventListener('shadow-mall-wishlist-change', refreshWishlist)
      window.removeEventListener('storage', refreshWishlist)
      window.removeEventListener('focus', refreshWishlist)
    }
  }, [product.id])

  function handleWishlistClick(event) {
    event.stopPropagation()
    const result = toggleShadowMallWishlist(product)
    setWishlisted(result.wishlisted)
  }

  return (
    <article className="overflow-hidden rounded-[22px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[2/3] overflow-hidden bg-[var(--shadow-bg-soft)]">
          {product.cover ? (
            <img
              src={product.cover}
              alt={product.title}
              className={`h-full w-full object-cover transition duration-300 hover:scale-[1.03] ${status.coverClass}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[22px]" />
            </div>
          )}

          <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-extrabold shadow-sm ${status.className}`}>
            {status.label}
          </span>

          <span className="absolute bottom-2 left-2 rounded-full bg-[#111827] px-2.5 py-1 text-[9px] font-extrabold text-white shadow-sm dark:bg-white dark:text-[#111827]">
            RESERVE
          </span>

          <button
            type="button"
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm active:scale-95 dark:bg-black/70 ${
              wishlisted ? 'text-[#e5484d] dark:text-red-300' : 'text-[#111827] dark:text-white'
            }`}
            aria-label={`${t(`shadowMallPreOrderPage.${wishlisted ? 'removeSaved' : 'save'}`)} ${product.title}`}
            onClick={handleWishlistClick}
          >
            <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[13px]`} />
          </button>
        </div>
      </button>

      <div className="p-3">
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-extrabold leading-[19px] text-[var(--shadow-text-primary)]">
            {product.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
            {product.author}
          </p>
        </button>

        <div className="mt-3 flex items-end justify-between gap-2">
          <button type="button" onClick={onOpen} className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#e5484d]">
              {product.price}
            </div>

            {hasOldPrice ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                {product.oldPrice}
              </div>
            ) : null}
          </button>

          <button
            type="button"
            disabled={status.disabled}
            onClick={(event) => {
              event.stopPropagation()
              if (status.disabled) return
              addShadowMallCartItem(product, 1)
            }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:scale-95 ${
              status.disabled
                ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]'
                : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
            }`}
            aria-label={t('shadowMallPreOrderPage.reserveBook', { title: product.title })}
          >
            <i className="fa-solid fa-bookmark text-[12px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

function FeaturedPreOrder({ product, onOpen }) {
  const { t } = useDisplayTranslation()
  if (!product) return null

  return (
    <section className="overflow-hidden rounded-[28px] bg-[#111827] p-4 text-white shadow-sm dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)] dark:ring-1 dark:ring-[var(--shadow-border)]">
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
        <button
          type="button"
          onClick={onOpen}
          className="relative mx-auto aspect-[2/3] w-[42%] min-w-[132px] overflow-hidden rounded-[22px] bg-white/10 dark:bg-white/5 md:w-full"
        >
          {product.cover ? (
            <img
              src={product.cover}
              alt={product.title}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/50 dark:text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[28px]" />
            </div>
          )}

          <span className="absolute left-2 top-2 rounded-full bg-[#fff7d8] px-2.5 py-1 text-[9px] font-extrabold text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
            {t('shadowMallPreOrderPage.featured')}
          </span>
        </button>

        <div className="min-w-0 text-center md:text-left">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold text-[#fff7d8] dark:bg-amber-500/10 dark:text-amber-300">
            {t('shadowMallPreOrderPage.preOrderOpen')}
          </div>

          <h2 className="mt-3 text-[22px] font-extrabold leading-7">
            {product.title}
          </h2>

          <p className="mt-2 line-clamp-1 text-[12px] font-semibold text-white/65 dark:text-[var(--shadow-text-secondary)]">
            {product.author}
          </p>

          <p className="mt-3 text-[12px] font-semibold leading-5 text-white/70 dark:text-[var(--shadow-text-secondary)]">
            {t('shadowMallPreOrderPage.featuredBody')}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <div>
              <div className="text-[18px] font-extrabold text-[#fff7d8] dark:text-amber-300">{product.price}</div>
              {product.oldPrice ? (
                <div className="text-[11px] font-semibold text-white/45 line-through dark:text-[var(--shadow-text-tertiary)]">{product.oldPrice}</div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => addShadowMallCartItem(product, 1)}
              className="rounded-full bg-white px-5 py-3 text-[12px] font-extrabold text-[#111827] active:scale-95"
            >
              {t('shadowMallPreOrderPage.reserveNow')}
            </button>

            <button
              type="button"
              onClick={onOpen}
              className="rounded-full bg-white/10 px-5 py-3 text-[12px] font-extrabold text-white active:scale-95 dark:bg-[var(--shadow-bg-soft)] dark:text-[var(--shadow-text-primary)]"
            >
              {t('shadowMallPreOrderPage.view')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ShadowMallPreOrderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  async function loadProducts(options = {}) {
    const nextPage = options.page || page
    const nextSearch = options.search ?? search

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        section: 'pre_order',
        page: String(nextPage),
        limit: '24',
        search: nextSearch.trim(),
      })

      const response = await fetch(`${API_URL}/api/shadow-mall/products?${params.toString()}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('shadowMallPreOrderPage.failedLoad'))
      }

      setProducts((data.products || []).map(normalizeProduct))
      setMeta({
        total: data.total || 0,
        total_pages: data.total_pages || 1,
        has_next: nextPage < (data.total_pages || 1),
        has_prev: nextPage > 1,
      })
    } catch (error) {
      setProducts([])
      setMessage(error.message || t('shadowMallPreOrderPage.failedLoad'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts({ page, search })
  }, [page])

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products]

    if (sort === 'price_low') {
      nextProducts.sort((a, b) => a.priceValue - b.priceValue)
    }

    if (sort === 'price_high') {
      nextProducts.sort((a, b) => b.priceValue - a.priceValue)
    }

    if (sort === 'release_soon') {
      nextProducts.sort((a, b) => String(a.releaseText || a.createdAt).localeCompare(String(b.releaseText || b.createdAt)))
    }

    if (sort === 'latest') {
      nextProducts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    }

    return nextProducts
  }, [products, sort])

  const featuredProduct = sortedProducts[0]

  function handleSearchSubmit(event) {
    event.preventDefault()
    setPage(1)
    loadProducts({ page: 1, search })
  }

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
  if (location.state?.returnTo) {
    navigate(-1)
    return
  }

  navigate('/shop', { replace: true })
}}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallPreOrderPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="line-clamp-1 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallPreOrderPage.title')}</h1>
            <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
              {t('shadowMallPreOrderPage.booksSummary', { count: Number(meta.total || 0).toLocaleString(getDisplayLanguageId()) })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallPreOrderPage.searchBooks')}
          >
            <i className="fa-solid fa-magnifying-glass text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-4">
        <section className="mb-3 overflow-hidden rounded-[24px] bg-[#fff7d8] px-4 py-4 shadow-sm ring-1 ring-[#f6d56f]/50 dark:bg-amber-500/10 dark:ring-amber-400/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white/85 text-[#7a5600] dark:bg-amber-400/10 dark:text-amber-300">
              <i className="fa-solid fa-calendar-check text-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">
                {t('shadowMallPreOrderPage.heroTitle')}
              </h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#7a5600]/80 dark:text-amber-200/80">
                {t('shadowMallPreOrderPage.heroBody')}
              </p>
            </div>
          </div>
        </section>

        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="flex items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-3">
              <i className="fa-solid fa-magnifying-glass text-[14px] text-[var(--shadow-text-secondary)]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('shadowMallPreOrderPage.searchPlaceholder')}
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPage(1)
                    loadProducts({ page: 1, search: '' })
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]"
                  aria-label={t('shadowMallPreOrderPage.clearSearch')}
                >
                  <i className="fa-solid fa-xmark text-[12px]" />
                </button>
              ) : null}
            </div>
          </form>
        ) : null}

        {featuredProduct ? (
          <div className="mt-4">
            <FeaturedPreOrder
              product={featuredProduct}
              onOpen={() =>
  navigate(`/shop/mall/product/${featuredProduct.id}`, {
    state: { from: location.pathname + location.search + location.hash },
  })
}
            />
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] px-3 py-3 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="text-[9px] font-bold text-[var(--shadow-text-tertiary)]">{t('shadowMallPreOrderPage.type')}</div>
            <div className="mt-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallPreOrderPage.reserve')}</div>
          </div>
          <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] px-3 py-3 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="text-[9px] font-bold text-[var(--shadow-text-tertiary)]">{t('shadowMallPreOrderPage.status')}</div>
            <div className="mt-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallPreOrderPage.open')}</div>
          </div>
          <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] px-3 py-3 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="text-[9px] font-bold text-[var(--shadow-text-tertiary)]">{t('shadowMallPreOrderPage.stock')}</div>
            <div className="mt-1 text-[11px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallPreOrderPage.limited')}</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sortOptions.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSort(item.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold active:scale-95 ${
                sort === item.key
                  ? 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
                  : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
              }`}
            >
              {t(`shadowMallPreOrderPage.${item.labelKey}`)}
            </button>
          ))}
        </div>

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        {loading && !products.length ? (
          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] animate-pulse rounded-[22px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]" />
            ))}
          </section>
        ) : sortedProducts.length ? (
          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={() =>
  navigate(`/shop/mall/product/${product.id}`, {
    state: { from: location.pathname + location.search + location.hash },
  })
}
              />
            ))}
          </section>
        ) : (
          <section className="mt-4 rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-calendar-check text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallPreOrderPage.noBooks')}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t('shadowMallPreOrderPage.noBooksBody')}
            </p>
            <button
              type="button"
              onClick={() => {
  if (location.state?.returnTo) {
    navigate(-1)
    return
  }

  navigate('/shop', { replace: true })
}}
              className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallPreOrderPage.backMall')}
            </button>
          </section>
        )}

        {sortedProducts.length ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
            <button
              type="button"
              disabled={!meta.has_prev}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              className="rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-extrabold text-[var(--shadow-text-primary)] disabled:text-[var(--shadow-text-disabled)]"
            >
              {t('shadowMallPreOrderPage.previous')}
            </button>

            <div className="text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              {t('shadowMallPreOrderPage.pageOf', { page: Number(page).toLocaleString(getDisplayLanguageId()), total: Number(meta.total_pages || 1).toLocaleString(getDisplayLanguageId()) })}
            </div>

            <button
              type="button"
              disabled={!meta.has_next}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallPreOrderPage.next')}
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}

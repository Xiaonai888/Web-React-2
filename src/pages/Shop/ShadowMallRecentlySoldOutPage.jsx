import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallRecentlySoldOutPage', {
  en: { "latestSoldOut": "Latest Sold Out", "priceLow": "Price Low", "priceHigh": "Price High", "untitledBook": "Untitled book", "unknownAuthor": "Unknown author", "soldOut": "SOLD OUT", "recentlySold": "RECENTLY SOLD", "removeSaved": "Remove saved", "save": "Save", "soldOutAria": "{{title}} is sold out", "failedLoad": "Failed to load Recently Sold Out books", "goBack": "Go back", "title": "Recently Sold Out", "booksSummary": "{{count}} books · Popular books that sold out recently.", "searchBooks": "Search Recently Sold Out books", "heroTitle": "{t('shadowMallRecentlySoldOutPage.heroTitle')}", "heroBody": "{t('shadowMallRecentlySoldOutPage.heroBody')}", "searchPlaceholder": "Search sold out books or authors", "clearSearch": "Clear search", "noBooks": "No sold out books found", "noBooksBody": "{t('shadowMallRecentlySoldOutPage.noBooksBody')}", "backMall": "Back to Shadow Mall", "previous": "Previous", "pageOf": "Page {{page}} / {{total}}", "next": "Next" },
  km: { "latestSoldOut": "អស់ស្តុកថ្មីបំផុត", "priceLow": "តម្លៃទាប", "priceHigh": "តម្លៃខ្ពស់", "untitledBook": "សៀវភៅគ្មានចំណងជើង", "unknownAuthor": "មិនស្គាល់អ្នកនិពន្ធ", "soldOut": "អស់ស្តុក", "recentlySold": "ទើបលក់អស់", "removeSaved": "ដកចេញពីការរក្សាទុក", "save": "រក្សាទុក", "soldOutAria": "{{title}} អស់ស្តុក", "failedLoad": "មិនអាចផ្ទុកសៀវភៅដែលទើបអស់ស្តុកបានទេ", "goBack": "ត្រឡប់ក្រោយ", "title": "ទើបអស់ស្តុក", "booksSummary": "{{count}} សៀវភៅ · សៀវភៅពេញនិយមដែលទើបអស់ស្តុក។", "searchBooks": "ស្វែងរកសៀវភៅដែលទើបអស់ស្តុក", "heroTitle": "សៀវភៅពេញនិយមដែលលក់អស់លឿន", "heroBody": "សៀវភៅទាំងនេះកំពុងអស់ស្តុក។ រក្សាទុកក្នុង Wishlist ហើយត្រឡប់មកពិនិត្យពេលមានស្តុកវិញ។", "searchPlaceholder": "ស្វែងរកសៀវភៅអស់ស្តុក ឬអ្នកនិពន្ធ", "clearSearch": "សម្អាតការស្វែងរក", "noBooks": "រកមិនឃើញសៀវភៅអស់ស្តុក", "noBooksBody": "សាកស្វែងរកផ្សេង ឬត្រឡប់មកពិនិត្យម្តងទៀតពេលក្រោយ។", "backMall": "ត្រឡប់ទៅ Shadow Mall", "previous": "មុន", "pageOf": "ទំព័រ {{page}} / {{total}}", "next": "បន្ទាប់" },
  zh: { "latestSoldOut": "最新售罄", "priceLow": "价格从低到高", "priceHigh": "价格从高到低", "untitledBook": "无标题图书", "unknownAuthor": "未知作者", "soldOut": "售罄", "recentlySold": "最近售罄", "removeSaved": "取消收藏", "save": "收藏", "soldOutAria": "{{title}} 已售罄", "failedLoad": "无法加载最近售罄图书", "goBack": "返回", "title": "最近售罄", "booksSummary": "{{count}} 本书 · 最近售罄的热门图书。", "searchBooks": "搜索最近售罄图书", "heroTitle": "很快售罄的热门图书", "heroBody": "这些图书目前已售罄。收藏到愿望清单，并在补货后再次查看。", "searchPlaceholder": "搜索售罄图书或作者", "clearSearch": "清除搜索", "noBooks": "未找到售罄图书", "noBooksBody": "请尝试其他搜索，或稍后再查看最近售罄。", "backMall": "返回 Shadow Mall", "previous": "上一页", "pageOf": "第 {{page}} / {{total}} 页", "next": "下一页" },
  ja: { "latestSoldOut": "最近の売り切れ", "priceLow": "価格の安い順", "priceHigh": "価格の高い順", "untitledBook": "無題の本", "unknownAuthor": "不明な作者", "soldOut": "売り切れ", "recentlySold": "最近売り切れ", "removeSaved": "保存を解除", "save": "保存", "soldOutAria": "{{title}} は売り切れです", "failedLoad": "最近売り切れた本を読み込めませんでした", "goBack": "戻る", "title": "最近売り切れ", "booksSummary": "{{count}}冊 · 最近売り切れた人気の本です。", "searchBooks": "最近売り切れた本を検索", "heroTitle": "すぐに売り切れた人気の本", "heroBody": "これらの本は現在売り切れです。ウィッシュリストに保存して、再入荷時に確認してください。", "searchPlaceholder": "売り切れた本または作者を検索", "clearSearch": "検索をクリア", "noBooks": "売り切れた本が見つかりません", "noBooksBody": "別の検索を試すか、後でもう一度確認してください。", "backMall": "Shadow Mall に戻る", "previous": "前へ", "pageOf": "{{page}} / {{total}} ページ", "next": "次へ" },
  ko: { "latestSoldOut": "최근 품절순", "priceLow": "낮은 가격순", "priceHigh": "높은 가격순", "untitledBook": "제목 없는 도서", "unknownAuthor": "알 수 없는 작가", "soldOut": "품절", "recentlySold": "최근 품절", "removeSaved": "저장 취소", "save": "저장", "soldOutAria": "{{title}}은(는) 품절입니다", "failedLoad": "최근 품절 도서를 불러오지 못했습니다", "goBack": "뒤로", "title": "최근 품절", "booksSummary": "{{count}}권 · 최근 품절된 인기 도서입니다.", "searchBooks": "최근 품절 도서 검색", "heroTitle": "빠르게 품절된 인기 도서", "heroBody": "현재 품절된 도서입니다. 위시리스트에 저장하고 재입고되면 다시 확인하세요.", "searchPlaceholder": "품절 도서 또는 작가 검색", "clearSearch": "검색 지우기", "noBooks": "품절 도서를 찾을 수 없습니다", "noBooksBody": "다른 검색을 시도하거나 나중에 다시 확인하세요.", "backMall": "Shadow Mall로 돌아가기", "previous": "이전", "pageOf": "{{page}} / {{total}} 페이지", "next": "다음" },
})

import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const sortOptions = [
  { key: 'latest', labelKey: 'latestSoldOut' },
  { key: 'price_low', labelKey: 'priceLow' },
  { key: 'price_high', labelKey: 'priceHigh' },
]

function formatUsd(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(number) ? number : 0)
}

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || getDisplayText('shadowMallRecentlySoldOutPage.untitledBook'),
    author: product.author_name || getDisplayText('shadowMallRecentlySoldOutPage.unknownAuthor'),
    cover: product.cover_url || '',
    category: product.category || 'sold_out',
    priceValue: Number(product.price_usd || 0),
    oldPriceValue: product.old_price_usd === null ? 0 : Number(product.old_price_usd || 0),
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'sold_out',
    createdAt: product.created_at || '',
  }
}

function ProductCard({ product, onOpen }) {
  const { t } = useDisplayTranslation()
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
              className="h-full w-full object-cover opacity-60 grayscale-[20%] transition duration-300 hover:scale-[1.03]"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[22px]" />
            </div>
          )}

          <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

          <span className="absolute left-2 top-2 rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[9px] font-extrabold text-[#64748b] shadow-sm dark:bg-slate-500/15 dark:text-slate-300">
            {t('shadowMallRecentlySoldOutPage.soldOut')}
          </span>

          <span className="absolute bottom-2 left-2 rounded-full bg-[#111827] px-2.5 py-1 text-[9px] font-extrabold text-white shadow-sm dark:bg-white dark:text-[#111827]">
            {t('shadowMallRecentlySoldOutPage.recentlySold')}
          </span>

          <button
            type="button"
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm active:scale-95 dark:bg-black/70 ${
              wishlisted ? 'text-[#e5484d] dark:text-red-300' : 'text-[#111827] dark:text-white'
            }`}
            aria-label={`${t(`shadowMallRecentlySoldOutPage.${wishlisted ? 'removeSaved' : 'save'}`)} ${product.title}`}
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
            <div className="text-[13px] font-extrabold text-[#64748b]">
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
            disabled
            className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]"
            aria-label={t('shadowMallRecentlySoldOutPage.soldOutAria', { title: product.title })}
          >
            <i className="fa-solid fa-cart-shopping text-[12px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallRecentlySoldOutPage() {
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
        section: 'sold_out',
        page: String(nextPage),
        limit: '24',
        search: nextSearch.trim(),
      })

      const response = await fetch(`${API_URL}/api/shadow-mall/products?${params.toString()}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('shadowMallRecentlySoldOutPage.failedLoad'))
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
      setMessage(error.message || t('shadowMallRecentlySoldOutPage.failedLoad'))
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

    if (sort === 'latest') {
      nextProducts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    }

    return nextProducts
  }, [products, sort])

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
            aria-label={t('shadowMallRecentlySoldOutPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="line-clamp-1 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallRecentlySoldOutPage.title')}</h1>
            <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
              {t('shadowMallRecentlySoldOutPage.booksSummary', { count: Number(meta.total).toLocaleString(getDisplayLanguageId()) })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallRecentlySoldOutPage.searchBooks')}
          >
            <i className="fa-solid fa-magnifying-glass text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-4">
        <section className="mb-3 overflow-hidden rounded-[24px] bg-[#f1f5f9] px-4 py-4 shadow-sm ring-1 ring-[#e2e8f0] dark:bg-slate-500/10 dark:ring-slate-400/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white text-[#64748b] dark:bg-slate-400/10 dark:text-slate-300">
              <i className="fa-solid fa-box-open text-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">
                {t('shadowMallRecentlySoldOutPage.heroTitle')}
              </h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('shadowMallRecentlySoldOutPage.heroBody')}
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
                placeholder={t('shadowMallRecentlySoldOutPage.searchPlaceholder')}
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
                  aria-label={t('shadowMallRecentlySoldOutPage.clearSearch')}
                >
                  <i className="fa-solid fa-xmark text-[12px]" />
                </button>
              ) : null}
            </div>
          </form>
        ) : null}

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
              {t(`shadowMallRecentlySoldOutPage.${item.labelKey}`)}
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
              <i className="fa-solid fa-box-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallRecentlySoldOutPage.noBooks')}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t('shadowMallRecentlySoldOutPage.noBooksBody')}
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
              {t('shadowMallRecentlySoldOutPage.backMall')}
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
              {t('shadowMallRecentlySoldOutPage.previous')}
            </button>

            <div className="text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              {t('shadowMallRecentlySoldOutPage.pageOf', { page: Number(page).toLocaleString(getDisplayLanguageId()), total: Number(meta.total_pages).toLocaleString(getDisplayLanguageId()) })}
            </div>

            <button
              type="button"
              disabled={!meta.has_next}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallRecentlySoldOutPage.next')}
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}

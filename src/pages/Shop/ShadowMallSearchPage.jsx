import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { addShadowMallCartItem } from '../../utils/shadowMallCart'
import {
  isShadowMallWishlisted,
  toggleShadowMallWishlist,
} from '../../utils/shadowMallWishlist'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallSearchPage', {
  en: { untitledBook: 'Untitled book', unknownAuthor: 'Unknown author', removeSaved: 'Remove saved', save: 'Save', addToCart: 'Add {{title}} to cart', book: '{{count}} book', books: '{{count}} books', failedPublishers: 'Failed to load publishers', failedSearch: 'Failed to search books', publisherBooks: '{{publisher}} books', searchHint: 'Search by title, author, or browse by publisher.', searching: 'Searching...', resultOne: '{{count}} result found', resultMany: '{{count}} results found', noResults: 'No results found', goBack: 'Go back', title: 'Search Books', searchPlaceholder: 'Search books or authors', clearSearch: 'Clear search', browsePublisher: 'Browse by Publisher', choosePublisher: 'Choose a publisher to view their books.', noPublishers: 'No publishers yet', noPublishersBody: 'Publishers will appear here after admin creates them.', selectedPublisher: 'Selected publisher', clear: 'Clear', noBooks: 'No books found', noBooksBody: 'Try another title, author, or publisher.' },
  km: { untitledBook: 'សៀវភៅគ្មានចំណងជើង', unknownAuthor: 'មិនស្គាល់អ្នកនិពន្ធ', removeSaved: 'ដកចេញពីការរក្សាទុក', save: 'រក្សាទុក', addToCart: 'បន្ថែម {{title}} ទៅកន្ត្រក', book: '{{count}} សៀវភៅ', books: '{{count}} សៀវភៅ', failedPublishers: 'មិនអាចផ្ទុកអ្នកបោះពុម្ពបានទេ', failedSearch: 'មិនអាចស្វែងរកសៀវភៅបានទេ', publisherBooks: 'សៀវភៅរបស់ {{publisher}}', searchHint: 'ស្វែងរកតាមចំណងជើង អ្នកនិពន្ធ ឬមើលតាមអ្នកបោះពុម្ព។', searching: 'កំពុងស្វែងរក...', resultOne: 'រកឃើញ {{count}} លទ្ធផល', resultMany: 'រកឃើញ {{count}} លទ្ធផល', noResults: 'រកមិនឃើញលទ្ធផល', goBack: 'ត្រឡប់ក្រោយ', title: 'ស្វែងរកសៀវភៅ', searchPlaceholder: 'ស្វែងរកសៀវភៅ ឬអ្នកនិពន្ធ', clearSearch: 'សម្អាតការស្វែងរក', browsePublisher: 'មើលតាមអ្នកបោះពុម្ព', choosePublisher: 'ជ្រើសអ្នកបោះពុម្ពដើម្បីមើលសៀវភៅរបស់ពួកគេ។', noPublishers: 'មិនទាន់មានអ្នកបោះពុម្ព', noPublishersBody: 'អ្នកបោះពុម្ពនឹងបង្ហាញនៅទីនេះបន្ទាប់ពី Admin បង្កើត។', selectedPublisher: 'អ្នកបោះពុម្ពដែលបានជ្រើស', clear: 'សម្អាត', noBooks: 'រកមិនឃើញសៀវភៅ', noBooksBody: 'សាកចំណងជើង អ្នកនិពន្ធ ឬអ្នកបោះពុម្ពផ្សេង។' },
  zh: { untitledBook: '无标题图书', unknownAuthor: '未知作者', removeSaved: '取消收藏', save: '收藏', addToCart: '将 {{title}} 加入购物车', book: '{{count}} 本书', books: '{{count}} 本书', failedPublishers: '无法加载出版社', failedSearch: '无法搜索图书', publisherBooks: '{{publisher}} 的图书', searchHint: '按书名、作者搜索，或按出版社浏览。', searching: '搜索中...', resultOne: '找到 {{count}} 个结果', resultMany: '找到 {{count}} 个结果', noResults: '未找到结果', goBack: '返回', title: '搜索图书', searchPlaceholder: '搜索图书或作者', clearSearch: '清除搜索', browsePublisher: '按出版社浏览', choosePublisher: '选择出版社查看其图书。', noPublishers: '暂无出版社', noPublishersBody: '管理员创建出版社后会显示在这里。', selectedPublisher: '已选出版社', clear: '清除', noBooks: '未找到图书', noBooksBody: '请尝试其他书名、作者或出版社。' },
  ja: { untitledBook: '無題の本', unknownAuthor: '不明な作者', removeSaved: '保存を解除', save: '保存', addToCart: '{{title}}をカートに追加', book: '{{count}}冊', books: '{{count}}冊', failedPublishers: '出版社を読み込めませんでした', failedSearch: '本を検索できませんでした', publisherBooks: '{{publisher}}の本', searchHint: 'タイトルや作者で検索するか、出版社から探せます。', searching: '検索中...', resultOne: '{{count}}件の結果', resultMany: '{{count}}件の結果', noResults: '結果が見つかりません', goBack: '戻る', title: '本を検索', searchPlaceholder: '本または作者を検索', clearSearch: '検索をクリア', browsePublisher: '出版社から探す', choosePublisher: '出版社を選んで本を表示します。', noPublishers: '出版社はまだありません', noPublishersBody: '管理者が出版社を作成するとここに表示されます。', selectedPublisher: '選択した出版社', clear: 'クリア', noBooks: '本が見つかりません', noBooksBody: '別のタイトル、作者、出版社を試してください。' },
  ko: { untitledBook: '제목 없는 도서', unknownAuthor: '알 수 없는 작가', removeSaved: '저장 취소', save: '저장', addToCart: '{{title}} 장바구니에 추가', book: '{{count}}권', books: '{{count}}권', failedPublishers: '출판사를 불러오지 못했습니다', failedSearch: '도서를 검색하지 못했습니다', publisherBooks: '{{publisher}} 도서', searchHint: '제목이나 작가로 검색하거나 출판사별로 둘러보세요.', searching: '검색 중...', resultOne: '{{count}}개 결과', resultMany: '{{count}}개 결과', noResults: '검색 결과가 없습니다', goBack: '뒤로', title: '도서 검색', searchPlaceholder: '도서 또는 작가 검색', clearSearch: '검색 지우기', browsePublisher: '출판사별 보기', choosePublisher: '출판사를 선택해 해당 도서를 확인하세요.', noPublishers: '아직 출판사가 없습니다', noPublishersBody: '관리자가 출판사를 만들면 여기에 표시됩니다.', selectedPublisher: '선택한 출판사', clear: '지우기', noBooks: '도서를 찾을 수 없습니다', noBooksBody: '다른 제목, 작가 또는 출판사를 시도해 보세요.' },
})

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return new Intl.NumberFormat(getDisplayLanguageId(), { style: 'currency', currency: 'USD' }).format(0)
  return new Intl.NumberFormat(getDisplayLanguageId(), { style: 'currency', currency: 'USD' }).format(number)
}

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || getDisplayText('shadowMallSearchPage.untitledBook'),
    author: product.author_name || getDisplayText('shadowMallSearchPage.unknownAuthor'),
    publisher: product.publisher || '',
    cover: product.cover_url || '',
    price: formatUsd(product.price_usd),
    oldPrice: product.old_price_usd ? formatUsd(product.old_price_usd) : '',
    status: product.stock_status || 'in_stock',
  }
}

function isSoldOut(product) {
  return String(product.status || '').toLowerCase() === 'sold_out'
}

function SearchResultItem({ product, onOpen }) {
  const { t } = useDisplayTranslation()
  const soldOut = isSoldOut(product)
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
    <article className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[var(--shadow-bg-soft)]"
        >
          {product.cover ? (
            <img
              src={product.cover}
              alt={product.title}
              className={`h-full w-full object-cover ${soldOut ? 'opacity-60' : ''}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[18px]" />
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <button type="button" onClick={onOpen} className="min-w-0 text-left">
              <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[var(--shadow-text-primary)]">
                {product.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
                {product.author}
              </p>
              {product.publisher ? (
                <p className="mt-1 line-clamp-1 text-[10.5px] font-extrabold text-[#7a5600] dark:text-amber-300">
                  {product.publisher}
                </p>
              ) : null}
            </button>

            <button
              type="button"
              onClick={handleWishlistClick}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] active:scale-95 ${
                wishlisted ? 'text-[#e5484d] dark:text-red-300' : 'text-[var(--shadow-text-primary)]'
              }`}
              aria-label={`${t(`shadowMallSearchPage.${wishlisted ? 'removeSaved' : 'save'}`)} ${product.title}`}
            >
              <i className={`${wishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-[12px]`} />
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <button type="button" onClick={onOpen} className="text-left">
              <div className="text-[14px] font-extrabold text-[#e5484d]">{product.price}</div>
              {product.oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                  {product.oldPrice}
                </div>
              ) : null}
            </button>

            <button
              type="button"
              disabled={soldOut}
              onClick={() => {
                if (soldOut) return
                addShadowMallCartItem(product, 1)
              }}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95 ${
                soldOut ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]' : 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
              }`}
              aria-label={t('shadowMallSearchPage.addToCart', { title: product.title })}
            >
              <i className="fa-solid fa-cart-shopping text-[12px]" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function PublisherCard({ publisher, selected, onClick }) {
  const { t } = useDisplayTranslation()
  const bookCount = Number(publisher.book_count || 0)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] px-4 py-4 text-left shadow-sm ring-1 active:scale-[0.99] ${
        selected
          ? 'bg-[#111827] text-white ring-[#111827] dark:bg-white dark:text-[#111827] dark:ring-white'
          : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-[var(--shadow-border)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${
            selected ? 'bg-white/15 text-white dark:bg-black/10 dark:text-[#111827]' : 'bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300'
          }`}
        >
          {publisher.logo_url ? (
            <img
              src={publisher.logo_url}
              alt={publisher.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <i className="fa-solid fa-building text-[15px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[14px] font-extrabold">
            {publisher.name}
          </div>

          <div
            className={`mt-1 text-[11.5px] font-semibold ${
              selected ? 'text-white/65 dark:text-[#111827]/60' : 'text-[var(--shadow-text-secondary)]'
            }`}
          >
            {t(`shadowMallSearchPage.${bookCount === 1 ? 'book' : 'books'}`, { count: bookCount.toLocaleString(getDisplayLanguageId()) })}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function ShadowMallSearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [publishers, setPublishers] = useState([])
  const [selectedPublisher, setSelectedPublisher] = useState('')
  const [loading, setLoading] = useState(false)
  const [publishersLoading, setPublishersLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadPublishers() {
    try {
      setPublishersLoading(true)

      const response = await fetch(`${API_URL}/api/shadow-mall/publishers`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('shadowMallSearchPage.failedPublishers'))
      }

      setPublishers(data.publishers || [])
    } catch {
      setPublishers([])
    } finally {
      setPublishersLoading(false)
    }
  }

  async function searchProducts({ keyword = query, publisher = selectedPublisher } = {}) {
    const cleanKeyword = keyword.trim()
    const cleanPublisher = publisher.trim()

    if (!cleanKeyword && !cleanPublisher) {
      setProducts([])
      setMessage('')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const params = new URLSearchParams({
        section: 'all',
        page: '1',
        limit: '50',
      })

      if (cleanKeyword) params.set('search', cleanKeyword)
      if (cleanPublisher) params.set('publisher', cleanPublisher)

      const response = await fetch(`${API_URL}/api/shadow-mall/products?${params.toString()}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('shadowMallSearchPage.failedSearch'))
      }

      setProducts((data.products || []).map(normalizeProduct))
    } catch (error) {
      setProducts([])
      setMessage(error.message || t('shadowMallSearchPage.failedSearch'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPublishers()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchProducts({ keyword: query, publisher: selectedPublisher })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query, selectedPublisher])

  const hasQuery = query.trim().length > 0
  const hasPublisher = selectedPublisher.trim().length > 0
  const showPublishers = !hasQuery && !hasPublisher

  const helperText = useMemo(() => {
    if (hasPublisher) return t('shadowMallSearchPage.publisherBooks', { publisher: selectedPublisher })
    if (!hasQuery) return t('shadowMallSearchPage.searchHint')
    if (loading) return t('shadowMallSearchPage.searching')
    if (products.length) {
      const count = products.length.toLocaleString(getDisplayLanguageId())
      return t(`shadowMallSearchPage.${products.length === 1 ? 'resultOne' : 'resultMany'}`, { count })
    }
    return t('shadowMallSearchPage.noResults')
  }, [hasQuery, hasPublisher, selectedPublisher, loading, products.length, t])

  function clearAll() {
    setQuery('')
    setSelectedPublisher('')
    setProducts([])
    setMessage('')
  }

  return (
    <div className="app-page min-h-screen pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
  if (location.state?.returnTo || location.state?.from) return navigate(-1)
  navigate('/shop', { replace: true })
}}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallSearchPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="line-clamp-1 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">
              {t('shadowMallSearchPage.title')}
            </h1>
            <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
              {helperText}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-4">
        <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-[14px] text-[var(--shadow-text-secondary)]" />
            <input
              type="text"
              value={query}
              onFocus={() => {
                if (selectedPublisher) setSelectedPublisher('')
              }}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('shadowMallSearchPage.searchPlaceholder')}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
            />
            {query || selectedPublisher ? (
              <button
                type="button"
                onClick={clearAll}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]"
                aria-label={t('shadowMallSearchPage.clearSearch')}
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </section>

        {showPublishers ? (
          <section className="mt-4">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallSearchPage.browsePublisher')}</h2>
                <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  {t('shadowMallSearchPage.choosePublisher')}
                </p>
              </div>
            </div>

            {publishersLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[112px] animate-pulse rounded-[22px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]" />
                ))}
              </div>
            ) : publishers.length ? (
              <div className="grid grid-cols-2 gap-3">
                {publishers.map((publisher) => (
                  <PublisherCard
                    key={publisher.id}
                    publisher={publisher}
                    selected={selectedPublisher === publisher.name}
                    onClick={() => {
                      setQuery('')
                      setSelectedPublisher(publisher.name)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] px-5 py-10 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
                  <i className="fa-solid fa-building text-[22px]" />
                </div>
                <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallSearchPage.noPublishers')}</h2>
                <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
                  {t('shadowMallSearchPage.noPublishersBody')}
                </p>
              </div>
            )}
          </section>
        ) : null}

        {selectedPublisher ? (
          <section className="mt-4 flex items-center justify-between gap-3 rounded-[20px] bg-[#111827] px-4 py-3 text-white shadow-sm dark:bg-white dark:text-[#111827]">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white/60 dark:text-[#111827]/60">{t('shadowMallSearchPage.selectedPublisher')}</div>
              <div className="line-clamp-1 text-[14px] font-extrabold">{selectedPublisher}</div>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full bg-white/12 px-4 py-2 text-[12px] font-extrabold text-white active:scale-95 dark:bg-black/10 dark:text-[#111827]"
            >
              {t('shadowMallSearchPage.clear')}
            </button>
          </section>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        {(hasQuery || hasPublisher) && loading ? (
          <section className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[140px] animate-pulse rounded-[22px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]" />
            ))}
          </section>
        ) : (hasQuery || hasPublisher) && products.length ? (
          <section className="mt-4 space-y-3">
            {products.map((product) => (
              <SearchResultItem
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
        ) : (hasQuery || hasPublisher) ? (
          <section className="mt-4 rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-10 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
              <i className="fa-solid fa-book-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallSearchPage.noBooks')}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
              {t('shadowMallSearchPage.noBooksBody')}
            </p>
          </section>
        ) : null}
      </main>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageSearch', {
  "en": {
    "authorPage": "Author Page",
    "back": "Back",
    "searchName": "Search {{name}}",
    "clearSearch": "Clear search",
    "allCount": "All {{count}}",
    "postsCount": "Posts {{count}}",
    "worksCount": "Works {{count}}",
    "storeCount": "Store {{count}}",
    "loadingPageSearch": "{t('authorPageSearch.loadingPageSearch')}",
    "searchThisPage": "Search this Page",
    "searchHelp": "Search posts, works, and store items from {{name}} only.",
    "noResults": "No results found",
    "tryAnother": "{t('authorPageSearch.tryAnother')}",
    "posts": "Posts",
    "works": "Works",
    "store": "Store",
    "post": "Post",
    "photoPost": "Photo post",
    "work": "Work",
    "untitledStory": "Untitled Story",
    "storeItem": "Store item",
    "authorPageNotFound": "Author page not found",
    "failedLoadPosts": "Failed to load posts",
    "failedLoadStoreProducts": "Failed to load store products",
    "failedLoadPageSearch": "Failed to load Page search"
  },
  "km": {
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "back": "ត្រឡប់ក្រោយ",
    "searchName": "ស្វែងរកក្នុង {{name}}",
    "clearSearch": "សម្អាតការស្វែងរក",
    "allCount": "ទាំងអស់ {{count}}",
    "postsCount": "ប្រកាស {{count}}",
    "worksCount": "ស្នាដៃ {{count}}",
    "storeCount": "ហាង {{count}}",
    "loadingPageSearch": "កំពុងផ្ទុកការស្វែងរកក្នុងទំព័រ...",
    "searchThisPage": "ស្វែងរកក្នុងទំព័រនេះ",
    "searchHelp": "ស្វែងរកប្រកាស ស្នាដៃ និងទំនិញក្នុងហាងរបស់ {{name}} ប៉ុណ្ណោះ។",
    "noResults": "រកមិនឃើញលទ្ធផល",
    "tryAnother": "សាកល្បងពាក្យ ឬឃ្លាផ្សេង។",
    "posts": "ប្រកាស",
    "works": "ស្នាដៃ",
    "store": "ហាង",
    "post": "ប្រកាស",
    "photoPost": "ប្រកាសរូបភាព",
    "work": "ស្នាដៃ",
    "untitledStory": "រឿងគ្មានចំណងជើង",
    "storeItem": "ទំនិញក្នុងហាង",
    "authorPageNotFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "failedLoadPosts": "មិនអាចផ្ទុកប្រកាសបានទេ",
    "failedLoadStoreProducts": "មិនអាចផ្ទុកទំនិញក្នុងហាងបានទេ",
    "failedLoadPageSearch": "មិនអាចផ្ទុកការស្វែងរកក្នុងទំព័របានទេ"
  },
  "zh": {
    "authorPage": "作者主页",
    "back": "返回",
    "searchName": "搜索 {{name}}",
    "clearSearch": "清除搜索",
    "allCount": "全部 {{count}}",
    "postsCount": "帖子 {{count}}",
    "worksCount": "作品 {{count}}",
    "storeCount": "商店 {{count}}",
    "loadingPageSearch": "正在加载主页搜索...",
    "searchThisPage": "搜索此主页",
    "searchHelp": "仅搜索 {{name}} 的帖子、作品和商店商品。",
    "noResults": "未找到结果",
    "tryAnother": "请尝试其他词语或短语。",
    "posts": "帖子",
    "works": "作品",
    "store": "商店",
    "post": "帖子",
    "photoPost": "图片帖子",
    "work": "作品",
    "untitledStory": "未命名故事",
    "storeItem": "商店商品",
    "authorPageNotFound": "未找到作者主页",
    "failedLoadPosts": "无法加载帖子",
    "failedLoadStoreProducts": "无法加载商店商品",
    "failedLoadPageSearch": "无法加载主页搜索"
  },
  "ja": {
    "authorPage": "著者ページ",
    "back": "戻る",
    "searchName": "{{name}} を検索",
    "clearSearch": "検索をクリア",
    "allCount": "すべて {{count}}",
    "postsCount": "投稿 {{count}}",
    "worksCount": "作品 {{count}}",
    "storeCount": "ストア {{count}}",
    "loadingPageSearch": "ページ検索を読み込み中...",
    "searchThisPage": "このページを検索",
    "searchHelp": "{{name}} の投稿、作品、ストア商品だけを検索します。",
    "noResults": "結果が見つかりません",
    "tryAnother": "別の単語やフレーズを試してください。",
    "posts": "投稿",
    "works": "作品",
    "store": "ストア",
    "post": "投稿",
    "photoPost": "写真投稿",
    "work": "作品",
    "untitledStory": "無題のストーリー",
    "storeItem": "ストア商品",
    "authorPageNotFound": "著者ページが見つかりません",
    "failedLoadPosts": "投稿を読み込めませんでした",
    "failedLoadStoreProducts": "ストア商品を読み込めませんでした",
    "failedLoadPageSearch": "ページ検索を読み込めませんでした"
  },
  "ko": {
    "authorPage": "작가 페이지",
    "back": "뒤로",
    "searchName": "{{name}} 검색",
    "clearSearch": "검색 지우기",
    "allCount": "전체 {{count}}",
    "postsCount": "게시물 {{count}}",
    "worksCount": "작품 {{count}}",
    "storeCount": "스토어 {{count}}",
    "loadingPageSearch": "페이지 검색을 불러오는 중...",
    "searchThisPage": "이 페이지 검색",
    "searchHelp": "{{name}}의 게시물, 작품, 스토어 상품만 검색합니다.",
    "noResults": "검색 결과가 없습니다",
    "tryAnother": "다른 단어나 문구를 입력해 보세요.",
    "posts": "게시물",
    "works": "작품",
    "store": "스토어",
    "post": "게시물",
    "photoPost": "사진 게시물",
    "work": "작품",
    "untitledStory": "제목 없는 이야기",
    "storeItem": "스토어 상품",
    "authorPageNotFound": "작가 페이지를 찾을 수 없습니다",
    "failedLoadPosts": "게시물을 불러오지 못했습니다",
    "failedLoadStoreProducts": "스토어 상품을 불러오지 못했습니다",
    "failedLoadPageSearch": "페이지 검색을 불러오지 못했습니다"
  }
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function matchesQuery(values, query) {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) return false

  return values.some((value) => normalizeText(value).includes(normalizedQuery))
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(getDisplayLanguageId(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPrice(product) {
  const sale = Number(product?.sale_price || 0)
  const original = Number(product?.original_price || 0)
  const price = sale || original

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

async function fetchAuthorPage(pageUsername, signal) {
  const token = getAuthToken()
  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal,
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPageSearch.authorPageNotFound'))
  }

  return {
    page: data.author_page || data.author || data.page || null,
    works: Array.isArray(data.works)
      ? data.works
      : Array.isArray(data.author_page?.works)
        ? data.author_page.works
        : [],
  }
}

async function fetchAllAuthorPosts(pageUsername, signal) {
  const collected = []
  const seen = new Set()
  let before = ''

  for (let index = 0; index < 60; index += 1) {
    const params = new URLSearchParams({ limit: '30' })
    if (before) params.set('before', before)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts?${params.toString()}`,
      { signal }
    )
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || getDisplayText('authorPageSearch.failedLoadPosts'))
    }

    const rows = Array.isArray(data.posts) ? data.posts : []

    for (const post of rows) {
      const key = String(post?.id || '')
      if (!key || seen.has(key)) continue
      seen.add(key)
      collected.push(post)
    }

    if (rows.length < 30) break

    const unpinnedRows = rows.filter((post) => !post?.is_pinned)
    const cursorRows = unpinnedRows.length ? unpinnedRows : rows
    const validDates = cursorRows
      .map((post) => new Date(post?.created_at || 0))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

    if (!validDates.length) break

    const cursorDate = new Date(validDates[0])
    cursorDate.setUTCDate(cursorDate.getUTCDate() - 1)
    const nextBefore = cursorDate.toISOString().slice(0, 10)

    if (!nextBefore || nextBefore === before) break
    before = nextBefore
  }

  return collected
}

async function fetchAuthorProducts(pageUsername, signal) {
  const response = await fetch(
    `${API_BASE_URL}/api/author-store/page/${encodeURIComponent(pageUsername)}/products`,
    { signal }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPageSearch.failedLoadStoreProducts'))
  }

  return Array.isArray(data.products) ? data.products : []
}

function FilterButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium ${
        active
          ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
          : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]'
      }`}
    >
      {label}
    </button>
  )
}

function PostResult({ post }) {
  const { t } = useDisplayTranslation()
  const images = Array.isArray(post?.image_urls) ? post.image_urls.filter(Boolean) : []
  const content = String(post?.content || '').trim()

  return (
    <article className="bg-[var(--shadow-bg-surface)] px-4 py-4">
      <div className="flex gap-3">
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="h-[68px] w-[68px] shrink-0 rounded-[10px] object-cover"
          />
        ) : (
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
            <i className="fa-regular fa-file-lines text-[18px]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">{t('authorPageSearch.post')}</div>
          <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[14px] font-normal leading-5 text-[var(--shadow-text-primary)]">
            {content || t('authorPageSearch.photoPost')}
          </p>
          {post?.created_at ? (
            <div className="mt-2 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
              {formatDate(post.created_at)}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function WorkResult({ work, onOpen }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 bg-[var(--shadow-bg-surface)] px-4 py-4 text-left active:bg-[var(--shadow-bg-soft)]"
    >
      <div className="h-[78px] w-[56px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
        {work?.cover_url ? (
          <img
            src={work.cover_url}
            alt={work?.title || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-bookmark text-[18px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">{t('authorPageSearch.work')}</div>
        <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-5 text-[var(--shadow-text-primary)]">
          {work?.title || t('authorPageSearch.untitledStory')}
        </h3>
        <div className="mt-2 line-clamp-1 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
          {[work?.main_genre, work?.story_status].filter(Boolean).join(' · ')}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-7 text-[11px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function StoreResult({ product, onOpen }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 bg-[var(--shadow-bg-surface)] px-4 py-4 text-left active:bg-[var(--shadow-bg-soft)]"
    >
      <div className="h-[78px] w-[58px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
        {product?.cover_url ? (
          <img
            src={product.cover_url}
            alt={product?.title || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-solid fa-bag-shopping text-[17px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="text-[12px] font-medium text-[var(--shadow-text-secondary)]">{t('authorPageSearch.store')}</div>
        <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-5 text-[var(--shadow-text-primary)]">
          {product?.title || t('authorPageSearch.storeItem')}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
          <span>{formatPrice(product)}</span>
          {product?.category ? <span>· {product.category}</span> : null}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-7 text-[11px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

export default function AuthorPageSearchPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { pageUsername } = useParams()
  const inputRef = useRef(null)
  const [page, setPage] = useState(null)
  const [works, setWorks] = useState([])
  const [posts, setPosts] = useState([])
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const pageName = page?.page_name || page?.name || t('authorPageSearch.authorPage')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!pageUsername) {
      setError(t('authorPageSearch.authorPageNotFound'))
      setLoading(false)
      return undefined
    }

    let ignore = false
    const controller = new AbortController()

    async function loadSearchData() {
      try {
        setLoading(true)
        setError('')

        const pageData = await fetchAuthorPage(pageUsername, controller.signal)

        if (!ignore) {
          setPage(pageData.page)
          setWorks(pageData.works)
        }

        const [postRows, productRows] = await Promise.all([
          fetchAllAuthorPosts(pageUsername, controller.signal).catch(() => []),
          fetchAuthorProducts(pageUsername, controller.signal).catch(() => []),
        ])

        if (!ignore) {
          setPosts(postRows)
          setProducts(productRows)
        }
      } catch (loadError) {
        if (!ignore && loadError?.name !== 'AbortError') {
          setError(loadError.message || t('authorPageSearch.failedLoadPageSearch'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadSearchData()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [pageUsername])

  const results = useMemo(() => {
    const cleanQuery = query.trim()

    if (!cleanQuery) {
      return {
        posts: [],
        works: [],
        products: [],
      }
    }

    const matchedPosts = posts.filter((post) =>
      matchesQuery(
        [
          post?.content,
          post?.post_type,
        ],
        cleanQuery
      )
    )

    const matchedWorks = works.filter((work) =>
      matchesQuery(
        [
          work?.title,
          work?.description,
          work?.main_genre,
          work?.story_status,
          work?.story_language,
          Array.isArray(work?.tags) ? work.tags.join(' ') : '',
        ],
        cleanQuery
      )
    )

    const matchedProducts = products.filter((product) =>
      matchesQuery(
        [
          product?.title,
          product?.description,
          product?.category,
          product?.type,
          product?.product_type,
          product?.book_condition,
        ],
        cleanQuery
      )
    )

    return {
      posts: matchedPosts,
      works: matchedWorks,
      products: matchedProducts,
    }
  }, [posts, products, query, works])

  const totalResults =
    results.posts.length +
    results.works.length +
    results.products.length

  const visiblePosts =
    activeFilter === 'All' || activeFilter === 'Posts'
      ? results.posts
      : []

  const visibleWorks =
    activeFilter === 'All' || activeFilter === 'Works'
      ? results.works
      : []

  const visibleProducts =
    activeFilter === 'All' || activeFilter === 'Store'
      ? results.products
      : []

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)]">
      <header className="sticky top-0 z-40 bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorPageSearch.back')}
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <div className="flex h-[40px] min-w-0 flex-1 items-center rounded-full bg-[var(--shadow-bg-soft)] px-3">
            <i className="fa-solid fa-magnifying-glass mr-2 text-[15px] text-[var(--shadow-text-secondary)]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('authorPageSearch.searchName', { name: pageName })}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-text-tertiary)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-soft)]"
                aria-label={t('authorPageSearch.clearSearch')}
              >
                <i className="fa-solid fa-xmark text-[13px]" />
              </button>
            ) : null}
          </div>
        </div>

        {query.trim() ? (
          <div className="mx-auto max-w-[720px] overflow-x-auto px-4 pb-3">
            <div className="flex gap-2">
              <FilterButton
                active={activeFilter === 'All'}
                label={t('authorPageSearch.allCount', { count: totalResults.toLocaleString(getDisplayLanguageId()) })}
                onClick={() => setActiveFilter('All')}
              />
              <FilterButton
                active={activeFilter === 'Posts'}
                label={t('authorPageSearch.postsCount', { count: results.posts.length.toLocaleString(getDisplayLanguageId()) })}
                onClick={() => setActiveFilter('Posts')}
              />
              <FilterButton
                active={activeFilter === 'Works'}
                label={t('authorPageSearch.worksCount', { count: results.works.length.toLocaleString(getDisplayLanguageId()) })}
                onClick={() => setActiveFilter('Works')}
              />
              <FilterButton
                active={activeFilter === 'Store'}
                label={t('authorPageSearch.storeCount', { count: results.products.length.toLocaleString(getDisplayLanguageId()) })}
                onClick={() => setActiveFilter('Store')}
              />
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-[720px] pb-10">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="text-center text-[var(--shadow-text-secondary)]">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[var(--shadow-border-strong)] border-t-[var(--shadow-text-primary)]" />
              <p className="mt-3 text-[13px] font-normal">{t('authorPageSearch.loadingPageSearch')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-5 py-14 text-center">
            <i className="fa-solid fa-circle-exclamation text-[28px] text-[var(--shadow-text-tertiary)]" />
            <p className="mt-3 text-[14px] font-normal text-[var(--shadow-text-secondary)]">{error}</p>
          </div>
        ) : !query.trim() ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
              <i className="fa-solid fa-magnifying-glass text-[21px]" />
            </div>
            <h1 className="mt-4 text-[16px] font-bold text-[var(--shadow-text-primary)]">
              {t('authorPageSearch.searchThisPage')}
            </h1>
            <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {t('authorPageSearch.searchHelp', { name: pageName })}
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="px-6 py-16 text-center">
            <i className="fa-regular fa-face-frown text-[30px] text-[var(--shadow-text-tertiary)]" />
            <h2 className="mt-4 text-[15px] font-bold text-[var(--shadow-text-primary)]">
              {t('authorPageSearch.noResults')}
            </h2>
            <p className="mt-2 text-[13px] font-normal text-[var(--shadow-text-secondary)]">
              {t('authorPageSearch.tryAnother')}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-3">
            {visiblePosts.length ? (
              <section>
                <div className="bg-[var(--shadow-bg-surface)] px-4 pb-2 pt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                  {t('authorPageSearch.posts')}
                </div>
                <div className="divide-y divide-[var(--shadow-border)]">
                  {visiblePosts.map((post) => (
                    <PostResult key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ) : null}

            {visibleWorks.length ? (
              <section>
                <div className="bg-[var(--shadow-bg-surface)] px-4 pb-2 pt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                  {t('authorPageSearch.works')}
                </div>
                <div className="divide-y divide-[var(--shadow-border)]">
                  {visibleWorks.map((work) => (
                    <WorkResult
                      key={work.id}
                      work={work}
                      onOpen={() => navigate(`/story/${work.id}`)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {visibleProducts.length ? (
              <section>
                <div className="bg-[var(--shadow-bg-surface)] px-4 pb-2 pt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                  {t('authorPageSearch.store')}
                </div>
                <div className="divide-y divide-[var(--shadow-border)]">
                  {visibleProducts.map((product) => (
                    <StoreResult
                      key={product.id}
                      product={product}
                      onOpen={() =>
                        navigate(
                          `/author/page/${encodeURIComponent(pageUsername)}/store/product/${encodeURIComponent(product.id)}`
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </main>
    </div>
  )
}

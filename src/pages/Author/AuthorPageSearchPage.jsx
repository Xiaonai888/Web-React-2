import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPrice(product) {
  const sale = Number(product?.sale_price || 0)
  const original = Number(product?.original_price || 0)
  const price = sale || original

  return `$${price.toFixed(2)}`
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
    throw new Error(data.message || 'Author page not found')
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
      throw new Error(data.message || 'Failed to load posts')
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
    throw new Error(data.message || 'Failed to load store products')
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
          ? 'bg-[#111827] text-white'
          : 'bg-white text-[#4b5563] ring-1 ring-[#e5e7eb]'
      }`}
    >
      {label}
    </button>
  )
}

function PostResult({ post }) {
  const images = Array.isArray(post?.image_urls) ? post.image_urls.filter(Boolean) : []
  const content = String(post?.content || '').trim()

  return (
    <article className="bg-white px-4 py-4">
      <div className="flex gap-3">
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="h-[68px] w-[68px] shrink-0 rounded-[10px] object-cover"
          />
        ) : (
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#f1f3f5] text-[#111827]">
            <i className="fa-regular fa-file-lines text-[18px]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-medium text-[#6b7280]">Post</div>
          <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-[14px] font-normal leading-5 text-[#111827]">
            {content || 'Photo post'}
          </p>
          {post?.created_at ? (
            <div className="mt-2 text-[11px] font-normal text-[#9ca3af]">
              {formatDate(post.created_at)}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function WorkResult({ work, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 bg-white px-4 py-4 text-left active:bg-[#f8fafc]"
    >
      <div className="h-[78px] w-[56px] shrink-0 overflow-hidden rounded-[8px] bg-[#f1f3f5]">
        {work?.cover_url ? (
          <img
            src={work.cover_url}
            alt={work?.title || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-regular fa-bookmark text-[18px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="text-[12px] font-medium text-[#6b7280]">Work</div>
        <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-5 text-[#111827]">
          {work?.title || 'Untitled Story'}
        </h3>
        <div className="mt-2 line-clamp-1 text-[12px] font-normal text-[#6b7280]">
          {[work?.main_genre, work?.story_status].filter(Boolean).join(' · ')}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-7 text-[11px] text-[#9ca3af]" />
    </button>
  )
}

function StoreResult({ product, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 bg-white px-4 py-4 text-left active:bg-[#f8fafc]"
    >
      <div className="h-[78px] w-[58px] shrink-0 overflow-hidden rounded-[8px] bg-[#f1f3f5]">
        {product?.cover_url ? (
          <img
            src={product.cover_url}
            alt={product?.title || ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-solid fa-bag-shopping text-[17px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="text-[12px] font-medium text-[#6b7280]">Store</div>
        <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-5 text-[#111827]">
          {product?.title || 'Store item'}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[12px] font-normal text-[#6b7280]">
          <span>{formatPrice(product)}</span>
          {product?.category ? <span>· {product.category}</span> : null}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-7 text-[11px] text-[#9ca3af]" />
    </button>
  )
}

export default function AuthorPageSearchPage() {
  const navigate = useNavigate()
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

  const pageName = page?.page_name || page?.name || 'Author Page'

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!pageUsername) {
      setError('Author page not found')
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
          setError(loadError.message || 'Failed to load Page search')
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
    <div className="min-h-screen bg-[#f3f4f6]">
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <div className="flex h-[40px] min-w-0 flex-1 items-center rounded-full bg-[#f0f2f5] px-3">
            <i className="fa-solid fa-magnifying-glass mr-2 text-[15px] text-[#6b7280]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${pageName}`}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[#111827] outline-none placeholder:text-[#8b93a1]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="ml-2 flex h-7 w-7 items-center justify-center rounded-full text-[#6b7280] active:bg-[#e5e7eb]"
                aria-label="Clear search"
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
                label={`All ${totalResults}`}
                onClick={() => setActiveFilter('All')}
              />
              <FilterButton
                active={activeFilter === 'Posts'}
                label={`Posts ${results.posts.length}`}
                onClick={() => setActiveFilter('Posts')}
              />
              <FilterButton
                active={activeFilter === 'Works'}
                label={`Works ${results.works.length}`}
                onClick={() => setActiveFilter('Works')}
              />
              <FilterButton
                active={activeFilter === 'Store'}
                label={`Store ${results.products.length}`}
                onClick={() => setActiveFilter('Store')}
              />
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-[720px] pb-10">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="text-center text-[#6b7280]">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#111827]" />
              <p className="mt-3 text-[13px] font-normal">Loading Page search...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-5 py-14 text-center">
            <i className="fa-solid fa-circle-exclamation text-[28px] text-[#9ca3af]" />
            <p className="mt-3 text-[14px] font-normal text-[#4b5563]">{error}</p>
          </div>
        ) : !query.trim() ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111827]">
              <i className="fa-solid fa-magnifying-glass text-[21px]" />
            </div>
            <h1 className="mt-4 text-[16px] font-bold text-[#111827]">
              Search this Page
            </h1>
            <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-normal leading-5 text-[#6b7280]">
              Search posts, works, and store items from {pageName} only.
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="px-6 py-16 text-center">
            <i className="fa-regular fa-face-frown text-[30px] text-[#9ca3af]" />
            <h2 className="mt-4 text-[15px] font-bold text-[#111827]">
              No results found
            </h2>
            <p className="mt-2 text-[13px] font-normal text-[#6b7280]">
              Try another word or phrase.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-3">
            {visiblePosts.length ? (
              <section>
                <div className="bg-white px-4 pb-2 pt-4 text-[14px] font-bold text-[#111827]">
                  Posts
                </div>
                <div className="divide-y divide-[#eef0f3]">
                  {visiblePosts.map((post) => (
                    <PostResult key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ) : null}

            {visibleWorks.length ? (
              <section>
                <div className="bg-white px-4 pb-2 pt-4 text-[14px] font-bold text-[#111827]">
                  Works
                </div>
                <div className="divide-y divide-[#eef0f3]">
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
                <div className="bg-white px-4 pb-2 pt-4 text-[14px] font-bold text-[#111827]">
                  Store
                </div>
                <div className="divide-y divide-[#eef0f3]">
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

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SEARCH_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'readers', label: 'Readers' },
  { key: 'pages', label: 'Pages' },
  { key: 'stories', label: 'Stories' },
  { key: 'pdfs', label: 'PDF Books' },
  { key: 'posts', label: 'Posts' },
]

const EMPTY_SECTIONS = {
  readers: [],
  pages: [],
  stories: [],
  pdfs: [],
  posts: [],
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCount(value) {
  const number = Number(value || 0)

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, '')}M`
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`
  }

  return String(number)
}

function formatPrice(value) {
  const number = Number(value || 0)
  return `$${number.toFixed(2)}`
}

function getInitial(value, fallback = 'S') {
  return String(value || fallback).trim().slice(0, 1).toUpperCase() || fallback
}

function Avatar({ src, name, size = 48, rounded = true }) {
  return (
    <div
      className={`shrink-0 overflow-hidden bg-[#eceef2] text-[#5f6673] ring-1 ring-black/5 ${
        rounded ? 'rounded-full' : 'rounded-[12px]'
      } flex items-center justify-center font-extrabold`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Profile'}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        getInitial(name)
      )}
    </div>
  )
}

function SearchTabs({ activeType, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[#eceef2] bg-white px-4 py-3">
      {SEARCH_TYPES.map((item) => {
        const active = activeType === item.key

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold transition active:scale-[0.97] ${
              active
                ? 'bg-[#25262b] text-white shadow-sm'
                : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

function ReaderResult({ reader, onOpen }) {
  const name = reader.name || reader.username || 'Reader'
  const meta = reader.bio || reader.work || reader.location || 'Shadow reader'

  return (
    <button
      type="button"
      onClick={() => onOpen(reader)}
      className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8]"
    >
      <Avatar src={reader.avatar_url} name={name} size={52} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-extrabold text-[#16181d]">
          {name}
        </div>
        <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8a909c]">
          @{reader.username || 'reader'}
        </div>
        <div className="mt-1 line-clamp-1 text-[12px] leading-5 text-[#68707d]">
          {meta}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#c0c4cc]" />
    </button>
  )
}

function PageResult({ page, onOpen }) {
  const name = page.page_name || page.page_username || 'Author Page'

  return (
    <button
      type="button"
      onClick={() => onOpen(page)}
      className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8]"
    >
      <Avatar src={page.avatar_url} name={name} size={52} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-extrabold text-[#16181d]">
          {name}
        </div>
        <div className="mt-0.5 truncate text-[12px] font-semibold text-[#8a909c]">
          @{page.page_username || 'author'}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] font-bold text-[#68707d]">
          <span>{formatCount(page.total_followers)} followers</span>
          <span>{formatCount(page.total_stories)} works</span>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#c0c4cc]" />
    </button>
  )
}

function StoryResult({ story, onOpen }) {
  const authorName =
    story.author_page?.page_name ||
    story.author_page?.page_username ||
    'Author'

  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="flex w-full gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8]"
    >
      <div className="h-[92px] w-[64px] shrink-0 overflow-hidden rounded-[10px] bg-[#eceef2] ring-1 ring-black/5">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={story.title || 'Story cover'}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="line-clamp-2 text-[15px] font-extrabold leading-5 text-[#16181d]">
          {story.title || 'Untitled Story'}
        </div>
        <div className="mt-1 truncate text-[12px] font-semibold text-[#8a909c]">
          by {authorName}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#68707d]">
          {story.main_genre ? (
            <span className="rounded-full bg-[#f3f4f6] px-2 py-1">
              {story.main_genre}
            </span>
          ) : null}
          <span>
            <i className="fa-solid fa-eye mr-1 text-[#8a909c]" />
            {formatCount(story.total_views)}
          </span>
          <span>
            <i className="fa-solid fa-heart mr-1 text-[#ef476f]" />
            {formatCount(story.total_likes)}
          </span>
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-10 text-[12px] text-[#c0c4cc]" />
    </button>
  )
}

function PdfResult({ product, onOpen }) {
  const authorName =
    product.author_page?.page_name ||
    product.author_name ||
    product.author_page?.page_username ||
    'Author'
  const price = Number(product.sale_price || 0)
  const originalPrice = Number(product.original_price || 0)

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="flex w-full gap-3 bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8]"
    >
      <div className="h-[92px] w-[64px] shrink-0 overflow-hidden rounded-[10px] bg-[#eceef2] ring-1 ring-black/5">
        {product.cover_url ? (
          <img
            src={product.cover_url}
            alt={product.title || 'PDF cover'}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="line-clamp-2 text-[15px] font-extrabold leading-5 text-[#16181d]">
          {product.title || 'Untitled PDF'}
        </div>
        <div className="mt-1 truncate text-[12px] font-semibold text-[#8a909c]">
          by {authorName}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#25262b] px-2.5 py-1 text-[11px] font-extrabold text-white">
            PDF
          </span>
          <span className="text-[13px] font-black text-[#16181d]">
            {formatPrice(price)}
          </span>
          {originalPrice > price && originalPrice > 0 ? (
            <span className="text-[11px] font-semibold text-[#a0a5af] line-through">
              {formatPrice(originalPrice)}
            </span>
          ) : null}
          {product.page_count ? (
            <span className="text-[11px] font-bold text-[#68707d]">
              {product.page_count} pages
            </span>
          ) : null}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-10 text-[12px] text-[#c0c4cc]" />
    </button>
  )
}

function PostResult({ post, onOpen }) {
  const owner = post.owner || {}
  const isAuthor = post.post_source === 'author'
  const ownerName = isAuthor
    ? owner.page_name || owner.page_username || 'Author'
    : owner.name || owner.username || 'Reader'
  const ownerUsername = isAuthor
    ? owner.page_username
    : owner.username
  const avatarUrl = owner.avatar_url || null
  const firstImage = Array.isArray(post.image_urls)
    ? post.image_urls.find(Boolean)
    : null

  return (
    <button
      type="button"
      onClick={() => onOpen(post)}
      className="w-full bg-white px-4 py-3 text-left transition active:bg-[#f7f7f8]"
    >
      <div className="flex items-center gap-3">
        <Avatar src={avatarUrl} name={ownerName} size={44} />

        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-extrabold text-[#16181d]">
            {ownerName}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-[#8a909c]">
            <span className="truncate">@{ownerUsername || 'shadow'}</span>
            <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-extrabold text-[#68707d]">
              {isAuthor ? 'Page Post' : 'Reader Post'}
            </span>
          </div>
        </div>

        <i className="fa-solid fa-chevron-right text-[12px] text-[#c0c4cc]" />
      </div>

      {post.content ? (
        <div className="mt-3 line-clamp-3 whitespace-pre-line text-[13px] leading-5 text-[#343942]">
          {post.content}
        </div>
      ) : null}

      {firstImage ? (
        <div className="mt-3 h-[150px] overflow-hidden rounded-[12px] bg-[#eceef2]">
          <img
            src={firstImage}
            alt={`${ownerName} post`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-4 text-[11px] font-bold text-[#7b828e]">
        <span>
          <i className="fa-solid fa-heart mr-1 text-[#ef476f]" />
          {formatCount(post.like_count)}
        </span>
        <span>
          <i className="fa-regular fa-comment mr-1" />
          {formatCount(post.comment_count)}
        </span>
        <span>
          <i className="fa-solid fa-retweet mr-1" />
          {formatCount(post.echo_count)}
        </span>
      </div>
    </button>
  )
}

function SectionShell({ title, count, showAll, onShowAll, children }) {
  return (
    <section className="overflow-hidden border-y border-[#eceef2] bg-white sm:rounded-[16px] sm:border">
      <div className="flex items-center justify-between gap-3 border-b border-[#f0f1f3] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[15px] font-extrabold text-[#16181d]">
            {title}
          </h2>
          <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-extrabold text-[#7b828e]">
            {count}
          </span>
        </div>

        {showAll ? (
          <button
            type="button"
            onClick={onShowAll}
            className="shrink-0 text-[12px] font-extrabold text-[#25262b] active:opacity-60"
          >
            See all
          </button>
        ) : null}
      </div>

      <div className="divide-y divide-[#f0f1f3]">{children}</div>
    </section>
  )
}

function LoadingState() {
  return (
    <div className="space-y-3 px-4 py-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-[16px] bg-white p-3 ring-1 ring-black/5"
        >
          <div className="h-14 w-14 animate-pulse rounded-full bg-[#eceef2]" />
          <div className="flex-1">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#eceef2]" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-[#f1f2f4]" />
            <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-[#f1f2f4]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ searched, message }) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#8a909c] shadow-sm ring-1 ring-black/5">
        <i className={`fa-solid ${searched ? 'fa-face-frown' : 'fa-magnifying-glass'} text-[22px]`} />
      </div>
      <h2 className="mt-4 text-[16px] font-extrabold text-[#16181d]">
        {searched ? 'No results found' : 'Search everything on Shadow'}
      </h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#7b828e]">
        {message ||
          (searched
            ? 'Try another name, username, story title, PDF book, or post keyword.'
            : 'Find readers, author pages, stories, PDF books, and posts in one place.')}
      </p>
    </div>
  )
}

export default function DiscoverSearchPage() {
  const navigate = useNavigate()
  const initialParams = new URLSearchParams(window.location.search)
  const initialQuery = String(initialParams.get('q') || '').trim()
  const requestedType = String(initialParams.get('type') || 'all').trim().toLowerCase()
  const initialType = SEARCH_TYPES.some((item) => item.key === requestedType)
    ? requestedType
    : 'all'
  const [searchText, setSearchText] = useState(initialQuery)
  const [activeQuery, setActiveQuery] = useState(initialQuery)
  const [activeType, setActiveType] = useState(initialType)
  const [sections, setSections] = useState(EMPTY_SECTIONS)
  const [shownCounts, setShownCounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveQuery(searchText.trim())
    }, 420)

    return () => window.clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    const keyword = activeQuery.trim()

    if (!keyword) {
      setSections(EMPTY_SECTIONS)
      setShownCounts({})
      setLoading(false)
      setMessage('')
      return undefined
    }

    const controller = new AbortController()

    async function runSearch() {
      try {
        setLoading(true)
        setMessage('')

        const params = new URLSearchParams({
          q: keyword,
          type: activeType,
          limit: activeType === 'all' ? '20' : '30',
        })
        const token = getReaderToken()
        const response = await fetch(
          `${API_BASE_URL}/api/discover-search?${params.toString()}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to search Shadow')
        }

        setSections({
          ...EMPTY_SECTIONS,
          ...(data.sections || {}),
        })
        setShownCounts(data.shown_counts || {})
      } catch (error) {
        if (error.name === 'AbortError') return

        setSections(EMPTY_SECTIONS)
        setShownCounts({})
        setMessage(error.message || 'Failed to search Shadow')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    runSearch()

    return () => controller.abort()
  }, [activeQuery, activeType])

  const totalShown = useMemo(() => {
    return Object.values(sections).reduce(
      (sum, items) => sum + (Array.isArray(items) ? items.length : 0),
      0
    )
  }, [sections])

  function submitSearch(event) {
    event.preventDefault()
    setActiveQuery(searchText.trim())
  }

  function changeType(type) {
    setActiveType(type)
    setActiveQuery(searchText.trim())
  }

  function openReader(reader) {
    if (!reader?.username) return
    navigate(`/profile?username=${encodeURIComponent(reader.username)}`)
  }

  function openPage(page) {
    if (!page?.page_username) return
    navigate(`/author/page/${encodeURIComponent(page.page_username)}`)
  }

  function openStory(story) {
    if (!story?.id) return
    navigate(`/story/${encodeURIComponent(story.id)}`)
  }

  function openPdf(product) {
    const pageUsername = product?.author_page?.page_username

    if (!pageUsername || !product?.id) return

    navigate(
      `/author/page/${encodeURIComponent(pageUsername)}/store/product/${encodeURIComponent(product.id)}`
    )
  }

  function openPost(post) {
    if (post?.post_source === 'author') {
      openPage(post.owner)
      return
    }

    openReader(post.owner)
  }

  const sectionConfig = [
    {
      key: 'readers',
      title: 'Readers',
      items: sections.readers,
      render: (item) => (
        <ReaderResult key={item.id} reader={item} onOpen={openReader} />
      ),
    },
    {
      key: 'pages',
      title: 'Pages',
      items: sections.pages,
      render: (item) => (
        <PageResult key={item.id} page={item} onOpen={openPage} />
      ),
    },
    {
      key: 'stories',
      title: 'Stories',
      items: sections.stories,
      render: (item) => (
        <StoryResult key={item.id} story={item} onOpen={openStory} />
      ),
    },
    {
      key: 'pdfs',
      title: 'PDF Books',
      items: sections.pdfs,
      render: (item) => (
        <PdfResult key={item.id} product={item} onOpen={openPdf} />
      ),
    },
    {
      key: 'posts',
      title: 'Posts',
      items: sections.posts,
      render: (item) => (
        <PostResult key={`${item.post_source}-${item.id}`} post={item} onOpen={openPost} />
      ),
    },
  ]

  const visibleSections =
    activeType === 'all'
      ? sectionConfig.filter((section) => section.items.length)
      : sectionConfig.filter((section) => section.key === activeType)

  return (
    <div className="min-h-screen bg-[#f6f7f8] pb-10 text-[#16181d]">
      <style>{`
        body { background:#f6f7f8; font-family:'Plus Jakarta Sans','Kantumruy Pro',sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <header className="sticky top-0 z-[1000] bg-white shadow-[0_1px_0_rgba(17,24,39,0.08)]">
        <form
          onSubmit={submitSearch}
          className="mx-auto flex h-[62px] w-full max-w-[620px] items-center gap-3 px-4"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#25262b] active:bg-[#f3f4f6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="relative min-w-0 flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#9298a3]" />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              autoFocus
              placeholder="Search Shadow..."
              className="h-11 w-full rounded-full border border-[#e2e4e8] bg-[#f7f7f8] pl-11 pr-11 text-[14px] font-semibold text-[#16181d] outline-none transition placeholder:font-medium placeholder:text-[#9aa0aa] focus:border-[#25262b] focus:bg-white"
            />
            {searchText ? (
              <button
                type="button"
                onClick={() => {
                  setSearchText('')
                  setActiveQuery('')
                }}
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#e5e7eb] text-[#68707d] active:scale-95"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </form>

        <div className="mx-auto w-full max-w-[620px]">
          <SearchTabs activeType={activeType} onChange={changeType} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[620px]">
        {activeQuery ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-[11px] font-bold text-[#7b828e]">
            <span className="truncate">Results for “{activeQuery}”</span>
            {!loading && totalShown > 0 ? (
              <span className="shrink-0">{shownCounts.all ?? totalShown} shown</span>
            ) : null}
          </div>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : message ? (
          <EmptyState searched message={message} />
        ) : !activeQuery ? (
          <EmptyState searched={false} />
        ) : totalShown === 0 ? (
          <EmptyState searched />
        ) : (
          <div className="space-y-3 pb-6 sm:px-4">
            {visibleSections.map((section) => (
              <SectionShell
                key={section.key}
                title={section.title}
                count={section.items.length}
                showAll={activeType === 'all'}
                onShowAll={() => changeType(section.key)}
              >
                {section.items.map(section.render)}
              </SectionShell>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const LOAD_STEP = 20
const MAX_VISIBLE = 100

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`
  }

  return String(number)
}

function getInitial(name) {
  return String(name || 'A').trim().slice(0, 1).toUpperCase()
}

function getAuthorRank(author, fallbackRank) {
  const rank = Number(author?.rank || 0)
  return rank > 0 ? rank : fallbackRank
}

function sortAuthors(authors, filter) {
  const items = [...authors]

  if (filter === 'new') {
    return items.sort((first, second) => {
      const difference =
        new Date(second.created_at || 0).getTime() -
        new Date(first.created_at || 0).getTime()

      if (difference) return difference

      return getAuthorRank(first, 999999) - getAuthorRank(second, 999999)
    })
  }

  if (filter === 'updated') {
    return items.sort((first, second) => {
      const difference =
        new Date(second.updated_at || 0).getTime() -
        new Date(first.updated_at || 0).getTime()

      if (difference) return difference

      return getAuthorRank(first, 999999) - getAuthorRank(second, 999999)
    })
  }

  return items.sort(
    (first, second) =>
      getAuthorRank(first, 999999) - getAuthorRank(second, 999999)
  )
}

function AuthorCard({
  author,
  fallbackRank,
  onOpen,
  onFollow,
  followLoading,
}) {
  const name = author?.page_name || 'Author'
  const username = author?.page_username || 'author'
  const avatarUrl = author?.avatar_url || ''
  const coverUrl = author?.cover_url || ''
  const rank = getAuthorRank(author, fallbackRank)
  const followers = formatCompactNumber(author?.total_followers)
  const worksCount = Number(author?.total_stories || 0)
  const worksLabel =
    worksCount === 0
      ? 'No works'
      : worksCount === 1
        ? '1 work'
        : `${formatCompactNumber(worksCount)} works`

  const buttonLabel = author?.is_owner
    ? 'View'
    : author?.is_following
      ? 'Following'
      : 'Follow'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(author)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(author)
        }
      }}
      className="relative overflow-hidden rounded-[20px] border border-[#e7ebf2] bg-white shadow-sm active:scale-[0.99]"
    >
      <div className="absolute left-3 top-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full bg-white/95 px-2 text-[11px] font-black text-[#111827] shadow-sm ring-1 ring-black/5">
        #{rank}
      </div>

      <div className="relative h-[58px] overflow-hidden bg-gradient-to-br from-[#fff1f2] via-[#eef2ff] to-[#ecfeff]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="h-full w-full object-cover opacity-75"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-white/55" />
            <div className="absolute -bottom-10 left-5 h-24 w-24 rounded-full bg-white/40" />
            <div className="absolute right-8 top-6 h-10 w-10 rounded-full bg-white/35" />
          </>
        )}
      </div>

      <div className="-mt-8 px-3 pb-4 text-center">
        <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-[#f4f5f7] text-[20px] font-black text-[#111827] ring-4 ring-white">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            getInitial(name)
          )}
        </div>

        <div className="mt-3 line-clamp-1 text-[13px] font-black text-[#111827]">
          {name}
        </div>

        <div className="mt-1 line-clamp-1 text-[11px] font-bold text-[#8b93a1]">
          @{username}
        </div>

        <div className="mt-3 rounded-[14px] bg-[#f8fafc] px-2 py-2">
          <div className="text-[13px] font-black text-[#111827]">
            {followers} fans
          </div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#6b7280]">
            {worksLabel}
          </div>
        </div>

        <button
          type="button"
          disabled={followLoading}
          onClick={(event) => {
            event.stopPropagation()

            if (author?.is_owner || author?.is_following) {
              onOpen(author)
              return
            }

            onFollow(author)
          }}
          className={`mt-3 h-8 w-full rounded-full text-[12px] font-black active:scale-95 disabled:opacity-60 ${
            author?.is_following
              ? 'bg-[#f3f4f6] text-[#111827]'
              : 'bg-black text-white'
          }`}
        >
          {followLoading ? '...' : buttonLabel}
        </button>
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-[230px] animate-pulse rounded-[20px] border border-[#e7ebf2] bg-[#f8fafc]"
        />
      ))}
    </div>
  )
}

export default function TopAuthorsPage() {
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('ranking')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [followLoadingId, setFollowLoadingId] = useState('')

  const loadAuthors = useCallback(
  async (pageNumber = 1, append = false) => {
    const token = getReaderToken()

    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setLoadError(false)
      }

      const response = await fetch(
        `${API_BASE_URL}/api/authors/top?page=${pageNumber}&limit=${LOAD_STEP}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            'Failed to load authors'
        )
      }

      const incoming = Array.isArray(
        data.author_pages
      )
        ? data.author_pages
        : []

      setAuthors((current) => {
        const source = append
          ? [...current, ...incoming]
          : incoming

        const seen = new Set()

        return source
          .filter((author) => {
            if (
              !author?.id ||
              seen.has(author.id)
            ) {
              return false
            }

            seen.add(author.id)
            return true
          })
          .slice(0, MAX_VISIBLE)
      })

      const resolvedPage = Number(
        data.page || pageNumber
      )

      setPage(resolvedPage)
      setHasMore(
        Boolean(data.has_more) &&
          resolvedPage * LOAD_STEP <
            MAX_VISIBLE
      )
    } catch {
      if (!append) {
        setAuthors([])
        setLoadError(true)
      }
    } finally {
      if (append) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  },
  []
)

  useEffect(() => {
  loadAuthors(1, false)
}, [loadAuthors])

  const filteredAuthors = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    const searchedAuthors = value
      ? authors.filter((author) => {
          const name = String(author.page_name || '').toLowerCase()
          const username = String(author.page_username || '').toLowerCase()

          return name.includes(value) || username.includes(value)
        })
      : authors

    return sortAuthors(searchedAuthors, filter)
  }, [authors, keyword, filter])

  const visibleAuthors =
  filteredAuthors.slice(0, MAX_VISIBLE)

const canLoadMore =
  hasMore && authors.length < MAX_VISIBLE

  async function handleLoadMore() {
  if (loadingMore || !canLoadMore) return

  await loadAuthors(page + 1, true)
}

  function handleOpenAuthor(author) {
    if (!author?.page_username) return

    navigate(
      `/author/page/${encodeURIComponent(author.page_username)}`
    )
  }

  async function handleFollowAuthor(author) {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (
      !author?.page_username ||
      author?.is_owner ||
      author?.is_following ||
      followLoadingId
    ) {
      return
    }

    try {
      setFollowLoadingId(author.id)

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
          author.page_username
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        return
      }

      setAuthors((current) =>
  current.map((item) =>
    item.id === author.id
      ? {
          ...item,
          is_following: true,
          total_followers: Number(
            data.total_followers ??
              item.total_followers ??
              0
          ),
        }
      : item
  )
)
    } catch {
    } finally {
      setFollowLoadingId('')
    }
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 border-b border-[#f1f1f1] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[760px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-start text-[#111827] active:opacity-60"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px]" />
          </button>

          <h1 className="text-[18px] font-extrabold text-[#111827]">
            Top Authors
          </h1>

          <button
            type="button"
            onClick={() => {
              setSearchOpen((current) => !current)
              if (searchOpen) setKeyword('')
            }}
            className="flex h-8 w-8 items-center justify-end text-[#111827] active:opacity-60"
            aria-label="Search authors"
          >
            <i className="fas fa-search text-[17px]" />
          </button>
        </div>

        {searchOpen ? (
          <div className="mx-auto mt-3 max-w-[760px]">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search author name or username"
              className="h-11 w-full rounded-full bg-[#f4f5f7] px-4 text-[14px] font-semibold text-[#111827] outline-none placeholder:text-[#9ca3af]"
              autoFocus
            />
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="relative overflow-hidden rounded-[22px] bg-[#111827] px-4 py-5 text-white shadow-sm">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-white/5" />

          <div className="relative">
            <div className="text-[18px] font-extrabold">
              Top Authors
            </div>
            <p className="mt-1 max-w-[300px] text-[12px] font-medium leading-5 text-white/70">
              Ranked by followers on Shadow.
            </p>
          </div>
        </section>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-extrabold text-[#111827]">
              {loading
                ? 'Loading authors...'
                : `${filteredAuthors.length} Authors`}
            </h2>

            {!loading && authors.length ? (
              <div className="mt-1 text-[11px] font-semibold text-[#9ca3af]">
                Showing up to the first {MAX_VISIBLE} ranked authors
              </div>
            ) : null}
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'ranking', label: 'Ranking' },
            { key: 'new', label: 'New' },
            { key: 'updated', label: 'Recently Updated' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold active:scale-95 ${
                filter === item.key
                  ? 'bg-black text-white'
                  : 'border border-[#d8dbe3] bg-white text-[#111827]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? <LoadingGrid /> : null}

        {!loading && loadError ? (
          <div className="mt-8 rounded-[20px] bg-[#f8fafc] p-8 text-center">
            <div className="text-[13px] font-bold text-[#6b7280]">
              Failed to load authors.
            </div>

            <button
              type="button"
              onClick={loadAuthors}
              className="mt-4 h-9 rounded-full bg-[#111827] px-5 text-[12px] font-black text-white active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !loadError && visibleAuthors.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {visibleAuthors.map((author, index) => (
              <AuthorCard
                key={author.id}
                author={author}
                fallbackRank={index + 1}
                onOpen={handleOpenAuthor}
                onFollow={handleFollowAuthor}
                followLoading={followLoadingId === author.id}
              />
            ))}
          </div>
        ) : null}

        {!loading && !loadError && !visibleAuthors.length ? (
          <div className="mt-8 rounded-[20px] bg-[#f8fafc] p-8 text-center text-[13px] font-bold text-[#9ca3af]">
            No authors found.
          </div>
        ) : null}

        {!loading && !loadError && canLoadMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
disabled={loadingMore}
            className="mx-auto mt-7 flex h-10 min-w-[150px] items-center justify-center rounded-full bg-[#111827] px-6 text-[13px] font-black text-white active:scale-95"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        ) : null}
      </main>
    </div>
  )
}

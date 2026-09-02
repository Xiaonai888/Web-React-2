import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getHomeCacheKey,
  loadHomeCache,
  saveHomeCache,
} from '../../utils/homeDataCache'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const AUTHOR_SUGGESTION_LIMIT = 12
const AUTHOR_SUGGESTION_CACHE_MAX_AGE_MS =
  10 * 60 * 1000

const authorSuggestionInflightRequests =
  new Map()

function getReaderToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getSuggestionScope(token) {
  if (!token) return 'anon'

  let hash = 2166136261

  for (
    let index = 0;
    index < token.length;
    index += 1
  ) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `reader-${(hash >>> 0).toString(36)}`
}

function getAuthorSuggestionCacheKey(token) {
  return getHomeCacheKey({
    section:
      'discover-author-suggestions',
    scope: getSuggestionScope(token),
    params: {
      limit: AUTHOR_SUGGESTION_LIMIT,
      schema: 1,
    },
  })
}

async function runAuthorSuggestionRequest(
  key,
  request
) {
  if (
    authorSuggestionInflightRequests.has(
      key
    )
  ) {
    return authorSuggestionInflightRequests.get(
      key
    )
  }

  const promise = Promise.resolve().then(
    request
  )

  authorSuggestionInflightRequests.set(
    key,
    promise
  )

  try {
    return await promise
  } finally {
    if (
      authorSuggestionInflightRequests.get(
        key
      ) === promise
    ) {
      authorSuggestionInflightRequests.delete(
        key
      )
    }
  }
}

function normalizeVisibleAuthors(
  suggestions,
  hiddenIds = new Set()
) {
  return (suggestions || [])
    .filter(
      (author) =>
        author?.id &&
        author?.page_username &&
        !author.is_owner &&
        !author.is_following &&
        !hiddenIds.has(
          String(author.id)
        )
    )
    .slice(
      0,
      AUTHOR_SUGGESTION_LIMIT
    )
}

async function saveAuthorSuggestions(
  token,
  authors
) {
  const cacheKey =
    getAuthorSuggestionCacheKey(token)

  await saveHomeCache(
    cacheKey,
    {
      authors,
    },
    {
      maxAgeMs:
        AUTHOR_SUGGESTION_CACHE_MAX_AGE_MS,
    }
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}

function getInitial(value) {
  return String(value || 'A')
    .trim()
    .slice(0, 1)
    .toUpperCase()
}

function formatGenre(value) {
  const text = String(value || '')
    .trim()
    .replace(/[-_]+/g, ' ')

  if (!text) return ''

  return text.replace(
    /\b\w/g,
    (letter) =>
      letter.toUpperCase()
  )
}

async function requestAuthors(
  token,
  path
) {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      headers: token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {},
      cache: 'no-store',
    }
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (
    !response.ok ||
    data.ok === false
  ) {
    throw new Error(
      data.message ||
        'Failed to load authors'
    )
  }

  return Array.isArray(
    data.author_pages
  )
    ? data.author_pages
    : []
}

function AuthorSuggestionSkeleton() {
  return (
    <div className="w-[43%] min-w-[132px] max-w-[164px] shrink-0 rounded-[16px] border border-[#ececf2] bg-white px-3 pb-3 pt-4">
      <div className="mx-auto h-[72px] w-[72px] animate-pulse rounded-full bg-[#eef0f4]" />
      <div className="mx-auto mt-3 h-4 w-24 animate-pulse rounded-full bg-[#eef0f4]" />
      <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded-full bg-[#f3f4f6]" />
      <div className="mt-4 h-9 animate-pulse rounded-[10px] bg-[#ede9fe]" />
    </div>
  )
}

export default function DiscoverAuthorsYouMayLikeSection() {
  const navigate = useNavigate()
  const [authors, setAuthors] =
    useState([])
  const [loading, setLoading] =
    useState(true)
  const [
    followLoadingId,
    setFollowLoadingId,
  ] = useState('')
  const hiddenAuthorIdsRef =
    useRef(new Set())

  useEffect(() => {
    let alive = true

    async function loadSuggestions() {
      const token =
        getReaderToken()
      const cacheKey =
        getAuthorSuggestionCacheKey(
          token
        )
      let hasCachedPayload = false

      try {
        const cached =
          await loadHomeCache(
            cacheKey,
            {
              maxAgeMs:
                AUTHOR_SUGGESTION_CACHE_MAX_AGE_MS,
              allowExpired: true,
            }
          )

        if (!alive) return

        if (
          Array.isArray(
            cached?.data?.authors
          )
        ) {
          hasCachedPayload = true
          const visibleCached =
            normalizeVisibleAuthors(
              cached.data.authors,
              hiddenAuthorIdsRef.current
            )

          setAuthors(visibleCached)
          setLoading(false)

          if (cached.isFresh) {
            return
          }
        }

        if (!hasCachedPayload) {
          setLoading(true)
        }

        let suggestions = []

        if (token) {
          try {
            suggestions =
              await runAuthorSuggestionRequest(
                `discover:${cacheKey}`,
                () =>
                  requestAuthors(
                    token,
                    `/api/authors/discover?limit=${AUTHOR_SUGGESTION_LIMIT}`
                  )
              )
          } catch {
            suggestions = []
          }
        }

        if (!suggestions.length) {
          suggestions =
            await runAuthorSuggestionRequest(
              `top:${cacheKey}`,
              () =>
                requestAuthors(
                  token,
                  '/api/authors/top?limit=20'
                )
            )
        }

        const visibleAuthors =
          normalizeVisibleAuthors(
            suggestions,
            hiddenAuthorIdsRef.current
          )

        if (!alive) return

        setAuthors(visibleAuthors)

        await saveAuthorSuggestions(
          token,
          visibleAuthors
        )
      } catch {
        if (
          alive &&
          !hasCachedPayload
        ) {
          setAuthors([])
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadSuggestions()

    return () => {
      alive = false
    }
  }, [])

  function openAuthor(author) {
    const username = String(
      author?.page_username || ''
    ).trim()

    if (!username) return

    navigate(
      `/author/page/${encodeURIComponent(
        username
      )}`
    )
  }

  function dismissAuthor(authorId) {
    const token =
      getReaderToken()
    const id = String(
      authorId || ''
    )

    if (id) {
      hiddenAuthorIdsRef.current.add(
        id
      )
    }

    setAuthors((current) => {
      const next = current.filter(
        (author) =>
          String(author.id) !== id
      )

      void saveAuthorSuggestions(
        token,
        next
      )

      return next
    })
  }

  async function followAuthor(author) {
    const token =
      getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (
      !author?.id ||
      !author?.page_username ||
      followLoadingId
    ) {
      return
    }

    try {
      setFollowLoadingId(
        author.id
      )

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
          author.page_username
        )}/follow`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to follow author'
        )
      }

      dismissAuthor(author.id)
    } catch {
    } finally {
      setFollowLoadingId('')
    }
  }

  if (
    !loading &&
    !authors.length
  ) {
    return null
  }

  return (
    <section className="bg-white py-4 ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            Discover Authors
          </h2>

          <p className="mt-1 text-[11px] font-normal text-[#98a2b3]">
            Authors selected for your reading interests
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate('/authors/top')
          }
          className="shrink-0 text-[12px] font-semibold text-[#6d5dfc] active:opacity-70"
        >
          See all
        </button>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
        {loading
          ? Array.from({
              length: 4,
            }).map((_, index) => (
              <AuthorSuggestionSkeleton
                key={index}
              />
            ))
          : authors.map((author) => {
              const name =
                author.page_name ||
                'Author'
              const followers =
                formatCompactNumber(
                  author.total_followers
                )
              const genres = (
                Array.isArray(
                  author.primary_genres
                )
                  ? author.primary_genres
                  : []
              )
                .slice(0, 2)
                .map(formatGenre)
                .filter(Boolean)
                .join(' · ')
              const stories = Number(
                author.total_stories || 0
              )
              const busy =
                followLoadingId ===
                author.id

              return (
                <article
                  key={author.id}
                  className="relative w-[43%] min-w-[132px] max-w-[164px] shrink-0 rounded-[16px] border border-[#ececf2] bg-white px-3 pb-3 pt-4 shadow-[0_5px_18px_rgba(17,24,39,0.05)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      dismissAuthor(
                        author.id
                      )
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-[#667085] active:bg-[#f3f4f6]"
                    aria-label={`Hide ${name}`}
                  >
                    <i className="fa-solid fa-xmark text-[13px]" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openAuthor(author)
                    }
                    className="block w-full text-center"
                  >
                    <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#ede9fe] via-[#f5f3ff] to-[#ddd6fe] text-[21px] font-semibold text-[#6d28d9] ring-1 ring-black/5">
                      {author.avatar_url ? (
                        <img
                          src={
                            author.avatar_url
                          }
                          alt={name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitial(name)
                      )}
                    </div>

                    <div className="mt-3 line-clamp-1 text-[14px] font-semibold text-[#111827]">
                      {name}
                    </div>

                    <div className="mt-1 line-clamp-1 min-h-[16px] text-[10px] font-normal text-[#8d94a1]">
                      {genres ||
                        author.reason ||
                        `${stories} ${
                          stories === 1
                            ? 'story'
                            : 'stories'
                        }`}
                    </div>

                    <div className="mt-1 text-[10px] font-normal text-[#98a2b3]">
                      {followers}{' '}
                      {Number(
                        author.total_followers ||
                          0
                      ) === 1
                        ? 'follower'
                        : 'followers'}
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      followAuthor(author)
                    }
                    className="mt-4 h-9 w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-[12px] font-semibold text-white shadow-[0_6px_16px_rgba(139,92,246,0.28)] active:scale-[0.98] disabled:opacity-60"
                  >
                    {busy ? (
                      <>
                        <i className="fa-solid fa-circle-notch mr-1.5 animate-spin text-[10px]" />
                        Following
                      </>
                    ) : (
                      'Follow'
                    )}
                  </button>
                </article>
              )
            })}
      </div>
    </section>
  )
}

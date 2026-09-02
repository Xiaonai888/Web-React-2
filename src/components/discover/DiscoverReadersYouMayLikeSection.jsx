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

const INITIAL_LIMIT = 12
const READER_SUGGESTION_CACHE_MAX_AGE_MS =
  5 * 60 * 1000

const readerSuggestionInflightRequests =
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

function getReaderSuggestionCacheKey(
  token,
  limit
) {
  return getHomeCacheKey({
    section:
      'discover-reader-suggestions',
    scope: getSuggestionScope(token),
    params: {
      limit,
      schema: 1,
    },
  })
}

async function runReaderSuggestionRequest(
  key,
  request
) {
  if (
    readerSuggestionInflightRequests.has(
      key
    )
  ) {
    return readerSuggestionInflightRequests.get(
      key
    )
  }

  const promise = Promise.resolve().then(
    request
  )

  readerSuggestionInflightRequests.set(
    key,
    promise
  )

  try {
    return await promise
  } finally {
    if (
      readerSuggestionInflightRequests.get(
        key
      ) === promise
    ) {
      readerSuggestionInflightRequests.delete(
        key
      )
    }
  }
}

function normalizeVisibleReaders(
  users,
  hiddenIds = new Set(),
  limit = INITIAL_LIMIT
) {
  return (users || [])
    .filter(
      (reader) =>
        reader?.id &&
        reader?.username &&
        !reader.is_following &&
        !hiddenIds.has(
          String(reader.id)
        )
    )
    .slice(0, limit)
}

async function saveReaderSuggestions(
  token,
  readers,
  limit = INITIAL_LIMIT
) {
  const cacheKey =
    getReaderSuggestionCacheKey(
      token,
      limit
    )

  await saveHomeCache(
    cacheKey,
    {
      readers,
    },
    {
      maxAgeMs:
        READER_SUGGESTION_CACHE_MAX_AGE_MS,
    }
  )
}

function getInitial(value) {
  return String(value || 'R')
    .trim()
    .slice(0, 1)
    .toUpperCase()
}

function getReaderMeta(reader) {
  return (
    String(reader?.bio || '').trim() ||
    String(reader?.work || '').trim() ||
    String(reader?.location || '').trim() ||
    'Shadow reader'
  )
}

function ReaderSuggestionSkeleton() {
  return (
    <div className="w-[43%] min-w-[132px] max-w-[164px] shrink-0 rounded-[16px] border border-[#ececf2] bg-white px-3 pb-3 pt-4">
      <div className="mx-auto h-[72px] w-[72px] animate-pulse rounded-full bg-[#eef0f4]" />
      <div className="mx-auto mt-3 h-4 w-24 animate-pulse rounded-full bg-[#eef0f4]" />
      <div className="mx-auto mt-2 h-3 w-20 animate-pulse rounded-full bg-[#f3f4f6]" />
      <div className="mx-auto mt-2 h-3 w-16 animate-pulse rounded-full bg-[#f3f4f6]" />
      <div className="mt-4 h-9 animate-pulse rounded-[10px] bg-[#ede9fe]" />
    </div>
  )
}

export default function DiscoverReadersYouMayLikeSection() {
  const navigate = useNavigate()
  const [readers, setReaders] =
    useState([])
  const [loading, setLoading] =
    useState(true)
  const [
    followLoadingId,
    setFollowLoadingId,
  ] = useState('')
  const hiddenReaderIdsRef =
    useRef(new Set())

  async function loadSuggestions(
    limit = INITIAL_LIMIT
  ) {
    const token = getReaderToken()

    if (!token) {
      setReaders([])
      setLoading(false)
      return
    }

    const cacheKey =
      getReaderSuggestionCacheKey(
        token,
        limit
      )
    let hasCachedPayload = false

    try {
      const cached =
        await loadHomeCache(
          cacheKey,
          {
            maxAgeMs:
              READER_SUGGESTION_CACHE_MAX_AGE_MS,
            allowExpired: true,
          }
        )

      if (
        Array.isArray(
          cached?.data?.readers
        )
      ) {
        hasCachedPayload = true
        const visibleCached =
          normalizeVisibleReaders(
            cached.data.readers,
            hiddenReaderIdsRef.current,
            limit
          )

        setReaders(visibleCached)
        setLoading(false)

        if (cached.isFresh) {
          return
        }
      }

      if (!hasCachedPayload) {
        setLoading(true)
      }

      const data =
        await runReaderSuggestionRequest(
          cacheKey,
          async () => {
            const response =
              await fetch(
                `${API_BASE_URL}/api/users/suggestions?limit=${limit}`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                  cache: 'no-store',
                }
              )

            const payload =
              await response
                .json()
                .catch(() => ({}))

            if (
              !response.ok ||
              payload.ok === false
            ) {
              throw new Error(
                payload.message ||
                  'Failed to load readers'
              )
            }

            return payload
          }
        )

      const nextReaders =
        normalizeVisibleReaders(
          Array.isArray(data.users)
            ? data.users
            : [],
          hiddenReaderIdsRef.current,
          limit
        )

      setReaders(nextReaders)

      await saveReaderSuggestions(
        token,
        nextReaders,
        limit
      )
    } catch {
      if (!hasCachedPayload) {
        setReaders([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuggestions()
  }, [])

  function openReader(reader) {
    const username = String(
      reader?.username || ''
    ).trim()

    if (!username) return

    navigate(
      `/profile?username=${encodeURIComponent(
        username
      )}`
    )
  }

  function dismissReader(readerId) {
    const token =
      getReaderToken()
    const id = String(
      readerId || ''
    )

    if (id) {
      hiddenReaderIdsRef.current.add(
        id
      )
    }

    setReaders((current) => {
      const next = current.filter(
        (reader) =>
          String(reader.id) !== id
      )

      void saveReaderSuggestions(
        token,
        next
      )

      return next
    })
  }

  async function followReader(reader) {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (
      !reader?.id ||
      !reader?.username ||
      followLoadingId
    ) {
      return
    }

    try {
      setFollowLoadingId(reader.id)

      const response = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(
          reader.username
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
            'Failed to follow reader'
        )
      }

      dismissReader(reader.id)
    } catch {
    } finally {
      setFollowLoadingId('')
    }
  }

  if (
    !loading &&
    !readers.length
  ) {
    return null
  }

  return (
    <section className="bg-white py-4 ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-[#111827]">
            Readers You May Like
          </h2>

          <p className="mt-1 text-[11px] font-normal text-[#98a2b3]">
            Readers selected from the Shadow community
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate('/profile/discover-people')
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
              <ReaderSuggestionSkeleton
                key={index}
              />
            ))
          : readers.map((reader) => {
              const name =
                reader.name ||
                reader.username ||
                'Reader'
              const username =
                String(
                  reader.username || ''
                ).trim()
              const meta =
                getReaderMeta(reader)
              const busy =
                followLoadingId ===
                reader.id

              return (
                <article
                  key={reader.id}
                  className="relative w-[43%] min-w-[132px] max-w-[164px] shrink-0 rounded-[16px] border border-[#ececf2] bg-white px-3 pb-3 pt-4 shadow-[0_5px_18px_rgba(17,24,39,0.05)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      dismissReader(
                        reader.id
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
                      openReader(reader)
                    }
                    className="block w-full text-center"
                  >
                    <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#ede9fe] via-[#f5f3ff] to-[#ddd6fe] text-[21px] font-semibold text-[#6d28d9] ring-1 ring-black/5">
                      {reader.avatar_url ? (
                        <img
                          src={
                            reader.avatar_url
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
                      {meta}
                    </div>

                    <div className="mt-1 line-clamp-1 text-[10px] font-normal text-[#98a2b3]">
                      @{username}
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      followReader(reader)
                    }
                    className="mt-4 h-9 w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-[12px] font-semibold text-white active:scale-[0.98] disabled:opacity-60"
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

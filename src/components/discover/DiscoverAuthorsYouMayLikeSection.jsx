import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(
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

function AuthorSuggestionSkeleton() {
  return (
    <div className="w-[164px] shrink-0 overflow-hidden rounded-[12px] border border-gray-100 bg-white">
      <div className="h-[52px] animate-pulse bg-gray-100" />
      <div className="-mt-7 px-3 pb-3 text-center">
        <div className="mx-auto h-[58px] w-[58px] animate-pulse rounded-full bg-gray-100 ring-4 ring-white" />
        <div className="mx-auto mt-3 h-3.5 w-24 animate-pulse rounded-full bg-gray-100" />
        <div className="mx-auto mt-2 h-3 w-16 animate-pulse rounded-full bg-gray-100" />
        <div className="mt-3 h-8 animate-pulse rounded-[8px] bg-gray-100" />
      </div>
    </div>
  )
}

export default function DiscoverAuthorsYouMayLikeSection() {
  const navigate = useNavigate()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [followLoadingId, setFollowLoadingId] = useState('')

  useEffect(() => {
    let alive = true

    async function loadSuggestions() {
      try {
        setLoading(true)

        const token = getReaderToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/top?limit=20`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || 'Failed to load author suggestions'
          )
        }

        const suggestions = (
          Array.isArray(data.author_pages)
            ? data.author_pages
            : []
        )
          .filter(
            (author) =>
              author?.id &&
              author?.page_username &&
              !author.is_owner &&
              !author.is_following
          )
          .slice(0, 8)

        if (alive) {
          setAuthors(suggestions)
        }
      } catch {
        if (alive) {
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
    if (!author?.page_username) return

    navigate(
      `/author/page/${encodeURIComponent(
        author.page_username
      )}`
    )
  }

  async function followAuthor(author) {
    const token = getReaderToken()

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
        throw new Error(
          data.message || 'Failed to follow author'
        )
      }

      setAuthors((current) =>
        current.filter((item) => item.id !== author.id)
      )
    } catch {
    } finally {
      setFollowLoadingId('')
    }
  }

  if (!loading && !authors.length) return null

  return (
    <article className="bg-white py-4 ring-1 ring-gray-100 sm:rounded-[12px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold text-[#111827]">
            Authors You May Like
          </div>
          <div className="mt-1 text-[11px] font-normal text-gray-400">
            Discover authors and follow their latest posts
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/authors/top')}
          className="shrink-0 text-[12px] font-semibold text-gray-500 active:scale-95"
        >
          More
        </button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <AuthorSuggestionSkeleton key={index} />
            ))
          : authors.map((author) => {
              const name = author.page_name || 'Author'
              const username =
                author.page_username || 'author'
              const followers = formatCompactNumber(
                author.total_followers
              )
              const stories = Number(
                author.total_stories || 0
              )
              const isFollowing =
                followLoadingId === author.id

              return (
                <article
                  key={author.id}
                  className="w-[164px] shrink-0 overflow-hidden rounded-[12px] border border-gray-100 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => openAuthor(author)}
                    className="block w-full text-left"
                  >
                    <div className="relative h-[52px] overflow-hidden bg-gradient-to-br from-[#fff1f2] via-[#eef2ff] to-[#ecfeff]">
                      {author.cover_url ? (
                        <img
                          src={author.cover_url}
                          alt={name}
                          className="h-full w-full object-cover opacity-80"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <>
                          <div className="absolute -right-5 -top-7 h-16 w-16 rounded-full bg-white/55" />
                          <div className="absolute -bottom-8 left-4 h-20 w-20 rounded-full bg-white/35" />
                        </>
                      )}
                    </div>

                    <div className="-mt-7 px-3 text-center">
                      <div className="relative mx-auto flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-full bg-[#f4f5f7] text-[18px] font-black text-[#111827] ring-4 ring-white">
                        {author.avatar_url ? (
                          <img
                            src={author.avatar_url}
                            alt={name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          getInitial(name)
                        )}
                      </div>

                      <div className="mt-2 line-clamp-1 text-[12px] font-semibold text-[#111827]">
                        {name}
                      </div>

                      <div className="mt-1 line-clamp-1 text-[10px] font-normal text-gray-400">
                        @{username}
                      </div>

                      <div className="mt-2 text-[10px] font-normal text-gray-400">
                        {followers} followers · {stories}{' '}
                        {stories === 1 ? 'story' : 'stories'}
                      </div>
                    </div>
                  </button>

                  <div className="px-3 pb-3 pt-3">
                    <button
                      type="button"
                      disabled={isFollowing}
                      onClick={() => followAuthor(author)}
                      className="h-8 w-full rounded-[8px] bg-[#111111] text-[11px] font-semibold text-white active:scale-95 disabled:opacity-60"
                    >
                      {isFollowing ? 'Following...' : 'Follow'}
                    </button>
                  </div>
                </article>
              )
            })}
      </div>
    </article>
  )
}

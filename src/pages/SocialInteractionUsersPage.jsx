import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTION_META = {
  love: { label: 'Love', src: '/assets/React/Love.svg' },
  haha: { label: 'Haha', src: '/assets/React/Haha.svg' },
  wow: { label: 'Wow', src: '/assets/React/Wow.svg' },
  sad: { label: 'Sad', src: '/assets/React/Sad.svg' },
  angry: { label: 'Angry', src: '/assets/React/Angry.svg' },
  support: { label: 'Support', src: '/assets/React/Support.svg' },
  touched: { label: 'Touched', src: '/assets/React/Touched.svg' },
}

const SOURCE_LABELS = {
  episode: 'Episode',
  story: 'Story',
  author_post: 'Author post',
  reader_post: 'Reader post',
}

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function normalizeSourceType(value) {
  const type = String(value || '')
    .trim()
    .toLowerCase()
    .replaceAll('-', '_')

  return SOURCE_LABELS[type] ? type : ''
}

function normalizeInteractionType(value) {
  const type = String(value || '').trim().toLowerCase()

  if (type === 'like' || type === 'likes' || type === 'reaction' || type === 'reactions') {
    return 'like'
  }

  if (type === 'echo' || type === 'echoes' || type === 'share' || type === 'shares') {
    return 'echo'
  }

  return ''
}

function buildEndpoint(sourceType, interactionType, sourceId) {
  const id = encodeURIComponent(sourceId)

  if (sourceType === 'episode' && interactionType === 'like') {
    return `/api/reactions/episode/${id}`
  }

  if (sourceType === 'episode' && interactionType === 'echo') {
    return `/api/echoes/episode/${id}`
  }

  if (sourceType === 'story' && interactionType === 'like') {
    return `/api/reactions/story/${id}/users`
  }

  if (sourceType === 'story' && interactionType === 'echo') {
    return `/api/echoes/story/${id}`
  }

  if (sourceType === 'author_post' && interactionType === 'like') {
    return `/api/authors/page/posts/${id}/reactions`
  }

  if (sourceType === 'author_post' && interactionType === 'echo') {
    return `/api/authors/page/posts/${id}/echoes`
  }

  if (sourceType === 'reader_post' && interactionType === 'like') {
    return `/api/reader-posts/${id}/reactions`
  }

  if (sourceType === 'reader_post' && interactionType === 'echo') {
    return `/api/reader-posts/${id}/echoes`
  }

  return ''
}

function normalizeUser(value, fallbackId = '') {
  const user = value || {}

  return {
    id: user.id || user.user_id || fallbackId,
    name: user.name || user.display_name || user.username || 'Reader',
    username: user.username || '',
    avatar_url: user.avatar_url || user.avatar || user.photo_url || '',
  }
}

function normalizeItem(item, interactionType) {
  const user = normalizeUser(
    item?.user || item?.reader || item?.profile || item,
    item?.user_id || ''
  )

  return {
    id:
      item?.id ||
      `${user.id}-${item?.created_at || item?.reaction_type || interactionType}`,
    user,
    reaction_type: String(item?.reaction_type || item?.type || 'love').toLowerCase(),
    created_at: item?.created_at || '',
  }
}

function extractItems(data, interactionType) {
  const source =
    data?.reactions ||
    data?.echoes ||
    data?.users ||
    data?.items ||
    data?.results ||
    []

  return Array.isArray(source)
    ? source.map((item) => normalizeItem(item, interactionType))
    : []
}

function mergeUnique(current, incoming) {
  const result = []
  const seen = new Set()

  for (const item of [...current, ...incoming]) {
    const key = String(item?.id || `${item?.user?.id}-${item?.created_at}`)

    if (!key || seen.has(key)) continue

    seen.add(key)
    result.push(item)
  }

  return result
}

function Avatar({ user }) {
  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.name}
        className="h-12 w-12 rounded-full object-cover ring-1 ring-black/5"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[15px] font-bold text-white">
      {user.name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export default function SocialInteractionUsersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const sourceType = normalizeSourceType(params.sourceType)
  const interactionType = normalizeInteractionType(params.interactionType)
  const sourceId = String(params.sourceId || '').trim()
  const endpoint = useMemo(
    () => buildEndpoint(sourceType, interactionType, sourceId),
    [sourceId, sourceType, interactionType]
  )

  const [items, setItems] = useState([])
  const [counts, setCounts] = useState({})
  const [activeReaction, setActiveReaction] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')

  const title =
    interactionType === 'echo'
      ? 'People who echoed'
      : 'People who liked'

  const sourceLabel = SOURCE_LABELS[sourceType] || 'Content'
  const sourceName =
    location.state?.sourceName ||
    location.state?.title ||
    ''

  const loadPage = useCallback(
    async (nextPage, append = false) => {
      if (!endpoint) {
        setItems([])
        setLoading(false)
        setMessage('This interaction page is not available.')
        return
      }

      append ? setLoadingMore(true) : setLoading(true)
      setMessage('')

      try {
        const token = getReaderToken()
        const response = await fetch(
          `${API_BASE_URL}${endpoint}?page=${nextPage}&limit=50`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
            cache: 'no-store',
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load people')
        }

        const nextItems = extractItems(data, interactionType)
        const nextTotal = Math.max(
          0,
          Number(
            data.total ??
              data.count ??
              data.total_likes ??
              data.total_echoes ??
              nextItems.length
          )
        )

        setItems((current) =>
          append ? mergeUnique(current, nextItems) : nextItems
        )
        setCounts(
          data.counts && typeof data.counts === 'object'
            ? data.counts
            : {}
        )
        setPage(nextPage)
        setTotal(nextTotal)
        setHasMore(
          typeof data.has_more === 'boolean'
            ? data.has_more
            : nextPage * 50 < nextTotal
        )
      } catch (error) {
        if (!append) setItems([])
        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to backend.'
            : error.message || 'Failed to load people'
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [endpoint, interactionType]
  )

  useEffect(() => {
    setItems([])
    setCounts({})
    setActiveReaction('all')
    setPage(1)
    setTotal(0)
    setHasMore(false)
    loadPage(1)
  }, [loadPage])

  const reactionTabs = useMemo(() => {
    if (interactionType !== 'like') return []

    const available = Object.entries(REACTION_META)
      .filter(([type]) => Number(counts[type] || 0) > 0)
      .map(([type, meta]) => ({
        type,
        label: meta.label,
        src: meta.src,
        count: Number(counts[type] || 0),
      }))

    return [
      {
        type: 'all',
        label: 'All',
        src: '',
        count: total,
      },
      ...available,
    ]
  }, [counts, interactionType, total])

  const visibleItems = useMemo(() => {
    if (interactionType !== 'like' || activeReaction === 'all') {
      return items
    }

    return items.filter(
      (item) => item.reaction_type === activeReaction
    )
  }, [activeReaction, interactionType, items])

  const openProfile = (user) => {
    if (!user?.username) return

    navigate(
      `/profile?username=${encodeURIComponent(user.username)}`
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-[44px_1fr_44px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-[17px] font-bold">
              {title}
            </h1>
            <p className="mt-0.5 truncate text-[10.5px] font-medium text-[#98a2b3]">
              {sourceName || sourceLabel}
              {total > 0 ? ` · ${total.toLocaleString()}` : ''}
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>

        {reactionTabs.length > 1 ? (
          <div className="overflow-x-auto">
            <div className="mx-auto flex min-w-max max-w-3xl px-3">
              {reactionTabs.map((tab) => {
                const active = activeReaction === tab.type

                return (
                  <button
                    key={tab.type}
                    type="button"
                    onClick={() => setActiveReaction(tab.type)}
                    className={`relative flex h-14 items-center gap-1.5 px-3 text-[13px] font-semibold ${
                      active
                        ? 'text-[#111827]'
                        : 'text-[#98a2b3]'
                    }`}
                  >
                    {tab.src ? (
                      <img
                        src={tab.src}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ) : null}
                    <span>{tab.label}</span>
                    <span>{tab.count.toLocaleString()}</span>
                    {active ? (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#111827]" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </header>

      <section className="mx-auto max-w-3xl px-4 py-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 py-3"
              >
                <div className="h-12 w-12 rounded-full bg-[#eef1f5]" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-36 rounded-full bg-[#eef1f5]" />
                  <div className="mt-2 h-3 w-24 rounded-full bg-[#f3f4f6]" />
                </div>
              </div>
            ))}
          </div>
        ) : message ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
              <i className="fa-solid fa-triangle-exclamation text-[21px]" />
            </div>
            <div className="mt-4 text-[14px] font-semibold text-[#667085]">
              {message}
            </div>
            <button
              type="button"
              onClick={() => loadPage(1)}
              className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[12px] font-bold text-white active:scale-95"
            >
              Try again
            </button>
          </div>
        ) : visibleItems.length ? (
          <div>
            {visibleItems.map((item) => {
              const meta =
                REACTION_META[item.reaction_type] ||
                REACTION_META.love
              const canOpenProfile = Boolean(item.user.username)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openProfile(item.user)}
                  disabled={!canOpenProfile}
                  className="flex w-full items-center gap-3 border-b border-[#f2f4f7] py-3 text-left active:bg-[#f8fafc] disabled:cursor-default"
                >
                  <div className="relative shrink-0">
                    <Avatar user={item.user} />
                    {interactionType === 'like' ? (
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                        <img
                          src={meta.src}
                          alt={meta.label}
                          className="h-5 w-5 object-contain"
                        />
                      </span>
                    ) : (
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm ring-2 ring-white">
                        <img
                          src="/assets/Icons/echo.svg"
                          alt=""
                          className="h-3.5 w-3.5 object-contain brightness-0 invert"
                        />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold">
                      {item.user.name}
                    </div>
                    {item.user.username ? (
                      <div className="mt-0.5 truncate text-[12px] font-medium text-[#98a2b3]">
                        @{item.user.username}
                      </div>
                    ) : null}
                  </div>

                  {canOpenProfile ? (
                    <i className="fa-solid fa-chevron-right text-[10px] text-[#c1c7d0]" />
                  ) : null}
                </button>
              )
            })}

            {hasMore ? (
              <button
                type="button"
                onClick={() => loadPage(page + 1, true)}
                disabled={loadingMore}
                className="mt-4 h-11 w-full rounded-full bg-[#f3f4f6] text-[13px] font-semibold text-[#111827] active:scale-[0.99] disabled:opacity-60"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i
                className={`fa-solid ${
                  interactionType === 'echo'
                    ? 'fa-rotate'
                    : 'fa-heart'
                } text-[21px]`}
              />
            </div>
            <div className="mt-4 text-[16px] font-semibold">
              {interactionType === 'echo'
                ? 'No echoes yet'
                : 'No likes yet'}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

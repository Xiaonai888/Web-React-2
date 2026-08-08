import {
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname ===
    'localhost' ||
  window.location.hostname ===
    '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PAGE_LIMIT = 20

function getAuthToken() {
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

function formatTime(value) {
  const timestamp = new Date(
    value || 0
  ).getTime()

  if (!timestamp) return 'Just now'

  const difference = Math.max(
    0,
    Date.now() - timestamp
  )
  const minutes = Math.floor(
    difference / 60000
  )
  const hours = Math.floor(
    minutes / 60
  )
  const days = Math.floor(
    hours / 24
  )

  if (minutes < 1) return 'Just now'
  if (minutes < 60) {
    return `${minutes}m`
  }
  if (hours < 24) {
    return `${hours}h`
  }
  if (days < 7) {
    return `${days}d`
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: 'short',
      day: 'numeric',
    }
  ).format(new Date(timestamp))
}

function mergeUnique(
  current,
  incoming
) {
  const map = new Map()

  for (const item of [
    ...current,
    ...incoming,
  ]) {
    if (!item?.id) continue
    map.set(String(item.id), item)
  }

  return [...map.values()]
}

function ReaderAvatar({ user }) {
  const name =
    user?.name ||
    user?.username ||
    'Reader'
  const avatar =
    user?.avatar_url || ''

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eceaf2] text-[15px] font-semibold text-[#111827]">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        name
          .slice(0, 1)
          .toUpperCase()
      )}
    </div>
  )
}

function SourcePreview({
  source,
  onOpen,
}) {
  if (!source) return null

  const image =
    source.image_url ||
    source.image_urls?.[0] ||
    ''
  const title =
    source.name ||
    source.label ||
    'Shared content'
  const content = String(
    source.content || ''
  ).trim()

  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-3 flex w-full items-start gap-3 rounded-[16px] bg-[#f7f7fa] p-3 text-left ring-1 ring-black/5 active:scale-[0.995] dark:bg-white/5 dark:ring-white/10"
    >
      {image ? (
        <img
          src={image}
          alt=""
          className="h-16 w-16 shrink-0 rounded-[12px] object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[12px] bg-[#eceaf2] text-[#667085] dark:bg-white/10 dark:text-white/60">
          <i className="fa-solid fa-link text-[17px]" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13.5px] font-semibold text-[#111827] dark:text-white">
          {title}
        </div>

        <div className="mt-1 text-[11px] font-normal uppercase tracking-[0.06em] text-[#8d94a1] dark:text-white/45">
          {source.label ||
            source.type ||
            'Echo source'}
        </div>

        {content ? (
          <p className="mt-1.5 line-clamp-2 whitespace-pre-wrap break-words text-[12.5px] leading-5 text-[#667085] dark:text-white/55">
            {content}
          </p>
        ) : null}
      </div>

      <i className="fa-solid fa-chevron-right mt-1 shrink-0 text-[11px] text-[#b5bac5] dark:text-white/30" />
    </button>
  )
}

function ReceivedEchoCard({
  echo,
  onOpenSource,
}) {
  const user = echo?.user || {}
  const destination =
    echo?.destination === 'circle'
      ? 'Circle'
      : 'Sent to you'
  const text = String(
    echo?.echo_text || ''
  ).trim()

  return (
    <article className="border-b border-[#eeeeF3] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#12141d]">
      <div className="flex items-start gap-3">
        <ReaderAvatar user={user} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[14px] font-semibold text-[#111827] dark:text-white">
                {user.name ||
                  user.username ||
                  'Reader'}
              </div>

              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#98a2b3] dark:text-white/45">
                <span>{destination}</span>
                <span>·</span>
                <span>
                  {formatTime(
                    echo.updated_at ||
                      echo.created_at
                  )}
                </span>
              </div>
            </div>

            <span className="rounded-full bg-[#f1ecff] px-2.5 py-1 text-[10.5px] font-semibold text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
              Echo
            </span>
          </div>

          {text ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-6 text-[#20232d] dark:text-white/85">
              {text}
            </p>
          ) : null}
        </div>
      </div>

      <SourcePreview
        source={echo?.source}
        onOpen={() =>
          onOpenSource(
            echo?.source?.url
          )
        }
      />
    </article>
  )
}

export default function ReceivedEchoesPage() {
  const navigate = useNavigate()
  const [echoes, setEchoes] =
    useState([])
  const [page, setPage] =
    useState(1)
  const [hasMore, setHasMore] =
    useState(false)
  const [loading, setLoading] =
    useState(true)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [error, setError] =
    useState('')

  async function loadPage(
    nextPage,
    signal
  ) {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', {
        replace: true,
      })
      return
    }

    const response = await fetch(
      `${API_BASE_URL}/api/echo-v2/received?page=${nextPage}&limit=${PAGE_LIMIT}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
        cache: 'no-store',
        signal,
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
          'Failed to load received echoes'
      )
    }

    const rows = Array.isArray(
      data.echoes
    )
      ? data.echoes
      : []

    setEchoes((current) =>
      nextPage === 1
        ? rows
        : mergeUnique(
            current,
            rows
          )
    )
    setPage(nextPage)
    setHasMore(
      Boolean(data.has_more)
    )
  }

  useEffect(() => {
    const controller =
      new AbortController()
    let active = true

    setLoading(true)
    setError('')

    loadPage(
      1,
      controller.signal
    )
      .catch((loadError) => {
        if (
          active &&
          loadError?.name !==
            'AbortError'
        ) {
          setError(
            loadError.message ||
              'Failed to load received echoes'
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  async function handleLoadMore() {
    if (
      loadingMore ||
      !hasMore
    ) {
      return
    }

    try {
      setLoadingMore(true)
      setError('')
      await loadPage(page + 1)
    } catch (loadError) {
      setError(
        loadError.message ||
          'Failed to load more echoes'
      )
    } finally {
      setLoadingMore(false)
    }
  }

  function openSource(url) {
    const value = String(
      url || ''
    ).trim()

    if (!value) return

    if (
      /^https?:\/\//i.test(value)
    ) {
      window.open(
        value,
        '_blank',
        'noopener,noreferrer'
      )
      return
    }

    navigate(value)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-30 border-b border-[#ececf1] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#12141d]/95">
        <div className="mx-auto flex h-[58px] max-w-[620px] items-center px-3">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f4f4f6] dark:text-white dark:active:bg-white/10"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <h1 className="ml-1 text-[18px] font-semibold text-[#111827] dark:text-white">
            Received Echoes
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] overflow-hidden bg-white dark:bg-[#12141d]">
        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#7c3aed]" />
          </div>
        ) : error &&
          !echoes.length ? (
          <div className="px-6 py-16 text-center">
            <div className="text-[14px] font-semibold text-[#111827] dark:text-white">
              Could not load Echoes
            </div>
            <div className="mt-2 text-[12.5px] leading-5 text-[#8d94a1] dark:text-white/50">
              {error}
            </div>
          </div>
        ) : !echoes.length ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ecff] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
              <i className="fa-solid fa-wave-square text-[20px]" />
            </div>
            <div className="mt-4 text-[15px] font-semibold text-[#111827] dark:text-white">
              No received Echoes yet
            </div>
            <div className="mt-1.5 text-[12.5px] leading-5 text-[#8d94a1] dark:text-white/50">
              Echoes sent directly to you or your circle will appear here.
            </div>
          </div>
        ) : (
          <>
            {echoes.map((echo) => (
              <ReceivedEchoCard
                key={echo.id}
                echo={echo}
                onOpenSource={
                  openSource
                }
              />
            ))}

            {error ? (
              <div className="px-4 py-3 text-center text-[12px] text-[#dc2626]">
                {error}
              </div>
            ) : null}

            {hasMore ? (
              <div className="px-4 py-5">
                <button
                  type="button"
                  onClick={
                    handleLoadMore
                  }
                  disabled={
                    loadingMore
                  }
                  className="h-11 w-full rounded-full bg-[#111827] text-[13px] font-semibold text-white active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-[#111827]"
                >
                  {loadingMore
                    ? 'Loading...'
                    : 'Load more'}
                </button>
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  )
}

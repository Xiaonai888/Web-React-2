import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function formatDate(value) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}

function Avatar({ user, size = 'h-12 w-12' }) {
  const name = user?.name || user?.username || 'Reader'
  const avatar = user?.avatar_url || ''

  if (avatar) {
    return <img src={avatar} alt={name} className={`${size} rounded-full object-cover ring-1 ring-black/5`} />
  }

  return (
    <div className={`${size} flex items-center justify-center rounded-full bg-[#17131f] text-[15px] font-black text-white`}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function AudienceBadge({ audience }) {
  const items = {
    public: ['fa-solid fa-earth-americas', 'Public'],
    followers: ['fa-solid fa-user-check', 'Followers'],
    'close-readers': ['fa-solid fa-star', 'Close readers'],
    'only-me': ['fa-solid fa-lock', 'Only me'],
  }
  const [icon, label] = items[audience] || items.public

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1edf9] px-2.5 py-1 text-[10px] font-bold text-[#7658a6]">
      <i className={`${icon} text-[9px]`} />
      {label}
    </span>
  )
}

function SourceCard({ story, episode, author, total, onOpen }) {
  const cover = episode?.cover_url || story?.cover_url || story?.landscape_thumbnail_url || ''

  return (
    <section className="border-b border-[#ece8f3] bg-white px-4 pb-5 pt-3">
      <button type="button" onClick={onOpen} className="flex w-full items-start gap-3 text-left active:scale-[0.995]">
        <div className="h-[78px] w-[58px] shrink-0 overflow-hidden rounded-[12px] bg-[#eeeaf5] ring-1 ring-black/5">
          {cover ? (
            <img src={cover} alt={story?.title || 'Story'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#9b91aa]">
              <i className="fa-regular fa-bookmark text-[20px]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="line-clamp-1 text-[15px] font-black text-[#17131f]">
            {story?.title || 'Untitled story'}
          </div>
          <div className="mt-1 line-clamp-1 text-[13px] font-semibold text-[#766f80]">
            {episode?.episode_number ? `Episode ${episode.episode_number}: ` : ''}
            {episode?.title || 'Episode'}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#9b93a5]">
            <span>{author?.page_name || 'Shadow Author'}</span>
            <span className="h-1 w-1 rounded-full bg-[#c8c1d1]" />
            <span>{Number(total || 0).toLocaleString()} {Number(total || 0) === 1 ? 'echo' : 'echoes'}</span>
          </div>
        </div>

        <i className="fa-solid fa-chevron-right mt-7 text-[11px] text-[#a79fb2]" />
      </button>
    </section>
  )
}

function EchoCard({ echo, onOpenEpisode, onShare, onCopy }) {
  const user = echo?.user || {}
  const name = user.name || user.username || 'Reader'

  return (
    <article className="rounded-[22px] bg-white p-4 shadow-[0_8px_24px_rgba(45,35,64,0.06)] ring-1 ring-[#ebe6f2]">
      <div className="flex items-start gap-3">
        <Avatar user={user} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="line-clamp-1 text-[15px] font-black text-[#17131f]">{name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px] font-semibold text-[#9b93a5]">
                <span>{formatDate(echo.created_at)}</span>
                <span className="h-1 w-1 rounded-full bg-[#cbc4d4]" />
                <AudienceBadge audience={echo.audience} />
              </div>
            </div>

            <button
              type="button"
              onClick={onCopy}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8f879a] active:bg-[#f5f2f9]"
              aria-label="Copy episode link"
            >
              <i className="fa-solid fa-ellipsis text-[13px]" />
            </button>
          </div>
        </div>
      </div>

      {echo.echo_text ? (
        <p className="mt-4 whitespace-pre-wrap break-words text-[14px] font-medium leading-6 text-[#38313f]">
          {echo.echo_text}
        </p>
      ) : (
        <p className="mt-4 text-[13px] font-semibold italic text-[#9a92a4]">Shared this episode without a message.</p>
      )}

      <div className="mt-4 overflow-hidden rounded-[17px] bg-[#f7f4fa] ring-1 ring-[#ebe6f2]">
        <button type="button" onClick={onOpenEpisode} className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-[#f0ebf6]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#17131f] text-white">
            <i className="fa-solid fa-book-open text-[14px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[12px] font-black text-[#17131f]">Open original episode</div>
            <div className="mt-0.5 line-clamp-1 text-[10.5px] font-semibold text-[#91889b]">
              Echoed to {String(echo.destination || 'feed').replace('-', ' ')}
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-[10px] text-[#a79fb2]" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#f0ecf4] pt-3">
        <button
          type="button"
          onClick={onOpenEpisode}
          className="flex h-10 items-center justify-center gap-2 rounded-[13px] text-[12px] font-bold text-[#5e5568] active:bg-[#f5f2f8]"
        >
          <i className="fa-regular fa-bookmark text-[13px]" />
          Read
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex h-10 items-center justify-center gap-2 rounded-[13px] text-[12px] font-bold text-[#7658a6] active:bg-[#f1edf9]"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-[12px]" />
          Share
        </button>
      </div>
    </article>
  )
}

export default function EpisodeEchoesPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } = useParams()
  const [story, setStory] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [author, setAuthor] = useState(null)
  const [echoes, setEchoes] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState('')

  const episodeLink = `${window.location.origin}/story/${storyId}/episode/${episodeId}`

  const copyEpisodeLink = async () => {
    try {
      await navigator.clipboard.writeText(episodeLink)
      setNotice('Episode link copied.')
    } catch {
      window.prompt('Copy this link:', episodeLink)
    }
  }

  const shareEpisode = async () => {
    const title = episode?.title || story?.title || 'Shadow episode'

    if (navigator.share) {
      try {
        await navigator.share({ title, url: episodeLink })
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }

    await copyEpisodeLink()
  }

  const loadEchoes = async (nextPage, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    setMessage('')

    try {
      const token = getReaderToken()
      const response = await fetch(
        `${API_BASE_URL}/api/echoes/episode/${episodeId}?page=${nextPage}&limit=20`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load echoes')
      }

      setStory(data.story || null)
      setEpisode(data.episode || null)
      setAuthor(data.author || null)
      setTotal(Number(data.total || 0))
      setPage(nextPage)
      setHasMore(Boolean(data.has_more))
      setEchoes((current) => append ? [...current, ...(data.echoes || [])] : (data.echoes || []))
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to load echoes')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (!episodeId) return
    loadEchoes(1)
  }, [episodeId])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 2200)
    return () => window.clearTimeout(timer)
  }, [notice])

  return (
    <main className="min-h-screen bg-[#f6f3f9] pb-[calc(24px+env(safe-area-inset-bottom))] text-[#17131f]">
      <header className="sticky top-0 z-40 border-b border-[#ece8f3] bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-[44px_1fr_44px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f5f2f8]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[19px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-[17px] font-black">Readers who echoed this</h1>
            <p className="mt-0.5 text-[10.5px] font-semibold text-[#9b93a5]">
              {Number(total || 0).toLocaleString()} {Number(total || 0) === 1 ? 'echo' : 'echoes'}
            </p>
          </div>

          <button
            type="button"
            onClick={shareEpisode}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7658a6] active:bg-[#f1edf9]"
            aria-label="Share episode"
          >
            <i className="fa-solid fa-arrow-up-from-bracket text-[18px]" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl">
        {!loading && episode ? (
          <SourceCard
            story={story}
            episode={episode}
            author={author}
            total={total}
            onOpen={() => navigate(`/story/${storyId}/episode/${episodeId}`)}
          />
        ) : null}

        {notice ? (
          <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-[#17131f] px-4 py-2 text-[11px] font-bold text-white shadow-xl">
            {notice}
          </div>
        ) : null}

        <section className="px-3 py-4 sm:px-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-[22px] bg-white p-4 ring-1 ring-[#ebe6f2]">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-full bg-[#eeeaf3]" />
                    <div className="flex-1 pt-1">
                      <div className="h-3 w-32 rounded-full bg-[#eeeaf3]" />
                      <div className="mt-3 h-2.5 w-20 rounded-full bg-[#f2eef6]" />
                    </div>
                  </div>
                  <div className="mt-5 h-3 w-full rounded-full bg-[#eeeaf3]" />
                  <div className="mt-2 h-3 w-4/5 rounded-full bg-[#f2eef6]" />
                  <div className="mt-4 h-16 rounded-[16px] bg-[#f5f2f8]" />
                </div>
              ))}
            </div>
          ) : message ? (
            <div className="rounded-[22px] bg-white px-5 py-12 text-center ring-1 ring-[#ebe6f2]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f1] text-[#e5484d]">
                <i className="fa-solid fa-triangle-exclamation text-[21px]" />
              </div>
              <p className="mt-4 text-[13px] font-bold text-[#665d70]">{message}</p>
              <button
                type="button"
                onClick={() => loadEchoes(1)}
                className="mt-5 h-11 rounded-full bg-[#17131f] px-6 text-[12px] font-black text-white active:scale-95"
              >
                Try again
              </button>
            </div>
          ) : echoes.length ? (
            <div className="space-y-3">
              {echoes.map((echo) => (
                <EchoCard
                  key={echo.id}
                  echo={echo}
                  onOpenEpisode={() => navigate(`/story/${storyId}/episode/${episodeId}`)}
                  onShare={shareEpisode}
                  onCopy={copyEpisodeLink}
                />
              ))}

              {hasMore ? (
                <button
                  type="button"
                  onClick={() => loadEchoes(page + 1, true)}
                  disabled={loadingMore}
                  className="h-12 w-full rounded-[16px] bg-white text-[12px] font-black text-[#7658a6] ring-1 ring-[#e7e0ef] active:scale-[0.995] disabled:opacity-60"
                >
                  {loadingMore ? 'Loading...' : 'Load more echoes'}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[22px] bg-white px-5 py-16 text-center ring-1 ring-[#ebe6f2]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1edf9] text-[#7658a6]">
                <i className="fa-solid fa-rotate text-[23px]" />
              </div>
              <h2 className="mt-4 text-[16px] font-black">No echoes yet</h2>
              <p className="mx-auto mt-2 max-w-[280px] text-[12px] font-semibold leading-5 text-[#958d9f]">
                Be the first reader to share this episode with the Shadow community.
              </p>
              <button
                type="button"
                onClick={() => navigate(`/story/${storyId}/episode/${episodeId}`)}
                className="mt-6 h-11 rounded-full bg-[#17131f] px-6 text-[12px] font-black text-white active:scale-95"
              >
                Return to episode
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

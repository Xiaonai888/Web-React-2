import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function ReadingText({ content }) {
  const paragraphs = useMemo(() => {
    return String(content || '')
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean)
  }, [content])

  if (!paragraphs.length) {
    return (
      <p className="text-[15px] font-semibold leading-8 text-[#98a2b3]">
        No episode content found.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="whitespace-pre-line text-[17px] leading-[2.05] text-[#242833]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function ReaderSettingButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 items-center gap-2 rounded-full px-4 text-[12px] font-extrabold transition active:scale-95 ${
        active
          ? 'bg-[#111827] text-white'
          : 'bg-white text-[#111827] shadow-sm ring-1 ring-black/5'
      }`}
    >
      <i className={`${icon} text-[13px]`} />
      {label}
    </button>
  )
}

function LoadingCard() {
  return (
    <section className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
      <div className="text-[13px] font-bold text-[#667085]">Loading episode...</div>
    </section>
  )
}

function AdultWarningModal({ open, onCancel, onContinue }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-[420px] rounded-[26px] bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-solid fa-triangle-exclamation text-[26px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-extrabold text-[#111827]">18+ Episode Warning</h2>

        <p className="mt-3 text-[13px] leading-6 text-[#667085]">
          This episode may include mature content. Please continue only if you are allowed to view adult content.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-95"
          >
            Go Back
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReaderPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } = useParams()

  const [story, setStory] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [fontSize, setFontSize] = useState('normal')
  const [wideMode, setWideMode] = useState(false)
  const [adultWarningOpen, setAdultWarningOpen] = useState(false)
  const [adultAccepted, setAdultAccepted] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadReader() {
      setLoading(true)
      setMessage('')

      try {
        const [episodeResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes/${episodeId}`),
          fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes`),
        ])

        const episodeData = await episodeResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || 'Episode not found')
        }

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Episode list not found')
        }

        if (ignore) return

        setStory(episodeData.story || null)
        setEpisode(episodeData.episode || null)
        setEpisodes(episodesData.episodes || [])

        if (episodeData.episode?.is_adult) {
          setAdultAccepted(false)
          setAdultWarningOpen(true)
        } else {
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }
      } catch (error) {
        if (ignore) return

        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to server. Please try again later.'
            : error.message || 'Failed to load episode'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadReader()

    return () => {
      ignore = true
    }
  }, [episodeId, storyId])

  const currentIndex = episodes.findIndex((item) => item.id === episodeId)
  const previousEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null
  const nextEpisode = currentIndex >= 0 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null

  const cover = episode?.cover_url || story?.cover_url || ''

  const contentClass = useMemo(() => {
    if (fontSize === 'large') return 'text-[18px]'
    if (fontSize === 'small') return 'text-[15px]'
    return 'text-[17px]'
  }, [fontSize])

  const handlePrevious = () => {
    if (!previousEpisode) return
    navigate(`/story/${storyId}/episode/${previousEpisode.id}`)
  }

  const handleNext = () => {
    if (!nextEpisode) return
    navigate(`/story/${storyId}/episode/${nextEpisode.id}`)
  }

  const handleFontToggle = () => {
    setFontSize((current) => {
      if (current === 'normal') return 'large'
      if (current === 'large') return 'small'
      return 'normal'
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <AdultWarningModal
        open={adultWarningOpen}
        onCancel={() => navigate(`/story/${storyId}`)}
        onContinue={() => {
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }}
      />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className={`mx-auto flex ${wideMode ? 'max-w-5xl' : 'max-w-3xl'} items-center justify-between`}>
          <button
            type="button"
            onClick={() => navigate(`/story/${storyId}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back to story"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-3 text-center">
            <h1 className="line-clamp-1 text-[15px] font-extrabold text-[#111827]">
              {episode?.title || 'Reader'}
            </h1>
            {episode ? (
              <div className="mt-0.5 text-[10.5px] font-bold text-[#98a2b3]">
                EP {episode.episode_number || 1}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => navigate(`/story/${storyId}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Episode list"
          >
            <i className="fa-solid fa-list-ul text-[14px]" />
          </button>
        </div>
      </header>

      <main className={`mx-auto px-4 pt-4 ${wideMode ? 'max-w-5xl' : 'max-w-3xl'}`}>
        {loading ? <LoadingCard /> : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && episode && adultAccepted ? (
          <>
            <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
              {cover ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111827]">
                  <img src={cover} alt={episode.title} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                        EP {episode.episode_number || 1}
                      </span>

                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-[24px] font-extrabold leading-8 text-white">
                      {episode.title || 'Untitled Episode'}
                    </h2>

                    {story?.title ? (
                      <div className="mt-1 text-[12px] font-bold text-white/75">
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="p-5 sm:p-7">
                {!cover ? (
                  <div className="mb-6 border-b border-[#f0f1f5] pb-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11px] font-extrabold text-[#667085]">
                        EP {episode.episode_number || 1}
                      </span>

                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-[25px] font-extrabold leading-9 text-[#111827]">
                      {episode.title || 'Untitled Episode'}
                    </h2>

                    {story?.title ? (
                      <div className="mt-1 text-[12px] font-bold text-[#8d94a1]">
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mb-5 flex flex-wrap gap-2">
                  <ReaderSettingButton
                    icon="fa-solid fa-font"
                    label={fontSize === 'large' ? 'Large' : fontSize === 'small' ? 'Small' : 'Normal'}
                    active={fontSize !== 'normal'}
                    onClick={handleFontToggle}
                  />

                  <ReaderSettingButton
                    icon="fa-solid fa-arrows-left-right"
                    label={wideMode ? 'Wide' : 'Comfort'}
                    active={wideMode}
                    onClick={() => setWideMode((value) => !value)}
                  />
                </div>

                <article className={contentClass}>
                  <ReadingText content={episode.content} />
                </article>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!previousEpisode}
                className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <i className="fa-solid fa-chevron-left mr-2 text-[12px]" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!nextEpisode}
                className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                Next
                <i className="fa-solid fa-chevron-right ml-2 text-[12px]" />
              </button>
            </section>

            <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#111827]">Episode List</h3>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#8d94a1]">
                    {episodes.length} published episodes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/story/${storyId}`)}
                  className="rounded-full bg-[#f5f3fa] px-4 py-2 text-[12px] font-extrabold text-[#111827] active:scale-95"
                >
                  View Story
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {episodes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/story/${storyId}/episode/${item.id}`)}
                    className={`flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left active:scale-[0.995] ${
                      item.id === episodeId ? 'bg-[#111827] text-white' : 'bg-[#fafafe] text-[#111827]'
                    }`}
                  >
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${
                      item.id === episodeId ? 'bg-white/15 text-white' : 'bg-white text-[#667085]'
                    }`}>
                      EP {item.episode_number || 1}
                    </span>

                    <span className="line-clamp-1 flex-1 text-[13px] font-extrabold">
                      {item.title || 'Untitled Episode'}
                    </span>

                    {item.is_adult ? (
                      <span className="rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-extrabold text-[#e5484d]">
                        18+
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

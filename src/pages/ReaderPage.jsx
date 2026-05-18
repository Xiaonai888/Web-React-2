import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const REVIEW_READ_PROGRESS_PERCENT = 85

const READER_THEMES = {
  light: {
    page: 'bg-[#f6f4ee]',
    card: 'bg-[#fffdf8]',
    text: 'text-[#24201b]',
    muted: 'text-[#8a8175]',
    soft: 'bg-[#f0ebe2]',
    border: 'border-[#eee5d9]',
    button: 'bg-[#111827] text-white',
    ghost: 'bg-white/85 text-[#111827] ring-1 ring-black/5',
  },
  paper: {
    page: 'bg-[#efe7d8]',
    card: 'bg-[#fbf3e3]',
    text: 'text-[#2c241d]',
    muted: 'text-[#8a7460]',
    soft: 'bg-[#eadcc8]',
    border: 'border-[#e5d3bb]',
    button: 'bg-[#3b2f25] text-white',
    ghost: 'bg-[#fff8ed] text-[#3b2f25] ring-1 ring-[#dec8ae]',
  },
  dark: {
    page: 'bg-[#0f172a]',
    card: 'bg-[#111827]',
    text: 'text-[#e5e7eb]',
    muted: 'text-[#9ca3af]',
    soft: 'bg-[#1f2937]',
    border: 'border-[#263244]',
    button: 'bg-white text-[#111827]',
    ghost: 'bg-[#1f2937] text-white ring-1 ring-white/10',
  },
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB')
}

function splitParagraphs(content) {
  const text = String(content || '').trim()

  if (!text) return []

  const doubleBreakParagraphs = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (doubleBreakParagraphs.length > 1) return doubleBreakParagraphs

  return text
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getReviewReadKey(storyId) {
  return `shadow_review_read_episodes_${storyId}`
}

function getReviewReadEpisodes(storyId) {
  if (!storyId) return []

  try {
    const parsed = JSON.parse(localStorage.getItem(getReviewReadKey(storyId)) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveReviewReadEpisode(storyId, episodeId) {
  if (!storyId || !episodeId) return

  const current = getReviewReadEpisodes(storyId)
  const exists = current.some((id) => String(id) === String(episodeId))

  if (exists) return

  localStorage.setItem(getReviewReadKey(storyId), JSON.stringify([...current, episodeId]))
}

function ReadingText({ content, fontSize, theme }) {
  const paragraphs = useMemo(() => splitParagraphs(content), [content])

  const textSize =
    fontSize === 'large'
      ? 'text-[19px] sm:text-[20px]'
      : fontSize === 'small'
        ? 'text-[15.5px] sm:text-[16px]'
        : 'text-[17px] sm:text-[18px]'

  if (!paragraphs.length) {
    return (
      <p className={`text-[15px] font-semibold leading-8 ${theme.muted}`}>
        No episode content found.
      </p>
    )
  }

  return (
    <div className="space-y-7">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 20)}-${index}`}
          className={`${textSize} ${theme.text} whitespace-pre-line break-words leading-[2.15] tracking-[0.003em]`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function ReaderIconButton({ icon, label, onClick, className = '', disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      aria-label={label}
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function ReaderSettingButton({ children, active, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-full px-4 text-[12px] font-extrabold transition active:scale-95 ${
        active ? theme.button : theme.ghost
      }`}
    >
      {children}
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

function EpisodeListDrawer({ open, onClose, episodes, currentEpisodeId, storyId, navigate, theme }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[140]">
      <button
        type="button"
        aria-label="Close episode list"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section className={`absolute bottom-0 left-0 right-0 max-h-[78vh] overflow-hidden rounded-t-[30px] ${theme.card} shadow-2xl md:left-auto md:right-5 md:top-20 md:h-auto md:w-[380px] md:rounded-[26px]`}>
        <div className={`sticky top-0 z-10 border-b ${theme.border} ${theme.card} px-4 py-4`}>
          <div className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-black/15 md:hidden" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className={`text-[17px] font-extrabold ${theme.text}`}>Episode List</h3>
              <p className={`mt-0.5 text-[11.5px] font-semibold ${theme.muted}`}>
                {episodes.length} published episodes
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.soft} ${theme.text}`}
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>
        </div>

        <div className="max-h-[62vh] space-y-2 overflow-y-auto p-4">
          {episodes.map((item) => {
            const active = item.id === currentEpisodeId

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose()
                  navigate(`/story/${storyId}/episode/${item.id}`)
                }}
                className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition active:scale-[0.995] ${
                  active ? theme.button : `${theme.soft} ${theme.text}`
                }`}
              >
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${
                  active ? 'bg-white/15 text-white' : 'bg-white/70 text-[#667085]'
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
            )
          })}
        </div>
      </section>
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
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('reader_font_size') || 'normal')
  const [themeName, setThemeName] = useState(() => localStorage.getItem('reader_theme') || 'light')
  const [wideMode, setWideMode] = useState(() => localStorage.getItem('reader_wide_mode') === 'true')
  const [adultWarningOpen, setAdultWarningOpen] = useState(false)
  const [adultAccepted, setAdultAccepted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [episodeListOpen, setEpisodeListOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [reviewProgressSaved, setReviewProgressSaved] = useState(false)

  const theme = READER_THEMES[themeName] || READER_THEMES.light

  useEffect(() => {
    localStorage.setItem('reader_font_size', fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('reader_theme', themeName)
  }, [themeName])

  useEffect(() => {
    localStorage.setItem('reader_wide_mode', String(wideMode))
  }, [wideMode])

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
        setReadingProgress(0)
        setReviewProgressSaved(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })

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

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0

      setReadingProgress(progress)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [episodeId])

  useEffect(() => {
    if (!storyId || !episodeId || reviewProgressSaved) return

    if (readingProgress >= REVIEW_READ_PROGRESS_PERCENT) {
      saveReviewReadEpisode(storyId, episodeId)
      setReviewProgressSaved(true)
    }
  }, [episodeId, readingProgress, reviewProgressSaved, storyId])

  const currentIndex = episodes.findIndex((item) => item.id === episodeId)
  const previousEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null
  const nextEpisode = currentIndex >= 0 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null

  const cover = episode?.cover_url || story?.cover_url || ''
  const publishedDate = formatDate(episode?.published_at)
  const characterCount = Number(episode?.character_count || episode?.content?.length || 0)

  const handlePrevious = () => {
    if (!previousEpisode) return
    navigate(`/story/${storyId}/episode/${previousEpisode.id}`)
  }

  const handleNext = () => {
    if (!nextEpisode) return
    navigate(`/story/${storyId}/episode/${nextEpisode.id}`)
  }

  const cycleFont = () => {
    setFontSize((current) => {
      if (current === 'normal') return 'large'
      if (current === 'large') return 'small'
      return 'normal'
    })
  }

  const cycleTheme = () => {
    setThemeName((current) => {
      if (current === 'light') return 'paper'
      if (current === 'paper') return 'dark'
      return 'light'
    })
  }

  return (
    <div className={`min-h-screen ${theme.page} pb-[110px] transition-colors`}>
      <div className="fixed left-0 right-0 top-0 z-[70] h-1 bg-black/5">
        <div
          className="h-full bg-[#0b5cff] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <AdultWarningModal
        open={adultWarningOpen}
        onCancel={() => navigate(`/story/${storyId}`)}
        onContinue={() => {
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }}
      />

      <EpisodeListDrawer
        open={episodeListOpen}
        onClose={() => setEpisodeListOpen(false)}
        episodes={episodes}
        currentEpisodeId={episodeId}
        storyId={storyId}
        navigate={navigate}
        theme={theme}
      />

      <header className={`sticky top-0 z-50 border-b ${theme.border} ${theme.card}/95 px-4 py-3 shadow-sm backdrop-blur`}>
        <div className={`mx-auto flex ${wideMode ? 'max-w-5xl' : 'max-w-3xl'} items-center justify-between`}>
          <ReaderIconButton
            icon="fa-solid fa-chevron-left"
            label="Back to story"
            onClick={() => navigate(`/story/${storyId}`)}
            className={`${theme.ghost}`}
          />

          <div className="min-w-0 px-3 text-center">
            <h1 className={`line-clamp-1 text-[14.5px] font-extrabold ${theme.text}`}>
              {episode?.title || 'Reader'}
            </h1>

            {episode ? (
              <div className={`mt-0.5 text-[10.5px] font-bold ${theme.muted}`}>
                EP {episode.episode_number || 1}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <ReaderIconButton
              icon="fa-solid fa-sliders"
              label="Reader settings"
              onClick={() => setSettingsOpen((value) => !value)}
              className={`${settingsOpen ? theme.button : theme.ghost}`}
            />

            <ReaderIconButton
              icon="fa-solid fa-list-ul"
              label="Episode list"
              onClick={() => setEpisodeListOpen(true)}
              className={`${theme.ghost}`}
            />
          </div>
        </div>

        {settingsOpen ? (
          <div className={`mx-auto mt-3 flex ${wideMode ? 'max-w-5xl' : 'max-w-3xl'} flex-wrap gap-2`}>
            <ReaderSettingButton theme={theme} active={fontSize !== 'normal'} onClick={cycleFont}>
              <i className="fa-solid fa-font mr-2 text-[11px]" />
              {fontSize === 'large' ? 'Large' : fontSize === 'small' ? 'Small' : 'Normal'}
            </ReaderSettingButton>

            <ReaderSettingButton theme={theme} active={themeName !== 'light'} onClick={cycleTheme}>
              <i className="fa-solid fa-circle-half-stroke mr-2 text-[11px]" />
              {themeName === 'paper' ? 'Paper' : themeName === 'dark' ? 'Dark' : 'Light'}
            </ReaderSettingButton>

            <ReaderSettingButton theme={theme} active={wideMode} onClick={() => setWideMode((value) => !value)}>
              <i className="fa-solid fa-arrows-left-right mr-2 text-[11px]" />
              {wideMode ? 'Wide' : 'Comfort'}
            </ReaderSettingButton>
          </div>
        ) : null}
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
            <section className={`overflow-hidden rounded-[28px] ${theme.card} shadow-sm ring-1 ring-black/5`}>
              {cover ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111827]">
                  <img src={cover} alt={episode.title} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

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

                    <h2 className="text-[24px] font-extrabold leading-8 text-white sm:text-[30px] sm:leading-10">
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

              <div className="p-5 sm:p-8">
                {!cover ? (
                  <div className={`mb-7 border-b ${theme.border} pb-6`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`${theme.soft} ${theme.muted} rounded-full px-3 py-1.5 text-[11px] font-extrabold`}>
                        EP {episode.episode_number || 1}
                      </span>

                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className={`text-[26px] font-extrabold leading-10 ${theme.text}`}>
                      {episode.title || 'Untitled Episode'}
                    </h2>

                    {story?.title ? (
                      <div className={`mt-1 text-[12px] font-bold ${theme.muted}`}>
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className={`mb-7 grid grid-cols-2 gap-2 rounded-[22px] ${theme.soft} p-3 sm:grid-cols-4`}>
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Episode</div>
                    <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>EP {episode.episode_number || 1}</div>
                  </div>

                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Length</div>
                    <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{characterCount.toLocaleString()} chars</div>
                  </div>

                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Mode</div>
                    <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{themeName}</div>
                  </div>

                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Published</div>
                    <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{publishedDate || 'New'}</div>
                  </div>
                </div>

                <article>
                  <ReadingText content={episode.content} fontSize={fontSize} theme={theme} />
                </article>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!previousEpisode}
                className={`flex h-14 items-center justify-center rounded-full text-[14px] font-extrabold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 ${theme.ghost}`}
              >
                <i className="fa-solid fa-chevron-left mr-2 text-[12px]" />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!nextEpisode}
                className={`flex h-14 items-center justify-center rounded-full text-[14px] font-extrabold shadow-[0_14px_30px_rgba(17,24,39,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 ${theme.button}`}
              >
                Next
                <i className="fa-solid fa-chevron-right ml-2 text-[12px]" />
              </button>
            </section>

            <section className={`mt-4 rounded-[24px] ${theme.card} p-4 shadow-sm ring-1 ring-black/5`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className={`text-[15px] font-extrabold ${theme.text}`}>Continue Reading</h3>
                  <p className={`mt-0.5 text-[11px] font-semibold ${theme.muted}`}>
                    {nextEpisode ? `Next: EP ${nextEpisode.episode_number || ''}` : 'You reached the latest episode'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEpisodeListOpen(true)}
                  className={`rounded-full px-4 py-2 text-[12px] font-extrabold active:scale-95 ${theme.ghost}`}
                >
                  Episodes
                </button>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function StatusBadge({ status }) {
  const normalized = String(status || 'draft').toLowerCase()

  const classes = {
    published: 'bg-[#ecfdf3] text-[#16803c]',
    scheduled: 'bg-[#eff6ff] text-[#0b5cff]',
    draft: 'bg-[#f2f4f7] text-[#667085]',
    ready: 'bg-[#fff7df] text-[#a56a00]',
  }

  const labels = {
    published: 'Published',
    scheduled: 'Scheduled',
    draft: 'Draft',
    ready: 'Ready',
  }

  return (
    <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${classes[normalized] || classes.draft}`}>
      {labels[normalized] || 'Draft'}
    </span>
  )
}

function ReadingText({ content }) {
  const paragraphs = useMemo(() => {
    return String(content || '')
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean)
  }, [content])

  if (!paragraphs.length) {
    return (
      <p className="text-[14px] font-semibold leading-8 text-[#98a2b3]">
        No episode content found.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line text-[16px] leading-9 text-[#242833]">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export default function EpisodePreviewPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()

  const episodeId = searchParams.get('episodeId') || searchParams.get('episode_id')

  const [story, setStory] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPreview() {
      setLoading(true)
      setMessage('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      if (!episodeId) {
        setLoading(false)
        setMessage('Missing episode id. Please go back and save the episode again.')
        return
      }

      try {
        const [storyResponse, episodeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes/${episodeId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodeData = await episodeResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Failed to load story')
        }

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || 'Failed to load episode')
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisode(episodeData.episode || null)
      } catch (error) {
        if (ignore) return

        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to backend. Please check deployment.'
            : error.message || 'Failed to load preview'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPreview()

    return () => {
      ignore = true
    }
  }, [episodeId, navigate, storyId])

  const previewCover = episode?.cover_url || story?.cover_url || ''

  const scheduledText = episode?.scheduled_at
    ? new Date(episode.scheduled_at).toLocaleString()
    : ''

  const publishedText = episode?.published_at
    ? new Date(episode.published_at).toLocaleString()
    : ''

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Preview</h1>

          <button
            type="button"
            onClick={() => navigate(`/author/story/${storyId}/episode/publish?episodeId=${episodeId || ''}`)}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
          >
            Publish
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {loading ? (
          <section className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-bold text-[#667085]">Loading preview...</div>
          </section>
        ) : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && episode ? (
          <>
            <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative bg-[#111827]">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  {previewCover ? (
                    <img
                      src={previewCover}
                      alt={episode.title}
                      className="h-full w-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/50">
                      <i className="fa-regular fa-image text-[34px]" />
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={episode.status} />

                    {episode.is_adult ? (
                      <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                        18+
                      </span>
                    ) : null}

                    <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                      EP {episode.episode_number || 1}
                    </span>
                  </div>

                  <h2 className="text-[24px] font-extrabold leading-8 text-white">
                    {episode.title || 'Untitled Episode'}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-bold text-white/75">
                    {story?.title ? <span>{story.title}</span> : null}
                    <span>{Number(episode.character_count || 0).toLocaleString()} characters</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0f1f5] p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-[16px] bg-[#fafafe] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[#98a2b3]">Status</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[#111827] capitalize">{episode.status || 'draft'}</div>
                  </div>

                  <div className="rounded-[16px] bg-[#fafafe] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[#98a2b3]">Episode</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[#111827]">EP {episode.episode_number || 1}</div>
                  </div>

                  <div className="rounded-[16px] bg-[#fafafe] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[#98a2b3]">Characters</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[#111827]">
                      {Number(episode.character_count || 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[#fafafe] px-3 py-3">
                    <div className="text-[10.5px] font-bold text-[#98a2b3]">Visibility</div>
                    <div className="mt-1 text-[12px] font-extrabold text-[#111827]">
                      {episode.is_adult ? '18+' : 'Normal'}
                    </div>
                  </div>
                </div>

                {scheduledText || publishedText ? (
                  <div className="mt-3 rounded-[16px] bg-[#f5f8ff] px-4 py-3 text-[12px] font-bold leading-5 text-[#0b5cff]">
                    {scheduledText ? `Scheduled: ${scheduledText}` : null}
                    {publishedText ? `Published: ${publishedText}` : null}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-4 rounded-[26px] bg-white px-5 py-6 shadow-sm ring-1 ring-black/5">
              <div className="mb-6 border-b border-[#f0f1f5] pb-4">
                <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#98a2b3]">
                  Reader Preview
                </div>
                <h3 className="mt-2 text-[22px] font-extrabold leading-8 text-[#111827]">
                  {episode.title}
                </h3>
              </div>

              <ReadingText content={episode.content} />
            </section>

            <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
              <button
                type="button"
                onClick={() => navigate(`/author/story/${storyId}/manage`)}
                className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99]"
              >
                Story Manager
              </button>

              <button
                type="button"
                onClick={() => navigate(`/author/story/${storyId}/episode/publish?episodeId=${episodeId || ''}&first=${episode.episode_number === 1 ? '1' : '0'}`)}
                className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99]"
              >
                Publish Settings
              </button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

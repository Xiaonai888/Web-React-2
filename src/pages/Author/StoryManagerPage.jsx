import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#f5f3fa] text-[#111827]">
          <i className={`${icon} text-[15px]`} />
        </div>

        <div>
          <div className="text-[18px] font-extrabold text-[#111827]">{value}</div>
          <div className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">{label}</div>
        </div>
      </div>
    </div>
  )
}

function EpisodeRow({ episode, onOpen }) {
  const dateText = episode.published_at || episode.scheduled_at || episode.updated_at || episode.created_at

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[20px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.995]"
    >
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-[#111827] text-white">
        {episode.cover_url ? (
          <img src={episode.cover_url} alt={episode.title} className="h-full w-full object-cover" />
        ) : (
          <i className="fa-regular fa-image text-[18px] opacity-70" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="shrink-0 rounded-full bg-[#f5f3fa] px-2 py-1 text-[10px] font-extrabold text-[#667085]">
            EP {episode.episode_number || 1}
          </div>
          <StatusBadge status={episode.status} />
        </div>

        <div className="mt-2 line-clamp-1 text-[14px] font-extrabold text-[#111827]">
          {episode.title || 'Untitled Episode'}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#8d94a1]">
          <span>{Number(episode.character_count || 0).toLocaleString()} characters</span>
          {dateText ? <span>{new Date(dateText).toLocaleDateString()}</span> : null}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#98a2b3]" />
    </button>
  )
}

export default function StoryManagerPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const [story, setStory] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const publishedCount = useMemo(
    () => episodes.filter((episode) => episode.status === 'published').length,
    [episodes]
  )

  const draftCount = useMemo(
    () => episodes.filter((episode) => episode.status === 'draft' || episode.status === 'ready').length,
    [episodes]
  )

  const scheduledCount = useMemo(
    () => episodes.filter((episode) => episode.status === 'scheduled').length,
    [episodes]
  )

  useEffect(() => {
    let ignore = false

    async function loadStoryManager() {
      setLoading(true)
      setMessage('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const [storyResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Failed to load story')
        }

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Failed to load episodes')
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisodes(episodesData.episodes || [])
      } catch (error) {
        if (ignore) return
        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to backend. Please check deployment.'
            : error.message || 'Failed to load story manager'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStoryManager()

    return () => {
      ignore = true
    }
  }, [navigate, storyId])

  const handleAddEpisode = () => {
    navigate(`/author/story/${storyId}/episode/create?first=0`)
  }

  const handleOpenEpisode = (episode) => {
    navigate(`/author/story/${storyId}/episode/publish?episodeId=${episode.id}&first=${episode.episode_number === 1 ? '1' : '0'}`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Story Manager</h1>

          <button
            type="button"
            onClick={handleAddEpisode}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
          >
            Add
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {loading ? (
          <section className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-bold text-[#667085]">Loading story manager...</div>
          </section>
        ) : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && story ? (
          <>
            <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative min-h-[180px] bg-[#111827]">
                {story.slides?.length ? (
                  <img
                    src={story.slides[0].image_url}
                    alt={story.title}
                    className="h-[180px] w-full object-cover opacity-80"
                  />
                ) : (
                  <div className="flex h-[180px] items-center justify-center text-white/50">
                    <i className="fa-regular fa-image text-[32px]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                  <div className="aspect-[2/3] w-[96px] overflow-hidden rounded-[18px] bg-white/10 shadow-xl ring-2 ring-white/30">
                    {story.cover_url ? (
                      <img src={story.cover_url} alt={story.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/50">
                        <i className="fa-regular fa-image text-[20px]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={story.status} />
                      {story.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className="line-clamp-2 text-[22px] font-extrabold leading-7 text-white">
                      {story.title || 'Untitled Story'}
                    </h2>

                    <div className="mt-1 text-[12px] font-bold text-white/75">
                      {story.story_language} • {story.main_genre}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {story.description ? (
                  <p className="line-clamp-4 text-[13px] leading-6 text-[#555b66]">
                    {story.description}
                  </p>
                ) : (
                  <p className="text-[13px] font-semibold text-[#98a2b3]">
                    No description yet.
                  </p>
                )}

                {story.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {story.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11px] font-bold text-[#555b66]">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon="fa-solid fa-book-open" label="Episodes" value={episodes.length} />
              <StatCard icon="fa-solid fa-circle-check" label="Published" value={publishedCount} />
              <StatCard icon="fa-regular fa-file-lines" label="Draft/Ready" value={draftCount} />
              <StatCard icon="fa-regular fa-calendar" label="Scheduled" value={scheduledCount} />
            </section>

            <section className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-[17px] font-extrabold text-[#111827]">Episodes</h2>
                  <p className="mt-0.5 text-[12px] font-semibold text-[#8d94a1]">
                    Manage all episodes for this story.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddEpisode}
                  className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
                >
                  Add Episode
                </button>
              </div>

              {episodes.length ? (
                <div className="space-y-3">
                  {episodes.map((episode) => (
                    <EpisodeRow
                      key={episode.id}
                      episode={episode}
                      onOpen={() => handleOpenEpisode(episode)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] bg-white px-5 py-8 text-center shadow-sm ring-1 ring-black/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                    <i className="fa-regular fa-file-lines text-[22px]" />
                  </div>

                  <h3 className="mt-4 text-[16px] font-extrabold text-[#111827]">No episodes yet</h3>
                  <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#8d94a1]">
                    Start writing your first episode to make this story ready for readers.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddEpisode}
                    className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95"
                  >
                    Create Episode
                  </button>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

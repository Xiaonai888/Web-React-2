import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function StatusBadge({ children, className = '' }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${className}`}>
      {children}
    </span>
  )
}

function StatItem({ icon, value, label }) {
  return (
    <div className="rounded-[18px] bg-white/90 px-3 py-3 text-center shadow-sm ring-1 ring-black/5">
      <i className={`${icon} mb-1 text-[15px] text-[#111827]`} />
      <div className="text-[15px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-0.5 text-[10.5px] font-bold text-[#98a2b3]">{label}</div>
    </div>
  )
}

function EpisodeCard({ episode, story, onOpen }) {
  const cover = episode.cover_url || story?.cover_url || ''
  const publishDate = episode.published_at ? new Date(episode.published_at).toLocaleDateString() : ''

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 rounded-[20px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.995]"
    >
      <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#111827] text-white">
        {cover ? (
          <img src={cover} alt={episode.title} className="h-full w-full object-cover" />
        ) : (
          <i className="fa-regular fa-image text-[20px] opacity-70" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10.5px] font-extrabold text-[#667085]">
            EP {episode.episode_number || 1}
          </span>

          {episode.is_adult ? (
            <span className="rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10.5px] font-extrabold text-[#e5484d]">
              18+
            </span>
          ) : null}
        </div>

        <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#111827]">
          {episode.title || 'Untitled Episode'}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#8d94a1]">
          <span>{Number(episode.character_count || 0).toLocaleString()} chars</span>
          {publishDate ? <span>{publishDate}</span> : null}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right mt-8 text-[12px] text-[#98a2b3]" />
    </button>
  )
}

function LoadingCard() {
  return (
    <section className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
      <div className="text-[13px] font-bold text-[#667085]">Loading story...</div>
    </section>
  )
}

export default function StoryDetailPage() {
  const navigate = useNavigate()
  const { id, storyId } = useParams()
  const realStoryId = storyId || id

  const [story, setStory] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)
      setMessage('')

      try {
        const [storyResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/stories/${realStoryId}`),
          fetch(`${API_BASE_URL}/api/public/stories/${realStoryId}/episodes`),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Story not found')
        }

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Episodes not found')
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisodes(episodesData.episodes || [])
      } catch (error) {
        if (ignore) return
        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to server. Please try again later.'
            : error.message || 'Failed to load story'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [realStoryId])

  const firstEpisode = episodes[0]
  const heroImage = story?.slides?.[0]?.image_url || story?.cover_url || ''

  const totalCharacters = useMemo(() => {
    return episodes.reduce((sum, episode) => sum + Number(episode.character_count || 0), 0)
  }, [episodes])

  const handleStartReading = () => {
    if (!firstEpisode) return
    navigate(`/story/${realStoryId}/episode/${firstEpisode.id}`)
  }

  const handleOpenEpisode = (episode) => {
    navigate(`/story/${realStoryId}/episode/${episode.id}`)
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

          <h1 className="text-[17px] font-extrabold text-[#111827]">Story Detail</h1>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Share"
          >
            <i className="fa-solid fa-share-nodes text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {loading ? <LoadingCard /> : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && story ? (
          <>
            <section className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative min-h-[260px] bg-[#111827]">
                <div className="absolute inset-0">
                  {heroImage ? (
                    <img src={heroImage} alt={story.title} className="h-full w-full object-cover opacity-70 blur-[1px]" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                </div>

                <div className="relative px-4 pb-5 pt-8">
                  <div className="mx-auto flex max-w-[820px] flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="aspect-[2/3] w-[132px] shrink-0 overflow-hidden rounded-[22px] bg-white/10 shadow-2xl ring-2 ring-white/25">
                      {story.cover_url ? (
                        <img src={story.cover_url} alt={story.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/50">
                          <i className="fa-regular fa-image text-[24px]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                        <StatusBadge className="bg-white/15 text-white backdrop-blur">
                          {story.story_language || 'Khmer'}
                        </StatusBadge>

                        <StatusBadge className="bg-white/15 text-white backdrop-blur">
                          {story.main_genre || 'Novel'}
                        </StatusBadge>

                        {story.is_adult ? (
                          <StatusBadge className="bg-[#fff1f1] text-[#e5484d]">18+</StatusBadge>
                        ) : null}
                      </div>

                      <h2 className="text-[28px] font-black leading-9 text-white sm:text-[34px] sm:leading-[42px]">
                        {story.title || 'Untitled Story'}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-[13px] font-medium leading-6 text-white/75">
                        {story.description || 'No description yet.'}
                      </p>

                      {story.tags?.length ? (
                        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                          {story.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#fafafe] p-4 sm:grid-cols-4">
                <StatItem icon="fa-solid fa-book-open" value={episodes.length} label="Episodes" />
                <StatItem icon="fa-solid fa-align-left" value={totalCharacters.toLocaleString()} label="Characters" />
                <StatItem icon="fa-regular fa-heart" value={Number(story.total_likes || 0).toLocaleString()} label="Likes" />
                <StatItem icon="fa-regular fa-eye" value={Number(story.total_views || 0).toLocaleString()} label="Views" />
              </div>
            </section>

            <section className="mt-4 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={handleStartReading}
                disabled={!firstEpisode}
                className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                <i className="fa-solid fa-play mr-2 text-[12px]" />
                Start Reading
              </button>

              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
                aria-label="Subscribe"
              >
                <i className="fa-regular fa-bookmark text-[18px]" />
              </button>
            </section>

            <section className="mt-5">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#111827]">Episodes</h2>
                  <p className="mt-0.5 text-[12px] font-semibold text-[#8d94a1]">
                    Published episodes available for readers.
                  </p>
                </div>

                <div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
                  {episodes.length} total
                </div>
              </div>

              {episodes.length ? (
                <div className="space-y-3">
                  {episodes.map((episode) => (
                    <EpisodeCard
                      key={episode.id}
                      episode={episode}
                      story={story}
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
                    This story is published, but no episode is available for readers yet.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

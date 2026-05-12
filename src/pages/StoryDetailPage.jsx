import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function formatNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${Math.round(number / 1000)}k`

  return String(number)
}

export default function StoryDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [book, setBook] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [descriptionOpen, setDescriptionOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadStoryDetail() {
      try {
        setLoading(true)
        setError('')

        const [bookRes, episodesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/books/${id}`),
          fetch(`${API_BASE_URL}/api/books/${id}/episodes`),
        ])

        const bookData = await bookRes.json()
        const episodesData = await episodesRes.json()

        if (!bookRes.ok || !bookData.ok) {
          throw new Error(bookData.message || 'Failed to load book')
        }

        if (!episodesRes.ok || !episodesData.ok) {
          throw new Error(episodesData.message || 'Failed to load episodes')
        }

        if (!cancelled) {
          setBook(bookData.book)
          setEpisodes(episodesData.episodes || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStoryDetail()

    return () => {
      cancelled = true
    }
  }, [id])

  const continueEpisode = useMemo(() => {
    return episodes[1] || episodes[0] || null
  }, [episodes])

  const goReadEpisode = (episode) => {
    if (!episode) return
    navigate(`/story/${id}/episode/${episode.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] px-5 py-10">
        <div className="mx-auto max-w-3xl text-[16px] font-semibold text-[#222]">
          Loading story...
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate('/')}
            className="mb-6 rounded-full bg-white px-4 py-2 text-[14px] shadow-sm"
          >
            Back
          </button>
          <h1 className="text-[22px] font-bold text-[#222]">Story not found</h1>
          <p className="mt-3 text-[15px] text-[#666]">{error || 'This story does not exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] pb-[150px]">
      <section className="relative h-[300px] overflow-hidden bg-[#222]">
        {book.cover_url ? (
          <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#6f655a,#c9b099)] text-[48px] font-bold text-white">
            {book.title?.charAt(0) || 'S'}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-[24px] text-white backdrop-blur"
        >
          ‹
        </button>

        <div className="absolute bottom-7 left-4 right-4 text-white">
          <h1 className="text-[26px] font-bold leading-tight">{book.title}</h1>
          <div className="mt-2 text-[14px] text-white/85">
            {book.genres?.length ? book.genres.join(' / ') : 'Story'}
          </div>
        </div>
      </section>

      <main className="relative z-10 -mt-4">
        <section className="rounded-t-[22px] bg-white px-4 pb-5 pt-5">
          <div className="grid grid-cols-3 text-center">
            <div>
              <div className="text-[17px] font-bold text-[#222]">{formatNumber(book.likes_count)}</div>
              <div className="mt-1 text-[12px] text-[#999]">Likes</div>
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#222]">{formatNumber(book.views_count)}</div>
              <div className="mt-1 text-[12px] text-[#999]">Views</div>
            </div>
            <div>
              <div className="text-[17px] font-bold text-[#ff9747]">{book.rating || '0'}</div>
              <div className="mt-1 text-[12px] text-[#999]">Rating</div>
            </div>
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-6">
          <div className="text-[14px] font-bold text-[#222]">
            Author: {book.author_name || 'Unknown'}
          </div>

          <p
            className="mt-4 text-[15px] leading-7 text-[#444]"
            style={
              descriptionOpen
                ? {}
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
            }
          >
            {book.description || 'No description yet.'}
          </p>

          <button
            onClick={() => setDescriptionOpen((value) => !value)}
            className="mt-3 text-[13px] font-semibold text-[#ffb300]"
          >
            {descriptionOpen ? 'Show less' : 'Read more'}
          </button>

          <div className="mt-5 flex flex-wrap gap-2">
            {(book.genres || []).map((genre) => (
              <span key={genre} className="rounded-md bg-[#f7f7f7] px-3 py-1.5 text-[12px] text-[#888]">
                {genre}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#222]">Episodes</h2>
            <span className="text-[13px] text-[#888]">{episodes.length} episodes</span>
          </div>

          {episodes.length === 0 ? (
            <div className="rounded-2xl bg-[#fafafa] px-4 py-5 text-[14px] text-[#777]">
              No episodes yet.
            </div>
          ) : (
            <div className="space-y-3">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => goReadEpisode(episode)}
                  className="flex w-full items-center justify-between rounded-2xl bg-[#fafafa] px-4 py-4 text-left active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-[#222]">
                      {episode.episode_number}. {episode.title}
                    </div>
                    <div className="mt-1 text-[12px] text-[#999]">
                      {episode.is_free ? 'Free' : 'Premium'}
                    </div>
                  </div>

                  <span className="ml-3 text-[22px] text-[#bbb]">›</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-[68px] left-0 right-0 z-50 bg-white/95 px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-md gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-[22px]">
            ♡
          </button>

          <button
            onClick={() => goReadEpisode(continueEpisode)}
            disabled={!continueEpisode}
            className="flex-1 rounded-full bg-[#ffbe00] px-5 py-4 text-[15px] font-semibold text-[#1f1f1f] disabled:opacity-40"
          >
            {continueEpisode ? `Continue Ep. ${continueEpisode.episode_number}` : 'No Episode'}
          </button>
        </div>
      </div>
    </div>
  )
}

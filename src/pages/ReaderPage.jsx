import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function splitContent(content) {
  if (!content) return []
  return String(content)
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function ReaderPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } = useParams()

  const [book, setBook] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [episode, setEpisode] = useState(null)
  const [fontSize, setFontSize] = useState(20)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadReaderData() {
      try {
        setLoading(true)
        setError('')

        const [episodeRes, episodesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/books/episodes/${episodeId}`),
          fetch(`${API_BASE_URL}/api/books/${storyId}/episodes`),
        ])

        const episodeData = await episodeRes.json()
        const episodesData = await episodesRes.json()

        if (!episodeRes.ok || !episodeData.ok) {
          throw new Error(episodeData.message || 'Failed to load episode')
        }

        if (!episodesRes.ok || !episodesData.ok) {
          throw new Error(episodesData.message || 'Failed to load episode list')
        }

        if (!cancelled) {
          setEpisode(episodeData.episode)
          setBook(episodeData.book)
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

    loadReaderData()

    return () => {
      cancelled = true
    }
  }, [storyId, episodeId])

  const currentIndex = useMemo(() => {
    return episodes.findIndex((item) => item.id === episodeId)
  }, [episodes, episodeId])

  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null
  const nextEpisode =
    currentIndex >= 0 && currentIndex < episodes.length - 1
      ? episodes[currentIndex + 1]
      : null

  const paragraphs = splitContent(episode?.content)

  const goEpisode = (item) => {
    if (!item) return
    navigate(`/story/${storyId}/episode/${item.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] px-5 py-10 text-[#1f1f1f]">
        <div className="mx-auto max-w-3xl text-[16px] font-semibold">Loading episode...</div>
      </div>
    )
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] px-5 py-10 text-[#1f1f1f]">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(`/story/${storyId}`)}
            className="mb-6 rounded-full bg-[#eeeeee] px-4 py-2 text-[14px]"
          >
            Back
          </button>
          <h1 className="text-[22px] font-bold">Episode not found</h1>
          <p className="mt-3 text-[15px] text-[#666]">{error || 'This episode does not exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'min-h-screen bg-[#111] text-white' : 'min-h-screen bg-[#fbfaf7] text-[#1f1f1f]'}>
      <header className={darkMode ? 'sticky top-0 z-50 border-b border-white/10 bg-[#111]/95 px-4 py-3' : 'sticky top-0 z-50 border-b border-black/5 bg-white/95 px-4 py-3'}>
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            onClick={() => navigate(`/story/${storyId}`)}
            className={darkMode ? 'flex h-10 w-10 items-center justify-center rounded-full bg-white/10' : 'flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f2]'}
          >
            ‹
          </button>

          <div className="min-w-0 flex-1">
            <div className={darkMode ? 'truncate text-[12px] text-white/55' : 'truncate text-[12px] text-[#888]'}>
              {book?.title || 'Story'}
            </div>
            <div className="truncate text-[15px] font-bold">
              {episode.episode_number}. {episode.title}
            </div>
          </div>

          <button
            onClick={() => setDarkMode((value) => !value)}
            className={darkMode ? 'rounded-full bg-white/10 px-3 py-2 text-[12px]' : 'rounded-full bg-[#f2f2f2] px-3 py-2 text-[12px]'}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-36 pt-7">
        <h1 className="text-[24px] font-bold leading-tight">
          {episode.episode_number}. {episode.title}
        </h1>

        <div className={darkMode ? 'mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3' : 'mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm'}>
          <span className={darkMode ? 'text-[13px] text-white/60' : 'text-[13px] text-[#777]'}>Font size</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize((size) => Math.max(15, size - 1))} className="rounded-full px-3 py-1 text-[18px]">−</button>
            <span className="w-8 text-center text-[13px] font-bold">{fontSize}</span>
            <button onClick={() => setFontSize((size) => Math.min(28, size + 1))} className="rounded-full px-3 py-1 text-[18px]">+</button>
          </div>
        </div>

        <article className="mt-8 space-y-6" style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className={darkMode ? 'text-white/85' : 'text-[#2d2d2d]'}>
                {paragraph}
              </p>
            ))
          ) : (
            <p className={darkMode ? 'text-white/60' : 'text-[#777]'}>
              No content yet.
            </p>
          )}
        </article>
      </main>

      <div className={darkMode ? 'fixed bottom-[68px] left-0 right-0 z-50 border-t border-white/10 bg-[#111]/95 px-4 py-3' : 'fixed bottom-[68px] left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-4 py-3'}>
        <div className="mx-auto flex max-w-3xl gap-3">
          <button
            onClick={() => goEpisode(prevEpisode)}
            disabled={!prevEpisode}
            className="flex-1 rounded-full border border-black/10 px-4 py-3 text-[14px] font-medium disabled:opacity-35"
          >
            Previous
          </button>
          <button
            onClick={() => goEpisode(nextEpisode)}
            disabled={!nextEpisode}
            className="flex-1 rounded-full bg-[#ffbe00] px-4 py-3 text-[14px] font-medium text-[#1f1f1f] disabled:opacity-35"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

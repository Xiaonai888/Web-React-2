import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const story = {
  id: 'story-001',
  title: 'Call Me As Your Name',
  episodes: [
    {
      id: 1,
      title: '1. Call me as your name',
      content: [
        'Ika opened his eyes to a world that had already ended.',
        'The sky was cracked with red light, and the silence after the destruction felt heavier than every scream he had heard before.',
        'He was supposed to disappear with everyone else, but something inside him refused to die.',
        'A strange power moved through his body like fire and shadow at the same time.',
        'He did not understand it yet, but the world had changed him forever.',
      ],
    },
    {
      id: 2,
      title: '2. See You Again',
      content: [
        'The next morning felt unreal.',
        'Ika walked through the empty street, passing broken homes and quiet corners where life used to exist.',
        'Every step reminded him that survival was not the same as peace.',
        'Then he saw a mark glowing on the ground, the same symbol that appeared when the demons first arrived.',
        'He clenched his hand and whispered to the empty air, “If you come back, I will be ready.”',
      ],
    },
    {
      id: 3,
      title: '3. First Coffee',
      locked: true,
      content: ['This episode is locked.'],
    },
  ],
}

function IconBack(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function ReaderPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } = useParams()
  const [fontSize, setFontSize] = useState(18)
  const [darkMode, setDarkMode] = useState(false)

  const currentEpisodeId = Number(episodeId)

  const episode = useMemo(() => {
    return story.episodes.find(item => item.id === currentEpisodeId) || story.episodes[0]
  }, [currentEpisodeId])

  const currentIndex = story.episodes.findIndex(item => item.id === episode.id)
  const prevEpisode = currentIndex > 0 ? story.episodes[currentIndex - 1] : null
  const nextEpisode = currentIndex < story.episodes.length - 1 ? story.episodes[currentIndex + 1] : null

  const goEpisode = item => {
    if (!item || item.locked) return
    navigate(`/story/${storyId}/episode/${item.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={darkMode ? 'min-h-screen bg-[#121212] text-white' : 'min-h-screen bg-[#fbfaf7] text-[#1f1f1f]'}>
      <header className={darkMode ? 'sticky top-0 z-50 border-b border-white/10 bg-[#121212]/95 px-4 py-3 backdrop-blur' : 'sticky top-0 z-50 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur'}>
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button onClick={() => navigate(`/story/${storyId}`)} className={darkMode ? 'flex h-10 w-10 items-center justify-center rounded-full bg-white/10' : 'flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f2]'}>
            <IconBack className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className={darkMode ? 'truncate text-[13px] text-white/55' : 'truncate text-[13px] text-[#8f8f8f]'}>{story.title}</div>
            <div className="truncate text-[15px] font-bold">{episode.title}</div>
          </div>

          <button onClick={() => setDarkMode(value => !value)} className={darkMode ? 'rounded-full bg-white/10 px-3 py-2 text-[12px]' : 'rounded-full bg-[#f2f2f2] px-3 py-2 text-[12px]'}>
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-36 pt-7">
        <h1 className="text-[24px] font-bold leading-tight">{episode.title}</h1>

        <div className={darkMode ? 'mt-4 flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3' : 'mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm'}>
          <span className={darkMode ? 'text-[13px] text-white/55' : 'text-[13px] text-[#777]'}>Font size</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(size => Math.max(15, size - 1))} className="rounded-full px-3 py-1 text-[18px]">−</button>
            <span className="w-8 text-center text-[13px] font-bold">{fontSize}</span>
            <button onClick={() => setFontSize(size => Math.min(24, size + 1))} className="rounded-full px-3 py-1 text-[18px]">+</button>
          </div>
        </div>

        {episode.locked ? (
          <div className={darkMode ? 'mt-8 rounded-3xl bg-white/8 p-6 text-center' : 'mt-8 rounded-3xl bg-white p-6 text-center shadow-sm'}>
            <div className="text-[20px] font-bold">Locked Episode</div>
            <p className={darkMode ? 'mt-3 text-[15px] leading-7 text-white/60' : 'mt-3 text-[15px] leading-7 text-[#666]'}>
              This episode is locked. Unlock system will be added later.
            </p>
          </div>
        ) : (
          <article className="mt-8 space-y-6" style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}>
            {episode.content.map((paragraph, index) => (
              <p key={index} className={darkMode ? 'text-white/82' : 'text-[#2d2d2d]'}>{paragraph}</p>
            ))}
          </article>
        )}
      </main>

      <div className={darkMode ? 'fixed bottom-[68px] left-0 right-0 z-50 border-t border-white/10 bg-[#121212]/95 px-4 py-3 backdrop-blur' : 'fixed bottom-[68px] left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur'}>
        <div className="mx-auto flex max-w-3xl gap-3">
          <button
            onClick={() => goEpisode(prevEpisode)}
            disabled={!prevEpisode || prevEpisode.locked}
            className="flex-1 rounded-full border border-black/10 px-4 py-3 text-[14px] font-medium disabled:opacity-35"
          >
            Previous
          </button>
          <button
            onClick={() => goEpisode(nextEpisode)}
            disabled={!nextEpisode || nextEpisode.locked}
            className="flex-1 rounded-full bg-[#ffbe00] px-4 py-3 text-[14px] font-medium text-[#1f1f1f] disabled:opacity-35"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

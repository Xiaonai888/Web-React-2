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
        'He clenched his hand and whispered to the empty air, If you come back, I will be ready.',
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

export default function ReaderPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } = useParams()

  const safeStoryId = storyId || story.id
  const currentEpisodeId = Number(episodeId || 1)
  const episode = story.episodes.find(item => item.id === currentEpisodeId) || story.episodes[0]
  const currentIndex = story.episodes.findIndex(item => item.id === episode.id)
  const prevEpisode = currentIndex > 0 ? story.episodes[currentIndex - 1] : null
  const nextEpisode = currentIndex < story.episodes.length - 1 ? story.episodes[currentIndex + 1] : null

  const goBack = () => {
    navigate(`/story/${safeStoryId}`)
  }

  const goEpisode = item => {
    if (!item || item.locked) return
    navigate(`/story/${safeStoryId}/episode/${item.id}`)
    setTimeout(() => window.scrollTo(0, 0), 0)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fbfaf7', color: '#222', paddingBottom: '90px' }}>
      <div style={{ position: 'sticky', top: 0, background: '#ffffff', borderBottom: '1px solid #eeeeee', padding: '12px 16px', zIndex: 10 }}>
        <button onClick={goBack} style={{ border: 0, background: '#f2f2f2', borderRadius: 999, padding: '9px 14px', fontSize: 14 }}>
          Back
        </button>
      </div>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px' }}>
        <p style={{ margin: 0, color: '#777', fontSize: 14 }}>{story.title}</p>
        <h1 style={{ marginTop: 8, marginBottom: 24, fontSize: 26, lineHeight: 1.25 }}>{episode.title}</h1>

        {episode.locked ? (
          <div style={{ background: '#ffffff', borderRadius: 16, padding: 18, border: '1px solid #eeeeee' }}>
            <h2 style={{ marginTop: 0 }}>Locked Episode</h2>
            <p>This episode is locked. Unlock system will be added later.</p>
          </div>
        ) : (
          <article style={{ fontSize: 18, lineHeight: 1.85 }}>
            {episode.content.map((text, index) => (
              <p key={index} style={{ marginBottom: 20 }}>{text}</p>
            ))}
          </article>
        )}
      </main>

      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: '#ffffff', borderTop: '1px solid #eeeeee', padding: '12px 16px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 12 }}>
          <button
            onClick={() => goEpisode(prevEpisode)}
            disabled={!prevEpisode || prevEpisode.locked}
            style={{ flex: 1, border: '1px solid #dddddd', background: '#ffffff', borderRadius: 999, padding: '13px 12px', opacity: !prevEpisode || prevEpisode.locked ? 0.4 : 1 }}
          >
            Previous
          </button>
          <button
            onClick={() => goEpisode(nextEpisode)}
            disabled={!nextEpisode || nextEpisode.locked}
            style={{ flex: 1, border: 0, background: '#ffbe00', color: '#222', borderRadius: 999, padding: '13px 12px', opacity: !nextEpisode || nextEpisode.locked ? 0.4 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

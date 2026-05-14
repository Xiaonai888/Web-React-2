import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function SummaryStat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[15px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#9aa1ad]">{label}</div>
    </div>
  )
}

function StatusPill({ children, tone = 'dark' }) {
  const styles = {
    dark: 'bg-[#111827] text-white',
    green: 'bg-[#ecfdf3] text-[#16803c]',
    gray: 'bg-[#f2f4f7] text-[#667085]',
    red: 'bg-[#fff1f1] text-[#e5484d]',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${styles[tone] || styles.dark}`}>
      {children}
    </span>
  )
}

function EpisodeMetric({ icon, value, color = 'text-[#555b66]' }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#555b66]">
      <i className={`${icon} ${color} text-[11px]`} />
      {value}
    </span>
  )
}

function ActionButton({ children, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[12px] font-extrabold active:scale-95 ${
        primary
          ? 'bg-[#111827] text-white shadow-sm'
          : 'border border-[#e4e7ec] bg-white text-[#111827]'
      }`}
    >
      {children}
    </button>
  )
}

function MoreButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3fa] text-[#555b66] active:scale-95"
      aria-label="More options"
    >
      <i className="fa-solid fa-ellipsis text-[13px]" />
    </button>
  )
}

function PublishedEpisodeCard({ episode, onEdit, onMore }) {
  return (
    <article className="rounded-[22px] border border-[#eceaf2] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="line-clamp-1 text-[15px] font-extrabold text-[#111827]">{episode.title}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11.5px] text-[#8d94a1]">
            <span>Published {episode.publishedAt}</span>
            <span className="h-1 w-1 rounded-full bg-[#d0d5dd]" />
            <span>{episode.words} words</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {episode.adult ? <StatusPill tone="red">18+</StatusPill> : null}
          <MoreButton onClick={() => onMore(episode)} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <EpisodeMetric icon="fa-regular fa-eye" value={episode.views} />
        <EpisodeMetric icon="fa-solid fa-heart" value={episode.likes} color="text-[#e5484d]" />
        <EpisodeMetric icon="fa-regular fa-comment" value={episode.comments} />
      </div>

      <div className="mt-4 flex justify-end">
        <ActionButton onClick={() => onEdit(episode)}>Edit</ActionButton>
      </div>
    </article>
  )
}

function DraftEpisodeCard({ episode, onEdit, onPreview, onPublish, onMore }) {
  return (
    <article className="rounded-[22px] border border-[#eceaf2] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-1 flex h-9 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#98a2b3] active:scale-95"
          aria-label="Reorder draft episode"
        >
          <i className="fa-solid fa-grip-vertical text-[15px]" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="line-clamp-1 text-[15px] font-extrabold text-[#111827]">{episode.title}</div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11.5px] text-[#8d94a1]">
                <span>{episode.schedule || 'Not scheduled'}</span>
                <span className="h-1 w-1 rounded-full bg-[#d0d5dd]" />
                <span>{episode.words} words</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {episode.adult ? <StatusPill tone="red">18+</StatusPill> : null}
              <MoreButton onClick={() => onMore(episode)} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <ActionButton onClick={() => onEdit(episode)}>Edit</ActionButton>
            <ActionButton onClick={() => onPreview(episode)}>Preview</ActionButton>
            <ActionButton primary onClick={() => onPublish(episode)}>Publish</ActionButton>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function StoryManagerPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [activeTab, setActiveTab] = useState('Published')

  const story = {
    id: storyId || '1',
    title: 'Name Novel',
    status: 'Published',
    words: '20,000',
    updated: '14/06/2026',
    cover: '',
    episodes: '04',
    drafts: '02',
    adult: '01',
    libraryAdds: '100',
  }

  const episodes = [
    {
      id: 1,
      title: 'Name Episode',
      status: 'Published',
      publishedAt: '15 Mar 2022 at 4:46 PM',
      words: '670',
      views: '2,000',
      likes: '1,000',
      comments: '1,000',
      adult: true,
    },
    {
      id: 2,
      title: 'Name Episode',
      status: 'Published',
      publishedAt: '15 Mar 2022 at 4:46 PM',
      words: '670',
      views: '2,000',
      likes: '1,000',
      comments: '1,000',
      adult: false,
    },
    {
      id: 3,
      title: 'Name Episode',
      status: 'Draft',
      schedule: 'Release date: 15 Mar 2022 at 4:46 PM',
      words: '670',
      adult: false,
    },
    {
      id: 4,
      title: 'Name Episode',
      status: 'Draft',
      schedule: '',
      words: '670',
      adult: true,
    },
  ]

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) => episode.status === activeTab)
  }, [activeTab])

  const handleEditStory = () => {
    navigate(`/author/story/${story.id}/edit-info`)
  }

  const handleAddEpisode = () => {
    navigate(`/author/story/${story.id}/episode/create`)
  }

  const handleEditEpisode = (episode) => {
    navigate(`/author/story/${story.id}/episode/${episode.id}/edit`)
  }

  const handlePreviewEpisode = (episode) => {
    navigate(`/author/story/${story.id}/episode/${episode.id}/preview`)
  }

  const handlePublishEpisode = (episode) => {
    navigate(`/author/story/${story.id}/episode/${episode.id}/publish`)
  }

  const handleMoreEpisode = (episode) => {
    navigate(`/author/story/${story.id}/episode/${episode.id}/options`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
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

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex gap-3.5">
            <button
              type="button"
              onClick={handleEditStory}
              className="h-[124px] w-[88px] shrink-0 overflow-hidden rounded-[16px] bg-[#111827] active:scale-[0.98]"
              aria-label="Edit story info"
            >
              {story.cover ? <img src={story.cover} alt={story.title} className="h-full w-full object-cover" /> : null}
            </button>

            <div className="min-w-0 flex-1 py-1">
              <h2 className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">{story.title}</h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusPill tone="green">{story.status}</StatusPill>
                <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10px] font-bold text-[#555b66]">
                  {story.words} words
                </span>
              </div>

              <div className="mt-3 text-[12px] text-[#8d94a1]">
                Last update <span className="font-bold text-[#555b66]">{story.updated}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton onClick={handleEditStory}>Edit Story</ActionButton>
                <ActionButton primary onClick={handleAddEpisode}>
                  <i className="fa-solid fa-plus mr-1.5 text-[11px]" />
                  Add Episode
                </ActionButton>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 divide-x divide-[#eef0f4] rounded-[20px] bg-[#fafafe] px-2 py-3.5">
            <SummaryStat value={story.episodes} label="Episodes" />
            <SummaryStat value={story.drafts} label="Drafts" />
            <SummaryStat value={story.adult} label="18+" />
            <SummaryStat value={story.libraryAdds} label="Library Adds" />
          </div>
        </section>

        <section className="mt-4 rounded-[22px] bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-2 gap-2">
            {['Published', 'Draft'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-[18px] py-3 text-[14px] font-extrabold active:scale-[0.99] ${
                  activeTab === tab ? 'bg-[#111827] text-white' : 'bg-transparent text-[#667085]'
                }`}
              >
                {tab === 'Draft' ? 'Drafts' : 'Published'}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 space-y-3">
          {filteredEpisodes.map((episode) =>
            activeTab === 'Published' ? (
              <PublishedEpisodeCard
                key={episode.id}
                episode={episode}
                onEdit={handleEditEpisode}
                onMore={handleMoreEpisode}
              />
            ) : (
              <DraftEpisodeCard
                key={episode.id}
                episode={episode}
                onEdit={handleEditEpisode}
                onPreview={handlePreviewEpisode}
                onPublish={handlePublishEpisode}
                onMore={handleMoreEpisode}
              />
            )
          )}
        </section>
      </main>
    </div>
  )
}

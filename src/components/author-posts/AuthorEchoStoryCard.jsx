import { useNavigate } from 'react-router-dom'

export default function AuthorEchoStoryCard({ source }) {
  const navigate = useNavigate()
  if (!source || !['story', 'episode'].includes(source.type) || !source.id) return null

  const isEpisode = source.type === 'episode'
  const story = source.story || {}
  const episode = source.episode || {}
  const title = story.title || source.name || 'Story'
  const genre = story.main_genre || ''
  const ownerName = source.owner?.page_name || source.owner?.name || ''
  const summary = isEpisode ? episode.title || source.content || ownerName || genre : ownerName || genre
  const detail = isEpisode ? ownerName || genre : genre !== summary ? genre : ''
  const coverUrl = story.landscape_thumbnail_url || story.cover_url || source.image_url || ''

  return (
    <button
      type="button"
      onClick={() => navigate(isEpisode
        ? `/story/${encodeURIComponent(story.id || episode.story_id)}/episode/${encodeURIComponent(source.id)}`
        : `/story/${encodeURIComponent(source.id)}`)}
      className="mx-4 mb-4 block w-[calc(100%-2rem)] overflow-hidden rounded-[10px] bg-[#f7f7fa] dark:bg-[#1c1f2b] text-left ring-1 ring-black/10 dark:ring-white/10 active:scale-[0.995] disabled:cursor-default"
    >
      {coverUrl ? (
        <div className="aspect-video w-full overflow-hidden bg-[#eceef2] dark:bg-[#1c1f2b]">
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-[#111827] via-[#312e81] to-[#7c3aed]">
          <i className="fa-solid fa-book-open text-[30px] text-white/90" />
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3] dark:text-white/40">{isEpisode ? 'EPISODE' : 'STORY'}</div>
          <div className="mt-1 line-clamp-2 text-[15px] font-semibold leading-5 text-[#111827] dark:text-[#f8fafc]">{title}</div>
          {summary ? (
            <div className="mt-1 line-clamp-2 text-[12px] font-normal leading-5 text-[#667085] dark:text-white/60">{summary}</div>
          ) : null}
          {detail ? (
            <div className="mt-1 text-[11px] font-normal text-[#98a2b3] dark:text-white/40">{detail}</div>
          ) : null}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#171923] text-[#111827] dark:text-[#f8fafc] shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <i className="fa-solid fa-chevron-right text-[12px]" />
        </div>
      </div>
    </button>
  )
}

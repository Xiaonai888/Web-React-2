import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('episodePreviewSection', {
  en: {
    episodeCover: 'Episode cover',
    cover: 'Cover',
    untitledEpisode: 'Untitled Episode',
    episodes: 'Episodes',
    noEpisodesYet: 'No episodes yet',
    publishedAppearHere: 'Published episodes will appear here.',
    upToEpisode: 'Up to Ep. {{count}}',
  },
  km: {
    episodeCover: 'គម្របភាគ',
    cover: 'គម្រប',
    untitledEpisode: 'ភាគគ្មានចំណងជើង',
    episodes: 'ភាគ',
    noEpisodesYet: 'មិនទាន់មានភាគ',
    publishedAppearHere: 'ភាគដែលបានបោះពុម្ពនឹងបង្ហាញនៅទីនេះ។',
    upToEpisode: 'រហូតដល់ភាគ {{count}}',
  },
  zh: {
    episodeCover: '章节封面',
    cover: '封面',
    untitledEpisode: '无标题章节',
    episodes: '章节',
    noEpisodesYet: '暂无章节',
    publishedAppearHere: '已发布的章节会显示在这里。',
    upToEpisode: '至第 {{count}} 章',
  },
  ja: {
    episodeCover: 'エピソード表紙',
    cover: '表紙',
    untitledEpisode: '無題のエピソード',
    episodes: 'エピソード',
    noEpisodesYet: 'エピソードはまだありません',
    publishedAppearHere: '公開されたエピソードがここに表示されます。',
    upToEpisode: 'Ep. {{count}} まで',
  },
  ko: {
    episodeCover: '에피소드 표지',
    cover: '표지',
    untitledEpisode: '제목 없는 에피소드',
    episodes: '에피소드',
    noEpisodesYet: '아직 에피소드가 없습니다',
    publishedAppearHere: '게시된 에피소드가 여기에 표시됩니다.',
    upToEpisode: 'Ep. {{count}}까지',
  },
})

function formatShortNumber(value) {
  const number = Number(value || 0)
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return number.toLocaleString()
}

function formatDate(value, locale) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale || 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function EpisodeRow({ episode, story, onOpenEpisode }) {
  const { t } = useDisplayTranslation()
  const displayLanguage = getDisplayLanguageId() || 'en'
  const cover = episode.cover_url || story?.cover_url || ''
  const locked = episode.is_locked && Number(episode.episode_number || 0) > 5
  const date = formatDate(episode.created_at || episode.published_at || episode.updated_at, displayLanguage)
  const likes = formatShortNumber(episode.total_likes || episode.likes_count || episode.likes || 0)
  const comments = formatShortNumber(episode.total_comments || episode.comments_count || episode.comments || 0)

  return (
    <button
      type="button"
      onClick={() => onOpenEpisode(episode)}
      className="flex w-full items-center gap-3 bg-[var(--shadow-bg-surface)] px-0 py-3 text-left active:scale-[0.995]"
    >
      <div className="relative flex h-[76px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[var(--shadow-bg-soft)]">
        {cover ? (
          <img
            src={cover}
            alt={episode.title || t('episodePreviewSection.episodeCover')}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[11px] font-bold text-[var(--shadow-text-secondary)]">
            {t('episodePreviewSection.cover')}
          </span>
        )}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
            <i className="fa-solid fa-lock text-[17px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-5 text-[var(--shadow-text-primary)]">
          {episode.title || t('episodePreviewSection.untitledEpisode')}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
          {date ? <span>{date}</span> : null}

          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-heart text-[11px]" />
            {likes}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-comment text-[11px]" />
            {comments}
          </span>
        </div>
      </div>
    </button>
  )
}

function EpisodeSkeletonList() {
  return (
    <div className="divide-y divide-[var(--shadow-border)]">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex w-full items-center gap-3 bg-[var(--shadow-bg-surface)] px-0 py-3">
          <div className="h-[76px] w-[104px] shrink-0 animate-pulse rounded-[12px] bg-[var(--shadow-bg-soft)]" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function EpisodePreviewSection({
  story,
  episodes = [],
  totalEpisodes = 0,
  loading = false,
  onOpenEpisode,
  onOpenAll,
}) {
  const { t } = useDisplayTranslation()

  return (
    <section className="mt-0 bg-[var(--shadow-bg-surface)] px-4 py-4 sm:mt-4 sm:rounded-[18px] sm:px-5 sm:py-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
      <div className="mb-3">
        <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
          {t('episodePreviewSection.episodes')}
        </h2>
      </div>

      {loading ? (
        <EpisodeSkeletonList />
      ) : episodes.length ? (
        <div className="divide-y divide-[var(--shadow-border)]">
          {episodes.map((episode) => (
            <EpisodeRow
              key={episode.id}
              episode={episode}
              story={story}
              onOpenEpisode={onOpenEpisode}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--shadow-bg-soft)] px-5 py-8 text-center">
          <i className="fa-regular fa-file-lines text-[28px] text-[var(--shadow-text-secondary)]" />
          <div className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">
            {t('episodePreviewSection.noEpisodesYet')}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
            {t('episodePreviewSection.publishedAppearHere')}
          </div>
        </div>
      )}

      {!loading && totalEpisodes ? (
        <button
          type="button"
          onClick={onOpenAll}
          className="mt-4 flex h-12 w-full items-center justify-center gap-3 border-t border-[var(--shadow-border)] pt-4 text-[13px] font-semibold text-[var(--shadow-text-secondary)] active:scale-[0.99]"
        >
          <i className="fa-solid fa-sort text-[12px]" />
          <span>
            {t('episodePreviewSection.upToEpisode', {
              count: totalEpisodes,
            })}
          </span>
        </button>
      ) : null}
    </section>
  )
}

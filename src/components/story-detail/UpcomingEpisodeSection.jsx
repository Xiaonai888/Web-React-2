import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('upcomingEpisodeSection', {
  en: {
    upcoming: 'Upcoming',
    nextEpisode: 'Next Episode',
    episodeNumber: 'Ep. {{number}}',
    untitled: 'New episode coming soon',
  },
  km: {
    upcoming: 'Upcoming',
    nextEpisode: 'ភាគបន្ទាប់',
    episodeNumber: 'ភាគទី {{number}}',
    untitled: 'ភាគថ្មីនឹងចេញផ្សាយឆាប់ៗ',
  },
  zh: {
    upcoming: 'Upcoming',
    nextEpisode: '下一章',
    episodeNumber: '第 {{number}} 章',
    untitled: '新章节即将发布',
  },
  ja: {
    upcoming: 'Upcoming',
    nextEpisode: '次のエピソード',
    episodeNumber: '第 {{number}} 話',
    untitled: '新しいエピソードがまもなく公開',
  },
  ko: {
    upcoming: 'Upcoming',
    nextEpisode: '다음 에피소드',
    episodeNumber: '{{number}}화',
    untitled: '새 에피소드가 곧 공개됩니다',
  },
})

function formatReleaseDate(value, locale) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  try {
    return new Intl.DateTimeFormat(locale || 'en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Phnom_Penh',
    }).format(date)
  } catch {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Phnom_Penh',
    }).format(date)
  }
}

export default function UpcomingEpisodeSection({ episode, story }) {
  const { t } = useDisplayTranslation()
  const publishTime = Date.parse(episode?.scheduled_at || '')

  if (!Number.isFinite(publishTime) || publishTime <= Date.now()) return null

  const cover = episode.cover_url || story?.cover_url || ''
  const number = Number(episode.episode_number || 0)
  const date = formatReleaseDate(episode.scheduled_at, getDisplayLanguageId() || 'en')

  return (
    <section
      aria-label={t('upcomingEpisodeSection.upcoming')}
      className="mx-3 mt-3 overflow-hidden rounded-[18px] border border-[#e9d6fb] bg-[#fbf7ff] text-[#26163d] dark:border-[#553b70] dark:bg-[#241a33] dark:text-[#f4eaff] sm:mx-4 sm:mt-4"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#ead8f8] bg-[#f4e9ff] px-3.5 py-2.5 dark:border-[#553b70] dark:bg-[#342344]">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#6a28b4] dark:text-[#dab4ff]">
          <i className="fa-regular fa-calendar-days" aria-hidden="true" />
          <span>{t('upcomingEpisodeSection.upcoming')}</span>
        </div>
        <span className="rounded-full bg-[#e6d0f7] px-2.5 py-1 text-[10px] font-semibold text-[#7138a4] dark:bg-[#54366e] dark:text-[#edd5ff]">
          {t('upcomingEpisodeSection.nextEpisode')}
        </span>
      </div>

      <div className="flex items-center gap-3 px-3.5 py-3">
        <div className="relative h-[66px] w-[90px] shrink-0 overflow-hidden rounded-[12px] bg-[#e9def3] dark:bg-[#453451]">
          {cover ? (
            <img
              src={cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <i className="fa-solid fa-book text-[20px] text-[#9577b4]" aria-hidden="true" />
            </div>
          )}
          <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#68289f] text-white">
            <i className="fa-regular fa-clock text-[10px]" aria-hidden="true" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-[13px] font-bold leading-5">
            {number > 0 ? `${t('upcomingEpisodeSection.episodeNumber', { number })} · ` : ''}
            {episode.title || t('upcomingEpisodeSection.untitled')}
          </div>
          {date ? (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#7745a5] dark:text-[#c9a3ee]">
              <i className="fa-regular fa-calendar text-[11px]" aria-hidden="true" />
              <time dateTime={episode.scheduled_at}>{date}</time>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

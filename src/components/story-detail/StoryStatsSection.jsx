import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyStatsSection', {
  en: {
    rank: 'No.{{rank}}',
    likes: 'Likes',
    views: 'Views',
    rate: 'Rate',
  },
  km: {
    rank: 'លេខ {{rank}}',
    likes: 'ចូលចិត្ត',
    views: 'ការមើល',
    rate: 'ពិន្ទុ',
  },
  zh: {
    rank: '第 {{rank}} 名',
    likes: '喜欢',
    views: '浏览',
    rate: '评分',
  },
  ja: {
    rank: '第{{rank}}位',
    likes: 'いいね',
    views: '閲覧',
    rate: '評価',
  },
  ko: {
    rank: '{{rank}}위',
    likes: '좋아요',
    views: '조회',
    rate: '평점',
  },
})

function formatShortNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`

  return number.toLocaleString()
}

function StatItem({ label, value, icon, onClick }) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="min-w-0 text-center active:scale-[0.99]"
    >
      <div className="text-[20px] font-bold leading-none text-[var(--shadow-text-primary)]">
        {value}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-bold text-[var(--shadow-text-secondary)]">
        <i className={`${icon} text-[11px]`} />
        <span>{label}</span>
        {onClick ? <i className="fa-solid fa-chevron-right ml-0.5 text-[9px] text-[var(--shadow-text-secondary)]" /> : null}
      </div>
    </Component>
  )
}

export default function StoryStatsSection({ story, episodes, onOpenLikes, onOpenRating, onOpenRanking }) {
  const { t } = useDisplayTranslation()
  const rank = Number(story?.rank_by_views || 0)
  const rating = Number(story?.rating_average || story?.rating || 0)
  const showRank = rank > 0 && rank <= 100

  return (
    <section className="relative z-20 -mt-10 w-full">
      <div className="w-full overflow-hidden rounded-t-[16px] bg-[var(--shadow-bg-surface)] shadow-[0_-10px_28px_rgba(17,24,39,0.08)]">
        {showRank ? (
  <div className="px-4 pt-4">
    <button
      type="button"
      onClick={onOpenRanking}
      className="flex h-11 w-full items-center justify-between rounded-[14px] bg-[#fff7df] px-5 text-[var(--shadow-text-primary)] active:scale-[0.99] dark:bg-amber-500/10 sm:h-12"
    >
      <div className="flex items-center gap-3">
        <img
          src="/assets/Icons/Award.svg"
          alt=""
          className="h-[23px] w-[23px] object-contain"
        />
        <span className="text-[14px] font-bold text-[#f6a800] dark:text-amber-300">
          {t('storyStatsSection.rank', { rank })}
        </span>
      </div>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#f6a800] dark:text-amber-300" />
    </button>
  </div>
) : null}

        <div className="grid grid-cols-3 gap-2 px-5 py-5">
          <StatItem
  label={t('storyStatsSection.likes')}
  value={formatShortNumber(story?.total_likes)}
  icon="fa-regular fa-heart"
  onClick={onOpenLikes}
/>

          <StatItem
            label={t('storyStatsSection.views')}
            value={formatShortNumber(story?.total_views)}
            icon="fa-regular fa-eye"
          />

          <StatItem
            label={t('storyStatsSection.rate')}
            value={rating.toFixed(1)}
            icon="fa-solid fa-star"
            onClick={onOpenRating}
          />
        </div>
      </div>
    </section>
  )
}

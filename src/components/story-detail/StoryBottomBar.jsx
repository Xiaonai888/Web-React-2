import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyBottomBar', {
  en: {
    subscribe: 'Subscribe',
    continueEpisode: 'Continue Ep. {{count}}',
    readNow: 'Read Now',
    noEpisode: 'No Episode',
  },
  km: {
    subscribe: 'ជាវតាម',
    continueEpisode: 'បន្តអានភាគ {{count}}',
    readNow: 'អានឥឡូវនេះ',
    noEpisode: 'មិនមានភាគ',
  },
  zh: {
    subscribe: '订阅',
    continueEpisode: '继续第 {{count}} 章',
    readNow: '立即阅读',
    noEpisode: '暂无章节',
  },
  ja: {
    subscribe: '購読',
    continueEpisode: 'Ep. {{count}} を続ける',
    readNow: '今すぐ読む',
    noEpisode: 'エピソードなし',
  },
  ko: {
    subscribe: '구독',
    continueEpisode: 'Ep. {{count}} 계속 읽기',
    readNow: '지금 읽기',
    noEpisode: '에피소드 없음',
  },
})

export default function StoryBottomBar({ subscribed, onToggleSubscribe, episode, onRead }) {
  const { t } = useDisplayTranslation()
  const label = episode && Number(episode.episode_number || 0) > 1
    ? t('storyBottomBar.continueEpisode', { count: episode.episode_number })
    : t('storyBottomBar.readNow')

  return (
    <div className="fixed bottom-[3px] left-0 right-0 z-50 px-4 pb-[14px] pt-7 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-[96px] before:bg-[linear-gradient(to_top,#fff_0%,rgba(255,255,255,0.96)_45%,rgba(255,255,255,0.55)_72%,rgba(255,255,255,0)_100%)] before:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[28px] after:h-[48px] after:bg-white after:content-[''] dark:before:bg-[linear-gradient(to_top,#171923_0%,rgba(23,25,35,0.96)_45%,rgba(23,25,35,0.55)_72%,rgba(23,25,35,0)_100%)] dark:after:bg-[#171923]">
      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-[44px_1fr] gap-2">
        <button
          type="button"
          onClick={onToggleSubscribe}
          className={`flex h-11 items-center justify-center rounded-full ring-1 ring-[var(--shadow-border)] active:scale-95 ${
            subscribed
              ? 'bg-[#fff1f1] text-[#e5484d] dark:bg-red-500/10 dark:text-red-300'
              : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
          }`}
          aria-label={t('storyBottomBar.subscribe')}
        >
          <i className={`${subscribed ? 'fa-solid' : 'fa-regular'} fa-heart text-[18px]`} />
        </button>

        <button
          type="button"
          onClick={onRead}
          disabled={!episode}
          className="flex h-11 items-center justify-center rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af] dark:bg-white dark:text-[#111827] dark:disabled:bg-slate-600 dark:disabled:text-slate-300"
        >
          <i className="fa-solid fa-book-open mr-2 text-[13px]" />
          {episode ? label : t('storyBottomBar.noEpisode')}
        </button>
      </div>
    </div>
  )
}

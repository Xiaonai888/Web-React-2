import { SurfaceCard } from '../../common/PagePrimitives'

function safeCount(value) {
  const number = Number(value)
  return Number.isSafeInteger(number) && number >= 0 ? number : 0
}

export default function ReadEventFeaturedCardWallet({ wallet, storyId, onOpenStory, t }) {
  const available = safeCount(wallet?.available_cards)
  const granted = safeCount(wallet?.granted_cards)
  const spent = safeCount(wallet?.spent_cards)
  const unlockable = Math.floor(available / 10)
  const remainder = available % 10

  return (
    <SurfaceCard className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="app-title text-[16px] font-extrabold">{t('readEventRewards.featuredCards')}</h2>
          <p className="app-muted mt-1 text-[12px]">{t('readEventRewards.storyOnly')}</p>
        </div>
        <span className="rounded-full bg-[var(--shadow-accent)] px-3 py-1.5 text-[12px] font-bold text-[var(--shadow-accent-text)]">
          {t('readEventRewards.cardsAvailable', { count: available })}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          [t('readEventRewards.granted'), granted],
          [t('readEventRewards.spent'), spent],
          [t('readEventRewards.episodesReady'), unlockable],
        ].map(([label, number]) => (
          <div className="app-soft rounded-xl p-3 text-center" key={label}>
            <div className="app-title text-[18px] font-extrabold">{number.toLocaleString()}</div>
            <div className="app-muted mt-1 text-[11px]">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
        <div className="h-full bg-[var(--shadow-accent)]" style={{ width: `${remainder * 10}%` }} />
      </div>
      <p className="app-muted mt-2 text-[11px]">
        {t('readEventRewards.tenPerEpisode')} · {t('readEventRewards.nextEpisodeProgress', { count: remainder })}
      </p>
      {storyId && (
        <button type="button" onClick={() => onOpenStory(storyId)}
          className="mt-4 w-full rounded-full bg-[var(--shadow-text-primary)] px-4 py-3 text-[12px] font-bold text-[var(--shadow-bg-surface)]">
          {t('readEventRewards.openFeaturedStory')}
        </button>
      )}
    </SurfaceCard>
  )
}

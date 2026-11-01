import { SurfaceCard } from '../../common/PagePrimitives'

const rewardTypes = new Set(['milestone', 'daily_top', 'overall_top', 'participation'])
const safeAmount = (value) => Math.max(0, Number(value) || 0)

export default function ReadEventRewardHistory({ rewards = [], redemptions = [], pagination, loading, onPageChange, t }) {
  const rows = Array.isArray(rewards) ? rewards : []
  const spent = Array.isArray(redemptions) ? redemptions : []
  const page = Number(pagination?.page) || 1

  return (
    <div className="grid gap-4">
      <SurfaceCard className="p-4 sm:p-5">
        <h2 className="app-title mb-4 text-[16px] font-extrabold">{t('readEventRewards.rewardHistory')}</h2>
        {rows.length === 0 ? <p className="app-muted text-[12px]">{t('readEventRewards.noRewards')}</p> : null}
        <div className="grid gap-2">
          {rows.map((reward) => (
            <article key={reward.id} className="app-soft rounded-xl p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="app-title text-[12px]">
                  {t(`readEventRewards.types.${rewardTypes.has(reward.reward_type) ? reward.reward_type : 'other'}`)}
                  {reward.rank_number ? ` #${reward.rank_number}` : ''}
                  {reward.tier ? ` · ${t('readEventRewards.tier', { count: reward.tier })}` : ''}
                </strong>
                <span className="app-muted text-[11px]">{t(`readEventRewards.statuses.${reward.grant_status === 'granted' ? 'granted' : 'pending'}`)}</span>
              </div>
              <div className="app-title mt-2 text-[12px]">
                {safeAmount(reward.coin_amount)} {t('readEventRewards.coins')}
                {' · '}{safeAmount(reward.voucher_amount)} {t('readEventRewards.vouchers')}
                {safeAmount(reward.card_amount) > 0 ? ` · ${safeAmount(reward.card_amount)} ${t('readEventRewards.cards')}` : ''}
              </div>
              <p className="app-muted mt-1 text-[10px]">{reward.granted_at ? new Date(reward.granted_at).toLocaleString() : ''}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" disabled={loading || page <= 1} onClick={() => onPageChange(page - 1)}
            className="app-soft rounded-lg px-4 py-2 text-[12px] font-bold text-[var(--shadow-text-primary)] disabled:opacity-40">
            {t('readEventRewards.previous')}
          </button>
          <span className="app-muted text-[11px]">{t('readEventRewards.page', { count: page })}</span>
          <button type="button" disabled={loading || !pagination?.has_more} onClick={() => onPageChange(page + 1)}
            className="app-soft rounded-lg px-4 py-2 text-[12px] font-bold text-[var(--shadow-text-primary)] disabled:opacity-40">
            {t('readEventRewards.next')}
          </button>
        </div>
      </SurfaceCard>
      <SurfaceCard className="p-4 sm:p-5">
        <h2 className="app-title mb-3 text-[16px] font-extrabold">{t('readEventRewards.recentRedemptions')}</h2>
        {spent.length === 0 ? <p className="app-muted text-[12px]">{t('readEventRewards.noRedemptions')}</p> : null}
        <div className="grid gap-2">
          {spent.map((item) => (
            <div key={`${item.episode_id}:${item.redeemed_at}`} className="app-soft rounded-xl p-3">
              <strong className="app-title text-[12px]">{t('readEventRewards.cardsUsed', { count: safeAmount(item.cards_spent) })}</strong>
              <p className="app-muted mt-1 break-all text-[10px]">{item.episode_id}</p>
              <p className="app-muted mt-1 text-[10px]">{new Date(item.redeemed_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  )
}

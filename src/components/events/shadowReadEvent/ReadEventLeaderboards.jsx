import { SurfaceCard } from '../../common/PagePrimitives'

const MISSION_NAMES = new Set([
  'daily_story', 'free_read', 'read_new', 'read_update', 'read_completed',
  'read_genre', 'read_authors', 'reading_streak', 'task_coins', 'episode_marathon',
])

const toCount = (value) => Math.max(0, Number(value) || 0)
const percent = (value, maximum) => Math.min(100, Math.round(toCount(value) / Math.max(1, toCount(maximum)) * 100))

export default function ReadEventMissionBoard({ data, t, onOpenStory, onClaim, claiming }) {
  const event = data?.event || {}
  const joined = data?.participation?.joined === true
  const missions = Array.isArray(data?.missions) ? data.missions : []
  const milestones = Array.isArray(data?.milestones) ? data.milestones : []
  const points = toCount(data?.progress?.daily_points)
  const tiersAvailable = milestones.some((tier) => tier.unlocked === true && tier.granted !== true)

  return (
    <div className="grid gap-4">
      <SurfaceCard className="p-4 sm:p-5">
        <h2 className="app-title text-[15px] font-extrabold">{t('shadowReadEventPage.featured')}</h2>
        <div className="mt-3 flex gap-3">
          {event.featured_story?.cover_url ? (
            <img className="h-28 w-20 shrink-0 rounded-xl object-cover" src={event.featured_story.cover_url}
              alt={event.featured_story?.title || ''} loading="lazy" />
          ) : <div className="app-soft h-28 w-20 shrink-0 rounded-xl" />}
          <div className="min-w-0 flex-1">
            <p className="app-title line-clamp-2 text-[14px] font-bold">{event.featured_story?.title || t('shadowReadEventPage.unknownStory')}</p>
            <p className="app-muted mt-2 text-[12px]">{t('shadowReadEventPage.featuredDetails')}</p>
            {event.featured_story?.story_url && (
              <button type="button" className="mt-3 rounded-full bg-[var(--shadow-accent)] px-4 py-2 text-[12px] font-bold text-[var(--shadow-accent-text)]"
                onClick={() => onOpenStory(event.featured_story.story_url)}>
                {t('shadowReadEventPage.openStory')}
              </button>
            )}
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="app-title text-[15px] font-extrabold">{t('shadowReadEventPage.dailyMissions')}</h2>
          <strong className="text-[12px] text-[var(--shadow-accent)]">{points.toLocaleString()}/1,000</strong>
        </div>
        <p className="app-muted mt-1 text-[12px]">{t('shadowReadEventPage.dayNumber', { count: event.day_number || 1 })}</p>
        <div className="mt-4 grid gap-3">
          {missions.map((mission) => {
            const label = MISSION_NAMES.has(mission.mission_type) ? mission.mission_type : 'other'
            return (
              <div key={mission.id} className="app-soft rounded-xl p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="app-title text-[13px] font-bold">{mission.slot}. {t(`shadowReadEventPage.missionTypes.${label}`)}</p>
                    <p className="app-muted mt-1 text-[11px]">{t('shadowReadEventPage.target', { count: mission.target_amount })}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-[var(--shadow-text-secondary)]">
                    {toCount(mission.earned_points)}/{toCount(mission.max_points)}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--shadow-border-strong)]">
                  <div className="h-full rounded-full bg-[var(--shadow-accent)]" style={{ width: `${percent(mission.earned_points, mission.max_points)}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="app-muted text-[11px]">{mission.completed ? t('shadowReadEventPage.completed') : t('shadowReadEventPage.inProgress')}</span>
                  {mission.mission_type === 'daily_story' && event.daily_story?.story_url && (
                    <button type="button" onClick={() => onOpenStory(event.daily_story.story_url)}
                      className="text-[11px] font-bold text-[var(--shadow-accent)]">{t('shadowReadEventPage.readStory')}</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="app-title text-[15px] font-extrabold">{t('shadowReadEventPage.dailyRewards')}</h2>
          <span className="app-muted text-[11px]">{t('shadowReadEventPage.maxCoins')}</span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-3">
          {milestones.map((tier) => (
            <div key={tier.tier} className={`rounded-xl p-2 text-center ${tier.granted ? 'bg-emerald-500/10' : 'app-soft'}`}>
              <div className="app-muted text-[10px]">{toCount(tier.required_points)}</div>
              <div className="app-title mt-1 text-[12px] font-extrabold">+{toCount(tier.coin_reward)}</div>
              <div className="app-muted mt-1 text-[10px]">
                {tier.granted ? t('shadowReadEventPage.claimed') : tier.unlocked ? t('shadowReadEventPage.ready') : t('shadowReadEventPage.locked')}
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={onClaim} disabled={!joined || !tiersAvailable || claiming}
          className="mt-4 w-full rounded-full bg-[var(--shadow-accent)] px-5 py-3 text-[13px] font-extrabold text-[var(--shadow-accent-text)] disabled:opacity-40">
          {claiming ? t('shadowReadEventPage.claiming') : t('shadowReadEventPage.claimRewards')}
        </button>
      </SurfaceCard>
    </div>
  )
}

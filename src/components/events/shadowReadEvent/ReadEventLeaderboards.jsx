import { PageErrorState, PageLoadingState, SurfaceCard } from '../../common/PagePrimitives'

const safePoints = (value) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)).toLocaleString() : '0'

export default function ReadEventLeaderboards({ kind, dayNumber, lastDay, onKindChange, onDayChange, data, loading, error, onRetry, t }) {
  const board = data?.available === true ? data.leaderboard : null
  const topThree = Array.isArray(board?.top_three) ? board.top_three : []
  const maximumDay = Math.min(7, Math.max(1, Number(lastDay) || 1))

  return (
    <div className="grid gap-4">
      <SurfaceCard className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {['daily', 'overall'].map((value) => (
            <button key={value} type="button" aria-pressed={kind === value} onClick={() => onKindChange(value)}
              className={`rounded-full border px-4 py-2 text-[12px] font-bold ${kind === value
                ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]'}`}>
              {t(`shadowReadEventPage.${value}Ranking`)}
            </button>
          ))}
        </div>
        {kind === 'daily' && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: maximumDay }, (_, i) => i + 1).map((day) => (
              <button key={day} type="button" aria-pressed={dayNumber === day} onClick={() => onDayChange(day)}
                className={`min-h-9 rounded-full px-3 text-[11px] font-bold ${dayNumber === day
                  ? 'bg-[var(--shadow-accent)] text-[var(--shadow-accent-text)]'
                  : 'app-soft text-[var(--shadow-text-primary)]'}`}>
                {t('shadowReadEventPage.dayNumber', { count: day })}
              </button>
            ))}
          </div>
        )}
      </SurfaceCard>

      {loading && <PageLoadingState label={t('shadowReadEventPage.loadingRanking')} rows={3} />}
      {!loading && error && (
        <PageErrorState title={t('shadowReadEventPage.rankingError')} body={error}
          actionLabel={t('shadowReadEventPage.retry')} onAction={onRetry} />
      )}
      {!loading && !error && !board && (
        <SurfaceCard className="p-6 text-center text-[12px] text-[var(--shadow-text-secondary)]">
          {t('shadowReadEventPage.noRanking')}
        </SurfaceCard>
      )}
      {!loading && !error && board && (
        <SurfaceCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="app-title text-[15px] font-extrabold">{t('shadowReadEventPage.topThree')}</h2>
            <span className="app-muted text-[11px]">{t('shadowReadEventPage.readerCount', { count: Number(board.scored_readers || 0) })}</span>
          </div>
          {topThree.length === 0 ? (
            <p className="app-muted py-5 text-center text-[12px]">{t('shadowReadEventPage.noScores')}</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {topThree.map((row, index) => (
                <div key={row.user_id || index} className="app-soft flex items-center gap-3 rounded-xl p-3">
                  <div className="w-8 shrink-0 text-center text-[17px] font-black text-[var(--shadow-accent)]">{row.rank || index + 1}</div>
                  {row.avatar_url ? (
                    <img src={row.avatar_url} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  ) : <div className="app-elevated flex h-10 w-10 items-center justify-center rounded-full text-[15px]">★</div>}
                  <div className="min-w-0 flex-1">
                    <p className="app-title truncate text-[13px] font-bold">{row.name || t('shadowReadEventPage.reader')}</p>
                    <p className="app-muted mt-1 text-[10px]">{safePoints(row.points)} {t('shadowReadEventPage.points')}</p>
                  </div>
                  <div className="text-right text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
                    {kind === 'daily'
                      ? <>{safePoints(row.prize_preview?.coins)} {t('shadowReadEventPage.coins')}<div>+{safePoints(row.prize_preview?.vouchers)} {t('shadowReadEventPage.vouchers')}</div></>
                      : <>{safePoints(row.prize_preview?.story_cards)} {t('shadowReadEventPage.cards')}<div>{t('shadowReadEventPage.giftBox')}</div></>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="app-soft mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl p-3">
            <div>
              <p className="app-title text-[12px] font-bold">{t('shadowReadEventPage.myRank')}</p>
              <p className="app-muted mt-1 text-[11px]">{board.my_rank == null ? t('shadowReadEventPage.unranked') : `#${board.my_rank}`}</p>
            </div>
            <strong className="text-[13px] text-[var(--shadow-text-primary)]">{safePoints(board.my_points)} {t('shadowReadEventPage.points')}</strong>
          </div>
          {kind === 'overall' && !board.is_final && <p className="app-muted mt-3 text-[11px]">{t('shadowReadEventPage.provisional')}</p>}
        </SurfaceCard>
      )}
    </div>
  )
}

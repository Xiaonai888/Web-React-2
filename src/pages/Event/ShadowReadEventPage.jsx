import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageShell, PageHeader, PageLoadingState, PageErrorState, PageEmptyState, SurfaceCard,
} from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ReadEventMissionBoard from '../../components/events/shadowReadEvent/ReadEventMissionBoard'
import ReadEventLeaderboards from '../../components/events/shadowReadEvent/ReadEventLeaderboards'
import {
  getShadowReadEvent, joinShadowReadEvent, claimShadowReadEventMilestones,
  getShadowReadEventLeaderboard,
} from '../../services/shadowReadEventClient'

registerTranslationNamespace('shadowReadEventPage', {
  en: {
    title: 'Shadow Read Event', subtitle: 'Seven days of reading and rewards', back: 'Go back', retry: 'Try again',
    refresh: 'Refresh', loading: 'Loading Read Event...', loadError: 'Could not load Read Event',
    loginRequired: 'Sign in to join this event.', notEligible: 'This event is for Cambodian readers.',
    inactive: 'The Read Event is not active yet.', nextStart: 'Next event: {{date}}',
    join: 'Join event', joining: 'Joining...', joined: 'Joined', joinSuccess: 'You have joined the event.',
    missionsTab: 'Missions', rankingsTab: 'Rankings', dayNumber: 'Day {{count}}',
    dailyScore: 'Today', totalScore: 'Overall', points: 'points',
    featured: 'Featured prize story', featuredDetails: 'Event Story Cards are for this story only. 10 cards unlock one episode.',
    unknownStory: 'Story unavailable', openStory: 'Open story', dailyMissions: 'Daily missions',
    target: 'Target: {{count}}', completed: 'Completed', inProgress: 'In progress', readStory: 'Read story',
    dailyRewards: 'Daily milestone rewards', maxCoins: 'Up to 400 coins', claimed: 'Claimed',
    ready: 'Ready', locked: 'Locked', claiming: 'Claiming...', claimRewards: 'Claim available rewards',
    claimSuccess: '+{{count}} coins awarded', claimNone: 'No new rewards to claim.',
    dailyRanking: 'Daily Top 3', overallRanking: 'Overall Top 3', loadingRanking: 'Loading rankings...',
    rankingError: 'Could not load rankings', noRanking: 'No ranking available yet.',
    topThree: 'Top 3 readers', readerCount: '{{count}} scored readers', noScores: 'No scores yet.',
    reader: 'Reader', coins: 'coins', vouchers: 'vouchers', cards: 'cards', giftBox: '+ gift box',
    viewRewards: 'View my cards and rewards',
    myRank: 'My rank', unranked: 'Not ranked yet', provisional: 'Final results will be confirmed after day 7.',
    missionTypes: {daily_story:'Read the daily story', free_read:'Read free episodes', read_new:'Read new stories',
      read_update:'Read updated stories', read_completed:'Read completed stories', read_genre:'Explore genres',
      read_authors:'Read different authors', reading_streak:'Keep a reading streak', task_coins:'Earn Task Center coins',
      episode_marathon:'Episode marathon', other:'Reading mission'},
  },
  km: {
    title: 'Shadow Read Event', subtitle: 'អានរឿង ៧ ថ្ងៃ និងទទួលរង្វាន់', back: 'ត្រឡប់ក្រោយ', retry: 'សាកល្បងម្ដងទៀត',
    refresh: 'ផ្ទុកឡើងវិញ', loading: 'កំពុងផ្ទុកព្រឹត្តិការណ៍...', loadError: 'មិនអាចផ្ទុកព្រឹត្តិការណ៍បាន',
    loginRequired: 'សូមចូលគណនីដើម្បីចូលរួម។', notEligible: 'ព្រឹត្តិការណ៍នេះសម្រាប់អ្នកអានកម្ពុជាប៉ុណ្ណោះ។',
    inactive: 'ព្រឹត្តិការណ៍មិនទាន់បើកទេ។', nextStart: 'ព្រឹត្តិការណ៍បន្ទាប់៖ {{date}}',
    join: 'ចូលរួមព្រឹត្តិការណ៍', joining: 'កំពុងចូលរួម...', joined: 'បានចូលរួម', joinSuccess: 'អ្នកបានចូលរួមជោគជ័យ។',
    missionsTab: 'បេសកកម្ម', rankingsTab: 'ចំណាត់ថ្នាក់', dayNumber: 'ថ្ងៃទី {{count}}',
    dailyScore: 'ពិន្ទុថ្ងៃនេះ', totalScore: 'ពិន្ទុសរុប', points: 'ពិន្ទុ',
    featured: 'រឿងរង្វាន់ពិសេស', featuredDetails: 'កាតពីព្រឹត្តិការណ៍ប្រើបានតែរឿងនេះ។ ១០ កាតដោះសោ ១ ភាគ។',
    unknownStory: 'រកមិនឃើញរឿង', openStory: 'បើករឿង', dailyMissions: 'បេសកកម្មប្រចាំថ្ងៃ',
    target: 'គោលដៅ៖ {{count}}', completed: 'បានសម្រេច', inProgress: 'កំពុងធ្វើ', readStory: 'អានរឿង',
    dailyRewards: 'រង្វាន់ពិន្ទុប្រចាំថ្ងៃ', maxCoins: 'រហូតដល់ ៤០០ កាក់', claimed: 'បានទទួល',
    ready: 'អាចទទួល', locked: 'មិនទាន់ដោះសោ', claiming: 'កំពុងទទួល...', claimRewards: 'ទទួលរង្វាន់ដែលមាន',
    claimSuccess: 'ទទួលបាន {{count}} កាក់', claimNone: 'មិនមានរង្វាន់ថ្មីទេ។',
    dailyRanking: 'Top 3 ប្រចាំថ្ងៃ', overallRanking: 'Top 3 សរុប', loadingRanking: 'កំពុងផ្ទុកចំណាត់ថ្នាក់...',
    rankingError: 'មិនអាចផ្ទុកចំណាត់ថ្នាក់បាន', noRanking: 'មិនទាន់មានចំណាត់ថ្នាក់។',
    topThree: 'អ្នកអានកំពូល ៣ នាក់', readerCount: 'អ្នកមានពិន្ទុ {{count}} នាក់', noScores: 'មិនទាន់មានពិន្ទុ។',
    reader: 'អ្នកអាន', coins: 'កាក់', vouchers: 'វ៉ូឆឺរ', cards: 'កាត', giftBox: '+ ហិបរង្វាន់',
    viewRewards: 'មើលកាត និងរង្វាន់របស់ខ្ញុំ',
    myRank: 'ចំណាត់ថ្នាក់ខ្ញុំ', unranked: 'មិនទាន់មានចំណាត់ថ្នាក់', provisional: 'លទ្ធផលចុងក្រោយបញ្ជាក់ក្រោយថ្ងៃទី ៧។',
    missionTypes: {daily_story:'អានរឿងប្រចាំថ្ងៃ', free_read:'អានភាគឥតគិតថ្លៃ', read_new:'អានរឿងថ្មី',
      read_update:'អានរឿងទើបអាប់ដេត', read_completed:'អានរឿងចប់', read_genre:'អានរឿងតាមប្រភេទ',
      read_authors:'អានពីអ្នកនិពន្ធផ្សេងៗ', reading_streak:'អានបន្តជាប្រចាំ', task_coins:'រកកាក់ក្នុង Task Center',
      episode_marathon:'អានភាគបន្តគ្នា', other:'បេសកកម្មអានរឿង'},
  },
  zh: {
    title:'Shadow 阅读活动', subtitle:'连续七天阅读并赢取奖励', back:'返回', retry:'重试', refresh:'刷新',
    loading:'正在加载阅读活动...', loadError:'无法加载阅读活动', loginRequired:'请先登录才能参加。',
    notEligible:'此活动仅面向柬埔寨读者。', inactive:'阅读活动尚未开始。', nextStart:'下次活动：{{date}}',
    join:'参加活动', joining:'正在参加...', joined:'已参加', joinSuccess:'成功参加活动。',
    missionsTab:'任务', rankingsTab:'排行榜', dayNumber:'第 {{count}} 天', dailyScore:'今日积分', totalScore:'总积分', points:'积分',
    featured:'精选奖励故事', featuredDetails:'活动故事卡仅适用于本故事。10 张卡解锁一集。', unknownStory:'故事不可用', openStory:'打开故事',
    dailyMissions:'每日任务', target:'目标：{{count}}', completed:'已完成', inProgress:'进行中', readStory:'阅读故事',
    dailyRewards:'每日里程碑奖励', maxCoins:'最多 400 金币', claimed:'已领取', ready:'可领取', locked:'未解锁',
    claiming:'领取中...', claimRewards:'领取可用奖励', claimSuccess:'获得 {{count}} 金币', claimNone:'没有新奖励可领取。',
    dailyRanking:'每日前三', overallRanking:'总榜前三', loadingRanking:'正在加载排行榜...', rankingError:'无法加载排行榜',
    noRanking:'暂无排行榜。', topThree:'前三名读者', readerCount:'{{count}} 名读者得分', noScores:'暂无积分。',
    reader:'读者', coins:'金币', vouchers:'代金券', cards:'故事卡', giftBox:'+ 礼盒', myRank:'我的排名',
    viewRewards:'查看我的卡片与奖励',
    unranked:'尚未排名', provisional:'最终结果将在第七天后确定。',
    missionTypes:{daily_story:'阅读每日故事',free_read:'阅读免费章节',read_new:'阅读新故事',read_update:'阅读更新故事',
      read_completed:'阅读完结故事',read_genre:'探索类型',read_authors:'阅读不同作者',reading_streak:'连续阅读',
      task_coins:'赚取任务中心金币',episode_marathon:'连续阅读章节',other:'阅读任务'},
  },
  ja: {
    title:'Shadow 読書イベント', subtitle:'7日間読んで報酬を獲得', back:'戻る', retry:'再試行', refresh:'更新',
    loading:'イベントを読み込み中...', loadError:'イベントを読み込めません', loginRequired:'参加するにはログインしてください。',
    notEligible:'カンボジアの読者限定イベントです。', inactive:'イベントはまだ開催されていません。', nextStart:'次回：{{date}}',
    join:'参加する', joining:'参加中...', joined:'参加済み', joinSuccess:'イベントに参加しました。',
    missionsTab:'ミッション', rankingsTab:'ランキング', dayNumber:'{{count}} 日目', dailyScore:'今日のポイント',
    totalScore:'累計ポイント', points:'ポイント', featured:'特典対象作品',
    featuredDetails:'イベントカードはこの作品限定。10枚で1話を解放できます。', unknownStory:'作品がありません', openStory:'作品を開く',
    dailyMissions:'デイリーミッション', target:'目標：{{count}}', completed:'完了', inProgress:'進行中', readStory:'読む',
    dailyRewards:'デイリー達成報酬', maxCoins:'最大400コイン', claimed:'受取済み', ready:'受取可能', locked:'未解放',
    claiming:'受取中...', claimRewards:'報酬を受け取る', claimSuccess:'{{count}} コイン獲得', claimNone:'新しい報酬はありません。',
    dailyRanking:'デイリーTop 3', overallRanking:'総合Top 3', loadingRanking:'ランキングを読み込み中...', rankingError:'ランキングを読み込めません',
    noRanking:'ランキングはまだありません。', topThree:'上位3名', readerCount:'得点した読者：{{count}}人', noScores:'得点はまだありません。',
    reader:'読者', coins:'コイン', vouchers:'バウチャー', cards:'カード', giftBox:'+ ギフトボックス', myRank:'自分の順位',
    viewRewards:'カードと報酬を見る',
    unranked:'未ランクイン', provisional:'最終結果は7日目終了後に確定します。',
    missionTypes:{daily_story:'今日の作品を読む',free_read:'無料の話を読む',read_new:'新作を読む',read_update:'更新作品を読む',
      read_completed:'完結作品を読む',read_genre:'ジャンルを探索',read_authors:'複数の作者を読む',reading_streak:'読書を継続',
      task_coins:'タスクセンターでコイン獲得',episode_marathon:'連続エピソード',other:'読書ミッション'},
  },
  ko: {
    title:'Shadow 독서 이벤트', subtitle:'7일 동안 읽고 보상 받기', back:'뒤로', retry:'다시 시도', refresh:'새로고침',
    loading:'이벤트 불러오는 중...', loadError:'이벤트를 불러올 수 없습니다', loginRequired:'참여하려면 로그인하세요.',
    notEligible:'캄보디아 독자 전용 이벤트입니다.', inactive:'이벤트가 아직 시작되지 않았습니다.', nextStart:'다음 이벤트: {{date}}',
    join:'이벤트 참여', joining:'참여 중...', joined:'참여 완료', joinSuccess:'이벤트에 참여했습니다.',
    missionsTab:'미션', rankingsTab:'랭킹', dayNumber:'{{count}}일 차', dailyScore:'오늘 점수', totalScore:'전체 점수', points:'점수',
    featured:'특별 보상 작품', featuredDetails:'이벤트 카드는 이 작품에서만 사용합니다. 10장으로 1화를 해제합니다.',
    unknownStory:'작품을 찾을 수 없음', openStory:'작품 보기', dailyMissions:'일일 미션', target:'목표: {{count}}',
    completed:'완료', inProgress:'진행 중', readStory:'작품 읽기', dailyRewards:'일일 단계 보상', maxCoins:'최대 400코인',
    claimed:'수령 완료', ready:'수령 가능', locked:'잠김', claiming:'수령 중...', claimRewards:'보상 수령',
    claimSuccess:'{{count}}코인 획득', claimNone:'새로 받을 보상이 없습니다.', dailyRanking:'일일 Top 3',
    overallRanking:'종합 Top 3', loadingRanking:'랭킹 불러오는 중...', rankingError:'랭킹을 불러올 수 없습니다',
    noRanking:'아직 랭킹이 없습니다.', topThree:'상위 3명', readerCount:'점수 획득 독자 {{count}}명', noScores:'점수가 없습니다.',
    reader:'독자', coins:'코인', vouchers:'바우처', cards:'카드', giftBox:'+ 선물 상자', myRank:'내 순위',
    viewRewards:'내 카드와 보상 보기',
    unranked:'순위 없음', provisional:'최종 결과는 7일 차 종료 후 확정됩니다.',
    missionTypes:{daily_story:'오늘의 작품 읽기',free_read:'무료 회차 읽기',read_new:'신작 읽기',read_update:'업데이트 작품 읽기',
      read_completed:'완결 작품 읽기',read_genre:'장르 탐색',read_authors:'여러 작가의 작품 읽기',reading_streak:'연속 독서',
      task_coins:'태스크 센터 코인 획득',episode_marathon:'연속 회차 읽기',other:'독서 미션'},
  },
})

export default function ShadowReadEventPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [loadErrorCode, setLoadErrorCode] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [tab, setTab] = useState('missions')
  const [rankingKind, setRankingKind] = useState('daily')
  const [rankingDay, setRankingDay] = useState(1)
  const [rankingCacheVersion, setRankingCacheVersion] = useState(0)
  const [rankingData, setRankingData] = useState(null)
  const [rankingLoading, setRankingLoading] = useState(false)
  const [rankingError, setRankingError] = useState('')
  const rankingCache = useRef(new Map())

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setLoadError('')
    setLoadErrorCode('')
    getShadowReadEvent({ signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return
      setData(result)
      if (result.active && Number.isInteger(Number(result.event?.day_number))) {
        setRankingDay(Math.min(7, Math.max(1, Number(result.event.day_number))))
      }
    }).catch((error) => {
      if (!controller.signal.aborted) {
        setLoadError(error?.message || 'READ_EVENT_UNAVAILABLE')
        setLoadErrorCode(error?.code || '')
      }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [refresh])

  const eventId = data?.event?.id || ''
  const lastDay = Math.min(7, Math.max(1, Number(data?.event?.day_number) || 1))
  useEffect(() => {
    if (tab !== 'rankings' || !data?.active || !eventId) return undefined
    const key = `${eventId}:${rankingKind}:${rankingDay}`
    const cached = rankingCache.current.get(key)
    if (cached) {
      setRankingData(cached)
      setRankingError('')
      setRankingLoading(false)
      return undefined
    }
    const controller = new AbortController()
    setRankingData(null)
    setRankingError('')
    setRankingLoading(true)
    getShadowReadEventLeaderboard(rankingKind, rankingDay, { signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          rankingCache.current.set(key, result)
          setRankingData(result)
        }
      })
      .catch((error) => { if (!controller.signal.aborted) setRankingError(error?.message || 'READ_EVENT_UNAVAILABLE') })
      .finally(() => { if (!controller.signal.aborted) setRankingLoading(false) })
    return () => controller.abort()
  }, [tab, eventId, rankingKind, rankingDay, rankingCacheVersion])

  function reload() {
    rankingCache.current.clear()
    setRankingCacheVersion((n) => n + 1)
    setRefresh((n) => n + 1)
  }

  async function join() {
    if (busy || data?.participation?.joined) return
    setBusy('join')
    setNotice('')
    try {
      await joinShadowReadEvent()
      setNotice(t('shadowReadEventPage.joinSuccess'))
      reload()
    } catch (error) {
      setNotice(error?.message || t('shadowReadEventPage.loadError'))
    } finally { setBusy('') }
  }

  async function claim() {
    if (busy || !data?.participation?.joined) return
    setBusy('claim')
    setNotice('')
    try {
      const response = await claimShadowReadEventMilestones(Number(data.event.day_number))
      setNotice(Number(response.coins_added) > 0
        ? t('shadowReadEventPage.claimSuccess', { count: response.coins_added })
        : t('shadowReadEventPage.claimNone'))
      reload()
    } catch (error) {
      setNotice(error?.message || t('shadowReadEventPage.loadError'))
    } finally { setBusy('') }
  }

  function openStory(url) {
    if (typeof url === 'string' && /^\/story\/[a-zA-Z0-9-]+$/.test(url)) navigate(url)
  }

  const errorMessage = loadErrorCode === 'KHMER_READER_ONLY' ? t('shadowReadEventPage.notEligible')
    : loadErrorCode === 'READER_LOGIN_REQUIRED' ? t('shadowReadEventPage.loginRequired') : loadError

  return (
    <PageShell className="pb-20">
      <PageHeader title={t('shadowReadEventPage.title')} subtitle={t('shadowReadEventPage.subtitle')}
        onBack={() => navigate(-1)} backLabel={t('shadowReadEventPage.back')}
        right={<button type="button" onClick={reload} disabled={loading || Boolean(busy)}
          className="rounded-full border border-[var(--shadow-border)] px-3 py-2 text-[11px] font-bold text-[var(--shadow-text-primary)]">
          {t('shadowReadEventPage.refresh')}
        </button>} />

      <main className="mx-auto grid max-w-[960px] gap-4 px-4 py-5">
        {notice && <SurfaceCard className="p-3 text-[12px] text-[var(--shadow-text-primary)]" as="aside">{notice}</SurfaceCard>}
        {loading && <PageLoadingState label={t('shadowReadEventPage.loading')} />}
        {!loading && loadError && <PageErrorState title={t('shadowReadEventPage.loadError')}
          body={errorMessage} actionLabel={t('shadowReadEventPage.retry')} onAction={reload} />}
        {!loading && !loadError && data?.active === false && (
          <PageEmptyState title={t('shadowReadEventPage.inactive')}
            body={data?.next_start || data?.scheduled_for
              ? t('shadowReadEventPage.nextStart', { date: data.next_start || data.scheduled_for }) : ''} />
        )}
        {!loading && !loadError && data?.active && (
          <>
            <SurfaceCard className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="app-title text-[17px] font-extrabold">{t('shadowReadEventPage.dayNumber', { count: data.event?.day_number || 1 })}</h2>
                  <p className="app-muted mt-1 text-[11px]">{data.event?.starts_on} — {data.event?.ends_on}</p>
                </div>
                {data.participation?.joined ? (
                  <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-[12px] font-bold text-emerald-600 dark:text-emerald-300">
                    {t('shadowReadEventPage.joined')}
                  </span>
                ) : (
                  <button type="button" onClick={join} disabled={Boolean(busy)}
                    className="rounded-full bg-[var(--shadow-accent)] px-5 py-2.5 text-[12px] font-extrabold text-[var(--shadow-accent-text)] disabled:opacity-50">
                    {busy === 'join' ? t('shadowReadEventPage.joining') : t('shadowReadEventPage.join')}
                  </button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="app-soft rounded-xl p-3">
                  <p className="app-muted text-[11px]">{t('shadowReadEventPage.dailyScore')}</p>
                  <strong className="app-title mt-1 block text-[20px]">{Number(data.progress?.daily_points || 0).toLocaleString()}</strong>
                </div>
                <div className="app-soft rounded-xl p-3">
                  <p className="app-muted text-[11px]">{t('shadowReadEventPage.totalScore')}</p>
                  <strong className="app-title mt-1 block text-[20px]">{Number(data.progress?.overall_points || 0).toLocaleString()}</strong>
                </div>
              </div>
              {data.participation?.joined && eventId && (
                <button type="button"
                  onClick={() => navigate(`/event/shadow-read/rewards?event_id=${encodeURIComponent(eventId)}`)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[12px] font-bold text-[var(--shadow-text-primary)] transition-colors hover:bg-[var(--shadow-bg-hover)]">
                  <i className="fas fa-gift text-[13px]" aria-hidden="true" />
                  {t('shadowReadEventPage.viewRewards')}
                </button>
              )}
            </SurfaceCard>
            <div className="flex gap-2">
              {['missions', 'rankings'].map((value) => (
                <button key={value} type="button" aria-pressed={tab === value} onClick={() => setTab(value)}
                  className={`rounded-full px-5 py-2.5 text-[12px] font-extrabold ${tab === value
                    ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]'
                    : 'app-soft text-[var(--shadow-text-primary)]'}`}>
                  {t(`shadowReadEventPage.${value}Tab`)}
                </button>
              ))}
            </div>
            {tab === 'missions' ? (
              <ReadEventMissionBoard data={data} t={t} onOpenStory={openStory}
                onClaim={claim} claiming={busy === 'claim'} />
            ) : (
              <ReadEventLeaderboards kind={rankingKind} dayNumber={rankingDay} lastDay={lastDay}
                onKindChange={setRankingKind} onDayChange={setRankingDay} t={t}
                data={rankingData} loading={rankingLoading} error={rankingError}
                onRetry={() => { rankingCache.current.clear(); setRankingCacheVersion((n) => n + 1) }} />
            )}
          </>
        )}
      </main>
    </PageShell>
  )
}

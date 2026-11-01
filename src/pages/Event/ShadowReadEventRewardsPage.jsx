import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PageShell, PageHeader, PageLoadingState, PageErrorState, PageEmptyState, SurfaceCard,
} from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ReadEventFeaturedCardWallet from '../../components/events/shadowReadEvent/ReadEventFeaturedCardWallet'
import ReadEventRewardHistory from '../../components/events/shadowReadEvent/ReadEventRewardHistory'
import { getShadowReadEventRewards } from '../../services/shadowReadEventRewardsClient'

registerTranslationNamespace('readEventRewards', {
  en: {
    title: 'Read Event Rewards', subtitle: 'Your event cards and rewards', back: 'Back', refresh: 'Refresh',
    loading: 'Loading your rewards...', loadFailed: 'Unable to load rewards', retry: 'Try again',
    missingEvent: 'Choose a Read Event to view its rewards.', notJoined: 'You did not join this Read Event.',
    loginRequired: 'Please sign in to view rewards.', eventNotFound: 'This Read Event could not be found.',
    featuredCards: 'Featured Story Cards', storyOnly: 'These cards work only for the featured story of this event.',
    cardsAvailable: '{{count}} cards', granted: 'Granted', spent: 'Spent', episodesReady: 'Episodes available',
    tenPerEpisode: '10 cards unlock one episode', nextEpisodeProgress: '{{count}}/10 cards toward the next episode',
    openFeaturedStory: 'Open featured story', redemptionPending: 'Card redemption is not available yet.',
    rewardHistory: 'Reward history', noRewards: 'No rewards recorded yet.',
    recentRedemptions: 'Recent card redemptions', noRedemptions: 'No redemptions yet.',
    cardsUsed: '{{count}} cards used', coins: 'coins', vouchers: 'vouchers', cards: 'cards',
    previous: 'Previous', next: 'Next', page: 'Page {{count}}', tier: 'Tier {{count}}',
    types: {milestone:'Daily milestone', daily_top:'Daily ranking', overall_top:'Overall ranking', participation:'Participation', other:'Reward'},
    statuses: {granted:'Granted', pending:'Pending'},
  },
  km: {
    title: 'រង្វាន់ Read Event', subtitle: 'កាត និងរង្វាន់ក្នុងព្រឹត្តិការណ៍', back: 'ត្រឡប់ក្រោយ', refresh: 'ផ្ទុកឡើងវិញ',
    loading: 'កំពុងផ្ទុករង្វាន់...', loadFailed: 'មិនអាចផ្ទុករង្វាន់បាន', retry: 'សាកល្បងម្ដងទៀត',
    missingEvent: 'សូមជ្រើសព្រឹត្តិការណ៍ដើម្បីមើលរង្វាន់។', notJoined: 'អ្នកមិនបានចូលរួមព្រឹត្តិការណ៍នេះទេ។',
    loginRequired: 'សូមចូលគណនីដើម្បីមើលរង្វាន់។', eventNotFound: 'មិនមានព្រឹត្តិការណ៍នេះទេ។',
    featuredCards: 'កាតរឿង Featured', storyOnly: 'កាតនេះប្រើបានតែសម្រាប់រឿង Featured នៃព្រឹត្តិការណ៍នេះ។',
    cardsAvailable: '{{count}} កាត', granted: 'បានទទួល', spent: 'បានប្រើ', episodesReady: 'ភាគអាចដោះសោ',
    tenPerEpisode: '១០ កាតដោះសោ ១ ភាគ', nextEpisodeProgress: '{{count}}/១០ កាតសម្រាប់ភាគបន្ទាប់',
    openFeaturedStory: 'បើករឿង Featured', redemptionPending: 'ការដោះសោដោយកាតមិនទាន់បើកទេ។',
    rewardHistory: 'ប្រវត្តិរង្វាន់', noRewards: 'មិនទាន់មានប្រវត្តិរង្វាន់ទេ។',
    recentRedemptions: 'ប្រវត្តិប្រើកាតថ្មីៗ', noRedemptions: 'មិនទាន់បានប្រើកាតទេ។',
    cardsUsed: 'ប្រើ {{count}} កាត', coins: 'កាក់', vouchers: 'វ៉ូឆឺរ', cards: 'កាត',
    previous: 'មុន', next: 'បន្ទាប់', page: 'ទំព័រ {{count}}', tier: 'កម្រិត {{count}}',
    types: {milestone:'រង្វាន់ប្រចាំថ្ងៃ', daily_top:'ចំណាត់ថ្នាក់ប្រចាំថ្ងៃ', overall_top:'ចំណាត់ថ្នាក់សរុប', participation:'រង្វាន់ចូលរួម', other:'រង្វាន់'},
    statuses: {granted:'បានទទួល', pending:'កំពុងរង់ចាំ'},
  },
  zh: {
    title: '阅读活动奖励', subtitle: '活动卡片与奖励', back: '返回', refresh: '刷新',
    loading: '正在加载奖励...', loadFailed: '无法加载奖励', retry: '重试',
    missingEvent: '请选择活动以查看奖励。', notJoined: '您没有参加该阅读活动。',
    loginRequired: '请先登录后查看奖励。', eventNotFound: '找不到该阅读活动。',
    featuredCards: '精选故事卡', storyOnly: '这些卡片仅适用于本活动的精选故事。',
    cardsAvailable: '{{count}} 张卡', granted: '已发放', spent: '已使用', episodesReady: '可解锁章节',
    tenPerEpisode: '10 张卡解锁一章', nextEpisodeProgress: '下一章进度：{{count}}/10',
    openFeaturedStory: '打开精选故事', redemptionPending: '卡片兑换尚未开放。',
    rewardHistory: '奖励记录', noRewards: '暂无奖励记录。',
    recentRedemptions: '最近兑换记录', noRedemptions: '暂无兑换记录。',
    cardsUsed: '使用 {{count}} 张卡', coins: '金币', vouchers: '代金券', cards: '卡片',
    previous: '上一页', next: '下一页', page: '第 {{count}} 页', tier: '等级 {{count}}',
    types: {milestone:'每日里程碑',daily_top:'每日排名',overall_top:'总排名',participation:'参与奖励',other:'奖励'},
    statuses: {granted:'已发放',pending:'待发放'},
  },
  ja: {
    title: '読書イベント報酬', subtitle: 'イベントカードと報酬', back: '戻る', refresh: '更新',
    loading: '報酬を読み込み中...', loadFailed: '報酬を読み込めません', retry: '再試行',
    missingEvent: '報酬を表示するイベントを選択してください。', notJoined: 'このイベントには参加していません。',
    loginRequired: '報酬を見るにはログインしてください。', eventNotFound: 'イベントが見つかりません。',
    featuredCards: '対象作品カード', storyOnly: 'カードはこのイベントの対象作品でのみ使えます。',
    cardsAvailable: '{{count}} 枚', granted: '獲得', spent: '使用済み', episodesReady: '解放可能な話数',
    tenPerEpisode: '10枚で1話を解放', nextEpisodeProgress: '次の1話まで {{count}}/10 枚',
    openFeaturedStory: '対象作品を開く', redemptionPending: 'カード交換はまだ利用できません。',
    rewardHistory: '報酬履歴', noRewards: '報酬履歴はまだありません。',
    recentRedemptions: '最近のカード交換', noRedemptions: '交換履歴はまだありません。',
    cardsUsed: '{{count}} 枚使用', coins: 'コイン', vouchers: 'バウチャー', cards: 'カード',
    previous: '前へ', next: '次へ', page: '{{count}} ページ', tier: '段階 {{count}}',
    types: {milestone:'デイリー達成',daily_top:'デイリー順位',overall_top:'総合順位',participation:'参加報酬',other:'報酬'},
    statuses: {granted:'獲得済み',pending:'処理待ち'},
  },
  ko: {
    title: '독서 이벤트 보상', subtitle: '이벤트 카드와 보상', back: '뒤로', refresh: '새로고침',
    loading: '보상을 불러오는 중...', loadFailed: '보상을 불러올 수 없습니다', retry: '다시 시도',
    missingEvent: '보상을 볼 이벤트를 선택하세요.', notJoined: '이 이벤트에 참여하지 않았습니다.',
    loginRequired: '보상을 보려면 로그인하세요.', eventNotFound: '이벤트를 찾을 수 없습니다.',
    featuredCards: '추천 작품 카드', storyOnly: '이 카드는 해당 이벤트의 추천 작품에서만 사용할 수 있습니다.',
    cardsAvailable: '{{count}}장', granted: '지급', spent: '사용', episodesReady: '해제 가능한 회차',
    tenPerEpisode: '카드 10장으로 1화 해제', nextEpisodeProgress: '다음 회차까지 {{count}}/10장',
    openFeaturedStory: '추천 작품 열기', redemptionPending: '카드 교환은 아직 사용할 수 없습니다.',
    rewardHistory: '보상 내역', noRewards: '아직 보상 내역이 없습니다.',
    recentRedemptions: '최근 카드 교환', noRedemptions: '아직 교환 내역이 없습니다.',
    cardsUsed: '{{count}}장 사용', coins: '코인', vouchers: '바우처', cards: '카드',
    previous: '이전', next: '다음', page: '{{count}}페이지', tier: '{{count}}단계',
    types: {milestone:'일일 달성',daily_top:'일일 순위',overall_top:'종합 순위',participation:'참여 보상',other:'보상'},
    statuses: {granted:'지급됨',pending:'대기 중'},
  },
})

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ShadowReadEventRewardsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const params = new URLSearchParams(location.search)
  const requestedId = params.get('event_id') || location.state?.eventId || ''
  const eventId = typeof requestedId === 'string' && UUID.test(requestedId) ? requestedId : ''
  const [page, setPage] = useState(1)
  const [revision, setRevision] = useState(0)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [loading, setLoading] = useState(Boolean(eventId))

  useEffect(() => {
    if (!eventId) { setData(null); setLoading(false); return undefined }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getShadowReadEventRewards(eventId, page, { signal: controller.signal })
      .then((result) => { if (!controller.signal.aborted) setData(result) })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || 'READ_EVENT_REWARDS_UNAVAILABLE')
          setErrorCode(err.code || '')
          setData(null)
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [eventId, page, revision])

  function refresh() { setRevision((n) => n + 1) }
  function openStory(storyId) {
    if (UUID.test(storyId)) navigate(`/story/${storyId}`)
  }
  const messages = {
    READER_LOGIN_REQUIRED: 'loginRequired',
    READ_EVENT_NOT_JOINED: 'notJoined',
    READ_EVENT_NOT_FOUND: 'eventNotFound',
  }
  const errorBody = messages[errorCode] ? t(`readEventRewards.${messages[errorCode]}`) : error

  return (
    <PageShell className="pb-20">
      <PageHeader title={t('readEventRewards.title')} subtitle={t('readEventRewards.subtitle')}
        onBack={() => navigate(-1)} backLabel={t('readEventRewards.back')}
        right={<button type="button" disabled={loading || !eventId} onClick={refresh}
          className="rounded-full border border-[var(--shadow-border)] px-3 py-2 text-[11px] font-bold text-[var(--shadow-text-primary)] disabled:opacity-40">
          {t('readEventRewards.refresh')}
        </button>} />
      <main className="mx-auto grid max-w-[960px] gap-4 px-4 py-5">
        {!eventId && <PageEmptyState title={t('readEventRewards.missingEvent')} />}
        {eventId && loading && <PageLoadingState label={t('readEventRewards.loading')} rows={3} />}
        {eventId && !loading && error && <PageErrorState title={t('readEventRewards.loadFailed')}
          body={errorBody} actionLabel={t('readEventRewards.retry')} onAction={refresh} />}
        {eventId && !loading && !error && data?.ok && (
          <>
            <ReadEventFeaturedCardWallet wallet={data.wallet} storyId={data.event?.featured_story_id}
              onOpenStory={openStory} t={t} />
            {!data.redemption_enabled && (
              <SurfaceCard className="p-3 text-[12px] text-[var(--shadow-text-secondary)]">
                {t('readEventRewards.redemptionPending')}
              </SurfaceCard>
            )}
            <ReadEventRewardHistory rewards={data.rewards} redemptions={data.redemptions}
              pagination={data.pagination} loading={loading} onPageChange={setPage} t={t} />
          </>
        )}
      </main>
    </PageShell>
  )
}

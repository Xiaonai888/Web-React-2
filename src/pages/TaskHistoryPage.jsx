import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('taskHistoryPage', {
  en: {
    coin: 'Coin',
    readingTimeRewards: 'Reading Time Rewards',
    rewardChests: 'Reward Chests',
    checkIn: 'Check-in',
    luckyWheel: 'Lucky Wheel',
    redeemedForGems: 'Redeemed for Gems',
    taskRewards: 'Task Rewards',
    dailyCheckIn: 'Daily Check-in',
    coinReward: 'Coin Reward',
    loadFailed: 'Failed to load history',
    goBack: 'Go back',
    rewardHistory: 'Reward History',
    rewardHint: 'Reward details and coin rules will be added later.',
    hint: 'Hint',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    history: 'History',
    latestActivity: 'Your latest coin activity.',
    all: 'All',
    noHistory: 'No history yet',
    noHistoryBody: 'Claim rewards to create your first coin record.',
  },
  km: {
    coin: 'Coin',
    readingTimeRewards: 'រង្វាន់ពេលវេលាអាន',
    rewardChests: 'ប្រអប់រង្វាន់',
    checkIn: 'Check-in',
    luckyWheel: 'កង់សំណាង',
    redeemedForGems: 'បានប្តូរទៅ Gems',
    taskRewards: 'រង្វាន់ Task',
    dailyCheckIn: 'Check-in ប្រចាំថ្ងៃ',
    coinReward: 'រង្វាន់ Coin',
    loadFailed: 'មិនអាចផ្ទុកប្រវត្តិបានទេ',
    goBack: 'ត្រឡប់ក្រោយ',
    rewardHistory: 'ប្រវត្តិរង្វាន់',
    rewardHint: 'ព័ត៌មានលម្អិតអំពីរង្វាន់ និងច្បាប់ Coin នឹងត្រូវបន្ថែមនៅពេលក្រោយ។',
    hint: 'ព័ត៌មាន',
    today: 'ថ្ងៃនេះ',
    thisWeek: 'សប្តាហ៍នេះ',
    thisMonth: 'ខែនេះ',
    history: 'ប្រវត្តិ',
    latestActivity: 'សកម្មភាព Coin ថ្មីៗរបស់អ្នក។',
    all: 'ទាំងអស់',
    noHistory: 'មិនទាន់មានប្រវត្តិទេ',
    noHistoryBody: 'ទទួលរង្វាន់ ដើម្បីបង្កើតកំណត់ត្រា Coin ដំបូងរបស់អ្នក។',
  },
  zh: {
    coin: 'Coin',
    readingTimeRewards: '阅读时长奖励',
    rewardChests: '奖励宝箱',
    checkIn: '签到',
    luckyWheel: '幸运转盘',
    redeemedForGems: '兑换为 Gems',
    taskRewards: '任务奖励',
    dailyCheckIn: '每日签到',
    coinReward: 'Coin 奖励',
    loadFailed: '无法加载历史记录',
    goBack: '返回',
    rewardHistory: '奖励记录',
    rewardHint: '奖励详情和 Coin 规则将在之后添加。',
    hint: '提示',
    today: '今天',
    thisWeek: '本周',
    thisMonth: '本月',
    history: '历史记录',
    latestActivity: '你最近的 Coin 活动。',
    all: '全部',
    noHistory: '暂无记录',
    noHistoryBody: '领取奖励后，你的第一条 Coin 记录会显示在这里。',
  },
  ja: {
    coin: 'Coin',
    readingTimeRewards: '読書時間の報酬',
    rewardChests: '報酬チェスト',
    checkIn: 'チェックイン',
    luckyWheel: 'ラッキーホイール',
    redeemedForGems: 'Gems に交換',
    taskRewards: 'タスク報酬',
    dailyCheckIn: 'デイリーチェックイン',
    coinReward: 'Coin 報酬',
    loadFailed: '履歴を読み込めませんでした',
    goBack: '戻る',
    rewardHistory: '報酬履歴',
    rewardHint: '報酬の詳細と Coin のルールは後で追加されます。',
    hint: 'ヒント',
    today: '今日',
    thisWeek: '今週',
    thisMonth: '今月',
    history: '履歴',
    latestActivity: '最近の Coin アクティビティです。',
    all: 'すべて',
    noHistory: '履歴はまだありません',
    noHistoryBody: '報酬を受け取ると、最初の Coin 記録が作成されます。',
  },
  ko: {
    coin: 'Coin',
    readingTimeRewards: '읽기 시간 보상',
    rewardChests: '보상 상자',
    checkIn: '체크인',
    luckyWheel: '행운의 룰렛',
    redeemedForGems: 'Gems로 교환',
    taskRewards: 'Task 보상',
    dailyCheckIn: '일일 체크인',
    coinReward: 'Coin 보상',
    loadFailed: '기록을 불러오지 못했습니다',
    goBack: '뒤로 가기',
    rewardHistory: '보상 기록',
    rewardHint: '보상 세부 정보와 Coin 규칙은 나중에 추가됩니다.',
    hint: '안내',
    today: '오늘',
    thisWeek: '이번 주',
    thisMonth: '이번 달',
    history: '기록',
    latestActivity: '최근 Coin 활동입니다.',
    all: '전체',
    noHistory: '아직 기록이 없습니다',
    noHistoryBody: '보상을 받으면 첫 Coin 기록이 생성됩니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getHeaders() {
  const token = getReaderToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatDateTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function CoinIcon({ className = 'h-5 w-5' }) {
  const { t } = useDisplayTranslation()

  return (
    <img
      src="/assets/Icons/Shadow%20Coin.svg"
      alt={t('taskHistoryPage.coin')}
      className={`inline-flex shrink-0 object-contain ${className}`}
    />
  )
}

function getHistoryTitle(item, t) {
  const raw = String(
    item.source_title || item.source || item.type || ''
  )
    .trim()
    .toLowerCase()

  if (raw.includes('read')) {
    return t('taskHistoryPage.readingTimeRewards')
  }
  if (raw.includes('chest')) {
    return t('taskHistoryPage.rewardChests')
  }
  if (raw.includes('check')) {
    return t('taskHistoryPage.checkIn')
  }
  if (raw.includes('wheel')) {
    return t('taskHistoryPage.luckyWheel')
  }
  if (raw.includes('redeem')) {
    return t('taskHistoryPage.redeemedForGems')
  }
  if (raw.includes('task')) {
    return t('taskHistoryPage.taskRewards')
  }
  if (raw.includes('bonus')) {
    return t('taskHistoryPage.dailyCheckIn')
  }

  return item.source_title || t('taskHistoryPage.coinReward')
}

function getSignedAmount(value) {
  const amount = Number(value || 0)
  const sign = amount < 0 ? '-' : '+'

  return `${sign}${formatNumber(Math.abs(amount))}`
}

function SummaryItem({ label, value }) {
  return (
    <div className="min-w-0 px-2 py-4 text-center sm:px-4">
      <div className="text-[11px] font-bold text-[var(--shadow-text-secondary)] sm:text-[12px]">
        {label}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1 text-[18px] font-black text-[var(--shadow-text-primary)] sm:text-[20px]">
        <CoinIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="truncate">{formatNumber(value)}</span>
      </div>
    </div>
  )
}

export default function TaskHistoryPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [summary, setSummary] = useState({
    today: 0,
    this_week: 0,
    this_month: 0,
    this_year: 0,
    total: 0,
  })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadHistory() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/tasks/history`,
        {
          headers: getHeaders(),
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('taskHistoryPage.loadFailed')
        )
      }

      setSummary(data.summary || {})
      setHistory(data.history || [])
    } catch (error) {
      setMessage(
        error.message || t('taskHistoryPage.loadFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="app-page min-h-screen pb-[100px]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[760px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center bg-transparent text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('taskHistoryPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[15px] font-black" />
          </button>

          <h1 className="text-[17px] font-black tracking-[-0.01em] text-[var(--shadow-text-primary)]">
            {t('taskHistoryPage.rewardHistory')}
          </h1>

          <button
            type="button"
            onClick={() =>
              setMessage(t('taskHistoryPage.rewardHint'))
            }
            className="flex h-10 w-10 items-center justify-center bg-transparent text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('taskHistoryPage.hint')}
          >
            <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full border-2 border-[var(--shadow-text-primary)] text-[12px] font-black leading-none">
              i
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-0 pt-0 sm:px-4 sm:pt-4">
        <section className="grid grid-cols-3 overflow-hidden bg-[var(--shadow-bg-surface)] shadow-sm sm:rounded-[26px] sm:ring-1 sm:ring-[var(--shadow-border)]">
          <SummaryItem
            label={t('taskHistoryPage.today')}
            value={summary.today}
          />
          <SummaryItem
            label={t('taskHistoryPage.thisWeek')}
            value={summary.this_week}
          />
          <SummaryItem
            label={t('taskHistoryPage.thisMonth')}
            value={summary.this_month}
          />
        </section>

        <section className="mt-2 bg-[var(--shadow-bg-surface)] p-4 shadow-sm sm:mt-4 sm:rounded-[28px] sm:p-5 sm:ring-1 sm:ring-[var(--shadow-border)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-[var(--shadow-text-primary)] sm:text-[20px]">
                {t('taskHistoryPage.history')}
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('taskHistoryPage.latestActivity')}
              </p>
            </div>

            <span className="rounded-full bg-[#fff7d6] px-3 py-1 text-[11px] font-black text-[#d97706] dark:bg-amber-500/10 dark:text-amber-300">
              {t('taskHistoryPage.all')}
            </span>
          </div>

          {message ? (
            <button
              type="button"
              onClick={() => setMessage('')}
              className="mt-4 w-full rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[var(--shadow-text-primary)]"
            >
              {message}
            </button>
          ) : null}

          {loading ? (
            <div className="mt-5 space-y-1">
              <div className="h-16 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
              <div className="h-16 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
            </div>
          ) : null}

          {!loading && history.length === 0 ? (
            <div className="mt-5 rounded-[22px] bg-[var(--shadow-bg-soft)] p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]">
                <CoinIcon className="h-8 w-8" />
              </div>
              <div className="text-[15px] font-black text-[var(--shadow-text-primary)]">
                {t('taskHistoryPage.noHistory')}
              </div>
              <div className="mt-1 text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                {t('taskHistoryPage.noHistoryBody')}
              </div>
            </div>
          ) : null}

          {!loading && history.length > 0 ? (
            <div className="mt-5 divide-y divide-[var(--shadow-border)]">
              {history.map((item) => {
                const amount = Number(item.amount_gems || 0)
                const isNegative = amount < 0

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold text-[var(--shadow-text-primary)]">
                        {getHistoryTitle(item, t)}
                      </div>
                      <div className="mt-1 text-[12px] font-medium text-[var(--shadow-text-tertiary)]">
                        {formatDateTime(item.created_at)}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-right">
                      <CoinIcon
                        className={`h-5 w-5 ${
                          isNegative
                            ? 'grayscale opacity-70'
                            : ''
                        }`}
                      />
                      <span
                        className={`text-[15px] font-black ${
                          isNegative
                            ? 'text-[var(--shadow-text-secondary)]'
                            : 'text-[var(--shadow-text-primary)]'
                        }`}
                      >
                        {getSignedAmount(amount)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}

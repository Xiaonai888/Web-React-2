import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorIncomePage', {
  en: {
    closeCalendar: 'Close calendar',
    chooseRecordDate: 'Choose record date',
    selectPeriodDescription: 'Select the {{period}} you want to view.',
    day: 'day',
    week: 'week',
    weekDate: 'week date',
    month: 'month',
    year: 'year',
    viewIncome: 'View Income',
    failedLoadIncome: 'Failed to load income records',
    cannotConnect: 'Cannot connect to backend.',
    back: 'Back',
    incomeRecords: 'Income Records',
    chooseDate: 'Choose date',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    selectedIncome: 'Selected income',
    netAuthorIncomeUsd: 'Net author income (USD)',
    diamondsEarned: 'Diamonds earned',
    paidUnlocks: 'Paid unlocks',
    incomeSources: 'Income Sources',
    readersUnlockedEpisodes: 'Readers who unlocked your episodes',
    unlocksCount: '{{count}} unlocks',
    latest100Shown: 'Latest 100 shown',
    allShown: 'All shown',
    noPaidIncomeFound: 'No paid income found',
    noPaidIncomeText: 'Paid episode unlocks for this selected period will appear here.',
    incomeInfo: 'Income shown here is the author’s net USD amount from paid Diamond unlocks.',
    reader: 'Reader',
    episodeNumber: 'Episode {{number}}',
    episodeUnlock: 'Episode unlock',
    sentGift: 'sent {{gift}}',
    sentGiftQuantity: 'sent {{quantity}} × {{gift}}',
    unlockedEpisode: 'unlocked {{episode}}',
    diamondGift: 'Diamond Gift',
    paidUnlock: 'Paid Unlock',
    story: 'Story',
  },
  km: {
    closeCalendar: 'បិទប្រតិទិន',
    chooseRecordDate: 'ជ្រើសកាលបរិច្ឆេទកំណត់ត្រា',
    selectPeriodDescription: 'ជ្រើស {{period}} ដែលអ្នកចង់មើល។',
    day: 'ថ្ងៃ',
    week: 'សប្តាហ៍',
    weekDate: 'កាលបរិច្ឆេទសប្តាហ៍',
    month: 'ខែ',
    year: 'ឆ្នាំ',
    viewIncome: 'មើលចំណូល',
    failedLoadIncome: 'មិនអាចផ្ទុកកំណត់ត្រាចំណូលបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។',
    back: 'ត្រឡប់ក្រោយ',
    incomeRecords: 'កំណត់ត្រាចំណូល',
    chooseDate: 'ជ្រើសកាលបរិច្ឆេទ',
    today: 'ថ្ងៃនេះ',
    thisWeek: 'សប្តាហ៍នេះ',
    thisMonth: 'ខែនេះ',
    thisYear: 'ឆ្នាំនេះ',
    selectedIncome: 'ចំណូលដែលបានជ្រើស',
    netAuthorIncomeUsd: 'ចំណូលសុទ្ធអ្នកនិពន្ធ (USD)',
    diamondsEarned: 'Diamond ដែលរកបាន',
    paidUnlocks: 'ការដោះសោបង់ប្រាក់',
    incomeSources: 'ប្រភពចំណូល',
    readersUnlockedEpisodes: 'អ្នកអានដែលបានដោះសោភាគរបស់អ្នក',
    unlocksCount: '{{count}} ការដោះសោ',
    latest100Shown: 'បង្ហាញ 100 ចុងក្រោយ',
    allShown: 'បង្ហាញទាំងអស់',
    noPaidIncomeFound: 'មិនមានចំណូលបង់ប្រាក់',
    noPaidIncomeText: 'ការដោះសោភាគបង់ប្រាក់សម្រាប់រយៈពេលដែលបានជ្រើស នឹងបង្ហាញនៅទីនេះ។',
    incomeInfo: 'ចំណូលដែលបង្ហាញនៅទីនេះ គឺជាចំនួន USD សុទ្ធរបស់អ្នកនិពន្ធពីការដោះសោដោយ Diamond ដែលបានបង់ប្រាក់។',
    reader: 'អ្នកអាន',
    episodeNumber: 'ភាគ {{number}}',
    episodeUnlock: 'ការដោះសោភាគ',
    sentGift: 'បានផ្ញើ {{gift}}',
    sentGiftQuantity: 'បានផ្ញើ {{quantity}} × {{gift}}',
    unlockedEpisode: 'បានដោះសោ {{episode}}',
    diamondGift: 'អំណោយ Diamond',
    paidUnlock: 'ដោះសោបង់ប្រាក់',
    story: 'រឿង',
  },
  zh: {
    closeCalendar: '关闭日历',
    chooseRecordDate: '选择记录日期',
    selectPeriodDescription: '选择你要查看的{{period}}。',
    day: '日期',
    week: '周',
    weekDate: '周日期',
    month: '月份',
    year: '年份',
    viewIncome: '查看收入',
    failedLoadIncome: '无法加载收入记录',
    cannotConnect: '无法连接后端。',
    back: '返回',
    incomeRecords: '收入记录',
    chooseDate: '选择日期',
    today: '今天',
    thisWeek: '本周',
    thisMonth: '本月',
    thisYear: '今年',
    selectedIncome: '所选收入',
    netAuthorIncomeUsd: '作者净收入 (USD)',
    diamondsEarned: '获得的 Diamond',
    paidUnlocks: '付费解锁',
    incomeSources: '收入来源',
    readersUnlockedEpisodes: '解锁你章节的读者',
    unlocksCount: '{{count}} 次解锁',
    latest100Shown: '显示最近 100 条',
    allShown: '显示全部',
    noPaidIncomeFound: '未找到付费收入',
    noPaidIncomeText: '所选期间的付费章节解锁会显示在这里。',
    incomeInfo: '这里显示的是作者从付费 Diamond 解锁获得的净 USD 收入。',
    reader: '读者',
    episodeNumber: '第 {{number}} 集',
    episodeUnlock: '章节解锁',
    sentGift: '发送了 {{gift}}',
    sentGiftQuantity: '发送了 {{quantity}} × {{gift}}',
    unlockedEpisode: '解锁了 {{episode}}',
    diamondGift: 'Diamond 礼物',
    paidUnlock: '付费解锁',
    story: '故事',
  },
  ja: {
    closeCalendar: 'カレンダーを閉じる',
    chooseRecordDate: '記録日を選択',
    selectPeriodDescription: '表示する{{period}}を選択してください。',
    day: '日',
    week: '週',
    weekDate: '週の日付',
    month: '月',
    year: '年',
    viewIncome: '収入を見る',
    failedLoadIncome: '収入記録を読み込めませんでした',
    cannotConnect: 'バックエンドに接続できません。',
    back: '戻る',
    incomeRecords: '収入記録',
    chooseDate: '日付を選択',
    today: '今日',
    thisWeek: '今週',
    thisMonth: '今月',
    thisYear: '今年',
    selectedIncome: '選択した収入',
    netAuthorIncomeUsd: '作者の純収入 (USD)',
    diamondsEarned: '獲得 Diamond',
    paidUnlocks: '有料アンロック',
    incomeSources: '収入源',
    readersUnlockedEpisodes: 'エピソードをアンロックした読者',
    unlocksCount: '{{count}} 件のアンロック',
    latest100Shown: '最新 100 件を表示',
    allShown: 'すべて表示',
    noPaidIncomeFound: '有料収入がありません',
    noPaidIncomeText: '選択した期間の有料エピソードアンロックがここに表示されます。',
    incomeInfo: 'ここには、有料 Diamond アンロックによる作者の純 USD 収入が表示されます。',
    reader: '読者',
    episodeNumber: 'エピソード {{number}}',
    episodeUnlock: 'エピソードのアンロック',
    sentGift: '{{gift}} を送信',
    sentGiftQuantity: '{{quantity}} × {{gift}} を送信',
    unlockedEpisode: '{{episode}} をアンロック',
    diamondGift: 'Diamond ギフト',
    paidUnlock: '有料アンロック',
    story: 'ストーリー',
  },
  ko: {
    closeCalendar: '달력 닫기',
    chooseRecordDate: '기록 날짜 선택',
    selectPeriodDescription: '조회할 {{period}}을 선택하세요.',
    day: '날짜',
    week: '주',
    weekDate: '주 날짜',
    month: '월',
    year: '연도',
    viewIncome: '수입 보기',
    failedLoadIncome: '수입 기록을 불러오지 못했습니다',
    cannotConnect: '백엔드에 연결할 수 없습니다.',
    back: '뒤로',
    incomeRecords: '수입 기록',
    chooseDate: '날짜 선택',
    today: '오늘',
    thisWeek: '이번 주',
    thisMonth: '이번 달',
    thisYear: '올해',
    selectedIncome: '선택한 수입',
    netAuthorIncomeUsd: '작가 순수입 (USD)',
    diamondsEarned: '획득한 Diamond',
    paidUnlocks: '유료 잠금 해제',
    incomeSources: '수입 출처',
    readersUnlockedEpisodes: '에피소드를 잠금 해제한 독자',
    unlocksCount: '{{count}}회 잠금 해제',
    latest100Shown: '최근 100개 표시',
    allShown: '전체 표시',
    noPaidIncomeFound: '유료 수입이 없습니다',
    noPaidIncomeText: '선택한 기간의 유료 에피소드 잠금 해제가 여기에 표시됩니다.',
    incomeInfo: '여기에는 유료 Diamond 잠금 해제로 얻은 작가의 순 USD 수입이 표시됩니다.',
    reader: '독자',
    episodeNumber: '에피소드 {{number}}',
    episodeUnlock: '에피소드 잠금 해제',
    sentGift: '{{gift}} 보냄',
    sentGiftQuantity: '{{quantity}} × {{gift}} 보냄',
    unlockedEpisode: '{{episode}} 잠금 해제',
    diamondGift: 'Diamond 선물',
    paidUnlock: '유료 잠금 해제',
    story: '스토리',
  },
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatMoney(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(0)

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return new Intl.NumberFormat(getDisplayLanguageId()).format(0)

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  }).format(number)
}

function cambodiaDateValue(date = new Date()) {
  const cambodiaDate = new Date(date.getTime() + CAMBODIA_OFFSET_MS)
  const year = cambodiaDate.getUTCFullYear()
  const month = String(cambodiaDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(cambodiaDate.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function timeText(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getInitial(value) {
  return String(value || 'R').slice(0, 1).toUpperCase()
}

function ReaderAvatar({ record }) {
  if (record.reader_avatar_url) {
    return (
      <img
        src={record.reader_avatar_url}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff3b5f]/10 text-[15px] font-black text-[#ff3b5f]">
      {getInitial(record.reader_name)}
    </div>
  )
}

function PeriodTab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 min-w-0 items-center justify-center whitespace-nowrap rounded-full px-1 text-[10.5px] font-semibold transition active:scale-[0.98] ${
        active ? 'bg-[#ff3b5f] text-white' : 'bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)]'
      }`}
    >
      {label}
    </button>
  )
}

function TransactionRow({ record }) {
  const { t } = useDisplayTranslation()
  const isGift =
    record.earning_type === 'gift' ||
    record.source_type === 'diamond_gift'
  const quantity = Math.max(1, Number(record.gift_quantity || 1))
  const giftName = record.gift_name || t('authorIncomePage.diamondGift')
  const episodeText =
    Number(record.episode_number || 0) > 0
      ? t('authorIncomePage.episodeNumber', {
          number: formatNumber(record.episode_number),
        })
      : record.episode_title || t('authorIncomePage.episodeUnlock')
  const actionText = isGift
    ? quantity > 1
      ? t('authorIncomePage.sentGiftQuantity', {
          quantity: formatNumber(quantity),
          gift: giftName,
        })
      : t('authorIncomePage.sentGift', { gift: giftName })
    : t('authorIncomePage.unlockedEpisode', { episode: episodeText })

  return (
    <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-4 py-3.5 last:border-b-0">
      <ReaderAvatar record={record} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
          <span className="font-black">{record.reader_name || t('authorIncomePage.reader')}</span>
          <span className="font-medium text-[var(--shadow-text-secondary)]"> {actionText}</span>
        </div>

        <div className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[#ff3b5f]">
          {isGift ? t('authorIncomePage.diamondGift') : t('authorIncomePage.paidUnlock')} · {record.story_title || t('authorIncomePage.story')}
        </div>

        <div className="mt-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
          {timeText(record.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[13.5px] font-black text-[var(--shadow-text-primary)]">
          +{formatMoney(record.author_net_payout_usd)}
        </div>

        <div className="mt-1 flex items-center justify-end gap-1 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{formatNumber(record.author_earned_diamonds)}</span>
        </div>
      </div>
    </div>
  )
}

function CalendarSheet({
  open,
  period,
  selectedDate,
  onClose,
  onApply,
}) {
  const { t } = useDisplayTranslation()
  const [draftValue, setDraftValue] = useState(selectedDate)
  const [dragStartY, setDragStartY] = useState(null)
  const [dragY, setDragY] = useState(0)

  useEffect(() => {
    if (!open) return

    setDragStartY(null)
    setDragY(0)

    if (period === 'month') {
      setDraftValue(selectedDate.slice(0, 7))
      return
    }

    if (period === 'year') {
      setDraftValue(selectedDate.slice(0, 4))
      return
    }

    setDraftValue(selectedDate)
  }, [open, period, selectedDate])

  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const root = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousRootOverflow = root.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    root.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      root.style.overflow = previousRootOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const periodLabel = period === 'week'
    ? t('authorIncomePage.weekDate')
    : t(`authorIncomePage.${period}`)
  const currentYear = Number(cambodiaDateValue().slice(0, 4))
  const years = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  )

  function applySelection() {
    if (!draftValue) return

    if (period === 'month') {
      onApply(`${draftValue}-01`)
      return
    }

    if (period === 'year') {
      onApply(`${draftValue}-01-01`)
      return
    }

    onApply(draftValue)
  }

  function handleTouchStart(event) {
    setDragStartY(event.touches[0].clientY)
    setDragY(0)
  }

  function handleTouchMove(event) {
    if (dragStartY === null) return

    const distance = Math.max(
      0,
      event.touches[0].clientY - dragStartY
    )

    setDragY(distance)
  }

  function handleTouchEnd(event) {
    const endY =
      event.changedTouches[0]?.clientY ?? dragStartY ?? 0
    const distance =
      dragStartY === null ? 0 : endY - dragStartY

    setDragStartY(null)
    setDragY(0)

    if (distance >= 90) {
      onClose()
    }
  }

  function handleTouchCancel() {
    setDragStartY(null)
    setDragY(0)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end bg-black/35">
      <button
        type="button"
        aria-label={t('authorIncomePage.closeCalendar')}
        onClick={onClose}
        className="absolute inset-0"
      />

      <div
        className="relative w-full rounded-t-[26px] bg-[var(--shadow-bg-elevated)] px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-2 shadow-[0_-16px_50px_rgba(15,23,42,0.18)]"
        style={{
          transform: `translateY(${dragY}px)`,
          transition:
            dragStartY === null
              ? 'transform 220ms ease'
              : 'none',
        }}
      >
        <div
          className="select-none pb-1 pt-1"
          style={{ touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)]" />

          <div className="mt-5">
            <h2 className="text-[18px] font-bold text-[var(--shadow-text-primary)]">
              {t('authorIncomePage.chooseRecordDate')}
            </h2>

            <p className="mt-1 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
              {t('authorIncomePage.selectPeriodDescription', { period: periodLabel })}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {period === 'year' ? (
            <select
              value={draftValue}
              lang={getDisplayLanguageId()}
              onChange={(event) =>
                setDraftValue(event.target.value)
              }
              className="h-[52px] w-full rounded-[15px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] pl-4 pr-8 text-[15px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#ff3b5f] [&::-webkit-calendar-picker-indicator]:mr-1"
            >
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {new Intl.NumberFormat(getDisplayLanguageId(), { useGrouping: false }).format(year)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={period === 'month' ? 'month' : 'date'}
              value={draftValue}
              lang={getDisplayLanguageId()}
              onChange={(event) =>
                setDraftValue(event.target.value)
              }
              className="h-[52px] w-full rounded-[15px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] pl-4 pr-8 text-[15px] font-normal text-[var(--shadow-text-primary)] outline-none focus:border-[#ff3b5f] [&::-webkit-calendar-picker-indicator]:mr-1"
            />
          )}
        </div>

        <button
          type="button"
          onClick={applySelection}
          className="mt-5 h-12 w-full rounded-full bg-[#ff3b5f] text-[14px] font-normal text-white active:scale-[0.99]"
        >
          {t('authorIncomePage.viewIncome')}
        </button>
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-9 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
        ))}
      </div>
      <div className="h-[150px] animate-pulse rounded-[20px] bg-[var(--shadow-bg-soft)]" />
      <div className="h-[320px] animate-pulse rounded-[20px] bg-[var(--shadow-bg-soft)]" />
    </div>
  )
}

export default function AuthorIncomePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [period, setPeriod] = useState('day')
  const [selectedDate, setSelectedDate] = useState(cambodiaDateValue())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadIncome() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const search = new URLSearchParams({
          record_period: period,
          record_date: selectedDate,
        })

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/income?${search.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || getDisplayText('authorIncomePage.failedLoadIncome'))
        }

        if (!ignore) {
          setData(result)
        }
      } catch (loadError) {
        if (
          loadError?.name !== 'AbortError' &&
          !ignore
        ) {
          setError(
            loadError.message === 'Failed to fetch'
              ? getDisplayText('authorIncomePage.cannotConnect')
              : loadError.message || getDisplayText('authorIncomePage.failedLoadIncome')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadIncome()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, period, selectedDate])

  const record = data?.income_record || {}
  const records = useMemo(
    () => Array.isArray(record.records) ? record.records : [],
    [record.records]
  )

  const periods = [
    { key: 'day', label: t('authorIncomePage.today') },
    { key: 'week', label: t('authorIncomePage.thisWeek') },
    { key: 'month', label: t('authorIncomePage.thisMonth') },
    { key: 'year', label: t('authorIncomePage.thisYear') },
  ]

  function selectCurrentPeriod(nextPeriod) {
    setPeriod(nextPeriod)
    setSelectedDate(cambodiaDateValue())
  }

  return (
    <div
      className="min-h-screen bg-[var(--shadow-bg-page)] pb-10"
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(255,59,95,0.08) 0%, rgba(246,184,0,0.08) 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 270px',
      }}
    >
      <header className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label={t('authorIncomePage.back')}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('authorIncomePage.incomeRecords')}</h1>

          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            aria-label={t('authorIncomePage.chooseDate')}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-regular fa-calendar text-[16px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        {loading && !data ? <LoadingPage /> : null}

        {error ? (
          <div className="rounded-[18px] bg-[#e5484d]/10 px-4 py-4 text-center text-[12.5px] font-semibold text-[#e5484d]">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="grid grid-cols-4 gap-2">
              {periods.map((item) => (
                <PeriodTab
                  key={item.key}
                  label={item.label}
                  active={period === item.key}
                  onClick={() => selectCurrentPeriod(item.key)}
                />
              ))}
            </section>

            <section className="overflow-hidden">
              <div className="px-4 pb-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">
                      {record.label || t('authorIncomePage.selectedIncome')}
                    </div>

                    <div className="mt-2 text-[32px] font-bold leading-none tracking-[-0.04em] text-[#ff3b5f]">
                      {formatMoney(record.total_usd)}
                    </div>

                    <div className="mt-2 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                      Net author income (USD)
                    </div>
                  </div>

                  
                </div>

                <div className="mt-5 grid grid-cols-2 divide-x divide-[var(--shadow-border)] py-3">
                  <div className="px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/Icons/Diamond.svg"
                        alt=""
                        className="h-[19px] w-[19px] object-contain"
                      />
                      <span className="text-[18px] font-black text-[var(--shadow-text-primary)]">
                        {formatNumber(record.total_diamonds)}
                      </span>
                    </div>
                    <div className="mt-1 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                      Diamonds earned
                    </div>
                  </div>

                  <div className="px-4">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-lock-open text-[16px] text-[#ff3b5f]" />
                      <span className="text-[18px] font-black text-[var(--shadow-text-primary)]">
                        {formatNumber(record.unlock_count)}
                      </span>
                    </div>
                    <div className="mt-1 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                      Paid unlocks
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--shadow-border)] px-4 py-4">
                <div>
                  <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">{t('authorIncomePage.incomeSources')}</h2>
                  <p className="mt-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
                    Readers who unlocked your episodes
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[12px] font-black text-[var(--shadow-text-primary)]">
                    {t('authorIncomePage.unlocksCount', { count: formatNumber(record.unlock_count) })}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                    {record.has_more ? t('authorIncomePage.latest100Shown') : t('authorIncomePage.allShown')}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-3 px-4 py-5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded-[14px] bg-[var(--shadow-bg-soft)]" />
                  ))}
                </div>
              ) : records.length ? (
                records.map((item) => <TransactionRow key={item.id} record={item} />)
              ) : (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center">
                    <img
                      src="/assets/Icons/Diamond.svg"
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div className="mt-4 text-[14px] font-black text-[var(--shadow-text-primary)]">
                    No paid income found
                  </div>
                  <div className="mx-auto mt-2 max-w-[260px] text-[11.5px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                    Paid episode unlocks for this selected period will appear here.
                  </div>
                </div>
              )}
            </section>

            <div className="rounded-[17px] bg-[#f6b800]/10 px-4 py-3 text-[11px] font-normal leading-5 text-[var(--shadow-warning)]">
  <i className="fa-solid fa-circle-info mr-2 text-[#9a5b00]" />
  Income shown here is the author’s net USD amount from paid Diamond unlocks.
</div>
          </>
        ) : null}
      </main>

      <CalendarSheet
        open={calendarOpen}
        period={period}
        selectedDate={selectedDate}
        onClose={() => setCalendarOpen(false)}
        onApply={(value) => {
          setSelectedDate(value)
          setCalendarOpen(false)
        }}
      />
    </div>
  )
}

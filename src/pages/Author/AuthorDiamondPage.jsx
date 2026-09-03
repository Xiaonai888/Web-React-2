import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDiamond', {
  en: {
    reader: 'Reader', story: 'Story', episodeNumber: 'Episode {{number}}', episodeUnlock: 'Episode unlock', diamondGift: 'Diamond Gift', giftLine: 'Gift · {{count}} × {{name}}', giftSingle: 'Gift · {{name}}', unlockLine: 'Unlock · {{episode}}', todayTime: 'Today, {{time}}', closeDiamondHelp: 'Close Diamond help', close: 'Close', howDiamondsWork: 'How Diamonds Work', howDiamondsWorkBody: 'Diamonds can come from paid episode unlocks and Diamond Gifts. Diamond Gifts go 100% to you. The USD amount is the equivalent value of the same earnings, not separate income. Coin Gifts are support only and do not add author earnings.', gotIt: 'Got It', loadFailed: 'Failed to load Diamond history', cannotConnect: 'Cannot connect to backend.', all: 'All', today: 'Today', thisMonth: 'This Month', back: 'Back', myDiamonds: 'My Diamonds', diamondHelp: 'Diamond help', diamondToday: 'Diamond Today', earnedToday: '{{amount}} earned today', paidUnlocksToday: 'Paid unlocks today', viewIncome: 'View Income', allTime: 'All Time', diamondHistory: 'Diamond History', historySubtitle: 'Readers who unlocked your episodes', closeFilter: 'Close filter', noHistory: 'No Diamond history found', noHistoryBody: 'Diamonds earned from paid episode unlocks will appear here.', latest100: 'Latest 100 records are shown'
  },
  km: {
    reader: 'អ្នកអាន', story: 'រឿង', episodeNumber: 'ភាគ {{number}}', episodeUnlock: 'ការដោះសោភាគ', diamondGift: 'Diamond Gift', giftLine: 'Gift · {{count}} × {{name}}', giftSingle: 'Gift · {{name}}', unlockLine: 'ដោះសោ · {{episode}}', todayTime: 'ថ្ងៃនេះ, {{time}}', closeDiamondHelp: 'បិទជំនួយ Diamond', close: 'បិទ', howDiamondsWork: 'របៀបដំណើរការរបស់ Diamonds', howDiamondsWorkBody: 'Diamonds អាចមកពីការដោះសោភាគដែលបង់ប្រាក់ និង Diamond Gifts។ Diamond Gifts ទៅកាន់អ្នក 100%។ ចំនួន USD គឺជាតម្លៃសមមូលនៃចំណូលដដែល មិនមែនជាចំណូលបន្ថែមទេ។ Coin Gifts ជាការគាំទ្រប៉ុណ្ណោះ ហើយមិនបន្ថែមចំណូលអ្នកនិពន្ធទេ។', gotIt: 'យល់ហើយ', loadFailed: 'មិនអាចផ្ទុកប្រវត្តិ Diamond បានទេ', cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។', all: 'ទាំងអស់', today: 'ថ្ងៃនេះ', thisMonth: 'ខែនេះ', back: 'ត្រឡប់ក្រោយ', myDiamonds: 'Diamonds របស់ខ្ញុំ', diamondHelp: 'ជំនួយ Diamond', diamondToday: 'Diamond ថ្ងៃនេះ', earnedToday: 'រកបាន {{amount}} ថ្ងៃនេះ', paidUnlocksToday: 'ការដោះសោបង់ប្រាក់ថ្ងៃនេះ', viewIncome: 'មើលចំណូល', allTime: 'សរុបទាំងអស់', diamondHistory: 'ប្រវត្តិ Diamond', historySubtitle: 'អ្នកអានដែលបានដោះសោភាគរបស់អ្នក', closeFilter: 'បិទតម្រង', noHistory: 'រកមិនឃើញប្រវត្តិ Diamond', noHistoryBody: 'Diamonds ដែលរកបានពីការដោះសោភាគបង់ប្រាក់ នឹងបង្ហាញនៅទីនេះ។', latest100: 'បង្ហាញកំណត់ត្រាថ្មីបំផុត 100'
  },
  zh: {
    reader: '读者', story: '故事', episodeNumber: '第 {{number}} 章', episodeUnlock: '章节解锁', diamondGift: 'Diamond 礼物', giftLine: '礼物 · {{count}} × {{name}}', giftSingle: '礼物 · {{name}}', unlockLine: '解锁 · {{episode}}', todayTime: '今天，{{time}}', closeDiamondHelp: '关闭 Diamond 帮助', close: '关闭', howDiamondsWork: 'Diamonds 如何运作', howDiamondsWorkBody: 'Diamonds 可来自付费章节解锁和 Diamond 礼物。Diamond 礼物 100% 归你所有。USD 金额只是同一笔收益的等值金额，并不是额外收入。Coin 礼物仅用于支持，不会增加作者收入。', gotIt: '知道了', loadFailed: '无法加载 Diamond 历史', cannotConnect: '无法连接后端。', all: '全部', today: '今天', thisMonth: '本月', back: '返回', myDiamonds: '我的 Diamonds', diamondHelp: 'Diamond 帮助', diamondToday: '今日 Diamond', earnedToday: '今日获得 {{amount}}', paidUnlocksToday: '今日付费解锁', viewIncome: '查看收入', allTime: '全部时间', diamondHistory: 'Diamond 历史', historySubtitle: '解锁你章节的读者', closeFilter: '关闭筛选', noHistory: '未找到 Diamond 历史', noHistoryBody: '通过付费章节解锁获得的 Diamonds 会显示在这里。', latest100: '显示最近 100 条记录'
  },
  ja: {
    reader: '読者', story: 'ストーリー', episodeNumber: 'エピソード {{number}}', episodeUnlock: 'エピソード解放', diamondGift: 'Diamond ギフト', giftLine: 'ギフト · {{count}} × {{name}}', giftSingle: 'ギフト · {{name}}', unlockLine: '解放 · {{episode}}', todayTime: '今日、{{time}}', closeDiamondHelp: 'Diamond ヘルプを閉じる', close: '閉じる', howDiamondsWork: 'Diamonds の仕組み', howDiamondsWorkBody: 'Diamonds は有料エピソードの解放と Diamond ギフトから得られます。Diamond ギフトは100%あなたに入ります。USD 金額は同じ収益の換算額で、別の収入ではありません。Coin ギフトは応援のみで、作者収益には加算されません。', gotIt: 'わかりました', loadFailed: 'Diamond 履歴を読み込めませんでした', cannotConnect: 'バックエンドに接続できません。', all: 'すべて', today: '今日', thisMonth: '今月', back: '戻る', myDiamonds: 'マイ Diamonds', diamondHelp: 'Diamond ヘルプ', diamondToday: '今日の Diamond', earnedToday: '今日 {{amount}} 獲得', paidUnlocksToday: '今日の有料解放', viewIncome: '収益を見る', allTime: '全期間', diamondHistory: 'Diamond 履歴', historySubtitle: 'あなたのエピソードを解放した読者', closeFilter: 'フィルターを閉じる', noHistory: 'Diamond 履歴がありません', noHistoryBody: '有料エピソードの解放で獲得した Diamonds がここに表示されます。', latest100: '最新100件を表示しています'
  },
  ko: {
    reader: '독자', story: '스토리', episodeNumber: '에피소드 {{number}}', episodeUnlock: '에피소드 잠금 해제', diamondGift: 'Diamond 선물', giftLine: '선물 · {{count}} × {{name}}', giftSingle: '선물 · {{name}}', unlockLine: '잠금 해제 · {{episode}}', todayTime: '오늘, {{time}}', closeDiamondHelp: 'Diamond 도움말 닫기', close: '닫기', howDiamondsWork: 'Diamonds 작동 방식', howDiamondsWorkBody: 'Diamonds는 유료 에피소드 잠금 해제와 Diamond 선물에서 얻을 수 있습니다. Diamond 선물은 100% 작가에게 지급됩니다. USD 금액은 같은 수익의 환산 금액이며 별도 수익이 아닙니다. Coin 선물은 응원용이며 작가 수익에 추가되지 않습니다.', gotIt: '확인', loadFailed: 'Diamond 내역을 불러오지 못했습니다', cannotConnect: '백엔드에 연결할 수 없습니다.', all: '전체', today: '오늘', thisMonth: '이번 달', back: '뒤로', myDiamonds: '내 Diamonds', diamondHelp: 'Diamond 도움말', diamondToday: '오늘의 Diamond', earnedToday: '오늘 {{amount}} 획득', paidUnlocksToday: '오늘 유료 잠금 해제', viewIncome: '수익 보기', allTime: '전체 기간', diamondHistory: 'Diamond 내역', historySubtitle: '내 에피소드를 잠금 해제한 독자', closeFilter: '필터 닫기', noHistory: 'Diamond 내역이 없습니다', noHistoryBody: '유료 에피소드 잠금 해제로 얻은 Diamonds가 여기에 표시됩니다.', latest100: '최근 100개 기록을 표시합니다'
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

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  })
}

function formatMoney(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getCambodiaDateKey(value = new Date()) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() + CAMBODIA_OFFSET_MS)
    .toISOString()
    .slice(0, 10)
}

function getCambodiaMonthKey(value = new Date()) {
  return getCambodiaDateKey(value).slice(0, 7)
}

function formatHistoryTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const todayKey = getCambodiaDateKey()
  const itemKey = getCambodiaDateKey(date)
  const time = date.toLocaleTimeString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    hour: 'numeric',
    minute: '2-digit',
  })

  if (itemKey === todayKey) {
    return getDisplayText('authorDiamond.todayTime', { time })
  }

  return date.toLocaleDateString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInitial(value) {
  return String(value || 'R').trim().charAt(0).toUpperCase() || 'R'
}

function ReaderAvatar({ item }) {
  if (item.reader_avatar_url) {
    return (
      <img
        src={item.reader_avatar_url}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf4ff] text-[15px] font-extrabold text-[#4386d8]">
      {getInitial(item.reader_name)}
    </div>
  )
}

function DiamondHistoryRow({ item }) {
  const { t } = useDisplayTranslation()
  const isGift =
    item.earning_type === 'gift' ||
    item.source_type === 'diamond_gift'
  const quantity = Math.max(1, Number(item.gift_quantity || 1))
  const episodeText =
    Number(item.episode_number || 0) > 0
      ? t('authorDiamond.episodeNumber', { number: item.episode_number })
      : item.episode_title || t('authorDiamond.episodeUnlock')
  const sourceText = isGift
    ? quantity > 1
      ? t('authorDiamond.giftLine', { count: quantity, name: item.gift_name || t('authorDiamond.diamondGift') })
      : t('authorDiamond.giftSingle', { name: item.gift_name || t('authorDiamond.diamondGift') })
    : t('authorDiamond.unlockLine', { episode: episodeText })

  return (
    <div className="mx-2 mb-2 flex items-center gap-3 rounded-[14px] bg-[var(--shadow-bg-soft)] px-3 py-3.5 last:mb-0">
      <ReaderAvatar item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
          {item.reader_name || t('authorDiamond.reader')}
        </div>

        <div className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[#4386d8]">
          {sourceText}
        </div>

        <div className="mt-1 line-clamp-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
          {item.story_title || t('authorDiamond.story')} · {formatHistoryTime(item.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
          <span>+{formatNumber(item.diamonds)}</span>
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-4 w-4 object-contain"
          />
        </div>

        <div className="mt-1 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
          {formatMoney(item.usd)}
        </div>
      </div>
    </div>
  )
}

function DiamondHintPopup({ open, onClose }) {
  const { t } = useDisplayTranslation()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:px-4">
      <button
        type="button"
        aria-label={t('authorDiamond.closeDiamondHelp')}
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] p-5 shadow-2xl sm:rounded-[24px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#eaf4ff] via-[#f6faff] to-[#fff8e8]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4ff] text-[#4386d8]">
              <i className="fa-solid fa-circle-info text-[17px]" />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('authorDiamond.close')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm active:scale-95"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          <h2 className="mt-5 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('authorDiamond.howDiamondsWork')}
          </h2>

          <p className="mt-2 text-[12.5px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
            {t('authorDiamond.howDiamondsWorkBody')}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-11 w-full rounded-full bg-[#4386d8] text-[13px] font-extrabold text-white shadow-[0_12px_24px_rgba(67,134,216,0.22)] active:scale-[0.98]"
          >
            {t('authorDiamond.gotIt')}
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-[176px] rounded-[24px] bg-[#eaf3ff]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-[92px] rounded-[18px] bg-[var(--shadow-bg-surface)]" />
        <div className="h-[92px] rounded-[18px] bg-[var(--shadow-bg-surface)]" />
      </div>
      <div className="h-[320px] rounded-[20px] bg-[var(--shadow-bg-surface)]" />
    </div>
  )
}

export default function AuthorDiamondPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [data, setData] = useState(null)
  const [filter, setFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function loadDiamonds() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/diamonds`,
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
          throw new Error(result.message || t('authorDiamond.loadFailed'))
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
              ? t('authorDiamond.cannotConnect')
              : loadError.message || t('authorDiamond.loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDiamonds()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, t])

  useEffect(() => {
    if (!hintOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [hintOpen])

  const summary = data?.summary || {}
  const history = useMemo(
    () => (Array.isArray(data?.history) ? data.history : []),
    [data?.history]
  )

  const filteredHistory = useMemo(() => {
    if (filter === 'today') {
      const todayKey = getCambodiaDateKey()

      return history.filter(
        (item) => getCambodiaDateKey(item.created_at) === todayKey
      )
    }

    if (filter === 'month') {
      const monthKey = getCambodiaMonthKey()

      return history.filter(
        (item) => getCambodiaMonthKey(item.created_at) === monthKey
      )
    }

    return history
  }, [filter, history])

  const filterLabel =
    filter === 'today'
      ? t('authorDiamond.today')
      : filter === 'month'
        ? t('authorDiamond.thisMonth')
        : t('authorDiamond.all')

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10 text-[var(--shadow-text-primary)]">
      <DiamondHintPopup
        open={hintOpen}
        onClose={() => setHintOpen(false)}
      />

      <header className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label={t('authorDiamond.back')}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorDiamond.myDiamonds')}
          </h1>

          <button
            type="button"
            onClick={() => setHintOpen(true)}
            aria-label={t('authorDiamond.diamondHelp')}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-question text-[13px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-4 pt-4">
        {loading && !data ? <LoadingPage /> : null}

        {error ? (
          <div className="rounded-[18px] bg-[#fff1f1] px-4 py-4 text-center text-[12.5px] font-semibold text-[#e5484d] shadow-sm">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.045)]">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7b8ca5]">
                {t('authorDiamond.diamondToday')}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src="/assets/Icons/Diamond.svg"
                  alt=""
                  className="h-10 w-10 object-contain"
                />

                <div className="text-[38px] font-extrabold leading-none tracking-[-0.04em] text-[var(--shadow-text-primary)]">
                  {formatNumber(summary.today_diamonds)}
                </div>
              </div>

              <div className="mt-3 text-[12px] font-semibold text-[#5d7291]">
                {t('authorDiamond.earnedToday', { amount: formatMoney(summary.today_usd) })}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10.5px] font-semibold text-[#7b8ca5]">
                    {t('authorDiamond.paidUnlocksToday')}
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold text-[var(--shadow-text-primary)]">
                    {formatNumber(summary.today_unlocks)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/author/income')}
                  className="rounded-full bg-[#4386d8] px-4 py-2 text-[11.5px] font-extrabold text-white active:scale-[0.98]"
                >
                  {t('authorDiamond.viewIncome')}
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">
                  {t('authorDiamond.thisMonth')}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <img
                    src="/assets/Icons/Diamond.svg"
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                  <span className="text-[20px] font-extrabold text-[var(--shadow-text-primary)]">
                    {formatNumber(summary.this_month_diamonds)}
                  </span>
                </div>
              </div>

              <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">
                  {t('authorDiamond.allTime')}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <img
                    src="/assets/Icons/Diamond.svg"
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                  <span className="text-[20px] font-extrabold text-[var(--shadow-text-primary)]">
                    {formatNumber(summary.all_time_diamonds)}
                  </span>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] py-2 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <h2 className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
                    {t('authorDiamond.diamondHistory')}
                  </h2>
                  <p className="mt-1 text-[10.5px] font-medium text-[var(--shadow-text-tertiary)]">
                    {t('authorDiamond.historySubtitle')}
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((value) => !value)}
                    className="flex h-9 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-3 text-[11px] font-extrabold text-[var(--shadow-text-primary)] active:scale-95"
                  >
                    {filterLabel}
                    <i className="fa-solid fa-chevron-down text-[9px] text-[var(--shadow-text-tertiary)]" />
                  </button>

                  {filterOpen ? (
                    <>
                      <button
                        type="button"
                        aria-label={t('authorDiamond.closeFilter')}
                        onClick={() => setFilterOpen(false)}
                        className="fixed inset-0 z-40"
                      />

                      <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-[15px] bg-[var(--shadow-bg-elevated)] p-1.5 shadow-xl">
                        {[
                          ['all', 'all'],
                          ['today', 'today'],
                          ['month', 'thisMonth'],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setFilter(value)
                              setFilterOpen(false)
                            }}
                            className={`flex w-full items-center justify-between rounded-[11px] px-3 py-2.5 text-left text-[11.5px] font-bold ${
                              filter === value
                                ? 'bg-[#eaf4ff] text-[#4386d8]'
                                : 'text-[var(--shadow-text-primary)]'
                            }`}
                          >
                            {t(`authorDiamond.${label}`)}
                            {filter === value ? (
                              <i className="fa-solid fa-check text-[10px]" />
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {filteredHistory.length ? (
                filteredHistory.map((item) => (
                  <DiamondHistoryRow
                    key={item.id}
                    item={item}
                  />
                ))
              ) : (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4ff] dark:bg-[#4386d8]/15">
                    <img
                      src="/assets/Icons/Diamond.svg"
                      alt=""
                      className="h-7 w-7 object-contain"
                    />
                  </div>

                  <div className="mt-4 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">
                    {t('authorDiamond.noHistory')}
                  </div>

                  <div className="mx-auto mt-2 max-w-[270px] text-[11.5px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                    {t('authorDiamond.noHistoryBody')}
                  </div>
                </div>
              )}

              {data.has_more ? (
                <div className="px-4 py-3 text-center text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                  {t('authorDiamond.latest100')}
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

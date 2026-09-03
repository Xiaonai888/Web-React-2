import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorGift', {
  en: {
    reader: 'Reader', story: 'Story', gift: 'Gift', sentGift: 'Sent {{count}} × {{name}}', points: '{{count}} pts', closeGiftHelp: 'Close Gift help', close: 'Close', howGiftsWork: 'How Gifts Work', howGiftsWorkBody: 'Readers can send gifts to support your stories. Every gift, sender, story and support point is saved in your Gift history.', gotIt: 'Got It', loadFailed: 'Failed to load Gift history', cannotConnect: 'Cannot connect to backend.', all: 'All', thisMonth: 'This Month', back: 'Back', myGifts: 'My Gifts', giftHelp: 'Gift help', totalGiftsReceived: 'Total Gifts Received', totalGiftsBody: 'Gifts sent by readers across all your stories', totalSupportPoints: 'Total support points', viewThisMonth: 'View This Month', uniqueSenders: 'Unique Senders', giftHistory: 'Gift History', historySubtitle: 'Gifts received from your readers', closeFilter: 'Close filter', noHistory: 'No Gift history found', noHistoryBody: 'Gifts sent by readers will appear here.', latest100: 'Latest 100 records are shown'
  },
  km: {
    reader: 'អ្នកអាន', story: 'រឿង', gift: 'Gift', sentGift: 'បានផ្ញើ {{count}} × {{name}}', points: '{{count}} ពិន្ទុ', closeGiftHelp: 'បិទជំនួយ Gift', close: 'បិទ', howGiftsWork: 'របៀបដំណើរការរបស់ Gifts', howGiftsWorkBody: 'អ្នកអានអាចផ្ញើ Gifts ដើម្បីគាំទ្ររឿងរបស់អ្នក។ Gift នីមួយៗ អ្នកផ្ញើ រឿង និង Support Points ត្រូវបានរក្សាទុកក្នុងប្រវត្តិ Gift របស់អ្នក។', gotIt: 'យល់ហើយ', loadFailed: 'មិនអាចផ្ទុកប្រវត្តិ Gift បានទេ', cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។', all: 'ទាំងអស់', thisMonth: 'ខែនេះ', back: 'ត្រឡប់ក្រោយ', myGifts: 'Gifts របស់ខ្ញុំ', giftHelp: 'ជំនួយ Gift', totalGiftsReceived: 'Gifts ដែលទទួលបានសរុប', totalGiftsBody: 'Gifts ដែលអ្នកអានបានផ្ញើតាមរឿងទាំងអស់របស់អ្នក', totalSupportPoints: 'Support Points សរុប', viewThisMonth: 'មើលខែនេះ', uniqueSenders: 'អ្នកផ្ញើមិនស្ទួន', giftHistory: 'ប្រវត្តិ Gift', historySubtitle: 'Gifts ដែលទទួលបានពីអ្នកអានរបស់អ្នក', closeFilter: 'បិទតម្រង', noHistory: 'រកមិនឃើញប្រវត្តិ Gift', noHistoryBody: 'Gifts ដែលអ្នកអានផ្ញើនឹងបង្ហាញនៅទីនេះ។', latest100: 'បង្ហាញកំណត់ត្រាថ្មីបំផុត 100'
  },
  zh: {
    reader: '读者', story: '故事', gift: '礼物', sentGift: '已送出 {{count}} × {{name}}', points: '{{count}} 分', closeGiftHelp: '关闭礼物帮助', close: '关闭', howGiftsWork: '礼物如何运作', howGiftsWorkBody: '读者可以发送礼物支持你的故事。每份礼物、发送者、故事和支持积分都会保存在你的礼物历史中。', gotIt: '知道了', loadFailed: '无法加载礼物历史', cannotConnect: '无法连接后端。', all: '全部', thisMonth: '本月', back: '返回', myGifts: '我的礼物', giftHelp: '礼物帮助', totalGiftsReceived: '收到的礼物总数', totalGiftsBody: '读者在你所有故事中发送的礼物', totalSupportPoints: '支持积分总数', viewThisMonth: '查看本月', uniqueSenders: '不同发送者', giftHistory: '礼物历史', historySubtitle: '从读者收到的礼物', closeFilter: '关闭筛选', noHistory: '未找到礼物历史', noHistoryBody: '读者发送的礼物会显示在这里。', latest100: '显示最近 100 条记录'
  },
  ja: {
    reader: '読者', story: 'ストーリー', gift: 'ギフト', sentGift: '{{count}} × {{name}} を送信', points: '{{count}} ポイント', closeGiftHelp: 'ギフトヘルプを閉じる', close: '閉じる', howGiftsWork: 'ギフトの仕組み', howGiftsWorkBody: '読者はギフトを送ってあなたのストーリーを応援できます。各ギフト、送信者、ストーリー、サポートポイントはギフト履歴に保存されます。', gotIt: 'わかりました', loadFailed: 'ギフト履歴を読み込めませんでした', cannotConnect: 'バックエンドに接続できません。', all: 'すべて', thisMonth: '今月', back: '戻る', myGifts: 'マイギフト', giftHelp: 'ギフトヘルプ', totalGiftsReceived: '受け取ったギフト総数', totalGiftsBody: 'すべてのストーリーで読者から送られたギフト', totalSupportPoints: 'サポートポイント合計', viewThisMonth: '今月を見る', uniqueSenders: '送信者数', giftHistory: 'ギフト履歴', historySubtitle: '読者から受け取ったギフト', closeFilter: 'フィルターを閉じる', noHistory: 'ギフト履歴がありません', noHistoryBody: '読者から送られたギフトがここに表示されます。', latest100: '最新100件を表示しています'
  },
  ko: {
    reader: '독자', story: '스토리', gift: '선물', sentGift: '{{count}} × {{name}} 보냄', points: '{{count}} 포인트', closeGiftHelp: '선물 도움말 닫기', close: '닫기', howGiftsWork: '선물 작동 방식', howGiftsWorkBody: '독자는 선물을 보내 내 스토리를 응원할 수 있습니다. 각 선물, 보낸 사람, 스토리, 지원 포인트가 선물 내역에 저장됩니다.', gotIt: '확인', loadFailed: '선물 내역을 불러오지 못했습니다', cannotConnect: '백엔드에 연결할 수 없습니다.', all: '전체', thisMonth: '이번 달', back: '뒤로', myGifts: '내 선물', giftHelp: '선물 도움말', totalGiftsReceived: '받은 선물 총합', totalGiftsBody: '모든 스토리에서 독자가 보낸 선물', totalSupportPoints: '총 지원 포인트', viewThisMonth: '이번 달 보기', uniqueSenders: '고유 보낸 사람', giftHistory: '선물 내역', historySubtitle: '독자에게 받은 선물', closeFilter: '필터 닫기', noHistory: '선물 내역이 없습니다', noHistoryBody: '독자가 보낸 선물이 여기에 표시됩니다.', latest100: '최근 100개 기록을 표시합니다'
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

function getCambodiaMonthKey(value = new Date()) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() + CAMBODIA_OFFSET_MS)
    .toISOString()
    .slice(0, 7)
}

function formatHistoryTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function normalizeImageUrl(value) {
  const url = String(value || '').trim()

  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return url

  return `/${url}`
}

function GiftArtwork({ item }) {
  const imageUrl = normalizeImageUrl(item.gift_image_path)

  if (imageUrl) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-contain p-1"
        />
      </div>
    )
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#ff3b5f]">
      <i className="fa-solid fa-gift text-[18px]" />
    </div>
  )
}

function GiftHistoryRow({ item }) {
  const { t } = useDisplayTranslation()
  const quantity = Math.max(1, Number(item.quantity || 1))
  const supportPoints = Number(item.support_points || 0) * quantity

  return (
    <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-1 py-3.5 last:border-b-0">
      <GiftArtwork item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-bold text-[var(--shadow-text-primary)]">
          {item.reader_name || t('authorGift.reader')}
        </div>

        <div className="mt-1 line-clamp-1 text-[11.5px] font-medium text-[#ff3b5f]">
          {t('authorGift.sentGift', { count: quantity, name: item.gift_name || t('authorGift.gift') })}
        </div>

        <div className="mt-1 line-clamp-1 text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
          {item.story_title || t('authorGift.story')} · {formatHistoryTime(item.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[13.5px] font-bold text-[var(--shadow-text-primary)]">
          +{quantity}
        </div>

        <div className="mt-1 text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
          {t('authorGift.points', { count: formatNumber(supportPoints) })}
        </div>
      </div>
    </div>
  )
}

function GiftHintPopup({ open, onClose }) {
  const { t } = useDisplayTranslation()
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

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-help-title"
    >
      <button
        type="button"
        aria-label={t('authorGift.closeGiftHelp')}
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] p-5 shadow-2xl sm:rounded-[24px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#fff1f5] via-[#fff7f8] to-[#fff8e8]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1f5] text-[#ff3b5f]">
              <i className="fa-solid fa-circle-info text-[17px]" />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t('authorGift.close')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm active:scale-95"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          <h2
            id="gift-help-title"
            className="mt-5 text-[18px] font-bold text-[var(--shadow-text-primary)]"
          >
            {t('authorGift.howGiftsWork')}
          </h2>

          <p className="mt-2 text-[12.5px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
            {t('authorGift.howGiftsWorkBody')}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-11 w-full rounded-full bg-[#ff3b5f] text-[13px] font-bold text-white active:scale-[0.98]"
          >
            {t('authorGift.gotIt')}
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-[176px] rounded-[24px] bg-[var(--shadow-bg-surface)]" />

      <div className="grid grid-cols-2 gap-3">
        <div className="h-[92px] rounded-[18px] bg-[var(--shadow-bg-surface)]" />
        <div className="h-[92px] rounded-[18px] bg-[var(--shadow-bg-surface)]" />
      </div>

      <div className="h-[320px] bg-[var(--shadow-bg-surface)]" />
    </div>
  )
}

export default function AuthorGiftPage() {
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

    async function loadGifts() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/gifts`,
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
          throw new Error(result.message || t('authorGift.loadFailed'))
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
              ? t('authorGift.cannotConnect')
              : loadError.message || t('authorGift.loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadGifts()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, t])

  const summary = data?.summary || {}

  const history = useMemo(
    () => (Array.isArray(data?.history) ? data.history : []),
    [data?.history]
  )

  const filteredHistory = useMemo(() => {
    if (filter !== 'month') return history

    const monthKey = getCambodiaMonthKey()

    return history.filter(
      (item) => getCambodiaMonthKey(item.created_at) === monthKey
    )
  }, [filter, history])

  const filterLabel = filter === 'month' ? t('authorGift.thisMonth') : t('authorGift.all')

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10 text-[var(--shadow-text-primary)]">
      <GiftHintPopup
        open={hintOpen}
        onClose={() => setHintOpen(false)}
      />

      <header className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-[58px] max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label={t('authorGift.back')}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {t('authorGift.myGifts')}
          </h1>

          <button
            type="button"
            onClick={() => setHintOpen(true)}
            aria-label={t('authorGift.giftHelp')}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] active:scale-95"
          >
            <i className="fa-solid fa-question text-[11px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-4 pt-4">
        {loading && !data ? <LoadingPage /> : null}

        {error ? (
          <div className="rounded-[18px] bg-[#fff1f1] px-4 py-4 text-center text-[12.5px] font-medium text-[#e5484d]">
            {error}
          </div>
        ) : null}

        {data ? (
          <>
            <section className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9b7180]">
                {t('authorGift.totalGiftsReceived')}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center text-[#ff3b5f]">
                  <i className="fa-solid fa-gift text-[20px]" />
                </div>

                <div className="text-[38px] font-bold leading-none tracking-[-0.04em] text-[var(--shadow-text-primary)]">
                  {formatNumber(summary.total_gifts)}
                </div>
              </div>

              <div className="mt-3 text-[12px] font-normal text-[#8b6471]">
                {t('authorGift.totalGiftsBody')}
              </div>

              <div className="mt-5 h-px bg-[var(--shadow-border)]" />

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10.5px] font-normal text-[#9b7180]">
                    {t('authorGift.totalSupportPoints')}
                  </div>

                  <div className="mt-1 text-[16px] font-bold text-[var(--shadow-text-primary)]">
                    {formatNumber(summary.total_support_points)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFilter('month')}
                  className="rounded-full bg-[#ff3b5f] px-4 py-2 text-[11.5px] font-bold text-white active:scale-[0.98]"
                >
                  {t('authorGift.viewThisMonth')}
                </button>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
                  {t('authorGift.thisMonth')}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <i className="fa-solid fa-gift text-[17px] text-[var(--shadow-text-primary)]" />

                  <span className="text-[20px] font-bold text-[#ff3b5f]">
                    {formatNumber(summary.this_month_gifts)}
                  </span>
                </div>
              </div>

              <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
                  {t('authorGift.uniqueSenders')}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <i className="fa-solid fa-user-group text-[16px] text-[var(--shadow-text-primary)]" />

                  <span className="text-[20px] font-bold text-[#ff3b5f]">
                    {formatNumber(summary.unique_senders)}
                  </span>
                </div>
              </div>
            </section>

            <section className="overflow-visible rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--shadow-border)] pb-4">
                <div>
                  <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('authorGift.giftHistory')}
                  </h2>

                  <p className="mt-1 text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
                    {t('authorGift.historySubtitle')}
                  </p>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((value) => !value)}
                    className="flex h-9 items-center gap-2 rounded-full bg-[var(--shadow-bg-elevated)] px-3 text-[11px] font-bold text-[var(--shadow-text-primary)] shadow-[0_4px_14px_rgba(15,23,42,0.04)] active:scale-95"
                  >
                    {filterLabel}
                    <i className="fa-solid fa-chevron-down text-[9px] text-[var(--shadow-text-tertiary)]" />
                  </button>

                  {filterOpen ? (
                    <>
                      <button
                        type="button"
                        aria-label={t('authorGift.closeFilter')}
                        onClick={() => setFilterOpen(false)}
                        className="fixed inset-0 z-40"
                      />

                      <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-[15px] bg-[var(--shadow-bg-elevated)] p-1.5 shadow-xl ring-1 ring-[var(--shadow-border)]">
                        {[
                          ['all', 'all'],
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
                                ? 'bg-[#fff1f5] text-[#ff3b5f] dark:bg-[#ff3b5f]/15 dark:text-[#ff8ca1]'
                                : 'text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-hover)]'
                            }`}
                          >
                            {t(`authorGift.${label}`)}

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
                  <GiftHistoryRow
                    key={item.id}
                    item={item}
                  />
                ))
              ) : (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center text-[#ff3b5f]">
                    <i className="fa-solid fa-gift text-[23px]" />
                  </div>

                  <div className="mt-4 text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {t('authorGift.noHistory')}
                  </div>

                  <div className="mx-auto mt-2 max-w-[270px] text-[11.5px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
                    {t('authorGift.noHistoryBody')}
                  </div>
                </div>
              )}

              {data.has_more ? (
                <div className="border-t border-[var(--shadow-border)] py-3 text-center text-[10.5px] font-normal text-[var(--shadow-text-tertiary)]">
                  {t('authorGift.latest100')}
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorRecentEarningsPage', {
  en: {
    back: 'Back',
    incomeHistory: 'Income history',
    recentEarnings: 'Recent Earnings',
    latest30Days: 'Latest 30 days',
    today: 'Today',
    last7Days: 'Last 7 Days',
    last30Days: t('authorRecentEarningsPage.last30Days'),
    custom: 'Custom',
    start: 'Start',
    end: 'End',
    applyCustomRange: 'Apply Custom Range',
    earned: 'Earned',
    diamonds: 'Diamonds',
    unlocks: 'Unlocks',
    newestEarningsFirst: 'Newest earnings first',
    recordsCount: '{{count}} records',
    reader: 'Reader',
    episodeNumber: 'Episode {{number}}',
    episodeUnlock: 'Episode unlock',
    story: 'Story',
    noRecentEarnings: 'No recent earnings',
    noRecentEarningsText: 'Paid Diamond unlocks in this recent period will appear here.',
    previous: 'Previous',
    pageOf: 'Page {{page}} of {{total}}',
    next: 'Next',
    olderHistoryHelp: 'Recent Earnings only shows the latest 30 days. Tap here for older Income History.',
    invalidRange: getDisplayText('authorRecentEarningsPage.invalidRange'),
    loadFailed: 'Failed to load recent earnings',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    incomeHistory: 'ប្រវត្តិចំណូល',
    recentEarnings: 'ចំណូលថ្មីៗ',
    latest30Days: '30 ថ្ងៃចុងក្រោយ',
    today: 'ថ្ងៃនេះ',
    last7Days: '7 ថ្ងៃចុងក្រោយ',
    last30Days: '30 ថ្ងៃចុងក្រោយ',
    custom: 'កំណត់ផ្ទាល់',
    start: 'ចាប់ផ្តើម',
    end: 'បញ្ចប់',
    applyCustomRange: 'អនុវត្តចន្លោះថ្ងៃ',
    earned: 'ចំណូល',
    diamonds: 'Diamond',
    unlocks: 'ការដោះសោ',
    newestEarningsFirst: 'ចំណូលថ្មីបំផុតមុន',
    recordsCount: '{{count}} កំណត់ត្រា',
    reader: 'អ្នកអាន',
    episodeNumber: 'ភាគ {{number}}',
    episodeUnlock: 'ដោះសោភាគ',
    story: 'រឿង',
    noRecentEarnings: 'មិនទាន់មានចំណូលថ្មីៗ',
    noRecentEarningsText: 'ការដោះសោដោយ Diamond បង់ប្រាក់ក្នុងរយៈពេលនេះនឹងបង្ហាញនៅទីនេះ។',
    previous: 'មុន',
    pageOf: 'ទំព័រ {{page}} នៃ {{total}}',
    next: 'បន្ទាប់',
    olderHistoryHelp: 'ចំណូលថ្មីៗបង្ហាញតែ 30 ថ្ងៃចុងក្រោយ។ ចុចទីនេះសម្រាប់ប្រវត្តិចំណូលចាស់ជាងនេះ។',
    invalidRange: 'សូមជ្រើសចន្លោះថ្ងៃត្រឹមត្រូវក្នុង 30 ថ្ងៃចុងក្រោយ។',
    loadFailed: 'មិនអាចផ្ទុកចំណូលថ្មីៗបាន',
  },
  zh: {
    back: '返回',
    incomeHistory: '收入记录',
    recentEarnings: '近期收入',
    latest30Days: '最近 30 天',
    today: '今天',
    last7Days: '最近 7 天',
    last30Days: '最近 30 天',
    custom: '自定义',
    start: '开始',
    end: '结束',
    applyCustomRange: '应用自定义日期',
    earned: '收入',
    diamonds: 'Diamond',
    unlocks: '解锁',
    newestEarningsFirst: '最新收入优先',
    recordsCount: '{{count}} 条记录',
    reader: '读者',
    episodeNumber: '第 {{number}} 集',
    episodeUnlock: '章节解锁',
    story: '故事',
    noRecentEarnings: '暂无近期收入',
    noRecentEarningsText: '此期间的付费 Diamond 解锁会显示在这里。',
    previous: '上一页',
    pageOf: '第 {{page}} 页，共 {{total}} 页',
    next: '下一页',
    olderHistoryHelp: '近期收入仅显示最近 30 天。点击这里查看更早的收入记录。',
    invalidRange: '请选择最近 30 天内的有效日期范围。',
    loadFailed: '无法加载近期收入',
  },
  ja: {
    back: '戻る',
    incomeHistory: '収益履歴',
    recentEarnings: '最近の収益',
    latest30Days: '直近30日',
    today: '今日',
    last7Days: '直近7日',
    last30Days: '直近30日',
    custom: 'カスタム',
    start: '開始',
    end: '終了',
    applyCustomRange: '期間を適用',
    earned: '収益',
    diamonds: 'Diamond',
    unlocks: 'アンロック',
    newestEarningsFirst: '新しい収益から表示',
    recordsCount: '{{count}} 件',
    reader: '読者',
    episodeNumber: 'エピソード {{number}}',
    episodeUnlock: 'エピソードのアンロック',
    story: 'ストーリー',
    noRecentEarnings: '最近の収益はありません',
    noRecentEarningsText: 'この期間の有料 Diamond アンロックがここに表示されます。',
    previous: '前へ',
    pageOf: '{{page}} / {{total}} ページ',
    next: '次へ',
    olderHistoryHelp: '最近の収益には直近30日だけが表示されます。以前の収益履歴はこちらから確認できます。',
    invalidRange: '直近30日以内の有効な期間を選択してください。',
    loadFailed: '最近の収益を読み込めませんでした',
  },
  ko: {
    back: '뒤로',
    incomeHistory: '수입 기록',
    recentEarnings: '최근 수입',
    latest30Days: '최근 30일',
    today: '오늘',
    last7Days: '최근 7일',
    last30Days: '최근 30일',
    custom: '직접 설정',
    start: '시작',
    end: '종료',
    applyCustomRange: '기간 적용',
    earned: '수입',
    diamonds: 'Diamond',
    unlocks: '잠금 해제',
    newestEarningsFirst: '최신 수입부터 표시',
    recordsCount: '{{count}}개 기록',
    reader: '독자',
    episodeNumber: '에피소드 {{number}}',
    episodeUnlock: '에피소드 잠금 해제',
    story: '스토리',
    noRecentEarnings: '최근 수입이 없습니다',
    noRecentEarningsText: '이 기간의 유료 Diamond 잠금 해제가 여기에 표시됩니다.',
    previous: '이전',
    pageOf: '{{page}} / {{total}} 페이지',
    next: '다음',
    olderHistoryHelp: '최근 수입에는 최근 30일만 표시됩니다. 이전 수입 기록은 여기를 눌러 확인하세요.',
    invalidRange: '최근 30일 안에서 올바른 날짜 범위를 선택하세요.',
    loadFailed: '최근 수입을 불러오지 못했습니다',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000
const PAGE_SIZE = 20

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function cambodiaDateValue(offsetDays = 0) {
  const local = new Date(Date.now() + CAMBODIA_OFFSET_MS)

  local.setUTCDate(local.getUTCDate() + offsetDays)

  return [
    local.getUTCFullYear(),
    String(local.getUTCMonth() + 1).padStart(2, '0'),
    String(local.getUTCDate()).padStart(2, '0'),
  ].join('-')
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

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  })
}

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getInitial(value) {
  return String(value || 'R').slice(0, 1).toUpperCase()
}

function RangeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-full px-3 text-[11px] font-black transition active:scale-[0.98] ${
        active
          ? 'bg-[#7651ad] text-white'
          : 'border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[#7651ad]'
      }`}
    >
      {children}
    </button>
  )
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
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1e9fb] text-[14px] font-black text-[#7651ad]">
      {getInitial(item.reader_name)}
    </div>
  )
}

function EarningRow({ item }) {
  const { t } = useDisplayTranslation()
  const episode =
    Number(item.episode_number || 0) > 0
      ? t('authorRecentEarningsPage.episodeNumber', { number: formatNumber(item.episode_number) })
      : item.episode_title || t('authorRecentEarningsPage.episodeUnlock')

  return (
    <article className="flex gap-3 border-b border-[var(--shadow-border)] px-4 py-4 last:border-b-0">
      <ReaderAvatar item={item} />

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
          {item.reader_name || t('authorRecentEarningsPage.reader')}
        </div>

        <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
          {episode}
        </div>

        <div className="mt-1 line-clamp-1 text-[10.5px] font-semibold text-[#b4517b]">
          {item.story_title || t('authorRecentEarningsPage.story')}
        </div>

        <div className="mt-1.5 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
          {formatDateTime(item.created_at)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[14px] font-black text-[#b9517b]">
          +{formatMoney(item.author_net_payout_usd)}
        </div>

        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[var(--shadow-text-secondary)]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{formatNumber(item.author_earned_diamonds)}</span>
        </div>
      </div>
    </article>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-[72px] animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]"
        />
      ))}
    </div>
  )
}

export default function AuthorRecentEarningsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const minDate = useMemo(() => cambodiaDateValue(-29), [])
  const maxDate = useMemo(() => cambodiaDateValue(0), [])

  const [filter, setFilter] = useState({
    range: 'last30',
    from: '',
    to: '',
  })
  const [draftFrom, setDraftFrom] = useState(minDate)
  const [draftTo, setDraftTo] = useState(maxDate)
  const [customOpen, setCustomOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const items = Array.isArray(data?.items) ? data.items : []
  const summary = data?.summary || {}
  const pagination = data?.pagination || {}

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setMessage('')

        const params = new URLSearchParams({
          range: filter.range,
          page: String(page),
          limit: String(PAGE_SIZE),
        })

        if (filter.range === 'custom') {
          params.set('from', filter.from)
          params.set('to', filter.to)
        }

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/recent-earnings?${params.toString()}`,
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
          throw new Error(
            result.message || getDisplayText('authorRecentEarningsPage.loadFailed')
          )
        }

        setData(result)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setMessage(
            error.message || getDisplayText('authorRecentEarningsPage.loadFailed')
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [filter, navigate, page])

  function selectRange(range) {
    setCustomOpen(false)
    setPage(1)
    setFilter({
      range,
      from: '',
      to: '',
    })
  }

  function applyCustom() {
    if (
      !draftFrom ||
      !draftTo ||
      draftFrom < minDate ||
      draftTo > maxDate ||
      draftFrom > draftTo
    ) {
      setMessage(
        getDisplayText('authorRecentEarningsPage.invalidRange')
      )
      return
    }

    setMessage('')
    setPage(1)
    setCustomOpen(false)
    setFilter({
      range: 'custom',
      from: draftFrom,
      to: draftTo,
    })
  }

  const filterLabel =
    filter.range === 'today'
      ? t('authorRecentEarningsPage.today')
      : filter.range === 'last7'
        ? t('authorRecentEarningsPage.last7Days')
        : filter.range === 'custom'
          ? `${filter.from} → ${filter.to}`
          : t('authorRecentEarningsPage.last30Days')

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[62px] max-w-[720px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate('/author/income')}
            aria-label={t('authorRecentEarningsPage.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-black text-[var(--shadow-text-primary)]">
              {t('authorRecentEarningsPage.recentEarnings')}
            </h1>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.09em] text-[var(--shadow-text-tertiary)]">
              {t('authorRecentEarningsPage.latest30Days')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/author/earnings')}
            aria-label={t('authorRecentEarningsPage.incomeHistory')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#7651ad] active:scale-95"
          >
            <i className="fa-solid fa-clock-rotate-left text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-3 pt-4 sm:px-4">
        <section className="rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <RangeButton
              active={filter.range === 'today' && !customOpen}
              onClick={() => selectRange('today')}
            >
              {t('authorRecentEarningsPage.today')}
            </RangeButton>

            <RangeButton
              active={filter.range === 'last7' && !customOpen}
              onClick={() => selectRange('last7')}
            >
              {t('authorRecentEarningsPage.last7Days')}
            </RangeButton>

            <RangeButton
              active={filter.range === 'last30' && !customOpen}
              onClick={() => selectRange('last30')}
            >
              {t('authorRecentEarningsPage.last30Days')}
            </RangeButton>

            <RangeButton
              active={filter.range === 'custom' || customOpen}
              onClick={() => setCustomOpen(true)}
            >
              {t('authorRecentEarningsPage.custom')}
            </RangeButton>
          </div>

          {customOpen ? (
            <div className="mt-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="min-w-0">
                  <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
                    {t('authorRecentEarningsPage.start')}
                  </span>
                  <input
                    type="date"
                    lang={getDisplayLanguageId()}
                    min={minDate}
                    max={maxDate}
                    value={draftFrom}
                    onChange={(event) =>
                      setDraftFrom(event.target.value)
                    }
                    className="h-11 w-full min-w-0 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-2 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[#9d7ac1]"
                  />
                </label>

                <label className="min-w-0">
                  <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-secondary)]">
                    {t('authorRecentEarningsPage.end')}
                  </span>
                  <input
                    type="date"
                    lang={getDisplayLanguageId()}
                    min={minDate}
                    max={maxDate}
                    value={draftTo}
                    onChange={(event) =>
                      setDraftTo(event.target.value)
                    }
                    className="h-11 w-full min-w-0 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-2 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[#9d7ac1]"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={applyCustom}
                className="mt-3 h-11 w-full rounded-full bg-[#7651ad] text-[12px] font-black text-white active:scale-[0.99]"
              >
                {t('authorRecentEarningsPage.applyCustomRange')}
              </button>
            </div>
          ) : null}
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorRecentEarningsPage.earned')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[#b9517b]">
              {formatMoney(summary.total_author_usd)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorRecentEarningsPage.diamonds')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[#7651ad]">
              {formatNumber(summary.total_author_diamonds)}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
            <div className="text-[8.5px] font-black uppercase tracking-[0.07em] text-[var(--shadow-text-tertiary)]">
              {t('authorRecentEarningsPage.unlocks')}
            </div>
            <div className="mt-2 text-[17px] font-black text-[var(--shadow-text-primary)]">
              {formatNumber(summary.total_transactions)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_9px_24px_rgba(85,59,117,0.06)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-4 py-4">
            <div>
              <h2 className="text-[14px] font-black text-[var(--shadow-text-primary)]">
                {filterLabel}
              </h2>
              <p className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
                {t('authorRecentEarningsPage.newestEarningsFirst')}
              </p>
            </div>

            <span className="rounded-full bg-[#f4eef9] px-3 py-1.5 text-[9px] font-black text-[#7651ad]">
              {t('authorRecentEarningsPage.recordsCount', { count: formatNumber(pagination.total) })}
            </span>
          </div>

          {message ? (
            <div className="m-4 rounded-[16px] border border-[#efccd8] bg-[#fff4f7] px-4 py-3 text-[11px] font-semibold text-[#b44d76]">
              {message}
            </div>
          ) : null}

          {loading ? (
            <LoadingRows />
          ) : items.length ? (
            items.map((item) => (
              <EarningRow key={item.id} item={item} />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <img
                src="/assets/Icons/Diamond.svg"
                alt=""
                className="mx-auto h-7 w-7 object-contain"
              />
              <div className="mt-4 text-[14px] font-black text-[var(--shadow-text-primary)]">
                {t('authorRecentEarningsPage.noRecentEarnings')}
              </div>
              <div className="mx-auto mt-2 max-w-[270px] text-[11px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">
                {t('authorRecentEarningsPage.noRecentEarningsText')}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-[var(--shadow-border)] px-4 py-3">
            <button
              type="button"
              disabled={loading || !pagination.has_prev}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              {t('authorRecentEarningsPage.previous')}
            </button>

            <span className="text-[10.5px] font-bold text-[var(--shadow-text-tertiary)]">
              {t('authorRecentEarningsPage.pageOf', { page: formatNumber(pagination.page || 1), total: formatNumber(pagination.total_pages || 0) })}
            </span>

            <button
              type="button"
              disabled={loading || !pagination.has_next}
              onClick={() => setPage((current) => current + 1)}
              className="h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[11px] font-black text-[#7651ad] disabled:opacity-40"
            >
              {t('authorRecentEarningsPage.next')}
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/earnings')}
          className="w-full rounded-[18px] border border-[#ead69c] bg-[#fff8e7] px-4 py-3 text-left text-[10.5px] font-semibold leading-5 text-[#9a6b12]"
        >
          {t('authorRecentEarningsPage.olderHistoryHelp')}
        </button>
      </main>
    </div>
  )
}

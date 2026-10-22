import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, CalendarDays, ChevronDown, History, RefreshCw } from 'lucide-react'
import { useDisplayTranslation, getDisplayLanguageId } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/savedPostsApi'

registerTranslationNamespace('readerReadingSummary', {
  en: {
    title: 'Reading Summary', subtitle: 'Your daily reading at a glance.',
    back: 'Back to Settings', stories: 'Stories read', episodes: 'Episodes read',
    daily: 'Daily history', updated: 'Updated daily. Today’s reading appears tomorrow.',
    retention: 'Last 1 year', yesterday: 'Yesterday', loading: 'Loading summary...',
    empty: 'No reading summary yet', emptyHint: 'Completed daily summaries will appear here.',
    loadFailed: 'Could not load your reading summary.', retry: 'Try again',
    loadMore: 'Load 10 more', storyCount: '{{count}} stories', episodeCount: '{{count}} EP',
  },
  km: {
    title: 'សង្ខេបការអាន', subtitle: 'មើលសកម្មភាពអានប្រចាំថ្ងៃរបស់អ្នក។',
    back: 'ត្រឡប់ទៅ Settings', stories: 'រឿងបានអាន', episodes: 'ភាគបានអាន',
    daily: 'ប្រវត្តិប្រចាំថ្ងៃ', updated: 'ធ្វើបច្ចុប្បន្នភាពរាល់ថ្ងៃ។ ការអានថ្ងៃនេះនឹងបង្ហាញថ្ងៃស្អែក។',
    retention: '១ ឆ្នាំចុងក្រោយ', yesterday: 'ម្សិលមិញ', loading: 'កំពុងទាញទិន្នន័យ...',
    empty: 'មិនទាន់មានសង្ខេបការអាន', emptyHint: 'ប្រវត្តិដែលបានបូកសរុបប្រចាំថ្ងៃនឹងបង្ហាញនៅទីនេះ។',
    loadFailed: 'មិនអាចទាញសង្ខេបការអានបានទេ។', retry: 'សាកល្បងម្តងទៀត',
    loadMore: 'បង្ហាញ ១០ ថ្ងៃបន្ថែម', storyCount: '{{count}} រឿង', episodeCount: '{{count}} ភាគ',
  },
  zh: {
    title: '阅读汇总', subtitle: '查看每日阅读概况。',
    back: '返回设置', stories: '已读故事', episodes: '已读章节',
    daily: '每日记录', updated: '每日更新。今日阅读将在明日显示。',
    retention: '最近一年', yesterday: '昨天', loading: '正在加载...',
    empty: '暂无阅读汇总', emptyHint: '每日汇总将在这里显示。',
    loadFailed: '无法加载阅读汇总。', retry: '重试',
    loadMore: '再加载10天', storyCount: '{{count}} 个故事', episodeCount: '{{count}} 章',
  },
  ja: {
    title: '読書サマリー', subtitle: '日ごとの読書記録です。',
    back: '設定に戻る', stories: '読んだ作品', episodes: '読んだエピソード',
    daily: '日別の履歴', updated: '毎日更新。今日の読書は明日表示されます。',
    retention: '過去1年間', yesterday: '昨日', loading: '読み込み中...',
    empty: '読書サマリーはまだありません', emptyHint: '集計済みの記録がここに表示されます。',
    loadFailed: '読書サマリーを読み込めませんでした。', retry: '再試行',
    loadMore: 'さらに10日分', storyCount: '{{count}} 作品', episodeCount: '{{count}} 話',
  },
  ko: {
    title: '독서 요약', subtitle: '일별 독서 현황입니다.',
    back: '설정으로 돌아가기', stories: '읽은 작품', episodes: '읽은 에피소드',
    daily: '일별 기록', updated: '매일 업데이트됩니다. 오늘의 독서는 내일 표시됩니다.',
    retention: '최근 1년', yesterday: '어제', loading: '불러오는 중...',
    empty: '독서 요약이 없습니다', emptyHint: '집계된 일별 기록이 여기에 표시됩니다.',
    loadFailed: '독서 요약을 불러올 수 없습니다.', retry: '다시 시도',
    loadMore: '10일 더 보기', storyCount: '{{count}} 작품', episodeCount: '{{count}} 화',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const PAGE_SIZE = 10
const CACHE_TTL = 60 * 60 * 1000
const cachedPages = new Map()
let cacheToken = ''

function normalizePage(body) {
  if (body?.ok !== true || !Array.isArray(body.items)) throw new Error('LOAD_FAILED')
  return {
    items: body.items.slice(0, PAGE_SIZE).filter((item) =>
      /^\d{4}-\d{2}-\d{2}$/.test(String(item?.date || ''))
    ).map((item) => ({
      date: item.date,
      stories_read: Math.max(0, Number(item.stories_read) || 0),
      episodes_read: Math.max(0, Number(item.episodes_read) || 0),
    })),
    totals: body.totals && typeof body.totals === 'object' ? {
      stories_read: Math.max(0, Number(body.totals.stories_read) || 0),
      episodes_read: Math.max(0, Number(body.totals.episodes_read) || 0),
    } : null,
    nextCursor: typeof body.next_cursor === 'string' && body.next_cursor ? body.next_cursor : null,
  }
}

async function fetchSummaryPage(cursor, signal) {
  const token = getReaderToken()
  if (!token) throw new Error('AUTH_REQUIRED')
  if (cacheToken !== token) {
    cachedPages.clear()
    cacheToken = token
  }
  const key = cursor || 'first'
  const cached = cachedPages.get(key)
  if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.data
  const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
  if (cursor) params.set('cursor', cursor)
  const response = await fetch(`${API_BASE_URL}/api/reader/reading-summary?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  if (response.status === 401) throw new Error('AUTH_REQUIRED')
  if (!response.ok) throw new Error('LOAD_FAILED')
  const data = normalizePage(await response.json())
  cachedPages.set(key, { data, savedAt: Date.now() })
  return data
}

function localDay(value) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(value)
  const fields = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]))
  return `${fields.year}-${fields.month}-${fields.day}`
}

function displayDay(day, language, t) {
  if (day === localDay(new Date(Date.now() - 86400000))) return t('readerReadingSummary.yesterday')
  const date = new Date(`${day}T12:00:00+07:00`)
  if (Number.isNaN(date.getTime())) return day
  const locales = { km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }
  return new Intl.DateTimeFormat(locales[language] || 'en-US', {
    timeZone: 'Asia/Phnom_Penh', day: 'numeric', month: 'short', year: 'numeric',
  }).format(date)
}

export default function ReaderReadingSummaryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const language = getDisplayLanguageId()
  const tr = (key, values) => t(`readerReadingSummary.${key}`, values)
  const backPath = new URLSearchParams(location.search).get('from') === 'me-settings'
    ? '/profile/settings?from=me-settings' : '/profile/settings'
  const pending = useRef(null)
  const [page, setPage] = useState({
    items: [], totals: null, nextCursor: null, loading: false, loaded: false, error: false,
  })

  const load = useCallback(async (cursor = null) => {
    if (pending.current) return
    const controller = new AbortController()
    pending.current = controller
    setPage((previous) => ({ ...previous, loading: true, error: false }))
    try {
      const data = await fetchSummaryPage(cursor, controller.signal)
      if (controller.signal.aborted) return
      setPage((previous) => ({
        items: cursor ? [...previous.items, ...data.items] : data.items,
        totals: data.totals || previous.totals,
        nextCursor: data.nextCursor,
        loading: false,
        loaded: true,
        error: false,
      }))
    } catch (error) {
      if (controller.signal.aborted) return
      if (error.message === 'AUTH_REQUIRED') {
        navigate('/login', { replace: true })
        return
      }
      setPage((previous) => ({ ...previous, loading: false, error: true }))
    } finally {
      if (pending.current === controller) pending.current = null
    }
  }, [navigate])

  useEffect(() => {
    load()
    return () => {
      pending.current?.abort()
      pending.current = null
    }
  }, [load])

  const retry = () => load(page.loaded ? page.nextCursor : null)

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(60px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(backPath)} aria-label={tr('back')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={19} strokeWidth={1.8} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-[16px] font-extrabold">{tr('title')}</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 pt-5">
        <p className="text-[11px] text-[var(--shadow-text-secondary)]">{tr('subtitle')}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
            <BookOpen size={18} strokeWidth={1.8} className="text-[var(--shadow-text-secondary)]" />
            <p className="mt-3 text-[24px] font-extrabold tabular-nums">{page.totals ? page.totals.stories_read.toLocaleString() : '—'}</p>
            <p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">{tr('stories')}</p>
          </div>
          <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
            <History size={18} strokeWidth={1.8} className="text-[var(--shadow-text-secondary)]" />
            <p className="mt-3 text-[24px] font-extrabold tabular-nums">{page.totals ? page.totals.episodes_read.toLocaleString() : '—'}</p>
            <p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">{tr('episodes')}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
          <span className="flex items-start gap-2"><CalendarDays size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" />{tr('updated')}</span>
          <span>{tr('retention')}</span>
        </div>

        <h2 className="mb-3 mt-6 text-[13px] font-extrabold">{tr('daily')}</h2>
        {page.loading && !page.loaded ? (
          <div role="status" className="space-y-2" aria-label={tr('loading')}>
            {[0, 1, 2].map((item) => <div key={item} className="h-[64px] animate-pulse rounded-2xl bg-[var(--shadow-bg-soft)]" />)}
          </div>
        ) : null}

        {page.error ? (
          <div role="alert" className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-[12px]">
            <p>{tr('loadFailed')}</p>
            <button type="button" onClick={retry} className="mt-3 rounded-full bg-[#111827] px-4 py-2 font-semibold text-white dark:bg-white dark:text-[#111827]">{tr('retry')}</button>
          </div>
        ) : null}

        {page.loaded && page.items.length === 0 && !page.error ? (
          <div className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-8 text-center">
            <BookOpen size={26} strokeWidth={1.5} className="mx-auto text-[var(--shadow-text-secondary)]" />
            <h3 className="mt-3 text-[13px] font-semibold">{tr('empty')}</h3>
            <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{tr('emptyHint')}</p>
          </div>
        ) : null}

        {page.items.length > 0 ? (
          <div className="overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
            {page.items.map((item) => (
              <div key={item.date} className="flex min-h-[64px] items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-4 py-3 last:border-b-0">
                <span className="text-[12px] font-semibold">{displayDay(item.date, language, t)}</span>
                <div className="shrink-0 text-right text-[11px] leading-5 text-[var(--shadow-text-secondary)]">
                  <p>{tr('storyCount', { count: item.stories_read })}</p>
                  <p>{tr('episodeCount', { count: item.episodes_read })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {page.loaded && page.nextCursor && !page.error ? (
          <button type="button" onClick={() => load(page.nextCursor)} disabled={page.loading} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[12px] font-semibold disabled:opacity-50">
            {page.loading ? <RefreshCw size={16} className="animate-spin" /> : <ChevronDown size={16} />}
            {page.loading ? tr('loading') : tr('loadMore')}
          </button>
        ) : null}
      </div>
    </main>
  )
}

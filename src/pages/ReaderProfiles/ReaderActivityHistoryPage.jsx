import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Clock3,
  Gem,
  Heart,
  History,
  LockKeyhole,
  MessageCircle,
  RefreshCw,
  Repeat2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useDisplayTranslation, getDisplayLanguageId } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getReaderToken } from '../../services/savedPostsApi'

registerTranslationNamespace('readerActivityHistory', {
  en: {
    title: 'Activity History', subtitle: 'Your important activities from the past year.',
    back: 'Back to Settings', all: 'All', interactions: 'Interactions',
    reading: 'Reading', transactions: 'Transactions', security: 'Security',
    today: 'Today', yesterday: 'Yesterday', weekOf: 'Week of {{date}}',
    monthOf: 'Month of {{date}}', keptYear: 'Saved for 1 year',
    delayed: 'Today’s activity may appear later.',
    securityNote: 'Security events are recorded immediately.',
    empty: 'No activity yet', emptyDescription: 'Your important reader activities will appear here.',
    loadFailed: 'Could not load activity history. Please try again.',
    loading: 'Loading activity...', loadMore: 'Load 10 more',
    retry: 'Try again', refresh: 'Refresh', actions: '{{count}} actions',
    like: 'Liked a post or story', unlike: 'Removed a like',
    comment: 'Commented', edit_comment: 'Edited a comment',
    delete_comment: 'Deleted a comment', echo: 'Echoed a post',
    share: 'Shared content', save: 'Saved a post', unsave: 'Removed a saved post',
    read: 'Read an episode', unlock: 'Unlocked an episode',
    purchase: 'Made a purchase', gift: 'Sent a gift',
    follow: 'Followed a reader', unfollow: 'Unfollowed a reader',
    delete: 'Deleted content', update_profile: 'Updated profile',
    change_password: 'Changed password', login: 'Account sign-in',
    login_alert: 'Unusual sign-in attempt', security_alert: 'Security alert',
    change_email: 'Changed account email', other: 'Account activity',
  },
  km: {
    title: 'ប្រវត្តិសកម្មភាព', subtitle: 'សកម្មភាពសំខាន់ៗរបស់អ្នកក្នុងរយៈពេល ១ ឆ្នាំ។',
    back: 'ត្រឡប់ទៅការកំណត់', all: 'ទាំងអស់', interactions: 'អន្តរកម្ម',
    reading: 'ការអាន', transactions: 'ប្រតិបត្តិការ', security: 'សុវត្ថិភាព',
    today: 'ថ្ងៃនេះ', yesterday: 'ម្សិលមិញ', weekOf: 'សប្តាហ៍ចាប់ពី {{date}}',
    monthOf: 'ខែ {{date}}', keptYear: 'រក្សាទុក ១ ឆ្នាំ',
    delayed: 'សកម្មភាពថ្ងៃនេះអាចបង្ហាញយឺតបន្តិច។',
    securityNote: 'ព្រឹត្តិការណ៍សុវត្ថិភាពត្រូវបានកត់ត្រាភ្លាមៗ។',
    empty: 'មិនទាន់មានសកម្មភាព', emptyDescription: 'សកម្មភាពសំខាន់ៗរបស់អ្នកអាននឹងបង្ហាញនៅទីនេះ។',
    loadFailed: 'មិនអាចផ្ទុកប្រវត្តិសកម្មភាពបានទេ។ សូមព្យាយាមម្តងទៀត។',
    loading: 'កំពុងផ្ទុកសកម្មភាព...', loadMore: 'ផ្ទុកបន្ថែម ១០',
    retry: 'ព្យាយាមម្តងទៀត', refresh: 'ផ្ទុកឡើងវិញ', actions: '{{count}} សកម្មភាព',
    like: 'បានចុច Like', unlike: 'បានដក Like',
    comment: 'បានបញ្ចេញមតិ', edit_comment: 'បានកែមតិ',
    delete_comment: 'បានលុបមតិ', echo: 'បាន Echo',
    share: 'បានចែករំលែក', save: 'បានរក្សាទុក Post', unsave: 'បានដក Post ដែលរក្សាទុក',
    read: 'បានអានភាគ', unlock: 'បានដោះសោភាគ',
    purchase: 'បានទិញ', gift: 'បានផ្ញើ Gift',
    follow: 'បាន Follow', unfollow: 'បាន Unfollow',
    delete: 'បានលុបមាតិកា', update_profile: 'បានកែ Profile',
    change_password: 'បានប្តូរ Password', login: 'បានចូលគណនី',
    login_alert: 'មានការព្យាយាមចូលគណនីមិនប្រក្រតី', security_alert: 'ការព្រមានសុវត្ថិភាព',
    change_email: 'បានប្តូរអ៊ីមែល', other: 'សកម្មភាពគណនី',
  },
  zh: {
    title: '活动历史', subtitle: '过去一年中的重要活动。',
    back: '返回设置', all: '全部', interactions: '互动', reading: '阅读',
    transactions: '交易', security: '安全', today: '今天', yesterday: '昨天',
    weekOf: '{{date}} 起的一周', monthOf: '{{date}} 月',
    keptYear: '保存一年', delayed: '今天的活动可能延迟显示。',
    securityNote: '安全事件会立即记录。', empty: '暂无活动',
    emptyDescription: '重要的读者活动会显示在这里。',
    loadFailed: '无法加载活动历史，请重试。', loading: '正在加载活动…',
    loadMore: '再加载 10 条', retry: '重试', refresh: '刷新', actions: '{{count}} 次活动',
    like: '点赞', unlike: '取消点赞', comment: '发表评论',
    edit_comment: '编辑评论', delete_comment: '删除评论', echo: 'Echo 帖子',
    share: '分享内容', save: '保存帖子', unsave: '取消保存帖子',
    read: '阅读章节', unlock: '解锁章节', purchase: '购买', gift: '赠送礼物',
    follow: '关注读者', unfollow: '取消关注', delete: '删除内容',
    update_profile: '更新资料', change_password: '更改密码',
    login: '登录账号', login_alert: '异常登录尝试',
    security_alert: '安全提醒', change_email: '更改邮箱', other: '账号活动',
  },
  ja: {
    title: 'アクティビティ履歴', subtitle: '過去1年間の重要なアクティビティ。',
    back: '設定に戻る', all: 'すべて', interactions: '交流', reading: '読書',
    transactions: '取引', security: 'セキュリティ', today: '今日', yesterday: '昨日',
    weekOf: '{{date}} の週', monthOf: '{{date}} の月',
    keptYear: '1年間保存', delayed: '今日の記録は遅れて表示される場合があります。',
    securityNote: 'セキュリティイベントはすぐに記録されます。',
    empty: '記録はまだありません', emptyDescription: '重要な読者の活動がここに表示されます。',
    loadFailed: '履歴を読み込めませんでした。再試行してください。',
    loading: '読み込み中…', loadMore: 'さらに10件', retry: '再試行',
    refresh: '更新', actions: '{{count}} 件の活動',
    like: 'いいね', unlike: 'いいねを解除', comment: 'コメント',
    edit_comment: 'コメントを編集', delete_comment: 'コメントを削除',
    echo: 'Echo', share: '共有', save: '投稿を保存', unsave: '保存を解除',
    read: 'エピソードを読む', unlock: 'エピソードを解放',
    purchase: '購入', gift: 'ギフトを送信', follow: 'フォロー',
    unfollow: 'フォロー解除', delete: 'コンテンツを削除',
    update_profile: 'プロフィール更新', change_password: 'パスワード変更',
    login: 'ログイン', login_alert: '不審なログイン試行',
    security_alert: 'セキュリティ警告', change_email: 'メール変更',
    other: 'アカウント活動',
  },
  ko: {
    title: '활동 기록', subtitle: '지난 1년간의 주요 활동입니다.',
    back: '설정으로 돌아가기', all: '전체', interactions: '상호작용',
    reading: '읽기', transactions: '거래', security: '보안',
    today: '오늘', yesterday: '어제', weekOf: '{{date}} 주간',
    monthOf: '{{date}} 월', keptYear: '1년 보관',
    delayed: '오늘의 활동은 늦게 표시될 수 있습니다.',
    securityNote: '보안 이벤트는 즉시 기록됩니다.',
    empty: '활동 내역이 없습니다', emptyDescription: '중요한 독자 활동이 여기에 표시됩니다.',
    loadFailed: '활동 기록을 불러오지 못했습니다. 다시 시도하세요.',
    loading: '활동 불러오는 중…', loadMore: '10개 더 보기',
    retry: '다시 시도', refresh: '새로고침', actions: '{{count}}개 활동',
    like: '좋아요', unlike: '좋아요 취소', comment: '댓글 작성',
    edit_comment: '댓글 수정', delete_comment: '댓글 삭제',
    echo: 'Echo', share: '공유', save: '게시물 저장', unsave: '저장 취소',
    read: '에피소드 읽음', unlock: '에피소드 잠금 해제',
    purchase: '구매', gift: '선물 전송', follow: '팔로우',
    unfollow: '팔로우 취소', delete: '콘텐츠 삭제',
    update_profile: '프로필 수정', change_password: '비밀번호 변경',
    login: '로그인', login_alert: '비정상 로그인 시도',
    security_alert: '보안 알림', change_email: '이메일 변경',
    other: '계정 활동',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PAGE_SIZE = 10
const CACHE_TTL = 10 * 60 * 1000
const TIME_ZONE = 'Asia/Phnom_Penh'
const CATEGORIES = ['all', 'interactions', 'reading', 'transactions', 'security']
const cachedPages = new Map()
let cacheToken = ''

const ACTION_ICONS = {
  like: Heart,
  unlike: Heart,
  comment: MessageCircle,
  edit_comment: MessageCircle,
  delete_comment: Trash2,
  echo: Repeat2,
  share: Repeat2,
  save: Bookmark,
  unsave: Bookmark,
  read: History,
  unlock: Gem,
  purchase: ShoppingBag,
  gift: Gem,
  follow: UserRound,
  unfollow: UserRound,
  delete: Trash2,
  update_profile: UserRound,
  change_password: LockKeyhole,
  change_email: LockKeyhole,
  login: ShieldCheck,
  login_alert: ShieldAlert,
  security_alert: ShieldAlert,
}

const CATEGORY_ICONS = {
  all: History,
  interactions: Heart,
  reading: History,
  transactions: ShoppingBag,
  security: ShieldCheck,
}

function dateParts(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${map.year}-${map.month}-${map.day}`
}

function displayDate(value, language, options = {}) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const locales = { km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }
  return new Intl.DateTimeFormat(locales[language] || 'en-US', {
    timeZone: TIME_ZONE,
    month: 'short', day: 'numeric', year: 'numeric',
    ...options,
  }).format(date)
}

function sectionLabel(item, t, language) {
  const timestamp = item.period_start || item.occurred_at || item.created_at
  const key = dateParts(timestamp)
  if (!key) return ''
  const today = dateParts(Date.now())
  const yesterday = dateParts(Date.now() - 86400000)
  const period = item.period || item.summary_period || 'day'
  const label = displayDate(timestamp, language, period === 'month'
    ? { day: undefined }
    : {})
  if (period === 'month') return t('readerActivityHistory.monthOf', { date: label })
  if (period === 'week') return t('readerActivityHistory.weekOf', { date: label })
  if (key === today) return t('readerActivityHistory.today')
  if (key === yesterday) return t('readerActivityHistory.yesterday')
  return label
}

function localTime(value, language) {
  if (!value) return ''
  return displayDate(value, language, { month: undefined, day: undefined, year: undefined, hour: '2-digit', minute: '2-digit' })
}

function normalizeResponse(data) {
  const items = Array.isArray(data.items) ? data.items : []
  return { items, nextCursor: typeof data.next_cursor === 'string' && data.next_cursor ? data.next_cursor : null }
}

async function fetchPage(category, cursor, signal, force = false) {
  const token = getReaderToken()
  if (!token) throw new Error('AUTH_REQUIRED')
  if (token !== cacheToken) {
    cachedPages.clear()
    cacheToken = token
  }
  const key = `${category}:${cursor || 'first'}`
  const cached = cachedPages.get(key)
  if (!force && cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.data

  const params = new URLSearchParams({ category, limit: String(PAGE_SIZE) })
  if (cursor) params.set('cursor', cursor)
  const response = await fetch(`${API_BASE_URL}/api/reader/activity-history?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  if (response.status === 401) throw new Error('AUTH_REQUIRED')
  if (!response.ok) throw new Error('LOAD_FAILED')
  const body = await response.json().catch(() => ({}))
  if (body.ok === false || !Array.isArray(body.items)) throw new Error('LOAD_FAILED')
  const data = normalizeResponse(body)
  cachedPages.set(key, { data, savedAt: Date.now() })
  return data
}

function groupItems(items, t, language) {
  const groups = []
  items.forEach((item, index) => {
    const heading = sectionLabel(item, t, language)
    const key = `${item.period || item.summary_period || 'day'}:${item.period_start || heading}`
    const previous = groups[groups.length - 1]
    if (previous?.key === key) previous.items.push({ item, index })
    else groups.push({ key, heading, items: [{ item, index }] })
  })
  return groups
}

export default function ReaderActivityHistoryPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const language = getDisplayLanguageId()
  const [category, setCategory] = useState('all')
  const [pages, setPages] = useState({})
  const pending = useRef(null)
  const page = pages[category] || { items: [], nextCursor: null, loading: false, loaded: false, error: false }

  const stopPending = useCallback(() => {
    const active = pending.current
    if (!active) return
    active.controller.abort()
    pending.current = null
    setPages((previous) => {
      const current = previous[active.tab]
      if (!current?.loading) return previous
      return { ...previous, [active.tab]: { ...current, loading: false } }
    })
  }, [])

  const load = useCallback(async (tab, cursor = null, force = false) => {
    if (!getReaderToken()) {
      navigate('/login', { replace: true })
      return
    }
    stopPending()
    const controller = new AbortController()
    pending.current = { controller, tab }
    const more = Boolean(cursor)
    setPages((previous) => ({
      ...previous,
      [tab]: {
        ...(previous[tab] || { items: [], nextCursor: null, loaded: false }),
        loading: true,
        error: false,
      },
    }))
    try {
      const result = await fetchPage(tab, cursor, controller.signal, force)
      if (controller.signal.aborted) return
      setPages((previous) => ({
        ...previous,
        [tab]: {
          items: more ? [...(previous[tab]?.items || []), ...result.items] : result.items,
          nextCursor: result.nextCursor,
          loaded: true,
          loading: false,
          error: false,
          fetchedAt: Date.now(),
        },
      }))
    } catch (error) {
      if (controller.signal.aborted) return
      if (error.message === 'AUTH_REQUIRED') {
        navigate('/login', { replace: true })
        return
      }
      setPages((previous) => ({
        ...previous,
        [tab]: {
          ...(previous[tab] || { items: [], nextCursor: null, loaded: false }),
          loading: false,
          error: true,
        },
      }))
    } finally {
      if (pending.current?.controller === controller) pending.current = null
    }
  }, [navigate, stopPending])

  useEffect(() => {
    const current = pages[category]
    if (!current?.loaded || Date.now() - (current.fetchedAt || 0) >= CACHE_TTL) {
      load(category)
    }
    return () => stopPending()
  }, [category, load, stopPending])

  const refresh = () => {
    cachedPages.forEach((_, key) => {
      if (key.startsWith(`${category}:`)) cachedPages.delete(key)
    })
    load(category, null, true)
  }

  const grouped = useMemo(() => groupItems(page.items, t, language), [page.items, t, language])

  return (
    <main className="app-page min-h-screen pb-[100px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate('/profile/settings')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('readerActivityHistory.back')}>
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[18px] font-bold">{t('readerActivityHistory.title')}</h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">{t('readerActivityHistory.subtitle')}</p>
          </div>
          <button type="button" onClick={refresh} disabled={page.loading}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)] disabled:opacity-40"
            aria-label={t('readerActivityHistory.refresh')}>
            <RefreshCw className={`h-[18px] w-[18px] ${page.loading ? 'animate-spin' : ''}`} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 pt-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--shadow-text-secondary)]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-1.5">
            <CalendarDays className="h-3.5 w-3.5" />{t('readerActivityHistory.keptYear')}
          </span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{t('readerActivityHistory.delayed')}</span>
        </div>

        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-3" role="tablist" aria-label={t('readerActivityHistory.title')}>
          {CATEGORIES.map((tab) => {
            const TabIcon = CATEGORY_ICONS[tab]
            const selected = category === tab
            return (
              <button type="button" key={tab} role="tab" aria-selected={selected}
                onClick={() => setCategory(tab)}
                className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition ${selected
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_8px_20px_rgba(124,91,255,0.25)]'
                  : 'border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-secondary)]'}`}>
                <TabIcon className="h-[15px] w-[15px]" strokeWidth={1.8} />
                {t(`readerActivityHistory.${tab}`)}
              </button>
            )
          })}
        </div>

        {category === 'security' ? (
          <div className="mt-2 flex items-start gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t('readerActivityHistory.securityNote')}
          </div>
        ) : null}

        {page.error ? (
          <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-[12px] text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
            <p>{t('readerActivityHistory.loadFailed')}</p>
            <button type="button" onClick={() => load(category, page.loaded ? page.nextCursor : null, true)}
              className="mt-3 rounded-lg border border-current px-3 py-2 font-semibold">
              {t('readerActivityHistory.retry')}
            </button>
          </div>
        ) : null}

        {page.loading && !page.loaded ? (
          <div className="mt-5 space-y-3" role="status" aria-label={t('readerActivityHistory.loading')}>
            {[0, 1, 2].map((n) => <div key={n} className="h-[76px] animate-pulse rounded-2xl bg-[var(--shadow-bg-soft)]" />)}
          </div>
        ) : null}

        {page.loaded && page.items.length === 0 && !page.loading && !page.error ? (
          <div className="mt-6 rounded-3xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <History className="h-7 w-7 text-[var(--shadow-text-secondary)]" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 text-[15px] font-bold">{t('readerActivityHistory.empty')}</h2>
            <p className="mt-1.5 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerActivityHistory.emptyDescription')}</p>
          </div>
        ) : null}

        {grouped.map((group) => (
          <section key={group.key} className="mt-5">
            <h2 className="mb-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{group.heading}</h2>
            <div className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
              {group.items.map(({ item, index }) => {
                const action = String(item.action || 'other').toLowerCase()
                const Icon = ACTION_ICONS[action] || CATEGORY_ICONS[item.category] || History
                const label = t(`readerActivityHistory.${Object.prototype.hasOwnProperty.call(ACTION_ICONS, action) || action === 'other' ? action : 'other'}`)
                const isSummary = Boolean(item.is_summary || item.summary || (Number(item.count) > 1))
                const timestamp = item.occurred_at || item.created_at
                const count = Number(item.count) || 1
                return (
                  <div key={item.id || `${group.key}-${index}`}
                    className="flex min-h-[74px] items-center gap-3 border-b border-[var(--shadow-border)] px-3 py-3 last:border-b-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-5">{label}</p>
                      {item.description ? <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{String(item.description)}</p> : null}
                    </div>
                    <div className="shrink-0 text-right text-[11px] text-[var(--shadow-text-secondary)]">
                      {isSummary ? t('readerActivityHistory.actions', { count }) : localTime(timestamp, language)}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {page.nextCursor && page.loaded && !page.error ? (
          <button type="button" onClick={() => load(category, page.nextCursor)} disabled={page.loading}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[13px] font-semibold disabled:opacity-60">
            {page.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
            {page.loading ? t('readerActivityHistory.loading') : t('readerActivityHistory.loadMore')}
          </button>
        ) : null}
      </div>
    </main>
  )
}

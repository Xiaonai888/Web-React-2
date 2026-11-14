import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, ChevronLeft, ChevronRight, LoaderCircle, RefreshCw } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  listStudioVideoNotifications,
  markStudioVideoNotificationRead,
} from '../../services/shadowStudioNotificationsApi'

registerTranslationNamespace('shadowStudioNotifications', {
  en: { title: 'Video notifications', all: 'All', unread: 'Unread', comments: 'Comments', empty: 'No video notifications yet.', emptyComments: 'No comment notifications yet.', loading: 'Loading notifications...', more: 'Load more', retry: 'Retry', error: 'Unable to load video notifications.', back: 'Back', newComment: 'New comment', unreadItem: 'Unread notification' },
  km: { title: 'ការជូនដំណឹងវីដេអូ', all: 'ទាំងអស់', unread: 'មិនទាន់អាន', comments: 'មតិយោបល់', empty: 'មិនទាន់មានការជូនដំណឹងវីដេអូទេ។', emptyComments: 'មិនទាន់មានការជូនដំណឹងមតិយោបល់ទេ។', loading: 'កំពុងទាញការជូនដំណឹង...', more: 'មើលបន្ថែម', retry: 'សាកល្បងម្ដងទៀត', error: 'មិនអាចទាញការជូនដំណឹងវីដេអូបានទេ។', back: 'ត្រឡប់ក្រោយ', newComment: 'មតិថ្មី', unreadItem: 'ការជូនដំណឹងមិនទាន់អាន' },
  zh: { title: '视频通知', all: '全部', unread: '未读', comments: '评论', empty: '暂无视频通知。', emptyComments: '暂无评论通知。', loading: '加载通知中...', more: '加载更多', retry: '重试', error: '无法加载视频通知。', back: '返回', newComment: '新评论', unreadItem: '未读通知' },
  ja: { title: '動画の通知', all: 'すべて', unread: '未読', comments: 'コメント', empty: '動画の通知はまだありません。', emptyComments: 'コメント通知はまだありません。', loading: '通知を読み込み中...', more: 'もっと見る', retry: '再試行', error: '動画の通知を読み込めません。', back: '戻る', newComment: '新しいコメント', unreadItem: '未読通知' },
  ko: { title: '동영상 알림', all: '전체', unread: '읽지 않음', comments: '댓글', empty: '아직 동영상 알림이 없습니다.', emptyComments: '아직 댓글 알림이 없습니다.', loading: '알림 불러오는 중...', more: '더 보기', retry: '다시 시도', error: '동영상 알림을 불러올 수 없습니다.', back: '뒤로', newComment: '새 댓글', unreadItem: '읽지 않은 알림' },
})

const ROOT = '/author/reel/studio'
const PAGE_SIZE = 10
const FILTERS = ['all', 'unread', 'comments']

function validStudioRoute(value) {
  return typeof value === 'string' &&
    value.startsWith(ROOT) &&
    (value.length === ROOT.length || '/?#'.includes(value.charAt(ROOT.length))) &&
    !value.startsWith(`${ROOT}/notifications`)
}

function formatDate(date) {
  const value = new Date(date)
  return Number.isFinite(value.getTime()) ? value.toLocaleString() : ''
}

export default function AuthorStudioNotificationsPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = validStudioRoute(location.state?.returnTo) ? location.state.returnTo : `${ROOT}/dashboard`
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [nextCursor, setNextCursor] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const busyRef = useRef(false)
  const abortRef = useRef(null)

  const load = useCallback(async ({ append = false, force = false } = {}) => {
    if (busyRef.current && append) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    busyRef.current = true
    setLoading(true)
    setError('')
    try {
      const data = await listStudioVideoNotifications({
        before: append ? nextCursor : '',
        limit: PAGE_SIZE,
        filter,
        unreadOnly: filter === 'unread',
        signal: controller.signal,
        force,
      })
      if (controller.signal.aborted) return
      setItems(previous => {
        if (!append) return data.notifications
        const existing = new Set(previous.map(item => item.id))
        return [...previous, ...data.notifications.filter(item => !existing.has(item.id))]
      })
      setNextCursor(data.nextCursor)
      setHasMore(data.hasMore)
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause.message || t('shadowStudioNotifications.error'))
    } finally {
      if (!controller.signal.aborted) {
        busyRef.current = false
        setLoading(false)
      }
    }
  }, [nextCursor, filter, t])

  useEffect(() => {
    void load({ force: retry > 0 })
    return () => abortRef.current?.abort()
  }, [filter, retry])

  const switchFilter = value => {
    if (filter === value) return
    setItems([])
    setNextCursor('')
    setHasMore(false)
    setFilter(value)
  }

  const openNotification = async item => {
    if (!item.is_read) {
      try {
        await markStudioVideoNotificationRead(item.id)
        setItems(previous => filter === 'unread'
          ? previous.filter(row => row.id !== item.id)
          : previous.map(row => row.id === item.id ? { ...row, is_read: true } : row))
      } catch (cause) {
        setError(cause.message || t('shadowStudioNotifications.error'))
      }
    }
    const videoId = String(item.metadata?.video_id || '')
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoId)) {
      navigate(`${ROOT}/videos/${encodeURIComponent(videoId)}/analytics?section=engagement`, { state: { fromContent: true } })
    }
  }

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-surface)] pb-10 text-[var(--shadow-text-primary)]">
    <header className="sticky top-0 z-40 bg-[var(--shadow-bg-surface)]">
      <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
        <button type="button" onClick={() => navigate(returnTo)}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          aria-label={t('shadowStudioNotifications.back')}>
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
        </button>
        <h1 className="text-center text-[18px] font-bold">{t('shadowStudioNotifications.title')}</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </div>
    </header>
    <nav aria-label={t('shadowStudioNotifications.title')} className="sticky top-14 z-30 bg-[var(--shadow-bg-surface)]">
      <div className="mx-auto flex max-w-[980px] gap-2 overflow-x-auto px-4 py-2">
        {FILTERS.map(value => <button key={value} type="button" aria-pressed={filter === value}
          onClick={() => switchFilter(value)}
          className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition active:scale-[0.98] ${filter === value ? 'bg-black/[0.065] font-semibold text-[var(--shadow-text-primary)]' : 'font-normal text-[var(--shadow-text-tertiary)]'}`}>
          {t(`shadowStudioNotifications.${value}`)}
        </button>)}
      </div>
    </nav>
    <div className="mx-auto max-w-[980px] px-4 sm:px-6">
      <section className="divide-y divide-[var(--shadow-border)]" aria-label={t('shadowStudioNotifications.title')}>
        {items.map(item => <button type="button" key={item.id} onClick={() => void openNotification(item)} className="flex w-full items-start gap-3 py-4 text-left hover:bg-[var(--shadow-bg-soft)]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]">
            {item.metadata?.actor_avatar_url ? <img alt="" src={item.metadata.actor_avatar_url} className="h-full w-full object-cover" /> : <Bell size={19} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-start gap-2"><span className={`min-w-0 flex-1 text-sm ${item.is_read ? 'font-medium' : 'font-bold'}`}>{item.title || t('shadowStudioNotifications.newComment')}</span>{!item.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--shadow-accent)]" aria-label={t('shadowStudioNotifications.unreadItem')} />}</span>
            {item.message && <span className="mt-1 block break-words text-xs text-[var(--shadow-text-secondary)]">{item.message}</span>}
            <span className="mt-1 block text-[11px] text-[var(--shadow-text-tertiary)]">{formatDate(item.created_at)}</span>
          </span>
          <ChevronRight size={18} className="mt-2 shrink-0 text-[var(--shadow-text-tertiary)]" />
        </button>)}
      </section>
      {loading && !items.length && <p role="status" className="py-16 text-center text-sm text-[var(--shadow-text-secondary)]"><LoaderCircle size={18} className="mr-2 inline animate-spin" />{t('shadowStudioNotifications.loading')}</p>}
      {!loading && !error && !items.length && <div className="px-4 py-16 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-hover)]"><Bell size={21} aria-hidden="true" /></span>
        <p className="text-sm font-semibold">{t(`shadowStudioNotifications.${filter === 'comments' ? 'emptyComments' : 'empty'}`)}</p>
      </div>}
      {error && <div role="alert" className="flex items-center justify-between gap-3 py-4 text-sm text-[var(--shadow-danger)]"><span>{error}</span><button type="button" onClick={() => setRetry(value => value + 1)} className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--shadow-border)] px-3 py-2"><RefreshCw size={15}/>{t('shadowStudioNotifications.retry')}</button></div>}
      {hasMore && !loading && !error && <button type="button" onClick={() => void load({ append: true })} className="mx-auto mt-4 block rounded-full border border-[var(--shadow-border)] px-5 py-2.5 text-sm font-semibold">{t('shadowStudioNotifications.more')}</button>}
    </div>
  </main>
}

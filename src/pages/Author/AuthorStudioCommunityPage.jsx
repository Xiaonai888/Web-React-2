import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Crown, MessageCircle, RefreshCw, Video } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import ShadowStudioFooter from '../../components/author/ShadowStudioFooter'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('studioCommunity', {
  en: { title: 'Community', comments: 'Comments', recent: 'Latest comments on your Reels', all: 'View all', back: 'Back to Community', empty: 'No comments on your Reels yet.', spotlight: 'Community Spotlight', spotlightSub: 'Meet your top 3 commenters on your Reels this week.', thisWeek: 'This week', noSpotlight: 'Your weekly spotlight will appear when readers comment.', reply: 'Reply', replies: 'replies', loadMore: 'Load more', loading: 'Loading Community...', failed: 'Unable to load Community.', retry: 'Retry', count: 'comments', moreThanThousand: 'Based on recent weekly comments' },
  km: { title: 'Community', comments: 'Comments', recent: 'មតិថ្មីៗលើវីដេអូរបស់អ្នក', all: 'មើលទាំងអស់', back: 'ត្រឡប់ទៅ Community', empty: 'មិនទាន់មានមតិលើវីដេអូទេ។', spotlight: 'Community Spotlight', spotlightSub: 'អ្នកអាន ៣ នាក់ដែលបានបញ្ចេញមតិច្រើនជាងគេក្នុងសប្ដាហ៍នេះ។', thisWeek: 'សប្ដាហ៍នេះ', noSpotlight: 'អ្នកអានសកម្មនឹងបង្ហាញនៅទីនេះពេលមានមតិ។', reply: 'ឆ្លើយតប', replies: 'ការឆ្លើយតប', loadMore: 'មើលបន្ថែម', loading: 'កំពុងទាញ Community...', failed: 'មិនអាចទាញ Community បានទេ។', retry: 'សាកល្បងម្ដងទៀត', count: 'មតិ', moreThanThousand: 'គិតតាមមតិថ្មីៗក្នុងសប្ដាហ៍' },
  zh: { title: '社区', comments: '评论', recent: 'Reels 的最新评论', all: '查看全部', back: '返回社区', empty: '暂无评论', spotlight: '社区之星', spotlightSub: '本周评论最多的三位读者', thisWeek: '本周', noSpotlight: '有读者评论后，将展示本周之星', reply: '回复', replies: '条回复', loadMore: '加载更多', loading: '加载社区中…', failed: '加载失败', retry: '重试', count: '条评论', moreThanThousand: '根据最近的本周评论' },
  ja: { title: 'コミュニティ', comments: 'コメント', recent: 'Reels の最新コメント', all: 'すべて表示', back: 'コミュニティに戻る', empty: 'コメントはまだありません', spotlight: 'コミュニティスポットライト', spotlightSub: '今週のトップコメント投稿者3名', thisWeek: '今週', noSpotlight: 'コメントが投稿されると表示されます', reply: '返信', replies: '件の返信', loadMore: 'もっと見る', loading: '読み込み中…', failed: '読み込めません', retry: '再試行', count: '件のコメント', moreThanThousand: '今週の最近のコメントを集計' },
  ko: { title: '커뮤니티', comments: '댓글', recent: 'Reels 최신 댓글', all: '전체 보기', back: '커뮤니티로 돌아가기', empty: '아직 댓글이 없습니다', spotlight: '커뮤니티 스포트라이트', spotlightSub: '이번 주 댓글 상위 3명', thisWeek: '이번 주', noSpotlight: '댓글이 생기면 이곳에 표시됩니다', reply: '답글', replies: '개의 답글', loadMore: '더 보기', loading: '커뮤니티 불러오는 중…', failed: '불러올 수 없습니다', retry: '다시 시도', count: '댓글', moreThanThousand: '최근 일주일 댓글 기준' },
})

const ROOT = '/author/reel/studio/community'
const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const CACHE_MS = 2 * 60 * 1000
let overviewCache = null
if (typeof window !== 'undefined') {
  window.addEventListener('shadow-studio-notifications-changed', () => { overviewCache = null })
}

function readerToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function loadCommunity({ all = false, offset = 0, signal, force = false } = {}) {
  const token = readerToken()
  if (!token) throw new Error('Sign in to use Shadow Studio.')
  if (!all && !force && overviewCache?.token === token && Date.now() < overviewCache.until) {
    return overviewCache.data
  }
  const search = new URLSearchParams({ view: all ? 'all' : 'overview' })
  if (all) search.set('offset', String(offset))
  const response = await fetch(`${API_BASE}/api/fast/studio/community?${search}`, {
    signal,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok !== true) throw new Error(data.message || `Community (${response.status})`)
  if (token !== readerToken()) throw new Error('Account changed.')
  if (!all && !signal?.aborted) overviewCache = { token, until: Date.now() + CACHE_MS, data }
  return data
}

function since(date) {
  const age = Math.max(0, Date.now() - new Date(date).getTime())
  if (!Number.isFinite(age)) return ''
  if (age < 60000) return 'now'
  if (age < 3600000) return `${Math.floor(age / 60000)}m`
  if (age < 86400000) return `${Math.floor(age / 3600000)}h`
  return `${Math.floor(age / 86400000)}d`
}

function Face({ src, name, size = 'h-10 w-10' }) {
  return <span className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] font-bold text-[var(--shadow-accent)]`}>
    {src ? <img src={src} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : (name || 'R').charAt(0).toUpperCase()}
  </span>
}

export default function AuthorStudioCommunityPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const isAll = new URLSearchParams(location.search).get('view') === 'all'
  const [data, setData] = useState(null)
  const [rows, setRows] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const requestRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const requestId = ++requestRef.current
    setError('')
    setLoading(true)
    setRows([])
    setOffset(0)
    setHasMore(false)
    loadCommunity({ all: isAll, signal: controller.signal, force: retry > 0 })
      .then(result => {
        if (controller.signal.aborted || requestId !== requestRef.current) return
        if (isAll) {
          setRows(result.comments || [])
          setOffset(result.pagination?.next_offset || 0)
          setHasMore(Boolean(result.pagination?.has_more))
        } else setData(result)
      })
      .catch(cause => {
        if (!controller.signal.aborted && requestId === requestRef.current) setError(cause.message || t('studioCommunity.failed'))
      })
      .finally(() => {
        if (!controller.signal.aborted && requestId === requestRef.current) setLoading(false)
      })
    return () => { controller.abort(); requestRef.current += 1 }
  }, [isAll, retry, t])

  const more = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const result = await loadCommunity({ all: true, offset })
      setRows(previous => {
        const ids = new Set(previous.map(item => item.id))
        return [...previous, ...(result.comments || []).filter(item => !ids.has(item.id))]
      })
      setOffset(result.pagination?.next_offset || offset)
      setHasMore(Boolean(result.pagination?.has_more))
    } catch (cause) { setError(cause.message || t('studioCommunity.failed')) }
    finally { setLoadingMore(false) }
  }, [offset, hasMore, loadingMore, t])

  const openReel = videoId => {
    if (!videoId) return
    navigate(`/fast?reel=${encodeURIComponent(videoId)}`, {
      state: { fromAuthorReel: true, returnTo: `${location.pathname}${location.search}` },
    })
  }

  const items = isAll ? rows : (data?.comments || [])

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] pb-28 text-[var(--shadow-text-primary)]">
    <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
      <header className="mb-6 flex items-center gap-3">
        {isAll ? <button type="button" onClick={() => navigate(ROOT)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]" aria-label={t('studioCommunity.back')}><ArrowLeft size={21}/></button> : null}
        <h1 className="text-xl font-extrabold">{t(`studioCommunity.${isAll ? 'comments' : 'title'}`)}</h1>
      </header>
      {error ? <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs text-[var(--shadow-danger)]"><span>{t('studioCommunity.failed')}</span><button type="button" onClick={() => setRetry(n => n + 1)} className="flex items-center gap-1 rounded-lg border border-[var(--shadow-border)] px-3 py-2"><RefreshCw size={15}/>{t('studioCommunity.retry')}</button></div> : null}
      {!isAll ? <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div><h2 className="text-lg font-bold">{t('studioCommunity.comments')}</h2><p className="text-xs text-[var(--shadow-text-secondary)]">{t('studioCommunity.recent')}</p></div>
          <button type="button" onClick={() => navigate(`${ROOT}?view=all`)} className="rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-xs font-semibold text-[var(--shadow-accent)]">{t('studioCommunity.all')}</button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          {!loading && !items.length && !error ? <p className="px-4 py-8 text-center text-sm text-[var(--shadow-text-secondary)]">{t('studioCommunity.empty')}</p> : null}
          {items.map(comment => <button key={comment.id} type="button" onClick={() => openReel(comment.video_id)} className="flex w-full gap-3 border-b border-[var(--shadow-border)] p-3 text-left last:border-b-0 hover:bg-[var(--shadow-bg-soft)]">
            <Face src={comment.actor?.avatar_url} name={comment.actor?.name} />
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{comment.actor?.name || 'Reader'} <span className="font-normal text-[var(--shadow-text-secondary)]">{comment.actor?.username ? `@${comment.actor.username} · ` : ''}{since(comment.created_at)}</span></span><span className="mt-1 block line-clamp-2 text-sm">{comment.body}</span><span className="mt-2 flex items-center gap-1 text-xs font-medium text-[var(--shadow-accent)]"><MessageCircle size={14}/>{t('studioCommunity.reply')}{comment.reply_count ? ` · ${comment.reply_count} ${t('studioCommunity.replies')}` : ''}</span></span>
            {comment.video_thumbnail ? <img src={comment.video_thumbnail} alt="" loading="lazy" className="h-14 w-20 shrink-0 rounded-lg object-cover" /> : <Video size={22} className="shrink-0 text-[var(--shadow-text-tertiary)]"/>}
          </button>)}
        </div>
      </section> : <section className="mb-8 overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        {!loading && !items.length && !error ? <p className="px-4 py-8 text-center text-sm text-[var(--shadow-text-secondary)]">{t('studioCommunity.empty')}</p> : null}
        {items.map(comment => <button key={comment.id} type="button" onClick={() => openReel(comment.video_id)} className="flex w-full gap-3 border-b border-[var(--shadow-border)] p-3 text-left last:border-b-0 hover:bg-[var(--shadow-bg-soft)]"><Face src={comment.actor?.avatar_url} name={comment.actor?.name}/><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{comment.actor?.name || 'Reader'} <span className="font-normal text-[var(--shadow-text-secondary)]">{since(comment.created_at)}</span></span><span className="mt-1 block text-xs text-[var(--shadow-text-secondary)]">{comment.video_title}</span><span className="mt-1 block break-words text-sm">{comment.body}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--shadow-accent)]"><MessageCircle size={14}/>{t('studioCommunity.reply')}</span></span></button>)}
      </section>}
      {loading ? <p className="py-8 text-center text-sm text-[var(--shadow-text-secondary)]">{t('studioCommunity.loading')}</p> : null}
      {isAll && hasMore && !loading && !error ? <button type="button" disabled={loadingMore} onClick={() => void more()} className="mx-auto mb-7 block rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-2.5 text-sm font-semibold disabled:opacity-50">{loadingMore ? t('studioCommunity.loading') : t('studioCommunity.loadMore')}</button> : null}
      {!isAll ? <section>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-lg font-bold">{t('studioCommunity.spotlight')}</h2><p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{t('studioCommunity.spotlightSub')}</p></div><span className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--shadow-accent)]">{t('studioCommunity.thisWeek')}</span></div>
        {!loading && !data?.spotlight?.length && !error ? <p className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-9 text-center text-sm text-[var(--shadow-text-secondary)]">{t('studioCommunity.noSpotlight')}</p> : null}
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
          {(data?.spotlight || []).map(person => <article key={person.user_id} className="relative flex min-w-[40%] flex-[0_0_40%] snap-start flex-col items-center rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-2 py-5 text-center sm:min-w-[28%] sm:basis-[28%]"><span className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-lg bg-[var(--shadow-bg-soft)] px-2 text-xs font-bold text-[var(--shadow-accent)]">{person.rank === 1 ? <Crown size={17}/> : person.rank}</span><Face src={person.avatar_url} name={person.name} size="h-16 w-16"/><h3 className="mt-3 w-full truncate text-sm font-bold">{person.name}</h3><p className="w-full truncate text-xs text-[var(--shadow-text-secondary)]">{person.username ? `@${person.username}` : 'Reader'}</p><p className="mt-3 flex items-center gap-1 text-xs font-semibold"><MessageCircle size={14}/>{person.comment_count} {t('studioCommunity.count')}</p></article>)}
        </div>
        {data?.spotlight_sample_limited ? <p className="text-xs text-[var(--shadow-text-secondary)]">{t('studioCommunity.moreThanThousand')}</p> : null}
      </section> : null}
    </div>
    <ShadowStudioFooter activeTab="community" enabledTabs={['dashboard', 'content', 'analytics', 'community', 'me']} onTabChange={tab => {
      if (tab === 'dashboard') navigate('/author/reel/studio/dashboard')
      if (tab === 'content') navigate('/author/reel/studio')
    }} />
  </main>
}

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, Tag, X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPendingTags', {
  en: {
    title: 'Review tags', back: 'Back to Tags and mentions',
    intro: 'Review tags added by other readers. Approved tags are saved to your account; profile display is not available yet.',
    empty: 'No tags waiting for review.', loading: 'Loading pending tags...',
    loadError: 'Unable to load pending tags.', reviewError: 'Unable to review this tag.',
    retry: 'Try again', approve: 'Approve', reject: 'Reject',
    approved: 'Tag approved.', rejected: 'Tag rejected.',
    unavailable: 'Reader', viewPost: 'View post',
    loadMore: 'Load more', loadingMore: 'Loading more...',
    total: 'Pending', processing: 'Saving...',
  },
  km: {
    title: 'ពិនិត្យ Tags', back: 'ត្រឡប់ទៅ Tags និង Mentions',
    intro: 'ពិនិត្យ Tag ពីអ្នកអានផ្សេង។ Tag ដែលអនុម័តនឹងរក្សាទុកក្នុងគណនី ប៉ុន្តែការបង្ហាញលើ Profile មិនទាន់មានទេ។',
    empty: 'គ្មាន Tag ដែលត្រូវរង់ចាំការពិនិត្យទេ។', loading: 'កំពុងផ្ទុក Tags ដែលរង់ចាំ...',
    loadError: 'មិនអាចផ្ទុក Tags ដែលរង់ចាំបានទេ។', reviewError: 'មិនអាចពិនិត្យ Tag នេះបានទេ។',
    retry: 'ព្យាយាមម្ដងទៀត', approve: 'អនុម័ត', reject: 'បដិសេធ',
    approved: 'បានអនុម័ត Tag។', rejected: 'បានបដិសេធ Tag។',
    unavailable: 'អ្នកអាន', viewPost: 'មើល Post',
    loadMore: 'បង្ហាញបន្ថែម', loadingMore: 'កំពុងផ្ទុកបន្ថែម...',
    total: 'កំពុងរង់ចាំ', processing: 'កំពុងរក្សាទុក...',
  },
  zh: {
    title: '审核标签', back: '返回标签与提及',
    intro: '审核其他读者添加的标签。已批准的标签会保存到账号，个人主页展示功能尚未开放。',
    empty: '没有待审核的标签。', loading: '正在加载待审核标签...',
    loadError: '无法加载待审核标签。', reviewError: '无法审核此标签。',
    retry: '重试', approve: '批准', reject: '拒绝',
    approved: '标签已批准。', rejected: '标签已拒绝。',
    unavailable: '读者', viewPost: '查看帖子',
    loadMore: '加载更多', loadingMore: '正在加载更多...',
    total: '待审核', processing: '正在保存...',
  },
  ja: {
    title: 'タグの承認', back: 'タグとメンションに戻る',
    intro: '他の読者が付けたタグを確認します。承認したタグはアカウントに保存されますが、プロフィール表示はまだ対応していません。',
    empty: '承認待ちのタグはありません。', loading: '承認待ちのタグを読み込み中...',
    loadError: '承認待ちのタグを読み込めません。', reviewError: 'このタグを確認できません。',
    retry: '再試行', approve: '承認', reject: '拒否',
    approved: 'タグを承認しました。', rejected: 'タグを拒否しました。',
    unavailable: '読者', viewPost: '投稿を見る',
    loadMore: 'もっと見る', loadingMore: 'さらに読み込み中...',
    total: '承認待ち', processing: '保存中...',
  },
  ko: {
    title: '태그 검토', back: '태그 및 멘션으로 돌아가기',
    intro: '다른 독자가 추가한 태그를 검토합니다. 승인한 태그는 계정에 저장되지만 프로필 표시는 아직 지원되지 않습니다.',
    empty: '검토 대기 중인 태그가 없습니다.', loading: '대기 중인 태그를 불러오는 중...',
    loadError: '대기 중인 태그를 불러오지 못했습니다.', reviewError: '이 태그를 검토하지 못했습니다.',
    retry: '다시 시도', approve: '승인', reject: '거절',
    approved: '태그를 승인했습니다.', rejected: '태그를 거절했습니다.',
    unavailable: '독자', viewPost: '게시물 보기',
    loadMore: '더 보기', loadingMore: '더 불러오는 중...',
    total: '대기 중', processing: '저장 중...',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const API_URL = `${API_BASE_URL}/api/users/me/tags-mentions`

function readerToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

async function fetchPending(page, signal) {
  const response = await fetch(`${API_URL}/pending?page=${page}&limit=20`, {
    headers: { Authorization: `Bearer ${readerToken()}` },
    cache: 'no-store',
    signal,
  })
  if (response.status === 401) {
    const error = new Error('UNAUTHORIZED')
    error.status = 401
    throw error
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true || !Array.isArray(data.tags)) {
    throw new Error('LOAD_FAILED')
  }
  return data
}

function PendingTagCard({ item, tr, busy, onReview, onOpenPost }) {
  const user = item.tagged_by
  const name = user?.name || tr('unavailable')
  const avatar = user?.avatar_url
  const created = new Date(item.created_at)
  const date = Number.isNaN(created.getTime()) ? '' : created.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  return (
    <article className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
          {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{name}</p>
          {user?.username && <p className="truncate text-[12px] text-[var(--shadow-text-secondary)]">@{user.username}</p>}
          {date && <p className="mt-1 text-[11px] text-[var(--shadow-text-tertiary)]">{date}</p>}
        </div>
        <Tag size={18} strokeWidth={1.8} className="shrink-0 text-[var(--shadow-text-secondary)]" />
      </div>
      {item.post_id && (
        <button type="button" onClick={() => onOpenPost(item.post_id)} className="mt-3 flex w-full items-center justify-between rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-3 text-left text-[13px]">
          <span>{tr('viewPost')}</span><ChevronRight size={17} strokeWidth={1.8} />
        </button>
      )}
      <div className="mt-3 flex gap-3">
        <button type="button" disabled={busy} onClick={() => onReview(item.id, 'reject')} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--shadow-border)] px-3 text-[13px] font-semibold disabled:opacity-50">
          <X size={17} strokeWidth={1.8} />{tr('reject')}
        </button>
        <button type="button" disabled={busy} onClick={() => onReview(item.id, 'approve')} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--shadow-text-primary)] px-3 text-[13px] font-semibold text-[var(--shadow-bg-page)] disabled:opacity-50">
          <Check size={17} strokeWidth={1.8} />{tr('approve')}
        </button>
      </div>
    </article>
  )
}

export default function ReaderPendingTagsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`readerPendingTags.${key}`)
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const settingsPath = `/profile/settings/tags-mentions${fromMeSettings ? '?from=me-settings' : ''}`
  const requestRef = useRef(null)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [nextPage, setNextPage] = useState(2)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reviewing, setReviewing] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [actionError, setActionError] = useState('')
  const [success, setSuccess] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    requestRef.current = controller
    async function load() {
      if (!readerToken()) {
        navigate('/login', { replace: true })
        return
      }
      setLoading(true)
      setLoadError(false)
      setActionError('')
      try {
        const data = await fetchPending(1, controller.signal)
        if (controller.signal.aborted) return
        setItems(data.tags)
        setTotal(Number(data.total || 0))
        setHasMore(data.has_more === true)
        setNextPage(2)
      } catch (error) {
        if (controller.signal.aborted) return
        if (error.status === 401) navigate('/login', { replace: true })
        else setLoadError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [navigate, reloadKey])

  async function loadMore() {
    if (loading || loadingMore || reviewing || !hasMore) return
    setLoadingMore(true)
    setActionError('')
    try {
      const data = await fetchPending(nextPage, requestRef.current?.signal)
      setItems((old) => {
        const ids = new Set(old.map((item) => item.id))
        return [...old, ...data.tags.filter((item) => !ids.has(item.id))]
      })
      setHasMore(data.has_more === true)
      setNextPage((page) => page + 1)
      setTotal(Number(data.total || 0))
    } catch (error) {
      if (error.name === 'AbortError') return
      if (error.status === 401) navigate('/login', { replace: true })
      else setActionError('load')
    } finally {
      setLoadingMore(false)
    }
  }

  async function review(id, action) {
    if (reviewing || loading || loadingMore) return
    const token = readerToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    setReviewing(id)
    setActionError('')
    setSuccess('')
    try {
      const response = await fetch(`${API_URL}/review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ action, ids: [id] }),
      })
      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true) throw new Error('REVIEW_FAILED')
      if (data.reviewed_count === 1) setSuccess(action === 'approve' ? 'approved' : 'rejected')
      setReloadKey((value) => value + 1)
    } catch {
      setActionError('review')
    } finally {
      setReviewing('')
    }
  }

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(28px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(settingsPath)} aria-label={tr('back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-[18px] font-semibold">{tr('title')}</h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] space-y-4 px-4 pt-5">
        <p className="px-1 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{tr('intro')}</p>
        {!loading && !loadError && <p className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('total')}: {total}</p>}
        {success && <p role="status" className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px]">{tr(success)}</p>}
        {actionError && <p role="alert" className="px-1 text-[12px]">{tr(actionError === 'load' ? 'loadError' : 'reviewError')}</p>}
        {loading && <p role="status" className="px-1 text-[13px] text-[var(--shadow-text-secondary)]">{tr('loading')}</p>}
        {loadError && !loading && (
          <div role="alert" className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-[13px]">
            <p>{tr('loadError')}</p>
            <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-3 font-semibold underline">{tr('retry')}</button>
          </div>
        )}
        {!loading && !loadError && items.length === 0 && <p className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-6 text-center text-[13px] text-[var(--shadow-text-secondary)]">{tr('empty')}</p>}
        {!loading && !loadError && items.map((item) => (
          <PendingTagCard key={item.id} item={item} tr={tr} busy={Boolean(reviewing)} onReview={review} onOpenPost={(id) => navigate(`/reader/post/${encodeURIComponent(id)}`)} />
        ))}
        {!loading && !loadError && hasMore && (
          <button type="button" disabled={loadingMore || Boolean(reviewing)} onClick={loadMore} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[13px] font-semibold disabled:opacity-50">
            {loadingMore ? tr('loadingMore') : tr('loadMore')}
          </button>
        )}
        {reviewing && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('processing')}</p>}
      </div>
    </main>
  )
}

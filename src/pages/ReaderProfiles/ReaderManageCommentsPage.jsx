import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, ExternalLink, RefreshCw, X } from 'lucide-react'
import {
  PageShell,
  PageHeader,
  SurfaceCard,
  PageLoadingState,
  PageErrorState,
  PageEmptyState,
} from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerManageComments', {
  en: {
    title: 'Manage comments', subtitle: 'Review comments waiting for your approval.', back: 'Back to comment settings',
    choosePost: 'Choose a Reader post', recentLimit: 'Showing up to 30 recent posts.',
    noPosts: 'No Reader posts found', noPostsHelp: 'Publish a Reader post to start managing its comments.',
    unnamedPost: 'Untitled post', openPost: 'View post', loadPosts: 'Loading your posts...',
    loadComments: 'Loading pending comments...', noPending: 'No comments awaiting approval',
    noPendingHelp: 'New comments requiring your approval will appear here.',
    selectAll: 'Select all on this page', selected: '{{count}} selected', pending: '{{count}} awaiting approval',
    approve: 'Approve', reject: 'Reject', approveSelected: 'Approve selected', rejectSelected: 'Reject selected',
    reply: 'Reply', previous: 'Previous', next: 'Next', page: 'Page {{page}}',
    retry: 'Retry', refresh: 'Refresh', errorPosts: 'Could not load your posts.',
    errorComments: 'Could not load pending comments.', errorReview: 'Could not update comment approvals.',
    saved: 'Comments reviewed successfully.', noChanges: 'Those comments have already been reviewed.',
    confirmReject: 'Reject the selected comment(s)? They will remain hidden.',
    signIn: 'Please sign in again.', processing: 'Updating...',
  },
  km: {
    title: 'គ្រប់គ្រង Comment', subtitle: 'ពិនិត្យ Comment ដែលកំពុងរង់ចាំការអនុម័ត។', back: 'ត្រឡប់ទៅការកំណត់ Comment',
    choosePost: 'ជ្រើស Reader Post', recentLimit: 'បង្ហាញ Post ថ្មីៗអតិបរមា ៣០។',
    noPosts: 'មិនទាន់មាន Reader Post', noPostsHelp: 'បង្ហោះ Reader Post ដើម្បីគ្រប់គ្រង Comment។',
    unnamedPost: 'Post គ្មានចំណងជើង', openPost: 'មើល Post', loadPosts: 'កំពុងផ្ទុក Posts...',
    loadComments: 'កំពុងផ្ទុក Comment រង់ចាំ...', noPending: 'មិនមាន Comment រង់ចាំអនុម័ត',
    noPendingHelp: 'Comment ថ្មីដែលត្រូវអនុម័ត នឹងបង្ហាញនៅទីនេះ។',
    selectAll: 'ជ្រើសទាំងអស់ក្នុងទំព័រនេះ', selected: 'បានជ្រើស {{count}}', pending: 'កំពុងរង់ចាំ {{count}}',
    approve: 'អនុម័ត', reject: 'បដិសេធ', approveSelected: 'អនុម័តដែលបានជ្រើស', rejectSelected: 'បដិសេធដែលបានជ្រើស',
    reply: 'Reply', previous: 'មុន', next: 'បន្ទាប់', page: 'ទំព័រ {{page}}',
    retry: 'ព្យាយាមម្ដងទៀត', refresh: 'ផ្ទុកឡើងវិញ', errorPosts: 'មិនអាចផ្ទុក Posts បានទេ។',
    errorComments: 'មិនអាចផ្ទុក Comment រង់ចាំបានទេ។', errorReview: 'មិនអាចធ្វើការអនុម័ត Comment បានទេ។',
    saved: 'បានគ្រប់គ្រង Comment ជោគជ័យ។', noChanges: 'Comment ទាំងនេះត្រូវបានពិនិត្យរួចហើយ។',
    confirmReject: 'បដិសេធ Comment ដែលបានជ្រើសមែនទេ? Comment ទាំងនេះនឹងបន្តលាក់។',
    signIn: 'សូមចូលគណនីឡើងវិញ។', processing: 'កំពុងកែប្រែ...',
  },
  zh: {
    title: '管理评论', subtitle: '审核等待你批准的评论。', back: '返回评论设置',
    choosePost: '选择读者帖子', recentLimit: '最多显示最近30篇帖子。',
    noPosts: '暂无读者帖子', noPostsHelp: '发布读者帖子后即可管理评论。',
    unnamedPost: '无标题帖子', openPost: '查看帖子', loadPosts: '正在加载帖子...',
    loadComments: '正在加载待审核评论...', noPending: '没有待审核评论',
    noPendingHelp: '需要审核的新评论将显示在这里。',
    selectAll: '全选本页', selected: '已选择{{count}}条', pending: '{{count}}条待审核',
    approve: '批准', reject: '拒绝', approveSelected: '批准所选', rejectSelected: '拒绝所选',
    reply: '回复', previous: '上一页', next: '下一页', page: '第{{page}}页',
    retry: '重试', refresh: '刷新', errorPosts: '无法加载帖子。',
    errorComments: '无法加载待审核评论。', errorReview: '无法更新审核状态。',
    saved: '审核成功。', noChanges: '这些评论已经审核。',
    confirmReject: '确定拒绝所选评论吗？这些评论将继续隐藏。',
    signIn: '请重新登录。', processing: '正在更新...',
  },
  ja: {
    title: 'コメント管理', subtitle: '承認待ちのコメントを確認します。', back: 'コメント設定に戻る',
    choosePost: '読者投稿を選択', recentLimit: '最近の投稿を最大30件表示します。',
    noPosts: '投稿がありません', noPostsHelp: '投稿するとコメントを管理できます。',
    unnamedPost: '無題の投稿', openPost: '投稿を見る', loadPosts: '投稿を読み込み中...',
    loadComments: '承認待ちコメントを読み込み中...', noPending: '承認待ちのコメントはありません',
    noPendingHelp: '承認が必要な新しいコメントがここに表示されます。',
    selectAll: 'このページをすべて選択', selected: '{{count}}件を選択', pending: '{{count}}件の承認待ち',
    approve: '承認', reject: '却下', approveSelected: '選択を承認', rejectSelected: '選択を却下',
    reply: '返信', previous: '前へ', next: '次へ', page: '{{page}}ページ',
    retry: '再試行', refresh: '更新', errorPosts: '投稿を読み込めません。',
    errorComments: '承認待ちコメントを読み込めません。', errorReview: 'コメントの審査を更新できません。',
    saved: '審査が完了しました。', noChanges: 'すでに審査済みです。',
    confirmReject: '選択したコメントを却下しますか？コメントは非表示のままです。',
    signIn: '再度ログインしてください。', processing: '更新中...',
  },
  ko: {
    title: '댓글 관리', subtitle: '승인을 기다리는 댓글을 검토하세요.', back: '댓글 설정으로 돌아가기',
    choosePost: '독자 게시물 선택', recentLimit: '최근 게시물을 최대 30개 표시합니다.',
    noPosts: '게시물이 없습니다', noPostsHelp: '게시물을 작성하면 댓글을 관리할 수 있습니다.',
    unnamedPost: '제목 없는 게시물', openPost: '게시물 보기', loadPosts: '게시물을 불러오는 중...',
    loadComments: '승인 대기 댓글을 불러오는 중...', noPending: '승인 대기 댓글이 없습니다',
    noPendingHelp: '승인이 필요한 새 댓글이 여기에 표시됩니다.',
    selectAll: '현재 페이지 전체 선택', selected: '{{count}}개 선택', pending: '{{count}}개 승인 대기',
    approve: '승인', reject: '거부', approveSelected: '선택 항목 승인', rejectSelected: '선택 항목 거부',
    reply: '답글', previous: '이전', next: '다음', page: '{{page}}페이지',
    retry: '다시 시도', refresh: '새로고침', errorPosts: '게시물을 불러올 수 없습니다.',
    errorComments: '승인 대기 댓글을 불러올 수 없습니다.', errorReview: '댓글 검토를 완료하지 못했습니다.',
    saved: '댓글을 검토했습니다.', noChanges: '이미 검토한 댓글입니다.',
    confirmReject: '선택한 댓글을 거부할까요? 댓글은 계속 숨겨집니다.',
    signIn: '다시 로그인하세요.', processing: '처리 중...',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const PAGE_SIZE = 20

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function postLabel(post, fallback) {
  const text = String(post?.content || '').replace(/\s+/g, ' ').trim()
  return text ? (text.length > 72 ? `${text.slice(0, 72)}…` : text) : fallback
}

function CommentAvatar({ user }) {
  const name = String(user?.name || user?.username || 'R')
  const [invalid, setInvalid] = useState(false)
  return user?.avatar_url && !invalid ? (
    <img src={user.avatar_url} alt="" loading="lazy" onError={() => setInvalid(true)} className="h-10 w-10 rounded-full object-cover" />
  ) : (
    <span aria-hidden="true" className="app-elevated flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-semibold">{name.slice(0, 1).toUpperCase()}</span>
  )
}

export default function ReaderManageCommentsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const tr = (key, params) => t(`readerManageComments.${key}`, params)
  const search = new URLSearchParams(location.search)
  const initialPostId = search.get('postId') || ''
  const fromMeSettings = search.get('from') === 'me-settings'
  const backPath = `/profile/settings/comment-settings${fromMeSettings ? '?from=me-settings' : ''}`
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState(() => UUID_PATTERN.test(initialPostId) ? initialPostId : '')
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsError, setPostsError] = useState('')
  const [reloadPosts, setReloadPosts] = useState(0)
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentsError, setCommentsError] = useState('')
  const [reloadComments, setReloadComments] = useState(0)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    const controller = new AbortController()
    setLoadingPosts(true)
    setPostsError('')
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reader-posts/me?limit=30`, {
          headers: { Authorization: `Bearer ${token}` }, signal: controller.signal, cache: 'no-store',
        })
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !Array.isArray(data.posts)) throw new Error('posts')
        if (controller.signal.aborted) return
        const validPosts = data.posts.filter((post) => UUID_PATTERN.test(String(post?.id || '')))
        setPosts(validPosts)
        setSelectedPostId((current) => current || validPosts[0]?.id || '')
      } catch {
        if (!controller.signal.aborted) setPostsError('errorPosts')
      } finally {
        if (!controller.signal.aborted) setLoadingPosts(false)
      }
    }
    load()
    return () => controller.abort()
  }, [navigate, reloadPosts])

  useEffect(() => {
    if (!selectedPostId) {
      setComments([])
      setTotal(0)
      setHasMore(false)
      return
    }
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    const controller = new AbortController()
    setComments([])
    setSelectedIds([])
    setLoadingComments(true)
    setCommentsError('')
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reader-posts/${encodeURIComponent(selectedPostId)}/comments/pending?page=${page}&limit=${PAGE_SIZE}`, {
          headers: { Authorization: `Bearer ${token}` }, signal: controller.signal, cache: 'no-store',
        })
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !Array.isArray(data.comments)) throw new Error('comments')
        if (controller.signal.aborted) return
        if (page > 1 && data.comments.length === 0 && Number(data.total || 0) > 0) {
          setPage((current) => Math.max(1, current - 1))
          return
        }
        setComments(data.comments)
        setTotal(Number(data.total || 0))
        setHasMore(Boolean(data.has_more))
      } catch {
        if (!controller.signal.aborted) setCommentsError('errorComments')
      } finally {
        if (!controller.signal.aborted) setLoadingComments(false)
      }
    }
    load()
    return () => controller.abort()
  }, [selectedPostId, page, reloadComments, navigate])

  const allSelected = useMemo(() => comments.length > 0 && comments.every((item) => selectedIds.includes(item.id)), [comments, selectedIds])
  const disabled = saving || loadingComments

  function changePost(id) {
    if (!UUID_PATTERN.test(id) || saving) return
    setSelectedPostId(id)
    setPage(1)
    setNotice('')
    setActionError('')
    const params = new URLSearchParams(location.search)
    params.set('postId', id)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  function toggleSelection(id) {
    if (disabled) return
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  }

  async function review(action, ids) {
    if (!selectedPostId || disabled || !ids.length) return
    if (action === 'reject' && !window.confirm(tr('confirmReject'))) return
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    setSaving(true)
    setActionError('')
    setNotice('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/reader-posts/${encodeURIComponent(selectedPostId)}/comments/review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: [...new Set(ids)].slice(0, 30) }),
        cache: 'no-store',
      })
      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true) throw new Error('review')
      setSelectedIds([])
      setNotice(Number(data.reviewed_count || 0) > 0 ? 'saved' : 'noChanges')
      setReloadComments((current) => current + 1)
    } catch {
      setActionError('errorReview')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell className="pb-[calc(40px+env(safe-area-inset-bottom))]">
      <PageHeader title={tr('title')} subtitle={tr('subtitle')} onBack={() => navigate(backPath)} backLabel={tr('back')}
        right={<button type="button" title={tr('refresh')} aria-label={tr('refresh')} disabled={disabled} onClick={() => { setReloadPosts((v) => v + 1); setReloadComments((v) => v + 1) }} className="flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-40 active:bg-[var(--shadow-bg-hover)]"><RefreshCw size={19} strokeWidth={1.8} /></button>} />
      <main className="mx-auto max-w-[760px] space-y-4 px-4 pt-5">
        <SurfaceCard className="space-y-3 p-4">
          <label htmlFor="reader-manage-comments-post" className="app-title block text-[14px] font-semibold">{tr('choosePost')}</label>
          {loadingPosts ? <p className="app-muted text-[12px]">{tr('loadPosts')}</p> : null}
          {!loadingPosts && postsError ? <PageErrorState title={tr(postsError)} actionLabel={tr('retry')} onAction={() => setReloadPosts((v) => v + 1)} /> : null}
          {posts.length || selectedPostId ? (
            <select id="reader-manage-comments-post" className="app-input w-full rounded-[12px] border px-3 py-3 text-[13px] outline-none focus:border-[var(--shadow-border-strong)]" value={selectedPostId} onChange={(event) => changePost(event.target.value)} disabled={saving}>
              {selectedPostId && !posts.some((post) => post.id === selectedPostId) ? <option value={selectedPostId}>{selectedPostId.slice(0, 8)}</option> : null}
              {posts.map((post) => <option key={post.id} value={post.id}>{postLabel(post, tr('unnamedPost'))}</option>)}
            </select>
          ) : null}
          <p className="app-muted text-[12px]">{tr('recentLimit')}</p>
          {selectedPostId ? (
            <button type="button" className="app-muted flex items-center gap-2 text-[12px] font-semibold underline" onClick={() => navigate(`/reader/post/${encodeURIComponent(selectedPostId)}`)}>
              {tr('openPost')} <ExternalLink size={13} />
            </button>
          ) : null}
        </SurfaceCard>

        {!loadingPosts && !postsError && !selectedPostId ? <PageEmptyState title={tr('noPosts')} body={tr('noPostsHelp')} /> : null}
        {selectedPostId ? (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <h2 className="app-title text-[15px] font-semibold">{tr('pending', { count: total })}</h2>
              {comments.length > 0 ? (
                <label className="app-muted flex cursor-pointer items-center gap-2 text-[12px]">
                  <input type="checkbox" className="h-4 w-4" disabled={disabled} checked={allSelected} onChange={() => setSelectedIds(allSelected ? [] : comments.map((item) => item.id))} />
                  {tr('selectAll')}
                </label>
              ) : null}
            </div>
            {selectedIds.length > 0 ? (
              <SurfaceCard className="flex flex-wrap items-center gap-2 p-3">
                <span className="app-muted mr-auto text-[12px]">{tr('selected', { count: selectedIds.length })}</span>
                <button type="button" disabled={disabled} onClick={() => review('approve', selectedIds)} className="rounded-full bg-[var(--shadow-text-primary)] px-3 py-2 text-[12px] font-semibold text-[var(--shadow-bg-surface)] disabled:opacity-50">{tr('approveSelected')}</button>
                <button type="button" disabled={disabled} onClick={() => review('reject', selectedIds)} className="rounded-full border border-[var(--shadow-border-strong)] px-3 py-2 text-[12px] font-semibold text-[var(--shadow-danger)] disabled:opacity-50">{tr('rejectSelected')}</button>
              </SurfaceCard>
            ) : null}
            {actionError ? <p role="alert" className="text-[12px] text-[var(--shadow-danger)]">{tr(actionError)}</p> : null}
            {notice ? <p role="status" className="app-muted text-[12px]">{tr(notice)}</p> : null}
            {saving ? <p role="status" className="app-muted text-[12px]">{tr('processing')}</p> : null}
            {loadingComments ? <PageLoadingState rows={3} label={tr('loadComments')} /> : null}
            {!loadingComments && commentsError ? <PageErrorState title={tr(commentsError)} actionLabel={tr('retry')} onAction={() => setReloadComments((v) => v + 1)} /> : null}
            {!loadingComments && !commentsError && !comments.length ? <PageEmptyState title={tr('noPending')} body={tr('noPendingHelp')} /> : null}
            {!loadingComments && !commentsError && comments.map((comment) => {
              const user = Array.isArray(comment.user) ? comment.user[0] : comment.user
              const name = user?.name || user?.username || 'Reader'
              return (
                <SurfaceCard key={comment.id} as="article" className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" aria-label={tr('selectAll')} checked={selectedIds.includes(comment.id)} disabled={disabled} onChange={() => toggleSelection(comment.id)} className="mt-3 h-4 w-4 shrink-0" />
                    <CommentAvatar user={user} />
                    <div className="min-w-0 flex-1">
                      <p className="app-title truncate text-[13px] font-semibold">{name}</p>
                      {user?.username ? <p className="app-muted truncate text-[11px]">@{user.username}</p> : null}
                      <p className="app-muted mt-1 text-[11px]">{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</p>
                    </div>
                    {comment.parent_id ? <span className="app-muted rounded-full border border-[var(--shadow-border)] px-2 py-1 text-[11px]">{tr('reply')}</span> : null}
                  </div>
                  <p className="app-title whitespace-pre-wrap break-words text-[13px] leading-6">{comment.text}</p>
                  <div className="flex justify-end gap-2 border-t border-[var(--shadow-border)] pt-3">
                    <button type="button" disabled={disabled} onClick={() => review('reject', [comment.id])} className="flex items-center gap-1 rounded-full border border-[var(--shadow-border-strong)] px-4 py-2 text-[12px] font-semibold text-[var(--shadow-danger)] disabled:opacity-50"><X size={15} />{tr('reject')}</button>
                    <button type="button" disabled={disabled} onClick={() => review('approve', [comment.id])} className="flex items-center gap-1 rounded-full bg-[var(--shadow-text-primary)] px-4 py-2 text-[12px] font-semibold text-[var(--shadow-bg-surface)] disabled:opacity-50"><Check size={15} />{tr('approve')}</button>
                  </div>
                </SurfaceCard>
              )
            })}
            {!loadingComments && !commentsError && (page > 1 || hasMore) ? (
              <nav className="flex items-center justify-between gap-3 pt-2" aria-label={tr('page', { page })}>
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={disabled || page <= 1} className="app-card rounded-full border px-4 py-2 text-[12px] font-semibold disabled:opacity-40">{tr('previous')}</button>
                <span className="app-muted text-[12px]">{tr('page', { page })}</span>
                <button type="button" onClick={() => setPage((current) => current + 1)} disabled={disabled || !hasMore} className="app-card rounded-full border px-4 py-2 text-[12px] font-semibold disabled:opacity-40">{tr('next')}</button>
              </nav>
            ) : null}
          </section>
        ) : null}
      </main>
    </PageShell>
  )
}

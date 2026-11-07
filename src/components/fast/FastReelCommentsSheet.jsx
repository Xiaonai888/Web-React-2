import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Heart, Loader2, MessageCircle, X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

// Only Fast comments are rendered; unlike the Story component, there is no
// Story Like / Comment / Echo header. The Reel remains the sole target.
registerTranslationNamespace('fastReelComments', {
  en: {
    title: 'Comments', empty: 'No comments yet. Be the first!', write: 'Write a comment...',
    reply: 'Reply', replyTo: 'Replying to', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
    update: 'Update', send: 'Send', loadMore: 'Load more comments', viewReplies: 'View replies',
    hideReplies: 'Hide replies', loadReplies: 'Load more replies', deleted: 'Comment deleted',
    login: 'Sign in to comment', failed: 'Unable to load comments', retry: 'Try again',
    saveFailed: 'Could not save comment', deleteConfirm: 'Delete this comment?',
    close: 'Close comments', justNow: 'Just now', edited: 'Edited',
  },
  km: {
    title: 'មតិយោបល់', empty: 'មិនទាន់មានមតិយោបល់ទេ។ ចាប់ផ្តើមមុនគេ!', write: 'សរសេរមតិយោបល់...',
    reply: 'ឆ្លើយតប', replyTo: 'ឆ្លើយតបទៅ', cancel: 'បោះបង់', edit: 'កែប្រែ', delete: 'លុប',
    update: 'រក្សាការកែ', send: 'ផ្ញើ', loadMore: 'មើលមតិបន្ថែម', viewReplies: 'មើលការឆ្លើយតប',
    hideReplies: 'លាក់ការឆ្លើយតប', loadReplies: 'មើលការឆ្លើយតបបន្ថែម', deleted: 'មតិយោបល់ត្រូវបានលុប',
    login: 'សូមចូលគណនីដើម្បីបញ្ចេញមតិ', failed: 'មិនអាចផ្ទុកមតិយោបល់បាន', retry: 'សាកម្ដងទៀត',
    saveFailed: 'មិនអាចរក្សាមតិយោបល់បាន', deleteConfirm: 'លុបមតិយោបល់នេះមែនទេ?',
    close: 'បិទមតិយោបល់', justNow: 'ទើបតែ', edited: 'បានកែ',
  },
  zh: {
    title: '评论', empty: '暂无评论，来发表第一条！', write: '写评论...', reply: '回复', replyTo: '回复',
    cancel: '取消', edit: '编辑', delete: '删除', update: '保存', send: '发送', loadMore: '加载更多评论',
    viewReplies: '查看回复', hideReplies: '收起回复', loadReplies: '加载更多回复', deleted: '评论已删除',
    login: '登录后评论', failed: '无法加载评论', retry: '重试', saveFailed: '无法保存评论',
    deleteConfirm: '删除这条评论？', close: '关闭评论', justNow: '刚刚', edited: '已编辑',
  },
  ja: {
    title: 'コメント', empty: 'まだコメントがありません。', write: 'コメントを書く...', reply: '返信', replyTo: '返信先',
    cancel: 'キャンセル', edit: '編集', delete: '削除', update: '保存', send: '送信', loadMore: 'さらに表示',
    viewReplies: '返信を見る', hideReplies: '返信を隠す', loadReplies: '返信をさらに表示', deleted: 'コメントは削除されました',
    login: 'ログインしてコメント', failed: 'コメントを読み込めません', retry: '再試行', saveFailed: '保存できませんでした',
    deleteConfirm: 'このコメントを削除しますか？', close: 'コメントを閉じる', justNow: 'たった今', edited: '編集済み',
  },
  ko: {
    title: '댓글', empty: '첫 댓글을 남겨보세요!', write: '댓글 작성...', reply: '답글', replyTo: '답글 대상',
    cancel: '취소', edit: '수정', delete: '삭제', update: '저장', send: '보내기', loadMore: '댓글 더 보기',
    viewReplies: '답글 보기', hideReplies: '답글 숨기기', loadReplies: '답글 더 보기', deleted: '삭제된 댓글',
    login: '로그인 후 댓글 작성', failed: '댓글을 불러올 수 없음', retry: '다시 시도', saveFailed: '댓글 저장 실패',
    deleteConfirm: '댓글을 삭제할까요?', close: '댓글 닫기', justNow: '방금', edited: '수정됨',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const PAGE_SIZE = 20

function getToken() {
  try { return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || '' }
  catch { return '' }
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options, headers, cache: 'no-store',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true) {
    const error = new Error(data.message || 'Unable to load comments')
    error.status = response.status
    throw error
  }
  return data
}

function mergeUnique(previous, next) {
  const ids = new Set(previous.map(item => item.id))
  return [...previous, ...next.filter(item => !ids.has(item.id))]
}

function age(value, fallback) {
  const time = new Date(value).getTime()
  if (!Number.isFinite(time)) return fallback
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000))
  if (seconds < 60) return fallback
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return new Date(value).toLocaleDateString()
}

export default function FastReelCommentsSheet({ video, onClose, onAuthRequired, onCountChange }) {
  const { t } = useDisplayTranslation()
  const videoId = video?.id || ''
  const [rows, setRows] = useState([])
  const [nextOffset, setNextOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [replyGroups, setReplyGroups] = useState({})
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editBody, setEditBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [likingId, setLikingId] = useState('')
  const [formError, setFormError] = useState('')
  const inputRef = useRef(null)
  const mounted = useRef(true)

    // Drag down to close Comment Sheet
  const dragStartRef = useRef(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = event => {
    if (event.button !== undefined && event.button !== 0) return
    if (event.target.closest('button')) return

    dragStartRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
    }

    setIsDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = event => {
    const start = dragStartRef.current
    if (!start || start.pointerId !== event.pointerId) return

    setDragOffset(Math.max(0, event.clientY - start.startY))
  }

  const handleDragEnd = event => {
    const start = dragStartRef.current
    if (!start || start.pointerId !== event.pointerId) return

    const distance = Math.max(0, event.clientY - start.startY)

    dragStartRef.current = null
    setIsDragging(false)

    if (distance > 90) {
      onClose?.()
      return
    }

    setDragOffset(0)
  }

  const handleDragCancel = () => {
    dragStartRef.current = null
    setIsDragging(false)
    setDragOffset(0)
  }

  const apiBase = `/api/fast/videos/${encodeURIComponent(videoId)}/comments`
  const setCount = useCallback(count => {
    const n = Math.max(0, Number(count || 0))
    setTotal(n)
    onCountChange?.(videoId, n)
  }, [videoId, onCountChange])

  const loadRoots = useCallback(async (append = false, signal) => {
    const offset = append ? nextOffset : 0
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) })
    const data = await request(`${apiBase}?${params}`, { signal })
    if (!mounted.current) return
    setRows(current => append ? mergeUnique(current, data.comments || []) : (data.comments || []))
    setNextOffset(data.pagination?.next_offset || 0)
    setHasMore(Boolean(data.pagination?.has_more))
    setCount(data.comment_count)
  }, [apiBase, nextOffset, setCount])

  useEffect(() => {
    mounted.current = true
    const controller = new AbortController()
    setLoading(true)
    setError('')
    loadRoots(false, controller.signal)
      .catch(err => { if (!controller.signal.aborted) setError(err.message || t('fastReelComments.failed')) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => { mounted.current = false; controller.abort() }
    // Run once per Reel; pagination updates must not retrigger initial loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const getReplies = async (rootId, append = false) => {
    const group = replyGroups[rootId]
    const offset = append ? group?.nextOffset || 0 : 0
    setReplyGroups(prev => ({ ...prev, [rootId]: { ...prev[rootId], loading: true, open: true, error: '' } }))
    try {
      const qs = new URLSearchParams({ parent_id: rootId, limit: String(PAGE_SIZE), offset: String(offset) })
      const data = await request(`${apiBase}?${qs}`)
      if (!mounted.current) return
      setReplyGroups(prev => ({ ...prev, [rootId]: {
        ...prev[rootId], loading: false, open: true, error: '',
        rows: append ? mergeUnique(prev[rootId]?.rows || [], data.comments || []) : (data.comments || []),
        hasMore: Boolean(data.pagination?.has_more), nextOffset: data.pagination?.next_offset || 0,
      } }))
      setCount(data.comment_count)
    } catch (err) {
      setReplyGroups(prev => ({ ...prev, [rootId]: { ...prev[rootId], loading: false, error: err.message } }))
    }
  }

  const loadMoreRoots = async () => {
    if (loadingMore) return
    setLoadingMore(true)
    try { await loadRoots(true) }
    catch (err) { setError(err.message) }
    finally { setLoadingMore(false) }
  }

  const requireLogin = () => {
    if (getToken()) return true
    onAuthRequired?.()
    return false
  }

  const refreshAfterChange = async (parentId = null) => {
    await loadRoots(false)
    if (parentId) await getReplies(parentId, false)
  }

  const submitComment = async () => {
    const body = draft.trim()
    if (!body || busy || body.length > 1000 || !requireLogin()) return
    setBusy(true); setFormError('')
    const parentId = replyTo?.parent_id || replyTo?.id || null
    try {
      const data = await request(apiBase, { method: 'POST', body: { body, parent_id: parentId } })
      setDraft(''); setReplyTo(null)
      setCount(data.comment_count)
      await refreshAfterChange(parentId)
    } catch (err) {
      if (err.status === 401 || err.status === 403) onAuthRequired?.()
      else setFormError(err.message || t('fastReelComments.saveFailed'))
    } finally { setBusy(false) }
  }

  const saveEdit = async () => {
    if (!editing || !editBody.trim() || busy || !requireLogin()) return
    setBusy(true); setFormError('')
    try {
      const data = await request(`${apiBase}/${encodeURIComponent(editing.id)}`, {
        method: 'PATCH', body: { body: editBody.trim() },
      })
      const patch = items => items.map(item => item.id === editing.id ? data.comment : item)
      setRows(patch)
      setReplyGroups(prev => Object.fromEntries(Object.entries(prev).map(([id, group]) =>
        [id, { ...group, rows: patch(group.rows || []) }])))
      setEditing(null); setEditBody('')
    } catch (err) { setFormError(err.message || t('fastReelComments.saveFailed')) }
    finally { setBusy(false) }
  }

  const removeComment = async comment => {
    if (!comment.can_edit || busy || !window.confirm(t('fastReelComments.deleteConfirm'))) return
    setBusy(true); setFormError('')
    try {
      const data = await request(`${apiBase}/${encodeURIComponent(comment.id)}`, { method: 'DELETE' })
      setCount(data.comment_count)
      await refreshAfterChange(comment.parent_id)
    } catch (err) { setFormError(err.message || t('fastReelComments.saveFailed')) }
    finally { setBusy(false) }
  }

  const toggleLike = async comment => {
    if (comment.is_deleted || likingId || !requireLogin()) return
    setLikingId(comment.id); setFormError('')
    try {
      const data = await request(`${apiBase}/${encodeURIComponent(comment.id)}/like`, {
        method: 'PUT', body: { liked: !comment.liked },
      })
      const patch = items => items.map(item => item.id === comment.id ? data.comment : item)
      setRows(patch)
      setReplyGroups(prev => Object.fromEntries(Object.entries(prev).map(([id, group]) =>
        [id, { ...group, rows: patch(group.rows || []) }])))
    } catch (err) { setFormError(err.message || t('fastReelComments.saveFailed')) }
    finally { setLikingId('') }
  }

  const commentCard = (comment, rootId = null) => (
    <div key={comment.id} className="flex gap-2.5 py-3">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
        {comment.user?.avatar_url ? <img src={comment.user.avatar_url} alt="" loading="lazy" className="h-full w-full object-cover" />
          : <div className="flex h-full items-center justify-center text-[13px] font-bold text-gray-600 dark:text-white/70">{(comment.user?.name || 'R').slice(0, 1).toUpperCase()}</div>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[12px] font-bold text-gray-900 dark:text-white">{comment.user?.name || t('fastReelComments.deleted')}</span>
          <span className="text-[10px] text-gray-500 dark:text-white/50">{age(comment.created_at, t('fastReelComments.justNow'))}</span>
          {comment.updated_at && new Date(comment.updated_at).getTime() - new Date(comment.created_at).getTime() > 5000
            ? <span className="text-[10px] text-gray-400">{t('fastReelComments.edited')}</span> : null}
        </div>
        {editing?.id === comment.id ? (
          <div className="mt-1.5">
            <textarea value={editBody} onChange={e => setEditBody(e.target.value)} maxLength={1000}
              rows={2} className="w-full resize-none rounded-xl border border-gray-300 bg-white p-2 text-[13px] text-gray-900 dark:border-white/20 dark:bg-[#202329] dark:text-white" />
            <div className="mt-1 flex gap-3 text-xs">
              <button type="button" onClick={saveEdit} disabled={busy || !editBody.trim()} className="font-bold text-blue-600 disabled:opacity-50">{t('fastReelComments.update')}</button>
              <button type="button" onClick={() => setEditing(null)} className="text-gray-500">{t('fastReelComments.cancel')}</button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-5 text-gray-800 dark:text-white/85">{comment.is_deleted ? t('fastReelComments.deleted') : comment.body}</p>
        )}
        {!comment.is_deleted && !editing && (
          <div className="mt-2 flex flex-wrap gap-4 text-[11px] font-semibold text-gray-500 dark:text-white/60">
            <button type="button" onClick={() => { setReplyTo(rootId ? { id: rootId, name: comment.user?.name } : { id: comment.id, name: comment.user?.name }); inputRef.current?.focus() }}>
              {t('fastReelComments.reply')}
            </button>
            {comment.can_edit && <>
              <button type="button" onClick={() => { setEditing(comment); setEditBody(comment.body) }}>{t('fastReelComments.edit')}</button>
              <button type="button" onClick={() => removeComment(comment)}>{t('fastReelComments.delete')}</button>
            </>}
          </div>
        )}
        {!rootId && comment.reply_count > 0 && (
          <div className="mt-2">
            <button type="button" onClick={() => {
              if (replyGroups[comment.id]?.open) setReplyGroups(prev => ({ ...prev, [comment.id]: { ...prev[comment.id], open: false } }))
              else getReplies(comment.id)
            }} className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <MessageCircle size={12} /> {replyGroups[comment.id]?.open ? t('fastReelComments.hideReplies') : `${t('fastReelComments.viewReplies')} (${comment.reply_count})`}
              <ChevronDown size={13} className={replyGroups[comment.id]?.open ? 'rotate-180' : ''} />
            </button>
            {replyGroups[comment.id]?.open && (
              <div className="mt-2 border-l-2 border-gray-100 pl-3 dark:border-white/10">
                {(replyGroups[comment.id]?.rows || []).map(reply => commentCard(reply, comment.id))}
                {replyGroups[comment.id]?.error && <p className="text-xs text-red-500">{replyGroups[comment.id].error}</p>}
                {replyGroups[comment.id]?.loading && <Loader2 size={16} className="animate-spin" />}
                {replyGroups[comment.id]?.hasMore && !replyGroups[comment.id]?.loading && (
                  <button type="button" onClick={() => getReplies(comment.id, true)} className="py-2 text-xs font-semibold text-blue-600">
                    {t('fastReelComments.loadReplies')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <button type="button" aria-label="Like comment" onClick={() => toggleLike(comment)} disabled={comment.is_deleted || Boolean(likingId)}
        className={`flex h-10 w-8 shrink-0 flex-col items-center justify-center gap-0.5 text-[10px] ${comment.liked ? 'text-red-500' : 'text-gray-500 dark:text-white/60'} disabled:opacity-50`}>
        <Heart size={17} fill={comment.liked ? 'currentColor' : 'none'} />
        {comment.likes ? <span>{comment.likes}</span> : null}
      </button>
    </div>
  )

  return createPortal(
    <div className="fixed inset-0 z-[200002] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={t('fastReelComments.title')}>
      <button type="button" aria-label={t('fastReelComments.close')} onClick={onClose} className="absolute inset-0 bg-black/55" />
            <section
        className="relative z-10 flex w-full max-w-[560px] flex-col overflow-hidden rounded-t-[24px] bg-white text-gray-900 shadow-2xl dark:bg-[#15171b] dark:text-white"
        style={{
          height: '68dvh',
          maxHeight: '760px',
          minHeight: 'min(340px, 85dvh)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          className="shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragCancel}
        >
          <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-gray-300 dark:bg-white/20" />

          <header className="flex h-14 items-center justify-center border-b border-gray-100 px-4 dark:border-white/10">
            <h2 className="text-[14px] font-bold">
              {t('fastReelComments.title')} ({total.toLocaleString()})
            </h2>

            <button
              type="button"
              aria-label={t('fastReelComments.close')}
              onClick={onClose}
              className="absolute right-3 top-4 rounded-full p-2"
            >
              <X size={20} />
            </button>
          </header>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
          {loading ? <div className="flex justify-center py-14"><Loader2 className="animate-spin" size={24}/></div>
            : error ? <div className="py-12 text-center text-sm text-red-500">{error}<button type="button" onClick={() => { setLoading(true); loadRoots(false).then(() => setError('')).catch(e => setError(e.message)).finally(() => setLoading(false)) }} className="ml-3 font-bold">{t('fastReelComments.retry')}</button></div>
            : rows.length ? <>
              {rows.map(comment => commentCard(comment))}
              {hasMore && <button type="button" onClick={loadMoreRoots} disabled={loadingMore} className="mb-5 w-full rounded-xl bg-gray-100 py-3 text-xs font-bold disabled:opacity-50 dark:bg-white/10">
                {loadingMore ? '...' : t('fastReelComments.loadMore')}
              </button>}
            </> : <p className="py-14 text-center text-[13px] text-gray-500 dark:text-white/60">{t('fastReelComments.empty')}</p>}
        </div>
        <footer className="shrink-0 border-t border-gray-100 px-3 pb-3 pt-2 dark:border-white/10">
          {replyTo && <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <span>{t('fastReelComments.replyTo')}: {replyTo.name || 'Reader'}</span>
            <button type="button" onClick={() => setReplyTo(null)}><X size={14}/></button>
          </div>}
          {formError && <p role="alert" className="mb-1.5 text-[11px] text-red-500">{formError}</p>}
          <div className="flex items-end gap-2">
            <textarea ref={inputRef} rows={1} maxLength={1000} value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() } }}
              placeholder={t('fastReelComments.write')} className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-[#26292f] dark:text-white" />
            <button
  type="button"
  onClick={submitComment}
  disabled={busy || !draft.trim()}
  aria-label={t('fastReelComments.send')}
  className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
>
  <i
    className={`fa-solid ${
      busy
        ? 'fa-spinner animate-spin'
        : 'fa-paper-plane'
    } text-[13px]`}
  />
</button>
          </div>
        </footer>
      </section>
    </div>, document.body,
  )
}

import { useEffect, useRef, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorPagePhotoViewer', {
  en: {
    close: 'Close photo',
    options: 'Photo options',
    position: '1 of 1',
    cover: 'Cover photo',
    profile: 'Profile photo',
    share: 'Share',
    copyLink: 'Copy photo link',
    openOriginal: 'Open original photo',
    linkCopied: 'Link copied',
    shareFailed: 'Unable to share photo',
    copyFailed: 'Unable to copy link',
    like: 'Like', comment: 'Comment', comments: 'Comments', reply: 'Reply', replies: 'Replies', viewReplies: 'View replies', hideReplies: 'Hide replies', writeComment: 'Write a comment...', send: 'Send', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', login: 'Please log in to continue.', failedLoad: 'Could not load photo activity.', failedComments: 'Could not load comments.', failedSave: 'Could not save your comment.', confirmDelete: 'Delete this comment?', noComments: 'No comments yet.', moreComments: 'Load more comments', tooLong: 'Maximum 1000 characters.', chooseReaction: 'Choose reaction', reactionLove: 'Love', reactionHaha: 'Haha', reactionWow: 'Wow', reactionSad: 'Sad', reactionAngry: 'Angry', reactionSupport: 'Support', reactionTouched: 'Touched', loading: 'Loading...', tryAgain: 'Try again', photoChanged: 'The photo has changed. Reopen it to continue.',

  },
  km: {
    close: 'បិទរូបភាព',
    options: 'ជម្រើសរូបភាព',
    position: '១ ក្នុង ១',
    cover: 'រូប Cover',
    profile: 'រូប Profile',
    share: 'ចែករំលែក',
    copyLink: 'ចម្លងតំណរូបភាព',
    openOriginal: 'បើករូបដើម',
    linkCopied: 'បានចម្លងតំណ',
    shareFailed: 'មិនអាចចែករំលែករូបបានទេ',
    copyFailed: 'មិនអាចចម្លងតំណបានទេ',
    like: 'ចូលចិត្ត', comment: 'មតិយោបល់', comments: 'មតិយោបល់', reply: 'ឆ្លើយតប', replies: 'ការឆ្លើយតប', viewReplies: 'មើលការឆ្លើយតប', hideReplies: 'លាក់ការឆ្លើយតប', writeComment: 'សរសេរមតិ...', send: 'ផ្ញើ', edit: 'កែ', delete: 'លុប', save: 'រក្សាទុក', cancel: 'បោះបង់', login: 'សូមចូលគណនីជាមុន។', failedLoad: 'មិនអាចផ្ទុកសកម្មភាពរូបភាពបានទេ។', failedComments: 'មិនអាចផ្ទុកមតិយោបល់បានទេ។', failedSave: 'មិនអាចរក្សាទុកមតិយោបល់បានទេ។', confirmDelete: 'លុបមតិយោបល់នេះមែនទេ?', noComments: 'មិនទាន់មានមតិយោបល់ទេ។', moreComments: 'ផ្ទុកមតិយោបល់បន្ថែម', tooLong: 'អតិបរមា ១០០០ តួអក្សរ។', chooseReaction: 'ជ្រើស Reaction', reactionLove: 'ចូលចិត្ត', reactionHaha: 'សើច', reactionWow: 'ភ្ញាក់ផ្អើល', reactionSad: 'កើតទុក្ខ', reactionAngry: 'ខឹង', reactionSupport: 'គាំទ្រ', reactionTouched: 'រំភើប', loading: 'កំពុងផ្ទុក...', tryAgain: 'ព្យាយាមម្តងទៀត', photoChanged: 'រូបភាពត្រូវបានប្តូរ។ សូមបើករូបម្តងទៀត។',

  },
  zh: {
    close: '关闭照片',
    options: '照片选项',
    position: '1 / 1',
    cover: '封面照片',
    profile: '头像',
    share: '分享',
    copyLink: '复制照片链接',
    openOriginal: '打开原始照片',
    linkCopied: '链接已复制',
    shareFailed: '无法分享照片',
    copyFailed: '无法复制链接',
    like: '喜欢', comment: '评论', comments: '评论', reply: '回复', replies: '回复', viewReplies: '查看回复', hideReplies: '隐藏回复', writeComment: '写评论...', send: '发送', edit: '编辑', delete: '删除', save: '保存', cancel: '取消', login: '请先登录。', failedLoad: '无法加载照片互动。', failedComments: '无法加载评论。', failedSave: '无法保存评论。', confirmDelete: '删除这条评论？', noComments: '暂无评论。', moreComments: '加载更多评论', tooLong: '最多1000个字符。', chooseReaction: '选择表情', reactionLove: '喜欢', reactionHaha: '哈哈', reactionWow: '惊讶', reactionSad: '难过', reactionAngry: '生气', reactionSupport: '支持', reactionTouched: '感动', loading: '加载中...', tryAgain: '重试', photoChanged: '照片已更换。请重新打开。',

  },
  ja: {
    close: '写真を閉じる',
    options: '写真のオプション',
    position: '1 / 1',
    cover: 'カバー写真',
    profile: 'プロフィール写真',
    share: '共有',
    copyLink: '写真のリンクをコピー',
    openOriginal: '元の写真を開く',
    linkCopied: 'リンクをコピーしました',
    shareFailed: '写真を共有できません',
    copyFailed: 'リンクをコピーできません',
    like: 'いいね', comment: 'コメント', comments: 'コメント', reply: '返信', replies: '返信', viewReplies: '返信を見る', hideReplies: '返信を隠す', writeComment: 'コメントを書く...', send: '送信', edit: '編集', delete: '削除', save: '保存', cancel: 'キャンセル', login: '先にログインしてください。', failedLoad: '写真の反応を読み込めません。', failedComments: 'コメントを読み込めません。', failedSave: 'コメントを保存できません。', confirmDelete: 'このコメントを削除しますか？', noComments: 'まだコメントはありません。', moreComments: 'コメントをさらに表示', tooLong: '最大1000文字。', chooseReaction: 'リアクションを選択', reactionLove: 'いいね', reactionHaha: '笑い', reactionWow: '驚き', reactionSad: '悲しい', reactionAngry: '怒り', reactionSupport: '応援', reactionTouched: '感動', loading: '読み込み中...', tryAgain: '再試行', photoChanged: '写真が変更されました。再度開いてください。',

  },
  ko: {
    close: '사진 닫기',
    options: '사진 옵션',
    position: '1 / 1',
    cover: '커버 사진',
    profile: '프로필 사진',
    share: '공유',
    copyLink: '사진 링크 복사',
    openOriginal: '원본 사진 열기',
    linkCopied: '링크를 복사했습니다',
    shareFailed: '사진을 공유할 수 없습니다',
    copyFailed: '링크를 복사할 수 없습니다',
    like: '좋아요', comment: '댓글', comments: '댓글', reply: '답글', replies: '답글', viewReplies: '답글 보기', hideReplies: '답글 숨기기', writeComment: '댓글 쓰기...', send: '보내기', edit: '수정', delete: '삭제', save: '저장', cancel: '취소', login: '먼저 로그인해주세요.', failedLoad: '사진 반응을 불러올 수 없습니다.', failedComments: '댓글을 불러올 수 없습니다.', failedSave: '댓글을 저장할 수 없습니다.', confirmDelete: '이 댓글을 삭제할까요?', noComments: '아직 댓글이 없습니다.', moreComments: '댓글 더 보기', tooLong: '최대 1000자입니다.', chooseReaction: '반응 선택', reactionLove: '좋아요', reactionHaha: '웃김', reactionWow: '놀람', reactionSad: '슬픔', reactionAngry: '화남', reactionSupport: '응원', reactionTouched: '감동', loading: '불러오는 중...', tryAgain: '다시 시도', photoChanged: '사진이 변경되었습니다. 다시 열어주세요.',

  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const REACTIONS = [
  ['love', '❤️'],
  ['haha', '😆'],
  ['wow', '😮'],
  ['sad', '😢'],
  ['angry', '😡'],
  ['support', '🤗'],
  ['touched', '🥹'],
]

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getReaderId() {
  try {
    const raw = localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null'
    const reader = JSON.parse(raw)
    return String(reader?.id || reader?.user_id || '')
  } catch {
    return ''
  }
}

async function photoRequest(path, { method = 'GET', body, signal } = {}) {
  const token = getReaderToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(signal ? { signal } : {}),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    const error = new Error(data.message || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return data
}

function formatCommentDate(value) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    dateStyle: 'medium', timeStyle: 'short',
  }).format(date)
}

export default function AuthorPagePhotoViewer({
  open = false,
  src = '',
  kind = 'cover',
  authorName = '',
  avatarUrl = '',
  pageUsername = '',
  onClose,
}) {
  const { t } = useDisplayTranslation()
  const [controlsVisible, setControlsVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const label = kind === 'profile' ? t('authorPagePhotoViewer.profile') : t('authorPagePhotoViewer.cover')
  const [summary, setSummary] = useState({ photo_key: '', reaction_count: 0, comment_count: 0, my_reaction: null })
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [reactionBusy, setReactionBusy] = useState(false)
  const [reactionsOpen, setReactionsOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [commentsHasMore, setCommentsHasMore] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [replies, setReplies] = useState({})
  const [repliesOpen, setRepliesOpen] = useState({})
  const [replyTo, setReplyTo] = useState(null)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editDraft, setEditDraft] = useState('')
  const [commentBusy, setCommentBusy] = useState(false)
  const [commentError, setCommentError] = useState('')
  const inputRef = useRef(null)
  const resolvedUsername = String(pageUsername || window.location.pathname.match(/^\/author\/page\/([a-z0-9_]+)/i)?.[1] || '').trim().replace(/^@+/, '').toLowerCase()
  const photoApi = resolvedUsername
    ? `/api/authors/page/${encodeURIComponent(resolvedUsername)}/photos/${kind === 'profile' ? 'profile' : 'cover'}`
    : ''
  const ownId = getReaderId()
  const amount = (count) => new Intl.NumberFormat(getDisplayLanguageId()).format(Number(count || 0))


  useEffect(() => {
    if (!open) return undefined
    setControlsVisible(true)
    setMenuOpen(false)
    setActionMessage('')
    setCommentsOpen(false)
    setReactionsOpen(false)
    setReplyTo(null)
    setEditingId('')
    setDraft('')
    setComments([])
    setReplies({})
    setRepliesOpen({})
    setCommentError('')
  }, [open, src, kind])

  useEffect(() => {
    if (!open) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (commentsOpen) setCommentsOpen(false)
        else if (menuOpen) setMenuOpen(false)
        else if (reactionsOpen) setReactionsOpen(false)
        else onClose?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, menuOpen, reactionsOpen, commentsOpen, onClose])

  useEffect(() => {
    if (!actionMessage) return undefined
    const timeout = window.setTimeout(() => setActionMessage(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [actionMessage])

  useEffect(() => {
    if (!open || !src || !photoApi) return undefined
    const abort = new AbortController()
    setSummary({ photo_key: '', reaction_count: 0, comment_count: 0, my_reaction: null })
    setSummaryLoading(true)
    photoRequest(`${photoApi}/summary`, { signal: abort.signal })
      .then((data) => { if (!abort.signal.aborted) setSummary(data) })
      .catch((error) => { if (!abort.signal.aborted) setActionMessage(error.message || t('authorPagePhotoViewer.failedLoad')) })
      .finally(() => { if (!abort.signal.aborted) setSummaryLoading(false) })
    return () => abort.abort()
  }, [open, src, photoApi])

  async function setReaction(type) {
    if (reactionBusy || !photoApi || !summary.photo_key) return
    if (!getReaderToken()) {
      setActionMessage(t('authorPagePhotoViewer.login'))
      return
    }
    setReactionBusy(true)
    try {
      const desired = summary.my_reaction === type ? null : type
      const result = await photoRequest(`${photoApi}/react`, {
        method: 'POST',
        body: { photo_key: summary.photo_key, desired_reaction_type: desired },
      })
      setSummary((current) => ({ ...current, my_reaction: result.my_reaction, reaction_count: result.reaction_count }))
      setReactionsOpen(false)
    } catch (error) {
      setActionMessage(error.status === 409 ? t('authorPagePhotoViewer.photoChanged') : error.message)
    } finally {
      setReactionBusy(false)
    }
  }

  async function loadComments(offset = 0) {
    if (!photoApi || commentsLoading) return
    setCommentsLoading(true)
    setCommentError('')
    try {
      const result = await photoRequest(`${photoApi}/comments?limit=20&offset=${offset}`)
      setComments((current) => offset ? [...current, ...(result.comments || []).filter((item) => !current.some((existing) => existing.id === item.id))] : result.comments || [])
      setCommentsHasMore(Boolean(result.has_more))
    } catch (error) {
      setCommentError(error.message || t('authorPagePhotoViewer.failedComments'))
    } finally {
      setCommentsLoading(false)
    }
  }

  function showComments() {
    setCommentsOpen(true)
    setControlsVisible(true)
    setReactionsOpen(false)
    setReplyTo(null)
    setDraft('')
    setComments([])
    setReplies({})
    setRepliesOpen({})
    loadComments(0)
  }

  async function toggleReplies(commentId) {
    if (repliesOpen[commentId]) {
      setRepliesOpen((current) => ({ ...current, [commentId]: false }))
      return
    }
    setRepliesOpen((current) => ({ ...current, [commentId]: true }))
    if (replies[commentId]) return
    try {
      const result = await photoRequest(`${photoApi}/comments?parent_id=${encodeURIComponent(commentId)}&limit=50`)
      setReplies((current) => ({ ...current, [commentId]: result.comments || [] }))
    } catch (error) {
      setCommentError(error.message || t('authorPagePhotoViewer.failedComments'))
    }
  }

  function startReply(comment) {
    setReplyTo({ id: comment.parent_id || comment.id, name: comment.user?.name || comment.user?.username || '' })
    setEditingId('')
    setDraft('')
    inputRef.current?.focus()
  }

  async function sendComment(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || commentBusy || !summary.photo_key) return
    if (text.length > 1000) { setCommentError(t('authorPagePhotoViewer.tooLong')); return }
    if (!getReaderToken()) { setCommentError(t('authorPagePhotoViewer.login')); return }
    setCommentBusy(true)
    setCommentError('')
    try {
      const result = await photoRequest(`${photoApi}/comments`, {
        method: 'POST',
        body: { photo_key: summary.photo_key, text, ...(replyTo ? { parent_id: replyTo.id } : {}) },
      })
      if (replyTo) {
        const parentId = replyTo.id
        setReplies((current) => ({ ...current, [parentId]: [result.comment, ...(current[parentId] || [])] }))
        setRepliesOpen((current) => ({ ...current, [parentId]: true }))
      } else {
        setComments((current) => [result.comment, ...current])
      }
      setSummary((current) => ({ ...current, comment_count: result.comment_count }))
      setDraft('')
      setReplyTo(null)
    } catch (error) {
      setCommentError(error.status === 409 ? t('authorPagePhotoViewer.photoChanged') : error.message || t('authorPagePhotoViewer.failedSave'))
    } finally {
      setCommentBusy(false)
    }
  }

  async function saveEdit(comment) {
    const text = editDraft.trim()
    if (!text || commentBusy) return
    if (text.length > 1000) { setCommentError(t('authorPagePhotoViewer.tooLong')); return }
    setCommentBusy(true)
    try {
      const result = await photoRequest(`${photoApi}/comments/${encodeURIComponent(comment.id)}`, {
        method: 'PATCH', body: { photo_key: summary.photo_key, text },
      })
      const update = (current) => current.map((item) => item.id === comment.id ? result.comment : item)
      setComments(update)
      setReplies((current) => Object.fromEntries(Object.entries(current).map(([id, items]) => [id, update(items)])))
      setEditingId('')
      setCommentError('')
    } catch (error) {
      setCommentError(error.message || t('authorPagePhotoViewer.failedSave'))
    } finally {
      setCommentBusy(false)
    }
  }

  async function deleteComment(comment) {
    if (commentBusy || !window.confirm(t('authorPagePhotoViewer.confirmDelete'))) return
    setCommentBusy(true)
    try {
      const result = await photoRequest(`${photoApi}/comments/${encodeURIComponent(comment.id)}`, {
        method: 'DELETE', body: { photo_key: summary.photo_key },
      })
      if (comment.parent_id) {
        setReplies((current) => ({ ...current, [comment.parent_id]: (current[comment.parent_id] || []).filter((item) => item.id !== comment.id) }))
      } else {
        setComments((current) => current.filter((item) => item.id !== comment.id))
        setReplies((current) => { const next = { ...current }; delete next[comment.id]; return next })
      }
      setSummary((current) => ({ ...current, comment_count: result.comment_count }))
      setCommentError('')
    } catch (error) {
      setCommentError(error.message || t('authorPagePhotoViewer.failedSave'))
    } finally {
      setCommentBusy(false)
    }
  }

  function renderComment(comment, isReply = false) {
    const user = Array.isArray(comment.user) ? comment.user[0] : comment.user || {}
    const myComment = Boolean(ownId) && ownId === String(comment.user_id)
    const name = user.name || user.username || 'Reader'
    return (
      <article key={comment.id} className={`flex gap-2.5 border-b border-[var(--shadow-border)] py-3 ${isReply ? 'ml-7' : ''}`}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[13px] font-semibold text-[var(--shadow-text-primary)]">
          {user.avatar_url ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" /> : name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="break-words text-[13px] font-semibold text-[var(--shadow-text-primary)]">{name}</span>
            <span className="text-[11px] text-[var(--shadow-text-tertiary)]">{formatCommentDate(comment.created_at)}</span>
          </div>
          {editingId === comment.id ? (
            <div className="mt-2 space-y-2">
              <textarea value={editDraft} onChange={(event) => setEditDraft(event.target.value)} maxLength={1000} rows={2} className="w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-page)] p-2 text-[13px] text-[var(--shadow-text-primary)]" />
              <div className="flex gap-3 text-[12px]">
                <button type="button" disabled={commentBusy || !editDraft.trim()} onClick={() => saveEdit(comment)} className="font-semibold text-[var(--shadow-text-primary)] disabled:opacity-50">{t('authorPagePhotoViewer.save')}</button>
                <button type="button" onClick={() => setEditingId('')} className="text-[var(--shadow-text-secondary)]">{t('authorPagePhotoViewer.cancel')}</button>
              </div>
            </div>
          ) : <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-5 text-[var(--shadow-text-primary)]">{comment.text}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-[var(--shadow-text-secondary)]">
            <button type="button" onClick={() => startReply(comment)}>{t('authorPagePhotoViewer.reply')}</button>
            {myComment ? <button type="button" onClick={() => { setEditingId(comment.id); setEditDraft(comment.text || ''); setReplyTo(null) }}>{t('authorPagePhotoViewer.edit')}</button> : null}
            {myComment ? <button type="button" disabled={commentBusy} onClick={() => deleteComment(comment)}>{t('authorPagePhotoViewer.delete')}</button> : null}
            {!isReply ? <button type="button" onClick={() => toggleReplies(comment.id)}>{repliesOpen[comment.id] ? t('authorPagePhotoViewer.hideReplies') : t('authorPagePhotoViewer.viewReplies')}</button> : null}
          </div>
          {!isReply && repliesOpen[comment.id] ? (replies[comment.id] || []).map((item) => renderComment(item, true)) : null}
        </div>
      </article>
    )
  }

  async function copyLink() {
    setMenuOpen(false)
    try {
      await navigator.clipboard.writeText(src)
      setActionMessage(t('authorPagePhotoViewer.linkCopied'))
    } catch {
      setActionMessage(t('authorPagePhotoViewer.copyFailed'))
    }
  }

  async function sharePhoto() {
    setMenuOpen(false)
    try {
      if (navigator.share) {
        await navigator.share({ title: authorName || label, url: src })
      } else {
        await navigator.clipboard.writeText(src)
        setActionMessage(t('authorPagePhotoViewer.linkCopied'))
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setActionMessage(t('authorPagePhotoViewer.shareFailed'))
      }
    }
  }

  if (!open || !src) return null

  return (
    <div
      className="fixed inset-0 z-[150000] overflow-hidden bg-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={() => {
        if (menuOpen) setMenuOpen(false)
        else if (reactionsOpen) setReactionsOpen(false)
        else setControlsVisible((current) => !current)
      }}
    >
      <div className="absolute inset-0 flex h-[100dvh] w-full items-center justify-center">
        <img
          src={src}
          alt={`${authorName || label} - ${label}`}
          draggable="false"
          className="max-h-[100dvh] max-w-full select-none object-contain"
        />
      </div>

      {controlsVisible ? (
        <header
          className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/90 via-black/60 to-transparent pb-8 pt-[max(8px,env(safe-area-inset-top))]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative flex h-12 items-center justify-between px-3">
            <button
              type="button"
              onClick={onClose}
              aria-label={t('authorPagePhotoViewer.close')}
              className="flex h-10 w-10 items-center justify-center active:opacity-60"
            >
              <i className="fa-solid fa-xmark text-[22px]" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold">
              {t('authorPagePhotoViewer.position')}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('authorPagePhotoViewer.options')}
              className="flex h-10 w-10 items-center justify-center active:opacity-60"
            >
              <i className="fa-solid fa-ellipsis text-[19px]" />
            </button>
          </div>
        </header>
      ) : null}

      {controlsVisible ? (
        <footer
          className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-16"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto max-w-[620px]">
            <div className="flex items-center gap-3 px-4 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[15px] font-semibold">{(authorName || 'A').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold">{authorName}</div>
                <div className="mt-0.5 text-[11px] text-white/70">{label}</div>
              </div>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/15 px-4 pb-2 text-[11px] text-white/75">
              <span><i className="fa-regular fa-heart mr-1" />{summaryLoading ? '…' : amount(summary.reaction_count)}</span>
              <span><i className="fa-regular fa-comment mr-1" />{summaryLoading ? '…' : amount(summary.comment_count)} {t('authorPagePhotoViewer.comments')}</span>
            </div>
            <div className="flex items-center border-t border-white/10 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1">
              <div className="relative flex flex-1 items-center justify-center">
                <button type="button" disabled={reactionBusy || summaryLoading || !summary.photo_key} onClick={() => setReaction('love')} className="flex h-12 min-w-0 flex-1 items-center justify-center gap-1 text-[13px] font-medium text-white disabled:opacity-50">
                  <span className="text-[18px]">{REACTIONS.find(([value]) => value === summary.my_reaction)?.[1] || '♡'}</span>
                  {t('authorPagePhotoViewer.like')}
                </button>
                <button type="button" onClick={() => setReactionsOpen((current) => !current)} disabled={reactionBusy || summaryLoading || !summary.photo_key} className="flex h-10 w-6 items-center justify-center text-white/80 disabled:opacity-50" aria-label={t('authorPagePhotoViewer.chooseReaction')}><i className="fa-solid fa-chevron-up text-[11px]" /></button>
              </div>
              <button type="button" onClick={showComments} disabled={summaryLoading || !summary.photo_key} className="flex h-12 flex-1 items-center justify-center gap-2 text-[13px] font-medium text-white active:bg-white/10 disabled:opacity-50"><i className="fa-regular fa-comment text-[20px]" />{t('authorPagePhotoViewer.comment')}</button>
              <button type="button" onClick={sharePhoto} className="flex h-12 flex-1 items-center justify-center gap-2 text-[13px] font-medium text-white active:bg-white/10"><i className="fa-solid fa-share text-[18px]" />{t('authorPagePhotoViewer.share')}</button>
            </div>
          </div>
        </footer>
      ) : null}

      {actionMessage ? (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black shadow-xl">
          {actionMessage}
        </div>
      ) : null}

      {reactionsOpen && controlsVisible && !commentsOpen ? (
        <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+88px)] z-30 mx-auto flex max-w-[500px] flex-wrap justify-center gap-2 rounded-2xl bg-[#242731]/95 px-3 py-3 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          {REACTIONS.map(([type, emoji]) => (
            <button key={type} type="button" disabled={reactionBusy} onClick={() => setReaction(type)} aria-label={t(`authorPagePhotoViewer.reaction${type[0].toUpperCase()}${type.slice(1)}`)} className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl text-[23px] ${summary.my_reaction === type ? 'bg-white/25' : 'hover:bg-white/10'}`}>
              {emoji}
            </button>
          ))}
        </div>
      ) : null}

      {commentsOpen ? (
        <div className="absolute inset-0 z-50 flex flex-col bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]" onClick={(event) => event.stopPropagation()}>
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--shadow-border)] px-3">
            <button type="button" onClick={() => { setCommentsOpen(false); setReplyTo(null) }} className="flex h-10 w-10 items-center justify-center" aria-label={t('authorPagePhotoViewer.cancel')}><i className="fa-solid fa-chevron-left text-[18px]" /></button>
            <span className="text-[15px] font-semibold">{t('authorPagePhotoViewer.comments')} · {amount(summary.comment_count)}</span>
            <span className="w-10" />
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
            {comments.length === 0 && !commentsLoading && !commentError ? <p className="py-16 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t('authorPagePhotoViewer.noComments')}</p> : null}
            {comments.map((comment) => renderComment(comment))}
            {commentsLoading ? <p className="py-5 text-center text-[12px] text-[var(--shadow-text-secondary)]">{t('authorPagePhotoViewer.loading')}</p> : null}
            {commentsHasMore && !commentsLoading ? <button type="button" onClick={() => loadComments(comments.length)} className="my-4 w-full rounded-xl border border-[var(--shadow-border)] py-3 text-[13px] font-semibold">{t('authorPagePhotoViewer.moreComments')}</button> : null}
            {commentError ? <p role="alert" className="py-3 text-center text-[12px] text-red-500">{commentError}</p> : null}
            {commentError && !comments.length && !commentsLoading ? <button type="button" onClick={() => loadComments(0)} className="w-full py-2 text-[12px] font-semibold">{t('authorPagePhotoViewer.tryAgain')}</button> : null}
          </div>
          <form onSubmit={sendComment} className="shrink-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            {replyTo ? <div className="mb-2 flex items-center justify-between text-[12px] text-[var(--shadow-text-secondary)]"><span>{t('authorPagePhotoViewer.reply')} @{replyTo.name}</span><button type="button" onClick={() => setReplyTo(null)}><i className="fa-solid fa-xmark" /></button></div> : null}
            <div className="flex items-end gap-2">
              <textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1000} rows={1} placeholder={t('authorPagePhotoViewer.writeComment')} className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-page)] px-3 py-2.5 text-[13px] text-[var(--shadow-text-primary)] outline-none" />
              <button type="submit" disabled={!draft.trim() || commentBusy || !summary.photo_key} className="h-11 min-w-14 rounded-xl bg-[var(--shadow-text-primary)] px-3 text-[13px] font-semibold text-[var(--shadow-bg-page)] disabled:opacity-40">{t('authorPagePhotoViewer.send')}</button>
            </div>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <div
          className="absolute inset-0 z-40 flex items-end bg-black/50"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen(false)
          }}
        >
          <div
            className="w-full rounded-t-[22px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 text-[var(--shadow-text-primary)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={copyLink}
              className="flex h-12 w-full items-center gap-3 px-2 text-left active:opacity-60"
            >
              <i className="fa-solid fa-link w-7 text-center text-[17px]" />
              <span>{t('authorPagePhotoViewer.copyLink')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                window.open(src, '_blank', 'noopener,noreferrer')
              }}
              className="flex h-12 w-full items-center gap-3 px-2 text-left active:opacity-60"
            >
              <i className="fa-regular fa-image w-7 text-center text-[17px]" />
              <span>{t('authorPagePhotoViewer.openOriginal')}</span>
            </button>
            <button
              type="button"
              onClick={sharePhoto}
              className="flex h-12 w-full items-center gap-3 px-2 text-left active:opacity-60"
            >
              <i className="fa-solid fa-share w-7 text-center text-[17px]" />
              <span>{t('authorPagePhotoViewer.share')}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

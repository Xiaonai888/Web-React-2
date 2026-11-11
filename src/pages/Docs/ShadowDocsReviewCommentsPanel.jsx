import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, CornerDownRight, MessageCircle, Plus, Trash2, X } from 'lucide-react'
import {
  addShadowDocsComment,
  createShadowDocsCommentRecord,
  getShadowDocsCommentMarks,
  removeShadowDocsCommentMark,
} from './ShadowDocsCommentEngine'
import { captureShadowDocsSelection, restoreShadowDocsSelection, selectShadowDocsNodeContents } from './ShadowDocsSelectionEngine'
import {
  deleteShadowDocsReviewComment,
  readShadowDocsReviewComments,
  saveShadowDocsReviewComment,
  updateShadowDocsReviewComment,
} from './ShadowDocsReviewCommentsStore'
import './ShadowDocsReviewDetails.css'

const LABELS = {
  en: { title: 'Comments', add: 'Insert Comment', type: 'Write a comment', save: 'Add Comment', cancel: 'Cancel', resolve: 'Resolve', reopen: 'Reopen', delete: 'Delete', edit: 'Edit', update: 'Save Changes', empty: 'No comments in this chapter.', select: 'Select text before inserting a comment.', missing: 'Original comment text is unavailable.', saved: 'Comment saved.', failure: 'Unable to save this comment on this device.', linked: 'Go to text', unlinked: 'Text mark missing', close: 'Back' },
  km: { title: 'មតិយោបល់', add: 'បញ្ចូលមតិ', type: 'សរសេរមតិ', save: 'បន្ថែមមតិ', cancel: 'បោះបង់', resolve: 'ដោះស្រាយរួច', reopen: 'បើកវិញ', delete: 'លុប', edit: 'កែ', update: 'រក្សាទុក', empty: 'មិនទាន់មានមតិក្នុងភាគនេះ។', select: 'សូមជ្រើសអត្ថបទមុនបន្ថែមមតិ។', missing: 'មិនមានអត្ថបទមតិចាស់។', saved: 'បានរក្សាទុកមតិ។', failure: 'មិនអាចរក្សាទុកមតិនៅលើឧបករណ៍នេះបាន។', linked: 'ទៅកាន់អត្ថបទ', unlinked: 'រកមិនឃើញសញ្ញាមតិ', close: 'ត្រឡប់' },
  zh: { title: '批注', add: '插入批注', type: '输入批注', save: '添加批注', cancel: '取消', resolve: '解决', reopen: '重新打开', delete: '删除', edit: '编辑', update: '保存更改', empty: '本章暂无批注。', select: '请先选择文本。', missing: '原始批注内容不可用。', saved: '批注已保存。', failure: '无法在此设备保存批注。', linked: '转到文本', unlinked: '未找到文本标记', close: '返回' },
  ko: { title: '댓글', add: '댓글 삽입', type: '댓글 작성', save: '댓글 추가', cancel: '취소', resolve: '해결', reopen: '다시 열기', delete: '삭제', edit: '편집', update: '변경 저장', empty: '이 장에는 댓글이 없습니다.', select: '먼저 텍스트를 선택하세요.', missing: '기존 댓글 내용을 사용할 수 없습니다.', saved: '댓글이 저장되었습니다.', failure: '기기에 댓글을 저장할 수 없습니다.', linked: '텍스트로 이동', unlinked: '텍스트 표시 없음', close: '뒤로' },
  ja: { title: 'コメント', add: 'コメントを挿入', type: 'コメントを書く', save: '追加', cancel: 'キャンセル', resolve: '解決', reopen: '再開', delete: '削除', edit: '編集', update: '保存', empty: 'この章にコメントはありません。', select: '先にテキストを選択してください。', missing: '元のコメントは利用できません。', saved: 'コメントを保存しました。', failure: '端末に保存できませんでした。', linked: 'テキストへ移動', unlinked: '位置が見つかりません', close: '戻る' },
}

export default function ShadowDocsReviewCommentsPanel({
  documentId = '', chapterId = '', editor = null, selectionSnapshot = null,
  userName = 'Author', language = 'en', onContentChange, onBack, disabled = false,
}) {
  const labels = LABELS[String(language).slice(0, 2).toLowerCase()] || LABELS.en
  const selectionRef = useRef(null)
  const usedSelectionRef = useRef(false)
  const contextRef = useRef(null)
  const [records, setRecords] = useState(() => readShadowDocsReviewComments(documentId, chapterId))
  const [editingId, setEditingId] = useState('')
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const marks = getShadowDocsCommentMarks(editor)
  const markIds = new Set(marks.map(mark => mark.id))
  const visible = [...records, ...marks.filter(mark => !records.some(item => item.id === mark.id)).map(mark => ({ id: mark.id, chapterId, author: '', text: labels.missing, quote: mark.text, legacy: true, createdAt: 0, resolvedAt: null }))]

  useEffect(() => {
    const sameContext = contextRef.current?.documentId === documentId && contextRef.current?.chapterId === chapterId && contextRef.current?.editor === editor
    contextRef.current = { documentId, chapterId, editor }
    if (!sameContext) {
      setRecords(readShadowDocsReviewComments(documentId, chapterId))
      setEditingId('')
      setDraft('')
      usedSelectionRef.current = false
    }
    if (!usedSelectionRef.current) selectionRef.current = selectionSnapshot || captureShadowDocsSelection(editor)
  }, [documentId, chapterId, editor, selectionSnapshot])

  function refresh() {
    setRecords(readShadowDocsReviewComments(documentId, chapterId))
  }

  function insert() {
    if (!editor || !chapterId || !onContentChange || disabled) return
    if (usedSelectionRef.current) return setMessage(labels.select)
    const snapshot = selectionRef.current
    if (!snapshot || snapshot.collapsed || !snapshot.text?.trim()) return setMessage(labels.select)
    const range = restoreShadowDocsSelection(editor, snapshot)
    if (!range || range.collapsed || range.toString() !== snapshot.text) return setMessage(labels.select)
    const text = draft.trim()
    if (!text) return
    const record = createShadowDocsCommentRecord({ text, author: userName, chapterId })
    record.quote = snapshot.text.slice(0, 240)
    if (!saveShadowDocsReviewComment(documentId, record)) return setMessage(labels.failure)
    if (!addShadowDocsComment(editor, snapshot, record)) {
      deleteShadowDocsReviewComment(documentId, record.id)
      return setMessage(labels.select)
    }
    selectionRef.current = null
    usedSelectionRef.current = true
    onContentChange(editor.innerHTML)
    refresh()
    setDraft('')
    setEditingId('')
    setMessage(labels.saved)
  }

  function edit(item) {
    setEditingId(item.id)
    setDraft(item.text)
    setMessage('')
  }

  function update(item) {
    if (!draft.trim()) return
    if (!updateShadowDocsReviewComment(documentId, item.id, { text: draft })) return setMessage(labels.failure)
    refresh()
    setEditingId('')
    setDraft('')
    setMessage(labels.saved)
  }

  function toggleResolved(item) {
    if (!updateShadowDocsReviewComment(documentId, item.id, { resolvedAt: item.resolvedAt ? null : Date.now() })) return setMessage(labels.failure)
    refresh()
  }

  function remove(item) {
    if (disabled) return
    if (item.legacy) {
      if (!editor || !onContentChange || !removeShadowDocsCommentMark(editor, item.id)) return setMessage(labels.unlinked)
      onContentChange(editor.innerHTML)
    } else {
      if (!deleteShadowDocsReviewComment(documentId, item.id)) return setMessage(labels.failure)
      if (markIds.has(item.id) && editor && removeShadowDocsCommentMark(editor, item.id)) onContentChange?.(editor.innerHTML)
    }
    refresh()
    if (editingId === item.id) {
      setEditingId('')
      setDraft('')
    }
    setMessage('')
  }

  function locate(id) {
    const mark = editor && [...editor.querySelectorAll('[data-shadow-docs-comment-id]')].find(node => node.dataset.shadowDocsCommentId === id)
    if (!mark) return setMessage(labels.unlinked)
    mark.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    selectShadowDocsNodeContents(mark)
    setMessage('')
  }

  return <section className="sd-review-detail-panel" aria-label={labels.title}>
    <header className="sd-review-detail-header"><button type="button" onClick={onBack} aria-label={labels.close}><ArrowLeft size={21} /></button><strong>{labels.title}</strong><span>{visible.length}</span></header>
    <div className="sd-review-detail-list">
      {visible.length ? visible.map(item => <article key={item.id} className={`sd-review-detail-entry ${item.resolvedAt ? 'is-resolved' : ''}`}>
        <div className="sd-review-detail-meta"><MessageCircle size={17} /><strong>{item.author || labels.title}</strong>{item.createdAt ? <time>{new Date(item.createdAt).toLocaleString()}</time> : null}</div>
        {item.quote ? <blockquote>{item.quote}</blockquote> : null}
        {editingId === item.id ? <div className="sd-review-detail-editor"><textarea value={draft} maxLength={2000} onChange={event => setDraft(event.target.value)} aria-label={labels.type} /><div className="sd-review-detail-actions"><button type="button" disabled={!draft.trim()} onClick={() => update(item)}><Check size={16} />{labels.update}</button><button type="button" onClick={() => { setEditingId(''); setDraft('') }}><X size={16} />{labels.cancel}</button></div></div> : <p>{item.text}</p>}
        <div className="sd-review-detail-actions">
          {markIds.has(item.id) ? <button type="button" onClick={() => locate(item.id)}><CornerDownRight size={15} />{labels.linked}</button> : null}
          {!disabled && !item.legacy ? <><button type="button" onClick={() => toggleResolved(item)}>{item.resolvedAt ? labels.reopen : labels.resolve}</button><button type="button" onClick={() => edit(item)}>{labels.edit}</button><button type="button" onClick={() => remove(item)}><Trash2 size={15} />{labels.delete}</button></> : null}
          {!disabled && item.legacy && markIds.has(item.id) && onContentChange ? <button type="button" onClick={() => remove(item)}><Trash2 size={15} />{labels.delete}</button> : null}
        </div>
      </article>) : <p className="sd-review-detail-empty">{labels.empty}</p>}
    </div>
    {!disabled && editor && onContentChange ? <form className="sd-review-detail-compose" onSubmit={event => { event.preventDefault(); insert() }}>
      <label htmlFor="sd-review-add-comment"><Plus size={17} />{labels.add}</label>
      <textarea id="sd-review-add-comment" value={editingId ? '' : draft} disabled={Boolean(editingId)} maxLength={2000} placeholder={labels.type} onChange={event => setDraft(event.target.value)} />
      <button type="submit" disabled={!draft.trim() || Boolean(editingId)}><Check size={17} />{labels.save}</button>
    </form> : null}
    {message ? <p className="sd-review-detail-status" role="status">{message}</p> : null}
  </section>
}

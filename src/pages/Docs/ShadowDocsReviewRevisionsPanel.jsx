import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Clock3, CornerDownRight, X } from 'lucide-react'
import { acceptShadowDocsChange, listShadowDocsChanges, rejectShadowDocsChange } from './ShadowDocsTrackChangesEngine'
import { selectShadowDocsNodeContents } from './ShadowDocsSelectionEngine'
import './ShadowDocsReviewDetails.css'

const LANG = {
  en: { title: 'Revisions', inserted: 'Inserted', deleted: 'Deleted', accept: 'Accept', reject: 'Reject', empty: 'No tracked changes in this chapter.', saved: 'Change reviewed.', failed: 'Could not apply that change.', back: 'Back', jump: 'Go to change', count: 'changes' },
  km: { title: 'ការកែប្រែ', inserted: 'បញ្ចូល', deleted: 'លុប', accept: 'ទទួលយក', reject: 'បដិសេធ', empty: 'មិនមានការកែប្រែកត់ត្រាក្នុងភាគនេះ។', saved: 'បានពិនិត្យការកែប្រែ។', failed: 'មិនអាចកែការផ្លាស់ប្តូរនេះបាន។', back: 'ត្រឡប់', jump: 'ទៅកាន់ការកែ', count: 'ការកែប្រែ' },
  zh: { title: '修订', inserted: '插入', deleted: '删除', accept: '接受', reject: '拒绝', empty: '此章节暂无修订。', saved: '修订已处理。', failed: '无法应用此修订。', back: '返回', jump: '跳转至修订', count: '处修订' },
  ko: { title: '수정 내역', inserted: '삽입', deleted: '삭제', accept: '수락', reject: '거부', empty: '변경 내역이 없습니다.', saved: '변경을 검토했습니다.', failed: '변경을 적용할 수 없습니다.', back: '뒤로', jump: '변경 위치', count: '개 변경' },
  ja: { title: '変更履歴', inserted: '挿入', deleted: '削除', accept: '承諾', reject: '却下', empty: '変更履歴がありません。', saved: '変更を確認しました。', failed: '変更を適用できません。', back: '戻る', jump: '変更に移動', count: '件の変更' },
}

export default function ShadowDocsReviewRevisionsPanel({ editor = null, chapterId = '', language = 'en', onContentChange, onBack, disabled = false }) {
  const labels = LANG[String(language).slice(0, 2).toLowerCase()] || LANG.en
  const [changes, setChanges] = useState(() => listShadowDocsChanges(editor))
  const [message, setMessage] = useState('')

  useEffect(() => {
    setChanges(listShadowDocsChanges(editor))
    setMessage('')
  }, [editor, chapterId])

  function locate(id) {
    const element = editor && [...editor.querySelectorAll('[data-shadow-docs-change-id]')].find(node => node.dataset.shadowDocsChangeId === id)
    if (!element) return setMessage(labels.failed)
    element.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    selectShadowDocsNodeContents(element)
    setMessage('')
  }

  function review(change, accept) {
    if (disabled || !editor || !onContentChange) return
    const changed = accept ? acceptShadowDocsChange(editor, change.id) : rejectShadowDocsChange(editor, change.id)
    if (!changed) return setMessage(labels.failed)
    onContentChange(editor.innerHTML)
    setChanges(listShadowDocsChanges(editor))
    setMessage(labels.saved)
  }

  return <section className="sd-review-detail-panel" aria-label={labels.title}>
    <header className="sd-review-detail-header"><button type="button" aria-label={labels.back} onClick={onBack}><ArrowLeft size={21} /></button><strong>{labels.title}</strong><span>{changes.length} {labels.count}</span></header>
    <div className="sd-review-detail-list">
      {changes.length ? changes.map(change => <article className="sd-review-detail-entry" key={change.id}>
        <div className="sd-review-detail-meta"><Clock3 size={17} /><strong>{change.type === 'delete' ? labels.deleted : labels.inserted}</strong>{change.createdAt ? <time>{new Date(change.createdAt).toLocaleString()}</time> : null}</div>
        {change.author ? <small>{change.author}</small> : null}
        <p>{change.text}</p>
        <div className="sd-review-detail-actions">
          <button type="button" onClick={() => locate(change.id)}><CornerDownRight size={15} />{labels.jump}</button>
          <button type="button" disabled={disabled || !onContentChange} onClick={() => review(change, true)}><Check size={15} />{labels.accept}</button>
          <button type="button" disabled={disabled || !onContentChange} onClick={() => review(change, false)}><X size={15} />{labels.reject}</button>
        </div>
      </article>) : <p className="sd-review-detail-empty">{labels.empty}</p>}
    </div>
    {message ? <p className="sd-review-detail-status" role="status">{message}</p> : null}
  </section>
}

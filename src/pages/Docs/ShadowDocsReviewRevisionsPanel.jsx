import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Clock3, CornerDownRight, X } from 'lucide-react'
import { acceptShadowDocsChange, listShadowDocsChanges, rejectShadowDocsChange } from './ShadowDocsTrackChangesEngine'
import { selectShadowDocsNodeContents } from './ShadowDocsSelectionEngine'
import './ShadowDocsReviewDetails.css'

const LANG = {
  en: { title: 'Revisions', inserted: 'Inserted', deleted: 'Deleted', accept: 'Accept', reject: 'Reject', empty: 'No tracked changes in this chapter.', saved: 'Change reviewed.', failed: 'Could not apply that change.', back: 'Back', jump: 'Go to change', count: 'changes', hidden: 'Turn on Show Markup to locate this change.' },
  km: { title: 'ការកែប្រែ', inserted: 'បញ្ចូល', deleted: 'លុប', accept: 'ទទួលយក', reject: 'បដិសេធ', empty: 'មិនមានការកែប្រែកត់ត្រាក្នុងភាគនេះ។', saved: 'បានពិនិត្យការកែប្រែ។', failed: 'មិនអាចកែការផ្លាស់ប្តូរនេះបាន។', back: 'ត្រឡប់', jump: 'ទៅកាន់ការកែ', count: 'ការកែប្រែ', hidden: 'សូមបើក Show Markup ដើម្បីមើលទីតាំងការកែប្រែ។' },
  zh: { title: '修订', inserted: '插入', deleted: '删除', accept: '接受', reject: '拒绝', empty: '此章节暂无修订。', saved: '修订已处理。', failed: '无法应用此修订。', back: '返回', jump: '跳转至修订', count: '处修订', hidden: '请启用显示修订标记后定位。' },
  ko: { title: '수정 내역', inserted: '삽입', deleted: '삭제', accept: '수락', reject: '거부', empty: '변경 내역이 없습니다.', saved: '변경을 검토했습니다.', failed: '변경을 적용할 수 없습니다.', back: '뒤로', jump: '변경 위치', count: '개 변경', hidden: '변경 위치를 보려면 변경 내용 표시를 켜세요.' },
  ja: { title: '変更履歴', inserted: '挿入', deleted: '削除', accept: '承諾', reject: '却下', empty: '変更履歴がありません。', saved: '変更を確認しました。', failed: '変更を適用できません。', back: '戻る', jump: '変更に移動', count: '件の変更', hidden: '変更箇所を見るには変更履歴の表示をオンにしてください。' },
}

export default function ShadowDocsReviewRevisionsPanel({ editor = null, chapterId = '', language = 'en', onContentChange, onBack, disabled = false }) {
  const labels = LANG[String(language).slice(0, 2).toLowerCase()] || LANG.en
  const [changes, setChanges] = useState(() => listShadowDocsChanges(editor))
  const [message, setMessage] = useState('')
  const reviewingRef = useRef(false)

  const refresh = useCallback(() => {
    setChanges(listShadowDocsChanges(editor))
  }, [editor])

  useEffect(() => {
    refresh()
    setMessage('')
    if (!editor || typeof MutationObserver === 'undefined') return undefined
    let frame = 0
    const observer = new MutationObserver(() => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        refresh()
      })
    })
    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-shadow-docs-change-id', 'data-shadow-docs-change-type', 'data-shadow-docs-change-author', 'data-shadow-docs-change-time'],
    })
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [editor, chapterId, refresh])

  function findChange(id) {
    if (!editor || !id) return null
    return [...editor.querySelectorAll('[data-shadow-docs-change-id]')].find(node => node.dataset.shadowDocsChangeId === id) || null
  }

  function locate(id) {
    const element = findChange(id)
    if (!element) {
      refresh()
      setMessage(labels.failed)
      return
    }
    if (globalThis.getComputedStyle?.(element)?.display === 'none') {
      setMessage(labels.hidden)
      return
    }
    element.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    selectShadowDocsNodeContents(element)
    setMessage('')
  }

  function review(change, accept) {
    if (disabled || !editor || typeof onContentChange !== 'function' || reviewingRef.current) return
    if (!findChange(change.id)) {
      refresh()
      setMessage(labels.failed)
      return
    }
    reviewingRef.current = true
    try {
      const changed = accept ? acceptShadowDocsChange(editor, change.id) : rejectShadowDocsChange(editor, change.id)
      if (!changed) {
        refresh()
        setMessage(labels.failed)
        return
      }
      onContentChange(editor.innerHTML)
      refresh()
      setMessage(labels.saved)
    } catch {
      refresh()
      setMessage(labels.failed)
    } finally {
      reviewingRef.current = false
    }
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
          <button type="button" disabled={disabled || typeof onContentChange !== 'function'} onClick={() => review(change, true)}><Check size={15} />{labels.accept}</button>
          <button type="button" disabled={disabled || typeof onContentChange !== 'function'} onClick={() => review(change, false)}><X size={15} />{labels.reject}</button>
        </div>
      </article>) : <p className="sd-review-detail-empty">{labels.empty}</p>}
    </div>
    {message ? <p className="sd-review-detail-status" role="status">{message}</p> : null}
  </section>
}

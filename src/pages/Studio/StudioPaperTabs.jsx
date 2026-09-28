import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const STUDIO_TEXT = {
  "km": {
    "Open papers": "ក្រដាសដែលកំពុងបើក",
    "Rename": "ប្ដូរឈ្មោះ",
    "Unsaved changes": "ការកែប្រែមិនទាន់រក្សាទុក"
  },
  "zh": {
    "Open papers": "打开的画布",
    "Rename": "重命名",
    "Unsaved changes": "未保存的更改"
  },
  "ja": {
    "Open papers": "開いているキャンバス",
    "Rename": "名前を変更",
    "Unsaved changes": "未保存の変更"
  },
  "ko": {
    "Open papers": "열린 캔버스",
    "Rename": "이름 바꾸기",
    "Unsaved changes": "저장되지 않은 변경 사항"
  }
}

function studioTranslate(language, text) {
  return STUDIO_TEXT[language]?.[text] || text
}

export default function StudioPaperTabs({
  documents,
  activeDocumentId,
  limit,
  disabled,
  onSwitch,
  onClose,
  onNew,
  onRename,
  labels,
}) {
  const [editingId, setEditingId] = useState('')
  const { language } = useDisplayTranslation()
  const tr = (text) => studioTranslate(language, text)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const canceledRef = useRef(false)
  const tabsRef = useRef(null)
  const activeTabRef = useRef(null)

  useEffect(() => {
    if (!editingId) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editingId])

  useEffect(() => {
    if (disabled && editingId) {
      canceledRef.current = true
      setEditingId('')
    }
  }, [disabled, editingId])

  useEffect(() => {
    if (editingId && !documents.some((paper) => paper.id === editingId)) {
      canceledRef.current = true
      setEditingId('')
    }
  }, [documents, editingId])

  useEffect(() => {
    const container = tabsRef.current
    const tab = activeTabRef.current
    if (!container || !tab) return
    const boundary = container.getBoundingClientRect()
    const position = tab.getBoundingClientRect()
    if (position.left < boundary.left) container.scrollLeft -= boundary.left - position.left
    else if (position.right > boundary.right) container.scrollLeft += position.right - boundary.right
  }, [activeDocumentId])

  function beginRename(paper) {
    if (disabled) return
    canceledRef.current = false
    setDraft(paper.name)
    setEditingId(paper.id)
  }

  function finishRename(paperId, canceled = false) {
    if (editingId !== paperId) return
    if (canceled || canceledRef.current || disabled) {
      canceledRef.current = true
      setEditingId('')
      return
    }
    const nextName = draft.trim().slice(0, 80)
    if (!nextName) {
      inputRef.current?.focus()
      return
    }
    canceledRef.current = true
    setEditingId('')
    const original = documents.find((paper) => paper.id === paperId)
    if (original && nextName !== original.name) onRename(paperId, nextName)
  }

  return (
    <div ref={tabsRef} className="ss-tabs" role="group" aria-label={tr('Open papers')}>
      <style>{`
        .ss-tabs{
          --ss-tabs-bg:#202832;
          --ss-tabs-bg-2:#29313a;
          --ss-tabs-bg-3:#313b46;
          --ss-tabs-line:#4b5968;
          --ss-tabs-line-soft:#3b4651;
          --ss-tabs-text:#edf3fa;
          --ss-tabs-muted:#aab8c6;
          --ss-tabs-blue:#5faeff;
          --ss-tabs-blue-soft:#355d84;
          position:sticky;
          top:34px;
          z-index:29;
          display:flex;
          align-items:stretch;
          min-height:36px;
          overflow-x:auto;
          overflow-y:hidden;
          padding-left:8px;
          border-bottom:1px solid var(--ss-tabs-line);
          background:linear-gradient(180deg,#252e37,#202832);
          scrollbar-width:thin;
          scrollbar-color:#56697b #202832;
          box-shadow:inset 0 -1px 0 #0004
        }
        .ss-tab{
          position:relative;
          flex:0 0 auto;
          min-width:118px;
          max-width:220px;
          height:36px;
          display:flex;
          align-items:center;
          border-right:1px solid var(--ss-tabs-line-soft);
          border-top:1px solid transparent;
          background:#27313b;
          color:#aebdca;
          transition:background 120ms ease,color 120ms ease,border-color 120ms ease
        }
        .ss-tab:hover{background:#2f3b47;color:#e7eef5}
        .ss-tab.active{
          border-top-color:#79bcff;
          background:#34495d;
          color:#fff;
          box-shadow:inset 0 1px 0 #5faeff,inset 0 -1px 0 #34495d
        }
        .ss-tab-main{
          min-width:0;
          flex:1;
          height:36px;
          display:flex;
          align-items:center;
          gap:7px;
          border:0;
          background:transparent;
          color:inherit;
          padding:0 5px 0 10px;
          font:700 10px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          cursor:pointer
        }
        .ss-tab-main:disabled{cursor:default}
        .ss-tab-name{
          min-width:0;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .ss-dirty{
          width:7px;
          height:7px;
          flex:0 0 7px;
          border-radius:999px;
          background:#f2b35b;
          box-shadow:0 0 0 2px #f2b35b22
        }
        .ss-tab-close,
        .ss-tab-edit{
          display:grid;
          place-items:center;
          flex:none;
          border:1px solid transparent;
          background:transparent;
          color:#aab8c6;
          cursor:pointer;
          transition:border-color 120ms ease,background 120ms ease,color 120ms ease
        }
        .ss-tab-close{
          width:26px;
          height:26px;
          margin-right:3px;
          border-radius:5px
        }
        .ss-tab-edit{
          width:24px;
          min-width:24px;
          height:26px;
          border-radius:5px;
          font:inherit;
          font-size:9px
        }
        .ss-tab-close:hover:not(:disabled),
        .ss-tab-edit:hover:not(:disabled){
          border-color:#53687b;
          background:#415365;
          color:#fff
        }
        .ss-tab-add{
          height:36px;
          min-width:42px;
          flex:0 0 42px;
          border:0;
          border-right:1px solid var(--ss-tabs-line-soft);
          background:#28323c;
          color:#c8d5e1;
          cursor:pointer;
          transition:background 120ms ease,color 120ms ease
        }
        .ss-tab-add:hover:not(:disabled){
          background:#3a4a59;
          color:#fff
        }
        .ss-tab-count{
          margin-left:auto;
          display:flex;
          flex:0 0 auto;
          align-items:center;
          padding:0 12px;
          color:#8fa1b2;
          font:800 9px Inter,ui-sans-serif,system-ui,sans-serif;
          white-space:nowrap;
          font-variant-numeric:tabular-nums
        }
        .ss-tab-input{
          box-sizing:border-box;
          width:100%;
          min-width:0;
          height:28px;
          margin:0 4px;
          border:1px solid var(--ss-tabs-blue);
          border-radius:5px;
          outline:none;
          background:#1d2a36;
          color:#fff;
          padding:0 7px;
          font:700 10px Inter,ui-sans-serif,system-ui,sans-serif;
          box-shadow:0 0 0 2px #5faeff26
        }
        .ss-tabs button:disabled{
          opacity:.4;
          cursor:default
        }
        .ss-tabs button:focus-visible{
          outline:2px solid var(--ss-tabs-blue);
          outline-offset:-2px
        }
        @media(max-width:640px){
          .ss-tab{min-width:104px}
          .ss-tab-count{display:none}
          .ss-tab-edit{width:24px;min-width:24px}
          .ss-tab-close{width:28px;height:28px}
        }
      `}</style>
      {documents.map((paper) => {
        const active = paper.id === activeDocumentId
        const editing = editingId === paper.id
        return (
          <div key={paper.id} ref={active ? activeTabRef : null} className={`ss-tab ${active ? 'active' : ''}`}>
            {editing ? (
              <input
                ref={inputRef}
                className="ss-tab-input"
                maxLength={80}
                value={draft}
                aria-label={`${tr('Rename')} ${paper.name}`}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    finishRename(paper.id)
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    event.stopPropagation()
                    finishRename(paper.id, true)
                  }
                }}
                onBlur={() => finishRename(paper.id)}
              />
            ) : (
              <button
                type="button"
                className="ss-tab-main"
                disabled={disabled}
                title={`${paper.name} · ${paper.width} × ${paper.height}px`}
                aria-current={active ? 'page' : undefined}
                onClick={() => { if (!active) onSwitch(paper.id) }}
                onDoubleClick={() => beginRename(paper)}
              >
                {paper.dirty ? <span className="ss-dirty" aria-label={tr('Unsaved changes')} /> : null}
                <span className="ss-tab-name">{paper.name}</span>
              </button>
            )}
            {active && !editing ? (
              <button type="button" className="ss-tab-edit" disabled={disabled} title={`${tr('Rename')} ${paper.name}`} aria-label={`${tr('Rename')} ${paper.name}`} onClick={() => beginRename(paper)}>
                <i className="fa-solid fa-pen" />
              </button>
            ) : null}
            <button type="button" className="ss-tab-close" disabled={disabled || editing} title={labels.close} aria-label={`${labels.close}: ${paper.name}`} onClick={() => onClose(paper.id)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )
      })}
      <button type="button" className="ss-tab-add" disabled={disabled || documents.length >= limit} onClick={onNew} title={labels.new} aria-label={labels.new}>
        <i className="fa-solid fa-plus" />
      </button>
      <div className="ss-tab-count">{documents.length}/{limit}</div>
    </div>
  )
}

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
        .ss-tabs{position:sticky;top:34px;z-index:29;display:flex;align-items:stretch;min-height:36px;overflow-x:auto;overflow-y:hidden;border-bottom:1px solid #3d4248;background:#24272a;padding-left:8px;scrollbar-width:thin}
        .ss-tab{flex:0 0 auto;min-width:118px;max-width:220px;height:36px;display:flex;align-items:center;border-right:1px solid #3d4248;background:#292c30;color:#b9c0c7}
        .ss-tab.active{background:#3a3f45;color:#fff}
        .ss-tab-main{min-width:0;flex:1;height:36px;display:flex;align-items:center;gap:8px;border:0;background:transparent;color:inherit;padding:0 4px 0 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .ss-tab-main:disabled{cursor:default}
        .ss-tab-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ss-dirty{height:6px;width:6px;flex:0 0 6px;border-radius:999px;background:#9ca3af}
        .ss-tab-close{height:24px;width:24px;display:grid;place-items:center;border:0;border-radius:5px;background:transparent;color:inherit;cursor:pointer}
        .ss-tab-close:hover:not(:disabled),.ss-tab-edit:hover:not(:disabled){background:rgba(255,255,255,.08)}
        .ss-tab-add{height:36px;min-width:42px;flex:0 0 42px;border:0;background:transparent;color:#d2d6db;cursor:pointer}
        .ss-tab-count{margin-left:auto;display:flex;flex:0 0 auto;align-items:center;padding:0 12px;color:#8f969e;font-size:10px;font-weight:800;white-space:nowrap}
        .ss-tab-edit{width:22px;min-width:22px;height:24px;display:grid;place-items:center;border:0;border-radius:4px;background:transparent;color:#b9c0c7;font:inherit;font-size:10px;cursor:pointer}
        .ss-tab-input{box-sizing:border-box;width:100%;min-width:0;height:26px;border:1px solid #72b3f7;border-radius:4px;background:#1e2b38;color:#fff;padding:0 4px;font:inherit;font-size:11px;outline:none}
        .ss-tabs button:disabled{opacity:.4;cursor:default}
        .ss-tabs button:focus-visible{outline:2px solid #82c4ff;outline-offset:-2px}
        @media(max-width:640px){.ss-tab{min-width:104px}.ss-tab-count{display:none}.ss-tab-edit{width:24px;min-width:24px}.ss-tab-close{width:28px;height:28px}}
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

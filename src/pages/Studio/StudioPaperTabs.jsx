import { useEffect, useRef, useState } from 'react'

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
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const canceledRef = useRef(false)
  const activeTabRef = useRef(null)

  useEffect(() => {
    if (!editingId) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editingId])

  useEffect(() => {
    const tab = activeTabRef.current
    if (!tab) return
    const container = tab.closest('.ss-tabs')
    if (!container) return
    const left = tab.offsetLeft
    const right = left + tab.offsetWidth
    if (left < container.scrollLeft) container.scrollLeft = left
    else if (right > container.scrollLeft + container.clientWidth) {
      container.scrollLeft = right - container.clientWidth
    }
  }, [activeDocumentId])

  function beginRename(document) {
    if (disabled) return
    canceledRef.current = false
    setDraft(document.name)
    setEditingId(document.id)
  }

  function finishRename(documentId, canceled = false) {
    if (editingId !== documentId) return
    if (canceled || canceledRef.current) {
      setEditingId('')
      return
    }
    const nextName = draft.trim().slice(0, 80)
    if (!nextName) {
      inputRef.current?.focus()
      return
    }
    setEditingId('')
    onRename(documentId, nextName)
  }

  return (
    <div className="ss-tabs" aria-label="Open papers">
      <style>{`
        .ss-tabs{position:sticky;top:34px;z-index:29;display:flex;align-items:stretch;min-height:36px;overflow-x:auto;border-bottom:1px solid #3d4248;background:#24272a;padding-left:8px}
        .ss-tab{min-width:118px;max-width:220px;height:36px;display:flex;align-items:center;border-right:1px solid #3d4248;background:#292c30;color:#b9c0c7}
        .ss-tab.active{background:#3a3f45;color:#fff}
        .ss-tab-main{min-width:0;flex:1;height:36px;display:flex;align-items:center;gap:8px;border:0;background:transparent;color:inherit;padding:0 4px 0 10px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
        .ss-tab-main:disabled{cursor:default}
        .ss-tab-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ss-dirty{height:6px;width:6px;flex:0 0 6px;border-radius:999px;background:#9ca3af}
        .ss-tab-close{height:24px;width:24px;display:grid;place-items:center;border:0;border-radius:5px;background:transparent;color:inherit;cursor:pointer}
        .ss-tab-close:hover:not(:disabled),.ss-tab-edit:hover:not(:disabled){background:rgba(255,255,255,.08)}
        .ss-tab-add{height:36px;min-width:42px;border:0;background:transparent;color:#d2d6db;cursor:pointer}
        .ss-tab-count{margin-left:auto;display:flex;align-items:center;padding:0 12px;color:#8f969e;font-size:10px;font-weight:800;white-space:nowrap}
        .ss-tab-edit{width:22px;min-width:22px;height:24px;display:grid;place-items:center;border:0;border-radius:4px;background:transparent;color:#b9c0c7;font:inherit;font-size:10px;cursor:pointer}
        .ss-tab-input{width:100%;min-width:0;height:26px;border:1px solid #72b3f7;border-radius:4px;background:#1e2b38;color:#fff;padding:0 4px;font:inherit;font-size:11px;outline:none}
        .ss-tabs button:disabled{opacity:.4;cursor:default}
        @media(max-width:640px){.ss-tab{min-width:104px}.ss-tab-count{display:none}.ss-tab-edit{width:24px;min-width:24px}}
      `}</style>
      {documents.map((document) => {
        const active = document.id === activeDocumentId
        const editing = editingId === document.id
        return (
          <div key={document.id} ref={active ? activeTabRef : null} className={`ss-tab ${active ? 'active' : ''}`}>
            {editing ? (
              <input
                ref={inputRef}
                className="ss-tab-input"
                maxLength={80}
                value={draft}
                aria-label={`Rename ${document.name}`}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') finishRename(document.id)
                  if (event.key === 'Escape') {
                    canceledRef.current = true
                    finishRename(document.id, true)
                  }
                }}
                onBlur={() => finishRename(document.id)}
              />
            ) : (
              <button
                type="button"
                className="ss-tab-main"
                disabled={disabled}
                title={`${document.name} · ${document.width} × ${document.height}px`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSwitch(document.id)}
                onDoubleClick={() => beginRename(document)}
              >
                {document.dirty ? <span className="ss-dirty" aria-label="Unsaved changes" /> : null}
                <span className="ss-tab-name">{document.name}</span>
              </button>
            )}
            {active && !editing ? (
              <button type="button" className="ss-tab-edit" disabled={disabled} title={`Rename ${document.name}`} aria-label={`Rename ${document.name}`} onClick={() => beginRename(document)}>
                <i className="fa-solid fa-pen" />
              </button>
            ) : null}
            <button type="button" className="ss-tab-close" disabled={disabled || editing} title={labels.close} aria-label={`${labels.close}: ${document.name}`} onClick={() => onClose(document.id)}>
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

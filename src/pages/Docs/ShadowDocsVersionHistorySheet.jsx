import { RotateCcw, Trash2, X } from 'lucide-react'

function formatDate(value) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return ''
  }
}

export default function ShadowDocsVersionHistorySheet({
  open = false,
  documentName = 'Docs.doc',
  versions = [],
  onClose,
  onRestore,
  onDelete,
  onClear,
}) {
  if (!open) return null

  return <div className="sd-version-backdrop">
    <style>{`
      .sd-version-backdrop{
        position:fixed;
        inset:0;
        z-index:19500;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background:rgba(0,0,0,.16)
      }
      .sd-version-sheet{
        width:min(100%,560px);
        max-height:88dvh;
        overflow:hidden;
        border:1px solid #303136;
        border-bottom:0;
        border-radius:20px 20px 0 0;
        background:#171719;
        color:#f3f3f4;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-version-sheet *{box-sizing:border-box}
      .sd-version-handle{
        width:42px;
        height:4px;
        margin:8px auto 2px;
        border-radius:999px;
        background:#37383d
      }
      .sd-version-head{
        min-height:58px;
        display:grid;
        grid-template-columns:42px minmax(0,1fr) 42px;
        align-items:center;
        padding:0 14px
      }
      .sd-version-head strong{
        text-align:center;
        font-size:18px;
        font-weight:750
      }
      .sd-version-close{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#efeff0
      }
      .sd-version-meta{
        margin:0 16px 12px;
        padding:12px 14px;
        border-radius:12px;
        background:#232427
      }
      .sd-version-meta strong{
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:14px
      }
      .sd-version-meta small{
        display:block;
        margin-top:4px;
        color:#888990;
        font-size:10px
      }
      .sd-version-toolbar{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:0 16px 9px
      }
      .sd-version-toolbar span{
        color:#97989f;
        font-size:12px;
        font-weight:650
      }
      .sd-version-clear{
        border:0;
        background:transparent;
        color:#ff8585;
        font:inherit;
        font-size:11px;
        font-weight:700
      }
      .sd-version-list{
        max-height:58dvh;
        overflow-y:auto;
        border-top:1px solid #2e2f33;
        border-bottom:1px solid #2e2f33
      }
      .sd-version-empty{
        padding:44px 24px;
        text-align:center;
        color:#85868d
      }
      .sd-version-empty strong{
        display:block;
        color:#d6d6d8;
        font-size:14px
      }
      .sd-version-empty small{
        display:block;
        margin-top:5px;
        font-size:10px;
        line-height:1.5
      }
      .sd-version-row{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:12px;
        align-items:center;
        min-height:82px;
        padding:11px 15px;
        border-bottom:1px solid #303136;
        background:#1e1f22
      }
      .sd-version-row:last-child{border-bottom:0}
      .sd-version-info strong{
        display:block;
        font-size:13px;
        font-weight:650
      }
      .sd-version-info small{
        display:block;
        margin-top:4px;
        color:#86878e;
        font-size:10px;
        line-height:1.45
      }
      .sd-version-actions{
        display:flex;
        align-items:center;
        gap:6px
      }
      .sd-version-restore{
        height:34px;
        display:flex;
        align-items:center;
        gap:5px;
        border:0;
        border-radius:8px;
        background:#25a884;
        color:#fff;
        padding:0 10px;
        font:inherit;
        font-size:11px;
        font-weight:700
      }
      .sd-version-delete{
        width:34px;
        height:34px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:8px;
        background:#292a2e;
        color:#ff8c8c
      }
      .sd-version-foot{
        padding:12px 16px calc(14px + env(safe-area-inset-bottom));
        color:#777981;
        font-size:10px;
        line-height:1.5
      }
    `}</style>

    <section className="sd-version-sheet" role="dialog" aria-modal="true" aria-label="Version History">
      <div className="sd-version-handle" aria-hidden="true" />
      <header className="sd-version-head">
        <span />
        <strong>Version History</strong>
        <button type="button" className="sd-version-close" aria-label="Close" onClick={onClose}>
          <X size={21} />
        </button>
      </header>

      <div className="sd-version-meta">
        <strong>{documentName}</strong>
        <small>Local versions saved on this device</small>
      </div>

      <div className="sd-version-toolbar">
        <span>{versions.length} version{versions.length === 1 ? '' : 's'}</span>
        {versions.length ? <button type="button" className="sd-version-clear" onClick={onClear}>Clear History</button> : null}
      </div>

      <div className="sd-version-list">
        {!versions.length ? <div className="sd-version-empty">
          <strong>No saved versions yet</strong>
          <small>Versions are created when you save or autosave this document.</small>
        </div> : versions.map(version => (
          <div className="sd-version-row" key={version.id}>
            <div className="sd-version-info">
              <strong>{version.reason || 'Saved version'}</strong>
              <small>{formatDate(version.createdAt)}</small>
              <small>{Number(version.chapterCount || 0)} chapters · {Number(version.words || 0).toLocaleString()} words</small>
            </div>
            <div className="sd-version-actions">
              <button type="button" className="sd-version-restore" onClick={() => onRestore?.(version)}>
                <RotateCcw size={14} />
                Restore
              </button>
              <button type="button" className="sd-version-delete" aria-label="Delete version" onClick={() => onDelete?.(version.id)}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sd-version-foot">
        Up to 12 recent versions are kept locally. Restoring a version replaces the current document after confirmation.
      </div>
    </section>
  </div>
}

import { useMemo, useState } from 'react'
import { Check, Folder, FolderPlus, X } from 'lucide-react'

export default function ShadowDocsAddToSheet({
  open = false,
  documentName = 'Docs.doc',
  folders = [],
  currentFolderId = '',
  onClose,
  onCreateFolder,
  onAdd,
}) {
  const [selectedId, setSelectedId] = useState(currentFolderId || 'my-books')
  const safeFolders = useMemo(
    () => Array.isArray(folders)
      ? folders.filter(item => item && item.id && item.name).slice(0, 100)
      : [],
    [folders]
  )

  if (!open) return null

  async function createFolder() {
    const name = globalThis.prompt?.('Folder name:', '')
    if (!name?.trim()) return
    const created = await onCreateFolder?.(name.trim())
    if (created?.id) setSelectedId(created.id)
  }

  async function addDocument() {
    const target = selectedId || 'my-books'
    const result = await onAdd?.(target)
    if (result !== false) onClose?.()
  }

  return <div className="sd-addto-backdrop" role="presentation">
    <style>{`
      .sd-addto-backdrop{
        position:fixed;
        inset:0;
        z-index:19500;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background:rgba(0,0,0,.16)
      }
      .sd-addto-sheet{
        width:min(100%,560px);
        max-height:78dvh;
        overflow:hidden;
        border:1px solid #2f3034;
        border-bottom:0;
        border-radius:20px 20px 0 0;
        background:#171719;
        color:#f3f3f4;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-addto-sheet *{box-sizing:border-box}
      .sd-addto-handle{
        width:42px;
        height:4px;
        margin:8px auto 2px;
        border-radius:99px;
        background:#333439
      }
      .sd-addto-head{
        min-height:58px;
        display:grid;
        grid-template-columns:42px minmax(0,1fr) 42px;
        align-items:center;
        padding:0 14px
      }
      .sd-addto-head strong{
        text-align:center;
        font-size:18px;
        font-weight:750
      }
      .sd-addto-close{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#eeeeef
      }
      .sd-addto-file{
        display:grid;
        grid-template-columns:42px minmax(0,1fr);
        gap:11px;
        align-items:center;
        margin:0 16px 14px;
        padding:12px;
        border-radius:12px;
        background:#232427
      }
      .sd-addto-logo{
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        border-radius:8px;
        background:#2875ee;
        color:#fff;
        font-size:22px;
        font-weight:900
      }
      .sd-addto-file strong{
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:14px
      }
      .sd-addto-file small{
        display:block;
        margin-top:3px;
        color:#85868c;
        font-size:10px
      }
      .sd-addto-toolbar{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:0 16px 10px
      }
      .sd-addto-toolbar span{
        color:#999aa0;
        font-size:12px;
        font-weight:650
      }
      .sd-addto-new{
        display:flex;
        align-items:center;
        gap:6px;
        border:0;
        background:transparent;
        color:#65d7b7;
        font:inherit;
        font-size:12px;
        font-weight:700
      }
      .sd-addto-list{
        max-height:44dvh;
        overflow-y:auto;
        border-top:1px solid #2d2e32;
        border-bottom:1px solid #2d2e32
      }
      .sd-addto-row{
        width:100%;
        min-height:60px;
        display:grid;
        grid-template-columns:34px minmax(0,1fr) 26px;
        align-items:center;
        gap:10px;
        border:0;
        border-bottom:1px solid #2e2f33;
        background:#1d1e21;
        color:#f0f0f1;
        padding:0 16px;
        text-align:left
      }
      .sd-addto-row:last-child{border-bottom:0}
      .sd-addto-row svg:first-child{
        color:#b7b8bd
      }
      .sd-addto-row strong{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:14px;
        font-weight:550
      }
      .sd-addto-check{
        width:22px;
        height:22px;
        display:grid;
        place-items:center;
        border:2px solid #55575d;
        border-radius:50%
      }
      .sd-addto-row.is-selected .sd-addto-check{
        border-color:#25a884;
        background:#25a884;
        color:#fff
      }
      .sd-addto-actions{
        padding:14px 16px calc(14px + env(safe-area-inset-bottom))
      }
      .sd-addto-submit{
        width:100%;
        height:50px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        border:0;
        border-radius:10px;
        background:#25a884;
        color:#fff;
        font:inherit;
        font-size:15px;
        font-weight:750
      }
    `}</style>

    <section className="sd-addto-sheet" role="dialog" aria-modal="true" aria-label="Add To">
      <div className="sd-addto-handle" aria-hidden="true" />
      <header className="sd-addto-head">
        <span />
        <strong>Add To</strong>
        <button type="button" className="sd-addto-close" aria-label="Close Add To" onClick={onClose}>
          <X size={21} />
        </button>
      </header>

      <div className="sd-addto-file">
        <div className="sd-addto-logo" aria-hidden="true">W</div>
        <div>
          <strong>{documentName}</strong>
          <small>Choose where to keep this document</small>
        </div>
      </div>

      <div className="sd-addto-toolbar">
        <span>Folders</span>
        <button type="button" className="sd-addto-new" onClick={() => void createFolder()}>
          <FolderPlus size={16} />
          New Folder
        </button>
      </div>

      <div className="sd-addto-list">
        <button
          type="button"
          className={`sd-addto-row ${selectedId === 'my-books' ? 'is-selected' : ''}`}
          onClick={() => setSelectedId('my-books')}
        >
          <Folder size={20} />
          <strong>My Books</strong>
          <span className="sd-addto-check">{selectedId === 'my-books' ? <Check size={14} /> : null}</span>
        </button>

        {safeFolders.map(folder => (
          <button
            type="button"
            key={folder.id}
            className={`sd-addto-row ${selectedId === folder.id ? 'is-selected' : ''}`}
            onClick={() => setSelectedId(folder.id)}
          >
            <Folder size={20} />
            <strong>{folder.name}</strong>
            <span className="sd-addto-check">{selectedId === folder.id ? <Check size={14} /> : null}</span>
          </button>
        ))}
      </div>

      <div className="sd-addto-actions">
        <button type="button" className="sd-addto-submit" onClick={() => void addDocument()}>
          Add Here
        </button>
      </div>
    </section>
  </div>
}

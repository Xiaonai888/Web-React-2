import { useEffect, useState } from 'react'
import { FileImage, ImageDown, X } from 'lucide-react'

const FORMATS = ['png', 'jpg']
const WIDTHS = [1080, 1440, 2160]

export default function ShadowDocsExportImageSheet({
  open = false,
  documentName = 'Docs.doc',
  chapterTitle = 'Current Chapter',
  onClose,
  onExport,
}) {
  const [scope, setScope] = useState('current')
  const [format, setFormat] = useState('png')
  const [width, setWidth] = useState(1440)
  const [includeTitle, setIncludeTitle] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setBusy(false)
      setError('')
    }
  }, [open])

  if (!open) return null

  async function exportImage() {
    setBusy(true)
    setError('')
    try {
      const result = await onExport?.({
        scope,
        format,
        width,
        includeTitle,
      })
      if (result !== false) onClose?.()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not export image.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="sd-image-export-backdrop">
    <style>{`
      .sd-image-export-backdrop{
        position:fixed;
        inset:0;
        z-index:19500;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background:rgba(0,0,0,.16)
      }
      .sd-image-export-sheet{
        width:min(100%,560px);
        max-height:86dvh;
        overflow:hidden;
        border:1px solid #303136;
        border-bottom:0;
        border-radius:20px 20px 0 0;
        background:#171719;
        color:#f3f3f4;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-image-export-sheet *{box-sizing:border-box}
      .sd-image-export-handle{
        width:42px;
        height:4px;
        margin:8px auto 2px;
        border-radius:999px;
        background:#36373b
      }
      .sd-image-export-head{
        min-height:58px;
        display:grid;
        grid-template-columns:42px minmax(0,1fr) 42px;
        align-items:center;
        padding:0 14px
      }
      .sd-image-export-head strong{
        text-align:center;
        font-size:18px;
        font-weight:750
      }
      .sd-image-export-close{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#efeff0
      }
      .sd-image-export-file{
        display:grid;
        grid-template-columns:44px minmax(0,1fr);
        gap:12px;
        align-items:center;
        margin:0 16px 14px;
        padding:12px;
        border-radius:12px;
        background:#232427
      }
      .sd-image-export-icon{
        width:44px;
        height:44px;
        display:grid;
        place-items:center;
        border-radius:9px;
        background:#2b7cf0;
        color:#fff
      }
      .sd-image-export-file strong{
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:14px
      }
      .sd-image-export-file small{
        display:block;
        margin-top:3px;
        color:#87888f;
        font-size:10px
      }
      .sd-image-export-section{
        margin:0 16px 14px
      }
      .sd-image-export-label{
        display:block;
        margin:0 2px 8px;
        color:#95969d;
        font-size:12px;
        font-weight:650
      }
      .sd-image-export-card{
        overflow:hidden;
        border:1px solid #303136;
        border-radius:13px;
        background:#232427
      }
      .sd-image-export-row{
        min-height:60px;
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        align-items:center;
        gap:12px;
        padding:0 15px;
        border-bottom:1px solid #34353a
      }
      .sd-image-export-row:last-child{border-bottom:0}
      .sd-image-export-row span{
        font-size:14px
      }
      .sd-image-export-select{
        min-width:132px;
        height:38px;
        border:1px solid #3c3d43;
        border-radius:8px;
        outline:0;
        background:#1c1d20;
        color:#f0f0f1;
        padding:0 10px;
        font:inherit;
        font-size:12px
      }
      .sd-image-export-select:focus{
        border-color:#25a884
      }
      .sd-image-export-toggle{
        position:relative;
        width:44px;
        height:26px
      }
      .sd-image-export-toggle input{
        position:absolute;
        opacity:0;
        pointer-events:none
      }
      .sd-image-export-toggle span{
        position:absolute;
        inset:0;
        border-radius:999px;
        background:#4a4b50
      }
      .sd-image-export-toggle span::after{
        content:'';
        position:absolute;
        top:3px;
        left:3px;
        width:20px;
        height:20px;
        border-radius:50%;
        background:#fff;
        transition:transform .16s ease
      }
      .sd-image-export-toggle input:checked+span{
        background:#25a884
      }
      .sd-image-export-toggle input:checked+span::after{
        transform:translateX(18px)
      }
      .sd-image-export-error{
        margin:0 18px 10px;
        color:#ff9090;
        font-size:11px
      }
      .sd-image-export-actions{
        padding:0 16px calc(14px + env(safe-area-inset-bottom))
      }
      .sd-image-export-button{
        width:100%;
        height:52px;
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
      .sd-image-export-button:disabled{
        opacity:.62
      }
    `}</style>

    <section className="sd-image-export-sheet" role="dialog" aria-modal="true" aria-label="Export as Image">
      <div className="sd-image-export-handle" aria-hidden="true" />
      <header className="sd-image-export-head">
        <span />
        <strong>Export as Image</strong>
        <button type="button" className="sd-image-export-close" aria-label="Close" onClick={onClose}>
          <X size={21} />
        </button>
      </header>

      <div className="sd-image-export-file">
        <div className="sd-image-export-icon"><FileImage size={23} /></div>
        <div>
          <strong>{documentName}</strong>
          <small>{chapterTitle}</small>
        </div>
      </div>

      <div className="sd-image-export-section">
        <span className="sd-image-export-label">Export Settings</span>
        <div className="sd-image-export-card">
          <div className="sd-image-export-row">
            <span>Content</span>
            <select className="sd-image-export-select" value={scope} onChange={event => setScope(event.target.value)}>
              <option value="current">Current Chapter</option>
              <option value="all">All Chapters</option>
            </select>
          </div>

          <div className="sd-image-export-row">
            <span>Format</span>
            <select className="sd-image-export-select" value={format} onChange={event => setFormat(event.target.value)}>
              {FORMATS.map(item => <option key={item} value={item}>{item.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="sd-image-export-row">
            <span>Image Width</span>
            <select className="sd-image-export-select" value={width} onChange={event => setWidth(Number(event.target.value))}>
              {WIDTHS.map(item => <option key={item} value={item}>{item}px</option>)}
            </select>
          </div>

          <div className="sd-image-export-row">
            <span>Include Chapter Title</span>
            <label className="sd-image-export-toggle">
              <input type="checkbox" checked={includeTitle} onChange={event => setIncludeTitle(event.target.checked)} />
              <span />
            </label>
          </div>
        </div>
      </div>

      {error ? <p className="sd-image-export-error" role="alert">{error}</p> : null}

      <div className="sd-image-export-actions">
        <button type="button" className="sd-image-export-button" disabled={busy} onClick={() => void exportImage()}>
          <ImageDown size={19} />
          {busy ? 'Creating Image…' : 'Export Image'}
        </button>
      </div>
    </section>
  </div>
}

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  FileDown,
  MoreHorizontal,
  Printer,
  X,
} from 'lucide-react'
import { buildShadowDocsPrintHTML } from './ShadowDocsPDFExport'
import { startShadowDocsPDFExportTask } from './ShadowDocsPDFExportTask'

const PAPER_SIZES = ['A4', 'A5', 'B5']
const MARGINS = {
  normal: 18,
  narrow: 10,
  wide: 28,
}



function cleanNumber(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.max(min, Math.min(max, number))
}

function previewBook(book, settings) {
  if (!book) return null
  return {
    ...book,
    settings: {
      ...(book.settings || {}),
      size: settings.paperSize,
      orientation: settings.orientation,
      margin: settings.margin,
      pageColor: '#ffffff',
      textColor: settings.grayscale ? '#111111' : (book.settings?.textColor || '#242139'),
    },
  }
}

function printHTML(html) {
  if (typeof document === 'undefined') throw new Error('Printing requires a browser.')
  const frame = document.createElement('iframe')
  frame.setAttribute('title', 'Shadow Docs print')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.position = 'fixed'
  frame.style.right = '0'
  frame.style.bottom = '0'
  frame.style.width = '1px'
  frame.style.height = '1px'
  frame.style.border = '0'
  frame.style.opacity = '0'
  frame.style.pointerEvents = 'none'
  document.body.appendChild(frame)

  const printWindow = frame.contentWindow
  const printDocument = frame.contentDocument
  if (!printWindow || !printDocument) {
    frame.remove()
    throw new Error('Could not prepare the print dialog.')
  }

  let started = false
  const cleanup = () => window.setTimeout(() => frame.remove(), 800)
  const startPrint = () => {
    if (started) return
    started = true
    const ready = printDocument.fonts?.ready || Promise.resolve()
    Promise.resolve(ready).then(() => {
      printWindow.focus()
      printWindow.addEventListener?.('afterprint', cleanup, { once: true })
      printWindow.print()
      window.setTimeout(cleanup, 5000)
    }).catch(cleanup)
  }

  frame.onload = startPrint
  printDocument.open()
  printDocument.write(html)
  printDocument.close()
  window.setTimeout(startPrint, 500)
}

export default function ShadowDocsPrintPanel({
  open = false,
  book,
  currentChapterId = '',
  onClose,
  onPrint,
  onChangeSettings,
}) {
  const sourceSettings = book?.settings || {}
  const [menuOpen, setMenuOpen] = useState(false)
  const [range, setRange] = useState('all')
  const [paperSize, setPaperSize] = useState(PAPER_SIZES.includes(sourceSettings.size) ? sourceSettings.size : 'A4')
  const [orientation, setOrientation] = useState(sourceSettings.orientation === 'landscape' ? 'landscape' : 'portrait')
  const [marginMode, setMarginMode] = useState('normal')
  const [customMargin, setCustomMargin] = useState(cleanNumber(sourceSettings.margin, 10, 35, 18))
  const [grayscale, setGrayscale] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setMenuOpen(false)
      setError('')
      return
    }
    setPaperSize(PAPER_SIZES.includes(sourceSettings.size) ? sourceSettings.size : 'A4')
    setOrientation(sourceSettings.orientation === 'landscape' ? 'landscape' : 'portrait')
    setCustomMargin(cleanNumber(sourceSettings.margin, 10, 35, 18))
  }, [open, sourceSettings.size, sourceSettings.orientation, sourceSettings.margin])

  const margin = marginMode === 'custom'
    ? cleanNumber(customMargin, 10, 35, 18)
    : MARGINS[marginMode] || 18

  const selectedBook = useMemo(() => {
    if (!book) return null
    if (range !== 'current' || !currentChapterId) return book
    const chapter = book.chapters?.find(item => item.id === currentChapterId)
    if (!chapter) return book
    return { ...book, chapters: [chapter] }
  }, [book, range, currentChapterId])

  const renderedBook = useMemo(
    () => previewBook(selectedBook, { paperSize, orientation, margin, grayscale }),
    [selectedBook, paperSize, orientation, margin, grayscale]
  )

  const previewHTML = useMemo(() => {
    if (!renderedBook) return ''
    try {
      const html = buildShadowDocsPrintHTML(renderedBook)
      if (!grayscale) return html
      return html.replace('</style>', '.chapter-body img{filter:grayscale(1)}html{filter:grayscale(1)}</style>')
    } catch {
      return ''
    }
  }, [renderedBook, grayscale])

  if (!open || !book) return null

  const chapterCount = Array.isArray(selectedBook?.chapters) ? selectedBook.chapters.length : 0
  const documentName = String(book.title || 'Docs').trim() || 'Docs'

  function persistLayout() {
    onChangeSettings?.({
      size: paperSize,
      orientation,
      margin,
    })
  }

  function handlePrint() {
    setError('')
    try {
      persistLayout()
      const payload = {
        range,
        paperSize,
        orientation,
        margin,
        grayscale,
      }
      if (typeof onPrint === 'function') {
        onPrint(payload, renderedBook)
        return
      }
      if (!previewHTML) throw new Error('Could not prepare the printable document.')
      printHTML(previewHTML)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not open print preview.')
    }
  }

  function handleExportPDF() {
    setMenuOpen(false)
    setError('')
    persistLayout()
    if (!previewHTML) {
      setError('Could not create PDF file.')
      return
    }
    void startShadowDocsPDFExportTask({
      fileName: `${documentName}.pdf`,
      onReady: () => printHTML(previewHTML),
    }).catch(failure => {
      setError(failure instanceof Error ? failure.message : 'Could not create PDF file.')
    })
  }

  return <section className="sd-print-panel" aria-label="Print">
    <style>{`
      .sd-print-panel{
        position:fixed;
        inset:0;
        z-index:20000;
        display:flex;
        flex-direction:column;
        overflow:hidden;
        background:#171719;
        color:#f3f3f4;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-print-panel *{box-sizing:border-box}
      .sd-print-header{
        height:62px;
        flex:none;
        display:grid;
        grid-template-columns:42px minmax(0,1fr) 42px;
        align-items:center;
        gap:8px;
        padding:env(safe-area-inset-top) 14px 0;
        border-bottom:1px solid #2a2b2f;
        background:#171719
      }
      .sd-print-header button{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:10px;
        background:transparent;
        color:#f2f2f3
      }
      .sd-print-header strong{
        font-size:18px;
        font-weight:750
      }
      .sd-print-menu-wrap{
        position:relative
      }
      .sd-print-more-menu{
        position:absolute;
        z-index:4;
        top:43px;
        right:0;
        width:188px;
        overflow:hidden;
        border:1px solid #34353a;
        border-radius:12px;
        background:#242529
      }
      .sd-print-more-menu button{
        width:100%;
        min-height:56px;
        display:flex;
        align-items:center;
        justify-content:flex-start;
        gap:12px;
        border:0;
        border-radius:0;
        background:transparent;
        color:#f2f2f3;
        padding:0 16px;
        font-size:14px
      }
      .sd-print-more-menu button:active{background:#303136}
      .sd-print-scroll{
        flex:1;
        overflow-y:auto;
        overscroll-behavior:contain;
        padding-bottom:calc(94px + env(safe-area-inset-bottom))
      }
      .sd-print-preview{
        min-height:350px;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:22px;
        background:#303033
      }
      .sd-print-paper{
        position:relative;
        width:min(72vw,310px);
        aspect-ratio:210/297;
        overflow:hidden;
        background:#fff;
        box-shadow:0 5px 18px #0006
      }
      .sd-print-paper.is-landscape{
        width:min(84vw,430px);
        aspect-ratio:297/210
      }
      .sd-print-paper iframe{
        width:100%;
        height:100%;
        border:0;
        background:#fff;
        pointer-events:none
      }
      .sd-print-preview-badge{
        position:absolute;
        left:50%;
        bottom:12px;
        transform:translateX(-50%);
        min-width:92px;
        height:38px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        border-radius:999px;
        background:#737373e8;
        color:#fff;
        font-size:13px
      }
      .sd-print-preview-check{
        width:28px;
        height:28px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:#25a884;
        font-size:18px;
        font-weight:800
      }
      .sd-print-document-meta{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:14px 18px;
        border-bottom:1px solid #2a2b2f;
        background:#1b1b1e
      }
      .sd-print-document-meta strong{
        display:block;
        max-width:65vw;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:14px
      }
      .sd-print-document-meta small{
        display:block;
        margin-top:3px;
        color:#818289;
        font-size:10px
      }
      .sd-print-document-meta span{
        flex:none;
        color:#85868d;
        font-size:11px
      }
      .sd-print-section{
        margin:14px 16px 0
      }
      .sd-print-section-title{
        margin:0 2px 9px;
        color:#9a9ba2;
        font-size:13px;
        font-weight:500
      }
      .sd-print-card{
        overflow:hidden;
        border:1px solid #303136;
        border-radius:14px;
        background:#252629
      }
      .sd-print-row{
        width:100%;
        min-height:62px;
        display:grid;
        grid-template-columns:minmax(0,1fr) auto 18px;
        align-items:center;
        gap:10px;
        border:0;
        border-bottom:1px solid #35363b;
        background:transparent;
        color:#f2f2f3;
        padding:0 16px;
        text-align:left
      }
      .sd-print-row:last-child{border-bottom:0}
      .sd-print-row>span:first-child{
        font-size:15px
      }
      .sd-print-row-value{
        color:#909198;
        font-size:13px
      }
      .sd-print-select{
        min-width:112px;
        height:38px;
        border:1px solid #3b3c42;
        border-radius:8px;
        outline:0;
        background:#1d1e21;
        color:#ededee;
        padding:0 9px;
        font:inherit;
        font-size:12px
      }
      .sd-print-input{
        width:118px;
        height:38px;
        border:1px solid #3b3c42;
        border-radius:8px;
        outline:0;
        background:#1d1e21;
        color:#ededee;
        padding:0 9px;
        font:inherit;
        font-size:12px
      }
      .sd-print-input:focus,.sd-print-select:focus{
        border-color:#25a884
      }
      .sd-print-toggle{
        position:relative;
        width:44px;
        height:26px;
        flex:none
      }
      .sd-print-toggle input{
        position:absolute;
        opacity:0;
        pointer-events:none
      }
      .sd-print-toggle span{
        position:absolute;
        inset:0;
        border-radius:999px;
        background:#4b4c50
      }
      .sd-print-toggle span::after{
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
      .sd-print-toggle input:checked+span{
        background:#25a884
      }
      .sd-print-toggle input:checked+span::after{
        transform:translateX(18px)
      }
      .sd-print-system-note{
        margin:14px 18px 0;
        color:#777981;
        font-size:11px;
        line-height:1.55
      }
      .sd-print-error{
        margin:12px 18px 0;
        color:#ff8e8e;
        font-size:11px
      }
      .sd-print-footer{
        position:fixed;
        z-index:2;
        left:0;
        right:0;
        bottom:0;
        padding:12px 16px calc(12px + env(safe-area-inset-bottom));
        border-top:1px solid #2b2c31;
        background:#171719
      }
      .sd-print-button{
        width:100%;
        height:54px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:9px;
        border:0;
        border-radius:10px;
        background:#25a884;
        color:#fff;
        font:inherit;
        font-size:17px;
        font-weight:750
      }
      @media(min-width:760px){
        .sd-print-panel{
          left:50%;
          width:min(720px,100%);
          transform:translateX(-50%);
          border-left:1px solid #2d2e32;
          border-right:1px solid #2d2e32
        }
        .sd-print-footer{
          left:50%;
          width:min(720px,100%);
          transform:translateX(-50%)
        }
      }
    `}</style>

    <header className="sd-print-header">
      <button type="button" aria-label="Back" onClick={onClose}><ArrowLeft size={22} /></button>
      <strong>Print</strong>
      <div className="sd-print-menu-wrap">
        <button type="button" aria-label="More print options" onClick={() => setMenuOpen(value => !value)}>
          {menuOpen ? <X size={21} /> : <MoreHorizontal size={24} />}
        </button>
        {menuOpen ? <div className="sd-print-more-menu">
          <button type="button" onClick={handleExportPDF}><FileDown size={21} /> Export as PDF</button>
        </div> : null}
      </div>
    </header>

    <div className="sd-print-scroll">
      <div className="sd-print-preview">
        <div className={`sd-print-paper ${orientation === 'landscape' ? 'is-landscape' : ''}`}>
          {previewHTML ? <iframe title="Print preview" sandbox="" srcDoc={previewHTML} /> : null}
          <div className="sd-print-preview-badge">
            <span className="sd-print-preview-check">✓</span>
            <span>{chapterCount || 1} section{chapterCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      <div className="sd-print-document-meta">
        <div>
          <strong>{documentName}.doc</strong>
          <small>{paperSize} · {orientation === 'landscape' ? 'Landscape' : 'Portrait'} · {margin} mm margins</small>
        </div>
        <span>Preview</span>
      </div>

      <div className="sd-print-section">
        <h2 className="sd-print-section-title">Print Settings</h2>
        <div className="sd-print-card">
          <div className="sd-print-row">
            <span>Range</span>
            <select className="sd-print-select" value={range} onChange={event => setRange(event.target.value)}>
              <option value="all">All Pages</option>
              <option value="current">Current Chapter</option>
            </select>
            <ChevronRight size={17} color="#66686e" />
          </div>

          <div className="sd-print-row">
            <span>Paper Size</span>
            <select className="sd-print-select" value={paperSize} onChange={event => setPaperSize(event.target.value)}>
              {PAPER_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
            <ChevronRight size={17} color="#66686e" />
          </div>

          <div className="sd-print-row">
            <span>Paper Orientation</span>
            <select className="sd-print-select" value={orientation} onChange={event => setOrientation(event.target.value)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
            <ChevronRight size={17} color="#66686e" />
          </div>

          <div className="sd-print-row">
            <span>Margins</span>
            <select className="sd-print-select" value={marginMode} onChange={event => setMarginMode(event.target.value)}>
              <option value="normal">Normal</option>
              <option value="narrow">Narrow</option>
              <option value="wide">Wide</option>
              <option value="custom">Custom</option>
            </select>
            <ChevronRight size={17} color="#66686e" />
          </div>

          {marginMode === 'custom' ? <div className="sd-print-row">
            <span>Custom Margin</span>
            <input className="sd-print-input" type="number" min="10" max="35" value={customMargin} onChange={event => setCustomMargin(event.target.value)} />
            <span className="sd-print-row-value">mm</span>
          </div> : null}

          <div className="sd-print-row">
            <span>Black & White</span>
            <label className="sd-print-toggle">
              <input type="checkbox" checked={grayscale} onChange={event => setGrayscale(event.target.checked)} />
              <span />
            </label>
            <span />
          </div>
        </div>
      </div>

      <p className="sd-print-system-note">
        Printer, copies, duplex printing, custom page ranges and pages per sheet are handled by your phone or browser system print dialog after you tap Print.
      </p>

      {error ? <p className="sd-print-error" role="alert">{error}</p> : null}
    </div>

    <footer className="sd-print-footer">
      <button type="button" className="sd-print-button" onClick={handlePrint}>
        <Printer size={20} />
        Print
      </button>
    </footer>
  </section>
}

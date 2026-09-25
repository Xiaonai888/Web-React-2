import { useMemo, useState } from 'react'
import { AlertCircle, BookOpen, Download, Eye, FileDown, FileText, Printer } from 'lucide-react'
import { buildShadowDocsPrintHTML, downloadShadowDocsPrintHTML } from './ShadowDocsPDFExport'
import { inspectShadowDocsProject } from './ShadowDocsQualityReport'
import { SHADOW_DOCS_FONT_OPTIONS } from './ShadowDocsFontCatalog'

const PAGE_SIZES = { A5: [148, 210], A4: [210, 297], B5: [176, 250] }

export default function ShadowDocsPDFStudioPanel({ book, onPrint, onDownloadBackup, onChangeSettings }) {
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const report = useMemo(() => inspectShadowDocsProject(book), [book])
  const issues = report.issues
  const html = useMemo(() => {
    if (!book || !report.canExport) return ''
    try { return buildShadowDocsPrintHTML(book) } catch { return '' }
  }, [book, report.canExport])
  const settings = book?.settings || {}
  const selectedFont = FONT_OPTIONS.includes(settings.font) ? settings.font : FONT_OPTIONS[0]
  const selectedFontSize = Math.min(24, Math.max(10, Number(settings.fontSize) || 13))
  const chapterCount = Array.isArray(book?.chapters) ? book.chapters.length : 0
  const pageSize = PAGE_SIZES[settings.size] ? settings.size : 'A5'
  const [paperWidth, paperHeight] = PAGE_SIZES[pageSize]
  const margin = Math.min(35, Math.max(10, Number(settings.margin) || 18))
  const gutter = Math.min(20, Math.max(0, Number(settings.gutter) || 0))
  const previewHtml = useMemo(() => {
    if (!html) return ''
    const screenStyle = `<style media="screen">
      html{background:#eae7ef}
      body{max-width:none;width:auto;margin:0;padding:10px 0;background:transparent;box-shadow:none}
      .chapter{box-sizing:border-box;width:${paperWidth}mm;max-width:calc(100% - 20px);min-height:${paperHeight}mm;margin:14px auto;padding:${margin}mm;box-shadow:0 5px 20px #26203725;background:#fff;color:#242139;break-before:auto;page-break-before:auto}
      .chapter{border:0;break-before:auto;page-break-before:auto}
      .chapter-body hr.sd-page-break{border:0;border-top:2px dashed #8d76be;margin:1.5em 0}
      img{max-width:100%;height:auto}
    </style>`
    return html.replace('</head>', `${screenStyle}</head>`)
  }, [html, paperWidth, paperHeight, margin])

  function downloadPrintable() {
    if (!book || !report.canExport) return
    try {
      downloadShadowDocsPrintHTML(book)
      setError('')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not prepare the printable file.')
    }
  }

  function printBook() {
    if (!report.canExport || !html || typeof onPrint !== 'function') return
    try {
      onPrint()
      setError('')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not open the print dialog.')
    }
  }

  if (!book) return (
    <section className="sd-card" aria-label="PDF Studio">
      <h2>PDF Studio</h2>
      <p className="mt-2 text-sm text-[#77758b] dark:text-white/65">Create or select a book in My Books to prepare a printable document.</p>
    </section>
  )

  return (
    <section className="sd-stack" aria-label="PDF Studio">
      <div className="sd-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="sd-eyebrow">PDF STUDIO</span>
            <h2 className="mt-2 flex items-center gap-2"><FileDown size={20} /> Prepare your book</h2>
            <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Print directly from your browser or download a printable HTML file. Your book remains on this device.</p>
          </div>
          <span className="rounded-xl bg-[#f2edfc] px-3 py-2 text-xs font-semibold text-[#7653bd] dark:bg-white/10 dark:text-[#d4c1ff]">{pageSize}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f8f5fe] p-3 dark:bg-white/5"><BookOpen size={17} className="text-[#7653bd]" /><strong className="mt-2 block truncate text-sm">{book.title || 'Untitled Book'}</strong><span className="text-[11px] text-[#77758b] dark:text-white/60">Book</span></div>
          <div className="rounded-xl bg-[#f8f5fe] p-3 dark:bg-white/5"><FileText size={17} className="text-[#7653bd]" /><strong className="mt-2 block text-sm">{chapterCount}</strong><span className="text-[11px] text-[#77758b] dark:text-white/60">Chapters</span></div>
          <div className="col-span-2 rounded-xl bg-[#f8f5fe] p-3 dark:bg-white/5 sm:col-span-1"><Printer size={17} className="text-[#7653bd]" /><strong className="mt-2 block text-sm">{settings.fontSize || 13} pt</strong><span className="text-[11px] text-[#77758b] dark:text-white/60">Body text size</span></div>
        </div>
        <div className="mt-4 rounded-xl border border-[#e9e5f1] p-3 dark:border-white/10">
          <h3 className="text-sm font-semibold">Text settings for PDF</h3>
          <p className="mt-1 text-[11px] text-[#77758b] dark:text-white/60">These settings also apply to your book in Write and are saved on this device.</p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold" htmlFor="sd-pdf-font">Font family
              <select id="sd-pdf-font" className="sd-field mt-2 w-full" value={selectedFont} disabled={typeof onChangeSettings !== 'function'} onChange={event => onChangeSettings?.({ font: event.target.value })}>{FONT_OPTIONS.map(item => <option key={item} value={item}>{item}</option>)}</select>
            </label>
            <div>
              <label className="flex items-center justify-between gap-2 text-xs font-semibold" htmlFor="sd-pdf-fontsize">Body text size <span>{selectedFontSize} pt</span></label>
              <input id="sd-pdf-fontsize" className="mt-3 w-full accent-[#7653bd]" type="range" min="10" max="24" step="1" value={selectedFontSize} disabled={typeof onChangeSettings !== 'function'} onChange={event => onChangeSettings?.({ fontSize: Number(event.target.value) })} />
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-[#e9e5f1] p-3 dark:border-white/10">
          <h3 className="text-sm font-semibold">Printed header, footer & page numbers</h3>
          <p className="mt-1 text-[11px] leading-5 text-[#77758b] dark:text-white/60">Nothing is added automatically. Leave a text field empty to omit it. These options are saved with this book.</p>
          <label className="mt-3 block text-xs font-semibold" htmlFor="sd-print-header">Header text</label>
          <input id="sd-print-header" className="sd-field mt-2 w-full" type="text" maxLength={80} placeholder="Optional text at the top of each printed page" value={settings.printHeader || ''} disabled={typeof onChangeSettings !== 'function'} onChange={event => onChangeSettings?.({ printHeader: event.target.value })}/>
          <label className="mt-3 block text-xs font-semibold" htmlFor="sd-print-footer">Footer text</label>
          <input id="sd-print-footer" className="sd-field mt-2 w-full" type="text" maxLength={60} placeholder="Optional text at the bottom-left" value={settings.printFooter || ''} disabled={typeof onChangeSettings !== 'function'} onChange={event => onChangeSettings?.({ printFooter: event.target.value })}/>
          <label className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold" htmlFor="sd-print-numbers">Print page numbers at bottom center
            <input id="sd-print-numbers" type="checkbox" className="h-4 w-4 accent-[#7653bd]" checked={settings.pageNumbers === true} disabled={typeof onChangeSettings !== 'function'} onChange={event => onChangeSettings?.({ pageNumbers: event.target.checked })}/>
          </label>
          <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/60">In the browser print dialog, turn off “Headers and footers” to remove the browser’s date, URL and automatic page numbers. The settings above are separate.</p>
        </div>
        {issues.length > 0 && <div role={report.canExport ? 'status' : 'alert'} className="mt-4 rounded-xl border border-[#f2d9a2] bg-[#fffaed] p-3 text-[#785519] dark:border-[#70572f] dark:bg-[#302719] dark:text-[#f1d59b]">
          <div className="flex items-center gap-2 text-xs font-bold"><AlertCircle size={16} /> {report.canExport ? 'Review before printing' : 'Fix these errors before printing'}</div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] leading-5">{issues.map(issue => <li key={issue.code}>{issue.severity === 'error' ? 'Error: ' : ''}{issue.message}</li>)}</ul>
        </div>}
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={printBook} disabled={!report.canExport || !html || typeof onPrint !== 'function'} className="sd-button sd-button-primary"><Printer size={16} /> Print / Save as PDF</button>
          <button type="button" onClick={downloadPrintable} disabled={!report.canExport || !html} className="sd-button sd-button-ghost"><Download size={16} /> Download printable HTML</button>
          {typeof onDownloadBackup === 'function' && <button type="button" onClick={() => onDownloadBackup(book)} className="sd-button sd-button-ghost"><Download size={16} /> Backup editable project</button>}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/60">For a PDF, choose “Save as PDF” in your browser’s print dialog. Check Khmer fonts, page breaks, margins and printer requirements before physical printing.</p>
      </div>
      <div className="sd-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="flex items-center gap-2"><Eye size={17} /> Paper layout preview</h2><p className="mt-1 text-xs text-[#77758b] dark:text-white/60">Check manuscript typography and paper size before printing.</p></div>
          <button type="button" onClick={() => setShowPreview(value => !value)} disabled={!previewHtml} aria-expanded={showPreview} className="sd-button sd-button-ghost">{showPreview ? 'Hide preview' : 'Show preview'}</button>
        </div>
        {showPreview && previewHtml && <>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#77758b] dark:text-white/65"><span className="rounded-lg border border-[#e9e5f1] px-2 py-1 dark:border-white/15">Paper: {paperWidth} × {paperHeight} mm</span><span className="rounded-lg border border-[#e9e5f1] px-2 py-1 dark:border-white/15">Margin: {margin} mm</span><span className="rounded-lg border border-[#e9e5f1] px-2 py-1 dark:border-white/15">Binding gutter: {gutter} mm</span></div>
          <iframe key={`${book.id}-${pageSize}-${margin}-${gutter}`} title="Book paper layout preview" sandbox="" srcDoc={previewHtml} className="mt-4 h-[620px] w-full rounded-xl border border-[#e9e5f1] bg-white dark:border-white/10" />
          <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/60">Paper sheets here show section starts, not automatic page-by-page text overflow or final page numbers. For exact page breaks and binding margins, use your browser’s print preview below.</p>
          <button type="button" onClick={printBook} disabled={!report.canExport || typeof onPrint !== 'function'} className="sd-button sd-button-primary mt-3"><Printer size={16} /> Check actual print pages</button>
        </>}
      </div>
    </section>
  )
}

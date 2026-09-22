import { useMemo, useState } from 'react'
import { AlertCircle, BookOpen, Download, FileDown, FileText, Printer } from 'lucide-react'
import { buildShadowDocsPrintHTML, downloadShadowDocsPrintHTML, inspectShadowDocsForPDF } from './ShadowDocsPDFExport'

export default function ShadowDocsPDFStudioPanel({ book, onPrint, onDownloadBackup }) {
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const issues = useMemo(() => inspectShadowDocsForPDF(book), [book])
  const html = useMemo(() => {
    if (!book) return ''
    try { return buildShadowDocsPrintHTML(book) } catch { return '' }
  }, [book])
  const settings = book?.settings || {}
  const chapterCount = Array.isArray(book?.chapters) ? book.chapters.length : 0

  function downloadPrintable() {
    if (!book) return
    try {
      downloadShadowDocsPrintHTML(book)
      setError('')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not prepare the printable file.')
    }
  }

  function printBook() {
    if (typeof onPrint !== 'function') return
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
          <span className="rounded-xl bg-[#f2edfc] px-3 py-2 text-xs font-semibold text-[#7653bd] dark:bg-white/10 dark:text-[#d4c1ff]">{settings.size || 'A5'}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f8f5fe] p-3 dark:bg-white/5"><BookOpen size={17} className="text-[#7653bd]" /><strong className="mt-2 block truncate text-sm">{book.title || 'Untitled Book'}</strong><span className="text-[11px] text-[#77758b] dark:text-white/60">Book</span></div>
          <div className="rounded-xl bg-[#f8f5fe] p-3 dark:bg-white/5"><FileText size={17} className="text-[#7653bd]" /><strong className="mt-2 block text-sm">{chapterCount}</strong><span className="text-[11px] text-[#77758b] dark:text-white/60">Chapters</span></div>
          <div className="col-span-2 rounded-xl bg-[#f8f5fe] p-3 dark:bg-white/5 sm:col-span-1"><Printer size={17} className="text-[#7653bd]" /><strong className="mt-2 block text-sm">{settings.fontSize || 13} pt</strong><span className="text-[11px] text-[#77758b] dark:text-white/60">Body text size</span></div>
        </div>
        {issues.length > 0 && <div role="status" className="mt-4 rounded-xl border border-[#f2d9a2] bg-[#fffaed] p-3 text-[#785519] dark:border-[#70572f] dark:bg-[#302719] dark:text-[#f1d59b]">
          <div className="flex items-center gap-2 text-xs font-bold"><AlertCircle size={16} /> Review before printing</div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] leading-5">{issues.map(issue => <li key={issue}>{issue}</li>)}</ul>
        </div>}
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={printBook} disabled={!html || typeof onPrint !== 'function'} className="sd-button sd-button-primary"><Printer size={16} /> Print / Save as PDF</button>
          <button type="button" onClick={downloadPrintable} disabled={!html} className="sd-button sd-button-ghost"><Download size={16} /> Download printable HTML</button>
          {typeof onDownloadBackup === 'function' && <button type="button" onClick={() => onDownloadBackup(book)} className="sd-button sd-button-ghost"><Download size={16} /> Backup editable project</button>}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/60">For a PDF, choose “Save as PDF” in your browser’s print dialog. Check Khmer fonts, page breaks, margins and printer requirements before physical printing.</p>
      </div>
      <div className="sd-card">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2>Printable preview</h2><p className="mt-1 text-xs text-[#77758b] dark:text-white/60">Approximate preview; your browser controls final page breaks.</p></div><button type="button" onClick={() => setShowPreview(value => !value)} disabled={!html} aria-expanded={showPreview} className="sd-button sd-button-ghost">{showPreview ? 'Hide preview' : 'Show preview'}</button></div>
        {showPreview && html && <iframe title="Book printable preview" sandbox="" srcDoc={html} className="mt-4 h-[520px] w-full rounded-xl border border-[#e9e5f1] bg-white dark:border-white/10" />}
      </div>
    </section>
  )
}

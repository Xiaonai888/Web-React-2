import { useRef, useState } from 'react'
import { FileText, Upload } from 'lucide-react'
import { readShadowDocsPlainText } from './ShadowDocsPlainTextImport'

export default function ShadowDocsPlainTextImportPanel({ book, onImportParsed }) {
  const inputRef = useRef(null)
  const [splitHeadings, setSplitHeadings] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function upload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !book || typeof onImportParsed !== 'function') return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const { chapters } = await readShadowDocsPlainText(file, splitHeadings)
      await onImportParsed(chapters)
      setSuccess(`${chapters.length} chapter${chapters.length === 1 ? '' : 's'} added to this book. Download a project backup regularly.`)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'The text file could not be imported.')
    } finally { setBusy(false) }
  }

  return <section className="sd-card" aria-label="Import text manuscript">
    <div className="flex items-center gap-2"><FileText size={19} className="text-[#7653bd]"/><h2>Import text manuscript</h2></div>
    <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Add chapters from a UTF-8 .txt file to the current book. Existing chapters will not be replaced.</p>
    <label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" checked={splitHeadings} onChange={event => setSplitHeadings(event.target.checked)} disabled={busy}/> Split at chapter headings (Chapter 1, ភាគទី១, ជំពូកទី១)</label>
    <button type="button" className="sd-button sd-button-ghost mt-4" disabled={!book || busy || typeof onImportParsed !== 'function'} onClick={() => inputRef.current?.click()}><Upload size={16}/>{busy ? 'Importing…' : 'Import .txt (up to 2 MB)'}</button>
    <input ref={inputRef} type="file" hidden accept=".txt,text/plain" onChange={upload}/>
    {error && <p role="alert" className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p>}
    {success && <p role="status" className="mt-3 text-xs text-green-700 dark:text-green-300">{success}</p>}
  </section>
}

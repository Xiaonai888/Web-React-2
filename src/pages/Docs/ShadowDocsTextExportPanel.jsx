import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { downloadShadowDocsText } from './ShadowDocsTextExport'

export default function ShadowDocsTextExportPanel({ book }) {
  const [chapterId, setChapterId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const chapters = Array.isArray(book?.chapters) ? book.chapters : []

  function exportText() {
    try {
      downloadShadowDocsText(book, chapterId)
      setError('')
      setMessage('The text file is ready. Your editable book has not changed.')
    } catch (failure) {
      setMessage('')
      setError(failure instanceof Error ? failure.message : 'Could not export text.')
    }
  }

  return <section aria-label="Export manuscript text" className="sd-card">
    <h2 className="flex items-center gap-2"><FileText size={19}/> Export plain text</h2>
    <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Download the complete manuscript or one chapter as a UTF-8 .txt file. Text export does not preserve formatting, cover images or the editable project; keep a separate .shadowdocs backup.</p>
    <label htmlFor="sd-text-export-scope" className="mt-4 block text-xs font-semibold">Choose content</label>
    <select id="sd-text-export-scope" className="sd-field mt-2 w-full" value={chapterId} onChange={event => { setChapterId(event.target.value); setError(''); setMessage('') }} disabled={!chapters.length}>
      <option value="">Entire manuscript</option>
      {chapters.map((chapter, index) => <option key={chapter.id} value={chapter.id}>{index + 1}. {chapter.title || `Chapter ${index + 1}`}</option>)}
    </select>
    {error && <p className="mt-3 text-xs text-red-700" role="alert">{error}</p>}
    {message && <p className="mt-3 text-xs text-green-700 dark:text-green-300" role="status">{message}</p>}
    <button type="button" className="sd-button sd-button-ghost mt-4" onClick={exportText} disabled={!chapters.length}><Download size={16}/> Download .txt</button>
  </section>
}

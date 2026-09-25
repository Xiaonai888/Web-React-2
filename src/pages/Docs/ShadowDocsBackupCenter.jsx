import { useState } from 'react'
import { Archive, BookOpen, Download, HardDriveDownload, HardDriveUpload, ShieldCheck, Upload } from 'lucide-react'

export default function ShadowDocsBackupCenter({ books = [], ready = true, busy = false, onBackupBook, onImportBook, onExportLibrary, onImportLibrary }) {
  const [selectedId, setSelectedId] = useState('')
  const library = (Array.isArray(books) ? books : []).filter(book => !book.deletedAt)
  const selected = library.find(book => book.id === selectedId) || library[0]
  const count = library.length

  return <section className="sd-stack" aria-label="Local project backups">
    <div className="sd-card">
      <div className="flex items-center gap-2"><ShieldCheck size={20} className="text-[#7653bd]"/><h2>Protect your books</h2></div>
      <p className="mt-3 text-[12px] leading-6 text-[#77758b] dark:text-white/65">Books are stored in this browser, not in your Shadow account. Download backups before clearing browser data or moving to another device.</p>
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f4effc] p-4 dark:bg-white/5"><BookOpen size={20} className="text-[#7653bd]"/><span className="text-sm font-semibold">{ready ? `${count} saved book${count === 1 ? '' : 's'} on this device` : 'Loading local books…'}</span></div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="sd-card">
        <h3 className="flex items-center gap-2"><Archive size={17}/> Entire library</h3>
        <p className="mt-2 text-[12px] leading-6 text-[#77758b] dark:text-white/65">Export every book into one .shadowdocs-library backup, or restore books from a previous library backup. Restored books are added as new copies.</p>
        <div className="mt-4 grid gap-2">
          <button type="button" disabled={!ready || busy || !count || typeof onExportLibrary !== 'function'} onClick={onExportLibrary} className="sd-button sd-button-primary"><HardDriveDownload size={16}/> Download library backup</button>
          <button type="button" disabled={!ready || busy || typeof onImportLibrary !== 'function'} onClick={onImportLibrary} className="sd-button sd-button-ghost"><HardDriveUpload size={16}/> Restore library backup</button>
        </div>
        <p className="mt-3 text-[11px] leading-5 text-[#77758b] dark:text-white/55">Library backup files are limited to 50 MB. Use individual book backups for larger libraries.</p>
      </div>
      <div className="sd-card">
        <h3 className="flex items-center gap-2"><BookOpen size={17}/> Individual book</h3>
        <p className="mt-2 text-[12px] leading-6 text-[#77758b] dark:text-white/65">Download one editable .shadowdocs book or import a previously saved book.</p>
        <label htmlFor="sd-backup-book" className="mt-4 block text-xs font-semibold">Choose a book</label>
        <select id="sd-backup-book" value={selected?.id || ''} onChange={event => setSelectedId(event.target.value)} disabled={!ready || busy || !count} className="sd-field mt-2 w-full">{library.map(book => <option key={book.id} value={book.id}>{book.title || 'Untitled Book'}</option>)}</select>
        <div className="mt-4 grid gap-2">
          <button type="button" disabled={!ready || busy || !selected || typeof onBackupBook !== 'function'} onClick={() => onBackupBook(selected)} className="sd-button sd-button-ghost"><Download size={16}/> Download selected book</button>
          <button type="button" disabled={!ready || busy || typeof onImportBook !== 'function'} onClick={onImportBook} className="sd-button sd-button-ghost"><Upload size={16}/> Import one book</button>
        </div>
      </div>
    </div>
  </section>
}

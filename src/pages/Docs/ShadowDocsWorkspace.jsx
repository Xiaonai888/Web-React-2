import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2, CloudOff, FileDown, LayoutTemplate, PenLine, Settings2, X } from 'lucide-react'
import { deleteLocalBook, saveLocalBook } from './ShadowDocsStore'
import { downloadShadowDocsLibrary, readShadowDocsLibrary } from './ShadowDocsLibraryBackup'
import { loadShadowDocsBooksSafely, flushShadowDocsPendingWrites } from './ShadowDocsLocalIntegrity'
import { createShadowDocsBook, createShadowDocsId, normalizeShadowDocsBook, sanitizeShadowDocsHTML } from './ShadowDocsBookModel'
import { downloadShadowDocsProject, imageToShadowDocsCover, printShadowDocsProject, readShadowDocsProject } from './ShadowDocsProjectIO'
import { moveManuscriptChapter } from './ShadowDocsManuscriptTools'
import ShadowDocsMyBooksPanel from './ShadowDocsMyBooksPanel'
import ShadowDocsTrashPanel, { getExpiredShadowDocsBookIds, moveShadowDocsBookToTrash, restoreShadowDocsBookFromTrash } from './ShadowDocsTrashPanel'
import ShadowDocsWritingStudioPanel from './ShadowDocsWritingStudioPanel'
import ShadowDocsManuscriptPanel from './ShadowDocsManuscriptPanel'
import ShadowDocsBookDesignerPanel from './ShadowDocsBookDesignerPanel'
import ShadowDocsCoverDesignerPanel from './ShadowDocsCoverDesignerPanel'
import ShadowDocsTemplateGallery from './ShadowDocsTemplateGallery'
import ShadowDocsPDFStudioPanel from './ShadowDocsPDFStudioPanel'
import ShadowDocsBackupCenter from './ShadowDocsBackupCenter'
import ShadowDocsReaderPreview from './ShadowDocsReaderPreview'
import ShadowDocsFindReplacePanel from './ShadowDocsFindReplacePanel'
import ShadowDocsTextExportPanel from './ShadowDocsTextExportPanel'
import ShadowDocsPlainTextImportPanel from './ShadowDocsPlainTextImportPanel'
import ShadowDocsContentsPanel from './ShadowDocsContentsPanel'
import './ShadowDocsPage.css'

const NAV = [
  { id: 'books', name: 'My Books', icon: BookOpen },
  { id: 'write', name: 'Write', icon: PenLine },
  { id: 'design', name: 'Designer', icon: Settings2 },
  { id: 'templates', name: 'Templates', icon: LayoutTemplate },
  { id: 'pdf', name: 'PDF Studio', icon: FileDown },
]

export default function ShadowDocsWorkspace() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const bookRef = useRef([])
  const pending = useRef(new Map())
  const [ready, setReady] = useState(false)
  const [section, setSection] = useState('books')
  const [activeId, setActiveId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [designTab, setDesignTab] = useState('page')
  const [showOutline, setShowOutline] = useState(false)
  const [showBackupCenter, setShowBackupCenter] = useState(false)
  const [showWritingTools, setShowWritingTools] = useState(false)
  const [backupBusy, setBackupBusy] = useState(false)
  const [dialog, setDialog] = useState('')
  const [details, setDetails] = useState({ title: '', author: '', description: '' })
  const [status, setStatus] = useState('Loading your local books…')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const importRef = useRef(null)
  const coverRef = useRef(null)
  const libraryImportRef = useRef(null)
  const book = books.find(item => item.id === activeId && !item.deletedAt) || null
  const currentChapter = book?.chapters.find(item => item.id === chapterId) || book?.chapters[0] || null

  useEffect(() => {
    let active = true
    loadShadowDocsBooksSafely().then(async ({ books: normalized, skippedIds }) => {
      if (!active) return
      const expiredIds = getExpiredShadowDocsBookIds(normalized)
      const deleted = await Promise.allSettled(expiredIds.map(id => deleteLocalBook(id)))
      if (!active) return
      const removedIds = new Set(expiredIds.filter((id, index) => deleted[index].status === 'fulfilled'))
      const available = normalized.filter(item => !removedIds.has(item.id))
      bookRef.current = available
      setBooks(available)
      setReady(true)
      setStatus('Saved on this device')
      const warnings = []
      if (skippedIds.length) warnings.push(`${skippedIds.length} saved book(s) could not be opened. Their original records remain in this browser; do not clear browser data.`)
      if (deleted.some(result => result.status === 'rejected')) warnings.push('Some expired books could not be removed from Trash. Please check local storage.')
      if (warnings.length) setError(warnings.join(' '))
    }).catch(failure => {
      if (active) { setReady(false); setError(`Unable to load your local books: ${failure.message}`); setStatus('Local storage unavailable') }
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    function flushPending() {
      void flushShadowDocsPendingWrites(pending.current, bookRef.current).catch(failure => {
        setStatus('Save failed')
        setError(`Local save failed: ${failure.message}`)
      })
    }
    const whenHidden = () => { if (document.visibilityState === 'hidden') flushPending() }
    window.addEventListener('pagehide', flushPending)
    document.addEventListener('visibilitychange', whenHidden)
    return () => {
      window.removeEventListener('pagehide', flushPending)
      document.removeEventListener('visibilitychange', whenHidden)
      flushPending()
    }
  }, [])

  function writeBook(item) {
    setStatus('Saving locally…')
    return saveLocalBook(item).then(() => {
      setStatus('Saved on this device')
    }).catch(failure => {
      setStatus('Save failed')
      setError(`Local save failed: ${failure.message}`)
      throw failure
    })
  }

  function persist(id) {
    const timer = pending.current.get(id)
    if (timer) clearTimeout(timer)
    pending.current.delete(id)
    const latest = bookRef.current.find(item => item.id === id)
    if (latest) void writeBook(latest).catch(() => {})
  }

  function putBook(item) {
    bookRef.current = [item, ...bookRef.current]
    setBooks(bookRef.current)
    persist(item.id)
  }

  function patchBook(id, patch, immediate = false) {
    const previous = bookRef.current.find(item => item.id === id)
    if (!previous || !ready) return
    const next = { ...previous, ...patch, updatedAt: Date.now() }
    bookRef.current = bookRef.current.map(item => item.id === id ? next : item)
    setBooks(bookRef.current)
    setStatus('Unsaved changes…')
    clearTimeout(pending.current.get(id))
    if (immediate) persist(id)
    else pending.current.set(id, setTimeout(() => persist(id), 450))
  }

  function openBook(item, target = 'write') {
    if (!item || item.deletedAt) return
    setActiveId(item.id)
    setChapterId(item.chapters[0]?.id || '')
    setSection(target)
    setShowOutline(false)
    setError('')
  }

  function startNewBook() {
    setDetails({ title: '', author: '', description: '' })
    setDialog('new')
    setError('')
  }

  function submitDetails(event) {
    event.preventDefault()
    if (!ready || !details.title.trim()) return
    if (dialog === 'new') {
      const item = createShadowDocsBook({ ...details, title: details.title.trim() })
      putBook(item)
      openBook(item)
    } else if (dialog === 'rename' && book) {
      patchBook(book.id, { title: details.title.trim().slice(0, 160), author: details.author.trim().slice(0, 120), description: details.description.trim().slice(0, 350) }, true)
    }
    setDialog('')
  }

  async function exportBackup(item) {
    if (!item) return
    try {
      await flushShadowDocsPendingWrites(pending.current, bookRef.current)
      const latest = bookRef.current.find(book => book.id === item.id) || item
      downloadShadowDocsProject(latest)
      setNotice('Project backup downloaded. Keep the .shadowdocs file in a safe place.')
    } catch (failure) { setError(`Backup failed: ${failure.message}`) }
  }

  async function importBackup(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !ready) return
    try {
      const item = await readShadowDocsProject(file)
      putBook(item)
      openBook(item)
      setNotice('Your project was restored on this device. The original backup is unchanged.')
    } catch (failure) { setError(`Import failed: ${failure.message}`) }
  }

  async function moveBookToTrash(item) {
    if (!ready || !item || item.deletedAt || !window.confirm(`Move “${item.title}” to Trash? You can restore it within 30 days.`)) return
    try {
      await flushShadowDocsPendingWrites(pending.current, bookRef.current)
      const latest = bookRef.current.find(row => row.id === item.id)
      if (!latest || latest.deletedAt) return
      const trashed = moveShadowDocsBookToTrash(latest)
      await saveLocalBook(trashed)
      bookRef.current = bookRef.current.map(row => row.id === trashed.id ? trashed : row)
      setBooks(bookRef.current)
      if (activeId === trashed.id) { setActiveId(''); setChapterId(''); setSection('books') }
      setNotice('Book moved to Trash. You have 30 days to restore it.')
    } catch (failure) { setError(`Could not move book to Trash: ${failure.message}`) }
  }

  async function restoreTrashedBook(item) {
    if (!ready) throw new Error('Local books are still loading.')
    await flushShadowDocsPendingWrites(pending.current, bookRef.current)
    const latest = bookRef.current.find(row => row.id === item.id)
    if (!latest) throw new Error('This book is no longer in Trash.')
    const restored = restoreShadowDocsBookFromTrash(latest)
    await saveLocalBook(restored)
    bookRef.current = bookRef.current.map(row => row.id === restored.id ? restored : row)
    setBooks(bookRef.current)
    setNotice('Book restored to My Books.')
  }

  async function permanentlyDeleteTrashedBook(item) {
    if (!ready) throw new Error('Local books are still loading.')
    await flushShadowDocsPendingWrites(pending.current, bookRef.current)
    const latest = bookRef.current.find(row => row.id === item.id)
    if (!latest?.deletedAt) throw new Error('This book is no longer in Trash.')
    await deleteLocalBook(latest.id)
    bookRef.current = bookRef.current.filter(row => row.id !== latest.id)
    setBooks(bookRef.current)
    setNotice('Book permanently deleted from this device.')
  }

  function bookAction(item, action) {
    if (action === 'backup') { void exportBackup(item); return }
    if (action === 'duplicate') {
      const copy = normalizeShadowDocsBook({ ...item, deletedAt: null, title: `${item.title} (Copy)`.slice(0, 160) }, { duplicate: true })
      putBook(copy)
      setNotice('A separate local copy was created.')
      return
    }
    if (action === 'rename') {
      setActiveId(item.id)
      setDetails({ title: item.title, author: item.author, description: item.description })
      setDialog('rename')
      return
    }
    if (action === 'complete') {
      patchBook(item.id, { status: item.status === 'completed' ? 'draft' : 'completed' }, true)
      return
    }
    if (action === 'delete') { void moveBookToTrash(item); return }
  }

  function patchChapter(id, patch, immediate = false) {
    if (!book) return
    const latest = bookRef.current.find(item => item.id === book.id)
    if (!latest) return
    patchBook(latest.id, { chapters: latest.chapters.map(item => item.id === id ? { ...item, ...patch } : item) }, immediate)
  }

  function addChapter() {
    if (!book) return
    if (book.chapters.length >= 500) { setError('A book can have at most 500 chapters.'); return }
    const chapter = { id: createShadowDocsId(), title: `Chapter ${book.chapters.length + 1}`, html: '' }
    patchBook(book.id, { chapters: [...book.chapters, chapter] }, true)
    setChapterId(chapter.id)
  }

  function moveChapter(id, direction) {
    if (!book) return
    const moved = moveManuscriptChapter(book, id, direction)
    if (moved !== book) patchBook(book.id, { chapters: moved.chapters }, true)
  }

  function deleteChapter(id) {
    if (!book || book.chapters.length < 2) return
    const chapter = book.chapters.find(item => item.id === id)
    if (!chapter || !window.confirm(`Delete “${chapter.title}” and its contents?`)) return
    const chapters = book.chapters.filter(item => item.id !== id)
    patchBook(book.id, { chapters }, true)
    if (chapterId === id) setChapterId(chapters[0].id)
  }

  async function coverSelected(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !book) return
    const bookId = book.id
    try {
      const image = await imageToShadowDocsCover(file)
      if (bookRef.current.some(item => item.id === bookId)) patchBook(bookId, { image }, true)
    } catch (failure) { setError(`Cover upload failed: ${failure.message}`) }
  }

  async function exportLibraryBackup() {
    if (!ready || backupBusy) return
    setBackupBusy(true)
    try {
      await flushShadowDocsPendingWrites(pending.current, bookRef.current)
      downloadShadowDocsLibrary(bookRef.current)
      setNotice('Library backup downloaded. Keep this file in a safe place.')
    } catch (failure) { setError(`Library backup failed: ${failure.message}`) }
    finally { setBackupBusy(false) }
  }

  async function importLibraryBackup(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !ready || backupBusy) return
    setBackupBusy(true)
    try {
      const restored = await readShadowDocsLibrary(file)
      await flushShadowDocsPendingWrites(pending.current, bookRef.current)
      const results = await Promise.allSettled(restored.map(item => saveLocalBook(item)))
      const saved = restored.filter((item, index) => results[index].status === 'fulfilled')
      if (saved.length) {
        bookRef.current = [...saved, ...bookRef.current]
        setBooks(bookRef.current)
      }
      if (saved.length !== restored.length) throw new Error(`${saved.length} of ${restored.length} books were restored. Check available storage before trying again.`)
      setNotice(`${saved.length} book(s) restored as new copies. Existing books were not replaced.`)
    } catch (failure) { setError(`Library restore failed: ${failure.message}`) }
    finally { setBackupBusy(false) }
  }

  async function appendImportedChapters(bookId, chapters) {
    const latest = bookRef.current.find(item => item.id === bookId)
    if (!ready || !latest || !Array.isArray(chapters) || !chapters.length) throw new Error('Choose a book and chapters to import.')
    if (latest.chapters.length + chapters.length > 500) throw new Error('A book can have at most 500 chapters. Import fewer chapters.')
    patchBook(latest.id, { chapters: [...latest.chapters, ...chapters] }, true)
    await flushShadowDocsPendingWrites(pending.current, bookRef.current)
    setNotice(`${chapters.length} chapter(s) added. Existing chapters were kept.`)
  }

  function applyTextReplacements(bookId, chapters, replacements) {
    const latest = bookRef.current.find(item => item.id === bookId)
    if (!latest || !Array.isArray(chapters) || chapters.length !== latest.chapters.length) throw new Error('The selected book changed. Reopen Find & Replace.')
    patchBook(latest.id, { chapters }, true)
    setNotice(`${replacements} text match(es) replaced. Download a backup to keep a separate copy.`)
  }

  function printSelectedBook() {
    if (!book) return
    const latest = bookRef.current.find(item => item.id === book.id) || book
    persist(latest.id)
    printShadowDocsProject(latest)
  }

  return <div className="sd-app">
    <header className="sd-header"><div className="sd-header-inner">
      <button type="button" onClick={() => navigate('/app')} aria-label="Back to Apps" className="sd-icon-button"><ArrowLeft size={19}/></button>
      <div className="sd-brand-icon"><BookOpen size={22}/></div>
      <div className="sd-brand"><strong>Shadow Docs</strong><small>WRITE · DESIGN · PDF</small></div>
      <span className="sd-local-chip"><CloudOff size={13}/> Local-first</span>
    </div></header>

    <main className="sd-main">
      <div className="sd-topline"><div><span className="sd-eyebrow">YOUR BOOK WORKSPACE</span><h1>{section === 'preview' ? 'Reading Preview' : section === 'trash' ? 'Trash' : NAV.find(item => item.id === section)?.name}</h1><p>{section === 'books' ? 'Your writing, saved on this device.' : book?.title || 'Create or select a book to continue.'}</p></div>{book && section !== 'books' && <button type="button" className="sd-button sd-button-ghost" onClick={() => setSection('books')}><BookOpen size={15}/> Library</button>}</div>
      {error && <div role="alert" className="sd-alert sd-alert-error"><span>{error}</span><button type="button" aria-label="Dismiss error" onClick={() => setError('')}><X size={16}/></button></div>}
      {notice && <div role="status" className="sd-alert sd-alert-ok"><span>{notice}</span><button type="button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={16}/></button></div>}
      <div className="sd-status"><CheckCircle2 size={15}/><span>{status}</span><span className="sd-status-note">Projects remain in this browser; download backups regularly.</span></div>

      {section === 'books' && <div className="sd-stack"><button type="button" className="sd-button sd-button-ghost" aria-expanded={showBackupCenter} onClick={() => setShowBackupCenter(value => !value)}>{showBackupCenter ? 'Hide Backup Center' : 'Open Backup Center'}</button><ShadowDocsMyBooksPanel books={books} ready={ready} onCreate={startNewBook} onImport={() => importRef.current?.click()} onOpen={openBook} onAction={bookAction} onOpenTrash={() => setSection('trash')}/>{showBackupCenter && <ShadowDocsBackupCenter books={books} ready={ready} busy={backupBusy} onBackupBook={exportBackup} onImportBook={() => importRef.current?.click()} onExportLibrary={exportLibraryBackup} onImportLibrary={() => libraryImportRef.current?.click()}/>}</div>}
      {section === 'trash' && <ShadowDocsTrashPanel books={books} ready={ready} onRestore={restoreTrashedBook} onDeleteForever={permanentlyDeleteTrashedBook} onClose={() => setSection('books')}/>}
      {section === 'write' && <div className="sd-stack">{book && <button type="button" className="sd-button sd-button-ghost" onClick={() => { setDesignTab('page'); setSection('design') }}>Font & Page Setup</button>}<ShadowDocsWritingStudioPanel book={book} chapterId={currentChapter?.id} onSelectChapter={setChapterId} onAddChapter={addChapter} onRenameChapter={(id, title) => patchChapter(id, { title: title.slice(0, 160) })} onChangeHTML={(id, html) => patchChapter(id, { html: sanitizeShadowDocsHTML(html) })} onMoveChapter={moveChapter} onDeleteChapter={deleteChapter} onPreview={() => setSection('preview')} onDownloadBackup={exportBackup} onEditorBlur={persist} status={status} onChangeSettings={patch => book && patchBook(book.id, { settings: { ...book.settings, ...patch } })}/>{book && <div className="sd-stack"><div className="flex flex-wrap gap-2"><button type="button" className="sd-button sd-button-ghost" aria-expanded={showOutline} onClick={() => setShowOutline(value => !value)}>{showOutline ? 'Hide manuscript outline' : 'Show manuscript outline'}</button><button type="button" className="sd-button sd-button-ghost" aria-expanded={showWritingTools} onClick={() => setShowWritingTools(value => !value)}>{showWritingTools ? 'Hide writing tools' : 'Open writing tools'}</button></div>{showOutline && <ShadowDocsManuscriptPanel book={book} activeChapterId={currentChapter?.id} onSelectChapter={setChapterId} onAddChapter={addChapter} onMoveChapter={moveChapter}/>}{showWritingTools && <div className="sd-stack"><ShadowDocsFindReplacePanel key={`find-${book.id}`} book={book} activeChapterId={currentChapter?.id} onApply={(chapters, count) => applyTextReplacements(book.id, chapters, count)}/><ShadowDocsPlainTextImportPanel key={`import-${book.id}`} book={book} onImportParsed={chapters => appendImportedChapters(book.id, chapters)}/><ShadowDocsTextExportPanel key={`text-${book.id}`} book={book}/><ShadowDocsContentsPanel book={book} onSelectChapter={setChapterId}/></div>}</div>}</div>}
      {section === 'design' && <div className="sd-stack"><div className="sd-segments"><button type="button" className={designTab === 'page' ? 'is-active' : ''} onClick={() => setDesignTab('page')}>Page & type</button><button type="button" className={designTab === 'cover' ? 'is-active' : ''} onClick={() => setDesignTab('cover')}>Cover Designer</button></div>{designTab === 'page' ? <ShadowDocsBookDesignerPanel book={book} onChangeSettings={patch => book && patchBook(book.id, { settings: { ...book.settings, ...patch } })}/> : <ShadowDocsCoverDesignerPanel book={book} onSaveDetails={details => book && patchBook(book.id, details, true)} onUploadCover={() => coverRef.current?.click()} onRemoveCover={() => book && patchBook(book.id, { image: '' }, true)}/>}</div>}
      {section === 'templates' && <ShadowDocsTemplateGallery book={book} onSelectTemplate={id => book && patchBook(book.id, { template: id }, true)}/>}
      {section === 'preview' && <ShadowDocsReaderPreview key={book?.id || 'empty'} book={book} onEditChapter={id => { setChapterId(id); setSection('write') }} onPrint={() => setSection('pdf')}/>}
      {section === 'pdf' && <div className="sd-stack"><ShadowDocsPDFStudioPanel book={book} onPrint={printSelectedBook} onDownloadBackup={exportBackup} onChangeSettings={patch => book && patchBook(book.id, { settings: { ...book.settings, ...patch } })}/>{book && <ShadowDocsContentsPanel book={book} onSelectChapter={id => { setChapterId(id); setSection('write') }}/>}</div>}
    </main>

    <nav className="sd-bottom-nav" aria-label="Shadow Docs navigation"><div className="sd-bottom-inner">{NAV.map(item => { const Icon = item.icon; return <button key={item.id} type="button" className={section === item.id ? 'is-active' : ''} onClick={() => { setSection(item.id); setShowOutline(false) }}><Icon size={20}/><span>{item.name}</span></button> })}</div></nav>
    <input ref={importRef} hidden type="file" accept=".shadowdocs" onChange={importBackup}/>
    <input ref={coverRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={coverSelected}/>
    <input ref={libraryImportRef} hidden type="file" accept=".shadowdocs-library" onChange={importLibraryBackup}/>
    {dialog && <div className="sd-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDialog('') }}><form className="sd-modal" onSubmit={submitDetails}><div className="sd-panel-title"><h2>{dialog === 'new' ? 'Create a new book' : 'Edit book details'}</h2><button type="button" aria-label="Close dialog" className="sd-icon-button" onClick={() => setDialog('')}><X size={16}/></button></div><p>Book details are saved on this device.</p><label htmlFor="sd-book-title" className="sd-field-label">BOOK TITLE</label><input id="sd-book-title" className="sd-field" required maxLength={160} autoFocus value={details.title} onChange={event => setDetails(value => ({ ...value, title: event.target.value }))}/><label htmlFor="sd-book-author" className="sd-field-label">AUTHOR NAME</label><input id="sd-book-author" className="sd-field" maxLength={120} value={details.author} onChange={event => setDetails(value => ({ ...value, author: event.target.value }))}/><label htmlFor="sd-book-description" className="sd-field-label">DESCRIPTION</label><textarea id="sd-book-description" className="sd-field sd-textarea" rows={3} maxLength={350} value={details.description} onChange={event => setDetails(value => ({ ...value, description: event.target.value }))}/><div className="sd-modal-actions"><button type="button" className="sd-button sd-button-ghost" onClick={() => setDialog('')}>Cancel</button><button type="submit" className="sd-button sd-button-primary" disabled={!details.title.trim()}>{dialog === 'new' ? 'Create Book' : 'Save Changes'}</button></div></form></div>}
  </div>
}

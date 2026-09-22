import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2, CloudOff, FileDown, LayoutTemplate, PenLine, Settings2, X } from 'lucide-react'
import { deleteLocalBook, saveLocalBook } from './ShadowDocsStore'
import { loadShadowDocsBooksSafely, flushShadowDocsPendingWrites } from './ShadowDocsLocalIntegrity'
import { createShadowDocsBook, createShadowDocsId, normalizeShadowDocsBook, sanitizeShadowDocsHTML } from './ShadowDocsBookModel'
import { downloadShadowDocsProject, imageToShadowDocsCover, printShadowDocsProject, readShadowDocsProject } from './ShadowDocsProjectIO'
import { moveManuscriptChapter } from './ShadowDocsManuscriptTools'
import ShadowDocsMyBooksPanel from './ShadowDocsMyBooksPanel'
import ShadowDocsWritingStudioPanel from './ShadowDocsWritingStudioPanel'
import ShadowDocsManuscriptPanel from './ShadowDocsManuscriptPanel'
import ShadowDocsBookDesignerPanel from './ShadowDocsBookDesignerPanel'
import ShadowDocsCoverDesignerPanel from './ShadowDocsCoverDesignerPanel'
import ShadowDocsTemplateGallery from './ShadowDocsTemplateGallery'
import ShadowDocsPDFStudioPanel from './ShadowDocsPDFStudioPanel'
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
  const [dialog, setDialog] = useState('')
  const [details, setDetails] = useState({ title: '', author: '', description: '' })
  const [status, setStatus] = useState('Loading your local books…')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const importRef = useRef(null)
  const coverRef = useRef(null)
  const book = books.find(item => item.id === activeId) || null
  const currentChapter = book?.chapters.find(item => item.id === chapterId) || book?.chapters[0] || null

  useEffect(() => {
    let active = true
    loadShadowDocsBooksSafely().then(({ books: normalized, skippedIds }) => {
      if (!active) return
      bookRef.current = normalized
      setBooks(normalized)
      setReady(true)
      setStatus('Saved on this device')
      if (skippedIds.length) setError(`${skippedIds.length} saved book(s) could not be opened. Their original records remain in this browser; do not clear browser data.`)
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

  function bookAction(item, action) {
    if (action === 'backup') { void exportBackup(item); return }
    if (action === 'duplicate') {
      const copy = normalizeShadowDocsBook({ ...item, title: `${item.title} (Copy)`.slice(0, 160) }, { duplicate: true })
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
    if (action === 'delete' && window.confirm(`Permanently delete “${item.title}” from this device? Download a backup first if needed.`)) {
      clearTimeout(pending.current.get(item.id))
      pending.current.delete(item.id)
      bookRef.current = bookRef.current.filter(row => row.id !== item.id)
      setBooks(bookRef.current)
      if (item.id === activeId) { setActiveId(''); setChapterId(''); setSection('books') }
      deleteLocalBook(item.id).then(() => setNotice('Local book deleted.')).catch(failure => setError(`Delete failed: ${failure.message}`))
    }
  }

  function patchChapter(id, patch, immediate = false) {
    if (!book) return
    patchBook(book.id, { chapters: book.chapters.map(item => item.id === id ? { ...item, ...patch } : item) }, immediate)
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
      <div className="sd-topline"><div><span className="sd-eyebrow">YOUR BOOK WORKSPACE</span><h1>{NAV.find(item => item.id === section)?.name}</h1><p>{section === 'books' ? 'Your writing, saved on this device.' : book?.title || 'Create or select a book to continue.'}</p></div>{book && section !== 'books' && <button type="button" className="sd-button sd-button-ghost" onClick={() => setSection('books')}><BookOpen size={15}/> Library</button>}</div>
      {error && <div role="alert" className="sd-alert sd-alert-error"><span>{error}</span><button type="button" aria-label="Dismiss error" onClick={() => setError('')}><X size={16}/></button></div>}
      {notice && <div role="status" className="sd-alert sd-alert-ok"><span>{notice}</span><button type="button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={16}/></button></div>}
      <div className="sd-status"><CheckCircle2 size={15}/><span>{status}</span><span className="sd-status-note">Projects remain in this browser; download backups regularly.</span></div>

      {section === 'books' && <ShadowDocsMyBooksPanel books={books} ready={ready} onCreate={startNewBook} onImport={() => importRef.current?.click()} onOpen={openBook} onAction={bookAction}/>}
      {section === 'write' && <div className="sd-stack"><ShadowDocsWritingStudioPanel book={book} chapterId={currentChapter?.id} onSelectChapter={setChapterId} onAddChapter={addChapter} onRenameChapter={(id, title) => patchChapter(id, { title: title.slice(0, 160) })} onChangeHTML={(id, html) => patchChapter(id, { html: sanitizeShadowDocsHTML(html) })} onMoveChapter={moveChapter} onDeleteChapter={deleteChapter} onPreview={() => setSection('pdf')} onDownloadBackup={exportBackup} onEditorBlur={persist} status={status}/>{book && <div className="sd-stack"><button type="button" className="sd-button sd-button-ghost" aria-expanded={showOutline} onClick={() => setShowOutline(value => !value)}>{showOutline ? 'Hide manuscript search & outline' : 'Show manuscript search & outline'}</button>{showOutline && <ShadowDocsManuscriptPanel book={book} activeChapterId={currentChapter?.id} onSelectChapter={setChapterId} onAddChapter={addChapter} onMoveChapter={moveChapter}/>}</div>}</div>}
      {section === 'design' && <div className="sd-stack"><div className="sd-segments"><button type="button" className={designTab === 'page' ? 'is-active' : ''} onClick={() => setDesignTab('page')}>Page & type</button><button type="button" className={designTab === 'cover' ? 'is-active' : ''} onClick={() => setDesignTab('cover')}>Cover Designer</button></div>{designTab === 'page' ? <ShadowDocsBookDesignerPanel book={book} onChangeSettings={patch => book && patchBook(book.id, { settings: { ...book.settings, ...patch } })}/> : <ShadowDocsCoverDesignerPanel book={book} onSaveDetails={details => book && patchBook(book.id, details, true)} onUploadCover={() => coverRef.current?.click()} onRemoveCover={() => book && patchBook(book.id, { image: '' }, true)}/>}</div>}
      {section === 'templates' && <ShadowDocsTemplateGallery book={book} onSelectTemplate={id => book && patchBook(book.id, { template: id }, true)}/>}
      {section === 'pdf' && <ShadowDocsPDFStudioPanel book={book} onPrint={printSelectedBook} onDownloadBackup={exportBackup}/>}
    </main>

    <nav className="sd-bottom-nav" aria-label="Shadow Docs navigation"><div className="sd-bottom-inner">{NAV.map(item => { const Icon = item.icon; return <button key={item.id} type="button" className={section === item.id ? 'is-active' : ''} onClick={() => { setSection(item.id); setShowOutline(false) }}><Icon size={20}/><span>{item.name}</span></button> })}</div></nav>
    <input ref={importRef} hidden type="file" accept=".shadowdocs" onChange={importBackup}/>
    <input ref={coverRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={coverSelected}/>
    {dialog && <div className="sd-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDialog('') }}><form className="sd-modal" onSubmit={submitDetails}><div className="sd-panel-title"><h2>{dialog === 'new' ? 'Create a new book' : 'Edit book details'}</h2><button type="button" aria-label="Close dialog" className="sd-icon-button" onClick={() => setDialog('')}><X size={16}/></button></div><p>Book details are saved on this device.</p><label htmlFor="sd-book-title" className="sd-field-label">BOOK TITLE</label><input id="sd-book-title" className="sd-field" required maxLength={160} autoFocus value={details.title} onChange={event => setDetails(value => ({ ...value, title: event.target.value }))}/><label htmlFor="sd-book-author" className="sd-field-label">AUTHOR NAME</label><input id="sd-book-author" className="sd-field" maxLength={120} value={details.author} onChange={event => setDetails(value => ({ ...value, author: event.target.value }))}/><label htmlFor="sd-book-description" className="sd-field-label">DESCRIPTION</label><textarea id="sd-book-description" className="sd-field sd-textarea" rows={3} maxLength={350} value={details.description} onChange={event => setDetails(value => ({ ...value, description: event.target.value }))}/><div className="sd-modal-actions"><button type="button" className="sd-button sd-button-ghost" onClick={() => setDialog('')}>Cancel</button><button type="submit" className="sd-button sd-button-primary" disabled={!details.title.trim()}>{dialog === 'new' ? 'Create Book' : 'Save Changes'}</button></div></form></div>}
  </div>
}

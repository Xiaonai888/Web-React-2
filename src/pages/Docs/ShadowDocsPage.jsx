import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, CloudOff, Copy, Download, Eye, FileDown, FilePlus2, FileText, FolderOpen, ImagePlus, LayoutTemplate, MoreHorizontal, PenLine, Plus, Printer, Search, Settings2, ShieldCheck, Trash2, Upload, X } from 'lucide-react'
import { deleteLocalBook, flushLocalBooks, loadLocalBooks, saveLocalBook } from './ShadowDocsStore'
import './ShadowDocsPage.css'

const sizes = { A5: [148, 210], A4: [210, 297], B5: [176, 250] }
const fonts = ['Noto Serif Khmer', 'Noto Sans Khmer', 'Battambang', 'Georgia', 'Arial']
const templates = [
  { id: 'classic', name: 'Classic', category: 'Fiction', symbol: '✦', subtitle: 'Timeless & literary' },
  { id: 'minimal', name: 'Minimal', category: 'Nonfiction', symbol: '◦', subtitle: 'Beautifully simple' },
  { id: 'modern', name: 'Modern', category: 'Fiction', symbol: '◇', subtitle: 'Fresh & contemporary' },
  { id: 'elegant', name: 'Elegant', category: 'Fiction', symbol: '❀', subtitle: 'Soft & refined' },
  { id: 'academic', name: 'Academic', category: 'Education', symbol: '◎', subtitle: 'Clear & structured' },
  { id: 'midnight', name: 'Midnight', category: 'Fiction', symbol: '☾', subtitle: 'Bold & cinematic' },
  { id: 'nature', name: 'Nature', category: 'Nonfiction', symbol: '❧', subtitle: 'Calm & organic' },
  { id: 'editorial', name: 'Editorial', category: 'Education', symbol: '▤', subtitle: 'Modern publishing' },
]
const nav = [
  { id: 'books', title: 'My Books', icon: BookOpen },
  { id: 'write', title: 'Write', icon: PenLine },
  { id: 'design', title: 'Designer', icon: Settings2 },
  { id: 'templates', title: 'Templates', icon: LayoutTemplate },
  { id: 'pdf', title: 'PDF Studio', icon: FileDown },
]
const initialSettings = { size: 'A5', margin: 18, font: 'Noto Serif Khmer', fontSize: 13, lineSpacing: 1.65, alignment: 'left', numbers: true, chapterStyle: 'classic' }
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
const textOnly = value => String(value ?? '').slice(0, 1000)
const safeFileName = value => String(value || 'book').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').slice(0, 90)
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const validImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2500000

function safeHTML(value) {
  const parsed = new DOMParser().parseFromString(String(value || '').slice(0, 500000), 'text/html')
  const allowed = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'SPAN'])
  function walk(node) {
    if (node.nodeType === 3) return escapeHTML(node.nodeValue)
    if (node.nodeType !== 1) return ''
    const content = [...node.childNodes].map(walk).join('')
    if (!allowed.has(node.tagName)) return content
    const tag = node.tagName.toLowerCase()
    const align = node.style?.textAlign
    const style = ['left', 'right', 'center', 'justify'].includes(align) ? ` style="text-align:${align}"` : ''
    return tag === 'br' ? '<br>' : `<${tag}${style}>${content}</${tag}>`
  }
  return [...parsed.body.childNodes].map(walk).join('')
}

function cleanBook(source, newId = false) {
  if (!source || typeof source !== 'object' || !Array.isArray(source.chapters) || source.chapters.length > 500) throw new Error('Invalid Shadow Docs project.')
  const settings = source.settings || {}
  const chapterIds = new Set()
  const chapters = source.chapters.map(chapter => {
    let id = newId ? uid() : textOnly(chapter.id || uid())
    if (chapterIds.has(id)) id = uid()
    chapterIds.add(id)
    return { id, title: textOnly(chapter.title || 'Untitled chapter').slice(0, 160), html: safeHTML(chapter.html || '') }
  })
  return {
    id: newId ? uid() : textOnly(source.id || uid()),
    title: textOnly(source.title || 'Untitled Book').slice(0, 160),
    author: textOnly(source.author || '').slice(0, 120),
    description: textOnly(source.description || '').slice(0, 350),
    status: source.status === 'completed' ? 'completed' : 'draft',
    template: templates.some(t => t.id === source.template) ? source.template : 'classic',
    image: validImage(source.image) ? source.image : '',
    settings: {
      size: sizes[settings.size] ? settings.size : 'A5',
      margin: Math.max(10, Math.min(35, Number(settings.margin) || 18)),
      font: fonts.includes(settings.font) ? settings.font : 'Noto Serif Khmer',
      fontSize: Math.max(10, Math.min(24, Number(settings.fontSize) || 13)),
      lineSpacing: Math.max(1.2, Math.min(2.2, Number(settings.lineSpacing) || 1.65)),
      alignment: ['left', 'center', 'right', 'justify'].includes(settings.alignment) ? settings.alignment : 'left',
      numbers: settings.numbers !== false,
      chapterStyle: ['classic', 'modern', 'minimal'].includes(settings.chapterStyle) ? settings.chapterStyle : 'classic',
    },
    chapters: chapters.length ? chapters : [{ id: uid(), title: 'Chapter 1', html: '' }],
    createdAt: Number(source.createdAt) || Date.now(),
    updatedAt: newId ? Date.now() : Number(source.updatedAt) || Date.now(),
  }
}

function downloadFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function Cover({ book, large = false }) {
  return <div className={`sd-cover sd-cover--${book.template} ${large ? 'sd-cover--large' : ''}`} style={book.image ? { backgroundImage: `linear-gradient(180deg,rgba(22,19,41,.3),rgba(22,19,41,.65)),url("${book.image}")` } : undefined}>
    <span className="sd-cover-mark" aria-hidden="true">{templates.find(item => item.id === book.template)?.symbol || '✦'}</span>
    <div className="sd-cover-body"><span className="sd-cover-small">SHADOW DOCS ORIGINAL</span><strong>{book.title || 'Untitled Book'}</strong><span className="sd-cover-line"/><small>{book.author || 'YOUR NAME'}</small></div>
  </div>
}

function Card({ children, className = '' }) { return <section className={`sd-card ${className}`}>{children}</section> }
function IconButton({ icon: Icon, label, onClick, disabled = false, danger = false }) { return <button type="button" className={`sd-icon-button ${danger ? 'sd-icon-danger' : ''}`} aria-label={label} title={label} onClick={onClick} disabled={disabled}><Icon size={17}/></button> }
function EmptyBook({ onClick }) { return <Card className="sd-empty"><FolderOpen size={42}/><h3>No book selected</h3><p>Create a book or choose one from My Books to continue.</p><button type="button" className="sd-button sd-button-primary" onClick={onClick}><Plus size={16}/> Go to My Books</button></Card> }

export default function ShadowDocsPage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const bookRef = useRef([])
  const timers = useRef(new Map())
  const editorRef = useRef(null)
  const restoreRef = useRef(null)
  const coverRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [section, setSection] = useState('books')
  const [activeId, setActiveId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [filter, setFilter] = useState('All Books')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState('')
  const [dialog, setDialog] = useState('')
  const [entry, setEntry] = useState({ title: '', author: '', description: '' })
  const [designTab, setDesignTab] = useState('Layout')
  const [templateFilter, setTemplateFilter] = useState('All')
  const [previewIndex, setPreviewIndex] = useState(0)
  const [status, setStatus] = useState('Loading your local library…')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let live = true
    loadLocalBooks().then(all => {
      if (!live) return
      const cleaned = all.map(item => cleanBook(item))
      bookRef.current = cleaned
      setBooks(cleaned)
      setReady(true)
      setStatus('Saved on this device')
    }).catch(err => { if (live) { setError(err.message); setReady(true); setStatus('Local storage unavailable') } })
    return () => { live = false }
  }, [])

  useEffect(() => () => { timers.current.forEach(timer => clearTimeout(timer)) }, [])
  const book = books.find(item => item.id === activeId) || null
  const chapter = book?.chapters.find(item => item.id === chapterId) || book?.chapters[0] || null
  const settings = book?.settings || initialSettings
  const pdfSections = book ? [{ id: 'cover', title: 'Cover', cover: true }, ...book.chapters.map(item => ({ ...item, cover: false }))] : []
  const currentPreview = pdfSections[Math.min(previewIndex, pdfSections.length - 1)]
  const wordCount = chapter ? (new DOMParser().parseFromString(chapter.html, 'text/html').body.textContent || '').trim().split(/\s+/).filter(Boolean).length : 0
  const pageWidth = sizes[settings.size]?.[0] || 148
  const pageHeight = sizes[settings.size]?.[1] || 210

  function persist(id) {
    const latest = bookRef.current.find(item => item.id === id)
    if (!latest) return
    setStatus('Saving locally…')
    saveLocalBook(latest).then(() => {
      if (bookRef.current.find(item => item.id === id) === latest) setStatus('Saved on this device')
    }).catch(err => { setStatus('Save failed'); setError(`Local save failed: ${err.message}`) })
  }

  function updateBook(id, change, immediate = false) {
    const previous = bookRef.current.find(item => item.id === id)
    if (!previous) return
    const next = { ...previous, ...change, updatedAt: Date.now() }
    const updated = bookRef.current.map(item => item.id === id ? next : item)
    bookRef.current = updated
    setBooks(updated)
    setStatus('Unsaved changes…')
    clearTimeout(timers.current.get(id))
    if (immediate) persist(id)
    else timers.current.set(id, setTimeout(() => { timers.current.delete(id); persist(id) }, 450))
  }

  function patchSettings(patch) { if (book) updateBook(book.id, { settings: { ...book.settings, ...patch } }) }
  function startNew() { setEntry({ title: '', author: '', description: '' }); setDialog('new'); setError('') }
  function createBook(event) {
    event.preventDefault()
    if (!ready || !entry.title.trim()) return
    const next = cleanBook({ ...entry, id: uid(), createdAt: Date.now(), chapters: [{ id: uid(), title: 'Chapter 1', html: '' }], settings: initialSettings })
    bookRef.current = [next, ...bookRef.current]
    setBooks(bookRef.current)
    setActiveId(next.id)
    setChapterId(next.chapters[0].id)
    setSection('write')
    setDialog('')
    persist(next.id)
  }

  function openBook(item, target = 'write') { setActiveId(item.id); setChapterId(item.chapters[0].id); setPreviewIndex(0); setSection(target); setMenuId(''); setNotice('') }
  function openAction(item, action) {
    setMenuId('')
    if (action === 'open') return openBook(item)
    if (action === 'backup') return exportProject(item)
    if (action === 'duplicate') {
      const copy = cleanBook({ ...item, title: `${item.title} (Copy)`, createdAt: Date.now() }, true)
      bookRef.current = [copy, ...bookRef.current]
      setBooks(bookRef.current)
      persist(copy.id)
      setNotice('Book duplicated on this device.')
    }
    if (action === 'complete') updateBook(item.id, { status: item.status === 'completed' ? 'draft' : 'completed' }, true)
    if (action === 'rename') { setActiveId(item.id); setEntry({ title: item.title, author: item.author, description: item.description }); setDialog('rename') }
    if (action === 'delete' && window.confirm(`Delete “${item.title}” from this device? Download a backup first if you need it later.`)) {
      clearTimeout(timers.current.get(item.id))
      timers.current.delete(item.id)
      const updated = bookRef.current.filter(row => row.id !== item.id)
      bookRef.current = updated
      setBooks(updated)
      if (activeId === item.id) { setActiveId(''); setChapterId(''); setSection('books') }
      deleteLocalBook(item.id).then(() => setNotice('Book deleted.')).catch(err => setError(err.message))
    }
  }

  function renameBook(event) { event.preventDefault(); if (!book || !entry.title.trim()) return; updateBook(book.id, { title: entry.title.trim(), author: entry.author.trim(), description: entry.description.trim() }, true); setDialog('') }
  function patchChapter(patch) {
    if (!book || !chapter) return
    updateBook(book.id, { chapters: book.chapters.map(item => item.id === chapter.id ? { ...item, ...patch } : item) })
  }
  function addChapter() {
    if (!book) return
    const next = { id: uid(), title: `Chapter ${book.chapters.length + 1}`, html: '' }
    updateBook(book.id, { chapters: [...book.chapters, next] }, true)
    setChapterId(next.id)
  }
  function moveChapter(delta) {
    if (!book || !chapter) return
    const from = book.chapters.findIndex(item => item.id === chapter.id)
    const to = from + delta
    if (to < 0 || to >= book.chapters.length) return
    const next = [...book.chapters]
    ;[next[from], next[to]] = [next[to], next[from]]
    updateBook(book.id, { chapters: next }, true)
  }
  function removeChapter() {
    if (!book || !chapter || book.chapters.length === 1 || !window.confirm(`Delete “${chapter.title}” and its contents?`)) return
    const next = book.chapters.filter(item => item.id !== chapter.id)
    updateBook(book.id, { chapters: next }, true)
    setChapterId(next[0].id)
  }
  function editorChanged() { if (editorRef.current) patchChapter({ html: safeHTML(editorRef.current.innerHTML) }) }
  function editorCommand(command, value) {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false, value)
    editorChanged()
  }
  function pastePlain(event) {
    event.preventDefault()
    const value = event.clipboardData.getData('text/plain')
    if (!document.execCommand('insertText', false, value)) {
      const selection = window.getSelection()
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const text = document.createTextNode(value)
        range.insertNode(text)
        range.setStartAfter(text)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
    editorChanged()
  }
  useEffect(() => {
    if (section === 'write' && editorRef.current && chapter) editorRef.current.innerHTML = safeHTML(chapter.html)
  }, [section, activeId, chapterId, ready])

  async function exportProject(item = book) {
    if (!item) return
    try {
      if (timers.current.has(item.id)) { clearTimeout(timers.current.get(item.id)); timers.current.delete(item.id); persist(item.id) }
      await flushLocalBooks()
      const latest = bookRef.current.find(row => row.id === item.id) || item
      downloadFile(`${safeFileName(latest.title)}.shadowdocs`, JSON.stringify({ format: 'shadow-docs', version: 1, book: latest }), 'application/json')
      setNotice('Project backup downloaded. Keep this file somewhere safe.')
    } catch (err) { setError(`Backup failed: ${err.message}`) }
  }
  async function importProject(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 15000000 || !file.name.toLowerCase().endsWith('.shadowdocs')) { setError('Choose a .shadowdocs project smaller than 15 MB.'); return }
    try {
      const value = JSON.parse(await file.text())
      if (value.format !== 'shadow-docs' || value.version !== 1) throw new Error('Unsupported project format.')
      const imported = cleanBook(value.book, true)
      bookRef.current = [imported, ...bookRef.current]
      setBooks(bookRef.current)
      persist(imported.id)
      openBook(imported)
      setNotice('Project restored to this device. The original file is unchanged.')
    } catch (err) { setError(`Could not open project: ${err.message}`) }
  }
  async function uploadCover(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !book) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 6000000) { setError('Choose a JPG, PNG or WebP image under 6 MB.'); return }
    try {
      let bitmap
      if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(file)
      else {
        const url = URL.createObjectURL(file)
        try {
          bitmap = await new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => resolve(image)
            image.onerror = () => reject(new Error('Unable to open the cover image.'))
            image.src = url
          })
        } finally { URL.revokeObjectURL(url) }
      }
      const scale = Math.min(1, 900 / bitmap.width, 1200 / bitmap.height)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      bitmap.close?.()
      const image = canvas.toDataURL('image/jpeg', .78)
      if (!validImage(image)) throw new Error('Cover image is too large after processing.')
      updateBook(book.id, { image }, true)
    } catch (err) { setError(`Cover upload failed: ${err.message}`) }
  }

  const visibleBooks = useMemo(() => books.filter(item => (filter === 'All Books' || (filter === 'Drafts' ? item.status === 'draft' : item.status === 'completed')) && `${item.title} ${item.author}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt), [books, filter, search])
  const [printWidth, printHeight] = sizes[settings.size] || sizes.A5
  const printRule = `@page { size: ${settings.size}; margin: 0; }`

  return <div className="sd-app">
    <style>{printRule}</style>
    <header className="sd-header"><div className="sd-header-inner">
      <IconButton icon={ChevronLeft} label="Back to Apps" onClick={() => navigate('/app')}/>
      <div className="sd-brand-icon"><BookOpen size={23}/></div>
      <div className="sd-brand"><strong>Shadow Docs</strong><small>WRITE · DESIGN · PUBLISH</small></div>
      <span className="sd-local-chip"><CloudOff size={13}/> Local-first</span>
    </div></header>

    <main className="sd-main">
      <div className="sd-topline"><div><span className="sd-eyebrow">YOUR PUBLISHING WORKSPACE</span><h1>{nav.find(item => item.id === section)?.title}</h1><p>{section === 'books' ? 'From your first draft to your finished book.' : book ? book.title : 'Start a new book to use this studio.'}</p></div><div className="sd-top-actions">{book && section !== 'books' && <button type="button" className="sd-button sd-button-ghost" onClick={() => setSection('books')}><BookOpen size={16}/> Library</button>}{section === 'books' && <button type="button" className="sd-button sd-button-primary" onClick={startNew} disabled={!ready || Boolean(error && !books.length)}><Plus size={16}/> New Book</button>}</div></div>
      {error && <div className="sd-alert sd-alert-error" role="alert"><span>{error}</span><button type="button" aria-label="Dismiss error" onClick={() => setError('')}><X size={16}/></button></div>}
      {notice && <div className="sd-alert sd-alert-ok" role="status"><span>{notice}</span><button type="button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={16}/></button></div>}
      <div className="sd-status"><ShieldCheck size={15}/><span>{status}</span><span className="sd-status-note">Projects stay in this browser. Download backups regularly.</span></div>

      {section === 'books' && <div className="sd-stack">
        <Card className="sd-hero"><div><span className="sd-eyebrow">MY LIBRARY</span><h2>Every great book starts here.</h2><p>Write chapters, format pages and create PDF files — without uploading your drafts to a server.</p><div className="sd-inline"><button type="button" className="sd-button sd-button-primary" onClick={startNew} disabled={!ready}><Plus size={17}/> Create a Book</button><button type="button" className="sd-button sd-button-ghost" onClick={() => restoreRef.current?.click()} disabled={!ready}><Upload size={17}/> Open Project</button></div></div><div className="sd-hero-art"><BookOpen size={64}/><span>YOUR NEXT<br/>CHAPTER</span></div></Card>
        <div className="sd-library-controls"><div className="sd-segments">{['All Books', 'Drafts', 'Completed'].map(item => <button type="button" key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="sd-search"><Search size={17}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search your books…" aria-label="Search your books"/></label></div>
        {visibleBooks.length ? <div className="sd-library-grid">{visibleBooks.map(item => <Card className="sd-book-card" key={item.id}><button type="button" className="sd-book-cover" onClick={() => openBook(item)} aria-label={`Open ${item.title}`}><Cover book={item}/></button><div className="sd-book-meta"><div className="sd-book-label"><span>{item.status === 'completed' ? 'COMPLETED' : 'DRAFT'}</span><div className="sd-book-menu-wrap"><IconButton icon={MoreHorizontal} label={`Actions for ${item.title}`} onClick={() => setMenuId(menuId === item.id ? '' : item.id)}/>{menuId === item.id && <div className="sd-book-menu">{[['open', 'Continue writing'], ['rename', 'Edit details'], ['duplicate', 'Duplicate'], ['complete', item.status === 'completed' ? 'Move to Drafts' : 'Mark completed'], ['backup', 'Download backup'], ['delete', 'Delete']].map(([action, label]) => <button type="button" key={action} onClick={() => openAction(item, action)}>{label}</button>)}</div>}</div></div><h3>{item.title}</h3><p>{item.author || 'Unnamed author'} · {item.chapters.length} {item.chapters.length === 1 ? 'chapter' : 'chapters'}</p><small>Edited {new Date(item.updatedAt).toLocaleDateString()}</small><button type="button" className="sd-link" onClick={() => openBook(item)}>Continue writing <ArrowRight size={15}/></button></div></Card>)}</div> : <Card className="sd-empty"><FolderOpen size={40}/><h3>{books.length ? 'No matching books' : 'Your library is waiting'}</h3><p>{books.length ? 'Try another search or book status.' : 'Create your first book and save it on your own device.'}</p>{!books.length && <button type="button" className="sd-button sd-button-primary" onClick={startNew}><Plus size={16}/> New Book</button>}</Card>}
        <div className="sd-help"><ShieldCheck size={18}/><p><strong>Your work is local.</strong> Clearing browser data, losing your device or changing browsers can remove projects. Use Download backup and keep the .shadowdocs file in a safe place.</p></div>
      </div>}

      {section === 'write' && (!book || !chapter ? <EmptyBook onClick={() => setSection('books')}/> : <div className="sd-writing-layout"><aside className="sd-chapters"><div className="sd-side-head"><strong>Chapters</strong><IconButton icon={Plus} label="Add chapter" onClick={addChapter}/></div><div className="sd-chapter-list">{book.chapters.map((item, index) => <button type="button" key={item.id} className={`sd-chapter-item ${chapter.id === item.id ? 'is-active' : ''}`} onClick={() => setChapterId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong></button>)}</div><div className="sd-side-foot">{book.chapters.length} chapters · {book.status}</div></aside>
        <div className="sd-writing-main"><Card className="sd-editor-card"><div className="sd-editor-head"><div><span className="sd-eyebrow">CHAPTER {book.chapters.findIndex(item => item.id === chapter.id) + 1}</span><input className="sd-chapter-title" aria-label="Chapter title" value={chapter.title} onChange={event => patchChapter({ title: event.target.value.slice(0, 160) })}/></div><button type="button" className="sd-button sd-button-ghost" onClick={() => { setPreviewIndex(book.chapters.findIndex(item => item.id === chapter.id) + 1); setSection('pdf') }}><Eye size={16}/> Preview</button></div>
          <div className="sd-editor-tools" aria-label="Formatting toolbar"><button type="button" title="Bold" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('bold')}><b>B</b></button><button type="button" title="Italic" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('italic')}><i>I</i></button><button type="button" title="Underline" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('underline')}><u>U</u></button><span className="sd-toolbar-divider"/><button type="button" title="Chapter heading" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('formatBlock', 'h2')}>H2</button><button type="button" title="Paragraph" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('formatBlock', 'p')}>¶</button><button type="button" title="Bullet list" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('insertUnorderedList')}>≡</button><span className="sd-toolbar-divider"/><button type="button" title="Align left" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('justifyLeft')}><AlignLeft size={16}/></button><button type="button" title="Align center" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('justifyCenter')}><AlignCenter size={16}/></button><button type="button" title="Justify" onMouseDown={event => event.preventDefault()} onClick={() => editorCommand('justifyFull')}><AlignJustify size={16}/></button></div>
          <div key={`${book.id}-${chapter.id}`} ref={editorRef} className="sd-writing-area" contentEditable suppressContentEditableWarning onInput={editorChanged} onBlur={() => { if (timers.current.has(book.id)) { clearTimeout(timers.current.get(book.id)); timers.current.delete(book.id); persist(book.id) } }} onPaste={pastePlain} data-placeholder="Start writing your chapter…" role="textbox" aria-label="Chapter text editor" aria-multiline="true" spellCheck style={{ fontFamily: `"${settings.font}", serif`, fontSize: `${settings.fontSize + 2}px`, lineHeight: settings.lineSpacing, textAlign: settings.alignment }}/>
          <div className="sd-editor-footer"><span>{wordCount.toLocaleString()} words</span><span><CheckCircle2 size={15}/> {status}</span></div></Card><div className="sd-editor-actions"><div className="sd-inline"><IconButton icon={ArrowUp} label="Move chapter up" onClick={() => moveChapter(-1)} disabled={book.chapters[0]?.id === chapter.id}/><IconButton icon={ArrowDown} label="Move chapter down" onClick={() => moveChapter(1)} disabled={book.chapters[book.chapters.length - 1]?.id === chapter.id}/><IconButton icon={Trash2} label="Delete chapter" onClick={removeChapter} disabled={book.chapters.length === 1} danger/></div><div className="sd-inline"><button type="button" className="sd-button sd-button-ghost" onClick={() => exportProject(book)}><Download size={16}/> Backup</button><button type="button" className="sd-button sd-button-primary" onClick={() => setSection('design')}>Design Book <ArrowRight size={16}/></button></div></div></div></div>)}

      {section === 'design' && (!book ? <EmptyBook onClick={() => setSection('books')}/> : <div className="sd-designer-layout"><div className="sd-stack"><div className="sd-segments sd-design-tabs">{['Layout', 'Typography', 'Style'].map(item => <button type="button" className={designTab === item ? 'is-active' : ''} key={item} onClick={() => setDesignTab(item)}>{item}</button>)}</div>
        {designTab === 'Layout' && <Card><h2>Page setup</h2><p className="sd-section-desc">Choose a format for your finished book.</p><label className="sd-field-label">PAGE SIZE</label><div className="sd-page-sizes">{Object.entries(sizes).map(([size, [w, h]]) => <button type="button" key={size} className={`sd-choice ${settings.size === size ? 'is-selected' : ''}`} onClick={() => patchSettings({ size })}><FileText size={23}/><strong>{size}</strong><small>{w} × {h} mm</small>{settings.size === size && <Check size={15}/>}</button>)}</div><div className="sd-setting-line"><label htmlFor="sd-margin">Margins <small>All sides</small></label><div className="sd-stepper"><input id="sd-margin" type="number" min="10" max="35" value={settings.margin} onChange={event => patchSettings({ margin: Math.max(10, Math.min(35, Number(event.target.value) || 10)) })}/><span>mm</span></div></div><div className="sd-setting-line"><label htmlFor="sd-numbers">Chapter footer number <small>Chapter index, not physical page count</small></label><input id="sd-numbers" type="checkbox" checked={settings.numbers} onChange={event => patchSettings({ numbers: event.target.checked })} className="sd-toggle"/></div></Card>}
        {designTab === 'Typography' && <Card><h2>Typography</h2><p className="sd-section-desc">Fine-tune Khmer and English text.</p><label className="sd-field-label" htmlFor="sd-font">FONT FAMILY</label><select id="sd-font" value={settings.font} onChange={event => patchSettings({ font: event.target.value })} className="sd-field">{fonts.map(item => <option key={item}>{item}</option>)}</select><div className="sd-setting-line"><label htmlFor="sd-font-size">Text size</label><div className="sd-stepper"><input id="sd-font-size" type="number" min="10" max="24" value={settings.fontSize} onChange={event => patchSettings({ fontSize: Math.max(10, Math.min(24, Number(event.target.value) || 10)) })}/><span>pt</span></div></div><div className="sd-setting-line"><label htmlFor="sd-spacing">Line spacing</label><select id="sd-spacing" className="sd-field sd-small-field" value={settings.lineSpacing} onChange={event => patchSettings({ lineSpacing: Number(event.target.value) })}>{[1.2, 1.4, 1.65, 1.8, 2].map(value => <option key={value} value={value}>{value}</option>)}</select></div><label className="sd-field-label">TEXT ALIGNMENT</label><div className="sd-inline">{[[AlignLeft, 'left'], [AlignCenter, 'center'], [AlignRight, 'right'], [AlignJustify, 'justify']].map(([Icon, value]) => <button type="button" key={value} className={`sd-choice-icon ${settings.alignment === value ? 'is-selected' : ''}`} onClick={() => patchSettings({ alignment: value })} title={value}><Icon size={18}/></button>)}</div></Card>}
        {designTab === 'Style' && <Card><h2>Chapter style</h2><p className="sd-section-desc">A consistent style across every chapter.</p><div className="sd-style-grid">{['classic', 'modern', 'minimal'].map(item => <button type="button" key={item} className={`sd-style-choice sd-chapter-style--${item} ${settings.chapterStyle === item ? 'is-selected' : ''}`} onClick={() => patchSettings({ chapterStyle: item })}><span>CHAPTER ONE</span><strong>A New Beginning</strong><small>{item}</small></button>)}</div><p className="sd-hint">Your settings are saved to this book, not uploaded.</p></Card>}
        <div className="sd-inline sd-designer-actions"><button type="button" className="sd-button sd-button-ghost" onClick={() => exportProject(book)}><Download size={16}/> Download Backup</button><button type="button" className="sd-button sd-button-primary" onClick={() => setSection('templates')}>Choose Template <ArrowRight size={16}/></button></div></div>
        <Card className="sd-live-preview"><div className="sd-panel-title"><h2>Live preview</h2><span>{settings.size} · {settings.fontSize} pt</span></div><div className="sd-paper-frame"><div className="sd-paper" style={{ aspectRatio: `${pageWidth}/${pageHeight}`, fontFamily: `"${settings.font}", serif`, padding: `${settings.margin / pageWidth * 100}%`, textAlign: settings.alignment }}><span className={`sd-paper-heading sd-chapter-style--${settings.chapterStyle}`}>{book.chapters[0]?.title}</span><div className="sd-paper-content" style={{ lineHeight: settings.lineSpacing }} dangerouslySetInnerHTML={{ __html: safeHTML(book.chapters[0]?.html || '<p>Your story begins on this page.</p>') }}/>{settings.numbers && <span className="sd-paper-number">1</span>}</div></div><p className="sd-hint">Preview is illustrative; final pagination is controlled by your browser’s print engine.</p></Card></div>)}

      {section === 'templates' && (!book ? <EmptyBook onClick={() => setSection('books')}/> : <div className="sd-stack"><div className="sd-template-header"><div><h2>Choose a look for your book.</h2><p>Professional cover styles you can personalize.</p></div><div className="sd-inline"><button type="button" className="sd-button sd-button-ghost" onClick={() => coverRef.current?.click()}><ImagePlus size={16}/> Upload Cover</button>{book.image && <button type="button" className="sd-button sd-button-ghost" onClick={() => updateBook(book.id, { image: '' }, true)}><X size={15}/> Remove Image</button>}</div></div><div className="sd-template-filters">{['All', 'Fiction', 'Nonfiction', 'Education'].map(item => <button type="button" key={item} className={templateFilter === item ? 'is-active' : ''} onClick={() => setTemplateFilter(item)}>{item}</button>)}</div><div className="sd-template-grid">{templates.filter(item => templateFilter === 'All' || item.category === templateFilter).map(item => <button type="button" key={item.id} className={`sd-template-option ${book.template === item.id ? 'is-selected' : ''}`} onClick={() => updateBook(book.id, { template: item.id }, true)}><Cover book={{ ...book, template: item.id, image: '' }}/><div className="sd-template-meta"><div><strong>{item.name}</strong><small>{item.subtitle}</small></div>{book.template === item.id && <CheckCircle2 size={20}/>}</div></button>)}</div><Card className="sd-template-bottom"><div><h3>Your book cover</h3><p>The title and author come from your book details. Your selected style is saved locally.</p></div><button type="button" className="sd-button sd-button-primary" onClick={() => { setPreviewIndex(0); setSection('pdf') }}>Preview Book <ArrowRight size={16}/></button></Card></div>)}

      {section === 'pdf' && (!book ? <EmptyBook onClick={() => setSection('books')}/> : <div className="sd-pdf-layout"><Card className="sd-preview-panel"><div className="sd-panel-title"><h2>Book preview</h2><span>{settings.size} · {pdfSections.length} sections</span></div><div className="sd-pdf-stage">{currentPreview?.cover ? <div className="sd-preview-cover" style={{ aspectRatio: `${pageWidth}/${pageHeight}` }}><Cover book={book} large/></div> : <div className="sd-preview-paper" style={{ aspectRatio: `${pageWidth}/${pageHeight}`, fontFamily: `"${settings.font}", serif`, fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing, textAlign: settings.alignment }}><h2 className={`sd-print-heading sd-chapter-style--${settings.chapterStyle}`}>{currentPreview?.title}</h2><div dangerouslySetInnerHTML={{ __html: safeHTML(currentPreview?.html || '') }}/>{settings.numbers && <small className="sd-preview-number">Section {previewIndex}</small>}</div>}</div><div className="sd-pdf-pager"><IconButton icon={ChevronLeft} label="Previous section" disabled={previewIndex === 0} onClick={() => setPreviewIndex(index => index - 1)}/><span>Section {Math.min(previewIndex + 1, pdfSections.length)} of {pdfSections.length}</span><IconButton icon={ChevronRight} label="Next section" disabled={previewIndex >= pdfSections.length - 1} onClick={() => setPreviewIndex(index => index + 1)}/></div><div className="sd-section-thumbs">{pdfSections.map((item, index) => <button type="button" key={item.id} className={index === previewIndex ? 'is-selected' : ''} onClick={() => setPreviewIndex(index)}>{item.cover ? <BookOpen size={20}/> : <FileText size={20}/>}<span>{item.title}</span></button>)}</div></Card><div className="sd-stack"><Card className="sd-export-card"><span className="sd-eyebrow">PDF STUDIO</span><h2>Ready to share your story?</h2><p>Preview every section, then use your browser’s print dialog to save your book as a PDF on this device.</p><div className="sd-export-summary"><div><span>Page format</span><strong>{settings.size} · {pageWidth} × {pageHeight} mm</strong></div><div><span>Chapters</span><strong>{book.chapters.length}</strong></div><div><span>Source</span><strong>Local device</strong></div></div><button type="button" className="sd-button sd-button-primary sd-wide" onClick={() => { if (timers.current.has(book.id)) { clearTimeout(timers.current.get(book.id)); timers.current.delete(book.id); persist(book.id) }; window.print() }}><Printer size={18}/> Print / Save as PDF</button><button type="button" className="sd-button sd-button-ghost sd-wide" onClick={() => exportProject(book)}><Download size={17}/> Download Editable Project</button><div className="sd-print-hint"><ShieldCheck size={18}/><span>PDF creation uses your browser. Select “Save as PDF” in the print dialog. Check Khmer fonts, page breaks, margins and printer requirements before physical printing.</span></div></Card><Card className="sd-export-card"><h3>Book details</h3><p>{book.title}</p><p>{book.author || 'Author not specified'}</p><button type="button" className="sd-link" onClick={() => { setEntry({ title: book.title, author: book.author, description: book.description }); setDialog('rename') }}>Edit title & author <ArrowRight size={15}/></button></Card></div></div>)}
    </main>

    <nav className="sd-bottom-nav" aria-label="Shadow Docs navigation"><div className="sd-bottom-inner">{nav.map(item => { const Icon = item.icon; return <button type="button" key={item.id} className={section === item.id ? 'is-active' : ''} onClick={() => { setSection(item.id); setMenuId(''); if (item.id === 'pdf') setPreviewIndex(0) }}><Icon size={20} strokeWidth={section === item.id ? 2.35 : 1.8}/><span>{item.title}</span></button> })}</div></nav>

    <input ref={restoreRef} hidden type="file" accept=".shadowdocs,application/json" onChange={importProject}/>
    <input ref={coverRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadCover}/>
    {dialog && <div className="sd-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDialog('') }}><form className="sd-modal" onSubmit={dialog === 'new' ? createBook : renameBook}><div className="sd-panel-title"><h2>{dialog === 'new' ? 'Create a new book' : 'Edit book details'}</h2><IconButton icon={X} label="Close" onClick={() => setDialog('')}/></div><p>Give your book a name. You can edit everything later.</p><label className="sd-field-label" htmlFor="sd-book-title">BOOK TITLE</label><input id="sd-book-title" className="sd-field" autoFocus required maxLength={160} value={entry.title} onChange={event => setEntry(value => ({ ...value, title: event.target.value }))} placeholder="The title of your book"/><label className="sd-field-label" htmlFor="sd-author-name">AUTHOR NAME</label><input id="sd-author-name" className="sd-field" maxLength={120} value={entry.author} onChange={event => setEntry(value => ({ ...value, author: event.target.value }))} placeholder="Your pen name"/><label className="sd-field-label" htmlFor="sd-book-description">DESCRIPTION (OPTIONAL)</label><textarea id="sd-book-description" className="sd-field sd-textarea" maxLength={350} rows={3} value={entry.description} onChange={event => setEntry(value => ({ ...value, description: event.target.value }))} placeholder="A short description"/><div className="sd-modal-actions"><button type="button" className="sd-button sd-button-ghost" onClick={() => setDialog('')}>Cancel</button><button type="submit" className="sd-button sd-button-primary" disabled={!entry.title.trim()}>{dialog === 'new' ? 'Create Book' : 'Save Changes'}</button></div></form></div>}

    {book && <div className="sd-print-root" aria-hidden="true"><article className="sd-print-page sd-print-cover" style={{ width: `${printWidth}mm`, minHeight: `${printHeight}mm` }}><Cover book={book} large/></article>{book.chapters.map((item, index) => <article key={item.id} className="sd-print-page sd-print-chapter" style={{ width: `${printWidth}mm`, minHeight: `${printHeight}mm`, padding: `${settings.margin}mm`, fontFamily: `"${settings.font}",serif`, fontSize: `${settings.fontSize}pt`, lineHeight: settings.lineSpacing, textAlign: settings.alignment }}><h2 className={`sd-print-heading sd-chapter-style--${settings.chapterStyle}`}>{item.title}</h2><div className="sd-print-content" dangerouslySetInnerHTML={{ __html: safeHTML(item.html) }}/>{settings.numbers && <footer>{index + 1}</footer>}</article>)}</div>}
  </div>
}

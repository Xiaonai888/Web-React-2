import { useMemo, useState } from 'react'
import { BookOpen, CheckCircle2, Copy, Download, FilePlus2, FolderOpen, MoreHorizontal, PenLine, Plus, Search, Settings2, Trash2, Upload, X } from 'lucide-react'
import { getBookTemplate, getCoverPreset } from './ShadowDocsTemplateCatalog'

const FILTERS = ['All Books', 'Drafts', 'Completed']
const safeImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2500000

function BookCover({ book }) {
  const template = getBookTemplate(book.template)
  const colors = getCoverPreset(template.cover)
  const withImage = safeImage(book.image)
  return (
    <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-between overflow-hidden rounded-xl p-[10%] text-center" style={{ background: colors.background, backgroundImage: withImage ? `linear-gradient(180deg,rgba(20,15,35,.2),rgba(20,15,35,.7)),url("${book.image}")` : colors.background, backgroundSize: 'cover', backgroundPosition: 'center', color: withImage ? '#fff' : colors.foreground }}>
      <span aria-hidden="true" className="text-2xl opacity-90">{template.symbol}</span>
      <div className="w-full min-w-0"><span className="block text-[7px] font-semibold tracking-[.14em] opacity-80">SHADOW DOCS</span><strong className="mt-2 block break-words text-[12px] leading-snug sm:text-[15px]" style={{ fontFamily: 'Georgia, "Noto Serif Khmer", serif' }}>{book.title || 'Untitled Book'}</strong><span className="mx-auto my-2 block h-px w-10" style={{ background: withImage ? '#fff' : colors.accent }} /><small className="block break-words text-[9px]">{book.author || 'YOUR NAME'}</small></div>
      <span aria-hidden="true" className="text-lg opacity-80">{template.symbol}</span>
    </div>
  )
}

export default function ShadowDocsMyBooksPanel({ books = [], ready = true, onCreate, onImport, onOpen, onAction }) {
  const [filter, setFilter] = useState('All Books')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState('')
  const library = Array.isArray(books) ? books : []
  const visibleBooks = useMemo(() => library.filter(book => {
    if (filter === 'Drafts' && book.status === 'completed') return false
    if (filter === 'Completed' && book.status !== 'completed') return false
    return `${book.title || ''} ${book.author || ''}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  }).sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0)), [library, filter, search])

  function action(book, value) {
    setMenuId('')
    onAction?.(book, value)
  }

  return (
    <section aria-label="My Books" className="sd-stack">
      <div className="sd-card flex flex-wrap items-center justify-between gap-5 bg-[#f6f0ff] dark:bg-[#2d263e]">
        <div className="min-w-0"><span className="sd-eyebrow">MY LIBRARY</span><h2 className="mt-2">Your books, your workspace</h2><p className="mt-2 max-w-xl text-[12px] leading-6 text-[#77758b] dark:text-white/65">Write and design books on this device. Download a project backup to keep a separate copy.</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" disabled={!ready || typeof onCreate !== 'function'} onClick={onCreate} className="sd-button sd-button-primary"><Plus size={16}/> Create a Book</button><button type="button" disabled={!ready || typeof onImport !== 'function'} onClick={onImport} className="sd-button sd-button-ghost"><Upload size={16}/> Import Backup</button></div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter books" className="sd-segments max-w-full overflow-x-auto">{FILTERS.map(item => <button type="button" key={item} aria-pressed={filter === item} className={filter === item ? 'is-active' : ''} onClick={() => { setFilter(item); setMenuId('') }}>{item}</button>)}</div>
        <label className="sd-search"><Search size={17}/><input type="search" aria-label="Search books" placeholder="Search your books…" value={search} onChange={event => { setSearch(event.target.value); setMenuId('') }} />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={15}/></button>}</label>
      </div>

      {!ready && <p role="status" className="sd-card text-center text-sm text-[#77758b]">Loading books saved on this device…</p>}
      {ready && !visibleBooks.length && <div className="sd-card flex min-h-[230px] flex-col items-center justify-center gap-3 text-center"><FolderOpen size={38} className="text-[#7653bd]"/><h3>{library.length ? 'No books match your search' : 'Start your first book'}</h3><p className="max-w-sm text-[12px] leading-6 text-[#77758b] dark:text-white/65">{library.length ? 'Try a different keyword or book status.' : 'Create a book to start writing. Your drafts are saved locally.'}</p>{!library.length && <button type="button" disabled={typeof onCreate !== 'function'} onClick={onCreate} className="sd-button sd-button-primary"><FilePlus2 size={16}/> Create a Book</button>}</div>}

      {ready && visibleBooks.length > 0 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleBooks.map(book => (
        <article key={book.id} className="sd-card flex min-w-0 gap-3 p-3">
          <button type="button" onClick={() => onOpen?.(book, 'write')} disabled={typeof onOpen !== 'function'} className="w-[92px] shrink-0 self-start overflow-hidden rounded-xl text-left shadow-sm disabled:cursor-default" aria-label={`Open ${book.title || 'Untitled Book'}`}><BookCover book={book}/></button>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-1"><span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#7653bd] dark:text-[#d4c1ff]">{book.status === 'completed' ? <><CheckCircle2 size={12}/> COMPLETED</> : 'DRAFT'}</span>
              <div className="relative"><button type="button" aria-label={`Book actions for ${book.title || 'Untitled Book'}`} aria-expanded={menuId === book.id} onClick={() => setMenuId(id => id === book.id ? '' : book.id)} className="sd-icon-button h-8 w-8 border-0"><MoreHorizontal size={17}/></button>
                {menuId === book.id && <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-[#e9e5f1] bg-white p-1 shadow-lg dark:border-white/15 dark:bg-[#252333]">{[
                  ['backup', Download, 'Download backup'],
                  ['duplicate', Copy, 'Duplicate book'],
                  ['rename', PenLine, 'Edit details'],
                  ['complete', CheckCircle2, book.status === 'completed' ? 'Mark as draft' : 'Mark completed'],
                  ['delete', Trash2, 'Delete book'],
                ].map(([id, Icon, label]) => <button key={id} type="button" disabled={typeof onAction !== 'function'} onClick={() => action(book, id)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] hover:bg-[#f5f0ff] disabled:opacity-50 dark:hover:bg-white/10 ${id === 'delete' ? 'text-red-600 dark:text-red-300' : 'text-[#332b43] dark:text-white'}`}><Icon size={14}/>{label}</button>)}</div>}
              </div>
            </div>
            <h3 className="mt-1 line-clamp-2 break-words text-[13px] font-bold leading-5">{book.title || 'Untitled Book'}</h3><p className="mt-1 truncate text-[11px] text-[#77758b] dark:text-white/60">{book.author || 'Author not specified'}</p><p className="mt-1 text-[10px] text-[#93899f] dark:text-white/45">{Array.isArray(book.chapters) ? book.chapters.length : 0} chapters</p>
            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-2 pt-3"><button type="button" disabled={typeof onOpen !== 'function'} onClick={() => onOpen?.(book, 'write')} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7653bd] dark:text-[#d4c1ff]"><BookOpen size={13}/> Write</button><button type="button" disabled={typeof onOpen !== 'function'} onClick={() => onOpen?.(book, 'design')} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7653bd] dark:text-[#d4c1ff]"><Settings2 size={13}/> Design</button></div>
          </div>
        </article>
      ))}</div>}
      <p className="text-[11px] leading-5 text-[#77758b] dark:text-white/55">Projects stay in this browser. Clearing browser data or losing this device may remove them; download backups regularly.</p>
    </section>
  )
}

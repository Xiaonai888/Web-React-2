import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  FilePlus2,
  FolderOpen,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Share2,
  Smartphone,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { getBookTemplate, getCoverPreset } from './ShadowDocsTemplateCatalog'

const MAIN_TABS = ['This Device', 'Recent', 'Share', 'Trash']
const RECENT_FILTERS = ['All', 'Today', 'This Week', 'This Month']
const PAGE_SIZE = 20
const safeImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2500000

function BookCover({ book }) {
  const template = getBookTemplate(book.template)
  const colors = getCoverPreset(template.cover)
  const withImage = safeImage(book.image)
  return (
    <div
      className="relative flex aspect-[3/4] w-full flex-col items-center justify-between overflow-hidden rounded-xl p-[10%] text-center"
      style={{
        background: colors.background,
        backgroundImage: withImage
          ? `linear-gradient(180deg,rgba(20,15,35,.2),rgba(20,15,35,.7)),url("${book.image}")`
          : colors.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: withImage ? '#fff' : colors.foreground,
      }}
    >
      <span aria-hidden="true" className="text-xl opacity-90">{template.symbol}</span>
      <div className="w-full min-w-0">
        <span className="block text-[6px] font-semibold tracking-[.12em] opacity-80">SHADOW DOCS</span>
        <strong
          className="mt-1 block break-words text-[9px] leading-snug"
          style={{ fontFamily: 'Georgia, "Noto Serif Khmer", serif' }}
        >
          {book.title || 'Untitled Book'}
        </strong>
      </div>
      <span aria-hidden="true" className="text-sm opacity-80">{template.symbol}</span>
    </div>
  )
}

function startOfToday(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function isToday(timestamp) {
  const value = Number(timestamp) || 0
  return value >= startOfToday()
}

function isThisWeek(timestamp) {
  const value = Number(timestamp) || 0
  return value >= Date.now() - (7 * 24 * 60 * 60 * 1000)
}

function isThisMonth(timestamp) {
  const date = new Date(Number(timestamp) || 0)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

function relativeTime(timestamp) {
  const value = Number(timestamp) || 0
  if (!value) return 'Recently'
  const difference = Math.max(0, Date.now() - value)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(difference / 3600000)
  const days = Math.floor(difference / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(value).toLocaleDateString()
}

function recentGroup(timestamp) {
  if (isToday(timestamp)) return 'Today'
  if (isThisWeek(timestamp)) return 'This Week'
  if (isThisMonth(timestamp)) return 'This Month'
  return 'Older'
}

export default function ShadowDocsMyBooksPanel({
  books = [],
  ready = true,
  onCreate,
  onImport,
  onOpen,
  onAction,
  onOpenTrash,
}) {
  const [tab, setTab] = useState('This Device')
  const [recentFilter, setRecentFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState('')
  const [page, setPage] = useState(1)

  const library = (Array.isArray(books) ? books : []).filter(book => !book.deletedAt)
  const trashedCount = (Array.isArray(books) ? books : []).filter(book => !!book.deletedAt).length

  const filteredRecent = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase()
    return library
      .filter(book => {
        const timestamp = Number(book.updatedAt) || Number(book.createdAt) || 0
        if (recentFilter === 'Today' && !isToday(timestamp)) return false
        if (recentFilter === 'This Week' && !isThisWeek(timestamp)) return false
        if (recentFilter === 'This Month' && !isThisMonth(timestamp)) return false
        return `${book.title || ''} ${book.author || ''}`.toLocaleLowerCase().includes(keyword)
      })
      .sort((a, b) => (Number(b.updatedAt) || Number(b.createdAt) || 0) - (Number(a.updatedAt) || Number(a.createdAt) || 0))
  }, [library, recentFilter, search])

  const pageCount = Math.max(1, Math.ceil(filteredRecent.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageBooks = filteredRecent.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const groupedRecent = useMemo(() => {
    const groups = new Map()
    pageBooks.forEach(book => {
      const group = recentGroup(book.updatedAt || book.createdAt)
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(book)
    })
    return [...groups.entries()]
  }, [pageBooks])

  function action(book, value) {
    setMenuId('')
    onAction?.(book, value)
  }

  function selectTab(item) {
    setMenuId('')
    if (item === 'Trash') {
      onOpenTrash?.()
      return
    }
    setTab(item)
    setPage(1)
  }

  return (
    <section aria-label="My Books" className="sd-stack">
      <div className="sd-card flex flex-wrap items-center justify-between gap-5 bg-[#f6f0ff] dark:bg-[#2d263e]">
        <div className="min-w-0">
          <span className="sd-eyebrow">MY LIBRARY</span>
          <h2 className="mt-2">Your books, your workspace</h2>
          <p className="mt-2 max-w-xl text-[12px] leading-6 text-[#77758b] dark:text-white/65">
            Write and design books on this device. Download a project backup to keep a separate copy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!ready || typeof onCreate !== 'function'}
            onClick={onCreate}
            className="sd-button sd-button-primary"
          >
            <Plus size={16} /> Create a Book
          </button>
          <button
            type="button"
            disabled={!ready || typeof onImport !== 'function'}
            onClick={onImport}
            className="sd-button sd-button-ghost"
          >
            <Upload size={16} /> Import Backup
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Local library sections"
        className="sd-segments w-full"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))' }}
      >
        {MAIN_TABS.map(item => (
          <button
            type="button"
            role="tab"
            key={item}
            aria-selected={tab === item}
            className={tab === item ? 'is-active' : ''}
            onClick={() => selectTab(item)}
          >
            {item === 'Trash' && trashedCount ? `Trash (${trashedCount})` : item}
          </button>
        ))}
      </div>

      {tab === 'This Device' && (
        <div className="sd-card flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8fbf6] text-[#24a883] dark:bg-[#16372f] dark:text-[#4fd7b1]">
            <Smartphone size={27} />
          </span>
          <div>
            <h3>Import from this device</h3>
            <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-[#77758b] dark:text-white/60">
              Your Shadow Docs projects stay local in this browser. Import a backup or create a new book.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              disabled={!ready || typeof onImport !== 'function'}
              onClick={onImport}
              className="sd-button sd-button-primary"
            >
              <Upload size={16} /> Import
            </button>
            <button
              type="button"
              disabled={!ready || typeof onCreate !== 'function'}
              onClick={onCreate}
              className="sd-button sd-button-ghost"
            >
              <FilePlus2 size={16} /> Create Book
            </button>
          </div>
          <span className="text-[10px] text-[#8c8797] dark:text-white/40">
            {library.length} local book{library.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      {tab === 'Recent' && (
        <div className="sd-stack">
          <div className="flex flex-col gap-3">
            <label className="sd-search w-full max-w-none">
              <Search size={17} />
              <input
                type="search"
                aria-label="Search recent books"
                placeholder="Search recent books…"
                value={search}
                onChange={event => {
                  setSearch(event.target.value)
                  setPage(1)
                  setMenuId('')
                }}
              />
              {search && (
                <button type="button" aria-label="Clear search" onClick={() => { setSearch(''); setPage(1) }}>
                  <X size={15} />
                </button>
              )}
            </label>

            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              <div className="sd-segments shrink-0">
                {RECENT_FILTERS.map(item => (
                  <button
                    type="button"
                    key={item}
                    aria-pressed={recentFilter === item}
                    className={recentFilter === item ? 'is-active' : ''}
                    onClick={() => {
                      setRecentFilter(item)
                      setPage(1)
                      setMenuId('')
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <span className="shrink-0 rounded-xl border border-[var(--sd-border)] bg-[var(--sd-surface)] px-3 py-2 text-[11px] text-[#77758b] dark:text-white/60">
                20 per page
              </span>
            </div>
          </div>

          {!ready && (
            <p role="status" className="sd-card text-center text-sm text-[#77758b]">
              Loading books saved on this device…
            </p>
          )}

          {ready && !pageBooks.length && (
            <div className="sd-card flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
              <Clock3 size={38} className="text-[#2da984]" />
              <h3>No recent books</h3>
              <p className="max-w-sm text-[12px] leading-6 text-[#77758b] dark:text-white/60">
                Open or edit a local book and it will appear here.
              </p>
            </div>
          )}

          {ready && pageBooks.length > 0 && (
            <div className="grid gap-5">
              {groupedRecent.map(([group, items]) => (
                <div key={group}>
                  <h3 className="mb-2 text-[14px] font-bold">{group}</h3>
                  <div className="overflow-hidden rounded-2xl border border-[var(--sd-border)] bg-[var(--sd-surface)]">
                    {items.map((book, index) => (
                      <article
                        key={book.id}
                        className={`flex min-w-0 items-center gap-3 p-3 ${index ? 'border-t border-[var(--sd-border)]' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => onOpen?.(book, 'write')}
                          disabled={typeof onOpen !== 'function'}
                          className="w-[58px] shrink-0 overflow-hidden rounded-lg text-left shadow-sm disabled:cursor-default"
                          aria-label={`Open ${book.title || 'Untitled Book'}`}
                        >
                          <BookCover book={book} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpen?.(book, 'write')}
                          disabled={typeof onOpen !== 'function'}
                          className="min-w-0 flex-1 text-left"
                        >
                          <strong className="block truncate text-[13px] text-[var(--sd-text)]">
                            {book.title || 'Untitled Book'}
                          </strong>
                          <span className="mt-1 block text-[10px] text-[#77758b] dark:text-white/55">
                            {Array.isArray(book.chapters) ? book.chapters.length : 0} chapters · {book.status === 'completed' ? 'Completed' : 'Draft'}
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-[10px] text-[#93899f] dark:text-white/40">
                            <Clock3 size={11} /> {relativeTime(book.updatedAt || book.createdAt)}
                          </span>
                        </button>

                        <span className="hidden items-center gap-1 rounded-full border border-[#bfe9dc] px-2 py-1 text-[9px] font-bold text-[#278c70] dark:border-[#235f50] dark:text-[#51d2af] sm:inline-flex">
                          <Smartphone size={11} /> Local
                        </span>

                        <div className="relative">
                          <button
                            type="button"
                            aria-label={`Book actions for ${book.title || 'Untitled Book'}`}
                            aria-expanded={menuId === book.id}
                            onClick={() => setMenuId(id => id === book.id ? '' : book.id)}
                            className="sd-icon-button h-8 w-8 border-0"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {menuId === book.id && (
                            <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-[#e9e5f1] bg-white p-1 shadow-lg dark:border-white/15 dark:bg-[#252333]">
                              {[
                                ['backup', Download, 'Download backup'],
                                ['duplicate', Copy, 'Duplicate book'],
                                ['rename', PenLine, 'Edit details'],
                                ['complete', CheckCircle2, book.status === 'completed' ? 'Mark as draft' : 'Mark completed'],
                                ['delete', Trash2, 'Move to Trash'],
                              ].map(([id, Icon, label]) => (
                                <button
                                  key={id}
                                  type="button"
                                  disabled={typeof onAction !== 'function'}
                                  onClick={() => action(book, id)}
                                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] hover:bg-[#eefaf6] disabled:opacity-50 dark:hover:bg-white/10 ${id === 'delete' ? 'text-red-600 dark:text-red-300' : 'text-[#332b43] dark:text-white'}`}
                                >
                                  <Icon size={14} /> {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {ready && filteredRecent.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="sd-button sd-button-ghost"
                disabled={safePage <= 1}
                onClick={() => { setPage(value => Math.max(1, value - 1)); setMenuId('') }}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <span className="text-[11px] text-[#77758b] dark:text-white/55">
                Page {safePage} of {pageCount}
              </span>
              <button
                type="button"
                className="sd-button sd-button-ghost"
                disabled={safePage >= pageCount}
                onClick={() => { setPage(value => Math.min(pageCount, value + 1)); setMenuId('') }}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'Share' && (
        <div className="sd-card flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
          <Share2 size={38} className="text-[#2da984]" />
          <h3>Share</h3>
          <p className="max-w-sm text-[12px] leading-6 text-[#77758b] dark:text-white/60">
            Sharing tools are temporarily hidden while the new local library UI is being rebuilt.
          </p>
          <p className="text-[10px] text-[#93899f] dark:text-white/40">
            Existing backup and export functions are unchanged.
          </p>
        </div>
      )}

      <div hidden aria-hidden="true">
        <button type="button">All Books</button>
        <button type="button">Drafts</button>
        <button type="button">Completed</button>
        <FolderOpen />
      </div>

      <p className="text-[11px] leading-5 text-[#77758b] dark:text-white/55">
        Projects stay in this browser. Clearing browser data or losing this device may remove them; download backups regularly.
      </p>
    </section>
  )
}

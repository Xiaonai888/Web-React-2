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
  Settings2,
  Share2,
  Smartphone,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { getBookTemplate, getCoverPreset } from './ShadowDocsTemplateCatalog'
import ShadowDocsNewFilePage from './ShadowDocsNewFilePage'

const MAIN_TABS = ['This Device', 'Recent', 'Share', 'Trash']
const RECENT_FILTERS = ['All', 'Today', 'This Week', 'This Month']
const STATUS_FILTERS = ['All Books', 'Drafts', 'Completed']
const PAGE_SIZE = 20
const safeImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2500000

function BookCover({ book }) {
  const template = getBookTemplate(book.template)
  const colors = getCoverPreset(template.cover)
  const withImage = safeImage(book.image)
  return (
    <div
      className="relative flex aspect-[3/4] w-full flex-col items-center justify-between overflow-hidden rounded-lg p-[9%] text-center"
      style={{
        background: colors.background,
        backgroundImage: withImage
          ? `linear-gradient(180deg,rgba(20,15,35,.18),rgba(20,15,35,.7)),url("${book.image}")`
          : colors.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: withImage ? '#fff' : colors.foreground,
      }}
    >
      <span aria-hidden="true" className="text-lg opacity-85">{template.symbol}</span>
      <strong
        className="block break-words text-[8px] leading-snug"
        style={{ fontFamily: 'Georgia, "Noto Serif Khmer", serif' }}
      >
        {book.title || 'Untitled Book'}
      </strong>
      <span aria-hidden="true" className="text-xs opacity-75">{template.symbol}</span>
    </div>
  )
}

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function isToday(timestamp) {
  return (Number(timestamp) || 0) >= startOfToday()
}

function isThisWeek(timestamp) {
  return (Number(timestamp) || 0) >= Date.now() - (7 * 24 * 60 * 60 * 1000)
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
  onOpenBackup,
  backupOpen = false,
}) {
  const [tab, setTab] = useState('This Device')
  const [recentFilter, setRecentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All Books')
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [menuId, setMenuId] = useState('')
  const [page, setPage] = useState(1)
  const [showNewFile, setShowNewFile] = useState(false)

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
        if (statusFilter === 'Drafts' && book.status === 'completed') return false
        if (statusFilter === 'Completed' && book.status !== 'completed') return false
        return `${book.title || ''} ${book.author || ''}`.toLocaleLowerCase().includes(keyword)
      })
      .sort((a, b) => (Number(b.updatedAt) || Number(b.createdAt) || 0) - (Number(a.updatedAt) || Number(a.createdAt) || 0))
  }, [library, recentFilter, statusFilter, search])

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
    setShowStatusFilter(false)
    if (item === 'Trash') {
      onOpenTrash?.()
      return
    }
    setTab(item)
    setPage(1)
  }

  if (showNewFile) {
    return <ShadowDocsNewFilePage
      ready={ready}
      onBack={() => setShowNewFile(false)}
      onCreate={size => {
        setShowNewFile(false)
        onCreate?.(size)
      }}
    />
  }

  return (
    <section aria-label="Home library" className="sd-library-home sd-stack">
      <div role="tablist" aria-label="Home library sections" className="sd-library-tabs">
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
        <div className="sd-device-home">
          <div className="sd-device-import">
            <div className="sd-device-import-icon"><Upload size={25} /></div>
            <h2>Import from this device</h2>
            <p>Restore a Shadow Docs project backup saved on your phone or computer.</p>
            <button
              type="button"
              disabled={!ready || typeof onImport !== 'function'}
              onClick={onImport}
              className="sd-home-primary"
            >
              <Upload size={16} /> Import Backup
            </button>
          </div>

          <div className="sd-device-actions">
            <button
              type="button"
              disabled={!ready || typeof onCreate !== 'function'}
              onClick={() => setShowNewFile(true)}
              className="sd-device-action"
            >
              <span className="sd-device-action-icon"><Plus size={21} /></span>
              <span><strong>Create Book</strong><small>Start a new local book</small></span>
              <span>›</span>
            </button>
            <button
              type="button"
              disabled={typeof onOpenBackup !== 'function'}
              onClick={onOpenBackup}
              className="sd-device-action"
            >
              <span className="sd-device-action-icon"><Download size={20} /></span>
              <span><strong>{backupOpen ? 'Hide Backup Center' : 'Backup Center'}</strong><small>Backup and restore your local library</small></span>
              <span>›</span>
            </button>
          </div>

          <div className="sd-local-summary">
            <Smartphone size={15} />
            <span>{library.length} local book{library.length === 1 ? '' : 's'} stored in this browser</span>
          </div>
        </div>
      )}

      {tab === 'Recent' && (
        <div className="sd-stack">
          <label className="sd-search sd-recent-search">
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

          <div className="sd-recent-toolbar">
            <div className="sd-recent-filters">
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

            <div className="sd-recent-tools">
              <span className="sd-page-limit">20 per page</span>
              <div className="relative">
                <button
                  type="button"
                  className={`sd-filter-button ${statusFilter !== 'All Books' ? 'is-active' : ''}`}
                  aria-label="Filter by book status"
                  aria-expanded={showStatusFilter}
                  onClick={() => setShowStatusFilter(value => !value)}
                >
                  <Settings2 size={16} />
                </button>
                {showStatusFilter && (
                  <div className="sd-status-filter-menu">
                    {STATUS_FILTERS.map(item => (
                      <button
                        type="button"
                        key={item}
                        className={statusFilter === item ? 'is-active' : ''}
                        onClick={() => {
                          setStatusFilter(item)
                          setShowStatusFilter(false)
                          setPage(1)
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {!ready && <p role="status" className="sd-card text-center text-sm text-[#77758b]">Loading books saved on this device…</p>}

          {ready && !pageBooks.length && (
            <div className="sd-home-empty">
              <Clock3 size={34} />
              <h3>No recent books</h3>
              <p>Open or edit a local book and it will appear here.</p>
            </div>
          )}

          {ready && pageBooks.length > 0 && (
            <div className="sd-recent-groups">
              {groupedRecent.map(([group, items]) => (
                <section key={group} className="sd-recent-group">
                  <h3>{group}</h3>
                  <div className="sd-recent-list">
                    {items.map(book => (
                      <article key={book.id} className="sd-recent-row">
                        <button
                          type="button"
                          onClick={() => onOpen?.(book, 'write')}
                          disabled={typeof onOpen !== 'function'}
                          className="sd-recent-cover"
                          aria-label={`Open ${book.title || 'Untitled Book'}`}
                        >
                          <BookCover book={book} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpen?.(book, 'write')}
                          disabled={typeof onOpen !== 'function'}
                          className="sd-recent-copy"
                        >
                          <strong>{book.title || 'Untitled Book'}</strong>
                          <span>{Array.isArray(book.chapters) ? book.chapters.length : 0} chapters · {book.status === 'completed' ? 'Completed' : 'Draft'}</span>
                          <small><Clock3 size={11} /> {relativeTime(book.updatedAt || book.createdAt)}</small>
                        </button>

                        <span className="sd-local-badge"><Smartphone size={11} /> Local</span>

                        <div className="relative">
                          <button
                            type="button"
                            aria-label={`Book actions for ${book.title || 'Untitled Book'}`}
                            aria-expanded={menuId === book.id}
                            onClick={() => setMenuId(id => id === book.id ? '' : book.id)}
                            className="sd-recent-menu-button"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {menuId === book.id && (
                            <div className="sd-book-menu sd-home-book-menu">
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
                                  className={id === 'delete' ? 'text-red-600 dark:text-red-300' : ''}
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
                </section>
              ))}
            </div>
          )}

          {ready && filteredRecent.length > PAGE_SIZE && (
            <div className="sd-recent-pagination">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => { setPage(value => Math.max(1, value - 1)); setMenuId('') }}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <span>Page {safePage} of {pageCount}</span>
              <button
                type="button"
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
        <div className="sd-home-empty">
          <Share2 size={34} />
          <h3>Share</h3>
          <p>Share tools are hidden for now while the new Home layout is being rebuilt. Existing export and backup functions remain unchanged.</p>
        </div>
      )}


      {tab !== 'Trash' && (
        <button
          type="button"
          className="sd-floating-create"
          aria-label="Create Book"
          title="Create Book"
          disabled={!ready || typeof onCreate !== 'function'}
          onClick={() => setShowNewFile(true)}
        >
          <Plus size={30} strokeWidth={2} />
        </button>
      )}

      <div hidden aria-hidden="true">
        <button type="button">All Books</button>
        <button type="button">Drafts</button>
        <button type="button">Completed</button>
        <FolderOpen />
        <FilePlus2 />
      </div>
    </section>
  )
}

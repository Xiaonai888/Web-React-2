import { useState } from 'react'
import { ArrowLeft, RotateCcw, Search, Trash2, X } from 'lucide-react'

const TRASH_DURATION_MS = 30 * 24 * 60 * 60 * 1000

export function moveShadowDocsBookToTrash(book, now = Date.now()) {
  if (!book || !book.id) throw new Error('Choose a saved book.')
  return { ...book, deletedAt: now, updatedAt: now }
}

export function restoreShadowDocsBookFromTrash(book, now = Date.now()) {
  if (!book || !book.id || !Number.isFinite(book.deletedAt) || book.deletedAt <= 0) throw new Error('This book is not in Trash.')
  if (isShadowDocsTrashExpired(book, now)) throw new Error('This book has passed its 30-day recovery period.')
  return { ...book, deletedAt: null, updatedAt: now }
}

export function getShadowDocsTrashExpiry(book) {
  return Number.isFinite(book?.deletedAt) && book.deletedAt > 0 ? book.deletedAt + TRASH_DURATION_MS : null
}

export function isShadowDocsTrashExpired(book, now = Date.now()) {
  const expiresAt = getShadowDocsTrashExpiry(book)
  return expiresAt !== null && now >= expiresAt
}

export function getExpiredShadowDocsBookIds(books, now = Date.now()) {
  return (Array.isArray(books) ? books : []).filter(book => isShadowDocsTrashExpired(book, now)).map(book => book.id)
}

export default function ShadowDocsTrashPanel({ books = [], ready = true, onRestore, onDeleteForever, onClose }) {
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const now = Date.now()
  const trashed = (Array.isArray(books) ? books : []).filter(book => getShadowDocsTrashExpiry(book) !== null)
  const visible = trashed.filter(book => `${book.title || ''} ${book.author || ''}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())).sort((a, b) => b.deletedAt - a.deletedAt)

  async function restore(book) {
    if (!ready || busyId || typeof onRestore !== 'function' || isShadowDocsTrashExpired(book)) return
    setBusyId(book.id)
    setError('')
    try { await onRestore(book) } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not restore this book.') }
    finally { setBusyId('') }
  }

  async function deleteForever(book) {
    if (!ready || busyId || typeof onDeleteForever !== 'function') return
    if (!window.confirm(`Permanently delete “${book.title || 'Untitled Book'}”? This cannot be undone.`)) return
    setBusyId(book.id)
    setError('')
    try { await onDeleteForever(book) } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not permanently delete this book.') }
    finally { setBusyId('') }
  }

  return <section aria-label="Trash" className="sd-stack">
    <div className="sd-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><span className="sd-eyebrow">MY LIBRARY</span><h2 className="mt-2 flex items-center gap-2"><Trash2 size={20}/> Trash <span className="text-sm font-normal text-[#77758b]">({trashed.length})</span></h2></div>
        {typeof onClose === 'function' && <button type="button" className="sd-button sd-button-ghost" onClick={onClose}><ArrowLeft size={16}/> My Books</button>}
      </div>
      <p className="mt-3 text-xs leading-6 text-[#77758b] dark:text-white/65">Deleted books stay on this device for 30 days. Restore them before their recovery period ends. Expired books are permanently removed when Shadow Docs next opens.</p>
      <label className="sd-search mt-4 max-w-full"><Search size={16}/><input type="search" aria-label="Search Trash" placeholder="Search deleted books…" value={search} onChange={event => setSearch(event.target.value)}/>{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={14}/></button>}</label>
    </div>
    {error && <p role="alert" className="sd-alert sd-alert-error">{error}</p>}
    {!ready && <p role="status" className="sd-card text-center text-sm">Loading Trash…</p>}
    {ready && !visible.length && <div className="sd-card py-10 text-center"><Trash2 size={28} className="mx-auto mb-3 text-[#93899f]"/><h3>{trashed.length ? 'No deleted books match your search' : 'Trash is empty'}</h3><p className="mt-2 text-xs text-[#77758b]">Books moved to Trash will appear here.</p></div>}
    {ready && visible.map(book => {
      const expired = isShadowDocsTrashExpired(book, now)
      const daysLeft = expired ? 0 : Math.max(1, Math.ceil((getShadowDocsTrashExpiry(book) - now) / (24 * 60 * 60 * 1000)))
      return <article key={book.id} className="sd-card min-w-0">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-sm font-semibold">{book.title || 'Untitled Book'}</h3><p className="mt-1 text-xs text-[#77758b] dark:text-white/65">{book.author || 'Author not specified'}</p><p className="mt-2 text-xs text-[#77758b] dark:text-white/65">{expired ? 'Recovery period ended' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left to restore`} · Deleted {new Date(book.deletedAt).toLocaleDateString()}</p></div><Trash2 size={18} className="shrink-0 text-[#93899f]"/></div>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="sd-button sd-button-ghost" disabled={expired || busyId !== '' || typeof onRestore !== 'function'} onClick={() => restore(book)}><RotateCcw size={15}/> Restore</button><button type="button" className="sd-button sd-button-ghost text-red-600 dark:text-red-300" disabled={busyId !== '' || typeof onDeleteForever !== 'function'} onClick={() => deleteForever(book)}><Trash2 size={15}/> Delete forever</button></div>
      </article>
    })}
  </section>
}

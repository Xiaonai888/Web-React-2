import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Plus, Search } from 'lucide-react'
import ReelPlaylistCreateForm from './ReelPlaylistCreateForm'

/**
 * Controlled Playlist dropdown modeled on the user's YouTube Studio reference.
 * This component DOES NOT write to Supabase. Persistence must be supplied by
 * the parent using a future ownership-checked playlist API.
 *
 * onCreatePlaylist(name) is responsible for adding a local UI preview record
 * for now; later it can await an API call and refresh one list page.
 */
export default function ReelPlaylistSelector({
  playlists = [],
  selectedIds = [],
  onSelectionChange,
  onCreatePlaylist,
  t,
  disabled = false,
  previewOnly = true,
  loading = false,
  hasMore = false,
  onLoadMore,
  onSearchChange,
  loadMoreLabel = '',
}) {
  const [open, setOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onOutside = event => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    const onEscape = event => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  const shown = typeof onSearchChange === 'function'
    ? playlists
    : playlists.filter(item => String(item.name || '').toLocaleLowerCase().includes(search.toLocaleLowerCase()))

  const toggle = id => {
    if (disabled || typeof onSelectionChange !== 'function') return
    const next = selectedIds.includes(id)
      ? selectedIds.filter(item => item !== id)
      : [...selectedIds, id]
    onSelectionChange(next)
  }

  const create = async name => {
    if (typeof onCreatePlaylist !== 'function') return
    await onCreatePlaylist(name)
    setShowCreate(false)
    setSearch('')
    if (typeof onSearchChange === 'function') onSearchChange('')
  }

  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">
        {t('authorReelAdd.playlists')}
      </h2>
      <p className="text-xs leading-5 text-[var(--shadow-text-secondary)]">
        {t('authorReelAdd.playlistsHelp')}
      </p>
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen(value => !value)}
          className="flex min-h-10 w-full items-center justify-between rounded-lg border border-[var(--shadow-border-strong)] bg-[var(--shadow-input-bg)] px-3 py-2 text-left text-[13px] text-[var(--shadow-text-primary)] disabled:opacity-50"
        >
          {selectedIds.length
            ? t('authorReelAdd.selectedCount', { count: selectedIds.length })
            : t('authorReelAdd.selectPlaylists')}
          <ChevronDown size={17} aria-hidden="true" />
        </button>

        {open ? (
          <div id={listId} className="app-elevated absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-xl">
            <div className="space-y-2 border-b border-[var(--shadow-border)] p-3">
              <p className="text-xs font-semibold">{t('authorReelAdd.playlists')}</p>
              <div className="flex items-center gap-2 rounded-full border border-[var(--shadow-border-strong)] px-3">
                <Search size={16} className="text-[var(--shadow-text-tertiary)]" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={event => {
                    setSearch(event.target.value)
                    if (typeof onSearchChange === 'function') onSearchChange(event.target.value)
                  }}
                  placeholder={t('authorReelAdd.searchPlaylist')}
                  className="w-full bg-transparent py-2.5 text-[13px] outline-none placeholder:text-[var(--shadow-placeholder)]"
                />
              </div>
            </div>

            <div className="max-h-[230px] overflow-y-auto p-2">
              {shown.length === 0 && !loading ? (
                <p className="p-4 text-center text-xs text-[var(--shadow-text-tertiary)]">
                  {t('authorReelAdd.noPlaylists')}
                </p>
              ) : null}
              {shown.map(item => (
                <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-[13px] hover:bg-[var(--shadow-bg-hover)]">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    disabled={disabled}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 accent-[var(--shadow-text-primary)]"
                  />
                  <span className="min-w-0 break-words">{item.name}</span>
                </label>
              ))}
              {hasMore && typeof onLoadMore === 'function' && loadMoreLabel ? (
                <button
                  type="button"
                  disabled={disabled || loading}
                  onClick={onLoadMore}
                  className="w-full rounded-md px-2 py-2 text-xs text-[var(--shadow-text-secondary)] disabled:opacity-50"
                >
                  {loadMoreLabel}
                </button>
              ) : null}
            </div>

            {showCreate ? (
              <ReelPlaylistCreateForm
                existingNames={playlists.map(item => item.name)}
                onCreate={create}
                onCancel={() => setShowCreate(false)}
                t={t}
                disabled={disabled}
              />
            ) : null}

            <div className="flex items-center justify-between gap-2 border-t border-[var(--shadow-border)] p-2">
              <button
                type="button"
                disabled={disabled || typeof onCreatePlaylist !== 'function'}
                onClick={() => setShowCreate(value => !value)}
                className="flex items-center gap-1 rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-xs font-semibold disabled:opacity-50"
              >
                <Plus size={14} aria-hidden="true" />
                {t('authorReelAdd.newPlaylist')}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-xs font-semibold"
              >
                {t('authorReelAdd.done')}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {previewOnly ? (
        <p className="text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">
          {t('authorReelAdd.playlistPreview')}
        </p>
      ) : null}
    </section>
  )
}

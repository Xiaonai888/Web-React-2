import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Folder,
  FolderPlus,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'
import SavedPostCard from '../../components/SavedPosts/SavedPostCard'
import SavedPostCollectionEditor from '../../components/SavedPosts/SavedPostCollectionEditor'
import SavedPostCollectionSheet from '../../components/SavedPosts/SavedPostCollectionSheet'
import {
  createSavedPostCollection,
  deleteSavedPost,
  deleteSavedPostCollection,
  fetchSavedPostCollections,
  fetchSavedPosts,
  getReaderToken,
  replaceSavedPostCollections,
  updateSavedPostCollection,
} from '../../services/savedPostsApi'

const TYPE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'reader', label: 'Reader' },
  { key: 'author', label: 'Author' },
  { key: 'promoted', label: 'Promoted' },
]

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest Saved' },
  { key: 'oldest', label: 'Oldest Saved' },
]

function useDebouncedValue(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}

function getPreviewImage(item) {
  const snapshot = item?.snapshot_data || {}
  const arrays = [snapshot.image_urls, snapshot.images, snapshot.media_urls, snapshot.photos]

  for (const value of arrays) {
    if (!Array.isArray(value)) continue

    const image = value
      .map((entry) => (typeof entry === 'string' ? entry : entry?.url || entry?.image_url || ''))
      .find(Boolean)

    if (image) return image
  }

  return (
    snapshot.image_url ||
    snapshot.cover_url ||
    snapshot.thumbnail_url ||
    snapshot.banner_url ||
    ''
  )
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || '#6D4AFF').replace('#', '')
  const safe = /^[0-9a-f]{6}$/i.test(normalized) ? normalized : '6D4AFF'
  const red = parseInt(safe.slice(0, 2), 16)
  const green = parseInt(safe.slice(2, 4), 16)
  const blue = parseInt(safe.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function openSavedSource(navigate, item) {
  const url = String(item?.source_url || '').trim()

  if (!url || item?.status === 'unavailable') return false

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)

      if (parsed.origin === window.location.origin) {
        navigate(`${parsed.pathname}${parsed.search}${parsed.hash}`)
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    return true
  }

  navigate(url.startsWith('/') ? url : `/${url}`)
  return true
}

function BottomSheet({ open, title, description, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[115] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label="Close"
      />

      <section className="relative z-10 w-full max-w-[560px] rounded-t-[28px] bg-white px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-[#171923]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#d9dce4] dark:bg-white/15" />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827] dark:text-white">{title}</h2>
            {description ? (
              <p className="mt-1 text-[12px] leading-5 text-[#8d94a1] dark:text-white/45">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 dark:bg-white/10 dark:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </section>
    </div>
  )
}

function SheetAction({ icon: Icon, title, subtitle, danger = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-left active:scale-[0.99] ${
        danger
          ? 'bg-[#fff1f1] text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]'
          : 'bg-[#f8f8fb] text-[#111827] dark:bg-white/5 dark:text-white'
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] ${danger ? 'bg-white/70 dark:bg-white/5' : 'bg-white dark:bg-white/10'}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-extrabold">{title}</span>
        {subtitle ? <span className="mt-0.5 block text-[11px] opacity-60">{subtitle}</span> : null}
      </span>
    </button>
  )
}

function CollectionCard({ collection, active, onSelect, onMenu }) {
  const previewItems = collection.preview_items || []
  const color = collection.cover_color || '#6D4AFF'
  const customCollection = !['all', 'favorites', 'read_later'].includes(collection.system_key)

  return (
    <div className="relative w-[43%] min-w-[118px] max-w-[138px] shrink-0 snap-start sm:w-[170px] sm:max-w-none">
      <button
        type="button"
        onClick={onSelect}
        className={`min-h-[124px] w-full overflow-hidden rounded-[18px] border-2 p-2.5 text-left transition active:scale-[0.985] dark:bg-[#171923] ${
          active
            ? 'border-[#6d4aff]'
            : 'border-transparent ring-1 ring-inset ring-black/5 dark:ring-white/10'
        }`}
        style={{
          backgroundImage: `linear-gradient(145deg, ${hexToRgba(color, 0.18)}, ${hexToRgba(color, 0.06)})`,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
  className="relative flex h-8 w-8 items-center justify-center rounded-[11px]"
  style={{ backgroundColor: hexToRgba(color, 0.16), color }}
>
  <Folder className="h-3.5 w-3.5" strokeWidth={1.9} />

  {active ? (
    <span className="absolute -right-1 -top-1 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white text-[#6d4aff] ring-1 ring-[#dcd6ff] dark:bg-[#171923] dark:text-white dark:ring-white/15">
      <Check className="h-2.5 w-2.5" strokeWidth={2.7} />
    </span>
  ) : null}
</span>
        </div>

        <div className="mt-2 line-clamp-1 text-[12px] font-bold text-[#111827] dark:text-white">
          {collection.name}
        </div>

        <div className="mt-0.5 text-[9.5px] font-medium text-[#777f8d] dark:text-white/45">
          {Number(collection.item_count || 0)}{' '}
          {Number(collection.item_count || 0) === 1 ? 'post' : 'posts'}
        </div>

        <div className="mt-2 flex h-8 items-center">
          {previewItems.length ? (
            <div className="flex -space-x-2">
              {previewItems.slice(0, 3).map((item, index) => {
                const image = getPreviewImage(item)

                return (
                  <span
                    key={item.id || index}
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] border-2 border-white bg-[#f5f3fa] text-[#6d4aff] dark:border-[#171923]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Bookmark className="h-3 w-3" strokeWidth={1.8} />
                    )}
                  </span>
                )
              })}
            </div>
          ) : (
            <span className="line-clamp-1 text-[9px] font-medium text-[#9aa1ad]">
              No saved preview
            </span>
          )}
        </div>
      </button>

      {customCollection ? (
        <button
          type="button"
          onClick={onMenu}
          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[#4b5563] shadow-sm active:scale-95 dark:bg-[#242735] dark:text-white"
          aria-label="Collection options"
        >
          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      ) : null}
    </div>
  )
}

export default function SavedPostsPage() {
  const navigate = useNavigate()
  const token = getReaderToken()
  const [query, setQuery] = useState('')
  const searchedQuery = useDebouncedValue(query)
  const [activeType, setActiveType] = useState('all')
  const [sort, setSort] = useState('newest')
  const [selectedCollectionId, setSelectedCollectionId] = useState('all')
  const [allSaved, setAllSaved] = useState(null)
  const [collections, setCollections] = useState([])
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [actionItem, setActionItem] = useState(null)
  const [collectionItem, setCollectionItem] = useState(null)
  const [collectionSaving, setCollectionSaving] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [editorItemToAdd, setEditorItemToAdd] = useState(null)
  const [editorSubmitting, setEditorSubmitting] = useState(false)
  const [editorError, setEditorError] = useState('')
  const [collectionMenu, setCollectionMenu] = useState(null)
  const [removeTarget, setRemoveTarget] = useState(null)
  const [deleteCollectionTarget, setDeleteCollectionTarget] = useState(null)
  const [destructiveLoading, setDestructiveLoading] = useState(false)

  const anySheetOpen = Boolean(
    sortSheetOpen ||
    actionItem ||
    collectionItem ||
    editorOpen ||
    collectionMenu ||
    removeTarget ||
    deleteCollectionTarget
  )

  const collectionCards = useMemo(() => {
    const fallbackAll = {
      id: 'all',
      name: 'All Saved',
      system_key: 'all',
      cover_color: '#6D4AFF',
      item_count: total,
      preview_items: items.slice(0, 3),
    }

    return [allSaved || fallbackAll, ...collections]
  }, [allSaved, collections, items, total])

  const showToast = useCallback((message) => {
    setToast(message)
  }, [])

  const handleUnauthorized = useCallback((requestError) => {
    if (requestError?.status === 401 || requestError?.status === 403) {
      navigate('/login', { replace: true })
      return true
    }

    return false
  }, [navigate])

  const loadCollections = useCallback(async (signal) => {
    if (!token) return

    try {
      const data = await fetchSavedPostCollections(signal)
      setAllSaved(data.all_saved || null)
      setCollections(data.collections || [])
    } catch (requestError) {
      if (requestError?.name === 'AbortError') return
      if (handleUnauthorized(requestError)) return
      setError(requestError.message || 'Failed to load collections')
    }
  }, [handleUnauthorized, token])

  const replaceItemInList = useCallback((updatedItem) => {
    if (!updatedItem?.id) return

    setItems((current) => current.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }, [])

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate, token])

  useEffect(() => {
    if (!anySheetOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [anySheetOpen])

  useEffect(() => {
    if (!token) return undefined

    const controller = new AbortController()
    loadCollections(controller.signal)

    return () => controller.abort()
  }, [loadCollections, token])

  useEffect(() => {
    if (!token) return undefined

    const controller = new AbortController()

    async function loadItems() {
      try {
        setLoading(true)
        setError('')
        setItems([])
        setNextCursor(null)
        setHasNext(false)

        const data = await fetchSavedPosts({
          type: activeType,
          collection_id: selectedCollectionId === 'all' ? '' : selectedCollectionId,
          q: searchedQuery,
          sort,
          limit: 20,
        }, controller.signal)

        setItems(data.items || [])
        setTotal(Number(data.total || 0))
        setHasNext(Boolean(data.has_next))
        setNextCursor(data.next_cursor || null)
      } catch (requestError) {
        if (requestError?.name === 'AbortError') return
        if (handleUnauthorized(requestError)) return
        setError(requestError.message || 'Failed to load saved posts')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadItems()
    return () => controller.abort()
  }, [activeType, handleUnauthorized, searchedQuery, selectedCollectionId, sort, token])

  useEffect(() => {
    if (!toast) return undefined

    const timeout = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  async function handleLoadMore() {
    if (!hasNext || !nextCursor || loadingMore) return

    try {
      setLoadingMore(true)

      const data = await fetchSavedPosts({
        type: activeType,
        collection_id: selectedCollectionId === 'all' ? '' : selectedCollectionId,
        q: searchedQuery,
        sort,
        limit: 20,
        cursor: nextCursor,
      })

      setItems((current) => {
        const knownIds = new Set(current.map((item) => item.id))
        return [...current, ...(data.items || []).filter((item) => !knownIds.has(item.id))]
      })
      setHasNext(Boolean(data.has_next))
      setNextCursor(data.next_cursor || null)
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || 'Failed to load more posts')
      }
    } finally {
      setLoadingMore(false)
    }
  }

  function handleOpenItem(item) {
    const opened = openSavedSource(navigate, item)
    if (!opened) showToast('Original post is unavailable')
  }

  async function handleCopyLink(item) {
    const url = String(item?.source_url || '').trim()

    if (!url) {
      showToast('This saved post has no link')
      return
    }

    const absoluteUrl = /^https?:\/\//i.test(url)
      ? url
      : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`

    try {
      await navigator.clipboard.writeText(absoluteUrl)
      showToast('Link copied')
    } catch {
      showToast('Unable to copy link')
    }

    setActionItem(null)
  }

  async function handleSaveCollections(collectionIds) {
    if (!collectionItem) return

    try {
      setCollectionSaving(true)
      const data = await replaceSavedPostCollections(collectionItem.id, collectionIds)
      replaceItemInList(data.item)
      setCollectionItem(null)
      await loadCollections()
      showToast('Collections updated')
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || 'Failed to update collections')
      }
    } finally {
      setCollectionSaving(false)
    }
  }

  function openNewCollection(itemToAdd = null) {
    setCollectionItem(null)
    setEditingCollection(null)
    setEditorItemToAdd(itemToAdd)
    setEditorError('')
    setEditorOpen(true)
  }

  function openEditCollection(collection) {
    setCollectionMenu(null)
    setEditingCollection(collection)
    setEditorItemToAdd(null)
    setEditorError('')
    setEditorOpen(true)
  }

  async function handleCollectionSubmit(payload) {
    try {
      setEditorSubmitting(true)
      setEditorError('')

      if (editingCollection) {
        await updateSavedPostCollection(editingCollection.id, payload)
        showToast('Collection updated')
      } else {
        const data = await createSavedPostCollection(payload)
        const createdCollection = data.collection

        if (editorItemToAdd && createdCollection?.id) {
          const currentIds = (editorItemToAdd.collections || []).map((collection) => collection.id)
          const updated = await replaceSavedPostCollections(editorItemToAdd.id, [...new Set([...currentIds, createdCollection.id])])
          replaceItemInList(updated.item)
          showToast('Collection created and post added')
        } else {
          showToast('Collection created')
        }
      }

      setEditorOpen(false)
      setEditingCollection(null)
      setEditorItemToAdd(null)
      await loadCollections()
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        setEditorError(requestError.message || 'Failed to save collection')
      }
    } finally {
      setEditorSubmitting(false)
    }
  }

  async function handleRemoveSavedPost() {
    if (!removeTarget) return

    try {
      setDestructiveLoading(true)
      await deleteSavedPost(removeTarget.id)
      setItems((current) => current.filter((item) => item.id !== removeTarget.id))
      setTotal((current) => Math.max(0, current - 1))
      setRemoveTarget(null)
      await loadCollections()
      showToast('Removed from Saved Posts')
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || 'Failed to remove saved post')
      }
    } finally {
      setDestructiveLoading(false)
    }
  }

  async function handleDeleteCollection() {
    if (!deleteCollectionTarget) return

    try {
      setDestructiveLoading(true)
      await deleteSavedPostCollection(deleteCollectionTarget.id)

      if (selectedCollectionId === deleteCollectionTarget.id) {
        setSelectedCollectionId('all')
      }

      setDeleteCollectionTarget(null)
      await loadCollections()
      showToast('Collection deleted')
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) {
        showToast(requestError.message || 'Failed to delete collection')
      }
    } finally {
      setDestructiveLoading(false)
    }
  }

  const currentSortLabel = SORT_OPTIONS.find((option) => option.key === sort)?.label || 'Newest Saved'

  return (
    <div className="min-h-screen bg-[#fafafa] pb-[96px] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-40 border-b border-[#eceaf2] bg-white/95 px-4 pb-3 pt-4 backdrop-blur dark:border-white/10 dark:bg-[#171923]/95">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="flex h-10 w-7 shrink-0 items-center justify-start text-[#111827] active:scale-95 dark:text-white"
    aria-label="Back"
  >
    <ArrowLeft className="h-5 w-5" strokeWidth={1.9} />
  </button>

  <div className="min-w-0">
    <h1 className="text-[21px] font-bold leading-tight text-[#111827] dark:text-white">
      Saved Posts
    </h1>
    <p className="mt-0.5 text-[11px] text-[#8d94a1] dark:text-white/40">
      {total} saved {total === 1 ? 'post' : 'posts'}
    </p>
  </div>
</div>

            <button
              type="button"
              onClick={() => openNewCollection()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-[#6d4aff] active:scale-95 dark:bg-[#6d4aff]/15 dark:text-[#b9a8ff]"
              aria-label="Create collection"
            >
              <FolderPlus className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[15px] bg-[#f7f7fa] px-3.5 ring-1 ring-transparent focus-within:ring-[#6d4aff]/30 dark:bg-white/5">
              <Search className="h-[17px] w-[17px] shrink-0 text-[#8d94a1]" strokeWidth={1.8} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, 100))}
                placeholder="Search saved posts"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#9aa1ad] dark:text-white dark:placeholder:text-white/30"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} className="text-[#9aa1ad] active:scale-95" aria-label="Clear search">
                  <X className="h-4 w-4" strokeWidth={1.9} />
                </button>
              ) : null}
            </label>

            <button
              type="button"
              onClick={() => setSortSheetOpen(true)}
              className="flex h-11 shrink-0 items-center gap-2 rounded-[15px] bg-[#f7f7fa] px-3.5 text-[12px] font-extrabold text-[#4b5563] active:scale-[0.98] dark:bg-white/5 dark:text-white/70"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TYPE_TABS.map((tab) => {
              const active = activeType === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveType(tab.key)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[11.5px] transition active:scale-[0.97] ${
  active
    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] font-extrabold text-white shadow-[0_8px_20px_rgba(124,91,255,0.25)]'
    : 'bg-white/80 font-semibold text-[#74759b] shadow-[0_5px_14px_rgba(124,91,255,0.06)] ring-1 ring-[#eeeaff] dark:bg-white/10 dark:text-white/60 dark:ring-white/10'
}`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-black text-[#111827] dark:text-white">Collections</h2>
              <p className="mt-0.5 text-[10.5px] text-[#8d94a1] dark:text-white/40">Keep related posts together.</p>
            </div>
            <button
              type="button"
              onClick={() => openNewCollection()}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[#6d4aff] active:scale-95 dark:text-[#b9a8ff]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.1} />
              New
            </button>
          </div>

          <div className="-mx-4 flex snap-x snap-proximity gap-2 overflow-x-auto px-4 pb-2 pt-1 scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {collectionCards.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                active={selectedCollectionId === collection.id}
                onSelect={() => setSelectedCollectionId(collection.id)}
                onMenu={(event) => {
                  event?.stopPropagation?.()
                  setCollectionMenu(collection)
                }}
              />
            ))}
          </div>
        </section>

        <section className="mt-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-[14px] font-black text-[#111827] dark:text-white">
              {collectionCards.find((collection) => collection.id === selectedCollectionId)?.name || 'All Saved'}
            </div>
            {!loading ? (
              <div className="text-[10.5px] font-semibold text-[#9aa1ad]">{total} total</div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-[20px] bg-[#fff1f1] px-4 py-4 text-[12.5px] font-semibold text-[#e5484d] dark:bg-[#e5484d]/10 dark:text-[#ff8d91]">
              <div>{error}</div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold text-[#e5484d] active:scale-95 dark:bg-white/10"
              >
                Try Again
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-48 animate-pulse rounded-[22px] bg-white ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10" />
              ))}
            </div>
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <SavedPostCard
                  key={item.id}
                  item={item}
                  onOpen={handleOpenItem}
                  onMenu={setActionItem}
                />
              ))}

              {hasNext ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-white text-[12px] font-extrabold text-[#6d4aff] ring-1 ring-black/5 active:scale-[0.99] disabled:opacity-60 dark:bg-[#171923] dark:text-[#b9a8ff] dark:ring-white/10"
                >
                  {loadingMore ? <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} /> : null}
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              ) : null}
            </div>
          ) : !error ? (
            <div className="rounded-[24px] bg-white px-6 py-12 text-center ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f0ff] text-[#6d4aff] dark:bg-[#6d4aff]/15 dark:text-[#b9a8ff]">
                <Bookmark className="h-7 w-7" strokeWidth={1.7} />
              </div>
              <h2 className="mt-4 text-[17px] font-black text-[#111827] dark:text-white">No saved posts yet</h2>
              <p className="mx-auto mt-2 max-w-[300px] text-[12.5px] leading-6 text-[#8d94a1] dark:text-white/45">
                Posts saved from readers, authors, and promoted content will appear here.
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <BottomSheet
        open={Boolean(sortSheetOpen)}
        title="Sort Saved Posts"
        description="Choose how your saved posts are ordered."
        onClose={() => setSortSheetOpen(false)}
      >
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => {
            const active = sort === option.key

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setSort(option.key)
                  setSortSheetOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3.5 text-left ${
                  active
                    ? 'bg-[#f3f0ff] text-[#6d4aff] ring-1 ring-[#6d4aff]/25 dark:bg-[#6d4aff]/12 dark:text-[#b9a8ff]'
                    : 'bg-[#f8f8fb] text-[#111827] dark:bg-white/5 dark:text-white'
                }`}
              >
                <span className="text-[13.5px] font-extrabold">{option.label}</span>
                {active ? <Check className="h-4 w-4" strokeWidth={2.4} /> : null}
              </button>
            )
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(actionItem)}
        title="Saved Post"
        description="Open, organize, copy, or remove this saved post."
        onClose={() => setActionItem(null)}
      >
        <div className="space-y-2">
          <SheetAction
            icon={ExternalLink}
            title="Open Original"
            subtitle="View the original post or promotion"
            onClick={() => {
              const item = actionItem
              setActionItem(null)
              handleOpenItem(item)
            }}
          />
          <SheetAction
            icon={Folder}
            title="Manage Collections"
            subtitle="Add this post to one or more collections"
            onClick={() => {
              setCollectionItem(actionItem)
              setActionItem(null)
            }}
          />
          <SheetAction
            icon={Copy}
            title="Copy Link"
            subtitle="Copy the original post link"
            onClick={() => handleCopyLink(actionItem)}
          />
          <SheetAction
            icon={Trash2}
            title="Remove from Saved Posts"
            subtitle="This will not delete the original post"
            danger
            onClick={() => {
              setRemoveTarget(actionItem)
              setActionItem(null)
            }}
          />
        </div>
      </BottomSheet>

      <SavedPostCollectionSheet
        open={Boolean(collectionItem)}
        item={collectionItem}
        collections={collections}
        saving={collectionSaving}
        onClose={() => setCollectionItem(null)}
        onSave={handleSaveCollections}
        onCreateCollection={() => openNewCollection(collectionItem)}
      />

      <SavedPostCollectionEditor
        open={editorOpen}
        collection={editingCollection}
        submitting={editorSubmitting}
        error={editorError}
        onClose={() => {
          if (editorSubmitting) return
          setEditorOpen(false)
          setEditingCollection(null)
          setEditorItemToAdd(null)
          setEditorError('')
        }}
        onSubmit={handleCollectionSubmit}
      />

      <BottomSheet
        open={Boolean(collectionMenu)}
        title={collectionMenu?.name || 'Collection'}
        description="Edit this collection or remove it. Saved posts will remain in All Saved."
        onClose={() => setCollectionMenu(null)}
      >
        <div className="space-y-2">
          <SheetAction
            icon={Pencil}
            title="Edit Collection"
            subtitle="Change the name, description, or color"
            onClick={() => openEditCollection(collectionMenu)}
          />
          <SheetAction
            icon={Trash2}
            title="Delete Collection"
            subtitle="Saved posts inside will not be deleted"
            danger
            onClick={() => {
              setDeleteCollectionTarget(collectionMenu)
              setCollectionMenu(null)
            }}
          />
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(removeTarget)}
        title="Remove Saved Post?"
        description="The original post will not be deleted."
        onClose={() => destructiveLoading ? undefined : setRemoveTarget(null)}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRemoveTarget(null)}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#f5f3fa] text-[13px] font-extrabold text-[#4b5563] disabled:opacity-50 dark:bg-white/10 dark:text-white/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRemoveSavedPost}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#e5484d] text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {destructiveLoading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(deleteCollectionTarget)}
        title="Delete Collection?"
        description="The collection will be deleted, but its saved posts will remain in All Saved."
        onClose={() => destructiveLoading ? undefined : setDeleteCollectionTarget(null)}
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDeleteCollectionTarget(null)}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#f5f3fa] text-[13px] font-extrabold text-[#4b5563] disabled:opacity-50 dark:bg-white/10 dark:text-white/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteCollection}
            disabled={destructiveLoading}
            className="h-12 rounded-[16px] bg-[#e5484d] text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {destructiveLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </BottomSheet>

      {toast ? (
        <div className="fixed bottom-[28px] left-1/2 z-[160] -translate-x-1/2 rounded-full bg-[#111827] px-4 py-2.5 text-[12px] font-bold text-white shadow-xl dark:bg-white dark:text-[#111827]">
          {toast}
        </div>
      ) : null}
    </div>
  )
}

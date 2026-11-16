import { useEffect, useMemo, useRef, useState } from 'react'
import { getDisplayLanguageId } from '../../utils/displayLanguage'
import {
  listStickerPacks,
  listPackStickerImages,
  getMyStickerCollection,
  addSavedStickerPack,
  removeSavedStickerPack,
  reorderSavedStickerPacks,
  addFavoriteSticker,
  removeFavoriteSticker,
  recordChatStoryStickerUse,
} from '../../services/chatStoryStickerLibrary'

const LABELS = {
  en: { recent: 'Recent', favorites: 'Favorites', trending: 'Trending', search: 'Search stickers', create: 'Create', settings: 'Settings', packs: 'My stickers', all: 'Discover', add: 'Add', remove: 'Remove', back: 'Back', done: 'Done', empty: 'No stickers yet', noPacks: 'No sticker packs available', more: 'Load more', retry: 'Retry', emoji: 'Emoji', gifs: 'GIFs', stickers: 'Stickers', select: 'Choose an image or GIF', clear: 'The sticker library could not be loaded', manage: 'Manage packs', moveUp: 'Move up', moveDown: 'Move down', send: 'Send sticker' },
  km: { recent: 'ថ្មីៗ', favorites: 'ចូលចិត្ត', trending: 'ពេញនិយម', search: 'ស្វែងរក Sticker', create: 'បង្កើត', settings: 'ការកំណត់', packs: 'Sticker របស់ខ្ញុំ', all: 'ស្វែងរកបន្ថែម', add: 'បន្ថែម', remove: 'ដកចេញ', back: 'ត្រឡប់', done: 'រួចរាល់', empty: 'មិនទាន់មាន Sticker', noPacks: 'មិនមាន Sticker Pack', more: 'បង្ហាញបន្ថែម', retry: 'ព្យាយាមម្ដងទៀត', emoji: 'Emoji', gifs: 'GIFs', stickers: 'Stickers', select: 'រើសរូបភាព ឬ GIF', clear: 'មិនអាចទាញ Sticker បានទេ', manage: 'គ្រប់គ្រង Sticker', moveUp: 'ឡើងលើ', moveDown: 'ចុះក្រោម', send: 'បញ្ចូល Sticker' },
}

const EMOJIS = ['😀', '😁', '😂', '🤣', '😊', '🥰', '😍', '😘', '😭', '🥺', '😢', '😡', '🤔', '😴', '🤩', '😎', '😱', '❤️', '💕', '💖', '👍', '👏', '🙏', '🎉', '🌹', '🐱', '🐶', '🔥', '✨', '💯', '💀', '🌙']
const css = `
.csst-root{--csst-bg:var(--shadow-bg-surface,#fff);--csst-ink:var(--shadow-text-primary,#222);--csst-muted:var(--shadow-text-secondary,#7c7c85);--csst-border:var(--shadow-border,#e9e8ed);--csst-accent:#7c3aed;position:fixed;bottom:12px;right:12px;z-index:120;width:min(420px,calc(100vw - 24px));height:440px;display:flex;flex-direction:column;overflow:hidden;color:var(--csst-ink);background:var(--csst-bg);border:1px solid var(--csst-border);box-shadow:0 10px 35px #0002;border-radius:18px;font-family:inherit;box-sizing:border-box}
.csst-root *{box-sizing:border-box}.csst-root button,.csst-root input{font:inherit}.csst-root button{border:0;cursor:pointer;color:inherit;background:transparent}.csst-root button:disabled{opacity:.4;cursor:default}.csst-top{padding:9px 12px 7px;border-bottom:1px solid var(--csst-border);display:flex;align-items:center;gap:7px}.csst-search{flex:1;min-width:0;background:var(--shadow-bg-soft,#f4f4f6);border-radius:11px;display:flex;align-items:center;gap:7px;padding:8px 10px;color:var(--csst-muted)}.csst-search input{width:100%;min-width:0;border:0;outline:0;color:var(--csst-ink);background:transparent;font-size:13px}.csst-icon{width:34px;height:34px;display:grid;place-items:center;flex-shrink:0;border-radius:10px}.csst-icon:focus-visible,.csst-root button:focus-visible{outline:2px solid var(--csst-accent);outline-offset:1px}.csst-packs{display:flex;gap:4px;padding:7px 7px 4px;align-items:center;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;flex-shrink:0;border-bottom:1px solid var(--csst-border)}.csst-packs::-webkit-scrollbar{display:none}.csst-pack{display:flex;align-items:center;justify-content:center;flex:0 0 45px;width:45px;height:46px;border-radius:10px;position:relative}.csst-pack[data-current="true"]{background:#8b5cf61c}.csst-pack[data-current="true"]:after{content:'';position:absolute;bottom:0;left:10px;right:10px;height:2px;background:var(--csst-accent);border-radius:10px}.csst-pack img{width:37px;height:37px;object-fit:contain}.csst-pack span{font-size:24px}.csst-main{flex:1;overflow-y:auto;min-height:0;overscroll-behavior:contain;padding:12px 12px 20px}.csst-section-title{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:650;margin:0 0 10px}.csst-caption{font-size:11px;font-weight:450;color:var(--csst-muted)}.csst-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.csst-sticker{position:relative;border-radius:9px!important;aspect-ratio:1;min-width:0;display:grid;place-items:center;overflow:hidden}.csst-sticker:active{background:var(--shadow-bg-hover,#efedf6)}.csst-sticker>img{display:block;width:100%;height:100%;object-fit:contain}.csst-fav{position:absolute;right:0;top:0;background:var(--csst-bg)!important;color:var(--csst-accent)!important;border-radius:50%;width:22px;height:22px;font-size:13px!important;opacity:0}.csst-sticker:focus-within .csst-fav,.csst-sticker:hover .csst-fav{opacity:1}.csst-action{font-size:12px!important;color:var(--csst-accent)!important;padding:7px 9px;border-radius:9px}.csst-row{display:flex;align-items:center;gap:9px;padding:7px 3px;min-height:55px;border-bottom:1px solid var(--csst-border)}.csst-row-img{width:41px;height:41px;flex:0 0 41px;border-radius:9px;object-fit:contain;background:var(--shadow-bg-soft,#f4f4f6)}.csst-row-name{font-size:12px;font-weight:650;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.csst-footer{border-top:1px solid var(--csst-border);padding:8px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-shrink:0}.csst-footer button{font-size:12px;border-radius:11px;padding:8px 10px;white-space:nowrap}.csst-footer button[data-active="true"]{background:#8b5cf622;color:var(--csst-accent)}.csst-footer-group{display:flex;align-items:center;gap:2px}.csst-loading{font-size:12px;color:var(--csst-muted);text-align:center;padding:15px}.csst-error{font-size:12px;color:#df4560;padding:8px}.csst-image-create{border-radius:12px!important;background:var(--shadow-bg-soft,#f4f4f6)!important;display:flex!important;flex-direction:column;justify-content:center;gap:5px;color:var(--csst-muted)!important;font-size:11px!important}.csst-image-create i{font-size:22px}.csst-gif{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;text-align:center;color:var(--csst-muted);font-size:12px}.csst-gif i{font-size:32px}.csst-gif button{border:1px solid var(--csst-border);border-radius:9px;padding:10px 15px}.csst-drag{touch-action:none;user-select:none;cursor:grab}.csst-mini{min-width:26px;padding:7px!important;font-size:13px!important}.csst-divider{height:1px;background:var(--csst-border);margin:10px 0}.csst-spacer{flex:1}.csst-sticker[data-favorite="true"] .csst-fav{color:var(--csst-accent)!important}.csst-create-input{display:none}
@media(max-width:767px){.csst-root{bottom:0;left:0;right:0;width:100%;height:var(--chat-sticker-keyboard-height,320px);max-height:calc(100dvh - 110px);border-radius:14px 14px 0 0;border-left:0;border-right:0;border-bottom:0;box-shadow:0 -7px 18px #0001}.csst-top{display:none}.csst-main{padding:12px 9px 12px}.csst-packs{padding:4px 5px}.csst-pack{flex-basis:41px;width:41px;height:43px}.csst-pack img{width:34px;height:34px}.csst-grid{grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.csst-footer{padding:6px}.csst-footer button{padding:7px 6px;font-size:12px}.csst-create-label{display:none}.csst-fav{opacity:0}.csst-sticker:focus-within .csst-fav{opacity:1}}
@media(prefers-reduced-motion:reduce){.csst-animated{animation:none!important}}
@keyframes csst-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-9%)}}@keyframes csst-shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}@keyframes csst-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}@keyframes csst-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6%)}}
`

function StickerThumb({ sticker, onSelect, onFavorite, favorite, t }) {
  const animation = ['bounce', 'shake', 'pulse', 'float'].includes(sticker.animationType) ? sticker.animationType : 'none'
  const duration = sticker.animationSpeed === 'fast' ? '.75s' : sticker.animationSpeed === 'slow' ? '2.3s' : '1.5s'
  return (
    <div className="csst-sticker" data-favorite={favorite}>
      <button type="button" title={sticker.altText || sticker.title} aria-label={`${t.send}: ${sticker.title}`} onClick={() => onSelect(sticker)} style={{ width: '100%', height: '100%' }}>
        <img src={sticker.imageUrl} alt={sticker.altText || sticker.title || 'Sticker'} loading="lazy" style={animation === 'none' ? undefined : { animation: `csst-${animation} ${duration} ease-in-out ${sticker.animationRepeat === 'once' ? '1' : 'infinite'}` }} className={animation === 'none' ? '' : 'csst-animated'} />
      </button>
      {onFavorite && <button type="button" className="csst-fav" aria-label={t.favorites} onClick={() => onFavorite(sticker, favorite)}>{favorite ? '★' : '☆'}</button>}
    </div>
  )
}

export default function ChatStoryStickerPicker({ open, onClose, onChooseSticker, onChooseEmoji, onCreateSticker, onReturnKeyboard, height = 320 }) {
  const lang = ['km', 'kh'].includes(getDisplayLanguageId()) ? 'km' : 'en'
  const t = LABELS[lang]
  const [tab, setTab] = useState('stickers')
  const [view, setView] = useState('recent')
  const [packs, setPacks] = useState([])
  const [packPage, setPackPage] = useState(1)
  const [packHasMore, setPackHasMore] = useState(false)
  const [searchPacks, setSearchPacks] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [recent, setRecent] = useState([])
  const [favorites, setFavorites] = useState([])
  const [packImages, setPackImages] = useState({})
  const [imagePages, setImagePages] = useState({})
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [settings, setSettings] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const uploadRef = useRef(null)
  const dragId = useRef('')
  const favoriteIds = useMemo(() => new Set(favorites.map(item => item.id)), [favorites])
  const packMap = useMemo(() => new Map(packs.map(pack => [pack.id, pack])), [packs])
  const myPacks = useMemo(() => savedIds.map(id => packMap.get(id)).filter(Boolean), [savedIds, packMap])
  const orderedPacks = useMemo(() => {
    const seen = new Set(myPacks.map(item => item.id))
    return [...myPacks, ...packs.filter(item => !seen.has(item.id))]
  }, [myPacks, packs])
  const selectedPack = packMap.get(view)
  const list = view === 'recent' ? recent : view === 'favorites' ? favorites : (packImages[view] || [])

  useEffect(() => {
    if (!open) return undefined
    const controller = new AbortController()
    let alive = true
    setLoading(true)
    setError('')
    Promise.all([listStickerPacks({ limit: 60, sort, signal: controller.signal }), getMyStickerCollection({ signal: controller.signal })])
      .then(([catalog, mine]) => {
        if (!alive) return
        setPacks([...new Map([...(catalog.packs || []), ...(mine.savedPacks || [])].map(x => [x.id, x])).values()])
        setPackPage(1)
        setPackHasMore(Boolean(catalog.hasMore))
        setSavedIds(mine.packIds || [])
        setRecent(mine.recent || [])
        setFavorites(mine.favorites || [])
      })
      .catch(err => { if (alive && err.name !== 'AbortError') setError(err.message || t.clear) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false; controller.abort() }
  }, [open, sort, reload])

  useEffect(() => {
    if (!open || !settings || !search.trim()) { setSearchPacks([]); return undefined }
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      listStickerPacks({ search: search.trim(), sort, limit: 60, signal: controller.signal })
        .then(result => {
          setSearchPacks(result.packs || [])
          setPacks(previous => [...new Map([...previous, ...(result.packs || [])].map(x => [x.id, x])).values()])
        })
        .catch(err => { if (err.name !== 'AbortError') setError(err.message || t.clear) })
    }, 250)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [open, settings, search, sort])

  async function loadMorePacks() {
    if (!packHasMore || busy) return
    setBusy(true)
    try {
      const next = packPage + 1
      const result = await listStickerPacks({ sort, page: next, limit: 60 })
      setPacks(previous => [...new Map([...previous, ...(result.packs || [])].map(x => [x.id, x])).values()])
      setPackPage(next)
      setPackHasMore(Boolean(result.hasMore))
    } catch (err) { setError(err.message || t.clear) } finally { setBusy(false) }
  }

  useEffect(() => {
    if (!open || !selectedPack || imagePages[view]) return undefined
    const controller = new AbortController()
    let alive = true
    setLoading(true)
    listPackStickerImages(view, { signal: controller.signal })
      .then(result => {
        if (!alive) return
        setPackImages(prev => ({ ...prev, [view]: result.images || [] }))
        setImagePages(prev => ({ ...prev, [view]: { page: 1, hasMore: Boolean(result.hasMore) } }))
      })
      .catch(err => { if (alive && err.name !== 'AbortError') setError(err.message || t.clear) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false; controller.abort() }
  }, [open, view, selectedPack, imagePages])

  async function loadMore() {
    const state = imagePages[view]
    if (!selectedPack || !state?.hasMore || busy) return
    setBusy(true)
    try {
      const result = await listPackStickerImages(view, { page: state.page + 1 })
      setPackImages(prev => ({ ...prev, [view]: [...(prev[view] || []), ...(result.images || [])] }))
      setImagePages(prev => ({ ...prev, [view]: { page: state.page + 1, hasMore: Boolean(result.hasMore) } }))
    } catch (err) { setError(err.message || t.clear) } finally { setBusy(false) }
  }

  async function chooseSticker(item) {
    try {
      await Promise.resolve(onChooseSticker?.(item))
    } catch (err) { setError(err.message || t.clear); return }
    setRecent(prev => [item, ...prev.filter(x => x.id !== item.id)].slice(0, 48))
    recordChatStoryStickerUse(item.id).catch(() => {})
  }

  async function toggleFavorite(item, isFavorite) {
    if (busy) return
    setBusy(true)
    try {
      if (isFavorite) {
        await removeFavoriteSticker(item.id)
        setFavorites(prev => prev.filter(x => x.id !== item.id))
      } else {
        await addFavoriteSticker(item.id)
        setFavorites(prev => [item, ...prev])
      }
    } catch (err) { setError(err.message || t.clear) } finally { setBusy(false) }
  }

  async function toggleSaved(folderId) {
    if (busy) return
    setBusy(true)
    try {
      if (savedIds.includes(folderId)) {
        await removeSavedStickerPack(folderId)
        setSavedIds(prev => prev.filter(x => x !== folderId))
      } else {
        await addSavedStickerPack(folderId)
        setSavedIds(prev => [...prev, folderId])
      }
    } catch (err) { setError(err.message || t.clear) } finally { setBusy(false) }
  }

  async function reorder(folderId, direction) {
    const from = savedIds.indexOf(folderId)
    const to = from + direction
    if (busy || from < 0 || to < 0 || to >= savedIds.length) return
    const next = [...savedIds]
    ;[next[from], next[to]] = [next[to], next[from]]
    setSavedIds(next)
    setBusy(true)
    try { await reorderSavedStickerPacks(next) }
    catch (err) { setSavedIds(savedIds); setError(err.message || t.clear) }
    finally { setBusy(false) }
  }

  async function dropPack(toId) {
    const fromId = dragId.current
    dragId.current = ''
    if (!fromId || fromId === toId || busy) return
    const from = savedIds.indexOf(fromId)
    const to = savedIds.indexOf(toId)
    if (from < 0 || to < 0) return
    const next = [...savedIds]
    next.splice(to, 0, next.splice(from, 1)[0])
    setSavedIds(next)
    setBusy(true)
    try { await reorderSavedStickerPacks(next) }
    catch (err) { setSavedIds(savedIds); setError(err.message || t.clear) }
    finally { setBusy(false) }
  }

  function selectFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowed.includes(file.type) || file.size > 8 * 1024 * 1024) { setError('Choose JPEG, PNG, WebP, GIF or AVIF up to 8 MB.'); return }
    Promise.resolve(onCreateSticker?.(file)).catch(err => setError(err.message || t.clear))
  }

  const filtered = search ? searchPacks : orderedPacks
  if (!open) return null

  return (
    <section className="csst-root" role="dialog" aria-modal="false" aria-label="Chat Story stickers" style={{ '--chat-sticker-keyboard-height': `${Math.min(440, Math.max(235, Number(height) || 320))}px` }}>
      <style>{css}</style>
      <input ref={uploadRef} className="csst-create-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" aria-label={t.select} onChange={selectFile} />
      <div className="csst-top">
        <button className="csst-icon" type="button" onClick={onReturnKeyboard || onClose} aria-label="Keyboard"><i className="fa-solid fa-keyboard" /></button>
        <label className="csst-search"><i className="fa-solid fa-magnifying-glass" /><input value={search} placeholder={t.search} onChange={event => { setSearch(event.target.value); setSettings(true) }} /></label>
        <button className="csst-icon" type="button" onClick={onClose} aria-label={t.done}><i className="fa-solid fa-xmark" /></button>
      </div>
      <nav className="csst-packs" aria-label={t.packs}>
        <button type="button" className="csst-pack" data-current={!settings && view === 'recent'} onClick={() => { setView('recent'); setTab('stickers'); setSettings(false) }} title={t.recent}><span>◷</span></button>
        <button type="button" className="csst-pack" data-current={!settings && view === 'favorites'} onClick={() => { setView('favorites'); setTab('stickers'); setSettings(false) }} title={t.favorites}><span>☆</span></button>
        {orderedPacks.map(pack => <button key={pack.id} type="button" className="csst-pack" data-current={!settings && view === pack.id} onClick={() => { setView(pack.id); setTab('stickers'); setSettings(false) }} title={pack.name}>{pack.coverUrl ? <img src={pack.coverUrl} alt="" loading="lazy" /> : <span>{pack.icon}</span>}</button>)}
        <button type="button" className="csst-pack" data-current={settings} onClick={() => { setSettings(true); setTab('stickers') }} title={t.all}><span>⊞</span></button>
      </nav>
      <div className="csst-main">
        {error && <div className="csst-error" role="alert">{error} <button type="button" className="csst-action" onClick={() => { setError(''); setReload(v => v + 1) }}>{t.retry}</button></div>}
        {tab === 'emoji' && !settings && <div className="csst-grid">{EMOJIS.map(emoji => <button key={emoji} type="button" className="csst-sticker" onClick={() => onChooseEmoji?.(emoji)} style={{ fontSize: 26 }}>{emoji}</button>)}</div>}
        {tab === 'gifs' && !settings && <div className="csst-gif"><i className="fa-regular fa-image" /><span>{t.select}</span><button type="button" onClick={() => uploadRef.current?.click()}>{t.create} GIF</button></div>}
        {tab === 'stickers' && settings && <>
          <div className="csst-section-title"><span>{t.manage}</span><button type="button" className="csst-action" onClick={() => setSettings(false)}>{t.done}</button></div>
          <div style={{ display: 'flex', gap: 12, paddingBottom: 12 }}><button type="button" className="csst-action" onClick={() => setSort('default')}>{t.all}</button><button type="button" className="csst-action" onClick={() => setSort('trending')}>{t.trending}</button></div>
          {filtered.map(pack => <div key={pack.id} className="csst-row" draggable={savedIds.includes(pack.id)} onDragStart={() => { dragId.current = pack.id }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); dropPack(pack.id) }}>
            <span className="csst-drag" aria-hidden="true">☰</span>
            {pack.coverUrl ? <img className="csst-row-img" src={pack.coverUrl} alt="" loading="lazy" /> : <span className="csst-row-img" style={{ display: 'grid', placeItems: 'center', fontSize: 23 }}>{pack.icon}</span>}
            <div style={{ flex: 1, minWidth: 0 }}><span className="csst-row-name">{pack.name}</span><span className="csst-caption">{pack.imageCount} stickers {sort === 'trending' && pack.trendingScore ? ` · ${pack.trendingScore} ${t.trending}` : ''}</span></div>
            {savedIds.includes(pack.id) && <><button type="button" className="csst-mini" aria-label={t.moveUp} onClick={() => reorder(pack.id, -1)}>↑</button><button type="button" className="csst-mini" aria-label={t.moveDown} onClick={() => reorder(pack.id, 1)}>↓</button></>}
            <button type="button" className="csst-action" disabled={busy} onClick={() => toggleSaved(pack.id)}>{savedIds.includes(pack.id) ? t.remove : t.add}</button>
          </div>)}
          {!loading && !filtered.length && <div className="csst-loading">{t.noPacks}</div>}
          {!search.trim() && packHasMore && <button type="button" className="csst-action" onClick={loadMorePacks} disabled={busy}>{t.more}</button>}
        </>}
        {tab === 'stickers' && !settings && <>
          <div className="csst-section-title"><span>{view === 'recent' ? t.recent : view === 'favorites' ? t.favorites : selectedPack?.name || t.stickers}</span><span className="csst-caption">{selectedPack?.imageCount ? `${selectedPack.imageCount} stickers` : ''}</span></div>
          <div className="csst-grid">
            {view === 'recent' && <button type="button" className="csst-sticker csst-image-create" onClick={() => uploadRef.current?.click()}><i className="fa-regular fa-square-plus" /><span>{t.create}</span></button>}
            {list.map(item => <StickerThumb key={item.id} sticker={item} onSelect={chooseSticker} onFavorite={toggleFavorite} favorite={favoriteIds.has(item.id)} t={t} />)}
          </div>
          {!loading && !list.length && <div className="csst-loading">{t.empty}</div>}
          {imagePages[view]?.hasMore && <button type="button" className="csst-action" onClick={loadMore} disabled={busy}>{t.more}</button>}
        </>}
        {loading && <div className="csst-loading"><i className="fa-solid fa-spinner fa-spin" /> ...</div>}
      </div>
      <footer className="csst-footer">
        <button type="button" onClick={onReturnKeyboard || onClose} aria-label="Keyboard"><i className="fa-solid fa-keyboard" /></button>
        <button type="button" onClick={() => uploadRef.current?.click()} aria-label={t.create}><i className="fa-regular fa-square-plus" /> <span className="csst-create-label">{t.create}</span></button>
        <div className="csst-footer-group"><button type="button" data-active={tab === 'emoji'} onClick={() => { setTab('emoji'); setSettings(false) }}>{t.emoji}</button><button type="button" data-active={tab === 'gifs'} onClick={() => { setTab('gifs'); setSettings(false) }}>{t.gifs}</button><button type="button" data-active={tab === 'stickers'} onClick={() => { setTab('stickers'); setSettings(false) }}>{t.stickers}</button></div>
        <button type="button" onClick={() => { setSettings(true); setTab('stickers') }} aria-label={t.settings}><i className="fa-solid fa-gear" /></button>
      </footer>
    </section>
  )
}

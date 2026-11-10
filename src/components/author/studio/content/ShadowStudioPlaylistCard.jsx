import { useEffect, useRef, useState } from 'react'
import { EllipsisVertical, Globe2, ListVideo, LockKeyhole, Pencil, Trash2 } from 'lucide-react'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { studioFormatCount } from './ShadowStudioContentData'

/** The existing Playlist API returns name/visibility only. No count or cover is fabricated. */
export default function ShadowStudioPlaylistCard({ playlist, onOpen, onAction, disabled = false }) {
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = event => { if (!menuRef.current?.contains(event.target)) setOpen(false) }
    const onEscape = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  if (!playlist?.id) return null
  const count = studioFormatCount(playlist.video_count)
  const cover = typeof playlist.thumbnail_url === 'string' && /^https:\/\//i.test(playlist.thumbnail_url) ? playlist.thumbnail_url : null
  return <article className="relative flex min-w-0 items-start gap-3 py-2 text-[var(--shadow-text-primary)]">
    <button type="button" disabled={disabled || typeof onOpen !== 'function'} onClick={() => onOpen?.(playlist)}
      aria-label={playlist.name || t('shadowStudioNext.playlists')}
      className="relative aspect-video w-[40%] max-w-[230px] shrink-0 overflow-hidden rounded-xl bg-[var(--shadow-bg-soft)] sm:w-[38%] disabled:cursor-default">
      {cover ? <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
        : <span className="flex h-full w-full items-center justify-center text-[var(--shadow-text-secondary)]"><ListVideo size={31} /></span>}
      {count !== null ? <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white"><ListVideo size={12}/>{count}</span> : null}
    </button>
    <div className="flex min-w-0 flex-1 items-start gap-1">
      <div className="min-w-0 flex-1 space-y-2">
        <p className="line-clamp-2 break-words text-[13px] font-medium leading-5 sm:text-sm">{playlist.name || '—'}</p>
        {typeof playlist.is_public === 'boolean' ? <p className="inline-flex items-center gap-1.5 text-[11px] text-[var(--shadow-text-secondary)]">
          {playlist.is_public ? <Globe2 size={15}/> : <LockKeyhole size={15}/>}
          {t(playlist.is_public ? 'shadowStudioNext.public' : 'shadowStudioNext.private')}
        </p> : null}
      </div>
      {typeof onAction === 'function' ? <div ref={menuRef} className="relative shrink-0">
        <button type="button" disabled={disabled} aria-haspopup="menu" aria-expanded={open}
          aria-label={t('shadowStudioNext.playlistOptions')}
          onClick={() => setOpen(current => !current)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)] disabled:opacity-50"><EllipsisVertical size={19}/></button>
        {open ? <div role="menu" className="absolute right-0 top-full z-30 mt-1 min-w-[158px] rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated,var(--shadow-bg-surface))] py-1 shadow-xl">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onAction(playlist, 'rename') }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs hover:bg-[var(--shadow-bg-soft)]"><Pencil size={15}/>{t('shadowStudioNext.rename')}</button>
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onAction(playlist, 'delete') }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-[var(--shadow-danger)] hover:bg-[var(--shadow-bg-soft)]"><Trash2 size={15}/>{t('shadowStudioNext.delete')}</button>
        </div> : null}
      </div> : null}
    </div>
  </article>
}

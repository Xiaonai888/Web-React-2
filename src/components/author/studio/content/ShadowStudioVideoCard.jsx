import { useEffect, useRef, useState } from 'react'
import { BarChart3, EllipsisVertical, EyeOff, Globe2, MessageSquare, Pencil, Play, ThumbsUp, Trash2, ArrowLeftRight } from 'lucide-react'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import {
  studioDateLabel, studioFormatCount, studioFormatDuration,
  studioVideoKind, studioVideoThumbnail,
} from './ShadowStudioContentData'

/** Display-only card. All playback and write operations are delegated to the parent. */
export default function ShadowStudioVideoCard({ video, display = 'grid', onOpen, onAction, disabled = false }) {
  const { t } = useDisplayTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const short = display === 'shorts'
  const list = display === 'list'
  const videoKind = studioVideoKind(video)
  const thumbnail = studioVideoThumbnail(video)
  const duration = studioFormatDuration(video?.duration_seconds)
  const views = studioFormatCount(video?.view_count)
  const likes = studioFormatCount(video?.likes)
  const comments = studioFormatCount(video?.comments)
  const date = studioDateLabel(video?.published_at)
  const published = video?.status === 'published'
  const menuActions = [
    { key: 'edit', label: t('shadowStudioNext.edit'), Icon: Pencil },
    { key: 'toggle-status', label: t(published ? 'shadowStudioNext.unpublish' : 'shadowStudioNext.publish'), Icon: EyeOff },
    { key: 'move', label: t(videoKind === 'short' ? 'shadowStudioNext.moveLong' : 'shadowStudioNext.moveShort'), Icon: ArrowLeftRight },
    { key: 'delete', label: t('shadowStudioNext.delete'), Icon: Trash2, danger: true },
  ]

  useEffect(() => {
    if (!menuOpen) return undefined
    function onPointerDown(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    function onEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [menuOpen])

  if (!video?.id) return null

  const thumbnailView = (
    <button
      type="button"
      disabled={disabled || typeof onOpen !== 'function'}
      onClick={() => onOpen?.(video)}
      className={`group relative block shrink-0 overflow-hidden rounded-xl bg-[var(--shadow-bg-soft)] ${short ? 'aspect-[9/16]' : 'aspect-video'} ${list ? 'w-[40%] max-w-[230px] sm:w-[38%]' : 'w-full'} enabled:cursor-pointer disabled:cursor-default`}
      aria-label={String(video.title || t('shadowStudioNext.videos'))}
    >
      {thumbnail ? <img src={thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-[var(--shadow-text-secondary)]"><Play size={30}/></span>}
      {typeof onOpen === 'function' ? <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100 group-focus-visible:bg-black/30 group-focus-visible:opacity-100"><Play size={31} fill="currentColor" /></span> : null}
      {duration ? <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">{duration}</span> : null}
    </button>
  )

  const stats = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--shadow-text-secondary)]">
      {views !== null ? <span className="inline-flex items-center gap-1" title={t('shadowStudioNext.views')}><BarChart3 size={14} aria-hidden="true" />{views}</span> : null}
      {likes !== null ? <span className="inline-flex items-center gap-1" title="Likes"><ThumbsUp size={14} aria-hidden="true" />{likes}</span> : null}
      {comments !== null ? <span className="inline-flex items-center gap-1" title="Comments"><MessageSquare size={14} aria-hidden="true" />{comments}</span> : null}
    </div>
  )

  return <article className={`relative min-w-0 text-[var(--shadow-text-primary)] ${list ? 'flex items-start gap-3 py-2' : 'space-y-2'}`}>
    {thumbnailView}
    <div className="flex min-w-0 flex-1 items-start gap-1">
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className={`break-words text-[13px] font-medium leading-5 ${list ? 'line-clamp-2 sm:text-sm' : 'line-clamp-2'}`}>{video.title || '—'}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--shadow-text-secondary)]">
          {published ? <span className="inline-flex items-center gap-1" title={t('shadowStudioNext.public')}><Globe2 size={14} aria-hidden="true" />{t('shadowStudioNext.public')}</span>
            : <span className="inline-flex items-center gap-1" title={t('shadowStudioNext.draft')}><EyeOff size={14} aria-hidden="true" />{t('shadowStudioNext.draft')}</span>}
          {video.access_type === 'paid' ? <span>{t('shadowStudioNext.paid')}</span> : null}
          {date ? <span>· {date}</span> : null}
        </div>
        {stats}
      </div>
      {typeof onAction === 'function' ? <div className="relative shrink-0" ref={menuRef}>
        <button type="button" disabled={disabled} aria-haspopup="menu" aria-expanded={menuOpen}
          aria-label={t('shadowStudioNext.videoOptions')} onClick={() => setMenuOpen(v => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)] disabled:opacity-50">
          <EllipsisVertical size={19} />
        </button>
        {menuOpen ? <div role="menu" className="absolute right-0 top-full z-30 mt-1 min-w-[176px] overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated,var(--shadow-bg-surface))] py-1 shadow-xl">
          {menuActions.map(({ key, label, Icon, danger }) => <button key={key} type="button" role="menuitem"
            onClick={() => { setMenuOpen(false); onAction(video, key) }}
            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs hover:bg-[var(--shadow-bg-soft)] ${danger ? 'text-[var(--shadow-danger)]' : ''}`}>
            <Icon size={15} />{label}
          </button>)}
        </div> : null}
      </div> : null}
    </div>
  </article>
}

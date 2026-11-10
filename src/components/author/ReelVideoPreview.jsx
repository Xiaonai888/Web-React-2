import { useEffect, useState } from 'react'
import { Clock3, Film, Link2, Play, RefreshCw } from 'lucide-react'
import { getReelYouTubeUrls } from '../../utils/reelYouTube'

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)

function durationLabel(seconds) {
  if (!Number.isSafeInteger(seconds) || seconds < 1) return '—'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}` : `${minutes}:${String(secs).padStart(2, '0')}`
}

function ShapeChoice({ type, selected, label, disabled, onClick }) {
  const wide = type === 'long'
  return <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    aria-pressed={selected}
    className={`flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-50 ${
      selected ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-text-primary)]' : 'border-[var(--shadow-border)] hover:bg-[var(--shadow-bg-soft)]'
    }`}
  >
    <span className="flex h-10 items-center justify-center">
      <span className={`block rounded-[3px] border-2 border-current ${wide ? 'h-7 w-12' : 'h-10 w-6'}`} />
    </span>
    <span className="text-xs font-semibold">{label}</span>
  </button>
}

/** A thumbnail preview only. Duration comes from verified YouTube metadata or remains unknown. */
export default function ReelVideoPreview({ videoUrl = '', title = '', videoType, onVideoTypeChange, onDurationChange, t }) {
  const youtube = getReelYouTubeUrls(videoUrl)
  const youtubeId = youtube?.id || ''
  const [durationSeconds, setDurationSeconds] = useState(null)
  const [metadataLoading, setMetadataLoading] = useState(false)
  const [metadataError, setMetadataError] = useState(false)

  useEffect(() => {
    onDurationChange?.(null)
    setDurationSeconds(null)
    setMetadataError(false)
    if (!youtubeId) { setMetadataLoading(false); return undefined }

    const controller = new AbortController()
    const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
    setMetadataLoading(true)
    fetch(`${API_BASE}/api/fast/videos/youtube-metadata/${encodeURIComponent(youtubeId)}`, {
      signal: controller.signal,
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async response => {
        const data = await response.json().catch(() => null)
        if (!response.ok || data?.ok !== true) throw new Error('metadata unavailable')
        return data
      })
      .then(data => {
        if (controller.signal.aborted) return
        const seconds = Number(data.duration_seconds)
        const value = Number.isSafeInteger(seconds) && seconds > 0 && data.duration_seconds != null ? seconds : null
        setDurationSeconds(value)
        onDurationChange?.(value)
      })
      .catch(() => { if (!controller.signal.aborted) setMetadataError(true) })
      .finally(() => { if (!controller.signal.aborted) setMetadataLoading(false) })
    return () => controller.abort()
  }, [youtubeId, onDurationChange])

  return <section className="space-y-3 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold">{t('authorReelAdd.preview')}</h2>
      <span className="text-[11px] text-[var(--shadow-text-secondary)]">{t('authorReelShape.previewOptional')}</span>
    </div>
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--shadow-bg-soft)]">
      {youtube ? <>
        <img src={youtube.thumbnailUrl} alt={title || t('authorReelAdd.preview')} loading="lazy" className="h-full w-full object-cover" />
        <a href={youtube.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={t('authorReelShape.openYouTube')}
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/65 text-white"><Play size={24} fill="currentColor" /></span>
        </a>
      </> : <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-[var(--shadow-text-secondary)]">
        <Film size={32} strokeWidth={1.5} />
        <span className="text-xs">{t('authorReelShape.previewEmpty')}</span>
      </div>}
      <span className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-[11px] font-semibold tabular-nums text-white">
        {metadataLoading ? <RefreshCw size={12} className="animate-spin" /> : <Clock3 size={12} />}
        {durationLabel(durationSeconds)}
      </span>
    </div>
    {youtube && !metadataLoading && (durationSeconds == null || metadataError) ? (
      <p className="text-[11px] text-[var(--shadow-text-secondary)]">{t('authorReelShape.durationUnknown')}</p>
    ) : null}
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-xs font-bold">{t('authorReelShape.shape')}</h3>
      <span className="text-[11px] text-[var(--shadow-text-secondary)]">{t('authorReelShape.autoEditable')}</span>
    </div>
    <div className="flex gap-3">
      <ShapeChoice type="long" selected={videoType === 'long'} label={t('authorReelShape.long')} disabled={!youtube} onClick={() => onVideoTypeChange?.('long')} />
      <ShapeChoice type="short" selected={videoType === 'short'} label={t('authorReelShape.short')} disabled={!youtube} onClick={() => onVideoTypeChange?.('short')} />
    </div>
    <p className="flex items-center gap-1.5 text-[11px] text-[var(--shadow-text-secondary)]"><Link2 size={12}/>{t('authorReelShape.internalOnly')}</p>
  </section>
}

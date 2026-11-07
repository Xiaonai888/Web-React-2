import { Link2 } from 'lucide-react'
import { getReelYouTubeUrls } from '../../utils/reelYouTube'

/** Lightweight thumbnail only: no YouTube iframe/API requests on form load. */
export default function ReelVideoPreview({ videoUrl = '', title = '', t }) {
  const youtube = getReelYouTubeUrls(videoUrl)

  if (!youtube) {
    return (
      <p className="flex items-center gap-2 text-xs text-[var(--shadow-text-tertiary)]">
        <Link2 size={14} aria-hidden="true" />
        {t('authorReelAdd.youtubeOnly')}
      </p>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-2">
      <img
        src={youtube.thumbnailUrl}
        alt={t('authorReelAdd.preview')}
        loading="lazy"
        className="h-[72px] w-[128px] shrink-0 rounded-md bg-black object-cover"
      />
      <div className="min-w-0 space-y-1">
        <p className="line-clamp-2 break-words text-sm font-medium text-[var(--shadow-text-primary)]">
          {title.trim() || t('authorReelAdd.preview')}
        </p>
        <p className="text-[11px] text-[var(--shadow-text-secondary)]">
          YouTube · {youtube.id}
        </p>
      </div>
    </div>
  )
}

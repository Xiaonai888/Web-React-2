import { useRef } from 'react'
import { Heart } from 'lucide-react'
import useFastReelLike from '../../hooks/useFastReelLike'
import { hasFastReaderSession } from '../../services/fastLikesApi'

// Fast-only Like button: no reactions menu and no user list.
export default function FastReelLikeButton({
  videoId,
  active = false,
  initialCount = null,
  onAuthRequired,
  onError,
  className = '',
}) {
  const heartRef = useRef(null)
  const { liked, likeCount, pending, toggleLike } = useFastReelLike(videoId, {
    active,
    initialCount,
    onAuthRequired,
    onError,
  })

  const animateHeart = () => {
    const node = heartRef.current
    if (!node || typeof node.animate !== 'function') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    node.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.32)' },
        { transform: 'scale(0.91)' },
        { transform: 'scale(1.08)' },
        { transform: 'scale(1)' },
      ],
      { duration: 420, easing: 'ease-out' },
    )
  }

  const handleClick = async () => {
    if (pending) return
    // Only Likes bounce; Unlike remains a simple state change.
    if (hasFastReaderSession() && !liked) animateHeart()
    await toggleLike()
  }

  const countLabel = likeCount === null
    ? '…'
    : new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(likeCount)

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? 'Unlike Reel' : 'Like Reel'}
      aria-pressed={liked}
      aria-busy={pending}
      title={liked ? 'Unlike' : 'Like'}
      className={`flex min-h-12 min-w-10 flex-col items-center justify-center gap-0.5 text-white drop-shadow-lg active:scale-95 ${className}`}
    >
      <span ref={heartRef} className="flex h-8 items-center justify-center">
        <Heart
          size={27}
          strokeWidth={2}
          fill={liked ? '#ff4c78' : 'none'}
          color={liked ? '#ff4c78' : '#ffffff'}
          aria-hidden="true"
        />
      </span>
      <span className="min-h-[15px] text-[11px] font-semibold leading-none tabular-nums">
        {countLabel}
      </span>
    </button>
  )
}

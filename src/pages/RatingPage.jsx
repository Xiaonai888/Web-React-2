import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatShortNumber(value) {
  const number = Number(value || 0)
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return number.toLocaleString()
}

function formatDate(value) {
  if (!value) return 'Just now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'
  return date.toLocaleDateString('en-GB')
}

function getStoredReviews(storyId) {
  try {
    const raw = localStorage.getItem(`shadow_story_reviews_${storyId}`)
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const REVIEW_REQUIRED_READ_EPISODES = 3

function getReviewReadKey(storyId) {
  return `shadow_review_read_episodes_${storyId}`
}

function getReviewReadEpisodes(storyId) {
  if (!storyId) return []

  try {
    const parsed = JSON.parse(localStorage.getItem(getReviewReadKey(storyId)) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function StarRow({ value, size = 'text-[18px]' }) {
  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`fa-solid fa-star ${Number(value || 0) >= star ? 'text-[#ff8a3d]' : 'text-[#d0d5dd]'}`}
        />
      ))}
    </div>
  )
}

function EmptyReviewState({ onWriteReview }) {
  return (
    <div className="px-4 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className="fa-regular fa-star text-[22px]" />
      </div>

      <h3 className="mt-4 text-[17px] font-extrabold text-[#111827]">No reviews yet</h3>

      <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-semibold leading-6 text-[#667085]">
        Be the first reader to rate this story. Your review helps other readers decide what to read next.
      </p>

      <button
        type="button"
        onClick={onWriteReview}
        className="mt-5 h-11 rounded-full bg-[#111827] px-5 text-[13px] font-normal text-white active:scale-95"
      >
        Write the first review
      </button>
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <article className="border-b border-[#eef1f5] px-4 py-5 last:border-b-0 sm:px-0">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[15px] font-black text-white">
          {(review.name || 'R').slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-[14px] font-black text-[#111827]">{review.name || 'Reader'}</h3>
            <StarRow value={review.rating} size="text-[13px]" />
            <span className="text-[12px] font-semibold text-[#667085]">{review.label || 'Review'}</span>
          </div>

          {review.text ? (
            <p className="mt-3 line-clamp-4 text-[13.5px] font-medium leading-6 text-[#4b5563]">
              {review.text}
            </p>
          ) : null}

          <div className="mt-3 text-[12px] font-semibold text-[#98a2b3]">
            {formatDate(review.created_at)}
          </div>

          {review.author_reply ? (
            <div className="mt-3 rounded-[18px] bg-[#f8fafc] px-4 py-3">
              <div className="text-[12px] font-black text-[#111827]">Author replied</div>
              <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#667085]">
                {review.author_reply}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}


function ReviewGateModal({ open, readCount, onClose, onStartReading }) {
  if (!open) return null

  const remaining = Math.max(0, REVIEW_REQUIRED_READ_EPISODES - Number(readCount || 0))

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/45 px-4">
      <section className="w-full max-w-[420px] rounded-[26px] bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d6] text-[#f59e0b]">
          <i className="fa-solid fa-book-open-reader text-[25px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">
          Read more before reviewing
        </h2>

        <p className="mt-3 text-[13px] font-semibold leading-6 text-[#667085]">
          Please read at least {REVIEW_REQUIRED_READ_EPISODES} episodes before leaving a review.
          You have read {Number(readCount || 0)} so far. Read {remaining} more to unlock reviews.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-black text-[#111827] active:scale-95"
          >
            Not now
          </button>

          <button
            type="button"
            onClick={onStartReading}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-95"
          >
            Start reading
          </button>
        </div>
      </section>
    </div>
  )
}

function ReviewBottomSheet({
  open,
  rating,
  reviewText,
  onClose,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}) {
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    lastY: 0,
    startTime: 0,
  })

  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!open) return

    dragRef.current = {
      active: false,
      pointerId: null,
      startY: 0,
      lastY: 0,
      startTime: 0,
    }

    setDragging(false)
    setDragOffset(0)
  }, [open])

  if (!open) return null

  const resetDrag = () => {
    dragRef.current.active = false
    dragRef.current.pointerId = null
    setDragging(false)
    setDragOffset(0)
  }

  const handleDragStart = (event) => {
    if (!event.isPrimary) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    if (
      event.target instanceof Element &&
      event.target.closest('button, input, textarea')
    ) {
      return
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startTime: performance.now(),
    }

    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = (event) => {
    const drag = dragRef.current

    if (!drag.active || drag.pointerId !== event.pointerId) return

    drag.lastY = event.clientY

    const distance = Math.max(0, event.clientY - drag.startY)

    setDragOffset(
      Math.min(distance, window.innerHeight * 0.65)
    )

    if (event.cancelable) event.preventDefault()
  }

  const handleDragEnd = (event) => {
    const drag = dragRef.current

    if (!drag.active || drag.pointerId !== event.pointerId) return

    drag.lastY = event.clientY

    const distance = Math.max(0, drag.lastY - drag.startY)
    const elapsed = Math.max(1, performance.now() - drag.startTime)
    const velocity = distance / elapsed

    drag.active = false
    drag.pointerId = null
    setDragging(false)

    if (
      distance >= 70 ||
      (distance >= 24 && velocity >= 0.6)
    ) {
      setDragOffset(0)
      onClose()
      return
    }

    setDragOffset(0)
  }

  const handleDragCancel = (event) => {
    const drag = dragRef.current

    if (!drag.active) return
    if (drag.pointerId !== event.pointerId) return

    resetDrag()
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/40 px-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close review sheet"
      />

      <section
        className="relative w-full max-w-[520px] rounded-t-[28px] bg-white px-5 pb-6 pt-3 shadow-2xl"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <div
          role="presentation"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragCancel}
          onLostPointerCapture={handleDragCancel}
          className="flex min-h-12 cursor-grab touch-none items-center justify-between gap-3 active:cursor-grabbing"
        >
          <h2
            className="text-[18px] font-bold text-[#111827]"
            style={{ fontWeight: 700 }}
          >
            Leave a Review
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`text-[36px] active:scale-95 ${
                rating >= star
                  ? 'text-[#ff8a3d]'
                  : 'text-[#d9d9d9]'
              }`}
              aria-label={`Rate ${star}`}
            >
              <i className="fa-solid fa-star" />
            </button>
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={(event) =>
            onReviewTextChange(event.target.value)
          }
          rows={5}
          placeholder="What made this story stand out?"
          className="mt-5 w-full resize-none rounded-[20px] bg-[#f3f4f6] px-4 py-4 text-[14px] font-medium leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] focus:ring-2 focus:ring-[#111827]/15"
        />

        <p className="mt-3 text-[12px] font-semibold leading-5 text-[#98a2b3]">
          Share what you liked, how the story made you feel, or what helped you keep reading.
        </p>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!rating}
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-95 disabled:bg-[#d0d5dd]"
        >
          Submit Review
        </button>
      </section>
    </div>
  )
}

export default function RatingPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const id = storyId

  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [storedReviews, setStoredReviews] = useState([])
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)
  const [reviewGateOpen, setReviewGateOpen] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newReviewText, setNewReviewText] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${id}`)
        const data = await response.json().catch(() => ({}))

        if (!ignore) setStory(data.story || null)
      } catch {
        if (!ignore) setStory(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()
    setStoredReviews(getStoredReviews(id))

    return () => {
      ignore = true
    }
  }, [id])

  const reviews = useMemo(() => storedReviews, [storedReviews])

  const sortedReviews = useMemo(() => {
  const list = [...reviews]

  if (sort === 'hot') {
    return list.sort((a, b) => {
      const aReplies = Array.isArray(a.replies) ? a.replies.length : Number(a.reply_count || 0)
      const bReplies = Array.isArray(b.replies) ? b.replies.length : Number(b.reply_count || 0)
      const aScore = Number(a.likes || a.like_count || 0) + aReplies
      const bScore = Number(b.likes || b.like_count || 0) + bReplies

      return bScore - aScore || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}, [reviews, sort])

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
    return total / reviews.length
  }, [reviews])

  const ratingValue = Number(story?.rating_average || story?.rating || averageRating || 0)
  const reviewCount = Number(story?.rating_count || story?.review_count || reviews.length || 0)

  const handleOpenReviewSheet = () => {
    const readEpisodes = getReviewReadEpisodes(id)

    if (readEpisodes.length < REVIEW_REQUIRED_READ_EPISODES) {
      setReviewGateOpen(true)
      return
    }

    setReviewSheetOpen(true)
  }

  const handleStartReadingFromGate = () => {
    setReviewGateOpen(false)
    navigate(`/story/${id}`)
  }

  const handleCloseReviewSheet = () => {
    setReviewSheetOpen(false)
  }

  const handleSubmitReview = () => {
    if (!newRating) return

    const review = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: 'Reader',
      rating: newRating,
      likes: 0,
      replies: [],
      label: newRating >= 5 ? 'Excellent' : newRating >= 4 ? 'Good' : newRating >= 3 ? 'Okay' : 'Needs work',
      text: newReviewText.trim(),
      created_at: new Date().toISOString(),
    }

    const nextReviews = [review, ...storedReviews]
    localStorage.setItem(`shadow_story_reviews_${id}`, JSON.stringify(nextReviews))

    setStoredReviews(nextReviews)
    setNewRating(0)
    setNewReviewText('')
    setReviewSheetOpen(false)
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-[#111827]">
      <section className="mx-auto max-w-3xl">
  <div className="overflow-hidden rounded-none bg-[#111827] text-white shadow-sm">
    <div className="relative min-h-[220px] px-5 pb-5 pt-16">
      {story?.cover_url ? (
        <img
          src={story.cover_url}
          alt={story.title || 'Story cover'}
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/70 via-[#111827]/45 to-[#ff8a3d]/25" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />

      <div className="absolute inset-x-0 top-0 z-20 flex h-14 items-center px-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white active:scale-95"
          aria-label="Go back"
        >
          <i className="fa-solid fa-chevron-left text-[18px]" />
        </button>

        <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[20px] font-bold text-white">
          {loading ? 'Loading story...' : story?.title || 'Untitled Story'}
        </h1>

        <div className="h-10 w-10 shrink-0" />
      </div>

      <div className="relative z-10 flex min-h-[140px] items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[34px] font-extrabold leading-none">
              {ratingValue.toFixed(1)}
            </span>
            <StarRow value={Math.round(ratingValue)} size="text-[16px]" />
          </div>

          <div className="mt-2 text-[12px] font-semibold text-white/75">
            {formatShortNumber(reviewCount)} reviews
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenReviewSheet}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#111827] active:scale-95"
        >
          Leave a Review
          <i className="fa-solid fa-pen-to-square ml-2" />
        </button>
      </div>
    </div>
  </div>
</section>

      

      <section className="relative z-10 mx-auto -mt-2 max-w-3xl rounded-t-[14px] bg-white pt-5">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-[14px] font-semibold text-[#111827]">Review Center</h2>

          <div className="flex items-center text-[14px] font-medium">
            <button
              type="button"
              onClick={() => setSort('hot')}
className={sort === 'hot' ? 'text-[#e85d75]' : 'text-[#98a2b3]'}
            >
              Hot
            </button>

            <span className="mx-3 h-4 w-px bg-[#e4e7ec]" />

            <button
              type="button"
              onClick={() => setSort('newest')}
              className={sort === 'newest' ? 'text-[#e85d75]' : 'text-[#98a2b3]'}
            >
              New
            </button>
          </div>
        </div>

        <div className="mt-2 bg-white">
          {sortedReviews.length ? (
            sortedReviews.map((review) => (
              <ReviewCard key={review.id || `${review.created_at}-${review.rating}`} review={review} />
            ))
          ) : (
            <EmptyReviewState onWriteReview={handleOpenReviewSheet} />
          )}
        </div>
      </section>

      <ReviewGateModal
        open={reviewGateOpen}
        readCount={getReviewReadEpisodes(id).length}
        onClose={() => setReviewGateOpen(false)}
        onStartReading={handleStartReadingFromGate}
      />

      <ReviewBottomSheet
        open={reviewSheetOpen}
        rating={newRating}
        reviewText={newReviewText}
        onClose={handleCloseReviewSheet}
        onRatingChange={setNewRating}
        onReviewTextChange={setNewReviewText}
        onSubmit={handleSubmitReview}
      />
    </main>
  )
}

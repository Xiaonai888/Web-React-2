import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

      <h3 className="mt-4 text-[17px] font-black text-[#111827]">No reviews yet</h3>

      <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-semibold leading-6 text-[#667085]">
        Be the first reader to rate this story. Your review helps other readers decide what to read next.
      </p>

      <button
        type="button"
        onClick={onWriteReview}
        className="mt-5 h-11 rounded-full bg-[#111827] px-5 text-[13px] font-black text-white active:scale-95"
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

export default function RatingPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [storedReviews, setStoredReviews] = useState([])
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)
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

    if (sort === 'highest') {
      return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
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

  return (
    <main className="min-h-screen bg-white pb-24 text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eef1f5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-center text-[18px] font-black">Reviews</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pt-5">
        <div className="overflow-hidden rounded-[26px] bg-[#111827] text-white shadow-sm">
          <div className="relative min-h-[160px] p-5">
            {story?.cover_url ? (
              <img
                src={story.cover_url}
                alt={story.title || 'Story cover'}
                className="absolute inset-0 h-full w-full object-cover opacity-35"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/92 via-[#111827]/72 to-[#ff8a3d]/45" />

            <div className="relative z-10 flex min-h-[120px] flex-col justify-between">
              <h2 className="line-clamp-2 text-[22px] font-black leading-7">
                {loading ? 'Loading story...' : story?.title || 'Untitled Story'}
              </h2>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[34px] font-black leading-none">{ratingValue.toFixed(1)}</span>
                    <StarRow value={Math.round(ratingValue)} size="text-[16px]" />
                  </div>

                  <div className="mt-2 text-[12px] font-semibold text-white/75">
                    {formatShortNumber(reviewCount)} reviews
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/story/${id}/review`)}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#111827] active:scale-95"
                >
                  Leave a Review
                  <i className="fa-solid fa-pen-to-square ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl pt-5">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-[18px] font-black">Review Center</h2>

          {reviews.length ? (
            <div className="rounded-full bg-[#f5f3fa] p-1">
              <button
                type="button"
                onClick={() => setSort('newest')}
                className={`rounded-full px-3 py-1.5 text-[12px] font-black ${
                  sort === 'newest' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#98a2b3]'
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setSort('highest')}
                className={`rounded-full px-3 py-1.5 text-[12px] font-black ${
                  sort === 'highest' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#98a2b3]'
                }`}
              >
                Highest
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-2 bg-white">
          {sortedReviews.length ? (
            sortedReviews.map((review) => (
              <ReviewCard key={review.id || `${review.created_at}-${review.rating}`} review={review} />
            ))
          ) : (
            <EmptyReviewState onWriteReview={() => navigate(`/story/${id}/review`)} />
          )}
        </div>
      </section>
    </main>
  )
}

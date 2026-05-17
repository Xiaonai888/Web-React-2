import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getStoredReviews(storyId) {
  try {
    const raw = localStorage.getItem(`shadow_story_reviews_${storyId}`)
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveReview(storyId, review) {
  const reviews = getStoredReviews(storyId)
  localStorage.setItem(`shadow_story_reviews_${storyId}`, JSON.stringify([review, ...reviews]))
}

export default function LeaveReviewPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [story, setStory] = useState(null)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${id}`)
        const data = await response.json().catch(() => ({}))
        if (!ignore) setStory(data.story || null)
      } catch {
        if (!ignore) setStory(null)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [id])

  const canSubmit = rating > 0

  const handleSubmit = () => {
    if (!canSubmit) return

    saveReview(id, {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: 'Reader',
      rating,
      label: rating >= 5 ? 'Excellent' : rating >= 4 ? 'Good' : rating >= 3 ? 'Okay' : 'Needs work',
      text: text.trim(),
      likes: 0,
      created_at: new Date().toISOString(),
    })

    navigate(`/story/${id}/rating`)
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eef1f5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-[44px_1fr_92px] items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-full text-[#111827] active:scale-95" aria-label="Go back">
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-[18px] font-black">Leave a Review</h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#98a2b3]">
              {story?.title ? `Reviewing: ${story.title}` : 'Review this story'}
            </p>
          </div>

          <button type="button" onClick={handleSubmit} disabled={!canSubmit} className="h-10 rounded-full bg-[#111827] px-4 text-[13px] font-black text-white active:scale-95 disabled:bg-[#d0d5dd]">
            Submit
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pt-8">
        <div className="text-center">
          <h2 className="text-[22px] font-black">Score</h2>
          <div className="mt-7 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} className={`text-[42px] active:scale-95 ${rating >= star ? 'text-[#ff8a3d]' : 'text-[#d9d9d9]'}`} aria-label={`Rate ${star}`}>
                <i className="fa-solid fa-star" />
              </button>
            ))}
          </div>
        </div>

        <label className="mt-8 block">
          <div className="mb-2 text-[13px] font-black text-[#111827]">Your review</div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            placeholder="What made this story stand out?"
            className="w-full resize-none rounded-[22px] bg-[#f3f4f6] px-4 py-4 text-[14px] font-medium leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] focus:ring-2 focus:ring-[#111827]/15"
          />
        </label>

        <div className="mt-6 rounded-[22px] bg-[#f8fafc] px-4 py-4">
          <p className="text-[14px] font-semibold leading-6 text-[#4b5563]">
            Share what you liked, how the story made you feel, or what helped you keep reading.
          </p>
          <ul className="mt-4 space-y-2 text-[13px] font-semibold leading-6 text-[#667085]">
            <li>• Characters you liked</li>
            <li>• Favorite moment</li>
            <li>• How the story made you feel</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

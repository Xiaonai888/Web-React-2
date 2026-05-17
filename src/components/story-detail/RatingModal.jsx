import { useState } from 'react'

export default function RatingModal({ open, story, finishedEpisodeCount, onClose }) {
  const [rating, setRating] = useState(0)
  if (!open) return null

  const allowRatingWithoutEpisodeLimit = true
const allowed = allowRatingWithoutEpisodeLimit || finishedEpisodeCount >= 3
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close"
      />

      <section className="relative w-full max-w-[460px] rounded-[30px] bg-white p-5 text-center shadow-2xl">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          allowed ? 'bg-[#fff7ed] text-[#f59e0b]' : 'bg-[#fff1f1] text-[#e5484d]'
        }`}>
          <i className={`${allowed ? 'fa-solid fa-star' : 'fa-solid fa-circle-info'} text-[26px]`} />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">Rate this story</h2>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
          {allowed
            ? `You can rate ${story?.title || 'this story'} now.`
            : 'Please finish at least 3 episodes before rating this story. One episode is not enough to judge the full story.'}
        </p>

        {allowed ? (
          <div className="mt-5 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-[30px] ${rating >= star ? 'text-[#f59e0b]' : 'text-[#d0d5dd]'}`}
                aria-label={`Rate ${star}`}
              >
                <i className="fa-solid fa-star" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[20px] bg-[#f8fafc] px-4 py-4 text-[13px] font-black text-[#111827]">
            Finished episodes: {finishedEpisodeCount}/3
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
        >
          {allowed ? 'Save demo rating' : 'Got it'}
        </button>
      </section>
    </div>
  )
}

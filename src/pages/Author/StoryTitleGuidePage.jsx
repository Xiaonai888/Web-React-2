import { useNavigate } from 'react-router-dom'

const titleTips = [
  {
    title: 'Make It Easy to Remember',
    body: 'Choose a title that is short, clear, and easy to say. Readers should remember it after seeing it once.',
  },
  {
    title: 'Reflect the Heart of Your Story',
    body: 'Think about the main emotion, conflict, relationship, mystery, or journey. Let the title hint at what makes the story special.',
  },
  {
    title: 'Create Curiosity',
    body: 'Use an interesting phrase, secret, promise, question, or contrast. Give readers a reason to wonder without revealing the whole story.',
  },
  {
    title: 'Match the Story’s Mood',
    body: 'Romance can sound soft or emotional. Thrillers can feel tense or mysterious. Fantasy titles can feel magical, ancient, or adventurous.',
  },
  {
    title: 'Use a Meaningful Detail',
    body: 'Build the title around an important object, place, memory, nickname, promise, season, or sentence from the story.',
  },
  {
    title: 'Keep It Focused',
    body: 'Two to seven words is often enough. Longer titles can work, but they should still be easy to read and recognize.',
  },
]

const titleFormulas = [
  'Emotion + Object: The Last Letter',
  'Place + Secret: Secrets of the Moonlit House',
  'Character + Conflict: The Queen Who Refused the Crown',
  'Promise + Consequence: Before We Say Goodbye',
  'Time + Memory: The Summer We Forgot',
]

export default function StoryTitleGuidePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">
      <header className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-bold text-[#111827]">
            How to Choose a Great Story Title
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <section className="rounded-[12px] bg-white p-5 shadow-sm">
          <div className="text-[18px] font-bold leading-7 text-[#111827]">
            A strong title makes the right reader curious.
          </div>
          <p className="mt-2 text-[13px] leading-6 text-[#667085]">
            Your title does not need to explain everything. It only needs to capture the story’s feeling and invite readers to open it.
          </p>
        </section>

        <section className="mt-4 space-y-3">
          {titleTips.map((tip, index) => (
            <article key={tip.title} className="rounded-[12px] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2eeff] text-[12px] font-bold text-[#6f5bc7]">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-[#111827]">{tip.title}</h2>
                  <p className="mt-1 text-[13px] leading-6 text-[#667085]">{tip.body}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">Title Idea Formulas</h2>
          <div className="mt-3 space-y-2">
            {titleFormulas.map((formula) => (
              <div key={formula} className="rounded-[10px] bg-[#f7f7fa] px-3 py-3 text-[13px] leading-5 text-[#555b66]">
                {formula}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">Before You Decide</h2>
          <div className="mt-3 space-y-2 text-[13px] leading-6 text-[#667085]">
            <p>Does the title fit the story?</p>
            <p>Is it easy to understand and remember?</p>
            <p>Does it create curiosity?</p>
            <p>Does it sound different from common titles?</p>
          </div>
        </section>
      </main>
    </div>
  )
}

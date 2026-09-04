import { useNavigate } from 'react-router-dom'

const writingSteps = [
  {
    title: 'Begin with an Interesting Hook',
    body: 'Start with a sentence that creates emotion, mystery, tension, or curiosity. Give readers an immediate reason to keep reading.',
  },
  {
    title: 'Introduce the Main Character',
    body: 'Show who the story follows, what they want, what they fear, and what is about to change their life. Keep the focus on the main character.',
  },
  {
    title: 'Show the Main Conflict',
    body: 'Explain the biggest problem standing between the character and their goal. Give enough information to understand the struggle without revealing the solution.',
  },
  {
    title: 'Make the Stakes Clear',
    body: 'Help readers understand what the character could lose. The stakes may involve love, family, freedom, identity, safety, reputation, or an important dream.',
  },
  {
    title: 'Match the Story’s Mood',
    body: 'Use words that feel like the story. Romance can sound emotional, thrillers can feel tense, fantasy can feel magical, and comedy can sound playful.',
  },
  {
    title: 'End with Curiosity',
    body: 'Finish with a difficult choice, hidden truth, uncertain future, or unanswered question that makes readers want to open the first episode.',
  },
]

const commonMistakes = [
  'Listing every event in the story',
  'Introducing too many characters',
  'Revealing the ending or major twists',
  'Using only vague words such as interesting or exciting',
  'Writing so much that the main idea becomes unclear',
]

const finalChecks = [
  'Does the first sentence create curiosity?',
  'Is the main character clear?',
  'Is the central conflict easy to understand?',
  'Are the stakes meaningful?',
  'Does the description match the story’s mood?',
  'Did you avoid important spoilers?',
]

export default function StoryDescriptionGuidePage() {
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
            How to Write a Great Story Description
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <section className="rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[18px] font-bold leading-7 text-[#111827]">
            Give readers a reason to open your story.
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#667085]">
            A strong description does not explain everything. It introduces the heart of the story, creates curiosity, and promises the kind of experience waiting inside.
          </p>
        </section>

        <section className="mt-4 space-y-3">
          {writingSteps.map((step, index) => (
            <article key={step.title} className="rounded-[12px] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2eeff] text-[12px] font-bold text-[#6f5bc7]">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-[#111827]">{step.title}</h2>
                  <p className="mt-1 text-[13px] leading-6 text-[#667085]">{step.body}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">A Simple Description Formula</h2>
          <div className="mt-3 rounded-[10px] bg-[#f7f7fa] px-4 py-4 text-[13px] font-medium leading-6 text-[#555b66]">
            Hook + Main character and goal + Central conflict + Stakes or an unanswered question
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">Example</h2>
          <p className="mt-3 text-[13px] leading-6 text-[#667085]">
            After losing everything in one night, Mira returns to the city she swore she would never see again. Her only goal is to uncover the truth behind her brother’s disappearance, but every clue leads back to Adrian—the man who once broke her heart. As old feelings return and dangerous secrets begin to surface, Mira must decide whether trusting him will bring her closer to the truth or destroy her all over again.
          </p>
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">Avoid These Common Mistakes</h2>
          <div className="mt-3 space-y-2">
            {commonMistakes.map((item) => (
              <div key={item} className="flex items-start gap-2 text-[13px] leading-6 text-[#667085]">
                <i className="fa-solid fa-xmark mt-[6px] text-[10px] text-[#e5484d]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">Before You Save</h2>
          <div className="mt-3 space-y-2">
            {finalChecks.map((item) => (
              <div key={item} className="flex items-start gap-2 text-[13px] leading-6 text-[#667085]">
                <i className="fa-solid fa-check mt-[6px] text-[10px] text-[#16803c]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-white p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[#111827]">Final Tip</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#667085]">
            A good description is not a full summary. It is a promise of the emotion, conflict, and experience waiting inside the story.
          </p>
        </section>
      </main>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

const GUIDE_SECTIONS = [
  {
    title: '1. What is a Gift?',
    body: [
      'A Gift is a way for readers to show support and encouragement to the authors they love.',
      'If you enjoy a story or an episode, you can send a Gift to let the author know that their work means something to you.',
    ],
  },
  {
    title: '2. What can I use to send Gifts?',
    body: [
      'On Shadow, Gifts can be sent using Coins or Diamonds.',
      'Coins are for simple and small support gifts. Diamonds are for special gifts or stronger support.',
      'Each Gift has a different value, so you can choose the Gift you like based on the Coins or Diamonds you have.',
    ],
  },
  {
    title: '3. How do Gifts help?',
    body: [
      'Gifts help encourage authors to keep writing, create new episodes, and continue improving their stories.',
      'A Gift is not just a reward icon. It is a small message of support from the reader to the author.',
    ],
  },
  {
    title: '4. How do I send a Gift?',
    body: [
      'You can send a Gift from the reading page or at the end of an episode.',
      'Choose a Gift, choose the quantity, then tap Gift.',
    ],
  },
  {
    title: '5. Gift Ranking / Top Fans',
    body: [
      'Gifts may help show which stories or episodes receive strong support from readers.',
      'Readers who send Gifts may also appear in Top Fans, showing their support for the stories and authors they love.',
    ],
  },
  {
    title: '6. Important Note',
    body: [
      'Please send Gifts only when you truly want to support an author.',
      'Reading, liking, and writing comments are also meaningful ways to support authors.',
    ],
  },
  {
    title: '7. All rights reserved by Shadow.',
    body: [
      'All gift rules and gift features are managed by Shadow.',
      'Shadow reserves the right to update or adjust gift features when necessary.',
    ],
  },
]

export default function GiftGuidePage() {
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <main className="min-h-screen bg-white pb-8 text-[#111827]">
      <header className="sticky top-0 z-20 border-b border-[#eef1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[620px] items-center px-4">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <h1 className="min-w-0 flex-1 pr-10 text-center text-[18px] font-bold text-[#111827]">
            How to send gifts
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-[620px] px-5 py-5">
        <div className="space-y-7">
          {GUIDE_SECTIONS.map((section) => (
            <article key={section.title}>
              <h2 className="text-[16px] font-bold leading-6 text-[#111827]">
                {section.title}
              </h2>

              <div className="mt-2 space-y-2 text-[15px] font-normal leading-7 text-[#111827]">
                {section.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={goBack}
          className="mt-8 h-11 w-full rounded-full bg-[#111827] text-[14px] font-bold text-white active:scale-95"
        >
          Back
        </button>
      </section>
    </main>
  )
}

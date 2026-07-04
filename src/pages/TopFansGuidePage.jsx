import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const GIFT_POINTS = [
  {
    key: 'candy',
    name: 'Candy',
    points: 1,
    image: '/assets/Gift/Candy.png',
  },
  {
    key: 'flower',
    name: 'Flower',
    points: 3,
    image: '/assets/Gift/Flower.png',
  },
  {
    key: 'coffee',
    name: 'Coffee',
    points: 5,
    image: '/assets/Gift/Coffee.png',
  },
  {
    key: 'magic_pen',
    name: 'Magic Pen',
    points: 10,
    image: '/assets/Gift/Magic Pen.png',
  },
  {
    key: 'gold_book',
    name: 'Gold Book',
    points: 20,
    image: '/assets/Gift/Gold Book.png',
  },
  {
    key: 'star',
    name: 'Shadow Star',
    points: 35,
    image: '/assets/Gift/Star.png',
  },
  {
    key: 'crown',
    name: 'Author Crown',
    points: 60,
    image: '/assets/Gift/Crown.png',
  },
  {
    key: 'rocket',
    name: 'Rocket',
    points: 100,
    image: '/assets/Gift/Rocket.png',
  },
]

function InfoSection({ number, title, children }) {
  return (
    <section className="border-b border-[#eef1f5] px-4 py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1f5] text-[12px] font-bold text-[#ff3b5f]">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-[#111827]">{title}</h2>
          <div className="mt-2 text-[13px] font-normal leading-6 text-[#667085]">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function TopFansGuidePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()

  const [story, setStory] = useState(location.state?.storyPreview || null)

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      if (!storyId) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${storyId}`)
        const data = await response.json().catch(() => ({}))

        if (!ignore && response.ok && data.story) {
          setStory(data.story)
        }
      } catch {
      }
    }

    if (!story?.id) loadStory()

    return () => {
      ignore = true
    }
  }, [storyId, story?.id])

  return (
    <main className="min-h-screen bg-[#f7f7f9]">
      <header className="sticky top-0 z-30 border-b border-[#eef1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[17px] font-bold text-[#111827]">
            How Top Fans Works
          </h1>

          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl pb-10">
        <section className="bg-white px-4 pb-5 pt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f5] text-[#ff3b5f]">
            <i className="fa-solid fa-ranking-star text-[19px]" />
          </div>

          <h2 className="mt-3 text-[18px] font-bold text-[#111827]">
            Top Fans Guide
          </h2>

          <p className="mx-auto mt-1 max-w-[420px] text-[13px] font-normal leading-5 text-[#98a2b3]">
            Learn how gifts and support points work for{' '}
            <span className="font-medium text-[#667085]">
              {story?.title || 'this story'}
            </span>.
          </p>
        </section>

        <div className="mt-3 bg-white">
          <InfoSection number="1" title="What are Top Fans?">
            <p>
              Top Fans is a ranking of readers who send gifts and give the most
              support to this story. Every gift adds Support Points to your
              ranking total.
            </p>
          </InfoSection>

          <InfoSection number="2" title="Support belongs to this story only">
            <p>
              Gifts and Support Points shown on this page count only for this
              story. They are not transferred to another story or to the
              author&apos;s overall page.
            </p>
          </InfoSection>

          <InfoSection number="3" title="Weekly Ranking">
            <p>
              Weekly Ranking counts Support Points earned during the current
              week. A new weekly ranking starts every Monday.
            </p>

            <p className="mt-2">
              Your gift history remains saved even when the weekly ranking
              starts again.
            </p>
          </InfoSection>

          <InfoSection number="4" title="Overall Ranking">
            <p>
              Overall Ranking combines every Support Point a reader has earned
              for this story. It does not reset each week.
            </p>
          </InfoSection>

          <InfoSection number="5" title="Gift Points">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GIFT_POINTS.map((gift) => (
                <div
                  key={gift.key}
                  className="flex items-center gap-2 rounded-[14px] border border-[#eef1f5] bg-[#fafafa] px-2.5 py-2.5"
                >
                  <img
                    src={gift.image}
                    alt=""
                    className="h-9 w-9 shrink-0 object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-medium text-[#111827]">
                      {gift.name}
                    </div>

                    <div className="mt-0.5 text-[12px] font-bold text-[#ff3b5f]">
                      {gift.points} {gift.points === 1 ? 'point' : 'points'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoSection>

          <InfoSection number="6" title="How points are calculated">
            <div className="rounded-[14px] bg-[#f5f3fa] px-3 py-3 text-center text-[13px] font-bold text-[#111827]">
              Support Points = Gift Points × Quantity
            </div>

            <div className="mt-3 space-y-1.5">
              <p>Candy × 5 = 5 Support Points</p>
              <p>Magic Pen × 3 = 30 Support Points</p>
              <p>Rocket × 1 = 100 Support Points</p>
            </div>
          </InfoSection>

          <InfoSection number="7" title="When two readers have the same score">
            <p>
              If two readers have the same number of Support Points, the reader
              who reached that score first will appear higher in the ranking.
            </p>
          </InfoSection>
        </div>

        <div className="mx-4 mt-4 rounded-[16px] bg-[#fff1f5] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info mt-0.5 text-[14px] text-[#ff3b5f]" />

            <p className="text-[12px] font-normal leading-5 text-[#667085]">
              Support Points are used for ranking only. They are not Coins or
              Diamonds and cannot be spent or exchanged.
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[11px] font-normal text-[#b0b7c3]">
          All rights reserved by Shadow.
        </p>
      </div>
    </main>
  )
}

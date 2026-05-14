import { useNavigate, useParams } from 'react-router-dom'

function ReaderLine({ children }) {
  return (
    <p className="mb-5 text-[16px] leading-8 text-[#2a2f3a]">
      {children}
    </p>
  )
}

export default function EpisodePreviewPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const preview = {
    storyTitle: 'Name Novel',
    episodeTitle: 'Name Episode',
    cover: '',
    isAdult: false,
    characters: '8,420',
    readTime: '12 min read',
  }

  const handleBackToPublish = () => {
    navigate(`/author/story/${storyId}/episode/publish`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[90px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={handleBackToPublish}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Episode Preview</h1>

          <button
            type="button"
            onClick={handleBackToPublish}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
          >
            Done
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-4">
        <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="aspect-[16/9] bg-[#111827]">
            {preview.cover ? (
              <img src={preview.cover} alt={preview.episodeTitle} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center text-white">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <i className="fa-regular fa-image text-[18px]" />
                  </div>
                  <div className="mt-3 text-[13px] font-extrabold">Episode Cover Preview</div>
                  <div className="mt-1 text-[11px] text-white/60">Story cover will be used if no episode cover</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#8d94a1]">
              {preview.storyTitle}
            </div>

            <h2 className="mt-1 text-[22px] font-extrabold leading-7 text-[#111827]">
              {preview.episodeTitle}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {preview.isAdult ? (
                <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                  18+ Episode
                </span>
              ) : null}

              <span className="rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11px] font-bold text-[#555b66]">
                {preview.characters} characters
              </span>

              <span className="rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11px] font-bold text-[#555b66]">
                {preview.readTime}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[26px] bg-white px-5 py-6 shadow-sm ring-1 ring-black/5">
          <div className="mb-5 rounded-[18px] bg-[#fafafe] px-4 py-3 text-[12px] font-bold leading-5 text-[#667085]">
            This is a reader-style preview. Final spacing may change slightly depending on device and reader settings.
          </div>

          <article className="rounded-[22px] bg-[#fffdf8] px-4 py-6 shadow-inner ring-1 ring-[#f0eadc] md:px-8 md:py-8">
            <ReaderLine>
              The room was quiet, but the silence did not feel empty.
            </ReaderLine>

            <ReaderLine>
              It felt like something was waiting between the walls, breathing softly with the night.
            </ReaderLine>

            <ReaderLine>
              She held the edge of the letter with trembling fingers, reading the same sentence again and again, as if the words might change if her heart begged long enough.
            </ReaderLine>

            <ReaderLine>
              Outside the window, the city lights blurred into gold. Somewhere far below, people were still laughing, still walking, still living as if the world had not just ended for her.
            </ReaderLine>

            <ReaderLine>
              “I should have known,” she whispered.
            </ReaderLine>

            <ReaderLine>
              But the truth was simple. She had known. She had seen goodbye before it arrived.
            </ReaderLine>
          </article>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
          <button
            type="button"
            onClick={handleBackToPublish}
            className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleBackToPublish}
            className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99]"
          >
            Continue Publish
          </button>
        </section>
      </main>
    </div>
  )
}

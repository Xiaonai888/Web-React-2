import { useEffect, useMemo, useState } from 'react'

function normalizeSlides(story) {
  const slides = Array.isArray(story?.slides)
    ? story.slides
        .filter((slide) => slide?.image_url)
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
        .slice(0, 5)
    : []

  if (slides.length) return slides

  if (story?.cover_url) {
    return [{ id: 'cover-fallback', image_url: story.cover_url, sort_order: 0 }]
  }

  return []
}

export default function StoryHeroSection({ story, onBack, bookmarked, onToggleBookmark }) {
  const slides = useMemo(() => normalizeSlides(story), [story])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex] || slides[0] || null

  useEffect(() => {
    setActiveIndex(0)
  }, [story?.id])

  useEffect(() => {
    if (slides.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative bg-[#111827]">
      <div className="sticky top-0 z-50 bg-black/20 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/15 active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 px-4 text-center">
            <h1 className="line-clamp-1 text-[15px] font-black text-white">{story?.title || 'Story'}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/15 active:scale-95 ${
                bookmarked ? 'bg-white text-[#111827]' : 'bg-white/14 text-white'
              }`}
              aria-label="Add to library"
            >
              <i className={`${bookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-[15px]`} />
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/15 active:scale-95"
              aria-label="More"
            >
              <i className="fa-solid fa-ellipsis text-[16px]" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative min-h-[430px] overflow-hidden sm:min-h-[520px]">
        <div className="absolute inset-0">
          {activeSlide?.image_url ? (
            <img
              key={activeSlide.image_url}
              src={activeSlide.image_url}
              alt={story?.title || 'Story slide'}
              className="h-full w-full object-cover opacity-90 transition-opacity duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#312e81]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f5f3fa] via-black/25 to-black/25" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-10 pt-[230px] text-center sm:pt-[300px]">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
              {story?.story_language || 'Khmer'}
            </span>
            <span className="rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
              {story?.main_genre || 'Novel'}
            </span>
            {story?.is_adult ? (
              <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                18+
              </span>
            ) : null}
          </div>

          <h2 className="max-w-[780px] text-[30px] font-black leading-[38px] text-white drop-shadow sm:text-[42px] sm:leading-[50px]">
            {story?.title || 'Untitled Story'}
          </h2>

          {slides.length > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id || slide.image_url || index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index ? 'w-7 bg-white' : 'w-2.5 bg-white/45'
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

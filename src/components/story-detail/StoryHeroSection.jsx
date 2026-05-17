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

function getStoryStatus(story) {
  return story?.story_status || story?.storyStatus || 'New'
}

export default function StoryHeroSection({ story, onBack, bookmarked, onToggleBookmark }) {
  const slides = useMemo(() => normalizeSlides(story), [story])
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTitleBar, setShowTitleBar] = useState(false)
  const activeSlide = slides[activeIndex] || slides[0] || null
  const storyStatus = getStoryStatus(story)
  const infoLine = `${story?.main_genre || 'Novel'} / ${storyStatus}`

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

  useEffect(() => {
    const handleScroll = () => {
      setShowTitleBar(window.scrollY > 260)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMenuOpen(false)
    } catch {
      setMenuOpen(false)
    }
  }

  const handleEcho = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: story?.title || 'Story',
          text: story?.title || 'Story',
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }

      setMenuOpen(false)
    } catch {
      setMenuOpen(false)
    }
  }

  return (
    <section className="relative bg-[#f5f3fa]">
      <div
  className={`fixed left-0 right-0 top-0 z-50 px-4 py-3 transition-all duration-300 ${
    showTitleBar ? 'bg-white shadow-sm' : 'bg-transparent'
  }`}
>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`flex h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
  showTitleBar
    ? 'bg-transparent text-[#111827]'
    : 'bg-transparent text-white'
}`}
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1
  className={`min-w-0 flex-1 truncate text-left text-[18px] font-extrabold transition-opacity duration-300 ${
    showTitleBar ? 'text-[#111827] opacity-100' : 'text-white opacity-0'
  }`}
>
            {story?.title || 'Story'}
          </h1>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`flex h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
  showTitleBar
    ? 'bg-transparent text-[#111827]'
    : 'bg-transparent text-white'
}`}
              aria-label="Add to library"
            >
              <i className={`${bookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-[15px]`} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
               className={`flex h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
  showTitleBar
    ? 'bg-transparent text-[#111827]'
    : 'bg-transparent text-white'
}`}
                aria-label="More"
              >
                <i className="fa-solid fa-ellipsis text-[16px]" />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-12 z-[80] w-44 overflow-hidden rounded-[18px] bg-white text-[#111827] shadow-[0_18px_46px_rgba(17,24,39,0.22)] ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-extrabold hover:bg-[#f5f3fa]"
                  >
                    <i className="fa-regular fa-flag w-4 text-[#8d94a1]" />
                    Report
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-extrabold hover:bg-[#f5f3fa]"
                  >
                    <i className="fa-solid fa-link w-4 text-[#8d94a1]" />
                    Copy link
                  </button>

                  <button
                    type="button"
                    onClick={handleEcho}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-extrabold hover:bg-[#f5f3fa]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f2f4f7]">
  <img
  src="/assets/Icons/echo.svg"
  alt="Echo"
  className="h-[15px] w-[15px]"
/>
</span>
                    Echo
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[56.25vw] min-h-[200px] max-h-[520px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {activeSlide?.image_url ? (
            <img
              key={activeSlide.image_url}
              src={activeSlide.image_url}
              alt={story?.title || 'Story slide'}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#312e81]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/18 to-black/25" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f5f3fa] to-transparent" />
        </div>

        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14 sm:pb-14">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1 text-left">
              <h2 className="line-clamp-2 text-[26px] font-black leading-[34px] text-white drop-shadow sm:text-[38px] sm:leading-[46px]">
                {story?.title || 'Untitled Story'}
              </h2>

              <div className="mt-2 text-[13px] font-extrabold text-white/90 drop-shadow sm:text-[15px]">
                {infoLine}
              </div>
            </div>

            {slides.length > 1 ? (
              <div className="mb-1 flex shrink-0 items-center justify-end gap-1.5">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id || slide.image_url || index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === index ? 'w-7 bg-white' : 'w-2.5 bg-white/55'
                    }`}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

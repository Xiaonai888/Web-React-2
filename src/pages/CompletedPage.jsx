import React, { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { completedTabs, completedQuotes, completedData } from '../../Demo/CompletedDemoPage'

function QuoteLine({ activeTab }) {
  return (
    <div className="mb-4 px-1">
      <p className="text-[13px] font-medium text-gray-500">
        {completedQuotes[activeTab]}
      </p>
    </div>
  )
}

function Dots({ count, activeIndex, onDotClick }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex
        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              isActive
                ? 'h-2.5 w-6 bg-black'
                : 'h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        )
      })}
    </div>
  )
}

function SlideCards({ books }) {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Link key={book.id} to={book.link}>
          <div className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-gray-50">
            <div className="relative shrink-0 w-[80px] h-[112px] overflow-hidden rounded-xl shadow-sm bg-gray-100">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                loading="lazy"
              />

              {book.freePreview && (
                <div className="absolute left-1.5 top-1.5 rounded-full bg-white/92 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-neutral-900 shadow-sm">
                  FREE PREVIEW
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 py-1">
              <h3 className="line-clamp-2 text-[16px] font-extrabold tracking-tight text-[#1f4f8c]">
                {book.title}
              </h3>

              <p className="mt-0.5 text-[13px] font-medium text-gray-500">
                {book.author}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px]">
                <div className="flex items-center gap-1 text-gray-600">
                  <i className="fas fa-eye text-[13px]" />
                  <span>{book.views}</span>
                </div>

                <div className="flex items-center gap-1">
                  <i className="fas fa-heart text-red-500 text-[13px]" />
                  <span className="text-gray-600">{book.likes}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-600">
                  <i className="fas fa-list text-[13px]" />
                  <span>{book.episodes}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[13px] text-gray-600">
                <i className="fas fa-star text-yellow-400 text-[13px]" />
                <span>{book.rating}</span>
                <span>({book.ratingCount})</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {book.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-gray-600">
                {book.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function CompletedPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Hot')
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollRef = useRef(null)

  const books = useMemo(() => {
    return completedData[activeTab] || []
  }, [activeTab])

  const slides = useMemo(() => {
    const chunks = []
    for (let i = 0; i < books.length; i += 3) {
      chunks.push(books.slice(i, i + 3))
    }
    return chunks
  }, [books])

  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth = container.offsetWidth
    const currentIndex = Math.round(container.scrollLeft / slideWidth)
    setActiveSlide(currentIndex)
  }

  const scrollToIndex = (index) => {
    const container = scrollRef.current
    if (!container) return

    const slideWidth = container.offsetWidth
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth',
    })

    setActiveSlide(index)
  }

  const handleMouseDown = (e) => {
    const container = scrollRef.current
    if (!container) return

    isDraggingRef.current = true
    startXRef.current = e.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
  }

  const handleMouseMove = (e) => {
    const container = scrollRef.current
    if (!container || !isDraggingRef.current) return

    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = x - startXRef.current
    container.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
  }

  React.useEffect(() => {
    setActiveSlide(0)
    const container = scrollRef.current
    if (container) {
      container.scrollTo({ left: 0, behavior: 'auto' })
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="h-14 flex items-center px-4 gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[20px]">😁</span>
            <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
              Completed
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {completedTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <QuoteLine activeTab={activeTab} />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {slides.map((group, index) => (
            <div key={index} className="w-full shrink-0 snap-start">
              <SlideCards books={group} />
            </div>
          ))}
        </div>

        <Dots count={slides.length} activeIndex={activeSlide} onDotClick={scrollToIndex} />
      </main>
    </div>
  )
}

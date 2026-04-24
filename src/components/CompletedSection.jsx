import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completedTabs, completedQuotes, completedData } from '../../Demo/CompletedDemoPage'

function QuoteLine({ activeTab }) {
  return (
    <div className="mb-4 px-1">
      <p className="text-[12px] font-medium text-gray-500 sm:text-[13px]">
        {completedQuotes[activeTab]}
      </p>
    </div>
  )
}

function Dots({ count, activeIndex, onDotClick }) {
  if (count <= 1) return null

  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex

        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              isActive ? 'bg-blue-600' : 'bg-black'
            }`}
          />
        )
      })}
    </div>
  )
}

function InfoRow({ book }) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold sm:text-[11px] lg:text-[12px]">
      <div className="flex items-center gap-1 text-blue-700">
        <i className="fas fa-eye text-[10px] text-black sm:text-[11px]" />
        <span>{book.views}</span>
      </div>

      <div className="flex items-center gap-1 text-red-500">
        <i className="fas fa-heart text-[10px] sm:text-[11px]" />
        <span className="text-black">{book.likes}</span>
      </div>

      <div className="flex items-center gap-1 text-blue-700">
        <i className="fas fa-list text-[10px] text-black sm:text-[11px]" />
        <span>{book.episodes}</span>
      </div>

      <div className="flex items-center gap-1 text-blue-700">
        <i className="fas fa-star text-[10px] text-yellow-400 sm:text-[11px]" />
        <span>{book.rating}</span>
        <span className="text-neutral-700">({book.ratingCount})</span>
      </div>
    </div>
  )
}

function SlideCards({ books, onBookClick }) {
  return (
    <div className="space-y-5">
      {books.map((book) => (
        <button
          key={book.id}
          type="button"
          onClick={() => onBookClick(book.link)}
          className="group w-full text-left"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:bg-gray-50 sm:gap-4 sm:p-4">
            <div className="relative w-[82px] shrink-0 overflow-hidden rounded-xl bg-neutral-200 shadow-sm sm:w-[96px]">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="line-clamp-1 text-[15px] font-extrabold leading-tight tracking-tight text-[#0646c8] sm:text-[17px]">
                {book.title}
              </h3>

              <p className="mt-0.5 line-clamp-1 text-[11px] font-bold text-neutral-700 sm:text-[13px]">
                {book.author}
              </p>

              <InfoRow book={book} />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {book.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-[#efefef] px-2 py-0.5 text-[9px] font-medium text-neutral-500 sm:text-[10px]"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-neutral-800 sm:text-[12px] sm:leading-5">
                {book.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default function CompletedSection() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(completedTabs[0])
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

  const stopDragging = () => {
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
    <section className="px-4 pb-8 pt-8 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">😁</span>
            <h2 className="text-[20px] font-extrabold tracking-tight text-neutral-950 sm:text-[24px]">
              Completed
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/completed')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition hover:bg-black/5 sm:h-10 sm:w-10"
            aria-label="Go to Completed page"
          >
            <i className="fas fa-chevron-right text-[18px] sm:text-[20px]" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {completedTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-medium transition sm:text-[15px] ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50'
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
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth cursor-grab select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((group, index) => (
            <div key={index} className="w-full shrink-0 snap-start">
              <SlideCards books={group} onBookClick={(link) => navigate(link)} />
            </div>
          ))}
        </div>

        <Dots count={slides.length} activeIndex={activeSlide} onDotClick={scrollToIndex} />
      </div>
    </section>
  )
}

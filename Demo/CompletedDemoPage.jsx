import React, { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const completedTabs = ['Hot', 'Popular', 'Highlight']

export const completedQuotes = {
  Hot: 'Freshly completed stories',
  Popular: 'Most-read completed stories',
  Highlight: 'Hidden gems with free Ep. 1 preview',
}

export const completedData = {
  Hot: [
    {
      id: 501,
      title: 'Name book',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 1.jpg',
      views: '100k',
      likes: '1000',
      episodes: 'Ep 17',
      rating: '4.5',
      ratingCount: '887',
      genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
      description: 'After looking around, I saw that there were monsters moving towards me. This time, it wasn’t just humans anymore, but all kinds of monsters and zombie plants.',
      link: '/story/501',
      freePreview: false,
    },
    {
      id: 502,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 2.jpg',
      views: '96k',
      likes: '920',
      episodes: 'Ep 21',
      rating: '4.4',
      ratingCount: '761',
      genres: ['Romance', 'Fantasy'],
      description: 'A newly completed story with a strong emotional finish and fast reader momentum.',
      link: '/story/502',
      freePreview: false,
    },
    {
      id: 503,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 3.jpg',
      views: '89k',
      likes: '840',
      episodes: 'Ep 19',
      rating: '4.6',
      ratingCount: '902',
      genres: ['Action', 'Drama'],
      description: 'Freshly completed and already drawing attention from readers who want a full story to binge.',
      link: '/story/503',
      freePreview: false,
    },
    {
      id: 504,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 4.jpg',
      views: '82k',
      likes: '780',
      episodes: 'Ep 18',
      rating: '4.3',
      ratingCount: '655',
      genres: ['Comedy', 'Romance'],
      description: 'A recently finished title with a lighter tone and a satisfying ending.',
      link: '/story/504',
      freePreview: false,
    },
    {
      id: 505,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 5.jpg',
      views: '79k',
      likes: '730',
      episodes: 'Ep 22',
      rating: '4.2',
      ratingCount: '601',
      genres: ['Fantasy', 'Action'],
      description: 'Completed this week and worth exploring if you enjoy fantasy with momentum.',
      link: '/story/505',
      freePreview: false,
    },
    {
      id: 506,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 6.jpg',
      views: '74k',
      likes: '690',
      episodes: 'Ep 16',
      rating: '4.1',
      ratingCount: '577',
      genres: ['Drama', 'Mystery'],
      description: 'A finished mystery story with a clean final arc and strong pacing.',
      link: '/story/506',
      freePreview: false,
    },
    {
      id: 507,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 7.jpg',
      views: '70k',
      likes: '650',
      episodes: 'Ep 20',
      rating: '4.4',
      ratingCount: '688',
      genres: ['Romance', 'Drama'],
      description: 'Newly completed and quietly building reader interest through emotional storytelling.',
      link: '/story/507',
      freePreview: false,
    },
    {
      id: 508,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 8.jpg',
      views: '67k',
      likes: '620',
      episodes: 'Ep 14',
      rating: '4.0',
      ratingCount: '540',
      genres: ['Fantasy', 'Drama'],
      description: 'A finished title for readers who prefer mood and worldbuilding over speed.',
      link: '/story/508',
      freePreview: false,
    },
    {
      id: 509,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 9.jpg',
      views: '63k',
      likes: '590',
      episodes: 'Ep 15',
      rating: '4.3',
      ratingCount: '612',
      genres: ['Action', 'Fantasy'],
      description: 'Recently completed and good for readers who want a full action arc immediately.',
      link: '/story/509',
      freePreview: false,
    },
  ],

  Popular: [
    {
      id: 510,
      title: 'Name book',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 1.jpg',
      views: '320k',
      likes: '4.8k',
      episodes: 'Ep 34',
      rating: '4.8',
      ratingCount: '2.4k',
      genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
      description: 'One of the most-read completed stories on the platform with strong reader retention.',
      link: '/story/510',
      freePreview: false,
    },
    {
      id: 511,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 2.jpg',
      views: '288k',
      likes: '4.2k',
      episodes: 'Ep 29',
      rating: '4.7',
      ratingCount: '2.0k',
      genres: ['Romance', 'Fantasy'],
      description: 'A completed favorite that consistently performs well among binge readers.',
      link: '/story/511',
      freePreview: false,
    },
    {
      id: 512,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 3.jpg',
      views: '260k',
      likes: '3.9k',
      episodes: 'Ep 26',
      rating: '4.6',
      ratingCount: '1.8k',
      genres: ['Action', 'Drama'],
      description: 'Highly read and widely recommended, with a complete arc that readers finish fast.',
      link: '/story/512',
      freePreview: false,
    },
    {
      id: 513,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 4.jpg',
      views: '240k',
      likes: '3.5k',
      episodes: 'Ep 25',
      rating: '4.5',
      ratingCount: '1.6k',
      genres: ['Comedy', 'Romance'],
      description: 'Popular among readers looking for a lighter completed series with re-read value.',
      link: '/story/513',
      freePreview: false,
    },
    {
      id: 514,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 5.jpg',
      views: '226k',
      likes: '3.2k',
      episodes: 'Ep 23',
      rating: '4.4',
      ratingCount: '1.4k',
      genres: ['Fantasy', 'Action'],
      description: 'A strong-performing fantasy title with solid engagement even after completion.',
      link: '/story/514',
      freePreview: false,
    },
    {
      id: 515,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 6.jpg',
      views: '210k',
      likes: '3.0k',
      episodes: 'Ep 22',
      rating: '4.5',
      ratingCount: '1.5k',
      genres: ['Drama', 'Mystery'],
      description: 'Popular for its ending and for how well the complete experience flows in one read.',
      link: '/story/515',
      freePreview: false,
    },
    {
      id: 516,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 7.jpg',
      views: '198k',
      likes: '2.7k',
      episodes: 'Ep 20',
      rating: '4.3',
      ratingCount: '1.2k',
      genres: ['Romance', 'Drama'],
      description: 'One of the stronger completed emotional series by overall reads this month.',
      link: '/story/516',
      freePreview: false,
    },
    {
      id: 517,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 8.jpg',
      views: '185k',
      likes: '2.5k',
      episodes: 'Ep 19',
      rating: '4.2',
      ratingCount: '1.1k',
      genres: ['Fantasy', 'Drama'],
      description: 'A popular finished title with dependable engagement and strong chapter completion.',
      link: '/story/517',
      freePreview: false,
    },
    {
      id: 518,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 9.jpg',
      views: '172k',
      likes: '2.3k',
      episodes: 'Ep 18',
      rating: '4.4',
      ratingCount: '1.3k',
      genres: ['Action', 'Fantasy'],
      description: 'A high-read completed action title that still attracts readers after ending.',
      link: '/story/518',
      freePreview: false,
    },
  ],

  Highlight: [
    {
      id: 519,
      title: 'Name book',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 1.jpg',
      views: '12k',
      likes: '180',
      episodes: 'Ep 17',
      rating: '4.4',
      ratingCount: '148',
      genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
      description: 'An overlooked completed story selected by admin for more visibility and a free first taste.',
      link: '/story/519',
      freePreview: true,
    },
    {
      id: 520,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 2.jpg',
      views: '11k',
      likes: '165',
      episodes: 'Ep 21',
      rating: '4.3',
      ratingCount: '136',
      genres: ['Romance', 'Fantasy'],
      description: 'A quiet completed title with strong potential for readers who enjoy softer fantasy stories.',
      link: '/story/520',
      freePreview: true,
    },
    {
      id: 521,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 3.jpg',
      views: '10k',
      likes: '150',
      episodes: 'Ep 19',
      rating: '4.5',
      ratingCount: '142',
      genres: ['Action', 'Drama'],
      description: 'A hidden completed action-drama chosen to give readers something different to discover.',
      link: '/story/521',
      freePreview: true,
    },
    {
      id: 522,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 4.jpg',
      views: '9.8k',
      likes: '143',
      episodes: 'Ep 18',
      rating: '4.2',
      ratingCount: '119',
      genres: ['Comedy', 'Romance'],
      description: 'An underrated completed series with a light, charming tone and a free episode preview.',
      link: '/story/522',
      freePreview: true,
    },
    {
      id: 523,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 5.jpg',
      views: '9.4k',
      likes: '137',
      episodes: 'Ep 22',
      rating: '4.1',
      ratingCount: '112',
      genres: ['Fantasy', 'Action'],
      description: 'A less-seen fantasy title highlighted by admin to help readers find something new.',
      link: '/story/523',
      freePreview: true,
    },
    {
      id: 524,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 6.jpg',
      views: '9.1k',
      likes: '129',
      episodes: 'Ep 16',
      rating: '4.3',
      ratingCount: '121',
      genres: ['Drama', 'Mystery'],
      description: 'Completed and easy to miss, but worth trying if you enjoy mystery with a full ending.',
      link: '/story/524',
      freePreview: true,
    },
    {
      id: 525,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 7.jpg',
      views: '8.7k',
      likes: '124',
      episodes: 'Ep 20',
      rating: '4.4',
      ratingCount: '127',
      genres: ['Romance', 'Drama'],
      description: 'A completed emotional story that deserves more attention than its current reach suggests.',
      link: '/story/525',
      freePreview: true,
    },
    {
      id: 526,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 8.jpg',
      views: '8.3k',
      likes: '118',
      episodes: 'Ep 14',
      rating: '4.0',
      ratingCount: '101',
      genres: ['Fantasy', 'Drama'],
      description: 'An underrated completed title for readers who like slower builds and full arcs.',
      link: '/story/526',
      freePreview: true,
    },
    {
      id: 527,
      title: 'Name Novel',
      author: 'Author Name',
      cover: '/assets/CompletedPage/CompletedPage 9.jpg',
      views: '8.0k',
      likes: '111',
      episodes: 'Ep 15',
      rating: '4.2',
      ratingCount: '109',
      genres: ['Action', 'Fantasy'],
      description: 'A hidden gem selected to give readers one free episode before deciding to continue.',
      link: '/story/527',
      freePreview: true,
    },
  ],
}

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

function SlideCards({ books, enableLinks = true }) {
  return (
    <div className="space-y-4">
      {books.map((book) => {
        const content = (
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
        )

        if (!enableLinks) {
          return <div key={book.id}>{content}</div>
        }

        return (
          <Link key={book.id} to={book.link}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}

export default function CompletedDemoPage() {
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
    <div className="min-h-screen bg-white pb-24">
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
              Completed Demo
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
              <SlideCards books={group} enableLinks={true} />
            </div>
          ))}
        </div>

        <Dots count={slides.length} activeIndex={activeSlide} onDotClick={scrollToIndex} />
      </main>
    </div>
  )
}

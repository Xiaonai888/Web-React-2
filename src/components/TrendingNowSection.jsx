import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

const trendTabs = ['Daily', 'Weekly', 'Monthly']
const sortOptions = ['Likes', 'Views', 'Fans', 'Comments']

const trendingData = {
  Daily: [
    { id: 101, title: 'Crush Theory', likes: 100000, views: 920000, fans: 48000, comments: 20000, image: '' },
    { id: 102, title: 'The Actress Next Door', likes: 97000, views: 880000, fans: 45200, comments: 19300, image: '' },
    { id: 103, title: 'When the CEO Smiled', likes: 91000, views: 840000, fans: 43000, comments: 18800, image: '' },
    { id: 104, title: 'Shadow of Spring', likes: 88500, views: 799000, fans: 41500, comments: 17400, image: '' },
    { id: 105, title: 'My Hidden Villain', likes: 86200, views: 770000, fans: 39200, comments: 16800, image: '' },
    { id: 106, title: 'Kiss Before Midnight', likes: 84100, views: 742000, fans: 37800, comments: 16100, image: '' },
  ],
  Weekly: [
    { id: 201, title: 'Royal Betrothal', likes: 180000, views: 1450000, fans: 76000, comments: 34000, image: '' },
    { id: 202, title: 'My Cold-Hearted Prince', likes: 171000, views: 1390000, fans: 72100, comments: 32800, image: '' },
    { id: 203, title: 'The Last Summer Promise', likes: 165000, views: 1320000, fans: 70300, comments: 31500, image: '' },
    { id: 204, title: 'Her Dangerous Roommate', likes: 154000, views: 1265000, fans: 68200, comments: 29400, image: '' },
    { id: 205, title: 'Softly, Don’t Leave', likes: 149000, views: 1210000, fans: 65400, comments: 28100, image: '' },
    { id: 206, title: 'Second Chance Bride', likes: 141000, views: 1185000, fans: 63100, comments: 27600, image: '' },
  ],
  Monthly: [
    { id: 301, title: 'Empire of Roses', likes: 320000, views: 2800000, fans: 120000, comments: 59000, image: '' },
    { id: 302, title: 'Call Me Again Tomorrow', likes: 301000, views: 2650000, fans: 113000, comments: 55100, image: '' },
    { id: 303, title: 'Tears Under Neon Light', likes: 294000, views: 2540000, fans: 108400, comments: 53000, image: '' },
    { id: 304, title: 'The Fake Engagement', likes: 280000, views: 2440000, fans: 102300, comments: 50100, image: '' },
    { id: 305, title: 'Moon Over the City', likes: 268000, views: 2320000, fans: 97800, comments: 48600, image: '' },
    { id: 306, title: 'One More Time, My Love', likes: 251000, views: 2240000, fans: 94400, comments: 46200, image: '' },
  ],
}

function formatCount(value) {
  if (value >= 1000000) {
    const num = value / 1000000
    return `${Number.isInteger(num) ? num : num.toFixed(1)}M`
  }
  if (value >= 1000) {
    const num = value / 1000
    return `${Number.isInteger(num) ? num : num.toFixed(0)}k`
  }
  return String(value)
}

function SortIcon({ open = false }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-6.5-4.35-9.14-8.27C.62 9.47 2.15 5 6.42 5c2.15 0 3.41 1.14 4.12 2.2C11.25 6.14 12.51 5 14.66 5c4.27 0 5.8 4.47 3.56 7.73C18.5 16.65 12 21 12 21z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg className="h-4 w-4 text-[#222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
    </svg>
  )
}

function BlankCover() {
  return <div className="h-full w-full bg-[#202124]" />
}

function TrendingBookCard({ book }) {
  const hasImage = typeof book.image === 'string' && book.image.trim() !== ''

  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative aspect-[1.42/1] overflow-hidden rounded-[16px] bg-[#202124] shadow-sm">
        {hasImage ? (
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BlankCover />
        )}
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="truncate text-[16px] font-bold tracking-tight text-[#111] md:text-[17px]">
          {book.title}
        </h3>

        <div className="mt-2 flex items-center gap-4 text-[12px] text-[#222]">
          <span className="inline-flex items-center gap-1.5">
            <HeartIcon />
            <span>{formatCount(book.likes)}</span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CommentIcon />
            <span>{formatCount(book.comments)}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function TrendingNowSection() {
  const [activeTab, setActiveTab] = useState('Daily')
  const [sortBy, setSortBy] = useState('Likes')
  const [sortOpen, setSortOpen] = useState(false)

  const books = useMemo(() => {
    const list = [...trendingData[activeTab]]

    const keyMap = {
      Likes: 'likes',
      Views: 'views',
      Fans: 'fans',
      Comments: 'comments',
    }

    const sortKey = keyMap[sortBy]
    list.sort((a, b) => b[sortKey] - a[sortKey])

    return list
  }, [activeTab, sortBy])

  return (
    <section className="px-4 pb-2 pt-8 md:pt-10">
      <div className="flex items-center gap-2">
        <span className="text-[28px] leading-none">🔥</span>
        <h2 className="text-[20px] font-black uppercase tracking-tight text-[#111] md:text-[22px]">
          TRENDING NOW
        </h2>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 gap-2.5 overflow-x-auto no-scrollbar">
          {trendTabs.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full border px-6 py-2 text-[13px] font-medium transition-all md:px-5 md:py-1.5 md:text-[12px] ${
                  active
                    ? 'border-[#1840f5] bg-[#1840f5] text-white'
                    : 'border-[#d8d8d8] bg-transparent text-[#1c1c1c]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1c1c1c] md:text-[12px]"
          >
            <span>Sort by</span>
            <SortIcon open={sortOpen} />
          </button>

          {sortOpen ? (
            <div className="absolute right-0 top-10 z-20 w-[140px] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option)
                    setSortOpen(false)
                  }}
                  className={`block w-full px-4 py-3 text-left text-[13px] transition-colors ${
                    sortBy === option
                      ? 'bg-[#f4f6ff] font-bold text-[#1840f5]'
                      : 'text-[#222] hover:bg-[#f7f7f7]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-6 md:gap-x-5 md:gap-y-0">
        {books.map((book) => (
          <TrendingBookCard key={book.id} book={book} />
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

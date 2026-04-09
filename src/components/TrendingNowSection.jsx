// UPDATED TrendingNowSection.jsx (fixed image + clean)

import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

const trendTabs = ['Daily', 'Weekly', 'Monthly']
const sortOptions = ['Likes', 'Views', 'Fans', 'Comments']

// ✅ FIX: added real image path
const trendingData = {
  Daily: [
    { id: 101, title: 'Crush Theory', likes: 100000, views: 920000, fans: 48000, comments: 20000, image: '/assets/Trending%20Now/Trending%201.jpg' },
    { id: 102, title: 'The Actress Next Door', likes: 97000, views: 880000, fans: 45200, comments: 19300, image: '/assets/Trending%20Now/Trending%202.jpg' },
    { id: 103, title: 'When the CEO Smiled', likes: 91000, views: 840000, fans: 43000, comments: 18800, image: '/assets/Trending%20Now/Trending%203.jpg' },
    { id: 104, title: 'Shadow of Spring', likes: 88500, views: 799000, fans: 41500, comments: 17400, image: '/assets/Trending%20Now/Trending%204.jpg' },
    { id: 105, title: 'My Hidden Villain', likes: 86200, views: 770000, fans: 39200, comments: 16800, image: '/assets/Trending%20Now/Trending%205.jpg' },
    { id: 106, title: 'Kiss Before Midnight', likes: 84100, views: 742000, fans: 37800, comments: 16100, image: '/assets/Trending%20Now/Trending%206.jpg' },
  ],
}

function formatCount(value) {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
  if (value >= 1000) return Math.floor(value / 1000) + 'k'
  return value
}

function TrendingBookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block">

      {/* ✅ FIX: hover zoom like Shadow Exclusive */}
      <div className="relative aspect-[1.42/1] overflow-hidden rounded-[16px] bg-[#1f1f1f]">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-2 text-[14px] font-bold truncate">
        {book.title}
      </h3>

      <div className="flex gap-3 text-[12px] text-gray-500 mt-1">
        <span>❤️ {formatCount(book.likes)}</span>
        <span>💬 {formatCount(book.comments)}</span>
      </div>

    </Link>
  )
}

export default function TrendingNowSection() {
  const [activeTab, setActiveTab] = useState('Daily')

  const books = useMemo(() => {
    return trendingData[activeTab]
  }, [activeTab])

  return (
    <section className="px-4 pt-8">

      {/* Title */}
      <h2 className="text-[18px] font-black uppercase tracking-tight">
        🔥 TRENDING NOW
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mt-4">
        {trendTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full text-[12px] ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
        {books.map(book => (
          <TrendingBookCard key={book.id} book={book} />
        ))}
      </div>

    </section>
  )
}

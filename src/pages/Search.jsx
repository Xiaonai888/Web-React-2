import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['Trending Now', 'Popular', 'New Releases']

const RANK_STYLE = {
  1: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
  2: 'linear-gradient(135deg,#94a3b8,#64748b)',
  3: 'linear-gradient(135deg,#d97706,#b45309)',
}

const BOOKS_DATA = [
  { rank: 1, id: '1', title: 'The Girl Forgot Her Name', author: 'Jonathan Wick', likes: '24.5K', views: '1.2M' },
  { rank: 2, id: '2', title: 'We Loved at the Wrong Time', author: 'Sarah Drasner', likes: '18K', views: '850K' },
  { rank: 3, id: '3', title: 'Queen of the Silent War', author: 'Kim Young', likes: '12K', views: '400K' },
  { rank: 4, id: '4', title: 'System Error: I Fell in Love', author: 'Author Name', likes: '10K', views: '300K' },
  { rank: 5, id: '5', title: 'The Smile I Show You', author: 'Author Name', likes: '8K', views: '250K' },
  { rank: 6, id: '6', title: 'Omega Dragon', author: 'Author Name', likes: '7K', views: '200K' },
  { rank: 7, id: '7', title: 'The Actress, The Husband, and The Child', author: 'Author Name', likes: '5K', views: '150K' },
  { rank: 8, id: '8', title: 'Moonlight We Promised', author: 'Author Name', likes: '4K', views: '100K' },
  { rank: 9, id: '9', title: 'The Ringtone We Shared', author: 'Author Name', likes: '3K', views: '80K' },
  { rank: 10, id: '10', title: 'The Revenge', author: 'Author Name', likes: '2K', views: '50K' },
]

export default function Search() {
  const [activeTab, setActiveTab] = useState('Trending Now')
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const filteredBooks = BOOKS_DATA.filter((book) => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) return true

    return (
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword)
    )
  })

  return (
    <>
      <style>{`
        body { background:#f8fafc; font-family:'Plus Jakarta Sans','Kantumruy Pro',sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .book-card { transition:all 0.3s ease; border:1px solid #f1f5f9; }
        .book-card:hover { transform:translateY(-4px); box-shadow:0 12px 24px -8px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ paddingBottom: '80px' }}>
        <header className="sticky top-0 z-[100] border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-lg">
          <div className="mx-auto flex max-w-3xl items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <i className="fa-solid fa-chevron-left text-lg" />
            </button>

            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search Shadow..."
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 shadow-sm outline-none"
              />
            </div>
          </div>
        </header>

        <main className="mx-auto mt-6 max-w-3xl px-4">
          <nav className="no-scrollbar mb-8 flex space-x-8 overflow-x-auto border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-3 text-sm font-semibold text-gray-400 transition-all ${
                  activeTab === tab ? 'border-b-[3px] border-[#111827] font-black text-[#111827]' : ''
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div>
            <div className="mb-6 flex items-center space-x-3">
              <div className="h-6 w-1.5 rounded-full bg-[#111827]" />
              <h2 className="text-xl font-extrabold">{activeTab}</h2>
            </div>

            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <button
                  key={book.rank}
                  type="button"
                  onClick={() => navigate(`/story/${book.id}`)}
                  className="book-card relative flex w-full items-center space-x-4 overflow-hidden rounded-3xl bg-white p-4 text-left"
                >
                  {book.rank <= 3 ? (
                    <div
                      className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center font-black italic text-white shadow-sm"
                      style={{ background: RANK_STYLE[book.rank] }}
                    >
                      {book.rank}
                    </div>
                  ) : (
                    <div className="w-10 text-center text-xl font-black italic text-gray-300">
                      {book.rank}
                    </div>
                  )}

                  <div className={`h-28 w-20 overflow-hidden rounded-xl bg-gray-100 shadow-inner ${book.rank <= 3 ? 'ml-4' : ''}`}>
                    <img
                      src={`/assets/Search Pic/Book ${book.rank}.jpg`}
                      className="h-full w-full object-cover"
                      alt={book.title}
                      onError={(event) => {
                        event.currentTarget.src = 'https://via.placeholder.com/200x300?text=No+Cover'
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={`${book.rank <= 3 ? 'font-extrabold' : 'font-bold'} truncate text-gray-900`}>
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400">by {book.author}</p>
                    <div className="mt-4 flex items-center space-x-4 text-[12px] font-bold">
                      <span className="text-[#ef4444]">
                        <i className="fa-solid fa-heart mr-1" />
                        {book.likes}
                      </span>
                      <span className="text-[#111827]">
                        <i className="fa-solid fa-eye mr-1" />
                        {book.views}
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {!filteredBooks.length ? (
                <div className="rounded-3xl bg-white p-8 text-center text-sm font-bold text-gray-400 ring-1 ring-gray-100">
                  No stories found.
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

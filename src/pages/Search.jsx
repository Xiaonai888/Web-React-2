import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['Trending Now', 'Popular', 'New Releases']

const RANK_STYLE = {
  1: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
  2: 'linear-gradient(135deg,#94a3b8,#64748b)',
  3: 'linear-gradient(135deg,#d97706,#b45309)',
}

const BOOKS_DATA = [
  { rank: 1, title: "The Girl Forgot Her Name", author: 'Jonathan Wick', likes: '24.5K', views: '1.2M' },
  { rank: 2, title: 'We Loved at the Wrong Time', author: 'Sarah Drasner', likes: '18K', views: '850K' },
  { rank: 3, title: 'Queen of the Silent War', author: 'Kim Young', likes: '12K', views: '400K' },
  { rank: 4, title: 'System Error: I Fell in Love', author: 'Author Name', likes: '10K', views: '300K' },
  { rank: 5, title: 'The Smile I Show You', author: 'Author Name', likes: '8K', views: '250K' },
  { rank: 6, title: 'Omega Dragon', author: 'Author Name', likes: '7K', views: '200K' },
  { rank: 7, title: 'The Actress, The Husband, and The Child', author: 'Author Name', likes: '5K', views: '150K' },
  { rank: 8, title: 'Moonlight We Promised', author: 'Author Name', likes: '4K', views: '100K' },
  { rank: 9, title: 'The Ringtone We Shared', author: 'Author Name', likes: '3K', views: '80K' },
  { rank: 10, title: 'The Revenge', author: 'Author Name', likes: '2K', views: '50K' },
]

export default function Search() {
  const [activeTab, setActiveTab] = useState('Trending Now')
  const navigate = useNavigate()

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
        <header className="sticky top-0 z-[100] border-b border-gray-100 px-4 py-4 bg-white/90 backdrop-blur-lg">
          <div className="max-w-3xl mx-auto flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <i className="fa-solid fa-chevron-left text-lg" />
            </button>
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Shadow..." 
                className="w-full bg-white border border-gray-200 py-3 pl-12 pr-4 rounded-2xl outline-none shadow-sm" 
              />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 mt-6">
          <nav className="flex space-x-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t)}
                className={`pb-3 text-sm font-semibold text-gray-400 whitespace-nowrap transition-all ${activeTab === t ? 'text-indigo-600 font-black border-b-[3px] border-indigo-600' : ''}`}
              >
                {t}
              </button>
            ))}
          </nav>

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-xl font-extrabold">{activeTab}</h2>
            </div>

            <div className="space-y-4">
              {BOOKS_DATA.map((book) => (
                <div key={book.rank} className="book-card bg-white p-4 rounded-3xl flex items-center space-x-4 relative overflow-hidden">
                  {book.rank <= 3
                    ? <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center text-white font-black italic shadow-sm z-10" style={{ background: RANK_STYLE[book.rank] }}>{book.rank}</div>
                    : <div className="w-10 text-center text-gray-300 font-black italic text-xl">{book.rank}</div>
                  }
                  
                  <div className={`w-20 h-28 bg-gray-100 rounded-xl overflow-hidden shadow-inner ${book.rank <= 3 ? 'ml-4' : ''}`}>
                    <img 
                      src={`/assets/Search Pic/Book ${book.rank}.jpg`} 
                      className="w-full h-full object-cover" 
                      alt={book.title} 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/200x300?text=No+Cover" }}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className={`${book.rank <= 3 ? 'font-extrabold' : 'font-bold'} text-gray-900 truncate`}>
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400">by {book.author}</p>
                    <div className="flex items-center space-x-4 mt-4 text-[12px] font-bold">
                      <span className="text-indigo-500"><i className="fa-solid fa-heart mr-1" />{book.likes}</span>
                      <span className="text-gray-400"><i className="fa-solid fa-eye mr-1" />{book.views}</span>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                    Read
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

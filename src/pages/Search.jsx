// src/pages/Search.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['Trending Now','Popular','New Releases','Recommended']

const DATA = {
  'Trending Now': [
    { rank:1, title:"The Shadow's Legacy", author:'Jonathan Wick', likes:'24.5K', views:'1.2M', img:'T1' },
    { rank:2, title:'Mind Games',          author:'Sarah Drasner',  likes:'18K',   views:'850K', img:'T2' },
    { rank:3, title:'Reaper of Soul',      author:'Kim Young',      likes:'12K',   views:'400K', img:'T3' },
    ...Array.from({length:7},(_,i)=>({ rank:i+4, title:`Book ${i+4}`, author:'Author', img:`T${i+4}` }))
  ],
  'Popular': Array.from({length:10},(_,i)=>({ rank:i+1, title:`Popular Book ${i+1}`, author:'Author', img:`P${i+1}` })),
  'New Releases': Array.from({length:10},(_,i)=>({ rank:i+1, title:`New Book ${i+1}`, author:'Author', img:`N${i+1}` })),
  'Recommended': Array.from({length:10},(_,i)=>({ rank:i+1, title:`Rec Book ${i+1}`, author:'Author', img:`R${i+1}` })),
}

const RANK_STYLE = {
  1: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
  2: 'linear-gradient(135deg,#94a3b8,#64748b)',
  3: 'linear-gradient(135deg,#d97706,#b45309)',
}

export default function Search() {
  const [tab, setTab] = useState('Trending Now')
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

      <div style={{ paddingBottom:'80px' }}>
        {/* Header */}
        <header className="sticky top-0 z-[100] border-b border-gray-100 px-4 py-4 bg-white/90 backdrop-blur-lg">
          <div className="max-w-3xl mx-auto flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <i className="fa-solid fa-chevron-left text-lg" />
            </button>
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search Shadow..." className="w-full bg-white border border-gray-200 py-3 pl-12 pr-4 rounded-2xl outline-none shadow-sm" />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 mt-6">
          {/* Tab nav */}
          <nav className="flex space-x-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-3 text-sm font-semibold text-gray-400 whitespace-nowrap transition-all ${tab===t ? 'text-indigo-600 font-black border-b-[3px] border-indigo-600' : ''}`}>
                {t}
              </button>
            ))}
          </nav>

          {/* Books list */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-xl font-extrabold">{tab}</h2>
            </div>
            <div className="space-y-4">
              {DATA[tab].map(book => (
                <div key={book.rank} className="book-card bg-white p-4 rounded-3xl flex items-center space-x-4 relative overflow-hidden">
                  {book.rank <= 3
                    ? <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center text-white font-black italic shadow-sm" style={{ background: RANK_STYLE[book.rank] }}>{book.rank}</div>
                    : <div className="w-10 text-center text-gray-300 font-black italic text-xl">{book.rank}</div>
                  }
                  <div className={`w-20 h-28 bg-gray-100 rounded-xl overflow-hidden ${book.rank <= 3 ? 'ml-4' : ''}`}>
                    <img src={`https://via.placeholder.com/200x300?text=${book.img}`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${book.rank <= 3 ? 'font-extrabold' : 'font-bold'} text-gray-900`}>{book.title}</h3>
                    <p className="text-sm text-gray-400">by {book.author}</p>
                    {book.likes && (
                      <div className="flex items-center space-x-4 mt-4 text-[12px] font-bold">
                        <span className="text-indigo-500"><i className="fa-solid fa-heart mr-1" />{book.likes}</span>
                        <span className="text-gray-400"><i className="fa-solid fa-eye mr-1" />{book.views}</span>
                      </div>
                    )}
                  </div>
                  {book.rank > 3 && (
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">Read</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

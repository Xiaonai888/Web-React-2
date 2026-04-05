// src/pages/Library.jsx
import { useState } from 'react'

export default function Library() {
  const [activeTab, setActiveTab] = useState('Subscribed')

  return (
    <>
      <style>{`
        body { background:#fff; font-family:'Inter','Kantumruy Pro',sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .tab-active-lib { color:#1a1a1a; font-weight:800; font-size:1.1rem; }
        .tab-active-lib::after { content:""; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:20px; height:4px; background:#ff3b5c; border-radius:10px; }
        .tag-end { background: linear-gradient(45deg, #ff9a44, #fc6076); }
      `}</style>

      <div style={{ paddingBottom:'80px' }}>
        {/* Header */}
        <header className="sticky top-0 z-[100] bg-white pt-6 pb-4 border-b border-gray-50">
          <div className="flex justify-between items-center px-5 mb-6">
            <div className="flex space-x-6 items-end">
              {['Recents','Subscribed','Downloads'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`relative text-sm font-bold transition-all ${activeTab===t ? 'tab-active-lib' : 'text-gray-400'}`}>
                  {t}
                </button>
              ))}
            </div>
            <button className="text-gray-600 font-semibold text-sm">Edit</button>
          </div>
          <div className="flex space-x-3 px-5 overflow-x-auto no-scrollbar">
            <button className="bg-[#ff3b5c] text-white px-5 py-1.5 rounded-full text-xs font-bold shrink-0 shadow-lg shadow-red-100">All</button>
            <button className="bg-gray-100 text-gray-500 px-5 py-1.5 rounded-full text-xs font-bold shrink-0">Comic</button>
            <button className="bg-gray-100 text-gray-500 px-5 py-1.5 rounded-full text-xs font-bold shrink-0">Novel</button>
          </div>
        </header>

        {/* Featured book */}
        <section className="px-5 mt-6">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-4 border border-gray-100 relative cursor-pointer">
            <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 shadow-md">
              <img src="https://via.placeholder.com/200x300?text=CEO" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 pr-6">
              <h4 className="font-extrabold text-[14px] text-gray-900 leading-tight line-clamp-1">The Revenge of the Betrayed Bride</h4>
              <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">Maya Brook was excited for her wedding, but on the day...</p>
            </div>
            <i className="fas fa-chevron-right text-gray-300 absolute right-4" />
          </div>
        </section>

        {/* Books grid */}
        <section className="px-5 mt-8">
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {[
              { title:'My Chubby Princess',       ep:'Up to Ep.262', img:'https://via.placeholder.com/200x300?text=Princess', tag:null },
              { title:'Marrying the Uncle of EX', ep:'Up to Ep.94',  img:'https://via.placeholder.com/200x300?text=Uncle',    tag:null },
              { title:'The Omega of the Dragon',  ep:'Up to Ep.47',  img:'https://via.placeholder.com/200x300?text=Dragon',   tag:'END' },
            ].map(book => (
              <div key={book.title} className="flex flex-col">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 shadow-sm">
                  <img src={book.img} className="w-full h-full object-cover" alt="" />
                  {book.tag && <div className="tag-end absolute top-2 left-2 text-[8px] text-white font-bold px-1.5 py-0.5 rounded">{book.tag}</div>}
                  <div className="absolute bottom-2 left-2 bg-black/40 p-1 rounded backdrop-blur-sm">
                    <i className="fas fa-book-open text-white text-[8px]" />
                  </div>
                </div>
                <h5 className="font-bold text-[12px] text-gray-800 line-clamp-1">{book.title}</h5>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{book.ep}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-12 bg-gray-50/50 pt-8 pb-10">
          <div className="px-5 mb-6 flex justify-between items-center">
            <h3 className="font-extrabold text-lg text-gray-900">Recommend For You</h3>
          </div>
          <div className="flex space-x-4 px-5 overflow-x-auto no-scrollbar">
            {[
              { title:"Ladyship's Scheme", img:'https://via.placeholder.com/200x300?text=New+1' },
              { title:'One-Night Affair',  img:'https://via.placeholder.com/200x300?text=New+2' },
              { title:'Infertile CEO',     img:'https://via.placeholder.com/200x300?text=New+3' },
            ].map(b => (
              <div key={b.title} className="min-w-[110px] group">
                <div className="aspect-[3/4.2] rounded-xl overflow-hidden mb-2 relative">
                  <img src={b.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                  <div className="tag-end absolute top-2 left-2 text-[8px] text-white font-bold px-1.5 py-0.5 rounded uppercase">End</div>
                </div>
                <h6 className="font-bold text-[11px] text-gray-800 line-clamp-1">{b.title}</h6>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

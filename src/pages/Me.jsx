// src/pages/Me.jsx
import { useState } from 'react'

export default function Me() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <style>{`
        body { background:#f9f9f9; font-family:'Inter','Kantumruy Pro',sans-serif; }
        .login-btn { background: linear-gradient(90deg, #ff3b5c, #ff6b81); }
      `}</style>

      <div style={{ paddingBottom:'80px' }}>
        {/* Settings button */}
        <div className="fixed top-0 left-0 w-full z-[110] flex justify-end px-5 py-4">
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm">
            <i className="fa-solid fa-gear text-gray-700 text-xl" />
          </button>
        </div>

        {/* Profile */}
        <section className="pt-14 pb-8 px-6 text-center border-b border-gray-100 bg-white">
          <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-md mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <i className="fa-solid fa-user text-gray-400 text-5xl" />
          </div>
          <h2 className="font-extrabold text-xl text-gray-900">ភ្ញៀវ (Guest)</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Shadow ID: 000000</p>
          <a href="#" className="login-btn inline-block mt-5 px-10 py-2.5 rounded-full text-white font-bold text-sm shadow-lg shadow-red-200 active:scale-95 transition-transform">
            Login / Sign Up
          </a>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-1 py-6 bg-white shadow-sm mb-4">
          {[['0','Points'],['0','Vouchers'],['0','Coins']].map(([val,label]) => (
            <div key={label} className="text-center border-r last:border-0 border-gray-50">
              <p className="font-black text-lg">{val}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
            </div>
          ))}
        </section>

        {/* Menu items */}
        <section className="bg-white px-5 space-y-1">
          {[
            { icon:'fa-wallet',        color:'text-orange-400', label:'My Wallet' },
            { icon:'fa-star',          color:'text-yellow-400', label:'VIP Membership' },
            { icon:'fa-pen-nib',       color:'text-blue-400',   label:'Become an Author' },
            { icon:'fa-circle-question',color:'text-gray-400',  label:'Help & Feedback' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer">
              <div className="flex items-center space-x-4">
                <i className={`fa-solid ${item.icon} ${item.color}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-200 text-xs" />
            </div>
          ))}
        </section>
      </div>

      {/* Settings overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">ការកំណត់ (Settings)</h3>
              <button onClick={() => setShowSettings(false)}><i className="fa-solid fa-xmark text-gray-400" /></button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50"><span>ភាសា / Language</span><span className="text-sm text-blue-600 font-bold">ខ្មែរ</span></div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50"><span>Dark Mode</span><div className="w-10 h-5 bg-gray-200 rounded-full" /></div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50"><span>Clear Cache</span><span className="text-xs text-gray-400">24 MB</span></div>
            <button className="w-full py-4 text-red-500 font-bold text-center mt-4">ចាកចេញ (Log Out)</button>
          </div>
        </div>
      )}
    </>
  )
}

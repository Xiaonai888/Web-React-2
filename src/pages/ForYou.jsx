import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AlphaSpotlight from '../components/AlphaSpotlight' // ត្រូវប្រាកដថា Path នេះត្រឹមត្រូវ

export default function ForYou() {
  useEffect(() => {
    if (window.Swiper) {
      new window.Swiper('.mySwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: { rotate: 0, stretch: 0, depth: 80, modifier: 2, slideShadows: false },
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
      })
    }
  }, [])

  function switchTab(type) {
    const tabs = ['novel', 'chat', 'manga']
    tabs.forEach(tab => {
      const el = document.getElementById('tab-' + tab)
      if (!el) return
      if (tab === type) {
        el.classList.add('active', 'text-blue-600')
        el.classList.remove('text-gray-400')
      } else {
        el.classList.remove('active', 'text-blue-600')
        el.classList.add('text-gray-400')
      }
    })
  }

  return (
    <>
      <style>{`
        html, body { margin:0; padding:0; background:#fff; font-family:'Kantumruy Pro','Inter',sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        .swiper-container { width:100%; padding-top:10px; padding-bottom:30px; }
        .swiper-slide { width:85%; border-radius:20px; overflow:hidden; box-shadow:0 10px 20px rgba(0,0,0,0.1); transition:all 0.3s ease; }
        .swiper-slide-next,.swiper-slide-prev { opacity:0.4; transform:scale(0.9); }
        .swiper-pagination-bullet-active { background:#3b82f6; width:20px; border-radius:5px; }
        @media(min-width:768px){ .swiper-slide { width:58%; } }
        .tab-item { transition:all 0.3s ease; cursor:pointer; position:relative; }
        .tab-item.active { color:#3b82f6; font-weight:700; }
        .tab-item.active::after { content:''; position:absolute; bottom:-12px; left:0; width:100%; height:3px; background:#3b82f6; border-radius:10px; }
        .category-btn { transition:all 0.2s ease; }
      `}</style>

      <div style={{ paddingBottom: '80px' }}>
        <header className="flex justify-between items-center px-4 py-4 sticky top-0 bg-white z-[100] shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">S</div>
            <h1 className="text-blue-600 font-bold text-2xl tracking-tight">Shadow</h1>
          </div>
          <div className="flex space-x-5 text-gray-400 text-xl">
            <Link to="/search" className="hover:text-blue-600 transition-colors"><i className="fas fa-search" /></Link>
            <button className="hover:text-blue-600 transition-colors"><i className="fas fa-bell" /></button>
          </div>
        </header>

        {/* Tabs, Categories, and Big Swiper... (រក្សានៅដដែល) */}
        <nav className="flex px-4 space-x-8 border-b border-gray-100 bg-white sticky top-[68px] z-[90] pb-3">
          <div id="tab-novel" className="tab-item active text-sm" onClick={() => switchTab('novel')}>Novel</div>
          <div id="tab-chat" className="tab-item text-gray-400 font-semibold text-sm" onClick={() => switchTab('chat')}>Chat Story</div>
          <div id="tab-manga" className="tab-item text-gray-400 font-semibold text-sm" onClick={() => switchTab('manga')}>Manga</div>
        </nav>

        <div id="tab-content-root">
          <div className="flex space-x-3 px-4 py-5 overflow-x-auto no-scrollbar bg-white">
            <button className="category-btn bg-blue-600 text-white px-6 py-1.5 rounded-full text-xs shrink-0 font-bold">Today</button>
            <button className="category-btn border border-gray-200 px-5 py-1.5 rounded-full text-xs shrink-0 text-gray-600 font-semibold">Romance</button>
            <button className="category-btn border border-gray-200 px-5 py-1.5 rounded-full text-xs shrink-0 text-gray-600 font-semibold">Fantasy</button>
          </div>

          <div className="swiper-container mySwiper">
            <div className="swiper-wrapper">
              {['K26','K27','K28','K29','K30','K31','K32'].map(k => (
                <div key={k} className="swiper-slide aspect-[16/9]">
                  <img src={`/assets/banners/${k}.jpg`} className="w-full h-full object-cover" alt={k} />
                </div>
              ))}
            </div>
            <div className="swiper-pagination" />
          </div>

          {/* Quick Icons */}
          <div className="grid grid-cols-4 gap-4 py-4 px-4 text-center">
            {[{ icon: 'fa-shopping-bag', label: 'Shop' }, { icon: 'fa-tasks', label: 'Tasks' }, { icon: 'fa-trophy', label: 'Ranking' }, { icon: 'fa-calendar', label: 'Event' }].map(item => (
              <div key={item.label} className="group cursor-pointer">
                <div className="w-12 h-12 bg-gray-50 rounded-full mb-1 mx-auto flex items-center justify-center">
                  <i className={`fas ${item.icon} text-gray-500`} />
                </div>
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          {/* ចំណុចដែលត្រូវកែ៖ ហៅ Component មកប្រើ មិនមែន Paste កូដចូលទាំងដុំទេ */}
          <div className="my-6">
            <AlphaSpotlight />
          </div>

          {/* Must Reads Section... (បន្តទៅទៀត) */}
        </div>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AlphaSpotlight from '../components/AlphaSpotlight'
import ShadowExclusiveSection from '../components/ShadowExclusiveSection'
import TrendingNowSection from '../components/TrendingNowSection'
import UpdateTodaySection from '../components/UpdateTodaySection'

export default function ForYou() {
  const [activeTab, setActiveTab] = useState('novel')

  useEffect(() => {
    if (window.Swiper) {
      new window.Swiper('.mySwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 80,
          modifier: 2,
          slideShadows: false,
        },
        loop: true,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      })
    }
  }, [])

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #fff;
          font-family: 'Kantumruy Pro', 'Inter', sans-serif;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .swiper-container {
          width: 100%;
          padding-top: 10px;
          padding-bottom: 30px;
        }

        .swiper-slide {
          width: 85%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .swiper-slide-next,
        .swiper-slide-prev {
          opacity: 0.4;
          transform: scale(0.9);
        }

        .swiper-pagination-bullet-active {
          background: #3b82f6;
          width: 20px;
          border-radius: 5px;
        }

        @media (min-width: 768px) {
          .swiper-slide { width: 58%; }
        }

        .tab-item {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          padding-bottom: 8px;
        }

        .tab-item.active {
          color: #3b82f6;
          font-weight: 700;
        }

        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #3b82f6;
          border-radius: 10px;
        }
      `}</style>

      <div style={{ paddingBottom: '80px' }}>
        <header className="sticky top-0 z-[100] flex items-center justify-between bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-lg shadow-blue-200">
              S
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-600">Shadow</h1>
          </div>

          <div className="flex space-x-5 text-xl text-gray-400">
            <Link to="/search" className="transition-colors hover:text-blue-600">
              <i className="fas fa-search" />
            </Link>
            <button className="transition-colors hover:text-blue-600">
              <i className="fas fa-bell" />
            </button>
          </div>
        </header>

        <nav className="sticky top-[68px] z-[90] flex space-x-8 border-b border-gray-100 bg-white px-4 pt-2">
          {['novel', 'chat', 'manga'].map((tab) => (
            <div
              key={tab}
              className={`tab-item text-sm capitalize ${
                activeTab === tab ? 'active' : 'font-semibold text-gray-400'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'novel' ? 'Novel' : tab === 'chat' ? 'Chat Story' : 'Manga'}
            </div>
          ))}
        </nav>

        <div id="tab-content-root">
          <div className="no-scrollbar flex space-x-3 overflow-x-auto bg-white px-4 py-5">
            <button className="shrink-0 rounded-full bg-blue-600 px-6 py-1.5 text-xs font-bold text-white">
              Today
            </button>
            <button className="shrink-0 rounded-full border border-gray-200 px-5 py-1.5 text-xs font-semibold text-gray-600">
              Romance
            </button>
            <button className="shrink-0 rounded-full border border-gray-200 px-5 py-1.5 text-xs font-semibold text-gray-600">
              Fantasy
            </button>
            <button className="shrink-0 rounded-full border border-gray-200 px-5 py-1.5 text-xs font-semibold text-gray-600">
              Action
            </button>
          </div>

          <div className="swiper-container mySwiper">
            <div className="swiper-wrapper">
              {['K26', 'K27', 'K28', 'K29', 'K30', 'K31', 'K32'].map((k) => (
                <div key={k} className="swiper-slide aspect-[16/9]">
                  <img
                    src={`/assets/banners/${k}.jpg`}
                    className="h-full w-full object-cover"
                    alt={k}
                  />
                </div>
              ))}
            </div>
            <div className="swiper-pagination" />
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-4 text-center">
            {[
              { icon: 'fa-shopping-bag', label: 'Shop' },
              { icon: 'fa-tasks', label: 'Tasks' },
              { icon: 'fa-trophy', label: 'Ranking' },
              { icon: 'fa-calendar', label: 'Event' },
            ].map((item) => (
              <div key={item.label} className="group cursor-pointer">
                <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 transition-all group-hover:bg-blue-50">
                  <i className={`fas ${item.icon} text-gray-500 group-hover:text-blue-600`} />
                </div>
                <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="my-6">
            <AlphaSpotlight />
          </div>

          <div className="my-6">
            <ShadowExclusiveSection />
          </div>

          <div className="my-6">
            <TrendingNowSection />
          </div>

          <div className="my-6">
            <UpdateTodaySection />
          </div>
        </div>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AlphaSpotlight from '../components/AlphaSpotlight'

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
      <div style={{ paddingBottom: '80px' }}>
        <header className="flex justify-between items-center px-4 py-4 sticky top-0 bg-white z-[100] shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <h1 className="text-blue-600 font-bold text-2xl">Shadow</h1>
          </div>

          <div className="flex space-x-5 text-gray-400 text-xl">
            <Link to="/search">
              <i className="fas fa-search" />
            </Link>
            <button>
              <i className="fas fa-bell" />
            </button>
          </div>
        </header>

        <nav className="flex px-4 space-x-8 border-b bg-white sticky top-[68px] z-[90] pt-2">
          {['novel', 'chat', 'manga'].map((tab) => (
            <div
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : 'text-gray-400'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'novel' ? 'Novel' : tab === 'chat' ? 'Chat Story' : 'Manga'}
            </div>
          ))}
        </nav>

        <div className="my-6">
          <AlphaSpotlight />
        </div>
      </div>
    </>
  )
}

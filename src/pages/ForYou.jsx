import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const fallbackGenreTabs = [
  { label: 'Today', slug: 'today', is_locked: true },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
]

function ComingSoonPanel({ title }) {
  return (
    <div className="px-4 py-8">
      <div className="rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <i className="fa-solid fa-clock text-xl" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
          This section is coming soon. Novel is available now.
        </p>
      </div>
    </div>
  )
}

function SafeModePanel() {
  return (
    <div className="px-4 py-8">
      <div className="rounded-[24px] border border-dashed border-gray-200 bg-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <i className="fa-solid fa-shield-halved text-xl" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">For You Safe Mode</h2>
        <p className="mx-auto mt-2 max-w-[420px] text-sm font-medium leading-6 text-gray-500">
          Heavy image sections are temporarily paused while we reduce storage traffic.
        </p>
      </div>
    </div>
  )
}

export default function ForYou() {
  const [activeTab, setActiveTab] = useState('novel')
  const [activeGenre, setActiveGenre] = useState('today')
  const [genreTabs] = useState(fallbackGenreTabs)
  const [barsHidden, setBarsHidden] = useState(false)

  const navigate = useNavigate()
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollYRef.current
      const difference = currentScrollY - previousScrollY

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('for-you-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('for-you-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('for-you-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('for-you-bars-hidden')
    }
  }, [])

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #fff;
          font-family: 'Roboto', Arial, sans-serif;
          overflow-x: hidden;
        }

        .for-you-top-bars {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100000;
          background: #fff;
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        body.for-you-bars-hidden footer {
          transform: translateY(110%);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .tab-item {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          padding-bottom: 8px;
        }

        .tab-item.active {
          color: #111827;
          font-weight: 700;
        }

        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #F6B800;
          border-radius: 10px;
        }
      `}</style>

      <div style={{ paddingBottom: '80px', overflowX: 'hidden', width: '100%' }}>
        <div
          className="for-you-top-bars"
          style={{ transform: barsHidden ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          <header className="flex justify-between items-center px-4 py-4 bg-white shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-black/5">
                <img
                  src="/assets/Icons/Shadow%20Logo.svg"
                  alt="Shadow"
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111827]">SHADOW</h1>
            </div>

            <div className="flex space-x-5 text-gray-400 text-xl">
              <Link to="/search" className="hover:text-[#111827] transition-colors">
                <i className="fas fa-search" />
              </Link>
              <button className="hover:text-blue-600 transition-colors">
                <i className="fas fa-bell" />
              </button>
            </div>
          </header>

          <nav className="flex px-4 space-x-8 border-b border-gray-100 bg-white pt-2">
            {['novel', 'chat', 'manga'].map((tab) => (
              <div
                key={tab}
                className={`tab-item text-sm capitalize ${activeTab === tab ? 'active' : 'text-gray-400 font-semibold'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'novel' ? 'Novel' : tab === 'chat' ? 'Chat Story' : 'Manga'}
              </div>
            ))}
          </nav>
        </div>

        <div style={{ height: '110px' }} />

        {activeTab !== 'novel' ? (
          <ComingSoonPanel title={activeTab === 'chat' ? 'Chat Story' : 'Manga'} />
        ) : (
          <div id="tab-content-root">
            <div className="flex space-x-3 px-4 py-5 overflow-x-auto no-scrollbar bg-white">
              {genreTabs.map((tab) => {
                const active = activeGenre === tab.slug

                return (
                  <button
                    key={tab.slug}
                    type="button"
                    onClick={() => setActiveGenre(tab.slug)}
                    className={
                      active
                        ? 'bg-[#111827] text-white px-6 py-1.5 rounded-full text-xs shrink-0 font-bold'
                        : 'border border-gray-200 px-5 py-1.5 rounded-full text-xs shrink-0 text-gray-600 font-semibold bg-white'
                    }
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-4 gap-4 py-4 px-4 text-center">
              {[
                { icon: 'fa-shopping-bag', label: 'Shop', path: '/shop' },
                { icon: 'fa-tasks', label: 'Tasks', path: '/tasks' },
                { icon: 'fa-trophy', label: 'Ranking', path: '/ranking' },
                { icon: 'fa-calendar', label: 'Event', path: '/event' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group cursor-pointer"
                  onClick={() => item.path && navigate(item.path)}
                >
                  <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 transition-all group-hover:bg-[#f8fafc]">
                    <i className={`fas ${item.icon}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-[#111827]">{item.label}</span>
                </div>
              ))}
            </div>

            <SafeModePanel />
          </div>
        )}
      </div>
    </>
  )
}

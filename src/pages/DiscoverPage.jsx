import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const storyItems = [
  {
    name: 'Music',
    label: 'Music',
    avatar: '♪',
    image: 'linear-gradient(160deg, #4ec7a5 0%, #45b4df 100%)',
    type: 'feature',
  },
  {
    name: 'Create story',
    label: 'Create story',
    avatar: '+',
    image: 'linear-gradient(160deg, #1f2937 0%, #93c5fd 100%)',
    type: 'create',
  },
  {
    name: 'Luna Hart',
    label: 'New episode',
    avatar: 'LH',
    image: 'linear-gradient(160deg, #111827 0%, #4f46e5 100%)',
    type: 'author',
  },
  {
    name: 'Mika Rose',
    label: 'New book',
    avatar: 'MR',
    image: 'linear-gradient(160deg, #3b0764 0%, #f472b6 100%)',
    type: 'author',
  },
  {
    name: 'Nora Vale',
    label: 'Trending',
    avatar: 'NV',
    image: 'linear-gradient(160deg, #7f1d1d 0%, #f59e0b 100%)',
    type: 'author',
  },
]

export default function DiscoverPage() {
  const [barsHidden, setBarsHidden] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollYRef.current
      const difference = currentScrollY - previousScrollY

      if (currentScrollY < 20) {
        setBarsHidden(false)
        document.body.classList.remove('discover-bars-hidden')
      } else if (difference > 8) {
        setBarsHidden(true)
        document.body.classList.add('discover-bars-hidden')
      } else if (difference < -8) {
        setBarsHidden(false)
        document.body.classList.remove('discover-bars-hidden')
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.classList.remove('discover-bars-hidden')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <style>{`
        body.discover-bars-hidden footer {
          transform: translateY(110%);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <header
        className="fixed left-0 right-0 top-0 z-[100000] bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: barsHidden ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex h-9 w-[92px] items-center overflow-visible">
            <img
              src="/assets/Icons/Logo Shadow 2.svg"
              alt="Shadow"
              className="h-full w-full object-contain object-left"
              loading="eager"
              decoding="async"
            />
          </Link>

          <div className="flex items-center space-x-5 text-xl text-gray-400">
            <Link
              to="/genres"
              className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
              aria-label="Genres"
            >
              <img
                src="/assets/Icons/Genre.svg?v=2"
                alt="Genres"
                className="h-5 w-5 object-contain"
              />
            </Link>

            <Link
              to="/search"
              className="flex h-6 w-6 items-center justify-center transition-colors hover:text-[#111827]"
              aria-label="Search"
            >
              <i className="fas fa-search" />
            </Link>

            <Link
              to="/notifications"
              className="flex h-6 w-6 items-center justify-center transition-colors hover:text-[#111827]"
              aria-label="Notifications"
            >
              <i className="fas fa-bell" />
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-[72px]">
        <section className="border-b border-gray-100 bg-white py-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
            {storyItems.map((item) => (
              <button
                key={item.name}
                type="button"
                className="relative h-[184px] w-[112px] shrink-0 overflow-hidden rounded-[18px] bg-white text-left shadow-sm ring-1 ring-black/5 active:scale-[0.98]"
              >
                <div className="absolute inset-0" style={{ background: item.image }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/55" />

                <div className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-[14px] font-black text-white shadow-md">
                  {item.avatar}
                </div>

                {item.type === 'create' ? (
                  <div className="absolute left-1/2 top-[58px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white bg-[#1677ff] text-[24px] font-black leading-none text-white shadow-lg">
                    +
                  </div>
                ) : null}

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="line-clamp-2 text-[13px] font-black leading-[16px] text-white drop-shadow">
                    {item.label}
                  </div>
                  {item.type === 'author' ? (
                    <div className="mt-1 truncate text-[10px] font-bold text-white/80">{item.name}</div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-5">
          <div className="rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
              <i className="fa-solid fa-compass text-xl" />
            </div>
            <h1 className="text-[20px] font-extrabold text-[#111827]">Discover</h1>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-gray-500">
              Followed page feed demo will be added next.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

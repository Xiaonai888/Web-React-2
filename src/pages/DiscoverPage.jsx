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

const feedPosts = [
  {
    author: 'Luna Hart',
    handle: 'Author Page',
    time: '9h',
    avatar: 'LH',
    text: 'Chapter 25 is out now. A quiet promise becomes the most dangerous lie.',
    stats: { likes: 19, comments: 1, shares: 3 },
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
                  <div className="absolute left-1/2 top-[72px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white bg-[#1677ff] text-[24px] font-black leading-none text-white shadow-lg">
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

        <section className="space-y-4 px-4 py-4">
          {feedPosts.map((post) => (
            <article key={`${post.author}-${post.time}`} className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-gray-100">
              <div className="flex items-start gap-3 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white">
                  {post.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-black text-[#111827]">{post.author}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                        <span>{post.handle}</span>
                        <span>·</span>
                        <span>{post.time}</span>
                        <span>·</span>
                        <i className="fa-solid fa-earth-americas text-[10px]" />
                      </div>
                    </div>

                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100">
                      <i className="fa-solid fa-ellipsis" />
                    </button>
                  </div>

                  <p className="mt-3 text-[14px] font-semibold leading-6 text-[#111827]">{post.text}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
                <div className="h-[210px] bg-gradient-to-br from-[#111827] via-[#374151] to-[#7c3aed]" />
                <div className="h-[210px] bg-gradient-to-br from-[#f8fafc] via-[#dbeafe] to-[#94a3b8]" />
              </div>

              <div className="flex items-center justify-between px-4 py-3 text-[12px] font-bold text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1677ff] text-[10px] text-white">
                    <i className="fa-solid fa-thumbs-up" />
                  </span>
                  <span>{post.stats.likes}</span>
                </div>
                <div>{post.stats.comments} comment · {post.stats.shares} shares</div>
              </div>

              <div className="grid grid-cols-3 border-t border-gray-100 text-[13px] font-extrabold text-gray-500">
                <button type="button" className="flex items-center justify-center gap-2 py-3 active:bg-gray-50">
                  <i className="fa-regular fa-thumbs-up" />
                  Like
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 active:bg-gray-50">
                  <i className="fa-regular fa-comment" />
                  Comment
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 active:bg-gray-50">
                  <i className="fa-solid fa-share" />
                  Share
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

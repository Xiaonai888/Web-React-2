import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const typeTabs = ['All', 'Novel', 'Chat Story', 'Manga']

const subscribedFeed = [
  {
    id: 501,
    title: 'Shadow Bride',
    author: 'Luna Hale',
    update: 'Updated 2h ago',
    episode: 'Ep. 26 released',
    image: '/assets/Shadow Exclusive/Shadow Exclusive 1.jpg',
  },
  {
    id: 502,
    title: 'Royal Scheme',
    author: 'Mira Voss',
    update: 'Updated today',
    episode: 'Ep. 13 released',
    image: '/assets/Shadow Exclusive/Shadow Exclusive 2.jpg',
  },
  {
    id: 503,
    title: 'Typing My Heart',
    author: 'Yuna K',
    update: 'Updated yesterday',
    episode: 'Chat 44 released',
    image: '/assets/Shadow Exclusive/Shadow Exclusive 3.jpg',
  },
]

const subscribedBooks = [
  { id: 501, title: 'Shadow Bride', type: 'Novel', info: 'New Ep. 26', image: '/assets/Shadow Exclusive/Shadow Exclusive 1.jpg' },
  { id: 502, title: 'Royal Scheme', type: 'Novel', info: 'New Ep. 13', image: '/assets/Shadow Exclusive/Shadow Exclusive 2.jpg' },
  { id: 503, title: 'Typing My Heart', type: 'Chat Story', info: 'New Chat 44', image: '/assets/Shadow Exclusive/Shadow Exclusive 3.jpg' },
  { id: 504, title: 'My Princess Roommate', type: 'Manga', info: 'New Ep. 9', image: '/assets/Shadow Exclusive/Shadow Exclusive 4.jpg' },
  { id: 505, title: 'CEO in the Rain', type: 'Novel', info: 'New Ep. 17', image: '/assets/Shadow Exclusive/Shadow Exclusive 5.jpg' },
  { id: 506, title: 'Under the Same Rain', type: 'Manga', info: 'New Ep. 21', image: '/assets/Shadow Exclusive/Shadow Exclusive 6.jpg' },
  { id: 507, title: 'The Quiet Engagement', type: 'Novel', info: 'New Ep. 11', image: '/assets/Trending%20Now/Trending%207.jpg' },
  { id: 508, title: 'Chat After Midnight', type: 'Chat Story', info: 'New Chat 12', image: '/assets/Trending%20Now/Trending%208.jpg' },
  { id: 509, title: 'Campus Bloom', type: 'Manga', info: 'New Ep. 5', image: '/assets/Trending%20Now/Trending%209.jpg' },
  { id: 510, title: 'Promise in Winter', type: 'Novel', info: 'New Ep. 30', image: '/assets/Trending%20Now/Trending%2010.jpg' },
  { id: 511, title: 'My Soft Villain', type: 'Novel', info: 'New Ep. 22', image: '/assets/Trending%20Now/Trending%2011.jpg' },
  { id: 512, title: 'Unread Feelings', type: 'Chat Story', info: 'New Chat 7', image: '/assets/Trending%20Now/Trending%2012.jpg' },
]

function SubscriptionGridCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="overflow-hidden rounded-2xl bg-[#efefef] shadow-sm">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      </div>

      <div className="pt-2.5">
        <h4 className="line-clamp-1 text-[12px] font-extrabold tracking-tight text-[#111] sm:text-[13px]">
          {book.title}
        </h4>
        <p className="mt-1 text-[10px] font-medium text-[#8d8d8d] sm:text-[11px]">
          {book.info}
        </p>
      </div>
    </Link>
  )
}

export default function SubscriptionsPage() {
  const [activeType, setActiveType] = useState('All')

  const filteredFeed = useMemo(() => {
    if (activeType === 'All') return subscribedFeed

    const typeMap = Object.fromEntries(subscribedBooks.map((book) => [book.id, book.type]))
    return subscribedFeed.filter((item) => typeMap[item.id] === activeType)
  }, [activeType])

  const filteredBooks = useMemo(() => {
    if (activeType === 'All') return subscribedBooks
    return subscribedBooks.filter((book) => book.type === activeType)
  }, [activeType])

  return (
    <div className="min-h-screen bg-white pb-[88px]">
      <header className="sticky top-0 z-[60] border-b border-[#f3f3f3] bg-white/95 backdrop-blur-sm">
        <div className="px-4 py-5 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                to="/library"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5"
                aria-label="Back to library"
              >
                <i className="fas fa-chevron-left text-[14px]" />
              </Link>

              <div>
                <h1 className="text-[20px] font-extrabold tracking-tight text-[#111]">
                  Subscriptions
                </h1>
                <p className="mt-1 text-[12px] text-[#8b8b95] sm:text-[13px]">
                  Track new chapters from stories you follow.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {typeTabs.map((type) => {
              const active = type === activeType
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${
                    active
                      ? 'bg-[#ff3b5c] text-white shadow-[0_8px_18px_rgba(255,59,92,0.18)]'
                      : 'bg-[#f3f3f5] text-[#7b7b85] hover:bg-[#ececef]'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-5">
        <section className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111]">
              Recent Updates
            </h2>
          </div>

          <div className="space-y-3">
            {filteredFeed.map((item) => (
              <Link
                key={item.id}
                to={`/story/${item.id}`}
                className="flex items-start gap-4 rounded-2xl border border-[#f1f1f1] bg-white p-4 transition hover:bg-[#fafafa]"
              >
                <div className="w-[64px] shrink-0 overflow-hidden rounded-xl bg-[#efefef]">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-[14px] font-extrabold text-[#111]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#8d8d95]">
                    {item.author}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#5f78ff]">
                    {item.episode}
                  </p>
                </div>

                <div className="shrink-0 text-[11px] font-medium text-[#a0a0a8]">
                  {item.update}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111]">
              All Subscribed Stories
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-4 md:gap-y-0">
            {filteredBooks.map((book) => (
              <SubscriptionGridCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

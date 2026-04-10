import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SubscriptionsSection from '../components/library/SubscriptionsSection'

const topTabs = ['Recents', 'Subscribed', 'Downloads']
const typeTabs = ['All', 'Novel', 'Chat Story', 'Manga']

const libraryData = {
  Recents: {
    context: {
      label: 'Continue Reading',
      title: 'The Revenge of the Betrayed Bride',
      subtitle: 'Maya Brook was excited for her wedding, but on the day everything changed.',
      meta: 'Last read • Ep. 27',
      image: '/assets/Shadow Exclusive/Shadow Exclusive 1.jpg',
      to: '/story/401',
    },
    books: [
      { id: 401, title: 'The Revenge of the Betrayed Bride', type: 'Novel', info: 'Last read Ep. 27', image: '/assets/Update Today/Update Today 1.jpg' },
      { id: 402, title: 'Soft Autumn Promise', type: 'Novel', info: 'Last read Ep. 12', image: '/assets/Update Today/Update Today 2.jpg' },
      { id: 403, title: 'Hidden in the Reply Box', type: 'Chat Story', info: 'Last read Chat 31', image: '/assets/Update Today/Update Today 3.jpg' },
      { id: 404, title: 'Moonlight Homeroom', type: 'Manga', info: 'Last read Ep. 8', image: '/assets/Update Today/Update Today 4.jpg' },
      { id: 405, title: 'Stay a Little Longer', type: 'Novel', info: 'Last read Ep. 19', image: '/assets/Update Today/Update Today 5.jpg' },
      { id: 406, title: 'Our Fingers Almost Touched', type: 'Manga', info: 'Last read Ep. 6', image: '/assets/Update Today/Update Today 6.jpg' },
    ],
  },
  Subscribed: {
    context: {
      label: 'Latest Update',
      title: 'Shadow Bride',
      subtitle: 'A new chapter just dropped from one of the stories you follow.',
      meta: 'Updated 2h ago • Ep. 26 released',
      image: '/assets/Shadow Exclusive/Shadow Exclusive 2.jpg',
      to: '/story/501',
    },
    books: [
      { id: 501, title: 'Shadow Bride', type: 'Novel', info: 'New Ep. 26', image: '/assets/Shadow Exclusive/Shadow Exclusive 1.jpg' },
      { id: 502, title: 'Royal Scheme', type: 'Novel', info: 'New Ep. 13', image: '/assets/Shadow Exclusive/Shadow Exclusive 2.jpg' },
      { id: 503, title: 'Typing My Heart', type: 'Chat Story', info: 'New Chat 44', image: '/assets/Shadow Exclusive/Shadow Exclusive 3.jpg' },
      { id: 504, title: 'My Princess Roommate', type: 'Manga', info: 'New Ep. 9', image: '/assets/Shadow Exclusive/Shadow Exclusive 4.jpg' },
      { id: 505, title: 'CEO in the Rain', type: 'Novel', info: 'New Ep. 17', image: '/assets/Shadow Exclusive/Shadow Exclusive 5.jpg' },
      { id: 506, title: 'Under the Same Rain', type: 'Manga', info: 'New Ep. 21', image: '/assets/Shadow Exclusive/Shadow Exclusive 6.jpg' },
    ],
  },
  Downloads: {
    context: {
      label: 'Recently Downloaded',
      title: 'The Omega of the Dragon',
      subtitle: 'Saved offline and ready to read anytime.',
      meta: 'Downloaded • Up to Ep. 47',
      image: '/assets/Update Today/Update Today 7.jpg',
      to: '/story/601',
    },
    books: [
      { id: 601, title: 'The Omega of the Dragon', type: 'Novel', info: 'Downloaded', image: '/assets/Update Today/Update Today 7.jpg', badge: 'END' },
      { id: 602, title: 'My Chubby Princess', type: 'Manga', info: 'Downloaded', image: '/assets/Trending%20Now/Trending%201.jpg' },
      { id: 603, title: 'Marrying the Uncle of EX', type: 'Novel', info: 'Downloaded', image: '/assets/Trending%20Now/Trending%202.jpg' },
      { id: 604, title: 'Late Night Messages', type: 'Chat Story', info: 'Downloaded', image: '/assets/Trending%20Now/Trending%203.jpg' },
      { id: 605, title: 'Promise in Spring', type: 'Novel', info: 'Downloaded', image: '/assets/Trending%20Now/Trending%204.jpg' },
      { id: 606, title: 'Her Soft Reply', type: 'Chat Story', info: 'Downloaded', image: '/assets/Trending%20Now/Trending%205.jpg' },
    ],
  },
}

const recommendedBooks = [
  { id: 701, title: "Ladyship's Scheme", type: 'Novel', image: '/assets/Trending%20Now/Trending%2013.jpg' },
  { id: 702, title: 'One-Night Affair', type: 'Novel', image: '/assets/Trending%20Now/Trending%2014.jpg' },
  { id: 703, title: 'Infertile CEO', type: 'Novel', image: '/assets/Trending%20Now/Trending%2015.jpg' },
  { id: 704, title: 'Chat Me at Midnight', type: 'Chat Story', image: '/assets/Trending%20Now/Trending%2016.jpg' },
  { id: 705, title: 'Moon Campus', type: 'Manga', image: '/assets/Trending%20Now/Trending%2017.jpg' },
  { id: 706, title: 'Your Winter Letter', type: 'Novel', image: '/assets/Trending%20Now/Trending%2018.jpg' },
]

function getActionText(tab) {
  if (tab === 'Recents') return 'Clear'
  if (tab === 'Subscribed') return 'Manage'
  return 'Edit'
}

function getSubtitle(tab) {
  if (tab === 'Recents') return 'Pick up where you left off.'
  if (tab === 'Subscribed') return 'Follow the latest updates from stories you love.'
  return 'Available offline anytime.'
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-3xl border border-[#ececec] bg-[#fafafa] px-5 py-10 text-center">
      <h3 className="text-[16px] font-extrabold text-[#111]">{title}</h3>
      <p className="mt-2 text-[13px] text-[#7a7a7a]">{text}</p>
    </div>
  )
}

function EndBadge() {
  return (
    <div className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#ff9a44] to-[#fc6076] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm">
      END
    </div>
  )
}

function LibraryBookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="relative overflow-hidden rounded-2xl bg-[#efefef] shadow-sm">
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

        {book.badge === 'END' ? <EndBadge /> : null}
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

function RecommendationCard({ book }) {
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
      </div>
    </Link>
  )
}

export default function Library() {
  const [activeTab, setActiveTab] = useState('Subscribed')
  const [activeType, setActiveType] = useState('All')

  const currentSection = libraryData[activeTab]

  const filteredBooks = useMemo(() => {
    if (!currentSection?.books) return []
    if (activeType === 'All') return currentSection.books
    return currentSection.books.filter((book) => book.type === activeType)
  }, [currentSection, activeType])

  const filteredRecommendations = useMemo(() => {
    if (activeType === 'All') return recommendedBooks
    return recommendedBooks.filter((book) => book.type === activeType)
  }, [activeType])

  const actionText = getActionText(activeTab)
  const subtitle = getSubtitle(activeTab)

  return (
    <>
      <style>{`
        body {
          background: #ffffff;
          font-family: 'Inter', 'Kantumruy Pro', sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tab-active-lib::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -10px;
          width: 22px;
          height: 4px;
          border-radius: 9999px;
          background: #ff3b5c;
        }
      `}</style>

      <div className="pb-[88px]">
        <header className="sticky top-0 z-[60] border-b border-[#f3f3f3] bg-white/95 backdrop-blur-sm">
          <div className="px-4 pt-5 sm:px-5">
            <div className="flex items-end justify-between gap-4">
              <div className="flex min-w-0 items-end gap-5 overflow-x-auto no-scrollbar">
                {topTabs.map((tab) => {
                  const active = tab === activeTab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative shrink-0 pb-3 text-[13px] font-bold transition-colors sm:text-[14px] ${
                        active ? 'tab-active-lib text-[#111]' : 'text-[#a1a1aa]'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>

              <button className="shrink-0 pb-3 text-[13px] font-semibold text-[#5f5f68] transition hover:text-[#111]">
                {actionText}
              </button>
            </div>

            <p className="pb-4 pt-2 text-[12px] text-[#8b8b95] sm:text-[13px]">
              {subtitle}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
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
          {currentSection?.context ? (
            <section className="pt-5">
              <Link
                to={currentSection.context.to}
                className="group block rounded-[24px] border border-[#efefef] bg-[#fafafa] p-4 transition hover:bg-[#f7f7f7]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[82px] shrink-0 overflow-hidden rounded-2xl bg-[#ececec] shadow-sm sm:w-[90px]">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={currentSection.context.image}
                        alt={currentSection.context.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 pr-2">
                    <div className="mb-1 inline-flex rounded-full bg-[#fff1f4] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#ff3b5c]">
                      {currentSection.context.label}
                    </div>

                    <h2 className="line-clamp-1 text-[15px] font-extrabold tracking-tight text-[#111] sm:text-[16px]">
                      {currentSection.context.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7a7a82]">
                      {currentSection.context.subtitle}
                    </p>

                    <p className="mt-2 text-[11px] font-semibold text-[#5f78ff]">
                      {currentSection.context.meta}
                    </p>
                  </div>

                  <div className="shrink-0 text-[#c2c2c8]">
                    <i className="fas fa-chevron-right text-[14px]" />
                  </div>
                </div>
              </Link>
            </section>
          ) : null}

          {activeTab === 'Subscribed' ? (
            <SubscriptionsSection books={filteredBooks} seeAllTo="/subscriptions" />
          ) : (
            <section className="pt-7">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-extrabold tracking-tight text-[#111]">
                  {activeTab === 'Recents' ? 'Your Recent Stories' : 'Your Downloads'}
                </h3>
              </div>

              {filteredBooks.length ? (
                <div className="grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-4 md:gap-y-0">
                  {filteredBooks.map((book) => (
                    <LibraryBookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={activeTab === 'Recents' ? 'No recent stories yet' : 'No downloads yet'}
                  text={
                    activeTab === 'Recents'
                      ? 'Your recently opened stories will appear here.'
                      : 'Download stories to read offline anytime.'
                  }
                />
              )}
            </section>
          )}

          <section className="pt-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-extrabold tracking-tight text-[#111]">
                You Might Like
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-x-3 gap-y-7 md:grid-cols-6 md:gap-x-4 md:gap-y-0">
              {filteredRecommendations.map((book) => (
                <RecommendationCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

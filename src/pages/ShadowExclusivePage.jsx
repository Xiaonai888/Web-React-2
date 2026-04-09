import { useState } from 'react'

const featureCards = [
  {
    title: 'Ads-Free',
    subtitle: 'No interruptions while reading',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 8l8 8M16 8l-8 8" />
      </svg>
    ),
  },
  {
    title: '1 Free Book',
    subtitle: 'Every 7 days',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17.5A2.5 2.5 0 0 0 17.5 17H5z" />
        <path d="M5 4.5v15A2.5 2.5 0 0 0 7.5 22H20" />
      </svg>
    ),
  },
  {
    title: 'Early Access',
    subtitle: 'Read premium releases first',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
]

const sections = [
  {
    id: 'featured',
    title: 'Shadow Picks',
    subtitle: 'Carefully selected stories for premium members',
    layout: 'featured',
    books: [
      { id: 1, title: 'The King and Me', episode: 'Up to Ep. 126', genre: 'Royal Romance', image: '' },
      { id: 2, title: 'Infinite Deduction', episode: 'Up to Ep. 60', genre: 'Mystery', image: '' },
      { id: 3, title: 'Coddled Rotten Brothers', episode: 'Up to Ep. 141', genre: 'Drama', image: '' },
      { id: 4, title: 'The Bestselling Empress', episode: 'Up to Ep. 167', genre: 'Fantasy', image: '' },
      { id: 5, title: 'All I Am to Her', episode: 'Up to Ep. 105', genre: 'Historical', image: '' },
      { id: 6, title: 'Touch Me Again If You Dare', episode: 'Up to Ep. 55', genre: 'Action', image: '' },
    ],
  },
  {
    id: 'heart-beating-zone',
    title: 'Heart Beating Zone',
    subtitle: 'Kiss, blush, and romance you cannot skip',
    layout: 'compact',
    books: [
      { id: 7, title: 'My Lovely Troublemaker', episode: 'Up to Ep. 99', genre: 'Romance', image: '' },
      { id: 8, title: 'Caught by My Baby’s Daddy', episode: 'Up to Ep. 311', genre: 'CEO', image: '' },
      { id: 9, title: 'My Secret Crush', episode: 'Up to S3 Ep. 86', genre: 'School Love', image: '' },
      { id: 10, title: 'Half My Tyrant, Half My Baby', episode: 'Up to Ep. 200', genre: 'Fantasy', image: '' },
      { id: 11, title: 'Comeback of the Lady', episode: 'Up to Ep. 204', genre: 'Drama', image: '' },
      { id: 12, title: 'From Somebody to Nobody Again', episode: 'Up to Ep. 163', genre: 'Romance', image: '' },
    ],
  },
  {
    id: 'mind-blowing-plot-twists',
    title: 'Mind-Blowing Plot Twists',
    subtitle: 'Stories that change everything in one episode',
    layout: 'compact',
    books: [
      { id: 13, title: 'Milking My Disciples', episode: 'Up to Ep. 130', genre: 'Eastern Fantasy', image: '' },
      { id: 14, title: 'The Battle for Humanity', episode: 'Up to Ep. 65', genre: 'Action', image: '' },
      { id: 15, title: 'Demon Realm', episode: 'Up to Ep. 62', genre: 'Sci-Fi', image: '' },
      { id: 16, title: 'Doomspawn', episode: 'Up to Ep. 46', genre: 'Thriller', image: '' },
      { id: 17, title: 'Celestial Immortal', episode: 'Up to Ep. 250', genre: 'Martial Arts', image: '' },
      { id: 18, title: 'Trapped for 3000 Years', episode: 'Up to Ep. 64', genre: 'Fantasy', image: '' },
    ],
  },
  {
    id: 'heartstopper',
    title: 'Heartstopper',
    subtitle: 'Soft chemistry and unforgettable emotional tension',
    layout: 'compact',
    books: [
      { id: 19, title: 'Your Majesty’s Pet', episode: 'Up to Ep. 83', genre: 'BL', image: '' },
      { id: 20, title: 'His Highness’ Male Consort', episode: 'Up to Ep. 70', genre: 'Historical', image: '' },
      { id: 21, title: 'Sensitive Touch', episode: 'Up to Extra 2', genre: 'BL', image: '' },
      { id: 22, title: 'The Priest Dreaming of a Dragon', episode: 'Up to Ep. 50', genre: 'Fantasy', image: '' },
      { id: 23, title: 'Intoxicated Love', episode: 'Up to Extra 3', genre: 'Romance', image: '' },
      { id: 24, title: 'My Lovely Trouble', episode: 'Up to Ep. 99', genre: 'Drama', image: '' },
    ],
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals for Premium',
    subtitle: 'Early access to new internal releases',
    layout: 'compact',
    books: [
      { id: 25, title: 'Tangled Romance', episode: 'Up to Ep. 73', genre: 'Romance', image: '' },
      { id: 26, title: 'Partners in Crime', episode: 'Up to Ep. 57', genre: 'Drama', image: '' },
      { id: 27, title: 'City of Sanctuary', episode: 'Up to Ep. 93', genre: 'Mystery', image: '' },
      { id: 28, title: 'Rebirth of the Ultimate Master', episode: 'Up to Ep. 71', genre: 'Eastern Fantasy', image: '' },
      { id: 29, title: 'Where Do You Think You’re Going', episode: 'Up to Ep. 32', genre: 'Romance', image: '' },
      { id: 30, title: 'Demon Realm Can’t Wait to Quit', episode: 'Up to Ep. 62', genre: 'Action', image: '' },
    ],
  },
  {
    id: 'premium-free-access',
    title: 'Premium Free Access',
    subtitle: 'Read selected premium stories for free as a member',
    layout: 'compact',
    books: [
      { id: 31, title: 'How to Be a Princess', episode: 'Fantasy', genre: 'Fantasy', image: '' },
      { id: 32, title: 'Eternal Club', episode: 'Drama', genre: 'Drama', image: '' },
      { id: 33, title: 'Revenge Gone Wrong', episode: 'Romance', genre: 'Romance', image: '' },
      { id: 34, title: 'Milking My Disciples', episode: 'Eastern Fantasy', genre: 'Eastern Fantasy', image: '' },
      { id: 35, title: 'Rebirth of the Ultimate Master', episode: 'Eastern Fantasy', genre: 'Eastern Fantasy', image: '' },
      { id: 36, title: 'Where Do You Think You’re Going', episode: 'Romance', genre: 'Romance', image: '' },
    ],
  },
  {
    id: 'premium-early-access',
    title: 'Premium Early Access',
    subtitle: 'Read before everyone else',
    layout: 'compact',
    books: [
      { id: 37, title: 'I Dominate a Magic Continent', episode: 'Up to Ep. 71', genre: 'Fantasy', image: '' },
      { id: 38, title: 'The King and Me', episode: 'Up to Ep. 126', genre: 'Royal Romance', image: '' },
      { id: 39, title: 'My Five Bigname Daddies', episode: 'Up to Ep. 138', genre: 'Drama', image: '' },
      { id: 40, title: 'Infinite Deduction', episode: 'Up to Ep. 60', genre: 'Mystery', image: '' },
      { id: 41, title: 'Coddled Rotten Brothers', episode: 'Up to Ep. 141', genre: 'Drama', image: '' },
      { id: 42, title: 'Target 100 Million Points', episode: 'Up to Ep. 96', genre: 'Action', image: '' },
    ],
  },
]

function CrownBadge() {
  return (
    <div className="absolute top-2 right-2 z-10 rounded-full bg-[#23182d]/90 border border-white/10 px-1.5 py-1 shadow-md">
      <div className="flex items-center gap-1">
        <svg className="w-2.5 h-2.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18l-1.6-9-4.9 3.4L12 6 9.5 12.4 4.6 9 3 18z" />
        </svg>
        <span className="text-[8px] font-black text-yellow-300 uppercase leading-none">Free</span>
      </div>
    </div>
  )
}

function PlaceholderCover({ featured = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#2a2036] border border-yellow-400/70 shadow-[0_0_10px_rgba(250,204,21,0.22)] flex items-center justify-center ${
        featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <div className="text-center px-3">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10">
          <svg className="w-5 h-5 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" />
            <path d="M8 4v13a3 3 0 003 3" />
          </svg>
        </div>
        <div className="text-[11px] font-bold text-white/35 uppercase tracking-wider">Add Cover</div>
      </div>
      <CrownBadge />
    </div>
  )
}

function BookCard({ book, featured = false }) {
  const hasImage = typeof book.image === 'string' && book.image.trim() !== ''

  return (
    <div className="group cursor-pointer min-w-0">
      {hasImage ? (
        <div
          className={`relative overflow-hidden rounded-2xl bg-[#2a2036] border border-yellow-400/70 shadow-[0_0_10px_rgba(250,204,21,0.22)] ${
            featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
          }`}
        >
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <CrownBadge />
        </div>
      ) : (
        <PlaceholderCover featured={featured} />
      )}

      <div className="mt-2 px-0.5 min-w-0">
        <h3 className="truncate text-[12px] font-bold text-white">{book.title}</h3>
        <p className="truncate text-[10px] text-white/55 mt-1">{book.episode}</p>
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between mb-4 gap-3">
      <div className="min-w-0">
        <h2 className="text-white text-[15px] font-extrabold tracking-tight">{title}</h2>
        <p className="text-[11px] text-white/55 mt-0.5">{subtitle}</p>
      </div>
      <button className="shrink-0 text-[10px] font-black uppercase tracking-wider text-white/50">
        More
      </button>
    </div>
  )
}

export default function ShadowExclusivePage() {
  const [activeTab, setActiveTab] = useState('Popular')
  const tabs = ['Popular', 'Daily', 'Weekly', 'All Time']

  return (
    <div className="min-h-screen bg-[#17091f] text-white pb-32 md:pb-24">
      <header className="sticky top-0 z-40 bg-[#17091f]/95 backdrop-blur-md">
        <div className="h-14 flex items-center justify-center px-4">
          <h1 className="text-[18px] font-extrabold tracking-tight">Shadow Exclusive</h1>
        </div>
      </header>

      <main className="px-4">
        <section className="mt-4">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#5b2ca1] via-[#3a1570] to-[#1c0b2b] p-5 shadow-2xl">
            <div className="absolute -top-12 -right-10 h-28 w-28 rounded-full bg-yellow-300/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-fuchsia-400/10 blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18l-1.6-9-4.9 3.4L12 6 9.5 12.4 4.6 9 3 18z" />
                </svg>
                Premium Subscription
              </div>

              <h2 className="mt-4 text-[28px] leading-[1.05] font-black text-white">
                Shadow
                <br />
                Membership
              </h2>

              <p className="mt-3 max-w-xs text-[12px] leading-5 text-white/75">
                Unlock selected premium stories, enjoy ads-free reading, and get early access to internal releases.
              </p>

              <button className="mt-5 w-full rounded-[22px] bg-[#ffd34d] py-4 text-[14px] font-black uppercase tracking-wide text-[#1d1027] shadow-lg active:scale-[0.99]">
                Subscribe Now
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {featureCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/8 bg-[#2a1536] px-3 py-4 text-center shadow-md"
              >
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#3d2250] text-yellow-300">
                  {item.icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">
                  {item.title}
                </div>
                <div className="mt-1 text-[9px] text-white/55 font-semibold">{item.subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar rounded-full bg-[#25142f] p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`min-w-fit rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-[#ffd34d] text-[#1d1027]' : 'text-white/45'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7">
          {sections.map((section, index) => (
            <div key={section.id} className={index === sections.length - 1 ? 'mb-0' : 'mb-9'}>
              <SectionHeader title={section.title} subtitle={section.subtitle} />

              <div
                className={
                  section.layout === 'featured'
                    ? 'grid grid-cols-2 md:grid-cols-6 gap-x-3 gap-y-5'
                    : 'grid grid-cols-3 md:grid-cols-6 gap-x-3 gap-y-5'
                }
              >
                {section.books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    featured={section.layout === 'featured'}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="rounded-[24px] border border-white/8 bg-[#201129] px-4 py-5 md:px-5 md:py-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 pr-2">
                <h3 className="text-[13px] font-extrabold text-white">Got a question? Contact us</h3>
                <p className="mt-1 text-[10px] leading-4 text-white/50 break-words">
                  Premium support for Shadow members
                </p>
              </div>

              <button className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white">
                Support
              </button>
            </div>
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

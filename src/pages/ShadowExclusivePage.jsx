import { useState } from 'react'

const featureCards = [
  {
    title: 'Ads-Free',
    subtitle: 'No interruptions',
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
    subtitle: 'Read first',
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
      {
        id: 1,
        title: 'The King and Me',
        chapter: 'Up to Ch. 126',
        genre: 'Royal Romance',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 2,
        title: 'Infinite Deduction',
        chapter: 'Up to Ch. 60',
        genre: 'Mystery',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 3,
        title: 'Coddled Rotten Brothers',
        chapter: 'Up to Ch. 141',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 4,
        title: 'The Bestselling Empress',
        chapter: 'Up to Ch. 167',
        genre: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 5,
        title: 'All I Am to Her',
        chapter: 'Up to Ch. 105',
        genre: 'Historical',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 6,
        title: 'Touch Me Again If You Dare',
        chapter: 'Up to Ch. 55',
        genre: 'Action',
        image: 'https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'heart-beating-zone',
    title: 'Heart Beating Zone',
    subtitle: 'Kiss, blush, and romance you cannot skip',
    layout: 'compact',
    books: [
      {
        id: 7,
        title: 'My Lovely Troublemaker',
        chapter: 'Up to Ch. 99',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 8,
        title: 'Caught by My Baby’s Daddy',
        chapter: 'Up to Ch. 311',
        genre: 'CEO',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 9,
        title: 'My Secret Crush',
        chapter: 'Up to Ch. 86',
        genre: 'School Love',
        image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 10,
        title: 'Half My Tyrant, Half My Baby',
        chapter: 'Up to Ch. 200',
        genre: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 11,
        title: 'Comeback of the Lady',
        chapter: 'Up to Ch. 204',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 12,
        title: 'From Somebody to Nobody Again',
        chapter: 'Up to Ch. 163',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'mind-blowing-plot-twists',
    title: 'Mind-Blowing Plot Twists',
    subtitle: 'Stories that change everything in one chapter',
    layout: 'compact',
    books: [
      {
        id: 13,
        title: 'Milking My Disciples',
        chapter: 'Up to Ch. 130',
        genre: 'Eastern Fantasy',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 14,
        title: 'The Battle for Humanity',
        chapter: 'Up to Ch. 65',
        genre: 'Action',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 15,
        title: 'Demon Realm',
        chapter: 'Up to Ch. 62',
        genre: 'Sci-Fi',
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 16,
        title: 'Doomspawn',
        chapter: 'Up to Ch. 46',
        genre: 'Thriller',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 17,
        title: 'Celestial Immortal',
        chapter: 'Up to Ch. 250',
        genre: 'Martial Arts',
        image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 18,
        title: 'Trapped for 3000 Years',
        chapter: 'Up to Ch. 64',
        genre: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'heartstopper',
    title: 'Heartstopper',
    subtitle: 'Soft chemistry and unforgettable emotional tension',
    layout: 'compact',
    books: [
      {
        id: 19,
        title: 'Your Majesty’s Pet',
        chapter: 'Up to Ch. 83',
        genre: 'BL',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 20,
        title: 'His Highness’ Male Consort',
        chapter: 'Up to Ch. 70',
        genre: 'Historical',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 21,
        title: 'Sensitive Touch',
        chapter: 'Up to Extra 2',
        genre: 'BL',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 22,
        title: 'The Priest Dreaming of a Dragon',
        chapter: 'Up to Ch. 50',
        genre: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 23,
        title: 'Intoxicated Love',
        chapter: 'Up to Extra 3',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 24,
        title: 'My Lovely Trouble',
        chapter: 'Up to Ch. 99',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals for Premium',
    subtitle: 'Early access to new internal releases',
    layout: 'compact',
    books: [
      {
        id: 25,
        title: 'Tangled Romance',
        chapter: 'Up to Ch. 73',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 26,
        title: 'Partners in Crime',
        chapter: 'Up to Ch. 57',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 27,
        title: 'City of Sanctuary',
        chapter: 'Up to Ch. 93',
        genre: 'Mystery',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 28,
        title: 'Rebirth of the Ultimate Master',
        chapter: 'Up to Ch. 71',
        genre: 'Eastern Fantasy',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 29,
        title: 'Where Do You Think You’re Going',
        chapter: 'Up to Ch. 32',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 30,
        title: 'Demon Realm Can’t Wait to Quit',
        chapter: 'Up to Ch. 62',
        genre: 'Action',
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'premium-free-access',
    title: 'Premium Free Access',
    subtitle: 'Read selected premium stories for free as a member',
    layout: 'compact',
    books: [
      {
        id: 31,
        title: 'How to Be a Princess',
        chapter: 'Fantasy',
        genre: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 32,
        title: 'Eternal Club',
        chapter: 'Drama',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 33,
        title: 'Revenge Gone Wrong',
        chapter: 'Romance',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1491841651911-c44c30c34548?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 34,
        title: 'Milking My Disciples',
        chapter: 'Eastern Fantasy',
        genre: 'Eastern Fantasy',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 35,
        title: 'Rebirth of the Ultimate Master',
        chapter: 'Eastern Fantasy',
        genre: 'Eastern Fantasy',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 36,
        title: 'Where Do You Think You’re Going',
        chapter: 'Romance',
        genre: 'Romance',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'premium-early-access',
    title: 'Premium Early Access',
    subtitle: 'Read before everyone else',
    layout: 'compact',
    books: [
      {
        id: 37,
        title: 'I Dominate a Magic Continent',
        chapter: 'Up to Ch. 71',
        genre: 'Fantasy',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 38,
        title: 'The King and Me',
        chapter: 'Up to Ch. 126',
        genre: 'Royal Romance',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 39,
        title: 'My Five Bigname Daddies',
        chapter: 'Up to Ch. 138',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 40,
        title: 'Infinite Deduction',
        chapter: 'Up to Ch. 60',
        genre: 'Mystery',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 41,
        title: 'Coddled Rotten Brothers',
        chapter: 'Up to Ch. 141',
        genre: 'Drama',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 42,
        title: 'Target 100 Million Points',
        chapter: 'Up to Ch. 96',
        genre: 'Action',
        image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=500&auto=format&fit=crop',
      },
    ],
  },
]

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="min-w-0 pr-3">
        <h2 className="text-white text-[15px] font-extrabold tracking-tight">{title}</h2>
        <p className="text-[11px] text-white/55 mt-0.5">{subtitle}</p>
      </div>
      <button className="shrink-0 text-[10px] font-black uppercase tracking-wider text-white/50">
        More
      </button>
    </div>
  )
}

function FreeBadge() {
  return (
    <div className="absolute top-2 right-2 z-10 rounded-full bg-[#23182d]/90 border border-white/10 px-1.5 py-1 shadow-md">
      <div className="flex items-center gap-1">
        <svg className="w-2.5 h-2.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-[8px] font-black text-yellow-300 uppercase leading-none">Free</span>
      </div>
    </div>
  )
}

function BookCard({ book, featured = false }) {
  return (
    <div className="group cursor-pointer">
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#2a2036] border border-white/5 shadow-lg ${
          featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
        }`}
      >
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x800/3a2a4a/f3f4f6?text=Cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <FreeBadge />
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="truncate text-[12px] font-bold text-white">{book.title}</h3>
        <p className="truncate text-[10px] text-white/55 mt-1">{book.chapter}</p>
      </div>
    </div>
  )
}

export default function ShadowExclusivePage() {
  const [activeTab, setActiveTab] = useState('Popular')
  const tabs = ['Popular', 'Daily', 'Weekly', 'All Time']

  return (
    <div className="min-h-screen bg-[#17091f] text-white pb-8">
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
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium Subscription
              </div>

              <h2 className="mt-4 text-[30px] leading-[1.05] font-black text-white">
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
                  activeTab === tab
                    ? 'bg-[#ffd34d] text-[#1d1027]'
                    : 'text-white/45'
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
                    ? 'grid grid-cols-2 gap-x-3 gap-y-5'
                    : 'grid grid-cols-3 gap-x-3 gap-y-5'
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
          <div className="rounded-[24px] border border-white/8 bg-[#201129] px-4 py-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-[13px] font-extrabold text-white">Got a question? Contact us</h3>
                <p className="mt-1 text-[10px] text-white/50">Premium support for Shadow members</p>
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

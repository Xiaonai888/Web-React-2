import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const featureCards = [
  { title: 'Ads-Free', subtitle: 'No interruptions while reading', iconText: '🚫' },
  { title: 'Premium Stories', subtitle: 'Approved by Shadow', iconText: '👑' },
  { title: 'Early Access', subtitle: 'Read selected releases first', iconText: '⚡' },
]

const sectionConfigs = [
  {
    id: 'featured',
    title: 'Shadow Picks',
    subtitle: 'Carefully selected stories for premium members',
    layout: 'featured',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=featured&sort=updated',
  },
  {
    id: 'new_exclusive',
    title: 'New Exclusive',
    subtitle: 'Fresh premium stories recently approved',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=new_exclusive&sort=latest',
  },
  {
    id: 'popular_exclusive',
    title: 'Popular Exclusive',
    subtitle: 'Premium stories readers open the most',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=popular_exclusive&sort=popular',
  },
  {
    id: 'editor_pick',
    title: 'Editor Pick',
    subtitle: 'Admin-curated premium recommendations',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=editor_pick&sort=updated',
  },
  {
    id: 'premium_romance',
    title: 'Premium Romance',
    subtitle: 'Exclusive romance stories for members',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=premium_romance&sort=updated',
  },
  {
    id: 'premium_fantasy',
    title: 'Premium Fantasy',
    subtitle: 'Exclusive fantasy stories for members',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=premium_fantasy&sort=updated',
  },
  {
    id: 'completed_exclusive',
    title: 'Completed Exclusive',
    subtitle: 'Premium stories ready for binge reading',
    layout: 'compact',
    url: '/api/public/shadow-exclusive/stories?limit=6&section=completed_exclusive&sort=updated',
  },
]

function CrownBadge() {
  return (
    <div className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-[#23182d]/90 px-1.5 py-1 shadow-md">
      <div className="flex items-center gap-1">
        <svg className="h-2.5 w-2.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18l-1.6-9-4.9 3.4L12 6 9.5 12.4 4.6 9 3 18z" />
        </svg>
        <span className="text-[8px] font-black uppercase leading-none text-yellow-300">Free</span>
      </div>
    </div>
  )
}

function PlaceholderCover({ featured = false }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-yellow-400/70 bg-[#2a2036] shadow-[0_0_10px_rgba(250,204,21,0.22)] ${
        featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <div className="px-3 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <svg className="h-5 w-5 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" />
            <path d="M8 4v13a3 3 0 003 3" />
          </svg>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-white/35">No Cover</div>
      </div>
      <CrownBadge />
    </div>
  )
}

function normalizeBook(story) {
  const totalEpisodes = Number(story.total_episodes || 0)

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    episode: totalEpisodes > 0 ? `Up to Ep. ${totalEpisodes}` : 'Premium story',
    genre: story.main_genre || 'Premium',
    image: story.cover_url || '',
    link: `/story/${story.id}`,
  }
}

function BookCard({ book, featured = false }) {
  const navigate = useNavigate()
  const hasImage = typeof book.image === 'string' && book.image.trim() !== ''

  return (
    <button type="button" onClick={() => navigate(book.link)} className="group min-w-0 cursor-pointer text-left">
      {hasImage ? (
        <div
          className={`relative overflow-hidden rounded-2xl border border-yellow-400/70 bg-[#2a2036] shadow-[0_0_10px_rgba(250,204,21,0.22)] ${
            featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'
          }`}
        >
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <CrownBadge />
        </div>
      ) : (
        <PlaceholderCover featured={featured} />
      )}

      <div className="mt-2 min-w-0 px-0.5">
        <h3 className="truncate text-[12px] font-bold text-white">{book.title}</h3>
        <p className="mt-1 truncate text-[10px] text-white/55">{book.episode}</p>
      </div>
    </button>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[15px] font-extrabold tracking-tight text-white">{title}</h2>
        <p className="mt-0.5 text-[11px] text-white/55">{subtitle}</p>
      </div>
      <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-white/50">
        Premium
      </span>
    </div>
  )
}

function LoadingBooks({ featured }) {
  return (
    <div className={featured ? 'grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-6' : 'grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-6'}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className={`${featured ? 'aspect-[1.28/1]' : 'aspect-[2/3]'} animate-pulse rounded-2xl bg-white/10`} />
          <div className="mt-2 h-3 animate-pulse rounded-full bg-white/10" />
          <div className="mt-2 h-2 w-2/3 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  )
}

function EmptySection({ featured }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-6 text-center text-[11px] font-semibold text-white/50 ${
        featured ? '' : ''
      }`}
    >
      No approved stories in this section yet.
    </div>
  )
}

function ExclusiveSection({ section }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchBooks() {
      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}${section.url}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load Shadow Exclusive stories')
        }

        if (!ignore) {
          setBooks((data.stories || []).map(normalizeBook))
        }
      } catch (error) {
        console.error(`ShadowExclusivePage ${section.id} error:`, error)

        if (!ignore) {
          setBooks([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchBooks()

    return () => {
      ignore = true
    }
  }, [section])

  const isFeatured = section.layout === 'featured'

  return (
    <div className="mb-9">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      {loading ? (
        <LoadingBooks featured={isFeatured} />
      ) : books.length ? (
        <div className={isFeatured ? 'grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-6' : 'grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-6'}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} featured={isFeatured} />
          ))}
        </div>
      ) : (
        <EmptySection featured={isFeatured} />
      )}
    </div>
  )
}

export default function ShadowExclusivePage() {
  const [activeTab, setActiveTab] = useState('Popular')
  const tabs = ['Popular', 'Daily', 'Weekly', 'All Time']

  const displaySections = useMemo(() => sectionConfigs, [])

  return (
    <div className="min-h-screen bg-[#17091f] pb-32 text-white md:pb-24">
      <header className="sticky top-0 z-40 bg-[#17091f]/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-[18px] font-extrabold tracking-tight">Shadow Exclusive</h1>
        </div>
      </header>

      <main className="px-4">
        <section className="mt-4">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#5b2ca1] via-[#3a1570] to-[#1c0b2b] p-5 shadow-2xl">
            <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-yellow-300/15 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-fuchsia-400/10 blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18l-1.6-9-4.9 3.4L12 6 9.5 12.4 4.6 9 3 18z" />
                </svg>
                Premium Subscription
              </div>

              <h2 className="mt-4 text-[28px] font-black leading-[1.05] text-white">
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
              <div key={item.title} className="rounded-[22px] border border-white/8 bg-[#2a1536] px-3 py-4 text-center shadow-md">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#3d2250] text-[18px] text-yellow-300">
                  {item.iconText}
                </div>
                <div className="text-[10px] font-black uppercase leading-tight tracking-tight text-white">
                  {item.title}
                </div>
                <div className="mt-1 text-[9px] font-semibold text-white/55">{item.subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full bg-[#25142f] p-1.5">
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
          {displaySections.map((section) => (
            <ExclusiveSection key={section.id} section={section} />
          ))}
        </section>

        <section className="mt-8">
          <div className="rounded-[24px] border border-white/8 bg-[#201129] px-4 py-5 shadow-lg md:px-5 md:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 pr-2">
                <h3 className="text-[13px] font-extrabold text-white">Got a question? Contact us</h3>
                <p className="mt-1 break-words text-[10px] leading-4 text-white/50">
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

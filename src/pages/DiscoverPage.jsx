import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const storyItems = [
  {
    id: 'music',
    name: 'Music',
    label: 'Music',
    avatar: '♪',
    badge: '',
    type: 'feature',
    image: 'linear-gradient(160deg, #4ec7a5 0%, #45b4df 100%)',
  },
  {
    id: 'create',
    name: 'Create story',
    label: 'Create story',
    avatar: '+',
    badge: '',
    type: 'create',
    image: 'linear-gradient(160deg, #1f2937 0%, #93c5fd 100%)',
  },
  {
    id: 'luna-story',
    name: 'Luna Hart',
    label: 'New episode',
    avatar: 'LH',
    badge: 'LIVE',
    type: 'author',
    image: 'linear-gradient(160deg, #111827 0%, #4f46e5 100%)',
  },
  {
    id: 'mika-story',
    name: 'Mika Rose',
    label: 'New book',
    avatar: 'MR',
    badge: 'NEW',
    type: 'author',
    image: 'linear-gradient(160deg, #3b0764 0%, #f472b6 100%)',
  },
  {
    id: 'nora-story',
    name: 'Nora Vale',
    label: 'Trending',
    avatar: 'NV',
    badge: 'HOT',
    type: 'author',
    image: 'linear-gradient(160deg, #7f1d1d 0%, #f59e0b 100%)',
  },
  {
    id: 'skye-story',
    name: 'Skye Novel',
    label: 'Behind scene',
    avatar: 'SN',
    badge: '',
    type: 'author',
    image: 'linear-gradient(160deg, #064e3b 0%, #14b8a6 100%)',
  },
]

const feedItems = [
  {
    id: 'post-1',
    kind: 'followed_post',
    author: 'Luna Hart',
    handle: 'Author Page',
    time: '9h',
    avatar: 'LH',
    verified: true,
    text: 'Chapter 25 is out now. A quiet promise becomes the most dangerous lie.',
    imageLayout: 'two',
    stats: { likes: 19, comments: 1, shares: 3 },
  },
  {
    id: 'ad-1',
    kind: 'ad',
    sponsor: 'Shadow Mall',
    title: 'Special book bundle',
    description: 'Discover signed novels, limited merch, and reader gifts from official publishers.',
    cta: 'Shop now',
  },
  {
    id: 'trending-1',
    kind: 'trending',
    title: 'Trending now',
    items: [
      { rank: 1, title: 'The Last Rose Contract', meta: 'Romance · 18.2K reads' },
      { rank: 2, title: 'Blood Moon Academy', meta: 'Fantasy · 15.7K reads' },
      { rank: 3, title: 'CEO Hidden Bride', meta: 'Drama · 12.9K reads' },
    ],
  },
  {
    id: 'post-2',
    kind: 'followed_post',
    author: 'Mika Rose',
    handle: 'Followed Author',
    time: '12h',
    avatar: 'MR',
    verified: false,
    text: 'I just shared a new cover reveal. Thank you for waiting for this story.',
    imageLayout: 'single',
    stats: { likes: 42, comments: 8, shares: 6 },
  },
  {
    id: 'authors-1',
    kind: 'recommended_authors',
    title: 'Authors you may like',
    authors: [
      { name: 'Ari Moon', meta: 'Soft romance writer', avatar: 'AM' },
      { name: 'Nora Vale', meta: 'Dark fantasy author', avatar: 'NV' },
      { name: 'Skye Novel', meta: 'Emotional drama', avatar: 'SN' },
    ],
  },
]

function Header({ hidden }) {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-[100000] bg-white shadow-sm transition-transform duration-200 ease-out"
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
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
          <Link to="/genres" className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95" aria-label="Genres">
            <img src="/assets/Icons/Genre.svg?v=2" alt="Genres" className="h-5 w-5 object-contain" />
          </Link>

          <Link to="/search" className="flex h-6 w-6 items-center justify-center transition-colors hover:text-[#111827]" aria-label="Search">
            <i className="fas fa-search" />
          </Link>

          <Link to="/notifications" className="flex h-6 w-6 items-center justify-center transition-colors hover:text-[#111827]" aria-label="Notifications">
            <i className="fas fa-bell" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function StoryCard({ item }) {
  return (
    <button
      type="button"
      className="relative h-[184px] w-[112px] shrink-0 overflow-hidden rounded-[18px] bg-white text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.98]"
      aria-label={item.name}
    >
      <div className="absolute inset-0" style={{ background: item.image }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/60" />

      <div className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-[14px] font-black text-white shadow-md">
        {item.avatar}
      </div>

      {item.badge ? (
        <div className="absolute right-2 top-3 rounded-full bg-[#f6b800] px-2 py-0.5 text-[9px] font-black text-[#111827] shadow-sm">
          {item.badge}
        </div>
      ) : null}

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
  )
}

function StorySection() {
  return (
    <section className="border-b border-gray-100 bg-white py-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
        {storyItems.map((item) => (
          <StoryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

function FeedImageGrid({ layout }) {
  if (layout === 'single') {
    return (
      <div className="h-[260px] bg-gradient-to-br from-[#3b0764] via-[#9333ea] to-[#f9a8d4]">
        <div className="flex h-full items-end p-5">
          <div className="rounded-2xl bg-black/35 px-4 py-3 backdrop-blur">
            <div className="text-[18px] font-black text-white">Cover Reveal</div>
            <div className="mt-1 text-[12px] font-bold text-white/80">Coming this week</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-[2px] bg-gray-100">
      <div className="h-[220px] bg-gradient-to-br from-[#111827] via-[#374151] to-[#7c3aed]">
        <div className="flex h-full items-end p-4">
          <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
            <div className="text-[13px] font-black text-white">New Chapter</div>
          </div>
        </div>
      </div>
      <div className="h-[220px] bg-gradient-to-br from-[#f8fafc] via-[#dbeafe] to-[#94a3b8]">
        <div className="flex h-full items-end p-4">
          <div className="rounded-xl bg-black/15 px-3 py-2 backdrop-blur">
            <div className="text-[13px] font-black text-white">Reader Gift</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FollowedPostCard({ post }) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[14px] font-black text-white">
          {post.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <div className="truncate text-[15px] font-black text-[#111827]">{post.author}</div>
                {post.verified ? <i className="fa-solid fa-circle-check text-[12px] text-[#1677ff]" /> : null}
              </div>

              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                <span>{post.handle}</span>
                <span>·</span>
                <span>{post.time}</span>
                <span>·</span>
                <i className="fa-solid fa-earth-americas text-[10px]" />
              </div>
            </div>

            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100" aria-label="More">
              <i className="fa-solid fa-ellipsis" />
            </button>
          </div>

          <p className="mt-3 text-[14px] font-semibold leading-6 text-[#111827]">{post.text}</p>
        </div>
      </div>

      <FeedImageGrid layout={post.imageLayout} />

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
  )
}

function AdsCard({ item }) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-gray-100">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f6b800]">Sponsored</div>
            <div className="mt-1 text-[16px] font-black text-[#111827]">{item.sponsor}</div>
          </div>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 active:bg-gray-100">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[18px] bg-gradient-to-br from-[#111827] via-[#4c1d95] to-[#f59e0b] p-5">
          <div className="flex h-[128px] flex-col justify-end">
            <div className="text-[22px] font-black leading-7 text-white">{item.title}</div>
            <div className="mt-2 text-[13px] font-bold leading-5 text-white/80">{item.description}</div>
          </div>
        </div>

        <button type="button" className="mt-4 w-full rounded-[14px] bg-[#1677ff] py-3 text-[14px] font-black text-white active:scale-[0.99]">
          {item.cta}
        </button>
      </div>
    </article>
  )
}

function TrendingCard({ item }) {
  const coverColors = [
    'from-[#111827] via-[#4f46e5] to-[#a78bfa]',
    'from-[#7f1d1d] via-[#dc2626] to-[#f59e0b]',
    'from-[#064e3b] via-[#0f766e] to-[#5eead4]',
  ]

  return (
    <article className="rounded-[22px] bg-white py-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <div className="text-[18px] font-black text-[#111827]">{item.title}</div>
          <div className="mt-1 text-[12px] font-bold text-gray-400">Popular books on Shadow now</div>
        </div>
        <button type="button" className="text-[12px] font-black text-[#1677ff]">See all</button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {item.items.map((novel, index) => (
          <button key={novel.rank} type="button" className="w-[104px] shrink-0 text-left active:scale-[0.98]">
            <div className={`relative h-[148px] overflow-hidden rounded-[14px] bg-gradient-to-br ${coverColors[index % coverColors.length]} shadow-sm`}>
              <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[12px] font-black text-[#111827]">
                {novel.rank}
              </div>

              <div className="absolute inset-x-3 bottom-3">
                <div className="rounded-[10px] bg-white/15 p-2 backdrop-blur">
                  <div className="line-clamp-2 text-[11px] font-black leading-[14px] text-white">
                    {novel.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 line-clamp-2 text-[12px] font-black leading-[15px] text-[#111827]">
              {novel.title}
            </div>
            <div className="mt-1 truncate text-[10px] font-bold text-gray-400">
              {novel.meta}
            </div>
          </button>
        ))}
      </div>
    </article>
  )
}

function RecommendedAuthorsCard({ item }) {
  return (
    <article className="rounded-[22px] bg-white py-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <div className="text-[18px] font-black text-[#111827]">{item.title}</div>
          <div className="mt-1 text-[12px] font-bold text-gray-400">Swipe to discover new authors</div>
        </div>
        <button type="button" className="text-[12px] font-black text-[#1677ff]">More</button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {item.authors.map((author) => (
          <div
            key={author.name}
            className="relative h-[214px] w-[152px] shrink-0 overflow-hidden rounded-[22px] bg-[#252a31] p-4 text-center shadow-sm"
          >
            <button
              type="button"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white/70 active:bg-white/10"
              aria-label="Hide author"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>

            <div className="mx-auto mt-3 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-[#111827] to-[#4f46e5] text-[18px] font-black text-white ring-4 ring-white/10">
              {author.avatar}
            </div>

            <div className="mt-4 truncate text-[16px] font-black text-white">{author.name}</div>
            <div className="mt-1 truncate text-[12px] font-bold text-white/55">{author.meta}</div>

            <button
              type="button"
              className="absolute bottom-4 left-4 right-4 rounded-[12px] bg-white py-3 text-[14px] font-black text-[#111827] active:scale-[0.98]"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </article>
  )
}
function EmptyStateCard() {
  return (
    <article className="rounded-[22px] bg-white p-5 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className="fa-solid fa-user-plus text-lg" />
      </div>
      <div className="text-[16px] font-black text-[#111827]">Follow authors to improve Discover</div>
      <div className="mx-auto mt-2 max-w-[260px] text-[13px] font-semibold leading-6 text-gray-500">
        Real followed-page updates will replace this demo feed later.
      </div>
    </article>
  )
}

function FeedRenderer({ item }) {
  if (item.kind === 'followed_post') return <FollowedPostCard post={item} />
  if (item.kind === 'ad') return <AdsCard item={item} />
  if (item.kind === 'trending') return <TrendingCard item={item} />
  if (item.kind === 'recommended_authors') return <RecommendedAuthorsCard item={item} />
  return null
}

export default function DiscoverPage() {
  const [barsHidden, setBarsHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const feed = useMemo(() => feedItems, [])

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

      <Header hidden={barsHidden} />

      <main className="pt-[72px]">
        <StorySection />

        <section className="space-y-4 px-4 py-4">
          {feed.length ? (
            feed.map((item) => <FeedRenderer key={item.id} item={item} />)
          ) : (
            <EmptyStateCard />
          )}
        </section>
      </main>
    </div>
  )
}

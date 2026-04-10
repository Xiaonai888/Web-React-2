import { Link } from 'react-router-dom'

const featuredBook = {
  id: 201,
  title: 'Name book',
  author: 'Author Name',
  cover: '/assets/Update Today/Update Today 1.jpg',
  views: '100k',
  likes: '1000',
  episodes: 'Ep 17',
  genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
  description:
    'Ika is the only survivor of a genocide of humans by demons summoned to wipe out life on his planet through a portal. During the destruction, he witnesses the genocide of humans by demons summoned from another universe.',
}

const updateBooks = [
  { id: 202, title: 'Name Novel', cover: '/assets/Update Today/Update Today 2.jpg', badge: 'red', views: '100k', episodes: 'Ep 17' },
  { id: 203, title: 'Name Novel', cover: '/assets/Update Today/Update Today 3.jpg', badge: 'yellow', views: '100k', episodes: 'Ep 17' },
  { id: 204, title: 'Name Novel', cover: '/assets/Update Today/Update Today 4.jpg', badge: 'green', views: '100k', episodes: 'Ep 17' },
  { id: 205, title: 'Name Novel', cover: '/assets/Update Today/Update Today 5.jpg', badge: 'red', views: '100k', episodes: 'Ep 17' },
  { id: 206, title: 'Name Novel', cover: '/assets/Update Today/Update Today 6.jpg', badge: 'yellow', views: '100k', episodes: 'Ep 17' },
  { id: 207, title: 'Name Novel', cover: '/assets/Update Today/Update Today 7.jpg', badge: 'green', views: '100k', episodes: 'Ep 17' },
]

const badgeConfig = {
  red: {
    text: 'END',
    className:
      'border border-red-300/80 bg-gradient-to-b from-red-400 to-red-500 text-white shadow-[0_4px_10px_rgba(239,68,68,0.28)]',
  },
  yellow: {
    text: 'UP',
    className:
      'border border-orange-200/90 bg-gradient-to-b from-amber-300 to-orange-400 text-[#4a2a00] shadow-[0_4px_10px_rgba(251,146,60,0.28)]',
  },
  green: {
    text: 'NEW',
    className:
      'border border-lime-200/90 bg-gradient-to-b from-lime-300 to-lime-400 text-[#153300] shadow-[0_4px_10px_rgba(132,204,22,0.28)]',
  },
}

function StatusBadge({ type }) {
  const badge = badgeConfig[type] || badgeConfig.green

  return (
    <div
      className={`absolute right-2.5 top-2.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] sm:right-3 sm:top-3 sm:px-3.5 sm:text-[11px] ${badge.className}`}
    >
      {badge.text}
    </div>
  )
}

function SmallBookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block min-w-0">
      <div className="overflow-hidden rounded-2xl bg-[#1e1e22] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <StatusBadge type={book.badge} />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="line-clamp-1 text-[13px] font-extrabold tracking-tight text-neutral-950 sm:text-[15px] lg:text-[16px]">
          {book.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-neutral-800 sm:mt-2 sm:gap-3 sm:text-[11px] lg:text-[12px]">
          <div className="flex min-w-0 items-center gap-1">
            <i className="fas fa-eye text-[10px] text-black sm:text-[11px]" />
            <span className="leading-none">{book.views}</span>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <i className="fas fa-list text-[10px] text-black sm:text-[11px]" />
            <span className="leading-none">{book.episodes}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function UpdateTodaySection() {
  return (
    <section className="px-4 pb-8 pt-8 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[18px] sm:text-[20px]">🎉</span>
            <h2 className="text-[20px] font-extrabold uppercase tracking-[0.04em] text-neutral-950 sm:text-[24px]">
              UPDATE TODAY
            </h2>
          </div>

          <Link
            to="/update-today"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition hover:bg-black/5 sm:h-10 sm:w-10"
            aria-label="View all update today"
          >
            <i className="fas fa-chevron-right text-[18px] sm:text-[20px]" />
          </Link>
        </div>

        {/* Featured book */}
        <div className="flex items-start gap-4">
          <Link
            to={`/story/${featuredBook.id}`}
            className="group w-[96px] shrink-0 sm:w-[130px] lg:w-[220px]"
          >
            <div className="overflow-hidden rounded-2xl bg-amber-500 shadow-sm">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={`/story/${featuredBook.id}`} className="block">
              <h3 className="line-clamp-2 text-[18px] font-extrabold leading-tight tracking-tight text-[#7b1028] sm:text-[22px] lg:text-[30px]">
                {featuredBook.title}
              </h3>
            </Link>

            <p className="mt-1 text-[12px] font-bold text-neutral-950 sm:text-[15px] lg:text-[20px]">
              {featuredBook.author}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold sm:gap-x-3 sm:text-[12px] lg:text-[16px]">
              <div className="flex items-center gap-1 text-blue-700">
                <i className="fas fa-eye text-[10px] text-black lg:text-[15px]" />
                <span>{featuredBook.views}</span>
              </div>

              <div className="flex items-center gap-1 text-red-500">
                <i className="fas fa-heart text-[10px] lg:text-[15px]" />
                <span className="text-black">{featuredBook.likes}</span>
              </div>

              <div className="flex items-center gap-1 text-blue-700">
                <i className="fas fa-list text-[10px] text-black lg:text-[15px]" />
                <span>{featuredBook.episodes}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {featuredBook.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-[#efefef] px-2 py-1 text-[9px] font-medium text-neutral-500 sm:px-3 sm:text-[11px] lg:text-[13px]"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-neutral-800 sm:text-[12px] sm:leading-5 lg:line-clamp-3 lg:text-[15px] lg:leading-7">
              {featuredBook.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-6 md:gap-x-4 md:gap-y-8">
          {updateBooks.map((book) => (
            <SmallBookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}

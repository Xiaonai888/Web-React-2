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
  { id: 202, title: 'Name Novel', cover: '/assets/Update Today/Update Today 2.jpg', badge: 'red',    views: '100k', episodes: 'Ep 17' },
  { id: 203, title: 'Name Novel', cover: '/assets/Update Today/Update Today 3.jpg', badge: 'yellow', views: '100k', episodes: 'Ep 17' },
  { id: 204, title: 'Name Novel', cover: '/assets/Update Today/Update Today 4.jpg', badge: 'green',  views: '100k', episodes: 'Ep 17' },
  { id: 205, title: 'Name Novel', cover: '/assets/Update Today/Update Today 5.jpg', badge: 'red',    views: '100k', episodes: 'Ep 17' },
  { id: 206, title: 'Name Novel', cover: '/assets/Update Today/Update Today 6.jpg', badge: 'yellow', views: '100k', episodes: 'Ep 17' },
  { id: 207, title: 'Name Novel', cover: '/assets/Update Today/Update Today 7.jpg', badge: 'green',  views: '100k', episodes: 'Ep 17' },
]

const badgeStyles = {
  red:    'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green:  'bg-lime-400 text-black',
}

function SmallBookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-[#1e1e22] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className={`absolute right-3 top-3 rounded-full px-4 py-1.5 text-[14px] font-bold ${badgeStyles[book.badge]}`}>
            New
          </div>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-950">
          {book.title}
        </h3>
        <div className="mt-2 flex items-center gap-4 text-[15px]">
          <div className="flex items-center gap-1.5">
            <i className="fas fa-eye text-black text-[16px]" />
            <span>{book.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-list text-black text-[16px]" />
            <span>{book.episodes}</span>
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
            <span className="text-[24px]">🎉</span>
            <h2 className="text-[24px] font-extrabold tracking-tight text-neutral-950 sm:text-[28px]">
              Update today
            </h2>
          </div>
          <Link
            to="/update-today"
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-950 transition hover:bg-black/5"
            aria-label="View all update today"
          >
            <i className="fas fa-chevron-right text-[22px]" />
          </Link>
        </div>

        {/* Featured book — always side by side on ALL screen sizes */}
        <div className="flex gap-4 items-start">
          <Link to={`/story/${featuredBook.id}`} className="group shrink-0 w-[110px] sm:w-[140px] lg:w-[220px]">
            <div className="overflow-hidden rounded-2xl bg-amber-500 shadow-sm">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={`/story/${featuredBook.id}`} className="block">
              <h3 className="line-clamp-2 text-[18px] font-extrabold leading-tight tracking-tight text-[#7b1028] sm:text-[24px] lg:text-[30px]">
                {featuredBook.title}
              </h3>
            </Link>
            <p className="mt-1 text-[13px] font-bold text-neutral-950 sm:text-[16px] lg:text-[20px]">
              {featuredBook.author}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold sm:text-[14px] lg:text-[18px]">
              <div className="flex items-center gap-1 text-blue-700">
                <i className="fas fa-eye text-black text-[12px] lg:text-[18px]" />
                <span>{featuredBook.views}</span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <i className="fas fa-heart text-[12px] lg:text-[18px]" />
                <span className="text-black">{featuredBook.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <i className="fas fa-list text-black text-[12px] lg:text-[18px]" />
                <span>{featuredBook.episodes}</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {featuredBook.genres.map((genre) => (
                <span key={genre} className="rounded-full bg-[#efefef] px-2 py-1 text-[10px] font-medium text-neutral-500 sm:px-3 sm:text-[12px] lg:text-[14px]">
                  {genre}
                </span>
              ))}
            </div>
            <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-neutral-800 sm:text-[13px] lg:line-clamp-3 lg:text-[16px] lg:leading-8">
              {featuredBook.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
          {updateBooks.map((book) => (
            <SmallBookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}

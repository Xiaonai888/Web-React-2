import { Link } from 'react-router-dom'
import { Eye, Heart, List, ChevronRight } from 'lucide-react'

const featuredBook = {
  id: 201,
  title: 'Name book',
  author: 'Author Name',
  cover: '/assets/Update Today/Update Today Featured.jpg',
  views: '100k',
  likes: '1000',
  episodes: 'Ep 17',
  genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
  description:
    'Ika is the only survivor of a genocide of humans by demons summoned to wipe out life on his planet through a portal. During the destruction, he witnesses the genocide of humans by demons summoned from another universe.',
}

const updateBooks = [
  {
    id: 202,
    title: 'Name Novel',
    cover: '/assets/Update Today/Update 1.jpg',
    badge: 'red',
    views: '100k',
    episodes: 'Ep 17',
  },
  {
    id: 203,
    title: 'Name Novel',
    cover: '/assets/Update Today/Update 2.jpg',
    badge: 'yellow',
    views: '100k',
    episodes: 'Ep 17',
  },
  {
    id: 204,
    title: 'Name Novel',
    cover: '/assets/Update Today/Update 3.jpg',
    badge: 'green',
    views: '100k',
    episodes: 'Ep 17',
  },
  {
    id: 205,
    title: 'Name Novel',
    cover: '/assets/Update Today/Update 4.jpg',
    badge: 'red',
    views: '100k',
    episodes: 'Ep 17',
  },
  {
    id: 206,
    title: 'Name Novel',
    cover: '/assets/Update Today/Update 5.jpg',
    badge: 'yellow',
    views: '100k',
    episodes: 'Ep 17',
  },
  {
    id: 207,
    title: 'Name Novel',
    cover: '/assets/Update Today/Update 6.jpg',
    badge: 'green',
    views: '100k',
    episodes: 'Ep 17',
  },
]

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
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
          />

          <div
            className={`absolute right-3 top-3 rounded-full px-4 py-1.5 text-[14px] font-bold ${badgeStyles[book.badge]}`}
          >
            New
          </div>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="line-clamp-1 text-[18px] font-extrabold tracking-tight text-neutral-950">
          {book.title}
        </h3>

        <div className="mt-2 flex items-center gap-4 text-[15px]">
          <div className="flex items-center gap-1.5 text-red-500">
            <Eye size={18} className="text-black" strokeWidth={2.2} />
            <span>{book.views}</span>
          </div>

          <div className="flex items-center gap-1.5 text-blue-600">
            <List size={18} className="text-black" strokeWidth={2.4} />
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
        {/* Header */}
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
            <ChevronRight size={30} strokeWidth={2.4} />
          </Link>
        </div>

        {/* Featured */}
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <Link to={`/story/${featuredBook.id}`} className="group block w-full">
            <div className="overflow-hidden rounded-2xl bg-amber-500 shadow-sm">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </Link>

          <div className="min-w-0">
            <Link to={`/story/${featuredBook.id}`} className="block">
              <h3 className="line-clamp-2 text-[30px] font-extrabold leading-tight tracking-tight text-[#7b1028] sm:text-[36px]">
                {featuredBook.title}
              </h3>
            </Link>

            <p className="mt-1 text-[20px] font-bold text-neutral-950 sm:text-[22px]">
              {featuredBook.author}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[18px] font-semibold">
              <div className="flex items-center gap-2 text-blue-700">
                <Eye size={22} className="text-black" strokeWidth={2.2} />
                <span>{featuredBook.views}</span>
              </div>

              <div className="flex items-center gap-2 text-red-500">
                <Heart size={22} fill="currentColor" strokeWidth={1.6} />
                <span className="text-black">{featuredBook.likes}</span>
              </div>

              <div className="flex items-center gap-2 text-blue-700">
                <List size={22} className="text-black" strokeWidth={2.4} />
                <span>{featuredBook.episodes}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {featuredBook.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-[#efefef] px-3 py-1.5 text-[14px] font-medium text-neutral-500"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="mt-5 line-clamp-3 max-w-4xl text-[16px] leading-8 text-neutral-800 sm:text-[17px]">
              {featuredBook.description}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {updateBooks.map((book) => (
            <SmallBookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}


import { Link } from 'react-router-dom'

const allBooks = [
  {
    id: 201,
    title: 'Name book',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 1.jpg',
    badge: 'red',
    views: '100k',
    likes: '1000',
    episodes: 'Ep 17',
    genres: ['Romance', 'Comedy', 'Fantasy', 'Action'],
  },
  {
    id: 202,
    title: 'Name Novel',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 2.jpg',
    badge: 'red',
    views: '100k',
    likes: '2.5k',
    episodes: 'Ep 17',
    genres: ['Romance', 'Fantasy'],
  },
  {
    id: 203,
    title: 'Name Novel',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 3.jpg',
    badge: 'yellow',
    views: '80k',
    likes: '1.8k',
    episodes: 'Ep 17',
    genres: ['Action', 'Drama'],
  },
  {
    id: 204,
    title: 'Name Novel',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 4.jpg',
    badge: 'green',
    views: '120k',
    likes: '3k',
    episodes: 'Ep 17',
    genres: ['Comedy', 'Romance'],
  },
  {
    id: 205,
    title: 'Name Novel',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 5.jpg',
    badge: 'red',
    views: '90k',
    likes: '2.2k',
    episodes: 'Ep 17',
    genres: ['Fantasy', 'Action'],
  },
  {
    id: 206,
    title: 'Name Novel',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 6.jpg',
    badge: 'yellow',
    views: '75k',
    likes: '1.5k',
    episodes: 'Ep 17',
    genres: ['Drama', 'Mystery'],
  },
  {
    id: 207,
    title: 'Name Novel',
    author: 'Author Name',
    cover: '/assets/Update Today/Update Today 7.jpg',
    badge: 'green',
    views: '60k',
    likes: '1.2k',
    episodes: 'Ep 17',
    genres: ['Romance', 'Drama'],
  },
]

const badgeStyles = {
  red:    'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green:  'bg-lime-400 text-black',
}

function BookCard({ book }) {
  return (
    <Link to={`/story/${book.id}`} className="group block">
      <div className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
        <div className="relative shrink-0 w-[80px] h-[112px] overflow-hidden rounded-xl shadow-sm bg-gray-100">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className={`absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeStyles[book.badge]}`}>
            New
          </div>
        </div>

        <div className="min-w-0 flex-1 py-1">
          <h3 className="line-clamp-2 text-[16px] font-extrabold tracking-tight text-neutral-900">
            {book.title}
          </h3>
          <p className="mt-0.5 text-[13px] text-gray-500 font-medium">{book.author}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {book.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-eye text-[13px]" />
              <span>{book.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-red-500 text-[13px]" />
              <span className="text-gray-600">{book.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-list text-[13px]" />
              <span>{book.episodes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function UpdateTodayPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="h-14 flex items-center px-4 gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[22px]">🎉</span>
            <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
              Update Today
            </h1>
          </div>
        </div>
      </header>

      <main className="px-2 pt-3">
        <p className="px-4 pb-2 text-[13px] text-gray-400 font-medium">
          {allBooks.length} stories updated today
        </p>
        <div className="divide-y divide-gray-100">
          {allBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  )
}

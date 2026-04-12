import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const newArrivalsTabs = ['Fresh', 'Popular', 'Recent Complete']

export const newArrivalsData = {
  Fresh: [
    {
      id: 401,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 1.jpg',
      likes: '1000',
      views: '100k',
      badge: 'NEW',
      badgeColor: 'red',
      link: '/story/401',
    },
    {
      id: 402,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 2.jpg',
      likes: '920',
      views: '88k',
      badge: 'UP',
      badgeColor: 'yellow',
      link: '/story/402',
    },
    {
      id: 403,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 3.jpg',
      likes: '860',
      views: '74k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/403',
    },
    {
      id: 404,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 4.jpg',
      likes: '1.4k',
      views: '120k',
      badge: 'NEW',
      badgeColor: 'red',
      link: '/story/404',
    },
    {
      id: 405,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 5.jpg',
      likes: '980',
      views: '93k',
      badge: 'UP',
      badgeColor: 'yellow',
      link: '/story/405',
    },
    {
      id: 406,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 6.jpg',
      likes: '710',
      views: '68k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/406',
    },
  ],

  Popular: [
    {
      id: 407,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 1.jpg',
      likes: '2.1k',
      views: '210k',
      badge: 'UP',
      badgeColor: 'yellow',
      link: '/story/407',
    },
    {
      id: 408,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 2.jpg',
      likes: '1.9k',
      views: '180k',
      badge: 'NEW',
      badgeColor: 'red',
      link: '/story/408',
    },
    {
      id: 409,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 3.jpg',
      likes: '1.7k',
      views: '165k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/409',
    },
    {
      id: 410,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 4.jpg',
      likes: '1.6k',
      views: '150k',
      badge: 'UP',
      badgeColor: 'yellow',
      link: '/story/410',
    },
    {
      id: 411,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 5.jpg',
      likes: '1.3k',
      views: '132k',
      badge: 'NEW',
      badgeColor: 'red',
      link: '/story/411',
    },
    {
      id: 412,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 6.jpg',
      likes: '1.2k',
      views: '120k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/412',
    },
  ],

  'Recent Complete': [
    {
      id: 413,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 1.jpg',
      likes: '880',
      views: '96k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/413',
    },
    {
      id: 414,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 2.jpg',
      likes: '830',
      views: '89k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/414',
    },
    {
      id: 415,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 3.jpg',
      likes: '790',
      views: '84k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/415',
    },
    {
      id: 416,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 4.jpg',
      likes: '760',
      views: '79k',
      badge: 'UP',
      badgeColor: 'yellow',
      link: '/story/416',
    },
    {
      id: 417,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 5.jpg',
      likes: '730',
      views: '73k',
      badge: 'NEW',
      badgeColor: 'red',
      link: '/story/417',
    },
    {
      id: 418,
      title: 'Name Book',
      author: 'Author Name',
      cover: '/assets/NewArrivalsPage/NewArrivalsPage 6.jpg',
      likes: '700',
      views: '69k',
      badge: 'END',
      badgeColor: 'green',
      link: '/story/418',
    },
  ],
}

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
}

function BookCard({ book }) {
  return (
    <Link to={book.link} className="group block">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[11px] font-extrabold ${badgeStyles[book.badgeColor]}`}>
            {book.badge}
          </div>
        </div>

        <div className="mt-3 w-full">
          <h3 className="line-clamp-2 text-[16px] font-extrabold leading-snug tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <p className="mt-1 text-[13px] font-medium text-gray-500">
            {book.author}
          </p>

          <div className="mt-2 flex items-center gap-4 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-red-500 text-[12px]" />
              <span>{book.likes}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-eye text-[12px]" />
              <span>{book.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function NewArrivalsDemoPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Fresh')

  const books = useMemo(() => {
    return newArrivalsData[activeTab] || []
  }, [activeTab])

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="h-14 flex items-center px-4 gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[18px] text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[20px]">🚀</span>
            <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
              New Arrivals Demo
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="mb-5 flex gap-3 overflow-x-auto pb-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {newArrivalsTabs.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  )
}

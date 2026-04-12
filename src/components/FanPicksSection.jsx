import React from 'react'
import { useNavigate } from 'react-router-dom'

const fanPicksData = [
  {
    id: 601,
    title: 'Name Book',
    cover: '/assets/FanPicksSection/FanPicksSection 1.jpg',
    likes: '100k',
    episodes: 'Ep 17',
    link: '/story/601',
  },
  {
    id: 602,
    title: 'Name Book',
    cover: '/assets/FanPicksSection/FanPicksSection 2.jpg',
    likes: '100k',
    episodes: 'Ep 17',
    link: '/story/602',
  },
  {
    id: 603,
    title: 'Name Book',
    cover: '/assets/FanPicksSection/FanPicksSection 3.jpg',
    likes: '100k',
    episodes: 'Ep 17',
    link: '/story/603',
  },
  {
    id: 604,
    title: 'Name Book',
    cover: '/assets/FanPicksSection/FanPicksSection 4.jpg',
    likes: '100k',
    episodes: 'Ep 17',
    link: '/story/604',
  },
  {
    id: 605,
    title: 'Name Book',
    cover: '/assets/FanPicksSection/FanPicksSection 5.jpg',
    likes: '100k',
    episodes: 'Ep 17',
    link: '/story/605',
  },
  {
    id: 606,
    title: 'Name Book',
    cover: '/assets/FanPicksSection/FanPicksSection 6.jpg',
    likes: '100k',
    episodes: 'Ep 17',
    link: '/story/606',
  },
]

function BookCard({ book }) {
  return (
    <div className="group block">
      <div className="flex flex-col items-start">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        <div className="mt-3 w-full">
          <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-red-500 text-[12px]" />
              <span className="font-medium">{book.likes}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-list text-[12px]" />
              <span className="font-medium text-[#2b57c7]">{book.episodes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FanPicksSection() {
  const navigate = useNavigate()

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[20px]">😍</span>
        <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
          Fan Picks
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {fanPicksData.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => navigate(book.link)}
            className="text-left"
          >
            <BookCard book={book} />
          </button>
        ))}
      </div>
    </section>
  )
}

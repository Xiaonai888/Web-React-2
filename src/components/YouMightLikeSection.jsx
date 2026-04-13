import React from 'react'
import { useNavigate } from 'react-router-dom'
import { youMightLikeBooks } from '../../Demo/YouMightLikeDemoPage'

function BookCard({ book }) {
  return (
    <div className="group block w-full">
      <div className="flex flex-col items-start">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/assets/fallback-book.jpg'
            }}
          />
        </div>

        <div className="mt-3 w-full">
          <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <div className="mt-2 flex items-center gap-3 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-[12px] text-red-500" />
              <span className="font-medium">{book.likes}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-list text-[12px]" />
              <span className="font-medium">{book.episodes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function YouMightLikeSection() {
  const navigate = useNavigate()
  const books = youMightLikeBooks.slice(0, 6)

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🙂</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
            You Might Like
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/you-might-like')}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label="Go to You Might Like page"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:grid-cols-6">
        {books.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => navigate(book.link)}
            className="w-full text-left"
          >
            <BookCard book={book} />
          </button>
        ))}
      </div>
    </section>
  )
}

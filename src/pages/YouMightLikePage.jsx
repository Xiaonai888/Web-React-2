import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { youMightLikeBooks } from '../../Demo/YouMightLikeDemoPage'

function BookCard({ book }) {
  return (
    <Link to={book.link} className="group block">
      <div className="flex flex-col items-start">
        <div className="w-[80px] h-[112px] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        <div className="mt-2 w-[80px]">
          <h3 className="line-clamp-2 text-[13px] font-extrabold tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <div className="mt-1 flex flex-col gap-1 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <i className="fas fa-eye text-[11px]" />
                <span>{book.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-heart text-red-500 text-[11px]" />
                <span>{book.likes}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <i className="fas fa-comment text-[11px]" />
                <span>{book.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-list text-[11px]" />
                <span>{book.episodes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function YouMightLikePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white pb-32">
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
            <span className="text-[20px]">🙂</span>
            <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
              You Might Like
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4">
        <p className="pb-3 text-[13px] text-gray-400 font-medium">
          {youMightLikeBooks.length} recommended stories
        </p>

        <div className="grid grid-cols-3 gap-x-3 gap-y-5 lg:grid-cols-6">
          {youMightLikeBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  )
}


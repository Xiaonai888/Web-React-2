import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { newArrivalsTabs, newArrivalsData } from '../../Demo/NewArrivalsDemoPage'

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

export default function NewArrivalsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Fresh')

  const books = useMemo(() => {
    return newArrivalsData[activeTab] || []
  }, [activeTab])

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
            <span className="text-[20px]">🚀</span>
            <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
              New Arrivals
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

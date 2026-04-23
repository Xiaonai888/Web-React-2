import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { newArrivalsTabs, newArrivalsData } from '../../Demo/NewArrivalsDemoPage'

const badgeStyles = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-lime-400 text-black',
}

function BookCard({ book }) {
  return (
    <div className="group block w-full">
      <div className="flex flex-col items-start">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/assets/fallback-book.jpg'
            }}
          />

          {book.badge && (
            <div
              className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                badgeStyles[book.badgeColor] || 'bg-black text-white'
              }`}
            >
              {book.badge}
            </div>
          )}
        </div>

        <div className="mt-3 w-full">
          <h3 className="text-[16px] font-extrabold leading-snug tracking-tight text-neutral-900">
            {book.title}
          </h3>

          <p className="mt-1 text-[13px] font-medium text-gray-500">
            {book.author}
          </p>

          <div className="mt-2 flex items-center gap-4 text-[13px] text-gray-600">
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-[12px] text-red-500" />
              <span>{book.likes}</span>
            </div>

            <div className="flex items-center gap-1">
              <i className="fas fa-eye text-[12px]" />
              <span>{book.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewArrivalsSection() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Fresh')

  const books = useMemo(() => {
    return (newArrivalsData[activeTab] || []).slice(0, 6)
  }, [activeTab])

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🚀</span>
          <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
            New Arrivals
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate('/new-arrivals')}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label="Go to New Arrivals page"
        >
          <i className="fas fa-chevron-right text-[15px] text-gray-700" />
        </button>
      </div>

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


// FILE 2: src/Demo/NewArrivalsDemoPage.js
// IMPORTANT:
// Your images 1–16 are in:
// public/assets/New Arrival/
// Use EXACT file names like:
// /assets/New Arrival/New Arrival 1.jpg
// /assets/New Arrival/New Arrival 2.jpg
// ...
// /assets/New Arrival/New Arrival 16.jpg

export const newArrivalsTabs = ['Fresh', 'Hot', 'Completed']

const makeBook = (id, imageNumber, title, author, badge, badgeColor, likes, views, link = `/story/${id}`) => ({
  id,
  title,
  author,
  badge,
  badgeColor,
  likes,
  views,
  link,
  cover: `/assets/New Arrival/New Arrival ${imageNumber}.jpg`,
})

export const newArrivalsData = {
  Fresh: [
    makeBook(1, 1, 'Midnight Promise', 'Skye Hart', 'NEW', 'red', '12.4K', '88.1K'),
    makeBook(2, 2, 'Broken Summer', 'Becki Alexander', 'HOT', 'yellow', '10.2K', '70.3K'),
    makeBook(3, 3, 'Still Here', 'Skye Hart', 'UP', 'green', '9.8K', '65.0K'),
    makeBook(4, 4, 'The Last Window', 'Backlight', 'NEW', 'red', '14.6K', '92.4K'),
    makeBook(5, 5, 'After The Rain', 'Echoes', 'HOT', 'yellow', '8.7K', '59.7K'),
    makeBook(6, 6, 'Falling Quietly', 'Becki Alexander', 'NEW', 'red', '11.1K', '76.9K'),
  ],

  Hot: [
    makeBook(7, 7, 'Where You Left Me', 'Skye Hart', 'HOT', 'yellow', '18.2K', '120.8K'),
    makeBook(8, 8, 'Hollow Lights', 'Becki Alexander', 'UP', 'green', '16.4K', '111.5K'),
    makeBook(9, 9, 'Without A Sound', 'Backlight', 'NEW', 'red', '13.0K', '87.3K'),
    makeBook(10, 10, 'Cold Morning', 'Echoes', 'HOT', 'yellow', '15.1K', '94.0K'),
    makeBook(11, 11, 'The Quiet Exit', 'Baby Demon', 'UP', 'green', '9.9K', '61.5K'),
    makeBook(12, 12, 'Last Call For Love', 'Becki Alexander', 'HOT', 'yellow', '17.6K', '118.2K'),
  ],

  Completed: [
    makeBook(13, 13, 'Strangers Again', 'Skye Hart', 'END', 'red', '20.4K', '140.0K'),
    makeBook(14, 14, 'Faded Halo', 'Becki Alexander', 'END', 'red', '22.7K', '151.6K'),
    makeBook(15, 15, 'The Door Closed', 'Backlight', 'END', 'red', '19.8K', '132.9K'),
    makeBook(16, 16, 'No More Echoes', 'Echoes', 'END', 'red', '18.9K', '125.4K'),
    makeBook(17, 1, 'Goodbye Slowly', 'Baby Demon', 'END', 'red', '17.0K', '112.0K'),
    makeBook(18, 2, 'The Final Note', 'Skye Hart', 'END', 'red', '16.2K', '105.3K'),
  ],
}

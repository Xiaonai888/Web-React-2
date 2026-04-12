import React from 'react'
import { Link } from 'react-router-dom'

export const youMightLikeBooks = [
  {
    id: 301,
    title: 'Name Book',
    author: 'Author Name',
    cover: '/assets/You Might Like/You Might Like 1.jpg',
    views: '100k',
    likes: '1000',
    comments: '230',
    episodes: 'Ep 17',
    link: '/story/301',
  },
  {
    id: 302,
    title: 'Name Book',
    author: 'Author Name',
    cover: '/assets/You Might Like/You Might Like 2.jpg',
    views: '88k',
    likes: '920',
    comments: '180',
    episodes: 'Ep 21',
    link: '/story/302',
  },
  {
    id: 303,
    title: 'Name Book',
    author: 'Author Name',
    cover: '/assets/You Might Like/You Might Like 3.jpg',
    views: '74k',
    likes: '860',
    comments: '150',
    episodes: 'Ep 14',
    link: '/story/303',
  },
  {
    id: 304,
    title: 'Name Book',
    author: 'Author Name',
    cover: '/assets/You Might Like/You Might Like 4.jpg',
    views: '120k',
    likes: '1.4k',
    comments: '320',
    episodes: 'Ep 31',
    link: '/story/304',
  },
  {
    id: 305,
    title: 'Name Book',
    author: 'Author Name',
    cover: '/assets/You Might Like/You Might Like 5.jpg',
    views: '93k',
    likes: '980',
    comments: '260',
    episodes: 'Ep 19',
    link: '/story/305',
  },
  {
    id: 306,
    title: 'Name Book',
    author: 'Author Name',
    cover: '/assets/You Might Like/You Might Like 6.jpg',
    views: '68k',
    likes: '710',
    comments: '120',
    episodes: 'Ep 12',
    link: '/story/306',
  },
]

function DemoCard({ book }) {
  return (
    <Link to={book.link} className="group block">
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:bg-gray-50">
        <div className="mx-auto w-[80px] h-[112px] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        <div className="mt-3 text-center">
          <h3 className="line-clamp-2 text-[14px] font-extrabold tracking-tight text-neutral-900">
            {book.title}
          </h3>
          <p className="mt-1 text-[12px] text-gray-500 font-medium">{book.author}</p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[12px]">
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-eye text-[12px]" />
              <span>{book.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-heart text-red-500 text-[12px]" />
              <span className="text-gray-600">{book.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-comment text-[12px]" />
              <span>{book.comments}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <i className="fas fa-list text-[12px]" />
              <span>{book.episodes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function YouMightLikeDemoPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
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
            <span className="text-[20px]">🙂</span>
            <h1 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
              You Might Like Demo
            </h1>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4">
        <p className="pb-3 text-[13px] text-gray-400 font-medium">
          Demo source for title, views, likes, comments, episodes, and links
        </p>

        <div className="grid grid-cols-3 gap-x-3 gap-y-5 lg:grid-cols-6">
          {youMightLikeBooks.map((book) => (
            <DemoCard key={book.id} book={book} />
          ))}
        </div>
      </main>
    </div>
  )
}

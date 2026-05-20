import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const demoAuthors = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: 'Author Name',
  fans: '2.1k Fans',
  work: 'work 03',
  time: `${index % 4 === 0 ? 1 : index % 4 === 1 ? 2 : index % 4 === 2 ? 3 : 5} days ago`,
  likes: '100K',
  views: '1.1M',
  updates: '3 updates this week',
}))

function AuthorCard({ author, filter }) {
  return (
    <button
      type="button"
      className="rounded-[16px] border border-[#e5e7eb] bg-white px-3 py-4 text-center shadow-sm active:scale-[0.99]"
    >
      <div className="mx-auto h-[68px] w-[68px] rounded-full bg-[#1f1f1f]" />
      <div className="mt-4 line-clamp-1 text-[12px] font-bold text-[#111827]">{author.name}</div>
      <div className="mt-1 text-[14px] font-extrabold text-[#111827]">{author.fans}</div>
      <div className="mt-1 text-[12px] text-[#444]">{author.work}</div>

      {filter === 'popular' ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold">
          <span className="text-[#ef4444]">Like {author.likes}</span>
          <span className="text-[#111827]">View {author.views}</span>
        </div>
      ) : filter === 'updated' ? (
        <div className="mt-4 text-[10px] font-semibold leading-4 text-[#9ca3af]">
          <div>
            <i className="far fa-clock mr-1" />
            5 min ago
          </div>
          <div>{author.updates}</div>
        </div>
      ) : (
        <div className="mt-4 text-[10px] font-semibold text-[#9ca3af]">
          <i className="far fa-clock mr-1" />
          {author.time}
        </div>
      )}
    </button>
  )
}

export default function FollowingAuthorsPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('recent')

  const filteredAuthors = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    if (!value) return demoAuthors

    return demoAuthors.filter((author) => author.name.toLowerCase().includes(value))
  }, [keyword])

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 border-b border-[#f1f1f1] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[760px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[16px]" />
          </button>
          <h1 className="text-[18px] font-extrabold text-[#111827]">My Following</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#9ca3af]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search Author Name"
            className="h-12 w-full rounded-full bg-[#f1f1f1] pl-11 pr-4 text-[15px] font-medium text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-[19px] font-extrabold text-[#111827]">{filteredAuthors.length} Authors</h2>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af]">
            <i className="fas fa-chevron-down text-[15px]" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {['recent', 'popular', 'updated'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold active:scale-95 ${
                filter === item
                  ? 'bg-black text-white'
                  : 'border border-[#d8dbe3] bg-white text-[#111827]'
              }`}
            >
              {item === 'recent' ? 'Recent' : item === 'popular' ? 'Popular' : 'Most Updated'}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredAuthors.map((author) => (
            <AuthorCard key={author.id} author={author} filter={filter} />
          ))}
        </div>

        {!filteredAuthors.length ? (
          <div className="mt-8 rounded-[18px] bg-[#f8fafc] p-8 text-center text-[13px] font-bold text-[#9ca3af]">
            No authors found.
          </div>
        ) : null}
      </main>
    </div>
  )
}

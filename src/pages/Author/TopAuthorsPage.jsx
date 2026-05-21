import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const demoAuthors = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  rank: index + 1,
  name: 'Author Name',
  fans: '2.1k Fans',
  work: 'work 03',
  likes: '100K',
  views: '1.1M',
  updated: index % 3 === 0 ? 'New' : index % 3 === 1 ? 'Popular' : 'Updated',
}))

function TopAuthorCard({ author }) {
  return (
    <button
      type="button"
      className="relative rounded-[16px] border border-[#e5e7eb] bg-white px-3 py-4 text-center shadow-sm active:scale-[0.99]"
    >
      {author.rank <= 3 ? (
        <div className="absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#111827] px-2 text-[10px] font-black text-white">
          {author.rank}
        </div>
      ) : null}

      <div className="mx-auto h-[68px] w-[68px] rounded-full bg-[#1f1f1f]" />
      <div className="mt-4 line-clamp-1 text-[12px] font-bold text-[#111827]">{author.name}</div>
      <div className="mt-1 text-[14px] font-extrabold text-[#111827]">{author.fans}</div>
      <div className="mt-1 text-[12px] text-[#444]">{author.work}</div>
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold">
        <span className="text-[#ef4444]">Like {author.likes}</span>
        <span className="text-[#111827]">View {author.views}</span>
      </div>
      <button
        type="button"
        className="mt-4 h-8 w-full rounded-full bg-black text-[12px] font-bold text-white active:scale-95"
      >
        Follow
      </button>
    </button>
  )
}

export default function TopAuthorsPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('popular')

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
          <h1 className="text-[18px] font-extrabold text-[#111827]">Top Author</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="rounded-[18px] bg-black px-4 py-4 text-white">
          <div className="text-[17px] font-extrabold">Top Authors This Week</div>
          <p className="mt-1 text-[12px] leading-5 text-white/65">
            Discover popular authors and follow the ones you like.
          </p>
        </section>

        <div className="relative mt-5">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#9ca3af]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search Author Name"
            className="h-12 w-full rounded-full bg-[#f1f1f1] pl-11 pr-4 text-[15px] font-medium text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-[19px] font-extrabold text-[#111827]">{keyword ? filteredAuthors.length : 1200} Authors</h2>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af]">
            <i className="fas fa-chevron-down text-[15px]" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {['popular', 'new', 'updated'].map((item) => (
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
              {item === 'popular' ? 'Popular' : item === 'new' ? 'New' : 'Most Updated'}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredAuthors.map((author) => (
            <TopAuthorCard key={author.id} author={author} />
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

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const authors = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: 'Author Name',
  fans: '2.1k Fans',
  work: 'work 03',
  time: `${index % 4 === 0 ? 1 : index % 4 === 1 ? 2 : index % 4 === 2 ? 3 : 5} days ago`,
}))

function AuthorGridCard({ author }) {
  return (
    <div className="rounded-[18px] border border-[#dedede] bg-white px-3 py-4 text-center shadow-sm">
      <div className="mx-auto h-[78px] w-[78px] rounded-full bg-[#202020]" />
      <div className="mt-4 line-clamp-1 text-[13px] font-medium text-[#111827]">{author.name}</div>
      <div className="mt-2 text-[15px] font-extrabold text-[#111827]">{author.fans}</div>
      <div className="mt-2 text-[14px] text-[#333]">{author.work}</div>
      <div className="mt-5 text-[12px] font-semibold text-[#a0a6b2]">
        <i className="far fa-clock mr-1" />
        {author.time}
      </div>
    </div>
  )
}

export default function FollowingAuthorsPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState('recent')

  const filteredAuthors = useMemo(() => {
    const value = keyword.trim().toLowerCase()

    if (!value) return authors

    return authors.filter((author) => author.name.toLowerCase().includes(value))
  }, [keyword])

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 bg-white px-5 py-5">
        <div className="relative mx-auto flex max-w-[760px] items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full active:scale-95"
          >
            <i className="fas fa-chevron-left text-[26px]" />
          </button>
          <h1 className="text-[24px] font-extrabold text-[#111827]">My Following</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5">
        <div className="relative mt-2">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[24px] text-[#9ca3af]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search Author Name"
            className="h-[58px] w-full rounded-full bg-[#e5e5e5] pl-16 pr-5 text-[20px] font-medium text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#111827]">{filteredAuthors.length} Author</h2>
          <button type="button" className="flex h-10 w-10 items-center justify-center">
            <i className="fas fa-chevron-down text-[24px]" />
          </button>
        </div>

        <div className="mt-5 flex gap-3">
          {['recent', 'popular', 'updated'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-6 py-2 text-[17px] font-medium ${
                filter === item
                  ? 'bg-black text-white'
                  : 'border border-[#d8dbe3] bg-white text-[#111827]'
              }`}
            >
              {item === 'recent' ? 'Recent' : item === 'popular' ? 'Popular' : 'Most Updated'}
            </button>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredAuthors.map((author) => (
            <AuthorGridCard key={author.id} author={author} />
          ))}
        </div>
      </main>
    </div>
  )
}

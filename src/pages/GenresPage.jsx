import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const genres = [
  { label: 'All', slug: '' },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Adventure', slug: 'adventure' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
  { label: 'School Life', slug: 'school-life' },
  { label: 'Historical', slug: 'historical' },
  { label: 'Mystery', slug: 'mystery' },
  { label: 'Horror', slug: 'horror' },
  { label: 'Thriller', slug: 'thriller' },
  { label: 'Sci-Fi', slug: 'sci-fi' },
  { label: 'System', slug: 'system' },
  { label: 'Isekai', slug: 'isekai' },
  { label: 'Supernatural', slug: 'supernatural' },
  { label: 'Martial Arts', slug: 'martial-arts' },
  { label: 'Revenge', slug: 'revenge' },
  { label: 'CEO', slug: 'ceo' },
  { label: 'Slow Burn', slug: 'slow-burn' },
  { label: 'Enemies to Lovers', slug: 'enemies-to-lovers' },
  { label: 'Time Travel', slug: 'time-travel' },
  { label: 'Strong Female Lead', slug: 'strong-female-lead' },
  { label: 'Hidden Identity', slug: 'hidden-identity' },
  { label: 'Royalty', slug: 'royalty' },
  { label: 'Magic', slug: 'magic' },
  { label: 'Second Chance', slug: 'second-chance' },
  { label: 'Cold Male Lead', slug: 'cold-male-lead' },
  { label: 'BL', slug: 'bl' },
  { label: 'GL', slug: 'gl' },
  { label: 'LGBTQ+', slug: 'lgbtq' },
]

export default function GenresPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filteredGenres = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return genres

    return genres.filter((genre) => genre.label.toLowerCase().includes(keyword))
  }, [query])

  const openGenre = (genre) => {
    if (!genre.slug) {
      navigate('/')
      return
    }

    navigate(`/genre/${genre.slug}`)
  }

  return (
    <div className="min-h-screen bg-white pb-[110px]">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[22px] font-black tracking-tight text-[#111827]">Genres</h1>
            <p className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">Browse all Shadow novel genres</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-5">
        <section className="rounded-[28px] bg-[#111827] p-5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-[#111827]">
              <i className="fa-solid fa-layer-group text-[24px]" />
            </div>

            <div className="min-w-0">
              <h2 className="text-[24px] font-black leading-7">All Genres</h2>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-white/70">
                Choose a genre to open its own page.
              </p>
            </div>
          </div>

          <div className="mt-5 flex h-12 items-center gap-3 rounded-full bg-white px-4 text-[#111827]">
            <i className="fa-solid fa-magnifying-glass text-[13px] text-[#8d94a1]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search genre"
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-bold outline-none placeholder:text-[#8d94a1]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            ) : null}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-[#f8f8fb] p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-black text-[#111827]">Novel Genres</h3>
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#667085] ring-1 ring-black/5">
              {filteredGenres.length} Genres
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {filteredGenres.map((genre, index) => {
              const isAll = genre.label === 'All'

              return (
                <button
                  key={genre.label}
                  type="button"
                  onClick={() => openGenre(genre)}
                  className={`rounded-full px-4 py-2.5 text-[12px] font-black shadow-sm active:scale-[0.98] ${
                    isAll
                      ? 'bg-[#facc15] text-[#111827]'
                      : index % 5 === 0
                        ? 'bg-[#111827] text-white'
                        : 'bg-white text-[#111827] ring-1 ring-[#e4e7ec]'
                  }`}
                >
                  {genre.label}
                </button>
              )
            })}
          </div>

          {!filteredGenres.length ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#8d94a1]">
                <i className="fa-solid fa-layer-group text-[22px]" />
              </div>
              <h3 className="mt-4 text-[16px] font-black text-[#111827]">No genre found</h3>
              <p className="mt-1 text-[12px] font-semibold text-[#8d94a1]">Try another keyword.</p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}

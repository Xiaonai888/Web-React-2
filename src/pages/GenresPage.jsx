import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

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

const quickFilters = [
    { label: 'Wait Free', value: 'wait_free' },
  { label: 'Free Ep', value: 'free' },
  { label: 'Completed', value: 'completed' },
]

const accessFilters = [
  { label: 'All', value: 'all' },
  { label: 'Wait Free', value: 'wait_free' },
  { label: 'Free Ep', value: 'free' },
  { label: 'Paid', value: 'paid' },
  { label: 'Premium Early Access', value: 'premium' },
]

const typeFilters = [
  { label: 'All', value: 'all' },
  { label: 'Original', value: 'original' },
  { label: 'Translated', value: 'translated' },
  { label: 'Fan Contribution', value: 'fan' },
]

const progressFilters = [
  { label: 'All', value: 'all' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
]

function normalizeBook(story, index = 0) {
  return {
    id: story.id || story.story_id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || story.coverUrl || story.image_url || `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    genre: story.main_genre || story.genre || story.category || '',
    status: story.status || story.story_status || '',
    isFree: Boolean(story.is_free || story.free || story.price === 0),
    isWaitFree: Boolean(story.wait_until_free || story.is_wait_until_free || story.wait_free),
    isPremium: Boolean(story.is_subscription || story.subscription_only || story.requires_subscription || story.premium_early_access),
    type: story.story_type || story.type || story.work_type || '',
  }
}

function isCompletedBook(book) {
  return String(book.status || '').toLowerCase().includes('complete')
}

function isSameGenre(bookGenre, selectedGenre) {
  if (!selectedGenre || selectedGenre === 'All') return true

  return String(bookGenre || '').toLowerCase().replace(/\s+/g, '-') === selectedGenre.toLowerCase().replace(/\s+/g, '-')
}

function isBookMatchedQuickFilter(book, activeQuickFilter) {
  if (!activeQuickFilter) return true
  if (activeQuickFilter === 'completed') return isCompletedBook(book)
  if (activeQuickFilter === 'free') return book.isFree
  if (activeQuickFilter === 'wait_free') return book.isWaitFree

  return true
}

function isBookMatchedAdvancedFilters(book, access, type, progress) {
  if (access === 'wait_free' && !book.isWaitFree) return false
  if (access === 'free' && !book.isFree) return false
  if (access === 'premium' && !book.isPremium) return false
  if (access === 'paid' && (book.isFree || book.isWaitFree)) return false

  if (type !== 'all') {
    const bookType = String(book.type || '').toLowerCase()

    if (type === 'original' && !bookType.includes('original')) return false
    if (type === 'translated' && !bookType.includes('translated')) return false
    if (type === 'fan' && !bookType.includes('fan')) return false
  }

  if (progress === 'completed' && !isCompletedBook(book)) return false
  if (progress === 'ongoing' && isCompletedBook(book)) return false

  return true
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2.5 text-[12px] font-black active:scale-[0.98] ${
        active ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] ring-1 ring-[#e4e7ec]'
      }`}
    >
      {children}
    </button>
  )
}

function FilterSheet({
  open,
  onClose,
  access,
  setAccess,
  type,
  setType,
  progress,
  setProgress,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000000]">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section className="absolute bottom-0 left-0 right-0 max-h-[calc(100vh-72px)] overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[520px] sm:-translate-x-1/2 sm:rounded-[30px]">
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-5 pb-5 pt-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-black text-[#111827]">Refine Stories</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
              aria-label="Close filters"
            >
              <i className="fa-solid fa-xmark text-[15px]" />
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-[14px] font-black text-[#8d94a1]">Story Access</h3>
              <div className="flex flex-wrap gap-2.5">
                {accessFilters.map((item) => (
                  <FilterChip key={item.value} active={access === item.value} onClick={() => setAccess(item.value)}>
                    {item.label}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-[14px] font-black text-[#8d94a1]">Story Type</h3>
              <div className="flex flex-wrap gap-2.5">
                {typeFilters.map((item) => (
                  <FilterChip key={item.value} active={type === item.value} onClick={() => setType(item.value)}>
                    {item.label}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-[14px] font-black text-[#8d94a1]">Progress</h3>
              <div className="flex flex-wrap gap-2.5">
                {progressFilters.map((item) => (
                  <FilterChip key={item.value} active={progress === item.value} onClick={() => setProgress(item.value)}>
                    {item.label}
                  </FilterChip>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-7 grid grid-cols-[0.8fr_1.2fr] gap-3">
            <button
              type="button"
              onClick={() => {
                setAccess('all')
                setType('all')
                setProgress('all')
              }}
              className="h-12 rounded-full bg-[#f5f3fa] text-[13px] font-black text-[#111827] active:scale-[0.99]"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-[0.99]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function BookCard({ book, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(book)} className="block min-w-0 text-left active:scale-[0.99]">
      <div className="overflow-hidden rounded-[16px] bg-[#202124] shadow-sm">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = '/assets/Update Today/Update Today 1.jpg'
            }}
          />
        </div>
      </div>

      <h3 className="mt-2 line-clamp-2 text-[12px] font-black leading-4 text-[#111827] sm:text-[14px] sm:leading-5">
        {book.title}
      </h3>
    </button>
  )
}

export default function GenresPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [genresExpanded, setGenresExpanded] = useState(false)
  const [activeGenre, setActiveGenre] = useState('All')
  const [activeQuickFilter, setActiveQuickFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [access, setAccess] = useState('all')
  const [type, setType] = useState('all')
  const [progress, setProgress] = useState('all')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (filtersOpen) {
      document.body.classList.add('genres-filter-open')
    } else {
      document.body.classList.remove('genres-filter-open')
    }

    return () => {
      document.body.classList.remove('genres-filter-open')
    }
  }, [filtersOpen])

  useEffect(() => {
    let ignore = false

    async function loadBooks() {
      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=120&sort=updated`))
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load stories')
        }

        if (!ignore) {
          setBooks((data.stories || []).map(normalizeBook).filter((book) => book.id))
        }
      } catch (error) {
        if (!ignore) {
          setBooks([])
          setMessage(error.message === 'Failed to fetch' ? 'Cannot connect to server.' : error.message || 'Failed to load stories')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBooks()

    return () => {
      ignore = true
    }
  }, [])

  const filteredGenres = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return genres

    return genres.filter((genre) => genre.label.toLowerCase().includes(keyword))
  }, [query])

  const selectedGenreSlug = useMemo(() => {
    return genres.find((genre) => genre.label === activeGenre)?.slug || ''
  }, [activeGenre])

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => isSameGenre(book.genre, selectedGenreSlug))
      .filter((book) => isBookMatchedQuickFilter(book, activeQuickFilter))
      .filter((book) => isBookMatchedAdvancedFilters(book, access, type, progress))
  }, [access, activeQuickFilter, books, progress, selectedGenreSlug, type])

  const openGenre = (genre) => {
    setActiveGenre(genre.label)
  }

  const openBook = (book) => {
    if (book.id) navigate(`/story/${book.id}`)
  }

  return (
    <div className="min-h-screen bg-white pb-[110px]">
      <style>{`
        body.genres-filter-open footer {
          display: none !important;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          {searchOpen ? (
            <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f5f3fa] px-4">
              <i className="fa-solid fa-magnifying-glass text-[13px] text-[#8d94a1]" />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setGenresExpanded(true)
                }}
                placeholder="Search genres"
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[#111827] outline-none placeholder:text-[#8d94a1]"
              />
            </div>
          ) : (
            <h1 className="text-[22px] font-black tracking-tight text-[#111827]">Genres</h1>
          )}

          <button
            type="button"
            onClick={() => {
              if (searchOpen) {
                setQuery('')
                setGenresExpanded(false)
              }

              setSearchOpen((current) => !current)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Search genres"
          >
            <i className={`fa-solid ${searchOpen ? 'fa-xmark' : 'fa-magnifying-glass'} text-[14px]`} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section>
          <div className={`relative ${genresExpanded || query ? '' : 'max-h-[128px] overflow-hidden'}`}>
            <div className="flex flex-wrap gap-2.5">
              {filteredGenres.map((genre) => (
                <button
                  key={genre.label}
                  type="button"
                  onClick={() => openGenre(genre)}
                  className={`rounded-full px-4 py-2.5 text-[12px] font-black active:scale-[0.98] ${
                    activeGenre === genre.label
                      ? 'bg-[#facc15] text-[#111827]'
                      : 'bg-white text-[#111827] ring-1 ring-[#e4e7ec]'
                  }`}
                >
                  {genre.label}
                </button>
              ))}
            </div>

            {!genresExpanded && !query ? (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>

          {!filteredGenres.length ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1]">
                <i className="fa-solid fa-layer-group text-[22px]" />
              </div>
              <h3 className="mt-4 text-[16px] font-black text-[#111827]">No genre found</h3>
              <p className="mt-1 text-[12px] font-semibold text-[#8d94a1]">Try another keyword.</p>
            </div>
          ) : null}

          {filteredGenres.length && !query ? (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setGenresExpanded((current) => !current)}
                className="flex h-8 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
                aria-label={genresExpanded ? 'Show fewer genres' : 'Show more genres'}
              >
                <i className={`fa-solid ${genresExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[12px]`} />
              </button>
            </div>
          ) : null}
        </section>

        <section className="sticky top-[65px] z-30 mt-3 border-y border-[#eef0f4] bg-white/95 py-3 backdrop-blur">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickFilters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveQuickFilter((current) => (current === item.value ? '' : item.value))}
                className={`shrink-0 rounded-full px-4 py-2.5 text-[12px] font-black active:scale-[0.98] ${
                  activeQuickFilter === item.value
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#f5f3fa] text-[#111827]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="mx-1 h-7 w-px shrink-0 bg-[#e4e7ec]" />

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="shrink-0 rounded-full bg-[#f5f3fa] px-4 py-2.5 text-[12px] font-black text-[#111827] active:scale-[0.98]"
            >
              Filters
              <i className="fa-solid fa-chevron-down ml-2 text-[10px]" />
            </button>
          </div>
        </section>

        <section className="pt-4">
          {loading ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-6 md:gap-x-4 md:gap-y-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index}>
                  <div className="aspect-[2/3] animate-pulse rounded-[16px] bg-[#eef0f4]" />
                  <div className="mt-2 h-4 animate-pulse rounded-full bg-[#eef0f4]" />
                  <div className="mt-1 h-4 w-2/3 animate-pulse rounded-full bg-[#eef0f4]" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && message ? (
            <div className="rounded-[20px] bg-[#fff1f1] px-4 py-4 text-center text-[13px] font-black text-[#e5484d]">
              {message}
            </div>
          ) : null}

          {!loading && !message && filteredBooks.length ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-6 md:gap-x-4 md:gap-y-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onOpen={openBook} />
              ))}
            </div>
          ) : null}

          {!loading && !message && !filteredBooks.length ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1]">
                <i className="fa-solid fa-book-open text-[22px]" />
              </div>
              <h3 className="mt-4 text-[16px] font-black text-[#111827]">No stories found</h3>
              <p className="mt-1 text-[12px] font-semibold text-[#8d94a1]">Try another genre or filter.</p>
            </div>
          ) : null}
        </section>
      </main>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        access={access}
        setAccess={setAccess}
        type={type}
        setType={setType}
        progress={progress}
        setProgress={setProgress}
      />
    </div>
  )
}

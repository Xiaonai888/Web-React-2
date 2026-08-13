import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const hiddenTimeFilters = ['Today', 'Weekly', 'Monthly']

const rankingTabs = [
  { key: 'bestseller', label: 'Bestseller', icon: 'fa-solid fa-trophy', sort: 'popular' },
  { key: 'new', label: 'New', icon: 'fa-solid fa-star', sort: 'newest' },
  { key: 'popular', label: 'Popular', icon: 'fa-solid fa-fire', sort: 'popular' },
  { key: 'rising', label: 'Rising', icon: 'fa-solid fa-arrow-trend-up', sort: 'weekly_top' },
  { key: 'must_read', label: 'Must-read', icon: 'fa-solid fa-book-open', sort: 'popular' },
  { key: 'completed', label: 'Completed', icon: 'fa-solid fa-circle-check', sort: 'popular' },
]

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function getStoryStatus(story) {
  const status = String(story.story_status || story.status || '').trim().toLowerCase()

  if (status.includes('complete') || status.includes('end')) return 'Completed'
  if (status.includes('ongoing')) return 'Ongoing'

  return 'Updated'
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag || '').trim()).filter(Boolean)
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    genre: story.main_genre || 'Novel',
    tags: normalizeTags(story.tags),
    cover: story.cover_url || '',
    status: getStoryStatus(story),
  }
}

function getInitial(value) {
  return String(value || 'A').trim().slice(0, 1).toUpperCase()
}

function AuthorRankItem({ author, rank, onOpen }) {
  if (!author) return <div className="min-w-0 flex-1" />

  const isFirst = rank === 1
  const avatarSize = isFirst ? 'h-[82px] w-[82px]' : 'h-[68px] w-[68px]'
  const ring =
    rank === 1
      ? 'ring-[#f5b600]'
      : rank === 2
        ? 'ring-[#aeb8c7]'
        : 'ring-[#d88b45]'
  const badge =
    rank === 1
      ? 'bg-[#f5b600] text-white'
      : rank === 2
        ? 'bg-[#aeb8c7] text-white'
        : 'bg-[#d88b45] text-white'

  return (
    <button
      type="button"
      onClick={() => onOpen(author)}
      className={`relative min-w-0 flex-1 text-center active:scale-[0.98] ${isFirst ? '-mt-3' : 'mt-2'}`}
    >
      <div className="relative mx-auto w-fit">
        {isFirst ? (
          <i className="fa-solid fa-crown absolute -top-7 left-1/2 -translate-x-1/2 text-[24px] text-[#f5b600]" />
        ) : null}

        <div
          className={`flex ${avatarSize} items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[20px] font-bold text-[#111827] ring-[3px] ${ring} ring-offset-2 ring-offset-white`}
        >
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.page_name || 'Author'}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            getInitial(author.page_name)
          )}
        </div>

        <div
          className={`absolute -bottom-3 left-1/2 flex h-7 min-w-7 -translate-x-1/2 items-center justify-center rounded-full px-2 text-[12px] font-bold shadow-sm ring-2 ring-white ${badge}`}
        >
          {rank}
        </div>
      </div>

      <div className={`${isFirst ? 'mt-6' : 'mt-5'} truncate px-1 text-[12px] font-bold text-[#111827]`}>
        {author.page_name || 'Author'}
      </div>
      <div className="mt-0.5 truncate px-1 text-[10px] font-medium text-[#9ca3af]">
        {formatNumber(author.total_followers)} Followers
      </div>
    </button>
  )
}

function TopAuthorsSection({ authors, loading, onOpen, onViewAll }) {
  const first = authors[0]
  const second = authors[1]
  const third = authors[2]

  return (
    <section className="border-b border-[#f1f1f1] bg-white px-4 pb-5 pt-4">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#111827]">Top Authors</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[12px] font-semibold text-[#8b93a1] active:opacity-60"
        >
          See all
        </button>
      </div>

      {loading ? (
        <div className="flex items-end justify-between gap-2 px-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex flex-1 flex-col items-center">
              <div className={`${item === 1 ? 'h-[82px] w-[82px]' : 'h-[68px] w-[68px]'} animate-pulse rounded-full bg-[#eef0f4]`} />
              <div className="mt-4 h-3 w-16 animate-pulse rounded-full bg-[#eef0f4]" />
              <div className="mt-2 h-2.5 w-12 animate-pulse rounded-full bg-[#eef0f4]" />
            </div>
          ))}
        </div>
      ) : authors.length ? (
        <div className="flex items-start justify-between gap-1 px-1">
          <AuthorRankItem author={second} rank={2} onOpen={onOpen} />
          <AuthorRankItem author={first} rank={1} onOpen={onOpen} />
          <AuthorRankItem author={third} rank={3} onOpen={onOpen} />
        </div>
      ) : (
        <div className="py-5 text-center text-[12px] font-medium text-[#9ca3af]">
          No author ranking yet
        </div>
      )}
    </section>
  )
}

function SideRankingTabs({ activeTab, onChange }) {
  return (
    <aside className="w-[74px] shrink-0 border-r border-[#f0f0f0] bg-white">
      <div className="sticky top-[57px] py-2">
        {rankingTabs.map((tab) => {
          const active = activeTab === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`relative flex min-h-[72px] w-full flex-col items-center justify-center gap-1.5 px-1 text-center transition ${
                active ? 'bg-[#fffaf0] text-[#d99a00]' : 'text-[#b8bcc4]'
              }`}
            >
              {active ? <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#f4b400]" /> : null}
              <i className={`${tab.icon} text-[18px]`} />
              <span className={`text-[9.5px] leading-tight ${active ? 'font-bold' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function LoadingStoryRow() {
  return (
    <div className="flex min-h-[118px] items-center gap-2.5 border-b border-[#f1f1f1] py-3">
      <div className="h-5 w-5 shrink-0 animate-pulse rounded bg-[#eef0f4]" />
      <div className="h-[96px] w-[68px] shrink-0 animate-pulse rounded-[10px] bg-[#eef0f4]" />
      <div className="min-w-0 flex-1">
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#eef0f4]" />
        <div className="mt-3 h-3 w-2/3 animate-pulse rounded-full bg-[#eef0f4]" />
      </div>
    </div>
  )
}

function RankedStoryRow({ story, rank, onOpen }) {
  const tag = story.tags.find(
    (item) => item.toLowerCase() !== String(story.genre || '').toLowerCase()
  )

  return (
    <button
      type="button"
      onClick={() => onOpen(story.id)}
      className="flex min-h-[118px] w-full items-center gap-2.5 border-b border-[#f1f1f1] py-3 text-left active:bg-[#fafafa]"
    >
      <div
        className={`w-5 shrink-0 text-center text-[20px] font-bold ${
          rank === 1
            ? 'text-[#e5a400]'
            : rank === 2
              ? 'text-[#8d99aa]'
              : rank === 3
                ? 'text-[#be762f]'
                : 'text-[#555b66]'
        }`}
      >
        {rank}
      </div>

      <div className="h-[96px] w-[68px] shrink-0 overflow-hidden rounded-[10px] bg-[#eef0f4]">
        {story.cover ? (
          <img
            src={story.cover}
            alt={story.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111827] text-[22px] font-bold text-white">
            {getInitial(story.title)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-[#111827]">
          {story.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-[#7b8190]">{story.genre}</span>
          {tag ? (
            <>
              <span className="text-[10px] text-[#c0c4cc]">•</span>
              <span className="rounded-full bg-[#f4f5f7] px-2 py-0.5 text-[10px] font-semibold text-[#737987]">
                {tag}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function EmptyState() {
  return (
    <div className="px-3 py-16 text-center">
      <div className="text-[14px] font-bold text-[#111827]">No ranking yet</div>
      <div className="mt-1 text-[11px] font-medium text-[#9ca3af]">
        Stories will appear here when ranking data is available.
      </div>
    </div>
  )
}

function MyAuthorRankCard({ author, rank, onOpen }) {
  if (!author) return null

  return (
    <button
      type="button"
      onClick={() => onOpen(author)}
      className="my-4 flex w-full items-center gap-2.5 rounded-[16px] border border-[#eee4ff] bg-[#fbf9ff] p-3 text-left active:scale-[0.99]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eeeaf7] text-[15px] font-bold text-[#111827]">
        {author.avatar_url ? (
          <img src={author.avatar_url} alt={author.page_name || 'Author'} className="h-full w-full object-cover" />
        ) : (
          getInitial(author.page_name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold text-[#8b5cf6]">Your Rank</div>
        <div className="mt-0.5 truncate text-[12px] font-bold text-[#111827]">
          {author.page_name || 'Author'}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[22px] font-black text-[#7c3aed]">
          {rank ? `#${rank}` : '20+'}
        </div>
        <div className="text-[9px] font-medium text-[#9ca3af]">Author</div>
      </div>
    </button>
  )
}

export default function RankingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bestseller')
  const [activeGenre, setActiveGenre] = useState('All')
  const [activeTime, setActiveTime] = useState('Weekly')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [authors, setAuthors] = useState([])
  const [authorsLoading, setAuthorsLoading] = useState(true)
  const [myAuthor, setMyAuthor] = useState(null)

  const activeConfig = rankingTabs.find((tab) => tab.key === activeTab) || rankingTabs[0]

  useEffect(() => {
    let ignore = false

    async function fetchAuthors() {
      const token = getReaderToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      try {
        setAuthorsLoading(true)

        const requests = [
          fetch(`${API_URL}/api/authors/top?limit=20`, { headers }),
          token ? fetch(`${API_URL}/api/authors/me`, { headers }) : Promise.resolve(null),
        ]

        const [topResult, meResult] = await Promise.allSettled(requests)

        if (topResult.status === 'fulfilled') {
          const response = topResult.value
          const data = await response.json().catch(() => ({}))

          if (!ignore && response.ok && data.ok !== false) {
            setAuthors(Array.isArray(data.author_pages) ? data.author_pages : [])
          }
        }

        if (token && meResult.status === 'fulfilled' && meResult.value) {
          const response = meResult.value
          const data = await response.json().catch(() => ({}))

          if (!ignore && response.ok && data.ok !== false && data.has_author_page) {
            setMyAuthor(data.author_page || null)
          }
        }
      } catch {
        if (!ignore) {
          setAuthors([])
          setMyAuthor(null)
        }
      } finally {
        if (!ignore) setAuthorsLoading(false)
      }
    }

    fetchAuthors()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchRankingStories() {
      try {
        setLoading(true)

        const statusQuery = activeTab === 'completed' ? '&story_status=Completed' : ''
        const publicUrl = `${API_URL}/api/public/stories?limit=24&sort=${activeConfig.sort}${statusQuery}`
        const exclusiveUrl = `${API_URL}/api/public/shadow-exclusive/stories?limit=24&sort=${activeConfig.sort}${statusQuery}`

        const [publicResult, exclusiveResult] = await Promise.allSettled([
          fetch(publicUrl),
          fetch(exclusiveUrl),
        ])

        async function readStories(result) {
          if (result.status !== 'fulfilled') return []

          const response = result.value
          const data = await response.json().catch(() => ({}))

          if (!response.ok || data.ok === false) return []

          return Array.isArray(data.stories) ? data.stories : []
        }

        const publicStories = await readStories(publicResult)
        const exclusiveStories = await readStories(exclusiveResult)
        const storyMap = new Map()

        ;[...publicStories, ...exclusiveStories].forEach((story) => {
          if (story?.id && !storyMap.has(story.id)) {
            storyMap.set(story.id, story)
          }
        })

        let nextStories = Array.from(storyMap.values()).map(normalizeStory)

        if (activeTab === 'completed') {
          nextStories = nextStories.filter((story) => story.status === 'Completed')
        }

        if (!ignore) {
          setStories(nextStories)
          setActiveGenre('All')
        }
      } catch {
        if (!ignore) setStories([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchRankingStories()

    return () => {
      ignore = true
    }
  }, [activeTab, activeConfig.sort])

  const genres = useMemo(() => {
    const values = [...new Set(stories.map((story) => story.genre).filter(Boolean))]
    return ['All', ...values]
  }, [stories])

  const visibleStories = useMemo(() => {
    if (activeGenre === 'All') return stories

    return stories.filter(
      (story) => String(story.genre).toLowerCase() === String(activeGenre).toLowerCase()
    )
  }, [stories, activeGenre])

  const myAuthorRank = useMemo(() => {
    if (!myAuthor) return null
    if (Number(myAuthor.rank) > 0) return Number(myAuthor.rank)

    const index = authors.findIndex(
      (author) =>
        String(author.id || '') === String(myAuthor.id || '') ||
        String(author.page_username || '') === String(myAuthor.page_username || '')
    )

    return index >= 0 ? index + 1 : null
  }, [authors, myAuthor])

  function openStory(storyId) {
    if (storyId) navigate(`/story/${storyId}`)
  }

  function openAuthor(author) {
    if (author?.page_username) {
      navigate(`/author/page/${author.page_username}`)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-[100px]">
      <header className="sticky top-0 z-50 border-b border-[#f1f1f1] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[640px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-start text-[#111827] active:opacity-50"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[20px]" />
          </button>

          <h1 className="text-[18px] font-bold text-[#111827]">Ranking</h1>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="flex h-8 w-8 items-center justify-end text-[#111827] active:opacity-50"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-[19px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[640px] bg-white">
        <div className="hidden">
          {hiddenTimeFilters.map((filter) => (
            <button key={filter} type="button" onClick={() => setActiveTime(filter)}>
              {activeTime === filter ? filter : filter}
            </button>
          ))}
        </div>

        <TopAuthorsSection
          authors={authors.slice(0, 3)}
          loading={authorsLoading}
          onOpen={openAuthor}
          onViewAll={() => navigate('/authors/top')}
        />

        <section className="border-b border-[#f1f1f1] bg-white px-3 py-3">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {genres.map((genre) => {
              const active = activeGenre === genre

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setActiveGenre(genre)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold transition ${
                    active
                      ? 'border-[#f4b400] bg-[#111827] text-[#ffd21c]'
                      : 'border-[#111827] bg-[#111827] text-white'
                  }`}
                >
                  {genre}
                </button>
              )
            })}
          </div>
        </section>

        <div className="flex items-stretch">
          <SideRankingTabs activeTab={activeTab} onChange={setActiveTab} />

          <section className="min-w-0 flex-1 px-3">
            {loading ? (
              <>
                <LoadingStoryRow />
                <LoadingStoryRow />
                <LoadingStoryRow />
                <LoadingStoryRow />
                <LoadingStoryRow />
              </>
            ) : visibleStories.length ? (
              visibleStories.map((story, index) => (
                <RankedStoryRow
                  key={story.id}
                  story={story}
                  rank={index + 1}
                  onOpen={openStory}
                />
              ))
            ) : (
              <EmptyState />
            )}

            <MyAuthorRankCard
              author={myAuthor}
              rank={myAuthorRank}
              onOpen={openAuthor}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

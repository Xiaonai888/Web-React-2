import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const RANKING_LIMIT = 24

const rankingTabs = [
  { key: 'bestseller', label: 'Bestseller', icon: 'fa-solid fa-trophy', sort: 'views' },
  { key: 'new', label: 'New', icon: 'fa-solid fa-star', sort: 'newest' },
  { key: 'popular', label: 'Popular', icon: 'fa-solid fa-fire', sort: 'popular' },
  { key: 'rising', label: 'Rising', icon: 'fa-solid fa-arrow-trend-up', sort: 'weekly_updates' },
  { key: 'must_read', label: 'Must-read', icon: 'fa-solid fa-book-open', sort: 'comments' },
  { key: 'completed', label: 'Completed', icon: 'fa-solid fa-circle-check', sort: 'popular' },
]

const rankingGenres = [
  'All',
  'Romance',
  'Fantasy',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'School Life',
  'Historical',
  'Mystery',
  'Horror',
  'Thriller',
  'Sci-Fi',
  'System',
  'Isekai',
  'Supernatural',
  'Martial Arts',
  'Revenge',
  'CEO',
  'Slow Burn',
  'Enemies to Lovers',
  'Time Travel',
  'Strong Female Lead',
  'Hidden Identity',
  'Royalty',
  'Magic',
  'Second Chance',
  'Cold Male Lead',
  'BL',
  'GL',
  'LGBTQ+',
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
    views: Number(story.total_views || 0),
    likes: Number(story.total_likes || 0),
    comments: Number(story.total_comments || 0),
    weeklyUpdates: Number(story.weekly_update_count || 0),
    createdAt: new Date(story.created_at || 0).getTime(),
    updatedAt: new Date(
      story.last_episode_published_at ||
        story.updated_at ||
        story.created_at ||
        0
    ).getTime(),
  }
}

function sortRankingStories(stories, activeTab) {
  return [...stories].sort((first, second) => {
    if (activeTab === 'rising') {
      return (
        second.weeklyUpdates - first.weeklyUpdates ||
        second.updatedAt - first.updatedAt
      )
    }

    if (activeTab === 'new') {
      return second.createdAt - first.createdAt
    }

    if (activeTab === 'bestseller') {
      return (
        second.views - first.views ||
        second.likes - first.likes ||
        second.updatedAt - first.updatedAt
      )
    }

    if (activeTab === 'must_read') {
      return (
        second.comments - first.comments ||
        second.likes - first.likes ||
        second.updatedAt - first.updatedAt
      )
    }

    return (
      second.likes - first.likes ||
      second.views - first.views ||
      second.updatedAt - first.updatedAt
    )
  })
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
      className={`relative min-w-0 flex-1 text-center active:scale-[0.98] ${
        isFirst ? '-mt-3' : 'mt-2'
      }`}
    >
      <div className="relative mx-auto w-fit">
        <i
  className={`fa-solid fa-crown absolute -top-7 left-1/2 -translate-x-1/2 text-[24px] ${
    rank === 1
      ? 'text-[#f5b600]'
      : rank === 2
        ? 'text-[#aeb8c7]'
        : 'text-[#d88b45]'
  }`}
/>

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

      <div
        className={`${isFirst ? 'mt-6' : 'mt-5'} truncate px-1 text-[12px] font-bold text-[#111827]`}
      >
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
    <section className="bg-white px-4 pb-5 pt-4">
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
              <div
                className={`${
                  item === 1 ? 'h-[82px] w-[82px]' : 'h-[68px] w-[68px]'
                } animate-pulse rounded-full bg-[#eef0f4]`}
              />
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

function GenreScroller({ genres, activeGenre, onChange }) {
  const scrollRef = useRef(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  })

  function startDrag(event) {
    if (event.button !== 0 || !scrollRef.current) return

    dragRef.current.active = true
    dragRef.current.startX = event.clientX
    dragRef.current.startScrollLeft = scrollRef.current.scrollLeft
    dragRef.current.moved = false
  }

  function moveDrag(event) {
    if (!dragRef.current.active || !scrollRef.current) return

    const distance = event.clientX - dragRef.current.startX

    if (Math.abs(distance) > 4) {
      dragRef.current.moved = true
    }

    scrollRef.current.scrollLeft =
      dragRef.current.startScrollLeft - distance
  }

  function stopDrag() {
    if (!dragRef.current.active) return

    dragRef.current.active = false

    window.setTimeout(() => {
      dragRef.current.moved = false
    }, 0)
  }

  return (
    <section className="bg-white px-3 py-3">
      <div
        ref={scrollRef}
        onMouseDown={startDrag}
        onMouseMove={moveDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        className="no-scrollbar flex cursor-grab select-none gap-2 overflow-x-auto py-[1px] active:cursor-grabbing"
      >
        {genres.map((genre) => {
          const active = activeGenre === genre

          return (
            <button
              key={genre}
              type="button"
              onClick={() => {
                if (dragRef.current.moved) return
                onChange(genre)
              }}
              className={`shrink-0 rounded-full px-3 py-1 text-[12.5px] leading-[18px] transition-colors active:scale-[0.98] ${
                active
                  ? 'bg-[#facc15] font-semibold text-[#111827]'
                  : 'bg-white font-medium text-[#111827] ring-1 ring-[#e4e7ec] hover:bg-[#facc15] hover:text-[#111827]'
              }`}
            >
              {genre}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function SideRankingTabs({ activeTab, onChange }) {
  return (
    <aside className="w-[74px] shrink-0 bg-white">
      <div className="sticky top-[57px] py-2">
        {rankingTabs.map((tab) => {
          const active = activeTab === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className="flex min-h-[72px] w-full flex-col items-center justify-center gap-1.5 px-1 text-center"
            >
              <i
                className={`${tab.icon} text-[18px] transition-colors ${
                  active ? 'text-[#facc15]' : 'text-[#cfd2d8]'
                }`}
              />

              <span className="text-[9.5px] font-medium leading-tight text-[#111827]">
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

  const genreText = [story.genre, tag].filter(Boolean).join('/')

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

        <div className="mt-2 truncate text-[11px] font-normal text-[#7b8190]">
          {genreText}
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
          <img
            src={author.avatar_url}
            alt={author.page_name || 'Author'}
            className="h-full w-full object-cover"
          />
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
          {rank ? `#${rank}` : '—'}
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
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [authors, setAuthors] = useState([])
  const [authorsLoading, setAuthorsLoading] = useState(true)
  const [myAuthor, setMyAuthor] = useState(null)

  const activeConfig =
    rankingTabs.find((tab) => tab.key === activeTab) || rankingTabs[0]

  useEffect(() => {
    let ignore = false

    async function fetchAuthors() {
      const token = getReaderToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      try {
        setAuthorsLoading(true)

        const requests = [
          fetch(`${API_URL}/api/authors/top?limit=20`, { headers }),
          token
            ? fetch(`${API_URL}/api/authors/me`, { headers })
            : Promise.resolve(null),
        ]

        const [topResult, meResult] = await Promise.allSettled(requests)

        if (topResult.status === 'fulfilled') {
          const response = topResult.value
          const data = await response.json().catch(() => ({}))

          if (!ignore && response.ok && data.ok !== false) {
            setAuthors(
              Array.isArray(data.author_pages) ? data.author_pages : []
            )
          }
        }

        if (token && meResult.status === 'fulfilled' && meResult.value) {
          const response = meResult.value
          const data = await response.json().catch(() => ({}))

          if (
            !ignore &&
            response.ok &&
            data.ok !== false &&
            data.has_author_page
          ) {
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

        const params = new URLSearchParams({
          limit: String(RANKING_LIMIT),
          ranking: '1',
          sort: activeConfig.sort,
        })

        if (activeTab === 'completed') {
          params.set('story_status', 'Completed')
        }

        if (activeGenre !== 'All') {
          params.set('genre', activeGenre)
        }

        const publicUrl = addStoryLanguageParam(
          `${API_URL}/api/public/stories?${params.toString()}`
        )

        const exclusiveUrl = addStoryLanguageParam(
          `${API_URL}/api/public/shadow-exclusive/stories?${params.toString()}`
        )

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

        for (const story of [...publicStories, ...exclusiveStories]) {
          if (story?.id && !storyMap.has(story.id)) {
            storyMap.set(story.id, story)
          }
        }

        let nextStories = Array.from(storyMap.values()).map(normalizeStory)

        if (activeTab === 'rising') {
          nextStories = nextStories.filter((story) => story.weeklyUpdates > 0)
        }

        if (activeTab === 'completed') {
          nextStories = nextStories.filter((story) => story.status === 'Completed')
        }

        nextStories = sortRankingStories(nextStories, activeTab).slice(
          0,
          RANKING_LIMIT
        )

        if (!ignore) {
          setStories(nextStories)
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
  }, [activeTab, activeGenre, activeConfig.sort])

  const myAuthorRank = useMemo(() => {
    if (!myAuthor) return null
    if (Number(myAuthor.rank) > 0) return Number(myAuthor.rank)

    const index = authors.findIndex(
      (author) =>
        String(author.id || '') === String(myAuthor.id || '') ||
        String(author.page_username || '') ===
          String(myAuthor.page_username || '')
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
        <TopAuthorsSection
          authors={authors.slice(0, 3)}
          loading={authorsLoading}
          onOpen={openAuthor}
          onViewAll={() => navigate('/authors/top')}
        />

        <GenreScroller
  genres={rankingGenres}
  activeGenre={activeGenre}
  onChange={setActiveGenre}
/>

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
            ) : stories.length ? (
              stories.map((story, index) => (
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

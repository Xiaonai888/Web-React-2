import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const rankingTabs = [
  { key: 'popular', label: 'Popular', sort: 'popular' },
  { key: 'rising', label: 'Rising', sort: 'weekly_top' },
  { key: 'new', label: 'New', sort: 'newest' },
  { key: 'completed', label: 'Completed', sort: 'popular' },
]

const timeFilters = ['Today', 'Weekly', 'Monthly']

function formatNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function getStoryStatus(story) {
  const status = String(story.status || '').toLowerCase()

  if (status.includes('complete') || status.includes('end')) return 'Completed'
  if (status.includes('ongoing')) return 'Ongoing'

  return 'Updated'
}

function getRankStyle(rank) {
  if (rank === 1) return 'bg-[#f6b800] text-[#111827] shadow-[0_10px_25px_rgba(246,184,0,0.35)]'
  if (rank === 2) return 'bg-[#c9d4e5] text-[#111827] shadow-[0_10px_25px_rgba(148,163,184,0.25)]'
  if (rank === 3) return 'bg-[#ff9a3d] text-white shadow-[0_10px_25px_rgba(255,154,61,0.35)]'

  return 'bg-[#111827] text-white'
}

function normalizeStory(story) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author: story.author_page?.page_name || story.author_name || 'Shadow Author',
    genre: story.main_genre || 'Novel',
    description: story.description || '',
    cover: story.cover_url || '',
    status: getStoryStatus(story),
    totalViews: Number(story.total_views || 0),
    totalLikes: Number(story.total_likes || 0),
    totalEpisodes: Number(story.total_episodes || 0),
  }
}

function LoadingCard() {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="h-[118px] w-[82px] shrink-0 animate-pulse rounded-[16px] bg-[#eef0f4]" />
        <div className="min-w-0 flex-1 py-1">
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-[#eef0f4]" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-[#eef0f4]" />
          <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-[#eef0f4]" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-[#eef0f4]" />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
        <i className="fa-solid fa-trophy text-[24px]" />
      </div>
      <h2 className="text-[18px] font-black text-[#111827]">No ranking yet</h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        Ranking will appear after stories receive enough activity.
      </p>
    </div>
  )
}

function TopStoryCard({ story, rank, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story.id)}
      className="group min-w-[210px] flex-1 overflow-hidden rounded-[26px] bg-white text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
    >
      <div className="relative aspect-[3/4] bg-[#eef0f4]">
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111827] text-[42px] font-black text-white">
            {story.title.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className={`absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[17px] font-black ${getRankStyle(rank)}`}>
          {rank}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-[#111827]">
            {story.status}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 text-[15px] font-black text-[#111827]">{story.title}</h3>
        <p className="mt-1 line-clamp-1 text-[12px] font-bold text-[#6b7280]">{story.author}</p>
        <div className="mt-2 flex items-center gap-3 text-[11px] font-extrabold text-[#0b5cff]">
          <span><i className="fa-regular fa-eye mr-1 text-[#111827]" />{formatNumber(story.totalViews)}</span>
          <span><i className="fa-solid fa-heart mr-1 text-[#ff2f55]" />{formatNumber(story.totalLikes)}</span>
        </div>
      </div>
    </button>
  )
}

function RankedStoryRow({ story, rank, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story.id)}
      className="flex w-full gap-3 rounded-[24px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
    >
      <div className={`mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black ${getRankStyle(rank)}`}>
        {rank}
      </div>

      <div className="h-[118px] w-[82px] shrink-0 overflow-hidden rounded-[16px] bg-[#eef0f4]">
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111827] text-[28px] font-black text-white">
            {story.title.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="min-w-0 truncate text-[16px] font-black text-[#111827]">{story.title}</h3>
          <span className="shrink-0 rounded-full bg-[#f5f3fa] px-2 py-0.5 text-[10px] font-black text-[#6b7280]">
            {story.status}
          </span>
        </div>

        <p className="mt-1 truncate text-[12px] font-bold text-[#6b7280]">{story.author}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-extrabold">
          <span className="text-[#111827]"><i className="fa-regular fa-eye mr-1" />{formatNumber(story.totalViews)}</span>
          <span className="text-[#ff2f55]"><i className="fa-solid fa-heart mr-1" />{formatNumber(story.totalLikes)}</span>
          <span className="text-[#0b5cff]"><i className="fa-solid fa-list mr-1 text-[#111827]" />Ep {formatNumber(story.totalEpisodes)}</span>
        </div>

        <div className="mt-2 inline-flex rounded-full bg-[#f8fafc] px-2.5 py-1 text-[10.5px] font-black text-[#6b7280]">
          {story.genre}
        </div>

        {story.description ? (
          <p className="mt-2 line-clamp-2 text-[11.5px] font-medium leading-5 text-[#6b7280]">
            {story.description}
          </p>
        ) : null}
      </div>
    </button>
  )
}

export default function RankingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('popular')
  const [activeTime, setActiveTime] = useState('Weekly')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  const activeConfig = rankingTabs.find((tab) => tab.key === activeTab) || rankingTabs[0]

  useEffect(() => {
    let ignore = false

    async function fetchRankingStories() {
      try {
        setLoading(true)

        const response = await fetch(`${API_URL}/api/public/stories?limit=24&sort=${activeConfig.sort}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load ranking')
        }

        let nextStories = (data.stories || []).map(normalizeStory)

        if (activeTab === 'completed') {
          nextStories = nextStories.filter((story) => story.status === 'Completed')
        }

        if (!ignore) {
          setStories(nextStories)
        }
      } catch (error) {
        console.error('Fetch ranking error:', error)
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

  const topStories = useMemo(() => stories.slice(0, 3), [stories])
  const listStories = useMemo(() => stories.slice(3), [stories])

  function openStory(storyId) {
    if (storyId) navigate(`/story/${storyId}`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[18px] font-black tracking-tight text-[#111827]">Ranking</h1>
            <p className="text-[11px] font-bold text-[#8b93a1]">Stories readers are loving right now</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-magnifying-glass text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[28px] bg-[#111827] p-4 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <i className="fa-solid fa-trophy text-[22px] text-[#f6b800]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-black">Weekly Ranking</h2>
              <p className="mt-1 text-[12px] font-semibold text-white/65">Updated from reader activity and story performance.</p>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex min-w-max gap-2">
            {rankingTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-5 py-2 text-[13px] font-black transition ${
                  activeTab === tab.key
                    ? 'bg-[#111827] text-white'
                    : 'bg-white text-[#111827] ring-1 ring-black/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-3 flex gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveTime(filter)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-black ${
                activeTime === filter
                  ? 'bg-[#f6b800] text-[#111827]'
                  : 'bg-white text-[#8b93a1] ring-1 ring-black/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </section>

        {loading ? (
          <section className="mt-4 space-y-3">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </section>
        ) : null}

        {!loading && stories.length === 0 ? (
          <section className="mt-4">
            <EmptyState />
          </section>
        ) : null}

        {!loading && topStories.length > 0 ? (
          <section className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-black text-[#111827]">Top 3</h2>
              <span className="text-[11px] font-bold text-[#8b93a1]">{activeTime}</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {topStories.map((story, index) => (
                <TopStoryCard
                  key={story.id}
                  story={story}
                  rank={index + 1}
                  onOpen={openStory}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!loading && listStories.length > 0 ? (
          <section className="mt-5 space-y-3">
            <h2 className="text-[17px] font-black text-[#111827]">More Rankings</h2>

            {listStories.map((story, index) => (
              <RankedStoryRow
                key={story.id}
                story={story}
                rank={index + 4}
                onOpen={openStory}
              />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}

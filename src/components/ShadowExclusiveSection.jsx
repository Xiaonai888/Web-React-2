import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageLabel } from '../utils/storyLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const fallbackSectionData = [
  {
    id: 'exclusive-empty-1',
    title: 'Shadow Exclusive',
    image: '/assets/Must Read pic/Must Read 1.jpg',
    genre: 'Premium',
    genreColor: 'amber',
    episode: 'EP 0',
    link: '/shadow-exclusive',
  },
  {
    id: 'exclusive-empty-2',
    title: 'Waiting for Approval',
    image: '/assets/Must Read pic/Must Read 2.jpg',
    genre: 'Premium',
    genreColor: 'amber',
    episode: 'EP 0',
    link: '/shadow-exclusive',
  },
  {
    id: 'exclusive-empty-3',
    title: 'Premium Stories Soon',
    image: '/assets/Must Read pic/Must Read 3.jpg',
    genre: 'Premium',
    genreColor: 'amber',
    episode: 'EP 0',
    link: '/shadow-exclusive',
  },
]

function genreColorFor(genre) {
  const text = String(genre || '').toLowerCase()

  if (text.includes('fantasy') || text.includes('system') || text.includes('isekai')) return 'emerald'
  if (text.includes('romance') || text.includes('love')) return 'rose'
  if (text.includes('action') || text.includes('adventure')) return 'sky'
  if (text.includes('horror') || text.includes('thriller') || text.includes('mystery')) return 'violet'

  return 'amber'
}

function normalizeStory(story, index = 0) {
  const genre = story.main_genre || 'Premium'

  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image: story.cover_url || `/assets/Must Read pic/Must Read ${Math.min(index + 1, 6)}.jpg`,
    genre,
    genreColor: genreColorFor(genre),
    episode: `EP ${Number(story.total_episodes || 0)}`,
    link: `/story/${story.id}`,
    isAdult: Boolean(story.is_adult),
    isReal: true,
  }
}

function genreTextClass(color) {
  if (color === 'emerald') return 'text-emerald-600'
  if (color === 'rose') return 'text-pink-500'
  if (color === 'sky') return 'text-sky-500'
  if (color === 'violet') return 'text-violet-500'
  return 'text-amber-600'
}

function LoadingShadowExclusive() {
  return (
    <div className="mb-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-52 animate-pulse rounded-full bg-amber-100" />
        <div className="h-4 w-14 animate-pulse rounded-full bg-amber-100" />
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-2xl bg-amber-100/70" />
            <div className="mt-3 h-3 animate-pulse rounded-full bg-amber-100" />
            <div className="mt-2 h-2 w-2/3 animate-pulse rounded-full bg-amber-100" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ShadowExclusiveSection() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [storyLanguage, setStoryLanguage] = useState(() => getStoryLanguageLabel())

  useEffect(() => {
    let ignore = false

    async function fetchExclusiveStories() {
      try {
        setLoading(true)
        setFetchFailed(false)
        setStoryLanguage(getStoryLanguageLabel())

        const response = await fetch(
          addStoryLanguageParam(`${API_BASE_URL}/api/public/shadow-exclusive/stories?limit=6&section=featured&sort=updated`)
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load Shadow Exclusive stories')
        }

        if (ignore) return

        setStories((data.stories || []).map(normalizeStory))
      } catch (error) {
        console.error('ShadowExclusiveSection fetch error:', error)

        if (!ignore) {
          setFetchFailed(true)
          setStories([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchExclusiveStories()

    return () => {
      ignore = true
    }
  }, [])

  const sectionData = useMemo(() => {
    if (stories.length) return stories
    return fetchFailed ? fallbackSectionData : []
  }, [fetchFailed, stories])

  if (loading) {
    return <LoadingShadowExclusive />
  }

  return (
    <div className="mb-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
  <img
    src="https://img.icons8.com/emoji/48/crown-emoji.png"
    className="mr-2 h-5 w-5 lg:h-[21px] lg:w-[21px]"
    alt="crown"
  />
  Shadow Exclusive
</h3>

        <Link
          to="/shadow-exclusive"
          className="text-[11px] font-black uppercase tracking-widest text-amber-700 transition-all hover:text-amber-800 hover:underline"
        >
          See All
        </Link>
      </div>

      {sectionData.length ? (
        <div className="grid grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-6">
          {sectionData.map((item) => (
            <Link
              to={item.link || `/story/${item.id}`}
              key={item.id}
              className="group flex cursor-pointer flex-col"
            >
              <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-[0_8px_24px_rgba(212,175,55,0.18)] transition-all duration-500 group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.28)]">
                <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-amber-300/80" />

                <img
                  src={item.image}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.title}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/Must Read pic/Must Read 1.jpg'
                  }}
                />

                <div className="absolute right-2 top-2 z-20 rounded-full border border-amber-100 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.16em] text-amber-950 shadow-[0_6px_18px_rgba(212,175,55,0.35)]">
                  Premium
                </div>

                {item.isAdult ? (
                  <div className="absolute bottom-2 left-2 z-20 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[9px] font-extrabold text-[#e5484d]">
                    18+
                  </div>
                ) : null}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
              </div>

              <div className="px-0.5">
                <h4 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-extrabold leading-tight text-gray-900 transition-colors group-hover:text-amber-700">
                  {item.title}
                </h4>

                <div className="flex items-center gap-2 text-[9px] font-semibold">
                  <span className={genreTextClass(item.genreColor)}>
                    {item.genre}
                  </span>

                  <span className="text-gray-400">•</span>

                  <span className="text-gray-500">{item.episode}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-[#fff7d8] px-4 py-6 text-center ring-1 ring-[#f6b800]/25">
          <div className="text-[14px] font-extrabold text-[#111827]">
            No {storyLanguage} exclusive stories yet
          </div>
          <div className="mt-1 text-[12px] text-[#8d94a1]">
            Try another story language from Settings.
          </div>
        </div>
      )}
    </div>
  )
}

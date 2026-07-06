import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clapperboard,
  Crown,
  Eye,
  Flame,
  Gift,
  Link2,
  LockKeyhole,
  Play,
  Plus,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react'

const FEATURED_VIDEO = {
  title: 'Cinematic Travel Film',
  creator: 'WanderLens',
  avatar: 'https://i.pravatar.cc/120?img=12',
  thumbnail:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=88',
  duration: '18:42',
  views: '24.7K',
  age: '2 days ago',
  url: 'https://www.youtube.com/',
}

const VIDEOS = [
  {
    id: 1,
    title: 'Minimal Desk Setup for Productivity',
    creator: 'TechFlow',
    avatar: 'https://i.pravatar.cc/80?img=11',
    thumbnail:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=86',
    duration: '12:15',
    views: '8.9K',
    age: '3 days ago',
    access: 'free',
    trending: true,
    isNew: true,
    url: 'https://www.youtube.com/',
  },
  {
    id: 2,
    title: 'Mastering Landscape Photography',
    creator: 'PhotoGuru',
    avatar: 'https://i.pravatar.cc/80?img=13',
    thumbnail:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=86',
    duration: '24:10',
    views: '5.3K',
    age: '1 week ago',
    access: 'premium',
    price: '$1.99',
    trending: true,
    isNew: false,
    url: '',
  },
  {
    id: 3,
    title: '5 Quick & Healthy Dinner Ideas',
    creator: 'TastyBites',
    avatar: 'https://i.pravatar.cc/80?img=32',
    thumbnail:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=86',
    duration: '15:33',
    views: '12.1K',
    age: '5 days ago',
    access: 'free',
    trending: false,
    isNew: true,
    url: 'https://www.youtube.com/',
  },
  {
    id: 4,
    title: "I Don’t Wait by the Door Anymore",
    creator: 'Alpha Relaxation',
    avatar: '/assets/Icons/shadow-icon-192.png?v=2',
    thumbnail:
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=900&q=86',
    duration: '5:05',
    views: '1.2K',
    age: '1 month ago',
    access: 'free',
    trending: true,
    isNew: false,
    url: 'https://www.youtube.com/',
  },
]

const FILTERS = [
  { key: 'trending', label: 'Trending', Icon: Flame },
  { key: 'new', label: 'New', Icon: Sparkles },
  { key: 'premium', label: 'Premium', Icon: Crown },
  { key: 'free', label: 'Free', Icon: Gift },
]

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function VideoCard({ video, onOpen }) {
  const isPremium = video.access === 'premium'

  return (
    <article className="rounded-[22px] border border-[#ece9f5] bg-white p-3 shadow-[0_14px_34px_rgba(73,51,120,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(73,51,120,0.12)]">
      <div className="grid grid-cols-[118px_minmax(0,1fr)] gap-3 sm:grid-cols-[185px_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => onOpen(video)}
          className="relative h-[112px] overflow-hidden rounded-[16px] bg-[#eee9fb] sm:h-[126px]"
          aria-label={`Open ${video.title}`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />

          {isPremium ? (
            <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/92 text-[#6d3fe7] shadow-sm backdrop-blur">
              <LockKeyhole size={14} strokeWidth={2.2} />
            </span>
          ) : null}

          <span className="absolute bottom-2 right-2 rounded-[8px] bg-[#151127]/82 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
            {video.duration}
          </span>
        </button>

        <div className="flex min-w-0 flex-col">
          <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[#171329] sm:text-[16px] sm:leading-6">
            {video.title}
          </h3>

          <div className="mt-2 flex min-w-0 items-center gap-2">
            <img
              src={video.avatar}
              alt={video.creator}
              className="h-6 w-6 shrink-0 rounded-full border border-[#ece9f5] object-cover"
            />
            <span className="truncate text-[11px] font-semibold text-[#686276] sm:text-[12px]">
              {video.creator}
            </span>
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7042e8] text-[8px] font-black text-white">
              ✓
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[#918a9e] sm:text-[11px]">
            <Eye size={13} />
            <span>{video.views} views</span>
            <span>•</span>
            <span className="truncate">{video.age}</span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold sm:text-[11px] ${
                isPremium
                  ? 'bg-[#fff7df] text-[#b87900]'
                  : 'bg-[#eafaf1] text-[#168653]'
              }`}
            >
              {isPremium ? 'Premium' : 'Free'}
            </span>

            <button
              type="button"
              onClick={() => onOpen(video)}
              className={`flex min-w-[78px] items-center justify-center gap-1.5 rounded-[12px] px-3 py-2 text-[11px] font-extrabold transition active:scale-95 sm:min-w-[96px] sm:text-[12px] ${
                isPremium
                  ? 'bg-gradient-to-r from-[#7a45ea] to-[#5e35d5] text-white shadow-[0_10px_22px_rgba(104,61,220,0.25)]'
                  : 'border border-[#7445e8] bg-white text-[#6739db] hover:bg-[#f6f1ff]'
              }`}
            >
              {isPremium ? <LockKeyhole size={13} /> : <Play size={13} fill="currentColor" />}
              {isPremium ? video.price : 'Watch'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Fast() {
  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const [activeFilter, setActiveFilter] = useState('trending')
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const user = useMemo(() => getStoredUser(), [])

  const displayName =
    user?.display_name || user?.displayName || user?.name || user?.username || 'Shadow'
  const avatarUrl =
    user?.avatar_url ||
    user?.avatarUrl ||
    user?.profile_image ||
    user?.profileImage ||
    user?.photo_url ||
    user?.photoUrl ||
    ''
  const avatarLetter = String(displayName).trim().charAt(0).toUpperCase() || 'S'

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return VIDEOS.filter((video) => {
      const matchesQuery =
        !normalizedQuery ||
        video.title.toLowerCase().includes(normalizedQuery) ||
        video.creator.toLowerCase().includes(normalizedQuery)

      if (!matchesQuery) return false
      if (activeFilter === 'new') return video.isNew
      if (activeFilter === 'premium') return video.access === 'premium'
      if (activeFilter === 'free') return video.access === 'free'
      return video.trending
    })
  }, [activeFilter, query])

  const openVideo = (video) => {
    if (video.access === 'premium') {
      navigate('/premium')
      return
    }

    window.open(video.url, '_blank', 'noopener,noreferrer')
  }

  const goTo = (path) => {
    setProfileOpen(false)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#f7f5fb] text-[#171329]">
      <div className="mx-auto w-full max-w-[980px] px-3 pb-[96px] pt-3 sm:px-5 sm:pt-4">
        <header className="sticky top-0 z-[70] mb-4 rounded-[22px] border border-[#ece9f5] bg-white/95 px-3 py-3 shadow-[0_12px_32px_rgba(60,42,96,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/fast')}
              className="flex shrink-0 items-center gap-2 rounded-[14px] px-1 py-1 text-[#171329] transition active:scale-95"
              aria-label="Fast home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8b55ef] to-[#5f35d6] text-white shadow-[0_10px_20px_rgba(108,62,221,0.25)]">
                <Play size={17} fill="currentColor" />
              </span>
              <span className="hidden text-[22px] font-black tracking-[-0.04em] min-[360px]:block">
                Fast
              </span>
            </button>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="flex min-w-0 flex-1 items-center rounded-full border border-[#ddd8e9] bg-[#faf9fd] px-3 transition focus-within:border-[#8150e9] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(125,75,231,0.09)]"
            >
              <Search size={17} className="shrink-0 text-[#767080]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search videos, creators..."
                className="h-10 min-w-0 flex-1 bg-transparent px-2 text-[12px] font-medium text-[#171329] outline-none placeholder:text-[#9993a4] sm:text-[13px]"
              />
            </form>

            <button
              type="button"
              onClick={() => navigate('/fast/studio')}
              className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#7846e7] bg-white px-3 text-[#6738d9] transition hover:bg-[#f6f1ff] active:scale-95"
              aria-label="Create"
            >
              <Plus size={17} strokeWidth={2.3} />
              <span className="hidden text-[12px] font-extrabold sm:inline">Create</span>
            </button>

            <div ref={profileMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8d56ef] to-[#5b32cf] text-[14px] font-black text-white ring-2 ring-[#e8ddff] transition active:scale-95"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  avatarLetter
                )}
              </button>

              {profileOpen ? (
                <div className="absolute right-0 top-12 z-[90] w-[190px] overflow-hidden rounded-[18px] border border-[#e8e4f1] bg-white p-1.5 shadow-[0_20px_50px_rgba(38,24,68,0.18)]">
                  <button
                    type="button"
                    onClick={() => goTo('/profile')}
                    className="flex w-full items-center gap-3 rounded-[13px] px-3 py-3 text-left text-[13px] font-bold text-[#292238] transition hover:bg-[#f6f2ff]"
                  >
                    <UserRound size={18} className="text-[#7250bd]" />
                    View account
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo('/author/dashboard')}
                    className="flex w-full items-center gap-3 rounded-[13px] px-3 py-3 text-left text-[13px] font-bold text-[#292238] transition hover:bg-[#f6f2ff]"
                  >
                    <Clapperboard size={18} className="text-[#7250bd]" />
                    Studio
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="relative h-[270px] overflow-hidden rounded-[26px] bg-[#28184f] shadow-[0_22px_48px_rgba(67,42,119,0.2)] sm:h-[370px]">
          <img
            src={FEATURED_VIDEO.thumbnail}
            alt={FEATURED_VIDEO.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130d24]/95 via-[#21133f]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d175c]/30 via-transparent to-[#ef7d93]/10" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#21133f]/78 px-3 py-2 text-[11px] font-extrabold text-[#d8c3ff] backdrop-blur sm:left-4 sm:top-4 sm:text-[12px]">
            <Link2 size={14} />
            Link Video
          </div>

          <div className="absolute right-3 top-3 rounded-[10px] bg-[#171126]/78 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur sm:right-4 sm:top-4 sm:text-[12px]">
            {FEATURED_VIDEO.duration}
          </div>

          <button
            type="button"
            onClick={() => openVideo({ ...FEATURED_VIDEO, access: 'free' })}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/92 text-[#7141df] shadow-[0_16px_36px_rgba(34,20,67,0.28)] backdrop-blur transition hover:scale-105 active:scale-95 sm:h-20 sm:w-20"
            aria-label={`Play ${FEATURED_VIDEO.title}`}
          >
            <Play size={27} fill="currentColor" className="ml-1 sm:h-8 sm:w-8" />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-[20px] font-black tracking-[-0.02em] text-white sm:text-[28px]">
                  {FEATURED_VIDEO.title}
                </h1>
                <div className="mt-2 flex min-w-0 items-center gap-2 text-white/82">
                  <img
                    src={FEATURED_VIDEO.avatar}
                    alt={FEATURED_VIDEO.creator}
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-white/80 object-cover sm:h-10 sm:w-10"
                  />
                  <span className="truncate text-[11px] font-bold sm:text-[13px]">
                    {FEATURED_VIDEO.creator}
                  </span>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7b48e7] text-[8px] font-black text-white">
                    ✓
                  </span>
                  <span className="hidden text-[11px] font-medium text-white/70 min-[380px]:inline sm:text-[12px]">
                    • {FEATURED_VIDEO.age}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/28 px-3 py-2 text-[11px] font-bold text-white backdrop-blur sm:text-[12px]">
                <Eye size={15} />
                {FEATURED_VIDEO.views}
              </div>
            </div>
          </div>
        </section>

        <div className="my-3 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7444e2]" />
          <span className="h-2 w-2 rounded-full bg-[#dcd5ea]" />
          <span className="h-2 w-2 rounded-full bg-[#dcd5ea]" />
          <span className="h-2 w-2 rounded-full bg-[#dcd5ea]" />
        </div>

        <div
          className="mb-4 flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {FILTERS.map(({ key, label, Icon }) => {
            const active = activeFilter === key

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[12px] font-extrabold transition active:scale-95 sm:px-5 sm:text-[13px] ${
                  active
                    ? 'border-[#7443e5] bg-[#7443e5] text-white shadow-[0_10px_22px_rgba(116,67,229,0.22)]'
                    : 'border-[#e3dfec] bg-white text-[#4d4658] hover:border-[#bfa8ee] hover:bg-[#faf7ff]'
                }`}
              >
                <Icon size={16} fill={key === 'premium' && active ? 'currentColor' : 'none'} />
                {label}
              </button>
            )
          })}
        </div>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3 px-1">
            <div>
              <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#171329] sm:text-[20px]">
                Videos for you
              </h2>
              <p className="mt-0.5 text-[11px] font-medium text-[#918a9e] sm:text-[12px]">
                Watch linked videos or unlock premium content.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#eee8fb] px-3 py-1.5 text-[10px] font-extrabold text-[#6c3fd7] sm:text-[11px]">
              {filteredVideos.length} videos
            </span>
          </div>

          {filteredVideos.length ? (
            <div className="space-y-3">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} onOpen={openVideo} />
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#d8d0e8] bg-white px-5 py-12 text-center shadow-sm">
              <Search className="mx-auto text-[#8b6bd0]" size={28} />
              <h3 className="mt-3 text-[15px] font-extrabold text-[#211a30]">No videos found</h3>
              <p className="mt-1 text-[12px] text-[#918a9e]">Try another search or category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

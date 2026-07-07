import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CircleDollarSign,
  Eye,
  Gem,
  LockKeyhole,
  MoreVertical,
  Play,
  Plus,
  Search,
  UserRound,
  Video,
} from 'lucide-react'

const VIDEOS = [
  {
    id: 1,
    title: 'I Don’t Wait by the Door Anymore',
    thumbnail:
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=900&q=86',
    duration: '17:22',
    access: 'paid',
    diamonds: 10,
    views: '1.2K',
    status: 'published',
  },
  {
    id: 2,
    title: 'Minimal Desk Setup for Productivity',
    thumbnail:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=86',
    duration: '12:15',
    access: 'free',
    diamonds: 0,
    views: '8.9K',
    status: 'published',
  },
  {
    id: 3,
    title: 'Mastering Landscape Photography',
    thumbnail:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=86',
    duration: '24:10',
    access: 'paid',
    diamonds: 15,
    views: '5.3K',
    status: 'published',
  },
  {
    id: 4,
    title: 'Morning Hike in the Mist',
    thumbnail:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=86',
    duration: '10:48',
    access: 'free',
    diamonds: 0,
    views: '320',
    status: 'draft',
  },
]

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
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

function StatCard({ label, value, Icon }) {
  return (
    <div className="rounded-[20px] border border-[#ece8f5] bg-white p-4 shadow-[0_12px_28px_rgba(77,51,125,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-[#928b9f]">{label}</p>
          <p className="mt-1 text-[22px] font-black tracking-[-0.03em] text-[#171329]">{value}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#f0eaff] text-[#7041de]">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default function FastStudioPage() {
  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
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
    const closeMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileOpen(false)
    }

    document.addEventListener('pointerdown', closeMenu)
    return () => document.removeEventListener('pointerdown', closeMenu)
  }, [])

  const filteredVideos = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return VIDEOS.filter((video) => {
      const matchesQuery = !normalized || video.title.toLowerCase().includes(normalized)
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'published' && video.status === 'published') ||
        (activeTab === 'draft' && video.status === 'draft')

      return matchesQuery && matchesTab
    })
  }, [activeTab, query])

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-10 text-[#171329]">
      <header className="sticky top-0 z-50 border-b border-[#ece8f5] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1040px] items-center gap-3 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/fast')}
            className="flex shrink-0 items-center gap-2"
            aria-label="Fast Studio"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#8b55ef] to-[#5f35d6] text-white shadow-[0_10px_20px_rgba(108,62,221,0.22)]">
              <Play size={18} fill="currentColor" />
            </span>
            <span className="hidden text-[20px] font-black tracking-[-0.03em] sm:inline">
              Fast Studio
            </span>
          </button>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="ml-auto hidden h-10 min-w-0 max-w-[360px] flex-1 items-center rounded-full border border-[#ddd7e8] bg-[#faf9fd] px-3 focus-within:border-[#7443e5] focus-within:bg-white md:flex"
          >
            <Search size={16} className="shrink-0 text-[#81788f]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search videos"
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-[12px] outline-none placeholder:text-[#aaa3b4]"
            />
          </form>

          <button
            type="button"
            onClick={() => navigate('/fast/studio/create')}
            className="ml-auto flex h-10 items-center gap-2 rounded-full bg-[#7443e5] px-4 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(116,67,229,0.23)] transition hover:bg-[#6538d2] active:scale-95 md:ml-0"
          >
            <Plus size={17} />
            Create
          </button>

          <div ref={profileMenuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#8d56ef] to-[#5b32cf] text-[14px] font-black text-white ring-2 ring-[#e8ddff]"
              aria-label="Open profile menu"
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
                  onClick={() => navigate('/profile')}
                  className="flex w-full items-center gap-3 rounded-[13px] px-3 py-3 text-left text-[13px] font-bold text-[#292238] transition hover:bg-[#f6f2ff]"
                >
                  <UserRound size={18} className="text-[#7250bd]" />
                  View account
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[13px] bg-[#f3edff] px-3 py-3 text-left text-[13px] font-bold text-[#6738d9]"
                >
                  <Video size={18} />
                  Studio
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1040px] px-3 py-5 sm:px-5">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Total videos" value="28" Icon={Video} />
          <StatCard label="Free videos" value="18" Icon={Play} />
          <StatCard label="Paid videos" value="10" Icon={LockKeyhole} />
          <StatCard label="Total views" value="24.7K" Icon={Eye} />
          <StatCard label="Diamonds earned" value="1,250" Icon={Gem} />
        </section>

        <section className="mt-5 rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[20px] font-black tracking-[-0.03em] text-[#171329]">
                Your videos
              </h1>
              <p className="mt-1 text-[12px] text-[#918a9e]">
                Manage published videos and drafts.
              </p>
            </div>

            <div className="flex h-10 items-center rounded-full border border-[#ddd7e8] bg-[#faf9fd] px-3 md:hidden">
              <Search size={16} className="shrink-0 text-[#81788f]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search videos"
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-[12px] outline-none placeholder:text-[#aaa3b4]"
              />
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold transition ${
                  activeTab === tab.key
                    ? 'bg-[#7443e5] text-white'
                    : 'border border-[#e4dfea] bg-white text-[#6f667d] hover:bg-[#f8f5ff]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <article
                key={video.id}
                className="grid grid-cols-[104px_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border border-[#ece8f5] p-3 sm:grid-cols-[148px_minmax(0,1fr)_auto]"
              >
                <div className="relative h-[76px] overflow-hidden rounded-[13px] bg-[#eee9f7] sm:h-[86px]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1.5 right-1.5 rounded-[7px] bg-black/70 px-1.5 py-1 text-[9px] font-bold text-white">
                    {video.duration}
                  </span>
                </div>

                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-[12px] font-extrabold leading-5 text-[#211a30] sm:text-[14px]">
                    {video.title}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-[#918a9e]">
                    {video.access === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-[#7041de]">
                        <Gem size={12} fill="currentColor" />
                        {video.diamonds} Diamonds
                      </span>
                    ) : (
                      <span className="text-[#168653]">Free</span>
                    )}
                    <span>•</span>
                    <span>{video.views} views</span>
                  </div>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ${
                      video.status === 'published'
                        ? 'bg-[#eafaf1] text-[#168653]'
                        : 'bg-[#fff4dd] text-[#aa7200]'
                    }`}
                  >
                    {video.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e2ddea] text-[#6f667d] transition hover:bg-[#f7f3ff] hover:text-[#7041de]"
                  aria-label={`Open options for ${video.title}`}
                >
                  <MoreVertical size={17} />
                </button>
              </article>
            ))}

            {!filteredVideos.length ? (
              <div className="rounded-[18px] border border-dashed border-[#d8d0e8] px-5 py-12 text-center">
                <Search className="mx-auto text-[#8b6bd0]" size={27} />
                <p className="mt-3 text-[13px] font-extrabold text-[#211a30]">No videos found</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}

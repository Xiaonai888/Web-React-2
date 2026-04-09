import { useEffect, useMemo, useState } from 'react'

const story = {
  id: 'story-001',
  title: 'Call Me As Your Name',
  cover: '',
  hashtags: ['Romance', 'Action'],
  rank: 25,
  likes: '200k',
  views: '1.1M',
  rating: '4.8',
  totalRatings: '1.1k Reviews',
  updateDays: 'Sat, Sun',
  description:
    'Ika is the only survivor of a genocide of humans by demons summoned from another universe and sent to wipe out life on his planet through a portal. During the destruction, he also gained a special ability that was the inheritance of the power of the demon king and the hero at the same time, which made him the strongest on Earth. After gaining this immense power, he hunted down all the demons he encountered, but they kept coming back.',
  genres: ['Romance', 'Comedy', 'Fantasy', 'Action', 'BL', 'School life'],
  totalEpisodes: 55,
  continueEpisode: 2,
  authorName: 'Reaper Of Soul',
  latestComment: {
    user: 'Angela Gomez',
    date: '8/04/2025',
    level: 'Lv20',
    tier: 'P1',
    text: 'This episode broke me 😂',
    likes: 130,
    comments: 11,
    echo: 4,
    avatar: '',
  },
  episodes: [
    { id: 1, title: '1.Call me as your name', date: '23-11-2024', time: '11:11', likes: '10k', comments: '10k', isNew: true, isLocked: false, image: '' },
    { id: 2, title: '2.See You Again', date: '23-11-2024', time: '11:11', likes: '10k', comments: '10k', isNew: true, isLocked: false, image: '' },
    { id: 3, title: '3.First Coffee', date: '23-11-2024', time: '11:11', likes: '10k', comments: '10k', isNew: false, isLocked: true, image: '' },
  ],
  otherWorks: [
    { id: 'ow-1', title: 'Name Book', status: 'New', image: '' },
    { id: 'ow-2', title: 'Name Book', status: 'New', image: '' },
    { id: 'ow-3', title: 'Name Book', status: 'End', image: '' },
    { id: 'ow-4', title: 'Name Book', status: 'New', image: '' },
    { id: 'ow-5', title: 'Name Book', status: 'New', image: '' },
    { id: 'ow-6', title: 'Name Book', status: 'End', image: '' },
  ],
  youMightLike: [
    { id: 'ym-1', title: 'Name Book', status: 'New', image: '' },
    { id: 'ym-2', title: 'Name Book', status: 'New', image: '' },
    { id: 'ym-3', title: 'Name Book', status: 'End', image: '' },
    { id: 'ym-4', title: 'Name Book', status: 'New', image: '' },
    { id: 'ym-5', title: 'Name Book', status: 'New', image: '' },
    { id: 'ym-6', title: 'Name Book', status: 'End', image: '' },
  ],
}

function IconBack(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function IconLibrary(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 4h12a1 1 0 011 1v15l-7-4-7 4V5a1 1 0 011-1z" />
    </svg>
  )
}

function IconLibraryFilled(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 4h12a1 1 0 011 1v15l-7-4-7 4V5a1 1 0 011-1z" />
    </svg>
  )
}

function IconSubHeart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 21s-6.5-4.35-9.14-8.27C.62 9.47 2.15 5 6.42 5c2.15 0 3.41 1.14 4.12 2.2C11.25 6.14 12.51 5 14.66 5c4.27 0 5.8 4.47 3.56 7.73C18.5 16.65 12 21 12 21z" />
    </svg>
  )
}

function IconSubHeartFilled(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 21s-6.5-4.35-9.14-8.27C.62 9.47 2.15 5 6.42 5c2.15 0 3.41 1.14 4.12 2.2C11.25 6.14 12.51 5 14.66 5c4.27 0 5.8 4.47 3.56 7.73C18.5 16.65 12 21 12 21z" />
    </svg>
  )
}

function IconMore(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  )
}

function IconTrophy(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 3h10v2.5A5 5 0 0112 10a5 5 0 01-5-4.5V3zm-3 1h3v1.5A7.01 7.01 0 015 10.6 4 4 0 012 7.1C2 5.39 3.34 4 5 4zm13 0h3c1.66 0 3 1.39 3 3.1a4 4 0 01-3 3.5A7.01 7.01 0 0117 5.5V4zM9 13h6a3 3 0 01-3 3v2h3v2H9v-2h3v-2a3 3 0 01-3-3z" />
    </svg>
  )
}

function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconStar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.7l2.8 5.67 6.26.91-4.53 4.41 1.07 6.24L12 16.97l-5.6 2.96 1.07-6.24L2.94 9.28l6.26-.91L12 2.7z" />
    </svg>
  )
}

function IconComment(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
    </svg>
  )
}

function IconEcho(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  )
}

function IconLock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 118 0v3" />
    </svg>
  )
}

function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function ActionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-md transition-transform active:scale-95"
    >
      {children}
    </button>
  )
}

function MenuItem({ children, danger = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left text-[13px] font-semibold transition-colors ${
        danger ? 'text-rose-400 hover:bg-rose-500/10' : 'text-white/85 hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  )
}

function SectionTitle({ children, action, onClick }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-[17px] font-bold text-[#1f1f1f] md:text-[18px]">{children}</h2>
      {action ? (
        <button onClick={onClick} className="inline-flex items-center gap-1 text-[13px] text-[#6d6d6d]">
          <span>{action}</span>
          <IconChevronRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}

function StoryCard({ item }) {
  const badgeClass =
    item.status === 'End'
      ? 'bg-[#24ff00] text-[#101010]'
      : item.status === 'New'
      ? 'bg-[#ff2121] text-white'
      : 'bg-[#ffc81d] text-[#1b1b1b]'

  return (
    <button className="min-w-0 text-left">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] bg-[#1f1f22]">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[30px] text-white">M</div>
        )}
        <span className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[11px] font-bold ${badgeClass}`}>
          {item.status}
        </span>
      </div>
      <div className="mt-3 truncate text-[13px] font-bold text-[#1f1f1f]">{item.title}</div>
    </button>
  )
}

function EpisodeRow({ item }) {
  return (
    <button className="flex w-full items-center gap-4 rounded-2xl py-1 text-left">
      <div className="relative h-[56px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-[#d9d9d9]">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-[#8b8b8b]">Cover</div>
        )}
        {item.isNew ? (
          <span className="absolute right-2 top-2 rounded-full bg-[#ffc81d] px-2 py-[2px] text-[9px] font-bold text-[#1b1b1b]">
            New
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-[#1f1f1f]">{item.title}</div>
        <div className="mt-1 text-[11px] text-[#aaaaaa]">
          {item.date} &nbsp;&nbsp; {item.time}
        </div>
        <div className="mt-2 flex items-center gap-4 text-[11px] text-[#8e8e8e]">
          <span className="inline-flex items-center gap-1">
            <IconSubHeart className="h-3.5 w-3.5" />
            {item.likes}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconComment className="h-3.5 w-3.5" />
            {item.comments}
          </span>
        </div>
      </div>

      {item.isLocked ? <IconLock className="h-4 w-4 shrink-0 text-[#a8a8a8]" /> : null}
    </button>
  )
}

function ComingSoonModal({ open, title, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-sm rounded-[22px] bg-white p-6 shadow-2xl">
        <h3 className="text-[18px] font-bold text-[#1f1f1f]">{title}</h3>
        <p className="mt-3 text-[14px] leading-6 text-[#666]">Coming soon.</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-[#ffbe00] px-5 py-2.5 text-[14px] font-medium text-[#1f1f1f]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StoryDetailPage() {
  const [showCompactHeader, setShowCompactHeader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [inLibrary, setInLibrary] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [episodesOpen, setEpisodesOpen] = useState(false)
  const [authorOpen, setAuthorOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowCompactHeader(window.scrollY > 170)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const descriptionStyle = useMemo(() => {
    if (descriptionExpanded) return {}
    return {
      display: '-webkit-box',
      WebkitLineClamp: 6,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }
  }, [descriptionExpanded])

  return (
    <div className="min-h-screen bg-[#f6f6f6] pb-[168px] md:pb-[150px]">
      <ComingSoonModal open={reviewOpen} title="Review Page" onClose={() => setReviewOpen(false)} />
      <ComingSoonModal open={episodesOpen} title="Full Episodes Page" onClose={() => setEpisodesOpen(false)} />
      <ComingSoonModal open={authorOpen} title="Author Page" onClose={() => setAuthorOpen(false)} />
      <ComingSoonModal open={commentsOpen} title="Comments Page" onClose={() => setCommentsOpen(false)} />

      <div className={`fixed left-0 right-0 top-0 z-[70] transition-all duration-300 ${showCompactHeader ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}>
        <div className="flex h-14 items-center justify-between bg-white/95 px-4 shadow-sm backdrop-blur-md">
          <button onClick={() => window.history.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f3] text-[#222]">
            <IconBack className="h-5 w-5" />
          </button>

          <div className="mx-3 flex-1 truncate text-center text-[15px] font-bold text-[#1f1f1f]">{story.title}</div>

          <div className="flex items-center gap-2">
            <button onClick={() => setInLibrary(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f3]">
              {inLibrary ? <IconLibraryFilled className="h-5 w-5 text-[#4f6bff]" /> : <IconLibrary className="h-5 w-5 text-[#222]" />}
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f3]">
                <IconMore className="h-5 w-5 text-[#222]" />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-11 w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-2xl">
                  <MenuItem onClick={() => setMenuOpen(false)}>Echo</MenuItem>
                  <MenuItem onClick={() => setMenuOpen(false)}>Copy link</MenuItem>
                  <MenuItem danger onClick={() => setMenuOpen(false)}>Report</MenuItem>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <section className="relative h-[302px] overflow-hidden bg-[#222]">
        {story.cover ? <img src={story.cover} alt={story.title} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#6f655a_0%,#b79577_22%,#7a5f53_45%,#c9b099_70%,#e8d9bb_100%)]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10" />

        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-4">
          <ActionButton onClick={() => window.history.back()}>
            <IconBack className="h-5 w-5" />
          </ActionButton>

          <div className="flex items-center gap-2">
            <ActionButton onClick={() => setInLibrary(v => !v)}>
              {inLibrary ? <IconLibraryFilled className="h-5 w-5 text-white" /> : <IconLibrary className="h-5 w-5" />}
            </ActionButton>

            <div className="relative">
              <ActionButton onClick={() => setMenuOpen(v => !v)}>
                <IconMore className="h-5 w-5" />
              </ActionButton>
              {menuOpen ? (
                <div className="absolute right-0 top-11 w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-[#151515] shadow-2xl">
                  <MenuItem onClick={() => setMenuOpen(false)}>Echo</MenuItem>
                  <MenuItem onClick={() => setMenuOpen(false)}>Copy link</MenuItem>
                  <MenuItem danger onClick={() => setMenuOpen(false)}>Report</MenuItem>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-4 right-4 text-white">
          <h1 className="text-[26px] font-bold leading-tight">{story.title}</h1>
          <div className="mt-2 text-[15px] text-white/85">{story.hashtags.join(' / ')}</div>
        </div>
      </section>

      <main className="relative z-10 -mt-4">
        <section className="rounded-t-[22px] bg-white px-4 pb-5 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.03)]">
          <button className="flex w-full items-center justify-between rounded-full bg-[#f8f2dd] px-4 py-3">
            <div className="inline-flex items-center gap-2">
              <IconTrophy className="h-5 w-5 text-[#f0ba11]" />
              <span className="text-[14px] font-bold text-[#1d1d1d]">No.{story.rank}</span>
            </div>
            <IconChevronRight className="h-4 w-4 text-[#f0ba11]" />
          </button>

          <div className="mt-4 flex items-start justify-between gap-3 text-center">
            <button className="flex-1">
              <div className="text-[17px] font-bold text-[#1f1f1f]">{story.likes}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#a5a5a5]">
                <IconSubHeart className="h-3.5 w-3.5" />
                Likes
              </div>
            </button>

            <button className="flex-1">
              <div className="text-[17px] font-bold text-[#1f1f1f]">{story.views}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#a5a5a5]">
                <IconEye className="h-3.5 w-3.5" />
                Views
              </div>
            </button>

            <button onClick={() => setReviewOpen(true)} className="flex-1">
              <div className="text-[17px] font-bold text-[#ff9747]">{story.rating}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#a5a5a5]">
                <IconStar className="h-3.5 w-3.5 text-[#ff9747]" />
                <span>{story.totalRatings}</span>
                <IconChevronRight className="h-3 w-3" />
              </div>
            </button>
          </div>
        </section>

        <section className="mt-2 bg-white px-4 py-7">
          <div className="text-[14px] font-bold text-[#1f1f1f]">Updates: {story.updateDays}</div>

          <div className="mt-5">
            <p style={descriptionStyle} className="text-[15px] leading-[1.6] text-[#3a3a3a]">{story.description}</p>
            <button onClick={() => setDescriptionExpanded(v => !v)} className="mt-4 flex w-full items-center justify-center text-[#b4b4b4]">
              <IconChevronDown className={`h-5 w-5 transition-transform ${descriptionExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {story.genres.map(item => (
              <span key={item} className="rounded-md bg-[#f7f7f7] px-3 py-1.5 text-[12px] text-[#b0b0b0]">{item}</span>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-[16px] font-bold text-[#1f1f1f]">Ongoing</h2>
            <div className="mt-5 space-y-5">
              {story.episodes.map(item => <EpisodeRow key={item.id} item={item} />)}
            </div>
          </div>
        </section>

        <section className="mt-3 bg-white px-4 py-5">
          <button onClick={() => setEpisodesOpen(true)} className="flex w-full items-center justify-center gap-3 rounded-[16px] border border-[#ececec] bg-[#fbfbfb] px-4 py-4 text-[15px] font-normal text-[#8f8f8f]">
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="text-[10px]">▲</span>
              <span className="text-[10px] -mt-0.5">▼</span>
            </div>
            <span>Up to Ep. {story.totalEpisodes}</span>
          </button>
        </section>

        <section className="mt-3 bg-white px-4 py-8">
          <SectionTitle action="View All" onClick={() => setCommentsOpen(true)}>Last Comment</SectionTitle>
          <button onClick={() => setCommentsOpen(true)} className="w-full rounded-[18px] bg-[#fafafa] px-4 py-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9e9e9] text-[12px] text-[#8d8d8d]">A</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-bold text-[#1f1f1f]">{story.latestComment.user}</span>
                    <span className="text-[12px] text-[#4268ff]">👑</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-[#2d6cff] px-2 py-0.5 text-[10px] font-bold text-white">{story.latestComment.level}</span>
                    <span className="rounded-full bg-[#121212] px-2 py-0.5 text-[10px] font-bold text-[#ffc81d]">{story.latestComment.tier}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-[11px] text-[#9f9f9f]">{story.latestComment.date}</div>
            </div>

            <div className="mt-4 text-[14px] text-[#2c2c2c]">{story.latestComment.text}</div>

            <div className="mt-8 flex items-center gap-5 text-[12px] text-[#7f7f7f]">
              <span className="inline-flex items-center gap-1"><IconSubHeart className="h-4 w-4" />{story.latestComment.likes}</span>
              <span className="inline-flex items-center gap-1"><IconComment className="h-4 w-4" />{story.latestComment.comments}</span>
              <span className="inline-flex items-center gap-1"><IconEcho className="h-4 w-4" />{story.latestComment.echo}</span>
            </div>
          </button>
        </section>

        <section className="mt-3 bg-white px-4 py-8">
          <SectionTitle action="Author Page" onClick={() => setAuthorOpen(true)}>Another work by {story.authorName}</SectionTitle>
          <div className="mt-6 grid grid-cols-3 gap-5 md:grid-cols-6">
            {story.otherWorks.map(item => <StoryCard key={item.id} item={item} />)}
          </div>

          <div className="mt-8">
            <SectionTitle>You Might Like</SectionTitle>
            <div className="mt-6 grid grid-cols-3 gap-5 md:grid-cols-6">
              {story.youMightLike.map(item => <StoryCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-[68px] left-0 right-0 z-[65] bg-transparent px-4">
        <div className="mx-auto flex max-w-md items-center gap-3 py-2">
          <button onClick={() => setSubscribed(v => !v)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#1f1f1f] shadow-sm">
            {subscribed ? <IconSubHeartFilled className="h-6 w-6 text-[#ffbe00]" /> : <IconSubHeart className="h-6 w-6" />}
          </button>

          <button className="flex-1 rounded-full bg-[#ffbe00] px-5 py-4 text-[16px] font-normal text-[#1f1f1f] shadow-sm">
            Continue Ep. {story.continueEpisode}
          </button>
        </div>
      </div>
    </div>
  )
}

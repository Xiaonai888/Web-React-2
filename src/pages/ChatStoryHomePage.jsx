import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const hotPicks = [
  { id: '1', title: 'Not Just a Marriage of Convenience', cover: '/assets/chat-story/hot-1.jpg', views: '2.34M', genre: 'Fantasy Romance', badge: 'HOT' },
  { id: '2', title: 'From Chaos to Love: My Husband', cover: '/assets/chat-story/hot-2.jpg', views: '206.4K', genre: 'Modern Romance', badge: 'NEW' },
  { id: '3', title: 'Quietly Obsessed With You', cover: '/assets/chat-story/hot-3.jpg', views: '96.3K', genre: 'LGBT', badge: 'HOT' },
  { id: '4', title: 'Devil’s Badass Wife', cover: '/assets/chat-story/hot-4.jpg', views: '1.56M', genre: 'Modern Romance', badge: 'END' },
]

const sections = [
  {
    key: 'romance',
    icon: '💕',
    title: 'Romance',
    stories: [
      { id: '5', title: 'A Little Timid, Completely Yours', cover: '/assets/chat-story/romance-1.jpg', views: '23.9K', genre: 'Modern Romance' },
      { id: '6', title: 'Reborn to Get Pampered', cover: '/assets/chat-story/romance-2.jpg', views: '399.9K', genre: 'Fantasy Romance' },
      { id: '7', title: 'I Became His Favorite', cover: '/assets/chat-story/romance-3.jpg', views: '260.7K', genre: 'Fantasy Romance' },
      { id: '8', title: 'Not Just a Marriage', cover: '/assets/chat-story/romance-4.jpg', views: '2.34M', genre: 'Fantasy Romance' },
    ],
  },
  {
    key: 'lgbt',
    icon: '🌈',
    title: 'LGBT',
    stories: [
      { id: '9', title: 'Transmigrated: I Am a Star', cover: '/assets/chat-story/lgbt-1.jpg', views: '23.7K', comments: '43' },
      { id: '10', title: 'Married to My Villain', cover: '/assets/chat-story/lgbt-2.jpg', views: '138.5K', comments: '931' },
      { id: '11', title: 'She Rejected Me, Now He Wants Me', cover: '/assets/chat-story/lgbt-3.jpg', views: '977.8K', comments: '1.08K' },
      { id: '12', title: 'Be Mine', cover: '/assets/chat-story/lgbt-4.jpg', views: '14.4K', comments: '51' },
    ],
  },
  {
    key: 'cp-idol',
    icon: '🌟',
    title: 'CP Idol',
    stories: [
      { id: '13', title: 'Reborn to Love My Husband', cover: '/assets/chat-story/cp-1.jpg', views: '535.4K', comments: '557' },
      { id: '14', title: 'Reincarnate to Find a New Love', cover: '/assets/chat-story/cp-2.jpg', views: '177.6K', comments: '775' },
      { id: '15', title: 'Please, Love Me Once More', cover: '/assets/chat-story/cp-3.jpg', views: '108.7K', comments: '113' },
      { id: '16', title: 'I Fell in Love Again', cover: '/assets/chat-story/cp-4.jpg', views: '12.1K', comments: '42' },
    ],
  },
]

const categories = [
  { title: 'Modern Romance', icon: '🥂', className: 'from-[#ff8cb9] to-[#f6b7e6]' },
  { title: 'LGBT', icon: '🌈', className: 'from-[#5b7cff] to-[#d083ee]' },
  { title: 'CP Idol', icon: '🎤', className: 'from-[#ffa4bf] to-[#a9eff6]' },
  { title: 'Fantasy Romance', icon: '👑', className: 'from-[#ffd777] to-[#a8efae]' },
  { title: 'Fanfic Anime / Game / Film', icon: '🎮', className: 'from-[#f6aa8d] to-[#a9eff6]' },
  { title: 'Action / Adventure / Horror', icon: '⚔️', className: 'from-[#ffc06f] to-[#8db8ef]' },
]

function CoverFallback({ title }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#efe8ff] via-[#fde8f2] to-[#e7f5ff] p-2 text-center">
      <span className="line-clamp-3 text-[10px] font-extrabold leading-4 text-[#6d42db]">{title}</span>
    </div>
  )
}

function StoryCover({ story, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(story)}
      className="w-[112px] shrink-0 text-left active:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[13px] bg-[#f3f4f6]">
        {story.cover ? (
          <img
            src={story.cover}
            alt={story.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <CoverFallback title={story.title} />
        )}

        {story.badge ? (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-[#7c3aed] px-2 py-1 text-[8px] font-black text-white">
            {story.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-2 line-clamp-2 min-h-[34px] text-[12px] font-extrabold leading-[17px] text-[#22252b]">
        {story.title}
      </div>

      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#9aa0aa]">
        <i className="fa-regular fa-eye text-[9px]" />
        <span>{story.views}</span>
      </div>

      <div className="mt-0.5 line-clamp-1 text-[10px] font-semibold text-[#a4a8b0]">
        {story.genre || `${story.comments || 0} comments`}
      </div>
    </button>
  )
}

function SectionHeader({ icon, title, onMore }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-[22px] leading-none">{icon}</span>
        <h2 className="truncate text-[20px] font-black tracking-[-0.02em] text-[#292d33]">{title}</h2>
      </div>

      <button
        type="button"
        onClick={onMore}
        className="shrink-0 text-[11px] font-bold text-[#a0a4ad] active:text-[#6d42db]"
      >
        See all <i className="fa-solid fa-chevron-right ml-1 text-[8px]" />
      </button>
    </div>
  )
}

export default function ChatStoryHomePage() {
  const navigate = useNavigate()

  const featureBanners = useMemo(
    () => [
      {
        id: 'feature-1',
        title: 'What’s it like to date a villain?',
        subtitle: 'New writing event',
        className: 'from-[#ffd8e8] via-[#fff0f6] to-[#f8d7e9]',
      },
      {
        id: 'feature-2',
        title: 'Chat Story Creator Week',
        subtitle: 'Join the challenge',
        className: 'from-[#b9ecff] via-[#d8f2ff] to-[#b8c8ff]',
      },
    ],
    []
  )

  const openStory = (story) => {
    navigate(`/story/${story.id}`)
  }

  const openCollection = (key) => {
    navigate(`/chat-stories?section=${encodeURIComponent(key)}`)
  }

  return (
    <div className="min-h-screen bg-white pb-[110px]">
      <header className="sticky top-0 z-40 bg-white/95 px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center justify-between">
    <h1 className="text-[21px] font-black tracking-[-0.02em] text-[#1f2329]">
      Chat
    </h1>

    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => navigate('/search')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#1f2329] active:bg-[#f4f2f8]"
        aria-label="Search"
      >
        <i className="fa-solid fa-magnifying-glass text-[19px]" />
      </button>

      <button
        type="button"
        onClick={() => navigate('/chat-stories/categories')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#1f2329] active:bg-[#f4f2f8]"
        aria-label="Genres"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
    </div>
  </div>
</header>

      <main className="mx-auto max-w-6xl">
        <section className="pt-2">
          <SectionHeader icon="💎" title="Hot Picks" onMore={() => openCollection('hot-picks')} />
          <div className="flex gap-3 overflow-x-auto px-4 pb-2">
            {hotPicks.map((story) => (
              <StoryCover key={story.id} story={story} onOpen={openStory} />
            ))}
            <div className="w-1 shrink-0" />
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader icon="🎀" title="Recent Features" onMore={() => openCollection('features')} />
          <div className="flex gap-3 overflow-x-auto px-4 pb-1">
            {featureBanners.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => openCollection(feature.id)}
                className={`relative h-[116px] w-[82vw] max-w-[430px] shrink-0 overflow-hidden rounded-[16px] bg-gradient-to-r ${feature.className} px-5 text-left active:scale-[0.99]`}
              >
                <div className="absolute -right-5 -top-7 h-28 w-28 rounded-full bg-white/40" />
                <div className="absolute -bottom-10 right-16 h-24 w-24 rounded-full bg-white/30" />
                <div className="relative z-10 max-w-[70%]">
                  <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#8d5c79]">{feature.subtitle}</div>
                  <div className="mt-2 text-[18px] font-black leading-6 text-[#5d3b50]">{feature.title}</div>
                </div>
              </button>
            ))}
            <div className="w-1 shrink-0" />
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.key} className="mt-7">
            <SectionHeader
              icon={section.icon}
              title={section.title}
              onMore={() => openCollection(section.key)}
            />
            <div className="flex gap-3 overflow-x-auto px-4 pb-2">
              {section.stories.map((story) => (
                <StoryCover key={story.id} story={story} onOpen={openStory} />
              ))}
              <div className="w-1 shrink-0" />
            </div>
          </section>
        ))}

        <section className="mt-8 px-4">
          <SectionHeader icon="💖" title="Featured Categories" onMore={() => navigate('/chat-stories/categories')} />

          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.title}
                type="button"
                onClick={() =>
                  navigate(`/chat-stories?category=${encodeURIComponent(category.title)}`)
                }
                className={`relative min-h-[82px] overflow-hidden rounded-[16px] bg-gradient-to-r ${category.className} px-4 py-3 text-left shadow-[0_5px_16px_rgba(17,24,39,0.06)] active:scale-[0.98]`}
              >
                <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-[34px] drop-shadow-sm">
                  {category.icon}
                </span>
                <span className="relative z-10 block max-w-[72%] text-[14px] font-black uppercase leading-[17px] text-white drop-shadow-sm">
                  {category.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4">
          <SectionHeader icon="✨" title="New & Updated" onMore={() => openCollection('new-updated')} />

          <div className="divide-y divide-[#eef0f3]">
            {sections[0].stories.slice(0, 3).map((story, index) => (
              <button
                key={`updated-${story.id}`}
                type="button"
                onClick={() => openStory(story)}
                className="flex w-full items-center gap-3 py-3 text-left active:bg-[#faf9fc]"
              >
                <div className="h-[68px] w-[54px] shrink-0 overflow-hidden rounded-[10px] bg-[#f3f4f6]">
                  {story.cover ? (
                    <img src={story.cover} alt={story.title} className="h-full w-full object-cover" />
                  ) : (
                    <CoverFallback title={story.title} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-[14px] font-extrabold text-[#22252b]">{story.title}</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#969ba5]">
                    EP {12 - index * 3} · Updated {index === 0 ? '5 min ago' : index === 1 ? 'today' : 'yesterday'}
                  </div>
                  <div className="mt-1 line-clamp-1 text-[11px] text-[#777e89]">
                    A new conversation is waiting for you.
                  </div>
                </div>

                <span className="h-2 w-2 shrink-0 rounded-full bg-[#7c3aed]" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4">
          <SectionHeader icon="⭐" title="Recommended for You" onMore={() => openCollection('recommended')} />

          <button
            type="button"
            onClick={() => openStory(sections[2].stories[0])}
            className="flex w-full gap-3 rounded-[18px] border border-[#ececf1] bg-white p-3 text-left shadow-[0_8px_24px_rgba(17,24,39,0.05)] active:scale-[0.99]"
          >
            <div className="aspect-[3/4] w-[94px] shrink-0 overflow-hidden rounded-[12px] bg-[#f3f4f6]">
              <CoverFallback title="Falling for the Professor" />
            </div>

            <div className="min-w-0 flex-1 py-1">
              <div className="line-clamp-2 text-[16px] font-black leading-5 text-[#22252b]">
                Falling for the Professor
              </div>
              <div className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#737985]">
                He never expected her replies would change everything.
              </div>
              <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-[#969ba5]">
                <span><i className="fa-regular fa-eye mr-1" />319K</span>
                <span>Romance</span>
              </div>
            </div>

            <i className="fa-regular fa-bookmark mt-1 text-[16px] text-[#7c3aed]" />
          </button>
        </section>
      </main>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function DropdownMenu({ items, align = 'right' }) {
  return (
    <div
      className={`absolute top-9 z-40 w-44 overflow-hidden rounded-[16px] border border-[#eceaf2] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.14)] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`flex w-full items-center px-4 py-3 text-left text-[13px] font-bold transition hover:bg-[#f7f7fb] ${
            item === 'Delete' || item === 'Report' || item === 'Block'
              ? 'text-[#e5484d]'
              : 'text-[#111827]'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[15px] font-extrabold leading-none text-[#111827]">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-[#111827]">{label}</div>
    </div>
  )
}

function HighlightCircle({ title, isAdd = false }) {
  return (
    <button type="button" className="shrink-0 text-center">
      <div
        className={`mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full ${
          isAdd ? 'border border-dashed border-[#cfd3dc] bg-white' : 'bg-[#e5e5e8]'
        }`}
      >
        {isAdd ? <i className="fas fa-plus text-[18px] text-[#8d94a1]" /> : null}
      </div>
      <div className="mt-2 text-[11px] font-semibold text-[#111827]">{title}</div>
    </button>
  )
}

function PostCard({ profile, text, imageTone = '#e5e5e8', time = 'Yesterday at 10:22 AM', menuItems }) {
  const [postMenuOpen, setPostMenuOpen] = useState(false)

  return (
    <article className="bg-white md:overflow-hidden md:rounded-[24px] md:border md:border-[#eceaf2] md:shadow-sm">
      <div className="flex items-start justify-between px-4 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[18px] font-bold text-white">
            {profile.avatarLetter}
          </div>

          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827]">
              {profile.name}
            </div>
            <div className="mt-1 text-[11px] text-[#8d94a1]">{time}</div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPostMenuOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-[#f5f3fa]"
          >
            <i className="fas fa-ellipsis-v text-[14px]" />
          </button>

          {postMenuOpen ? <DropdownMenu items={menuItems} /> : null}
        </div>
      </div>

      <p className="px-4 pt-4 text-[13px] leading-5 text-[#111827]">{text}</p>

      <div className="mt-4 aspect-square w-full" style={{ backgroundColor: imageTone }} />

      <div className="flex items-center gap-5 px-4 py-3 text-[11px] text-[#111827]">
        <span>
          <i className="far fa-heart mr-1" />
          198
        </span>
        <span>
          <i className="far fa-comment mr-1" />
          32
        </span>
        <span>
          <i className="fas fa-retweet mr-1" />
          25
        </span>
        <span className="ml-auto">😍 🙂 😊</span>
      </div>
    </article>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const user = getStoredUser()
  const isOwnProfile = true

  const profile = useMemo(() => {
    return {
      name: user?.name || 'Reader Name',
      username: user?.username || 'username',
      avatarLetter: (user?.name || 'R').charAt(0).toUpperCase(),
      posts: '03',
      followers: '500',
      following: '100',
      bioTitle: 'Author and accountant',
      bio: 'Turn the impossible into reality.',
      location: 'Based in KPS',
    }
  }, [user])

  const profileMenuItems = ['Copy link', 'Report', 'Block']
  const postMenuItems = isOwnProfile ? ['Edit', 'Delete', 'Hide'] : ['Report', 'Block', 'Hide']

  const demoPosts = [
    {
      id: 1,
      text: 'Hello everyone!',
      time: 'Yesterday at 10:22 AM',
      imageTone: '#e5e5e8',
    },
    {
      id: 2,
      text: 'Today I started planning something new for my reader profile.',
      time: 'Yesterday at 8:10 PM',
      imageTone: '#eeeeef',
    },
    {
      id: 3,
      text: 'Small steps, but still moving forward.',
      time: '2 days ago',
      imageTone: '#e2e2e6',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[92px]">
      <main className="mx-auto min-h-screen w-full bg-[#f5f3fa] md:max-w-[560px] md:py-4">
        <div className="overflow-hidden bg-white md:rounded-[24px] md:border md:border-[#eceaf2] md:shadow-sm">
          <header className="sticky top-0 z-30 border-b border-[#f0eef6] bg-white/95 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f5f3fa] active:scale-95"
                  aria-label="Go back"
                >
                  <i className="fas fa-chevron-left text-[16px]" />
                </button>

                <div className="min-w-0 text-[15px] font-extrabold text-[#111827]">
                  @{profile.username}
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f5f3fa] active:scale-95"
                  aria-label="Profile menu"
                >
                  <i className="fas fa-ellipsis-v text-[15px]" />
                </button>

                {profileMenuOpen ? <DropdownMenu items={profileMenuItems} /> : null}
              </div>
            </div>
          </header>

          <section className="px-4 pb-4 pt-5">
            <div className="flex items-center gap-4">
              <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full bg-[#111827] text-[34px] font-extrabold text-white ring-2 ring-[#f6b800] md:h-[96px] md:w-[96px]">
                {profile.avatarLetter}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-2">
                  <h1 className="line-clamp-1 text-[17px] font-extrabold text-[#111827]">
                    {profile.name}
                  </h1>
                  <i className="fas fa-crown text-[14px] text-[#f6b800]" />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <StatItem value={profile.posts} label="Posts" />
                  <StatItem value={profile.followers} label="Followers" />
                  <StatItem value={profile.following} label="Following" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-[12px] leading-5 text-[#111827]">
              <div className="font-bold">{profile.bioTitle}</div>
              <div>{profile.bio}</div>
              <div>{profile.location}</div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[#111827]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fas fa-globe" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fab fa-facebook-f" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fab fa-instagram" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fas fa-link" />
              </span>
            </div>

            {isOwnProfile ? (
              <button
                type="button"
                className="mt-4 h-10 w-full rounded-[14px] border border-[#cfd3dc] bg-white text-[13px] font-extrabold text-[#111827] transition hover:bg-[#f7f7fb] active:scale-[0.99]"
              >
                Edit Profile
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="h-10 rounded-[14px] bg-[#0b5cff] text-[13px] font-extrabold text-white">
                  Follow
                </button>
                <button className="h-10 rounded-[14px] border border-[#cfd3dc] text-[13px] font-extrabold text-[#111827]">
                  Message
                </button>
              </div>
            )}
          </section>

          <section className="border-t border-[#f0eef6] px-4 py-4">
            <div className="flex gap-4 overflow-x-auto pb-1">
              <HighlightCircle title="Daily" />
              <HighlightCircle title="Study" />
              <HighlightCircle title="Travel" />
              <HighlightCircle title="Shopping" />
              {isOwnProfile ? <HighlightCircle title="New" isAdd /> : null}
            </div>
          </section>

          <section className="sticky top-[58px] z-20 border-y border-[#f0eef6] bg-white">
            <div className="grid grid-cols-3 text-center text-[12px] font-extrabold text-[#111827]">
              <button className="relative py-3">
                All
                <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#111827]" />
              </button>
              <button className="py-3">Reels</button>
              <button className="py-3">Photo</button>
            </div>
          </section>
        </div>

        <section className="mt-2 space-y-2 md:mt-3 md:space-y-3">
          {demoPosts.map((post) => (
            <PostCard
              key={post.id}
              profile={profile}
              text={post.text}
              time={post.time}
              imageTone={post.imageTone}
              menuItems={postMenuItems}
            />
          ))}
        </section>
      </main>
    </div>
  )
}

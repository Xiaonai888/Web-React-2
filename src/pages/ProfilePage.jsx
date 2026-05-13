import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
  } catch {
    return null
  }
}

function MenuDropdown({ items, align = 'right' }) {
  return (
    <div
      className={`absolute top-8 z-40 w-44 overflow-hidden rounded-[16px] border border-[#eceaf2] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.14)] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className="flex w-full items-center px-4 py-3 text-left text-[13px] font-semibold text-[#111827] transition hover:bg-[#f7f7fb]"
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function StoryCircle({ title }) {
  return (
    <div className="shrink-0 text-center">
      <div className="mx-auto h-[58px] w-[58px] rounded-full bg-[#e5e5e8]" />
      <div className="mt-2 text-[11px] font-semibold text-[#111827]">{title}</div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [postMenuOpen, setPostMenuOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[92px]">
      <main className="mx-auto max-w-[520px] bg-white min-h-screen">
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

              <div className="min-w-0 text-[16px] font-extrabold text-[#111827]">
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

              {profileMenuOpen ? <MenuDropdown items={profileMenuItems} /> : null}
            </div>
          </div>
        </header>

        <section className="px-5 pb-4 pt-5">
          <div className="flex items-start gap-4">
            <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full bg-[#111827] text-[34px] font-extrabold text-white ring-2 ring-[#f6b800]">
              {profile.avatarLetter}
            </div>

            <div className="min-w-0 flex-1 pt-2">
              <div className="flex items-center gap-2">
                <h1 className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">
                  {profile.name}
                </h1>
                <i className="fas fa-crown text-[14px] text-[#f6b800]" />
              </div>

              <div className="mt-1 text-[12px] font-semibold text-[#8d94a1]">@{profile.username}</div>

              <div className="mt-4 grid grid-cols-3 text-center">
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">{profile.posts}</div>
                  <div className="mt-1 text-[10px] font-semibold text-[#111827]">Post</div>
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">{profile.followers}</div>
                  <div className="mt-1 text-[10px] font-semibold text-[#111827]">Followers</div>
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">{profile.following}</div>
                  <div className="mt-1 text-[10px] font-semibold text-[#111827]">Following</div>
                </div>
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

        <section className="border-t border-[#f0eef6] px-5 py-4">
          <div className="flex gap-5 overflow-x-auto pb-1">
            <StoryCircle title="Daily" />
            <StoryCircle title="Study" />
            <StoryCircle title="Travel" />
            <StoryCircle title="Shopping" />
          </div>
        </section>

        <section className="sticky top-[58px] z-20 border-y border-[#f0eef6] bg-white">
          <div className="grid grid-cols-3 text-center text-[12px] font-extrabold text-[#111827]">
            <button className="py-3 text-[#111827]">All</button>
            <button className="py-3 text-[#111827]">Reels</button>
            <button className="py-3 text-[#111827]">Photo</button>
          </div>
        </section>

        <section className="bg-[#f5f3fa] px-4 py-4">
          <article className="rounded-[16px] border border-[#eceaf2] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[18px] font-bold text-white">
                  {profile.avatarLetter}
                </div>

                <div className="min-w-0">
                  <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827]">{profile.name}</div>
                  <div className="mt-1 text-[11px] text-[#8d94a1]">Yesterday at 10:22 AM</div>
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

                {postMenuOpen ? <MenuDropdown items={postMenuItems} /> : null}
              </div>
            </div>

            <p className="mt-4 text-[13px] text-[#111827]">Hello everyone!</p>

            <div className="mt-4 aspect-square w-full rounded-[4px] bg-[#e5e5e8]" />

            <div className="mt-3 flex items-center gap-5 text-[11px] text-[#111827]">
              <span><i className="far fa-heart mr-1" />198</span>
              <span><i className="far fa-comment mr-1" />32</span>
              <span><i className="fas fa-retweet mr-1" />25</span>
              <span className="ml-auto">😍 🙂 😊</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

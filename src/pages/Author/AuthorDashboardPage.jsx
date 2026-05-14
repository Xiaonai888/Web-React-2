import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[16px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.05em] text-[#9aa1ad]">{label}</div>
    </div>
  )
}

function StoryTypeButton({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 items-center gap-3 rounded-[20px] border border-[#eceaf2] bg-white p-3.5 text-left shadow-sm transition active:scale-[0.99] md:hover:-translate-y-0.5 md:hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#f5f3fa] text-[#111827] transition group-hover:bg-[#111827] group-hover:text-white">
        <i className={`${icon} text-[16px]`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827]">{title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] font-medium text-[#8d94a1]">{subtitle}</div>
      </div>
    </button>
  )
}

function ToolRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827]">
          <i className={`${icon} text-[14px]`} />
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827]">{title}</div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">{subtitle}</div>
        </div>
      </div>
      <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />
    </button>
  )
}

function PageMenu({ open, onClose, onSelect }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[330px] md:rounded-[24px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827]">Author Tools</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1]">Page, income, and settings</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7]">
            <i className="fa-solid fa-times text-[13px] text-[#555]" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white">
          <div className="divide-y divide-[#f0eef6]">
            <ToolRow icon="fa-regular fa-user" title="View Page" subtitle="Open your public author page" onClick={() => onSelect('/author/page')} />
            <ToolRow icon="fa-regular fa-pen-to-square" title="Edit Page" subtitle="Avatar, name, and page details" onClick={() => onSelect('/author/edit-page')} />
            <ToolRow icon="fa-solid fa-chart-line" title="My Income" subtitle="Earnings and payout details" onClick={() => onSelect('/author/income')} />
            <ToolRow icon="fa-solid fa-gift" title="Quest" subtitle="Tasks and creator rewards" onClick={() => onSelect('/author/quest')} />
            <ToolRow icon="fa-solid fa-crown" title="Author Benefits" subtitle="Creator programs and support" onClick={() => onSelect('/author/benefits')} />
            <ToolRow icon="fa-solid fa-gear" title="Settings" subtitle="Privacy and author options" onClick={() => onSelect('/author/settings')} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TipBubble({ open }) {
  if (!open) return null

  return (
    <div className="absolute right-0 top-9 z-20 w-[230px] rounded-[16px] bg-[#111827] px-3.5 py-3 text-[12px] font-semibold leading-5 text-white shadow-xl">
      Tap any cover to edit your story.
    </div>
  )
}

function StoryCard({ story, onEdit }) {
  return (
    <div className="flex gap-3 rounded-[20px] border border-[#eceaf2] bg-white p-3 shadow-sm">
      <button
        type="button"
        onClick={() => onEdit(story)}
        className="h-[112px] w-[78px] shrink-0 overflow-hidden rounded-[14px] bg-[#111827] shadow-sm active:scale-[0.98]"
        aria-label={`Edit ${story.title}`}
      >
        {story.cover ? <img src={story.cover} alt={story.title} className="h-full w-full object-cover" /> : null}
      </button>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[14.5px] font-extrabold text-[#111827]">{story.title}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10px] font-bold text-[#555b66]">{story.type}</span>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${story.status === 'Published' ? 'bg-[#ecfdf3] text-[#16803c]' : story.status === 'Reviewing' ? 'bg-[#fff7df] text-[#a56a00]' : 'bg-[#f2f4f7] text-[#667085]'}`}>
                {story.status}
              </span>
            </div>
          </div>

          <button type="button" onClick={() => onEdit(story)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
            <i className="fa-solid fa-pen text-[12px]" />
          </button>
        </div>

        <div className="mt-3 text-[11.5px] text-[#8d94a1]">
          Last updated <span className="font-bold text-[#555b66]">{story.updated}</span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-[#555b66]">
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-eye text-[11px]" />
            {story.views}
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-heart text-[10px] text-[#e5484d]" />
            {story.likes}
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-comment text-[11px]" />
            {story.comments}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AuthorDashboardPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tipOpen, setTipOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Novel')

  const storedUser = JSON.parse(localStorage.getItem('shadow_reader_user') || 'null')

  const author = {
    name: storedUser?.name || 'Author Page Name',
    avatarLetter: (storedUser?.name || 'A').charAt(0).toUpperCase(),
    published: '03',
    drafts: '04',
    views: '2.2k',
  }

  const stories = [
    {
      id: 1,
      title: 'Name Novel',
      type: 'Novel',
      status: 'Published',
      updated: '14/06/2026',
      views: '1.1M',
      likes: '5.1k',
      comments: '3.1k',
      cover: '',
      lastEdited: 'Episode 4',
    },
    {
      id: 2,
      title: 'Midnight Crown',
      type: 'Novel',
      status: 'Draft',
      updated: '13/06/2026',
      views: '120k',
      likes: '900',
      comments: '120',
      cover: '',
      lastEdited: 'Episode 2',
    },
    {
      id: 3,
      title: 'Moonlight Blade',
      type: 'Manga',
      status: 'Reviewing',
      updated: '12/06/2026',
      views: '60k',
      likes: '510',
      comments: '80',
      cover: '',
      lastEdited: 'Chapter 1',
    },
    {
      id: 4,
      title: 'Chat Before Dawn',
      type: 'Chat Story',
      status: 'Draft',
      updated: '10/06/2026',
      views: '22k',
      likes: '430',
      comments: '61',
      cover: '',
      lastEdited: 'Scene 3',
    },
  ]

  const filteredStories = useMemo(() => {
    return stories.filter((story) => story.type === activeTab)
  }, [activeTab])

  const latestStory = stories[0]

  const handleMenuSelect = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const handleCreateStory = (type) => {
    navigate(`/author/create-story?type=${encodeURIComponent(type)}`)
  }

  const handleEditStory = (story) => {
    navigate(`/author/story/${story.id}/edit`)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <PageMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={handleMenuSelect} />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Author Dashboard</h1>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
            aria-label="Author tools"
          >
            <i className="fa-solid fa-ellipsis text-[15px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-[#111827] text-[24px] font-extrabold text-white shadow-sm">
              {author.avatarLetter}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[18px] font-extrabold text-[#111827]">{author.name}</div>
              <button
                type="button"
                onClick={() => navigate('/author/page')}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11.5px] font-extrabold text-[#111827] active:scale-95"
              >
                View Page
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-[#eef0f4] rounded-[20px] bg-[#fafafe] px-2 py-3.5">
            <StatItem value={author.published} label="Published" />
            <StatItem value={author.drafts} label="Drafts" />
            <StatItem value={author.views} label="Views" />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-extrabold text-[#111827]">Continue Writing</h2>
              <p className="mt-0.5 text-[11.5px] font-medium text-[#8d94a1]">Continue your latest story draft</p>
            </div>

            <button
              type="button"
              onClick={() => handleEditStory(latestStory)}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
            >
              Continue
            </button>
          </div>

          <div className="mt-4 flex gap-3 rounded-[20px] bg-[#fafafe] p-3">
            <button
              type="button"
              onClick={() => handleEditStory(latestStory)}
              className="h-[98px] w-[70px] shrink-0 overflow-hidden rounded-[14px] bg-[#111827] active:scale-[0.98]"
              aria-label="Continue latest story"
            >
              {latestStory.cover ? <img src={latestStory.cover} alt={latestStory.title} className="h-full w-full object-cover" /> : null}
            </button>

            <div className="min-w-0 flex-1 py-1">
              <div className="line-clamp-1 text-[14.5px] font-extrabold text-[#111827]">{latestStory.title}</div>
              <div className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#555b66] ring-1 ring-[#eceaf2]">
                {latestStory.type}
              </div>
              <div className="mt-3 text-[12px] text-[#8d94a1]">
                Last edited <span className="ml-1 font-extrabold text-[#111827]">{latestStory.lastEdited}</span>
              </div>
              <div className="mt-1 text-[11.5px] text-[#8d94a1]">Updated {latestStory.updated}</div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#111827]">Create Story</h2>
            <p className="mt-0.5 text-[11.5px] font-medium text-[#8d94a1]">Start a new story format</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <StoryTypeButton icon="fa-solid fa-book-open" title="Novel" subtitle="Text episodes" onClick={() => handleCreateStory('Novel')} />
            <StoryTypeButton icon="fa-solid fa-image" title="Manga" subtitle="Image chapters" onClick={() => handleCreateStory('Manga')} />
            <StoryTypeButton icon="fa-solid fa-comments" title="Chat Story" subtitle="Message style" onClick={() => handleCreateStory('Chat Story')} />
          </div>
        </section>

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="relative">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-extrabold text-[#111827]">My Stories</h2>
                <button
                  type="button"
                  onClick={() => setTipOpen((value) => !value)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-[#555b66] shadow-sm ring-1 ring-[#eceaf2]"
                  aria-label="Show edit tip"
                >
                  ?
                </button>
              </div>
              <TipBubble open={tipOpen} />
            </div>

            <div className="text-[12px] font-bold text-[#8d94a1]">{filteredStories.length} stories</div>
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3">
            {['Novel', 'Manga', 'Chat Story'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold ${
                  activeTab === tab ? 'bg-[#111827] text-white' : 'bg-white text-[#555b66] ring-1 ring-[#eceaf2]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} onEdit={handleEditStory} />
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#d8dbe3] bg-white px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                  <i className="fa-solid fa-pen-nib text-[17px]" />
                </div>
                <div className="mt-3 text-[14px] font-extrabold text-[#111827]">No stories yet</div>
                <div className="mt-1 text-[12px] text-[#8d94a1]">Create your first {activeTab} story.</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${active ? 'bg-[#111827] text-white' : 'bg-[#f2f4f7] text-[#98a2b3]'}`}>
        {number}
      </div>
      <div className={`line-clamp-1 text-[11px] font-extrabold ${active ? 'text-[#111827]' : 'text-[#98a2b3]'}`}>
        {title}
      </div>
    </div>
  )
}

function EmptyRoleCard({ title, subtitle, side, onAdd }) {
  return (
    <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-extrabold text-[#111827]">{title}</div>
          <div className="mt-1 text-[11.5px] leading-5 text-[#8d94a1]">{subtitle}</div>
        </div>
        <span className="shrink-0 rounded-full bg-[#fff3e8] px-3 py-1.5 text-[10px] font-extrabold text-[#f97316]">
          {side}
        </span>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 flex min-h-[116px] w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d7dce5] bg-[#fafafe] px-4 text-center active:scale-[0.99]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
          <i className="fa-solid fa-plus text-[15px]" />
        </span>
        <span className="mt-3 text-[13px] font-extrabold text-[#111827]">Add character</span>
        <span className="mt-1 text-[11px] text-[#98a2b3]">Name, avatar and role position</span>
      </button>
    </section>
  )
}

export default function ChatStoryCharactersPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const openAddRole = () => {
    window.alert('Character form will be added in the next step.')
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
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

          <div className="text-center">
            <h1 className="text-[17px] font-extrabold text-[#111827]">Manage the roles</h1>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f97316]">
              Chat Story
            </div>
          </div>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-4 gap-2">
            <Step number="1" title="Story Info" />
            <Step number="2" title="Characters" active />
            <Step number="3" title="Chat" />
            <Step number="4" title="Publish" />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] p-4 ring-1 ring-[#fed7aa]">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#f97316] shadow-sm">
              <i className="fa-solid fa-user-group text-[14px]" />
            </span>
            <div>
              <div className="text-[14px] font-extrabold text-[#7c2d12]">Create at least 2 characters</div>
              <div className="mt-1 text-[11.5px] leading-5 text-[#9a3412]">
                The leading role appears on the right. Supporting roles normally appear on the left.
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 space-y-4">
          <EmptyRoleCard
            title="Leading role"
            subtitle="The main character normally appears on the right side of the conversation."
            side="Right"
            onAdd={openAddRole}
          />

          <EmptyRoleCard
            title="Supporting roles"
            subtitle="Add one or more supporting characters. Their messages normally appear on the left."
            side="Left"
            onAdd={openAddRole}
          />
        </div>

        <div className="mt-5 rounded-[18px] bg-white px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#667085] shadow-sm ring-1 ring-black/5">
          Story ID: {storyId || 'Not found'}
        </div>

        <button
          type="button"
          disabled
          className="mt-5 h-12 w-full rounded-full bg-[#d0d5dd] text-[13px] font-extrabold text-white"
        >
          Next: Create Chat
        </button>
      </main>
    </div>
  )
}

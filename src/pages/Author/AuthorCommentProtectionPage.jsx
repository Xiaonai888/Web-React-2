import { useNavigate } from 'react-router-dom'

function SettingCard({ icon, title, subtitle, status = 'Coming soon' }) {
  return (
    <div className="rounded-[22px] border border-[#eceaf2] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#f5f3fa] text-[#111827]">
          <i className={`${icon} text-[15px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[14.5px] font-extrabold text-[#111827]">{title}</h3>
            <span className="shrink-0 rounded-full bg-[#fff7ed] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.04em] text-[#f97316]">
              {status}
            </span>
          </div>

          <p className="mt-1.5 text-[12.5px] font-medium leading-5 text-[#8d94a1]">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default function AuthorCommentProtectionPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/author/dashboard', { replace: true })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back to Author Dashboard"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Comment Protection</h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-4">
        <section className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex h-13 w-13 items-center justify-center rounded-[20px] bg-[#111827] text-white">
            <i className="fa-solid fa-shield-halved text-[20px]" />
          </div>

          <h2 className="mt-4 text-[22px] font-black text-[#111827]">Author Comment Protection</h2>

          <p className="mt-2 text-[13.5px] font-semibold leading-6 text-[#667085]">
            This area will help authors protect their story comments with their own blocked words, hidden comment review, reader comment restrictions, and auto cleanup.
          </p>

          <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-4">
            <div className="text-[12px] font-black uppercase tracking-[0.04em] text-[#475467]">Responsibility</div>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
              Story comment moderation will belong to authors. Admin Block Words will stay for platform-wide areas like Echo, Post Article, and public content.
            </p>
          </div>
        </section>

        <section className="mt-4 grid gap-3">
          <SettingCard
            icon="fa-solid fa-ban"
            title="Author Blocked Words"
            subtitle="Authors will add blocked words for their own story comments."
          />

          <SettingCard
            icon="fa-regular fa-eye-slash"
            title="Hidden Comments"
            subtitle="Comments hidden by author rules will wait here for review."
          />

          <SettingCard
            icon="fa-solid fa-user-slash"
            title="Blocked Readers"
            subtitle="Authors will block readers from commenting on their own story or author page."
          />

          <SettingCard
            icon="fa-solid fa-broom"
            title="Auto Cleanup"
            subtitle="Hidden comments can be cleaned automatically after a safe review period."
          />

          <SettingCard
            icon="fa-solid fa-clock-rotate-left"
            title="Comment Records"
            subtitle="Author comment moderation actions will be recorded for safety."
          />
        </section>
      </main>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom'

const MAILS = [
  {
    id: 1,
    type: 'Admin Mail',
    tab: 'admin',
    title: 'Welcome to Shadow Era',
    message: 'Thanks for joining Shadow Era. Start reading, collect rewards, and enjoy your story journey.',
    time: 'Today',
    icon: 'fa-solid fa-user-shield',
    unread: true,
  },
  {
    id: 2,
    type: 'Rewards',
    tab: 'rewards',
    title: 'You received a welcome reward',
    message: 'Your welcome reward is ready. Open this mail and claim it before it expires.',
    time: 'Today',
    icon: 'fa-solid fa-gift',
    unread: true,
    action: 'Claim',
  },
  {
    id: 3,
    type: 'System',
    tab: 'system',
    title: 'Payment completed',
    message: 'Your diamonds were added to your wallet successfully.',
    time: 'Yesterday',
    icon: 'fa-solid fa-wallet',
    unread: false,
  },
  {
    id: 4,
    type: 'Admin Mail',
    tab: 'admin',
    title: 'Reading event announcement',
    message: 'A new reading event is coming soon. Check the event page for details and rewards.',
    time: '2 days ago',
    icon: 'fa-solid fa-bullhorn',
    unread: false,
  },
]

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'rewards', label: 'Rewards' },
  { key: 'admin', label: 'Admin Mail' },
  { key: 'system', label: 'System' },
]

function MailCard({ mail }) {
  return (
    <button
      type="button"
      className="flex w-full gap-3 rounded-[20px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99] dark:bg-[#171923] dark:ring-white/10"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff7d8] text-[#d99a00] dark:bg-[#2a2414]">
        <i className={`${mail.icon} text-[15px]`} />
        {mail.unread ? (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white dark:ring-[#171923]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827] dark:text-white">{mail.title}</div>
            <div className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#7b8190] dark:text-white/55">{mail.message}</div>
          </div>
          <span className="shrink-0 text-[10.5px] font-semibold text-[#9aa1ad] dark:text-white/40">{mail.time}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#f5f3fa] px-2.5 py-1 text-[10.5px] font-bold text-[#6b7280] dark:bg-white/10 dark:text-white/55">
            {mail.type}
          </span>
          {mail.action ? (
            <span className="rounded-full bg-[#111827] px-3 py-1 text-[11px] font-extrabold text-white dark:bg-[#f6b800] dark:text-[#111827]">
              {mail.action}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export default function InboxPage() {
  const navigate = useNavigate()
  const activeTab = 'all'
  const filteredMails = activeTab === 'all' ? MAILS : MAILS.filter((mail) => mail.tab === activeTab)

  return (
    <div className="min-h-screen bg-[#f5f3fa] px-4 pb-[110px] pt-4 dark:bg-[#0d0f16]">
      <main className="mx-auto max-w-[680px]">
        <header className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95 dark:bg-[#171923] dark:text-white dark:ring-white/10"
          >
            <i className="fa-solid fa-chevron-left text-[13px]" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-[20px] font-extrabold text-[#111827] dark:text-white">Inbox</h1>
            <p className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">Messages, rewards, and admin mail</p>
          </div>

          <Link
            to="/me"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95 dark:bg-[#171923] dark:text-white dark:ring-white/10"
          >
            <i className="far fa-user text-[14px]" />
          </Link>
        </header>

        <section className="mb-4 overflow-x-auto">
          <div className="flex w-max min-w-full gap-2 rounded-[18px] bg-white p-1.5 shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`rounded-[14px] px-4 py-2 text-[12px] font-extrabold ${
                  tab.key === activeTab
                    ? 'bg-[#111827] text-white dark:bg-[#f6b800] dark:text-[#111827]'
                    : 'text-[#8d94a1] dark:text-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {filteredMails.length ? (
          <section className="space-y-3">
            {filteredMails.map((mail) => (
              <MailCard key={mail.id} mail={mail} />
            ))}
          </section>
        ) : (
          <section className="rounded-[24px] bg-white px-5 py-10 text-center shadow-sm ring-1 ring-black/5 dark:bg-[#171923] dark:ring-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1] dark:bg-white/10 dark:text-white/50">
              <i className="far fa-envelope-open text-[22px]" />
            </div>
            <h2 className="mt-4 text-[16px] font-extrabold text-[#111827] dark:text-white">No mail yet</h2>
            <p className="mx-auto mt-1 max-w-[260px] text-[12px] leading-5 text-[#8d94a1] dark:text-white/50">
              Admin messages, rewards, and important account mail will appear here.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

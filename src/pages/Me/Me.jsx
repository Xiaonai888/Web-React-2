import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function IconButton({ to, icon, label, onClick }) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#202124] shadow-sm transition active:scale-95"
    >
      <i className={`${icon} text-[17px]`} />
    </button>
  )

  if (!to) return content

  return (
    <Link to={to} aria-label={label}>
      {content}
    </Link>
  )
}

function BalanceItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[20px] font-bold tracking-tight text-[#111827]">{value}</div>
      <div className="mt-1 text-[11px] font-medium text-[#8a8f98]">{label}</div>
    </div>
  )
}

function SmallCard({ to, title, subtitle, icon, tone = 'light' }) {
  const toneClass =
    tone === 'premium'
      ? 'bg-gradient-to-br from-[#fff7db] to-[#ffffff] border-[#f1d98a]'
      : 'bg-white border-[#eceef2]'

  return (
    <Link
      to={to}
      className={`rounded-[22px] border ${toneClass} p-4 shadow-sm transition active:scale-[0.99]`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6f7fb] text-[18px]">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[15px] font-bold tracking-tight text-[#111827]">{title}</div>
          <div className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#8a8f98]">{subtitle}</div>
        </div>
      </div>
    </Link>
  )
}

function MenuRow({ to, icon, title, subtitle, danger = false }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-[20px] bg-white px-4 py-4 shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f8fb] text-[17px]">
          {icon}
        </div>

        <div className="min-w-0">
          <div className={`text-[14px] font-bold ${danger ? 'text-[#e5484d]' : 'text-[#111827]'}`}>
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 line-clamp-1 text-[12px] text-[#8a8f98]">{subtitle}</div>
          ) : null}
        </div>
      </div>

      <i className="fas fa-chevron-right text-[12px] text-[#c1c5cc]" />
    </Link>
  )
}

function SettingsSheet({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[320px] md:rounded-[24px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[18px] font-bold text-[#111827]">Settings</div>
            <div className="mt-1 text-[12px] text-[#8a8f98]">Account and app options</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7]"
          >
            <i className="fas fa-times text-[14px] text-[#555]" />
          </button>
        </div>

        <div className="space-y-2">
          <MenuRow to="/profile" icon="👤" title="Edit Profile" subtitle="Name, avatar, bio" />
          <MenuRow to="/settings" icon="⚙️" title="Account Settings" subtitle="Password, privacy, language" />
          <MenuRow to="/settings" icon="🌙" title="Appearance" subtitle="Theme and reading display" />
          <MenuRow to="/settings" icon="🚪" title="Logout" subtitle="Sign out from this device" danger />
        </div>
      </div>
    </div>
  )
}

export default function Me() {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isLoggedIn = false
  const isAuthor = false

  const handleAuthorDashboard = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (!isAuthor) {
      navigate('/author/create-page')
      return
    }

    navigate('/author/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] pb-[104px]">
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <header className="sticky top-0 z-[60] bg-[#f6f7fb]/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
          <IconButton to="/inbox" icon="far fa-envelope" label="Inbox" />
          <IconButton icon="fas fa-cog" label="Settings" onClick={() => setSettingsOpen(true)} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#171923] to-[#3b4157] text-[30px] font-bold text-white"
            >
              {isLoggedIn ? 'S' : <i className="far fa-user text-[28px]" />}
            </Link>

            <div className="min-w-0 flex-1">
              <Link to={isLoggedIn ? '/profile' : '/login'} className="block">
                <h1 className="line-clamp-1 text-[23px] font-bold tracking-tight text-[#111827]">
                  {isLoggedIn ? 'Shadow Reader' : 'Click to Login'}
                </h1>
              </Link>

              <p className="mt-1 line-clamp-1 text-[13px] text-[#8a8f98]">
                {isLoggedIn ? 'Reader' : 'Login to save reading, comments, and author tools'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={isLoggedIn ? '/profile' : '/login'}
                  className="rounded-full bg-[#f4f5f8] px-4 py-2 text-[12px] font-bold text-[#202124]"
                >
                  View Profile
                </Link>

                <button
                  type="button"
                  className="rounded-full bg-[#fff3c4] px-4 py-2 text-[12px] font-bold text-[#7a5200]"
                >
                  Check-in
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white px-4 py-5 shadow-sm">
          <div className="grid grid-cols-3 divide-x divide-[#eef0f4]">
            <BalanceItem value="120" label="Diamond" />
            <BalanceItem value="480" label="Gem" />
            <BalanceItem value="3" label="Voucher" />
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SmallCard
            to="/premium"
            icon="👑"
            title="Premium"
            subtitle="Cleaner reading and exclusive perks"
            tone="premium"
          />

          <SmallCard
            to="/wallet"
            icon="💎"
            title="Wallet"
            subtitle="Diamonds, gems, vouchers, and purchases"
          />
        </section>

        <section className="mt-4">
          <button
            type="button"
            onClick={handleAuthorDashboard}
            className="flex w-full items-center justify-between rounded-[24px] bg-[#111827] px-4 py-4 text-left shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[18px] text-white">
                ✍️
              </div>

              <div className="min-w-0">
                <div className="text-[15px] font-bold text-white">Author Dashboard</div>
                <div className="mt-1 line-clamp-1 text-[12px] text-white/60">
                  Manage stories, episodes, and your author page
                </div>
              </div>
            </div>

            <i className="fas fa-chevron-right text-[12px] text-white/45" />
          </button>
        </section>

        <section className="mt-5 space-y-3">
          <MenuRow to="/inbox" icon="✉️" title="Inbox" subtitle="Messages and notifications" />
          <MenuRow to="/comments" icon="💬" title="My Comments" subtitle="Replies and comment activity" />
          <MenuRow to="/feedback" icon="📝" title="Feedback" subtitle="Report issues or suggest improvements" />
          <MenuRow to="/help" icon="🛟" title="Help Center" subtitle="Support and common questions" />
          <MenuRow to="/about" icon="ℹ️" title="About Us" subtitle="About Shadowera and policies" />
        </section>

        {isLoggedIn ? (
          <section className="mt-5">
            <MenuRow to="/logout" icon="🚪" title="Logout" subtitle="Sign out from this device" danger />
          </section>
        ) : null}
      </main>

      <button
        type="button"
        onClick={handleAuthorDashboard}
        aria-label="Author Dashboard shortcut"
        className="fixed bottom-[92px] right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#ffbe00] text-[22px] text-[#111827] shadow-[0_12px_30px_rgba(255,190,0,.35)] transition active:scale-95"
      >
        <i className="fas fa-pen-nib" />
      </button>
    </div>
  )
}

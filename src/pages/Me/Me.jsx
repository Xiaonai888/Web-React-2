import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function TopIconButton({ icon, label, to, onClick }) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/15 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )

  if (!to) return button

  return (
    <Link to={to} aria-label={label}>
      {button}
    </Link>
  )
}

function SplitAction({ icon, title, subtitle, to, onClick }) {
  const content = (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f6f4fb] text-[#111827]">
        <i className={`${icon} text-[16px]`} />
      </div>

      <div className="min-w-0">
        <div className="line-clamp-1 text-[14px] font-bold text-[#111827]">{title}</div>
        <div className="mt-1 line-clamp-1 text-[12px] text-[#8a8f98]">{subtitle}</div>
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="min-w-0 flex-1 px-4 py-4 transition active:scale-[0.99]">
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-0 flex-1 px-4 py-4 text-left transition active:scale-[0.99]"
    >
      {content}
    </button>
  )
}

function MenuRow({ icon, title, subtitle, to, onClick, danger = false }) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f6f4fb] text-[#111827]">
          <i className={`${icon} text-[15px]`} />
        </div>

        <div className="min-w-0">
          <div className={`line-clamp-1 text-[14px] font-bold ${danger ? 'text-[#e5484d]' : 'text-[#111827]'}`}>
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 line-clamp-1 text-[12px] text-[#8a8f98]">{subtitle}</div>
          ) : null}
        </div>
      </div>

      <i className="fas fa-chevron-right shrink-0 text-[12px] text-[#c4c7cf]" />
    </>
  )

  const className = "flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition active:scale-[0.99]"

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}

function SectionCard({ title, children }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#eceaf2] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      {title ? (
        <div className="border-b border-[#f0eef6] px-4 py-3">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#8a8f98]">{title}</div>
        </div>
      ) : null}

      <div className="divide-y divide-[#f0eef6]">{children}</div>
    </section>
  )
}

function SettingsSheet({ open, onClose, isLoggedIn }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[330px] md:rounded-[24px] md:pb-4">
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

        <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white">
          <div className="divide-y divide-[#f0eef6]">
            <MenuRow to={isLoggedIn ? '/profile' : '/login'} icon="far fa-user" title="Edit Profile" subtitle="Name, avatar, bio" />
            <MenuRow to="/settings" icon="fas fa-shield-alt" title="Account Settings" subtitle="Password, privacy, security" />
            <MenuRow to="/settings" icon="far fa-moon" title="Appearance" subtitle="Theme and reading display" />
            {isLoggedIn ? (
              <MenuRow to="/logout" icon="fas fa-sign-out-alt" title="Logout" subtitle="Sign out from this device" danger />
            ) : null}
          </div>
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
  const isPremium = false

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
    <div className="min-h-screen bg-[#f5f3fa] pb-[104px]">
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isLoggedIn={isLoggedIn}
      />

      <main className="mx-auto max-w-5xl px-4 pt-4 md:pt-6">
        <section className="overflow-hidden rounded-[28px] bg-[#111827] text-white shadow-[0_18px_44px_rgba(17,24,39,0.20)]">
          <div className="relative bg-[radial-gradient(circle_at_15%_0%,rgba(124,58,237,0.34),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(246,184,0,0.20),transparent_28%)] p-5 md:p-6">
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <TopIconButton to="/inbox" icon="far fa-envelope" label="Inbox" />
              <TopIconButton icon="fas fa-cog" label="Settings" onClick={() => setSettingsOpen(true)} />
            </div>

            <div className="flex items-center gap-4 pr-[92px]">
              <Link
                to={isLoggedIn ? '/profile' : '/login'}
                className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-white/10 text-[30px] font-bold text-white ring-1 ring-white/10"
              >
                {isLoggedIn ? 'S' : <i className="far fa-user text-[28px]" />}
              </Link>

              <div className="min-w-0 flex-1">
                <Link to={isLoggedIn ? '/profile' : '/login'} className="block">
                  <h1 className="line-clamp-1 text-[24px] font-extrabold tracking-tight text-white md:text-[28px]">
                    {isLoggedIn ? 'Shadow Reader' : 'Click to Login'}
                  </h1>
                </Link>

                <p className="mt-1 line-clamp-1 text-[13px] font-medium text-white/58">
                  {isLoggedIn
                    ? isPremium
                      ? 'Premium Reader'
                      : isAuthor
                      ? 'Author'
                      : 'Reader'
                    : 'Login to save reading, comments, and author tools'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={isLoggedIn ? '/profile' : '/login'}
                    className="rounded-full bg-white/10 px-4 py-2 text-[12px] font-extrabold text-white transition hover:bg-white/15"
                  >
                    View Profile
                  </Link>

                  <button
                    type="button"
                    className="rounded-full bg-[#f6b800] px-4 py-2 text-[12px] font-extrabold text-[#16110a] transition active:scale-95"
                  >
                    Check-in
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] font-semibold text-white/55">My Diamonds</div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-[28px] font-extrabold leading-none text-white">120</span>
                    <span className="pb-1 text-[12px] font-semibold text-white/50">Diamond</span>
                  </div>
                </div>

                <Link
                  to="/wallet"
                  className="rounded-full bg-[#f6b800] px-5 py-3 text-[13px] font-extrabold text-[#16110a] shadow-[0_10px_22px_rgba(246,184,0,0.22)]"
                >
                  Top Up
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#eceaf2] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
          <div className="grid grid-cols-2 divide-x divide-[#f0eef6]">
            <SplitAction
              to="/wallet"
              icon="fas fa-wallet"
              title="Wallet"
              subtitle="Gems, vouchers, purchases"
            />
            <SplitAction
              to="/check-in"
              icon="far fa-calendar-check"
              title="Check-in"
              subtitle="Daily rewards"
            />
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] bg-[#1a1b2e] shadow-[0_10px_28px_rgba(17,24,39,0.12)]">
          <Link to="/premium" className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f6b800]">
                <i className="fas fa-crown text-[16px]" />
              </div>

              <div className="min-w-0">
                <div className="text-[15px] font-extrabold text-white">Premium</div>
                <div className="mt-1 line-clamp-1 text-[12px] text-white/55">
                  Ad-free reading and exclusive stories
                </div>
              </div>
            </div>

            <span className="rounded-full bg-[#f6b800] px-4 py-2 text-[12px] font-extrabold text-[#16110a]">
              Go
            </span>
          </Link>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#eceaf2] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
          <button
            type="button"
            onClick={handleAuthorDashboard}
            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4cc] text-[#111827]">
                <i className="fas fa-pen-nib text-[16px]" />
              </div>

              <div className="min-w-0">
                <div className="text-[15px] font-extrabold text-[#111827]">Author Dashboard</div>
                <div className="mt-1 line-clamp-1 text-[12px] text-[#8a8f98]">
                  Manage stories, episodes, and your author page
                </div>
              </div>
            </div>

            <i className="fas fa-chevron-right shrink-0 text-[12px] text-[#c4c7cf]" />
          </button>
        </section>

        <div className="mt-4 space-y-4">
          <SectionCard title="Account">
            <MenuRow to="/inbox" icon="far fa-envelope" title="Inbox" subtitle="Messages and notifications" />
            <MenuRow to="/comments" icon="far fa-comment-dots" title="My Comments" subtitle="Replies and comment activity" />
            <MenuRow to="/feedback" icon="far fa-pen-to-square" title="Feedback" subtitle="Report issues or suggest improvements" />
            <MenuRow to="/help" icon="far fa-circle-question" title="Help Center" subtitle="Support and common questions" />
            <MenuRow to="/about" icon="fas fa-circle-info" title="About Us" subtitle="About Shadowera and policies" />
          </SectionCard>

          {isLoggedIn ? (
            <SectionCard>
              <MenuRow to="/logout" icon="fas fa-sign-out-alt" title="Logout" subtitle="Sign out from this device" danger />
            </SectionCard>
          ) : null}
        </div>
      </main>

      <button
        type="button"
        onClick={handleAuthorDashboard}
        aria-label="Author Dashboard shortcut"
        className="fixed bottom-[92px] right-5 z-[70] flex h-13 w-13 items-center justify-center rounded-full bg-[#f6b800] text-[19px] text-[#111827] shadow-[0_14px_32px_rgba(246,184,0,0.34)] transition active:scale-95 md:h-14 md:w-14"
      >
        <i className="fas fa-pen-nib" />
      </button>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const iconBox = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3fa] text-[#111827]'

function HeaderIcon({ icon, label, to, onClick }) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1f2430] shadow-sm ring-1 ring-black/5 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )

  return to ? <Link to={to}>{content}</Link> : content
}

function BalanceItem({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-[15px] font-extrabold text-[#111827]">{value}</div>
      <div className="mt-1 text-[10.5px] font-semibold text-[#8d94a1]">{label}</div>
    </div>
  )
}

function QuickAction({ icon, title, subtitle, to, onClick }) {
  const body = (
    <div className="flex min-w-0 items-center gap-3">
      <div className={iconBox}>
        <i className={`${icon} text-[14px]`} />
      </div>
      <div className="min-w-0">
        <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827]">{title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">{subtitle}</div>
      </div>
    </div>
  )

  const className = 'min-w-0 flex-1 px-3.5 py-3.5 text-left active:scale-[0.99]'

  return to ? (
    <Link to={to} className={className}>{body}</Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>{body}</button>
  )
}

function MenuRow({ icon, title, subtitle, to, onClick, danger = false, dark = false }) {
  const body = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={
            dark
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f6b800]'
              : iconBox
          }
        >
          <i className={`${icon} text-[14px]`} />
        </div>
        <div className="min-w-0">
          <div
            className={`line-clamp-1 text-[13.5px] font-extrabold ${
              dark ? 'text-white' : danger ? 'text-[#e5484d]' : 'text-[#111827]'
            }`}
          >
            {title}
          </div>
          {subtitle ? (
            <div className={`mt-0.5 line-clamp-1 text-[11.5px] ${dark ? 'text-white/55' : 'text-[#8d94a1]'}`}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <i className={`fas fa-chevron-right text-[11px] ${dark ? 'text-white/45' : 'text-[#c6c9d1]'}`} />
    </>
  )

  const className = `flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99] ${
    dark ? 'bg-[#171923]' : ''
  }`

  return to ? <Link to={to} className={className}>{body}</Link> : <button type="button" onClick={onClick} className={className}>{body}</button>
}

function SettingsSheet({ open, onClose, isLoggedIn }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="Close settings" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-[74px] left-0 right-0 max-h-[72vh] overflow-hidden rounded-t-[26px] bg-white px-4 pb-5 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[320px] md:rounded-[22px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827]">Settings</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1]">Account and app options</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7]">
            <i className="fas fa-times text-[13px] text-[#555]" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto pb-2">
          <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white">
            <div className="divide-y divide-[#f0eef6]">
              <MenuRow to={isLoggedIn ? '/profile' : '/login'} icon="far fa-user" title="Edit Profile" subtitle="Name, avatar, bio" />
              <MenuRow to="/settings" icon="fas fa-shield-alt" title="Account Settings" subtitle="Password, privacy, security" />
              <MenuRow to="/settings" icon="far fa-moon" title="Appearance" subtitle="Theme and reading display" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose()
              window.location.href = isLoggedIn ? '/logout' : '/login'
            }}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-[18px] px-4 py-3.5 text-[13px] font-extrabold shadow-sm ${
              isLoggedIn ? 'bg-[#fff1f1] text-[#e5484d]' : 'bg-[#171923] text-white'
            }`}
          >
            <i className={`fas ${isLoggedIn ? 'fa-sign-out-alt' : 'fa-sign-in-alt'} text-[13px]`} />
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Me() {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const storedUser = JSON.parse(localStorage.getItem('shadow_reader_user') || 'null')

const isLoggedIn = Boolean(storedUser)
const isAuthor = Boolean(storedUser?.is_author)
const isPremium = false

const displayName = storedUser?.name || 'Click to Login'
const avatarLetter = storedUser?.name?.charAt(0)?.toUpperCase() || 'S'

  const handleAuthorDashboard = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (!isAuthor) {
      navigate('/author/create')
      return
    }

    navigate('/author/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-5xl px-4 pt-4">
    <section className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
  <div className="flex justify-end gap-2">
    <HeaderIcon to="/inbox" icon="far fa-envelope" label="Inbox" />
    <HeaderIcon icon="fas fa-cog" label="Settings" onClick={() => setSettingsOpen(true)} />
  </div>

  <div className="mt-3 flex items-start gap-4">
    <Link
      to={isLoggedIn ? '/profile' : '/login'}
      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#202638] text-white"
    >
      {isLoggedIn ? (
        <span className="text-[26px] font-extrabold">{avatarLetter}</span>
      ) : (
        <i className="far fa-user text-[26px]" />
      )}
    </Link>

    <div className="min-w-0 flex-1 pt-1.5">
      <Link to={isLoggedIn ? '/profile' : '/login'} className="block">
        <h1 className="line-clamp-1 text-[21px] font-extrabold tracking-tight text-[#111827]">
          {isLoggedIn ? (
            <>
              {displayName}
              {isPremium ? (
                <span className="ml-2 inline-flex translate-y-[-1px] items-center justify-center text-[#f6b800]">
                  <i className="fas fa-crown text-[15px]" />
                </span>
              ) : null}
            </>
          ) : (
            'Click to Login'
          )}
        </h1>
      </Link>

      {!isLoggedIn ? (
        <p className="mt-1 line-clamp-1 text-[12px] text-[#8d94a1]">
          Login to save reading and author tools
        </p>
      ) : (
        <Link
          to="/profile"
          className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#8d94a1]"
        >
          <span>View Profile</span>
          <i className="fas fa-chevron-right text-[9px]" />
        </Link>
      )}
    </div>
  </div>

  <div className="mt-4 grid grid-cols-3 divide-x divide-[#eef0f4] rounded-[18px] bg-[#fafafe] px-2 py-3">
    <BalanceItem value="120" label="Diamond" />
    <BalanceItem value="480" label="Gem" />
    <BalanceItem value="3" label="Voucher" />
  </div>
</section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-[#f0eef6]">
            <QuickAction to="/wallet" icon="fas fa-wallet" title="Wallet" subtitle="Balance & purchases" />
            <QuickAction to="/check-in" icon="far fa-calendar-check" title="Check-in" subtitle="Daily rewards" />
          </div>
        </section>

        <section className="mt-3 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
          <button type="button" onClick={handleAuthorDashboard} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff4cc] text-[#111827]">
                <i className="fas fa-pen-nib text-[14px]" />
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827]">Author Dashboard</div>
                <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1]">Manage stories, episodes, and your author page</div>
              </div>
            </div>
            <i className="fas fa-chevron-right shrink-0 text-[11px] text-[#c6c9d1]" />
          </button>
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
          <div className="divide-y divide-[#f0eef6]">
            <MenuRow to="/premium" icon="fas fa-crown" title="Premium" subtitle="Ad-free reading and exclusive stories" dark />
            <MenuRow to="/inbox" icon="far fa-envelope" title="Inbox" subtitle="Messages and notifications" />
            <MenuRow to="/comments" icon="far fa-comment-dots" title="My Comments" subtitle="Replies and comment activity" />
            <MenuRow to="/feedback" icon="far fa-pen-to-square" title="Feedback" subtitle="Report issues or suggestions" />
            <MenuRow to="/help" icon="far fa-circle-question" title="Help Center" subtitle="Support and common questions" />
            <MenuRow to="/about" icon="fas fa-circle-info" title="About Us" subtitle="About Shadowera and policies" />
          </div>
        </section>

        {isLoggedIn ? (
          <section className="mt-4 overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
            <MenuRow to="/logout" icon="fas fa-sign-out-alt" title="Logout" subtitle="Sign out from this device" danger />
          </section>
        ) : null}
      </main>

      <button
        type="button"
        onClick={handleAuthorDashboard}
        aria-label="Author Dashboard shortcut"
        className="fixed bottom-[92px] right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[#f6b800] text-[17px] text-[#111827] shadow-[0_14px_30px_rgba(246,184,0,0.34)] active:scale-95"
      >
        <i className="fas fa-pen-nib" />
      </button>
    </div>
  )
}

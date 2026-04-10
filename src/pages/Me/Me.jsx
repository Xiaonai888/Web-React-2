import { Link } from 'react-router-dom'
import PremiumBannerSection from '../../components/me/PremiumBannerSection'
import SettingsSection from '../../components/me/SettingsSection'

function CurrencyCard({ icon, label, value, colorClass = 'text-[#111]' }) {
  return (
    <div className="rounded-2xl border border-[#efefef] bg-white px-4 py-3 text-center shadow-sm">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f7f8]">
        <span className="text-[18px]">{icon}</span>
      </div>
      <p className={`text-[16px] font-extrabold tracking-tight ${colorClass}`}>{value}</p>
      <p className="mt-1 text-[11px] font-medium text-[#8b8b95]">{label}</p>
    </div>
  )
}

function QuickActionCard({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-[#efefef] bg-white p-4 shadow-sm transition hover:bg-[#fafafa]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7f7f8]">
          <span className="text-[18px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-[14px] font-extrabold tracking-tight text-[#111]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#8b8b95]">{subtitle}</p>
        </div>
      </div>
    </Link>
  )
}

function MenuRow({ to, icon, title, subtitle, danger = false }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-2xl border border-[#efefef] bg-white px-4 py-4 shadow-sm transition hover:bg-[#fafafa]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f7f8]">
          <span className="text-[17px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className={`line-clamp-1 text-[13px] font-extrabold tracking-tight ${danger ? 'text-[#e5484d]' : 'text-[#111]'}`}>
            {title}
          </h3>
          {subtitle ? <p className="mt-0.5 line-clamp-1 text-[11px] text-[#8b8b95]">{subtitle}</p> : null}
        </div>
      </div>
      <i className="fas fa-chevron-right shrink-0 text-[12px] text-[#b6b6bf]" />
    </Link>
  )
}

export default function Me() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-[96px]">
      <header className="sticky top-0 z-[60] border-b border-[#f2f2f4] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-black tracking-tight text-[#111]">Me</h1>
            <Link
              to="/settings"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5"
              aria-label="Open settings"
            >
              <i className="fas fa-cog text-[18px]" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-5 sm:px-5 lg:px-6">
        <section className="rounded-[28px] border border-[#efefef] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-4">
            <Link
              to="/profile"
              className="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-[#10131a] to-[#2d3140] text-[26px] font-black text-white shadow-sm"
            >
              S
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to="/profile" className="block">
                    <h2 className="line-clamp-1 text-[18px] font-black tracking-tight text-[#111]">
                      Shadow Reader
                    </h2>
                  </Link>
                  <p className="mt-1 line-clamp-1 text-[12px] font-medium text-[#8b8b95]">
                    @shadowreader · Reader ID 000021
                  </p>
                </div>

                <div className="shrink-0 rounded-full bg-[#f7f7f8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6c7280]">
                  <i className="far fa-calendar-alt mr-1.5" />
                  Joined 2026
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#222]"
                >
                  View Profile
                  <i className="fas fa-arrow-right text-[11px]" />
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-4 py-2 text-[12px] font-bold text-[#111] transition hover:bg-[#ededf0]"
                >
                  Timeline
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="grid grid-cols-3 gap-3">
            <CurrencyCard icon="💎" label="Diamond" value="120" colorClass="text-[#2554ff]" />
            <CurrencyCard icon="🟢" label="Gem" value="480" colorClass="text-[#159947]" />
            <CurrencyCard icon="🎟️" label="Voucher" value="3" colorClass="text-[#8b5cf6]" />
          </div>
        </section>

        <section className="mt-5">
          <PremiumBannerSection />
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111]">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickActionCard to="/wallet" icon="👛" title="My Wallet" subtitle="Check your purchases, balance, and premium history." />
            <QuickActionCard to="/library" icon="📚" title="Library" subtitle="Open your saved stories, subscriptions, and downloads." />
            <QuickActionCard to="/tasks" icon="✅" title="Task Center" subtitle="Complete tasks to earn free Gem and special rewards." />
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111]">Creator & Account</h2>
          </div>
          <div className="space-y-3">
            <MenuRow to="/page" icon="🪪" title="View My Page" subtitle="Open your public author page or creator identity." />
            <MenuRow to="/settings" icon="🔄" title="Switch Page" subtitle="Manage and switch between your available pages." />
            <MenuRow to="/settings" icon="📝" title="Author Dashboard" subtitle="Go to your creator tools and manage published content." />
          </div>
        </section>

        <section className="mt-7">
          <SettingsSection />
        </section>

        <section className="mt-7 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-tight text-[#111]">Support</h2>
          </div>
          <div className="space-y-3">
            <MenuRow to="/settings" icon="💬" title="Help & Feedback" subtitle="Report a problem or contact support when you need help." />
            <MenuRow to="/settings" icon="🌙" title="About Shadow" subtitle="Version, policies, and app information." />
            <MenuRow to="/settings" icon="🚪" title="Log Out" subtitle="Sign out of your account on this device." danger />
          </div>
        </section>
      </main>
    </div>
  )
}

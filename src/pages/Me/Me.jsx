import { Link } from 'react-router-dom'
import PremiumBannerSection from '../../components/me/PremiumBannerSection'

function PlainStat({ icon, value, label, valueClass = 'text-[#111]' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-2 text-[20px]">{icon}</div>
      <p className={`text-[24px] font-semibold tracking-tight ${valueClass}`}>{value}</p>
      <p className="mt-1 text-[12px] font-medium text-[#8e8e98]">{label}</p>
    </div>
  )
}

function MiniTopAction({ to, icon, title }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full bg-[#f4f4f6] px-3 py-2 text-[12px] font-medium text-[#222] transition hover:bg-[#ececef]"
    >
      <span className="text-[13px]">{icon}</span>
      <span>{title}</span>
    </Link>
  )
}

function ActionCard({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="group rounded-[24px] border border-[#ededf0] bg-white px-4 py-4 shadow-sm transition hover:bg-[#fafafa]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6f6f8]">
            <span className="text-[18px]">{icon}</span>
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight text-[#111]">
              {title}
            </h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#8b8b95]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SupportRow({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-4 rounded-[24px] border border-[#ededf0] bg-white px-4 py-4 shadow-sm transition hover:bg-[#fafafa]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6f6f8]">
          <span className="text-[18px]">{icon}</span>
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight text-[#111]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#8b8b95]">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function Me() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-[96px]">
      <header className="sticky top-0 z-[60] border-b border-[#f2f2f4] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-semibold tracking-tight text-[#111]">Me</h1>

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

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-5 lg:px-6">
        {/* Profile area - no big card shape */}
        <section>
          <div className="flex items-start gap-4">
            <Link
              to="/profile"
              className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#151826] to-[#2f3447] text-[30px] font-semibold text-white shadow-sm"
            >
              S
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to="/profile" className="block">
                    <h2 className="line-clamp-1 text-[28px] font-semibold tracking-tight text-[#111]">
                      Shadow Reader
                    </h2>
                  </Link>

                  <p className="mt-1 line-clamp-1 text-[13px] text-[#8b8b95]">
                    Reader ID 000021
                  </p>
                </div>

                <Link
                  to="/settings"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f4f4f6] px-3 py-2 text-[12px] font-medium text-[#4a4a54] transition hover:bg-[#ececef]"
                >
                  <i className="far fa-calendar-check text-[13px]" />
                  <span>Check In</span>
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <MiniTopAction to="/page" icon="🪪" title="My Page" />
                <MiniTopAction to="/settings" icon="🔄" title="Switch Page" />
              </div>
            </div>
          </div>
        </section>

        {/* Plain currency row - no shape cards */}
        <section className="mt-7 border-t border-b border-[#f0f0f2] py-5">
          <div className="grid grid-cols-3 gap-3">
            <PlainStat icon="💎" value="120" label="Diamond" valueClass="text-[#2f5bff]" />
            <PlainStat icon="🟣" value="480" label="Gem" valueClass="text-[#8b5cf6]" />
            <PlainStat icon="🎟️" value="3" label="Voucher" valueClass="text-[#f59e0b]" />
          </div>
        </section>

        {/* Premium */}
        <section className="mt-6">
          <PremiumBannerSection />
        </section>

        {/* Wallet + Dashboard together */}
        <section className="mt-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ActionCard
              to="/settings"
              icon="👛"
              title="My Wallet"
              subtitle="Check balance, purchases, and voucher details."
            />
            <ActionCard
              to="/settings"
              icon="📝"
              title="Author Dashboard"
              subtitle="Manage content, publishing, and creator tools."
            />
          </div>
        </section>

        {/* Support */}
        <section className="mt-10 pb-4">
          <div className="mb-4">
            <h2 className="text-[18px] font-semibold tracking-tight text-[#111]">Support</h2>
          </div>

          <div className="space-y-3">
            <SupportRow
              to="/settings"
              icon="💬"
              title="Help & Feedback"
              subtitle="Report a problem or contact support when you need help."
            />
            <SupportRow
              to="/settings"
              icon="ℹ️"
              title="About Us"
              subtitle="Learn more about Shadow, policies, and app information."
            />
          </div>
        </section>
      </main>
    </div>
  )
}

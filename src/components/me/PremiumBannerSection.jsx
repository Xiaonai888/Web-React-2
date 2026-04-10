import { Link } from 'react-router-dom'

export default function PremiumBannerSection() {
  return (
    <Link
      to="/premium"
      className="group block overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#151515_0%,#332915_55%,#6e572a_100%)] px-5 py-6 text-white shadow-sm transition hover:opacity-95"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f5d98f]">
            Premium Reader
          </p>

          <h2 className="mt-3 max-w-[270px] text-[24px] font-semibold leading-tight tracking-tight sm:max-w-[420px]">
            Unlock more stories
          </h2>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-medium text-[#171717]">
            View Plans
            <i className="fas fa-arrow-right text-[11px]" />
          </div>
        </div>

        <div className="hidden shrink-0 sm:flex">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/10 text-[28px]">
            👑
          </div>
        </div>
      </div>
    </Link>
  )
}

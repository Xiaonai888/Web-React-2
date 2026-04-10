import { Link } from 'react-router-dom'

export default function PremiumBannerSection() {
  return (
    <Link
      to="/premium"
      className="group block overflow-hidden rounded-[28px] border border-[#f0e8cf] bg-[linear-gradient(135deg,#171717_0%,#2b2720_42%,#6b5832_100%)] p-5 text-white shadow-sm transition hover:opacity-95"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ffe8a3]">
            Premium Reader
          </div>
          <h2 className="mt-3 text-[20px] font-black tracking-tight sm:text-[22px]">
            Unlock more stories and premium perks
          </h2>
          <p className="mt-2 max-w-[540px] text-[12px] leading-6 text-white/80 sm:text-[13px]">
            Enjoy extra access, smoother reading, and special benefits designed for your best Shadow experience.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#171717]">
            View Plans
            <i className="fas fa-arrow-right text-[11px]" />
          </div>
        </div>

        <div className="hidden shrink-0 sm:flex">
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white/10 text-[32px] shadow-inner">
            👑
          </div>
        </div>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'

export default function PremiumBannerSection() {
  return (
    <Link
      to="/premium"
      className="group relative block overflow-hidden rounded-[32px] border border-[#d7b46a] bg-[linear-gradient(135deg,#111111_0%,#1c1710_38%,#3d2d12_72%,#7b5a19_100%)] px-6 py-7 shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
      aria-label="Open premium page"
    >
      {/* outer gold glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-[#f2d48b]/20" />

      {/* premium gold edge light */}
      <div className="pointer-events-none absolute inset-[1px] rounded-[31px] border border-[#f1d78f]/10" />

      {/* warm glow blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f6d37a]/18 blur-3xl transition duration-500 group-hover:bg-[#f6d37a]/28" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-[#f6d37a]/8 blur-2xl transition duration-500 group-hover:bg-[#f6d37a]/14" />

      {/* top gold line */}
      <div className="pointer-events-none absolute left-5 right-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f4da96] to-transparent opacity-80" />

      {/* bottom gold line */}
      <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-[#cfa24a] to-transparent opacity-70" />

      <div className="relative">
        <p className="text-[28px] font-semibold uppercase tracking-[0.18em] text-[#f3d88f] drop-shadow-sm sm:text-[30px]">
          Premium Reader
        </p>

        <p className="mt-3 text-[13px] font-medium text-[#f8efda]/88 sm:text-[14px]">
          Unlock more stories and premium perks
        </p>
      </div>

      {/* hover shine */}
      <div className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
    </Link>
  )
}

import { Link } from 'react-router-dom'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <header className="sticky top-0 z-[60] border-b border-[#f2f2f4] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <Link to="/me" className="flex h-10 w-10 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5" aria-label="Back to Me">
              <i className="fas fa-chevron-left text-[14px]" />
            </Link>
            <h1 className="text-[20px] font-black tracking-tight text-[#111]">Settings</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-5 lg:px-6">
        <div className="mx-auto max-w-xl rounded-[32px] border border-[#efefef] bg-white px-6 py-12 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f7f8] text-[34px]">⚙️</div>
          <h2 className="mt-5 text-[28px] font-black tracking-tight text-[#111]">Coming Soon</h2>
          <p className="mt-3 text-[14px] leading-7 text-[#8b8b95]">
            This page is connected and ready. You can continue building it later without breaking the Me page flow.
          </p>
          <div className="mt-6">
            <Link to="/me" className="inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-3 text-[13px] font-bold text-white transition hover:bg-[#222]">
              Back to Me
              <i className="fas fa-arrow-right text-[11px]" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

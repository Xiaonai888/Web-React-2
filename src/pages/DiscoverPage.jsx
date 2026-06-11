import { Link } from 'react-router-dom'

const storyItems = [
  { name: 'Luna Hart', status: 'New', avatar: 'LH', ring: true },
  { name: 'Mika Rose', status: 'Update', avatar: 'MR', ring: true },
  { name: 'Nora Vale', status: 'Hot', avatar: 'NV', ring: true },
  { name: 'Ari Moon', status: 'Book', avatar: 'AM', ring: false },
  { name: 'Sky Novel', status: 'Ads', avatar: 'SN', ring: false },
]

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-white pb-[100px]">
      <header className="fixed left-0 right-0 top-0 z-[100000] bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex h-9 w-[92px] items-center overflow-visible">
            <img
              src="/assets/Icons/Logo Shadow 2.svg"
              alt="Shadow"
              className="h-full w-full object-contain object-left"
              loading="eager"
              decoding="async"
            />
          </Link>

          <div className="flex items-center space-x-5 text-xl text-gray-400">
            <Link
              to="/genres"
              className="flex h-6 w-6 items-center justify-center transition-transform active:scale-95"
              aria-label="Genres"
            >
              <img
                src="/assets/Icons/Genre.svg?v=2"
                alt="Genres"
                className="h-5 w-5 object-contain"
              />
            </Link>

            <Link
              to="/search"
              className="flex h-6 w-6 items-center justify-center transition-colors hover:text-[#111827]"
              aria-label="Search"
            >
              <i className="fas fa-search" />
            </Link>

            <Link
              to="/notifications"
              className="flex h-6 w-6 items-center justify-center transition-colors hover:text-[#111827]"
              aria-label="Notifications"
            >
              <i className="fas fa-bell" />
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-[72px]">
        <section className="border-b border-gray-100 bg-white py-4">
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-4">
            {storyItems.map((item) => (
              <button key={item.name} type="button" className="w-[72px] shrink-0 text-center">
                <div
                  className={`mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full p-[3px] ${
                    item.ring ? 'bg-gradient-to-br from-[#f6b800] via-[#ff5a7a] to-[#7c3aed]' : 'bg-gray-200'
                  }`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-[15px] font-black text-white">
                    {item.avatar}
                  </div>
                </div>
                <div className="mt-2 truncate text-[11px] font-extrabold text-[#111827]">{item.name}</div>
                <div className="truncate text-[10px] font-bold text-gray-400">{item.status}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-5">
          <div className="rounded-[24px] bg-[#f8fafc] p-5 text-center ring-1 ring-gray-100">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm">
              <i className="fa-solid fa-compass text-xl" />
            </div>
            <h1 className="text-[20px] font-extrabold text-[#111827]">Discover</h1>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-gray-500">
              Feed demo will be added under story row next.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

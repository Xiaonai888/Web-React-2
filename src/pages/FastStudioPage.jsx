import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Link2,
  LockKeyhole,
  Play,
  Plus,
  Search,
  Upload,
  Video,
} from 'lucide-react'

const SAMPLE_VIDEOS = [
  {
    id: 1,
    title: 'I Don’t Wait by the Door Anymore',
    thumbnail:
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=900&q=86',
    access: 'Free',
    views: '1.2K',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Mastering Landscape Photography',
    thumbnail:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=86',
    access: '$1.99',
    views: '5.3K',
    status: 'Published',
  },
]

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[20px] border border-[#ece8f5] bg-white p-4 shadow-[0_12px_28px_rgba(77,51,125,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-[#928b9f]">{label}</p>
          <p className="mt-1 text-[22px] font-black tracking-[-0.03em] text-[#171329]">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#f0eaff] text-[#7041de]">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default function FastStudioPage() {
  const navigate = useNavigate()
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [access, setAccess] = useState('free')
  const [price, setPrice] = useState('1.99')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  const filteredVideos = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return SAMPLE_VIDEOS
    return SAMPLE_VIDEOS.filter((video) => video.title.toLowerCase().includes(normalized))
  }, [query])

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('')

    if (!link.trim() || !title.trim()) {
      setMessage('Video link and title are required.')
      return
    }

    if (access === 'premium' && (!price || Number(price) <= 0)) {
      setMessage('Enter a valid price.')
      return
    }

    setMessage('Video draft is ready. Backend publishing will be connected next.')
  }

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-10 text-[#171329]">
      <header className="sticky top-0 z-50 border-b border-[#ece8f5] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1040px] items-center gap-3 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/fast')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e1ef] bg-white text-[#302943] transition hover:bg-[#f8f5ff] active:scale-95"
            aria-label="Back to Fast"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-black tracking-[-0.03em] text-[#171329]">
              Fast Studio
            </h1>
            <p className="text-[11px] font-medium text-[#918a9e]">
              Create and manage linked videos
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/fast')}
            className="flex h-10 items-center gap-2 rounded-full bg-[#7443e5] px-4 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(116,67,229,0.23)] transition hover:bg-[#6538d2] active:scale-95"
          >
            <Eye size={16} />
            View Fast
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1040px] px-3 py-5 sm:px-5">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Published videos" value="2" icon={Video} />
          <StatCard label="Total views" value="6.5K" icon={Eye} />
          <StatCard label="Premium videos" value="1" icon={LockKeyhole} />
          <StatCard label="Video earnings" value="$24.80" icon={CircleDollarSign} />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#171329]">
                  Create video
                </h2>
                <p className="mt-1 text-[12px] leading-5 text-[#918a9e]">
                  Add a YouTube or external video link.
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#f0eaff] text-[#7041de]">
                <Plus size={20} />
              </span>
            </div>

            <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
              Video link
            </label>
            <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-3 transition focus-within:border-[#7b48e7] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(123,72,231,0.09)]">
              <Link2 size={17} className="shrink-0 text-[#7d6e98]" />
              <input
                type="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="Paste YouTube or video URL"
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] text-[#171329] outline-none placeholder:text-[#aaa3b4]"
              />
            </div>

            <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
              Video title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter video title"
              className="mb-4 h-12 w-full rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 text-[13px] text-[#171329] outline-none transition placeholder:text-[#aaa3b4] focus:border-[#7b48e7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,72,231,0.09)]"
            />

            <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write a short description"
              rows={4}
              className="mb-4 w-full resize-none rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 py-3 text-[13px] leading-5 text-[#171329] outline-none transition placeholder:text-[#aaa3b4] focus:border-[#7b48e7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,72,231,0.09)]"
            />

            <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
              Access
            </label>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccess('free')}
                className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                  access === 'free'
                    ? 'border-[#7443e5] bg-[#f3edff] shadow-[0_0_0_3px_rgba(116,67,229,0.08)]'
                    : 'border-[#e4dfea] bg-white hover:bg-[#faf8fd]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Play size={17} className="text-[#7041de]" />
                  <span className="text-[13px] font-extrabold text-[#241d32]">Free</span>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-[#918a9e]">
                  Anyone can watch.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAccess('premium')}
                className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                  access === 'premium'
                    ? 'border-[#7443e5] bg-[#f3edff] shadow-[0_0_0_3px_rgba(116,67,229,0.08)]'
                    : 'border-[#e4dfea] bg-white hover:bg-[#faf8fd]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LockKeyhole size={17} className="text-[#7041de]" />
                  <span className="text-[13px] font-extrabold text-[#241d32]">Premium</span>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-[#918a9e]">
                  Viewers must unlock it.
                </p>
              </button>
            </div>

            {access === 'premium' ? (
              <div className="mb-4">
                <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
                  Price
                </label>
                <div className="flex h-12 items-center rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 transition focus-within:border-[#7b48e7] focus-within:bg-white">
                  <span className="text-[14px] font-extrabold text-[#7041de]">$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] font-bold text-[#171329] outline-none"
                  />
                </div>
              </div>
            ) : null}

            {message ? (
              <div className="mb-4 rounded-[15px] bg-[#f3edff] px-4 py-3 text-[11px] font-bold leading-5 text-[#6538d2]">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[#7443e5] text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(116,67,229,0.25)] transition hover:bg-[#6538d2] active:scale-[0.99]"
            >
              <Upload size={17} />
              Continue
            </button>
          </form>

          <aside className="rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#171329]">
                  Preview
                </h2>
                <p className="mt-1 text-[12px] text-[#918a9e]">How your video will appear.</p>
              </div>
              <CheckCircle2 size={21} className="text-[#7041de]" />
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[#e8e2f1] bg-[#181124]">
              <div className="relative aspect-video bg-gradient-to-br from-[#3d246f] via-[#7443e5] to-[#e887a5]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-[#7041de] shadow-xl">
                    <Play size={27} fill="currentColor" className="ml-1" />
                  </span>
                </div>
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#21152f]/70 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                  <Link2 size={12} />
                  Link Video
                </span>
              </div>

              <div className="bg-white p-4">
                <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-[#171329]">
                  {title.trim() || 'Your video title'}
                </h3>
                <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#918a9e]">
                  {description.trim() || 'Your video description will appear here.'}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                      access === 'premium'
                        ? 'bg-[#fff4d9] text-[#a96d00]'
                        : 'bg-[#eafaf1] text-[#168653]'
                    }`}
                  >
                    {access === 'premium' ? `$${price || '0.00'}` : 'Free'}
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-[12px] border border-[#7443e5] px-3 py-2 text-[11px] font-extrabold text-[#7041de]"
                  >
                    <Play size={13} fill="currentColor" />
                    Watch
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#171329]">
                Your videos
              </h2>
              <p className="mt-1 text-[12px] text-[#918a9e]">Manage published and draft videos.</p>
            </div>

            <div className="flex h-10 items-center rounded-full border border-[#ddd7e8] bg-[#faf9fd] px-3 sm:w-[260px]">
              <Search size={16} className="shrink-0 text-[#81788f]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your videos"
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-[12px] outline-none placeholder:text-[#aaa3b4]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <article
                key={video.id}
                className="grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border border-[#ece8f5] p-3 sm:grid-cols-[138px_minmax(0,1fr)_auto]"
              >
                <div className="relative h-[72px] overflow-hidden rounded-[13px] bg-[#eee9f7] sm:h-[82px]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-[12px] font-extrabold leading-5 text-[#211a30] sm:text-[14px]">
                    {video.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-[#918a9e]">
                    <span>{video.views} views</span>
                    <span>•</span>
                    <span>{video.access}</span>
                  </div>
                  <span className="mt-2 inline-flex rounded-full bg-[#eafaf1] px-2.5 py-1 text-[9px] font-extrabold text-[#168653]">
                    {video.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e2ddea] text-[#6f667d] transition hover:bg-[#f7f3ff] hover:text-[#7041de]"
                  aria-label={`Open options for ${video.title}`}
                >
                  <ChevronDown size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

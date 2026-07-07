import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Gem,
  ImagePlus,
  Link2,
  LockKeyhole,
  Play,
  Save,
  Send,
  Tag,
  UploadCloud,
  X,
} from 'lucide-react'

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024
const ALLOWED_THUMBNAIL_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function extractYouTubeId(value) {
  const input = String(value || '').trim()

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match?.[1]) return match[1]
  }

  return ''
}

export default function FastCreateVideoPage() {
  const navigate = useNavigate()
  const thumbnailInputRef = useRef(null)
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [access, setAccess] = useState('free')
  const [diamonds, setDiamonds] = useState('10')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [message, setMessage] = useState('')

  const youtubeThumbnail = useMemo(() => {
    const videoId = extractYouTubeId(link)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
  }, [link])

  const previewThumbnail = thumbnailPreview || youtubeThumbnail

  useEffect(() => {
    return () => {
      if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview)
    }
  }, [thumbnailPreview])

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0]
    setMessage('')

    if (!file) return

    if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type)) {
      setMessage('Thumbnail must be JPG, PNG, or WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      setMessage('Thumbnail must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview)

    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const removeThumbnail = () => {
    if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview)
    setThumbnailFile(null)
    setThumbnailPreview('')
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
  }

  const addTag = (rawValue = tagInput) => {
    const nextTag = String(rawValue || '')
      .trim()
      .replace(/^#+/, '')
      .replace(/\s+/g, '-')
      .slice(0, 24)

    if (!nextTag || tags.includes(nextTag) || tags.length >= 10) {
      setTagInput('')
      return
    }

    setTags((current) => [...current, nextTag])
    setTagInput('')
  }

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }

    if (event.key === 'Backspace' && !tagInput && tags.length) {
      setTags((current) => current.slice(0, -1))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage('')

    if (!link.trim() || !title.trim()) {
      setMessage('Video link and title are required.')
      return
    }

    if (!previewThumbnail) {
      setMessage('Add a thumbnail or use a valid YouTube link.')
      return
    }

    if (access === 'paid' && (!diamonds || Number(diamonds) < 1)) {
      setMessage('Unlock price must be at least 1 Diamond.')
      return
    }

    setMessage(
      thumbnailFile
        ? 'Create form is ready. Cloudflare thumbnail upload will be connected in the backend stage.'
        : 'Create form is ready.'
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-10 text-[#171329]">
      <header className="sticky top-0 z-50 border-b border-[#ece8f5] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1040px] items-center gap-3 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => navigate('/fast/studio')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6e1ef] bg-white text-[#302943] transition hover:bg-[#f8f5ff] active:scale-95"
            aria-label="Back to Fast Studio"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-black tracking-[-0.03em] text-[#171329]">
              Create video
            </h1>
            <p className="text-[11px] font-medium text-[#918a9e]">
              Add a linked video to Fast
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

      <main className="mx-auto grid w-full max-w-[1040px] gap-5 px-3 py-5 sm:px-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5"
        >
          <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
            Video link
          </label>
          <div className="mb-4 flex h-12 items-center rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-3 transition focus-within:border-[#7b48e7] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(123,72,231,0.09)]">
            <Link2 size={17} className="shrink-0 text-[#7d6e98]" />
            <input
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Paste YouTube or external video URL"
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] text-[#171329] outline-none placeholder:text-[#aaa3b4]"
            />
          </div>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
            Video title
          </label>
          <input
            type="text"
            maxLength={100}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter video title"
            className="h-12 w-full rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 text-[13px] text-[#171329] outline-none transition placeholder:text-[#aaa3b4] focus:border-[#7b48e7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,72,231,0.09)]"
          />
          <div className="mb-4 mt-1 text-right text-[10px] font-semibold text-[#aaa3b4]">
            {title.length}/100
          </div>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
            Description
          </label>
          <textarea
            value={description}
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short description"
            rows={4}
            className="w-full resize-none rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 py-3 text-[13px] leading-5 text-[#171329] outline-none transition placeholder:text-[#aaa3b4] focus:border-[#7b48e7] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,72,231,0.09)]"
          />
          <div className="mb-4 mt-1 text-right text-[10px] font-semibold text-[#aaa3b4]">
            {description.length}/500
          </div>

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
            Thumbnail
          </label>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbnailChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="mb-2 flex w-full items-center gap-3 rounded-[18px] border border-dashed border-[#bda9eb] bg-[#faf7ff] p-4 text-left transition hover:bg-[#f4eeff]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eee5ff] text-[#7041de]">
              <ImagePlus size={21} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-extrabold text-[#302943]">
                Upload thumbnail
              </span>
              <span className="mt-1 block text-[10px] leading-4 text-[#918a9e]">
                JPG, PNG or WEBP · Maximum 5 MB · Recommended 16:9
              </span>
            </span>
          </button>

          {thumbnailFile ? (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-[14px] bg-[#f3edff] px-3 py-2">
              <span className="min-w-0 truncate text-[11px] font-bold text-[#6538d2]">
                {thumbnailFile.name}
              </span>
              <button
                type="button"
                onClick={removeThumbnail}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#7443e5] hover:bg-white"
                aria-label="Remove thumbnail"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="mb-4 text-[10px] font-medium text-[#918a9e]">
              A YouTube thumbnail is used automatically until you upload your own.
            </div>
          )}

          <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
            Tags
          </label>
          <div className="mb-2 flex min-h-12 flex-wrap items-center gap-2 rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-3 py-2 focus-within:border-[#7b48e7] focus-within:bg-white">
            <Tag size={16} className="shrink-0 text-[#7d6e98]" />

            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#eee5ff] px-2.5 py-1.5 text-[10px] font-extrabold text-[#6538d2]"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  aria-label={`Remove ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            <input
              type="text"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => addTag()}
              placeholder={tags.length ? 'Add another tag' : 'Type a tag and press Enter'}
              className="h-8 min-w-[150px] flex-1 bg-transparent text-[12px] text-[#171329] outline-none placeholder:text-[#aaa3b4]"
            />
          </div>
          <p className="mb-4 text-[10px] font-medium text-[#918a9e]">
            Up to 10 tags. Press Enter or comma to add.
          </p>

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
              onClick={() => setAccess('paid')}
              className={`rounded-[17px] border p-3 text-left transition active:scale-[0.99] ${
                access === 'paid'
                  ? 'border-[#7443e5] bg-[#f3edff] shadow-[0_0_0_3px_rgba(116,67,229,0.08)]'
                  : 'border-[#e4dfea] bg-white hover:bg-[#faf8fd]'
              }`}
            >
              <div className="flex items-center gap-2">
                <LockKeyhole size={17} className="text-[#7041de]" />
                <span className="text-[13px] font-extrabold text-[#241d32]">Paid unlock</span>
              </div>
              <p className="mt-1 text-[10px] leading-4 text-[#918a9e]">
                Unlock with Diamonds.
              </p>
            </button>
          </div>

          {access === 'paid' ? (
            <div className="mb-4">
              <label className="mb-2 block text-[12px] font-extrabold text-[#302943]">
                Unlock price
              </label>
              <div className="flex h-12 items-center rounded-[16px] border border-[#ddd7e8] bg-[#faf9fd] px-4 transition focus-within:border-[#7b48e7] focus-within:bg-white">
                <Gem size={17} fill="currentColor" className="shrink-0 text-[#7041de]" />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={diamonds}
                  onChange={(event) => setDiamonds(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] font-bold text-[#171329] outline-none"
                />
                <span className="text-[11px] font-extrabold text-[#7041de]">Diamonds</span>
              </div>
            </div>
          ) : null}

          {message ? (
            <div className="mb-4 rounded-[15px] bg-[#f3edff] px-4 py-3 text-[11px] font-bold leading-5 text-[#6538d2]">
              {message}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] border border-[#cdbcf2] bg-white text-[12px] font-extrabold text-[#6738d9] transition hover:bg-[#f8f5ff] active:scale-[0.99]"
            >
              <Save size={16} />
              Save draft
            </button>
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#7443e5] text-[12px] font-extrabold text-white shadow-[0_12px_26px_rgba(116,67,229,0.25)] transition hover:bg-[#6538d2] active:scale-[0.99]"
            >
              <Send size={16} />
              Publish
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-[24px] border border-[#ece8f5] bg-white p-4 shadow-[0_16px_38px_rgba(77,51,125,0.07)] sm:p-5 lg:sticky lg:top-[82px]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-black tracking-[-0.02em] text-[#171329]">
                Preview in Fast
              </h2>
              <p className="mt-1 text-[12px] text-[#918a9e]">How your video will appear.</p>
            </div>
            <CheckCircle2 size={21} className="text-[#7041de]" />
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#e8e2f1] bg-white">
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#3d246f] via-[#7443e5] to-[#e887a5]">
              {previewThumbnail ? (
                <img
                  src={previewThumbnail}
                  alt="Video thumbnail preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/92 text-[#7041de] shadow-xl">
                  <Play size={27} fill="currentColor" className="ml-1" />
                </span>
              </div>

              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#21152f]/75 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                <Link2 size={12} />
                Link Video
              </span>

              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#7041de]/90 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                {access === 'paid' ? <Gem size={12} fill="currentColor" /> : <Play size={12} />}
                {access === 'paid' ? 'Paid Unlock' : 'Free'}
              </span>
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-[#171329]">
                {title.trim() || 'Your video title'}
              </h3>
              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#918a9e]">
                {description.trim() || 'Your video description will appear here.'}
              </p>

              {tags.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f3edff] px-2 py-1 text-[9px] font-bold text-[#7041de]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                    access === 'paid'
                      ? 'bg-[#f3edff] text-[#7041de]'
                      : 'bg-[#eafaf1] text-[#168653]'
                  }`}
                >
                  {access === 'paid' ? <Gem size={12} fill="currentColor" /> : null}
                  {access === 'paid' ? `${diamonds || 0} Diamonds` : 'Free'}
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

          <div className="mt-4 rounded-[16px] bg-[#faf7ff] p-3">
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#6538d2]">
              <UploadCloud size={16} />
              Thumbnail storage
            </div>
            <p className="mt-1 text-[10px] leading-4 text-[#918a9e]">
              Uploaded thumbnails will be stored in Cloudflare R2 after the backend upload API is connected.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}

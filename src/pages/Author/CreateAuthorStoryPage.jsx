import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])
const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 50 * 1024 * 1024

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatFileSize(bytes) {
  const value = Number(bytes || 0)

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1)} MB`
  }

  return `${Math.max(1, Math.round(value / 1024))} KB`
}

function uploadAuthorStory({ file, caption, allowMessages, token, onProgress }) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    const formData = new FormData()

    formData.append('media', file)
    formData.append('caption', caption)
    formData.append('allow_messages', String(allowMessages))

    request.open('POST', `${API_BASE_URL}/api/author-stories/me`)
    request.setRequestHeader('Authorization', `Bearer ${token}`)
    request.timeout = 180000

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)))
    }

    request.onload = () => {
      let data = {}

      try {
        data = JSON.parse(request.responseText || '{}')
      } catch {
        data = {}
      }

      if (request.status >= 200 && request.status < 300 && data.ok !== false) {
        onProgress(100)
        resolve(data.story || null)
        return
      }

      reject(new Error(data.message || 'Failed to share story'))
    }

    request.onerror = () => reject(new Error('Network error while uploading story'))
    request.ontimeout = () => reject(new Error('Story upload took too long. Please try again.'))
    request.send(formData)
  })
}

function StepProgress({ step }) {
  const activeStep = {
    select: 1,
    preview: 2,
    details: 3,
    review: 4,
    success: 4,
  }[step] || 1

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4].map((item) => (
        <span
          key={item}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            item <= activeStep
              ? 'bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899]'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  )
}

function BackButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl transition active:scale-95 disabled:opacity-40"
      aria-label="Back"
    >
      <i className="fa-solid fa-chevron-left text-[14px]" />
    </button>
  )
}

function MediaCanvas({ file, previewUrl, compact = false }) {
  const isVideo = file?.type?.startsWith('video/')

  return (
    <div
      className={`relative overflow-hidden bg-[#080b18] shadow-[0_30px_90px_rgba(76,29,149,0.45)] ring-1 ring-white/10 ${
        compact
          ? 'h-16 w-12 rounded-[12px]'
          : 'aspect-[9/16] w-full max-w-[390px] rounded-[28px]'
      }`}
    >
      {!isVideo && previewUrl ? (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-35 blur-2xl"
          style={{ backgroundImage: `url(${previewUrl})` }}
        />
      ) : null}

      {isVideo ? (
        <video
          src={previewUrl}
          controls={!compact}
          muted={compact}
          playsInline
          className="relative h-full w-full object-contain"
        />
      ) : (
        <img
          src={previewUrl}
          alt=""
          className="relative h-full w-full object-contain"
        />
      )}

      {!compact ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 to-transparent" />
        </>
      ) : null}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${
        checked
          ? 'bg-gradient-to-r from-[#7c3aed] to-[#ec4899]'
          : 'bg-white/15'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

export default function CreateAuthorStoryPage() {
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const [step, setStep] = useState('select')
  const [mediaFile, setMediaFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [allowMessages, setAllowMessages] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [createdStory, setCreatedStory] = useState(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function resetMedia() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setMediaFile(null)
    setPreviewUrl('')
    setCaption('')
    setAllowMessages(true)
    setCreatedStory(null)
    setUploadProgress(0)
    setError('')
    setStep('select')

    if (photoInputRef.current) photoInputRef.current.value = ''
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  function selectMedia(file) {
    if (!file) return

    const isPhoto = PHOTO_TYPES.has(file.type)
    const isVideo = VIDEO_TYPES.has(file.type)

    if (!isPhoto && !isVideo) {
      setError('Choose a JPG, PNG, WebP, MP4, WebM, or MOV file.')
      return
    }

    if (isPhoto && file.size > MAX_PHOTO_BYTES) {
      setError('Photo must be 10 MB or smaller.')
      return
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setError('Video must be 50 MB or smaller.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setMediaFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError('')
    setStep('preview')
  }

  function handleBack() {
    if (uploading) return

    if (step === 'success') {
      navigate('/author/page')
      return
    }

    if (step === 'review') {
      setStep('details')
      return
    }

    if (step === 'details') {
      setStep('preview')
      return
    }

    if (step === 'preview') {
      setStep('select')
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/author/page')
  }

  async function handlePublish() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!mediaFile || uploading) return

    try {
      setUploading(true)
      setUploadProgress(0)
      setError('')

      const story = await uploadAuthorStory({
        file: mediaFile,
        caption: caption.trim(),
        allowMessages,
        token,
        onProgress: setUploadProgress,
      })

      setCreatedStory(story)
      setStep('success')
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to share story')
    } finally {
      setUploading(false)
    }
  }

  const isVideo = mediaFile?.type?.startsWith('video/')
  const title =
    step === 'select'
      ? 'Create story'
      : step === 'preview'
        ? 'Preview'
        : step === 'details'
          ? 'Story details'
          : step === 'review'
            ? 'Ready to share'
            : 'Story published'

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[#050712] text-white">
      <style>{`
        @keyframes storyGlow {
          0%, 100% { opacity: .45; transform: scale(.96); }
          50% { opacity: .8; transform: scale(1.05); }
        }

        .story-glow {
          animation: storyGlow 4s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="story-glow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#7c3aed]/35 blur-[100px]" />
        <div className="story-glow absolute -right-24 top-[28%] h-72 w-72 rounded-full bg-[#ec4899]/25 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#35105f]/25 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[720px] flex-col">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050712]/80 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <BackButton onClick={handleBack} disabled={uploading} />

            <div className="text-center">
              <div className="text-[15px] font-black tracking-tight">{title}</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Shadow Story
              </div>
            </div>

            <button
              type="button"
              onClick={step === 'select' ? handleBack : resetMedia}
              disabled={uploading}
              className="flex h-10 min-w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-[11px] font-bold text-white/70 backdrop-blur-xl active:scale-95 disabled:opacity-40"
            >
              {step === 'select' ? 'Close' : 'Reset'}
            </button>
          </div>

          <div className="mt-3">
            <StepProgress step={step} />
          </div>
        </header>

        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-4 rounded-[16px] border border-[#fb7185]/25 bg-[#fb7185]/10 px-4 py-3 text-left text-[12px] font-semibold leading-5 text-[#fecdd3]"
          >
            <i className="fa-solid fa-circle-exclamation mr-2" />
            {error}
          </button>
        ) : null}

        {step === 'select' ? (
          <main className="flex flex-1 flex-col px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-8">
            <div className="mx-auto w-full max-w-[560px]">
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#a855f7]/30 bg-[#7c3aed]/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#d8b4fe]">
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  Live for 24 hours
                </div>

                <h1 className="mt-5 max-w-[420px] text-[28px] font-black leading-[1.08] tracking-[-0.04em] sm:text-[34px]">
                  Share a moment with your readers.
                </h1>

                <p className="mt-3 max-w-[470px] text-[13px] font-medium leading-6 text-white/55">
                  Choose one photo or video. Your media is stored in Cloudflare R2 and removed after the story expires.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="group relative overflow-hidden rounded-[24px] border border-[#8b5cf6]/35 bg-gradient-to-br from-[#6d28d9]/30 via-[#11152a] to-[#0b1020] p-4 text-left shadow-[0_18px_45px_rgba(76,29,149,0.28)] transition active:scale-[0.98]"
                  >
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#a855f7]/25 blur-2xl" />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#8b5cf6] to-[#c026d3] text-[20px] shadow-[0_10px_30px_rgba(168,85,247,0.45)]">
                      <i className="fa-regular fa-image" />
                    </span>
                    <div className="relative mt-5 text-[15px] font-black">Photo story</div>
                    <div className="relative mt-1 text-[11px] font-medium leading-5 text-white/45">
                      JPG, PNG or WebP
                    </div>
                    <div className="relative mt-3 text-[10px] font-bold text-[#c4b5fd]">Maximum 10 MB</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="group relative overflow-hidden rounded-[24px] border border-[#ec4899]/30 bg-gradient-to-br from-[#be185d]/25 via-[#11152a] to-[#0b1020] p-4 text-left shadow-[0_18px_45px_rgba(157,23,77,0.22)] transition active:scale-[0.98]"
                  >
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#ec4899]/25 blur-2xl" />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#db2777] to-[#7c3aed] text-[20px] shadow-[0_10px_30px_rgba(236,72,153,0.4)]">
                      <i className="fa-solid fa-play" />
                    </span>
                    <div className="relative mt-5 text-[15px] font-black">Video story</div>
                    <div className="relative mt-1 text-[11px] font-medium leading-5 text-white/45">
                      MP4, WebM or MOV
                    </div>
                    <div className="relative mt-3 text-[10px] font-bold text-[#f9a8d4]">Maximum 50 MB</div>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ['fa-cloud-arrow-up', 'Cloudflare R2'],
                  ['fa-clock', 'Auto delete 24h'],
                  ['fa-shield-halved', 'Author only'],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    className="rounded-[18px] border border-white/[0.07] bg-white/[0.035] px-2 py-3 text-center backdrop-blur-xl"
                  >
                    <i className={`fa-solid ${icon} text-[14px] text-[#c084fc]`} />
                    <div className="mt-2 text-[9px] font-bold leading-4 text-white/45">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => selectMedia(event.target.files?.[0])}
            />

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(event) => selectMedia(event.target.files?.[0])}
            />
          </main>
        ) : null}

        {step === 'preview' && mediaFile ? (
          <main className="flex flex-1 flex-col px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-5">
            <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col">
              <div className="flex flex-1 items-center justify-center py-2">
                <MediaCanvas file={mediaFile} previewUrl={previewUrl} />
              </div>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.05] p-3 backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-black">{mediaFile.name}</div>
                    <div className="mt-1 text-[10px] font-semibold text-white/40">
                      {isVideo ? 'Video' : 'Photo'} · {formatFileSize(mediaFile.size)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => (isVideo ? videoInputRef.current : photoInputRef.current)?.click()}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-bold text-white/80 active:scale-95"
                  >
                    Change
                  </button>

                  <button
                    type="button"
                    onClick={resetMedia}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fda4af] active:scale-95"
                    aria-label="Remove media"
                  >
                    <i className="fa-regular fa-trash-can text-[12px]" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="mt-4 h-13 w-full rounded-[17px] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] px-5 py-3.5 text-[13px] font-black shadow-[0_14px_38px_rgba(168,85,247,0.35)] transition active:scale-[0.99]"
              >
                Continue
                <i className="fa-solid fa-arrow-right ml-2 text-[11px]" />
              </button>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => selectMedia(event.target.files?.[0])}
              />

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(event) => selectMedia(event.target.files?.[0])}
              />
            </div>
          </main>
        ) : null}

        {step === 'details' && mediaFile ? (
          <main className="flex flex-1 flex-col px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-5">
            <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <MediaCanvas file={mediaFile} previewUrl={previewUrl} compact />

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black">Your story</div>
                    <div className="mt-1 truncate text-[10px] font-semibold text-white/40">
                      {mediaFile.name}
                    </div>
                  </div>

                  <span className="rounded-full border border-[#a855f7]/25 bg-[#7c3aed]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#d8b4fe]">
                    24 hours
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="story-caption" className="text-[11px] font-black text-white/75">
                      Caption
                    </label>
                    <span className="text-[10px] font-bold text-white/30">{caption.length}/200</span>
                  </div>

                  <textarea
                    id="story-caption"
                    value={caption}
                    onChange={(event) => setCaption(event.target.value.slice(0, 200))}
                    placeholder="Say something about this moment..."
                    rows={5}
                    className="w-full resize-none rounded-[18px] border border-white/10 bg-[#090d1b]/80 px-4 py-3 text-[13px] font-medium leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#a855f7]/60 focus:ring-4 focus:ring-[#7c3aed]/10"
                  />
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl">
                <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#7c3aed]/15 text-[#c084fc]">
                    <i className="fa-solid fa-earth-asia text-[14px]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-black">Audience</div>
                    <div className="mt-1 text-[10px] font-semibold text-white/40">Everyone can view this story</div>
                  </div>

                  <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[10px] font-black text-white/65">
                    Public
                  </span>
                </div>

                <div className="flex items-center gap-3 px-4 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#ec4899]/12 text-[#f9a8d4]">
                    <i className="fa-regular fa-message text-[14px]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-black">Allow messages</div>
                    <div className="mt-1 text-[10px] font-semibold text-white/40">Readers can reply to your story</div>
                  </div>

                  <Toggle checked={allowMessages} onChange={setAllowMessages} />
                </div>
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-full rounded-[17px] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] px-5 py-3.5 text-[13px] font-black shadow-[0_14px_38px_rgba(168,85,247,0.35)] transition active:scale-[0.99]"
                >
                  Review story
                  <i className="fa-solid fa-arrow-right ml-2 text-[11px]" />
                </button>
              </div>
            </div>
          </main>
        ) : null}

        {step === 'review' && mediaFile ? (
          <main className="flex flex-1 flex-col px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-8">
            <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
              <div className="text-center">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <div className="story-glow absolute inset-0 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ec4899] blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#7c3aed]/80 to-[#ec4899]/80 text-[29px] shadow-[0_18px_55px_rgba(168,85,247,0.4)]">
                    <i className="fa-solid fa-paper-plane" />
                  </div>
                </div>

                <h1 className="mt-5 text-[26px] font-black tracking-[-0.04em]">Ready to share</h1>
                <p className="mx-auto mt-2 max-w-[360px] text-[12px] font-medium leading-6 text-white/45">
                  Your story will be public for 24 hours and its media will be stored in Cloudflare R2.
                </p>
              </div>

              <div className="mt-7 rounded-[26px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-2xl">
                <div className="flex items-center gap-3 border-b border-white/[0.07] pb-4">
                  <MediaCanvas file={mediaFile} previewUrl={previewUrl} compact />

                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-black">{isVideo ? 'Video story' : 'Photo story'}</div>
                    <div className="mt-1 truncate text-[10px] font-semibold text-white/40">
                      {formatFileSize(mediaFile.size)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('preview')}
                    disabled={uploading}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold text-white/70 disabled:opacity-40"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-4 pt-4">
                  {[
                    ['fa-clock', 'Automatically removed after 24 hours'],
                    ['fa-cloud-arrow-up', 'Stored securely in Cloudflare R2'],
                    ['fa-earth-asia', 'Public story'],
                    ['fa-message', allowMessages ? 'Reader messages enabled' : 'Reader messages disabled'],
                  ].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-[#7c3aed]/15 text-[#c084fc]">
                        <i className={`fa-solid ${icon} text-[12px]`} />
                      </span>
                      <span className="text-[11px] font-bold text-white/65">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {uploading ? (
                <div className="mt-4 rounded-[20px] border border-[#a855f7]/25 bg-[#7c3aed]/10 p-4">
                  <div className="flex items-center justify-between text-[10px] font-black">
                    <span>Uploading to Cloudflare</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-auto space-y-2 pt-6">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={uploading}
                  className="w-full rounded-[17px] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] px-5 py-3.5 text-[13px] font-black shadow-[0_14px_38px_rgba(168,85,247,0.35)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {uploading ? (
                    <>
                      <i className="fa-solid fa-circle-notch mr-2 animate-spin" />
                      Sharing story
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane mr-2" />
                      Share story
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  disabled={uploading}
                  className="w-full rounded-[17px] border border-white/10 bg-white/[0.045] px-5 py-3.5 text-[12px] font-black text-white/65 transition active:scale-[0.99] disabled:opacity-40"
                >
                  Back
                </button>
              </div>
            </div>
          </main>
        ) : null}

        {step === 'success' ? (
          <main className="flex flex-1 items-center px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-6">
            <div className="mx-auto w-full max-w-[500px] text-center">
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                <div className="story-glow absolute inset-0 rounded-full bg-gradient-to-br from-[#22c55e] via-[#8b5cf6] to-[#ec4899] blur-3xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#16a34a] via-[#7c3aed] to-[#db2777] text-[34px] shadow-[0_22px_60px_rgba(124,58,237,0.42)]">
                  <i className="fa-solid fa-check" />
                </div>
              </div>

              <h1 className="mt-7 text-[30px] font-black tracking-[-0.05em]">Your story is live</h1>
              <p className="mx-auto mt-3 max-w-[360px] text-[12px] font-medium leading-6 text-white/45">
                Readers can now see your story. It will expire automatically after 24 hours.
              </p>

              <div className="mx-auto mt-7 flex max-w-[360px] items-center justify-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] p-3 text-left backdrop-blur-2xl">
                {mediaFile && previewUrl ? (
                  <MediaCanvas file={mediaFile} previewUrl={previewUrl} compact />
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-black">{createdStory?.media_type === 'video' ? 'Video story' : 'Photo story'}</div>
                  <div className="mt-1 text-[10px] font-semibold text-white/40">Expires in 24 hours</div>
                </div>

                <i className="fa-solid fa-cloud-arrow-up text-[16px] text-[#c084fc]" />
              </div>

              <div className="mt-8 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/author/page')}
                  className="w-full rounded-[17px] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] px-5 py-3.5 text-[13px] font-black shadow-[0_14px_38px_rgba(168,85,247,0.35)] active:scale-[0.99]"
                >
                  Return to Author Page
                </button>

                <button
                  type="button"
                  onClick={resetMedia}
                  className="w-full rounded-[17px] border border-white/10 bg-white/[0.045] px-5 py-3.5 text-[12px] font-black text-white/65 active:scale-[0.99]"
                >
                  Add another story
                </button>
              </div>
            </div>
          </main>
        ) : null}
      </div>
    </div>
  )
}

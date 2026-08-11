import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime'])
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_BYTES = 30 * 1024 * 1024
const MAX_VIDEO_DURATION_SECONDS = 60

const MODE_CONFIG = {
  reader: {
    apiPath: '/api/reader-stories/me',
    returnPath: '/discover',
  },
  author: {
    apiPath: '/api/author-stories/me',
    returnPath: '/author/page',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)

    function cleanup() {
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(objectUrl)
    }

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      const duration = Number(video.duration || 0)
      cleanup()

      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error('Could not read video duration.'))
        return
      }

      resolve(duration)
    }

    video.onerror = () => {
      cleanup()
      reject(new Error('Could not read this video file.'))
    }

    video.src = objectUrl
  })
}

function uploadStory({ apiPath, file, textOverlay, token, onProgress }) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    const formData = new FormData()

    formData.append('media', file)
    formData.append('caption', textOverlay.trim())
    formData.append('allow_messages', 'true')

    request.open('POST', `${API_BASE_URL}${apiPath}`)
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

    request.onerror = () => reject(new Error('Network error while sharing story'))
    request.ontimeout = () => reject(new Error('Story upload took too long. Please try again.'))
    request.send(formData)
  })
}

async function saveStoryExtras({
  apiPath,
  storyId,
  token,
  textOverlay,
  altText,
  mentionUsername,
  linkUrl,
}) {
  const response = await fetch(
    `${API_BASE_URL}${apiPath}/${encodeURIComponent(storyId)}/extras`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text_overlay: textOverlay.trim(),
        alt_text: altText.trim(),
        mention_username: mentionUsername.trim(),
        link_url: linkUrl.trim(),
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to save story details')
  }
}

async function deleteCreatedStory({ apiPath, storyId, token }) {
  await fetch(`${API_BASE_URL}${apiPath}/${encodeURIComponent(storyId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null)
}

function BottomSheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/45">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close" />
      <section
        className="relative z-10 w-full max-w-[680px] rounded-t-[24px] bg-white px-4 pb-[max(22px,env(safe-area-inset-bottom))] pt-3 text-[#111827] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-[#cfd1d5]" />
        {children}
      </section>
    </div>
  )
}

function EditorSheet({ title, value, placeholder, maxLength, multiline = false, onSave, onClose }) {
  const [draft, setDraft] = useState(value)

  return (
    <BottomSheet onClose={onClose}>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-bold">{title}</h2>
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="rounded-full bg-[#111827] px-5 py-2 text-[12px] font-bold text-white"
        >
          Save
        </button>
      </div>

      {multiline ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          rows={5}
          placeholder={placeholder}
          className="mt-5 min-h-[130px] w-full resize-none rounded-[14px] border border-[#d9dce2] px-4 py-3 text-[14px] leading-6 outline-none focus:border-[#111827]"
        />
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="mt-5 h-12 w-full rounded-[14px] border border-[#d9dce2] px-4 text-[14px] outline-none focus:border-[#111827]"
        />
      )}

      <div className="mt-2 text-right text-[10px] font-semibold text-[#9a9da3]">
        {draft.length}/{maxLength}
      </div>
    </BottomSheet>
  )
}

function ToolButton({ icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5 text-white">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          active ? 'bg-white text-black' : 'bg-black/55 text-white'
        }`}
      >
        <i className={`${icon} text-[19px]`} />
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  )
}

export default function StoryComposer({ mode }) {
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const config = MODE_CONFIG[mode] || MODE_CONFIG.reader

  const [step, setStep] = useState('choose')
  const [mediaFile, setMediaFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [textOverlay, setTextOverlay] = useState('')
  const [altText, setAltText] = useState('')
  const [mentionUsername, setMentionUsername] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [sheet, setSheet] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (!error) return undefined
    const timer = window.setTimeout(() => setError(''), 3500)
    return () => window.clearTimeout(timer)
  }, [error])

  function leaveComposer() {
    navigate(config.returnPath, { replace: true })
  }

  async function chooseMedia(file) {
    if (!file) return

    const isPhoto = PHOTO_TYPES.has(file.type)
    const isVideo = VIDEO_TYPES.has(file.type)

    if (!isPhoto && !isVideo) {
      setError('Choose a JPG, PNG, WebP, MP4, or MOV file.')
      return
    }

    if (isPhoto && file.size > MAX_PHOTO_BYTES) {
      setError('Photo must be 5 MB or smaller.')
      return
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setError('Video must be 30 MB or smaller.')
      return
    }

    if (isVideo) {
      try {
        const duration = await readVideoDuration(file)
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          setError('Video must be 60 seconds or shorter.')
          return
        }
      } catch (videoError) {
        setError(videoError.message || 'Could not validate video duration.')
        return
      }
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setMediaFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setTextOverlay('')
    setAltText('')
    setMentionUsername('')
    setLinkUrl('')
    setMoreOpen(false)
    setSheet('')
    setError('')
    setStep('edit')
  }

  function saveMention(value) {
    setMentionUsername(String(value || '').trim().replace(/^@+/, ''))
    setSheet('')
  }

  function saveLink(value) {
    const raw = String(value || '').trim()

    if (!raw) {
      setLinkUrl('')
      setSheet('')
      return
    }

    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

    try {
      const parsed = new URL(normalized)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
      setLinkUrl(parsed.toString())
      setSheet('')
    } catch {
      setError('Enter a valid link.')
    }
  }

  async function handleShare() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!mediaFile || sharing) return

    let createdStory = null

    try {
      setSharing(true)
      setUploadProgress(0)
      setError('')

      createdStory = await uploadStory({
        apiPath: config.apiPath,
        file: mediaFile,
        textOverlay,
        token,
        onProgress: setUploadProgress,
      })

      const hasExtras = Boolean(
        textOverlay.trim() ||
          altText.trim() ||
          mentionUsername.trim() ||
          linkUrl.trim()
      )

      if (hasExtras && createdStory?.id) {
        await saveStoryExtras({
          apiPath: config.apiPath,
          storyId: createdStory.id,
          token,
          textOverlay,
          altText,
          mentionUsername,
          linkUrl,
        })
      }

      navigate(config.returnPath, {
        replace: true,
        state: {
          storyShared: true,
          storyMode: mode,
        },
      })
    } catch (shareError) {
      if (createdStory?.id) {
        await deleteCreatedStory({
          apiPath: config.apiPath,
          storyId: createdStory.id,
          token,
        })
      }

      setError(shareError.message || 'Failed to share story')
    } finally {
      setSharing(false)
    }
  }

  const isVideo = mediaFile?.type?.startsWith('video/')
  const hasText = Boolean(textOverlay.trim())
  const hasMention = Boolean(mentionUsername.trim())
  const hasLink = Boolean(linkUrl.trim())

  if (step === 'choose') {
    return (
      <div className="min-h-[100dvh] bg-white text-[#111827]">
        <header className="sticky top-0 z-30 border-b border-[#ededf0] bg-white">
          <div className="mx-auto grid h-[62px] max-w-[680px] grid-cols-[48px_1fr_48px] items-center px-2 pt-[env(safe-area-inset-top)]">
            <button
              type="button"
              onClick={leaveComposer}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[25px] active:bg-[#f2f2f3]"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h1 className="text-center text-[18px] font-bold">Create story</h1>
            <span />
          </div>
        </header>

        <main className="mx-auto max-w-[680px] px-4 py-6">
          <h2 className="text-[20px] font-bold">Choose from your device</h2>
          <p className="mt-1 text-[12px] text-[#7d8087]">Select one photo or one video.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] bg-[#f2f3f5] px-4 active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <i className="fa-regular fa-image text-[24px]" />
              </span>
              <strong className="mt-4 text-[15px]">Photos</strong>
              <span className="mt-1 text-[10px] font-medium text-[#85888e]">JPG · PNG · WebP</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex min-h-[180px] flex-col items-center justify-center rounded-[20px] bg-[#f2f3f5] px-4 active:scale-[0.99]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <i className="fa-solid fa-video text-[22px]" />
              </span>
              <strong className="mt-4 text-[15px]">Videos</strong>
              <span className="mt-1 text-[10px] font-medium text-[#85888e]">MP4 · MOV</span>
            </button>
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => chooseMedia(event.target.files?.[0] || null)}
          />

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime"
            className="hidden"
            onChange={(event) => chooseMedia(event.target.files?.[0] || null)}
          />
        </main>

        {error ? (
          <div className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-[520px] rounded-[14px] bg-[#111827] px-4 py-3 text-center text-[12px] font-semibold text-white shadow-xl">
            {error}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            src={previewUrl}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          <img src={previewUrl} alt={altText} className="h-full w-full object-contain" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[680px] items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setDiscardOpen(true)}
            disabled={sharing}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-[19px] backdrop-blur-md disabled:opacity-50"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              disabled={sharing}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-[20px] backdrop-blur-md disabled:opacity-50"
              aria-label="More"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>

            {moreOpen ? (
              <div className="absolute right-0 top-[50px] w-[190px] overflow-hidden rounded-[14px] bg-[#303033] py-1 shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false)
                    setSheet('alt')
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold text-white active:bg-white/10"
                >
                  <i className="fa-solid fa-pen text-[13px]" />
                  Write alt text
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {hasText ? (
        <button type="button" onClick={() => setSheet('text')} className="absolute inset-x-6 top-[40%] z-20 text-center">
          <span className="inline-block max-w-full break-words rounded-[12px] bg-black/40 px-4 py-2 text-[28px] font-bold leading-tight text-white shadow-lg backdrop-blur-sm">
            {textOverlay}
          </span>
        </button>
      ) : null}

      {hasMention ? (
        <button type="button" onClick={() => setSheet('mention')} className="absolute inset-x-0 bottom-[225px] z-20 flex justify-center px-5">
          <span className="max-w-full truncate rounded-full bg-white px-4 py-2 text-[14px] font-bold text-[#111827] shadow-lg">
            @{mentionUsername}
          </span>
        </button>
      ) : null}

      {hasLink ? (
        <button type="button" onClick={() => setSheet('link')} className="absolute inset-x-0 bottom-[178px] z-20 flex justify-center px-5">
          <span className="max-w-[85%] truncate rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#111827] shadow-lg">
            <i className="fa-solid fa-link mr-2" />
            {linkUrl.replace(/^https?:\/\//i, '')}
          </span>
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-[80px] z-30">
        <div className="mx-auto flex max-w-[680px] items-center justify-center gap-9 px-4">
          <ToolButton icon="fa-solid fa-font" label="Text" active={hasText} onClick={() => setSheet('text')} />
          <ToolButton icon="fa-solid fa-at" label="Mention" active={hasMention} onClick={() => setSheet('mention')} />
          <ToolButton icon="fa-solid fa-link" label="Link" active={hasLink} onClick={() => setSheet('link')} />
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 z-30 bg-black">
        <div className="mx-auto flex h-[80px] max-w-[680px] items-center justify-between gap-4 px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#252527] px-4 py-2.5 text-[13px] font-semibold">
            <i className="fa-solid fa-earth-americas text-[12px]" />
            Public
          </div>

          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="min-w-[126px] rounded-[12px] bg-[#1877f2] px-6 py-3 text-[15px] font-bold text-white active:scale-[0.98] disabled:opacity-60"
          >
            {sharing ? `Sharing ${uploadProgress}%` : 'Share'}
          </button>
        </div>
      </footer>

      {error ? (
        <div className="fixed inset-x-4 bottom-[170px] z-[150] mx-auto max-w-[520px] rounded-[14px] bg-white px-4 py-3 text-center text-[12px] font-semibold text-[#111827] shadow-xl">
          {error}
        </div>
      ) : null}

      {discardOpen ? (
        <BottomSheet onClose={() => setDiscardOpen(false)}>
          <h2 className="mt-4 text-[19px] font-bold">Discard story?</h2>
          <p className="mt-1 text-[14px] leading-5 text-[#6e7178]">
            You&apos;ll lose this story and any changes you&apos;ve made to it.
          </p>

          <button
            type="button"
            onClick={() => setDiscardOpen(false)}
            className="mt-5 flex w-full items-center gap-4 rounded-[14px] px-2 py-3 text-left active:bg-[#f3f4f5]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eceef1]">
              <i className="fa-solid fa-pen" />
            </span>
            <span className="text-[16px] font-semibold">Keep editing</span>
          </button>

          <button
            type="button"
            onClick={leaveComposer}
            className="flex w-full items-center gap-4 rounded-[14px] px-2 py-3 text-left active:bg-[#f3f4f5]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eceef1]">
              <i className="fa-solid fa-trash" />
            </span>
            <span className="text-[16px] font-semibold">Discard story</span>
          </button>
        </BottomSheet>
      ) : null}

      {sheet === 'text' ? (
        <EditorSheet
          title="Text"
          value={textOverlay}
          placeholder="Write text"
          maxLength={200}
          multiline
          onSave={(value) => {
            setTextOverlay(value)
            setSheet('')
          }}
          onClose={() => setSheet('')}
        />
      ) : null}

      {sheet === 'mention' ? (
        <EditorSheet
          title="Mention"
          value={mentionUsername ? `@${mentionUsername}` : ''}
          placeholder="@username"
          maxLength={81}
          onSave={saveMention}
          onClose={() => setSheet('')}
        />
      ) : null}

      {sheet === 'link' ? (
        <EditorSheet
          title="Link"
          value={linkUrl}
          placeholder="https://example.com"
          maxLength={2048}
          onSave={saveLink}
          onClose={() => setSheet('')}
        />
      ) : null}

      {sheet === 'alt' ? (
        <EditorSheet
          title="Write alt text"
          value={altText}
          placeholder="Describe this story"
          maxLength={500}
          multiline
          onSave={(value) => {
            setAltText(value)
            setSheet('')
          }}
          onClose={() => setSheet('')}
        />
      ) : null}
    </div>
  )
}

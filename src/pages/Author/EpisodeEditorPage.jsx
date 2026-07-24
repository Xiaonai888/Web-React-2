import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import SmartFindReplacePanel from '../../components/Author/SmartFindReplacePanel'
import ImageDropZone from '../../components/common/ImageDropZone'
import {
  MANGA_MAX_FILES_PER_PICK,
  MANGA_MAX_PAGES,
  MANGA_MIN_PUBLISH_PAGES,
  formatFileSize,
  optimizeMangaImage,
  runWithConcurrency,
  uploadMangaPageFile,
  validateMangaFile,
} from '../../utils/mangaImageUtils'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MIN_CHARACTERS = 1500
const MAX_CHARACTERS = 30000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    array[index] = binary.charCodeAt(index)
  }

  return new File([array], fileName, { type: mime })
}

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  if (!imageDataUrl) return null
  if (String(imageDataUrl).startsWith('http')) return imageDataUrl

  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload image')
  }

  return data.image_url || data.imageUrl
}

function isDialogueOrSpecialLine(line) {
  const text = String(line || '').trim()
  if (!text) return false
  return /^[“"‘'«—–-]/.test(text) || /^(\d+[\.)]|[•*])\s+/.test(text)
}

function endsWithSentencePunctuation(line) {
  return /[។.!?…]"?$/.test(String(line || '').trim())
}

function cleanBrokenParagraphs(value) {
  const lines = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .split('\n')

  const output = []
  let buffer = []

  const flushBuffer = () => {
    if (!buffer.length) return
    output.push(buffer.join(' ').replace(/\s+/g, ' ').trim())
    buffer = []
  }

  lines.forEach((line) => {
    const text = line.trim()

    if (!text) {
      flushBuffer()
      if (output[output.length - 1] !== '') output.push('')
      return
    }

    if (isDialogueOrSpecialLine(text)) {
      flushBuffer()
      output.push(text)
      return
    }

    if (buffer.length && endsWithSentencePunctuation(buffer[buffer.length - 1])) {
      flushBuffer()
    }

    buffer.push(text)
  })

  flushBuffer()
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function makeLocalId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
          active ? 'bg-[#111827] text-white' : 'bg-[#f2f4f7] text-[#667085]'
        }`}
      >
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-extrabold ${active ? 'text-[#111827]' : 'text-[#98a2b3]'}`}>
        {title}
      </div>
    </div>
  )
}

function ToolButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-[#eceaf2] active:scale-95"
      aria-label={label}
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/10 px-6"
    >
      <div className="max-w-[360px] rounded-[18px] bg-white px-5 py-4 text-center text-[14px] font-bold leading-6 text-[#111827] shadow-2xl">
        {message}
      </div>
    </button>
  )
}

function UnsavedChangesModal({ open, onKeepEditing, onDiscard, onSaveDraft }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-5 text-center shadow-2xl">
        <h2 className="text-[18px] font-extrabold text-[#111827]">Unsaved Changes</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#555b66]">
          This episode has unsaved edits. Save your draft or discard your changes.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onKeepEditing}
            className="rounded-full border border-[#e4e7ec] bg-white px-3 py-2.5 text-[12px] font-extrabold text-[#111827] active:scale-95"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-full border border-[#f0b8b8] bg-white px-3 py-2.5 text-[12px] font-extrabold text-[#c04444] active:scale-95"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-full bg-[#111827] px-3 py-2.5 text-[12px] font-extrabold text-white active:scale-95"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}

function CleanParagraphsModal({ open, onCancel, onClean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[155] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
          <i className="fa-solid fa-wand-magic-sparkles text-[22px]" />
        </div>
        <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">Clean paragraph spacing?</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#555b66]">
          This will fix broken pasted lines while keeping dialogue, special lines, and paragraph breaks.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClean}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
          >
            Clean
          </button>
        </div>
      </div>
    </div>
  )
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return imageSrc

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return canvas.toDataURL('image/jpeg', 0.9)
}

function CropCoverModal({
  open,
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center overflow-hidden bg-black/50 px-4">
      <div className="w-full max-w-[560px] rounded-[26px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#111827]">Crop Episode Cover</h2>
            <p className="mt-1 text-[11px] leading-4 text-[#8d94a1]">
              Drag the image inside the frame. Pinch or use zoom to adjust.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
            aria-label="Close crop editor"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="relative h-[240px] touch-none overflow-hidden rounded-[20px] bg-[#111827] sm:h-[310px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
            restrictPosition={false}
            objectFit="horizontal-cover"
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[#555b66]">
            <span>Zoom</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-full accent-[#111827]"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
          >
            Save Crop
          </button>
        </div>
      </div>
    </div>
  )
}


function EpisodeDetailsSheet({
  open,
  title,
  cover,
  onTitleChange,
  onCoverChange,
  onRemoveCover,
  onClose,
  onSave,
}) {
  if (!open) return null

  const canSave = Boolean(title.trim())

  return (
    <div className="fixed inset-0 z-[150] flex items-end bg-black/35" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-[18px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
              aria-label="Close episode details"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>

            <h2 className="min-w-0 flex-1 truncate text-center text-[14px] font-bold text-[#111827]">
              Episode Details
            </h2>

            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:bg-[#d0d5dd]"
            >
              Save
            </button>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[13px] font-bold text-[#111827]">
              Episode Title <span className="text-[#e5484d]">*</span>
            </label>
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              maxLength={200}
              autoFocus
              placeholder="Enter episode title"
              className="h-12 w-full rounded-[10px] bg-[#f7f7fa] px-3 text-[14px] font-bold text-[#111827] outline-none placeholder:font-bold placeholder:text-[#a5aab4]"
            />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[13px] font-bold text-[#111827]">Episode Cover</div>
              <div className="text-[11px] text-[#8d94a1]">Optional</div>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-[#8d94a1]">
              If empty, the story cover will be used. Recommended 16:9.
            </p>

            {cover ? (
              <div className="mt-3 overflow-hidden rounded-[12px] bg-[#f7f7fa]">
                <div className="aspect-video w-full overflow-hidden">
                  <img src={cover} alt="Episode Cover" className="h-full w-full object-cover" />
                </div>

                <div className="flex items-center gap-2 p-3">
                  <label className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#111827] text-[12px] font-bold text-white active:scale-95">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        onCoverChange(event.target.files?.[0] || null)
                        event.target.value = ''
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={onRemoveCover}
                    className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#f2f4f7] text-[12px] font-bold text-[#555b66] active:scale-95"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="mt-3 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-[12px] bg-[#f7f7fa] text-center active:scale-[0.99]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm">
                  <i className="fa-regular fa-image text-[14px]" />
                </div>
                <div className="mt-3 text-[13px] font-bold text-[#111827]">Add Episode Cover</div>
                <div className="mt-1 text-[11px] text-[#8d94a1]">16:9 crop</div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    onCoverChange(event.target.files?.[0] || null)
                    event.target.value = ''
                  }}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MangaPageCard({ page, index, total, onMove, onDelete, onReplace, onRetry, disabled }) {
  const busy = ['queued', 'processing', 'uploading'].includes(page.status)
  const statusLabel =
    page.status === 'processing'
      ? 'Compressing'
      : page.status === 'uploading'
        ? 'Uploading'
        : page.status === 'error'
          ? 'Upload failed'
          : 'Ready'

  return (
    <ImageDropZone
      onFiles={(files) => onReplace(page.id, files[0] || null)}
      disabled={busy || disabled}
      className="rounded-[20px]"
      label="Drop replacement page here"
    >
      <div className="overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-white shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f2f4f7]">
        <img src={page.previewUrl || page.imageUrl} alt={`Manga page ${index + 1}`} className="h-full w-full object-contain" />
        <div className="absolute left-2 top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-black/75 px-2 text-[11px] font-black text-white">
          {index + 1}
        </div>
        {page.status === 'error' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-4 text-center text-[12px] font-bold leading-5 text-white">
            {page.error || 'Upload failed'}
          </div>
        ) : null}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className={`text-[11px] font-extrabold ${page.status === 'error' ? 'text-[#d92d20]' : 'text-[#344054]'}`}>
            {statusLabel}
          </div>
          <div className="text-[10px] font-bold text-[#98a2b3]">
            {page.fileSize ? formatFileSize(page.fileSize) : ''}
          </div>
        </div>

        {busy ? (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eaecf0]">
            <div className="h-full rounded-full bg-[#7c4dea] transition-all" style={{ width: `${page.progress || 5}%` }} />
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0 || disabled}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#f5f3fa] text-[#111827] disabled:opacity-35"
            aria-label="Move page up"
          >
            <i className="fa-solid fa-arrow-up text-[11px]" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1 || disabled}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#f5f3fa] text-[#111827] disabled:opacity-35"
            aria-label="Move page down"
          >
            <i className="fa-solid fa-arrow-down text-[11px]" />
          </button>
          <label className={`flex h-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#175cd3] ${disabled ? 'pointer-events-none opacity-35' : 'cursor-pointer'}`}>
            <i className="fa-solid fa-rotate text-[11px]" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={disabled}
              onChange={(event) => {
                onReplace(page.id, event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => onDelete(page.id)}
            disabled={busy}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#fff1f1] text-[#d92d20] disabled:opacity-35"
            aria-label="Delete page"
          >
            <i className="fa-solid fa-trash text-[11px]" />
          </button>
        </div>

        {page.status === 'error' ? (
          <button
            type="button"
            onClick={() => onRetry(page.id)}
            disabled={!page.sourceFile || disabled}
            className="mt-2 h-9 w-full rounded-[12px] bg-[#111827] text-[11px] font-extrabold text-white disabled:bg-[#98a2b3]"
          >
            Retry Upload
          </button>
        ) : null}
      </div>
    </div>
    </ImageDropZone>
  )
}

export default function EpisodeEditorPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const requestedType = searchParams.get('type') === 'manga' ? 'manga' : 'novel'
  const editEpisodeId = searchParams.get('editEpisodeId')
  const isEditMode = Boolean(editEpisodeId)
  const isFirstEpisode = searchParams.get('first') !== '0' && !isEditMode

  const [storyType, setStoryType] = useState(requestedType)
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeCover, setEpisodeCover] = useState('')
  const [originalCover, setOriginalCover] = useState('')
  const [coverChanged, setCoverChanged] = useState(false)
  const [tempCover, setTempCover] = useState('')
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [content, setContent] = useState('')
  const [mangaPages, setMangaPages] = useState([])
  const textareaRef = useRef(null)
  const [findReplaceOpen, setFindReplaceOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [cleanModalOpen, setCleanModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [oldEpisodeStatus, setOldEpisodeStatus] = useState('draft')
  const [episodeDetailsOpen, setEpisodeDetailsOpen] = useState(false)
  const [draftEpisodeTitle, setDraftEpisodeTitle] = useState('')
  const [draftEpisodeCover, setDraftEpisodeCover] = useState('')
  const [draftCoverChanged, setDraftCoverChanged] = useState(false)

  const isManga = storyType === 'manga'
  const characterCount = content.length
  const completedMangaPages = mangaPages.filter((page) => page.status === 'done')
  const mangaErrorCount = mangaPages.filter((page) => page.status === 'error').length
  const mangaUploadPending = mangaPages.some((page) => ['queued', 'processing', 'uploading'].includes(page.status))
  const pageTitle = isEditMode ? 'Edit Episode' : isFirstEpisode ? 'First Episode' : 'Episode'
  const stepTitle = isFirstEpisode ? 'First Episode' : 'Episode'

  const estimatedReadTime = useMemo(() => {
    const minutes = Math.max(1, Math.ceil(characterCount / 900))
    return `${minutes} min read`
  }, [characterCount])

  const warningText = useMemo(() => {
    if (isManga) {
      if (mangaErrorCount) return `${mangaErrorCount} page upload${mangaErrorCount > 1 ? 's' : ''} failed. Retry or remove them.`
      if (mangaUploadPending) return 'Pages are still being compressed and uploaded.'
      if (completedMangaPages.length < MANGA_MIN_PUBLISH_PAGES) {
        return `${completedMangaPages.length} / ${MANGA_MIN_PUBLISH_PAGES} pages required to continue`
      }
      return ''
    }

    if (characterCount === 0) return ''
    if (characterCount < MIN_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MIN_CHARACTERS.toLocaleString()} characters required to publish`
    }
    if (characterCount > MAX_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters. Please shorten this episode.`
    }
    return ''
  }, [characterCount, completedMangaPages.length, isManga, mangaErrorCount, mangaUploadPending])

  const isValidForNext =
    Boolean(episodeTitle.trim()) &&
    !loading &&
    !pageLoading &&
    (isManga
      ? completedMangaPages.length >= MANGA_MIN_PUBLISH_PAGES &&
        completedMangaPages.length <= MANGA_MAX_PAGES &&
        !mangaUploadPending &&
        mangaErrorCount === 0
      : characterCount >= MIN_CHARACTERS && characterCount <= MAX_CHARACTERS)

  const showToast = (text, duration = 2800) => {
    setToast(text)
    window.setTimeout(() => setToast(''), duration)
  }

  const markUnsaved = () => {
    setSaveStatus('Unsaved')
    setHasUnsavedChanges(true)
  }

  const updateMangaPage = (pageId, patch) => {
    setMangaPages((current) =>
      current.map((page) => (page.id === pageId ? { ...page, ...patch } : page))
    )
  }

  const processMangaPages = async (entries) => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    await runWithConcurrency(entries, 2, async (entry) => {
      try {
        updateMangaPage(entry.id, { status: 'processing', progress: 15, error: '' })
        const optimized = await optimizeMangaImage(entry.sourceFile)
        updateMangaPage(entry.id, {
          status: 'uploading',
          progress: 60,
          width: optimized.width,
          height: optimized.height,
          fileSize: optimized.fileSize,
          mimeType: optimized.mimeType,
        })

        const uploaded = await uploadMangaPageFile({
          token,
          file: optimized.file,
          storyId,
          pageId: entry.id,
        })

        updateMangaPage(entry.id, {
          status: 'done',
          progress: 100,
          imageUrl: uploaded.imageUrl,
          storagePath: uploaded.storagePath,
          width: optimized.width,
          height: optimized.height,
          fileSize: optimized.fileSize,
          mimeType: optimized.mimeType,
          error: '',
        })
      } catch (error) {
        updateMangaPage(entry.id, {
          status: 'error',
          progress: 0,
          error: error.message || 'Upload failed',
        })
      }
    })
  }

  useEffect(() => {
    let cancelled = false

    async function loadPageData() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setPageLoading(true)
        setMessage('')

        const storyResponse = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const storyData = await storyResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Failed to load story')
        }

        const resolvedType = storyData.story?.story_type === 'manga' ? 'manga' : 'novel'
        if (!cancelled) setStoryType(resolvedType)

        if (!isEditMode) return

        const episodeResponse = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/episodes/${editEpisodeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const episodeData = await episodeResponse.json().catch(() => ({}))

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || 'Failed to load episode')
        }

        if (cancelled) return

        const episode = episodeData.episode || {}
        const episodeType = episode.story_type === 'manga' || episodeData.story_type === 'manga' ? 'manga' : resolvedType

        setStoryType(episodeType)
        setEpisodeTitle(episode.title || '')
        setEpisodeCover(episode.cover_url || '')
        setOriginalCover(episode.cover_url || '')
        setContent(episode.content || '')
        setOldEpisodeStatus(episode.status || 'draft')
        setCoverChanged(false)
        setMangaPages(
          (episode.pages || []).map((page, index) => ({
            id: page.id || `existing-${index}`,
            previewUrl: page.image_url,
            imageUrl: page.image_url,
            storagePath: page.storage_path || null,
            width: page.width || null,
            height: page.height || null,
            fileSize: page.file_size || null,
            mimeType: page.mime_type || 'image/webp',
            sourceFile: null,
            status: 'done',
            progress: 100,
            error: '',
          }))
        )
        setSaveStatus('Saved')
        setHasUnsavedChanges(false)
      } catch (error) {
        if (!cancelled) setMessage(error.message || 'Failed to load episode')
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    }

    loadPageData()
    return () => {
      cancelled = true
    }
  }, [editEpisodeId, isEditMode, navigate, storyId])

  const handleContentChange = (event) => {
    setContent(event.target.value)
    markUnsaved()
  }

  const handleSmartReplaceContent = (nextContent) => {
    setContent(nextContent)
    markUnsaved()
    showToast('Text updated. Please review before saving.')
  }

  const handleConfirmCleanParagraphs = () => {
    const cleanedContent = cleanBrokenParagraphs(content)
    setCleanModalOpen(false)

    if (cleanedContent === content.trim()) {
      showToast('No broken paragraph spacing found.')
      return
    }

    setContent(cleanedContent)
    markUnsaved()
    showToast('Paragraphs cleaned. Please review before saving.')
  }

  const openEpisodeDetails = () => {
    setDraftEpisodeTitle(episodeTitle)
    setDraftEpisodeCover(episodeCover)
    setDraftCoverChanged(coverChanged)
    setEpisodeDetailsOpen(true)
  }

  const closeEpisodeDetails = () => {
    setDraftEpisodeTitle(episodeTitle)
    setDraftEpisodeCover(episodeCover)
    setDraftCoverChanged(coverChanged)
    setEpisodeDetailsOpen(false)
  }

  const saveEpisodeDetails = () => {
    const nextTitle = draftEpisodeTitle.trim()
    if (!nextTitle) return

    const detailsChanged =
      nextTitle !== episodeTitle ||
      draftEpisodeCover !== episodeCover ||
      draftCoverChanged !== coverChanged

    setEpisodeTitle(nextTitle)
    setEpisodeCover(draftEpisodeCover)
    setCoverChanged(draftCoverChanged)
    setEpisodeDetailsOpen(false)

    if (detailsChanged) markUnsaved()
  }

  const handleUndo = () => {
    const editor = textareaRef.current
    if (!editor) return
    editor.focus()
    document.execCommand('undo')
    setContent(editor.value)
    markUnsaved()
  }

  const handleRedo = () => {
    const editor = textareaRef.current
    if (!editor) return
    editor.focus()
    document.execCommand('redo')
    setContent(editor.value)
    markUnsaved()
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCoverChange = (file) => {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setOriginalCover(imageUrl)
    setTempCover(imageUrl)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setDraftCoverChanged(true)
    setCropOpen(true)
  }

  const handleSaveCoverCrop = async () => {
    if (!tempCover || !croppedAreaPixels) {
      showToast('Please adjust the cover first.')
      return
    }

    try {
      const croppedImage = await getCroppedImage(tempCover, croppedAreaPixels)
      setDraftEpisodeCover(croppedImage)
      setDraftCoverChanged(true)
      setCropOpen(false)
    } catch {
      showToast('Could not save crop. Please try another image.')
    }
  }

  const handlePickMangaPages = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return

    if (files.length > MANGA_MAX_FILES_PER_PICK) {
      showToast(`Choose no more than ${MANGA_MAX_FILES_PER_PICK} images each time.`)
      return
    }

    if (mangaPages.length + files.length > MANGA_MAX_PAGES) {
      showToast(`Manga episode can contain no more than ${MANGA_MAX_PAGES} pages.`)
      return
    }

    const errors = files.map(validateMangaFile).filter(Boolean)
    if (errors.length) {
      showToast(errors[0])
      return
    }

    const entries = files.map((file) => ({
      id: makeLocalId(),
      previewUrl: URL.createObjectURL(file),
      imageUrl: '',
      storagePath: null,
      width: null,
      height: null,
      fileSize: file.size,
      mimeType: file.type,
      sourceFile: file,
      status: 'queued',
      progress: 5,
      error: '',
    }))

    setMangaPages((current) => [...current, ...entries])
    markUnsaved()
    await processMangaPages(entries)
  }

  const handleReplaceMangaPage = async (pageId, file) => {
    if (!file) return
    const validationError = validateMangaFile(file)

    if (validationError) {
      showToast(validationError)
      return
    }

    const entry = {
      id: pageId,
      previewUrl: URL.createObjectURL(file),
      sourceFile: file,
    }

    setMangaPages((current) =>
      current.map((page) => {
        if (page.id !== pageId) return page
        if (String(page.previewUrl || '').startsWith('blob:')) URL.revokeObjectURL(page.previewUrl)
        return {
          ...page,
          ...entry,
          imageUrl: '',
          storagePath: null,
          fileSize: file.size,
          mimeType: file.type,
          status: 'queued',
          progress: 5,
          error: '',
        }
      })
    )

    markUnsaved()
    await processMangaPages([{ ...entry, status: 'queued' }])
  }

  const handleRetryMangaPage = async (pageId) => {
    const page = mangaPages.find((item) => item.id === pageId)
    if (!page?.sourceFile) {
      showToast('Choose a replacement image for this page.')
      return
    }

    updateMangaPage(pageId, { status: 'queued', progress: 5, error: '' })
    await processMangaPages([page])
  }

  const handleDeleteMangaPage = (pageId) => {
    setMangaPages((current) => {
      const page = current.find((item) => item.id === pageId)
      if (String(page?.previewUrl || '').startsWith('blob:')) URL.revokeObjectURL(page.previewUrl)
      return current.filter((item) => item.id !== pageId)
    })
    markUnsaved()
  }

  const handleMoveMangaPage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= mangaPages.length || fromIndex === toIndex) return

    setMangaPages((current) => {
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    markUnsaved()
  }

  const handleSaveEpisode = async ({ goToPublish = false, forceDraft = false } = {}) => {
    setMessage('')

    if (!episodeTitle.trim()) {
      setMessage('Please enter an episode title.')
      return null
    }

    if (isManga) {
      if (mangaUploadPending) {
        setMessage('Please wait until all manga pages finish uploading.')
        return null
      }

      if (mangaErrorCount) {
        setMessage('Retry or remove failed manga pages before saving.')
        return null
      }

      if (goToPublish && completedMangaPages.length < MANGA_MIN_PUBLISH_PAGES) {
        setMessage(`Manga episodes need at least ${MANGA_MIN_PUBLISH_PAGES} pages.`)
        return null
      }
    } else {
      if (goToPublish && !content.trim()) {
        setMessage('Please write some episode content.')
        return null
      }

      if (goToPublish && characterCount < MIN_CHARACTERS) {
        setMessage('Almost there! Episodes need at least 1,500 characters.')
        return null
      }

      if (characterCount > MAX_CHARACTERS) {
        setMessage('This episode is too long. Maximum is 30,000 characters.')
        return null
      }
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      throw new Error('Please login first.')
    }

    const episodeCoverUrl = episodeCover
      ? await uploadImageToStorage({
          token,
          imageDataUrl: episodeCover,
          folder: 'episode_cover',
          fileName: `episode-cover-${storyId}-${Date.now()}.jpg`,
        })
      : null

    const pagesPayload = completedMangaPages.map((page) => ({
      image_url: page.imageUrl,
      storage_path: page.storagePath,
      width: page.width,
      height: page.height,
      file_size: page.fileSize,
      mime_type: page.mimeType || 'image/webp',
    }))

    const response = await fetch(
      isEditMode
        ? `${API_BASE_URL}/api/stories/${storyId}/episodes/${editEpisodeId}`
        : `${API_BASE_URL}/api/stories/${storyId}/episodes/create`,
      {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: episodeTitle.trim(),
          cover_url: episodeCoverUrl,
          content: isManga ? '' : content,
          pages: isManga ? pagesPayload : undefined,
          is_adult: false,
          status: forceDraft ? 'draft' : isEditMode ? oldEpisodeStatus : 'draft',
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.error || data.message || (isEditMode ? 'Failed to update episode' : 'Failed to create episode'))
    }

    const episodeId = data.episode?.id || editEpisodeId

    if (!episodeId) {
      throw new Error(isEditMode ? 'Episode updated but episode id was missing' : 'Episode created but episode id was missing')
    }

    setSaveStatus('Saved')
    setHasUnsavedChanges(false)

    if (!goToPublish) {
      navigate(`/author/story/${storyId}/manage`)
    }

    return {
      episodeId,
      episodeNumber: data.episode?.episode_number || 1,
    }
  }

  const handleSaveDraft = async () => {
    try {
      setLoading(true)
      await handleSaveEpisode({ forceDraft: true })
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed or running.'
          : error.message || (isEditMode ? 'Failed to update episode' : 'Failed to save draft')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true)
      return
    }

    if (searchParams.get('fromPublishSuccess') === '1' || searchParams.get('fromPublishWarning') === '1') {
      navigate('/author/dashboard', { replace: true })
      return
    }

    navigate(`/author/story/${storyId}/manage`, { replace: true })
  }

  const handleDiscard = () => {
    setShowExitModal(false)

    if (searchParams.get('fromPublishSuccess') === '1' || searchParams.get('fromPublishWarning') === '1') {
      navigate('/author/dashboard', { replace: true })
      return
    }

    navigate(`/author/story/${storyId}/manage`, { replace: true })
  }

  const handleSaveDraftAndLeave = async () => {
    setShowExitModal(false)
    await handleSaveDraft()
  }

  const handleNext = async () => {
    try {
      setLoading(true)
      const saved = await handleSaveEpisode({ goToPublish: true })
      if (!saved) return

      const firstParam = isFirstEpisode && saved.episodeNumber === 1 ? '1' : '0'
      navigate(
        `/author/story/${storyId}/episode/publish?episodeId=${saved.episodeId}&first=${firstParam}&type=${storyType}`
      )
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed or running.'
          : error.message || (isEditMode ? 'Failed to update episode' : 'Failed to create episode')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
  <div
    className={`min-h-screen bg-white pb-[110px] sm:bg-[#fafafa] ${
      isManga ? 'manga-red-theme' : ''
    }`}
  >
    <style>{`
  .manga-red-theme button:not(:disabled)[class*="bg-[#111827]"],
  .manga-red-theme button:not(:disabled)[class*="bg-[#e5484d]"],
  .manga-red-theme label[class*="bg-[#111827]"] {
    background-color: #FE526E !important;
  }

  .manga-red-theme button[class*="text-[#0b5cff]"] {
    color: #FE526E !important;
  }

  .manga-red-theme input[type="range"] {
    accent-color: #FE526E;
  }

  .manga-red-theme
    button:not(:disabled)[class*="shadow-[0_14px_30px_rgba(17,24,39,0.25)]"] {
    box-shadow: 0 14px 30px rgba(254, 82, 110, 0.28) !important;
  }
`}</style>

    <Toast message={toast} onClose={() => setToast('')} />

      <EpisodeDetailsSheet
        open={episodeDetailsOpen}
        title={draftEpisodeTitle}
        cover={draftEpisodeCover}
        onTitleChange={setDraftEpisodeTitle}
        onCoverChange={handleCoverChange}
        onRemoveCover={() => {
          setDraftEpisodeCover('')
          setDraftCoverChanged(true)
        }}
        onClose={closeEpisodeDetails}
        onSave={saveEpisodeDetails}
      />

      <CropCoverModal
        open={cropOpen}
        image={tempCover}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={() => setCropOpen(false)}
        onSave={handleSaveCoverCrop}
      />

      <UnsavedChangesModal
        open={showExitModal}
        onKeepEditing={() => setShowExitModal(false)}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraftAndLeave}
      />

      {!isManga ? (
        <>
          <CleanParagraphsModal
            open={cleanModalOpen}
            onCancel={() => setCleanModalOpen(false)}
            onClean={handleConfirmCleanParagraphs}
          />
          <SmartFindReplacePanel
            open={findReplaceOpen}
            content={content}
            textareaRef={textareaRef}
            onClose={() => setFindReplaceOpen(false)}
            onReplace={handleSmartReplaceContent}
          />
        </>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[#f0f1f3] bg-white px-3 py-2.5">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-bold text-[#555b66]">
              {isManga
                ? `${completedMangaPages.length} pages`
                : `${characterCount.toLocaleString()} / ${MIN_CHARACTERS.toLocaleString()} characters`}
            </div>
            <div className="mt-0.5 text-[10px] text-[#8d94a1]">{saveStatus}</div>
          </div>

          {!isManga ? (
            <>
              <button
                type="button"
                onClick={handleUndo}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
                aria-label="Undo"
              >
                <i className="fa-solid fa-rotate-left text-[17px]" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#98a2b3] active:scale-95"
                aria-label="Redo"
              >
                <i className="fa-solid fa-rotate-right text-[17px]" />
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isValidForNext}
            className="ml-1 h-9 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:opacity-40"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-0 pt-0 sm:px-4 sm:pt-4">
        {isFirstEpisode ? (
  <section className="hidden rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5 sm:block">
    <div className="grid grid-cols-3 gap-2">
      <Step number="1" title={isManga ? 'Manga Info' : 'Story Info'} />
      <Step number="2" title={stepTitle} active />
      <Step number="3" title="Publish" />
    </div>
  </section>
) : null}

        {pageLoading ? (
          <section className="mx-4 mt-4 rounded-[12px] bg-white p-6 text-center shadow-sm sm:mx-0">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-bold text-[#667085]">Loading episode data...</div>
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[12px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d] sm:mx-0 sm:w-full"
          >
            {message}
          </button>
        ) : null}

        {!pageLoading ? (
  <>
    <div className="overflow-hidden bg-white sm:mt-4 sm:rounded-[12px] sm:shadow-sm md:contents">
      <section className="bg-white px-4 py-3 md:mt-4 md:rounded-[12px] md:shadow-sm">
        <button
          type="button"
          onClick={openEpisodeDetails}
          className="flex min-h-[54px] w-full items-center gap-3 border-b border-[#f0f1f3] text-left active:bg-[#fafafa]"
        >
          <div
            className={`min-w-0 flex-1 truncate text-[14px] font-bold ${
              episodeTitle ? 'text-[#111827]' : 'text-[#a5aab4]'
            }`}
          >
            {episodeTitle || 'Enter episode title'}
          </div>

          {episodeCover ? (
            <img
              src={episodeCover}
              alt=""
              className="h-9 w-16 shrink-0 rounded-[8px] object-cover"
            />
          ) : null}

          <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c4c8d1]" />
        </button>
      </section>

            {isManga ? (
              <section className="bg-white p-4 md:mt-4 md:rounded-[12px] md:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-extrabold text-[#111827]">Manga Pages</h2>
                    <p className="mt-1 text-[11px] leading-5 text-[#8d94a1]">
                      Choose up to 10 images each time. Maximum 2 MB per image and 100 pages per episode.
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                    {completedMangaPages.length}/{MANGA_MAX_PAGES}
                  </div>
                </div>

                <ImageDropZone
                  onFiles={handlePickMangaPages}
                  multiple
                  disabled={mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES}
                  className="mt-4 rounded-[20px]"
                  label="Drop manga pages here"
                >
                  <label
                    className={`flex min-h-[120px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center ${
                      mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES
                        ? 'pointer-events-none opacity-55'
                        : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                      <i className="fa-solid fa-images text-[17px]" />
                    </div>
                    <div className="mt-3 text-[13px] font-extrabold text-[#111827]">
                      {mangaUploadPending ? 'Uploading pages...' : 'Drop or Add Manga Pages'}
                    </div>
                    <div className="mt-1 text-[11px] text-[#8d94a1]">JPG, PNG, or WebP · Up to 10 each time</div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      disabled={mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES}
                      onChange={(event) => {
                        handlePickMangaPages(event.target.files)
                        event.target.value = ''
                      }}
                    />
                  </label>
                </ImageDropZone>

                {mangaPages.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {mangaPages.map((page, index) => (
                      <MangaPageCard
                        key={page.id}
                        page={page}
                        index={index}
                        total={mangaPages.length}
                        onMove={handleMoveMangaPage}
                        onDelete={handleDeleteMangaPage}
                        onReplace={handleReplaceMangaPage}
                        onRetry={handleRetryMangaPage}
                        disabled={mangaUploadPending}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[18px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
                    Drafts may be saved without pages. Add at least {MANGA_MIN_PUBLISH_PAGES} pages before continuing to Publish.
                  </div>
                )}

                {warningText ? (
                  <div className="mt-4 rounded-[16px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
                    {warningText}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[16px] bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold leading-5 text-[#16803c]">
                    Manga pages are ready. Use the arrows to confirm their reading order.
                  </div>
                )}
              </section>
            ) : (
              <section className="bg-white p-4 md:mt-4 md:rounded-[12px] md:shadow-sm">
                <div className="mb-3">
                  <h2 className="text-[15px] font-extrabold text-[#111827]">Write Episode</h2>
                  <p className="mt-0.5 text-[11px] text-[#8d94a1]">Edit text and save changes.</p>
                </div>

                <div className="mb-3 flex items-center gap-2 overflow-x-auto rounded-[12px] bg-[#fafafe] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <ToolButton icon="fa-solid fa-bold" label="Bold" />
                  <ToolButton icon="fa-solid fa-italic" label="Italic" />
                  <ToolButton icon="fa-solid fa-minus" label="Divider" />
                  <ToolButton icon="fa-regular fa-image" label="Insert image" />
                  <ToolButton
                    icon="fa-solid fa-wand-magic-sparkles"
                    label="Clean Paragraphs"
                    onClick={() => setCleanModalOpen(true)}
                  />
                  <ToolButton
                    icon="fa-solid fa-magnifying-glass"
                    label="Find & Replace"
                    onClick={() => setFindReplaceOpen(true)}
                  />
                </div>

                <div className="bg-white sm:rounded-[12px] sm:border sm:border-[#e5e7eb] sm:p-3">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    onBlur={() => setSaveStatus('Saved')}
                    placeholder="Start writing your episode..."
                    className="min-h-[calc(100vh-300px)] w-full resize-none bg-white px-0 py-4 text-[15px] leading-8 text-[#111827] outline-none sm:min-h-[520px] sm:rounded-[10px] sm:px-4"
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[12px] font-bold text-[#555b66]">
                    {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
                  </div>
                  <div className="text-[12px] font-bold text-[#8d94a1]">{estimatedReadTime}</div>
                </div>

                {warningText ? (
                  <div className="mt-3 rounded-[16px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
                    {warningText}
                  </div>
                ) : null}
              </section>
            )}
            </div>

            <section className="mx-4 mt-5 grid grid-cols-2 gap-3 pb-8 sm:mx-0">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading || mangaUploadPending}
                className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                {isEditMode ? 'Save Changes' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!isValidForNext}
                className="flex h-14 items-center justify-center rounded-full bg-[#111827] text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

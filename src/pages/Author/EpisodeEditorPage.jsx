import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Cropper from 'react-easy-crop'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const MIN_CHARACTERS = 1500
const MAX_CHARACTERS = 12000

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
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

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return imageSrc

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
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
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center overflow-hidden bg-black/50 px-4"
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <style>
        {`
          .episode-cropper-shell,
          .episode-cropper-shell * {
            -webkit-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
          }

          .episode-cropper-shell .reactEasyCrop_Container {
            touch-action: none !important;
            cursor: grab !important;
          }

          .episode-cropper-shell .reactEasyCrop_Container:active {
            cursor: grabbing !important;
          }

          .episode-cropper-shell .reactEasyCrop_Image,
          .episode-cropper-shell .reactEasyCrop_Video {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
            user-select: none !important;
          }

          .episode-cropper-shell .reactEasyCrop_CropArea {
            border: 2px solid rgba(255,255,255,0.95) !important;
            box-shadow: 0 0 0 9999em rgba(0,0,0,0.35) !important;
          }
        `}
      </style>

      <div className="episode-cropper-shell w-full max-w-[560px] rounded-[26px] bg-white p-4 shadow-2xl">
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

        <div
          className="relative h-[240px] touch-none overflow-hidden rounded-[20px] bg-[#111827] sm:h-[310px]"
          onDragStart={(event) => event.preventDefault()}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
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
            style={{
              containerStyle: {
                touchAction: 'none',
                cursor: 'grab',
              },
              mediaStyle: {
                userSelect: 'none',
                WebkitUserDrag: 'none',
                pointerEvents: 'none',
              },
              cropAreaStyle: {
                border: '2px solid rgba(255,255,255,0.95)',
              },
            }}
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

        <div className="mt-3 rounded-[16px] bg-[#f5f3fa] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#667085]">
          Tip: On computer, drag inside the crop box. On phone, drag with one finger and pinch to zoom.
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]"
          >
            Save Cover
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EpisodeEditorPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()

  const isFirstEpisode = searchParams.get('first') !== '0'
  const pageTitle = isFirstEpisode ? 'First Episode' : 'Episode'
  const stepTitle = isFirstEpisode ? 'First Episode' : 'Episode'

  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeCover, setEpisodeCover] = useState('')
  const [originalCover, setOriginalCover] = useState('')
  const [tempCover, setTempCover] = useState('')
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [toast, setToast] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const characterCount = content.length

  const estimatedReadTime = useMemo(() => {
    const minutes = Math.max(1, Math.ceil(characterCount / 900))
    return `${minutes} min read`
  }, [characterCount])

  const warningText = useMemo(() => {
    if (characterCount === 0) return ''
    if (characterCount < MIN_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MIN_CHARACTERS.toLocaleString()} characters required to publish`
    }
    if (characterCount > MAX_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters. Please shorten this episode.`
    }
    return ''
  }, [characterCount])

  const isValidForNext =
    characterCount >= MIN_CHARACTERS &&
    characterCount <= MAX_CHARACTERS &&
    episodeTitle.trim() &&
    !loading

  const showToast = (text, duration = 2600) => {
    setToast(text)
    window.setTimeout(() => setToast(''), duration)
  }

  const markUnsaved = () => {
    setSaveStatus('Unsaved')
    setHasUnsavedChanges(true)
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
    markUnsaved()
  }

  const handleTitleChange = (event) => {
    setEpisodeTitle(event.target.value)
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
    setCropOpen(true)
  }

  const handleSaveCoverCrop = async () => {
    if (!tempCover || !croppedAreaPixels) {
      showToast('Please adjust the cover first.')
      return
    }

    try {
      const croppedImage = await getCroppedImage(tempCover, croppedAreaPixels)
      setEpisodeCover(croppedImage)
      setCropOpen(false)
      markUnsaved()
    } catch {
      showToast('Could not save crop. Please try another image.')
    }
  }

  const handleEditCoverCrop = () => {
    if (!originalCover) return

    setTempCover(originalCover)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCropOpen(true)
  }

  const handleSaveDraft = () => {
    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    showToast('Draft saved.', 2200)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true)
      return
    }

    navigate(-1)
  }

  const handleDiscard = () => {
    setShowExitModal(false)
    navigate(-1)
  }

  const handleSaveDraftAndLeave = () => {
    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    setShowExitModal(false)
    navigate(-1)
  }

  const createRealEpisode = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      throw new Error('Please login first.')
    }

    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: episodeTitle.trim(),
        cover_url: episodeCover || null,
        content,
        is_adult: false,
        status: 'ready',
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to create episode')
    }

    const episodeId = data.episode?.id

    if (!episodeId) {
      throw new Error('Episode created but episode id was missing')
    }

    return {
      episodeId,
      episodeNumber: data.episode?.episode_number || 1,
    }
  }

  const handleNext = async () => {
    setMessage('')

    if (!episodeTitle.trim()) {
      setMessage('Please enter an episode title.')
      return
    }

    if (characterCount < MIN_CHARACTERS) {
      setMessage('Almost there! Episodes need at least 1,500 characters to publish.')
      return
    }

    if (characterCount > MAX_CHARACTERS) {
      setMessage('This episode is too long. Maximum is 12,000 characters.')
      return
    }

    try {
      setLoading(true)

      const { episodeId, episodeNumber } = await createRealEpisode()

      setSaveStatus('Saved')
      setHasUnsavedChanges(false)

      const firstParam = isFirstEpisode && episodeNumber === 1 ? '1' : '0'
      navigate(`/author/story/${storyId}/episode/publish?episodeId=${episodeId}&first=${firstParam}`)
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed or running.'
          : error.message || 'Failed to create episode'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <Toast message={toast} onClose={() => setToast('')} />

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

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">{pageTitle}</h1>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95 disabled:bg-[#9ca3af]"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-3 gap-2">
            <Step number="1" title="Story Info" />
            <Step number="2" title={stepTitle} active />
            <Step number="3" title="Publish" />
          </div>
        </section>

        {!isFirstEpisode ? (
          <section className="mt-4 rounded-[18px] bg-[#eff6ff] px-4 py-3 text-[12px] font-bold leading-5 text-[#0b5cff]">
            You are adding a new episode to this story. This episode can be published, scheduled, or saved as draft.
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mt-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
            Episode Title <span className="text-[#e5484d]">*</span>
          </label>

          <input
            value={episodeTitle}
            onChange={handleTitleChange}
            placeholder="Enter episode title"
            className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
          />

          <div className="mt-5">
            <div className="mb-2">
              <div className="text-[13px] font-extrabold text-[#111827]">Episode Cover</div>

              <div className="mt-0.5 text-[11px] leading-4 text-[#8d94a1]">
                Optional. If empty, story cover will be used.
              </div>

              <div className="mt-0.5 text-[11px] leading-4 text-[#8d94a1]">
                Recommended 16:9. Tap the image area to upload or adjust crop.
              </div>
            </div>

            {episodeCover ? (
              <button
                type="button"
                onClick={handleEditCoverCrop}
                className="block w-full cursor-pointer overflow-hidden rounded-[18px] border border-dashed border-[#cfd4df] bg-[#fafefe] text-left active:scale-[0.999]"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={episodeCover}
                    alt="Episode Cover"
                    className="h-full w-full object-cover"
                    draggable="false"
                    onDragStart={(event) => event.preventDefault()}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#eceaf2] bg-white px-4 py-3">
                  <div>
                    <div className="text-[12px] font-extrabold text-[#111827]">Cover saved</div>
                    <div className="mt-0.5 text-[11px] text-[#8d94a1]">Tap to adjust crop again</div>
                  </div>

                  <span className="rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-extrabold text-white">
                    Edit Crop
                  </span>
                </div>
              </button>
            ) : (
              <label className="block cursor-pointer overflow-hidden rounded-[18px] border border-dashed border-[#cfd4df] bg-[#fafafe]">
                <div className="aspect-[16/9] w-full">
                  <div className="flex h-full w-full items-center justify-center text-center">
                    <div>
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                        <i className="fa-regular fa-image text-[15px]" />
                      </div>

                      <div className="mt-3 text-[13px] font-extrabold text-[#111827]">
                        Tap to Upload Cover
                      </div>

                      <div className="mt-1 text-[11px] text-[#8d94a1]">
                        Drag to move, pinch or zoom to crop
                      </div>
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleCoverChange(event.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#111827]">Write Episode</h2>
              <p className="mt-0.5 text-[11px] text-[#8d94a1]">
                Auto save every 1 minute
              </p>
            </div>

            <div className="rounded-full bg-[#f5f3fa] px-3 py-1.5 text-[11px] font-extrabold text-[#555b66]">
              {saveStatus}
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[18px] bg-[#fafafe] p-2">
            <ToolButton icon="fa-solid fa-bold" label="Bold" />
            <ToolButton icon="fa-solid fa-italic" label="Italic" />
            <ToolButton icon="fa-solid fa-minus" label="Divider" />
            <ToolButton icon="fa-regular fa-image" label="Insert image" />
            <div className="mx-1 h-8 w-px bg-[#e5e7eb]" />
            <ToolButton icon="fa-solid fa-rotate-left" label="Undo" />
            <ToolButton icon="fa-solid fa-rotate-right" label="Redo" />
          </div>

          <div className="rounded-[20px] border border-[#d9dde6] bg-white p-3">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your episode..."
              className="min-h-[520px] w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-4 text-[15px] leading-8 text-[#111827] outline-none"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[12px] font-bold text-[#555b66]">
              {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
            </div>

            <div className="text-[12px] font-bold text-[#8d94a1]">
              {estimatedReadTime}
            </div>
          </div>

          {warningText ? (
            <div className="mt-3 rounded-[16px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
              {warningText}
            </div>
          ) : null}
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 pb-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex h-14 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[14px] font-extrabold text-[#111827] shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            Save Draft
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
      </main>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cropper from 'react-easy-crop'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const languages = ['Khmer', 'English', 'Chinese', 'Japanese', 'Korean']

const fallbackGenres = [
  'Romance',
  'Fantasy',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
]

const tagOptions = [
  'CEO',
  'Slow Burn',
  'Enemies to Lovers',
  'Time Travel',
  'Revenge',
  'Strong Female Lead',
  'Hidden Identity',
  'Royalty',
  'Magic',
  'Supernatural',
  'Second Chance',
  'Cold Male Lead',
]

const updateDayOptions = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' },
]

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

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">
      {children}
      {required ? <span className="ml-1 text-[#e5484d]">*</span> : null}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
    />
  )
}

function SelectInput(props) {
  return (
    <div className="relative">
      <select
        {...props}
        className="h-12 w-full appearance-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 pr-10 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
      />
      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#98a2b3]" />
    </div>
  )
}

function Toggle({ checked, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-[#e5484d]' : 'bg-[#d0d5dd]'}`}
      aria-label={label}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'left-7' : 'left-1'}`} />
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

function CropImageModal({
  open,
  title,
  helper,
  image,
  crop,
  zoom,
  aspect,
  cropMode,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center overflow-hidden bg-black/50 px-4"
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <style>
        {`
          .shadow-cropper-shell,
          .shadow-cropper-shell * {
            -webkit-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
          }

          .shadow-cropper-shell .reactEasyCrop_Container {
            touch-action: none !important;
            cursor: grab !important;
          }

          .shadow-cropper-shell .reactEasyCrop_Container:active {
            cursor: grabbing !important;
          }

          .shadow-cropper-shell .reactEasyCrop_Image,
          .shadow-cropper-shell .reactEasyCrop_Video {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
            user-select: none !important;
          }

          .shadow-cropper-shell .reactEasyCrop_CropArea {
            border: 2px solid rgba(255,255,255,0.95) !important;
            box-shadow: 0 0 0 9999em rgba(0,0,0,0.35) !important;
          }
        `}
      </style>

      <div className="shadow-cropper-shell w-full max-w-[560px] rounded-[26px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#111827]">{title}</h2>
            <p className="mt-1 text-[11px] leading-4 text-[#8d94a1]">{helper}</p>
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
  className={`relative mx-auto touch-none overflow-hidden rounded-[20px] bg-[#111827] ${
    cropMode === 'cover'
      ? 'h-[420px] w-[280px] max-w-full sm:h-[480px] sm:w-[320px]'
      : 'h-[280px] w-full sm:h-[360px]'
  }`}
  onDragStart={(event) => event.preventDefault()}
  onMouseDown={(event) => event.stopPropagation()}
  onTouchStart={(event) => event.stopPropagation()}
>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
            restrictPosition={false}
            objectFit="contain"
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
          Tip: Drag inside the frame to move. On phone, drag with one finger and pinch to zoom.
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
            Save Crop
          </button>
        </div>
      </div>
    </div>
  )
}

function GenreSheet({ open, value, options = fallbackGenres, loading = false, onClose, onSave }) {
  const [selected, setSelected] = useState(value || 'Romance')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open) setSelected(value || 'Romance')
  }, [open, value])

  if (!open) return null

  const visibleGenres = options.filter((genre) =>
  genre.toLowerCase().includes(search.trim().toLowerCase())
)
  return (
    <div className="fixed inset-0 z-[130] bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h2 className="text-[17px] font-extrabold text-[#111827]">Add Genre</h2>
          <button type="button" onClick={() => onSave(selected)} className="text-[14px] font-extrabold text-[#0b5cff]">
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex h-12 items-center rounded-full bg-[#f2f4f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Genre"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <div className="mb-5">
          <div className="text-[14px] font-extrabold text-[#111827]">Please select the genre that best represents your story.</div>
          <div className="mt-2 text-[12px] text-[#667085]">Only one genre can be selected.</div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
  {loading ? (
    <div className="rounded-[16px] bg-[#fafafe] px-4 py-4 text-[13px] font-bold text-[#8d94a1] ring-1 ring-[#eceaf2]">
      Loading genres...
    </div>
  ) : null}

  {!loading && visibleGenres.length === 0 ? (
    <div className="rounded-[16px] bg-[#fafafe] px-4 py-4 text-[13px] font-bold text-[#8d94a1] ring-1 ring-[#eceaf2]">
      No genres found.
    </div>
  ) : null}

  {!loading && visibleGenres.map((genre) => (

            <button
              key={genre}
              type="button"
              onClick={() => setSelected(genre)}
              className={`flex items-center gap-3 rounded-[16px] px-4 py-3 text-left text-[14px] font-bold ${
                selected === genre ? 'bg-[#111827] text-white' : 'bg-[#fafafe] text-[#111827] ring-1 ring-[#eceaf2]'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  selected === genre ? 'border-white bg-white text-[#111827]' : 'border-[#d0d5dd] bg-white'
                }`}
              >
                {selected === genre ? <i className="fa-solid fa-check text-[10px]" /> : null}
              </span>
              {genre}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

useEffect(() => {
  async function fetchGenres() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/genres`)
      const data = await response.json()

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load genres')
      }

      const names = (data.genres || []).map((item) => item.name).filter(Boolean)

      setGenreOptions(names)

      if (names.length && !names.includes(genre)) {
        setGenre(names[0])
      }
    } catch (error) {
      console.error('Fetch genres error:', error)
      setGenreOptions([
        'Romance',
        'Fantasy',
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
      ])
    }
  }

  fetchGenres()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

function TagSheet({ open, value, onClose, onSave }) {
  const [selected, setSelected] = useState(value || [])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open) setSelected(value || [])
  }, [open, value])

  if (!open) return null

  const visibleTags = tagOptions.filter((tag) => tag.toLowerCase().includes(search.trim().toLowerCase()))

  const toggleTag = (tag) => {
    setSelected((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag)
      if (current.length >= 6) return current
      return [...current, tag]
    })
  }

  const addCustom = () => {
    const tag = search.trim()
    if (!tag || selected.includes(tag) || selected.length >= 6) return
    setSelected((current) => [...current, tag])
    setSearch('')
  }

  return (
    <div className="fixed inset-0 z-[130] bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa]">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h2 className="text-[17px] font-extrabold text-[#111827]">Add Tags</h2>
          <button type="button" onClick={() => onSave(selected)} className="text-[14px] font-extrabold text-[#0b5cff]">
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-4 flex h-12 items-center rounded-full bg-[#f2f4f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Tag"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="text-[14px] font-extrabold text-[#111827]">Selected ({selected.length}/6)</div>
          <button
            type="button"
            onClick={addCustom}
            disabled={!search.trim() || selected.length >= 6}
            className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[#d0d5dd]"
          >
            + Custom
          </button>
        </div>

        {selected.length ? (
          <div className="mb-7 flex flex-wrap gap-2">
            {selected.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="rounded-full bg-[#111827] px-3 py-1.5 text-[12px] font-bold text-white"
              >
                {tag} ×
              </button>
            ))}
          </div>
        ) : null}

        <div className="mb-3 text-[14px] font-extrabold text-[#111827]">All Tags</div>
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${
                selected.includes(tag) ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

function getUpdateHintLabel(days) {
  if (!Array.isArray(days) || days.length === 0) return 'Irregular'
  if (days.length === 7) return 'Everyday'
  if (days.length === 1) return `Every ${days[0]}`
  if (days.length === 2) return days.join(', ')
  return `${days.length} days/week`
}

function toggleUpdateDay(currentDays, day) {
  if (currentDays.includes(day)) {
    return currentDays.filter((item) => item !== day)
  }

  return [...currentDays, day]
}

function SlideRow({ slide, index, onEdit, onDelete, onToggle }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[#eceaf2] bg-white p-3 shadow-sm">
      <button
        type="button"
        onClick={() => onEdit(index)}
        className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#111827]"
      >
        <img
          src={slide.cropped}
          alt={`Slide ${index + 1}`}
          className="h-full w-full object-cover"
          draggable="false"
          onDragStart={(event) => event.preventDefault()}
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-extrabold text-[#111827]">Slide {index + 1}</div>
        <div className="mt-1 text-[11px] text-[#8d94a1]">Tap image to edit crop</div>
      </div>

      <button type="button" onClick={() => onToggle(index)} className={`rounded-full px-3 py-1.5 text-[10.5px] font-extrabold ${slide.active ? 'bg-[#ecfdf3] text-[#16803c]' : 'bg-[#f2f4f7] text-[#667085]'}`}>
        {slide.active ? 'Active' : 'Inactive'}
      </button>

      <button type="button" onClick={() => onDelete(index)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
        <i className="fa-solid fa-trash text-[12px]" />
      </button>
    </div>
  )
}

export default function CreateStoryPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editStoryId = searchParams.get('editStoryId')
  const isEditMode = Boolean(editStoryId)

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Khmer')
  const [genre, setGenre] = useState('Romance')
  const [genreOptions, setGenreOptions] = useState([])
  const [tags, setTags] = useState([])
  const [updateDays, setUpdateDays] = useState([])
  const [description, setDescription] = useState('')
  const [isAdult, setIsAdult] = useState(false)
  const [originalAccepted, setOriginalAccepted] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)

  const [coverOriginal, setCoverOriginal] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [slides, setSlides] = useState([])

  const [genreOpen, setGenreOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  const [cropOpen, setCropOpen] = useState(false)
  const [cropMode, setCropMode] = useState('cover')
  const [editingSlideIndex, setEditingSlideIndex] = useState(null)
  const [tempImage, setTempImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('create_story_draft') || 'null')
    if (!saved) return

    setTitle(saved.title || '')
    setLanguage(saved.language || 'Khmer')
    setGenre(saved.genre || 'Romance')
    setTags(saved.tags || [])
    setDescription(saved.description || '')
    setIsAdult(!!saved.isAdult)
    setOriginalAccepted(!!saved.originalAccepted)
    setAgreementAccepted(!!saved.agreementAccepted)
  }, [])

  const descriptionCount = description.length
  const canCreate = title.trim() && genre && originalAccepted && agreementAccepted && descriptionCount <= 5000 && !loading

  const showToast = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2400)
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const openCropper = ({ mode, image, slideIndex = null }) => {
    setCropMode(mode)
    setEditingSlideIndex(slideIndex)
    setTempImage(image)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setCropOpen(true)
  }

  const handleCoverChange = (file) => {
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setCoverOriginal(imageUrl)
    openCropper({
      mode: 'cover',
      image: imageUrl,
    })
  }

  const handleEditCoverCrop = () => {
    if (!coverOriginal) return

    openCropper({
      mode: 'cover',
      image: coverOriginal,
    })
  }

  const handleAddSlide = (file) => {
    if (!file) return

    if (slides.length >= 5) {
      showToast('Maximum 5 slides allowed.')
      return
    }

    const imageUrl = URL.createObjectURL(file)
    openCropper({
      mode: 'slide',
      image: imageUrl,
      slideIndex: null,
    })
  }

  const handleEditSlideCrop = (index) => {
    const slide = slides[index]
    if (!slide?.original) return

    openCropper({
      mode: 'slide',
      image: slide.original,
      slideIndex: index,
    })
  }

  const handleSaveCrop = async () => {
    if (!tempImage || !croppedAreaPixels) {
      showToast('Please adjust the image first.')
      return
    }

    try {
      const croppedImage = await getCroppedImage(tempImage, croppedAreaPixels)

      if (cropMode === 'cover') {
        setCoverPreview(croppedImage)
        setCropOpen(false)
        return
      }

      if (cropMode === 'slide') {
        if (editingSlideIndex === null) {
          setSlides((current) => [
            ...current,
            {
              id: Date.now(),
              original: tempImage,
              cropped: croppedImage,
              active: true,
            },
          ])
        } else {
          setSlides((current) =>
            current.map((slide, index) =>
              index === editingSlideIndex
                ? {
                    ...slide,
                    cropped: croppedImage,
                  }
                : slide
            )
          )
        }

        setCropOpen(false)
      }
    } catch {
      showToast('Could not save crop. Please try another image.')
    }
  }

  const handleDeleteSlide = (index) => {
    setSlides((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleToggleSlide = (index) => {
    setSlides((current) =>
      current.map((slide, itemIndex) => (itemIndex === index ? { ...slide, active: !slide.active } : slide))
    )
  }

  const uploadStoryImages = async (token) => {
    const coverUrl = coverPreview
      ? await uploadImageToStorage({
          token,
          imageDataUrl: coverPreview,
          folder: 'story_cover',
          fileName: `story-cover-${Date.now()}.jpg`,
        })
      : null

    const uploadedSlides = []

    for (let index = 0; index < slides.length; index += 1) {
      const slide = slides[index]

      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: slide.cropped,
        folder: 'story_slide',
        fileName: `story-slide-${index + 1}-${Date.now()}.jpg`,
      })

      uploadedSlides.push({
        image_url: imageUrl,
        sort_order: index,
        is_active: slide.active,
      })
    }

    return {
      coverUrl,
      uploadedSlides,
    }
  }

  const handleCreateStory = async () => {
    setMessage('')

    if (!title.trim()) {
      setMessage('Please enter your story title.')
      return
    }

    if (!originalAccepted || !agreementAccepted) {
      setMessage('Please confirm the rights and author agreement.')
      return
    }

    if (descriptionCount > 5000) {
      setMessage('Description is too long. Maximum is 5000 characters.')
      return
    }

    const token = getAuthToken()

    if (!token) {
      setMessage('Please login first.')
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const { coverUrl, uploadedSlides } = await uploadStoryImages(token)

      const response = await fetch(`${API_BASE_URL}/api/stories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          story_language: language,
          main_genre: genre,
          tags,
          update_days: updateDays,
          description: description.trim() || null,
          is_adult: isAdult,
          cover_url: coverUrl,
          slides: uploadedSlides,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create story')
      }

      const storyId = data.story?.id

      if (!storyId) {
        throw new Error('Story created but story id was missing')
      }

      localStorage.removeItem('create_story_draft')

      navigate(`/author/story/${storyId}/episode/create`)
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed.'
          : error.message || 'Failed to create story'
      )
    } finally {
      setLoading(false)
    }
  }

  const cropAspect = cropMode === 'cover' ? 2 / 3 : 16 / 9
  const cropTitle = cropMode === 'cover' ? 'Crop Book Cover' : 'Crop Story Slide'
  const cropHelper =
    cropMode === 'cover'
      ? 'Drag the image to fit the vertical 2:3 book cover.'
      : 'Drag the image to fit the 16:9 story slide.'

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <Toast message={toast} onClose={() => setToast('')} />

      <CropImageModal
        open={cropOpen}
        title={cropTitle}
        helper={cropHelper}
        image={tempImage}
        crop={crop}
        zoom={zoom}
        aspect={cropAspect}
        cropMode={cropMode}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={() => setCropOpen(false)}
        onSave={handleSaveCrop}
      />

      <GenreSheet
  open={genreOpen}
  value={genre}
  options={genreOptions}
  onClose={() => setGenreOpen(false)}
  onSave={(value) => {
    setGenre(value)
    setGenreOpen(false)
  }}
/>

      <TagSheet
        open={tagOpen}
        value={tags}
        onClose={() => setTagOpen(false)}
        onSave={(value) => {
          setTags(value)
          setTagOpen(false)
        }}
      />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95" aria-label="Go back">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">
  {isEditMode ? 'Edit Story' : 'Create Story'}
</h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {!isEditMode ? (
  <section className="rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5">
    <div className="grid grid-cols-3 gap-2">
      <Step number="1" title="Story Info" active />
      <Step number="2" title="First Episode" />
      <Step number="3" title="Publish" />
    </div>
  </section>
) : null}

        {message ? (
          <button type="button" onClick={() => setMessage('')} className="mt-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
            {message}
          </button>
        ) : null}

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FieldLabel required>Book Cover</FieldLabel>

          <div className="grid grid-cols-[112px_1fr] gap-3">
            {coverPreview ? (
              <button
                type="button"
                onClick={handleEditCoverCrop}
                className="block aspect-[2/3] overflow-hidden rounded-[18px] border border-dashed border-[#cfd4df] bg-[#fafafe]"
              >
                <img
                  src={coverPreview}
                  alt="Book Cover"
                  className="h-full w-full object-cover"
                  draggable="false"
                  onDragStart={(event) => event.preventDefault()}
                />
              </button>
            ) : (
              <label className="flex aspect-[2/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center">
                <div className="px-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                    <i className="fa-solid fa-upload text-[14px]" />
                  </div>
                  <div className="mt-2 text-[12px] font-extrabold text-[#111827]">Tap Cover</div>
                  <div className="mt-1 text-[10.5px] text-[#8d94a1]">2:3 crop</div>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handleCoverChange(event.target.files?.[0] || null)} />
              </label>
            )}

            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">Story Slides ({slides.length}/5)</div>
                  <div className="mt-0.5 text-[11px] text-[#8d94a1]">Optional, 16:9 crop preview</div>
                </div>

                <label className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-extrabold ${
                  slides.length >= 5 ? 'bg-[#e5e7eb] text-[#98a2b3]' : 'bg-[#111827] text-white'
                }`}>
                  + Add
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={slides.length >= 5}
                    onChange={(event) => {
                      handleAddSlide(event.target.files?.[0] || null)
                      event.target.value = ''
                    }}
                  />
                </label>
              </div>

              {slides.length ? (
                <div className="space-y-2">
                  {slides.map((slide, index) => (
                    <SlideRow
                      key={slide.id}
                      slide={slide}
                      index={index}
                      onEdit={handleEditSlideCrop}
                      onDelete={handleDeleteSlide}
                      onToggle={handleToggleSlide}
                    />
                  ))}
                </div>
              ) : (
                <label className="flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                    <i className="fa-solid fa-images text-[15px]" />
                  </div>
                  <div className="mt-3 text-[13px] font-extrabold text-[#111827]">Add Story Slide</div>
                  <div className="mt-1 text-[11px] text-[#8d94a1]">Drag / pinch / zoom crop</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      handleAddSlide(event.target.files?.[0] || null)
                      event.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-[16px] bg-[#fafafe] px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#8d94a1]">
            Cover uses 2:3 vertical crop. Slides use 16:9 crop. Tap an image again to adjust crop.
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <FieldLabel required>Story Title</FieldLabel>
          <TextInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter story title" />

          <div className="mt-5">
            <FieldLabel required>Story Language</FieldLabel>
            <SelectInput value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </SelectInput>
            <p className="mt-2 text-[11.5px] font-medium text-[#8d94a1]">
              Choose the language used inside your story.
            </p>
          </div>

          <div className="mt-5">
            <FieldLabel required>Main Genre</FieldLabel>
            <button type="button" onClick={() => setGenreOpen(true)} className="flex h-12 w-full items-center justify-between rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-left text-[14px] font-semibold text-[#111827]">
              {genre || 'Choose genre'}
              <i className="fa-solid fa-chevron-right text-[12px] text-[#98a2b3]" />
            </button>
          </div>

          <div className="mt-5">
            <FieldLabel>Tags</FieldLabel>
            <button type="button" onClick={() => setTagOpen(true)} className="min-h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-left text-[14px] text-[#111827]">
              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#111827] px-2.5 py-1 text-[11px] font-bold text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="font-semibold text-[#98a2b3]">Select up to 6 tags</span>
              )}
            </button>
          </div>

          <div className="mt-5">
            <FieldLabel>Update Hint</FieldLabel>
            <div className="rounded-[18px] bg-[#fafafe] px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-extrabold text-[#111827]">Updates: {getUpdateHintLabel(updateDays)}</div>
                  <div className="mt-0.5 text-[11px] leading-4 text-[#8d94a1]">
                    Display only. This does not schedule posts.
                  </div>
                </div>

                {updateDays.length ? (
                  <button
                    type="button"
                    onClick={() => setUpdateDays([])}
                    className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#667085] ring-1 ring-[#eceaf2]"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {updateDayOptions.map((day) => {
                  const active = updateDays.includes(day.value)

                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => setUpdateDays((current) => toggleUpdateDay(current, day.value))}
                      className={`h-10 rounded-full text-[12px] font-extrabold transition active:scale-95 ${
                        active
                          ? 'bg-[#111827] text-white'
                          : 'bg-white text-[#555b66] ring-1 ring-[#eceaf2]'
                      }`}
                    >
                      {day.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-[18px] bg-[#fafafe] px-4 py-3">
            <div>
              <div className="text-[13px] font-extrabold text-[#111827]">18+ Story</div>
              <div className="mt-0.5 text-[11px] text-[#8d94a1]">Whole story is adult-only</div>
            </div>
            <Toggle checked={isAdult} onClick={() => setIsAdult((value) => !value)} label="Toggle 18+ story" />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <FieldLabel>Description</FieldLabel>
            <div className={`text-[11px] font-bold ${descriptionCount > 5000 ? 'text-[#e5484d]' : 'text-[#8d94a1]'}`}>
              {descriptionCount}/5000
            </div>
          </div>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a strong story summary. Recommended 400–1200 characters."
            className="min-h-[180px] w-full resize-none rounded-[18px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] leading-6 text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white focus:shadow-[0_0_0_4px_rgba(17,24,39,0.06)]"
          />
        </section>

        <section className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-[18px] bg-white p-4 text-[12px] font-semibold leading-5 text-[#555b66] shadow-sm ring-1 ring-black/5">
            <input type="checkbox" checked={originalAccepted} onChange={(event) => setOriginalAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d1d5db] accent-[#111827]" />
            <span>I confirm this story is my original work and I have the right to publish it.</span>
          </label>

          <label className="flex items-start gap-3 rounded-[18px] bg-white p-4 text-[12px] font-semibold leading-5 text-[#555b66] shadow-sm ring-1 ring-black/5">
            <input type="checkbox" checked={agreementAccepted} onChange={(event) => setAgreementAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d1d5db] accent-[#111827]" />
            <span>
              I agree to the{' '}
              <button
                type="button"
                onClick={() => {
                  window.open('/author/agreement', '_blank', 'noopener,noreferrer')
                }}
                className="font-extrabold text-[#0b5cff]"
              >
                Shadow Author Agreement.
              </button>
            </span>
          </label>
        </section>

        <section className="mt-5 pb-8">
          <button
            type="button"
            onClick={handleCreateStory}
            disabled={!canCreate}
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#111827] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.25)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9ca3af] disabled:opacity-100"
          >
            {loading ? 'Uploading & Creating...' : 'Create Story'}
          </button>
        </section>
      </main>
    </div>
  )
}

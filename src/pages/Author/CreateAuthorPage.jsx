import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function cleanUsername(value) {
  return String(value || '').replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')
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

  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

  return canvas.toDataURL('image/jpeg', 0.92)
}

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload image')
  }

  return data.image_url || data.imageUrl
}

function CropImageModal({ open, image, crop, zoom, croppedAreaPixels, onCropChange, onZoomChange, onCropComplete, onClose, onSave }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/50 px-4">
      <style>
        {`
          .author-cropper-shell,
          .author-cropper-shell * {
            -webkit-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
          }

          .author-cropper-shell .reactEasyCrop_Container {
            touch-action: none !important;
            cursor: grab !important;
          }

          .author-cropper-shell .reactEasyCrop_Container:active {
            cursor: grabbing !important;
          }

          .author-cropper-shell .reactEasyCrop_Image,
          .author-cropper-shell .reactEasyCrop_Video {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
            user-select: none !important;
          }

          .author-cropper-shell .reactEasyCrop_CropArea {
            border: 2px solid rgba(255,255,255,0.95) !important;
            box-shadow: 0 0 0 9999em rgba(0,0,0,0.35) !important;
          }
        `}
      </style>

      <div className="author-cropper-shell w-full max-w-[520px] rounded-[26px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#111827]">Crop Profile Photo</h2>
            <p className="mt-1 text-[11.5px] leading-4 text-[#8d94a1]">Drag and zoom to fit your author avatar.</p>
          </div>

          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="relative mx-auto h-[300px] w-[300px] max-w-full overflow-hidden rounded-full bg-[#111827]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { touchAction: 'none', cursor: 'grab' },
              mediaStyle: { userSelect: 'none', WebkitUserDrag: 'none', pointerEvents: 'none' },
            }}
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[#555b66]">
            <span>Zoom</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(event) => onZoomChange(Number(event.target.value))} className="w-full accent-[#111827]" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(croppedAreaPixels)} className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]">
            Save Crop
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CreateAuthorPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
  const [bio, setBio] = useState('')
  const [authorPage, setAuthorPage] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarCropped, setAvatarCropped] = useState('')
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [rawImage, setRawImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/authors/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ page_name: pageName, page_username: pageUsername, bio }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to create author page')
      }

      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      setAuthorPage(data.author_page)
      setStep(2)
    } catch (error) {
      setMessage(error.message || 'Failed to create author page')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      setRawImage(result)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveCrop = async (pixels) => {
    try {
      const cropped = await getCroppedImage(rawImage, pixels)
      setAvatarCropped(cropped)
      setAvatarPreview(cropped)
      setCropModalOpen(false)
    } catch (error) {
      setMessage('Failed to crop image')
    }
  }

  const handleSaveAvatar = async () => {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!avatarCropped) {
      setMessage('Please upload a profile photo or skip for now')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: avatarCropped,
        folder: 'author-profiles',
        fileName: `author-profile-${Date.now()}.jpg`,
      })

      const response = await fetch(`${API_BASE_URL}/api/authors/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_url: imageUrl }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save profile photo')
      }

      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      navigate('/author/dashboard')
    } catch (error) {
      setMessage(error.message || 'Failed to save profile photo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] px-4 py-6 pb-[110px]">
      <CropImageModal
        open={cropModalOpen}
        image={rawImage}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onClose={() => setCropModalOpen(false)}
        onSave={handleSaveCrop}
      />

      <div className="mx-auto max-w-[520px]">
        <button type="button" onClick={() => (step === 2 ? setStep(1) : navigate('/event'))} className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95" aria-label="Go back">
          <i className="fas fa-chevron-left text-[14px]" />
        </button>

        <section className="rounded-[22px] bg-white px-5 py-7 shadow-sm ring-1 ring-black/5">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className={`h-2.5 w-10 rounded-full ${step === 1 ? 'bg-[#111827]' : 'bg-[#d0d5dd]'}`} />
            <div className={`h-2.5 w-10 rounded-full ${step === 2 ? 'bg-[#111827]' : 'bg-[#d0d5dd]'}`} />
          </div>

          {step === 1 ? (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                  <i className="fas fa-pen-nib text-[24px]" />
                </div>
                <h1 className="text-[24px] font-extrabold text-[#111827]">Create Author Page</h1>
                <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#8d94a1]">Build your public writing page. Your display name can use any language.</p>
              </div>

              {message ? <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">{message}</div> : null}

              <form onSubmit={handleSubmit} className="mt-6">
                <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Page Name</label>
                <input type="text" value={pageName} onChange={(event) => setPageName(event.target.value)} placeholder="Enter your public author name" className="mb-4 h-12 w-full rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white" />

                <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Page Username</label>
                <div className="mb-2 flex h-12 w-full items-center rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] px-4 transition focus-within:border-[#111827] focus-within:bg-white">
                  <span className="mr-1 text-[14px] font-bold text-[#8d94a1]">@</span>
                  <input type="text" value={pageUsername} onChange={(event) => setPageUsername(cleanUsername(event.target.value))} placeholder="your_author_username" className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none" />
                </div>

                <p className="mb-4 text-[11px] leading-5 text-[#8d94a1]">English only. Use letters, numbers, and underscore. Same page name is allowed, but page username must be unique.</p>

                <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Bio (Optional)</label>
                <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell readers about your writing" rows={3} className="mb-5 w-full resize-none rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] px-4 py-3 text-[14px] text-[#111827] outline-none transition focus:border-[#111827] focus:bg-white" />

                <p className="mb-5 text-center text-[12px] font-medium text-[#555]">Step into greatness — unleash your potential</p>

                <button type="submit" disabled={loading} className="mx-auto flex h-12 w-full items-center justify-center rounded-[14px] bg-black px-6 text-[14px] font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition hover:bg-[#1b1b1b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Page'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#f5f3fa] text-[#111827] ring-1 ring-[#eceaf2]">
                  {avatarPreview ? <img src={avatarPreview} alt="Author profile preview" className="h-full w-full object-cover" /> : <i className="fa-solid fa-user-pen text-[26px]" />}
                </div>
                <h1 className="text-[24px] font-extrabold text-[#111827]">Add Profile Photo</h1>
                <p className="mx-auto mt-2 max-w-[330px] text-[12px] leading-5 text-[#8d94a1]">Make your author page look more trustworthy. You can skip this and add it later.</p>
                {authorPage?.page_username ? <div className="mt-3 text-[12px] font-bold text-[#555b66]">@{authorPage.page_username}</div> : null}
              </div>

              {message ? <div className="mt-5 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">{message}</div> : null}

              <div className="mt-6">
                <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[14px] border border-[#e5e7eb] bg-[#f7f7f8] text-[13px] font-extrabold text-[#111827] active:scale-[0.99]">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <i className="fa-solid fa-image mr-2 text-[14px]" />
                  Upload Photo
                </label>

                <button type="button" onClick={handleSaveAvatar} disabled={loading || !avatarCropped} className="mt-4 flex h-12 w-full items-center justify-center rounded-[14px] bg-black px-6 text-[14px] font-bold text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Photo'}
                </button>

                <button type="button" onClick={() => navigate('/author/dashboard')} disabled={loading} className="mt-3 flex h-12 w-full items-center justify-center rounded-[14px] bg-white px-6 text-[14px] font-extrabold text-[#111827] ring-1 ring-[#e5e7eb] transition active:scale-[0.99] disabled:opacity-60">
                  Skip for now
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}

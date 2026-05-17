import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cropper from 'react-easy-crop'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
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

  return canvas.toDataURL('image/jpeg', 0.92)
}

function DropdownMenu({ items, align = 'right' }) {
  return (
    <div
      className={`absolute top-9 z-40 w-44 overflow-hidden rounded-[16px] border border-[#eceaf2] bg-white shadow-[0_18px_40px_rgba(17,24,39,0.14)] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`flex w-full items-center px-4 py-3 text-left text-[13px] font-bold transition hover:bg-[#f7f7fb] ${
            item === 'Delete' || item === 'Report' || item === 'Block'
              ? 'text-[#e5484d]'
              : 'text-[#111827]'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[15px] font-extrabold leading-none text-[#111827]">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-[#111827]">{label}</div>
    </div>
  )
}

function HighlightCircle({ title, isAdd = false }) {
  return (
    <button type="button" className="shrink-0 text-center">
      <div
        className={`mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full ${
          isAdd ? 'border border-dashed border-[#cfd3dc] bg-white' : 'bg-[#e5e5e8]'
        }`}
      >
        {isAdd ? <i className="fas fa-plus text-[18px] text-[#8d94a1]" /> : null}
      </div>
      <div className="mt-2 text-[11px] font-semibold text-[#111827]">{title}</div>
    </button>
  )
}

function AvatarImage({ profile, sizeClass = 'h-[92px] w-[92px] md:h-[96px] md:w-[96px]' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[34px] font-extrabold text-white ring-2 ring-[#f6b800] ${sizeClass}`}>
      {profile.avatarUrl ? (
        <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
      ) : (
        profile.avatarLetter
      )}
    </div>
  )
}

function AvatarCropModal({
  open,
  profile,
  image,
  preview,
  crop,
  zoom,
  croppedAreaPixels,
  loading,
  message,
  onFileChange,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onSaveCrop,
  onSaveProfile,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] overflow-y-auto bg-black/50 px-4 pb-[150px] pt-4">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] items-start justify-center">
        <div className="w-full rounded-[26px] bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[#111827]">Edit Profile Photo</h2>
              <p className="mt-1 text-[11px] leading-4 text-[#8d94a1]">Upload, crop, then save your reader profile photo.</p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
              aria-label="Close editor"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          {image ? (
            <>
              <div className="relative mx-auto h-[min(78vw,360px)] max-h-[360px] min-h-[260px] w-full overflow-hidden rounded-[22px] bg-[#111827]">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                  restrictPosition={false}
                  objectFit="contain"
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

              <button
                type="button"
                onClick={() => onSaveCrop(croppedAreaPixels)}
                className="mt-4 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]"
              >
                Save Crop
              </button>
            </>
          ) : (
            <div className="rounded-[22px] bg-[#fafafe] p-5 text-center ring-1 ring-[#eceaf2]">
              <div className="mx-auto mb-4 flex justify-center">
                <AvatarImage profile={{ ...profile, avatarUrl: preview || profile.avatarUrl }} sizeClass="h-[116px] w-[116px] text-[40px]" />
              </div>

              <p className="mx-auto max-w-[280px] text-[12px] leading-5 text-[#8d94a1]">
                Tap upload to choose a photo. Your old photo will stay until you press Save.
              </p>
            </div>
          )}

          {preview && !image ? (
            <div className="mt-4 rounded-[22px] bg-[#fafafe] p-4 text-center ring-1 ring-[#eceaf2]">
              <div className="mx-auto h-[116px] w-[116px] overflow-hidden rounded-full bg-[#111827] ring-2 ring-[#f6b800]">
                <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 text-[12px] font-bold text-[#667085]">Preview ready</div>
            </div>
          ) : null}

          <label className="mt-4 flex h-12 cursor-pointer items-center justify-center rounded-full border border-[#d0d5dd] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]">
            <i className="fa-regular fa-image mr-2 text-[14px]" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                onFileChange(event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSaveProfile}
              disabled={loading || !preview}
              className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:bg-[#9ca3af]"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditProfileModal({
  open,
  profile,
  form,
  loading,
  message,
  onChange,
  onClose,
  onOpenAvatar,
  onSave,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[170] overflow-y-auto bg-black/50 px-4 pb-[150px] pt-4">
      <div className="mx-auto flex min-h-full w-full max-w-[520px] items-start justify-center">
        <div className="w-full rounded-[26px] bg-white p-4 shadow-2xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[#111827]">Edit Profile</h2>
              <p className="mt-1 text-[11px] leading-4 text-[#8d94a1]">Update your reader profile information.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
              aria-label="Close profile editor"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onOpenAvatar}
            className="mb-5 flex w-full items-center gap-4 rounded-[22px] bg-[#fafafe] p-4 text-left ring-1 ring-[#eceaf2] active:scale-[0.99]"
          >
            <AvatarImage profile={profile} sizeClass="h-[70px] w-[70px] text-[28px]" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold text-[#111827]">Change Profile Photo</div>
              <div className="mt-1 text-[11px] leading-4 text-[#8d94a1]">Upload and crop a new photo.</div>
            </div>
            <i className="fa-solid fa-chevron-right text-[12px] text-[#98a2b3]" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Display Name</label>
              <input
                value={form.name}
                onChange={(event) => onChange('name', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Work / Job</label>
              <input
                value={form.work}
                onChange={(event) => onChange('work', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
                placeholder="Author and accountant"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Bio</label>
              <textarea
                value={form.bio}
                onChange={(event) => onChange('bio', event.target.value)}
                className="min-h-[96px] w-full resize-none rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 py-3 text-[14px] leading-6 text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
                placeholder="Turn the impossible into reality."
                maxLength={180}
              />
              <div className="mt-1 text-right text-[11px] font-bold text-[#98a2b3]">{form.bio.length}/180</div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[#111827]">Location</label>
              <input
                value={form.location}
                onChange={(event) => onChange('location', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[#e5e7eb] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none focus:border-[#111827] focus:bg-white"
                placeholder="Based in KPS"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:bg-[#9ca3af]"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ profile, text, imageTone = '#e5e5e8', time = 'Yesterday at 10:22 AM', menuItems }) {
  const [postMenuOpen, setPostMenuOpen] = useState(false)

  return (
    <article className="bg-white md:overflow-hidden md:rounded-[24px] md:border md:border-[#eceaf2] md:shadow-sm">
      <div className="flex items-start justify-between px-4 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <AvatarImage profile={profile} sizeClass="h-12 w-12 text-[18px]" />

          <div className="min-w-0">
            <div className="line-clamp-1 text-[14px] font-extrabold text-[#111827]">
              {profile.name}
            </div>
            <div className="mt-1 text-[11px] text-[#8d94a1]">{time}</div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPostMenuOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-[#f5f3fa]"
          >
            <i className="fas fa-ellipsis-v text-[14px]" />
          </button>

          {postMenuOpen ? <DropdownMenu items={menuItems} /> : null}
        </div>
      </div>

      <p className="px-4 pt-4 text-[13px] leading-5 text-[#111827]">{text}</p>

      <div className="mt-4 aspect-square w-full" style={{ backgroundColor: imageTone }} />

      <div className="flex items-center gap-5 px-4 py-3 text-[11px] text-[#111827]">
        <span>
          <i className="far fa-heart mr-1" />
          198
        </span>
        <span>
          <i className="far fa-comment mr-1" />
          32
        </span>
        <span>
          <i className="fas fa-retweet mr-1" />
          25
        </span>
        <span className="ml-auto">😍 🙂 😊</span>
      </div>
    </article>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [user, setUser] = useState(getStoredUser())
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [rawAvatarImage, setRawAvatarImage] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    work: user?.work || '',
    location: user?.location || '',
  })

  const isOwnProfile = true

  const profile = useMemo(() => {
    return {
      name: user?.name || 'Reader Name',
      username: user?.username || 'username',
      avatarLetter: (user?.name || 'R').charAt(0).toUpperCase(),
      avatarUrl: avatarPreview || user?.avatar_url || '',
      posts: '03',
      followers: '500',
      following: '100',
      bioTitle: user?.work || 'Add your work / job',
      bio: user?.bio || 'Add your bio',
      location: user?.location || 'Add your location',
    }
  }, [avatarPreview, user])

  const profileMenuItems = ['Copy link', 'Report', 'Block']
  const postMenuItems = isOwnProfile ? ['Edit', 'Delete', 'Hide'] : ['Report', 'Block', 'Hide']

  const demoPosts = [
    {
      id: 1,
      text: 'Hello everyone!',
      time: 'Yesterday at 10:22 AM',
      imageTone: '#e5e5e8',
    },
    {
      id: 2,
      text: 'Today I started planning something new for my reader profile.',
      time: 'Yesterday at 8:10 PM',
      imageTone: '#eeeeef',
    },
    {
      id: 3,
      text: 'Small steps, but still moving forward.',
      time: '2 days ago',
      imageTone: '#e2e2e6',
    },
  ]

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const openAvatarEditor = () => {
    setAvatarMessage('')
    setAvatarPreview('')
    setRawAvatarImage('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setAvatarModalOpen(true)
  }

  const openEditProfile = () => {
    setProfileMessage('')
    setEditForm({
      name: user?.name || '',
      bio: user?.bio || '',
      work: user?.work || '',
      location: user?.location || '',
    })
    setEditProfileOpen(true)
  }

  const handleAvatarFileChange = (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarMessage('Please select an image file')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setRawAvatarImage(String(reader.result || ''))
      setAvatarPreview('')
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
      setAvatarMessage('')
    }

    reader.readAsDataURL(file)
  }

  const handleSaveAvatarCrop = async (pixels) => {
    if (!rawAvatarImage || !pixels) {
      setAvatarMessage('Please adjust the photo first')
      return
    }

    try {
      const cropped = await getCroppedImage(rawAvatarImage, pixels)
      setAvatarPreview(cropped)
      setRawAvatarImage('')
      setAvatarMessage('')
    } catch {
      setAvatarMessage('Failed to crop photo')
    }
  }

  const handleSaveProfileAvatar = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!avatarPreview) {
      setAvatarMessage('Please upload and crop a profile photo first')
      return
    }

    try {
      setSavingAvatar(true)
      setAvatarMessage('')

      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: avatarPreview,
        folder: 'reader-profiles',
        fileName: `reader-profile-${Date.now()}.jpg`,
      })

      const response = await fetch(`${API_BASE_URL}/api/users/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar_url: imageUrl,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update profile photo')
      }

      saveStoredUser(data.user)
      setUser(data.user)
      setAvatarPreview('')
      setRawAvatarImage('')
      setAvatarModalOpen(false)
    } catch (error) {
      setAvatarMessage(error.message || 'Failed to update profile photo')
    } finally {
      setSavingAvatar(false)
    }
  }

  const handleSaveProfileInfo = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!editForm.name.trim()) {
      setProfileMessage('Display name is required')
      return
    }

    try {
      setSavingProfile(true)
      setProfileMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          bio: editForm.bio,
          work: editForm.work,
          location: editForm.location,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update profile')
      }

      saveStoredUser(data.user)
      setUser(data.user)
      setEditProfileOpen(false)
    } catch (error) {
      setProfileMessage(error.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleCancelAvatarEdit = () => {
    setAvatarModalOpen(false)
    setRawAvatarImage('')
    setAvatarPreview('')
    setAvatarMessage('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[92px]">
      <AvatarCropModal
        open={avatarModalOpen}
        profile={profile}
        image={rawAvatarImage}
        preview={avatarPreview}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        loading={savingAvatar}
        message={avatarMessage}
        onFileChange={handleAvatarFileChange}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onCancel={handleCancelAvatarEdit}
        onSaveCrop={handleSaveAvatarCrop}
        onSaveProfile={handleSaveProfileAvatar}
      />

      <EditProfileModal
        open={editProfileOpen}
        profile={profile}
        form={editForm}
        loading={savingProfile}
        message={profileMessage}
        onChange={(field, value) => setEditForm((current) => ({ ...current, [field]: value }))}
        onClose={() => setEditProfileOpen(false)}
        onOpenAvatar={() => {
          setEditProfileOpen(false)
          openAvatarEditor()
        }}
        onSave={handleSaveProfileInfo}
      />

      <main className="mx-auto min-h-screen w-full bg-[#f5f3fa] md:max-w-[560px] md:py-4">
        <div className="overflow-hidden bg-white md:rounded-[24px] md:border md:border-[#eceaf2] md:shadow-sm">
          <header className="sticky top-0 z-30 border-b border-[#f0eef6] bg-white/95 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f5f3fa] active:scale-95"
                  aria-label="Go back"
                >
                  <i className="fas fa-chevron-left text-[16px]" />
                </button>

                <div className="min-w-0 text-[15px] font-extrabold text-[#111827]">
                  @{profile.username}
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f5f3fa] active:scale-95"
                  aria-label="Profile menu"
                >
                  <i className="fas fa-ellipsis-v text-[15px]" />
                </button>

                {profileMenuOpen ? <DropdownMenu items={profileMenuItems} /> : null}
              </div>
            </div>
          </header>

          <section className="px-4 pb-4 pt-5">
            <div className="flex items-center gap-4">
              <button type="button" onClick={openAvatarEditor} className="rounded-full active:scale-[0.98]" aria-label="Edit profile photo">
                <AvatarImage profile={profile} />
              </button>

              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-2">
                  <h1 className="line-clamp-1 text-[17px] font-extrabold text-[#111827]">
                    {profile.name}
                  </h1>
                  <i className="fas fa-crown text-[14px] text-[#f6b800]" />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <StatItem value={profile.posts} label="Posts" />
                  <StatItem value={profile.followers} label="Followers" />
                  <StatItem value={profile.following} label="Following" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-[12px] leading-5 text-[#111827]">
              <div className="font-bold">{profile.bioTitle}</div>
              <div>{profile.bio}</div>
              <div>{profile.location}</div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[#111827]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fas fa-globe" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fab fa-facebook-f" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fab fa-instagram" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d8dbe3] text-[11px]">
                <i className="fas fa-link" />
              </span>
            </div>

            {isOwnProfile ? (
              <button
                type="button"
                onClick={openEditProfile}
                className="mt-4 h-10 w-full rounded-[14px] border border-[#cfd3dc] bg-white text-[13px] font-extrabold text-[#111827] transition hover:bg-[#f7f7fb] active:scale-[0.99]"
              >
                Edit Profile
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="h-10 rounded-[14px] bg-[#0b5cff] text-[13px] font-extrabold text-white">
                  Follow
                </button>
                <button className="h-10 rounded-[14px] border border-[#cfd3dc] text-[13px] font-extrabold text-[#111827]">
                  Message
                </button>
              </div>
            )}
          </section>

          <section className="border-t border-[#f0eef6] px-4 py-4">
            <div className="flex gap-4 overflow-x-auto pb-1">
              <HighlightCircle title="Daily" />
              <HighlightCircle title="Study" />
              <HighlightCircle title="Travel" />
              <HighlightCircle title="Shopping" />
              {isOwnProfile ? <HighlightCircle title="New" isAdd /> : null}
            </div>
          </section>

          <section className="sticky top-[58px] z-20 border-y border-[#f0eef6] bg-white">
            <div className="grid grid-cols-3 text-center text-[12px] font-extrabold text-[#111827]">
              <button className="relative py-3">
                All
                <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#111827]" />
              </button>
              <button className="py-3">Reels</button>
              <button className="py-3">Photo</button>
            </div>
          </section>
        </div>

        <section className="mt-2 space-y-2 md:mt-3 md:space-y-3">
          {demoPosts.map((post) => (
            <PostCard
              key={post.id}
              profile={profile}
              text={post.text}
              time={post.time}
              imageTone={post.imageTone}
              menuItems={postMenuItems}
            />
          ))}
        </section>
      </main>
    </div>
  )
}

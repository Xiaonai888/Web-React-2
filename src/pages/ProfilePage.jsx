import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cropper from 'react-easy-crop'
import ReaderProfilePostsPanel from '../components/reader-posts/ReaderProfilePostsPanel'
import ReaderPostComposer from '../components/reader-posts/ReaderPostComposer'
import ReaderDiscoverPeoplePanel from '../components/reader-profile/ReaderDiscoverPeoplePanel'
import ReaderProfileOptionsSheet from '../components/reader-profile/ReaderProfileOptionsSheet'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import ReaderReaderMessageRequestModal from '../components/chat/ReaderReaderMessageRequestModal'

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

function saveAuthToken(token) {
  if (!token) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_token', token)
    return
  }

  sessionStorage.setItem('shadow_reader_token', token)
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
  if (!imageDataUrl || String(imageDataUrl).startsWith('http')) {
    return imageDataUrl || null
  }

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

async function fetchPublicUserProfile(username) {
  const token = getAuthToken()

  if (!token || !username) return null

  const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(username)}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to fetch profile')
  }

  return data.user || null
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
      className={`absolute top-9 z-40 w-44 overflow-hidden rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_18px_40px_rgba(17,24,39,0.14)] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`flex w-full items-center px-4 py-3 text-left text-[13px] font-bold transition hover:bg-[var(--shadow-bg-hover)] ${
            item === 'Delete' || item === 'Report' || item === 'Block'
              ? 'text-[#e5484d]'
              : 'text-[var(--shadow-text-primary)]'
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
      <div className="text-[15px] font-extrabold leading-none text-[var(--shadow-text-primary)]">{value}</div>
      <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-primary)]">{label}</div>
    </div>
  )
}



const PROFILE_LINK_OPTIONS = [
  { type: 'website', label: 'Website', icon: 'fas fa-globe' },
  { type: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { type: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
  { type: 'telegram', label: 'Telegram', icon: 'fab fa-telegram-plane' },
  { type: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok' },
  { type: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
  { type: 'x', label: 'X', icon: 'fab fa-twitter' },
  { type: 'link', label: 'Other Link', icon: 'fas fa-link' },
]

function getProfileLinkIcon(type) {
  return PROFILE_LINK_OPTIONS.find((item) => item.type === type)?.icon || 'fas fa-link'
}

function normalizeProfileLinkUrl(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function AvatarImage({ profile, sizeClass = 'h-[92px] w-[92px] md:h-[96px] md:w-[96px]' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[34px] font-extrabold text-white ${sizeClass}`}>
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
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">Edit Profile Photo</h2>
              <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">Upload, crop, then save your reader profile photo.</p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
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
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[var(--shadow-text-secondary)]">
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
                  className="w-full accent-[var(--shadow-accent)]"
                />
              </div>

              <button
                type="button"
                onClick={() => onSaveCrop(croppedAreaPixels)}
                className="mt-4 h-12 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
              >
                Save Crop
              </button>
            </>
          ) : (
            <div className="rounded-[22px] bg-[var(--shadow-bg-elevated)] p-5 text-center ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto mb-4 flex justify-center">
                <AvatarImage profile={{ ...profile, avatarUrl: preview || profile.avatarUrl }} sizeClass="h-[116px] w-[116px] text-[40px]" />
              </div>

              <p className="mx-auto max-w-[280px] text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
                Tap upload to choose a photo. Your old photo will stay until you press Save.
              </p>
            </div>
          )}

          {preview && !image ? (
            <div className="mt-4 rounded-[22px] bg-[var(--shadow-bg-elevated)] p-4 text-center ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto h-[116px] w-[116px] overflow-hidden rounded-full bg-[#111827] ring-2 ring-[#f6b800]">
                <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 text-[12px] font-bold text-[var(--shadow-text-secondary)]">Preview ready</div>
            </div>
          ) : null}

          <label className="mt-4 flex h-12 cursor-pointer items-center justify-center rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99]">
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
              className="h-12 rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSaveProfile}
              disabled={loading || !preview}
              className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99] disabled:bg-[var(--shadow-text-disabled)]"
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
        <div className="w-full rounded-[26px] bg-[var(--shadow-bg-surface)] p-4 shadow-2xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">Edit Profile</h2>
              <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">Update your reader profile information.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"
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
            className="mb-5 flex w-full items-center gap-4 rounded-[22px] bg-[var(--shadow-bg-elevated)] p-4 text-left ring-1 ring-[var(--shadow-border)] active:scale-[0.99]"
          >
            <AvatarImage profile={profile} sizeClass="h-[70px] w-[70px] text-[28px]" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Change Profile Photo</div>
              <div className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">Upload and crop a new photo.</div>
            </div>
            <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
          </button>

          <div className="space-y-4">
            <div>
  <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Display Name</label>
  <input
    value={form.name}
    onChange={(event) => onChange('name', event.target.value)}
    className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
    placeholder="Your display name"
  />
  <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">You can change display name once every 2 weeks.</div>
</div>

<div>
  <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Username</label>
  <input
    value={form.username}
    onChange={(event) => onChange('username', event.target.value)}
    className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
    placeholder="username"
  />
  <div className="mt-1 text-[11px] font-bold text-[var(--shadow-text-tertiary)]">You can change username once every 1 week.</div>
</div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Work / Job</label>
              <input
                value={form.work}
                onChange={(event) => onChange('work', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder="Author and accountant"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Bio</label>
              <textarea
                value={form.bio}
                onChange={(event) => onChange('bio', event.target.value)}
                className="min-h-[96px] w-full resize-none rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 py-3 text-[14px] leading-6 text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder="Turn the impossible into reality."
                maxLength={180}
              />
              <div className="mt-1 text-right text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{form.bio.length}/180</div>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Location</label>
              <input
                value={form.location}
                onChange={(event) => onChange('location', event.target.value)}
                className="h-12 w-full rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] px-4 text-[14px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)] focus:bg-[var(--shadow-bg-surface)]"
                placeholder="Based in KPS"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">Add link</label>
                <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">{(form.social_links || []).length}/5</div>
              </div>
            
              <div className="space-y-2">
                {(form.social_links || []).map((link, index) => (
                  <div key={index} className="rounded-[16px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-elevated)] p-3">
                    <div className="mb-2 flex gap-2">
                      <select
                        value={link.type || 'link'}
                        onChange={(event) =>
                          onChange(
                            'social_links',
                            (form.social_links || []).map((item, itemIndex) =>
                              itemIndex === index ? { ...item, type: event.target.value } : item
                            )
                          )
                        }
                        className="h-10 w-[130px] rounded-[12px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-3 text-[12px] font-bold text-[var(--shadow-text-primary)] outline-none"
                      >
                        {PROFILE_LINK_OPTIONS.map((option) => (
                          <option key={option.type} value={option.type}>
                            {option.label}
                          </option>
                        ))}
                      </select>
            
                      <button
                        type="button"
                        onClick={() =>
                          onChange(
                            'social_links',
                            (form.social_links || []).filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        className="ml-auto h-10 w-10 rounded-full bg-[var(--shadow-bg-surface)] text-[#e5484d] ring-1 ring-[var(--shadow-border-strong)]"
                      >
                        <i className="fa-solid fa-trash text-[12px]" />
                      </button>
                    </div>
            
                    <input
                      value={link.url}
                      onChange={(event) =>
                        onChange(
                          'social_links',
                          (form.social_links || []).map((item, itemIndex) =>
                            itemIndex === index ? { ...item, url: event.target.value } : item
                          )
                        )
                      }
                      className="h-11 w-full rounded-[14px] border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-4 text-[13px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-text-primary)]"
                      placeholder="https://example.com"
                    />
                  </div>
                ))}
              </div>
            
              {(form.social_links || []).length < 5 ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange('social_links', [...(form.social_links || []), { type: 'website', url: '' }])
                  }
                  className="mt-3 h-11 w-full rounded-[14px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)]"
                >
                  <i className="fa-solid fa-plus mr-2 text-[12px]" />
                  Add link
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-full border border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.99] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="h-12 rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99] disabled:bg-[var(--shadow-text-disabled)]"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



export default function ProfilePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const storedUser = useMemo(() => getStoredUser(), [])
  const requestedUsername = String(searchParams.get('username') || '').replace(/^@+/, '')
  const isOwnProfile =
    !requestedUsername ||
    requestedUsername.toLowerCase() === String(storedUser?.username || '').toLowerCase()
  const [profileOptionsOpen, setProfileOptionsOpen] = useState(false)
  const [messageRequestOpen, setMessageRequestOpen] = useState(false)
  const [readerPostCount, setReaderPostCount] = useState(0)
  const [profileTabMessage, setProfileTabMessage] = useState('')
  const [discoverPeopleOpen, setDiscoverPeopleOpen] = useState(false)
    const [user, setUser] = useState(() => (isOwnProfile ? storedUser : null))
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
  const [followLoading, setFollowLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    work: user?.work || '',
    location: user?.location || '',
    social_links: Array.isArray(user?.social_links)
      ? user.social_links
          .map((item) => ({
            type: item?.type || 'link',
            url: item?.url || '',
          }))
          .slice(0, 5)
      : [],
  })

    const viewedUser = useMemo(() => {
    const targetUsername = String(
      isOwnProfile ? storedUser?.username || '' : requestedUsername
    )
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()

    const loadedUsername = String(user?.username || '')
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()

    if (!targetUsername) return null
    if (loadedUsername === targetUsername) return user

    return isOwnProfile ? storedUser : null
  }, [isOwnProfile, requestedUsername, storedUser, user])


  const profilePostsUsername = isOwnProfile
    ? String(user?.username || storedUser?.username || '').replace(/^@+/, '')
    : requestedUsername

  function showProfileTabComingSoon(label) {
    setProfileTabMessage(`${label} is coming soon.`)
    window.setTimeout(() => setProfileTabMessage(''), 2200)
  }

  function handleSuggestionFollowed() {
    setUser((current) => {
      if (!current) return current

      const nextUser = {
        ...current,
        following_count: Number(current.following_count || 0) + 1,
      }

      saveStoredUser(nextUser)
      return nextUser
    })
  }

  useEffect(() => {
    let ignore = false
    const targetUsername = String(
      requestedUsername || storedUser?.username || ''
    ).replace(/^@+/, '')

    setReaderPostCount(0)
    setProfileOptionsOpen(false)
    setMessageRequestOpen(false)
    setDiscoverPeopleOpen(false)
    setProfileTabMessage('')
    setAvatarModalOpen(false)
    setEditProfileOpen(false)
    setRawAvatarImage('')
    setAvatarPreview('')

    if (isOwnProfile) {
  setUser(storedUser || null)
} else {
  setUser(null)
}

    async function loadProfileStats() {
      if (!targetUsername) return

      try {
        const freshUser = await fetchPublicUserProfile(targetUsername)

        if (ignore || !freshUser) return

        const returnedUsername = String(freshUser.username || '')
          .trim()
          .replace(/^@+/, '')
          .toLowerCase()

        if (returnedUsername !== targetUsername.toLowerCase()) {
          throw new Error('Profile mismatch')
        }

        if (isOwnProfile) {
          saveStoredUser(freshUser)
        }

        setUser(freshUser)
      } catch (error) {
        if (ignore) return

        console.error('Fetch reader profile stats error:', error)

        if (!isOwnProfile) {
          setUser(null)
        }
      }
    }

    loadProfileStats()

    return () => {
      ignore = true
    }
  }, [isOwnProfile, requestedUsername, storedUser?.username])

  const profile = useMemo(() => {
    const fallbackUsername = isOwnProfile
      ? String(storedUser?.username || '').replace(/^@+/, '')
      : requestedUsername

    return {
      name: viewedUser?.name || 'Reader Name',
      username: viewedUser?.username || fallbackUsername || 'username',
      avatarLetter: (viewedUser?.name || 'R').charAt(0).toUpperCase(),
      avatarUrl:
        (isOwnProfile ? avatarPreview : '') ||
        viewedUser?.avatar_url ||
        '',
      posts: viewedUser ? String(readerPostCount) : '0',
      followers: String(viewedUser?.followers_count || 0),
      following: String(viewedUser?.following_count || 0),
      bioTitle: viewedUser?.work || 'Add your work / job',
      bio: viewedUser?.bio || 'Add your bio',
      location: viewedUser?.location || 'Add your location',
      isPremium: Boolean(viewedUser?.is_premium),
      socialLinks: Array.isArray(viewedUser?.social_links)
        ? viewedUser.social_links.filter((item) => item?.url).slice(0, 5)
        : [],
    }
  }, [
    avatarPreview,
    isOwnProfile,
    readerPostCount,
    requestedUsername,
    storedUser?.username,
    viewedUser,
  ])


async function handleProfileFollow() {
  if (isOwnProfile || !profile.username || followLoading) return

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const wasFollowing = Boolean(user?.is_following)

  try {
    setFollowLoading(true)
    setProfileTabMessage('')

    const response = await fetch(
      `${API_BASE_URL}/api/users/${encodeURIComponent(profile.username)}/follow`,
      {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to update follow')
    }

    setUser((current) => {
      if (!current) return current

      return {
        ...current,
        is_following: Boolean(data.is_following),
        followers_count: Number(data.followers_count || 0),
      }
    })

    const currentUser = getStoredUser()

    if (currentUser) {
      const changed = Boolean(data.is_following) !== wasFollowing
      const difference = changed ? (data.is_following ? 1 : -1) : 0

      saveStoredUser({
        ...currentUser,
        following_count: Math.max(
          0,
          Number(currentUser.following_count || 0) + difference
        ),
      })
    }
  } catch (error) {
    setProfileTabMessage(error.message || 'Failed to update follow')
    window.setTimeout(() => setProfileTabMessage(''), 2200)
  } finally {
    setFollowLoading(false)
  }
}


  function handleOpenReaderMessage() {
  if (isOwnProfile) return

  const targetReady =
    user?.id &&
    String(user?.username || '').toLowerCase() ===
      requestedUsername.toLowerCase()

  if (!targetReady) {
    setProfileTabMessage('Profile is still loading.')
    window.setTimeout(
      () => setProfileTabMessage(''),
      2200
    )
    return
  }

  setMessageRequestOpen(true)
}
  
async function handleOtherProfileOption(action) {
  if (isOwnProfile) return

  const profileUrl = `${window.location.origin}/profile?username=${encodeURIComponent(profile.username)}`

  setProfileOptionsOpen(false)

  if (action === 'copy-link') {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setProfileTabMessage('Profile URL copied.')
    } catch {
      setProfileTabMessage(profileUrl)
    }

    window.setTimeout(
      () => setProfileTabMessage(''),
      2200
    )
    return
  }

  if (action === 'share-profile') {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          url: profileUrl,
        })
        return
      } catch (error) {
        if (error?.name === 'AbortError') {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl)
      setProfileTabMessage('Profile URL copied.')
    } catch {
      setProfileTabMessage(profileUrl)
    }

    window.setTimeout(
      () => setProfileTabMessage(''),
      2200
    )
    return
  }

  setProfileTabMessage(
    `${action.replaceAll('-', ' ')} is coming soon.`
  )

  window.setTimeout(
    () => setProfileTabMessage(''),
    2200
  )
}
  

  const handleCropComplete = useCallback((_, croppedPixels) => {
    if (!isOwnProfile) return
    setCroppedAreaPixels(croppedPixels)
  }, [isOwnProfile])

  const openAvatarEditor = () => {
    if (!isOwnProfile) return

    setAvatarMessage('')
    setAvatarPreview('')
    setRawAvatarImage('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setAvatarModalOpen(true)
  }

  const openEditProfile = () => {
    if (!isOwnProfile) return

    setProfileMessage('')
    setEditForm({
  name: user?.name || '',
  username: user?.username || '',
  bio: user?.bio || '',
  work: user?.work || '',
  location: user?.location || '',
  social_links: Array.isArray(user?.social_links) ? user.social_links.map((item) => ({ type: item?.type || 'link', url: item?.url || '' })).slice(0, 5) : [],
})
    setEditProfileOpen(true)
  }

  const handleAvatarFileChange = (file) => {
    if (!isOwnProfile || !file) return

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
    if (!isOwnProfile) return

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
    if (!isOwnProfile) return

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
    if (!isOwnProfile) return

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
  username: editForm.username,
  bio: editForm.bio,
  work: editForm.work,
  location: editForm.location,
  social_links: (editForm.social_links || [])
  .map((item) => ({ type: item.type || 'link', url: normalizeProfileLinkUrl(item.url) }))
  .filter((item) => item.url)
  .slice(0, 5),      
}),
})

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update profile')
      }

      saveStoredUser(data.user)
      if (data.token) saveAuthToken(data.token)
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
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)]">
      <AvatarCropModal
        open={isOwnProfile && avatarModalOpen}
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
        open={isOwnProfile && editProfileOpen}
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

      <ReaderReaderMessageRequestModal
        open={!isOwnProfile && messageRequestOpen}
        reader={user}
        onClose={() => setMessageRequestOpen(false)}
      />

      <main className="mx-auto min-h-screen w-full bg-[var(--shadow-bg-surface)] md:max-w-[560px] md:py-4">
        <div className="overflow-hidden bg-[var(--shadow-bg-surface)] md:rounded-[24px] md:border md:border-[var(--shadow-border)] md:shadow-sm">
          <header className="sticky top-0 z-30 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
               <button
  type="button"
  onClick={() =>
    isOwnProfile
      ? navigate('/me', { replace: true })
      : navigate(-1)
  }
  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
  aria-label="Go back"
>
  <i className="fas fa-chevron-left text-[16px]" />
</button>

                <div className="min-w-0 text-[15px] font-extrabold text-[var(--shadow-text-primary)]">
                  @{profile.username}
                </div>
              </div>

              <div className="relative">
                {isOwnProfile ? (
                  <button
  type="button"
  onClick={() => navigate('/profile/settings')}
  className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
  aria-label="Profile menu"
>
                    <i className="fa-solid fa-bars text-[17px]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setProfileOptionsOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
                    aria-label="Reader profile options"
                  >
                    <i className="fa-solid fa-ellipsis-vertical text-[16px]" />
                  </button>
                )}
              </div>
            </div>
          </header>

          <section className="px-4 pb-4 pt-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
  {isOwnProfile ? (
    <button
      type="button"
      onClick={openAvatarEditor}
      className="rounded-full active:scale-[0.98]"
      aria-label="Edit profile photo"
    >
      <AvatarImage profile={profile} />
    </button>
  ) : (
    <AvatarImage profile={profile} />
  )}

  {isOwnProfile ? (
    <button
      type="button"
      onClick={() => navigate('/reader/story/create')}
      className="absolute -bottom-1 -right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--shadow-bg-surface)] bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-page)] shadow-sm active:scale-90"
      aria-label="Add story"
    >
      <i className="fa-solid fa-plus text-[12px]" />
    </button>
  ) : null}
</div>

              <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center gap-2">
                  <h1 className="line-clamp-1 text-[17px] font-extrabold text-[var(--shadow-text-primary)]">
                    {profile.name}
                  </h1>
                  {profile.isPremium ? <i className="fas fa-crown text-[14px] text-[#f6b800]" /> : null}
                </div>

                <div className="grid grid-cols-3 gap-1">
  <StatItem value={profile.posts} label="Posts" />
  <button
    type="button"
    onClick={() => navigate(`/profile/${profile.username}/followers`)}
    className="rounded-[12px] active:scale-[0.98]"
  >
    <StatItem value={profile.followers} label="Followers" />
  </button>
  <button
    type="button"
    onClick={() => navigate(`/profile/${profile.username}/following`)}
    className="rounded-[12px] active:scale-[0.98]"
  >
    <StatItem value={profile.following} label="Following" />
  </button>
</div>
              </div>
            </div>

            <div className="mt-4 text-[12px] leading-5 text-[var(--shadow-text-primary)]">
              <div className="font-bold">{profile.bioTitle}</div>
              <div>{profile.bio}</div>
              <div>{profile.location}</div>
            </div>

            {profile.socialLinks.length ? (
  <div className="mt-3 flex items-center gap-2 text-[var(--shadow-text-primary)]">
    {profile.socialLinks.map((link, index) => (
      <a
        key={`${link.type}-${index}`}
        href={normalizeProfileLinkUrl(link.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[11px] transition hover:bg-[var(--shadow-bg-hover)] active:scale-95"
      >
        <i className={getProfileLinkIcon(link.type)} />
      </a>
    ))}
  </div>
) : null}

            {isOwnProfile ? (
  <div className="mt-4 flex items-center gap-2">
    <button
      type="button"
      onClick={() => navigate('/profile/edit')}
      className="h-10 flex-1 rounded-[12px] bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
    >
      Edit profile
    </button>

   <button
  type="button"
  onClick={() => navigate('/profile/share')}
  className="h-10 flex-1 rounded-[12px] bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
>
  Share profile
</button>

    <button
  type="button"
  onClick={() => setDiscoverPeopleOpen((current) => !current)}
  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
  aria-label="Discover people"
  aria-expanded={discoverPeopleOpen}
>
  <i className="fa-solid fa-user-plus text-[14px]" />
</button>
  </div>
) : (
  <div className="mt-4 grid grid-cols-2 gap-2">
    <button
      type="button"
      onClick={handleProfileFollow}
      disabled={followLoading}
      aria-pressed={Boolean(user?.is_following)}
      className="h-10 rounded-[14px] bg-[var(--shadow-text-primary)] text-[13px] font-extrabold text-[var(--shadow-bg-page)] transition active:scale-[0.98] disabled:opacity-60"
    >
      {followLoading ? 'Please wait...' : user?.is_following ? 'Following' : 'Follow'}
    </button>
    <button
      type="button"
      onClick={handleOpenReaderMessage}
      className="h-10 rounded-[14px] border border-[var(--shadow-border-strong)] text-[13px] font-extrabold text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
    >
      Message
    </button>
  </div>
)}


           {isOwnProfile ? (
  <ReaderDiscoverPeoplePanel
    open={discoverPeopleOpen}
    profileUsername={profile.username}
    onFollowed={handleSuggestionFollowed}
  />
) : null}
</section>
          

          <section className="sticky top-[58px] z-20 border-y border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
  <div className="flex items-center gap-1.5 px-4 py-2.5 text-[12px]">
    <button className="rounded-full bg-[var(--shadow-bg-hover)] px-4 py-2 font-semibold text-[var(--shadow-text-primary)]">
      All
    </button>

    <button
      type="button"
      onClick={() => showProfileTabComingSoon('Reels')}
      className="rounded-full px-4 py-2 font-normal text-[var(--shadow-text-secondary)]"
    >
      Reels
    </button>

    <button
      type="button"
      onClick={() => showProfileTabComingSoon('Photo')}
      className="rounded-full px-4 py-2 font-normal text-[var(--shadow-text-secondary)]"
    >
      Photo
    </button>
  </div>

  {profileTabMessage ? (
    <div className="absolute left-4 top-[54px] z-30 rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 py-2 text-[11px] font-normal text-[var(--shadow-text-primary)] shadow-lg">
      {profileTabMessage}
    </div>
  ) : null}
</section>
        </div>

        {isOwnProfile ? (
          <div className="mt-2 md:mt-3">
            <ReaderPostComposer />
          </div>
        ) : null}

        <ReaderProfilePostsPanel
  key={profilePostsUsername || 'reader-profile'}
  username={profilePostsUsername}
  isOwnProfile={isOwnProfile}
  profileUser={user}
  onEditAvatar={isOwnProfile ? openAvatarEditor : undefined}
  onCountChange={setReaderPostCount}
/>

<ReaderProfileOptionsSheet
  open={
    !isOwnProfile &&
    profileOptionsOpen
  }
  onClose={() =>
    setProfileOptionsOpen(false)
  }
  onSelect={
    handleOtherProfileOption
  }
/>
</main>
      {isOwnProfile ? (
  <ReaderProfileFooter
    avatarUrl={profile.avatarUrl}
    profileName={profile.name}
  />
) : null}

    </div>
  )
}

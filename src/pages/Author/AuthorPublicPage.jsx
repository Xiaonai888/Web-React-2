import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'
import Cropper from 'react-easy-crop'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const tabs = ['Posts', 'Works', 'About']

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

async function saveAuthorProfileImages({ token, avatarUrl = '', coverUrl = '' }) {
  const response = await fetch(`${API_BASE_URL}/api/authors/profile-images`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      avatar_url: avatarUrl,
      cover_url: coverUrl,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to save author profile image')
  }

  return data.author_page || null
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function normalizeAuthor(page, pageUsername, myPage = null, forceOwner = false) {
  const author = page || {}

  return {
    id: author.id || '',
    user_id: author.user_id || '',
    page_name: author.page_name || author.name || 'Author Page',
    page_username: author.page_username || author.username || pageUsername || 'author',
    page_slug: author.page_slug || author.page_username || pageUsername || 'author',
    bio: author.bio || 'This author has not added a bio yet.',
    avatar_url: author.avatar_url || author.profile_image_url || '',
    cover_url: author.cover_url || author.banner_url || '',
    works_count: Number(author.total_stories || author.works_count || 0),
    followers_count: Number(author.total_followers || author.followers_count || 0),
    fans_count: Number(author.total_fans || author.fans_count || 0),
    likes_count: Number(author.total_likes || author.likes_count || 0),
    is_following: Boolean(author.is_following),
    works: Array.isArray(author.works) ? author.works : [],
    created_at: author.created_at || '',
    updated_at: author.updated_at || '',
    is_owner: forceOwner || Boolean(myPage?.id && author.id && myPage.id === author.id),
  }
}

async function fetchPublicAuthorPage(pageUsername) {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Author page not found')
  }

  const authorPage = data.author_page || data.author || data.page || null

  return authorPage
    ? {
        ...authorPage,
        is_following: Boolean(data.is_following),
        total_followers: Number(data.total_followers ?? authorPage.total_followers ?? 0),
        works: Array.isArray(data.works) ? data.works : [],
      }
    : null
}

async function fetchMyAuthorPage() {
  const token = getAuthToken()

  if (!token) return null

  const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    return null
  }

  return data.author_page || null
}

function StatItem({ value, label }) {
  return (
    <div className="min-w-0 text-center">
      <div className="text-[18px] font-black leading-tight text-[#111827] sm:text-[20px]">
        {formatCompactNumber(value)}
      </div>
      <div className="mt-0.5 text-[12px] font-semibold text-[#6b7280] sm:text-[13px]">
        {label}
      </div>
    </div>
  )
}

function AuthorWorkCard({ work, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex gap-3 rounded-[20px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="h-[108px] w-[78px] shrink-0 overflow-hidden rounded-[14px] bg-[#e5e7eb]">
        {work.cover_url ? (
          <img
            src={work.cover_url}
            alt={work.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-regular fa-bookmark text-[22px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <h3 className="line-clamp-2 text-[15px] font-black leading-5 text-[#111827]">
          {work.title || 'Untitled Story'}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#8b93a1]">
          <span>{work.main_genre || 'Story'}</span>
          <span>•</span>
          <span>{Number(work.total_episodes || 0)} eps</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#9ca3af]">
          <span>
            <i className="fa-regular fa-eye mr-1" />
            {formatCompactNumber(work.total_views)}
          </span>
          <span>
            <i className="fa-regular fa-heart mr-1" />
            {formatCompactNumber(work.total_likes)}
          </span>
          <span>
            <i className="fa-regular fa-comment mr-1" />
            {formatCompactNumber(work.total_comments)}
          </span>
        </div>
      </div>
    </button>
  )
}
  
function EmptyPanel({ title, text }) {
  return (
    <div className="rounded-[24px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className="fa-regular fa-file-lines text-[20px]" />
      </div>
      <h3 className="text-[16px] font-black text-[#111827]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[300px] text-[13px] font-semibold leading-6 text-[#8b93a1]">
        {text}
      </p>
    </div>
  )
}

function AuthorNotFound({ onBack }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-10">
      <div className="mx-auto max-w-[420px] rounded-[28px] bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
          <i className="fa-regular fa-user text-[24px]" />
        </div>
        <h1 className="text-[20px] font-black text-[#111827]">Author page not found</h1>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#8b93a1]">
          This author page may be unavailable or the username is incorrect.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 h-11 w-full rounded-full bg-[#111827] text-[14px] font-black text-white"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

function CropImageModal({
  open,
  image,
  mode,
  crop,
  zoom,
  croppedAreaPixels,
  saving,
  message,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  if (!open) return null

  const isAvatar = mode === 'avatar'

  return (
   <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 px-0 pb-[72px] md:items-center md:px-4 md:pb-0">
      <div className="mx-auto flex min-h-0 w-full max-w-[560px] items-end justify-center md:items-center">
        <div className="w-full rounded-[26px] bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-extrabold text-[#111827]">
                {isAvatar ? 'Crop Profile Photo' : 'Crop Cover Photo'}
              </h2>
              <p className="mt-1 text-[11.5px] leading-4 text-[#8d94a1]">
                Drag and zoom to fit your author page image.
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

          {message ? (
            <div className="mb-3 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <div className={`${isAvatar ? 'h-[min(78vw,360px)] max-h-[360px] min-h-[260px]' : 'h-[min(58vw,300px)] max-h-[300px] min-h-[220px]'} relative mx-auto w-full overflow-hidden rounded-[22px] bg-[#111827]`}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={isAvatar ? 1 : 16 / 7}
              cropShape={isAvatar ? 'round' : 'rect'}
              showGrid={false}
              restrictPosition={false}
              objectFit="contain"
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
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
              className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(croppedAreaPixels)}
              disabled={saving}
              className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FollowSettingsSheet({ open, author, loading, onClose, onSeeFirst, onMute, onUnfollow }) {
  if (!open || !author) return null

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/35 md:items-center">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        aria-label="Close follow settings"
      />

      <div className="relative w-full overflow-hidden rounded-t-[24px] bg-white pb-5 shadow-2xl md:max-w-[420px] md:rounded-[24px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        <div className="px-5 py-4">
          <div className="text-[15px] font-black text-[#111827]">{author.page_name}</div>
          <div className="mt-1 text-[12px] font-bold text-[#8b93a1]">@{author.page_username}</div>
        </div>

        <div className="border-t border-[#f0eef6]">
          <button
            type="button"
            onClick={onSeeFirst}
            className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#f7f7fb]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
  <i className="fa-regular fa-star text-[15px]" />
</span>
<span className="text-[15px] font-bold text-[#111827]">See first</span>
          </button>

          <button
            type="button"
            onClick={onMute}
            className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#f7f7fb]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <i className="fa-regular fa-bell-slash text-[15px]" />
            </span>
            <span className="text-[15px] font-bold text-[#111827]">Mute updates</span>
          </button>

          <button
            type="button"
            onClick={onUnfollow}
            disabled={loading}
            className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#fff1f1] disabled:opacity-60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
              <i className="fa-solid fa-user-minus text-[14px]" />
            </span>
            <span className="text-[15px] font-bold text-[#e5484d]">
              {loading ? 'Unfollowing...' : `Unfollow ${author.page_name}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}


export default function AuthorPublicPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [author, setAuthor] = useState(null)
  const [activeTab, setActiveTab] = useState('Posts')
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [message, setMessage] = useState('')
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropMode, setCropMode] = useState('avatar')
  const [rawImage, setRawImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [savingImage, setSavingImage] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followSettingsOpen, setFollowSettingsOpen] = useState(false)

  function handleAuthorFooterComingSoon(label) {
  setMessage(`${label} is coming soon.`)
}
  useEffect(() => {
  document.body.classList.toggle('mobile-popup-open', followSettingsOpen)

  return () => {
    document.body.classList.remove('mobile-popup-open')
  }
}, [followSettingsOpen])

  useEffect(() => {
  document.body.classList.toggle('mobile-popup-open', followSettingsOpen)

  return () => {
    document.body.classList.remove('mobile-popup-open')
  }
}, [followSettingsOpen])

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  async function loadAuthor() {
    try {
      setLoading(true)
      setPageError('')

      if (!pageUsername) {
        const myPage = await fetchMyAuthorPage()

        if (!myPage) {
          throw new Error('Author page not found')
        }

        setAuthor(normalizeAuthor(myPage, myPage.page_username, myPage, true))
        localStorage.setItem('shadow_author_page', JSON.stringify(myPage))
        return
      }

      const [publicPage, myPage] = await Promise.all([
        fetchPublicAuthorPage(pageUsername),
        fetchMyAuthorPage().catch(() => null),
      ])

      setAuthor(normalizeAuthor(publicPage, pageUsername, myPage))
    } catch (loadError) {
      setAuthor(null)
      setPageError(loadError.message || 'Author page not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuthor()
  }, [pageUsername])


  async function handleToggleFollow() {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  if (!author?.page_username || author.is_owner || followLoading) return

  const nextFollowing = !author.is_following
  const previousAuthor = author

  setFollowLoading(true)
  setMessage('')
  setAuthor((current) => ({
    ...current,
    is_following: nextFollowing,
    followers_count: Math.max(0, Number(current.followers_count || 0) + (nextFollowing ? 1 : -1)),
  }))

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(author.page_username)}/follow`, {
      method: nextFollowing ? 'POST' : 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to update follow')
    }

    setAuthor((current) => ({
      ...current,
      is_following: Boolean(data.is_following ?? nextFollowing),
      followers_count: Number(data.total_followers ?? current.followers_count ?? 0),
    }))
  } catch (error) {
    setAuthor(previousAuthor)
    setMessage(error.message || 'Failed to update follow')
  } finally {
    setFollowLoading(false)
  }
}

  function handleOpenFollowSettings() {
  if (!author?.is_following || author?.is_owner) return
  setFollowSettingsOpen(true)
}

function handleSeeFirst() {
  setFollowSettingsOpen(false)
  setMessage('See first is not available yet.')
}

function handleMuteUpdates() {
  setFollowSettingsOpen(false)
  setMessage('Mute updates is not available yet.')
}

async function handleUnfollowFromSettings() {
  setFollowSettingsOpen(false)
  await handleToggleFollow()
}
  
  const actionButtons = useMemo(() => {
  if (author?.is_owner) {
    return [
      { label: 'Edit Page', icon: 'fa-pen', type: 'primary' },
      { label: 'Add Story', icon: 'fa-plus', type: 'secondary', onClick: () => navigate('/author/create-story') },
    ]
  }

    return [
      {
  label: author?.is_following ? 'Following' : 'Follow',
  icon: author?.is_following ? 'fa-user-check' : 'fa-user-plus',
  type: author?.is_following ? 'secondary' : 'primary',
  onClick: author?.is_following ? handleOpenFollowSettings : handleToggleFollow,
  disabled: followLoading,
},
      { label: 'Message', icon: 'fa-comment', type: 'secondary' },
    ]
  }, [author?.is_owner, author?.is_following, followLoading, navigate])

  function openCropEditor(mode) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = () => {
      const file = input.files?.[0]

      if (!file) return

      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file')
        return
      }

      const reader = new FileReader()

      reader.onload = () => {
        setCropMode(mode)
        setRawImage(String(reader.result || ''))
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setMessage('')
        setCropModalOpen(true)
      }

      reader.readAsDataURL(file)
    }

    input.click()
  }

  async function handleSaveCrop(pixels) {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!rawImage || !pixels) {
      setMessage('Please adjust the photo first')
      return
    }

    try {
      setSavingImage(true)
      setMessage('')

      const croppedImage = await getCroppedImage(rawImage, pixels)
      const imageUrl = await uploadImageToStorage({
        token,
        imageDataUrl: croppedImage,
        folder: cropMode === 'avatar' ? 'author_profile' : 'author_cover',
        fileName: `author-${cropMode}-${Date.now()}.jpg`,
      })

      const updatedAuthorPage = await saveAuthorProfileImages({
        token,
        avatarUrl: cropMode === 'avatar' ? imageUrl : '',
        coverUrl: cropMode === 'cover' ? imageUrl : '',
      })

      if (updatedAuthorPage) {
        localStorage.setItem('shadow_author_page', JSON.stringify(updatedAuthorPage))
        setAuthor((current) => normalizeAuthor(updatedAuthorPage, current?.page_username || pageUsername, updatedAuthorPage, true))
      }

      setCropModalOpen(false)
      setRawImage('')
      setCroppedAreaPixels(null)
    } catch (error) {
      setMessage(error.message || 'Failed to save image')
    } finally {
      setSavingImage(false)
    }
  }

  if (!loading && pageError) {
    return <AuthorNotFound onBack={() => navigate(-1)} />
  }

  const displayAuthor = author || {
    page_name: 'Loading',
    page_username: pageUsername || 'author',
    bio: '',
    avatar_url: '',
    cover_url: '',
    works_count: 0,
    followers_count: 0,
    fans_count: 0,
    likes_count: 0,
    is_owner: false,
  }

  const authorWorks = Array.isArray(author?.works) ? author.works : []

  function handleAuthorFooterComingSoon(label) {
  setMessage(`${label} is coming soon.`)
}

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <CropImageModal
        open={cropModalOpen}
        image={rawImage}
        mode={cropMode}
        crop={crop}
        zoom={zoom}
        croppedAreaPixels={croppedAreaPixels}
        saving={savingImage}
        message={message}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        onClose={() => setCropModalOpen(false)}
        onSave={handleSaveCrop}
      />

      <FollowSettingsSheet
  open={followSettingsOpen}
  author={displayAuthor}
  loading={followLoading}
  onClose={() => setFollowSettingsOpen(false)}
  onSeeFirst={handleSeeFirst}
  onMute={handleMuteUpdates}
  onUnfollow={handleUnfollowFromSettings}
/>

      <div className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="min-w-0 flex-1 px-3 text-center">
            <div className="truncate text-[15px] font-black text-[#111827] sm:text-[17px]">
              @{displayAuthor.page_username}
            </div>
          </div>

          <Link
            to="/search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-magnifying-glass text-[16px]" />
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-[980px]">
        {message && !cropModalOpen ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        <section className="bg-white shadow-sm">
          <div className="relative h-[210px] bg-[#111827] sm:h-[280px]">
            {displayAuthor.cover_url ? (
              <img
                src={displayAuthor.cover_url}
                alt={displayAuthor.page_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
            )}

            {displayAuthor.is_owner ? (
              <button
                type="button"
                onClick={() => openCropEditor('cover')}
                className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-[12px] font-black text-[#111827] shadow-sm"
              >
                <i className="fa-solid fa-camera mr-2" />
                Edit Cover
              </button>
            ) : null}
          </div>

          <div className="px-4 pb-5 sm:px-6">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-16 h-[124px] w-[124px] shrink-0 rounded-full border-4 border-white bg-[#f3f4f6] shadow-sm sm:h-[148px] sm:w-[148px]">
                {displayAuthor.avatar_url ? (
                  <img
                    src={displayAuthor.avatar_url}
                    alt={displayAuthor.page_name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e5e7eb] text-[42px] font-black text-[#9ca3af]">
                    {displayAuthor.page_name.slice(0, 1).toUpperCase()}
                  </div>
                )}

                {displayAuthor.is_owner ? (
                  <button
                    type="button"
                    onClick={() => openCropEditor('avatar')}
                    className="absolute left-[92px] top-[44px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#111827] text-white shadow-sm sm:left-[112px] sm:top-[58px]"
                  >
                    <i className="fa-solid fa-camera text-[13px]" />
                  </button>
                ) : null}
              </div>

              <div className="min-w-0 flex-1 sm:pb-2">
                {loading ? (
                  <div className="h-8 w-52 animate-pulse rounded-full bg-[#f3f4f6]" />
                ) : (
                  <h1 className="line-clamp-1 text-[24px] font-black tracking-tight text-[#111827] sm:text-[30px]">
                    {displayAuthor.page_name}
                  </h1>
                )}

                <p className="mt-1 text-[13px] font-bold text-[#6b7280] sm:text-[14px]">
                  @{displayAuthor.page_username}
                </p>

                {loading ? (
                  <div className="mt-3 h-4 w-full max-w-[420px] animate-pulse rounded-full bg-[#f3f4f6]" />
                ) : (
                  <p className="mt-2 line-clamp-2 max-w-[620px] text-[13px] font-medium leading-6 text-[#374151] sm:text-[14px]">
                    {displayAuthor.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 rounded-[22px] bg-[#f8fafc] p-4 ring-1 ring-black/5">
              <StatItem value={displayAuthor.works_count} label="Works" />
              <StatItem value={displayAuthor.followers_count || displayAuthor.fans_count} label="Followers" />
              <StatItem value={displayAuthor.likes_count} label="Likes" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              {actionButtons.map((button) => (
                <button
                  key={button.label}
                  type="button"
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className={`h-11 flex-1 rounded-full text-[14px] font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                    button.type === 'primary'
                      ? 'bg-[#111827] text-white'
                      : 'bg-[#f3f4f6] text-[#111827]'
                  }`}
                >
                  <i className={`fa-solid ${button.icon} mr-2 text-[13px]`} />
                  {button.disabled ? 'Loading...' : button.label}
                </button>
              ))}

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] transition active:scale-[0.98]"
              >
                <i className="fa-solid fa-ellipsis text-[15px]" />
              </button>
            </div>
          </div>
        </section>

        <section className="sticky top-14 z-30 border-y border-[#eef0f4] bg-white">
          <div className="grid grid-cols-3 px-4">
            {tabs.map((tab) => {
              const active = activeTab === tab

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative h-12 text-[14px] font-black ${
                    active ? 'text-[#111827]' : 'text-[#8b93a1]'
                  }`}
                >
                  {tab}
                  {active ? (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[#111827]" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        <section className="px-4 py-5 sm:px-0">
          {activeTab === 'Posts' ? (
            <EmptyPanel
              title="No posts yet"
              text="Author posts and announcements will appear here."
            />
          ) : null}

          {activeTab === 'Works' ? (
            authorWorks.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {authorWorks.map((work) => (
                  <AuthorWorkCard
                    key={work.id}
                    work={work}
                    onOpen={() => navigate(`/story/${work.id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyPanel
                title="No works yet"
                text="Published novels, chat stories, and manga will appear here."
              />
            )
          ) : null}

          {activeTab === 'About' ? (
            <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="text-[18px] font-black text-[#111827]">About</h2>
              <p className="mt-3 text-[14px] font-medium leading-7 text-[#374151]">
                {displayAuthor.bio}
              </p>

              <div className="mt-5 space-y-3 text-[13px] font-bold text-[#4b5563]">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-book-open w-5 text-[#9ca3af]" />
                  <span>{formatCompactNumber(displayAuthor.works_count)} works</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-users w-5 text-[#9ca3af]" />
                  <span>{formatCompactNumber(displayAuthor.followers_count || displayAuthor.fans_count)} followers</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-heart w-5 text-[#9ca3af]" />
                  <span>{formatCompactNumber(displayAuthor.likes_count)} likes</span>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <AuthorPageFooter active="Page" onComingSoon={handleAuthorFooterComingSoon} />
    </div>
  )
}

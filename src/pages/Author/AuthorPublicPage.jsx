import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'
import AuthorPostsSection from '../../components/AuthorPostsSection'
import AuthorPublicStoreSection from '../../components/AuthorPublicStoreSection'
import AuthorStoreTab from '../../components/AuthorStoreTab'
import ReportModal from '../../components/ReportModal'
import Cropper from 'react-easy-crop'



const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const tabs = ['Posts', 'Works', 'Store']

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredReaderUser() {
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

function getStoredAuthorProfileDetails() {
  try {
    return JSON.parse(localStorage.getItem('shadow_author_page_profile_details') || '{}') || {}
  } catch {
    return {}
  }
}

function getAuthorCartCount() {
  try {
    const cartItems = JSON.parse(localStorage.getItem('shadow_author_cart_items') || '[]')

    if (!Array.isArray(cartItems)) return 0

    return cartItems.reduce((total, item) => total + Number(item.quantity || 1), 0)
  } catch {
    return 0
  }
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

async function saveAuthorProfileImages({ token, avatarUrl = '', coverUrl = '', slideUrls = null }) {
  const body = {
    avatar_url: avatarUrl,
    cover_url: coverUrl,
  }

  if (Array.isArray(slideUrls)) {
    body.slide_urls = slideUrls
  }

  const response = await fetch(`${API_BASE_URL}/api/authors/profile-images`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
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

function getCompactHoursText(details = {}) {
  const type = String(details?.hours_type || '').trim()
  const text = String(details?.hours || '').trim()

  if (!text || type === 'not_applicable') return ''
  if (type === 'always_open' || /^always open$/i.test(text)) return 'Always open'
  if (type === 'temporarily_closed' || /^temporarily closed$/i.test(text)) return 'Temporarily closed'
  if (type === 'permanently_closed' || /^permanently closed$/i.test(text)) return 'Permanently closed'
  if (/^closed$/i.test(text)) return 'Closed'

  const oneLine = text.replace(/\s+/g, ' ').trim()

  if (!text.includes('\n')) {
    if (/^everyday:\s*/i.test(oneLine)) {
      return oneLine.replace(/^everyday:\s*/i, 'Open · Everyday ')
    }

    if (/^open\s+/i.test(oneLine)) {
      return oneLine.replace(/^open\s+([^:]+):\s*/i, 'Open · $1 ')
    }

    return oneLine
  }

  const dayOrder = [
    ['monday', 'Monday', 0],
    ['tuesday', 'Tuesday', 1],
    ['wednesday', 'Wednesday', 2],
    ['thursday', 'Thursday', 3],
    ['friday', 'Friday', 4],
    ['saturday', 'Saturday', 5],
    ['sunday', 'Sunday', 6],
  ]

  const dayMap = new Map(dayOrder.map(([key, label, index]) => [label.toLowerCase(), { key, label, index }]))

  const entries = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([A-Za-z]+):\s*(.+)$/)
      if (!match) return null

      const day = dayMap.get(match[1].toLowerCase())
      if (!day) return null

      return {
        ...day,
        hours: match[2].trim(),
      }
    })
    .filter(Boolean)

  if (!entries.length) return 'Hours available'

  const openEntries = entries.filter((item) => !/^closed$/i.test(item.hours))

  if (!openEntries.length) return 'Closed'

  const uniqueHours = [...new Set(openEntries.map((item) => item.hours))]
  const openIndexes = openEntries.map((item) => item.index).sort((a, b) => a - b)

  if (uniqueHours.length === 1) {
    const hours = uniqueHours[0]
    const indexesText = openIndexes.join(',')

    if (indexesText === '0,1,2,3,4,5,6') {
      if (/open 24 hours/i.test(hours)) return 'Open 24 hours'
      return `Open · Everyday ${hours}`
    }

    if (indexesText === '0,1,2,3,4') {
      return `Open · Mon–Fri ${hours}`
    }

    if (indexesText === '5,6') {
      return `Open · Sat–Sun ${hours}`
    }

    if (openEntries.length === 1) {
      return `Open · ${openEntries[0].label} ${hours}`
    }
  }

  return 'Hours vary by day'
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
    slide_urls: Array.isArray(author.slide_urls) ? author.slide_urls : [],
profile_details: author.profile_details || {},
works_count: Number(author.total_stories || author.works_count || 0),
    followers_count: Number(author.total_followers || author.followers_count || 0),
    fans_count: Number(author.total_fans || author.fans_count || 0),
    likes_count: Number(author.total_likes || author.likes_count || 0),
    is_following: Boolean(author.is_following),
    works: Array.isArray(author.works) ? author.works : [],
    created_at: author.created_at || '',
    updated_at: author.updated_at || '',
    is_owner:
      forceOwner ||
      Boolean(
        (myPage?.id && author.id && myPage.id === author.id) ||
          (myPage?.page_username && author.page_username && myPage.page_username === author.page_username)
      ),
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
        works: Array.isArray(data.works)
  ? data.works
  : Array.isArray(data.stories)
    ? data.stories
    : Array.isArray(data.author_stories)
      ? data.author_stories
      : Array.isArray(authorPage.works)
        ? authorPage.works
        : Array.isArray(authorPage.stories)
          ? authorPage.stories
          : [],
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

  const authorPage = data.author_page || null

if (!authorPage) return null

return {
  ...authorPage,
  works: Array.isArray(data.works)
    ? data.works
    : Array.isArray(data.stories)
      ? data.stories
      : Array.isArray(data.author_stories)
        ? data.author_stories
        : Array.isArray(authorPage.works)
          ? authorPage.works
          : Array.isArray(authorPage.stories)
            ? authorPage.stories
            : [],
}
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
      <div className="mx-auto max-w-[420px] rounded-full bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
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

      <div className="relative w-full overflow-hidden rounded-t-[24px] bg-white pb-5 shadow-2xl md:max-w-[420px] md:rounded-full">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        <div className="px-5 py-4">
  <div className="text-[15px] font-normal text-[#111827]">{author.page_name}</div>
  <div className="mt-1 text-[12px] font-normal text-[#8b93a1]">@{author.page_username}</div>
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
    <span className="text-[15px] font-normal text-[#111827]">See first</span>
  </button>

  <button
    type="button"
    onClick={onMute}
    className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[#f7f7fb]"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
      <i className="fa-regular fa-bell-slash text-[15px]" />
    </span>
    <span className="text-[15px] font-normal text-[#111827]">Mute updates</span>
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
    <span className="text-[15px] font-normal text-[#e5484d]">
      {loading ? 'Unfollowing...' : `Unfollow ${author.page_name}`}
    </span>
  </button>
</div>
      </div>
    </div>
  )
}


function AuthorPageSwitcherSheet({ open, onClose, author, readerUser, onPage, onOwnAccount, onManageAccount }) {
  if (!open) return null

  const pageName = author?.page_name || 'Author Page'
  const pageLogo = author?.avatar_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'
  const readerName = readerUser?.name || 'Reader'
  const readerAvatar = readerUser?.avatar_url || readerUser?.avatarUrl || ''
  const readerLetter = readerName.charAt(0).toUpperCase() || 'S'

  return (
    <div className="fixed inset-0 z-[230]">
      <button type="button" aria-label="Close switcher" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[28px] bg-white px-4 pb-8 pt-4 shadow-2xl md:bottom-auto md:left-1/2 md:right-auto md:top-20 md:w-[380px] md:-translate-x-1/2 md:rounded-[24px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e5e7eb]" />

        <div className="overflow-hidden rounded-[24px] border border-[#eceaf2] bg-white shadow-sm">
          <button type="button" onClick={onPage} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#111827] ring-1 ring-black/10">
                {pageLogo ? (
                  <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{pageLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[#111827]">{pageName}</div>
              </div>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
              <i className="fa-solid fa-check text-[10px]" />
            </span>
          </button>

          <button type="button" onClick={onOwnAccount} className="flex w-full items-center justify-between gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:scale-[0.99]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#202638] text-white">
                {readerAvatar ? (
                  <img src={readerAvatar} alt={readerName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[18px] font-extrabold">{readerLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-[16px] font-extrabold text-[#111827]">{readerName}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8d94a1]">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span>0 notifications</span>
                </div>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#c6c9d1]" />
          </button>
        </div>

        <button type="button" onClick={onManageAccount} className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[#d9dce4] bg-white text-[14px] font-normal text-[#111827] active:scale-[0.99]">
          Manage Account
        </button>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-10 w-auto object-contain opacity-90" />
        </div>
      </div>
    </div>
  )
}

function AuthorOwnerMenuSheet({
  open,
  onClose,
  author,
  readerUser,
  onPage,
  onOwnAccount,
  onManageAccount,
  onOpenFinance,
  onOpenStoreSetting,
}) {
  
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false)

  if (!open) return null

  const pageName = author?.page_name || 'Author Page'
  const pageLogo = author?.avatar_url || ''
  const pageLetter = pageName.charAt(0).toUpperCase() || 'A'
  const readerName = readerUser?.name || 'Reader'
  const readerAvatar = readerUser?.avatar_url || readerUser?.avatarUrl || ''
  const readerLetter = readerName.charAt(0).toUpperCase() || 'S'

  return (
    <div className="fixed inset-0 z-[235]">
      <button
        type="button"
        aria-label="Close author menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <aside className="absolute bottom-0 left-0 top-0 w-[84vw] max-w-[390px] overflow-y-auto bg-white px-4 pb-8 pt-4 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-[15px] font-black text-[#111827]">Author Menu</h2>
        </div>

        <div className="bg-white px-0 py-3">
          <button
            type="button"
            onClick={() => setProfileSwitcherOpen(true)}
            className="flex w-full items-center gap-3 text-left active:scale-[0.99]"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[#111827] ring-1 ring-black/10">
              {pageLogo ? (
                <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[20px] font-extrabold">{pageLetter}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-black text-[#111827]">{pageName}</div>
              <div className="mt-1 text-[11.5px] font-semibold text-[#8b93a1]">
                Switch Profile
              </div>
            </div>
          </button>
        </div>

        

<div className="mt-5 space-y-1">
  <button
    type="button"
    onClick={onOpenFinance}
    className="flex w-full items-center gap-3 px-0 py-2.5 text-left active:opacity-70"
  >
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111827]">
      <i className="fa-solid fa-wallet text-[17px]" />
    </span>

    <span className="text-[15px] font-normal text-[#111827]">
      Finance
    </span>
  </button>

  <button
  type="button"
  onClick={onOpenStoreSetting}
  className="flex w-full items-center gap-3 px-0 py-2.5 text-left active:opacity-70"
>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111827]">
      <i className="fa-solid fa-gear text-[17px]" />
    </span>

    <span className="text-[15px] font-normal text-[#111827]">
      Settings
    </span>
  </button>
</div>

        <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
          <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-10 w-auto object-contain opacity-90" />
        </div>
      </aside>

      {profileSwitcherOpen ? (
        <div className="fixed inset-0 z-[260] flex items-end justify-center bg-black/35 px-0 pb-0 md:items-center md:px-4 md:pb-0">
          <button
            type="button"
            aria-label="Close profile switcher"
            onClick={() => setProfileSwitcherOpen(false)}
            className="absolute inset-0"
          />

          <div className="relative w-full overflow-hidden rounded-t-[26px] bg-white px-4 pb-6 pt-3 shadow-2xl md:max-w-[390px] md:rounded-[26px]">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

            <div className="overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setProfileSwitcherOpen(false)
                  onPage?.()
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#111827] ring-1 ring-black/10">
                    {pageLogo ? (
                      <img src={pageLogo} alt={pageName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[18px] font-extrabold">{pageLetter}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-black text-[#111827]">{pageName}</div>
                    <div className="mt-0.5 text-[11.5px] font-semibold text-[#8b93a1]">Author page</div>
                  </div>
                </div>

                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white">
                  <i className="fa-solid fa-check text-[10px]" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileSwitcherOpen(false)
                  onOwnAccount?.()
                }}
                className="flex w-full items-center justify-between gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:bg-[#f8fafc]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[#111827] ring-1 ring-black/10">
                    {readerAvatar ? (
                      <img src={readerAvatar} alt={readerName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[18px] font-extrabold">{readerLetter}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-black text-[#111827]">{readerName}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8b93a1]">
                      <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                      <span>0 notifications</span>
                    </div>
                  </div>
                </div>

                <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#c6c9d1]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileSwitcherOpen(false)
                onManageAccount?.()
              }}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-[#d9dce4] bg-white text-[14px] font-normal text-[#111827] active:scale-[0.99]"
            >
              Manage Account
            </button>

            <div className="pointer-events-none mx-auto mt-5 flex h-12 w-32 items-center justify-center">
              <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-10 w-auto object-contain opacity-90" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SwitchingAccountScreen({ open, name, avatarUrl, avatarLetter }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[260] flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#d9dce4] border-t-[#111827] animate-spin" />
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-[#111827] ring-1 ring-black/10">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[20px] font-bold">{avatarLetter}</span>
            )}
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="text-[16px] font-medium text-[#111827]">Switching to</div>
          <div className="mt-1 text-[17px] font-bold text-[#111827]">{name}</div>
        </div>
      </div>

      <div className="pointer-events-none mb-8 flex h-14 w-36 items-center justify-center">
        <img src="/assets/Icons/Logo Shadow 2.svg" alt="" className="h-11 w-auto object-contain opacity-95" />
      </div>
    </div>
  )
}
function CoverOptionsSheet({ open, savingSlide, onClose, onSeeCover, onUploadCover, onChooseCover }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[240]">
      <button type="button" aria-label="Close cover options" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#9ca3af]" />

        <div className="space-y-1">
          <button type="button" onClick={onSeeCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
              <i className="fa-regular fa-image text-[18px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">See cover</span>
          </button>

          <button type="button" onClick={onUploadCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">Upload cover</span>
          </button>

          <button type="button" onClick={onChooseCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
              <i className="fa-regular fa-folder-open text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">Choose cover</span>
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
  const [tabsFrozen, setTabsFrozen] = useState(false)
  const [readerCartCount, setReaderCartCount] = useState(() => getAuthorCartCount())
  const [readerNotificationCount, setReaderNotificationCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ownerResolved, setOwnerResolved] = useState(false)
  const [pageError, setPageError] = useState('')
  const [message, setMessage] = useState('')
  const [reviewSummary, setReviewSummary] = useState({
  total_count: 0,
  recommend_count: 0,
  recommend_percent: 0,
})
  const [myReview, setMyReview] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewItems, setReviewItems] = useState([])
  const [reviewsOverviewOpen, setReviewsOverviewOpen] = useState(false)
  const reviewsOverviewDragStartRef = useRef(null)
  const reviewsOverviewDragCurrentRef = useRef(0)
  const [reviewsOverviewDragY, setReviewsOverviewDragY] = useState(0)
  const [reviewsListOpen, setReviewsListOpen] = useState(false)
  const [reviewInfoOpen, setReviewInfoOpen] = useState(false)
  const [reviewOptionsOpen, setReviewOptionsOpen] = useState(false)
  const [selectedReviewOption, setSelectedReviewOption] = useState(null)
  const [reviewSettingsOpen, setReviewSettingsOpen] = useState(false)
  const [allowReviewsDraft, setAllowReviewsDraft] = useState(true)
  const [allowReviewsSaved, setAllowReviewsSaved] = useState(true)
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)
  const [savingReview, setSavingReview] = useState(false)
  const [reviewDraftText, setReviewDraftText] = useState('')
  const [reviewDraftRecommended, setReviewDraftRecommended] = useState(true)
  const [reviewDraftError, setReviewDraftError] = useState('')
  const [reviewDiscardOpen, setReviewDiscardOpen] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropMode, setCropMode] = useState('avatar')
  const [rawImage, setRawImage] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [savingImage, setSavingImage] = useState(false)
  const [savingSlide, setSavingSlide] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followSettingsOpen, setFollowSettingsOpen] = useState(false)
  const [authorPostsCount, setAuthorPostsCount] = useState(0)
  const [pageSwitcherOpen, setPageSwitcherOpen] = useState(false)
  const [authorMenuOpen, setAuthorMenuOpen] = useState(false)
  const [reportPageOpen, setReportPageOpen] = useState(false)
  const [switchingToReader, setSwitchingToReader] = useState(false)
  const readerUser = getStoredReaderUser()
  const readerName = readerUser?.name || 'Reader'
  const readerAvatar = readerUser?.avatar_url || readerUser?.avatarUrl || ''
  const readerLetter = readerName.charAt(0).toUpperCase() || 'S'
  const [coverOptionsOpen, setCoverOptionsOpen] = useState(false)
  const [readerHeaderSolid, setReaderHeaderSolid] = useState(false)
  const [readerHeaderTitle, setReaderHeaderTitle] = useState(false)
  const coverRef = useRef(null)
  const profileRef = useRef(null)
  const tabsRef = useRef(null)
  const databaseProfileDetails = author?.profile_details || {}
  const storedProfileDetails = getStoredAuthorProfileDetails()
  const profileDetails = author?.is_owner
  ? { ...storedProfileDetails, ...databaseProfileDetails }
  : databaseProfileDetails
  


  function handleSwitchToReaderAccount() {
  setPageSwitcherOpen(false)
  setSwitchingToReader(true)

  window.setTimeout(() => {
    navigate('/me')
  }, 900)
}

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
  if (sessionStorage.getItem('shadow_open_author_menu') !== '1') return
  if (!ownerResolved) return

  sessionStorage.removeItem('shadow_open_author_menu')

  if (author?.is_owner) {
    setAuthorMenuOpen(true)
  }
}, [ownerResolved, author?.is_owner])
  
  useEffect(() => {
  if (!authorMenuOpen) return undefined

  const previousOverflow = document.body.style.overflow
  const previousTouchAction = document.body.style.touchAction

  document.body.style.overflow = 'hidden'
  document.body.style.touchAction = 'none'

  return () => {
    document.body.style.overflow = previousOverflow
    document.body.style.touchAction = previousTouchAction
  }
}, [authorMenuOpen])

  useEffect(() => {
    function syncAuthorCartCount() {
      setReaderCartCount(getAuthorCartCount())
    }

    syncAuthorCartCount()

    window.addEventListener('storage', syncAuthorCartCount)
    window.addEventListener('shadow-author-cart-updated', syncAuthorCartCount)

    return () => {
      window.removeEventListener('storage', syncAuthorCartCount)
      window.removeEventListener('shadow-author-cart-updated', syncAuthorCartCount)
    }
  }, [])

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  async function loadAuthor() {
    try {
      setLoading(true)
      setOwnerResolved(false)
      setPageError('')
      setAuthor(null)

      if (!pageUsername) {
        const myPage = await fetchMyAuthorPage()

        if (!myPage) {
          throw new Error('Author page not found')
        }

        setAuthor(normalizeAuthor(myPage, myPage.page_username, myPage, true))
        localStorage.setItem('shadow_author_page', JSON.stringify(myPage))
        setOwnerResolved(true)
        setLoading(false)
        return
      }

      const publicPage = await fetchPublicAuthorPage(pageUsername)
      setAuthor(normalizeAuthor(publicPage, pageUsername, null, false))
      setLoading(false)

      const myPage = await fetchMyAuthorPage().catch(() => null)
      setAuthor(normalizeAuthor(publicPage, pageUsername, myPage))
      setOwnerResolved(true)
    } catch (loadError) {
      setAuthor(null)
      setOwnerResolved(true)
      setPageError(loadError.message || 'Author page not found')
      setLoading(false)
    }
  }

  async function loadAuthorReviews(username) {
  if (!username) return

  try {
    setReviewLoading(true)
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/reviews`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to load reviews')
    }

    setReviewSummary(data.summary || {
      total_count: 0,
      recommend_count: 0,
      recommend_percent: 0,
    })
    setMyReview(data.my_review || null)
    setReviewItems(Array.isArray(data.reviews) ? data.reviews : [])
  } catch {
    setReviewSummary({
      total_count: 0,
      recommend_count: 0,
      recommend_percent: 0,
    })
    setMyReview(null)
    setReviewItems([])
  } finally {
    setReviewLoading(false)
  }
}


  useEffect(() => {
    const username = author?.page_username || pageUsername

    if (!username || loading) return

    loadAuthorReviews(username)
  }, [author?.page_username, pageUsername, loading])

  useEffect(() => {
    loadAuthor()
  }, [pageUsername])


function handleOpenReviewsOverview() {
  setReviewsOverviewOpen(true)
  setReviewsOverviewDragY(0)
}

function handleCloseReviewsOverview() {
  reviewsOverviewDragStartRef.current = null
  reviewsOverviewDragCurrentRef.current = 0
  setReviewsOverviewDragY(0)
  setReviewsOverviewOpen(false)
}

function handleReviewsOverviewPointerDown(event) {
  reviewsOverviewDragStartRef.current = event.clientY
  reviewsOverviewDragCurrentRef.current = 0
  setReviewsOverviewDragY(0)
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function handleReviewsOverviewPointerMove(event) {
  if (reviewsOverviewDragStartRef.current === null) return

  const nextY = Math.max(0, event.clientY - reviewsOverviewDragStartRef.current)
  reviewsOverviewDragCurrentRef.current = nextY
  setReviewsOverviewDragY(nextY)
}

function handleReviewsOverviewPointerEnd() {
  if (reviewsOverviewDragStartRef.current === null) return

  const shouldClose = reviewsOverviewDragCurrentRef.current > 90

  reviewsOverviewDragStartRef.current = null
  reviewsOverviewDragCurrentRef.current = 0

  if (shouldClose) {
    handleCloseReviewsOverview()
    return
  }

  setReviewsOverviewDragY(0)
}

function handleOpenReviewSheet(isRecommended = true) {
  const token = getAuthToken()

  if (displayAuthor.is_owner) return

  if (!token) {
    navigate('/login')
    return
  }

  setReviewDraftRecommended(Boolean(isRecommended))
  setReviewDraftText(myReview?.review_text || '')
  setReviewDraftError('')
  setReviewDiscardOpen(false)
  setReviewSheetOpen(true)
}

function handleCloseReviewSheet() {
  const originalText = String(myReview?.review_text || '')
  const hasDraftChanges =
    reviewDraftText !== originalText &&
    (reviewDraftText.trim().length > 0 || originalText.trim().length > 0)

  if (hasDraftChanges && !savingReview) {
    setReviewDiscardOpen(true)
    return
  }

  setReviewSheetOpen(false)
  setReviewDraftError('')
}

function handleDiscardReviewDraft() {
  setReviewDiscardOpen(false)
  setReviewSheetOpen(false)
  setReviewDraftText('')
  setReviewDraftError('')
}

async function handleSaveReview() {
  const token = getAuthToken()
  const username = author?.page_username || pageUsername
  const reviewText = reviewDraftText.trim()

  if (!token) {
    navigate('/login')
    return
  }

  if (!username || displayAuthor.is_owner || savingReview) return

  if (reviewText.length < 25) {
    setReviewDraftError('Review must be at least 25 characters.')
    return
  }

  try {
    setSavingReview(true)
    setReviewDraftError('')
    setMessage('')

    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/reviews/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_recommended: reviewDraftRecommended,
        review_text: reviewText,
      }),
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to save review')
    }

    await loadAuthorReviews(username)
    setReviewSheetOpen(false)
    setReviewDraftText('')
    setReviewDraftError('')
  } catch (error) {
    setReviewDraftError(error.message || 'Failed to save review')
  } finally {
    setSavingReview(false)
  }
}




async function handleRemoveReview() {
  const token = getAuthToken()
  const username = author?.page_username || pageUsername

  if (!token) {
    navigate('/login')
    return
  }

  if (!username || !myReview || savingReview) return

  try {
    setSavingReview(true)
    setReviewDraftError('')
    setMessage('')

    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/reviews/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to remove review')
    }

    await loadAuthorReviews(username)
    setReviewSheetOpen(false)
    setReviewDraftText('')
    setReviewDraftError('')
  } catch (error) {
    setReviewDraftError(error.message || 'Failed to remove review')
  } finally {
    setSavingReview(false)
  }
}



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
  
function handleOpenMessage() {
  const value = String(author?.profile_details?.message_url || author?.profile_details?.messenger || '').trim()
  if (!value) return setMessage('Message link is not available.')
  window.open(/^https?:\/\//i.test(value) ? value : `https://${value}`, '_blank', 'noopener,noreferrer')
}
  
 const actionButtons = useMemo(() => {
  if (!ownerResolved || !author) return []

  if (author?.is_owner) {
    return [
      { label: 'Dashboard', icon: 'fa-chart-simple', type: 'primary', onClick: () => navigate('/author/page/dashboard') },
      { label: 'Advertise', icon: 'fa-bullhorn', type: 'secondary', onClick: () => setMessage('Advertise is coming soon.') },
    ]
  }

  if (author?.is_following) {
    return [
      {
        label: 'Following',
        icon: 'fa-user-check',
        type: 'primary',
        onClick: handleOpenFollowSettings,
        disabled: followLoading,
      },
      {
        label: 'Message',
        icon: 'fa-comment',
        type: 'secondary',
        onClick: handleOpenMessage,
      },
    ]
  }

  return [
    {
      label: 'Follow',
      icon: 'fa-user-plus',
      type: 'primary',
      onClick: handleToggleFollow,
      disabled: followLoading,
    },
  ]
}, [ownerResolved, author?.is_owner, author?.is_following, author?.profile_details, followLoading, navigate])

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
  folder: cropMode === 'avatar' ? 'author_page_avatar' : 'author_page_cover',
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

  function handleUploadSlide() {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  if (savingSlide) return

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

    reader.onload = async () => {
      try {
        setSavingSlide(true)
        setMessage('Uploading slide to Cloudflare...')

        const imageUrl = await uploadImageToStorage({
          token,
          imageDataUrl: String(reader.result || ''),
          folder: 'author_page_slide',
          fileName: `author-slide-${Date.now()}.jpg`,
        })

        const currentSlides = Array.isArray(author?.slide_urls) ? author.slide_urls : []
        const nextSlides = [imageUrl, ...currentSlides].filter(Boolean).slice(0, 5)

        const updatedAuthorPage = await saveAuthorProfileImages({
          token,
          slideUrls: nextSlides,
        })

        if (updatedAuthorPage) {
          localStorage.setItem('shadow_author_page', JSON.stringify(updatedAuthorPage))
          setAuthor((current) => normalizeAuthor(updatedAuthorPage, current?.page_username || pageUsername, updatedAuthorPage, true))
        }

        setMessage('Slide uploaded.')
      } catch (error) {
        setMessage(error.message || 'Failed to upload slide')
      } finally {
        setSavingSlide(false)
      }
    }

    reader.readAsDataURL(file)
  }

  input.click()
}


  function handleReaderBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  useEffect(() => {
    if (!ownerResolved || author?.is_owner) {
      setReaderHeaderSolid(false)
      setReaderHeaderTitle(false)
      setTabsFrozen(false)
      return undefined
    }

    function syncReaderHeader() {
      const coverBottom = coverRef.current?.getBoundingClientRect().bottom ?? 0
      const profileBottom = profileRef.current?.getBoundingClientRect().bottom ?? 0
      const tabsTop = tabsRef.current?.getBoundingClientRect().top ?? 999

      setReaderHeaderSolid(coverBottom <= 54)
      setReaderHeaderTitle(profileBottom <= 58)
      setTabsFrozen(tabsTop <= 55)
    }

    syncReaderHeader()
    window.addEventListener('scroll', syncReaderHeader, { passive: true })

    return () => window.removeEventListener('scroll', syncReaderHeader)
  }, [ownerResolved, author?.id, author?.is_owner])

 useEffect(() => {
  function handleTabsStickyState() {
    const tabsElement = document.getElementById('author-page-tabs')
    if (!tabsElement) return

    const rect = tabsElement.getBoundingClientRect()
    const freezeTop = !ownerResolved || author?.is_owner ? 0 : 54

    setTabsFrozen(rect.top <= freezeTop && window.scrollY > 20)
  }

  handleTabsStickyState()
  window.addEventListener('scroll', handleTabsStickyState, { passive: true })
  window.addEventListener('resize', handleTabsStickyState)

  return () => {
    window.removeEventListener('scroll', handleTabsStickyState)
    window.removeEventListener('resize', handleTabsStickyState)
  }
}, [ownerResolved, author?.is_owner])
  

if (!loading && pageError) {
  return <AuthorNotFound onBack={handleReaderBack} />
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

  const authorWorks = Array.isArray(author?.works)
  ? author.works
  : Array.isArray(author?.stories)
    ? author.stories
    : Array.isArray(displayAuthor?.works)
      ? displayAuthor.works
      : []

function ReviewStarIcon({ className = 'h-[31px] w-[31px]' }) {
  return (
    <svg
      className={`${className} shrink-0 text-[#111827]`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.95c.2 0 .37.11 .46.29l2.18 4.42c.07.15.22.26.38.28l4.88.71c.41.06.57.56.28.85l-3.53 3.44c-.12.12-.18.29-.15.46l.83 4.86c.07.41-.36.72-.73.53l-4.36-2.29c-.15-.08-.33-.08-.48 0L7.4 19.79c-.37.19-.8-.12-.73-.53l.83-4.86c.03-.17-.03-.34-.15-.46L3.82 10.5c-.29-.29-.13-.79.28-.85l4.88-.71c.16-.02.31-.13.38-.28l2.18-4.42c.09-.18.26-.29.46-.29z" />
    </svg>
  )
}

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">

      <ReportModal
        open={reportPageOpen}
        reportType="author_page"
        targetId={displayAuthor?.id}
        targetTitle={displayAuthor?.page_name}
        onClose={() => setReportPageOpen(false)}
      />
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

      <AuthorPageSwitcherSheet
  open={pageSwitcherOpen}
  author={displayAuthor}
  readerUser={readerUser}
  onClose={() => setPageSwitcherOpen(false)}
  onPage={() => setPageSwitcherOpen(false)}
  onOwnAccount={handleSwitchToReaderAccount}
  onManageAccount={() => {
    setPageSwitcherOpen(false)
    navigate('/settings')
  }}
/>

      <AuthorOwnerMenuSheet
  open={authorMenuOpen}
  author={displayAuthor}
  readerUser={readerUser}
  onClose={() => setAuthorMenuOpen(false)}
  onPage={() => setAuthorMenuOpen(false)}
  onOwnAccount={() => {
    setAuthorMenuOpen(false)
    handleSwitchToReaderAccount()
  }}
  onManageAccount={() => {
    setAuthorMenuOpen(false)
    navigate('/settings')
  }}
 onOpenFinance={() => {
  setAuthorMenuOpen(false)
  navigate('/author/page/finance')
}}
onOpenStoreSetting={() => {
  setAuthorMenuOpen(false)
  navigate('/author/page-settings')
}}
/>

      <SwitchingAccountScreen
  open={switchingToReader}
  name={readerName}
  avatarUrl={readerAvatar}
  avatarLetter={readerLetter}
/>

      <CoverOptionsSheet
  open={coverOptionsOpen}
  savingSlide={savingSlide}
  onClose={() => setCoverOptionsOpen(false)}
  onSeeCover={() => {
    setCoverOptionsOpen(false)
    if (displayAuthor.cover_url) {
      window.open(displayAuthor.cover_url, '_blank', 'noopener,noreferrer')
    } else {
      setMessage('No cover photo yet.')
    }
  }}
  onUploadCover={() => {
    setCoverOptionsOpen(false)
    openCropEditor('cover')
  }}
 onChooseCover={() => {
  setCoverOptionsOpen(false)
  handleUploadSlide()
}}
/>

      {reviewSettingsOpen ? (
  <div className="fixed inset-0 z-[290] bg-white">
    <header className="flex h-[52px] items-center justify-center border-b border-[#eef0f3] px-4">
      <button
        type="button"
        onClick={() => setReviewSettingsOpen(false)}
        className="absolute left-3 flex h-10 w-10 items-center justify-center text-[#111827] active:opacity-70"
        aria-label="Close review settings"
      >
        <i className="fa-solid fa-xmark text-[18px]" />
      </button>

      <h1 className="text-[15px] font-bold text-[#111827]">Reviews</h1>
    </header>

    <main className="px-4 pt-8">
      <h2 className="text-[17px] font-normal leading-6 text-[#111827]">
        Allow readers to view and write reviews on your page?
      </h2>

      <p className="mt-2 text-[13px] font-normal leading-5 text-[#6b7280]">
        Reviews help readers decide whether your page is worth following. You can turn reviews off anytime. Existing reviews will be hidden from your page until you turn them on again.
      </p>

      <label className="mt-8 flex items-center justify-between gap-4">
        <span className="text-[15px] font-normal text-[#111827]">
          Allow reviews on this page
        </span>

        <input
          type="checkbox"
          checked={allowReviewsDraft}
          onChange={(event) => setAllowReviewsDraft(event.target.checked)}
          className="h-5 w-5 accent-[#111827]"
        />
      </label>
    </main>

    <div className="fixed bottom-0 left-0 right-0 border-t border-[#eef0f3] bg-white px-4 py-3">
      <button
        type="button"
        disabled={allowReviewsDraft === allowReviewsSaved}
        onClick={() => {
          setAllowReviewsSaved(allowReviewsDraft)
          setReviewSettingsOpen(false)
          setMessage('Review settings saved.')
        }}
        className="h-12 w-full rounded-[10px] bg-[#111827] text-[14px] font-medium text-white active:scale-[0.99] disabled:bg-[#e2e5ea] disabled:text-[#a5adba]"
      >
        Save
      </button>
    </div>
  </div>
) : null}

      {reviewsListOpen ? (
  <div className="fixed inset-0 z-[280] bg-[#f3f4f6]">
    <header className="sticky top-0 z-10 flex h-[54px] items-center border-b border-[#e5e7eb] bg-white px-3">
      <button
        type="button"
        onClick={() => setReviewsListOpen(false)}
        className="flex h-10 w-10 items-center justify-center text-[#111827] active:opacity-70"
        aria-label="Back to reviews"
      >
        <i className="fa-solid fa-chevron-left text-[20px]" />
      </button>

      <h1 className="ml-2 text-[22px] font-normal text-[#111827]">Reviews</h1>
    </header>

    <main className="pb-8">
      <div className="flex items-center gap-2 bg-white px-4 py-3 text-[16px] font-bold leading-6 text-[#111827]">
        <span>{reviewSummary.recommend_percent || 0}% recommend ({reviewSummary.total_count || 0} Reviews)</span>
        <button
          type="button"
          onClick={() => setReviewInfoOpen(true)}
          className="flex h-6 w-6 items-center justify-center text-[#6b7280] active:opacity-70"
          aria-label="About review score"
        >
          <i className="fa-solid fa-circle-info text-[15px]" />
        </button>
      </div>

      <div className="space-y-3 px-3 pt-3">
        {reviewItems.length ? (
          reviewItems.map((review) => {
            const reviewer = review.reviewer || review.user || review.reader || {}
            const name = review.reviewer_name || reviewer.name || review.name || 'Reader'
            const avatarUrl = review.reviewer_avatar_url || reviewer.avatar_url || review.avatar_url || ''
            const text = review.review_text || review.text || ''
            const recommended = review.is_recommended !== false
            const dateText = review.created_at
              ? new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : ''

            return (
              <article
                key={review.id || `${name}-${text}`}
                className="rounded-[14px] bg-white px-3 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
              >
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5e7eb] text-[16px] font-bold text-[#111827]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      String(name || 'R').slice(0, 1).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[16px] leading-6 text-[#111827]">
                          <span className="font-bold">{name}</span>
                          <span className="ml-2 font-normal text-[#6b7280]">
                            {recommended ? 'recommends' : "doesn't recommend"}
                          </span>
                        </div>

                        <div className="text-[15px] font-bold leading-5 text-[#111827]">
                          {displayAuthor.page_name}
                        </div>

                        {dateText ? (
                          <div className="mt-0.5 text-[13px] font-normal text-[#6b7280]">
                            {dateText} · <i className="fa-solid fa-earth-asia text-[12px]" />
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReviewOption(review)
                          setReviewOptionsOpen(true)
                        }}
                        className="flex h-8 w-8 items-center justify-center text-[#6b7280] active:opacity-70"
                        aria-label="Review options"
                      >
                        <i className="fa-solid fa-ellipsis text-[16px]" />
                      </button>
                    </div>

                    {text ? (
                      <p className="mt-3 whitespace-pre-line text-[17px] font-normal leading-7 text-[#111827]">
                        {text}
                      </p>
                    ) : null}

                    <div className="mt-5 flex items-center gap-7 text-[#6b7280]">
                      <button type="button" className="flex items-center gap-1 active:opacity-70">
                        <i className="fa-regular fa-thumbs-up text-[22px]" />
                      </button>

                      <button type="button" className="flex items-center gap-1 active:opacity-70">
                        <i className="fa-regular fa-comment text-[22px]" />
                      </button>

                      <button type="button" className="flex items-center gap-1 active:opacity-70">
                        <i className="fa-solid fa-share text-[21px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <div className="rounded-[14px] bg-white px-4 py-8 text-[14px] font-medium text-[#8b93a1]">
            No reviews yet.
          </div>
        )}
      </div>
    </main>

    {reviewInfoOpen ? (
      <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/35">
        <button
          type="button"
          aria-label="Close review info"
          onClick={() => setReviewInfoOpen(false)}
          className="absolute inset-0"
        />

        <div className="relative w-full rounded-t-[18px] bg-white px-4 pb-6 pt-3 shadow-2xl md:max-w-[420px] md:rounded-[18px]">
          <div className="mx-auto mb-5 h-1 w-11 rounded-full bg-[#9ca3af]" />

          <div className="text-center text-[16px] font-bold text-[#111827]">
            {reviewSummary.recommend_percent || 0}%
          </div>

          <p className="mt-1 text-center text-[12px] font-normal text-[#6b7280]">
            Based on {reviewSummary.total_count || 0} reader reviews
          </p>

          <div className="mt-5 border-t border-[#eef0f3] pt-4">
            <h2 className="text-[14px] font-bold text-[#111827]">How Shadow reviews work</h2>
            <p className="mt-2 text-[13px] font-normal leading-5 text-[#374151]">
              This score is based on reader reviews for this author page. Readers can choose whether they recommend the page and leave a public review. The percentage shows how many active reviews recommend it.
            </p>
          </div>
        </div>
      </div>
    ) : null}

    {reviewOptionsOpen ? (
      <div className="fixed inset-0 z-[310] flex items-end justify-center bg-black/35">
        <button
          type="button"
          aria-label="Close review options"
          onClick={() => setReviewOptionsOpen(false)}
          className="absolute inset-0"
        />

        <div className="relative w-full rounded-t-[18px] bg-white px-4 pb-6 pt-3 shadow-2xl md:max-w-[420px] md:rounded-[18px]">
          <div className="mx-auto mb-4 h-1 w-11 rounded-full bg-[#9ca3af]" />

          <button
            type="button"
            onClick={() => {
              setReviewOptionsOpen(false)
              setMessage('Report review is coming soon.')
            }}
            className="flex h-12 w-full items-center gap-3 text-left text-[15px] font-medium text-[#111827] active:opacity-70"
          >
            <i className="fa-regular fa-flag w-6 text-center text-[17px]" />
            Report review
          </button>

          <button
            type="button"
            onClick={async () => {
              const reviewId = selectedReviewOption?.id || ''
              const link = `${window.location.origin}${window.location.pathname}${reviewId ? `?review=${reviewId}` : ''}`

              try {
                await navigator.clipboard.writeText(link)
                setMessage('Review link copied.')
              } catch {
                setMessage(link)
              }

              setReviewOptionsOpen(false)
            }}
            className="flex h-12 w-full items-center gap-3 text-left text-[15px] font-medium text-[#111827] active:opacity-70"
          >
            <i className="fa-regular fa-copy w-6 text-center text-[17px]" />
            Copy review link
          </button>

          <button
            type="button"
            onClick={() => setReviewOptionsOpen(false)}
            className="mt-2 h-11 w-full rounded-[10px] bg-[#f3f4f6] text-[15px] font-medium text-[#111827] active:scale-[0.99]"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : null}
  </div>
) : null}


      {reviewsOverviewOpen ? (
  <div className="fixed inset-0 z-[250] flex items-end justify-center bg-black/45">
  <button
    type="button"
    aria-label="Close reviews"
    onClick={handleCloseReviewsOverview}
    className="absolute inset-0"
  />

  <div
    className="relative max-h-[86vh] w-full overflow-y-auto rounded-t-[26px] bg-[#f3f4f6] px-4 pb-5 pt-0 shadow-2xl md:max-w-[520px] md:rounded-[26px]"
    style={{
      transform: `translateY(${reviewsOverviewDragY}px)`,
      transition: reviewsOverviewDragY ? 'none' : 'transform 180ms ease',
    }}
  >
    <div
      role="button"
      tabIndex={0}
      onPointerDown={handleReviewsOverviewPointerDown}
      onPointerMove={handleReviewsOverviewPointerMove}
      onPointerUp={handleReviewsOverviewPointerEnd}
      onPointerCancel={handleReviewsOverviewPointerEnd}
      className="mx-auto mb-2 flex h-10 w-24 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
    >
      <div className="h-1.5 w-14 rounded-full bg-[#9ca3af]" />
    </div>

      <section className="rounded-[14px] bg-white px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#111827]">Reviews</h2>
          {displayAuthor.is_owner ? (
            <button
              type="button"
              onClick={() => {
  setAllowReviewsDraft(allowReviewsSaved)
  setReviewSettingsOpen(true)
}}
              className="text-[14px] font-medium text-[#374151] active:opacity-70"
            >
              Edit
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <ReviewStarIcon />
          <div>
            <div className="text-[15px] font-normal leading-5 text-[#111827]">
              {reviewLoading ? 'Loading...' : `${reviewSummary.recommend_percent || 0}% recommended`}
            </div>
            <div className="text-[15px] font-normal leading-5 text-[#111827]">
              Based on the opinions of {reviewSummary.total_count || 0} people
            </div>
          </div>
        </div>

        {!displayAuthor.is_owner ? (
          <button
            type="button"
            onClick={handleOpenMessage}
            className="mt-5 flex h-10 w-full items-center justify-center rounded-[9px] bg-[#e5e7eb] text-[15px] font-medium text-[#111827] active:scale-[0.99]"
          >
            <i className="fa-brands fa-facebook-messenger mr-2 text-[15px]" />
            Message {displayAuthor.page_name}
          </button>
        ) : null}
      </section>

      <section className="mt-4 rounded-[14px] bg-white px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
  <h3 className="text-[17px] font-bold text-[#111827]">Recent reviews</h3>
  <button
    type="button"
    onClick={() => setReviewsListOpen(true)}
    className="text-[14px] font-medium text-[#374151] active:opacity-70"
  >
    See all
  </button>
</div>

        {!displayAuthor.is_owner ? (
          <div className="mb-4 rounded-[14px] bg-[#f8fafc] px-4 py-3">
            <div className="text-[16px] font-normal leading-6 text-[#111827]">
              Do you recommend {displayAuthor.page_name}?
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOpenReviewSheet(true)}
                className="h-9 rounded-[9px] bg-[#e5e7eb] text-[15px] font-medium text-[#111827] active:scale-[0.99]"
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => handleOpenReviewSheet(false)}
                className="h-9 rounded-[9px] bg-[#e5e7eb] text-[15px] font-medium text-[#111827] active:scale-[0.99]"
              >
                No
              </button>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          {reviewItems.length ? (
            reviewItems.slice(0, 4).map((review) => {
              const reviewer = review.reviewer || review.user || review.reader || {}
              const name = review.reviewer_name || reviewer.name || review.name || 'Reader'
              const avatarUrl = review.reviewer_avatar_url || reviewer.avatar_url || review.avatar_url || ''
              const text = review.review_text || review.text || ''
              const recommended = review.is_recommended !== false

              return (
                <div key={review.id || `${name}-${text}`} className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5e7eb] text-[14px] font-bold text-[#111827]">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      String(name || 'R').slice(0, 1).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] leading-5 text-[#111827]">
                      <span className="font-medium">{name}</span>{' '}
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] align-middle text-white">
                        <i className="fa-solid fa-star text-[9px]" />
                      </span>{' '}
                      <span className="font-normal text-[#111827]">
                        {recommended ? 'recommends' : "doesn't recommend"}
                      </span>
                    </div>

                    {text ? (
                      <p className="line-clamp-2 text-[13px] font-normal leading-5 text-[#6b7280]">
                        {text}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-3 text-[14px] font-medium text-[#8b93a1]">
              No reviews yet.
            </div>
          )}
        </div>
      </section>
    </div>
  </div>
) : null}

{reviewSheetOpen ? (
  <div className="fixed inset-0 z-[270] flex items-center justify-center bg-black/55 px-8">
    <button
      type="button"
      aria-label="Close review editor"
      onClick={handleCloseReviewSheet}
      className="absolute inset-0"
    />

    <div className="relative w-full max-w-[500px] rounded-[14px] bg-white px-4 pb-4 pt-7 shadow-2xl">
      <h2 className="mx-auto max-w-[380px] text-center text-[18px] font-normal leading-6 text-[#111827]">
        What would you like to say about <span className="font-bold">{displayAuthor.page_name}</span>?
      </h2>

      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-[9px] bg-[#e5e7eb] px-4 py-2 text-[14px] font-medium text-[#111827]">
          <i className="fa-solid fa-globe text-[12px]" />
          Public
          <i className="fa-solid fa-caret-down text-[11px]" />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[14px] font-bold text-white">
          {readerAvatar ? (
            <img src={readerAvatar} alt={readerName} className="h-full w-full object-cover" />
          ) : (
            readerLetter
          )}
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            value={reviewDraftText}
            onChange={(event) => {
              setReviewDraftText(event.target.value)
              if (reviewDraftError) setReviewDraftError('')
            }}
            placeholder="Your review"
            className="h-[390px] w-full resize-none rounded-[14px] border border-[#cfd4dc] bg-white px-3 py-3 text-[20px] font-normal leading-7 text-[#111827] outline-none focus:border-[#2563eb]"
          />

          <div className="mt-2 text-[13px] font-normal">
            <span className={reviewDraftText.trim().length < 25 ? 'text-[#e5484d]' : 'text-[#6b7280]'}>
              {reviewDraftText.trim().length} / 25 · Reviews must be at least 25 characters
            </span>
          </div>

          {reviewDraftError ? (
            <div className="mt-2 text-[13px] font-medium text-[#e5484d]">
              {reviewDraftError}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={savingReview || reviewDraftText.trim().length < 25}
          onClick={handleSaveReview}
          className="h-12 rounded-[10px] bg-[#111827] text-[17px] font-medium text-white active:scale-[0.99] disabled:bg-[#e2e5ea] disabled:text-[#a5adba]"
        >
          {savingReview ? 'Sharing...' : 'Share'}
        </button>

        <button
          type="button"
          onClick={handleCloseReviewSheet}
          className="h-12 rounded-[10px] bg-[#e5e7eb] text-[17px] font-medium text-[#111827] active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>

      {reviewDiscardOpen ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[14px] bg-black/45 px-8">
          <div className="w-full rounded-[8px] bg-white px-6 py-5 shadow-2xl">
            <h3 className="text-[17px] font-normal text-[#111827]">Discard review?</h3>
            <p className="mt-3 text-[18px] font-normal leading-7 text-[#4b5563]">
              Reviews help other readers understand this page. Are you sure you want to discard your draft?
            </p>

            <div className="mt-6 flex justify-end gap-6">
              <button
                type="button"
                onClick={handleDiscardReviewDraft}
                className="text-[16px] font-normal text-[#6b7280] active:opacity-70"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={() => setReviewDiscardOpen(false)}
                className="text-[16px] font-normal text-[#2563eb] active:opacity-70"
              >
                Keep Writing
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
) : null}



      {ownerResolved && !displayAuthor.is_owner ? (
 <header className={`fixed left-0 right-0 top-0 z-[120] transition ${
  readerHeaderSolid ? 'bg-white shadow-sm' : 'bg-transparent'
}`}>
  <div className="mx-auto flex h-[54px] max-w-[980px] items-center justify-between px-3">
   <button
  type="button"
  onClick={handleReaderBack}
  className={`flex h-10 w-10 items-center justify-center rounded-full ${
    readerHeaderSolid ? 'bg-white text-[#111827] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
  }`}
  aria-label="Back"
>
  <i className="fa-solid fa-chevron-left text-[15px]" />
</button>
    <div className={`min-w-0 flex-1 px-3 text-center text-[15px] font-semibold text-[#111827] transition ${
      readerHeaderTitle ? 'opacity-100' : 'opacity-0'
    }`}>
      <span className="line-clamp-1">{displayAuthor.page_name}</span>
    </div>
<div className="flex items-center gap-2">
  <button
    type="button"
    onClick={() => navigate('/author/cart')}
    className={`flex h-10 w-10 items-center justify-center rounded-full ${
      readerHeaderSolid ? 'bg-white text-[#111827] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
    }`}
    aria-label="Open cart"
  >
    <span className="relative flex h-10 w-10 items-center justify-center">
  <i className="fa-solid fa-cart-shopping text-[15px]" />
  {readerCartCount > 0 ? (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-black leading-none text-white">
      {readerCartCount > 99 ? '99+' : readerCartCount}
    </span>
  ) : null}
</span>
  </button>

 <button
        type="button"
        onClick={() => setReportPageOpen(true)}
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          readerHeaderSolid ? 'bg-white text-[#111827] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
        }`}
        aria-label="Report Author Page"
      >
        <i className="fa-regular fa-flag text-[15px]" />
      </button>
        </div>
  </div>
</header>
) : null}
      
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

        <section className="overflow-hidden bg-white">
          <div
  role="button"
  tabIndex={0}
  onClick={() => {
    if (displayAuthor.is_owner) setCoverOptionsOpen(true)
  }}
  onKeyDown={(event) => {
    if (displayAuthor.is_owner && (event.key === 'Enter' || event.key === ' ')) {
      setCoverOptionsOpen(true)
    }
  }}
  ref={coverRef}
className="relative h-[210px] cursor-pointer bg-[#111827] sm:h-[280px]"
>
  {displayAuthor.cover_url ? (
    <img
      src={displayAuthor.cover_url}
      alt={displayAuthor.page_name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
  )}
   <div className="absolute inset-0 bg-black/15" />     

    {displayAuthor.is_owner ? (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      setAuthorMenuOpen(true)
    }}
    className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] active:scale-95"
    aria-label="Author menu"
  >
    <i className="fa-solid fa-bars text-[18px]" />
  </button>
) : null}        

   {displayAuthor.is_owner ? (
  <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        navigate('/author/page/edit?section=cover')
      }}
      className="flex h-9 w-9 items-center justify-center text-white drop-shadow active:scale-95"
      aria-label="Edit page"
    >
      <i className="fa-solid fa-pen text-[14px]" />
    </button>

    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        navigate('/author/page-options')
      }}
      className="flex h-9 w-9 items-center justify-center text-white drop-shadow active:scale-95"
      aria-label="Page options"
    >
      <i className="fa-solid fa-ellipsis text-[16px]" />
    </button>
  </div>
) : null}
            
  {displayAuthor.is_owner ? (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        setCoverOptionsOpen(true)
      }}
      className="absolute bottom-5 right-3 flex h-11 w-11 items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] active:scale-95"
    >
      <i className="fa-solid fa-camera text-[22px]" />
    </button>
  ) : null}
</div>

          <div ref={profileRef} className="relative px-4 pb-5 sm:px-6">
            <div className="pointer-events-none absolute -top-[14px] left-0 right-0 h-[36px] rounded-t-[16px] bg-white" />

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="relative -mt-[42px] h-[92px] w-[92px] shrink-0 rounded-full border-[3px] border-white bg-[#f3f4f6] shadow-sm sm:-mt-[52px] sm:h-[112px] sm:w-[112px]">
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
                      className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-sm active:scale-95 sm:h-8 sm:w-8"
                    >
                      <i className="fa-solid fa-camera text-[11px]" />
                    </button>
                  ) : null}
                </div>

               <div className="min-w-0 flex-1 pt-1 sm:pt-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {loading ? (
                        <div className="h-8 w-52 animate-pulse rounded-full bg-[#f3f4f6]" />
                      ) : (
                        <h1 className="line-clamp-1 text-[18px] font-bold leading-tight tracking-tight text-[#111827] sm:text-[22px]">
                          {displayAuthor.page_name}
                        </h1>
                      )}

                      
                    </div>

                   {displayAuthor.is_owner ? (
  <button
    type="button"
    onClick={() => setPageSwitcherOpen(true)}
    className="relative mt-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] ring-1 ring-black/5 transition active:scale-95"
    aria-label="Switch to Reader account"
  >
    <i className="fa-solid fa-chevron-down text-[12px]" />
    {readerNotificationCount > 0 ? (
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white" />
    ) : null}
  </button>
) : null}
                  </div>

                  <div className="-mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#111827] sm:text-[12px]">
                    <span>
                      <strong>{formatCompactNumber(displayAuthor.works_count)}</strong>{' '}
                      <span className="text-[#6b7280]">Works</span>
                    </span>
                   <button
  type="button"
  onClick={() => {
    if (displayAuthor.page_username) {
      navigate(`/author/page/${displayAuthor.page_username}/followers`)
    }
  }}
  className="-mx-1 rounded-md px-1.5 py-1 text-left cursor-pointer active:bg-[#f3f4f6] active:opacity-70"
>
  <strong>{formatCompactNumber(displayAuthor.followers_count || displayAuthor.fans_count)}</strong>{' '}
  <span className="text-[#6b7280]">Followers</span>
</button>
                    <span>
                      <strong>{formatCompactNumber(authorPostsCount)}</strong>{' '}
                      <span className="text-[#6b7280]">Posts</span>
                    </span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="mt-4 h-4 w-full max-w-[420px] animate-pulse rounded-full bg-[#f3f4f6]" />
              ) : displayAuthor.bio ? (
                <p className="mt-4 line-clamp-2 max-w-[620px] text-[13px] font-medium leading-6 text-[#374151] sm:text-[14px]">
                  {displayAuthor.bio}
                </p>
              ) : null}

    {ownerResolved ? (
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          {actionButtons.map((button) => (
            <button
              key={button.label}
              type="button"
              onClick={button.onClick}
              disabled={button.disabled}
              className={`h-10 flex-1 rounded-[12px] text-[13px] font-normal transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                button.type === 'primary'
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#f3f4f6] text-[#111827]'
              }`}
            >
              <i className={`fa-solid ${button.icon} mr-2 text-[12px]`} />
              {button.disabled ? 'Loading...' : button.label}
            </button>
          ))}
        </div>

        {displayAuthor.is_owner ? (
          <button
            type="button"
            onClick={() => navigate('/author/page/story/create')}
            className="flex h-10 w-full items-center justify-center rounded-[12px] bg-[#f3f4f6] text-[13px] font-normal text-[#111827] transition active:scale-[0.98]"
          >
            <img
              src="/assets/Icons/Add Story.svg"
              alt=""
              className="mr-2 h-4 w-4 object-contain"
            />
            Add to story
          </button>
        ) : null}
      </div>
    ) : null}
            </div>
          </div>

        </section>

       <section
  id="author-page-tabs"
  ref={tabsRef}
  className={`sticky z-50 border-b border-[#eef0f3] bg-white ${
    !ownerResolved || displayAuthor.is_owner ? 'top-0' : 'top-[54px]'
  } ${tabsFrozen ? 'shadow-sm' : ''}`}
>
  <div className="mx-auto h-[50px] max-w-[980px] px-4">
  <div className="flex h-full items-center justify-start gap-2">
    {tabs.map((tab) => {
      const active = activeTab === tab

      return (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-[13px] font-medium leading-none transition-colors ${
            active
              ? 'bg-[#f3f4f6] text-[#111827]'
              : 'bg-transparent text-[#9ca3af]'
          }`}
        >
          {tab}
        </button>
      )
    })}
   </div>
</div>
</section>

        <section className="min-h-[calc(100vh-50px)] bg-white px-4 pb-24 pt-4 sm:px-6">
         {activeTab === 'Posts' ? (
  <div className="space-y-5 pb-4">
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#111827]">Details</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=details')} className="flex h-8 w-8 items-center justify-center text-[#6b7280] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

     <div className="space-y-4 text-[14px] font-normal text-[#111827]">
  <button
    type="button"
    onClick={handleOpenReviewsOverview}
    className="flex w-full items-center gap-4 text-left active:opacity-70"
  >
    <ReviewStarIcon className="h-[31px] w-[31px]" />
    <span>
      {reviewLoading
        ? 'Loading reviews...'
        : `${reviewSummary.recommend_percent || 0}% recommend (${reviewSummary.total_count || 0} Reviews)`}
    </span>
  </button>

  <div className="flex items-center gap-4">
    <svg
      className="h-[26px] w-8 shrink-0 text-[#111827]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.8 4.5h8.7c1.25 0 2.25 1 2.25 2.25v12.75H7.2c-1.05 0-1.9-.85-1.9-1.9V5c0-.28.22-.5.5-.5z" />
      <path d="M7.2 19.5c-1.05 0-1.9-.85-1.9-1.9s.85-1.9 1.9-1.9h9.55" />
      <path d="M8.3 7.25h5.65" />
      <path d="M8.3 10.15h4.4" />
    </svg>
    <span>{profileDetails.price_range ? `Book · ${profileDetails.price_range}` : 'Book'}</span>
  </div>

  {profileDetails.address ? (
    <div className="flex items-start gap-4">
      <span className="flex w-8 shrink-0 items-center justify-center pt-0.5 text-[#111827]" aria-hidden="true">
  <svg
    className="h-[18px] w-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21s6-5.35 6-11a6 6 0 0 0-12 0c0 5.65 6 11 6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
</span>
      <span className="whitespace-pre-wrap break-words leading-5">
        {profileDetails.address}
      </span>
    </div>
  ) : null}

  {getCompactHoursText(profileDetails) ? (
  <div className="flex items-center gap-4">
    <span className="flex w-8 shrink-0 items-center justify-center text-[#111827]">
      <i className="fa-regular fa-clock text-[16px]" />
    </span>
    <span className="line-clamp-1 break-words leading-5">
      {getCompactHoursText(profileDetails)}
    </span>
  </div>
) : null}
</div>
    </section>

   

    {profileDetails.website_url ? (
  <section>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[17px] font-semibold text-[#111827]">Links</h2>
      {displayAuthor.is_owner ? (
        <button type="button" onClick={() => navigate('/author/page/edit?section=links')} className="flex h-8 w-8 items-center justify-center text-[#6b7280] active:scale-95">
          <i className="fa-solid fa-pen text-[14px]" />
        </button>
      ) : null}
    </div>

    <a
      href={
        String(profileDetails.website_url).startsWith('http://') ||
        String(profileDetails.website_url).startsWith('https://')
          ? profileDetails.website_url
          : `https://${profileDetails.website_url}`
      }
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center gap-4 text-left text-[14px] font-normal text-[#111827] active:opacity-70"
    >
      <span className="flex w-8 shrink-0 items-center justify-center text-[#111827]">
  <i className="fa-solid fa-link text-[13px]" />
</span>

      <span>{profileDetails.website_label || 'Website'}</span>
    </a>
  </section>
) : null}
    
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#111827]">Facebook Page</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=facebook')} className="flex h-8 w-8 items-center justify-center text-[#6b7280] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

      <button type="button" onClick={() => setMessage('Facebook Page link will be available after update.')} className="flex w-full items-center gap-4 text-left active:scale-[0.99]">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6] ring-1 ring-black/10">
          {displayAuthor.avatar_url ? (
            <img src={displayAuthor.avatar_url} alt={displayAuthor.page_name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[14px] font-normal text-[#111827]">{displayAuthor.page_name}</div>
          <div className="mt-0.5 text-[12px] font-normal text-[#6b7280]">Facebook Page</div>
        </div>
      </button>
    </section>

    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#111827]">Contact info</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=contact')} className="flex h-8 w-8 items-center justify-center text-[#6b7280] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

      <div className="space-y-4 text-[14px] font-normal text-[#111827]">
  {profileDetails.social_media ? (
    <div className="flex items-center gap-4">
      <i className="fa-solid fa-at w-8 text-center text-[18px]" />
      <span>{profileDetails.social_media}</span>
    </div>
  ) : null}

  {profileDetails.phone ? (
    <div className="flex items-center gap-4">
      <svg
  className="h-[22px] w-8 shrink-0 text-[#111827]"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M7.2 4.6l2.25-.55c.45-.11.92.11 1.11.53l1.02 2.26c.17.38.08.82-.22 1.11L10.05 9.2c.86 1.86 2.38 3.38 4.24 4.24l1.25-1.31c.29-.3.73-.39 1.11-.22l2.26 1.02c.42.19.64.66.53 1.11l-.55 2.25c-.12.5-.57.86-1.08.86C11.72 17.15 6.35 11.78 6.35 5.69c0-.51.35-.96.85-1.09z" />
</svg>
      <span>{profileDetails.phone}</span>
    </div>
  ) : null}

  {profileDetails.email ? (
    <div className="flex items-center gap-4">
      <svg
  className="h-[22px] w-8 shrink-0 text-[#111827]"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M4.8 6.7h14.4c.55 0 1 .45 1 1v9.1c0 .55-.45 1-1 1H4.8c-.55 0-1-.45-1-1V7.7c0-.55.45-1 1-1z" />
  <path d="M4.2 7.3l7.8 6.1 7.8-6.1" />
</svg>
      <span>{profileDetails.email}</span>
    </div>
  ) : null}

  

  {profileDetails.telegram ? (
    <div className="flex items-center gap-4">
      <svg
  className="h-[22px] w-8 shrink-0 text-[#111827]"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M20.2 4.8L4.6 10.85c-.58.22-.56 1.05.03 1.24l4.15 1.31 1.6 4.92c.19.58.96.69 1.31.19l2.29-3.25 4.2 3.08c.52.38 1.26.08 1.37-.55l2.1-11.85c.12-.69-.78-1.39-1.45-1.14z" />
  <path d="M8.95 13.35l6.95-4.55" />
  <path d="M10.38 18.15l.22-4.22 8.95-8.33" />
</svg>
      <span>{profileDetails.telegram}</span>
    </div>
  ) : null}
</div>
    </section>

    <AuthorPostsSection
      author={displayAuthor}
      onCountChange={setAuthorPostsCount}
      onMessage={setMessage}
    />
  </div>
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

        {activeTab === 'Store' ? (
  <AuthorStoreTab
  author={displayAuthor}
  cartCount={readerCartCount}
  onCartCountChange={setReaderCartCount}
  onMessage={setMessage}
/>
) : null}
          
        </section>
      </main>
      {ownerResolved && displayAuthor.is_owner ? (
        <AuthorPageFooter active="Page" onComingSoon={handleAuthorFooterComingSoon} />
      ) : null}
    </div>
  )
}

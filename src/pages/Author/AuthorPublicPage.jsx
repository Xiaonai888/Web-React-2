import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthorPageFooter from '../../components/AuthorPageFooter'
import AuthorPostsSection from '../../components/AuthorPostsSection'
import AuthorPublicStoreSection from '../../components/AuthorPublicStoreSection'
import AuthorStoreTab from '../../components/AuthorStoreTab'
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
  onOpenIncome,
  onOpenWithdrawal,
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

        <div className="mt-6">
  <div className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">
    Finance
  </div>

  <button
    type="button"
    onClick={onOpenIncome}
    className="flex w-full items-center gap-4 px-0 py-3 text-left active:opacity-70"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
      <i className="fa-solid fa-chart-line text-[22px]" />
    </span>

    <span className="text-[17px] font-semibold text-[#111827]">
      Income
    </span>
  </button>

  <button
    type="button"
    onClick={onOpenWithdrawal}
    className="flex w-full items-center gap-4 px-0 py-3 text-left active:opacity-70"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
      <i className="fa-solid fa-money-bill-transfer text-[22px]" />
    </span>

    <span className="text-[17px] font-semibold text-[#111827]">
      Withdrawal
    </span>
  </button>
</div>

<div className="mt-6">
  <div className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">
    Settings
  </div>

  <button
    type="button"
    onClick={() => onOpenStoreSetting('')}
    className="flex w-full items-center gap-4 px-0 py-3 text-left active:opacity-70"
  >
    <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
      <i className="fa-solid fa-gear text-[22px]" />
    </span>

    <span className="text-[17px] font-semibold text-[#111827]">
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
              <i className="fa-solid fa-images text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">{savingSlide ? 'Uploading slide...' : 'Upload slide'}</span>
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
  const [savingSlide, setSavingSlide] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followSettingsOpen, setFollowSettingsOpen] = useState(false)
  const [authorPostsCount, setAuthorPostsCount] = useState(0)
  const [pageSwitcherOpen, setPageSwitcherOpen] = useState(false)
  const [authorMenuOpen, setAuthorMenuOpen] = useState(false)
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
        onClick: () => setMessage('Message is coming soon.'),
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
    if (author?.is_owner) {
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
  }, [author?.id, author?.is_owner])

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

  useEffect(() => {
  function handleTabsStickyState() {
    const tabsElement = document.getElementById('author-page-tabs')
    if (!tabsElement) return

    const rect = tabsElement.getBoundingClientRect()
    setTabsFrozen(rect.top <= 0 && window.scrollY > 20)
  }

  handleTabsStickyState()
  window.addEventListener('scroll', handleTabsStickyState, { passive: true })
  window.addEventListener('resize', handleTabsStickyState)

  return () => {
    window.removeEventListener('scroll', handleTabsStickyState)
    window.removeEventListener('resize', handleTabsStickyState)
  }
}, [])
  

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
  onOpenIncome={() => {
    setAuthorMenuOpen(false)
    navigate('/author/page/finance/income')
  }}
  onOpenWithdrawal={() => {
    setAuthorMenuOpen(false)
    navigate('/author/page/finance/withdrawal')
  }}
  onOpenStoreSetting={(setting) => {
    setAuthorMenuOpen(false)
    navigate(setting ? `/author/page/store?settings=${setting}` : '/author/page/store')
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

      {!displayAuthor.is_owner ? (
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
        onClick={() => setMessage('Page options are coming soon.')}
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          readerHeaderSolid ? 'bg-white text-[#111827] shadow-sm' : 'bg-transparent text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]'
        }`}
        aria-label="More options"
      >
        <i className="fa-solid fa-ellipsis text-[15px]" />
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
  className="mt-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827] ring-1 ring-black/5 transition active:scale-95"
  aria-label="Switch to Reader account"
>
  <i className="fa-solid fa-chevron-down text-[12px]" />
</button>
                    ) : null}
                  </div>

                  <div className="-mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#111827] sm:text-[12px]">
                    <span>
                      <strong>{formatCompactNumber(displayAuthor.works_count)}</strong>{' '}
                      <span className="text-[#6b7280]">Works</span>
                    </span>
                    <span>
                      <strong>{formatCompactNumber(displayAuthor.followers_count || displayAuthor.fans_count)}</strong>{' '}
                      <span className="text-[#6b7280]">Followers</span>
                    </span>
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
      onClick={() => setMessage('Add to story is coming soon.')}
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
            </div>
          </div>

        </section>

       <section
  id="author-page-tabs"
  ref={tabsRef}
  className={`sticky z-50 border-b border-[#eef0f3] bg-white transition ${
    displayAuthor.is_owner ? 'top-0' : 'top-[54px]'
  } ${tabsFrozen && !displayAuthor.is_owner ? 'shadow-sm' : ''}`}
>
  <div className="mx-auto flex h-[50px] max-w-[980px] items-center justify-between gap-3 px-4">
    <div className="flex min-w-0 gap-2 overflow-x-auto">
      {tabs.map((tab) => {
        const active = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`h-9 shrink-0 rounded-full px-4 text-[13px] transition active:scale-[0.98] ${
              active
                ? 'bg-[#f3f4f6] font-medium text-[#111827]'
                : 'bg-transparent font-normal text-[#9ca3af]'
            }`}
          >
            {tab}
          </button>
        )
      })}
     </div>

    
  </div>
</section>

        <section className="min-h-[70vh] bg-white px-4 pb-24 pt-4 sm:px-6">
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
        <div className="flex items-center gap-4">
          <i className="fa-regular fa-star w-8 text-center text-[23px] text-[#111827]" />
          <span>92% recommend (23 Reviews)</span>
        </div>
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-book w-8 text-center text-[20px] text-[#111827]" />
          <span>Book · $$</span>
        </div>
      </div>
    </section>

    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-[#111827]">Links</h2>
        {displayAuthor.is_owner ? (
          <button type="button" onClick={() => navigate('/author/page/edit?section=links')} className="flex h-8 w-8 items-center justify-center text-[#6b7280] active:scale-95">
            <i className="fa-solid fa-pen text-[14px]" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-4 text-[14px] font-normal text-[#111827]">
        <i className="fa-solid fa-link w-8 text-center text-[22px]" />
        <span>Shadow website</span>
      </div>
    </section>

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
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-at w-8 text-center text-[21px]" />
          <span>author contact</span>
        </div>
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-phone w-8 text-center text-[20px]" />
          <span>Phone number</span>
        </div>
        <div className="flex items-center gap-4">
          <i className="fa-regular fa-envelope w-8 text-center text-[21px]" />
          <span>Email address</span>
        </div>
        <div className="flex items-center gap-4">
          <i className="fa-brands fa-facebook-messenger w-8 text-center text-[22px]" />
          <span>Messenger</span>
        </div>
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
      {displayAuthor.is_owner ? (
        <AuthorPageFooter active="Page" onComingSoon={handleAuthorFooterComingSoon} />
      ) : null}
    </div>
  )
}

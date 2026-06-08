import { useEffect, useRef, useState } from 'react'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const MAX_POST_PHOTOS = 5
const MAX_POST_IMAGE_BYTES = 800 * 1024
const HARD_MAX_IMAGE_BYTES = 220 * 1024
const MAX_IMAGE_WIDTH = 1080
const MAX_IMAGE_HEIGHT = 1350
const TARGET_IMAGE_BYTES = 150 * 1024

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatBytes(bytes) {
  const value = Number(bytes || 0)

  if (!Number.isFinite(value) || value <= 0) return '0KB'
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)}MB`

  return `${Math.max(1, Math.round(value / 1024))}KB`
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    image.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

async function compressImageFile(file) {
  if (!file?.type?.startsWith('image/')) return null

  const image = await loadImageFromFile(file)
  let scale = Math.min(1, MAX_IMAGE_WIDTH / image.width, MAX_IMAGE_HEIGHT / image.height)
  let width = Math.max(1, Math.round(image.width * scale))
  let height = Math.max(1, Math.round(image.height * scale))
  let quality = 0.82
  let blob = null

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, width, height)

    blob = await canvasToBlob(canvas, 'image/webp', quality)

    if (blob && blob.size <= TARGET_IMAGE_BYTES) break
    if (blob && blob.size <= HARD_MAX_IMAGE_BYTES && quality <= 0.68) break

    if (quality > 0.62) {
      quality = Math.max(0.62, quality - 0.07)
    } else {
      width = Math.max(1, Math.round(width * 0.9))
      height = Math.max(1, Math.round(height * 0.9))
    }
  }

  if (!blob) return file

  if (blob.size > HARD_MAX_IMAGE_BYTES) {
    throw new Error(`Photo is still too large after compression. Selected: ${formatBytes(blob.size)} / Limit: ${formatBytes(HARD_MAX_IMAGE_BYTES)}.`)
  }

  return new File(
    [blob],
    file.name.replace(/\.[^.]+$/, '.webp'),
    {
      type: 'image/webp',
      lastModified: Date.now(),
    }
  )
}

function getSelectedImageSize(images) {
  return images.reduce((sum, image) => sum + Number(image.file?.size || 0), 0)
}

async function uploadAuthorPostImage(file) {
  const token = getAuthToken()

  if (!token) {
    throw new Error('Please login first')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', 'author_post_image')

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

 if (!response.ok || data.ok === false) {
  const missingEnvText = Array.isArray(data.missing_env) && data.missing_env.length
    ? ` Missing: ${data.missing_env.join(', ')}`
    : ''

  throw new Error(`${data.message || 'Failed to upload photo'}${missingEnvText}`)
}

  return data.image_url || data.imageUrl
}

function SelectedImagePreview({ images, onRemove, removable = true }) {
  if (!images.length) return null

  if (images.length === 1) {
    return (
      <div className="mt-4 overflow-hidden rounded-[16px] bg-[#f3f4f6]">
        <div className="relative min-h-[260px] bg-[#f3f4f6]">
          <img src={images[0].url} alt="" className="max-h-[520px] w-full object-contain" />

          {removable ? (
            <button
              type="button"
              onClick={() => onRemove(images[0].id)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white"
              aria-label="Remove photo"
            >
              <i className="fa-solid fa-xmark text-[12px]" />
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden rounded-[16px]">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square bg-[#f3f4f6]">
          <img src={image.url} alt="" className="h-full w-full object-cover" />

          {removable ? (
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white"
              aria-label="Remove photo"
            >
              <i className="fa-solid fa-xmark text-[11px]" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function LeavePostSheet({ open, onSave, onDiscard, onContinue }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[280]">
      <button
        type="button"
        aria-label="Close leave post options"
        onClick={onContinue}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[26px] bg-white px-4 pb-7 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#d1d5db]" />

        <h3 className="mb-3 text-[15px] font-semibold text-[#111827]">Leave this post?</h3>

        <div className="space-y-1">
          <button
            type="button"
            onClick={onSave}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <i className="fa-regular fa-bookmark text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[#111827]">Save for later</span>
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <i className="fa-regular fa-trash-can text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[#111827]">Discard</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
              <i className="fa-solid fa-pen text-[14px]" />
            </span>
            <span className="text-[15px] font-normal text-[#111827]">Continue writing</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewOption({ icon, title, value }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        <i className={`${icon} text-[15px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[#111827]">{title}</span>
        <span className="mt-0.5 block text-[12px] font-normal text-[#8b93a1]">{value}</span>
      </span>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#9ca3af]" />
    </button>
  )
}

export default function AuthorPostComposerSheet({
  open,
  author,
  saving,
  onClose,
  onPublishText,
  onMessage,
}) {
  const fileInputRef = useRef(null)
  const [screen, setScreen] = useState('compose')
  const [draft, setDraft] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [imageError, setImageError] = useState('')
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || 'Author'
  const hasContent = Boolean(draft.trim() || selectedImages.length)
  const canReview = hasContent && !uploading
  const canPublish = hasContent && !saving && !uploading

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setScreen('compose')
      setLeaveSheetOpen(false)
      setImageError('')
      setUploading(false)
    }
  }, [open])

  useEffect(() => () => {
    selectedImages.forEach((image) => URL.revokeObjectURL(image.url))
  }, [selectedImages])

  if (!open) return null

  function clearImages() {
    selectedImages.forEach((image) => URL.revokeObjectURL(image.url))
    setSelectedImages([])
  }

  function discardPost() {
    clearImages()
    setDraft('')
    setImageError('')
    setLeaveSheetOpen(false)
    setScreen('compose')
    setUploading(false)
    onClose?.()
  }

  function saveForLater() {
    setLeaveSheetOpen(false)
    setScreen('compose')
    onClose?.()
    onMessage?.('Draft saved for later.')
  }

  function requestClose() {
    if (hasContent) {
      setLeaveSheetOpen(true)
      return
    }

    onClose?.()
  }

  async function handlePickImages(fileList) {
    const files = Array.from(fileList || [])
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

    if (!imageFiles.length) return

    if (selectedImages.length + imageFiles.length > MAX_POST_PHOTOS) {
      setImageError(`You can add up to ${MAX_POST_PHOTOS} photos per post.`)
      return
    }

    try {
      setImageError('Preparing photos...')

      const compressedFiles = await Promise.all(imageFiles.map((file) => compressImageFile(file)))

      const nextImages = compressedFiles
        .filter(Boolean)
        .map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          url: URL.createObjectURL(file),
        }))

      const nextSelectedImages = [...selectedImages, ...nextImages]
      const totalSize = getSelectedImageSize(nextSelectedImages)

      if (totalSize > MAX_POST_IMAGE_BYTES) {
        nextImages.forEach((image) => URL.revokeObjectURL(image.url))
        setImageError(`Photos are too large. Selected: ${formatBytes(totalSize)} / Limit: ${formatBytes(MAX_POST_IMAGE_BYTES)}. You can add up to 5 photos per post.`)
        return
      }

      setSelectedImages(nextSelectedImages)
      setImageError('')
    } catch (error) {
      setImageError(error.message || 'Could not prepare these photos. Please choose different images.')
    }
  }

  function removeImage(imageId) {
    setSelectedImages((current) => {
      const imageToRemove = current.find((image) => image.id === imageId)

      if (imageToRemove) URL.revokeObjectURL(imageToRemove.url)

      return current.filter((image) => image.id !== imageId)
    })
    setImageError('')
  }

  async function publishPost() {
    if (!canPublish) return

    try {
      setUploading(true)
      setImageError('')

      const imageUrls = []

      for (const image of selectedImages) {
        const imageUrl = await uploadAuthorPostImage(image.file)
        imageUrls.push(imageUrl)
      }

      const ok = await onPublishText?.(draft.trim(), imageUrls)

      if (ok) {
        clearImages()
        setDraft('')
        setImageError('')
        setScreen('compose')
        onClose?.()
      }
    } catch (error) {
      const message = error.message || 'Failed to publish post'
      setImageError(message)
      onMessage?.(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[240] bg-white">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            handlePickImages(event.target.files)
            event.target.value = ''
          }}
        />

        {screen === 'compose' ? (
          <>
            <header className="sticky top-0 z-10 border-b border-[#eef0f4] bg-white">
              <div className="flex h-14 items-center justify-between px-4">
                <button
                  type="button"
                  onClick={requestClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
                  aria-label="Close composer"
                >
                  <i className="fa-solid fa-xmark text-[22px]" />
                </button>

                <div className="line-clamp-1 px-2 text-center text-[16px] font-semibold text-[#111827]">
                  New Page Post
                </div>

                <button
                  type="button"
                  disabled={!canReview}
                  onClick={() => setScreen('review')}
                  className="h-9 rounded-full bg-[#2563eb] px-4 text-[13px] font-semibold text-white disabled:bg-[#dbe4ff] disabled:text-white"
                >
                  Next
                </button>
              </div>
            </header>

            <main className="flex min-h-[calc(100vh-56px)] flex-col bg-white">
              <div className="flex-1 px-4 pt-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] ring-1 ring-black/5">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user text-[16px] text-[#9ca3af]" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="line-clamp-1 text-[15px] font-semibold text-[#111827]">{pageName}</div>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#eef0f4] px-2.5 py-1 text-[11px] font-normal text-[#374151]">
                      <i className="fa-solid fa-earth-asia text-[10px]" />
                      Public
                    </div>
                  </div>
                </div>

                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Share an update..."
                  maxLength={5000}
                  className="min-h-[210px] w-full resize-none border-0 bg-white p-0 text-[14px] font-normal leading-6 text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />

                <SelectedImagePreview images={selectedImages} onRemove={removeImage} />

                {imageError ? (
                  <div className="mt-3 rounded-[12px] bg-[#fff7ed] px-3 py-2 text-[12px] font-normal leading-5 text-[#9a3412]">
                    {imageError}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-[#eef0f4] bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 items-center gap-3 rounded-[14px] px-2 text-[14px] font-normal text-[#111827] active:bg-[#f3f4f6]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f4f5f7] text-[#111827]">
                    <i className="fa-regular fa-image text-[17px]" />
                  </span>
                  Add photo
                </button>
              </div>
            </main>
          </>
        ) : (
          <>
            <header className="sticky top-0 z-10 border-b border-[#eef0f4] bg-white">
              <div className="flex h-14 items-center justify-between px-4">
                <button
                  type="button"
                  onClick={() => setScreen('compose')}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
                  aria-label="Back to composer"
                >
                  <i className="fa-solid fa-chevron-left text-[18px]" />
                </button>

                <div className="text-[16px] font-semibold text-[#111827]">Review Post</div>

                <button
                  type="button"
                  disabled={!canPublish}
                  onClick={publishPost}
                  className="h-9 rounded-full bg-[#2563eb] px-4 text-[13px] font-semibold text-white disabled:bg-[#e5e7eb] disabled:text-[#9ca3af]"
                >
                  {uploading || saving ? 'Publishing' : 'Publish'}
                </button>
              </div>
            </header>

            <main className="px-4 py-4">
              <div className="mb-5 rounded-[18px] bg-white p-3 ring-1 ring-[#eef0f4]">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] ring-1 ring-black/5">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user text-[14px] text-[#9ca3af]" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-[#111827]">{pageName}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#6b7280]">
                      <span>Now</span>
                      <span>·</span>
                      <i className="fa-solid fa-earth-asia text-[10px]" />
                    </div>

                    {draft.trim() ? (
                      <p className="mt-2 whitespace-pre-wrap text-[14px] font-normal leading-6 text-[#111827]">
                        {draft.trim()}
                      </p>
                    ) : null}

                    <SelectedImagePreview images={selectedImages} onRemove={() => {}} removable={false} />
                  </div>
                </div>
              </div>

              {imageError ? (
                <div className="mb-4 rounded-[14px] bg-[#fff7ed] px-3 py-2 text-[12px] font-normal leading-5 text-[#9a3412]">
                  {imageError}
                </div>
              ) : null}

              <div className="space-y-1">
                <ReviewOption icon="fa-solid fa-earth-asia" title="Who can see this" value="Public" />
                <ReviewOption icon="fa-regular fa-comment" title="Reader comments" value="Everyone" />
                <ReviewOption icon="fa-regular fa-clock" title="Publish time" value="Now" />
                <ReviewOption icon="fa-regular fa-circle-plus" title="Story sharing" value="Off" />
              </div>
            </main>
          </>
        )}
      </div>

      <LeavePostSheet
        open={leaveSheetOpen}
        onSave={saveForLater}
        onDiscard={discardPost}
        onContinue={() => setLeaveSheetOpen(false)}
      />
    </>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

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

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds`)
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function readResponsePayload(response) {
  const rawText = await response.text()

  if (!rawText) {
    return {
      data: {},
      rawText: '',
    }
  }

  try {
    return {
      data: JSON.parse(rawText),
      rawText,
    }
  } catch {
    return {
      data: {},
      rawText,
    }
  }
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = String(dataUrl).split(',')
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], fileName, { type: mime })
}

async function uploadCharacterImage(token, imageDataUrl, storyId, index) {
  if (!String(imageDataUrl || '').startsWith('data:image/')) return imageDataUrl || null

  const formData = new FormData()
  formData.append('image', dataUrlToFile(imageDataUrl, `chat-character-${storyId}-${index + 1}-${Date.now()}.jpg`))
  formData.append('folder', 'chat_story_character')

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/story-media/upload-image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
    60000
  )

  const { data, rawText } = await readResponsePayload(response)

  if (!response.ok || data.ok === false) {
    const serverMessage =
      data.message ||
      data.error ||
      rawText.slice(0, 500) ||
      'Failed to upload character image'

    throw new Error(`Image upload failed (${response.status}): ${serverMessage}`)
  }

  return data.image_url || data.imageUrl || null
}


const ROLE_GROUPS = [
  {
    key: 'main',
    title: 'Main Characters',
    shortTitle: 'Main',
    description: 'The central characters who drive the story.',
    accent: '#7C3AED',
    soft: '#F3E8FF',
    border: '#D8B4FE',
    icon: 'fa-solid fa-crown',
  },
  {
    key: 'major',
    title: 'Major Supporting Characters',
    shortTitle: 'Major Support',
    description: 'Important characters who stay close to the main cast and appear often.',
    accent: '#F97316',
    soft: '#FFF1E8',
    border: '#FED7AA',
    icon: 'fa-solid fa-star',
  },
  {
    key: 'minor',
    title: 'Minor Supporting Characters',
    shortTitle: 'Minor Support',
    description: 'Characters who help the story move forward but appear less often.',
    accent: '#0F9F7A',
    soft: '#E8FFF8',
    border: '#A7F3D0',
    icon: 'fa-solid fa-user-group',
  },
  {
    key: 'background',
    title: 'Background Characters',
    shortTitle: 'Background',
    description: 'Occasional or unnamed roles such as guards, staff, doctors or classmates.',
    accent: '#64748B',
    soft: '#F1F5F9',
    border: '#CBD5E1',
    icon: 'fa-solid fa-users',
  },
]

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function mapCharacter(character) {
  return {
    id: character.id,
    group: character.role_group,
    image: character.avatar_url || '',
    nickname: character.nickname || '',
    avatarSource: character.avatar_source || 'device',
    isLead: character.is_lead === true,
    chatSide: character.is_lead === true ? 'right' : 'left',
    gender: character.gender || '',
    birthday: character.birthday || '',
    heightCm: character.height_cm || '',
    occupation: character.occupation || '',
    personality: character.personality || '',
    relationship: character.relationship || '',
    bio: character.bio || '',
  }
}

function normalizeLeadCharacters(value) {
  const mainCharacters = value.filter(
    (character) => character.group === 'main'
  )

  const currentLead =
    mainCharacters.find((character) => character.isLead) ||
    mainCharacters[0] ||
    null

  return value.map((character) => {
    const isLead =
      character.group === 'main' &&
      character.id === currentLead?.id

    return {
      ...character,
      isLead,
      chatSide: isLead ? 'right' : 'left',
    }
  })
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${active ? 'bg-[#111827] text-white' : 'bg-[#f2f4f7] text-[#98a2b3]'}`}>
        {number}
      </div>
      <div className={`line-clamp-1 text-[10px] font-extrabold ${active ? 'text-[#111827]' : 'text-[#98a2b3]'}`}>
        {title}
      </div>
    </div>
  )
}

function BottomSheet({ open, onClose, children, hideHandle = false }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const startDrag = (event) => {
    draggingRef.current = true
    startYRef.current = event.clientY
    dragYRef.current = 0
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextY = Math.max(0, event.clientY - startYRef.current)
    dragYRef.current = nextY
    setDragY(nextY)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false
    const shouldClose = dragYRef.current >= 90
    dragYRef.current = 0
    setDragY(0)

    if (shouldClose) onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[180] flex items-end bg-black/45"
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-t-[28px] bg-white px-4 pb-[calc(22px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? 'none' : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {hideHandle ? (
  <button
    type="button"
    onPointerDown={startDrag}
    onPointerMove={moveDrag}
    onPointerUp={endDrag}
    onPointerCancel={endDrag}
    className="absolute inset-x-0 top-0 z-10 h-14 touch-none cursor-grab bg-transparent outline-none active:cursor-grabbing"
    aria-label="Drag down to close"
  />
) : (
  <button
    type="button"
    onPointerDown={startDrag}
    onPointerMove={moveDrag}
    onPointerUp={endDrag}
    onPointerCancel={endDrag}
    className="mx-auto mb-3 flex h-7 w-20 touch-none items-center justify-center"
    aria-label="Drag down to close"
  >
    <span className="h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
  </button>
)}

        {children}
      </div>
    </div>
  )
}

function HelpSheet({ group, onClose }) {
  return (
    <BottomSheet open={Boolean(group)} onClose={onClose}>
      {group ? (
        <>
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: group.soft, color: group.accent }}
            >
              <i className={`${group.icon} text-[15px]`} />
            </span>
            <div>
              <h2 className="text-[17px] font-extrabold text-[#111827]">{group.title}</h2>
              <p className="mt-1 text-[12px] leading-5 text-[#667085]">{group.description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-extrabold text-white active:scale-[0.99]"
          >
            Got it
          </button>
        </>
      ) : null}
    </BottomSheet>
  )
}

function LeadCharacterSheet({
  open,
  characters,
  selectedId,
  onSelect,
  onClose,
  onConfirm,
}) {
  return (
    <BottomSheet open={open} onClose={onClose} hideHandle>
  <div className="pt-3 pb-1">
        <h2 className="text-center text-[18px] font-bold text-[#111827]">
          Choose Lead Character
        </h2>

        <p className="mx-auto mt-2 max-w-[310px] text-center text-[11px] leading-5 text-[#667085]">
          The Lead Character uses the main chat style and appears on the right side.
        </p>

        <div className="mt-5 grid max-h-[48vh] grid-cols-2 gap-3 overflow-y-auto pb-2">
          {characters.map((character) => {
            const selected = selectedId === character.id

            return (
              <button
                key={character.id}
                type="button"
                onClick={() => onSelect(character.id)}
                className={`relative flex min-h-[130px] flex-col items-center justify-center overflow-hidden rounded-[20px] px-3 py-4 text-center active:scale-[0.98] ${
  selected
    ? 'border-2 border-[#7c3aed] bg-[#f5f0ff]'
    : 'border border-black/5 bg-[#f7f7f8]'
}`}
              >
                {selected ? (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#7c3aed] text-white">
                    <i className="fa-solid fa-check text-[9px]" />
                  </span>
                ) : null}

                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#eee7ff]">
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.nickname || 'Character'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-user text-[24px] text-[#9b87c9]" />
                  )}
                </span>

                <span className="mt-3 line-clamp-1 w-full text-[12px] font-bold text-[#111827]">
                  {character.nickname || 'Unnamed character'}
                </span>

                {selected ? (
                  <span className="mt-1 text-[9px] font-bold text-[#7c3aed]">
                    Lead Character
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full bg-[#f2f4f7] text-[14px] font-medium text-[#344054] active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!selectedId}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white active:scale-[0.98] disabled:opacity-45"
          >
            Confirm
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}

function LeadCharacterPanel({ character, onChange }) {
  if (!character) return null

  return (
    <section className="-mx-[2px] mt-4 w-[calc(100%+4px)] rounded-[20px] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(15,23,42,0.035)]">
      <div className="flex items-center gap-3">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eee7ff]">
          {character.image ? (
            <img
              src={character.image}
              alt={character.nickname || 'Lead Character'}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[21px] text-[#9b87c9]" />
          )}

          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-white">
            <i className="fa-solid fa-crown text-[7px]" />
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-[#7c3aed]">
            Lead Character
          </div>

          <div className="mt-1 truncate text-[14px] font-bold text-[#111827]">
            {character.nickname || 'Unnamed character'}
          </div>

          <div className="mt-1 text-[10px] text-[#98a2b3]">
            Main chat style · Right side
          </div>
        </div>

        <button
          type="button"
          onClick={onChange}
          className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#f5f0ff] px-4 text-[11px] font-bold text-[#7c3aed] active:scale-[0.97]"
        >
          Change
          <i className="fa-solid fa-chevron-right text-[8px]" />
        </button>
      </div>
    </section>
  )
}

export function ImageSourceSheet({
  open,
  onClose,
  onDevice,
  onShadowGallery,
}) {
  return (
    <BottomSheet open={open} onClose={onClose} hideHandle>
      <div className="pt-5">
        <h2 className="text-center text-[20px] font-bold text-[#111827]">
          Add Photo
        </h2>

        <div className="mt-8 grid min-h-[175px] grid-cols-2 items-start gap-8 px-4">
          <button
            type="button"
            onClick={onDevice}
            className="flex flex-col items-center justify-center text-center active:scale-[0.97]"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf8ff]">
              <img
                src="/assets/Icons/Local%20image.svg"
                alt=""
                className="h-9 w-9 object-contain"
              />
            </span>

            <span className="mt-4 text-[14px] font-medium text-[#111827]">
              Upload from device
            </span>
          </button>

          <button
            type="button"
            onClick={onShadowGallery}
            className="flex flex-col items-center justify-center text-center active:scale-[0.97]"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1eaff]">
              <img
                src="/assets/Icons/Shadow%20image.svg"
                alt=""
                className="h-9 w-9 object-contain"
              />
            </span>

            <span className="mt-4 text-[14px] font-medium text-[#111827]">
              Shadow gallery
            </span>
          </button>
        </div>

        <div className="-mx-4 h-3 bg-[#f5f6f8]" />

        <button
          type="button"
          onClick={onClose}
          className="-mx-4 flex h-16 w-[calc(100%+2rem)] items-center justify-center bg-white text-[15px] font-medium text-[#111827] active:bg-[#fafafa]"
        >
          Cancel
        </button>
      </div>
    </BottomSheet>
  )
}


function GallerySheet({
  open,
  loading,
  error,
  images,
  categories,
  selectedCategory,
  onCategoryChange,
  onSelect,
  onRetry,
  onClose,
}) {
  if (!open) return null

  const visibleImages =
    selectedCategory === 'All'
      ? images
      : images.filter((item) => item.category === selectedCategory)

  return (
    <div className="fixed inset-0 z-[185] flex items-end bg-black/45" onClick={onClose}>
      <div
        className="max-h-[86vh] w-full overflow-hidden rounded-t-[28px] bg-white pb-[calc(18px+env(safe-area-inset-bottom))] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-4 pt-3">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-extrabold text-[#111827]">Shadow gallery</h2>
              <p className="mt-1 text-[11px] text-[#667085]">Choose a profile image for this character.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
            >
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>
        </div>

        {categories.length ? (
          <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {['All', ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold ${
                  selectedCategory === category
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#f5f3fa] text-[#667085]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-2 max-h-[62vh] overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <i className="fa-solid fa-spinner fa-spin text-[24px] text-[#7c3aed]" />
              <div className="mt-3 text-[12px] font-bold text-[#667085]">Loading gallery...</div>
            </div>
          ) : error ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f2] text-[#e11d48]">
                <i className="fa-solid fa-triangle-exclamation text-[20px]" />
              </span>
              <div className="mt-3 text-[13px] font-extrabold text-[#111827]">Gallery could not load</div>
              <div className="mt-1 max-w-[280px] text-[11px] leading-5 text-[#667085]">{error}</div>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 rounded-full bg-[#111827] px-5 py-2.5 text-[11px] font-extrabold text-white"
              >
                Try again
              </button>
            </div>
          ) : visibleImages.length ? (
            <div className="grid grid-cols-3 gap-3 pt-2 sm:grid-cols-4 md:grid-cols-5">
              {visibleImages.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="overflow-hidden rounded-[18px] bg-[#f5f3fa] text-left shadow-sm ring-1 ring-black/5 active:scale-[0.98]"
                >
                  <div className="aspect-square overflow-hidden bg-[#f3f4f6]">
                    <img
                      src={item.image_url}
                      alt={item.alt_text || item.title || 'Character avatar'}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="line-clamp-1 px-2 py-2 text-[9.5px] font-bold text-[#667085]">
                    {item.title || item.category || 'Character'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7c3aed]">
                <i className="fa-regular fa-images text-[21px]" />
              </span>
              <div className="mt-3 text-[13px] font-extrabold text-[#111827]">No images in this gallery yet</div>
              <div className="mt-1 max-w-[290px] text-[11px] leading-5 text-[#667085]">
                Add active image URLs to the Chat Story avatar gallery in Supabase.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CharacterEditor({
  open,
  group,
  image,
  nickname,
  editing,
  onNicknameChange,
  onChangeImage,
  onEditProfile,
  onClose,
  saving,
  onSave,
}) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open || !group) return null

  return (
    <div
      className="fixed inset-0 z-[190] flex items-center justify-center bg-black/55 px-5"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[340px] rounded-[28px] bg-white px-6 pb-6 pt-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onChangeImage}
            className="relative active:scale-[0.98]"
            aria-label="Replace profile image"
          >
            <span
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/5"
              style={{ backgroundColor: group.soft }}
            >
              {image ? (
                <img
                  src={image}
                  alt={nickname || 'Character'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[38px] text-white" />
              )}
            </span>

            <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-md">
              <i className="fa-solid fa-camera text-[13px]" />
            </span>
          </button>
        </div>

        <div className="relative mt-7">
          <input
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            maxLength={40}
            placeholder="Enter character nickname"
            className="h-14 w-full rounded-full bg-[#f7f7f8] px-12 text-center text-[16px] font-medium text-[#111827] outline-none focus:ring-2 focus:ring-[#9362ef]/25"
          />

          <i className="fa-regular fa-pen-to-square pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[17px] text-[#98a2b3]" />
        </div>

        {editing ? (
          <button
            type="button"
            onClick={onEditProfile}
            className="mx-auto mt-5 flex items-center justify-center gap-1.5 px-4 py-2 text-[14px] font-medium text-[#7c3aed] active:opacity-60"
          >
            Edit Profile
            <i className="fa-solid fa-angles-right text-[10px]" />
          </button>
        ) : null}

        <div className={`${editing ? 'mt-5' : 'mt-7'} grid grid-cols-2 gap-3`}>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-12 rounded-full bg-[#f2f4f7] text-[14px] font-medium text-[#344054] active:scale-[0.98] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white shadow-sm active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </section>
    </div>
  )
}

function CharacterCard({
  character,
  index,
  group,
  selected,
  locked,
  onToggle,
  onEdit,
  onEditProfile,
}) {
  return (
    <div
      className={`relative flex h-[194px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-white px-3 shadow-[0_3px_12px_rgba(15,23,42,0.035)] ${
        selected
          ? 'ring-2 ring-[#7c3aed]/35'
          : 'opacity-70 ring-1 ring-black/5'
      }`}
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full flex-col items-center justify-center active:scale-[0.98]"
      >
        <span
          className="absolute left-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-[8px] px-1.5 text-[10px] font-extrabold"
          style={{
            backgroundColor: group.soft,
            color: group.accent,
          }}
        >
          {index + 1}
        </span>

        <span
          className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full"
          style={{
            backgroundColor: group.soft,
          }}
        >
          {character.image ? (
            <img
              src={character.image}
              alt={
                character.nickname ||
                group.shortTitle
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[27px] text-white" />
          )}
        </span>

        <span className="mt-3 line-clamp-1 w-full text-[12px] font-extrabold text-[#111827]">
          {character.nickname ||
            'Unnamed role'}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggle}
        disabled={locked}
        aria-pressed={selected}
        className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full ${
          selected
            ? 'bg-[#7c3aed] text-white'
            : 'border border-[#d0d5dd] bg-white text-transparent'
        } disabled:cursor-default`}
      >
        <i className="fa-solid fa-check text-[10px]" />
      </button>

      <button
        type="button"
        onClick={onToggle}
        disabled={locked}
        className={`mt-2 rounded-full px-3 py-1 text-[9px] font-bold ${
          selected
            ? 'bg-[#f1eaff] text-[#7c3aed]'
            : 'bg-[#f2f4f7] text-[#98a2b3]'
        } disabled:cursor-default`}
      >
        {locked
          ? 'Lead · Used'
          : selected
            ? 'Used in episode'
            : 'Not used'}
      </button>

      <button
        type="button"
        onClick={onEditProfile}
        className="mt-1 text-[9px] font-medium text-[#98a2b3] active:text-[#667085]"
      >
        Edit Profile{' '}
        <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}

function AddCharacterCard({ group, onClick }) {
  return (
    <button
  type="button"
  onClick={onClick}
  className="flex h-[168px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-white px-3 text-center shadow-[0_3px_12px_rgba(15,23,42,0.035)] active:scale-[0.98]"
>
      <span
        className="flex h-[66px] w-[66px] items-center justify-center rounded-full"
        style={{ backgroundColor: group.soft, color: group.accent }}
      >
        <i className="fa-solid fa-plus text-[22px]" />
      </span>
      <span className="mt-3 text-[11px] font-normal" style={{ color: group.accent }}>
        Add character
      </span>
    </button>
  )
}

function RoleSection({
  group,
  characters,
  selectedCharacterIdSet,
  onHelp,
  onAdd,
  onEdit,
  onEditProfile,
  onToggle,
}) {
  const usedCount = characters.filter(
    (character) =>
      selectedCharacterIdSet.has(
        String(character.id)
      )
  ).length

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: group.soft,
              color: group.accent,
            }}
          >
            <i
              className={`${group.icon} text-[11px]`}
            />
          </span>

          <h2 className="line-clamp-1 text-[15px] font-bold text-[#111827]">
            {group.title}
          </h2>

          <button
            type="button"
            onClick={onHelp}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#98a2b3] text-[10px] font-extrabold text-[#667085]"
            aria-label={`About ${group.title}`}
          >
            ?
          </button>
        </div>

        <span className="shrink-0 text-[10px] font-bold text-[#98a2b3]">
          {usedCount}/{characters.length} used
        </span>
      </div>

      <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-3">
        {characters.map(
          (character, index) => {
            const selected =
              selectedCharacterIdSet.has(
                String(character.id)
              )

            return (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                group={group}
                selected={selected}
                locked={
                  character.isLead === true
                }
                onToggle={() =>
                  onToggle(character)
                }
                onEdit={() =>
                  onEdit(character)
                }
                onEditProfile={() =>
                  onEditProfile(character)
                }
              />
            )
          }
        )}

        <AddCharacterCard
          group={group}
          onClick={onAdd}
        />
      </div>
    </section>
  )
}

export default function ChatStoryCharactersPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const startNewEpisode =
  searchParams.get('new') === '1'
  const requestedReturnTo = searchParams.get('returnTo')
const returnTo =
  requestedReturnTo === '/author/stories' ||
  requestedReturnTo === '/author/dashboard'
    ? requestedReturnTo
    : '/author/dashboard'
const castStorageKey =
  `chat_story_episode_cast_${storyId || 'unknown'}_new`
const fileInputRef = useRef(null)
const [characters, setCharacters] = useState([])
const [
  selectedCharacterIds,
  setSelectedCharacterIds,
] = useState([])
  const [helpGroup, setHelpGroup] = useState(null)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [activeGroupKey, setActiveGroupKey] = useState('')
  const [editingId, setEditingId] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [nickname, setNickname] = useState('')
  const [toast, setToast] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarSource, setAvatarSource] = useState('device')
  const [characterGroup, setCharacterGroup] = useState('main')
  const [chatSide, setChatSide] = useState('right')
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryError, setGalleryError] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryCategories, setGalleryCategories] = useState([])
  const [leadSheetOpen, setLeadSheetOpen] = useState(false)
  const [leadDraftId, setLeadDraftId] = useState('')

  useEffect(() => {
    async function loadCharacters() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      if (!storyId) {
        setPageLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/chat/characters`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load characters')
        }

        const normalizedCharacters =
  normalizeLeadCharacters(
    (data.characters || []).map(
      mapCharacter
    )
  )

setCharacters(normalizedCharacters)

let restoredCharacterIds = []
let hasSavedCast = false

try {
  const savedCast =
    sessionStorage.getItem(
      castStorageKey
    )

  const parsedCast = savedCast
    ? JSON.parse(savedCast)
    : null

  const candidateIds =
    Array.isArray(parsedCast)
      ? parsedCast
      : Array.isArray(
            parsedCast?.characterIds
          )
        ? parsedCast.characterIds
        : null

  hasSavedCast =
    Array.isArray(candidateIds)

  const validCharacterIds =
    new Set(
      normalizedCharacters.map(
        (character) =>
          String(character.id)
      )
    )

  restoredCharacterIds =
    Array.isArray(candidateIds)
      ? [
          ...new Set(
            candidateIds
              .map((id) => String(id))
              .filter((id) =>
                validCharacterIds.has(id)
              )
          ),
        ]
      : []
} catch {
  sessionStorage.removeItem(
    castStorageKey
  )
}

if (!hasSavedCast) {
  restoredCharacterIds =
    normalizedCharacters.map(
      (character) =>
        String(character.id)
    )
}

const savedLeadCharacter =
  normalizedCharacters.find(
    (character) =>
      character.isLead === true
  )

if (
  savedLeadCharacter &&
  !restoredCharacterIds.includes(
    String(savedLeadCharacter.id)
  )
) {
  restoredCharacterIds.push(
    String(savedLeadCharacter.id)
  )
}

setSelectedCharacterIds(
  restoredCharacterIds
)
      } catch (error) {
        showToast(error.message || 'Failed to load characters')
      } finally {
        setPageLoading(false)
      }
    }

    loadCharacters()
  }, [castStorageKey, navigate, storyId])

  useEffect(() => {
  if (!storyId) return

  const draftKey = `shadow_gallery_character_draft_${storyId}`
  const draftRaw = sessionStorage.getItem(draftKey)

  if (!draftRaw) return

  try {
    const draft = JSON.parse(draftRaw)
    const expired =
      !draft.createdAt ||
      Date.now() - Number(draft.createdAt) > 30 * 60 * 1000

    if (expired) {
      sessionStorage.removeItem(draftKey)
      return
    }

    const selectedRaw = sessionStorage.getItem(
      'shadow_gallery_selected_image'
    )

    let selected = null

    if (selectedRaw) {
      const parsedSelected = JSON.parse(selectedRaw)

      if (String(parsedSelected.storyId || '') === String(storyId)) {
        selected = parsedSelected
      }
    }

    const restoredGroup =
      draft.characterGroup ||
      draft.activeGroupKey ||
      'main'

    setActiveGroupKey(restoredGroup)
    setCharacterGroup(restoredGroup)
    setEditingId(draft.editingId || '')
    setNickname(draft.nickname || '')
    setSelectedImage(
      selected?.imageUrl || draft.selectedImage || ''
    )
    setAvatarSource(
      selected?.imageUrl
        ? 'shadow_gallery'
        : draft.avatarSource || 'device'
    )
    setChatSide(
      draft.chatSide ||
      (restoredGroup === 'main' ? 'right' : 'left')
    )
    if (selected?.imageUrl) {
  setSourceOpen(false)
  setEditorOpen(true)
} else if (draft.origin === 'cast-photo') {
  setEditorOpen(false)
  setSourceOpen(true)
} else {
  setSourceOpen(false)
  setEditorOpen(false)
}

sessionStorage.removeItem(draftKey)

    if (selected) {
      sessionStorage.removeItem(
        'shadow_gallery_selected_image'
      )
    }
  } catch {
    sessionStorage.removeItem(draftKey)
    sessionStorage.removeItem(
      'shadow_gallery_selected_image'
    )
  }
}, [storyId])

  const activeGroup = ROLE_GROUPS.find((group) => group.key === characterGroup || group.key === activeGroupKey) || null

  const groupedCharacters = useMemo(() => {
    return ROLE_GROUPS.reduce((result, group) => {
      result[group.key] = characters.filter((character) => character.group === group.key)
      return result
    }, {})
  }, [characters])

  const leadCharacter =
  characters.find(
    (character) =>
      character.group === 'main' &&
      character.isLead
  ) ||
  groupedCharacters.main[0] ||
  null

const selectedCharacterIdSet =
  useMemo(
    () =>
      new Set(
        selectedCharacterIds.map(
          (id) => String(id)
        )
      ),
    [selectedCharacterIds]
  )

const selectedCharacters =
  characters.filter(
    (character) =>
      selectedCharacterIdSet.has(
        String(character.id)
      )
  )

const selectedMainCharacters =
  selectedCharacters.filter(
    (character) =>
      character.group === 'main'
  )

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(
      () => setToast(''),
      2200
    )
  }

  useEffect(() => {
    if (!storyId || pageLoading) {
      return
    }

    sessionStorage.setItem(
      castStorageKey,
      JSON.stringify({
        characterIds:
          selectedCharacterIds,
        updatedAt:
          new Date().toISOString(),
      })
    )
  }, [
    castStorageKey,
    pageLoading,
    selectedCharacterIds,
    storyId,
  ])

  const toggleEpisodeCharacter = (
    character
  ) => {
    const characterId =
      String(character.id)

    if (
      character.isLead === true &&
      selectedCharacterIdSet.has(
        characterId
      )
    ) {
      showToast(
        'Lead Character must be used in this episode.'
      )
      return
    }

    setSelectedCharacterIds(
      (current) => {
        const nextIds =
          new Set(
            current.map(
              (id) => String(id)
            )
          )

        if (nextIds.has(characterId)) {
          nextIds.delete(characterId)
        } else {
          nextIds.add(characterId)
        }

        return [...nextIds]
      }
    )
  }

  const openLeadCharacterSheet = () => {
    if (!groupedCharacters.main.length) {
      showToast(
        'Add a Main Character first.'
      )
      return
    }

    setLeadDraftId(
      leadCharacter?.id ||
        groupedCharacters.main[0]?.id ||
        ''
    )

    setLeadSheetOpen(true)
  }

  const confirmLeadCharacter = () => {
    if (!leadDraftId) return

    setCharacters((current) =>
      normalizeLeadCharacters(
        current.map((character) => ({
          ...character,
          isLead:
            character.group === 'main' &&
            String(character.id) ===
              String(leadDraftId),
        }))
      )
    )

    setSelectedCharacterIds(
      (current) => {
        const nextIds =
          new Set(
            current.map(
              (id) => String(id)
            )
          )

        nextIds.add(
          String(leadDraftId)
        )

        return [...nextIds]
      }
    )

    setLeadSheetOpen(false)
    showToast(
      'Lead Character changed. Press Save to apply.'
    )
  }

  const openAddCharacter = (groupKey) => {
    setActiveGroupKey(groupKey)
    setCharacterGroup(groupKey)
    setEditingId('')
    setSelectedImage('')
    setNickname('')
    setAvatarSource('device')
    setChatSide(groupKey === 'main' ? 'right' : 'left')
    setSourceOpen(true)
  }

  const openEditCharacter = (character) => {
    setActiveGroupKey(character.group)
    setCharacterGroup(character.group)
    setEditingId(character.id)
    setSelectedImage(character.image || '')
    setNickname(character.nickname || '')
    setAvatarSource(character.avatarSource || 'device')
    setChatSide(character.chatSide || (character.group === 'main' ? 'right' : 'left'))
    setEditorOpen(true)
  }

  const openImageSourceFromEditor = () => {
    setEditorOpen(false)
    setSourceOpen(true)
  }

  const chooseDeviceImage = () => {
    setSourceOpen(false)
    setAvatarSource('device')
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      if (editingId || nickname) setEditorOpen(true)
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.')
      if (editingId || nickname) setEditorOpen(true)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
  showToast('Profile image must be 2 MB or smaller.')
  if (editingId || nickname) setEditorOpen(true)
  return
}

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(String(reader.result || ''))
      setAvatarSource('device')
      setEditorOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const loadShadowGallery = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setGalleryLoading(true)
      setGalleryError('')

      const response = await fetch(`${API_BASE_URL}/api/stories/chat/avatar-gallery?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load Shadow gallery')
      }

      setGalleryImages(data.images || [])
      setGalleryCategories(data.categories || [])
    } catch (error) {
      setGalleryError(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to load gallery')
    } finally {
      setGalleryLoading(false)
    }
  }

  const openShadowGallery = () => {
  if (!storyId) return

  const origin = 'cast-photo'
const returnUrl = new URL(
  window.location.href
)
const returnPath =
  returnUrl.pathname +
  returnUrl.search +
  returnUrl.hash

  sessionStorage.removeItem('shadow_gallery_selected_image')

  sessionStorage.setItem(
    `shadow_gallery_character_draft_${storyId}`,
    JSON.stringify({
      origin,
      returnPath,
      activeGroupKey,
      characterGroup,
      editingId,
      selectedImage,
      nickname,
      avatarSource,
      chatSide,
      createdAt: Date.now(),
    })
  )

  setSourceOpen(false)

  navigate(
    `/author/story/${storyId}/chat/shadow-gallery` +
      `?origin=${encodeURIComponent(origin)}` +
      `&return=${encodeURIComponent(returnPath)}`
  )
}

  const selectGalleryImage = (item) => {
    setSelectedImage(item.image_url || '')
    setAvatarSource('shadow_gallery')
    setGalleryOpen(false)
    setEditorOpen(true)
  }

  const deleteCharacter = () => {
    if (!editingId) return
    const confirmed = window.confirm('Delete this character?')
    if (!confirmed) return

    setCharacters((current) =>
      normalizeLeadCharacters(
        current.filter((character) => character.id !== editingId)
      )
    )
    setEditorOpen(false)
    setEditingId('')
    showToast('Character deleted. Press Save to update the database.')
  }

  const saveCharacter = async () => {
  const selectedGroup = ROLE_GROUPS.find((group) => group.key === characterGroup)
  if (!selectedGroup) return

  const cleanNickname = nickname.trim()

  if (characterGroup !== 'background' && !cleanNickname) {
    showToast('Please enter a nickname.')
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const wasEditing = Boolean(editingId)
  const nextCharacter = {
    group: characterGroup,
    image: selectedImage,
    nickname: cleanNickname,
    avatarSource,
    chatSide,
  }

  const nextCharacters = normalizeLeadCharacters(
  editingId
    ? characters.map((character) =>
        character.id === editingId
          ? { ...character, ...nextCharacter }
          : character
      )
    : [
        ...characters,
        {
          id: makeId(),
          isLead: false,
          ...nextCharacter,
        },
      ]
)

  try {
    setSaving(true)

    const uploadedCharacters = []

    for (let index = 0; index < nextCharacters.length; index += 1) {
      const character = nextCharacters[index]
      const avatarUrl = await uploadCharacterImage(
        token,
        character.image,
        storyId,
        index
      )

      uploadedCharacters.push({
        id: character.id,
        role_group: character.group,
        nickname: character.nickname || null,
        avatar_url: avatarUrl,
        avatar_source: character.avatarSource || 'device',
        is_lead: character.isLead === true,
        chat_side: character.isLead === true ? 'right' : 'left',
        gender: character.gender || null,
        birthday: character.birthday || null,
        height_cm: character.heightCm === '' ? null : character.heightCm,
        occupation: character.occupation || null,
        personality: character.personality || null,
        relationship: character.relationship || null,
        bio: character.bio || null,
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/chat/characters`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ characters: uploadedCharacters }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to save character')
    }

    const savedCharacters =
  normalizeLeadCharacters(
    (data.characters || []).map(
      mapCharacter
    )
  )

const previousCharacterIds =
  new Set(
    characters.map(
      (character) =>
        String(character.id)
    )
  )

const addedCharacter =
  wasEditing
    ? null
    : savedCharacters.find(
        (character) =>
          !previousCharacterIds.has(
            String(character.id)
          )
      ) || null

setCharacters(savedCharacters)

setSelectedCharacterIds(
  (current) => {
    const validCharacterIds =
      new Set(
        savedCharacters.map(
          (character) =>
            String(character.id)
        )
      )

    const nextIds =
      new Set(
        current
          .map((id) => String(id))
          .filter((id) =>
            validCharacterIds.has(id)
          )
      )

    if (addedCharacter) {
      nextIds.add(
        String(addedCharacter.id)
      )
    }

    const currentLead =
      savedCharacters.find(
        (character) =>
          character.isLead === true
      )

    if (currentLead) {
      nextIds.add(
        String(currentLead.id)
      )
    }

    return [...nextIds]
  }
)

setActiveGroupKey(characterGroup)
setEditorOpen(false)
setEditingId('')
showToast(
  wasEditing
    ? 'Character updated.'
    : 'Character added.'
)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend.'
        : error.message || 'Couldn’t save changes.'
    )
  } finally {
    setSaving(false)
  }
}

  const handleSavePage = async () => {
    if (saving || pageLoading) return

    if (selectedCharacters.length < 2) {
  showToast(
    'Choose at least 2 characters for this episode.'
  )
  return
}

if (
  selectedMainCharacters.length < 1
) {
  showToast(
    'Choose at least 1 Main Character for this episode.'
  )
  return
}

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)

      const normalizedCharacters =
        normalizeLeadCharacters(characters)

      const uploadedCharacters = []

      for (
        let index = 0;
        index < normalizedCharacters.length;
        index += 1
      ) {
        const character = normalizedCharacters[index]

        const avatarUrl = await uploadCharacterImage(
          token,
          character.image,
          storyId,
          index
        )

        uploadedCharacters.push({
          id: character.id,
          role_group: character.group,
          nickname: character.nickname || null,
          avatar_url: avatarUrl,
          avatar_source: character.avatarSource || 'device',
          is_lead: character.isLead === true,
          chat_side: character.isLead === true ? 'right' : 'left',
          gender: character.gender || null,
          birthday: character.birthday || null,
          height_cm:
            character.heightCm === ''
              ? null
              : character.heightCm,
          occupation: character.occupation || null,
          personality: character.personality || null,
          relationship: character.relationship || null,
          bio: character.bio || null,
        })
      }

      const endpoint =
        `${API_BASE_URL}/api/stories/${storyId}/chat/characters`

      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            characters: uploadedCharacters,
          }),
        },
        45000
      )

      const { data, rawText } =
        await readResponsePayload(response)

      if (!response.ok || data.ok === false) {
        const serverMessage =
          data.message ||
          data.error ||
          rawText.slice(0, 700) ||
          'Failed to save characters'

        throw new Error(serverMessage)
      }

      const savedCharacters =
  normalizeLeadCharacters(
    (data.characters || []).map(
      mapCharacter
    )
  )

const validCharacterIds =
  new Set(
    savedCharacters.map(
      (character) =>
        String(character.id)
    )
  )

const nextSelectedIds = [
  ...new Set(
    selectedCharacterIds
      .map((id) => String(id))
      .filter((id) =>
        validCharacterIds.has(id)
      )
  ),
]

const savedLeadCharacter =
  savedCharacters.find(
    (character) =>
      character.isLead === true
  )

if (
  savedLeadCharacter &&
  !nextSelectedIds.includes(
    String(savedLeadCharacter.id)
  )
) {
  nextSelectedIds.push(
    String(savedLeadCharacter.id)
  )
}

setCharacters(savedCharacters)
setSelectedCharacterIds(
  nextSelectedIds
)

sessionStorage.setItem(
  castStorageKey,
  JSON.stringify({
    characterIds:
      nextSelectedIds,
    updatedAt:
      new Date().toISOString(),
  })
)

showToast('Saved')

window.setTimeout(() => {
  const editorPath =
    `/author/story/${storyId}/chat/editor`

  navigate(
    startNewEpisode
      ? `${editorPath}?new=1&first=0`
      : editorPath,
    { replace: true }
  )
}, 500)
    } catch (error) {
      console.error(
        'SAVE CHAT STORY CHARACTERS ERROR:',
        error
      )

      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to save characters'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-[120px]">
      

      {toast ? (
        <button
          type="button"
          onClick={() => setToast('')}
          className="fixed inset-x-4 top-[76px] z-[220] mx-auto max-w-[320px] rounded-[14px] bg-white px-4 py-3 text-center text-[12px] font-normal text-[#667085] shadow-[0_6px_24px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
        >
          {toast}
        </button>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <HelpSheet group={helpGroup} onClose={() => setHelpGroup(null)} />

      <LeadCharacterSheet
  open={leadSheetOpen}
  characters={groupedCharacters.main}
  selectedId={leadDraftId}
  onSelect={setLeadDraftId}
  onClose={() => setLeadSheetOpen(false)}
  onConfirm={confirmLeadCharacter}
/>

      <ImageSourceSheet
        open={sourceOpen}
        onClose={() => setSourceOpen(false)}
        onDevice={chooseDeviceImage}
        onShadowGallery={openShadowGallery}
      />

      

      <CharacterEditor
        open={editorOpen}
        group={activeGroup}
        image={selectedImage}
        nickname={nickname}
        roleGroup={characterGroup}
        chatSide={chatSide}
        editing={Boolean(editingId)}
        onNicknameChange={setNickname}
        onRoleGroupChange={(value) => {
          setCharacterGroup(value)
          if (!editingId) setChatSide(value === 'main' ? 'right' : 'left')
        }}
        onChatSideChange={setChatSide}
        onChangeImage={openImageSourceFromEditor}
        onEditProfile={() => {
          if (!editingId) return

          setEditorOpen(false)

          const profilePath =
  `/author/story/${storyId}/chat/characters/${editingId}/profile`

navigate(
  startNewEpisode
    ? `${profilePath}?new=1`
    : profilePath
)
        }}
        onDelete={deleteCharacter}
        onClose={() => setEditorOpen(false)}
        saving={saving}
        onSave={saveCharacter}
      />

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(returnTo, { replace: true })}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 text-center">
  <h1 className="line-clamp-1 text-[17px] font-extrabold text-[#111827]">
    Build Your Cast
  </h1>
</div>

          <button
  type="button"
  onClick={handleSavePage}
  aria-disabled={saving || pageLoading}
  className={`h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-bold text-white shadow-sm active:scale-95 ${
    saving || pageLoading ? 'opacity-60' : ''
  }`}
>
  {saving ? 'Saving...' : 'Save'}
</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {pageLoading ? (
          <div className="mb-4 rounded-[18px] bg-white px-4 py-3 text-center text-[12px] font-bold text-[#667085] shadow-sm ring-1 ring-black/5">
            Loading characters...
          </div>
        ) : null}

        <section className="hidden rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-black/5 sm:block">
          <div className="grid grid-cols-4 gap-2">
            <Step number="1" title="Story Info" />
            <Step number="2" title="Characters" active />
            <Step number="3" title="Chat" />
            <Step number="4" title="Publish" />
          </div>
        </section>

        <LeadCharacterPanel
  character={leadCharacter}
  onChange={openLeadCharacterSheet}
/>

        {ROLE_GROUPS.map((group) => (
  <RoleSection
    key={group.key}
    group={group}
    characters={
      groupedCharacters[group.key]
    }
    selectedCharacterIdSet={
      selectedCharacterIdSet
    }
    onHelp={() =>
      setHelpGroup(group)
    }
    onAdd={() =>
      openAddCharacter(group.key)
    }
    onEdit={openEditCharacter}
    onToggle={
      toggleEpisodeCharacter
    }
    onEditProfile={(character) => {
      const profilePath =
        `/author/story/${storyId}/chat/characters/${character.id}/profile`

      navigate(
        startNewEpisode
          ? `${profilePath}?new=1`
          : profilePath
      )
    }}
  />
))}
      </main>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload character image')
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

function BottomSheet({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-end bg-black/45">
      <div
        className="w-full rounded-t-[28px] bg-white px-4 pb-[calc(22px+env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e2e5ea]" />
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
            className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99]"
          >
            Got it
          </button>
        </>
      ) : null}
    </BottomSheet>
  )
}

function ImageSourceSheet({ open, onClose, onDevice, onShadowGallery }) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2 className="text-center text-[16px] font-bold text-[#111827]">
        Choose profile image
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onDevice}
          className="flex min-h-[138px] flex-col items-center justify-center rounded-[22px] bg-[#f6fcff] px-3 text-center active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf8ff] text-[#2692bc]">
            <i className="fa-regular fa-image text-[22px]" />
          </span>

          <span className="mt-3 text-[13px] font-medium text-[#111827]">
            Upload from device
          </span>
        </button>

        <button
          type="button"
          onClick={onShadowGallery}
          className="flex min-h-[138px] flex-col items-center justify-center rounded-[22px] bg-[#fff7f9] px-3 text-center active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f4] text-[#ee6484]">
            <i className="fa-regular fa-address-card text-[22px]" />
          </span>

          <span className="mt-3 text-[13px] font-medium text-[#111827]">
            Shadow gallery
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 h-12 w-full rounded-full bg-[#faf9fc] text-[13px] font-medium text-[#111827]"
      >
        Cancel
      </button>
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
  roleGroup,
  chatSide,
  editing,
  onNicknameChange,
  onRoleGroupChange,
  onChatSideChange,
  onChangeImage,
  onDelete,
  onClose,
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
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/45 px-4">
      <div
        className="max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-[14px] bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">
              {editing ? 'Edit character' : 'Character details'}
            </h2>

            <div
              className="mt-1 text-[11px] font-medium"
              style={{ color: group.accent }}
            >
              {group.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f6fa] text-[#111827]"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
  <div className="relative">
    <div
      className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full"
      style={{ backgroundColor: group.soft }}
    >
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <i className="fa-solid fa-user text-[38px] text-white" />
      )}
    </div>

    <button
      type="button"
      onClick={onChangeImage}
      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-md active:scale-95"
      aria-label="Replace profile image"
    >
      <i className="fa-solid fa-camera text-[13px]" />
    </button>
  </div>
</div>

        <label className="mt-5 block text-[12px] font-bold text-[#111827]">
          Nickname
          {roleGroup === 'background' ? (
            <span className="ml-1 font-normal text-[#98a2b3]">
              (optional)
            </span>
          ) : null}
        </label>

        <input
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value)}
          placeholder={
            roleGroup === 'background'
              ? 'Example: Guard, Maid 1, Doctor'
              : 'Enter character nickname'
          }
          maxLength={40}
          className="mt-2 h-12 w-full rounded-[16px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-[14px] font-normal text-[#111827] outline-none focus:border-[#7c3aed] focus:bg-white"
        />

        <label className="mt-4 block text-[12px] font-bold text-[#111827]">
          Character group
        </label>

        <div className="relative mt-2">
          <select
            value={roleGroup}
            onChange={(event) => onRoleGroupChange(event.target.value)}
            className="h-12 w-full appearance-none rounded-[16px] border border-[#e4e7ec] bg-[#fafafe] px-4 pr-14 text-[13px] font-normal text-[#111827] outline-none focus:border-[#7c3aed] focus:bg-white"
          >
            {ROLE_GROUPS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.title}
              </option>
            ))}
          </select>

          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[11px] text-[#667085]" />
        </div>

        

        <button
          type="button"
          onClick={onSave}
          className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9262ef] to-[#6d42db] text-[13px] font-medium text-white active:scale-[0.99]"
        >
          Save character
        </button>

        {editing ? (
          <button
            type="button"
            onClick={onDelete}
            className="mt-3 h-11 w-full rounded-full bg-[#fff7f8] text-[12px] font-medium text-[#e11d48]"
          >
            Delete character
          </button>
        ) : null}
      </div>
    </div>
  )
}

function CharacterCard({ character, index, group, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-[168px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-white px-3 shadow-[0_5px_18px_rgba(15,23,42,0.07)] ring-1 ring-black/5 active:scale-[0.98]"
    >
      <span
        className="absolute left-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-[8px] px-1.5 text-[10px] font-extrabold"
        style={{ backgroundColor: group.soft, color: group.accent }}
      >
        {index + 1}
      </span>

      <span
        className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor: group.soft }}
      >
        {character.image ? (
          <img src={character.image} alt={character.nickname || group.shortTitle} className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-user text-[27px] text-white" />
        )}
      </span>

      <span className="mt-3 line-clamp-1 w-full text-[12px] font-extrabold text-[#111827]">
        {character.nickname || 'Unnamed role'}
      </span>

      <span className="mt-1 line-clamp-1 w-full text-[9.5px] font-bold" style={{ color: group.accent }}>
        {group.shortTitle}
      </span>
    </button>
  )
}

function AddCharacterCard({ group, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[168px] w-[126px] shrink-0 flex-col items-center justify-center rounded-[20px] border border-dashed bg-white/75 px-3 text-center active:scale-[0.98]"
      style={{ borderColor: group.border }}
    >
      <span
        className="flex h-[66px] w-[66px] items-center justify-center rounded-full"
        style={{ backgroundColor: group.soft, color: group.accent }}
      >
        <i className="fa-solid fa-plus text-[22px]" />
      </span>
      <span className="mt-3 text-[11px] font-extrabold" style={{ color: group.accent }}>
        Add character
      </span>
    </button>
  )
}

function RoleSection({ group, characters, onHelp, onAdd, onEdit }) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: group.soft, color: group.accent }}
          >
            <i className={`${group.icon} text-[11px]`} />
          </span>

          <h2 className="line-clamp-1 text-[15px] font-extrabold text-[#111827]">{group.title}</h2>

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
          {characters.length} {characters.length === 1 ? 'role' : 'roles'}
        </span>
      </div>

      <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-3">
        {characters.map((character, index) => (
          <CharacterCard
            key={character.id}
            character={character}
            index={index}
            group={group}
            onClick={() => onEdit(character)}
          />
        ))}

        <AddCharacterCard group={group} onClick={onAdd} />
      </div>
    </section>
  )
}

export default function ChatStoryCharactersPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const fileInputRef = useRef(null)
  const [characters, setCharacters] = useState([])
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
  const [galleryCategory, setGalleryCategory] = useState('All')

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

        setCharacters(
          (data.characters || []).map((character) => ({
            id: character.id,
            group: character.role_group,
            image: character.avatar_url || '',
            nickname: character.nickname || '',
            avatarSource: character.avatar_source || 'device',
            chatSide: character.chat_side || (character.role_group === 'main' ? 'right' : 'left'),
          }))
        )
      } catch (error) {
        showToast(error.message || 'Failed to load characters')
      } finally {
        setPageLoading(false)
      }
    }

    loadCharacters()
  }, [navigate, storyId])

  const activeGroup = ROLE_GROUPS.find((group) => group.key === characterGroup || group.key === activeGroupKey) || null

  const groupedCharacters = useMemo(() => {
    return ROLE_GROUPS.reduce((result, group) => {
      result[group.key] = characters.filter((character) => character.group === group.key)
      return result
    }, {})
  }, [characters])

  const totalCharacters = characters.length
  const canContinue = totalCharacters >= 2 && groupedCharacters.main.length >= 1

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
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

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image must be 8 MB or smaller.')
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
    setSourceOpen(false)
    setGalleryCategory('All')
    setGalleryOpen(true)
    loadShadowGallery()
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

    setCharacters((current) => current.filter((character) => character.id !== editingId))
    setEditorOpen(false)
    setEditingId('')
    showToast('Character deleted. Press Save to update the database.')
  }

  const saveCharacter = () => {
    const selectedGroup = ROLE_GROUPS.find((group) => group.key === characterGroup)
    if (!selectedGroup) return

    const cleanNickname = nickname.trim()

    if (characterGroup !== 'background' && !cleanNickname) {
      showToast('Please enter a nickname.')
      return
    }

    const nextCharacter = {
      group: characterGroup,
      image: selectedImage,
      nickname: cleanNickname,
      avatarSource,
      chatSide,
    }

    if (editingId) {
      setCharacters((current) =>
        current.map((character) =>
          character.id === editingId
            ? { ...character, ...nextCharacter }
            : character
        )
      )
    } else {
      setCharacters((current) => [
        ...current,
        {
          id: makeId(),
          ...nextCharacter,
        },
      ])
    }

    setActiveGroupKey(characterGroup)
    setEditorOpen(false)
    showToast(editingId ? 'Character updated. Press Save to keep changes.' : 'Character added.')
  }

  const handleSavePage = async () => {
  if (totalCharacters < 2) {
    showToast('Add at least 2 characters before creating the chat.')
    return
  }

  if (groupedCharacters.main.length < 1) {
    showToast('Add at least 1 character to Main Characters.')
    return
  }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)

      const uploadedCharacters = []

      for (let index = 0; index < characters.length; index += 1) {
        const character = characters[index]
        const avatarUrl = await uploadCharacterImage(token, character.image, storyId, index)

        uploadedCharacters.push({
          role_group: character.group,
          nickname: character.nickname || null,
          avatar_url: avatarUrl,
          avatar_source: character.avatarSource || 'device',
          chat_side: character.chatSide || (character.group === 'main' ? 'right' : 'left'),
        })
      }

      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/chat/characters`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ characters: uploadedCharacters }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save characters')
      }

      setCharacters(
        (data.characters || []).map((character) => ({
          id: character.id,
          group: character.role_group,
          image: character.avatar_url || '',
          nickname: character.nickname || '',
          avatarSource: character.avatar_source || 'device',
          chatSide: character.chat_side || (character.role_group === 'main' ? 'right' : 'left'),
        }))
      )

      navigate(`/author/story/${storyId}/chat/editor`)
    } catch (error) {
      showToast(error.message === 'Failed to fetch' ? 'Cannot connect to backend.' : error.message || 'Failed to save characters')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5fb] pb-[120px]">
      {toast ? (
        <button
          type="button"
          onClick={() => setToast('')}
          className="fixed inset-x-4 top-[76px] z-[220] mx-auto max-w-[420px] rounded-[16px] bg-[#111827] px-4 py-3 text-center text-[12px] font-bold text-white shadow-xl"
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

      <ImageSourceSheet
        open={sourceOpen}
        onClose={() => setSourceOpen(false)}
        onDevice={chooseDeviceImage}
        onShadowGallery={openShadowGallery}
      />

      <GallerySheet
        open={galleryOpen}
        loading={galleryLoading}
        error={galleryError}
        images={galleryImages}
        categories={galleryCategories}
        selectedCategory={galleryCategory}
        onCategoryChange={setGalleryCategory}
        onSelect={selectGalleryImage}
        onRetry={loadShadowGallery}
        onClose={() => {
          setGalleryOpen(false)
          if (editingId || nickname) setEditorOpen(true)
        }}
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
        onDelete={deleteCharacter}
        onClose={() => setEditorOpen(false)}
        onSave={saveCharacter}
      />

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="line-clamp-1 text-[17px] font-extrabold text-[#111827]">Build Your Cast</h1>
            <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c3aed]">
              Chat Story
            </div>
          </div>

          <button
  type="button"
  onClick={handleSavePage}
  disabled={saving || pageLoading}
  className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-bold text-white shadow-sm active:scale-95 disabled:opacity-60"
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

        <section className="rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-4 gap-2">
            <Step number="1" title="Story Info" />
            <Step number="2" title="Characters" active />
            <Step number="3" title="Chat" />
            <Step number="4" title="Publish" />
          </div>
        </section>

        {ROLE_GROUPS.map((group) => (
          <RoleSection
            key={group.key}
            group={group}
            characters={groupedCharacters[group.key]}
            onHelp={() => setHelpGroup(group)}
            onAdd={() => openAddCharacter(group.key)}
            onEdit={openEditCharacter}
          />
        ))}

        <section className="mt-6 rounded-[20px] bg-white px-4 py-4 shadow-sm ring-1 ring-black/5">
  <div className="flex items-center gap-3">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${canContinue ? 'bg-[#eafaf2] text-[#16803c]' : 'bg-[#f1ecff] text-[#7c3aed]'}`}>
      <i className={`fa-solid ${canContinue ? 'fa-check' : 'fa-shield-halved'} text-[14px]`} />
    </span>

    <div className="min-w-0">
      <div className="text-[12.5px] font-extrabold text-[#111827]">
        {canContinue ? 'Characters are ready' : 'Add at least 2 characters to continue'}
      </div>
      <div className="mt-1 text-[10.5px] leading-4 text-[#667085]">
        At least one character must be in Main Characters.
      </div>
    </div>
  </div>
</section>

<div className="mt-3 text-center text-[9px] font-semibold text-[#98a2b3]">
  Story ID: {storyId || 'Not found'}
</div>

<button
  type="button"
  disabled={!canContinue || saving || pageLoading}
  onClick={() => handleSavePage(true)}
  className={`mt-5 h-12 w-full rounded-full text-[13px] font-extrabold text-white ${canContinue && !saving && !pageLoading ? 'bg-[#111827] active:scale-[0.99]' : 'bg-[#d0d5dd]'}`}
>
  {saving ? 'Saving...' : 'Next: Create Chat'}
</button>
      </main>
    </div>
  )
}

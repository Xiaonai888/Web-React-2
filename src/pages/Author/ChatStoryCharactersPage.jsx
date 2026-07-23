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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-end bg-black/45" onClick={onClose}>
      <div
        className="w-full rounded-t-[28px] bg-white px-4 pb-[calc(22px+env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
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
      <h2 className="text-center text-[18px] font-extrabold text-[#111827]">Choose profile image</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onDevice}
          className="flex min-h-[138px] flex-col items-center justify-center rounded-[22px] bg-[#eefaff] px-3 text-center active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d9f4ff] text-[#147ca5]">
            <i className="fa-regular fa-image text-[22px]" />
          </span>
          <span className="mt-3 text-[13px] font-extrabold text-[#111827]">Upload from device</span>
        </button>

        <button
          type="button"
          onClick={onShadowGallery}
          className="flex min-h-[138px] flex-col items-center justify-center rounded-[22px] bg-[#fff0f4] px-3 text-center active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe0e8] text-[#e5486d]">
            <i className="fa-regular fa-address-card text-[22px]" />
          </span>
          <span className="mt-3 text-[13px] font-extrabold text-[#111827]">Shadow gallery</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 h-12 w-full rounded-full bg-[#f5f3fa] text-[13px] font-extrabold text-[#111827]"
      >
        Cancel
      </button>
    </BottomSheet>
  )
}

function CharacterEditor({ open, group, image, nickname, onNicknameChange, onClose, onSave }) {
  if (!open || !group) return null

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#111827]">Character details</h2>
            <div className="mt-1 text-[11px] font-bold" style={{ color: group.accent }}>
              {group.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundColor: group.soft }}
          >
            {image ? (
              <img src={image} alt="" className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-[34px] text-white" />
            )}
          </div>
        </div>

        <label className="mt-5 block text-[12px] font-extrabold text-[#111827]">
          Nickname {group.key === 'background' ? <span className="font-semibold text-[#98a2b3]">(optional)</span> : null}
        </label>

        <input
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value)}
          placeholder={group.key === 'background' ? 'Example: Guard, Maid 1, Doctor' : 'Enter character nickname'}
          maxLength={40}
          className="mt-2 h-12 w-full rounded-[16px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-[14px] text-[#111827] outline-none focus:border-[#7c3aed] focus:bg-white"
        />

        <button
          type="button"
          onClick={onSave}
          className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9262ef] to-[#6d42db] text-[13px] font-extrabold text-white active:scale-[0.99]"
        >
          Save character
        </button>
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

  const activeGroup = ROLE_GROUPS.find((group) => group.key === activeGroupKey) || null

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
    setEditingId('')
    setSelectedImage('')
    setNickname('')
    setSourceOpen(true)
  }

  const openEditCharacter = (character) => {
    setActiveGroupKey(character.group)
    setEditingId(character.id)
    setSelectedImage(character.image || '')
    setNickname(character.nickname || '')
    setEditorOpen(true)
  }

  const chooseDeviceImage = () => {
    setSourceOpen(false)
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(String(reader.result || ''))
      setEditorOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const openShadowGallery = () => {
    setSourceOpen(false)
    showToast('Shadow gallery will connect in the next step.')
  }

  const saveCharacter = () => {
    if (!activeGroup) return

    const cleanNickname = nickname.trim()

    if (activeGroup.key !== 'background' && !cleanNickname) {
      showToast('Please enter a nickname.')
      return
    }

    if (editingId) {
      setCharacters((current) =>
        current.map((character) =>
          character.id === editingId
            ? { ...character, image: selectedImage, nickname: cleanNickname }
            : character
        )
      )
    } else {
      setCharacters((current) => [
        ...current,
        {
          id: makeId(),
          group: activeGroup.key,
          image: selectedImage,
          nickname: cleanNickname,
          avatarSource: 'device',
          chatSide: activeGroup.key === 'main' ? 'right' : 'left',
        },
      ])
    }

    setEditorOpen(false)
    showToast(editingId ? 'Character updated.' : 'Character added.')
  }

  const handleSavePage = async (continueAfterSave = false) => {
    if (!canContinue) {
      showToast('Add at least 2 characters, including 1 main character.')
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

      showToast(continueAfterSave ? 'Characters saved. Step 3 UI is next.' : 'Characters saved successfully.')
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

      <CharacterEditor
        open={editorOpen}
        group={activeGroup}
        image={selectedImage}
        nickname={nickname}
        onNicknameChange={setNickname}
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
            onClick={() => handleSavePage(false)}
            disabled={saving || pageLoading}
            className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-extrabold text-white shadow-sm active:scale-95"
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

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const ROLE_GROUPS = [
  {
    value: 'main',
    label: 'Main Characters',
    accent: '#7C3AED',
    soft: '#F3E8FF',
    icon: 'fa-solid fa-crown',
  },
  {
    value: 'major',
    label: 'Major Supporting Characters',
    accent: '#F97316',
    soft: '#FFF1E8',
    icon: 'fa-solid fa-star',
  },
  {
    value: 'minor',
    label: 'Minor Supporting Characters',
    accent: '#0F9F7A',
    soft: '#E8FFF8',
    icon: 'fa-solid fa-user-group',
  },
  {
    value: 'background',
    label: 'Background Characters',
    accent: '#64748B',
    soft: '#F1F5F9',
    icon: 'fa-solid fa-users',
  },
]

const GENDERS = ['', 'Female', 'Male', 'Non-binary', 'Unknown']

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

async function uploadProfileImage(token, imageDataUrl, storyId, characterId) {
  if (!String(imageDataUrl || '').startsWith('data:image/')) return imageDataUrl || null

  const formData = new FormData()
  formData.append(
    'image',
    dataUrlToFile(imageDataUrl, `chat-profile-${storyId}-${characterId}-${Date.now()}.jpg`)
  )
  formData.append('folder', 'chat_story_character')

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload profile image')
  }

  return data.image_url || data.imageUrl || null
}


function CharacterGroupSheet({ open, value, onChange, onClose }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    dragYRef.current = 0
    draggingRef.current = false

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
      className="fixed inset-0 z-[210] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="mx-auto w-full max-w-[520px] rounded-t-[28px] bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current ? 'none' : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label="Drag down to close"
        >
          <span className="h-1.5 w-12 rounded-full bg-[#d9dce4]" />
        </button>

        <h2 className="mt-2 text-[17px] font-bold text-[#111827]">
          Choose character group
        </h2>

        <div className="mt-4 space-y-2">
          {ROLE_GROUPS.map((item) => {
            const selected = value === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  onChange(item.value)
                  onClose()
                }}
                className={`flex w-full items-center justify-between rounded-[16px] px-3.5 py-3 text-left ${
                  selected
                    ? 'bg-[#f3e8ff]'
                    : 'bg-[#fafafa] active:bg-[#f5f3f8]'
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: item.soft,
                      color: item.accent,
                    }}
                  >
                    <i className={`${item.icon} text-[12px]`} />
                  </span>

                  <span
                    className={`line-clamp-1 text-[13px] font-medium ${
                      selected ? 'text-[#6d42db]' : 'text-[#111827]'
                    }`}
                  >
                    {item.label}
                  </span>
                </span>

                {selected ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white">
                    <i className="fa-solid fa-check text-[10px]" />
                  </span>
                ) : (
                  <span className="h-6 w-6 shrink-0 rounded-full border border-[#d0d5dd]" />
                )}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function GenderSheet({ open, value, onChange, onClose }) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    dragYRef.current = 0
    draggingRef.current = false

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
      className="fixed inset-0 z-[220] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="mx-auto w-full max-w-[520px] rounded-t-[28px] bg-white px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: draggingRef.current
            ? 'none'
            : 'transform 220ms ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mx-auto flex h-8 w-20 touch-none items-center justify-center"
          aria-label="Drag down to close"
        >
          <span className="h-1.5 w-12 rounded-full bg-[#d9dce4]" />
        </button>

        <h2 className="mt-2 text-[17px] font-bold text-[#111827]">
          Choose gender
        </h2>

        <div className="mt-3">
          {GENDERS.map((item) => {
            const selected = value === item
            const label = item || 'Not specified'

            return (
              <button
                key={item || 'not-specified'}
                type="button"
                onClick={() => {
                  onChange(item)
                  onClose()
                }}
                className="flex w-full items-center justify-between border-b border-[#eef0f3] py-3.5 text-left last:border-b-0 active:opacity-60"
              >
                <span
                  className={`text-[13px] ${
                    selected
                      ? 'font-medium text-[#111827]'
                      : 'font-normal text-[#475467]'
                  }`}
                >
                  {label}
                </span>

                {selected ? (
                  <i className="fa-solid fa-check text-[12px] text-[#7c3aed]" />
                ) : (
                  <span className="h-3 w-3" />
                )}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default function ChatStoryCharacterProfilePage() {
  const navigate = useNavigate()
  const { storyId, characterId } = useParams()
  const fileInputRef = useRef(null)

  const [nickname, setNickname] = useState('')
  const [roleGroup, setRoleGroup] = useState('main')
  const [groupSheetOpen, setGroupSheetOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarSource, setAvatarSource] = useState('device')
  const [gender, setGender] = useState('')
  const [genderSheetOpen, setGenderSheetOpen] = useState(false)
  const [birthday, setBirthday] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [occupation, setOccupation] = useState('')
  const [personality, setPersonality] = useState('')
  const [relationship, setRelationship] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/chat/characters/${characterId}/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load character profile')
        }

        const character = data.character || {}
        setNickname(character.nickname || '')
        setRoleGroup(character.role_group || 'main')
        setAvatarUrl(character.avatar_url || '')
        setAvatarSource(character.avatar_source || 'device')
        setGender(character.gender || '')
        setBirthday(character.birthday || '')
        setHeightCm(character.height_cm || '')
        setOccupation(character.occupation || '')
        setPersonality(character.personality || '')
        setRelationship(character.relationship || '')
        setBio(character.bio || '')
      } catch (error) {
        setMessage(error.message || 'Failed to load character profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [characterId, navigate, storyId])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage('Image must be 8 MB or smaller.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarUrl(String(reader.result || ''))
      setAvatarSource('device')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (roleGroup !== 'background' && !nickname.trim()) {
      setMessage('Please enter a character name.')
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const uploadedAvatar = await uploadProfileImage(
        token,
        avatarUrl,
        storyId,
        characterId
      )

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/chat/characters/${characterId}/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nickname: nickname.trim(),
            role_group: roleGroup,
            avatar_url: uploadedAvatar,
            avatar_source: avatarSource,
            gender: gender || null,
            birthday: birthday || null,
            height_cm: heightCm === '' ? null : Number(heightCm),
            occupation: occupation.trim() || null,
            personality: personality.trim() || null,
            relationship: relationship.trim() || null,
            bio: bio.trim() || null,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save character profile')
      }

      navigate(`/author/story/${storyId}/chat/characters`)
    } catch (error) {
      setMessage(error.message || 'Failed to save character profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <CharacterGroupSheet
        open={groupSheetOpen}
        value={roleGroup}
        onChange={setRoleGroup}
        onClose={() => setGroupSheetOpen(false)}
      />

      <GenderSheet
  open={genderSheetOpen}
  value={gender}
  onChange={setGender}
  onClose={() => setGenderSheetOpen(false)}
/>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center bg-transparent text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827]">
            Character Profile
          </h1>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="h-10 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-5 text-[12px] font-medium text-white shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-6">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-5 w-full rounded-[14px] bg-[#111827] px-4 py-3 text-center text-[12px] font-medium text-white"
          >
            {message}
          </button>
        ) : null}

        {loading ? (
          <div className="py-20 text-center text-[13px] font-medium text-[#667085]">
            Loading profile...
          </div>
        ) : (
          <>
            <section className="flex justify-center">
              <div className="relative">
                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#f1ecff]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <i className="fa-solid fa-user text-[48px] text-white" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-md"
                  aria-label="Replace profile image"
                >
                  <i className="fa-solid fa-camera text-[14px]" />
                </button>
              </div>
            </section>

            <section className="mt-8 divide-y divide-[#eceef2]">
              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Name
                </span>
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  maxLength={40}
                  placeholder="Enter character name"
                  className="h-12 w-full rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-[14px] font-normal text-[#111827] outline-none focus:border-[#7c3aed] focus:bg-white"
                />
              </label>

              <div className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Character Group
                </span>

                <button
                  type="button"
                  onClick={() => setGroupSheetOpen(true)}
                  className="flex h-12 w-full items-center justify-between rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-left text-[14px] font-normal text-[#111827] active:bg-[#f7f5fb]"
                >
                  <span className="line-clamp-1">
                    {ROLE_GROUPS.find((item) => item.value === roleGroup)?.label ||
                      'Main Characters'}
                  </span>

                  <i className="fa-solid fa-chevron-down text-[11px] text-[#667085]" />
                </button>
              </div>

              <div className="block py-4">
  <span className="mb-2 block text-[13px] font-bold text-[#111827]">
    Gender
  </span>

  <button
    type="button"
    onClick={() => setGenderSheetOpen(true)}
    className="flex h-12 w-full items-center justify-between rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-left text-[14px] font-normal text-[#111827] active:bg-[#f7f5fb]"
  >
    <span>{gender || 'Not specified'}</span>

    <i className="fa-solid fa-chevron-down text-[11px] text-[#667085]" />
  </button>
</div>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Birthday
                </span>
                <input
                  type="date"
                  value={birthday}
                  onChange={(event) => setBirthday(event.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-[14px] font-normal text-[#111827] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Height
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={heightCm}
                    onChange={(event) => setHeightCm(event.target.value)}
                    placeholder="Enter height"
                    className="h-12 w-full rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 pr-14 text-[14px] font-normal text-[#111827] outline-none"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#98a2b3]">
                    cm
                  </span>
                </div>
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Role / Occupation
                </span>
                <input
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                  maxLength={120}
                  placeholder="Example: CEO, Student, Doctor"
                  className="h-12 w-full rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 text-[14px] font-normal text-[#111827] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Personality
                </span>
                <textarea
                  value={personality}
                  onChange={(event) => setPersonality(event.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="Example: Calm, jealous, loyal, shy"
                  className="w-full resize-none rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 py-3 text-[14px] font-normal leading-6 text-[#111827] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Relationship
                </span>
                <textarea
                  value={relationship}
                  onChange={(event) => setRelationship(event.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="Example: Love interest, rival, sister, best friend"
                  className="w-full resize-none rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 py-3 text-[14px] font-normal leading-6 text-[#111827] outline-none"
                />
              </label>

              <label className="block py-4">
                <span className="mb-2 block text-[13px] font-bold text-[#111827]">
                  Bio
                </span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={5000}
                  rows={8}
                  placeholder="Write the character background, goals, secrets or important details..."
                  className="w-full resize-none rounded-[14px] border border-[#e4e7ec] bg-[#fafafe] px-4 py-3 text-[14px] font-normal leading-6 text-[#111827] outline-none"
                />
                <div className="mt-1 text-right text-[10px] text-[#98a2b3]">
                  {bio.length}/5000
                </div>
              </label>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

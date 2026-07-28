import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ImageSourceSheet } from './ChatStoryCharactersPage'

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
  if (!String(imageDataUrl || '').startsWith('data:image/')) {
    return imageDataUrl || null
  }

  const formData = new FormData()

  formData.append(
    'image',
    dataUrlToFile(
      imageDataUrl,
      `chat-character-${storyId}-${index + 1}-${Date.now()}.jpg`
    )
  )

  formData.append('folder', 'chat_story_character')

  const response = await fetch(
    `${API_BASE_URL}/api/story-media/upload-image`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to upload character image')
  }

  return data.image_url || data.imageUrl || null
}

function mapCharacter(character) {
  const group = character.role_group || 'background'

  return {
    id: character.id,
    nickname: character.nickname || '',
    image: character.avatar_url || '',
    group,
    avatarSource: character.avatar_source || 'device',
isLead: character.is_lead === true,
chatSide:
  character.chat_side ||
  (group === 'main' ? 'right' : 'left'),
gender: character.gender || '',
    birthday: character.birthday || '',
    heightCm: character.height_cm || '',
    occupation: character.occupation || '',
    personality: character.personality || '',
    relationship: character.relationship || '',
    bio: character.bio || '',
  }
}

function countWords(value) {
  const text = String(value || '').trim()
  if (!text) return 0

  if (typeof Intl?.Segmenter === 'function') {
    return [...new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text)]
      .filter((item) => item.isWordLike).length
  }

  return text.split(/\s+/u).filter(Boolean).length
}

const MESSAGE_SYMBOLS = ['(...)', '—', '…', '?!', '♡', '✦', '☁', '「」', '♪']
const MAX_AUDIO_SIZE_BYTES = 5 * 1024 * 1024
const MAX_AUDIO_DURATION_SECONDS = 60
const MIN_AUDIO_DURATION_SECONDS = 1
const AUDIO_ACCEPT =
  'audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/x-wav,audio/webm,.mp3,.m4a,.aac,.wav,.webm'
function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function Step({ number, title, active, done }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
          active
            ? 'bg-[#111827] text-white'
            : done
              ? 'bg-[#eafaf2] text-[#16803c]'
              : 'bg-[#f2f4f7] text-[#98a2b3]'
        }`}
      >
        {done ? <i className="fa-solid fa-check text-[10px]" /> : number}
      </div>
      <div
        className={`line-clamp-1 text-[10px] font-extrabold ${
          active ? 'text-[#111827]' : done ? 'text-[#16803c]' : 'text-[#98a2b3]'
        }`}
      >
        {title}
      </div>
    </div>
  )
}

function CharacterAvatar({ character, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[52px] shrink-0 rounded-[10px] py-1 text-center transition active:scale-[0.97] ${
  selected ? 'bg-[#f5f6f8]' : 'bg-transparent'
}`}
      aria-pressed={selected}
    >
      <span
        className={`relative mx-auto flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] transition ${
          selected
            ? 'ring-[3px] ring-[#7c3aed] ring-offset-1 ring-offset-[#f5f6f8]'
            : 'ring-1 ring-inset ring-black/5'
        }`}
      >
        {character.image ? (
          <img
            src={character.image}
            alt={character.nickname || 'Character'}
            className="h-full w-full object-cover"
          />
        ) : (
          <i className="fa-solid fa-user text-[18px] text-[#9b87c9]" />
        )}

        
      </span>

      <span
        className={`mt-1 block truncate text-[8.5px] font-semibold ${
  selected ? 'text-[#7c3aed]' : 'text-[#667085]'
}`}
      >
        {character.nickname || 'Unnamed'}
      </span>
    </button>
  )
}

function CharacterQuickPopup({
  character,
  onClose,
  onConfirm,
  onEditProfile,
}) {
  if (!character) return null

  return (
    <div
      className="fixed inset-0 z-[260] flex items-center justify-center bg-black/55 px-5"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[360px] rounded-[28px] bg-white px-6 pb-6 pt-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onEditProfile}
            className="relative active:scale-[0.98]"
            aria-label="Edit character profile image"
          >
            <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] ring-1 ring-black/5">
              {character.image ? (
                <img
                  src={character.image}
                  alt={character.nickname || 'Character'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[38px] text-[#9b87c9]" />
              )}
            </span>

            <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-md">
              <i className="fa-solid fa-camera text-[13px]" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onEditProfile}
          className="mt-7 flex h-14 w-full items-center justify-between rounded-full bg-[#f7f7f8] px-5 text-[#111827] active:bg-[#f1f2f4]"
        >
          <span className="min-w-0 flex-1 truncate text-center text-[16px] font-medium">
            {character.nickname || 'Unnamed character'}
          </span>

          <i className="fa-regular fa-pen-to-square ml-3 shrink-0 text-[17px] text-[#98a2b3]" />
        </button>

        <button
          type="button"
          onClick={onEditProfile}
          className="mx-auto mt-5 flex items-center justify-center gap-2 px-4 py-2 text-[14px] font-medium text-[#7c3aed] active:opacity-60"
        >
          Edit Profile
          <i className="fa-solid fa-angles-right text-[10px]" />
        </button>

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
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white shadow-sm active:scale-[0.98]"
          >
            Confirm
          </button>
        </div>
      </section>
    </div>
  )
}

function AsideAvatar({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[52px] shrink-0 rounded-[10px] py-1 text-center transition active:scale-[0.97] ${
  active ? 'bg-[#f5f6f8]' : 'bg-transparent'
}`}
      aria-pressed={active}
    >
      <span
        className={`relative mx-auto flex h-[40px] w-[40px] items-center justify-center rounded-full transition ${
  active
    ? 'bg-[#ede9fe] text-[#7c3aed] ring-[3px] ring-inset ring-[#7c3aed]'
    : 'bg-[#f2f4f7] text-[#667085] ring-1 ring-inset ring-black/5'
}`}
      >
        <i className="fa-solid fa-align-left text-[14px]" />
      </span>

      <span
        className={`mt-1 block truncate text-[8.5px] font-semibold ${
  active ? 'text-[#7c3aed]' : 'text-[#667085]'
}`}
      >
        ASIDE
      </span>
    </button>
  )
}

function AsideMessage({
  message,
  active,
  onEdit,
  onElementRef,
}) {
  return (
    <div
      ref={(node) => onElementRef(message.id, node)}
      data-message-id={message.id}
      className="group mx-auto flex max-w-[88%] items-start justify-center gap-2 py-2"
    >
      <div
        className={`min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-[18px] bg-[#f3f4f6] px-4 py-3 text-center text-[13px] leading-6 text-[#475467] ${
  active
    ? 'ring-2 ring-[#a855f7] ring-offset-2 ring-offset-white'
    : ''
}`}
      >
        {message.text}
      </div>

      <button
        type="button"
        onClick={() => onEdit(message.id)}
        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full active:scale-95 ${
          active
            ? 'bg-[#ede9fe] text-[#7c3aed]'
            : 'text-[#c0c5cf] active:bg-[#f3f4f6]'
        }`}
        aria-label="Edit aside"
      >
        <i className="fa-solid fa-pen text-[10px]" />
      </button>
    </div>
  )
}

function AuthorNoteMessage({ message, onDelete }) {
  return (
    <section className="mx-auto mt-8 max-w-[560px] pb-3">
      <div className="mb-4 text-center">
        <div className="text-[11px] tracking-[0.18em] text-[#8a7d96]">
          to be continued
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 px-6">
          <span className="h-px flex-1 bg-[#ece7ef]" />
          <span className="text-[12px] text-[#ef4444]">♥</span>
          <span className="h-px flex-1 bg-[#ece7ef]" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[16px] border border-[#e5d8ff] bg-gradient-to-br from-[#fbf9ff] to-[#f5efff] px-4 py-4 shadow-[0_6px_18px_rgba(124,58,237,0.06)]">
        <span className="absolute right-4 top-3 text-[17px] text-[#c4a7ff]">
          ✦
        </span>

        <span className="absolute right-8 top-7 text-[10px] text-[#d9c8ff]">
          ✦
        </span>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eadfff] text-[#7c3aed]">
              <i className="fa-solid fa-pen text-[11px]" />
            </span>

            <h3 className="text-[13px] font-bold text-[#6d42db]">
              Author&apos;s Note
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#a89ab8] active:bg-white/80 active:text-[#dc2626]"
            aria-label="Delete author's note"
          >
            <i className="fa-regular fa-trash-can text-[10px]" />
          </button>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-[12.5px] leading-6 text-[#475467]">
          {message.text}
        </p>
      </div>
    </section>
  )
}

function ChatMessage({
  message,
  character,
  right,
  active,
  onEdit,
  onElementRef,
}) {
  const editButton = (
    <button
      type="button"
      onClick={() => onEdit(message.id)}
      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full active:scale-95 ${
        active
          ? 'bg-[#ede9fe] text-[#7c3aed]'
          : 'text-[#c0c5cf] active:bg-[#f3f4f6]'
      }`}
      aria-label="Edit message"
    >
      <i className="fa-solid fa-pen text-[10px]" />
    </button>
  )

  return (
    <div
      ref={(node) => onElementRef(message.id, node)}
      data-message-id={message.id}
      className={`flex items-end gap-2 py-2 ${
        right ? 'justify-end' : 'justify-start'
      }`}
    >
      {!right ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] ring-1 ring-black/5">
          {character?.image ? (
            <img
              src={character.image}
              alt={character.nickname || 'Character'}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[13px] text-[#9b87c9]" />
          )}
        </span>
      ) : null}

      <div
        className={`min-w-0 max-w-[72%] ${
          right
            ? 'items-end text-right'
            : 'items-start text-left'
        }`}
      >
        <div className="mb-1 px-1 text-[9.5px] font-extrabold text-[#98a2b3]">
          {character?.nickname || 'Character'}
        </div>

        <div className="flex items-start gap-1.5">
          {right ? editButton : null}

          <div
            className={`min-w-0 max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-[20px] px-4 py-3 text-[13px] leading-6 ${
              right
                ? 'rounded-br-[7px] bg-gradient-to-br from-[#8b5cf6] to-[#6d42db] text-white'
                : 'rounded-bl-[7px] bg-white text-[#273142] shadow-sm'
            } ${
              active
                ? 'ring-2 ring-[#a855f7] ring-offset-2 ring-offset-white'
                : !right
                  ? 'ring-1 ring-black/5'
                  : ''
            }`}
          >
            {message.text}
          </div>

          {!right ? editButton : null}
        </div>
      </div>

      {right ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] ring-1 ring-black/5">
          {character?.image ? (
            <img
              src={character.image}
              alt={character.nickname || 'Character'}
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-user text-[13px] text-[#9b87c9]" />
          )}
        </span>
      ) : null}
    </div>
  )
}

function ToolbarIcon({ name }) {
  const iconClass = 'h-[19px] w-[19px]'

  if (name === 'above') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M4 6h11" />
        <path d="M4 12h8" />
        <path d="M4 18h6" />
        <path d="M19 18V7" />
        <path d="m15.5 10.5 3.5-3.5 3.5 3.5" />
      </svg>
    )
  }

  if (name === 'below') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M4 6h6" />
        <path d="M4 12h8" />
        <path d="M4 18h11" />
        <path d="M19 6v11" />
        <path d="m15.5 13.5 3.5 3.5 3.5-3.5" />
      </svg>
    )
  }

  if (name === 'modify') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    )
  }

  if (name === 'right') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <circle cx="9" cy="7" r="3" />
        <path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20" />
        <path d="M18 8v6" />
        <path d="M15 11h6" />
      </svg>
    )
  }

  if (name === 'up') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="m5 12 7-7 7 7" />
        <path d="m5 19 7-7 7 7" />
      </svg>
    )
  }

  if (name === 'down') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="m5 5 7 7 7-7" />
        <path d="m5 12 7 7 7-7" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

function MessageToolbarAction({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-[6px] px-0 py-1.5 text-white active:bg-white/10"
    >
      <ToolbarIcon name={icon} />

      <span className="whitespace-nowrap text-[8px] font-normal">
        {label}
      </span>
    </button>
  )
}

function MessageEditToolbar({
  message,
  position,
  isLead,
  canMoveUp,
  canMoveDown,
  onAbove,
  onBelow,
  onModify,
  onMakeLead,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  if (
    !message ||
    !position ||
    message.type === 'author_note'
  ) {
    return null
  }

  const canMakeLead =
    message.type === 'chat' &&
    !isLead

  return (
    <div
      className="fixed left-1/2 z-[205] max-w-[calc(100vw-16px)] -translate-x-1/2"
      style={{
        top: `${position.top}px`,
      }}
    >
      <div className="inline-flex min-h-[64px] w-max max-w-full items-stretch rounded-[8px] bg-[#303033] px-1 py-1.5">
        <MessageToolbarAction
          icon="above"
          label="Above"
          onClick={onAbove}
        />

        <MessageToolbarAction
          icon="below"
          label="Below"
          onClick={onBelow}
        />

        <MessageToolbarAction
          icon="modify"
          label="Modify"
          onClick={onModify}
        />

        {canMakeLead ? (
          <MessageToolbarAction
            icon="right"
            label="On Right"
            onClick={onMakeLead}
          />
        ) : null}

        {canMoveUp ? (
          <MessageToolbarAction
            icon="up"
            label="Up"
            onClick={onMoveUp}
          />
        ) : null}

        {canMoveDown ? (
          <MessageToolbarAction
            icon="down"
            label="Down"
            onClick={onMoveDown}
          />
        ) : null}

        <MessageToolbarAction
          icon="delete"
          label="Delete"
          onClick={onDelete}
        />
      </div>
    </div>
  )
}


function AddCharacterPopup({
  open,
  name,
  image,
  saving,
  randomLoading,
  onNameChange,
  onChooseImage,
  onRandomMale,
  onRandomFemale,
  onClose,
  onConfirm,
}) {
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
    <div
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 px-5"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[340px] rounded-[28px] bg-white px-6 pb-6 pt-7 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onChooseImage}
            disabled={saving}
            className="relative active:scale-[0.98] disabled:opacity-60"
            aria-label="Choose character image"
          >
            <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] ring-1 ring-black/5">
              {image ? (
                <img
                  src={image}
                  alt={name || 'New character'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[38px] text-[#9b87c9]" />
              )}
            </span>

            <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#111827] text-white shadow-md">
              <i className="fa-solid fa-camera text-[13px]" />
            </span>
          </button>
        </div>

        <div className="relative mt-7">
          <input
            autoFocus
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            maxLength={40}
            placeholder="Enter character name"
            disabled={saving}
            className="h-14 w-full rounded-full bg-[#f7f7f8] px-12 text-center text-[15px] font-medium text-[#111827] outline-none placeholder:text-[#98a2b3] focus:ring-2 focus:ring-[#9362ef]/25 disabled:opacity-60"
          />

          <i className="fa-regular fa-pen-to-square pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[16px] text-[#98a2b3]" />
        </div>

        <div className="mt-5 space-y-1">
          <button
            type="button"
            onClick={onRandomMale}
            disabled={saving || randomLoading}
            className="flex h-11 w-full items-center justify-center text-[13px] font-medium text-[#7c3aed] active:opacity-60 disabled:opacity-45"
          >
            {randomLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-[14px]" />
            ) : (
              'Random Male Character'
            )}
          </button>

          <button
            type="button"
            onClick={onRandomFemale}
            disabled={saving || randomLoading}
            className="flex h-11 w-full items-center justify-center text-[13px] font-medium text-[#7c3aed] active:opacity-60 disabled:opacity-45"
          >
            {randomLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-[14px]" />
            ) : (
              'Random Female Character'
            )}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
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
            onClick={onConfirm}
            disabled={saving || !name.trim()}
            className="h-12 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[14px] font-medium text-white shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saving ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </section>
    </div>
  )
}

function MorePopup({ open, onClose, onUploadAudio, onAuthorNote, hasAuthorNote }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[240] flex items-end bg-black/45" onClick={onClose}>
      <div
        className="w-full rounded-t-[28px] bg-white px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
        <h2 className="text-center text-[16px] font-bold text-[#111827]">More</h2>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onUploadAudio}
            className="flex min-h-[126px] flex-col items-center justify-center rounded-[20px] bg-[#faf9fc] px-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#f1ecff] text-[#7c3aed]">
              <i className="fa-solid fa-microphone text-[22px]" />
            </span>
            <span className="mt-3 text-[12px] font-medium text-[#111827]">Upload Audio</span>
          </button>

          <button
            type="button"
            onClick={onAuthorNote}
            className="flex min-h-[126px] flex-col items-center justify-center rounded-[20px] bg-[#faf9fc] px-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#f1ecff] text-[#7c3aed]">
              <i className="fa-regular fa-comment-dots text-[22px]" />
            </span>
            <span className="mt-3 text-[12px] font-medium text-[#111827]">
              {hasAuthorNote ? 'Edit Author’s Note' : 'Add Author’s Note'}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-medium text-white"
        >
          Done
        </button>
      </div>
    </div>
  )
}


function AuthorNoteSheet({ open, value, onChange, onClose, onSave }) {
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
      className="fixed inset-0 z-[250] flex items-end bg-black/45"
      onClick={onClose}
    >
      <section
        className="w-full rounded-t-[28px] bg-white px-5 pb-[calc(22px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
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
          <span className="h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
        </button>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">
              Author&apos;s Note
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-[#667085]">
              Write a short note for your readers.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
            aria-label="Close author's note"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-5 rounded-[16px] border border-[#e5d8ff] bg-[#fbf9ff] px-4 py-3 focus-within:border-[#9b6cf3] focus-within:ring-2 focus-within:ring-[#9b6cf3]/15">
          <textarea
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            maxLength={600}
            rows={7}
            placeholder="Thank your readers, share a short update, or leave a message..."
            className="min-h-[170px] max-h-[260px] w-full resize-none overflow-y-auto bg-transparent text-[13px] leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3]"
          />

          <div className="mt-2 text-right text-[10.5px] font-medium text-[#98a2b3]">
            {value.length} / 600
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={!value.trim()}
          className="mt-5 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-medium text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Save Author&apos;s Note
        </button>
      </section>
    </div>
  )
}

function AudioUploadSheet({
  open,
  file,
  previewUrl,
  duration,
  onChoose,
  onDropFile,
  onClose,
  onClear,
}) {
  const [dragY, setDragY] = useState(0)
  const [dropActive, setDropActive] = useState(false)
  const startYRef = useRef(0)
  const dragYRef = useRef(0)
  const draggingRef = useRef(false)
  const dragDepthRef = useRef(0)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setDragY(0)
    setDropActive(false)
    dragYRef.current = 0
    dragDepthRef.current = 0

    const preventFileNavigation = (event) => {
      const types = Array.from(event.dataTransfer?.types || [])
      if (types.includes('Files')) event.preventDefault()
    }

    window.addEventListener('dragover', preventFileNavigation)
    window.addEventListener('drop', preventFileNavigation)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('dragover', preventFileNavigation)
      window.removeEventListener('drop', preventFileNavigation)
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

  const getDroppedFile = (dataTransfer) => {
    const directFile = dataTransfer?.files?.[0]
    if (directFile) return directFile

    const fileItem = Array.from(dataTransfer?.items || []).find(
      (item) => item.kind === 'file'
    )

    return fileItem?.getAsFile?.() || null
  }

  const handleDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!Array.from(event.dataTransfer?.types || []).includes('Files')) return

    dragDepthRef.current += 1
    setDropActive(true)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
    setDropActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) setDropActive(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current = 0
    setDropActive(false)

    const droppedFile = getDroppedFile(event.dataTransfer)
    if (droppedFile) onDropFile(droppedFile)
  }

  if (!open) return null

  const sizeMb = file ? (file.size / (1024 * 1024)).toFixed(2) : '0.00'
  const roundedDuration = Math.max(0, Math.round(duration || 0))
  const durationText = `${Math.floor(roundedDuration / 60)}:${String(
    roundedDuration % 60
  ).padStart(2, '0')}`

  return (
    <div
      className="fixed inset-0 z-[250] flex items-end bg-black/45"
      onClick={onClose}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <section
        className="w-full rounded-t-[28px] bg-white px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-2 shadow-2xl"
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
          <span className="h-1.5 w-12 rounded-full bg-[#d0d5dd]" />
        </button>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#111827]">
              Upload Audio
            </h2>
            <p className="mt-1 text-[10.5px] text-[#667085]">
              Maximum 1 minute · 5 MB
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
            aria-label="Close audio upload"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        {file && previewUrl ? (
          <div className="mt-5 rounded-[18px] border border-[#e5d8ff] bg-[#fbf9ff] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eee7ff] text-[#7c3aed]">
                <i className="fa-solid fa-music text-[16px]" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-semibold text-[#111827]">
                  {file.name}
                </div>
                <div className="mt-1 text-[10.5px] text-[#667085]">
                  {durationText} · {sizeMb} MB
                </div>
              </div>

              <button
                type="button"
                onClick={onClear}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#98a2b3] ring-1 ring-black/5"
                aria-label="Remove selected audio"
              >
                <i className="fa-solid fa-xmark text-[11px]" />
              </button>
            </div>

            <audio
              controls
              preload="metadata"
              src={previewUrl}
              className="mt-4 h-10 w-full"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={onChoose}
            className={`mt-5 flex min-h-[170px] w-full flex-col items-center justify-center rounded-[20px] border border-dashed px-5 text-center transition active:scale-[0.99] ${
              dropActive
                ? 'border-[#7c3aed] bg-[#f3edff] ring-2 ring-[#7c3aed]/15'
                : 'border-[#cdbbff] bg-[#fbf9ff]'
            }`}
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-[18px] text-[#7c3aed] transition ${
                dropActive ? 'scale-105 bg-white' : 'bg-[#eee7ff]'
              }`}
            >
              <i className="fa-solid fa-upload text-[19px]" />
            </span>

            <span className="mt-3 text-[13px] font-semibold text-[#111827]">
              {dropActive
                ? 'Drop audio here'
                : 'Drop audio here or choose from device'}
            </span>

            <span className="mt-1 text-[10.5px] leading-5 text-[#667085]">
              MP3, M4A, AAC, WAV or WebM
            </span>
          </button>
        )}

        {file ? (
          <button
            type="button"
            onClick={onChoose}
            className="mt-4 h-11 w-full rounded-full bg-[#f3f4f6] text-[12px] font-medium text-[#475467]"
          >
            Choose another audio
          </button>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 h-12 w-full rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[13px] font-medium text-white"
        >
          Done
        </button>
      </section>
    </div>
  )
}

export default function ChatStoryEditorPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  const shouldScrollToEndRef = useRef(false)
  const messageElementsRef = useRef(new Map())
  const messageToolbarAutoScrollRef = useRef('')
  const composerRef = useRef(null)
  const audioInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const characterImageInputRef = useRef(null)
  const messagesRef = useRef([])
  const undoStackRef = useRef([])
  const redoStackRef = useRef([])
  const [characters, setCharacters] = useState([])
  const [messages, setMessages] = useState([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)
  const [profilePopupCharacter, setProfilePopupCharacter] = useState(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [titlePopupOpen, setTitlePopupOpen] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [episodeId, setEpisodeId] = useState('')
  const [saving, setSaving] = useState(false)
  const [composerFocused, setComposerFocused] = useState(false)
  const [addPopupOpen, setAddPopupOpen] = useState(false)
  const [imageSourceOpen, setImageSourceOpen] = useState(false)
  const [newCharacterName, setNewCharacterName] = useState('')
  const [newCharacterImage, setNewCharacterImage] = useState('')
  const [newCharacterAvatarSource, setNewCharacterAvatarSource] =
    useState('device')
  const [newCharacterGender, setNewCharacterGender] = useState('')
  const [randomAvatarLoading, setRandomAvatarLoading] = useState(false)
  const [addCharacterSaving, setAddCharacterSaving] = useState(false)
  const [morePopupOpen, setMorePopupOpen] = useState(false)
  const [authorNoteOpen, setAuthorNoteOpen] = useState(false)
  const [authorNoteDraft, setAuthorNoteDraft] = useState('')
  const [audioSheetOpen, setAudioSheetOpen] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('')
  const [audioDuration, setAudioDuration] = useState(0)
  const [symbolPanelOpen, setSymbolPanelOpen] = useState(false)
  const [composerMode, setComposerMode] = useState('message')
  const [activeMessageId, setActiveMessageId] = useState('')
  const [messageToolbarPosition, setMessageToolbarPosition] =
    useState(null)
  const [messageEditMode, setMessageEditMode] = useState(null)
  const [episodeLeadCharacterId, setEpisodeLeadCharacterId] = useState('')
  const [savedSeconds, setSavedSeconds] = useState(0)

  useEffect(() => {
    const textarea = composerRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
    textarea.style.overflowY = textarea.scrollHeight > 96 ? 'auto' : 'hidden'
  }, [draft])

  const storageKey = `chat_story_editor_draft_${storyId || 'unknown'}`
  const requestedEpisodeId = searchParams.get('episodeId') || searchParams.get('episode_id') || ''
  const startNewEpisode = searchParams.get('new') === '1'

  const characterMap = useMemo(() => {
    return characters.reduce((result, character) => {
      result[character.id] = character
      return result
    }, {})
  }, [characters])

  const selectedCharacter = selectedCharacterId
    ? characterMap[selectedCharacterId] || null
    : null

  const defaultLeadCharacterId =
  characters.find(
    (character) => character.isLead
  )?.id ||
  characters.find(
    (character) =>
      character.chatSide === 'right'
  )?.id ||
  characters.find(
    (character) =>
      character.group === 'main'
  )?.id ||
  characters[0]?.id ||
  ''

const effectiveLeadCharacterId =
  episodeLeadCharacterId ||
  defaultLeadCharacterId

const activeMessage =
  messages.find(
    (message) =>
      message.id === activeMessageId
  ) || null

const storyMessages = messages.filter(
  (message) =>
    message.type !== 'author_note'
)

const activeStoryIndex =
  storyMessages.findIndex(
    (message) =>
      message.id === activeMessageId
  )

const activeMessageCharacter =
  activeMessage?.characterId
    ? characterMap[
        activeMessage.characterId
      ] || null
    : null

const activeMessageIsLead =
  activeMessage?.type === 'chat' &&
  activeMessage.characterId ===
    effectiveLeadCharacterId

const canMoveActiveMessageUp =
  activeStoryIndex > 0

const canMoveActiveMessageDown =
  activeStoryIndex >= 0 &&
  activeStoryIndex <
    storyMessages.length - 1


const registerMessageElement = (
  messageId,
  node
) => {
  if (node) {
    messageElementsRef.current.set(
      messageId,
      node
    )
    return
  }

  messageElementsRef.current.delete(
    messageId
  )
}

useEffect(() => {
  if (!activeMessageId) {
    setMessageToolbarPosition(null)
    return undefined
  }

  messageToolbarAutoScrollRef.current = ''
  let timeoutId = 0

  const updateToolbarPosition = () => {
    const element =
      messageElementsRef.current.get(
        activeMessageId
      )

    if (!element) {
      setMessageToolbarPosition(null)
      return
    }

    const rect =
      element.getBoundingClientRect()

    const toolbarHeight = 64
    const gap = 8
    const topSafeArea = 62
    const bottomSafeArea = 170
    const bottomLimit =
      window.innerHeight -
      bottomSafeArea
    const belowTop = rect.bottom + gap
    const aboveTop =
      rect.top - gap - toolbarHeight
    const canPlaceBelow =
      belowTop + toolbarHeight <=
      bottomLimit
    const canPlaceAbove =
      aboveTop >= topSafeArea

    if (
      !canPlaceBelow &&
      !canPlaceAbove &&
      messageToolbarAutoScrollRef.current !==
        activeMessageId
    ) {
      messageToolbarAutoScrollRef.current =
        activeMessageId

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      timeoutId = window.setTimeout(
        updateToolbarPosition,
        320
      )
      return
    }

    const top = canPlaceBelow
      ? belowTop
      : canPlaceAbove
        ? aboveTop
        : Math.max(
            topSafeArea,
            Math.min(
              belowTop,
              bottomLimit -
                toolbarHeight
            )
          )

    setMessageToolbarPosition({
      top,
      placement: canPlaceBelow
        ? 'below'
        : 'above',
    })
  }

  const frameId =
    window.requestAnimationFrame(
      updateToolbarPosition
    )

  window.addEventListener(
    'resize',
    updateToolbarPosition
  )
  window.addEventListener(
    'scroll',
    updateToolbarPosition,
    true
  )

  return () => {
    window.cancelAnimationFrame(frameId)
    window.clearTimeout(timeoutId)
    window.removeEventListener(
      'resize',
      updateToolbarPosition
    )
    window.removeEventListener(
      'scroll',
      updateToolbarPosition,
      true
    )
  }
}, [
  activeMessageId,
  activeMessageIsLead,
  canMoveActiveMessageDown,
  canMoveActiveMessageUp,
  messages,
])

  useEffect(() => {
  if (
    !episodeLeadCharacterId &&
    defaultLeadCharacterId
  ) {
    setEpisodeLeadCharacterId(
      defaultLeadCharacterId
    )
  }
}, [
  defaultLeadCharacterId,
  episodeLeadCharacterId,
])

  const wordCount = useMemo(() => {
  return messages
    .filter((message) => message.type !== 'author_note')
    .reduce((total, message) => total + countWords(message.text), 0)
}, [messages])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2300)
  }

  const openTitlePopup = () => {
  setTitleDraft(episodeTitle)
  setTitlePopupOpen(true)
}

const saveEpisodeTitle = () => {
  const cleanTitle = titleDraft.trim()
  if (!cleanTitle) return

  setEpisodeTitle(cleanTitle)
  setTitlePopupOpen(false)
}

useEffect(() => {
  if (!titlePopupOpen) return undefined

  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  return () => {
    document.body.style.overflow = previousOverflow
  }
}, [titlePopupOpen])

  useEffect(() => {
  messagesRef.current = messages
}, [messages])

useEffect(() => {
  undoStackRef.current = []
  redoStackRef.current = []
  setCanUndo(false)
  setCanRedo(false)
}, [requestedEpisodeId, startNewEpisode, storyId])

const commitMessages = (updater) => {
  const current = messagesRef.current
  const next = typeof updater === 'function' ? updater(current) : updater

  undoStackRef.current = [...undoStackRef.current.slice(-49), current]
  redoStackRef.current = []
  messagesRef.current = next

  setMessages(next)
  setCanUndo(true)
  setCanRedo(false)
}

const handleUndo = () => {
  if (!undoStackRef.current.length) return

  const previous = undoStackRef.current.at(-1)
  undoStackRef.current = undoStackRef.current.slice(0, -1)
  redoStackRef.current = [...redoStackRef.current.slice(-49), messagesRef.current]
  messagesRef.current = previous

  setMessages(previous)
  setCanUndo(undoStackRef.current.length > 0)
  setCanRedo(true)
}

const handleRedo = () => {
  if (!redoStackRef.current.length) return

  const next = redoStackRef.current.at(-1)
  redoStackRef.current = redoStackRef.current.slice(0, -1)
  undoStackRef.current = [...undoStackRef.current.slice(-49), messagesRef.current]
  messagesRef.current = next

  setMessages(next)
  setCanUndo(true)
  setCanRedo(redoStackRef.current.length > 0)
}

  useEffect(() => {
    if (startNewEpisode) {
  localStorage.removeItem(storageKey)
  setMessages([])
  setEpisodeTitle('')
  setEpisodeId('')
  setEpisodeLeadCharacterId('')
  setActiveMessageId('')
  setMessageEditMode(null)
  return
}

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(Array.isArray(parsed.messages) ? parsed.messages : [])
        const savedTitle = String(parsed.episodeTitle || '').trim()
setEpisodeTitle(
  savedTitle === 'Episode 1' || savedTitle === 'New Episode' ? '' : savedTitle
)
        setEpisodeId(parsed.episodeId || '')
        setEpisodeLeadCharacterId(
  parsed.leadCharacterId || ''
)
      } catch {
        localStorage.removeItem(storageKey)
      }
    }
  }, [startNewEpisode, storageKey])

  useEffect(() => {
  const payload = JSON.stringify({
  episodeTitle,
  episodeId,
  leadCharacterId:
    effectiveLeadCharacterId,
  messages,
  updatedAt: new Date().toISOString(),
})
  localStorage.setItem(storageKey, payload)
  setSavedSeconds(0)
}, [
  effectiveLeadCharacterId,
  episodeId,
  episodeTitle,
  messages,
  storageKey,
])

useEffect(() => {
  const timer = window.setInterval(() => {
    setSavedSeconds((current) => current + 1)
  }, 1000)

  return () => window.clearInterval(timer)
}, [])

  useEffect(() => {
  if (!storyId) return

  const draftKey =
    `shadow_gallery_chat_editor_draft_${storyId}`

  const draftRaw = sessionStorage.getItem(draftKey)

  if (!draftRaw) return

  try {
    const draft = JSON.parse(draftRaw)

    const expired =
      !draft.createdAt ||
      Date.now() - Number(draft.createdAt) >
        30 * 60 * 1000

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

      if (
        String(parsedSelected.storyId || '') ===
          String(storyId) &&
        parsedSelected.origin === 'chat-editor'
      ) {
        selected = parsedSelected
      }
    }

    setNewCharacterName(draft.name || '')
    setNewCharacterGender(draft.gender || '')

    if (selected?.imageUrl) {
      setNewCharacterImage(selected.imageUrl)
      setNewCharacterAvatarSource('shadow_gallery')
      setImageSourceOpen(false)
      setAddPopupOpen(true)
    } else {
      setNewCharacterImage(draft.image || '')
      setNewCharacterAvatarSource(
        draft.avatarSource || 'device'
      )
      setAddPopupOpen(false)
      setImageSourceOpen(true)
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

useEffect(() => {
  async function loadCharacters() {
    const token = getAuthToken()

    if (!token) {
      setLoading(false)
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/chat/characters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Failed to load characters'
        )
      }

      setCharacters(
        (data.characters || []).map(mapCharacter)
      )
    } catch (error) {
      showToast(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message || 'Failed to load characters'
      )
    } finally {
      setLoading(false)
    }
  }

  if (storyId) {
    loadCharacters()
  } else {
    setLoading(false)
  }
}, [navigate, storyId])

  useEffect(() => {
    async function loadRequestedEpisode() {
      if (!requestedEpisodeId || startNewEpisode) return

      const token = getAuthToken()
      if (!token) return

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/episodes/${requestedEpisodeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load Chat Story episode')
        }

        const parsed = JSON.parse(String(data.episode?.content || ''))
        if (parsed?.format !== 'shadow_chat_story_v1') {
          throw new Error('This episode is not a Chat Story episode')
        }

        const parsedCharacters =
  Array.isArray(parsed.characters)
    ? parsed.characters
    : []

const savedLeadCharacterId =
  parsed.lead_character_id ||
  parsedCharacters.find(
    (character) =>
      character.is_lead === true
  )?.id ||
  parsedCharacters.find(
    (character) =>
      character.chat_side === 'right'
  )?.id ||
  ''

setEpisodeId(data.episode.id)

setEpisodeTitle(
  data.episode.title ||
    parsed.episode_title ||
    'Episode'
)

setEpisodeLeadCharacterId(
  savedLeadCharacterId
)

setMessages(
          (parsed.messages || []).map((message) => ({
            id: message.id || makeId(),
            type:
  message.type === 'chat'
    ? 'chat'
    : message.type === 'author_note'
      ? 'author_note'
      : 'aside',
            characterId: message.character_id || null,
            text: message.text || '',
            createdAt: message.created_at || new Date().toISOString(),
          }))
        )
      } catch (error) {
        showToast(error.message || 'Failed to load Chat Story episode')
      }
    }

    loadRequestedEpisode()
  }, [requestedEpisodeId, startNewEpisode, storyId])

  useEffect(() => {
  if (!shouldScrollToEndRef.current) {
    return
  }

  shouldScrollToEndRef.current = false

  messagesEndRef.current?.scrollIntoView({
    behavior: 'smooth',
  })
}, [messages])
  const toggleCharacter = (characterId) => {
  setSelectedCharacterId((current) =>
    current === characterId ? null : characterId
  )
}
  
  
const insertMessageSymbol = (symbol) => {
  setDraft((current) =>
    `${current}${current && !/\s$/.test(current) ? ' ' : ''}${symbol}`
  )
  setSymbolPanelOpen(false)
  setComposerFocused(true)
  window.setTimeout(() => composerRef.current?.focus(), 50)
}
  
  const openMessageToolbar = (messageId) => {
  if (messageEditMode) {
    showToast(
      'Finish or cancel the current edit first.'
    )
    return
  }

  setSymbolPanelOpen(false)

  setActiveMessageId((current) =>
    current === messageId
      ? ''
      : messageId
  )
}

const cancelMessageEditMode = () => {
  setMessageEditMode(null)
  setActiveMessageId('')
  setDraft('')
  setSymbolPanelOpen(false)
  setComposerFocused(false)
}

const beginInsertMessage = (position) => {
  if (!activeMessage) return

  setMessageEditMode({
    type:
      position === 'above'
        ? 'insert_above'
        : 'insert_below',
    targetId: activeMessage.id,
  })

  setSelectedCharacterId(
    activeMessage.type === 'chat'
      ? activeMessage.characterId
      : null
  )

  setActiveMessageId('')
  setDraft('')
  setSymbolPanelOpen(false)
  setComposerFocused(true)

  window.setTimeout(() => {
    composerRef.current?.focus()
  }, 50)
}

const beginModifyMessage = () => {
  if (!activeMessage) return

  setMessageEditMode({
    type: 'modify',
    targetId: activeMessage.id,
  })

  setSelectedCharacterId(
    activeMessage.type === 'chat'
      ? activeMessage.characterId
      : null
  )

  setDraft(activeMessage.text || '')
  setActiveMessageId('')
  setSymbolPanelOpen(false)
  setComposerFocused(true)

  window.setTimeout(() => {
    composerRef.current?.focus()
  }, 50)
}

const makeActiveMessageLead = () => {
  if (
    activeMessage?.type !== 'chat' ||
    !activeMessage.characterId
  ) {
    return
  }

  setEpisodeLeadCharacterId(
    activeMessage.characterId
  )

  setActiveMessageId('')

  showToast(
    `${
      activeMessageCharacter?.nickname ||
      'Character'
    } is now Lead Chat.`
  )
}

const moveActiveMessage = (direction) => {
  if (!activeMessage) return

  commitMessages((current) => {
    const authorNote = current.find(
      (message) =>
        message.type === 'author_note'
    )

    const nextStoryMessages =
      current.filter(
        (message) =>
          message.type !== 'author_note'
      )

    const currentIndex =
      nextStoryMessages.findIndex(
        (message) =>
          message.id ===
          activeMessage.id
      )

    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >=
        nextStoryMessages.length
    ) {
      return current
    }

    const nextMessages = [
      ...nextStoryMessages,
    ]

    ;[
      nextMessages[currentIndex],
      nextMessages[targetIndex],
    ] = [
      nextMessages[targetIndex],
      nextMessages[currentIndex],
    ]

    return authorNote
      ? [...nextMessages, authorNote]
      : nextMessages
  })
}

const sendMessage = () => {
  const text = draft.trim()
  if (!text) return

  if (
    messageEditMode?.type === 'modify'
  ) {
    commitMessages((current) =>
      current.map((message) =>
        message.id ===
        messageEditMode.targetId
          ? {
              ...message,
              text,
            }
          : message
      )
    )

    setDraft('')
    setMessageEditMode(null)
    setActiveMessageId('')
    setSymbolPanelOpen(false)

    showToast('Message updated.')
    return
  }

  const nextMessage = {
    id: makeId(),
    type: selectedCharacter
      ? 'chat'
      : 'aside',
    characterId:
      selectedCharacter?.id || null,
    text,
    createdAt:
      new Date().toISOString(),
  }

  const inserting =
    messageEditMode?.type ===
      'insert_above' ||
    messageEditMode?.type ===
      'insert_below'

  if (!inserting) {
    shouldScrollToEndRef.current = true
  }

  commitMessages((current) => {
    const authorNote = current.find(
      (message) =>
        message.type === 'author_note'
    )

    const nextStoryMessages =
      current.filter(
        (message) =>
          message.type !== 'author_note'
      )

    if (inserting) {
      const targetIndex =
        nextStoryMessages.findIndex(
          (message) =>
            message.id ===
            messageEditMode.targetId
        )

      const insertIndex =
        targetIndex < 0
          ? nextStoryMessages.length
          : messageEditMode.type ===
              'insert_above'
            ? targetIndex
            : targetIndex + 1

      nextStoryMessages.splice(
        insertIndex,
        0,
        nextMessage
      )
    } else {
      nextStoryMessages.push(nextMessage)
    }

    return authorNote
      ? [...nextStoryMessages, authorNote]
      : nextStoryMessages
  })

  setDraft('')
  setMessageEditMode(null)
  setActiveMessageId('')
  setSymbolPanelOpen(false)
}

const deleteMessage = (messageId) => {
  commitMessages((current) =>
    current.filter(
      (message) =>
        message.id !== messageId
    )
  )

  if (activeMessageId === messageId) {
    setActiveMessageId('')
  }

  if (
    messageEditMode?.targetId ===
    messageId
  ) {
    setMessageEditMode(null)
    setDraft('')
  }
}

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const openAddCharacterPopup = () => {
  setNewCharacterName('')
  setNewCharacterImage('')
  setNewCharacterAvatarSource('device')
  setNewCharacterGender('')
  sessionStorage.removeItem('shadow_gallery_selected_image')
  setAddPopupOpen(false)
  setImageSourceOpen(true)
}

const closeAddCharacterPopup = () => {
  if (addCharacterSaving) return
  setAddPopupOpen(false)
}

const chooseNewCharacterDeviceImage = () => {
  setImageSourceOpen(false)
  characterImageInputRef.current?.click()
}

const openNewCharacterShadowGallery = () => {
  if (!storyId) return

  const origin = 'chat-editor'
  const returnPath =
    window.location.pathname + window.location.search

  sessionStorage.removeItem('shadow_gallery_selected_image')

  sessionStorage.setItem(
    `shadow_gallery_chat_editor_draft_${storyId}`,
    JSON.stringify({
      origin,
      returnPath,
      name: newCharacterName,
      image: newCharacterImage,
      avatarSource: newCharacterAvatarSource,
      gender: newCharacterGender,
      createdAt: Date.now(),
    })
  )

  setImageSourceOpen(false)

  navigate(
    `/author/story/${storyId}/chat/shadow-gallery` +
      `?origin=${encodeURIComponent(origin)}` +
      `&return=${encodeURIComponent(returnPath)}`
  )
}
  
const handleNewCharacterImageChange = (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file) {
  setImageSourceOpen(true)
  return
}

  if (!file.type.startsWith('image/')) {
    showToast('Please choose an image file.')
    return
  }

  if (file.size > 8 * 1024 * 1024) {
    showToast('Image must be 8 MB or smaller.')
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
  setNewCharacterImage(String(reader.result || ''))
  setNewCharacterAvatarSource('device')
  setImageSourceOpen(false)
  setAddPopupOpen(true)
}

  reader.readAsDataURL(file)
}

const pickRandomCharacterAvatar = async (gender) => {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  try {
    setRandomAvatarLoading(true)

    const response = await fetch(
      `${API_BASE_URL}/api/stories/chat/avatar-gallery?limit=200`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to load character images')
    }

    const candidates = (data.images || []).filter((item) => {
      const text = [
        item.category,
        item.title,
        item.alt_text,
        item.gender,
        item.folder,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const isFemale =
        text.includes('female') ||
        text.includes('girl') ||
        text.includes('woman')

      const isMale =
        !isFemale &&
        (text.includes('male') ||
          text.includes('boy') ||
          text.includes('man'))

      return gender === 'female' ? isFemale : isMale
    })

    if (!candidates.length) {
      throw new Error(
        gender === 'female'
          ? 'No female character images were found.'
          : 'No male character images were found.'
      )
    }

    const randomItem =
      candidates[Math.floor(Math.random() * candidates.length)]

    setNewCharacterImage(randomItem.image_url || '')
    setNewCharacterAvatarSource('shadow_gallery')
    setNewCharacterGender(gender)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend.'
        : error.message || 'Failed to choose random character'
    )
  } finally {
    setRandomAvatarLoading(false)
  }
}

const handleAddConfirm = async () => {
  const cleanName = newCharacterName.trim()

  if (!cleanName) {
    showToast('Please enter a character name.')
    return
  }

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  const newCharacterId = makeId()

  const nextCharacters = [
    ...characters,
    {
      id: newCharacterId,
      nickname: cleanName,
      image: newCharacterImage,
      group: 'background',
      avatarSource: newCharacterAvatarSource,
      isLead: false,
      chatSide: 'left',
      gender: newCharacterGender,
      birthday: '',
      heightCm: '',
      occupation: '',
      personality: '',
      relationship: '',
      bio: '',
    },
  ]

  try {
    setAddCharacterSaving(true)

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
        chat_side:
          character.chatSide ||
          (character.group === 'main' ? 'right' : 'left'),
        gender: character.gender || null,
        birthday: character.birthday || null,
        height_cm:
          character.heightCm === '' ? null : character.heightCm,
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
        body: JSON.stringify({
          characters: uploadedCharacters,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to add character')
    }

    const savedCharacters = (data.characters || []).map(mapCharacter)

    const savedCharacter =
      savedCharacters.find(
        (character) => character.id === newCharacterId
      ) ||
      savedCharacters[savedCharacters.length - 1] ||
      null

    setCharacters(savedCharacters)
    setAddPopupOpen(false)

    if (savedCharacter) {
      setSelectedCharacterId(savedCharacter.id)
      setComposerMode('message')
    }

    setNewCharacterName('')
    setNewCharacterImage('')
    setNewCharacterAvatarSource('device')
    setNewCharacterGender('')

    showToast('Character added.')

    window.setTimeout(() => {
      composerRef.current?.focus()
    }, 50)
  } catch (error) {
    showToast(
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend.'
        : error.message || 'Failed to add character'
    )
  } finally {
    setAddCharacterSaving(false)
  }
}

  const handleAuthorNote = () => {
    const existingNote = messages.find(
      (message) => message.type === 'author_note'
    )

    setMorePopupOpen(false)
    setAuthorNoteDraft(existingNote?.text || '')
    setAuthorNoteOpen(true)
  }

  const closeAuthorNote = () => {
    setAuthorNoteOpen(false)
    setMorePopupOpen(true)
  }

  const saveAuthorNote = () => {
    const text = authorNoteDraft.trim()
    if (!text) return

    const existingNote = messages.find(
      (message) => message.type === 'author_note'
    )

    const nextNote = {
      id: existingNote?.id || makeId(),
      type: 'author_note',
      characterId: null,
      text,
      createdAt: existingNote?.createdAt || new Date().toISOString(),
    }

    commitMessages((current) => [
      ...current.filter((message) => message.type !== 'author_note'),
      nextNote,
    ])

    setAuthorNoteOpen(false)
    setMorePopupOpen(true)
    showToast(existingNote ? 'Author’s Note updated.' : 'Author’s Note saved.')
  }

  const clearSelectedAudio = () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    setAudioFile(null)
    setAudioPreviewUrl('')
    setAudioDuration(0)
  }

  const openAudioSheet = () => {
    setMorePopupOpen(false)
    setAudioSheetOpen(true)
  }

  const closeAudioSheet = () => {
    setAudioSheetOpen(false)
    setMorePopupOpen(true)
  }

  const selectAudioFile = (file) => {
    if (!file) return

    const allowedAudio =
      file.type.startsWith('audio/') ||
      /\.(mp3|m4a|aac|wav|webm)$/i.test(file.name)

    if (!allowedAudio) {
      showToast('Choose MP3, M4A, AAC, WAV or WebM audio.')
      return
    }

    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      showToast('Audio must be 5 MB or smaller.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const audio = document.createElement('audio')
    let finished = false
    let timeoutId = 0

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      audio.removeEventListener('loadedmetadata', readDuration)
      audio.removeEventListener('durationchange', readDuration)
      audio.removeEventListener('canplay', readDuration)
      audio.removeEventListener('error', handleReadError)
      audio.removeAttribute('src')
      audio.load()
    }

    const fail = (message) => {
      if (finished) return
      finished = true
      cleanup()
      URL.revokeObjectURL(objectUrl)
      showToast(message)
    }

    const acceptFile = (durationValue) => {
      if (finished) return
      finished = true
      cleanup()

      if (
        durationValue < MIN_AUDIO_DURATION_SECONDS ||
        durationValue > MAX_AUDIO_DURATION_SECONDS
      ) {
        URL.revokeObjectURL(objectUrl)
        showToast('Audio must be between 1 second and 1 minute.')
        return
      }

      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
      setAudioFile(file)
      setAudioPreviewUrl(objectUrl)
      setAudioDuration(durationValue)
    }

    function readDuration() {
      const durationValue = Number(audio.duration)

      if (Number.isFinite(durationValue) && durationValue > 0) {
        acceptFile(durationValue)
        return
      }

      if (durationValue === Infinity && audio.seekable?.length) {
        const seekEnd = audio.seekable.end(audio.seekable.length - 1)
        if (Number.isFinite(seekEnd) && seekEnd > 0) {
          acceptFile(seekEnd)
        }
      }
    }

    function handleReadError() {
      fail('This audio file cannot be read.')
    }

    audio.preload = 'metadata'
    audio.addEventListener('loadedmetadata', readDuration)
    audio.addEventListener('durationchange', readDuration)
    audio.addEventListener('canplay', readDuration)
    audio.addEventListener('error', handleReadError)
    audio.src = objectUrl
    audio.load()

    timeoutId = window.setTimeout(() => {
      fail('Audio information could not be read. Try another file.')
    }, 10000)
  }

  const handleAudioChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    selectAudioFile(file)
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.')
      return
    }

    showToast(`Image selected: ${file.name}`)
  }

  const saveAndContinue = async () => {
    const cleanTitle = episodeTitle.trim()

    if (!cleanTitle) {
      showToast('Please enter an episode title.')
      return
    }

    if (!messages.some((message) => message.type !== 'author_note')) {
  showToast('Add at least one Chat or ASIDE message.')
  return
}

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSaving(true)

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/chat/episodes/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            episode_id:
              episodeId ||
              requestedEpisodeId ||
              null,
            title: cleanTitle,
            lead_character_id:
              effectiveLeadCharacterId ||
              null,
            messages: messages.map((message) => ({
              id: message.id,
              type: message.type,
              character_id: message.characterId || null,
              text: message.text,
              created_at: message.createdAt || null,
            })),
            is_locked: true,
          }),
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save Chat Story episode')
      }

      const savedEpisodeId = data.episode?.id
      const firstValue = data.is_first_episode ? '1' : '0'

      setEpisodeId(savedEpisodeId)
      localStorage.setItem(
        storageKey,
        JSON.stringify({
  episodeTitle: cleanTitle,
  episodeId: savedEpisodeId,
  leadCharacterId:
    effectiveLeadCharacterId,
  messages,
  updatedAt: new Date().toISOString(),
})
      )

      navigate(
        `/author/story/${storyId}/episode/publish?episodeId=${savedEpisodeId}&first=${firstValue}&type=chat_story`
      )
    } catch (error) {
      showToast(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend.'
          : error.message || 'Failed to save Chat Story episode'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-[170px]">
      <input
        ref={audioInputRef}
        type="file"
        accept={AUDIO_ACCEPT}
        onChange={handleAudioChange}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      
      <input
  ref={characterImageInputRef}
  type="file"
  accept="image/*"
  onChange={handleNewCharacterImageChange}
  className="hidden"
/>
      <ImageSourceSheet
  open={imageSourceOpen}
  onClose={() => setImageSourceOpen(false)}
  onDevice={chooseNewCharacterDeviceImage}
  onShadowGallery={openNewCharacterShadowGallery}
/>

      <AddCharacterPopup
  open={addPopupOpen}
  name={newCharacterName}
  image={newCharacterImage}
  saving={addCharacterSaving}
  randomLoading={randomAvatarLoading}
  onNameChange={setNewCharacterName}
  onChooseImage={() => {
  setAddPopupOpen(false)
  setImageSourceOpen(true)
}}
  onRandomMale={() => pickRandomCharacterAvatar('male')}
  onRandomFemale={() => pickRandomCharacterAvatar('female')}
  onClose={closeAddCharacterPopup}
  onConfirm={handleAddConfirm}
/>

      <CharacterQuickPopup
  character={profilePopupCharacter}
  onClose={() => setProfilePopupCharacter(null)}
  onConfirm={() => {
    if (!profilePopupCharacter) return

    setSelectedCharacterId(profilePopupCharacter.id)
    setComposerMode('message')
    setProfilePopupCharacter(null)
    setSymbolPanelOpen(false)

    window.setTimeout(() => {
      composerRef.current?.focus()
    }, 50)
  }}
  onEditProfile={() => {
    if (!profilePopupCharacter) return

    const characterId = profilePopupCharacter.id
    setProfilePopupCharacter(null)

    navigate(
      `/author/story/${storyId}/chat/characters/${characterId}/profile`
    )
  }}
/>

      <MorePopup
        open={morePopupOpen}
        onClose={() => setMorePopupOpen(false)}
        onUploadAudio={openAudioSheet}
        onAuthorNote={handleAuthorNote}
        hasAuthorNote={messages.some(
          (message) => message.type === 'author_note'
        )}
      />

      <AuthorNoteSheet
        open={authorNoteOpen}
        value={authorNoteDraft}
        onChange={setAuthorNoteDraft}
        onClose={closeAuthorNote}
        onSave={saveAuthorNote}
      />

      <AudioUploadSheet
        open={audioSheetOpen}
        file={audioFile}
        previewUrl={audioPreviewUrl}
        duration={audioDuration}
        onChoose={() => audioInputRef.current?.click()}
        onDropFile={selectAudioFile}
        onClose={closeAudioSheet}
        onClear={clearSelectedAudio}
      />

      {titlePopupOpen ? (
  <div
    className="fixed inset-0 z-[250] flex items-center justify-center bg-black/55 px-4"
    onClick={() => setTitlePopupOpen(false)}
  >
    <section
      className="w-full max-w-[390px] rounded-[24px] bg-white px-5 pb-5 pt-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <h2 className="text-center text-[19px] font-bold text-[#7c3aed]">
        Enter episode title
      </h2>

      <input
        autoFocus
        value={titleDraft}
        onChange={(event) => setTitleDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && titleDraft.trim()) {
            event.preventDefault()
            saveEpisodeTitle()
          }
        }}
        maxLength={80}
        placeholder="Enter episode title"
        className="mt-6 h-14 w-full rounded-[6px] bg-[#f5f5f6] px-4 text-center text-[17px] font-medium text-[#111827] outline-none placeholder:text-[#a5a5aa] focus:ring-2 focus:ring-[#9362ef]/30"
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setTitlePopupOpen(false)}
          className="h-12 text-[15px] font-bold text-[#111827]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={saveEpisodeTitle}
          disabled={!titleDraft.trim()}
          className="h-12 rounded-[8px] bg-gradient-to-r from-[#9362ef] to-[#6d42db] text-[15px] font-bold text-white disabled:bg-none disabled:bg-[#f5f3f7] disabled:text-[#d8cce6]"
        >
          OK
        </button>
      </div>
    </section>
  </div>
) : null}
      
      {toast ? (
        <button
          type="button"
          onClick={() => setToast('')}
          className="fixed inset-x-4 top-[78px] z-[300] mx-auto max-w-[320px] rounded-[14px] bg-white px-4 py-3 text-center text-[12px] font-medium text-[#475467] shadow-[0_8px_28px_rgba(15,23,42,0.18)] ring-1 ring-black/5"
        >
          {toast}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 px-3 py-2 backdrop-blur">
  <div className="mx-auto flex max-w-5xl items-center gap-2">
    <button
      type="button"
      onClick={() =>
  navigate(
    `/author/story/${storyId}/chat/characters`,
    { replace: true }
  )
}
      className="flex h-10 w-7 shrink-0 items-center justify-start text-[#111827] active:scale-95"
      aria-label="Go back"
    >
      <i className="fa-solid fa-chevron-left text-[14px]" />
    </button>

    <div className="min-w-0 flex-1">
      <button
  type="button"
  onClick={openTitlePopup}
  className="flex max-w-full items-center gap-1.5 text-left active:opacity-70"
>
  <span className="max-w-[180px] truncate text-[15px] font-bold text-[#111827]">
    {episodeTitle.trim() || 'Enter episode title'}
  </span>

  <i className="fa-solid fa-pen shrink-0 text-[10px] text-[#98a2b3]" />
</button>

      <div className="mt-0.5 truncate text-[8.5px] font-medium text-[#98a2b3]">
        {messages.length} {messages.length === 1 ? 'message' : 'messages'} ·{' '}
        {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'} | Saved in{' '}
        {savedSeconds < 60
          ? `${savedSeconds}s`
          : `${Math.floor(savedSeconds / 60)}m`}
      </div>
    </div>

    <button
      type="button"
      onClick={saveAndContinue}
      disabled={
  saving ||
  loading ||
  !messages.some((message) => message.type !== 'author_note')
}
      className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-bold text-white shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? 'Saving...' : 'Next'}
    </button>
  </div>
</header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section className="hidden rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-black/5 sm:block">
          <div className="grid grid-cols-4 gap-2">
            <Step number="1" title="Story Info" done />
            <Step number="2" title="Characters" done />
            <Step number="3" title="Chat" active />
            <Step number="4" title="Publish" />
          </div>
        </section>

        <section className="mt-4 min-h-[calc(100vh-330px)] bg-white p-4">
          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <i className="fa-solid fa-spinner fa-spin text-[24px] text-[#7c3aed]" />
              <div className="mt-3 text-[12px] font-bold text-[#667085]">
                Loading characters...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f1ecff] text-[#7c3aed]">
                <i className="fa-regular fa-comments text-[25px]" />
              </span>
              <h2 className="mt-4 text-[17px] font-extrabold text-[#111827]">
                Start your conversation
              </h2>
              <p className="mt-2 max-w-[310px] text-[11.5px] leading-5 text-[#667085]">
                Choose one character below to write their message. Tap the same
                character again to deselect it and write narration without an
                avatar.
              </p>
            </div>
          ) : (
            <div>
              {messages.map((message) =>
  message.type === 'author_note' ? (
    <AuthorNoteMessage
      key={message.id}
      message={message}
      onDelete={deleteMessage}
    />
  ) : message.type === 'aside' ? (
    <AsideMessage
  key={message.id}
  message={message}
  active={
    activeMessageId === message.id
  }
  onEdit={openMessageToolbar}
  onElementRef={registerMessageElement}
/>
  ) : (
    <ChatMessage
  key={message.id}
  message={message}
  character={
    characterMap[
      message.characterId
    ]
  }
  right={
    message.characterId ===
    effectiveLeadCharacterId
  }
  active={
    activeMessageId === message.id
  }
  onEdit={openMessageToolbar}
  onElementRef={registerMessageElement}
/>
  )
)}
              <div ref={messagesEndRef} />
            </div>
          )}
        </section>
      </main>

<MessageEditToolbar
  message={activeMessage}
  position={messageToolbarPosition}
  isLead={activeMessageIsLead}
  canMoveUp={canMoveActiveMessageUp}
  canMoveDown={canMoveActiveMessageDown}
  onAbove={() =>
    beginInsertMessage('above')
  }
  onBelow={() =>
    beginInsertMessage('below')
  }
  onModify={beginModifyMessage}
  onMakeLead={makeActiveMessageLead}
  onMoveUp={() =>
    moveActiveMessage('up')
  }
  onMoveDown={() =>
    moveActiveMessage('down')
  }
  onDelete={() => {
    if (activeMessage?.id) {
      deleteMessage(activeMessage.id)
    }
  }}
/>

      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/5 bg-white pb-[calc(8px+env(safe-area-inset-bottom))]">
  <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-white to-transparent" />
        <div className="mx-auto max-w-5xl">
  {messageEditMode ? (
    <div className="flex items-center justify-between border-b border-black/5 bg-[#fafafa] px-4 py-2">
      <span className="text-[10.5px] font-medium text-[#667085]">
        {messageEditMode.type ===
        'modify'
          ? 'Modify message'
          : messageEditMode.type ===
              'insert_above'
            ? 'Insert above selected message'
            : 'Insert below selected message'}
      </span>

      <button
        type="button"
        onClick={cancelMessageEditMode}
        className="text-[10.5px] font-bold text-[#7c3aed]"
      >
        Cancel
      </button>
    </div>
  ) : null}

          <div className="grid grid-cols-[minmax(0,1fr)_40px_40px] items-start gap-x-0 pl-4 pr-2 pb-1 pt-2">
  <div className="relative min-w-0">
  <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div className="flex w-max gap-1.5 py-0.5">
      <AsideAvatar
        active={!selectedCharacterId}
        onClick={() => {
          setSelectedCharacterId(null)
          setComposerMode('message')
        }}
      />

      {characters.map((character) => (
        <CharacterAvatar
  key={character.id}
  character={character}
  selected={selectedCharacterId === character.id}
  onClick={() => {
  if (
    messageEditMode?.type ===
      'insert_above' ||
    messageEditMode?.type ===
      'insert_below'
  ) {
    setSelectedCharacterId(
      character.id
    )
  } else {
    toggleCharacter(character.id)
  }

  setComposerMode('message')
  setSymbolPanelOpen(false)

  window.setTimeout(() => {
    composerRef.current?.focus()
  }, 50)
}}
/>
      ))}
    </div>
  </div>

  <div className="pointer-events-none absolute inset-y-0 -right-1.5 z-10 w-6 bg-gradient-to-r from-transparent via-white/75 to-white" />
</div>

  <button
    type="button"
    onClick={openAddCharacterPopup}
    className="relative z-20 w-10 py-0.5 text-center active:scale-[0.97]"
  >
    <span className="relative mx-auto flex h-8 w-8 items-center justify-center text-[#667085]">
  <i className="fa-regular fa-user text-[16px]" />
  <i className="fa-solid fa-plus absolute right-[3px] top-[3px] text-[7px]" />
</span>
    <span className="mt-1 block text-[8px] font-bold text-[#667085]">
      Add
    </span>
  </button>

  <button
    type="button"
    onClick={() => setMorePopupOpen(true)}
    className="w-10 text-center active:scale-[0.97]"
  >
    <span className="mx-auto flex h-8 w-8 items-center justify-center text-[#667085]">
  <i className="fa-solid fa-chevron-down text-[16px]" />
</span>
    <span className="mt-1 block text-[8px] font-bold text-[#667085]">
      More
    </span>
  </button>
</div>

<div className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-x-1 pl-4 pr-2">
  <div className="relative flex min-h-11 min-w-0 flex-1 items-center rounded-[10px] bg-[#f3f4f6] px-3 py-2 pr-12">
    <textarea
      ref={composerRef}
      value={draft}
      onFocus={() => setComposerFocused(true)}
      onBlur={() => {
        if (!draft.trim()) setComposerFocused(false)
      }}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={handleComposerKeyDown}
      rows={1}
      maxLength={2000}
      placeholder={
  messageEditMode?.type === 'modify'
    ? 'Modify message:'
    : selectedCharacter
      ? `${selectedCharacter.nickname || 'Character'}:`
      : 'ASIDE:'
}
      className="max-h-[96px] min-h-[20px] w-full resize-none overflow-y-hidden bg-transparent py-0 text-[12.5px] leading-5 text-[#111827] outline-none placeholder:font-medium placeholder:text-[#667085]"
    />

    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setSymbolPanelOpen((current) => !current)}
      className={`absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[7px] text-[12px] font-medium text-[#111827] active:scale-95 ${
        symbolPanelOpen ? 'bg-[#dfe2e7]' : 'bg-[#e9eaee]'
      }`}
      aria-label="Message symbols"
      aria-pressed={symbolPanelOpen}
    >
      「」
    </button>
  </div>

  {composerFocused || draft.trim() ? (
    <button
  type="button"
  onMouseDown={(event) => event.preventDefault()}
  onClick={sendMessage}
  disabled={!draft.trim()}
  className={`flex h-11 w-10 items-center justify-center transition active:scale-95 ${
    draft.trim() ? 'text-[#7c3aed]' : 'text-[#cbd5e1]'
  }`}
  aria-label="Send message"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4Z" />
  </svg>
</button>
  ) : (
    <button
      type="button"
      onClick={() => {
        setSymbolPanelOpen(false)
        imageInputRef.current?.click()
      }}
      className="flex h-11 w-10 items-center justify-center text-[#111827] active:scale-95"
      aria-label="Add image"
    >
      <i className="fa-regular fa-image text-[20px]" />
    </button>
  )}
</div>

          {symbolPanelOpen ? (
  <div className="flex w-full gap-1 px-2 pb-1 pt-2">
    {MESSAGE_SYMBOLS.map((symbol) => (
      <button
        key={symbol}
        type="button"
        onClick={() => insertMessageSymbol(symbol)}
        className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-[8px] bg-[#f3f4f6] text-[12px] font-normal text-[#667085] active:bg-[#e5e7eb]"
      >
        {symbol}
      </button>
    ))}
  </div>
) : null}
        </div>
      </div>
    </div>
  )
}

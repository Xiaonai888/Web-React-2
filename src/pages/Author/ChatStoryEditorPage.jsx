import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

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
      className="w-[64px] shrink-0 text-center active:scale-[0.97]"
      aria-pressed={selected}
    >
      <span
        className={`relative mx-auto flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] transition ${
          selected
            ? 'ring-[3px] ring-[#7c3aed] ring-offset-2 ring-offset-white'
            : 'ring-1 ring-black/5'
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

        {selected ? (
          <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#7c3aed] text-white ring-2 ring-white">
            <i className="fa-solid fa-check text-[7px]" />
          </span>
        ) : null}
      </span>

      <span
        className={`mt-1.5 block truncate text-[9.5px] font-extrabold ${
          selected ? 'text-[#6d42db]' : 'text-[#667085]'
        }`}
      >
        {character.nickname || 'Unnamed'}
      </span>
    </button>
  )
}

function AsideAvatar({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[64px] shrink-0 text-center active:scale-[0.97]"
      aria-pressed={active}
    >
      <span
        className={`relative mx-auto flex h-[50px] w-[50px] items-center justify-center rounded-full transition ${
          active
            ? 'bg-[#111827] text-white ring-[3px] ring-[#111827] ring-offset-2 ring-offset-white'
            : 'bg-[#f2f4f7] text-[#667085] ring-1 ring-black/5'
        }`}
      >
        <i className="fa-solid fa-align-left text-[15px]" />
      </span>

      <span
        className={`mt-1.5 block truncate text-[9.5px] font-extrabold ${
          active ? 'text-[#111827]' : 'text-[#667085]'
        }`}
      >
        ASIDE
      </span>
    </button>
  )
}

function AsideMessage({ message, onDelete }) {
  return (
    <div className="group mx-auto flex max-w-[88%] items-start justify-center gap-2 py-2">
      <div className="rounded-[18px] bg-[#f3f4f6] px-4 py-3 text-center text-[13px] leading-6 text-[#475467]">
        {message.text}
      </div>

      <button
        type="button"
        onClick={() => onDelete(message.id)}
        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#c0c5cf] active:bg-[#fee2e2] active:text-[#dc2626]"
        aria-label="Delete aside"
      >
        <i className="fa-regular fa-trash-can text-[10px]" />
      </button>
    </div>
  )
}

function ChatMessage({ message, character, onDelete }) {
  const right = character?.chatSide === 'right'

  return (
    <div className={`flex items-end gap-2 py-2 ${right ? 'justify-end' : 'justify-start'}`}>
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

      <div className={`max-w-[72%] ${right ? 'items-end text-right' : 'items-start text-left'}`}>
        <div className="mb-1 px-1 text-[9.5px] font-extrabold text-[#98a2b3]">
          {character?.nickname || 'Character'}
        </div>

        <div className="flex items-start gap-1.5">
          {right ? (
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#c0c5cf] active:bg-[#fee2e2] active:text-[#dc2626]"
              aria-label="Delete message"
            >
              <i className="fa-regular fa-trash-can text-[10px]" />
            </button>
          ) : null}

          <div
            className={`rounded-[20px] px-4 py-3 text-[13px] leading-6 ${
              right
                ? 'rounded-br-[7px] bg-gradient-to-br from-[#8b5cf6] to-[#6d42db] text-white'
                : 'rounded-bl-[7px] bg-white text-[#273142] shadow-sm ring-1 ring-black/5'
            }`}
          >
            {message.text}
          </div>

          {!right ? (
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#c0c5cf] active:bg-[#fee2e2] active:text-[#dc2626]"
              aria-label="Delete message"
            >
              <i className="fa-regular fa-trash-can text-[10px]" />
            </button>
          ) : null}
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

export default function ChatStoryEditorPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const messagesEndRef = useRef(null)
  const [characters, setCharacters] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [episodeTitle, setEpisodeTitle] = useState('Episode 1')
  const [episodeId, setEpisodeId] = useState('')
  const [saving, setSaving] = useState(false)

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

  const wordCount = useMemo(() => {
    return messages.reduce((total, message) => {
      const words = String(message.text || '').trim().split(/\s+/).filter(Boolean)
      return total + words.length
    }, 0)
  }, [messages])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2300)
  }

  useEffect(() => {
    if (startNewEpisode) {
      localStorage.removeItem(storageKey)
      setMessages([])
      setEpisodeTitle('New Episode')
      setEpisodeId('')
      return
    }

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(Array.isArray(parsed.messages) ? parsed.messages : [])
        setEpisodeTitle(parsed.episodeTitle || 'Episode 1')
        setEpisodeId(parsed.episodeId || '')
      } catch {
        localStorage.removeItem(storageKey)
      }
    }
  }, [startNewEpisode, storageKey])

  useEffect(() => {
    const payload = JSON.stringify({
      episodeTitle,
      episodeId,
      messages,
      updatedAt: new Date().toISOString(),
    })
    localStorage.setItem(storageKey, payload)
  }, [episodeId, episodeTitle, messages, storageKey])

  useEffect(() => {
    async function loadCharacters() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)

        const response = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/chat/characters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load characters')
        }

        setCharacters(
          (data.characters || []).map((character) => ({
            id: character.id,
            nickname: character.nickname || '',
            image: character.avatar_url || '',
            group: character.role_group,
            chatSide:
              character.chat_side ||
              (character.role_group === 'main' ? 'right' : 'left'),
          }))
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

    if (storyId) loadCharacters()
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

        setEpisodeId(data.episode.id)
        setEpisodeTitle(data.episode.title || parsed.episode_title || 'Episode')
        setMessages(
          (parsed.messages || []).map((message) => ({
            id: message.id || makeId(),
            type: message.type === 'chat' ? 'chat' : 'aside',
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleCharacter = (characterId) => {
    setSelectedCharacterId((current) =>
      current === characterId ? null : characterId
    )
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return

    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        type: selectedCharacter ? 'chat' : 'aside',
        characterId: selectedCharacter?.id || null,
        text,
        createdAt: new Date().toISOString(),
      },
    ])
    setDraft('')
  }

  const deleteMessage = (messageId) => {
    setMessages((current) =>
      current.filter((message) => message.id !== messageId)
    )
  }

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const saveAndContinue = async () => {
    const cleanTitle = episodeTitle.trim()

    if (!cleanTitle) {
      showToast('Please enter an episode title.')
      return
    }

    if (!messages.length) {
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
            episode_id: episodeId || requestedEpisodeId || null,
            title: cleanTitle,
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
    <div className="min-h-screen bg-[#f7f5fb] pb-[190px]">
      {toast ? (
        <button
          type="button"
          onClick={() => setToast('')}
          className="fixed inset-x-4 top-[78px] z-[230] mx-auto max-w-[420px] rounded-[16px] bg-[#111827] px-4 py-3 text-center text-[12px] font-bold text-white shadow-xl"
        >
          {toast}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/author/story/${storyId}/chat/characters`)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <input
              value={episodeTitle}
              onChange={(event) => setEpisodeTitle(event.target.value)}
              maxLength={80}
              className="h-6 w-full bg-transparent text-center text-[16px] font-bold text-[#111827] outline-none"
              aria-label="Episode title"
            />
            <div className="mt-0.5 text-center text-[9px] font-bold text-[#98a2b3]">
              {wordCount} words · Draft saved locally
            </div>
          </div>

          <button
            type="button"
            onClick={saveAndContinue}
            disabled={saving || loading || !messages.length}
            className="h-10 shrink-0 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-4 text-[12px] font-extrabold text-white shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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

        <section className="mt-4 min-h-[calc(100vh-330px)] rounded-[26px] bg-gradient-to-b from-white to-[#f8f6fc] p-4 shadow-sm ring-1 ring-black/5">
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
                message.type === 'aside' ? (
                  <AsideMessage
                    key={message.id}
                    message={message}
                    onDelete={deleteMessage}
                  />
                ) : (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    character={characterMap[message.characterId]}
                    onDelete={deleteMessage}
                  />
                )
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/5 bg-white pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-3">
            <AsideAvatar
              active={!selectedCharacterId}
              onClick={() => setSelectedCharacterId(null)}
            />

            {characters.map((character) => (
              <CharacterAvatar
                key={character.id}
                character={character}
                selected={selectedCharacterId === character.id}
                onClick={() => toggleCharacter(character.id)}
              />
            ))}

            <button
              type="button"
              onClick={() =>
                navigate(`/author/story/${storyId}/chat/characters`)
              }
              className="w-[64px] shrink-0 text-center active:scale-[0.97]"
            >
              <span className="mx-auto flex h-[50px] w-[50px] items-center justify-center rounded-full border border-dashed border-[#b9a7dd] bg-[#faf8ff] text-[#7c3aed]">
                <i className="fa-solid fa-user-plus text-[15px]" />
              </span>
              <span className="mt-1.5 block text-[9.5px] font-extrabold text-[#7c3aed]">
                Add
              </span>
            </button>
          </div>

          <div className="flex items-end gap-2 px-4">
            <div className="min-w-0 flex-1 rounded-[20px] bg-[#f5f3fa] px-4 py-2.5">
              <div className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#8d7bab]">
                {selectedCharacter
                  ? `Message as ${selectedCharacter.nickname || 'Character'}`
                  : 'ASIDE · Text only'}
              </div>

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                rows={1}
                maxLength={2000}
                placeholder={
                  selectedCharacter
                    ? 'Write a chat message...'
                    : 'Write narration without a character...'
                }
                className="max-h-[100px] min-h-[28px] w-full resize-none bg-transparent text-[13px] leading-5 text-[#111827] outline-none placeholder:text-[#b0a7bf]"
              />
            </div>

            <button
              type="button"
              onClick={sendMessage}
              disabled={!draft.trim()}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${
                draft.trim()
                  ? 'bg-gradient-to-br from-[#9362ef] to-[#6d42db] shadow-[0_8px_18px_rgba(109,66,219,0.3)] active:scale-95'
                  : 'bg-[#d0d5dd]'
              }`}
              aria-label="Send message"
            >
              <i className="fa-solid fa-arrow-up text-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

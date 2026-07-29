import { useEffect, useMemo, useRef, useState } from 'react'

const CHAT_STORY_FORMAT = 'shadow_chat_story_v1'

function parseChatStoryContent(content) {
  try {
    const parsed =
      typeof content === 'string'
        ? JSON.parse(content)
        : content

    if (
      !parsed ||
      parsed.format !== CHAT_STORY_FORMAT ||
      !Array.isArray(parsed.messages)
    ) {
      return {
        error: 'This episode is not a valid Chat Story.',
        characters: [],
        messages: [],
      }
    }

    const characters = Array.isArray(parsed.characters)
      ? [...parsed.characters].sort(
          (first, second) =>
            Number(first?.sort_order || 0) -
            Number(second?.sort_order || 0)
        )
      : []

    const messages = [...parsed.messages]
      .filter((message) => {
        if (!message) return false
        if (message.type === 'image') {
          return Boolean(message.image_url || message.imageUrl)
        }

        return Boolean(String(message.text || '').trim())
      })
      .sort(
        (first, second) =>
          Number(first?.sort_order || 0) -
          Number(second?.sort_order || 0)
      )

    return {
      error: '',
      characters,
      messages,
    }
  } catch {
    return {
      error: 'Chat Story data could not be opened.',
      characters: [],
      messages: [],
    }
  }
}

function getEmojiOnlyCount(value) {
  const text = String(value || '').trim()

  if (!text || text.length > 60) return 0

  const emojiPattern =
    /(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*)/gu

  const emojis = text.match(emojiPattern) || []
  const remainingText = text
    .replace(emojiPattern, '')
    .replace(/\s/g, '')

  return remainingText ? 0 : emojis.length
}

function CharacterAvatar({ character }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1ecff] ring-1 ring-black/5">
      {character?.avatar_url ? (
        <img
          src={character.avatar_url}
          alt={character.nickname || 'Character'}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <i className="fa-solid fa-user text-[17px] text-[#9b87c9]" />
      )}
    </div>
  )
}

function AsideMessage({ message }) {
  return (
    <div className="mx-auto flex max-w-[88%] justify-center py-3">
      <div className="rounded-[18px] bg-[#f1f2f4] px-5 py-3 text-center text-[15px] leading-7 text-[#5f6672]">
        {message.text}
      </div>
    </div>
  )
}

function AuthorNoteMessage({ message }) {
  return (
    <section className="mx-auto my-6 max-w-[560px] rounded-[20px] border border-[#ece7f5] bg-[#faf8ff] px-5 py-5">
      <div className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c78b5]">
        Author&apos;s Note
      </div>

      <p className="mt-3 whitespace-pre-wrap text-center text-[14px] leading-7 text-[#5f566b]">
        {message.text}
      </p>
    </section>
  )
}

function ImageMessage({ message }) {
  const imageUrl = message.image_url || message.imageUrl

  return (
    <div className="mx-auto my-4 max-w-[560px] overflow-hidden rounded-[18px] bg-[#f3f4f6]">
      <img
        src={imageUrl}
        alt="Chat Story"
        loading="lazy"
        decoding="async"
        className="block h-auto max-h-[72vh] w-full object-contain"
      />
    </div>
  )
}

function ChatMessage({ message, character, leadCharacterId }) {
  const isRight =
    String(message.character_id || '') === String(leadCharacterId || '') ||
    character?.is_lead === true ||
    character?.chat_side === 'right'

  const emojiCount = getEmojiOnlyCount(message.text)
const emojiOnly = emojiCount > 0

  const messageBody = (
    <div
      className={`min-w-0 max-w-[76%] ${
        isRight ? 'text-right' : 'text-left'
      }`}
    >
      <div
        className={`mb-1 px-1 text-[11px] font-medium ${
          isRight ? 'text-[#8c78b5]' : 'text-[#7b8492]'
        }`}
      >
        {character?.nickname || 'Unknown'}
      </div>

      {emojiOnly ? (
  <div
    className={`px-2 py-2 ${
      emojiCount === 1
        ? 'text-[88px]'
        : 'text-[44px]'
    } leading-none`}
  >
    {message.text}
  </div>
) : (
        <div
          className={`inline-block max-w-full whitespace-pre-wrap break-words rounded-[20px] px-4 py-3 text-left text-[15px] leading-7 ${
            isRight
              ? 'rounded-br-[6px] bg-[#7c3aed] text-white'
              : 'rounded-bl-[6px] bg-[#f1f2f4] text-[#344054]'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )

  return (
    <div
      className={`flex items-end gap-2 py-2 ${
        isRight ? 'justify-end' : 'justify-start'
      }`}
    >
      {isRight ? (
        <>
          {messageBody}
          <CharacterAvatar character={character} />
        </>
      ) : (
        <>
          <CharacterAvatar character={character} />
          {messageBody}
        </>
      )}
    </div>
  )
}

function ChatStoryMessage({
  message,
  character,
  leadCharacterId,
}) {
  if (message.type === 'aside') {
    return <AsideMessage message={message} />
  }

  if (message.type === 'author_note') {
    return <AuthorNoteMessage message={message} />
  }

  if (message.type === 'image') {
    return <ImageMessage message={message} />
  }

  return (
    <ChatMessage
      message={message}
      character={character}
      leadCharacterId={leadCharacterId}
    />
  )
}

export default function ChatStoryReader({
  content,
  onProgress,
  onComplete,
}) {
  const parsedContent = useMemo(
    () => parseChatStoryContent(content),
    [content]
  )

  const [visibleCount, setVisibleCount] = useState(
    parsedContent.messages.length ? 1 : 0
  )

  const lastMessageRef = useRef(null)
  const completionSentRef = useRef(false)

  const characterMap = useMemo(
    () =>
      new Map(
        parsedContent.characters.map((character) => [
          String(character.id),
          character,
        ])
      ),
    [parsedContent.characters]
  )

  const leadCharacterId = useMemo(() => {
    const leadCharacter =
      parsedContent.characters.find(
        (character) => character.is_lead === true
      ) ||
      parsedContent.characters.find(
        (character) => character.chat_side === 'right'
      )

    return leadCharacter?.id || ''
  }, [parsedContent.characters])

  const visibleMessages = parsedContent.messages.slice(
    0,
    visibleCount
  )

  const completed =
    parsedContent.messages.length > 0 &&
    visibleCount >= parsedContent.messages.length

  useEffect(() => {
    setVisibleCount(
      parsedContent.messages.length ? 1 : 0
    )
    completionSentRef.current = false
  }, [content, parsedContent.messages.length])

  useEffect(() => {
    const total = parsedContent.messages.length

    if (!total) {
      onProgress?.(0)
      return
    }

    onProgress?.(
      Math.round((visibleCount / total) * 100)
    )

    if (
      visibleCount >= total &&
      !completionSentRef.current
    ) {
      completionSentRef.current = true
      onComplete?.()
    }
  }, [
    onComplete,
    onProgress,
    parsedContent.messages.length,
    visibleCount,
  ])

  useEffect(() => {
    if (visibleCount <= 1) return undefined

    const frame = window.requestAnimationFrame(() => {
      lastMessageRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [visibleCount])

  const revealNextMessage = () => {
    if (completed) return

    setVisibleCount((current) =>
      Math.min(
        current + 1,
        parsedContent.messages.length
      )
    )
  }

  const handleReaderClick = (event) => {
    if (
      event.target.closest(
        'button, a, input, textarea, select, audio, video'
      )
    ) {
      return
    }

    revealNextMessage()
  }

  const handleReaderKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    revealNextMessage()
  }

  if (parsedContent.error) {
    return (
      <section className="mx-4 my-6 rounded-[18px] bg-[#fff1f1] px-4 py-4 text-center text-[13px] font-semibold leading-6 text-[#d92d20]">
        {parsedContent.error}
      </section>
    )
  }

  if (!parsedContent.messages.length) {
    return (
      <section className="mx-4 my-6 rounded-[18px] bg-[#f5f3fa] px-4 py-4 text-center text-[13px] font-semibold leading-6 text-[#7b6d91]">
        No Chat Story messages found.
      </section>
    )
  }

  return (
    <section
      role="button"
      tabIndex={0}
      aria-label="Tap to show the next Chat Story message"
      onClick={handleReaderClick}
      onKeyDown={handleReaderKeyDown}
      className="min-h-[70vh] cursor-pointer bg-white px-4 pb-12 pt-5 outline-none sm:px-8"
    >
      <div className="mx-auto max-w-[680px]">
        {visibleMessages.map((message, index) => (
          <div
            key={
              message.id ||
              `${message.type || 'message'}-${index}`
            }
            ref={
              index === visibleMessages.length - 1
                ? lastMessageRef
                : null
            }
            className="animate-[fadeIn_180ms_ease-out]"
          >
            <ChatStoryMessage
              message={message}
              character={characterMap.get(
                String(message.character_id || '')
              )}
              leadCharacterId={leadCharacterId}
            />
          </div>
        ))}

        {!completed ? (
          <div className="pointer-events-none flex flex-col items-center justify-center pb-6 pt-12 text-[#a78bda]">
            <span className="text-[13px] font-medium">
              Tap to continue
            </span>
            <i className="fa-regular fa-hand-pointer mt-4 animate-bounce text-[34px]" />
          </div>
        ) : null}
      </div>
    </section>
  )
}

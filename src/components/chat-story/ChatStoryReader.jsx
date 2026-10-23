import ChatStoryVoice, { ChatVoiceSessionContext, getChatRecordingDelay, isChatVoiceMessage } from './ChatStoryVoice'
import { useChatStoryTheme, CHAT_THEME_STYLE_CSS } from '../../services/chatStoryThemes'
import ChatStoryPhoneView, {
  chatCharacterId,
  createChatTiming,
} from './ChatStoryPhoneView'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  getDisplayText,
  useDisplayTranslation,
} from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ChatStoryTapIndicator from './ChatStoryTapIndicator'
import { useChatTapIndicator } from '../../services/chatStoryTapIndicator'

registerTranslationNamespace('chatStoryReader', {
  en: {
    invalidStory: 'This episode is not a valid Chat Story.',
    openFailed: 'Chat Story data could not be opened.',
    unknown: 'Unknown',
    authorNote: "Author's Note",
    imageLoadFailed: 'Image could not be loaded.',
    noMessages: 'No Chat Story messages found.',
    tapToContinue: 'Tap to continue',
  },
  km: {
    invalidStory: 'ភាគនេះមិនមែនជា Chat Story ត្រឹមត្រូវទេ។',
    openFailed: 'មិនអាចបើកទិន្នន័យ Chat Story បានទេ។',
    unknown: 'មិនស្គាល់',
    authorNote: 'កំណត់សម្គាល់ពីអ្នកនិពន្ធ',
    imageLoadFailed: 'មិនអាចផ្ទុករូបភាពបានទេ។',
    noMessages: 'មិនមានសារ Chat Story ទេ។',
    tapToContinue: 'ចុចដើម្បីបន្ត',
  },
  zh: {
    invalidStory: '此章节不是有效的 Chat Story。',
    openFailed: '无法打开 Chat Story 数据。',
    unknown: '未知',
    authorNote: '作者的话',
    imageLoadFailed: '无法加载图片。',
    noMessages: '未找到 Chat Story 消息。',
    tapToContinue: '点击继续',
  },
  ja: {
    invalidStory: 'このエピソードは有効な Chat Story ではありません。',
    openFailed: 'Chat Story のデータを開けませんでした。',
    unknown: '不明',
    authorNote: '作者ノート',
    imageLoadFailed: '画像を読み込めませんでした。',
    noMessages: 'Chat Story のメッセージが見つかりません。',
    tapToContinue: 'タップして続ける',
  },
  ko: {
    invalidStory: '이 에피소드는 올바른 Chat Story가 아닙니다.',
    openFailed: 'Chat Story 데이터를 열 수 없습니다.',
    unknown: '알 수 없음',
    authorNote: '작가의 말',
    imageLoadFailed: '이미지를 불러올 수 없습니다.',
    noMessages: 'Chat Story 메시지를 찾을 수 없습니다.',
    tapToContinue: '탭하여 계속',
  },
})

const CHAT_STORY_FORMAT = 'shadow_chat_story_v1'

function parseChatStoryContent(content) {
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content

    if (
      !parsed ||
      parsed.format !== CHAT_STORY_FORMAT ||
      !Array.isArray(parsed.messages)
    ) {
      return {
        errorKey: 'invalidStory',
        characters: [],
        messages: [],
        leadCharacterId: '',
      }
    }

    const characters = Array.isArray(parsed.characters)
      ? [...parsed.characters].sort(
          (first, second) =>
            Number(first?.sort_order || 0) - Number(second?.sort_order || 0)
        )
      : []

    const messages = [...parsed.messages]
      .filter((message) => {
        if (!message) return false

        if (message.type === 'audio' || message.type === 'voice') return isChatVoiceMessage(message)

        if (message.type === 'image' || message.type === 'sticker') {
          return Boolean(message.image_url || message.imageUrl)
        }

        return Boolean(String(message.text || '').trim())
      })
      .sort(
        (first, second) =>
          Number(first?.sort_order || 0) - Number(second?.sort_order || 0)
      )

    return {
      errorKey: '',
      characters,
      messages,
      leadCharacterId: parsed.lead_character_id || parsed.leadCharacterId || '',
    }
  } catch {
    return {
      errorKey: 'openFailed',
      characters: [],
      messages: [],
      leadCharacterId: '',
    }
  }
}

function getEmojiOnlyCount(value) {
  const text = String(value || '').trim()

  if (!text || text.length > 60) return 0

  const emojiPattern =
    /(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*)/gu

  const emojis = text.match(emojiPattern) || []
  const remainingText = text.replace(emojiPattern, '').replace(/\s/g, '')

  return remainingText ? 0 : emojis.length
}

function getCharacterId(message) {
  return String(message?.character_id || message?.characterId || '')
}

function isCharacterMessage(message) {
  if (
    message?.type !== 'audio' &&
    message?.type !== 'voice' &&
    message?.type !== 'chat' &&
    message?.type !== 'image' &&
    message?.type !== 'sticker'
  ) {
    return false
  }

  return Boolean(getCharacterId(message))
}

function isSameCharacterGroup(first, second) {
  if (!isCharacterMessage(first) || !isCharacterMessage(second)) {
    return false
  }

  return getCharacterId(first) === getCharacterId(second)
}

function isRightMessage(message, character, leadCharacterId) {
  return (
    getCharacterId(message) === String(leadCharacterId || '') ||
    character?.is_lead === true ||
    character?.chat_side === 'right'
  )
}

function CharacterAvatar({ character }) {
  return (
    <div className="cs-style-avatar flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
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

function AvatarSlot({ character, visible }) {
  if (visible) {
    return <CharacterAvatar character={character} />
  }

  return <div className="h-11 w-11 shrink-0" aria-hidden="true" />
}

function CharacterName({ character, isRight, visible }) {
  if (!visible) return null

  return (
    <div
      className={`cs-style-name mb-1 px-1 text-[11px] font-medium ${
        isRight ? 'text-[var(--cs-accent)]' : 'text-[var(--shadow-text-secondary)]'
      }`}
    >
      {character?.nickname || getDisplayText('chatStoryReader.unknown')}
    </div>
  )
}

function AsideMessage({ message }) {
  return (
    <div className="mx-auto flex max-w-[88%] justify-center py-3">
      <div className="rounded-[18px] bg-[var(--shadow-bg-soft)] px-5 py-3 text-center text-[15px] leading-7 text-[var(--shadow-text-secondary)]">
        {message.text}
      </div>
    </div>
  )
}

function AuthorNoteMessage({ message }) {
  return (
    <section className="mx-auto my-6 max-w-[560px] rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-5 py-5">
      <div className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c78b5]">
        {getDisplayText('chatStoryReader.authorNote')}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-center text-[14px] leading-7 text-[var(--shadow-text-secondary)]">
        {message.text}
      </p>
    </section>
  )
}

function CenterImageMessage({ message }) {
  const [failed, setFailed] = useState(false)
  const imageUrl = message.image_url || message.imageUrl || ''

  useEffect(() => {
    setFailed(false)
  }, [imageUrl])

  return (
    <div className="mx-auto my-4 max-w-[560px] overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
      {failed ? (
        <div className="flex min-h-[150px] items-center justify-center px-5 text-center text-[13px] font-medium text-[var(--shadow-text-tertiary)]">
          {getDisplayText('chatStoryReader.imageLoadFailed')}
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="Chat Story"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="block h-auto max-h-[72vh] w-full object-contain"
        />
      )}
    </div>
  )
}

function CharacterImageMessage({
  message,
  character,
  leadCharacterId,
  showName,
  showAvatar,
  groupedBefore,
  groupedAfter,
}) {
  const [failed, setFailed] = useState(false)
  const imageUrl = message.image_url || message.imageUrl || ''
  const isRight = isRightMessage(message, character, leadCharacterId)

  useEffect(() => {
    setFailed(false)
  }, [imageUrl])

  const messageBody = (
    <div
      className={`min-w-0 max-w-[76%] ${isRight ? 'text-right' : 'text-left'}`}
    >
      <CharacterName
        character={character}
        isRight={isRight}
        visible={showName}
      />

      <div className="overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
        {failed ? (
          <div className="flex min-h-[130px] min-w-[180px] items-center justify-center px-4 text-center text-[12px] font-medium text-[var(--shadow-text-tertiary)]">
            {getDisplayText('chatStoryReader.imageLoadFailed')}
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={character?.nickname || 'Chat Story'}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="block h-auto max-h-[72vh] w-full object-contain"
          />
        )}
      </div>
    </div>
  )

  return (
    <div
      className={`flex items-end gap-2 ${groupedBefore ? 'pt-0.5' : 'pt-2'} ${
        groupedAfter ? 'pb-0.5' : 'pb-2'
      } ${isRight ? 'justify-end' : 'justify-start'}`}
    >
      {isRight ? (
        <>
          {messageBody}
          <AvatarSlot character={character} visible={showAvatar} />
        </>
      ) : (
        <>
          <AvatarSlot character={character} visible={showAvatar} />
          {messageBody}
        </>
      )}
    </div>
  )
}

function ChatMessage({
  message,
  character,
  leadCharacterId,
  showName,
  showAvatar,
  groupedBefore,
  groupedAfter,
}) {
  const isRight = isRightMessage(message, character, leadCharacterId)
  const emojiCount = getEmojiOnlyCount(message.text)
  const emojiOnly = emojiCount > 0

  const messageBody = (
    <div
      className={`min-w-0 max-w-[76%] ${isRight ? 'text-right' : 'text-left'}`}
    >
      <CharacterName
        character={character}
        isRight={isRight}
        visible={showName}
      />

      {emojiOnly ? (
        <div
          className={`px-2 py-2 ${
            emojiCount === 1 ? 'text-[88px]' : 'text-[44px]'
          } leading-none`}
        >
          {message.text}
        </div>
      ) : (
        <div
          style={{ borderRadius: isRight ? 'var(--cs-radius) var(--cs-radius) var(--cs-corner) var(--cs-radius)' : 'var(--cs-radius) var(--cs-radius) var(--cs-radius) var(--cs-corner)', border: 'var(--cs-bubble-border)', boxShadow: 'var(--cs-bubble-shadow)', background: isRight ? 'linear-gradient(125deg, var(--cs-outgoing), var(--cs-outgoing-end))' : 'var(--cs-soft)', color: isRight ? 'var(--cs-outgoing-text)' : 'var(--cs-text)' }}
          data-side={isRight ? 'right' : 'left'}
          className={`cs-style-bubble inline-block max-w-full whitespace-pre-wrap break-words rounded-[20px] px-4 py-3 text-left text-[15px] leading-7 ${
            isRight
              ? 'rounded-br-[6px] bg-[var(--cs-outgoing)] text-white'
              : 'rounded-bl-[6px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )

  return (
    <div
      className={`flex items-end gap-2 ${groupedBefore ? 'pt-0.5' : 'pt-2'} ${
        groupedAfter ? 'pb-0.5' : 'pb-2'
      } ${isRight ? 'justify-end' : 'justify-start'}`}
    >
      {isRight ? (
        <>
          {messageBody}
          <AvatarSlot character={character} visible={showAvatar} />
        </>
      ) : (
        <>
          <AvatarSlot character={character} visible={showAvatar} />
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
  showName,
  showAvatar,
  groupedBefore,
  groupedAfter,
}) {
  if (isChatVoiceMessage(message)) {
    const right = isRightMessage(message, character, leadCharacterId)
    return (
      <div className={`flex items-end gap-2 py-2 ${right ? 'justify-end' : 'justify-start'}`}>
        {!right ? <AvatarSlot character={character} visible={showAvatar} /> : null}
        <div className="min-w-0 max-w-[76%]">
          <CharacterName character={character} isRight={right} visible={showName} />
          <ChatStoryVoice message={message}
            label={getDisplayText('chatStoryPhone.voice')}
            retryLabel={getDisplayText('chatStoryPhone.voiceRetry')}
            errorLabel={getDisplayText('chatStoryPhone.voiceFailed')} />
        </div>
        {right ? <AvatarSlot character={character} visible={showAvatar} /> : null}
      </div>
    )
  }

  if (message.type === 'aside') {
    return <AsideMessage message={message} />
  }

  if (message.type === 'author_note') {
    return <AuthorNoteMessage message={message} />
  }

  if (message.type === 'image' || message.type === 'sticker') {
    if (!getCharacterId(message)) {
      return <CenterImageMessage message={message} />
    }

    return (
      <CharacterImageMessage
        message={message}
        character={character}
        leadCharacterId={leadCharacterId}
        showName={showName}
        showAvatar={showAvatar}
        groupedBefore={groupedBefore}
        groupedAfter={groupedAfter}
      />
    )
  }

  return (
    <ChatMessage
      message={message}
      character={character}
      leadCharacterId={leadCharacterId}
      showName={showName}
      showAvatar={showAvatar}
      groupedBefore={groupedBefore}
      groupedAfter={groupedAfter}
    />
  )
}

export default function ChatStoryReader({
  content,
  readMode = 'manual',
  autoTapDelay = 2000,
  autoTapPaused = false,
  onProgress,
  onComplete,
  storyTitle = '',
  coverUrl = '',
  onReadModeChange,
  phoneTheme,
  phoneFontFamily,
  phoneFontSize = 15,
  phoneLineHeight = 1.8,
  brightnessOpacity = 0,
}) {
  const { t } = useDisplayTranslation()
  const chatTheme = useChatStoryTheme()
  const { settings: tapIndicatorSettings } = useChatTapIndicator()
  const parsedContent = useMemo(() => parseChatStoryContent(content), [content])
  const initialCount = parsedContent.messages.length && !isChatVoiceMessage(parsedContent.messages[0]) ? 1 : 0
  const [reading, setReading] = useState(() => ({
    content,
    count: initialCount,
  }))
  const visibleCount =
    reading.content === content ? reading.count : initialCount
  const voiceSession = useMemo(() => ({ positions: new WeakMap() }), [parsedContent])
  const [voiceSettled, setVoiceSettled] = useState({ source: null, index: -1 })
  const [userPaused, setUserPaused] = useState(false)
  const [finishedSource, setFinishedSource] = useState(null)
  const [pageVisible, setPageVisible] = useState(
    () =>
      typeof document === 'undefined' || document.visibilityState === 'visible'
  )
  const [clock, setClock] = useState({ source: null, index: -1, elapsed: 0 })
  const cycleRef = useRef({ source: null, index: -1, elapsed: 0, done: false })
  const lastMessageRef = useRef(null)
  const manualTapRef = useRef({ timer: null, at: 0, y: 0 })
  const tapHintRef = useRef(null)
  const pendingPositionRef = useRef(null)
  const completionSentRef = useRef(null)
  const onProgressRef = useRef(onProgress)
  const onCompleteRef = useRef(onComplete)
  onProgressRef.current = onProgress
  onCompleteRef.current = onComplete

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
    const explicit = String(parsedContent.leadCharacterId || '')
    if (explicit && characterMap.has(explicit)) return explicit
    const lead =
      parsedContent.characters.find(
        (character) => character.is_lead === true
      ) ||
      parsedContent.characters.find(
        (character) => character.chat_side === 'right'
      ) ||
      parsedContent.characters[0]
    return String(lead?.id ?? '')
  }, [parsedContent, characterMap])

  const visibleMessages = useMemo(
    () => parsedContent.messages.slice(0, visibleCount),
    [parsedContent, visibleCount]
  )
  const nextMessage = parsedContent.messages[visibleCount]
  const currentMessage = parsedContent.messages[visibleCount - 1]
  const voiceFinished = voiceSettled.source === parsedContent && voiceSettled.index === visibleCount - 1
  const voiceWaiting = isChatVoiceMessage(currentMessage) && !voiceFinished
  const finishVoice = (message) => {
    if (message !== currentMessage) return
    setVoiceSettled({ source: parsedContent, index: visibleCount - 1 })
  }
  const failVoice = (error, message) => finishVoice(message)
  const completed =
    parsedContent.messages.length > 0 &&
    visibleCount >= parsedContent.messages.length
  const active =
    readMode === 'auto' &&
    !userPaused &&
    !autoTapPaused &&
    pageVisible &&
    (!completed || finishedSource !== parsedContent) &&
    !parsedContent.errorKey &&
    parsedContent.messages.length > 0
  const timing = useMemo(() => {
    const base = createChatTiming(currentMessage, nextMessage, autoTapDelay)
    const recording = isChatVoiceMessage(nextMessage)
    return {
      ...base,
      reading: !currentMessage || isChatVoiceMessage(currentMessage) ? 0 : base.reading,
      typing: recording ? getChatRecordingDelay(nextMessage) : base.typing,
    }
  }, [currentMessage, nextMessage, autoTapDelay])
  const elapsed =
    clock.source === parsedContent && clock.index === visibleCount
      ? clock.elapsed
      : 0
  const typingElapsed = Math.max(0, elapsed - timing.reading)
  const typingMessage =
    active && !voiceWaiting && !isChatVoiceMessage(nextMessage) && timing.typing > 0 && elapsed >= timing.reading
      ? nextMessage
      : null
  const recordingMessage = active && !voiceWaiting && isChatVoiceMessage(nextMessage) && elapsed >= timing.reading ? nextMessage : null
  const draft = useMemo(() => {
    if (!typingMessage || chatCharacterId(typingMessage) !== leadCharacterId)
      return ''
    const fraction = Math.min(
      1,
      typingElapsed / Math.max(1, timing.typing - 160)
    )
    let length = 0
    while (
      length < timing.thresholds.length &&
      timing.thresholds[length] <= fraction
    )
      length += 1
    return timing.graphemes.slice(0, length).join('')
  }, [typingMessage, typingElapsed, timing, leadCharacterId])

  useEffect(() => {
    const handleVisibilityChange = () =>
      setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    setUserPaused(false)
  }, [content])

  useEffect(() => {
    if (readMode === 'auto') setUserPaused(false)
  }, [readMode])

  useEffect(() => {
    const total = parsedContent.messages.length
    onProgressRef.current?.(
      total ? Math.round((visibleCount / total) * 100) : 0
    )
    if (completed && (!voiceWaiting || (readMode !== 'auto' && !userPaused)) && completionSentRef.current !== parsedContent) {
      completionSentRef.current = parsedContent
      onCompleteRef.current?.()
    }
  }, [parsedContent, visibleCount, completed, voiceWaiting, readMode, userPaused])

  useEffect(() => {
    if (!active || voiceWaiting) return undefined
    if (
      cycleRef.current.source !== parsedContent ||
      cycleRef.current.index !== visibleCount
    ) {
      cycleRef.current = {
        source: parsedContent,
        index: visibleCount,
        elapsed: 0,
        done: false,
      }
    }
    const cycle = cycleRef.current
    let previousTime = performance.now()
    let timer
    let stopped = false
    const advance = () => {
      if (stopped || cycle.done || document.visibilityState !== 'visible')
        return
      const now = performance.now()
      cycle.elapsed += now - previousTime
      previousTime = now
      setClock({
        source: parsedContent,
        index: visibleCount,
        elapsed: cycle.elapsed,
      })
      if (cycle.elapsed >= timing.reading + timing.typing) {
        cycle.done = true
        if (completed) {
          setFinishedSource(parsedContent)
          return
        }
        setReading((current) => ({
          content,
          count: Math.min(
            (current.content === content ? current.count : initialCount) + 1,
            parsedContent.messages.length
          ),
        }))
        return
      }
      timer = window.setTimeout(advance, 40)
    }
    setClock({
      source: parsedContent,
      index: visibleCount,
      elapsed: cycle.elapsed,
    })
    timer = window.setTimeout(advance, 40)
    return () => {
      stopped = true
      window.clearTimeout(timer)
      if (!cycle.done && document.visibilityState === 'visible') {
        cycle.elapsed += Math.max(0, performance.now() - previousTime)
      }
    }
  }, [
    active,
    voiceWaiting,
    parsedContent,
    visibleCount,
    timing,
    content,
    initialCount,
    completed,
  ])

  useLayoutEffect(() => {
    const position = pendingPositionRef.current
    pendingPositionRef.current = null
    if (active || !position) return
    if (!position.follow) {
      window.scrollTo({ top: position.y, behavior: 'instant' })
      return
    }
    const anchor = tapHintRef.current || lastMessageRef.current
    if (!anchor) return
    const bottom = anchor.getBoundingClientRect().bottom
    const target = Math.max(position.y, window.scrollY + bottom + 48 - window.innerHeight)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }, [visibleCount, active])

  const rememberPosition = () => {
    const anchor = tapHintRef.current || lastMessageRef.current
    const bottom = anchor?.getBoundingClientRect().bottom
    pendingPositionRef.current = {
      y: window.scrollY,
      follow: bottom != null && bottom <= window.innerHeight + 56,
    }
  }

  const revealNextMessage = () => {
    if (completed) return
    setReading((current) => ({
      content,
      count: Math.min(
        (current.content === content ? current.count : initialCount) + 1,
        parsedContent.messages.length
      ),
    }))
  }

  const pausePhone = () => {
    setUserPaused(true)
    onReadModeChange?.('manual')
  }

  const resumePhone = () => {
    setUserPaused(false)
    onReadModeChange?.('auto')
  }

  useEffect(() => {
    const cancelPendingTap = () => {
      window.clearTimeout(manualTapRef.current.timer)
      manualTapRef.current.timer = null
      manualTapRef.current.at = 0
    }
    const cancelOnScroll = () => {
      if (Math.abs(window.scrollY - manualTapRef.current.y) > 8) cancelPendingTap()
    }
    const cancelOnInteraction = () => {
      cancelPendingTap()
      window.scrollTo({ top: window.scrollY, behavior: 'instant' })
    }
    window.addEventListener('scroll', cancelOnScroll, { passive: true })
    window.addEventListener('touchmove', cancelOnInteraction, { passive: true })
    window.addEventListener('wheel', cancelOnInteraction, { passive: true })
    return () => {
      cancelPendingTap()
      window.removeEventListener('scroll', cancelOnScroll)
      window.removeEventListener('touchmove', cancelOnInteraction)
      window.removeEventListener('wheel', cancelOnInteraction)
    }
  }, [content, active, readMode, userPaused])

  const handleReaderClick = (event) => {
    if (readMode !== 'manual' && !userPaused) return
    if (event.target.closest('button, a, input, textarea, select, audio, video, [data-ignore-reader-tap="true"]')) return
    const now = Date.now()
    const tap = manualTapRef.current
    if (tap.timer !== null && now - tap.at < 320) {
      window.clearTimeout(tap.timer)
      tap.timer = null
      tap.at = 0
      return
    }
    window.clearTimeout(tap.timer)
    tap.at = now
    tap.y = window.scrollY

    tap.timer = window.setTimeout(() => {
      tap.timer = null
      tap.at = 0
      rememberPosition()
      revealNextMessage()
    }, 340)
  }

  const handleReaderKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (readMode !== 'manual' && !userPaused) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    window.clearTimeout(manualTapRef.current.timer)
    manualTapRef.current.timer = null
    rememberPosition()
    revealNextMessage()
  }

  if (parsedContent.errorKey) {
    return (
      <section className="mx-4 my-6 rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-4 text-center text-[13px] font-semibold leading-6 text-[#d92d20] dark:text-[#ff7b72]">
        {t(`chatStoryReader.${parsedContent.errorKey}`)}
      </section>
    )
  }

  if (!parsedContent.messages.length) {
    return (
      <section className="mx-4 my-6 rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-4 text-center text-[13px] font-semibold leading-6 text-[var(--shadow-text-secondary)]">
        {t('chatStoryReader.noMessages')}
      </section>
    )
  }

  return (
    <ChatVoiceSessionContext.Provider value={voiceSession}>
      <style>{CHAT_THEME_STYLE_CSS}</style>
      {!active ? (
        <section
          data-chat-style={chatTheme.theme.styleId}
          style={{
            ...chatTheme.style,
            overflowAnchor: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            '--shadow-bg-page': chatTheme.theme.background,
            '--shadow-bg-soft': chatTheme.theme.incoming,
            '--shadow-text-primary': chatTheme.theme.text,
            '--shadow-text-secondary': chatTheme.theme.muted,
            '--shadow-text-tertiary': chatTheme.theme.muted,
            '--shadow-border': chatTheme.theme.border,
          }}
          role={readMode === 'manual' || userPaused ? 'button' : undefined}
          tabIndex={readMode === 'manual' || userPaused ? 0 : -1}
          aria-label={t('chatStoryReader.tapToContinue')}
          onClick={handleReaderClick}
          onKeyDown={handleReaderKeyDown}
          className={`min-h-[70vh] bg-[var(--shadow-bg-page)] px-4 pb-12 pt-5 text-[var(--shadow-text-primary)] outline-none sm:px-8 ${readMode === 'manual' || userPaused ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="mx-auto max-w-[680px]">
            {visibleMessages.map((message, index) => {
              const groupedBefore = isSameCharacterGroup(
                visibleMessages[index - 1],
                message
              )
              const groupedAfter = isSameCharacterGroup(
                message,
                visibleMessages[index + 1]
              )
              const character = characterMap.get(getCharacterId(message))
              return (
                <div
                  key={`${message.id || message.type || 'message'}-${index}`}
                  ref={
                    index === visibleMessages.length - 1 ? lastMessageRef : null
                  }
                  data-grouped={groupedBefore ? 'true' : 'false'}
                  className="cs-style-row animate-[fadeIn_180ms_ease-out]"
                >
                  <ChatStoryMessage
                    message={message}
                    character={character}
                    leadCharacterId={leadCharacterId}
                    showName={isCharacterMessage(message) && !groupedBefore}
                    showAvatar={isCharacterMessage(message) && !groupedAfter}
                    groupedBefore={groupedBefore}
                    groupedAfter={groupedAfter}
                  />
                </div>
              )
            })}
            {!completed && (readMode === 'manual' || userPaused) ? (
              <div ref={tapHintRef} className="flex flex-col items-center justify-center pb-6 pt-10 text-[#a98bd7]" style={{ minHeight: 220 }}>
                {userPaused && readMode === 'auto' ? (
                  <button
                    type="button"
                    onClick={resumePhone}
                    className="mb-5 rounded-full bg-[var(--cs-outgoing)] px-5 py-2.5 text-[13px] font-medium text-white"
                  >
                    {t('chatStoryPhone.resume')}
                  </button>
                ) : null}
                <span className="pointer-events-none text-[14px] font-medium">
                  {t('chatStoryReader.tapToContinue')}
                </span>
                <ChatStoryTapIndicator
  settings={tapIndicatorSettings}
  size={108}
  className="mt-3 opacity-95"
/>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      {active ? (
        <ChatStoryPhoneView
          storyTitle={storyTitle}
          coverUrl={coverUrl}
          characters={parsedContent.characters}
          messages={visibleMessages}
          leadCharacterId={leadCharacterId}
          typingMessage={typingMessage}
          draft={draft}
          recordingMessage={recordingMessage}
          recordingElapsed={typingElapsed}
          voicePlaybackIndex={voiceWaiting ? visibleCount - 1 : -1}
          onVoiceEnded={finishVoice}
          onVoiceError={failVoice}
          onPause={pausePhone}
          themeName={phoneTheme}
          fontFamily={phoneFontFamily}
          fontSize={phoneFontSize}
          lineHeight={phoneLineHeight}
          brightnessOpacity={brightnessOpacity}
        />
      ) : null}
    </ChatVoiceSessionContext.Provider>
  )
}





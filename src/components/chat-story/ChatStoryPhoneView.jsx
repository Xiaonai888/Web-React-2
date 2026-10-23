import ChatStoryVoice, { ChatStoryRecording, isChatVoiceMessage } from './ChatStoryVoice'
import { useChatStoryTheme } from '../../services/chatStoryThemes'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatStoryPhone', {
  en: {
    recording: "{{name}} is recording voice…",
    recordingVoice: "Recording voice…",
    voice: "Voice message",
    voiceRetry: "Tap Play to listen",
    voiceFailed: "Voice could not be loaded.",

    typing: '{{name}} is typing…',
    members: '{{count}} members',
    you: 'You',
    messageAs: 'Message as {{name}}…',
    pause: 'Pause and return to reading',
    resume: 'Resume Phone Chat',
    back: 'Return to reading',
    title: 'Chat Story',
    unknown: 'Unknown',
    imageFailed: 'Image could not be loaded.',
    authorNote: 'Author’s Note',
    automatic: 'Messages are sent automatically',
  },
  km: {
    recording: "{{name}} កំពុងថតសំឡេង…",
    recordingVoice: "កំពុងថតសំឡេង…",
    voice: "សារសំឡេង",
    voiceRetry: "ចុច Play ដើម្បីស្ដាប់",
    voiceFailed: "មិនអាចផ្ទុកសំឡេងបានទេ។",

    typing: '{{name}} កំពុងវាយ…',
    members: 'សមាជិក {{count}} នាក់',
    you: 'អ្នក',
    messageAs: 'សារក្នុងនាម {{name}}…',
    pause: 'ផ្អាក និងត្រឡប់ទៅការអាន',
    resume: 'បន្ត Phone Chat',
    back: 'ត្រឡប់ទៅការអាន',
    title: 'Chat Story',
    unknown: 'មិនស្គាល់',
    imageFailed: 'មិនអាចផ្ទុករូបភាពបានទេ។',
    authorNote: 'កំណត់សម្គាល់ពីអ្នកនិពន្ធ',
    automatic: 'សារត្រូវបានផ្ញើដោយស្វ័យប្រវត្តិ',
  },
  zh: {
    recording: "{{name}}正在录音…",
    recordingVoice: "正在录音…",
    voice: "语音消息",
    voiceRetry: "点击播放收听",
    voiceFailed: "无法加载语音。",

    typing: '{{name}}正在输入…',
    members: '{{count}}位成员',
    you: '你',
    messageAs: '以{{name}}的身份发消息…',
    pause: '暂停并返回阅读',
    resume: '继续手机聊天',
    back: '返回阅读',
    title: '聊天故事',
    unknown: '未知',
    imageFailed: '无法加载图片。',
    authorNote: '作者的话',
    automatic: '消息自动发送',
  },
  ja: {
    recording: "{{name}}が音声を録音中…",
    recordingVoice: "音声を録音中…",
    voice: "音声メッセージ",
    voiceRetry: "再生を押して聴く",
    voiceFailed: "音声を読み込めませんでした。",

    typing: '{{name}}が入力中…',
    members: 'メンバー{{count}}人',
    you: 'あなた',
    messageAs: '{{name}}としてメッセージ…',
    pause: '一時停止して読書に戻る',
    resume: 'チャットを再開',
    back: '読書に戻る',
    title: 'チャットストーリー',
    unknown: '不明',
    imageFailed: '画像を読み込めませんでした。',
    authorNote: '作者ノート',
    automatic: 'メッセージは自動送信されます',
  },
  ko: {
    recording: "{{name}} 음성 녹음 중…",
    recordingVoice: "음성 녹음 중…",
    voice: "음성 메시지",
    voiceRetry: "재생을 눌러 들으세요",
    voiceFailed: "음성을 불러올 수 없습니다.",

    typing: '{{name}} 입력 중…',
    members: '멤버 {{count}}명',
    you: '나',
    messageAs: '{{name}}의 메시지…',
    pause: '일시 정지하고 읽기로 돌아가기',
    resume: '휴대폰 채팅 계속',
    back: '읽기로 돌아가기',
    title: '채팅 스토리',
    unknown: '알 수 없음',
    imageFailed: '이미지를 불러올 수 없습니다.',
    authorNote: '작가의 말',
    automatic: '메시지가 자동으로 전송됩니다',
  },
})

export function splitChatGraphemes(value) {
  const text = String(value || '')
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
      (part) => part.segment
    )
  }
  return Array.from(text).reduce((parts, point) => {
    if (
      parts.length &&
      /[\p{Mark}\u200D\uFE0F\p{Emoji_Modifier}]/u.test(point)
    ) {
      parts[parts.length - 1] += point
    } else if (parts.length && parts[parts.length - 1].endsWith('\u200D')) {
      parts[parts.length - 1] += point
    } else {
      parts.push(point)
    }
    return parts
  }, [])
}

export function chatEmojiCount(value) {
  const text = String(value || '').trim()
  if (!text) return 0
  const pattern =
    /(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*)/gu
  const found = text.match(pattern) || []
  return text.replace(pattern, '').replace(/\s/g, '') ? 0 : found.length
}

export function chatCharacterId(message) {
  return String(message?.character_id ?? message?.characterId ?? '')
}

export function createChatTiming(previous, next, delay = 2000) {
  const speed = Math.max(0.45, Math.min(2.5, (Number(delay) || 2000) / 2000))
  const previousLength = splitChatGraphemes(previous?.text).length
  const readTime =
    previous?.type === 'image' || previous?.type === 'sticker'
      ? 1200
      : chatEmojiCount(previous?.text)
        ? 550
        : Math.min(7000, 650 + previousLength * 38)
  const graphemes = splitChatGraphemes(next?.text)
  const canType =
    next?.type === 'chat' &&
    Boolean(chatCharacterId(next)) &&
    !chatEmojiCount(next?.text)
  const weights = graphemes.map((part) =>
    /[.!?។៕，。！？…]/u.test(part)
      ? 3.5
      : /[,;:៖;]/u.test(part)
        ? 2
        : /^\s+$/u.test(part)
          ? 0.5
          : 1
  )
  const totalWeight = weights.reduce((sum, value) => sum + value, 0)
  const seed = Array.from(
    String(next?.id ?? `${chatCharacterId(next)}:${next?.text || ''}`)
  ).reduce((sum, character) => (sum * 31 + character.codePointAt(0)) >>> 0, 7)
  const variation = 0.92 + (seed % 17) / 100
  const typing = canType
    ? Math.max(
        350,
        Math.min(9000, (450 + totalWeight * 58) * speed * variation)
      )
    : 0
  let cumulative = 0
  const thresholds = weights.map((weight) => {
    cumulative += weight
    return totalWeight ? cumulative / totalWeight : 1
  })
  return {
    reading: Math.round(readTime * speed),
    typing: Math.round(typing),
    graphemes,
    thresholds,
  }
}

function Portrait({ character, className = '' }) {
  const [failed, setFailed] = useState(false)
  const url = character?.avatar_url || ''
  useEffect(() => setFailed(false), [url])
  return (
    <span className={`cs-phone-portrait ${className}`} aria-hidden="true">
      {url && !failed ? (
        <img
          src={url}
          alt=""
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{String(character?.nickname || '?').slice(0, 1)}</span>
      )}
    </span>
  )
}

function GroupPortrait({ characters, coverUrl }) {
  const [failed, setFailed] = useState([])
  useEffect(() => setFailed([]), [characters, coverUrl])
  const portraits = characters
    .filter((character) => character?.avatar_url)
    .slice(0, 3)
  const images =
    portraits.length >= 2
      ? portraits.map((character) => character.avatar_url)
      : [coverUrl || portraits[0]?.avatar_url].filter(Boolean)
  return (
    <span className="cs-phone-group" aria-hidden="true">
      {images.length && !images.some((url) => failed.includes(url)) ? (
        images.map((url, index) => (
          <img
            key={`${url}-${index}`}
            src={url}
            alt=""
            decoding="async"
            onError={() => setFailed((current) => [...current, url])}
          />
        ))
      ) : coverUrl && !failed.includes(coverUrl) ? (
        <img
          src={coverUrl}
          alt=""
          onError={() => setFailed((current) => [...current, coverUrl])}
        />
      ) : (
        <span className="cs-phone-group-fallback">✦</span>
      )}
    </span>
  )
}

function Dots() {
  return (
    <span className="cs-phone-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function MessageImage({ message, t }) {
  const [failed, setFailed] = useState(false)
  const url = message.image_url || message.imageUrl || ''
  useEffect(() => setFailed(false), [url])
  if (failed)
    return (
      <span className="cs-phone-image-error">
        {t('chatStoryPhone.imageFailed')}
      </span>
    )
  return (
    <img
      className={
        message.type === 'sticker' ? 'cs-phone-sticker' : 'cs-phone-image'
      }
      src={url}
      alt={message.text || ''}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function PhoneMessage({
  message,
  previous,
  character,
  leadCharacterId,
  color,
  t,
  typing = false,
  voiceAutoPlay = false,
  voicePaused = false,
  onVoiceEnded,
  onVoiceBlocked,
  onVoiceError,
}) {
  const id = chatCharacterId(message)
  const right = Boolean(leadCharacterId) && id === String(leadCharacterId)
  const grouped =
    Boolean(id) &&
    id === chatCharacterId(previous) &&
    ['chat', 'image', 'sticker', 'audio', 'voice'].includes(previous?.type)
  if (message.type === 'aside' || message.type === 'author_note') {
    return (
      <div
        className={`cs-phone-aside ${message.type === 'author_note' ? 'cs-phone-note' : ''}`}
      >
        {message.type === 'author_note' ? (
          <strong>{t('chatStoryPhone.authorNote')}</strong>
        ) : null}
        <div>{message.text}</div>
      </div>
    )
  }
  const voice = isChatVoiceMessage(message)
  const image = message.type === 'image' || message.type === 'sticker'
  if (image && !id)
    return (
      <div className="cs-phone-center-image">
        <MessageImage message={message} t={t} />
      </div>
    )
  const emoji = !typing && chatEmojiCount(message.text)
  return (
    <div
      className={`cs-phone-message ${right ? 'cs-phone-right' : ''} ${grouped ? 'cs-phone-grouped' : ''}`}
    >
      {!right ? (
        grouped ? (
          <span className="cs-phone-avatar-space" />
        ) : (
          <Portrait character={character} />
        )
      ) : null}
      <div className="cs-phone-message-body">
        {!right && !grouped ? (
          <div className="cs-phone-name" style={{ color }}>
            {character?.nickname || t('chatStoryPhone.unknown')}
          </div>
        ) : null}
        <div
          className={
            typing
              ? 'cs-phone-bubble cs-phone-typing'
              : image || voice
                ? 'cs-phone-media'
                : emoji
                  ? `cs-phone-emoji ${emoji === 1 ? 'cs-phone-single-emoji' : ''}`
                  : 'cs-phone-bubble'
          }
        >
          {typing ? (
            <Dots />
          ) : voice ? (
            <ChatStoryVoice message={message} autoPlay={voiceAutoPlay} paused={voicePaused}
              onEnded={onVoiceEnded} onBlocked={onVoiceBlocked} onError={onVoiceError}
              label={t('chatStoryPhone.voice')} retryLabel={t('chatStoryPhone.voiceRetry')} errorLabel={t('chatStoryPhone.voiceFailed')} />
          ) : image ? (
            <MessageImage message={message} t={t} />
          ) : (
            message.text
          )}
        </div>
      </div>
    </div>
  )
}

const PHONE_THEMES = {
  white: {
    '--cs-bg': '#ffffff',
    '--cs-surface': '#ffffff',
    '--cs-soft': '#f1eef8',
    '--cs-text': '#24201b',
    '--cs-muted': '#756f85',
    '--cs-border': '#eae5f0',
  },
  paper: {
    '--cs-bg': '#efe7d8',
    '--cs-surface': '#fbf3e3',
    '--cs-soft': '#eadcc8',
    '--cs-text': '#2c241d',
    '--cs-muted': '#8a7460',
    '--cs-border': '#e5d3bb',
  },
  sepia: {
    '--cs-bg': '#e6d7b8',
    '--cs-surface': '#f1e2bf',
    '--cs-soft': '#dfcda7',
    '--cs-text': '#332719',
    '--cs-muted': '#7c6544',
    '--cs-border': '#d1bc91',
  },
  dark: {
    '--cs-bg': '#0f172a',
    '--cs-surface': '#111827',
    '--cs-soft': '#1f2937',
    '--cs-text': '#e5e7eb',
    '--cs-muted': '#b3b6c4',
    '--cs-border': '#263244',
  },
}

const PHONE_CSS = `
.cs-phone {
  --cs-bg: var(--shadow-bg-page);
  --cs-surface: var(--shadow-bg-surface);
  --cs-soft: var(--shadow-bg-soft);
  --cs-text: var(--shadow-text-primary);
  --cs-muted: var(--shadow-text-secondary);
  --cs-border: var(--shadow-border);
  position: fixed; inset: 0; z-index: 1000;
  height: 100vh; height: 100dvh;
  display: flex; flex-direction: column;
  background: var(--cs-bg); color: var(--cs-text);
  isolation: isolate; overflow: hidden;
  font-family: 'Noto Sans Khmer', system-ui, sans-serif;
}
.cs-phone *, .cs-phone *::before, .cs-phone *::after { box-sizing: border-box; }
.cs-phone button { font: inherit; cursor: pointer; }
.cs-phone button:focus-visible { outline: 2px solid var(--cs-accent); outline-offset: 3px; }
.cs-phone-header {
  flex: none; background: var(--cs-surface); border-bottom: 1px solid var(--cs-border);
  padding-top: env(safe-area-inset-top, 0px);
}
.cs-phone-header-inner { display: flex; align-items: center; gap: 11px; min-height: 72px; padding: 10px 14px; max-width: 760px; margin: auto; }
.cs-phone-icon { border: 0; padding: 0; background: transparent; color: var(--cs-accent); width: 42px; height: 42px; flex: none; display: grid; place-items: center; border-radius: 50%; }
.cs-phone-icon svg { width: 23px; height: 23px; }
.cs-phone-pause { border: 1px solid var(--cs-border); margin-left: auto; }
.cs-phone-group { width: 42px; height: 42px; border-radius: 50%; display: flex; overflow: hidden; flex: none; background: var(--cs-soft); }
.cs-phone-group img { min-width: 0; flex: 1 1 0; width: 0; height: 100%; object-fit: cover; border-right: 1px solid var(--cs-surface); }
.cs-phone-group img:last-child { border-right: 0; }
.cs-phone-group-fallback { margin: auto; color: var(--cs-accent); font-size: 24px; }
.cs-phone-heading { min-width: 0; flex: 1; }
.cs-phone-heading h2 { margin: 0; font: 650 16px/1.55 'Noto Sans Khmer', system-ui, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cs-phone-status { height: 21px; display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--cs-muted); min-width: 0; }
.cs-phone-status span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-phone-status-active { color: var(--cs-accent); }
.cs-phone-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; overflow-anchor: none; }
.cs-phone-messages { max-width: 720px; margin: 0 auto; padding: 20px 16px 24px; }
.cs-phone-message { display: flex; align-items: flex-start; gap: 8px; margin-top: 17px; }
.cs-phone-message:first-child { margin-top: 0; }
.cs-phone-grouped { margin-top: 4px; }
.cs-phone-right { justify-content: flex-end; }
.cs-phone-portrait { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: var(--cs-soft); color: var(--cs-accent); font-size: 14px; }
.cs-phone-portrait img { width: 100%; height: 100%; object-fit: cover; }
.cs-phone-avatar-space { width: 34px; flex: none; }
.cs-phone-message-body { min-width: 0; max-width: 79%; }
.cs-phone-right .cs-phone-message-body { max-width: 82%; }
.cs-phone-name { font-size: 11px; font-weight: 600; margin: 0 3px 4px; line-height: 1.6; }
.cs-phone-bubble { display: inline-block; background: var(--cs-soft); border-radius: var(--cs-radius) var(--cs-radius) var(--cs-radius) var(--cs-corner); border: var(--cs-bubble-border); box-shadow: var(--cs-bubble-shadow); padding: 9px 13px; font-size: var(--cs-font-size, 15px); line-height: var(--cs-line-height, 1.8); white-space: pre-wrap; overflow-wrap: anywhere; }
.cs-phone-right .cs-phone-bubble { background: linear-gradient(125deg, var(--cs-outgoing), var(--cs-outgoing-end)); color: var(--cs-outgoing-text, white); border-radius: var(--cs-radius) var(--cs-radius) var(--cs-corner) var(--cs-radius); }
.cs-phone-media { overflow: hidden; border-radius: 15px; }
.cs-phone-image { display: block; width: auto; max-width: 100%; max-height: 52dvh; object-fit: contain; border-radius: 15px; }
.cs-phone-sticker { display: block; width: auto; max-width: 160px; max-height: 180px; object-fit: contain; }
.cs-phone-image-error { display: block; padding: 24px 15px; color: var(--cs-muted); background: var(--cs-soft); font-size: 12px; }
.cs-phone-emoji { font-size: 40px; line-height: 1.35; overflow-wrap: anywhere; }
.cs-phone-single-emoji { font-size: 64px; }
.cs-phone-center-image { max-width: 480px; margin: 20px auto; }
.cs-phone-aside { margin: 22px auto; max-width: 90%; color: var(--cs-muted); text-align: center; white-space: pre-wrap; font-size: 13px; line-height: 1.9; }
.cs-phone-note { padding: 16px; background: var(--cs-soft); border-radius: 14px; }
.cs-phone-note strong { display: block; margin-bottom: 6px; font-size: 11px; font-weight: 600; }
.cs-phone-typing { min-width: 57px; padding: 13px 15px; }
.cs-phone-dots { display: inline-flex; gap: 4px; align-items: center; vertical-align: middle; height: 12px; }
.cs-phone-dots i { width: 5px; height: 5px; background: currentColor; border-radius: 50%; opacity: 0.55; animation: cs-phone-typing 1.15s infinite ease-in-out; }
.cs-phone-dots i:nth-child(2) { animation-delay: 0.15s; }
.cs-phone-dots i:nth-child(3) { animation-delay: 0.3s; }
.cs-phone-composer { flex: none; border-top: 1px solid var(--cs-border); background: var(--cs-surface); padding-bottom: env(safe-area-inset-bottom, 0px); }
.cs-phone-composer-inner { display: flex; align-items: center; gap: 10px; max-width: 760px; margin: auto; padding: 11px 16px; }
.cs-phone-input { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 44px; background: var(--cs-soft); border-radius: 24px; padding: 9px 10px 9px 15px; }
.cs-phone-draft { flex: 1; min-width: 0; max-height: 68px; overflow-y: auto; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 14px; line-height: 1.6; }
.cs-phone-placeholder { color: var(--cs-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.cs-phone-caret { display: inline-block; width: 2px; height: 1.1em; vertical-align: -0.15em; margin-left: 2px; background: var(--cs-accent); animation: cs-phone-caret 1s steps(2) infinite; }
.cs-phone-send { display: grid; place-items: center; flex: none; width: 30px; height: 30px; border-radius: 50%; background: var(--cs-outgoing); color: #fff; opacity: 0.35; }
.cs-phone-send-active { opacity: 1; }
.cs-phone-send svg { width: 17px; height: 17px; }
.cs-phone-dimmer { position: absolute; inset: 0; z-index: 2; background: black; pointer-events: none; }
@keyframes cs-phone-typing { 0%, 65%, 100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-3px); opacity: 1; } }
@keyframes cs-phone-caret { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .cs-phone-dots i, .cs-phone-caret { animation: none; } }
@media (max-width: 360px) { .cs-phone-header-inner { gap: 7px; padding-left: 8px; padding-right: 8px; } .cs-phone-icon { width: 36px; height: 36px; } .cs-phone-messages { padding-left: 10px; padding-right: 10px; } }
`

export default function ChatStoryPhoneView({
  storyTitle,
  coverUrl,
  characters,
  messages,
  leadCharacterId,
  typingMessage,
  draft,
  recordingMessage = null,
  recordingElapsed = 0,
  voicePlaybackIndex = -1,
  voicePaused = false,
  onVoiceEnded,
  onVoiceBlocked,
  onVoiceError,
  onPause,
  themeName,
  fontFamily,
  fontSize = 15,
  lineHeight = 1.8,
  brightnessOpacity = 0,
}) {
  const { t } = useDisplayTranslation()
  const chatTheme = useChatStoryTheme()
  const rootRef = useRef(null)
  const scrollRef = useRef(null)
  const messagesRef = useRef(null)
  const draftRef = useRef(null)
  const touchStartRef = useRef(null)
  const onPauseRef = useRef(onPause)
  onPauseRef.current = onPause
  const characterMap = useMemo(
    () =>
      new Map(characters.map((character) => [String(character.id), character])),
    [characters]
  )
  const lead = characterMap.get(String(leadCharacterId))
  const activeMessage = recordingMessage || typingMessage
  const typingCharacter = activeMessage
    ? characterMap.get(chatCharacterId(activeMessage))
    : null
  const displayName = typingCharacter?.nickname || t('chatStoryPhone.unknown')
  const leadName = lead?.nickname || t('chatStoryPhone.you')
  const colors = useMemo(
    () =>
      chatTheme.theme.group === 'dark'
        ? ['#c2a1ff', '#79cfc5', '#edbf80', '#f0a3bd', '#9dbafa']
        : ['#7952b3', '#237f7b', '#956321', '#b4466d', '#3c65b0'],
    [chatTheme.theme.group]
  )

  const messageRows = useMemo(
    () =>
      messages.map((message, index) => {
        const id = chatCharacterId(message)
        const colorIndex = Math.max(
          0,
          characters.findIndex((character) => String(character.id) === id)
        )
        return (
          <PhoneMessage
            key={`${message.id || 'message'}-${index}`}
            message={message}
            voiceAutoPlay={index === voicePlaybackIndex}
            voicePaused={voicePaused}
            onVoiceEnded={onVoiceEnded}
            onVoiceBlocked={onVoiceBlocked}
            onVoiceError={onVoiceError}
            previous={messages[index - 1]}
            character={characterMap.get(id)}
            leadCharacterId={leadCharacterId}
            color={colors[colorIndex % colors.length]}
            t={t}
          />
        )
      }),
    [messages, characters, characterMap, leadCharacterId, colors, t, voicePlaybackIndex, voicePaused, onVoiceEnded, onVoiceBlocked, onVoiceError]
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const previousFocus = document.activeElement
    const body = document.body
    const scrollY = window.scrollY
    const saved = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    const siblings = Array.from(body.children).filter(
      (node) =>
        node !== root &&
        !node.contains(root) &&
        !['SCRIPT', 'STYLE', 'LINK'].includes(node.tagName)
    )
    const inertStates = siblings.map((node) => ({
      node,
      inert: node.inert,
      hidden: node.getAttribute('aria-hidden'),
    }))
    inertStates.forEach(({ node }) => {
      node.inert = true
      node.setAttribute('aria-hidden', 'true')
    })
    root.querySelector('button')?.focus({ preventScroll: true })
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onPauseRef.current?.()
      }
      if (event.key === 'Tab') {
        const buttons = Array.from(
          root.querySelectorAll('button:not([disabled])')
        )
        const index = buttons.indexOf(document.activeElement)
        if (buttons.length) {
          event.preventDefault()
          buttons[
            (index + (event.shiftKey ? -1 : 1) + buttons.length) %
              buttons.length
          ].focus()
        }
      }
    }
    root.addEventListener('keydown', onKeyDown)
    return () => {
      root.removeEventListener('keydown', onKeyDown)
      Object.assign(body.style, saved)
      inertStates.forEach(({ node, inert, hidden }) => {
        node.inert = inert
        if (hidden === null) node.removeAttribute('aria-hidden')
        else node.setAttribute('aria-hidden', hidden)
      })
      window.scrollTo({ top: scrollY, behavior: 'instant' })
      if (previousFocus?.isConnected)
        previousFocus.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const scroll = scrollRef.current
    const content = messagesRef.current
    if (!scroll || !content) return undefined
    const moveToBottom = () => {
      scroll.scrollTop = scroll.scrollHeight
    }
    moveToBottom()
    const observer =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(moveToBottom)
        : null
    observer?.observe(content)
    content.addEventListener('load', moveToBottom, true)
    return () => {
      observer?.disconnect()
      content.removeEventListener('load', moveToBottom, true)
    }
  }, [
    messages.length,
    typingMessage?.id,
    typingMessage?.character_id,
    typingMessage?.characterId,
  ])

  useEffect(() => {
    if (draftRef.current)
      draftRef.current.scrollTop = draftRef.current.scrollHeight
  }, [draft])

  if (typeof document === 'undefined') return null
  return createPortal(
    <section
      ref={rootRef}
      className="cs-phone reader-page theme-preserve"
      role="dialog"
      aria-modal="true"
      aria-label={storyTitle || t('chatStoryPhone.title')}
      onDoubleClick={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      style={{
        ...PHONE_THEMES[themeName],
        ...chatTheme.style,
        backgroundImage: 'none',
        fontFamily,
        '--cs-font-size': `${fontSize}px`,
        '--cs-line-height': lineHeight,
      }}
    >
      <style>{PHONE_CSS}</style>
      <header className="cs-phone-header">
        <div className="cs-phone-header-inner">
          <button
            type="button"
            className="cs-phone-icon"
            onClick={onPause}
            aria-label={t('chatStoryPhone.back')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="m15 5-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <GroupPortrait characters={characters} coverUrl={coverUrl} />
          <div className="cs-phone-heading">
            <h2>{storyTitle || t('chatStoryPhone.title')}</h2>
            <div
              className={`cs-phone-status ${activeMessage ? 'cs-phone-status-active' : ''}`}
            >
              {recordingMessage ? <i className="fa-solid fa-microphone" aria-hidden="true" /> : typingMessage ? <Dots /> : null}
              <span>
                {recordingMessage
                  ? t('chatStoryPhone.recording', { name: displayName })
                  : typingMessage
                  ? t('chatStoryPhone.typing', { name: displayName })
                  : t('chatStoryPhone.members', { count: characters.length })}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="cs-phone-icon cs-phone-pause"
            onClick={onPause}
            aria-label={t('chatStoryPhone.pause')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              aria-hidden="true"
            >
              <path d="M9 6v12M15 6v12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>
      <div
        ref={scrollRef}
        className="cs-phone-scroll"
        style={{
          backgroundColor: chatTheme.theme.background,
          backgroundImage: chatTheme.style.backgroundImage,
          backgroundSize: chatTheme.style.backgroundSize,
          backgroundPosition: 'center',
          backgroundRepeat: chatTheme.style.backgroundRepeat,
        }}
        onWheel={(event) => {
          if (event.deltaY < -5) onPauseRef.current?.()
        }}
        onTouchStart={(event) => {
          touchStartRef.current = event.touches[0]?.clientY ?? null
        }}
        onTouchMove={(event) => {
          if (
            touchStartRef.current !== null &&
            (event.touches[0]?.clientY || 0) - touchStartRef.current > 18
          ) {
            touchStartRef.current = null
            onPauseRef.current?.()
          }
        }}
      >
        <div ref={messagesRef} className="cs-phone-messages">
          {messageRows}
          {typingMessage && !recordingMessage ? (
            <PhoneMessage
              message={typingMessage}
              previous={messages[messages.length - 1]}
              character={typingCharacter}
              leadCharacterId={leadCharacterId}
              color={
                colors[
                  Math.max(
                    0,
                    characters.findIndex(
                      (character) =>
                        String(character.id) === chatCharacterId(typingMessage)
                    )
                  ) % colors.length
                ]
              }
              t={t}
              typing
            />
          ) : null}
        </div>
      </div>
      <div
        className="cs-phone-composer"
        role="group"
        aria-label={t('chatStoryPhone.automatic')}
      >
        <div className="cs-phone-composer-inner">
          <Portrait character={lead} />
          <div className="cs-phone-input">
            {recordingMessage && chatCharacterId(recordingMessage) === String(leadCharacterId) ? (
              <ChatStoryRecording elapsed={recordingElapsed} label={t('chatStoryPhone.recordingVoice')} />
            ) : (
            <>
            <div
              ref={draftRef}
              className={
                draft ? 'cs-phone-draft' : 'cs-phone-draft cs-phone-placeholder'
              }
            >
              {draft || t('chatStoryPhone.messageAs', { name: leadName })}
              {typingMessage &&
              chatCharacterId(typingMessage) === String(leadCharacterId) ? (
                <span className="cs-phone-caret" aria-hidden="true" />
              ) : null}
            </div>
            <span
              className={`cs-phone-send ${draft ? 'cs-phone-send-active' : ''}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m3 3 19 9-19 9 4-8 9-1-9-1z" />
              </svg>
            </span>
            </>
            )}
          </div>
        </div>
      </div>
      {brightnessOpacity > 0 ? (
        <div
          className="cs-phone-dimmer"
          style={{ opacity: Math.min(0.35, Math.max(0, brightnessOpacity)) }}
        />
      ) : null}
    </section>,
    document.body
  )
}




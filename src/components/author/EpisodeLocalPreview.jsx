import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation, getDisplayLanguageId } from '../../utils/displayLanguage'

const TEXT = {
  en: { preview: 'Preview', devices: 'PC / Mobile', mobile: 'Mobile', pc: 'PC', close: 'Close preview', empty: 'No episode content yet', authorNote: 'Author Note', voice: 'Voice message', image: 'Image', episode: 'Episode' },
  km: { preview: 'មើលជាមុន', devices: 'PC / Mobile', mobile: 'Mobile', pc: 'PC', close: 'បិទការមើលជាមុន', empty: 'មិនទាន់មានខ្លឹមសារភាគទេ', authorNote: 'កំណត់ចំណាំអ្នកនិពន្ធ', voice: 'សារសំឡេង', image: 'រូបភាព', episode: 'ភាគ' },
  zh: { preview: '预览', devices: 'PC / Mobile', mobile: '手机', pc: '电脑', close: '关闭预览', empty: '暂无章节内容', authorNote: '作者备注', voice: '语音消息', image: '图片', episode: '章节' },
  ja: { preview: 'プレビュー', devices: 'PC / Mobile', mobile: 'モバイル', pc: 'PC', close: 'プレビューを閉じる', empty: 'エピソードの内容がありません', authorNote: '作者メモ', voice: '音声メッセージ', image: '画像', episode: 'エピソード' },
  ko: { preview: '미리보기', devices: 'PC / Mobile', mobile: '모바일', pc: 'PC', close: '미리보기 닫기', empty: '에피소드 내용이 없습니다', authorNote: '작가 메모', voice: '음성 메시지', image: '이미지', episode: '에피소드' },
}

function safeUrl(value, image = false) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (image && /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=\s]+$/i.test(raw)) return raw
  try {
    const url = new URL(raw, window.location.origin)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href
    if (image && url.protocol === 'blob:' && url.origin === window.location.origin) return url.href
  } catch {}
  return ''
}

function safeNovelHtml(value) {
  const source = String(value || '')
  if (!source.trim() || typeof DOMParser === 'undefined') return ''
  const input = new DOMParser().parseFromString(source, 'text/html')
  const output = document.implementation.createHTMLDocument('')
  const blocked = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'base', 'video', 'audio'])
  const allowed = new Set(['div', 'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'span', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'img', 'a', 'hr', 'sub', 'sup'])

  const clean = (node) => {
    if (node.nodeType === 3) return output.createTextNode(node.textContent || '')
    if (node.nodeType !== 1) return null
    const tag = node.tagName.toLowerCase()
    if (blocked.has(tag)) return null
    const element = output.createElement(allowed.has(tag) ? tag : 'span')

    if (tag === 'img') {
      const sourceUrl = safeUrl(node.getAttribute('src'), true)
      if (!sourceUrl) return null
      element.setAttribute('src', sourceUrl)
      element.setAttribute('alt', String(node.getAttribute('alt') || ''))
      element.setAttribute('loading', 'lazy')
      element.setAttribute('decoding', 'async')
    }
    if (tag === 'a') {
      const link = safeUrl(node.getAttribute('href'))
      if (link) {
        element.setAttribute('href', link)
        element.setAttribute('target', '_blank')
        element.setAttribute('rel', 'noopener noreferrer')
      }
    }
    const alignment = String(node.style?.textAlign || '').toLowerCase()
    if (['left', 'center', 'right', 'justify'].includes(alignment)) element.style.textAlign = alignment
    if (node.style?.fontWeight === 'bold' || /^(?:[6-9]00)$/.test(node.style?.fontWeight || '')) element.style.fontWeight = 'bold'
    if (node.style?.fontStyle === 'italic') element.style.fontStyle = 'italic'
    if (node.style?.textDecorationLine === 'underline') element.style.textDecoration = 'underline'
    if (tag !== 'img') Array.from(node.childNodes).forEach((child) => {
      const safeChild = clean(child)
      if (safeChild) element.appendChild(safeChild)
    })
    return element
  }

  const container = output.createElement('div')
  Array.from(input.body.childNodes).forEach((node) => {
    const safeNode = clean(node)
    if (safeNode) container.appendChild(safeNode)
  })
  return container.innerHTML
}

function resolveAvatar(character) {
  return safeUrl(character?.avatar_url || character?.avatarUrl || character?.image_url || character?.imageUrl, true)
}

function ChatMessage({ message, characters, labels }) {
  const character = characters.find((item) => String(item.id) === String(message.characterId || message.character_id))
  const type = String(message.type || 'chat')
  const text = String(message.text || '')
  const media = safeUrl(message.imageUrl || message.image_url, true)
  const avatar = resolveAvatar(character)
  const right = character?.position === 'right' || character?.side === 'right'

  if (type === 'author_note') {
    return <div className="mx-auto my-4 max-w-[92%] rounded-2xl bg-amber-50 px-4 py-3 text-center text-[13px] leading-6 text-amber-900"><div className="mb-1 text-[11px] font-bold">{labels.authorNote}</div><span className="whitespace-pre-wrap break-words">{text}</span></div>
  }

  return (
    <div className={`flex items-start gap-2 ${right ? 'flex-row-reverse' : ''}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f2e9ff] text-[13px] font-bold text-[#7556a8]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" loading="lazy" /> : String(character?.name || '?').slice(0, 1)}
      </div>
      <div className={`min-w-0 max-w-[78%] ${right ? 'text-right' : ''}`}>
        <div className="mb-1 text-[11px] font-semibold text-gray-500">{character?.name || ''}</div>
        {media && ['image', 'sticker', 'notification'].includes(type) ? <img src={media} alt={labels.image} loading="lazy" className="max-h-[460px] max-w-full rounded-2xl object-contain" /> : null}
        {['audio', 'voice'].includes(type) ? <div className="rounded-2xl bg-[#f4eefd] px-4 py-3 text-[13px] text-gray-700">♫ {labels.voice}</div> : null}
        {text ? <div className={`inline-block max-w-full whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-left text-[14px] leading-6 ${right ? 'bg-[#ffe8ef]' : 'bg-[#f3f4f6]'} text-[#252530]`}>{text}</div> : null}
      </div>
    </div>
  )
}

export function EpisodePreviewRow({ onClick, disabled = false }) {
  useDisplayTranslation()
  const labels = TEXT[getDisplayLanguageId()] || TEXT.en
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="flex w-full items-center justify-between gap-4 py-3 text-left disabled:opacity-50" aria-label={labels.preview}>
      <span className="text-[12px] font-normal text-[var(--shadow-text-primary)]">{labels.preview}</span>
      <span className="flex items-center gap-3 text-[12px] text-[var(--shadow-text-secondary)]">{labels.devices}<i className="fa-solid fa-chevron-right text-[10px] text-[var(--shadow-text-tertiary)]" /></span>
    </button>
  )
}

export default function EpisodeLocalPreview({ open, onClose, storyType = 'novel', episodeTitle = '', content = '', pages = [], messages = [], characters = [] }) {
  useDisplayTranslation()
  const [device, setDevice] = useState('mobile')
  const labels = TEXT[getDisplayLanguageId()] || TEXT.en
  const isManga = storyType === 'manga'
  const isChatStory = storyType === 'chat_story'
  const html = useMemo(() => safeNovelHtml(content), [content])
  const images = useMemo(() => (Array.isArray(pages) ? pages : []).map((page) => safeUrl(typeof page === 'string' ? page : page?.previewUrl || page?.imageUrl || page?.image_url || page?.url, true)).filter(Boolean), [pages])
  const chatMessages = Array.isArray(messages) ? messages : []
  const chatCharacters = Array.isArray(characters) ? characters : []

  useEffect(() => {
    if (!open) return undefined
    const priorBodyOverflow = document.body.style.overflow
    const priorHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = priorBodyOverflow
      document.documentElement.style.overflow = priorHtmlOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex flex-col bg-[var(--shadow-bg-page)]" role="dialog" aria-modal="true" aria-label={labels.preview}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)]" aria-label={labels.close}><i className="fa-solid fa-arrow-left" /></button>
        <div className="text-center text-[14px] font-bold text-[var(--shadow-text-primary)]">{labels.preview}</div>
        <div className="w-10" />
      </div>
      <div className="flex shrink-0 justify-center gap-1 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
        {['mobile', 'pc'].map((option) => (
          <button key={option} type="button" onClick={() => setDevice(option)} className={`flex min-w-[116px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold ${device === option ? 'bg-[#ff4f73] text-white' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'}`} aria-pressed={device === option}>
            <i className={`fa-solid ${option === 'mobile' ? 'fa-mobile-screen' : 'fa-desktop'}`} />{labels[option]}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 sm:px-6">
        <div className={`mx-auto overflow-hidden bg-white text-[#22232a] shadow-lg ${device === 'mobile' ? 'max-w-[430px] rounded-[24px] border border-[#e5e7eb]' : 'max-w-[980px] rounded-xl border border-[#e5e7eb]'}`}>
          {device === 'pc' ? <div className="flex h-9 items-center gap-1.5 border-b border-gray-200 bg-[#f7f7f8] px-4"><span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ffce55]" /><span className="h-2.5 w-2.5 rounded-full bg-[#55c787]" /></div> : null}
          <div className={`mx-auto min-h-[65vh] ${device === 'mobile' ? 'px-4 py-7' : 'max-w-[740px] px-6 py-10 sm:px-10'}`}>
            <h1 className="mb-6 break-words text-center text-[19px] font-bold leading-8">{episodeTitle || labels.episode}</h1>
            {isManga ? (
              images.length ? <div className="space-y-0">{images.map((src, index) => <img key={`${index}-${src.slice(0,40)}`} src={src} alt={`${labels.image} ${index + 1}`} loading="lazy" decoding="async" className="block h-auto w-full object-contain" />)}</div> : <p className="py-16 text-center text-[13px] text-gray-400">{labels.empty}</p>
            ) : isChatStory ? (
              chatMessages.length ? <div className="space-y-4">{chatMessages.map((message, index) => <ChatMessage key={message.id || index} message={message} characters={chatCharacters} labels={labels} />)}</div> : <p className="py-16 text-center text-[13px] text-gray-400">{labels.empty}</p>
            ) : html ? (
              <article className="episode-local-preview-novel break-words text-[15px] leading-[1.95] [&_p]:mb-5 [&_div]:mb-4 [&_img]:mx-auto [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3" dangerouslySetInnerHTML={{ __html: html }} />
            ) : <p className="py-16 text-center text-[13px] text-gray-400">{labels.empty}</p>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

import { Check, EllipsisVertical, Forward, Pin } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'

function formatMessageTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(getDisplayLanguageId(), { hour: 'numeric', minute: '2-digit' }).format(date)
}

export default function SharedChatMessageBubble({
  message,
  selected,
  selectionMode,
  highlighted,
  isPinned,
  isRead,
  setMessageRef,
  onOpenMenu,
  onToggleSelection,
  onJumpToReply,
  appearanceEnabled = false,
  appearanceExtended = false,
  variant = 'reader',
  labels,
  media,
}) {
  const { t } = useDisplayTranslation()
  const label = (key, params) => labels?.[key] ?? t(`chatRoomPage.${key}`, params)
  const support = variant === 'support'
  const longPressTimerRef = useRef(null)
  const pointerStartRef = useRef(null)
  useEffect(() => () => window.clearTimeout(longPressTimerRef.current), [])

  const clearLongPress = () => {
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
    pointerStartRef.current = null
  }

  const handlePointerDown = event => {
    if (message.is_deleted || event.pointerType !== 'touch' || event.target.closest?.('button, a')) return
    clearLongPress()
    const { clientX, clientY } = event
    pointerStartRef.current = { x: clientX, y: clientY }
    longPressTimerRef.current = window.setTimeout(() => {
      onOpenMenu?.(message, clientX, clientY)
      longPressTimerRef.current = null
    }, 550)
  }
  const handlePointerMove = event => {
    const start = pointerStartRef.current
    if (start && (Math.abs(event.clientX - start.x) > 12 || Math.abs(event.clientY - start.y) > 12)) clearLongPress()
  }
  const handleContextMenu = event => {
    if (message.is_deleted) return
    event.preventDefault()
    clearLongPress()
    onOpenMenu?.(message, event.clientX, event.clientY)
  }
  const mine = message.is_mine
  const senderName = message.reply_to?.sender?.name || label('message')
  const bubbleColor = mine
    ? support ? 'rounded-br-[6px] bg-[#FFF4D9] text-[#28211C] ring-1 ring-[#F6DB98]' : 'rounded-br-[6px] bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white'
    : support ? 'rounded-bl-[6px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]' : 'rounded-bl-[6px] bg-white text-[#24242c]'
  const metaColor = mine && !message.is_deleted ? support ? 'text-[#8C7352]' : 'text-white/75' : support ? 'text-[var(--shadow-text-tertiary)]' : 'text-[#9b9ba4]'
  const replyColor = support ? (mine ? 'border-amber-500 bg-white/60' : 'border-amber-500 bg-[var(--shadow-bg-soft)]') : (mine ? 'border-white/70 bg-white/15' : 'border-[#7c3aed] bg-[#f5f1ff]')
  const replyName = support ? 'text-[#9A6700]' : mine ? 'text-white/85' : 'text-[#7552c6]'
  const replyText = support ? 'opacity-75' : mine ? 'text-white/70' : 'text-[#6f6b78]'

  return (
    <div
      ref={node => setMessageRef?.(message.id, node)}
      data-message-id={message.id}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onClick={() => { if (selectionMode && !message.is_deleted) onToggleSelection?.(message.id) }}
      className={`group flex scroll-mt-[150px] rounded-[16px] px-1 py-0.5 transition ${mine ? 'justify-end' : 'justify-start'} ${selectionMode && !message.is_deleted ? 'cursor-pointer' : ''} ${selected ? (support ? 'bg-amber-100' : 'bg-[#e9e0ff]') : highlighted ? 'bg-[#fff0a8]' : ''}`}
    >
      <div className={`flex max-w-[88%] items-center gap-1.5 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
        {!message.is_deleted && (
          <button
            type="button"
            onClick={event => {
              event.stopPropagation()
              const rect = event.currentTarget.getBoundingClientRect()
              onOpenMenu?.(message, mine ? rect.left - 220 : rect.right + 4, rect.top)
            }}
            aria-label={label('messageOptions')}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8c8c96] transition hover:bg-white active:scale-90 group-hover:opacity-100 focus:opacity-100 ${support ? 'opacity-70 sm:opacity-0' : 'opacity-0'}`}
          >
            <EllipsisVertical size={17} />
          </button>
        )}
        <div
          data-chat-bubble={message.is_deleted ? 'deleted' : mine ? 'outgoing' : 'incoming'}
          data-side={mine ? 'right' : 'left'}
          className={`min-w-0 max-w-full rounded-[20px] px-4 py-2.5 shadow-sm ${appearanceEnabled && appearanceExtended && !message.is_deleted ? 'cs-style-bubble' : ''} ${bubbleColor} ${message.is_deleted ? 'border border-[#e4e4e8] bg-[#f2f2f4] text-[#8e8e97] shadow-none' : ''}`}
        >
          {message.is_forwarded && (
            <p className={`mb-1 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide ${support ? 'text-[#9A6700]' : mine ? 'text-white/70' : 'text-[#7b5bc5]'}`}>
              <Forward size={11} />
              {label('forwarded')}
              {message.forwarded_from?.name ? ` ${label('fromPerson', { name: message.forwarded_from.name })}` : ''}
            </p>
          )}
          {message.reply_to_message_id && (
            <button type="button" onClick={event => { event.stopPropagation(); onJumpToReply?.(message.reply_to_message_id) }} className={`mb-2 block w-full rounded-[10px] border-l-[3px] px-2.5 py-2 text-left ${replyColor}`}>
              <span className={`block truncate text-[9px] font-extrabold ${replyName}`}>{senderName}</span>
              <span className={`mt-0.5 block truncate text-[10px] font-semibold ${replyText}`}>
                {message.reply_to?.is_deleted ? label('originalUnavailable') : message.reply_to?.body || label('originalMessage')}
              </span>
            </button>
          )}
          <p className={`whitespace-pre-wrap break-words text-[13px] leading-5 ${message.is_deleted ? 'italic' : ''}`}>
            {message.is_deleted ? label('messageDeleted') : message.body}
          </p>
          {!message.is_deleted && media}
          <div className={`mt-1 flex items-center justify-end gap-1.5 text-[9px] font-semibold ${metaColor}`}>
            {isPinned && <Pin size={10} />}
            {message.edited_at && <span>{label('edited')}</span>}
            <span>{formatMessageTime(message.created_at)}</span>
            {mine && !message.is_deleted && (
              <span className={support && isRead ? 'text-green-600' : undefined} aria-label={label(isRead ? 'read' : 'sentStatus')}>
                {isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
        {selectionMode && !message.is_deleted && (
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? (support ? 'border-amber-500 bg-amber-500 text-white' : 'border-[#7c3aed] bg-[#7c3aed] text-white') : 'border-[#bbb9c2] bg-white text-transparent'}`}>
            <Check size={13} />
          </span>
        )}
      </div>
    </div>
  )
}

import { Camera, Check, Image, LoaderCircle, Search, Send, Smile } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

export default function SharedChatComposer({
  textareaRef,
  text = '',
  onChange,
  onKeyDown,
  canSend,
  sending,
  editing,
  placeholder,
  fontFamily,
  onSend,
  onCamera,
  onGallery,
  onEmoji,
  onSearch,
  onComingSoon,
  variant = 'reader',
  labels,
}) {
  const { t } = useDisplayTranslation()
  const label = key => labels?.[key] ?? t(`chatRoomPage.${key}`)
  const support = variant === 'support'
  const hasText = Boolean(text.trim())
  const disabled = !canSend || sending
  const accent = support
    ? 'bg-gradient-to-r from-[#D19A36] to-[#E9AD4B] text-white'
    : 'bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white'
  const sendAccent = support
    ? accent
    : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white'
  const iconColor = support ? 'text-[var(--shadow-text-primary)]' : 'text-[#111827]'
  const inputClass = support
    ? 'border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] text-[var(--shadow-text-primary)] focus:border-[#D19A36]'
    : 'border-[#dedee4] bg-[#f7f7f9] text-[#111827] focus:border-[#9b7be8] focus:bg-white'

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={event => onChange(event.target.value.slice(0, 2000))}
        onKeyDown={onKeyDown}
        disabled={disabled}
        rows={1}
        placeholder={placeholder}
        style={{ fontFamily }}
        className={`block max-h-[124px] min-h-[46px] w-full resize-none overflow-y-hidden rounded-[24px] border py-[12px] pl-[52px] pr-[52px] text-[13px] leading-5 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${inputClass}`}
      />
      <button
        type="button"
        onClick={hasText ? (onSearch || onComingSoon) : (onCamera || onComingSoon)}
        disabled={disabled}
        aria-label={label(hasText ? 'searchMessages' : 'camera')}
        className={`absolute inset-y-0 left-[7px] my-auto flex h-8 w-8 items-center justify-center rounded-full transition active:scale-90 disabled:opacity-45 ${accent}`}
      >
        {hasText ? <Search size={19} /> : <Camera size={20} />}
      </button>
      {!hasText && (
        <button
          type="button"
          onClick={onGallery || onComingSoon}
          disabled={disabled}
          aria-label={label('image')}
          className={`absolute inset-y-0 right-[39px] my-auto flex h-8 w-8 items-center justify-center bg-transparent transition active:scale-90 disabled:opacity-45 ${iconColor}`}
        >
          <Image size={20} />
        </button>
      )}
      <button
        type="button"
        onClick={hasText ? onSend : (onEmoji || onComingSoon)}
        disabled={disabled}
        aria-label={label(hasText ? (editing ? 'saveEdit' : 'sendMessage') : 'emoji')}
        className={`absolute inset-y-0 right-[7px] my-auto flex h-8 w-8 items-center justify-center transition active:scale-90 disabled:opacity-45 ${hasText ? `rounded-full ${sendAccent}` : `bg-transparent ${iconColor}`}`}
      >
        {sending ? <LoaderCircle size={19} className="animate-spin" /> : hasText ? (editing ? <Check size={20} /> : <Send size={19} strokeWidth={2.2} />) : <Smile size={20} />}
      </button>
    </div>
  )
}

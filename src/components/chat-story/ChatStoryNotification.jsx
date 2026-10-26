import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const CHAT_NOTIFICATION_DEFAULTS = Object.freeze({
  dismissMode: 'duration',
  durationSeconds: 4,
  swipeToDismiss: true,
  maxVisible: 2,
})

const validDismissModes = new Set(['duration', 'swipe', 'next'])

const limitedNumber = (value, fallback, low, high) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(high, Math.max(low, Math.round(number))) : fallback
}

export function normalizeChatNotification(value = {}) {
  const source = value && typeof value === 'object' ? value : {}
  const settings = source.notification && typeof source.notification === 'object'
    ? source.notification
    : source
  const dismissMode = validDismissModes.has(settings.dismissMode)
    ? settings.dismissMode
    : CHAT_NOTIFICATION_DEFAULTS.dismissMode

  return {
    characterId: String(source.characterId || source.character_id || ''),
    text: String(source.text || '').slice(0, 500),
    imageUrl: String(source.imageUrl || source.image_url || ''),
    dismissMode,
    durationSeconds: limitedNumber(settings.durationSeconds, 4, 1, 30),
    swipeToDismiss: dismissMode === 'swipe' ? true : settings.swipeToDismiss !== false,
  }
}

const characterLabel = (character) => String(
  character?.nickname || character?.name || character?.display_name || 'Unknown'
)

const characterImage = (character) => String(
  character?.image || character?.avatar_url || character?.avatarUrl || ''
)

function NotificationAvatar({ character, onClick, size = 43 }) {
  const source = characterImage(character)
  const label = characterLabel(character)
  const style = { width: size, height: size }
  const content = source ? (
    <img src={source} alt={label} className="h-full w-full object-cover" draggable={false} />
  ) : (
    <span className="flex h-full w-full items-center justify-center bg-[#dedaf3] text-[16px] font-semibold text-[#6448af]">
      {label.charAt(0).toUpperCase()}
    </span>
  )

  if (!onClick) {
    return <span style={style} className="inline-flex shrink-0 overflow-hidden rounded-full">{content}</span>
  }

  return (
    <button type="button" onClick={onClick} style={style}
      className="inline-flex shrink-0 overflow-hidden rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6b4cc9]"
      aria-label={`View ${label} image`}>
      {content}
    </button>
  )
}

function NotificationCard({ item, character, onDismiss, onImageOpen, paused }) {
  const startY = useRef(null)
  const swiped = useRef(false)
  const { dismissMode, durationSeconds, swipeToDismiss } = item

  useEffect(() => {
    if (paused || dismissMode !== 'duration') return undefined
    const timer = window.setTimeout(() => onDismiss(item.eventId), durationSeconds * 1000)
    return () => window.clearTimeout(timer)
  }, [paused, dismissMode, durationSeconds, item.eventId, onDismiss])

  const finishSwipe = (pageY) => {
    if (startY.current === null) return
    const offset = pageY - startY.current
    startY.current = null
    if ((swipeToDismiss || dismissMode === 'swipe') && offset < -38) {
      swiped.current = true
      onDismiss(item.eventId)
      window.setTimeout(() => { swiped.current = false }, 0)
    }
  }

  const openImage = (url) => {
    if (swiped.current || !url) return
    onImageOpen(url)
  }

  return (
    <section
      aria-label={`Notification from ${characterLabel(character)}`}
      onTouchStart={(event) => { startY.current = event.touches[0]?.clientY ?? null }}
      onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientY ?? 0)}
      onTouchCancel={() => { startY.current = null }}
      onMouseDown={(event) => { startY.current = event.clientY }}
      onMouseUp={(event) => finishSwipe(event.clientY)}
      className="animate-[csNotificationEnter_240ms_ease-out_both] overflow-hidden rounded-[20px] border border-white/70 bg-[rgba(247,249,253,0.94)] text-[#141522] shadow-[0_8px_28px_rgba(15,23,42,0.24)] backdrop-blur-2xl"
      style={{ touchAction: 'pan-x' }}
    >
      <div className="flex items-center gap-2.5 px-3.5 pb-3 pt-2.5">
        <NotificationAvatar character={character} onClick={() => openImage(characterImage(character))} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <strong className="truncate text-[13px] font-semibold leading-5">{characterLabel(character)}</strong>
            <span className="shrink-0 text-[11px] text-[#8991a3]">now</span>
          </div>
          <div className="mt-0.5 whitespace-pre-wrap break-words text-[12px] leading-[18px] text-[#303343] [overflow-wrap:anywhere]">
            {item.text}
          </div>
        </div>
        {item.imageUrl ? (
          <button type="button" aria-label="View notification image" onClick={() => openImage(item.imageUrl)}
            className="h-12 w-12 shrink-0 overflow-hidden rounded-[9px] bg-[#e6e8f0]">
            <img src={item.imageUrl} alt="Notification attachment" className="h-full w-full object-cover" draggable={false} />
          </button>
        ) : null}
      </div>
    </section>
  )
}

export function ChatStoryNotificationOverlay({
  notification,
  characters = [],
  maxVisible = 2,
  scopeId = '',
  onPauseAutoChange,
  onDismiss,
}) {
  const [items, setItems] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const lastTrigger = useRef(null)
  const previewRef = useRef(false)
  const pauseCallbackRef = useRef(onPauseAutoChange)
  const dismissCallbackRef = useRef(onDismiss)
  pauseCallbackRef.current = onPauseAutoChange
  dismissCallbackRef.current = onDismiss
  const currentNotification = useRef(notification)
  currentNotification.current = notification
  const limit = limitedNumber(maxVisible, 2, 1, 3)
  const trigger = notification?.eventId ?? notification?.triggerId ?? notification?.id ?? null

  useEffect(() => {
    setItems([])
    lastTrigger.current = null
  }, [scopeId])

  useEffect(() => {
    if (trigger === null || trigger === lastTrigger.current) return
    lastTrigger.current = trigger
    const source = currentNotification.current
    const next = { ...normalizeChatNotification(source), eventId: String(trigger) }
    if (!next.text.trim() || !next.characterId) return
    setItems((previous) => [
      ...previous.filter((item) => item.dismissMode !== 'next' && item.eventId !== next.eventId),
      next,
    ].slice(-limit))
  }, [trigger, limit])

  useEffect(() => {
    setItems((previous) => previous.length > limit ? previous.slice(-limit) : previous)
  }, [limit])

  useEffect(() => () => {
    if (previewRef.current) pauseCallbackRef.current?.(false)
  }, [])

  const closePreview = useCallback(() => {
    if (!previewRef.current) return
    previewRef.current = false
    setPreviewUrl('')
    pauseCallbackRef.current?.(false)
  }, [])

  const openPreview = useCallback((url) => {
    if (!url) return
    previewRef.current = true
    setPreviewUrl(url)
    pauseCallbackRef.current?.(true)
  }, [])

  const dismiss = useCallback((eventId) => {
    setItems((previous) => previous.filter((item) => item.eventId !== eventId))
    dismissCallbackRef.current?.(eventId)
  }, [])

  const characterMap = useMemo(() => new Map(
    characters.map((character) => [String(character.id), character])
  ), [characters])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      {items.length ? (
        <div className="pointer-events-none fixed inset-x-2 z-[9998] mx-auto flex max-w-[480px] flex-col gap-2"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 5px)' }} aria-live="polite">
          {items.map((item) => (
            <div key={item.eventId} className="pointer-events-auto">
              <NotificationCard item={item} character={characterMap.get(item.characterId)}
                onDismiss={dismiss} onImageOpen={openPreview} paused={Boolean(previewUrl)} />
            </div>
          ))}
        </div>
      ) : null}
      {previewUrl ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4"
          role="dialog" aria-modal="true" aria-label="Notification image preview" onClick={closePreview}>
          <button type="button" onClick={closePreview} aria-label="Close image"
            className="absolute right-4 top-[max(18px,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full bg-white/20 text-2xl text-white">×</button>
          <img src={previewUrl} alt="Enlarged notification" onClick={(event) => event.stopPropagation()}
            className="max-h-[85dvh] max-w-full rounded-lg object-contain" draggable={false} />
        </div>
      ) : null}
      <style>{'@keyframes csNotificationEnter{from{opacity:0;transform:translateY(-115%)}to{opacity:1;transform:translateY(0)}}'}</style>
    </>,
    document.body
  )
}

export function ChatStoryNotificationSettings({
  open,
  characters = [],
  value,
  maxVisible = 2,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => normalizeChatNotification(value))
  const [maximum, setMaximum] = useState(() => limitedNumber(maxVisible, 2, 1, 3))
  const [previewSequence, setPreviewSequence] = useState(0)

  useEffect(() => {
    if (!open) return
    setForm(normalizeChatNotification(value))
    setMaximum(limitedNumber(maxVisible, 2, 1, 3))
    setPreviewSequence(0)
  }, [open])

  const selected = characters.find((character) => String(character.id) === form.characterId)
  const set = (name, nextValue) => setForm((current) => ({ ...current, [name]: nextValue }))
  const valid = Boolean(form.characterId && form.text.trim())

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[9997] flex items-end justify-center bg-black/60 px-2 pt-8 sm:items-center sm:px-4"
      onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label="Notification Settings"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[25px] bg-[var(--shadow-bg-surface,#fff)] text-[var(--shadow-text-primary,#111827)] shadow-2xl sm:rounded-[25px]">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--shadow-border,#e5e7eb)] px-5 py-4">
          <h2 className="text-[18px] font-bold">Notification Settings</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[24px] leading-none">×</button>
        </div>
        <div className="space-y-5 overflow-y-auto px-5 py-5">
          <label className="block space-y-1.5 text-[13px] font-semibold">
            <span>Character</span>
            <select value={form.characterId} onChange={(event) => set('characterId', event.target.value)}
              className="h-12 w-full rounded-[12px] border border-[var(--shadow-border,#dedee5)] bg-[var(--shadow-bg-soft,#f8f8fa)] px-3 text-[14px]">
              <option value="">Choose a character</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>{characterLabel(character)}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5 text-[13px] font-semibold">
            <span>Notification message</span>
            <textarea rows={3} maxLength={500} value={form.text} onChange={(event) => set('text', event.target.value)}
              placeholder="Write your notification..."
              className="w-full resize-none rounded-[12px] border border-[var(--shadow-border,#dedee5)] bg-[var(--shadow-bg-soft,#f8f8fa)] p-3 text-[14px] outline-none focus:border-[#8b5cf6]" />
          </label>
          <div className="space-y-2">
            <p className="text-[13px] font-semibold">Live preview</p>
            <div className="rounded-[17px] border border-[#e9eaf0] bg-[#f2f5fa] p-3 text-[#171827] shadow-sm">
              <div className="flex items-center gap-3">
                <NotificationAvatar character={selected} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{selected ? characterLabel(selected) : 'Character'}</p>
                  <p className="whitespace-pre-wrap break-words text-[12px] text-[#404451]">{form.text || 'Notification message'}</p>
                </div>
                <span className="self-start text-[10px] text-[#8991a3]">now</span>
              </div>
            </div>
          </div>
          <fieldset className="space-y-3">
            <legend className="text-[13px] font-semibold">Dismiss behavior</legend>
            {[
              ['duration', 'Auto dismiss after'],
              ['swipe', 'Stay until reader swipes away'],
              ['next', 'Dismiss when next notification appears'],
            ].map(([mode, title]) => (
              <label key={mode} className="flex items-center gap-3 text-[13px]">
                <input type="radio" name="cs-notification-dismiss" checked={form.dismissMode === mode}
                  onChange={() => set('dismissMode', mode)} className="accent-[#7c3aed]" />
                <span>{title}</span>
                {mode === 'duration' && form.dismissMode === 'duration' ? (
                  <input aria-label="Duration seconds" type="number" min="1" max="30"
                    value={form.durationSeconds} onChange={(event) => set('durationSeconds', limitedNumber(event.target.value, 4, 1, 30))}
                    className="ml-auto w-[60px] rounded-lg border border-[var(--shadow-border,#ddd)] bg-transparent px-2 py-1 text-center" />
                ) : null}
                {mode === 'duration' && form.dismissMode === 'duration' ? <span>s</span> : null}
              </label>
            ))}
          </fieldset>
          <div className="space-y-2">
            <p className="text-[13px] font-semibold">Max visible notifications · Episode setting</p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((number) => (
                <button type="button" key={number} onClick={() => setMaximum(number)}
                  className={`rounded-xl border py-2.5 text-[14px] font-semibold ${number === maximum
                    ? 'border-[#7c3aed] bg-[#f0eaff] text-[#6d28d9]'
                    : 'border-[var(--shadow-border,#e5e7eb)]'}`}>{number}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-4 text-[13px] font-semibold">
            <span>Swipe to dismiss</span>
            <input type="checkbox" checked={form.dismissMode === 'swipe' || form.swipeToDismiss}
              disabled={form.dismissMode === 'swipe'} onChange={(event) => set('swipeToDismiss', event.target.checked)}
              className="h-5 w-5 accent-[#7c3aed]" />
          </label>
          <button type="button" disabled={!valid} onClick={() => setPreviewSequence((number) => number + 1)}
            className="w-full rounded-xl border border-[#a78bfa] py-2.5 text-[13px] font-semibold text-[#7c3aed] disabled:opacity-40">
            Test notification on screen
          </button>
        </div>
        <div className="flex shrink-0 gap-3 border-t border-[var(--shadow-border,#e5e7eb)] p-4">
          <button type="button" onClick={onClose}
            className="h-11 flex-1 rounded-[12px] bg-[var(--shadow-bg-soft,#f3f4f6)] text-[14px] font-semibold">Cancel</button>
          <button type="button" disabled={!valid} onClick={() => onSave?.({
            ...form,
            text: form.text.trim(),
            durationSeconds: limitedNumber(form.durationSeconds, 4, 1, 30),
          }, maximum)}
            className="h-11 flex-1 rounded-[12px] bg-[#7c3aed] text-[14px] font-semibold text-white disabled:opacity-40">Save</button>
        </div>
      </section>
      <ChatStoryNotificationOverlay
        notification={previewSequence > 0 && valid ? { ...form, eventId: `preview-${previewSequence}` } : null}
        characters={characters}
        maxVisible={maximum}
        scopeId="author-notification-preview"
      />
    </div>,
    document.body
  )
}

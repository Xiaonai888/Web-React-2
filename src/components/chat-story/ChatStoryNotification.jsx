import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { optimizeImageForUpload } from '../../utils/imageUploadOptimizer'
import { uploadMediaWithFallback } from '../../utils/uploadMediaWithFallback'

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
  const requestedMode = settings.dismissMode ?? settings.dismiss_mode
  const dismissMode = validDismissModes.has(requestedMode)
    ? requestedMode
    : CHAT_NOTIFICATION_DEFAULTS.dismissMode

  return {
    characterId: String(source.characterId || source.character_id || ''),
    text: String(source.text || '').slice(0, 500),
    imageUrl: String(source.imageUrl || source.image_url || ''),
    dismissMode,
    durationSeconds: limitedNumber(settings.durationSeconds ?? settings.duration_seconds, 4, 1, 30),
    swipeToDismiss: dismissMode === 'swipe' || (settings.swipeToDismiss !== false && settings.swipe_to_dismiss !== false),
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
    if (previewRef.current) {
      previewRef.current = false
      setPreviewUrl('')
      pauseCallbackRef.current?.(false)
    }
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

function NotificationCharacterOption({ character, active, onChoose }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Choose ${characterLabel(character)}`}
      onClick={onChoose}
      className={`flex w-[54px] shrink-0 flex-col items-center rounded-[10px] px-0.5 py-1 text-center active:scale-[0.97] ${active ? 'bg-[var(--shadow-bg-soft,#f5f5f8)]' : ''}`}
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'ring-[3px] ring-[#7c3aed] ring-offset-1 ring-offset-[var(--shadow-bg-surface,#fff)]' : 'ring-1 ring-[var(--shadow-border,#e5e7eb)]'}`}>
        <NotificationAvatar character={character} size={40} />
      </span>
      <span className={`mt-1 w-full truncate text-[9px] font-semibold ${active ? 'text-[#7c3aed]' : 'text-[var(--shadow-text-secondary,#6b7280)]'}`}>
        {characterLabel(character)}
      </span>
    </button>
  )
}

function NotificationCharacterAction({ type, onClick }) {
  const isAdd = type === 'add'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isAdd ? 'Add character' : 'More characters'}
      className="flex w-[48px] shrink-0 flex-col items-center rounded-[10px] py-1 text-center active:scale-[0.97]"
    >
      <span className="relative flex h-10 w-10 items-center justify-center text-[var(--shadow-text-secondary,#6b7280)]">
        {isAdd ? (
          <>
            <i className="fa-regular fa-user text-[16px]" />
            <i className="fa-solid fa-plus absolute right-[7px] top-[9px] text-[7px]" />
          </>
        ) : <i className="fa-solid fa-chevron-down text-[16px]" />}
      </span>
      <span className="mt-1 text-[9px] font-semibold text-[var(--shadow-text-secondary,#6b7280)]">
        {isAdd ? 'Add Character' : 'More'}
      </span>
    </button>
  )
}

function NotificationCharacterMoreSheet({ open, characters, selectedId, onSelect, onClose }) {
  const closeRef = useRef(null)
  const sheetRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
      }
      if (event.key !== 'Tab') return
      const buttons = Array.from(sheetRef.current?.querySelectorAll('button:not([disabled])') || [])
      if (!buttons.length) return
      if (event.shiftKey && document.activeElement === buttons[0]) {
        event.preventDefault()
        buttons[buttons.length - 1].focus()
      } else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) {
        event.preventDefault()
        buttons[0].focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-end justify-center overscroll-contain bg-black/75 sm:items-center"
      onClick={onClose}
    >
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a character"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[82dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[24px] bg-[var(--shadow-bg-surface,#fff)] text-[var(--shadow-text-primary,#111827)] shadow-2xl sm:rounded-[24px]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--shadow-border,#e5e7eb)] px-5 py-4">
          <h3 className="text-[17px] font-bold">Characters</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close character list" className="flex h-8 w-8 items-center justify-center rounded-full text-[23px]">×</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5">
          {characters.length ? (
            <div className="grid grid-cols-4 gap-x-2 gap-y-5">
              {characters.map((character) => {
                const active = String(character.id) === selectedId
                return (
                  <button
                    type="button"
                    key={character.id}
                    aria-pressed={active}
                    onClick={() => onSelect(String(character.id))}
                    className="flex min-w-0 flex-col items-center rounded-[12px] px-1 py-2 text-center active:scale-[0.97]"
                  >
                    <span className={`flex h-14 w-14 max-w-full items-center justify-center rounded-full ${active ? 'ring-[3px] ring-[#7c3aed] ring-offset-2 ring-offset-[var(--shadow-bg-surface,#fff)]' : 'ring-1 ring-[var(--shadow-border,#e5e7eb)]'}`}>
                      <NotificationAvatar character={character} size={56} />
                    </span>
                    <span className={`mt-2 w-full truncate text-[11px] font-semibold ${active ? 'text-[#7c3aed]' : 'text-[var(--shadow-text-primary,#111827)]'}`}>
                      {characterLabel(character)}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-[13px] text-[var(--shadow-text-secondary,#6b7280)]">No characters yet</p>
          )}
        </div>
        <div className="shrink-0 border-t border-[var(--shadow-border,#e5e7eb)] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
          <button type="button" onClick={onClose} className="h-11 w-full rounded-[12px] bg-[var(--shadow-bg-soft,#f3f4f6)] text-[13px] font-semibold">Close</button>
        </div>
      </section>
    </div>
  )
}

export function ChatStoryNotificationSettings({
  open,
  characters = [],
  value,
  maxVisible = 2,
  onClose,
  onSave,
  onAddCharacter,
}) {
  const [form, setForm] = useState(() => normalizeChatNotification(value))
  const [maximum, setMaximum] = useState(() => limitedNumber(maxVisible, 2, 1, 3))
  const [previewSequence, setPreviewSequence] = useState(0)
  const [moreCharactersOpen, setMoreCharactersOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageProgress, setImageProgress] = useState(0)
  const [imageError, setImageError] = useState('')
  const uploadRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => () => uploadRef.current?.abort(), [])

  useEffect(() => {
    if (!open) uploadRef.current?.abort()
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY
    const bodyOverflow = body.style.overflow
    const bodyPosition = body.style.position
    const bodyTop = body.style.top
    const bodyWidth = body.style.width
    const htmlOverflow = html.style.overflow
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'
    return () => {
      body.style.overflow = bodyOverflow
      body.style.position = bodyPosition
      body.style.top = bodyTop
      body.style.width = bodyWidth
      html.style.overflow = htmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setForm(normalizeChatNotification(value))
    setMaximum(limitedNumber(maxVisible, 2, 1, 3))
    setPreviewSequence(0)
    setMoreCharactersOpen(false)
    setImageError('')
    setImageProgress(0)
  }, [open])

  const uploadImage = async (file) => {
    if (!file || uploadingImage) return
    if (file.size > 8 * 1024 * 1024 || !(/image\//i.test(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name))) {
      setImageError('Choose an image no larger than 8 MB.')
      return
    }
    const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
    if (!token) {
      setImageError('Please sign in before uploading an image.')
      return
    }
    const controller = new AbortController()
    uploadRef.current = controller
    setUploadingImage(true)
    setImageError('')
    setImageProgress(0)
    try {
      const optimized = await optimizeImageForUpload(file, { preset: 'post', maxSourceBytes: 8 * 1024 * 1024, signal: controller.signal })
      if (controller.signal.aborted) return
      if (!optimized?.file?.size || optimized.file.size > 5 * 1024 * 1024) {
        throw new Error('The optimized image is larger than 5 MB. Try another image.')
      }
      const result = await uploadMediaWithFallback({
        file: optimized.file,
        category: 'chat_story_episode',
        token,
        signal: controller.signal,
        onProgress: (value) => setImageProgress(Math.max(0, Math.min(100, Math.round(Number(value) || 0)))),
      })
      if (controller.signal.aborted) return
      const imageUrl = String(result?.image_url || result?.imageUrl || '')
      if (!/^https:\/\/[^\s]+$/i.test(imageUrl)) throw new Error('The image upload did not return a secure image link.')
      setForm((current) => ({ ...current, imageUrl }))
      setImageProgress(100)
    } catch (error) {
      if (!controller.signal.aborted) setImageError(error?.message || 'Image upload failed. Please try again.')
    } finally {
      if (uploadRef.current === controller) {
        uploadRef.current = null
        setUploadingImage(false)
      }
    }
  }

  const selected = characters.find((character) => String(character.id) === form.characterId)
  const set = (name, nextValue) => setForm((current) => ({ ...current, [name]: nextValue }))
  const valid = Boolean(form.characterId && form.text.trim() && !uploadingImage)
  const chooseCharacter = (id) => {
    set('characterId', id)
    setMoreCharactersOpen(false)
  }
  const addCharacter = () => {
    setMoreCharactersOpen(false)
    onAddCharacter?.({ ...form }, maximum)
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9997] flex items-end justify-center bg-black/60 pt-5 sm:items-center sm:px-4"
        onClick={() => { if (!moreCharactersOpen) onClose?.() }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Notification Settings"
          aria-hidden={moreCharactersOpen}
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[calc(100dvh-20px)] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[25px] bg-[var(--shadow-bg-surface,#fff)] text-[var(--shadow-text-primary,#111827)] shadow-2xl sm:max-h-[92dvh] sm:rounded-[25px]"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--shadow-border,#e5e7eb)] px-5 py-4">
            <h2 className="text-[18px] font-bold">Notification Settings</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="text-[24px] leading-none">×</button>
          </div>
          <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
            <div className="grid grid-cols-[minmax(0,1fr)_48px_48px] items-start gap-0" aria-label="Choose notification character">
              <div className="relative min-w-0">
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max min-w-full gap-1.5 pb-1 pt-0.5">
                    {characters.map((character) => (
                      <NotificationCharacterOption
                        key={character.id}
                        character={character}
                        active={form.characterId === String(character.id)}
                        onChoose={() => chooseCharacter(String(character.id))}
                      />
                    ))}
                    {!characters.length ? (
                      <p className="self-center text-[12px] text-[var(--shadow-text-secondary,#6b7280)]">No characters</p>
                    ) : null}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-r from-transparent to-[var(--shadow-bg-surface,#fff)]" />
              </div>
              <NotificationCharacterAction type="add" onClick={addCharacter} />
              <NotificationCharacterAction type="more" onClick={() => setMoreCharactersOpen(true)} />
            </div>
            <label className="block space-y-1.5 text-[13px] font-semibold">
              <span>Notification message</span>
              <textarea rows={3} maxLength={500} value={form.text} onChange={(event) => set('text', event.target.value)}
                placeholder="Write your notification..."
                className="w-full resize-none rounded-[12px] border border-[var(--shadow-border,#dedee5)] bg-[var(--shadow-bg-soft,#f8f8fa)] p-3 text-[14px] outline-none focus:border-[#8b5cf6]" />
            </label>
            <div className="space-y-2">
              <p className="text-[13px] font-semibold">Notification image · Optional</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                className="hidden" onChange={(event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ''
                  if (file) void uploadImage(file)
                }} />
              {form.imageUrl ? (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--shadow-border,#e5e7eb)] p-2">
                  <img src={form.imageUrl} alt="Notification attachment preview" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1 text-[12px] text-[var(--shadow-text-secondary,#6b7280)]">Image attached</span>
                  <button type="button" disabled={uploadingImage} onClick={() => set('imageUrl', '')}
                    className="rounded-lg px-3 py-2 text-[12px] font-semibold text-[#d92d20] disabled:opacity-50">Remove</button>
                </div>
              ) : null}
              <button type="button" disabled={uploadingImage} onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-[#a78bfa] px-3 py-3 text-[13px] font-semibold text-[#7c3aed] disabled:opacity-50">
                {uploadingImage ? `Uploading image... ${imageProgress}%` : form.imageUrl ? 'Change image' : 'Choose image from device'}
              </button>
              {uploadingImage ? <div className="h-1.5 overflow-hidden rounded-full bg-[#e5e7eb]"><div className="h-full bg-[#7c3aed] transition-all" style={{ width: `${imageProgress}%` }} /></div> : null}
              {imageError ? <p role="alert" className="text-[12px] text-[#d92d20]">{imageError}</p> : null}
            </div>
            <div className="space-y-2">
              <p className="text-[13px] font-semibold">Live preview</p>
              <div className="rounded-[17px] border border-[#e9eaf0] bg-[#f2f5fa] p-3 text-[#171827] shadow-sm">
                <div className="flex items-center gap-3">
                  <NotificationAvatar character={selected} size={42} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{selected ? characterLabel(selected) : 'Character'}</p>
                    <p className="whitespace-pre-wrap break-words text-[12px] text-[#404451]">{form.text || 'Notification message'}</p>
                  </div>
                  {form.imageUrl ? <img src={form.imageUrl} alt="Attachment" className="h-11 w-11 shrink-0 rounded-lg object-cover" /> : null}
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
          <div className="flex shrink-0 gap-3 border-t border-[var(--shadow-border,#e5e7eb)] p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
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
      </div>
      <NotificationCharacterMoreSheet
        open={moreCharactersOpen}
        characters={characters}
        selectedId={form.characterId}
        onSelect={chooseCharacter}
        onClose={() => setMoreCharactersOpen(false)}
      />
    </>,
    document.body
  )
}

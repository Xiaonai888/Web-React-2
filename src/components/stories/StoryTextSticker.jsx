import { useRef } from 'react'
import { getDisplayText } from '../../utils/displayLanguage'
import { getStoryStickerFont, getStoryStickerTextColor, normalizeStoryTextSticker } from './StoryTextEditor'

function measurePointers(pointers) {
  const points = Array.from(pointers.values())
  if (!points.length) return null
  if (points.length === 1) return { x: points[0].x, y: points[0].y, distance: 0, angle: 0 }
  const [a, b] = points
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    distance: Math.hypot(b.x - a.x, b.y - a.y),
    angle: Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI),
  }
}

export default function StoryTextSticker({ value, onChange, onEdit, disabled = false }) {
  const layoutRef = useRef(null)
  const pointerRef = useRef(new Map())
  const gestureRef = useRef(null)
  const hadMultiRef = useRef(false)
  const latestRef = useRef(normalizeStoryTextSticker(value))
  const sticker = normalizeStoryTextSticker(value)

  if (!pointerRef.current.size) latestRef.current = sticker

  const resetGesture = () => {
    const start = measurePointers(pointerRef.current)
    gestureRef.current = start ? { start, initial: { ...latestRef.current }, moved: false, multi: pointerRef.current.size > 1 } : null
  }

  const onPointerDown = (event) => {
    if (disabled) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    pointerRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointerRef.current.size > 1) hadMultiRef.current = true
    resetGesture()
  }

  const onPointerMove = (event) => {
    if (disabled || !pointerRef.current.has(event.pointerId)) return
    pointerRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const gesture = gestureRef.current
    const current = measurePointers(pointerRef.current)
    const bounds = layoutRef.current?.getBoundingClientRect()
    if (!gesture || !current || !bounds?.width || !bounds?.height) return

    const dx = current.x - gesture.start.x
    const dy = current.y - gesture.start.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3 || (gesture.start.distance && Math.abs(current.distance - gesture.start.distance) > 3)) gesture.moved = true
    if (!gesture.moved) return

    const next = {
      ...gesture.initial,
      x: Math.max(5, Math.min(95, gesture.initial.x + (dx / bounds.width) * 100)),
      y: Math.max(8, Math.min(92, gesture.initial.y + (dy / bounds.height) * 100)),
    }
    if (pointerRef.current.size >= 2 && gesture.start.distance > 0) {
      next.scale = Math.max(0.45, Math.min(3, gesture.initial.scale * (current.distance / gesture.start.distance)))
      const deltaAngle = ((current.angle - gesture.start.angle + 540) % 360) - 180
      next.rotation = gesture.initial.rotation + deltaAngle
    }
    latestRef.current = next
    onChange?.(next)
  }

  const onPointerEnd = (event) => {
    if (!pointerRef.current.has(event.pointerId)) return
    const gesture = gestureRef.current
    const wasTap = pointerRef.current.size === 1 && gesture && !gesture.moved && !hadMultiRef.current && event.type === 'pointerup'
    pointerRef.current.delete(event.pointerId)
    if (pointerRef.current.size) resetGesture()
    else { gestureRef.current = null; hadMultiRef.current = false }
    if (wasTap && !disabled) onEdit?.()
  }

  if (!sticker.text.trim()) return null

  return (
    <div ref={layoutRef} className="pointer-events-none absolute inset-0 z-20">
      <button
        type="button"
        disabled={disabled}
        aria-label={getDisplayText('storyTextEditor.edit')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onEdit?.() } }}
        className="pointer-events-auto absolute inline-flex max-w-[84%] select-none items-center justify-center border-0 bg-transparent p-0 text-white outline-none disabled:opacity-100"
        style={{ left: `${sticker.x}%`, top: `${sticker.y}%`, touchAction: 'none', transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})` }}
      >
        <span className="inline-block max-w-full whitespace-pre-wrap break-words rounded-[12px] px-4 py-2.5 text-[29px] font-bold leading-tight shadow-lg" style={{ backgroundColor: sticker.background, color: getStoryStickerTextColor(sticker.background), textAlign: sticker.align, fontFamily: getStoryStickerFont(sticker.font) }}>
          {sticker.text}
        </span>
      </button>
    </div>
  )
}

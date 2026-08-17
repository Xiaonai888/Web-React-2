import {
  useEffect,
  useState,
} from 'react'
import {
  REACTIONS,
} from './reactionConfig'

const ALIGN_CLASS = {
  left: 'left-0',
  center:
    'left-1/2 -translate-x-1/2',
  right: 'right-0',
}

export default function ReactionPicker({
  open,
  activeType = '',
  previewType = '',
  busy = false,
  disabled = false,
  onSelect,
  onClose,
  align = 'left',
  className = '',
}) {
  const [
    pressedType,
    setPressedType,
  ] = useState('')
  const [
    hoverType,
    setHoverType,
  ] = useState('')

  useEffect(() => {
    if (!open) {
      setPressedType('')
      setHoverType('')
    }
  }, [open])

  if (!open) return null

  const alignClass =
    ALIGN_CLASS[align] ||
    ALIGN_CLASS.left

  return (
    <>
      <style>{`
        @keyframes shadowReactionPickerIn {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(.92);
          }
          70% {
            opacity: 1;
            transform: translateY(-2px) scale(1.03);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shadowReactionAlive {
          0%, 100% {
            transform: translateY(0) rotate(-2deg) scale(1);
          }
          25% {
            transform: translateY(-4px) rotate(2deg) scale(1.08);
          }
          50% {
            transform: translateY(-1px) rotate(-1deg) scale(1.03);
          }
          75% {
            transform: translateY(-5px) rotate(2deg) scale(1.09);
          }
        }

        @keyframes shadowReactionFocus {
          0%, 100% {
            transform: translateY(-58px) rotate(-4deg) scale(5.35);
          }
          35% {
            transform: translateY(-66px) rotate(4deg) scale(5.7);
          }
          70% {
            transform: translateY(-61px) rotate(-3deg) scale(5.5);
          }
        }

        .shadow-reaction-picker-in {
          animation:
            shadowReactionPickerIn
            190ms
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadow-reaction-alive {
          animation:
            shadowReactionAlive
            1.15s
            ease-in-out
            infinite;
          transform-origin: center bottom;
          will-change: transform;
        }

        .shadow-reaction-focus {
          animation:
            shadowReactionFocus
            330ms
            ease-in-out
            infinite;
          transform-origin: center bottom;
          will-change: transform;
          filter:
            drop-shadow(0 16px 18px rgba(0,0,0,.18));
        }
      `}</style>

      <button
        type="button"
        aria-label="Close reactions"
        onPointerDown={(event) => {
          event.stopPropagation()
          onClose?.()
        }}
        className="fixed inset-0 z-[70] cursor-default bg-transparent"
      />

      <div
        role="menu"
        aria-label="Choose reaction"
        onPointerDown={(event) =>
          event.stopPropagation()
        }
        className={`shadow-reaction-picker-in absolute bottom-9 ${alignClass} z-[80] flex items-center gap-1.5 overflow-visible rounded-full bg-white px-2.5 py-2 shadow-2xl ring-1 ring-black/10 ${className}`}
      >
        {REACTIONS.map(
          (reaction, index) => {
            const active =
              reaction.type ===
              activeType
            const pressed =
              pressedType ===
              reaction.type
            const previewed =
              previewType ===
              reaction.type
            const hovered =
              hoverType ===
              reaction.type
            const emphasized =
              pressed ||
              previewed ||
              hovered

            return (
              <button
                key={reaction.type}
                type="button"
                role="menuitem"
                data-shadow-reaction-type={
                  reaction.type
                }
                aria-pressed={active}
                disabled={
                  busy || disabled
                }
                onPointerEnter={() => {
                  if (
                    busy ||
                    disabled
                  ) {
                    return
                  }

                  setHoverType(
                    reaction.type
                  )
                }}
                onPointerLeave={() => {
                  setHoverType('')
                  setPressedType('')
                }}
                onPointerDown={(
                  event
                ) => {
                  event.stopPropagation()
                  setHoverType(
                    reaction.type
                  )
                  setPressedType(
                    reaction.type
                  )
                }}
                onPointerUp={(
                  event
                ) => {
                  event.stopPropagation()
                  setPressedType('')
                }}
                onPointerCancel={() => {
                  setPressedType('')
                  setHoverType('')
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  setPressedType('')
                  setHoverType('')
                  onSelect?.(
                    reaction.type
                  )
                }}
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-full disabled:opacity-55 ${
                  active
                    ? 'bg-[#f8f8fb] ring-1 ring-black/5'
                    : ''
                } ${
                  emphasized
                    ? 'z-[100]'
                    : 'z-0'
                }`}
                aria-label={
                  reaction.label
                }
                title={
                  reaction.label
                }
              >
                <img
                  src={reaction.src}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  className={`h-8 w-8 select-none object-contain ${
                    emphasized
                      ? 'shadow-reaction-focus'
                      : 'shadow-reaction-alive'
                  }`}
                  style={{
                    animationDelay:
                      emphasized
                        ? '0ms'
                        : `${index * 95}ms`,
                  }}
                />
              </button>
            )
          }
        )}
      </div>
    </>
  )
}

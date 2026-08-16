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

  useEffect(() => {
    if (!open) {
      setPressedType('')
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
            transform: translateY(8px) scale(.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shadowReactionAlive {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          30% {
            transform: translateY(-2px) rotate(-2deg) scale(1.03);
          }
          65% {
            transform: translateY(-1px) rotate(2deg) scale(1.02);
          }
        }

        @keyframes shadowReactionHold {
          0%, 100% {
            transform: translateY(-6px) rotate(-4deg) scale(1.28);
          }
          50% {
            transform: translateY(-8px) rotate(4deg) scale(1.34);
          }
        }

        .shadow-reaction-picker-in {
          animation:
            shadowReactionPickerIn
            180ms
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadow-reaction-alive {
          animation:
            shadowReactionAlive
            1.35s
            ease-in-out
            infinite;
        }

        .shadow-reaction-hold {
          animation:
            shadowReactionHold
            280ms
            ease-in-out
            infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .shadow-reaction-picker-in,
          .shadow-reaction-alive,
          .shadow-reaction-hold {
            animation: none !important;
          }
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
        className={`shadow-reaction-picker-in absolute bottom-9 ${alignClass} z-[80] flex items-center gap-1.5 rounded-full bg-white px-2.5 py-2 shadow-2xl ring-1 ring-black/10 ${className}`}
      >
        {REACTIONS.map(
          (reaction, index) => {
            const active =
              reaction.type ===
              activeType
            const pressed =
              pressedType ===
              reaction.type

            return (
              <button
                key={reaction.type}
                type="button"
                role="menuitem"
                disabled={
                  busy || disabled
                }
                onPointerDown={(
                  event
                ) => {
                  event.stopPropagation()
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
                onPointerLeave={() =>
                  setPressedType('')
                }
                onPointerCancel={() =>
                  setPressedType('')
                }
                onClick={(event) => {
                  event.stopPropagation()
                  setPressedType('')
                  onSelect?.(
                    reaction.type
                  )
                }}
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition disabled:opacity-55 ${
                  active
                    ? 'bg-[#f8f8fb] ring-1 ring-black/5'
                    : ''
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
                    pressed
                      ? 'shadow-reaction-hold'
                      : 'shadow-reaction-alive'
                  }`}
                  style={{
                    animationDelay:
                      pressed
                        ? '0ms'
                        : `${index * 70}ms`,
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

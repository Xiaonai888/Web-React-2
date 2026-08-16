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

        @keyframes shadowReactionItemIn {
          0% {
            opacity: .55;
            transform: translateY(5px) scale(.84);
          }
          68% {
            opacity: 1;
            transform: translateY(-2px) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shadowReactionHold {
          0%, 100% {
            transform: translateY(-10px) rotate(-5deg) scale(1.42);
          }
          50% {
            transform: translateY(-12px) rotate(5deg) scale(1.5);
          }
        }

        .shadow-reaction-picker-in {
          animation:
            shadowReactionPickerIn
            180ms
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadow-reaction-item-in {
          animation:
            shadowReactionItemIn
            320ms
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadow-reaction-hold {
          animation:
            shadowReactionHold
            260ms
            ease-in-out
            infinite;
          transform-origin: center bottom;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .shadow-reaction-picker-in,
          .shadow-reaction-item-in,
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
            const emphasized =
              pressed || previewed

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
                className={`shadow-reaction-item-in relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-full transition disabled:opacity-55 ${
                  active
                    ? 'bg-[#f8f8fb] ring-1 ring-black/5'
                    : ''
                } ${
                  emphasized
                    ? 'z-20'
                    : 'z-0'
                }`}
                style={{
                  animationDelay:
                    `${index * 35}ms`,
                }}
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
                      ? 'shadow-reaction-hold'
                      : ''
                  }`}
                />
              </button>
            )
          }
        )}
      </div>
    </>
  )
}

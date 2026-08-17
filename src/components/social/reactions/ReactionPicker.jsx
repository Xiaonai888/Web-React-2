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

const EMOTION_CLASS = {
  love: 'shadow-reaction-love',
  haha: 'shadow-reaction-haha',
  wow: 'shadow-reaction-wow',
  sad: 'shadow-reaction-sad',
  angry: 'shadow-reaction-angry',
  support: 'shadow-reaction-support',
  touched: 'shadow-reaction-touched',
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
            scale: .96;
          }
          100% {
            opacity: 1;
            scale: 1;
          }
        }

        @keyframes shadowReactionLove {
          0%, 100% {
            transform: scale(1);
            filter: saturate(1);
          }
          45% {
            transform: scale(1.1);
            filter: saturate(1.18);
          }
        }

        @keyframes shadowReactionHaha {
          0%, 100% {
            transform: rotate(-3deg) scale(1.02);
          }
          25% {
            transform: rotate(3deg) scale(1.08);
          }
          50% {
            transform: rotate(-2deg) scale(1.03);
          }
          75% {
            transform: rotate(3deg) scale(1.08);
          }
        }

        @keyframes shadowReactionWow {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.12);
            filter: brightness(1.08);
          }
        }

        @keyframes shadowReactionSad {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            filter: saturate(1);
          }
          50% {
            transform: rotate(-3deg) scale(1.04);
            filter: saturate(.92) brightness(.97);
          }
        }

        @keyframes shadowReactionAngry {
          0%, 100% {
            transform: scale(1);
            filter: saturate(1) brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: saturate(1.45) brightness(.93);
          }
        }

        @keyframes shadowReactionSupport {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.08);
          }
        }

        @keyframes shadowReactionTouched {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: saturate(1);
          }
          50% {
            transform: scale(1.07) rotate(2deg);
            filter: saturate(1.12);
          }
        }

        @keyframes shadowLoveHeart {
          0%, 100% {
            opacity: .35;
            transform: scale(.72);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes shadowSadTear {
          0%, 100% {
            opacity: .28;
            transform: scale(.75);
          }
          55% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .shadow-reaction-picker-in {
          animation:
            shadowReactionPickerIn
            150ms
            cubic-bezier(.22, 1, .36, 1)
            both;
          transform-origin: center;
        }

        .shadow-reaction-slot {
          transition:
            scale 150ms cubic-bezier(.22, 1, .36, 1),
            filter 150ms ease;
          transform-origin: center;
          will-change: scale;
        }

        .shadow-reaction-slot-active {
          scale: 1.8;
          filter:
            drop-shadow(0 7px 8px rgba(0,0,0,.16));
        }

        .shadow-reaction-love {
          animation:
            shadowReactionLove
            1.05s
            ease-in-out
            infinite;
        }

        .shadow-reaction-haha {
          animation:
            shadowReactionHaha
            .72s
            ease-in-out
            infinite;
        }

        .shadow-reaction-wow {
          animation:
            shadowReactionWow
            1.15s
            ease-in-out
            infinite;
        }

        .shadow-reaction-sad {
          animation:
            shadowReactionSad
            1.35s
            ease-in-out
            infinite;
        }

        .shadow-reaction-angry {
          animation:
            shadowReactionAngry
            .9s
            ease-in-out
            infinite;
        }

        .shadow-reaction-support {
          animation:
            shadowReactionSupport
            1.2s
            ease-in-out
            infinite;
        }

        .shadow-reaction-touched {
          animation:
            shadowReactionTouched
            1.25s
            ease-in-out
            infinite;
        }

        .shadow-reaction-slot-active[data-reaction-type="love"]::after {
          content: "♥";
          position: absolute;
          right: -2px;
          top: -7px;
          color: #ff2f5f;
          font-size: 10px;
          line-height: 1;
          pointer-events: none;
          animation:
            shadowLoveHeart
            .72s
            ease-in-out
            infinite;
        }

        .shadow-reaction-slot-active[data-reaction-type="sad"]::after {
          content: "";
          position: absolute;
          right: 4px;
          bottom: 2px;
          width: 4px;
          height: 6px;
          border-radius: 60% 60% 70% 70%;
          background: #60a5fa;
          pointer-events: none;
          animation:
            shadowSadTear
            .9s
            ease-in-out
            infinite;
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
        className={`shadow-reaction-picker-in absolute bottom-9 ${alignClass} z-[80] flex max-w-[calc(100vw-16px)] touch-none items-center gap-0.5 overflow-visible rounded-full bg-white px-2 py-1.5 shadow-2xl ring-1 ring-black/10 ${className}`}
      >
        {REACTIONS.map(
          (reaction) => {
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
            const emotionClass =
              EMOTION_CLASS[
                reaction.type
              ] || ''

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
                  setPressedType(
                    reaction.type
                  )
                  setHoverType(
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
                className={`relative flex h-8 w-8 shrink-0 touch-none items-center justify-center overflow-visible rounded-full disabled:opacity-55 ${
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
                <span
                  data-reaction-type={
                    reaction.type
                  }
                  className={`shadow-reaction-slot pointer-events-none relative flex h-7 w-7 items-center justify-center ${
                    emphasized
                      ? 'shadow-reaction-slot-active'
                      : ''
                  }`}
                >
                  <img
                    src={reaction.src}
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    className={`pointer-events-none h-7 w-7 select-none object-contain ${emotionClass}`}
                  />
                </span>
              </button>
            )
          }
        )}
      </div>
    </>
  )
}

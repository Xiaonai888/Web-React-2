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

const FOCUS_CLASS = {
  love: 'shadow-reaction-love-focus',
  haha: 'shadow-reaction-haha-focus',
  wow: 'shadow-reaction-wow-focus',
  sad: 'shadow-reaction-sad-focus',
  angry: 'shadow-reaction-angry-focus',
  support:
    'shadow-reaction-support-focus',
  touched:
    'shadow-reaction-touched-focus',
}

export default function ReactionPicker({
  open,
  activeType = '',
  previewType = '',
  isSliding = false,
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

  const emphasizedType =
    previewType ||
    pressedType ||
    hoverType

  const hasEmphasis =
    Boolean(emphasizedType)

  return (
    <>
      <style>{`
        @keyframes shadowReactionPickerIn {
          0% {
            opacity: 0;
            transform: scale(.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shadowReactionIdle {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-3px) rotate(2deg);
          }
        }

        @keyframes shadowReactionLoveFocus {
          0%, 100% {
            transform: scale(1);
            filter: saturate(1);
          }
          50% {
            transform: scale(1.06);
            filter: saturate(1.2);
          }
        }

        @keyframes shadowReactionHahaFocus {
          0%, 100% {
            transform: rotate(-4deg) scale(1);
          }
          25% {
            transform: rotate(4deg) scale(1.04);
          }
          50% {
            transform: rotate(-3deg) scale(1);
          }
          75% {
            transform: rotate(4deg) scale(1.04);
          }
        }

        @keyframes shadowReactionWowFocus {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.08);
            filter: brightness(1.08);
          }
        }

        @keyframes shadowReactionSadFocus {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            filter: saturate(1);
          }
          50% {
            transform: rotate(-3deg) scale(1.03);
            filter: saturate(.9);
          }
        }

        @keyframes shadowReactionAngryFocus {
          0%, 100% {
            transform: scale(1);
            filter: saturate(1) brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: saturate(1.5) brightness(.92);
          }
        }

        @keyframes shadowReactionSupportFocus {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.08);
          }
        }

        @keyframes shadowReactionTouchedFocus {
          0%, 100% {
            transform: rotate(-2deg) scale(1);
            filter: saturate(1);
          }
          50% {
            transform: rotate(2deg) scale(1.04);
            filter: saturate(1.14);
          }
        }

        @keyframes shadowLoveHeart {
          0%, 100% {
            opacity: .35;
            transform: scale(.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes shadowSadTear {
          0%, 100% {
            opacity: .25;
            transform: scale(.7);
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
        }

        .shadow-reaction-item {
          transition:
            width 150ms cubic-bezier(.22, 1, .36, 1),
            height 150ms cubic-bezier(.22, 1, .36, 1),
            opacity 150ms ease;
        }

        .shadow-reaction-idle {
          animation:
            shadowReactionIdle
            1.05s
            ease-in-out
            infinite;
          transform-origin: center;
        }

        .shadow-reaction-love-focus {
          animation:
            shadowReactionLoveFocus
            .9s
            ease-in-out
            infinite;
        }

        .shadow-reaction-haha-focus {
          animation:
            shadowReactionHahaFocus
            .62s
            ease-in-out
            infinite;
        }

        .shadow-reaction-wow-focus {
          animation:
            shadowReactionWowFocus
            1s
            ease-in-out
            infinite;
        }

        .shadow-reaction-sad-focus {
          animation:
            shadowReactionSadFocus
            1.2s
            ease-in-out
            infinite;
        }

        .shadow-reaction-angry-focus {
          animation:
            shadowReactionAngryFocus
            .78s
            ease-in-out
            infinite;
        }

        .shadow-reaction-support-focus {
          animation:
            shadowReactionSupportFocus
            1.05s
            ease-in-out
            infinite;
        }

        .shadow-reaction-touched-focus {
          animation:
            shadowReactionTouchedFocus
            1.05s
            ease-in-out
            infinite;
        }

        .shadow-reaction-focused[data-reaction-type="love"]::after {
          content: "♥";
          position: absolute;
          right: 1px;
          top: 0;
          color: #ff2f5f;
          font-size: 12px;
          line-height: 1;
          pointer-events: none;
          animation:
            shadowLoveHeart
            .72s
            ease-in-out
            infinite;
        }

        .shadow-reaction-focused[data-reaction-type="sad"]::after {
          content: "";
          position: absolute;
          right: 7px;
          bottom: 6px;
          width: 5px;
          height: 7px;
          border-radius: 60% 60% 70% 70%;
          background: #60a5fa;
          pointer-events: none;
          animation:
            shadowSadTear
            .85s
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
        className={`shadow-reaction-picker-in absolute bottom-9 ${alignClass} z-[80] flex min-h-[72px] max-w-[calc(100vw-16px)] touch-none items-center justify-between gap-1 overflow-visible rounded-full bg-white px-2 py-1 shadow-2xl ring-1 ring-black/10 ${className}`}
        style={{
          width:
            'min(94vw, 380px)',
        }}
        onPointerDown={(event) =>
          event.stopPropagation()
        }
      >
        {REACTIONS.map(
          (reaction, index) => {
            const active =
              reaction.type ===
              activeType
            const emphasized =
              reaction.type ===
              emphasizedType
            const focusClass =
              FOCUS_CLASS[
                reaction.type
              ] || ''

            const sizeClass =
              emphasized
                ? 'h-16 w-16'
                : hasEmphasis
                  ? 'h-8 w-8'
                  : 'h-9 w-9'

            const imageSizeClass =
              emphasized
                ? 'h-14 w-14'
                : hasEmphasis
                  ? 'h-6 w-6'
                  : 'h-7 w-7'

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
                onPointerEnter={(
                  event
                ) => {
                  if (
                    event.pointerType !==
                      'mouse' ||
                    isSliding ||
                    busy ||
                    disabled
                  ) {
                    return
                  }

                  setHoverType(
                    reaction.type
                  )
                }}
                onPointerLeave={(
                  event
                ) => {
                  if (
                    event.pointerType !==
                      'mouse' ||
                    isSliding
                  ) {
                    return
                  }

                  setHoverType('')
                  setPressedType('')
                }}
                onPointerDown={(
                  event
                ) => {
                  event.stopPropagation()

                  if (isSliding) {
                    return
                  }

                  setPressedType(
                    reaction.type
                  )
                }}
                onPointerUp={(
                  event
                ) => {
                  event.stopPropagation()

                  if (isSliding) {
                    return
                  }

                  setPressedType('')
                }}
                onPointerCancel={() => {
                  if (isSliding) {
                    return
                  }

                  setPressedType('')
                  setHoverType('')
                }}
                onClick={(event) => {
                  event.stopPropagation()

                  if (isSliding) {
                    return
                  }

                  setPressedType('')
                  setHoverType('')
                  onSelect?.(
                    reaction.type
                  )
                }}
                className={`shadow-reaction-item relative flex shrink-0 touch-none items-center justify-center overflow-visible rounded-full ${
                  sizeClass
                } ${
                  active
                    ? 'bg-[#f8f8fb] ring-1 ring-black/5'
                    : ''
                } ${
                  emphasized
                    ? 'shadow-reaction-focused z-[100]'
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
                  className={`pointer-events-none select-none object-contain transition-[width,height] duration-150 ${
                    imageSizeClass
                  } ${
                    emphasized
                      ? focusClass
                      : 'shadow-reaction-idle'
                  }`}
                  style={{
                    animationDelay:
                      emphasized
                        ? '0ms'
                        : `${index * 80}ms`,
                  }}
                />
              </button>
            )
          }
        )}

        <div
          className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white shadow-sm"
          aria-hidden="true"
        >
          {isSliding
            ? 'Slide finger across'
            : 'Tap to select'}
        </div>
      </div>
    </>
  )
}

import {
  useEffect,
  useState,
} from 'react'
import {
  REACTIONS,
} from './reactionConfig'

export default function ReactionPicker({
  open,
  activeType = '',
  previewType = '',
  isSliding = false,
  busy = false,
  disabled = false,
  onSelect,
  onClose,
  className = '',
}) {
  const [pressedType, setPressedType] = useState('')
  const [hoverType, setHoverType] = useState('')

  useEffect(() => {
    if (!open) {
      setPressedType('')
      setHoverType('')
    }
  }, [open])

  if (!open) return null

  const emphasizedType = pressedType || previewType || hoverType
  const hasEmphasis = Boolean(emphasizedType)

  function getReactionTypeAtPoint(clientX, clientY) {
    const element = document.elementFromPoint(clientX, clientY)
    const reactionElement = element?.closest?.('[data-shadow-reaction-type]')
    const type = reactionElement?.getAttribute?.('data-shadow-reaction-type') || ''

    return REACTIONS.some((reaction) => reaction.type === type)
      ? type
      : ''
  }

  return (
    <>
      <style>{`
        @keyframes shadowReactionPickerIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shadowReactionShake {
          0%, 60%, 100% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(-3deg);
          }
          20% {
            transform: rotate(3deg);
          }
          30% {
            transform: rotate(-2deg);
          }
          40% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(0deg);
          }
        }

        .shadow-reaction-picker-in {
          animation:
            shadowReactionPickerIn
            160ms
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadow-reaction-slot {
          transition:
            width
            150ms
            cubic-bezier(.2, .9, .25, 1.15);
        }

        .shadow-reaction-icon-wrap {
          transition:
            width 150ms cubic-bezier(.2, .9, .25, 1.15),
            height 150ms cubic-bezier(.2, .9, .25, 1.15);
          transform-origin: center bottom;
          will-change: width, height;
        }

        .shadow-reaction-icon {
          transform-origin: center bottom;
          will-change: transform;
        }

        .shadow-reaction-shake {
          animation:
            shadowReactionShake
            1.8s
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
        className={`shadow-reaction-picker-in absolute bottom-10 left-1/2 z-[80] flex min-h-[56px] w-[360px] max-w-[calc(100vw-16px)] -translate-x-1/2 touch-none items-end justify-center gap-[1px] overflow-visible rounded-full bg-white px-[7px] py-[4px] shadow-xl ring-1 ring-black/10 ${className}`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {REACTIONS.map((reaction) => {
          const active = reaction.type === activeType
          const emphasized = reaction.type === emphasizedType

          return (
            <button
              key={reaction.type}
              type="button"
              role="menuitem"
              data-shadow-reaction-type={reaction.type}
              aria-pressed={active}
              disabled={busy || disabled}
              onPointerEnter={(event) => {
                if (busy || disabled) return

                if (event.pointerType === 'mouse') {
                  setHoverType(reaction.type)
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') {
                  setHoverType('')
                  setPressedType('')
                }
              }}
              onPointerDown={(event) => {
                event.stopPropagation()
                if (busy || disabled) return

                event.currentTarget.setPointerCapture?.(event.pointerId)
                setPressedType(reaction.type)
              }}
              onPointerMove={(event) => {
                if (busy || disabled) return

                if (
                  event.pointerType === 'mouse' &&
                  event.buttons === 0
                ) {
                  return
                }

                const pointedType = getReactionTypeAtPoint(
                  event.clientX,
                  event.clientY
                )

                setPressedType(pointedType)
              }}
              onPointerUp={(event) => {
                event.stopPropagation()
                if (busy || disabled) return

                const pointedType = getReactionTypeAtPoint(
                  event.clientX,
                  event.clientY
                )

                if (
                  event.currentTarget.hasPointerCapture?.(event.pointerId)
                ) {
                  event.currentTarget.releasePointerCapture?.(event.pointerId)
                }

                setPressedType('')
                setHoverType('')

                if (pointedType) {
                  onSelect?.(pointedType)
                }
              }}
              onPointerCancel={(event) => {
                if (
                  event.currentTarget.hasPointerCapture?.(event.pointerId)
                ) {
                  event.currentTarget.releasePointerCapture?.(event.pointerId)
                }

                setPressedType('')
                setHoverType('')
              }}
              onClick={(event) => {
                event.stopPropagation()

                if (
                  event.detail === 0 &&
                  !busy &&
                  !disabled
                ) {
                  onSelect?.(reaction.type)
                }
              }}
              className={`shadow-reaction-slot relative flex h-[48px] shrink-0 touch-none items-end justify-center overflow-visible rounded-full disabled:opacity-60 ${
                emphasized
  ? 'w-[82px]'
  : hasEmphasis
    ? 'w-[41px]'
    : 'w-[48px]'
              }`}
              aria-label={reaction.label}
              title={reaction.label}
            >
              {emphasized ? (
                <span className="pointer-events-none absolute bottom-[86px] left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-sm backdrop-blur-[2px]">
                  {reaction.label}
                </span>
              ) : null}

              <span
                className={`shadow-reaction-icon-wrap pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center justify-center ${
                  emphasized
  ? 'z-[100] h-[86px] w-[86px]'
  : hasEmphasis
    ? 'z-0 h-[40px] w-[40px]'
    : 'z-0 h-[50px] w-[50px]'
                }`}
              >
                <img
                  src={reaction.src}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  className={`shadow-reaction-icon h-full w-full select-none object-contain ${
                    emphasized
                      ? 'shadow-reaction-shake'
                      : hasEmphasis
                        ? ''
                        : 'shadow-reaction-shake'
                  }`}
                />
              </span>
            </button>
          )
        })}

        <div
          className="pointer-events-none absolute left-1/2 top-[calc(100%+4px)] flex h-[38px] w-screen max-w-[100vw] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-none bg-white px-4 text-[12px] font-semibold text-[#667085]"
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

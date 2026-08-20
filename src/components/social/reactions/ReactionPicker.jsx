import {
  useEffect,
  useState,
} from 'react'
import {
  REACTIONS,
} from './reactionConfig'

const ALIGN_CLASS = {
  left: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-0',
}



const FOCUS_CLASS = {
  love: 'shadow-reaction-love-focus',
  haha: 'shadow-reaction-haha-focus',
  wow: 'shadow-reaction-wow-focus',
  sad: 'shadow-reaction-sad-focus',
  angry: 'shadow-reaction-angry-focus',
  support: 'shadow-reaction-support-focus',
  touched: 'shadow-reaction-touched-focus',
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
  const [pressedType, setPressedType] = useState('')
  const [hoverType, setHoverType] = useState('')

  useEffect(() => {
    if (!open) {
      setPressedType('')
      setHoverType('')
    }
  }, [open])

  if (!open) return null

  const alignClass = ALIGN_CLASS[align] || ALIGN_CLASS.left
  const emphasizedType = pressedType || previewType || hoverType

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
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

       @keyframes shadowReactionShake {
  0%, 60%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-3deg); }
  20% { transform: rotate(3deg); }
  30% { transform: rotate(-2deg); }
  40% { transform: rotate(2deg); }
  50% { transform: rotate(0deg); }
}
        @keyframes shadowReactionLoveFocus {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes shadowReactionHahaFocus {
          0%, 100% { transform: rotate(-5deg); }
          25% { transform: rotate(6deg); }
          50% { transform: rotate(-4deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes shadowReactionWowFocus {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.08); }
        }

        @keyframes shadowReactionSadFocus {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-4deg); }
        }

        @keyframes shadowReactionAngryFocus {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
        }

        @keyframes shadowReactionSupportFocus {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.05); }
        }

        @keyframes shadowReactionTouchedFocus {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        .shadow-reaction-picker-in {
          animation: shadowReactionPickerIn 160ms cubic-bezier(.22, 1, .36, 1) both;
        }

        .shadow-reaction-icon-wrap {
          transition: transform 135ms cubic-bezier(.2, .9, .25, 1.2);
          transform-origin: center bottom;
          will-change: transform;
        }

        .shadow-reaction-icon {
          transform-origin: center;
          will-change: transform;
        }

     .shadow-reaction-shake {
  animation: shadowReactionShake 1.8s ease-in-out infinite;
  transform-origin: center bottom;
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
        className={`shadow-reaction-picker-in absolute bottom-10 left-1/2 z-[80] flex min-h-[56px] w-[360px] max-w-[calc(100vw-16px)] -translate-x-1/2 touch-none items-center justify-center gap-[1px] overflow-visible rounded-full bg-white px-[7px] py-[4px] shadow-xl ring-1 ring-black/10 ${className}`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {REACTIONS.map((reaction, index) => {
          const active = reaction.type === activeType
          const emphasized = reaction.type === emphasizedType

          const focusClass = FOCUS_CLASS[reaction.type] || ''
        

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
              className="relative flex h-[48px] w-[48px] shrink-0 touch-none items-center justify-center overflow-visible rounded-full disabled:opacity-60"
              aria-label={reaction.label}
              title={reaction.label}
            >
              {emphasized ? (
                <span className="pointer-events-none absolute bottom-[58px] left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-md">
                  {reaction.label}
                </span>
              ) : null}

              <span
                className={`shadow-reaction-icon-wrap pointer-events-none flex h-[46px] w-[46px] items-center justify-center ${
                  emphasized
                    ? 'z-[100] -translate-y-[22px] scale-[1.95]'
                    : 'z-0 translate-y-0 scale-100'
                }`}
              >
                <img
                  src={reaction.src}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  className={`shadow-reaction-icon h-[50px] w-[50px] select-none object-contain ${
 emphasized
  ? focusClass
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

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

const IDLE_CLASS = {
  love: 'shadow-reaction-love-idle',
  haha: 'shadow-reaction-haha-idle',
  wow: 'shadow-reaction-wow-idle',
  sad: 'shadow-reaction-sad-idle',
  angry: 'shadow-reaction-angry-idle',
  support: 'shadow-reaction-support-idle',
  touched: 'shadow-reaction-touched-idle',
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

        @keyframes shadowReactionLoveIdle {
          0%, 100% { transform: translateY(0) scale(.96); }
          50% { transform: translateY(-3px) scale(1.07); }
        }

        @keyframes shadowReactionHahaIdle {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          35% { transform: translateY(-4px) rotate(6deg); }
          70% { transform: translateY(-1px) rotate(-3deg); }
        }

        @keyframes shadowReactionWowIdle {
          0%, 100% { transform: translateY(0) scale(1); }
          45% { transform: translateY(-5px) scale(1.08); }
          70% { transform: translateY(-1px) scale(.98); }
        }

        @keyframes shadowReactionSadIdle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          55% { transform: translateY(3px) rotate(-3deg); }
        }

        @keyframes shadowReactionAngryIdle {
          0%, 100% { transform: translateX(0) translateY(0); }
          28% { transform: translateX(-2px) translateY(-2px); }
          56% { transform: translateX(2px) translateY(-2px); }
          78% { transform: translateX(-1px) translateY(0); }
        }

        @keyframes shadowReactionSupportIdle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.04); }
        }

        @keyframes shadowReactionTouchedIdle {
          0%, 100% { transform: translateY(0) rotate(-3deg) scale(.98); }
          50% { transform: translateY(-4px) rotate(3deg) scale(1.05); }
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

        .shadow-reaction-love-idle {
          animation: shadowReactionLoveIdle 1.15s ease-in-out infinite;
        }

        .shadow-reaction-haha-idle {
          animation: shadowReactionHahaIdle .92s ease-in-out infinite;
        }

        .shadow-reaction-wow-idle {
          animation: shadowReactionWowIdle 1.22s ease-in-out infinite;
        }

        .shadow-reaction-sad-idle {
          animation: shadowReactionSadIdle 1.45s ease-in-out infinite;
        }

        .shadow-reaction-angry-idle {
          animation: shadowReactionAngryIdle .82s ease-in-out infinite;
        }

        .shadow-reaction-support-idle {
          animation: shadowReactionSupportIdle 1.3s ease-in-out infinite;
        }

        .shadow-reaction-touched-idle {
          animation: shadowReactionTouchedIdle 1.18s ease-in-out infinite;
        }

        .shadow-reaction-love-focus {
          animation: shadowReactionLoveFocus .72s ease-in-out infinite;
        }

        .shadow-reaction-haha-focus {
          animation: shadowReactionHahaFocus .48s ease-in-out infinite;
        }

        .shadow-reaction-wow-focus {
          animation: shadowReactionWowFocus .8s ease-in-out infinite;
        }

        .shadow-reaction-sad-focus {
          animation: shadowReactionSadFocus 1s ease-in-out infinite;
        }

        .shadow-reaction-angry-focus {
          animation: shadowReactionAngryFocus .42s ease-in-out infinite;
        }

        .shadow-reaction-support-focus {
          animation: shadowReactionSupportFocus .9s ease-in-out infinite;
        }

        .shadow-reaction-touched-focus {
          animation: shadowReactionTouchedFocus .85s ease-in-out infinite;
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
        className={`shadow-reaction-picker-in absolute bottom-10 ${alignClass} z-[80] flex min-h-[50px] w-max max-w-[calc(100vw-16px)] touch-none items-center gap-[1px] overflow-visible rounded-full bg-white px-[6px] py-[5px] shadow-xl ring-1 ring-black/10 ${className}`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {REACTIONS.map((reaction) => {
          const active = reaction.type === activeType
          const emphasized = reaction.type === emphasizedType
          const idleClass = IDLE_CLASS[reaction.type] || ''
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
              className="relative flex h-10 w-10 shrink-0 touch-none items-center justify-center overflow-visible rounded-full disabled:opacity-60"
              aria-label={reaction.label}
              title={reaction.label}
            >
              {emphasized ? (
                <span className="pointer-events-none absolute bottom-[58px] left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-md">
                  {reaction.label}
                </span>
              ) : null}

              <span
                className={`shadow-reaction-icon-wrap pointer-events-none flex h-[38px] w-[38px] items-center justify-center ${
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
                  className={`shadow-reaction-icon h-[38px] w-[38px] select-none object-contain ${
                    emphasized
                      ? focusClass
                      : idleClass
                  }`}
                />
              </span>
            </button>
          )
        })}

        <div
          className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white shadow-sm"
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

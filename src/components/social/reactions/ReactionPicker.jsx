import {
  useEffect,
  useLayoutEffect,
  useRef,
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
  const [pickerPosition, setPickerPosition] = useState(null)
  const pickerRef = useRef(null)

  useEffect(() => {
    if (!open) {
      setPressedType('')
      setHoverType('')
      setPickerPosition(null)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return undefined

    let frame = 0

    const updatePickerPosition = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const picker = pickerRef.current
        const parent = picker?.parentElement

        if (!picker || !parent) return

        const anchor = Array.from(parent.children).find(
          (element) =>
            element.tagName === 'BUTTON' &&
            element.getAttribute('aria-label') !== 'Close reactions'
        )

        if (!anchor) return

        const anchorRect = anchor.getBoundingClientRect()
        const post = parent.closest('article')
        const postRect = post?.getBoundingClientRect()
        const isDesktop = window.innerWidth >= 768

        const postLeft = postRect?.left ?? 0
        const postWidth = postRect?.width ?? window.innerWidth
        const postCenter = postLeft + postWidth / 2

        const pickerTop = Math.max(
  8,
  anchorRect.top - 70
)

setPickerPosition({
  top: pickerTop,
  left: isDesktop
    ? postLeft + 12
    : postCenter,
  footerTop: pickerTop + 68,
  footerLeft: postLeft,
  footerWidth: Math.min(
    postWidth,
    window.innerWidth
  ),
  isDesktop,
})
      })
    }

    updatePickerPosition()

    window.addEventListener(
      'resize',
      updatePickerPosition
    )
    window.addEventListener(
      'scroll',
      updatePickerPosition,
      true
    )

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener(
        'resize',
        updatePickerPosition
      )
      window.removeEventListener(
        'scroll',
        updatePickerPosition,
        true
      )
    }
  }, [open])

  if (!open) return null

  const emphasizedType =
    pressedType || previewType || hoverType
  const hasEmphasis = Boolean(emphasizedType)

  function getReactionTypeAtPoint(
    clientX,
    clientY
  ) {
    const element =
      document.elementFromPoint(
        clientX,
        clientY
      )
    const reactionElement =
      element?.closest?.(
        '[data-shadow-reaction-type]'
      )
    const type =
      reactionElement?.getAttribute?.(
        'data-shadow-reaction-type'
      ) || ''

    return REACTIONS.some(
      (reaction) =>
        reaction.type === type
    )
      ? type
      : ''
  }

  return (
    <>
      <style>{`
        @keyframes shadowReactionPickerIn {
          0% {
            opacity: 0;
            translate: 0 8px;
          }
          100% {
            opacity: 1;
            translate: 0 0;
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
        ref={pickerRef}
        role="menu"
        aria-label="Choose reaction"
        style={
          pickerPosition === null
            ? {
                visibility: 'hidden',
              }
            : {
                top: `${pickerPosition.top}px`,
                left: `${pickerPosition.left}px`,
              }
        }
        className={`shadow-reaction-picker-in fixed z-[80] flex h-[56px] w-[360px] max-w-[calc(100vw-16px)] touch-none items-end justify-center gap-[1px] overflow-visible rounded-full bg-white px-[7px] ${
          pickerPosition?.isDesktop
            ? 'translate-x-0'
            : '-translate-x-1/2'
        } ${className}`}
        onPointerDown={(event) =>
          event.stopPropagation()
        }
      >
        {REACTIONS.map((reaction) => {
          const active =
            reaction.type === activeType
          const emphasized =
            reaction.type ===
            emphasizedType

          return (
            <button
              key={reaction.type}
              type="button"
              role="menuitem"
              data-shadow-reaction-type={
                reaction.type
              }
              aria-pressed={active}
              disabled={busy || disabled}
              onPointerEnter={(event) => {
                if (busy || disabled) return

                if (
                  event.pointerType ===
                  'mouse'
                ) {
                  setHoverType(
                    reaction.type
                  )
                }
              }}
              onPointerLeave={(event) => {
                if (
                  event.pointerType ===
                  'mouse'
                ) {
                  setHoverType('')
                  setPressedType('')
                }
              }}
              onPointerDown={(event) => {
                event.stopPropagation()
                if (busy || disabled) return

                event.currentTarget
                  .setPointerCapture?.(
                    event.pointerId
                  )
                setPressedType(
                  reaction.type
                )
              }}
              onPointerMove={(event) => {
                if (busy || disabled) return

                if (
                  event.pointerType ===
                    'mouse' &&
                  event.buttons === 0
                ) {
                  return
                }

                const pointedType =
                  getReactionTypeAtPoint(
                    event.clientX,
                    event.clientY
                  )

                setPressedType(
                  pointedType
                )
              }}
              onPointerUp={(event) => {
                event.stopPropagation()
                if (busy || disabled) return

                const pointedType =
                  getReactionTypeAtPoint(
                    event.clientX,
                    event.clientY
                  )

                if (
                  event.currentTarget
                    .hasPointerCapture?.(
                      event.pointerId
                    )
                ) {
                  event.currentTarget
                    .releasePointerCapture?.(
                      event.pointerId
                    )
                }

                setPressedType('')
                setHoverType('')

                if (pointedType) {
                  onSelect?.(pointedType)
                }
              }}
              onPointerCancel={(
                event
              ) => {
                if (
                  event.currentTarget
                    .hasPointerCapture?.(
                      event.pointerId
                    )
                ) {
                  event.currentTarget
                    .releasePointerCapture?.(
                      event.pointerId
                    )
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
                  onSelect?.(
                    reaction.type
                  )
                }
              }}
              className={`shadow-reaction-slot relative flex h-[56px] shrink-0 touch-none items-end justify-center overflow-visible rounded-full disabled:opacity-60 ${
                emphasized
                  ? 'w-[110px]'
                  : hasEmphasis
                    ? 'w-[37px]'
                    : 'w-[48px]'
              }`}
              aria-label={
                reaction.label
              }
              title={reaction.label}
            >
              {emphasized ? (
                <span className="pointer-events-none absolute bottom-[114px] left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-sm backdrop-blur-[2px]">
                  {reaction.label}
                </span>
              ) : null}

              <span
                className={`shadow-reaction-icon-wrap pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-end justify-center ${
                  emphasized
                    ? 'z-[100] bottom-[-10px] h-[120px] w-[120px]'
                    : hasEmphasis
                      ? 'z-0 bottom-[3px] h-[40px] w-[40px]'
                      : 'z-0 bottom-[3px] h-[50px] w-[50px]'
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
          style={{
            width: `${
              pickerPosition
                ?.footerWidth ||
              window.innerWidth
            }px`,
          }}
          className={`pointer-events-none absolute top-[calc(100%-2px)] flex h-[48px] items-center justify-center whitespace-nowrap bg-white px-4 text-[11px] font-semibold text-[#667085] ${
            pickerPosition?.isDesktop
              ? 'left-[-12px] translate-x-0'
              : 'left-1/2 -translate-x-1/2'
          }`}
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

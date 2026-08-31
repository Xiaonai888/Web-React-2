import { createPortal } from 'react-dom'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  REACTIONS,
} from './reactionConfig'
import { useDisplayTranslation } from '../../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../../i18n/registerTranslations'

registerTranslationNamespace('reactionPicker', {
  en: {
    close: 'Close reactions',
    choose: 'Choose reaction',
    slide: 'Slide finger across',
    tap: 'Tap to select',
  },
  km: {
    close: 'បិទប្រតិកម្ម',
    choose: 'ជ្រើសប្រតិកម្ម',
    slide: 'អូសម្រាមដៃដើម្បីជ្រើស',
    tap: 'ចុចដើម្បីជ្រើស',
  },
  zh: {
    close: '关闭反应',
    choose: '选择反应',
    slide: '滑动手指选择',
    tap: '点击选择',
  },
  ja: {
    close: 'リアクションを閉じる',
    choose: 'リアクションを選択',
    slide: '指をスライドして選択',
    tap: 'タップして選択',
  },
  ko: {
    close: '반응 닫기',
    choose: '반응 선택',
    slide: '손가락을 움직여 선택',
    tap: '탭하여 선택',
  },
})

export default function ReactionPicker({
  anchorRef,
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
  const { t } = useDisplayTranslation()
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
  }, [open, anchorRef])

  useLayoutEffect(() => {
    if (!open) return undefined

    let frame = 0

    const updatePickerPosition = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const picker = pickerRef.current
const anchor = anchorRef?.current

if (!picker || !anchor) return

const anchorRect = anchor.getBoundingClientRect()
const post = anchor.closest('article')
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
  }, [open, anchorRef])

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

  function renderReactionEffect(type) {
    if (type === 'love') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-love-heart">♥</span>
          <span className="shadow-love-heart">♥</span>
          <span className="shadow-love-heart">♥</span>
          <span className="shadow-love-heart">♥</span>
        </span>
      )
    }

    if (type === 'haha') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-haha-tear" />
          <span className="shadow-haha-tear" />
          <span className="shadow-haha-tear" />
        </span>
      )
    }

    if (type === 'wow') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-wow-ring" />
          <span className="shadow-wow-spark">✦</span>
          <span className="shadow-wow-spark">✦</span>
          <span className="shadow-wow-spark">✦</span>
        </span>
      )
    }

    if (type === 'sad') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-sad-drop" />
          <span className="shadow-sad-drop" />
          <span className="shadow-sad-drop" />
        </span>
      )
    }

    if (type === 'angry') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-angry-spark" />
          <span className="shadow-angry-spark" />
          <span className="shadow-angry-spark" />
          <span className="shadow-angry-spark" />
        </span>
      )
    }

    if (type === 'support') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-support-ring" />
          <span className="shadow-support-star">✦</span>
          <span className="shadow-support-star">✦</span>
          <span className="shadow-support-star">✦</span>
        </span>
      )
    }

    if (type === 'touched') {
      return (
        <span className="shadow-reaction-fx-layer" aria-hidden="true">
          <span className="shadow-touched-glow" />
          <span className="shadow-touched-spark">✦</span>
          <span className="shadow-touched-spark">✦</span>
          <span className="shadow-touched-spark">✦</span>
          <span className="shadow-touched-spark">✦</span>
        </span>
      )
    }

    return null
  }

  return createPortal(
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

        @keyframes shadowLoveHeartFloat {
          0% {
            opacity: 0;
            transform: translate(0, 10px) scale(.55) rotate(0deg);
          }
          20% {
            opacity: .95;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), -52px) scale(1.05) rotate(var(--fx-r));
          }
        }

        @keyframes shadowHahaTearFly {
          0% {
            opacity: 0;
            transform: translate(0, 0) rotate(var(--fx-r)) scale(.6);
          }
          18% {
            opacity: .95;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), var(--fx-y)) rotate(var(--fx-r)) scale(1);
          }
        }

        @keyframes shadowWowRingPulse {
          0% {
            opacity: .65;
            transform: translate(-50%, -50%) scale(.45);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.55);
          }
        }

        @keyframes shadowWowSparkPop {
          0% {
            opacity: 0;
            transform: translate(0, 8px) scale(.45) rotate(0deg);
          }
          28% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), var(--fx-y)) scale(1.15) rotate(90deg);
          }
        }

        @keyframes shadowSadDropFall {
          0% {
            opacity: 0;
            transform: translate(0, -8px) scale(.65);
          }
          25% {
            opacity: .95;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), 42px) scale(1);
          }
        }

        @keyframes shadowAngrySparkRise {
          0% {
            opacity: 0;
            transform: translate(0, 10px) scale(.5);
          }
          22% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), -48px) scale(.9);
          }
        }

        @keyframes shadowSupportRingPulse {
          0% {
            opacity: .55;
            transform: translate(-50%, -50%) scale(.55);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.35);
          }
        }

        @keyframes shadowSupportStarFloat {
          0% {
            opacity: 0;
            transform: translate(0, 8px) scale(.4) rotate(0deg);
          }
          25% {
            opacity: .9;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), var(--fx-y)) scale(1.05) rotate(105deg);
          }
        }

        @keyframes shadowTouchedGlowPulse {
          0% {
            opacity: .5;
            transform: translate(-50%, -50%) scale(.65);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.35);
          }
        }

        @keyframes shadowTouchedSparkFloat {
          0% {
            opacity: 0;
            transform: translate(0, 8px) scale(.45) rotate(0deg);
          }
          30% {
            opacity: .85;
          }
          100% {
            opacity: 0;
            transform: translate(var(--fx-x), var(--fx-y)) scale(1) rotate(80deg);
          }
        }

        .shadow-reaction-fx-layer {
          position: absolute;
          inset: 0;
          z-index: 8;
          pointer-events: none;
          overflow: visible;
        }

        .shadow-love-heart {
          position: absolute;
          bottom: 42%;
          left: 50%;
          color: #ff4f87;
          font-size: 15px;
          line-height: 1;
          opacity: 0;
          animation: shadowLoveHeartFloat 1.65s ease-in-out infinite;
        }

        .shadow-love-heart:nth-child(1) {
          --fx-x: -36px;
          --fx-r: -18deg;
        }

        .shadow-love-heart:nth-child(2) {
          --fx-x: -12px;
          --fx-r: 10deg;
          animation-delay: 70ms;
          font-size: 11px;
        }

        .shadow-love-heart:nth-child(3) {
          --fx-x: 18px;
          --fx-r: 18deg;
          animation-delay: 120ms;
          font-size: 13px;
        }

        .shadow-love-heart:nth-child(4) {
          --fx-x: 36px;
          --fx-r: 24deg;
          animation-delay: 40ms;
          font-size: 10px;
        }

        .shadow-haha-tear {
          position: absolute;
          left: 50%;
          top: 42%;
          width: 9px;
          height: 14px;
          border-radius: 70% 45% 70% 45%;
          background: linear-gradient(180deg, #a9ddff, #43aef5);
          opacity: 0;
          animation: shadowHahaTearFly 1.6s ease-in-out infinite;
        }

        .shadow-haha-tear:nth-child(1) {
          --fx-x: -46px;
          --fx-y: 18px;
          --fx-r: 28deg;
        }

        .shadow-haha-tear:nth-child(2) {
          --fx-x: 42px;
          --fx-y: 20px;
          --fx-r: -30deg;
          animation-delay: 55ms;
        }

        .shadow-haha-tear:nth-child(3) {
          --fx-x: 28px;
          --fx-y: -18px;
          --fx-r: -15deg;
          width: 7px;
          height: 11px;
          animation-delay: 110ms;
        }

        .shadow-wow-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 86px;
          height: 86px;
          border: 3px solid rgba(250, 180, 36, .52);
          border-radius: 9999px;
          animation: shadowWowRingPulse 1.65s ease-in-out infinite;
        }

        .shadow-wow-spark {
          position: absolute;
          left: 50%;
          top: 45%;
          color: #ffb525;
          font-size: 14px;
          line-height: 1;
          opacity: 0;
          animation: shadowWowSparkPop 1.65s ease-in-out infinite;
        }

        .shadow-wow-spark:nth-child(2) {
          --fx-x: -42px;
          --fx-y: -35px;
        }

        .shadow-wow-spark:nth-child(3) {
          --fx-x: 40px;
          --fx-y: -30px;
          animation-delay: 75ms;
          font-size: 11px;
        }

        .shadow-wow-spark:nth-child(4) {
          --fx-x: 32px;
          --fx-y: 12px;
          animation-delay: 130ms;
          font-size: 9px;
        }

        .shadow-sad-drop {
          position: absolute;
          left: 50%;
          top: 68%;
          width: 8px;
          height: 13px;
          border-radius: 70% 45% 70% 45%;
          background: linear-gradient(180deg, #b7e6ff, #4aaef4);
          opacity: 0;
          animation: shadowSadDropFall 1.75s ease-in-out infinite;
        }

        .shadow-sad-drop:nth-child(1) {
          --fx-x: -28px;
        }

        .shadow-sad-drop:nth-child(2) {
          --fx-x: 3px;
          animation-delay: 90ms;
          width: 6px;
          height: 10px;
        }

        .shadow-sad-drop:nth-child(3) {
          --fx-x: 29px;
          animation-delay: 160ms;
          width: 7px;
          height: 11px;
        }

        .shadow-angry-spark {
          position: absolute;
          left: 50%;
          bottom: 36%;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #ff5a36;
          box-shadow: 0 0 8px rgba(255, 88, 48, .65);
          opacity: 0;
          animation: shadowAngrySparkRise 1.6s ease-in-out infinite;
        }

        .shadow-angry-spark:nth-child(1) {
          --fx-x: -34px;
        }

        .shadow-angry-spark:nth-child(2) {
          --fx-x: -10px;
          animation-delay: 70ms;
          width: 6px;
          height: 6px;
          background: #ffb020;
        }

        .shadow-angry-spark:nth-child(3) {
          --fx-x: 20px;
          animation-delay: 120ms;
          width: 7px;
          height: 7px;
        }

        .shadow-angry-spark:nth-child(4) {
          --fx-x: 38px;
          animation-delay: 35ms;
          width: 5px;
          height: 5px;
          background: #ffc14b;
        }

        .shadow-support-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 92px;
          height: 92px;
          border: 3px solid rgba(105, 191, 120, .42);
          border-radius: 9999px;
          animation: shadowSupportRingPulse 1.7s ease-in-out infinite;
        }

        .shadow-support-star {
          position: absolute;
          left: 50%;
          top: 45%;
          color: #74bf7a;
          font-size: 13px;
          line-height: 1;
          opacity: 0;
          animation: shadowSupportStarFloat 1.7s ease-in-out infinite;
        }

        .shadow-support-star:nth-child(2) {
          --fx-x: -38px;
          --fx-y: -34px;
        }

        .shadow-support-star:nth-child(3) {
          --fx-x: 38px;
          --fx-y: -28px;
          animation-delay: 90ms;
          font-size: 10px;
        }

        .shadow-support-star:nth-child(4) {
          --fx-x: 28px;
          --fx-y: 16px;
          animation-delay: 150ms;
          font-size: 9px;
        }

        .shadow-touched-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 92px;
          height: 92px;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(255, 185, 213, .3) 0%,
            rgba(190, 154, 255, .18) 46%,
            rgba(255, 255, 255, 0) 72%
          );
          animation: shadowTouchedGlowPulse 1.8s ease-in-out infinite;
        }

        .shadow-touched-spark {
          position: absolute;
          left: 50%;
          top: 46%;
          color: #d58cff;
          font-size: 12px;
          line-height: 1;
          opacity: 0;
          animation: shadowTouchedSparkFloat 1.8s ease-in-out infinite;
        }

        .shadow-touched-spark:nth-child(2) {
          --fx-x: -38px;
          --fx-y: -38px;
        }

        .shadow-touched-spark:nth-child(3) {
          --fx-x: 36px;
          --fx-y: -34px;
          animation-delay: 80ms;
          color: #ff8fb6;
          font-size: 10px;
        }

        .shadow-touched-spark:nth-child(4) {
          --fx-x: -26px;
          --fx-y: 8px;
          animation-delay: 135ms;
          font-size: 9px;
        }

        .shadow-touched-spark:nth-child(5) {
          --fx-x: 30px;
          --fx-y: 12px;
          animation-delay: 180ms;
          color: #ff9fbd;
          font-size: 8px;
        }
      `}</style>

      <button
        type="button"
        aria-label={t('reactionPicker.close')}
        onPointerDown={(event) => {
          event.stopPropagation()
          onClose?.()
        }}
        className="fixed inset-0 z-[2147483000] cursor-default bg-transparent"
      />

      <div
        ref={pickerRef}
        role="menu"
        aria-label={t('reactionPicker.choose')}
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
        className={`shadow-reaction-picker-in fixed z-[2147483001] flex h-[56px] w-[360px] max-w-[calc(100vw-16px)] touch-none items-end justify-center gap-[1px] overflow-visible rounded-full bg-[var(--shadow-bg-elevated)] px-[7px] ${
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
const reactionLabel = t(
  `reactionAction.${reaction.type}`,
  { defaultValue: reaction.label }
)

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
  onSelect?.(reaction.type)
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
              aria-label={reactionLabel}
title={reactionLabel}
            >
              {emphasized ? (
                <span className="pointer-events-none absolute bottom-[114px] left-1/2 z-[110] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-sm backdrop-blur-[2px]">
                  {reactionLabel}
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
                {emphasized
                  ? renderReactionEffect(
                      reaction.type
                    )
                  : null}

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
          className={`pointer-events-none absolute top-[calc(100%-2px)] flex h-[48px] items-center justify-center whitespace-nowrap bg-[var(--shadow-bg-elevated)] px-4 text-[11px] font-semibold text-[var(--shadow-text-secondary)] ${
            pickerPosition?.isDesktop
              ? 'left-[-12px] translate-x-0'
              : 'left-1/2 -translate-x-1/2'
          }`}
          aria-hidden="true"
        >
          {isSliding
  ? t('reactionPicker.slide')
  : t('reactionPicker.tap')}
        </div>
      </div>
    </>,
    document.body
  )
}

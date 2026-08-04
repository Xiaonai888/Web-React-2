import { useEffect, useRef, useState } from 'react'

export function CollapsiblePostText({
  text,
  children,
  className = '',
  lines = 3,
}) {
  const textRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    setExpanded(false)
  }, [text])

  useEffect(() => {
    const element = textRef.current

    if (!element || expanded) return undefined

    const measure = () => {
      setOverflowing(
        element.scrollHeight > element.clientHeight + 1
      )
    }

    measure()

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measure)
        : null

    observer?.observe(element)
    window.addEventListener('resize', measure)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [text, expanded, lines])

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={`whitespace-pre-wrap break-words ${className}`}
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {children}
      </p>

      {!expanded && overflowing ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute bottom-0 right-0 bg-gradient-to-l from-white via-white to-white/80 pl-5 text-[13px] font-semibold leading-[inherit] text-[#475569] active:opacity-70"
        >
          … See more
        </button>
      ) : null}

      {expanded && overflowing ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-1 text-[13px] font-semibold text-[#475569] active:opacity-70"
        >
          See less
        </button>
      ) : null}
    </div>
  )
}

export function ProfessionalSinglePostImage({
  src,
  alt = '',
  onClick,
  className = '',
}) {
  const [portraitCrop, setPortraitCrop] = useState(false)
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`block w-full overflow-hidden bg-[#f3f4f6] text-left ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(event) => {
          const image = event.currentTarget
          const ratio =
            image.naturalHeight /
            Math.max(1, image.naturalWidth)

          setPortraitCrop(ratio > 1.25)
        }}
        className={
          portraitCrop
            ? 'aspect-[4/5] w-full object-cover object-top'
            : 'max-h-[520px] w-full object-contain'
        }
      />
    </Wrapper>
  )
}

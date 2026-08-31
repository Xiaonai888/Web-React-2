import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('professionalPostContent', {
  en: {
    more: 'more',
    seeMore: 'See more',
    seeLess: 'See less',
  },
  km: {
    more: 'បន្ថែម',
    seeMore: 'មើលបន្ថែម',
    seeLess: 'មើលតិច',
  },
  zh: {
    more: '更多',
    seeMore: '查看更多',
    seeLess: '收起',
  },
  ja: {
    more: 'もっと見る',
    seeMore: 'さらに表示',
    seeLess: '閉じる',
  },
  ko: {
    more: '더보기',
    seeMore: '더 보기',
    seeLess: '접기',
  },
})

export function CollapsiblePostText({
  text,
  children,
  className = '',
  lines = 3,
  discoverStyle = false,
  toggleOnTextClick = false,
}) {
  const { t } = useDisplayTranslation()
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
      setOverflowing(element.scrollHeight > element.clientHeight + 1)
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

  const textCanToggle =
    overflowing && (toggleOnTextClick || (discoverStyle && expanded))

  return (
    <div className="relative">
      <p
        ref={textRef}
        onClick={
          textCanToggle
            ? () => setExpanded((value) => !value)
            : undefined
        }
        className={`whitespace-pre-wrap break-words ${className} ${
          textCanToggle ? 'cursor-pointer' : ''
        }`}
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
          className={
            discoverStyle
              ? 'absolute bottom-0 right-0 bg-[var(--shadow-bg-surface)] pl-1 text-[13px] font-semibold leading-[inherit] text-[var(--shadow-text-secondary)] active:opacity-70'
              : 'absolute bottom-0 right-0 bg-[var(--shadow-bg-surface)] pl-5 text-[13px] font-semibold leading-[inherit] text-[var(--shadow-text-secondary)] active:opacity-70'
          }
        >
          {discoverStyle
            ? `... ${t('professionalPostContent.more')}`
            : `… ${t('professionalPostContent.seeMore')}`}
        </button>
      ) : null}

      {!discoverStyle && expanded && overflowing ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-1 text-[13px] font-semibold text-[var(--shadow-text-secondary)] active:opacity-70"
        >
          {t('professionalPostContent.seeLess')}
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
      className={`block w-full overflow-hidden bg-[var(--shadow-bg-soft)] text-left ${className}`}
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

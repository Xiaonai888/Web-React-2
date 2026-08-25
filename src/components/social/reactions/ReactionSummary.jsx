import {
  DEFAULT_REACTION_TYPE,
  formatReactionCount,
  getReactionMeta,
} from './reactionConfig'

export default function ReactionSummary({
  summary = [],
  likeCount = 0,
  myReaction = null,
  showZero = false,
  className = '',
  iconClassName = 'h-[17px] w-[17px]',
  textClassName = 'ml-1.5 truncate',
}) {
  const count = Math.max(0, Number(likeCount || 0))

  const items = Array.isArray(summary)
    ? summary
        .map((item) => {
          const type =
            typeof item === 'string'
              ? item
              : item?.type

          const reaction = getReactionMeta(type)

          if (
            !reaction ||
            Number(item?.count ?? 1) <= 0
          ) {
            return null
          }

          return {
            type: reaction.type,
            src: reaction.src,
          }
        })
        .filter(Boolean)
        .slice(0, 3)
    : []

  const fallbackReaction =
    getReactionMeta(myReaction) ||
    getReactionMeta(DEFAULT_REACTION_TYPE)

  const visibleItems =
    items.length > 0
      ? items
      : count > 0 && fallbackReaction
        ? [
            {
              type: fallbackReaction.type,
              src: fallbackReaction.src,
            },
          ]
        : []

  if (!count && !showZero) {
    return null
  }

  const label = myReaction
    ? count > 1
      ? `You + ${formatReactionCount(count - 1)}`
      : 'You'
    : formatReactionCount(count)

  return (
    <span
      className={`flex min-w-0 items-center ${className}`}
    >
      {visibleItems.length > 0 ? (
        <span className="flex items-center -space-x-1">
          {visibleItems.map((item, index) => (
            <img
              key={`${item.type}-${index}`}
              src={item.src}
              alt=""
              aria-hidden="true"
              className={`${iconClassName} rounded-full bg-white ring-1 ring-white`}
            />
          ))}
        </span>
      ) : null}

      <span
        className={
          visibleItems.length > 0
            ? textClassName
            : textClassName.replace(
                /(^|\s)ml-[^\s]+/g,
                ''
              )
        }
      >
        {label}
      </span>
    </span>
  )
}

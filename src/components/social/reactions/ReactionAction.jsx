import ReactionPicker from './ReactionPicker'
import {
  DEFAULT_REACTION_TYPE,
  formatReactionCount,
  getReactionMeta,
} from './reactionConfig'
import useReactionInteraction from './useReactionInteraction'

export default function ReactionAction({
  reactionType = '',
  count = 0,
  busy = false,
  disabled = false,
  onReact,
  onCountClick,
  countInAction = false,
  showCount = true,
  showBusySpinner = false,
  formatCount = formatReactionCount,
  pickerAlign = 'left',
  className = '',
  buttonClassName = '',
  countClassName = '',
  pickerClassName = '',
  idleLabel = 'Like',
}) {
  const activeReaction =
    getReactionMeta(reactionType)

  const interaction =
    useReactionInteraction({
      busy,
      disabled,
      onReact,
      defaultReactionType:
        DEFAULT_REACTION_TYPE,
    })

  const displayCount =
    typeof formatCount === 'function'
      ? formatCount(count)
      : String(count || 0)

  function stopEvent(event) {
    event?.stopPropagation?.()
  }

  function handlePointerDown(event) {
    stopEvent(event)
    interaction.startReactionPress(
      event
    )
  }

  function handlePointerUp(event) {
    stopEvent(event)
    interaction.endReactionPress()
  }

  function handlePointerLeave() {
    interaction.cancelReactionPress()
  }

  function handlePointerCancel(
    event
  ) {
    stopEvent(event)
    interaction.cancelReactionPress()
  }

  function handleKeyDown(event) {
    if (
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    interaction.quickReact()
  }

  const actionContent = (
    <>
      {showBusySpinner &&
      busy ? (
        <i className="fa-solid fa-circle-notch animate-spin text-[15px]" />
      ) : activeReaction ? (
        <img
          src={activeReaction.src}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="h-[17px] w-[17px] select-none object-contain"
        />
      ) : (
        <i className="fa-regular fa-heart text-[15px]" />
      )}

      {showCount &&
      countInAction ? (
        <span>{displayCount}</span>
      ) : null}
    </>
  )

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 ${className}`}
      style={{
        color:
          activeReaction?.text ||
          undefined,
      }}
    >
      <ReactionPicker
        open={
          interaction.reactionPickerOpen
        }
        activeType={
          activeReaction?.type || ''
        }
        previewType={
          interaction.previewReactionType
        }
        busy={busy}
        disabled={disabled}
        align={pickerAlign}
        className={pickerClassName}
        onClose={
          interaction.closeReactionPicker
        }
        onSelect={
          interaction.selectReaction
        }
      />

      <button
        type="button"
        disabled={
          busy || disabled
        }
        onPointerDown={
          handlePointerDown
        }
        onPointerUp={handlePointerUp}
        onPointerLeave={
          handlePointerLeave
        }
        onPointerCancel={
          handlePointerCancel
        }
        onContextMenu={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onKeyDown={handleKeyDown}
        className={`touch-none inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-60 ${buttonClassName}`}
        aria-label={
          activeReaction
            ? `${activeReaction.label} reaction`
            : idleLabel
        }
      >
        {actionContent}
      </button>

      {showCount &&
      !countInAction ? (
        onCountClick ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              interaction.closeReactionPicker()
              onCountClick()
            }}
            className={`active:scale-95 ${countClassName}`}
            aria-label="View people who reacted"
          >
            {displayCount}
          </button>
        ) : (
          <span
            className={
              countClassName
            }
          >
            {displayCount}
          </span>
        )
      ) : null}
    </div>
  )
}

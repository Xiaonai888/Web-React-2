import { useRef } from 'react'
import ReactionPicker from './ReactionPicker'
import {
  DEFAULT_REACTION_TYPE,
  formatReactionCount,
  getReactionMeta,
} from './reactionConfig'
import useReactionInteraction from './useReactionInteraction'
import { useDisplayTranslation } from '../../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../../i18n/registerTranslations'

registerTranslationNamespace('reactionAction', {
  en: {
    like: 'Like',
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
    reactionAria: '{{label}} reaction',
    viewReacted: 'View people who reacted',
  },
  km: {
    like: 'ចូលចិត្ត',
    love: 'ស្រឡាញ់',
    haha: 'សើច',
    wow: 'ភ្ញាក់ផ្អើល',
    sad: 'សោកសៅ',
    angry: 'ខឹង',
    support: 'គាំទ្រ',
    touched: 'រំភើបចិត្ត',
    reactionAria: 'ប្រតិកម្ម {{label}}',
    viewReacted: 'មើលអ្នកដែលបានបញ្ចេញប្រតិកម្ម',
  },
  zh: {
    like: '赞',
    love: '爱心',
    haha: '哈哈',
    wow: '哇',
    sad: '难过',
    angry: '生气',
    support: '支持',
    touched: '感动',
    reactionAria: '{{label}} 反应',
    viewReacted: '查看已回应的人',
  },
  ja: {
    like: 'いいね',
    love: '大好き',
    haha: '笑',
    wow: 'すごい',
    sad: '悲しい',
    angry: '怒り',
    support: '応援',
    touched: '感動',
    reactionAria: '{{label}} リアクション',
    viewReacted: 'リアクションした人を見る',
  },
  ko: {
    like: '좋아요',
    love: '사랑해요',
    haha: '웃겨요',
    wow: '놀라워요',
    sad: '슬퍼요',
    angry: '화나요',
    support: '응원해요',
    touched: '감동이에요',
    reactionAria: '{{label}} 반응',
    viewReacted: '반응한 사람 보기',
  },
})

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
  idleIcon = null,
}) {
  const { t } = useDisplayTranslation()
  const anchorRef = useRef(null)
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

  const translatedIdleLabel =
    idleLabel === 'Like'
      ? t('reactionAction.like')
      : idleLabel

  const translatedReactionLabel =
    activeReaction
      ? t(
          `reactionAction.${activeReaction.type}`,
          {
            defaultValue:
              activeReaction.label,
          }
        )
      : ''

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
        idleIcon || <i className="fa-regular fa-heart text-[15px]" />
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
        anchorRef={anchorRef}
        open={
          interaction.reactionPickerOpen
        }
        activeType={
          activeReaction?.type || ''
        }
        previewType={
          interaction.previewReactionType
        }
        isSliding={
          interaction.isSlidingReaction
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
        ref={anchorRef}
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
            ? t(
                'reactionAction.reactionAria',
                {
                  label:
                    translatedReactionLabel,
                }
              )
            : translatedIdleLabel
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
            aria-label={t(
              'reactionAction.viewReacted'
            )}
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

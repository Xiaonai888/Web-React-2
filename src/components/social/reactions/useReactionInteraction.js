import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  DEFAULT_REACTION_TYPE,
  REACTION_LONG_PRESS_MS,
  isReactionType,
} from './reactionConfig'

export default function useReactionInteraction({
  busy = false,
  disabled = false,
  onReact,
  defaultReactionType = DEFAULT_REACTION_TYPE,
  longPressMs = REACTION_LONG_PRESS_MS,
} = {}) {
  const [
    reactionPickerOpen,
    setReactionPickerOpen,
  ] = useState(false)

  const pressTimerRef = useRef(null)
  const longPressOpenedRef =
    useRef(false)

  const blocked =
    Boolean(busy) || Boolean(disabled)

  const clearPressTimer =
    useCallback(() => {
      if (!pressTimerRef.current) {
        return
      }

      window.clearTimeout(
        pressTimerRef.current
      )
      pressTimerRef.current = null
    }, [])

  const closeReactionPicker =
    useCallback(() => {
      clearPressTimer()
      longPressOpenedRef.current = false
      setReactionPickerOpen(false)
    }, [clearPressTimer])

  const openReactionPicker =
    useCallback(() => {
      if (blocked) return

      clearPressTimer()
      longPressOpenedRef.current = true
      setReactionPickerOpen(true)
    }, [blocked, clearPressTimer])

  const selectReaction =
    useCallback(
      async (reactionType) => {
        if (blocked) {
          return false
        }

        const safeType =
          isReactionType(reactionType)
            ? String(
                reactionType
              ).toLowerCase()
            : defaultReactionType

        clearPressTimer()
        longPressOpenedRef.current =
          false
        setReactionPickerOpen(false)

        if (
          typeof onReact !== 'function'
        ) {
          return false
        }

        await onReact(safeType)
        return true
      },
      [
        blocked,
        clearPressTimer,
        defaultReactionType,
        onReact,
      ]
    )

  const quickReact = useCallback(
    () =>
      selectReaction(
        defaultReactionType
      ),
    [
      defaultReactionType,
      selectReaction,
    ]
  )

  const startReactionPress =
    useCallback(
      (event) => {
        if (blocked) return

        if (
          event?.pointerType ===
            'mouse' &&
          event?.button !== 0
        ) {
          return
        }

        clearPressTimer()
        longPressOpenedRef.current =
          false

        pressTimerRef.current =
          window.setTimeout(() => {
            pressTimerRef.current = null
            longPressOpenedRef.current =
              true
            setReactionPickerOpen(true)
          }, longPressMs)
      },
      [
        blocked,
        clearPressTimer,
        longPressMs,
      ]
    )

  const endReactionPress =
    useCallback(() => {
      if (blocked) {
        clearPressTimer()
        return
      }

      if (pressTimerRef.current) {
        clearPressTimer()
        quickReact()
        return
      }

      if (
        longPressOpenedRef.current
      ) {
        longPressOpenedRef.current =
          false
      }
    }, [
      blocked,
      clearPressTimer,
      quickReact,
    ])

  const cancelReactionPress =
    useCallback(() => {
      clearPressTimer()
    }, [clearPressTimer])

  useEffect(() => {
    if (!blocked) return

    closeReactionPicker()
  }, [
    blocked,
    closeReactionPicker,
  ])

  useEffect(() => {
    return () => {
      clearPressTimer()
    }
  }, [clearPressTimer])

  return {
    reactionPickerOpen,
    openReactionPicker,
    closeReactionPicker,
    selectReaction,
    quickReact,
    startReactionPress,
    endReactionPress,
    cancelReactionPress,
  }
}

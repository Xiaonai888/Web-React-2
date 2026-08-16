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
  const [
    previewReactionType,
    setPreviewReactionType,
  ] = useState('')

  const pressTimerRef = useRef(null)
  const longPressOpenedRef =
    useRef(false)
  const pickerOpenRef = useRef(false)
  const activePointerIdRef =
    useRef(null)
  const previewReactionTypeRef =
    useRef('')

  const blocked =
    Boolean(busy) || Boolean(disabled)

  const setPickerOpen = useCallback(
    (value) => {
      const nextValue = Boolean(value)
      pickerOpenRef.current = nextValue
      setReactionPickerOpen(nextValue)
    },
    []
  )

  const setPreviewType = useCallback(
    (value) => {
      const nextType =
        isReactionType(value)
          ? String(value).toLowerCase()
          : ''

      if (
        previewReactionTypeRef.current ===
        nextType
      ) {
        return
      }

      previewReactionTypeRef.current =
        nextType
      setPreviewReactionType(nextType)
    },
    []
  )

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

  const resetPointerTracking =
    useCallback(() => {
      activePointerIdRef.current = null
      setPreviewType('')
    }, [setPreviewType])

  const closeReactionPicker =
    useCallback(() => {
      clearPressTimer()
      longPressOpenedRef.current = false
      resetPointerTracking()
      setPickerOpen(false)
    }, [
      clearPressTimer,
      resetPointerTracking,
      setPickerOpen,
    ])

  const openReactionPicker =
    useCallback(() => {
      if (blocked) return

      clearPressTimer()
      longPressOpenedRef.current = true
      resetPointerTracking()
      setPickerOpen(true)
    }, [
      blocked,
      clearPressTimer,
      resetPointerTracking,
      setPickerOpen,
    ])

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
        resetPointerTracking()
        setPickerOpen(false)

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
        resetPointerTracking,
        setPickerOpen,
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
        setPreviewType('')

        activePointerIdRef.current =
          Number.isFinite(
            event?.pointerId
          )
            ? event.pointerId
            : null

        pressTimerRef.current =
          window.setTimeout(() => {
            pressTimerRef.current = null
            longPressOpenedRef.current =
              true
            setPickerOpen(true)
          }, longPressMs)
      },
      [
        blocked,
        clearPressTimer,
        longPressMs,
        setPickerOpen,
        setPreviewType,
      ]
    )

  const endReactionPress =
    useCallback(() => {
      if (blocked) {
        clearPressTimer()
        resetPointerTracking()
        return
      }

      if (pressTimerRef.current) {
        clearPressTimer()
        resetPointerTracking()
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
      resetPointerTracking,
    ])

  const cancelReactionPress =
    useCallback(() => {
      clearPressTimer()

      if (!pickerOpenRef.current) {
        resetPointerTracking()
      }
    }, [
      clearPressTimer,
      resetPointerTracking,
    ])

  useEffect(() => {
    if (!reactionPickerOpen) {
      return undefined
    }

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

      const reactionType =
        reactionElement?.getAttribute?.(
          'data-shadow-reaction-type'
        ) || ''

      return isReactionType(reactionType)
        ? String(
            reactionType
          ).toLowerCase()
        : ''
    }

    function handlePointerMove(event) {
      const pointerId =
        activePointerIdRef.current

      if (
        pointerId === null ||
        event.pointerId !== pointerId
      ) {
        return
      }

      setPreviewType(
        getReactionTypeAtPoint(
          event.clientX,
          event.clientY
        )
      )
    }

    function handlePointerUp(event) {
      const pointerId =
        activePointerIdRef.current

      if (
        pointerId === null ||
        event.pointerId !== pointerId
      ) {
        return
      }

      const reactionType =
        getReactionTypeAtPoint(
          event.clientX,
          event.clientY
        )

      activePointerIdRef.current = null
      setPreviewType('')
      longPressOpenedRef.current = false

      if (reactionType) {
        void selectReaction(
          reactionType
        )
      }
    }

    function handlePointerCancel(event) {
      const pointerId =
        activePointerIdRef.current

      if (
        pointerId === null ||
        event.pointerId !== pointerId
      ) {
        return
      }

      closeReactionPicker()
    }

    document.addEventListener(
      'pointermove',
      handlePointerMove
    )
    document.addEventListener(
      'pointerup',
      handlePointerUp
    )
    document.addEventListener(
      'pointercancel',
      handlePointerCancel
    )

    return () => {
      document.removeEventListener(
        'pointermove',
        handlePointerMove
      )
      document.removeEventListener(
        'pointerup',
        handlePointerUp
      )
      document.removeEventListener(
        'pointercancel',
        handlePointerCancel
      )
    }
  }, [
    closeReactionPicker,
    reactionPickerOpen,
    selectReaction,
    setPreviewType,
  ])

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
    previewReactionType,
    openReactionPicker,
    closeReactionPicker,
    selectReaction,
    quickReact,
    startReactionPress,
    endReactionPress,
    cancelReactionPress,
  }
}

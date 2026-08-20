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
  const [
    isSlidingReaction,
    setIsSlidingReaction,
  ] = useState(false)

  const pressTimerRef = useRef(null)
  const longPressOpenedRef =
    useRef(false)
  const pickerOpenRef = useRef(false)
  const activePointerIdRef =
    useRef(null)
  const previewReactionTypeRef =
    useRef('')
  const slidingReactionRef =
    useRef(false)
  const pointerStartRef = useRef({
    x: 0,
    y: 0,
  })

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

  const setSliding = useCallback(
    (value) => {
      const nextValue = Boolean(value)

      if (
        slidingReactionRef.current ===
        nextValue
      ) {
        return
      }

      slidingReactionRef.current =
        nextValue
      setIsSlidingReaction(nextValue)
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
      setSliding(false)
    }, [
      setPreviewType,
      setSliding,
    ])

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
        setSliding(false)

        activePointerIdRef.current =
          Number.isFinite(
            event?.pointerId
          )
            ? event.pointerId
            : null

        pointerStartRef.current = {
          x: Number(
            event?.clientX || 0
          ),
          y: Number(
            event?.clientY || 0
          ),
        }

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
        setSliding,
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
      const directElement =
        document.elementFromPoint(
          clientX,
          clientY
        )

      const directReaction =
        directElement?.closest?.(
          '[data-shadow-reaction-type]'
        )

      const directType =
        directReaction?.getAttribute?.(
          'data-shadow-reaction-type'
        ) || ''

      if (isReactionType(directType)) {
        return String(
          directType
        ).toLowerCase()
      }

      const reactionElements =
        Array.from(
          document.querySelectorAll(
            '[data-shadow-reaction-type]'
          )
        )

      if (!reactionElements.length) {
        return ''
      }

      const candidates =
        reactionElements
          .map((element) => {
            const rect =
              element.getBoundingClientRect()
            const type =
              element.getAttribute(
                'data-shadow-reaction-type'
              ) || ''

            return {
              type,
              rect,
              centerX:
                rect.left +
                rect.width / 2,
            }
          })
          .filter((item) =>
            isReactionType(item.type)
          )

      if (!candidates.length) {
        return ''
      }

      const minLeft = Math.min(
        ...candidates.map(
          (item) => item.rect.left
        )
      )
      const maxRight = Math.max(
        ...candidates.map(
          (item) => item.rect.right
        )
      )
      const minTop = Math.min(
        ...candidates.map(
          (item) => item.rect.top
        )
      )
      const maxBottom = Math.max(
        ...candidates.map(
          (item) => item.rect.bottom
        )
      )

      if (
        clientX < minLeft - 12 ||
        clientX > maxRight + 12 ||
        clientY < minTop - 52 ||
        clientY > maxBottom + 52
      ) {
        return ''
      }

      const nearest =
        candidates.reduce(
          (best, item) => {
            const distance =
              Math.abs(
                item.centerX - clientX
              )

            if (
              !best ||
              distance <
                best.distance
            ) {
              return {
                type: item.type,
                distance,
              }
            }

            return best
          },
          null
        )

      return nearest?.type || ''
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

      const distanceX =
        event.clientX -
        pointerStartRef.current.x
      const distanceY =
        event.clientY -
        pointerStartRef.current.y

      if (
        Math.hypot(
          distanceX,
          distanceY
        ) > 4
      ) {
        setSliding(true)
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
        ) ||
        previewReactionTypeRef.current

      activePointerIdRef.current = null
      longPressOpenedRef.current = false
      setSliding(false)

      if (reactionType) {
  void selectReaction(reactionType)
  return
}

closeReactionPicker()

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
      handlePointerMove,
      {
        passive: false,
      }
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
    setSliding,
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
    isSlidingReaction,
    openReactionPicker,
    closeReactionPicker,
    selectReaction,
    quickReact,
    startReactionPress,
    endReactionPress,
    cancelReactionPress,
  }
}

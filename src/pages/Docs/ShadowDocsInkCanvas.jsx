import { useCallback, useEffect, useRef } from 'react'
import {
  createShadowDocsInkStroke,
  paintShadowDocsInk,
  removeShadowDocsInkAtPoint,
  shadowDocsInkPointFromEvent,
} from './ShadowDocsInkEngine'
import './ShadowDocsDraw.css'

export default function ShadowDocsInkCanvas({
  strokes = [],
  onChange,
  enabled = false,
  tool = 'pen',
  color = '#111111',
  thickness = 2,
  drawWithTouch = false,
  disabled = false,
}) {
  const canvasRef = useRef(null)
  const strokesRef = useRef(strokes)
  const draftRef = useRef(null)
  const pointerRef = useRef(null)
  const frameRef = useRef(0)
  const dimensionsRef = useRef([0, 0])
  const gestureToolRef = useRef(null)
  const eraseSnapshotRef = useRef(null)
  const eraseDirtyRef = useRef(false)
  if (!eraseDirtyRef.current) strokesRef.current = strokes

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return
    const [width, height] = dimensionsRef.current
    if (width <= 0 || height <= 0) return
    const scaleX = canvas.width / width
    const scaleY = canvas.height / height
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(scaleX, 0, 0, scaleY, 0, 0)
    paintShadowDocsInk(context, strokesRef.current, width, height)
    if (draftRef.current) paintShadowDocsInk(context, [draftRef.current], width, height)
  }, [])

  const scheduleRedraw = useCallback(() => {
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      redraw()
    })
  }, [redraw])

  useEffect(() => { scheduleRedraw() }, [strokes, scheduleRedraw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const width = rect.width
      const height = rect.height
      const ratio = Math.max(0.1, Math.min(2, window.devicePixelRatio || 1, Math.sqrt(6_000_000 / (width * height))))
      const nextWidth = Math.max(1, Math.round(width * ratio))
      const nextHeight = Math.max(1, Math.round(height * ratio))
      if (canvas.width !== nextWidth) canvas.width = nextWidth
      if (canvas.height !== nextHeight) canvas.height = nextHeight
      dimensionsRef.current = [width, height]
      scheduleRedraw()
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(canvas)
    window.addEventListener('resize', resize)
    resize()
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [scheduleRedraw])

  useEffect(() => {
    if (enabled && !disabled) return
    const activePointer = pointerRef.current
    if (activePointer === null) return
    pointerRef.current = null
    draftRef.current = null
    if (eraseDirtyRef.current) strokesRef.current = eraseSnapshotRef.current || strokesRef.current
    eraseDirtyRef.current = false
    eraseSnapshotRef.current = null
    gestureToolRef.current = null
    const canvas = canvasRef.current
    try {
      if (canvas?.hasPointerCapture?.(activePointer)) canvas.releasePointerCapture(activePointer)
    } catch {}
    scheduleRedraw()
  }, [enabled, disabled, scheduleRedraw])

  function pointerAllowed(event) {
    return enabled && !disabled && event.isPrimary && (event.pointerType !== 'touch' || drawWithTouch) && (event.pointerType !== 'mouse' || event.button === 0)
  }

  function applyErase(point) {
    const [width, height] = dimensionsRef.current
    const next = removeShadowDocsInkAtPoint(strokesRef.current, point, width, height, Math.max(10, Number(thickness) * 2))
    if (next.length !== strokesRef.current.length) {
      strokesRef.current = next
      eraseDirtyRef.current = true
      scheduleRedraw()
    }
  }

  function handlePointerDown(event) {
    if (!pointerAllowed(event) || pointerRef.current !== null) return
    const point = shadowDocsInkPointFromEvent(event, event.currentTarget.getBoundingClientRect())
    pointerRef.current = event.pointerId
    gestureToolRef.current = tool
    eraseSnapshotRef.current = tool === 'eraser' ? strokesRef.current : null
    eraseDirtyRef.current = false
    try { event.currentTarget.setPointerCapture?.(event.pointerId) } catch {}
    event.preventDefault()
    if (gestureToolRef.current === 'eraser') applyErase(point)
    else {
      draftRef.current = createShadowDocsInkStroke({ tool, color, width: thickness, points: [point] })
      scheduleRedraw()
    }
  }

  function handlePointerMove(event) {
    if (pointerRef.current !== event.pointerId) return
    event.preventDefault()
    const point = shadowDocsInkPointFromEvent(event, event.currentTarget.getBoundingClientRect())
    if (gestureToolRef.current === 'eraser') applyErase(point)
    else if (draftRef.current && draftRef.current.points.length < 2500) {
      const points = draftRef.current.points
      const last = points[points.length - 1]
      const [width, height] = dimensionsRef.current
      if (Math.hypot((last[0] - point[0]) * width, (last[1] - point[1]) * height) >= 0.8) {
        points.push(point)
        scheduleRedraw()
      }
    }
  }

  function finishPointer(event, cancelled = false) {
    if (pointerRef.current !== event.pointerId) return
    pointerRef.current = null
    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {}
    if (gestureToolRef.current === 'eraser' && eraseDirtyRef.current) {
      if (cancelled) strokesRef.current = eraseSnapshotRef.current || strokesRef.current
      else onChange?.(strokesRef.current)
    } else if (draftRef.current && !cancelled) {
      const next = [...strokesRef.current, draftRef.current].slice(-2000)
      strokesRef.current = next
      onChange?.(next)
    }
    draftRef.current = null
    eraseDirtyRef.current = false
    eraseSnapshotRef.current = null
    gestureToolRef.current = null
    scheduleRedraw()
  }

  return <canvas
    ref={canvasRef}
    className={`sd-ink-canvas ${enabled && !disabled ? 'is-enabled' : ''} ${drawWithTouch ? 'is-touch-enabled' : ''}`}
    aria-label="Document drawing layer"
    aria-hidden={!enabled}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={event => finishPointer(event)}
    onPointerCancel={event => finishPointer(event, true)}
    onPointerLeave={event => {
      if (pointerRef.current === event.pointerId && !event.currentTarget.hasPointerCapture?.(event.pointerId)) finishPointer(event)
    }}
    onLostPointerCapture={event => finishPointer(event, true)}
  />
}
